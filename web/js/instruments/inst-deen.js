/* Living Islam instruments. Sacred text is shown with its reference and never animated, gamified or scrambled.
   A situation asks "what would you do?" before the Sunnah answers. The seerah is told with places, light and a map: no one is drawn. */
(function () {
  'use strict';
  var A = window.A, $ = A.$, $$ = A.$$, esc = A.esc, L = A.L, T = A.T, I = window.I;

  function evidenceHtml(h) {
    if (!h) return '';
    return '<div class="ev"><div class="ev-ar" lang="ar" dir="rtl">' + h.ar + '</div>' + (A.ar() ? '' : '<div class="tx-l">' + esc(T('Translation')) + '</div><div class="ev-en" dir="ltr">' + esc(h.en) + '</div>') + '<div class="ref" dir="' + (A.ar() ? 'rtl' : 'ltr') + '">' + esc(A.ar() ? h.refa || h.ref : h.ref) + (h.g ? ' · ' + esc(h.g) : '') + '</div></div>';
  }
  I.evidenceHtml = evidenceHtml;

  /* a verse from the bundled Qurʾān: text and translation are looked up, never typed */
  I.ayahHtml = function (s, from, to) {
    var q = window.QURAN.q[s], h = '<div class="ev"><div class="ev-ar" lang="ar" dir="rtl" style="font-family:var(--f-q)">';
    var vs = q.v.filter(function (v) { return v[0] >= from && v[0] <= to; });
    h += vs.map(function (v) { return v[1] + ' <span>﴿' + A.num(v[0]).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; }) + '﴾</span>'; }).join(' ') + '</div>';
    if (!A.ar()) h += '<div class="tx-l">' + esc(T('Translation')) + '</div><div class="ev-en" dir="ltr">' + esc(vs.map(function (v) { return v[2]; }).join(' ')) + '</div>';
    h += '<div class="ref">' + esc(A.surahName ? A.surahName(s) : q.name) + ' ' + A.num(s) + ':' + A.num(from === to ? from : from + '-' + to) + '</div></div>';
    return h;
  };

  /* what would you do? then what the Sunnah says */
  I.sit = function (c) {
    var s = c.step, opts = c.rng.shuffle(s.o);
    c.el.innerHTML = '<div class="sit">' + (s.art ? '<div class="sc-art float">' + A.art(s.art, 110) + '</div>' : '') + '<div class="ch c1" id="sit-ch">' + opts.map(function (o, i) { return '<button class="opt" data-i="' + i + '" style="font-size:17px"><span>' + esc(L(o.t)) + '</span></button>'; }).join('') + '</div><div id="sit-ev"></div></div>';
    function reveal() {
      $$('.opt', c.el).forEach(function (b) { b.disabled = true; if (opts[+b.dataset.i].ok) b.classList.add('right'); });
      var ev = '<p class="sc-t" style="margin-bottom:8px">' + esc(L(s.why)) + '</p>' + (s.had ? evidenceHtml(window.HAD[s.had]) : '') + (s.ayah ? I.ayahHtml(s.ayah[0], s.ayah[1], s.ayah[2]) : '');
      var box = $('#sit-ev', c.el); box.innerHTML = ev;
      if (!A.reduced()) box.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 420 });
      setTimeout(function () { box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 60);
      Voice.say(L(s.why), { lang: A.ar() ? 'ar' : 'en' });
    }
    $$('.opt', c.el).forEach(function (b) {
      b.onclick = function () {
        var o = opts[+b.dataset.i];
        if (o.ok) { b.classList.add('right'); c.ok(b, { note: ' ' }); reveal(); }
        else { b.classList.add('wrong'); b.disabled = true; if (o.because) Voice.say(L(o.because), { lang: A.ar() ? 'ar' : 'en' }); c.bad(s.err || 'understanding', b); }
      };
    });
    c.onReveal(reveal);
  };

  /* a duʿāʾ or hadith to hold: real recording, three stages of letting go */
  I.text = function (c) {
    var s = c.step, d = s.dua ? window.DUA[s.dua] : s.say ? window.SAY[s.say] : window.HAD[s.had];
    if (!d) { c.done(); return; }
    var words = d.ar.split(' ');
    var main = '<div class="dua-ar" lang="ar" dir="rtl">' + words.map(function (w, i) { return '<span class="dw" data-i="' + i + '">' + w + '</span>'; }).join(' ') + '</div>';
    var hasAudio = s.dua && Voice.available();
    c.el.innerHTML = '<div class="tx">' + (d.when ? '<div class="hf-tier">' + esc(L(d.when)) + '</div>' : '') + (d.say ? '<div class="sc-big ar" lang="ar" dir="rtl" style="font-size:46px">' + d.say + '</div>' : '') + main +
      '<div class="rec-row">' + (hasAudio ? '<button class="round" id="tx-play" aria-label="' + esc(T('Listen')) + '">' + A.icon('play', 30) + '</button>' : '') + (s.memo ? '<button class="round off" id="tx-hide" aria-label="' + esc(T('Hide some words')) + '">' + A.icon('eye', 28) + '</button>' : '') + '</div>' +
      (d.tr && !A.ar() ? '<div class="tx-p"><div class="tx-l">' + esc(T('Transliteration')) + '</div><div class="tx-t" dir="ltr">' + esc(d.tr) + '</div></div>' : '') +
      (!A.ar() ? '<div class="tx-p"><div class="tx-l">' + esc(T('Translation')) + '</div><div class="tx-t" dir="ltr">' + esc(d.en) + '</div></div>' : '') +
      '<div class="ref">' + esc(A.ar() && d.refa ? d.refa : d.ref) + (d.g ? ' · ' + esc(d.g) : '') + '</div>' + (!hasAudio && s.dua ? '' : '') + '</div>';
    var pb = $('#tx-play', c.el);
    if (pb) { pb.onclick = function () { Voice.dua(d.id); }; if (s.auto !== false) setTimeout(function () { Voice.dua(d.id); }, 500); }
    var hb = $('#tx-hide', c.el), lvl = 0;
    if (hb) hb.onclick = function () {
      lvl = (lvl + 1) % 4;
      $$('.dw', c.el).forEach(function (w, i) {
        var hide = lvl === 3 ? i > 0 : lvl === 2 ? i % 2 === 0 && i > 0 : lvl === 1 ? i % 3 === 2 : false;
        w.style.filter = hide ? 'blur(9px)' : ''; w.style.opacity = hide ? '.3' : '';
        w.onclick = function () { w.style.filter = ''; w.style.opacity = ''; };
      });
      Fx.tap();
    };
    c.done();
  };

  /* the seerah map: places only */
  var PLACES = { makkah: [66, 76, ['Makkah', 'مكة']], madinah: [52, 34, ['Madinah', 'المدينة']], taif: [79, 82, ['Ṭāʾif', 'الطائف']], hira: [69, 70, ['Cave of Ḥirāʾ', 'غار حراء']], thawr: [62, 82, ['Cave of Thawr', 'غار ثور']], badr: [42, 48, ['Badr', 'بدر']], sham: [40, 4, ['Shām', 'الشام']] };
  I.mapHtml = function (m) {
    m = m || {};
    var pins = (m.pins || []).map(function (k) { var p = PLACES[k]; return '<g class="mp"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.800" fill="#f1d59e"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="none" stroke="#f1d59e" stroke-width=".5" opacity=".7"><animate attributeName="r" values="2;6;2" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0;.9" dur="3s" repeatCount="indefinite"/></circle><text x="' + (p[0] + 3) + '" y="' + (p[1] + 1.5) + '" fill="#f5f0e7" style="font:700 4px var(--f)">' + esc(L(p[2])) + '</text></g>'; }).join('');
    var route = '';
    if (m.from && m.to) { var a = PLACES[m.from], b = PLACES[m.to], mx = (a[0] + b[0]) / 2 - (m.bend || 8), my = (a[1] + b[1]) / 2; route = '<path id="mpr" d="M' + a[0] + ' ' + a[1] + ' Q' + mx + ' ' + my + ' ' + b[0] + ' ' + b[1] + '" fill="none" stroke="#f1d59e" stroke-width="1" stroke-dasharray="2.200 1.800" pathLength="100"/><circle r="1.700" fill="#fff4d6"><animateMotion dur="5s" repeatCount="indefinite" path="M' + a[0] + ' ' + a[1] + ' Q' + mx + ' ' + my + ' ' + b[0] + ' ' + b[1] + '"/></circle>'; }
    return '<div class="map" dir="ltr"><svg viewBox="0 0 100 100"><defs><linearGradient id="sand" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b08a5a"/><stop offset="1" stop-color="#7a5a35"/></linearGradient></defs><rect width="100" height="100" fill="#123d5c"/><path d="M28 0L34 16 38 30 44 46 52 62 60 78 66 92 72 100H100V0Z" fill="url(#sand)"/><path d="M60 26c5-2 10 0 12 4s-1 8-6 9-10-1-11-5 1-7 5-8zM76 50c4-1 8 1 9 4s-1 6-5 6-7-1-8-4 1-5 4-6z" fill="#000" opacity=".13"/>' + route + pins + '<text x="8" y="60" fill="#8fc6e8" style="font:600 3.6px var(--f)" transform="rotate(62 8 60)">' + esc(T('The Red Sea')) + '</text></svg></div>';
  };
  /* real places, in real photographs, always said to be how they look today */
  function figure(n) { var ph = (window.PHOTOS || {})[n] || {}; return '<figure class="place"><img src="' + A.imgUrl(n) + '" alt="' + esc(L(ph.cap)) + '" decoding="async"><figcaption>' + esc(L(ph.cap)) + '</figcaption></figure>'; }
  function sceneHtml(s) {
    var list = [].concat(s.scene || []).filter(function (n) { return A.hasImg(n); }); if (!list.length) return '';
    if (list.length > 1) return '<div class="places two">' + list.map(figure).join('') + '</div>';
    if (s.both && s.map) return '<div class="places two">' + figure(list[0]) + '<div class="place-map">' + I.mapHtml(s.map) + '</div></div>';
    return '<div class="places">' + figure(list[0]) + '</div>';
  }
  I.story = function (c) {
    var s = c.step;
    c.el.innerHTML = (s.tl != null ? '<div class="tl">' + s.tlAll.map(function (t, i) { return '<span class="tl-n' + (i <= s.tl ? ' on' : '') + '"><i></i>' + esc(L(t)) + '</span>'; }).join('') + '</div>' : '') + (sceneHtml(s) || (s.map ? I.mapHtml(s.map) : s.art ? '<div class="sc-art float">' + A.art(s.art, 130) + '</div>' : '')) +
      '<p class="story-t">' + esc(L(s.t)) + '</p>' + (s.ayah ? I.ayahHtml(s.ayah[0], s.ayah[1], s.ayah[2]) : '') + (s.had ? evidenceHtml(window.HAD[s.had]) : '') + (s.src ? '<p class="ref">' + esc(s.src) + '</p>' : '');
    var tl = $('.tl', c.el); if (tl) { var on = $$('.tl-n.on', tl); if (on.length && on[on.length - 1].scrollIntoView) on[on.length - 1].scrollIntoView({ inline: 'center', block: 'nearest' }); }
    c.done();
  };

  /* a prayer position: a faceless figure and the words */
  I.pose = function (c) {
    var s = c.step, g = (A.P() || {}).g === 'f' ? 'f' : 'm';
    var src = A.asset('img/pose/' + g + '/' + s.pose + '.webp');
    var d = s.say ? window.SAY[s.say] : null;
    c.el.innerHTML = '<div class="pose"><img src="' + src + '" alt=""></div><h3 style="text-align:center;font-size:22px">' + esc(L(s.title)) + '</h3>' + (d ? '<div class="dua-ar" lang="ar" dir="rtl">' + d.ar + '</div>' + (!A.ar() ? '<div class="tx-p"><div class="tx-l">' + esc(T('Transliteration')) + '</div><div class="tx-t" dir="ltr">' + esc(d.tr) + '</div></div><div class="tx-p"><div class="tx-l">' + esc(T('Translation')) + '</div><div class="tx-t" dir="ltr">' + esc(d.en) + '</div></div>' : '') : '') + (s.note ? '<p class="sc-t">' + esc(L(s.note)) + '</p>' : '');
    c.done();
  };
})();
