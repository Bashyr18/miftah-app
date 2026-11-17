/* Development only: one real example of every kind of lesson step, photographed on a phone and on a tablet.
     node tools/cdp.js tools/step-shots.js build/steps        (dev server on 5191)   SIZES=390x844,1280x800 */
const fs = require('fs'), path = require('path');
module.exports = async (p) => {
  const out = process.argv[3]; fs.mkdirSync(out, { recursive: true });
  await p.open('#/home');
  for (let i = 0; i < 80 && !(await p.eval('!!(window.A && A.S && A.saveNow && window.Player && window.C && window.Voice)').catch(() => false)); i++) await p.wait(200);
  await p.eval(`(function(){ A.S.profiles=[{id:'s1',name:'Sam',by:2017,bm:1,g:'m',hue:'teal',since:'2026-09-01'}]; A.S.cur='s1'; A.S.motion='off'; A.S.sound=false; A.saveNow(); location.hash='#/keys'; return 1 })()`);
  await p.wait(700);
  /* the first lesson step of each kind, for the age it is meant for */
  const picks = JSON.parse(await p.eval(`JSON.stringify((function(){ var seen={}, out=[]; Object.keys(C.skills).forEach(function(id){ var sk=C.skills[id], st; A.S.profiles[0].by=2026-({0:3,1:5,2:9,3:13,4:16}[sk.band]||9); try { st=Player.compose(sk, A.rng(11)); } catch(e){ return; }
    st.forEach(function(s,i){ if (s.k==='sim'||seen[s.k]) return; seen[s.k]=1; out.push([id,i,s.k,{0:3,1:5,2:9,3:13,4:16}[sk.band]||9]); }); }); return out; })())`));
  for (const size of (process.env.SIZES || '390x844,1280x800').split(',')) {
    const [w, h] = size.split('x').map(Number); await p.size(w, h, 1);
    for (const [id, i, k, age] of picks) {
      await p.eval(`(function(){ A.S.profiles[0].by=2026-${age}; var st=Player.compose(C.skills['${id}'],A.rng(11)); var host=document.querySelector('#app'); host.innerHTML='<div class="view"></div>'; document.body.dataset.view='lesson'; document.body.dataset.age=A.stage();
        Player.start(host.firstChild,{steps:[st[${i}],{k:'say',p:['x','x'],t:['x','x']}],skill:'${id}',hue:(C.rooms[C.skills['${id}'].room]||{}).hue,title:C.skills['${id}'].title,onDone:function(){},onExit:function(){}}); return 1 })()`);
      await p.wait(k === 'trace' || k === 'clock' ? 600 : 350);
      const r = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 72 });
      fs.writeFileSync(path.join(out, size + '-' + k + '.jpg'), Buffer.from(r.result.data, 'base64'));
    }
  }
  console.log(picks.map(x => x[2] + ':' + x[0]).join(' '));
};
