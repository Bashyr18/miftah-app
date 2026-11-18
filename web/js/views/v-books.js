/* Following a book: the Madinah books, al-ʿArabiyyah Bayna Yadayk, or any Arabic course a family uses.
   Miftāḥ does not copy a book: the family brings its own copy and enters each lesson (or pastes a whole book that a teacher
   shared), and Miftāḥ turns every lesson into a full lesson: the words met one by one, the grammar point, practice both ways,
   the book's own sentences with a word missing, and spaced review like any other key. Every lesson has its place in a grid,
   so nothing is missed: an empty lesson shows as a gap until it is filled. A child can follow a book as their Arabic path.

   The format, one line each, a lesson starting with #:
     # 1 هذا
     بَيْتٌ = a house
     ! هذا: this (pointing to something near, masculine)
     > هذا بَيْتٌ. = This is a house.
   A tab or a comma works in place of =, so a spreadsheet of word, meaning pastes in as it is. */
(function () {
  'use strict';
  var A = window.A, C = window.C, M = window.M, $ = A.$, $$ = A.$$, esc = A.esc, L = A.L;
  var B = A.Books = {};

  /* the shapes of the books families ask for. Bayna Yadayk: each part of a level has 8 units of 9 lessons (the publisher's own
     description); a unit is one entry here. Madinah: the number of lessons can be changed to match the edition in hand. */
  B.KINDS = [
    { id: 'madinah1', name: ['Madinah Arabic, Book 1', 'دروس اللغة العربية، الكتاب الأول'], n: 23, unit: ['Lesson', 'الدرس'] },
    { id: 'madinah2', name: ['Madinah Arabic, Book 2', 'دروس اللغة العربية، الكتاب الثاني'], n: 30, unit: ['Lesson', 'الدرس'] },
    { id: 'madinah3', name: ['Madinah Arabic, Book 3', 'دروس اللغة العربية، الكتاب الثالث'], n: 30, unit: ['Lesson', 'الدرس'] },
    { id: 'byd1a', name: ['Al-ʿArabiyyah Bayna Yadayk, Level 1, Part 1', 'العربية بين يديك، المستوى الأول، الجزء الأول'], n: 8, unit: ['Unit', 'الوحدة'] },
    { id: 'byd1b', name: ['Al-ʿArabiyyah Bayna Yadayk, Level 1, Part 2', 'العربية بين يديك، المستوى الأول، الجزء الثاني'], n: 8, unit: ['Unit', 'الوحدة'] },
    { id: 'byd2a', name: ['Al-ʿArabiyyah Bayna Yadayk, Level 2, Part 1', 'العربية بين يديك، المستوى الثاني، الجزء الأول'], n: 8, unit: ['Unit', 'الوحدة'] },
    { id: 'byd2b', name: ['Al-ʿArabiyyah Bayna Yadayk, Level 2, Part 2', 'العربية بين يديك، المستوى الثاني، الجزء الثاني'], n: 8, unit: ['Unit', 'الوحدة'] },
    { id: 'other', name: ['Another book', 'كتاب آخر'], n: 12, unit: ['Lesson', 'الدرس'] }
  ];
  function kindOf(id) { return B.KINDS.filter(function (k) { return k.id === id; })[0] || B.KINDS[B.KINDS.length - 1]; }
  function books() { if (!Array.isArray(A.S.books)) A.S.books = []; return A.S.books; }
  B.list = books;

  /* ---------- reading what a family pastes ---------- */
  B.parse = function (text) {
    var out = [], cur = null;
    String(text || '').split(/\r?\n/).forEach(function (raw) {
      var line = raw.trim(); if (!line) return;
      var h = line.match(/^#+\s*(\d+)?\s*[.:)\-–]?\s*(.*)$/);
      if (h) { cur = { n: h[1] ? +h[1] : out.length + 1, title: h[2] || '', words: [], grammar: [], sents: [] }; out.push(cur); return; }
      if (!cur) { cur = { n: 1, title: '', words: [], grammar: [], sents: [] }; out.push(cur); }
      if (/^!/.test(line)) { cur.grammar.push(line.replace(/^!\s*/, '')); return; }
      var sent = /^>/.test(line); line = line.replace(/^>\s*/, '');
      var parts = line.split(/\s*(?:=|\t)\s*/); if (parts.length < 2 && !sent) parts = line.split(/\s*[,،]\s*/); if (parts.length < 2) parts = [line, ''];
      var a = parts[0].trim(), b = parts.slice(1).join(', ').trim();
      if (!/[؀-ۿ]/.test(a) && /[؀-ۿ]/.test(b)) { var t = a; a = b; b = t; }
      if (!a) return;
      (sent || a.split(/\s+/).length > 2 ? cur.sents : cur.words).push([a, b]);
    });
    return out;
  };
  B.text = function (ls) {
    return (ls || []).filter(function (x) { return filled(x); }).map(function (x) {
      return '# ' + x.n + (x.title ? ' ' + x.title : '') + '\n' + x.words.map(function (w) { return w[0] + ' = ' + w[1]; }).concat(x.grammar.map(function (g) { return '! ' + g; }), x.sents.map(function (s) { return '> ' + s[0] + ' = ' + s[1]; })).join('\n');
    }).join('\n\n');
  };
  function filled(x) { return !!(x && ((x.words && x.words.length) || (x.sents && x.sents.length))); }
  B.filled = filled;

  /* ---------- every book becomes a unit in the Arabic room, every filled lesson a lesson ---------- */
  var made = {};
  B.register = function () {
    if (!C.rooms.arabic || !A.S) return;
    Object.keys(made).forEach(function (uid) { var u = C.units[uid]; if (u) { u.skills.forEach(function (s) { delete C.skills[s.id]; var li = C.list.indexOf(s); if (li >= 0) C.list.splice(li, 1); }); var ri = C.rooms.arabic.units.indexOf(u); if (ri >= 0) C.rooms.arabic.units.splice(ri, 1); delete C.units[uid]; } });
    made = {};
    var keep = C._u;
    books().forEach(function (bk) {
      var uid = 'bk-' + bk.id, kind = kindOf(bk.kind);
      var u = C.unit('arabic', uid, [bk.name, bk.name], 1); u.y = 3; u.book = bk.id; made[uid] = 1;
      var prev = null;
      (bk.lessons || []).slice().sort(function (a, b) { return a.n - b.n; }).forEach(function (ls) {
        if (!filled(ls)) return;
        var id = 'bk.' + bk.id + '.' + ls.n;
        var sk = C.add(id, lessonOf(bk, ls, kind));
        sk.needs = prev ? [prev] : []; sk.y = 3; sk.book = bk.id; prev = id;
      });
    });
    C._u = keep;
  };
  function lessonOf(bk, ls, kind) {
    var W = ls.words.slice(), S = ls.sents.slice();
    var title = [kind.unit[0] + ' ' + ls.n + (ls.title ? ': ' + ls.title : ''), kind.unit[1] + ' ' + String(ls.n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; }) + (ls.title ? ': ' + ls.title : '')];
    var mean = function (w) { return w[1] ? [w[1], w[1]] : [w[0], w[0]]; };
    function askWord(r) {
      if (!W.length) return null;
      var w = r.pick(W), wrong = r.shuffle(W.filter(function (x) { return x !== w && x[0] !== w[0]; })).slice(0, 3);
      if (!wrong.length) return { k: 'say', p: w[1] ? [w[1], w[1]] : ['Say it again.', 'ردّدها.'], big: w[0], bigAr: true };
      return { k: 'choice', p: w[1] ? ['Which word is “' + w[1] + '”?', 'أيّ كلمة معناها «' + w[1] + '»؟'] : ['Find this word', 'جد هذه الكلمة'], o: r.shuffle([{ t: [w[0], w[0]], ar: true, ok: true }].concat(wrong.map(function (x) { return { t: [x[0], x[0]], ar: true, e: 'vocab' }; }))), shuffle: false, cols: 2, large: true, err: 'vocab' };
    }
    function askMeaning(r) {
      var withM = W.filter(function (x) { return x[1]; }); if (withM.length < 2) return askWord(r);
      var w = r.pick(withM), wrong = r.shuffle(withM.filter(function (x) { return x !== w && x[1] !== w[1]; })).slice(0, 3);
      return { k: 'choice', p: ['What does it mean?', 'ما معناها؟'], q: [w[0], w[0]], qAr: true, o: r.shuffle([{ t: mean(w), ok: true }].concat(wrong.map(function (x) { return { t: mean(x), e: 'vocab' }; }))), shuffle: false, cols: 2, err: 'vocab', hint: ['Say it aloud and picture it.', 'قلها بصوت عالٍ وتخيّلها.'] };
    }
    function askGap(r) {
      if (!S.length) return askMeaning(r);
      var s = r.pick(S), toks = s[0].split(/\s+/), cand = toks.map(function (t, i) { return i; }).filter(function (i) { return toks[i].replace(/[^ء-ي]/g, '').length >= 2; });
      if (!cand.length) return askMeaning(r);
      var gi = r.pick(cand), right = toks[gi], pool = [].concat.apply([], S.map(function (x) { return x[0].split(/\s+/); })).concat(W.map(function (w) { return w[0]; }));
      var wrong = r.shuffle(pool.filter(function (t, i, a) { return t !== right && a.indexOf(t) === i && t.replace(/[^ء-ي]/g, '').length >= 2; })).slice(0, 3);
      if (wrong.length < 2) return askMeaning(r);
      var shown = toks.map(function (t, i) { return i === gi ? '……' : t; }).join(' ');
      return { k: 'choice', p: ['Which word fills the gap?', 'أيّ كلمة تملأ الفراغ؟'], q: [shown, shown], qAr: true, o: r.shuffle([{ t: [right, right], ar: true, ok: true }].concat(wrong.map(function (x) { return { t: [x, x], ar: true, e: 'grammar' }; }))), shuffle: false, cols: 2, large: true, err: 'grammar', hint: s[1] ? [s[1], s[1]] : null };
    }
    var practice = function (r) { var f = S.length && r() < .34 ? askGap : r.bool() ? askMeaning : askWord; return f(r) || askGap(r); };
    return {
      title: title, art: 'book', glyph: (W[0] || S[0] || [''])[0], soloN: Math.min(6, Math.max(3, W.length)),
      meet: W.slice(0, 10).map(function (w) { return { k: 'say', p: w[1] ? [w[1], w[1]] : ['Say it after me.', 'ردّدها.'], big: w[0], bigAr: true }; })
        .concat(ls.grammar.map(function (g) { return { k: 'say', p: [g, g], lab: ['The rule', 'القاعدة'] }; }))
        .concat(S.slice(0, 3).map(function (s) { return { k: 'say', p: s[1] ? [s[1], s[1]] : ['Read it aloud.', 'اقرأها بصوت عالٍ.'], big: s[0], bigAr: true }; })),
      guided: function (r) { var withM = W.filter(function (w) { return w[1]; }); return withM.length >= 3 ? [{ k: 'match', p: ['Match each word to its meaning.', 'صِل كل كلمة بمعناها.'], pairs: r.shuffle(withM).slice(0, 4).map(function (w) { return [{ t: [w[0], w[0]], ar: true }, { t: mean(w) }]; }), err: 'vocab' }] : [practice(r)]; },
      solo: practice, review: practice
    };
  }
  /* a child following a book: their Arabic comes from it, in order, before anything else in the room */
  var next0 = C.next;
  C.next = function (room, pid, skip) {
    var p = A.profile(pid);
    if (room === 'arabic' && p && p.arBook) {
      var u = C.units['bk-' + p.arBook];
      if (u) for (var j = 0; j < u.skills.length; j++) { var sk = u.skills[j]; if (skip && skip.indexOf(sk.id) >= 0) continue; if (!M.met(sk.id, pid) && C.open(sk, pid)) return sk; }
    }
    return next0.apply(C, arguments);
  };

  /* ================= the parent's pages ================= */
  function bar(back) { return '<header class="abar"><a class="abtn" href="#/' + (back || 'parent') + '" aria-label="' + esc(L(['Back', 'رجوع'])) + '">' + A.icon('back', 20) + '</a><div class="abar-t"><h1>' + esc(L(['Arabic books', 'كتب العربية'])) + '</h1></div></header>'; }
  function cover(bk) { var n = (bk.lessons || []).length, f = (bk.lessons || []).filter(filled).length; return { n: n, f: f, pct: n ? Math.round(f / n * 100) : 0 }; }
  function listPage() {
    var bs = books();
    var rows = bs.map(function (bk) { var c = cover(bk), who = A.S.profiles.filter(function (p) { return p.arBook === bk.id; }).map(function (p) { return p.name; }); return '<a class="card bk-row" href="#/parent/books/' + esc(bk.id) + '"><span class="grow"><b>' + esc(bk.name) + '</b><small>' + A.num(c.f) + ' / ' + A.num(c.n) + ' ' + esc(L(['ready', 'جاهز'])) + (who.length ? ' · ' + esc(who.join(', ')) : '') + '</small><i class="bk-bar"><em style="width:' + c.pct + '%"></em></i></span>' + A.icon('next', 18) + '</a>'; }).join('');
    var kinds = B.KINDS.map(function (k) { return '<button class="li" data-bk-new="' + k.id + '"><span class="grow"><b>' + esc(L(k.name)) + '</b><small>' + A.num(k.n) + ' ' + esc(L(k.unit[0] === 'Unit' ? ['units', 'وحدات'] : ['lessons', 'دروس'])) + '</small></span>' + A.icon('next', 18) + '</button>'; }).join('');
    return { html: bar() + '<div class="dwrap">' + rows + '<div class="card"><h3>' + esc(L(['Follow a book', 'اتّبع كتابًا'])) + '</h3><div class="lst">' + kinds + '</div></div></div>',
      mount: function (v) { $$('[data-bk-new]', v).forEach(function (b) { b.onclick = function () { var k = kindOf(b.dataset.bkNew), id = 'b' + Date.now().toString(36); var ls = []; for (var i = 1; i <= k.n; i++) ls.push({ n: i, title: '', words: [], grammar: [], sents: [] }); books().push({ id: id, kind: k.id, name: L(k.name), lessons: ls }); A.saveNow(); A.go('parent/books/' + id); }; }); } };
  }
  function bookPage(id) {
    var bk = books().filter(function (b) { return b.id === id; })[0]; if (!bk) return { redirect: 'parent/books' };
    var kind = kindOf(bk.kind), c = cover(bk);
    var grid = bk.lessons.map(function (ls, i) { return '<button class="bk-cell' + (filled(ls) ? ' on' : '') + '" data-ls="' + i + '" aria-label="' + esc(L(kind.unit) + ' ' + ls.n) + '"><b>' + A.num(ls.n) + '</b>' + (filled(ls) ? '<small>' + A.num(ls.words.length + ls.sents.length) + '</small>' : '') + '</button>'; }).join('');
    var kids = A.S.profiles.map(function (p) { var on = p.arBook === bk.id; return '<button class="li" data-follow="' + esc(p.id) + '"><span class="grow"><b>' + esc(p.name) + '</b><small>' + esc(L(on ? ['Their Arabic comes from this book', 'عربيّته من هذا الكتاب'] : ['Not following it', 'لا يتّبعه'])) + '</small></span><span class="switch' + (on ? ' on' : '') + '"></span></button>'; }).join('');
    return {
      html: bar('parent/books') + '<div class="dwrap"><div class="card"><h3>' + esc(bk.name) + '</h3><p class="bk-sum">' + A.num(c.f) + ' / ' + A.num(c.n) + ' ' + esc(L(['ready', 'جاهز'])) + (c.f < c.n ? ' · ' + esc(L(['the outlined ones are still empty', 'المحدّدة ما زالت فارغة'])) : '') + '</p><div class="bk-grid">' + grid + '</div>' +
        '<div class="bk-acts"><button class="btn ghost sm" id="bk-add">' + esc(L(['One more', 'واحد آخر'])) + '</button><button class="btn ghost sm" id="bk-paste">' + esc(L(['Paste a whole book', 'الصق كتابًا كاملًا'])) + '</button><button class="btn ghost sm" id="bk-copy">' + esc(L(['Copy to share', 'انسخه للمشاركة'])) + '</button></div></div>' +
        '<div class="card"><h3>' + esc(L(['Who follows it', 'من يتّبعه'])) + '</h3><div class="lst">' + kids + '</div></div>' +
        '<button class="btn ghost sm bk-del" id="bk-del">' + esc(L(['Remove this book', 'احذف هذا الكتاب'])) + '</button></div>',
      mount: function (v) {
        $$('[data-ls]', v).forEach(function (b) { b.onclick = function () { edit(bk, +b.dataset.ls); }; });
        $$('[data-follow]', v).forEach(function (b) { b.onclick = function () { var p = A.profile(b.dataset.follow); p.arBook = p.arBook === bk.id ? null : bk.id; A.D(p.id).path = null; A.saveNow(); A.rerender(); }; });
        $('#bk-add', v).onclick = function () { bk.lessons.push({ n: bk.lessons.length + 1, title: '', words: [], grammar: [], sents: [] }); A.saveNow(); A.rerender(); };
        $('#bk-paste', v).onclick = function () { paste(bk); };
        $('#bk-copy', v).onclick = function () { var t = B.text(bk.lessons); if (!t) { A.toast(L(['Fill a lesson first', 'املأ درسًا أولًا'])); return; } try { navigator.clipboard.writeText(t).then(function () { A.toast(L(['Copied. Paste it for a friend, or on another device.', 'نُسخ. الصقه لصديق أو في جهاز آخر.'])); }); } catch (e) { } };
        var del = $('#bk-del', v); del.onclick = function () { if (del.dataset.arm !== '1') { del.dataset.arm = '1'; del.textContent = L(['Tap again to remove it', 'انقر مرة أخرى للحذف']); return; } A.S.books = books().filter(function (b) { return b !== bk; }); A.S.profiles.forEach(function (p) { if (p.arBook === bk.id) p.arBook = null; }); B.register(); A.saveNow(); A.go('parent/books'); };
      }
    };
  }
  var EXAMPLE = 'بَيْتٌ = a house\nمَسْجِدٌ = a mosque\n! هذا: this, for a near masculine noun\n> هذا بَيْتٌ. = This is a house.';
  function edit(bk, i) {
    var ls = bk.lessons[i], kind = kindOf(bk.kind);
    var cur = B.text([ls]).split('\n').slice(1).join('\n');
    A.sheet(L(kind.unit) + ' ' + A.num(ls.n), '<p class="bk-help">' + esc(L(['One line each: a word = its meaning. A rule starts with !, a sentence from the book with >.', 'سطر لكل عنصر: الكلمة = معناها. القاعدة تبدأ بـ !، وجملة الكتاب بـ >.'])) + '</p><input class="input" id="bk-t" dir="auto" placeholder="' + esc(L(['Title (optional)', 'العنوان (اختياري)'])) + '" value="' + esc(ls.title || '') + '"><textarea class="input bk-ta" dir="auto" spellcheck="false" placeholder="' + esc(EXAMPLE) + '">' + esc(cur) + '</textarea><button class="btn pri wide" id="bk-save">' + esc(L(['Save', 'احفظ'])) + '</button>', function (sh) {
      $('#bk-save', sh).onclick = function () { var got = B.parse('# ' + ls.n + '\n' + $('.bk-ta', sh).value)[0] || {}; ls.words = got.words || []; ls.grammar = got.grammar || []; ls.sents = got.sents || []; ls.title = $('#bk-t', sh).value.trim(); B.register(); A.saveNow(); A.closeSheet(); A.rerender(); };
    });
  }
  function paste(bk) {
    A.sheet(L(['Paste a whole book', 'الصق كتابًا كاملًا']), '<p class="bk-help">' + esc(L(['Each lesson starts with # and its number. Only the lessons in what you paste are changed.', 'كل درس يبدأ بـ # ورقمه. لا يتغيّر إلا ما في النص من دروس.'])) + '</p><textarea class="input bk-ta big" dir="auto" spellcheck="false" placeholder="' + esc('# 1 هذا\n' + EXAMPLE + '\n\n# 2 …') + '"></textarea><button class="btn pri wide" id="bk-in">' + esc(L(['Bring it in', 'أدخله'])) + '</button>', function (sh) {
      $('#bk-in', sh).onclick = function () {
        var got = B.parse($('.bk-ta', sh).value), n = 0;
        got.forEach(function (g) { if (!filled(g)) return; var at = bk.lessons.filter(function (x) { return x.n === g.n; })[0]; if (!at) { at = { n: g.n }; bk.lessons.push(at); } at.title = g.title; at.words = g.words; at.grammar = g.grammar; at.sents = g.sents; n++; });
        bk.lessons.sort(function (a, b) { return a.n - b.n; });
        B.register(); A.saveNow(); A.closeSheet(); A.toast(L(['Lessons brought in: ', 'دروس أُدخلت: ']) + A.num(n)); A.rerender();
      };
    });
  }
  var par0 = A.V.parent;
  A.V.parent = function (args, r) {
    if (args && args[0] === 'books') { if (A.grownOpen && !A.grownOpen()) return par0(args, r); return args[1] ? bookPage(args[1]) : listPage(); }
    return par0(args, r);
  };
  /* the books live in the family's record: they are turned into lessons whenever the record is loaded (start, a restored backup) */
  var load0 = A.load; A.load = function () { var out = load0.apply(this, arguments); try { B.register(); } catch (e) { console.error(e); } return out; };
  if (A.S) B.register();
})();
