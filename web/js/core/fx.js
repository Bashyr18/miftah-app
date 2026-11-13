/* Motion and touch: the rosette bloom, the door, the key forge. Sounds are soft clicks and mechanical key noises made from
   filtered noise: never a note, chime or melody. */
(function () {
  'use strict';
  var A = window.A;
  var Fx = window.Fx = {};
  var ac = null;
  function ctx() { if (!ac) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; try { ac = new C(); } catch (e) { return null; } } if (ac.state === 'suspended') ac.resume(); return ac; }
  /* made once, kept: filling a buffer must never land on an animation frame */
  var bufs = {};
  function noiseBuf(c, dur) {
    var k = Math.round(dur * 100), b = bufs[k]; if (b) return b;
    var n = Math.floor(c.sampleRate * dur), d; b = bufs[k] = c.createBuffer(1, n, c.sampleRate); d = b.getChannelData(0);
    for (var i = 0; i < n; i++) { var e = 1 - i / n; d[i] = (Math.random() * 2 - 1) * e * e * e; }
    return b;
  }
  /* the sound system wakes in a quiet moment, not in the middle of the door */
  Fx.warmSound = function () {
    if (!A.S || !A.S.sound) return; var c = ctx(); if (!c) return;
    [.03, .04, .05, .07, .09, .12, .15, .16].forEach(function (d) { noiseBuf(c, d); });
    [1.5, 1.15].forEach(function (d) { noiseBuf(c, d); });
  };
  function noise(dur, freq, q, vol, at) {
    if (!A.S || !A.S.sound) return; var c = ctx(); if (!c) return;
    var b = noiseBuf(c, dur);
    var s = c.createBufferSource(); s.buffer = b;
    var f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    var g = c.createGain(); g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(c.currentTime + (at || 0));
  }
  Fx.tap = function () { A.N.haptic('tick'); };
  Fx.ok = function () { A.N.haptic('click'); };
  Fx.soft = function () { A.N.haptic('tick'); };
  Fx.clack = function () { noise(.03, 3200, 2, .5); noise(.06, 900, 2, .7, .09); noise(.09, 300, 1.2, .8, .16); A.N.haptic('heavy'); };
  Fx.success = function () { A.N.haptic('success'); };

  /* an overlay canvas for particles */
  var cv = null, cx = null, parts = [], raf = 0;
  function ensure() {
    if (cv) return;
    cv = document.createElement('canvas'); cv.id = 'fxc'; document.body.appendChild(cv);
    cx = cv.getContext('2d'); size(); addEventListener('resize', size);
  }
  function size() { var dpr = Math.min(devicePixelRatio || 1, 2); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function star8(c, x, y, r) { c.beginPath(); for (var i = 0; i < 16; i++) { var a = i / 16 * Math.PI * 2 + Math.PI / 16, rr = i % 2 ? r * .5 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }
  function loop() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(function (p) { return p.life > 0; });
    parts.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= p.dr; p.vy *= p.dr; p.life -= p.dec; p.rot = (p.rot || 0) + (p.sp || 0);
      cx.globalAlpha = Math.max(0, Math.min(1, p.life));
      if (p.ring) { cx.strokeStyle = p.c; cx.lineWidth = 2.4 * p.life; p.r += p.gr; star8(cx, p.x, p.y, p.r); cx.stroke(); return; }
      cx.fillStyle = p.c; star8(cx, p.x, p.y, p.r * (.5 + p.life * .5)); cx.fill();
    });
    cx.globalAlpha = 1;
    if (parts.length) raf = requestAnimationFrame(loop); else { raf = 0; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  /* correct: an eight-point star blossoms from the touch */
  Fx.bloom = function (x, y, color, big) { if (A.motion() !== 'full') return;
    if (A.reduced()) return;
    ensure();
    var c = color || '#f1d59e', n = big ? 42 : 18;
    parts.push({ x: x, y: y, vx: 0, vy: 0, g: 0, dr: 1, r: 8, gr: big ? 7 : 4, life: 1, dec: .034, c: c, ring: 1 });
    parts.push({ x: x, y: y, vx: 0, vy: 0, g: 0, dr: 1, r: 4, gr: big ? 5 : 2.6, life: .9, dec: .03, c: '#fff4d6', ring: 1 });
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2 + Math.random() * .2, v = (big ? 3 : 2) + Math.random() * (big ? 6 : 3);
      parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: .06, dr: .97, r: 2.2 + Math.random() * (big ? 5 : 3), life: 1, dec: .016 + Math.random() * .02, c: Math.random() < .35 ? '#fff4d6' : c });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  };
  Fx.bloomAt = function (el, color, big) { if (A.motion() !== 'full') return; if (!el) return; var r = el.getBoundingClientRect(); Fx.bloom(r.left + r.width / 2, r.top + r.height / 2, color, big); };
  Fx.shake = function (el) { if (!el || A.reduced()) return; el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }], { duration: 300, easing: 'ease-out' }); };
  Fx.pop = function (el) { if (A.motion() !== 'full') return; if (!el || A.reduced()) return; el.animate([{ transform: 'scale(.86)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 340, easing: 'cubic-bezier(.34,1.4,.5,1)' }); };

  /* ===== the door: every journey into a room passes through one =====
     Two carved leaves swing shut, a key turns in the lock, and the view moves forward through them as the room's light comes in. */
  var going = false;
  var lastFull = 0;
  /* the sounds of the door, from filtered noise: metal into metal, a bolt drawing, wood moving on its hinges */
  function doorSound(k, dur) {
    if (k === 'latch') { noise(.018, 3800, 6, .16); noise(.05, 900, 3, .22, .012); noise(.09, 160, 1.4, .3, .02); A.N.haptic('tick'); }
    else if (k === 'swing') { noise((dur || 1) * .9, 420, .7, .055, .05); noise((dur || 1) * .6, 190, .9, .05, .15); }
  }
  Fx.doorSound = doorSound;
  Fx.door = function (hue, route, label) {
    if (going) return;
    /* the door belongs to childhood: quick only at 12 to 14, unless they turn it off, and not at all from 15 unless they turn it on */
    var ageSt = A.P() ? A.stage() : 2, doorPref = A.P() && A.P().door;
    var today0 = A.day(), calmSkip = A.motion() === 'calm' && doorPref !== 'on' && (ageSt >= 3 || A.S.doorDay === today0);
    if (A.reduced() || doorPref === 'off' || calmSkip || (ageSt >= 4 && doorPref !== 'on')) { if (A.route() === route) A.rerender(); else A.go(route); return; }
    going = true; A.S.doorDay = today0; A.save();
    /* the whole ritual opens a sitting; after that, doors just open, or it would become a wait */
    var nowT = Date.now(), full = ageSt < 3 && nowT - lastFull > 20 * 60000;
    var gone = function () { if (A.route() === route) A.rerender(); else A.go(route); };
    var ok = window.Door && Door.play(hue || 'gold', full, { route: gone, sound: doorSound, done: function () { going = false; } });
    if (ok) { if (full) lastFull = nowT; return; }
    going = false; gone();
  };

  /* ===== the forge: light gathers into a new key ===== */
  Fx.forge = function (host, opts) {
    opts = opts || {};
    return new Promise(function (done) {
      var c = document.createElement('canvas'); c.className = 'forge-c'; host.appendChild(c);
      var W = host.clientWidth, H = host.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
      c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px';
      var g = c.getContext('2d'); g.scale(dpr, dpr);
      var size = Math.min(W, H) * .62, ox = W / 2 - size / 2, oy = H * .42 - size / 2;
      /* sample the key's true silhouette */
      var pts = [], off = document.createElement('canvas'); off.width = off.height = 200;
      var og = off.getContext('2d');
      function fromPath() {
        og.setTransform(2, 0, 0, 2, 0, 0); og.fillStyle = '#fff';
        var body = new Path2D('M50 4l7.3 8.8 11.3-2 2 11.3 11 7.5-5.500 10 5.500 10-11 7.500-2 11.300-11.300-2L50 75l-7.300-8.800-11.300 2-2-11.300-11-7.500 5.500-10-5.500-10 11-7.500 2-11.300 11.300 2z');
        og.fill(body); og.fillRect(45.5, 66, 9, 32); og.fillRect(54, 82, 15, 7); og.fillRect(54, 91, 11, 5);
        og.globalCompositeOperation = 'destination-out'; og.beginPath(); og.arc(50, 39.5, 12, 0, 7); og.fill();
      }
      function sample() {
        try { var im = og.getImageData(0, 0, 200, 200).data; for (var y = 0; y < 200; y += 3) for (var x = 0; x < 200; x += 3) if (im[(y * 200 + x) * 4 + 3] > 128) pts.push([ox + x / 200 * size, oy + y / 200 * size]); } catch (e) { pts = []; }
      }
      var img = A.hasImg('key-forged') ? new Image() : null;
      var go = function () {
        if (!pts.length) { og.setTransform(1, 0, 0, 1, 0, 0); og.clearRect(0, 0, 200, 200); og.globalCompositeOperation = 'source-over'; fromPath(); sample(); }
        run();
      };
      if (img) { img.onload = function () { og.drawImage(img, 0, 0, 200, 200); sample(); go(); }; img.onerror = go; img.src = A.imgUrl('key-forged'); } else { go(); }
      function run() {
      var P = pts.map(function (t) {
        var a = Math.random() * Math.PI * 2, r = Math.max(W, H) * (.6 + Math.random() * .6);
        return { tx: t[0], ty: t[1], x: W / 2 + Math.cos(a) * r, y: oy + size / 2 + Math.sin(a) * r, d: Math.random() * .35, s: .9 + Math.random() * 1.8 };
      });
      var t0 = performance.now(), D = A.reduced() ? 1 : 1500, clacked = false, stopped = false;
      function ease(t) { return 1 - Math.pow(1 - t, 3); }
      function frame(now) {
        if (stopped) return;
        var t = (now - t0) / D;
        g.clearRect(0, 0, W, H);
        g.globalCompositeOperation = 'lighter';
        for (var i = 0; i < P.length; i++) {
          var p = P[i], k = ease(Math.max(0, Math.min(1, (t - p.d) / (1 - p.d))));
          var x = p.x + (p.tx - p.x) * k, y = p.y + (p.ty - p.y) * k;
          var sz = p.s + (1 - k) * 2.4;
          g.fillStyle = k > .98 ? 'rgba(255,226,170,.8)' : 'rgba(255,190,110,' + (.28 + k * .34) + ')';
          g.beginPath(); g.arc(x, y, sz, 0, 7); g.fill();
        }
        g.globalCompositeOperation = 'source-over';
        if (t < 1.02) requestAnimationFrame(frame);
        else if (!clacked) {
          clacked = true;
          Fx.success();
          noise(.06, 900, 2, .6);
          done(c);
        }
      }
      requestAnimationFrame(frame);
      }
    });
  };
})();
