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
    var btn = function (a, cls, icon, t) { return '<button class="btn ' + cls + '" data-upd-act="' + a + '">' + (icon ? ic(I[icon], 18) : '') + '<span>' + esc(t) + '</span></button>'; };
    if (st === 'checking') { lbl = L(['Checking…', 'جارٍ التحقق…']); act = '<span class="upd-spin">' + ic(I.spin, 20) + '</span>'; }
    else if (st === 'latest') { lbl = L(['Up to date', 'أحدث إصدار']); act = btn('chk', 'ghost sm', '', L(['Check again', 'تحقق مجددًا'])); }
    else if (st === 'ready') { lbl = L(['Version ' + v.name + ' is ready', 'الإصدار ' + A.num(v.name) + ' جاهز']); act = btn('go', 'pri', 'up', L(['Update', 'حدّث'])); }
    else if (st === 'downloading') { lbl = L(['Downloading version ' + v.name, 'تنزيل الإصدار ' + A.num(v.name)]); act = '<span class="upd-pct">' + A.num(Math.round(U.p * 100)) + '%</span>'; }
    else if (st === 'allow') { lbl = L(['Allow Miftāḥ to install updates, then Update', 'اسمح لمفتاح بتثبيت التحديثات ثم حدّث']); act = btn('go', 'pri', 'up', L(['Update', 'حدّث'])); }
    else if (st === 'installing') { lbl = U.platform() === 'windows' ? L(['Closing to update…', 'يُغلق ليُحدَّث…']) : L(['Continue in the installer', 'تابع في المثبّت']); act = '<span class="upd-ok">' + ic(I.ok, 20) + '</span>'; }
    else if (st === 'checksum' || st === 'failed') { lbl = st === 'checksum' ? L(['The download did not match. Nothing was changed.', 'لم يطابق التنزيل. لم يتغير شيء.']) : L(['The download did not finish. Nothing was changed.', 'لم يكتمل التنزيل. لم يتغير شيء.']); act = btn('go', 'ghost sm', '', L(['Try again', 'أعد المحاولة'])); }
    else if (st === 'error') { lbl = L(['Could not reach GitHub', 'تعذّر الوصول إلى GitHub']); act = btn('chk', 'ghost sm', '', L(['Try again', 'أعد المحاولة'])); }
    else { lbl = ''; act = btn('chk', 'ghost sm', '', L(['Check for updates', 'ابحث عن تحديث'])); }
    var ready = st === 'ready' || st === 'allow' || st === 'downloading';
    return '<section class="card upd' + (ready ? ' on' : '') + '" data-upd="' + esc(where) + '"><h3>' + ic(I.up, 18) + ' ' + esc(L(['Updates', 'التحديثات'])) + '</h3>' +
      '<div class="upd-row"><span class="upd-v"><b>Miftāḥ ' + esc(A.num(name())) + '</b>' + (lbl ? '<small>' + esc(lbl) + '</small>' : '') + '</span>' + act + '</div>' +
      (st === 'downloading' ? '<div class="upd-bar"><i style="width:' + Math.round(U.p * 100) + '%"></i></div>' : '') +
      (ready && v.notes && v.notes.length ? '<ul class="upd-notes">' + v.notes.slice(0, 4).map(function (n) { return '<li>' + esc(L(n)) + '</li>'; }).join('') + '</ul>' : '') +
      '<button class="li upd-auto" role="switch" aria-checked="' + (S().auto ? 'true' : 'false') + '" data-upd-act="auto"><span class="grow"><b>' + esc(L(['Check once a week', 'تحقق مرة في الأسبوع'])) + '</b></span><span class="switch' + (S().auto ? ' on' : '') + '"></span></button></section>';
  };
  function bind() {
    document.querySelectorAll('[data-upd]').forEach(function (c) {
      var chk = c.querySelector('[data-upd-act="chk"]'), go = c.querySelector('[data-upd-act="go"]'), au = c.querySelector('[data-upd-act="auto"]');
      if (chk) chk.onclick = U.check;
      if (go) go.onclick = U.install;
      if (au) au.onclick = function () { S().auto = !S().auto; A.saveNow(); paint(); };
    });
  }
  U.bind = bind;
  /* only what changed is touched: the version line, the button, the bar, the notes. The heading and the weekly switch stay
     the same nodes, so nothing flashes when a check starts or ends, and a folded section keeps its fold. */
  function patch(old, now) {
    if (old.isEqualNode(now)) return;
    if (old.nodeType === 3 && now.nodeType === 3) { old.textContent = now.textContent; return; }
    if (old.nodeType !== 1 || now.nodeType !== 1 || old.tagName !== now.tagName || old.children.length !== now.children.length) { old.replaceWith(now); return; }
    [].slice.call(now.attributes).forEach(function (a) { if (old.getAttribute(a.name) !== a.value) old.setAttribute(a.name, a.value); });
    [].slice.call(old.attributes).forEach(function (a) { if (!now.hasAttribute(a.name)) old.removeAttribute(a.name); });
    var oc = [].slice.call(old.childNodes), nc = [].slice.call(now.childNodes);
    if (oc.length !== nc.length) { old.replaceChildren.apply(old, nc); return; }
    for (var i = 0; i < nc.length; i++) patch(oc[i], nc[i]);
  }
  function paint() {
    document.querySelectorAll('[data-upd]').forEach(function (el) {
      var t = document.createElement('div'); t.innerHTML = U.card(el.dataset.upd); var n = t.firstChild;
      el.classList.toggle('on', n.classList.contains('on'));
      var oc = [].slice.call(el.children), nc = [].slice.call(n.children);
      /* the same pieces in the same order: patch each; otherwise swap only the pieces between the heading and the switch */
      if (oc.length === nc.length) { for (var i = 0; i < nc.length; i++) if (oc[i].tagName !== 'H3') patch(oc[i], nc[i]); }
      else {
        var keep = el.querySelector('[data-upd-act="auto"]');
        oc.forEach(function (c) { if (c.tagName !== 'H3' && c !== keep) c.remove(); });
        nc.forEach(function (c) { if (c.tagName === 'H3' || (c.dataset && c.dataset.updAct === 'auto')) return; keep ? el.insertBefore(c, keep) : el.appendChild(c); });
        if (keep) { var sw = n.querySelector('[data-upd-act="auto"]'); if (sw) patch(keep, sw); }
      }
    });
    bind(); pill();
  }

  /* ---------- the flow ---------- */
  U.check = function () {
    if (!U.can()) return;
    U.state = 'checking'; paint();
    if (A.N.call('updateCheck') === false) { U.state = 'error'; paint(); }
  };
  U.onCheck = function (json) {
    var r = null; try { r = typeof json === 'string' ? JSON.parse(json) : json; } catch (e) { }
    if (!r || !r.latest || !r.current) { U.state = 'error'; paint(); return; }
    S().last = Date.now();
    U.info = r.latest; U.cur = r.current;
    U.state = (+U.info.code || 0) > (+U.cur.code || 0) && U.info[U.platform()] ? 'ready' : 'latest';
    /* kept, so the notice is still there tomorrow, until this copy is the new version */
    if (U.state === 'ready') S().found = { info: U.info, cur: U.cur }; else delete S().found;
    A.saveNow(); paint();
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

  /* ---------- where an update shows, once one is ready ----------
     A small Update chip in the home header (a grown-up opens it) and in the computer's rail, and a slim band on the family
     dashboard. Each opens the same sheet: what is new, and Update. Nothing shows when there is nothing to do. */
  U.ready = function () { return U.state === 'ready' || U.state === 'allow' || U.state === 'downloading'; };
  var DL = '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>';
  U.chip = function () {
    if (!U.ready() || !U.info) return '';
    return '<button class="up-chip" data-a="upd-open" aria-label="' + esc(L(['Update to version ' + U.info.name, 'حدّث إلى الإصدار ' + A.num(U.info.name)])) + '">' + ic(DL, 16) + '<span>' + esc(L(['Update', 'تحديث'])) + '</span></button>';
  };
  U.band = function () {
    if (!U.ready() || !U.info) return '';
    var n = U.info.notes && U.info.notes[0] ? L(U.info.notes[0]) : '';
    return '<button class="up-band" data-a="upd-open"><span class="up-band-i">' + ic(DL, 20) + '</span><span class="grow"><b>' + esc(L(['Miftāḥ ' + U.info.name + ' is ready', 'مفتاح ' + A.num(U.info.name) + ' جاهز'])) + '</b>' + (n ? '<small>' + esc(n) + '</small>' : '') + '</span><span class="up-band-go">' + esc(L(['See what’s new', 'ما الجديد'])) + '</span></button>';
  };
  A.acts['upd-open'] = function () {
    var open = function () {
      A.sheet(L(['Update Miftāḥ', 'حدّث مفتاح']), U.card('sheet'), function () { bind(); });
    };
    if (A.grownOpen && !A.grownOpen() && A.askGrown) A.askGrown(open); else open();
  };
  function pill() {
    var old = document.getElementById('upd-pill'); if (old) old.remove();
    document.querySelectorAll('.upd-slot').forEach(function (el) { el.innerHTML = U.chip(); });
    document.querySelectorAll('.upd-band-slot').forEach(function (el) { el.innerHTML = U.band(); });
  }
  U.pill = pill;
  /* what was found before is shown again, until this copy is the new version */
  U.restore = function () {
    var f = S().found; if (!f || !U.can()) return;
    var now = A.N.call('version');
    var ok = now && f.cur && String(now) === String(f.cur.name) && f.info && typeof f.info === 'object' && f.info[U.platform()] && (+f.info.code || 0) > (+f.cur.code || 0);
    if (ok) { U.info = f.info; U.cur = f.cur; U.state = 'ready'; pill(); }
    else { delete S().found; A.saveNow(); }
  };
  addEventListener('hashchange', function () { setTimeout(pill, 60); });
  /* the weekly check, if a grown-up turned it on: quietly, a little after start, at most once a week */
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(U.restore, 400);
    setTimeout(function () { if (U.can() && S().auto && Date.now() - (S().last || 0) > WEEK) U.check(); }, 12000);
  });
})();
