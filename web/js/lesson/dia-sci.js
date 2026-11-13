/* Science diagrams, drawn for each question: forces, atoms, particles, levers, waves, rays, circuits, inheritance, food chains, cells, pH.
   Same rules as dia.js: theme colours through classes, the child's digits, labels given as [en, ar] or plain text. */
(function () {
  'use strict';
  var A = window.A, Dia = window.Dia, H = Dia._, svg = H.svg, tx = H.tx, ln = H.ln, poly = H.poly, rect = H.rect, arc = H.arc, r1 = H.r1;
  var lab = function (x) { return Array.isArray(x) ? A.L(x) : x == null ? '' : String(x); };
  function arrow(x1, y1, x2, y2, cl) {
    var a = Math.atan2(y2 - y1, x2 - x1), h = 9, w = 5;
    var p = [[x2, y2], [x2 - h * Math.cos(a) + w * Math.sin(a), y2 - h * Math.sin(a) - w * Math.cos(a)], [x2 - h * Math.cos(a) - w * Math.sin(a), y2 - h * Math.sin(a) + w * Math.cos(a)]];
    return ln(x1, y1, x2 - h * .7 * Math.cos(a), y2 - h * .7 * Math.sin(a), cl || 'd-c') + '<polygon points="' + p.map(function (q) { return r1(q[0]) + ',' + r1(q[1]); }).join(' ') + '" class="d-a"/>';
  }
  function dot(x, y, r, cl) { return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r + '" class="' + (cl || 'd-a') + '"/>'; }

  /* a box with the forces on it. o: {l, r, u, d} in newtons (or text), and m: what is inside the box */
  Dia.forces = function (o) {
    var cx = 160, cy = 88, bw = 74, bh = 50, vals = ['l', 'r', 'u', 'd'].map(function (k) { return typeof o[k] === 'number' ? o[k] : 0; }), mx = Math.max.apply(null, vals.concat([1]));
    var len = function (v) { return typeof v === 'number' ? 22 + 58 * v / mx : 50; }, b = rect(cx - bw / 2, cy - bh / 2, bw, bh, 'd-f', 6);
    if (o.m != null) b += tx(cx, cy + 6, lab(o.m), { s: 15 });
    var unit = o.unit == null ? ' N' : o.unit, t = function (v) { return typeof v === 'number' ? v + unit : lab(v); };
    if (o.r != null) { var L1 = len(o.r); b += arrow(cx + bw / 2, cy, cx + bw / 2 + L1, cy) + tx(cx + bw / 2 + L1 / 2, cy - 10, t(o.r), { s: 13, c: 'd-ta' }); }
    if (o.l != null) { var L2 = len(o.l); b += arrow(cx - bw / 2, cy, cx - bw / 2 - L2, cy) + tx(cx - bw / 2 - L2 / 2, cy - 10, t(o.l), { s: 13, c: 'd-ta' }); }
    if (o.u != null) { var L3 = Math.min(len(o.u), 58); b += arrow(cx, cy - bh / 2, cx, cy - bh / 2 - L3) + tx(cx + 12, cy - bh / 2 - L3 / 2 + 4, t(o.u), { s: 13, a: 'start', c: 'd-ta' }); }
    if (o.d != null) { var L4 = Math.min(len(o.d), 58); b += arrow(cx, cy + bh / 2, cx, cy + bh / 2 + L4) + tx(cx + 12, cy + bh / 2 + L4 / 2 + 4, t(o.d), { s: 13, a: 'start', c: 'd-ta' }); }
    return svg(320, 176, b);
  };

  /* an atom: electrons on their shells round a nucleus. atom([2, 8, 1], 'Na') */
  Dia.atom = function (shells, sym) {
    var cx = 160, cy = 92, b = '';
    shells.forEach(function (n, i) {
      var R = 32 + i * 20; b += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" class="d-l"/>';
      for (var k = 0; k < n; k++) { var a = -Math.PI / 2 + k * 2 * Math.PI / n + i * .4; b += dot(cx + R * Math.cos(a), cy + R * Math.sin(a), 4.5); }
    });
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="19" class="d-g0"/>' + tx(cx, cy + 5, sym || '', { s: 14 });
    return svg(320, 184, b);
  };

  /* particles in a solid, a liquid or a gas */
  var LIQ = [[12, 14], [34, 12], [58, 18], [82, 13], [104, 16], [20, 36], [45, 38], [70, 40], [95, 37], [13, 60], [37, 61], [62, 63], [86, 60], [108, 59], [26, 84], [50, 86], [76, 85], [100, 83]];
  var GAS = [[18, 16], [84, 22], [52, 50], [106, 66], [20, 82], [70, 92]];
  Dia.particles = function (state, label) {
    var x0 = 100, y0 = 26, b = rect(x0, y0, 120, 104, 'd-f', 4), r = 10;
    if (state === 'solid') for (var i = 0; i < 5; i++) for (var j = 0; j < 5; j++) b += dot(x0 + 15 + i * 22.5, y0 + 15 + j * 18.5, 9, 'd-g0');
    else (state === 'liquid' ? LIQ : GAS).forEach(function (p) { b += dot(x0 + p[0], y0 + p[1] + 4, r - 1, 'd-g0'); });
    if (state === 'gas') GAS.forEach(function (p, k) { var a = k * 1.7; b += arrow(x0 + p[0], y0 + p[1] + 4, x0 + p[0] + 16 * Math.cos(a), y0 + p[1] + 4 + 16 * Math.sin(a), 'd-m'); });
    if (label != null) b += tx(160, 18, lab(label), { s: 14 });
    return svg(320, 140, b);
  };

  /* two regions either side of a membrane, with particles in each, and the way they spread */
  Dia.conc = function (nl, nr, labs) {
    var b = rect(20, 20, 280, 110, 'd-f', 6) + '<line x1="160" y1="20" x2="160" y2="130" class="d-m2" stroke-dasharray="6 5"/>', k = 0;
    function fill(nn, x0) { for (var i = 0; i < nn; i++) { var cx = x0 + 18 + (i * 37) % 112, cy = 36 + Math.floor(i * 37 / 112) * 18 + (i % 2) * 6; if (cy < 124) b += dot(cx, cy, 6, 'd-g0'); } }
    fill(nl, 22); fill(nr, 162);
    if (nl !== nr) b += nl > nr ? arrow(132, 75, 190, 75, 'd-m') : arrow(188, 75, 130, 75, 'd-m');
    if (labs) b += tx(90, 148, lab(labs[0]), { s: 12 }) + tx(230, 148, lab(labs[1]), { s: 12 });
    return svg(320, labs ? 156 : 140, b);
  };

  /* a lever on a pivot. o: {lf, ld, rf, rd}: force and distance each side; any may be '?' */
  Dia.lever = function (o) {
    var cx = 160, y = 74, mx = Math.max(+o.ld || 1, +o.rd || 1, 1), sc = 122 / mx, b = ln(24, y, 296, y, 'd-c');
    b += poly([[cx, y + 2], [cx - 14, y + 28], [cx + 14, y + 28]], 'd-f');
    function side(f, d, dir) {
      var x = cx + dir * (isNaN(+d) ? 90 : +d * sc), s = '';
      s += arrow(x, y - 52, x, y - 4) + tx(x, y - 58, f + (isNaN(+f) ? '' : ' N'), { s: 13, c: 'd-ta' });
      s += ln(cx, y + 38, x, y + 38, 'd-m2') + tx((cx + x) / 2, y + 56, d + (isNaN(+d) ? '' : ' m'), { s: 13 });
      return s;
    }
    if (o.lf != null) b += side(o.lf, o.ld, -1);
    if (o.rf != null) b += side(o.rf, o.rd, 1);
    return svg(320, 140, b);
  };

  /* a wave. o: {n: cycles, lam: label for the wavelength, amp: label for the amplitude} */
  Dia.wave = function (o) {
    var n = o.n || 2, x0 = 20, W = 280, mid = 80, A0 = 36, d = '';
    for (var i = 0; i <= 120; i++) { var x = x0 + W * i / 120, yv = mid - A0 * Math.sin(2 * Math.PI * n * i / 120); d += (i ? 'L' : 'M') + r1(x) + ' ' + r1(yv) + ' '; }
    var b = ln(x0, mid, x0 + W, mid, 'd-l') + '<path d="' + d + '" class="d-c"/>', wl = W / n, p1 = x0 + wl / 4;
    if (o.lam != null) b += ln(p1, 30, p1 + wl, 30, 'd-m2') + ln(p1, 26, p1, 34, 'd-m2') + ln(p1 + wl, 26, p1 + wl, 34, 'd-m2') + tx(p1 + wl / 2, 22, lab(o.lam), { s: 13, c: 'd-ta' });
    if (o.amp != null) { var xa = x0 + wl * 1.25; b += ln(xa, mid, xa, mid - A0, 'd-m2') + tx(xa + 8, mid - A0 / 2 + 4, lab(o.amp), { s: 13, a: 'start' }); }
    return svg(320, 132, b);
  };

  /* light meeting a surface: reflect or refract. o: {i, r: degrees from the normal, kind, top, bottom} */
  Dia.ray = function (o) {
    var cx = 160, cy = 96, R = 82, ri = (o.i || 40) * Math.PI / 180, b = '';
    if (o.kind === 'refract') b += rect(20, cy, 280, 70, 'd-g1');
    b += ln(20, cy, 300, cy) + '<line x1="' + cx + '" y1="12" x2="' + cx + '" y2="' + (cy + 70) + '" class="d-m2" stroke-dasharray="5 5"/>';
    b += arrow(cx - R * Math.sin(ri), cy - R * Math.cos(ri), cx, cy);
    b += arc(cx, cy, 34, 90, 90 + (o.i || 40), 'd-m') + tx(cx - 16, cy - 40, o.il != null ? o.il : (o.i || 40) + '°', { s: 12, a: 'end', c: 'd-ta' });
    if (o.kind === 'refract') { var rr = (o.r || 25) * Math.PI / 180; b += arrow(cx, cy, cx + 66 * Math.sin(rr), cy + 66 * Math.cos(rr)); b += arc(cx, cy, 30, 270, 270 + (o.r || 25), 'd-m') + tx(cx + 16, cy + 46, o.rl != null ? o.rl : (o.r || 25) + '°', { s: 12, a: 'start', c: 'd-ta' }); }
    else { var ro = (o.r == null ? o.i || 40 : o.r) * Math.PI / 180; b += arrow(cx, cy, cx + R * Math.sin(ro), cy - R * Math.cos(ro)); b += arc(cx, cy, 34, 90 - (o.r == null ? o.i || 40 : o.r), 90, 'd-m') + tx(cx + 16, cy - 40, o.rl != null ? o.rl : (o.r == null ? o.i || 40 : o.r) + '°', { s: 12, a: 'start', c: 'd-ta' }); }
    if (o.top != null) b += tx(28, 24, lab(o.top), { s: 13, a: 'start' });
    if (o.bottom != null) b += tx(28, cy + 60, lab(o.bottom), { s: 13, a: 'start' });
    return svg(320, 172, b);
  };

  /* a circuit: a cell and n parts in series or in parallel. o: {kind, n, cell: label, parts: [labels], res: true for resistors} */
  function part(x, y, vert, res) {
    if (res) return vert ? rect(x - 8, y - 16, 16, 32, 'd-f', 2) : rect(x - 16, y - 8, 32, 16, 'd-f', 2);
    return '<circle cx="' + x + '" cy="' + y + '" r="12" class="d-f"/>' + ln(x - 8, y - 8, x + 8, y + 8, 'd-s') + ln(x - 8, y + 8, x + 8, y - 8, 'd-s');
  }
  Dia.circuit = function (o) {
    var n = o.n || 2, L = 40, R = 280, T = 30, B = 140, b = '', parts = o.parts || [];
    /* the cell, on the left side: long and short plates */
    var cy = (T + B) / 2;
    b += ln(L, T, L, cy - 10, 'd-c') + ln(L, cy + 10, L, B, 'd-c') + ln(L - 14, cy - 6, L + 14, cy - 6, 'd-s') + ln(L - 7, cy + 6, L + 7, cy + 6, 'd-s');
    if (o.cell != null) b += tx(L + 20, cy + 5, lab(o.cell), { s: 13, a: 'start', c: 'd-ta' });
    if (o.kind === 'parallel') {
      b += ln(L, T, R, T, 'd-c') + ln(L, B, R, B, 'd-c');
      for (var i = 0; i < n; i++) { var x = 130 + i * (150 / Math.max(1, n - 1 || 1)); if (n === 1) x = 200; b += ln(x, T, x, cy - 13, 'd-c') + ln(x, cy + 13, x, B, 'd-c') + part(x, cy, true, o.res); if (parts[i] != null) b += tx(x + 18, cy + 5, lab(parts[i]), { s: 12, a: 'start' }); }
    } else {
      b += ln(L, B, R, B, 'd-c') + ln(R, T, R, B, 'd-c');
      var seg = (R - L) / (n + 1), px = L;
      for (var k = 0; k < n; k++) { var x2 = L + seg * (k + 1); b += ln(px, T, x2 - 14, T, 'd-c') + part(x2, T, false, o.res); if (parts[k] != null) b += tx(x2, T + 30, lab(parts[k]), { s: 12 }); px = x2 + 14; }
      b += ln(px, T, R, T, 'd-c');
    }
    return svg(320, 160, b);
  };

  /* a Punnett square for two parents, each two letters: punnett('Bb', 'bb') */
  Dia.punnett = function (p, q, hide) {
    var x0 = 110, y0 = 34, c = 54, b = '', kid = function (a, z) { return a < z ? a + z : z + a; };
    var order = function (a, z) { return a.toUpperCase() === a && z.toUpperCase() !== z ? a + z : z.toUpperCase() === z && a.toUpperCase() !== a ? z + a : kid(a, z); };
    for (var i = 0; i < 2; i++) { b += tx(x0 + c * i + c / 2, y0 - 10, p[i], { s: 16, c: 'd-ta' }); b += tx(x0 - 16, y0 + c * i + c / 2 + 6, q[i], { s: 16, c: 'd-ta' }); }
    for (var y = 0; y < 2; y++) for (var x = 0; x < 2; x++) { b += rect(x0 + c * x, y0 + c * y, c, c, 'd-g9'); if (!hide) b += tx(x0 + c * x + c / 2, y0 + c * y + c / 2 + 6, order(p[x], q[y]), { s: 16 }); }
    return svg(320, 150, b);
  };

  /* a pyramid of energy or numbers, bottom level first: pyramid([10000, 1000, 100], ['Plants', ...]) */
  Dia.pyramid = function (vals, labels) {
    var n = vals.length, h = 30, W = 280, b = '';
    for (var i = 0; i < n; i++) { var w = W * (1 - i / (n + .6)), y = 10 + (n - 1 - i) * (h + 4); b += rect(160 - w / 2, y, w, h, i ? 'd-g1' : 'd-g0', 3) + tx(160, y + 20, (labels && labels[i] != null ? lab(labels[i]) + ': ' : '') + vals[i], { s: 13 }); }
    return svg(320, 14 + n * (h + 4), b);
  };

  /* a cell, animal or plant, with its parts named. Natural colours, so a child can tell the parts apart in either theme */
  var BIO = { mem: 'stroke:#b98a3e;stroke-width:2.4', cyto: 'fill:rgba(236,196,120,.22)', nuc: 'fill:rgba(140,96,190,.55);stroke:#7a52a8;stroke-width:1.6', nucl: 'fill:#5b3a86', mito: 'fill:rgba(230,120,90,.75);stroke:#b5523a;stroke-width:1.2', cris: 'stroke:#fff3e6;stroke-width:1.1;fill:none;opacity:.85', chl: 'fill:rgba(70,160,80,.85);stroke:#2f7a3a;stroke-width:1.2', thy: 'stroke:#d9f2c8;stroke-width:1;fill:none;opacity:.8', vac: 'fill:rgba(120,180,230,.35);stroke:#5a92c4;stroke-width:1.4', wall: 'fill:rgba(120,170,90,.28);stroke:#5f8f45;stroke-width:3' };
  function blob(cx, cy, rx, ry, wob) { var d = '', n = 18; for (var i = 0; i <= n; i++) { var a = i / n * Math.PI * 2, k = 1 + wob * Math.sin(a * 3 + 1.3) + wob * .6 * Math.cos(a * 5); d += (i ? 'L' : 'M') + r1(cx + rx * k * Math.cos(a)) + ' ' + r1(cy + ry * k * Math.sin(a)); } return d + 'Z'; }
  function mito(x, y, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><ellipse rx="15" ry="7" style="' + BIO.mito + '"/><path d="M-10 0 q2.5 -5 5 0 q2.5 5 5 0 q2.5 -5 5 0 q2.5 5 5 0" style="' + BIO.cris + '"/></g>'; }
  function chloro(x, y, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><ellipse rx="13" ry="7" style="' + BIO.chl + '"/><path d="M-8 -2 h16 M-8 2 h16" style="' + BIO.thy + '"/></g>'; }
  Dia.cell = function (kind, names) {
    var b = '', nm = names || {}, plant = kind === 'plant';
    if (plant) {
      b += rect(26, 18, 172, 136, '', 14).replace('class=""', 'style="' + BIO.wall + '"');
      b += rect(34, 26, 156, 120, '', 10).replace('class=""', 'style="' + BIO.cyto + ';' + BIO.mem + '"');
      b += '<path d="' + blob(126, 86, 46, 38, .05) + '" style="' + BIO.vac + '"/>';
      b += '<circle cx="62" cy="58" r="15" style="' + BIO.nuc + '"/><circle cx="65" cy="55" r="4.5" style="' + BIO.nucl + '"/>';
      [[52, 120, 20], [86, 134, -10], [176, 46, 70], [178, 118, -60], [140, 36, 8]].forEach(function (p) { b += chloro(p[0], p[1], p[2]); });
      b += mito(52, 92, 80);
    } else {
      b += '<path d="' + blob(112, 86, 88, 62, .045) + '" style="' + BIO.cyto + ';' + BIO.mem + '"/>';
      b += '<circle cx="104" cy="82" r="21" style="' + BIO.nuc + '"/><circle cx="109" cy="77" r="6" style="' + BIO.nucl + '"/>';
      b += mito(58, 62, 25) + mito(158, 106, -20) + mito(76, 122, 10) + mito(162, 58, 60);
    }
    var rows = plant ? [['wall', 28, 24], ['membrane', 36, 34], ['vacuole', 150, 92], ['chloroplast', 178, 118], ['nucleus', 70, 60], ['mitochondrion', 56, 92]] : [['membrane', 196, 84], ['nucleus', 122, 80], ['mitochondrion', 170, 104], ['cytoplasm', 140, 136]];
    var shown = rows.filter(function (rw) { return nm[rw[0]] != null; });
    shown.forEach(function (rw, k) { var ty = 22 + k * (shown.length > 4 ? 25 : 32); b += '<circle cx="' + rw[1] + '" cy="' + rw[2] + '" r="2.4" class="d-a"/>' + ln(rw[1], rw[2], 222, ty - 4, 'd-m2') + tx(226, ty, lab(nm[rw[0]]), { s: 12, a: 'start' }); });
    return svg(320, 172, b);
  };

  /* the pH scale with a marker. Indicator colours are fixed: they are the real colours a child will see */
  var PH = ['#d7263d', '#e8473a', '#ef6f2e', '#f39a2b', '#f6c12a', '#e4d62b', '#b5d334', '#4caf50', '#2e9d77', '#1f8a9a', '#2463a8', '#3a4aa8', '#5b3aa0', '#6d2f93', '#7a2a86'];
  Dia.ph = function (v, labs) {
    var x0 = 12, w = 296 / 15, b = '';
    PH.forEach(function (c, i) { b += '<rect x="' + r1(x0 + i * w) + '" y="40" width="' + r1(w) + '" height="30" fill="' + c + '"/>' + tx(x0 + i * w + w / 2, 88, i, { s: 11 }); });
    if (v != null) b += arrow(x0 + v * w + w / 2, 10, x0 + v * w + w / 2, 38, 'd-s');
    if (labs) { b += tx(x0, 108, lab(labs[0]), { s: 12, a: 'start' }) + tx(160, 108, lab(labs[1]), { s: 12 }) + tx(308, 108, lab(labs[2]), { s: 12, a: 'end' }); }
    return svg(320, labs ? 116 : 96, b);
  };

  /* how energy changes through a reaction: products below the start is exothermic */
  Dia.profile = function (exo, labs) {
    var y0 = exo ? 70 : 120, y1 = exo ? 130 : 60, b = ln(30, 10, 30, 150) + ln(30, 150, 306, 150);
    b += '<path d="M40 ' + y0 + ' L100 ' + y0 + ' C140 ' + y0 + ' 140 22 170 22 C200 22 200 ' + y1 + ' 240 ' + y1 + ' L300 ' + y1 + '" class="d-c"/>';
    b += arrow(270, y0, 270, y1, 'd-m');
    if (labs) { b += tx(70, y0 - 8, lab(labs[0]), { s: 12 }) + tx(270, y1 + (exo ? 16 : -8), lab(labs[1]), { s: 12 }); }
    return svg(320, 160, b);
  };
})();
