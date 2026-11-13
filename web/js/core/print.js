/* Printables. Nothing here is a fixed PDF: every sheet is made for this child, from what they know today, and a fresh one is a tap away.
   Practice sheets remember their answers, so a grown-up can mark the paper in the app and it counts as real evidence.
   Religious text on paper comes only from the verified data, exactly as it is on screen. */
(function () {
  'use strict';
  var A = window.A, C = window.C, M = window.M, Hifz = window.Hifz, esc = A.esc, L = A.L, T = A.T;
  var Print = window.Print = {};

  /* ---------- paper ---------- */
  Print.CSS = '@page{size:A4;margin:11mm}.pp{box-sizing:border-box;width:188mm;height:274mm;overflow:hidden;display:flex;flex-direction:column;background:#fff;color:#1b1610;font-family:Quicksand,sans-serif;font-weight:600;font-size:14pt;line-height:1.35;page-break-after:always;break-after:page;position:relative;-webkit-print-color-adjust:exact;print-color-adjust:exact}.pp:last-child{page-break-after:auto;break-after:auto}.pp *{box-sizing:border-box}.pp-h{flex:none;display:flex;justify-content:space-between;align-items:flex-end;gap:6mm;border-bottom:1.6pt solid #b98c3f;padding-bottom:2.5mm;margin-bottom:3mm}.pp-ti{min-width:0}.pp-ti small{display:block;font-size:9pt;color:#8a6420;font-weight:700;margin-bottom:.5mm}.pp-ti b{display:block;font-size:21pt;line-height:1.12}.pp-who{flex:none;display:flex;gap:4mm;align-items:flex-end;font-size:9pt;color:#6b5f4c;font-weight:700}.pp-who>span{display:flex;flex-direction:column;gap:.8mm}.pp-who u{text-decoration:none;display:block;min-width:32mm;height:7.5mm;line-height:7.5mm;border-bottom:1pt solid #1b1610;font-size:13pt;color:#1b1610;font-weight:700;white-space:nowrap}.pp-who .pp-sc{border:1.4pt solid #1b1610;border-radius:2.5mm;padding:1.2mm 3mm 1mm;align-items:center}.pp-sc u{min-width:22mm;border:0;text-align:end;font-size:14pt}.pp-n{flex:none;font-size:11pt;color:#55493a;margin-bottom:3mm;font-weight:500}.pp-b{flex:1 1 0;min-height:0;display:flex;flex-direction:column}.fill{flex:1 1 0;min-height:0}.pp-f{flex:none;display:flex;justify-content:space-between;align-items:baseline;gap:4mm;border-top:.6pt solid #d9cfb8;padding-top:1.6mm;margin-top:3mm;font-size:8.5pt;color:#8a7a5c;font-weight:600}.pp-f span:nth-child(2){flex:1;text-align:center}.pp .ar{font-family:Amiri,serif;direction:rtl}.pp-qs{display:grid;column-gap:9mm}.pp-qs.two{grid-template-columns:1fr 1fr}.pq{display:grid;grid-template-columns:6mm minmax(0,1fr) 7mm;grid-template-rows:auto minmax(0,1fr);column-gap:2.5mm;row-gap:2mm;min-height:0;padding:2.4mm 0 3mm;border-bottom:.6pt solid #e6dece}.pq i{font-style:normal;color:#8a7a5c;font-size:10pt;padding-top:1.6mm}.pq-b{min-width:0;line-height:1.9}.pq-k{width:7mm;height:7mm;border:1pt solid #bdb4a2;border-radius:1.5mm;margin-top:.6mm}.pq-w{grid-column:2/4;grid-row:2;min-height:0;border-radius:1.6mm}.pq.nw{grid-template-rows:auto}.pq-w.sq{border:.6pt solid #e4dccb;background:linear-gradient(#eee7d8 .5pt,transparent .5pt) 0 0/5mm 5mm,linear-gradient(90deg,#eee7d8 .5pt,transparent .5pt) 0 0/5mm 5mm}.pq-w.ln{background:linear-gradient(transparent calc(100% - .6pt),#d6cbb4 calc(100% - .6pt)) 0 0/100% 9mm}.pq-o{display:flex;flex-wrap:wrap;gap:6px 20px;margin-top:4px;font-weight:500}.pq-o span::before{content:"";display:inline-block;width:11px;height:11px;border:1pt solid #8a7a5c;border-radius:50%;margin-inline-end:5px;vertical-align:-1px}.blank{display:inline-block;min-width:24mm;height:10mm;border:1.1pt solid #8a7a5c;border-radius:2mm;background:#fff;margin:0 4px;vertical-align:middle}.pics{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:3px}.pics svg,.pics img{width:26px;height:26px;object-fit:contain}.tr{display:grid;grid-template-rows:repeat(6,1fr);gap:2.5mm}.tr-row{display:grid;grid-template-columns:repeat(5,1fr);gap:2mm;min-height:0}.tr-row svg{width:100%;height:100%;border:.6pt solid #d9cfb8;border-radius:4px;background:#fff;display:block}.grid{display:grid;gap:0}.cell{border:.8pt dashed #a89a7e;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:6px;min-height:0;overflow:hidden;break-inside:avoid;gap:4px}.cell .big{font-size:58pt;line-height:1.15;font-weight:800}.cell .ar.big{font-weight:400;font-size:66pt;line-height:1.25}.cell small{font-size:11pt;color:#55493a}.cell svg,.cell img{width:68px;height:68px;object-fit:contain}.cell.own small{color:#bdb4a2;font-size:10pt}.solid .cell{border:1.1pt solid #1b1610}.huge{display:flex;align-items:center;justify-content:center;font-size:330pt;font-weight:800;line-height:1}.huge.ar{font-family:Amiri,serif;font-weight:400;font-size:400pt}.mid{display:flex;flex-direction:column;justify-content:space-around}.mid.c{justify-content:center}.frame{display:grid;grid-template-columns:repeat(5,1fr);border:2pt solid #1b1610}.frame span{aspect-ratio:1;border:1pt solid #1b1610}.tbl{display:flex;flex-direction:column}.tbl table{flex:1}.chart{width:100%;border-collapse:collapse;font-size:11.5pt}.chart td,.chart th{border:.8pt solid #8a7a5c;padding:5px;text-align:center}.chart th{background:#f6efe0;font-weight:700;height:9mm}.chart td.l{text-align:start;font-weight:600}.hund{display:grid;grid-template-columns:repeat(10,1fr);border:1pt solid #1b1610}.hund span{aspect-ratio:1;border:.5pt solid #8a7a5c;display:flex;align-items:center;justify-content:center;font-size:13pt;font-weight:700}.lin{position:relative;height:16mm;margin:0 7mm}.lin hr{position:absolute;left:0;right:0;top:4mm;margin:0;border:0;border-top:2pt solid #1b1610}.lin span{position:absolute;top:2mm;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;font-size:12pt;font-weight:700}.lin span::before{content:"";width:1.5pt;height:4.4mm;background:#1b1610;margin-bottom:1mm}.pv{display:grid;grid-template-columns:repeat(3,1fr);border:1.6pt solid #1b1610}.pv div{border-inline-end:1pt solid #1b1610;text-align:center;padding-top:8px;font-weight:700}.moons{display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(5,1fr);gap:2mm}.moons div{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1mm;font-size:10.5pt;color:#55493a}.moons i{display:block;width:25mm;height:25mm;border:1pt solid #8a7a5c;border-radius:50%}.box{border:1pt solid #8a7a5c;border-radius:6px;padding:10px;margin-bottom:3mm;break-inside:avoid;display:flex;flex-direction:column;min-height:0}.box:last-child{margin-bottom:0}.box b{display:block;margin-bottom:4px;flex:none}.lines{height:27mm;background:linear-gradient(transparent calc(100% - .7pt),#c9bda3 calc(100% - .7pt)) 0 0/100% 9mm}.box.fill .lines{flex:1;height:auto}.dua .ar{font-size:19pt;line-height:1.7;display:block;margin-bottom:4px}.dua small{display:block;font-size:10pt;line-height:1.3;color:#3a3226;font-weight:500}.dua em{display:block;font-size:8.500pt;color:#6b5f4c;font-style:normal;margin-top:3px}.cert{border:3pt double #b98c3f;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:14px;padding:18mm}.cert img,.cert svg{width:44mm;height:44mm;object-fit:contain}.cert h1{font-size:30pt;margin:0}.cert h2{font-size:22pt;margin:0;color:#8a6420}.cert p{margin:0;font-weight:500}.keysg{display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:13mm;gap:1.5mm}.keysg div{border:.7pt solid #bdb4a2;border-radius:5px;padding:1mm 1.2mm;font-size:8.5pt;text-align:center;font-weight:600;line-height:1.15;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3}.keysg div.on{background:#f6e7c6;border-color:#b98c3f}.pp-t{flex:none;font-size:12pt;font-weight:700;margin:3mm 0 1.5mm;color:#8a6420;line-height:1.2}.pp-b>.pp-t:first-child{margin-top:0}.pp sup{font-size:.62em;line-height:0;vertical-align:.62em}.pp .fr{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.05;margin:0 2px;font-size:.82em}.pp .fr i{font-style:normal;padding:0 3px}.pp .fr i:first-child{border-bottom:1.2pt solid currentColor}';
  function fontFaces() { return "@font-face{font-family:Quicksand;src:url(fonts/Quicksand-400-700-latin.woff2) format('woff2');font-weight:400 700}@font-face{font-family:Amiri;src:url(fonts/Amiri-400-arabic.woff2) format('woff2')}"; }
  /* every page is the same A4 frame: a header that says what it is and whose it is, a body that fills the paper, and a footer
     with the sheet's code, the date it was made and its page number, so a loose page can always be matched to the app.
     o.score: a box for the mark; o.bare: no header (floor letters, certificate); o.nofoot; o.cls: classes for the body */
  var PG = '%%PG%%';
  function foot(ctx) {
    var k = K[ctx.kind] || {}, hint = k.use === 'mark' ? L(['Afterwards, mark it in Miftāḥ: Parents, Today', 'بعد ذلك صحّحها في مفتاح: الوالدان، اليوم']) : k.use === 'do' ? L(['When it is done, tick it in Miftāḥ: Parents, Today', 'عند إنجازها أشِر إليها في مفتاح: الوالدان، اليوم']) : '';
    return '<footer class="pp-f"><span>' + esc(L(['Miftāḥ', 'مفتاح'])) + ' · ' + esc(ctx.code) + ' · ' + esc(A.now().toLocaleDateString(A.ar() ? 'ar' : 'en', { day: 'numeric', month: 'short', year: 'numeric' })) + '</span><span>' + esc(hint) + '</span><span>' + PG + '</span></footer>';
  }
  function page(ctx, title, note, body, o) {
    o = o || {};
    var who = '<div class="pp-who"><span>' + esc(L(['Name', 'الاسم'])) + '<u>' + esc(ctx.p.name) + '</u></span><span>' + esc(L(['Date', 'التاريخ'])) + '<u></u></span>' + (o.score ? '<span class="pp-sc">' + esc(L(['Score', 'النتيجة'])) + '<u>/ ' + A.num(o.score) + '</u></span>' : '') + '</div>';
    var head = o.bare ? '' : '<header class="pp-h"><div class="pp-ti">' + (ctx.kick ? '<small>' + esc(ctx.kick) + '</small>' : '') + '<b>' + esc(title) + '</b></div>' + who + '</header>';
    return '<section class="pp">' + head + (note ? '<div class="pp-n">' + esc(note) + '</div>' : '') + '<div class="pp-b' + (o.cls ? ' ' + o.cls : '') + '">' + body + '</div>' + (o.nofoot ? '' : foot(ctx)) + '</section>';
  }
  /* blank cards that finish a page, so a short set still cuts into whole, even cards */
  function padCells(cells, per) { var out = cells.slice(); while (out.length % per) out.push('<div class="cell own"><small>' + esc(L(['Make your own', 'اصنع بطاقتك'])) + '</small></div>'); return out; }
  /* to paper: the phone's print service (which can also save a PDF), or the browser's */
  /* while printing, the sheet is the only thing on the page: the print capture on phones does not reliably follow print styles */
  function restore() { document.documentElement.classList.remove('printing'); var o = A.$('#printroot'); if (o) o.remove(); }
  Print.send = function (html, name) {
    restore();
    var d = document.createElement('div'); d.id = 'printroot';
    var paper = '@page{size:A4;margin:0}#printroot .pp{width:210mm;height:297mm;padding:11mm;margin:0}#printroot{background:#fff}';
    var only = function (pre) { return pre + 'html,' + pre + 'body{margin:0!important;padding:0!important;background:#fff!important;height:auto!important;min-height:0!important;overflow:visible!important}' + pre + 'body>*:not(#printroot):not(svg){display:none!important}' + pre + '#printroot{display:block}'; };
    var desk = !!window.DeskBridge;
    d.innerHTML = '<style>' + fontFaces() + Print.CSS + paper + (desk ? '@media screen{#printroot{display:none!important}}@media print{' + only('') + '}' : only('html.printing ')) + '</style>' + html;
    if (!desk) document.documentElement.classList.add('printing');
    document.body.appendChild(d);
    if (!desk) window.scrollTo(0, 0);
    var imgs = Array.prototype.slice.call(d.querySelectorAll('img')).map(function (im) { return im.decode ? im.decode().catch(function () { }) : Promise.resolve(); });
    Promise.all(imgs).then(function () {
      setTimeout(function () {
        if (A.N.has()) {
          if (A.N.call('printPage', name || 'Miftah') === false) { restore(); A.toast(T('Printing is not available on this device')); }
          else { var was = window.__native.onResume; window.__native.onResume = function () { window.__native.onResume = was; setTimeout(restore, 600); if (was) was(); }; }
        } else { window.addEventListener('afterprint', restore, { once: true }); window.print(); }
      }, 260);
    });
  };

  /* ---------- what this child knows ---------- */
  function knownLetters(pid) { var out = []; (C.FAM || []).forEach(function (f) { if (M.met(f[0], pid)) out = out.concat(f[1]); }); return out; }
  function nextLetters(pid) { var f = (C.FAM || []).filter(function (x) { return !M.met(x[0], pid); })[0]; return f ? f[1] : []; }
  function lettersFor(pid, n) { var k = knownLetters(pid).concat(nextLetters(pid)); if (!k.length) k = C.FAM[0][1].slice(); return n ? k.slice(-n) : k; }
  function knownSounds(pid) { var out = []; (C.SOUNDLESSONS || []).forEach(function (x) { if (M.met(x.id, pid)) out = out.concat(x.g); }); return out; }
  function soundsFor(pid, n) { var k = knownSounds(pid); var nx = (C.SOUNDLESSONS || []).filter(function (x) { return !M.met(x.id, pid); })[0]; if (nx) k = k.concat(nx.g); return n ? k.slice(-n) : k; }
  var BY = function (ch) { return (C.LETTERS || []).filter(function (l) { return l.ch === ch; })[0] || { name: ch, en: ch }; };
  function picOf(art, size) { return A.art(art, size || 68); }

  /* ---------- tracing, from the same strokes the app teaches ---------- */
  function traceSvg(set, ch, style) {
    var data = (window.STROKES[set] || {})[ch]; if (!data) return '<svg viewBox="0 0 100 100"></svg>';
    var s = '<svg viewBox="-4 -4 108 108">';
    data.forEach(function (st, i) {
      if (st.length === 1) { s += style === 'blank' ? '' : '<circle cx="' + st[0][0] + '" cy="' + st[0][1] + '" r="5.500" fill="' + (style === 'guide' ? '#b9ad96' : 'none') + '" stroke="#b9ad96" stroke-width="1"/>'; return; }
      var d = st.map(function (q, j) { return (j ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('');
      if (style === 'guide') {
        s += '<path d="' + d + '" fill="none" stroke="#d9cfb8" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="' + d + '" fill="none" stroke="#8a7a5c" stroke-width="1.100" stroke-dasharray="3 3"/>';
        s += '<circle cx="' + st[0][0] + '" cy="' + st[0][1] + '" r="4.500" fill="#b98c3f"/><text x="' + st[0][0] + '" y="' + (st[0][1] + 2.2) + '" font-size="6" text-anchor="middle" fill="#fff" font-weight="700">' + (i + 1) + '</text>';
        var m = st[Math.min(3, st.length - 1)], m0 = st[0], ang = Math.atan2(m[1] - m0[1], m[0] - m0[0]), ax = m0[0] + Math.cos(ang) * 12, ay = m0[1] + Math.sin(ang) * 12;
        s += '<path d="M' + (ax + Math.cos(ang) * 4).toFixed(1) + ' ' + (ay + Math.sin(ang) * 4).toFixed(1) + 'L' + (ax + Math.cos(ang + 2.5) * 4).toFixed(1) + ' ' + (ay + Math.sin(ang + 2.5) * 4).toFixed(1) + 'L' + (ax + Math.cos(ang - 2.5) * 4).toFixed(1) + ' ' + (ay + Math.sin(ang - 2.5) * 4).toFixed(1) + 'Z" fill="#b98c3f"/>';
      } else if (style === 'ghost') s += '<path d="' + d + '" fill="none" stroke="#c9bfa8" stroke-width="1.500" stroke-dasharray="2.500 3" stroke-linecap="round"/>';
    });
    return s + '</svg>';
  }
  function traceSheet(ctx, set, chars, title) {
    if (!chars.length) return '';
    var row = function (ch, styles) { return '<div class="tr-row" ' + (set === 'ar' ? 'dir="rtl"' : '') + '>' + styles.map(function (st) { return traceSvg(set, ch, st); }).join('') + '</div>'; };
    /* six rows to a page; when there are fewer letters than rows, each letter gets another row of practice beneath it */
    var n = chars.length, total = Math.ceil(n / 6) * 6, extra = total - n, rows = [];
    chars.forEach(function (ch, i) { rows.push(row(ch, ['guide', 'ghost', 'ghost', 'blank', 'blank'])); for (var k = 0; k < Math.floor(extra / n) + (i < extra % n ? 1 : 0); k++) rows.push(row(ch, ['ghost', 'blank', 'blank', 'blank', 'blank'])); });
    var pages = []; for (var i = 0; i < rows.length; i += 6) pages.push(page(ctx, title, i ? '' : T('Start at the gold dot and follow the arrow. Then try with fewer dots, then from memory.'), '<div class="tr fill">' + rows.slice(i, i + 6).join('') + '</div>'));
    return pages.join('');
  }

  /* ---------- practice questions at this child's level ---------- */
  function clamp(a, lo, hi) { return Math.max(lo, Math.min(hi, a)); }
  function eq(s) { return (window.Teach && Teach.math ? Teach.math(String(s)) : A.pow(esc(A.num(s)))).replace('?', '<span class="blank"></span>'); }
  function pics(art, n) { var h = ''; for (var i = 0; i < n; i++) h += A.art(art, 26); return '<div class="pics">' + h + '</div>'; }
  var MATH = {
    'm.count5': function (r) { var n = r.int(1, 5), o = r.pick(['date', 'apple', 'star', 'leaf']); return { h: pics(o, n) + T('How many?') + ' <span class="blank"></span>', a: n }; },
    'm.count10': function (r) { var n = r.int(4, 10), o = r.pick(['date', 'star', 'leaf']); return { h: pics(o, n) + T('How many?') + ' <span class="blank"></span>', a: n }; },
    'm.frame': function (r) { var n = r.int(3, 9), o = r.pick(['date', 'star']); return { h: pics(o, n) + T('How many more to make 10?') + ' <span class="blank"></span>', a: 10 - n }; },
    'm.more': function (r) { var n = r.int(1, 9), up = r.bool(); return { h: esc(T(up ? 'One more than' : 'One less than')) + ' ' + A.num(n + (up ? 0 : 1)) + ' = <span class="blank"></span>', a: up ? n + 1 : n }; },
    'm.compare': function (r) { var a = r.int(1, 10), b = r.int(1, 10); while (b === a) b = r.int(1, 10); return { h: esc(T('Circle the bigger number')) + ': <b>' + A.num(a) + '</b> &nbsp; <b>' + A.num(b) + '</b>', a: Math.max(a, b) }; },
    'm.bond5': function (r) { var w = r.int(3, 5), a = r.int(1, w - 1); return { h: eq(a + ' + ? = ' + w), a: w - a }; },
    'm.bond10': function (r) { var a = r.int(1, 9); return { h: eq(a + ' + ? = 10'), a: 10 - a }; },
    'm.add10': function (r) { var a = r.int(1, 8), b = r.int(1, 10 - a); return { h: eq(a + ' + ' + b + ' = ?'), a: a + b }; },
    'm.sub10': function (r) { var a = r.int(3, 10), b = r.int(1, a - 1); return { h: eq(a + ' − ' + b + ' = ?'), a: a - b }; },
    'm.teens': function (r) { var n = r.int(11, 20); return { h: eq('10 + ' + (n - 10) + ' = ?'), a: n }; },
    'm.add20': function (r) { var a = r.int(6, 9), b = r.int(11 - a, 9); return { h: eq(a + ' + ' + b + ' = ?'), a: a + b }; },
    'm.sub20': function (r) { var a = r.int(11, 18), b = r.int(a - 9, 9); return { h: eq(a + ' − ' + b + ' = ?'), a: a - b }; },
    'm.tens': function (r) { var t = r.int(2, 9), o = r.int(0, 9); return { h: A.num(t * 10 + o) + ' = <span class="blank"></span> ' + esc(T('tens')) + ' + <span class="blank"></span> ' + esc(T('ones')), a: A.num(t) + ', ' + A.num(o) }; },
    'm.skip': function (r) { var k = r.pick([2, 5, 10]), s = r.int(1, 5) * k; return { h: A.num(s) + ', ' + A.num(s + k) + ', ' + A.num(s + 2 * k) + ', <span class="blank"></span>', a: s + 3 * k }; },
    'm.pv1000': function (r) { var n = r.int(100, 999); return { h: A.num(Math.floor(n / 100)) + ' ' + esc(T('hundreds')) + ' + ' + A.num(Math.floor(n / 10) % 10) + ' ' + esc(T('tens')) + ' + ' + A.num(n % 10) + ' ' + esc(T('ones')) + ' = <span class="blank"></span>', a: n }; },
    'm.addCol': function (r) { var a = r.int(120, 480), b = r.int(120, 480); return { h: eq(a + ' + ' + b + ' = ?'), a: a + b }; },
    'm.subCol': function (r) { var a = r.int(300, 900), b = r.int(110, 290); return { h: eq(a + ' − ' + b + ' = ?'), a: a - b }; },
    'm.t2': function (r) { var k = r.pick([2, 5, 10]), n = r.int(2, 10); return { h: eq(k + ' × ' + n + ' = ?'), a: k * n }; },
    'm.t3': function (r) { var k = r.pick([3, 4]), n = r.int(2, 10); return { h: eq(k + ' × ' + n + ' = ?'), a: k * n }; },
    'm.t6': function (r) { var k = r.int(6, 9), n = r.int(2, 10); return { h: eq(k + ' × ' + n + ' = ?'), a: k * n }; },
    'm.div': function (r) { var k = r.int(2, 9), n = r.int(2, 9); return { h: eq(k * n + ' ÷ ' + k + ' = ?'), a: n }; },
    'm.fname': function (r) { var d = r.pick([2, 3, 4, 5, 8]), n = r.int(1, d - 1); return { h: esc(T('Half, or a part: shade')) + ' ' + A.num(n) + '/' + A.num(d) + ' <span style="display:inline-flex;border:1pt solid #1b1610;margin-inline-start:8px">' + new Array(d + 1).join('<i style="display:block;width:20px;height:18px;border-inline-end:1pt solid #1b1610"></i>') + '</span>', a: A.num(n) + '/' + A.num(d) }; }
  };
  /* a question from any lesson's own review, where it can live on paper */
  function fromStep(s, rng) {
    if (!s || s.listen) return null;
    if (s.k === 'pad' && s.eq) return { h: (s.html && typeof s.html === 'string' ? s.html : '') + eq(s.eq), a: A.num(s.a) };
    if (s.k === 'choice' || s.k === 'sit') {
      if (!s.o || s.o.some(function (o) { return o.t == null; })) return null;
      var ok = s.o.filter(function (o) { return o.ok; })[0]; if (!ok) return null;
      var q = (s.p ? '<b>' + esc(L(s.p)) + '</b>' : '') + (s.q ? ' <span class="' + (s.qAr ? 'ar' : '') + '">' + esc(L(s.q)) + '</span>' : '');
      return { h: q + '<div class="pq-o">' + rng.shuffle(s.o).map(function (o) { return '<span class="' + (o.ar ? 'ar' : '') + '">' + esc(L(o.t)) + '</span>'; }).join('') + '</div>', a: L(ok.t) };
    }
    return null;
  }
  /* the skills worth practising in a room: what is fading, then what is newest */
  function practiceSkills(room, pid) {
    var d = A.D(pid), due = M.due(pid).map(function (x) { return x.s; }).filter(function (s) { return !room || C.skill(s).room === room; });
    var recent = Object.keys(d.keys).filter(function (s) { return d.keys[s].forged && C.skill(s) && (!room || C.skill(s).room === room); }).sort(function (a, b) { return (d.keys[b].lastOk || 0) - (d.keys[a].lastOk || 0); });
    var out = []; due.concat(recent).forEach(function (s) { if (out.indexOf(s) < 0) out.push(s); });
    return out.slice(0, 6);
  }
  function practice(ctx, room, title, n) {
    var skills = practiceSkills(room, ctx.pid), r = ctx.rng, qs = [], guard = 0;
    if (!skills.length && room) { var nx = C.next(room, ctx.pid); if (nx) skills = [nx.id]; }
    if (!skills.length) return null;
    while (qs.length < n && guard++ < n * 8) {
      var id = skills[guard % skills.length], sk = C.skill(id), q = null;
      if (MATH[id]) q = MATH[id](r);
      else if (sk.review) { try { var st = sk.review(r); q = fromStep(Array.isArray(st) ? st[0] : st, r); } catch (e) { q = null; } }
      if (q && !qs.some(function (x) { return x.h === q.h; })) { q.s = id; qs.push(q); }
    }
    if (!qs.length) return null;
    var work = function (q) { var m = (C.skill(q.s) || {}).room === 'math'; return m ? 'sq' : /class="blank"/.test(q.h) ? 'ln' : ''; };
    var rows = qs.map(function (q, i) { var w = work(q); return '<div class="pq' + (w ? '' : ' nw') + '"><i>' + A.num(i + 1) + '</i><div class="pq-b">' + q.h + '</div><b class="pq-k"></b>' + (w ? '<div class="pq-w ' + w + '"></div>' : '') + '</div>'; }).join('');
    /* the questions share the page between them; a short sheet keeps sensible rows and gives the rest to a box to draw or write in */
    var nq = qs.length, two = nq > 8 || (nq > 6 && qs.some(work)), per = two ? Math.ceil(nq / 2) : nq, fill = per < 6 ? 6 - per : 0;
    var body = '<div class="pp-qs' + (two ? ' two' : '') + '" style="flex:' + per + ' 1 0;min-height:0;grid-template-rows:repeat(' + per + ',1fr)">' + rows + '</div>' +
      (fill ? '<div class="box fill" style="flex:' + fill + ' 1 0;margin-top:3mm"><b>' + esc(L(['Draw or write something you remember', 'ارسم أو اكتب شيئًا تتذكره'])) + '</b></div>' : '');
    return { html: page(ctx, title, T('No rush, and no help yet. A grown-up marks it afterwards.') + ' ' + L(['The small box is for the tick.', 'المربع الصغير لعلامة التصحيح.']), body, { score: nq }), q: qs.map(function (x) { return { s: x.s, a: String(x.a), h: x.h }; }) };
  }

  /* ---------- the catalogue ---------- */
  var GROUPS = [['practice', 'Practice at their level'], ['write', 'Writing'], ['play', 'Games to move and play'], ['tools', 'Tools for the table'], ['deen', 'Deen and the Qurʾān'], ['science', 'Noticing the world'], ['reward', 'Celebrate and plan']];
  Print.GROUPS = GROUPS;
  var K = Print.KINDS = {};
  function kind(id, group, title, desc, make, o) { K[id] = Object.assign({ id: id, group: group, title: title, desc: desc, make: make, stage: 1 }, o || {}); }

  /* use: 'mark' sheets are marked question by question and count as evidence; 'do' sheets are ticked when done; the rest are kept things (cards, mats, posters) */
  kind('practice-math', 'practice', ['Maths practice', 'تدريب الرياضيات'], ['Questions from the maths they know right now', 'أسئلة مما يعرفه الآن في الرياضيات'], function (c) { return practice(c, 'math', L(['Maths practice', 'تدريب الرياضيات']), 12); }, { use: 'mark' });
  kind('practice-mixed', 'practice', ['Polish my keys', 'لمّع مفاتيحي'], ['Mixed questions on what is starting to fade', 'أسئلة متنوعة فيما بدأ يضعف'], function (c) { return practice(c, null, L(['Polish my keys', 'لمّع مفاتيحي']), 10); }, { use: 'mark' });
  kind('practice-arabic', 'practice', ['Arabic practice', 'تدريب العربية'], ['From the Arabic lessons they have passed', 'من دروس العربية التي اجتازها'], function (c) { return practice(c, 'arabic', L(['Arabic practice', 'تدريب العربية']), 8); }, { use: 'mark' });
  kind('practice-english', 'practice', ['English practice', 'تدريب الإنجليزية'], ['From the English lessons they have passed', 'من دروس الإنجليزية التي اجتازها'], function (c) { return practice(c, 'english', L(['English practice', 'تدريب الإنجليزية']), 8); }, { use: 'mark' });
  kind('practice-deen', 'practice', ['Living Islam questions', 'أسئلة ديني'], ['What they have learned, to talk through together', 'ما تعلمه، لتتحدثا عنه معًا'], function (c) { return practice(c, 'deen', L(['Living Islam questions', 'أسئلة ديني']), 8); }, { use: 'mark' });

  kind('trace-ar', 'write', ['Write the Arabic letters', 'اكتب الحروف العربية'], ['Their letters, with the real strokes and direction', 'حروفه بضرباتها واتجاهها الصحيحين'], function (c) { var h = traceSheet(c, 'ar', lettersFor(c.pid, 12), L(['My Arabic letters', 'حروفي العربية'])); return h ? { html: h } : null; }, { use: 'do' });
  kind('trace-en', 'write', ['Write the English letters', 'اكتب الحروف الإنجليزية'], ['The sounds they know, as letters to form', 'الأصوات التي يعرفها حروفًا يكتبها'], function (c) { var h = traceSheet(c, 'en', soundsFor(c.pid, 12).filter(function (g) { return g.length === 1; }), L(['My English letters', 'حروفي الإنجليزية'])); return h ? { html: h } : null; }, { use: 'do' });

  /* cards: always whole pages of even cards, so the cut lines meet */
  function cardsPage(c, title, note, cells, cols, rowsN) {
    rowsN = rowsN || 4; var per = cols * rowsN, all = padCells(cells, per), pages = [];
    for (var i = 0; i < all.length; i += per) pages.push(page(c, title, i ? '' : note, '<div class="grid fill" style="grid-template-columns:repeat(' + cols + ',1fr);grid-template-rows:repeat(' + rowsN + ',1fr)">' + all.slice(i, i + per).join('') + '</div>'));
    return pages.join('');
  }
  kind('cards-ar', 'play', ['Arabic letter cards', 'بطاقات الحروف'], ['Cut out and keep: letter on the card, name beneath', 'قصها واحتفظ بها: الحرف وتحته اسمه'], function (c) { return { html: cardsPage(c, L(['My letter cards', 'بطاقات حروفي']), T('Cut along the dashes.'), lettersFor(c.pid).map(function (ch) { return '<div class="cell"><span class="ar big" lang="ar">' + ch + '</span><small class="ar">' + esc(BY(ch).name) + '</small></div>'; }), 3) }; }, { screen: 1 });
  kind('cards-en', 'play', ['Sound cards', 'بطاقات الأصوات'], ['Each sound with a picture of its word', 'كل صوت مع صورة كلمته'], function (c) { var kw = C.KEYW || {}; return { html: cardsPage(c, L(['My sound cards', 'بطاقات أصواتي']), T('Cut along the dashes.'), soundsFor(c.pid).map(function (g) { var w = kw[g] || [g, 'star']; return '<div class="cell"><span class="big" dir="ltr">' + esc(g) + '</span>' + picOf(w[1], 56) + '<small dir="ltr">' + esc(w[0]) + '</small></div>'; }), 3) }; }, { screen: 1 });
  kind('cards-times', 'play', ['Times table cards', 'بطاقات الضرب'], ['The facts they are working on, answer on the back', 'الحقائق التي يعمل عليها، والجواب في الخلف'], function (c) { var t = M.met('m.t6', c.pid) ? [6, 7, 8, 9] : M.met('m.t3', c.pid) ? [3, 4] : [2, 5, 10], cells = []; t.forEach(function (k) { for (var n = 2; n <= 10; n++) cells.push('<div class="cell"><span class="big" dir="ltr" style="font-size:34pt">' + A.num(k) + ' × ' + A.num(n) + '</span><small dir="ltr">= ' + A.num(k * n) + '</small></div>'); }); return { html: cardsPage(c, L(['Times cards', 'بطاقات الضرب']), T('Cut along the dashes, then fold the answer behind.'), cells, 3) }; }, { stage: 2 });
  kind('bingo', 'play', ['Bingo', 'لعبة البينغو'], ['Boards from what they know, plus a caller’s list', 'لوحات مما يعرفه وقائمة للمنادي'], function (c) {
    var ar = lettersFor(c.pid), en = soundsFor(c.pid), pool = c.opts.pool === 'en' && en.length >= 9 ? en : ar.length >= 9 ? ar : en.length >= 9 ? en : null, nums = !pool;
    if (nums) { pool = []; for (var i = 1; i <= 20; i++) pool.push(A.num(i)); }
    var isAr = pool === ar, cell = function (x) { return '<div class="cell"><span class="' + (isAr ? 'ar big' : 'big') + '" style="font-size:' + (isAr ? 48 : 36) + 'pt">' + esc(x) + '</span></div>'; };
    var board = function () { return '<div class="grid solid fill" style="grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);margin-bottom:4mm">' + c.rng.shuffle(pool).slice(0, 9).map(cell).join('') + '</div>'; };
    return { html: page(c, L(['Bingo', 'لعبة البينغو']), T('One person calls and points. Cover each one you have with a stone. Three in a line wins.'), board() + board() + '<div class="pp-t">' + esc(T('The caller’s list')) + '</div><div class="' + (isAr ? 'ar' : '') + '" style="flex:none;letter-spacing:' + (isAr ? '0' : '.2em') + ';word-spacing:.6em">' + esc(pool.join('  ')) + '</div>') };
  });
  kind('floor', 'play', ['Floor letters', 'حروف الأرض'], ['Huge letters for the floor: run, jump and stand on them', 'حروف كبيرة للأرض: اركض واقفز وقف عليها'], function (c) {
    var src = c.opts.pool === 'en' ? soundsFor(c.pid, 8) : lettersFor(c.pid, 8), isAr = c.opts.pool !== 'en';
    return { html: src.map(function (ch, i) { return page(c, '', i ? '' : T('Print and lay these out on the floor. Someone calls a sound: run and stand on it. Then hop from letter to letter to spell a word.'), '<div class="huge fill ' + (isAr ? 'ar' : '') + '">' + esc(ch) + '</div>', { bare: 1 }); }).join('') };
  }, { stage: 0 });
  kind('memory', 'play', ['Memory pairs', 'أزواج الذاكرة'], ['Cut out, turn face down, find the pairs', 'قصها واقلبها وابحث عن الأزواج'], function (c) {
    /* eight pairs: exactly one page of sixteen cards */
    var ar = lettersFor(c.pid, 8), cells = []; ar.forEach(function (ch) { cells.push('<div class="cell"><span class="ar big" lang="ar">' + ch + '</span></div>'); cells.push('<div class="cell"><span class="ar" style="font-size:26pt">' + esc(BY(ch).name) + '</span></div>'); });
    return { html: cardsPage(c, L(['Memory pairs', 'أزواج الذاكرة']), T('Turn them all face down. Take turns finding each letter and its name.'), c.rng.shuffle(cells), 4) };
  });
  kind('hunt', 'play', ['Treasure hunt', 'البحث عن الكنز'], ['Go and find real things around the house', 'اذهب وجد أشياء حقيقية في البيت'], function (c) {
    var en = soundsFor(c.pid, 6);
    var shapes = [['circle', 'Something round', 'شيء مستدير'], ['square', 'Something square', 'شيء مربع'], ['triangle', 'Something with three sides', 'شيء له ثلاثة أضلاع'], ['leaf', 'Something Allah made', 'شيء خلقه الله'], ['drop', 'Something that holds water', 'شيء يحمل الماء'], ['stone', 'Something heavy', 'شيء ثقيل']];
    /* each find has room to draw it; the sounds, when they know some, share the rest of the page */
    var sh = '<div class="grid" style="flex:3 1 0;min-height:0;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(3,1fr);gap:3mm">' + shapes.map(function (s) { return '<div class="box" style="margin:0"><b style="display:flex;gap:3mm;align-items:center">' + A.art(s[0], 40) + '<span>' + esc(L([s[1], s[2]])) + '</span></b></div>'; }).join('') + '</div>';
    var so = en.length ? '<div class="pp-t">' + esc(T('Things that start with these sounds')) + '</div><div class="grid" style="flex:2 1 0;min-height:0;grid-template-columns:repeat(' + Math.min(3, en.length) + ',1fr);grid-auto-rows:1fr;gap:3mm">' + en.map(function (g) { return '<div class="box fill" style="margin:0"><b dir="ltr" style="font-size:22pt">' + esc(g) + '</b><div class="lines"></div></div>'; }).join('') + '</div>' : '';
    return { html: page(c, L(['Treasure hunt', 'البحث عن الكنز']), T('Find each one, bring it back or draw it, and show someone.'), sh + so) };
  }, { stage: 0, use: 'do' });

  kind('mat-frame', 'tools', ['Ten-frame mat', 'لوحة إطار العشرة'], ['Use with stones or dates', 'استعملها بالحجارة أو التمر'], function (c) { var f = '<div class="frame">' + new Array(11).join('<span></span>') + '</div>'; return { html: page(c, L(['Ten-frame mat', 'لوحة إطار العشرة']), T('Put one thing in each square. Fill the top row first.'), '<div class="mid fill">' + f + f + '</div>') }; }, { stage: 0 });
  kind('mat-hund', 'tools', ['Hundred square', 'مربع المئة'], ['For counting, skip counting and patterns', 'للعدّ والعدّ بالقفز والأنماط'], function (c) { var h = ''; for (var i = 1; i <= 100; i++) h += '<span>' + A.num(i) + '</span>'; return { html: page(c, L(['Hundred square', 'مربع المئة']), T('Colour every second number. Then every fifth. What pattern appears?'), '<div class="mid c fill"><div class="hund" dir="ltr">' + h + '</div></div>') }; });
  kind('mat-line', 'tools', ['Number lines', 'خطوط الأعداد'], ['Walk along them with a finger, or a stone', 'امشِ عليها بإصبع أو حجر'], function (c) {
    /* the last two have ticks but no numbers: they write their own, from any start */
    var line = function (lo, hi, empty) { var h = '<div class="lin" dir="ltr"><hr>'; for (var i = lo; i <= hi; i++) h += '<span style="left:' + ((i - lo) / (hi - lo) * 100) + '%">' + (empty ? '&nbsp;' : A.num(i)) + '</span>'; return h + '</div>'; };
    return { html: page(c, L(['Number lines', 'خطوط الأعداد']), L(['The last two are empty: choose a start and write the numbers in.', 'الخطان الأخيران فارغان: اختر بداية واكتب الأعداد.']), '<div class="mid fill">' + line(0, 10) + line(0, 10) + line(0, 20) + line(0, 20) + line(10, 20) + line(10, 20) + line(0, 10, 1) + line(0, 10, 1) + '</div>') };
  });
  kind('mat-pv', 'tools', ['Place value mat', 'لوحة المنازل'], ['Hundreds, tens and ones', 'مئات وعشرات وآحاد'], function (c) { return { html: page(c, L(['Place value mat', 'لوحة المنازل']), T('Build numbers with bundles of ten and single sticks.'), '<div class="pv fill" dir="ltr"><div>' + esc(T('Hundreds')) + '</div><div>' + esc(T('Tens')) + '</div><div>' + esc(T('Ones')) + '</div></div>') }; });
  kind('mat-clock', 'tools', ['Clock to make', 'ساعة تصنعها'], ['Cut out the hands and fix them with a pin', 'قص العقربين وثبتهما بدبوس'], function (c) {
    var nums = ''; for (var i = 1; i <= 12; i++) { var a = (i * 30 - 90) * Math.PI / 180; nums += '<text x="' + (100 + Math.cos(a) * 76).toFixed(1) + '" y="' + (106 + Math.sin(a) * 76).toFixed(1) + '" font-size="16" font-weight="700" text-anchor="middle">' + A.num(i) + '</text>'; }
    var ticks = ''; for (var t = 0; t < 60; t++) { var ta = t * 6 * Math.PI / 180, b = t % 5 === 0; ticks += '<line x1="' + (100 + Math.sin(ta) * (b ? 87 : 90)).toFixed(1) + '" y1="' + (100 - Math.cos(ta) * (b ? 87 : 90)).toFixed(1) + '" x2="' + (100 + Math.sin(ta) * 94).toFixed(1) + '" y2="' + (100 - Math.cos(ta) * 94).toFixed(1) + '" stroke="#1b1610" stroke-width="' + (b ? 1.6 : .5) + '"/>'; }
    return { html: page(c, L(['Clock to make', 'ساعة تصنعها']), T('Stick on card, cut out, and join the hands at the centre.'), '<div class="mid fill"><svg viewBox="0 0 200 200" style="width:160mm;display:block;margin:0 auto" dir="ltr"><circle cx="100" cy="100" r="97" fill="none" stroke="#1b1610" stroke-width="2"/>' + ticks + nums + '<circle cx="100" cy="100" r="2" fill="#1b1610"/></svg><svg viewBox="0 0 200 40" style="width:160mm;display:block;margin:0 auto"><path d="M10 12h60l10 8-10 8H10z" fill="none" stroke="#1b1610" stroke-dasharray="3 2"/><path d="M100 12h85l10 8-10 8h-85z" fill="none" stroke="#1b1610" stroke-dasharray="3 2"/></svg></div>') };
  });

  kind('dua-cards', 'deen', ['Duʿāʾ cards', 'بطاقات الأدعية'], ['For the door, the table and the bedside', 'للباب والمائدة وعند السرير'], function (c) {
    var D = window.DUA, cells = Object.keys(D).map(function (k) { var x = D[k]; return '<div class="cell dua" style="justify-content:flex-start"><small style="font-weight:700;color:#8a6420">' + esc(L(x.when)) + '</small><span class="ar" lang="ar">' + esc(x.ar) + '</span>' + (A.ar() ? '' : '<small dir="ltr">' + esc(x.tr) + '</small><small dir="ltr">' + esc(T('Translation')) + ': ' + esc(x.en) + '</small>') + '<em>' + esc(x.ref) + '</em></div>'; });
    /* three rows on every page, so each card is the same size even on the last page; a long duʿāʾ takes a whole row, so no word is ever cut */
    var keys = Object.keys(D), wide = keys.map(function (k) { var x = D[k]; return x.ar.length > 170 || x.ar.length * 2.2 + (A.ar() ? 0 : x.tr.length + x.en.length) > 560; }), pages = [], cur = [], slots = 0;
    var flush = function () { if (cur.length) pages.push(page(c, L(['Duʿāʾ cards', 'بطاقات الأدعية']), pages.length ? '' : T('Cut out and put each one where it is said.'), '<div class="grid fill" style="grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(3,1fr);grid-auto-flow:dense">' + cur.join('') + '</div>')); cur = []; slots = 0; };
    cells.forEach(function (h, i) { var w = wide[i] ? 2 : 1; if (slots + w > 6) flush(); cur.push(w === 2 ? h.replace('class="cell dua" style="', 'class="cell dua" style="grid-column:1 / -1;') : h); slots += w; });
    flush();
    return { html: pages.join('') };
  }, { stage: 0 });
  kind('chart-prayer', 'deen', ['Prayer chart', 'جدول الصلاة'], ['A week of the five prayers, to tick together', 'أسبوع من الصلوات الخمس لتعلّماها معًا'], function (c) {
    var P = [['Fajr', 'الفجر'], ['Ẓuhr', 'الظهر'], ['ʿAṣr', 'العصر'], ['Maghrib', 'المغرب'], ['ʿIshāʾ', 'العشاء']], days = [], now = A.now();
    for (var i = 0; i < 7; i++) days.push(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i).toLocaleDateString(A.ar() ? 'ar' : 'en', { weekday: 'short' }));
    return { html: page(c, L(['My prayers this week', 'صلواتي هذا الأسبوع']), T('Tick each one prayed. This is for the two of you, not for marks.'), '<div class="tbl fill"><table class="chart" style="font-size:13pt"><tr><th></th>' + days.map(function (d) { return '<th>' + esc(d) + '</th>'; }).join('') + '</tr>' + P.map(function (x) { return '<tr><td class="l">' + esc(L(x)) + '</td>' + new Array(8).join('<td></td>') + '</tr>'; }).join('') + '</table></div>') };
  }, { use: 'do' });
  kind('chart-hifz', 'deen', ['My Qurʾān shelf', 'رف قرآني'], ['Each sūrah, how much is kept, and who heard it', 'كل سورة وكم حُفظ منها ومن سمعها'], function (c) {
    var Q = window.QURAN, rows = Q.order.filter(function (s) { return s === 1 || s >= 78 || Hifz.known(s, c.pid).n > 0; }).map(function (s) { var k = Hifz.known(s, c.pid); return '<tr><td class="l">' + esc(A.surahName(s)) + '</td><td>' + A.num(k.n) + ' / ' + A.num(k.of) + '</td><td style="width:45mm"></td><td style="width:30mm"></td></tr>'; });
    /* split evenly across pages, the heading row on each, rows the same height throughout */
    var np = Math.ceil(rows.length / 24), per = Math.ceil(rows.length / np), pages = [], hd = '<tr><th>' + esc(T('Sūrah')) + '</th><th>' + esc(T('Kept')) + '</th><th>' + esc(T('Heard by')) + '</th><th>' + esc(T('Date')) + '</th></tr>';
    for (var i = 0; i < rows.length; i += per) { var part = rows.slice(i, i + per); pages.push(page(c, L(['My Qurʾān shelf', 'رف قرآني']), i ? '' : T('Write the date a grown-up heard the whole sūrah.'), '<div class="tbl fill"><table class="chart" style="font-size:10.5pt;flex:0 0 ' + Math.round((part.length + 1) / (per + 1) * 100) + '%">' + hd + part.join('') + '</table></div>')); }
    return { html: pages.join('') };
  }, { use: 'do' });

  kind('journal-moon', 'science', ['Moon journal', 'دفتر القمر'], ['Draw the real moon, every night of a Hijri month', 'ارسم القمر الحقيقي كل ليلة من شهر هجري'], function (c) { var h = ''; for (var i = 1; i <= 30; i++) h += '<div><i></i>' + A.num(i) + '</div>'; return { html: page(c, L(['Moon journal', 'دفتر القمر']), T('Go out each night and draw what you really see. Cloudy? Write that.'), '<div class="moons fill">' + h + '</div>') }; }, { stage: 1, use: 'do' });
  kind('journal-nature', 'science', ['Nature notebook', 'دفتر الطبيعة'], ['One real thing: look, draw, wonder', 'شيء حقيقي واحد: انظر وارسم وتساءل'], function (c) { var bx = function (t, f, lines) { return '<div class="box fill" style="flex:' + f + ' 1 0"><b>' + esc(T(t)) + '</b>' + (lines ? '<div class="lines"></div>' : '') + '</div>'; }; return { html: page(c, L(['Nature notebook', 'دفتر الطبيعة']), '', bx('What I found, and where', 1, 1) + bx('I drew it', 4) + bx('I noticed', 1.5, 1) + bx('I wonder', 1.5, 1)) }; }, { stage: 0, use: 'do' });
  kind('journal-test', 'science', ['Fair test planner', 'مخطط التجربة العادلة'], ['Plan a real experiment, change one thing', 'خطط لتجربة حقيقية وغيّر شيئًا واحدًا'], function (c) { var row = function (t) { return '<div class="box fill"><b>' + esc(T(t)) + '</b><div class="lines"></div></div>'; }; return { html: page(c, L(['Fair test planner', 'مخطط التجربة العادلة']), '', row('My question') + row('What I will change (only one thing)') + row('What I will keep the same') + row('What I think will happen, and why') + row('What really happened') + row('What I learned')) }; }, { stage: 2, use: 'do' });

  kind('certificate', 'reward', ['Certificate', 'شهادة'], ['For the newest lantern they have lit', 'لآخر فانوس أضاءه'], function (c) {
    var lit = Flow.lanterns(c.pid).filter(function (x) { return x.lit; }), d = A.D(c.pid).units || {}; lit.sort(function (a, b) { return d[b.id].t - d[a.id].t; });
    var u = lit[0]; if (!u) return null;
    return { html: page(c, '', '', '<div class="cert fill">' + A.art('key', 160) + '<p>' + esc(T('With thanks to Allah, this key is earned by')) + '</p><h1>' + esc(c.p.name) + '</h1><p>' + esc(L(C.rooms[u.room].name)) + '</p><h2>' + esc(L(u.title)) + '</h2><p>' + esc(new Date(d[u.id].t).toLocaleDateString(A.ar() ? 'ar' : 'en', { year: 'numeric', month: 'long', day: 'numeric' })) + (Voice.hijri() ? ' · ' + esc(Voice.hijri()) : '') + '</p></div>', { bare: 1, nofoot: 1 }) };
  }, { need: function (pid) { return Flow.lanterns(pid).some(function (x) { return x.lit; }); } });
  kind('poster', 'reward', ['My keys poster', 'ملصق مفاتيحي'], ['Everything they have earned so far, and what comes next, to go on the wall', 'كل ما حققه حتى الآن وما يليه، ليعلق على الحائط'], function (c) {
    /* every cell is 13 mm and every room heading 11 mm, so the pages are packed by arithmetic, never by luck; a long room carries on over the page */
    var st = A.stage(c.p), rooms = [];
    C.order.forEach(function (rid) { var r = C.rooms[rid], sks = []; r.units.forEach(function (u) { if (u.band <= st) u.skills.forEach(function (s) { if (s.band <= st) sks.push(s); }); }); var got = sks.filter(function (s) { return M.met(s.id, c.pid); }), next = sks.filter(function (s) { return !M.met(s.id, c.pid); }).slice(0, 6); if (got.length || next.length) rooms.push({ name: L(r.name), sks: got.concat(next) }); });
    var pages = [[]], used = 0, ROW = 14.5, HEAD = 11;
    rooms.forEach(function (r) {
      var rest = r.sks.slice();
      while (rest.length) {
        var bud = pages.length === 1 ? 226 : 234, fit = Math.floor((bud - used - HEAD) / ROW);
        if (fit < 1) { pages.push([]); used = 0; continue; }
        var take = rest.splice(0, fit * 6); pages[pages.length - 1].push({ name: r.name, sks: take }); used += HEAD + Math.ceil(take.length / 6) * ROW;
      }
    });
    return { html: pages.map(function (pg, i) { return page(c, L(['My keys', 'مفاتيحي']), i ? '' : T('The gold ones are earned. Colour them in as you go.') + ' ' + L(['The white ones come next.', 'البيضاء هي التالية.']), pg.map(function (r) { return '<div class="pp-t">' + esc(r.name) + '</div><div class="keysg">' + r.sks.map(function (s) { return '<div class="' + (M.met(s.id, c.pid) ? 'on' : '') + '">' + esc(L(s.title)) + '</div>'; }).join('') + '</div>'; }).join('')); }).join('') };
  });
  kind('week', 'reward', ['This week’s plan', 'خطة الأسبوع'], ['What to expect, and what to have ready', 'ما تتوقعه وما تجهزه'], function (c) {
    var rows = Flow.preview(c.pid, 7).map(function (d) { return '<tr><td class="l" style="width:32mm">' + esc(d.date.toLocaleDateString(A.ar() ? 'ar' : 'en', { weekday: 'long' })) + '</td><td class="l">' + esc(d.kind === 'rest' ? T('Rest') : d.kind === 'light' ? T('Remember and make') : d.lessons.map(function (s) { return L(s.title); }).join(' · ')) + '</td><td style="width:16mm"></td></tr>'; }).join('');
    var need = {}; Flow.preview(c.pid, 7).forEach(function (d) { d.lessons.forEach(function (sk) { Object.keys(C.missions).forEach(function (id) { var m = C.missions[id]; if (m.hands && m.skill === sk.id) need[L(m.materials)] = 1; }); }); });
    var list = Object.keys(need);
    return { html: page(c, L(['This week', 'هذا الأسبوع']), T('A forecast: it adapts to how each day goes.'), '<div class="tbl" style="flex:3 1 0;min-height:0"><table class="chart"><tr><th>' + esc(T('Day')) + '</th><th>' + esc(T('New doors')) + '</th><th>' + A.icon('check', 14) + '</th></tr>' + rows + '</table></div>' + (list.length ? '<div class="pp-t">' + esc(T('To have ready')) + '</div><div class="pp-n">' + esc(list.join(' · ')) + '</div>' : '') + '<div class="box fill" style="flex:1 1 0;margin-top:3mm"><b>' + esc(L(['Notes for the week', 'ملاحظات الأسبوع'])) + '</b><div class="lines"></div></div>') };
  }, { stage: 1 });

  /* ---------- make, keep, mark ---------- */
  Print.available = function (pid) { var st = A.stage(A.profile(pid)); return Object.keys(K).map(function (k) { return K[k]; }).filter(function (x) { return x.stage <= st && (!x.need || x.need(pid)); }); };
  Print.make = function (id, pid, seed, opts) {
    var k = K[id], p = A.profile(pid), sd = seed || A.seed(), code = 'M' + (sd % 46656).toString(36).toUpperCase(), g = GROUPS.filter(function (x) { return x[0] === k.group; })[0];
    var res = k.make({ pid: pid, p: p, rng: A.rng(sd), seed: sd, code: code, kind: id, kick: g ? T(g[1]) : '', opts: opts || {} });
    if (!res || !res.html) return null;
    /* page numbers, once the number of pages is known */
    var n = res.html.split(PG).length - 1, i = 0;
    res.html = res.html.split(PG).reduce(function (a, b) { return a + (n > 1 ? A.num(++i) + ' / ' + A.num(n) : '') + b; });
    res.pages = Math.max(1, n); res.seed = sd; res.code = code; res.kind = id; res.title = L(k.title); res.use = k.use || 'keep'; return res;
  };
  /* every printed sheet is kept in a log: practice waits to be marked (then it is evidence), worksheets wait to be ticked done,
     and the rest are simply remembered, so a grown-up can see what went on paper and print the same version again */
  Print.keep = function (res, pid) {
    var d = A.D(pid); d.sheets = d.sheets || [];
    var old = d.sheets.filter(function (x) { return x.id === res.code; })[0];
    if (old) { old.n = (old.n || 1) + 1; old.t = A.now().getTime(); A.saveNow(); return; }
    var sh = { id: res.code, kind: res.kind, title: res.title, t: A.now().getTime(), seed: res.seed, use: res.use, pages: res.pages, n: 1 };
    if (res.q) sh.q = res.q;
    if (res.opts) sh.opts = res.opts;
    d.sheets.push(sh);
    /* keep the last 120, but never drop one still waiting for a grown-up */
    while (d.sheets.length > 120) { var j = d.sheets.findIndex(function (x) { return !Print.waiting(x); }); d.sheets.splice(j < 0 ? 0 : j, 1); }
    A.saveNow();
  };
  /* a kept sheet's name in today's language (the stored title is only a fallback for a kind that no longer exists) */
  Print.titleOf = function (x) { return K[x.kind] ? L(K[x.kind].title) : x.title; };
  Print.waiting = function (x) { var u = x.use || (x.q ? 'mark' : 'keep'); return u === 'mark' ? !x.marked : u === 'do' ? !x.done && !x.skip : false; };
  Print.status = function (x) {
    var u = x.use || (x.q ? 'mark' : 'keep');
    if (u === 'mark') return x.marked ? L(['Marked', 'صُحّحت']) + ' ' + A.num(x.right) + ' / ' + A.num(x.q.length) : L(['To mark', 'للتصحيح']);
    if (u === 'do') return x.done ? L(['Done', 'أُنجزت']) : x.skip ? L(['Not used', 'لم تُستعمل']) : L(['To do', 'للإنجاز']);
    return L(['Printed', 'طُبعت']);
  };
  Print.done = function (code, ok, pid) {
    var d = A.D(pid), sh = (d.sheets || []).filter(function (x) { return x.id === code; })[0]; if (!sh) return;
    if (ok) { sh.done = A.now().getTime(); delete sh.skip; } else { sh.skip = A.now().getTime(); delete sh.done; }
    A.saveNow();
  };
  Print.mark = function (code, right, pid) {
    var d = A.D(pid), sh = (d.sheets || []).filter(function (x) { return x.id === code; })[0]; if (!sh || sh.marked) return;
    sh.q.forEach(function (q, i) { M.log(q.s, { k: 'production', ok: !!right[i], by: 'parent', e: right[i] ? null : 'understanding' }, pid); });
    sh.marked = A.now().getTime(); sh.right = right.filter(Boolean).length; A.saveNow();
  };
  /* what is worth printing today */
  Print.suggest = function (pid) {
    var out = [], st = A.stage(A.profile(pid));
    if (st === 0) return ['floor', 'hunt', 'mat-frame'];
    if (M.due(pid).length >= 3) out.push('practice-mixed');
    var pr = Flow.prep(pid), rooms = {}; pr.lessons.forEach(function (s) { rooms[s.room] = 1; });
    if (rooms.arabic) out.push('trace-ar'); if (rooms.math) out.push('practice-math'); if (rooms.english) out.push('cards-en');
    if (Flow.lanterns(pid).some(function (x) { return x.lit; })) out.push('certificate');
    out.push('week');
    return out.filter(function (x, i) { return out.indexOf(x) === i && K[x] && K[x].stage <= st; }).slice(0, 3);
  };
})();
