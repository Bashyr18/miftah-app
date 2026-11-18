//! The page: WebView2 set up for a family (no browser menus, no downloads, no way out to the web except a link opened
//! in the family's own browser), the lessons served from inside this program, and files dropped on the window.
use std::path::Path;
use std::rc::Rc;

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
/* a link out of the app opens in the family's own browser; a video never leads out to its site */
pub fn outside(u: &str) {
    let scheme = u.split(':').next().unwrap_or("").to_lowercase();
    if !matches!(scheme.as_str(), "https" | "http" | "mailto") { return; }
    let hh = host_of(u);
    if video_host(&hh) || hh == "youtube.com" { return; }
    mc::shell_open(u);
}

pub fn init(a: &Rc<App>) -> std::result::Result<(), String> {
    let mut args = "--autoplay-policy=no-user-gesture-required --disable-features=msSmartScreenProtection,ElasticOverscroll".to_string();
    let dbg = mc::env("MIFTAH_DEBUG_PORT");
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

        mc::add_script(v, SHIM);
        let _ = v.AddWebResourceRequestedFilter(&h(&format!("{}/*", ORIGIN)), COREWEBVIEW2_WEB_RESOURCE_CONTEXT_ALL);
        let env = w.env.clone();
        let _ = v.add_WebResourceRequested(&WebResourceRequestedEventHandler::create(Box::new(move |_, args| {
            if let Some(args) = args { serve(&env, &args); }
            Ok(())
        })), &mut t);
        let _ = v.add_NavigationStarting(&NavigationStartingEventHandler::create(Box::new(|_, args| {
            if let Some(args) = args {
                let u = s(|p| args.Uri(p));
                if !u.starts_with(&format!("{}/", ORIGIN)) { let _ = args.SetCancel(true); outside(&u); }
            }
            Ok(())
        })), &mut t);
        let _ = v.add_FrameNavigationStarting(&NavigationStartingEventHandler::create(Box::new(|_, args| {
            if let Some(args) = args {
                let u = s(|p| args.Uri(p));
                let scheme = u.split(':').next().unwrap_or("").to_lowercase();
                let hh = host_of(&u);
                let ok = hh == crate::HOST || video_host(&hh) || sim_host(&hh) || matches!(scheme.as_str(), "about" | "blob" | "data");
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
                let mine = u.starts_with(ORIGIN);
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
                mc::later(move || if let Some(a) = app() { a.full_screen(on) });
                let _ = a;
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
fn body(req: &ICoreWebView2WebResourceRequest) -> Vec<u8> {
    let mut out = vec![];
    unsafe {
        let Ok(st) = req.Content() else { return out };
        let mut buf = vec![0u8; 1 << 16];
        loop {
            let mut n = 0u32;
            let hr = st.Read(buf.as_mut_ptr() as _, buf.len() as u32, Some(&mut n));
            if n > 0 { out.extend_from_slice(&buf[..n as usize]); }
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

/* a whole file, or the part a video or a sound asked for */
fn file_response(env: &ICoreWebView2Environment, file: Option<&Path>, range: Option<String>) -> Option<ICoreWebView2WebResourceResponse> {
    let Some(file) = file.filter(|f| f.is_file()) else { return not_found(env) };
    let len = std::fs::metadata(file).map(|m| m.len()).unwrap_or(0);
    let name = file.to_string_lossy().to_lowercase();
    let cache = if [".html", ".js", ".css", ".json"].iter().any(|e| name.ends_with(e)) { "no-cache" } else { "max-age=31536000" };
    let head = format!("Content-Type: {}\r\nCache-Control: {}\r\nX-Content-Type-Options: nosniff\r\nAccept-Ranges: bytes", store::mime(file), cache);
    let stream = unsafe { SHCreateStreamOnFileEx(&h(&file.to_string_lossy()), (STGM_READ | STGM_SHARE_DENY_NONE).0, 0, false, None).ok()? };
    if let Some(r) = range.filter(|r| r.starts_with("bytes=") && len > 0) {
        let spec = r[6..].split(',').next().unwrap_or("");
        let (p0, p1) = spec.split_once('-').unwrap_or((spec, ""));
        let (mut a, mut b) = (0u64, len - 1);
        if !p0.is_empty() { if let Ok(x) = p0.trim().parse() { a = x; } } else if let Ok(x) = p1.trim().parse::<u64>() { a = len.saturating_sub(x); }
        if !p0.is_empty() { if let Ok(x) = p1.trim().parse::<u64>() { b = x.min(len - 1); } }
        if a >= len || b < a { return respond(env, None, 416, "Range Not Satisfiable", &format!("Content-Range: bytes */{}", len)); }
        /* WebView2 reads a response stream from its start, so the part asked for is read into memory: at most 8 MB at a time,
           and a video simply asks for the next part as it plays */
        drop(stream);
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
    respond(env, Some(stream), 200, "OK", &format!("{}\r\nContent-Length: {}", head, len))
}

fn serve(env: &ICoreWebView2Environment, args: &ICoreWebView2WebResourceRequestedEventArgs) {
    unsafe {
        let Ok(req) = args.Request() else { return };
        let uri = s(|p| req.Uri(p));
        let Some(rest) = uri.strip_prefix(ORIGIN) else { return };
        let path_q = rest.split(['?', '#']).next().unwrap_or("/");
        let mut path = percent_decode(path_q);
        if path.is_empty() || path == "/" { path = "/index.html".into(); }
        let range = header(&req, "Range");

        /* the bridge: only the app's own page, which marks its calls */
        if let Some(name) = path.strip_prefix("/__bridge/") {
            let method = s(|p| req.Method(p));
            let origin = header(&req, "Origin").unwrap_or_default();
            if method != "POST" || header(&req, "X-Miftah").as_deref() != Some("1") || (!origin.is_empty() && origin != ORIGIN) {
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
                    let r = file_response(&env, f.as_deref(), range);
                    let _ = args.SetResponse(r.as_ref());
                    let _ = def.Complete();
                });
            });
            return;
        }
        let file = if let Some(n) = path.strip_prefix("/media/") { store::safe(n).map(|n| store::dirs().media.join(n)) }
            else if let Some(n) = path.strip_prefix("/voice/") { store::safe(n).map(|n| store::dirs().voice.join(n)) }
            else {
                let rel = path.trim_start_matches('/').replace('/', "\\");
                if rel.contains("..") || rel.contains(':') { None } else { Some(store::app_dir().join(rel)) }
            };
        let r = file_response(env, file.as_deref(), range);
        let _ = args.SetResponse(r.as_ref());
    }
}
fn percent_decode(s: &str) -> String {
    let b = s.as_bytes();
    let mut out = Vec::with_capacity(b.len());
    let mut i = 0;
    while i < b.len() {
        if b[i] == b'%' && i + 2 < b.len() {
            if let Ok(v) = u8::from_str_radix(&s[i + 1..i + 3], 16) { out.push(v); i += 3; continue; }
        }
        out.push(b[i]);
        i += 1;
    }
    String::from_utf8_lossy(&out).into_owned()
}

/* ---------- files dropped on the window arrive with their real place on disk ---------- */
fn message(args: &ICoreWebView2WebMessageReceivedEventArgs) {
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
