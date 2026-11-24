//! Phone and computer on the same home Wi-Fi, with no account, no cloud and no internet.
//! The computer is home base: it answers a phone that is looking for it, and a phone it has paired with can join records with it.
//!
//! Pairing uses a one-time 128-bit code. The phone receives a fresh 256-bit key.
//!
//! Wire format, one request and one answer per connection:
//!   client  "MFT2" | type (1) | id length (1) | phone id (ascii) | client nonce (32)
//!   server  status (1) | fresh challenge (32) | challenge HMAC (32), on success
//!   client  length (4, big-endian) | HMAC of length (32) | sealed payload
//!   server  status (1) | length (4, big-endian) | HMAC of length (32) | sealed payload, on success
//! The challenge and first header derive distinct request and response keys.
//! Discovery uses "MFT2?" / "MFT2!" on UDP port 47732.
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
const MAX_BODY: u64 = 200 * 1024 * 1024 + 1024;

/* ---------- the seal ---------- */
type HmacSha = Hmac<Sha256>;
fn sub(key: &[u8], label: &str) -> Vec<u8> { let mut m = HmacSha::new_from_slice(key).unwrap(); m.update(label.as_bytes()); m.finalize().into_bytes().to_vec() }
fn pair_key(code: &str, pc_id: &str) -> Vec<u8> {
    sub(code.as_bytes(), &format!("miftah-v2/pair/{pc_id}"))
}
fn frame_key(key: &[u8], label: &[u8], nonce: &[u8], header: &[u8]) -> Vec<u8> {
    let mut m = HmacSha::new_from_slice(key).unwrap();
    m.update(label); m.update(nonce); m.update(header);
    m.finalize().into_bytes().to_vec()
}
fn seal(key: &[u8], plain: &[u8]) -> std::io::Result<Vec<u8>> {
    use aes::cipher::{block_padding::Pkcs7, BlockEncryptMut, KeyIvInit};
    let mut iv = [0u8; 16];
    getrandom::getrandom(&mut iv).map_err(|_| std::io::Error::other("OS RNG unavailable"))?;
    let ct = cbc::Encryptor::<aes::Aes256>::new_from_slices(&sub(key, "miftah-enc"), &iv).unwrap().encrypt_padded_vec_mut::<Pkcs7>(plain);
    let mut body = Vec::with_capacity(16 + ct.len() + 32);
    body.extend_from_slice(&iv);
    body.extend_from_slice(&ct);
    let mut m = HmacSha::new_from_slice(&sub(key, "miftah-mac")).unwrap();
    m.update(&body);
    body.extend_from_slice(&m.finalize().into_bytes());
    Ok(body)
}
/* None when the seal is broken: wrong key, or changed on the way */
fn open(key: &[u8], body: &[u8]) -> Option<Vec<u8>> {
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
    getrandom::getrandom(&mut b).expect("OS RNG unavailable");
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
        let mut buf: Vec<u64> = vec![0; (len as usize).div_ceil(8)];
        let mut ok = false;
        for _ in 0..3 {
            let r = GetAdaptersAddresses(AF_INET.0 as u32, GAA_FLAG_SKIP_ANYCAST | GAA_FLAG_SKIP_MULTICAST | GAA_FLAG_SKIP_DNS_SERVER, None, Some(buf.as_mut_ptr() as *mut IP_ADAPTER_ADDRESSES_LH), &mut len);
            if r == 111 { buf = vec![0; (len as usize).div_ceil(8)]; continue; }   /* ERROR_BUFFER_OVERFLOW */
            if r != 0 { return out; }
            ok = true;
            break;
        }
        if !ok { return out; }
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
fn keep(l: Vec<serde_json::Map<String, Value>>) -> bool { store::set("phones", Value::Array(l.into_iter().map(Value::Object).collect())) }
static PHONE_WRITE: Mutex<()> = Mutex::new(());
fn phone(id: &str) -> Option<serde_json::Map<String, Value>> { phones().into_iter().find(|p| p.get("id").and_then(|v| v.as_str()) == Some(id) && p.get("protocol").and_then(Value::as_u64) == Some(2)) }
pub fn forget(id: &str) { let _g = PHONE_WRITE.lock().unwrap(); keep(phones().into_iter().filter(|p| p.get("id").and_then(|v| v.as_str()) != Some(id)).collect()); }
fn touch(id: &str, name: Option<String>) {
    let _g = PHONE_WRITE.lock().unwrap();
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
        let active = Arc::new(std::sync::atomic::AtomicUsize::new(0));
        std::thread::Builder::new().name("link-tcp".into()).spawn(move || {
            while run.load(Ordering::SeqCst) {
                match tcp.accept() {
                    Ok((c, from)) => {
                        if active.load(Ordering::SeqCst) >= 8 { drop(c); continue; }
                        active.fetch_add(1, Ordering::SeqCst);
                        let (code, merge, event, active) = (code.clone(), merge.clone(), event.clone(), active.clone());
                        std::thread::spawn(move || {
                            struct DropCount(Arc<std::sync::atomic::AtomicUsize>);
                            impl Drop for DropCount { fn drop(&mut self) { self.0.fetch_sub(1, Ordering::SeqCst); } }
                            let _dc = DropCount(active);
                            let _ = c.set_nonblocking(false);
                            let _ = serve(c, from, &code, &merge, &event);
                        });
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
                if !private(&from.ip()) || n != 5 || &buf[..5] != b"MFT2?" { continue; }
                let pairing = { let c = code.lock().unwrap(); c.code.is_some() && Instant::now() < c.until };
                let card = format!("MFT2!{}", json!({ "id": id(), "name": name(), "port": TCP_PORT, "pairing": pairing }));
                let _ = udp.send_to(card.as_bytes(), from);
            }
        }).ok();
        true
    }
    pub fn stop(&self) { self.running.store(false, Ordering::SeqCst); *self.tcp.lock().unwrap() = None; }

    /* A copyable 128-bit code that expires after ten minutes or a successful pairing. */
    pub fn new_code(&self) -> String {
        let mut b = [0u8; 16];
        if getrandom::getrandom(&mut b).is_err() { return String::new(); }
        let c: String = b.iter().map(|x| format!("{x:02x}")).collect();
        *self.code.lock().unwrap() = Code { code: Some(c.clone()), until: Instant::now() + Duration::from_secs(600), tries: 0 };
        c
    }
    pub fn end_code(&self) { self.code.lock().unwrap().code = None; }
}

fn read_n(s: &mut TcpStream, n: u64) -> std::io::Result<Vec<u8>> {
    if n > MAX_BODY { return Err(std::io::Error::other("too big")); }
    let mut b = Vec::with_capacity((n as usize).min(65536));
    let got = s.take(n).read_to_end(&mut b)?;
    if got as u64 != n { return Err(std::io::Error::new(std::io::ErrorKind::UnexpectedEof, "short read")); }
    Ok(b)
}
fn reply(s: &mut TcpStream, status: u8) { let _ = s.write_all(&[status, 0, 0, 0, 0]); }
fn reply_sealed(s: &mut TcpStream, key: &[u8], body: &[u8]) -> std::io::Result<()> {
    let len = (body.len() as u32).to_be_bytes();
    s.write_all(&[OK])?; s.write_all(&len)?;
    s.write_all(&frame_key(key, b"length", &len, &[]))?;
    s.write_all(body)
}
fn say(event: &Mutex<Option<Box<EventFn>>>, v: Value) { if let Some(e) = event.lock().unwrap().as_ref() { e(v); } }
fn file_of(kind: &str, name: &str) -> Option<std::path::PathBuf> {
    let n = store::safe(name)?;
    let p = std::path::Path::new(&n);
    match kind {
        "media" if store::kind_of(p).is_some() => Some(store::dirs().media.join(n)),
        "voice" if n.to_ascii_lowercase().ends_with(".m4a") => Some(store::dirs().voice.join(n)),
        _ => None,
    }
}
fn serve(mut s: TcpStream, from: SocketAddr, code: &Mutex<Code>, merge: &Mutex<Option<Box<MergeFn>>>, event: &Mutex<Option<Box<EventFn>>>) -> std::io::Result<()> {
    if !private(&from.ip()) { return Ok(()); }
    s.set_read_timeout(Some(Duration::from_secs(5)))?;
    s.set_write_timeout(Some(Duration::from_secs(120)))?;
    let mut head = read_n(&mut s, 6)?;
    if &head[..4] != b"MFT2" || !(8..=40).contains(&head[5]) { return Ok(()); }
    let ty = head[4];
    let dev = read_n(&mut s, head[5] as u64)?;
    if !dev.iter().all(u8::is_ascii_alphanumeric) { return Ok(()); }
    head.extend_from_slice(&dev);
    head.extend_from_slice(&read_n(&mut s, 32)?);
    let dev = String::from_utf8(dev).map_err(std::io::Error::other)?;
    let max_len = match ty {
        PAIR | HELLO | GET => 16 * 1024,
        SYNC => 64 * 1024 * 1024,
        PUT => MAX_BODY,
        _ => return s.write_all(&[FAIL]),
    };
    let ph = if ty == PAIR { None } else { phone(&dev) };
    let pairing_code = if ty == PAIR {
        let mut g = code.lock().unwrap();
        if Instant::now() >= g.until || g.code.is_none() { return s.write_all(&[BADCODE]); }
        if g.tries >= 8 { g.code = None; return s.write_all(&[LOCKED]); }
        g.tries += 1;
        g.code.clone()
    } else { None };
    let key = match &pairing_code {
        Some(c) => pair_key(c, &id()),
        None => {
            let Some(key) = ph.as_ref().and_then(|p| p.get("key")).and_then(Value::as_str).and_then(|k| b64().decode(k).ok()).filter(|k| k.len() == 32) else { return s.write_all(&[NOAUTH]); };
            key
        }
    };
    let mut nonce = [0u8; 32];
    getrandom::getrandom(&mut nonce).map_err(|_| std::io::Error::other("OS RNG unavailable"))?;
    let request = frame_key(&key, b"miftah-v2/request", &nonce, &head);
    let response = frame_key(&key, b"miftah-v2/response", &nonce, &head);
    s.write_all(&[OK])?; s.write_all(&nonce)?; s.write_all(&sub(&response, "challenge"))?;
    let mut lb = [0u8; 4]; s.read_exact(&mut lb)?;
    let mut tag = [0u8; 32]; s.read_exact(&mut tag)?;
    let mut mac = HmacSha::new_from_slice(&request).unwrap();
    mac.update(b"length"); mac.update(&lb);
    let unauth = if ty == PAIR { BADCODE } else { NOAUTH };
    if mac.verify_slice(&tag).is_err() { reply(&mut s, unauth); return Ok(()); }
    let len = u32::from_be_bytes(lb) as u64;
    if !(64..=max_len).contains(&len) { reply(&mut s, FAIL); return Ok(()); }
    s.set_read_timeout(Some(Duration::from_secs(60)))?;
    let body = read_n(&mut s, len)?;
    let Some(plain) = open(&request, &body) else { reply(&mut s, unauth); return Ok(()) };
    if let Some(c) = pairing_code { return pair(&mut s, &dev, &plain, &response, code, &c, event); }
    let ph = ph.unwrap();
    let q = |b: &[u8]| serde_json::from_slice::<Value>(b).unwrap_or(Value::Null);
    match ty {
        HELLO => {
            touch(&dev, q(&plain).get("name").and_then(|v| v.as_str()).map(String::from));
            let a = json!({ "id": id(), "name": name(), "media": store::names(&store::dirs().media), "voice": store::names(&store::dirs().voice) });
            reply_sealed(&mut s, &response, &seal(&response, a.to_string().as_bytes())?)?;
            say(event, json!({ "link": "hello", "name": ph.get("name") }));
        }
        GET => {
            let r = q(&plain);
            let f = file_of(r["kind"].as_str().unwrap_or(""), r["name"].as_str().unwrap_or(""));
            match f.filter(|f| f.is_file() && std::fs::metadata(f).map(|m| m.len() < MAX_BODY - 1024).unwrap_or(false)).and_then(|f| std::fs::read(f).ok()) {
                Some(b) => reply_sealed(&mut s, &response, &seal(&response, &b)?)?,
                None => reply(&mut s, FAIL),
            }
        }
        PUT => {
            if plain.len() < 4 { reply(&mut s, FAIL); return Ok(()); }
            let hl = u32::from_be_bytes([plain[0], plain[1], plain[2], plain[3]]) as usize;
            if hl > plain.len() - 4 { reply(&mut s, FAIL); return Ok(()); }
            let r = q(&plain[4..4 + hl]);
            let Some(f) = file_of(r["kind"].as_str().unwrap_or(""), r["name"].as_str().unwrap_or("")) else { reply(&mut s, FAIL); return Ok(()) };
            if !f.exists() {
                let mut tmp_os = f.as_os_str().to_os_string();
                tmp_os.push(".tmp");
                let tmp = std::path::PathBuf::from(tmp_os);
                if std::fs::write(&tmp, &plain[4 + hl..]).is_ok() { let _ = std::fs::rename(&tmp, &f); }
            }
            reply_sealed(&mut s, &response, &seal(&response, b"ok")?)?;
        }
        SYNC => {
            let pname = ph.get("name").and_then(|v| v.as_str()).unwrap_or("").to_string();
            let answer = merge.lock().unwrap().as_ref().and_then(|m| m(String::from_utf8_lossy(&plain).into_owned(), pname));
            match answer {
                Some(a) => { touch(&dev, None); reply_sealed(&mut s, &response, &seal(&response, a.as_bytes())?)?; }
                None => reply(&mut s, FAIL),
            }
        }
        _ => reply(&mut s, FAIL),
    }
    Ok(())
}
fn pair(s: &mut TcpStream, dev: &str, plain: &[u8], response: &[u8], code: &Mutex<Code>, expected_code: &str, event: &Mutex<Option<Box<EventFn>>>) -> std::io::Result<()> {
    let q: Value = serde_json::from_slice(plain).map_err(std::io::Error::other)?;
    let mut pname: String = q.get("name").and_then(|v| v.as_str()).filter(|n| !n.is_empty()).unwrap_or("Phone").to_string();
    if pname.chars().count() > 60 { pname = pname.chars().take(60).collect(); }
    let mut token = [0u8; 32];
    getrandom::getrandom(&mut token).map_err(|_| std::io::Error::other("OS RNG unavailable"))?;
    let key = b64().encode(token);
    let a = json!({ "id": id(), "name": name(), "key": key });
    let body = seal(response, a.to_string().as_bytes())?;
    {
        let mut g = code.lock().unwrap();
        if g.code.as_deref() != Some(expected_code) || Instant::now() >= g.until { reply(s, BADCODE); return Ok(()); }
        let _phones = PHONE_WRITE.lock().unwrap();
        let mut l: Vec<_> = phones().into_iter().filter(|p| p.get("id").and_then(|v| v.as_str()) != Some(dev)).collect();
        l.push(json!({ "id": dev, "name": pname, "key": key, "protocol": 2, "since": store::now_ms() }).as_object().unwrap().clone());
        if !keep(l) { reply(s, FAIL); return Ok(()); }
        g.code = None;
    }
    reply_sealed(s, response, &body)?;
    say(event, json!({ "link": "paired", "name": pname }));
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn frame_keys_bind_both_nonces_header_and_direction() {
        let key = [4; 32];
        let mut header = b"MFT2\x02\x08test0001".to_vec(); header.extend_from_slice(&[5; 32]);
        let nonce = [6; 32];
        let label = b"miftah-v2/request";
        let original = frame_key(&key, label, &nonce, &header);
        let sealed = seal(&original, b"record").unwrap();
        assert!(open(&frame_key(&key, b"miftah-v2/response", &nonce, &header), &sealed).is_none());
        assert!(open(&frame_key(&key, label, &[8; 32], &header), &sealed).is_none());
        header[4] = 3;
        assert!(open(&frame_key(&key, label, &nonce, &header), &sealed).is_none());
        header[4] = 2; header[14] = 9;
        assert!(open(&frame_key(&key, label, &nonce, &header), &sealed).is_none());
    }

    #[test]
    fn seal_open_roundtrip_and_tamper() {
        let key = pair_key("123456", "pc01");
        assert_eq!(key.len(), 32);
        let msg = b"hello miftah family record";
        let ct = seal(&key, msg).unwrap();
        assert_eq!(open(&key, &ct).as_deref(), Some(&msg[..]));

        let mut flipped = ct.clone();
        flipped[20] ^= 0x01;
        assert!(open(&key, &flipped).is_none());

        let mut bad_mac = ct.clone();
        let last = bad_mac.len() - 1;
        bad_mac[last] ^= 0x80;
        assert!(open(&key, &bad_mac).is_none());

        let wrong_key = pair_key("654321", "pc01");
        assert!(open(&wrong_key, &ct).is_none());
    }

    #[test]
    fn private_ip_classification() {
        assert!(private(&IpAddr::V4(Ipv4Addr::new(192, 168, 1, 10))));
        assert!(private(&IpAddr::V4(Ipv4Addr::new(10, 0, 0, 5))));
        assert!(private(&IpAddr::V4(Ipv4Addr::new(172, 16, 0, 1))));
        assert!(!private(&IpAddr::V4(Ipv4Addr::new(172, 32, 0, 1))));
        assert!(!private(&IpAddr::V4(Ipv4Addr::new(8, 8, 8, 8))));
    }
}
