/* A sheet done on screen, end to end, with real pointer input:
   the parent sends it, it appears on the child's home, the child writes and finishes, the parent sees the writing,
   marks it in red and question by question, the evidence is logged, and the child sees the marks.
     node tools/cdp.js tools/ink-test.js build/ink            (dev server on 5191; W=1440 H=900 for a computer screen) */
module.exports = async (p) => {
  const W = +(process.env.W || 390), H = +(process.env.H || 844);
  const check = (name, ok) => { console.log((ok ? 'PASS ' : 'FAIL ') + name); if (!ok) process.exitCode = 1; };
  const touch = W < 700;
  await p.size(W, H, W < 700 ? 2 : 1); await p.open('#/home');
  if (touch) await p.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
  async function stroke(selector, column, row) {
    const hitTest = `(() => {
      const canvas = document.querySelector(${JSON.stringify(selector)}), r = canvas.getBoundingClientRect();
      const left = Math.max(0, r.left), top = Math.max(0, r.top);
      const right = Math.min(innerWidth, r.right), bottom = Math.min(innerHeight, r.bottom);
      const x = left + (right - left) * ${column}, y = top + (bottom - top) * ${row};
      const hit = document.elementFromPoint(x, y);
      const fits = right > left && bottom > top && x + 30 < right && y + 18 < bottom;
      return {x,y,hit: fits && hit === canvas && document.elementFromPoint(x + 30, y + 18) === canvas,
        blocker: hit && hit.outerHTML.split('>')[0],
        rect: r.toJSON(), viewport: [innerWidth, innerHeight]};
    })()`;
    let start;
    for (let i = 0; i < 20; i++) {
      start = await p.eval(hitTest);
      if (start.hit) break;
      await p.wait(150);
    }
    if (!start.hit) throw new Error('The writing surface is not hit-testable: ' + JSON.stringify(start));
    const point = (i) => ({ x: start.x + i * 5, y: start.y + i * 3 });
    if (touch) {
      await p.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(0)] });
      for (let i = 1; i <= 6; i++) await p.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point(i)] });
      await p.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } else {
      await p.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point(0), button: 'left', clickCount: 1 });
      for (let i = 1; i <= 6; i++) await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point(i), buttons: 1 });
      await p.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point(6), button: 'left', clickCount: 1 });
    }
  }
  await p.eval(`(function(){var y=2026;A.now=function(){return new Date(2026,10,12,10,0,0)};A.S.profiles=[{id:'u9',name:'Yusuf',by:y-9,bm:1,g:'m',hue:'teal',since:'2026-09-01'}];A.S.data={};A.S.cur='u9';A.S.pin='';A.S.schoolBreak=null;A.S.motion='off';A.S.lang='en';A.S.theme='light';
    var n=0;C.rooms.math.units.forEach(function(u){if(u.y<=4)u.skills.forEach(function(s){if(n++<40)M.forge(s.id,'u9')})});A.saveNow();return 1})()`);
  /* the parent sends a practice sheet on screen */
  const code = await p.eval(`(function(){var r=Print.make('practice-math','u9',4242);var sh=Print.toScreen(r,'u9');A.rerender();return sh.id})()`);
  check('a practice sheet can go on screen', !!code && await p.eval(`Print.canScreen('practice-math') && !Print.canScreen('bingo')`));
  check('it is not yet waiting for the parent', !(await p.eval(`(A.D('u9').sheets||[]).some(Print.waiting)`)));
  await p.go('home', 1400);
  check('the child\'s home shows it', await p.eval(`!!document.querySelector('.ink-hc[href="#/sheet/${code}"]')`));
  await p.shot('1-home');
  await p.go('sheet/' + code, 1500);
  check('the sheet opens with a page to write on', await p.eval(`!!document.querySelector('.ink-cv') && document.querySelector('.ink-cv').width > 100`));
  for (let k = 0; k < 3; k++) await stroke('.ink-cv', .3 + k * .1, .3 + k * .05);
  await p.wait(300);
  check('three multi-point strokes are saved on page 1', await p.eval(`(() => { const strokes = A.D('u9').sheets.find(x=>x.id==='${code}').ink[0] || []; return strokes.length === 3 && strokes.every(s=>s.p.length>=6); })()`));
  await p.eval(`document.querySelector('[data-t=undo]').click();1`);
  check('undo takes the last one away', await p.eval(`A.D('u9').sheets.filter(x=>x.id==='${code}')[0].ink[0].length`) === 2);
  await p.shot('2-writing');
  await p.eval(`document.querySelector('#ink-fin').click();1`); await p.wait(500);
  await p.eval(`document.querySelector('#ink-yes').click();1`); await p.wait(900);
  check('finished: it is locked and now waits for the parent', await p.eval(`(function(){var s=A.D('u9').sheets.filter(x=>x.id==='${code}')[0];return !!s.sub&&Print.waiting(s)&&!Print.forChild(s)})()`));
  check('the child\'s home no longer asks for it', !(await p.eval(`!!document.querySelector('.ink-hc[href="#/sheet/${code}"]')`)));
  /* the parent */
  await p.eval(`(async function(){location.hash='#/parent';await new Promise(r=>setTimeout(r,600));var t=[...document.querySelectorAll('p')].map(e=>e.textContent).find(t=>/=\\s*\\?/.test(t));var m=t.match(/(\\d+)\\s*\\+\\s*(\\d+)/);var v=+m[1]+ +m[2];[...document.querySelectorAll('.numopt')].find(b=>+b.dataset.v===v).click();await new Promise(r=>setTimeout(r,300));return 1})()`);
  await p.go('parent/u9/today', 1200);
  check('the parent\'s Today lists it as done on screen, to mark', await p.eval(`[...document.querySelectorAll('.pending .li')].some(e=>/on screen/i.test(e.textContent))`));
  await p.go('parent/u9/mark/' + code, 1600);
  check('the marking page shows their writing', await p.eval(`!!document.querySelector('#mk-ink .ink-cv')`));
  await stroke('#mk-ink .ink-cv', .2, .2);
  await p.wait(200);
  check('the parent\'s red mark is kept apart from the child\'s writing', await p.eval(`(function(){var s=A.D('u9').sheets.filter(x=>x.id==='${code}')[0];return s.mk[0].length===1&&s.mk[0][0].c==='r'&&s.mk[0][0].p.length>=6&&s.ink[0].length===2})()`));
  await p.shot('3-marking');
  const before = await p.eval(`A.D('u9').led.length`);
  await p.eval(`document.querySelector('.mk').click();document.querySelector('#mk-go').click();1`); await p.wait(600);
  const s = JSON.parse(await p.eval(`JSON.stringify(A.D('u9').sheets.filter(x=>x.id==='${code}')[0])`));
  check('marking logs evidence for every question, by the parent', (await p.eval(`A.D('u9').led.length`)) - before === s.q.length && await p.eval(`A.D('u9').led.slice(-1)[0].by==='parent'`));
  check('one wrong, the rest right', s.marked && s.right === s.q.length - 1);
  /* the merge keeps writing and respects another go */
  check('joining two devices keeps the writing and the marks', await p.eval(`(function(){var mine=A.D('u9'),other=JSON.parse(JSON.stringify(mine));other.sheets.forEach(function(x){if(x.id==='${code}'){delete x.ink;delete x.mk}});var r=A.Sync.merge(A.S,{profiles:A.S.profiles,data:{u9:other}},true);var x=r.S.data.u9.sheets.filter(function(y){return y.id==='${code}'})[0];return x.ink[0].length===2&&x.mk[0].length===1&&x.marked})()`));
  /* the child sees the marks */
  await p.go('home', 900);
  check('the child\'s home shows it marked', await p.eval(`!!document.querySelector('.ink-hc.done')`));
  await p.go('sheet/' + code, 1400);
  check('and opening it shows the score, read only', await p.eval(`/Marked/.test(document.querySelector('.ink-st').textContent) && !document.querySelector('.ink.edit')`));
  await p.shot('4-marked');
  await p.go('home');
  check('the reviewed shortcut clears while My sheets stays', await p.eval(`!document.querySelector('.ink-hc.done') && !!document.querySelector('.ink-all[href="#/sheets"]')`));
  await p.eval(`document.querySelector('.ink-all').focus(); 1`);
  await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await p.wait(500);
  check('the My sheets link opens from the keyboard', await p.eval(`A.route() === 'sheets' && !!document.querySelector('a[href="#/sheet/${code}/list"]')`));
  await p.go('sheet/' + code + '/list');
  check('the archived sheet keeps red marks and returns to My sheets', await p.eval(`A.D('u9').sheets.find(s=>s.id==='${code}').mk[0].length === 1 && document.querySelector('.ink-back').getAttribute('href') === '#/sheets' && !document.querySelector('.ink.edit')`));
  await p.eval(`A.S.lang = 'ar'; A.saveNow(); 1`);
  await p.go('sheets');
  check('My sheets renders in Arabic RTL', await p.eval(`document.documentElement.dir === 'rtl' && document.querySelector('h1').textContent.includes('أوراقي')`));
  if (p.errs.length) console.log('PAGE ERRORS', p.errs.slice(0, 4).join('\n'));
};
