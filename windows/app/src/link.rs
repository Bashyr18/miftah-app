//! Phone and computer on the same home Wi-Fi, with no account, no cloud and no internet.
//! The computer is home base: it answers a phone that is looking for it, and a phone it has paired with can join records with it.
//!
//! Pairing: the computer shows six digits. The phone proves it saw them by sealing its first message with a key made from them,
//! and receives a long random key of its own, sealed the same way. Every later message is sealed with that key
//! (AES-256-CBC, then HMAC-SHA256 over the whole), so a neighbour on the same Wi-Fi can neither read nor fake one.
//!
//! Wire format, one request and one answer per connection:
//!   request  "MFT1" | type (1) | id length (1) | phone id (ascii) | length (4, big-endian) | sealed payload
//!   answer   status (1) | length (4, big-endian) | sealed payload
//! Discovery: the phone sends "MFT1?" by UDP broadcast to port 47732; the computer answers "MFT1!" and a small JSON card.
//! The phone's side is android/src/com/miftah/app/Link.java; tools/link-test.js plays the phone against this.
use std::io::{Read, Write};
use std::net::{IpAddr, Ipv4Addr, SocketAddr, TcpListener, TcpStream, UdpSocket};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use base64::Engine;
use hmac::{Hmac, Mac};
use serde_json::{json, Value};
use sha2::Sha256;

use crate::store;

pub const TCP_PORT: u16 = 47731;
pub const UDP_PORT: u16 = 47732;
const PAIR: u8 = 1; const HELLO: u8 = 2; const GET: u8 = 3; const PUT: u8 = 4; const SYNC: u8 = 5;
const OK: u8 = 0; const NOAUTH: u8 = 1; const BADCODE: u8 = 2; const FAIL: u8 = 3; const LOCKED: u8 = 4;
const MAX_BODY: u64 = 420 * 1024 * 1024;

/* ---------- the seal ---------- */
type HmacSha = Hmac<Sha256>;
fn sub(key: &[u8], label: &str) -> Vec<u8> { let mut m = HmacSha::new_from_slice(key).unwrap(); m.update(label.as_bytes()); m.finalize().into_bytes().to_vec() }
pub fn pair_key(code: &str, pc_id: &str) -> Vec<u8> {
    let mut out = [0u8; 32];
    pbkdf2::pbkdf2_hmac::<Sha256>(code.as_bytes(), format!("miftah-pair:{}", pc_id).as_bytes(), 50000, &mut out);
    out.to_vec()
}
pub fn seal(key: &[u8], plain: &[u8]) -> Vec<u8> {
    use aes::cipher::{block_padding::Pkcs7, BlockEncryptMut, KeyIvInit};
    let mut iv = [0u8; 16];
    getrandom::getrandom(&mut iv).ok();
    let ct = cbc::Encryptor::<aes::Aes256>::new_from_slices(&sub(key, "miftah-enc"), &iv).unwrap().encrypt_padded_vec_mut::<Pkcs7>(plain);
    let mut body = Vec::with_capacity(16 + ct.len() + 32);
    body.extend_from_slice(&iv);
    body.extend_from_slice(&ct);
    let mut m = HmacSha::new_from_slice(&sub(key, "miftah-mac")).unwrap();
    m.update(&body);
    body.extend_from_slice(&m.finalize().into_bytes());
    body
}
/* None when the seal is broken: wrong key, or changed on the way */
pub fn open(key: &[u8], body: &[u8]) -> Option<Vec<u8>> {
    use aes::cipher::{block_padding::Pkcs7, BlockDecryptMut, KeyIvInit};
    if body.len() < 16 + 16 + 32 { return None; }
    let (msg, mac) = body.split_at(body.len() - 32);
    let mut m = HmacSha::new_from_slice(&sub(key, "miftah-mac")).unwrap();
    m.update(msg);
    m.verify_slice(mac).ok()?;
    cbc::Decryptor::<aes::Aes256>::new_from_slices(&sub(key, "miftah-enc"), &msg[..16]).ok()?.decrypt_padded_vec_mut::<Pkcs7>(&msg[16..]).ok()
}

/* ---------- the link ---------- */
pub type MergeFn = dyn Fn(String, String) -> Option<String> + Send + Sync;
pub type EventFn = dyn Fn(Value) + Send + Sync;
struct Code { code: Option<String>, until: Instant, tries: u32 }
pub struct Link {
    running: Arc<AtomicBool>,
    code: Arc<Mutex<Code>>,
    pub merge: Arc<Mutex<Option<Box<MergeFn>>>>,
    pub event: Arc<Mutex<Option<Box<EventFn>>>>,
    tcp: Mutex<Option<TcpListener>>,
}
fn b64() -> base64::engine::GeneralPurpose { base64::engine::general_purpose::STANDARD }

pub fn id() -> String {
    if let Some(i) = store::get_str("pcId") { return i; }
    let mut b = [0u8; 8];
    getrandom::getrandom(&mut b).ok();
    let i: String = b.iter().map(|x| format!("{:02x}", x)).collect();
    store::set("pcId", json!(i));
    i
}
pub fn machine_name() -> String {
    use windows::Win32::System::SystemInformation::{GetComputerNameExW, ComputerNameNetBIOS};
    let mut buf = vec![0u16; 256];
    let mut n = buf.len() as u32;
    unsafe { if GetComputerNameExW(ComputerNameNetBIOS, Some(windows::core::PWSTR(buf.as_mut_ptr())), &mut n).is_ok() { return String::from_utf16_lossy(&buf[..n as usize]); } }
    std::env::var("COMPUTERNAME").unwrap_or_else(|_| "Computer".into())
}
pub fn name() -> String { store::get_str("pcName").filter(|n| !n.is_empty()).unwrap_or_else(machine_name) }

fn private(ip: &IpAddr) -> bool {
    match ip {
        IpAddr::V4(v) => { let b = v.octets(); v.is_loopback() || b[0] == 10 || (b[0] == 172 && (16..32).contains(&b[1])) || (b[0] == 192 && b[1] == 168) || (b[0] == 169 && b[1] == 254) }
        IpAddr::V6(v) => v.to_ipv4_mapped().map(|x| private(&IpAddr::V4(x))).unwrap_or(v.is_loopback()),
    }
}
/* the home-network addresses of this computer's real network cards (not virtual ones) */
pub fn addresses() -> Vec<String> {
    use windows::Win32::NetworkManagement::IpHelper::*;
    use windows::Win32::NetworkManagement::Ndis::IfOperStatusUp;
    use windows::Win32::Networking::WinSock::{AF_INET, SOCKADDR_IN};
    let mut out = vec![];
    unsafe {
        let mut len = 16 * 1024u32;
        let mut buf: Vec<u8> = vec![0; len as usize];
        for _ in 0..3 {
            let r = GetAdaptersAddresses(AF_INET.0 as u32, GAA_FLAG_SKIP_ANYCAST | GAA_FLAG_SKIP_MULTICAST | GAA_FLAG_SKIP_DNS_SERVER, None, Some(buf.as_mut_ptr() as *mut IP_ADAPTER_ADDRESSES_LH), &mut len);
            if r == 111 { buf = vec![0; len as usize]; continue; }   /* ERROR_BUFFER_OVERFLOW */
            if r != 0 { return out; }
            break;
        }
        let mut a = buf.as_ptr() as *const IP_ADAPTER_ADDRESSES_LH;
        while !a.is_null() {
            let ad = &*a;
            let ty = ad.IfType;
            let desc = (ad.Description.to_string().unwrap_or_default() + " " + &ad.FriendlyName.to_string().unwrap_or_default()).to_lowercase();
            let virt = ["virtual", "vethernet", "hyper-v", "vmware", "virtualbox", "wsl"].iter().any(|w| desc.contains(w));
            if ad.OperStatus == IfOperStatusUp && ty != 24 && ty != 131 && !virt {   /* 24 loopback, 131 tunnel */
                let mut u = ad.FirstUnicastAddress;
                while !u.is_null() {
                    let sa = (*u).Address.lpSockaddr;
                    if !sa.is_null() && (*sa).sa_family == AF_INET {
                        let s = &*(sa as *const SOCKADDR_IN);
                        let ip = Ipv4Addr::from(u32::from_be(s.sin_addr.S_un.S_addr));
                        if !ip.is_loopback() && private(&IpAddr::V4(ip)) { out.push(ip.to_string()); }
                    }
                    u = (*u).Next;
                }
            }
            a = ad.Next;
        }
    }
    out
}

/* ---------- paired phones ---------- */
pub fn phones() -> Vec<serde_json::Map<String, Value>> {
    store::get("phones").and_then(|v| v.as_array().cloned()).unwrap_or_default().into_iter().filter_map(|v| v.as_object().cloned()).collect()
}
fn keep(l: Vec<serde_json::Map<String, Value>>) { store::set("phones", Value::Array(l.into_iter().map(Value::Object).collect())); }
fn phone(id: &str) -> Option<serde_json::Map<String, Value>> { phones().into_iter().find(|p| p.get("id").and_then(|v| v.as_str()) == Some(id)) }
pub fn forget(id: &str) { keep(phones().into_iter().filter(|p| p.get("id").and_then(|v| v.as_str()) != Some(id)).collect()); }
fn touch(id: &str, name: Option<String>) {
    keep(phones().into_iter().map(|mut p| {
        if p.get("id").and_then(|v| v.as_str()) == Some(id) { p.insert("last".into(), json!(store::now_ms())); if let Some(n) = name.clone().filter(|n| !n.is_empty()) { p.insert("name".into(), json!(n)); } }
        p
    }).collect());
}

impl Link {
    pub fn new() -> Self {
        Link { running: Arc::new(AtomicBool::new(false)), code: Arc::new(Mutex::new(Code { code: None, until: Instant::now(), tries: 0 })), merge: Arc::new(Mutex::new(None)), event: Arc::new(Mutex::new(None)), tcp: Mutex::new(None) }
    }
    pub fn running(&self) -> bool { self.running.load(Ordering::SeqCst) }

    pub fn start(&self) -> bool {
        if self.running() { return true; }
        /* MIFTAH_LINK_LOCAL=1 (tests, and the Android emulator, which reaches this computer as 10.0.2.2) listens on this computer only */
        let at: IpAddr = if std::env::var("MIFTAH_LINK_LOCAL").ok().as_deref() == Some("1") { Ipv4Addr::LOCALHOST.into() } else { Ipv4Addr::UNSPECIFIED.into() };
        let Ok(tcp) = TcpListener::bind(SocketAddr::new(at, TCP_PORT)) else { return false };
        let Ok(udp) = UdpSocket::bind(SocketAddr::new(at, UDP_PORT)) else { return false };
        let _ = udp.set_broadcast(true);
        let _ = udp.set_read_timeout(Some(Duration::from_millis(500)));
        let _ = tcp.set_nonblocking(true);
        self.running.store(true, Ordering::SeqCst);
        *self.tcp.lock().unwrap() = tcp.try_clone().ok();
        let (run, code, merge, event) = (self.running.clone(), self.code.clone(), self.merge.clone(), self.event.clone());
        std::thread::Builder::new().name("link-tcp".into()).spawn(move || {
            while run.load(Ordering::SeqCst) {
                match tcp.accept() {
                    Ok((c, from)) => {
                        let (code, merge, event) = (code.clone(), merge.clone(), event.clone());
                        std::thread::spawn(move || { let _ = c.set_nonblocking(false); let _ = serve(c, from, &code, &merge, &event); });
                    }
                    Err(_) => std::thread::sleep(Duration::from_millis(60)),
                }
            }
        }).ok();
        let (run, code) = (self.running.clone(), self.code.clone());
        std::thread::Builder::new().name("link-udp".into()).spawn(move || {
            let mut buf = [0u8; 512];
            while run.load(Ordering::SeqCst) {
                let Ok((n, from)) = udp.recv_from(&mut buf) else { continue };
                if !private(&from.ip()) || n < 5 || &buf[..5] != b"MFT1?" { continue; }
                let pairing = { let c = code.lock().unwrap(); c.code.is_some() && Instant::now() < c.until };
                let card = format!("MFT1!{}", json!({ "id": id(), "name": name(), "port": TCP_PORT, "pairing": pairing }));
                let _ = udp.send_to(card.as_bytes(), from);
            }
        }).ok();
        true
    }
    pub fn stop(&self) { self.running.store(false, Ordering::SeqCst); *self.tcp.lock().unwrap() = None; }

    /* six digits for the phone to type, for ten minutes */
    pub fn new_code(&self) -> String {
        let mut b = [0u8; 4];
        getrandom::getrandom(&mut b).ok();
        let c = (u32::from_le_bytes(b) % 900000 + 100000).to_string();
        *self.code.lock().unwrap() = Code { code: Some(c.clone()), until: Instant::now() + Duration::from_secs(600), tries: 0 };
        c
    }
    pub fn end_code(&self) { self.code.lock().unwrap().code = None; }
}

fn read_n(s: &mut TcpStream, n: u64) -> std::io::Result<Vec<u8>> {
    if n > MAX_BODY { return Err(std::io::Error::other("too big")); }
    let mut b = vec![0u8; n as usize];
    s.read_exact(&mut b)?;
    Ok(b)
}
fn reply(s: &mut TcpStream, status: u8, body: &[u8]) {
    let l = body.len() as u32;
    let mut out = vec![status];
    out.extend_from_slice(&l.to_be_bytes());
    out.extend_from_slice(body);
    let _ = s.write_all(&out);
    let _ = s.flush();
}
fn say(event: &Mutex<Option<Box<EventFn>>>, v: Value) { if let Some(e) = event.lock().unwrap().as_ref() { e(v); } }
fn file_of(kind: &str, name: &str) -> Option<std::path::PathBuf> {
    let n = store::safe(name)?;
    match kind { "media" => Some(store::dirs().media.join(n)), "voice" => Some(store::dirs().voice.join(n)), _ => None }
}
fn serve(mut s: TcpStream, from: SocketAddr, code: &Mutex<Code>, merge: &Mutex<Option<Box<MergeFn>>>, event: &Mutex<Option<Box<EventFn>>>) -> std::io::Result<()> {
    if !private(&from.ip()) { return Ok(()); }
    s.set_read_timeout(Some(Duration::from_secs(60)))?;
    s.set_write_timeout(Some(Duration::from_secs(120)))?;
    let head = read_n(&mut s, 6)?;
    if &head[..4] != b"MFT1" { return Ok(()); }
    let ty = head[4];
    let dev = String::from_utf8_lossy(&read_n(&mut s, head[5] as u64)?).into_owned();
    let lb = read_n(&mut s, 4)?;
    let len = u32::from_be_bytes([lb[0], lb[1], lb[2], lb[3]]) as u64;
    let body = read_n(&mut s, len)?;
    if ty == PAIR { pair(&mut s, &dev, &body, code, event); return Ok(()); }
    let Some(ph) = phone(&dev) else { reply(&mut s, NOAUTH, &[]); return Ok(()) };
    let key = ph.get("key").and_then(|v| v.as_str()).and_then(|k| b64().decode(k).ok()).unwrap_or_default();
    let Some(plain) = open(&key, &body) else { reply(&mut s, NOAUTH, &[]); return Ok(()) };
    let q = |b: &[u8]| serde_json::from_slice::<Value>(b).unwrap_or(Value::Null);
    match ty {
        HELLO => {
            touch(&dev, q(&plain).get("name").and_then(|v| v.as_str()).map(String::from));
            let a = json!({ "id": id(), "name": name(), "media": store::names(&store::dirs().media), "voice": store::names(&store::dirs().voice) });
            reply(&mut s, OK, &seal(&key, a.to_string().as_bytes()));
            say(event, json!({ "link": "hello", "name": ph.get("name") }));
        }
        GET => {
            let r = q(&plain);
            let f = file_of(r["kind"].as_str().unwrap_or(""), r["name"].as_str().unwrap_or(""));
            match f.filter(|f| f.is_file() && std::fs::metadata(f).map(|m| m.len() < MAX_BODY - 1024).unwrap_or(false)).and_then(|f| std::fs::read(f).ok()) {
                Some(b) => reply(&mut s, OK, &seal(&key, &b)),
                None => reply(&mut s, FAIL, &[]),
            }
        }
        PUT => {
            if plain.len() < 4 { reply(&mut s, FAIL, &[]); return Ok(()); }
            let hl = u32::from_be_bytes([plain[0], plain[1], plain[2], plain[3]]) as usize;
            if 4 + hl > plain.len() { reply(&mut s, FAIL, &[]); return Ok(()); }
            let r = q(&plain[4..4 + hl]);
            let Some(f) = file_of(r["kind"].as_str().unwrap_or(""), r["name"].as_str().unwrap_or("")) else { reply(&mut s, FAIL, &[]); return Ok(()) };
            if !f.exists() { let tmp = f.with_extension("tmp"); if std::fs::write(&tmp, &plain[4 + hl..]).is_ok() { let _ = std::fs::rename(&tmp, &f); } }
            reply(&mut s, OK, &seal(&key, b"ok"));
        }
        SYNC => {
            let pname = ph.get("name").and_then(|v| v.as_str()).unwrap_or("").to_string();
            let answer = merge.lock().unwrap().as_ref().and_then(|m| m(String::from_utf8_lossy(&plain).into_owned(), pname));
            match answer {
                Some(a) => { touch(&dev, None); reply(&mut s, OK, &seal(&key, a.as_bytes())); }
                None => reply(&mut s, FAIL, &[]),
            }
        }
        _ => reply(&mut s, FAIL, &[]),
    }
    Ok(())
}
fn pair(s: &mut TcpStream, dev: &str, body: &[u8], code: &Mutex<Code>, event: &Mutex<Option<Box<EventFn>>>) {
    let c = {
        let mut g = code.lock().unwrap();
        if g.code.is_none() || Instant::now() > g.until { drop(g); reply(s, BADCODE, &[]); return; }
        if g.tries >= 8 { g.code = None; drop(g); reply(s, LOCKED, &[]); say(event, json!({ "link": "locked" })); return; }
        g.tries += 1;
        g.code.clone().unwrap()
    };
    let pk = pair_key(&c, &id());
    let Some(plain) = open(&pk, body) else { reply(s, BADCODE, &[]); say(event, json!({ "link": "badcode" })); return };
    let q: Value = serde_json::from_slice(&plain).unwrap_or(Value::Null);
    let mut pname: String = q.get("name").and_then(|v| v.as_str()).filter(|n| !n.is_empty()).unwrap_or("Phone").to_string();
    if pname.chars().count() > 60 { pname = pname.chars().take(60).collect(); }
    if dev.len() < 8 || dev.len() > 40 { reply(s, FAIL, &[]); return; }
    let mut token = [0u8; 32];
    getrandom::getrandom(&mut token).ok();
    let key = b64().encode(token);
    let mut l: Vec<_> = phones().into_iter().filter(|p| p.get("id").and_then(|v| v.as_str()) != Some(dev)).collect();
    let mut p = serde_json::Map::new();
    p.insert("id".into(), json!(dev)); p.insert("name".into(), json!(pname)); p.insert("key".into(), json!(key)); p.insert("since".into(), json!(store::now_ms()));
    l.push(p);
    keep(l);
    code.lock().unwrap().code = None;
    let a = json!({ "id": id(), "name": name(), "key": key });
    reply(s, OK, &seal(&pk, a.to_string().as_bytes()));
    say(event, json!({ "link": "paired", "name": pname }));
}
