/* The picture box. Supplied renders are used where they exist (window.ART_FILES); everything else is drawn here with one consistent
   light from the upper left: a base colour, a shared shading overlay, a specular highlight. Nothing has a face. Prophets, angels and
   Companions are never depicted. */
(function () {
  'use strict';
  var A = window.A;
  var P = function (d, f, x) { return '<path d="' + d + '" fill="' + f + '"' + (x ? ' ' + x : '') + '/>'; };
  var L_ = function (d, c, w, x) { return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' + (x ? ' ' + x : '') + '/>'; };
  /* a form with volume: colour, then shade, so every object is lit the same way */
  var V = function (d, f) { return P(d, f) + P(d, 'url(#rShade)'); };
  var C_ = function (cx, cy, r, f) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"/>'; };
  var VC = function (cx, cy, r, f) { return C_(cx, cy, r, f) + C_(cx, cy, r, 'url(#rShade)'); };
  var EL = function (cx, cy, rx, ry, f, rot) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : '') + '/>'; };
  var VE = function (cx, cy, rx, ry, f, rot) { return EL(cx, cy, rx, ry, f, rot) + EL(cx, cy, rx, ry, 'url(#rShade)', rot); };
  var HI = function (cx, cy, rx, ry, rot, o) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="url(#rSpec)"' + (o != null ? ' opacity="' + o + '"' : '') + (rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : '') + '/>'; };
  var STEM = '#6a4a26', GR = 'url(#gLeaf)', GOLD = 'url(#gGold)', WOOD = 'url(#gWood)', CLAY = 'url(#gClay)', ST = 'url(#gStone)', STL = 'url(#gSteel)', W = 'url(#gWater)', CL = 'url(#gCloud)';
  var leaf = function (d, vein) { return V(d, GR) + (vein ? L_(vein, '#d6f5de', 1.3, 'opacity=".55"') : ''); };

  var a = {
    /* the key, for places that need it straight on and before the render arrives */
    keyfront: V('M50 4l7.3 8.8 11.3-2 2 11.3 11 7.5-5.5 10 5.5 10-11 7.5-2 11.3-11.3-2L50 75l-7.3-8.8-11.3 2-2-11.3-11-7.5 5.5-10-5.5-10 11-7.5 2-11.3 11.3 2z', GOLD) + C_(50, 39.5, 12.5, 'var(--keyhole,#0b0d14)') + P('M50 30l2.8 6.8 7.2.5-5.5 4.7 1.8 7-6.3-3.8-6.3 3.8 1.8-7-5.5-4.7 7.2-.5z', GOLD) + V('M45.5 66h9v30a4.5 4.5 0 0 1-9 0z', GOLD) + P('M44 70h12v5H44z', 'url(#gGoldD)') + V('M54 82h13a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H54z', GOLD) + V('M54 91h9a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-9z', GOLD) + HI(38, 22, 13, 7, -35, .8),
    key: null,
    date: V('M50 11c16 0 27 19 27 42S66 92 50 92 23 76 23 53s11-42 27-42z', 'url(#rDate)') + L_('M38 26c-5 9-7 21-5 33M50 18c-2 14-2 40 1 62M63 26c5 9 7 22 5 34', '#2c1508', 1.6, 'opacity=".45"') + HI(38, 34, 8, 16, 16, .7) + EL(50, 12, 7, 3, '#8a6a34'),
    apple: V('M50 30c7-7 28-9 33 10 6 21-11 50-25 50-4 0-5-3-8-3s-4 3-8 3C28 90 11 61 17 40c5-19 26-17 33-10z', 'url(#rRed)') + L_('M50 31c0-8 2-15 8-21', '#5a3d1c', 3.6) + leaf('M57 19c6-9 16-10 24-6-3 9-14 13-24 6z') + HI(31, 44, 8, 13, 18, .85),
    orange: VC(50, 54, 36, 'url(#rOrange)') + P('M50 19c-3 2-5 3-6 2 2 2 2 4 1 6 2-1 4-1 5 1 1-2 3-2 5-1-1-2-1-4 1-6-1 1-3 0-6-2z', '#4f7a3a') + leaf('M52 19c3-7 9-9 15-8-2 7-8 10-15 8z') + HI(35, 40, 9, 12, 25, .75),
    olive: VE(50, 57, 24, 32, 'url(#rOlive)', 12) + L_('M56 26c2-6 5-11 10-15', '#5a4a26', 2.4) + leaf('M58 24c7-10 17-14 28-13-3 12-15 19-28 13z', 'M60 23c8-4 15-8 24-11') + HI(40, 44, 6, 12, 16, .75),
    grape: [[50, 32], [33, 36], [67, 36], [41, 52], [59, 52], [25, 52], [75, 52], [50, 71], [33, 68], [67, 68], [50, 88]].map(function (q) { return VC(q[0], q[1], 11, 'url(#rGrape)') + HI(q[0] - 3.5, q[1] - 4, 3, 2.2, -30, .9); }).join('') + L_('M50 22c0-7 2-11 6-15', '#5a3d1c', 3.4) + leaf('M57 15c8-5 18-4 24 2-7 6-16 6-24-2z'),
    bread: V('M12 56c0-18 17-30 38-30s38 12 38 30c0 12-16 20-38 20S12 68 12 56z', 'url(#rBread)') + L_('M32 40l-4 14M48 36l-3 18M66 40l-3 14', '#fbe3bb', 3.2, 'opacity=".7"') + EL(50, 72, 34, 5, '#6e3c17', 0) + HI(32, 38, 12, 6, -18, .6),
    egg: V('M50 10c17 0 30 27 30 47 0 19-13 32-30 32S20 76 20 57c0-20 13-47 30-47z', 'url(#rEgg)') + HI(38, 36, 8, 14, 16, .8),
    leaf: V('M16 82C12 42 42 12 86 12c2 42-24 76-70 70z', GR) + L_('M16 84C32 60 52 42 74 26M34 62l-1-17M34 62l17 2M48 48l-1-17M48 48l17 2M61 37l0-13M61 37l13 1', '#d6f5de', 1.7, 'opacity=".65"') + HI(38, 34, 13, 7, -42, .4),
    tree: V('M44 62h12l3 30H41z', WOOD) + L_('M48 66l-1 24M53 66l1 24', '#3c2413', 1.2, 'opacity=".5"') + VC(30, 52, 19, GR) + VC(70, 52, 19, GR) + VC(50, 34, 28, GR) + VC(50, 58, 16, 'url(#gLeafD)') + HI(40, 22, 12, 7, -25, .45),
    palm: V('M46 92c-1-20 1-40 6-58h7c-4 18-5 38-4 58z', 'url(#gWood)') + L_('M47 80h8M48 68h8M49 56h8M50 44h8', '#3c2413', 1.2, 'opacity=".55"') + [[-52, 0], [-30, -6], [-5, -8], [22, -3], [48, 6], [-74, 16], [72, 18]].map(function (q) { return '<g transform="rotate(' + q[0] + ' 55 34)">' + V('M55 34C47 22 49 10 55 0c6 10 8 22 0 34z', GR) + L_('M55 34V2', '#d6f5de', .9, 'opacity=".55"') + '</g>'; }).join('') + VC(49, 38, 3.6, 'url(#rDate)') + VC(57, 40, 3.6, 'url(#rDate)') + VC(53, 36, 3.6, 'url(#rDate)'),
    flower: L_('M50 94V58', '#4f8f5a', 4) + [0, 72, 144, 216, 288].map(function (r) { return '<g transform="rotate(' + r + ' 50 44)">' + VE(50, 25, 12, 16, 'url(#rRose)') + '</g>'; }).join('') + VC(50, 44, 10, GOLD) + HI(47, 41, 4, 3, 0, .8),
    seed: VE(50, 86, 34, 8, 'url(#rSoil)') + L_('M50 84V46', '#5ea86e', 4.4) + leaf('M50 54C34 56 20 46 18 28c17-1 32 9 32 26z', 'M48 52C40 44 30 36 22 31') + leaf('M50 46c0-17 13-29 32-31 1 18-13 31-32 31z', 'M52 44c7-9 17-17 27-26'),
    plant: L_('M50 60V26', '#4f8f5a', 4) + leaf('M50 46c-13 1-24-8-26-22 15-1 26 8 26 22z') + leaf('M50 36c0-13 9-23 24-25 1 15-9 25-24 25z') + leaf('M50 56c11 1 22-5 25-17-13-2-24 4-25 17z') + V('M28 62h44l-6 32H34z', CLAY) + V('M24 56h52a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H24a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z', 'url(#gClayL)') + HI(38, 74, 4, 12, 0, .35),
    grass: VE(50, 88, 36, 7, 'url(#rSoil)') + [[-30, 26], [-20, 40], [-10, 52], [0, 60], [10, 50], [20, 42], [30, 28]].map(function (q) { return '<path d="M' + (50 + q[0]) + ' 88c-4-' + (q[1] * .5) + ' ' + (q[0] * .22) + '-' + q[1] + ' ' + (q[0] * .3) + '-' + q[1] + ' 1 ' + (q[1] * .5) + ' 2 ' + (q[1] * .8) + ' 6 ' + q[1] + 'z" fill="url(#gLeaf)"/>'; }).join(''),
    sun: [0, 45, 90, 135, 180, 225, 270, 315].map(function (r) { return '<g transform="rotate(' + r + ' 50 50)">' + P('M50 4c3 6 5 13 5 18H45c0-5 2-12 5-18z', GOLD) + '</g>'; }).join('') + C_(50, 50, 34, 'url(#rGlowS)') + VC(50, 50, 23, 'url(#rSun)') + HI(42, 42, 9, 6, -30, .9),
    moon: P('M66 10A42 42 0 1 0 90 70 35 35 0 0 1 66 10z', 'url(#rMoon)') + P('M66 10A42 42 0 1 0 90 70 35 35 0 0 1 66 10z', 'url(#rShade)') + C_(26, 42, 5, 'rgba(90,86,70,.28)') + C_(40, 72, 7, 'rgba(90,86,70,.24)') + C_(34, 58, 3, 'rgba(90,86,70,.25)') + C_(46, 28, 3.4, 'rgba(90,86,70,.2)'),
    star: V('M50 7l12.5 27.7 30 3.3-22.4 20.3 6.3 29.7L50 73 23.6 88l6.3-29.7L7.5 38l30-3.3z', GOLD) + P('M50 7l12.5 27.7L50 50z', '#fff', 'opacity=".22"') + P('M50 50L7.5 38l30-3.3L50 7z', '#fff', 'opacity=".12"') + P('M50 50L76.4 88 50 73z', '#000', 'opacity=".12"') + HI(38, 34, 8, 5, -20, .8),
    cloud: V('M26 78a19 19 0 0 1-3-38 25 25 0 0 1 48-7 22 22 0 0 1 4 45z', CL) + HI(40, 30, 16, 8, -12, .85),
    rain: V('M26 56a15 15 0 0 1-2-30 20 20 0 0 1 39-5 18 18 0 0 1 3 35z', 'url(#gCloudD)') + HI(38, 18, 13, 6, -12, .6) + [[28, 66], [50, 72], [72, 64]].map(function (q) { var d = 'M' + q[0] + ' ' + q[1] + 'c4 7 7 10 7 14a7 7 0 0 1-14 0c0-4 3-7 7-14z'; return V(d, W) + HI(q[0] - 2, q[1] + 13, 2, 3, 0, .9); }).join(''),
    drop: V('M50 8c17 24 28 38 28 54a28 28 0 0 1-56 0c0-16 11-30 28-54z', W) + HI(38, 58, 7, 13, 12, .95) + L_('M64 72c-3 5-8 8-13 8', '#fff', 2.4, 'opacity=".5"'),
    ice: P('M50 8l36 18v44L50 92 14 70V26z', 'url(#gIce)') + P('M50 50L14 26 50 8l36 18z', '#fff', 'opacity=".5"') + P('M50 50v42l36-22V26z', '#2b88c4', 'opacity=".22"') + L_('M50 50L14 26M50 50l36-24M50 50v42', '#fff', 1.6, 'opacity=".75"') + L_('M26 58l10 6M34 40l6 10M66 58l8-8', '#fff', 1.1, 'opacity=".7"'),
    stone: V('M16 68c-5-17 8-37 28-41 20-4 39 6 43 26 3 17-7 30-24 33-18 3-43 1-47-18z', ST) + C_(36, 50, 1.4, '#39424c') + C_(58, 62, 1.1, '#39424c') + C_(68, 44, 1.6, '#39424c') + C_(46, 70, 1, '#39424c') + HI(38, 38, 13, 6, -22, .45),
    feather: V('M82 12C50 14 24 34 22 66l10-4c-1 5-3 8-6 13 19-3 36-13 45-31l-12 2c9-8 17-21 23-34z', CL) + L_('M86 8C60 32 38 58 14 94', '#8d9eb2', 2.2) + L_('M56 34l10 8M46 44l10 9M36 56l11 7', '#8d9eb2', 1, 'opacity=".55"'),
    coin: VC(50, 50, 38, GOLD) + '<circle cx="50" cy="50" r="30" fill="none" stroke="#8a6420" stroke-width="1.6" opacity=".55"/><circle cx="50" cy="50" r="28.8" fill="none" stroke="#fff3cf" stroke-width="1.2" opacity=".6"/>' + P('M50 28l5 12 12-5-5 12 12 3-12 3 5 12-12-5-5 12-5-12-12 5 5-12-12-3 12-3-5-12 12 5z', '#a07a2c', 'opacity=".55"') + HI(36, 32, 12, 7, -30, .8),
    book: P('M50 28C40 19 23 16 8 19v62c15-3 32 0 42 8 10-8 27-11 42-8V19c-15-3-32 0-42 9z', 'url(#gBook)') + P('M50 24C40 16 25 13 12 15v60c13-2 28 0 38 8 10-8 25-10 38-8V15c-13-2-28 1-38 9z', '#f7efd9') + P('M50 24v59c-10-8-25-10-38-8V15c13-2 28 1 38 9z', '#000', 'opacity=".07"') + L_('M50 24v59', '#c9b98d', 1.5),
    rehal: V('M20 95l44-44 7 7-44 44z', WOOD) + V('M80 95L36 51l-7 7 44 44z', 'url(#gWoodD)') + P('M50 66L9 34v-7l41 31 41-31v7z', 'url(#gBook)') + P('M50 60C40 50 24 44 8 44L12 20c15 0 29 5 38 15z', '#f7efd9') + P('M50 60c10-10 26-16 42-16L88 20c-15 0-29 5-38 15z', '#fffaf0') + P('M50 60C40 50 24 44 8 44L12 20c15 0 29 5 38 15z', '#000', 'opacity=".07"') + L_('M50 35v25', '#c9b98d', 1.6) + L_('M12 20c15 0 29 5 38 15 9-10 23-15 38-15', '#d9b26f', 1.5),
    lantern: L_('M50 3v10', '#8a6420', 3) + '<circle cx="50" cy="5" r="3" fill="none" stroke="#c79c52" stroke-width="2.2"/>' + V('M34 24l16-12 16 12z', GOLD) + C_(50, 46, 34, 'url(#rGlowS)') + P('M34 25h32l6 42H28z', 'url(#rLamp)') + L_('M42 26l-3 40M58 26l3 40M50 26v40', '#8a6420', 2) + V('M26 66h48l-5 13H31z', GOLD) + V('M38 79h24l-2 8H40z', GOLD) + HI(38, 38, 3, 10, 6, .8),
    cup: V('M20 26h50l-5 54a8 8 0 0 1-8 7H33a8 8 0 0 1-8-7z', 'url(#gCream)') + L_('M69 38c17-3 19 23-3 27', '#d9cfb8', 6) + EL(45, 26, 25, 5.5, '#b9ae92') + EL(45, 27, 21, 3.8, '#6db7e0') + HI(32, 50, 3.6, 15, 0, .85),
    jug: V('M38 16h24l-3 13c13 7 18 20 18 32 0 19-12 31-27 31S23 80 23 61c0-12 5-25 18-32z', CLAY) + L_('M72 40c16 2 15 26-4 26', '#a06a42', 5.4) + EL(50, 16, 12, 3.2, '#5e3a22') + L_('M26 54c16 5 32 5 48 0', '#f1dcbf', 1.6, 'opacity=".5"') + HI(37, 50, 5, 16, 8, .55),
    shoe: V('M8 64c9 3 19-3 25-17 7-4 11 0 17 8 9 10 21 13 34 15 9 1 11 12 2 13H16c-9 0-12-10-8-19z', CLAY) + P('M10 78h76c1 4-1 7-5 7H16c-4 0-7-3-6-7z', '#3c2413') + L_('M36 48l6 7M42 44l7 8', '#f1dcbf', 2) + HI(28, 56, 7, 4, -40, .5),
    ball: VC(50, 50, 37, 'url(#rRed)') + P('M50 13c-16 18-16 56 0 74 5 0 10-1 14-3-14-19-14-49 0-68-4-2-9-3-14-3z', '#fff4dc', 'opacity=".92"') + P('M14 45c23-6 49-6 71 0 1 3 1 7 0 10-22-6-48-6-71 0-1-3-1-7 0-10z', '#fff4dc', 'opacity=".92"') + C_(50, 50, 37, 'url(#rShade)') + HI(34, 30, 11, 7, -32, .85),
    spoon: VE(50, 24, 15, 21, STL) + VE(50, 26, 10, 15, 'url(#gSteelD)') + V('M46 43h8l1 45a5 5 0 0 1-10 0z', STL) + HI(43, 18, 3, 7, -10, .9),
    boat: V('M14 60h72l-11 22a6 6 0 0 1-5 3H30a6 6 0 0 1-5-3z', CLAY) + L_('M18 67h64', '#6e3c17', 1.4) + L_('M48 10v50', '#6a4a26', 3.4) + V('M52 12l28 42H52z', CL) + V('M45 22L24 54h21z', 'url(#gCream)') + L_('M4 88c8-5 15-5 23 0s15 5 23 0 15-5 23 0 15 5 23 0', W, 4.6),
    ship: V('M10 62h80l-13 22a6 6 0 0 1-5 3H28a6 6 0 0 1-5-3z', 'url(#gWoodD)') + L_('M15 69h70', '#2c1a0c', 1.3) + L_('M50 8v54', '#3c2413', 3.4) + V('M54 12c16 12 26 28 28 44H54z', 'url(#gCream)') + V('M46 18C36 28 26 42 22 56h24z', CL) + L_('M4 90c8-4 15-4 23 0s15 4 23 0 15-4 23 0 15 4 23 0', W, 3.8),
    wood: V('M16 34h66v32H16a14 16 0 0 1 0-32z', WOOD) + L_('M22 42h48M18 52h52M24 60h44', '#3c2413', 1.5, 'opacity=".45"') + EL(82, 50, 9, 16, '#d9a877') + '<ellipse cx="82" cy="50" rx="5.5" ry="10" fill="none" stroke="#9c6c3c" stroke-width="1.4"/><ellipse cx="82" cy="50" rx="2.5" ry="5" fill="none" stroke="#9c6c3c" stroke-width="1.2"/>',
    nail: V('M28 10h44l-3 8H31z', STL) + V('M45 18h10l-1 58-4 18-4-18z', STL) + L_('M47 22l-1 50', '#fff', 1.4, 'opacity=".55"'),
    torch: V('M12 40h44v22H12a5 5 0 0 1-5-5V45a5 5 0 0 1 5-5z', 'url(#gDark)') + V('M56 38l14-8v42l-14-8z', STL) + EL(71, 51, 4.6, 21, '#fff6d6') + '<path d="M74 34l22-8v50l-22-8z" fill="url(#rBeam)"/>' + V('M28 36h12v5H28z', '#c92f3b') + HI(20, 45, 10, 2, 0, .4),
    mirror: V('M45 72h10l2 22H43z', GOLD) + VE(50, 40, 29, 36, GOLD) + EL(50, 40, 23, 30, 'url(#gGlass)') + P('M34 22c4-4 10-6 15-6L30 48c-2-9-1-19 4-26z', '#fff', 'opacity=".55"'),
    soap: V('M14 54c0-11 9-18 20-18h32c11 0 20 7 20 18s-9 22-20 22H34c-11 0-20-11-20-22z', 'url(#rRose)') + HI(32, 46, 13, 5, -10, .8) + ['30,22,7', '50,14,5', '68,24,6'].map(function (q) { var v = q.split(','); return '<circle cx="' + v[0] + '" cy="' + v[1] + '" r="' + v[2] + '" fill="rgba(200,235,250,.28)" stroke="#a9dcf0" stroke-width="1.2"/>' + C_(+v[0] - 2, +v[1] - 2, 1.3, '#fff'); }).join(''),
    tap: V('M8 28h48a12 12 0 0 1 12 12v8H52v-4H8z', STL) + V('M26 14h14v14H26z', 'url(#gSteelD)') + V('M18 8h30a3 3 0 0 1 0 7H18a3 3 0 0 1 0-7z', GOLD) + V('M50 46h20v7H50z', 'url(#gSteelD)') + V('M60 60c5 8 8 11 8 15a8 8 0 0 1-16 0c0-4 3-7 8-15z', W) + HI(57, 74, 2, 4, 0, .9) + HI(22, 33, 15, 2.4, 0, .85),
    pencil: V('M72 10l18 18-52 52-20-20z', GOLD) + P('M72 10l6 6-52 52-6-6z', '#fff', 'opacity=".2"') + V('M72 10l5-5a6 6 0 0 1 8 0l10 10a6 6 0 0 1 0 8l-5 5z', 'url(#rRose)') + P('M72 10l5 5-1 1 11 11 1-1 2 2-4 4-18-18z', ST) + P('M18 60l20 20-26 8z', '#f1dcbf') + P('M12 88l3-9 6 6z', '#2a2118'),
    pot: V('M16 42h68l-6 34a14 14 0 0 1-14 12H36a14 14 0 0 1-14-12z', STL) + EL(50, 42, 35, 6, '#c9d6e3') + EL(50, 43, 30, 4, '#5a6672') + L_('M10 44H4M90 44h6', '#6d7884', 5) + L_('M38 16c-6 6 6 10 0 18M58 16c-6 6 6 10 0 18', '#cdd9e4', 3.4, 'opacity=".65"') + HI(30, 62, 4, 14, 8, .8),
    kettle: V('M26 42c0-12 12-20 26-20s26 8 26 20l4 38a8 8 0 0 1-8 8H30a8 8 0 0 1-8-8z', STL) + V('M26 56L8 40c-2 8-1 18 18 34z', STL) + L_('M34 22c0-14 36-14 36 0', '#39424c', 4.4) + C_(52, 21, 4, '#39424c') + P('M6 36c-4-9 5-11 2-20 5 0 11 5 9 13-1 6-7 7-11 7z', '#fff', 'opacity=".55"') + HI(38, 56, 4, 18, 6, .8),
    'water-glass': P('M26 12h48l-6 76a6 6 0 0 1-6 5H38a6 6 0 0 1-6-5z', 'url(#gGlass)') + P('M29 46h42l-3.5 42a6 6 0 0 1-6 5H38.5a6 6 0 0 1-6-5z', W, 'opacity=".78"') + EL(50, 46, 21, 3.4, '#c0e8f8') + L_('M31 16l5 70', '#fff', 2.4, 'opacity=".65"') + '<path d="M26 12h48" stroke="#e5f3fa" stroke-width="2"/>',
    magnet: V('M16 12h22v38a12 12 0 0 0 24 0V12h22v38a34 34 0 0 1-68 0z', 'url(#rRed)') + V('M16 12h22v14H16z', STL) + V('M62 12h22v14H62z', STL) + HI(25, 48, 3, 14, 0, .7),
    ink: V('M38 10h24v12H38z', 'url(#gWoodD)') + V('M30 28a6 6 0 0 1 6-6h28a6 6 0 0 1 6 6l6 54a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8z', 'url(#gInk)') + HI(36, 50, 4, 16, 4, .8),
    box: V('M14 40h72v44a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z', 'url(#gWood)') + P('M86 40v48H60V40z', '#000', 'opacity=".16"') + V('M10 30l40-16 40 16-4 12H14z', 'url(#gWoodL)') + L_('M14 56h72M14 72h72', '#3c2413', 1.2, 'opacity=".4"'),
    van: V('M8 40a6 6 0 0 1 6-6h46l24 18v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z', 'url(#gCream)') + P('M8 58h76v8H8z', '#2aa6bb') + P('M60 39h3l17 13H60z', '#27424f') + VC(28, 78, 9, 'url(#gDark)') + VC(68, 78, 9, 'url(#gDark)') + C_(28, 78, 3.4, '#bfc7cf') + C_(68, 78, 3.4, '#bfc7cf') + HI(30, 44, 15, 3, 0, .6),
    umbrella: V('M8 52C10 28 28 12 50 12s40 16 42 40c-7-7-14-7-21 0-7-7-14-7-21 0-7-7-14-7-21 0-7-7-14-7-21 0z', 'url(#gTeal)') + L_('M50 12C40 22 30 36 29 52M50 12c10 10 20 24 21 40M50 12v40', '#0e5a68', 1.6, 'opacity=".6"') + L_('M50 52v30c0 9 13 9 13 0', '#6a4a26', 4) + C_(50, 11, 2.6, '#c79c52') + HI(30, 28, 11, 6, -35, .6),
    yarn: VC(50, 52, 37, 'url(#rYarn)') + L_('M20 36c20 8 44 8 60 2M15 54c24 10 50 10 70-2M22 72c18 6 40 5 56-6M36 18c-8 20-8 48 2 68M52 15c-8 22-6 50 4 72M68 22c-6 18-5 40 2 58', '#7e4d12', 1.5, 'opacity=".45"') + HI(35, 34, 10, 6, -30, .5) + L_('M78 78c8 5 14 4 18-1', '#d68b24', 3),
    zip: V('M8 40h84v24H8z', 'url(#gNavy)') + '<path d="M12 52h76" stroke="#c79c52" stroke-width="6" stroke-dasharray="3 2.4"/>' + V('M42 42h16v22l-8 8-8-8z', GOLD) + V('M47 68h6v18a3 3 0 0 1-6 0z', GOLD),
    chair: V('M28 10h6v80h-6zM66 10h6v80h-6z', 'url(#gWood)') + V('M30 14h40v8H30zM30 28h40v6H30z', 'url(#gWoodL)') + V('M22 52h56l3 9H19z', 'url(#gWoodL)') + V('M24 61h5v30h-5zM71 61h5v30h-5z', 'url(#gWoodD)'),
    ring: '<circle cx="50" cy="50" r="30" fill="none" stroke="url(#gGold)" stroke-width="13"/><path d="M50 26a24 24 0 0 0-24 24" fill="none" stroke="#fff6da" stroke-width="3" stroke-linecap="round" opacity=".75"/><path d="M78 58a30 30 0 0 1-30 22" fill="none" stroke="#7a5a1c" stroke-width="4" stroke-linecap="round" opacity=".4"/>',
    clock: V('M50 8a42 42 0 1 1 0 84 42 42 0 0 1 0-84z', 'url(#gWood)') + C_(50, 50, 33, 'url(#gCream)') + L_('M50 50V26M50 50l15 10', '#2a2118', 4) + C_(50, 50, 3, '#c79c52'),
    masjid: V('M50 12c14 9 22 18 22 32H28c0-14 8-23 22-32z', GOLD) + L_('M50 12v-6', '#a07a2c', 2) + V('M26 44h48v44H26z', 'url(#gStoneW)') + P('M42 88V68c0-6 4-10 8-10s8 4 8 10v20z', '#2c2013') + V('M9 22h9v66H9zM82 22h9v66h-9z', 'url(#gStoneW)') + P('M13.5 10l5.5 12H8zM86.5 10l5.5 12H81z', '#c79c52') + P('M30 66v-8c0-3 2-5 4-5s4 2 4 5v8zM62 66v-8c0-3 2-5 4-5s4 2 4 5v8z', '#6b5436') + V('M3 88h94v6H3z', 'url(#gClayL)') + HI(40, 26, 7, 5, -30, .7),
    kaaba: P('M14 30l36-12 36 12v44L50 90 14 74z', '#17181f') + P('M50 42v48L14 74V30z', '#25272f') + P('M14 40l36 12 36-12v9L50 62 14 49z', '#c79c52') + P('M60 62l14-5v22l-14 6z', '#c79c52', 'opacity=".95"') + P('M50 18L14 30l36 12 36-12z', '#0d0e13'),
    mountain: V('M2 90L36 26l16 26 12-18 34 56z', ST) + P('M36 26l11 18-8-3-7 7-4-6z', '#f0ece1') + P('M64 34l9 15-7-2-5 5-4-5z', '#f0ece1') + P('M36 26L18 60l14-8 8 16z', '#fff', 'opacity=".12"') + P('M52 52l14 38H2z', '#000', 'opacity=".1"'),
    cave: V('M2 90C4 48 22 16 52 14c30-2 44 34 46 76z', ST) + P('M32 90c0-20 8-38 19-38s18 18 18 38z', '#0a0c14') + P('M36 90c0-16 6-32 15-32', 'none', 'stroke="#000" stroke-width="2" opacity=".4"') + HI(36, 32, 15, 8, -30, .3),
    well: V('M22 52h56v36a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4z', ST) + L_('M22 64h56M22 76h56M36 52v12M58 52v12M46 64v12M70 64v12M30 76v16M54 76v16', '#59636e', 1.3, 'opacity=".6"') + EL(50, 52, 28, 7, '#3a4a55') + EL(50, 53, 22, 4.6, '#10354e') + V('M24 50V18h5v32zM71 50V18h5v32z', 'url(#gWood)') + V('M16 14h68v6H16z', 'url(#gWoodL)') + L_('M50 20v18', '#caa873', 2) + V('M43 38h14v9H43z', 'url(#gWood)'),
    tent: V('M6 86L50 16l44 70z', 'url(#gTent)') + P('M50 16L30 86h40z', '#2c1a0c') + L_('M50 16v-8', '#3c2413', 2.4) + P('M50 16l44 70H70z', '#000', 'opacity=".16"'),
    house: V('M16 40h68v50H16z', 'url(#gStoneW)') + V('M10 34h80v8H10z', 'url(#gClayL)') + P('M42 90V66a8 8 0 0 1 16 0v24z', 'url(#gWood)') + P('M24 62v-8a5 5 0 0 1 10 0v8zM66 62v-8a5 5 0 0 1 10 0v8z', '#3d4f66'),
    camel: P('M8 44c4-6 11-7 15-5l3 8h7c3-11 10-17 16-14 4 2 6 7 8 11 3-3 6-4 9-3 7 2 10 9 11 20l1 27h-6l-2-18-5 3 1 15h-6l-1-16c-6 2-14 2-20 0l-1 16h-6l-1-16-5-3-1 19h-6l1-28c-4-5-5-9-4-14l-3 1c-4 1-7-1-10-3z', 'url(#gCamel)') + P('M8 44c4-6 11-7 15-5l3 8h7c3-11 10-17 16-14 4 2 6 7 8 11 3-3 6-4 9-3 7 2 10 9 11 20l1 27h-6l-2-18-5 3 1 15h-6l-1-16c-6 2-14 2-20 0l-1 16h-6l-1-16-5-3-1 19h-6l1-28c-4-5-5-9-4-14l-3 1c-4 1-7-1-10-3z', 'url(#rShade)'),
    sheep: L_('M38 66v22M48 68v20M60 68v20M70 64v22', '#3d3128', 5) + [[34, 44, 16], [50, 36, 17], [68, 42, 16], [78, 54, 13], [62, 58, 15], [44, 58, 16], [28, 56, 13]].map(function (q) { return VC(q[0], q[1], q[2], CL); }).join('') + HI(42, 30, 12, 6, -18, .7),
    bird: P('M8 52c14-17 31-18 42-3 11-15 28-14 42 3-16-6-29-4-42 13-13-17-26-19-42-13z', 'url(#gSlate)') + P('M50 49c-3 5-3 11 0 16 3-5 3-11 0-16z', '#1a2638'),
    fish: V('M10 50c13-22 44-24 62-5l18-15-5 20 5 20-18-15C54 74 23 72 10 50z', W) + P('M28 40c10-9 24-9 34 0-10-3-24-3-34 0z', '#fff', 'opacity=".45"') + L_('M48 38c5 8 5 16 0 24', '#10557f', 1.5, 'opacity=".4"'),
    butterfly: V('M50 44C38 20 10 14 8 32c-1 13 14 24 42 22z', 'url(#rWing)') + V('M50 44c12-24 40-30 42-12 1 13-14 24-42 22z', 'url(#rWing)') + V('M50 54c-14 0-30 6-28 19 2 11 19 9 28-11z', 'url(#rWing)') + V('M50 54c14 0 30 6 28 19-2 11-19 9-28-11z', 'url(#rWing)') + C_(22, 32, 3, '#fff') + C_(78, 32, 3, '#fff') + L_('M50 34v36', '#2a1a12', 4),
    bee: '<ellipse cx="38" cy="30" rx="13" ry="18" fill="#d7ebf5" opacity=".78" transform="rotate(-24 38 30)"/><ellipse cx="62" cy="30" rx="13" ry="18" fill="#d7ebf5" opacity=".78" transform="rotate(24 62 30)"/>' + VE(50, 58, 21, 30, 'url(#rSun)') + '<path d="M31 50c12 4 26 4 38 0v8c-12 4-26 4-38 0zM33 68c11 4 23 4 34 0l-3 8c-9 3-19 3-28 0z" fill="#2a2118"/>' + VC(50, 26, 11, '#2a2118'),
    lock: '<path d="M32 44V30a18 18 0 0 1 36 0v14" fill="none" stroke="url(#gSteel)" stroke-width="8"/>' + V('M22 42h56a4 4 0 0 1 4 4v38a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6V46a4 4 0 0 1 4-4z', GOLD) + C_(50, 62, 6, '#3a2a10') + P('M47 64h6l2 14H45z', '#3a2a10') + HI(32, 52, 9, 4, -12, .6),
    door: V('M18 94V42C18 22 32 8 50 8s32 14 32 34v52z', 'url(#gWoodD)') + L_('M50 8v86M34 16v78M66 16v78', '#2a1a0c', 1.4, 'opacity=".55"') + '<path d="M18 94V42C18 22 32 8 50 8s32 14 32 34v52" fill="none" stroke="url(#gGold)" stroke-width="3"/>' + VC(43, 58, 3.6, GOLD) + VC(57, 58, 3.6, GOLD),
    hand: V('M36 92c-9-11-17-23-21-36-2-7 6-11 11-4l7 13V22c0-8 11-8 11 0v22l1-30c0-8 11-8 11 0l1 30 3-26c1-8 12-7 11 1l-3 31 6-17c3-7 12-3 10 4-3 13-6 29-12 37-3 11-32 13-36 18z', 'url(#gSkin)') + L_('M40 66c6-4 16-4 24 1', '#a06a42', 1.6, 'opacity=".5"'),
    foot: V('M34 92c-9-2-11-15-7-31 3-13 4-23 13-27 11-4 24 0 26 13 2 11-6 19-9 29-2 13-11 19-23 16z', 'url(#gSkin)') + VC(36, 22, 8, 'url(#gSkin)') + VC(49, 18, 5.6, 'url(#gSkin)') + VC(60, 20, 5, 'url(#gSkin)') + VC(69, 25, 4.4, 'url(#gSkin)') + VC(76, 32, 4, 'url(#gSkin)'),
    /* a seashell held up to listen: this is what "hearing" looks like here */
    ear: V('M14 66c-5-26 17-54 44-54 18 0 32 15 28 34-3 16-20 26-34 20-11-4-14-17-7-25 6-7 17-5 19 3 2 6-5 11-9 7', 'url(#gShell)') + L_('M18 70c-2-22 16-50 42-52 16-1 27 13 24 28-3 13-18 22-31 17-9-4-11-14-6-20 5-5 13-3 14 3', '#a4744a', 1.7, 'opacity=".6"') + P('M14 66c5 12 18 22 32 22-11-5-15-13-16-22z', 'url(#gShell)'),
    /* shapes as glazed tiles: a thick edge, a soft top */
    circle: C_(50, 54, 38, '#a12a55') + VC(50, 48, 38, 'url(#rRose)') + HI(36, 32, 12, 7, -28, .8),
    square: '<rect x="14" y="20" width="72" height="72" rx="6" fill="#23438f"/><rect x="14" y="13" width="72" height="72" rx="6" fill="url(#gBlue)"/><rect x="14" y="13" width="72" height="72" rx="6" fill="url(#rShade)"/>' + HI(32, 28, 12, 6, -18, .7),
    rect: '<rect x="6" y="33" width="88" height="48" rx="6" fill="#1b6a44"/><rect x="6" y="26" width="88" height="48" rx="6" fill="url(#gLeaf)"/><rect x="6" y="26" width="88" height="48" rx="6" fill="url(#rShade)"/>' + HI(26, 38, 12, 5, -10, .6),
    triangle: P('M50 18l43 75H7z', '#9e4f12') + V('M50 11l43 75H7z', 'url(#gOrange)') + HI(40, 40, 8, 5, -50, .6),
    hexagon: P('M50 14l37 21v42L50 98 13 77V35z', '#3e2178') + V('M50 7l37 21v42L50 91 13 70V28z', 'url(#gGrape)') + HI(34, 26, 10, 5, -28, .6),
    octa: P('M50 13l14 14 20-5-5 20 18 15-18 15 5 20-20-5-14 15-14-15-20 5 5-20L3 57l18-15-5-20 20 5z', '#8a6420') + V('M50 6l14 14 20-5-5 20 18 15-18 15 5 20-20-5-14 15-14-15-20 5 5-20L3 50l18-15-5-20 20 5z', GOLD) + HI(34, 28, 10, 5, -30, .7)
  };
  /* until the render arrives, the key is its drawn form */
  a.key = a.keyfront;
  A.ART = a;
  var FILE = { key: 'key-forged', keyfront: 'key-front', date: 'date', leaf: 'leaf', palm: 'palm', tree: 'tree', sheep: 'sheep', camel: 'camel', rehal: 'rehal' };
  /* the apple render has a cut slice beside it: at counting sizes it would look like two things, so small uses stay with the single drawn apple */
  var MIN = {};
  var HAS = {}; (window.ART_FILES || []).forEach(function (f) { HAS[f] = 1; });
  var OBJ = {}, KEEP_DRAWN = { lantern: 1 }; (window.OBJ_FILES || []).forEach(function (f) { OBJ[f] = 1; if (!a[f]) a[f] = ' '; });
  A.objUrl = function (n) { return OBJ[n] && !KEEP_DRAWN[n] ? A.asset('img/obj/' + n + '.webp') : null; };
  A.hasImg = function (f) { return !!HAS[f]; };
  A.imgUrl = function (f) { return A.asset('img/art/' + f + '.webp'); };
  A.art = function (name, size, cls) {
    var f = FILE[name];
    var dims = size ? ' width="' + Math.round(size) + '" height="' + Math.round(size) + '"' : '';
    if (f && HAS[f] && !(MIN[name] && size && size < MIN[name])) {
      var file = size && size <= 128 && HAS[f + '-s'] ? f + '-s' : f;
      return '<img class="art art-img' + (cls ? ' ' + cls : '') + '" src="' + A.imgUrl(file) + '"' + dims + ' alt="" draggable="false" decoding="async">';
    }
    if (OBJ[name] && !KEEP_DRAWN[name]) return '<img class="art art-img' + (cls ? ' ' + cls : '') + '" src="' + A.asset('img/obj/' + name + '.webp') + '"' + dims + ' alt="" draggable="false" decoding="async">';
    var b = a[name]; if (!b) return '';
    return '<svg class="art' + (cls ? ' ' + cls : '') + '" viewBox="0 0 100 100"' + dims + ' aria-hidden="true">' + b + '</svg>';
  };
  /* door pieces and key art decode ahead of time, so the first door never flashes */
  var kept = [];
  A.preloadArt = function () {
    /* first the page, then everything else: nothing here may delay the first frame */
    setTimeout(function () {
      var h = A.Sky && A.Sky.hour ? A.Sky.hour() : 12, court = h >= 6 && h < 19 ? 'court-fg-day' : 'court-fg-night';
      [court, 'key-front'].forEach(function (f) {
        if (!HAS[f]) return; var im = new Image(); im.src = A.imgUrl(f); kept.push(im); if (im.decode) im.decode().catch(function () { });
      });
    }, 250);
    if (window.Door) setTimeout(function () { Door.prepare(); }, 900);
    if (HAS['tex-oak']) document.documentElement.style.setProperty('--wood', 'url(' + A.imgUrl('tex-oak') + ')');
  };

  /* ---------- chrome icons ---------- */
  var I = {
    back: 'M15 5l-7 7 7 7', speak: 'M4 9v6h4l5 4V5L8 9zM16 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12', play: 'M7 4.5l13 7.5-13 7.5z', pause: 'M7 4h3.5v16H7zM13.5 4H17v16h-3.5z', check: 'M4.5 12.5l5 5 10-11', close: 'M6 6l12 12M18 6L6 18', help: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM9.4 9.3a2.7 2.7 0 1 1 3.8 2.5c-.8.4-1.2 1-1.2 1.9M12 17v.2', next: 'M9 5l7 7-7 7', lock: 'M6.5 11h11v9h-11zM8.5 11V8a3.5 3.5 0 0 1 7 0v3', path: 'M5 20c6 0 3-6 8-8s7-3 6-8', keys: 'M14 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM10.5 12.5L4 19l2.5 2.5M7 16l2 2', rooms: 'M4 21V11a8 8 0 0 1 16 0v10M9 21v-8a3 3 0 0 1 6 0v8M2 21h20', grown: 'M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 21c0-5 3-9 7-9s7 4 7 9', gear: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM19 12l2-1-1-3-2 .4-1.4-1.4L17 5l-3-1-1 2h-2L10 4 7 5l.4 2L6 8.4 4 8l-1 3 2 1v0l-2 1 1 3 2-.4L7.4 17 7 19l3 1 1-2h2l1 2 3-1-.4-2 1.4-1.4 2 .4 1-3z', mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3', stop: 'M6 6h12v12H6z', plus: 'M12 5v14M5 12h14', swap: 'M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4', print: 'M7 8V3h10v5M6 18H3v-8h18v8h-3M7 14h10v7H7z', chart: 'M4 20V4M4 20h16M8 16v-5M13 16V8M18 16v-3', eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z', talk: 'M4 5h16v11H9l-5 4z', book: 'M12 6C10 4.5 7 4 4 4.5v14C7 18 10 18.5 12 20c2-1.5 5-2 8-1.5v-14C17 4 14 4.5 12 6zM12 6v14', walk: 'M13 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9 21l2-7 3 3v4M11 14l-1-5 4-1 3 4 3 1M6 12l4-3', clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2' };
  A.icon = function (n, s) { var cl = 'ic' + (n === 'back' || n === 'next' ? ' ic-flip' : ''); return '<svg class="' + cl + '" viewBox="0 0 24 24" width="' + (s || 22) + '" height="' + (s || 22) + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (I[n] || '') + '"/></svg>'; };

  /* a true eight-fold star, for medallions and page corners */
  A.girih = function (color, op) {
    var c = color || '#f1d59e', o = op || .35, s = '';
    for (var i = 0; i < 8; i++) s += '<path d="M50 50L50 14" transform="rotate(' + (i * 45) + ' 50 50)"/>';
    return '<g fill="none" stroke="' + c + '" stroke-width="1.2" opacity="' + o + '"><rect x="18" y="18" width="64" height="64"/><rect x="18" y="18" width="64" height="64" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="16"/>' + s + '</g>';
  };

  /* a room's portal: a pointed arch in glazed tile, a gold line, a lit alcove */
  var HEX = { emerald: ['#0f6b4b', '#063b2a'], rose: ['#9c2a4f', '#541327'], teal: ['#10707f', '#073d47'], sapphire: ['#274fa8', '#112a63'], violet: ['#56349f', '#2c195c'], amber: ['#b05a14', '#62300a'], gold: ['#9a7428', '#553e12'] };
  var OUT = 'M12 248V106C12 62 62 34 100 4c38 30 88 58 88 102v142z', INN = 'M44 248V116c0-30 34-50 56-70 22 20 56 40 56 70v132z';
  A.portalImg = function (room, small) { var f = 'portal-' + room; if (!HAS[f]) return ''; return '<img class="portal-img" src="' + A.imgUrl(small && HAS[f + '-s'] ? f + '-s' : f) + '" alt="" draggable="false" decoding="async">'; };
  A.portal = function (hue) {
    var h = HEX[hue] || HEX.gold, id = 'p' + hue;
    return '<svg class="portal-svg" viewBox="0 0 200 250" aria-hidden="true"><defs><linearGradient id="' + id + 'a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + h[0] + '"/><stop offset="1" stop-color="' + h[1] + '"/></linearGradient><radialGradient id="' + id + 'b" cx=".5" cy=".62" r=".7"><stop offset="0" stop-color="#fff0c2"/><stop offset=".42" stop-color="' + h[0] + '"/><stop offset="1" stop-color="#05060a"/></radialGradient></defs>' +
      '<path d="' + OUT + '" fill="url(#' + id + 'a)"/><path d="' + OUT + '" fill="url(#pTile)"/><path d="' + OUT + '" fill="url(#rShade)" opacity=".7"/>' +
      '<path d="' + OUT + '" fill="none" stroke="url(#gGold)" stroke-width="2.6"/><path d="M26 248V110c0-36 44-62 74-88 30 26 74 52 74 88v138" fill="none" stroke="#f1d59e" stroke-width="1" opacity=".55"/>' +
      '<path d="' + INN + '" fill="url(#' + id + 'b)"/><path d="' + INN + '" fill="none" stroke="url(#gGold)" stroke-width="3"/><path d="M50 248V118c0-27 30-46 50-64" fill="none" stroke="#000" stroke-width="7" opacity=".28"/>' +
      '<path d="M40 214h120v8H40z" fill="url(#gGold)"/></svg>';
  };

  /* the lock plate on the door: a brass escutcheon with an eight-point keyhole surround */
  A.lockPlate = function () {
    return '<svg viewBox="0 0 120 170" aria-hidden="true"><path d="M60 3c13 11 27 16 44 19 3 21 3 42-1 63-3 28-22 56-43 82-21-26-40-54-43-82-4-21-4-42-1-63 17-3 31-8 44-19z" fill="url(#gBronze)"/><path d="M60 3c13 11 27 16 44 19 3 21 3 42-1 63-3 28-22 56-43 82-21-26-40-54-43-82-4-21-4-42-1-63 17-3 31-8 44-19z" fill="url(#rShade)"/><path d="M60 11c11 9 24 14 37 17 2 18 2 37-1 56-3 25-19 49-36 72-17-23-33-47-36-72-3-19-3-38-1-56 13-3 26-8 37-17z" fill="none" stroke="#d9b26f" stroke-width="1.4" opacity=".7"/>' +
      [[60, 22], [97, 40], [97, 82], [60, 150], [23, 40], [23, 82]].map(function (q) { return '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="3" fill="#7a5a1c"/><circle cx="' + (q[0] - .9) + '" cy="' + (q[1] - .9) + '" r="1.5" fill="#fff0c8"/>'; }).join('') +
      '<circle cx="60" cy="66" r="31" fill="#4a3412"/><circle cx="60" cy="66" r="29" fill="url(#gGold)"/><circle cx="60" cy="66" r="21" fill="#100a03"/><circle cx="60" cy="66" r="21" fill="none" stroke="#000" stroke-width="3" opacity=".6"/></svg>';
  };

  /* the real moon tonight: synodic age from a known new moon */
  A.moonAge = function (d) { var syn = 29.530588853, known = Date.UTC(2000, 0, 6, 18, 14); var x = (((d || A.now()).getTime() - known) / 86400000) % syn; return x < 0 ? x + syn : x; };
  A.moonPath = function (cx, cy, r, age) {
    var f = age / 29.530588853, k = Math.cos(f * 2 * Math.PI), wax = f < .5, rx = Math.abs(k) * r;
    var sweepOuter = wax ? 1 : 0, sweepInner = (k > 0) === wax ? 0 : 1;
    return 'M' + cx + ' ' + (cy - r) + 'A' + r + ' ' + r + ' 0 0 ' + sweepOuter + ' ' + cx + ' ' + (cy + r) + 'A' + rx + ' ' + r + ' 0 0 ' + sweepInner + ' ' + cx + ' ' + (cy - r) + 'Z';
  };
})();
