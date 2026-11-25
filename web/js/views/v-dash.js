/* The parent's dashboard: the family at a glance, each child at a glance, then the detail. Numbers and shape do the explaining. And the media library, as a gallery. */
(function () {
  'use strict';
  var A = window.A, C = window.C, M = window.M, Plan = window.Plan, Flow = window.Flow, Hifz = window.Hifz, Media = window.Media, Voice = window.Voice;
  var $ = A.$, $$ = A.$$, esc = A.esc, L = A.L, N = function (x) { return A.num(x); }, DAY = 864e5;
  var PHOTO = '<svg class="ic" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 17l5-4.5 3.5 3 3-2.5L20.5 17"/></svg>';
  var SYNC = '<svg class="ic" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 13.7-5.6L20 9M20 4v5h-5M20 12a8 8 0 0 1-13.7 5.6L4 15M4 20v-5h5"/></svg>';
  A.acts['s-sync'] = function () { A.Sync.open(); };
  var PLUS = '<svg class="ic" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  function ring(pct, size, inner) { var r = 15.9, c = 100, v = Math.max(0, Math.min(100, pct)); return '<span class="ring" style="width:' + size + 'px;height:' + size + 'px"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="' + r + '" class="ring-b"/><circle cx="18" cy="18" r="' + r + '" class="ring-v" stroke-dasharray="' + v + ' ' + (c - v) + '" stroke-dashoffset="25"/></svg><b>' + inner + '</b></span>'; }
  function mins(ms) { var m = Math.round(ms / 60000); return m < 60 ? N(m) + L([' min', ' د']) : N(Math.floor(m / 60)) + L([' h ', ' س ']) + N(m % 60); }
  function avatar(p, s) { return '<span class="dv h-' + (p.hue || 'gold') + '" style="width:' + s + 'px;height:' + s + 'px">' + esc(p.name.charAt(0).toUpperCase()) + '</span>'; }
  function stats(p) {
    var pid = p.id, pl = Plan.today(pid), done = pl.stops.filter(function (s) { return s.done; }).length, wk = M.week ? M.week(pid) : [], d = A.D(pid), ret = M.retention(pid, 30), c = M.counts(pid);
    var since = A.dayNum() - 7, fresh = (d.hist || []).filter(function (h) { return h.n > since && h.p; }).length;
    var sc = d.screen || {}, time = 0, bars = [], now = A.now(); for (var i = 6; i >= 0; i--) { var k = A.day(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)), ms = (sc[k] || 0) + ((d.time || {})[k] || 0); time += ms; bars.push(ms); }
    return { pl: pl, done: done, total: pl.stops.length, week: time, bars: bars, recall: ret.of >= 3 ? Math.round(ret.ok / ret.of * 100) : null, keys: c.forged, proven: c.proven, deep: c.deep, fresh: fresh, need: Flow.inbox(pid).length, due: M.due(pid).length };
  }
  var UPD = '<svg class="ic" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V5M7 9.5l5-5 5 5M5 20h14"/></svg>';
  function appbar(title, sub, back, right) { return '<header class="abar"><a class="abtn" href="#/' + back + '" aria-label="' + esc(L(['Back', 'رجوع'])) + '">' + A.icon('back', 20) + '</a><div class="abar-t"><h1>' + esc(title) + '</h1>' + (sub ? '<small>' + esc(sub) + '</small>' : '') + '</div>' + (right || '') + '</header>'; }
  /* ---------- the family ---------- */
  /* what a parent needs ready today, from every child's real plan */
  function haveReady() {
    var seen = {}, out = [];
    A.S.profiles.forEach(function (p) {
      Plan.today(p.id).stops.forEach(function (x) {
        if (x.done) return; var m = x.t === 'mission' ? C.missions[x.id] : x.t === 'nursery' ? C.nursery[x.id] : null, mat = m && m.materials && L(m.materials);
        if (mat && !seen[mat]) { seen[mat] = 1; out.push(mat); }
      });
    });
    return out;
  }
  function nextFor(p) {
    var pl = Plan.today(p.id), i = -1; for (var k = 0; k < pl.stops.length; k++) if (!pl.stops[k].done) { i = k; break; }
    if (Flow.inSchoolBreak() || Flow.isOff(p.id)) return { text: L(['Day off', 'يوم راحة']), off: true };
    if (i < 0) return { text: L(['All done today', 'أنهى اليوم']), done: true };
    var was = A.S.cur; A.S.cur = p.id; var inf = A.stopInfo(pl.stops[i]); A.S.cur = was;
    return { text: L(inf.title) };
  }
  function yearLine(p) { var st = A.stage(p); return (st === 0 ? L(['Early years', 'الطفولة المبكرة']) : L(C.yearName(Flow.yearOf(p)))) + ' · ' + L(['age ', 'العمر ']) + N(A.age(p)); }
  A.acts['fam-go'] = function (t) { A.S.cur = t.dataset.id; A.saveNow(); A.go('home'); };
  A.acts['fam-off'] = function () { var off = A.S.profiles.every(function (p) { return Flow.isOff(p.id); }); A.S.profiles.forEach(function (p) { Flow.setOff(p.id, !off); }); A.rerender(); };
  function breakLabel(day) {
    return new Date(day + 'T12:00:00').toLocaleDateString(A.ar() ? 'ar' : 'en', {
      calendar: 'gregory', day: 'numeric', month: 'short', year: 'numeric'
    });
  }
  A.acts['fam-break'] = function () {
    if (!A.grownOpen()) return;
    var today = A.day(), range = Flow.schoolBreak();
    if (range && range.end < today) range = null;
    function dateField(id, label, first, value) {
      return '<label for="' + id + '">' + esc(L(label)) + '</label>' +
        '<input class="tin" type="date" required id="' + id + '" min="' + esc(first) + '" value="' + esc(value) + '">';
    }
    A.sheet(L(['School break', 'عطلة دراسية']),
      '<p>' + esc(L(['Pause scheduled lessons for everyone on this device. Both dates are included.',
        'أوقف الدروس المجدولة للجميع على هذا الجهاز. يشمل التوقف يومَي البداية والنهاية.'])) + '</p>' +
      '<form id="break-form" style="display:grid;gap:8px">' +
      dateField('break-from', ['First day', 'اليوم الأول'], range && range.start < today ? range.start : today, range ? range.start : today) +
      dateField('break-to', ['Last day', 'اليوم الأخير'], range ? range.start : today, range ? range.end : today) +
      '<p id="break-error" role="alert" hidden>' + esc(L(['Choose a valid date range.', 'اختر فترة زمنية صحيحة.'])) + '</p>' +
      '<button type="submit" class="btn pri wide">' + esc(L(['Save break', 'احفظ العطلة'])) + '</button>' +
      (range ? '<button type="button" class="btn sec wide" id="break-remove">' + esc(L(['Cancel break', 'ألغِ العطلة'])) + '</button>' : '') +
      '</form>', function (sh) {
        var from = $('#break-from', sh), to = $('#break-to', sh), remove = $('#break-remove', sh);
        from.onchange = function () { to.min = from.value; };
        $('#break-form', sh).onsubmit = function (event) {
          event.preventDefault();
          if (!A.grownOpen()) return;
          if (!Flow.setSchoolBreak(from.value, to.value)) { $('#break-error', sh).hidden = false; return; }
          A.closeSheet(); A.rerender();
        };
        if (remove) remove.onclick = function () {
          if (!A.grownOpen()) return;
          Flow.setSchoolBreak(null); A.closeSheet(); A.rerender();
        };
      });
  };
  function topActionFor(p) {
    var d = A.D(p.id), st = A.stage(p);
    var sheets = (d.sheets || []).filter(function (x) { return window.Print ? Print.waiting(x) : x.q && x.q.length && !x.marked; }).reverse();
    if (sheets.length) {
      var sh = sheets[0], markable = !!(sh.q || (sh.scr && sh.sub));
      return { href: markable ? '#/parent/' + p.id + '/mark/' + sh.id : '#/parent/' + p.id + '/today', ic: markable ? 'pen' : 'print', label: markable ? L(['Mark sheet', 'صحّح الورقة']) : L(['Check sheet', 'راجع الورقة']), sub: window.Print ? Print.titleOf(sh) : '' };
    }
    if (st > 0) {
      var hh = Hifz.state(p.id), unrec = Object.keys(d.recs || {}).filter(function (k) { var u = hh.u[k]; return !u || !u.heard || u.heard < d.recs[k]; });
      if (unrec.length) return { href: '#/parent/' + p.id + '/hear', ic: 'mic', label: L(['Listen to recitation', 'استمع إلى التلاوة']), sub: N(unrec.length) + ' ' + L(['waiting', 'بانتظارك']) };
    }
    if ((d.pending || []).length) return { href: '#/parent/' + p.id + '/today', ic: 'check', label: L(['Confirm deed', 'أكّد العمل']), sub: N(d.pending.length) + ' ' + L(['waiting', 'بانتظارك']) };
    if (st >= 3) {
      var shared = (d.work || []).filter(function (w) { return w.shared && !w.mark; });
      if (shared.length) return { href: '#/marking/' + encodeURIComponent(p.id), ic: 'note', label: L(['Review shared work', 'راجع العمل المُشارَك']), sub: shared[0].title };
    }
    return null;
  }
  function family() {
    var kids = A.S.profiles;
    var cards = kids.map(function (p) {
      var s = stats(p), pct = s.total ? Math.round(s.done / s.total * 100) : 0, nx = nextFor(p), st = A.stage(p), fresh = st >= 2 && !s.keys && !Object.keys(A.D(p.id).placed || {}).length, act = topActionFor(p);
      return '<div class="fc"><a class="fc-top" href="#/parent/' + p.id + '"><div class="fc-h">' + avatar(p, 48) + '<div class="fc-n"><b>' + esc(p.name) + '</b><small>' + esc(yearLine(p)) + '</small></div>' + (s.need ? '<span class="need2">' + N(s.need) + ' ' + esc(L(['to check', 'للمراجعة'])) + '</span>' : '') + ring(pct, 46, N(s.done) + '/' + N(s.total)) + '</div><div class="fc-k"><div><b>' + mins(s.week) + '</b><small>' + esc(L(['this week', 'الأسبوع'])) + '</small></div><div><b>' + N(s.keys) + '</b><small>' + esc(L(['mastered', 'أُتقن'])) + '</small></div>' + (s.recall == null ? '' : '<div><b>' + N(s.recall) + '%</b><small>' + esc(L(['remembered', 'محفوظ'])) + '</small></div>') + '</div></a>' +
        (fresh ? '<a class="fc-go fc-lvl" href="#/parent/' + p.id + '/rooms">' + A.icon('flag', 16) + '<span class="grow">' + esc(L(['Find their level first', 'حدد مستواه أولًا'])) + '</span>' + A.icon('next', 14) + '</a>' : '') +
        (act ? '<a class="fc-go fc-act" href="' + esc(act.href) + '">' + A.icon(act.ic, 16) + '<span class="grow"><small>' + esc(act.label) + '</small><b>' + esc(act.sub) + '</b></span>' + A.icon('next', 14) + '</a>' : '') +
        '<button class="fc-go' + (nx.done || nx.off ? ' quiet' : '') + '" data-a="fam-go" data-id="' + p.id + '"><span class="grow"><small>' + esc(st <= 1 ? L(['Next, sit with them', 'التالي، اجلس معه']) : L(['Next', 'التالي'])) + '</small><b>' + esc(nx.text) + '</b></span>' + A.icon('next', 16) + '</button></div>';
    }).join('');
    var tile = function (href, ic, t, extra) { return '<a class="tl-b" href="#/parent/' + href + '">' + A.icon(ic, 24) + '<span>' + esc(L(t)) + '</span>' + (extra || '') + '</a>'; };
    var btile = function (act, svg, t) { return '<button class="tl-b" data-a="' + act + '">' + svg + '<span>' + esc(L(t)) + '</span></button>'; };
    var created = A.S.created ? new Date(A.S.created + 'T12:00:00').getTime() : A.now().getTime();
    var stale = kids.length && A.now().getTime() - Math.max(A.S.lastBackup || 0, A.S.lastSync || 0, created) > 30 * DAY;
    var nudge = stale ? '<a class="bkp" href="#/parent/settings">' + A.icon('flag', 18) + '<span class="grow">' + esc(L(['Time to back up', 'حان وقت النسخ الاحتياطي'])) + '</span>' + A.icon('next', 16) + '</a>' : '';
    if (!A.S.pin && kids.some(function (p) { return A.age(p) >= 8; })) nudge += '<a class="bkp" href="#/parent/settings">' + A.icon('flag', 18) + '<span class="grow">' + esc(L(A.grown() && A.grown().role !== 'parent' ? ['Set a PIN for grown-ups', 'عيّن رمزًا للكبار'] : ['Set a parent PIN', 'عيّن رمز الوالدين'])) + '</span>' + A.icon('next', 16) + '</a>';
    var paused = Flow.inSchoolBreak(), range = Flow.schoolBreak();
    var ready = kids.length && !paused ? haveReady() : [], allOff = kids.length && kids.every(function (p) { return Flow.isOff(p.id); });
    var breakButton = '<button class="chip2' + (paused ? ' on' : '') + '" data-a="fam-break">' +
      esc(L(paused ? ['On school break', 'في عطلة دراسية'] : ['School break', 'عطلة دراسية'])) + '</button>';
    var breakDates = range && range.end >= A.day() ? '<small>' +
      esc(breakLabel(range.start) + ' – ' + breakLabel(range.end)) + '</small>' : '';
    var day = '<div class="fday"><div class="fday-h"><b class="dates">' + Voice.dateLine() + '</b>' +
      (paused ? '' : '<button class="chip2' + (allOff ? ' on' : '') + '" data-a="fam-off">' + esc(L(['Day off', 'يوم راحة'])) + '</button>') +
      '</div><div class="fday-r">' + breakButton + breakDates + '</div>' +
      (ready.length && !allOff ? '<div class="fday-r"><small>' + esc(L(['Have ready', 'جهّز'])) + '</small>' +
        ready.slice(0, 5).map(function (m) { return '<span>' + esc(m) + '</span>'; }).join('') + '</div>' : '') + '</div>';
    var g = A.grown(), teach = g && g.role === 'teacher';
    /* the grown-up's own card: who they are, and the two things a grown-up looks for first, Settings and Updates */
    var updNew = window.Upd && (Upd.state === 'ready' || Upd.state === 'allow');
    var me = '<section class="gp"><a class="gp-me" href="#/parent/me">' + A.grownAvatar(46) + '<span class="grow"><small>' + esc(g ? L(A.ROLES[g.role] || A.ROLES.parent) + (g.org ? ' · ' + g.org : '') : L(['Your profile', 'ملفّك'])) + '</small><b>' + esc(g ? g.name : L(['Who teaches here?', 'من يعلّم هنا؟'])) + '</b></span>' + A.icon('next', 18) + '</a>' +
      '<div class="gp-acts"><a class="gp-b" href="#/parent/settings">' + A.icon('gear', 22) + '<span>' + esc(L(['Settings', 'الإعدادات'])) + '</span></a>' +
      '<a class="gp-b' + (updNew ? ' new' : '') + '" href="#/parent/updates">' + UPD + '<span>' + esc(L(['Updates', 'التحديثات'])) + '</span>' + (updNew ? '<i class="gp-dot"></i>' : '') + '</a></div></section>';
    var tools = '<h2 class="tl-h">' + esc(L(['Teach with your own', 'علّم بما عندك'])) + '</h2><div class="tl-grid">' + tile('books', 'book', ['Courses', 'المقررات']) + tile('media', 'video', ['Media', 'الوسائط']) + tile('voices', 'mic', ['My voice', 'صوتي']) + tile('about', 'help', ['Guide', 'الدليل']) + '</div>' +
      '<h2 class="tl-h">' + esc(L(['Share', 'شارك'])) + '</h2><div class="tl-grid">' + btile('s-sync', SYNC, ['Devices', 'الأجهزة']) + btile('grp-open', A.icon('talk', 24), ['Group', 'المجموعة']) + '</div>';
    return { html: appbar(L(teach ? ['Class', 'الصف'] : ['Family', 'الأسرة']), '', 'home', A.dn()) + '<div class="dwrap"><div class="upd-band-slot">' + (window.Upd ? Upd.band() : '') + '</div>' + me + nudge + day + '<div class="fgrid">' + cards + '<a class="fc fc-add" href="#/parent/add">' + PLUS + '<span>' + esc(L(teach ? ['Add a learner', 'أضف متعلّمًا'] : ['Add a child', 'أضف طفلًا'])) + '</span></a></div>' + tools + '</div>' };
  }
  /* ---------- one child ---------- */
  function subjectRows(p) {
    var pid = p.id, st = A.stage(p), last = {}; A.D(pid).led.forEach(function (e) { var s = C.skill(e.s); if (s) last[s.room] = e.t; });
    return C.order.filter(function (r) { return r !== 'quran' && C.rooms[r].units.some(function (u) { return u.band <= st; }) && !(p.off || {})[r]; }).map(function (r) {
      var R = C.rooms[r], nx = C.next(r, pid), unit = nx && R.units.filter(function (u) { return u.skills.indexOf(nx) >= 0; })[0], y = unit ? unit.y : Flow.yearOf(p), all = 0, met = 0;
      R.units.forEach(function (u) { if (u.y === y && u.band <= st) u.skills.forEach(function (s) { all++; if (M.met(s.id, pid)) met++; }); });
      var idle = last[r] ? Math.floor((A.now().getTime() - last[r]) / DAY) : null;
      return '<a class="sr h-' + R.hue + '" href="#/parent/' + pid + '/log"><span class="sr-n">' + esc(L(R.name)) + '</span><span class="sr-y">' + esc(L(C.yearName(y))) + '</span><span class="sr-b"><i style="width:' + (all ? Math.round(met / all * 100) : 0) + '%"></i></span><span class="sr-c">' + N(met) + '/' + N(all) + '</span>' + (idle != null && idle >= 7 ? '<span class="sr-w" title="">' + N(idle) + L(['d', 'ي']) + '</span>' : '') + '</a>';
    }).join('');
  }
  function activity(p) {
    var d = A.D(p.id), ev = [];
    d.led.forEach(function (e) { if (e.k === 'forge') { var s = C.skill(e.s); if (s) ev.push({ t: e.t, ic: 'keys', x: L(s.title), y: L(C.rooms[s.room].name) }); } });
    (d.exams || []).forEach(function (x) { ev.push({ t: x.t, ic: 'target', x: L(C.rooms[x.r].name) + ' · ' + L(C.yearName(x.y)), y: N(x.p) + '%' }); });
    (d.certs || []).forEach(function (x) { ev.push({ t: x.t, ic: 'star', x: L(C.rooms[x.r].name) + ' · ' + L(C.yearName(x.y)), y: L(['Certificate', 'شهادة']) }); });
    ev.sort(function (a, b) { return b.t - a.t; });
    return ev.slice(0, 6).map(function (e) { return '<div class="ev2">' + A.icon(e.ic, 18) + '<span class="grow"><b>' + esc(e.x) + '</b><small>' + esc(e.y) + '</small></span><time>' + new Date(e.t).toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en', { day: 'numeric', month: 'short' }) + '</time></div>'; }).join('');
  }
  A.tDash = function (p, parts) {
    var pid = p.id, s = stats(p), st = A.stage(p), mx = Math.max.apply(null, s.bars.concat([60000])), d = A.D(pid), pct = s.total ? Math.round(s.done / s.total * 100) : 0;
    var bars = '<span class="mb">' + s.bars.map(function (b, i) { return '<i class="' + (i === 6 ? 'now' : '') + '" style="height:' + Math.max(8, Math.round(b / mx * 100)) + '%"></i>'; }).join('') + '</span>';
    var kpi = '<div class="kpis"><div class="kpi">' + ring(pct, 50, N(s.done) + '/' + N(s.total)) + '<small>' + esc(L(['Today', 'اليوم'])) + (Plan.round(pid) > 1 ? ' · ' + esc(L(['round ' + Plan.round(pid), 'الجولة ' + N(Plan.round(pid))])) : '') + '</small></div><div class="kpi">' + bars + '<div class="kpi-v"><b>' + mins(s.week) + '</b><small>' + esc(L(['7 days', '٧ أيام'])) + '</small></div></div>' + (st > 0 ? (s.recall == null ? '' : '<div class="kpi">' + ring(s.recall, 50, N(s.recall) + '%') + '<small>' + esc(L(['Remembered', 'محفوظ'])) + '</small></div>') + '<div class="kpi kpi-n"><b>' + N(s.keys) + '</b>' + (s.fresh ? '<span class="pl-up">+' + N(s.fresh) + '</span>' : '') + '<small>' + esc(L(['Mastered', 'أُتقن'])) + '</small></div>' : '') + '</div>';
    var stuck = st > 0 ? M.stuck(pid).map(function (x) { var sk = C.skill(x), rc = Flow.rootCause && Flow.rootCause(x, pid); return '<a class="act" href="#/parent/' + pid + '/log">' + A.icon('flag', 18) + '<span class="grow"><b>' + esc(L(sk.title)) + '</b><small>' + esc(rc ? '← ' + L(rc.skill.title) : L(C.rooms[sk.room].name)) + '</small></span>' + A.icon('next', 16) + '</a>'; }).join('') : '';
    var recs = 0; if (st > 0) { var hh = Hifz.state(pid); Object.keys(d.recs || {}).forEach(function (k) { var u = hh.u[k]; if (!u || !u.heard || u.heard < d.recs[k]) recs++; }); }
    var recA = recs ? '<a class="act" href="#/parent/' + pid + '/hear">' + A.icon('mic', 18) + '<span class="grow"><b>' + N(recs) + ' ' + esc(L(['to hear', 'للاستماع'])) + '</b></span>' + A.icon('next', 16) + '</a>' : '';
    var marking = '#/marking/' + esc(encodeURIComponent(pid));
    var sh = (st >= 3 && (d.work || []).some(function (w) { return w.shared && !w.mark; })) ? '<a class="act" href="' + marking + '">' + A.icon('pen', 18) + '<span class="grow"><b>' + esc(L(['Work to mark', 'أعمال للتصحيح'])) + '</b></span>' + A.icon('next', 16) + '</a>' : '';
    var teen = st >= 3 ? '<a class="card tln" href="' + marking + '">' + A.icon('note', 20) + '<b class="grow">' + esc(L(['Summary and shared work', 'الملخص والأعمال المشتركة'])) + '</b>' + A.icon('next', 16) + '</a>' : '';
    var actions = stuck + recA + sh;
    var hz = st > 0 ? Hifz.state(pid) : null, cur = hz && window.QURAN.order[hz.i];
    var qc = hz ? '<a class="card dq" href="#/parent/' + pid + '/hear"><h3>' + esc(L(C.rooms.quran.name)) + '</h3><div class="dq-r"><div><b>' + esc(cur ? A.surahName(cur) : '–') + '</b><small>' + esc(L(['learning', 'الحفظ الآن'])) + '</small></div><div><b>' + N((hz.finished || []).length) + '</b><small>' + esc(L(['sūrahs', 'سور'])) + '</small></div><div><b>' + N(Object.keys(hz.u).length) + '</b><small>' + esc(L(['āyāt', 'آيات'])) + '</small></div></div></a>' : '';
    var acts = activity(p);
    return kpi + '<div class="dcols"><div class="dcol">' + (parts.conf || '') + (parts.sheets || '') + (parts.prom || '') + (actions ? '<div class="card"><h3>' + esc(L(['Needs you', 'يحتاج إليك'])) + '</h3>' + actions + '</div>' : '') + (st > 0 ? '<div class="card"><h3>' + esc(L(['Subjects', 'المواد'])) + '</h3>' + subjectRows(p) + '</div>' : '') + '</div><div class="dcol">' + teen + qc + (parts.path || '') + (acts ? '<div class="card"><h3>' + esc(L(['Recent', 'الأخيرة'])) + '</h3>' + acts + '</div>' : '') + '</div></div>';
  };
  /* ---------- the media library: a gallery ---------- */
  var KIND = { youtube: 'play', video: 'video', audio: 'speak', image: 'eye', html: 'sparkle' };
  function thumb(m) {
    var ic = '<i class="mth-ic">' + A.icon(KIND[m.kind] || 'note', 20) + '</i>';
    if (m.kind === 'youtube') return '<span class="mth"><img src="https://i.ytimg.com/vi/' + esc(m.ref) + '/mqdefault.jpg" alt="">' + ic + '</span>';
    if (m.kind === 'image') return '<span class="mth"><img src="media/' + encodeURIComponent(m.ref) + '" alt="">' + '</span>';
    return '<span class="mth mth-' + esc(m.kind) + '">' + ic + '</span>';
  }
  function roomOf(m) { var a = m.attach || {}; if (a.type === 'room') return a.id; if (a.type === 'unit') return C.units[a.id] && C.units[a.id].room; var s = C.skill(a.id); return s && s.room; }
  function mediaLib() {
    var list = Media.list().slice().reverse();
    return { html: appbar(L(['Media', 'الوسائط']), '', 'parent') + '<div class="dwrap">' + (list.length ? '<div class="mgrid">' + list.map(function (m) { var R = C.rooms[roomOf(m)]; return '<button class="mi" data-a="m-edit" data-id="' + esc(m.id) + '">' + thumb(m) + '<b>' + esc(m.title) + '</b><small>' + esc(R ? L(R.name) : '') + '</small></button>'; }).join('') + '</div>' : '<button class="mempty" data-a="m-add"><span>' + PLUS + '</span><b>' + esc(L(['Add your first', 'أضف أول عنصر'])) + '</b></button>') + '</div>' + (list.length ? '<button class="fab" data-a="m-add" aria-label="' + esc(L(['Add', 'إضافة'])) + '">' + PLUS + '</button>' : '') };
  }
  A.acts['m-add'] = function () {
    var opt = function (a, ic, t) { return '<button class="ao" data-add="' + a + '">' + (ic.charAt(0) === '<' ? ic : A.icon(ic, 26)) + '<span>' + esc(L(t)) + '</span></button>'; };
    A.sheet(L(['Add', 'إضافة']), '<div class="ao-g">' + opt('link', 'play', ['YouTube', 'يوتيوب']) + opt('image/*', PHOTO, ['Image', 'صورة']) + opt('video/*', 'video', ['Video', 'فيديو']) + opt('audio/*', 'speak', ['Audio', 'صوت']) + opt('text/html', 'sparkle', ['Simulation', 'محاكاة']) + '</div>', function (sh) {
      $$('[data-add]', sh).forEach(function (b) { b.onclick = function () {
        var t = b.dataset.add;
        if (t === 'link') { linkSheet(); return; }
        A.closeSheet();
        Media.onPicked = function (ref, kind, name) { var m = Media.add({ kind: kind, ref: ref, title: (name || '').replace(/\.[^.]+$/, ''), when: 'shelf', ages: [0, 1, 2, 3, 4], attach: { type: 'room', id: 'math' } }); A.rerender(); editSheet(m.id); };
        A.N.call('mediaPickType', t);
      }; });
    });
  };
  function linkSheet() {
    A.sheet(L(['YouTube', 'يوتيوب']), '<input class="tin" id="m-url" inputmode="url" placeholder="https://youtu.be/…"><button class="btn pri wide" id="m-go" style="margin-top:12px">' + esc(L(['Continue', 'متابعة'])) + '</button>', function (sh) {
      var i = $('#m-url', sh); setTimeout(function () { i.focus(); }, 200);
      $('#m-go', sh).onclick = function () { var q = Media.parse(i.value); if (!q) { window.Fx.shake(i); return; } var m = Media.add({ kind: q.kind, ref: q.ref, start: q.start || 0, title: L(['New video', 'مقطع جديد']), when: 'shelf', ages: [0, 1, 2, 3, 4], attach: { type: 'room', id: 'math' } }); A.closeSheet(); A.rerender(); setTimeout(function () { editSheet(m.id); }, 260); };
    });
  }
  function editSheet(id) {
    var m = Media.get(id); if (!m) return;
    var when = m.when || 'shelf', stageChip = function (i) { return '<button class="chip2 ' + (m.ages.indexOf(i) >= 0 ? 'on' : '') + '" data-age="' + i + '">' + esc(L(A.STAGES[i].ages)) + '</button>'; };
    var wc = function (v, t) { return '<button class="chip2 ' + (when === v ? 'on' : '') + '" data-when="' + v + '">' + esc(L(t)) + '</button>'; };
    var at = m.attach || { type: 'room', id: 'math' }, rid = roomOf(m) || 'math';
    var rows = C.order.filter(function (r) { return r !== 'quran'; }).map(function (r) { return '<option value="' + r + '"' + (rid === r ? ' selected' : '') + '>' + esc(L(C.rooms[r].name)) + '</option>'; }).join('');
    var lessonOpts = function (r) { var h = '<option value="">' + esc(L(['Whole subject', 'المادة كلها'])) + '</option>'; C.rooms[r].units.slice().sort(function (a, b) { return a.y - b.y; }).forEach(function (u) { h += '<optgroup label="' + esc(L(C.yearName(u.y)) + ' · ' + L(u.title)) + '">' + u.skills.map(function (s) { return '<option value="' + s.id + '"' + (at.type === 'skill' && at.id === s.id ? ' selected' : '') + '>' + esc(L(s.title)) + '</option>'; }).join('') + '</optgroup>'; }); return h; };
    var href = m.kind === 'html' ? '#/lab/h-' + m.id : '#/watch/' + m.id;
    A.sheet(L(['Details', 'التفاصيل']), '<div class="ed">' + thumb(m) + '<div class="field"><label>' + esc(L(['Title', 'العنوان'])) + '</label><input class="tin" id="e-t" value="' + esc(m.title) + '"></div><div class="field"><label>' + esc(L(['Subject', 'المادة'])) + '</label><select id="e-r" aria-label="' + esc(L(['Subject', 'المادة'])) + '">' + rows + '</select></div><div class="field"><label>' + esc(L(['Lesson', 'الدرس'])) + '</label><select id="e-l" aria-label="' + esc(L(['Lesson', 'الدرس'])) + '">' + lessonOpts(rid) + '</select></div><div class="field" id="e-wf"' + (at.type === 'skill' ? '' : ' hidden') + '><label>' + esc(L(['Shows', 'يظهر'])) + '</label><div class="chips">' + wc('shelf', ['On the shelf', 'على الرف']) + wc('before', ['Before', 'قبل']) + wc('after', ['After', 'بعد']) + '</div></div><div class="field"><label>' + esc(L(['Ages', 'الأعمار'])) + '</label><div class="chips">' + [0, 1, 2, 3, 4].map(stageChip).join('') + '</div></div><div class="trow"><a class="btn pri" id="e-p" href="' + href + '">' + (m.kind === 'image' ? A.icon('eye', 18) : A.icon('play', 18)) + '<span>' + esc(m.kind === 'image' ? L(['Open', 'فتح']) : L(['Play', 'تشغيل'])) + '</span></a><button class="btn sec" id="e-d">' + A.icon('trash', 18) + '<span>' + esc(L(['Delete', 'حذف'])) + '</span></button></div></div>', function (sh) {
      var save = function () { var t = $('#e-t', sh).value.trim(); if (t) m.title = t; var l = $('#e-l', sh).value, r = $('#e-r', sh).value; m.attach = l ? { type: 'skill', id: l } : { type: 'room', id: r }; m.when = l ? when : 'shelf'; A.saveNow(); A.__mediaDirty = true; };
      $('#e-t', sh).onchange = save;
      $('#e-r', sh).onchange = function () { var sel = $('#e-l', sh); at = { type: 'room', id: this.value }; sel.innerHTML = lessonOpts(this.value); sel.value = ''; var bt = sel.nextSibling; if (bt && bt.querySelector) bt.querySelector('.pk-t').textContent = L(['Whole subject', 'المادة كلها']); $('#e-wf', sh).hidden = true; save(); };
      $('#e-l', sh).onchange = function () { $('#e-wf', sh).hidden = !this.value; save(); };
      $$('[data-when]', sh).forEach(function (b) { b.onclick = function () { when = b.dataset.when; $$('[data-when]', sh).forEach(function (x) { x.classList.toggle('on', x === b); }); save(); }; });
      $$('[data-age]', sh).forEach(function (b) { b.onclick = function () { var i = +b.dataset.age, k = m.ages.indexOf(i); if (k >= 0) m.ages.splice(k, 1); else m.ages.push(i); b.classList.toggle('on', k < 0); A.saveNow(); }; });
      $('#e-p', sh).onclick = function () { save(); A.closeSheet(); };
      $('#e-d', sh).onclick = function () { if (this.dataset.arm !== '1') { this.dataset.arm = '1'; this.querySelector('span').textContent = L(['Tap again', 'انقر مجددًا']); return; } Media.remove(m.id); A.closeSheet(); A.rerender(); };
    });
  }
  A.acts['m-edit'] = function (t) { editSheet(t.dataset.id); };
  var close0 = A.closeSheet; A.closeSheet = function () { var r = close0(); if (A.__mediaDirty && A.route() === 'parent/media') { A.__mediaDirty = false; A.rerender(); } return r; };
  A.family = family; A.mediaLib = mediaLib;
})();
