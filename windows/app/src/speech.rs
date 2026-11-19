//! The computer's own voice, for the few things the app lets a device voice say: the names and sounds of the Arabic letters
//! that have no real recording yet (web/js/core/voice.js decides; Qurʾān and duʿāʾ are only ever real recordings).
//! Windows' speech voices (Hoda and Naayf for Arabic, among others) speak into a WAV, which goes back to the page as base64
//! and plays like any recording. Everything runs on its own thread with WinRT started there, so the window never waits on COM.
use windows::core::{Interface, HSTRING};
use windows::Media::SpeechSynthesis::SpeechSynthesizer;
use windows::Storage::Streams::DataReader;
use windows::Win32::System::WinRT::{RoInitialize, RO_INIT_MULTITHREADED};
use windows_future::IAsyncOperation;

fn on_thread<T: Send + 'static>(f: impl FnOnce() -> windows::core::Result<T> + Send + 'static) -> Option<T> {
    std::thread::spawn(move || { unsafe { let _ = RoInitialize(RO_INIT_MULTITHREADED); } f().ok() }).join().ok().flatten()
}

/// the languages there is a voice for, of the two the app speaks: "ar", "en"
pub fn langs() -> Vec<String> {
    on_thread(|| {
        let mut ar = false; let mut en = false;
        for v in SpeechSynthesizer::AllVoices()? {
            let l = v.Language()?.to_string().to_lowercase();
            if l.starts_with("ar") { ar = true; }
            if l.starts_with("en") { en = true; }
        }
        Ok([("ar", ar), ("en", en)].iter().filter(|x| x.1).map(|x| x.0.to_string()).collect::<Vec<_>>())
    }).unwrap_or_default()
}

/// `text` spoken in `lang` ("ar" or "en") as WAV bytes, or None where this computer has no voice for it
pub fn wav(text: String, lang: String) -> Option<Vec<u8>> {
    if text.trim().is_empty() || text.chars().count() > 200 { return None; }
    on_thread(move || {
        let want = if lang == "ar" { "ar" } else { "en" };
        let voices = SpeechSynthesizer::AllVoices()?;
        let mut pick = None;
        for v in &voices {
            let l = v.Language()?.to_string().to_lowercase();
            /* Saudi Arabic first for Arabic; British English first for English, as the app's own English is British */
            let best = if want == "ar" { l == "ar-sa" } else { l == "en-gb" };
            if l.starts_with(want) && (pick.is_none() || best) { pick = Some(v.clone()); if best { break; } }
        }
        let Some(voice) = pick else { return Ok(None) };
        let s = SpeechSynthesizer::new()?;
        s.SetVoice(&voice)?;
        if let Ok(o) = s.Options() { let _ = o.SetSpeakingRate(0.85); }
        let stream = s.SynthesizeTextToStreamAsync(&HSTRING::from(text))?.get()?;
        let n = stream.Size()? as u32;
        let r = DataReader::CreateDataReader(&stream.GetInputStreamAt(0)?)?;
        r.LoadAsync(n)?.cast::<IAsyncOperation<u32>>()?.get()?;
        let mut buf = vec![0u8; n as usize];
        r.ReadBytes(&mut buf)?;
        Ok(Some(buf))
    }).flatten()
}
