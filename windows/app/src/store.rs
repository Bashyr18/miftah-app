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
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Condvar, Mutex, OnceLock};

use serde_json::{json, Map, Value};

pub struct Dirs { pub root: PathBuf, pub media: PathBuf, pub voice: PathBuf, pub audio: PathBuf, pub backups: PathBuf, pub state: PathBuf, pub desk: PathBuf }
static DIRS: OnceLock<Dirs> = OnceLock::new();
static APP: OnceLock<PathBuf> = OnceLock::new();
static STATE: Mutex<()> = Mutex::new(());
struct SaveQ { pending: Option<String>, writing: bool }
static SAVE_Q: OnceLock<(Mutex<SaveQ>, Condvar)> = OnceLock::new();
static DESK: Mutex<Option<Map<String, Value>>> = Mutex::new(None);
static MEDIA_SEQ: AtomicU64 = AtomicU64::new(0);

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

/* written whole to a side file, then swapped in, so a power cut never leaves half a record; retries briefly for AV/indexer locks */
pub fn write_atomic(path: &Path, bytes: &[u8]) -> std::io::Result<()> {
    let mut tmp = path.as_os_str().to_owned();
    tmp.push(".tmp");
    let tmp = PathBuf::from(tmp);
    {
        let mut f = fs::File::create(&tmp)?;
        f.write_all(bytes)?;
        f.sync_all()?;
    }
    for i in 0..5 {
        match fs::rename(&tmp, path) {
            Ok(()) => return Ok(()),
            Err(_) if i < 4 => std::thread::sleep(std::time::Duration::from_millis(30)),
            Err(e) => { let _ = fs::remove_file(&tmp); return Err(e); }
        }
    }
    Ok(())
}

/* ---------- the record ---------- */
fn write_state_now(json: &str) {
    let _g = STATE.lock().unwrap();
    if write_atomic(&dirs().state, json.as_bytes()).is_err() { return; }
    let today = dirs().backups.join(format!("{}.json", today()));
    if !today.exists() {
        let _ = write_atomic(&today, json.as_bytes());
        let mut all = json_files(&dirs().backups);
        all.sort();
        let n = all.len();
        for f in all.into_iter().take(n.saturating_sub(30)) { let _ = fs::remove_file(f); }
    }
}
fn save_queue() -> &'static (Mutex<SaveQ>, Condvar) {
    SAVE_Q.get_or_init(|| {
        let pair = (Mutex::new(SaveQ { pending: None, writing: false }), Condvar::new());
        std::thread::Builder::new().name("state-writer".into()).spawn(|| {
            let (m, cv) = save_queue();
            loop {
                let next = {
                    let mut g = m.lock().unwrap();
                    while g.pending.is_none() { g = cv.wait(g).unwrap(); }
                    g.writing = true;
                    g.pending.take().unwrap()
                };
                write_state_now(&next);
                let mut g = m.lock().unwrap();
                g.writing = false;
                cv.notify_all();
            }
        }).ok();
        pair
    })
}
pub fn load_state() -> Option<String> {
    flush_state();
    let _g = STATE.lock().unwrap();
    fs::read_to_string(&dirs().state).ok().map(|s| s.trim_start_matches('\u{feff}').to_string())
}
pub fn save_state(json: String) {
    if json.len() < 2 || json.len() > 60_000_000 { return; }
    let (m, cv) = save_queue();
    let mut g = m.lock().unwrap();
    g.pending = Some(json);
    cv.notify_all();
}
pub fn flush_state() {
    let Some((m, cv)) = SAVE_Q.get() else { return };
    let mut g = m.lock().unwrap();
    let deadline = std::time::Instant::now() + std::time::Duration::from_secs(5);
    while g.pending.is_some() || g.writing {
        let left = deadline.saturating_duration_since(std::time::Instant::now());
        if left.is_zero() { break; }
        let (ng, _) = cv.wait_timeout(g, left).unwrap();
        g = ng;
    }
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
fn backup_now_in(dir: &Path, tag: &str, json: &str) -> bool {
    if serde_json::from_str::<Value>(json).is_err() { return false; }
    let _ = fs::create_dir_all(dir);
    let clean: String = tag.chars().filter(|c| c.is_ascii_alphanumeric() || matches!(c, '-' | '_')).take(32).collect();
    let t = now_local();
    let stem = format!("{:04}-{:02}-{:02}-before-{}-{:02}{:02}{:02}", t.wYear, t.wMonth, t.wDay, if clean.is_empty() { "restore" } else { &clean }, t.wHour, t.wMinute, t.wSecond);
    let Some(name) = safe(&format!("{}.json", stem)) else { return false };
    let path = dir.join(name);
    if write_atomic(&path, json.as_bytes()).is_err() { return false; }
    fs::read(&path).map(|b| b == json.as_bytes()).unwrap_or(false)
}
pub fn backup_now(tag: &str, json: &str) -> bool {
    backup_now_in(&dirs().backups, tag, json)
}

/* ---------- this computer's own settings ---------- */
fn read_desk_file(path: &Path) -> Result<Map<String, Value>, std::io::Error> {
    for i in 0..3 {
        match fs::read_to_string(path) {
            Ok(s) => {
                return serde_json::from_str(s.trim_start_matches('\u{feff}')).map_err(std::io::Error::other);
            }
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(Map::new()),
            Err(_) if i < 2 => std::thread::sleep(std::time::Duration::from_millis(30)),
            Err(e) => return Err(e),
        }
    }
    Ok(Map::new())
}
fn with_desk<R>(f: impl FnOnce(&mut Map<String, Value>) -> R) -> R {
    let mut g = DESK.lock().unwrap();
    if g.is_none() {
        match read_desk_file(&dirs().desk) {
            Ok(m) => *g = Some(m),
            Err(_) => { let mut tmp = Map::new(); return f(&mut tmp); }
        }
    }
    f(g.as_mut().unwrap())
}
pub fn get(k: &str) -> Option<Value> { with_desk(|d| d.get(k).cloned().filter(|v| !v.is_null())) }
pub fn get_str(k: &str) -> Option<String> { get(k).and_then(|v| v.as_str().map(String::from)) }
pub fn flag(k: &str) -> bool { get(k).and_then(|v| v.as_bool()).unwrap_or(false) }
pub fn set(k: &str, v: Value) -> bool {
    let mut g = DESK.lock().unwrap();
    if g.is_none() {
        let Ok(m) = read_desk_file(&dirs().desk) else { return false };
        *g = Some(m);
    }
    let d = g.as_mut().unwrap();
    let old = d.insert(k.to_string(), v);
    let saved = serde_json::to_vec(d).is_ok_and(|s| write_atomic(&dirs().desk, &s).is_ok());
    if !saved {
        match old { Some(value) => { d.insert(k.to_string(), value); } None => { d.remove(k); } }
    }
    saved
}

/* ---------- the family's files ---------- */
pub fn safe(name: &str) -> Option<String> {
    if name.is_empty() || name.len() > 120 || name == "." || name == ".."
        || name.contains("..") || name.ends_with('.') || name.ends_with(' ')
        || name.chars().any(|c| (c as u32) < 32 || "<>:\"/\\|?*".contains(c))
    {
        return None;
    }
    let stem = name.split('.').next().unwrap_or("").to_ascii_uppercase();
    if matches!(
        stem.as_str(),
        "CON" | "PRN" | "AUX" | "NUL"
            | "COM1" | "COM2" | "COM3" | "COM4" | "COM5" | "COM6" | "COM7" | "COM8" | "COM9"
            | "LPT1" | "LPT2" | "LPT3" | "LPT4" | "LPT5" | "LPT6" | "LPT7" | "LPT8" | "LPT9"
    ) {
        return None;
    }
    Some(name.to_string())
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
    let seq = MEDIA_SEQ.fetch_add(1, Ordering::Relaxed);
    let name = format!("m{:x}_{:x}{}", ticks, seq, if e == ".htm" { ".html".to_string() } else { e });
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
const MAX_ZIP_ENTRIES: usize = 5000;
const MAX_ZIP_JSON: u64 = 60_000_000;
const MAX_ZIP_TOTAL: u64 = 2 * 1024 * 1024 * 1024;

fn extract_zip_entry_capped<R: Read>(reader: R, expected_len: u64, dst: &Path, budget: u64) -> Option<u64> {
    if expected_len > budget { return None; }
    let mut tmp = dst.as_os_str().to_owned();
    tmp.push(".tmp");
    let tmp = PathBuf::from(tmp);
    let mut o = fs::File::create(&tmp).ok()?;
    let limit = budget.saturating_add(1);
    let res = std::io::copy(&mut reader.take(limit), &mut o);
    let sync = o.sync_all();
    drop(o);
    match (res, sync) {
        (Ok(copied), Ok(())) if copied <= budget && copied == expected_len && fs::rename(&tmp, dst).is_ok() => Some(copied),
        _ => {
            let _ = fs::remove_file(&tmp);
            None
        }
    }
}

/* reads a family file, a plain record or a challenge; files land only in their own folder and never replace what is here.
   Answers (the record's text, whether the file was a zip). */
pub fn read_import(path: &Path) -> Option<(String, bool)> {
    let mut head = [0u8; 2];
    let n = fs::File::open(path).ok()?.read(&mut head).ok()?;
    if n == 2 && &head == b"PK" {
        let mut z = zip::ZipArchive::new(fs::File::open(path).ok()?).ok()?;
        let mut json = None;
        let mut total = 0u64;
        for i in 0..z.len().min(MAX_ZIP_ENTRIES) {
            let Ok(e) = z.by_index(i) else { continue };
            let full = e.name().to_string();
            if full == "family.json" || full == "challenge.json" {
                let mut s = String::new();
                if e.size() <= MAX_ZIP_JSON && e.take(MAX_ZIP_JSON + 1).read_to_string(&mut s).is_ok() && (s.len() as u64) <= MAX_ZIP_JSON { json = Some(s); }
                continue;
            }
            let (dir, rest, media) = if let Some(r) = full.strip_prefix("media/") { (&dirs().media, r, true) }
                else if let Some(r) = full.strip_prefix("voice/") { (&dirs().voice, r, false) }
                else { continue };
            let Some(n) = safe(rest) else { continue };
            if media { if kind_of(Path::new(&n)).is_none() { continue; } }
            else if !n.to_ascii_lowercase().ends_with(".m4a") { continue; }
            let dst = dir.join(&n);
            let expected = e.size();
            if !dst.exists() && total < MAX_ZIP_TOTAL {
                let budget = MAX_ZIP_TOTAL.saturating_sub(total);
                if let Some(copied) = extract_zip_entry_capped(e, expected, &dst, budget) {
                    total = total.saturating_add(copied);
                }
            }
        }
        json.map(|j| (j, true))
    } else {
        if fs::metadata(path).ok()?.len() > MAX_ZIP_JSON { return None; }
        let s = fs::read_to_string(path).ok()?;
        Some((s.trim_start_matches('\u{feff}').to_string(), false))
    }
}

/* ---------- recitations that do not ship with the app: fetched once from their source, then kept ---------- */
pub fn valid_audio_rel(rel: &str) -> bool {
    let b = rel.as_bytes();
    if b.len() < 4 || b[1] != b'/' || !matches!(b[0], b'h' | b'a' | b'w' | b'd' | b's') { return false; }
    let f = &rel[2..];
    !f.is_empty() && !f.contains("..") && f.chars().all(|c| c.is_ascii_digit() || c == '_' || c == '.' || c == '-' || c.is_ascii_lowercase())
}
static AUDIO_GEN: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
pub fn audio_gen() -> u64 { AUDIO_GEN.load(std::sync::atomic::Ordering::SeqCst) }

pub fn cached_audio_gen(rel: &str, expect_gen: Option<u64>) -> Option<PathBuf> {
    if !valid_audio_rel(rel) { return None; }
    let in_app = app_dir().join("audio").join(rel.replace('/', "\\"));
    if in_app.is_file() { return Some(in_app); }
    if let Some(g) = expect_gen { if audio_gen() != g { return None; } }
    let b = rel.as_bytes();
    let f = &rel[2..];
    let from: Vec<String> = match b[0] {
        b'h' => vec![format!("https://everyayah.com/data/Husary_Muallim_128kbps/{}", f)],
        b'a' => vec![format!("https://everyayah.com/data/Alafasy_128kbps/{}", f)],
        b'w' => vec![format!("https://verses.quran.com/wbw/{}", f), format!("https://audio.qurancdn.com/wbw/{}", f)],
        _ => return None,
    };
    let dst = dirs().audio.join(rel.replace('/', "_"));
    if fs::metadata(&dst).map(|m| m.is_file() && m.len() > 0).unwrap_or(false) { return Some(dst); }
    static N: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
    for u in from {
        if let Some(g) = expect_gen { if audio_gen() != g { return None; } }
        let tmp = dirs().audio.join(format!("{}.{}.part", rel.replace('/', "_"), N.fetch_add(1, std::sync::atomic::Ordering::Relaxed)));
        if crate::net::download(&u, &tmp, &|_| {}).is_ok() && fs::metadata(&tmp).map(|m| m.is_file() && m.len() > 0).unwrap_or(false) {
            if let Some(g) = expect_gen { if audio_gen() != g { let _ = fs::remove_file(&tmp); return None; } }
            if dst.exists() { let _ = fs::remove_file(&tmp); } else { let _ = fs::rename(&tmp, &dst); }
            return Some(dst);
        }
        let _ = fs::remove_file(&tmp);
    }
    None
}
pub fn cached_audio(rel: &str) -> Option<PathBuf> { cached_audio_gen(rel, None) }

fn parse_cached_audio_name(name: &str) -> Option<(char, u16)> {
    if !name.is_ascii() { return None; }
    let b = name.as_bytes();
    if b.len() == 12 && matches!(b[0], b'h' | b'a') && b[1] == b'_' && &b[8..] == b".mp3" && b[2..8].iter().all(|c| c.is_ascii_digit()) {
        let s: u16 = name[2..5].parse().ok()?;
        let a: u16 = name[5..8].parse().ok()?;
        if (1..=114).contains(&s) && (1..=286).contains(&a) { return Some((b[0] as char, s)); }
    }
    if b.len() == 17 && b[0] == b'w' && b[1] == b'_' && b[5] == b'_' && b[9] == b'_' && &b[13..] == b".mp3"
        && b[2..5].iter().all(|c| c.is_ascii_digit()) && b[6..9].iter().all(|c| c.is_ascii_digit()) && b[10..13].iter().all(|c| c.is_ascii_digit()) {
        let s: u16 = name[2..5].parse().ok()?;
        if (1..=114).contains(&s) { return Some(('w', s)); }
    }
    None
}

pub fn audio_stats_in(dir: &Path) -> String {
    let (mut total, mut count) = (0u64, 0u64);
    let mut counts: std::collections::BTreeMap<char, std::collections::BTreeMap<u16, u32>> = std::collections::BTreeMap::new();
    if let Ok(r) = fs::read_dir(dir) {
        for e in r.flatten() {
            let Ok(m) = e.metadata() else { continue };
            if !m.is_file() || m.len() == 0 { continue; }
            let name = e.file_name().to_string_lossy().into_owned();
            let Some((pfx, s)) = parse_cached_audio_name(&name) else { continue };
            total += m.len();
            count += 1;
            *counts.entry(pfx).or_default().entry(s).or_insert(0) += 1;
        }
    }
    let mut c_map = serde_json::Map::new();
    for (pfx, inner) in counts {
        let mut s_map = serde_json::Map::new();
        for (s, n) in inner { s_map.insert(s.to_string(), serde_json::json!(n)); }
        c_map.insert(pfx.to_string(), serde_json::Value::Object(s_map));
    }
    serde_json::json!({ "bytes": total, "files": count, "counts": c_map }).to_string()
}
pub fn audio_stats() -> String { audio_stats_in(&dirs().audio) }
pub fn audio_clear() {
    AUDIO_GEN.fetch_add(1, std::sync::atomic::Ordering::SeqCst);
    if let Ok(r) = fs::read_dir(&dirs().audio) { for e in r.flatten() { let _ = fs::remove_file(e.path()); } }
}

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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn missing_and_damaged_settings_are_distinct() {
        let dir = std::env::temp_dir().join(format!("miftah-settings-{}-{}", std::process::id(), now_ms()));
        fs::create_dir(&dir).unwrap();
        let path = dir.join("desk.json");
        let missing = read_desk_file(&path);
        fs::write(&path, "{\"phones\":").unwrap();
        let damaged = read_desk_file(&path);
        fs::remove_file(&path).unwrap();
        fs::remove_dir(dir).unwrap();
        assert!(missing.unwrap().is_empty());
        assert!(damaged.is_err());
    }

    #[test]
    fn safe_rejects_traversal_and_reserved() {
        assert_eq!(safe("abc123.png").as_deref(), Some("abc123.png"));
        assert!(safe("").is_none());
        assert!(safe(".").is_none());
        assert!(safe("..").is_none());
        assert!(safe("../secret").is_none());
        assert!(safe("a/b.png").is_none());
        assert!(safe("a\\b.png").is_none());
        assert!(safe("CON.txt").is_none());
        assert!(safe("nul").is_none());
        assert!(safe("foo. ").is_none());
        assert!(safe("foo.").is_none());
    }

    #[test]
    fn valid_audio_rel_blocks_traversal() {
        assert!(valid_audio_rel("h/001001.mp3"));
        assert!(valid_audio_rel("w/001_001_001.mp3"));
        assert!(valid_audio_rel("d/001.ogg"));
        assert!(!valid_audio_rel("../../secret.mp3"));
        assert!(!valid_audio_rel("h/../secret.mp3"));
        assert!(!valid_audio_rel("h/sub/a.mp3"));
        assert!(!valid_audio_rel("C:/Windows/a.mp3"));
        assert!(!valid_audio_rel("\\\\attacker\\share\\a.mp3"));
    }

    #[test]
    fn backup_now_writes_and_verifies_snapshot() {
        let dir = std::env::temp_dir().join(format!("miftah-bknow-{}-{}", std::process::id(), now_ms()));
        let payload = "{\"profiles\":[],\"data\":{}}";
        assert!(backup_now_in(&dir, "2026-11-20", payload));
        let files = json_files(&dir);
        assert_eq!(files.len(), 1);
        assert_eq!(fs::read_to_string(&files[0]).unwrap(), payload);
        assert!(!backup_now_in(&dir, "2026-11-20", "{broken"));
        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn zip_extraction_rejects_over_budget_and_truncated() {
        let dir = std::env::temp_dir().join(format!("miftah-zipcap-{}-{}", std::process::id(), now_ms()));
        fs::create_dir_all(&dir).unwrap();
        let over = dir.join("over.m4a");
        assert!(extract_zip_entry_capped(&b"0123456789"[..], 10, &over, 5).is_none());
        assert!(!over.exists());
        let trunc = dir.join("trunc.m4a");
        assert!(extract_zip_entry_capped(&b"0123"[..], 10, &trunc, 20).is_none());
        assert!(!trunc.exists());
        let ok = dir.join("ok.m4a");
        assert_eq!(extract_zip_entry_capped(&b"012345"[..], 6, &ok, 10), Some(6));
        assert_eq!(fs::read(&ok).unwrap(), b"012345");
        let _ = fs::remove_dir_all(&dir);
    }

    #[test]
    fn audio_stats_counts_cached_surahs_and_ignores_parts() {
        let dir = std::env::temp_dir().join(format!("miftah-audiostats-{}-{}", std::process::id(), now_ms()));
        fs::create_dir_all(&dir).unwrap();
        fs::write(dir.join("h_002001.mp3"), b"abc").unwrap();
        fs::write(dir.join("h_002002.mp3"), b"defg").unwrap();
        fs::write(dir.join("a_112001.mp3"), b"12").unwrap();
        fs::write(dir.join("w_112_001_001.mp3"), b"12345").unwrap();
        fs::write(dir.join("h_002003.mp3.1.part"), b"partial").unwrap();
        fs::write(dir.join("h_002004.mp3"), b"").unwrap();
        fs::write(dir.join("h_سورة.mp3"), b"utf8").unwrap();
        fs::write(dir.join("h_002_bad.mp3"), b"loose").unwrap();
        fs::create_dir_all(dir.join("h_002005.mp3")).unwrap();
        let v: Value = serde_json::from_str(&audio_stats_in(&dir)).unwrap();
        assert_eq!(v["files"].as_u64(), Some(4));
        assert_eq!(v["bytes"].as_u64(), Some(14));
        assert_eq!(v["counts"]["h"]["2"].as_u64(), Some(2));
        assert_eq!(v["counts"]["a"]["112"].as_u64(), Some(1));
        assert_eq!(v["counts"]["w"]["112"].as_u64(), Some(1));
        let _ = fs::remove_dir_all(&dir);
    }
}
