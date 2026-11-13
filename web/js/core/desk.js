/* Miftah on a computer. Everything here runs only inside the Windows app (windows/shim.js sets MIFTAH_DESKTOP);
   on a phone or in a browser this file does nothing.

   What a computer adds:
   - a side rail instead of the bottom bar, with the learner, their sections and the grown-up tools always in reach;
   - a command bar (Ctrl K) that jumps to any child, subject, lesson, tool or setting;
   - the keyboard everywhere: digits and Enter answer a lesson, 1 to 4 choose, Esc steps back;
   - Print Studio: several sheets at once, to paper or to one PDF in Documents\Miftah\Printables;
   - Phone and computer: pair a phone on the home Wi-Fi with six digits, then the two join records by themselves;
   - Focus: the whole screen for a child's session, and only a grown-up can leave it;
   - This computer: install, start with Windows, the tray, zoom, the data folder and thirty days of backups. */
(function () {
  'use strict';
  if (!window.MIFTAH_DESKTOP) return;
  var A = window.A, C = window.C, M = window.M, $ = A.$, esc = A.esc, L = A.L, T = A.T;
  var B = window.DeskBridge;
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var Desk = window.Desk = { _pdf: false };
  function info() { try { return JSON.parse(B.deskInfo()); } catch (e) { return {}; } }
  function ago(ms) {
    if (!ms) return L(['never', 'أبدًا']);
    var m = Math.round((Date.now() - ms) / 60000);
    if (m < 1) return L(['just now', 'الآن']);
    if (m < 60) return A.num(m) + ' ' + L(['min ago', 'د مضت']);
    var h = Math.round(m / 60); if (h < 24) return A.num(h) + ' ' + L(['h ago', 'س مضت']);
    return new Date(ms).toLocaleDateString(A.ar() ? 'ar' : 'en', { day: 'numeric', month: 'short' });
  }
  /* a few drawings the phone app never needed */
  var IC = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    phone: '<rect x="7" y="2.8" width="10" height="18.4" rx="2.4"/><path d="M11 18h2"/>',
    pc: '<rect x="2.8" y="4" width="18.4" height="12" rx="2"/><path d="M8.5 20h7M12 16v4"/>',
    folder: '<path d="M3 7.5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    focus: '<path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15"/><circle cx="12" cy="12" r="2.6"/>',
    kbd: '<rect x="2.8" y="6" width="18.4" height="12" rx="2"/><path d="M6.5 9.5h.01M10 9.5h.01M13.5 9.5h.01M17 9.5h.01M7.5 14.5h9"/>',
    pdf: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 14h6M9 17h4"/>',
    restore: '<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.6"/><path d="M4 4v4.6h4.6M12 8v4l3 2"/>',
    full: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    collapse: '<path d="M15 6l-6 6 6 6"/>',
    wifi: '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0"/><circle cx="12" cy="19.2" r=".9" fill="currentColor"/>'
  };
  /* the app's own eight-pointed star, as on its icon */
  var MARK = '<svg viewBox="0 0 100 100" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M50 7l6.6 7.9 10.2-1.8 1.8 10.2L78.5 30l-5 9 5 9-9.9 6.7-1.8 10.2-10.2-1.8L50 71l-6.6-7.9-10.2 1.8-1.8-10.2L21.5 48l5-9-5-9 9.9-6.7 1.8-10.2 10.2 1.8z" transform="translate(0 11)"/><circle cx="50" cy="50" r="11" fill="#f6dda5"/></svg>';
  function ic(n, s) { if (!IC[n]) return A.icon(n, s); return '<svg class="ic" viewBox="0 0 24 24" width="' + (s || 20) + '" height="' + (s || 20) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + '</svg>'; }
  function kbd(k) { return '<kbd>' + esc(k) + '</kbd>'; }
  /* the parent area's own lock, shared with these grown-up pages */
  function grown(fn) { if (A.grownOpen && A.grownOpen()) fn(); else A.askGrown(fn); }

  /* ================= the rail ================= */
  var IMMERSIVE = { welcome: 1, who: 1, lesson: 1, stop: 1, nursery: 1, exam: 1, paper: 1, watch: 1, place: 1, flash: 1, write: 1, challenge: 1, marking: 1, sheet: 1 };
  var rail = document.createElement('aside'); rail.id = 'rail'; rail.setAttribute('aria-label', 'Miftāḥ');
  var mini = false; try { mini = localStorage.getItem('miftah.rail') === 'mini'; } catch (e) { }
  function avatar(p, size) { return '<span class="rl-av h-' + esc(p.hue || 'gold') + '" style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * .42) + 'px">' + esc((p.name || '?').charAt(0).toUpperCase()) + '</span>'; }
  function todayOf(p) {
    try { var was = A.S.cur; A.S.cur = p.id; var pl = window.Plan.today(); A.S.cur = was; return { n: pl.stops.filter(function (s) { return s.done; }).length, t: pl.stops.length }; } catch (e) { return { n: 0, t: 0 }; }
  }
  function ring(n, t, size) {
    var r = (size - 6) / 2, c = 2 * Math.PI * r, f = t ? n / t : 0;
    return '<svg class="rl-ring" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--line2)" stroke-width="3"/><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--gold-d,#c79c52)" stroke-width="3" stroke-linecap="round" stroke-dasharray="' + (c * f).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/></svg>';
  }
  var linkState = { on: false, phones: [] };
  function drawRail() {
    var view = document.body.dataset.view || 'home', p = A.P(), parent = /^(parent|desk)$/.test(view);
    var navSrc = $('.view .nav'), items = navSrc ? $$('a', navSrc).map(function (a) { return '<a href="' + a.getAttribute('href') + '" class="rl-i' + (a.classList.contains('on') ? ' on' : '') + '">' + a.innerHTML + '</a>'; }).join('') : '';
    if (!items && p && !parent) items = '<a href="#/home" class="rl-i' + (view === 'home' ? ' on' : '') + '">' + A.icon('path', 20) + '<span>' + esc(L(['Today', 'اليوم'])) + '</span></a><a href="#/rooms" class="rl-i' + (view === 'rooms' || view === 'room' ? ' on' : '') + '">' + A.icon('rooms', 20) + '<span>' + esc(L(['Rooms', 'الغرف'])) + '</span></a>';
    var kids = (A.S.profiles || []);
    var who = p ? (function () {
      var td = todayOf(p), st = A.STAGES[A.stage(p)];
      return '<button class="rl-me" data-desk="switch" title="' + esc(L(['Switch learner', 'غيّر المتعلّم'])) + '">' + avatar(p, 38) + '<span class="grow"><b>' + esc(p.name) + '</b><small>' + esc(L(st.name)) + ' · ' + A.num(td.n) + ' / ' + A.num(td.t) + '</small><i class="rl-prog"><em style="width:' + (td.t ? Math.round(100 * td.n / td.t) : 0) + '%"></em></i></span></button>' +
        (kids.length > 1 ? '<div class="rl-kids">' + kids.filter(function (k) { return k.id !== p.id; }).map(function (k) { return '<button data-desk="kid" data-id="' + esc(k.id) + '" title="' + esc(k.name) + '">' + avatar(k, 28) + '</button>'; }).join('') + '</div>' : '');
    })() : '';
    var pkids = parent ? kids.map(function (k) { var on = location.hash.indexOf('#/parent/' + k.id) === 0; return '<a class="rl-i' + (on ? ' on' : '') + '" href="#/parent/' + esc(k.id) + '/today">' + avatar(k, 22) + '<span>' + esc(k.name) + '</span></a>'; }).join('') : '';
    var dot = linkState.on ? '<i class="rl-dot' + (linkState.phones.length ? ' ok' : '') + '"></i>' : '';
    rail.innerHTML =
      '<div class="rl-top"><a class="rl-brand" href="#/' + (parent ? 'parent' : 'home') + '"><img class="rl-mark" src="icon.svg" alt="" width="36" height="36"><span class="rl-word"><b>Miftāḥ</b><small dir="rtl">مِفْتَاح</small></span></a><button class="rl-fold" data-desk="fold" title="' + esc(L(['Narrow the rail', 'ضيّق الشريط'])) + '">' + ic('collapse', 18) + '</button></div>' +
      '<button class="rl-search" data-desk="palette">' + ic('search', 18) + '<span>' + esc(L(['Search or jump', 'ابحث أو انتقل'])) + '</span>' + kbd('Ctrl K') + '</button>' +
      (parent ? '<div class="rl-sec">' + esc(L(['Family', 'العائلة'])) + '</div><nav class="rl-nav"><a class="rl-i' + (location.hash === '#/parent' ? ' on' : '') + '" href="#/parent">' + A.icon('grown', 20) + '<span>' + esc(L(['Everyone', 'الجميع'])) + '</span></a>' + pkids + '</nav>'
        : (who + (items ? '<nav class="rl-nav">' + items + '</nav>' : ''))) +
      '<div class="rl-sec">' + esc(L(['Grown-ups', 'للكبار'])) + '</div><nav class="rl-nav">' +
      (parent ? '<a class="rl-i" href="#/home">' + A.icon('path', 20) + '<span>' + esc(L(['Back to learning', 'العودة إلى التعلّم'])) + '</span></a>' : '<a class="rl-i" href="#/parent">' + A.icon('lock', 20) + '<span>' + esc(L(['Parent area', 'ركن الوالدين'])) + '</span></a>') +
      '<a class="rl-i' + (location.hash === '#/desk/print' ? ' on' : '') + '" href="#/desk/print" data-grown>' + A.icon('print', 20) + '<span>' + esc(L(['Print Studio', 'استوديو الطباعة'])) + '</span></a>' +
      '<a class="rl-i' + (location.hash === '#/desk/link' ? ' on' : '') + '" href="#/desk/link" data-grown>' + ic('phone', 20) + '<span>' + esc(L(['Phone and computer', 'الهاتف والحاسوب'])) + '</span>' + dot + '</a>' +
      '<a class="rl-i' + (location.hash === '#/desk/pc' ? ' on' : '') + '" href="#/desk/pc" data-grown>' + ic('pc', 20) + '<span>' + esc(L(['This computer', 'هذا الحاسوب'])) + '</span></a>' +
      '</nav><div class="grow"></div>' +
      '<div class="rl-foot"><button class="rl-tool" data-desk="focus" title="' + esc(L(['Focus: the whole screen for a lesson', 'تركيز: الشاشة كلها للدرس'])) + '">' + ic('focus', 19) + '<span>' + esc(L(['Focus', 'تركيز'])) + '</span></button><button class="rl-tool" data-desk="keys" title="' + esc(L(['Keyboard shortcuts', 'اختصارات لوحة المفاتيح'])) + '">' + ic('kbd', 19) + '<span>' + esc(L(['Keys', 'المفاتيح'])) + '</span></button>' + A.dn() + '</div>';
  }
  function placeRail() {
    var view = document.body.dataset.view || 'home';
    var show = !IMMERSIVE[view] && !Desk.focusOn && !(view === 'home' && !A.P());
    if (!rail.parentNode) document.body.insertBefore(rail, document.body.firstChild);
    document.body.classList.toggle('has-rail', show);
    document.body.classList.toggle('rail-mini', show && mini);
    if (show) drawRail();
  }
  rail.addEventListener('click', function (e) {
    var g = e.target.closest('[data-grown]');
    if (g && !(A.grownOpen && A.grownOpen())) { e.preventDefault(); var h = g.getAttribute('href'); A.askGrown(function () { location.hash = h; }); return; }
    var b = e.target.closest('[data-desk]'); if (!b) return;
    var k = b.dataset.desk;
    if (k === 'palette') Desk.palette();
    else if (k === 'keys') Desk.keys();
    else if (k === 'focus') Desk.focus(true);
    else if (k === 'fold') { mini = !mini; try { localStorage.setItem('miftah.rail', mini ? 'mini' : 'wide'); } catch (x) { } placeRail(); }
    else if (k === 'switch') A.go('who');
    else if (k === 'kid') { A.S.cur = b.dataset.id; A.saveNow(); if (A.route() === 'home') A.rerender(); else A.go('home'); }
  });

  /* ================= after every screen ================= */
  var TITLES = { home: ['Today', 'اليوم'], rooms: ['Rooms', 'الغرف'], room: ['Room', 'الغرفة'], keys: ['My keys', 'مفاتيحي'], lesson: ['Lesson', 'درس'], parent: ['Parent area', 'ركن الوالدين'], hifz: ['Qurʾān', 'القرآن'], quran: ['Qurʾān', 'القرآن'], lab: ['The Lab', 'المختبر'], study: ['Study', 'المذاكرة'] };
  function after() {
    placeRail();
    var view = document.body.dataset.view || 'home', p = A.P(), t = TITLES[view];
    var h1 = $('.view h1'), sub = view === 'desk' && h1 ? h1.textContent : t ? L(t) : h1 ? h1.textContent : '';
    document.title = ['Miftāḥ', p && !/^(parent|desk)$/.test(view) ? p.name : '', sub].filter(Boolean).join(' · ');
    var sky = view === 'welcome' || view === 'who';
    try { B.titleBar(document.documentElement.dataset.theme || 'light', sky); } catch (e) { }
    hints();
    if (view === 'parent' && /\/sheet\//.test(location.hash)) pdfButton();
    wide();
  }
  /* ---------- the wide window, filled ---------- */
  function wide() {
    var view = document.body.dataset.view, big = document.body.classList.contains('has-rail') && innerWidth >= 1100;
    /* the parent's dashboard: its cards dealt into three columns, each to the shortest */
    var dc = $('.view .dcols');
    if (dc) {
      var want = big && innerWidth >= 1480 ? 3 : 2, cols = $$('.dcol', dc);
      if (want !== cols.length && cols.length) {
        var cards = []; cols.forEach(function (c) { Array.prototype.slice.call(c.children).forEach(function (x) { cards.push(x); }); });
        cards.forEach(function (x, i) { if (x.dataset.dk == null) x.dataset.dk = i; });
        cards.sort(function (a, b) { return (+a.dataset.dk) - (+b.dataset.dk); });
        var made = []; for (var i = 0; i < want; i++) { var c = document.createElement('div'); c.className = 'dcol'; made.push(c); }
        cols.forEach(function (c) { dc.removeChild(c); });
        made.forEach(function (c) { dc.appendChild(c); });
        var hs = made.map(function () { return 0; });
        cards.forEach(function (x) { var j = hs.indexOf(Math.min.apply(null, hs)); made[j].appendChild(x); hs[j] += x.getBoundingClientRect().height || 200; });
        dc.classList.toggle('dk3', want === 3);
      }
    }
    if (view === 'room' && big && !$('.dk-room')) roomIndex();
    if (view === 'parent' && A.route() === 'parent' && big && !$('.dk-fam')) familyWeek();
    if (view === 'home' && big && $('.view .tw>.tl') && !$('.dk-subj')) teenSubjects();
    if (view === 'home' && big && $('.view .pathbox') && !$('.dk-hx')) childSide();
  }
  /* the āyah they are memorising next, whole, from the verified text, with its real recitation. Nothing to score, nothing to win. */
  function quranCard(p) {
    try {
      var Q = window.QURAN, t = Hifz.today(p.id), sb = t && t.sabaq; if (!Q || !sb) return '';
      var su = Q.q[sb.s], v = su && su.v.filter(function (x) { return x[0] === sb.from; })[0]; if (!v) return '';
      var due = (t.sabqi || []).length + (t.manzil || []).length;
      return '<section class="dk-hx-c dk-q"><h3>' + esc(L(['From your sūrah', 'من سورتك'])) + '<small>' + esc(A.surahName(sb.s)) + ' · ' + A.num(sb.s) + ':' + A.num(sb.from) + '</small></h3>' +
        '<p class="dk-q-a" lang="ar" dir="rtl">' + esc(v[1]) + '</p>' +
        '<div class="dk-q-f"><button class="btn sec sm" data-ayah="' + sb.s + ':' + sb.from + '">' + A.icon('play', 16) + '<span>' + esc(L(['Listen', 'استمع'])) + '</span></button><a class="btn ghost sm" href="#/room/quran">' + esc(L(['Open', 'افتح'])) + '</a>' + (due ? '<small>' + A.num(due) + ' ' + esc(L(['to revise today', 'للمراجعة اليوم'])) + '</small>' : '') + '</div></section>';
    } catch (e) { return ''; }
  }
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-ayah]'); if (!b) return; var x = b.dataset.ayah.split(':'); Voice.ayah(+x[0], +x[1]); });
  /* a child's home on a big screen: beside the path, their week, what is new, and every room one click away */
  function childSide() {
    var p = A.P(), box = $('.view .pathbox'); if (!p || !box) return;
    var d = A.D(p.id), now = A.now(), days = [], top = 1, st = A.stage(p);
    for (var i = 6; i >= 0; i--) { var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i), k = A.day(dt), m = Math.round(Math.max((d.time || {})[k] || 0, (d.screen || {})[k] || 0) / 60000); days.push({ d: dt, m: m, today: i === 0 }); top = Math.max(top, m); }
    var streak = 0; for (var j = days.length - 1; j >= 0; j--) { if (days[j].m > 0) streak++; else if (!days[j].today) break; }
    var week = now.getTime() - 7 * 864e5, fresh = Object.keys(d.keys || {}).filter(function (k) { var x = d.keys[k]; return x.forged && x.forged >= week; }).length;
    var rooms = (C.order || Object.keys(C.rooms)).filter(function (r) { return C.rooms[r] && !(p.off || {})[r] && C.rooms[r].units.some(function (u) { return u.band == null || u.band <= st; }); });
    var ha = $('.view .home-a'), qc = quranCard(p); if (ha && qc) ha.insertAdjacentHTML('beforeend', qc);
    var html = '<aside class="dk-hx"><section class="dk-hx-c"><h3>' + esc(L(['Your week', 'أسبوعك'])) + '<small>' + (streak > 1 ? esc(A.num(streak) + ' ' + L(['days in a row', 'أيام متتالية'])) : '') + '</small></h3><div class="dk-week">' + days.map(function (x) {
      return '<div class="dk-wd' + (x.today ? ' on' : '') + '"><i><em style="height:' + (x.m ? Math.max(8, Math.round(100 * x.m / top)) : 0) + '%"></em></i><b>' + esc(x.d.toLocaleDateString(A.ar() ? 'ar' : 'en', { weekday: 'narrow' })) + '</b><small>' + (x.m ? A.num(x.m) : '') + '</small></div>';
    }).join('') + '</div>' + (fresh ? '<p class="dk-hx-n"><b>' + A.num(fresh) + '</b> ' + esc(L(['new skills learned this week', 'مهارات جديدة هذا الأسبوع'])) + '</p>' : '') + '</section>' +
      '<section class="dk-hx-c"><h3>' + esc(L(['Rooms', 'الغرف'])) + '</h3><div class="dk-rooms">' + rooms.map(function (r) {
        var rm = C.rooms[r], all = 0, met = 0; rm.units.forEach(function (u) { if (u.band != null && u.band > st) return; u.skills.forEach(function (s2) { all++; if (M.met(s2.id, p.id)) met++; }); });
        return '<a class="dk-rm h-' + esc(rm.hue || 'gold') + '" href="#/room/' + r + '">' + (A.hasImg('portal-' + r + '-s') ? '<img src="' + A.imgUrl('portal-' + r + '-s') + '" alt="">' : '<span class="dk-rm-a">' + A.art(r === 'quran' ? 'rehal' : rm.art, 30) + '</span>') + '<span class="grow"><b>' + esc(L(rm.name)) + '</b><i><em style="width:' + (all ? Math.round(100 * met / all) : 0) + '%"></em></i></span></a>';
      }).join('') + '</div></section></aside>';
    box.insertAdjacentHTML('beforeend', html);
    /* the day at a glance, on the banner */
    var sky = $('.view .sky');
    if (sky && !$('.dk-sum', sky)) {
      var pl = window.Plan.today(), dn = pl.stops.filter(function (x) { return x.done; }).length, tot = pl.stops.length;
      var chip = function (n, t) { return '<span><b>' + n + '</b>' + esc(t) + '</span>'; };
      sky.insertAdjacentHTML('beforeend', '<div class="dk-sum">' + chip(A.num(dn) + ' / ' + A.num(tot), L(['done today', 'أُنجز اليوم'])) + (streak > 1 ? chip(A.num(streak), L(['days in a row', 'أيام متتالية'])) : '') + chip(A.num(fresh), L(['new this week', 'جديد هذا الأسبوع'])) + '</div>');
    }
  }
  /* the family page: a week of real minutes for every child, side by side */
  function familyWeek() {
    var at = $('.view .tl-grid') || $('.view .fgrid'); if (!at) return;
    var kids = A.S.profiles || [], days = [], now = A.now();
    for (var i = 6; i >= 0; i--) { var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i); days.push(d); }
    var mins = kids.map(function (k) { var d = A.D(k.id); return days.map(function (x) { var key = A.day(x); return Math.round(Math.max((d.time || {})[key] || 0, (d.screen || {})[key] || 0) / 60000); }); });
    var top = Math.max(30, Math.max.apply(null, mins.map(function (r) { return Math.max.apply(null, r); })));
    var W = 640, H = 200, pad = 28, gw = (W - pad) / 7, bw = Math.min(16, (gw - 14) / Math.max(1, kids.length));
    var bars = days.map(function (dd, di) {
      var x0 = pad + di * gw + (gw - bw * kids.length) / 2;
      return kids.map(function (k, ki) { var v = mins[ki][di], h = v ? Math.max(3, (H - 34) * v / top) : 0; return '<rect class="h-' + esc(k.hue || 'gold') + '" x="' + (x0 + ki * bw).toFixed(1) + '" y="' + (H - 22 - h).toFixed(1) + '" width="' + (bw - 3).toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3"><title>' + esc(k.name) + ' · ' + v + ' min</title></rect>'; }).join('') +
        '<text x="' + (pad + di * gw + gw / 2).toFixed(1) + '" y="' + (H - 4) + '" text-anchor="middle">' + esc(dd.toLocaleDateString(A.ar() ? 'ar' : 'en', { weekday: 'short' })) + '</text>';
    }).join('');
    var grid = [0, .5, 1].map(function (f) { var y = (H - 22 - (H - 34) * f).toFixed(1); return '<line x1="' + pad + '" x2="' + W + '" y1="' + y + '" y2="' + y + '"/><text class="ax" x="0" y="' + (+y + 4) + '">' + A.num(Math.round(top * f)) + '</text>'; }).join('');
    var waiting = [];
    kids.forEach(function (k) { (A.D(k.id).sheets || []).forEach(function (s) { if (Print.waiting(s)) waiting.push({ k: k, s: s }); }); });
    var html = '<div class="dk-fam"><section class="card"><h3>' + esc(L(['This week, in minutes', 'هذا الأسبوع بالدقائق'])) + '</h3><div class="dk-legend">' + kids.map(function (k) { return '<span><i class="h-' + esc(k.hue || 'gold') + '"></i>' + esc(k.name) + '</span>'; }).join('') + '</div><svg class="dk-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(L(['Minutes of learning each day', 'دقائق التعلّم كل يوم'])) + '">' + grid + bars + '</svg><p class="dk-note">' + esc(L(['Only time with a lesson, a stop or the Qurʾān on screen counts.', 'لا يُحسب إلا وقت الدرس أو المحطة أو القرآن على الشاشة.'])) + '</p></section>' +
      '<section class="card"><h3>' + esc(L(['Paper waiting for you', 'أوراق تنتظرك'])) + '</h3>' + (waiting.length ? waiting.slice(0, 8).map(function (w) { return '<a class="li" href="#/parent/' + esc(w.k.id) + '/today">' + A.icon('print', 20) + '<span class="grow"><b>' + esc(Print.titleOf(w.s)) + '</b><small>' + esc(w.k.name) + ' · ' + esc(Print.status(w.s)) + '</small></span>' + A.icon('next', 16) + '</a>'; }).join('') : '<p class="dk-empty">' + esc(L(['Nothing to mark or tick.', 'لا شيء للتصحيح أو الإنجاز.'])) + '</p>') +
      '<div class="dk-row2"><a class="btn ghost" href="#/desk/print">' + A.icon('print', 18) + '<span>' + esc(L(['Print Studio', 'استوديو الطباعة'])) + '</span></a></div></section></div>';
    at.insertAdjacentHTML('afterend', html);
  }
  /* a teenager's week column: every subject's progress at their stage */
  function teenSubjects() {
    var p = A.P(), tw = $('.view .tw'); if (!p || !tw) return;
    var st = A.stage(p);
    var rows = Object.keys(C.rooms).filter(function (r) { return !(p.off || {})[r] && r !== 'quran'; }).map(function (r) {
      var all = 0, met = 0; C.rooms[r].units.forEach(function (u) { if (u.band != null && u.band > st) return; u.skills.forEach(function (s) { all++; if (M.met(s.id, p.id)) met++; }); });
      return all ? '<a class="dk-sp h-' + esc(C.rooms[r].hue || 'gold') + '" href="#/room/' + r + '"><span class="grow"><b>' + esc(L(C.rooms[r].name)) + '</b><i><em style="width:' + Math.round(100 * met / all) + '%"></em></i></span><small>' + A.num(met) + ' / ' + A.num(all) + '</small></a>' : '';
    }).join('');
    var qc = quranCard(p); if (qc) tw.insertAdjacentHTML('beforeend', '<div class="tsec">' + esc(L(['Qurʾān', 'القرآن'])) + '</div>' + qc);
    tw.insertAdjacentHTML('beforeend', '<div class="tsec dk-subj">' + esc(L(['Subjects', 'المواد'])) + '</div><div class="dk-sps">' + rows + '</div>');
    /* two columns: the plan, and everything about the week */
    var tl = $('.tl', tw), side = document.createElement('div'), main = document.createElement('div');
    side.className = 'dk-side'; main.className = 'dk-main';
    var kids = Array.prototype.slice.call(tw.children), after = false;
    kids.forEach(function (c) { if (c.classList.contains('tnext')) return; if (after) side.appendChild(c); else main.appendChild(c); if (c === tl) after = true; });
    tw.appendChild(main); tw.appendChild(side); tw.classList.add('dk2');
  }
  function roomIndex() {
    var rid = A.route().split('/')[1], room = C.rooms[rid], p = A.P(), map = $('.view .rmap');
    if (!room || !p || !map) return;
    var st = A.stage(p), next = null;
    var units = room.units.filter(function (u) { return (u.band == null || u.band <= Math.max(st, 0)) && u.skills.length; });
    var html = '<aside class="dk-units h-' + esc(room.hue || 'gold') + '"><h3>' + esc(L(['Every lesson here', 'كل دروس الغرفة'])) + '</h3>' + units.map(function (u) {
      var met = u.skills.filter(function (s) { return M.met(s.id, p.id); }).length;
      return '<div class="dk-u"><div class="dk-u-h">' + esc(L(u.title)) + '<small>' + A.num(met) + ' / ' + A.num(u.skills.length) + '</small></div>' + u.skills.map(function (s) {
        var m = M.met(s.id, p.id), o = !m && C.open(s, p.id), isNext = o && !next; if (isNext) next = s.id;
        return '<button class="dk-l' + (m ? ' met' : o ? ' open' : '') + (isNext ? ' next' : '') + '" data-l="' + esc(s.id) + '"' + (m || o ? '' : ' disabled') + '><span class="st">' + (m ? A.icon('check', 13) : o ? A.icon('play', 11) : A.icon('lock', 12)) + '</span><span class="grow">' + esc(L(s.title)) + '</span></button>';
      }).join('') + '</div>';
    }).join('') + '</aside>';
    var box = document.createElement('div'); box.className = 'dk-room';
    map.parentNode.insertBefore(box, map); box.appendChild(map); box.insertAdjacentHTML('beforeend', html);
    $$('.dk-l', box).forEach(function (b) { b.onclick = function () { if (!b.disabled) A.go('lesson/' + b.dataset.l); }; });
    var n = $('.dk-l.next', box), list = $('.dk-units', box); if (n && list) list.scrollTop = n.offsetTop - list.clientHeight / 2;
  }
  /* every new screen replaces #app's child: that is the moment to redraw the rail and name the window */
  var screens = new MutationObserver(function () { after(); });
  var apply0 = A.applyTheme;
  A.applyTheme = function () { apply0(); if (document.body) { var r = $('#rail .dn'); if (r) { var dark = document.documentElement.dataset.theme === 'dark'; r.setAttribute('aria-checked', dark ? 'true' : 'false'); } try { B.titleBar(document.documentElement.dataset.theme || 'light', /^(welcome|who)$/.test(document.body.dataset.view || '')); } catch (e) { } } };

  /* a sheet straight to a PDF, beside Print */
  function pdfButton() {
    var acts = $('.pp-acts'), go = $('#pp-go'); if (!acts || !go || $('#pp-pdf')) return;
    var b = document.createElement('button'); b.className = 'btn ghost'; b.id = 'pp-pdf';
    b.innerHTML = ic('pdf', 18) + '<span>' + esc(L(['Save as PDF', 'احفظ PDF'])) + '</span>';
    b.onclick = function () { Desk._pdf = true; go.click(); };
    go.insertAdjacentElement('afterend', b);
    /* with its own PDF button beside it, the first button only prints */
    var gs = go.querySelector('span'); if (gs) gs.textContent = L(['Print', 'اطبع']);
  }
  Desk.onPdf = function (path) {
    if (window.Print && Print.leave) Print.leave();
    if (!path) { A.toast(L(['The PDF could not be saved', 'تعذر حفظ ملف PDF'])); return; }
    A.sheet(L(['Saved as PDF', 'حُفظ PDF']), '<div class="dk-saved">' + ic('pdf', 34) + '<p>' + esc(path.split(/[\\/]/).pop()) + '</p><small>' + esc(L(['Documents › Miftah › Printables', 'المستندات › Miftah › Printables'])) + '</small><small class="dk-saved-t">' + A.icon('pen', 14) + esc(L(['Your PDF reader can write on it too', 'يمكنك الكتابة عليه في قارئ PDF أيضًا'])) + '</small><div class="dk-row2"><button class="btn pri" id="pdf-open">' + esc(L(['Open it', 'افتحه'])) + '</button><button class="btn ghost" id="pdf-show">' + ic('folder', 18) + '<span>' + esc(L(['Show in folder', 'أظهره في المجلد'])) + '</span></button></div></div>', function (sh) {
      $('#pdf-open', sh).onclick = function () { B.openPdf(path); A.closeSheet(); };
      $('#pdf-show', sh).onclick = function () { B.reveal(path); A.closeSheet(); };
    });
  };

  /* ================= the keyboard ================= */
  /* small key labels on the choices of a lesson, so a child can see which key is which */
  /* a wide lesson: what to work on becomes one block, so it centres against the answer beside it */
  function pair() {
    if (innerWidth < 1150 || innerHeight < 660) return;
    $$('.step-in').forEach(function (si) {
      if (si.classList.contains('dk-2')) return;
      var ans = $$(':scope>.pad, :scope>.ch', si)[0], rest = Array.prototype.slice.call(si.children).filter(function (c) { return c !== ans; });
      if (!ans || !rest.length) return;
      var q = document.createElement('div'); q.className = 'dk-lq';
      si.insertBefore(q, si.firstChild); rest.forEach(function (c) { q.appendChild(c); });
      si.classList.add('dk-2');
      /* a sum gets squared paper beside it, always open: working out is part of the work, not a hint */
      if (ans.classList.contains('pad')) workPaper(q);
    });
    /* the lesson's name over the step, so a parent glancing across knows what is being learned */
    var head = $('.pl-head'), sk = C.skill(A.route().split('/')[1]);
    if (head && sk && !$('.dk-lt', head)) head.insertAdjacentHTML('afterbegin', '<div class="dk-lt">' + esc(L(C.rooms[sk.room].name)) + ' · ' + esc(L(sk.title)) + '</div>');
  }
  function workPaper(host) {
    var w = document.createElement('div'); w.className = 'dk-work';
    w.innerHTML = '<div class="dk-work-h"><span>' + esc(L(['Working', 'مساحة الحل'])) + '</span><button type="button">' + esc(L(['Clear', 'امسح'])) + '</button></div><canvas></canvas>';
    host.appendChild(w);
    var c = $('canvas', w), g = c.getContext('2d'), on = false;
    var size = function () { var r = c.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1); if (!r.width) return; c.width = r.width * dpr; c.height = r.height * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.lineWidth = 2.4; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = getComputedStyle(w).color; };
    requestAnimationFrame(size);
    var at = function (e) { var r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    c.onpointerdown = function (e) { on = true; try { c.setPointerCapture(e.pointerId); } catch (x) { } var q = at(e); g.beginPath(); g.moveTo(q[0], q[1]); e.preventDefault(); };
    c.onpointermove = function (e) { if (!on) return; var q = at(e); g.lineTo(q[0], q[1]); g.stroke(); };
    c.onpointerup = c.onpointercancel = function () { on = false; };
    $('button', w).onclick = function () { g.clearRect(0, 0, c.width, c.height); };
  }
  function hints() {
    if (document.body.dataset.view !== 'lesson' && document.body.dataset.view !== 'stop') return;
    pair();
    var opts = choices(); opts.forEach(function (b, i) { if (i < 9) b.setAttribute('data-kbd', A.num(i + 1)); });
  }
  function choices() { return $$('.step .opt:not([disabled]), .step .numopt:not([disabled]), .gate .numopt:not([disabled]), .sheet .numopt:not([disabled])').filter(function (b) { return b.offsetParent; }); }
  var mo = new MutationObserver(function () { clearTimeout(mo._t); mo._t = setTimeout(hints, 60); });
  document.addEventListener('DOMContentLoaded', function () { var app = $('#app'); if (app) { mo.observe(app, { childList: true, subtree: true }); screens.observe(app, { childList: true }); } });
  function typing(e) { var t = e.target; return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)); }
  function visible(el) { return el && el.offsetParent && !el.disabled; }
  var AR = '٠١٢٣٤٥٦٧٨٩';
  document.addEventListener('keydown', function (e) {
    var k = e.key, ctrl = e.ctrlKey || e.metaKey;
    if (pal && pal.parentNode) return;   /* the command bar has its own keys */
    if (ctrl && (k === 'k' || k === 'K')) { e.preventDefault(); Desk.palette(); return; }
    if (k === 'F11') { e.preventDefault(); if (Desk.focusOn) { Desk.askUnlock(); return; } B.deskSet('full', !document.documentElement.classList.contains('dk-full')); return; }
    if (k === 'F1' || (k === '?' && !typing(e))) { e.preventDefault(); Desk.keys(); return; }
    if (ctrl && (k === '=' || k === '+')) { e.preventDefault(); zoom(+0.1); return; }
    if (ctrl && k === '-') { e.preventDefault(); zoom(-0.1); return; }
    if (ctrl && k === '0') { e.preventDefault(); B.deskZoom(1); return; }
    if (ctrl && k === ',') { e.preventDefault(); grown(function () { A.go('desk/pc'); }); return; }
    if (ctrl && (k === 'p' || k === 'P')) { e.preventDefault(); var pr = $('#pp-go'); if (visible(pr)) pr.click(); else grown(function () { A.go('desk/print'); }); return; }
    if (ctrl && e.shiftKey && (k === 'l' || k === 'L')) { e.preventDefault(); var dn = $('.dn'); if (dn) dn.click(); return; }
    if (ctrl && k === 'q') { e.preventDefault(); B.quit(); return; }
    if (ctrl && /^[1-9]$/.test(k) && !Desk.focusOn) { var kid = (A.S.profiles || [])[+k - 1]; if (kid && !/^(lesson|stop|exam|paper)$/.test(document.body.dataset.view)) { e.preventDefault(); A.S.cur = kid.id; A.saveNow(); A.go('home'); A.rerender(); } return; }
    if (k === 'Escape') {
      if (A.closeSheet && A.closeSheet()) { e.preventDefault(); return; }
      if (Desk.focusOn && /^(home|who)$/.test(document.body.dataset.view)) { e.preventDefault(); Desk.askUnlock(); return; }
      if (document.documentElement.classList.contains('dk-full') && !Desk.focusOn) { B.deskSet('full', false); return; }
      if (document.body.dataset.view !== 'home') { e.preventDefault(); var r = window.__native.onBack && window.__native.onBack(); return; }
      return;
    }
    if ((e.altKey && k === 'ArrowLeft') || (k === 'BrowserBack')) { e.preventDefault(); if (window.__native.onBack) window.__native.onBack(); return; }
    if (typing(e) || ctrl || e.altKey) return;
    /* in a lesson: the number pad, the choices, and Enter for whatever comes next */
    var digit = /^[0-9]$/.test(k) ? k : AR.indexOf(k) >= 0 ? String(AR.indexOf(k)) : null;
    var pad = $('.step .pad');
    if (pad && digit != null) { var pb = $('button[data-d="' + digit + '"]', pad); if (visible(pb)) { e.preventDefault(); press(pb); } return; }
    if (pad && (k === '.' || k === '-' || k === '/')) { var sb = $('button[data-d="' + k + '"]', pad); if (visible(sb)) { e.preventDefault(); press(sb); } return; }
    if (pad && k === 'Backspace') { var del = $('.pad-del', pad); if (visible(del)) { e.preventDefault(); press(del); } return; }
    if (k === 'Enter') {
      var go = pad && $('.pad-go', pad), nx = $('.pl-next'), pri = $$('.step .btn.pri, .pl-foot .btn.pri, .view .btn.pri.big').filter(visible)[0];
      var target = visible(go) ? go : visible(nx) ? nx : pri;
      if (target) { e.preventDefault(); press(target); }
      return;
    }
    if (digit != null && digit !== '0') { var ch = choices()[+digit - 1]; if (ch) { e.preventDefault(); press(ch); } return; }
    if (k === ' ' && document.body.dataset.view === 'lesson') { var sp = $('.pl-sp, .step [data-a="say"], .step .listen'); if (visible(sp)) { e.preventDefault(); press(sp); } }
  });
  function press(b) { b.classList.add('kpress'); setTimeout(function () { b.classList.remove('kpress'); }, 140); b.click(); }
  function zoom(d) { var z = 1; try { z = info().zoom || 1; } catch (e) { } z = Math.round((z + d) * 10) / 10; B.deskZoom(z); A.toast(L(['Size', 'الحجم']) + ' ' + A.num(Math.round(z * 100)) + '%'); }

  Desk.keys = function () {
    var row = function (k, t) { return '<div class="dk-k"><span>' + k + '</span><b>' + esc(L(t)) + '</b></div>'; };
    A.sheet(L(['Keyboard', 'لوحة المفاتيح']),
      '<div class="dk-keys"><h4>' + esc(L(['Anywhere', 'في كل مكان'])) + '</h4>' +
      row(kbd('Ctrl') + kbd('K'), ['Search or jump to anything', 'ابحث أو انتقل إلى أي شيء']) +
      row(kbd('Esc'), ['Close, or go back', 'أغلق أو ارجع']) +
      row(kbd('F11'), ['Full screen', 'ملء الشاشة']) +
      row(kbd('Ctrl') + kbd('1') + '…' + kbd('9'), ['Switch to a child', 'انتقل إلى طفل']) +
      row(kbd('Ctrl') + kbd('P'), ['Print Studio, or print this sheet', 'استوديو الطباعة أو اطبع هذه الورقة']) +
      row(kbd('Ctrl') + kbd('+') + ' ' + kbd('−') + ' ' + kbd('0'), ['Bigger, smaller, as it was', 'أكبر، أصغر، كما كان']) +
      row(kbd('Ctrl') + kbd('Shift') + kbd('L'), ['Day or night', 'نهار أو ليل']) +
      row(kbd('Ctrl') + kbd(','), ['This computer', 'هذا الحاسوب']) +
      '<h4>' + esc(L(['In a lesson', 'في الدرس'])) + '</h4>' +
      row(kbd('0') + '…' + kbd('9'), ['Type the answer', 'اكتب الجواب']) +
      row(kbd('1') + kbd('2') + kbd('3') + kbd('4'), ['Choose an answer', 'اختر جوابًا']) +
      row(kbd('Enter'), ['Check, then Next', 'تحقّق ثم التالي']) +
      row(kbd('⌫'), ['Delete a digit', 'احذف رقمًا']) +
      row(kbd('Space'), ['Hear it again', 'استمع مرة أخرى']) + '</div>');
  };

  /* ================= the command bar ================= */
  var pal = null;
  function entries() {
    var out = [], p = A.P(), add = function (group, icon, title, sub, run, words) { out.push({ g: group, ic: icon, t: title, s: sub || '', run: run, w: (title + ' ' + (sub || '') + ' ' + (words || '')).toLowerCase() }); };
    (A.S.profiles || []).forEach(function (k, i) { add(L(['Children', 'الأطفال']), avatar(k, 22), k.name, L(A.STAGES[A.stage(k)].name), function () { A.S.cur = k.id; A.saveNow(); A.go('home'); A.rerender(); }, 'child ' + (i + 1)); });
    if (p) {
      Object.keys(C.rooms).forEach(function (r) { var rm = C.rooms[r]; if ((p.off || {})[r]) return; add(L(['Subjects', 'المواد']), A.icon('rooms', 20), L(rm.name), '', function () { A.go('room/' + r); }, r); });
      var n = 0, st = A.stage(p);
      Object.keys(C.rooms).forEach(function (r) {
        C.rooms[r].units.forEach(function (u) {
          if (u.band > st + 1) return;
          u.skills.forEach(function (s) {
            if (n > 1500) return; n++;
            var open = M.met(s.id) || C.open(s, p.id);
            add(L(['Lessons', 'الدروس']), A.icon(open ? 'book' : 'lock', 20), L(s.title), L(C.rooms[r].name) + ' · ' + L(u.title) + (open ? '' : ' · ' + L(['not open yet', 'لم يُفتح بعد'])), function () { A.go(open ? 'lesson/' + s.id : 'room/' + r); }, '');
          });
        });
      });
    }
    var G = L(['Grown-ups', 'للكبار']);
    add(G, A.icon('lock', 20), L(['Parent area', 'ركن الوالدين']), '', function () { A.go('parent'); }, 'family dashboard');
    if (p) {
      [['today', ['Today', 'اليوم']], ['log', ['Lessons', 'الدروس']], ['make', ['Print', 'الطباعة']], ['hear', ['Qurʾān', 'القرآن']], ['plan', ['Plan', 'الخطة']], ['set', ['Settings', 'الإعدادات']]].forEach(function (x) {
        add(G, A.icon('grown', 20), p.name + ' · ' + L(x[1]), L(['Parent area', 'ركن الوالدين']), function () { grown(function () { A.go('parent/' + p.id + '/' + x[0]); }); }, x[0]);
      });
    }
    add(G, A.icon('print', 20), L(['Print Studio', 'استوديو الطباعة']), L(['Several sheets at once, or one PDF', 'عدة أوراق معًا أو PDF واحد']), function () { grown(function () { A.go('desk/print'); }); }, 'pdf worksheet');
    add(G, ic('phone'), L(['Phone and computer', 'الهاتف والحاسوب']), L(['Pair a phone, sync on Wi-Fi', 'اقرن هاتفًا وزامن عبر الواي فاي']), function () { grown(function () { A.go('desk/link'); }); }, 'sync pair wifi');
    add(G, ic('pc'), L(['This computer', 'هذا الحاسوب']), L(['Install, backups, start with Windows', 'التثبيت والنسخ الاحتياطية والتشغيل مع ويندوز']), function () { grown(function () { A.go('desk/pc'); }); }, 'settings backup install tray');
    var D = L(['Actions', 'إجراءات']);
    add(D, A.icon(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon', 20), L(['Day or night', 'نهار أو ليل']), kbd('Ctrl') + kbd('Shift') + kbd('L'), function () { var d = $('.dn'); if (d) d.click(); else { A.S.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; A.saveNow(); A.applyTheme(); } }, 'theme dark light');
    add(D, ic('focus'), L(['Focus for a lesson', 'تركيز للدرس']), L(['Only a grown-up can leave', 'لا يخرج منه إلا الكبار']), function () { Desk.focus(true); }, 'lock kiosk');
    add(D, ic('full'), L(['Full screen', 'ملء الشاشة']), kbd('F11'), function () { B.deskSet('full', !document.documentElement.classList.contains('dk-full')); }, '');
    add(D, ic('kbd'), L(['Keyboard shortcuts', 'اختصارات لوحة المفاتيح']), kbd('F1'), function () { Desk.keys(); }, 'help keys');
    add(D, A.icon('swap', 20), A.ar() ? 'English' : 'العربية', L(['Language', 'اللغة']), function () { A.S.lang = A.ar() ? 'en' : 'ar'; A.saveNow(); A.applyTheme(); A.rerender(); }, 'language arabic english');
    return out;
  }
  function score(e, q) {
    if (!q) return e.g === L(['Lessons', 'الدروس']) ? -1 : 1;
    var w = e.w, t = e.t.toLowerCase();
    if (t.indexOf(q) === 0) return 100 - t.length / 100;
    var i = w.indexOf(q); if (i >= 0) return 60 - i / 100;
    var j = 0; for (var k = 0; k < w.length && j < q.length; k++) if (w[k] === q[j]) j++;
    return j === q.length ? 20 - w.length / 1000 : -1;
  }
  Desk.palette = function () {
    if (pal) { close(); return; }
    var all = entries(), sel = 0, shown = [];
    pal = document.createElement('div'); pal.className = 'dk-pal'; pal.setAttribute('role', 'dialog');
    pal.innerHTML = '<div class="dk-pal-bg"></div><div class="dk-pal-box"><label class="dk-pal-in">' + ic('search', 20) + '<input id="pal-q" autocomplete="off" spellcheck="false" placeholder="' + esc(L(['Search children, subjects, lessons, tools…', 'ابحث في الأطفال والمواد والدروس والأدوات…'])) + '">' + kbd('Esc') + '</label><div class="dk-pal-list" id="pal-l" role="listbox"></div><div class="dk-pal-foot">' + kbd('↑') + kbd('↓') + '<span>' + esc(L(['move', 'تنقّل'])) + '</span>' + kbd('Enter') + '<span>' + esc(L(['open', 'افتح'])) + '</span></div></div>';
    document.body.appendChild(pal);
    var q = $('#pal-q', pal), list = $('#pal-l', pal);
    function draw() {
      var s = q.value.trim().toLowerCase();
      shown = all.map(function (e) { return { e: e, s: score(e, s) }; }).filter(function (x) { return x.s >= 0; });
      if (!s) shown = shown.filter(function (x) { return x.e.g !== L(['Lessons', 'الدروس']); });
      shown.sort(function (a, b) { return b.s - a.s; }); shown = shown.slice(0, 40).map(function (x) { return x.e; });
      if (s) { /* grouped by kind, best first */ var order = []; shown.forEach(function (e) { if (order.indexOf(e.g) < 0) order.push(e.g); }); shown.sort(function (a, b) { return order.indexOf(a.g) - order.indexOf(b.g); }); }
      sel = Math.min(sel, Math.max(0, shown.length - 1));
      var last = null;
      list.innerHTML = shown.length ? shown.map(function (e, i) { var head = e.g !== last ? '<div class="dk-pal-g">' + esc(e.g) + '</div>' : ''; last = e.g; return head + '<button class="dk-pal-i' + (i === sel ? ' on' : '') + '" data-i="' + i + '" role="option"><span class="dk-pal-ic">' + e.ic + '</span><span class="grow"><b>' + esc(e.t) + '</b>' + (e.s ? '<small>' + (/<kbd>/.test(e.s) ? e.s : esc(e.s)) + '</small>' : '') + '</span>' + (i === sel ? A.icon('next', 16) : '') + '</button>'; }).join('') : '<p class="dk-pal-none">' + esc(L(['Nothing by that name', 'لا شيء بهذا الاسم'])) + '</p>';
      var on = $('.dk-pal-i.on', list); if (on) on.scrollIntoView({ block: 'nearest' });
    }
    function run(i) { var e = shown[i]; if (!e) return; close(); setTimeout(e.run, 10); }
    q.addEventListener('input', function () { sel = 0; draw(); });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); draw(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); draw(); }
      else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
      else if (e.key === 'Escape' || ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K'))) { e.preventDefault(); close(); }
    });
    list.addEventListener('click', function (e) { var b = e.target.closest('.dk-pal-i'); if (b) run(+b.dataset.i); });
    list.addEventListener('mousemove', function (e) { var b = e.target.closest('.dk-pal-i'); if (b && +b.dataset.i !== sel) { sel = +b.dataset.i; $$('.dk-pal-i', list).forEach(function (x) { x.classList.toggle('on', +x.dataset.i === sel); }); } });
    $('.dk-pal-bg', pal).onclick = close;
    draw(); requestAnimationFrame(function () { pal.classList.add('on'); q.focus(); });
  };
  function close() { if (!pal) return; var p = pal; pal = null; p.classList.remove('on'); setTimeout(function () { p.remove(); }, 160); }

  /* ================= focus ================= */
  Desk.focusOn = false;
  Desk.focus = function (on) {
    Desk.focusOn = on; document.documentElement.classList.toggle('dk-focus', on);
    B.deskSet('focus', on); placeRail();
    if (on) A.toast(L(['Focus is on. A grown-up can leave with Esc.', 'التركيز مُفعّل. يخرج الكبار بزر Esc.']));
  };
  Desk.askUnlock = function () { A.askGrown(function () { Desk.focusOn = false; document.documentElement.classList.remove('dk-focus'); B.unlocked(); placeRail(); }); };
  Desk.onFull = function (on) { document.documentElement.classList.toggle('dk-full', on); };

  /* ================= files dropped on the window ================= */
  Desk.onDropMedia = function (ref, kind, name) {
    var done = false;
    A.askGrown(function () {
      done = true;
      var m = Media.add({ kind: kind, ref: ref, title: (name || '').replace(/\.[^.]+$/, ''), when: 'shelf', ages: [0, 1, 2, 3, 4], attach: { type: 'room', id: 'math' } });
      A.go('parent/media'); A.toast(L(['Added to Media. Choose where it belongs.', 'أُضيف إلى الوسائط. اختر مكانه.']));
    });
    /* a child who drops a file and walks away leaves nothing behind */
    setTimeout(function () { if (!done && !$('.sheet.on')) B.mediaDelete(ref); }, 120000);
  };

  /* ================= the phone joins its record with this one ================= */
  Desk.lanMerge = function (txt, phone) {
    try {
      var o = JSON.parse(txt); if (!o || !Array.isArray(o.profiles)) return null;
      var r = A.Sync.merge(A.S, o, true); A.S = A.shape(r.S);
      if (window.Voice && Voice.refreshVoices) Voice.refreshVoices();
      A.saveNow(); A.rerender();
      var got = r.report.reduce(function (s, x) { return s + Math.max(0, x.lessons) + Math.max(0, x.ayat); }, 0);
      A.toast(L(['Joined with', 'تمّ الدمج مع']) + ' ' + (phone || L(['the phone', 'الهاتف'])) + (got ? ' · +' + A.num(got) : ''));
      linkState.last = Date.now();
      return JSON.stringify(Object.assign({}, A.S, { familyFile: 1 }));
    } catch (e) { return null; }
  };
  Desk.onLink = function (ev) {
    if (ev.link === 'paired') { A.toast(L(['Paired with', 'اقترن مع']) + ' ' + ev.name); }
    if (ev.link === 'badcode') A.toast(L(['A phone typed the wrong code', 'كتب هاتف رمزًا خاطئًا']));
    if (ev.link === 'locked') A.toast(L(['Too many wrong codes. Make a new one.', 'رموز خاطئة كثيرة. أنشئ رمزًا جديدًا.']));
    Desk.refresh();
  };
  Desk.refresh = function () {
    var i = info(); linkState.on = !!i.link; linkState.phones = i.phones || [];
    document.documentElement.classList.toggle('dk-full', !!i.full);
    if (/^#\/desk\//.test(location.hash) && !A.$('.sheet.on') && !(document.activeElement && /INPUT/.test(document.activeElement.tagName))) A.rerender(); else placeRail();
  };
  Desk.onInstalled = function (ok) { A.toast(ok ? L(['Miftāḥ is in your Start menu and on the desktop', 'مفتاح الآن في قائمة ابدأ وعلى سطح المكتب']) : L(['It could not be installed', 'تعذّر التثبيت'])); Desk.refresh(); };

  /* ================= the grown-up pages ================= */
  function page(title, sub, body, icon) {
    return '<div class="dk"><header class="dk-h"><span class="dk-h-ic">' + icon + '</span><div><h1>' + esc(title) + '</h1>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div></header>' + body + '</div>';
  }
  function sw(id, on, title, sub) { return '<label class="dk-sw"><span class="grow"><b>' + esc(title) + '</b>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</span><input type="checkbox" role="switch" data-set="' + id + '"' + (on ? ' checked' : '') + '><i></i></label>'; }
  function bytes(n) { return n > 1048576 ? A.num(Math.round(n / 104857.6) / 10) + ' MB' : A.num(Math.max(1, Math.round(n / 1024))) + ' KB'; }

  A.V.desk = function (args) {
    if (!(A.grownOpen && A.grownOpen())) return { redirect: 'parent' };
    var w = args[0];
    if (w === 'link') return linkPage();
    if (w === 'print') return printPage(args[1]);
    return pcPage();
  };

  /* ---------- Phone and computer ---------- */
  var codeT = null;
  function linkPage() {
    var i = info(), on = !!i.link, phones = i.phones || [], addr = (i.addresses || [])[0] || '';
    linkState.on = on; linkState.phones = phones;
    var art = '<svg class="dk-link-art" viewBox="0 0 360 150" aria-hidden="true"><defs><linearGradient id="lkg" x1="0" x2="1"><stop offset="0" stop-color="#f6dda5"/><stop offset="1" stop-color="#c79c52"/></linearGradient></defs>' +
      '<rect x="18" y="20" width="150" height="100" rx="12" fill="var(--s2)" stroke="var(--line2)" stroke-width="2"/><rect x="30" y="32" width="126" height="76" rx="6" fill="var(--bg)"/><path d="M78 132h30M93 120v12" stroke="var(--line2)" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M66 62l27-16 27 16v26a4 4 0 0 1-4 4H70a4 4 0 0 1-4-4z" fill="url(#lkg)" opacity=".9"/>' +
      '<rect x="262" y="26" width="64" height="112" rx="14" fill="var(--s2)" stroke="var(--line2)" stroke-width="2"/><rect x="270" y="38" width="48" height="84" rx="6" fill="var(--bg)"/><path d="M286 60l8-5 8 5v12h-16z" fill="url(#lkg)"/>' +
      '<g class="dk-waves" fill="none" stroke="url(#lkg)" stroke-width="3" stroke-linecap="round"><path d="M196 74a20 20 0 0 1 0-28"/><path d="M186 82a32 32 0 0 1 0-44" opacity=".6"/><path d="M234 46a20 20 0 0 1 0 28"/><path d="M244 38a32 32 0 0 1 0 44" opacity=".6"/></g>' +
      '<circle cx="215" cy="60" r="7" fill="url(#lkg)"/></svg>';
    var body = '<section class="dk-hero2">' + art + '<div><h2>' + esc(L(['One family record, on every device', 'سجلّ عائلي واحد على كل جهاز'])) + '</h2><p>' + esc(L(['Your phone and this computer join their records on your home Wi-Fi. No account, no cloud, and nothing leaves the house.', 'يدمج هاتفك وهذا الحاسوب سجلّيهما عبر شبكة البيت. بلا حساب ولا سحابة، ولا يغادر شيء البيت.'])) + '</p></div></section>';
    body += '<div class="dk-grid2"><section class="card">' + sw('link', on, L(['Let my phone find this computer', 'دع هاتفي يجد هذا الحاسوب']), L(['Windows may ask once to allow Miftāḥ on private networks. Choose Allow.', 'قد يسألك ويندوز مرة واحدة عن السماح لمفتاح على الشبكات الخاصة. اختر السماح.']));
    if (on) {
      body += '<div class="dk-pc"><span>' + ic('pc', 18) + '<b>' + esc(i.machine || '') + '</b></span>' + (addr ? '<code>' + esc(addr) + '</code>' : '<small>' + esc(L(['Not on a home network', 'غير متصل بشبكة منزلية'])) + '</small>') + '</div>';
      body += '<div class="dk-code" id="lk-code"><button class="btn pri wide" id="lk-new">' + esc(L(['Pair a phone', 'اقرن هاتفًا'])) + '</button></div>';
      body += '<ol class="dk-steps"><li>' + esc(L(['On the phone, open Miftāḥ, then Parent area › Devices.', 'في الهاتف افتح مفتاح ثم ركن الوالدين › الأجهزة.'])) + '</li><li>' + esc(L(['Tap Find my computer and choose', 'اضغط ابحث عن حاسوبي واختر']) + ' ' + (i.machine || '')) + '.</li><li>' + esc(L(['Type the six digits shown here.', 'اكتب الأرقام الستة الظاهرة هنا.'])) + '</li></ol>';
    }
    body += '</section><section class="card"><h3>' + esc(L(['Paired phones', 'الهواتف المقترنة'])) + '</h3>' +
      (phones.length ? phones.map(function (ph) { return '<div class="li"><span class="dk-phone">' + ic('phone', 20) + '</span><span class="grow"><b>' + esc(ph.name) + '</b><small>' + esc(L(['Last joined', 'آخر دمج'])) + ' · ' + esc(ago(ph.last)) + '</small></span><button class="btn ghost sm" data-forget="' + esc(ph.id) + '">' + esc(L(['Forget', 'انسَ'])) + '</button></div>'; }).join('')
        : '<p class="dk-empty">' + esc(L(['No phone yet. Once paired, the phone joins with this computer each time Miftāḥ opens on it at home.', 'لا هاتف بعد. بعد الاقتران ينضمّ الهاتف إلى هذا الحاسوب كلما فُتح مفتاح عليه في البيت.'])) + '</p>') +
      '<h3 class="dk-gap">' + esc(L(['Or with a file', 'أو بملف'])) + '</h3><p class="dk-note">' + esc(L(['For a computer away from home, or a tablet without Wi-Fi: the family file carries everything, recordings included.', 'لحاسوب خارج البيت أو جهاز بلا واي فاي: ملف العائلة يحمل كل شيء مع التسجيلات.'])) + '</p><div class="dk-row2"><button class="btn ghost" id="lk-save">' + A.icon('download', 18) + '<span>' + esc(L(['Save the family file', 'احفظ ملف العائلة'])) + '</span></button><button class="btn ghost" id="lk-open">' + ic('folder', 18) + '<span>' + esc(L(['Open a family file', 'افتح ملف عائلة'])) + '</span></button></div><p class="dk-note">' + esc(L(['Tip: drop a family file anywhere on this window.', 'نصيحة: أفلت ملف العائلة في أي مكان من هذه النافذة.'])) + '</p></section></div>';
    return {
      cls: 'dkv', html: page(L(['Phone and computer', 'الهاتف والحاسوب']), '', body, ic('wifi', 26)),
      mount: function (v) {
        bindSwitches(v);
        var nb = $('#lk-new', v); if (nb) nb.onclick = function () { showCode(v); };
        $$('[data-forget]', v).forEach(function (b) { b.onclick = function () { B.forgetPhone(b.dataset.forget); A.rerender(); }; });
        $('#lk-save', v).onclick = function () { A.N.call('exportFamily', 'Miftah-family-' + new Date().toISOString().slice(0, 10) + '.zip', JSON.stringify(Object.assign({}, A.S, { familyFile: 1 }))); };
        $('#lk-open', v).onclick = function () { A.__syncIn = true; A.N.call('importFile'); };
      },
      unmount: function () { clearInterval(codeT); try { B.pairEnd(); } catch (e) { } }
    };
  }
  function showCode(v) {
    var c = B.pairCode(); if (!c) return;
    var box = $('#lk-code', v), until = Date.now() + 10 * 60000;
    box.innerHTML = '<div class="dk-digits" aria-label="' + esc(c) + '">' + c.split('').map(function (d, i) { return '<span' + (i === 3 ? ' class="gap"' : '') + '>' + d + '</span>'; }).join('') + '</div><div class="dk-timer"><i id="lk-bar"></i></div><small id="lk-left"></small><button class="btn ghost sm" id="lk-again">' + esc(L(['New code', 'رمز جديد'])) + '</button>';
    $('#lk-again', box).onclick = function () { showCode(v); };
    clearInterval(codeT);
    var tick = function () {
      var left = Math.max(0, until - Date.now()), b = $('#lk-bar', box), s = $('#lk-left', box); if (!b) { clearInterval(codeT); return; }
      b.style.width = (left / 6000) + '%';
      s.textContent = left ? L(['Good for', 'صالح لمدة']) + ' ' + A.num(Math.ceil(left / 60000)) + ' ' + L(['min', 'د']) : L(['This code has run out', 'انتهت صلاحية هذا الرمز']);
      if (!left) { clearInterval(codeT); box.classList.add('old'); }
    };
    tick(); codeT = setInterval(tick, 1000);
  }
  function bindSwitches(v) {
    $$('[data-set]', v).forEach(function (x) { x.onchange = function () { B.deskSet(x.dataset.set, x.checked); }; });
  }

  /* ---------- This computer ---------- */
  function pcPage() {
    var i = info(), au = {}; try { au = JSON.parse(i.audio || '{}'); } catch (e) { }
    var z = Math.round((i.zoom || 1) * 100);
    var body = '';
    if (!i.installed || i.portable) body += '<section class="dk-install"><img class="dk-install-art" src="icon.svg" alt="" width="56" height="56"><div class="grow"><h2>' + esc(L(['Make Miftāḥ part of this computer', 'اجعل مفتاح جزءًا من هذا الحاسوب'])) + '</h2><p>' + esc(L(['Adds it to the Start menu, the desktop and Settings › Apps. No administrator needed, and you can remove it like any other program.', 'يضيفه إلى قائمة ابدأ وسطح المكتب والإعدادات › التطبيقات، بلا صلاحيات مدير، ويُزال كأي برنامج.'])) + '</p></div><button class="btn pri" id="pc-inst">' + esc(i.installed ? L(['Update the installed copy', 'حدّث النسخة المثبّتة']) : L(['Install', 'ثبّت'])) + '</button></section>';
    body += '<div class="dk-grid2"><section class="card"><h3>' + esc(L(['Window', 'النافذة'])) + '</h3>' +
      sw('startup', i.startup, L(['Start with Windows', 'شغّل مع ويندوز']), L(['Quietly, in the tray, ready for the phone and the reminder', 'بهدوء في شريط المهام، جاهزًا للهاتف والتذكير'])) +
      sw('tray', i.tray, L(['Keep in the tray when closed', 'أبقه في شريط المهام عند الإغلاق']), L(['So a paired phone can join its record at any time', 'ليتمكن الهاتف المقترن من الدمج في أي وقت'])) +
      '<div class="dk-zoom"><span class="grow"><b>' + esc(L(['Size of everything', 'حجم كل شيء'])) + '</b><small>' + kbd('Ctrl') + kbd('+') + ' / ' + kbd('−') + '</small></span><input type="range" min="70" max="200" step="10" value="' + z + '" id="pc-z" aria-label="' + esc(L(['Size', 'الحجم'])) + '"><output id="pc-zo">' + A.num(z) + '%</output></div>' +
      '<div class="dk-row2"><button class="btn ghost" id="pc-full">' + ic('full', 18) + '<span>' + esc(L(['Full screen', 'ملء الشاشة'])) + '</span></button><button class="btn ghost" id="pc-keys">' + ic('kbd', 18) + '<span>' + esc(L(['Keyboard shortcuts', 'اختصارات لوحة المفاتيح'])) + '</span></button></div></section>';
    body += '<section class="card"><h3>' + esc(L(['Your family’s data', 'بيانات عائلتك'])) + '</h3><p class="dk-note">' + esc(L(['Everything stays on this computer, in one folder you can see.', 'يبقى كل شيء على هذا الحاسوب في مجلد واحد تراه.'])) + '</p><button class="dk-path" id="pc-data">' + ic('folder', 18) + '<code>' + esc(i.data || '') + '</code></button>' +
      '<div class="li"><span class="grow"><b>' + esc(L(['Recitations kept', 'التلاوات المحفوظة'])) + '</b><small>' + A.num(au.files || 0) + ' · ' + bytes(au.bytes || 0) + '</small></span></div>' +
      '<div class="li"><span class="grow"><b>' + esc(L(['Printables', 'المطبوعات'])) + '</b><small>' + esc(L(['Documents › Miftah › Printables', 'المستندات › Miftah › Printables'])) + '</small></span><button class="btn ghost sm" id="pc-prints">' + esc(L(['Open', 'افتح'])) + '</button></div></section></div>';
    var bk = i.backups || [];
    body += '<section class="card"><h3>' + ic('restore', 18) + ' ' + esc(L(['Backups', 'النسخ الاحتياطية'])) + '</h3><p class="dk-note">' + esc(L(['One copy a day, the last thirty days. Going back joins nothing and loses nothing: today’s record is kept as a backup first.', 'نسخة كل يوم لآخر ثلاثين يومًا. الرجوع لا يُضيّع شيئًا: يُحفظ سجل اليوم نسخةً أولًا.'])) + '</p><div class="dk-bk">' +
      (bk.length ? bk.slice(0, 30).map(function (b, j) { var d = new Date(b.name + 'T12:00:00'); return '<button class="dk-bk-i" data-bk="' + esc(b.name) + '"' + (j === 0 ? ' disabled' : '') + '><b>' + esc(d.toLocaleDateString(A.ar() ? 'ar' : 'en', { weekday: 'short', day: 'numeric', month: 'short' })) + '</b><small>' + (j === 0 ? esc(L(['Today', 'اليوم'])) : bytes(b.bytes)) + '</small></button>'; }).join('') : '<p class="dk-empty">' + esc(L(['The first backup is made today.', 'تُصنع أول نسخة اليوم.'])) + '</p>') + '</div><button class="btn ghost sm" id="pc-bkdir">' + ic('folder', 16) + '<span>' + esc(L(['Show the backups folder', 'أظهر مجلد النسخ'])) + '</span></button></section>';
    body += '<p class="dk-ver">Miftāḥ ' + esc(i.version || '') + ' · Windows · ' + esc(L(['Open source, MIT licence', 'مفتوح المصدر، رخصة MIT'])) + '</p>';
    return {
      cls: 'dkv', html: page(L(['This computer', 'هذا الحاسوب']), i.machine || '', body, ic('pc', 26)),
      mount: function (v) {
        bindSwitches(v);
        var inst = $('#pc-inst', v); if (inst) inst.onclick = function () { inst.disabled = true; B.install(); };
        var zr = $('#pc-z', v), zo = $('#pc-zo', v);
        zr.oninput = function () { zo.textContent = A.num(zr.value) + '%'; }; zr.onchange = function () { B.deskZoom(zr.value / 100); };
        $('#pc-full', v).onclick = function () { B.deskSet('full', true); };
        $('#pc-keys', v).onclick = Desk.keys;
        $('#pc-data', v).onclick = function () { B.openFolder('data'); };
        $('#pc-prints', v).onclick = function () { B.openFolder('printables'); };
        $('#pc-bkdir', v).onclick = function () { B.openFolder('backups'); };
        $$('[data-bk]', v).forEach(function (b) { b.onclick = function () { restore(b.dataset.bk); }; });
      }
    };
  }
  function restore(name) {
    var txt = B.backup(name); var o; try { o = JSON.parse(txt); } catch (e) { o = null; }
    if (!o || !Array.isArray(o.profiles)) { A.toast(L(['That backup could not be read', 'تعذّرت قراءة النسخة'])); return; }
    var d = new Date(name + 'T12:00:00').toLocaleDateString(A.ar() ? 'ar' : 'en', { weekday: 'long', day: 'numeric', month: 'long' });
    A.sheet(L(['Go back to', 'ارجع إلى']) + ' ' + d, '<p class="dk-note">' + esc(L(['The record returns to how it was that day. Everything after it is set aside, not lost: today is saved as a backup first.', 'يعود السجل كما كان ذلك اليوم. ما بعده يُحفظ جانبًا ولا يضيع: يُحفظ اليوم نسخةً أولًا.'])) + '</p><div class="dk-row2"><button class="btn pri" id="bk-go">' + esc(L(['Go back', 'ارجع'])) + '</button><button class="btn ghost" id="bk-no">' + esc(L(['Keep today', 'أبقِ اليوم'])) + '</button></div>', function (sh) {
      $('#bk-no', sh).onclick = A.closeSheet;
      $('#bk-go', sh).onclick = function () {
        var keep = { lang: A.S.lang, theme: A.S.theme, pin: A.S.pin, motion: A.S.motion };
        A.N.call('exportFile', 'Miftah-before-' + name + '.json', JSON.stringify(A.S));
        A.S = A.shape(Object.assign(o, keep)); A.saveNow(); A.closeSheet(); A.go('parent'); A.toast(L(['The record is as it was on', 'السجل كما كان في']) + ' ' + d);
      };
    });
  }

  /* ---------- Print Studio ---------- */
  var picked = {};
  function printPage(pid) {
    var kids = A.S.profiles || []; if (!kids.length) return { redirect: 'parent' };
    pid = pid || (A.P() || kids[0]).id; var p = A.profile(pid) || kids[0]; pid = p.id;
    var list = Print.available(pid), sug = Print.suggest(pid);
    if (!picked[pid]) { picked[pid] = {}; sug.forEach(function (k) { picked[pid][k] = 1; }); }
    var groups = {}; list.forEach(function (k) { (groups[k.group] = groups[k.group] || []).push(k); });
    var chosen = list.filter(function (k) { return picked[pid][k.id]; });
    var body = '<div class="dk-chips">' + kids.map(function (k) { return '<a class="dk-chip' + (k.id === pid ? ' on' : '') + '" href="#/desk/print/' + esc(k.id) + '">' + avatar(k, 24) + '<span>' + esc(k.name) + '</span></a>'; }).join('') + '</div>';
    body += '<div class="dk-studio"><div class="dk-pick">' + Object.keys(groups).map(function (g) {
      return '<section><h3>' + esc(T((Print.GROUPS || []).filter(function (x) { return x[0] === g; }).map(function (x) { return x[1]; })[0] || g)) + '</h3><div class="dk-tiles">' + groups[g].map(function (k) {
        var on = !!picked[pid][k.id], s = sug.indexOf(k.id) >= 0;
        return '<button class="dk-tile' + (on ? ' on' : '') + '" data-k="' + esc(k.id) + '" aria-pressed="' + on + '"><span class="dk-tick">' + A.icon('check', 14) + '</span><b>' + esc(L(k.title)) + '</b><small>' + esc(L(k.desc || '')) + '</small>' + (s ? '<em>' + esc(L(['Suggested today', 'مقترح اليوم'])) + '</em>' : '') + '</button>';
      }).join('') + '</div></section>';
    }).join('') + '</div><aside class="dk-tray"><h3>' + esc(L(['To print', 'للطباعة'])) + '</h3>' +
      (chosen.length ? '<ol>' + chosen.map(function (k) { return '<li>' + esc(L(k.title)) + '</li>'; }).join('') + '</ol>' : '<p class="dk-empty">' + esc(L(['Tick the sheets you want. Today’s suggestions are ticked for you.', 'اختر الأوراق التي تريدها. اقتراحات اليوم مختارة لك.'])) + '</p>') +
      '<p class="dk-note">' + esc(L(['Every sheet is made fresh for', 'كل ورقة تُصنع من جديد لـ']) + ' ' + p.name + L([', from what they know today. Each is logged, so practice can be marked later.', ' مما يعرفه اليوم، وتُسجَّل كل ورقة لتصحيح التدريب لاحقًا.'])) + '</p>' +
      '<button class="btn pri wide" id="ps-print"' + (chosen.length ? '' : ' disabled') + '>' + A.icon('print', 18) + '<span>' + esc(L(['Print', 'اطبع'])) + '</span></button><button class="btn ghost wide" id="ps-pdf"' + (chosen.length ? '' : ' disabled') + '>' + ic('pdf', 18) + '<span>' + esc(L(['Save as one PDF', 'احفظ PDF واحدًا'])) + '</span></button><button class="btn ghost sm wide" id="ps-dir">' + ic('folder', 16) + '<span>' + esc(L(['Printables folder', 'مجلد المطبوعات'])) + '</span></button></aside></div>';
    return {
      cls: 'dkv', html: page(L(['Print Studio', 'استوديو الطباعة']), L(['A week of paper in one go', 'أوراق الأسبوع دفعة واحدة']), body, A.icon('print', 26)),
      mount: function (v) {
        $$('.dk-tile', v).forEach(function (b) { b.onclick = function () { var k = b.dataset.k; if (picked[pid][k]) delete picked[pid][k]; else picked[pid][k] = 1; A.rerender(); }; });
        var make = function (pdf) {
          var html = '', made = 0, seed = A.seed();
          chosen.forEach(function (k, i) { var r = Print.make(k.id, pid, seed + i * 7919); if (!r) return; Print.keep(r, pid); html += r.html; made++; });
          if (!made) { A.toast(L(['Nothing to print yet', 'لا شيء للطباعة بعد'])); return; }
          Desk._pdf = !!pdf;
          Print.send(html, 'Miftah ' + p.name + ' ' + new Date().toISOString().slice(0, 10));
        };
        $('#ps-print', v).onclick = function () { make(false); };
        $('#ps-pdf', v).onclick = function () { make(true); };
        $('#ps-dir', v).onclick = function () { B.openFolder('printables'); };
      }
    };
  }

  /* on a computer, "your other device" is the phone: the sheet becomes the Phone and computer page */
  if (A.Sync) A.Sync.open = function () { A.closeSheet && A.closeSheet(); grown(function () { A.go('desk/link'); }); };
  /* ================= start ================= */
  document.addEventListener('DOMContentLoaded', function () { setTimeout(function () { Desk.refresh(); after(); }, 0); });
  addEventListener('resize', function () { clearTimeout(placeRail._t); placeRail._t = setTimeout(function () { placeRail(); wide(); }, 120); });
})();
