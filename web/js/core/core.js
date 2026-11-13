/* Miftāḥ core: utilities, language, state, the native bridge, the router. No views here. */
(function () {
  'use strict';
  var A = window.A = {};
  A.$ = function (s, r) { return (r || document).querySelector(s); };
  A.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  A.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- time (overridable in tests) ---------- */
  A.clock = null;
  A.now = function () { return A.clock ? new Date(A.clock) : new Date(); };
  A.day = function (d) { d = d || A.now(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  A.dayNum = function (d) { d = d || A.now(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000); };

  /* ---------- seeded randomness: fresh items every time, reproducible in tests ---------- */
  A.rng = function (seed) {
    var a = (seed >>> 0) || 1;
    var r = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    r.int = function (lo, hi) { return lo + Math.floor(r() * (hi - lo + 1)); };
    r.pick = function (x) { return x[Math.floor(r() * x.length)]; };
    r.shuffle = function (x) { var y = x.slice(); for (var i = y.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = y[i]; y[i] = y[j]; y[j] = t; } return y; };
    r.bool = function () { return r() < .5; };
    return r;
  };
  var seedN = 0;
  A.seed = function () { return ((A.now().getTime() % 2147483647) + (++seedN * 7919)) >>> 0; };

  /* ---------- language: English is source, Arabic is real. Content carries both: [en, ar] ---------- */
  A.ar = function () { return A.S && A.S.lang === 'ar'; };
  A.L = function (x) { if (x == null) return ''; if (Array.isArray(x)) return A.ar() ? (x[1] != null ? x[1] : x[0]) : x[0]; return x; };
  A.T = function (s) { if (!A.ar()) return s; var d = window.I18N || {}; return d[s] != null ? d[s] : s; };
  /* Arabic digits inside a left-to-right line of maths: the browser treats them as right-to-left numbers and pulls the signs between them
     into a reversed run, so 16 ÷ 16 = 1 showed as 1 = 16 ÷ 16. A left-to-right mark on each side of every number keeps the line in order. */
  A.bidi = function (html) { return A.ar() ? String(html).replace(/[٠-٩][٠-٩.٫]*/g, '\u200E$&\u200E') : html; };
  /* powers in escaped HTML: x^5, (x − 3)^2, 10^−3 and 9^(1/2) become raised; a lone ' ^ ' between words stays as written */
  A.pow = function (html) { return String(html).replace(/\^(\(([^()]*)\)|[−\-]?[0-9٠-٩.٫]+|[A-Za-z])/g, function (m, all, inner) { return '<sup>' + (inner != null ? inner : all).replace(/\//g, '⁄') + '</sup>'; }); };
  /* the same powers as plain text (a list line, a notification): x⁵, 10⁻³; anything a superscript font lacks keeps its caret */
  A.powText = function (s) { var SU = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '−': '⁻', '-': '⁻', 'n': 'ⁿ' };
    var up = function (x) { return /^[0-9−\-n]+$/.test(x) ? x.split('').map(function (c) { return SU[c]; }).join('') : '^(' + x + ')'; };
    return String(s).replace(/<sup>([^<]*)<\/sup>/g, function (m, x) { return up(x); }).replace(/\^([−\-]?[0-9]+|n)(?![0-9])/g, function (m, x) { return up(x); }); };
  A.num = function (n) { var s = String(n); return A.ar() ? s.replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; }) : s; };

  /* ---------- state ---------- */
  var KEY = 'miftah.v1';
  function defaults() {
    return {
      v: 1, lang: 'en', theme: 'auto', sound: false, motion: 'calm', speakRate: 1, reciter: 'h',
      pin: '', doorDay: '', lastBackup: 0, lastSync: 0, sndV: 0, savedAt: 0,
      gate: { a: 0 }, media: [], profiles: [], cur: null, created: A.day(), remind: { on: false, h: 9, m: 0 }, seen: {},
      data: {}
    };
  }
  function merge(base, st) {
    if (st == null) return base;
    if (Array.isArray(base)) return Array.isArray(st) ? st : base;
    if (typeof base === 'object' && base) {
      if (typeof st !== 'object' || Array.isArray(st)) return base;
      var o = {}; Object.keys(base).forEach(function (k) { o[k] = merge(base[k], st[k]); });
      if (base === D_DATA) return st;
      return o;
    }
    if (typeof base === 'number') return typeof st === 'number' && isFinite(st) ? st : base;
    if (typeof base === 'boolean') return typeof st === 'boolean' ? st : base;
    if (typeof base === 'string') return typeof st === 'string' ? st : base;
    return st;
  }
  var D_DATA = null;
  function shape(st) {
    var d = defaults(); D_DATA = d.data; d.seen = st && typeof st.seen === 'object' && st.seen && !Array.isArray(st.seen) ? st.seen : {};
    var out = merge(d, st);
    out.data = st && st.data && typeof st.data === 'object' && !Array.isArray(st.data) ? st.data : {};
    out.profiles = (out.profiles || []).filter(function (p) { return p && p.id && p.name; });
    if (!out.profiles.some(function (p) { return p.id === out.cur; })) out.cur = out.profiles[0] ? out.profiles[0].id : null;
    if (['en', 'ar'].indexOf(out.lang) < 0) out.lang = 'en';
    if (['auto', 'light', 'dark'].indexOf(out.theme) < 0) out.theme = 'auto';
    if (['h', 'a'].indexOf(out.reciter) < 0) out.reciter = 'h';
    /* one-time move: touch sounds became opt-in */
    if (!out.sndV) { out.sound = false; out.sndV = 1; }
    if (['calm', 'full', 'off'].indexOf(out.motion) < 0) out.motion = 'calm';
    return out;
  }
  A.shape = shape;
  A.load = function () {
    /* two copies exist: the browser's and the app's own file. The newer one wins, so a full browser store can never bring back old data. */
    var local = null, file = null;
    try { local = JSON.parse(localStorage.getItem(KEY)); } catch (e) { }
    var m = A.N.call('loadState'); if (m) { try { file = JSON.parse(m); } catch (e) { } }
    var raw = local && file ? ((file.savedAt || 0) >= (local.savedAt || 0) ? file : local) : (local || file);
    A.S = shape(raw || {});
  };
  var saveT = null;
  A.saveNow = function () {
    if (saveT) { clearTimeout(saveT); saveT = null; }
    A.S.savedAt = Date.now();
    var s = JSON.stringify(A.S);
    /* if the browser store is full, it must not keep an out-of-date copy */
    try { localStorage.setItem(KEY, s); } catch (e) { try { localStorage.removeItem(KEY); } catch (e2) { } }
    A.N.call('saveState', s);
    A.N.sync && A.N.sync();
  };
  A.save = function () { if (saveT) clearTimeout(saveT); saveT = setTimeout(A.saveNow, 250); };

  /* profiles */
  A.P = function () { var S = A.S; for (var i = 0; i < S.profiles.length; i++) if (S.profiles[i].id === S.cur) return S.profiles[i]; return null; };
  A.D = function (pid) {
    pid = pid || A.S.cur;
    var d = A.S.data[pid];
    if (!d) d = A.S.data[pid] = { led: [], keys: {}, hifz: {}, path: null, time: {}, obs: [], placed: {}, recs: {} };
    /* added since the first version: a restored backup may not have these */
    if (!d.pending) { d.pending = []; d.notyet = {}; d.screen = {}; d.extra = {}; d.seenWeek = 0; }
    return d;
  };
  A.age = function (p) { var n = A.now(); return Math.max(0, n.getFullYear() - p.by - ((n.getMonth() + 1) < (p.bm || 1) ? 1 : 0)); };
  /* the stage governs presentation; levels are per room and per skill */
  A.stage = function (p) { p = p || A.P(); if (!p) return 1; if (p.stage != null && p.stage >= 0) return p.stage; var a = A.age(p); return a < 5 ? 0 : a < 8 ? 1 : a < 12 ? 2 : a < 15 ? 3 : 4; };
  A.STAGES = [
    { id: 0, name: ['Little Steps', 'الخطوات الأولى'], ages: ['2 to 4', '٢ إلى ٤'], minutes: 10, stops: 2 },
    { id: 1, name: ['Explorers', 'المستكشفون'], ages: ['5 to 7', '٥ إلى ٧'], minutes: 20, stops: 5 },
    { id: 2, name: ['Seekers', 'الطلاب'], ages: ['8 to 11', '٨ إلى ١١'], minutes: 40, stops: 6 },
    { id: 3, name: ['Builders', 'البناة'], ages: ['12 to 14', '١٢ إلى ١٤'], minutes: 75, stops: 7 },
    { id: 4, name: ['Scholars', 'الدارسون'], ages: ['15 to 18', '١٥ إلى ١٨'], minutes: 120, stops: 8 }
  ];

  /* ---------- native bridge ---------- */
  A.N = {
    has: function () { return !!window.AndroidBridge; },
    call: function (fn) {
      var b = window.AndroidBridge; if (!b || !b[fn]) return undefined;
      try { return b[fn].apply(b, Array.prototype.slice.call(arguments, 1)); } catch (e) { return undefined; }
    },
    haptic: function (k) { if (!A.N.call('haptic', k || 'tick') && navigator.vibrate && !A.N.has()) { try { navigator.vibrate(k === 'success' ? [12, 40, 20] : 8); } catch (e) { } } }
  };
  window.__native = window.__native || {};

  /* ---------- the router ---------- */
  A.V = {}; A.acts = {};
  var cur = null, stack = [];
  A.go = function (h, opts) { opts = opts || {}; if (opts.replace) { history.replaceState(null, '', '#/' + h); render(); } else { location.hash = '#/' + h; } };
  A.route = function () { return (location.hash || '#/').replace(/^#\//, ''); };
  function parse(h) { var p = h.split('/').filter(Boolean); return { name: p[0] || 'home', args: p.slice(1).map(decodeURIComponent), hash: h }; }

  /* a redraw of the same screen (after a tap, on resume, after printing) keeps its place and does not fade: only a new screen enters */
  var lastHash = null, inVT = false;
  function render() {
    var r = parse(A.route());
    var el = A.$('#app'), same = r.hash === lastHash, y = same ? window.scrollY : 0, vy = same && A.$('.view', el) ? A.$('.view', el).scrollTop : 0, ey = same ? el.scrollTop : 0;
    lastHash = r.hash;
    try {
      if (cur && cur.unmount) { try { cur.unmount(); } catch (e) { console.error(e); } }
      if (window.Voice) Voice.stop();
      var fn = A.V[r.name] || A.V.home;
      var v = fn(r.args, r) || {};
      if (v.redirect) { A.go(v.redirect, { replace: true }); return; }
      cur = v;
      document.body.dataset.view = r.name;
      document.body.dataset.age = A.P() ? A.stage() : 2;
      document.body.dataset.motion = A.motion();
      document.body.classList.toggle('is-bare', !!v.bare);
      if (v.hue) document.body.dataset.hue = v.hue; else delete document.body.dataset.hue;
      el.innerHTML = '<div class="view' + (same ? ' still' : inVT ? '' : ' enter') + (v.cls ? ' ' + v.cls : '') + '">' + (v.html || '') + '</div>';
      A.$('.view', el).scrollTop = vy; el.scrollTop = ey; window.scrollTo(0, y); if (!same) document.body.classList.remove('scrolled');
      if (v.mount) v.mount(A.$('.view', el));
      if (same) { A.$('.view', el).scrollTop = vy; el.scrollTop = ey; window.scrollTo(0, y); }
    } catch (e) {
      console.error(e);
      el.innerHTML = '<div class="view"><div class="errbox"><div class="errkey">' + (A.art ? A.art('key', 64) : '') + '</div><h2>' + A.T('That door is stuck') + '</h2><p>' + A.esc(String(e.message || e).split('\n')[0]) + '</p><a class="btn pri" href="#/home">' + A.T('Back to the courtyard') + '</a></div></div>';
    }
    A.applyTheme();
    if (cur && cur.darkBars) A.N.call('setSystemBars', false);
  }
  A.rerender = render;
  /* change the screen as one cross-fade: the old picture stays until the new one is drawn and its images are decoded (a short wait at most),
     so there is never a blank or half-drawn frame. Without the browser's view transitions, the change is simply instant. */
  A.morph = function (change) {
    var still = A.motion() === 'off' || document.hidden || !document.startViewTransition;
    if (still || inVT) { change(); return; }
    inVT = true;
    var vt;
    try {
      vt = document.startViewTransition(function () {
        change();
        var imgs = Array.prototype.slice.call(document.querySelectorAll('#app img')).filter(function (im) { return !im.complete; }).slice(0, 12);
        return Promise.race([Promise.all(imgs.map(function (im) { return im.decode ? im.decode().catch(function () { }) : null; })), new Promise(function (ok) { setTimeout(ok, 160); })]);
      });
    } catch (e) { inVT = false; change(); return; }
    vt.finished.then(function () { inVT = false; }, function () { inVT = false; });
  };
  window.addEventListener('hashchange', function () {
    var h = A.route();
    if (stack[stack.length - 2] === h) stack.pop(); else if (stack[stack.length - 1] !== h) stack.push(h);
    if (stack.length > 40) stack.shift();
    if (A.isTransitioning && A.isTransitioning()) return;
    A.morph(render);
  });
  A.backTo = function (fb) { if (stack.length > 1) history.back(); else A.go(fb || 'home', { replace: true }); };
  window.__native.onBack = function () {
    if (window.Print && Print.leave && Print.leave()) return 'handled';
    if (A.closeSheet && A.closeSheet()) return 'handled';
    if (cur && cur.onBack && cur.onBack() === 'handled') return 'handled';
    var r = parse(A.route());
    if (r.name === 'home' || r.name === 'who' || r.name === 'welcome') return 'exit';
    A.backTo('home');
    return 'handled';
  };
  window.__native.onRoute = function (h) { location.hash = h; };
  window.__native.onResume = function () { if (cur && cur.resume) cur.resume(); else if (parse(A.route()).name === 'home') render(); };
  window.__native.onInsets = function (t, b) { var s = document.documentElement.style; s.setProperty('--sat', t + 'px'); s.setProperty('--sab', b + 'px'); };

  /* delegated actions */
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-a]'); if (!t) return;
    var fn = A.acts[t.dataset.a]; if (fn) { fn(t, e); }
  });

  /* ---------- theme: by default the world follows the sun ---------- */
  A.isDay = function () { var h = A.now().getHours(); return h >= 6 && h < 18; };
  var lastT = null;
  A.applyTheme = function () {
    var S = A.S, r = document.documentElement;
    var t = S.theme === 'auto' ? (A.isDay() ? 'light' : 'dark') : S.theme;
    r.dataset.theme = t; r.lang = S.lang; r.dir = S.lang === 'ar' ? 'rtl' : 'ltr';
    var m = A.$('meta[name=theme-color]'); if (m) m.content = t === 'light' ? '#f6efe0' : '#07080d';
    A.N.call('setSystemBars', t === 'light');
    if (t !== lastT) { lastT = t; A.N.call('rememberTheme', t); }
    var on = t === 'dark';
    Array.prototype.forEach.call(document.querySelectorAll('.dn'), function (b) { b.setAttribute('aria-checked', on ? 'true' : 'false'); b.classList.toggle('auto', S.theme === 'auto'); });
  };

  /* the day and night switch, in the top corner of the homes: a tap flips it, a long press hands it back to the sun */
  var SUN = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.4 8.4 0 1 0 10.8 10.8z"/></svg>';
  A.dn = function (glass) {
    var night = document.documentElement.dataset.theme === 'dark';
    return '<button class="dn' + (glass ? ' glass' : '') + (A.S.theme === 'auto' ? ' auto' : '') + '" role="switch" aria-checked="' + night + '" aria-label="' + A.esc(A.L(['Night mode', 'الوضع الليلي'])) + '"><span class="dn-s">' + SUN + '</span><span class="dn-m">' + MOON + '</span><i><span class="dn-s">' + SUN + '</span><span class="dn-m">' + MOON + '</span></i></button>';
  };
  (function () {
    var timer = null, longDone = false;
    /* the knob slides first; then the whole screen cross-fades to the other theme, the home picture included, in one step */
    function setTheme(t) {
      A.S.theme = t; A.saveNow();
      var night = (t === 'auto' ? (A.isDay() ? 'light' : 'dark') : t) === 'dark';
      Array.prototype.forEach.call(document.querySelectorAll('.dn'), function (b) { b.setAttribute('aria-checked', night ? 'true' : 'false'); b.classList.toggle('auto', t === 'auto'); });
      if (night === (document.documentElement.dataset.theme === 'dark')) return;
      setTimeout(function () { A.morph(function () { A.applyTheme(); if (document.body.dataset.view === 'home') A.rerender(); }); }, 240);
    }
    document.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('.dn'); if (!b) return; longDone = false;
      timer = setTimeout(function () { longDone = true; setTheme('auto'); A.N.haptic('success'); A.toast(A.L(['Following the sun again', 'يتبع الشمس من جديد'])); }, 650);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { document.addEventListener(ev, function () { clearTimeout(timer); }, true); });
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.dn'); if (!b) return; e.preventDefault();
      if (longDone) { longDone = false; return; }
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  })();

  /* assets: the standalone build embeds images */
  A.asset = function (p) { return window.ASSETS && window.ASSETS[p] ? window.ASSETS[p] : p; };
  A.toast = function (msg) { var t = A.$('#toast'); if (!t) return; t.textContent = msg; t.classList.add('on'); clearTimeout(A.toast._t); A.toast._t = setTimeout(function () { t.classList.remove('on'); }, 2400); };
  A.motion = function () { return (A.S && A.S.motion) || 'calm'; };
  A.reduced = function () { return A.motion() === 'off' || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
  /* the rest of the Muṣḥaf loads only for those who have reached it */
  A.quranAll = function (done) {
    var Q = window.QURAN; done = done || function () { };
    if (Q.all) { done(); return; }
    var fin = false, go = function () {
      if (fin) return; fin = true;
      var R = window.QURAN_REST;
      if (R) { Q.order = Q.order.concat(R.order); Object.keys(R.q).forEach(function (n) { Q.q[n] = R.q[n]; }); Q.all = true; window.QURAN_REST = null; }
      done();
    };
    var s = document.createElement('script'); s.src = 'quran-rest.js'; s.onload = go; s.onerror = go; document.head.appendChild(s);
    setTimeout(go, 2500);
  };
  A.needsQuranAll = function () { return (A.S.profiles || []).some(function (p) { var d = (A.S.data || {})[p.id]; return A.stage(p) >= 3 || (d && d.hifz && d.hifz.i >= window.QURAN.order.length) || p.quranAll; }); };
  A.boot = function () {
    A.load(); A.applyTheme(); if (A.preloadArt) A.preloadArt();
    if (A.needsQuranAll()) { A.quranAll(A.boot2); return; }
    A.boot2();
  };
  A.boot2 = function () {
    requestAnimationFrame(function () { requestAnimationFrame(function () { console.info('first frame ' + Math.round(performance.now()) + 'ms'); }); });
    /* with more than one child, ask who is learning each time the app opens */
    if (A.S.profiles.length > 1 && (A.route() === '' || A.route() === 'home')) history.replaceState(null, '', '#/who');
    stack = [A.route()];
    render();
    A.N.call('ready', performance.now());
  };
})();
