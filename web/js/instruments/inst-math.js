/* Maths instruments: concrete, then pictorial, then abstract. Each one shows the mechanism, and a wrong move is informative. */
(function () {
  'use strict';
  var A = window.A, $ = A.$, $$ = A.$$, esc = A.esc, L = A.L, T = A.T, I = window.I;
  var N = function (x) { return A.num(x); };

  function numOpts(rng, a, lo, hi, n, e) {
    var set = [a], tries = 0;
    while (set.length < (n || 3) && tries++ < 40) { var v = Math.max(lo, Math.min(hi, a + rng.int(-3, 3))); if (set.indexOf(v) < 0) set.push(v); }
    for (var k = lo; set.length < (n || 3) && k <= hi; k++) if (set.indexOf(k) < 0) set.push(k);
    return rng.shuffle(set).map(function (v) { return { v: v, ok: v === a, e: e }; });
  }
  I.numOpts = numOpts;
  function numRow(c, opts, onPick) {
    var row = document.createElement('div'); row.className = 'numrow';
    row.innerHTML = opts.map(function (o, i) { return '<button class="numopt" data-i="' + i + '">' + N(o.v) + '</button>'; }).join('');
    c.el.appendChild(row);
    $$('.numopt', row).forEach(function (b) {
      b.onclick = function () {
        var o = opts[+b.dataset.i];
        if (o.ok) { b.classList.add('right'); $$('.numopt', row).forEach(function (x) { x.disabled = true; }); onPick && onPick(); c.ok(b); }
        else { b.disabled = true; b.classList.add('wrong'); c.bad(o.e, b); }
      };
    });
    c.onReveal(function () { $$('.numopt', row).forEach(function (b) { b.disabled = true; if (opts[+b.dataset.i].ok) b.classList.add('right'); }); });
    return row;
  }
  I.numRow = numRow;

  /* touch each one and count aloud: one number for one object */
  I.plate = function (c) {
    var s = c.step, n = s.n, obj = s.obj || 'date', counted = 0;
    var spots = layout(n, c.rng);
    c.el.innerHTML = '<div class="plate"><div class="plate-dish"></div>' + spots.map(function (p, i) { return '<button class="pl-obj" data-i="' + i + '" style="left:' + p[0] + '%;top:' + p[1] + '%">' + A.art(obj, 58) + '<b></b></button>'; }).join('') + '</div><div class="plate-count" aria-live="polite">&nbsp;</div>';
    var out = $('.plate-count', c.el);
    $$('.pl-obj', c.el).forEach(function (b) {
      b.onclick = function () {
        if (b.classList.contains('on')) return;
        counted++; b.classList.add('on'); $('b', b).textContent = N(counted); out.textContent = N(counted); Fx.pop(b); Fx.tap();
        Voice.say(A.ar() ? N(counted) : String(counted), { lang: A.ar() ? 'ar' : 'en', rate: 1.05 });
        if (counted === n) {
          if (s.noAsk) { c.ok(out, { delay: 700 }); return; }
          setTimeout(function () { numRow(c, numOpts(c.rng, n, Math.max(0, n - 3), n + 3, 3, 'count-skip')); }, 350);
        }
      };
    });
  };
  function layout(n, rng) {
    var cols = n <= 3 ? n : n <= 6 ? 3 : n <= 12 ? 4 : 5, rows = Math.ceil(n / cols), out = [];
    for (var i = 0; i < n; i++) {
      var r = Math.floor(i / cols), cc = i % cols, inRow = r === rows - 1 ? n - r * cols : cols;
      out.push([50 + (cc - (inRow - 1) / 2) * (72 / Math.max(cols, 1.8)) + rng.int(-2, 2), 50 + (r - (rows - 1) / 2) * (66 / Math.max(rows, 1.8)) + rng.int(-2, 2)]);
    }
    return out;
  }

  /* the ten-frame: the shape of ten */
  function frames(n, cells, obj, tag) {
    var out = '';
    for (var f = 0; f < cells; f += 10) {
      out += '<div class="tf">';
      for (var i = f; i < f + 10; i++) out += '<button class="tf-c' + (i < n ? ' on' : '') + '" data-i="' + i + '" ' + (tag || '') + '>' + (i < n ? '<span class="tf-o">' + A.art(obj, 34) + '</span>' : '') + '</button>';
      out += '</div>';
    }
    return out;
  }
  I.frames = frames;
  I.tenframe = function (c) {
    var s = c.step, obj = s.obj || 'date', cells = s.n > 10 || s.cells > 10 ? 20 : 10;
    if (s.mode === 'flash') {
      c.el.innerHTML = '<div class="tfs">' + frames(s.n, cells, obj) + '</div>';
      var box = $('.tfs', c.el);
      setTimeout(function () { box.classList.add('hide'); numRow(c, numOpts(c.rng, s.n, 0, cells, 3, 'count-skip')); }, s.ms || 1600);
      return;
    }
    var cnt = s.start || 0;
    c.el.innerHTML = '<div class="tfs">' + frames(cnt, cells, obj) + '</div><div class="tf-n">' + N(cnt) + '</div><div class="tf-go"><button class="btn pri big">' + A.icon('check', 22) + '<span>' + esc(T('Check')) + '</span></button></div>';
    var cellsEl = $$('.tf-c', c.el), out = $('.tf-n', c.el);
    function set(k) {
      cnt = Math.max(0, Math.min(cells, k));
      cellsEl.forEach(function (b, i) {
        var on = i < cnt;
        if (on && !b.classList.contains('on')) { b.classList.add('on'); b.innerHTML = '<span class="tf-o drop">' + A.art(obj, 34) + '</span>'; }
        if (!on && b.classList.contains('on')) { b.classList.remove('on'); b.innerHTML = ''; }
      });
      out.textContent = N(cnt);
    }
    cellsEl.forEach(function (b, i) { b.onclick = function () { set(b.classList.contains('on') && i === cnt - 1 ? cnt - 1 : cnt + 1); Fx.tap(); }; });
    $('.tf-go button', c.el).onclick = function () {
      if (cnt === s.n) c.ok(out); else c.bad('count-skip', $('.tfs', c.el));
    };
    c.onReveal(function () { set(s.n); $('.tf-go', c.el).style.display = 'none'; });
  };

  /* part, part, whole: slide the split along the beads */
  I.bond = function (c) {
    var s = c.step, w = s.whole, cut = s.show != null ? s.show : Math.ceil(w / 2);
    function paint() {
      var beads = ''; for (var i = 0; i < w; i++) beads += '<i class="bd' + (i < cut ? ' a' : ' b') + '"></i>' + (i === cut - 1 ? '<u class="bd-cut"></u>' : '');
      return beads;
    }
    c.el.innerHTML = '<div class="bond"><div class="bond-top"><span class="bond-c w">' + N(w) + '</span></div><svg class="bond-l" viewBox="0 0 200 40"><path d="M100 0L46 40M100 0l54 40" stroke="currentColor" stroke-width="3" fill="none"/></svg><div class="bond-row"><span class="bond-c a">' + N(s.part) + '</span><span class="bond-c b">?</span></div><div class="beads" dir="ltr">' + paint() + '</div></div>';
    $('.beads', c.el).innerHTML = '';
    for (var i = 0; i < w; i++) { var b = document.createElement('i'); b.className = 'bd ' + (i < s.part ? 'a' : 'b'); b.style.setProperty('--i', i); $('.beads', c.el).appendChild(b); }
    numRow(c, numOpts(c.rng, w - s.part, 0, w, 3, s.err || 'add-count'), function () { $('.bond-c.b', c.el).textContent = N(w - s.part); });
  };

  /* the number line: hop to the answer */
  I.line = function (c) {
    var s = c.step, max = s.max || 10, from = s.from, to = s.to;
    /* a long line on a narrow screen: show ten steps around the question, with room on both sides of the start and the answer,
       so every number stays big enough to read and to touch. The faded ends say the line goes on. */
    var lo = 0, hi = max, narrow = (c.el.clientWidth || innerWidth) < 560;
    if (max > 12 && narrow) {
      var a0 = Math.min(from, to), b0 = Math.max(from, to), span = b0 - a0 <= 7 ? 10 : 12;
      if (b0 - a0 + 3 <= span) { lo = Math.max(0, Math.min(a0 - 2 - ((from + to) % 2), max - span)); hi = lo + span; }
    }
    var at = function (v) { return ((v - lo) / (hi - lo) * 100) + '%'; };
    var ticks = ''; for (var i = lo; i <= hi; i++) ticks += '<button class="nl-t' + (i === from ? ' at' : '') + '" data-v="' + i + '" style="left:' + at(i) + '"><b>' + N(i) + '</b></button>';
    c.el.innerHTML = '<div class="nl-eq" dir="ltr">' + N(from) + ' ' + (s.op || (to >= from ? '+' : '−')) + ' ' + N(Math.abs(to - from)) + ' = ?</div><div class="nl' + (hi - lo > 12 ? ' dense' : '') + (lo > 0 ? ' cut-l' : '') + (hi < max ? ' cut-r' : '') + '" dir="ltr"><div class="nl-rail"></div>' + ticks + '<div class="nl-tok" style="left:' + at(from) + '">' + A.art('key', 30) + '</div></div>';
    var tok = $('.nl-tok', c.el);
    function hopTo(v, cb) {
      var cur = from, dir = v > from ? 1 : -1, i = 0, steps = Math.abs(v - from);
      function one() {
        if (i++ >= steps) { cb(); return; }
        cur += dir;
        var a = tok.style.left; var b = at(cur);
        tok.style.left = b; Fx.tap();
        if (!A.reduced()) tok.animate([{ left: a, transform: 'translate(-50%,0)' }, { transform: 'translate(-50%,-26px)', offset: .5 }, { left: b, transform: 'translate(-50%,0)' }], { duration: 240, easing: 'ease-in-out' });
        setTimeout(one, 260);
      }
      one();
    }
    var busy = false;
    $$('.nl-t', c.el).forEach(function (b) {
      b.onclick = function () {
        if (busy) return;
        var v = +b.dataset.v;
        if (v === from) return;
        busy = true;
        hopTo(v, function () {
          if (v === to) { b.classList.add('right'); busy = true; c.ok(b); }
          else {
            var goesWrongWay = (to > from) !== (v > from);
            c.bad(goesWrongWay ? 'sub-add' : 'add-count', b);
            setTimeout(function () { tok.style.left = at(from); busy = false; }, 500);
          }
        });
      };
    });
    c.onReveal(function () { tok.style.left = at(to); var r = $('.nl-t[data-v="' + to + '"]', c.el); if (r) r.classList.add('right'); busy = true; });
  };

  /* base-ten blocks: bundling made visible */
  I.blocks = function (c) {
    var s = c.step, H = 0, Te = 0, O = 0, hasH = s.n >= 100;
    c.el.innerHTML = '<div class="bl-n" dir="ltr">' + N(s.n) + '</div><div class="bl-area" dir="ltr"></div><div class="bl-btns" dir="ltr">' + (hasH ? '<button class="blb" data-t="h"><i class="bl-h"></i><span>' + esc(T('Hundred')) + '</span></button>' : '') + '<button class="blb" data-t="t"><i class="bl-t"></i><span>' + esc(T('Ten')) + '</span></button><button class="blb" data-t="o"><i class="bl-o"></i><span>' + esc(T('One')) + '</span></button></div><div class="bl-read" dir="ltr"></div><div class="tf-go"><button class="btn pri big">' + A.icon('check', 22) + '<span>' + esc(T('Check')) + '</span></button></div>';
    var area = $('.bl-area', c.el), read = $('.bl-read', c.el);
    function paint() {
      var h = '', rm = A.L(['Remove ', 'إزالة ']), lh = esc(rm + T('Hundred')), lt = esc(rm + T('Ten')), lo = esc(rm + T('One')); var i;
      for (i = 0; i < H; i++) h += '<i class="bl-h" tabindex="0" role="button" data-t="h" aria-label="' + lh + '"></i>';
      for (i = 0; i < Te; i++) h += '<i class="bl-t" tabindex="0" role="button" data-t="t" aria-label="' + lt + '"></i>';
      for (i = 0; i < O; i++) h += '<i class="bl-o" tabindex="0" role="button" data-t="o" aria-label="' + lo + '"></i>';
      area.innerHTML = h || '<span class="bl-empty">&nbsp;</span>';
      read.textContent = N(H * 100 + Te * 10 + O);
      $$('i', area).forEach(function (el) {
        var rmOne = function () { var t = el.dataset.t; if (t === 'h') H--; if (t === 't') Te--; if (t === 'o') O--; Fx.tap(); paint(); };
        el.onclick = rmOne;
        el.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rmOne(); } };
      });
    }
    $$('.blb', c.el).forEach(function (b) { b.onclick = function () { var t = b.dataset.t; if (t === 'h' && H < 9) H++; if (t === 't' && Te < 9) Te++; if (t === 'o' && O < 9) O++; Fx.tap(); paint(); }; });
    paint();
    $('.tf-go button', c.el).onclick = function () {
      if (H * 100 + Te * 10 + O === s.n) c.ok(read); else c.bad('place-value', area);
    };
    c.onReveal(function () { H = Math.floor(s.n / 100); Te = Math.floor(s.n / 10) % 10; O = s.n % 10; paint(); });
  };

  /* rows and columns: tap the corner of the rectangle */
  I.array = function (c) {
    var s = c.step, R = s.max || 10, sel = [0, 0];
    var g = ''; for (var r = 1; r <= R; r++) for (var q = 1; q <= R; q++) g += '<button class="ar-c" data-r="' + r + '" data-c="' + q + '" aria-label="' + r + ' × ' + q + '"></button>';
    c.el.innerHTML = '<div class="ar-read" dir="ltr">' + (s.showFact ? '' : '') + '<b class="ar-out">0 × 0</b></div><div class="ar-grid" dir="ltr" style="--n:' + R + '">' + g + '</div><div class="tf-go"><button class="btn pri big">' + A.icon('check', 22) + '<span>' + esc(T('Check')) + '</span></button></div>';
    var out = $('.ar-out', c.el), cells = $$('.ar-c', c.el);
    function paint() { cells.forEach(function (b) { b.classList.toggle('on', +b.dataset.r <= sel[0] && +b.dataset.c <= sel[1]); }); out.textContent = N(sel[0]) + ' × ' + N(sel[1]) + ' = ' + N(sel[0] * sel[1]); }
    cells.forEach(function (b) { b.onclick = function () { sel = [+b.dataset.r, +b.dataset.c]; Fx.tap(); paint(); }; });
    /* a finger can also slide to the corner: the rectangle follows it, which is easier than hitting one small cell */
    var grid = $('.ar-grid', c.el), dragging = false;
    function under(e) { var el = document.elementFromPoint(e.clientX, e.clientY); return el && el.closest && el.closest('.ar-c'); }
    grid.style.touchAction = 'none';
    grid.addEventListener('pointerdown', function (e) { dragging = true; try { grid.setPointerCapture(e.pointerId); } catch (x) { } var b = under(e); if (b) { sel = [+b.dataset.r, +b.dataset.c]; paint(); } });
    grid.addEventListener('pointermove', function (e) { if (!dragging) return; var b = under(e); if (b && (sel[0] !== +b.dataset.r || sel[1] !== +b.dataset.c)) { sel = [+b.dataset.r, +b.dataset.c]; Fx.tap(); paint(); } });
    var stop = function () { dragging = false; }; grid.addEventListener('pointerup', stop); grid.addEventListener('pointercancel', stop);
    paint();
    $('.tf-go button', c.el).onclick = function () {
      if (sel[0] === s.r && sel[1] === s.c) c.ok(out);
      else if (sel[0] === s.c && sel[1] === s.r && s.anyWay) c.ok(out);
      else c.bad('times', $('.ar-grid', c.el));
    };
    c.onReveal(function () { sel = [s.r, s.c]; paint(); });
  };
  /* a static picture of an array, for reading */
  I.arrayHtml = function (r, q, obj) { var h = ''; for (var i = 0; i < r * q; i++) h += '<i>' + (obj ? A.art(obj, 22) : '') + '</i>'; return '<div class="ar-pic' + (obj ? ' obj' : '') + '" dir="ltr" style="--c:' + q + '">' + h + '</div>'; };

  /* the area model: split the long side into tens and ones and watch the distributive law appear */
  I.areaHtml = function (a, b) {
    var tens = Math.floor(b / 10) * 10, ones = b - tens, W = 300, H = 40 + a * 14;
    var tw = W * (tens / b), ow = W - tw;
    return '<svg class="area-m" viewBox="0 0 ' + (W + 44) + ' ' + (H + 34) + '" dir="ltr"><text x="20" y="' + (H / 2 + 24) + '" class="am-l">' + N(a) + '</text><g transform="translate(36 24)"><rect width="' + tw + '" height="' + H + '" rx="8" class="am-a"/><rect x="' + tw + '" width="' + ow + '" height="' + H + '" rx="8" class="am-b"/><text x="' + tw / 2 + '" y="' + (H / 2 + 7) + '" class="am-t">' + N(a) + ' × ' + N(tens) + '</text><text x="' + (tw + ow / 2) + '" y="' + (H / 2 + 7) + '" class="am-t">' + N(a) + ' × ' + N(ones) + '</text><text x="' + tw / 2 + '" y="-8" class="am-l">' + N(tens) + '</text><text x="' + (tw + ow / 2) + '" y="-8" class="am-l">' + N(ones) + '</text></g></svg>';
  };

  /* fold, then shade: equal parts first, always */
  I.frac = function (c) {
    var s = c.step, parts = 1, shade = {};
    var opts = s.folds || [2, 3, 4, 5, 6, 8];
    c.el.innerHTML = '<div class="fr-t" dir="ltr"><span class="fr"><b>' + N(s.n) + '</b><i></i><b>' + N(s.d) + '</b></span></div><div class="fr-bar" dir="ltr"></div><div class="fr-folds">' + opts.map(function (f) { return '<button class="numopt sm" data-f="' + f + '">' + N(f) + '</button>'; }).join('') + '</div><div class="fr-lbl">' + esc(T('Fold into equal parts, then shade')) + '</div><div class="tf-go"><button class="btn pri big">' + A.icon('check', 22) + '<span>' + esc(T('Check')) + '</span></button></div>';
    var bar = $('.fr-bar', c.el);
    function paint() {
      bar.innerHTML = '';
      for (var i = 0; i < parts; i++) { var p = document.createElement('button'); p.type = 'button'; p.className = 'fr-p' + (shade[i] ? ' on' : ''); p.dataset.i = i; p.setAttribute('aria-label', A.L(['Part ', 'الجزء ']) + N(i + 1) + ' / ' + N(parts)); p.setAttribute('aria-pressed', shade[i] ? 'true' : 'false'); p.onclick = tog; if (!A.reduced()) p.animate([{ transform: 'scaleX(.6)', opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: 260, delay: i * 30, fill: 'backwards' }); bar.appendChild(p); }
    }
    function tog(e) { var i = +e.currentTarget.dataset.i; shade[i] = !shade[i]; e.currentTarget.classList.toggle('on', shade[i]); e.currentTarget.setAttribute('aria-pressed', shade[i] ? 'true' : 'false'); Fx.tap(); }
    $$('[data-f]', c.el).forEach(function (b) { b.onclick = function () { parts = +b.dataset.f; shade = {}; $$('[data-f]', c.el).forEach(function (x) { x.classList.toggle('sel', x === b); }); Fx.tap(); paint(); }; });
    paint();
    $('.tf-go button', c.el).onclick = function () {
      var sh = Object.keys(shade).filter(function (k) { return shade[k]; }).length;
      if (parts === s.d && sh === s.n) c.ok(bar);
      else c.bad(parts !== s.d ? 'fraction-parts' : 'fraction-size', bar);
    };
    c.onReveal(function () { parts = s.d; shade = {}; for (var i = 0; i < s.n; i++) shade[i] = true; paint(); });
  };
  I.fracBar = function (n, d, cls) { var h = ''; for (var i = 0; i < d; i++) h += '<i class="' + (i < n ? 'on' : '') + '"></i>'; return '<div class="frb ' + (cls || '') + '" dir="ltr">' + h + '</div>'; };

  /* fair sharing: every plate gets one in turn */
  I.share = function (c) {
    var s = c.step, obj = s.obj || 'date', left = s.n, counts = []; for (var k = 0; k < s.k; k++) counts.push(0);
    c.el.innerHTML = '<div class="sh-pile"></div><div class="sh-plates" style="--k:' + s.k + '">' + counts.map(function (_, i) { return '<button type="button" class="sh-plate" data-p="' + i + '" aria-label="' + esc(A.L(['Plate ', 'طبق ']) + N(i + 1)) + '"><div class="sh-in"></div></button>'; }).join('') + '</div><div class="tf-go"><button class="btn pri big">' + A.icon('check', 22) + '<span>' + esc(T('Check')) + '</span></button></div>';
    var pile = $('.sh-pile', c.el);
    function paintPile() { pile.innerHTML = ''; for (var i = 0; i < left; i++) pile.insertAdjacentHTML('beforeend', '<span>' + A.art(obj, 32) + '</span>'); }
    paintPile();
    $$('.sh-plate', c.el).forEach(function (p) {
      p.onclick = function () {
        if (left <= 0) return;
        left--; var pi = +p.dataset.p; counts[pi]++;
        p.setAttribute('aria-label', A.L(['Plate ', 'طبق ']) + N(pi + 1) + ' (' + N(counts[pi]) + ')');
        $('.sh-in', p).insertAdjacentHTML('beforeend', '<span class="drop">' + A.art(obj, 30) + '</span>');
        paintPile(); Fx.tap();
      };
    });
    $('.tf-go button', c.el).onclick = function () {
      var mx = Math.max.apply(null, counts), mn = Math.min.apply(null, counts);
      var rem = s.n % s.k;
      if (mx === mn && left === rem) c.ok($('.sh-plates', c.el));
      else c.bad('fraction-parts', $('.sh-plates', c.el));
    };
    c.onReveal(function () { var each = Math.floor(s.n / s.k); $$('.sh-in', c.el).forEach(function (x) { x.innerHTML = ''; for (var i = 0; i < each; i++) x.insertAdjacentHTML('beforeend', '<span>' + A.art(obj, 30) + '</span>'); }); left = s.n % s.k; paintPile(); });
  };

  /* the clock: drag the hands */
  I.clock = function (c) {
    var s = c.step, h = s.startH != null ? s.startH : 12, m = 0;
    var nums = ''; for (var i = 1; i <= 12; i++) { var an = (i * 30 - 90) * Math.PI / 180; nums += '<text x="' + (100 + Math.cos(an) * 72) + '" y="' + (106 + Math.sin(an) * 72) + '" class="clk-n">' + N(i) + '</text>'; }
    var ticks = ''; for (var ti = 0; ti < 60; ti++) { var big = ti % 5 === 0, ta = ti * 6 * Math.PI / 180; ticks += '<line x1="' + (100 + Math.sin(ta) * (big ? 80 : 83)).toFixed(1) + '" y1="' + (100 - Math.cos(ta) * (big ? 80 : 83)).toFixed(1) + '" x2="' + (100 + Math.sin(ta) * 86).toFixed(1) + '" y2="' + (100 - Math.cos(ta) * 86).toFixed(1) + '" stroke="#3a2a18" stroke-width="' + (big ? 2.2 : .9) + '" stroke-linecap="round"/>'; }
    var ctrls = '<div class="clk-ctrl" dir="ltr" style="display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:8px">' +
      '<button type="button" class="btn sec sm" data-dh="-1" aria-label="' + esc(A.L(['Hour back', 'ساعة للخلف'])) + '">' + esc(A.L(['−1h', '−١ س'])) + '</button>' +
      '<button type="button" class="btn sec sm" data-dh="1" aria-label="' + esc(A.L(['Hour forward', 'ساعة للأمام'])) + '">' + esc(A.L(['+1h', '+١ س'])) + '</button>' +
      (s.minutes ? '<button type="button" class="btn sec sm" data-dm="-5" aria-label="' + esc(A.L(['Five minutes back', 'خمس دقائق للخلف'])) + '">' + esc(A.L(['−5m', '−٥ د'])) + '</button><button type="button" class="btn sec sm" data-dm="5" aria-label="' + esc(A.L(['Five minutes forward', 'خمس دقائق للأمام'])) + '">' + esc(A.L(['+5m', '+٥ د'])) + '</button>' : '') +
      '<span class="clk-sr" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)"></span></div>';
    c.el.innerHTML = '<svg class="clk" viewBox="0 0 200 200" dir="ltr" aria-hidden="true"><circle cx="100" cy="103" r="98" fill="rgba(0,0,0,.28)"/><circle cx="100" cy="100" r="98" fill="url(#gWood)"/><circle cx="100" cy="100" r="98" fill="url(#rShade)"/><circle cx="100" cy="100" r="89" fill="#4a2f17"/><circle cx="100" cy="100" r="87" fill="url(#gCream)"/><circle cx="100" cy="100" r="87" fill="url(#rShade)" opacity=".35"/>' + ticks + nums + '<g class="clk-m"><path d="M97.500 106h5l-1.200-78h-2.600z" fill="#7a5a1c"/></g><g class="clk-h"><path d="M96 106h8l-1.800-54a2 2 0 0 0-4.400 0z" fill="#20160c"/></g><circle cx="100" cy="100" r="7" fill="url(#gGold)"/><circle cx="100" cy="100" r="2.400" fill="#7a5a1c"/></svg>' + ctrls + '<div class="tf-go"><button class="btn pri big">' + A.icon('check', 22) + '<span>' + esc(T('Check')) + '</span></button></div>';
    var svg = $('svg', c.el), H = $('.clk-h', c.el), Mi = $('.clk-m', c.el), sr = $('.clk-sr', c.el), active = null;
    function paint() {
      var ha = ((h % 12) + (m / 60)) * 30, ma = m * 6;
      H.setAttribute('transform', 'rotate(' + ha + ' 100 100)'); Mi.setAttribute('transform', 'rotate(' + ma + ' 100 100)');
      if (sr) sr.textContent = N(h) + ':' + (m < 10 ? N(0) : '') + N(m);
    }
    function ang(e) { var r = svg.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2; var a = Math.atan2(x, -y) * 180 / Math.PI; return a < 0 ? a + 360 : a; }
    svg.addEventListener('pointerdown', function (e) { var a = ang(e), r = svg.getBoundingClientRect(), d = Math.hypot(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2) / (r.width / 2); active = (s.minutes && d > .62) ? 'm' : 'h'; try { svg.setPointerCapture(e.pointerId); } catch (x) { } mv(e); e.preventDefault(); });
    svg.addEventListener('pointermove', function (e) { if (active) mv(e); });
    svg.addEventListener('pointerup', function () { active = null; });
    svg.addEventListener('pointercancel', function () { active = null; });
    $$('[data-dh]', c.el).forEach(function (b) { b.onclick = function () { h = ((h - 1 + (+b.dataset.dh) + 12) % 12) + 1; Fx.tap(); paint(); }; });
    $$('[data-dm]', c.el).forEach(function (b) { b.onclick = function () { m = (m + (+b.dataset.dm) + 60) % 60; Fx.tap(); paint(); }; });
    function mv(e) {
      var a = ang(e);
      if (active === 'm') { var nm = (Math.round(a / 30) * 5) % 60; if (nm !== m) { m = nm; Fx.tap(); } }
      else { var off = m / 60 * 30; var nh = Math.round((a - off) / 30); nh = ((nh % 12) + 12) % 12; if (nh === 0) nh = 12; if (nh !== h) { h = nh; Fx.tap(); } }
      paint();
    }
    svg.style.touchAction = 'none';
    paint();
    $('.tf-go button', c.el).onclick = function () { if (h === s.h && m === (s.m || 0)) c.ok(svg); else c.bad('understanding', svg); };
    c.onReveal(function () { h = s.h; m = s.m || 0; paint(); });
  };
})();
