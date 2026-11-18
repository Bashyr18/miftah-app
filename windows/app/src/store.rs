//! Everything Miftah keeps on this computer, in one folder the family can see: %LOCALAPPDATA%\Miftah
//!   state.json        the family's record (the same file the phone keeps)
//!   backups\          one copy a day, the last 30 days
//!   media\ voice\     the family's photos, videos, simulations and voice recordings
//!   audio\            recitations fetched once from their source, then kept
//!   desk.json         this computer's own settings (window, tray, reminder, paired phones)
//! The files are the same ones the earlier Windows app kept, so an update finds everything where it was.
use std::fs;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use std::sync::{Mutex, OnceLock};

use serde_json::{json, Map, Value};

pub struct Dirs { pub root: PathBuf, pub media: PathBuf, pub voice: PathBuf, pub audio: PathBuf, pub backups: PathBuf, pub state: PathBuf, pub desk: PathBuf }
static DIRS: OnceLock<Dirs> = OnceLock::new();
static APP: OnceLock<PathBuf> = OnceLock::new();
static STATE: Mutex<()> = Mutex::new(());
static DESK: Mutex<Option<Map<String, Value>>> = Mutex::new(None);

pub fn init() {
    let root = miftah_common::installer::data_dir();
    let _ = fs::create_dir_all(&root);
    let d = |n: &str| { let p = root.join(n); let _ = fs::create_dir_all(&p); p };
    let dirs = Dirs { media: d("media"), voice: d("voice"), audio: d("audio"), backups: d("backups"), state: root.join("state.json"), desk: root.join("desk.json"), root };
    let _ = DIRS.set(dirs);
}
pub fn dirs() -> &'static Dirs { DIRS.get().expect("store::init") }
pub fn root() -> &'static Path { &dirs().root }
pub fn set_app_dir(p: PathBuf) { let _ = APP.set(p); }
pub fn app_dir() -> &'static Path { APP.get().map(|p| p.as_path()).unwrap_or(Path::new(".")) }

/* written whole to a side file, then swapped in, so a power cut never leaves half a record */
pub fn write_atomic(path: &Path, bytes: &[u8]) -> std::io::Result<()> {
    let mut tmp = path.as_os_str().to_owned();
    tmp.push(".tmp");
    let tmp = PathBuf::from(tmp);
    {
        let mut f = fs::File::create(&tmp)?;
        f.write_all(bytes)?;
        f.sync_all()?;
    }
    fs::rename(&tmp, path)
}

/* ---------- the record ---------- */
pub fn load_state() -> Option<String> {
    let _g = STATE.lock().unwrap();
    fs::read_to_string(&dirs().state).ok().map(|s| s.trim_start_matches('\u{feff}').to_string())
}
pub fn save_state(json: String) {
    if json.len() < 2 || json.len() > 60_000_000 { return; }
    std::thread::spawn(move || {
        let _g = STATE.lock().unwrap();
        if write_atomic(&dirs().state, json.as_bytes()).is_err() { return; }
        let today = dirs().backups.join(format!("{}.json", today()));
        if !today.exists() {
            let _ = fs::copy(&dirs().state, &today);
            let mut all = json_files(&dirs().backups);
            all.sort();
            let n = all.len();
            for f in all.into_iter().take(n.saturating_sub(30)) { let _ = fs::remove_file(f); }
        }
    });
}
fn json_files(dir: &Path) -> Vec<PathBuf> {
    fs::read_dir(dir).map(|r| r.flatten().map(|e| e.path()).filter(|p| p.extension().map(|e| e == "json").unwrap_or(false)).collect()).unwrap_or_default()
}
pub fn backups() -> Value {
    let mut all = json_files(&dirs().backups);
    all.sort(); all.reverse();
    Value::Array(all.iter().map(|f| json!({ "name": f.file_stem().map(|s| s.to_string_lossy().into_owned()).unwrap_or_default(), "bytes": fs::metadata(f).map(|m| m.len()).unwrap_or(0) })).collect())
}
pub fn read_backup(name: &str) -> Option<String> {
    let n = safe(name)?;
    fs::read_to_string(dirs().backups.join(format!("{}.json", n))).ok()
}

/* ---------- this computer's own settings ---------- */
fn with_desk<R>(f: impl FnOnce(&mut Map<String, Value>) -> R) -> R {
    let mut g = DESK.lock().unwrap();
    if g.is_none() {
        let m = fs::read_to_string(&dirs().desk).ok().and_then(|s| serde_json::from_str::<Value>(s.trim_start_matches('\u{feff}')).ok()).and_then(|v| v.as_object().cloned()).unwrap_or_default();
        *g = Some(m);
    }
    f(g.as_mut().unwrap())
}
pub fn get(k: &str) -> Option<Value> { with_desk(|d| d.get(k).cloned().filter(|v| !v.is_null())) }
pub fn get_str(k: &str) -> Option<String> { get(k).and_then(|v| v.as_str().map(String::from)) }
pub fn flag(k: &str) -> bool { get(k).and_then(|v| v.as_bool()).unwrap_or(false) }
pub fn set(k: &str, v: Value) {
    with_desk(|d| {
        d.insert(k.to_string(), v);
        let s = serde_json::to_string(d).unwrap_or_else(|_| "{}".into());
        let _ = write_atomic(&dirs().desk, s.as_bytes());
    });
}

/* ---------- the family's files ---------- */
pub fn safe(name: &str) -> Option<String> {
    let n = name.rsplit(['/', '\\']).next().unwrap_or("");
    if n.is_empty() || n.contains("..") || n.chars().any(|c| (c as u32) < 32 || "<>:\"/\\|?*".contains(c)) { return None; }
    Some(n.to_string())
}
pub fn ext(path: &Path) -> String { path.extension().map(|e| format!(".{}", e.to_string_lossy().to_lowercase())).unwrap_or_default() }
pub fn kind_of(path: &Path) -> Option<&'static str> {
    Some(match ext(path).as_str() {
        ".mp4" | ".webm" | ".mov" | ".m4v" | ".mkv" => "video",
        ".mp3" | ".m4a" | ".ogg" | ".opus" | ".wav" | ".aac" => "audio",
        ".png" | ".jpg" | ".jpeg" | ".webp" | ".gif" | ".bmp" => "image",
        ".html" | ".htm" => "html",
        _ => return None,
    })
}
/* a picked or dropped file is copied in under a fresh name; the original stays where it was */
pub fn import_media(path: &Path) -> Option<String> {
    let e = ext(path);
    let ticks = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map(|d| d.as_nanos() / 100).unwrap_or(0);
    let name = format!("m{:x}{}", ticks, if e == ".htm" { ".html".to_string() } else { e });
    fs::copy(path, dirs().media.join(&name)).ok()?;
    Some(name)
}
pub fn names(dir: &Path) -> Vec<String> {
    fs::read_dir(dir).map(|r| r.flatten().filter(|e| e.path().is_file()).map(|e| e.file_name().to_string_lossy().into_owned())
        .filter(|n| !n.ends_with(".tmp") && !n.ends_with(".part")).collect()).unwrap_or_default()
}

/* the family file: the record, with photos, videos, simulations and recordings. The same zip the phone makes. */
pub fn pack_family(path: &Path, json: &str) -> bool {
    let go = || -> zip::result::ZipResult<()> {
        let mut z = zip::ZipWriter::new(fs::File::create(path)?);
        z.start_file("family.json", zip::write::SimpleFileOptions::default().compression_method(zip::CompressionMethod::Deflated))?;
        z.write_all(json.as_bytes())?;
        let stored = zip::write::SimpleFileOptions::default().compression_method(zip::CompressionMethod::Stored).large_file(true);
        for (dir, pre) in [(&dirs().media, "media/"), (&dirs().voice, "voice/")] {
            for n in names(dir) {
                if let Ok(mut src) = fs::File::open(dir.join(&n)) { z.start_file(format!("{}{}", pre, n), stored)?; std::io::copy(&mut src, &mut z)?; }
            }
        }
        z.finish()?;
        Ok(())
    };
    go().is_ok()
}
/* a challenge for a group: one small zip */
pub fn pack_one(path: &Path, entry: &str, json: &str) -> bool {
    let go = || -> zip::result::ZipResult<()> {
        let mut z = zip::ZipWriter::new(fs::File::create(path)?);
        z.start_file(entry, zip::write::SimpleFileOptions::default())?;
        z.write_all(json.as_bytes())?;
        z.finish()?;
        Ok(())
    };
    go().is_ok()
}
/* reads a family file, a plain record or a challenge; files land only in their own folder and never replace what is here.
   Answers (the record's text, whether the file was a zip). */
pub fn read_import(path: &Path) -> Option<(String, bool)> {
    let mut head = [0u8; 2];
    let n = fs::File::open(path).ok()?.read(&mut head).ok()?;
    if n == 2 && &head == b"PK" {
        let mut z = zip::ZipArchive::new(fs::File::open(path).ok()?).ok()?;
        let mut json = None;
        for i in 0..z.len() {
            let Ok(mut e) = z.by_index(i) else { continue };
            let full = e.name().to_string();
            if full == "family.json" || full == "challenge.json" { let mut s = String::new(); if e.read_to_string(&mut s).is_ok() { json = Some(s); } continue; }
            let dir = if full.starts_with("media/") { &dirs().media } else if full.starts_with("voice/") { &dirs().voice } else { continue };
            let Some(n) = safe(&full) else { continue };
            let dst = dir.join(n);
            if !dst.exists() {
                let tmp = dst.with_extension("tmp");
                if let Ok(mut o) = fs::File::create(&tmp) {
                    if std::io::copy(&mut e, &mut o).is_ok() { drop(o); let _ = fs::rename(&tmp, &dst); } else { drop(o); let _ = fs::remove_file(&tmp); }
                }
            }
        }
        json.map(|j| (j, true))
    } else {
        if fs::metadata(path).ok()?.len() > 60_000_000 { return None; }
        let s = fs::read_to_string(path).ok()?;
        Some((s.trim_start_matches('\u{feff}').to_string(), false))
    }
}

/* ---------- recitations that do not ship with the app: fetched once from their source, then kept ---------- */
pub fn cached_audio(rel: &str) -> Option<PathBuf> {
    let in_app = app_dir().join("audio").join(rel.replace('/', "\\"));
    if in_app.is_file() { return Some(in_app); }
    let b = rel.as_bytes();
    if b.len() < 4 || b[1] != b'/' { return None; }
    let f = &rel[2..];
    if !f.chars().all(|c| c.is_ascii_digit() || c == '_' || c == '.' || c.is_ascii_lowercase()) || f.contains("..") { return None; }
    let from: Vec<String> = match b[0] {
        b'h' => vec![format!("https://everyayah.com/data/Husary_Muallim_128kbps/{}", f)],
        b'a' => vec![format!("https://everyayah.com/data/Alafasy_128kbps/{}", f)],
        b'w' => vec![format!("https://verses.quran.com/wbw/{}", f), format!("https://audio.qurancdn.com/wbw/{}", f)],
        _ => return None,
    };
    let dst = dirs().audio.join(rel.replace('/', "_"));
    if fs::metadata(&dst).map(|m| m.len() > 0).unwrap_or(false) { return Some(dst); }
    static N: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
    for u in from {
        let tmp = dirs().audio.join(format!("{}.{}.part", rel.replace('/', "_"), N.fetch_add(1, std::sync::atomic::Ordering::Relaxed)));
        if crate::net::download(&u, &tmp, &|_| {}).is_ok() && fs::metadata(&tmp).map(|m| m.len() > 0).unwrap_or(false) {
            if dst.exists() { let _ = fs::remove_file(&tmp); } else { let _ = fs::rename(&tmp, &dst); }
            return Some(dst);
        }
        let _ = fs::remove_file(&tmp);
    }
    None
}
pub fn audio_stats() -> String {
    let (mut total, mut count) = (0u64, 0u64);
    if let Ok(r) = fs::read_dir(&dirs().audio) { for e in r.flatten() { if let Ok(m) = e.metadata() { total += m.len(); count += 1; } } }
    format!("{{\"bytes\":{},\"files\":{}}}", total, count)
}
pub fn audio_clear() { if let Ok(r) = fs::read_dir(&dirs().audio) { for e in r.flatten() { let _ = fs::remove_file(e.path()); } } }

pub fn mime(path: &Path) -> &'static str {
    match ext(path).as_str() {
        ".html" | ".htm" => "text/html; charset=utf-8",
        ".js" => "text/javascript; charset=utf-8",
        ".css" => "text/css; charset=utf-8",
        ".json" => "application/json",
        ".svg" => "image/svg+xml",
        ".png" => "image/png",
        ".jpg" | ".jpeg" => "image/jpeg",
        ".webp" => "image/webp",
        ".gif" => "image/gif",
        ".woff2" => "font/woff2",
        ".mp3" => "audio/mpeg",
        ".ogg" | ".opus" => "audio/ogg",
        ".m4a" | ".aac" => "audio/mp4",
        ".wav" => "audio/wav",
        ".webm" => "video/webm",
        ".mp4" | ".m4v" => "video/mp4",
        ".mov" => "video/quicktime",
        ".pdf" => "application/pdf",
        ".txt" => "text/plain; charset=utf-8",
        _ => "application/octet-stream",
    }
}

/* local dates and times, the way the family's clock reads them */
pub fn now_local() -> windows::Win32::Foundation::SYSTEMTIME { unsafe { windows::Win32::System::SystemInformation::GetLocalTime() } }
pub fn today() -> String { let t = now_local(); format!("{:04}-{:02}-{:02}", t.wYear, t.wMonth, t.wDay) }
pub fn now_ms() -> u64 { std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map(|d| d.as_millis() as u64).unwrap_or(0) }
