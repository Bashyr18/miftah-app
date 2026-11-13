/* Development only: not listed in index.html or shipped by the bundler's script order. Measures every screen for overflow, clipped text, small tap targets and uneven edges. */
(function () {
  function vis(e) { var r = e.getBoundingClientRect(); if (!r.width || !r.height) return false; var c = getComputedStyle(e); return c.visibility !== 'hidden' && c.display !== 'none' && +c.opacity !== 0; }
  function short(e) { return e.tagName.toLowerCase() + (e.className && e.className.baseVal === undefined ? '.' + String(e.className).trim().split(/\s+/).join('.') : ''); }
  function measure(route) {
    var w = innerWidth, out = [], app = document.getElementById('app') || document.body;
    if (document.documentElement.scrollWidth > w + 1) out.push('PAGE scrolls sideways ' + document.documentElement.scrollWidth);
    A.$$('*', app).forEach(function (e) {
      if (!vis(e) || e.closest('svg,canvas,iframe,.door,.sky,.hscroll,.ryears,.tabs,.pl-tr,.shelf-r,.ph-portal,.girih') || /^(HTML|BODY|STYLE|SCRIPT)$/.test(e.tagName)) return;
      var r = e.getBoundingClientRect(), own = Array.prototype.some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); }), c = getComputedStyle(e);
      if (own && (r.right > w + 1 || r.left < -1)) out.push('EDGE ' + short(e) + ' "' + e.textContent.trim().slice(0, 24) + '" ' + Math.round(r.left) + '-' + Math.round(r.right));
      if (own && c.overflow !== 'visible' && c.textOverflow !== 'ellipsis' && (e.scrollWidth > e.clientWidth + 2 || e.scrollHeight > e.clientHeight + 3) && !/scroll|auto/.test(c.overflowY)) out.push('CLIP ' + short(e) + ' "' + e.textContent.trim().slice(0, 24) + '"');
      if (e.matches('button,a[href],.btn') && !e.closest('.ayah,.ref,p') && (r.height < 34 || r.width < 34)) out.push('TAP ' + short(e) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    });
    A.$$('.wrap,.dwrap', app).forEach(function (wr) { var ls = {}; Array.prototype.forEach.call(wr.children, function (k) { if (!vis(k) || getComputedStyle(k).position === 'fixed') return; var x = Math.round(k.getBoundingClientRect().left); (ls[x] = ls[x] || []).push(short(k)); }); var keys = Object.keys(ls); if (keys.length > 1) out.push('LEFT ' + keys.map(function (x) { return x + ':' + ls[x][0]; }).join(' | ')); });
    /* boxes: a card or band cut off by a container that hides overflow, and two boxes that touch with no space between them */
    function boxy(e) { var c = getComputedStyle(e); return (parseFloat(c.borderTopWidth) > 0 || (c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'transparent') || c.backgroundImage !== 'none') && parseFloat(c.borderTopLeftRadius) >= 6; }
    A.$$('*', app).forEach(function (e) {
      if (!vis(e) || !boxy(e) || e.closest('svg,.sky,.hscroll,.girih,.door') || getComputedStyle(e).position === 'fixed') return;
      var r = e.getBoundingClientRect();
      for (var p = e.parentElement; p && p !== document.body; p = p.parentElement) {
        var c = getComputedStyle(p); if (c.overflowX === 'visible' && c.overflowY === 'visible') continue;
        var q = p.getBoundingClientRect(), h = c.overflowX !== 'visible' && !/auto|scroll/.test(c.overflowX), v = c.overflowY !== 'visible' && !/auto|scroll/.test(c.overflowY);
        if ((h && (r.left < q.left - 1 || r.right > q.right + 1)) || (v && (r.top < q.top - 1 || r.bottom > q.bottom + 1))) out.push('BOXCLIP ' + short(e) + ' in ' + short(p));
        break;
      }
      var n = e.nextElementSibling; while (n && !vis(n)) n = n.nextElementSibling;
      if (n && boxy(n) && getComputedStyle(n).position !== 'absolute' && getComputedStyle(e).position !== 'absolute') {
        var m = n.getBoundingClientRect(), gap = m.top - r.bottom, side = m.left - r.right;
        if (gap > -1 && gap < 4 && m.left < r.right && m.right > r.left && !e.matches('.li,.ti,.sr,.lamp-row,.pq,.row2') ) out.push('TOUCH ' + short(e) + ' / ' + short(n) + ' gap ' + Math.round(gap));
      }
    });
    A.$$('.ph,.th,header', app).forEach(function (h) {
      var n = h.nextElementSibling; if (!n || !vis(h) || !boxy(h)) return; var first = n; while (first && !boxy(first) && first.firstElementChild) first = first.firstElementChild;
      if (first && boxy(first)) { var g = first.getBoundingClientRect().top - h.getBoundingClientRect().bottom; if (g < 6 && g > -40 && first.getBoundingClientRect().left < h.getBoundingClientRect().right) out.push('TOUCH header ' + short(h) + ' / ' + short(first) + ' gap ' + Math.round(g)); }
    });
    var seen = {}; return out.filter(function (x) { if (seen[x]) return false; seen[x] = 1; return true; });
  }
  window.__audit = function (routes) {
    var res = {}, i = 0; window.__auditDone = false;
    return new Promise(function (ok) { (function step() {
      if (i >= routes.length) { window.__auditRes = res; window.__auditDone = true; ok(res); return; }
      var r = routes[i++]; location.hash = '#/' + r;
      setTimeout(function () { try { if (window.__tidyNow) window.__tidyNow(); var m = measure(r); if (m.length) res[r] = m; } catch (e) { res[r] = ['ERR ' + e.message]; } step(); }, 180);
    })(); });
  };
})();
