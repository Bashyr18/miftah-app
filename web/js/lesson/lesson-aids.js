/* What sits beside a child's work: look back at the lesson, a place to do working, a calculator, worked examples that unfold a step at a time, and an honest reason when an answer was wrong. */
(function () {
  'use strict';
  var A = window.A, $ = A.$, $$ = A.$$, esc = A.esc, L = A.L, I = window.I, C = window.C;
  var Aids = window.Aids = {};
  var GENERIC = /^Think back to what you just read/;
  Aids.generic = function (h) { return !h || GENERIC.test(h[0] || h); };
  function pagesOf(meet, rng) {
    var m = typeof meet === 'function' ? meet(rng || A.rng(1)) : meet; if (!m) return [];
    return (Array.isArray(m) ? m : [m]).filter(function (s) { return s && (s.k === 'say' || s.k === 'work') && s.p; });
  }
  /* the teaching behind this question: from this run, or from the lesson the question belongs to */
  Aids.pages = function (run) {
    var here = run.o.steps.filter(function (s) { return (s.k === 'say' || s.k === 'work') && s.p; });
    if (here.length) return here;
    var sk = C.skill(run.o.skill || (run.step && run.step.skill));
    return sk ? pagesOf(sk.meet) : [];
  };
  function clean(p) { return L(p).replace(/^Worked:\s*/, '').replace(/^مثال محلول:\s*/, ''); }
  var ICON = {
    book: '<svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.500 3H20v15H6.500A2.500 2.500 0 0 0 4 20.500z"/><path d="M4 20.500A2.500 2.500 0 0 0 6.500 21H20v-3"/></svg>',
    pen: '<svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/></svg>',
    calc: '<svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.500"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>'
  };
  function lookBack(run) {
    var s = run.step, pages = Aids.pages(run);
    /* looking back is allowed, and honest: this question will not count as unaided */
    if (s && (s.ph === 'solo' || s.ph === 'make')) run.hinted = true;
    var hint = s && !Aids.generic(s.hint) ? '<div class="lb-hint">' + esc(L(s.hint)) + '</div>' : '';
    A.sheet(L(['Look back', 'راجع الدرس']), '<div class="lb">' + hint + (pages.map(function (p) { return (p.k === 'work' ? '<p class="lb-q">' : '<p>') + esc(clean(p.p)) + '</p>' + (p.k === 'work' && p.show ? '<div class="pad-eq wl-eq" dir="ltr">' + Teach.math(p.show) + '</div>' : '') + (p.k === 'work' ? Teach.lines(p.s) : (p.dia || '')); }).join('') || '<p>' + esc(L(['There is no page to look back at for this one.', 'لا توجد صفحة لهذا السؤال.'])) + '</p>') + '</div>');
  }
  /* a page for working, kept until the next question */
  var ink = null;
  function working() {
    A.sheet(L(['Working', 'مساحة الحل']), '<canvas class="wk-pad" id="wk-c"></canvas><div class="trow" style="margin-top:8px"><button class="btn sec" id="wk-x">' + esc(L(['Clear', 'مسح'])) + '</button></div>', function (sh) {
      var c = $('#wk-c', sh), r = c.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); c.width = r.width * dpr; c.height = r.height * dpr;
      var g = c.getContext('2d'); g.scale(dpr, dpr); g.lineWidth = 2.4; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = getComputedStyle(document.body).color;
      if (ink) { var im = new Image(); im.onload = function () { g.drawImage(im, 0, 0, r.width, r.height); }; im.src = ink; }
      var on = false, at = function (e) { var b = c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
      c.onpointerdown = function (e) { on = true; c.setPointerCapture(e.pointerId); var q = at(e); g.beginPath(); g.moveTo(q[0], q[1]); e.preventDefault(); };
      c.onpointermove = function (e) { if (!on) return; var q = at(e); g.lineTo(q[0], q[1]); g.stroke(); };
      c.onpointerup = c.onpointercancel = function () { on = false; try { ink = c.toDataURL(); } catch (x) { } };
      $('#wk-x', sh).onclick = function () { g.clearRect(0, 0, r.width, r.height); ink = null; };
    });
  }
  /* a plain calculator */
  function calc() {
    var keys = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '=', '+', 'C', '√', 'x²', '±'];
    A.sheet(L(['Calculator', 'الآلة الحاسبة']), '<div class="clc" dir="ltr"><output id="cl-o">0</output><div class="clc-k">' + keys.map(function (k) { return '<button data-c="' + k + '"' + (/[=]/.test(k) ? ' class="on"' : '') + '>' + k + '</button>'; }).join('') + '</div></div>', function (sh) {
      var o = $('#cl-o', sh), cur = '0', mem = null, op = null, fresh = true;
      var show = function () { o.textContent = cur; };
      var calcNow = function () { if (op == null || mem == null) return; var a = mem, b = parseFloat(cur), v = op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : b === 0 ? NaN : a / b; cur = isNaN(v) ? 'Error' : String(+v.toFixed(10)); mem = null; op = null; };
      $$('[data-c]', sh).forEach(function (b) { b.onclick = function () {
        var k = b.dataset.c;
        if (/^\d$/.test(k)) { cur = fresh || cur === '0' || cur === 'Error' ? k : cur + k; fresh = false; }
        else if (k === '.') { if (fresh) { cur = '0.'; fresh = false; } else if (cur.indexOf('.') < 0) cur += '.'; }
        else if (k === 'C') { cur = '0'; mem = null; op = null; fresh = true; }
        else if (k === '±') cur = String(-parseFloat(cur) || 0);
        else if (k === '√') { cur = parseFloat(cur) < 0 ? 'Error' : String(+Math.sqrt(parseFloat(cur)).toFixed(10)); fresh = true; }
        else if (k === 'x²') { cur = String(+Math.pow(parseFloat(cur), 2).toFixed(10)); fresh = true; }
        else if (k === '=') { calcNow(); fresh = true; }
        else { calcNow(); mem = parseFloat(cur); op = k; fresh = true; }
        show();
      }; });
    });
  }
  A.acts['aid-back'] = function () { var r = Aids.run; if (r) lookBack(r); };
  A.acts['aid-work'] = function () { working(); };
  A.acts['aid-calc'] = function () { calc(); };

  function usesNumbers(run) {
    var s = run.step, sk = C.skill(run.o.skill || (s && s.skill)); if (!sk) return false;
    return /^(math|science|engineering)$/.test(sk.room) && (sk.y || 0) >= 7;
  }
  /* the row of aids under a question, from eight years old */
  Aids.after = function (run, foot) {
    Aids.run = run; ink = null;
    var s = run.step, st = run.st;
    if (st < 2 || !s || s.k === 'say' || s.k === 'work' || s.k === 'sim' || s.k === 'mission' || s.k === 'body' || s.k === 'watch' || s.k === 'write') return;
    var tb = function (a, ic, t) { return '<button class="aid" data-a="' + a + '" aria-label="' + esc(L(t)) + '">' + ICON[ic] + '<span>' + esc(L(t)) + '</span></button>'; };
    var h = (run.o.exam ? '' : tb('aid-back', 'book', ['Look back', 'راجع'])) + (s.k === 'pad' || s.k === 'expr' ? tb('aid-work', 'pen', ['Working', 'الحل']) : '') + (usesNumbers(run) && !s.noCalc && (s.k === 'pad' || s.k === 'expr') ? tb('aid-calc', 'calc', ['Calculator', 'الحاسبة']) : '');
    if (h) foot.insertAdjacentHTML('afterbegin', '<div class="aids">' + h + '</div>');
  };
  /* when the answer has been shown: why, from the lesson itself */
  Aids.why = function (run) {
    var ps = Aids.pages(run).filter(function (x) { return x.k === 'say'; }); if (!ps.length || run.st < 2) return '';
    var p = ps[ps.length - 1];
    return '<div class="pl-why"><small>' + esc(L(['From the lesson', 'من الدرس'])) + '</small>' + esc(clean(p.p)) + '</div>';
  };

  /* Teaching pages from age 8 up. Text is structure, not a paragraph: the first sentence is the idea, an equation
     stands on its own plate, and a worked example unfolds one line at a time so the child thinks before reading on. */
  var WORKED = /^(Worked:|مثال محلول:)\s*/;
  var EQ = /^[A-Za-z0-9²³°Ωπ()\/×÷·+\-−√., ]{1,30}=[A-Za-z0-9²³°Ωπ()\/×÷·+\-−√.,% ]{1,40}\.?$/;
  /* sentences, without being fooled by e.g. or 0.5 */
  function sentences(t) {
    var parts = t.replace(/([.!?؟])\s+/g, '$1\n').split('\n'), out = [];
    parts.forEach(function (p) {
      if (out.length && /(^|\s)(e\.g\.|i\.e\.|etc\.|vs\.)$/.test(out[out.length - 1])) out[out.length - 1] += ' ' + p;
      else if (p) out.push(p);
    });
    return out;
  }
  function line(l, cls) {
    return EQ.test(l) ? '<p class="tch-eq" dir="ltr">' + esc(l.replace(/\.$/, '')) + '</p>' : '<p class="' + cls + '">' + esc(l) + '</p>';
  }
  function titleOf(c) { var sk = c.skillId && C.skill(c.skillId); return sk && sk.title ? L(sk.title) : ''; }

  var say0 = I.say;
  I.say = function (c) {
    var s = c.step, t = s.p && L(s.p);
    if (c.stage < 2 || !t || s.html || s.arts || s.bigAr || s.t || s.mount || s.from || s.noPrompt) return say0(c);
    var host = c.el.closest('.pl'), pr = host && $('.pl-p', host);
    var worked = WORKED.test(t), lines = sentences(t.replace(WORKED, ''));
    if (worked && lines.length >= 2) {
      if (pr) pr.textContent = L(['Worked example', 'مثال محلول']);
      c.el.innerHTML = '<div class="wkx">' + lines.map(function (l, i) { return '<p class="wkx-l" data-i="' + i + '"' + (i ? ' hidden' : '') + '><i>' + A.num(i + 1) + '</i><span' + (EQ.test(l) ? ' dir="ltr"' : '') + '>' + esc(l) + '</span></p>'; }).join('') + '</div>';
      var shown = 1, b = document.createElement('button'); b.className = 'btn sec wkx-go'; b.textContent = L(['Next step', 'الخطوة التالية']);
      c.foot.appendChild(b);
      b.onclick = function () { var n = $('.wkx-l[data-i="' + shown + '"]', c.el); if (n) { n.hidden = false; shown++; } if (shown >= lines.length) { b.remove(); c.done(); } };
      return;
    }
    var title = titleOf(c);
    if (pr) { if (title) pr.textContent = title; else pr.remove(); }
    c.el.innerHTML = '<div class="tch">' + (s.tag ? '<small class="tch-tag">' + esc(L(s.tag)) + '</small>' : '') + (s.art ? '<div class="tch-art">' + A.art(s.art, 84) + '</div>' : '') + (s.dia ? '<div class="dia-w">' + s.dia + '</div>' : '') + (s.big ? '<p class="tch-eq" dir="ltr">' + esc(s.big) + '</p>' : '') +
      lines.map(function (l, i) { return line(l, i ? 'tch-l' : 'tch-key'); }).join('') + '</div>';
    c.done();
  };
  /* a sound the app cannot play yet: a grown-up becomes the voice, and the screen says so */
  Aids.silent = function (s) {
    if (!s || s.k !== 'say' || !s.sound || !window.Voice) return false;
    var kw = C.KEYW && C.KEYW[s.sound];
    return !(Voice.hasVoice('ph_' + s.sound) || (kw && Voice.can(kw[0], { lang: 'en' })));
  };
})();
