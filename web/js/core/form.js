/* The shape of the screen: phone, foldable or tablet, and how a foldable is being held.
   Sets on <html>:
   - f-compact (under 600 px wide), f-medium (600 to 839), f-expanded (840 and over): the layouts in css/08-large.css follow these;
   - f-land when wider than tall, f-square when nearly square (a foldable's inner screen);
   - fold-book when a foldable is half open like a book (the hinge runs top to bottom), fold-table when half open like a laptop
     on a table (the hinge runs side to side), with --hinge-a, --hinge-b (where the hinge starts and ends, in px) for the layouts.
   Where the hinge is comes from the Android app (window extensions, through __native.onScreen), or in a browser from the
   Viewport Segments API. On an Android tablet the page is laid out a little smaller than the screen and shown larger
   (the viewport), so everything a child touches grows together: text, pictures and the places to tap.
   When the shape class changes (turning, folding, unfolding), a screen that builds its layout in script is drawn again,
   keeping its place; a lesson keeps going, its instruments resize themselves. */
(function () {
  'use strict';
  var A = window.A;
  var F = A.form = { w: 0, h: 0, fold: null, scale: 1, native: null };
  var root = document.documentElement, meta = document.querySelector('meta[name=viewport]'), meta0 = meta ? meta.getAttribute('content') : '';
  var KEEP = { lesson: 1, stop: 1, exam: 1, paper: 1, sheet: 1, write: 1, challenge: 1, marking: 1, flash: 1, watch: 1, welcome: 1, lab: 1, hifz: 1, surah: 1, nursery: 1, place: 1, rest: 1, cards: 1 };
  var last = '';

  /* how much larger a tablet shows things: none on a phone or a foldable's cover screen, up to a third more on a big tablet */
  function scaleFor(w, h) {
    var s = Math.min(w, h);
    if (s < 600 || window.MIFTAH_DESKTOP) return 1;
    return Math.max(1, Math.min(1.3, Math.round(s / 640 * 20) / 20));
  }
  function apply() {
    var w = innerWidth, h = innerHeight, cls = [];
    cls.push(w < 600 ? 'f-compact' : w < 840 ? 'f-medium' : 'f-expanded');
    if (w > h * 1.1) cls.push('f-land');
    if (w >= 560 && Math.abs(w / h - 1) < .3) cls.push('f-square');
    var f = F.fold;
    if (f && f.half) {
      if (f.vertical) { cls.push('fold-book'); root.style.setProperty('--hinge-a', f.a + 'px'); root.style.setProperty('--hinge-b', f.b + 'px'); }
      else { cls.push('fold-table'); root.style.setProperty('--hinge-a', f.a + 'px'); root.style.setProperty('--hinge-b', f.b + 'px'); }
    }
    var all = ['f-compact', 'f-medium', 'f-expanded', 'f-land', 'f-square', 'fold-book', 'fold-table'];
    all.forEach(function (c) { root.classList.toggle(c, cls.indexOf(c) >= 0); });
    var key = cls.join(' ');
    if (last && key !== last) changed();
    last = key; F.w = w; F.h = h;
  }
  function changed() {
    var v = document.body && document.body.dataset.view;
    if (!v || KEEP[v] || !A.rerender) return;
    clearTimeout(changed.t); changed.t = setTimeout(function () { A.rerender(); }, 60);
  }

  /* ---------- the Android app tells the true size of the screen in dp, and where a hinge is ---------- */
  window.__native = window.__native || {};
  window.__native.onScreen = function (w, h, fold) {
    F.native = { w: w, h: h };
    var f = null;
    try { f = typeof fold === 'string' ? JSON.parse(fold) : fold; } catch (e) { f = null; }
    var s = scaleFor(w, h);
    /* the hinge arrives in dp of the screen; the page is laid out in its own px, smaller by the scale */
    F.fold = f && f.state === 2 ? { half: true, vertical: !!f.vertical, a: Math.round((f.vertical ? f.l : f.t) / s), b: Math.round((f.vertical ? f.r : f.b) / s) } : null;
    /* written again whenever the size changes, not only the scale: turning a foldable keeps its scale but swaps its width */
    var want = s === 1 ? meta0 : 'width=' + Math.round(w / s) + ', initial-scale=' + s + ', minimum-scale=' + s + ', viewport-fit=cover, interactive-widget=resizes-content';
    F.scale = s;
    if (meta && meta.getAttribute('content') !== want) meta.setAttribute('content', want);
    root.classList.toggle('f-scaled', s > 1);
    requestAnimationFrame(apply);
  };

  /* ---------- in a browser on a dual-screen or foldable device: the Viewport Segments API ---------- */
  function segments() {
    if (F.native) return;
    var seg = window.viewport && window.viewport.segments;
    if (seg && seg.length === 2) {
      var a = seg[0], b = seg[1], vertical = Math.abs(a.y - b.y) < 2;
      F.fold = vertical ? { half: true, vertical: true, a: Math.round(a.x + a.width), b: Math.round(b.x) } : { half: true, vertical: false, a: Math.round(a.y + a.height), b: Math.round(b.y) };
    } else F.fold = null;
  }

  addEventListener('resize', function () { segments(); apply(); });
  segments(); apply();
})();
