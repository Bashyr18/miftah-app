/* Regression, in a real browser: nobody earns credit by tapping. Run with tools/cdp.js.
   Fails loudly if an exam can be passed by correcting wrong answers, or if random tapping masters lessons. */
module.exports = async (p) => {
  await p.size(390, 844); await p.open('#/home');
  await p.eval(`(function(){var y=new Date().getFullYear();A.S.lang='en';A.S.motion='off';A.S.profiles=[{id:'w',name:'W',by:y-15,bm:1,g:'f',hue:'gold',since:'2026-10-01'}];A.S.cur='w';A.S.data={};C.rooms.math.units.filter(function(u){return u.y===9}).forEach(function(u){u.skills.forEach(function(s){M.forge(s.id,'w')})});A.saveNow();return 1})()`);
  await p.open('#/home');
  const exam = JSON.parse(await p.eval(`(async function(){function w(ms){return new Promise(function(r){setTimeout(r,ms)})}location.hash='#/x';await w(60);location.hash='#/exam/math/9';for(var z=0;z<40&&!(Player.cur()&&A.$('.pl-ph'));z++)await w(100);
    for(var g=0;g<40;g++){var st=Player.cur();if(!st||!A.$('.pl-ph'))break;
      if(st.k==='pad'){var av=+String(st.a).replace('−','-'),bad=isNaN(av)?'9':String(av+1);for(var i=0;i<bad.length;i++){var kb0=A.$('.pad button[data-d="'+bad[i]+'"]');if(kb0)kb0.click()}A.$('.pad button[data-d="go"]').click()}
      else if(st.k==='along'||st.k==='spot'||st.k==='work'){A.acts['pl-next']()}
      else if(st.k==='expr'){var b2=isNaN(+st.a)?'9':String(+st.a+1);for(var a=0;a<b2.length;a++){var kb=A.$('.xkeys button[data-k="'+b2[a]+'"]');if(kb)kb.click()}A.$('.xkeys button[data-k="ok"]').click()}
      else if(st.k==='choice'){var rt=st.o.filter(function(o){return o.ok})[0],t0=String(Array.isArray(rt.t)?rt.t[0]:rt.t).trim();var wrong=A.$$('.opt').filter(function(o){return o.textContent.trim()!==t0})[0];if(wrong)wrong.click()}
      else A.acts['pl-next']();
      await w(400)}
    for(var y2=0;y2<40&&!(A.D().exams||[]).length;y2++)await w(100);var last=(A.D().exams||[]).slice(-1)[0];return JSON.stringify({p:last&&last.p,certs:(A.D().certs||[]).length})})()`));
  console.log('all wrong first in an exam:', JSON.stringify(exam));
  if (exam.p !== 0 || exam.certs) console.log('FAIL an exam gave credit for wrong answers');
  const ids = await p.eval(`Object.keys(C.units).filter(function(u){return C.units[u].y>=8&&/^(b9|c9|bio9|che9|w9-mod|k9|d9-fiqh|e9-lit|li9)/.test(u)}).reduce(function(a,u){return a.concat(C.units[u].skills.filter(function(s){return Player.compose(s,A.rng(1)).every(function(x){return ['choice','say','sim','mission'].indexOf(x.k)>=0})}).map(function(s){return s.id}))},[]).slice(0,24)`);
  const r = await p.eval(`(async function(){function w(ms){return new Promise(function(r){setTimeout(r,ms)})}var ids=${JSON.stringify(ids)},m=0,n=0;for(var a=0;a<ids.length;a++){var id=ids[a];delete A.D().keys[id];location.hash='#/x';await w(40);location.hash='#/lesson/'+id;await w(250);
      for(var g=0;g<60;g++){var st=Player.cur();if(!st||!A.$('.pl-ph'))break;
        if(st.k==='choice'){for(var t=0;t<4&&Player.cur()===st&&!A.$('.pl-next');t++){var opts=A.$$('.opt').filter(function(o){return !o.disabled});if(!opts.length)break;opts[Math.floor(Math.random()*opts.length)].click();await w(60)}await w(460);var nx=A.$('.pl-next');if(nx){nx.click();await w(40)}}
        else{var gow=A.$('.wkx-go');if(gow){gow.click();await w(20);continue}var nb=A.$('.pl-next');if(nb)nb.click();else A.acts['pl-next']();await w(40)}}
      await w(100);n++;if(A.D().keys[id]&&A.D().keys[id].forged)m++}return m+'/'+n})()`);
  console.log('random tapping mastered:', r);
  const [m, n] = r.split('/').map(Number); if (m / n > .25) console.log('FAIL random tapping earns mastery too often');
};
