//! Miftah-Setup.exe: installs Miftah the way Windows programs are installed. One window, three moments
//! (what will happen, the copy, done), drawn by page.html in the app's own colours, following the computer's light or dark
//! setting and its language (English or Arabic). No administrator: it installs for this Windows user, in their own Programs folder.
//!   Miftah-Setup.exe                        the window
//!   Miftah-Setup.exe --silent [--no-desktop] installs with the usual choices and no window (for scripts and testing)
//! MIFTAH_SETUP_LANG, MIFTAH_SETUP_THEME and MIFTAH_SETUP_PATH choose a look for screenshots; otherwise the computer decides.
#![windows_subsystem = "windows"]

use std::cell::{Cell, RefCell};
use std::rc::Rc;

use base64::Engine;
use serde_json::{json, Value};
use webview2_com::Microsoft::Web::WebView2::Win32::*;
use webview2_com::*;
use windows::core::{Interface, PCWSTR, PWSTR};
use windows::Win32::Foundation::*;
use windows::Win32::Graphics::Gdi::*;
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::System::Threading::CreateMutexW;
use windows::Win32::UI::HiDpi::*;
use windows::Win32::UI::WindowsAndMessaging::*;

use miftah_common::{self as mc, h, installer, js, take_pwstr, Web};

const VERSION: &str = env!("MIFTAH_VERSION");
static PAYLOAD: &[u8] = include_bytes!(env!("MIFTAH_PAYLOAD"));
static ICON: &[u8] = include_bytes!("../../icon.png");
static PAGE: &str = include_str!("page.html");
/* the app's own fonts (web/fonts), so the installer reads like Miftah itself: Quicksand, Plex Arabic, and Amiri for the name */
static FONTS: &[(&str, u32, &[u8])] = &[
    ("Quicksand", 400, include_bytes!("../../../web/fonts/Quicksand-400-700-latin.woff2")),
    ("Quicksand", 400, include_bytes!("../../../web/fonts/Quicksand-400-700-latin-ext.woff2")),
    ("Plex Arabic", 400, include_bytes!("../../../web/fonts/PlexArabic-400.woff2")),
    ("Plex Arabic", 600, include_bytes!("../../../web/fonts/PlexArabic-600.woff2")),
    ("Plex Arabic", 700, include_bytes!("../../../web/fonts/PlexArabic-700.woff2")),
    ("Amiri", 400, include_bytes!("../../../web/fonts/Amiri-400-arabic.woff2")),
];
fn page() -> String {
    let b64 = base64::engine::general_purpose::STANDARD;
    let faces: String = FONTS.iter().map(|(f, w, d)| {
        /* Quicksand is one variable file for 400 to 700 */
        let weight = if *f == "Quicksand" { "400 700".to_string() } else { w.to_string() };
        format!("@font-face{{font-family:'{}';font-weight:{};font-display:block;src:url(data:font/woff2;base64,{}) format('woff2')}}", f, weight, b64.encode(d))
    }).collect();
    PAGE.replace("/*FONTS*/", &faces)
}

struct St { web: RefCell<Option<Web>>, copying: Cell<bool>, dark: bool }
thread_local! { static ST: RefCell<Option<Rc<St>>> = const { RefCell::new(None) }; }
fn st() -> Option<Rc<St>> { ST.with(|s| s.borrow().clone()) }
fn say(script: String) { mc::post(move || if let Some(s) = st() { if let Some(w) = s.web.borrow().as_ref() { mc::exec(&w.view, &script, None); } }); }

extern "system" fn wndproc(hwnd: HWND, msg: u32, wp: WPARAM, lp: LPARAM) -> LRESULT {
    unsafe {
        match msg {
            mc::WM_APP_RUN => { mc::run_jobs(); LRESULT(0) }
            WM_ERASEBKGND => {
                let mut r = RECT::default(); let _ = GetClientRect(hwnd, &mut r);
                let b = CreateSolidBrush(COLORREF(mc::rgb(if st().map(|s| s.dark).unwrap_or(false) { 0x0b0d14 } else { 0xfbf6ea })));
                FillRect(HDC(wp.0 as _), &r, b); let _ = DeleteObject(b.into());
                LRESULT(1)
            }
            WM_SIZE => { if let Some(s) = st() { if let Some(w) = s.web.borrow().as_ref() { let _ = w.controller.SetBounds(mc::client_rect(hwnd)); } } LRESULT(0) }
            WM_SETFOCUS => { if let Some(s) = st() { if let Some(w) = s.web.borrow().as_ref() { let _ = w.controller.MoveFocus(COREWEBVIEW2_MOVE_FOCUS_REASON_PROGRAMMATIC); } } LRESULT(0) }
            WM_DPICHANGED => {
                let r = &*(lp.0 as *const RECT);
                let _ = SetWindowPos(hwnd, None, r.left, r.top, r.right - r.left, r.bottom - r.top, SWP_NOZORDER | SWP_NOACTIVATE);
                LRESULT(0)
            }
            WM_CLOSE => {
                if st().map(|s| s.copying.get()).unwrap_or(false) { return LRESULT(0); }   /* never half an install */
                if let Some(s) = st() { if let Some(w) = s.web.borrow_mut().take() { let _ = w.controller.Close(); } }
                let _ = DestroyWindow(hwnd);
                LRESULT(0)
            }
            WM_DESTROY => { PostQuitMessage(0); LRESULT(0) }
            _ => DefWindowProcW(hwnd, msg, wp, lp),
        }
    }
}

fn install(desk: bool, boot: bool) {
    std::thread::spawn(move || {
        mc::com_init();
        installer::close_running(8000);
        let r = installer::install(installer::From::Bytes(PAYLOAD), desk, VERSION, &|p| say(format!("Setup.progress({})", p)));
        match r {
            Ok(()) => {
                if !desk { let _ = std::fs::remove_file(installer::desktop_link()); }
                installer::start_with_windows(boot, &installer::exe());
                mc::post(|| if let Some(s) = st() { s.copying.set(false) });
                say("Setup.done()".into());
            }
            Err(e) => {
                mc::post(|| if let Some(s) = st() { s.copying.set(false) });
                say(format!("Setup.error({})", js(&e)));
            }
        }
    });
}
fn message(hwnd: HWND, text: String) {
    let v: Value = serde_json::from_str(&text).unwrap_or(Value::Null);
    match v["do"].as_str() {
        Some("install") => {
            if let Some(s) = st() { if s.copying.replace(true) { return; } }
            install(v["desk"].as_bool().unwrap_or(true), v["boot"].as_bool().unwrap_or(false));
        }
        Some("open") => {
            let dir = installer::dir().to_string_lossy().into_owned();
            mc::spawn(&installer::exe().to_string_lossy(), "", Some(&dir), false);
            unsafe { let _ = PostMessageW(Some(hwnd), WM_CLOSE, WPARAM(0), LPARAM(0)); }
        }
        Some("close") => unsafe { let _ = PostMessageW(Some(hwnd), WM_CLOSE, WPARAM(0), LPARAM(0)); },
        _ => {}
    }
}

/* without WebView2 the window cannot be drawn: Windows' own question instead, and the same install */
fn plain() {
    if mc::msgbox(None, &format!("Install Miftāḥ {} on this computer?\n\nIt installs for you, in {}, with a shortcut in Start and on the desktop.", VERSION, installer::dir().display()), MB_OKCANCEL | MB_ICONQUESTION) != IDOK { return; }
    installer::close_running(8000);
    match installer::install(installer::From::Bytes(PAYLOAD), true, VERSION, &|_| {}) {
        Ok(()) => {
            if mc::msgbox(None, "Miftāḥ is installed.\n\nIt also needs Microsoft Edge WebView2, a free part of Windows that is missing here. Open Microsoft's page to install it?", MB_YESNO | MB_ICONINFORMATION) == IDYES {
                mc::shell_open("https://developer.microsoft.com/microsoft-edge/webview2/#download");
            }
        }
        Err(e) => { mc::msgbox(None, &format!("Miftāḥ could not be installed. Nothing was changed.\n\n{}", e), MB_OK | MB_ICONERROR); }
    }
}

fn main() {
    mc::dpi_aware();
    mc::com_init();
    let args: Vec<String> = std::env::args().skip(1).collect();
    let has = |f: &str| args.iter().any(|a| a == f);
    let _m = unsafe { CreateMutexW(None, true, &h("Local\\Miftah.Setup")) };
    if unsafe { GetLastError() } == ERROR_ALREADY_EXISTS { return; }
    if has("--silent") {
        installer::close_running(8000);
        let r = installer::install(installer::From::Bytes(PAYLOAD), !has("--no-desktop"), VERSION, &|_| {});
        std::process::exit(if r.is_ok() { 0 } else { 1 });
    }
    if mc::webview_version().is_none() { plain(); return; }

    let ar = mc::env("MIFTAH_SETUP_LANG").map(|l| l == "ar").unwrap_or_else(mc::system_arabic);
    let dark = mc::env("MIFTAH_SETUP_THEME").map(|t| t == "dark").unwrap_or_else(mc::system_dark);
    let have = if installer::installed() { installer::installed_version() } else { None };
    let s = Rc::new(St { web: RefCell::new(None), copying: Cell::new(false), dark });
    ST.with(|x| *x.borrow_mut() = Some(s.clone()));

    let hwnd = unsafe {
        let inst = GetModuleHandleW(None).unwrap();
        let class = h("MiftahSetup");
        let wc = WNDCLASSEXW { cbSize: std::mem::size_of::<WNDCLASSEXW>() as u32, lpfnWndProc: Some(wndproc), hInstance: inst.into(), hIcon: mc::app_icon(32), hIconSm: mc::app_icon(16),
            hCursor: LoadCursorW(None, IDC_ARROW).unwrap_or_default(), lpszClassName: PCWSTR(class.as_ptr()), ..Default::default() };
        RegisterClassExW(&wc);
        let style = WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_MINIMIZEBOX;
        let hwnd = CreateWindowExW(WINDOW_EX_STYLE(0), &class, &h(if ar { "تثبيت مفتاح" } else { "Install Miftāḥ" }), style, CW_USEDEFAULT, CW_USEDEFAULT, 800, 480, None, None, Some(inst.into()), None).unwrap();
        /* 800 × 480 of the page, at this screen's scale, in the middle of the screen */
        let dpi = GetDpiForWindow(hwnd);
        let k = dpi as f64 / 96.0;
        let mut r = RECT { left: 0, top: 0, right: (800.0 * k) as i32, bottom: (480.0 * k) as i32 };
        let _ = AdjustWindowRectExForDpi(&mut r, style, false, WINDOW_EX_STYLE(0), dpi);
        let (w, hh) = (r.right - r.left, r.bottom - r.top);
        let mut wa = RECT::default();
        let _ = SystemParametersInfoW(SPI_GETWORKAREA, 0, Some(&mut wa as *mut RECT as _), SYSTEM_PARAMETERS_INFO_UPDATE_FLAGS(0));
        let _ = SetWindowPos(hwnd, None, wa.left + ((wa.right - wa.left) - w) / 2, wa.top + ((wa.bottom - wa.top) - hh) / 2, w, hh, SWP_NOZORDER);
        hwnd
    };
    mc::set_ui(hwnd);
    let (bg, fg) = if dark { (0x0b0d14, 0xf0e9dc) } else { (0xfbf6ea, 0x282116) };
    mc::caption(hwnd, dark, bg, fg);

    let data = std::env::temp_dir().join(format!("Miftah-Setup-webview-{}", std::process::id()));
    let web = match mc::create_web(hwnd, &data.to_string_lossy(), "--disable-features=msSmartScreenProtection") {
        Ok(w) => w,
        Err(_) => { let _ = std::fs::remove_dir_all(&data); unsafe { let _ = DestroyWindow(hwnd); } plain(); return; }
    };
    mc::set_background(&web.controller, bg);
    unsafe {
        if let Ok(st) = web.view.Settings() {
            let _ = st.SetAreDevToolsEnabled(false);
            let _ = st.SetAreDefaultContextMenusEnabled(false);
            let _ = st.SetIsStatusBarEnabled(false);
            let _ = st.SetIsZoomControlEnabled(false);
            let _ = st.SetAreHostObjectsAllowed(false);
            let _ = st.SetAreDefaultScriptDialogsEnabled(false);
            if let Ok(s3) = st.cast::<ICoreWebView2Settings3>() { let _ = s3.SetAreBrowserAcceleratorKeysEnabled(false); }
            if let Ok(s4) = st.cast::<ICoreWebView2Settings4>() { let _ = s4.SetIsGeneralAutofillEnabled(false); let _ = s4.SetIsPasswordAutosaveEnabled(false); }
            if let Ok(s6) = st.cast::<ICoreWebView2Settings6>() { let _ = s6.SetIsSwipeNavigationEnabled(false); }
        }
        let mut t = Default::default();
        if let Ok(v4) = web.view.cast::<ICoreWebView2_4>() {
            let _ = v4.add_DownloadStarting(&DownloadStartingEventHandler::create(Box::new(|_, a| { if let Some(a) = a { let _ = a.SetCancel(true); } Ok(()) })), &mut t);
        }
        let _ = web.view.add_WebMessageReceived(&WebMessageReceivedEventHandler::create(Box::new(move |_, a| {
            if let Some(a) = a { let mut p = PWSTR::null(); if a.TryGetWebMessageAsString(&mut p).is_ok() { let m = take_pwstr(p); mc::later(move || message(hwnd, m)); } }
            Ok(())
        })), &mut t);
        let _ = web.view.add_NavigationStarting(&NavigationStartingEventHandler::create(Box::new(|_, a| {
            if let Some(a) = a { let mut p = PWSTR::null(); let _ = a.Uri(&mut p); let u = take_pwstr(p); if !u.starts_with("data:") && !u.starts_with("about:") { let _ = a.SetCancel(true); } }
            Ok(())
        })), &mut t);
        /* the keyboard starts on the page, on its main button: Enter installs */
        let _ = web.view.add_NavigationCompleted(&NavigationCompletedEventHandler::create(Box::new(|_, _| {
            mc::later(|| if let Some(s) = st() { if let Some(w) = s.web.borrow().as_ref() {
                let _ = w.controller.MoveFocus(COREWEBVIEW2_MOVE_FOCUS_REASON_PROGRAMMATIC);
                mc::exec(&w.view, "document.getElementById('go').focus()", None);
            } });
            Ok(())
        })), &mut t);
    }
    let info = json!({
        "ar": ar, "dark": dark, "version": VERSION, "have": have, "boot": installer::starts_with_windows(),
        "path": mc::env("MIFTAH_SETUP_PATH").unwrap_or_else(|| installer::dir().to_string_lossy().into_owned()),
        "icon": format!("data:image/png;base64,{}", base64::engine::general_purpose::STANDARD.encode(ICON)),
    });
    mc::add_script(&web.view, &format!("window.SETUP={};", info));
    unsafe { let _ = web.view.NavigateToString(&h(&page())); }
    *s.web.borrow_mut() = Some(web);
    unsafe { let _ = ShowWindow(hwnd, SW_SHOWNORMAL); let _ = UpdateWindow(hwnd); }
    let code = mc::pump();
    ST.with(|x| { *x.borrow_mut() = None; });
    drop(s);
    for _ in 0..8 {
        if std::fs::remove_dir_all(&data).is_ok() || !data.exists() { break; }
        std::thread::sleep(std::time::Duration::from_millis(80));
    }
    let _ = PWSTR::null();
    let _ = DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2;
    std::process::exit(code);
}
