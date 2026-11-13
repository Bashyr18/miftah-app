/* Sheets on screen: a printable done on the device itself, with a finger, a pen or a mouse, then marked by a grown-up.
   The rules are the paper rules, unchanged:
   - a parent sends a sheet "on screen"; it is logged like a printed one (Print.keep), with scr set;
   - the child writes on the real page, one page at a time, and every stroke is saved as they go;
   - "Finished" locks it (sub) and only then does it wait for the parent;
   - practice is marked question by question by the parent, which is the evidence (Print.mark), exactly as on paper;
     worksheets are checked: done well (Print.done), or another go, which hands it back with the writing kept;
   - the parent can mark up the page in red; the child sees those marks when they open it again.
   Writing is stored per page as strokes in units of a thousandth of the page's width, so it looks the same on any screen,
   and it travels with the family record (sync.js joins it). Nothing here is marked by a machine. */
(function () {
  'use strict';
  var A = window.A, Print = window.Print, $ = A.$, esc = A.esc, L = A.L;
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var Ink = window.Ink = {};

  /* which sheets make sense on a screen: anything written or answered; not cards to cut, games or mats */
  Print.canScreen = function (kind) { var k = Print.KINDS[kind]; return !!k && (k.use === 'mark' || (k.use === 'do' && k.group !== 'play')); };
  Print.toScreen = function (res, pid) {
    Print.keep(res, pid);
    var sh = (A.D(pid).sheets || []).filter(function (x) { return x.id === res.code; })[0]; if (!sh) return null;
    sh.scr = A.now().getTime(); delete sh.sub; A.saveNow(); return sh;
  };
  Print.forChild = function (x) { return !!(x && x.scr && !x.sub); };
  /* an on-screen sheet waits for the parent only once the child has finished it */
  var waiting0 = Print.waiting; Print.waiting = function (x) { return x.scr && !x.sub ? false : waiting0(x); };
  var status0 = Print.status;
  Print.status = function (x) {
    if (x.scr) {
      var u = x.use || (x.q ? 'mark' : 'keep');
      if (!x.sub) return L(['On screen · with the child', 'على الشاشة · مع الطفل']);
      if (u === 'mark' && !x.marked) return L(['Done on screen · to mark', 'أُنجزت على الشاشة · للتصحيح']);
      if (u === 'do' && !x.done && !x.skip) return L(['Done on screen · to check', 'أُنجزت على الشاشة · للمراجعة']);
    }
    return status0(x);
  };
  Print.again = function (code, pid) {
    var sh = (A.D(pid).sheets || []).filter(function (x) { return x.id === code; })[0]; if (!sh) return;
    delete sh.sub; delete sh.done; delete sh.skip; sh.again = (sh.again || 0) + 1; sh.againT = A.now().getTime(); A.saveNow();
  };

  /* ---------- the writing ---------- */
  var COLORS = { k: '#1d1a16', b: '#1f4fbf', g: '#1d7a52', r: '#d0342c' };
  function drawStroke(g, st, s, W) {
    var p = st.p; if (!p || p.length < 2) return;
    var k = W / 1000 * s;
    g.strokeStyle = COLORS[st.c] || COLORS.k; g.lineWidth = Math.max(1, st.w * k); g.lineCap = 'round'; g.lineJoin = 'round';
    g.globalAlpha = st.c === 'r' ? .92 : 1;
    g.beginPath(); g.moveTo(p[0] * k, p[1] * k);
    if (p.length === 2) { g.lineTo(p[0] * k + .1, p[1] * k + .1); }
    for (var i = 2; i < p.length - 2; i += 2) { var mx = (p[i] + p[i + 2]) / 2 * k, my = (p[i + 1] + p[i + 3]) / 2 * k; g.quadraticCurveTo(p[i] * k, p[i + 1] * k, mx, my); }
    if (p.length >= 4) g.lineTo(p[p.length - 2] * k, p[p.length - 1] * k);
    g.stroke(); g.globalAlpha = 1;
  }
  function hit(st, x, y, r) { var p = st.p; for (var i = 0; i < p.length; i += 2) { var dx = p[i] - x, dy = p[i + 1] - y; if (dx * dx + dy * dy < r * r) return true; } return false; }

  /* the viewer: one page at a time, fitted to the space, with a layer to write on.
     mode 'child' writes in pencil colours, 'parent' marks in red, 'view' only looks. */
  Ink.mount = function (host, sh, pid, mode, hooks) {
    hooks = hooks || {};
    var res = Print.make(sh.kind, pid, sh.seed, sh.opts || {}); if (!res) { host.innerHTML = '<p class="ref">' + esc(L(['This sheet can no longer be made.', 'لم يعد بالإمكان صنع هذه الورقة.'])) + '</p>'; return function () { }; }
    var tmp = document.createElement('div'); tmp.innerHTML = res.html;
    var pages = $$('.pp', tmp).map(function (e) { return e.outerHTML; }); if (!pages.length) pages = [res.html];
    var mine = mode === 'parent' ? 'mk' : 'ink', edit = mode === 'child' || mode === 'parent';
    sh.ink = sh.ink || {}; if (mode === 'parent') sh.mk = sh.mk || {};
    var at = 0, tool = 'pen', color = mode === 'parent' ? 'r' : 'k', size = mode === 'parent' ? 3 : 2.4, undo = [], penSeen = false;
    var tools = edit ? '<div class="ink-tools" role="toolbar">' +
      (mode === 'child' ? ['k', 'b', 'g'].map(function (c) { return '<button class="ink-c' + (c === color ? ' on' : '') + '" data-c="' + c + '" style="--c:' + COLORS[c] + '" aria-label="' + esc(L({ k: ['Black', 'أسود'], b: ['Blue', 'أزرق'], g: ['Green', 'أخضر'] }[c])) + '"><i></i></button>'; }).join('') : '<button class="ink-c on" data-c="r" style="--c:' + COLORS.r + '" aria-label="' + esc(L(['Red', 'أحمر'])) + '"><i></i></button>') +
      '<span class="ink-sep"></span><button class="ink-t on" data-t="pen" aria-label="' + esc(L(['Write', 'اكتب'])) + '">' + A.icon('pen', 20) + '</button><button class="ink-t" data-t="erase" aria-label="' + esc(L(['Rub out', 'امسح'])) + '"><svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10M5.5 14.5l7-7a2 2 0 0 1 2.8 0l3.2 3.2a2 2 0 0 1 0 2.8L13 19H8.5l-3-3a1.1 1.1 0 0 1 0-1.5z"/><path d="M9.5 10.5l6 6"/></svg></button>' +
      '<button class="ink-t" data-t="undo" aria-label="' + esc(L(['Undo', 'تراجع'])) + '"><svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg></button></div>' : '';
    host.innerHTML = '<div class="ink' + (edit ? ' edit' : '') + '"><style>' + Print.CSS.replace('@page{size:A4;margin:11mm}', '') + '</style>' +
      '<div class="ink-stage"><div class="ink-box"><div class="ink-page"></div><canvas class="ink-cv"></canvas></div></div>' +
      '<div class="ink-bar">' + tools + '<div class="ink-pg ink-zm"><button class="ink-t" data-z="1" aria-label="' + esc(L(['Page width or whole page', 'عرض الصفحة أو الصفحة كاملة'])) + '" title="' + esc(L(['Page width or whole page', 'عرض الصفحة أو الصفحة كاملة'])) + '"><svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M8.5 11h5M11 8.5v5"/></svg></button></div><div class="ink-pg"><button class="ink-t" data-pg="-1" aria-label="' + esc(L(['Previous page', 'الصفحة السابقة'])) + '">' + A.icon('back', 20) + '</button><span class="ink-n"></span><button class="ink-t" data-pg="1" aria-label="' + esc(L(['Next page', 'الصفحة التالية'])) + '">' + A.icon('next', 20) + '</button></div>' + (hooks.extra || '') + '</div></div>';
    var stage = $('.ink-stage', host), box = $('.ink-box', host), page = $('.ink-page', host), cv = $('.ink-cv', host), g = cv.getContext('2d');
    var PW = 0, PH = 0, s = 1, cur = null;
    function layer(key) { var o = sh[key] = sh[key] || {}; return o[at] = o[at] || []; }
    function paint() {
      var dpr = Math.min(devicePixelRatio || 1, 2), w = PW * s, h = PH * s;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); cv.style.width = w + 'px'; cv.style.height = h + 'px';
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
      ((sh.ink || {})[at] || []).forEach(function (st) { drawStroke(g, st, s, PW); });
      ((sh.mk || {})[at] || []).forEach(function (st) { drawStroke(g, st, s, PW); });
      if (cur) drawStroke(g, cur, s, PW);
    }
    /* two views: the whole page, or the page at a comfortable writing width that scrolls. A short wide screen (a computer)
       starts at page width, since the whole page there leaves the writing too small. */
    var wideFit = Ink.wide != null ? Ink.wide : (innerWidth >= 1000 && innerHeight < 1100);
    function fit() {
      page.style.transform = 'none'; PW = page.offsetWidth || 794; PH = page.offsetHeight || 1123;   /* the whole sheet of paper, margins included */
      var aw = stage.clientWidth - 16, ah = stage.clientHeight - 16, whole = Math.max(.2, Math.min(aw / PW, ah / PH, 1.6)), wide = Math.min(Math.min(aw - 32, 1000) / PW, 1.6);
      s = wideFit ? Math.max(whole, wide) : whole;
      stage.classList.toggle('scroll', PH * s > ah + 1);
      var zb = $('[data-z]', host); if (zb) { zb.classList.toggle('on', wideFit); zb.parentNode.hidden = wide - whole < .08; }
      page.style.transform = 'scale(' + s + ')'; box.style.width = PW * s + 'px'; box.style.height = PH * s + 'px'; paint();
    }
    function show(i) {
      at = Math.max(0, Math.min(pages.length - 1, i)); page.innerHTML = pages[at];
      $('.ink-n', host).textContent = A.num(at + 1) + ' / ' + A.num(pages.length);
      $$('[data-pg]', host).forEach(function (b) { b.disabled = (+b.dataset.pg < 0 && at === 0) || (+b.dataset.pg > 0 && at === pages.length - 1); });
      $('.ink-pg:not(.ink-zm)', host).hidden = pages.length < 2;
      requestAnimationFrame(fit);
    }
    function pt(e) { var r = cv.getBoundingClientRect(); return [Math.round((e.clientX - r.left) / r.width * 1000), Math.round((e.clientY - r.top) / r.width * 1000)]; }
    if (edit) {
      cv.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'pen') penSeen = true;
        if (penSeen && e.pointerType === 'touch') return;   /* the hand resting on the screen while a pen writes */
        e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) { }
        var p = pt(e);
        if (tool === 'erase') { cur = { erase: true }; rub(p); return; }
        cur = { c: color, w: size * (e.pointerType === 'pen' && e.pressure ? .7 + e.pressure * .6 : 1), p: p };
      });
      cv.addEventListener('pointermove', function (e) {
        if (!cur) return; var p = pt(e);
        if (cur.erase) { rub(p); return; }
        var n = cur.p.length, dx = p[0] - cur.p[n - 2], dy = p[1] - cur.p[n - 1]; if (dx * dx + dy * dy < 4) return;
        cur.p.push(p[0], p[1]); paint();
      });
      var end = function () {
        if (!cur) return; var c = cur; cur = null;
        if (!c.erase) { var l = layer(mine); l.push(c); undo.push({ add: c, page: at }); }
        A.save(); paint(); if (hooks.change) hooks.change();
      };
      cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
      var rub = function (p) { var l = layer(mine); for (var i = l.length - 1; i >= 0; i--) if (hit(l[i], p[0], p[1], 14)) { undo.push({ del: l[i], page: at, i: i }); l.splice(i, 1); } paint(); };
      $$('[data-c]', host).forEach(function (b) { b.onclick = function () { color = b.dataset.c; tool = 'pen'; $$('[data-c]', host).forEach(function (x) { x.classList.toggle('on', x === b); }); $$('[data-t]', host).forEach(function (x) { x.classList.toggle('on', x.dataset.t === 'pen'); }); }; });
      $$('[data-t]', host).forEach(function (b) { b.onclick = function () {
        var t = b.dataset.t;
        if (t === 'undo') { var u = undo.pop(); if (!u) return; var l = (sh[mine] || {})[u.page] || []; if (u.add) { var j = l.indexOf(u.add); if (j >= 0) l.splice(j, 1); } else l.splice(Math.min(u.i, l.length), 0, u.del); if (u.page !== at) show(u.page); else paint(); A.save(); return; }
        tool = t; $$('[data-t]', host).forEach(function (x) { if (x.dataset.t !== 'undo') x.classList.toggle('on', x === b); });
      }; });
    }
    $$('[data-pg]', host).forEach(function (b) { b.onclick = function () { show(at + +b.dataset.pg); }; });
    var zb = $('[data-z]', host); if (zb) zb.onclick = function () { wideFit = Ink.wide = !wideFit; stage.scrollTop = 0; fit(); };
    var key = function (e) { if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && edit) { e.preventDefault(); var u = $('[data-t=undo]', host); if (u) u.click(); } else if (e.key === 'PageDown' || (e.key === 'ArrowRight' && !edit)) show(at + 1); else if (e.key === 'PageUp' || (e.key === 'ArrowLeft' && !edit)) show(at - 1); };
    var onR = function () { clearTimeout(fit._t); fit._t = setTimeout(fit, 80); };
    addEventListener('resize', onR); document.addEventListener('keydown', key);
    show(0);
    return function () { removeEventListener('resize', onR); document.removeEventListener('keydown', key); A.saveNow(); };
  };

  /* ---------- the child's side ---------- */
  function mineFor(pid) { return (A.D(pid).sheets || []).filter(function (x) { return x.scr && Print.KINDS[x.kind]; }); }
  /* on the child's home: the sheets sent to them, newest first; a marked one shows its score once */
  function homeCard() {
    var p = A.P(); if (!p) return '';
    var todo = mineFor(p.id).filter(Print.forChild).reverse(), back = mineFor(p.id).filter(function (x) { return x.marked && !x.seenMark; });
    if (!todo.length && !back.length) return '';
    return '<div class="ink-home">' + todo.slice(0, 3).map(function (x) {
      return '<a class="ink-hc" href="#/sheet/' + esc(x.id) + '"><span class="ink-hc-i">' + A.icon('pen', 22) + '</span><span class="grow"><small>' + esc(x.again ? L(['Have another go', 'حاول مرة أخرى']) : L(['A sheet for you, on screen', 'ورقة لك على الشاشة'])) + '</small><b>' + esc(Print.titleOf(x)) + '</b></span>' + A.icon('next', 20) + '</a>';
    }).join('') + back.slice(0, 2).map(function (x) {
      return '<a class="ink-hc done" href="#/sheet/' + esc(x.id) + '"><span class="ink-hc-i">' + A.icon('check', 22) + '</span><span class="grow"><small>' + esc(L(['Marked', 'صُحّحت'])) + '</small><b>' + esc(Print.titleOf(x)) + ' · ' + A.num(x.right) + ' / ' + A.num(x.q.length) + '</b></span>' + A.icon('next', 20) + '</a>';
    }).join('') + '</div>';
  }
  var home0 = A.V.home;
  A.V.home = function (a, r) {
    var v = home0(a, r); if (!v || !v.html || v.redirect) return v;
    var card = homeCard(); if (!card) return v;
    if (v.html.indexOf('<div class="home-a">') >= 0) v.html = v.html.replace('<div class="home-a">', '<div class="home-a">' + card);
    else if (v.html.indexOf('<div class="tw">') >= 0) v.html = v.html.replace('<div class="tw">', '<div class="tw">' + card);
    return v;
  };
  A.V.sheet = function (args) {
    var p = A.P(); if (!p) return { redirect: 'home' };
    var sh = (A.D(p.id).sheets || []).filter(function (x) { return x.id === args[0] && x.scr; })[0]; if (!sh) return { redirect: 'home' };
    var open = Print.forChild(sh), stop = null;
    if (sh.marked && !sh.seenMark) { sh.seenMark = A.now().getTime(); A.save(); }
    var state = open ? '' : sh.marked ? L(['Marked', 'صُحّحت']) + ' · ' + A.num(sh.right) + ' / ' + A.num(sh.q.length) : L(['Sent to your grown-up', 'أُرسلت إلى الكبير']);
    return {
      bare: true,
      html: '<div class="ink-v"><header class="ink-h"><a class="ink-back" href="#/home" aria-label="' + esc(L(['Back', 'رجوع'])) + '">' + A.icon('back', 20) + '</a><div class="grow"><b>' + esc(Print.titleOf(sh)) + '</b><small>' + esc(open ? L(['Write on the page. It saves as you go.', 'اكتب على الصفحة. تُحفظ أولًا بأول.']) : state) + '</small></div>' + (open ? '<button class="btn pri sm" id="ink-fin">' + esc(L(['Finished', 'انتهيت'])) + '</button>' : '<span class="ink-st">' + esc(state) + '</span>') + '</header><div id="ink-host" class="ink-host"></div></div>',
      mount: function (v) {
        stop = Ink.mount($('#ink-host', v), sh, p.id, open ? 'child' : 'view');
        var f = $('#ink-fin', v);
        if (f) f.onclick = function () {
          var any = Object.keys(sh.ink || {}).some(function (k) { return (sh.ink[k] || []).length; });
          A.sheet(L(['Send it to your grown-up?', 'أترسلها إلى الكبير؟']), '<p class="ink-q">' + esc(any ? L(['After this you cannot change it. They will mark it, and you will see their marks here.', 'بعدها لا يمكنك تغييرها. سيصححها وسترى تصحيحه هنا.']) : L(['There is no writing on it yet.', 'لا كتابة عليها بعد.'])) + '</p><div class="ink-q2"><button class="btn pri" id="ink-yes"' + (any ? '' : ' disabled') + '>' + esc(L(['Send it', 'أرسلها'])) + '</button><button class="btn sec" id="ink-no">' + esc(L(['Keep writing', 'أكمل الكتابة'])) + '</button></div>', function (s2) {
            $('#ink-no', s2).onclick = A.closeSheet;
            var y = $('#ink-yes', s2); if (y) y.onclick = function () { sh.sub = A.now().getTime(); A.saveNow(); A.closeSheet(); if (window.Fx) Fx.bloomAt(f, '#f1d59e', true); A.toast(L(['Sent. Well done.', 'أُرسلت. أحسنت.'])); A.go('home'); };
          });
        };
      },
      unmount: function () { if (stop) stop(); }
    };
  };
})();
