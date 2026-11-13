/* The year map. Every unit belongs to a year of childhood: Year 1 is about age five, Year 7 about age eleven. Rooms are sorted by it, so the road through each room
   runs in the right order, and a child can run up to a year ahead, but not race through years in a term. Runs after every curriculum file. */
(function () {
  'use strict';
  var C = window.C;
  var Y = {
    'a-letters': 1, 'a-vowels': 1, 'a-read': 2, 'a-gram': 5,
    'd-faith': 1, 'd-worship': 1, 'd-adab': 1, 'd-dua': 1, 'd-seerah': 2, 'd-hadith': 4, 'd-tawhid': 5,
    'm-count': 1, 'm-bonds': 1, 'm-think': 1, 'm-tens': 2, 'm-measure': 2, 'm-big': 4, 'm-times': 4, 'm-frac': 5, 'm-space': 6,
    'e-phon': 1, 'e-gram': 4,
    's-notice': 1, 's-method': 4, 's-systems': 5
  };
  var fresh = {};
  Object.keys(C.units).forEach(function (id) { var u = C.units[id]; if (u.y == null) u.y = Y[id] || (u.band === 2 ? 4 : 1); else fresh[id] = true; });
  C.order.forEach(function (r) { var R = C.rooms[r], idx = {}; R.units.forEach(function (u, i) { idx[u.id] = i; }); R.units.sort(function (a, b) { return a.y - b.y || idx[a.id] - idx[b.id]; }); });
  /* a later unit opens only when the road before it is walked: core units follow the core unit before them, a strand waits for the end of the year below it */
  C.order.forEach(function (r) {
    var core = C.rooms[r].units.filter(function (u) { return !u.strand && u.skills.length; });
    C.rooms[r].units.forEach(function (u) {
      if (!fresh[u.id] || !u.skills.length || u.skills[0].needs.length) return;
      var before = core.filter(function (c) { return u.strand ? c.y < u.y : c !== u && core.indexOf(c) < core.indexOf(u); }).pop();
      if (before) u.skills[0].needs = [before.skills[before.skills.length - 1].id];
    });
  });
  Object.keys(C.units).forEach(function (id) { var u = C.units[id]; u.skills.forEach(function (s) { s.y = u.y; }); });
  ['d-worship'].forEach(function (id) { if (C.units[id]) C.units[id].always = true; });
  Object.keys(C.units).forEach(function (id) { if (C.units[id].older) C.units[id].skills.forEach(function (s) { s.older = true; }); });
  C.YEARS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  C.yearName = function (y) { return ['Year ' + y, 'السنة ' + String(y).replace(/[0-9]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[+d]; })]; };
})();
