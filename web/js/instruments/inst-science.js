/* Science instruments. The rule: commit to a prediction before seeing what happens. Being wrong is engagement, never an error.
   Simulations come after or beside real activities, never instead of them. */
(function () {
  'use strict';
  var A = window.A, $ = A.$, $$ = A.$$, esc = A.esc, L = A.L, T = A.T, I = window.I;

  function sim(c, H, draw, h) {
    var box = document.createElement('div'); box.className = 'sim';
    box.innerHTML = '<canvas></canvas>'; c.appendChild(box);
    var cv = $('canvas', box), g = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
    var W = Math.min(box.clientWidth || 340, 560), HH = H * W / 340;
    cv.width = W * dpr; cv.height = HH * dpr; cv.style.height = HH + 'px'; g.scale(dpr, dpr);
    var t0 = performance.now(), raf = 0, on = true, sc = W / 340;
    function f(now) { if (!on) return; g.save(); g.scale(sc, sc); draw(g, 340, H, (now - t0) / 1000); g.restore(); raf = requestAnimationFrame(f); }
    raf = requestAnimationFrame(f);
    return { cv: cv, stop: function () { on = false; cancelAnimationFrame(raf); }, restart: function () { t0 = performance.now(); }, sc: sc };
  }
  function txt(g, s, x, y, col, size, al) { g.fillStyle = col || '#fff'; g.font = '700 ' + (size || 13) + 'px Quicksand,sans-serif'; g.textAlign = al || 'center'; g.fillText(s, x, y); }
  function artImg(name, cb) { var FN = { leaf: 'leaf', date: 'date' }[name], ou = A.objUrl(name); if ((FN && A.hasImg(FN)) || ou) { var r = new Image(); r.onload = function () { cb(r); }; r.src = FN && A.hasImg(FN) ? A.imgUrl(FN) : ou; return r; } var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs>' + A.$('svg defs').innerHTML + '</defs>' + A.ART[name] + '</svg>'; var im = new Image(); im.onload = function () { cb(im); }; im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); return im; }
  I.artImg = artImg;
  var SIMS = {};

  /* predict, then see. s.sim builds the world; s.o lists what could happen */
  I.predict = function (c) {
    var s = c.step, mine = null;
    function ask() {
      c.el.innerHTML = '<div class="hf-tier">' + esc(T('What do you think will happen?')) + '</div>' + (s.art ? '<div class="sc-art">' + A.art(s.art, 110) + '</div>' : '') + '<div class="ch c1">' + s.o.map(function (o, i) { return '<button class="opt" data-i="' + i + '">' + (o.art ? A.art(o.art, 46) : '') + '<span>' + esc(L(o.t)) + '</span></button>'; }).join('') + '</div>';
      $$('.opt', c.el).forEach(function (b) { b.onclick = function () { mine = s.o[+b.dataset.i]; Fx.tap(); see(); }; });
    }
    function see() {
      c.el.innerHTML = '<div class="pred">' + esc(T('You said')) + ': <b>' + esc(L(mine.t)) + '</b></div><div id="simh"></div><div id="sim-out"></div>';
      SIMS[s.sim]($('#simh', c.el), s, c, function (result) {
        var right = result === mine.v || mine.v == null;
        var out = $('#sim-out', c.el);
        out.innerHTML = '<p class="sc-t" style="margin-top:6px"><b style="color:var(--h)">' + esc(right ? T('You predicted it.') : T('A surprise. That is how scientists learn.')) + '</b><br>' + esc(L(s.why || '')) + '</p>';
                if (!right && c.logErr) c.logErr('prediction');
        Voice.say(L(s.why || ''), { lang: A.ar() ? 'ar' : 'en' });
        c.done();
      });
    }
    ask();
  };

  /* a play space with no question: explore freely */
  I.explore = function (c) { var s = c.step; c.el.innerHTML = '<div id="simh"></div>' + (s.t ? '<p class="sc-t">' + esc(L(s.t)) + '</p>' : ''); SIMS[s.sim]($('#simh', c.el), s, c, function () { }); c.done(); };

  /* ---- what floats: a glass tank, real water, the object bending where it crosses the surface ---- */
  var FLOATERS = { wood: 1, apple: 1, leaf: 1, feather: 1, ball: 1, boat: 1, ice: 1, stone: 0, coin: 0, nail: 0, spoon: 0, key: 0 };
  SIMS.float = function (h, s, c, done) {
    var item = s.item, fl = FLOATERS[item], img = null; artImg(item, function (i) { img = i; });
    var y = 6, vy = 0, settled = false, waterTop = 96, floor = 208, splash = [], rings = [], bubbles = [], reported = false, hit = false, size = 58;
    var S = sim(h, 240, function (g, W, H, t) {
      var X0 = 30, X1 = W - 30, Y0 = 44, Y1 = H - 24, cx = W / 2;
      /* physics */
      var bottom = y + size * .5, sub = Math.max(0, Math.min(1, (bottom - waterTop) / size));
      vy += .32; if (sub > 0) { vy *= .9; vy -= sub * (fl ? .78 : .2); }
      y += vy;
      if (sub > .05 && !hit) {
        hit = true; rings.push({ r: 6, a: .9 }, { r: 1, a: .7 });
        for (var i = 0; i < 26; i++) splash.push({ x: cx + (Math.random() - .5) * 30, y: waterTop, vx: (Math.random() - .5) * 4.6, vy: -1 - Math.random() * 4.4, l: 1, r: 1 + Math.random() * 2 });
        for (var b = 0; b < 16; b++) bubbles.push({ x: cx + (Math.random() - .5) * 34, y: waterTop + 12 + Math.random() * 30, r: 1 + Math.random() * 3, v: .4 + Math.random() * .8, p: Math.random() * 6 });
      }
      if (!fl && y > floor - size * .4) { y = floor - size * .4; vy = 0; }
      if (fl && Math.abs(vy) < .05 && sub > 0) settled = true;
      if (!fl && y >= floor - size * .41) settled = true;
      if (!fl && hit && !settled && Math.random() < .3) bubbles.push({ x: cx + (Math.random() - .5) * 20, y: y, r: 1 + Math.random() * 2, v: .7 + Math.random() * .7, p: Math.random() * 6 });
      /* a room behind the tank */
      var wall = g.createLinearGradient(0, 0, 0, H); wall.addColorStop(0, '#f2e7d2'); wall.addColorStop(1, '#c9b596'); g.fillStyle = wall; g.fillRect(0, 0, W, H);
      var win = g.createRadialGradient(W * .18, 20, 10, W * .18, 20, 240); win.addColorStop(0, 'rgba(255,250,226,.9)'); win.addColorStop(1, 'rgba(255,250,226,0)'); g.fillStyle = win; g.fillRect(0, 0, W, H);
      var tb = g.createLinearGradient(0, H - 24, 0, H); tb.addColorStop(0, '#a9794a'); tb.addColorStop(.2, '#8a5c31'); tb.addColorStop(1, '#5b3a1e'); g.fillStyle = tb; g.fillRect(0, H - 24, W, 24);
      var sh = g.createRadialGradient(cx, H - 16, 10, cx, H - 16, W * .55); sh.addColorStop(0, 'rgba(0,0,0,.34)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sh; g.fillRect(0, H - 24, W, 24);
      /* the water's surface: two waves, one behind the other */
      var surf = function (x, ph, amp) { return waterTop + Math.sin(x * .045 + t * 2.1 + ph) * amp + Math.sin(x * .11 - t * 1.4 + ph) * amp * .4; };
      var amp = 1.4 + Math.max(0, 5 - (hit ? rings.length ? 0 : 3.6 : 5)) * .4 + (hit && !settled ? 1.6 : 0);
      var wpath = function (ph, a) { g.beginPath(); g.moveTo(X0, Y1); g.lineTo(X0, surf(X0, ph, a)); for (var x = X0; x <= X1; x += 6) g.lineTo(x, surf(x, ph, a)); g.lineTo(X1, Y1); g.closePath(); };
      var deep = g.createLinearGradient(0, waterTop, 0, Y1); deep.addColorStop(0, '#79cbef'); deep.addColorStop(.5, '#3d97db'); deep.addColorStop(1, '#17589c');
      wpath(1.2, amp); g.fillStyle = deep; g.fill();
      /* sand on the bottom, with light playing across it */
      g.fillStyle = '#d9c292'; g.fillRect(X0, Y1 - 9, X1 - X0, 9);
      g.save(); g.beginPath(); g.rect(X0, waterTop, X1 - X0, Y1 - waterTop); g.clip();
      g.globalCompositeOperation = 'lighter';
      for (var cq = 0; cq < 9; cq++) { var cxq = X0 + ((cq * 53 + t * (9 + cq)) % (X1 - X0)), yy = Y1 - 26 - (cq % 3) * 22; var gr = g.createRadialGradient(cxq, yy, 1, cxq, yy, 26 + cq * 2); gr.addColorStop(0, 'rgba(180,235,255,.18)'); gr.addColorStop(1, 'rgba(180,235,255,0)'); g.fillStyle = gr; g.fillRect(cxq - 40, yy - 40, 80, 80); }
      g.restore();
      bubbles = bubbles.filter(function (q) { return q.y > waterTop + 2; });
      bubbles.forEach(function (q) { q.y -= q.v; q.x += Math.sin(t * 3 + q.p) * .35; g.strokeStyle = 'rgba(235,250,255,.8)'; g.lineWidth = .9; g.beginPath(); g.arc(q.x, q.y, q.r, 0, 7); g.stroke(); g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.arc(q.x - q.r * .3, q.y - q.r * .3, q.r * .25, 0, 7); g.fill(); });
      /* the object: above the surface it is true; below, it bends and takes the water's colour */
      if (img) {
        var bob = settled && fl ? Math.sin(t * 2) * 1.5 : 0, ty = y - size / 2 + bob, wy = surf(cx, 1.2, amp);
        g.save(); g.beginPath(); g.rect(0, 0, W, wy); g.clip(); g.drawImage(img, cx - size / 2, ty, size, size); g.restore();
        g.save(); g.beginPath(); g.rect(X0, wy, X1 - X0, Y1 - wy); g.clip(); g.drawImage(img, cx - size * .54 + Math.sin(t * 2.2) * 1.2, ty + 2, size * 1.08, size); g.fillStyle = 'rgba(40,120,190,.22)'; g.fillRect(cx - size, wy, size * 2, size * 2); g.restore();
      }
      /* the front of the water, thin and clear */
      wpath(0, amp * .8); var fr = g.createLinearGradient(0, waterTop, 0, Y1); fr.addColorStop(0, 'rgba(170,230,250,.26)'); fr.addColorStop(1, 'rgba(20,70,130,.2)'); g.fillStyle = fr; g.fill();
      g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.6; g.beginPath(); for (var xs = X0; xs <= X1; xs += 6) { var ys = surf(xs, 0, amp * .8); if (xs === X0) g.moveTo(xs, ys); else g.lineTo(xs, ys); } g.stroke();
      /* ripples spreading from where it landed */
      rings = rings.filter(function (q) { return q.a > .02; });
      rings.forEach(function (q) { q.r += 1.5; q.a *= .966; g.strokeStyle = 'rgba(255,255,255,' + q.a + ')'; g.lineWidth = 1.3; g.beginPath(); g.ellipse(cx, waterTop + 1, Math.min(q.r, (X1 - X0) / 2 - 2), Math.min(q.r * .16, 7), 0, 0, 7); g.stroke(); if (q.r > 26 && q.r < 28 && rings.length < 4) rings.push({ r: 2, a: q.a * .8 }); });
      splash.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vy += .22; p.l -= .028; g.globalAlpha = Math.max(0, p.l); g.fillStyle = '#e6f8ff'; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill(); g.globalAlpha = 1; });
      /* the glass */
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(X0, Y0); g.lineTo(X0, Y1); g.lineTo(X1, Y1); g.lineTo(X1, Y0); g.stroke();
      g.strokeStyle = 'rgba(60,90,110,.45)'; g.lineWidth = 1; g.strokeRect(X0 - 1.5, Y0, X1 - X0 + 3, Y1 - Y0 + 1.5);
      g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(X0 + 7, Y0 + 4, 9, Y1 - Y0 - 12); g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(X1 - 13, Y0 + 4, 5, Y1 - Y0 - 12);
      if (settled && !reported) { reported = true; setTimeout(function () { done(fl ? 'float' : 'sink'); }, 700); }
    });
    c.setCleanup(S.stop);
  };

  /* ---- the plant fair test: two pots, one difference, a week of real days and nights ---- */
  SIMS.plant = function (h, s, c, done) {
    var vary = s.vary, day = 0;
    h.innerHTML = '<div class="sim-out-day"></div>';
    var drawPlant = function (g, x, base, gr, wilt, dim) {
      var hgt = gr * 108;
      if (hgt >= 2) {
        var stem = wilt ? '#a59a58' : '#3f9a62', leafA = wilt ? '#c4b868' : '#7ed39a', leafB = wilt ? '#8d8444' : '#2f8355';
        var tipx = x + wilt * 34, tipy = base - hgt + wilt * hgt * .4;
        g.strokeStyle = stem; g.lineWidth = 4.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(x, base - hgt * .7, tipx, tipy); g.stroke();
        var leaves = Math.floor(gr * 7);
        for (var i = 1; i <= leaves; i++) {
          var k = i / (leaves + 1), lx = x + (tipx - x) * k * k, ly = base + (tipy - base) * k, side = i % 2 ? 1 : -1, L0 = 14 + 6 * (1 - k), rot = side * (.42 + wilt * 1.1);
          g.save(); g.translate(lx, ly); g.rotate(rot); g.scale(side, 1);
          var lg = g.createLinearGradient(0, -6, L0 * 1.9, 6); lg.addColorStop(0, leafA); lg.addColorStop(1, leafB); g.fillStyle = lg;
          g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(L0 * .9, -L0 * .55, L0 * 1.9, 0); g.quadraticCurveTo(L0 * .9, L0 * .55, 0, 0); g.fill();
          g.strokeStyle = 'rgba(255,255,255,.34)'; g.lineWidth = .8; g.beginPath(); g.moveTo(1, 0); g.lineTo(L0 * 1.7, 0); g.stroke(); g.restore();
        }
      }
      var pg = g.createLinearGradient(x - 28, 0, x + 28, 0); pg.addColorStop(0, '#d79a6c'); pg.addColorStop(.45, '#b97243'); pg.addColorStop(1, '#6f3f1f'); g.fillStyle = pg;
      g.beginPath(); g.moveTo(x - 27, base + 3); g.lineTo(x + 27, base + 3); g.lineTo(x + 20, base + 36); g.quadraticCurveTo(x, base + 40, x - 20, base + 36); g.closePath(); g.fill();
      var rm = g.createLinearGradient(x - 32, 0, x + 32, 0); rm.addColorStop(0, '#e9b48a'); rm.addColorStop(1, '#8c5530'); g.fillStyle = rm; g.fillRect(x - 31, base - 4, 62, 9);
      g.fillStyle = '#2f1d10'; g.beginPath(); g.ellipse(x, base - 3, 27, 3.6, 0, 0, 7); g.fill();
      if (dim) { g.fillStyle = 'rgba(4,5,14,' + dim + ')'; g.fillRect(x - 60, 20, 120, 220); }
    };
    var S = sim(h, 240, function (g, W, H, t) {
      day = Math.min(7, t / 1.25);
      /* the sky outside goes through real days and nights as the week passes */
      var hour = day >= 7 ? 12 : (6 + (day % 1) * 24) % 24, sk = A.Sky.at(hour);
      var cssc = function (x) { return 'rgb(' + Math.round(x[0]) + ',' + Math.round(x[1]) + ',' + Math.round(x[2]) + ')'; };
      var bg = g.createLinearGradient(0, 0, 0, H - 28); bg.addColorStop(0, cssc(sk.top)); bg.addColorStop(.6, cssc(sk.mid)); bg.addColorStop(1, cssc(sk.low)); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      if (sk.sun.up) { var sx = W * sk.sun.t, sy = 200 - sk.sun.alt * 180, sg = g.createRadialGradient(sx, sy, 1, sx, sy, 60); sg.addColorStop(0, 'rgba(255,248,214,1)'); sg.addColorStop(.2, 'rgba(255,226,150,.65)'); sg.addColorStop(1, 'rgba(255,190,100,0)'); g.fillStyle = sg; g.fillRect(0, 0, W, H); }
      if (sk.night > .1) { var q = A.rng(9); g.fillStyle = '#fff'; g.globalAlpha = sk.night * .85; for (var si = 0; si < 42; si++) { g.fillRect(q.int(0, W), q.int(0, 170), 1.3, 1.3); } g.globalAlpha = 1; }
      /* the sill they sit on */
      var sill = g.createLinearGradient(0, H - 28, 0, H); sill.addColorStop(0, '#a97a4a'); sill.addColorStop(1, '#5e3c1f'); g.fillStyle = sill; g.fillRect(0, H - 28, W, 28);
      var gr = day / 7, base = H - 66;
      if (vary === 'water') {
        drawPlant(g, W * .27, base, .25 + gr * .75, 0, 0);
        drawPlant(g, W * .73, base, .25 + Math.min(gr, .15), Math.max(0, gr - .2) * .9, 0);
        txt(g, T('Watered'), W * .27, H - 9, '#fff', 13); txt(g, T('No water'), W * .73, H - 9, '#ffe6c4', 13);
      } else {
        /* one pot on the sill, the other shut in a cupboard: it never sees the sky */
        drawPlant(g, W * .27, base, .25 + gr * .75, 0, 0);
        var cb = g.createLinearGradient(W * .5, 0, W, 0); cb.addColorStop(0, '#20140a'); cb.addColorStop(1, '#0d0805'); g.fillStyle = cb; g.fillRect(W * .5, 0, W * .5, H - 28);
        g.strokeStyle = '#7a4f2a'; g.lineWidth = 6; g.strokeRect(W * .5 + 3, 3, W * .5 - 6, H - 34);
        drawPlant(g, W * .73, base, .25 + gr * .42, Math.max(0, gr - .4) * .7, .28);
        txt(g, T('By the window'), W * .27, H - 9, '#fff', 13); txt(g, T('In a dark cupboard'), W * .73, H - 9, '#e0d9c8', 13);
      }
      g.fillStyle = 'rgba(8,10,20,.55)'; g.beginPath(); g.roundRect ? g.roundRect(W / 2 - 42, 8, 84, 25, 12) : g.rect(W / 2 - 42, 8, 84, 25); g.fill();
      txt(g, T('Day') + ' ' + A.num(Math.floor(day) + 1 > 7 ? 7 : Math.floor(day) + 1), W / 2, 26, '#f1d59e', 15);
      if (day >= 7 && !S.reported) { S.reported = true; setTimeout(function () { done('first'); }, 500); }
    });
    c.setCleanup(S.stop);
  };

  /* ---- shadows: move the sun, watch the shadow ---- */
  SIMS.shadow = function (h, s, c, done) {
    var ang = .5, img = null, touched = false; artImg('tree', function (i) { img = i; });
    h.innerHTML = '';
    var S = sim(h, 220, function (g, W, H) {
      var sx = W / 2 + Math.cos(Math.PI * (1 - ang)) * 150, sy = 170 - Math.sin(Math.PI * ang) * 140, sk = A.Sky.at(5.8 + ang * 13);
      var cssc = function (x) { return 'rgb(' + Math.round(x[0]) + ',' + Math.round(x[1]) + ',' + Math.round(x[2]) + ')'; };
      var grd = g.createLinearGradient(0, 0, 0, 170); grd.addColorStop(0, cssc(sk.top)); grd.addColorStop(.6, cssc(sk.mid)); grd.addColorStop(1, cssc(sk.low)); g.fillStyle = grd; g.fillRect(0, 0, W, 170);
      var sg = g.createRadialGradient(sx, sy, 2, sx, sy, 90); sg.addColorStop(0, 'rgba(255,250,220,1)'); sg.addColorStop(.18, 'rgba(255,232,160,.8)'); sg.addColorStop(1, 'rgba(255,200,110,0)'); g.fillStyle = sg; g.fillRect(0, 0, W, 170);
      var gd = g.createLinearGradient(0, 170, 0, H); gd.addColorStop(0, '#caa86f'); gd.addColorStop(1, '#8e7043'); g.fillStyle = gd; g.fillRect(0, 170, W, 50);
      var tx = W / 2, ty = 176, tall = 92, len = Math.min(190, tall / Math.tan(Math.max(.11, Math.atan2(ty - sy, Math.abs(sx - tx))))), dir = sx < tx ? 1 : -1;
      /* the shadow falls away from the sun, soft at its far end */
      var shg = g.createLinearGradient(tx, 0, tx + dir * len, 0); shg.addColorStop(0, 'rgba(30,18,6,.58)'); shg.addColorStop(1, 'rgba(30,18,6,.18)'); g.fillStyle = shg;
      g.beginPath(); g.moveTo(tx - 6, ty); g.lineTo(tx + 6, ty); g.lineTo(tx + dir * len + 2, ty + 8); g.quadraticCurveTo(tx + dir * (len + 26), ty + 11, tx + dir * len, ty + 18); g.quadraticCurveTo(tx + dir * (len - 26), ty + 12, tx + dir * len * .7, ty + 7); g.closePath(); g.fill();
      if (img) g.drawImage(img, tx - 54, ty - 104, 108, 108);
    });
    c.setCleanup(S.stop);
    var r = document.createElement('input'); r.type = 'range'; r.min = 3; r.max = 97; r.value = 50; r.className = 'range'; r.setAttribute('aria-label', T('Move the sun')); r.style.marginTop = '8px'; h.appendChild(r);
    r.oninput = function () { ang = r.value / 100; if (!touched) { touched = true; setTimeout(function () { done('long'); }, 2400); } };
  };

  /* ---- pushes and surfaces ---- */
  SIMS.ramp = function (h, s, c, done) {
    var surf = 0, S = null, x = 0, v = 0, st = 'ready', res = {}, finished = false, doneT = 0;
    var SURF = [{ n: T('Carpet'), f: .985 - .06, c: ['#a1718e', '#6e4560'] }, { n: T('Wood'), f: .974, c: ['#c79660', '#7f5a30'] }, { n: T('Ice'), f: .996, c: ['#e3f6fd', '#9ad5ee'] }];
    function checkDone() {
      if (finished) return;
      var ks = Object.keys(res);
      if (ks.length < 2) return;
      finished = true;
      var mn = Math.min.apply(null, ks.map(Number)), mx = Math.max.apply(null, ks.map(Number));
      done(res[mx] > res[mn] ? 'far' : 'near');
    }
    S = sim(h, 190, function (g, W, H) {
      var sf = SURF[surf], wall = g.createLinearGradient(0, 0, 0, 140); wall.addColorStop(0, '#f2e7d2'); wall.addColorStop(1, '#d1bea0'); g.fillStyle = wall; g.fillRect(0, 0, W, 140);
      var fl = g.createLinearGradient(0, 140, 0, H); fl.addColorStop(0, sf.c[0]); fl.addColorStop(1, sf.c[1]); g.fillStyle = fl; g.fillRect(0, 140, W, 50);
      if (surf === 1) { g.strokeStyle = 'rgba(60,35,15,.3)'; g.lineWidth = 1; for (var pl = 0; pl < 5; pl++) { g.beginPath(); g.moveTo(0, 148 + pl * 9); g.lineTo(W, 148 + pl * 9); g.stroke(); } }
      if (surf === 2) { g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1; for (var pi = 0; pi < 7; pi++) { g.beginPath(); g.moveTo(40 + pi * 46, 150 + (pi % 3) * 12); g.lineTo(62 + pi * 46, 156 + (pi % 3) * 12); g.stroke(); } }
      var rp = g.createLinearGradient(0, 60, 84, 140); rp.addColorStop(0, '#d7a974'); rp.addColorStop(1, '#8a5c31'); g.fillStyle = rp; g.beginPath(); g.moveTo(0, 60); g.lineTo(84, 140); g.lineTo(0, 140); g.closePath(); g.fill();
      g.strokeStyle = '#6d4526'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 60); g.lineTo(84, 140); g.stroke();
      if (st === 'go') { if (x < 84) { v += .34; x += v; } else { x += v; v *= sf.f; } if (v < .08 && x >= 84) { st = 'done'; res[surf] = Math.round(x); doneT = setTimeout(checkDone, 200); } if (x > W - 14) { x = W - 14; st = 'done'; res[surf] = Math.round(x); checkDone(); } }
      var bx = Math.max(6, x), by = x < 84 ? 60 + x * (80 / 84) - 12 : 128, bcx = bx + 6;
      g.fillStyle = 'rgba(0,0,0,.26)'; g.beginPath(); g.ellipse(bcx + 3, by + 12, 12, 3, 0, 0, 7); g.fill();
      var bg = g.createRadialGradient(bcx - 4, by - 5, 1, bcx, by, 13); bg.addColorStop(0, '#fff'); bg.addColorStop(.25, '#ee7b9a'); bg.addColorStop(1, '#9c2a4f'); g.fillStyle = bg; g.beginPath(); g.arc(bcx, by, 12, 0, 7); g.fill();
      txt(g, sf.n, W - 50, 172, surf === 2 ? '#123' : '#fff', 15);
    });
    c.setCleanup(function () { clearTimeout(doneT); S.stop(); });
    var row = document.createElement('div'); row.className = 'sim-ctrl'; row.style.marginTop = '8px';
    row.innerHTML = SURF.map(function (x_, i) { return '<button class="tgl' + (i === 0 ? ' on' : '') + '" data-s="' + i + '">' + esc(x_.n) + '</button>'; }).join('') + '<button class="btn pri sm" data-go="1">' + esc(T('Let go')) + '</button>';
    h.appendChild(row);
    $$('[data-s]', row).forEach(function (b) { b.onclick = function () { surf = +b.dataset.s; x = 0; v = 0; st = 'ready'; $$('[data-s]', row).forEach(function (q) { q.classList.toggle('on', q === b); }); Fx.tap(); }; });
    $('[data-go]', row).onclick = function () { x = 0; v = 0; st = 'go'; Fx.tap(); };
  };

  /* ---- spinning earth: day and night, on a shaded globe ---- */
  /* the continents as soft patches of latitude and longitude: enough to recognise, not a survey */
  var LAND = [[8, 20, 22, 17], [28, 12, 12, 26], [-14, 24, 15, 11], [24, 45, 11, 11], [52, 25, 12, 28], [55, 78, 15, 42], [32, 80, 13, 21], [20, 78, 11, 7], [36, 112, 14, 16], [62, 120, 9, 34], [15, 103, 8, 7], [0, 112, 5, 14], [-25, 134, 10, 15], [48, -100, 15, 26], [60, -115, 10, 30], [32, -96, 9, 15], [18, -100, 7, 7], [70, -42, 8, 14], [-5, -60, 14, 13], [-22, -58, 12, 10], [-40, -68, 10, 5], [64, 16, 7, 9], [-78, 0, 8, 180]];
  var DESERT = { 1: 1, 3: 1, 12: 1 };
  SIMS.earth = function (h, s, c, done) {
    var a = 0, spin = .012, rep = false, qs = A.rng(4), stars = []; for (var i = 0; i < 70; i++) stars.push([qs.int(0, 340), qs.int(0, 220), qs() * 1.1 + .3, qs() * 6]);
    var CLOUDS = []; for (var k = 0; k < 16; k++) CLOUDS.push([qs.int(-60, 60), qs.int(0, 360), 6 + qs() * 7, 14 + qs() * 26]);
    function globePoint(lat, lon, rot, cx, cy, R) { var la = lat * Math.PI / 180, lo = lon * Math.PI / 180 + rot, x = Math.cos(la) * Math.sin(lo), yy = -Math.sin(la), z = Math.cos(la) * Math.cos(lo); return { x: cx + x * R, y: cy + yy * R, z: z }; }
    var S = sim(h, 220, function (g, W, H, t) {
      a += spin; if (a > Math.PI * 2 && !rep) { rep = true; done('spin'); }
      g.fillStyle = '#04060f'; g.fillRect(0, 0, W, H);
      stars.forEach(function (o) { g.globalAlpha = .5 + .5 * Math.sin(t * 1.2 + o[3]); g.fillStyle = '#fff'; g.fillRect(o[0], o[1], o[2], o[2]); }); g.globalAlpha = 1;
      /* the sun, off to the side, its light crossing the dark */
      var sg = g.createRadialGradient(-10, 110, 8, -10, 110, 180); sg.addColorStop(0, 'rgba(255,250,214,1)'); sg.addColorStop(.18, 'rgba(255,214,120,.92)'); sg.addColorStop(.42, 'rgba(255,170,70,.18)'); sg.addColorStop(1, 'rgba(255,150,60,0)'); g.fillStyle = sg; g.fillRect(0, 0, W, H);
      var cx = 216, cy = 110, R = 78;
      /* the air around the planet */
      var at = g.createRadialGradient(cx, cy, R * .94, cx, cy, R * 1.14); at.addColorStop(0, 'rgba(120,190,255,.55)'); at.addColorStop(1, 'rgba(120,190,255,0)'); g.fillStyle = at; g.beginPath(); g.arc(cx, cy, R * 1.14, 0, 7); g.fill();
      g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.clip();
      var oc = g.createRadialGradient(cx - R * .4, cy - R * .3, R * .1, cx, cy, R * 1.05); oc.addColorStop(0, '#3f9be0'); oc.addColorStop(.6, '#1d62ad'); oc.addColorStop(1, '#0d3a75'); g.fillStyle = oc; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      LAND.forEach(function (lp, li) {
        var p = globePoint(lp[0], lp[1], a, cx, cy, R); if (p.z < -.2) return;
        var fore = Math.max(.12, p.z), rx = lp[3] / 90 * R * fore * 1.28, ry = lp[2] / 90 * R * 1.22;
        var lc = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(rx, ry)); var col = li >= 22 || lp[0] > 66 ? '#eef5f8' : DESERT[li] ? '#c9ad6e' : Math.abs(lp[0]) < 16 ? '#2f8d4f' : '#5aa35e';
        lc.addColorStop(0, col); lc.addColorStop(.78, col); lc.addColorStop(1, 'rgba(90,160,100,0)'); g.fillStyle = lc;
        g.beginPath(); g.ellipse(p.x, p.y, rx, ry, 0, 0, 7); g.fill();
      });
      /* clouds go a little faster than the ground */
      CLOUDS.forEach(function (cl) { var p = globePoint(cl[0], cl[1], a * 1.15, cx, cy, R); if (p.z < .05) return; g.fillStyle = 'rgba(255,255,255,' + (.24 * p.z + .1) + ')'; g.beginPath(); g.ellipse(p.x, p.y, cl[3] / 90 * R * p.z, cl[2] / 90 * R * .7, 0, 0, 7); g.fill(); });
      /* night: the side turned from the sun */
      var nf = g.createRadialGradient(cx - R * .78, cy - R * .08, R * .3, cx - R * .3, cy, R * 1.5); nf.addColorStop(0, 'rgba(2,4,18,0)'); nf.addColorStop(.48, 'rgba(2,4,18,.05)'); nf.addColorStop(.72, 'rgba(2,4,18,.86)'); nf.addColorStop(1, 'rgba(2,4,18,.97)'); g.fillStyle = nf; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      /* lights in the towns on the night side */
      for (var ci = 0; ci < LAND.length - 1; ci++) { var lp2 = LAND[ci], pc = globePoint(lp2[0] + (ci % 3 - 1) * 5, lp2[1] + (ci % 2 ? 6 : -6), a, cx, cy, R); if (pc.z > .1 && pc.x > cx + R * .22) { g.fillStyle = 'rgba(255,214,130,.85)'; g.fillRect(pc.x, pc.y, 1.5, 1.5); g.fillRect(pc.x + 4, pc.y + 3, 1.1, 1.1); } }
      /* sunlight catching the near edge */
      var sp = g.createRadialGradient(cx - R * .62, cy - R * .22, 2, cx - R * .62, cy - R * .22, R * .55); sp.addColorStop(0, 'rgba(255,255,255,.3)'); sp.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = sp; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
      g.restore();
      /* you, on the spinning ground */
      var ang = a % (Math.PI * 2), vx = Math.sin(ang), vz = Math.cos(ang);
      if (vz > -0.2) { var mx = cx + vx * R * .94, dayHere = vx < .1; g.strokeStyle = '#fff'; g.lineWidth = 2; g.fillStyle = '#f1d59e'; g.beginPath(); g.arc(mx, cy, 5, 0, 7); g.fill(); g.stroke(); g.fillStyle = 'rgba(6,8,18,.7)'; var tw = 84, tx = Math.min(292, Math.max(62, mx)); g.fillRect(tx - tw / 2, cy - R - 22, tw, 21); txt(g, dayHere ? T('Day here') : T('Night here'), tx, cy - R - 6, '#f1d59e', 14); }
    });
    c.setCleanup(S.stop);
  };

  /* ---- the moon through a Hijri month: the real disc, in its phase ---- */
  SIMS.moon = function (h, s, c, done) {
    var age = s.real ? A.moonAge() : 1, touched = false, disc = null, qs = A.rng(9), stars = [];
    for (var i = 0; i < 80; i++) stars.push([qs.int(0, 340), qs.int(0, 220), qs() * 1.1 + .3, qs() * 6]);
    if (A.Sky && !A.Sky.drawMoon && A.Sky.moonDisc) A.Sky.moonDisc(62, function (cv) { disc = cv; });
    var S = sim(h, 220, function (g, W, H, t) {
      var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#04071c'); bg.addColorStop(1, '#141a48'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      var cx = W / 2, cy = 92, R = 62, full = Math.cos((age / 29.53) * Math.PI * 2);
      stars.forEach(function (o) {
        if (Math.hypot(o[0] - cx, o[1] - cy) < R * 1.15) return;
        g.globalAlpha = .55 + .45 * Math.sin(t * 1.4 + o[3]); g.fillStyle = '#fff'; g.fillRect(o[0], o[1], o[2], o[2]);
      });
      g.globalAlpha = 1;
      var halo = g.createRadialGradient(cx, cy, R * .8, cx, cy, R * 2.1); halo.addColorStop(0, 'rgba(255,244,214,' + (.2 + (1 - full) * .1) + ')'); halo.addColorStop(1, 'rgba(255,244,214,0)'); g.fillStyle = halo; g.fillRect(0, 0, W, H);
      if (A.Sky && A.Sky.drawMoon) A.Sky.drawMoon(g, cx, cy, R, age, 1);
      else {
        if (disc) {
          g.globalAlpha = .14; g.drawImage(disc, cx - R, cy - R, R * 2, R * 2); g.globalAlpha = 1;
        }
        g.save(); g.clip(new Path2D(A.moonPath(cx, cy, R, age)));
        if (disc) g.drawImage(disc, cx - R, cy - R, R * 2, R * 2);
        else { g.fillStyle = '#e5d9c1'; g.fillRect(cx - R, cy - R, R * 2, R * 2); }
        g.restore();
      }
      txt(g, T('Day') + ' ' + A.num(Math.max(1, Math.round(age))) + ' ' + T('of the Hijri month'), cx, 190, '#f1d59e', 15);
    });
    c.setCleanup(S.stop);
    var r = document.createElement('input'); r.type = 'range'; r.min = 1; r.max = 29; r.value = Math.max(1, Math.round(age)); r.className = 'range'; r.setAttribute('aria-label', T('Day of the month')); r.style.marginTop = '8px'; h.appendChild(r);
    r.oninput = function () { age = +r.value; if (!touched) { touched = true; setTimeout(function () { done('grow'); }, 1800); } };
    if (s.real) done('grow');
  };

  /* ---- water: heat it, cool it ---- */
  SIMS.states = function (h, s, c, done) {
    var temp = -10, ps = []; for (var i = 0; i < 90; i++) ps.push({ x: 40 + Math.random() * 260, y: 90 + Math.random() * 110, vx: 0, vy: 0, ox: 70 + (i % 15) * 14, oy: 120 + Math.floor(i / 15) * 13 });
    var seen = {};
    var S = sim(h, 230, function (g, W, H) {
      var st = temp < 0 ? 0 : temp < 100 ? 1 : 2;
      seen[st] = 1;
      g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 3; g.strokeRect(30, 34, W - 60, H - 50);
      ps.forEach(function (p) {
        if (st === 0) { p.x += (p.ox - p.x) * .1; p.y += (p.oy - p.y) * .1; p.x += (Math.random() - .5) * .5; }
        else if (st === 1) { p.vx += (Math.random() - .5) * .5; p.vy += .2 + (Math.random() - .5) * .3; p.vx *= .95; p.vy *= .95; p.x += p.vx; p.y += p.vy; if (p.y > H - 22) { p.y = H - 22; p.vy *= -.3; } if (p.y < 110) p.vy += .3; }
        else { p.vx += (Math.random() - .5) * 1.2; p.vy += (Math.random() - .6) * 1.2; p.vx *= .98; p.vy *= .98; p.x += p.vx; p.y += p.vy; if (p.y < 40) { p.y = 40; p.vy *= -1; } if (p.y > H - 22) { p.y = H - 22; p.vy *= -1; } }
        if (p.x < 36) { p.x = 36; p.vx *= -1; } if (p.x > W - 36) { p.x = W - 36; p.vx *= -1; }
        g.fillStyle = st === 0 ? '#c9eefc' : st === 1 ? '#54b3ec' : 'rgba(220,240,255,.75)'; g.beginPath(); g.arc(p.x, p.y, st === 2 ? 3 : 4.4, 0, 7); g.fill();
      });
      txt(g, [T('Ice: solid'), T('Water: liquid'), T('Steam: gas')][st] + ' · ' + A.num(Math.round(temp)) + '°', W / 2, 24, '#f1d59e', 15);
      if (seen[0] && seen[1] && seen[2] && !S.rep) { S.rep = true; done('all'); }
    });
    c.setCleanup(S.stop);
    var r = document.createElement('input'); r.type = 'range'; r.min = -20; r.max = 120; r.value = -10; r.className = 'range'; r.setAttribute('aria-label', T('Temperature')); r.style.marginTop = '8px'; h.appendChild(r);
    r.oninput = function () { temp = +r.value; };
  };

  /* ---- a circuit needs a full loop: copper, a cell, a brass switch and a bulb on a board ---- */
  SIMS.circuit = function (h, s, c, done) {
    var closed = false, rep = false, sw = 0;
    var S = sim(h, 220, function (g, W, H, t) {
      sw += ((closed ? 1 : 0) - sw) * .22;
      var lit = closed && sw > .9;
      var bd = g.createLinearGradient(0, 0, W, H); bd.addColorStop(0, '#b98a58'); bd.addColorStop(1, '#7c5429'); g.fillStyle = bd; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(60,34,14,.2)'; g.lineWidth = 1; for (var l = 0; l < 13; l++) { g.beginPath(); g.moveTo(0, 8 + l * 17); g.bezierCurveTo(W * .3, 4 + l * 17, W * .6, 13 + l * 17, W, 8 + l * 17); g.stroke(); }
      /* wires: a dark core under a copper line */
      var wire = function () { g.beginPath(); g.moveTo(80, 180); g.lineTo(40, 180); g.lineTo(40, 40); g.lineTo(150, 40); g.moveTo(190, 40); g.lineTo(300, 40); g.lineTo(300, 180); g.lineTo(220, 180); g.moveTo(130, 180); g.lineTo(170, 180); g.stroke(); };
      g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 7; g.save(); g.translate(1, 2); wire(); g.restore();
      g.strokeStyle = '#a4582a'; g.lineWidth = 6; wire(); g.strokeStyle = lit ? '#ffe2a4' : '#e9a673'; g.lineWidth = 2; wire();
      /* the cell */
      var cg = g.createLinearGradient(0, 164, 0, 196); cg.addColorStop(0, '#5a6480'); cg.addColorStop(.35, '#2a3049'); cg.addColorStop(1, '#10131f'); g.fillStyle = cg; g.fillRect(80, 164, 44, 32);
      var cp = g.createLinearGradient(0, 164, 0, 196); cp.addColorStop(0, '#fbe7b4'); cp.addColorStop(1, '#a8823e'); g.fillStyle = cp; g.fillRect(124, 168, 8, 24); g.fillRect(132, 174, 4, 12);
      txt(g, '+', 116, 186, '#fff', 15); txt(g, '−', 90, 186, '#fff', 15);
      /* the bulb */
      if (lit) { var gl = g.createRadialGradient(195, 180, 4, 195, 180, 96 + Math.sin(t * 8) * 4); gl.addColorStop(0, 'rgba(255,246,190,1)'); gl.addColorStop(.26, 'rgba(255,220,120,.7)'); gl.addColorStop(1, 'rgba(255,200,90,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H); }
      var sk = g.createLinearGradient(170, 0, 220, 0); sk.addColorStop(0, '#6f7a84'); sk.addColorStop(.5, '#e4e9ee'); sk.addColorStop(1, '#6f7a84'); g.fillStyle = sk; g.fillRect(186, 196, 18, 12);
      var bg = g.createRadialGradient(188, 170, 2, 195, 178, 24); if (lit) { bg.addColorStop(0, '#fffef0'); bg.addColorStop(1, '#ffe48c'); } else { bg.addColorStop(0, 'rgba(255,255,255,.75)'); bg.addColorStop(1, 'rgba(190,205,215,.5)'); } g.fillStyle = bg; g.beginPath(); g.arc(195, 178, 22, 0, 7); g.fill();
      g.strokeStyle = lit ? '#fff' : '#6d6a60'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(190, 196); g.lineTo(189, 180); g.lineTo(192, 174); g.lineTo(195, 180); g.lineTo(198, 174); g.lineTo(201, 180); g.lineTo(200, 196); g.stroke();
      /* the switch */
      [150, 190].forEach(function (x) { g.fillStyle = '#7a5a1c'; g.beginPath(); g.arc(x, 40, 7, 0, 7); g.fill(); g.fillStyle = '#f1d59e'; g.beginPath(); g.arc(x - 1, 39, 4, 0, 7); g.fill(); });
      var eX = 150 + Math.cos(-.7 * (1 - sw)) * 40, eY = 40 + Math.sin(-.7 * (1 - sw)) * 40;
      g.strokeStyle = '#7a5a1c'; g.lineWidth = 7; g.beginPath(); g.moveTo(150, 40); g.lineTo(eX, eY); g.stroke(); g.strokeStyle = '#f6dda5'; g.lineWidth = 3; g.beginPath(); g.moveTo(150, 39); g.lineTo(eX, eY - 1); g.stroke();
      txt(g, closed ? T('Switch closed') : T('Switch open'), 170, 80, '#fff', 14);
      if (lit) { var p = (t * 80) % 500, seg = [[40, 180, 40, 40], [40, 40, 300, 40], [300, 40, 300, 180], [300, 180, 40, 180]]; for (var i = 0; i < 12; i++) { var q = (p + i * 42) % 680, L_ = [140, 260, 140, 260], k = 0; while (q > L_[k]) { q -= L_[k]; k++; if (k > 3) { k = 0; break; } } var sg = seg[k], f = q / L_[k]; g.fillStyle = '#fff'; g.beginPath(); g.arc(sg[0] + (sg[2] - sg[0]) * f, sg[1] + (sg[3] - sg[1]) * f, 2.6, 0, 7); g.fill(); } if (!rep) { rep = true; setTimeout(function () { done('lit'); }, 900); } }
    });
    c.setCleanup(S.stop);
    S.cv.onclick = function () { closed = !closed; Fx.clack(); };
    var row = document.createElement('div'); row.className = 'sim-ctrl'; row.style.marginTop = '8px'; row.innerHTML = '<button class="btn pri sm">' + esc(T('Flip the switch')) + '</button>'; h.appendChild(row);
    $('button', row).onclick = function () { closed = !closed; Fx.clack(); };
  };

  /* ---- Ibn al-Haytham's dark room ---- */
  SIMS.camera = function (h, s, c, done) {
    var hole = .3, rep = false;
    var S = sim(h, 220, function (g, W, H, t) {
      g.fillStyle = '#7ec1ea'; g.fillRect(0, 0, 130, H);
      g.fillStyle = '#5c9b6b'; g.fillRect(0, 170, 130, 50);
      g.fillStyle = '#7a5f3c'; g.fillRect(52, 90, 12, 80); g.fillStyle = '#49a86d'; g.beginPath(); g.arc(58, 80, 34, 0, 7); g.fill();
      g.fillStyle = '#0a0b14'; g.fillRect(130, 0, 210, H);
      g.fillStyle = '#2d2438'; g.fillRect(126, 0, 8, H);
      var gap = 4 + hole * 26, y0 = 110;
      g.fillStyle = '#c9eaff'; g.fillRect(126, y0 - gap / 2, 8, gap);
      g.globalAlpha = .16; g.strokeStyle = '#fff4c4'; g.lineWidth = 1 + hole * 10;
      g.beginPath(); g.moveTo(58, 60); g.lineTo(130, y0); g.lineTo(320, y0 + 92); g.moveTo(58, 170); g.lineTo(130, y0); g.lineTo(320, y0 - 92); g.stroke(); g.globalAlpha = 1;
      /* the image on the back wall, upside down, blurred by a large hole */
      g.save(); g.translate(322, y0); g.scale(1, -1); g.filter = 'blur(' + (hole * 7).toFixed(1) + 'px)'; g.globalAlpha = .4 + (1 - hole) * .5 * (1 - hole * .3);
      g.fillStyle = '#7a5f3c'; g.fillRect(-10, -18, 6, 60); g.fillStyle = '#49a86d'; g.beginPath(); g.arc(-7, -24, 24, 0, 7); g.fill(); g.restore();
      g.filter = 'none';
      txt(g, T('Dark room'), 230, 20, '#b8b3a8', 13);
      if (!rep && t > 2) { rep = true; done('upside'); }
    });
    c.setCleanup(S.stop);
    var r = document.createElement('input'); r.type = 'range'; r.min = 5; r.max = 100; r.value = 30; r.className = 'range'; r.setAttribute('aria-label', T('Size of the hole')); r.style.marginTop = '8px'; h.appendChild(r);
    r.oninput = function () { hole = r.value / 100; };
  };

  /* ---- the fair-test builder: change one thing ---- */
  I.fair = function (c) {
    var s = c.step, pick = {};
    c.el.innerHTML = '<div class="fair">' + s.rows.map(function (rw, i) { return '<div class="fair-row"><b>' + esc(L(rw)) + '</b><div class="segs"><button class="seg" data-r="' + i + '" data-v="change">' + esc(T('Change it')) + '</button><button class="seg" data-r="' + i + '" data-v="same">' + esc(T('Keep the same')) + '</button></div></div>'; }).join('') + '</div><div class="tf-go"><button class="btn pri big">' + A.icon('check', 22) + '<span>' + esc(T('Check')) + '</span></button></div>';
    $$('[data-r]', c.el).forEach(function (b) { b.onclick = function () { pick[b.dataset.r] = b.dataset.v; $$('[data-r="' + b.dataset.r + '"]', c.el).forEach(function (x) { x.classList.toggle('on', x === b); }); Fx.tap(); }; });
    $('.tf-go button', c.el).onclick = function () {
      var ch = Object.keys(pick).filter(function (k) { return pick[k] === 'change'; });
      if (Object.keys(pick).length < s.rows.length) { Fx.soft(); return; }
      if (ch.length === 1 && +ch[0] === s.change) c.ok($('.fair', c.el));
      else c.bad('understanding', $('.fair', c.el));
    };
    c.onReveal(function () { s.rows.forEach(function (_, i) { $$('[data-r="' + i + '"]', c.el).forEach(function (b) { b.classList.toggle('on', (b.dataset.v === 'change') === (i === s.change)); }); }); });
  };

  /* an observation log: dated, kept, no right answer */
  I.log = function (c) {
    var s = c.step;
    c.el.innerHTML = '<div class="ch c2">' + s.o.map(function (o, i) { return '<button class="opt" data-i="' + i + '">' + (o.art ? A.art(o.art, 64) : '') + '<span>' + esc(L(o.t)) + '</span></button>'; }).join('') + '</div>';
    $$('.opt', c.el).forEach(function (b) {
      b.onclick = function () {
        var o = s.o[+b.dataset.i], d = A.D();
        d.obs.push({ t: A.now().getTime(), kind: 'log', id: s.logId, title: L(s.logName || s.p), value: L(o.t) }); A.save();
        b.classList.add('right'); Fx.tap(); $$('.opt', c.el).forEach(function (x) { x.disabled = true; });
        c.ok(b, { delay: 700 });
      };
    });
  };
})();
