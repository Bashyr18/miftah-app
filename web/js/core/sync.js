/* Family sync with no server: one device saves a family file to storage the family owns, the other merges it in.
   Nothing is overwritten. Evidence is an event log, so two devices' histories join cleanly and memory is replayed from the joined log. */
(function () {
  'use strict';
  var A = window.A, M = window.M, $ = A.$, L = A.L, esc = A.esc;
  var Sync = A.Sync = {};
  function sameChild(a, b) { return a.id === b.id || (String(a.name).trim().toLowerCase() === String(b.name).trim().toLowerCase() && a.by === b.by); }
  function unionBy(a, b, keyOf, pick) { var m = {}, order = []; (a || []).concat(b || []).forEach(function (x) { var k = keyOf(x); if (m[k] === undefined) { m[k] = x; order.push(k); } else if (pick) m[k] = pick(m[k], x); }); return order.map(function (k) { return m[k]; }); }
  function maxMap(a, b) { var o = Object.assign({}, a || {}); Object.keys(b || {}).forEach(function (k) { o[k] = Math.max(+o[k] || 0, +b[k] || 0); }); return o; }
  function fill(a, b) { return Object.assign({}, b || {}, a || {}); }
  function newer(a, b) { return (b.t || 0) > (a.t || 0) ? b : a; }
  /* recitation: each āyah keeps the furthest state either device reached */
  function mergeHifz(a, b) {
    if (!b || !b.u) return a || {}; if (!a || !a.u) return b;
    var u = Object.assign({}, a.u);
    Object.keys(b.u).forEach(function (k) { var x = u[k], y = b.u[k]; if (!x) { u[k] = y; return; } var o = Object.assign({}, x, y); Object.keys(o).forEach(function (f) { if (typeof x[f] === 'number' && typeof y[f] === 'number') o[f] = Math.max(x[f], y[f]); }); u[k] = o; });
    return Object.assign({}, a, { u: u, i: Math.max(a.i || 0, b.i || 0), a: Math.max(a.a || 1, b.a || 1), log: unionBy(a.log, b.log, JSON.stringify), finished: unionBy(a.finished, b.finished, String) });
  }
  function mergeKeys(led, ka, kb) {
    var out = {}, bySkill = {}; led.forEach(function (e) { (bySkill[e.s] = bySkill[e.s] || []).push(e); });
    Object.keys(fill(ka, kb)).concat(Object.keys(bySkill)).forEach(function (s) {
      if (out[s]) return; var x = (ka || {})[s], y = (kb || {})[s];
      if (!x || !y) { var only = x || y; if (only) { out[s] = only; return; } }
      var k = M.blank(); (bySkill[s] || []).forEach(function (e) { M.apply(k, e); });
      [x, y].forEach(function (o) { if (!o) return; ['forged', 'proven', 'deep', 'first'].forEach(function (f) { if (o[f]) k[f] = k[f] ? Math.min(k[f], o[f]) : o[f]; }); ['lastOk', 'h'].forEach(function (f) { k[f] = Math.max(k[f] || 0, o[f] || 0); }); });
      out[s] = k;
    });
    return out;
  }
  function mergeChild(a, b) {
    a = a || {}; b = b || {};
    var led = unionBy(a.led, b.led, function (e) { return e.i + '|' + e.s + '|' + e.k; }).sort(function (x, y) { return x.t - y.t; });
    if (led.length > 20000) led = led.slice(led.length - 20000);
    var o = Object.assign({}, b, a, {
      led: led, keys: mergeKeys(led, a.keys, b.keys), hifz: mergeHifz(a.hifz, b.hifz), path: a.path || null, resume: a.resume || null,
      time: maxMap(a.time, b.time), screen: maxMap(a.screen, b.screen), extra: maxMap(a.extra, b.extra), recs: maxMap(a.recs, b.recs),
      placed: fill(a.placed, b.placed), notyet: fill(a.notyet, b.notyet), units: fill(a.units, b.units), obs: unionBy(a.obs, b.obs, JSON.stringify),
      pending: unionBy(a.pending, b.pending, JSON.stringify), pin: unionBy(a.pin, b.pin, String),
      hist: unionBy(a.hist, b.hist, JSON.stringify),
      /* printed sheets: every sheet from either phone, and a mark or a tick made on either one counts (the first marking wins: its evidence is already logged) */
      sheets: unionBy(a.sheets, b.sheets, function (x) { return x.id; }, function (p, q) { var w = p.marked ? p : q.marked ? q : Object.assign({}, p, { done: p.done || q.done, skip: p.done || q.done ? undefined : p.skip || q.skip }); /* on-screen writing: the finished version, else the one with more on it; a parent's red marks from either side */ var size = function (x) { return JSON.stringify(x.ink || {}).length; }, ink = (p.sub || 0) !== (q.sub || 0) ? ((p.sub || 0) > (q.sub || 0) ? p : q).ink : (size(p) >= size(q) ? p : q).ink; var o = Object.assign({}, w, { n: Math.max(p.n || 1, q.n || 1), t: Math.max(p.t || 0, q.t || 0) }); if (p.scr || q.scr) { o.scr = Math.max(p.scr || 0, q.scr || 0); o.ink = ink; o.mk = (size({ ink: p.mk }) >= size({ ink: q.mk }) ? p.mk : q.mk) || undefined; o.again = Math.max(p.again || 0, q.again || 0) || undefined; o.againT = Math.max(p.againT || 0, q.againT || 0) || undefined; var sub = Math.max(p.sub || 0, q.sub || 0); /* a finish counts only if it came after the last "another go" */ o.sub = sub > (o.againT || 0) ? sub : undefined; if (!o.sub && !o.marked) { delete o.done; } } return o; }).sort(function (x, y) { return x.t - y.t; }).slice(-120),
      exams: unionBy(a.exams, b.exams, function (x) { return x.r + x.y + x.t; }), papers: unionBy(a.papers, b.papers, function (x) { return x.r + x.t; }),
      certs: unionBy(a.certs, b.certs, function (x) { return x.r + x.y; }, function (p, q) { return q.p > p.p ? q : p; }),
      cards: unionBy(a.cards, b.cards, function (x) { return x.f; }, function (p, q) { return (q.next || 0) > (p.next || 0) ? q : p; }),
      books: unionBy(a.books, b.books, function (x) { return x.title; }, function (p, q) { return (q.at || 0) > (p.at || 0) ? q : p; }),
      work: unionBy(a.work, b.work, function (x) { return x.title; }, function (p, q) { var w = newer(p, q), other = w === p ? q : p; if (other.text && other.text !== w.text) w = Object.assign({}, w, { versions: (w.versions || []).concat([{ t: other.t || 0, text: other.text }]).slice(-6) }); return w; })
    });
    ['hist', 'sheets', 'exams', 'papers', 'certs', 'cards', 'books', 'work', 'obs', 'pending', 'pin'].forEach(function (k) { if (!a[k] && !b[k]) delete o[k]; });
    if (!a.pin && !b.pin) o.pin = undefined;
    return o;
  }
  /* pure: two states in, the joined state and what changed out */
  Sync.merge = function (mine, theirs, withFiles) {
    var S = JSON.parse(JSON.stringify(mine)), report = [], data = theirs.data || {};
    (theirs.profiles || []).forEach(function (tp) {
      var lp = S.profiles.filter(function (p) { return sameChild(p, tp); })[0], fresh = !lp;
      if (fresh) { lp = JSON.parse(JSON.stringify(tp)); S.profiles.push(lp); }
      else lp.exams = unionBy(lp.exams, tp.exams, function (e) { return e.title + e.date; });
      if (!lp.arBook && tp.arBook) lp.arBook = tp.arBook;
      var a = S.data[lp.id], b = data[tp.id], before = a ? Object.keys(a.keys || {}).filter(function (k) { return a.keys[k].forged; }).length : 0, beforeA = a && a.hifz && a.hifz.u ? Object.keys(a.hifz.u).length : 0, ledA = a && a.led ? a.led.length : 0;
      if (b) S.data[lp.id] = mergeChild(a, b);
      var d = S.data[lp.id] || {}, after = Object.keys(d.keys || {}).filter(function (k) { return d.keys[k].forged; }).length;
      report.push({ id: lp.id, name: lp.name, fresh: fresh, lessons: after - before, ayat: (d.hifz && d.hifz.u ? Object.keys(d.hifz.u).length : 0) - beforeA, events: (d.led || []).length - ledA });
    });
    /* links always travel; files travel only inside a family file that carries them */
    S.media = unionBy(S.media, (theirs.media || []).filter(function (m) { return withFiles || m.kind === 'youtube'; }), function (m) { return m.kind + m.ref; });
    /* Arabic books travel with the family: a book entered on one device is there on the other, lesson by lesson, the fuller one kept */
    if (Array.isArray(theirs.books)) {
      if (!Array.isArray(S.books)) S.books = [];
      theirs.books.forEach(function (tb) {
        var lb = S.books.filter(function (b) { return b.id === tb.id; })[0];
        if (!lb) { S.books.push(JSON.parse(JSON.stringify(tb))); return; }
        (tb.lessons || []).forEach(function (tl) {
          var ll = (lb.lessons || []).filter(function (x) { return x.n === tl.n; })[0], size = function (x) { return x ? (x.words || []).length + (x.sents || []).length + (x.grammar || []).length : 0; };
          if (!ll) lb.lessons.push(JSON.parse(JSON.stringify(tl))); else if (size(tl) > size(ll)) { ll.title = tl.title; ll.words = tl.words; ll.grammar = tl.grammar; ll.sents = tl.sents; }
        });
        lb.lessons.sort(function (x, y) { return x.n - y.n; });
      });
      if (A.Books) A.Books.register();
    }
    S.lastSync = A.now().getTime();
    return { S: S, report: report };
  };
  /* ---------- the phone and the family's computer, on the home Wi-Fi (Android with Miftāḥ for Windows) ---------- */
  var B = function () { return window.AndroidBridge && window.AndroidBridge.lanInfo ? window.AndroidBridge : null; };
  Sync.lan = function () { var b = B(); if (!b) return null; try { return JSON.parse(b.lanInfo()); } catch (e) { return null; } };
  function stateOut() { return JSON.stringify(Object.assign({}, A.S, { familyFile: 1 })); }
  Sync.lanNow = function (quiet) { var b = B(), i = Sync.lan(); if (!b || !i || !i.paired || Sync.busy) return false; Sync.busy = true; b.lanSync(stateOut(), !!quiet); return true; };
  var WHY = {
    away: ['Your computer was not found. Is Miftāḥ open on it, on the same Wi-Fi?', 'لم يُعثر على حاسوبك. هل مفتاح مفتوح عليه، على الشبكة نفسها؟'],
    forgotten: ['The computer no longer knows this phone. Pair them again.', 'لم يعد الحاسوب يعرف هذا الهاتف. اقرنهما من جديد.'],
    code: ['That code is not right, or it has run out. Make a new one on the computer.', 'الرمز غير صحيح أو انتهى. أنشئ رمزًا جديدًا على الحاسوب.'],
    locked: ['Too many tries. Make a new code on the computer.', 'محاولات كثيرة. أنشئ رمزًا جديدًا على الحاسوب.'],
    home: ['Only computers on your home network can be paired.', 'لا يُقرن إلا حاسوب على شبكة بيتك.'],
    fail: ['That did not work. Try again in a moment.', 'لم ينجح ذلك. حاول بعد لحظة.']
  };
  window.__native.onLanSynced = function (ok, merged, name, got, sent, quiet) {
    Sync.busy = false;
    if (!ok) { if (!quiet || name === 'forgotten') A.toast(L(WHY[name] || WHY.fail)); if (name === 'forgotten') { var b = B(); if (b) b.lanForget(); } return; }
    try {
      var o = JSON.parse(merged), r = Sync.merge(A.S, o, true); A.S = A.shape(r.S);
      if (window.Voice && Voice.refreshVoices) Voice.refreshVoices(); A.saveNow(); A.rerender();
      var gotL = r.report.reduce(function (n, x) { return n + Math.max(0, x.lessons) + Math.max(0, x.ayat); }, 0);
      A.toast(L(['Joined with', 'تم الدمج مع']) + ' ' + name + (gotL ? ' · +' + A.num(gotL) : '') + (got ? ' · ' + A.num(got) + ' ' + L(['files', 'ملفات']) : ''));
    } catch (e) { if (!quiet) A.toast(L(WHY.fail)); }
  };
  window.__native.onLanPaired = function (ok, name, err) {
    var st = $('#sy-st'); if (st) st.textContent = '';
    if (!ok) { A.toast(L(WHY[err] || WHY.fail)); var go = $('#sy-pair'); if (go) go.disabled = false; return; }
    A.closeSheet(); A.toast(L(['Paired with', 'اقترن مع']) + ' ' + name); setTimeout(function () { Sync.lanNow(false); }, 300);
  };
  window.__native.onLanFound = function (list) {
    var box = $('#sy-found'); if (!box) return;
    var st = $('#sy-st'); if (st) st.textContent = list.length ? '' : L(['Nothing found. Is Miftāḥ open on the computer, with “Let my phone find this computer” on?', 'لم يُعثر على شيء. هل مفتاح مفتوح على الحاسوب، مع تفعيل «دع هاتفي يجد هذا الحاسوب»؟']);
    box.innerHTML = list.map(function (c, i) { return '<button class="li sy-pc" data-i="' + i + '">' + A.icon('grown', 22) + '<span class="grow"><b>' + esc(c.name) + '</b><small>' + esc(c.ip) + (c.pairing ? ' · ' + esc(L(['showing a code', 'يعرض رمزًا'])) : '') + '</small></span>' + A.icon('next', 18) + '</button>'; }).join('');
    A.$$('.sy-pc', box).forEach(function (b) { b.onclick = function () { askCode(list[+b.dataset.i]); }; });
  };
  function askCode(pc) {
    var box = $('#sy-lan'); if (!box) return;
    box.innerHTML = '<p class="sy-p">' + esc(L(['Type the six digits shown on', 'اكتب الأرقام الستة الظاهرة على'])) + ' <b>' + esc(pc.name) + '</b></p><input class="tin sy-code" id="sy-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="••••••" dir="ltr"><button class="btn pri wide" id="sy-pair" style="margin-top:10px">' + esc(L(['Pair', 'اقرن'])) + '</button><small class="sy-st" id="sy-st"></small>';
    var i = $('#sy-code', box), go = $('#sy-pair', box); i.focus();
    var send = function () { var c = i.value.replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); }).replace(/\D/g, ''); if (c.length !== 6) { Fx.shake(i); return; } go.disabled = true; $('#sy-st', box).textContent = L(['Pairing…', 'جارٍ الاقتران…']); B().lanPair(pc.ip, pc.port || 47731, pc.id, c); };
    go.onclick = send; i.onkeydown = function (e) { if (e.key === 'Enter') send(); };
  }
  function lanBlock() {
    var i = Sync.lan(); if (!i) return '';
    if (i.paired) return '<div class="sy-lan" id="sy-lan"><div class="li sy-pc on">' + A.icon('grown', 22) + '<span class="grow"><b>' + esc(i.name) + '</b><small>' + esc(L(['Joins by itself at home', 'يندمج وحده في البيت'])) + (i.last ? ' · ' + esc(new Date(i.last).toLocaleString(A.ar() ? 'ar-u-nu-arab' : 'en', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })) : '') + '</small></span></div><button class="btn pri wide" id="sy-now">' + esc(L(['Join with my computer now', 'ادمج مع حاسوبي الآن'])) + '</button><button class="btn ghost sm" id="sy-forget">' + esc(L(['Forget this computer', 'انسَ هذا الحاسوب'])) + '</button></div>';
    return '<div class="sy-lan" id="sy-lan"><button class="btn pri wide" id="sy-find">' + esc(L(['Find my computer', 'ابحث عن حاسوبي'])) + '</button><small class="sy-st" id="sy-st">' + esc(L(['Miftāḥ for Windows, on the same Wi-Fi', 'مفتاح لويندوز على الشبكة نفسها'])) + '</small><div id="sy-found"></div><button class="sy-manual" id="sy-man">' + esc(L(['Type its address instead', 'اكتب عنوانه بدلًا من ذلك'])) + '</button></div>';
  }
  function bindLan(sh) {
    var f = $('#sy-find', sh); if (f) f.onclick = function () { f.disabled = true; $('#sy-st', sh).textContent = L(['Looking on your Wi-Fi…', 'يبحث في شبكتك…']); B().lanFind(); setTimeout(function () { f.disabled = false; }, 2600); };
    var m = $('#sy-man', sh); if (m) m.onclick = function () {
      var box = $('#sy-lan', sh);
      box.innerHTML = '<p class="sy-p">' + esc(L(['The address and code are on the computer, in Phone and computer.', 'العنوان والرمز على الحاسوب في «الهاتف والحاسوب».'])) + '</p><input class="tin" id="sy-ip" inputmode="decimal" placeholder="192.168.1.20" dir="ltr"><button class="btn ghost wide" id="sy-ipgo" style="margin-top:8px">' + esc(L(['Continue', 'متابعة'])) + '</button><small class="sy-st" id="sy-st"></small><div id="sy-found"></div>';
      $('#sy-ipgo', box).onclick = function () { var ip = $('#sy-ip', box).value.trim(); if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) { Fx.shake($('#sy-ip', box)); return; } $('#sy-st', box).textContent = L(['Asking that computer…', 'يسأل ذلك الحاسوب…']); B().lanProbe(ip); };
    };
    var n = $('#sy-now', sh); if (n) n.onclick = function () { A.closeSheet(); A.toast(L(['Joining…', 'جارٍ الدمج…'])); Sync.lanNow(false); };
    var g = $('#sy-forget', sh); if (g) g.onclick = function () { B().lanForget(); A.closeSheet(); A.toast(L(['Forgotten', 'نُسي'])); };
  }
  /* at home, a paired phone joins quietly when Miftāḥ opens or comes back, at most every ten minutes */
  function quiet() { var i = Sync.lan(); if (i && i.paired && Date.now() - (i.last || 0) > 10 * 60000 && A.S.profiles && A.S.profiles.length) Sync.lanNow(true); }
  setTimeout(quiet, 4000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) setTimeout(quiet, 1500); });

  /* ---------- the sheet ---------- */
  Sync.open = function () {
    var last = A.S.lastSync, when = last ? new Date(last).toLocaleDateString(A.ar() ? 'ar-u-nu-arab' : 'en', { day: 'numeric', month: 'short' }) : '';
    A.sheet(L(['Your other device', 'جهازك الآخر']), '<div class="sy">' + (B() ? '<h4 class="sy-h">' + esc(L(['My computer', 'حاسوبي'])) + '</h4>' + lanBlock() + '<h4 class="sy-h">' + esc(L(['Or with a file', 'أو بملف'])) + '</h4>' : '') + '<button class="btn pri wide" id="sy-out">' + esc(L(['Send to my other device', 'أرسل إلى جهازي الآخر'])) + '</button><ol class="sy-how"><li>' + esc(L(['Choose Quick Share, Bluetooth or WhatsApp', 'اختر المشاركة السريعة أو البلوتوث أو واتساب'])) + '</li><li>' + esc(L(['On the other device, open the file with Miftāḥ', 'في الجهاز الآخر افتح الملف بتطبيق مفتاح'])) + '</li></ol><button class="btn ghost wide" id="sy-in">' + esc(L(['Open a file I have', 'افتح ملفًا لدي'])) + '</button>' + (when ? '<small class="sy-last">' + esc(L(['Last joined', 'آخر دمج'])) + ' · ' + esc(when) + '</small>' : '') + '</div>', function (sh) {
      bindLan(sh);
      $('#sy-out', sh).onclick = function () {
        var json = JSON.stringify(Object.assign({}, A.S, { familyFile: 1 })); A.S.lastSync = A.now().getTime(); A.saveNow(); A.closeSheet();
        if (A.N.has()) A.N.call('shareFamily', json); else { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = 'miftah-family.json'; a.click(); }
      };
      $('#sy-in', sh).onclick = function () {
        A.closeSheet(); A.__syncIn = true;
        if (A.N.has()) { A.N.call('importFile'); return; }
        var f = document.createElement('input'); f.type = 'file'; f.accept = 'application/json'; f.onchange = function () { var r = new FileReader(); r.onload = function () { window.__native.onImport(r.result); }; r.readAsText(f.files[0]); }; f.click();
      };
    });
  };
  var import0 = window.__native.onImport;
  window.__native.onImport = function (txt, withFiles, shared) {
    if (!A.__syncIn && !shared) return import0(txt);
    A.__syncIn = false;
    try {
      var o = JSON.parse(txt); if (!o || !Array.isArray(o.profiles)) throw 0;
      var r = Sync.merge(A.S, o, withFiles); A.S = A.shape(r.S); if (withFiles && window.Voice && Voice.refreshVoices) Voice.refreshVoices(); A.saveNow(); A.rerender();
      var rows = r.report.map(function (x) { return '<div class="row2"><span class="grow"><b>' + esc(x.name) + '</b></span>' + (x.fresh ? '<span class="cnt hot">+</span>' : '') + '<span class="cnt">+' + A.num(Math.max(0, x.lessons)) + ' ' + esc(L(['lessons', 'دروس'])) + '</span>' + (x.ayat > 0 ? '<span class="cnt">+' + A.num(x.ayat) + ' ' + esc(L(['āyāt', 'آيات'])) + '</span>' : '') + '</div>'; }).join('');
      A.go('parent');
      A.sheet(L(['Joined', 'تم الدمج']), '<div class="card" style="box-shadow:none">' + (rows || '') + '</div>');
    } catch (e) { A.toast(L(['That file could not be read', 'تعذرت قراءة الملف'])); }
  };
})();
