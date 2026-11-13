/* The student's tools, second pass: fewer sentences, more structure. Study hub, cards, papers against a real clock, a record worth reading. */
(function () {
  'use strict';
  var A = window.A, C = window.C, M = window.M, Flow = window.Flow, Hifz = window.Hifz, Fx = window.Fx, Player = window.Player;
  var $ = A.$, $$ = A.$$, esc = A.esc, L = A.L, DAY = 864e5, N = function (x) { return A.num(x); };
  var PLUS = '<svg class="ic" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  var teen = function () { return A.P() && A.stage() >= 3; };
  function nav(on) { var t = function (k, ic, a) { return '<a href="#/' + k + '" class="' + (on === k ? 'on' : '') + '">' + A.icon(ic, 21) + '<span>' + esc(L(a)) + '</span></a>'; }; return '<nav class="nav" aria-label="' + esc(L(['Sections', 'الأقسام'])) + '">' + t('home', 'path', ['Today', 'اليوم']) + t('rooms', 'rooms', ['Subjects', 'المواد']) + t('study', 'book', ['Study', 'الدراسة']) + t('keys', 'keys', ['Record', 'السجل']) + '</nav>'; }
  function head(title, sub, back) { return '<header class="th"><div class="grow">' + (back ? '<a class="backp" href="#/' + back[0] + '">' + A.icon('back', 18) + '<span>' + esc(L(back[1])) + '</span></a>' : '') + '<h1>' + esc(title) + '</h1>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div></header>'; }
  function daysTo(iso) { return Math.ceil((new Date(iso + 'T23:59:00').getTime() - A.now().getTime()) / DAY); }
  function fmtDay(iso) { return new Date(iso + 'T12:00:00').toLocaleDateString(A.ar() ? 'ar' : 'en', { day: 'numeric', month: 'short', year: 'numeric' }); }
  function words(t) { return (t || '').trim().split(/\s+/).filter(Boolean).length; }
  function forgedIn(room) { var d = A.D(), out = []; C.rooms[room].units.forEach(function (u) { u.skills.forEach(function (s) { if (d.keys[s.id] && d.keys[s.id].forged && s.review) out.push(s); }); }); return out; }
  function flashDue() { var c = A.D().cards || [], t = A.now().getTime(); return c.filter(function (x) { return (x.next || 0) <= t; }); }
  function twoTap(b, fn) { b.onclick = function () { if (b.dataset.arm !== '1') { b.dataset.arm = '1'; b.classList.add('armed'); setTimeout(function () { b.dataset.arm = ''; b.classList.remove('armed'); }, 2600); return; } fn(); }; }

  /* ---------- plain words from twelve up ---------- */
  var info0 = A.stopInfo;
  A.stopInfo = function (st) {
    var r = info0(st); if (!teen()) return r;
    if (st.t === 'review') return Object.assign({}, r, { title: ['Review', 'مراجعة'], sub: ['What is due today', 'ما حان موعده اليوم'] });
    if (st.t === 'hifz') return Object.assign({}, r, { title: ['Qurʾān', 'القرآن'] });
    if (st.t === 'check') return Object.assign({}, r, { title: ['Unit test', 'اختبار الوحدة'] });
    if (st.t === 'move') return Object.assign({}, r, { title: ['Step away', 'استراحة'], sub: ['A minute off the screen', 'دقيقة بعيدًا عن الشاشة'] });
    return r;
  };
  /* ---------- today: parents move to the header ---------- */
  var home0 = A.V.home;
  A.V.home = function (a, r) {
    var v = home0(a, r); if (!teen() || !v || !v.html) return v;
    v.html = v.html.replace(/<a class="btn ghost" style="margin-top:14px" href="#\/parent">[\s\S]*?<\/a>/, '').replace('</div></header>', '</div>' + A.dn() + '<a class="abtn" href="#/parent" aria-label="' + esc(L(['Parents', 'الوالدان'])) + '">' + A.icon('gear', 20) + '</a></header>');
    return v;
  };
  /* ---------- study hub ---------- */
  var tile = function (href, ic, t, n, hot) { return '<a class="st3" href="#/' + href + '">' + A.icon(ic, 24) + '<b>' + esc(L(t)) + '</b>' + (n ? '<span class="st3-n' + (hot ? ' hot' : '') + '">' + N(n) + '</span>' : '') + '</a>'; };
  A.V.study = function () {
    if (!A.P()) return { redirect: 'home' };
    var p = A.P(), d = A.D(), wk = d.weekly || {}, exams = (p.exams || []).slice().sort(function (x, y) { return x.date < y.date ? -1 : 1; }), books = d.books || [];
    var papers = C.order.filter(function (r) { return r !== 'quran' && forgedIn(r).length >= 4; }).map(function (r) {
      var last = (d.papers || []).filter(function (x) { return x.r === r; }).slice(-1)[0];
      return '<a class="pap h-' + C.rooms[r].hue + '" href="#/paper/' + r + '"><b>' + esc(L(C.rooms[r].name)) + '</b><span>' + (last ? N(last.p) + '%' : N(20) + L([' min', ' د'])) + '</span></a>';
    }).join('');
    var ex = exams.map(function (e, i) { var left = daysTo(e.date); return '<div class="row2"><span class="grow"><b>' + esc(e.title) + '</b><small>' + esc(fmtDay(e.date)) + '</small></span>' + (left >= 0 ? '<span class="cnt' + (left <= 14 ? ' hot' : '') + '">' + N(left) + L(['d', 'ي']) + '</span>' : '') + '<button class="ibtn" data-a="t-exam-del" data-i="' + i + '" aria-label="' + esc(L(['Remove', 'حذف'])) + '">' + A.icon('close', 16) + '</button></div>'; }).join('');
    var bk = books.map(function (b, i) { var pc = b.of ? Math.min(100, Math.round((b.at || 0) / b.of * 100)) : 0; return '<button class="row2" data-a="b-edit" data-i="' + i + '"><span class="grow"><b>' + esc(b.title) + '</b><span class="tbar"><i style="width:' + pc + '%"></i></span></span><span class="cnt">' + N(b.at || 0) + '/' + N(b.of || 0) + '</span></button>'; }).join('');
    var card = function (t, add, body) { return '<div class="card"><div class="chd"><h3>' + esc(L(t)) + '</h3>' + (add ? '<button class="ibtn on" data-a="' + add + '" aria-label="' + esc(L(['Add', 'إضافة'])) + '">' + PLUS + '</button>' : '') + '</div>' + body + '</div>'; };
    return {
      html: head(L(['Study', 'الدراسة'])) + '<div class="tw sw"><div class="st3s">' + tile('flash', 'keys', ['Cards', 'البطاقات'], flashDue().length, true) + tile('write', 'pen', ['Essays', 'المقالات'], (d.work || []).length) + tile('lab', 'sparkle', ['Lab', 'المختبر']) + '</div>' +
        (papers ? '<div class="tsec">' + esc(L(['Timed papers', 'اختبارات موقوتة'])) + '</div><div class="paps">' + papers + '</div>' : '') +
        card(['This week', 'هذا الأسبوع'], null, '<input class="tin" id="t-goal" maxlength="80" value="' + esc(wk.goal || '') + '" placeholder="' + esc(L(['One goal', 'هدف واحد'])) + '"><textarea class="tin" id="t-rev" rows="2" placeholder="' + esc(L(['Sunday review', 'مراجعة الأحد'])) + '">' + esc(wk.review || '') + '</textarea>') +
        card(['Exams', 'الاختبارات'], 'x-add', ex) + card(['Books', 'الكتب'], 'b-add', bk) + '</div>' + (A.stage() >= 3 ? nav('study') : ''),
      mount: function (v) { var save = function () { var dd = A.D(); dd.weekly = { goal: $('#t-goal', v).value.trim(), review: $('#t-rev', v).value.trim(), t: A.now().getTime() }; A.save(); }; $('#t-goal', v).oninput = save; $('#t-rev', v).oninput = save; }
    };
  };
  A.acts['x-add'] = function () {
    A.sheet(L(['Exam', 'اختبار']), '<div class="ed"><input class="tin" id="x-t" placeholder="' + esc(L(['Name', 'الاسم'])) + '"><input class="tin" id="x-d" type="date" aria-label="' + esc(L(['Date', 'التاريخ'])) + '"><button class="btn pri wide" id="x-go">' + esc(L(['Add', 'إضافة'])) + '</button></div>', function (sh) {
      $('#x-go', sh).onclick = function () { var t = $('#x-t', sh).value.trim(), dt = $('#x-d', sh).value; if (!t) { Fx.shake($('#x-t', sh)); return; } if (!dt) { Fx.shake($('#x-d', sh).nextSibling || $('#x-d', sh)); return; } var p = A.P(); p.exams = (p.exams || []).concat([{ title: t, date: dt }]); A.saveNow(); A.closeSheet(); A.rerender(); };
    });
  };
  A.acts['b-add'] = function () {
    A.sheet(L(['Book', 'كتاب']), '<div class="ed"><input class="tin" id="b-t" placeholder="' + esc(L(['Title', 'العنوان'])) + '"><input class="tin" id="b-p" type="number" inputmode="numeric" min="1" placeholder="' + esc(L(['Pages', 'الصفحات'])) + '"><button class="btn pri wide" id="b-go">' + esc(L(['Add', 'إضافة'])) + '</button></div>', function (sh) {
      $('#b-go', sh).onclick = function () { var t = $('#b-t', sh).value.trim(); if (!t) { Fx.shake($('#b-t', sh)); return; } var d = A.D(); d.books = (d.books || []).concat([{ title: t, of: +$('#b-p', sh).value || 0, at: 0 }]); A.saveNow(); A.closeSheet(); A.rerender(); };
    });
  };
  A.acts['b-edit'] = function (t) {
    var i = +t.dataset.i, b = A.D().books[i]; if (!b) return;
    A.sheet(b.title, '<div class="ed"><div class="stepr"><button class="ibtn big" id="b-m">−</button><input class="tin" id="b-at" type="number" inputmode="numeric" value="' + (b.at || 0) + '" aria-label="' + esc(L(['Page', 'الصفحة'])) + '"><button class="ibtn big" id="b-u">+</button></div><div class="trow"><button class="btn pri" id="b-s">' + esc(L(['Save', 'حفظ'])) + '</button><button class="btn sec" id="b-x">' + A.icon('trash', 18) + '<span>' + esc(L(['Delete', 'حذف'])) + '</span></button></div></div>', function (sh) {
      var inp = $('#b-at', sh), bump = function (n) { inp.value = Math.max(0, Math.min(b.of || 1e6, (+inp.value || 0) + n)); };
      $('#b-m', sh).onclick = function () { bump(-10); }; $('#b-u', sh).onclick = function () { bump(10); };
      $('#b-s', sh).onclick = function () { b.at = Math.max(0, Math.min(b.of || 1e6, +inp.value || 0)); A.saveNow(); A.closeSheet(); A.rerender(); };
      twoTap($('#b-x', sh), function () { A.D().books.splice(i, 1); A.saveNow(); A.closeSheet(); A.rerender(); });
    });
  };
  /* ---------- flashcards ---------- */
  function gaps(c) { return [.01, Math.max(1, (c.gap || 1) * 1.2), Math.min(180, Math.max(1, (c.gap || .5) * 2.4))]; }
  function gapTxt(g) { return g < 1 ? N(15) + L([' min', ' د']) : N(Math.round(g)) + L(['d', 'ي']); }
  A.V.flash = function () {
    if (!A.P()) return { redirect: 'home' };
    var cards = A.D().cards || [], due = flashDue(), c = due[0], gp = c && gaps(c);
    var list = cards.map(function (x, i) { var left = Math.ceil(((x.next || 0) - A.now().getTime()) / DAY); return '<div class="row2"><span class="grow"><b>' + esc(x.f) + '</b><small>' + esc(x.deck || '') + '</small></span><span class="cnt' + (left <= 0 ? ' hot' : '') + '">' + (left <= 0 ? esc(L(['due', 'الآن'])) : N(left) + L(['d', 'ي'])) + '</span><button class="ibtn" data-del="' + i + '" aria-label="' + esc(L(['Delete', 'حذف'])) + '">' + A.icon('close', 16) + '</button></div>'; }).join('');
    return {
      html: head(L(['Cards', 'البطاقات']), '', ['study', ['Study', 'الدراسة']]) + '<div class="tw sw"><div class="fl-k"><span><b>' + N(due.length) + '</b>' + esc(L(['due', 'مستحقة'])) + '</span><span><b>' + N(cards.length) + '</b>' + esc(L(['in all', 'الكل'])) + '</span><button class="ibtn on" data-a="c-add" aria-label="' + esc(L(['New card', 'بطاقة جديدة'])) + '">' + PLUS + '</button></div>' +
        (c ? '<button class="tflash" data-a="t-flip" id="t-card"><small>' + esc(c.deck || '') + '</small><span>' + esc(c.f) + '</span></button><div class="grades" id="t-grade" hidden><button data-a="t-grade" data-g="0"><b>' + esc(L(['Again', 'أعد'])) + '</b><small>' + gapTxt(gp[0]) + '</small></button><button data-a="t-grade" data-g="1"><b>' + esc(L(['Hard', 'صعبة'])) + '</b><small>' + gapTxt(gp[1]) + '</small></button><button class="on" data-a="t-grade" data-g="2"><b>' + esc(L(['Knew it', 'عرفتها'])) + '</b><small>' + gapTxt(gp[2]) + '</small></button></div>' : (cards.length ? '<div class="tflash idle"><span>' + A.icon('check', 28) + '</span></div>' : '<button class="mempty" data-a="c-add"><span>' + PLUS + '</span><b>' + esc(L(['New card', 'بطاقة جديدة'])) + '</b></button>')) +
        (list ? '<div class="card" style="margin-top:12px">' + list + '</div>' : '') + '</div>',
      mount: function (v) { $$('[data-del]', v).forEach(function (b) { twoTap(b, function () { A.D().cards.splice(+b.dataset.del, 1); A.saveNow(); A.rerender(); }); }); }
    };
  };
  A.acts['c-add'] = function () {
    A.sheet(L(['New card', 'بطاقة جديدة']), '<div class="ed"><textarea class="tin" id="t-f" rows="2" placeholder="' + esc(L(['Question', 'سؤال'])) + '"></textarea><textarea class="tin" id="t-b" rows="2" placeholder="' + esc(L(['Answer', 'جواب'])) + '"></textarea><input class="tin" id="t-dk" placeholder="' + esc(L(['Subject', 'المادة'])) + '"><button class="btn pri wide" id="c-go">' + esc(L(['Add', 'إضافة'])) + '</button></div>', function (sh) {
      var f = $('#t-f', sh), b = $('#t-b', sh); setTimeout(function () { f.focus(); }, 220);
      $('#c-go', sh).onclick = function () { if (!f.value.trim()) { Fx.shake(f); return; } if (!b.value.trim()) { Fx.shake(b); return; } var d = A.D(); d.cards = (d.cards || []).concat([{ f: f.value.trim(), b: b.value.trim(), deck: $('#t-dk', sh).value.trim(), next: 0, gap: 0 }]); A.saveNow(); f.value = ''; b.value = ''; f.focus(); A.__cardsDirty = true; A.toast(L(['Added', 'أُضيفت'])); };
    });
  };
  var close1 = A.closeSheet; A.closeSheet = function () { var r = close1(); if (A.__cardsDirty) { A.__cardsDirty = false; if (A.route() === 'flash') A.rerender(); } return r; };
  /* ---------- essays: delete, and bring back an earlier version ---------- */
  var write0 = A.V.write;
  A.V.write = function (args) {
    var v = write0(args); var id = args && args[0]; if (id == null || !v || !v.html || !v.mount) return v;
    var w = (A.D().work || [])[+id]; if (!w) return v;
    var vers = (w.versions || []).length;
    v.html = v.html.replace(/<\/div>$/, '<div class="trow" style="margin-top:8px">' + (vers ? '<button class="btn sec" id="t-w-v">' + esc(L(['Versions', 'النسخ'])) + ' · ' + N(vers) + '</button>' : '') + '<button class="btn sec" id="t-w-x">' + A.icon('trash', 18) + '<span>' + esc(L(['Delete', 'حذف'])) + '</span></button></div></div>');
    var m0 = v.mount, un0 = v.unmount; var gone = false;
    v.unmount = function () { if (!gone && un0) un0(); };
    v.mount = function (el) {
      m0(el); var p0 = $('#t-w-p', el); if (p0) p0.oninput = function () { w.plan = p0.value; A.save(); };
      var x = $('#t-w-x', el); if (x) twoTap(x, function () { gone = true; A.D().work.splice(+id, 1); A.saveNow(); A.go('write'); });
      var vb = $('#t-w-v', el); if (vb) vb.onclick = function () { A.picker(L(['Versions', 'النسخ']), w.versions.map(function (q, i) { return { v: String(i), t: new Date(q.t).toLocaleDateString(A.ar() ? 'ar' : 'en', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) + ' · ' + N(words(q.text)) + ' ' + L(['words', 'كلمة']) }; }).reverse(), '', function (i) { var q = w.versions[+i]; w.versions.push({ t: A.now().getTime(), text: w.text }); w.text = q.text; A.saveNow(); gone = true; A.rerender(); }); };
    };
    return v;
  };
  /* ---------- a timed paper against a real clock ---------- */
  A.V.paper = function (args) {
    if (!A.P()) return { redirect: 'home' };
    var room = args[0], list = C.rooms[room] ? forgedIn(room) : [];
    if (list.length < 4) return { redirect: 'study' };
    var tm = 0, left = 20 * 60, t0 = A.now().getTime();
    return {
      bare: true, html: '<div id="t-paper"></div>', unmount: function () { clearInterval(tm); },
      mount: function (v) {
        var rng = A.rng(A.seed()), steps = [];
        rng.shuffle(list).slice(0, 15).forEach(function (sk) { var st = sk.review(rng); (Array.isArray(st) ? st.slice(0, 1) : [st]).forEach(function (x) { steps.push(Object.assign({}, x, { ph: 'solo', skill: sk.id, hint: null, noHelp: true })); }); });
        Player.start($('#t-paper', v), {
          steps: steps, hue: C.rooms[room].hue, rng: rng, mode: 'review', exam: true, onExit: function () { A.go('study'); },
          onDone: function (res, host) {
            clearInterval(tm); var d = A.D(), pct = res.solo ? Math.round(res.soloOk / res.solo * 100) : 0, weak = {};
            d.led.forEach(function (e) { if (e.t >= t0 && !e.ok && e.k !== 'forge') weak[e.s] = 1; });
            d.papers = (d.papers || []).concat([{ r: room, t: A.now().getTime(), p: pct, n: res.solo, s: 1200 - left }]).slice(-100); A.saveNow();
            var mm = Math.floor((1200 - left) / 60), wk = Object.keys(weak).map(C.skill).filter(Boolean).slice(0, 6);
            host.innerHTML = '<div class="tres ' + (pct >= 70 ? 'ok' : 'no') + '"><small>' + esc(L(C.rooms[room].name)) + '</small><h2>' + N(pct) + '%</h2><div class="fl-k"><span><b>' + N(res.soloOk) + '/' + N(res.solo) + '</b>' + esc(L(['correct', 'صحيحة'])) + '</span><span><b>' + N(mm) + L([' min', ' د']) + '</b>' + esc(L(['taken', 'استغرق'])) + '</span></div>' + (wk.length ? '<div class="card" style="margin:6px 0 12px"><h3>' + esc(L(['To strengthen', 'لتقويته'])) + '</h3>' + wk.map(function (k) { return '<a class="act" href="#/lesson/' + k.id + '"><span class="grow"><b>' + esc(L(k.title)) + '</b></span>' + A.icon('next', 16) + '</a>'; }).join('') + '</div>' : '') + '<a class="btn pri wide" href="#/study">' + esc(L(['Done', 'تم'])) + '</a></div>';
          }
        });
        var clock = document.createElement('div'); clock.className = 'pclock'; clock.setAttribute('role', 'timer');
        var sp = $('.pl-sp', v); if (sp) sp.replaceWith(clock); else $('.pl-top', v).appendChild(clock);
        var paint = function () { clock.textContent = N(Math.floor(left / 60)) + ':' + A.num(('0' + (left % 60)).slice(-2)); clock.classList.toggle('hot', left <= 120); };
        paint();
        tm = setInterval(function () { left = Math.max(0, left - 1); paint(); if (left <= 0) { clearInterval(tm); Player.finishNow(); } }, 1000);
      }
    };
  };
  /* ---------- the record ---------- */
  var keys0 = A.V.keys;
  A.V.keys = function (a, r) {
    if (!teen()) return keys0(a, r);
    var d = A.D(), tot = 0, strSum = 0;
    var rows = C.order.filter(function (id) { return id !== 'quran'; }).map(function (id) {
      var R = C.rooms[id], n = 0, str = 0, all = 0; R.units.forEach(function (u) { if (u.band > A.stage()) return; u.skills.forEach(function (s) { all++; if (d.keys[s.id] && d.keys[s.id].forged) { n++; str += M.light(s.id); } }); });
      tot += n; strSum += str; var kept = n ? Math.round(str / n * 100) : 0;
      return '<a class="sr h-' + R.hue + '" href="#/room/' + id + '"><span class="sr-n">' + esc(L(R.name)) + '</span><span class="sr-y">' + (n ? N(kept) + '%' : '') + '</span><span class="sr-c">' + N(n) + '/' + N(all) + '</span><span class="sr-b"><i style="width:' + (all ? Math.round(n / all * 100) : 0) + '%"></i></span></a>';
    }).join('');
    var pp = d.papers || [], pAvg = pp.length ? Math.round(pp.slice(-10).reduce(function (s, x) { return s + x.p; }, 0) / Math.min(10, pp.length)) : null, certs = d.certs || [], h = Hifz.state();
    var kp = function (v, t) { return '<div class="kpi kpi-n"><b>' + v + '</b><small>' + esc(L(t)) + '</small></div>'; };
    var dd = function (t) { return new Date(t).toLocaleDateString(A.ar() ? 'ar' : 'en', { day: 'numeric', month: 'short' }); };
    var recent = pp.slice(-5).reverse().map(function (x) { return '<div class="ev2"><span class="grow"><b>' + esc(L(C.rooms[x.r].name)) + '</b><small>' + dd(x.t) + '</small></span><span class="cnt">' + N(x.p) + '%</span></div>'; }).join('');
    var cs = certs.map(function (c) { return '<button class="ev2 wide" data-a="c-cert" data-r="' + c.r + '" data-y="' + c.y + '">' + A.icon('star', 18) + '<span class="grow"><b>' + esc(L(C.rooms[c.r].name)) + ' · ' + esc(L(C.yearName(c.y))) + '</b><small>' + N(c.p) + '%</small></span>' + A.icon('print', 18) + '</button>'; }).join('');
    return { html: head(L(['Record', 'السجل'])) + '<div class="tw sw"><div class="kpis">' + kp(N(tot), ['Mastered', 'أُتقن']) + kp(tot ? N(Math.round(strSum / tot * 100)) + '%' : '–', ['Remembered', 'محفوظ']) + kp(pAvg == null ? '–' : N(pAvg) + '%', ['Papers', 'الاختبارات']) + kp(N(Object.keys(h.u).length), ['Āyāt', 'آيات']) + '</div><div class="card"><h3>' + esc(L(['Subjects', 'المواد'])) + '</h3>' + rows + '</div>' + (cs ? '<div class="card"><h3>' + esc(L(['Certificates', 'الشهادات'])) + '</h3>' + cs + '</div>' : '') + (recent ? '<div class="card"><h3>' + esc(L(['Recent papers', 'آخر الاختبارات'])) + '</h3>' + recent + '</div>' : '') + '<button class="btn sec wide" style="margin-top:12px" data-a="t-transcript">' + A.icon('print', 18) + '<span>' + esc(L(['Transcript', 'كشف الدرجات'])) + '</span></button></div>' + nav('keys') };
  };
  /* ---------- real maths: 7^6 reads as a power ---------- */
  var POW = /\^(\([^()\s]{1,10}\)|[-−]?[0-9a-zA-Zθ٠-٩]{1,4})/g;
  function pretty(root) {
    if (!root) return;
    A.$$('.pad-eq', root).forEach(function (e) { Array.prototype.forEach.call(e.childNodes, function (n) { if (n.nodeType === 3 && /(^|[\s(])-(?=[\d.a-z(])/i.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/(^|[\s(])-(?=[\d.a-z(])/gi, '$1−'); }); });
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), hits = [], n;
    while ((n = w.nextNode())) { if (n.nodeValue.indexOf('^') >= 0 && !(n.parentNode.closest && n.parentNode.closest('[data-k],textarea,input'))) hits.push(n); }
    hits.forEach(function (t) {
      var s = t.nodeValue, next = t.nextSibling;
      /* an answer box written as a power: 7^ followed by the box */
      if (/\^\s*$/.test(s) && next && next.classList && next.classList.contains('pad-out')) { t.nodeValue = s.replace(/\^\s*$/, ''); next.classList.add('pad-sup'); s = t.nodeValue; }
      if (!POW.test(s)) { POW.lastIndex = 0; return; } POW.lastIndex = 0;
      var f = document.createDocumentFragment(), last = 0, m;
      while ((m = POW.exec(s))) { f.appendChild(document.createTextNode(s.slice(last, m.index))); var u = document.createElement('sup'); u.textContent = m[1].replace(/^\((.*)\)$/, '$1').replace(/-/g, '−'); f.appendChild(u); last = m.index + m[0].length; }
      f.appendChild(document.createTextNode(s.slice(last))); t.parentNode.replaceChild(f, t);
    });
  }
  A.prettyMaths = pretty;
  var queued = false;
  new MutationObserver(function () { if (queued || !A.$('.pl')) return; queued = true; requestAnimationFrame(function () { queued = false; pretty(A.$('.pl')); }); }).observe(document.documentElement, { childList: true, subtree: true });
})();
