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
    var kind = A.eqKind(s.eq), given = kind.code ? '<pre class="pad-code" dir="ltr">' + esc(kind.eq.replace(/;\s*/g, '\n')) + '</pre>' : kind.given ? '<div class="pad-given" dir="' + (kind.rtl ? 'rtl' : 'ltr') + '">' + (kind.rtl ? esc(A.num(kind.text)) : A.bidi(esc(A.num(kind.text)))) + '</div>' : '';
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

  /* ====== tracing: the finger follows the real direction of the pen ====== */
  I.trace = function (c) {
    var s = c.step, data = window.STROKES[s.set][s.ch];
    if (!data) { c.done(); return; }
    var box = document.createElement('div'); box.className = 'tr-box';
    box.innerHTML = '<canvas></canvas><div class="tr-hint"></div>';
    c.el.appendChild(box);
    var cv = $('canvas', box), g = cv.getContext('2d');
    var W = Math.min((c.el.clientWidth || 320) - 16, 420, innerHeight * .46), dpr = Math.min(devicePixelRatio || 1, 2.5);
    cv.width = W * dpr; cv.height = W * dpr; cv.style.width = W + 'px'; cv.style.height = W + 'px'; g.scale(dpr, dpr);
    var sc = W / 100;
    /* resample each stroke to even points */
    var strokes = data.map(function (st) {
      if (st.length === 1) return { dot: st[0], pts: [st[0]], len: 0 };
      var pts = [], i;
      for (i = 0; i < st.length - 1; i++) {
        var a = st[i], b = st[i + 1], d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(d / 1.4));
        for (var k = 0; k < n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
      }
      pts.push(st[st.length - 1]);
      return { pts: pts };
    });
    var cur = 0, prog = 0, down = false, inkPts = [], tol = s.tol || 11, ghost = s.ghost !== false, t = 0, raf = 0, done = false, sparks = [];
    var gold = '#f1d59e';
    var isLight = false; /* the board is dark in every theme */
    var guide = isLight ? 'rgba(90,70,30,.14)' : 'rgba(241,213,158,.13)';
    var hl = isLight ? 'rgba(160,110,30,.3)' : 'rgba(241,213,158,.28)';
    function path(p, upto) { g.beginPath(); for (var i = 0; i <= Math.min(upto, p.length - 1); i++) { var q = p[i]; if (i) g.lineTo(q[0] * sc, q[1] * sc); else g.moveTo(q[0] * sc, q[1] * sc); } }
    function draw() {
      t += .016;
      g.clearRect(0, 0, W, W);
      g.lineCap = g.lineJoin = 'round';
      strokes.forEach(function (st, i) {
        if (st.dot) {
          g.beginPath(); g.arc(st.dot[0] * sc, st.dot[1] * sc, 6.4 * sc, 0, 7);
          g.fillStyle = i < cur ? gold : (ghost ? guide : 'transparent'); g.fill();
          return;
        }
        if (ghost) { path(st.pts, 1e9); g.strokeStyle = guide; g.lineWidth = 13 * sc; g.stroke(); }
        if (i < cur) { path(st.pts, 1e9); g.strokeStyle = gold; g.lineWidth = 8.4 * sc; g.shadowColor = gold; g.shadowBlur = 12; g.stroke(); g.shadowBlur = 0; }
      });
      var st = strokes[cur];
      if (st && !done) {
        if (st.dot) {
          var pu = 8 * sc * (1 + .18 * Math.sin(t * 6));
          g.beginPath(); g.arc(st.dot[0] * sc, st.dot[1] * sc, pu, 0, 7); g.strokeStyle = gold; g.lineWidth = 3; g.stroke();
        } else {
          if (prog > 0) { path(st.pts, prog); g.strokeStyle = gold; g.lineWidth = 8.4 * sc; g.shadowColor = gold; g.shadowBlur = 14; g.stroke(); g.shadowBlur = 0; }
          /* the guide bead travels the path to show direction, until the child begins */
          if (!down && prog === 0) {
            var j = Math.floor((t % 2) / 2 * (st.pts.length - 1)), q = st.pts[j];
            path(st.pts, j); g.strokeStyle = hl; g.lineWidth = 6 * sc; g.stroke();
            g.beginPath(); g.arc(q[0] * sc, q[1] * sc, 3.6 * sc, 0, 7); g.fillStyle = gold; g.fill();
          }
          var head = st.pts[Math.min(prog, st.pts.length - 1)];
          g.beginPath(); g.arc(head[0] * sc, head[1] * sc, (prog ? 6.4 : 7.6 + 1.5 * Math.sin(t * 5)) * sc, 0, 7); g.fillStyle = isLight ? '#fff8e6' : '#fff4d6'; g.fill(); g.lineWidth = 3; g.strokeStyle = gold; g.stroke();
        }
      }
      sparks = sparks.filter(function (p) { return p.l > 0; });
      sparks.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.l -= .04; g.globalAlpha = Math.max(0, p.l); g.fillStyle = '#ffe9b8'; g.fillRect(p.x, p.y, 2.4, 2.4); g.globalAlpha = 1; });
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    c.setCleanup(function () { cancelAnimationFrame(raf); });
    function pos(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / sc, (e.clientY - r.top) / sc]; }
    function nextStroke() {
      cur++; prog = 0; Fx.tap();
      if (cur >= strokes.length) { done = true; Fx.bloomAt(cv, null, true); c.ok(cv, { delay: 900 }); }
    }
    function move(p) {
      var st = strokes[cur]; if (!st || st.dot) return;
      var best = -1, bd = 1e9;
      for (var i = prog; i < Math.min(prog + 24, st.pts.length); i++) { var q = st.pts[i], d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; best = i; } }
      if (bd <= tol) {
        if (best > prog) {
          prog = best;
          var h = st.pts[prog]; if (Math.random() < .5) sparks.push({ x: h[0] * sc, y: h[1] * sc, vx: (Math.random() - .5) * 2.4, vy: (Math.random() - .5) * 2.4, l: 1 });
        }
        if (prog >= st.pts.length - 2) { down = false; nextStroke(); }
      }
    }
    cv.addEventListener('pointerdown', function (e) {
      e.preventDefault(); if (done) return;
      try { cv.setPointerCapture(e.pointerId); } catch (x) { }
      var st = strokes[cur]; if (!st) return;
      var p = pos(e);
      if (st.dot) { if (Math.hypot(st.dot[0] - p[0], st.dot[1] - p[1]) < 16) nextStroke(); else Fx.shake(box); return; }
      down = true;
      var head = st.pts[Math.min(prog, st.pts.length - 1)];
      if (Math.hypot(head[0] - p[0], head[1] - p[1]) > 18) { down = false; Fx.soft(); }
    });
    cv.addEventListener('pointermove', function (e) { if (down) { e.preventDefault(); move(pos(e)); } });
    var up = function () { if (!down) return; down = false; var st = strokes[cur]; if (st && !st.dot && prog > 0 && prog < st.pts.length * .9) { /* lifting early keeps the progress: small hands stop and start */ } };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.style.touchAction = 'none';
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
