/* Runs before any style is drawn: the saved theme goes on the page first, so the app never opens in one theme and turns to the other. */
(function () {
  var t = null, d = document.documentElement;
  try { var s = JSON.parse(localStorage.getItem('miftah.v1') || 'null'); if (s && s.theme) t = s.theme; if (s && s.lang === 'ar') { d.lang = 'ar'; d.dir = 'rtl'; } } catch (e) { }
  if (!t) { try { var b = window.AndroidBridge; if (b && b.lastTheme) t = b.lastTheme(); } catch (e) { } }
  if (!t || t === 'auto') { var h = new Date().getHours(); t = h >= 6 && h < 18 ? 'light' : 'dark'; }
  d.dataset.theme = t;
})();
