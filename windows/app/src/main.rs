//! Miftah for Windows: the same lessons and the same family record as the phone, in a window made for a big screen,
//! a keyboard and a printer. Installed by Miftah-Setup.exe like any program, no account, and nothing leaves the house
//! unless the family pairs a phone on their own Wi-Fi.
//!
//! The lessons are the web app in web/, served to WebView2 from inside this program; windows/shim.js gives the page
//! the same bridge the Android app gives it (bridge.rs answers it).
#![windows_subsystem = "windows"]

mod bridge;
mod dialogs;
mod link;
mod net;
mod store;
mod web;

use std::cell::{Cell, RefCell};
use std::path::PathBuf;
use std::rc::Rc;
use std::sync::Arc;

use serde_json::{json, Value};
use windows::core::{PCWSTR, PWSTR};
use windows::Win32::Foundation::*;
use windows::Win32::Graphics::Gdi::*;
use windows::Win32::System::LibraryLoader::GetModuleHandleW;
use windows::Win32::System::Pipes::*;
use windows::Win32::System::Threading::*;
use windows::Win32::Storage::FileSystem::*;
use windows::Win32::UI::Input::KeyboardAndMouse::SetFocus;
use windows::Win32::UI::Shell::*;
use windows::Win32::UI::WindowsAndMessaging::*;

use miftah_common::{self as mc, h, installer, js, Web};

pub const HOST: &str = "miftah.example";
pub const ORIGIN: &str = "https://miftah.example";
pub const VERSION: &str = env!("MIFTAH_VERSION");
pub const CODE: &str = env!("MIFTAH_CODE");

const DARK_BG: u32 = 0x07080d;
const LIGHT_BG: u32 = 0xf6efe0;
const WM_TRAY: u32 = WM_APP + 2;
const ID_OPEN: usize = 1; const ID_PARENT: usize = 2; const ID_PHONE: usize = 3; const ID_QUIT: usize = 4;
const TIMER_REMIND: usize = 7;

/* ---------- the one window, and what it knows ---------- */
pub struct App {
    pub hwnd: HWND,
    pub web: RefCell<Option<Rc<Web>>>,
    pub link: Arc<link::Link>,
    pub quitting: Cell<bool>,
    pub focus_lock: Cell<bool>,
    pub ready: Cell<bool>,
    pub full: Cell<bool>,
    before_full: Cell<(i32, RECT, bool)>,
    pending_route: RefCell<Option<String>>,
    pending_files: RefCell<Vec<PathBuf>>,
    pub config: RefCell<Value>,
    last_remind: RefCell<String>,
    tray_shown: Cell<bool>,
    pub start_tray: bool,
}
thread_local! { static APP: RefCell<Option<Rc<App>>> = const { RefCell::new(None) }; }
pub fn app() -> Option<Rc<App>> { APP.with(|a| a.borrow().clone()) }

impl App {
    pub fn view(&self) -> Option<webview2_com::Microsoft::Web::WebView2::Win32::ICoreWebView2> { self.web.borrow().as_ref().map(|w| w.view.clone()) }
    pub fn post(&self, script: &str) { if let Some(v) = self.view() { mc::exec(&v, script, None); } }
    pub fn toast(&self, en: &str, ar: &str) { self.post(&format!("A.toast(A.L([{},{}]))", js(en), js(ar))); }
    pub fn route(&self, r: &str) {
        if !self.ready.get() { *self.pending_route.borrow_mut() = Some(r.to_string()); return; }
        let r = if r.starts_with('#') { r.to_string() } else { format!("#/{}", r) };
        self.post(&format!("__native.onRoute({})", js(&r)));
    }
    pub fn on_ready(&self) {
        self.ready.set(true);
        let files: Vec<PathBuf> = self.pending_files.borrow_mut().drain(..).collect();
        for f in files { web::open_file(self, &f); }
        if let Some(r) = self.pending_route.borrow_mut().take() { self.route(&r); }
    }
    pub fn queue_file(&self, p: PathBuf) -> bool { if self.ready.get() { false } else { self.pending_files.borrow_mut().push(p); true } }

    pub fn bring(&self) {
        unsafe {
            if !IsWindowVisible(self.hwnd).as_bool() { let _ = ShowWindow(self.hwnd, SW_SHOW); }
            if IsIconic(self.hwnd).as_bool() { let _ = ShowWindow(self.hwnd, SW_RESTORE); }
            let _ = SetForegroundWindow(self.hwnd);
        }
    }
    pub fn quit(&self) {
        if self.focus_lock.get() { self.bring(); self.post("window.Desk&&Desk.askUnlock()"); return; }
        self.quitting.set(true);
        unsafe { let _ = PostMessageW(Some(self.hwnd), WM_CLOSE, WPARAM(0), LPARAM(0)); }
    }

    /* the title bar takes the page's colours; a lesson's night sky makes it dark too */
    pub fn title_bar(&self, theme: &str, sky: bool) {
        let dark = theme == "dark" || sky;
        let bg = if sky { if theme == "dark" { DARK_BG } else { 0x163668 } } else if dark { DARK_BG } else { LIGHT_BG };
        let fg = if dark { 0xf0e9dc } else { 0x282116 };
        mc::caption(self.hwnd, dark, bg, fg);
        if let Some(w) = self.web.borrow().as_ref() { mc::set_background(&w.controller, if theme == "dark" { DARK_BG } else { LIGHT_BG }); }
    }
    pub fn full_screen(&self, on: bool) {
        if on == self.full.get() { return; }
        self.full.set(on);
        unsafe {
            if on {
                let style = GetWindowLongW(self.hwnd, GWL_STYLE);
                let mut wp = WINDOWPLACEMENT { length: std::mem::size_of::<WINDOWPLACEMENT>() as u32, ..Default::default() };
                let _ = GetWindowPlacement(self.hwnd, &mut wp);
                self.before_full.set((style, wp.rcNormalPosition, IsZoomed(self.hwnd).as_bool()));
                let mon = MonitorFromWindow(self.hwnd, MONITOR_DEFAULTTONEAREST);
                let mut mi = MONITORINFO { cbSize: std::mem::size_of::<MONITORINFO>() as u32, ..Default::default() };
                let _ = GetMonitorInfoW(mon, &mut mi);
                SetWindowLongW(self.hwnd, GWL_STYLE, (WS_POPUP | WS_VISIBLE).0 as i32);
                let r = mi.rcMonitor;
                let _ = SetWindowPos(self.hwnd, Some(HWND_TOP), r.left, r.top, r.right - r.left, r.bottom - r.top, SWP_FRAMECHANGED | SWP_SHOWWINDOW);
            } else {
                let (style, r, max) = self.before_full.get();
                SetWindowLongW(self.hwnd, GWL_STYLE, style);
                let wp = WINDOWPLACEMENT { length: std::mem::size_of::<WINDOWPLACEMENT>() as u32, rcNormalPosition: r, showCmd: if max { SW_MAXIMIZE.0 as u32 } else { SW_SHOWNORMAL.0 as u32 }, ..Default::default() };
                let _ = SetWindowPlacement(self.hwnd, &wp);
                let _ = SetWindowPos(self.hwnd, None, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOZORDER | SWP_FRAMECHANGED);
                self.title_bar(&theme(), false);
            }
        }
        self.post(&format!("window.Desk&&Desk.onFull({})", on));
    }
    /* a child's session: the whole screen, and only a grown-up can leave it */
    pub fn focus(&self, on: bool) {
        self.focus_lock.set(on);
        self.full_screen(on);
        unsafe { let _ = SetWindowPos(self.hwnd, Some(if on { HWND_TOPMOST } else { HWND_NOTOPMOST }), 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE); }
    }

    /* ---------- the tray: home base for the phone, and the daily reminder ---------- */
    fn nid(&self) -> NOTIFYICONDATAW {
        let mut n = NOTIFYICONDATAW { cbSize: std::mem::size_of::<NOTIFYICONDATAW>() as u32, hWnd: self.hwnd, uID: 1, uFlags: NIF_ICON | NIF_MESSAGE | NIF_TIP, uCallbackMessage: WM_TRAY, hIcon: mc::app_icon(16), ..Default::default() };
        let tip: Vec<u16> = mc::APP_NAME.encode_utf16().collect();
        n.szTip[..tip.len()].copy_from_slice(&tip);
        n.Anonymous.uVersion = NOTIFYICON_VERSION_4;
        n
    }
    pub fn tray(&self, on: bool) {
        unsafe {
            let n = self.nid();
            if on && !self.tray_shown.get() { let _ = Shell_NotifyIconW(NIM_ADD, &n); let _ = Shell_NotifyIconW(NIM_SETVERSION, &n); self.tray_shown.set(true); }
            else if !on && self.tray_shown.get() { let _ = Shell_NotifyIconW(NIM_DELETE, &n); self.tray_shown.set(false); }
        }
    }
    pub fn balloon(&self, title: &str, text: &str) {
        let was = self.tray_shown.get();
        self.tray(true);
        let mut n = self.nid();
        n.uFlags = NIF_INFO;
        let t: Vec<u16> = title.encode_utf16().take(63).collect();
        let b: Vec<u16> = text.encode_utf16().take(255).collect();
        n.szInfoTitle[..t.len()].copy_from_slice(&t);
        n.szInfo[..b.len()].copy_from_slice(&b);
        n.dwInfoFlags = NIIF_USER | NIIF_LARGE_ICON;
        n.hBalloonIcon = mc::app_icon(32);
        unsafe { let _ = Shell_NotifyIconW(NIM_MODIFY, &n); }
        /* a tray shown only for the reminder leaves again */
        if !was {
            std::thread::spawn(|| { std::thread::sleep(std::time::Duration::from_secs(12)); mc::later(|| if let Some(a) = app() { a.tray(store::flag("tray")) }); });
        }
    }
    fn menu(&self) {
        unsafe {
            let m = CreatePopupMenu().unwrap();
            let add = |id: usize, t: &str| { let _ = AppendMenuW(m, MF_STRING, id, &h(t)); };
            add(ID_OPEN, "Open Miftāḥ");
            add(ID_PARENT, "Parent area");
            add(ID_PHONE, "Phone and computer");
            let _ = AppendMenuW(m, MF_SEPARATOR, 0, PCWSTR::null());
            add(ID_QUIT, "Quit Miftāḥ");
            let mut p = POINT::default();
            let _ = GetCursorPos(&mut p);
            let _ = SetForegroundWindow(self.hwnd);
            let _ = TrackPopupMenu(m, TPM_RIGHTBUTTON | TPM_BOTTOMALIGN, p.x, p.y, Some(0), self.hwnd, None);
            let _ = DestroyMenu(m);
        }
    }
    fn command(&self, id: usize) {
        match id {
            ID_OPEN => self.bring(),
            ID_PARENT => { self.bring(); self.route("parent"); }
            ID_PHONE => { self.bring(); self.route("desk/link"); }
            ID_QUIT => self.quit(),
            _ => {}
        }
    }
    fn remind(&self) {
        let cfg = self.config.borrow().clone();
        let rm = &cfg["remind"];
        if rm["on"].as_bool() != Some(true) { return; }
        let hh = rm["h"].as_i64().unwrap_or(9) as i32;
        let mi = rm["m"].as_i64().unwrap_or(0) as i32;
        let t = store::now_local();
        let today = store::today();
        let (ch, cm) = (t.wHour as i32, t.wMinute as i32);
        if *self.last_remind.borrow() == today || ch != hh || cm < mi || cm > mi + 5 { return; }
        *self.last_remind.borrow_mut() = today;
        unsafe { if IsWindowVisible(self.hwnd).as_bool() && GetForegroundWindow() == self.hwnd { return; } }   /* already here */
        let ar = cfg["lang"].as_str() == Some("ar");
        let next = cfg["next"].as_str().unwrap_or("");
        self.balloon(if ar { "باب اليوم ينتظر" } else { "Today’s door is waiting" }, if next.is_empty() { if ar { "افتح مفتاح" } else { "Open Miftāḥ" } } else { next });
    }

    /* ---------- the window's place, kept between visits ---------- */
    fn keep_bounds(&self) {
        if self.full.get() { return; }
        unsafe {
            let mut wp = WINDOWPLACEMENT { length: std::mem::size_of::<WINDOWPLACEMENT>() as u32, ..Default::default() };
            if GetWindowPlacement(self.hwnd, &mut wp).is_err() || IsIconic(self.hwnd).as_bool() && wp.rcNormalPosition.right == 0 { return; }
            let r = wp.rcNormalPosition;
            store::set("max", json!(IsZoomed(self.hwnd).as_bool()));
            store::set("bounds", json!([r.left, r.top, r.right - r.left, r.bottom - r.top]));
        }
    }
    /* arguments: from the command line, a shortcut, or a second launch */
    pub fn args(&self, args: &[String]) {
        for a in args {
            if a == "--quit" { self.quitting.set(true); unsafe { let _ = PostMessageW(Some(self.hwnd), WM_CLOSE, WPARAM(0), LPARAM(0)); } return; }
            if let Some(r) = a.strip_prefix("--route=") { self.route(r); }
            else if !a.starts_with("--") && std::path::Path::new(a).is_file() { web::open_file(self, std::path::Path::new(a)); }
        }
    }
}
pub fn theme() -> String { store::get_str("theme").unwrap_or_else(|| "dark".into()) }

/* ---------- the window procedure ---------- */
extern "system" fn wndproc(hwnd: HWND, msg: u32, wp: WPARAM, lp: LPARAM) -> LRESULT {
    unsafe {
        match msg {
            mc::WM_APP_RUN => { mc::run_jobs(); return LRESULT(0); }
            WM_ERASEBKGND => {
                let mut r = RECT::default(); let _ = GetClientRect(hwnd, &mut r);
                let b = CreateSolidBrush(COLORREF(mc::rgb(if theme() == "dark" { DARK_BG } else { LIGHT_BG })));
                FillRect(HDC(wp.0 as _), &r, b); let _ = DeleteObject(b.into());
                return LRESULT(1);
            }
            WM_SIZE => {
                if let Some(a) = app() { if let Some(w) = a.web.borrow().as_ref() { let _ = w.controller.SetBounds(mc::client_rect(hwnd)); } }
                return LRESULT(0);
            }
            WM_MOVE | WM_MOVING => { if let Some(a) = app() { if let Some(w) = a.web.borrow().as_ref() { let _ = w.controller.NotifyParentWindowPositionChanged(); } } }
            WM_EXITSIZEMOVE => { if let Some(a) = app() { a.keep_bounds(); } }
            WM_GETMINMAXINFO => {
                let k = mc::dpi_of(hwnd);
                let mm = &mut *(lp.0 as *mut MINMAXINFO);
                mm.ptMinTrackSize = POINT { x: (400.0 * k) as i32, y: (560.0 * k) as i32 };
                return LRESULT(0);
            }
            WM_DPICHANGED => {
                let r = &*(lp.0 as *const RECT);
                let _ = SetWindowPos(hwnd, None, r.left, r.top, r.right - r.left, r.bottom - r.top, SWP_NOZORDER | SWP_NOACTIVATE);
                return LRESULT(0);
            }
            WM_SETFOCUS => {
                if let Some(a) = app() { if let Some(w) = a.web.borrow().as_ref() { let _ = w.controller.MoveFocus(webview2_com::Microsoft::Web::WebView2::Win32::COREWEBVIEW2_MOVE_FOCUS_REASON_PROGRAMMATIC); } }
                return LRESULT(0);
            }
            WM_ACTIVATE => {
                if (wp.0 & 0xffff) != 0 { if let Some(a) = app() { a.post("window.__native&&__native.onResume&&__native.onResume()"); } }
            }
            WM_TIMER if wp.0 == TIMER_REMIND => { if let Some(a) = app() { a.remind(); } return LRESULT(0); }
            WM_TRAY => {
                let ev = (lp.0 & 0xffff) as u32;
                if let Some(a) = app() {
                    match ev {
                        x if x == WM_LBUTTONDBLCLK || x == WM_USER || x == WM_USER + 1 => a.bring(),
                        x if x == WM_CONTEXTMENU || x == WM_RBUTTONUP => a.menu(),
                        x if x == WM_USER + 5 => { a.bring(); a.route("home"); }   /* the reminder was clicked */
                        _ => {}
                    }
                }
                return LRESULT(0);
            }
            WM_COMMAND => { if let Some(a) = app() { a.command(wp.0 & 0xffff); } return LRESULT(0); }
            WM_CLOSE => {
                if let Some(a) = app() {
                    if !a.quitting.get() && a.focus_lock.get() { a.post("window.Desk&&Desk.askUnlock()"); return LRESULT(0); }
                    if !a.quitting.get() && store::flag("tray") {
                        a.keep_bounds();
                        let _ = ShowWindow(hwnd, SW_HIDE);
                        if !store::flag("trayTold") { store::set("trayTold", json!(true)); a.balloon("Miftāḥ is still here", "It waits in the tray so your phone can sync. Right-click the key to quit."); }
                        return LRESULT(0);
                    }
                    a.keep_bounds();
                    a.link.stop();
                    a.tray(false);
                    if let Some(w) = a.web.borrow_mut().take() { let _ = w.controller.Close(); }
                }
                let _ = DestroyWindow(hwnd);
                return LRESULT(0);
            }
            WM_DESTROY => { PostQuitMessage(0); return LRESULT(0); }
            _ => {}
        }
        DefWindowProcW(hwnd, msg, wp, lp)
    }
}

/* ---------- a second launch hands its request to the window already open ---------- */
fn listen() {
    std::thread::Builder::new().name("single-instance".into()).spawn(|| loop {
        unsafe {
            let p = CreateNamedPipeW(&h(installer::PIPE), PIPE_ACCESS_INBOUND, PIPE_TYPE_BYTE | PIPE_READMODE_BYTE | PIPE_WAIT, 1, 0, 65536, 0, None);
            if p.is_invalid() { std::thread::sleep(std::time::Duration::from_millis(200)); continue; }
            let connected = ConnectNamedPipe(p, None).is_ok() || GetLastError() == ERROR_PIPE_CONNECTED;
            let mut all = vec![];
            if connected {
                let mut buf = [0u8; 4096];
                loop {
                    let mut n = 0u32;
                    if ReadFile(p, Some(&mut buf), Some(&mut n), None).is_err() || n == 0 { break; }
                    all.extend_from_slice(&buf[..n as usize]);
                }
            }
            let _ = DisconnectNamedPipe(p);
            let _ = CloseHandle(p);
            let args: Vec<String> = String::from_utf8_lossy(&all).split('\n').map(String::from).filter(|s| !s.is_empty()).collect();
            if args.is_empty() { continue; }
            mc::later(move || if let Some(a) = app() { if !args.iter().any(|x| x == "--quit") { a.bring(); } a.args(&args); });
        }
    }).ok();
}

/* the lessons are unpacked once per version, beside the family's data */
static APP_ZIP: &[u8] = include_bytes!(env!("MIFTAH_APP_ZIP"));
fn unpack() -> Result<(), String> {
    let tag = format!("app-{}-{}", VERSION, APP_ZIP.len());
    let dir = store::root().join(&tag);
    if !dir.join(".done").exists() {
        let _ = std::fs::remove_dir_all(&dir);
        let mut z = zip::ZipArchive::new(std::io::Cursor::new(APP_ZIP)).map_err(|e| e.to_string())?;
        z.extract(&dir).map_err(|e| e.to_string())?;
        std::fs::write(dir.join(".done"), "ok").map_err(|e| e.to_string())?;
        if let Ok(r) = std::fs::read_dir(store::root()) {
            for e in r.flatten() {
                let n = e.file_name().to_string_lossy().into_owned();
                if n.starts_with("app-") && n != tag { let _ = std::fs::remove_dir_all(e.path()); }
            }
        }
    }
    store::set_app_dir(dir);
    Ok(())
}

fn uninstall(quiet: bool) {
    if !quiet && mc::msgbox(None, &format!("Remove Miftāḥ from this computer?\n\nYour family's record and recordings stay in\n{}\nso nothing is lost if you install it again.", store::root().display()), MB_OKCANCEL | MB_ICONQUESTION) != IDOK { return; }
    installer::close_running(6000);
    if !quiet { mc::msgbox(None, &format!("Miftāḥ has been removed. Your family's record is still in {}.", store::root().display()), MB_OK | MB_ICONINFORMATION); }
    /* last, because the folder is emptied a moment after this program closes */
    installer::remove();
}

fn bounds(hwnd: HWND) {
    unsafe {
        let mut wa = RECT::default();
        let _ = SystemParametersInfoW(SPI_GETWORKAREA, 0, Some(&mut wa as *mut RECT as _), SYSTEM_PARAMETERS_INFO_UPDATE_FLAGS(0));
        let k = mc::dpi_of(hwnd);
        let (aw, ah) = (wa.right - wa.left, wa.bottom - wa.top);
        let w = ((1360.0 * k) as i32).min(aw - (80.0 * k) as i32);
        let hh = ((880.0 * k) as i32).min(ah - (60.0 * k) as i32);
        let mut r = RECT { left: wa.left + (aw - w) / 2, top: wa.top + (ah - hh) / 2, right: 0, bottom: 0 };
        r.right = r.left + w; r.bottom = r.top + hh;
        if let Some(b) = store::get("bounds").and_then(|v| v.as_array().cloned()) {
            if b.len() == 4 {
                let v: Vec<i32> = b.iter().map(|x| x.as_f64().unwrap_or(0.0) as i32).collect();
                let s = RECT { left: v[0], top: v[1], right: v[0] + v[2], bottom: v[1] + v[3] };
                if v[2] >= 400 && v[3] >= 400 && !MonitorFromRect(&s, MONITOR_DEFAULTTONULL).is_invalid() { r = s; }
            }
        }
        let wp = WINDOWPLACEMENT { length: std::mem::size_of::<WINDOWPLACEMENT>() as u32, rcNormalPosition: r, showCmd: SW_HIDE.0 as u32, ..Default::default() };
        let _ = SetWindowPlacement(hwnd, &wp);
    }
}

fn main() {
    mc::dpi_aware();
    mc::com_init();
    store::init();
    let args: Vec<String> = std::env::args().skip(1).collect();
    let has = |f: &str| args.iter().any(|a| a == f);
    if has("--uninstall") { uninstall(has("--quiet")); return; }
    /* what an update or an install moved aside is gone once this copy runs */
    let _ = std::fs::remove_file(format!("{}.old", mc::exe_path()));

    let mutex = unsafe { CreateMutexW(None, true, &h("Local\\Miftah.Desktop.v2")).ok() };
    let mut first = unsafe { GetLastError() } != ERROR_ALREADY_EXISTS;
    /* handed over from another copy (after installing or updating): wait for that one to close */
    if !first && has("--handover") {
        if let Some(m) = mutex { let r = unsafe { WaitForSingleObject(m, 15000) }; first = r == WAIT_OBJECT_0 || r == WAIT_ABANDONED; }
    }
    if !first {
        unsafe { let _ = AllowSetForegroundWindow(ASFW_ANY); }
        installer::pipe_send(&if args.is_empty() { vec!["--show".to_string()] } else { args.clone() }, 2500);
        return;
    }
    /* an installed copy keeps its line in Settings > Apps true after an in-app update */
    if bridge::running_installed() { installer::register(VERSION); }
    if let Err(e) = unpack() { mc::msgbox(None, &format!("Miftāḥ could not start.\n\n{}", e), MB_OK | MB_ICONERROR); return; }
    if mc::webview_version().is_none() {
        if mc::msgbox(None, "Miftāḥ needs Microsoft Edge WebView2, a free part of Windows that is missing on this computer.\n\nOpen Microsoft's page to install it?", MB_YESNO | MB_ICONINFORMATION) == IDYES {
            mc::shell_open("https://developer.microsoft.com/microsoft-edge/webview2/#download");
        }
        return;
    }

    let dark = theme() == "dark";
    let hwnd = unsafe {
        let inst = GetModuleHandleW(None).unwrap();
        let class = h("MiftahWindow");
        let wc = WNDCLASSEXW {
            cbSize: std::mem::size_of::<WNDCLASSEXW>() as u32, style: CS_HREDRAW | CS_VREDRAW, lpfnWndProc: Some(wndproc), hInstance: inst.into(),
            hIcon: mc::app_icon(32), hIconSm: mc::app_icon(16), hCursor: LoadCursorW(None, IDC_ARROW).unwrap_or_default(),
            hbrBackground: CreateSolidBrush(COLORREF(mc::rgb(if dark { DARK_BG } else { LIGHT_BG }))), lpszClassName: PCWSTR(class.as_ptr()), ..Default::default()
        };
        RegisterClassExW(&wc);
        CreateWindowExW(WINDOW_EX_STYLE(0), &class, &h(mc::APP_NAME), WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, CW_USEDEFAULT, 1200, 800, None, None, Some(inst.into()), None).unwrap()
    };
    mc::set_ui(hwnd);
    bounds(hwnd);
    let start_tray = has("--tray");
    let a = Rc::new(App {
        hwnd, web: RefCell::new(None), link: Arc::new(link::Link::new()), quitting: Cell::new(false), focus_lock: Cell::new(false), ready: Cell::new(false), full: Cell::new(false),
        before_full: Cell::new((0, RECT::default(), false)), pending_route: RefCell::new(None), pending_files: RefCell::new(vec![]), config: RefCell::new(store::get("config").unwrap_or(Value::Null)),
        last_remind: RefCell::new(String::new()), tray_shown: Cell::new(false), start_tray,
    });
    APP.with(|s| *s.borrow_mut() = Some(a.clone()));
    a.title_bar(&theme(), false);
    if !start_tray { unsafe { let _ = ShowWindow(hwnd, if store::flag("max") { SW_SHOWMAXIMIZED } else { SW_SHOWNORMAL }); let _ = UpdateWindow(hwnd); let _ = SetFocus(Some(hwnd)); } }
    a.tray(store::flag("tray"));
    listen();
    unsafe { SetTimer(Some(hwnd), TIMER_REMIND, 20000, None); }
    {
        let l = a.link.clone();
        *l.merge.lock().unwrap() = Some(Box::new(web::merge_from_phone));
        *l.event.lock().unwrap() = Some(Box::new(|v: Value| { let s = v.to_string(); mc::post(move || if let Some(a) = app() { a.post(&format!("window.Desk&&Desk.onLink({})", s)) }); }));
        if store::flag("link") { l.start(); }
    }
    a.args(&args);
    if let Err(e) = web::init(&a) {
        mc::msgbox(Some(hwnd), &format!("Miftāḥ could not open its window.\n\n{}", e), MB_OK | MB_ICONERROR);
        return;
    }
    let code = mc::pump();
    let _ = mutex;
    let _ = PWSTR::null();
    std::process::exit(code);
}
