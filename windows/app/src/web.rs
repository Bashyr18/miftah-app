//! The page: WebView2 set up for a family (no browser menus, no downloads, no way out to the web except a link opened
//! in the family's own browser), the lessons served from inside this program, and files dropped on the window.
use std::path::{Component, Path, PathBuf};
use std::rc::Rc;
use std::sync::OnceLock;

use webview2_com::Microsoft::Web::WebView2::Win32::*;
use webview2_com::*;
use windows::core::{Interface, PWSTR};
use windows::core::BOOL;
use windows::Win32::System::Com::*;
use windows::Win32::UI::Shell::*;
use windows::Win32::UI::WindowsAndMessaging::*;

use miftah_common::{self as mc, h, js, take_pwstr, Ui};

use crate::{app, bridge, store, App, ORIGIN};

static SHIM: &str = include_str!("../../shim.js");

fn bridge_token() -> &'static str {
    static TOK: OnceLock<String> = OnceLock::new();
    TOK.get_or_init(|| {
        let mut b = [0u8; 32];
        getrandom::getrandom(&mut b).expect("OS RNG unavailable");
        b.iter().map(|x| format!("{:02x}", x)).collect()
    })
}
fn is_app_page(u: &str) -> bool {
    let base = u.split(['?', '#']).next().unwrap_or("");
    base == ORIGIN || base == format!("{}/", ORIGIN) || base == format!("{}/index.html", ORIGIN)
}

fn s(f: impl FnOnce(&mut PWSTR) -> windows::core::Result<()>) -> String {
    let mut p = PWSTR::null();
    if f(&mut p).is_err() { return String::new(); }
    unsafe { take_pwstr(p) }
}
fn host_of(u: &str) -> String {
    let rest = u.split_once("://").map(|x| x.1).unwrap_or("");
    rest.split(['/', '?', '#']).next().unwrap_or("").rsplit('@').next().unwrap_or("").split(':').next().unwrap_or("").to_lowercase()
}
fn video_host(hh: &str) -> bool {
    hh == "www.youtube-nocookie.com" || hh == "youtube-nocookie.com" || hh.ends_with(".youtube.com") || hh.ends_with(".ytimg.com") || hh.ends_with(".googlevideo.com") || hh.ends_with(".ggpht.com") || hh == "www.gstatic.com" || hh == "jnn-pa.googleapis.com"
}
fn sim_host(hh: &str) -> bool { matches!(hh, "cdn.tailwindcss.com" | "cdnjs.cloudflare.com" | "cdn.jsdelivr.net" | "unpkg.com" | "fonts.googleapis.com" | "fonts.gstatic.com") }
fn allow_outside(u: &str) -> bool {
    if u.contains('\\') || u.contains('\0') { return false; }
    let scheme = u.split(':').next().unwrap_or("").to_lowercase();
    if !matches!(scheme.as_str(), "https" | "http" | "mailto") { return false; }
    if scheme == "mailto" { return true; }
    let hh = host_of(u);
    !(video_host(&hh) || hh == "youtube.com" || hh == "youtu.be" || hh.ends_with(".youtu.be"))
}
/* a link out of the app opens in the family's own browser; a video never leads out to its site */
pub fn outside(u: &str) {
    if allow_outside(u) { mc::shell_open(u); }
}

pub fn init(a: &Rc<App>) -> std::result::Result<(), String> {
    let mut args = "--autoplay-policy=no-user-gesture-required --disable-features=msSmartScreenProtection,ElasticOverscroll".to_string();
    let dbg = mc::env("MIFTAH_DEBUG_PORT").filter(|p| p.parse::<u16>().ok().filter(|&n| n > 0).is_some());
    if let Some(p) = &dbg { args += &format!(" --remote-debugging-port={}", p); }
    let w = Rc::new(mc::create_web(a.hwnd, &store::root().join("webview").to_string_lossy(), &args)?);
    *a.web.borrow_mut() = Some(w.clone());
    a.title_bar(&crate::theme(), false);
    let v = &w.view;
    unsafe {
        let st = v.Settings().map_err(|e| e.to_string())?;
        let _ = st.SetAreDevToolsEnabled(dbg.is_some());
        let _ = st.SetAreDefaultContextMenusEnabled(false);
        let _ = st.SetIsStatusBarEnabled(false);
        let _ = st.SetIsZoomControlEnabled(true);
        let _ = st.SetAreHostObjectsAllowed(false);
        let _ = st.SetIsWebMessageEnabled(true);
        let _ = st.SetAreDefaultScriptDialogsEnabled(true);
        if let Ok(s3) = st.cast::<ICoreWebView2Settings3>() { let _ = s3.SetAreBrowserAcceleratorKeysEnabled(false); }
        if let Ok(s4) = st.cast::<ICoreWebView2Settings4>() { let _ = s4.SetIsGeneralAutofillEnabled(false); let _ = s4.SetIsPasswordAutosaveEnabled(false); }
        if let Ok(s5) = st.cast::<ICoreWebView2Settings5>() { let _ = s5.SetIsPinchZoomEnabled(true); }
        if let Ok(s6) = st.cast::<ICoreWebView2Settings6>() { let _ = s6.SetIsSwipeNavigationEnabled(false); }

        if let Some(z) = store::get("zoom").and_then(|z| z.as_f64()) { let _ = w.controller.SetZoomFactor(z.clamp(0.5, 2.5)); }
        let mut t = Default::default();
        let _ = w.controller.add_ZoomFactorChanged(&ZoomFactorChangedEventHandler::create(Box::new(|c, _| {
            if let Some(c) = c { let mut z = 1.0; let _ = c.ZoomFactor(&mut z); store::set("zoom", serde_json::json!(z)); }
            Ok(())
        })), &mut t);

        let shim = SHIM.replace("__MIFTAH_TOKEN__", bridge_token());
        mc::add_script(v, &shim);
        let _ = v.AddWebResourceRequestedFilter(&h(&format!("{}/*", ORIGIN)), COREWEBVIEW2_WEB_RESOURCE_CONTEXT_ALL);
        let env = w.env.clone();
        let _ = v.add_WebResourceRequested(&WebResourceRequestedEventHandler::create(Box::new(move |_, args| {
            if let Some(args) = args { serve(&env, &args); }
            Ok(())
        })), &mut t);
        let _ = v.add_NavigationStarting(&NavigationStartingEventHandler::create(Box::new(|_, args| {
            if let Some(args) = args {
                let u = s(|p| args.Uri(p));
                if !is_app_page(&u) { let _ = args.SetCancel(true); if !u.starts_with(&format!("{}/", ORIGIN)) { outside(&u); } }
            }
            Ok(())
        })), &mut t);
        let _ = v.add_FrameNavigationStarting(&NavigationStartingEventHandler::create(Box::new(|_, args| {
            if let Some(args) = args {
                let u = s(|p| args.Uri(p));
                let scheme = u.split(':').next().unwrap_or("").to_lowercase();
                let hh = host_of(&u);
                let ok = hh == crate::HOST || (scheme == "https" && (video_host(&hh) || sim_host(&hh))) || matches!(scheme.as_str(), "about" | "blob" | "data");
                if !ok { let _ = args.SetCancel(true); }
            }
            Ok(())
        })), &mut t);
        let _ = v.add_NewWindowRequested(&NewWindowRequestedEventHandler::create(Box::new(|_, args| {
            if let Some(args) = args { let _ = args.SetHandled(true); let u = s(|p| args.Uri(p)); outside(&u); }
            Ok(())
        })), &mut t);
        let _ = v.add_PermissionRequested(&PermissionRequestedEventHandler::create(Box::new(|_, args| {
            if let Some(args) = args {
                let u = s(|p| args.Uri(p));
                let mut k = COREWEBVIEW2_PERMISSION_KIND::default();
                let _ = args.PermissionKind(&mut k);
                let mine = is_app_page(&u);
                let allow = mine && (k == COREWEBVIEW2_PERMISSION_KIND_MICROPHONE || k == COREWEBVIEW2_PERMISSION_KIND_AUTOPLAY || k == COREWEBVIEW2_PERMISSION_KIND_CLIPBOARD_READ);
                let _ = args.SetState(if allow { COREWEBVIEW2_PERMISSION_STATE_ALLOW } else { COREWEBVIEW2_PERMISSION_STATE_DENY });
            }
            Ok(())
        })), &mut t);
        if let Ok(v4) = v.cast::<ICoreWebView2_4>() {
            let _ = v4.add_DownloadStarting(&DownloadStartingEventHandler::create(Box::new(|_, args| { if let Some(a) = args { let _ = a.SetCancel(true); } Ok(()) })), &mut t);
        }
        let _ = v.add_DocumentTitleChanged(&DocumentTitleChangedEventHandler::create(Box::new(|sender, _| {
            if let (Some(sv), Some(a)) = (sender, app()) {
                let ti = s(|p| sv.DocumentTitle(p));
                let ti = if ti.is_empty() || ti.starts_with("http") { mc::APP_NAME.to_string() } else { ti };
                let _ = SetWindowTextW(a.hwnd, &h(&ti));
            }
            Ok(())
        })), &mut t);
        let _ = v.add_ContainsFullScreenElementChanged(&ContainsFullScreenElementChangedEventHandler::create(Box::new(|sender, _| {
            if let (Some(sv), Some(a)) = (sender, app()) {
                let mut on = BOOL(0); let _ = sv.ContainsFullScreenElement(&mut on);
                let on = on.as_bool();
                if !on && a.focus_lock.get() { return Ok(()); }
                mc::later(move || if let Some(a) = app() { if on || !a.focus_lock.get() { a.full_screen(on); } });
            }
            Ok(())
        })), &mut t);
        let _ = v.add_ProcessFailed(&ProcessFailedEventHandler::create(Box::new(|sender, args| {
            if let (Some(sv), Some(args)) = (sender, args) {
                let mut k = COREWEBVIEW2_PROCESS_FAILED_KIND::default();
                let _ = args.ProcessFailedKind(&mut k);
                if k == COREWEBVIEW2_PROCESS_FAILED_KIND_RENDER_PROCESS_EXITED || k == COREWEBVIEW2_PROCESS_FAILED_KIND_RENDER_PROCESS_UNRESPONSIVE { let _ = sv.Reload(); }
            }
            Ok(())
        })), &mut t);
        let _ = v.add_WebMessageReceived(&WebMessageReceivedEventHandler::create(Box::new(|_, args| {
            if let Some(args) = args { message(&args); }
            Ok(())
        })), &mut t);
        let _ = v.add_NavigationCompleted(&NavigationCompletedEventHandler::create(Box::new(|_, _| {
            mc::later(|| if let Some(a) = app() { a.on_ready() });
            Ok(())
        })), &mut t);
        let _ = v.Navigate(&h(&format!("{}/index.html", ORIGIN)));
    }
    Ok(())
}

/* ---------- serving the lessons, the family's files and the bridge ---------- */
fn header(req: &ICoreWebView2WebResourceRequest, name: &str) -> Option<String> {
    unsafe {
        let hs = req.Headers().ok()?;
        let mut has = BOOL(0);
        hs.Contains(&h(name), &mut has).ok()?;
        if !has.as_bool() { return None; }
        let mut p = PWSTR::null();
        hs.GetHeader(&h(name), &mut p).ok()?;
        Some(take_pwstr(p))
    }
}
const MAX_BRIDGE_BODY: usize = 64 * 1024 * 1024;
fn body(req: &ICoreWebView2WebResourceRequest) -> Vec<u8> {
    let mut out = vec![];
    unsafe {
        let Ok(st) = req.Content() else { return out };
        let mut buf = vec![0u8; 1 << 16];
        loop {
            let mut n = 0u32;
            let hr = st.Read(buf.as_mut_ptr() as _, buf.len() as u32, Some(&mut n));
            if n > 0 {
                let take = (n as usize).min(MAX_BRIDGE_BODY.saturating_sub(out.len()));
                out.extend_from_slice(&buf[..take]);
                if out.len() >= MAX_BRIDGE_BODY { break; }
            }
            if hr.is_err() || n == 0 { break; }
        }
    }
    out
}
fn respond(env: &ICoreWebView2Environment, stream: Option<IStream>, status: i32, reason: &str, headers: &str) -> Option<ICoreWebView2WebResourceResponse> {
    unsafe { env.CreateWebResourceResponse(stream.as_ref(), status, &h(reason), &h(headers)).ok() }
}
pub fn mem_stream(b: &[u8]) -> Option<IStream> { unsafe { SHCreateMemStream(Some(b)) } }
fn not_found(env: &ICoreWebView2Environment) -> Option<ICoreWebView2WebResourceResponse> { respond(env, None, 404, "Not Found", "Content-Type: text/plain") }

/* resolves a URL path strictly inside `base`, rejecting backslashes, drive letters, UNC paths, NULs and symlinks escaping `base` */
fn safe_app_file(base: &Path, decoded_path: &str) -> Option<PathBuf> {
    if decoded_path.contains('\\') || decoded_path.contains(':') || decoded_path.contains('\0') || decoded_path.contains("..") {
        return None;
    }
    let rel_str = decoded_path.trim_start_matches('/');
    if rel_str.is_empty() { return None; }
    let mut rel = PathBuf::new();
    for seg in rel_str.split('/') {
        if seg.is_empty() || seg == "." || seg == ".." { return None; }
        let p = Path::new(seg);
        let mut comps = p.components();
        match (comps.next(), comps.next()) {
            (Some(Component::Normal(c)), None) => rel.push(c),
            _ => return None,
        }
    }
    let cand = base.join(&rel);
    let canon_base = std::fs::canonicalize(base).ok()?;
    let canon_cand = std::fs::canonicalize(&cand).ok()?;
    if canon_cand.starts_with(&canon_base) && canon_cand.is_file() { Some(canon_cand) } else { None }
}

/* a whole file, or the part a video or a sound asked for; always returns a response so requests to ORIGIN never leak to DNS */
fn file_response(env: &ICoreWebView2Environment, file: Option<&Path>, range: Option<String>, csp: Option<&str>) -> Option<ICoreWebView2WebResourceResponse> {
    file_response_inner(env, file, range, csp).or_else(|| not_found(env))
}
fn file_response_inner(env: &ICoreWebView2Environment, file: Option<&Path>, range: Option<String>, csp: Option<&str>) -> Option<ICoreWebView2WebResourceResponse> {
    let file = file.filter(|f| f.is_file())?;
    let len = std::fs::metadata(file).map(|m| m.len()).unwrap_or(0);
    let name = file.to_string_lossy().to_lowercase();
    let cache = if [".html", ".js", ".css", ".json"].iter().any(|e| name.ends_with(e)) { "no-cache" } else { "max-age=31536000" };
    let mut head = format!("Content-Type: {}\r\nCache-Control: {}\r\nX-Content-Type-Options: nosniff\r\nAccept-Ranges: bytes", store::mime(file), cache);
    if let Some(c) = csp { head.push_str("\r\nContent-Security-Policy: "); head.push_str(c); }
    if let Some(r) = range.filter(|r| r.starts_with("bytes=") && len > 0) {
        let spec = r[6..].split(',').next().unwrap_or("");
        let (p0, p1) = spec.split_once('-').unwrap_or((spec, ""));
        let (mut a, mut b) = (0u64, len - 1);
        if !p0.is_empty() { if let Ok(x) = p0.trim().parse() { a = x; } } else if let Ok(x) = p1.trim().parse::<u64>() { a = len.saturating_sub(x); }
        if !p0.is_empty() { if let Ok(x) = p1.trim().parse::<u64>() { b = x.min(len - 1); } }
        if a >= len || b < a { return respond(env, None, 416, "Range Not Satisfiable", &format!("Content-Range: bytes */{}", len)); }
        /* WebView2 reads a response stream from its start, so the part asked for is read into memory: at most 8 MB at a time,
           and a video simply asks for the next part as it plays */
        b = b.min(a + 8 * 1024 * 1024 - 1);
        let s = {
            use std::io::{Read, Seek, SeekFrom};
            let mut f = std::fs::File::open(file).ok()?;
            f.seek(SeekFrom::Start(a)).ok()?;
            let mut buf = vec![0u8; (b - a + 1) as usize];
            f.read_exact(&mut buf).ok()?;
            mem_stream(&buf)?
        };
        return respond(env, Some(s), 206, "Partial Content", &format!("{}\r\nContent-Length: {}\r\nContent-Range: bytes {}-{}/{}", head, b - a + 1, a, b, len));
    }
    let stream = unsafe { SHCreateStreamOnFileEx(&h(&file.to_string_lossy()), (STGM_READ | STGM_SHARE_DENY_NONE).0, 0, false, None).ok()? };
    respond(env, Some(stream), 200, "OK", &format!("{}\r\nContent-Length: {}", head, len))
}

fn serve(env: &ICoreWebView2Environment, args: &ICoreWebView2WebResourceRequestedEventArgs) {
    unsafe {
        let Ok(req) = args.Request() else { return };
        let uri = s(|p| req.Uri(p));
        let Some(rest) = uri.strip_prefix(ORIGIN) else { return };
        if !rest.is_empty() && !rest.starts_with(['/', '?', '#']) { return; }
        let path_q = rest.split(['?', '#']).next().unwrap_or("/");
        let mut path = percent_decode(path_q);
        if path.is_empty() || path == "/" { path = "/index.html".into(); }
        let range = header(&req, "Range");

        /* the bridge: only the app's own top-level page, holding this launch's secret token */
        if let Some(name) = path.strip_prefix("/__bridge/") {
            let method = s(|p| req.Method(p));
            let origin = header(&req, "Origin").unwrap_or_default();
            if method != "POST" || header(&req, "X-Miftah").as_deref() != Some(bridge_token()) || (!origin.is_empty() && origin != ORIGIN) {
                let _ = args.SetResponse(not_found(env).as_ref());
                return;
            }
            let b = body(&req);
            let answer = bridge::call(name, &b);
            let text = match answer { Some(v) => format!("{{\"r\":{}}}", v), None => "{}".into() };
            let r = respond(env, mem_stream(text.as_bytes()), 200, "OK", "Content-Type: application/json; charset=utf-8\r\nCache-Control: no-store");
            let _ = args.SetResponse(r.as_ref());
            return;
        }
        if let Some(rel) = path.strip_prefix("/audio/").filter(|_| path.ends_with(".mp3")) {
            /* fetched from its source the first time: off the window's thread */
            let Ok(def) = args.GetDeferral() else { return };
            let rel = rel.to_string();
            let keep = Ui((env.clone(), args.clone(), def));
            std::thread::spawn(move || {
                let f = store::cached_audio(&rel);
                mc::post(move || {
                    let k = keep;
                    let (env, args, def) = k.0;
                    let r = file_response(&env, f.as_deref(), range, None);
                    let _ = args.SetResponse(r.as_ref());
                    let _ = def.Complete();
                });
            });
            return;
        }
        let (file, csp) = if let Some(n) = path.strip_prefix("/media/") {
            let f = store::safe(n).map(|n| store::dirs().media.join(n));
            let is_html = f.as_deref().map(|p| matches!(store::ext(p).as_str(), ".html" | ".htm")).unwrap_or(false);
            (f, Some(if is_html { "sandbox allow-scripts" } else { "default-src 'none'; sandbox" }))
        } else if let Some(n) = path.strip_prefix("/voice/") {
            (store::safe(n).map(|n| store::dirs().voice.join(n)), Some("default-src 'none'; sandbox"))
        } else {
            (safe_app_file(store::app_dir(), &path), None)
        };
        let r = file_response(env, file.as_deref(), range, csp);
        let _ = args.SetResponse(r.as_ref());
    }
}
fn hex_nibble(c: u8) -> Option<u8> {
    match c { b'0'..=b'9' => Some(c - b'0'), b'a'..=b'f' => Some(c - b'a' + 10), b'A'..=b'F' => Some(c - b'A' + 10), _ => None }
}
fn percent_decode(s: &str) -> String {
    let b = s.as_bytes();
    let mut out = Vec::with_capacity(b.len());
    let mut i = 0;
    while i < b.len() {
        if b[i] == b'%' && i + 2 < b.len() {
            if let (Some(hi), Some(lo)) = (hex_nibble(b[i + 1]), hex_nibble(b[i + 2])) {
                out.push((hi << 4) | lo);
                i += 3;
                continue;
            }
        }
        out.push(b[i]);
        i += 1;
    }
    String::from_utf8_lossy(&out).into_owned()
}

/* ---------- files dropped on the window arrive with their real place on disk ---------- */
fn message(args: &ICoreWebView2WebMessageReceivedEventArgs) {
    let src = s(|p| unsafe { args.Source(p) });
    if !is_app_page(&src) { return; }
    let kind = s(|p| unsafe { args.TryGetWebMessageAsString(p) });
    if kind != "drop" { return; }
    let mut paths = vec![];
    unsafe {
        if let Ok(a2) = args.cast::<ICoreWebView2WebMessageReceivedEventArgs2>() {
            if let Ok(objs) = a2.AdditionalObjects() {
                let mut n = 0u32;
                let _ = objs.Count(&mut n);
                for i in 0..n {
                    if let Ok(o) = objs.GetValueAtIndex(i) {
                        if let Ok(f) = o.cast::<ICoreWebView2File>() { let p = s(|p| f.Path(p)); if !p.is_empty() { paths.push(p); } }
                    }
                }
            }
        }
    }
    mc::later(move || if let Some(a) = app() { for p in paths { open_file(&a, Path::new(&p)); } });
}
pub fn open_file(a: &App, path: &Path) {
    if a.queue_file(path.to_path_buf()) { return; }
    if !path.is_file() { return; }
    let e = store::ext(path);
    let p = path.to_path_buf();
    if e == ".zip" || e == ".json" || e == ".miftah" {
        std::thread::spawn(move || {
            let r = store::read_import(&p);
            mc::post(move || if let Some(a) = app() {
                match r { Some((json, files)) => a.post(&format!("__native.onImport({},{},true)", js(&json), files)), None => a.toast("That file could not be read", "تعذرت قراءة الملف") }
            });
        });
        return;
    }
    let Some(kind) = store::kind_of(path) else { a.toast("Miftāḥ cannot use that kind of file", "لا يستعمل مفتاح هذا النوع من الملفات"); return };
    let name = path.file_name().map(|n| n.to_string_lossy().into_owned()).unwrap_or_default();
    std::thread::spawn(move || {
        let r = store::import_media(&p);
        mc::post(move || if let Some(a) = app() {
            match r { Some(r) => a.post(&format!("window.Desk&&Desk.onDropMedia({},{},{})", js(&r), js(kind), js(&name))), None => a.toast("That file could not be copied", "تعذر نسخ الملف") }
        });
    });
}

/* the phone sends its record; the page joins it with this one, exactly as it joins a family file (runs on the link's thread) */
pub fn merge_from_phone(json: String, phone: String) -> Option<String> {
    let (tx, rx) = std::sync::mpsc::channel::<Option<String>>();
    let script = format!("window.Desk?Desk.lanMerge({},{}):null", js(&json), js(&phone));
    mc::post(move || {
        let tx2 = tx.clone();
        match app().and_then(|a| a.view()) {
            Some(v) => mc::exec(&v, &script, Some(Box::new(move |r: String| {
                let v: serde_json::Value = serde_json::from_str(&r).unwrap_or(serde_json::Value::Null);
                let _ = tx2.send(v.as_str().map(String::from));
            }))),
            None => { let _ = tx.send(None); }
        }
    });
    rx.recv_timeout(std::time::Duration::from_secs(90)).ok().flatten()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn percent_decode_handles_utf8_and_hex() {
        assert_eq!(percent_decode("/a%20b%5cc"), "/a b\\c");
        assert_eq!(percent_decode("/%م"), "/%م");
        assert_eq!(percent_decode("/%aé"), "/%aé");
        assert_eq!(percent_decode("/%"), "/%");
    }

    #[test]
    fn is_app_page_strict() {
        assert!(is_app_page("https://miftah.example"));
        assert!(is_app_page("https://miftah.example/"));
        assert!(is_app_page("https://miftah.example/index.html#/home"));
        assert!(!is_app_page("https://miftah.example.evil.com/index.html"));
        assert!(!is_app_page("https://miftah.example/media/sim.html"));
        assert!(!is_app_page("https://miftah.example/sims/index.html"));
    }

    #[test]
    fn outside_blocks_video_and_backslashes() {
        assert!(allow_outside("https://github.com/Bashyr18/miftah-app"));
        assert!(allow_outside("mailto:test@example.com"));
        assert!(!allow_outside("https://youtu.be/dQw4w9WgXcQ"));
        assert!(!allow_outside("https://youtube.com/watch?v=dQw4w9WgXcQ"));
        assert!(!allow_outside("https://www.youtube.com/watch?v=dQw4w9WgXcQ"));
        assert!(!allow_outside("https://example.com\\evil"));
        assert!(!allow_outside("javascript:alert(1)"));
    }

    #[test]
    fn safe_app_file_blocks_traversal_and_unc() {
        let base = std::env::temp_dir().join(format!("miftah_test_web_{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&base);
        std::fs::create_dir_all(base.join("sub")).unwrap();
        std::fs::write(base.join("index.html"), b"ok").unwrap();
        std::fs::write(base.join("sub").join("a.js"), b"ok").unwrap();

        assert!(safe_app_file(&base, "/index.html").is_some());
        assert!(safe_app_file(&base, "/sub/a.js").is_some());
        assert!(safe_app_file(&base, "/\\Windows\\win.ini").is_none());
        assert!(safe_app_file(&base, "\\\\attacker\\share\\x.png").is_none());
        assert!(safe_app_file(&base, "/../secret.txt").is_none());
        assert!(safe_app_file(&base, "/C:/Windows/win.ini").is_none());
        assert!(safe_app_file(&base, "/sub/a.js\0").is_none());

        let _ = std::fs::remove_dir_all(&base);
    }
}
