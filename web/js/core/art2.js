/* The drawn set, second pass. Every object is built the way the real thing is built: facets on a star, bands on chrome, fingers on a hand,
   a shadow where it meets the ground. One light, from the upper left. Supplied renders still win wherever they exist. */
(function () {
  'use strict';
  var A = window.A, a = A.ART;
  var P = function (d, f, x) { return '<path d="' + d + '" fill="' + f + '"' + (x ? ' ' + x : '') + '/>'; };
  var S = function (d, c, w, x) { return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' + (x ? ' ' + x : '') + '/>'; };
  var Sh = function (d) { return P(d, 'url(#rShade)'); };
  var E = function (cx, cy, rx, ry, f, x) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (x ? ' ' + x : '') + '/>'; };
  var C = function (cx, cy, r, f, x) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"' + (x ? ' ' + x : '') + '/>'; };
  var CAST = function (cx, cy, rx, ry) { return E(cx, cy, rx, ry, 'url(#rCast)'); };
  var HI = function (cx, cy, rx, ry, rot, o) { return E(cx, cy, rx, ry, 'url(#rSpec)', (o != null ? 'opacity="' + o + '" ' : '') + (rot ? 'transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : '')); };
  function mixHex(a0, b0, t) { var ch = function (h, i) { return parseInt(h.substr(1 + i * 2, 2), 16); }, o = '#'; for (var i = 0; i < 3; i++) { var v = Math.round(ch(a0, i) + (ch(b0, i) - ch(a0, i)) * t); o += ('0' + v.toString(16)).slice(-2); } return o; }
  /* a cut gem: each face takes its brightness from which way it looks */
  function facets(cx, cy, R, r, n, hi, lo, rot) {
    var pts = [], out = '', i, t = rot == null ? -Math.PI / 2 : rot;
    for (i = 0; i < n * 2; i++) { var an = t + i * Math.PI / n, q = i % 2 ? r : R; pts.push([cx + Math.cos(an) * q, cy + Math.sin(an) * q, an]); }
    for (i = 0; i < n * 2; i++) {
      var p0 = pts[i], p1 = pts[(i + 1) % (n * 2)], mid = (p0[2] + (i === n * 2 - 1 ? p1[2] + Math.PI * 2 : p1[2])) / 2;
      var lit = (Math.cos(mid - (-2.25)) + 1) / 2;
      out += '<path d="M' + cx + ' ' + cy + 'L' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + 'L' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2) + 'Z" fill="' + mixHex(lo, hi, lit) + '"/>';
    }
    return out + '<path d="M' + pts.map(function (q) { return q[0].toFixed(2) + ' ' + q[1].toFixed(2); }).join('L') + 'Z" fill="none" stroke="' + mixHex(lo, '#000000', .25) + '" stroke-width=".7" stroke-linejoin="round"/>';
  }
  var GOLD = 'url(#gGold)', CHROME = 'url(#gChrome)', BRASS = 'url(#gBrass)';

  /* ---------- the most used ---------- */
  var BOOKC = 'M5 27c15-5 31-3 45 7 14-10 30-12 45-7v48c-15-5-31-3-45 8-14-11-30-13-45-8z';
  a.book = CAST(50, 91, 44, 6) + P('M5 75c15-5 31-3 45 8 14-11 30-13 45-8v6c-15-5-31-3-45 8-14-11-30-13-45-8z', '#07352a') + P(BOOKC, 'url(#gBook)') +
    P('M9 25c14-4 29-2 41 7v47c-12-9-27-11-41-8z', 'url(#gPageL)') + P('M91 25c-14-4-29-2-41 7v47c12-9 27-11 41-8z', 'url(#gPageR)') +
    S('M12 67.5c12-2 26 0 38 8.5M12 69.5c12-2 26 0 38 8.5M88 67.5c-12-2-26 0-38 8.5M88 69.5c-12-2-26 0-38 8.5', '#c9b98d', .7, 'opacity=".8"') +
    P('M50 32v47c-3-2.7-7-4.7-11-6V29.5c4 .6 7.6 1.2 11 2.5z', '#6b5a33', 'opacity=".16"') + P('M50 32v47c2.2-2 5-3.5 8-4.7V29.7c-3 .5-5.7 1.2-8 2.3z', '#6b5a33', 'opacity=".1"') +
    S('M50 32v47', '#a8976e', 1.1) + P('M69 72l5.5-1.1 1 20-3-2.4-3.5 3z', '#c7303d') + P('M69 72l2.2-.5.3 19.3-2.5 2.5z', '#8c1d2a');
  a.star = facets(50, 53, 46, 19, 5, '#ffe9a0', '#b4761f') + HI(38, 38, 9, 5, -30, .55);
  a.octa = facets(50, 50, 47, 30, 8, '#ffe9a0', '#ad701d', -Math.PI / 2) + C(50, 50, 4, '#fff6d6', 'opacity=".55"');
  var rays = '', ri; for (ri = 0; ri < 16; ri++) { var long = ri % 2 === 0; rays += '<path transform="rotate(' + (ri * 22.5) + ' 50 50)" d="M' + (long ? '45.5 24 50 2 54.5 24' : '47 23 50 11 53 23') + 'Z" fill="' + (long ? 'url(#gGold)' : '#ffd877') + '"/>'; }
  a.sun = C(50, 50, 48, 'url(#rGlowS)') + rays + C(50, 50, 26, '#c8892a') + C(50, 50, 24.5, 'url(#rSun)') + S('M31 44a20 20 0 0 1 14-13', '#fffbe3', 2.4, 'opacity=".75"') + HI(41, 40, 10, 7, -32, .85);
  var MOON = 'M68 7A44 44 0 1 0 93 72 37 37 0 0 1 68 7z';
  a.moon = P(MOON, 'url(#rMoon)') + Sh(MOON) +
    [[23, 44, 6], [38, 72, 8], [33, 57, 3.2], [47, 27, 3.8], [56, 83, 4.2], [18, 62, 2.6]].map(function (q) { return C(q[0], q[1], q[2], '#8b8166', 'opacity=".36"') + S('M' + (q[0] - q[2]) + ' ' + q[1] + 'a' + q[2] + ' ' + q[2] + ' 0 0 0 ' + q[2] * 2 + ' 0', '#fff8e0', .9, 'opacity=".55"'); }).join('');
  a.pencil = CAST(46, 90, 34, 5) + '<g transform="rotate(-45 50 50)">' + P('M6 50l8-4v8z', '#231b12') + P('M14 46l13-7v22l-13-7z', '#f0d5ad') + P('M14 50h13v11l-13-7z', '#c9a67c') +
    '<path d="M27 39q2 2 0 3.7 2 1.8 0 3.7 2 1.8 0 3.6 2 1.9 0 3.7 2 1.8 0 3.6 2 1.9 0 3.7" fill="none" stroke="#a97d3f" stroke-width=".6"/>' +
    P('M27 39h46v7.3H27z', '#ffe08a') + P('M27 46.3h46v7.4H27z', '#f4b93d') + P('M27 53.7h46V61H27z', '#c98a1f') + S('M29 42.5h42', '#fff6d0', 1.1, 'opacity=".8"') +
    P('M73 38.5h9v23h-9z', CHROME) + S('M75.5 38.5v23M78 38.5v23M80.5 38.5v23', '#6b7682', .8, 'opacity=".7"') +
    P('M82 39h7a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6h-7z', 'url(#rRose)') + S('M85 43h6', '#ffd9e4', 1.4, 'opacity=".8"') + '</g>';
  var finger = function (x0, y0, x1, y1, w) { return '<path d="M' + x0 + ' ' + y0 + 'L' + x1 + ' ' + y1 + '" stroke="#d9a079" stroke-width="' + w + '" stroke-linecap="round" fill="none"/>' + S('M' + (x0 - w * .22) + ' ' + y0 + 'L' + (x1 - w * .22) + ' ' + (y1 + 1), '#fff', w * .16, 'opacity=".28"'); };
  a.hand = finger(32, 46, 27, 15, 11) + finger(45, 44, 44, 7, 11.5) + finger(58, 44, 60, 9, 11) + finger(70, 48, 75, 19, 10) + finger(29, 67, 11, 50, 11.5) +
    P('M25 52c0-7 7-10 25-10s26 3 26 11c0 12-2 21-6 28-3 7-9 12-20 12-13 0-20-6-23-16-2-8-2-17-2-25z', 'url(#gSkinR)') + Sh('M25 52c0-7 7-10 25-10s26 3 26 11c0 12-2 21-6 28-3 7-9 12-20 12-13 0-20-6-23-16-2-8-2-17-2-25z') +
    S('M33 60c9-5 22-5 33 1M37 72c5 6 13 8 23 6M42 50c-5 8-7 17-6 27', '#8f5a38', 1.1, 'opacity=".42"') + HI(42, 56, 12, 7, -10, .22);
  var SOLE = 'M41 94c-10 0-16-8-15-19 1-10 5-15 5-24 0-8-6-11-5-20 1-8 9-12 18-12 12 0 21 6 21 17 0 10-6 15-8 24-2 9 1 13 1 20 0 9-7 14-17 14z';
  a.foot = CAST(46, 94, 22, 4) + [[34, 12, 8, 9.5], [48, 8, 5.5, 7], [58, 10, 4.8, 6.2], [67, 14, 4.3, 5.5], [74, 20, 3.8, 4.8]].map(function (q) { return E(q[0], q[1], q[2], q[3], 'url(#gSkinR)') + Sh('M' + (q[0] - q[2]) + ' ' + q[1] + 'a' + q[2] + ' ' + q[3] + ' 0 1 0 ' + q[2] * 2 + ' 0a' + q[2] + ' ' + q[3] + ' 0 1 0-' + q[2] * 2 + ' 0z') + HI(q[0] - q[2] * .25, q[1] - q[3] * .3, q[2] * .45, q[3] * .35, 0, .45); }).join('') + P(SOLE, 'url(#gSkinR)') + Sh(SOLE) + S('M31 50c6 3 14 3 26 1', '#8f5a38', .9, 'opacity=".3"') + HI(38, 32, 10, 7, -18, .25);
  a.masjid = CAST(50, 94, 47, 5) + P('M3 87h94l-3 7H6z', 'url(#gClay)') +
    [[9.5, 'L'], [90.5, 'R']].map(function (q) { var x = q[0]; return P('M' + (x - 4) + ' 87V30h8v57z', 'url(#gStoneW)') + P('M' + (x + 1) + ' 87V30h3v57z', '#a58a60', 'opacity=".35"') + P('M' + (x - 6) + ' 46h12v3H' + (x - 6) + 'z', GOLD) + P('M' + (x - 5.5) + ' 30c0-6 3-11 5.5-15 2.5 4 5.5 9 5.5 15z', 'url(#gTeal)') + S('M' + x + ' 15v-8', '#c79c52', 1.3) + C(x, 6, 1.7, GOLD) + P('M' + (x - 1.5) + ' 64v-6a1.5 1.5 0 0 1 3 0v6z', '#3a2a18') + P('M' + (x - 1.5) + ' 40v-5a1.5 1.5 0 0 1 3 0v5z', '#3a2a18'); }).join('') +
    P('M20 87V52h60v35z', 'url(#gStoneW)') + P('M66 87V52h14v35z', '#a58a60', 'opacity=".26"') + P('M18 49h64v4H18z', GOLD) +
    P('M27 49c0-13 10-22 23-27 13 5 23 14 23 27z', 'url(#gTeal)') + S('M34 49c0-12 7-20 16-27M42 49c0-11 3-20 8-27M50 49V22M58 49c0-11-3-20-8-27M66 49c0-12-7-20-16-27M29 41c13-3 29-3 42 0M34 32c10-2 22-2 32 0', '#0a4a55', .7, 'opacity=".6"') + P('M27 49c0-13 10-22 23-27-8 7-13 16-14 27z', '#fff', 'opacity=".18"') + S('M50 22v-11', '#c79c52', 1.5) + C(50, 15, 2.3, GOLD) + C(50, 9.5, 1.5, GOLD) +
    P('M39 87V68c0-7 5-12 11-16 6 4 11 9 11 16v19z', GOLD) + P('M42 87V69c0-6 4-10 8-13 4 3 8 7 8 13v18z', '#2c1a0c') + S('M50 57v30', '#7a4f25', .9) +
    [[25, 'a'], [69, 'b']].map(function (q) { var x = q[0]; return P('M' + x + ' 76v-9a3 3 0 0 1 6 0v9z', 'url(#gInk)') + S('M' + x + ' 76v-9a3 3 0 0 1 6 0v9z', GOLD, .8); }).join('');
  a.kaaba = CAST(50, 93, 46, 6) + P('M8 76l42 15 42-15v5L50 96 8 81z', 'url(#gStoneW)') + P('M50 91v5l42-15v-5z', '#a58a60', 'opacity=".4"') +
    P('M50 40L8 26v50l42 15z', '#1d1e26') + P('M50 40l42-14v50L50 91z', '#0d0e13') + P('M50 40L8 26l42-14 42 14z', '#2b2c36') + S('M8 26l42 14 42-14', '#3c3e4a', .7) +
    P('M8 38l42 14v9L8 47z', GOLD) + P('M50 52l42-14v9L50 61z', 'url(#gGoldD)') + S('M12 41.5l34 11.5M12 44.5l34 11.5M54 53l34-11.5M54 56l34-11.5', '#6e4e16', .9, 'stroke-dasharray="2 1.6" opacity=".75"') +
    P('M62 62l15-5v27l-15 5z', GOLD) + P('M64.5 63.5l10-3.3v21.5l-10 3.3z', '#6e4e16', 'opacity=".55"') + S('M69.5 61.8v21.5', '#f6dda5', .8) + S('M8 26v50M92 26v50M50 40v51', '#3c3e4a', .4);
  a.coin = CAST(50, 91, 32, 5) + C(50, 48, 42, '#7d5a1b') + C(50, 46, 42, GOLD) + '<circle cx="50" cy="46" r="39.5" fill="none" stroke="#8a6420" stroke-width="3.4" stroke-dasharray="1.6 1.7" opacity=".75"/>' + C(50, 46, 35, 'url(#gGoldD)') + C(50, 46, 33.5, GOLD) +
    '<g transform="translate(.8 1)" opacity=".5">' + P('M50 19l6.4 10.6L68 24.2l-3.9 12.1L76.8 46l-12.7 9.7L68 67.8l-11.6-5.4L50 73l-6.4-10.6L32 67.8l3.9-12.1L23.2 46l12.7-9.7L32 24.2l11.6 5.4z', '#6e4e16') + '</g>' + P('M50 19l6.4 10.6L68 24.2l-3.9 12.1L76.8 46l-12.7 9.7L68 67.8l-11.6-5.4L50 73l-6.4-10.6L32 67.8l3.9-12.1L23.2 46l12.7-9.7L32 24.2l11.6 5.4z', '#ffe7a8') + C(50, 46, 9, '#c79c52') + Sh('M8 46a42 42 0 1 0 84 0 42 42 0 1 0-84 0z') + S('M22 28a33 33 0 0 1 18-12', '#fff', 2.6, 'opacity=".7"');
  var DROP = 'M50 6c16 23 29 39 29 56a29 29 0 0 1-58 0c0-17 13-33 29-56z';
  a.drop = CAST(50, 93, 22, 4) + P(DROP, 'url(#gWater)') + P('M50 92a29 29 0 0 0 29-29c0-3-.4-6-1.2-9-3 18-14 30-34 34 2 2.7 4 4 6.2 4z', '#0c3f78', 'opacity=".45"') + P('M31 58c1-10 7-20 13-29-1 11-5 21-9 32-2 5-4 3-4-3z', '#fff', 'opacity=".78"') + E(62, 76, 7.5, 4.5, '#d7f4ff', 'opacity=".75" transform="rotate(-35 62 76)"') + C(36, 72, 2.4, '#fff', 'opacity=".85"') + S('M50 6c16 23 29 39 29 56a29 29 0 0 1-58 0c0-17 13-33 29-56z', '#e6f8ff', .7, 'opacity=".55"');
  var LEAFA = 'M50 62C33 62 18 50 15 28c21-3 37 10 35 34z', LEAFB = 'M50 54c0-21 14-37 37-40 3 23-13 40-37 40z', LEAFC = 'M51 64c10-11 23-14 38-9-5 13-22 19-38 9z';
  var leafy = function (d, v) { return P(d, 'url(#gLeaf)') + Sh(d) + S(v, '#d9f5c0', 1, 'opacity=".7"'); };
  a.plant = CAST(50, 95, 26, 4) + S('M50 68c0-10 0-20 1-30', '#4c8f3f', 3.2) + leafy(LEAFA, 'M48 60C38 50 28 40 19 31M36 49l-1-11M28 41l-8 0') + leafy(LEAFB, 'M52 52c9-13 21-25 33-36M63 39l11 0M71 30l-1-11') + leafy(LEAFC, 'M53 63c11-3 22-5 33-7') +
    P('M29 74h42l-6 21H35z', 'url(#gClay)') + P('M58 74h13l-6 21H56z', '#6d3d1c', 'opacity=".38"') + P('M26 66h48a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H26a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z', 'url(#gClayL)') + E(50, 67, 23, 2.4, '#2f1d10') + S('M31 69h22', '#ffe8d0', 1.1, 'opacity=".7"') + HI(38, 84, 3.5, 8, 6, .35);
  a.bread = CAST(50, 86, 44, 7) + E(50, 56, 45, 30, '#8a4f1e') + E(50, 53, 45, 30, 'url(#rBread)') + E(50, 52, 34, 21, '#e8b878', 'opacity=".5"') +
    [[33, 44, 5, 2.6], [55, 38, 7, 3], [68, 54, 5.5, 3], [40, 62, 7.5, 3.2], [58, 66, 4, 2], [24, 56, 3.4, 2]].map(function (q) { return E(q[0], q[1], q[2], q[3], '#6e3c17', 'opacity=".55" transform="rotate(-12 ' + q[0] + ' ' + q[1] + ')"'); }).join('') +
    [[28, 36], [46, 30], [72, 42], [62, 28], [80, 58], [20, 48], [50, 74]].map(function (q) { return C(q[0], q[1], 1.2, '#fff8e8', 'opacity=".75"'); }).join('') + HI(34, 34, 13, 6, -18, .4);
  a.torch = CAST(38, 92, 30, 4) + '<g transform="rotate(-18 50 50)"><path d="M58 39L97 22v56L58 61z" fill="url(#rBeam)"/>' + P('M8 41h32v18H8a4 4 0 0 1-4-4V45a4 4 0 0 1 4-4z', 'url(#gDark)') + S('M8 44h6M8 47.5h6M8 51h6M8 54.5h6', '#6d7884', 1, 'opacity=".8"') + S('M18 42.5v15M21 42.5v15', '#000', .8, 'opacity=".4"') + P('M28 37h9v5h-9z', '#c92f3b') + P('M40 41l12-7h4v32h-4l-12-7z', CHROME) + E(57, 50, 4, 16.5, '#fff6d6') + E(57, 50, 2.4, 12, '#ffeaa0') + S('M9 43.5h27', '#fff', 1, 'opacity=".25"') + '</g>';
  var puff = function (x, y, r) { return C(x, y, r, 'url(#rPuff)'); };
  a.cloud = puff(24, 62, 17) + puff(76, 62, 18) + puff(44, 46, 23) + puff(66, 48, 18) + puff(50, 64, 21) + P('M15 72c8 6 62 6 72 0-2 8-10 10-18 10H30c-8 0-13-3-15-10z', '#9fb2c9', 'opacity=".55"') + HI(40, 34, 15, 7, -14, .95);
  var dropS = function (x, y) { var d = 'M' + x + ' ' + y + 'c4.5 7 7.5 11 7.5 15a7.5 7.5 0 0 1-15 0c0-4 3-8 7.5-15z'; return P(d, 'url(#gWater)') + P('M' + (x - 4) + ' ' + (y + 15) + 'c.3-2.5 1.5-5 3-7.5-.4 3-1 5.5-1.3 8-.3 1.5-1.7 1-1.7-.5z', '#fff', 'opacity=".85"'); };
  a.rain = '<g transform="translate(0 -11)">' + C(24, 44, 15, 'url(#rPuffD)') + C(74, 44, 16, 'url(#rPuffD)') + C(44, 32, 20, 'url(#rPuffD)') + C(63, 34, 15, 'url(#rPuffD)') + C(50, 47, 17, 'url(#rPuffD)') + HI(40, 21, 12, 5, -12, .55) + '</g>' + dropS(28, 60) + dropS(50, 67) + dropS(72, 58);
  a.tap = CAST(30, 96, 22, 3) + P('M10 24h44a16 16 0 0 1 16 16v9H52v-7a3 3 0 0 0-3-3H10z', CHROME) + S('M12 28h38a12 12 0 0 1 12 8', '#fff', 2, 'opacity=".85"') + P('M6 21h7v21H6z', 'url(#gSteelD)') + P('M48 49h26v7H48z', 'url(#gSteelD)') + P('M50 56h22l-2 4H52z', '#55606b') +
    P('M28 12h10v12H28z', CHROME) + P('M17 6h32a3.5 3.5 0 0 1 0 7H17a3.5 3.5 0 0 1 0-7z', CHROME) + C(33, 9.5, 2.4, '#c92f3b') + S('M20 8h26', '#fff', 1.2, 'opacity=".85"') + dropS(61, 68);
  var ROCK = 'M13 72c-6-14 3-34 20-42l22-7c17-1 30 9 33 25 2 13-3 26-14 31-18 7-52 8-61-7z';
  a.stone = CAST(50, 86, 42, 6) + P(ROCK, 'url(#gStone)') + P('M33 30l22-7-6 21-23 7c0-8 3-16 7-21z', '#fff', 'opacity=".2"') + P('M55 23c17-1 30 9 33 25l-22 2-17-6z', '#fff', 'opacity=".09"') + P('M26 51l23-7 17 6-6 26c-14 3-29 3-39-1-3-8-1-16 5-24z', '#000', 'opacity=".06"') + P('M66 50l22-2c2 13-3 26-14 31l-14 3z', '#000', 'opacity=".2"') + S('M33 30l-7 21-5 24M55 23l-6 21 17 6 22-2M49 44l-23 7M66 50l-6 26', '#3f4851', .7, 'opacity=".45"') +
    [[32, 62], [44, 54], [54, 66], [72, 60], [40, 40], [62, 36], [78, 42], [46, 72]].map(function (q, i) { return C(q[0], q[1], .7 + (i % 3) * .35, '#2c343c', 'opacity=".55"'); }).join('');
  var MAG = 'M14 12h24v38a12 12 0 0 0 24 0V12h24v38a36 36 0 0 1-72 0z';
  a.magnet = CAST(50, 92, 32, 4) + P(MAG, 'url(#rRed)') + S('M20 28v22a30 30 0 0 0 13 25', '#ffb3a8', 2.6, 'opacity=".7"') + P('M62 50a12 12 0 0 1-24 0h-3a15 15 0 0 0 30 0z', '#6e0e1a', 'opacity=".5"') + P('M14 10h24v17H14z', CHROME) + P('M62 10h24v17H62z', CHROME) + S('M17 14h18M65 14h18', '#fff', 1.6, 'opacity=".85"') + S('M14 27h24M62 27h24', '#55606b', .9);
  var PAN = 'M36 18h28l2 6c5 3 9 8 9 14v30c0 6-4 11-9 13H34c-5-2-9-7-9-13V38c0-6 4-11 9-14z';
  a.lantern = C(50, 54, 46, 'url(#rGlowS)') + '<circle cx="50" cy="6" r="3.4" fill="none" stroke="url(#gBrass)" stroke-width="2"/>' + S('M50 9v5', '#8a6420', 1.8) + P('M34 25c3-7 10-11 16-11s13 4 16 11z', BRASS) + S('M38 22c3-3 8-5 12-5', '#fff6d0', 1, 'opacity=".75"') + P('M30 25h40v4H30z', BRASS) +
    P('M32 29h36l5 44H27z', 'url(#rLamp)') + E(50, 52, 10, 15, '#fffbe8', 'opacity=".85"') + S('M41 29l-4 44M50 29v44M59 29l4 44', '#8a6420', 1.8) + S('M31 43c6 5 12 5 19 0 7 5 13 5 19 0M29 59c7 6 14 6 21 0 7 6 14 6 21 0', '#8a6420', 1.3, 'opacity=".9"') + P('M25 73h50l-4 8H29z', BRASS) + P('M35 81h30l-2 7H37z', BRASS) + S('M29 75h30', '#fff6d0', 1, 'opacity=".7"') + CAST(50, 93, 16, 2.5);
  var bandApple = 'M50 30c8-7 30-9 35 11 6 21-11 50-26 50-4 0-6-3-9-3s-5 3-9 3C26 91 9 62 15 41c5-20 27-18 35-11z';
  a.apple = CAST(50, 93, 26, 4) + P(bandApple, 'url(#rRed)') + S('M34 36c-7 8-11 18-10 30M44 34c-4 10-6 24-3 40M66 34c5 8 8 20 6 34', '#ffb38a', 1.4, 'opacity=".35"') + Sh(bandApple) + E(50, 32, 10, 3.6, '#6e0e1a', 'opacity=".6"') + S('M50 33c0-8 2-15 7-21', '#5a3d1c', 3.4) + P('M57 18c6-9 17-11 26-6-4 10-16 14-26 6z', 'url(#gLeaf)') + S('M58 18c8-3 16-5 24-6', '#d9f5c0', .9, 'opacity=".7"') + HI(30, 46, 8, 14, 18, .9) + C(28, 40, 2, '#fff', 'opacity=".8"');
  var orangeDots = '', qo = A.rng(21); for (var di = 0; di < 70; di++) { var ang = qo() * 6.28, rr = Math.sqrt(qo()) * 36; orangeDots += '<circle cx="' + (50 + Math.cos(ang) * rr).toFixed(1) + '" cy="' + (55 + Math.sin(ang) * rr).toFixed(1) + '" r=".55" fill="#a84c0c" opacity=".42"/>'; }
  a.orange = CAST(50, 94, 28, 4) + C(50, 55, 37, 'url(#rOrange)') + orangeDots + Sh('M13 55a37 37 0 1 0 74 0 37 37 0 1 0-74 0z') + P('M50 19c-2 2-4 3-6 2 1 2 1 4 0 6 2-1 4-1 6 1 2-2 4-2 6-1-1-2-1-4 0-6-2 1-4 0-6-2z', '#3f6b2c') + P('M53 19c3-8 11-11 19-9-3 9-11 13-19 9z', 'url(#gLeaf)') + HI(36, 40, 10, 13, 25, .75);
  a.ball = CAST(50, 92, 30, 4) + C(50, 50, 38, '#fbeed8') + P('M50 12a38 38 0 0 1 38 38 38 38 0 0 1-22 34c6-11 7-26 2-40-3-9-9-20-18-32z', 'url(#rRed)') + P('M12 50a38 38 0 0 0 22 34c-5-10-6-22-2-34 3-10 9-23 18-38a38 38 0 0 0-38 38z', 'url(#gBlue)') + S('M50 12c9 12 15 23 18 32 5 14 4 29-2 40M50 12c-9 15-15 28-18 38-4 12-3 24 2 34', '#5a5040', .8, 'opacity=".55"') + Sh('M12 50a38 38 0 1 0 76 0 38 38 0 1 0-76 0z') + HI(36, 30, 12, 8, -32, .9);
  var barkX = ''; for (var bi = 0; bi < 7; bi++) barkX += 'M' + (18 + bi * 9) + ' ' + (33 + (bi % 2) * 2) + 'c2 4 1 8-2 12M' + (14 + bi * 9) + ' ' + (52 + (bi % 2) * 3) + 'c3 3 3 7 1 12';
  a.wood = CAST(50, 74, 44, 6) + P('M14 32h68c6 0 10 8 10 18s-4 18-10 18H14C7 68 4 59 4 50s3-18 10-18z', 'url(#gWood)') + S(barkX, '#2f1a0b', 1.2, 'opacity=".5"') + P('M14 32h68c2 0 4 1 5 2H12c1-1 1-2 2-2z', '#d7a974', 'opacity=".55"') + Sh('M14 32h68v36H14C7 68 4 59 4 50s3-18 10-18z') + E(82, 50, 11, 18, '#e4b98a') + '<ellipse cx="82" cy="50" rx="8" ry="13.5" fill="none" stroke="#a9794a" stroke-width="1"/><ellipse cx="82" cy="50" rx="5.2" ry="9" fill="none" stroke="#a9794a" stroke-width="1"/><ellipse cx="82" cy="50" rx="2.5" ry="4.5" fill="none" stroke="#a9794a" stroke-width="1"/>' + S('M82 34v32', '#7a4f25', .6, 'opacity=".5"');
  a.lock = CAST(50, 94, 32, 4) + '<path d="M31 46V30a19 19 0 0 1 38 0v16" fill="none" stroke="url(#gChrome)" stroke-width="8"/>' + S('M29 30a21 21 0 0 1 13-19', '#fff', 1.6, 'opacity=".8"') + P('M21 42h58a5 5 0 0 1 5 5v37a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8V47a5 5 0 0 1 5-5z', BRASS) + P('M21 42h58a5 5 0 0 1 5 5v5H16v-5a5 5 0 0 1 5-5z', '#fff', 'opacity=".22"') + Sh('M21 42h58a5 5 0 0 1 5 5v37a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8V47a5 5 0 0 1 5-5z') + C(50, 62, 7.5, '#20150a') + P('M46.5 65h7l2.5 15h-12z', '#20150a') + S('M43.5 60a7.5 7.5 0 0 1 3-3.7', '#ffe7a8', 1, 'opacity=".7"') + [[24, 50], [76, 50], [24, 84], [76, 84]].map(function (q) { return C(q[0], q[1], 1.9, '#8a6420') + C(q[0] - .4, q[1] - .4, .9, '#fff0c8'); }).join('');
  /* ---------- living things ---------- */
  a.flower = CAST(50, 96, 16, 2.5) + S('M50 96C50 80 49 70 50 56', '#4c8f3f', 3.6) + P('M50 84c-9-2-16-1-22 6 9 3 17 1 22-6z', 'url(#gLeaf)') + P('M50 76c7-3 14-3 20 2-7 5-15 4-20-2z', 'url(#gLeaf)') + [0, 45, 90, 135, 180, 225, 270, 315].map(function (r) { return '<g transform="rotate(' + r + ' 50 36)"><path d="M50 36c-7-5-10-14-7-22 2-4 5-7 7-8 2 1 5 4 7 8 3 8 0 17-7 22z" fill="url(#rRose)"/><path d="M50 34V11" stroke="#a12a55" stroke-width=".7" opacity=".55"/></g>'; }).join('') + C(50, 36, 9.5, 'url(#rSun)') + [[47, 33], [53, 33], [50, 38], [46, 39], [54, 39]].map(function (q) { return C(q[0], q[1], .9, '#8a5a12'); }).join('') + HI(46, 32, 4, 3, 0, .7);
  a.bird = P('M50 55C40 42 26 30 7 26c7 13 19 25 35 32z', 'url(#gSlate)') + P('M50 55c11-14 26-26 44-30-8 14-21 26-37 33z', '#3a5272') + S('M14 30c8 4 15 9 22 16M86 29c-8 4-15 9-22 16', '#9db5d1', 1, 'opacity=".55"') + P('M38 58c4-7 16-9 24-4 3 2 5 2 8 1-2 4-6 6-11 7-5 4-16 4-21-4z', 'url(#gSlate)') + P('M32 66l8-8 4 6z', '#24344c') + P('M40 58c5 4 13 5 20 2-5 5-15 6-20-2z', '#dce6f1', 'opacity=".55"') + P('M69 54l7 1-6 3z', '#e8a93c');
  var FISH = 'M8 50c12-22 44-27 62-7l20-14-6 21 6 21-20-14C52 77 20 72 8 50z';
  var scales = ''; for (var fx = 26; fx < 66; fx += 7) for (var fy = 38; fy < 64; fy += 7) { var off = (fx % 2) ? 3 : 0; scales += 'M' + fx + ' ' + (fy + off) + 'a4 4 0 0 1 4 4'; }
  a.fish = P(FISH, 'url(#gWater)') + P('M8 50c12-22 44-27 62-7-18-6-44-6-62 7z', '#fff', 'opacity=".28"') + S(scales, '#0c3f78', .7, 'opacity=".42"') + P('M42 31c6-6 14-8 22-6-3 5-7 9-12 11z', '#1b5fa3') + P('M42 69c4 6 11 8 17 7-2-5-5-9-10-11z', '#1b5fa3') + P('M68 45l20-14-5 19 5 19-20-14z', '#1b5fa3', 'opacity=".55"') + S('M26 40c-3 7-3 14 0 20', '#0c3f78', 1, 'opacity=".55"');
  a.mountain = CAST(50, 92, 48, 4) + P('M2 90L34 24l18 30 12-20 34 56z', 'url(#gStone)') + P('M34 24L2 90h30l6-28-4-10 4-8z', '#fff', 'opacity=".12"') + P('M52 54l12-20 34 56H62z', '#000', 'opacity=".15"') + P('M34 24l11 18-5-2-5 6-4-5-5 4z', '#f4f1e8') + P('M64 34l9 15-5-2-4 4-4-3-3 2z', '#f4f1e8') + S('M34 46l-4 16 6 10M64 52l6 18', '#3f4851', .8, 'opacity=".5"');

  /* ---------- the interface icons: one grid, one weight, a soft tint behind each line ---------- */
  var IC = {
    back: { l: 'M14.5 5.5 8 12l6.5 6.5' }, next: { l: 'M9.5 5.5 16 12l-6.5 6.5' }, close: { l: 'M6.5 6.5l11 11M17.5 6.5l-11 11' }, check: { l: 'M4.5 12.5l4.8 4.8L19.5 7' }, plus: { l: 'M12 5v14M5 12h14' },
    play: { f: 'M8 5.6v12.8a.8.8 0 0 0 1.2.7l10.4-6.4a.8.8 0 0 0 0-1.4L9.2 4.9A.8.8 0 0 0 8 5.6z' },
    pause: { f: 'M7.5 4.5h2.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H7.5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1zM14 4.5h2.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1z' },
    stop: { f: 'M7 5.5h10A1.5 1.5 0 0 1 18.5 7v10a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 17V7A1.5 1.5 0 0 1 7 5.5z' },
    speak: { t: 'M4 9.5v5a1 1 0 0 0 1 1h2.6l4.3 3.4a.7.7 0 0 0 1.1-.5V5.6a.7.7 0 0 0-1.1-.5L7.6 8.5H5a1 1 0 0 0-1 1z', l: 'M4 9.5v5a1 1 0 0 0 1 1h2.6l4.3 3.4a.7.7 0 0 0 1.1-.5V5.6a.7.7 0 0 0-1.1-.5L7.6 8.5H5a1 1 0 0 0-1 1zM16.5 9a4.2 4.2 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11' },
    help: { t: 'M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6z', l: 'M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6zM9.4 9.4a2.7 2.7 0 1 1 3.9 2.4c-.9.5-1.3 1-1.3 2M12 16.9v.1' },
    lock: { t: 'M6.5 10.5h11a1.5 1.5 0 0 1 1.5 1.5v6.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V12a1.5 1.5 0 0 1 1.5-1.5z', l: 'M6.5 10.5h11a1.5 1.5 0 0 1 1.5 1.5v6.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V12a1.5 1.5 0 0 1 1.5-1.5zM8 10.5v-3a4 4 0 0 1 8 0v3M12 14.5v2' },
    path: { t: 'M6.5 15.5a5.5 5.5 0 0 1 11 0z', l: 'M6.5 15.5a5.5 5.5 0 0 1 11 0M2.8 15.5h18.4M12 5.8v2.4M5.4 8.9l1.7 1.7M18.6 8.9l-1.7 1.7M8 19.5h8' },
    rooms: { t: 'M4.5 21v-9.5C4.5 8 9 5.8 12 2.8c3 3 7.5 5.2 7.5 8.7V21z', l: 'M4.5 21v-9.5C4.5 8 9 5.8 12 2.8c3 3 7.5 5.2 7.5 8.7V21M9 21v-7.2c0-1.4 1.6-2.4 3-3.8 1.4 1.4 3 2.4 3 3.8V21M2.5 21h19' },
    keys: { t: 'M8.5 2.6l1.7 2 2.5-.4.4 2.5 2 1.6-2 1.6-.4 2.5-2.5-.4-1.7 2-1.6-2-2.5.4-.4-2.5-2-1.6 2-1.6.4-2.5 2.5.4z', l: 'M8.5 2.6l1.7 2 2.5-.4.4 2.5 2 1.6-2 1.6-.4 2.5-2.5-.4-1.7 2-1.6-2-2.5.4-.4-2.5-2-1.6 2-1.6.4-2.5 2.5.4zM8.5 6.8a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zM12.8 12.4l8 8M17 16.6l2.3-2.3M19.8 19.4l1.7-1.7' },
    grown: { t: 'M4 11l8-7 8 7v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5z', l: 'M2.8 12 12 4l9.2 8M5 10v9.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V10M12 17.6s-3.2-1.9-3.2-4a1.8 1.8 0 0 1 3.2-1.1 1.8 1.8 0 0 1 3.2 1.1c0 2.1-3.2 4-3.2 4z' },
    gear: { l: 'M3.5 7h9.5M17 7h3.5M3.5 17H7M11 17h9.5M15 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM9 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', t: 'M15 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM9 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4z' },
    mic: { t: 'M12 3a3.2 3.2 0 0 0-3.2 3.2v5.6a3.2 3.2 0 0 0 6.4 0V6.2A3.2 3.2 0 0 0 12 3z', l: 'M12 3a3.2 3.2 0 0 0-3.2 3.2v5.6a3.2 3.2 0 0 0 6.4 0V6.2A3.2 3.2 0 0 0 12 3zM5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6' },
    print: { t: 'M5 8h14a2 2 0 0 1 2 2v6a1.5 1.5 0 0 1-1.5 1.5H17v-3H7v3H4.5A1.5 1.5 0 0 1 3 16v-6a2 2 0 0 1 2-2z', l: 'M7 8V4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5V8M7 17.5H4.5A1.5 1.5 0 0 1 3 16v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1.5 1.5 0 0 1-1.5 1.5H17M7 14.5h10v5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5zM17.5 11h.1' },
    swap: { l: 'M7 7.5h13M16 3.5l4 4-4 4M17 16.5H4M8 12.5l-4 4 4 4' },
    chart: { t: 'M7.5 11h2.6v9H7.5zM12.7 7h2.6v13h-2.6zM17.9 13h2.6v7h-2.6z', l: 'M3.5 3.5V20.5H21M7.5 20v-9h2.6v9M12.7 20V7h2.6v13M17.9 20v-7h2.6v7' },
    eye: { t: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z', l: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 9.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4z' },
    talk: { t: 'M5.5 4.5h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4.8 3.8a.5.5 0 0 1-.8-.4V6.5a2 2 0 0 1 1.1-2z', l: 'M5.5 4.5h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4.8 3.8a.5.5 0 0 1-.8-.4V6.5a2 2 0 0 1 1.1-2zM8.5 9.5h7M8.5 12.5h4.5' },
    book: { t: 'M12 6.3C10 4.8 7 4.2 3.8 4.7v13.6c3.2-.5 6.2.1 8.2 1.6 2-1.5 5-2.1 8.2-1.6V4.7C17 4.2 14 4.8 12 6.3z', l: 'M12 6.3C10 4.8 7 4.2 3.8 4.7v13.6c3.2-.5 6.2.1 8.2 1.6 2-1.5 5-2.1 8.2-1.6V4.7C17 4.2 14 4.8 12 6.3zM12 6.3v13.6' },
    walk: { l: 'M13.5 3.5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zM8.5 21l2.5-7 3 3v4.5M11 14l-1-5 4-1.2 3 4 3 1M6 12.5l4-3.5' },
    clock: { t: 'M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6z', l: 'M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6zM12 7.2V12l3.2 2' }
  };
  A.icon = function (n, s) {
    var ph = n !== 'check' && (window.PHICONS || {})[n]; if (ph) { var zz = s || 22; return '<svg class="ic" viewBox="0 0 256 256" width="' + zz + '" height="' + zz + '" fill="currentColor" aria-hidden="true">' + ph + '</svg>'; }
    var x = IC[n] || {}, z = s || 22;
    return '<svg class="ic" viewBox="0 0 24 24" width="' + z + '" height="' + z + '" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (x.f ? '<path d="' + x.f + '" fill="currentColor" stroke="none"/>' : '') + (x.t ? '<path d="' + x.t + '" fill="currentColor" stroke="none" opacity=".2"/>' : '') + (x.l ? '<path d="' + x.l + '"/>' : '') + '</svg>';
  };
})();
