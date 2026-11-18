/* Miftah for Windows: runs before the page's own scripts. It gives the page the same bridge the Android app gives it,
   so the lessons, the record and the family file behave identically, and marks the page as running on a computer. */
(function () {
  'use strict';
  /* the app's own page only: not a simulation or a video inside it, which have no bridge */
  if (location.origin !== 'https://miftah.example' || window.top !== window || !(window.chrome && chrome.webview)) return;
  window.MIFTAH_DESKTOP = true;
  /* the document may not exist yet at this point */
  var mark = function () { document.documentElement.classList.add('is-desk'); };
  if (document.documentElement) mark(); else document.addEventListener('readystatechange', mark, { once: true });
  try { localStorage.removeItem('miftah.v1'); } catch (e) { }
  /* every call goes to the program (windows/app/src/bridge.rs) as one small request and waits for its answer, as the phone's does */
  function call(fn, args) {
    try {
      var x = new XMLHttpRequest();
      x.open('POST', '/__bridge/' + fn, false);
      x.setRequestHeader('X-Miftah', '1');
      x.setRequestHeader('Content-Type', 'application/json');
      x.send(JSON.stringify(args || []));
      if (x.status !== 200) return undefined;
      var o = JSON.parse(x.responseText);
      return 'r' in o ? o.r : undefined;
    } catch (e) { console.warn('bridge ' + fn, e); return undefined; }
  }
  var native = function () { return window.__native || {}; };

  /* recording: the browser's own recorder, AAC in an MP4 box like the phone's, handed to the app when it stops */
  var rec = null, chunks = [], recKey = null, mic = null;
  function recType() { var t = ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/webm;codecs=opus', 'audio/webm']; for (var i = 0; i < t.length; i++) if (window.MediaRecorder && MediaRecorder.isTypeSupported(t[i])) return t[i]; return ''; }
  function recStart(key) {
    recKey = key; chunks = [];
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }).then(function (s) {
      mic = s; var type = recType();
      rec = new MediaRecorder(s, type ? { mimeType: type, audioBitsPerSecond: 96000 } : undefined);
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = function () {
        var b = new Blob(chunks, { type: rec && rec.mimeType || 'audio/mp4' }), k = recKey; chunks = [];
        if (mic) mic.getTracks().forEach(function (t) { t.stop(); }); mic = null;
        var r = new FileReader();
        r.onload = function () { var ok = call('voiceSave', [k, String(r.result).split(',')[1] || '']); if (ok && window.Voice && Voice.refreshVoices) Voice.refreshVoices(); };
        r.readAsDataURL(b);
      };
      rec.start(250);
      if (native().onMic) native().onMic(true, false);
    }).catch(function () { if (native().onMic) native().onMic(false, false); if (window.A && A.micHelp) A.micHelp(); });
    return true;
  }
  function recStop() { if (rec && rec.state !== 'inactive') rec.stop(); rec = null; }

  var names = ['ready', 'saveState', 'loadState', 'version', 'haptic', 'lastTheme', 'rememberTheme', 'setSystemBars', 'speak', 'speakStop', 'micAllowed', 'openAppSettings',
    'voiceList', 'audioKeep', 'audioStats', 'audioClear', 'sync', 'requestNotifications', 'pinWidget', 'exportFile', 'shareFamily', 'shareImage', 'shareChallenge',
    'exportFamily', 'mediaPickType', 'mediaPick', 'mediaDelete', 'importFile', 'openUrl', 'updateCheck', 'updateInstall'];
  /* what only a computer can do (web/js/core/desk.js) */
  var desk = ['voiceSave', 'deskInfo', 'deskSet', 'deskZoom', 'pairCode', 'pairEnd', 'forgetPhone', 'rename', 'titleBar', 'openFolder', 'backup',
    'install', 'quit', 'unlocked', 'savePdf', 'reveal', 'openPdf'];
  var B = {}, D = {};
  names.concat(desk).forEach(function (n) { D[n] = B[n] = function () { return call(n, Array.prototype.slice.call(arguments)); }; });
  B.recStart = recStart; B.recStop = recStop;
  /* the page lays the sheet out, then Windows' print window takes it (with Save as PDF); Desk can ask for a PDF straight to Documents instead */
  B.printPage = function (name) {
    var pdf = window.Desk && Desk._pdf; if (window.Desk) Desk._pdf = false;
    setTimeout(function () {
      if (pdf) { call('savePdf', [name || 'Miftah']); return; }
      var t = document.title; document.title = name || 'Miftah';
      window.print();
      document.title = t;
      if (native().onResume) native().onResume();
    }, 30);
    return true;
  };
  window.AndroidBridge = B;
  window.DeskBridge = D;

  /* files dropped anywhere on the window: a family file joins, a photo or video goes to the media library */
  function stop(e) { if (e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; (document.documentElement && document.documentElement.classList.add('dropping')); } }
  addEventListener('dragenter', stop); addEventListener('dragover', stop);
  addEventListener('dragleave', function (e) { if (!e.relatedTarget) document.documentElement.classList.remove('dropping'); });
  addEventListener('drop', function (e) {
    document.documentElement.classList.remove('dropping');
    if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) return;
    e.preventDefault();
    chrome.webview.postMessageWithAdditionalObjects('drop', e.dataTransfer.files);
  });
})();
