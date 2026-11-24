/* What ties the app together: the lab, year exams and certificates, lesson tracking, cross-subject analysis, and the parent's controls. */
(function () {
  'use strict';
  var A = window.A, C = window.C, M = window.M, Flow = window.Flow, Plan = window.Plan, I = window.I, Media = window.Media, Hifz = window.Hifz;
  var $ = A.$, esc = A.esc, L = A.L, N = function (x) { return A.num(x); }, DAY = 864e5;
  var isLight = function () { return /^#f/i.test(getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()); };
  /* a sandboxed frame: it can run its own script, and nothing else */
  function frame(src, title) { return '<iframe class="simf" src="' + esc(src) + '" title="' + esc(title || '') + '" sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe>'; }
  A.simSrc = function (id) { return simSrc(id); };
  function simSrc(id) { return 'sims/index.html#' + id + '|' + (A.ar() ? 'ar' : 'en') + '|' + (isLight() ? 'light' : 'dark'); }
  I.sim = function (c) { var s = c.step; c.el.innerHTML = frame(simSrc(s.sim), L(s.p)); c.done(); };
  /* parents' own HTML lesson aids */
  var basePlayer = Media.playerHtml;
  Media.playerHtml = function (m) { return m.kind === 'html' ? frame('media/' + encodeURIComponent(m.ref), m.title) : basePlayer(m); };

  /* the whole screen belongs to the simulation; one small way back */
  function stage(title, src) { return '<div class="simstage" id="simstage"><div class="simtop"><a class="simback" href="#/lab" aria-label="' + esc(L(['Back to the Lab', 'العودة إلى المختبر'])) + '">' + A.icon('back', 20) + '</a><b>' + esc(title) + '</b><button class="simback" data-a="c-reload" aria-label="' + esc(L(['Start again', 'من جديد'])) + '">' + A.icon('refresh', 20) + '</button></div>' + frame(src, title) + '</div>'; }
  A.acts['c-reload'] = function () { var f = $('#simstage iframe'); if (f) { var u = f.src; f.src = 'about:blank'; setTimeout(function () { f.src = u; }, 40); } };
  var watch0 = A.V.watch; A.V.watch = function (args) { var m = Media.get(args[0]); if (m && m.kind === 'html') return { redirect: 'lab/h-' + m.id }; return watch0(args); };
  /* ---------- the lab ---------- */
  /* a simulation in the list: its idea in a line, how many investigations it guides, and a tick once they are done */
  function firstSentence(t) { var m = String(t).match(/^.*?[.!?؟](\s|$)/); return m ? m[0].trim() : String(t); }
  function labRow(sm) {
    var g = window.GUIDE && GUIDE[sm.id], done = (A.D().lab || {})[sm.id], R = C.rooms[sm.room];
    return '<a class="ti lab-i' + (done ? ' done' : '') + '" href="#/lab/' + sm.id + '"><span class="lab-ic h-' + R.hue + '">' + A.art(R.art, 30) + '</span><span class="grow"><b>' + esc(L(sm.t)) + '</b>' +
      (g ? '<small>' + esc(firstSentence(L(g.idea))) + '</small><em>' + esc(done ? L(['Investigated', 'تمت التجربة']) : A.num(g.steps.length) + ' ' + L(['investigations', 'تجارب'])) + '</em>' : '') + '</span>' + (done ? '<span class="lab-ok">' + A.icon('check', 18) + '</span>' : '') + '</a>';
  }
  /* a simulation says when its guided investigation is finished */
  addEventListener('message', function (e) {
    var d = e.data; if (!d || typeof d !== 'object' || typeof d.miftahLab !== 'string' || !d.done || !A.P()) return;
    if (!(C.SIMBY && C.SIMBY[d.miftahLab])) return;
    var fromSim = Array.prototype.some.call(document.querySelectorAll('iframe.simf'), function (f) { return f.contentWindow === e.source && /^sims\/index\.html#/.test(f.getAttribute('src') || ''); });
    if (!fromSim) return;
    var D = A.D(); D.lab = D.lab || {}; if (!D.lab[d.miftahLab]) { D.lab[d.miftahLab] = A.now().getTime(); A.saveNow(); }
  });
  A.V.lab = function (args) {
    if (!A.P()) return { redirect: 'home' };
    var id = args[0];
    if (id && C.SIMBY && C.SIMBY[id]) {
      var sm = C.SIMBY[id], back = 'lab/' + '';
      return { bare: true, html: stage(L(sm.t), simSrc(id)) };
    }
    if (id && id.indexOf('h-') === 0) { var mm = Media.get(id.slice(2)); if (mm) return { bare: true, html: stage(mm.title, 'media/' + encodeURIComponent(mm.ref)) }; }
    var p = A.P(), yr = Flow.yearOf(p), groups = {}, mine = (C.SIMS || []).filter(function (s) { return yr + 2 >= s.y; });
    mine.forEach(function (s) { (groups[s.room] = groups[s.room] || []).push(s); });
    var ownH = Media.list().filter(function (m) { return m.kind === 'html' && Media.visible(m); });
    var body = (ownH.length ? '<div class="tsec">' + esc(L(['From your family', 'من أسرتك'])) + '</div><div class="tl">' + ownH.map(function (m) { return '<a class="ti" href="#/lab/h-' + m.id + '"><span class="grow"><b>' + esc(m.title) + '</b></span></a>'; }).join('') + '</div>' : '') +
      C.order.filter(function (r) { return groups[r]; }).map(function (r) { return '<div class="tsec">' + esc(L(C.rooms[r].name)) + '</div><div class="tl">' + groups[r].map(labRow).join('') + '</div>'; }).join('');
    return { html: '<header class="th"><div class="grow"><a class="backp" href="#/rooms">' + A.icon('back', 18) + '<span>' + esc(L(['Back', 'رجوع'])) + '</span></a><h1>' + esc(L(['The Lab', 'المختبر'])) + '</h1><p>' + esc(L(['Predict, then test it, then see why. Each simulation guides a few investigations; you can always just play.', 'توقّع ثم اختبر ثم افهم السبب. كل محاكاة تقودك في تجارب قليلة، ويمكنك دائمًا أن تلعب بحرية.'])) + '</p></div></header><div class="tw">' + (body || '<p>' + esc(L(['The lab opens as you grow.', 'يفتح المختبر كلما كبرت.'])) + '</p>') + '</div>' };
  };

  /* ---------- cross-subject analysis ---------- */
  /* for anything a child is stuck on, the weakest thing it depends on, in any subject */
  Flow.rootCause = function (id, pid) {
    var sk = C.skill(id); if (!sk) return null;
    var cands = (sk.uses || []).concat(sk.needs || []), best = null, bestL = 2;
    cands.forEach(function (n) { var x = C.skill(n); if (!x) return; var l = M.met(n, pid) ? M.light(n, pid) : 0; if (l < bestL) { bestL = l; best = x; } });
    return best && bestL < .7 ? { skill: best, light: bestL } : null;
  };
  Flow.usedIn = function (id) { return (C.USEDBY && C.USEDBY[id] || []).map(C.skill).filter(Boolean); };

  /* ---------- lesson tracking for parents ---------- */
  function ledgerBySkill(pid) { var o = {}; A.D(pid).led.forEach(function (e) { var x = o[e.s] || (o[e.s] = { n: 0, ok: 0, first: e.t, last: e.t }); if (e.k === 'forge') { x.forged = e.t; } else { x.n++; if (e.ok) x.ok++; } x.last = e.t; }); return o; }
  function dayOf(t) { return t ? A.day(new Date(t)) : ''; }
  A.tLog = function (p) {
    var pid = p.id, st = A.stage(p), by = ledgerBySkill(pid), d = A.D(pid), secs = '';
    var stuck = M.stuck(pid).map(function (s) { var sk = C.skill(s), rc = Flow.rootCause(s, pid); return '<div class="li"><span class="grow"><b>' + esc(L(sk.title)) + '</b><small>' + esc(L(C.rooms[sk.room].name)) + (rc ? ' · ' + esc(L(['Likely cause: ', 'السبب المحتمل: '])) + esc(L(rc.skill.title)) + ' (' + esc(L(C.rooms[rc.skill.room].name)) + ')' : '') + '</small></span></div>'; }).join('');
    var ex = (d.exams || []).slice(-6).reverse().map(function (x) { return '<div class="li"><span class="grow"><b>' + esc(L(C.rooms[x.r].name)) + ' · ' + esc(L(C.yearName(x.y))) + '</b><small>' + dayOf(x.t) + ' · ' + N(x.p) + '%' + (x.weak && x.weak.length ? ' · ' + esc(L(['Weak: ', 'نقاط الضعف: '])) + x.weak.slice(0, 3).map(function (w) { var k = C.skill(w); return k ? esc(L(k.title)) : ''; }).join(', ') : '') + '</small></span></div>'; }).join('');
    var mins = 0, sc = d.screen || {}; Object.keys(sc).forEach(function (k) { if ((Date.now() - new Date(k).getTime()) / DAY < 7) mins += sc[k] / 60000; });
    var met7 = (d.hist || []).filter(function (h) { return h.n > A.dayNum() - 7 && h.p; }).length;
    C.order.forEach(function (rid) {
      if (rid === 'quran') return; var R = C.rooms[rid], units = R.units.filter(function (u) { return u.band <= st; }); if (!units.length) return;
      var all = 0, met = 0; units.forEach(function (u) { u.skills.forEach(function (s) { all++; if (M.met(s.id, pid)) met++; }); });
      var rows = units.slice().sort(function (x, y) { return x.y - y.y; }).map(function (u) {
        var ms = u.skills.filter(function (s) { return M.met(s.id, pid); }).length;
        return '<details class="logu"><summary><span class="grow">' + esc(L(C.yearName(u.y))) + ' · ' + esc(L(u.title)) + '</span><b>' + N(ms) + '/' + N(u.skills.length) + '</b></summary>' + u.skills.map(function (s) {
          var x = by[s.id], met1 = M.met(s.id, pid);
          return '<div class="logr"><span class="grow"><b>' + esc(L(s.title)) + '</b><small>' + (x ? dayOf(x.forged || x.first) + ' · ' + esc(L(['tries ', 'محاولات '])) + N(x.n) + (x.n ? ' · ' + N(Math.round(x.ok / x.n * 100)) + '%' : '') : (met1 ? esc(L(['Placed as known', 'معروف مسبقًا'])) : esc(L(['Not yet', 'ليس بعد'])))) + (met1 && x ? ' · ' + esc(L(['remembered ', 'محفوظ '])) + N(Math.round(M.light(s.id, pid) * 100)) + '%' : '') + '</small></span>' + (met1 ? '' : '<button class="linkb" data-a="c-assign" data-p="' + pid + '" data-s="' + s.id + '">' + esc(L(['Do next', 'التالي'])) + '</button>') + '</div>';
        }).join('') + '</details>';
      }).join('');
      secs += '<div class="card h-' + R.hue + '"><h3>' + esc(L(R.name)) + ' · ' + N(met) + ' / ' + N(all) + '</h3>' + rows + '</div>';
    });
    return { html: '<div class="card"><h3>' + esc(L(['This week', 'هذا الأسبوع'])) + '</h3><p style="line-height:1.6">' + esc(L(['New topics mastered: ', 'موضوعات جديدة أُتقنت: '])) + N(met7) + '<br>' + esc(L(['Time learning: ', 'وقت التعلم: '])) + N(Math.round(mins)) + ' ' + esc(L(['min', 'دقيقة'])) + '<br>' + esc(L(['Certificates earned: ', 'الشهادات: '])) + N((d.certs || []).length) + '</p></div>' + (stuck ? '<div class="card pending"><h3>' + esc(L(['Stuck, and why', 'تعثر وأسبابه'])) + '</h3><div class="lst">' + stuck + '</div></div>' : '') + (ex ? '<div class="card"><h3>' + esc(L(['Year exams', 'اختبارات السنة'])) + '</h3><div class="lst">' + ex + '</div></div>' : '') + secs };
  };
  A.acts['c-assign'] = function (t) { var d = A.D(t.dataset.p); d.pin = (d.pin || []).filter(function (x) { return x !== t.dataset.s; }).concat([t.dataset.s]); d.path = null; A.saveNow(); A.toast(L(['It will come up next.', 'سيأتي تاليًا.'])); };

  /* ---------- year exams: mixed, unhelped, with a real result and a certificate ---------- */
  function yearSkills(room, y, pid) { var st = A.stage(A.profile(pid)), o = []; C.rooms[room].units.forEach(function (u) { if (u.y === y && u.band <= st) u.skills.forEach(function (s) { o.push(s); }); }); return o; }
  A.examOffer = function (room, y, pid) { var sk = yearSkills(room, y, pid); if (sk.length < 4) return null; var met = sk.filter(function (s) { return M.met(s.id, pid) && s.review; }).length; return met / sk.length >= .6 ? { met: met, all: sk.length } : null; };
  A.V.exam = function (args) {
    if (!A.P()) return { redirect: 'home' };
    var room = args[0], y = +args[1], R = C.rooms[room], d = A.D(); if (!R) return { redirect: 'home' };
    var pool = yearSkills(room, y, A.P().id).filter(function (s) { return M.met(s.id) && s.review; }); if (pool.length < 3) return { redirect: 'room/' + room };
    var t0 = 0;
    return { bare: true, hue: R.hue, html: '<div id="t-exam"></div>', unmount: function () { window.Player.stop(); Voice.stop(); }, mount: function (v) {
      var rng = A.rng(A.seed()), steps = [], list = rng.shuffle(pool); t0 = A.now().getTime();
      list.slice(0, 20).forEach(function (sk) { var st = sk.review(rng); (Array.isArray(st) ? st.slice(0, 1) : [st]).forEach(function (x) { steps.push(Object.assign({}, x, { ph: 'solo', skill: sk.id, hint: null, noHelp: true })); }); });
      window.Player.start($('#t-exam', v), { steps: steps, hue: R.hue, rng: rng, mode: 'review', exam: true, onExit: function () { A.go('room/' + room); }, onDone: function (res, host) {
        var pct = res.solo ? Math.round(res.soloOk / res.solo * 100) : 0, weak = {};
        d.led.forEach(function (e) { if (e.t >= t0 && !e.ok && e.k !== 'forge') weak[e.s] = 1; });
        var rec = { r: room, y: y, t: A.now().getTime(), p: pct, n: res.solo, weak: Object.keys(weak) }; d.exams = (d.exams || []).concat([rec]).slice(-200);
        var pass = pct >= 80; if (pass && !(d.certs || []).some(function (c) { return c.r === room && c.y === y; })) d.certs = (d.certs || []).concat([{ r: room, y: y, t: rec.t, p: pct }]);
        Flow.checkPromises(); A.saveNow();
        host.innerHTML = '<div class="tres ' + (pass ? 'ok' : 'no') + '"><small>' + esc(L(R.name)) + ' · ' + esc(L(C.yearName(y))) + '</small><h2>' + N(res.soloOk) + ' / ' + N(res.solo) + ' · ' + N(pct) + '%</h2><p>' + esc(L(pass ? ['A real achievement. Your certificate is ready.', 'إنجاز حقيقي، وشهادتك جاهزة.'] : ['80% earns the certificate. What you missed returns in your review, then try again.', 'الشهادة عند ٨٠٪. ستعود الأخطاء في المراجعة ثم حاول ثانية.'])) + '</p>' + (rec.weak.length ? '<p style="font-size:14px">' + esc(L(['To strengthen: ', 'لتقويته: '])) + rec.weak.slice(0, 6).map(function (w) { var k = C.skill(w); return k ? esc(L(k.title)) : ''; }).join(', ') + '</p>' : '') + (pass ? '<button class="btn sec wide" data-a="c-cert" data-r="' + room + '" data-y="' + y + '">' + esc(L(['Print the certificate', 'اطبع الشهادة'])) + '</button>' : '') + '<a class="btn pri wide" style="margin-top:8px" href="#/room/' + room + '">' + esc(L(['Back', 'رجوع'])) + '</a></div>';
      } });
    } };
  };
  A.acts['c-cert'] = function (t) {
    var p = A.P(), R = C.rooms[t.dataset.r], y = +t.dataset.y, c = (A.D().certs || []).filter(function (x) { return x.r === t.dataset.r && x.y === y; })[0]; if (!c) return;
    var html = '<div style="border:3pt double #8a6a22;padding:44pt 30pt;text-align:center;min-height:560pt;font-family:Quicksand,sans-serif"><p style="font-size:13pt;letter-spacing:.14em;color:#8a6a22;margin:0 0 40pt">MIFTĀḤ</p><p style="font-size:14pt;margin:0 0 14pt">' + esc(L(['This certifies that', 'نشهد أن'])) + '</p><h1 style="font-size:34pt;margin:0 0 18pt">' + esc(p.name) + '</h1><p style="font-size:14pt;margin:0 0 10pt">' + esc(L(['has shown mastery of', 'أتقن'])) + '</p><h2 style="font-size:22pt;margin:0 0 8pt">' + esc(L(R.name)) + ', ' + esc(L(C.yearName(y))) + '</h2><p style="font-size:13pt;margin:0 0 70pt">' + N(c.p) + '% · ' + dayOf(c.t) + '</p>' + (function () { var g = A.grown && A.grown(), role = L(g ? (A.ROLES[g.role] || A.ROLES.parent) : ['parent', 'ولي الأمر']); return '<p style="font-size:12pt">' + esc(L(['Signed by the ' + role.toLowerCase() + ': ', 'توقيع ' + role + ': '])) + '____________________</p>' + (g ? '<p style="font-size:12pt;margin-top:4pt">' + esc(g.name) + (g.org ? ' · ' + esc(g.org) : '') + '</p>' : ''); })() + '</div>';
    if (window.Print && Print.send) Print.send(html, 'Miftah-certificate');
  };
  var pOf = Flow.progressOf; Flow.progressOf = function (kind, pid) { return kind === 'cert' ? (A.D(pid).certs || []).length : pOf(kind, pid); };

  /* ---------- connecting it into each screen ---------- */
  function labLink() { return '<a class="labl" href="#/lab">' + A.icon('sparkle', 20) + '<span class="grow"><b>' + esc(L(['The Lab', 'المختبر'])) + '</b><small>' + esc(L(['Live simulations for every subject', 'محاكاة حية لكل مادة'])) + '</small></span>' + A.icon('next', 18) + '</a>'; }
  function examBtn(room, y) { var o = A.examOffer(room, y, A.P().id); if (!o) return ''; var has = (A.D().certs || []).some(function (c) { return c.r === room && c.y === y; }); return '<a class="labl" href="#/exam/' + room + '/' + y + '">' + A.icon('target', 20) + '<span class="grow"><b>' + esc(L(['Year exam: ', 'اختبار السنة: '])) + esc(L(C.yearName(y))) + '</b><small>' + esc(has ? L(['Certificate earned. Take it again any time.', 'نلت الشهادة، ويمكنك الإعادة.']) : L(['Mixed questions, no hints. 80% earns the certificate.', 'أسئلة مختلطة بلا تلميحات. الشهادة عند ٨٠٪.'])) + '</small></span></a>'; }
  function addAfter(html, block) { var m = /<div class="(wrap|tw)"[^>]*>/.exec(html); return m ? html.replace(m[0], m[0] + block) : html; }
  var rooms0 = A.V.rooms; A.V.rooms = function (a, r) { var v = rooms0(a, r); if (v && v.html && A.P() && A.stage() >= 1) v.html = addAfter(v.html, labLink()); return v; };
  var room0 = A.V.room;
  A.V.room = function (args, r) {
    var v = room0(args, r); if (!v || !v.html || !A.P() || args[0] === 'quran') return v;
    var rid = args[0], p = A.P(), y = args[1] ? +args[1].slice(1) : null, nx = C.next(rid);
    if (y == null) { var hu = nx && C.rooms[rid].units.filter(function (u) { return u.skills.indexOf(nx) >= 0; })[0]; y = hu ? hu.y : Flow.yearOf(p); }
    var extra = examBtn(rid, y) || (y > 1 ? examBtn(rid, y - 1) : '');
    if (rid === 'arabic' && A.stage(p) >= 2 && !p.arabic) extra = '<div class="card"><h3>' + esc(L(['Can you already read Arabic?', 'هل تقرأ العربية؟'])) + '</h3><div class="trow"><button class="btn sec" data-a="c-ar" data-v="reads">' + esc(L(['Yes', 'نعم'])) + '</button><button class="btn sec" data-a="c-ar" data-v="some">' + esc(L(['A little', 'قليلًا'])) + '</button><button class="btn sec" data-a="c-ar" data-v="new">' + esc(L(['Not yet', 'ليس بعد'])) + '</button></div></div>' + extra;
    if (extra) v.html = addAfter(v.html, extra);
    return v;
  };
  A.acts['c-ar'] = function (t) { var p = A.P(); p.arabic = t.dataset.v; A.D().path = null; A.saveNow(); A.rerender(); };
  /* a child can see what they have earned */
  var keys0 = A.V.keys;
  A.V.keys = function (a, r) {
    var v = keys0(a, r); if (!v || !v.html || !A.P()) return v;
    var cs = A.D().certs || []; if (!cs.length) return v;
    v.html = addAfter(v.html, '<div class="card" style="margin-bottom:12px"><h3>' + esc(L(['My certificates', 'شهاداتي'])) + '</h3><div class="lst">' + cs.map(function (c) { return '<button class="li" data-a="c-cert" data-r="' + c.r + '" data-y="' + c.y + '"><span class="grow"><b>' + esc(L(C.rooms[c.r].name)) + ' · ' + esc(L(C.yearName(c.y))) + '</b><small>' + N(c.p) + '%</small></span>' + A.icon('print', 18) + '</button>'; }).join('') + '</div></div>');
    return v;
  };

  /* ---------- parent controls ---------- */
  var par0 = A.V.parent;
  A.V.parent = function (args, r) {
    var v = par0(args, r); if (!v || !v.html || (A.grownOpen && !A.grownOpen())) return v;
    if (args && args[0] === 'settings') {
      var S = A.S, seg = function (k, val, label, sub) { return '<button class="seg ' + ((S[k] || (k === 'motion' ? 'calm' : '')) === val ? 'on' : '') + '" data-a="c-g" data-k="' + k + '" data-v="' + val + '">' + esc(L(label)) + '</button>'; };
      v.html = addAfter(v.html, '<div class="card"><h3>' + esc(L(['Animation', 'الحركة'])) + '</h3><div class="segs">' + seg('motion', 'calm', ['Calm', 'هادئة']) + seg('motion', 'full', ['Full', 'كاملة']) + seg('motion', 'off', ['Off', 'بلا']) + '</div><p style="color:var(--t2);font-size:13.5px;line-height:1.45;margin-top:8px">' + esc(L(['Calm opens the door once a day and keeps everything else still.', 'الهادئة تفتح الباب مرة في اليوم وتبقي الباقي ساكنًا.'])) + '</p></div><div class="card"><h3>' + esc(L(['Parent PIN', 'رمز الوالدين'])) + '</h3><p style="color:var(--t2);font-size:13.5px;line-height:1.45;margin-bottom:8px">' + esc(L(['Older children can solve the sum. A PIN keeps these pages yours.', 'يستطيع الأكبر حل المسألة، والرمز يحفظ هذه الصفحات لك.'])) + '</p><div class="trow"><input class="tin" id="c-pin" type="password" inputmode="numeric" maxlength="6" placeholder="' + esc(S.pin ? L(['New 4 to 6 digit PIN', 'رمز جديد من ٤ إلى ٦ أرقام']) : L(['4 to 6 digits', '٤ إلى ٦ أرقام'])) + '"><button class="btn sec" data-a="c-pin">' + esc(L(['Save', 'حفظ'])) + '</button></div>' + (S.pin ? '<button class="btn ghost sm" style="margin-top:8px" data-a="c-pin-clear">' + esc(L(['Remove PIN', 'إلغاء الرمز'])) + '</button>' : '') + '</div>');
    }
    /* parents' voice comes first: the prompts a young child hears most */
    if (args && args[0] === 'voices' && A.N.has()) {
      var cnt = {}, rg = A.rng(5); C.list.forEach(function (sk) { if (sk.band > 1 || (sk.y || 1) > 3) return; [sk.meet, sk.guided, sk.solo].forEach(function (x) { try { var st0 = typeof x === 'function' ? x(rg) : x; [].concat(st0 || []).forEach(function (q) { if (q && q.p && !q.silent) { var tx = L(q.p); if (tx && tx.length < 70) cnt[tx] = (cnt[tx] || 0) + 1; } }); } catch (e) { } }); });
      var top = Object.keys(cnt).sort(function (x, y) { return cnt[y] - cnt[x]; }).slice(0, 30);
      v.html = addAfter(v.html, '<div class="card"><h3>' + esc(L(['Lesson prompts for ages 5 to 7', 'تعليمات الدروس لعمر ٥ إلى ٧'])) + '</h3><p style="color:var(--t2);font-size:13.5px;line-height:1.45;margin-bottom:8px">' + esc(L(['A device voice never reads these. Young children hear what you record here; anything not recorded shows as text for you to read to them.', 'لا يقرأ صوت الجهاز هذه أبدًا. يسمع الصغار ما تسجله هنا، وما لم يُسجل يظهر نصًا تقرؤه لهم.'])) + '</p><div class="lst">' + top.map(function (tx) { var k = window.Voice.keyOf(tx), has = window.Voice.hasVoice(k); return '<div class="li"><span class="grow"><small>' + esc(tx) + '</small></span>' + (has ? '<button class="round off" style="width:44px;height:44px" data-play="' + k + '" data-say="' + esc(tx) + '" data-l="en">' + A.icon('play', 18) + '</button>' : '') + '<button class="round off" style="width:44px;height:44px" data-rec="' + k + '">' + A.icon('mic', 18) + '</button></div>'; }).join('') + '</div></div>');
    }
    if (args && args[0] && args[1] === 'set') {
      var p = A.profile(args[0]); if (!p) return v;
      var st = A.stage(p), mk = function (cur, list, a0) { return '<div class="segs" style="flex-wrap:wrap">' + list.map(function (o) { return '<button class="seg ' + (String(cur) === String(o[0]) ? 'on' : '') + '" data-a="c-p" data-p="' + p.id + '" data-k="' + a0 + '" data-v="' + o[0] + '">' + esc(L(o[1])) + '</button>'; }).join('') + '</div>'; };
      var yrs = function (rid) { var ys = []; C.rooms[rid].units.forEach(function (u) { if (u.band <= st && ys.indexOf(u.y) < 0) ys.push(u.y); }); return ys.sort(function (a, b) { return a - b; }); };
      var starts = C.order.filter(function (rid) { return rid !== 'quran' && C.rooms[rid].units.some(function (u) { return u.band <= st; }); }).map(function (rid) { var cur = (p.start || {})[rid]; return '<label class="logr"><span class="grow"><b>' + esc(L(C.rooms[rid].name)) + '</b></span><select class="tin" style="width:auto" data-c-start="' + rid + '" data-p="' + p.id + '"><option value="">' + esc(L(['Automatic', 'تلقائي'])) + '</option>' + yrs(rid).map(function (y) { return '<option value="' + y + '"' + (cur === y ? ' selected' : '') + '>' + esc(L(C.yearName(y))) + '</option>'; }).join('') + '</select></label>'; }).join('');
      var block = '<div class="card"><h3>' + esc(L(['Where to start', 'نقطة البداية'])) + '</h3><p style="color:var(--t2);font-size:13.5px;line-height:1.45;margin-bottom:8px">' + esc(L(['Automatic starts near their age. Choose a year if they are ahead or behind in a subject.', 'التلقائي يبدأ قرب عمره. اختر سنة إن كان متقدمًا أو متأخرًا.'])) + '</p>' + starts + '</div><div class="card"><h3>' + esc(L(['Arabic reading', 'قراءة العربية'])) + '</h3>' + mk(p.arabic || '', [['new', ['Not yet', 'ليس بعد']], ['some', ['A little', 'قليلًا']], ['reads', ['Confidently', 'بثقة']]], 'arabic') + '</div><div class="card"><h3>' + esc(L(['New āyāt each time', 'الآيات الجديدة كل مرة'])) + '</h3>' + mk(p.hifzSize || '', [['', ['Auto', 'تلقائي']], [1, ['1', '١']], [3, ['3', '٣']], [5, ['5', '٥']], [7, ['7', '٧']], [10, ['10', '١٠']], [20, ['20', '٢٠']]], 'hifzSize') + '</div><div class="card"><h3>' + esc(L(['Door when opening lessons', 'الباب عند فتح الدروس'])) + '</h3>' + mk(p.door || '', [['', ['Auto', 'تلقائي']], ['on', ['Always', 'دائمًا']], ['off', ['Never', 'أبدًا']]], 'door') + '</div><div class="card"><h3>' + esc(L(['Working ahead', 'التقدم للأمام'])) + '</h3>' + mk(p.ahead ? 1 : '', [['', ['Up to one year ahead', 'حتى سنة واحدة']], [1, ['No limit', 'بلا حد']]], 'ahead') + '</div>';
      v.html = v.html.replace('<div class="card"><div id="set-form"', block + '<div class="card"><div id="set-form"');
      var m0 = v.mount; v.mount = function (el) { if (m0) m0(el); A.$$('[data-c-start]', el).forEach(function (s) { s.onchange = function () { var q = A.profile(s.dataset.p); q.start = q.start || {}; if (s.value) q.start[s.dataset.cStart] = +s.value; else delete q.start[s.dataset.cStart]; A.D(q.id).path = null; A.saveNow(); A.toast(L(['Saved', 'حُفظ'])); }; }); };
    }
    return v;
  };
  A.acts['c-g'] = function (t) { if (A.grownOpen && !A.grownOpen()) return; A.S[t.dataset.k] = t.dataset.v; A.saveNow(); A.rerender(); };
  A.acts['c-pin'] = function () { var input = $('#c-pin'); if (input) A.pinSet(input); };
  A.acts['c-pin-clear'] = function (t) {
    if (A.grownOpen && !A.grownOpen()) return;
    if (t.dataset.arm !== '1') { t.dataset.arm = '1'; t.textContent = L(['Tap again to remove PIN', 'انقر مجددًا لإلغاء الرمز']); return; }
    A.pinClear();
  };
  A.acts['c-p'] = function (t) { if (A.grownOpen && !A.grownOpen()) return; var p = A.profile(t.dataset.p), k = t.dataset.k, v = t.dataset.v; if (k === 'hifzSize') p.hifzSize = v ? +v : 0; else if (k === 'ahead') p.ahead = !!v; else p[k] = v; A.D(p.id).path = null; A.saveNow(); A.rerender(); };
  /* the microphone, explained honestly */
  A.micHelp = function () { if (A.N.call('micAllowed') === true) A.toast(L(['The microphone is busy. Close other apps using it, then try again.', 'الميكروفون مشغول. أغلق التطبيقات التي تستعمله وحاول مجددًا.'])); };
  window.__native = window.__native || {};
  window.__native.onMic = function (ok, never) {
    if (ok) { A.toast(L(['Microphone ready. Tap to record.', 'الميكروفون جاهز. انقر للتسجيل.'])); return; }
    A.toast(L(never ? ['The microphone is blocked. Allow it in the phone’s settings for Miftāḥ.', 'الميكروفون محظور. اسمح به من إعدادات الهاتف لمفتاح.'] : ['Recording needs the microphone.', 'يحتاج التسجيل إلى الميكروفون.']));
    if (never) A.N.call('openAppSettings');
  };
})();
