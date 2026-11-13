/* Start-up and the small config the native side reads for the widget and the reminder. */
(function () {
  'use strict';
  var A = window.A, syncT = null;
  A.N.sync = function () {
    if (!A.N.has()) return;
    clearTimeout(syncT);
    syncT = setTimeout(function () {
      var p = A.P(), next = '', lit = 0, total = 0;
      if (p) {
        var pl = window.Plan.today(); total = pl.stops.length; lit = pl.stops.filter(function (s) { return s.done; }).length;
        var i = window.Plan.nextStop(); if (i >= 0) { var s = pl.stops[i]; next = s.t === 'lesson' ? A.L(window.C.skill(s.s).title) : s.t === 'hifz' ? A.T('Time with the Qurʾān') : s.t === 'review' ? A.T('Polish your keys') : s.t === 'mission' ? A.T('Go and do it') : s.t === 'move' ? A.T('Move your body') : s.t === 'check' ? A.T('Show what you know') : A.L(window.C.nursery[s.id].title); }
      }
      A.N.call('sync', JSON.stringify({ lang: A.S.lang, name: p ? p.name : '', next: next, done: lit, total: total, day: A.day(), remind: A.S.remind }));
    }, 400);
  };
  /* minutes of real use: only while a lesson, a stop or the Qurʾān is on screen and the app is in front */
  setInterval(function () {
    if (document.hidden || !A.P() || !/^(lesson|stop|hifz|nursery|watch|place)/.test(A.route())) return;
    var d = A.D(), k = A.day(); d.screen[k] = (d.screen[k] || 0) + 15000; A.save();
  }, 15000);
  /* the band under the clock appears only once something has scrolled beneath it */
  addEventListener('scroll', function () { document.body.classList.toggle('scrolled', (window.scrollY || 0) > 6); }, { passive: true });
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.nav a,.backp')) Fx.tap(); });
  Voice.refreshVoices();
  A.boot();
})();
