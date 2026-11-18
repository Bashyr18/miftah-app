/* Screenshots for the user guide (docs/guide), with the place of every feature the guide points at.
   Phone screens:   node tools/cdp.js tools/guide-shots.js build/guide            (dev server on 5191)
   Computer screens: CDP_ATTACH=1 CDP_ORIGIN=https://miftah.example/index.html GUIDE=desk node tools/cdp.js tools/guide-shots.js build/guide 9444
                     (with the Windows app started as MIFTAH_DEBUG_PORT=9444 MIFTAH_LINK_LOCAL=1 MIFTAH_DATA=<empty folder>)
   Writes <id>.png and marks.json: for each shot, its size and each mark's box as fractions of the screen. A demo family only. */
const fs = require('fs'), path = require('path');
module.exports = async (p) => {
  const desk = process.env.GUIDE === 'desk', VAR = process.env.VARIANT || 'light', only = process.env.ONLY ? process.env.ONLY.split(',') : null;
  const VL = VAR === 'ar' ? 'ar' : 'en', VT = VAR === 'dark' ? 'dark' : 'light', root = process.argv[3], out = path.join(root, VAR); fs.mkdirSync(out, { recursive: true });
  const marksFile = path.join(root, 'marks.json'), marks = fs.existsSync(marksFile) ? JSON.parse(fs.readFileSync(marksFile, 'utf8')) : {};
  const W = desk ? 1600 : 390, H = desk ? 1000 : 844, S = desk ? 1.25 : 2;
  const wait = ms => p.wait(ms);
  if (!desk) await p.open('#/home');
  for (let i = 0; i < 80 && !(await p.eval('!!(window.A && A.S && window.Print)').catch(() => false)); i++) await wait(200);
  await p.size(W, H, S);
  /* a demo family: three children at three stages, some work done, a week of minutes, sheets waiting */
  const family = (lang0, theme0) => { const lang = VL, theme = VT; return p.eval(`(function(){
    var y = 2026; A.now = function(){ return new Date(2026, 10, 12, 10, 0, 0) };
    A.S.profiles = [{ id:'u9', name:'Yusuf', by:y-9, bm:1, g:'m', hue:'teal', since:'2026-09-01' }, { id:'t13', name:'Maryam', by:y-13, bm:1, g:'f', hue:'rose', since:'2026-09-01' }, { id:'k5', name:'Amina', by:y-5, bm:3, g:'f', hue:'amber', since:'2026-09-01' }, { id:'k3', name:'Zayd', by:y-3, bm:2, g:'m', hue:'emerald', since:'2026-09-01' }, { id:'s16', name:'Khadijah', by:y-16, bm:1, g:'f', hue:'violet', since:'2026-09-01' }];
    A.S.data = {}; A.S.lang = '${lang}'; A.S.theme = '${theme}'; A.S.cur = 'u9'; A.S.motion = 'off'; A.S.pin = '';
    var n = 0; ['math','arabic','english','deen','science'].forEach(function(r){ C.rooms[r].units.forEach(function(u){ if (u.y <= 4) u.skills.forEach(function(s){ if (n++ < 70) M.forge(s.id, 'u9') }) }) });
    n = 0; ['math','arabic','english','deen','science','world','cs'].forEach(function(r){ if (C.rooms[r]) C.rooms[r].units.forEach(function(u){ if (u.y <= 8) u.skills.forEach(function(s){ if (n++ < 160) M.forge(s.id, 't13') }) }) });
    n = 0; ['math','arabic','english','deen'].forEach(function(r){ C.rooms[r].units.forEach(function(u){ if (u.y <= 0) u.skills.forEach(function(s){ if (n++ < 14) M.forge(s.id, 'k5') }) }) });
    [['u9',[22,31,0,18,27,35,12]],['t13',[48,55,20,0,62,40,25]],['k5',[9,12,0,8,10,14,6]]].forEach(function(x){ var d=A.D(x[0]); for (var i=0;i<7;i++){ var dt=new Date(2026,10,12-6+i); d.time[A.day(dt)] = x[1][i]*60000; } });
    ['practice-math','trace-ar','journal-nature'].forEach(function(k, i){ var r = Print.make(k, 'u9', 1000 + i); r.opts = {}; Print.keep(r, 'u9') });
    A.saveNow(); A.applyTheme(); return 1 })()`); };
  const unlock = () => p.eval(`(async function(){location.hash='#/parent';await new Promise(r=>setTimeout(r,600));var t=[...document.querySelectorAll('p')].map(e=>e.textContent).find(t=>/=\\s*[?؟]/.test(t));if(!t)return 0;var d=s=>+String(s).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c));var m=t.match(/([\\d٠-٩]+)\\s*\\+\\s*([\\d٠-٩]+)/);var v=d(m[1])+d(m[2]);var b=[...document.querySelectorAll('.numopt')].find(b=>+b.dataset.v===v);b&&b.click();await new Promise(r=>setTimeout(r,400));return 1})()`);
  const box = sels => p.eval(`JSON.stringify(${JSON.stringify(sels)}.map(function(s){var e=null;try{e=[...document.querySelectorAll(s)].find(function(x){var r=x.getBoundingClientRect();return r.width&&r.height&&r.bottom>0&&r.top<innerHeight})}catch(x){}if(!e)return null;var r=e.getBoundingClientRect();return [Math.max(0,r.left)/innerWidth,Math.max(0,r.top)/innerHeight,Math.min(innerWidth,r.right)/innerWidth,Math.min(innerHeight,r.bottom)/innerHeight].map(function(v){return Math.round(v*1000)/1000})}))`);
  const shot = async (id, sels) => {
    if (only && !only.includes(id)) return;
    await wait(500);
    const b = JSON.parse(await box(sels || []));
    const r = await p.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(out, id + '.png'), Buffer.from(r.result.data, 'base64'));
    marks[VAR + '/' + id] = { w: W, h: H, desk, marks: (sels || []).map((s, i) => ({ sel: s, box: b[i] })) };
    const lost = (sels || []).filter((s, i) => !b[i]); if (lost.length) console.log('  ' + id + ' could not find: ' + lost.join(' | '));
    console.log('shot', id);
  };
  const go = async (h, ms) => { await p.eval(`location.hash='#/${h}';1`); await wait(ms || 900); };
  const who = id => p.eval(`A.S.cur='${id}';A.saveNow();1`);
  const want = id => !only || only.some(o => o.startsWith(id));

  /* handwriting for the on-screen sheet shots: each answer written in a child's hand on its question, one of them wrong */
  const writeAnswers = (code) => p.eval(`(function(){
    var G={0:[[5,0],[1,3],[0,7],[1,11],[5,14],[9,11],[10,7],[9,3],[5,0]],1:[[2,3],[5,0],[5,14]],2:[[1,3],[3,.5],[7,.5],[9,3],[8,6],[1,14],[10,14]],3:[[1,1],[8,1],[4,6],[8,8],[9,11],[6,14],[1,13]],4:[[7,14],[7,0],[0,9],[10,9]],5:[[9,0],[2,0],[1,6],[6,5],[9,8],[8,12],[5,14],[1,13]],6:[[8,0],[3,3],[1,8],[2,12],[5,14],[8,12],[9,9],[6,7],[2,9]],7:[[0,0],[10,0],[4,14]],8:[[5,7],[1,4],[3,0],[7,0],[9,4],[5,7],[1,10],[3,14],[7,14],[9,10],[5,7]],9:[[8,5],[5,7],[2,5],[2,2],[5,0],[8,2],[8,7],[6,14]]};
    var sh=A.D('u9').sheets.filter(function(x){return x.id==='${code}'})[0],pg=document.querySelector('.ink-page .pp'),pr=document.querySelector('.ink-page').getBoundingClientRect(),k=1000/pr.width,strokes=[],seed=7;
    var rnd=function(){seed=(seed*9301+49297)%233280;return seed/233280-.5};
    [].slice.call(pg.querySelectorAll('.pq')).forEach(function(q,i){
      var r=q.getBoundingClientRect(),a=String(sh.q[i]?sh.q[i].a:'');if(i===2)a=String((+a||0)+1);
      var x=(r.left-pr.left)*k+(r.width*k)*.5,y=(r.top-pr.top)*k+(r.height*k)*.42,h=2.0;var bl=q.querySelector('.blank');if(bl){var br=bl.getBoundingClientRect();x=(br.left-pr.left)*k+br.width*k*.18;y=(br.top-pr.top)*k+(br.height*k-28)/2;}
      a.replace(/[^0-9]/g,'').split('').forEach(function(d,j){var gl=G[d];if(!gl)return;var pts=[];gl.forEach(function(pt){pts.push(Math.round(x+j*24+pt[0]*h+rnd()*1.4),Math.round(y+pt[1]*h+rnd()*1.4))});strokes.push({c:'b',w:2.6,p:pts})});
    });
    sh.ink={0:strokes};A.saveNow();dispatchEvent(new Event('resize'));return strokes.length})()`);
  const redMarks = (code) => p.eval(`(function(){var sh=A.D('u9').sheets.filter(function(x){return x.id==='${code}'})[0],pg=document.querySelector('.ink-page .pp'),pr=document.querySelector('.ink-page').getBoundingClientRect(),k=1000/pr.width,mk=[];
    [].slice.call(pg.querySelectorAll('.pq')).forEach(function(q,i){var r=q.getBoundingClientRect(),x=(r.left-pr.left)*k+r.width*k*.86,y=(r.top-pr.top)*k+r.height*k*.36;
      mk.push(i===2?{c:'r',w:3,p:[x,y,x+22,y+22,x+11,y+11,x+22,y,x,y+22].map(Math.round)}:{c:'r',w:3,p:[x,y+12,x+8,y+22,x+26,y-6].map(Math.round)})});
    sh.mk={0:mk};A.saveNow();dispatchEvent(new Event('resize'));return mk.length})()`);

  if (!desk) {
    /* ---------- the phone ---------- */
    await family('en', 'dark'); A_ = null;
    await p.eval(`A.S.profiles=[];A.saveNow();1`); await go('welcome', 1600);
    await shot('p-welcome', ['.wel-door', '.wel-lang', '#wel-go']);
    await p.eval(`(function(){var b=document.querySelector('#wel-go');A.reduced=function(){return true};b.click();return 1})()`); await wait(900);
    await p.eval(`document.querySelector('#f-n')&&(document.querySelector('#f-n').value='Yusuf');var b=[...document.querySelectorAll('[data-age]')].find(x=>x.dataset.age==='9');b&&b.click();1`);
    await shot('p-who', ['#f-n', '#f-age', '#f-go']);
    await p.open('#/home'); await family('en', 'light');
    await go('home', 1400); await shot('p-home', ['.hello', '.topbtns', '.home-a .hero', '.path', '.nav']);
    await p.eval(`window.scrollTo(0, 420);1`); await shot('p-home-path', ['.path', '.nav']);
    await family('en', 'dark'); await go('rooms', 1200); await shot('p-rooms', ['.labl', '.portal', '.nav']);
    await go('room/math', 1400); await shot('p-room', ['.ph h1', '.rmap-unit', '.rmap']);
    await family('en', 'light');
    await go('keys', 1200); await shot('p-keys', ['.kstats', '.lamp-rows', '.keys-grid']);
    /* 2.2: Thinking, a day walked (and walked again), a book followed in Arabic */
    if (want('p-think')) {
      const tk = await p.eval(`(function(){var o=null;C.rooms.think.units.forEach(function(u){u.skills.forEach(function(s){if(!o&&u.y<=4)o=s.id})});return o})()`);
      await go('lesson/' + tk, 1800); await shot('p-think', ['.pl-prompt', '.sc-arts, .rz-row, .pl-body .opt']);
    }
    if (want('p-again')) {
      await go('rooms', 500); await p.eval(`(function(){var pl=Plan.today();pl.stops.forEach(function(s){s.done=true});A.saveNow();return 1})()`);
      await go('home', 1500); await shot('p-again', ['.pathdone h2', '[data-a="go-again"]', '.dayprog, .path']);
      await family('en', 'light');
    }
    if (want('p-book')) {
      await unlock();
      await p.eval(`(function(){
        var ls=[]; for (var i=1;i<=23;i++) ls.push({n:i,title:'',words:[],grammar:[],sents:[]});
        var w=[[['بَيْتٌ','a house'],['مَسْجِدٌ','a mosque'],['بَابٌ','a door'],['كِتَابٌ','a book'],['قَلَمٌ','a pen']],[['مِفْتَاحٌ','a key'],['سَرِيرٌ','a bed'],['كُرْسِيٌّ','a chair']],[['وَلَدٌ','a boy'],['بِنْتٌ','a girl'],['طَالِبٌ','a student']],[['قَمَرٌ','a moon'],['نَجْمٌ','a star']]];
        w.forEach(function(x,i){ls[i].words=x});
        A.S.books=[{id:'bkdemo',kind:'madinah1',name:A.L(['Madinah Arabic, Book 1','دروس اللغة العربية، الكتاب الأول']),lessons:ls}];
        A.profile('u9').arBook='bkdemo'; A.Books.register(); A.saveNow(); return 1 })()`);
      await go('parent/books/bkdemo', 1400); await shot('p-book', ['.bk-grid', '[data-follow]']);
      await p.eval(`A.S.books=[];A.profile('u9').arBook=null;A.Books.register();A.saveNow();1`);
    }
    const les = JSON.parse(await p.eval(`JSON.stringify((function(){var o={};['math','arabic'].forEach(function(r){C.rooms[r].units.forEach(function(u){u.skills.forEach(function(s){if(!o[r]&&!M.met(s.id,'u9')&&C.open(s,'u9'))o[r]=s.id})})});return o})())`));
    await go('lesson/' + les.math, 1800); await shot('p-lesson', ['.pl-top', '.pl-prompt', '.pad', '.pl-foot']);
    await who('t13'); await go('home', 1200); await shot('p-teen', ['.th', '.tnext', '.tl', '.nav']);
    await go('study', 1200); await shot('p-study', ['.th', '.tw']);
    await who('u9'); await family('en', 'light'); await unlock();
    await shot('p-family', ['.fgrid > *:first-child', '.tl-grid', '.abar .dn']);
    await go('parent/u9/today', 1400); await shot('p-dash', ['.tabs', '.kpis', '.li-acts']);
    await go('parent/u9/make', 1200); await shot('p-make', ['.tabs', '.pk-list, .card']);
    await go('parent/u9/sheet/practice-math/1000', 1600); await shot('p-sheet', ['.pp-acts', '.ppv']);
    /* a sheet done on screen: sent, written, marked */
    const ic = await p.eval(`Print.toScreen(Print.make('practice-math','u9',4242),'u9').id`);
    await who('u9'); await go('home', 1300); await shot('p-ink-home', ['.ink-hc']);
    await go('sheet/' + ic, 1600); await writeAnswers(ic); await wait(500); await shot('p-ink', ['.ink-box', '.ink-tools', '#ink-fin']);
    await p.eval(`A.D('u9').sheets.filter(function(x){return x.id==='${ic}'})[0].sub=A.now().getTime();A.saveNow();1`);
    await unlock(); await go('parent/u9/mark/' + ic, 1600); await redMarks(ic); await wait(500); await shot('p-ink-mark', ['#mk-ink', '.ink-tools']);
    /* the sync sheet, as it looks on a phone with Miftāḥ for Windows on the same Wi-Fi */
    await p.eval(`window.AndroidBridge=window.AndroidBridge||{};AndroidBridge.lanInfo=function(){return '{"paired":false}'};AndroidBridge.lanFind=function(){setTimeout(function(){__native.onLanFound([{id:'a1',name:'Family PC',ip:'192.168.1.20',port:47731,pairing:true}])},300)};A.go('parent');setTimeout(function(){A.Sync.open()},400);1`); await wait(1200);
    await shot('p-sync', ['#sy-find', '.sy-h']);
    await p.eval(`document.querySelector('#sy-find').click();1`); await wait(1000);
    await p.eval(`document.querySelector('.sy-pc')&&document.querySelector('.sy-pc').click();1`); await wait(500);
    await p.eval(`var i=document.querySelector('#sy-code');if(i)i.value='482915';1`);
    await shot('p-pair', ['#sy-code', '#sy-pair']);
    /* every age, one app: the same home at each stage */
    for (const [i, kid] of [['0', 'k3'], ['1', 'k5'], ['2', 'u9'], ['3', 't13'], ['4', 's16']]) { await p.eval('A.closeSheet&&A.closeSheet();1'); await go('keys', 500); await who(kid); await go('home', 1600); await shot('p-age' + i, []); }
  } else {
    /* ---------- the computer ---------- */
    await family('en', 'light'); await go('home', 1500);
    await shot('d-home', ['#rail', '.rl-search', '.rl-me', '.sky', '.home-a .hero', '.path', '.dk-hx .dk-hx-c', '.dk-rooms', '.dk-q', '.dk-sum']);
    await p.eval(`Desk.palette();setTimeout(function(){var q=document.querySelector('#pal-q');q.value='time';q.dispatchEvent(new Event('input'))},150);1`); await wait(700);
    await shot('d-palette', ['.dk-pal-in', '.dk-pal-list']);
    await p.eval(`var q=document.querySelector('#pal-q');q&&q.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));1`); await wait(300);
    await p.eval(`Desk.keys();1`); await wait(500); await shot('d-keys', ['.sheet']);
    await p.eval(`A.closeSheet();1`);
    await go('room/math', 1500); await shot('d-room', ['.rmap', '.dk-units']);
    const les = JSON.parse(await p.eval(`JSON.stringify((function(){var o=null;C.rooms.english.units.forEach(function(u){u.skills.forEach(function(s){if(!o&&!M.met(s.id,'u9')&&C.open(s,'u9'))o=s.id})});return o})())`));
    await go('lesson/' + les, 1800);
    for (let k = 0; k < 6 && !(await p.eval(`document.querySelectorAll('.step .opt').length>1`)); k++) { await p.eval(`var n=document.querySelector('.pl-next');n&&n.click();1`); await wait(700); }
    await shot('d-lesson', ['.step', '.pl-foot']);
    await who('t13'); await go('home', 1300); await shot('d-teen', ['.tnext', '.dk-main', '.dk-side']);
    await family('en', 'light'); await unlock();
    await shot('d-family', ['.fgrid', '.dk-chart', '.dk-fam .card:last-child']);
    await go('parent/u9/today', 1500); await shot('d-dash', ['.tabs', '.kpis', '.dcols']);
    await go('desk/print', 1300);
    await p.eval(`['practice-math','trace-ar','cards-ar'].forEach(function(k){var b=document.querySelector('.dk-tile[data-k="'+k+'"]');if(b&&!b.classList.contains('on'))b.click()});1`); await wait(700);
    await shot('d-print', ['.dk-chips', '.dk-tile.on', '.dk-tray']);
    await go('desk/link', 1300);
    await p.eval(`var s=document.querySelector('[data-set=link]');if(s&&!s.checked){s.checked=true;s.dispatchEvent(new Event('change'))}1`); await wait(1500);
    await p.eval(`var b=document.querySelector('#lk-new');b&&b.click();1`); await wait(800);
    await shot('d-link', ['.dk-hero2', '[data-set=link]', '.dk-digits', '.dk-steps']);
    await go('desk/pc', 1300); await shot('d-pc', ['.dk-install', '.dk-sw', '.dk-zoom', '.dk-bk']);
    const dc = await p.eval(`Print.toScreen(Print.make('practice-math','u9',4243),'u9').id`);
    await p.eval(`A.S.cur='u9';A.saveNow();location.hash='#/sheet/${dc}';1`); await wait(1600); await writeAnswers(dc); await wait(500);
    await shot('d-ink', ['.ink-box', '.ink-tools', '#ink-fin']);
    await p.eval(`A.D('u9').sheets.filter(function(x){return x.id==='${dc}'})[0].sub=A.now().getTime();A.saveNow();1`);
    await unlock(); await go('parent/u9/mark/' + dc, 1700); await redMarks(dc); await wait(500); await shot('d-ink-mark', ['#mk-ink', '.mk-side']);
    await who('t13'); await go('lab/area', 2200); await shot('d-lab', ['.simstage iframe']);
    await who('u9');
    await go('parent', 900); await p.eval(`document.documentElement.classList.add('dropping');1`); await shot('d-drop', []);
    await p.eval(`document.documentElement.classList.remove('dropping');1`);
    await family('en', 'light'); await p.send('Emulation.clearDeviceMetricsOverride');
  }
  fs.writeFileSync(marksFile, JSON.stringify(marks, null, 1));
};
var A_;
