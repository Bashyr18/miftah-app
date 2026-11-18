/* The workflow engine. Everything the child is asked to do comes from here, and every decision can be explained.

   INPUTS   the child's stage and age, the ledger (what is known, how well it is held, who saw it), the room history, and what the parent set
   RULES    a stage profile (attention, minutes, new doors a day) · review debt holds back new doors · retention tunes the pace ·
            rooms are chosen by how far each is behind its share · strands interleave · a stuck door rests · a finished unit is checked ·
            a day of the week consolidates · movement breaks are scheduled by minutes of screen
   OUTPUTS  today's path, a preview of the days ahead, a parent's inbox, forecasts, and the milestones that give rewards

   Every path carries its reasons in `why`, so a parent can always ask why today looks the way it does. */
(function () {
  'use strict';
  var A = window.A, C = window.C, M = window.M, Plan = window.Plan, Hifz = window.Hifz, L = A.L;
  var Flow = window.Flow = window.Flow || {};
  var DAY = 86400000;

  /* ---------- how each stage learns ---------- */
  Flow.PROFILE = {
    0: { day: 10, news: 0, reviewCap: 0, moveEvery: 0, perWeek: 0 },
    1: { day: 20, news: 2, reviewCap: 5, moveEvery: 11, perWeek: 8 },
    2: { day: 55, news: 3, reviewCap: 8, moveEvery: 18, perWeek: 12 },
    3: { day: 90, news: 4, reviewCap: 14, moveEvery: 0, perWeek: 16 },
    4: { day: 140, news: 4, reviewCap: 20, moveEvery: 0, perWeek: 18 }
  };
  /* each room's share of new learning, per stage; a parent can lean any room up or down */
  var WEIGHT = { 1: { arabic: 4, math: 6, english: 4, deen: 3, science: 3, world: 1, computing: 1, engineering: 2, think: 2 }, 2: { arabic: 4, math: 7, english: 4, deen: 3, science: 5, world: 2, computing: 3, engineering: 3, think: 3 }, 3: { arabic: 3, math: 8, english: 3, deen: 3, science: 7, world: 2, computing: 5, engineering: 4, life: 1 }, 4: { arabic: 3, math: 9, english: 3, deen: 3, science: 8, world: 2, computing: 6, engineering: 5, life: 2 } };
  /* heavier thinking goes first, while the mind is fresh */
  var LOAD = { think: 3, math: 3, arabic: 3, english: 2, deen: 1, science: 2, world: 1, computing: 3, engineering: 2, life: 1 };

  /* ---------- strands: parallel threads that weave in rather than wait their turn ---------- */
  var STRANDS = ['d-adab', 'd-dua', 'd-seerah', 'd-hadith', 'm-think', 'm-measure'];
  STRANDS.forEach(function (u) { if (C.units[u]) C.units[u].strand = true; });
  /* strands in maths open once the number work under them is secure */
  [['m.shapes', 'm.count10'], ['m.long', 'm.bond10']].forEach(function (x) { var s = C.skills[x[0]]; if (s && s.needs.indexOf(x[1]) < 0) s.needs.push(x[1]); });

  /* roughly: age five is Year 1. A child may run one year ahead of their age in a room; a parent can lift that. */
  Flow.yearOf = function (p) { if (p && p.year) return p.year; return Math.max(1, Math.min(14, A.age(p || A.P()) - 4)); };
  /* a teenager starts near their own year, never at counting to five. p.fromStart walks the whole road. */
  Flow.floorOf = function (p, room) {
    if (room && p.start && p.start[room] != null) return p.start[room];
    return A.stage(p) >= 2 && !p.fromStart ? Flow.yearOf(p) - 2 : 0;
  };
  var baseOpen = C.open;
  C.open = function (sk, pid) { var fl = Flow.floorOf(A.profile(pid), sk.room); return sk.needs.every(function (n) { var x = C.skill(n); return M.met(n, pid) || (fl && x && x.y < fl); }); };
  function metIn(u, pid, assume) { var n = 0; u.skills.forEach(function (s) { if (M.met(s.id, pid) || (assume && assume[s.id])) n++; }); return n; }
  /* the next door in a room: the core unit in order, with a strand woven in about every third door */
  C.next = function (room, pid, skip, assume) {
    var p = A.profile(pid), st = A.stage(p), r = C.rooms[room]; if (!r) return null;
    var core = null, coreMet = 0, strands = [], yr = p.ahead ? 99 : Math.max(Flow.yearOf(p) + 1, (p.start && p.start[room] != null) ? p.start[room] + 1 : 0), fl = Flow.floorOf(p, room);
    /* an older beginner in Arabic takes the fast road first, written with a real pen */
    var older = room === 'arabic' && A.stage(p) >= 2 && p.arabic !== 'reads' && p.arabic !== 'some' && !(p.start && p.start.arabic != null);
    var open = function (sk) { return sk.older || sk.needs.every(function (n) { var x = C.skill(n); return M.met(n, pid) || (assume && assume[n]) || (fl && x && x.y < fl); }); };
    /* the older beginners' road comes before anything else in Arabic */
    if (older) { var ou = r.units.filter(function (u) { return u.older; })[0]; if (ou) for (var oi = 0; oi < ou.skills.length; oi++) { var o0 = ou.skills[oi]; if (!M.met(o0.id, pid) && !(assume && assume[o0.id])) { if (skip && skip.indexOf(o0.id) >= 0) return null; return o0; } } }
    r.units.forEach(function (u) {
      if (u.older) return;
      if (u.band > st || (u.y && u.y > yr) || (fl && u.y < fl && !u.always)) return;
      if (!u.strand) coreMet += metIn(u, pid, assume);
      for (var j = 0; j < u.skills.length; j++) {
        var sk = u.skills[j];
        if (sk.band > st || (skip && skip.indexOf(sk.id) >= 0)) continue;
        if (!M.met(sk.id, pid) && !(assume && assume[sk.id]) && open(sk)) {
          if (u.strand) strands.push({ sk: sk, met: metIn(u, pid, assume) }); else if (!core) core = sk;
          break;
        }
      }
    });
    strands.sort(function (a, b) { return a.met - b.met; });
    if (strands.length && (!core || strands[0].met * 3 < coreMet)) return strands[0].sk;
    if (core) return core;
    /* finished everything up to their year? Then the next year opens. Mastery sets the pace, not a birthday. */
    if (!p.ahead) { var later = r.units.slice().sort(function (a, b) { return a.y - b.y; }); for (var ui = 0; ui < later.length; ui++) { var lu = later[ui]; if (lu.older || !lu.y || lu.y <= yr) continue; for (var li = 0; li < lu.skills.length; li++) { var ls = lu.skills[li]; if (!M.met(ls.id, pid) && !(assume && assume[ls.id]) && !(skip && skip.indexOf(ls.id) >= 0) && open(ls)) return ls; } } }
    return null;
  };

  /* ---------- the week's shape ---------- */
  /* six school days and one rest, until a parent chooses otherwise */
  Flow.WEEK = [0, 1, 2, 3, 4, 5];
  /* a day off for a family: Eid, a trip, an illness */
  Flow.setOff = function (pid, on) { var p = A.profile(pid); p.offDays = p.offDays || {}; if (on) p.offDays[A.day()] = 1; else delete p.offDays[A.day()]; A.D(pid).path = null; A.saveNow(); };
  Flow.isOff = function (pid) { var p = A.profile(pid); return !!(p.offDays && p.offDays[A.day()]); };
  /* p.days: school days (0 = Sunday); p.light: the day that consolidates rather than opens new doors. Both are the parent's. */
  Flow.dayKind = function (p, date) {
    var when = date || A.now(), d = when.getDay(), days = p.days || Flow.WEEK, light = p.light == null ? 5 : p.light;
    if (p.offDays && p.offDays[A.day(when)]) return 'rest';
    if (days.indexOf(d) < 0) return 'rest';
    return d === light ? 'light' : 'school';
  };

  /* ---------- the pace: how many new doors today, and why ---------- */
  function firstPass(pid) { var d = A.D(pid), since = A.dayNum() - 14, n = 0, ok = 0; (d.hist || []).forEach(function (h) { if (h.n >= since && !h.again) { n++; if (h.p) ok++; } }); return n >= 4 ? ok / n : null; }
  /* how fast a child is really moving: of their last new lessons (a month at most), how many were clean, every answer right
     the first time with no help. Twelve or more clean in a row of nearly all is flying; most of eight is quick. Only lessons
     recorded with this measure count, so nothing changes until there is real evidence. */
  Flow.velocity = function (pid) {
    var d = A.D(pid), since = A.dayNum() - 30, list = (d.hist || []).filter(function (h) { return h.n > since && !h.again && h.c != null; }).slice(-20);
    var n = list.length, clean = list.filter(function (h) { return h.p && h.c; }).length, rate = n ? clean / n : 0;
    var deep = list.filter(function (h) { return h.x === 1; }).length;
    var level = n >= 12 && rate >= .88 ? 'flying' : n >= 8 && rate >= .75 ? 'quick' : 'steady';
    return { n: n, rate: rate, deep: deep, level: level };
  };
  Flow.pace = function (pid) {
    var p = A.profile(pid), st = A.stage(p), pr = Flow.PROFILE[st], news = pr.news, why = [];
    var due = M.due(pid).length, r = M.retention(pid, 14), fp = firstPass(pid);
    /* a child racing ahead gets more, as long as what they learn is staying; a parent's gentle pace always wins */
    var vel = Flow.velocity(pid), holding = !(r.of >= 8 && r.ok / r.of < .8) && due < pr.reviewCap * 2;
    var fast = st >= 1 && p.pace !== 'gentle' && holding ? vel.level : 'steady';
    if (p.pace === 'gentle') { news = Math.max(1, news - 1); why.push(['A gentle pace, as you chose.', 'وتيرة هادئة كما اخترت.']); }
    if (p.pace === 'strong') { news += 1; why.push(['A stronger pace, as you chose.', 'وتيرة أقوى كما اخترت.']); }
    if (due >= pr.reviewCap * 2) { news = Math.max(1, news - 1); why.push(['Fewer new lessons: ' + due + ' are due for review first.', 'دروس جديدة أقل: ' + A.num(due) + ' تحتاج مراجعة أولًا.']); }
    if (r.of >= 8 && r.ok / r.of < .6) { news = Math.max(1, news - 1); why.push(['Fewer new lessons: older ones are slipping, so memory comes first.', 'دروس جديدة أقل: القديمة تضعف، فالذاكرة أولًا.']); }
    else if (r.of >= 8 && r.ok / r.of >= .88 && (fp == null || fp >= .8) && due < pr.reviewCap && p.pace !== 'gentle') { news += 1; why.push(['One more new lesson: what they learn is staying with them.', 'درس جديد إضافي: ما يتعلمه يبقى معه.']); }
    /* the calendar: a year's learning spread over a year. Enough new doors this week means the rest of the week strengthens them. */
    if (fast === 'flying') { news += 2; why.push(['Two more new lessons: they are getting nearly everything right first time, and keeping it.', 'درسان جديدان إضافيان: يجيب صحيحًا من أول مرة تقريبًا ويحتفظ بما تعلّم.']); }
    else if (fast === 'quick') { news += 1; why.push(['One more new lesson: they are moving quickly and cleanly.', 'درس جديد إضافي: يتقدم بسرعة ودقة.']); }
    var d = A.D(pid), since = A.dayNum() - 7, fresh = (d.hist || []).filter(function (h) { return h.n > since && !h.again; }).length, cap = (fast === 'flying' ? 8 : fast === 'quick' ? 4 : 0) + pr.perWeek + (p.pace === 'strong' ? 4 : p.pace === 'gentle' ? -2 : 0);
    if (cap && fresh >= cap) { news = 0; why.push(['Enough new lessons this week: the rest of it makes them last.', 'دروس جديدة كافية هذا الأسبوع: وبقيته تثبّتها.']); }
    return { news: news, why: why, fast: fast };
  };

  /* ---------- choosing rooms: whoever is furthest behind its share ---------- */
  Flow.record = function (skill, passed, pid, res) {
    var d = A.D(pid), sk = C.skill(skill); if (!sk) return;
    d.hist = d.hist || []; var again = d.hist.some(function (h) { return h.s === skill; });
    d.hist.push({ n: A.dayNum(), r: sk.room, s: skill, p: passed ? 1 : 0, again: again ? 1 : 0, c: res && res.clean ? 1 : 0, x: res && res.stretch ? (res.stretchOk === res.stretch ? 1 : 0) : undefined });
    if (d.hist.length > 600) d.hist.splice(0, d.hist.length - 600);
    if (passed && d.pin) d.pin = d.pin.filter(function (x) { return x !== skill; });
  };
  function weekly(pid) { var d = A.D(pid), since = A.dayNum() - 7, c = {}; (d.hist || []).forEach(function (h) { if (h.n > since) c[h.r] = (c[h.r] || 0) + 1; }); return c; }
  Flow.rankRooms = function (pid, extra, salt) {
    var p = A.profile(pid), st = A.stage(p), w = WEIGHT[st] || WEIGHT[1], off = p.off || {}, focus = p.focus || {}, c = weekly(pid), q = A.rng(A.dayNum() + (salt || 0));
    return Object.keys(w).filter(function (r) { return !off[r]; }).map(function (r) { var done = (c[r] || 0) + (extra && extra[r] || 0); return { r: r, score: w[r] * (focus[r] || 1) / (1 + done) + q() * .05 }; }).sort(function (a, b) { return b.score - a.score; }).map(function (x) { return x.r; });
  };

  /* ---------- milestones: a unit whose keys are all forged gets a short check, then its lantern ---------- */
  Flow.unitsReady = function (pid) {
    var p = A.profile(pid), st = A.stage(p), d = A.D(pid), t = A.now().getTime(), out = []; d.units = d.units || {};
    C.order.forEach(function (rid) {
      if ((p.off || {})[rid]) return;
      C.rooms[rid].units.forEach(function (u) {
        if (u.band > st) return; var state = d.units[u.id]; if (state && state.t) return;
        var list = u.skills.filter(function (s) { return s.band <= st; }); if (list.length < 2) return;
        var taught = list.filter(function (s) { return d.keys[s.id] && d.keys[s.id].forged; });
        if (!list.every(function (s) { return M.met(s.id, pid); }) || taught.length < 2) return;
        if (state && state.tried && (t - state.tried) / DAY < 3) return;
        out.push(u.id);
      });
    });
    return out;
  };
  Flow.unitDone = function (uid, pid) { var d = A.D(pid); d.units = d.units || {}; d.units[uid] = { t: A.now().getTime() }; Flow.checkPromises(pid); A.saveNow(); };
  Flow.unitNotYet = function (uid, pid) { var d = A.D(pid); d.units = d.units || {}; d.units[uid] = { tried: A.now().getTime() }; A.saveNow(); };
  Flow.lanterns = function (pid) {
    var d = A.D(pid), st = A.stage(A.profile(pid)), done = d.units || {}, out = [];
    C.order.forEach(function (rid) { C.rooms[rid].units.forEach(function (u) { if (u.band <= st) out.push({ id: u.id, room: rid, title: u.title, lit: !!(done[u.id] && done[u.id].t) }); }); });
    return out;
  };

  /* ---------- today's path ---------- */
  Plan.est = function (s, st) { return s.t === 'leap' ? 4 : s.t === 'review' ? Math.max(2, s.items.length * .8) : s.t === 'hifz' ? (st === 2 ? 7 : 5) : s.t === 'lesson' ? ((C.skill(s.s) || {}).mins || (st === 2 ? 8 : 6)) : s.t === 'mission' ? 2 : s.t === 'move' ? 1 : s.t === 'check' ? 4 : s.t === 'practice' ? (st === 2 ? 10 : st === 3 ? 15 : 20) : s.t === 'read' ? 0 : 5; };
  Plan.limit = function (p) { p = p || A.P(); return p && p.limit ? p.limit : Flow.PROFILE[A.stage(p)].day; };

  Plan.build = function (pid) {
    var p = A.profile(pid), st = A.stage(p), stops = [], off = p.off || {}, why = [], d = A.D(pid), day = { day: A.day(), stops: stops, why: why };
    if (st === 0) {
      C.nurseryToday(pid).forEach(function (x) { stops.push({ t: 'nursery', id: x, done: false }); });
      return day;
    }
    var cap;
    var kind = Flow.dayKind(p), known = Object.keys(d.keys).filter(function (k) { return d.keys[k].forged; }).length;
    if (kind === 'light' && known < 5) kind = 'school';
    var budget = Plan.limit(p), pr = Flow.PROFILE[st], pace = Flow.pace(pid);

    if (kind === 'rest') {
      why.push(['A rest day, as you set it. Only the Qurʾān and something real.', 'يوم راحة كما اخترت: القرآن وعمل حقيقي فقط.']);
      if (!off.quran) stops.push({ t: 'hifz', done: false });
      var mr = C.missionToday(pid); if (mr) stops.push({ t: 'mission', id: mr, done: false });
      return day;
    }

    /* memory first: what is fading, and what a stuck door stands on */
    var rested = M.stuck(pid).filter(function (s) { var x = d.notyet[s]; return x && (A.now().getTime() - x.t) / DAY < 1.5; });
    var due = M.due(pid).filter(function (x) { return !off[C.skill(x.s).room]; }).map(function (x) { return x.s; });
    rested.forEach(function (s) { C.skill(s).needs.slice().reverse().forEach(function (n) { var x = C.skill(n); if (x && x.review && M.met(n, pid) && due.indexOf(n) < 0) due.unshift(n); }); });
    if (rested.length) why.push(['Resting a hard lesson, and strengthening what it stands on.', 'نريح درسًا صعبًا، ونقوّي ما يقوم عليه.']);
    cap = kind === 'light' ? pr.reviewCap + 3 : Math.max(2, Math.min(pr.reviewCap, Math.round(budget / 5)));
    due = due.slice(0, cap);
    if (due.length) stops.push({ t: 'review', items: due, done: false });
    if (!off.quran) stops.push({ t: 'hifz', done: false });

    /* a finished unit gets its check before anything new */
    var ready = Flow.unitsReady(pid); if (ready.length) stops.push({ t: 'check', unit: ready[0], done: false });

    var used = rested.slice(), assume = null, picked = [], extra = {};
    if (kind === 'light') why.push(['A consolidating day: reviewing and making, no new lessons.', 'يوم تثبيت: مراجعة وصنع، دون دروس جديدة.']);
    else {
      why.push.apply(why, pace.why);
      /* a lesson a parent asked for comes first */
      (d.pin || []).forEach(function (id) { var sk = C.skill(id); if (sk && !M.met(id, pid) && C.open(sk, pid) && picked.length < pace.news) { picked.push(sk); used.push(id); extra[sk.room] = (extra[sk.room] || 0) + 1; } });
      var rooms = Flow.rankRooms(pid, extra), guard = 0, ri = 0;
      while (picked.length < pace.news && guard++ < 12 && rooms.length) {
        var room = rooms[ri++ % rooms.length];
        if (picked.some(function (x) { return x.room === room; })) continue;
        var sk2 = C.next(room, pid, used); if (sk2) { picked.push(sk2); used.push(sk2.id); }
      }
      /* never an empty school day: any open room, and in the end the rested door itself */
      if (!picked.length && pace.news > 0) C.order.some(function (r) { if (off[r] || r === 'quran') return false; var x = C.next(r, pid, used); if (x) { picked.push(x); return true; } return false; });
      if (!picked.length && rested.length && pace.news > 0) { var back = C.skill(rested[0]); if (back && !off[back.room]) picked.push(back); }
      picked.sort(function (a, b) { return (LOAD[b.room] || 1) - (LOAD[a.room] || 1); });
      picked.forEach(function (s) { stops.push({ t: 'lesson', s: s.id, done: false }); });
      if (pace.fast === 'flying' && picked.length) { var lr = picked[picked.length - 1].room; stops.push({ t: 'leap', room: lr, done: false }); why.push(['A leap ahead in ' + C.rooms[lr].name[0] + ': the next lessons, tested. Those already known are passed over.', 'قفزة للأمام في ' + C.rooms[lr].name[1] + ': تُختبر الدروس التالية، ويُتجاوز ما يعرفه.']); }
    }
    /* no new door today? Then keep what they know sharp, in a mix they have not just seen */
    if (!stops.some(function (x) { return x.t === 'lesson' || x.t === 'review'; })) {
      var qs = A.rng(A.dayNum() + 7), known2 = Object.keys(d.keys).filter(function (k) { return d.keys[k].forged && C.skill(k) && C.skill(k).review && !off[C.skill(k).room]; });
      if (known2.length) { stops.splice(0, 0, { t: 'review', items: qs.shuffle(known2).slice(0, cap), done: false }); }
    }
    /* the real work of learning: a mixed practice set in what they have mastered, then a book */
    if (st >= 2) {
      var pool = ['math', 'science', 'math', 'english', 'math', 'computing', 'math', 'arabic'].filter(function (r, i, a) { return !off[r]; });
      for (var pi = 0; pi < pool.length; pi++) { var pr0 = pool[(A.dayNum() + pi) % pool.length], have = C.rooms[pr0].units.reduce(function (n, u) { return n + u.skills.filter(function (s) { return d.keys[s.id] && d.keys[s.id].forged && s.review; }).length; }, 0); if (have >= 4) { stops.push({ t: 'practice', room: pr0, done: false }); break; } }
      stops.push({ t: 'read', done: false });
    }
    var m = C.missionToday(pid, kind === 'light'); if (m) stops.push({ t: 'mission', id: m, done: false });

    /* fit the parent's limit: new doors go first, never the only one */
    var total = function () { return stops.reduce(function (a, x) { return a + Plan.est(x, st); }, 0); };
    while (total() > budget && stops.filter(function (x) { return x.t === 'lesson'; }).length > 1) { for (var i = stops.length - 1; i >= 0; i--) if (stops[i].t === 'lesson') { stops.splice(i, 1); break; } }

    /* stand up between long stretches of screen */
    var run = 0, seed = A.dayNum();
    for (var k = 0; k < stops.length - 1; k++) {
      if (stops[k].t === 'mission') { run = 0; continue; }
      run += Plan.est(stops[k], st);
      if (pr.moveEvery && run >= pr.moveEvery && stops[k + 1].t !== 'mission') { stops.splice(k + 1, 0, { t: 'move', n: seed + k, done: false }); run = 0; k++; }
    }
    return day;
  };
  /* the same lesson finished from a room counts on today's path too */
  Plan.completeSkill = function (id, pid) { var pl = Plan.today(pid), hit = false; pl.stops.forEach(function (s) { if (s.t === 'lesson' && s.s === id && !s.done) { s.done = true; hit = true; } }); if (hit) A.saveNow(); return hit; };

  /* ---------- looking ahead: what the coming days will probably hold ---------- */
  Flow.preview = function (pid, days) {
    var p = A.profile(pid), st = A.stage(p), out = []; if (st === 0) return out;
    var assume = {}, extra = {}, base = Flow.pace(pid).news, now = A.now();
    for (var i = 1; i <= (days || 7); i++) {
      var date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i), kind = Flow.dayKind(p, date), list = [];
      if (kind === 'school') {
        var rooms = Flow.rankRooms(pid, extra, i), used = [], n = 0;
        for (var r = 0; r < rooms.length && n < base; r++) { var sk = C.next(rooms[r], pid, used, assume); if (sk) { list.push(sk); assume[sk.id] = 1; used.push(sk.id); extra[sk.room] = (extra[sk.room] || 0) + 1; n++; } }
      }
      out.push({ date: date, kind: kind, lessons: list });
    }
    return out;
  };
  /* how long is left in each room, at the pace this child is really moving */
  Flow.forecast = function (room, pid) {
    var p = A.profile(pid), st = A.stage(p), left = 0, total = 0, w = WEIGHT[st] || WEIGHT[1], sum = 0;
    C.rooms[room].units.forEach(function (u) { if (u.band > st) return; u.skills.forEach(function (s) { if (s.band > st) return; total++; if (!M.met(s.id, pid)) left++; }); });
    Object.keys(w).forEach(function (r) { if (!(p.off || {})[r]) sum += w[r] * ((p.focus || {})[r] || 1); });
    var schoolDays = Math.max(1, (p.days || [0, 1, 2, 3, 4, 5, 6]).length - 1), share = sum && w[room] ? w[room] * ((p.focus || {})[room] || 1) / sum : 0;
    var perWeek = Flow.pace(pid).news * schoolDays * share;
    return { left: left, total: total, weeks: perWeek ? Math.ceil(left / perWeek) : null };
  };

  /* ---------- promises: real-world rewards the family sets, earned by real progress ---------- */
  Flow.progressOf = function (kind, pid) {
    if (kind === 'unit') return Flow.lanterns(pid).filter(function (x) { return x.lit; }).length;
    if (kind === 'proven') return M.counts(pid).proven;
    if (kind === 'surah') return (Hifz.state(pid).finished || []).length;
    return M.counts(pid).forged;
  };
  Flow.checkPromises = function (pid) {
    var p = A.profile(pid); if (!p) return [];
    var fired = []; (p.promises || []).forEach(function (x) { if (!x.fired && Flow.progressOf(x.kind, pid) >= x.n) { x.fired = A.now().getTime(); fired.push(x); } });
    return fired;
  };
  Flow.promiseToShow = function (pid) { var p = A.profile(pid); return (p.promises || []).filter(function (x) { return x.fired && !x.shown; })[0] || null; };

  /* ---------- the parent's inbox: everything that needs a person ---------- */
  Flow.inbox = function (pid) {
    var d = A.D(pid), p = A.profile(pid), out = [];
    (d.pending || []).forEach(function (x) { out.push({ kind: 'deed', id: x.id, x: x }); });
    (d.sheets || []).forEach(function (x) { if (window.Print ? Print.waiting(x) : x.q && x.q.length && !x.marked) out.push({ kind: 'sheet', id: x.id, x: x }); });
    M.stuck(pid).forEach(function (s) { out.push({ kind: 'stuck', id: s }); });
    (p.promises || []).forEach(function (x) { if (x.fired && !x.kept) out.push({ kind: 'promise', id: x.id, x: x }); });
    return out;
  };
  /* what to get ready for tomorrow */
  Flow.prep = function (pid) {
    var next = Flow.preview(pid, 1)[0], need = [], lessons = next ? next.lessons : [];
    lessons.forEach(function (sk) { Object.keys(C.missions).forEach(function (id) { var m = C.missions[id]; if (m.hands && m.skill === sk.id && m.materials) need.push({ id: id, m: m }); }); });
    return { date: next && next.date, lessons: lessons, need: need };
  };
})();
