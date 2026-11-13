/* The courtyard sky: tied to the real clock and the real moon. The sky colours are interpolated through the day, so no two hours look
   alike. A supplied courtyard render sits in front when there is one; otherwise the masjid is drawn here, lit by the same sun. */
(function () {
  'use strict';
  var A = window.A;
  var Sky = A.Sky = {};
  var STOPS = [[0, '#040612', '#0a1030', '#161d47'], [4.8, '#060a20', '#141a48', '#2c2a5c'], [5.6, '#1a2260', '#7a4f86', '#e58f78'], [6.4, '#3560b0', '#d99a8a', '#fbd19a'], [8, '#2f7bd0', '#86bdea', '#ecdcc0'], [12, '#2376cc', '#62aeea', '#c9e6f4'], [15.5, '#2f6fc4', '#7db2e0', '#eedcb8'], [17.4, '#3a5aa8', '#d99a70', '#fbc988'], [18.4, '#28285f', '#a8557a', '#f5935e'], [19.2, '#101440', '#3c2a62', '#8a4a6e'], [20.2, '#060921', '#101640', '#221f50'], [24, '#040612', '#0a1030', '#161d47']];
  function rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function css(c, o) { var r = Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]); return o == null ? 'rgb(' + r + ')' : 'rgba(' + r + ',' + o + ')'; }
  function ramp(x, a, b) { return Math.max(0, Math.min(1, (x - a) / (b - a))); }
  function smooth(t) { return t * t * (3 - 2 * t); }

  /* everything the hour decides */
  Sky.at = function (h) {
    var i = 0; while (i < STOPS.length - 2 && h >= STOPS[i + 1][0]) i++;
    var a = STOPS[i], b = STOPS[i + 1], t = smooth(ramp(h, a[0], b[0]));
    var night = h < 12 ? 1 - smooth(ramp(h, 4.8, 6)) : smooth(ramp(h, 18.4, 20.2));
    var up = h >= 5.6 && h <= 19, sunT = (h - 5.6) / 13.4;
    var alt = up ? Math.sin(sunT * Math.PI) : 0, low = up ? 1 - ramp(alt, .05, .55) : 0;
    return {
      h: h, top: mix(rgb(a[1]), rgb(b[1]), t), mid: mix(rgb(a[2]), rgb(b[2]), t), low: mix(rgb(a[3]), rgb(b[3]), t), night: night,
      sun: { up: up, t: sunT, alt: alt, low: low },
      light: .16 + .84 * (1 - night) * (.42 + .58 * ramp(alt, 0, .62)),
      warm: low * (1 - night)
    };
  };
  /* a surface colour under this light */
  function lit(base, s, gain) {
    var c = rgb(base), l = Math.min(1.1, s.light * (gain || 1));
    var x = [c[0] * l, c[1] * l, c[2] * l];
    x = mix(x, [255, 150, 90], s.warm * .3);
    return mix(x, [24, 32, 74], s.night * .55);
  }

  /* ---------- the moon: a rendered disc when supplied, drawn otherwise, always in today's real phase ---------- */
  function moonDisc(r, cb) {
    var cv = document.createElement('canvas'), R = Math.ceil(r * 2);
    cv.width = cv.height = R; var g = cv.getContext('2d');
    if (A.hasImg('moon-disc')) { var im = new Image(); im.onload = function () { g.drawImage(im, 0, 0, R, R); cb(cv); }; im.onerror = function () { draw(); cb(cv); }; im.src = A.imgUrl('moon-disc'); return; }
    function draw() {
      var gr = g.createRadialGradient(r * .78, r * .72, r * .1, r, r, r);
      gr.addColorStop(0, '#fbf5e0'); gr.addColorStop(.75, '#e4dabb'); gr.addColorStop(1, '#b0a585');
      g.fillStyle = gr; g.beginPath(); g.arc(r, r, r, 0, 7); g.fill();
      var q = A.rng(19); g.globalCompositeOperation = 'source-atop';
      /* the seas, then a dusting of small craters */
      [[.62, .55, .26], [.82, .42, .2], [.98, .68, .23], [.72, .95, .3], [1.25, .85, .16], [1.15, .5, .14]].forEach(function (m) { var c = g.createRadialGradient(m[0] * r, m[1] * r, 0, m[0] * r, m[1] * r, m[2] * r * 1.4); c.addColorStop(0, 'rgba(120,114,100,.5)'); c.addColorStop(1, 'rgba(120,114,100,0)'); g.fillStyle = c; g.fillRect(0, 0, R, R); });
      for (var i = 0; i < 26; i++) { var a = q() * 6.28, d = Math.sqrt(q()) * r * .94, x = r + Math.cos(a) * d, y = r + Math.sin(a) * d, cr = r * (.012 + q() * .035); g.fillStyle = 'rgba(95,90,78,.3)'; g.beginPath(); g.arc(x, y, cr, 0, 7); g.fill(); g.fillStyle = 'rgba(255,250,232,.3)'; g.beginPath(); g.arc(x - cr * .35, y - cr * .35, cr * .55, 0, 7); g.fill(); }
      g.globalCompositeOperation = 'source-over';
    }
    draw(); cb(cv);
  }

  Sky.moonDisc = moonDisc;

  /* ---------- soft clouds, painted once, then re-coloured for the hour ---------- */
  function cloudSprite(seed) {
    var W = 420, H = 150, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var g = cv.getContext('2d'), q = A.rng(seed), n = 34;
    for (var i = 0; i < n; i++) {
      var t = i / n, x = 50 + t * (W - 100) + (q() - .5) * 26, env = Math.sin(t * Math.PI), r = (16 + q() * 32) * (.45 + env * .75), y = H * .68 - q() * env * 46;
      var gr = g.createRadialGradient(x, y, r * .15, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.55, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
    return cv;
  }
  function tintCloud(src, s) {
    var cv = document.createElement('canvas'); cv.width = src.width; cv.height = src.height;
    var g = cv.getContext('2d'); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-atop';
    var top = mix([255, 255, 255], [255, 196, 150], s.warm), bottom = mix(mix([158, 176, 205], [150, 100, 130], s.warm), [30, 36, 78], s.night);
    if (s.night > .5) top = mix(top, [90, 100, 150], s.night);
    var gr = g.createLinearGradient(0, 18, 0, src.height); gr.addColorStop(0, css(top, 1)); gr.addColorStop(.45, css(mix(top, bottom, .35), 1)); gr.addColorStop(1, css(bottom, 1));
    g.fillStyle = gr; g.fillRect(0, 0, cv.width, cv.height);
    return cv;
  }

  /* ---------- drawing the masjid ---------- */
  function dome(g, cx, base, w, h) {
    g.beginPath(); g.moveTo(cx - w, base);
    g.bezierCurveTo(cx - w * 1.1, base - h * .55, cx - w * .4, base - h * .72, cx, base - h);
    g.bezierCurveTo(cx + w * .4, base - h * .72, cx + w * 1.1, base - h * .55, cx + w, base);
    g.closePath();
  }
  function arch(g, x, y, w, h) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - h * .62); g.quadraticCurveTo(x, y - h * .9, x + w / 2, y - h); g.quadraticCurveTo(x + w, y - h * .9, x + w, y - h * .62); g.lineTo(x + w, y); g.closePath(); }
  function sunX(s) { return s.sun.up ? s.sun.t : .5; }
  function faceGrad(g, x0, x1, s, base, gain) {
    /* the side facing the sun is brighter, the far side falls into shade */
    var left = sunX(s) < .5, a = lit(base, s, (gain || 1) * (left ? 1.08 : .68)), b = lit(base, s, (gain || 1) * (left ? .68 : 1.08));
    var gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, css(a)); gr.addColorStop(1, css(b)); return gr;
  }
  function windowGlow(g, x, y, w, h, s) {
    var dark = lit('#39302a', s, .9), warm = [255, 206, 122], c = mix(dark, warm, s.night * .92);
    arch(g, x, y, w, h); g.fillStyle = css(c); g.fill();
    if (s.night > .35) { var cx = x + w / 2, cy = y - h / 2, rr = h * 1.5, gr = g.createRadialGradient(cx, cy, 0, cx, cy, rr); gr.addColorStop(0, 'rgba(255,200,110,' + (.32 * s.night) + ')'); gr.addColorStop(1, 'rgba(255,200,110,0)'); g.fillStyle = gr; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2); }
  }
  function minaret(g, x, top, ground, s) {
    var w = 26, st = '#ece0c6';
    g.fillStyle = faceGrad(g, x - w / 2, x + w / 2, s, st); g.fillRect(x - w / 2, top, w, ground - top);
    g.fillStyle = css(lit(st, s, .55)); [top + 72, top + 148].forEach(function (y) { g.fillRect(x - w / 2 - 7, y, w + 14, 7); });
    g.fillStyle = faceGrad(g, x - w / 2 - 9, x + w / 2 + 9, s, st, 1.04); [top + 64, top + 140].forEach(function (y) { g.fillRect(x - w / 2 - 9, y, w + 18, 9); });
    [top + 30, top + 105, top + 190].forEach(function (y) { windowGlow(g, x - 4, y + 22, 8, 22, s); });
    g.fillStyle = faceGrad(g, x - 13, x + 13, s, '#d9b26f', 1.05);
    dome(g, x, top + 2, 14, 54); g.fill();
    g.strokeStyle = css(lit('#a8823e', s, 1)); g.lineWidth = 2.4; g.beginPath(); g.moveTo(x, top - 50); g.lineTo(x, top - 68); g.stroke();
    g.fillStyle = css(lit('#e8c47c', s, 1.1)); g.beginPath(); g.arc(x, top - 66, 3.6, 0, 7); g.fill();
  }
  /* scene space is 1000 wide and 560 tall, anchored to the bottom of the hero */
  function paintFar(g, s, atm) {
    /* each distance is closer to the colour of the horizon */
    var far = mix(lit('#6d7f8c', s, .95), atm, .62), far2 = mix(lit('#5a6a66', s, .95), atm, .36);
    g.fillStyle = css(far); g.beginPath(); g.moveTo(0, 412); g.bezierCurveTo(140, 356, 240, 372, 370, 396); g.bezierCurveTo(500, 352, 640, 346, 760, 390); g.bezierCurveTo(850, 372, 930, 364, 1000, 388); g.lineTo(1000, 560); g.lineTo(0, 560); g.closePath(); g.fill();
    g.fillStyle = css(far2); g.beginPath(); g.moveTo(0, 452); g.bezierCurveTo(160, 416, 300, 428, 440, 452); g.bezierCurveTo(600, 420, 780, 418, 1000, 448); g.lineTo(1000, 560); g.lineTo(0, 560); g.closePath(); g.fill();
    /* houses of the town behind the courtyard */
    var q = A.rng(23), x = -6;
    while (x < 1010) {
      var w = 34 + q() * 46, h = 34 + q() * 54, y = 486 - h;
      g.fillStyle = faceGrad(g, x, x + w, s, q() < .5 ? '#d7c3a0' : '#c7ae88', .84); g.fillRect(x, y, w, h + 60);
      g.fillStyle = css(lit('#b19873', s, .7)); g.fillRect(x - 1, y - 3, w + 2, 4);
      for (var k = 0, n = Math.floor(w / 18); k < n; k++) if (q() < .55) { g.fillStyle = css(mix(lit('#4a3f34', s, .9), [255, 208, 130], s.night * (q() < .55 ? .95 : .1))); g.fillRect(x + 7 + k * 17, y + 11, 7, 11); }
      x += w + (q() < .2 ? 10 : 0);
    }
  }
  function paintMid(g, s, atm) {
    var ST = '#f0e4cc', G = 500;
    minaret(g, 306, 192, G, s); minaret(g, 694, 192, G, s);
    /* wings and arcade */
    g.fillStyle = faceGrad(g, 222, 778, s, ST, .92); g.fillRect(222, 414, 556, 90);
    g.fillStyle = css(lit('#c7ad7e', s, .86)); g.fillRect(216, 408, 568, 7);
    for (var i = 0; i < 16; i++) { if (i > 5 && i < 10) continue; windowGlow(g, 238 + i * 33.2, 494, 20, 58, s); }
    /* the hall */
    g.fillStyle = faceGrad(g, 370, 630, s, ST); g.fillRect(370, 356, 260, 148);
    g.fillStyle = css(lit('#c7ad7e', s, .9)); g.fillRect(362, 350, 276, 8);
    [[396, 408], [428, 408], [548, 408], [580, 408]].forEach(function (q) { windowGlow(g, q[0], q[1], 22, 38, s); });
    /* side domes */
    [404, 596].forEach(function (cx) { g.fillStyle = faceGrad(g, cx - 30, cx + 30, s, ST, .96); g.fillRect(cx - 28, 330, 56, 22); dome(g, cx, 332, 32, 60); g.fillStyle = faceGrad(g, cx - 32, cx + 32, s, '#d9b26f', 1); g.fill(); });
    /* the great drum and dome */
    g.fillStyle = faceGrad(g, 432, 568, s, ST, 1.02); g.fillRect(434, 306, 132, 46);
    for (var d = 0; d < 7; d++) windowGlow(g, 442 + d * 17.4, 345, 9, 28, s);
    g.fillStyle = css(lit('#c7ad7e', s, .9)); g.fillRect(428, 300, 144, 7);
    dome(g, 500, 302, 74, 138);
    var dg = g.createRadialGradient(500 + (sunX(s) - .5) * 92, 226, 8, 500, 262, 118), hi = lit('#f7dfa4', s, 1.14), mid = lit('#d6ab62', s, 1), lo = lit('#855f26', s, .85);
    dg.addColorStop(0, css(hi)); dg.addColorStop(.48, css(mid)); dg.addColorStop(1, css(lo)); g.fillStyle = dg; g.fill();
    g.strokeStyle = css(lit('#a8823e', s, 1)); g.lineWidth = 3; g.beginPath(); g.moveTo(500, 168); g.lineTo(500, 138); g.stroke();
    g.fillStyle = css(lit('#f1d59e', s, 1.1)); g.beginPath(); g.arc(500, 158, 5, 0, 7); g.fill();
    /* the great door */
    arch(g, 466, 504, 68, 104); g.fillStyle = css(lit('#c7ad7e', s, .8)); g.fill();
    arch(g, 474, 504, 52, 90); g.fillStyle = css(mix(lit('#3a2614', s, .9), [255, 196, 110], s.night * .8)); g.fill();
    /* the courtyard floor and low wall */
    g.fillStyle = faceGrad(g, 0, 1000, s, '#d6c19c', .8); g.fillRect(0, 500, 1000, 12);
    var fl = g.createLinearGradient(0, 508, 0, 560); fl.addColorStop(0, css(lit('#c1a982', s, .94))); fl.addColorStop(1, css(lit('#7d6c55', s, .8))); g.fillStyle = fl; g.fillRect(0, 508, 1000, 52);
  }
  function palm(g, W, H, s, flip, seed) {
    var q = A.rng(seed), bx = W * .5, by = H, tx = bx + (flip ? -18 : 18), ty = H * .34;
    var tr = g.createLinearGradient(bx - 12, 0, bx + 12, 0), a = lit('#8a6a42', s, .92), b = lit('#4f3820', s, .9); tr.addColorStop(0, css(sunX(s) < .5 ? a : b)); tr.addColorStop(1, css(sunX(s) < .5 ? b : a));
    g.fillStyle = tr; g.beginPath(); g.moveTo(bx - 12, by); g.quadraticCurveTo(bx - 8, H * .66, tx - 5, ty); g.lineTo(tx + 5, ty); g.quadraticCurveTo(bx + 11, H * .66, bx + 12, by); g.closePath(); g.fill();
    g.strokeStyle = css(lit('#3a2714', s, .82), .4); g.lineWidth = 1.4; for (var r = 0; r < 18; r++) { var t = r / 18, x = bx + (tx - bx) * t * t, y = by + (ty - by) * t, hw = 11 - 6 * t; g.beginPath(); g.moveTo(x - hw, y); g.quadraticCurveTo(x, y - 4, x + hw, y); g.stroke(); }
    var N = 11;
    for (var f = 0; f < N; f++) {
      var ang = -Math.PI * .98 + f / (N - 1) * Math.PI * .96 + (q() - .5) * .1, len = W * (.4 + q() * .1), droop = 50 + q() * 38;
      var ex = tx + Math.cos(ang) * len, ey = ty + Math.sin(ang) * len * .52 + droop, cx0 = tx + Math.cos(ang) * len * .55, cy0 = ty + Math.sin(ang) * len * .82 - 8;
      var col = lit(q() < .5 ? '#3d8a55' : '#2c7147', s, .94 + f / N * .14);
      for (var l = 0; l < 22; l++) {
        var u = (l + 1) / 23, mx = (1 - u) * (1 - u) * tx + 2 * (1 - u) * u * cx0 + u * u * ex, my = (1 - u) * (1 - u) * ty + 2 * (1 - u) * u * cy0 + u * u * ey;
        var size = (W * .16) * Math.sin(u * Math.PI * .86 + .22), dirX = (ex - cx0) * .012, side = l % 2 ? 1 : -1;
        g.strokeStyle = css(mix(col, [255, 255, 255], l % 5 === 0 ? .08 : 0)); g.lineWidth = 2.4 - u * 1.2; g.lineCap = 'round';
        g.beginPath(); g.moveTo(mx, my); g.quadraticCurveTo(mx + dirX * 16 + side * size * .3, my + side * size * .3, mx + dirX * 26 + side * size * .34, my + size * .78); g.stroke();
      }
      g.strokeStyle = css(lit('#6c8f4e', s, 1)); g.lineWidth = 2; g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(cx0, cy0, ex, ey); g.stroke();
    }
    /* the dates, hanging in the crown */
    for (var dd = 0; dd < 12; dd++) { g.fillStyle = css(lit(dd % 2 ? '#a9602a' : '#7c4218', s, 1)); g.beginPath(); g.ellipse(tx + (dd % 4 - 1.5) * 7 + (dd % 2 ? 2 : -2), ty + 10 + (dd % 3) * 7, 3.4, 4.8, 0, 0, 7); g.fill(); }
  }

  /* ---------- mounting ---------- */
  function canvas(cls, host) { var c = document.createElement('canvas'); c.className = cls; host.appendChild(c); return c; }
  var sprites = null;
  /* the courtyard, already graded for this hour and sized for this screen: coming back to it costs nothing */
  var fgCache = [];
  function fgLayer(name, filter, iw, ih, dpr, opacity, wrap, before, gone) {
    var key = name + '|' + filter + '|' + Math.round(iw), hit = fgCache.filter(function (x) { return x.key === key; })[0];
    if (hit) { hit.el.style.transition = 'none'; hit.el.style.opacity = opacity; wrap.insertBefore(hit.el, before); return; }
    var im = new Image(); im.alt = ''; im.src = A.imgUrl(name);
    var go = function () {
      if (gone() || !im.naturalWidth) return;
      var c = document.createElement('canvas'); c.className = 'sky-fg'; c.width = Math.min(im.naturalWidth, Math.round(iw * dpr)); c.height = Math.round(c.width * ih / iw);
      var x = c.getContext('2d');
      if (filter) { if ('filter' in x) x.filter = filter; else c.style.filter = filter; }
      x.drawImage(im, 0, 0, c.width, c.height);
      c.style.opacity = 0; wrap.insertBefore(c, before);
      fgCache.push({ key: key, el: c }); if (fgCache.length > 2) fgCache.shift();
      requestAnimationFrame(function () { c.style.transition = 'opacity .28s ease-out'; c.style.opacity = opacity; });
    };
    if (im.decode) im.decode().then(go, go); else im.onload = go;
  }
  /* the hour the scene shows. Auto follows the clock. A chosen Night or Day holds whatever the clock says. */
  Sky.hour = function () {
    var n = A.now(), h = n.getHours() + n.getMinutes() / 60, th = A.S && A.S.theme;
    if (th === 'dark' && h >= 5 && h < 19.5) return 21;
    if (th === 'light' && (h < 7 || h >= 17.5)) return 11;
    return h;
  };
  Sky.mount = function (host, opts) {
    opts = opts || {};
    var hour = function () { return opts.hour != null ? opts.hour : Sky.hour(); };
    var W = host.clientWidth || 360, H = host.clientHeight || 280, dpr = Math.min(devicePixelRatio || 1, 2);
    var back = document.createElement('div'); back.className = 'sky-back'; host.appendChild(back);
    var sky = canvas('sky-c', back); sky.width = W * dpr; sky.height = H * dpr;
    var g = sky.getContext('2d'); g.scale(dpr, dpr);
    var s = Sky.at(hour()), stopped = false, raf = 0;
    var horizon = H * .78;
    /* stars live above the horizon, a few of them bright */
    var q = A.rng(11), stars = []; for (var i = 0; i < 150; i++) stars.push({ x: q() * W, y: q() * horizon, r: q() < .08 ? 1.5 : .45 + q() * .7, p: q() * 6.28, sp: .5 + q() * 1.5, c: q() < .25 ? '#ffe7c4' : q() < .4 ? '#c9dcff' : '#ffffff' });
    if (!sprites) sprites = [cloudSprite(3), cloudSprite(7), cloudSprite(13)];
    var tinted = sprites.map(function (c) { return tintCloud(c, s); });
    var q2 = A.rng(5), clouds = []; for (var k = 0; k < 6; k++) clouds.push({ i: k % 3, x: q2() * W * 1.4 - W * .2, y: H * (.03 + q2() * .34), sc: (.45 + q2() * .75) * Math.max(1, W / 600), sp: 2 + q2() * 4 });
    var anims = [], birdT = 0;
    function drift(el, from, to, secs, atSecs) {
      if (A.reduced() || !el.animate) { el.style.transform = 'translate3d(' + (from + (to - from) * .4) + 'px,0,0)'; return null; }
      var an = el.animate([{ transform: 'translate3d(' + from + 'px,0,0)' }, { transform: 'translate3d(' + to + 'px,0,0)' }], { duration: secs * 1000, iterations: Infinity });
      an.currentTime = (atSecs || 0) * 1000; anims.push(an); return an;
    }
    var moon = null, moonAge = A.moonAge(), moonR = Math.max(16, Math.min(W, H) * .075);
    moonDisc(moonR, function (c) { moon = c; paint(0); });
    /* the moon rises and sets through its real phase: new with the sun, full opposite it */
    function moonPos() {
      var tr = (12 + moonAge / 29.530588853 * 24) % 24, ha = s.h - tr; if (ha > 12) ha -= 24; if (ha < -12) ha += 24;
      if (Math.abs(ha) > 6.3) return null;
      return { x: W * (.5 + ha / 6.3 * .42), y: horizon - Math.cos(ha / 6.3 * Math.PI / 2) * (horizon - moonR * 2.2) };
    }
    function paint(t) {
      var gr = g.createLinearGradient(0, 0, 0, horizon * 1.08); gr.addColorStop(0, css(s.top)); gr.addColorStop(.62, css(s.mid)); gr.addColorStop(1, css(s.low));
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.fillStyle = gr; g.fillRect(0, 0, W, H);
      if (s.night > .02) {
        stars.forEach(function (o) {
          if (o.r > 1.2) return;
          var tw = .55 + .45 * Math.sin(o.p), fade = 1 - o.y / horizon * .55;
          g.globalAlpha = s.night * tw * fade; g.fillStyle = o.c; g.beginPath(); g.arc(o.x, o.y, o.r, 0, 7); g.fill();
        });
        g.globalAlpha = 1;
      }
      /* the moon, in its phase, with a little earthshine on the dark part at night */
      var mp = moonPos();
      if (mp && moon) {
        var dayMoon = 1 - s.night;
        g.save(); g.translate(mp.x, mp.y);
        if (s.night > .3) { var halo = g.createRadialGradient(0, 0, moonR, 0, 0, moonR * 4); halo.addColorStop(0, 'rgba(255,244,214,' + (.22 * s.night) + ')'); halo.addColorStop(1, 'rgba(255,244,214,0)'); g.fillStyle = halo; g.fillRect(-moonR * 4, -moonR * 4, moonR * 8, moonR * 8); }
        var path = window.Path2D ? new Path2D(A.moonPath(0, 0, moonR, moonAge)) : null;
        g.globalAlpha = s.night * .13; g.drawImage(moon, -moonR, -moonR, moonR * 2, moonR * 2);
        g.globalAlpha = .96 - dayMoon * .5;
        if (path) { g.save(); g.clip(path); g.drawImage(moon, -moonR, -moonR, moonR * 2, moonR * 2); g.restore(); }
        g.restore(); g.globalAlpha = 1;
      }
      /* the sun, and the warmth it throws along the horizon */
      if (s.sun.up) {
        var sx = W * (.06 + s.sun.t * .88), sy = horizon + 8 - s.sun.alt * (horizon * .84), Rg = Math.max(W, H) * (.34 + s.sun.low * .3);
        g.globalCompositeOperation = 'lighter';
        var gl = g.createRadialGradient(sx, sy, 0, sx, sy, Rg); gl.addColorStop(0, 'rgba(255,240,196,.72)'); gl.addColorStop(.14, 'rgba(255,214,140,.32)'); gl.addColorStop(.5, 'rgba(255,170,96,' + (.06 + s.sun.low * .12) + ')'); gl.addColorStop(1, 'rgba(255,150,80,0)');
        g.fillStyle = gl; g.fillRect(0, 0, W, H);
        g.globalCompositeOperation = 'source-over';
        var rS = Math.max(13, Math.min(W, H) * .05), dc = g.createRadialGradient(sx, sy, 0, sx, sy, rS); dc.addColorStop(0, '#fffbe6'); dc.addColorStop(.75, '#fff0bd'); dc.addColorStop(1, 'rgba(255,226,150,0)');
        g.fillStyle = dc; g.beginPath(); g.arc(sx, sy, rS, 0, 7); g.fill();
      }
    }
    /* what moves is its own layer, drawn once and slid by the compositor, so the sky costs nothing per frame */
    tinted.length && clouds.forEach(function (c) {
      var cw = 420 * c.sc, ch = 150 * c.sc, el = document.createElement('canvas'), src = tinted[c.i]; el.className = 'sky-cloud'; el.width = src.width; el.height = src.height;
      el.getContext('2d').drawImage(src, 0, 0); el.style.cssText = 'width:' + cw + 'px;height:' + ch + 'px;top:' + c.y + 'px;opacity:' + (.92 - s.night * .72);
      back.appendChild(el);
      var dist = W + cw * 1.2; drift(el, -cw * .6, W + cw * .6, dist / c.sp, (c.x % dist) / c.sp);
    });
    /* the bright stars twinkle by themselves */
    if (s.night > .02) stars.forEach(function (o, i) {
      if (o.r <= 1.2) return;
      var el = document.createElement('i'); el.className = 'sky-star'; el.style.cssText = 'left:' + o.x + 'px;top:' + o.y + 'px;color:' + o.c + ';--o:' + (s.night * (1 - o.y / horizon * .55)).toFixed(2) + ';animation-duration:' + (2.6 + (i % 5) * .9) + 's;animation-delay:-' + (i % 7) * .7 + 's';
      back.appendChild(el);
    });
    /* now and then, birds crossing the day */
    function flock() {
      if (stopped || A.motion() !== 'full' || A.reduced() || s.night >= .2) return;
      var n = 4 + Math.floor(Math.random() * 4), dir = Math.random() < .5 ? 1 : -1, y = H * (.12 + Math.random() * .25), el = document.createElement('div'), col = css(mix(s.top, [20, 26, 48], .7), .8), html = '';
      for (var b = 0; b < n; b++) html += '<svg viewBox="0 0 12 6" style="left:' + (40 + (b % 2 ? b * 9 : -b * 7)) + 'px;top:' + (b * 3.4 + (b % 2 ? 4 : -2) + 8) + 'px;animation-delay:-' + (b * .13) + 's"><path d="M1 1Q4 4 6 5Q8 4 11 1" fill="none" stroke="' + col + '" stroke-width="1.1" stroke-linecap="round"/></svg>';
      el.className = 'sky-birds'; el.style.top = y + 'px'; el.innerHTML = html; back.appendChild(el);
      if (!el.animate) { el.remove(); return; }
      var an = el.animate([{ transform: 'translate3d(' + (dir > 0 ? -120 : W + 20) + 'px,0,0)' }, { transform: 'translate3d(' + (dir > 0 ? W + 20 : -120) + 'px,0,0)' }], { duration: 22000 });
      anims.push(an);
      an.onfinish = function () { el.remove(); anims.splice(anims.indexOf(an), 1); if (!stopped) birdT = setTimeout(flock, 16000 + Math.random() * 26000); };
    }
    birdT = setTimeout(flock, 3000);
    /* the foreground: render if supplied, drawn if not */
    var layers = [];
    if (opts.fg !== false) {
      if (A.hasImg('court-fg-day') || A.hasImg('court-fg-night')) {
        /* the sky has been cut out of the renders, so the real sky and the real moon sit behind the building */
        var iw = Math.max(W, (H * .94 + 26) * 1.5), ih = iw / 1.5, wrap = document.createElement('div');
        wrap.className = 'sky-fgw'; wrap.style.width = iw + 'px'; wrap.style.height = ih + 'px'; wrap.style.left = (W - iw) / 2 + 'px';
        wrap.style.top = (ih > H * .94 + 26 ? H * .08 : H - ih + 26) + 'px';
        var nightO = A.hasImg('court-fg-night') ? smooth(ramp(s.night, .22, .72)) : 0;
        /* small things that live: a slow shimmer on the pool, and the lanterns breathing after dusk */
        wrap.insertAdjacentHTML('beforeend', '<i class="sky-pool"></i>' + (s.night > .12 ? [[23.1, 74.2], [33.1, 69.5], [67, 69.5], [77.1, 74.2]].map(function (q, i) { return '<i class="sky-glow" style="left:' + q[0] + '%;top:' + q[1] + '%;--d:' + (i * 1.3) + 's;opacity:' + (.3 + s.night * .6).toFixed(2) + '"></i>'; }).join('') : ''));
        host.appendChild(wrap);
        var isGone = function () { return stopped; }, top0 = wrap.firstChild;
        if (nightO < .99 && A.hasImg('court-fg-day')) fgLayer('court-fg-day', 'brightness(' + (.42 + s.light * .6).toFixed(2) + ') saturate(' + (.78 + (1 - s.night) * .3).toFixed(2) + ') sepia(' + (s.warm * .38).toFixed(2) + ')', iw, ih, dpr, 1, wrap, top0, isGone);
        if (nightO > .01) fgLayer('court-fg-night', '', iw, ih, dpr, nightO.toFixed(2), wrap, top0, isGone);
        layers.push({ el: wrap, k: .1 });
      } else {
        var sc = Math.max(W / 1000, H / 560);
        var atm = s.low;
        var mk = function (cls, fn, k) {
          var c = canvas(cls, host); c.width = W * dpr; c.height = (H + 20) * dpr;
          var x = c.getContext('2d'); x.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * (W - 1000 * sc) / 2, dpr * (H + 20 - 560 * sc)); fn(x, s, atm);
          layers.push({ el: c, k: k });
        };
        mk('sky-l', paintFar, .18); mk('sky-l', paintMid, .08);
        var pw = Math.round(Math.max(170, 240 * sc)), ph = Math.round(pw * 1.55);
        [[0, 'l', 31], [1, 'r', 37]].forEach(function (o) {
          var c = canvas('sky-palm ' + o[1], host); c.width = pw * dpr; c.height = ph * dpr; c.style.width = pw + 'px'; c.style.height = ph + 'px';
          var x = c.getContext('2d'); x.scale(dpr, dpr); palm(x, pw, ph, s, !!o[0], o[2]);
        });
      }
    }
    var pending = false;
    function onScroll() {
      if (pending) return; pending = true;
      raf = requestAnimationFrame(function () {
        pending = false; if (stopped) return;
        var y = window.scrollY || 0; if (y > H * 1.3) return;
        back.style.transform = 'translate3d(0,' + (y * .3) + 'px,0)'; layers.forEach(function (l) { l.el.style.transform = 'translate3d(0,' + (y * l.k) + 'px,0)'; });
      });
    }
    /* nothing runs for what nobody can see */
    var io = window.IntersectionObserver ? new IntersectionObserver(function (es) {
      var on = es[es.length - 1].isIntersecting; host.classList.toggle('sky-off', !on); anims.forEach(function (x) { if (on) x.play(); else x.pause(); });
    }) : null;
    if (io) io.observe(host);
    paint(0);
    if (!A.reduced()) window.addEventListener('scroll', onScroll, { passive: true });
    return function () { stopped = true; cancelAnimationFrame(raf); clearTimeout(birdT); window.removeEventListener('scroll', onScroll); if (io) io.disconnect(); anims.forEach(function (x) { x.cancel(); }); };
  };
})();
