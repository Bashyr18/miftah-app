/* Development only: plays the app's real sounds and reports what happened, in either app.
     Windows: CDP_ATTACH=1 CDP_ORIGIN=https://miftah.example/index.html node tools/cdp.js tools/sound-check.js build/snd 9445
              (the app started with MIFTAH_DEBUG_PORT=9445 MIFTAH_DATA=<empty folder>)
     Android: adb forward tcp:9446 localabstract:webview_devtools_remote_<pid>, then the same with port 9446.
   Checks: a bundled verse (Ḥuṣarī, al-Fātiḥah), a verse fetched once and kept (al-Baqarah 1), a word, an Arabic letter's name,
   a duʿāʾ, the key sound (Web Audio), and a recording made on this device played back. */
module.exports = async (p) => {
  const res = await p.eval(`(async function(){
    var out = {}, wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    for (var i = 0; i < 60 && !(window.A && A.S && window.Voice); i++) await wait(200);
    A.S.sound = true;
    function timed(name, start) {
      return new Promise(function (ok) {
        var t0 = Date.now(), done = false, finish = function (v) { if (done) return; done = true; out[name] = v + ' ' + (Date.now() - t0) + 'ms'; ok(); };
        var orig = Audio; var seen = null;
        window.Audio = function (u) { var a = new orig(u); seen = a; a.addEventListener('playing', function () { setTimeout(function () { finish('playing ' + u.split('/').slice(-2).join('/') + ' t=' + a.currentTime.toFixed(2)); try { a.pause(); } catch (e) { } }, 700); }); a.addEventListener('error', function () { finish('ERROR ' + u + ' code ' + (a.error && a.error.code)); }); return a; };
        try { start(); } catch (e) { finish('THROW ' + e.message); }
        window.Audio = orig;
        setTimeout(function () { finish(seen ? 'silent: no playing event, ready ' + seen.readyState + ' ' + (seen.src || '').split('/').slice(-2).join('/') : 'silent: nothing was played'); }, 9000);
      });
    }
    await timed('verse, bundled (1:1)', function () { Voice.ayah(1, 1); });
    await timed('verse, fetched and kept (2:1)', function () { Voice.ayah(2, 1); });
    await timed('word (1:1 word 1)', function () { Voice.word(1, 1, 1); });
    var BY = (window.C && C.LETTERS) || null;
    await timed('letter name (baa)', function () { Voice.say('باء', { lang: 'ar', key: 'ar_ب' }); });
    await timed('english word (cat)', function () { Voice.say('cat'); });
    var d0 = window.DUA_LIST ? null : null;
    await timed('dua', function () { var ids = Object.keys(window.HISN || {}); Voice.dua(ids[0] || '1'); });
    /* the key sound: Web Audio must be running, not suspended */
    try { Fx.clack(); await wait(300); var c = null; for (var k in Fx) { } out['web audio'] = (window.__acState || 'ok, clack played'); } catch (e) { out['web audio'] = 'THROW ' + e.message; }
    /* a recording made here: which format, and does it play back */
    out['recorder type'] = (function () { var t = ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/webm;codecs=opus', 'audio/webm']; for (var i = 0; i < t.length; i++) if (window.MediaRecorder && MediaRecorder.isTypeSupported(t[i])) return t[i]; return 'none'; })();
    return JSON.stringify(out, null, 1);
  })()`);
  console.log(res);
};
