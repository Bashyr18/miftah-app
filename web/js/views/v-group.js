/* Homeschool groups, with no server and no accounts: a parent shares to a WhatsApp or Telegram group they already belong to.
   Two things travel. A weekly card: a picture of what one child learned this week, with the name left off unless the parent chooses.
   A challenge pack: a tiny file naming a subject, a year and a seed. Every family's copy of Miftāḥ builds the same questions from it,
   so the children of the group do the same challenge, each at home, and parents can post a result card back. Nothing about a child
   ever leaves the phone except what a parent puts on a card, and sees, before sending. */
(function () {
  'use strict';
  var A = window.A, C = window.C, $ = A.$, $$ = A.$$, L = A.L, esc = A.esc, N = function (x) { return A.num(x); };
  var G = A.Group = {}, DAY = 864e5;

  /* ---------- what a week held ---------- */
  G.week = function (pid) {
    var d = A.D(pid), since = A.now().getTime() - 7 * DAY, seen = {}, list = [], ms = 0, sc = d.screen || {}, tm = d.time || {};
    (d.led || []).forEach(function (e) { if (e.k !== 'forge' || e.t < since) return; var sk = C.skill(e.s); if (!sk) return; var base = sk.part2 ? C.skill(sk.part2) : sk; if (!base || seen[base.id]) return; seen[base.id] = 1; list.push(base); });
    var now = A.now();
    for (var i = 0; i < 7; i++) { var k = A.day(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)); ms += (sc[k] || 0) + (tm[k] || 0); }
    var rooms = {}; list.forEach(function (s) { rooms[s.room] = (rooms[s.room] || 0) + 1; });
    return { list: list, mins: Math.round(ms / 60000), rooms: Object.keys(rooms).length };
  };
  function who(p, showName) { var y = A.stage(p) === 0 ? L(['Early years', 'الطفولة المبكرة']) : L(C.yearName(Flow.yearOf(p))); return showName ? p.name + ' · ' + y : L(['A learner in ', 'متعلم في ']) + y; }
  function range() { var o = { day: 'numeric', month: 'short' }, loc = A.ar() ? 'ar-u-nu-arab' : 'en', now = A.now(), a = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6).toLocaleDateString(loc, o), b = now.toLocaleDateString(loc, o); return A.num(a + ' – ' + b); }
  function hueOf(room) { var e = document.createElement('i'); e.className = 'h-' + ((C.rooms[room] || {}).hue || 'gold'); e.style.display = 'none'; document.body.appendChild(e); var v = getComputedStyle(e).getPropertyValue('--h2').trim() || '#d9b26f'; e.remove(); return v; }

  /* ---------- drawing a card ---------- */
  var W = 1080, H = 1350, GOLD = '#f1d59e', INK = '#f5f0e7', DIM = '#b9b3a6';
  function face(size, weight) { return (weight || 600) + ' ' + size + 'px ' + (A.ar() ? "'Plex Arabic','Quicksand',sans-serif" : "'Quicksand',sans-serif"); }
  function fontsReady() { if (!document.fonts || !document.fonts.load) return Promise.resolve(); return Promise.all([document.fonts.load(face(40, 700)), document.fonts.load(face(40, 600))]).catch(function () { }); }
  function frame(x) {
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1b2350'); g.addColorStop(1, '#07080d'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    var r = A.rng(7); x.fillStyle = 'rgba(255,255,255,.55)'; for (var i = 0; i < 70; i++) { var s = r() * 2.2 + .6; x.beginPath(); x.arc(r() * W, r() * H * .55, s, 0, 7); x.fill(); }
    x.strokeStyle = 'rgba(241,213,158,.55)'; x.lineWidth = 3; round(x, 40, 40, W - 80, H - 80, 36); x.stroke();
    x.textAlign = 'center'; x.direction = 'ltr'; x.fillStyle = GOLD; x.font = "400 52px 'Amiri',serif"; x.fillText('مِفْتَاح', W / 2, 140); x.font = "700 30px 'Quicksand',sans-serif"; x.fillText('MIFTĀḤ', W / 2, 185);
  }
  function round(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
  function text(x, s, X, Y, size, color, weight, align) { x.font = face(size, weight); x.fillStyle = color; x.direction = A.ar() ? 'rtl' : 'ltr'; x.textAlign = align || 'center'; x.fillText(s, X, Y); }
  function fit(x, s, max) { if (x.measureText(s).width <= max) return s; while (s.length > 1 && x.measureText(s + '…').width > max) s = s.slice(0, -1); return s + '…'; }
  function stat(x, X, Y, w, big, small) { x.fillStyle = 'rgba(255,255,255,.07)'; round(x, X, Y, w, 190, 28); x.fill(); x.strokeStyle = 'rgba(255,255,255,.14)'; x.lineWidth = 2; x.stroke(); text(x, big, X + w / 2, Y + 105, 86, INK, 700); text(x, small, X + w / 2, Y + 158, 30, DIM, 600); }
  function footer(x) { text(x, L(['Learned at home with Miftāḥ', 'تعلّم في البيت مع مفتاح']), W / 2, H - 92, 30, DIM, 600); }

  G.weekCanvas = function (pid, showName) {
    var p = A.profile(pid), wk = G.week(pid), c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d');
    frame(x);
    text(x, L(['This week', 'هذا الأسبوع']), W / 2, 300, 78, INK, 700);
    text(x, range(), W / 2, 356, 34, DIM, 600);
    text(x, who(p, showName), W / 2, 430, 40, GOLD, 700);
    var s1 = A.ar() ? 560 : 100, s2 = A.ar() ? 100 : 560;
    stat(x, s1, 490, 420, N(wk.list.length), L(['lessons mastered', 'دروس أُتقنت']));
    if (wk.mins >= 1) stat(x, s2, 490, 420, N(wk.mins), L(['minutes learning', 'دقيقة تعلّم'])); else stat(x, s2, 490, 420, N(wk.rooms), L(['subjects', 'مواد']));
    var y0 = 770, R = A.ar(), lx = R ? W - 120 : 120;
    if (!wk.list.length) text(x, L(['A gentle week. Learning carries on.', 'أسبوع هادئ، والتعلم مستمر.']), W / 2, y0 + 60, 36, DIM, 600);
    else {
      text(x, L(['Mastered', 'أُتقن'])  , lx, y0, 32, GOLD, 700, R ? 'right' : 'left');
      wk.list.slice(0, 5).forEach(function (sk, i) {
        var y = y0 + 70 + i * 66; x.fillStyle = hueOf(sk.room); x.beginPath(); x.arc(R ? W - 132 : 132, y - 11, 11, 0, 7); x.fill();
        x.font = face(36, 600); var t = fit(x, L(sk.title), 560); text(x, t, R ? W - 166 : 166, y, 36, INK, 600, R ? 'right' : 'left');
        text(x, L(C.rooms[sk.room].name), R ? 120 : W - 120, y, 28, DIM, 600, R ? 'left' : 'right');
      });
      if (wk.list.length > 5) text(x, L(['and ', 'و']) + N(wk.list.length - 5) + L([' more', ' غيرها']), W / 2, y0 + 70 + 5 * 66 + 8, 30, DIM, 600);
    }
    footer(x); return c;
  };
  G.resultCanvas = function (ch, pid, res, showName) {
    var p = A.profile(pid), R = C.rooms[ch.room], c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d');
    frame(x);
    text(x, L(['Group challenge', 'تحدي المجموعة']), W / 2, 300, 72, INK, 700);
    text(x, L(R.name) + ' · ' + L(C.yearName(ch.y)), W / 2, 360, 38, GOLD, 700);
    x.fillStyle = 'rgba(255,255,255,.07)'; round(x, 240, 450, 600, 380, 200); x.fill();
    text(x, N(res.ok) + ' / ' + N(res.n), W / 2, 690, 150, INK, 700);
    text(x, L(['right, first try, no hints', 'صحيحة من أول مرة بلا تلميح']), W / 2, 770, 32, DIM, 600);
    text(x, who(p, showName), W / 2, 920, 42, GOLD, 700);
    text(x, L(['Same questions for every child in the group', 'الأسئلة نفسها لكل أطفال المجموعة']), W / 2, 990, 30, DIM, 600);
    footer(x); return c;
  };

  /* ---------- sending ---------- */
  G.shareCanvas = function (canvas, caption, name) {
    var url = canvas.toDataURL('image/png');
    if (A.N.has()) { A.N.call('shareImage', url.split(',')[1], caption || '', name || 'Miftah-card.png'); return; }
    canvas.toBlob(function (b) {
      var f = window.File && new File([b], name || 'Miftah-card.png', { type: 'image/png' });
      if (f && navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], text: caption || '' }).catch(function () { }); return; }
      var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name || 'Miftah-card.png'; a.click();
    });
  };
  function preview(canvas, title, caption, name) {
    var img = canvas.toDataURL('image/png');
    A.sheet(title, '<div class="grp-prev"><img src="' + img + '" alt=""><p>' + esc(L(['This is exactly what the group will see.', 'هذا بالضبط ما ستراه المجموعة.'])) + '</p><button class="btn pri wide" id="grp-send">' + esc(L(['Share to my group', 'شارك مع مجموعتي'])) + '</button></div>', function (sh) {
      $('#grp-send', sh).onclick = function () { A.closeSheet(); G.shareCanvas(canvas, caption, name); };
    });
  }

  /* ---------- the weekly card ---------- */
  function pickChild(title, done) {
    var kids = A.S.profiles; if (kids.length === 1) { done(kids[0].id); return; }
    A.sheet(title, '<div class="lst">' + kids.map(function (p) { return '<button class="li" data-pid="' + p.id + '"><span class="grow"><b>' + esc(p.name) + '</b><small>' + esc(who(p, false)) + '</small></span>' + A.icon('next', 16) + '</button>'; }).join('') + '</div>', function (sh) {
      $$('[data-pid]', sh).forEach(function (b) { b.onclick = function () { A.closeSheet(); setTimeout(function () { done(b.dataset.pid); }, 220); }; });
    });
  }
  G.weekly = function () {
    pickChild(L(['Whose week?', 'أسبوع من؟']), function (pid) {
      var showName = !!A.S.cardNames;
      A.sheet(L(['Weekly card', 'بطاقة الأسبوع']), '<div class="grp-opt"><button class="li" id="grp-name"><span class="grow"><b>' + esc(L(['Show their first name', 'أظهر الاسم الأول'])) + '</b><small>' + esc(L(['Off: the card says only their year.', 'عند الإيقاف لا تذكر البطاقة إلا السنة الدراسية.'])) + '</small></span><span class="switch' + (showName ? ' on' : '') + '"></span></button><button class="btn pri wide" id="grp-make">' + esc(L(['Make the card', 'اصنع البطاقة'])) + '</button></div>', function (sh) {
        $('#grp-name', sh).onclick = function () { showName = !showName; A.S.cardNames = showName; A.saveNow(); $('.switch', sh).classList.toggle('on', showName); };
        $('#grp-make', sh).onclick = function () { A.closeSheet(); fontsReady().then(function () { setTimeout(function () { preview(G.weekCanvas(pid, showName), L(['Weekly card', 'بطاقة الأسبوع']), L(['Our week of learning, made with Miftāḥ.', 'أسبوع تعلّمنا، مع مفتاح.']), 'Miftah-week.png'); }, 220); }); };
      });
    });
  };

  /* ---------- challenge packs ---------- */
  /* the same pack gives the same questions on every phone: the skills are taken in a fixed order, then shuffled by the pack's seed */
  G.questions = function (ch, pid) {
    var R = C.rooms[ch.room], rng = A.rng(ch.seed), pool = [];
    if (!R) return [];
    R.units.forEach(function (u) { if (u.y === ch.y) u.skills.forEach(function (s) { if (s.review && !s.part2) pool.push(s); }); });
    pool.sort(function (a, b) { return a.id < b.id ? -1 : 1; });
    var list = rng.shuffle(pool), steps = [], seen = {};
    for (var t = 0; t < list.length * 2 && steps.length < ch.n; t++) {
      var sk = list[t % list.length], q = sk.review(rng), one = Array.isArray(q) ? q[0] : q, sig = one && JSON.stringify([one.p, one.eq, one.a]);
      if (one && !seen[sig]) { seen[sig] = 1; steps.push(Object.assign({}, one, { ph: 'solo', skill: sk.id, hint: null, noHelp: true })); }
    }
    return steps;
  };
  function years(room) { var ys = {}; C.rooms[room].units.forEach(function (u) { if (u.skills.some(function (s) { return s.review; })) ys[u.y] = 1; }); return Object.keys(ys).map(Number).sort(function (a, b) { return a - b; }); }
  G.make = function () {
    var room = 'math', y = Math.max(1, Math.min.apply(null, A.S.profiles.map(function (p) { return Flow.yearOf(p) || 1; }).concat([5])));
    function paint(sh) {
      var ys = years(room); if (ys.indexOf(y) < 0) y = ys[0];
      $('#grp-rooms', sh).innerHTML = C.order.filter(function (r) { return r !== 'quran' && years(r).length; }).map(function (r) { return '<button class="chip2' + (r === room ? ' on' : '') + '" data-r="' + r + '">' + esc(L(C.rooms[r].name)) + '</button>'; }).join('');
      $('#grp-years', sh).innerHTML = ys.map(function (v) { return '<button class="chip2' + (v === y ? ' on' : '') + '" data-y="' + v + '">' + esc(L(C.yearName(v))) + '</button>'; }).join('');
      $$('[data-r]', sh).forEach(function (b) { b.onclick = function () { room = b.dataset.r; paint(sh); }; });
      $$('[data-y]', sh).forEach(function (b) { b.onclick = function () { y = +b.dataset.y; paint(sh); }; });
    }
    A.sheet(L(['Send a challenge', 'أرسل تحديًا']), '<div class="grp-mk"><small>' + esc(L(['Subject', 'المادة'])) + '</small><div class="chips" id="grp-rooms"></div><small>' + esc(L(['Year', 'السنة'])) + '</small><div class="chips" id="grp-years"></div><p>' + esc(L(['Ten questions. Every child who opens it gets the same ones, with no hints and one try each.', 'عشرة أسئلة. كل طفل يفتحه يحصل على الأسئلة نفسها، بلا تلميح ومحاولة واحدة لكل سؤال.'])) + '</p><button class="btn pri wide" id="grp-go">' + esc(L(['Send to my group', 'أرسل إلى مجموعتي'])) + '</button></div>', function (sh) {
      paint(sh);
      $('#grp-go', sh).onclick = function () {
        var ch = { miftahChallenge: 1, v: 1, room: room, y: y, n: 10, seed: 1 + Math.floor(Math.random() * 2e9), made: A.day() };
        G.keep(ch); A.closeSheet();
        var json = JSON.stringify(ch), cap = L(['A Miftāḥ challenge: ', 'تحدٍّ في مفتاح: ']) + L(C.rooms[room].name) + ' · ' + L(C.yearName(y)) + L(['. Open the file with Miftāḥ.', '. افتح الملف بتطبيق مفتاح.']);
        if (A.N.has()) A.N.call('shareChallenge', json, cap);
        else { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = 'Miftah-challenge.json'; a.click(); }
      };
    });
  };
  G.keep = function (ch) { var list = A.S.challenges || []; if (!list.some(function (x) { return x.seed === ch.seed; })) list = list.concat([{ room: ch.room, y: +ch.y, n: Math.min(20, Math.max(3, +ch.n || 10)), seed: +ch.seed, made: ch.made, got: A.day(), res: {} }]).slice(-30); A.S.challenges = list; A.saveNow(); };
  G.valid = function (o) { return o && o.miftahChallenge === 1 && Object.prototype.hasOwnProperty.call(C.rooms, o.room) && years(o.room).indexOf(+o.y) >= 0 && isFinite(+o.seed); };
  /* a pack arrives: say what it is, and let a parent choose who takes it */
  G.arrived = function (o) {
    var open = function () {
      G.keep(o);
      A.sheet(L(['A challenge from your group', 'تحدٍّ من مجموعتك']), '<div class="grp-in"><b>' + esc(L(C.rooms[o.room].name)) + ' · ' + esc(L(C.yearName(+o.y))) + '</b><p>' + esc(L(['Each learner gets one attempt. Leaving early ends it.', 'لكل متعلّم محاولة واحدة، والخروج مبكرًا ينهيها.'])) + '</p><small>' + esc(L(['Who will take it?', 'من سيأخذه؟'])) + '</small><div class="lst">' + A.S.profiles.map(function (p) { return '<button class="li" data-pid="' + esc(p.id) + '"><span class="grow"><b>' + esc(p.name) + '</b><small>' + esc(who(p, false)) + '</small></span>' + A.icon('next', 16) + '</button>'; }).join('') + '</div></div>', function (sh) {
        $$('[data-pid]', sh).forEach(function (b) { b.onclick = function () { A.closeSheet(); A.S.cur = b.dataset.pid; A.saveNow(); A.go('challenge/' + (+o.seed)); }; });
      });
    };
    if (A.grownOpen && !A.grownOpen() && A.askGrown) A.askGrown(open); else open();
  };

  /* ---------- taking a challenge ---------- */
  A.V.challenge = function (args) {
    var ch = (A.S.challenges || []).filter(function (x) { return String(x.seed) === String(args[0]); })[0], p = A.P();
    if (!ch || !p || !Object.prototype.hasOwnProperty.call(C.rooms, ch.room)) return { redirect: 'home' };
    var R = C.rooms[ch.room];
    return { bare: true, hue: R.hue, html: '<div id="t-ch"></div>', unmount: function () { window.Player.stop(); Voice.stop(); }, mount: function (v) {
      var host = $('#t-ch', v), results = ch.res = ch.res || {};
      function showResult(r) {
        if (r.incomplete) {
          host.innerHTML = '<div class="tres"><h2>' + esc(L(['Attempt ended early', 'انتهت المحاولة مبكرًا'])) + '</h2><a class="btn ghost wide" href="#/home">' + esc(L(['Done', 'تم'])) + '</a></div>';
          return;
        }
        host.innerHTML = '<div class="tres ok"><div class="tres-top"><span class="tres-art">' + A.art('star', 56) + '</span><span class="tres-sc"><b>' + N(r.ok) + '<i>/' + N(r.n) + '</i></b><small>' + esc(L(['right, first try', 'صحيحة من أول مرة'])) + '</small></span></div><small class="tres-k">' + esc(L(['Group challenge', 'تحدي المجموعة'])) + '</small><h2>' + esc(L(R.name)) + ' · ' + esc(L(C.yearName(ch.y))) + '</h2><p>' + esc(L(['A grown-up can share this result with your group.', 'يستطيع أحد الكبار مشاركة هذه النتيجة مع مجموعتك.'])) + '</p><button class="btn pri wide" id="ch-share">' + esc(L(['Share the result', 'شارك النتيجة'])) + '</button><button class="btn ghost wide" id="ch-done">' + esc(L(['Done', 'تم'])) + '</button></div>';
        $('#ch-done', host).onclick = function () { A.go('home'); };
        $('#ch-share', host).onclick = function () { A.askGrown(function () { fontsReady().then(function () { preview(G.resultCanvas(ch, p.id, r, !!A.S.cardNames), L(['Result card', 'بطاقة النتيجة']), L(['Our result in the group challenge.', 'نتيجتنا في تحدي المجموعة.']), 'Miftah-challenge.png'); }); }); };
      }
      if (Object.prototype.hasOwnProperty.call(results, p.id)) { showResult(results[p.id]); return; }
      var steps = G.questions(ch, p.id); if (!steps.length) { A.go('home'); return; }
      results[p.id] = { incomplete: true, t: A.now().getTime() }; A.saveNow();
      window.Player.start(host, { steps: steps, hue: R.hue, rng: A.rng(ch.seed + 1), mode: 'review', exam: true, label: ['Group challenge', 'تحدي المجموعة'], onExit: function () { A.go('home'); }, onDone: function (res) {
        var r = results[p.id] = { ok: res.soloOk, n: res.solo, t: A.now().getTime() };
        A.saveNow(); showResult(r);
      } });
    } };
  };

  /* ---------- the parent's group sheet ---------- */
  G.open = function () {
    var list = (A.S.challenges || []).slice().reverse();
    var rows = list.filter(function (ch) { return Object.prototype.hasOwnProperty.call(C.rooms, ch.room); }).slice(0, 6).map(function (ch) {
      var done = A.S.profiles.filter(function (p) { return ch.res && Object.prototype.hasOwnProperty.call(ch.res, p.id); }).map(function (p) { var r = ch.res[p.id]; return esc(p.name) + ' ' + (r.incomplete ? esc(L(['Attempt ended early', 'انتهت المحاولة مبكرًا'])) : N(r.ok) + '/' + N(r.n)); }).join(' · ');
      return '<button class="li" data-seed="' + esc(ch.seed) + '"><span class="grow"><b>' + esc(L(C.rooms[ch.room].name)) + ' · ' + esc(L(C.yearName(ch.y))) + '</b><small>' + (done || esc(L(['Not taken yet', 'لم يُؤخذ بعد']))) + '</small></span>' + A.icon('next', 16) + '</button>';
    }).join('');
    A.sheet(L(['Your homeschool group', 'مجموعتك المنزلية']), '<div class="grp"><p>' + esc(L(['Share with a WhatsApp or Telegram group you already belong to. No account, and nothing leaves this phone unless you send it.', 'شارك مع مجموعة واتساب أو تيليجرام تنتمي إليها. بلا حساب، ولا يخرج شيء من هذا الهاتف إلا ما ترسله أنت.'])) + '</p><div class="grp-b"><button class="tl-b" id="grp-week">' + A.icon('star', 24) + '<span>' + esc(L(['Weekly card', 'بطاقة الأسبوع'])) + '</span></button><button class="tl-b" id="grp-ch">' + A.icon('target', 24) + '<span>' + esc(L(['Send a challenge', 'أرسل تحديًا'])) + '</span></button></div>' + (rows ? '<h4>' + esc(L(['Challenges', 'التحديات'])) + '</h4><div class="lst">' + rows + '</div>' : '<small class="grp-hint">' + esc(L(['When someone sends a challenge, tap the file in the chat and open it with Miftāḥ.', 'حين يرسل أحدهم تحديًا، انقر الملف في المحادثة وافتحه بتطبيق مفتاح.'])) + '</small>') + '</div>', function (sh) {
      $('#grp-week', sh).onclick = function () { A.closeSheet(); setTimeout(G.weekly, 220); };
      $('#grp-ch', sh).onclick = function () { A.closeSheet(); setTimeout(G.make, 220); };
      $$('[data-seed]', sh).forEach(function (b) { b.onclick = function () { var ch = list.filter(function (x) { return String(x.seed) === b.dataset.seed; })[0]; A.closeSheet(); setTimeout(function () { G.arrived(ch); }, 220); }; });
    });
  };
  A.acts['grp-open'] = function () { G.open(); };

  /* a file opened from a chat: a challenge pack is recognised before the family-file merge sees it */
  var imp0 = window.__native.onImport;
  window.__native.onImport = function (txt, withFiles, shared) {
    var o = null; try { o = JSON.parse(txt); } catch (e) { }
    if (o && o.miftahChallenge) { A.__syncIn = false; if (G.valid(o)) G.arrived(o); else A.toast(L(['This challenge needs a newer Miftāḥ', 'هذا التحدي يحتاج نسخة أحدث من مفتاح'])); return; }
    return imp0 ? imp0(txt, withFiles, shared) : undefined;
  };
})();
