/* Two parent-launched activities for the child: finding their level in a room, and flash cards on the screen. */
(function () {
  'use strict';
  var A = window.A, $ = A.$, esc = A.esc, L = A.L, T = A.T, C = window.C, M = window.M;

  /* Finding the level: a short search through the room's lessons. Two right answers and it looks further on; a miss and it looks further back.
     Nothing is forged by this: the lessons below the result are simply treated as already known, and a parent can undo it. */
  A.V.place = function (args) {
    if (!A.grownOpen()) return A.grownGate();
    var pid = args[0], rid = args[1], p = A.profile(pid), r = C.rooms[rid]; if (!p || !Object.prototype.hasOwnProperty.call(C.rooms, rid)) return { redirect: 'parent' };
    A.S.cur = pid;
    var st = A.stage(p), list = []; r.units.forEach(function (u) { if (u.band > st || u.strand) return; u.skills.forEach(function (s) { if (s.band <= st && s.review) list.push(s); }); });
    var lo = 0, hi = list.length - 1, rng = A.rng(A.seed()), host = null;
    function probe() {
      if (lo > hi || !list.length) return finish();
      var mid = Math.floor((lo + hi) / 2), sk = list[mid], steps = [];
      for (var i = 0; i < 2; i++) { var x = sk.review(rng); (Array.isArray(x) ? x.slice(0, 1) : [x]).forEach(function (q) { steps.push(Object.assign({}, q, { ph: 'solo', hint: null, noHelp: true })); }); }
      Player.start(host, { steps: steps, hue: r.hue, rng: rng, mode: 'review', exam: true, onExit: function () { A.go('parent/' + pid + '/rooms'); }, onDone: function (res) { if (res.solo && res.soloOk === res.solo) lo = mid + 1; else hi = mid - 1; probe(); } });
    }
    function finish() {
      var d = A.D(pid); for (var i = 0; i < lo; i++) if (!M.met(list[i].id, pid)) d.placed[list[i].id] = 1; d.path = null; A.saveNow();
      var nx = list[lo], none = !list.length;
      host.innerHTML = '<div class="forge place-finish h-' + r.hue + '"><div class="forge-key">' + A.art('key', Math.min(innerWidth, innerHeight) * .4) + '</div><div class="forge-txt"><small>' + esc(L(r.name)) + '</small><h2>' + esc(none ? L(['Nothing to place here yet', 'لا شيء لتحديد مستواه هنا بعد']) : nx ? T('Your door is ready') : T('You know all of this')) + '</h2><p>' + esc(none ? L(['This subject has no placement check at this stage.', 'ليس لهذه المادة فحص مستوى في هذه المرحلة.']) : nx ? L(nx.title) : T('Every door here is already open for you.')) + '</p><button class="btn pri big" id="fgo">' + esc(T('Continue')) + '</button></div></div>';
      $('#fgo', host).onclick = function () { A.go('parent/' + pid + '/rooms'); };
    }
    return { bare: true, hue: r.hue, html: '<div id="plh" class="place-workspace"></div>', mount: function (v) { host = $('#plh', v); probe(); }, unmount: function () { Player.stop(); Voice.stop(); }, onBack: function () { Player.stop(); A.go('parent/' + pid + '/rooms'); return 'handled'; } };
  };

  /* Flash cards on the screen: the same cards as on paper. Tap to hear, swipe or tap on for the next. Shuffled, no marks. */
  function cardsFor(kind, pid) {
    var k = [], rng = A.rng(A.seed());
    if (kind === 'cards-ar') { (C.FAM || []).forEach(function (f) { if (M.met(f[0], pid)) f[1].forEach(function (ch) { var l = C.LETTERS.filter(function (x) { return x.ch === ch; })[0]; k.push({ big: ch, ar: true, sub: l.name, say: l.name, lang: 'ar', key: 'ar_' + ch }); }); }); }
    if (kind === 'cards-en') { (C.SOUNDLESSONS || []).forEach(function (x) { if (M.met(x.id, pid)) x.g.forEach(function (g) { var w = C.KEYW[g]; k.push({ big: g, art: w[1], sub: w[0], snd: g }); }); }); }
    return rng.shuffle(k);
  }
  A.V.cards = function (args) {
    var pid = args[0], kind = args[1], p = A.profile(pid);
    if (!p || (kind !== 'cards-ar' && kind !== 'cards-en')) return { redirect: 'parent' };
    var list = cardsFor(kind, pid), i = 0, sayT = null;
    function keys(e) {
      if (list.length < 2 || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') || e.defaultPrevented ||
          e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || e.isComposing || $('.sheet.on, .dk-pal') ||
          e.target.closest && e.target.closest('a, input, textarea, select, [contenteditable]')) return;
      var forward = (e.key === 'ArrowRight') !== A.ar(), onCard = document.activeElement === $('#fc');
      e.preventDefault(); e.stopPropagation();
      $(forward ? '#cd-next' : '#cd-prev').click();
      if (onCard) $('#fc').focus({ preventScroll: true });
    }
    return {
      bare: true, hue: 'gold',
      html: '<div class="pl h-gold cards-screen"><div class="pl-top"><a class="pl-x" href="#/parent/' + esc(pid) + '/sheet/' + esc(kind) + '" aria-label="' + esc(T('Leave')) + '">' + A.icon('close', 24) + '</a><div class="pl-bar" id="cd-n" role="status" style="text-align:center;color:var(--t2)"></div><div style="width:48px"></div></div><div class="pl-body"><div class="step" id="cd"></div></div><div class="pl-foot"><button class="btn sec big" id="cd-prev" aria-label="' + esc(L(['Previous', 'السابق'])) + '">' + A.icon('back', 24).replace('class="ic"', 'class="ic ic-flip"') + '</button><button class="btn pri big" id="cd-next" style="margin-inline-start:auto"><span>' + esc(T('Next')) + '</span>' + A.icon('next', 24).replace('class="ic"', 'class="ic ic-flip"') + '</button></div></div>',
      mount: function (v) {
        function show() {
          clearTimeout(sayT);
          var c = list[i], el = $('#cd', v), prev = $('#cd-prev', v), next = $('#cd-next', v);
          if (!c) { el.innerHTML = '<div class="empty">' + A.art('key', 100) + '<p>' + esc(T('Nothing here yet. These fill up as they learn.')) + '</p></div>'; next.style.display = 'none'; prev.style.display = 'none'; return; }
          prev.style.display = list.length > 1 ? '' : 'none';
          $('#cd-n', v).textContent = A.num(i + 1) + ' / ' + A.num(list.length);
          el.innerHTML = '<button class="fcard" id="fc">' + (c.ar ? '<span class="fc-big ar" lang="ar">' + c.big + '</span>' : '<span class="fc-big" dir="ltr">' + esc(c.big) + '</span>') + (c.art ? A.art(c.art, 110) : '') + '<small ' + (c.ar ? 'class="ar" lang="ar"' : 'dir="ltr"') + '>' + esc(c.sub) + '</small></button>';
          var say = function () { if (c.snd) window.I.sound(c.snd); else Voice.say(c.say, { lang: c.lang, key: c.key }); };
          $('#fc', el).onclick = function () { say(); Fx.pop(this); }; sayT = setTimeout(say, 240);
        }
        $('#cd-prev', v).onclick = function () { i = (i - 1 + Math.max(1, list.length)) % Math.max(1, list.length); Fx.tap(); show(); };
        $('#cd-next', v).onclick = function () { i = (i + 1) % Math.max(1, list.length); Fx.tap(); show(); };
        show();
        document.addEventListener('keydown', keys, true);
      },
      unmount: function () { document.removeEventListener('keydown', keys, true); clearTimeout(sayT); Voice.stop(); }
    };
  };
})();
