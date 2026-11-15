/* Updates, only when the family wants them.
   Nothing is checked unless a grown-up presses Check, or turns on the weekly check (off by default). A check reads one small
   file, version.json, from the latest release on GitHub; the native side compares it with this build's own number.
   Installing downloads the new file, checks its SHA-256 against version.json, and hands it over:
   - Android: the system's own installer, which also refuses any file not signed with this app's key;
   - Windows: the program file is swapped once Miftāḥ closes, and it opens again.
   The family's record is never touched: it lives apart from the program, on both. */
(function () {
  'use strict';
  var A = window.A, L = A.L, esc = A.esc;
  var U = window.Upd = { state: 'idle', info: null, cur: null, p: 0 };
  var WEEK = 7 * 864e5;
  function S() { if (!A.S.upd || typeof A.S.upd !== 'object') A.S.upd = { auto: false, last: 0 }; return A.S.upd; }
  U.can = function () { return A.N.has(); };
  U.platform = function () { return window.DeskBridge ? 'windows' : 'android'; };
  function name() { return (U.cur && U.cur.name) || A.N.call('version') || ''; }
  function ic(d, s) { return '<svg class="ic" viewBox="0 0 24 24" width="' + (s || 18) + '" height="' + (s || 18) + '" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var I = { up: '<path d="M12 16V5M7 9.5l5-5 5 5M5 20h14"/>', ok: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', spin: '<path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4.5h-4.5"/>' };

  /* ---------- the card, on the phone's Settings and the computer's This computer page ---------- */
  U.card = function (where) {
    var st = U.state, v = U.info, lbl, act = '';
    var btn = function (id, cls, icon, t) { return '<button class="btn ' + cls + '" id="' + id + '">' + (icon ? ic(I[icon], 18) : '') + '<span>' + esc(t) + '</span></button>'; };
    if (st === 'checking') { lbl = L(['Checking…', 'جارٍ التحقق…']); act = '<span class="upd-spin">' + ic(I.spin, 20) + '</span>'; }
    else if (st === 'latest') { lbl = L(['Up to date', 'أحدث إصدار']); act = btn('upd-chk', 'ghost sm', '', L(['Check again', 'تحقق مجددًا'])); }
    else if (st === 'ready') { lbl = L(['Version ' + v.name + ' is ready', 'الإصدار ' + A.num(v.name) + ' جاهز']); act = btn('upd-go', 'pri', 'up', L(['Update', 'حدّث'])); }
    else if (st === 'downloading') { lbl = L(['Downloading version ' + v.name, 'تنزيل الإصدار ' + A.num(v.name)]); act = '<span class="upd-pct">' + A.num(Math.round(U.p * 100)) + '%</span>'; }
    else if (st === 'allow') { lbl = L(['Allow Miftāḥ to install updates, then Update', 'اسمح لمفتاح بتثبيت التحديثات ثم حدّث']); act = btn('upd-go', 'pri', 'up', L(['Update', 'حدّث'])); }
    else if (st === 'installing') { lbl = U.platform() === 'windows' ? L(['Closing to update…', 'يُغلق ليُحدَّث…']) : L(['Continue in the installer', 'تابع في المثبّت']); act = '<span class="upd-ok">' + ic(I.ok, 20) + '</span>'; }
    else if (st === 'checksum' || st === 'failed') { lbl = st === 'checksum' ? L(['The download did not match. Nothing was changed.', 'لم يطابق التنزيل. لم يتغير شيء.']) : L(['The download did not finish. Nothing was changed.', 'لم يكتمل التنزيل. لم يتغير شيء.']); act = btn('upd-go', 'ghost sm', '', L(['Try again', 'أعد المحاولة'])); }
    else if (st === 'error') { lbl = L(['Could not reach GitHub', 'تعذّر الوصول إلى GitHub']); act = btn('upd-chk', 'ghost sm', '', L(['Try again', 'أعد المحاولة'])); }
    else { lbl = ''; act = btn('upd-chk', 'ghost sm', '', L(['Check for updates', 'ابحث عن تحديث'])); }
    var ready = st === 'ready' || st === 'allow' || st === 'downloading';
    return '<section class="card upd' + (ready ? ' on' : '') + '" data-upd="' + esc(where) + '"><h3>' + ic(I.up, 18) + ' ' + esc(L(['Updates', 'التحديثات'])) + '</h3>' +
      '<div class="upd-row"><span class="upd-v"><b>Miftāḥ ' + esc(A.num(name())) + '</b>' + (lbl ? '<small>' + esc(lbl) + '</small>' : '') + '</span>' + act + '</div>' +
      (st === 'downloading' ? '<div class="upd-bar"><i style="width:' + Math.round(U.p * 100) + '%"></i></div>' : '') +
      (ready && v.notes && v.notes.length ? '<ul class="upd-notes">' + v.notes.slice(0, 4).map(function (n) { return '<li>' + esc(L(n)) + '</li>'; }).join('') + '</ul>' : '') +
      '<button class="li upd-auto" id="upd-auto"><span class="grow"><b>' + esc(L(['Check once a week', 'تحقق مرة في الأسبوع'])) + '</b></span><span class="switch' + (S().auto ? ' on' : '') + '"></span></button></section>';
  };
  function bind() {
    document.querySelectorAll('[data-upd]').forEach(function (c) {
      var chk = c.querySelector('#upd-chk'), go = c.querySelector('#upd-go'), au = c.querySelector('#upd-auto');
      if (chk) chk.onclick = U.check;
      if (go) go.onclick = U.install;
      if (au) au.onclick = function () { S().auto = !S().auto; A.saveNow(); paint(); };
    });
  }
  U.bind = bind;
  function paint() {
    /* only the body is redrawn: the heading stays, so a folded settings section keeps its fold and its open state */
    document.querySelectorAll('[data-upd]').forEach(function (el) {
      var t = document.createElement('div'); t.innerHTML = U.card(el.dataset.upd); var n = t.firstChild;
      Array.prototype.slice.call(el.children).forEach(function (c) { if (c.tagName !== 'H3') c.remove(); });
      Array.prototype.slice.call(n.children).forEach(function (c) { if (c.tagName !== 'H3') el.appendChild(c); });
      el.classList.toggle('on', n.classList.contains('on'));
    });
    bind(); pill();
  }

  /* ---------- the flow ---------- */
  U.check = function () {
    if (!U.can()) return;
    U.state = 'checking'; paint(); S().last = Date.now(); A.saveNow();
    if (A.N.call('updateCheck') === false) { U.state = 'error'; paint(); }
  };
  U.onCheck = function (json) {
    var r = null; try { r = typeof json === 'string' ? JSON.parse(json) : json; } catch (e) { }
    if (!r || !r.latest || !r.current) { U.state = 'error'; paint(); return; }
    U.info = r.latest; U.cur = r.current;
    U.state = (+U.info.code || 0) > (+U.cur.code || 0) && U.info[U.platform()] ? 'ready' : 'latest';
    paint();
  };
  U.install = function () {
    var f = U.info && U.info[U.platform()]; if (!f) return;
    U.state = 'downloading'; U.p = 0; paint();
    if (A.N.call('updateInstall', f.url, f.sha256) === false) { U.state = 'failed'; paint(); }
  };
  U.onProgress = function (p) {
    U.p = Math.max(0, Math.min(1, +p || 0));
    document.querySelectorAll('.upd-bar i').forEach(function (b) { b.style.width = Math.round(U.p * 100) + '%'; });
    document.querySelectorAll('.upd-pct').forEach(function (n) { n.textContent = A.num(Math.round(U.p * 100)) + '%'; });
  };
  U.onDone = function (status) { U.state = status === 'ok' ? 'installing' : status === 'allow' ? 'allow' : status === 'checksum' ? 'checksum' : 'failed'; paint(); };

  /* ---------- the pill: a quiet sign on the grown-up screens, only once something is ready ---------- */
  function pill() {
    var p = document.getElementById('upd-pill'), show = (U.state === 'ready' || U.state === 'allow') && /^(parent|desk)$/.test(document.body && document.body.dataset.view || '') && !document.querySelector('[data-upd]');
    if (!show) { if (p) p.remove(); return; }
    if (!p) { p = document.createElement('a'); p.id = 'upd-pill'; p.className = 'upd-pill'; document.body.appendChild(p); }
    p.href = window.DeskBridge ? '#/desk/pc' : '#/parent/settings';
    p.innerHTML = '<i></i><span>' + esc(L(['Version ' + U.info.name + ' is ready', 'الإصدار ' + A.num(U.info.name) + ' جاهز'])) + '</span>';
  }
  addEventListener('hashchange', function () { setTimeout(pill, 60); });
  /* the weekly check, if a grown-up turned it on: quietly, a little after start, at most once a week */
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () { if (U.can() && S().auto && Date.now() - (S().last || 0) > WEEK) U.check(); }, 12000);
  });
})();
