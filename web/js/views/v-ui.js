/* The app's own controls. Nothing here may look like a browser form: every picker is ours, explanations wait behind a small "i", and long sections fold cleanly without slamming shut. */
(function () {
  'use strict';
  var A = window.A, L = A.L, esc = A.esc;
  var chev = '<svg class="pk-chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var tick = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
  var openAcc = {};
  function titleFor(el) {
    var row = el.closest('.logr, .li'), rb = row && row.querySelector('b'); if (rb && rb.textContent.trim()) return rb.textContent.trim();
    var card = el.closest('.card'), ch = card && card.querySelector(':scope > h3, :scope > .card-h > h3'); var f = el.closest('.field, label'), lb = f && (f.querySelector('label') || f);
    if (!lb && ch) return ch.childNodes[0].textContent.trim();
    var t = el.getAttribute('aria-label') || (lb && lb.textContent && lb.textContent.trim().split('\n')[0]) || '';
    return t.length > 40 ? L(['Choose', 'اختر']) : t || L(['Choose', 'اختر']);
  }
  function fire(el) { el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }
  /* a list to choose from */
  A.picker = function (title, items, cur, done, opts) {
    var rows = function (q) {
      var out = '', last = null, ql = (q || '').toLowerCase();
      items.forEach(function (it, i) { if (ql && it.t.toLowerCase().indexOf(ql) < 0) return; if (it.g && it.g !== last) { out += '<div class="pk-g">' + esc(it.g) + '</div>'; last = it.g; } out += '<button class="pk-row' + (String(it.v) === String(cur) ? ' on' : '') + '" data-i="' + i + '"><span>' + esc(it.t) + '</span>' + (String(it.v) === String(cur) ? tick : '') + '</button>'; });
      return out || '<p class="pk-none">' + esc(L(['Nothing found', 'لا نتائج'])) + '</p>';
    };
    A.sheet(title, (items.length > 12 ? '<input class="tin pk-q" placeholder="' + esc(L(['Search', 'بحث'])) + '">' : '') + '<div class="pk-list">' + rows() + '</div>', function (sh) {
      var list = A.$('.pk-list', sh), q = A.$('.pk-q', sh);
      var bind = function () { A.$$('.pk-row', list).forEach(function (b) { b.onclick = function () { var it = items[+b.dataset.i]; A.N.haptic('tick'); A.closeSheet(); done(it.v); }; }); };
      bind(); var on = A.$('.pk-row.on', list); if (on) list.scrollTop = on.offsetTop - list.offsetTop - 60;
      if (q) q.oninput = function () { list.innerHTML = rows(q.value); bind(); };
    }, opts);
  };
  function wrapControl(el, text, open) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pk'; b.innerHTML = '<span class="pk-t">' + esc(text()) + '</span>' + chev;
    var lbl = el.getAttribute('aria-label') || titleFor(el);
    if (lbl) b.setAttribute('aria-label', lbl);
    b.onclick = function (e) { e.preventDefault(); open(function () { A.$('.pk-t', b).textContent = text(); fire(el); }, !!el.closest('.sheet')); };
    el.parentNode.insertBefore(b, el.nextSibling); el.style.display = 'none'; el.dataset.ui = '1';
    if (el.id) { var fl = document.querySelector('label[for="' + el.id + '"]'); if (fl && !fl.dataset.pkBound) { fl.dataset.pkBound = '1'; fl.addEventListener('click', function (ev) { ev.preventDefault(); b.click(); }); } }
    if (el.style.width === 'auto') b.style.width = 'auto';
  }
  function enhanceSelect(sel) {
    var label = function () { var o = sel.options[sel.selectedIndex]; return !o ? '' : /^[.…\s]*$/.test(o.textContent) ? L(['Choose', 'اختر']) : o.textContent; };
    wrapControl(sel, label, function (after, stack) {
      var items = []; Array.prototype.forEach.call(sel.options, function (o) { var g = o.parentNode && o.parentNode.tagName === 'OPTGROUP' ? o.parentNode.label : ''; if (!o.disabled && !/^[.…\s]*$/.test(o.textContent)) items.push({ v: o.value, t: o.textContent, g: g }); });
      A.picker(titleFor(sel), items, sel.value, function (v) { sel.value = v; after(); }, { stack: stack });
    });
  }
  /* a calendar */
  var MON = { en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'] };
  var DOW = { en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'], ar: ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'] };
  function iso(y, m, d) { return y + '-' + ('0' + (m + 1)).slice(-2) + '-' + ('0' + d).slice(-2); }
  function enhanceDate(inp) {
    var label = function () { if (!inp.value) return L(['Choose a date', 'اختر تاريخًا']); var q = inp.value.split('-'), l = A.ar() ? 'ar' : 'en'; return A.num(+q[2]) + ' ' + MON[l][+q[1] - 1] + ' ' + A.num(q[0]); };
    wrapControl(inp, label, function (after, stack) {
      var now = A.now(), base = inp.value ? inp.value.split('-') : null, y = base ? +base[0] : now.getFullYear(), m = base ? +base[1] - 1 : now.getMonth(), l = A.ar() ? 'ar' : 'en';
      var minV = inp.min || '', maxV = inp.max || '';
      A.sheet(L(['Choose a date', 'اختر تاريخًا']), '<div class="dcal"></div>', function (sh) {
        var host = A.$('.dcal', sh);
        (function draw() {
          var first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate(), today = iso(now.getFullYear(), now.getMonth(), now.getDate()), rtl = A.ar();
          var h = '<div class="cal-h"><button class="cal-n" data-d="-1" aria-label="' + esc(L(['Earlier', 'سابق'])) + '">' + (rtl ? '›' : '‹') + '</button><b>' + MON[l][m] + ' ' + A.num(y) + '</b><button class="cal-n" data-d="1" aria-label="' + esc(L(['Later', 'لاحق'])) + '">' + (rtl ? '‹' : '›') + '</button></div><div class="cal-g">' + DOW[l].map(function (x) { return '<i>' + x + '</i>'; }).join('');
          for (var i = 0; i < first; i++) h += '<span></span>';
          for (var d = 1; d <= days; d++) {
            var v = iso(y, m, d), off = (minV && v < minV) || (maxV && v > maxV);
            h += '<button class="cal-d' + (v === inp.value ? ' on' : '') + (v === today ? ' now' : '') + '" data-v="' + v + '"' + (off ? ' disabled' : '') + '>' + A.num(d) + '</button>';
          }
          host.innerHTML = h + '</div>';
          A.$$('.cal-n', host).forEach(function (b) { b.onclick = function () { m += +b.dataset.d; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } draw(); }; });
          A.$$('.cal-d:not([disabled])', host).forEach(function (b) { b.onclick = function () { inp.value = b.dataset.v; A.closeSheet(); after(); }; });
        })();
      }, { stack: stack });
    });
  }
  /* a clock */
  function enhanceTime(inp) {
    var label = function () { return A.num(inp.value || '09:00'); };
    wrapControl(inp, label, function (after, stack) {
      var q = (inp.value || '09:00').split(':'), h = q[0], mi = q[1], two = function (n) { return ('0' + n).slice(-2); }, hs = '', ms = '', i;
      for (i = 4; i < 23; i++) hs += '<button class="tp ' + (two(i) === h ? 'on' : '') + '" data-h="' + two(i) + '">' + A.num(two(i)) + '</button>';
      for (i = 0; i < 60; i += 5) ms += '<button class="tp ' + (two(i) === mi ? 'on' : '') + '" data-m="' + two(i) + '">' + A.num(two(i)) + '</button>';
      A.sheet(L(['Choose a time', 'اختر وقتًا']), '<div class="tp-lbl">' + esc(L(['Hour', 'الساعة'])) + '</div><div class="tp-g">' + hs + '</div><div class="tp-lbl">' + esc(L(['Minutes', 'الدقائق'])) + '</div><div class="tp-g">' + ms + '</div><button class="btn pri wide" id="tp-ok" style="margin-top:14px">' + esc(L(['Done', 'تم'])) + '</button>', function (sh) {
        A.$$('[data-h]', sh).forEach(function (b) { b.onclick = function () { h = b.dataset.h; A.$$('[data-h]', sh).forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
        A.$$('[data-m]', sh).forEach(function (b) { b.onclick = function () { mi = b.dataset.m; A.$$('[data-m]', sh).forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
        A.$('#tp-ok', sh).onclick = function () { inp.value = h + ':' + mi; A.closeSheet(); after(); };
      }, { stack: stack });
    });
  }
  /* explanations wait behind an "i", kept sibling to any accordion header so nested buttons never happen */
  function foldNote(p) {
    var card = p.parentNode, h = card && card.querySelector(':scope > h3, :scope > .card-h > h3'); if (!h || p.dataset.ui) return; p.dataset.ui = '1'; p.hidden = true;
    var row = h.parentNode.classList.contains('card-h') ? h.parentNode : null;
    if (!row) {
      row = document.createElement('div'); row.className = 'card-h';
      card.insertBefore(row, h); row.appendChild(h);
    }
    var b = document.createElement('button'); b.type = 'button'; b.className = 'info'; b.setAttribute('aria-label', L(['What is this?', 'ما هذا؟'])); b.textContent = 'i';
    b.onclick = function (e) {
      e.stopPropagation();
      if (card.classList.contains('shut')) {
        card.classList.remove('shut');
        var k = card.dataset.accKey; if (k) openAcc[k] = true;
        var tg = row.querySelector('.acc-t'); if (tg) tg.setAttribute('aria-expanded', 'true');
      }
      p.hidden = !p.hidden; b.classList.toggle('on', !p.hidden);
    };
    row.appendChild(b);
  }
  /* long multi-row cards fold cleanly and remember their open state across redraws */
  function foldCard(card, open, exclusive) {
    var h = card.querySelector(':scope > h3, :scope > .card-h > h3'); if (!h || card.dataset.acc) return;
    card.dataset.acc = '1'; card.classList.add('acc');
    var key = route() + '|' + h.textContent.trim(); card.dataset.accKey = key;
    var isOpen = openAcc[key] != null ? !!openAcc[key] : !!open;
    if (!isOpen) card.classList.add('shut');
    var row = h.parentNode.classList.contains('card-h') ? h.parentNode : null;
    if (!row) { row = document.createElement('div'); row.className = 'card-h'; card.insertBefore(row, h); row.appendChild(h); }
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'acc-t';
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.innerHTML = '<span>' + h.innerHTML + '</span>' + chev;
    h.innerHTML = ''; h.appendChild(btn);
    h.onclick = function () {
      var next = card.classList.contains('shut');
      if (next && exclusive && card.parentNode) {
        A.$$(':scope > .card.acc', card.parentNode).forEach(function (other) {
          if (other === card) return;
          other.classList.add('shut');
          if (other.dataset.accKey) openAcc[other.dataset.accKey] = false;
          var ob = other.querySelector('.acc-t'); if (ob) ob.setAttribute('aria-expanded', 'false');
        });
      }
      card.classList.toggle('shut', !next);
      openAcc[key] = next;
      btn.setAttribute('aria-expanded', next ? 'true' : 'false');
    };
  }
  /* phones and tablets fold extra tabs into More; wide desktop shows them inline */
  var KEEP = /\/(today|log|hear|make)$/;
  function foldTabs(row) {
    if (row.dataset.ui) return; var tabs = A.$$('a.tab', row); if (tabs.length < 6) return;
    if (window.MIFTAH_DESKTOP && window.innerWidth >= 1080) return;
    row.dataset.ui = '1';
    var more = tabs.filter(function (t) { return !KEEP.test(t.getAttribute('href')); }), active = more.filter(function (t) { return t.classList.contains('on'); })[0];
    more.forEach(function (t) { t.style.display = 'none'; });
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tab' + (active ? ' on' : ''); b.className += ' tab-more'; var lb = document.createElement('span'); lb.className = 'tab-l'; lb.textContent = active ? active.textContent : L(['More', 'المزيد']); b.appendChild(lb); b.insertAdjacentHTML('beforeend', chev);
    b.onclick = function () { A.picker(L(['More', 'المزيد']), more.map(function (t) { return { v: t.getAttribute('href'), t: t.textContent }; }), active ? active.getAttribute('href') : '', function (h) { location.hash = h; }); };
    row.appendChild(b);
  }
  function route() { return A.route ? A.route() : ''; }
  function tidy() {
    var app = A.$('#app'); if (!app) return;
    A.$$('select:not([data-ui])').forEach(function (s) { if (!s.closest('#printroot')) enhanceSelect(s); });
    A.$$('input[type=date]:not([data-ui])').forEach(enhanceDate);
    A.$$('input[type=time]:not([data-ui])').forEach(enhanceTime);
    A.$$('.card > p:not([data-ui])', app).forEach(function (p) { var st = p.getAttribute('style') || ''; if (st.indexOf('--t2') >= 0 && p.textContent.length > 52 && !p.classList.contains('keep') && !/[0-9٠-٩]/.test(p.textContent)) foldNote(p); });
    A.$$('.tabs', app).forEach(foldTabs);
    var r = route();
    if (r === 'parent/settings') { A.$$('.card[data-fold]', app).forEach(function (c, i) { foldCard(c, i === 0, true); }); }
    if (/^parent\/[^/]+\/log$/.test(r)) { A.$$('.card', app).filter(function (c) { return !c.classList.contains('pending'); }).forEach(function (c, i) { foldCard(c, i === 0, false); }); }
    if (/^parent\/[^/]+\/set$/.test(r)) { A.$$('.card[data-fold]', app).forEach(function (c) { foldCard(c, false, false); }); }
  }
  window.__tidyNow = tidy;
  var t = 0, sched = function () { if (t) return; t = setTimeout(function () { t = 0; try { tidy(); } catch (e) { console.error(e); } }, 0); };
  var start = function () { new MutationObserver(sched).observe(document.body, { childList: true, subtree: true }); sched(); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
