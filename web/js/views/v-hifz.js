/* The Qurʾān. Today's ḥifẓ: old portions first (manzil and sabqī), then the new portion (sabaq).
   A person hears the child, or the child honestly checks; nothing is machine-scored. No effects, no scrambling, no games. */
(function () {
  'use strict';
  var A = window.A, $ = A.$, $$ = A.$$, esc = A.esc, L = A.L, T = A.T, Hifz = window.Hifz, Q = window.QURAN;
  var AN = function (n) { return String(n).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; }); };

  var alive = false, timers = [];
  function later(fn, ms) { var id = setTimeout(function () { timers = timers.filter(function (x) { return x !== id; }); if (alive) fn(); }, ms); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function ayahWords(s, a) {
    var v = Q.q[s].v[a - 1][1];
    return Voice.words(v).map(function (w) { return '<span class="w" tabindex="0" role="button" data-w="' + w.i + '">' + w.t + '</span>'; }).join(' ') + '&nbsp;<span class="w-end">﴿' + AN(a) + '﴾</span>';
  }
  function SN(s) { return A.ar() ? Q.q[s].ar.replace(/^سُورَةُ\s*/, '') : Q.q[s].name; }
  A.surahName = SN;
  function bsmFor(s, a) { return a === 1 && s !== 1 && s !== 9 ? '<div class="bsm">' + Q.bsm + '</div>' : ''; }
  function trans(s, a) { return A.ar() ? '' : '<div class="tx-p"><div class="tx-l">' + esc(T('Translation')) + '</div><div class="tx-t" dir="ltr">' + esc(Q.q[s].v[a - 1][2]) + '</div></div>'; }
  function bindWords(root, s, a) {
    $$('.w', root).forEach(function (w) {
      var act = function () { if (w.classList.contains('hid')) { w.classList.add('peek'); return; } Voice.word(s, a, +w.dataset.w); };
      w.onclick = act;
      w.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } };
    });
  }

  Hifz.summary = function () {
    var t = Hifz.today(), parts = [];
    if (t.sabaq) parts.push(SN(t.sabaq.s));
    if (t.sabqi.length + t.manzil.length) return [parts.join('') + ' · ' + (t.sabqi.length + t.manzil.length) + ' to keep', parts.join('') + ' · ' + AN(t.sabqi.length + t.manzil.length) + ' للمراجعة'];
    return [parts.join('') || 'Listen', parts.join('') || 'استمع'];
  };

  /* ===== today's session ===== */
  A.V.hifz = function (args) {
    if (!A.P()) return { redirect: 'home' };
    var stopI = args && args[0] != null ? +args[0] : null;
    var cleanup = null;
    return {
      bare: true, hue: 'emerald',
      html: '<div class="pl h-emerald quiet" id="hf"><div class="pl-top"><a class="pl-x" href="#/home" aria-label="' + esc(T('Leave')) + '">' + A.icon('close', 24) + '</a><div class="pl-bar"><div class="hf-tier" id="hf-tier"></div><div class="ayahs" id="hf-dots" style="margin-top:6px"></div></div><div style="width:48px"></div></div><div class="pl-body" id="hf-body"></div><div class="pl-foot" id="hf-foot"></div></div>',
      mount: function () { alive = true; var h0 = Hifz.state(), s0 = Q.order[h0.i]; if (s0 && window.Voice && Voice.keep) Voice.keep(s0); startSession(stopI); },
      unmount: function () { alive = false; clearTimers(); Voice.stop(); stopRec(); }
    };
  };

  function startSession(stopI) {
    var today = Hifz.today(), queue = [];
    today.manzil.forEach(function (k) { queue.push({ tier: 'manzil', k: k }); });
    today.sabqi.forEach(function (k) { queue.push({ tier: 'sabqi', k: k }); });
    if (today.sabaq) for (var a = today.sabaq.from; a <= today.sabaq.to; a++) queue.push({ tier: 'sabaq', s: today.sabaq.s, a: a, to: today.sabaq.to });
    /* the next portion starts from the first āyah that was not yet there */
    var i = 0, slipped = false;
    function next() {
      if (i >= queue.length) return finish();
      var it = queue[i], dots = $('#hf-dots');
      dots.innerHTML = queue.length > 1 ? queue.map(function (_, j) { return '<i class="' + (j < i ? 'on' : '') + '"></i>'; }).join('') : '';
      if (it.tier === 'sabaq') learn(it, function (g) { i++; if (g > 0 && !slipped) Hifz.advance(it.a); else if (g === 0) slipped = true; next(); });
      else recall(it, function () { i++; next(); });
    }
    function finish() {
      $('#hf-tier').textContent = '';
      $('#hf-dots').innerHTML = '';
      $('#hf-foot').innerHTML = '<button class="btn pri big" id="hf-done" style="margin:0 auto"><span>' + esc(T('Continue')) + '</span></button>';
      $('#hf-body').innerHTML = '<div class="ms" style="margin:auto">' + A.art('book', 110) + '<h2 style="font-size:24px">' + esc(T('Mā shāʾ Allāh')) + '</h2><p class="sc-t">' + esc(T('The Qurʾān is staying with you.')) + '</p>' + I.evidenceHtml(window.HAD['bukhari:5027']) + '</div>';
      $('#hf-done').onclick = function () { if (stopI != null) { Plan.complete(stopI); A.afterStop(); } else A.go('room/quran'); };
    }
    var I = window.I;
    next();
  }

  /* learn a new āyah: hear it, say it with the reciter, let the words go, then be heard */
  function learn(it, done) {
    var s = it.s, a = it.a, body = $('#hf-body'), foot = $('#hf-foot'), stage = 0, gen = 0;
    $('#hf-tier').textContent = T('New portion') + ' · ' + SN(s) + ' ' + A.num(a);
    function hear(times, cb) {
      var n = 0, my = ++gen;
      (function go() {
        if (!alive || my !== gen) return;
        if (n++ >= times) { cb && cb(); return; }
        var vv = $('#hf-v'); if (vv) vv.classList.add('reciting');
        Voice.ayah(s, a).then(function (ok) { var v2 = $('#hf-v'); if (v2) v2.classList.remove('reciting'); if (!alive || my !== gen) return; if (ok === false) { cb && cb(); return; } later(go, 700); });
      })();
    }
    function paint() {
      gen++;
      var levels = [0, 0, .34, .67, 1];
      body.innerHTML = '<div class="step tx">' + bsmFor(s, a) + '<div class="quran" lang="ar" dir="rtl" id="hf-v">' + ayahWords(s, a) + '</div>' + (stage <= 1 ? trans(s, a) : '') + '</div>';
      var ws = $$('#hf-v .w', body), frac = levels[stage] || 0;
      /* hide from the end: the first words stay as a cue longest */
      ws.forEach(function (w, j) { if (j >= Math.ceil(ws.length * (1 - frac)) && j > 0) w.classList.add('hid'); });
      bindWords(body, s, a);
      var labels = [T('Listen three times'), T('Say it with the reciter'), T('Say it, some words hidden'), T('Say it, more hidden'), T('Now say it all from your heart')];
      foot.innerHTML = '<div style="flex:1;text-align:center;display:grid;gap:9px;justify-items:center"><div style="color:var(--t2);font-size:15px">' + esc(labels[stage]) + '</div><div class="rec-row"><button class="round" id="hf-play" aria-label="' + esc(T('Listen')) + '">' + A.icon('play', 28) + '</button>' + recBtn(s, a) + '<button class="round off" id="hf-next" aria-label="' + esc(T('Next')) + '">' + A.icon('next', 28) + '</button></div></div>';
      $('#hf-play').onclick = function () { hear(stage === 0 ? 3 : 1); };
      $('#hf-next').onclick = function () { gen++; clearTimers(); Voice.stop(); stage++; if (stage >= 5) grade(); else paint(); };
      bindRec(s, a);
      if (stage === 0) later(function () { hear(3); }, 300);
    }
    function grade() { gradeScreen(s, a, function (g, by) { Hifz.mark(s, a, g, by); done(g); }, true); }
    paint();
  }

  /* retrieve an old āyah from its first word */
  function recall(it, done) {
    var parts = it.k.split(':'), s = +parts[0], a = +parts[1], body = $('#hf-body'), foot = $('#hf-foot');
    $('#hf-tier').textContent = T(it.tier === 'manzil' ? 'Old portion' : 'Recent portion') + ' · ' + SN(s);
    body.innerHTML = '<div class="step tx">' + '<div class="quran" lang="ar" dir="rtl" id="hf-v">' + ayahWords(s, a) + '</div></div>';
    var ws = $$('#hf-v .w', body);
    ws.forEach(function (w, j) { if (j > 0) w.classList.add('hid'); });
    bindWords(body, s, a);
    foot.innerHTML = '<div style="flex:1;display:grid;gap:9px;justify-items:center"><div style="color:var(--t2);font-size:15px">' + esc(T('Say it from your heart, then check')) + '</div><button class="btn pri big" id="hf-rev">' + esc(T('Show me')) + '</button></div>';
    $('#hf-rev').onclick = function () {
      ws.forEach(function (w) { w.classList.remove('hid'); });
      Voice.ayah(s, a);
      gradeScreen(s, a, function (g, by) { Hifz.mark(s, a, g, by); M.tally(A.D(), 30000); done(g); }, false);
    };
  }

  function gradeScreen(s, a, cb, showVerse) {
    var foot = $('#hf-foot'), body = $('#hf-body'), by = 'self';
    if (showVerse) body.innerHTML = '<div class="step tx"><div class="quran" lang="ar" dir="rtl">' + ayahWords(s, a) + '</div></div>';
    if (showVerse) bindWords(body, s, a);
    foot.innerHTML = '<div style="flex:1;display:grid;gap:9px"><div style="color:var(--t2);font-size:15px;text-align:center">' + esc(T('Be honest: how was it?')) + '</div><div class="grades"><button class="grade" data-g="2">' + esc(T('Smooth')) + '</button><button class="grade" data-g="1">' + esc(T('Small slips')) + '</button><button class="grade" data-g="0">' + esc(T('Not yet')) + '</button></div></div>';
    $$('[data-g]', foot).forEach(function (b) { b.onclick = function () { Voice.stop(); cb(+b.dataset.g, by); }; });
  }

  /* recording stays on the phone, so a parent can listen later */
  var recOn = false;
  function recBtn(s, a) { return A.N.has() ? '<button class="round off" id="hf-rec" aria-label="' + esc(T('Record me')) + '">' + A.icon('mic', 28) + '</button>' : ''; }
  function stopRec() { if (recOn) { A.N.call('recStop'); recOn = false; } }
  function bindRec(s, a) {
    var b = $('#hf-rec'); if (!b) return;
    var key = Voice.recKey(A.S.cur, s, a);
    b.onclick = function () {
      if (!recOn) { if (A.N.call('recStart', key)) { recOn = true; b.classList.add('rec'); b.classList.remove('off'); A.toast(A.L(['Recording. Recite, then tap again.', 'جارٍ التسجيل. اقرأ ثم انقر مجددًا.'])); } else A.micHelp(); }
      else { stopRec(); b.classList.remove('rec'); b.classList.add('off'); var d = A.D(); d.recs = d.recs || {}; d.recs[s + ':' + a] = A.now().getTime(); A.save(); A.toast(A.L(['Saved. Listen to yourself, and your parent can hear it too.', 'حُفظ. استمع إلى نفسك، ويمكن لوالديك سماعه.'])); Voice.refreshVoices(); later(function () { Voice.play('voice/' + key + '.m4a'); }, 300); }
    };
  }

  /* ===== the Qurʾān room: the shelf of sūrahs ===== */
  A.V.quran = function () {
    if (!A.P()) return { redirect: 'home' };
    var order = Q.order;
    var h = Hifz.state(), curS = order[h.i];
    var list = order.map(function (s) {
      var k = Hifz.known(s), su = Q.q[s], isCur = s === curS, full = k.n >= k.of && k.of;
      return '<a class="kitem h-emerald' + (isCur ? ' now' : '') + '" href="#/surah/' + s + '"><span class="kbox" style="font-family:var(--f-ar);font-size:16px;color:var(--h)" lang="ar">' + AN(s) + '</span><span class="grow"><b>' + esc(SN(s)) + '</b><small>' + (isCur ? esc(T('Learning now')) + ' · ' : '') + A.num(k.n) + ' / ' + A.num(k.of) + '</small></span>' + (A.ar() ? '' : '<span lang="ar" style="font-family:var(--f-ar);font-size:20px;color:var(--t2)">' + su.ar.replace(/^سُورَةُ\s*/, '') + '</span>') + (full ? A.icon('check', 20) : '') + '</a>';
    }).join('');
    return {
      hue: 'emerald',
      html: '<div class="ph h-emerald">' + (A.hasImg('portal-quran') ? '<span class="ph-portal">' + A.portalImg('quran', true) + '</span>' : '<svg class="girih" viewBox="0 0 100 100">' + A.girih(null, .55) + '</svg>') + '<a class="backp" href="#/rooms">' + A.icon('back', 18) + '<span>' + esc(A.stage() >= 3 ? L(['Subjects', 'المواد']) : T('Rooms')) + '</span></a><h1>' + esc(T('Qurʾān')) + '</h1><p>' + esc(T('Listen, repeat, and keep it in your heart')) + '</p></div><div class="wrap"><button class="btn pri big wide" data-a="hf-now" style="margin:16px 0 4px">' + esc(T('Today’s portion')) + '</button>' + (A.N.has() && curS ? '<button class="btn ghost wide" data-a="hf-keep" data-s="' + curS + '" style="margin:6px 0 4px">' + A.icon('download', 18) + '<span>' + esc(L(['Keep ' + SN(curS) + ' offline', 'احفظ ' + SN(curS) + ' دون إنترنت'])) + '</span></button>' : '') + '<div class="unit"><div class="kl">' + list + '</div></div></div>',
      mount: function () { if (curS && window.Voice && Voice.keep) Voice.keep(curS); }
    };
  };
  A.acts['hf-now'] = function () { if (Plan.over()) { A.go('rest'); return; } Fx.door('emerald', 'hifz'); };
  A.acts['hf-keep'] = function (t) { var sv = +t.dataset.s; if (!sv || !window.Voice || !Voice.keep) return; Voice.keep(sv); A.toast(L(['Saving this sūrah on this device', 'جارٍ حفظ هذه السورة على هذا الجهاز'])); };

  /* reading and listening to a whole sūrah; tap any word to hear it */
  A.V.surah = function (args) {
    if (!A.P()) return { redirect: 'home' };
    var s = +args[0], su = Q.q[s]; if (!su) return { redirect: 'room/quran' };
    var cur = 0, playing = false;
    var rows = su.v.map(function (v, i) {
      return '<div class="tx-v" data-a2="' + v[0] + '" style="padding:10px 0;border-bottom:1px solid var(--line)"><div class="quran" lang="ar" dir="rtl" style="font-size:clamp(25px,7vw,34px)">' + ayahWords(s, v[0]) + '</div>' + trans(s, v[0]) + '</div>';
    }).join('');
    return {
      hue: 'emerald',
      html: '<div class="ph h-emerald"><a class="backp" href="#/room/quran">' + A.icon('back', 18) + '<span>' + esc(T('Qurʾān')) + '</span></a><h1>' + esc(SN(s)) + '</h1>' + (A.ar() ? '' : '<p lang="ar" style="font-family:var(--f-ar);font-size:24px">' + su.ar + '</p>') + '</div><div class="wrap">' + (s !== 1 && s !== 9 ? '<div class="bsm" style="margin:12px 0">' + Q.bsm + '</div>' : '') + rows + '<div style="height:90px"></div></div><div class="nav"><button class="btn sm sec" id="s-rec">' + esc(A.S.reciter === 'h' ? T('Teaching pace') : T('Flowing')) + '</button>' + (A.N.has() ? '<button class="btn sm ghost" data-a="hf-keep" data-s="' + s + '">' + A.icon('download', 16) + '<span>' + esc(L(['Keep offline', 'دون إنترنت'])) + '</span></button>' : '') + '<button class="round" id="s-play" style="width:50px;height:50px" aria-label="' + esc(T('Listen')) + '">' + A.icon('play', 24) + '</button></div>',
      mount: function (v) {
        $$('.tx-v', v).forEach(function (row) { bindWords(row, s, +row.dataset.a2); });
        var pb = $('#s-play', v);
        function mark(i) { $$('.tx-v .quran .w', v).forEach(function (w) { w.classList.remove('on'); }); var r = $$('.tx-v', v)[i]; if (r) { $$('.w', r).forEach(function (w) { w.classList.add('on'); }); r.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }
        function go() {
          if (cur >= su.v.length) { playing = false; cur = 0; pb.innerHTML = A.icon('play', 24); mark(-1); return; }
          mark(cur);
          Voice.ayah(s, su.v[cur][0]).then(function (ok) { if (!playing) return; if (ok) { cur++; go(); } else { playing = false; pb.innerHTML = A.icon('play', 24); } });
        }
        pb.onclick = function () { playing = !playing; pb.innerHTML = A.icon(playing ? 'pause' : 'play', 24); if (playing) go(); else Voice.stop(); };
        $('#s-rec', v).onclick = function () { A.S.reciter = A.S.reciter === 'h' ? 'a' : 'h'; A.save(); this.textContent = A.S.reciter === 'h' ? T('Teaching pace') : T('Flowing'); if (playing) { Voice.stop(); playing = true; go(); } };
      },
      unmount: function () { playing = false; Voice.stop(); }
    };
  };
})();
