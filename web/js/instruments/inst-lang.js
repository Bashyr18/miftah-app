/* Language instruments, shared by Arabic and English. Parsing is one component with two grammars: iʿrāb and English use the same move. */
(function () {
  'use strict';
  var A = window.A, $ = A.$, $$ = A.$$, esc = A.esc, L = A.L, T = A.T, I = window.I;

  /* a letter: its shape, its name, its forms */
  I.letter = function (c) {
    var s = c.step, d = s.d;
    var forms = d.join === false ? [[d.ch, 'alone'], ['ـ' + d.ch, 'end']] : [[d.ch, 'alone'], [d.ch + 'ـ', 'start'], ['ـ' + d.ch + 'ـ', 'middle'], ['ـ' + d.ch, 'end']];
    c.el.innerHTML = '<button class="lt-big" data-s="1" lang="ar" dir="rtl">' + d.ch + '</button><div class="lt-name">' + esc(d.en) + ' · <span class="ar" lang="ar">' + d.name + '</span></div>' +
      '<div class="forms">' + forms.map(function (f) { return '<span>' + f[0] + '<small>' + esc(T(f[1])) + '</small></span>'; }).join('') + '</div>' + (d.tip ? '<p class="sc-t">' + esc(L(d.tip)) + '</p>' : '');
    var sp = function () { Voice.say(d.name, { lang: 'ar', key: 'ar_' + d.ch }); };
    /* no recording of this name yet (a parent can add one in My voice): the screen asks for a grown-up instead of promising a sound */
    if (!Voice.can(d.name, { key: 'ar_' + d.ch })) { var pr = document.querySelector('.pl-prompt .pl-p'); if (pr && /hear|اسمع/i.test(pr.textContent)) pr.textContent = L(['Touch it. A grown-up says its name with you.', 'المسه. يقول أحد الكبار اسمه معك.']); }
    $('.lt-big', c.el).onclick = function () { sp(); Fx.pop($('.lt-big', c.el)); };
    setTimeout(sp, 900);
    c.done();
  };

  /* letter + vowel = sound */
  I.blend = function (c) {
    var s = c.step, marks = s.marks || [['َ', 'fatḥah', 'a'], ['ِ', 'kasrah', 'i'], ['ُ', 'ḍammah', 'u']], cur = 0, lt = 0, ls = s.letters;
    c.el.innerHTML = '<div class="blend-out ar" lang="ar" dir="rtl"></div><div class="bl-row" dir="rtl" data-l>' + ls.map(function (x, i) { return '<button class="tile" data-i="' + i + '" lang="ar">' + x + '</button>'; }).join('') + '</div><div class="bl-row">' + marks.map(function (m, i) { return '<button class="tile mk" data-m="' + i + '" lang="ar" aria-label="' + esc(m[1]) + '"><b class="mk-g">◌' + m[0] + '</b><small>' + esc(m[1]) + '</small></button>'; }).join('') + '</div>';
    var out = $('.blend-out', c.el);
    function paint(say) {
      var v = ls[lt] + marks[cur][0];
      out.innerHTML = A.hk(v);
      $$('[data-i]', c.el).forEach(function (b) { b.classList.toggle('on', +b.dataset.i === lt); });
      $$('[data-m]', c.el).forEach(function (b) { b.classList.toggle('on', +b.dataset.m === cur); });
      Fx.pop(out);
      if (say) Voice.say(v, { lang: 'ar', key: 'ar_' + v });
    }
    $$('[data-i]', c.el).forEach(function (b) { b.onclick = function () { lt = +b.dataset.i; Fx.tap(); paint(true); }; });
    $$('[data-m]', c.el).forEach(function (b) { b.onclick = function () { cur = +b.dataset.m; Fx.tap(); paint(true); }; });
    paint(false);
    c.done();
  };

  /* build a word, tile by tile */
  I.build = function (c) {
    var s = c.step, en = s.lang === 'en', got = 0;
    var pool = c.rng.shuffle(s.word.concat(s.extra || []));
    c.el.innerHTML = (s.art ? '<div class="sc-art">' + A.art(s.art, 100) + '</div>' : '') + (s.listen !== false ? '<button class="listen" style="width:64px;height:64px" data-l="1" aria-label="' + esc(T('Listen')) + '">' + A.icon('speak', 28) + '</button>' : '') +
      '<div class="slots" dir="' + (en ? 'ltr' : 'rtl') + '">' + s.word.map(function () { return '<span class="slot' + (en ? ' en' : '') + '"></span>'; }).join('') + '</div>' + (s.join ? '<div class="blend-out' + (en ? ' en' : ' ar') + '" dir="' + (en ? 'ltr' : 'rtl') + '" style="min-height:1.2em"></div>' : '') +
      '<div class="bl-row" dir="' + (en ? 'ltr' : 'rtl') + '">' + pool.map(function (x, i) { return '<button class="tile' + (en ? ' en' : '') + '" data-p="' + i + '"' + (en ? '' : ' lang="ar"') + '>' + esc(x) + '</button>'; }).join('') + '</div>';
    var hear = function () { Voice.say(s.say || s.joined, { lang: en ? 'en' : 'ar', key: s.vk }); };
    var lb = $('[data-l]', c.el); if (lb) { lb.onclick = hear; setTimeout(hear, 500); }
    $$('[data-p]', c.el).forEach(function (b) {
      b.onclick = function () {
        var t = pool[+b.dataset.p];
        if (t === s.word[got]) {
          var sl = $$('.slot', c.el)[got]; sl.textContent = t; sl.style.borderStyle = 'solid'; Fx.pop(sl); Fx.tap(); b.style.visibility = 'hidden'; got++;
          if (s.sounds && s.sounds[t]) Voice.say(s.sounds[t], { lang: 'en', key: 'ph_' + t });
          if (got === s.word.length) {
            var o = $('.blend-out', c.el); if (o) o.textContent = s.joined || s.word.join('');
            setTimeout(hear, 250);
            c.ok(sl, { delay: 1100 });
          }
        } else c.bad(s.err || (en ? 'phoneme' : 'letter-shape'), b);
      };
    });
    c.onReveal(function () { s.word.forEach(function (t, i) { $$('.slot', c.el)[i].textContent = t; }); });
  };

  /* a root: three letters, a family of meanings */
  I.rootHtml = function (root, words) {
    return '<div class="root-tree"><div class="root-l" lang="ar">' + root.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div><div class="root-ws">' + words.map(function (w, i) { return '<div class="root-w" style="--i:' + i + '"><b lang="ar">' + w[0] + '</b><small>' + esc(L(w[1])) + '</small></div>'; }).join('') + '</div></div>';
  };

  /* parsing: pick a role, tap its word. One component, two grammars. */
  I.sentence = function (c) {
    var s = c.step, roleI = 0, left = s.words.filter(function (w) { return w.r != null; }).length;
    var isAr = !!s.ar;
    c.el.innerHTML = '<div class="snt' + (isAr ? ' ar" lang="ar' : '') + '">' + s.words.map(function (w, i) { return '<button class="wd" data-w="' + i + '">' + esc(w.t) + '</button>'; }).join('') + '</div><div class="rl-row">' + s.roles.map(function (r, i) { return '<button class="rl r' + i + (i === 0 ? ' on' : '') + '" data-r="' + i + '">' + esc(L(r)) + '</button>'; }).join('') + '</div>';
    $$('.rl', c.el).forEach(function (b) { b.onclick = function () { roleI = +b.dataset.r; $$('.rl', c.el).forEach(function (x) { x.classList.toggle('on', x === b); }); Fx.tap(); }; });
    $$('.wd', c.el).forEach(function (b) {
      b.onclick = function () {
        var w = s.words[+b.dataset.w];
        if (b.dataset.done) return;
        if (w.r === roleI) {
          b.classList.add('r' + roleI); b.dataset.done = 1; Fx.pop(b); Fx.tap(); left--;
          if (!left) c.ok(b);
          else { var nx = s.words.find(function (x, i) { return x.r != null && !$$('.wd', c.el)[i].dataset.done; }); if (nx) { roleI = nx.r; $$('.rl', c.el).forEach(function (x, i) { x.classList.toggle('on', i === roleI); }); } }
        } else c.bad('word-role', b);
      };
    });
    c.onReveal(function () { $$('.wd', c.el).forEach(function (b, i) { var w = s.words[i]; if (w.r != null) b.classList.add('r' + w.r); b.dataset.done = 1; }); });
  };

  /* English phonics: touch each sound, then slide them together */
  var SND = { s: 'sss', a: 'ah', t: 'tuh', p: 'puh', i: 'ih', n: 'nnn', m: 'mmm', d: 'duh', g: 'guh', o: 'oh', c: 'kuh', k: 'kuh', e: 'eh', u: 'uh', r: 'rrr', h: 'huh', b: 'buh', f: 'fff', l: 'lll', j: 'juh', v: 'vvv', w: 'wuh', x: 'ks', y: 'yuh', z: 'zzz', sh: 'shh', ch: 'chuh', th: 'thh', ng: 'ng', ck: 'kuh', qu: 'kwuh', ee: 'ee', oo: 'oo', ai: 'ay', ar: 'ar' };
  I.SND = SND;
  I.sound = function (g) { if (Voice.hasVoice('ph_' + g)) { Voice.say(g, { key: 'ph_' + g }); return; } var kw = window.C.KEYW && window.C.KEYW[g]; Voice.say(kw ? kw[0] : g, { lang: 'en' }); };
  I.phon = function (c) {
    var s = c.step, hit = {}, left = s.gs.length;
    c.el.innerHTML = (s.art ? '<div class="sc-art">' + A.art(s.art, 110) + '</div>' : '') + '<div class="bl-row" dir="ltr">' + s.gs.map(function (g, i) { return '<button class="tile en" data-g="' + i + '">' + esc(g) + '</button>'; }).join('') + '</div><div class="blend-out en" dir="ltr">&nbsp;</div>';
    var out = $('.blend-out', c.el);
    $$('[data-g]', c.el).forEach(function (b) {
      b.onclick = function () {
        var i = +b.dataset.g; I.sound(s.gs[i]); b.classList.add('on'); Fx.tap();
        if (!hit[i]) { hit[i] = 1; left--; }
        if (!left && !c._blended) {
          c._blended = 1;
          setTimeout(function () { out.textContent = s.word; Fx.pop(out); Voice.say(s.word, { lang: 'en' }); c.ok(out, { delay: 1100 }); }, 650);
        }
      };
    });
    c.onReveal(function () { out.textContent = s.word; });
  };
  /* a decodable page: every word is one the child can already sound out. Tap to hear only when stuck. */
  I.reader = function (c) {
    var s = c.step;
    c.el.innerHTML = '<div class="reader">' + (s.art ? '<div class="sc-art">' + A.art(s.art, 90) + '</div>' : '') + s.lines.map(function (l) { return '<p class="rd-p" dir="ltr">' + l.split(' ').map(function (w) { return '<span data-w="' + esc(w.replace(/[.,!?]/g, '')) + '">' + esc(w) + '</span>'; }).join(' ') + '</p>'; }).join('') + '</div>';
    $$('[data-w]', c.el).forEach(function (w) { w.onclick = function () { w.classList.add('on'); Voice.say(w.dataset.w, { lang: 'en' }); }; });
    c.done();
  };
})();
