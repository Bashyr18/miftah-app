/* The app from age 12. A student runs their own study here: a clear day, a syllabus instead of a map, a record instead of a key ring, and real study tools.
   No scenes, no rays, no spoken prompts. The memory system underneath is the same one. */
(function () {
  'use strict';
  var A = window.A, C = window.C, M = window.M, Plan = window.Plan, Flow = window.Flow, Hifz = window.Hifz, Fx = window.Fx, Voice = window.Voice, I = window.I;
  var $ = A.$, esc = A.esc, L = A.L, DAY = 864e5;
  var isTeen = function () { return A.P() && A.stage() >= 3; };
  var N = function (x) { return A.num(x); };
  function nav(on) {
    var t = function (k, ic, a) { return '<a href="#/' + k + '" class="' + (on === k ? 'on' : '') + '">' + A.icon(ic, 21) + '<span>' + esc(L(a)) + '</span></a>'; };
    return '<nav class="nav" aria-label="' + esc(L(['Sections', 'الأقسام'])) + '">' + t('home', 'path', ['Today', 'اليوم']) + t('rooms', 'rooms', ['Subjects', 'المواد']) + t('study', 'book', ['Study', 'الدراسة']) + t('keys', 'keys', ['Record', 'السجل']) + '</nav>';
  }
  function head(title, sub, back) { return '<header class="th"><div class="grow">' + (back ? '<a class="backp" href="#/' + back[0] + '">' + A.icon('back', 18) + '<span>' + esc(L(back[1])) + '</span></a>' : '') + '<h1>' + esc(title) + '</h1>' + (sub ? (sub.html ? '<p class="dates">' + sub.html + '</p>' : '<p>' + esc(sub) + '</p>') : '') + '</div></header>'; }
  function daysTo(iso) { return Math.ceil((new Date(iso + 'T23:59:00').getTime() - A.now().getTime()) / DAY); }
  function roomStats(r, pid) {
    var st = A.stage(A.profile(pid)), all = 0, met = 0, fl = Flow.floorOf(A.profile(pid)), yr = Flow.yearOf(A.profile(pid));
    r.units.forEach(function (u) { if (u.band > st || u.y < fl || u.y > yr + 1) return; u.skills.forEach(function (s) { all++; if (M.met(s.id, pid)) met++; }); });
    return { all: all, met: met };
  }
  /* ---------- today ---------- */
  var mins = function (s) { return N(Math.max(1, Math.round(Plan.est(s, A.stage())))) + ' ' + esc(L(['min', 'د'])); };
  var baseHome = A.V.home;
  A.V.home = function (a, r) {
    if (!isTeen()) return baseHome(a, r);
    var p = A.P(), d = A.D(), pl = Plan.today(), nx = Plan.nextStop(), res = A.resumeOf(), sk = res && C.skill(res.skill);
    var exams = (p.exams || []).filter(function (e) { return daysTo(e.date) >= 0; }).sort(function (x, y) { return x.date < y.date ? -1 : 1; });
    var due = M.due().length, doneN = pl.stops.filter(function (s) { return s.done; }).length;
    var rows = pl.stops.map(function (s, i) {
      var inf = A.stopInfo(s);
      return '<button class="ti ' + (s.done ? 'done' : i === nx ? 'now' : '') + '" data-a="go-stop" data-i="' + i + '"><span class="dot"></span><span class="grow"><b>' + esc(L(inf.title)) + '</b><small>' + esc(L(inf.sub)) + '</small></span>' + (s.done ? A.icon('check', 18) : '<span class="num">' + mins(s) + '</span>') + '</button>';
    }).join('');
    /* the one thing to do now, as a clear first step, unless a lesson is waiting to be resumed */
    var ns = nx != null && nx >= 0 && pl.stops[nx], ni = ns && A.stopInfo(ns);
    var nextH = ns && !ns.done && !sk ? '<button class="tnext" data-a="go-stop" data-i="' + nx + '"><span class="grow"><small>' + esc(L(doneN ? ['Next', 'التالي'] : ['First today', 'أول اليوم'])) + ' · ' + mins(ns) + '</small><b>' + esc(L(ni.title)) + '</b><small>' + esc(L(ni.sub)) + '</small></span><span class="tgo">' + esc(L(['Start', 'ابدأ'])) + A.icon('next', 18) + '</span></button>' : '';
    var goal = (d.weekly && d.weekly.goal) || '';
    return { html: head(L(['As-salāmu ʿalaykum', 'السلام عليكم']) + ', ' + p.name, { html: Voice.dateLine() + '<span class="dl-s">' + esc(L(A.STAGES[A.stage()].name)) + '</span>' }) + '<div class="tw">' +
      (window.Flow.inSchoolBreak() ? '<p class="card">' + esc(L(['School break today', 'اليوم عطلة دراسية'])) + '</p>' : '') +
      (sk ? '<button class="tnext" data-a="go-resume"><span class="grow"><small>' + esc(L(['Carry on where you stopped', 'تابع من حيث توقفت'])) + '</small><b>' + esc(L(sk.title)) + '</b></span><span class="tgo">' + esc(L(['Carry on', 'تابع'])) + A.icon('next', 18) + '</span></button>' : nextH) +
      (exams.length ? '<a class="tcard" style="min-height:0;margin-bottom:10px" href="#/study"><small>' + esc(L(['Next exam', 'الاختبار القادم'])) + '</small><b>' + esc(exams[0].title) + '</b><small>' + esc(L(['Days left: ', 'الأيام المتبقية: '])) + N(daysTo(exams[0].date)) + '</small></a>' : '') +
      '<div class="tsec">' + esc(L(['Today', 'اليوم'])) + ' · ' + N(doneN) + ' / ' + N(pl.stops.length) + (Plan.left() ? ' · ' + esc(L(['about', 'نحو'])) + ' ' + N(Plan.left()) + ' ' + esc(L(['min', 'د'])) : '') + '</div><div class="tl">' + (rows || '<div class="ti"><span class="grow"><b>' + esc(L(['A clear day', 'يوم خالٍ'])) + '</b><small>' + esc(L(['Nothing is due. Read something you love.', 'لا شيء مطلوب. اقرأ ما تحب.'])) + '</small></span></div>') + '</div>' +
      '<div class="tsec">' + esc(L(['This week', 'هذا الأسبوع'])) + '</div><div class="tgrid"><a class="tcard" href="#/flash"><small>' + esc(L(['Due to review', 'للمراجعة'])) + '</small><b>' + N(due + flashDue().length) + '</b></a><a class="tcard" href="#/study"><small>' + esc(L(['My goal', 'هدفي'])) + '</small><b>' + esc(goal || L(['Set one', 'حدد هدفًا'])) + '</b></a></div>' +
      '<a class="btn ghost" style="margin-top:14px" href="#/parent">' + A.icon('grown', 18) + '<span>' + esc(L(['Parents', 'الوالدان'])) + '</span></a></div>' + nav('home') };
  };
  /* ---------- subjects ---------- */
  var baseRooms = A.V.rooms;
  A.V.rooms = function (a, r) {
    if (!isTeen()) return baseRooms(a, r);
    var pid = A.P().id;
    /* a subject with nothing at their age (Thinking ends at eleven) is not listed */
    var rows = C.order.filter(function (id) { return id !== 'quran' && roomStats(C.rooms[id], pid).all > 0; }).map(function (id) {
      var R = C.rooms[id], s = roomStats(R, pid), nx = C.next(id);
      return '<a class="ti" href="#/room/' + id + '"><span class="grow"><b>' + esc(L(R.name)) + '</b><small>' + esc(nx ? L(nx.title) : L(['All done for now', 'اكتمل الآن'])) + '</small><div class="tbar"><i style="width:' + (s.all ? Math.round(s.met / s.all * 100) : 0) + '%"></i></div></span><span class="num">' + N(s.met) + '/' + N(s.all) + '</span></a>';
    }).join('');
    return { html: head(L(['Subjects', 'المواد']), L(['Work in any order. Your plan keeps them balanced.', 'اعمل بأي ترتيب، وخطتك توازن بينها.'])) + '<div class="tw"><a class="ti tl" style="margin-bottom:10px" href="#/room/quran"><span class="grow"><b>' + esc(L(C.rooms.quran.name)) + '</b><small>' + esc(L(['Memorising and revising', 'الحفظ والمراجعة'])) + '</small></span></a><div class="tl">' + rows + '</div></div>' + nav('rooms') };
  };
  /* a syllabus, a year at a time */
  var baseRoom = A.V.room;
  A.V.room = function (args, r) {
    if (!isTeen() || args[0] === 'quran') return baseRoom(args, r);
    var R = C.rooms[args[0]]; if (!R) return { redirect: 'rooms' };
    var p = A.P(), st = A.stage(p), next = C.next(R.id), fl = Flow.floorOf(p), mine = R.units.filter(function (u) { return u.band <= st; });
    var years = []; mine.forEach(function (u) { if (years.indexOf(u.y) < 0) years.push(u.y); }); years.sort(function (x, y) { return x - y; });
    var hereU = next && mine.filter(function (u) { return u.skills.some(function (s) { return s.id === next.id; }); })[0];
    var want = args[1] && +args[1].slice(1), year = years.indexOf(want) >= 0 ? want : hereU ? hereU.y : years[years.length - 1];
    var bar = '<div class="ryears">' + years.map(function (n) { return '<button class="ryear' + (n === year ? ' on' : '') + '" data-a="room-year" data-r="' + R.id + '" data-y="' + n + '"><b>' + esc(L(C.yearName(n))) + '</b></button>'; }).join('') + '</div>';
    var body = mine.filter(function (u) { return u.y === year; }).map(function (u) {
      return '<div class="tsec">' + esc(L(u.title)) + '</div><div class="tl">' + u.skills.map(function (s) {
        var met = M.met(s.id), open = met || C.open(s), now = next && next.id === s.id;
        return '<button class="ti ' + (met ? 'done' : now ? 'now' : open ? '' : 'lock') + '" data-a="room-open" data-id="' + s.id + '"><span class="dot"></span><span class="grow"><b>' + esc(L(s.title)) + '</b></span>' + (met ? '<span class="num">' + Math.round(M.light(s.id) * 100) + '%</span>' : '') + '</button>';
      }).join('') + '</div>';
    }).join('');
    return { hue: R.hue, mount: function (v) { var yb = $('.ryear.on', v); if (yb && yb.scrollIntoView) yb.scrollIntoView({ inline: 'center', block: 'nearest' }); }, html: head(L(R.name), L(R.tag), ['rooms', ['Subjects', 'المواد']]) + bar + '<div class="tw">' + body + (year < fl ? '<p style="color:var(--t2);font-size:13px;margin-top:10px">' + esc(L(['Earlier years are here for when you want to go back.', 'السنوات السابقة هنا إذا أردت العودة.'])) + '</p>' : '') + '</div>' + nav('rooms') };
  };
  /* ---------- record ---------- */
  A.acts['t-transcript'] = function () {
    var p = A.P(), d = A.D(), html = '<h1 style="font-size:22pt;margin:0 0 4pt">' + esc(p.name) + '</h1><p style="margin:0 0 14pt">' + esc(L(['Learning record from Miftāḥ, printed ', 'سجل التعلم من مفتاح، طُبع في '])) + A.day() + '</p>';
    C.order.forEach(function (id) {
      if (id === 'quran') return; var R = C.rooms[id], rows = '';
      R.units.slice().sort(function (x, y) { return x.y - y.y; }).forEach(function (u) { var met = u.skills.filter(function (s) { return M.met(s.id); }); if (met.length) rows += '<tr><td style="padding:3pt 8pt 3pt 0;vertical-align:top">' + esc(L(C.yearName(u.y))) + '</td><td style="padding:3pt 8pt 3pt 0;vertical-align:top"><b>' + esc(L(u.title)) + '</b></td><td style="padding:3pt 0;vertical-align:top">' + met.map(function (s) { return esc(L(s.title)); }).join(', ') + '</td></tr>'; });
      if (rows) html += '<h2 style="font-size:14pt;margin:12pt 0 4pt">' + esc(L(R.name)) + '</h2><table style="border-collapse:collapse;font-size:10pt;width:100%">' + rows + '</table>';
    });
    var h = Hifz.state(); html += '<h2 style="font-size:14pt;margin:12pt 0 4pt">' + esc(L(C.rooms.quran.name)) + '</h2><p>' + esc(L(['Āyāt memorised: ', 'الآيات المحفوظة: '])) + N(Object.keys(h.u).length) + '</p>';
    if (window.Print && Print.send) Print.send(html, 'Miftah-record');
  };
  /* ---------- study hub ---------- */
  function val(id) { var e = $('#' + id); return e ? e.value.trim() : ''; }
  A.acts['t-exam-del'] = function (t) { var p = A.P(), s = (p.exams || []).slice().sort(function (x, y) { return x.date < y.date ? -1 : 1; }), e = s[+t.dataset.i]; p.exams = p.exams.filter(function (x) { return x !== e; }); A.saveNow(); A.rerender(); };
  /* close to an exam, new lessons give way to memory */
  var basePace = Flow.pace;
  Flow.pace = function (pid) {
    var r = basePace(pid), p = A.profile(pid), near = (p.exams || []).some(function (e) { var n = daysTo(e.date); return n >= 0 && n <= 56; });
    if (near && A.stage(p) >= 3) { r.news = Math.max(1, Math.min(r.news, 2)); r.why.push(['An exam is near, so review comes first.', 'اقترب اختبار، فالمراجعة أولًا.']); }
    return r;
  };
  /* ---------- flashcards: the student's own, on a simple widening schedule ---------- */
  function flashDue() { var c = A.D().cards || [], t = A.now().getTime(); return c.filter(function (x) { return (x.next || 0) <= t; }); }
  A.acts['t-flip'] = function () { var c = flashDue()[0]; if (!c) return; $('#t-card').innerHTML = '<small>' + esc(c.f) + '</small><span>' + esc(c.b) + '</span>'; $('#t-grade').hidden = false; };
  A.acts['t-grade'] = function (t) {
    var c = flashDue()[0], g = +t.dataset.g, now = A.now().getTime(); if (!c) return;
    c.gap = g === 0 ? .01 : g === 1 ? Math.max(1, (c.gap || 1) * 1.2) : Math.min(180, Math.max(1, (c.gap || .5) * 2.4));
    c.next = now + c.gap * DAY; A.saveNow(); A.rerender();
  };
  /* ---------- essays: plan, draft, check, keep every version ---------- */
  A.V.write = function (args) {
    if (!A.P()) return { redirect: 'home' };
    var d = A.D(), work = d.work || [], id = args && args[0];
    if (id == null) return { html: head(L(['Essays', 'المقالات']), L(['Written work stays yours. A parent sees it only if you share it.', 'أعمالك المكتوبة لك، ولا يراها الوالدان إلا إذا شاركتها.']), ['study', ['Study', 'الدراسة']]) + '<div class="tw"><input class="tin" id="t-w-t" placeholder="' + esc(L(['Title or question', 'العنوان أو السؤال'])) + '"><button class="btn pri wide" style="margin-top:8px" data-a="t-w-new">' + esc(L(['Start writing', 'ابدأ الكتابة'])) + '</button><div class="tsec">' + esc(L(['My work', 'أعمالي'])) + '</div><div class="tl">' + (work.map(function (w, i) { return '<a class="ti" href="#/write/' + i + '"><span class="grow"><b>' + esc(w.title) + '</b><small>' + N(words(w.text)) + ' ' + esc(L(['words', 'كلمة'])) + (w.shared ? ' · ' + esc(L(['shared', 'مشارَك'])) : '') + '</small></span></a>'; }).reverse().join('') || '<div class="ti"><span class="grow"><small>' + esc(L(['Nothing yet.', 'لا شيء بعد.'])) + '</small></span></div>') + '</div></div>' };
    var idx = +id, w = work[idx]; if (!w) return { redirect: 'write' };
    var title = w.title, ch = (w.check || []), saveTimer = null, bEl = null, pEl = null;
    function curEssay() { var arr = (A.D().work || []); return (arr[idx] && arr[idx].title === title) ? arr[idx] : arr.filter(function (x) { return x.title === title; })[0] || w; }
    function flushDraft() { clearTimeout(saveTimer); saveDraft(curEssay(), bEl, pEl); }
    return { unmount: function () { if (A.flushDraft === flushDraft) A.flushDraft = null; flushDraft(); }, mount: function (v) {
      bEl = $('#t-w-b', v); pEl = $('#t-w-p', v); var cnt = $('#t-w-c', v);
      A.flushDraft = flushDraft;
      function queueDraft() {
        cnt.textContent = N(words(bEl.value)) + ' ' + L(['words', 'كلمة']);
        clearTimeout(saveTimer);
        saveTimer = setTimeout(flushDraft, 800);
      }
      bEl.oninput = pEl.oninput = queueDraft;
    }, html: head(w.title, '', ['write', ['Essays', 'المقالات']]) + '<div class="tw"><textarea class="tin" id="t-w-p" style="min-height:90px" placeholder="' + esc(L(['Plan: your main point, then three reasons.', 'الخطة: فكرتك الرئيسة ثم ثلاثة أسباب.'])) + '">' + esc(w.plan || '') + '</textarea><textarea class="tin" id="t-w-b" style="margin-top:8px;min-height:300px" placeholder="' + esc(L(['Draft', 'المسودة'])) + '">' + esc(w.text || '') + '</textarea><p id="t-w-c" style="color:var(--t2);font-size:13px;margin-top:4px">' + N(words(w.text)) + ' ' + esc(L(['words', 'كلمة'])) + '</p><div class="tsec">' + esc(L(['Before you finish', 'قبل أن تنتهي'])) + '</div>' + CHECK.map(function (c, i) { return '<button class="wcheck ' + (ch[i] ? 'on' : '') + '" data-a="t-w-check" data-i="' + i + '" data-w="' + id + '"><i></i><span>' + esc(L(c)) + '</span></button>'; }).join('') + '<button class="btn sec wide" style="margin-top:10px" data-a="t-w-share" data-w="' + id + '">' + esc(w.shared ? L(['Stop sharing with parents', 'أوقف المشاركة']) : L(['Share with parents for marking', 'شاركه مع الوالدين للتصحيح'])) + '</button>' + (w.mark ? '<div class="tsec">' + esc(L(['Feedback', 'الملاحظات'])) + '</div><p>' + esc(w.mark) + '</p>' : '') + '</div>' };
  };
  var CHECK = [['I answered the actual question', 'أجبت عن السؤال نفسه'], ['Each paragraph has one main point', 'لكل فقرة فكرة رئيسة'], ['I gave evidence and examples', 'قدمت أدلة وأمثلة'], ['I was fair to the other side', 'أنصفت الرأي الآخر'], ['I read it aloud and fixed what sounded wrong', 'قرأته بصوت عالٍ وأصلحت ما بدا خطأ']];
  function words(t) { return (t || '').trim().split(/\s+/).filter(Boolean).length; }
  function saveDraft(w, b, p0) { if (!w || !b || !p0 || (w.text === b.value && w.plan === p0.value)) return; if (w.text !== b.value && w.text && Math.abs(words(w.text) - words(b.value)) > 40) { w.versions = (w.versions || []).concat([{ t: A.now().getTime(), text: w.text }]).slice(-6); } w.text = b.value; w.plan = p0.value; w.t = A.now().getTime(); A.save(); }
  A.acts['t-w-new'] = function () { var t = val('t-w-t'); if (!t) return; var d = A.D(); d.work = (d.work || []).concat([{ title: t, text: '', plan: '', t: A.now().getTime() }]); A.saveNow(); A.go('write/' + (d.work.length - 1)); };
  A.acts['t-w-check'] = function (t) { var w = A.D().work[+t.dataset.w], i = +t.dataset.i; w.check = w.check || []; w.check[i] = !w.check[i]; t.classList.toggle('on', w.check[i]); A.save(); };
  A.acts['t-w-share'] = function (t) { var i = +t.dataset.w, w = A.D().work[i]; saveDraft(w, $('#t-w-b'), $('#t-w-p')); w.shared = !w.shared; A.saveNow(); A.rerender(); };
  /* ---------- a timed paper: mixed, no hints; what goes wrong returns to the plan ---------- */

  /* ---------- new instruments ---------- */
  /* typed maths: negatives, decimals, fractions, algebra. Accepts anything equal in value, or any listed form. */
  function norm(s) { return String(s).replace(/\s+/g, '').replace(/−/g, '-').replace(/×/g, '*').toLowerCase(); }
  function exprNum(s) {
    if (/^-?(?:\d+\.?\d*|\.\d+)$/.test(s)) return Number(s);
    var m = /^(-?(?:\d+\.?\d*|\.\d+))\/((?:\d+\.?\d*|\.\d+))$/.exec(s);
    if (m && +m[2] !== 0) return Number(m[1]) / Number(m[2]);
    return NaN;
  }
  I.expr = function (c) {
    var s = c.step, val0 = '', keys = (s.keys || '789+x456-y123/^0.()').split(''), acc = (Array.isArray(s.a) ? s.a : [s.a]).map(norm);
    c.el.innerHTML = (s.html ? '<div class="pad-v">' + s.html + '</div>' : '') + (function () { if (!s.eq) return ''; var k = A.eqKind(s.eq); return k.code ? '<pre class="pad-code" dir="ltr">' + A.esc(k.eq.replace(/;\s*/g, '\n')) + '</pre>' : k.given ? '<div class="pad-given" dir="' + (k.rtl ? 'rtl' : 'ltr') + '">' + (k.rtl ? A.esc(A.num(k.text)) : A.bidi(A.esc(A.num(k.text)))) + '</div>' : '<div class="pad-eq" dir="ltr">' + A.esc(s.eq) + '</div>'; })() + '<div class="xout" aria-live="polite"><span>&nbsp;</span></div><div class="xkeys" dir="ltr">' + keys.map(function (k) { return '<button data-k="' + A.esc(k) + '">' + (k === '-' ? '−' : k === '/' ? '⁄' : A.esc(k)) + '</button>'; }).join('') + '<button class="w2" data-k="del" aria-label="' + A.esc(L(['Delete', 'حذف'])) + '">⌫</button><button class="w2 ok" data-k="ok" style="grid-column:span 4">' + A.esc(L(['Check', 'تحقق'])) + '</button></div>';
    var out = A.$('.xout span', c.el), btns = A.$$('.xkeys button', c.el);
    if (c.onReveal) c.onReveal(function () { out.textContent = String(Array.isArray(s.a) ? s.a[0] : s.a).replace(/-/g, '−'); btns.forEach(function (b) { b.disabled = true; }); });
    btns.forEach(function (b) { b.onclick = function () {
      var k = b.dataset.k;
      if (k === 'del') val0 = val0.slice(0, -1);
      else if (k === 'ok') {
        if (!val0) return;
        var v = norm(val0), right = acc.indexOf(v) >= 0;
        if (!right) { var n = exprNum(v); right = !isNaN(n) && acc.some(function (a) { var x = exprNum(a); return !isNaN(x) && Math.abs(x - n) < 1e-6; }); }
        if (right) { btns.forEach(function (x) { x.disabled = true; }); c.ok(); } else { c.bad(); val0 = ''; }
      } else if (val0.length < 16) val0 += k;
      out.innerHTML = A.esc(val0.replace(/-/g, '−')) || '&nbsp;';
    }; });
  };
  /* a written answer: the student writes, then checks it honestly against what a good answer contains */
  I.write = function (c) {
    var s = c.step, st = 0, done = {};
    c.el.innerHTML = '<textarea class="tin" id="i-w" placeholder="' + A.esc(L(['Write your answer in full sentences.', 'اكتب جوابك بجمل كاملة.'])) + '"></textarea><button class="btn sec wide" id="i-w-go" style="margin-top:8px">' + A.esc(L(['Compare with a good answer', 'قارن بجواب جيد'])) + '</button><div id="i-w-ch" hidden><div class="tsec">' + A.esc(L(['A good answer would…', 'الجواب الجيد…'])) + '</div>' + s.check.map(function (x, i) { return '<button class="wcheck" data-i="' + i + '"><i></i><span>' + A.esc(L(x)) + '</span></button>'; }).join('') + '<button class="btn pri wide" id="i-w-end" style="margin-top:10px">' + A.esc(L(['Done', 'تم'])) + '</button></div>';
    var go = A.$('#i-w-go', c.el), ta = A.$('#i-w', c.el);
    go.onclick = function () { if (words(ta.value) < (s.min || 12)) { A.toast(L(['A little more first, then compare.', 'اكتب أكثر قليلًا ثم قارن.'])); return; } go.hidden = true; A.$('#i-w-ch', c.el).hidden = false; };
    A.$$('.wcheck', c.el).forEach(function (b) { b.onclick = function () { var i = b.dataset.i; done[i] = !done[i]; b.classList.toggle('on', done[i]); }; });
    A.$('#i-w-end', c.el).onclick = function () {
      var n = Object.keys(done).filter(function (k) { return done[k]; }).length, d = A.D(); d.work = (d.work || []).concat([{ title: L(s.p), text: ta.value, plan: '', t: A.now().getTime(), self: n + '/' + s.check.length }]);
      if (n * 2 >= s.check.length) c.ok(); else { A.toast(L(['Worth another try, using what you just read.', 'حاول مرة أخرى مستفيدًا مما قرأت.'])); c.bad(); }
    };
  };
})();

/* ---------- parents: summaries, with work only when shared ---------- */
(function () {
  'use strict';
  var A = window.A, $ = A.$, esc = A.esc, L = A.L, N = function (x) { return A.num(x); };
  A.V.marking = function (args) {
    if (!A.grownOpen()) return A.grownGate();
    if (!A.P()) return { redirect: 'home' };
    var pid = args && args[0];
    var ch = A.S.profiles.filter(function (p) { return A.stage(p) >= 3 && (!pid || p.id === pid); }), html = '';
    if (pid && !ch.length) return { redirect: 'parent' };
    ch.forEach(function (p) {
      var d = A.D(p.id), shared = (d.work || []).map(function (w, i) { return { w: w, i: i }; }).filter(function (x) { return x.w.shared; }), papers = (d.papers || []).slice(-3).reverse(), wk = d.weekly || {};
      html += '<div class="tsec">' + esc(p.name) + '</div><div class="tl"><div class="ti"><span class="grow"><b>' + esc(L(['Goal this week', 'هدف هذا الأسبوع'])) + '</b><small>' + esc(wk.goal || L(['None set', 'لم يُحدد'])) + '</small></span></div>' + (papers.length ? '<div class="ti"><span class="grow"><b>' + esc(L(['Recent practice papers', 'آخر الاختبارات'])) + '</b><small>' + papers.map(function (x) { return esc(L(window.C.rooms[x.r].name)) + ' ' + N(x.p) + '%'; }).join(' · ') + '</small></span></div>' : '') + (p.exams || []).map(function (e) { return '<div class="ti"><span class="grow"><b>' + esc(e.title) + '</b><small>' + esc(e.date) + '</small></span></div>'; }).join('') + '</div>' +
        (shared.length ? shared.map(function (x) { return '<div class="card" style="margin-top:10px"><h3>' + esc(x.w.title) + '</h3><p style="white-space:pre-wrap;line-height:1.5;margin:8px 0">' + esc(x.w.text || '') + '</p><textarea class="tin" style="min-height:80px" data-mark="' + esc(p.id) + ':' + x.i + '" placeholder="' + esc(L(['Your feedback', 'ملاحظاتك'])) + '">' + esc(x.w.mark || '') + '</textarea></div>'; }).join('') : '<p style="color:var(--t2);font-size:13.5px;margin-top:8px">' + esc(L(['Written work appears here only when they share it.', 'تظهر الأعمال المكتوبة هنا فقط عند مشاركتها.'])) + '</p>');
    });
    return { html: '<header class="th"><div class="grow"><a class="backp" href="#/parent">' + A.icon('back', 18) + '<span>' + esc(L(['Parents', 'الوالدان'])) + '</span></a><h1>' + esc(L(['Older students', 'الطلاب الأكبر'])) + '</h1><p>' + esc(L(['A summary, as you agreed together.', 'ملخص كما اتفقتم.'])) + '</p></div></header><div class="tw">' + html + '</div>', mount: function (v) {
      A.$$('[data-mark]', v).forEach(function (t) {
        t.onchange = function () {
          if (!A.grownOpen()) { A.rerender(); return; }
          var key = t.dataset.mark, i = key.lastIndexOf(':'), work = (A.D(key.slice(0, i)).work || [])[+key.slice(i + 1)];
          if (!work || !work.shared) return;
          work.mark = t.value; A.saveNow();
        };
      });
    } };
  };
})();
