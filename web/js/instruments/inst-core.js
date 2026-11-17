/* Instruments anyone can use: a scene to meet, choices, sorting, ordering, matching, typing a number, tracing, and missions. */
(function () {
  'use strict';
  var A = window.A, $ = A.$, $$ = A.$$, esc = A.esc, L = A.L, T = A.T, I = window.I;

  function pic(x, size) { if (!x) return ''; if (x.art) return A.art(x.art, size); if (x.html) return x.html; return ''; }
  I.pic = pic;

  /* a calm scene: picture, words, spoken */
  I.say = function (c) {
    var s = c.step;
    var html = '';
    if (s.html) html += '<div class="sc-html">' + (typeof s.html === 'function' ? s.html(c) : s.html) + '</div>';
    if (s.art) html += '<div class="sc-art float">' + A.art(s.art, 150) + '</div>';
    if (s.arts) html += '<div class="sc-arts">' + s.arts.map(function (a, i) { return '<span style="--i:' + i + '">' + A.art(a, 76) + '</span>'; }).join('') + '</div>';
    if (s.big) html += '<div class="sc-big' + (s.bigAr ? ' ar' : '') + '" ' + (s.bigAr ? 'lang="ar" dir="rtl"' : '') + '>' + esc(s.big) + '</div>';
    if (s.t) html += '<p class="sc-t">' + esc(L(s.t)) + '</p>';
    if (s.from) html += '<p class="sc-ref">' + esc(L(s.from)) + '</p>';
    c.el.innerHTML = html;
    if (s.mount) s.mount(c);
    c.done();
  };

  /* choose: text, art or Arabic options. Options may carry their own error type. */
  I.choice = function (c) {
    var s = c.step, rng = c.rng;
    var opts = s.shuffle === false ? s.o : rng.shuffle(s.o);
    var cls = 'ch' + (s.cols ? ' c' + s.cols : opts.length > 3 ? ' c2' : '') + (s.large ? ' large' : '');
    var top = '';
    if (s.q) top += '<div class="ch-q' + (s.qAr ? ' ar' : '') + '" ' + (s.qAr ? 'lang="ar" dir="rtl"' : '') + '>' + esc(L(s.q)) + '</div>';
    if (s.qArt) top += '<div class="ch-art">' + A.art(s.qArt, 110) + '</div>';
    if (s.qHtml) top += '<div class="ch-html">' + s.qHtml + '</div>';
    if (s.listen) top += '<button class="listen" data-listen="1" aria-label="' + esc(T('Listen')) + '">' + A.icon('speak', 34) + '</button>';
    c.el.innerHTML = top + '<div class="' + cls + '">' + opts.map(function (o, i) {
      var inner = (o.art ? A.art(o.art, s.artSize || 72) : '') + (o.html || '') + (o.t != null ? '<span class="' + (o.ar ? 'ar" lang="ar" dir="rtl' : '') + '">' + esc(L(o.t)) + '</span>' : '');
      return '<button class="opt" data-i="' + i + '">' + inner + '</button>';
    }).join('') + '</div>';
    var doListen = function () { if (s.listen) s.listen(c); };
    var lb = $('[data-listen]', c.el); if (lb) lb.onclick = doListen;
    if (s.listen && s.autoListen !== false) setTimeout(doListen, 300);
    $$('.opt', c.el).forEach(function (b) {
      b.onclick = function () {
        var o = opts[+b.dataset.i];
        if (b.disabled) return;
        if (o.say) Voice.say(L(o.say));
        if (o.ok) { b.classList.add('right'); $$('.opt', c.el).forEach(function (x) { x.disabled = true; }); c.ok(b); }
        else { b.classList.add('wrong'); b.disabled = true; c.bad(o.e || s.err, b, o.why); }
      };
    });
    c.onReveal(function () { $$('.opt', c.el).forEach(function (b) { var o = opts[+b.dataset.i]; b.disabled = true; if (o.ok) b.classList.add('right'); }); });
  };

  /* tap to place into bins */
  I.sort = function (c) {
    var s = c.step, items = c.rng.shuffle(s.items), sel = null, left = items.length;
    c.el.innerHTML = '<div class="sort-tray">' + items.map(function (it, i) { return '<button class="chip-item" data-i="' + i + '">' + (it.art ? A.art(it.art, 54) : '') + (it.t ? '<span class="' + (it.ar ? 'ar' : '') + '">' + esc(L(it.t)) + '</span>' : '') + '</button>'; }).join('') + '</div>' +
      '<div class="bins">' + s.bins.map(function (b, i) { return '<button class="bin" data-b="' + i + '">' + (b.art ? A.art(b.art, 44) : '') + '<span class="bin-t">' + esc(L(b.t)) + '</span><div class="bin-in"></div></button>'; }).join('') + '</div>';
    function pick(btn) { $$('.chip-item', c.el).forEach(function (x) { x.classList.remove('sel'); }); sel = btn; if (btn) { btn.classList.add('sel'); Fx.tap(); var it = items[+btn.dataset.i]; if (it.say) Voice.say(L(it.say)); } }
    $$('.chip-item', c.el).forEach(function (b) { b.onclick = function () { pick(b); }; });
    if (items.length) pick($('.chip-item', c.el));
    $$('.bin', c.el).forEach(function (bin) {
      bin.onclick = function () {
        if (!sel) return;
        var it = items[+sel.dataset.i];
        if (it.b === +bin.dataset.b) {
          $('.bin-in', bin).appendChild(sel); sel.disabled = true; sel.classList.remove('sel'); Fx.bloomAt(sel, null, false); Fx.tap(); left--;
          sel = null;
          var nx = $('.sort-tray .chip-item', c.el); if (nx) pick(nx);
          if (!left) c.ok(bin);
        } else c.bad(it.e || s.err, bin);
      };
    });
    c.onReveal(function () { $$('.chip-item', c.el).forEach(function (b) { var it = items[+b.dataset.i]; var bin = $$('.bin', c.el)[it.b]; $('.bin-in', bin).appendChild(b); b.disabled = true; }); });
  };

  /* put steps in order by tapping them in turn */
  I.order = function (c) {
    var s = c.step, items = s.items.map(function (x, i) { return { x: x, i: i }; }), shuffled = c.rng.shuffle(items), n = 0;
    var num = function (i) { return A.num(i + 1); };
    c.el.innerHTML = '<div class="ord-slots">' + items.map(function (_, i) { return '<div class="ord-slot" data-s="' + i + '"><b>' + num(i) + '</b></div>'; }).join('') + '</div>' +
      '<div class="ord-tray">' + shuffled.map(function (o, i) { return '<button class="ord-item" data-i="' + o.i + '">' + (o.x.art ? A.art(o.x.art, 44) : '') + '<span class="' + (o.x.ar ? 'ar' : '') + '">' + esc(L(o.x.t)) + '</span></button>'; }).join('') + '</div>';
    $$('.ord-item', c.el).forEach(function (b) {
      b.onclick = function () {
        if (+b.dataset.i === n) {
          var slot = $$('.ord-slot', c.el)[n]; slot.appendChild(b); b.disabled = true; slot.classList.add('on'); Fx.tap(); n++;
          if (items[+b.dataset.i].x.say) Voice.say(L(items[+b.dataset.i].x.say));
          if (n === items.length) c.ok($('.ord-slots', c.el));
        } else c.bad(s.err || 'sequence', b);
      };
    });
    c.onReveal(function () { items.forEach(function (o, i) { var b = $('.ord-item[data-i="' + i + '"]', c.el); if (b) { $$('.ord-slot', c.el)[i].appendChild(b); b.disabled = true; } }); });
  };

  /* pair things up */
  I.match = function (c) {
    var s = c.step, L1 = c.rng.shuffle(s.pairs.map(function (p, i) { return { p: p[0], i: i }; })), L2 = c.rng.shuffle(s.pairs.map(function (p, i) { return { p: p[1], i: i }; })), sel = null, left = s.pairs.length;
    var cell = function (x) { return (x.art ? A.art(x.art, 54) : '') + (x.t != null ? '<span class="' + (x.ar ? 'ar' : '') + '"' + (x.ar ? ' lang="ar" dir="rtl"' : '') + '>' + esc(L(x.t)) + '</span>' : ''); };
    c.el.innerHTML = '<div class="mt"><div class="mt-c">' + L1.map(function (o) { return '<button class="mt-i" data-m="' + o.i + '">' + cell(o.p) + '</button>'; }).join('') + '</div><div class="mt-c">' + L2.map(function (o) { return '<button class="mt-i b" data-m="' + o.i + '">' + cell(o.p) + '</button>'; }).join('') + '</div></div>';
    $$('.mt-i', c.el).forEach(function (b) {
      b.onclick = function () {
        if (b.classList.contains('done')) return;
        if (!sel) { sel = b; b.classList.add('sel'); Fx.tap(); return; }
        if (sel === b) { sel = null; b.classList.remove('sel'); return; }
        if (sel.classList.contains('b') === b.classList.contains('b')) { sel.classList.remove('sel'); sel = b; b.classList.add('sel'); Fx.tap(); return; }
        if (sel.dataset.m === b.dataset.m) { [sel, b].forEach(function (x) { x.classList.add('done'); x.classList.remove('sel'); }); Fx.bloomAt(b); Fx.tap(); sel = null; left--; if (!left) c.ok(b); }
        else { sel.classList.remove('sel'); sel = null; c.bad(s.err, b); }
      };
    });
    c.onReveal(function () { $$('.mt-i', c.el).forEach(function (b) { b.classList.add('done'); }); });
  };

  /* type a number: real recall, not a guess among four */
  /* the keypad: digits always; a point, minus and fraction bar when the answer may need them */
  var padNum = function (t) { t = String(t).replace(/−/g, '-'); var m = /^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(t); return m ? +m[1] / +m[2] : +t; };
  I.padSame = function (v, a, exact) { if (exact) return String(v).replace(/−/g, '-') === String(a).replace(/−/g, '-'); var x = padNum(v), y = padNum(a); return !isNaN(x) && !isNaN(y) && Math.abs(x - y) < 1e-9; };
  I.padKey = function (val, d) {
    if (d === 'del') return val.slice(0, -1);
    if (d === '-') return val === '' ? '-' : val;
    if (d === '.') return /\.\d*$/.test(val) ? val : (/\d$/.test(val) ? val + '.' : val);
    if (d === '/') return /^-?\d+$/.test(val) ? val + '/' : val;
    return val.length < 9 ? val + d : val;
  };
  I.padHtml = function (extra) {
    var dig = A.ar() ? '٠١٢٣٤٥٦٧٨٩' : '0123456789';
    return '<div class="pad' + (extra ? ' pad-x' : '') + '" dir="ltr">' + (extra ? '<button class="pad-s" data-d="." aria-label="' + esc(L(['Point', 'فاصلة'])) + '">.</button><button class="pad-s" data-d="-" aria-label="' + esc(L(['Minus', 'سالب'])) + '">−</button><button class="pad-s" data-d="/" aria-label="' + esc(L(['Fraction', 'كسر'])) + '">/</button>' : '') + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (d) { return '<button data-d="' + d + '">' + dig[d] + '</button>'; }).join('') + '<button class="pad-del" data-d="del" aria-label="' + esc(T('Delete')) + '">' + A.icon('back', 24) + '</button><button data-d="0">' + dig[0] + '</button><button class="pad-go" data-d="go" aria-label="' + esc(T('Check')) + '">' + A.icon('check', 26) + '</button></div>';
  };
  I.padBind = function (el, on) { $$('.pad button', el).forEach(function (b) { b.onclick = function () { on(b.dataset.d); }; }); };
  I.pad = function (c) {
    var s = c.step, val = '';
    /* the answer box goes where the question mark is; a bare sum gets one at the end */
    /* code reads as code, and a worded problem as what is given, with the answer box under it */
    var kind = A.eqKind(s.eq), given = kind.code ? '<pre class="pad-code" dir="ltr">' + esc(kind.eq.replace(/;\s*/g, '\n')) + '</pre>' : kind.given ? '<div class="pad-given" dir="' + (kind.rtl ? 'rtl' : 'ltr') + '">' + (kind.rtl ? A.pow(esc(A.num(kind.text))) : A.bidi(A.pow(esc(A.num(kind.text))))) + '</div>' : '';
    if (given) s = Object.assign({}, s, { eq: '?' });
    else if (s.eq && kind.eq.indexOf('?') < 0) s = Object.assign({}, s, { eq: s.eq + ' = ?' });
    else if (kind.rtl) s = Object.assign({}, s, { eq: kind.text });
    c.el.innerHTML = (s.html ? '<div class="pad-v">' + (typeof s.html === 'function' ? s.html(c) : s.html) + '</div>' : '') + given + (s.eq ? '<div class="pad-eq" dir="' + (kind.rtl && !given ? 'rtl' : 'ltr') + '">' + (window.Teach ? Teach.math(s.eq) : esc(A.num(s.eq))).replace('?', '<b class="pad-out">?</b>') + '</div>' : '<div class="pad-eq" dir="ltr"><b class="pad-out">?</b></div>') +
      I.padHtml(s.allKeys || /[-−./]/.test(String(s.a)));
    var out = $('.pad-out', c.el);
    function paint() { out.textContent = val === '' ? '?' : A.num(val.replace(/-/g, '−')); out.classList.toggle('filled', val !== ''); }
    $$('.pad button', c.el).forEach(function (b) {
      b.onclick = function () {
        var d = b.dataset.d;
        if (d === 'go') {
          if (val === '') return;
          if (I.padSame(val, s.a, s.exact)) { out.classList.add('right'); $$('.pad button', c.el).forEach(function (x) { x.disabled = true; }); c.ok(out); }
          else { var why = s.missOf ? s.missOf(val) : null; c.bad(s.errOf ? s.errOf(+val) : s.err, out, why); val = ''; }
        } else { val = I.padKey(val, d); Fx.tap(); }
        paint();
      };
    });
    c.onReveal(function () { val = String(s.a); paint(); out.classList.add('right'); $$('.pad button', c.el).forEach(function (x) { x.disabled = true; }); });
  };

  /* ====== tracing: the finger follows the real direction of the pen ======
     The letter is shown as a pen-wide lane with its writing line, so it stays readable (the teeth of sīn never merge).
     The current stroke has a numbered start, arrows for its direction and, until the child begins, a bead that walks it.
     The child's own finger leaves chalk, so they see what they drew. Fast strokes are followed point by point, lifting
     keeps progress, and a small button starts the letter again. The board fills the room it has and redraws itself
     when the screen turns, folds or unfolds. */
  I.trace = function (c) {
    var s = c.step, data = window.STROKES[s.set] && window.STROKES[s.set][s.ch];
    if (!data) { c.done(); return; }
    var base = window.STROKES.base && window.STROKES.base[s.set] ? window.STROKES.base[s.set][s.ch] : null;
    var young = A.stage() <= 1;
    var box = document.createElement('div'); box.className = 'tr-box';
    box.innerHTML = '<canvas></canvas><button class="tr-again" type="button" aria-label="' + esc(L(['Start the letter again', 'ابدأ الحرف من جديد'])) + '">' +
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.5V9H9"/></svg></button>';
    c.el.appendChild(box);
    var cv = $('canvas', box), g = cv.getContext('2d'), W = 0, sc = 1;
    /* as large as the screen allows: the width of the lesson, and the height left above the footer */
    function fit() {
      var r = c.el.getBoundingClientRect(), foot = 150;
      var w = Math.max(220, (c.el.clientWidth || 320) - 24), h = Math.max(220, innerHeight - Math.max(r.top, 90) - foot);
      var nw = Math.round(Math.min(w, h, young ? 640 : 560));
      if (nw === W) return;
      W = nw; sc = W / 100;
      var dpr = Math.min(devicePixelRatio || 1, 2.5);
      cv.width = Math.round(W * dpr); cv.height = Math.round(W * dpr); cv.style.width = W + 'px'; cv.style.height = W + 'px';
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (strokes) paint();
    }
    var strokes = null;
    fit();
    /* resample each stroke to even points */
    strokes = data.map(function (st) {
      if (st.length === 1) return { dot: st[0], pts: [st[0]] };
      var pts = [], i;
      for (i = 0; i < st.length - 1; i++) {
        var a = st[i], b = st[i + 1], d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(d / 1.2));
        for (var k = 0; k < n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
      }
      pts.push(st[st.length - 1]);
      return { pts: pts };
    });
    var cur = 0, prog = 0, down = false, tol = s.tol || (young ? 12 : 9.5), ghost = s.ghost !== false, t = 0, raf = 0, done = false;
    var sparks = [], chalk = [], lastP = null, off = 0, still = A.reduced();
    var gold = '#f1d59e', lane = 'rgba(241,213,158,.12)', laneEdge = 'rgba(241,213,158,.2)', mid = 'rgba(241,213,158,.34)';
    function path(p, from, upto) { g.beginPath(); for (var i = from; i <= Math.min(upto, p.length - 1); i++) { var q = p[i]; if (i > from) g.lineTo(q[0] * sc, q[1] * sc); else g.moveTo(q[0] * sc, q[1] * sc); } }
    /* a chevron every so often along the stroke, pointing the way the pen goes */
    function arrows(p, from) {
      var step = 22, i;
      g.strokeStyle = 'rgba(255,244,214,.75)'; g.lineWidth = Math.max(1.6, .9 * sc); g.lineCap = 'round';
      for (i = from + step; i < p.length - 4; i += step) {
        var a = p[i - 2], b = p[i + 2], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), x = p[i][0] * sc, y = p[i][1] * sc, r = 2.1 * sc;
        g.beginPath(); g.moveTo(x - r * Math.cos(ang - .55), y - r * Math.sin(ang - .55)); g.lineTo(x, y); g.lineTo(x - r * Math.cos(ang + .55), y - r * Math.sin(ang + .55)); g.stroke();
      }
    }
    function diamond(q, r) { var x = q[0] * sc, y = q[1] * sc, d = r * sc; g.beginPath(); g.moveTo(x, y - d); g.lineTo(x + d * .92, y); g.lineTo(x, y + d); g.lineTo(x - d * .92, y); g.closePath(); }
    function startMark(q, n) {
      var x = q[0] * sc, y = q[1] * sc, r = Math.max(9, 3.4 * sc), pulse = still ? 0 : .5 + .5 * Math.sin(t * 5);
      g.beginPath(); g.arc(x, y, r + 3 + pulse * 3, 0, 7); g.strokeStyle = 'rgba(241,213,158,' + (.35 + .3 * pulse) + ')'; g.lineWidth = 2; g.stroke();
      g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = gold; g.fill();
      if (n) { g.fillStyle = '#2a1d08'; g.font = '700 ' + Math.round(r * 1.15) + 'px Quicksand, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), x, y + .5); }
    }
    /* resizing a canvas clears it: the board is painted again at once, never left blank until the next frame */
    function draw() { paint(); raf = requestAnimationFrame(draw); }
    function paint() {
      t += .016;
      g.clearRect(0, 0, W, W);
      g.lineCap = g.lineJoin = 'round';
      /* the writing line, as on a ruled page */
      if (base != null && base > 8 && base < 96) {
        g.setLineDash([2.2 * sc, 2.2 * sc]); g.beginPath(); g.moveTo(4 * sc, base * sc); g.lineTo(96 * sc, base * sc);
        g.strokeStyle = 'rgba(241,213,158,.22)'; g.lineWidth = 1.2; g.stroke(); g.setLineDash([]);
      }
      strokes.forEach(function (st, i) {
        if (st.dot) {
          /* a dot is the square tip of a reed pen, turned on its corner: as in the letter, not a round blob */
          diamond(st.dot, 4.2);
          if (i < cur) { g.fillStyle = gold; g.shadowColor = gold; g.shadowBlur = 8; g.fill(); g.shadowBlur = 0; } else if (ghost) { g.fillStyle = lane; g.fill(); g.strokeStyle = laneEdge; g.lineWidth = 1.2; g.stroke(); }
          return;
        }
        if (ghost && i >= cur) {
          path(st.pts, 0, 1e9); g.strokeStyle = laneEdge; g.lineWidth = 7.6 * sc; g.stroke();
          path(st.pts, 0, 1e9); g.strokeStyle = 'rgba(23,33,32,.92)'; g.lineWidth = 7.6 * sc - 2.4; g.stroke();
          path(st.pts, 0, 1e9); g.strokeStyle = lane; g.lineWidth = 7.6 * sc - 2.4; g.stroke();
          if (i > cur) { path(st.pts, 0, 1e9); g.setLineDash([.4 * sc, 2.6 * sc]); g.strokeStyle = mid; g.lineWidth = Math.max(1.4, .7 * sc); g.stroke(); g.setLineDash([]); }
        }
        if (i < cur) { path(st.pts, 0, 1e9); g.strokeStyle = gold; g.lineWidth = 5.6 * sc; g.shadowColor = gold; g.shadowBlur = 10; g.stroke(); g.shadowBlur = 0; }
      });
      var st = strokes[cur];
      if (st && !done) {
        if (st.dot) { for (var dj = cur; dj < strokes.length && strokes[dj].dot; dj++) startMark(strokes[dj].dot, 0); }
        else {
          if (prog > 0) { path(st.pts, 0, prog); g.strokeStyle = gold; g.lineWidth = 5.6 * sc; g.shadowColor = gold; g.shadowBlur = 12; g.stroke(); g.shadowBlur = 0; }
          if (ghost || prog > 0) arrows(st.pts, prog);
          /* until the child begins, a bead walks the stroke to show the way */
          if (!down && prog === 0 && !still) {
            var j = Math.floor((t % 2.2) / 2.2 * (st.pts.length - 1)), q = st.pts[j];
            path(st.pts, 0, j); g.strokeStyle = 'rgba(241,213,158,.45)'; g.lineWidth = 3.4 * sc; g.stroke();
            g.beginPath(); g.arc(q[0] * sc, q[1] * sc, 2.2 * sc, 0, 7); g.fillStyle = '#fff4d6'; g.fill();
          }
          if (prog === 0) startMark(st.pts[0], strokes.length > 1 ? cur + 1 : 0);
          else { var h = st.pts[Math.min(prog, st.pts.length - 1)]; g.beginPath(); g.arc(h[0] * sc, h[1] * sc, Math.max(7, 2.8 * sc), 0, 7); g.fillStyle = '#fff4d6'; g.fill(); g.lineWidth = 2.5; g.strokeStyle = gold; g.stroke(); }
        }
      }
      /* the child's own chalk, fading */
      var now = Date.now();
      chalk = chalk.filter(function (seg) { return now - seg.at < 1400; });
      chalk.forEach(function (seg) { var a = 1 - (now - seg.at) / 1400; g.beginPath(); g.moveTo(seg.a[0] * sc, seg.a[1] * sc); g.lineTo(seg.b[0] * sc, seg.b[1] * sc); g.strokeStyle = 'rgba(255,255,255,' + (.55 * a) + ')'; g.lineWidth = 2.6 * sc * (.6 + .4 * a); g.stroke(); });
      sparks = sparks.filter(function (p) { return p.l > 0; });
      sparks.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.l -= .04; g.globalAlpha = Math.max(0, p.l); g.fillStyle = '#ffe9b8'; g.fillRect(p.x, p.y, 2.4, 2.4); g.globalAlpha = 1; });
    }
    paint(); raf = requestAnimationFrame(draw);
    /* turning, folding or unfolding the screen: the board takes its new size; the work so far is kept */
    var ro = window.ResizeObserver ? new ResizeObserver(function () { fit(); }) : null;
    if (ro) ro.observe(c.el); else addEventListener('resize', fit);
    c.setCleanup(function () { cancelAnimationFrame(raf); if (ro) ro.disconnect(); else removeEventListener('resize', fit); });
    function pos(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / sc, (e.clientY - r.top) / sc]; }
    function nextStroke() {
      cur++; prog = 0; off = 0; Fx.tap(); A.N.haptic('tick');
      if (cur >= strokes.length) { done = true; box.classList.add('done'); Fx.bloomAt(cv, null, true); c.ok(cv, { delay: 900 }); }
    }
    /* follow one point: the pen moves forward along the stroke, never backwards, and only while the finger stays near it */
    function follow(p) {
      var st = strokes[cur]; if (!st || st.dot) return;
      var best = -1, bd = 1e9, reach = Math.min(st.pts.length, prog + 40);
      for (var i = prog; i < reach; i++) { var q = st.pts[i], d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = i; } }
      if (bd <= tol) {
        off = 0;
        if (best > prog) {
          prog = best;
          var h = st.pts[prog]; if (!still && Math.random() < .4) sparks.push({ x: h[0] * sc, y: h[1] * sc, vx: (Math.random() - .5) * 2.4, vy: (Math.random() - .5) * 2.4, l: 1 });
        }
        if (prog >= st.pts.length - 3) { down = false; nextStroke(); }
      } else if (++off === 14) { Fx.soft(); }
    }
    function moveTo(p) {
      if (lastP) {
        chalk.push({ a: lastP, b: p, at: Date.now() });
        /* a quick stroke jumps far between two events: walk the gap in small steps so nothing is skipped */
        var d = Math.hypot(p[0] - lastP[0], p[1] - lastP[1]), n = Math.min(30, Math.ceil(d / 1.5));
        for (var k = 1; k <= n && down; k++) follow([lastP[0] + (p[0] - lastP[0]) * k / n, lastP[1] + (p[1] - lastP[1]) * k / n]);
      } else follow(p);
      lastP = p;
    }
    cv.addEventListener('pointerdown', function (e) {
      e.preventDefault(); if (done) return;
      try { cv.setPointerCapture(e.pointerId); } catch (x) { }
      var st = strokes[cur]; if (!st) return;
      var p = pos(e); lastP = null;
      if (st.dot) {
        /* the dots of a letter can go on in any order: the nearest one still waiting, within a finger's width */
        var best = -1, bd = young ? 17 : 14;
        for (var j = cur; j < strokes.length && strokes[j].dot; j++) { var dd = Math.hypot(strokes[j].dot[0] - p[0], strokes[j].dot[1] - p[1]); if (dd < bd) { bd = dd; best = j; } }
        if (best < 0) { Fx.shake(box); return; }
        if (best !== cur) { var tmp = strokes[cur]; strokes[cur] = strokes[best]; strokes[best] = tmp; }
        nextStroke(); return;
      }
      var head = st.pts[Math.min(prog, st.pts.length - 1)];
      if (Math.hypot(head[0] - p[0], head[1] - p[1]) > (young ? 20 : 16)) { Fx.soft(); return; }
      down = true; moveTo(p);
    });
    cv.addEventListener('pointermove', function (e) {
      if (!down) return; e.preventDefault();
      var list = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
      (list && list.length ? list : [e]).forEach(function (ev) { if (down) moveTo(pos(ev)); });
    });
    /* lifting early keeps the progress: small hands stop and start */
    var up = function () { down = false; lastP = null; };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.style.touchAction = 'none';
    $('.tr-again', box).onclick = function () { if (done) return; cur = 0; prog = 0; down = false; lastP = null; chalk = []; Fx.tap(); };
  };

  /* a real-world deed. A person confirms it: the app does not pretend to see it. */
  I.mission = function (c) {
    var s = c.step;
    c.el.innerHTML = '<div class="ms">' + (s.art ? '<div class="ms-art float">' + A.art(s.art, 130) + '</div>' : '') + '<h3 class="ms-h">' + esc(L(s.title || ['Go and do it', 'اذهب وافعلها'])) + '</h3><p class="ms-t">' + esc(L(s.t)) + '</p>' +
      (s.adult ? '<p class="ms-a">' + A.icon('grown', 18) + '<span>' + esc(L(s.adult)) + '</span></p>' : '') +
      (s.materials ? '<p class="ms-m">' + esc(L(s.materials)) + '</p>' : '') +
      (s.safety ? '<p class="ms-s">' + esc(L(s.safety)) + '</p>' : '') +
      '<div class="ms-btns"><button class="btn pri big" data-m="did">' + A.icon('check', 22) + '<span>' + esc(T('We did it')) + '</span></button><button class="btn sec" data-m="later">' + esc(T('Later')) + '</button></div></div>';
    $('[data-m=did]', c.el).onclick = function () { if (window.M && M.claim) M.claim(s.mid || 'L:' + (c.skillId || s.t[0]), { skill: c.skillId || s.skill || null, t: s.t, title: s.t }); c.ok($('[data-m=did]', c.el), { delay: 800 }); };
    $('[data-m=later]', c.el).onclick = function () { c.next(); };
  };
})();
