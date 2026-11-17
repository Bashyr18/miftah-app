/* Development only: every screen at every shape of device, photographed and measured.
     node tools/cdp.js tools/forms.js build/forms            (dev server on 5191)
   FORMS=flip,fold-p  ROUTES=home,keys  THEME=dark  LANG=ar   narrow the run.
   Writes <form>/<route>.jpg and report.json: for each form and route, the layout audit's findings (tools/audit.js)
   and any page errors. A demo family only: nothing here touches a real record. */
const fs = require('fs'), path = require('path');
const FORMS = {
  phone:   [360, 780, 3],      // a small phone
  flip:    [412, 915, 2.6],    // a Z Flip, open
  'fold-c':[360, 820, 2.6],    // a Z Fold's cover screen
  'fold-p':[673, 841, 2.6],    // a Z Fold's inner screen, upright: nearly square
  'fold-l':[841, 673, 2.6],    // the inner screen on its side
  'tab-p': [800, 1280, 2],     // a tablet, upright
  'tab-l': [1280, 800, 2],     // a tablet on its side
  'tab-xl':[1440, 960, 2]      // a big tablet on its side
};
module.exports = async (p) => {
  const out = process.argv[3], only = process.env.FORMS ? process.env.FORMS.split(',') : Object.keys(FORMS);
  const onlyR = process.env.ROUTES ? process.env.ROUTES.split(',') : null;
  const theme = process.env.THEME || 'light', lang = process.env.LANG2 || process.env.LANG_UI || (process.env.LANG === 'ar' ? 'ar' : 'en');
  const wait = ms => p.wait(ms);
  await p.open('#/home');
  for (let i = 0; i < 80 && !(await p.eval('!!(window.A && A.S && A.saveNow && window.Print && window.C && window.M && window.Voice)').catch(() => false)); i++) await wait(200);
  await p.eval(fs.readFileSync(path.join(__dirname, 'audit.js'), 'utf8') + ';1');
  await p.eval(`(function(){
    var y = 2026; A.now = function(){ return new Date(2026, 10, 12, 10, 0, 0) };
    A.S.profiles = [{ id:'u9', name:'Yusuf', by:y-9, bm:1, g:'m', hue:'teal', since:'2026-09-01' }, { id:'t13', name:'Maryam', by:y-13, bm:1, g:'f', hue:'rose', since:'2026-09-01' }, { id:'k5', name:'Amina', by:y-5, bm:3, g:'f', hue:'amber', since:'2026-09-01' }, { id:'k3', name:'Zayd', by:y-3, bm:2, g:'m', hue:'emerald', since:'2026-09-01' }, { id:'s16', name:'Khadijah', by:y-16, bm:1, g:'f', hue:'violet', since:'2026-09-01' }];
    A.S.data = {}; A.S.lang = '${lang}'; A.S.theme = '${theme}'; A.S.cur = 'u9'; A.S.motion = 'off'; A.S.pin = '';
    var n = 0; ['math','arabic','english','deen','science'].forEach(function(r){ C.rooms[r].units.forEach(function(u){ if (u.y <= 4) u.skills.forEach(function(s){ if (n++ < 70) M.forge(s.id, 'u9') }) }) });
    n = 0; ['math','arabic','english','deen','science','world'].forEach(function(r){ if (C.rooms[r]) C.rooms[r].units.forEach(function(u){ if (u.y <= 8) u.skills.forEach(function(s){ if (n++ < 160) M.forge(s.id, 't13') }) }) });
    n = 0; ['math','arabic','english','deen'].forEach(function(r){ C.rooms[r].units.forEach(function(u){ if (u.y <= 0) u.skills.forEach(function(s){ if (n++ < 14) M.forge(s.id, 'k5') }) }) });
    [['u9',[22,31,0,18,27,35,12]],['t13',[48,55,20,0,62,40,25]],['k5',[9,12,0,8,10,14,6]]].forEach(function(x){ var d=A.D(x[0]); for (var i=0;i<7;i++){ var dt=new Date(2026,10,12-6+i); d.time[A.day(dt)] = x[1][i]*60000; } });
    ['practice-math','trace-ar','journal-nature'].forEach(function(k, i){ var r = Print.make(k, 'u9', 1000 + i); r.opts = {}; Print.keep(r, 'u9') });
    A.saveNow(); A.applyTheme(); return 1 })()`);
  const les = JSON.parse(await p.eval(`JSON.stringify((function(){var o={};['math','arabic','quran'].forEach(function(r){C.rooms[r].units.forEach(function(u){u.skills.forEach(function(s){if(!o[r]&&!M.met(s.id,'u9')&&C.open(s,'u9'))o[r]=s.id})})});return o})())`));
  const unlock = () => p.eval(`(async function(){if(A.grownOpen&&A.grownOpen())return 1;location.hash='#/parent';await new Promise(r=>setTimeout(r,600));var t=[...document.querySelectorAll('p')].map(e=>e.textContent).find(t=>/=\\s*[?؟]/.test(t));if(!t)return 0;var d=s=>+String(s).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c));var m=t.match(/([\\d٠-٩]+)\\s*\\+\\s*([\\d٠-٩]+)/);var v=d(m[1])+d(m[2]);var b=[...document.querySelectorAll('.numopt')].find(b=>+b.dataset.v===v);b&&b.click();await new Promise(r=>setTimeout(r,400));return 1})()`);
  /* [name, who, route]: the learner screens for three ages, then the grown-up screens */
  const R = [
    ['welcome', null, 'welcome'], ['who', null, 'who'],
    ['home-k3', 'k3', 'home'], ['home-k5', 'k5', 'home'], ['home-u9', 'u9', 'home'], ['home-t13', 't13', 'home'], ['home-s16', 's16', 'home'],
    ['rooms', 'u9', 'rooms'], ['room-math', 'u9', 'room/math'], ['room-quran', 'u9', 'room/quran'], ['keys', 'u9', 'keys'],
    ['lesson-math', 'u9', 'lesson/' + les.math], ['lesson-ar', 'u9', 'lesson/' + les.arabic],
    ['quran', 'u9', 'quran'], ['surah', 'u9', 'surah/1'], ['hifz', 'u9', 'hifz'],
    ['study-t13', 't13', 'study'], ['rooms-t13', 't13', 'rooms'], ['lab', 't13', 'lab'], ['cards', 't13', 'cards'],
    ['nursery-k3', 'k3', 'nursery'],
    ['parent', 'u9', 'parent', 1], ['p-today', 'u9', 'parent/u9/today', 1], ['p-log', 'u9', 'parent/u9/log', 1], ['p-plan', 'u9', 'parent/u9/plan', 1],
    ['p-make', 'u9', 'parent/u9/make', 1], ['p-hear', 'u9', 'parent/u9/hear', 1], ['p-rooms', 'u9', 'parent/u9/rooms', 1], ['p-talk', 'u9', 'parent/u9/talk', 1],
    ['p-record', 'u9', 'parent/u9/record', 1], ['p-set', 'u9', 'parent/u9/set', 1], ['p-sheet', 'u9', 'parent/u9/sheet/practice-math/1000', 1],
    ['p-settings', 'u9', 'parent/settings', 1], ['p-add', 'u9', 'parent/add', 1], ['p-media', 'u9', 'parent/media', 1], ['p-about', 'u9', 'parent/about', 1]
  ].filter(r => !onlyR || onlyR.includes(r[0]));
  const rep = fs.existsSync(path.join(out, 'report.json')) ? JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8')) : {};
  for (const f of only) {
    const [w, h, s] = FORMS[f]; await p.size(w, h, Math.min(s, 2)); fs.mkdirSync(path.join(out, f), { recursive: true });
    rep[f] = rep[f] || {};
    for (const [name, kid, route, grown] of R) {
      try {
        await p.eval('A.closeSheet&&A.closeSheet();1');
        if (kid) await p.eval(`A.S.cur='${kid}';A.saveNow();1`);
        if (grown) await unlock();
        const e0 = p.errs.length;
        await p.eval(`(function(){ if (location.hash==='#/${route}') A.rerender(); else location.hash='#/${route}'; return 1 })()`); await wait(1300);
        const found = JSON.parse(await p.eval(`JSON.stringify(window.__measure?__measure():[])`).catch(() => '[]'));
        const sw = await p.eval('document.documentElement.scrollWidth');
        rep[f][name] = { route, found, sideways: sw > innerWidthOf(w) ? sw : 0, errors: p.errs.slice(e0) };
        const r = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
        fs.writeFileSync(path.join(out, f, name + '.jpg'), Buffer.from(r.result.data, 'base64'));
      } catch (e) { rep[f][name] = { route, crash: String(e.message || e).slice(0, 300) }; }
    }
    console.log(f, Object.values(rep[f]).reduce((n, x) => n + (x.found ? x.found.length : 0) + (x.crash ? 1 : 0) + (x.errors && x.errors.length || 0), 0), 'findings');
  }
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(rep, null, 1));
  function innerWidthOf(w) { return w + 1; }
};
