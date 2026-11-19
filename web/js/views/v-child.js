/* The child's world: welcome, who is learning, today, the rooms, a room's winding map, the key ring, and running each stop. */
(function () {
  'use strict';
  var A = window.A, $ = A.$, $$ = A.$$, esc = A.esc, L = A.L, T = A.T, C = window.C, M = window.M, Plan = window.Plan, Hifz = window.Hifz;
  var NAVBAR = function (on) {
    var tab = function (k, href, ic, t) { return '<a href="#/' + href + '" class="' + (on === k ? 'on' : '') + '">' + A.icon(ic, 22) + '<span>' + esc(T(t)) + '</span></a>'; };
    return '<nav class="nav" aria-label="' + esc(T('Sections')) + '">' + tab('home', 'home', 'path', 'Today') + (A.stage() > 0 ? tab('rooms', 'rooms', 'rooms', 'Rooms') : '') + tab('keys', 'keys', 'keys', 'My keys') + '</nav>';
  };
  A.avatar = function (p, cls) { return '<span class="avatar ' + (cls || '') + ' h-' + (p.hue || 'gold') + '" style="--a:var(--h2)">' + esc((p.name || '?').charAt(0).toUpperCase()) + '</span>'; };
  var HUES = ['emerald', 'rose', 'sapphire', 'violet', 'teal', 'amber'];
  var NIGHT = { hour: 21.5, fg: false };

  /* ===== first run: turn the key, the core gesture ===== */
  A.V.welcome = function () {
    var stop = null;
    return {
      bare: true, darkBars: true,
      html: '<div class="wel"><div class="wel-sky" id="wsky"></div><div class="wel-c" id="wc"></div></div>',
      mount: function () { stop = A.Sky.mount($('#wsky'), NIGHT); sceneKey(); },
      unmount: function () { if (stop) stop(); }
    };
  };
  function plateHtml() { return A.hasImg('lock-hero') ? '<img src="' + A.imgUrl('lock-hero') + '" alt="" draggable="false">' : A.lockPlate(); }
  function sceneKey() {
    var el = $('#wc');
    var door = A.hasImg('door-frame') && A.hasImg('door-left') ? '<div class="wel-door" aria-hidden="true"><img class="wd-l" src="' + A.imgUrl('door-left') + '" alt="" draggable="false"><img class="wd-r" src="' + A.imgUrl('door-right') + '" alt="" draggable="false"><img class="wd-f" src="' + A.imgUrl('door-frame') + '" alt="" draggable="false"><i class="wd-glow"></i></div>' : '<div class="wel-plate">' + plateHtml() + '</div>';
    el.innerHTML = '<div class="arname" lang="ar">مِفْتَاح</div><h1>Miftāḥ</h1><p>' + esc(L(['A homeschool for the whole family, from the Qurʾān to the stars.', 'مدرسة بيتية للعائلة كلها، من القرآن إلى النجوم.'])) + '</p>' + door +
      '<div class="segs wel-lang"><button class="seg ' + (A.S.lang === 'en' ? 'on' : '') + '" data-lang="en">English</button><button class="seg ' + (A.S.lang === 'ar' ? 'on' : '') + '" data-lang="ar">العربية</button></div>' +
      '<button class="btn pri big wel-go" id="wel-go">' + esc(L(['Begin', 'ابدأ'])) + A.icon('next', 22) + '</button>';
    $$('[data-lang]', el).forEach(function (b) { b.onclick = function () { A.S.lang = b.dataset.lang; A.applyTheme(); A.saveNow(); sceneKey(); }; });
    var done = false, go = $('#wel-go', el), dv = $('.wel-door', el) || $('.wel-plate', el);
    var begin = function () {
      if (done) return; done = true; Fx.tap();
      /* the first door opens, onto the question of who is learning */
      if (window.Door && Door.ready() && !A.reduced()) { if (!Door.play('gold', false, { route: sceneWho, sound: function (k, d) { if (Fx.doorSound) Fx.doorSound(k, d); } })) sceneWho(); }
      else { Fx.bloomAt(dv, '#f1d59e', true); setTimeout(sceneWho, 500); }
    };
    go.onclick = begin; if (dv) dv.onclick = begin;
  }
  function sceneWho() { A.V.__form($('#wc'), null, function (np) { A.placeDefault(np); A.saveNow(); Fx.door('gold', 'home'); }); }

  /* the child form, shared with the parent area */
  A.V.__form = function (el, prof, done) {
    var thisYear = A.now().getFullYear(), p = prof || { name: '', by: thisYear - 6, bm: 1, g: 'm' };
    el.innerHTML = '<h2 style="font-size:27px">' + esc(prof ? T('Edit child') : T('Who is learning?')) + '</h2>' +
      '<div class="field"><label for="f-n">' + esc(T('Name')) + '</label><input class="input" id="f-n" autocomplete="off" maxlength="24" value="' + esc(p.name) + '"></div>' +
      '<div class="field"><label>' + esc(T('Age')) + '</label><div class="segs" id="f-age" style="display:grid;grid-template-columns:repeat(5,1fr)">' + [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(function (a) { return '<button class="seg" data-age="' + a + '">' + A.num(a) + '</button>'; }).join('') + '</div></div>' +
      '<div class="field"><label>' + esc(T('For the prayer pictures')) + '</label><div class="segs" id="f-g"><button class="seg" data-g="m">' + esc(T('Boy')) + '</button><button class="seg" data-g="f">' + esc(T('Girl')) + '</button></div></div>' +
      '<div class="stagehint" style="min-height:22px;color:var(--gold2);font-size:14.5px"></div>' +
      '<button class="btn pri big wide" id="f-go" style="max-width:400px">' + esc(prof ? T('Save') : T('Open the door')) + '</button>';
    var age = thisYear - p.by, g = p.g || 'm';
    function paint() {
      $$('[data-age]', el).forEach(function (b) { b.classList.toggle('on', +b.dataset.age === age); });
      $$('[data-g]', el).forEach(function (b) { b.classList.toggle('on', b.dataset.g === g); });
      var st = age < 5 ? 0 : age < 8 ? 1 : age < 12 ? 2 : age < 15 ? 3 : 4;
      $('.stagehint', el).textContent = L(A.STAGES[st].name) + ' · ' + L([['A grown-up sits beside them, mostly real play', 'يجلس كبير بجانبه، ومعظمه لعب حقيقي'], ['Big buttons, a grown-up nearby', 'أزرار كبيرة وتعليمات منطوقة وكبير قريب'], ['Reads prompts, works through a day plan', 'يقرأ التعليمات ويتبع خطة اليوم'], ['Takes over the plan, with a quieter design', 'يتولى خطته بتصميم أهدأ'], ['Runs their own study, with exams and books', 'يدير دراسته بنفسه مع الاختبارات والكتب']][st]);
    }
    $$('[data-age]', el).forEach(function (b) { b.onclick = function () { age = +b.dataset.age; Fx.tap(); paint(); }; });
    $$('[data-g]', el).forEach(function (b) { b.onclick = function () { g = b.dataset.g; Fx.tap(); paint(); }; });
    paint();
    $('#f-go', el).onclick = function () {
      var nm = $('#f-n', el).value.trim();
      if (!nm) { Fx.shake($('#f-n', el)); $('#f-n', el).focus(); return; }
      if (prof) { prof.name = nm; prof.by = thisYear - age; prof.g = g; delete prof.stage; if (done) done(prof); return; }
      var np = { id: 'c' + Date.now().toString(36), name: nm, by: thisYear - age, bm: 1, g: g, hue: HUES[A.S.profiles.length % HUES.length], since: A.day() };
      A.S.profiles.push(np); A.S.cur = np.id;
      if (done) done(np);
    };
  };

  A.V.who = function () {
    var stop = null;
    return {
      bare: true, darkBars: true,
      html: '<div class="wel"><div class="wel-sky" id="wsky"></div><div class="wel-c"><h2 style="font-size:27px">' + esc(T('Who is learning?')) + '</h2><div class="who-grid">' +
        A.S.profiles.map(function (p) { return '<button class="who-c" data-a="who-pick" data-id="' + p.id + '">' + A.avatar(p) + '<b>' + esc(p.name) + '</b><small>' + esc(L(A.STAGES[A.stage(p)].name)) + '</small></button>'; }).join('') +
        '</div><a class="btn ghost" href="#/parent" style="color:#cfc9bd">' + A.icon('gear', 20) + '<span>' + esc(T('Parents')) + '</span></a></div></div>',
      mount: function () { stop = A.Sky.mount($('#wsky'), NIGHT); },
      unmount: function () { if (stop) stop(); }
    };
  };
  A.acts['who-pick'] = function (t) { A.S.cur = t.dataset.id; A.saveNow(); Fx.tap(); var p = A.P(); Fx.door(p.hue, 'home'); };

  function stopInfo(st) {
    if (st.t === 'move') return { hue: 'amber', art: Flow.moveFor(st.n).art, title: ['Move your body', 'حرّك جسمك'], sub: ['A minute away from the screen', 'دقيقة بعيدًا عن الشاشة'] };
    if (st.t === 'leap') { var lr0 = C.rooms[st.room]; return { hue: lr0.hue, art: 'key', title: ['Leap ahead', 'قفزة للأمام'], sub: lr0.name }; }
    if (st.t === 'check') { var un = C.units[st.unit]; return { hue: C.rooms[un.room].hue, art: 'lantern', title: ['Show what you know', 'أرِنا ما تعرف'], sub: un.title }; }
    if (st.t === 'practice') { var pr0 = C.rooms[st.room]; return { hue: pr0.hue, art: pr0.art, title: ['Practice', 'تدريب'], sub: pr0.name }; }
    if (st.t === 'read') { var bk = (A.D().books || []).filter(function (b) { return !b.of || (b.at || 0) < b.of; })[0]; return { hue: 'amber', art: 'book', title: ['Read a real book', 'اقرأ كتابًا حقيقيًا'], sub: bk ? [bk.title, bk.title] : ['Any good book, off the screen', 'أي كتاب جيد بعيدًا عن الشاشة'] }; }
    if (st.t === 'review') return { hue: 'gold', art: 'key', title: ['Polish your keys', 'لمّع مفاتيحك'], sub: ['Remember what you learned', 'تذكّر ما تعلمته'] };
    if (st.t === 'hifz') { return { hue: 'emerald', art: 'rehal', title: ['Time with the Qurʾān', 'وقت القرآن'], sub: Hifz.summary ? Hifz.summary() : ['Listen, repeat, keep', 'استمع وكرر واحفظ'] }; }
    if (st.t === 'mission') { var m = C.missions[st.id]; return { hue: 'teal', art: m.art, title: m.title && m.hands ? m.title : ['Go and do it', 'اذهب وافعلها'], sub: m.short || ['A real deed, off the screen', 'عمل حقيقي بعيدًا عن الشاشة'] }; }
    if (st.t === 'nursery') { var nu = C.nursery[st.id]; return { hue: nu.hue || 'gold', art: nu.art, title: nu.title, sub: C.experience(nu.x) }; }
    var sk = C.skill(st.s), r = C.rooms[sk.room];
    return { hue: r.hue, art: sk.art || r.art, title: sk.title, sub: r.name };
  }
  A.stopInfo = stopInfo;
  function minutes(n) { return A.num(Math.max(1, Math.round(n))) + ' ' + T('min'); }

  /* where a saved lesson continues: its stop on today's path, or the lesson itself */
  function resumeRoute() {
    var d = A.D(), r = A.resumeOf(); if (!r) return null;
    var pl = Plan.today(), at = -1; pl.stops.forEach(function (s, i) { if (s.t === 'lesson' && s.s === r.skill && !s.done) at = i; });
    return at >= 0 ? 'stop/' + at : 'lesson/' + r.skill;
  }

  /* ===== today: one clear next step, then the rest of the path ===== */
  A.V.home = function () {
    if (!A.S.profiles.length) return { redirect: 'welcome' };
    if (!A.P()) return { redirect: 'who' };
    var p = A.P(), st = A.stage(p), pl = Plan.today(), nx = Plan.nextStop(), stop = null, onScr = null;
    var res = A.resumeOf(), resSk = res ? C.skill(res.skill) : null;
    var doneN = pl.stops.filter(function (s) { return s.done; }).length, left = Plan.left();
    var teeth = pl.stops.map(function (s, i) { return '<i class="' + (s.done ? 'full' : i === nx ? 'now' : '') + '"></i>'; }).join('');
    var prog = pl.stops.length ? '<div class="dayprog"><div class="dayteeth" role="progressbar" aria-valuemin="0" aria-valuemax="' + pl.stops.length + '" aria-valuenow="' + doneN + '">' + teeth + '</div><small>' + A.num(doneN) + ' / ' + A.num(pl.stops.length) + (left > 0 ? ' · ' + esc(T('About')) + ' ' + minutes(left) + ' ' + esc(T('left')) : '') + '</small></div>' : '';
    /* the one thing to do now */
    var hero = '';
    if (resSk) {
      var rr = C.rooms[resSk.room];
      hero = '<div class="hero h-' + rr.hue + '"><div class="hero-arch">' + A.art(resSk.art || rr.art, 76) + '</div><div class="hero-t"><small>' + esc(T('Carry on where you stopped')) + '</small><h2>' + esc(L(resSk.title)) + '</h2><p>' + esc(L(rr.name)) + '</p></div><button class="btn pri big wide" data-a="go-resume">' + esc(T('Carry on')) + A.icon('next', 22).replace('class="ic"', 'class="ic ic-flip"') + '</button></div>';
    } else if (nx >= 0) {
      var inf = stopInfo(pl.stops[nx]);
      hero = '<div class="hero h-' + inf.hue + '"><div class="hero-arch">' + A.art(inf.art, 76) + '</div><div class="hero-t"><small>' + esc(T(doneN ? 'Next' : 'First today')) + ' · ' + esc(T('About')) + ' ' + minutes(Plan.est(pl.stops[nx], st)) + '</small><h2>' + esc(L(inf.title)) + '</h2><p>' + esc(L(inf.sub)) + '</p></div><button class="btn pri big wide" data-a="go-stop" data-i="' + nx + '">' + esc(T('Open the door')) + A.icon('next', 22).replace('class="ic"', 'class="ic ic-flip"') + '</button></div>';
    } else if (pl.stops.length) {
      var more = st > 0 && !Plan.over() && Plan.moreDoor();
      hero = '<div class="hero done"><div class="pathdone">' + A.art('key', 104, 'float') + '<h2>' + esc(T('Today’s path is walked')) + '</h2><p>' + esc(T(st === 0 ? 'Now go and play. The best learning is out there with you.' : 'Well done. Now go and play, help at home, and come back tomorrow.')) + '</p>' + '<div class="again-r">' + (more ? '<button class="btn sec" data-a="one-more">' + esc(T('One more door')) + '</button>' : '') + (st > 0 ? '<button class="btn sec" data-a="go-again">' + A.icon('refresh', 18) + '<span>' + esc(L(['Today, again', 'اليوم مرة أخرى'])) + '</span></button>' : '') + '</div></div></div>';
    }
    var prom = Flow.promiseToShow(), promH = prom ? '<button class="promise" data-a="promise-seen" data-id="' + prom.id + '">' + A.art('star', 44) + '<span><small>' + esc(T('You earned what your family promised')) + '</small><b>' + esc(prom.what) + '</b></span></button>' : '';
    var waiting = Flow.inbox().filter(function (x) { return x.kind !== 'stuck'; }).length;
    var stops = pl.stops.map(function (s, i) {
      var inf = stopInfo(s), cls = s.done ? 'done' : i === nx ? 'now' : 'later';
      return '<button class="pstop ' + cls + ' h-' + inf.hue + '" style="--i:' + i + '" data-a="go-stop" data-i="' + i + '"><span class="pmed">' + A.art(inf.art, 38) + (s.done ? '<span class="pdone">' + A.icon('check', 14) + '</span>' : '') + '</span><span class="ptxt"><b>' + esc(L(inf.title)) + '</b><small>' + esc(s.done && s.later ? T('Saved for another day') : L(inf.sub)) + '</small></span>' + (s.done ? '' : '<span class="pmin">' + minutes(Plan.est(s, st)) + '</span>') + '</button>';
    }).join('');
    return {
      cls: 'court', darkBars: true,
      html: '<div class="sky" id="sky"><div class="hello"><small>' + esc(T('As-salāmu ʿalaykum')) + '</small><h1>' + esc(p.name) + '</h1>' + '<small class="hello-d dates">' + Voice.dateLine(true) + '</small>' + '<span class="upd-slot hello-up">' + (window.Upd ? Upd.chip() : '') + '</span>' + '</div><div class="topbtns">' + A.dn(1) + '<a class="tbtn avatar h-' + (p.hue || 'gold') + '" href="#/who" aria-label="' + esc(T('Change child')) + '" style="--a:var(--h2)">' + esc(p.name.charAt(0).toUpperCase()) + '</a><a class="tbtn" href="#/parent" aria-label="' + esc(T('Parents')) + '">' + A.icon('gear', 22) + (waiting ? '<i class="tdot"></i>' : '') + '</a></div></div>' +
        '<div class="pathbox"><div class="home-a">' + promH + hero + prog + '</div><div class="home-b"><div class="sec-h"><h2>' + esc(T('Today’s path')) + '</h2>' + (Plan.round() > 1 ? '<span class="round-t">' + esc(L(['Round ' + Plan.round(), 'الجولة ' + A.num(Plan.round())])) + '</span>' : '') + '</div><div class="path">' + stops + '</div></div></div>' + NAVBAR('home'),
      mount: function () {
        var box = $('#sky'); if (!box) return; stop = A.Sky.mount(box);
        var past = false; onScr = function () { var now = (window.scrollY || 0) > box.clientHeight - 80; if (now !== past) { past = now; var vw = box.parentNode; if (vw) vw.classList.toggle('past', now); A.N.call('setSystemBars', now && document.documentElement.dataset.theme === 'light'); } };
        window.addEventListener('scroll', onScr, { passive: true });
      },
      unmount: function () { if (stop) stop(); if (onScr) window.removeEventListener('scroll', onScr); },
      resume: function () { A.rerender(); }
    };
  };
  A.acts['promise-seen'] = function (t) { var pr = (A.P().promises || []).filter(function (x) { return x.id === t.dataset.id; })[0]; if (pr) { pr.shown = A.now().getTime(); A.saveNow(); Fx.bloomAt(t, '#f1d59e', true); setTimeout(A.rerender, 500); } };
  A.acts['door'] = function (t, e) { e.preventDefault(); Fx.door(t.dataset.hue, t.dataset.to); };
  A.acts['go-stop'] = function (t) {
    var i = +t.dataset.i, pl = Plan.today(), s = pl.stops[i];
    if (!s) return;
    if (s.done && s.t !== 'lesson') { Fx.soft(); return; }
    if (Plan.over()) { A.go('rest'); return; }
    if (s.t === 'move') { A.go('stop/' + i); return; }
    Fx.door(stopInfo(s).hue, 'stop/' + i);
  };
  /* a second round of today: revision of what was learned, practice in the same subjects. Past the day's screen time, a grown-up decides. */
  A.acts['go-again'] = function () {
    var run = function () { var n = Plan.again(); if (!n) { A.toast(L(['Nothing from today to go over yet', 'لا شيء من اليوم للمراجعة بعد'])); return; } A.toast(L(['Round ' + n + ': going over today', 'الجولة ' + A.num(n) + ': مراجعة اليوم'])); A.rerender(); };
    if (Plan.over()) A.askGrown(run); else run();
  };
  A.acts['go-resume'] = function () { var to = resumeRoute(), r = A.resumeOf(); if (!to) return; if (Plan.over()) { A.go('rest'); return; } Fx.door(C.rooms[C.skill(r.skill).room].hue, to); };
  A.acts['one-more'] = function () {
    var sk = Plan.moreDoor(); if (!sk) return;
    var pl = Plan.today(); pl.stops.push({ t: 'lesson', s: sk.id, done: false, extra: true }); A.saveNow();
    Fx.door(C.rooms[sk.room].hue, 'stop/' + (pl.stops.length - 1));
  };

  /* ===== time to rest: the limit is the parent's, and it is never reached mid-lesson ===== */
  A.V.rest = function () {
    if (!A.P()) return { redirect: 'home' };
    var stop = null;
    return {
      bare: true, darkBars: true,
      html: '<div class="wel rest"><div class="wel-sky" id="wsky"></div><div class="wel-c"><div class="rest-art">' + A.art('tree', 150, 'float') + '</div><h2 style="font-size:28px">' + esc(T('Time to rest your eyes')) + '</h2><p>' + esc(T('That is enough screen for today. Go and play, help at home, and pray. Your place is saved.')) + '</p><a class="btn pri big" href="#/home">' + esc(T('Back to the courtyard')) + '</a><button class="btn ghost rest-more" data-a="rest-more">' + A.icon('grown', 20) + '<span>' + esc(T('A grown-up can add time')) + '</span></button></div></div>',
      mount: function () { stop = A.Sky.mount($('#wsky'), { fg: false }); },
      unmount: function () { if (stop) stop(); }
    };
  };
  A.acts['rest-more'] = function () { A.askGrown(function () { Plan.extend(15); A.toast(T('Saved')); A.go('home'); }); };

  /* ===== the rooms ===== */
  function roomStatus(id, p) {
    var r = C.rooms[id];
    if (id === 'quran') { var h = Hifz.state(), su = window.QURAN.order[h.i]; return { t: su != null ? T('Learning now') + ': ' + A.surahName(su) : T('Finished sūrahs'), n: (h.finished || []).length, of: window.QURAN.order.length }; }
    var n = 0, of = 0, st = A.stage(p); r.units.forEach(function (u) { if (u.band > st) return; u.skills.forEach(function (s) { if (s.band > st) return; of++; if (M.met(s.id)) n++; }); });
    var nx = C.next(id);
    return { t: nx ? T('Next') + ': ' + L(nx.title) : T('Every door is open'), n: n, of: of };
  }
  A.V.rooms = function () {
    if (!A.P()) return { redirect: 'home' };
    var p = A.P(); if (A.stage(p) === 0) return { redirect: 'home' };
    return {
      html: '<div class="ph h-gold"><svg class="girih" viewBox="0 0 100 100">' + A.girih(null, .55) + '</svg><h1>' + esc(T('The rooms')) + '</h1><p>' + esc(T('Each room is a subject, and each has its own level. Go in whenever you like.')) + '</p></div><div class="wrap"><div class="rooms">' + C.order.filter(function (r) { return C.rooms[r].units.some(function (u) { return r === 'quran' || u.band <= A.stage(p); }) || r === 'quran'; }).filter(function (r) { return !(p.off || {})[r]; }).map(function (id, i) {
        var r = C.rooms[id], s = roomStatus(id, p), pct = s.of ? Math.round(s.n / s.of * 100) : 0;
        return '<a class="portal h-' + r.hue + '" href="#/room/' + id + '" data-a="door" data-hue="' + r.hue + '" data-to="room/' + id + '" style="--i:' + i + '"><span class="portal-a">' + (A.portalImg(id) || A.portal(r.hue) + '<span class="portal-o">' + A.art(id === 'quran' ? 'rehal' : r.art, 72) + '</span>') + '</span><b>' + esc(L(r.name)) + '</b><small>' + esc(s.t) + '</small><span class="portal-p"><i style="width:' + pct + '%"></i></span><small class="portal-n">' + A.num(s.n) + ' / ' + A.num(s.of) + '</small></a>';
      }).join('') + '</div></div>' + NAVBAR('rooms')
    };
  };

  /* ===== a room: a winding road of doors, drawn to the child's place on it ===== */
  function keyIcon(id, size) {
    var s = M.state(id), l = M.light(id), o = s === 'new' || s === 'started' ? '' : 'style="opacity:' + (0.45 + 0.55 * l).toFixed(2) + '"';
    return '<span class="keyicon k-' + s + '" ' + o + '>' + A.art('key', size || 34) + '</span>';
  }
  A.keyIcon = keyIcon;
  var ROW = 150, UNIT = 74, TOP = 26;
  A.V.room = function (args) {
    if (!A.P()) return { redirect: 'home' };
    var r = C.rooms[args[0]]; if (!r || A.stage() === 0) return { redirect: 'home' };
    if (args[0] === 'quran') return A.V.quran ? A.V.quran(args) : { redirect: 'home' };
    var p = A.P(), st = A.stage(p), next = C.next(r.id), y = TOP, idx = 0, nodes = '', pts = [], lastDone = -1, rtl = A.ar();
    /* one year of the road at a time: a child sees where they are, and the map stays quick however long the road grows */
    var mine = r.units.filter(function (u) { return u.band <= st && u.skills.some(function (s) { return s.band <= st; }); });
    var years = []; mine.forEach(function (u) { if (years.indexOf(u.y) < 0) years.push(u.y); }); years.sort(function (a, b) { return a - b; });
    var hereU = next && mine.filter(function (u) { return u.skills.some(function (s) { return s.id === next.id; }); })[0];
    var want = args[1] && +args[1].slice(1), year = years.indexOf(want) >= 0 ? want : hereU ? hereU.y : years[years.length - 1];
    var yearBar = years.length < 2 ? '' : '<div class="ryears">' + years.map(function (n) {
      var all = 0, met = 0; mine.forEach(function (u) { if (u.y === n) u.skills.forEach(function (s) { if (s.band <= st) { all++; if (M.met(s.id)) met++; } }); });
      return '<button class="ryear' + (n === year ? ' on' : '') + (all && met === all ? ' full' : '') + '" data-a="room-year" data-r="' + r.id + '" data-y="' + n + '"><b>' + esc(L(C.yearName(n))) + '</b><i style="--p:' + (all ? Math.round(met / all * 100) : 0) + '%"></i></button>';
    }).join('') + '</div>';
    mine.filter(function (u) { return u.y === year; }).forEach(function (u) {
      var list = u.skills.filter(function (sk) { return sk.band <= st; }); if (!list.length) return;
      var emb = { 'd-seerah': 'seerah', 'd-adab': 'adab' }[u.id], embH = emb && A.hasImg('portal-' + emb) ? 92 : 0;
      nodes += '<div class="rmap-unit" style="top:' + y + 'px">' + (embH ? '<em>' + A.portalImg(emb, true) + '</em>' : '') + '<span>' + esc(L(u.title)) + '</span></div>'; y += UNIT + embH;
      list.forEach(function (sk) {
        var open = C.open(sk) || M.met(sk.id), isNext = next && next.id === sk.id, done = M.met(sk.id);
        var x = 50 + 25 * Math.sin(idx * .95); if (rtl) x = 100 - x;
        var cy = y + 46;
        pts.push([x, cy]); if (done) lastDone = pts.length - 1;
        nodes += '<button class="mapn h-' + r.hue + (done ? ' done' : isNext ? ' now' : open ? ' open' : ' lock') + '" style="left:' + x.toFixed(1) + '%;top:' + y + 'px" data-a="room-open" data-id="' + sk.id + '"><span class="mapm">' + (sk.glyph ? '<span class="mapg" lang="ar">' + sk.glyph + '</span>' : A.art(sk.art || r.art, 64)) + (done ? '<span class="mapk">' + keyIcon(sk.id, 26) + '</span>' : !open ? '<span class="mapl">' + A.icon('lock', 16) + '</span>' : '') + '</span><b>' + esc(L(sk.title)) + '</b><small>' + esc(stateText(sk.id, open)) + '</small></button>';
        y += ROW; idx++;
      });
    });
    function seg(a, b) { var dy = (b[1] - a[1]) / 2; return 'C' + a[0].toFixed(1) + ' ' + (a[1] + dy).toFixed(0) + ' ' + b[0].toFixed(1) + ' ' + (b[1] - dy).toFixed(0) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(0); }
    var dAll = pts.length ? 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1] : '', dDone = dAll;
    for (var i = 1; i < pts.length; i++) { var c = seg(pts[i - 1], pts[i]); dAll += c; if (i <= Math.max(0, lastDone + (next ? 1 : 0))) dDone += c; }
    return {
      hue: r.hue,
      html: '<div class="ph h-' + r.hue + '">' + (A.hasImg('portal-' + r.id) ? '<span class="ph-portal">' + A.portalImg(r.id, true) + '</span>' : '<svg class="girih" viewBox="0 0 100 100">' + A.girih(null, .55) + '</svg>') + '<a class="backp" href="#/rooms">' + A.icon('back', 18) + '<span>' + esc(A.stage() >= 3 ? L(['Subjects', 'المواد']) : T('Rooms')) + '</span></a><h1>' + esc(L(r.name)) + '</h1><p>' + esc(L(r.tag)) + '</p></div>' + yearBar + '<div class="wrap">' + shelfHtml(r.id) + '<div class="rmap h-' + r.hue + '" style="height:' + y + 'px"><svg class="rmap-line" viewBox="0 0 100 ' + y + '" preserveAspectRatio="none" aria-hidden="true"><path d="' + dAll + '" class="ml-b"/><path d="' + dAll + '" class="ml-t"/>' + (lastDone >= 0 || next ? '<path d="' + dDone + '" class="ml-d"/>' : '') + '</svg>' + nodes + '</div></div>' + NAVBAR('rooms'),
      mount: function (v) { var n = $('.mapn.now', v), yb = $('.ryear.on', v); if (yb && yb.scrollIntoView) yb.parentNode.scrollLeft = yb.offsetLeft - 40; if (n && n.scrollIntoView) setTimeout(function () { n.scrollIntoView({ block: 'center' }); }, 30); }
    };
  };
  function shelfHtml(room) {
    var list = Media.shelf(room); if (!list.length) return '';
    return '<div class="shelf"><h3>' + esc(T('From your family')) + '</h3><div class="shelf-r">' + list.map(function (m) { return '<a class="shelf-i" href="#/watch/' + m.id + '"><span class="shelf-t">' + (m.kind === 'youtube' ? '<img src="https://i.ytimg.com/vi/' + m.ref + '/mqdefault.jpg" alt="" onerror="this.remove()">' : (m.kind === 'image' ? '<img src="media/' + encodeURIComponent(m.ref) + '" alt="">' : '')) + (m.kind === 'image' ? '' : '<i>' + A.icon('play', 20) + '</i>') + '</span><b>' + esc(m.title) + '</b></a>'; }).join('') + '</div></div>';
  }
  function stateText(id, open) {
    if (!open) return '';
    var s = M.state(id);
    if (A.resumeOf() && A.resumeOf().skill === id) return T('Carry on where you stopped');
    if (s === 'new') return '';
    if (s === 'started') return T('Your key is being made');
    var l = M.light(id);
    var lab = { forged: 'Forged', proven: 'Proven', deep: 'Deep in your heart' }[s];
    return T(lab) + (l < .72 ? ' · ' + T('Needs polishing') : '');
  }
  A.stateText = stateText;
  A.acts['room-year'] = function (t) { A.go('room/' + t.dataset.r + '/y' + t.dataset.y, { replace: true }); };
  A.acts['room-open'] = function (t) {
    var sk = C.skill(t.dataset.id);
    if (!C.open(sk) && !M.met(sk.id)) { Fx.soft(); Fx.shake(t); return; }
    if (Plan.over()) { A.go('rest'); return; }
    Fx.door(C.rooms[sk.room].hue, 'lesson/' + sk.id);
  };

  /* ===== the key ring ===== */
  function lanternsHtml() {
    var all = Flow.lanterns(), lit = all.filter(function (x) { return x.lit; }).length; if (!all.length) return '';
    return '<div class="lamps"><h3>' + esc(T('Lanterns')) + ' · ' + A.num(lit) + ' / ' + A.num(all.length) + '</h3>' + (function () {
      /* one row per subject: a wall of grey lanterns said nothing, a row says how far each subject has come */
      var by = {}; all.forEach(function (x) { var g = by[x.room] = by[x.room] || { n: 0, lit: 0 }; g.n++; if (x.lit) g.lit++; });
      return '<div class="lamp-rows">' + C.order.filter(function (r) { return by[r]; }).map(function (r) { var g = by[r], R = C.rooms[r]; return '<div class="lamp-row h-' + R.hue + '"><span class="lamp' + (g.lit ? ' lit' : '') + '">' + A.art('lantern', 28) + '</span><span class="grow"><b>' + esc(L(R.name)) + '</b><i class="lamp-bar"><i style="width:' + Math.round(g.lit / g.n * 100) + '%"></i></i></span><span class="num">' + A.num(g.lit) + ' / ' + A.num(g.n) + '</span></div>'; }).join('') + '</div>';
    })() + '<p>' + esc(T('A lantern lights when you can show everything in a unit.')) + '</p></div>';
  }
  A.V.keys = function () {
    if (!A.P()) return { redirect: 'home' };
    var d = A.D(), c = M.counts(), any = false;
    var groups = C.order.map(function (id) {
      var r = C.rooms[id], ks = [];
      r.units.forEach(function (u) { u.skills.forEach(function (sk) { if (d.keys[sk.id] && d.keys[sk.id].forged) ks.push(sk); }); });
      if (id === 'quran' && Hifz) { var h = Hifz.state(); (h.finished || []).forEach(function (s) { ks.push({ hifz: s, title: [window.QURAN.q[s].name, window.QURAN.q[s].ar.replace(/^سُورَةُ\s*/, '')] }); }); }
      if (!ks.length) return '';
      any = true;
      return '<div class="unit h-' + r.hue + '"><h3>' + esc(L(r.name)) + '</h3><div class="keys-grid">' + ks.map(function (sk) {
        if (sk.hifz) return '<div class="keyt"><span class="keyicon k-proven">' + A.art('key', 42) + '</span><small>' + esc(L(sk.title)) + '</small></div>';
        return '<button class="keyt" data-a="key-open" data-id="' + sk.id + '">' + keyIcon(sk.id, 42) + '<small>' + esc(L(sk.title)) + '</small></button>';
      }).join('') + '</div></div>';
    }).join('');
    return {
      html: '<div class="ph h-gold"><svg class="girih" viewBox="0 0 100 100">' + A.girih(null, .55) + '</svg><h1>' + esc(T('My keys')) + '</h1><p>' + esc(T('A key is bright when you remember. It dims with time. Recall it and it shines again.')) + '</p></div><div class="wrap">' +
        (any ? '<div class="kstats">' + [[c.forged, T('Forged'), ['Learned and shown', 'تعلّمه وأظهره'], 1], [c.proven, T('Proven'), ['Still right after a break', 'ما زال صحيحًا بعد مدة'], 2], [c.deep, T('Deep'), ['Kept for months', 'ثابت منذ شهور'], 3]].map(function (x) { return '<div class="kst"><i class="kst-lv l' + x[3] + '" aria-hidden="true"><em></em><em></em><em></em></i><b>' + A.num(x[0]) + '</b><span>' + esc(x[1]) + '</span><small>' + esc(L(x[2])) + '</small></div>'; }).join('') + '</div>' + lanternsHtml() + groups : '<div class="empty">' + A.art('key', 110, 'float') + '<p>' + esc(T('Your first key is waiting behind today’s first door.')) + '</p><a class="btn pri" href="#/home">' + esc(T('Go to today')) + '</a></div>') + '</div>' + NAVBAR('keys')
    };
  };
  A.acts['key-open'] = function (t) { var sk = C.skill(t.dataset.id); if (Plan.over()) { A.go('rest'); return; } Fx.door(C.rooms[sk.room].hue, 'lesson/' + sk.id); };

  /* ===== running a lesson ===== */
  function keyReveal(size) {
    var mask = A.hasImg('key-forged') ? '<i class="sheen" style="-webkit-mask-image:url(' + A.imgUrl('key-forged') + ');mask-image:url(' + A.imgUrl('key-forged') + ')"></i>' : '';
    return A.art('key', size) + mask;
  }
  function forgeScreen(host, sk, res, hue, after) {
    var passed = res.passed;
    var firstForge = false;
    if (passed) { var k = M.key(sk.id); if (!k || !k.forged) { M.forge(sk.id); firstForge = true; } M.clearNotYet(sk.id); }
    else M.noteNotYet(sk.id);
    Flow.record(sk.id, passed, undefined, res); Plan.completeSkill(sk.id); Flow.checkPromises();
    A.saveNow();
    /* from 12, a clear result and on with the work */
    if (A.stage() >= 3) {
      var nxI = Plan.nextStop(), nxS = nxI != null && nxI >= 0 && Plan.today().stops[nxI], nxT = nxS && !nxS.done ? L(A.stopInfo(nxS).title) : '';
      host.innerHTML = '<div class="tres ' + (passed ? 'ok' : 'no') + '"><div class="tres-top"><span class="tres-art">' + A.art('key', 60) + '</span>' + (res.solo ? '<span class="tres-sc"><b>' + A.num(res.soloOk) + '<i>/' + A.num(res.solo) + '</i></b><small>' + esc(L(['right on your own', 'صحيحة وحدك'])) + '</small></span>' : '') + '</div><small class="tres-k">' + esc(L(passed ? ['Mastered', 'أُتقن'] : ['Not yet', 'ليس بعد'])) + '</small><h2>' + esc(L(sk.title)) + '</h2><p>' + esc(L(passed ? ['It will come back for review just as you begin to forget it.', 'سيعود للمراجعة حين تبدأ بنسيانه.'] : ['This returns soon, with what it builds on.', 'سيعود قريبًا مع ما يبنى عليه.'])) + '</p>' + (function () { var ui = Flow.usedIn ? Flow.usedIn(sk.id) : []; return passed && ui.length ? '<p style="font-size:14px">' + esc(L(['You will use this in: ', 'ستستعمله في: '])) + ui.slice(0, 3).map(function (k) { return esc(L(k.title)) + ' (' + esc(L(C.rooms[k.room].name)) + ')'; }).join(', ') + '</p>' : ''; })() + '<button class="btn pri wide" id="fgo">' + esc(T('Continue')) + A.icon('next', 18) + '</button>' + (nxT ? '<p class="tres-next">' + esc(L(['Next: ', 'التالي: '])) + esc(nxT) + '</p>' : '') + '</div>';
      $('#fgo', host).onclick = after; return;
    }
    host.innerHTML = '<div class="forge h-' + hue + '"><div class="forge-rays" style="' + (passed ? '' : 'display:none') + '"></div></div>';
    var f = $('.forge', host);
    var title = passed ? (firstForge ? T('A new key') : T('Your key shines')) : T('Your key is still being made');
    var body = passed ? T(firstForge ? 'Tomorrow, see if you still remember. That is how a key becomes proven.' : 'Remembering makes it stronger.') : T('That is how learning goes. We will come back to this door soon.');
    var text = function () {
      var t = document.createElement('div'); t.className = 'forge-txt';
      t.innerHTML = '<small>' + esc(title) + '</small><h2>' + esc(L(sk.title)) + '</h2><p>' + esc(body) + '</p><button class="btn pri big" id="fgo"><span>' + esc(T('Continue')) + '</span>' + A.icon('next', 22).replace('class="ic"', 'class="ic ic-flip"') + '</button>';
      f.appendChild(t);
      $('#fgo', t).onclick = function () { after(); };
      if (A.stage() < 2) Voice.say(title + '. ' + L(sk.title), { lang: A.ar() ? 'ar' : 'en' });
    };
    if (!passed) { var w = document.createElement('div'); w.className = 'forge-key'; w.style.filter = 'grayscale(.7) brightness(.8)'; w.innerHTML = A.art('key', Math.min(innerWidth, innerHeight) * .46); f.appendChild(w); text(); return; }
    /* calm: the key is simply there */
    if (A.motion() !== 'full' || A.stage() < 1) { var ck = document.createElement('div'); ck.className = 'forge-key'; ck.innerHTML = A.art('key', Math.min(innerWidth, innerHeight) * .42); f.appendChild(ck); A.N.haptic('success'); text(); return; }
    Fx.forge(f).then(function (c) {
      var size = Math.min(innerWidth, innerHeight) * .62, w = document.createElement('div'); w.className = 'forge-key'; w.innerHTML = keyReveal(size); f.appendChild(w);
      if (c) c.remove();
      Fx.bloom(innerWidth / 2, innerHeight * .42, '#f1d59e', true);
      Fx.clack();
      text();
    });
  }
  A.forgeScreen = forgeScreen;
  function runSkill(el, sk, stopI) {
    var res = A.resumeOf(); if (res && res.skill !== sk.id) res = null;
    var seed = res ? res.seed : A.seed(), rng = A.rng(seed), r = C.rooms[sk.room];
    var steps = Player.compose(sk, rng);
    /* depth for a child moving fast: harder questions at the end, with no help, one of them from the next lesson. They never stop
       a key being forged; they show how far the idea really reaches */
    var fastNow = A.stage() >= 1 && !res && Flow.pace().fast !== 'steady';
    if (fastNow && sk.review && !sk.hifz) {
      var extra = [], u0 = C.units[sk.unit], nextSk = u0 ? u0.skills[u0.skills.indexOf(sk) + 1] : null;
      for (var si = 0; si < 2; si++) { var q0 = sk.review(rng); q0 = Array.isArray(q0) ? q0[0] : q0; if (q0 && q0.k !== 'say' && q0.k !== 'mission') extra.push(Object.assign({}, q0, { ph: 'stretch', hint: null, noHelp: true })); }
      if (nextSk && nextSk.review) { var q1 = nextSk.review(rng); q1 = Array.isArray(q1) ? q1[0] : q1; if (q1 && q1.k !== 'say' && q1.k !== 'mission') extra.push(Object.assign({}, q1, { ph: 'stretch', hint: null, noHelp: true, skill: nextSk.id })); }
      var mk = steps.findIndex ? steps.findIndex(function (x) { return x.ph === 'make' || x.ph === 'watch' && steps.indexOf(x) > 0; }) : -1;
      if (extra.length) { if (mk < 0) steps = steps.concat(extra); else steps = steps.slice(0, mk).concat(extra, steps.slice(mk)); }
    }
    Player.start(el, {
      steps: steps, skill: sk.id, hue: r.hue, rng: rng, mode: 'lesson', quiet: !!sk.quiet,
      track: { skill: sk.id, seed: seed, stop: stopI }, at: res,
      onExit: function () { A.toast(T('Your place is saved')); A.go(stopI != null ? 'home' : 'room/' + sk.room); },
      onDone: function (res2, host) {
        forgeScreen(host, sk, res2, r.hue, function () {
          if (stopI != null) afterStop(); else Fx.door(r.hue, 'room/' + sk.room);
        });
      }
    });
  }
  function afterStop() {
    if (Plan.over()) { A.go('rest'); return; }
    var nx = Plan.nextStop();
    if (nx >= 0) { var st0 = Plan.today().stops[nx], inf = stopInfo(st0); if (st0.t === 'move') A.go('stop/' + nx); else Fx.door(inf.hue, 'stop/' + nx); }
    else Fx.door('gold', 'home');
  }
  A.afterStop = afterStop;

  A.V.lesson = function (args) {
    if (!A.P()) return { redirect: 'home' };
    var sk = C.skill(args[0]); if (!sk) return { redirect: 'home' };
    return { bare: true, hue: C.rooms[sk.room].hue, html: '<div id="plh"></div>', mount: function (v) { runSkill($('#plh', v), sk, null); }, unmount: function () { Player.stop(); Voice.stop(); }, onBack: function () { Player.stop(); A.go('room/' + sk.room); return 'handled'; } };
  };
  A.V.stop = function (args) {
    if (!A.P()) return { redirect: 'home' };
    var i = +args[0], pl = Plan.today(), s = pl.stops[i];
    if (!s) return { redirect: 'home' };
    if (s.t === 'lesson') return { bare: true, html: '<div id="plh"></div>', mount: function (v) { runSkill($('#plh', v), C.skill(s.s), i); }, unmount: function () { Player.stop(); Voice.stop(); }, onBack: function () { Player.stop(); A.go('home'); return 'handled'; } };
    if (s.t === 'review') return { bare: true, html: '<div id="plh"></div>', mount: function (v) { runReview($('#plh', v), s, i); }, unmount: function () { Player.stop(); Voice.stop(); }, onBack: function () { Player.stop(); A.go('home'); return 'handled'; } };
    if (s.t === 'mission') return { bare: true, html: '<div id="plh"></div>', mount: function (v) { runMission($('#plh', v), s, i); }, unmount: function () { Player.stop(); }, onBack: function () { Player.stop(); A.go('home'); return 'handled'; } };
    if (s.t === 'move') return { bare: true, html: '<div id="plh"></div>', mount: function (v) { runMove($('#plh', v), s, i); }, unmount: function () { Player.stop(); Voice.stop(); }, onBack: function () { Player.stop(); A.go('home'); return 'handled'; } };
    if (s.t === 'leap') return { bare: true, html: '<div id="plh"></div>', mount: function (v) { runLeap($('#plh', v), s, i); }, unmount: function () { Player.stop(); Voice.stop(); }, onBack: function () { Player.stop(); A.go('home'); return 'handled'; } };
    if (s.t === 'check') return { bare: true, html: '<div id="plh"></div>', mount: function (v) { runCheck($('#plh', v), s, i); }, unmount: function () { Player.stop(); Voice.stop(); }, onBack: function () { Player.stop(); A.go('home'); return 'handled'; } };
    if (s.t === 'practice') return { bare: true, html: '<div id="plh"></div>', mount: function (v) { runPractice($('#plh', v), s, i); }, unmount: function () { Player.stop(); Voice.stop(); }, onBack: function () { Player.stop(); A.go('home'); return 'handled'; } };
    if (s.t === 'read') return { bare: true, html: '<div id="plh"></div>', mount: function (v) { runRead($('#plh', v), s, i); } };
    if (s.t === 'hifz') return A.V.hifz([String(i)]);
    if (s.t === 'nursery') return A.V.nursery([String(i)]);
    return { redirect: 'home' };
  };
  function runMove(el, s, i) {
    var mv = Flow.moveFor(s.n);
    Player.start(el, {
      steps: [{ k: 'body', ph: 'do', p: ['Stand up', 'قف'], art: mv.art, t: mv.t, s: mv.s, speak: mv.t, nextLabel: ['I did it', 'فعلتها'] }], hue: 'amber', mode: 'lesson',
      onExit: function () { A.go('home'); },
      onDone: function () { Plan.complete(i); afterStop(); }
    });
  }
  /* a unit's check: every lesson once more, mixed up, no hints. Passing lights a lantern; not yet means a little more polishing and another go. */
  /* a leap: the next lessons in a room, two questions each with no help. A lesson answered fully right is known already: its key is
     forged as earned, and it comes back for review like any other. The first one missed is where teaching starts again. */
  function runLeap(el, s, i) {
    var rng = A.rng(A.seed()), R = C.rooms[s.room], used = [], list = [];
    for (var k = 0; k < 3; k++) { var nx = C.next(s.room, A.S.cur, used); if (!nx || !nx.review || nx.hifz) break; used.push(nx.id); list.push(nx); }
    if (!list.length) { Plan.complete(i); afterStop(); return; }
    var passed = [], at = 0;
    function one() {
      if (at >= list.length) return done();
      var sk = list[at], steps = [];
      for (var q = 0; q < 2; q++) { var x = sk.review(rng); (Array.isArray(x) ? x.slice(0, 1) : [x]).forEach(function (y) { if (y && y.k !== 'mission' && y.k !== 'say') steps.push(Object.assign({}, y, { ph: 'solo', skill: sk.id, hint: null, noHelp: true })); }); }
      if (!steps.length) { at++; return one(); }
      Player.start(el, { steps: steps, hue: R.hue, rng: rng, mode: 'review', exam: true, label: ['Leap ahead', 'قفزة للأمام'],
        onExit: function () { Plan.complete(i); A.go('home'); },
        onDone: function (res) { if (res.solo && res.soloOk === res.solo) { M.log(sk.id, { k: 'forge', ok: true, by: 'leap' }); Flow.record(sk.id, true, undefined, { clean: true }); passed.push(sk); at++; one(); } else done(); } });
    }
    function done() {
      Plan.complete(i); A.D().path = null; A.saveNow();
      var n = passed.length;
      el.innerHTML = '<div class="forge h-' + R.hue + '"><div class="forge-rays" style="' + (n ? '' : 'display:none') + '"></div><div class="forge-key">' + A.art('key', Math.min(innerWidth, innerHeight) * .42) + '</div><div class="forge-txt"><small>' + esc(L(R.name)) + '</small><h2>' + esc(n ? L(['You leapt over ' + n + (n === 1 ? ' lesson' : ' lessons'), 'قفزت فوق ' + A.num(n) + (n === 1 ? ' درس' : ' دروس')]) : L(['Good: this is where we start', 'جيد: من هنا نبدأ'])) + '</h2><p>' + esc(n ? passed.map(function (x) { return L(x.title); }).join(' · ') : L(list[0].title)) + '</p><button class="btn pri big" id="fgo">' + esc(T('Next')) + '</button></div></div>';
      if (n) { Fx.clack(); Fx.bloom(innerWidth / 2, innerHeight * .42, '#f1d59e', true); }
      A.$('#fgo', el).onclick = function () { afterStop(); };
    }
    one();
  }
  function runCheck(el, s, i) {
    var rng = A.rng(A.seed()), u = C.units[s.unit], d = A.D(), steps = [], list = u ? rng.shuffle(u.skills.filter(function (x) { return d.keys[x.id] && d.keys[x.id].forged && x.review; })) : [];
    list.slice(0, 7).forEach(function (sk) { var st = sk.review(rng); (Array.isArray(st) ? st.slice(0, 1) : [st]).forEach(function (x) { steps.push(Object.assign({}, x, { ph: 'solo', skill: sk.id, hint: null, noHelp: true })); }); });
    if (!steps.length) { Plan.complete(i); afterStop(); return; }
    Player.start(el, {
      steps: steps, hue: C.rooms[u.room].hue, rng: rng, mode: 'review', exam: true,
      onExit: function () { A.go('home'); },
      onDone: function (res, host) {
        var ok = res.solo === 0 || res.soloOk / res.solo >= .75;
        if (ok) Flow.unitDone(u.id); else Flow.unitNotYet(u.id);
        Plan.complete(i);
        host.innerHTML = '<div class="forge h-' + C.rooms[u.room].hue + '"><div class="forge-rays" style="' + (ok ? '' : 'display:none') + '"></div><div class="forge-key lantern' + (ok ? ' lit' : '') + '">' + A.art('lantern', Math.min(innerWidth, innerHeight) * .5) + '</div><div class="forge-txt"><small>' + esc(T(ok ? 'A lantern is lit' : 'Nearly there')) + '</small><h2>' + esc(L(u.title)) + '</h2><p>' + esc(T(ok ? 'You can show all of this now. Your family can print your certificate.' : 'We will polish these keys, and try again in a few days.')) + '</p><button class="btn pri big" id="fgo">' + esc(T('Continue')) + '</button></div></div>';
        if (ok) { Fx.clack(); Fx.bloom(innerWidth / 2, innerHeight * .42, '#f1d59e', true); }
        A.$('#fgo', host).onclick = function () { afterStop(); };
      }
    });
  }
  /* a mixed set in what they have already mastered: mixing makes it stick, and it never runs out */
  function runPractice(el, s, i) {
    var rng = A.rng(A.seed()), d = A.D(), R = C.rooms[s.room], list = [];
    R.units.forEach(function (u) { u.skills.forEach(function (x) { if (d.keys[x.id] && d.keys[x.id].forged && x.review) list.push(x); }); });
    var n = [0, 0, 8, 12, 15][A.stage()] || 8, steps = [], seen = {};
    for (var t = 0; t < n * 4 && steps.length < n; t++) { var sk = rng.pick(list), q = sk && sk.review(rng), one = Array.isArray(q) ? q[0] : q, sig = one && JSON.stringify([one.p, one.eq, one.a]); if (one && !seen[sig]) { seen[sig] = 1; steps.push(Object.assign({}, one, { ph: 'solo', skill: sk.id })); } }
    if (!steps.length) { Plan.complete(i); afterStop(); return; }
    Player.start(el, { steps: steps, hue: R.hue, rng: rng, mode: 'review', label: ['Practice', 'تدريب'], onExit: function () { A.go('home'); }, onDone: function (res, host) {
      Plan.complete(i); var pct = res.solo ? Math.round(res.soloOk / res.solo * 100) : 0;
      host.innerHTML = '<div class="tres ' + (pct >= 75 ? 'ok' : 'no') + '"><small>' + esc(L(R.name)) + '</small><h2>' + A.num(res.soloOk) + ' / ' + A.num(res.solo) + '</h2><button class="btn pri wide" id="fgo">' + esc(L(['Continue', 'متابعة'])) + '</button></div>';
      $('#fgo', host).onclick = afterStop;
    } });
  }
  /* reading is off the screen, so it only asks for the time it deserves, and trusts them */
  function runRead(el, s, i) {
    var mins = [0, 0, 15, 20, 30][A.stage()] || 15, d = A.D(), info = stopInfo(s);
    el.innerHTML = '<div class="tres"><small>' + esc(L(['Off the screen', 'بعيدًا عن الشاشة'])) + '</small><h2>' + esc(L(info.title)) + '</h2><p>' + esc(L(info.sub)) + '</p><div class="fl-k"><span><b>' + A.num(mins) + '</b>' + esc(L(['minutes', 'دقيقة'])) + '</span></div><button class="btn pri wide" id="r-d">' + esc(L(['I have read', 'قرأت'])) + '</button><a class="btn ghost wide" href="#/home" style="margin-top:8px">' + esc(L(['Later', 'لاحقًا'])) + '</a></div>';
    $('#r-d', el).onclick = function () { d.read = d.read || {}; var k = A.day(); d.read[k] = (d.read[k] || 0) + mins; Plan.complete(i); afterStop(); };
  }
  function runReview(el, s, i) {
    var rng = A.rng(A.seed());
    var ids = rng.shuffle(s.items), steps = [];
    ids.forEach(function (id) { var sk = C.skill(id); if (!sk || !sk.review) return; var st = sk.review(rng); (Array.isArray(st) ? st : [st]).forEach(function (x) { steps.push(Object.assign({}, x, { ph: 'solo', skill: id })); }); });
    if (!steps.length) { Plan.complete(i); afterStop(); return; }
    Player.start(el, {
      steps: steps, hue: 'gold', rng: rng, mode: 'review',
      onExit: function () { A.go('home'); },
      onDone: function (res, host) {
        host.innerHTML = '<div class="forge h-gold"><div class="forge-rays"></div><div class="forge-key">' + keyReveal(Math.min(innerWidth, innerHeight) * .5) + '</div><div class="forge-txt"><small>' + esc(T('Polished')) + '</small><h2>' + esc(T('Your keys shine again')) + '</h2><p>' + esc(T('Remembering makes them stronger.')) + '</p><button class="btn pri big" id="fgo">' + esc(T('Continue')) + '</button></div></div>';
        Fx.clack(); Fx.bloom(innerWidth / 2, innerHeight * .42, '#f1d59e', true);
        A.$('#fgo', host).onclick = function () { Plan.complete(i); afterStop(); };
      }
    });
  }
  /* "We did it" is a child's claim. It waits for a grown-up, and only then counts as seen in real life. */
  function runMission(el, s, i) {
    var m = C.missions[s.id];
    Player.start(el, {
      steps: [Object.assign({ k: 'mission', ph: 'make', skill: m.skill, mid: s.id }, m)], hue: 'teal', mode: 'lesson', skill: m.skill,
      onExit: function () { A.go('home'); },
      onDone: function (res) {
        var st = Plan.today().stops[i];
        if (!(res.solo > 0) && st) st.later = true;
        Plan.complete(i); afterStop();
      }
    });
  }
  /* missions come from skills the child already knows, so they turn knowledge into deeds */
  C.missionToday = function (pid, handsFirst) {
    var ids = Object.keys(C.missions), seed = A.dayNum(), p = A.profile(pid), st = A.stage(p);
    var pool = ids.filter(function (id) { var m = C.missions[id]; return (m.band == null || m.band <= st) && (!m.skill || M.met(m.skill, pid) || m.free); });
    if (!pool.length) return null;
    var d = A.D(pid), recent = {};
    (d.obs || []).slice(-6).forEach(function (o) { recent[o.id] = 1; });
    (d.pending || []).forEach(function (o) { recent[o.id] = 1; });
    var fresh = pool.filter(function (x) { return !recent[x]; });
    var use = fresh.length ? fresh : pool;
    /* a consolidating day is for making things; other days, about one in three */
    var hands = use.filter(function (id) { return C.missions[id].hands; });
    if (hands.length && (handsFirst || seed % 3 === 0)) use = hands;
    return use[seed % use.length];
  };
})();
