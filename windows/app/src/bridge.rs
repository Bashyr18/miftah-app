//! The bridge the page talks to. The first half mirrors the Android app's bridge method for method
//! (tools/bridge-check.js keeps the two in step); the second half is what only a computer can do.
//! windows/shim.js sends each call here as JSON arguments; the answer goes back as JSON, `None` meaning nothing.
use std::path::{Path, PathBuf};

use serde_json::{json, Value};

use miftah_common::{self as mc, installer, js};

use crate::{app, dialogs, link, net, store, CODE, VERSION};

const UPD_FROM: &str = "https://github.com/Bashyr18/miftah-app/releases/";

pub fn running_installed() -> bool { installer::same(Path::new(&mc::exe_path()), &installer::exe()) }

fn post(script: String) { mc::post(move || if let Some(a) = app() { a.post(&script) }); }
fn toast(en: &'static str, ar: &'static str) { mc::post(move || if let Some(a) = app() { a.toast(en, ar) }); }
fn exported(ok: bool) { post(format!("__native.onExported&&__native.onExported({})", ok)); }

pub fn call(name: &str, body: &[u8]) -> Option<Value> {
    let args: Vec<Value> = serde_json::from_slice(body).unwrap_or_default();
    let s = |i: usize| -> String { args.get(i).and_then(|v| v.as_str()).map(String::from).unwrap_or_default() };
    let b = |i: usize| -> bool { args.get(i).and_then(|v| v.as_bool()).unwrap_or(false) };
    let a = app()?;
    let hwnd = a.hwnd;
    match name {
        /* ---------- the same as the phone ---------- */
        "ready" | "haptic" | "setSystemBars" | "speak" | "speakStop" | "recStop" => None,
        /* the computer's own voice: which languages it has, and (desk only) a letter's name as a WAV the page plays */
        "speakLangs" => Some(json!(crate::speech::langs().join(","))),
        "openVoiceSettings" => { mc::shell_open("ms-settings:speech"); None }
        "speakWav" => {
            use base64::Engine;
            Some(json!(crate::speech::wav(s(0), s(1)).map(|w| base64::engine::general_purpose::STANDARD.encode(w)).unwrap_or_default()))
        }
        "saveState" => { store::save_state(s(0)); None }
        "loadState" => Some(store::load_state().map(Value::String).unwrap_or(Value::Null)),
        "version" => Some(json!(VERSION)),
        "updateCheck" => { update_check(); Some(json!(true)) }
        "updateInstall" => Some(json!(update_install(s(0), s(1)))),
        "lastTheme" => Some(json!(store::get_str("theme").unwrap_or_default())),
        "rememberTheme" => {
            let t = s(0);
            if t == "light" || t == "dark" { store::set("theme", json!(t)); a.title_bar(&t, false); }
            None
        }
        "micAllowed" | "requestNotifications" => Some(json!(true)),
        "recStart" => Some(json!(true)),
        "pinWidget" => Some(json!(false)),
        "openAppSettings" => { mc::shell_open("ms-settings:privacy-microphone"); None }
        "voiceSave" => {
            use base64::Engine;
            let ok = store::safe(&s(0)).and_then(|k| base64::engine::general_purpose::STANDARD.decode(s(1)).ok().map(|d| (k, d)))
                .map(|(k, d)| std::fs::write(store::dirs().voice.join(format!("{}.m4a", k)), d).is_ok()).unwrap_or(false);
            Some(json!(ok))
        }
        "voiceList" => Some(json!(serde_json::to_string(&store::names(&store::dirs().voice).into_iter().filter_map(|n| n.strip_suffix(".m4a").map(String::from)).collect::<Vec<_>>()).unwrap_or_default())),
        "audioKeep" => {
            let l: Vec<String> = serde_json::from_str(&s(0)).unwrap_or_default();
            std::thread::spawn(move || audio_keep(l));
            None
        }
        "audioStats" => Some(json!(store::audio_stats())),
        "audioClear" => { store::audio_clear(); None }
        "sync" => {
            if let Ok(v) = serde_json::from_str::<Value>(&s(0)) { *a.config.borrow_mut() = v.clone(); store::set("config", v); }
            None
        }
        "exportFile" => {
            let (n, text) = (s(0), s(1));
            mc::later(move || {
                let html = n.ends_with(".html");
                let name = if n.is_empty() { "Miftah.json".to_string() } else { n };
                let f: &[(&str, &str)] = if html { &[("Web page", "*.html")] } else { &[("Miftāḥ record", "*.json")] };
                let ok = dialogs::save(hwnd, &name, f, &dialogs::documents()).map(|p| std::fs::write(p, text.as_bytes()).is_ok()).unwrap_or(false);
                exported(ok);
            });
            None
        }
        /* "send to my other device": on a computer that means a file saved where the family can find it */
        "shareFamily" => { export_family(format!("Miftah-family-{}.zip", store::today()), s(0)); None }
        "exportFamily" => { export_family(if s(0).is_empty() { "Miftah-family.zip".into() } else { s(0) }, s(1)); None }
        "shareImage" => {
            let (b64, caption, nm) = (s(0), s(1), s(2));
            mc::later(move || {
                use base64::Engine;
                let n = store::safe(&nm).unwrap_or_else(|| "Miftah-card.png".into());
                let Some(p) = dialogs::save(hwnd, &n, &[("Picture", "*.png")], &dialogs::pictures()) else { return };
                let ok = base64::engine::general_purpose::STANDARD.decode(b64).ok().map(|d| std::fs::write(&p, d).is_ok()).unwrap_or(false);
                if !ok { toast("Not saved", "لم يُحفظ"); return; }
                if !caption.is_empty() { dialogs::copy_text(hwnd, &caption); }
                toast("Saved. The caption is copied, ready to paste into your group.", "حُفظت، ونُسخ التعليق لتلصقه في المجموعة.");
                mc::reveal(&p.to_string_lossy());
            });
            None
        }
        "shareChallenge" => {
            let (j, caption) = (s(0), s(1));
            mc::later(move || {
                let Some(p) = dialogs::save(hwnd, "Miftah-challenge.zip", &[("Miftāḥ challenge", "*.zip")], &dialogs::documents()) else { return };
                if !store::pack_one(&p, "challenge.json", &j) { toast("Not saved", "لم يُحفظ"); return; }
                if !caption.is_empty() { dialogs::copy_text(hwnd, &caption); }
                mc::reveal(&p.to_string_lossy());
            });
            None
        }
        /* the page has already laid the sheet out; Windows' own print window takes it from here (it can also save a PDF) */
        "printPage" => Some(json!(true)),
        "mediaPickType" => { pick(Some(s(0))); Some(json!(true)) }
        "mediaPick" => { pick(None); Some(json!(true)) }
        "mediaDelete" => { if let Some(n) = store::safe(&s(0)) { let _ = std::fs::remove_file(store::dirs().media.join(n)); } None }
        "importFile" => {
            mc::later(move || {
                let Some(p) = dialogs::open(hwnd, &[("Miftāḥ files", "*.zip;*.json;*.miftah"), ("All files", "*.*")], &dialogs::documents()) else { return };
                std::thread::spawn(move || match store::read_import(&p) {
                    Some((json, files)) => post(format!("__native.onImport({},{},false)", js(&json), files)),
                    None => toast("Could not read that file", "تعذرت قراءة الملف"),
                });
            });
            None
        }
        "openUrl" => {
            let u = s(0);
            let sc = u.split(':').next().unwrap_or("").to_lowercase();
            if matches!(sc.as_str(), "https" | "http" | "mailto") { mc::shell_open(&u); }
            None
        }

        /* ---------- only on a computer ---------- */
        "deskInfo" => {
            let mut zoom = 1.0;
            if let Some(w) = a.web.borrow().as_ref() { unsafe { let _ = w.controller.ZoomFactor(&mut zoom); } }
            let phones: Vec<Value> = link::phones().into_iter().map(|p| json!({ "id": p.get("id"), "name": p.get("name"), "since": p.get("since"), "last": p.get("last") })).collect();
            let o = json!({
                "version": VERSION, "machine": link::name(), "data": store::root().to_string_lossy(),
                "installed": installer::installed(), "portable": !running_installed(),
                "tray": store::flag("tray"), "startup": installer::starts_with_windows(),
                "link": a.link.running(), "addresses": link::addresses(), "phones": phones,
                "zoom": zoom, "full": a.full.get(), "focus": a.focus_lock.get(),
                "backups": store::backups(), "audio": store::audio_stats(),
                "printables": dialogs::print_folder().to_string_lossy()
            });
            Some(json!(o.to_string()))
        }
        "deskSet" => {
            let (key, on) = (s(0), b(1));
            mc::later(move || {
                let Some(a) = app() else { return };
                match key.as_str() {
                    "tray" => { store::set("tray", json!(on)); a.tray(on); }
                    "startup" => installer::start_with_windows(on, &if installer::exe().exists() { installer::exe() } else { PathBuf::from(mc::exe_path()) }),
                    "link" => {
                        store::set("link", json!(on));
                        if on {
                            if !start_link(&a) { store::set("link", json!(false)); a.toast("Another program is using Miftāḥ's port. Restart the computer and try again.", "برنامج آخر يستعمل منفذ مفتاح. أعد تشغيل الحاسوب وحاول مجددًا."); }
                        } else { a.link.stop(); }
                    }
                    "full" => a.full_screen(on),
                    "focus" => a.focus(on),
                    _ => {}
                }
                a.post("window.Desk&&Desk.refresh()");
            });
            None
        }
        "deskZoom" => {
            let z = args.first().and_then(|v| v.as_f64()).unwrap_or(1.0).clamp(0.5, 2.5);
            if let Some(w) = a.web.borrow().as_ref() { let c = mc::Ui(w.controller.clone()); mc::later(move || unsafe { let c = c; let _ = c.0.SetZoomFactor(z); }); }
            None
        }
        "pairCode" => Some(json!(if a.link.running() { a.link.new_code() } else { String::new() })),
        "pairEnd" => { a.link.end_code(); None }
        "forgetPhone" => { link::forget(&s(0)); None }
        "rename" => { let n: String = s(0).trim().chars().take(40).collect(); store::set("pcName", json!(n)); None }
        "titleBar" => { let (t, sky) = (s(0), b(1)); mc::later(move || if let Some(a) = app() { a.title_bar(&t, sky) }); None }
        "openFolder" => {
            let p = match s(0).as_str() { "printables" => dialogs::print_folder(), "backups" => store::dirs().backups.clone(), "media" => store::dirs().media.clone(), _ => store::root().to_path_buf() };
            let _ = std::fs::create_dir_all(&p);
            mc::shell_open(&p.to_string_lossy());
            None
        }
        "backup" => Some(store::read_backup(&s(0)).map(Value::String).unwrap_or(Value::Null)),
        "install" => { mc::later(install); None }
        "quit" => { mc::later(|| if let Some(a) = app() { a.quit() }); None }
        "unlocked" => { mc::later(|| if let Some(a) = app() { a.focus(false); a.post("window.Desk&&Desk.refresh()"); }); None }
        "savePdf" => { let n = s(0); mc::later(move || save_pdf(n)); None }
        "reveal" => { let p = s(0); if in_prints(&p) { mc::reveal(&p); } None }
        "openPdf" => { let p = s(0); if in_prints(&p) { mc::shell_open(&p); } None }
        _ => None,
    }
}
fn in_prints(p: &str) -> bool { !p.is_empty() && Path::new(p).is_file() && p.to_lowercase().starts_with(&dialogs::print_folder().to_string_lossy().to_lowercase()) && !p.contains("..") }

/* the port can stay held for a moment after the link was turned off */
fn start_link(a: &crate::App) -> bool {
    for _ in 0..8 { if a.link.start() { return true; } std::thread::sleep(std::time::Duration::from_millis(150)); }
    false
}

fn audio_keep(l: Vec<String>) {
    use std::sync::atomic::{AtomicUsize, Ordering};
    use std::sync::Arc;
    let total = l.len();
    let (done, bad) = (Arc::new(AtomicUsize::new(0)), Arc::new(AtomicUsize::new(0)));
    let q = Arc::new(std::sync::Mutex::new(l));
    let workers: Vec<_> = (0..4).map(|_| {
        let (q, done, bad) = (q.clone(), done.clone(), bad.clone());
        std::thread::spawn(move || loop {
            let Some(rel) = q.lock().unwrap().pop() else { break };
            if store::cached_audio(&rel).is_none() { bad.fetch_add(1, Ordering::SeqCst); }
            let d = done.fetch_add(1, Ordering::SeqCst) + 1;
            if d == total || d % 20 == 0 { post(format!("window.__native.onAudioKeep&&__native.onAudioKeep({},{},{})", d, total, bad.load(Ordering::SeqCst))); }
        })
    }).collect();
    for w in workers { let _ = w.join(); }
}

fn export_family(name: String, json: String) {
    let hwnd = crate::app().map(|a| a.hwnd).unwrap_or_default();
    mc::later(move || {
        let Some(p) = dialogs::save(hwnd, &name, &[("Miftāḥ family file", "*.zip")], &dialogs::documents()) else { exported(false); return };
        std::thread::spawn(move || {
            let ok = store::pack_family(&p, &json);
            exported(ok);
            if ok { mc::reveal(&p.to_string_lossy()); }
        });
    });
}

fn pick(mime: Option<String>) {
    let hwnd = crate::app().map(|a| a.hwnd).unwrap_or_default();
    mc::later(move || {
        let m = mime.unwrap_or_default();
        let f: (&str, &str) = if m.starts_with("image") { ("Pictures", "*.png;*.jpg;*.jpeg;*.webp;*.gif") }
            else if m.starts_with("video") { ("Videos", "*.mp4;*.webm;*.mov;*.m4v") }
            else if m.starts_with("audio") { ("Sounds", "*.mp3;*.m4a;*.ogg;*.wav") }
            else if m.contains("html") { ("Simulations", "*.html;*.htm") }
            else { ("Photos, videos, sounds and simulations", "*.mp4;*.webm;*.mov;*.m4v;*.mp3;*.m4a;*.ogg;*.wav;*.png;*.jpg;*.jpeg;*.webp;*.gif;*.html;*.htm") };
        let Some(p) = dialogs::open(hwnd, &[f], &dialogs::documents().parent().map(Path::to_path_buf).unwrap_or_default()) else { return };
        let Some(kind) = store::kind_of(&p) else { toast("That kind of file cannot be used", "لا يمكن استعمال هذا النوع من الملفات"); return };
        let name = p.file_name().map(|n| n.to_string_lossy().into_owned()).unwrap_or_default();
        std::thread::spawn(move || match store::import_media(&p) {
            Some(r) => post(format!("__native.onMediaPicked({},{},{})", js(&r), js(kind), js(&name))),
            None => toast("That file could not be copied", "تعذر نسخ الملف"),
        });
    });
}

/* ---------- updates: only when a grown-up asks (web/js/core/update.js) ----------
   A check reads version.json from the latest release. Installing downloads the new Miftah.exe beside the family's data and
   checks its SHA-256 against version.json; then this program file is moved aside (Windows allows that while it runs), the new
   one takes its place and opens, and this copy closes. The record is untouched: it lives in its own folder. */
fn update_check() {
    std::thread::spawn(|| {
        let res = net::text(&format!("{}latest/download/version.json", UPD_FROM), 65536).ok()
            .filter(|b| b.trim_start().starts_with('{'))
            .map(|b| format!("{{\"latest\":{},\"current\":{{\"name\":{},\"code\":{}}}}}", b, js(VERSION), CODE));
        post(format!("window.Upd&&Upd.onCheck({})", res.map(|r| js(&r)).unwrap_or_else(|| "null".into())));
    });
}
fn update_install(url: String, sha: String) -> bool {
    if !url.starts_with(UPD_FROM) || sha.len() != 64 { return false; }
    let sha = sha.to_lowercase();
    let dir = store::root().join("update");
    let _ = std::fs::create_dir_all(&dir);
    let file = dir.join("Miftah.exe");
    let part = dir.join("Miftah.exe.part");
    std::thread::spawn(move || {
        if !(file.exists() && net::sha256(&file).as_deref() == Some(&sha)) {
            let _ = std::fs::remove_file(&file);
            /* progress: only a rise, at most every 150 ms, or the window drowns in messages */
            let last = std::sync::Mutex::new((-1i32, std::time::Instant::now()));
            let r = net::download(&url, &part, &|p| {
                let pc = (p * 100.0) as i32;
                let mut g = last.lock().unwrap();
                if pc <= g.0 || (pc < 100 && g.1.elapsed().as_millis() < 150) { return; }
                *g = (pc, std::time::Instant::now());
                post(format!("window.Upd&&Upd.onProgress({})", pc as f64 / 100.0));
            });
            if r.is_err() { let _ = std::fs::remove_file(&part); post("window.Upd&&Upd.onDone('failed')".into()); return; }
            if net::sha256(&part).as_deref() != Some(&sha) { let _ = std::fs::remove_file(&part); post("window.Upd&&Upd.onDone('checksum')".into()); return; }
            if std::fs::rename(&part, &file).is_err() { post("window.Upd&&Upd.onDone('failed')".into()); return; }
        }
        post("window.Upd&&Upd.onDone('ok')".into());
        mc::later(move || swap(&file));
    });
    true
}
fn swap(file: &Path) {
    let target = PathBuf::from(mc::exe_path());
    let old = PathBuf::from(format!("{}.old", target.display()));
    let _ = std::fs::remove_file(&old);
    let moved = std::fs::rename(&target, &old).is_ok();
    if !moved || std::fs::copy(file, &target).is_err() {
        if moved { let _ = std::fs::rename(&old, &target); }
        post("window.Upd&&Upd.onDone('failed')".into());
        return;
    }
    let _ = std::fs::remove_file(file);
    let dir = target.parent().map(|p| p.to_string_lossy().into_owned());
    mc::spawn(&target.to_string_lossy(), "--handover", dir.as_deref(), false);
    if let Some(a) = app() { a.quitting.set(true); a.quit(); }
}

/* from This computer: the same install as Miftah-Setup.exe, then this copy hands over to the installed one */
fn install() {
    let me = PathBuf::from(mc::exe_path());
    let ok = installer::install(installer::From::File(&me), true, VERSION, &|_| {}).is_ok();
    let Some(a) = app() else { return };
    a.post(&format!("window.Desk&&Desk.onInstalled({})", ok));
    /* the installed copy takes over: it waits for this one to close, then opens on the same page */
    if ok && !running_installed() {
        let dir = installer::dir().to_string_lossy().into_owned();
        if !mc::spawn(&installer::exe().to_string_lossy(), "--handover --route=desk/pc", Some(&dir), false) { return; }
        std::thread::spawn(|| { std::thread::sleep(std::time::Duration::from_millis(1400)); mc::later(|| if let Some(a) = app() { a.quitting.set(true); a.quit(); }); });
    }
}

/* the sheet on the page goes straight to a PDF in Documents\Miftah\Printables */
fn save_pdf(name: String) {
    use webview2_com::Microsoft::Web::WebView2::Win32::*;
    use windows::core::Interface;
    let Some(a) = app() else { return };
    let dir = dialogs::print_folder();
    let _ = std::fs::create_dir_all(&dir);
    let clean: String = (if name.is_empty() { "Miftah".to_string() } else { name }).chars().map(|c| if "<>:\"/\\|?*".contains(c) || (c as u32) < 32 { '-' } else { c }).collect();
    let clean = clean.trim().to_string();
    let mut path = dir.join(format!("{}.pdf", clean));
    let mut i = 2;
    while path.exists() { path = dir.join(format!("{} ({}).pdf", clean, i)); i += 1; }
    let done = |ok: bool, p: String| {
        post("window.__native.onResume&&__native.onResume()".into());
        post(format!("window.Desk&&Desk.onPdf({})", if ok { js(&p) } else { "null".into() }));
    };
    let w = a.web.borrow().clone();
    let Some(w) = w else { done(false, String::new()); return };
    let (Ok(v7), Ok(e6)) = (w.view.cast::<ICoreWebView2_7>(), w.env.cast::<ICoreWebView2Environment6>()) else { done(false, String::new()); return };
    unsafe {
        let Ok(st) = e6.CreatePrintSettings() else { done(false, String::new()); return };
        let _ = st.SetPageWidth(8.27); let _ = st.SetPageHeight(11.69);
        let _ = st.SetMarginTop(0.0); let _ = st.SetMarginBottom(0.0); let _ = st.SetMarginLeft(0.0); let _ = st.SetMarginRight(0.0);
        let _ = st.SetShouldPrintBackgrounds(true); let _ = st.SetShouldPrintHeaderAndFooter(false); let _ = st.SetScaleFactor(1.0);
        let p = path.to_string_lossy().into_owned();
        let p2 = p.clone();
        let handler = webview2_com::PrintToPdfCompletedHandler::create(Box::new(move |e, ok| { done(e.is_ok() && ok, p2); Ok(()) }));
        if v7.PrintToPdf(&mc::h(&p), &st, &handler).is_err() { done(false, String::new()); }
    }
}
