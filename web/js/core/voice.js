/* Voices. Qurʾān and duʿāʾ are only ever real recordings. Everything else speaks with the parent's recording if there is one,
   then a real recording of the word; the device voice only fills in an Arabic letter's name or sound. Word index skips Tanzil's
   standalone pause marks, which are not words. */
(function () {
  'use strict';
  var A = window.A;
  var V = window.Voice = {};
  var audio = null, endCb = null, sayCb = null, have = {};
  V.web = {
    h: 'https://everyayah.com/data/Husary_Muallim_128kbps/', a: 'https://everyayah.com/data/Alafasy_128kbps/',
    w: 'https://audio.qurancdn.com/wbw/', d: 'https://www.hisnmuslim.com/audio/ar/'
  };
  V.url = function (dir, file) {
    if (window.MIFTAH_WEB_AUDIO) return V.web[dir] + file;
    /* inside the app: adhkār and al-Ḥuṣarī's Juzʾ ʿAmma ship with it. Other recordings are fetched once by the app, from their source, and kept. */
    /* the sūrah is the first three digits: '002001.mp3' is al-Baqarah, not verse 2001 of anything (reading it whole sent 2 to 77 to files that do not exist) */
    var s = parseInt(String(file).slice(0, 3), 10);
    if (dir === 'd' || (dir === 'h' && (s === 1 || s >= 78))) return 'audio/' + dir + '/' + file.replace('.mp3', '.ogg');
    return A.N.has() ? 'audio/' + dir + '/' + file : V.web[dir] + file;
  };
  /* before a sūrah is needed, keep its recordings on the device */
  V.keep = function (surah) {
    if (!A.N.has() || !window.QURAN.q[surah]) return;
    var d3 = function (n) { return ('00' + n).slice(-3); }, list = [], r = A.S.reciter || 'h', su = window.QURAN.q[surah];
    su.v.forEach(function (v) {
      if (!(r === 'h' && (surah === 1 || surah >= 78))) list.push(r + '/' + d3(surah) + d3(v[0]) + '.mp3');
      V.words(v[1]).forEach(function (w, i) { list.push('w/' + d3(surah) + '_' + d3(v[0]) + '_' + d3(i + 1) + '.mp3'); });
    });
    A.N.call('audioKeep', JSON.stringify(list));
  };
  V.stats = function () { try { return JSON.parse(A.N.call('audioStats') || '{}'); } catch (e) { return {}; } };
  V.available = function () { return window.MIFTAH_NO_AUDIO !== true; };

  V.refreshVoices = function () {
    var s = A.N.call('voiceList');
    have = {};
    if (s) { try { JSON.parse(s).forEach(function (k) { have[k] = 1; }); } catch (e) { } }
    V.refreshLangs();
  };
  /* the device's own voice, by language: a phone's text-to-speech or Windows' speech voices. It is only ever used for the
     names and sounds of the Arabic letters that have no real recording (see V.deviceFor); never for Qurʾān, duʿāʾ or dīn. */
  var langs = {};
  V.refreshLangs = function () { var l = A.N.call('speakLangs'); langs = {}; String(l || '').split(',').forEach(function (k) { if (k) langs[k] = 1; }); return langs; };
  V.deviceHas = function (lang) { return !!langs[lang || 'ar']; };
  /* a phone's voice starts up a moment after the app, and says so */
  window.__native.onSpeakLangs = function () { V.refreshLangs(); };
  V.hasVoice = function (k) { return !!have[k]; };
  V.recKey = function (pid, s, a) { return 'rec_' + pid + '_' + s + '_' + a; };
  V.hasRec = function (pid, s, a) { return V.hasVoice(V.recKey(pid, s, a)); };
  V.keyOf = function (text) { var h = 0; for (var i = 0; i < text.length; i++) { h = (h * 31 + text.charCodeAt(i)) | 0; } return 'p' + (h >>> 0).toString(36); };

  function stopAudio() { if (audio) { try { audio.pause(); } catch (e) { } audio.onended = audio.onerror = null; audio.removeAttribute('src'); audio = null; } if (endCb) { var c = endCb; endCb = null; c(false); } }
  V.stop = function () {
    stopAudio();
    if (sayCb) { var c = sayCb; sayCb = null; A.N.call('speakStop'); c(false); }
  };
  V.play = function (url, opts) {
    opts = opts || {};
    V.stop();
    return new Promise(function (res) {
      if (!V.available()) { res(false); return; }
      audio = new Audio(url);
      endCb = res;
      if (opts.rate) audio.playbackRate = opts.rate;
      audio.onended = function () { var c = endCb; endCb = null; if (c) c(true); };
      audio.onerror = function () {
        console.info('audio failed ' + url);
        if (/^audio\/.*\.mp3$/.test(url)) A.toast(A.L(['This recording needs the internet once. After that it stays on this device.', 'يحتاج هذا التسجيل إلى الإنترنت مرة واحدة، ثم يبقى على الجهاز.']));
        var c = endCb; endCb = null; if (c) c(false);
      };
      audio.onplaying = function () { console.info('audio playing ' + url); };
      var p = audio.play(); if (p && p.catch) p.catch(function () { var c = endCb; endCb = null; if (c) c(false); });
    });
  };
  V.ayah = function (s, a, opts) { opts = opts || {}; return V.play(V.url(opts.r || A.S.reciter || 'h', ('00' + s).slice(-3) + ('00' + a).slice(-3) + '.mp3'), opts); };
  V.word = function (s, a, i) { return V.play(V.url('w', ('00' + s).slice(-3) + '_' + ('00' + a).slice(-3) + '_' + ('00' + i).slice(-3) + '.mp3')); };
  V.dua = function (id) { return V.play(V.url('d', id + '.mp3')); };

  /* speech is a real person wherever there is one: a parent's recording first, then a real recording of that word. Only where
     neither exists, and only for an Arabic letter's name or sound, the device's own voice; otherwise silence, and a grown-up says it. */
  var probing = null;
  V.real = function (text) { if (!window.SPEECH) return null; var w = String(text).trim().replace(/[.,!?;:،؟“”"]/g, ''); if (!/[؀-ۿ]/.test(w)) w = w.toLowerCase(); return window.SPEECH[w] != null ? 'audio/s/' + window.SPEECH[w] + '.ogg' : null; };
  /* a letter's name (بَاء) is recorded under the letter itself (ب): lessons pass the letter in their key, ar_ب */
  function realOf(text, opts) { var r = V.real(text); if (!r && opts && /^ar_.$/.test(opts.key || '')) r = V.real(opts.key.slice(3)); return r; }
  /* the device may speak a letter's name (key ar_ب) or a letter with its vowel (ar_بَ), and nothing else */
  V.deviceFor = function (text, opts) { return !!(opts && /^ar_.[ً-ْ]?$/.test(opts.key || '') && langs.ar && String(text).length < 24); };
  V.can = function (text, opts) { if (!text) return false; opts = opts || {}; return !!have[opts.key || V.keyOf(text)] || !!realOf(text, opts) || V.deviceFor(text, opts); };
  V.say = function (text, opts) {
    opts = opts || {};
    if (!text) return Promise.resolve(false);
    var key = opts.key || V.keyOf(text);
    if (probing) { probing.text = text; probing.ok = V.can(text, opts); return Promise.resolve(false); }
    if (have[key]) return V.play('voice/' + key + '.m4a');
    var real = realOf(text, opts); if (real) return V.play(real);
    if (V.deviceFor(text, opts)) return V.device(text, 'ar');
    return Promise.resolve(false);
  };
  /* Windows hands back a WAV to play like a recording; a phone speaks itself and calls back when it is done */
  V.device = function (text, lang) {
    V.stop();
    if (!V.available()) return Promise.resolve(false);
    var wav = A.N.call('speakWav', text, lang);
    if (wav) return V.play('data:audio/wav;base64,' + wav);
    if (wav === '') return Promise.resolve(false);
    return new Promise(function (res) { sayCb = res; A.N.call('speak', text, lang, 0.85); });
  };
  /* a question built on hearing, with nothing real to hear: a grown-up becomes the voice */
  V.adapt = function (s) {
    if (!s || s._ad) return s;
    var t = null, ok = true;
    if (typeof s.listen === 'function') { probing = {}; try { s.listen({}); } catch (e) { } t = probing.text; ok = probing.ok !== false; probing = null; }
    else if (s.k === 'build' && (s.say || s.joined) && s.listen !== false) { t = s.say || s.joined; ok = V.can(t, { key: s.vk }); }
    if (ok) return s;
    var en = s.p && s.p[0] || '', asksToHear = /hear/i.test(en);
    var o = Object.assign({}, s, { _ad: 1, listen: s.k === 'build' ? false : undefined, autoListen: false });
    if (asksToHear) { o.p = ['A grown-up says a word. ' + en.replace(/^(Which|What) (.+?) do you hear\??$/i, '$1 $2 is it?').replace(/\s*you hear\.?/i, '').replace(/^Which word do\??$/i, 'Find it.'), 'يقول أحد الكبار كلمة، فجدها.']; o.gu = t; }
    return o;
  };
  window.__native.onSpeakEnd = function () { var c = sayCb; sayCb = null; if (c) c(true); };

  /* the tokens of a verse that are words, with their recording index */
  V.words = function (text) {
    var out = [], i = 0;
    text.split(' ').forEach(function (t) { if (/[ء-يٮ-ۓۺ-ۿ]/.test(t)) { i++; out.push({ t: t, i: i }); } else if (out.length) out[out.length - 1].t += ' ' + t; });
    return out;
  };
  V.hijri = function (when) {
    try {
      var f = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
      if (!/^islamic/.test(f.resolvedOptions().calendar)) return '';
      var parts = {}; f.formatToParts(when || A.now()).forEach(function (p) { parts[p.type] = parseInt(p.value, 10); });
      var EN = ['Muḥarram', 'Ṣafar', 'Rabīʿ al-Awwal', 'Rabīʿ ath-Thānī', 'Jumādā al-Ūlā', 'Jumādā al-Ākhirah', 'Rajab', 'Shaʿbān', 'Ramaḍān', 'Shawwāl', 'Dhū al-Qaʿdah', 'Dhū al-Ḥijjah'];
      var AR = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
      if (!(parts.month >= 1 && parts.month <= 12) || !parts.day) return '';
      return A.num(parts.day) + ' ' + (A.ar() ? AR : EN)[parts.month - 1];
    } catch (e) { return ''; }
  };
  /* both calendars for one day: { g: 'Thursday 13 November', h: '22 Jumādā al-Ūlā 1448 AH' }. h is '' where the device has no
     Islamic calendar; g is always there. short: 'Thu 13 Nov' for tight places. */
  V.dates = function (short, when) {
    var d = when || A.now(), g = '', h = '';
    try { g = d.toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en-GB', short ? { weekday: 'short', day: 'numeric', month: 'short' } : { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) { g = d.toDateString(); }
    try {
      var f = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
      if (/^islamic/.test(f.resolvedOptions().calendar)) {
        var y = 0; f.formatToParts(d).forEach(function (p) { if (p.type === 'year') y = parseInt(p.value, 10); });
        var dm = V.hijri(d); if (dm) h = dm + (y ? ' ' + A.num(y) + (A.ar() ? 'هـ' : ' AH') : '');
      }
    } catch (e) { }
    return { g: g, h: h };
  };
  /* the two as one line of HTML, each its own piece so a narrow screen wraps between them, never inside one */
  V.dateLine = function (short) { var x = V.dates(short); return '<span class="dl-g">' + A.esc(x.g) + '</span>' + (x.h ? '<span class="dl-h">' + A.esc(x.h) + '</span>' : ''); };
})();
