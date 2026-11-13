/* The learning engine.
   Ledger: every fact is an append-only event {i,t,s,k,ok,a,e,by,rv}; everything the child and parent see is a projection that
   can be rebuilt from it. Evidence kinds rank what a success proves:
   exposure < recognition < recall < production < observed. A hint makes it assisted: useful, never counted as independent.
   Keys: forged (lesson passed unaided), proven (produced, and recalled a day or more later), deep (still recalled after 14 days).
   A key's light is its memory: P(recall) = 2^(-days / halfLife). It dims with time and relights by recalling. */
(function () {
  'use strict';
  var A = window.A;
  var M = window.M = {}, RANK = { exposure: 0, recognition: 1, recall: 2, production: 3, observed: 4 };
  var DAY = 86400000;

  function blank() { return { seen: 0, n: { exposure: 0, recognition: 0, recall: 0, production: 0, observed: 0 }, okInd: 0, fail: 0, first: 0, lastOk: 0, h: 0, forged: 0, proven: 0, deep: 0, delayed: 0, e: {} }; }

  function apply(key, ev) {
    key.seen++;
    if (!key.first) key.first = ev.t;
    if (ev.k === 'forge') { if (!key.forged) { key.forged = ev.t; key.h = Math.max(key.h, 1); key.lastOk = key.lastOk || ev.t; } return key; }
    /* seeing or claiming something is not knowing it */
    if (ev.k === 'exposure' && ev.ok) return key;
    if (ev.ok && !ev.a) {
      key.okInd++;
      if (key.n[ev.k] != null) key.n[ev.k]++;
      var gap = key.lastOk ? (ev.t - key.lastOk) / DAY : 0;
      if (gap >= .8 && key.forged) {
        key.delayed++;
        /* spacing effect: recalling when it had faded strengthens most */
        var p = Math.pow(2, -gap / Math.max(key.h, .5));
        key.h = Math.min(120, Math.max(key.h, gap) * (1.6 + (1 - p) * 1.6));
        if (gap >= 14) key.deep = key.deep || ev.t;
      } else if (!key.h) key.h = .8;
      key.lastOk = ev.t;
    } else if (!ev.ok) {
      key.fail++;
      if (ev.e) key.e[ev.e] = (key.e[ev.e] || 0) + 1;
      if (ev.rv) key.h = Math.max(.5, key.h * .55);
    }
    /* the evidence gate: production or observed work, and successful recall after a real delay */
    if (key.forged && !key.proven && key.okInd >= 3 && (key.delayed >= 2 || (key.delayed >= 1 && (key.n.production + key.n.observed) >= 1))) key.proven = ev.t;
    return key;
  }
  M.apply = apply; M.blank = blank;

  M.key = function (s, pid) { var d = A.D(pid); return d.keys[s] || null; };
  M.log = function (s, ev, pid) {
    var d = A.D(pid), key = d.keys[s] || (d.keys[s] = blank());
    var t = A.now().getTime();
    var e = { i: t.toString(36) + '-' + d.led.length.toString(36), t: t, s: s, k: ev.k || 'recognition', ok: ev.ok !== false, a: !!ev.a, by: ev.by || 'child' };
    if (ev.e) e.e = ev.e;
    if (ev.rv) e.rv = 1;
    d.led.push(e);
    if (d.led.length > 20000) d.led.splice(0, d.led.length - 20000);
    apply(key, e);
    M.tally(d, ev.ms);
    A.save();
    return e;
  };
  M.forge = function (s, pid) { return M.log(s, { k: 'forge', ok: true, by: 'system' }, pid); };
  M.tally = function (d, ms) { if (!ms) return; var k = A.day(); d.time[k] = (d.time[k] || 0) + Math.min(ms, 120000); };
  /* a lesson left part-way, kept for a week */
  A.resumeOf = function (pid) { var r = A.D(pid).resume; if (!r) return null; if (!C.skill(r.skill) || A.now().getTime() - r.t > 7 * DAY) { A.D(pid).resume = null; return null; } return r; };
  /* the record can always be recomputed from its events */
  M.rebuild = function (pid) {
    var d = A.D(pid), keys = {};
    d.led.forEach(function (e) { apply(keys[e.s] || (keys[e.s] = blank()), e); });
    d.keys = keys; return keys;
  };

  /* memory strength 0..1 */
  M.light = function (s, pid) {
    var k = M.key(s, pid); if (!k || !k.forged) return 0;
    var days = (A.now().getTime() - (k.lastOk || k.forged)) / DAY;
    return Math.pow(2, -days / Math.max(k.h, .5));
  };
  M.state = function (s, pid) {
    var k = M.key(s, pid);
    if (!k || (!k.first && !k.forged)) return 'new';
    if (k.deep && k.proven) return 'deep';
    if (k.proven) return 'proven';
    if (k.forged) return 'forged';
    return 'started';
  };
  M.met = function (s, pid) { var d = A.D(pid); return !!(d.placed[s] || (d.keys[s] && d.keys[s].forged)); };
  M.due = function (pid) {
    var d = A.D(pid), out = [];
    Object.keys(d.keys).forEach(function (s) {
      var k = d.keys[s]; if (!k.forged || !C.skill(s) || !C.skill(s).review) return;
      var days = (A.now().getTime() - (k.lastOk || k.forged)) / DAY;
      var p = M.light(s, pid);
      if (p < .72 && days >= .8) out.push({ s: s, p: p });
    });
    return out.sort(function (a, b) { return a.p - b.p; });
  };
  M.counts = function (pid) {
    var d = A.D(pid), o = { forged: 0, proven: 0, deep: 0 };
    Object.keys(d.keys).forEach(function (s) { var st = M.state(s, pid); if (st === 'forged') o.forged++; if (st === 'proven') { o.forged++; o.proven++; } if (st === 'deep') { o.forged++; o.proven++; o.deep++; } });
    return o;
  };

  /* a child's "we did it" waits here until a grown-up confirms it */
  M.claim = function (id, m, pid) { var d = A.D(pid); d.pending = (d.pending || []).filter(function (x) { return x.id !== id; }); d.pending.push({ id: id, t: A.now().getTime(), skill: m.skill || null, title: m.t });
    if (d.pending.length > 40) d.pending.shift(); A.saveNow(); };
  M.confirm = function (id, yes, pid) {
    var d = A.D(pid), c = (d.pending || []).filter(function (x) { return x.id === id; })[0]; if (!c) return;
    d.pending = d.pending.filter(function (x) { return x.id !== id; });
    if (yes) { d.obs.push({ t: A.now().getTime(), kind: 'mission', id: id, title: c.title, by: 'parent' }); if (c.skill) M.log(c.skill, { k: 'observed', ok: true, by: 'parent' }, pid); }
    A.saveNow();
  };
  /* a lesson not yet passed: twice in a row, and the path goes back to what it builds on */
  M.noteNotYet = function (s, pid) { var d = A.D(pid), x = d.notyet[s] || { n: 0, t: 0 }; x.n++; x.t = A.now().getTime(); d.notyet[s] = x; };
  M.clearNotYet = function (s, pid) { delete A.D(pid).notyet[s]; };
  M.stuck = function (pid) { var d = A.D(pid); return Object.keys(d.notyet).filter(function (s) { return d.notyet[s].n >= 2 && C.skill(s); }); };
  function resting(s, pid) { var x = A.D(pid).notyet[s]; return x && x.n >= 2 && (A.now().getTime() - x.t) / DAY < 1.5; }

  /* ---------- the measures a parent can act on, all computed from the ledger ---------- */
  /* of the times a key came back after a real delay, how many were remembered without help */
  M.retention = function (pid, days, room) {
    var d = A.D(pid), since = A.now().getTime() - (days || 30) * DAY, ok = 0, of = 0;
    d.led.forEach(function (e) { if (!e.rv || e.t < since || e.k === 'forge') return; if (room && (!C.skill(e.s) || C.skill(e.s).room !== room)) return; of++; if (e.ok && !e.a) ok++; });
    return { ok: ok, of: of };
  };
  /* work done alone versus work done with a hint, this period and the period before */
  M.unaided = function (pid, days) {
    var d = A.D(pid), now = A.now().getTime(), span = (days || 14) * DAY, a = { ind: 0, help: 0 }, b = { ind: 0, help: 0 };
    d.led.forEach(function (e) { if (e.k === 'forge' || e.k === 'exposure' || e.k === 'observed' || !e.ok) return; var o = e.t >= now - span ? a : e.t >= now - span * 2 ? b : null; if (!o) return; if (e.a) o.help++; else o.ind++; });
    return { now: a, before: b };
  };
  /* one skill's evidence, newest first, grouped by day */
  M.timeline = function (s, pid) {
    var days = {}; A.D(pid).led.forEach(function (e) { if (e.s !== s) return; var k = A.day(new Date(e.t)); var x = days[k] || (days[k] = { day: k, ok: 0, help: 0, miss: 0, forge: false, seen: false, rv: false }); if (e.k === 'forge') x.forge = true; else if (e.k === 'observed') x.seen = true; else if (!e.ok) x.miss++; else if (e.a) x.help++; else x.ok++; if (e.rv) x.rv = true; });
    return Object.keys(days).sort().reverse().map(function (k) { return days[k]; });
  };
  /* the last seven days, in four plain lists */
  M.week = function (pid) {
    var d = A.D(pid), since = A.now().getTime() - 7 * DAY, learned = [], proven = [];
    Object.keys(d.keys).forEach(function (s) { var k = d.keys[s]; if (!C.skill(s)) return; if (k.forged >= since) learned.push(s); if (k.proven >= since) proven.push(s); });
    return { learned: learned, proven: proven, stuck: M.stuck(pid), pending: (d.pending || []).slice(), dimmed: M.due(pid).map(function (x) { return x.s; }) };
  };

  /* typed errors, each with what to do about it */
  M.ERR = {
    'count-skip': { t: ['Skips or double-counts objects', 'يتخطى العدّ أو يكرره'], fix: ['Count real things together, touching each one.', 'عُدّوا أشياء حقيقية معًا مع لمس كل واحد.'] },
    'numeral': { t: ['Mixes up written numbers', 'يخلط بين الأرقام المكتوبة'], fix: ['Trace the numeral, then build it with objects.', 'تتبعوا الرقم ثم كوّنوه بالأشياء.'] },
    'compare': { t: ['Compares numbers the wrong way', 'يخطئ في مقارنة الأعداد'], fix: ['Line two rows of objects side by side.', 'صفّوا صفين من الأشياء جنبًا إلى جنب.'] },
    'add-count': { t: ['Off by one when adding', 'يخطئ بواحد عند الجمع'], fix: ['Count on from the bigger number, on fingers.', 'عدّوا من العدد الأكبر على الأصابع.'] },
    'sub-add': { t: ['Added instead of taking away', 'جمع بدل أن يطرح'], fix: ['Act it out: take the objects away by hand.', 'مثّلوها: أبعدوا الأشياء باليد.'] },
    'place-value': { t: ['Mixes tens and ones', 'يخلط بين العشرات والآحاد'], fix: ['Bundle ten sticks, then count bundles and singles.', 'اربطوا عشرة أعواد ثم عدّوا الحزم والآحاد.'] },
    'times': { t: ['Times facts are not secure', 'حقائق الضرب غير ثابتة'], fix: ['Build the rows and columns, then say the fact.', 'كوّنوا الصفوف والأعمدة ثم قولوا الحقيقة.'] },
    'fraction-parts': { t: ['Sees fractions without equal parts', 'يرى الكسور دون أجزاء متساوية'], fix: ['Fold paper into equal parts and shade.', 'اطووا ورقة أجزاء متساوية وظلّلوا.'] },
    'fraction-size': { t: ['Thinks a bigger bottom means bigger', 'يظن أن المقام الأكبر يعني كسرًا أكبر'], fix: ['Share one date among 2, then among 4.', 'اقسموا تمرة على ٢ ثم على ٤.'] },
    'letter-shape': { t: ['Confuses letters that look alike', 'يخلط بين الحروف المتشابهة'], fix: ['Compare dots: where are they, and how many?', 'قارنوا النقاط: أين هي وكم عددها؟'] },
    'letter-sound': { t: ['Confuses letter sounds', 'يخلط بين أصوات الحروف'], fix: ['Say the sound while touching the letter, then hear it in a word.', 'انطقوا الصوت مع لمس الحرف ثم اسمعوه في كلمة.'] },
    'haraka': { t: ['Confuses the short vowels', 'يخلط بين الحركات'], fix: ['Move the mouth: open for fatḥah, smile for kasrah, round for ḍammah.', 'حرّكوا الفم: فتح للفتحة، وابتسامة للكسرة، واستدارة للضمة.'] },
    'phoneme': { t: ['Confuses English sounds', 'يخلط بين الأصوات الإنجليزية'], fix: ['Say the sound slowly and find it in things at home.', 'انطقوا الصوت ببطء وابحثوا عنه في أشياء البيت.'] },
    'blend': { t: ['Sounds are right, blending is not yet', 'الأصوات صحيحة والمزج لم يثبت'], fix: ['Slide the sounds together slowly, then faster.', 'مدّوا الأصوات معًا ببطء ثم بسرعة.'] },
    'word-role': { t: ['Mixes up word roles', 'يخلط بين وظائف الكلمات'], fix: ['Ask: who or what is this about? What is said about it?', 'اسألوا: عمّن الجملة؟ وماذا قيل عنه؟'] },
    'sequence': { t: ['Steps out of order', 'الخطوات غير مرتبة'], fix: ['Do the real steps together, saying each one aloud.', 'قوموا بالخطوات معًا وقولوا كل خطوة بصوت عالٍ.'] },
    'memory': { t: ['Needs more repetition', 'يحتاج إلى مزيد من التكرار'], fix: ['Listen again together, then say it together at bedtime.', 'استمعوا معًا ثم قولوها معًا قبل النوم.'] },
    'prediction': { t: ['Predictions and results differ: a good thing to talk about', 'التوقع يختلف عن النتيجة: وهذا يستحق الحديث'], fix: ['Ask why it happened, then try it with real things.', 'اسألوا لماذا حدث ذلك ثم جرّبوه بأشياء حقيقية.'] },
    'understanding': { t: ['Needs another look at the idea', 'تحتاج الفكرة إلى نظرة أخرى'], fix: ['Talk about it with a real example from today.', 'تحدثوا عنها بمثال حقيقي من اليوم.'] }
  };

  /* ===== the curriculum registry ===== */
  var C = window.C = { rooms: {}, order: [], skills: {}, list: [], units: {}, missions: {} };
  C.room = function (id, o) { o.id = id; o.units = []; C.rooms[id] = o; C.order.push(id); };
  C.unit = function (room, id, title, band) { var u = { id: id, room: room, title: title, band: band, skills: [] }; C.units[id] = u; C.rooms[room].units.push(u); C._u = u; return u; };
  C.add = function (id, spec) {
    var u = C._u; spec.id = id; spec.room = u.room; spec.unit = u.id; spec.band = spec.band != null ? spec.band : u.band;
    if (spec.needs == null && u.skills.length) spec.needs = [u.skills[u.skills.length - 1].id];
    spec.needs = spec.needs || [];
    C.skills[id] = spec; u.skills.push(spec); C.list.push(spec); return spec;
  };
  C.skill = function (id) { return C.skills[id]; };

  C.open = function (s, pid) {
    var sk = typeof s === 'string' ? C.skills[s] : s;
    return sk.needs.every(function (n) { return M.met(n, pid); });
  };
  /* the next door in a room for this child: first unmet, unlocked skill at or below their stage's band */
  C.next = function (room, pid, skip) {
    var p = A.profile(pid), st = A.stage(p), r = C.rooms[room];
    if (!r) return null;
    for (var i = 0; i < r.units.length; i++) {
      var u = r.units[i];
      if (u.band > st) continue;
      for (var j = 0; j < u.skills.length; j++) {
        var sk = u.skills[j];
        if (sk.band > st || (skip && skip.indexOf(sk.id) >= 0)) continue;
        if (!M.met(sk.id, pid) && C.open(sk, pid)) return sk;
      }
    }
    return null;
  };
  A.profile = function (pid) { if (!pid) return A.P(); for (var i = 0; i < A.S.profiles.length; i++) if (A.S.profiles[i].id === pid) return A.S.profiles[i]; return null; };

  /* ===== today's path: one ordered journey, built once a day, retrieval first =====
     Stage 1: remember, recite, two new doors, go and do it. Stage 2 adds a door. Stage 0 is a parent-led pair. */
  var Plan = window.Plan = {};
  Plan.ROTATE = { 1: [['arabic', 'math'], ['english', 'deen'], ['arabic', 'science'], ['math', 'deen'], ['english', 'arabic'], ['math', 'science'], ['deen', 'english']],
    2: [['arabic', 'math', 'deen'], ['english', 'science', 'arabic'], ['math', 'deen', 'english'], ['arabic', 'science', 'math'], ['english', 'deen', 'arabic'], ['math', 'science', 'english'], ['deen', 'arabic', 'math']] };
  Plan.build = function (pid) {
    var p = A.profile(pid), st = A.stage(p), stops = [], off = p.off || {}, seed = A.dayNum();
    if (st === 0) {
      var nur = C.nurseryToday(pid);
      nur.forEach(function (x) { stops.push({ t: 'nursery', id: x, done: false }); });
      return { day: A.day(), stops: stops };
    }
    var budget = Plan.limit(p), d = A.D(pid);
    var due = M.due(pid).filter(function (x) { return !off[C.skill(x.s).room]; }).map(function (x) { return x.s; });
    /* a door refused twice: rest it, and strengthen what it stands on */
    var rested = M.stuck(pid).filter(function (s) { return resting(s, pid); });
    rested.forEach(function (s) { C.skill(s).needs.slice().reverse().forEach(function (n) { var x = C.skill(n); if (x && x.review && M.met(n, pid) && due.indexOf(n) < 0) due.unshift(n); }); });
    due = due.slice(0, Math.max(2, Math.min(st === 1 ? 5 : 8, Math.round(budget / 5))));
    if (due.length) stops.push({ t: 'review', items: due, done: false });
    if (!off.quran) stops.push({ t: 'hifz', done: false });
    var rot = Plan.ROTATE[st][seed % 7].filter(function (r) { return !off[r]; }), used = rested.slice();
    if (!rot.length) rot = C.order.filter(function (r) { return !off[r] && r !== 'quran'; });
    rot.forEach(function (r) {
      var sk = C.next(r, pid, used);
      if (sk) { used.push(sk.id); stops.push({ t: 'lesson', s: sk.id, done: false }); }
    });
    /* never an empty day: any open room can fill it */
    if (!stops.some(function (x) { return x.t === 'lesson'; })) {
      C.order.some(function (r) { if (off[r] || r === 'quran') return false; var sk = C.next(r, pid, used); if (sk) { stops.push({ t: 'lesson', s: sk.id, done: false }); return true; } return false; });
    }
    /* if even so nothing is open, the rested door comes back rather than an empty day */
    if (!stops.some(function (x) { return x.t === 'lesson'; }) && rested.length) { var back = C.skill(rested[0]); if (back && !off[back.room]) stops.push({ t: 'lesson', s: back.id, done: false }); }
    var m = C.missionToday(pid);
    if (m) stops.push({ t: 'mission', id: m, done: false });
    /* fit the parent's limit: new doors go first, never the only one */
    var total = function () { return stops.reduce(function (a, x) { return a + Plan.est(x, st); }, 0); };
    while (total() > budget && stops.filter(function (x) { return x.t === 'lesson'; }).length > 1) { for (var i = stops.length - 1; i >= 0; i--) if (stops[i].t === 'lesson') { stops.splice(i, 1); break; } }
    return { day: A.day(), stops: stops };
  };
  /* honest rough minutes, for the child's plan and the parent's limit */
  Plan.est = function (s, st) { return s.t === 'review' ? Math.max(2, s.items.length * .8) : s.t === 'hifz' ? (st === 2 ? 7 : 5) : s.t === 'lesson' ? (st === 2 ? 8 : 6) : s.t === 'mission' ? 2 : 5; };
  Plan.left = function (pid) { var st = A.stage(A.profile(pid)); return Plan.today(pid).stops.reduce(function (a, s) { return a + (s.done ? 0 : Plan.est(s, st)); }, 0); };
  Plan.limit = function (p) { p = p || A.P(); return p && p.limit ? p.limit : A.STAGES[A.stage(p)].minutes; };
  Plan.used = function (pid) { return A.D(pid).screen[A.day()] || 0; };
  Plan.over = function (pid) { var p = A.profile(pid); if (!p) return false; var d = A.D(pid); return Plan.used(pid) >= (Plan.limit(p) + (d.extra[A.day()] || 0)) * 60000; };
  Plan.extend = function (min, pid) { var d = A.D(pid), k = A.day(); d.extra[k] = (d.extra[k] || 0) + min; A.saveNow(); };
  /* the child asked for more: the room they have gone longest without, whose door is open */
  Plan.moreDoor = function (pid) {
    var p = A.profile(pid), off = p.off || {}, pl = Plan.today(pid), used = pl.stops.filter(function (s) { return s.t === 'lesson'; }).map(function (s) { return s.s; }).concat(M.stuck(pid));
    var pick = null; C.order.forEach(function (r) { if (pick || off[r] || r === 'quran') return; var sk = C.next(r, pid, used); if (sk) pick = sk; });
    return pick;
  };
  Plan.today = function (pid) {
    var d = A.D(pid);
    if (!d.path || d.path.day !== A.day()) { d.path = Plan.build(pid); A.save(); }
    return d.path;
  };
  Plan.nextStop = function (pid) { var pl = Plan.today(pid); for (var i = 0; i < pl.stops.length; i++) if (!pl.stops[i].done) return i; return -1; };
  Plan.complete = function (i, pid) { var pl = Plan.today(pid); if (pl.stops[i]) pl.stops[i].done = true; A.saveNow(); };

  /* ===== ḥifẓ: sabaq (new), sabqī (recent, daily), manzil (old, in turn). Assessed by a person or by honest self-report. =====
     d.hifz = { s: surah index in order, a: next āyah, u: {'s:a': {t:first, h:halfLife, last, lapse}} } */
  var Hifz = window.Hifz = {};
  Hifz.state = function (pid) { var d = A.D(pid); if (!d.hifz.u) d.hifz = { i: 0, a: 1, u: {}, log: [] }; return d.hifz; };
  Hifz.size = function (p) { p = p || A.P(); return p && p.hifzSize ? p.hifzSize : [1, 1, 3, 5, 7][A.stage(p)] || 3; };
  Hifz.today = function (pid) {
    var h = Hifz.state(pid), Q = window.QURAN, p = A.profile(pid), now = A.now().getTime();
    var order = Q.order, sN = order[h.i], out = { sabaq: null, sabqi: [], manzil: [] };
    if (sN != null) {
      var su = Q.q[sN], to = Math.min(su.v.length, h.a + Hifz.size(p) - 1);
      out.sabaq = { s: sN, from: h.a, to: to };
    }
    Object.keys(h.u).forEach(function (k) {
      var u = h.u[k], age = (now - u.t) / DAY, gap = (now - u.last) / DAY;
      var due = gap >= Math.max(.8, Math.min(u.h, 60) * .7);
      if (!due) return;
      if (age < 7) out.sabqi.push(k); else out.manzil.push(k);
    });
    out.sabqi = out.sabqi.sort(function (a, b) { return h.u[a].last - h.u[b].last; }).slice(0, [5, 5, 10, 15, 20][A.stage(p)] || 10);
    out.manzil = out.manzil.sort(function (a, b) { return h.u[a].last - h.u[b].last; }).slice(0, [3, 3, 6, 12, 20][A.stage(p)] || 6);
    return out;
  };
  /* grade: 2 smooth, 1 small slips, 0 not yet; by: 'parent' or 'self' */
  Hifz.mark = function (s, a, grade, by, pid) {
    var h = Hifz.state(pid), k = s + ':' + a, t = A.now().getTime(), u = h.u[k];
    if (!u) { if (grade === 0) { h.log.push({ t: t, k: k, g: 0, by: by }); return; } u = h.u[k] = { t: t, h: 1, last: t, lapse: 0, n: 0 }; }
    else {
      var gap = (t - u.last) / DAY;
      /* being heard by a person counts for more than checking oneself */
      if (grade === 2) u.h = Math.min(90, Math.max(u.h, gap) * (by === 'parent' ? 2.1 : 1.7));
      else if (grade === 1) u.h = Math.max(1, Math.max(u.h, gap) * 1.2);
      else { u.h = Math.max(.8, u.h * .4); u.lapse++; }
      u.last = t;
    }
    u.n = (u.n || 0) + 1;
    if (by === 'parent') u.heard = t;
    h.log.push({ t: t, k: k, g: grade, by: by });
    if (h.log.length > 4000) h.log.splice(0, h.log.length - 4000);
    A.save();
  };
  Hifz.advance = function (to, pid) {
    var h = Hifz.state(pid), Q = window.QURAN, sN = Q.order[h.i], su = Q.q[sN];
    if (to >= su.v.length) { h.i++; h.a = 1; h.finished = (h.finished || []).concat([sN]); } else h.a = to + 1;
    /* Juzʾ ʿAmma done? The road goes on */
    if (h.i >= Q.order.length - 1 && !Q.all) A.quranAll();
    var nx = Q.order[h.i]; if (nx && window.Voice && Voice.keep) Voice.keep(nx);
    A.save();
  };
  /* a sūrah learned before Miftāḥ: it joins the long revision cycle straight away */
  Hifz.markKnown = function (sN, pid) {
    var h = Hifz.state(pid), su = window.QURAN.q[sN], t = A.now().getTime(), past = t - 30 * DAY;
    su.v.forEach(function (v, i) { var k = sN + ':' + v[0]; if (!h.u[k]) h.u[k] = { t: past, h: 10 + (i % 7), last: t - (i % 10) * DAY, lapse: 0, n: 1 }; });
    if ((h.finished || []).indexOf(sN) < 0) h.finished = (h.finished || []).concat([sN]);
    var order = window.QURAN.order; while (order[h.i] != null && h.finished.indexOf(order[h.i]) >= 0) { h.i++; h.a = 1; }
    A.saveNow();
  };
  /* āyāt a person has not listened to lately: oldest silence first */
  Hifz.toHear = function (pid, n) {
    var h = Hifz.state(pid), t = A.now().getTime();
    return Object.keys(h.u).filter(function (k) { return !h.u[k].heard || (t - h.u[k].heard) / DAY >= 14; }).sort(function (a, b) { return (h.u[a].heard || 0) - (h.u[b].heard || 0) || h.u[a].t - h.u[b].t; }).slice(0, n || 10);
  };
  Hifz.known = function (sN, pid) { var h = Hifz.state(pid), su = window.QURAN.q[sN], n = 0; su.v.forEach(function (v) { if (h.u[sN + ':' + v[0]]) n++; }); return { n: n, of: su.v.length }; };
  Hifz.strength = function (k, pid) { var h = Hifz.state(pid), u = h.u[k]; if (!u) return 0; return Math.pow(2, -((A.now().getTime() - u.last) / DAY) / Math.max(u.h, .5)); };
})();
