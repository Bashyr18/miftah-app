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
      var act = function () { if (w.classList.contains('hid') && !w.classList.contains('peek')) { w.classList.add('peek'); return; } Voice.word(s, a, +w.dataset.w); };
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
    function keys(e) {
      if (recOn || e.defaultPrevented || e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || e.isComposing || $('.sheet.on, .dk-pal') ||
          e.target.closest && e.target.closest('button, a, input, select, textarea, [contenteditable], [role="button"]')) return;
      var button = e.key === ' ' ? $('#hf-play') :
        e.key === 'ArrowRight' || e.key === 'Enter' ? ($('#hf-next') || $('#hf-rev') || $('#hf-done')) : null;
      if (button && !button.disabled) { e.preventDefault(); e.stopPropagation(); button.click(); }
    }
    return {
      bare: true, hue: 'emerald',
      html: '<div class="pl h-emerald quiet" id="hf"><div class="pl-top"><a class="pl-x" href="#/home" aria-label="' + esc(T('Leave')) + '">' + A.icon('close', 24) + '</a><div class="pl-bar"><div class="hf-tier" id="hf-tier"></div><div class="ayahs" id="hf-dots" style="margin-top:6px"></div></div><div style="width:48px"></div></div><div class="pl-body" id="hf-body"></div><div class="pl-foot" id="hf-foot"></div></div>',
      mount: function () { alive = true; var h0 = Hifz.state(), s0 = Q.order[h0.i]; if (s0 && window.Voice && Voice.keep && !Voice.skipAutoKeep) Voice.keep(s0); startSession(stopI); document.addEventListener('keydown', keys, true); },
      unmount: function () { document.removeEventListener('keydown', keys, true); alive = false; clearTimers(); Voice.stop(); stopRec(); }
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
      dots.innerHTML = queue.length > 14 ? '<span style="font-size:12px;color:var(--t3)">' + A.num(i + 1) + ' / ' + A.num(queue.length) + '</span>' : queue.length > 1 ? queue.map(function (_, j) { return '<i class="' + (j < i ? 'on' : '') + '"></i>'; }).join('') : '';
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
  function recBtn(s, a) { return A.N.has() ? '<button class="round off" id="hf-rec" aria-pressed="false" aria-label="' + esc(T('Record me')) + '">' + A.icon('mic', 28) + '</button>' : ''; }
  function stopRec() { if (recOn) { A.N.call('recStop'); recOn = false; } }
  function bindRec(s, a) {
    var b = $('#hf-rec'); if (!b) return;
    var key = Voice.recKey(A.S.cur, s, a);
    b.onclick = function () {
      if (!recOn) { if (A.N.call('recStart', key)) { recOn = true; b.classList.add('rec'); b.classList.remove('off'); b.setAttribute('aria-pressed', 'true'); b.setAttribute('aria-label', L(['Stop recording', 'إيقاف التسجيل'])); A.toast(A.L(['Recording. Recite, then tap again.', 'جارٍ التسجيل. اقرأ ثم انقر مجددًا.'])); } else A.micHelp(); }
      else {
        stopRec(); b.classList.remove('rec'); b.classList.add('off'); b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', T('Record me'));
        var d = A.D(), verse = s + ':' + a;
        d.recs = d.recs || {}; d.recs[verse] = A.now().getTime();
        if (d.recSources) delete d.recSources[verse];
        A.save();
        A.toast(A.L(['Saved. Listen to yourself, and your parent can hear it too.', 'حُفظ. استمع إلى نفسك، ويمكن لوالديك سماعه.']));
        Voice.refreshVoices();
        later(function () { Voice.play('voice/' + key + '.m4a'); }, 300);
      }
    };
  }

  /* ===== the Qurʾān room: the shelf of sūrahs ===== */
  function fmtBytes(n) { return n > 1048576 ? A.num(Math.round(n / 104857.6) / 10) + ' MB' : A.num(Math.max(1, Math.round((n || 0) / 1024))) + ' KB'; }
  function coverageLabel(cov) {
    if (cov.state === 'bundled' || cov.state === 'saved') return L(['Verses & words offline', 'الآيات والكلمات دون إنترنت']);
    if (cov.state === 'verses') return L(['Verses offline · words need internet', 'الآيات دون إنترنت · الكلمات تحتاج إنترنت']);
    if (cov.state === 'partial') return L(['Partly downloaded', 'تنزيل جزئي']);
    return L(['Needs internet to download', 'تحتاج إنترنت للتنزيل']);
  }
  function shelfTag(s, st) {
    var ast = Voice.surahState ? Voice.surahState(s, st) : 'online';
    if (ast === 'bundled' || ast === 'saved') return '<span class="qa-tag">' + esc(L(['Offline', 'دون إنترنت'])) + '</span>';
    if (ast === 'verses') return '<span class="qa-tag part">' + esc(L(['Verses', 'الآيات'])) + '</span>';
    if (ast === 'partial') return '<span class="qa-tag part">' + esc(L(['Partly saved', 'جزئي'])) + '</span>';
    return '';
  }
  A.V.quran = function () {
    if (!A.P()) return { redirect: 'home' };
    var order = Q.order, unsubKeep = null;
    var h = Hifz.state(), curS = order[h.i], st = A.N.has() && Voice.stats ? Voice.stats() : {};
    var finished = 0;
    var list = order.map(function (s) {
      var k = Hifz.known(s), su = Q.q[s], isCur = s === curS, full = (h.finished || []).indexOf(s) >= 0 || (k.n >= k.of && k.of);
      if (full) finished++;
      return '<a class="kitem h-emerald' + (isCur ? ' now' : '') + '" href="#/surah/' + s + '" data-qs="' + s + '"><span class="kbox" style="font-family:var(--f-ar);font-size:16px;color:var(--h)" lang="ar">' + AN(s) + '</span><span class="grow"><b>' + esc(SN(s)) + '</b><small>' + (isCur ? esc(T('Learning now')) + ' · ' : '') + A.num(k.n) + ' / ' + A.num(k.of) + '</small></span><span class="qa-slot">' + shelfTag(s, st) + '</span>' + (A.ar() ? '' : '<span class="kitem-ar" lang="ar">' + su.ar.replace(/^سُورَةُ\s*/, '') + '</span>') + (full ? A.icon('check', 20) : '') + '</a>';
    }).join('');
    var teen = A.stage() >= 3;
    var navH = teen
      ? '<nav class="nav" aria-label="' + esc(L(['Sections', 'الأقسام'])) + '"><a href="#/home">' + A.icon('path', 21) + '<span>' + esc(L(['Today', 'اليوم'])) + '</span></a><a href="#/rooms" class="on">' + A.icon('rooms', 21) + '<span>' + esc(L(['Subjects', 'المواد'])) + '</span></a><a href="#/study">' + A.icon('book', 21) + '<span>' + esc(L(['Study', 'الدراسة'])) + '</span></a><a href="#/keys">' + A.icon('keys', 21) + '<span>' + esc(L(['Record', 'السجل'])) + '</span></a></nav>'
      : '<nav class="nav" aria-label="' + esc(T('Sections')) + '"><a href="#/home">' + A.icon('path', 22) + '<span>' + esc(T('Today')) + '</span></a><a href="#/rooms" class="on">' + A.icon('rooms', 22) + '<span>' + esc(T('Rooms')) + '</span></a><a href="#/keys">' + A.icon('keys', 22) + '<span>' + esc(T('My keys')) + '</span></a></nav>';
    return {
      hue: 'emerald',
      html: '<div class="ph h-emerald">' + (A.hasImg('portal-quran') ? '<span class="ph-portal">' + A.portalImg('quran', true) + '</span>' : '<svg class="girih" viewBox="0 0 100 100">' + A.girih(null, .55) + '</svg>') + '<a class="backp" href="#/rooms">' + A.icon('back', 18) + '<span>' + esc(teen ? L(['Subjects', 'المواد']) : T('Rooms')) + '</span></a><h1>' + esc(T('Qurʾān')) + '</h1><p>' + esc(T('Listen, repeat, and keep it in your heart')) + '</p></div><div class="wrap quran-room"><div class="quran-summary card"><div><small>' + esc(L(['Current sūrah', 'السورة الحالية'])) + '</small><h2>' + esc(curS ? SN(curS) : L(['Review', 'المراجعة'])) + '</h2><p>' + A.num(finished) + ' ' + esc(L(['sūrahs finished', 'سورة مكتملة'])) + '</p></div><button class="btn pri big" data-a="hf-now">' + esc(T('Today’s portion')) + '</button></div>' + (A.N.has() ? '<div class="qa-row">' + (curS ? '<button class="btn ghost" data-a="hf-keep" data-s="' + curS + '">' + A.icon('download', 18) + '<span>' + esc(L(['Download ' + SN(curS), 'تنزيل تلاوة ' + SN(curS)])) + '</span></button>' : '') + '<button class="btn ghost" data-a="hf-offline">' + A.icon('speak', 18) + '<span>' + esc(L(['Offline audio', 'التلاوة دون إنترنت'])) + '</span></button></div>' : '') + '<div class="unit"><div class="kl quran-library">' + list + '</div></div></div>' + navH,
      mount: function (v) {
        if (curS && window.Voice && Voice.keep) Voice.keep(curS);
        if (A.N.has() && Voice.onKeep) {
          unsubKeep = Voice.onKeep(function (done, total, bad) {
            if (!v.isConnected || done < total) return;
            var fresh = Voice.stats();
            $$('[data-qs]', v).forEach(function (a) { var slot = $('.qa-slot', a); if (slot) slot.innerHTML = shelfTag(+a.dataset.qs, fresh); });
            if (bad > 0) A.toast(L(['Downloaded with ' + bad + ' missing', 'تعذّر تنزيل ' + A.num(bad)]));
          });
        }
      },
      unmount: function () { if (unsubKeep) { unsubKeep(); unsubKeep = null; } }
    };
  };
  A.acts['hf-now'] = function () { if (Plan.over()) { A.go('rest'); return; } Fx.door('emerald', 'hifz'); };
  A.acts['hf-keep'] = function (t) { var sv = +t.dataset.s; if (!sv || !window.Voice || !Voice.keep) return; Voice.keep(sv, true); A.toast(L(['Downloading verses and words for this sūrah', 'جارٍ تنزيل آيات وكلمات هذه السورة'])); };
  A.acts['hf-offline'] = function () {
    if (!A.N.has()) return;
    var h = Hifz.state(), curS = Q.order[h.i], r = A.S.reciter || 'h';
    var juzAmma = Q.order.filter(function (s) { return s >= 78; });
    var recLabel = r === 'h' ? T('Al-Ḥuṣarī, teaching pace') : T('Al-ʿAfāsī, flowing');
    function metaHtml() {
      var st = Voice.stats();
      var fullN = Q.order.filter(function (s) { var k = Voice.surahState(s, st, r); return k === 'bundled' || k === 'saved'; }).length;
      var verseN = Q.order.filter(function (s) { return Voice.surahCoverage(s, st, r).versesReady; }).length;
      return '<b>' + esc(recLabel) + '</b><small>' + A.num(verseN) + ' / ' + A.num(Q.order.length) + ' ' + esc(L(['sūrahs (verses)', 'سورة (الآيات)'])) + ' · ' + A.num(fullN) + ' ' + esc(L(['with tap-to-hear words', 'مع نطق الكلمات'])) + (st.files ? ' · ' + fmtBytes(st.bytes) : '') + '</small>';
    }
    var st0 = Voice.stats();
    A.sheet(L(['Offline Qurʾān audio', 'تنزيل تلاوة القرآن']), '<div class="qa-box">' +
      '<p class="qa-meta" id="qa-meta">' + metaHtml() + '</p>' +
      '<p id="qa-prog" class="qa-prog" role="status" aria-live="polite" hidden></p>' +
      (curS ? '<button class="btn pri wide" id="qa-cur">' + A.icon('download', 18) + '<span>' + esc(L(['Download ' + SN(curS) + ' (verses & words)', 'تنزيل تلاوة ' + SN(curS) + ' (الآيات والكلمات)'])) + '</span></button>' : '') +
      '<button class="btn sec wide" id="qa-juz">' + A.icon('download', 18) + '<span>' + esc(L(['Download Juzʾ ʿAmma (78–114)', 'تنزيل جزء عمّ (٧٨–١١٤)'])) + '</span></button>' +
      '<button class="btn ghost wide" id="qa-clr"' + (st0.files ? '' : ' hidden') + '>' + esc(L(['Clear downloaded audio', 'مسح التلاوات المنزّلة'])) + '</button>' +
      '<small class="qa-note">' + esc(L(['Bundled recordings and your family’s own voice recordings are never deleted.', 'لا تُحذف التسجيلات المدمجة ولا تسجيلات أسرتك أبدًا.'])) + '</small></div>', function (sh) {
      var unsub = Voice.onKeep ? Voice.onKeep(function (done, total) {
        if (!sh.isConnected) { unsub(); return; }
        var m = $('#qa-meta', sh); if (m) m.innerHTML = metaHtml();
        var cl = $('#qa-clr', sh); if (cl) cl.hidden = !(Voice.stats().files > 0);
        if (done >= total) { var curB2 = $('#qa-cur', sh); if (curB2) curB2.disabled = false; var juzB2 = $('#qa-juz', sh); if (juzB2) juzB2.disabled = false; }
      }) : function () { };
      var curB = $('#qa-cur', sh), juzB = $('#qa-juz', sh);
      function lockDl(on) { if (curB) curB.disabled = on; if (juzB) juzB.disabled = on; }
      if (curB) curB.onclick = function () {
        var stNow = Voice.stats(), cov = Voice.surahCoverage ? Voice.surahCoverage(curS, stNow, r) : null;
        var p0 = $('#qa-prog', sh);
        if (cov && (cov.state === 'bundled' || cov.state === 'saved')) { if (p0) { p0.hidden = false; p0.textContent = L(['Already ready offline', 'جاهز بالفعل دون إنترنت']); } return; }
        lockDl(true); Voice.keep(curS, true); if (p0) { p0.hidden = false; p0.textContent = L(['Downloading…', 'جارٍ التنزيل…']); }
      };
      if (juzB) juzB.onclick = function () {
        var stNow = Voice.stats(), todo = juzAmma.filter(function (s) { var k = Voice.surahState(s, stNow, r); return k !== 'bundled' && k !== 'saved'; });
        var p0 = $('#qa-prog', sh);
        if (!todo.length) { if (p0) { p0.hidden = false; p0.textContent = L(['Already ready offline', 'جاهز بالفعل دون إنترنت']); } return; }
        lockDl(true); var n = Voice.keepMany(todo); if (p0) { p0.hidden = false; p0.textContent = n ? L(['Downloading…', 'جارٍ التنزيل…']) : L(['Already ready offline', 'جاهز بالفعل دون إنترنت']); } if (!n) lockDl(false);
      };
      var clrB = $('#qa-clr', sh); if (clrB) clrB.onclick = function () { if (clrB.dataset.arm !== '1') { clrB.dataset.arm = '1'; clrB.textContent = L(['Tap again to clear', 'انقر مجددًا للمسح']); return; } unsub(); Voice.clearAudio(); A.closeSheet(); A.toast(L(['Cleared', 'تم المسح'])); A.rerender(); };
    });
  };

  /* reading and listening to a whole sūrah; tap any word to hear it */
  A.V.surah = function (args) {
    if (!A.P()) return { redirect: 'home' };
    var s = +args[0], su = Q.q[s]; if (!su) return { redirect: 'room/quran' };
    var cur = 0, playing = false, playRun = 0, unsubKeep = null, wide, removeWide;
    var rows = su.v.map(function (v) {
      return '<div class="tx-v" data-a2="' + v[0] + '" style="padding:10px 0;border-bottom:1px solid var(--line)"><div class="quran" lang="ar" dir="rtl" style="font-size:clamp(25px,7vw,34px)">' + ayahWords(s, v[0]) + '</div>' + trans(s, v[0]) + '</div>';
    }).join('');
    var searchLabel = L(['Find a sūrah', 'ابحث عن سورة']);
    var jump = su.v.length > 12 ? '<div class="surah-jump"><label for="surah-jump">' + esc(L(['Jump to an āyah', 'انتقل إلى آية'])) +
      '</label><select class="tin" id="surah-jump"><option value="">' + esc(L(['Choose an āyah', 'اختر آية'])) + '</option>' +
      su.v.map(function (v) { return '<option value="' + v[0] + '">' + A.num(v[0]) + '</option>'; }).join('') + '</select></div>' : '';
    function indexRows() {
      var finished = Hifz.state().finished || [];
      return Object.keys(Q.q).map(Number).sort(function (a, b) { return a - b; }).map(function (n) {
        var verseCount = Q.q[n].v.length, known = Hifz.known(n), done = finished.indexOf(n) >= 0 || (known.of && known.n >= known.of);
        return '<a class="surah-index-link" href="#/surah/' + n + '"' + (n === s ? ' aria-current="page"' : '') +
          ' data-surah="' + n + '"><span class="surah-index-num">' + A.num(n) + '</span><span class="grow"><b>' + esc(SN(n)) +
          '</b><small>' + A.num(verseCount) + ' ' + esc(L(['āyāt', 'آيات'])) + '</small></span>' +
          (done ? '<span aria-label="' + esc(L(['Finished', 'مكتملة'])) + '">' + A.icon('check', 18) + '</span>' : '') + '</a>';
      }).join('');
    }
    function searchKey(value) {
      return value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[ʾʿ’'\-\sـ]/g, '')
        .replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); });
    }
    function stText() { return A.N.has() && Voice.surahCoverage ? coverageLabel(Voice.surahCoverage(s, Voice.stats())) : ''; }
    return {
      hue: 'emerald',
      html: '<div class="surah-ws h-emerald"><aside class="surah-index card"><label for="surah-search">' + esc(searchLabel) +
        '</label><input class="tin" type="search" id="surah-search"><nav class="surah-index-list" aria-label="' + esc(L(['Sūrah index', 'فهرس السور'])) +
        '">' + indexRows() + '</nav><small class="surah-empty" hidden>' + esc(L(['No sūrahs found.', 'لم يُعثر على سور.'])) + '</small></aside><div class="surah-reader"><div class="ph h-emerald"><a class="backp" href="#/room/quran">' + A.icon('back', 18) + '<span>' + esc(T('Qurʾān')) + '</span></a><h1>' + esc(SN(s)) + '</h1>' + (A.ar() ? '' : '<p lang="ar" style="font-family:var(--f-ar);font-size:24px">' + su.ar + '</p>') + (A.N.has() ? '<p class="qa-surah-st" id="qa-surah-st" role="status" aria-live="polite">' + esc(stText()) + '</p>' : '') + '</div>' + jump + '<div class="surah-reading">' + (s !== 1 && s !== 9 ? '<div class="bsm" style="margin:12px 0">' + Q.bsm + '</div>' : '') + rows + '</div><div class="surah-bar"><button class="btn sm sec" id="s-rec">' + esc(A.S.reciter === 'h' ? T('Teaching pace') : T('Flowing')) + '</button><button class="round" id="s-play" style="width:48px;height:48px" aria-label="' + esc(T('Listen')) + '">' + A.icon('play', 24) + '</button>' + (A.N.has() ? '<button class="btn sm ghost" data-a="hf-keep" data-s="' + s + '">' + A.icon('download', 16) + '<span>' + esc(L(['Download', 'تنزيل'])) + '</span></button>' : '<span style="width:48px"></span>') + '</div></div></div>',
      mount: function (v) {
        $$('.tx-v', v).forEach(function (row) { bindWords(row, s, +row.dataset.a2); });
        var search = $('#surah-search', v), index = $('.surah-index-list', v);
        function filter() {
          var query = searchKey(search.value), isNumber = /^\d+$/.test(query), hasMatch = false;
          $$('[data-surah]', index).forEach(function (link) {
            var n = link.dataset.surah, q = Q.q[n];
            link.hidden = query !== '' && (isNumber ? +n !== +query :
              !searchKey(q.name).includes(query) && !searchKey(q.ar).includes(query));
            if (!link.hidden) hasMatch = true;
          });
          $('.surah-empty', v).hidden = hasMatch;
        }
        function centerActive() {
          var current = $('[aria-current="page"]', index);
          if (!search.value && current) index.scrollTop = current.offsetTop - index.offsetTop - (index.clientHeight - current.offsetHeight) / 2;
        }
        var loading = false;
        function prepareIndex() {
          if (!wide.matches) return;
          centerActive();
          if (Q.all || loading) return;
          loading = true;
          A.quranAll(function () {
            loading = false;
            if (!v.isConnected) return;
            index.innerHTML = indexRows();
            filter(); centerActive();
          });
        }
        search.oninput = filter;
        if (window.matchMedia) {
          wide = matchMedia('(min-width: 960px)');
          if (wide.addEventListener) {
            wide.addEventListener('change', prepareIndex);
            removeWide = function () { wide.removeEventListener('change', prepareIndex); };
          }
          prepareIndex();
        }
        var jumpTo = $('#surah-jump', v);
        if (jumpTo) jumpTo.onchange = function () {
          if (!jumpTo.value) return;
          var ayah = +jumpTo.value;
          jumpTo.value = '';
          var i = su.v.findIndex(function (verse) { return verse[0] === ayah; });
          if (i < 0) return;
          cur = i;
          if (playing) { Voice.stop(); go(); return; }
          var row = $('.tx-v[data-a2="' + ayah + '"]', v);
          if (row && row.scrollIntoView) row.scrollIntoView({ block: 'start', behavior: A.reduced() ? 'auto' : 'smooth' });
        };
        var pb = $('#s-play', v), stEl = $('#qa-surah-st', v);
        function refreshSt(msg) { if (stEl) stEl.textContent = msg || stText(); }
        if (A.N.has() && Voice.onKeep) {
          unsubKeep = Voice.onKeep(function (done, total, bad, tag) {
            if (!v.isConnected) return;
            if (tag === 's:' + s) refreshSt(done >= total ? (bad ? L(['Downloaded with ' + bad + ' missing', 'تعذّر تنزيل ' + A.num(bad)]) : stText()) : L(['Downloading… ', 'جارٍ التنزيل… ']) + A.num(done) + ' / ' + A.num(total));
            else if (done >= total) refreshSt();
          });
        }
        function mark(i) { $$('.tx-v .quran .w', v).forEach(function (w) { w.classList.remove('on'); }); var r = $$('.tx-v', v)[i]; if (r) { $$('.w', r).forEach(function (w) { w.classList.add('on'); }); r.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }
        function setPlayUi(on) { pb.innerHTML = A.icon(on ? 'pause' : 'play', 24); pb.setAttribute('aria-label', on ? L(['Pause', 'إيقاف مؤقت']) : T('Listen')); }
        function go() {
          if (cur >= su.v.length) { playing = false; cur = 0; setPlayUi(false); mark(-1); return; }
          mark(cur);
          var run = ++playRun;
          Voice.ayah(s, su.v[cur][0]).then(function (ok) { if (!playing || run !== playRun) return; if (ok) { cur++; go(); } else { playing = false; setPlayUi(false); } });
        }
        pb.onclick = function () { playing = !playing; setPlayUi(playing); if (playing) go(); else Voice.stop(); };
        $('#s-rec', v).onclick = function () { A.S.reciter = A.S.reciter === 'h' ? 'a' : 'h'; A.save(); this.textContent = A.S.reciter === 'h' ? T('Teaching pace') : T('Flowing'); refreshSt(); if (playing) { Voice.stop(); playing = true; go(); } };
      },
      unmount: function () { playing = false; if (removeWide) removeWide(); Voice.stop(); if (unsubKeep) { unsubKeep(); unsubKeep = null; } }
    };
  };
})();
