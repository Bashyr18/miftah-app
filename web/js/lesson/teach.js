/* How a topic is really taught, Years 5 to 10: I show you, we do it together, you do it, you explain it.
   One generator is the single source of a topic. g(r, level) returns a problem and its full working, and everything else is drawn from it:

     { q: [en, ar],            the question in words
       eq: '3/4 + 1/8',        optional, the sum to show. Numbers and symbols only
       a: 7,                   the answer: number, '3/4', or for algebra a string with alg: true
       o: [[en,ar], ...],      or a choice instead of a typed answer; the first is right; a row may add its reason as a third item
       s: [step, ...],         the working. step = [noteEn, noteAr, left, answer, right, others]; answer and right are optional.
                             In science a line may be words: left, answer and right as [en, ar], and others the wrong words to choose from,
                             each [en, ar] or [en, ar, whyEn, whyAr] when that wrong word says something worth correcting.
       miss: [[value, en, ar]],  what a particular wrong answer means
       dia: '<svg>' }          optional drawing

   A lesson is C.teach(id, { why, idea: [pages], dia, g, trap, explain, calc }). It becomes two sessions: learn it, then go further. */
(function () {
  'use strict';
  var A = window.A, C = window.C, I = window.I, $ = A.$, $$ = A.$$, esc = A.esc, L = A.L;
  var Teach = window.Teach = {};

  /* maths as it should look: real fractions, the child's digits, always left to right */
  var AD = function (x) { return x && x.length >= 2 ? [x[0], String(x[1]).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; })].concat(x.slice(2)) : x; };
  var FR = /([0-9٠-٩]+|[a-z])\/([0-9٠-٩]+|[a-z])/g;
  var WORDRE = null;
  function arWords(s) {
    if (!A.ar() || !/[A-Za-z]{2}|\b[r]\b/.test(s)) return s;
    var W = C.TM.WORDS;
    if (!WORDRE) WORDRE = new RegExp('(^|[^A-Za-z])(' + Object.keys(W).sort(function (a, b) { return b.length - a.length; }).join('|') + ')(?![A-Za-z])', 'g');
    return s.replace(WORDRE, function (m, pre, w) { return pre + W[w]; });
  }
  Teach.math = function (t) {
    if (Array.isArray(t)) t = L(t);
    /* a number written against a chemical symbol, 2Mg, keeps its Latin digits, as Arabic chemistry books write it */
    var s = arWords(String(t)); s = A.ar() ? s.replace(/(\d+)(?=[A-Z]|e⁻)|\d/g, function (m, co) { return co || '٠١٢٣٤٥٦٧٨٩'[+m]; }) : s;
    return A.bidi(esc(s).replace(FR, function (m, a, b) { return /[a-z]/.test(a) && /[a-z]/.test(b) ? m : '<span class="fr"><i>' + a + '</i><i>' + b + '</i></span>'; }));
  };
  var math = Teach.math;

  function st(x) { return { n: x[0] != null ? AD([x[0], x[1]]) : null, l: x[2] || '', a: x[3], r: x[4] || '', c: x[5] }; }
  var T1 = function (v) { return Array.isArray(v) ? L(AD(v)) : v; };
  function wordy(s) { return Array.isArray(s.l) || Array.isArray(s.a) || Array.isArray(s.r); }
  function full(s) { var l = T1(s.l), a = s.a != null ? T1(s.a) : null, r = T1(s.r); return l + (a != null ? (l ? ' ' : '') + a : '') + (r ? ' ' + r : ''); }
  /* a line of words reads in the child's direction; a line of maths always reads left to right */
  function rowHtml(s, cls, inner) { var w = wordy(s); return '<div class="wl ' + (cls || '') + '">' + (s.n ? '<small>' + esc(L(s.n)) + '</small>' : '') + '<div class="wl-m' + (w ? ' wd' : '') + '" dir="' + (w ? 'auto' : 'ltr') + '">' + inner + '</div></div>'; }
  Teach.lines = function (steps) { return '<div class="wls">' + steps.map(function (x) { var s = st(x); return rowHtml(s, '', math(full(s))); }).join('') + '</div>'; };
  function headHtml(s) { return (s.dia ? '<div class="dia-w">' + s.dia + '</div>' : '') + (s.show ? '<div class="pad-eq wl-eq" dir="ltr">' + math(s.show) + '</div>' : ''); }

  /* I show you: the working unfolds a line at a time, so the child can think about each one before seeing it */
  I.work = function (c) {
    /* a question with choices: the choices first, then the reasoning, then the right one lights up */
    var s = c.step, steps = s.s.map(st), opts = s.opts, shown = opts ? 0 : 1;
    var order = opts ? opts.map(function (o, i) { return i; }) : []; if (opts && c.rng && c.rng.shuffle) order = c.rng.shuffle(order);
    var optH = opts ? '<small class="wk-oh">' + esc(L(['Think about it first, then tap Show me.', 'فكّر أولًا، ثم انقر «أرني».'])) + '</small><div class="wk-o">' + order.map(function (i) { var o = opts[i]; return '<div class="wk-oi" data-o="' + i + '">' + esc(L(AD([o[0], o[1]]))) + '</div>'; }).join('') + '</div>' : '';
    c.el.innerHTML = headHtml(s) + optH + '<div class="wls">' + steps.map(function (x, i) { return '<div data-i="' + i + '"' + (i >= shown ? ' hidden' : '') + '>' + rowHtml(x, '', math(full(x))) + '</div>'; }).join('') + '</div>';
    if (!opts && steps.length < 2) { c.done(); return; }
    var b = document.createElement('button'); b.className = 'btn sec wkx-go'; b.textContent = L(opts ? ['Show me', 'أرني'] : ['Next step', 'الخطوة التالية']);
    c.foot.appendChild(b);
    b.onclick = function () {
      var n = $('[data-i="' + shown + '"]', c.el); if (n) { n.hidden = false; shown++; n.scrollIntoView({ block: 'nearest', behavior: A.reduced() ? 'auto' : 'smooth' }); }
      if (opts) b.textContent = L(['Next step', 'الخطوة التالية']);
      if (shown >= steps.length) {
        b.remove();
        if (opts) { $$('.wk-oi', c.el).forEach(function (e) { e.classList.add(e.dataset.o === '0' ? 'right' : 'dim'); }); }
        c.done();
      }
    };
  };

  /* we do it together: the same working, and the child supplies each missing piece */
  I.along = function (c) {
    var s = c.step, steps = s.s.map(st), val = '', at = -1, finished = false;
    var blanks = []; steps.forEach(function (x, i) { if (x.a != null) blanks.push(i); });
    function paintLines() {
      var cur = blanks[at], last = cur == null ? steps.length - 1 : cur;
      $('.wls', c.el).innerHTML = steps.slice(0, last + 1).map(function (x, i) {
        if (i !== cur) return rowHtml(x, '', math(full(x)));
        return rowHtml(x, 'now', math(T1(x.l)) + ' <b class="pad-out">' + (val === '' ? '?' : esc(A.num(val.replace(/-/g, '−')))) + '</b>' + (x.r ? ' ' + math(T1(x.r)) : ''));
      }).join('');
      var n = $('.wl.now', c.el); if (n) n.scrollIntoView({ block: 'nearest' });
    }
    var R = c.rng && c.rng.shuffle ? c.rng : null, input = null;
    function onPad(d) {
      if (finished) return;
      if (d === 'go') {
        if (val === '') return;
        if (I.padSame(val, steps[blanks[at]].a)) { Fx.tap(); next(); }
        else { val = ''; paintLines(); c.bad(s.err, $('.pad-out', c.el)); }
        return;
      }
      val = I.padKey(val, d); paintLines();
    }
    /* a missing word is chosen; a missing number is typed */
    function ask() {
      var x = steps[blanks[at]], box = $('.al-in', c.el);
      if (!Array.isArray(x.a)) { if (input !== 'pad') { box.innerHTML = I.padHtml(true); I.padBind(box, onPad); input = 'pad'; } return; }
      input = 'word';
      var opts = [{ t: x.a, ok: true }].concat((x.c || []).map(function (o) { return { t: o, why: o[2] ? AD([o[2], o[3]]) : undefined }; }));
      opts = R ? R.shuffle(opts) : opts;
      box.innerHTML = '<div class="al-o">' + opts.map(function (o, i) { return '<button class="opt al-c" data-i="' + i + '">' + esc(L(AD(o.t))) + '</button>'; }).join('') + '</div>';
      $$('.al-c', box).forEach(function (b) {
        b.onclick = function () {
          if (finished || b.disabled) return; var o = opts[+b.dataset.i];
          if (o.ok) { Fx.tap(); next(); } else { b.disabled = true; b.classList.add('not-it'); c.bad(s.err, b, o.why); }
        };
      });
    }
    function next() { at++; val = ''; if (at >= blanks.length) { finished = true; var p = $('.al-in', c.el); if (p) p.remove(); paintLines(); c.ok($('.wls', c.el), { delay: 900 }); return; } paintLines(); ask(); }
    c.el.innerHTML = headHtml(s) + '<div class="wls"></div><div class="al-in"></div>';
    c.onReveal(function () { finished = true; at = blanks.length; var p = $('.al-in', c.el); if (p) p.remove(); $('.wls', c.el).innerHTML = steps.map(function (x) { return rowHtml(x, '', math(full(x))); }).join(''); });
    next();
  };

  /* find the mistake: someone else's working, one line is wrong. Finding it teaches more than being told. */
  I.spot = function (c) {
    var s = c.step;
    c.el.innerHTML = headHtml(s) + '<div class="sps">' + s.l.map(function (t, i) { return '<button class="sp-l" data-i="' + i + '" dir="ltr">' + math(t) + '</button>'; }).join('') + '</div>';
    var rows = $$('.sp-l', c.el);
    rows.forEach(function (b) {
      b.onclick = function () {
        if (b.disabled) return;
        if (+b.dataset.i === s.w) { b.classList.add('wrong-found'); rows.forEach(function (x) { x.disabled = true; }); c.ok(b, { note: s.why }); }
        else { b.classList.add('not-it'); b.disabled = true; c.bad(s.err, b); }
      };
    });
    c.onReveal(function () { rows.forEach(function (x) { x.disabled = true; }); rows[s.w].classList.add('wrong-found'); });
  };

  /* after three tries: the whole working for this exact question, not a generic sentence */
  Teach.reveal = function (c, s) {
    var p = $('.pad', c.el); if (p) p.remove(); p = $('.al-in', c.el); if (p) p.remove();
    /* the answer box shows the answer too, not a question mark left hanging */
    var o = $('.pad-out', c.el); if (o && s.a != null && !Array.isArray(s.a)) setTimeout(function () { o.textContent = A.num(String(s.a).replace(/-/g, '−')); o.classList.add('filled', 'shown'); }, 40);
    var old = $('.wls', c.el); if (old) return;
    c.el.insertAdjacentHTML('beforeend', Teach.lines(s.workS));
  };

  var LAB = { work: ['Watch', 'شاهد'], along: ['Together', 'معًا'], you: ['Your turn', 'دورك'], spot: ['Find the mistake', 'اكتشف الخطأ'], explain: ['Explain', 'اشرح'], why: ['Why this matters', 'لماذا يهمّ هذا'], idea: ['The idea', 'الفكرة'], back: ['Last time', 'في المرة السابقة'] };

  function missFn(miss) {
    if (!miss || !miss.length) return null;
    return function (v) { for (var i = 0; i < miss.length; i++) if (I.padSame(v, miss[i][0])) return AD([miss[i][1], miss[i][2]]); return null; };
  }
  /* the question itself, typed or chosen */
  Teach.ask = function (P, noCalc) {
    var first = (P.s || []).map(st).filter(function (x) { return x.n; })[0];
    var base = { p: AD(P.q), err: 'understanding', ev: 'recall', lab: LAB.you, workS: P.s, noCalc: noCalc, hint: first ? first.n : undefined };
    if (P.o) return Object.assign(base, { k: 'choice', ev: 'recognition', cols: 1, shuffle: true, qHtml: (P.dia || '') + (P.eq ? '<div class="pad-eq wl-eq" dir="ltr">' + math(P.eq) + '</div>' : '') || undefined, o: P.o.map(function (x, i) { return { t: AD([x[0], x[1]]), ok: i === 0, why: x[2] ? AD([x[2], x[3]]) : undefined }; }) });
    if (P.alg) return Object.assign(base, { k: 'expr', a: P.a, eq: P.eq, html: P.dia });
    return Object.assign(base, { k: 'pad', a: P.a, eq: P.eq, html: P.dia, allKeys: true, exact: P.exact, missOf: missFn(P.miss) });
  };
  function showStep(P) { return { k: 'work', p: AD(P.q), show: P.eq, dia: P.dia, s: P.s, opts: P.o, lab: LAB.work, silent: true }; }
  /* when the working has no gap of its own, the child draws the conclusion: the question's options become the missing words */
  function gapped(P) { if (!P.o || (P.s || []).some(function (x) { return x[3] != null; })) return P.s; return (P.s || []).concat([['So', 'إذن', '', [P.o[0][0], P.o[0][1]], '', P.o.slice(1).map(function (o) { return o[2] ? [o[0], o[1], o[2], o[3]] : [o[0], o[1]]; })]]); }
  function alongStep(P) { return { k: 'along', p: AD(P.q), show: P.eq, dia: P.dia, s: gapped(P), err: 'understanding', lab: LAB.along, silent: true, hint: P.s && st(P.s[0]).n ? st(P.s[0]).n : undefined }; }
  function spotStep(tr) { return { k: 'spot', p: tr.q ? AD(tr.q) : ['One line is wrong. Tap it.', 'سطر واحد خاطئ. انقر عليه.'], show: tr.eq, l: tr.l, w: tr.w, why: AD(tr.why), err: 'understanding', lab: LAB.spot, ev: 'recognition', silent: true }; }
  function explainStep(x) { return { k: 'choice', p: x[0], cols: 1, shuffle: true, err: 'understanding', ev: 'recognition', lab: LAB.explain, o: x.slice(1).map(function (t, i) { return { t: t, ok: i === 0 }; }) }; }

  C.teach = function (id, sp) {
    var sk = C.skills[id]; if (!sk) throw new Error('teach: no such lesson ' + id);
    var g = sp.g, noCalc = !sp.calc, others = [];
    /* a simulation already in the lesson stays in it. Old text pages are replaced, unless asked to keep them (rulings are not rewritten here) */
    var m0 = sk.meet; if (m0 && typeof m0 !== 'function') (Array.isArray(m0) ? m0 : [m0]).forEach(function (s) { if (s.k !== 'say' || sp.keep) others.push(s); });
    var why = sp.why, ideas = sp.idea || [];
    function pages(r) {
      var out = []; if (why) out.push({ k: 'say', p: why, art: sk.art, tag: LAB.why, silent: true });
      ideas.forEach(function (p, i) { var pg = Array.isArray(p) ? { p: p } : p; out.push({ k: 'say', p: pg.p, dia: typeof pg.dia === 'function' ? pg.dia(r) : pg.dia, tag: i === 0 ? LAB.idea : undefined, silent: true }); });
      return out;
    }
    var ask = function (r, lv) { return Teach.ask(g(r, lv), noCalc); };
    sk.meet = function (r) { return pages(r).concat(others, [showStep(g(r, 1))]); };
    sk.name = undefined;
    sk.guided = function (r) { return [alongStep(g(r, 1))]; };
    var ladder = [1, 1, 2, 2, 2];
    sk.soloN = ladder.length;
    sk.solo = function (r, i) { return ask(r, ladder[i % ladder.length]); };
    sk.review = function (r) { return ask(r, r.pick([1, 2, 2, 3])); };
    sk.teach = true; sk.mins = 12;

    /* the second session: harder, in context, then the mistake to find and the idea to explain */
    var id2 = id + '.p2', u = C.units[sk.unit], ladder2 = [2, 3, 3, 3, 3, 3];
    var sk2 = {
      id: id2, room: sk.room, unit: sk.unit, band: sk.band, needs: [id], art: sk.art, teach: true, mins: 12, part2: id, noRecall: true,
      title: [L0(sk.title) + ': further', L1(sk.title) + ': خطوة أبعد'],
      meet: function (r) { var o = []; if (ideas[0]) { var f = Array.isArray(ideas[0]) ? { p: ideas[0] } : ideas[0]; o.push({ k: 'say', p: f.p, dia: typeof f.dia === 'function' ? f.dia(r) : f.dia, tag: LAB.back, silent: true }); } o.push(showStep(g(r, 3))); return o; },
      guided: function (r) { return [alongStep(g(r, 3))]; },
      soloN: ladder2.length,
      solo: function (r, i) { return ask(r, ladder2[i % ladder2.length]); },
      review: function (r) { return ask(r, r.pick([2, 3, 3])); },
      make: function (r) { var o = []; if (sp.trap) o.push(spotStep(sp.trap(r))); if (sp.explain) o.push(explainStep(sp.explain)); return o; }
    };
    if (sp.mission) sk2.make = (function (m0) { return function (r) { return m0(r).concat([{ k: 'mission', art: sk.art, t: sp.mission }]); }; })(sk2.make);
    C.skills[id2] = sk2;
    var iu = u.skills.indexOf(sk), next = u.skills[iu + 1];
    u.skills.splice(iu + 1, 0, sk2);
    C.list.splice(C.list.indexOf(sk) + 1, 0, sk2);
    if (next && next.needs) next.needs = next.needs.map(function (n) { return n === id ? id2 : n; });
    return sk;
  };
  function L0(t) { return Array.isArray(t) ? t[0] : t; }
  function L1(t) { return Array.isArray(t) ? t[1] : t; }
})();
