/* Development only: reads the words on every screen, with every folded section opened, and flags what a family should never see:
   web addresses, file names, code names, licence dumps, technical words, raw numbers in place of names.
     node tools/cdp.js tools/text-sweep.js build/sweep          (dev server on 5191)   LANG_UI=ar for Arabic
   Writes text.json (every screen's words) and flags.json. */
const fs = require('fs'), path = require('path');
module.exports = async (p) => {
  const out = process.argv[3]; fs.mkdirSync(out, { recursive: true });
  const lang = process.env.LANG_UI || 'en';
  await p.open('#/home'); await p.size(390, 844, 1);
  for (let i = 0; i < 80 && !(await p.eval('!!(window.A && A.S && A.saveNow && window.Print && window.C && window.M && window.Voice)').catch(() => false)); i++) await p.wait(200);
  await p.eval(`(function(){
    var y = 2026;
    A.S.profiles = [{ id:'u9', name:'Yusuf', by:y-9, bm:1, g:'m', hue:'teal', since:'2026-09-01' }, { id:'t13', name:'Maryam', by:y-13, bm:1, g:'f', hue:'rose', since:'2026-09-01' }, { id:'k5', name:'Amina', by:y-5, bm:3, g:'f', hue:'amber', since:'2026-09-01' }, { id:'s16', name:'Khadijah', by:y-16, bm:1, g:'f', hue:'violet', since:'2026-09-01' }];
    A.S.data = {}; A.S.lang = '${lang}'; A.S.cur = 'u9'; A.S.motion = 'off'; A.S.pin = '';
    var n = 0; ['math','arabic','english','deen','science'].forEach(function(r){ C.rooms[r].units.forEach(function(u){ if (u.band <= 2) u.skills.forEach(function(s){ if (n++ < 60) M.forge(s.id, 'u9') }) }) });
    ['practice-math','trace-ar'].forEach(function(k, i){ var r = Print.make(k, 'u9', 1000 + i); r.opts = {}; Print.keep(r, 'u9') });
    A.saveNow(); A.applyTheme(); return 1 })()`);
  const unlock = () => p.eval(`(async function(){if(A.grownOpen&&A.grownOpen())return 1;location.hash='#/parent';await new Promise(r=>setTimeout(r,600));var t=[...document.querySelectorAll('p')].map(e=>e.textContent).find(t=>/=\\s*[?؟]/.test(t));if(!t)return 0;var d=s=>+String(s).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c));var m=t.match(/([\\d٠-٩]+)\\s*\\+\\s*([\\d٠-٩]+)/);var v=d(m[1])+d(m[2]);var b=[...document.querySelectorAll('.numopt')].find(b=>+b.dataset.v===v);b&&b.click();await new Promise(r=>setTimeout(r,400));return 1})()`);
  const kids = ['u9', 't13', 'k5', 's16'], tabs = ['today', 'log', 'plan', 'make', 'hear', 'rooms', 'talk', 'record', 'set', 'check', 'hifz', 'mission', 'move', 'practice', 'read', 'review'];
  const R = [['home', 'u9'], ['rooms', 'u9'], ['room/math', 'u9'], ['room/arabic', 'u9'], ['room/quran', 'u9'], ['keys', 'u9'], ['quran', 'u9'], ['hifz', 'u9'], ['cards', 't13'], ['home', 't13'], ['rooms', 't13'], ['study', 't13'], ['lab', 't13'], ['home', 'k5'], ['home', 's16'],
    ['parent', 'u9', 1], ['parent/settings', 'u9', 1], ['parent/about', 'u9', 1], ['parent/add', 'u9', 1], ['parent/media', 'u9', 1], ['parent/voices', 'u9', 1]];
  kids.forEach(k => tabs.forEach(t => R.push(['parent/' + k + '/' + t, k, 1])));
  const text = {}, flags = {};
  const BAD = [
    [/https?:\/\/|www\./i, 'web address'], [/\.(jpe?g|png|webp|json|js|ogg|mp3|m4a|html|exe|apk)\b/i, 'file name'], [/\b[a-z]\d?\.[a-z0-9]+(\.[a-z0-9]+)?\b/, 'code name'],
    [/CC[ -]?BY|CC0|MIT licen[cs]e|GPL/i, 'licence'], [/\b(sha-?256|json|api|cache|debug|webview|localStorage|undefined|null|NaN|bridge|token|stack|exception|lorem)\b/i, 'technical'],
    [/[A-Za-z]+_[A-Za-z]+/, 'underscore'], [/\[object|\{\{|\}\}/, 'template'], [/\b(TODO|FIXME|XXX)\b/, 'unfinished'], [/Speaker:|Recorder:/, 'credit dump']];
  for (const [route, kid, grown] of R) {
    try {
      await p.eval(`A.closeSheet&&A.closeSheet();A.S.cur='${kid}';A.saveNow();1`);
      if (grown) await unlock();
      await p.eval(`(function(){ if (location.hash==='#/${route}') A.rerender(); else location.hash='#/${route}'; return 1 })()`); await p.wait(900);
      /* open every folded section, so its words are read too */
      await p.eval(`(function(){ document.querySelectorAll('details').forEach(function(d){ d.open = true; }); document.querySelectorAll('.acc.shut > h3').forEach(function(h){ h.click(); }); return 1 })()`); await p.wait(300);
      const t = await p.eval(`(document.querySelector('#app')||document.body).innerText`);
      text[route + ' (' + kid + ')'] = t;
      const hits = [];
      t.split('\n').forEach(line => { BAD.forEach(([re, why]) => { if (re.test(line) && !/^\s*$/.test(line)) hits.push(why + ': ' + line.trim().slice(0, 140)); }); });
      if (hits.length) flags[route + ' (' + kid + ')'] = [...new Set(hits)];
    } catch (e) { flags[route] = ['CRASH ' + String(e.message || e).slice(0, 200)]; }
  }
  fs.writeFileSync(path.join(out, 'text-' + lang + '.json'), JSON.stringify(text, null, 1));
  fs.writeFileSync(path.join(out, 'flags-' + lang + '.json'), JSON.stringify(flags, null, 1));
  console.log(Object.keys(text).length, 'screens;', Object.values(flags).reduce((n, x) => n + x.length, 0), 'flags');
};
