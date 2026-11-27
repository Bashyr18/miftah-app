/* Little Steps sessions and the parent area. The parent sees evidence, not vanity: what was learned, what is proven, what to talk about.
   Skills are never averaged into one number. Anything without evidence simply says so. */
(function () {
  'use strict';
  var A = window.A, $ = A.$, $$ = A.$$, esc = A.esc, L = A.L, T = A.T, C = window.C, M = window.M, Plan = window.Plan, Hifz = window.Hifz, I = window.I;
  var SEC = function (b, t) { return t ? '<div class="nur-sec"><b>' + esc(T(b)) + '</b><p>' + esc(L(t)) + '</p></div>' : ''; };

  /* ===== Little Steps: adult card, then one big thing, then a word from the adult ===== */
  A.V.nursery = function (args) {
    var i = +args[0], st = Plan.today().stops[i], n = st && C.nursery[st.id];
    if (!n) return { redirect: 'home' };
    var cleanup = null;
    function adult(v) {
      v.innerHTML = '<div class="ph h-' + n.hue + '"><a class="backp" href="#/home">' + A.icon('back', 18) + '<span>' + esc(T('Today')) + '</span></a><h1>' + esc(L(n.title)) + '</h1><p>' + esc(L(C.experience(n.x))) + '</p></div><div class="wrap"><div class="nur-card h-' + n.hue + '">' + SEC('Before you start', n.adult.prep) + SEC('Say', n.adult.say) + SEC('Show them', n.adult.model) + SEC('Stay safe', n.adult.safety) + SEC('Notice', n.adult.notice) + '</div><button class="btn pri big wide" id="nur-go" style="margin-top:16px">' + esc(T('Start together')) + '</button></div>';
      $('#nur-go', v).onclick = function () { child(v); };
    }
    function child(v) {
      var ch = n.child, html = '';
      v.innerHTML = '<div class="nur-child h-' + n.hue + '"><div id="nur-c" style="display:grid;place-items:center;gap:14px;width:100%"></div><button class="btn sec" id="nur-back" style="position:absolute;bottom:calc(var(--sab) + 20px);opacity:.75">' + A.icon('grown', 20) + '<span>' + esc(T('Grown-up: finish')) + '</span></button></div>';
      var c = $('#nur-c', v), speak = function () { if (ch.speakAr) Voice.say(ch.speakAr, { lang: 'ar' }); else if (ch.cue) Voice.say(L(ch.cue), { lang: A.ar() ? 'ar' : 'en' }); };
      if (ch.kind === 'recite') {
        c.innerHTML = '<button class="nur-big" id="nur-t" aria-label="' + esc(T('Listen')) + '">' + A.art('book', 260, 'float') + '</button>';
        var su = window.QURAN.q[ch.s], a = 0, on = true, runId = 0;
        var startRecite = function () {
          runId++; var my = runId; a = 0; on = true; Voice.stop();
          (function go() { if (!on || my !== runId || a >= su.v.length) return; a++; Voice.ayah(ch.s, a).then(function (ok) { if (ok && on && my === runId) setTimeout(go, 300); }); })();
        };
        $('#nur-t', c).onclick = startRecite;
        startRecite();
        cleanup = function () { on = false; runId++; Voice.stop(); };
      } else if (ch.kind === 'dua') {
        c.innerHTML = '<button class="nur-big" id="nur-t">' + A.art(ch.art, 260, 'float') + '</button>';
        var play = function () { Voice.dua(ch.id); }; $('#nur-t', c).onclick = play; setTimeout(play, 400);
      } else if (ch.kind === 'count') {
        var cnt = 0; var r = A.rng(5);
        c.innerHTML = '<div class="plate" style="width:min(92vw,420px)"><div class="plate-dish"></div>' + Array.apply(null, Array(ch.n)).map(function (_, j) { var q = ch.n <= 3 ? [[25, 50], [50, 50], [75, 50]][j] : [[28, 30], [72, 30], [50, 52], [28, 72], [72, 72]][j]; return '<button class="pl-obj" style="left:' + q[0] + '%;top:' + q[1] + '%;width:94px;height:94px">' + A.art(ch.art, 84) + '<b></b></button>'; }).join('') + '</div>';
        $$('.pl-obj', c).forEach(function (b) { b.onclick = function () { if (b.classList.contains('on')) return; cnt++; b.classList.add('on'); $('b', b).textContent = A.num(cnt); Fx.pop(b); Fx.tap(); Voice.say(A.ar() ? A.num(cnt) : String(cnt), { lang: A.ar() ? 'ar' : 'en' }); if (cnt === ch.n) Fx.bloomAt(c, null, true); }; });
      } else if (ch.kind === 'choose') {
        c.innerHTML = '<div style="display:flex;gap:18px;align-items:flex-end;justify-content:center"><button id="nb" class="float">' + A.art(ch.a, 210) + '</button><button id="ns">' + A.art(ch.a, 96) + '</button></div>';
        setTimeout(speak, 300);
        $('#nb', c).onclick = function () { Fx.bloomAt($('#nb', c), null, true); Fx.ok(); Voice.say(A.ar() ? 'كبير' : 'Big!', { lang: A.ar() ? 'ar' : 'en' }); };
        $('#ns', c).onclick = function () { Fx.pop($('#ns', c)); Fx.tap(); Voice.say(A.ar() ? 'صغير' : 'Small', { lang: A.ar() ? 'ar' : 'en' }); };
      } else if (ch.kind === 'trace') {
        c.innerHTML = '<canvas id="nurc" style="width:92vw;height:62vh;max-width:680px;background:var(--s1);border-radius:30px;touch-action:none"></canvas>';
        var cv = $('#nurc', c), g = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2); cv.width = cv.clientWidth * dpr; cv.height = cv.clientHeight * dpr; g.scale(dpr, dpr); g.lineCap = g.lineJoin = 'round'; g.lineWidth = 18; var dn = false, hue = 0;
        cv.onpointerdown = function (e) { dn = true; cv.setPointerCapture(e.pointerId); g.beginPath(); var r0 = cv.getBoundingClientRect(); g.moveTo(e.clientX - r0.left, e.clientY - r0.top); };
        cv.onpointermove = function (e) { if (!dn) return; var r0 = cv.getBoundingClientRect(); hue = (hue + 2) % 360; g.strokeStyle = 'hsl(' + (35 + Math.sin(hue / 30) * 30) + ',85%,60%)'; g.lineTo(e.clientX - r0.left, e.clientY - r0.top); g.stroke(); g.beginPath(); g.moveTo(e.clientX - r0.left, e.clientY - r0.top); };
        cv.onpointerup = cv.onpointercancel = function () { dn = false; };
        setTimeout(speak, 300);
      } else {
        c.innerHTML = '<button class="nur-big" id="nur-t">' + A.art(ch.art, 260, 'float') + '</button>';
        $('#nur-t', c).onclick = function () { speak(); Fx.bloomAt($('#nur-t', c), null, true); Fx.tap(); };
        setTimeout(speak, 400);
      }
      $('#nur-back', v).onclick = function () { if (cleanup) cleanup(); Voice.stop(); observe(v); };
    }
    function observe(v) {
      v.innerHTML = '<div class="wrap" style="padding-top:calc(var(--sat) + 40px)"><div class="ph-t" style="display:grid;gap:8px;justify-items:center;text-align:center"><h1 style="font-size:26px">' + esc(T('What did you see?')) + '</h1><p style="color:var(--t2)">' + esc(L(n.title)) + '</p></div><div class="obs" style="margin-top:20px">' + C.OBS.map(function (o, k) { return '<button data-o="' + k + '">' + esc(L(o)) + '</button>'; }).join('') + '</div><p class="ref" style="margin-top:16px">' + esc(T('This is for your notes. It is not a mark.')) + '</p></div>';
      $$('[data-o]', v).forEach(function (b) {
        b.onclick = function () {
          var d = A.D(); d.obs.push({ t: A.now().getTime(), kind: 'nursery', id: n.id, title: L(n.title), value: L(C.OBS[+b.dataset.o]) }); M.tally(d, 240000);
          Plan.complete(i); Fx.tap(); A.afterStop();
        };
      });
    }
    return { bare: true, hue: n.hue, html: '<div id="nur"></div>', mount: function (el) { adult($('#nur', el)); }, unmount: function () { if (cleanup) cleanup(); Voice.stop(); } };
  };

  /* ===== the gate: quick for a grown-up, slow for a toddler ===== */
  var unlocked = 0;
  var pinBusy = false;
  var pinRecord = /^v1\$([a-f0-9]{32})\$([a-f0-9]{64})\$([a-f0-9]{64})$/;
  function hex(bytes) { return Array.from(new Uint8Array(bytes), function (b) { return b.toString(16).padStart(2, '0'); }).join(''); }
  function randomCode() { return hex(crypto.getRandomValues(new Uint8Array(16))); }
  function bytes(s) { return new TextEncoder().encode(s); }
  async function pinHash(pin, salt) {
    var key = await crypto.subtle.importKey('raw', bytes(pin), 'PBKDF2', false, ['deriveBits']);
    return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: bytes('miftah-pin:' + salt), iterations: 600000, hash: 'SHA-256' }, key, 256));
  }
  async function recoveryHash(code, salt) { return hex(await crypto.subtle.digest('SHA-256', bytes('miftah-recovery:' + salt + ':' + code))); }
  async function makePin(pin) {
    var salt = randomCode(), code = randomCode();
    return { record: ['v1', salt, await pinHash(pin, salt), await recoveryHash(code, salt)].join('$'), code: code };
  }
  function showRecovery(code) {
    A.sheet(L(['Save your recovery code', 'احفظ رمز الاسترداد']), '<p>' + esc(L(['Keep this code somewhere private. You can use it to clear a forgotten PIN.', 'احتفظ بهذا الرمز في مكان خاص. يمكنك استخدامه لإلغاء رمز والدين منسي.'])) + '</p><p id="gp-recovery-code" dir="ltr" style="overflow-wrap:anywhere;user-select:text"><code>' + esc(code.match(/.{8}/g).join(' ')) + '</code></p>');
  }
  function pinError() { A.toast(L(['PIN security is unavailable here', 'حماية رمز الوالدين غير متاحة هنا'])); }
  A.pinSet = async function (input) {
    var pin = input.value.trim(), state = A.S;
    if (pinBusy || !open()) return;
    if (!/^\d{4,6}$/.test(pin)) { A.toast(L(['Use 4 to 6 digits', 'استعمل ٤ إلى ٦ أرقام'])); return; }
    pinBusy = true;
    try {
      var next = await makePin(pin);
      if (!input.isConnected || state !== A.S || !open()) return;
      state.pin = next.record; state.gate = { a: 0 }; A.saveNow(); A.rerender();
      showRecovery(next.code);
    } catch (e) { pinError(); } finally { pinBusy = false; }
  };
  A.pinClear = function () {
    if (pinBusy || !open() || !A.S.pin) return;
    A.S.pin = ''; A.S.gate = { a: 0 }; A.saveNow(); A.rerender(); A.toast(T('Saved'));
  };
  function pinLockLeft() { var g = A.S.gate || {}; return g.until && g.until > Date.now() ? Math.ceil((g.until - Date.now()) / 1000) : 0; }
  async function checkPin(val, recovery, input) {
    var left = pinLockLeft();
    if (left > 0) { A.toast(L(['Wait ' + left + 's before trying again', 'انتظر ' + A.num(left) + ' ثانية قبل المحاولة'])); return null; }
    var state = A.S, stored = state.pin, record = pinRecord.exec(stored), route = A.route(), match = false, next = null;
    if (recovery) {
      val = val.toLowerCase().replace(/[\s-]/g, '');
      match = record && /^[a-f0-9]{32}$/.test(val) && await recoveryHash(val, record[1]) === record[3];
    } else if (/^\d{4,6}$/.test(val)) {
      match = record ? await pinHash(val, record[1]) === record[2] : val === stored;
      if (match && !record) next = await makePin(val);
    }
    var sheet = input.closest('.sheet');
    if (!input.isConnected || (sheet && !sheetStack.some(function (s) { return s[1] === sheet; })) || route !== A.route() || state !== A.S || state.pin !== stored) return null;
    if (match) {
      if (recovery || next) state.pin = next ? next.record : '';
      state.gate = { a: 0 }; A.saveNow();
      return { code: next && next.code };
    }
    var g = state.gate = state.gate || { a: 0 };
    g.a = (g.a || 0) + 1;
    if (g.a >= 5) g.until = Date.now() + Math.min(240, 30 * Math.pow(2, Math.min(3, g.a - 5))) * 1000;
    A.saveNow();
    return null;
  }
  function pinFields(prefix) {
    return '<input class="tin" id="' + prefix + '-pin" type="password" inputmode="numeric" maxlength="6" autocomplete="off" dir="ltr" aria-label="' + esc(L(['Parent PIN', 'رمز الوالدين'])) + '" placeholder="' + esc(L(['Parent PIN', 'رمز الوالدين'])) + '"><button class="btn pri wide" id="' + prefix + '-go">' + esc(L(['Open', 'فتح'])) + '</button>' + (pinRecord.test(A.S.pin) ? '<button class="btn ghost wide" id="' + prefix + '-recover">' + esc(L(['Use recovery code', 'استخدم رمز الاسترداد'])) + '</button>' : '');
  }
  function bindPin(el, prefix, accept) {
    var i = $('#' + prefix + '-pin', el), go = $('#' + prefix + '-go', el), recover = $('#' + prefix + '-recover', el);
    var usingRecovery = false;
    go.onclick = async function () {
      if (pinBusy) return;
      pinBusy = go.disabled = true;
      try {
        var result = await checkPin(i.value.trim(), usingRecovery, i);
        if (result) { accept(); if (result.code) showRecovery(result.code); }
        else if (i.isConnected) { Fx.shake(i); i.value = ''; }
      } catch (e) { pinError(); } finally { pinBusy = go.disabled = false; }
    };
    i.onkeydown = function (e) { if (e.key === 'Enter') go.click(); };
    if (recover) recover.onclick = function () {
      if (pinBusy) return;
      usingRecovery = !usingRecovery;
      i.value = ''; i.maxLength = usingRecovery ? 48 : 6; i.inputMode = usingRecovery ? 'text' : 'numeric';
      i.placeholder = usingRecovery ? L(['Recovery code', 'رمز الاسترداد']) : L(['Parent PIN', 'رمز الوالدين']);
      i.setAttribute('aria-label', i.placeholder);
      recover.textContent = usingRecovery ? L(['Use parent PIN', 'استخدم رمز الوالدين']) : L(['Use recovery code', 'استخدم رمز الاسترداد']);
      i.focus();
    };
  }
  function mathSum() {
    var r = A.rng(A.seed() ^ (Date.now() & 0xffff)), a = r.int(27, 68), b = r.int(14, 39), ans = a + b;
    var sets = [[10, -10], [10, 20], [-10, -20], [9, -11], [11, -9]], d = r.pick(sets);
    return { a: a, b: b, ans: ans, opts: r.shuffle([ans, ans + d[0], ans + d[1]]) };
  }
  function gate() {
    if (A.S.pin) return {
      bare: true,
      html: '<div class="ph h-gold"><a class="backp" href="#/home">' + A.icon('back', 18) + '<span>' + esc(T('Today')) + '</span></a></div><div class="gate wrap">' + A.art('lock', 90) + '<h1 style="font-size:24px">' + esc(T('For grown-ups')) + '</h1><div style="width:100%;max-width:270px;display:grid;gap:8px">' + pinFields('gp') + '</div></div>',
      mount: function (v) { bindPin(v, 'gp', function () { unlocked = Date.now(); A.rerender(); }); }
    };
    var q = mathSum();
    return {
      bare: true,
      html: '<div class="ph h-gold"><a class="backp" href="#/home">' + A.icon('back', 18) + '<span>' + esc(T('Today')) + '</span></a></div><div class="gate wrap">' + A.art('lock', 90) + '<h1 style="font-size:24px">' + esc(T('For grown-ups')) + '</h1><p id="gp-q" dir="ltr" style="color:var(--t2)">' + A.num(q.a) + ' + ' + A.num(q.b) + ' = ?</p><div class="numrow" id="gp-opts" style="width:100%;max-width:340px">' + q.opts.map(function (o) { return '<button class="numopt" data-v="' + o + '">' + A.num(o) + '</button>'; }).join('') + '</div></div>',
      mount: function (v) {
        function bind(cur) {
          $$('.numopt', v).forEach(function (b) {
            b.onclick = function () {
              if (+b.dataset.v === cur.ans) { unlocked = Date.now(); A.rerender(); return; }
              Fx.shake(b);
              var nq = mathSum();
              $('#gp-q', v).textContent = A.num(nq.a) + ' + ' + A.num(nq.b) + ' = ?';
              $('#gp-opts', v).innerHTML = nq.opts.map(function (o) { return '<button class="numopt" data-v="' + o + '">' + A.num(o) + '</button>'; }).join('');
              bind(nq);
            };
          });
        }
        bind(q);
      }
    };
  }
  function parentRoute() { return /^(parent|place|desk|marking)(\/|$)/.test(A.route()); }
  function open() {
    if (!parentRoute()) unlocked = 0;
    return unlocked !== 0 && Date.now() - unlocked < 20 * 60000;
  }
  A.grownOpen = open;
  A.grownGate = gate;
  /* leaving the parent area locks it again: a child should not walk back in behind you */
  window.addEventListener('hashchange', open);
  function dayMs(d, k) { return Math.max(d.time[k] || 0, (d.screen || {})[k] || 0); }
  /* a quick check before something only a grown-up may decide; does not leave the parent area unlocked when called from a child screen */
  A.askGrown = function (done) {
    if (open()) { done(); return; }
    var route = A.route();
    function accept() {
      A.closeSheet();
      if (A.route() !== route) return;
      if (parentRoute()) unlocked = Date.now();
      done();
    }
    if (A.S.pin) {
      A.sheet(L(['For grown-ups', 'للكبار']), pinFields('g'), function (el) { bindPin(el, 'g', accept); });
      return;
    }
    var q = mathSum();
    A.sheet(T('For grown-ups'), '<p id="g-q" dir="ltr" style="color:var(--t2);text-align:center;font-size:20px">' + A.num(q.a) + ' + ' + A.num(q.b) + ' = ?</p><div class="numrow" id="g-opts" style="margin-top:12px">' + q.opts.map(function (o) { return '<button class="numopt" data-v="' + o + '">' + A.num(o) + '</button>'; }).join('') + '</div>', function (el) {
      function bind(cur) {
        $$('.numopt', el).forEach(function (x) {
          x.onclick = function () {
            if (+x.dataset.v === cur.ans) { accept(); return; }
            Fx.shake(x);
            var nq = mathSum();
            $('#g-q', el).textContent = A.num(nq.a) + ' + ' + A.num(nq.b) + ' = ?';
            $('#g-opts', el).innerHTML = nq.opts.map(function (o) { return '<button class="numopt" data-v="' + o + '">' + A.num(o) + '</button>'; }).join('');
            bind(nq);
          };
        });
      }
      bind(q);
    });
  };

  A.V.parent = function (args) {
    if (!open()) return gate();
    if (args[0] === 'settings') return settings();
    if (args[0] === 'me') return mePage();
    if (args[0] === 'updates') return updatesPage();
    if (args[0] === 'voices') return voices();
    if (args[0] === 'add') return addChild();
    if (args[0] === 'about') return about();
    if (args[0] === 'media') return A.mediaLib();
    if (args[0] && args[1] === 'sheet') return sheetView(args[0], args[2], args[3]);
    if (args[0] && args[1] === 'mark') return markView(args[0], args[2]);
    if (args[0]) return child(args[0], args[1] || 'today');
    return A.family();
  };
  function head(title, sub, back, label, right) { return '<div class="ph h-gold"><a class="backp" href="#/' + back + '">' + A.icon('back', 18) + '<span>' + esc(label) + '</span></a><h1>' + esc(title) + '</h1>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + (right || '') + '</div>'; }
  function hrs(ms) { var m = Math.round(ms / 60000); if (m < 60) return A.num(m) + ' ' + T('min'); return A.num(Math.floor(m / 60)) + ' ' + T('h') + ' ' + A.num(m % 60) + ' ' + T('min'); }
  function week(pid) { var d = A.D(pid), out = [], now = A.now(); for (var i = 6; i >= 0; i--) { var x = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i), k = A.day(x); out.push({ k: k, ms: dayMs(d, k), l: x.toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en', { weekday: 'narrow' }) }); } return out; }

  function addChild() {
    return { html: '<div class="ph h-gold"><a class="backp" href="#/parent">' + A.icon('back', 18) + '<span>' + esc(T('Parents')) + '</span></a></div><div class="wrap" id="af" style="display:grid;gap:14px;justify-items:center;padding-top:10px"></div>', mount: function (v) { A.V.__form($('#af', v), null, function (p) { A.placeDefault(p); A.saveNow(); A.go('parent'); }); } };
  }
  /* an older child need not start with the alphabet of maths: they are placed, and the parent can move it */
  A.placeDefault = function (p) {
    if (A.stage(p) < 2) return;
    var d = A.D(p.id);
    ['math', 'english'].forEach(function (r) { C.rooms[r].units.forEach(function (u) { if (u.band === 1) u.skills.forEach(function (s) { d.placed[s.id] = 1; }); }); });
  };

  /* ===== one child ===== */
  var TABS = [['today', ['Today', 'اليوم']], ['log', ['Lessons', 'الدروس']], ['plan', ['Plan', 'الخطة']], ['make', ['Print', 'طباعة']], ['hear', ['Qurʾān', 'القرآن']], ['rooms', ['Subjects', 'المواد']], ['talk', ['Discuss', 'نقاش']], ['record', ['Record', 'السجل']], ['set', ['Setup', 'الإعداد']]];
  function child(pid, tab) {
    var p = A.profile(pid); if (!p) return { redirect: 'parent' };
    var html = { today: tToday, log: function (q) { return A.tLog(q); }, plan: tPlan, make: tMake, hear: tHear, rooms: tRooms, talk: tTalk, record: tRecord, set: tSet }[tab] || tToday;
    var r = html(p);
    if (tab === 'today' && r.parts && A.tDash) r = { html: A.tDash(p, r.parts), mount: r.mount };
    return {
      html: head(p.name, (A.stage(p) === 0 ? L(['Early years', 'الطفولة المبكرة']) : L(C.yearName(Flow.yearOf(p)))) + ' · ' + L(['age ', 'العمر ']) + A.num(A.age(p)), 'parent', T('Parents'), tab === 'set' ? '' : '<a class="abtn" href="#/parent/' + pid + '/set" aria-label="' + esc(T('Setup')) + '" title="' + esc(T('Setup')) + '">' + A.icon('gear', 20) + '</a>') + '<div class="tabs" style="margin-top:10px">' + TABS.map(function (t) { return '<a class="tab ' + (t[0] === tab ? 'on' : '') + '" href="#/parent/' + pid + '/' + t[0] + '">' + esc(L(t[1])) + '</a>'; }).join('') + '</div><div class="wrap">' + r.html + '</div>',
      mount: r.mount
    };
  }
  function stopLabel(s) {
    if (s.t === 'practice') return L(['Practice', 'تدريب']) + ' · ' + L(C.rooms[s.room].name);
    if (s.t === 'read') return L(['Reading', 'القراءة']);
    if (s.t === 'review') return L(['Review', 'مراجعة']) + ' · ' + A.num(s.items.length);
    if (s.t === 'hifz') return T('Qurʾān');
    if (s.t === 'mission') return T('A real deed');
    if (s.t === 'move') return T('Move your body');
    if (s.t === 'check') return T('Show what you know') + ' · ' + L(C.units[s.unit].title);
    if (s.t === 'nursery') return L(C.nursery[s.id].title);
    return L(C.skill(s.s).title);
  }
  function listOf(ids) { return ids.map(function (x) { return L(C.skill(x).title); }).join(' · '); }
  function weekly(p) {
    var w = M.week(p.id), row = function (t, ids, none) { return '<div class="li wk"><span class="grow"><b>' + esc(T(t)) + (ids.length ? ' · ' + A.num(ids.length) : '') + '</b><small>' + esc(ids.length ? listOf(ids.slice(0, 6)) : T(none)) + '</small></span></div>'; };
    return '<div class="card"><h3>' + esc(T('This week')) + '</h3><div class="lst">' + row('New keys', w.learned, 'None yet') + row('Proven', w.proven, 'None yet') + row('Stuck: needs you', w.stuck, 'Nothing is stuck') + '</div></div>';
  }
  function tToday(p) {
    var pl = Plan.today(p.id), wk = week(p.id), mx = Math.max.apply(null, wk.map(function (x) { return x.ms; }).concat([60000])), d = A.D(p.id);
    var due = M.due(p.id).length, st = A.stage(p);
    var hz = st > 0 ? Hifz.state(p.id) : null, pend = d.pending || [];
    var conf = pend.length ? '<div class="card pending"><h3>' + esc(T('Did this really happen?')) + '</h3><p class="ref" style="text-align:start;margin-bottom:8px">' + esc(T('They said they did these. Only a grown-up can confirm a deed.')) + '</p><div class="lst">' + pend.map(function (x) { return '<div class="li"><span class="grow"><b>' + esc(L(x.title)) + '</b><small>' + esc(new Date(x.t).toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en', { day: 'numeric', month: 'short' })) + '</small></span><span class="li-acts"><button class="btn sm sec" data-conf="1" data-id="' + x.id + '">' + esc(T('Yes')) + '</button><button class="btn sm ghost" data-conf="0" data-id="' + x.id + '">' + esc(T('Not yet')) + '</button></span></div>'; }).join('') + '</div></div>' : '';
    var used = Math.round(Plan.used(p.id) / 60000);
    var sheets = (d.sheets || []).filter(Print.waiting), promises = (p.promises || []).filter(function (x) { return x.fired && !x.kept; });
    var sday = function (t) { return new Date(t).toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en', { day: 'numeric', month: 'short' }); };
    /* the code printed on a sheet tells two copies apart: shown only when two waiting sheets share a title */
    var dupT = {}; sheets.forEach(function (x) { var k = Print.titleOf(x); dupT[k] = (dupT[k] || 0) + 1; });
    var codeOf = function (x) { return dupT[Print.titleOf(x)] > 1 ? ' · ' + esc(x.id) : ''; };
    var sheetsH = sheets.length ? '<div class="card pending"><h3>' + esc(L(['Sheets waiting for you', 'أوراق تنتظرك'])) + '</h3><div class="lst">' + sheets.map(function (x) {
      if (x.q) return '<a class="li" href="#/parent/' + p.id + '/mark/' + x.id + '">' + A.icon(x.scr ? 'pen' : 'print', 20) + '<span class="grow"><b>' + esc(Print.titleOf(x)) + '</b><small>' + esc(x.scr ? Print.status(x) : L(['To mark', 'للتصحيح'])) + ' · ' + esc(sday(x.t)) + codeOf(x) + '</small></span>' + A.icon('next', 20).replace('class="ic"', 'class="ic ic-flip"') + '</a>';
      if (x.scr && x.sub) return '<a class="li" href="#/parent/' + p.id + '/mark/' + x.id + '">' + A.icon('pen', 20) + '<span class="grow"><b>' + esc(Print.titleOf(x)) + '</b><small>' + esc(Print.status(x)) + ' · ' + esc(sday(x.sub)) + '</small></span>' + A.icon('next', 20).replace('class="ic"', 'class="ic ic-flip"') + '</a>';
      return '<div class="li">' + A.icon('print', 20) + '<span class="grow"><b>' + esc(Print.titleOf(x)) + '</b><small>' + esc(sday(x.t)) + codeOf(x) + '</small></span><span class="li-acts"><button class="btn sm sec" data-sdone="' + x.id + '">' + esc(L(['Done', 'أُنجزت'])) + '</button><button class="btn sm sec" data-sskip="' + x.id + '">' + esc(L(['Not used', 'لم تُستعمل'])) + '</button></span></div>';
    }).join('') + '</div></div>' : '';
    var promH = promises.length ? '<div class="card pending"><h3>' + esc(T('A promise earned')) + '</h3><div class="lst">' + promises.map(function (x) { return '<div class="li"><span class="grow"><b>' + esc(x.what) + '</b></span><button class="btn sm sec" data-kept="' + x.id + '">' + esc(T('Kept it')) + '</button></div>'; }).join('') + '</div></div>' : '';
    var whyH = (pl.why || []).length ? '<p class="ref why">' + (pl.why || []).map(function (w) { return esc(L(w)); }).join(' ') + '</p>' : '';
    var pathCard = '<div class="card"><h3>' + esc(T('Today’s path')) + '</h3>' + whyH + '<div class="lst">' + pl.stops.map(function (s, i) { return '<div class="li">' + '<span class="stepn' + (s.done ? ' ok' : '') + '">' + (s.done ? A.icon('check', 14) : A.num(i + 1)) + '</span><span class="grow"><b style="' + (s.done ? 'color:var(--t3)' : '') + '">' + esc(stopLabel(s)) + '</b></span>' + (s.done ? '' : '<button class="btn sm ghost" data-skip="' + i + '">' + esc(L(['Skip', 'تخطَّ'])) + '</button>') + '</div>'; }).join('') + '</div></div>';
    return {
      parts: { conf: conf, sheets: sheetsH, prom: promH, path: pathCard },
      html: conf + sheetsH + promH + (st > 0 ? weekly(p) : '') +
        '<div class="card"><h3>' + esc(T('Today’s path')) + '</h3>' + whyH + '<div class="lst">' + pl.stops.map(function (s, i) { return '<div class="li">' + (s.done ? A.icon('check', 20) : A.icon('path', 20)) + '<span class="grow"><b style="' + (s.done ? 'color:var(--t3)' : '') + '">' + esc(stopLabel(s)) + '</b>' + (s.skipped ? '<small>' + esc(T('Skipped by a grown-up')) + '</small>' : '') + '</span>' + (s.done ? '' : '<button class="btn sm ghost" data-skip="' + i + '">' + esc(T('Skip today')) + '</button>') + '</div>'; }).join('') + '</div><p class="ref" style="margin-top:8px;text-align:start">' + esc(T('Used today')) + ': ' + A.num(used) + ' / ' + A.num(Plan.limit(p) + (d.extra[A.day()] || 0)) + ' ' + esc(T('min')) + '</p></div>' +
        '<div class="card"><h3>' + esc(T('Time this week')) + '</h3><div class="bars">' + wk.map(function (x) { return '<div><i style="height:' + Math.max(2, Math.round(x.ms / mx * 76)) + 'px"></i><small>' + esc(x.l) + '</small></div>'; }).join('') + '</div><p class="ref" style="margin-top:8px">' + esc(T('Total')) + ': ' + hrs(wk.reduce(function (a, x) { return a + x.ms; }, 0)) + '</p></div>' +
        (hz ? '<div class="card"><h3>' + esc(T('Qurʾān')) + '</h3><p style="color:var(--t2);line-height:1.45">' + esc(T('Now learning')) + ': <b style="color:var(--t1)">' + esc(window.QURAN.order[hz.i] ? A.surahName(window.QURAN.order[hz.i]) : '') + '</b> · ' + esc(T('Āyah')) + ' ' + A.num(hz.a) + '<br>' + esc(T('Finished sūrahs')) + ': ' + A.num((hz.finished || []).length) + ' · ' + esc(T('Āyāt kept')) + ': ' + A.num(Object.keys(hz.u).length) + '</p></div>' : '') +
        '<div class="card"><h3>' + esc(L(['Progress', 'التقدم'])) + '</h3><p style="color:var(--t2);line-height:1.5">' + esc(L(['Learned', 'تعلّم'])) + ': ' + A.num(M.counts(p.id).forged) + ' · ' + esc(L(['Remembered', 'ثبت'])) + ': ' + A.num(M.counts(p.id).proven) + ' · ' + esc(L(['Long-term', 'طويل الأمد'])) + ': ' + A.num(M.counts(p.id).deep) + '<br>' + esc(L(['Due for review', 'تحتاج مراجعة'])) + ': ' + A.num(due) + '</p></div>',
      mount: function (v) {
        $$('[data-conf]', v).forEach(function (b) { b.onclick = function () { M.confirm(b.dataset.id, b.dataset.conf === '1', p.id); A.rerender(); }; });
        $$('[data-sdone]', v).forEach(function (b) { b.onclick = function () { Print.done(b.dataset.sdone, true, p.id); A.toast(T('Saved')); A.rerender(); }; });
        $$('[data-sskip]', v).forEach(function (b) { b.onclick = function () { Print.done(b.dataset.sskip, false, p.id); A.rerender(); }; });
        $$('[data-kept]', v).forEach(function (b) { b.onclick = function () { var x = (p.promises || []).filter(function (q) { return q.id === b.dataset.kept; })[0]; if (x) { x.kept = A.now().getTime(); A.saveNow(); A.rerender(); } }; });
        $$('[data-skip]', v).forEach(function (b) { b.onclick = function () { var x = Plan.today(p.id).stops[+b.dataset.skip]; if (x) { x.done = true; x.skipped = true; A.saveNow(); A.rerender(); } }; });
      }
    };
  }
  /* ===== the plan: what the engine expects, and why ===== */
  function tPlan(p) {
    if (A.stage(p) === 0) return { html: '<div class="card"><p style="color:var(--t2);line-height:1.5">' + esc(T('Little Steps has no plan to follow: two short things a day, led by you, mostly real play.')) + '</p></div>' };
    var days = Flow.preview(p.id, 7), pr = Flow.prep(p.id), lang = A.ar() ? 'ar-u-nu-arab' : 'en', pace = Flow.pace(p.id);
    var rows = days.map(function (d) { return '<div class="li"><span class="pl-day">' + esc(d.date.toLocaleDateString(lang, { weekday: 'short' })) + '</span><span class="grow">' + (d.kind === 'rest' ? '<small>' + esc(T('Rest: the Qurʾān and something real')) + '</small>' : d.kind === 'light' ? '<small>' + esc(L(['Review and make: no new lessons', 'مراجعة وصنع، بلا دروس جديدة'])) + '</small>' : d.lessons.length ? d.lessons.map(function (s) { return '<b class="h-' + C.rooms[s.room].hue + '"><i class="rdot"></i>' + esc(L(s.title)) + '</b>'; }).join('') : '<small>' + esc(L(['Every open lesson is done', 'أنجز كل الدروس المتاحة'])) + '</small>') + '</span></div>'; }).join('');
    var fore = C.order.filter(function (r) { return r !== 'quran' && !(p.off || {})[r] && Flow.forecast(r, p.id).total > 0; }).map(function (r) { var f = Flow.forecast(r, p.id), R = C.rooms[r], pct = f.total ? Math.round((f.total - f.left) / f.total * 100) : 0; return '<div class="fore h-' + R.hue + '"><div class="fore-h"><b>' + esc(L(R.name)) + '</b><small>' + (f.left === 0 ? esc(T('Done at this stage')) : f.weeks ? esc(T('About')) + ' ' + A.num(f.weeks) + ' ' + esc(T('weeks left')) : '') + '</small></div><span class="portal-p" style="width:100%;max-width:none"><i style="width:' + pct + '%"></i></span><small class="fore-n">' + A.num(f.total - f.left) + ' / ' + A.num(f.total) + '</small></div>'; }).join('');
    var need = pr.need.length ? '<div class="card"><h3>' + esc(T('To have ready for tomorrow')) + '</h3><div class="lst">' + pr.need.map(function (x) { return '<div class="li">' + A.art(x.m.art, 34) + '<span class="grow"><b>' + esc(L(x.m.materials)) + '</b><small>' + esc(L(x.m.t)) + '</small></span></div>'; }).join('') + '</div></div>' : '';
    return { html: '<div class="card card-wide"><h3>' + esc(T('How the plan is made')) + '</h3><p style="color:var(--t2);line-height:1.5;font-size:14.500px">' + esc(T('Each morning the path is rebuilt from what they remember. Fading keys come first, then the Qurʾān, then new doors from whichever room is furthest behind. Trouble slows it down, and strength speeds it up.')) + '</p><p class="ref why">' + esc(L(['New lessons a day', 'الدروس الجديدة يوميًا'])) + ': ' + A.num(pace.news) + (pace.why.length ? '. ' + pace.why.map(function (w) { return esc(L(w)); }).join(' ') : '') + '</p></div>' + need + '<div class="card"><h3>' + esc(T('The week ahead')) + '</h3><div class="lst">' + rows + '</div><p class="ref" style="margin-top:8px;text-align:start">' + esc(T('A forecast. It changes as they learn. To teach something sooner, open it from Rooms and choose Teach this next.')) + '</p></div><div class="card"><h3>' + esc(T('How far along')) + '</h3>' + fore + '</div>' };
  }
  /* ===== make: paper that knows the child ===== */
  function tMake(p) {
    var list = Print.available(p.id), sug = Print.suggest(p.id), byG = {};
    list.forEach(function (k) { (byG[k.group] = byG[k.group] || []).push(k); });
    var row = function (k) { return '<a class="li" href="#/parent/' + p.id + '/sheet/' + k.id + '">' + A.icon('print', 22) + '<span class="grow"><b>' + esc(L(k.title)) + '</b><small>' + esc(L(k.desc)) + '</small></span>' + A.icon('next', 20).replace('class="ic"', 'class="ic ic-flip"') + '</a>'; };
    var sugH = sug.length ? '<div class="card pending"><h3>' + esc(T('Good for today')) + '</h3><div class="lst">' + sug.map(function (id) { return row(Print.KINDS[id]); }).join('') + '</div></div>' : '';
    var log = (A.D(p.id).sheets || []).slice(-8).reverse();
    var dupL = {}; log.forEach(function (x) { var k = Print.titleOf(x); dupL[k] = (dupL[k] || 0) + 1; });
    var logH = log.length ? '<div class="card"><h3>' + esc(L(['Printed', 'ما طُبع'])) + '</h3><div class="lst">' + log.map(function (x) {
      var wait = Print.waiting(x), href = x.q && wait ? '#/parent/' + p.id + '/mark/' + x.id : Print.KINDS[x.kind] && x.seed ? '#/parent/' + p.id + '/sheet/' + x.kind + '/' + x.seed : '';
      return (href ? '<a class="li" href="' + href + '">' : '<div class="li">') + A.icon('print', 20) + '<span class="grow"><b>' + esc(Print.titleOf(x)) + '</b><small>' + esc(new Date(x.t).toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en', { day: 'numeric', month: 'short' })) + (dupL[Print.titleOf(x)] > 1 ? ' · ' + esc(x.id) : '') + (x.n > 1 ? ' · ' + A.num(x.n) + '×' : '') + '</small></span><span class="sh-st' + (wait ? ' on' : '') + '">' + esc(Print.status(x)) + '</span>' + (href ? '</a>' : '</div>');
    }).join('') + '</div><p class="ref" style="margin-top:8px;text-align:start">' + esc(L(['Tap one to print the same version again, or to mark it.', 'المس واحدة لتطبع النسخة نفسها مرة أخرى أو لتصحّحها.'])) + '</p></div>' : '';
    return { html: '<div class="card card-wide"><p style="color:var(--t2);line-height:1.5;font-size:14.500px">' + esc(T('Every sheet is made fresh from what this child knows today. Practice sheets can be marked here afterwards, and count as real work.')) + '</p></div>' + sugH + logH + Print.GROUPS.map(function (g) { return byG[g[0]] ? '<div class="card"><h3>' + esc(T(g[1])) + '</h3><div class="lst">' + byG[g[0]].map(row).join('') + '</div></div>' : ''; }).join('') };
  }
  function sheetView(pid, kindId, again) {
    var p = A.profile(pid), k = Print.KINDS[kindId]; if (!p || !k) return { redirect: 'parent' };
    /* a seed in the address is a sheet printed before: the same version, with its own code, and its language choice */
    var old = again ? (A.D(pid).sheets || []).filter(function (x) { return x.kind === kindId && String(x.seed) === String(again); })[0] : null;
    var res = null, seed = again ? +again : A.seed(), opts = old && old.opts ? Object.assign({}, old.opts) : {};
    function build(v) {
      res = Print.make(kindId, pid, seed, opts); if (res) res.opts = Object.assign({}, opts);
      var box = $('#ppv', v);
      if (!res) { box.innerHTML = '<div class="card"><p style="color:var(--t2)">' + esc(T('Nothing to make yet. After a few lessons, this fills up with their own work.')) + '</p></div>'; box.classList.add('none'); box.style.height = 'auto'; $('#pp-go', v).disabled = true; return; }
      box.classList.remove('none'); $('#pp-go', v).disabled = false;
      box.innerHTML = '<style>' + Print.CSS.replace('@page{size:A4;margin:11mm}', '') + '</style><div class="ppz">' + res.html + '</div>';
      /* the paper is A4 wide; the preview shows it true to shape, scaled to the phone */
      var z = $('.ppz', box), w = box.clientWidth || 340, sc = w / 810; z.style.transform = 'scale(' + sc + ')'; box.style.height = (z.scrollHeight * sc + 8) + 'px';
    }
    return {
      html: '<div class="ph h-gold"><a class="backp" href="#/parent/' + pid + '/make">' + A.icon('back', 18) + '<span>' + esc(T('Make')) + '</span></a><h1>' + esc(L(k.title)) + '</h1><p>' + esc(L(k.desc)) + '</p></div><div class="wrap" style="margin-top:12px"><div class="pp-acts"><button class="btn pri" id="pp-go">' + A.icon('print', 20) + '<span>' + esc(T('Print or save as PDF')) + '</span></button>' + (Print.canScreen && Print.canScreen(kindId) ? '<button class="btn sec" id="pp-scr">' + A.icon('pen', 18) + '<span>' + esc(L(['Do it on screen', 'أنجزها على الشاشة'])) + '</span></button>' : '') + '<button class="btn sec" id="pp-new">' + esc(T('A new version')) + '</button>' + (kindId === 'floor' || kindId === 'bingo' ? '<button class="btn sec" id="pp-lang">' + esc(T('Arabic or English')) + '</button>' : '') + (k.screen ? '<a class="btn sec" href="#/cards/' + pid + '/' + kindId + '">' + esc(T('Use on screen')) + '</a>' : '') + '</div><div class="ppv" id="ppv"></div></div>',
      mount: function (v) {
        build(v);
        $('#pp-new', v).onclick = function () { seed = A.seed(); build(v); };
        var lg = $('#pp-lang', v); if (lg) lg.onclick = function () { opts.pool = opts.pool === 'en' ? 'ar' : 'en'; build(v); };
        var sc = $('#pp-scr', v); if (sc) sc.onclick = function () {
          if (!res) return; var sh = Print.toScreen(res, pid); if (!sh) return; var made = res; res = null; seed = A.seed(); build(v);
          var step = function (ic, t) { return '<li><span>' + A.icon(ic, 18) + '</span>' + esc(L(t)) + '</li>'; };
          A.sheet(L(['On ' + p.name + '’s home', 'على صفحة ' + p.name]), '<ol class="ink-sent">' + step('pen', ['Written on screen, saved as they go', 'تُكتب على الشاشة وتُحفظ أولًا بأول']) + step('check', ['Finished, then back to you to mark', 'بعد «انتهيت» تعود إليك للتصحيح']) + step('swap', ['On their phone too, once joined', 'وعلى هاتفه أيضًا بعد الربط']) + '</ol><div class="ink-sent-b"><button class="btn pri big wide" id="scr-now">' + A.icon('pen', 20) + '<span>' + esc(L(['Open it now, here', 'افتحها الآن هنا'])) + '</span></button><button class="btn ghost wide" id="scr-later">' + esc(L(['Later', 'لاحقًا'])) + '</button></div>', function (box) {
            $('#scr-now', box).onclick = function () { A.closeSheet(); A.S.cur = pid; A.saveNow(); A.go('sheet/' + sh.id); };
            $('#scr-later', box).onclick = function () { A.closeSheet(); A.go('parent/' + pid + '/today'); };
          });
        };
        $('#pp-go', v).onclick = function () { if (!res) return; Print.keep(res, pid); Print.send(res.html, 'Miftah ' + res.title); if (res.q) A.toast(T('It will wait in Today, ready to mark')); else if (res.use === 'do') A.toast(L(['It will wait in Today, to tick when it is done', 'ستنتظر في «اليوم» لتُشير إليها عند إنجازها'])); };
      }
    };
  }
  /* marking a sheet: one tap per question, with the answers in front of you; completed on-screen sheets stay open for PDF export */
  function markView(pid, code) {
    var d = A.D(pid), sh = (d.sheets || []).filter(function (x) { return x.id === code; })[0]; if (!sh) return { redirect: 'parent/' + pid };
    var onScreen = !!(sh.scr && (sh.sub || sh.marked || sh.done) && window.Ink), readOnly = !!(sh.marked || sh.done), stop = null;
    var inkH = onScreen ? '<div class="card mk-ink"><h3>' + esc(L(['Their page', 'صفحته'])) + '<small>' + esc(readOnly ? L(['Saved with your marks. Print or save as PDF any time.', 'محفوظة مع تصحيحك. اطبعها أو احفظها PDF في أي وقت.']) : L(['Write on it in red if you like: they will see your marks.', 'اكتب عليها بالأحمر إن شئت، وسيرى تصحيحك.'])) + '</small></h3><div id="mk-ink" class="ink-host in-card"></div></div>' : '';
    /* a worksheet done on screen: done well, or another go with their writing kept */
    if (!sh.q) {
      if (!onScreen) return { redirect: 'parent/' + pid + '/today' };
      return {
        html: '<div class="ph h-gold"><a class="backp" href="#/parent/' + pid + '/' + (readOnly ? 'record' : 'today') + '">' + A.icon('back', 18) + '<span>' + esc(readOnly ? T('Record') : T('Today')) + '</span></a><h1>' + esc(Print.titleOf(sh)) + '</h1><p>' + esc(readOnly ? L(['Checked on screen.', 'تمت مراجعتها على الشاشة.']) : L(['Done on screen. Look it over together.', 'أُنجزت على الشاشة. راجعاها معًا.'])) + ' · ' + esc(code) + '</p></div><div class="wrap mk-wrap">' + inkH + '<div class="mk-acts">' +
          (readOnly ? '<button class="btn pri big" id="mk-print">' + A.icon('print', 18) + '<span>' + esc(L(['Print or save as PDF', 'اطبع أو احفظ PDF'])) + '</span></button><a class="btn sec big" href="#/parent/' + pid + '/today">' + esc(L(['Back to Today', 'العودة إلى اليوم'])) + '</a>'
            : '<button class="btn pri big" id="mk-done">' + esc(L(['Done well', 'أُنجزت جيدًا'])) + '</button><button class="btn sec big" id="mk-again">' + esc(L(['Another go', 'محاولة أخرى'])) + '</button><button class="btn ghost big" id="mk-print">' + A.icon('print', 18) + '<span>' + esc(L(['Print or PDF', 'طباعة أو PDF'])) + '</span></button>') + '</div></div>',
        mount: function (v) {
          stop = Ink.mount($('#mk-ink', v), sh, pid, readOnly ? 'view' : 'parent');
          var dn = $('#mk-done', v); if (dn) dn.onclick = function () { Print.done(code, true, pid); A.toast(T('Saved')); A.rerender(); };
          var ag = $('#mk-again', v); if (ag) ag.onclick = function () { Print.again(code, pid); A.toast(L(['Back on their home, with their writing kept', 'عادت إلى صفحته الرئيسية مع كتابته'])); A.go('parent/' + pid + '/today'); };
          var pr = $('#mk-print', v); if (pr) pr.onclick = function () { Ink.print(sh, pid); };
        },
        unmount: function () { if (stop) stop(); }
      };
    }
    if (readOnly) {
      return {
        html: '<div class="ph h-gold"><a class="backp" href="#/parent/' + pid + '/record">' + A.icon('back', 18) + '<span>' + esc(T('Record')) + '</span></a><h1>' + esc(Print.titleOf(sh)) + '</h1><p>' + esc(L(['Marked', 'صُحّحت'])) + ' · ' + A.num(sh.right) + ' / ' + A.num(sh.q.length) + ' · ' + esc(code) + '</p></div><div class="wrap mk-wrap' + (onScreen ? ' has-ink' : '') + '" style="margin-top:12px">' + inkH + '<div class="mk-side"><div class="card"><h3>' + esc(L(['Saved score', 'النتيجة المحفوظة'])) + '</h3><p style="font-size:22px;font-weight:800;margin:4px 0 8px">' + A.num(sh.right) + ' / ' + A.num(sh.q.length) + '</p><p style="color:var(--t2);font-size:13.5px;line-height:1.45">' + esc(L(['This marking is already in their learning record.', 'هذا التصحيح محفوظ بالفعل في سجل تعلّمه.'])) + '</p></div>' + (onScreen ? '<button class="btn pri big wide" id="mk-print" style="margin-top:12px">' + A.icon('print', 18) + '<span>' + esc(L(['Print or save as PDF', 'اطبع أو احفظ PDF'])) + '</span></button>' : '') + '<a class="btn sec wide" href="#/parent/' + pid + '/today" style="margin-top:8px">' + esc(L(['Back to Today', 'العودة إلى اليوم'])) + '</a></div></div>',
        mount: function (v) {
          if (onScreen) stop = Ink.mount($('#mk-ink', v), sh, pid, 'view');
          var pr = $('#mk-print', v); if (pr) pr.onclick = function () { Ink.print(sh, pid); };
        },
        unmount: function () { if (stop) stop(); }
      };
    }
    var right = sh.q.map(function () { return true; });
    return {
      html: '<div class="ph h-gold"><a class="backp" href="#/parent/' + pid + '/today">' + A.icon('back', 18) + '<span>' + esc(T('Today')) + '</span></a><h1>' + esc(Print.titleOf(sh)) + '</h1><p>' + esc(T('Tap any they did not get. Be honest: it decides what comes back.')) + ' · ' + esc(code) + '</p></div><div class="wrap mk-wrap' + (onScreen ? ' has-ink' : '') + '" style="margin-top:12px">' + inkH + '<div class="mk-side"><div class="card"><div class="lst">' + sh.q.map(function (q, i) { return '<button class="li mk" data-i="' + i + '"><span class="mk-c on">' + A.icon('check', 18) + '</span><span class="grow"><small class="mk-q">' + A.num(i + 1) + '. ' + esc(A.powText(String(q.h)).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim().slice(0, 70)) + '</small><b>' + esc(q.a) + '</b></span></button>'; }).join('') + '</div></div><button class="btn pri big wide" id="mk-go" style="margin-top:12px">' + esc(T('Save the marking')) + '</button>' + (onScreen ? '<button class="btn sec wide" id="mk-print" style="margin-top:8px">' + A.icon('print', 18) + '<span>' + esc(L(['Print or save as PDF', 'اطبع أو احفظ PDF'])) + '</span></button><button class="btn ghost wide" id="mk-again" style="margin-top:6px">' + esc(L(['Not ready to mark: give it back', 'ليست جاهزة للتصحيح: أعِدها'])) + '</button>' : '') + '</div></div>',
      mount: function (v) {
        if (onScreen) stop = Ink.mount($('#mk-ink', v), sh, pid, 'parent');
        $$('.mk', v).forEach(function (b) { b.onclick = function () { var i = +b.dataset.i; right[i] = !right[i]; var c = $('.mk-c', b); c.classList.toggle('on', right[i]); c.innerHTML = A.icon(right[i] ? 'check' : 'close', 18); Fx.tap(); }; });
        $('#mk-go', v).onclick = function () { Print.mark(code, right, pid); A.toast(T('Saved')); if (onScreen) A.rerender(); else A.go('parent/' + pid + '/today'); };
        var pr = $('#mk-print', v); if (pr) pr.onclick = function () { Ink.print(sh, pid); };
        var ag = $('#mk-again', v); if (ag) ag.onclick = function () { Print.again(code, pid); A.toast(L(['Back on their home, with their writing kept', 'عادت إلى صفحته الرئيسية مع كتابته'])); A.go('parent/' + pid + '/today'); };
      },
      unmount: function () { if (stop) stop(); }
    };
  }
  /* ===== the family's media ===== */
  function attachOptions(cur) {
    var h = ''; C.order.forEach(function (rid) {
      var r = C.rooms[rid]; h += '<optgroup label="' + esc(L(r.name)) + '"><option value="room:' + rid + '"' + (cur === 'room:' + rid ? ' selected' : '') + '>' + esc(L(r.name)) + ' · ' + esc(T('whole subject')) + '</option>';
      r.units.forEach(function (u) { h += '<option value="unit:' + u.id + '"' + (cur === 'unit:' + u.id ? ' selected' : '') + '>' + esc(L(u.title)) + '</option>'; u.skills.forEach(function (s) { h += '<option value="skill:' + s.id + '"' + (cur === 'skill:' + s.id ? ' selected' : '') + '>   ' + esc(L(s.title)) + '</option>'; }); });
      h += '</optgroup>';
    }); return h;
  }
  function attachName(a) { if (a.type === 'room') return L(C.rooms[a.id].name); if (a.type === 'unit') return C.units[a.id] ? L(C.units[a.id].title) : ''; var s = C.skill(a.id); return s ? L(s.title) : ''; }
  /* a person hears the āyāt: the only grading that is not the child's own */
  function tHear(p) {
    if (A.stage(p) === 0) return { html: '<div class="card"><p style="color:var(--t2);line-height:1.5">' + esc(T('At this age they listen. Memorising and hearing start with Explorers.')) + '</p></div>' };
    Voice.refreshVoices();
    var h = Hifz.state(p.id), d = A.D(p.id), list = Hifz.toHear(p.id, 8), Q = window.QURAN, recsMap = d.recs || {};
    var self = 0, heard = 0; (h.log || []).forEach(function (x) { if (x.by === 'parent') heard++; else self++; });
    function recCtl(sn, an) {
      var k = sn + ':' + an; if (!recsMap[k]) return '';
      var rk = Voice.savedRecKey(p.id, sn, an);
      if (rk) return '<button class="btn pri sm" data-a="play-rec" data-k="' + esc(rk) + '">' + A.icon('play', 16) + '<span>' + esc(L(['Play child’s recording', 'استمع إلى تسجيل الطفل'])) + '</span></button>';
      return '<span class="hear-na">' + esc(L(['Recording unavailable on this device', 'التسجيل غير متاح على هذا الجهاز'])) + '</span>';
    }
    var allRecs = Object.keys(recsMap).filter(function (k) { var q = k.split(':'); return Q.q[+q[0]] && Q.q[+q[0]].v[+q[1] - 1]; }).sort(function (x, y) { return recsMap[y] - recsMap[x]; });
    var savedBlock = allRecs.length ? '<div class="card' + (allRecs.some(function (k) { var u = h.u[k]; return !u || !u.heard || u.heard < recsMap[k]; }) ? ' pending' : '') + '"><h3>' + esc(L(['Saved recordings', 'التسجيلات المحفوظة'])) + '</h3><p style="color:var(--t2);font-size:13.5px;line-height:1.45;margin-bottom:8px">' + esc(L(['The latest recording saved for each āyah. Listen, follow along, and mark it yourself.', 'آخر تسجيل محفوظ لكل آية. استمع وتابع وقيّمه بنفسك.'])) + '</p>' +
      allRecs.slice(0, 16).map(function (k) {
        var q = k.split(':'), sn = +q[0], an = +q[1], u = h.u[k], waiting = !u || !u.heard || u.heard < recsMap[k];
        var dt = new Date(recsMap[k]).toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en', { day: 'numeric', month: 'short' });
        return '<div class="hear-rec"><div class="hear-rec-h"><span class="grow"><b>' + esc(A.surahName(sn)) + ' · ' + A.num(an) + '</b><small>' + esc(dt) + ' · ' + esc(waiting ? L(['Waiting for your check', 'بانتظار استماعك']) : L(['Heard', 'تم الاستماع'])) + '</small></span></div><div class="hear-acts">' + recCtl(sn, an) + '<button class="btn sec sm" data-play-a="' + k + '">' + A.icon('speak', 16) + '<span>' + esc(L(['Reference', 'القارئ'])) + '</span></button></div>' + (waiting ? '<div class="grades"><button class="grade" data-hg="2" data-k="' + k + '">' + esc(T('Smooth')) + '</button><button class="grade" data-hg="1" data-k="' + k + '">' + esc(T('Small slips')) + '</button><button class="grade" data-hg="0" data-k="' + k + '">' + esc(T('Not yet')) + '</button></div>' : '') + '</div>';
      }).join('') + '</div>' : '';
    return {
      html: savedBlock + '<div class="card card-wide"><h3>' + esc(T('Listen to them recite')) + '</h3><p style="color:var(--t2);line-height:1.5">' + esc(T('Sit with them and hear each āyah from memory. Your check counts for more than theirs, and nothing here marks them by machine.')) + '</p><p class="ref" style="margin-top:6px;text-align:start">' + esc(T('Heard by you')) + ': ' + A.num(heard) + ' · ' + esc(T('Checked by themselves')) + ': ' + A.num(self) + '</p></div>' +
        (list.length ? list.map(function (k) { var q = k.split(':'), sn = +q[0], an = +q[1], su = Q.q[sn]; return '<div class="card hear"><div class="hear-h"><b>' + esc(A.surahName(sn)) + ' · ' + A.num(an) + '</b><button class="btn sec sm" data-play-a="' + k + '" aria-label="' + esc(L(['Reference', 'القارئ'])) + '">' + A.icon('speak', 16) + '<span>' + esc(L(['Reference', 'القارئ'])) + '</span></button></div>' + (recsMap[k] ? '<div class="hear-acts">' + recCtl(sn, an) + '</div>' : '') + '<div class="quran hear-v" lang="ar" dir="rtl">' + su.v[an - 1][1] + '</div><div class="grades"><button class="grade" data-hg="2" data-k="' + k + '">' + esc(T('Smooth')) + '</button><button class="grade" data-hg="1" data-k="' + k + '">' + esc(T('Small slips')) + '</button><button class="grade" data-hg="0" data-k="' + k + '">' + esc(T('Not yet')) + '</button></div></div>'; }).join('') : '<div class="card"><p style="color:var(--t2)">' + esc(T('Nothing waiting. Āyāt appear here as they are learned, and again every two weeks.')) + '</p></div>') + '<div class="card"><h3>' + esc(T('Already memorised')) + '</h3><p style="color:var(--t2);line-height:1.45;font-size:14.500px;margin-bottom:8px">' + esc(T('If they learned a sūrah before Miftāḥ, mark it. It moves straight into the revision cycle.')) + '</p><div style="display:flex;gap:8px"><select class="input" id="hk-s" style="font-size:15px;flex:1"><option value="">…</option>' + Q.order.filter(function (s) { return (h.finished || []).indexOf(s) < 0; }).map(function (s) { return '<option value="' + s + '">' + esc(A.surahName(s)) + '</option>'; }).join('') + '</select><button class="btn sec" id="hk-go">' + esc(T('Mark')) + '</button></div></div>',
      mount: function (v) {
        var kb = $('#hk-go', v); if (kb) kb.onclick = function () { var sv = +$('#hk-s', v).value; if (!sv) return; Hifz.markKnown(sv, p.id); A.toast(T('Saved')); A.rerender(); };
        $$('[data-play-a]', v).forEach(function (b) { b.onclick = function () { var q = b.dataset.playA.split(':'); Voice.ayah(+q[0], +q[1]); }; });
        $$('[data-hg]', v).forEach(function (b) { b.onclick = function () { var q = b.dataset.k.split(':'); Voice.stop(); Hifz.mark(+q[0], +q[1], +b.dataset.hg, 'parent', p.id); A.saveNow(); A.rerender(); }; });
      }
    };
  }
  function tRooms(p) {
    var st = A.stage(p), h = '';
    if (st === 0) {
      var obs = A.D(p.id).obs.filter(function (o) { return o.kind === 'nursery'; }).slice(-20).reverse();
      return { html: '<div class="card"><h3>' + esc(T('Little Steps is not scored')) + '</h3><p style="color:var(--t2);line-height:1.5">' + esc(T('Your observations are in Record. Keep sessions short, and go back to real play.')) + '</p></div>' };
    }
    C.order.forEach(function (rid) {
      var r = C.rooms[rid]; if (!r.units.length) return;
      var ret = M.retention(p.id, 30, rid), nxt = C.next(rid, p.id);
      var f0 = rid !== 'quran' ? Flow.forecast(rid, p.id) : null;
      h += '<div class="card h-' + r.hue + '"><div class="rm-card-h"><h3 style="color:var(--h)">' + esc(L(r.name)) + '</h3>' + (rid !== 'quran' ? '<a class="btn sec sm" href="#/place/' + p.id + '/' + rid + '">' + esc(T('Find the level')) + '</a>' : '') + '</div><p class="rm-now">' + esc(T('Next')) + ': <b>' + esc(nxt ? L(nxt.title) : L(['Every lesson is open', 'كل الدروس متاحة'])) + '</b><br>' + esc(T('Remembered when it came back')) + ': <b>' + (ret.of ? A.num(ret.ok) + ' / ' + A.num(ret.of) : esc(T('No evidence yet'))) + '</b></p>';
      r.units.filter(function (u) { return u.band <= st; }).forEach(function (u) {
        var met = 0; u.skills.forEach(function (s) { if (M.met(s.id, p.id)) met++; });
        h += '<div class="strand"><div class="strand-h"><span class="grow">' + esc(L(u.title)) + '</span><span class="strand-r"><small>' + A.num(met) + ' / ' + A.num(u.skills.length) + '</small>' + (met < u.skills.length ? '<button class="linkb kn" data-unit-known="' + u.id + '" data-p="' + p.id + '">' + esc(T('Already knows these')) + '</button>' : '') + '</span></div><div class="kdots">' + u.skills.map(function (s) { var d = A.D(p.id); return '<button aria-label="' + esc(L(s.title)) + '" data-a="sk-sheet" data-p="' + p.id + '" data-s="' + s.id + '"><i class="' + (d.placed[s.id] && M.state(s.id, p.id) === 'new' ? 'forged' : M.state(s.id, p.id)) + '" style="' + (d.placed[s.id] && M.state(s.id, p.id) === 'new' ? 'opacity:.4' : '') + '"></i></button>'; }).join('') + '</div></div>';
      });
      h += '</div>';
    });
    var ua = M.unaided(p.id, 14), pc = function (o) { var n = o.ind + o.help; return n ? Math.round(o.ind / n * 100) : null; }, a0 = pc(ua.now), b0 = pc(ua.before);
    h = '<div class="card card-wide"><h3>' + esc(T('Working without help')) + '</h3><p style="color:var(--t2);line-height:1.5">' + esc(T('Last two weeks')) + ': <b style="color:var(--t1)">' + (a0 == null ? esc(T('No evidence yet')) : A.num(ua.now.ind) + ' ' + esc(T('alone')) + ' · ' + A.num(ua.now.help) + ' ' + esc(T('with a hint'))) + '</b>' + (b0 != null && a0 != null ? '<br>' + esc(T('Two weeks before')) + ': ' + A.num(ua.before.ind) + ' ' + esc(T('alone')) + ' · ' + A.num(ua.before.help) + ' ' + esc(T('with a hint')) : '') + '</p></div>' + h;
    h += '<div class="legend"><span><i style="background:var(--s3)"></i>' + esc(T('Not started')) + '</span><span><i style="background:color-mix(in srgb,var(--gold) 36%,var(--s3))"></i>' + esc(T('Started')) + '</span><span><i style="background:var(--gold)"></i>' + esc(L(['Learned', 'تعلّم'])) + '</span><span><i style="background:var(--ok)"></i>' + esc(L(['Remembered', 'ثبت'])) + '</span></div>';
    return { html: h, mount: function (v) { $$('[data-unit-known]', v).forEach(function (b) { b.onclick = function () { if (b.dataset.arm !== '1') { b.dataset.arm = '1'; b.textContent = T('Tap again to confirm'); return; } var d = A.D(p.id); C.units[b.dataset.unitKnown].skills.forEach(function (s) { if (!M.met(s.id, p.id)) d.placed[s.id] = 1; }); d.path = null; A.saveNow(); A.rerender(); }; }); } };
  }
  A.acts['sk-sheet'] = function (t) { skillSheet(t.dataset.p, t.dataset.s); };
  function skillSheet(pid, sid) {
    var sk = C.skill(sid), k = M.key(sid, pid), d = A.D(pid);
    var n = k ? k.n : { recognition: 0, recall: 0, production: 0, observed: 0 }, placed = !!d.placed[sid];
    var last = k && k.lastOk ? new Date(k.lastOk).toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en') : T('Not yet');
    var why = [];
    if (k && k.forged && !k.proven) { if (!k.delayed) why.push(T('Needs recall a day or more later')); if (n.production + n.observed < 1) why.push(T('Needs something produced or seen in real life')); }
    A.sheet(L(sk.title), '<p style="color:var(--t2);margin-bottom:10px">' + esc(A.stateText(sid, true)) + '</p><div class="lst"><div class="li"><span class="grow"><b>' + esc(T('Recognised')) + '</b></span>' + A.num(n.recognition) + '</div><div class="li"><span class="grow"><b>' + esc(T('Recalled')) + '</b></span>' + A.num(n.recall) + '</div><div class="li"><span class="grow"><b>' + esc(T('Produced')) + '</b></span>' + A.num(n.production) + '</div><div class="li"><span class="grow"><b>' + esc(T('Seen in real life')) + '</b></span>' + A.num(n.observed) + '</div><div class="li"><span class="grow"><b>' + esc(T('Remembered after a delay')) + '</b></span>' + A.num(k ? k.delayed : 0) + '</div><div class="li"><span class="grow"><b>' + esc(T('Last success')) + '</b></span>' + esc(last) + '</div></div>' + (why.length ? '<p class="ref" style="margin:10px 0;text-align:start">' + esc(why.join(' · ')) + '</p>' : '') + timelineHtml(sid, pid) + '<div style="display:grid;gap:8px;margin-top:12px"><button class="btn pri" id="sk-next">' + esc((d.pin || []).indexOf(sid) >= 0 ? T('Coming up next') : T('Teach this next')) + '</button><button class="btn sec" id="sk-teach">' + esc(T('Open this lesson')) + '</button><button class="btn ghost" id="sk-place">' + esc(placed ? T('Remove “already knows this”') : T('Mark: already knows this')) + '</button></div>', function (el) {
      $('#sk-next', el).onclick = function () { d.pin = d.pin || []; if (d.pin.indexOf(sid) < 0) d.pin.push(sid); d.path = null; A.saveNow(); A.closeSheet(); A.toast(T('It will come up next')); };
      $('#sk-teach', el).onclick = function () { A.closeSheet(); A.S.cur = pid; A.go('lesson/' + sid); };
      $('#sk-place', el).onclick = function () { if (placed) delete d.placed[sid]; else d.placed[sid] = 1; A.saveNow(); A.closeSheet(); A.rerender(); };
    });
  }
  function timelineHtml(sid, pid) {
    var rows = M.timeline(sid, pid).slice(0, 12); if (!rows.length) return '';
    return '<h3 style="font-size:15px;margin:14px 0 6px">' + esc(T('When')) + '</h3><div class="evl">' + rows.map(function (x) {
      var bits = []; if (x.forge) bits.push(L(['Lesson mastered', 'أتقن الدرس'])); if (x.seen) bits.push(T('Seen in real life')); if (x.ok) bits.push(A.num(x.ok) + ' ' + T('alone')); if (x.help) bits.push(A.num(x.help) + ' ' + T('with a hint')); if (x.miss) bits.push(A.num(x.miss) + ' ' + T('not yet')); if (x.rv) bits.push(T('Came back'));
      return '<div class="evl-r"><i></i><b>' + esc(new Date(x.day + 'T12:00:00').toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en', { month: 'short', day: 'numeric' })) + '</b><span>' + esc(bits.join(' · ')) + '</span></div>';
    }).join('') + '</div>';
  }
  function tTalk(p) {
    var d = A.D(p.id), since = A.now().getTime() - 14 * 864e5, tally = {};
    d.led.forEach(function (e) { if (e.t >= since && e.e && !e.ok) tally[e.e] = (tally[e.e] || 0) + 1; });
    var ks = Object.keys(tally).sort(function (a, b) { return tally[b] - tally[a]; }).slice(0, 6);
    var stuck = M.stuck(p.id);
    var dues = M.due(p.id).slice(0, 5);
    return {
      html: (stuck.length ? '<div class="card"><h3>' + esc(T('Stuck: needs you')) + '</h3><div class="lst">' + stuck.map(function (s) { var x = C.skill(s), nd = (x.needs || []).map(C.skill).filter(Boolean)[0]; return '<div class="li"><span class="grow"><b>' + esc(L(x.title)) + '</b><small>' + esc(T('Not passed twice. The path is resting it and bringing back what it builds on')) + (nd ? ': ' + esc(L(nd.title)) : '') + '. ' + esc(T('Sit with them for this one.')) + '</small></span><button class="btn sm sec" data-a="sk-sheet" data-p="' + p.id + '" data-s="' + s + '">' + esc(T('See')) + '</button></div>'; }).join('') + '</div></div>' : '') + '<div class="card"><h3>' + esc(T('Worth talking about this week')) + '</h3>' + (ks.length ? '<div class="lst">' + ks.map(function (k) { var E = M.ERR[k] || M.ERR.understanding; return '<div class="li"><span class="grow"><b>' + esc(L(E.t)) + ' · ' + A.num(tally[k]) + '</b><small>' + esc(L(E.fix)) + '</small></span></div>'; }).join('') + '</div>' : '<p style="color:var(--t2)">' + esc(T('Nothing yet. Patterns show up here after some work.')) + '</p>') + '</div>' +
        '<div class="card"><h3>' + esc(L(['Starting to fade', 'بدأت تضعف'])) + '</h3>' + (dues.length ? '<div class="lst">' + dues.map(function (x) { var s = C.skill(x.s); return '<div class="li">' + A.keyIcon(x.s, 26) + '<span class="grow"><b>' + esc(L(s.title)) + '</b></span></div>'; }).join('') + '</div><p class="ref" style="margin-top:6px;text-align:start">' + esc(T('These come back on the path automatically. That is the plan, not a failure.')) + '</p>' : '<p style="color:var(--t2)">' + esc(L(['Everything is holding well.', 'كل شيء ثابت.'])) + '</p>') + '</div>'
    };
  }
  /* the last five weeks: a square for each day, by how long they worked */
  function calendar(d) {
    var now = A.now(), cells = '', start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 34 - now.getDay());
    for (var i = 0; i < 42; i++) { var x = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i), k = A.day(x), ms = dayMs(d, k), fut = x > now; cells += '<i class="' + (fut ? 'fut' : ms > 12 * 60000 ? 'l3' : ms > 4 * 60000 ? 'l2' : ms > 0 ? 'l1' : '') + (k === A.day() ? ' today' : '') + '" title="' + k + '"></i>'; }
    return '<div class="cal" aria-hidden="true">' + cells + '</div>';
  }
  function tRecord(p) {
    Voice.refreshVoices();
    var d = A.D(p.id), all0 = Object.assign({}, d.time, d.screen || {}), days = Object.keys(all0).filter(function (k) { return dayMs(d, k) > 0; }), tot = days.reduce(function (a, k) { return a + dayMs(d, k); }, 0), ob = d.obs.slice(-40).reverse();
    var recs = d.recs ? Object.keys(d.recs).sort(function (x, y) { return d.recs[y] - d.recs[x]; }) : [];
    var doneSheets = (d.sheets || []).filter(function (x) { return x.scr && (x.marked || x.done); }).slice().reverse();
    var sheetRow = function (sh) { var dt = new Date(sh.marked || sh.done || sh.t).toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en', { day: 'numeric', month: 'short' }); return '<a class="li" href="#/parent/' + esc(p.id) + '/mark/' + esc(sh.id) + '">' + A.icon('print', 20) + '<span class="grow"><b>' + esc(Print.titleOf(sh)) + '</b><small>' + esc(sh.marked && sh.q ? L(['Marked', 'صُحّحت']) + ' · ' + A.num(sh.right) + ' / ' + A.num(sh.q.length) : L(['Checked', 'تمت المراجعة'])) + ' · ' + esc(dt) + '</small></span>' + A.icon('next', 16) + '</a>'; };
    var doneCard = doneSheets.length ? '<div class="card"><h3>' + esc(L(['Completed sheets', 'الأوراق المُنجَزة'])) + '</h3><div class="lst">' + doneSheets.slice(0, 10).map(sheetRow).join('') + '</div>' + (doneSheets.length > 10 ? '<details class="logu" style="margin-top:8px"><summary><span class="grow">' + esc(L(['Older completed sheets', 'أوراق منجزة أقدم'])) + '</span><b>' + A.num(doneSheets.length - 10) + '</b></summary><div class="lst">' + doneSheets.slice(10).map(sheetRow).join('') + '</div></details>' : '') + '</div>' : '';
    return {
      html: '<div class="card card-wide"><h3>' + esc(T('Attendance')) + '</h3><p style="color:var(--t2);line-height:1.5">' + esc(T('Days')) + ': ' + A.num(days.length) + ' · ' + esc(T('Total')) + ': ' + hrs(tot) + '</p>' + calendar(d) + '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn sec sm" data-a="print-rep" data-p="' + p.id + '">' + A.icon('print', 18) + '<span>' + esc(T('Print a report')) + '</span></button></div></div>' +
        doneCard +
        (recs.length ? '<div class="card"><h3>' + esc(T('Recitations to hear')) + '</h3><div class="lst">' + recs.map(function (k) { var pa = k.split(':'), rk = Voice.savedRecKey(p.id, pa[0], pa[1]), dt = new Date(d.recs[k]).toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en'); return rk ? '<button class="li" data-a="play-rec" data-k="' + esc(rk) + '">' + A.icon('play', 20) + '<span class="grow"><b>' + esc(A.surahName(pa[0])) + ' ' + A.num(pa[1]) + '</b><small>' + esc(dt) + '</small></span></button>' : '<div class="li"><span class="grow"><b>' + esc(A.surahName(pa[0])) + ' ' + A.num(pa[1]) + '</b><small>' + esc(dt) + ' · ' + esc(L(['Recording unavailable on this device', 'التسجيل غير متاح على هذا الجهاز'])) + '</small></span></div>'; }).join('') + '</div></div>' : '') +
        '<div class="card"><h3>' + esc(T('Observations and deeds')) + '</h3>' + (ob.length ? '<div class="lst">' + ob.map(function (o) { return '<div class="li"><span class="grow"><b>' + esc(o.title) + '</b><small>' + esc(new Date(o.t).toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en')) + (o.value ? ' · ' + esc(o.value) : '') + '</small></span></div>'; }).join('') + '</div>' : '<p style="color:var(--t2)">' + esc(T('Nothing yet.')) + '</p>') + '</div>'
    };
  }
  A.acts['play-rec'] = function (t) { if (A.grownOpen()) Voice.play('voice/' + t.dataset.k + '.m4a'); };
  A.acts['print-rep'] = function (t) { var p = A.profile(t.dataset.p); reportWindow(p); };
  function reportWindow(p) {
    var d = A.D(p.id), rows = '';
    C.order.forEach(function (rid) { var r = C.rooms[rid]; r.units.forEach(function (u) { u.skills.forEach(function (s) { var st = M.state(s.id, p.id); if (st === 'new') return; var k = M.key(s.id, p.id); rows += '<tr><td>' + esc(L(r.name)) + '</td><td>' + esc(L(s.title)) + '</td><td>' + esc(T({ started: 'Started', forged: 'Forged', proven: 'Proven', deep: 'Deep in your heart' }[st])) + '</td><td>' + (k.lastOk ? new Date(k.lastOk).toLocaleDateString() : '') + '</td></tr>'; }); }); });
    var all1 = Object.assign({}, d.time, d.screen || {}), days = Object.keys(all1).filter(function (k) { return dayMs(d, k) > 0; }), tot = days.reduce(function (a, k) { return a + dayMs(d, k); }, 0);
    var hz = Hifz.state(p.id);
    var report = '<div class="pp" style="padding:8px"><h1>' + esc(p.name) + ': ' + esc(T('Learning record')) + '</h1><p>' + esc(A.day()) + ' · ' + esc(T('Days')) + ': ' + days.length + ' · ' + esc(T('Total')) + ': ' + hrs(tot) + '</p><p>' + esc(T('Finished sūrahs')) + ': ' + (hz.finished || []).map(function (s) { return window.QURAN.q[s].name; }).join(', ') + '</p><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%"><tr><th>' + esc(T('Room')) + '</th><th>' + esc(T('Skill')) + '</th><th>' + esc(T('State')) + '</th><th>' + esc(T('Last success')) + '</th></tr>' + rows + '</table></div>';
    Print.send(report, 'Miftah ' + p.name);
  }
  function tSet(p) {
    var st = A.stage(p), off = p.off || {};
    return {
      html: '<div class="card"><div id="set-form" style="display:grid;gap:12px"></div></div><div class="card"><h3>' + esc(T('Stage')) + '</h3><div class="segs">' + A.STAGES.map(function (s) { return '<button class="seg ' + (s.id === st ? 'on' : '') + '" data-st="' + s.id + '">' + esc(L(s.name)) + '</button>'; }).join('') + '</div><p class="ref" style="margin-top:8px;text-align:start">' + esc(T('Stage changes how things look and how long they run. Each room still has its own level.')) + '</p></div><div class="card"><h3>' + esc(T('Screen time each day')) + '</h3><div class="segs">' + [10, 15, 20, 30, 40, 60].map(function (m) { var on = Plan.limit(p) === m; return '<button class="seg ' + (on ? 'on' : '') + '" data-lim="' + m + '">' + A.num(m) + '</button>'; }).join('') + '</div><p class="ref" style="margin-top:8px;text-align:start">' + esc(T('Minutes. The path is sized to fit, and a lesson is never cut off part-way.')) + '</p></div>' + (st > 0 ? setupPlan(p) : '') + '<div class="card" data-fold="1"><h3>' + esc(L(['Subjects', 'المواد'])) + '</h3><div class="lst">' + C.order.map(function (r) { return '<button class="li" data-room="' + r + '"><span class="grow"><b>' + esc(L(C.rooms[r].name)) + '</b></span><span class="switch ' + (off[r] ? '' : 'on') + '"></span></button>'; }).join('') + '</div></div><button class="btn ghost wide" id="del-c" style="color:var(--bad);margin-top:8px">' + esc(T('Remove this child')) + '</button>',
      mount: function (v) {
        A.V.__form($('#set-form', v), p, function () { A.saveNow(); A.toast(T('Saved')); A.rerender(); });
        $$('[data-st]', v).forEach(function (b) { b.onclick = function () { p.stage = +b.dataset.st; A.D(p.id).path = null; A.placeDefault(p); A.saveNow(); A.rerender(); }; });
        bindPlan(p, v);
        $$('[data-lim]', v).forEach(function (b) { b.onclick = function () { p.limit = +b.dataset.lim; A.D(p.id).path = null; A.saveNow(); A.rerender(); }; });
        $$('[data-room]', v).forEach(function (b) { b.onclick = function () { p.off = p.off || {}; p.off[b.dataset.room] = !p.off[b.dataset.room]; A.D(p.id).path = null; A.saveNow(); var sw = $('.switch', b); if (sw) sw.classList.toggle('on', !p.off[b.dataset.room]); else A.rerender(); }; });
        $('#del-c', v).onclick = function () {
          var el = this; if (el.dataset.arm !== '1') { el.dataset.arm = '1'; el.textContent = T('Tap again to remove for good'); return; }
          A.S.profiles = A.S.profiles.filter(function (x) { return x.id !== p.id; }); delete A.S.data[p.id]; if (A.S.cur === p.id) A.S.cur = A.S.profiles[0] ? A.S.profiles[0].id : null; A.saveNow(); A.go('parent');
        };
      }
    };
  }

  var WD = [0, 1, 2, 3, 4, 5, 6];
  function wdName(i) { return new Date(2023, 0, 1 + i).toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en', { weekday: 'short' }); }
  function setupPlan(p) {
    var days = p.days || Flow.WEEK, light = p.light == null ? 5 : p.light, pace = p.pace || 'steady', focus = p.focus || {};
    return '<div class="card"><h3>' + esc(T('School days')) + '</h3><div class="wk7">' + WD.map(function (i) { return '<button class="seg ' + (days.indexOf(i) >= 0 ? 'on' : '') + '" data-day="' + i + '">' + esc(wdName(i)) + '</button>'; }).join('') + '</div><p class="ref" style="margin:8px 0;text-align:start">' + esc(T('On other days: only the Qurʾān and something real.')) + '</p><h3 style="margin-top:10px">' + esc(T('The remembering day')) + '</h3><div class="wk7">' + WD.map(function (i) { return '<button class="seg ' + (light === i ? 'on' : '') + '" data-light="' + i + '">' + esc(wdName(i)) + '</button>'; }).join('') + '</div><p class="ref" style="margin-top:8px;text-align:start">' + esc(L(['No new lessons that day: review, making and movement. Strong learning needs one.', 'بلا دروس جديدة ذلك اليوم: مراجعة وصنع وحركة. يحتاجه التعلم القوي.'])) + '</p></div>' +
      '<div class="card"><h3>' + esc(T('Pace')) + '</h3><div class="segs">' + [['gentle', 'Gentle'], ['steady', 'Steady'], ['strong', 'Strong']].map(function (x) { return '<button class="seg ' + (pace === x[0] ? 'on' : '') + '" data-pace="' + x[0] + '">' + esc(T(x[1])) + '</button>'; }).join('') + '</div><p class="ref" style="margin-top:8px;text-align:start">' + esc(T('It also adjusts by itself, from how well they remember.')) + '</p></div>' +
      '<div class="card" data-fold="1"><h3>' + esc(T('More or less of a subject')) + '</h3><div class="lst">' + C.order.filter(function (r) { return r !== 'quran'; }).map(function (r) { var f = focus[r] || 1; return '<div class="li"><span class="grow"><b>' + esc(L(C.rooms[r].name)) + '</b></span><div class="segs mini">' + [[.5, 'Less'], [1, 'Normal'], [1.5, 'More']].map(function (x) { return '<button class="seg ' + (f === x[0] ? 'on' : '') + '" data-focus="' + r + '" data-v="' + x[0] + '">' + esc(T(x[1])) + '</button>'; }).join('') + '</div></div>'; }).join('') + '</div></div>' +
      '<div class="card" data-fold="1"><h3>' + esc(T('Family promises')) + '</h3><p style="color:var(--t2);line-height:1.45;font-size:14.500px;margin-bottom:8px">' + esc(T('A real reward from you, earned by real progress: a trip to the park, a new book. Never a score, never a streak.')) + '</p>' + ((p.promises || []).length ? '<div class="lst" style="margin-bottom:8px">' + p.promises.map(function (x) { var now = Math.min(Flow.progressOf(x.kind, p.id), x.n); return '<div class="li"><span class="grow"><b>' + esc(x.what) + '</b><small>' + A.num(now) + ' / ' + A.num(x.n) + ' ' + esc(T({ unit: 'lanterns', proven: 'proven keys', surah: 'sūrahs', forged: 'keys' }[x.kind])) + (x.kept ? ' · ' + esc(T('Kept it')) : x.fired ? ' · ' + esc(T('Earned')) : '') + '</small></span><button class="round off" style="width:40px;height:40px" data-pdel="' + x.id + '" aria-label="' + esc(T('Remove')) + '">' + A.icon('close', 18) + '</button></div>'; }).join('') + '</div>' : '') + '<div class="field" style="max-width:none"><label for="pr-w">' + esc(T('We will')) + '</label><input class="input" id="pr-w" maxlength="60" autocomplete="off" style="font-size:15px"></div><div style="display:grid;grid-template-columns:90px 1fr;gap:8px;margin-top:8px"><input class="input" id="pr-n" type="number" min="1" max="200" value="5" style="font-size:15px"><select class="input" id="pr-k" style="font-size:15px"><option value="forged">' + esc(L(['lessons mastered', 'درسًا أُتقن'])) + '</option><option value="proven">' + esc(L(['lessons remembered', 'درسًا ثبت'])) + '</option><option value="unit">' + esc(T('lanterns')) + '</option><option value="surah">' + esc(T('sūrahs')) + '</option></select></div><button class="btn sec wide" id="pr-add" style="margin-top:8px">' + esc(T('Add the promise')) + '</button></div>';
  }
  function bindPlan(p, v) {
    var re = function () { A.D(p.id).path = null; A.saveNow(); A.rerender(); };
    $$('[data-day]', v).forEach(function (b) { b.onclick = function () { var i = +b.dataset.day, d = (p.days || Flow.WEEK).slice(), at = d.indexOf(i); if (at >= 0) { if (d.length > 1) d.splice(at, 1); } else d.push(i); p.days = d; re(); }; });
    $$('[data-light]', v).forEach(function (b) { b.onclick = function () { p.light = +b.dataset.light; re(); }; });
    $$('[data-pace]', v).forEach(function (b) { b.onclick = function () { p.pace = b.dataset.pace; re(); }; });
    $$('[data-focus]', v).forEach(function (b) { b.onclick = function () { p.focus = p.focus || {}; p.focus[b.dataset.focus] = +b.dataset.v; re(); }; });
    $$('[data-pdel]', v).forEach(function (b) { b.onclick = function () { p.promises = p.promises.filter(function (x) { return x.id !== b.dataset.pdel; }); A.saveNow(); A.rerender(); }; });
    var add = $('#pr-add', v); if (add) add.onclick = function () { var w = $('#pr-w', v).value.trim(), n = Math.max(1, +$('#pr-n', v).value || 1); if (!w) { $('#pr-w', v).focus(); return; } p.promises = p.promises || []; p.promises.push({ id: 'p' + Date.now().toString(36), what: w, n: n, kind: $('#pr-k', v).value }); Flow.checkPromises(p.id); A.saveNow(); A.rerender(); };
  }

  /* ===== the grown-up: a parent, a teacher or a tutor, with a name the app can use ===== */
  A.ROLES = { parent: ['Parent', 'وليّ أمر'], teacher: ['Teacher', 'معلّم'], tutor: ['Tutor', 'مدرّس خاص'] };
  A.grown = function () { var g = A.S.grown; return g && typeof g === 'object' && g.name ? g : null; };
  A.grownAvatar = function (size) {
    var g = A.grown(), t = g ? g.name.trim().charAt(0).toUpperCase() : '';
    return '<span class="gp-av" style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * .42) + 'px">' + (t ? esc(t) : A.icon('grown', Math.round(size * .5))) + '</span>';
  };
  function mePage() {
    var g = A.S.grown && typeof A.S.grown === 'object' ? A.S.grown : {}, role = g.role || 'parent';
    var roles = Object.keys(A.ROLES).map(function (k) { return '<button class="seg' + (role === k ? ' on' : '') + '" data-role="' + k + '">' + esc(L(A.ROLES[k])) + '</button>'; }).join('');
    return {
      html: head(L(['Your profile', 'ملفّك']), L(['Only on this family’s devices. It names you on reports and sheets, and greets you here.', 'على أجهزة هذه الأسرة فقط. يظهر اسمك في التقارير والأوراق ويرحّب بك هنا.']), 'parent', T('Parents')) +
        '<div class="wrap" style="margin-top:14px"><div class="card me-card">' + A.grownAvatar(64) +
        '<label class="fld"><span>' + esc(L(['Your name', 'اسمك'])) + '</span><input class="input" id="me-n" dir="auto" maxlength="40" value="' + esc(g.name || '') + '" placeholder="' + esc(L(['For example, Umm Yusuf', 'مثلًا: أم يوسف'])) + '"></label>' +
        '<div class="fld"><span>' + esc(L(['You are', 'أنت'])) + '</span><div class="segs">' + roles + '</div></div>' +
        '<label class="fld" id="me-org-f"' + (role === 'parent' ? ' hidden' : '') + '><span>' + esc(L(['School, class or circle (optional)', 'المدرسة أو الصف أو الحلقة (اختياري)'])) + '</span><input class="input" id="me-o" dir="auto" maxlength="50" value="' + esc(g.org || '') + '"></label>' +
        '<button class="btn pri wide" id="me-save">' + esc(L(['Save', 'احفظ'])) + '</button></div>' +
        '<div class="card"><div class="lst"><a class="li" href="#/parent/settings"><span class="grow"><b>' + esc(T('Settings')) + '</b><small>' + esc(L(['Language, theme, sounds, PIN, backup', 'اللغة والمظهر والأصوات والرمز والنسخ الاحتياطي'])) + '</small></span>' + A.icon('next', 18) + '</a></div></div></div>',
      mount: function (v) {
        var cur = role;
        $$('[data-role]', v).forEach(function (b) { b.onclick = function () { cur = b.dataset.role; $$('[data-role]', v).forEach(function (x) { x.classList.toggle('on', x === b); }); $('#me-org-f', v).hidden = cur === 'parent'; }; });
        $('#me-save', v).onclick = function () {
          var n = $('#me-n', v).value.trim(); if (!n) { $('#me-n', v).focus(); return; }
          A.S.grown = { name: n, role: cur, org: cur === 'parent' ? '' : $('#me-o', v).value.trim(), at: A.now().getTime() };
          A.saveNow(); A.toast(T('Saved')); A.go('parent');
        };
      }
    };
  }
  /* ===== updates: the version on this device, and the check, on a page of their own ===== */
  function updatesPage() {
    var can = window.Upd && Upd.can();
    return {
      html: head(L(['Updates', 'التحديثات']), L(['Miftāḥ checks only when you ask, or once a week if you turn that on. Your family’s record is never touched by an update.', 'لا يتحقق مفتاح إلا حين تطلب، أو مرة في الأسبوع إن فعّلت ذلك. التحديث لا يمسّ سجل أسرتك.']), 'parent', T('Parents')) +
        '<div class="wrap" style="margin-top:14px">' + (can ? Upd.card('updates') : '<div class="card"><p>' + esc(L(['In a web browser Miftāḥ is always the newest version. Updates are for the Android and Windows apps.', 'في المتصفح يكون مفتاح دائمًا بأحدث إصدار. التحديثات لتطبيقَي أندرويد وويندوز.'])) + '</p></div>') + '</div>',
      mount: function () { if (can) Upd.bind(); }
    };
  }

  /* ===== settings ===== */
  var pendingBackup = false;
  function settings() {
    var S = A.S, isDesk = !!window.MIFTAH_DESKTOP, seg = function (k, opts) { return '<div class="segs">' + opts.map(function (o) { return '<button class="seg ' + (S[k] === o[0] ? 'on' : '') + '" data-k="' + k + '" data-v="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>'; };
    var au = A.N.has() && window.Voice && Voice.stats ? Voice.stats() : {};
    var auSize = au.bytes > 1048576 ? A.num(Math.round(au.bytes / 104857.6) / 10) + ' MB' : au.files ? A.num(Math.max(1, Math.round((au.bytes || 0) / 1024))) + ' KB' : '';
    return {
      html: head(T('Settings'), '', 'parent', T('Parents')) + '<div class="wrap" style="margin-top:14px">' +
        '<div class="card"><h3>' + esc(T('Language')) + '</h3>' + seg('lang', [['en', 'English'], ['ar', 'العربية']]) + '</div>' +
        '<div class="card" id="set-look"><h3>' + esc(T('Look')) + '</h3>' + seg('theme', [['auto', T('Follows the sun')], ['light', T('Day')], ['dark', T('Night')]]) + '</div>' +
        '<div class="card" data-fold="1"><h3>' + esc(T('Reciter for memorising')) + '</h3>' + seg('reciter', [['h', T('Al-Ḥuṣarī, teaching pace')], ['a', T('Al-ʿAfāsī, flowing')]]) + '</div>' +
        '<div class="card"><div class="lst"><button class="li" id="s-sound"><span class="grow"><b>' + esc(T('Touch sounds')) + '</b><small>' + esc(T('Soft clicks only. Never music.')) + '</small></span><span class="switch ' + (S.sound ? 'on' : '') + '"></span></button>' +
        (A.N.has() ? '<button class="li" id="s-rem"><span class="grow"><b>' + esc(T('School-time reminder')) + '</b><small>' + esc(T(S.remind.on ? 'Quiet, once a day' : 'Off')) + (isDesk && S.remind.on ? ' · ' + esc(L(['Keep Miftāḥ open or in the tray', 'أبقِ مفتاح مفتوحًا أو في شريط المهام'])) : '') + '</small></span><span class="switch ' + (S.remind.on ? 'on' : '') + '"></span></button>' + (S.remind.on ? '<div class="li"><span class="grow"><b>' + esc(T('At')) + '</b></span><input type="time" id="s-time" class="input" style="width:130px;height:46px;font-size:16px" value="' + ('0' + S.remind.h).slice(-2) + ':' + ('0' + S.remind.m).slice(-2) + '"></div>' : '') + (!isDesk ? '<button class="li" id="s-wid"><span class="grow"><b>' + esc(T('Add to the home screen')) + '</b><small>' + esc(T('Today’s path as a widget')) + '</small></span></button>' : '') : '') + '</div></div>' +
        '<div class="card"><div class="lst"><a class="li" href="#/parent/me">' + A.grownAvatar(36) + '<span class="grow"><b>' + esc(A.grown() ? A.grown().name : L(['Your profile', 'ملفّك'])) + '</b><small>' + esc(A.grown() ? L(A.ROLES[A.grown().role] || A.ROLES.parent) : L(['Your name and role, parent or teacher', 'اسمك ودورك: وليّ أمر أو معلّم'])) + '</small></span>' + A.icon('next', 18) + '</a></div></div>' +
        (A.N.has() ? '<div class="card" data-fold="1"><h3>' + esc(L(['Downloaded Qurʾān audio', 'صوت القرآن المحمّل'])) + '</h3><p style="color:var(--t2);font-size:13.5px;line-height:1.45;margin-bottom:8px">' + esc(au.files ? L(['Saved on this device: ', 'محفوظ على هذا الجهاز: ']) + auSize + ' (' + A.num(au.files) + ' ' + L(['files', 'ملف']) + '). ' + L(['Bundled sūrahs and family recordings are never removed.', 'لا تُحذف السور المدمجة ولا تسجيلات الأسرة أبدًا.']) : L(['Only built-in recordings are stored right now.', 'لا توجد تحميلات إضافية الآن.'])) + '</p>' + (au.files ? '<button class="btn ghost sm" id="s-au-clr">' + esc(L(['Clear downloaded audio', 'مسح الصوت المحمّل'])) + '</button>' : '') + '</div>' : '') +
        '<div class="card" data-fold="1"><h3>' + esc(T('Your family’s data')) + '</h3><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sec sm" id="s-exp">' + esc(T('Back up')) + '</button><button class="btn sec sm" id="s-imp">' + esc(T('Restore')) + '</button><button class="btn sec sm" data-a="s-sync">' + esc(L(['Devices', 'الأجهزة'])) + '</button>' + (isDesk ? '<a class="btn sec sm" href="#/desk/pc">' + esc(L(['This computer', 'هذا الحاسوب'])) + '</a>' : '') + '</div></div>' +
        (window.Upd && Upd.can() ? Upd.card('settings') : '') + '</div>',
      mount: function (v) {
        /* a choice changes in place; only a new language redraws the page, since every word on it changes */
        $$('[data-k]', v).forEach(function (b) { b.onclick = function () {
          var k = b.dataset.k; if (S[k] === b.dataset.v) return;
          S[k] = b.dataset.v; A.applyTheme(); A.saveNow();
          if (k === 'lang') { A.rerender(); return; }
          $$('[data-k="' + k + '"]', v).forEach(function (x) { x.classList.toggle('on', x === b); });
        }; });
        var flip = function (btn, on, sub) { var sw = $('.switch', btn); if (sw) sw.classList.toggle('on', on); var sm = $('small', btn); if (sm && sub) sm.textContent = sub; };
        $('#s-sound', v).onclick = function () { S.sound = !S.sound; A.saveNow(); flip(this, S.sound); };
        if (window.Upd) Upd.bind();
        
        var rem = $('#s-rem', v); if (rem) rem.onclick = function () { S.remind.on = !S.remind.on; if (S.remind.on) A.N.call('requestNotifications'); A.saveNow(); A.rerender(); };
        var tm = $('#s-time', v); if (tm) tm.onchange = function () { var q = this.value.split(':'); S.remind.h = +q[0]; S.remind.m = +q[1]; A.saveNow(); A.toast(T('Saved')); };
        var wd = $('#s-wid', v); if (wd) wd.onclick = function () { if (!A.N.call('pinWidget')) A.toast(T('Add it from your home screen’s widget list')); };
        var ac = $('#s-au-clr', v); if (ac) ac.onclick = function () { if (ac.dataset.arm !== '1') { ac.dataset.arm = '1'; ac.textContent = L(['Tap again to clear', 'انقر مجددًا للمسح']); return; } Voice.clearAudio(); A.toast(L(['Cleared', 'تم المسح'])); A.rerender(); };
        $('#s-exp', v).onclick = function () {
          var json = JSON.stringify(A.Sync.recordOut()), name = 'miftah-backup-' + A.day() + '.json';
          if (A.N.has()) { pendingBackup = true; A.N.call('exportFile', name, json); }
          else { A.S.lastBackup = A.now().getTime(); A.saveNow(); var u = URL.createObjectURL(new Blob([json], { type: 'application/json' })), a = document.createElement('a'); a.href = u; a.download = name; a.click(); setTimeout(function () { URL.revokeObjectURL(u); }, 60000); }
        };
        $('#s-imp', v).onclick = function () {
          A.__syncIn = false;
          if (A.N.has()) { A.N.call('importFile'); return; }
          var f = document.createElement('input'); f.type = 'file'; f.accept = 'application/json'; f.onchange = function () { var r = new FileReader(); r.onload = function () { window.__native.onImport(r.result); }; r.readAsText(f.files[0]); }; f.click();
        };
      }
    };
  }
  window.__native.onImport = function (txt) {
    if (!A.grownOpen()) return;
    try { var o = A.Sync.parse(txt); if (!o || !Array.isArray(o.profiles)) throw 0; delete o.upd; o.pin = A.S.pin; o.gate = A.S.gate; A.S = A.shape(o); if (A.Books) A.Books.register(); A.saveNow(); A.toast(T('Restored')); A.go('parent'); A.rerender(); } catch (e) { A.toast(T('That file could not be read')); }
  };
  window.__native.onExported = function (ok) { if (ok && pendingBackup) { A.S.lastBackup = A.now().getTime(); A.saveNow(); } pendingBackup = false; A.toast(T(ok ? 'Saved' : 'Not saved')); };

  /* ===== your voice ===== */
  A.acts['voice-settings'] = function () { A.N.call('openVoiceSettings'); };
  function voices() {
    Voice.refreshVoices();
    var rows = function (items) { return items.map(function (x) { return '<div class="li"><span class="tile' + (x.en ? ' en' : '') + '" style="height:50px;min-width:50px;font-size:' + (x.en ? 22 : 28) + 'px" ' + (x.en ? '' : 'lang="ar"') + '>' + esc(x.t) + '</span><span class="grow"><small>' + esc(heard(x)) + '</small></span><button class="round off" style="width:46px;height:46px" data-play="' + x.k + '" data-say="' + esc(x.say) + '" data-l="' + (x.en ? 'en' : 'ar') + '" aria-label="' + esc(T('Listen')) + '">' + A.icon('play', 20) + '</button><button class="round" style="width:46px;height:46px" data-rec="' + x.k + '" aria-label="' + esc(T('Record')) + '">' + A.icon('mic', 20) + '</button></div>'; }).join(''); };
    var AL = C.LETTERS.map(function (l) { return { t: l.ch, k: 'ar_' + l.ch, say: l.name }; });
    var EN = Object.keys(I.SND).map(function (g) { return { t: g, k: 'ph_' + g, say: I.SND[g], en: 1 }; });
    /* what a child will actually hear for each: yours, a real recording, the device's own voice, or nothing yet */
    function heard(x) {
      if (Voice.hasVoice(x.k)) return T('Your voice');
      if (Voice.real(x.k.slice(3)) || Voice.real(x.say)) return L(['A real voice', 'صوت حقيقي']);
      if (Voice.deviceFor(x.say, { key: x.k })) return T('Device voice');
      return L(['Silent until you record it', 'صامت حتى تسجّله']);
    }
    var gap = AL.filter(function (x) { return !Voice.hasVoice(x.k) && !Voice.real(x.t) && !Voice.real(x.say); });
    var note = !gap.length ? '' : '<div class="card"><p style="line-height:1.5;margin:0 0 10px">' + esc(Voice.deviceHas('ar')
      ? L(['This device’s own Arabic voice says the ' + gap.length + ' letter names that have no real recording yet. Record your own over any of them.', 'صوت الجهاز العربي ينطق أسماء الحروف التي ليس لها تسجيل حقيقي بعد، وعددها ' + A.num(gap.length) + '. سجّل صوتك فوق أي منها.'])
      : L([gap.length + ' letter names have no recording yet. Add an Arabic voice to this device and Miftāḥ will use it for them, or record them yourself.', 'لـ' + A.num(gap.length) + ' من أسماء الحروف لا تسجيل بعد. أضف صوتًا عربيًا إلى الجهاز ليستعمله مفتاح لها، أو سجّلها بصوتك.'])) +
      '</p><p lang="ar" style="font-size:24px;margin:0 0 10px;letter-spacing:4px">' + esc(gap.map(function (x) { return x.t; }).join(' ')) + '</p>' +
      (Voice.deviceHas('ar') || !A.N.has() ? '' : '<button class="btn sm sec" data-a="voice-settings">' + esc(L(['Add an Arabic voice', 'أضف صوتًا عربيًا'])) + '</button>') + '</div>';
    return {
      html: head(T('Your voice'), T('A child learns best from a voice they love. Record over any sound. Qurʾān always stays with the reciters.'), 'parent', T('Parents')) + '<div class="wrap" style="margin-top:14px">' + (A.N.has() ? '' : '<p class="ref">' + esc(T('Recording works in the phone app.')) + '</p>') + note + '<div class="card"><h3>' + esc(T('Arabic letters')) + '</h3><div class="lst">' + rows(AL) + '</div></div><div class="card"><h3>' + esc(T('English sounds')) + '</h3><div class="lst">' + rows(EN) + '</div></div></div>',
      /* back from the device's voice settings: a newly added Arabic voice shows at once */
      resume: function () { Voice.refreshLangs(); A.rerender(); },
      mount: function (v) {
        var cur = null;
        $$('[data-play]', v).forEach(function (b) { b.onclick = function () { Voice.say(b.dataset.say, { lang: b.dataset.l, key: b.dataset.play }); }; });
        $$('[data-rec]', v).forEach(function (b) {
          b.onclick = function () {
            if (!A.N.has()) { A.toast(T('Recording works in the phone app.')); return; }
            if (cur && cur !== b) return;
            if (!cur) { if (A.N.call('recStart', b.dataset.rec)) { cur = b; b.classList.add('rec'); } else A.micHelp(); }
            else { A.N.call('recStop'); b.classList.remove('rec'); cur = null; Voice.refreshVoices(); A.toast(T('Saved')); setTimeout(A.rerender, 300); }
          };
        });
      }
    };
  }

  /* credits are owed and kept, but they are not the page: one quiet row, and a sheet with names and licences, the sources as links */
  function photoCredits() {
    return '<button class="card li crow" data-a="credits"><span class="grow"><b>' + esc(L(['Credits and licences', 'الشكر والتراخيص'])) + '</b><small>' + esc(L(['Photos, recordings, pictures and icons', 'الصور والتسجيلات والرسوم والأيقونات'])) + '</small></span>' + A.icon('next', 18) + '</button>';
  }
  function people() {
    var seen = {}, out = [];
    (window.SPEECH_CREDITS || []).forEach(function (c) {
      var m = String(c).match(/Speaker:\s*(.+?)\s+Recorder:/), n = (m ? m[1] : String(c).replace(/\s*\(.*$/, '')).trim();
      if (n && !seen[n.toLowerCase()]) { seen[n.toLowerCase()] = 1; out.push(n); }
    });
    return out.sort(function (a, b) { return a.localeCompare(b); });
  }
  A.acts.credits = function () {
    var P0 = window.PHOTOS || {}, ks = Object.keys(P0), ppl = people();
    var html = '<div class="crd">' +
      (ks.length ? '<h3>' + esc(L(['Photos', 'الصور'])) + '</h3><ul class="crd-l">' + ks.map(function (k) { var x = P0[k]; return '<li><a href="#" data-url="' + esc(x.page) + '">' + esc(L(x.cap)) + '</a><small>' + esc(x.by) + ' · ' + esc(x.lic) + '</small></li>'; }).join('') + '</ul>' : '') +
      (ppl.length ? '<h3>' + esc(L(['Word recordings', 'تسجيلات الكلمات'])) + '</h3><p>' + esc(L(['Real people, recorded for Lingua Libre on Wikimedia Commons under free licences (CC0, CC BY, CC BY-SA). With thanks to', 'أناس حقيقيون سجّلوا لـ Lingua Libre على ويكيميديا كومنز بتراخيص حرة. شكرًا لـ'])) + ' ' + esc(ppl.join(', ')) + '.</p>' : '') +
      '<h3>' + esc(L(['Pictures and icons', 'الرسوم والأيقونات'])) + '</h3><p>' + esc(L(['3D objects: Microsoft Fluent Emoji. Icons: Phosphor Icons. Both MIT licence.', 'الأشكال المجسمة: Microsoft Fluent Emoji. الأيقونات: Phosphor Icons. كلاهما برخصة MIT.'])) + '</p></div>';
    A.sheet(L(['Credits and licences', 'الشكر والتراخيص']), html, function (sh) {
      Array.prototype.forEach.call(sh.querySelectorAll('[data-url]'), function (a) { a.onclick = function (e) { e.preventDefault(); var u = a.dataset.url; if (A.N.has()) A.N.call('openUrl', u); else window.open(u, '_blank', 'noopener'); }; });
    });
  };
  function about() {
    var P = [['One rhythm, every lesson', 'Remember, meet, name it, try together, on your own, make it, keep it. Attention goes to the idea, not to working out the screen.'],
      ['A key is earned, then proven', 'Forged means passed unaided. Proven means it was produced, and recalled at least a day later. Deep means still there after two weeks. A hint is help, and is recorded honestly as help.'],
      ['Keys dim on purpose', 'Memory fades. A key’s light is an estimate of how well it is held, and the path brings it back just as it starts to slip. Recalling something as it fades is what makes it last.'],
      ['Stage is not level', 'Stage decides how things look and how long they run. Level is earned room by room. A child can be ahead in maths and just starting Arabic.'],
      ['Real things first', 'Objects, then pictures, then symbols. In science you commit to a prediction before you see the result. Missions send children off the screen to do it for real, and only a person can confirm them.'],
      ['The body learns too', 'Young children stand up every few minutes. Lessons ask for the idea to be acted out, walked, built or hunted for around the house. A remembering day each week has no new doors at all.'],
      ['The plan adapts', 'The path is rebuilt each morning from what is actually held in memory. Fading keys come first. Too many fading keys, or a falling memory rate, means fewer new doors; strong memory brings more. A door failed twice rests for a day while what it stands on is strengthened. You can always see why.'],
      ['Rewards are real', 'No points, no streaks, no leaderboards. A key is the skill itself. A lantern lights when a whole unit can be shown, and a promise you set is kept by you, in real life.'],
      ['The Qurʾān is handled differently', 'No games, no effects, no scrambled verses. Memorising runs on sabaq, sabqī and manzil. A person listens, or the child honestly checks. No machine ever marks recitation.'],
      ['Sources', 'Qurʾān text: Tanzil Uthmani 1.1. Translation: The Clear Quran. Hadith: authentic narrations with their references. Duʿāʾ: Ḥiṣn al-Muslim. Recitations: al-Ḥuṣarī and al-ʿAfāsī, with word recordings from Quran.com. Stories and adab scenes are our own telling, each with its reference, and should be read with a teacher.'],
      ['Private', 'No account, no ads and no tracking. Your records stay on this phone. The internet is used only for a video a grown-up added, and to download Qur’an recordings once.']];
    return { html: head(T('How Miftāḥ teaches'), '', 'parent', T('Parents')) + '<div class="wrap" style="margin-top:14px">' + P.map(function (x) {
      var body = (x[0] === 'Private' && window.MIFTAH_DESKTOP)
        ? L(['No account, no ads and no tracking. Your records stay on this computer. The internet is used only for a video a grown-up added, and to download Qurʾān recordings once.', 'بلا حساب ولا إعلانات ولا تتبع. سجلاتك تبقى على هذا الحاسوب. لا يُستخدم الإنترنت إلا لفيديو أضافه أحد الكبار أو لتنزيل تلاوات القرآن مرة واحدة.'])
        : T(x[1]);
      return '<div class="card"><h3>' + esc(T(x[0])) + '</h3><p style="color:var(--t2);line-height:1.55;font-weight:500">' + esc(body) + '</p></div>';
    }).join('') + photoCredits() + '</div>' };
  }

  /* sheet stack: pickers and confirmations layer cleanly above an open form sheet without discarding it */
  var sheetStack = [], sheetKey = null, sheetSeq = 0;
  var FOCUSABLE = 'button:not([disabled]),a[href],input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function sheetFocusables(sh) {
    return Array.prototype.slice.call(sh.querySelectorAll(FOCUSABLE)).filter(function (el) { return !el.hidden && el.offsetParent !== null; });
  }
  function bindSheetKey() {
    if (sheetKey) return;
    sheetKey = function (e) {
      if (!sheetStack.length) return;
      var sh = sheetStack[sheetStack.length - 1][1];
      if (e.key === 'Escape') { e.preventDefault(); A.closeSheet(); return; }
      if (e.key !== 'Tab') return;
      var list = sheetFocusables(sh);
      if (!list.length) { e.preventDefault(); sh.focus(); return; }
      var first = list[0], last = list[list.length - 1];
      if (e.shiftKey) { if (document.activeElement === first || !sh.contains(document.activeElement)) { e.preventDefault(); last.focus(); } }
      else { if (document.activeElement === last || !sh.contains(document.activeElement)) { e.preventDefault(); first.focus(); } }
    };
    document.addEventListener('keydown', sheetKey);
  }
  A.sheet = function (title, html, mount, opts) {
    var stack = !!(opts && opts.stack && sheetStack.length);
    var prev = document.activeElement;
    if (!stack && sheetStack.length) {
      prev = sheetStack[0][2];
      while (sheetStack.length) A.closeSheet();
    }
    var depth = sheetStack.length, tid = 'sheet-title-' + (++sheetSeq);
    var bg = document.createElement('div'); bg.className = 'sheetbg'; bg.style.zIndex = String(50 + depth * 2);
    var sh = document.createElement('div'); sh.className = 'sheet'; sh.style.zIndex = String(51 + depth * 2);
    /* a header that stays, with a way to close; the content scrolls under it */
    sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true'); sh.setAttribute('aria-labelledby', tid); sh.tabIndex = -1;
    sh.innerHTML = '<div class="sheet-h"><h2 id="' + tid + '">' + esc(title) + '</h2><button class="sheet-x" type="button" aria-label="' + esc(A.L(['Close', 'إغلاق'])) + '">' + A.icon('close', 20) + '</button></div><div class="sheet-b">' + html + '</div>';
    sh.querySelector('.sheet-x').onclick = function () { A.closeSheet(); };
    document.body.appendChild(bg); document.body.appendChild(sh);
    sheetStack.push([bg, sh, prev]); bg.onclick = function () { A.closeSheet(); };
    bindSheetKey();
    requestAnimationFrame(function () { bg.classList.add('on'); sh.classList.add('on'); });
    if (mount) mount(sh);
    var bodyEl = sh.querySelector('.sheet-b'), firstInBody = bodyEl && sheetFocusables(bodyEl)[0];
    var target = firstInBody || sh.querySelector('.sheet-x') || sh;
    try { target.focus({ preventScroll: true }); } catch (e) { try { target.focus(); } catch (e2) { } }
  };
  A.closeSheet = function () {
    if (!sheetStack.length) return false;
    var s = sheetStack.pop(), prev = s[2];
    if (!sheetStack.length && sheetKey) { document.removeEventListener('keydown', sheetKey); sheetKey = null; }
    s[0].classList.remove('on'); s[1].classList.remove('on');
    setTimeout(function () { s[0].remove(); s[1].remove(); }, 300);
    if (prev && prev.isConnected && typeof prev.focus === 'function') { try { prev.focus({ preventScroll: true }); } catch (e) { try { prev.focus(); } catch (e2) { } } }
    return true;
  };
})();
