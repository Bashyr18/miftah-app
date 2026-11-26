/* The shared shape of a knowledge lesson: a few short pages, then questions that check them, then something to do in the real world.
   Row: C.les(id, title, art, pages, questions, mission?, opts?)   page: [en, ar]   question: [[en, ar], right, wrong, wrong...] */
(function () {
  'use strict';
  var C = window.C;
  function q(x) {
    var better = C.BETTER && C.BETTER[x[0][0]], opts = better ? [x[1]].concat(better) : x.slice(1);
    return { k: 'choice', p: x[0], cols: 1, err: 'understanding', shuffle: true, hint: ['Think back to what you just read.', 'تذكر ما قرأته للتو.'], o: opts.map(function (o, j) { return { t: o, ok: j === 0 }; }) };
  }
  /* a whole new lesson built from makers, as in C.deep */
  C.padQ = function (p, eq, a) { return { k: 'pad', p: p, eq: eq, a: a, err: 'understanding', ev: 'recall' }; };
  C.exprQ = function (p, eq, a) { return { k: 'expr', p: p, eq: eq, a: String(a), err: 'understanding', ev: 'recall' }; };
  C.topic = function (id, title, art, pages, makers, o) {
    var pool = makers.map(function (x) { return typeof x === 'function' ? x : function () { return q(x); }; });
    C.add(id, Object.assign({ title: title, art: art, soloN: Math.min(Math.max(pool.length, 3), 6), meet: pages.map(function (p) { return { k: 'say', p: p }; }), solo: function (r, i) { return pool[i % pool.length](r, i); }, review: function (r) { return r.pick(pool)(r, 0); } }, o || {}));
  };
  /* more teaching and more questions for a lesson that exists. A maker is a question row, or a function (r) => step. */
  C.deep = function (id, pages, makers) {
    var sk = C.skills[id]; if (!sk) throw new Error('deep: no such lesson ' + id);
    if (pages) { var m0 = sk.meet, add = pages.map(function (p) { return { k: 'say', p: p }; }); sk.meet = typeof m0 === 'function' ? function (r) { return [].concat(m0(r), add); } : (Array.isArray(m0) ? m0 : m0 ? [m0] : []).concat(add); }
    var old = sk.solo, pool = (makers || []).map(function (x) { return typeof x === 'function' ? x : function () { return q(x); }; });
    if (typeof old === 'function') pool.unshift(function (r, i) { var o = old(r, i); return Array.isArray(o) ? o[0] : o; });
    else if (Array.isArray(old)) old.forEach(function (s) { pool.unshift(function () { return s; }); });
    else if (old) pool.unshift(function () { return old; });
    if (!pool.length) return;
    sk.solo = function (r, i) { return pool[i % pool.length](r, i); };
    sk.soloN = Math.min(Math.max(pool.length, 3), 6);
    var rev0 = sk.review;
    sk.review = function (r) { var f = r.pick(pool.concat(rev0 ? [rev0] : [])); var o = f(r, 0); return Array.isArray(o) ? o[0] : o; };
  };
  C.les = function (id, title, art, pages, qs, mission, o) {
    o = o || {};
    var sup = o.sup; delete o.sup;
    if (sup) pages = [['This one is for doing with a parent beside you. Talk it through together.', 'هذا الدرس مع أحد والديك بجانبك. تحدثا فيه معًا.']].concat(pages);
    C.add(id, Object.assign({ sup: !!sup,
      title: title, art: art, soloN: Math.min(qs.length, 3),
      meet: pages.map(function (p, i) { return { k: 'say', p: p, art: i === 0 ? art : undefined }; }),
      solo: qs.map(q),
      make: mission ? [{ k: 'mission', art: art, t: mission }] : undefined,
      review: function (r) { return q(r.pick(qs)); }
    }, o));
  };
  /* a lesson that ends in real written work, checked honestly against what a good answer contains */
  C.study = function (id, title, art, pages, qs, prompt, check) {
    C.les(id, title, art, pages, qs, null, { make: [{ k: 'write', p: prompt, check: check }] });
  };
  C.yunit = function (room, id, title, band, y, strand) { var u = C.unit(room, id, title, band); u.y = y; if (strand) u.strand = true; return u; };
})();
