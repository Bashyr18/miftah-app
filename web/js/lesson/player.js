/* The lesson player. Every lesson, in every room, runs one rhythm, so a child's attention goes to the idea and not the interface:
   remember, meet, name it, try together, on your own, make it, then the key. The key at the top forms tooth by tooth as they go.
   Wrong answers teach: first a calmer look, then a hint (which marks the work as assisted), then the answer shown and tried later.
   A key is only forged by unaided work. Nothing here shows a score. */
(function () {
  'use strict';
  var A = window.A, $ = A.$, esc = A.esc, L = A.L, T = A.T;
  var Player = window.Player = {};
  var PH = {
    recall: ['Remember', 'تذكّر'], meet: ['Meet', 'تعرّف'], name: ['Name it', 'سمِّها'], try: ['Try together', 'جرّب معنا'],
    do: ['With your body', 'بجسمك'], watch: ['Watch', 'شاهد'], solo: ['On your own', 'وحدك'], stretch: ['Stretch', 'تحدٍّ'], make: ['Make it', 'اصنع'], review: ['Polish your keys', 'لمّع مفاتيحك'], key: ['Your key', 'مفتاحك']
  };
  Player.PH = PH;
  var KIND = { choice: 'recognition', sort: 'recognition', match: 'recognition', order: 'recall', pad: 'recall', plate: 'recall', line: 'recall', clock: 'recall', tenframe: 'production', bond: 'production', blocks: 'production', array: 'production', frac: 'production', share: 'production', trace: 'production', build: 'production', sentence: 'recall', root: 'recall', mission: 'exposure', predict: 'exposure', phon: 'recall', pick: 'recognition' };
  var I = window.I = {};  /* instruments register here */

  var run = null;
  /* expand a skill into its ordered steps */
  Player.compose = function (sk, rng) {
    var steps = [];
    function add(ph, list) {
      if (!list) return;
      var arr = typeof list === 'function' ? list(rng) : list;
      (Array.isArray(arr) ? arr : [arr]).forEach(function (s) { if (s) steps.push(Object.assign({}, s, { ph: ph })); });
    }
    /* retrieval first: one quick recall from what this builds on */
    var pre = (sk.needs || []).map(C.skill).filter(function (x) { return x && x.review && M.met(x.id); });
    if (pre.length && !sk.noRecall) add('recall', pre[pre.length - 1].review(rng));
    /* a parent's own videos for this lesson come in where they chose */
    if (window.Media) add('watch', Media.steps(sk, 'before'));
    add('meet', sk.meet); add('name', sk.name); add('try', sk.guided);
    /* then the body: young children always, older ones in about half their lessons */
    var bd = window.Flow && !sk.quiet ? Flow.bodyFor(sk) : null;
    if (bd && (A.stage() <= 1 || sk.id.length % 2 === 0)) add('do', { k: 'body', p: ['Now with your body', 'والآن بجسمك'], art: bd.art, t: bd.t, adult: bd.adult, silent: false, speak: bd.t });
    var n = sk.soloN || 3;
    if (sk.solo) {
      if (typeof sk.solo === 'function') {
        var seenQ = {}, sig = function (x) { var a0 = Array.isArray(x) ? x[0] : x; return a0 ? JSON.stringify([a0.p, a0.eq, a0.a, a0.html]) : ''; };
        for (var i = 0; i < n; i++) { var got = null; for (var tr = 0; tr < 8; tr++) { var q0 = sk.solo(rng, i), g0 = sig(q0); if (!seenQ[g0]) { seenQ[g0] = 1; got = q0; break; } } if (got) add('solo', got); }
      }
      else add('solo', sk.solo);
    }
    /* from eight, one lucky guess is not mastery: draw on the lesson's review for at least three different questions */
    if (A.stage() >= 2 && sk.review) {
      var sigOf = function (x) { return JSON.stringify([x.p, x.eq, x.a]); }, soloSeen = {}, soloN = 0;
      steps.forEach(function (x) { if (x.ph === 'solo') { soloSeen[sigOf(x)] = 1; soloN++; } });
      for (var more = 0; more < 10 && soloN < 3; more++) { var q1 = sk.review(rng), q2 = Array.isArray(q1) ? q1[0] : q1; if (q2 && q2.k !== 'say' && !soloSeen[sigOf(q2)]) { soloSeen[sigOf(q2)] = 1; soloN++; steps.push(Object.assign({}, q2, { ph: 'solo' })); } }
    }
    /* deeper teaching for lessons not yet written in full (the taught lessons have their own pages): from the lesson's own
       questions and hints, one solved in front of the child before they try, and one answer to check (spotting a mistake
       is understanding, not recall). Not in the Qurʾān or Living Islam. */
    if (!sk.teach && DEEP[sk.room] && sk.review && A.stage() >= 1) {
      var wk = worked(sk, rng); if (wk) { var at = steps.findIndex(function (x) { return x.ph === 'try' || x.ph === 'do' || x.ph === 'solo'; }); if (at < 0) steps.push(wk); else steps.splice(at, 0, wk); }
      var jd = judge(sk, rng); if (jd) steps.push(Object.assign(jd, { ph: 'solo' }));
    }
    add('make', sk.make);
    if (window.Media) add('watch', Media.steps(sk, 'after'));
    return steps;
  };

  var DEEP = { math: 1, english: 1, science: 1, world: 1, think: 1, computing: 1, engineering: 1 };
  function one(sk, rng) { for (var i = 0; i < 6; i++) { var q = sk.review(rng); q = Array.isArray(q) ? q[0] : q; if (q && (q.k === 'pad' || q.k === 'choice')) return q; } return null; }
  function rightOf(q) { if (q.k === 'pad') return { t: [String(q.a), A.num ? String(q.a).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; }) : String(q.a)] }; var o = (q.o || []).filter(function (x) { return x.ok; })[0]; return o && o.t != null && !o.art ? o : null; }
  /* the question as the child would read it: a sum on its own, or the words of the question */
  function askOf(q, fill) {
    if (q.k === 'pad' && q.eq && q.eq !== '?' && /[0-9]/.test(q.eq)) { var e = q.eq.indexOf('?') < 0 ? q.eq + ' = ?' : q.eq; return (q.q ? L(q.q) + ' · ' : '') + (fill != null ? e.replace('?', fill) : e); }
    return [q.q ? L(q.q) : '', L(q.p)].filter(Boolean).join(' · ');
  }
  /* "I do": the question answered, with the reason, before the child tries */
  function worked(sk, rng) {
    var q = one(sk, rng); if (!q || q.html || q.qHtml || q.qArt) return null; var ok = rightOf(q); if (!ok) return null;
    var why = q.hint ? L(q.hint) : '';
    return { k: 'say', ph: 'try', lab: ['Watch it done', 'شاهد الحل'], p: ['Watch: here is one done for you.', 'شاهد: هذا واحد محلول لك.'],
      html: '<div class="wk">' + (q.k === 'pad' && /[0-9]/.test(q.eq || '') ? '<p class="wk-a">' + A.icon('check', 20) + '<b>' + esc(A.num(askOf(q, q.a))) + '</b></p>' : '<p class="wk-q">' + esc(A.num(askOf(q))) + '</p><p class="wk-a">' + A.icon('check', 20) + '<b>' + esc(A.num(L(ok.t))) + '</b></p>') + (why ? '<p class="wk-w">' + esc(why) + '</p>' : '') + '</div>' };
  }
  /* "check the work": someone answered; were they right? Half the time they were, so guessing does not pay */
  var WHO = [['Sami', 'سامي'], ['Huda', 'هدى'], ['Bilal', 'بلال'], ['Maryam', 'مريم']];
  function judge(sk, rng) {
    var q = one(sk, rng); if (!q || q.html || q.qHtml || q.qArt) return null; var ok = rightOf(q); if (!ok) return null;
    var claim = ok, isRight = rng.bool(), who = rng.pick(WHO);
    if (!isRight) {
      if (q.k === 'pad') { var n = +q.a; if (!isFinite(n)) return null; var off = rng.pick([-2, -1, 1, 2, 10, -10].filter(function (d) { return n + d >= 0 && Math.abs(d) < Math.max(3, Math.abs(n)); })); if (off == null) return null; claim = { t: [String(n + off), String(n + off).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; })] }; }
      else { var wr = (q.o || []).filter(function (x) { return !x.ok && x.t != null && !x.art; }); if (!wr.length) return null; claim = rng.pick(wr); }
    }
    var A2 = [{ t: ['Yes, that is right', 'نعم، صحيح'], ok: isRight, e: q.err || 'understanding' }, { t: ['No, that is wrong', 'لا، خطأ'], ok: !isRight, e: q.err || 'understanding' }];
    return { k: 'choice', lab: ['Check the work', 'تحقّق من الحل'], p: [who[0] + ' answered this. Is ' + who[0] + ' right?', 'أجاب ' + who[1] + ' هكذا. هل هو مصيب؟'],
      qHtml: '<div class="wk">' + (q.k === 'pad' && /[0-9]/.test(q.eq || '') ? '<p class="wk-c">' + esc(L(who)) + ':</p><p class="wk-s">' + esc(A.num(askOf(q, (Array.isArray(claim.t) ? claim.t[0] : claim.t)))) + '</p>' : '<p class="wk-q">' + esc(A.num(askOf(q))) + '</p><p class="wk-c">' + esc(L(who)) + ': <b>' + esc(A.num(L(claim.t))) + '</b></p>') + '</div>', o: A2, shuffle: false, cols: 1, err: q.err || 'understanding',
      hint: ['Work it out yourself first, then compare.', 'حُلّها بنفسك أولًا ثم قارن.'] };
  }
  /* "why": the right reason, from the lesson's own hint, among reasons from other lessons in the same room */
  function explain(sk, rng) {
    var q = one(sk, rng); if (!q || !q.hint || q.html || q.qHtml || q.qArt) return null; var ok = rightOf(q); if (!ok) return null;
    var others = [], room = C.rooms[sk.room];
    for (var t = 0; t < 30 && others.length < 2; t++) { var u = rng.pick(room.units), o = u && u.skills.length ? rng.pick(u.skills) : null; if (!o || o === sk || !o.review) continue; var x = o.review(rng); x = Array.isArray(x) ? x[0] : x; if (x && x.hint && L(x.hint) !== L(q.hint) && others.every(function (y) { return L(y) !== L(x.hint); })) others.push(x.hint); }
    if (others.length < 2) return null;
    var en = Array.isArray(ok.t) ? ok.t[0] : ok.t, arT = Array.isArray(ok.t) ? (ok.t[1] || ok.t[0]) : ok.t;
    return { k: 'choice', lab: ['Why?', 'لماذا؟'], p: ['The answer is ' + en + '. Which reason shows why?', 'الجواب ' + arT + '. أيّ سبب يبيّن ذلك؟'],
      q: q.q || q.p, o: rng.shuffle([{ t: q.hint, ok: true }].concat(others.map(function (h) { return { t: h, e: 'understanding' }; }))), shuffle: false, cols: 1, err: 'understanding' };
  }
  var PH3 = { recall: ['Recall', 'تذكّر'], meet: ['Learn', 'تعلّم'], name: ['Terms', 'مصطلحات'], try: ['Worked', 'مثال محلول'], do: ['Practical', 'عملي'], watch: ['Watch', 'شاهد'], solo: ['Practice', 'تدريب'], stretch: ['Stretch', 'تحدٍّ'], make: ['Apply', 'تطبيق'], review: ['Review', 'مراجعة'] };
  function stepKinds(steps) { var seen = [], order = ['recall', 'watch', 'meet', 'name', 'try', 'do', 'solo', 'stretch', 'make']; order.forEach(function (o) { if (steps.some(function (s) { return s.ph === o; })) seen.push(o); }); return seen; }

  /* the key that forms at the top: one tooth per phase */
  function keyBar(phases, curPh, frac, hue) {
    var teeth = phases.map(function (p, i) {
      var on = phases.indexOf(curPh) > i ? 1 : phases.indexOf(curPh) === i ? frac : 0;
      return '<span class="tooth' + (on >= 1 ? ' full' : on > 0 ? ' part' : '') + '"><i style="width:' + Math.round(on * 100) + '%"></i></span>';
    }).join('');
    return '<div class="keybar" role="progressbar" aria-valuenow="' + Math.round((phases.indexOf(curPh) + frac) / phases.length * 100) + '" aria-valuemin="0" aria-valuemax="100"><span class="keybar-bow">' + (A.hasImg('key-front-s') ? '<img src="' + A.imgUrl('key-front-s') + '" alt="">' : A.art('key', 34)) + '</span><span class="keybar-shaft">' + teeth + '</span></div>';
  }

  Player.start = function (host, o) {
    /* o: {steps, skill, mode, hue, title, onDone, onExit} */
    var st = A.stage();
    var at = o.at && Number.isInteger(o.at.i) && o.at.i >= 0 && o.at.i <= o.steps.length ? o.at : null;
    run = { o: o, at: at, i: at ? at.i : 0, phases: stepKinds(o.steps), solo: at ? at.solo || 0 : 0, soloOk: at ? at.soloOk || 0 : 0, stN: at && at.stN, stOk: at && at.stOk, tries: 0, hinted: false, started: Date.now(), last: Date.now(), wrong: [], retried: false, retries: [] };
    if (o.mode === 'review') run.phases = ['review'];
    host.innerHTML = '<div class="pl h-' + (o.hue || 'gold') + (o.quiet ? ' quiet' : '') + '">' +
      '<div class="pl-top"><button class="pl-x" data-a="pl-exit" aria-label="' + esc(T('Leave')) + '">' + A.icon('close', 24) + '</button><div class="pl-bar"></div><button class="pl-sp" data-a="pl-say" aria-label="' + esc(T('Hear it again')) + '">' + A.icon('speak', 26) + '</button></div>' +
      '<div class="pl-head"><div class="pl-ph"></div><div class="pl-prompt"></div></div><div class="pl-body"></div><div class="pl-msg" aria-live="polite" aria-atomic="true"></div><div class="pl-foot"></div></div>';
    run.host = host; run.st = st;
    show();
  };
  /* the clock ran out: what was not reached counts as not done */
  Player.finishNow = function () { if (!run) return; var r = run, left = r.o.steps.length - r.i - (r.answered ? 1 : 0); r.solo += Math.max(0, left); finish(); };
  Player.cur = function () { return run && run.step; };
  Player.stop = function () { if (run && run.cleanup) { try { run.cleanup(); } catch (e) { } } run = null; };
  A.acts['gu-show'] = function (t) { A.toast(t.dataset.w); };
  A.acts['pl-say'] = function () { if (run && run.step) sayStep(run.step); };
  A.acts['pl-exit'] = function () { if (!run) return; Voice.stop(); var o = run.o; Player.stop(); if (o.onExit) o.onExit(); };
  A.acts['pl-help'] = function () { if (run) hint(); };
  A.acts['pl-next'] = function () { if (run) advance(); };

  function sayStep(s) {
    var txt = s.speak ? L(s.speak) : L(s.p);
    if (s.speakAr) { Voice.say(s.speakAr, { lang: 'ar', key: s.vk }); return; }
    if (txt) Voice.say(txt, { lang: A.ar() ? 'ar' : (s.lang || 'en'), key: s.vk });
  }

  function savePlace(r) {
    if (!r.o.track) return;
    var i = r.i + (r.answered ? 1 : 0);
    A.D().resume = i || r.tries || r.hinted ? Object.assign({}, r.o.track, {
      i: i, solo: r.solo, soloOk: r.soloOk, stN: r.stN, stOk: r.stOk,
      tries: r.answered ? 0 : r.tries, hinted: !r.answered && r.hinted, t: A.now().getTime()
    }) : null;
    A.save();
  }

  function show() {
    var r = run, s = r.o.steps[r.i];
    if (!s) return finish();
    s = r.o.steps[r.i] = Voice.adapt(s);
    r.step = s; r.tries = r.at ? r.at.tries || 0 : 0; r.hinted = !!(r.at && r.at.hinted); r.answered = false;
    r.at = null;
    savePlace(r);
    if (r.cleanup) { try { r.cleanup(); } catch (e) { } r.cleanup = null; }
    var ph = r.o.mode === 'review' ? 'review' : s.ph;
    var same = r.o.steps.filter(function (x) { return (r.o.mode === 'review') || x.ph === s.ph; });
    var pos = same.indexOf(s);
    $('.pl-bar', r.host).innerHTML = r.st >= 3 ? '<div class="pbar" role="progressbar" aria-valuenow="' + r.i + '" aria-valuemax="' + r.o.steps.length + '"><i style="width:' + Math.round(r.i / r.o.steps.length * 100) + '%"></i></div>' : keyBar(r.phases, ph, (pos) / Math.max(1, same.length), r.o.hue);
    var phEl = $('.pl-ph', r.host);
    phEl.innerHTML = '<span>' + esc(L(r.o.label || s.lab || (r.st >= 3 && PH3[ph]) || PH[ph] || ['', ''])) + '</span>' + (r.st >= 3 && (r.o.mode === 'review' || ph === 'solo' || (ph === 'meet' && same.length > 1)) ? '<em>' + A.num(pos + 1) + ' / ' + A.num(same.length) + '</em>' : '');
    var body = $('.pl-body', r.host), foot = $('.pl-foot', r.host);
    body.innerHTML = '';
    foot.innerHTML = '';
    var box = document.createElement('div'); box.className = 'step st-' + s.k;
    var pr = $('.pl-prompt', r.host), msg = $('.pl-msg', r.host);
    var promptNow = window.Aids && Aids.silent(s) ? ['A grown-up says this sound. Then say it together.', 'يقول الكبير هذا الصوت، ثم قولاه معًا.'] : s.p;
    pr.innerHTML = promptNow && !s.noPrompt && r.st !== 0 ? '<div class="pl-p">' + esc(L(promptNow)) + '</div>' : '';
    if (!A.reduced() && pr.firstChild) pr.firstChild.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.16,1,.3,1)' });
    msg.innerHTML = '';
    var inner = document.createElement('div'); inner.className = 'step-in'; box.appendChild(inner);
    body.appendChild(box);
    if (!A.reduced()) box.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' });
    var ctx = {
      el: inner, step: s, rng: r.o.rng || A.rng(A.seed()), stage: r.st, hue: r.o.hue, phase: ph,
      ok: function (x, opts) { onOk(x, opts); }, bad: function (e, el, why) { onBad(e, el, why); },
      done: function () { showNext(); }, say: function (t, o) { return Voice.say(L(t), o || {}); },
      next: function () { advance(); }, setCleanup: function (f) { r.cleanup = f; }, showNext: showNext,
      foot: foot, skillId: r.o.skill || s.skill, logErr: function (e) { var rr = run; if (rr && (rr.o.skill || s.skill)) M.log(rr.o.skill || s.skill, { k: 'exposure', ok: false, a: true, e: e }); }
    };
    r.ctx = ctx;
    var fn = I[s.k];
    if (!fn) { inner.innerHTML = '<p>' + esc(s.k) + '</p>'; showNext(); return; }
    r.reveal = null;
    ctx.onReveal = function (f) { r.reveal = f; };
    fn(ctx);
    if (A.arWrap) { A.arWrap(inner); A.arWrap(pr); }
    if (s.gu) { var gub = document.createElement('button'); gub.className = 'gu'; gub.dataset.a = 'gu-show'; gub.dataset.w = s.gu; gub.textContent = L(['Grown-up: tap to see the word to say', 'للكبير: انقر لترى الكلمة']); /* under the answers, inside the step: placed in the lesson body it stood beside them as a tall empty panel */ box.appendChild(gub); }
    var spb = $('.pl-sp', r.host); if (spb) { var spT = s.speakAr || (s.speak ? L(s.speak) : L(s.p)); spb.style.visibility = Voice.can(spT, { key: s.vk }) ? 'visible' : 'hidden'; }
    if (window.Aids) Aids.after(r, foot);
    if (s.hint && !s.noHelp && r.st < 2) { var h = document.createElement('button'); h.className = 'pl-help'; h.dataset.a = 'pl-help'; h.innerHTML = A.icon('help', 22) + '<span>' + esc(T('Help me')) + '</span>'; foot.appendChild(h); }
    if (!s.silent && (r.st <= 1 || s.autoSay)) setTimeout(function () { if (run === r && r.step === s) sayStep(s); }, 240);
  }

  function hint() {
    var r = run, s = r.step; if (!s) return;
    r.hinted = true;
    savePlace(r);
    if (r.st >= 2 && window.Aids && Aids.generic(s.hint)) { var wh = Aids.why(r); if (wh) { $('.pl-msg', r.host).innerHTML = wh; return; } }
    var box = $('.pl-hint', r.host);
    if (!box) { box = document.createElement('div'); box.className = 'pl-hint'; $('.pl-msg', r.host).appendChild(box); }
    box.innerHTML = '<span class="pl-hint-i">' + A.art('lantern', 34) + '</span><span>' + esc(L(s.hint)) + '</span>';
    Voice.say(L(s.hint), { lang: A.ar() ? 'ar' : 'en' });
    if (s.onHint && r.ctx) s.onHint(r.ctx);
  }

  function log(ok, e) {
    var r = run, s = r.step, sk = r.o.skill || s.skill;
    if (!sk) return;
    var kind = s.ev || KIND[s.k] || 'recognition';
    var now = Date.now(), ms = now - r.last; r.last = now;
    /* right after a miss is helped: the feedback taught it. And a review counts its first attempt only. */
    var first = ok ? r.tries === 0 : r.tries <= 1;
    M.log(sk, { k: kind, ok: ok, a: r.hinted || s.ph === 'try' || (ok && r.tries > 0), e: e, ms: ms, rv: r.o.mode === 'review' && first });
  }

  function onOk(x, opts) {
    var r = run; if (!r || r.answered) return;
    var s = r.step;
    opts = opts || {};
    r.answered = true;
    log(true);
    /* unaided means right first time. The youngest get one gentle second go. */
    if (s_isSolo(r.step)) { r.solo++; if (!r.hinted && r.tries <= (r.st <= 1 ? 1 : 0)) r.soloOk++; }
    if (r.step.ph === 'stretch') { r.stN = (r.stN || 0) + 1; if (!r.hinted && r.tries === 0) r.stOk = (r.stOk || 0) + 1; }
    savePlace(r);
    Fx.ok();
    if (!r.o.quiet) Fx.bloomAt(x || $('.step-in', r.host), getHue(r), false);
    var delay = opts.delay != null ? opts.delay : (r.st >= 3 ? 420 : r.st === 2 ? 700 : 950);
    if (opts.note || r.step.after) { var n = opts.note || r.step.after; note(n, true); delay = 0; showNext(); return; }
    setTimeout(function () { if (run === r && r.answered && r.step === s) advance(); }, delay);
  }
  function s_isSolo(s) { return s.ph === 'solo' || s.ph === 'make'; }
  function getHue(r) { var el = $('.pl', r.host); return el ? getComputedStyle(el).getPropertyValue('--h2').trim() || '#d9b26f' : '#d9b26f'; }

  var COAX = [['Not yet. Look again.', 'ليس بعد. انظر مرة أخرى.'], ['Nearly. Try once more.', 'قريب. حاول مرة أخرى.']];
  function onBad(e, el, why) {
    var r = run; if (!r || r.answered) return;
    r.tries++;
    var s = r.step;
    /* an exam gives one attempt, no coaching and no giving away the answer */
    if (r.o.exam) { log(false, e || s.err); r.answered = true; if (s_isSolo(s)) r.solo++; Fx.soft(); setTimeout(function () { if (run === r && r.step === s) advance(); }, 280); return; }
    Fx.soft(); if (el) Fx.shake(el);
    log(false, e || s.err);
    if (r.tries >= 3) {
      /* Keep the missed mark when the learner leaves with the answer on screen. */
      r.answered = true;
      if (s_isSolo(s)) { r.solo++; }
      savePlace(r);
      if (r.reveal) r.reveal();
      if (s.workS && window.Teach) { var oldH = $('.pl-hint', r.host); if (oldH) oldH.remove(); Teach.reveal(r.ctx, s); note(['Here is the working. Read it, then carry on.', 'هذا هو الحل. اقرأه ثم تابع.'], true); showNext(); return; }
      note(s.show || ['Here it is. We will see it again soon.', 'هذا هو. سنراه مرة أخرى قريبًا.'], true);
      if (window.Aids) { var whyH = Aids.why(r); if (whyH) $('.pl-msg', r.host).insertAdjacentHTML('beforeend', whyH); }
      showNext();
      return;
    }
    if (r.tries === 2) r.hinted = true;
    if (why) { note(why, true); if (r.tries === 2 && s.hint) hint(); }
    else if (r.tries === 2 && s.hint) hint();
    else { var coax = COAX[r.tries - 1]; note(coax, false); if (r.st < 2) Voice.say(L(coax), { lang: A.ar() ? 'ar' : 'en' }); }
    savePlace(r);
  }
  function note(txt, keep) {
    var r = run; var n = $('.pl-note', r.host);
    if (!n) { n = document.createElement('div'); n.className = 'pl-note'; $('.pl-msg', r.host).appendChild(n); }
    n.textContent = L(txt); n.classList.remove('in'); void n.offsetWidth; n.classList.add('in');
    if (!keep) { clearTimeout(n._t); n._t = setTimeout(function () { n.classList.remove('in'); }, 2200); }
  }
  function showNext() {
    var r = run; if (!r) return; var f = $('.pl-foot', r.host);
    if ($('.pl-next', f)) return;
    var b = document.createElement('button'); b.className = 'pl-next btn pri big'; b.dataset.a = 'pl-next';
    b.innerHTML = '<span>' + esc(r.step.nextLabel ? L(r.step.nextLabel) : T('Next')) + '</span>' + A.icon('next', 24);
    f.appendChild(b);
    if (!A.reduced()) b.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 280 });
  }
  function advance() {
    var r = run; if (!r) return;
    Voice.stop();
    r.i++;
    show();
  }
  function finish() {
    var r = run, o = r.o, res = { solo: r.solo, soloOk: r.soloOk, passed: r.solo === 0 || r.soloOk / r.solo >= (r.st >= 2 ? .75 : .66), clean: r.solo > 0 && r.soloOk === r.solo, ms: Date.now() - r.started, stretch: r.stN || 0, stretchOk: r.stOk || 0 };
    if (r.cleanup) { try { r.cleanup(); } catch (e) { } }
    var host = r.host; run = null;
    if (o.track) { A.D().resume = null; A.save(); }
    if (o.onDone) o.onDone(res, host);
  }
})();
