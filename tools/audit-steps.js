/* Dev only: run every step of every lesson through its real instrument, three times with fresh seeds. Not bundled. */
window.__audit = function () {
  var A = window.A, I = window.I, C = window.C, errs = [], counts = { steps: 0, kinds: {} };
  var host = document.createElement('div'); host.style.cssText = 'position:fixed;left:-9999px;width:' + (innerWidth - 28) + 'px'; host.className = 'step-in'; var over = {}; var wrapP = document.createElement('div'); wrapP.className = 'pl h-gold'; wrapP.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none;width:' + innerWidth + 'px;height:10px;overflow:hidden'; wrapP.appendChild(host); host.style.left = '0'; host.style.position = 'relative'; document.body.appendChild(wrapP);
  var saveCur = A.S.cur;
  function tryStep(sk, s, label) {
    counts.steps++; counts.kinds[s.k] = (counts.kinds[s.k] || 0) + 1;
    host.innerHTML = '';
    var cleanup = null;
    var fn = I[s.k];
    if (!fn) { errs.push(sk.id + ' ' + label + ': no instrument ' + s.k); return; }
    if (s.p && !Array.isArray(s.p)) errs.push(sk.id + ' ' + label + ': prompt not bilingual');
    if (s.p && Array.isArray(s.p) && s.p.length !== 2) errs.push(sk.id + ' ' + label + ': prompt not [en,ar]');
    if (s.art && !A.ART[s.art]) errs.push(sk.id + ' ' + label + ': no art ' + s.art);
    (s.arts || []).forEach(function (x) { if (!A.ART[x]) errs.push(sk.id + ' ' + label + ': no art ' + x); });
    (s.o || []).forEach(function (o) { if (o.art && !A.ART[o.art]) errs.push(sk.id + ' ' + label + ': no art ' + o.art); });
    if (s.k === 'choice' || s.k === 'sit') { if (!(s.o || []).some(function (o) { return o.ok; })) errs.push(sk.id + ' ' + label + ': no right answer'); var seen = {}; (s.o || []).forEach(function (o) { var key = JSON.stringify(o.t || o.art || o.html); if (seen[key]) errs.push(sk.id + ' ' + label + ': duplicate option ' + key); seen[key] = 1; }); }
    if (s.k === 'pad' && (s.a == null || isNaN(s.a) || s.a < 0 || s.a !== Math.floor(s.a))) errs.push(sk.id + ' ' + label + ': bad pad answer ' + s.a + ' ' + s.eq);
    if (s.k === 'trace' && !(window.STROKES[s.set] || {})[s.ch]) errs.push(sk.id + ' ' + label + ': no strokes ' + s.set + ' ' + s.ch);
    if (s.k === 'order' && (!s.items || s.items.length < 2)) errs.push(sk.id + ' ' + label + ': order too short');
    if (s.k === 'predict' && !s.o) errs.push(sk.id + ' ' + label + ': predict no options');
    var ctx = { el: host, step: s, rng: A.rng(A.seed()), stage: 1, hue: 'gold', phase: s.ph, ok: function () { }, bad: function () { }, done: function () { }, say: function () { return Promise.resolve(); }, next: function () { }, setCleanup: function (f) { cleanup = f; }, showNext: function () { }, foot: document.createElement('div'), onReveal: function (f) { ctx._rev = f; }, logErr: function () { } };
    try {
      fn(ctx);
      if (ctx._rev) ctx._rev();
      if (host.scrollWidth > host.clientWidth + 2) { var kk = sk.id + ' ' + label + ' ' + s.k + ' ' + host.scrollWidth + '>' + host.clientWidth; over[s.k] = kk; }
      var txt = host.textContent || '';
      if (/undefined|\[object|NaN/.test(txt)) errs.push(sk.id + ' ' + label + ': bad text "' + txt.slice(0, 80) + '"');
      if (s.k === 'predict') { var o = host.querySelector('.opt'); if (o) o.click(); }
    } catch (e) { errs.push(sk.id + ' ' + label + ' [' + s.k + ']: ' + e.message); }
    if (cleanup) try { cleanup(); } catch (e) { }
    Voice.stop();
  }
  var pid = A.S.cur;
  C.list.forEach(function (sk) {
    (sk.needs || []).forEach(function (n) { if (!C.skills[n]) errs.push(sk.id + ': missing need ' + n); });
    if (!sk.title || !Array.isArray(sk.title)) errs.push(sk.id + ': no title');
    if (sk.art && !A.ART[sk.art]) errs.push(sk.id + ': no art ' + sk.art);
    if (!sk.review) errs.push(sk.id + ': no review');
    for (var t = 0; t < 4; t++) {
      var rng = A.rng(1000 + t * 77);
      try {
        var steps = Player.compose(sk, rng);
        if (!steps.length) errs.push(sk.id + ': no steps');
        steps.forEach(function (s, i) { tryStep(sk, s, s.ph + i); });
        if (sk.review) { var rv = sk.review(rng); (Array.isArray(rv) ? rv : [rv]).forEach(function (s) { tryStep(sk, Object.assign({ ph: 'solo' }, s), 'review'); }); }
      } catch (e) { errs.push(sk.id + ' compose: ' + e.message); }
    }
  });
  Object.keys(C.nursery).forEach(function (k) { var n = C.nursery[k]; if (!A.ART[n.art]) errs.push(k + ': no art ' + n.art); if (n.child.art && !A.ART[n.child.art]) errs.push(k + ': child art ' + n.child.art); if (!n.adult.prep || !n.adult.say || !n.adult.notice) errs.push(k + ': adult card'); });
  Object.keys(C.missions).forEach(function (k) { var m = C.missions[k]; if (!Array.isArray(m.t)) errs.push(k + ': mission text'); if (!A.ART[m.art]) errs.push(k + ': mission art ' + m.art); if (m.skill && !C.skills[m.skill]) errs.push(k + ': mission skill'); });
  wrapP.remove();
  return { over: over, errs: errs.slice(0, 60), nerrs: errs.length, steps: counts.steps, kinds: counts.kinds, skills: C.list.length, nursery: Object.keys(C.nursery).length, missions: Object.keys(C.missions).length, perRoom: C.order.map(function (r) { return r + ':' + C.rooms[r].units.reduce(function (a, u) { return a + u.skills.length; }, 0); }) };
};
