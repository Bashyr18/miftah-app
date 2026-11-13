/* Diagrams drawn for each question, so geometry and number can be seen, not only read. Every function returns an SVG string.
   Colours come from the theme through classes, so they hold in light and dark. Numbers follow the child's language. */
(function () {
  'use strict';
  var A = window.A, N = function (x) { return A.bidi(A.esc(A.num(String(x)))); };
  var Dia = window.Dia = {};
  function svg(w, h, body, label) { return '<svg class="dia" viewBox="0 0 ' + w + ' ' + h + '" role="img"' + (label ? ' aria-label="' + A.esc(label) + '"' : ' aria-hidden="true"') + ' dir="ltr">' + body + '</svg>'; }
  function tx(x, y, t, o) { o = o || {}; return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (o.a || 'middle') + '" class="d-t' + (o.c ? ' ' + o.c : '') + '"' + (o.s ? ' font-size="' + o.s + '"' : '') + '>' + N(t) + '</text>'; }
  function r1(v) { return Math.round(v * 10) / 10; }
  function ln(a, b, c, d, cl) { return '<line x1="' + r1(a) + '" y1="' + r1(b) + '" x2="' + r1(c) + '" y2="' + r1(d) + '" class="' + (cl || 'd-s') + '"/>'; }
  function poly(pts, cl) { return '<polygon points="' + pts.map(function (p) { return r1(p[0]) + ',' + r1(p[1]); }).join(' ') + '" class="' + (cl || 'd-o') + '"/>'; }
  function rect(x, y, w, h, cl, rx) { return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" class="' + cl + '"' + (rx ? ' rx="' + rx + '"' : '') + '/>'; }
  function arc(cx, cy, r, a0, a1, cl) { var p = function (a) { return [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)]; }, s = p(a0), e = p(a1), large = Math.abs(a1 - a0) > 180 ? 1 : 0; return '<path d="M' + r1(s[0]) + ' ' + r1(s[1]) + ' A' + r + ' ' + r + ' 0 ' + large + ' 0 ' + r1(e[0]) + ' ' + r1(e[1]) + '" class="' + (cl || 'd-m') + '"/>'; }

  /* number line. o: {min, max, step, marks:{value:label}, hops:[[from,to]]} */
  Dia.line = function (o) {
    var W = 320, m = 18, x = function (v) { return m + (v - o.min) / (o.max - o.min) * (W - 2 * m); }, b = ln(m, 56, W - m, 56), st = o.step || 1, n = Math.round((o.max - o.min) / st), every = o.every || (n > 12 ? Math.ceil(n / 10) : 1);
    for (var i = 0; i <= n; i++) { var v = o.min + i * st, big = i % every === 0; b += ln(x(v), 51, x(v), 61); if (big) b += tx(x(v), 80, Math.round(v * 1000) / 1000, { s: 13 }); }
    Object.keys(o.marks || {}).forEach(function (k) { b += '<circle cx="' + r1(x(+k)) + '" cy="56" r="5" class="d-a"/>'; if (o.marks[k]) b += tx(x(+k), 42, o.marks[k], { c: 'd-ta', s: 13 }); });
    (o.hops || []).forEach(function (h) { var a = x(h[0]), c = x(h[1]), mid = (a + c) / 2; b += '<path d="M' + r1(a) + ' 50 Q' + r1(mid) + ' 12 ' + r1(c) + ' 50" class="d-m"/>'; });
    return svg(W, 88, b);
  };
  /* bars of equal units, grouped: bar([3,2], ['boys','girls'], 5) */
  Dia.bar = function (parts, labels, unit) {
    var total = parts.reduce(function (a, b) { return a + b; }, 0), W = 320, u = (W - 8) / total, x = 4, b = '';
    parts.forEach(function (p, g) { for (var i = 0; i < p; i++) { b += rect(x, 24, u, 34, 'd-g' + (g % 3)); if (unit != null) b += tx(x + u / 2, 46, unit, { s: 12 }); x += u; } });
    x = 4; parts.forEach(function (p, g) { if (labels && labels[g] != null) b += tx(x + p * u / 2, 16, labels[g], { s: 13 }); x += p * u; });
    return svg(W, 62, b);
  };
  /* fraction bars, one above another: frac([[3,4],[6,8]]) */
  Dia.frac = function (list) {
    var W = 320, h = 34, gap = 8, b = '';
    list.forEach(function (f, r) { var u = (W - 8) / f[1], y = 4 + r * (h + gap); for (var i = 0; i < f[1]; i++) b += rect(4 + i * u, y, u, h, i < f[0] ? 'd-g0' : 'd-g9'); });
    return svg(W, 8 + list.length * h + (list.length - 1) * gap, b);
  };
  /* a grid of squares with some shaded: grid(10,10,37) */
  Dia.grid = function (rows, cols, on) {
    var c = Math.min(280 / cols, 24), W = cols * c + 8, H = rows * c + 8, b = '', n = 0;
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) { b += rect(4 + x * c, 4 + y * c, c, c, n < on ? 'd-g0' : 'd-g9'); n++; }
    return svg(W, H, b);
  };
  /* the box method: rows and columns split, area of each part shown. box(['20','3'],['10','4'],[['200','30'],['80','12']]) */
  Dia.box = function (top, side, cells) {
    var W = 300, l = 42, t = 24, cw = (W - l - 4) / top.length, ch = 48, b = '';
    top.forEach(function (x, i) { b += tx(l + i * cw + cw / 2, 16, x, { s: 14, c: 'd-ta' }); });
    side.forEach(function (y, j) { b += tx(l - 8, t + j * ch + ch / 2 + 5, y, { a: 'end', s: 14, c: 'd-ta' }); top.forEach(function (x, i) { b += rect(l + i * cw, t + j * ch, cw, ch, (i + j) % 2 ? 'd-g9' : 'd-g1'); if (cells) b += tx(l + i * cw + cw / 2, t + j * ch + ch / 2 + 5, cells[j][i], { s: 15 }); }); });
    return svg(W, t + side.length * ch + 4, b);
  };
  /* rectangle with labelled sides, or an L made of two: rect(w,h,'8 cm','5 cm') */
  Dia.rect = function (lw, lh, rw, rh) {
    var mx = Math.max(rw || 8, (rh || 5) * 1.6), w = (rw || 8) / mx * 220, h = Math.max(40, (rh || 5) / mx * 220), x = (300 - w) / 2;
    return svg(300, h + 38, rect(x, 8, w, h, 'd-g1') + tx(150, h + 30, lw, { s: 14 }) + tx(x - 8, 8 + h / 2 + 5, lh, { a: 'end', s: 14 }));
  };
  Dia.lshape = function (a, b0, c, d) { /* outer a by b0, with a c by d corner cut from the top right. All labels from the numbers */
    var S = 220 / Math.max(a, b0), W = a * S, H = b0 * S, x0 = 48, y0 = 16;
    return svg(320, H + 44, poly([[x0, y0], [x0 + (a - c) * S, y0], [x0 + (a - c) * S, y0 + d * S], [x0 + W, y0 + d * S], [x0 + W, y0 + H], [x0, y0 + H]], 'd-f') + tx(x0 + W / 2, y0 + H + 22, a, { s: 14 }) + tx(x0 - 8, y0 + H / 2 + 5, b0, { a: 'end', s: 14 }) + tx(x0 + (a - c) * S + c * S / 2, y0 + d * S - 6, c, { s: 14 }) + tx(x0 + (a - c) * S + 6, y0 + d * S / 2 + 5, d, { a: 'start', s: 14 }));
  };
  /* a triangle with sides and angles labelled. o: {pts?, sides:[ab,bc,ca], angles:[a,b,c], right:index} default shape right-angled at the bottom left */
  Dia.tri = function (o) {
    o = o || {};
    var p = o.pts || (o.right != null ? [[60, 150], [260, 150], [60, 30]] : [[40, 150], [280, 150], [120, 34]]), s = o.sides || [], an = o.angles || [], b = poly(p, 'd-f');
    var cx = (p[0][0] + p[1][0] + p[2][0]) / 3, cy = (p[0][1] + p[1][1] + p[2][1]) / 3;
    [[0, 1], [1, 2], [2, 0]].forEach(function (e, i) { if (s[i] == null) return; var mx = (p[e[0]][0] + p[e[1]][0]) / 2, my = (p[e[0]][1] + p[e[1]][1]) / 2, dx = mx - cx, dy = my - cy, l = Math.hypot(dx, dy) || 1; b += tx(mx + dx / l * 18, my + dy / l * 18 + 5, s[i], { s: 14, c: 'd-ta' }); });
    p.forEach(function (q, i) { if (an[i] == null) return; var dx = cx - q[0], dy = cy - q[1], l = Math.hypot(dx, dy) || 1; b += tx(q[0] + dx / l * 30, q[1] + dy / l * 30 + 5, an[i], { s: 13 }); });
    if (o.right != null) { var q = p[0]; b += poly([[q[0], q[1] - 14], [q[0] + 14, q[1] - 14], [q[0] + 14, q[1]], [q[0], q[1]]], 'd-r'); }
    return svg(320, 176, b);
  };
  /* angles along a straight line (kind 'line'), round a point ('point'), or two parallels and a crossing line ('par') */
  Dia.angle = function (kind, labels) {
    var b = '', l = labels || [];
    if (kind === 'line') { var d = l.deg || 50; b += ln(20, 110, 300, 110) + ln(160, 110, 160 + 90 * Math.cos(d * Math.PI / 180), 110 - 90 * Math.sin(d * Math.PI / 180)) + arc(160, 110, 26, 0, d) + arc(160, 110, 18, d, 180, 'd-m2') + tx(214, 96, l[0] != null ? l[0] : '', { s: 14 }) + tx(116, 92, l[1] != null ? l[1] : '', { s: 14 }); return svg(320, 124, b); }
    if (kind === 'point') { var ds = [0, 130, 240]; ds.forEach(function (d0) { b += ln(160, 90, 160 + 76 * Math.cos(d0 * Math.PI / 180), 90 - 76 * Math.sin(d0 * Math.PI / 180)); }); b += tx(186, 60, l[0] != null ? l[0] : '', { s: 14 }) + tx(118, 92, l[1] != null ? l[1] : '', { s: 14 }) + tx(196, 118, l[2] != null ? l[2] : '', { s: 14 }); return svg(320, 180, b); }
    /* parallels */
    b += ln(20, 40, 300, 40) + ln(20, 120, 300, 120) + ln(110, 150, 210, 10) + '<path d="M60 34l8 6-8 6M60 114l8 6-8 6" class="d-m"/>';
    b += tx(204, 32, l[0] != null ? l[0] : '', { s: 14 }) + tx(150, 34, l[1] != null ? l[1] : '', { s: 14 }) + tx(172, 58, l[2] != null ? l[2] : '', { s: 14 }) + tx(142, 112, l[3] != null ? l[3] : '', { s: 14 }) + tx(116, 138, l[4] != null ? l[4] : '', { s: 14 }) + tx(84, 112, l[5] != null ? l[5] : '', { s: 14 });
    return svg(320, 160, b);
  };
  /* regular polygon */
  Dia.poly = function (n, centre) { var p = []; for (var i = 0; i < n; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; p.push([160 + 70 * Math.cos(a), 84 + 70 * Math.sin(a)]); } return svg(320, 168, poly(p, 'd-f') + (centre != null ? tx(160, 90, centre, { s: 16 }) : '')); };
  /* circle: o {r:'label', d:'label', sector:deg, secLabel} */
  Dia.circle = function (o) {
    o = o || {}; var cx = 160, cy = 86, R = 72, b = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" class="d-f"/>';
    if (o.sector) { var a = o.sector * Math.PI / 180, ex = cx + R * Math.cos(a), ey = cy - R * Math.sin(a); b += '<path d="M' + cx + ' ' + cy + ' L' + (cx + R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 ' + (o.sector > 180 ? 1 : 0) + ' 0 ' + r1(ex) + ' ' + r1(ey) + ' Z" class="d-g0"/>'; if (o.secLabel != null) b += tx(cx + 30 * Math.cos(a / 2), cy - 30 * Math.sin(a / 2) + 5, o.secLabel, { s: 13 }); }
    if (o.r != null) b += ln(cx, cy, cx + R, cy) + tx(cx + R / 2, cy - 8, o.r, { s: 14, c: 'd-ta' });
    if (o.d != null) b += ln(cx - R, cy, cx + R, cy) + tx(cx, cy - 8, o.d, { s: 14, c: 'd-ta' });
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="3" class="d-a"/>';
    return svg(320, 172, b);
  };
  /* axes. o: {x:[lo,hi], y:[lo,hi], pts:[[x,y,label]], fn:function, line:[[x0,y0],[x1,y1]], step, polyline:[[x,y]...]} */
  Dia.axes = function (o) {
    var W = 300, H = 240, m = 20, X = o.x || [-5, 5], Y = o.y || [-5, 5], sx = function (v) { return m + (v - X[0]) / (X[1] - X[0]) * (W - 2 * m); }, sy = function (v) { return H - m - (v - Y[0]) / (Y[1] - Y[0]) * (H - 2 * m); }, st = o.step || 1, b = '', v;
    for (v = Math.ceil(X[0] / st) * st; v <= X[1]; v += st) { b += ln(sx(v), sy(Y[0]), sx(v), sy(Y[1]), 'd-l'); if (v && Math.round(v / st) % (o.every || 1) === 0) b += tx(sx(v), sy(Math.max(0, Y[0])) + 15, v, { s: 11 }); }
    for (v = Math.ceil(Y[0] / st) * st; v <= Y[1]; v += st) { b += ln(sx(X[0]), sy(v), sx(X[1]), sy(v), 'd-l'); if (v && Math.round(v / st) % (o.every || 1) === 0) b += tx(sx(Math.max(0, X[0])) - 5, sy(v) + 4, v, { s: 11, a: 'end' }); }
    b += ln(sx(X[0]), sy(0 < Y[0] ? Y[0] : 0), sx(X[1]), sy(0 < Y[0] ? Y[0] : 0)) + ln(sx(0 < X[0] ? X[0] : 0), sy(Y[0]), sx(0 < X[0] ? X[0] : 0), sy(Y[1]));
    if (o.fn) { var d = ''; for (var i = 0; i <= 60; i++) { var xv = X[0] + (X[1] - X[0]) * i / 60, yv = o.fn(xv); if (isFinite(yv) && yv >= Y[0] - .5 && yv <= Y[1] + .5) d += (d ? 'L' : 'M') + r1(sx(xv)) + ' ' + r1(sy(Math.max(Y[0], Math.min(Y[1], yv)))) + ' '; else if (d && d.slice(-1) !== '!') d += ''; } b += '<path d="' + d + '" class="d-c"/>'; }
    if (o.line) b += ln(sx(o.line[0][0]), sy(o.line[0][1]), sx(o.line[1][0]), sy(o.line[1][1]), 'd-c');
    if (o.polyline) b += '<path d="M' + o.polyline.map(function (q) { return r1(sx(q[0])) + ' ' + r1(sy(q[1])); }).join(' L') + '" class="d-c"/>';
    (o.pts || []).forEach(function (q) { b += '<circle cx="' + r1(sx(q[0])) + '" cy="' + r1(sy(q[1])) + '" r="4.500" class="d-a"/>'; if (q[2] != null) b += tx(sx(q[0]) + 8, sy(q[1]) - 8, q[2], { s: 13, a: 'start', c: 'd-ta' }); });
    return svg(W, H, b);
  };
  /* a cuboid with labelled edges */
  Dia.cuboid = function (l, w, h) { var x = 70, y = 60, W = 150, H = 80, dx = 44, dy = -32; return svg(320, 170, poly([[x, y], [x + W, y], [x + W, y + H], [x, y + H]], 'd-g1') + poly([[x, y], [x + dx, y + dy], [x + W + dx, y + dy], [x + W, y]], 'd-f') + poly([[x + W, y], [x + W + dx, y + dy], [x + W + dx, y + H + dy], [x + W, y + H]], 'd-g9') + tx(x + W / 2, y + H + 20, l, { s: 14 }) + tx(x + W + dx / 2 + 12, y + H + dy / 2 + 12, w, { s: 14, a: 'start' }) + tx(x - 8, y + H / 2 + 5, h, { s: 14, a: 'end' })); };
  Dia.cyl = function (r, h) { return svg(320, 170, '<path d="M100 40 V130 A60 18 0 0 0 220 130 V40" class="d-f"/><ellipse cx="160" cy="40" rx="60" ry="18" class="d-g1"/>' + ln(160, 40, 220, 40) + tx(190, 34, r, { s: 14, c: 'd-ta' }) + tx(232, 94, h, { s: 14, a: 'start', c: 'd-ta' })); };
  /* two overlapping sets: venn(onlyA, both, onlyB, outside) */
  Dia.venn = function (a, ab, b0, out) { return svg(320, 150, rect(4, 4, 312, 142, 'd-f', 8) + '<circle cx="125" cy="75" r="56" class="d-v"/><circle cx="195" cy="75" r="56" class="d-v"/>' + tx(98, 80, a, { s: 16 }) + tx(160, 80, ab, { s: 16 }) + tx(222, 80, b0, { s: 16 }) + (out != null ? tx(296, 134, out, { s: 15 }) : '')); };
  /* probability tree, two rounds. labels: [[a,b],[aa,ab],[ba,bb]] */
  Dia.tree = function (lb) {
    var b = '', pts = [[150, 40], [150, 130]], ends = [[300, 18], [300, 62], [300, 108], [300, 152]];
    b += ln(16, 85, 150, 40) + ln(16, 85, 150, 130) + tx(70, 50, lb[0][0], { s: 13, c: 'd-ta' }) + tx(70, 128, lb[0][1], { s: 13, c: 'd-ta' });
    ends.forEach(function (e, i) { var f = pts[i < 2 ? 0 : 1]; b += ln(f[0], f[1], e[0], e[1]); var t = lb[i < 2 ? 1 : 2][i % 2]; b += tx((f[0] + e[0]) / 2, (f[1] + e[1]) / 2 + (i % 2 ? 16 : -6), t, { s: 13, c: 'd-ta' }); });
    return svg(320, 170, b);
  };
  /* bar chart: bars([3,5,2],['A','B','C']) */
  Dia.bars = function (vals, labels) {
    var mx = Math.max.apply(null, vals), W = 300, H = 170, u = (W - 40) / vals.length, b = ln(32, 8, 32, H - 26) + ln(32, H - 26, W, H - 26), S = (H - 44) / mx, tick = mx > 10 ? Math.ceil(mx / 5) : mx > 5 ? 2 : 1;
    for (var t = tick; t <= mx; t += tick) { b += ln(32, H - 26 - t * S, W, H - 26 - t * S, 'd-l') + tx(26, H - 22 - t * S, t, { s: 11, a: 'end' }); }
    vals.forEach(function (v, i) { b += rect(32 + i * u + u * .18, H - 26 - v * S, u * .64, v * S, 'd-g0') + tx(32 + i * u + u / 2, H - 8, labels[i], { s: 12 }); });
    return svg(W, H, b);
  };
  /* pie chart from degrees: pie([[180,'A'],[90,'B'],[90,'C']]) */
  Dia.pie = function (parts) {
    var cx = 160, cy = 86, R = 76, a = 90, b = '';
    parts.forEach(function (p, i) { var e = a - p[0], sr = a * Math.PI / 180, er = e * Math.PI / 180; b += '<path d="M' + cx + ' ' + cy + ' L' + r1(cx + R * Math.cos(sr)) + ' ' + r1(cy - R * Math.sin(sr)) + ' A' + R + ' ' + R + ' 0 ' + (p[0] > 180 ? 1 : 0) + ' 1 ' + r1(cx + R * Math.cos(er)) + ' ' + r1(cy - R * Math.sin(er)) + ' Z" class="d-g' + (i % 3) + ' d-sl"/>'; var m = (a + e) / 2 * Math.PI / 180; if (p[1] != null) b += tx(cx + R * .6 * Math.cos(m), cy - R * .6 * Math.sin(m) + 5, p[1], { s: 13 }); a = e; });
    return svg(320, 172, b);
  };
  /* a clock of n hours for remainders */
  Dia.clock = function (n, at) { var cx = 160, cy = 84, R = 62, b = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" class="d-f"/>'; for (var i = 0; i < n; i++) { var t = -Math.PI / 2 + i * 2 * Math.PI / n; b += tx(cx + (R - 15) * Math.cos(t), cy + (R - 15) * Math.sin(t) + 5, i, { s: 13, c: i === at ? 'd-ta' : '' }); } return svg(320, 168, b); };
  /* the drawing helpers, for the science diagrams in dia-sci.js */
  Dia._ = { svg: svg, tx: tx, ln: ln, poly: poly, rect: rect, arc: arc, r1: r1 };
})();
