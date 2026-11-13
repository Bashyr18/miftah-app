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
    do: ['With your body', 'بجسمك'], watch: ['Watch', 'شاهد'], solo: ['On your own', 'وحدك'], make: ['Make it', 'اصنع'], review: ['Polish your keys', 'لمّع مفاتيحك'], key: ['Your key', 'مفتاحك']
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
    add('make', sk.make);
    if (window.Media) add('watch', Media.steps(sk, 'after'));
    return steps;
  };

  var PH3 = { recall: ['Recall', 'تذكّر'], meet: ['Learn', 'تعلّم'], name: ['Terms', 'مصطلحات'], try: ['Worked', 'مثال محلول'], do: ['Practical', 'عملي'], watch: ['Watch', 'شاهد'], solo: ['Practice', 'تدريب'], make: ['Apply', 'تطبيق'], review: ['Review', 'مراجعة'] };
  function stepKinds(steps) { var seen = [], order = ['recall', 'watch', 'meet', 'name', 'try', 'do', 'solo', 'make']; order.forEach(function (o) { if (steps.some(function (s) { return s.ph === o; })) seen.push(o); }); return seen; }

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
    var at = o.at && o.at.i < o.steps.length ? o.at : null;
    run = { o: o, i: at ? at.i : 0, phases: stepKinds(o.steps), solo: at ? at.solo : 0, soloOk: at ? at.soloOk : 0, tries: 0, hinted: false, started: Date.now(), last: Date.now(), wrong: [], retried: false, retries: [] };
    if (o.mode === 'review') run.phases = ['review'];
    host.innerHTML = '<div class="pl h-' + (o.hue || 'gold') + (o.quiet ? ' quiet' : '') + '">' +
      '<div class="pl-top"><button class="pl-x" data-a="pl-exit" aria-label="' + esc(T('Leave')) + '">' + A.icon('close', 24) + '</button><div class="pl-bar"></div><button class="pl-sp" data-a="pl-say" aria-label="' + esc(T('Hear it again')) + '">' + A.icon('speak', 26) + '</button></div>' +
      '<div class="pl-head"><div class="pl-ph"></div><div class="pl-prompt"></div></div><div class="pl-body"></div><div class="pl-msg"></div><div class="pl-foot"></div></div>';
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

  function show() {
    var r = run, s = r.o.steps[r.i];
    if (!s) return finish();
    s = r.o.steps[r.i] = Voice.adapt(s);
    r.step = s; r.tries = 0; r.hinted = false; r.answered = false;
    /* the place is kept from the second step on: leaving never loses it */
    if (r.o.track) { var dd = A.D(); dd.resume = r.i > 0 ? Object.assign({}, r.o.track, { i: r.i, solo: r.solo, soloOk: r.soloOk, t: A.now().getTime() }) : null; A.save(); }
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
    if (s.gu) { var gub = document.createElement('button'); gub.className = 'gu'; gub.dataset.a = 'gu-show'; gub.dataset.w = s.gu; gub.textContent = L(['Grown-up: tap to see the word to say', 'للكبير: انقر لترى الكلمة']); var gh = $('.pl-body', r.host); if (gh) gh.insertBefore(gub, gh.firstChild); }
    var spb = $('.pl-sp', r.host); if (spb) { var spT = s.speakAr || (s.speak ? L(s.speak) : L(s.p)); spb.style.visibility = Voice.can(spT, { key: s.vk }) ? 'visible' : 'hidden'; }
    if (window.Aids) Aids.after(r, foot);
    if (s.hint && !s.noHelp && r.st < 2) { var h = document.createElement('button'); h.className = 'pl-help'; h.dataset.a = 'pl-help'; h.innerHTML = A.icon('help', 22) + '<span>' + esc(T('Help me')) + '</span>'; foot.appendChild(h); }
    if (!s.silent && (r.st <= 1 || s.autoSay)) setTimeout(function () { if (run === r && r.step === s) sayStep(s); }, 240);
  }

  function hint() {
    var r = run, s = r.step; if (!s) return;
    r.hinted = true;
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
    opts = opts || {};
    r.answered = true;
    log(true);
    /* unaided means right first time. The youngest get one gentle second go. */
    if (s_isSolo(r.step)) { r.solo++; if (!r.hinted && r.tries <= (r.st <= 1 ? 1 : 0)) r.soloOk++; }
    Fx.ok();
    if (!r.o.quiet) Fx.bloomAt(x || $('.step-in', r.host), getHue(r), false);
    var delay = opts.delay != null ? opts.delay : (r.st >= 3 ? 420 : r.st === 2 ? 700 : 950);
    if (opts.note || r.step.after) { var n = opts.note || r.step.after; note(n, true); delay = 0; showNext(); return; }
    setTimeout(function () { if (run === r && r.answered && r.step) advance(); }, delay);
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
    if (why && r.tries < 3) { note(why, true); if (r.tries === 2 && s.hint) hint(); r.hinted = r.hinted || r.tries === 2; }
    else if (r.tries === 1) { note(COAX[0], false); if (r.st < 2) Voice.say(L(COAX[0]), { lang: A.ar() ? 'ar' : 'en' }); }
    else if (r.tries === 2) { if (s.hint) hint(); else { note(COAX[1], false); if (r.st < 2) Voice.say(L(COAX[1]), { lang: A.ar() ? 'ar' : 'en' }); } r.hinted = true; }
    else {
      /* show it, kindly, and try a fresh one later */
      r.answered = true;
      if (s_isSolo(s)) { r.solo++; }
      if (r.reveal) r.reveal();
      if (s.workS && window.Teach) { var oldH = $('.pl-hint', r.host); if (oldH) oldH.remove(); Teach.reveal(r.ctx, s); note(['Here is the working. Read it, then carry on.', 'هذا هو الحل. اقرأه ثم تابع.'], true); showNext(); return; }
      note(s.show || ['Here it is. We will see it again soon.', 'هذا هو. سنراه مرة أخرى قريبًا.'], true);
      if (window.Aids) { var whyH = Aids.why(r); if (whyH) $('.pl-msg', r.host).insertAdjacentHTML('beforeend', whyH); }
      showNext();
    }
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
    var r = run, o = r.o, res = { solo: r.solo, soloOk: r.soloOk, passed: r.solo === 0 || r.soloOk / r.solo >= (r.st >= 2 ? .75 : .66) };
    if (r.cleanup) { try { r.cleanup(); } catch (e) { } }
    var host = r.host; run = null;
    if (o.track) { A.D().resume = null; A.save(); }
    if (o.onDone) o.onDone(res, host);
  }
})();
