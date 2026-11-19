/* Courses: following a book or a course a family already uses, in any subject. The Madinah books, al-ʿArabiyyah Bayna Yadayk,
   a maths textbook, a physics revision guide, a seerah course, a teacher's own notes.
   Miftāḥ does not copy a book: the family brings its own copy and enters each lesson (or pastes a whole course that a teacher
   shared), and Miftāḥ turns every lesson into a full lesson: the terms met one by one, the rule or fact, practice both ways,
   the course's own questions as a quiz, its sentences with a word missing, and spaced review like any other key. Every lesson
   has its place in a grid, so nothing is missed: an empty lesson shows as a gap until it is filled. A child can follow a course
   as their path in that subject.

   The format, one line each, a lesson starting with #:
     # 1 Forces
     force = a push or a pull                 a term = what it means (Arabic words work the same way: بَيْتٌ = a house)
     ! Weight is mass × gravity.              a rule or a fact to learn
     > A force is measured in newtons. = …    a sentence from the course (a word is hidden in practice)
     ? 10 kg on Earth weighs how many N? = 98 | 10 | 9.8     a question: the right answer first, then any wrong ones
     ? The unit of force = newton             (no wrong answers given: they are drawn from the lesson)
   A tab or a comma works in place of =, so a spreadsheet of term, meaning pastes in as it is. */
(function () {
  'use strict';
  var A = window.A, C = window.C, M = window.M, $ = A.$, $$ = A.$$, esc = A.esc, L = A.L;
  var B = A.Books = {};
  var isAr = function (s) { return /[؀-ۿ]/.test(String(s || '')); };

  /* the shapes of the books families ask for. Bayna Yadayk: each part of a level has 8 units of 9 lessons (the publisher's own
     description); a unit is one entry here. Madinah: the number of lessons can be changed to match the edition in hand. */
  B.KINDS = [
    { id: 'madinah1', room: 'arabic', name: ['Madinah Arabic, Book 1', 'دروس اللغة العربية، الكتاب الأول'], n: 23, unit: ['Lesson', 'الدرس'] },
    { id: 'madinah2', room: 'arabic', name: ['Madinah Arabic, Book 2', 'دروس اللغة العربية، الكتاب الثاني'], n: 30, unit: ['Lesson', 'الدرس'] },
    { id: 'madinah3', room: 'arabic', name: ['Madinah Arabic, Book 3', 'دروس اللغة العربية، الكتاب الثالث'], n: 30, unit: ['Lesson', 'الدرس'] },
    { id: 'byd1a', room: 'arabic', name: ['Al-ʿArabiyyah Bayna Yadayk, Level 1, Part 1', 'العربية بين يديك، المستوى الأول، الجزء الأول'], n: 8, unit: ['Unit', 'الوحدة'] },
    { id: 'byd1b', room: 'arabic', name: ['Al-ʿArabiyyah Bayna Yadayk, Level 1, Part 2', 'العربية بين يديك، المستوى الأول، الجزء الثاني'], n: 8, unit: ['Unit', 'الوحدة'] },
    { id: 'byd2a', room: 'arabic', name: ['Al-ʿArabiyyah Bayna Yadayk, Level 2, Part 1', 'العربية بين يديك، المستوى الثاني، الجزء الأول'], n: 8, unit: ['Unit', 'الوحدة'] },
    { id: 'byd2b', room: 'arabic', name: ['Al-ʿArabiyyah Bayna Yadayk, Level 2, Part 2', 'العربية بين يديك، المستوى الثاني، الجزء الثاني'], n: 8, unit: ['Unit', 'الوحدة'] },
    { id: 'other', room: 'arabic', name: ['Another Arabic book', 'كتاب عربية آخر'], n: 12, unit: ['Lesson', 'الدرس'] },
    { id: 'course', room: null, name: ['A course', 'مقرر'], n: 10, unit: ['Lesson', 'الدرس'] }
  ];
  /* the subjects a course can belong to (the Qurʾān has its own memorisation, so it is not one of them) */
  B.ROOMS = function () { return C.order.filter(function (r) { return r !== 'quran' && C.rooms[r]; }); };
  function kindOf(id) { return B.KINDS.filter(function (k) { return k.id === id; })[0] || B.KINDS[B.KINDS.length - 1]; }
  function roomOf(bk) { var r = bk.room || kindOf(bk.kind).room || 'arabic'; return C.rooms[r] ? r : 'arabic'; }
  B.roomOf = roomOf;
  function books() { if (!Array.isArray(A.S.books)) A.S.books = []; return A.S.books; }
  B.list = books;
  function blank(n) { return { n: n, title: '', words: [], grammar: [], sents: [], qs: [] }; }

  /* who follows what: { room: course id }. The first version kept only an Arabic book, as p.arBook */
  function follows(p) {
    if (!p) return {};
    if (!p.courses || typeof p.courses !== 'object') p.courses = {};
    if (p.arBook && !p.courses.arabic) p.courses.arabic = p.arBook;
    delete p.arBook;
    return p.courses;
  }
  B.follows = follows;

  /* ---------- reading what a family pastes ---------- */
  B.parse = function (text) {
    var out = [], cur = null;
    String(text || '').split(/\r?\n/).forEach(function (raw) {
      var line = raw.trim(); if (!line) return;
      var h = line.match(/^#+\s*(\d+)?\s*[.:)\-–]?\s*(.*)$/);
      if (h) { cur = blank(h[1] ? +h[1] : out.length + 1); cur.title = h[2] || ''; out.push(cur); return; }
      if (!cur) { cur = blank(1); out.push(cur); }
      if (/^!/.test(line)) { cur.grammar.push(line.replace(/^!\s*/, '')); return; }
      if (/^[?؟]/.test(line)) {
        line = line.replace(/^[?؟]\s*/, '');
        /* the answers follow the last = (or tab), so a question may hold an = of its own: "g = 10 N/kg" */
        var cut = Math.max(line.lastIndexOf('='), line.lastIndexOf('\t')); if (cut < 1) return;
        var qt = line.slice(0, cut).trim(), ans = line.slice(cut + 1).split(/\s*\|\s*/).map(function (x) { return x.trim(); }).filter(Boolean);
        if (qt && ans.length) cur.qs.push([qt].concat(ans));
        return;
      }
      var sent = /^>/.test(line); line = line.replace(/^>\s*/, '');
      var parts = line.split(/\s*(?:=|\t)\s*/); if (parts.length < 2 && !sent) parts = line.split(/\s*[,،]\s*/); if (parts.length < 2) parts = [line, ''];
      var a = parts[0].trim(), b = parts.slice(1).join(', ').trim();
      if (!isAr(a) && isAr(b)) { var t = a; a = b; b = t; }
      if (!a) return;
      (sent || a.split(/\s+/).length > 3 ? cur.sents : cur.words).push([a, b]);
    });
    return out;
  };
  B.text = function (ls) {
    return (ls || []).filter(function (x) { return filled(x); }).map(function (x) {
      return '# ' + x.n + (x.title ? ' ' + x.title : '') + '\n' + x.words.map(function (w) { return w[0] + ' = ' + w[1]; }).concat(
        x.grammar.map(function (g) { return '! ' + g; }), x.sents.map(function (s) { return '> ' + s[0] + ' = ' + s[1]; }),
        (x.qs || []).map(function (q) { return '? ' + q[0] + ' = ' + q.slice(1).join(' | '); })).join('\n');
    }).join('\n\n');
  };
  function filled(x) { return !!(x && ((x.words && x.words.length) || (x.sents && x.sents.length) || (x.qs && x.qs.length))); }
  B.filled = filled;
  function count(ls) { return (ls.words || []).length + (ls.sents || []).length + (ls.qs || []).length; }

  /* ---------- every course becomes a unit in its subject, every filled lesson a lesson ---------- */
  var made = {};
  B.register = function () {
    if (!C.rooms.arabic || !A.S) return;
    Object.keys(made).forEach(function (uid) {
      var u = C.units[uid]; if (!u) return;
      u.skills.forEach(function (s) { delete C.skills[s.id]; var li = C.list.indexOf(s); if (li >= 0) C.list.splice(li, 1); });
      var R = C.rooms[u.room], ri = R ? R.units.indexOf(u) : -1; if (ri >= 0) R.units.splice(ri, 1); delete C.units[uid];
    });
    made = {};
    A.S.profiles.forEach(follows);
    var keep = C._u;
    books().forEach(function (bk) {
      var uid = 'bk-' + bk.id, kind = kindOf(bk.kind), room = roomOf(bk), y = bk.y != null ? +bk.y : 3;
      var u = C.unit(room, uid, [bk.name, bk.name], room === 'arabic' ? 1 : 0); u.y = y; u.book = bk.id; made[uid] = 1;
      var prev = null;
      (bk.lessons || []).slice().sort(function (a, b) { return a.n - b.n; }).forEach(function (ls) {
        if (!filled(ls)) return;
        var id = 'bk.' + bk.id + '.' + ls.n;
        var sk = C.add(id, lessonOf(bk, ls, kind, room));
        sk.needs = prev ? [prev] : []; sk.y = y; sk.book = bk.id; prev = id;
      });
    });
    C._u = keep;
  };

  /* wrong answers for a question that gave none: other answers from the lesson, or numbers near a numeric one */
  function nearNumbers(a, r) {
    var n = +String(a).replace(/,/g, ''), dp = (String(a).split('.')[1] || '').length, out = [];
    var fmt = function (x) { return dp ? x.toFixed(dp) : String(Math.round(x)); };
    [n * 10, n / 10, n + 1, n - 1, n * 2, n / 2, n + (n > 20 ? 10 : 2), -n].forEach(function (x) { var s = fmt(x); if (isFinite(x) && s !== fmt(n) && out.indexOf(s) < 0) out.push(s); });
    return r.shuffle(out).slice(0, 3);
  }
  function lessonOf(bk, ls, kind, room) {
    var W = ls.words.slice(), S = ls.sents.slice(), Q = (ls.qs || []).slice(), ar = room === 'arabic';
    var unitWord = ar ? kind.unit : ['Lesson', 'الدرس'];
    var title = [unitWord[0] + ' ' + ls.n + (ls.title ? ': ' + ls.title : ''), unitWord[1] + ' ' + String(ls.n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; }) + (ls.title ? ': ' + ls.title : '')];
    var two = function (s) { return [s, s]; };
    var mean = function (w) { return w[1] ? two(w[1]) : two(w[0]); };
    var opt = function (s, ok, e) { var o = { t: two(s), ar: isAr(s) }; if (ok) o.ok = true; else o.e = e; return o; };
    function askWord(r) {
      if (!W.length) return null;
      var w = r.pick(W), wrong = r.shuffle(W.filter(function (x) { return x !== w && x[0] !== w[0]; })).slice(0, 3);
      if (!wrong.length) return { k: 'say', p: w[1] ? two(w[1]) : ['Say it again.', 'ردّدها.'], big: w[0], bigAr: isAr(w[0]) };
      return { k: 'choice', p: w[1] ? (ar ? ['Which word is “' + w[1] + '”?', 'أيّ كلمة معناها «' + w[1] + '»؟'] : ['Which one is this: “' + w[1] + '”?', 'أيّها هذا: «' + w[1] + '»؟']) : ['Find this word', 'جد هذه الكلمة'],
        o: r.shuffle([opt(w[0], true)].concat(wrong.map(function (x) { return opt(x[0], false, 'vocab'); }))), shuffle: false, cols: 2, large: isAr(w[0]), err: 'vocab' };
    }
    function askMeaning(r) {
      var withM = W.filter(function (x) { return x[1]; }); if (withM.length < 2) return askWord(r);
      var w = r.pick(withM), wrong = r.shuffle(withM.filter(function (x) { return x !== w && x[1] !== w[1]; })).slice(0, 3);
      return { k: 'choice', p: ar ? ['What does it mean?', 'ما معناها؟'] : ['What does it mean?', 'ما معناه؟'], q: two(w[0]), qAr: isAr(w[0]), o: r.shuffle([{ t: mean(w), ok: true }].concat(wrong.map(function (x) { return { t: mean(x), e: 'vocab' }; }))), shuffle: false, cols: withM.some(function (x) { return x[1].length > 28; }) ? 1 : 2, err: 'vocab', hint: ar ? ['Say it aloud and picture it.', 'قلها بصوت عالٍ وتخيّلها.'] : ['Say it in your own words first.', 'قله بكلماتك أولًا.'] };
    }
    function askGap(r) {
      if (!S.length) return askMeaning(r);
      var letters = function (t) { return t.replace(ar ? /[^ء-ي]/g : /[^A-Za-zء-ي0-9]/g, '').length; };
      var s = r.pick(S), toks = s[0].split(/\s+/), cand = toks.map(function (t, i) { return i; }).filter(function (i) { return letters(toks[i]) >= (ar ? 2 : 4) && (ar || i > 0); });   /* not the capitalised first word: its capital would give it away */
      if (!cand.length) return askMeaning(r);
      var gi = r.pick(cand), right = toks[gi].replace(/[.,;:!?؟،]+$/, ''), pool = [].concat.apply([], S.map(function (x) { return x[0].split(/\s+/); })).concat(W.map(function (w) { return w[0]; })).map(function (t) { return t.replace(/[.,;:!?؟،]+$/, ''); });
      var wrong = r.shuffle(pool.filter(function (t, i, a) { return t !== right && a.indexOf(t) === i && letters(t) >= (ar ? 2 : 4); })).slice(0, 3);
      if (wrong.length < 2) return askMeaning(r);
      var shown = toks.map(function (t, i) { return i === gi ? '……' + toks[i].slice(right.length) : t; }).join(' ');
      return { k: 'choice', p: ['Which word fills the gap?', 'أيّ كلمة تملأ الفراغ؟'], q: two(shown), qAr: isAr(shown), o: r.shuffle([opt(right, true)].concat(wrong.map(function (x) { return opt(x, false, 'grammar'); }))), shuffle: false, cols: 2, large: isAr(right), err: ar ? 'grammar' : 'vocab', hint: s[1] ? two(s[1]) : null };
    }
    /* the course's own questions: its wrong answers if it gave them, otherwise drawn from the lesson */
    function askQ(r) {
      if (!Q.length) return null;
      var q = r.pick(Q), right = q[1], wrong = q.slice(2);
      if (wrong.length < 2) {
        /* like for like: a short answer (a term, a name) against other terms, a long one against other definitions;
           never an option that only repeats words of the question */
        var isNum = function (x) { return /^-?[\d.,]+$/.test(String(x).replace(/\s/g, '')); };
        var short = right.split(/\s+/).length <= 3, ql = q[0].toLowerCase(), num = isNum(right);
        var others = Q.map(function (x) { return x[1]; }).concat(W.map(function (w) { return short ? w[0] : (w[1] || w[0]); }))
          .filter(function (x) { return (x.split(/\s+/).length <= 3) === short && isNum(x) === num && ql.indexOf(x.toLowerCase()) < 0; });
        wrong = wrong.concat(num ? nearNumbers(right, r) : r.shuffle(others.filter(function (x, i, a) { return x && x !== right && a.indexOf(x) === i && wrong.indexOf(x) < 0; })));
        wrong = wrong.slice(0, 3);
      }
      if (!wrong.length) return { k: 'say', p: two(q[0]), lab: ['Think, then see', 'فكّر ثم انظر'], big: right, bigAr: isAr(right) };
      var long = [right].concat(wrong).some(function (x) { return x.length > 26; });
      return { k: 'choice', p: two(q[0]), qAr: isAr(q[0]), o: r.shuffle([opt(right, true)].concat(wrong.slice(0, 3).map(function (x) { return opt(x, false, 'concept'); }))), shuffle: false, cols: long ? 1 : 2, err: 'concept' };
    }
    var practice = function (r) {
      var fs = [];
      if (Q.length) fs.push(askQ, askQ);
      if (W.length) fs.push(askMeaning, askWord);
      if (S.length) fs.push(askGap);
      for (var i = 0; i < 4; i++) { var got = r.pick(fs)(r); if (got) return got; }
      return askQ(r) || askMeaning(r) || askGap(r) || { k: 'say', p: two(ls.grammar[0] || title[0]) };
    };
    return {
      title: title, art: ar ? 'book' : (C.rooms[room] && C.rooms[room].art) || 'book', glyph: (W[0] || S[0] || [''])[0], soloN: Math.min(6, Math.max(3, W.length + Q.length)),
      meet: W.slice(0, 10).map(function (w) { return { k: 'say', p: w[1] ? two(w[1]) : ['Say it after me.', 'ردّدها.'], big: w[0], bigAr: isAr(w[0]) }; })
        .concat(ls.grammar.map(function (g) { return { k: 'say', p: two(g), lab: ar ? ['The rule', 'القاعدة'] : ['Remember', 'تذكّر'] }; }))
        .concat(S.slice(0, 3).map(function (s) { return { k: 'say', p: s[1] ? two(s[1]) : ['Read it aloud.', 'اقرأها بصوت عالٍ.'], big: s[0], bigAr: isAr(s[0]) }; }))
        .concat(!W.length && !ls.grammar.length && !S.length ? Q.slice(0, 2).map(function (q) { return { k: 'say', p: two(q[0]), lab: ['Worked', 'مثال'], big: q[1], bigAr: isAr(q[1]) }; }) : []),
      guided: function (r) {
        var withM = W.filter(function (w) { return w[1]; });
        return withM.length >= 3 ? [{ k: 'match', p: ['Match each one to its meaning.', 'صِل كل واحد بمعناه.'], pairs: r.shuffle(withM).slice(0, 4).map(function (w) { return [{ t: two(w[0]), ar: isAr(w[0]) }, { t: mean(w) }]; }), err: 'vocab' }] : [practice(r)];
      },
      solo: practice, review: practice
    };
  }
  /* a child following a course: that subject comes from it, in order, before anything else in the room */
  var next0 = C.next;
  C.next = function (room, pid, skip) {
    var p = A.profile(pid), id = p && follows(p)[room];
    if (id) {
      var u = C.units['bk-' + id];
      if (u) for (var j = 0; j < u.skills.length; j++) { var sk = u.skills[j]; if (skip && skip.indexOf(sk.id) >= 0) continue; if (!M.met(sk.id, pid) && C.open(sk, pid)) return sk; }
    }
    return next0.apply(C, arguments);
  };

  /* ================= the parent's pages ================= */
  function bar(back, title) { return '<header class="abar"><a class="abtn" href="#/' + (back || 'parent') + '" aria-label="' + esc(L(['Back', 'رجوع'])) + '">' + A.icon('back', 20) + '</a><div class="abar-t"><h1>' + esc(title || L(['Courses', 'المقررات'])) + '</h1></div></header>'; }
  function cover(bk) { var n = (bk.lessons || []).length, f = (bk.lessons || []).filter(filled).length; return { n: n, f: f, pct: n ? Math.round(f / n * 100) : 0 }; }
  function who(bk) { var r = roomOf(bk); return A.S.profiles.filter(function (p) { return follows(p)[r] === bk.id; }).map(function (p) { return p.name; }); }
  function listPage() {
    var bs = books();
    var rows = bs.map(function (bk) {
      var c = cover(bk), w = who(bk), R = C.rooms[roomOf(bk)];
      return '<a class="card bk-row h-' + R.hue + '" href="#/parent/books/' + esc(bk.id) + '"><span class="bk-ic">' + A.art(R.art, 34) + '</span><span class="grow"><b>' + esc(bk.name) + '</b><small>' + esc(L(R.name)) + ' · ' + A.num(c.f) + ' / ' + A.num(c.n) + ' ' + esc(L(['ready', 'جاهز'])) + (w.length ? ' · ' + esc(w.join(', ')) : '') + '</small><i class="bk-bar"><em style="width:' + c.pct + '%"></em></i></span>' + A.icon('next', 18) + '</a>';
    }).join('');
    var kinds = B.KINDS.filter(function (k) { return k.room === 'arabic'; }).map(function (k) { return '<button class="li" data-bk-new="' + k.id + '"><span class="grow"><b>' + esc(L(k.name)) + '</b><small>' + A.num(k.n) + ' ' + esc(L(k.unit[0] === 'Unit' ? ['units', 'وحدات'] : ['lessons', 'دروس'])) + '</small></span>' + A.icon('next', 18) + '</button>'; }).join('');
    var subjects = B.ROOMS().filter(function (r) { return r !== 'arabic'; }).map(function (r) { var R = C.rooms[r]; return '<button class="bk-subj h-' + R.hue + '" data-bk-room="' + r + '">' + A.art(R.art, 30) + '<span>' + esc(L(R.name)) + '</span></button>'; }).join('');
    var intro = bs.length ? '' : '<p class="bk-intro">' + esc(L(['Bring the book or course you already use into Miftāḥ, in any subject. Each lesson you enter becomes a lesson with practice, a quiz from its own questions, and review that comes back before it fades.', 'أدخِل الكتاب أو المقرر الذي تستعمله في أي مادة. كل درس تُدخله يصير درسًا فيه تدريب واختبار من أسئلته ومراجعة تعود قبل أن يُنسى.'])) + '</p>';
    return { html: bar() + '<div class="dwrap">' + intro + rows +
        '<div class="card"><h3>' + esc(L(['A course in any subject', 'مقرر في أي مادة'])) + '</h3><p class="bk-help">' + esc(L(['A textbook, a revision guide, a teacher’s notes: terms, facts and questions, lesson by lesson.', 'كتاب مدرسي أو دليل مراجعة أو ملاحظات معلّم: مصطلحات وحقائق وأسئلة، درسًا درسًا.'])) + '</p><div class="bk-subjs">' + subjects + '</div></div>' +
        '<div class="card"><h3>' + esc(L(['An Arabic book', 'كتاب عربية'])) + '</h3><div class="lst">' + kinds + '</div></div></div>',
      mount: function (v) {
        var make = function (kind, room, name) { var id = 'b' + Date.now().toString(36), ls = []; for (var i = 1; i <= kind.n; i++) ls.push(blank(i)); books().push({ id: id, kind: kind.id, room: room, name: name, lessons: ls, at: Date.now() }); B.register(); A.saveNow(); A.go('parent/books/' + id); };
        $$('[data-bk-new]', v).forEach(function (b) { b.onclick = function () { var k = kindOf(b.dataset.bkNew); make(k, 'arabic', L(k.name)); }; });
        $$('[data-bk-room]', v).forEach(function (b) { b.onclick = function () { var r = b.dataset.bkRoom; make(kindOf('course'), r, L(C.rooms[r].name) + ' · ' + L(['my course', 'مقرّري'])); }; });
      } };
  }
  function bookPage(id) {
    var bk = books().filter(function (b) { return b.id === id; })[0]; if (!bk) return { redirect: 'parent/books' };
    var kind = kindOf(bk.kind), c = cover(bk), room = roomOf(bk), R = C.rooms[room], ar = room === 'arabic', uw = ar ? kind.unit : ['Lesson', 'الدرس'];
    var grid = bk.lessons.map(function (ls, i) { return '<button class="bk-cell' + (filled(ls) ? ' on' : '') + '" data-ls="' + i + '" aria-label="' + esc(L(uw) + ' ' + ls.n) + '"><b>' + A.num(ls.n) + '</b>' + (filled(ls) ? '<small>' + A.num(count(ls)) + '</small>' : '') + '</button>'; }).join('');
    var kids = A.S.profiles.map(function (p) { var on = follows(p)[room] === bk.id; return '<button class="li" data-follow="' + esc(p.id) + '"><span class="grow"><b>' + esc(p.name) + '</b><small>' + esc(on ? L(['Their ', '']) + L(R.name) + L([' comes from this course', ' من هذا المقرر']) : L(['Not following it', 'لا يتّبعه'])) + '</small></span><span class="switch' + (on ? ' on' : '') + '"></span></button>'; }).join('');
    var y = bk.y != null ? +bk.y : 3, years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    var yearSel = '<label class="bk-y"><span>' + esc(L(['Level', 'المستوى'])) + '</span><select class="input" id="bk-y">' + years.map(function (n) { return '<option value="' + n + '"' + (n === y ? ' selected' : '') + '>' + esc(L(C.yearName(n))) + '</option>'; }).join('') + '</select></label>';
    return {
      html: bar('parent/books', L(R.name)) + '<div class="dwrap"><div class="card"><div class="bk-name"><input class="input" id="bk-name" dir="auto" value="' + esc(bk.name) + '" aria-label="' + esc(L(['Name', 'الاسم'])) + '">' + (ar ? '' : yearSel) + '</div><p class="bk-sum">' + A.num(c.f) + ' / ' + A.num(c.n) + ' ' + esc(L(['ready', 'جاهز'])) + (c.f < c.n ? ' · ' + esc(L(['dashed squares are still empty', 'المربعات المتقطّعة ما زالت فارغة'])) : '') + '</p><div class="bk-grid">' + grid + '</div>' +
        '<div class="bk-acts"><button class="btn ghost sm" id="bk-add">' + esc(L(['Add a lesson', 'أضف درسًا'])) + '</button><button class="btn ghost sm" id="bk-paste">' + esc(L(['Paste a whole course', 'الصق مقررًا كاملًا'])) + '</button><button class="btn ghost sm" id="bk-copy">' + esc(L(['Copy to share', 'انسخه للمشاركة'])) + '</button></div></div>' +
        '<div class="card"><h3>' + esc(L(['Who follows it', 'من يتّبعه'])) + '</h3><div class="lst">' + kids + '</div></div>' +
        '<button class="btn ghost sm bk-del" id="bk-del">' + esc(L(['Remove this course', 'احذف هذا المقرر'])) + '</button></div>',
      mount: function (v) {
        $$('[data-ls]', v).forEach(function (b) { b.onclick = function () { edit(bk, +b.dataset.ls); }; });
        $$('[data-follow]', v).forEach(function (b) { b.onclick = function () { var p = A.profile(b.dataset.follow), f = follows(p); f[room] = f[room] === bk.id ? null : bk.id; if (!f[room]) delete f[room]; A.D(p.id).path = null; A.saveNow();
          var on = f[room] === bk.id, sw = $('.switch', b), sm = $('small', b); if (sw) sw.classList.toggle('on', on); if (sm) sm.textContent = on ? L(['Their ', '']) + L(R.name) + L([' comes from this course', ' من هذا المقرر']) : L(['Not following it', 'لا يتّبعه']); }; });
        var nm = $('#bk-name', v); nm.onchange = function () { var t = nm.value.trim(); if (t) { bk.name = t; bk.at = Date.now(); B.register(); A.saveNow(); } };
        var ys = $('#bk-y', v); if (ys) ys.onchange = function () { bk.y = +ys.value; bk.at = Date.now(); B.register(); A.saveNow(); A.toast(L(['Saved', 'حُفظ'])); };
        $('#bk-add', v).onclick = function () { bk.lessons.push(blank(bk.lessons.length + 1)); A.saveNow(); A.rerender(); };
        $('#bk-paste', v).onclick = function () { paste(bk); };
        $('#bk-copy', v).onclick = function () { var t = B.text(bk.lessons); if (!t) { A.toast(L(['Fill a lesson first', 'املأ درسًا أولًا'])); return; } try { navigator.clipboard.writeText(t).then(function () { A.toast(L(['Copied. Paste it for a friend, or on another device.', 'نُسخ. الصقه لصديق أو في جهاز آخر.'])); }); } catch (e) { } };
        var del = $('#bk-del', v); del.onclick = function () { if (del.dataset.arm !== '1') { del.dataset.arm = '1'; del.textContent = L(['Tap again to remove it', 'انقر مرة أخرى للحذف']); return; } A.S.books = books().filter(function (b) { return b !== bk; }); A.S.profiles.forEach(function (p) { var f = follows(p); if (f[room] === bk.id) delete f[room]; }); B.register(); A.saveNow(); A.go('parent/books'); };
      }
    };
  }
  var EX_AR = 'بَيْتٌ = a house\nمَسْجِدٌ = a mosque\n! هذا: this, for a near masculine noun\n> هذا بَيْتٌ. = This is a house.';
  var EX = 'force = a push or a pull\n! Weight = mass × gravitational field strength\n> Forces are measured in newtons.\n? A 2 kg bag on Earth weighs about how many newtons? = 20 | 2 | 200';
  function help(ar) {
    return '<div class="bk-help"><p>' + esc(L(['One line each:', 'سطر لكل عنصر:'])) + '</p><ul>' +
      '<li><code>' + esc(ar ? 'بَيْتٌ = a house' : 'term = meaning') + '</code> ' + esc(L(['a word or term', 'كلمة أو مصطلح'])) + '</li>' +
      '<li><code>! …</code> ' + esc(L(['a rule or fact to learn', 'قاعدة أو حقيقة'])) + '</li>' +
      '<li><code>&gt; …</code> ' + esc(L(['a sentence from the book (a word is hidden in practice)', 'جملة من الكتاب (تُخفى كلمة في التدريب)'])) + '</li>' +
      '<li><code>? … = right | wrong | wrong</code> ' + esc(L(['a quiz question, right answer first', 'سؤال اختبار، الصحيح أولًا'])) + '</li></ul></div>';
  }
  function edit(bk, i) {
    var ls = bk.lessons[i], kind = kindOf(bk.kind), ar = roomOf(bk) === 'arabic';
    var cur = B.text([ls]).split('\n').slice(1).join('\n');
    A.sheet(L(ar ? kind.unit : ['Lesson', 'الدرس']) + ' ' + A.num(ls.n), help(ar) + '<input class="input" id="bk-t" dir="auto" placeholder="' + esc(L(['Title (optional)', 'العنوان (اختياري)'])) + '" value="' + esc(ls.title || '') + '"><textarea class="input bk-ta" dir="auto" spellcheck="false" placeholder="' + esc(ar ? EX_AR : EX) + '">' + esc(cur) + '</textarea><button class="btn pri wide" id="bk-save">' + esc(L(['Save', 'احفظ'])) + '</button>', function (sh) {
      $('#bk-save', sh).onclick = function () { var got = B.parse('# ' + ls.n + '\n' + $('.bk-ta', sh).value)[0] || {}; ls.words = got.words || []; ls.grammar = got.grammar || []; ls.sents = got.sents || []; ls.qs = got.qs || []; ls.title = $('#bk-t', sh).value.trim(); bk.at = Date.now(); B.register(); A.saveNow(); A.closeSheet(); A.rerender(); };
    });
  }
  function paste(bk) {
    var ar = roomOf(bk) === 'arabic';
    A.sheet(L(['Paste a whole course', 'الصق مقررًا كاملًا']), '<p class="bk-help">' + esc(L(['Each lesson starts with # and its number. Only the lessons in what you paste are changed.', 'كل درس يبدأ بـ # ورقمه. لا يتغيّر إلا ما في النص من دروس.'])) + '</p>' + help(ar) + '<textarea class="input bk-ta big" dir="auto" spellcheck="false" placeholder="' + esc('# 1 …\n' + (ar ? EX_AR : EX) + '\n\n# 2 …') + '"></textarea><button class="btn pri wide" id="bk-in">' + esc(L(['Bring it in', 'أدخله'])) + '</button>', function (sh) {
      $('#bk-in', sh).onclick = function () {
        var got = B.parse($('.bk-ta', sh).value), n = 0;
        got.forEach(function (g) { if (!filled(g)) return; var at = bk.lessons.filter(function (x) { return x.n === g.n; })[0]; if (!at) { at = { n: g.n }; bk.lessons.push(at); } at.title = g.title; at.words = g.words; at.grammar = g.grammar; at.sents = g.sents; at.qs = g.qs; n++; });
        bk.lessons.sort(function (a, b) { return a.n - b.n; }); bk.at = Date.now();
        B.register(); A.saveNow(); A.closeSheet(); A.toast(L(['Lessons brought in: ', 'دروس أُدخلت: ']) + A.num(n)); A.rerender();
      };
    });
  }
  var par0 = A.V.parent;
  A.V.parent = function (args, r) {
    if (args && (args[0] === 'books' || args[0] === 'courses')) { if (A.grownOpen && !A.grownOpen()) return par0(args, r); return args[1] ? bookPage(args[1]) : listPage(); }
    return par0(args, r);
  };
  /* the courses live in the family's record: they are turned into lessons whenever the record is loaded (start, a restored backup) */
  var load0 = A.load; A.load = function () { var out = load0.apply(this, arguments); try { B.register(); } catch (e) { console.error(e); } return out; };
  if (A.S) B.register();
})();
