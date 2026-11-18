//! The only two things Miftah fetches from the internet, and only when the family uses them: recitations that do not ship
//! with the app (kept after the first time), and a new version when a grown-up asks. Windows' own TLS is used.
use std::fs;
use std::io::{Read, Write};
use std::path::Path;
use std::sync::OnceLock;
use std::time::Duration;

fn agent() -> &'static ureq::Agent {
    static A: OnceLock<ureq::Agent> = OnceLock::new();
    A.get_or_init(|| {
        let tls = native_tls::TlsConnector::new().ok();
        let mut b = ureq::AgentBuilder::new().timeout_connect(Duration::from_secs(15)).timeout_read(Duration::from_secs(60)).user_agent("Miftah");
        if let Some(t) = tls { b = b.tls_connector(std::sync::Arc::new(t)); }
        b.build()
    })
}
pub fn text(url: &str, max: usize) -> Result<String, String> {
    let r = agent().get(url).call().map_err(|e| e.to_string())?;
    let mut s = String::new();
    r.into_reader().take(max as u64).read_to_string(&mut s).map_err(|e| e.to_string())?;
    Ok(s)
}
/* the whole file to `to`; progress runs from 0 to 1 when the size is known */
pub fn download(url: &str, to: &Path, progress: &dyn Fn(f64)) -> Result<(), String> {
    let r = agent().get(url).call().map_err(|e| e.to_string())?;
    let len: u64 = r.header("Content-Length").and_then(|v| v.parse().ok()).unwrap_or(0);
    let mut rd = r.into_reader();
    let mut o = fs::File::create(to).map_err(|e| e.to_string())?;
    let mut buf = vec![0u8; 256 * 1024];
    let mut got = 0u64;
    loop {
        let n = rd.read(&mut buf).map_err(|e| e.to_string())?;
        if n == 0 { break; }
        o.write_all(&buf[..n]).map_err(|e| e.to_string())?;
        got += n as u64;
        if len > 0 { progress(got as f64 / len as f64); }
    }
    if len > 0 && got != len { return Err("short".into()); }
    Ok(())
}
pub fn sha256(path: &Path) -> Option<String> {
    use sha2::{Digest, Sha256};
    let mut f = fs::File::open(path).ok()?;
    let mut h = Sha256::new();
    let mut buf = vec![0u8; 1 << 20];
    loop { let n = f.read(&mut buf).ok()?; if n == 0 { break; } h.update(&buf[..n]); }
    Some(h.finalize().iter().map(|b| format!("{:02x}", b)).collect())
}
