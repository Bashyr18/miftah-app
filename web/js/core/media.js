/* The family's own media. A grown-up attaches a YouTube video, or a file from this phone, to a subject, a unit or a lesson, for the ages they choose.
   The engine then brings it to the child only at the right moment in their progress. Children cannot add, search or browse: there is no way out of the player.
   This is the only thing in the app that ever uses the internet. It is exposure, not evidence: watching is never counted as knowing. */
(function () {
  'use strict';
  var A = window.A, C = window.C, M = window.M, $ = A.$, esc = A.esc, L = A.L, T = A.T;
  var Media = window.Media = {};
  Media.list = function () { return A.S.media || (A.S.media = []); };
  Media.get = function (id) { return Media.list().filter(function (m) { return m.id === id; })[0] || null; };

  /* any common form of a YouTube link becomes its video id and start time; anything else is refused */
  Media.parse = function (url) {
    var s = String(url || '').trim(), m;
    if (/^[\w-]{11}$/.test(s)) return { kind: 'youtube', ref: s, start: 0 };
    try { m = new URL(/^https?:/i.test(s) ? s : 'https://' + s); } catch (e) { return null; }
    var h = m.hostname.replace(/^www\.|^m\.|^music\./, ''), id = null;
    if (h === 'youtu.be') id = m.pathname.split('/')[1];
    else if (h === 'youtube.com' || h === 'youtube-nocookie.com') {
      if (m.pathname === '/watch') id = m.searchParams.get('v');
      else { var q = m.pathname.match(/^\/(embed|shorts|live|v)\/([\w-]{11})/); if (q) id = q[2]; }
    }
    if (!id || !/^[\w-]{11}$/.test(id)) return null;
    var t = m.searchParams.get('t') || m.searchParams.get('start') || '0', sec = 0, x = String(t).match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/);
    if (x) sec = (+x[1] || 0) * 3600 + (+x[2] || 0) * 60 + (+x[3] || 0);
    return { kind: 'youtube', ref: id, start: sec };
  };
  Media.add = function (o) {
    var it = Object.assign({ id: 'v' + Date.now().toString(36), t: A.now().getTime(), when: 'shelf', ages: [0, 1, 2], attach: { type: 'room', id: 'math' } }, o);
    Media.list().push(it); A.saveNow(); return it;
  };
  Media.remove = function (id) { var m = Media.get(id); A.S.media = Media.list().filter(function (x) { return x.id !== id; }); if (m && m.kind !== 'youtube') A.N.call('mediaDelete', m.ref); A.saveNow(); };

  /* ---------- the engine's rule: right child, right stage, right moment ---------- */
  function roomOf(m) { var a = m.attach; if (a.type === 'room') return a.id; if (a.type === 'unit') return C.units[a.id] && C.units[a.id].room; var s = C.skill(a.id); return s && s.room; }
  Media.visible = function (m, pid) {
    var p = A.profile(pid), st = A.stage(p), a = m.attach;
    if (m.ages.indexOf(Math.min(st, 2)) < 0 && m.ages.indexOf(st) < 0 || (p.off || {})[roomOf(m)]) return false;
    /* a lesson's video waits until that lesson's door is open; a unit's until its first door is */
    if (a.type === 'skill') { var sk = C.skill(a.id); return !!sk && (M.met(a.id, pid) || C.open(sk, pid)); }
    if (a.type === 'unit') { var u = C.units[a.id]; return !!u && u.band <= st && u.skills.some(function (s) { return M.met(s.id, pid) || C.open(s, pid); }); }
    return true;
  };
  /* steps for a lesson, before or after its teaching */
  Media.steps = function (sk, when) {
    return Media.list().filter(function (m) { return m.when === when && (m.attach.type === 'skill' && m.attach.id === sk.id) && Media.visible(m); }).map(function (m) { return { k: 'watch', media: m.id, p: [m.title, m.title], silent: true, nextLabel: ['Next', 'التالي'] }; });
  };
  Media.shelf = function (room, pid) {
    return Media.list().filter(function (m) { return roomOf(m) === room && m.when === 'shelf' && Media.visible(m, pid); });
  };

  /* ---------- the player: no links out, nothing to browse ---------- */
  function frameUrl(m) {
    var id = /^[\w-]{11}$/.test(String(m.ref || '')) ? String(m.ref) : '';
    var o = location.origin && location.origin !== 'null' ? location.origin : 'https://appassets.androidplatform.net';
    var st = Math.max(0, Math.floor(+m.start || 0)), en = Math.max(0, Math.floor(+m.end || 0));
    return 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=0&enablejsapi=1&origin=' + encodeURIComponent(o) + (st ? '&start=' + st : '') + (en ? '&end=' + en : '');
  }
  Media.playerHtml = function (m) {
    if (m.kind === 'youtube') {
      if (navigator.onLine === false) return '<div class="vid-off">' + A.art('cloud', 90) + '<p>' + esc(T('This video needs the internet. Everything else keeps working without it.')) + '</p></div>';
      return '<div class="vid"><iframe src="' + esc(frameUrl(m)) + '" title="' + esc(m.title) + '" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-presentation"></iframe></div>';
    }
    var src = 'media/' + encodeURIComponent(m.ref);
    if (m.kind === 'image') return '<div class="vid img"><img src="' + src + '" alt=""></div>';
    if (m.kind === 'audio') return '<div class="vid-off">' + A.art('ear', 90) + '<audio controls src="' + src + '" controlslist="nodownload"></audio></div>';
    return '<div class="vid"><video controls playsinline controlslist="nodownload noremoteplayback" src="' + src + '"></video></div>';
  };
  /* watching is logged as exposure only, so a parent can see it, and a key never moves because of it */
  Media.watched = function (m, pid) {
    var d = A.D(pid); d.watched = d.watched || {}; d.watched[m.id] = A.now().getTime();
    if (m.attach.type === 'skill') M.log(m.attach.id, { k: 'exposure', ok: true }, pid); A.save();
  };
  window.I.watch = function (c) {
    var m = Media.get(c.step.media); if (!m) { c.done(); return; }
    c.el.innerHTML = Media.playerHtml(m) + (m.note ? '<p class="sc-t">' + esc(m.note) + '</p>' : '');
    Media.watched(m);
    c.done();
  };
  A.V.watch = function (args) {
    var m = Media.get(args[0]); if (!m || !A.P()) return { redirect: 'home' };
    var room = roomOf(m), r = C.rooms[room];
    Media.watched(m);
    return {
      bare: true, hue: r && r.hue,
      html: '<div class="pl h-' + (r ? r.hue : 'gold') + ' quiet"><div class="pl-top"><a class="backp" href="#/room/' + room + '">' + A.icon('back', 18) + '<span>' + esc(r ? L(r.name) : T('Today')) + '</span></a></div><div class="pl-head"><div class="pl-p">' + esc(m.title) + '</div></div><div class="pl-body"><div class="step">' + Media.playerHtml(m) + (m.note ? '<p class="sc-t">' + esc(m.note) + '</p>' : '') + '</div></div></div>'
    };
  };
  window.__native.onMediaPicked = function (ref, kind, name) { if (Media.onPicked) Media.onPicked(ref, kind, name); };
})();
