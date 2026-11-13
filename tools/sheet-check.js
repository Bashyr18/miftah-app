/* Development only: every printable, laid out at true A4 size and measured, so a sheet can never print with text bleeding
   into the next question, a working area squeezed to a strip, or anything running off the paper.
     node tools/cdp.js tools/sheet-check.js build/sheets              (dev server on 5191)
     CDP_ATTACH=1 node tools/cdp.js tools/sheet-check.js build/sheets 9444   (the Windows app, MIFTAH_DEBUG_PORT=9444, scratch MIFTAH_DATA)
   SHEET_SEEDS sets how many versions of each sheet (default 25). Exits 1 if anything is found.
   What it measures, on every page of every sheet, for each child, in English and Arabic:
     OFF     anything drawn outside the page's printable area (the 11 mm margin)
     BLEED   a question's own content running out of its cell into the next one
     OVERLAP the working area starting before the question above it ends
     SQUEEZE a maths working area shorter than 9 mm (no room to work)
     SLOT    an answer box narrower than 20 mm or lower than 8 mm, or wider than its column */
module.exports = async (p) => {
  const SEEDS = +(process.env.SHEET_SEEDS || 25);
  for (let i = 0; i < 80 && !(await p.eval('!!(window.A&&A.S&&window.Print&&window.C)').catch(() => false)); i++) await p.wait(200);
  await p.size(1400, 900, 1);
  const res = await p.eval(`(async function(){
    var MM = 96 / 25.4, out = [], made = 0, keep = JSON.stringify(A.S), lang0 = A.S.lang, dir0 = document.documentElement.dir;
    var y = A.now().getFullYear();
    /* three learners that cover every stage's sheets: what they know decides which questions appear */
    A.S.profiles = [{ id: 'c6', name: 'Amina', by: y - 6, bm: 1, g: 'f' }, { id: 'c10', name: 'Yusuf Abdullah', by: y - 10, bm: 1, g: 'm' }, { id: 'c17', name: 'Khadijah', by: y - 17, bm: 1, g: 'f' }];
    A.S.data = {};
    var top = { c6: 1, c10: 5, c17: 13 };
    Object.keys(top).forEach(function (pid) { Object.keys(C.rooms).forEach(function (r) { (C.rooms[r].units || []).forEach(function (u) { if (u.y <= top[pid]) u.skills.forEach(function (s) { try { M.forge(s.id, pid); } catch (e) { } }); }); }); });
    var host = document.createElement('div'); host.style.cssText = 'position:absolute;left:-30000px;top:0;width:220mm';
    document.body.appendChild(host);
    function r(e) { return e.getBoundingClientRect(); }
    function own(e) { return Array.prototype.some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); }) || /^(IMG|svg|B|SPAN|I)$/.test(e.tagName); }
    for (var li = 0; li < 2; li++) {
      A.S.lang = li ? 'ar' : 'en'; document.documentElement.dir = li ? 'rtl' : 'ltr';
      for (var pid in top) {
        var kinds = Print.available(pid);
        for (var ki = 0; ki < kinds.length; ki++) {
          var k = kinds[ki];
          for (var s = 0; s < ${SEEDS}; s++) {
            var seed = 7000 + s * 131, res; try { res = Print.make(k.id, pid, seed); } catch (e) { out.push(['ERROR', A.S.lang, pid, k.id, seed, String(e.message).slice(0, 80)]); continue; }
            if (!res) break;
            made++;
            host.innerHTML = '<style>' + Print.CSS.replace('@page{size:A4;margin:11mm}', '') + '#chk .pp{width:210mm;height:297mm;padding:11mm;margin:0 0 4mm}</style><div id="chk">' + res.html + '</div>';
            await Promise.all(Array.prototype.map.call(host.querySelectorAll('img'), function (im) { return im.decode ? im.decode().catch(function () { }) : 0; }));
            var tag = [A.S.lang, pid, k.id, seed];
            host.querySelectorAll('.pp').forEach(function (pg, pn) {
              var P = r(pg), L = P.left + 11 * MM - 1, R = P.right - 11 * MM + 1, T = P.top + 11 * MM - 1, B = P.bottom - 11 * MM + 1;
              pg.querySelectorAll('*').forEach(function (e) {
                if (!own(e) || e.closest('svg') && e.tagName !== 'svg') return; var q = r(e); if (!q.width || !q.height) return;
                if (q.left < L || q.right > R || q.top < T || q.bottom > B) out.push(['OFF'].concat(tag, pn + 1, e.tagName + '.' + (e.className.baseVal != null ? '' : e.className) + ' "' + (e.textContent || '').trim().slice(0, 30) + '"'));
              });
              pg.querySelectorAll('.pq').forEach(function (c, i) {
                var C0 = r(c), body = c.querySelector('.pq-b'), w = c.querySelector('.pq-w'), Q = r(body), n = i + 1;
                if (Q.bottom > C0.bottom + 1 || body.scrollHeight > body.clientHeight + 2) out.push(['BLEED'].concat(tag, pn + 1, 'q' + n + ' ' + body.textContent.trim().slice(0, 30)));
                if (w) { var W = r(w); if (W.top < Q.bottom - 1) out.push(['OVERLAP'].concat(tag, pn + 1, 'q' + n)); if (w.classList.contains('sq') && W.height < 9 * MM) out.push(['SQUEEZE'].concat(tag, pn + 1, 'q' + n + ' ' + (W.height / MM).toFixed(1) + 'mm')); }
                c.querySelectorAll('.blank').forEach(function (b) { var X = r(b); if (X.width < 20 * MM || X.height < 8 * MM || X.right > C0.right + 1 || X.left < C0.left - 1) out.push(['SLOT'].concat(tag, pn + 1, 'q' + n + ' ' + (X.width / MM).toFixed(0) + 'x' + (X.height / MM).toFixed(0) + 'mm')); });
              });
            });
          }
        }
      }
    }
    host.remove(); A.S = JSON.parse(keep); A.S.lang = lang0; document.documentElement.dir = dir0;
    return { made: made, out: out };
  })()`);
  const by = {}; res.out.forEach(x => { const key = x[0] + ' ' + x[3]; (by[key] = by[key] || []).push(x.slice(1).join(' ')); });
  console.log(res.made + ' sheets measured, ' + res.out.length + ' problems');
  Object.keys(by).sort().forEach(k => console.log(k + ' (' + by[k].length + ')\n    ' + by[k].slice(0, 4).join('\n    ')));
  await p.send('Emulation.clearDeviceMetricsOverride');
  if (p.errs.length) console.log('PAGE ERRORS ' + p.errs.slice(0, 3).join(' | '));
  if (res.out.length) process.exitCode = 1;
};
