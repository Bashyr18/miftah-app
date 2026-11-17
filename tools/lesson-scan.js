/* Development only: every step of every lesson, mounted through the real player and checked as a child would meet it.
     node tools/cdp.js tools/lesson-scan.js build/scan            (dev server on 5191)
   SIZE=1280x800 LANG_UI=ar ONLY=math,arabic  narrow or change the run. Writes report.json: per finding kind, the lessons and steps.
   Finds: errors while drawing a step; text past the screen's edge; a canvas left blank; NaN in a diagram; "undefined", "null",
   "NaN" or "[object" in words a child reads; buttons under 40 px; a step with nothing to see. */
const fs = require('fs'), path = require('path');
module.exports = async (p) => {
  const [w, h] = (process.env.SIZE || '390x844').split('x').map(Number), out = process.argv[3]; fs.mkdirSync(out, { recursive: true });
  await p.open('#/home'); await p.size(w, h, 1);
  for (let i = 0; i < 80 && !(await p.eval('!!(window.A && A.S && A.saveNow && window.Player && window.C && window.Voice)').catch(() => false)); i++) await p.wait(200);
  const lang = process.env.LANG_UI || 'en', only = process.env.ONLY || '';
  await p.eval(`(function(){ var y=2026; A.S.profiles=[{id:'s1',name:'Sam',by:y-9,bm:1,g:'m',hue:'teal',since:'2026-09-01'}]; A.S.cur='s1'; A.S.lang='${lang}'; A.S.motion='off'; A.S.sound=false; A.saveNow(); A.applyTheme(); location.hash='#/keys'; return 1 })()`);
  await p.wait(800);
  const res = await p.eval(`(async function(){
    var wait=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
    var only='${only}'.split(',').filter(Boolean), find={}, ages={0:2,1:5,2:9,3:13,4:16};
    function add(kind,id,i,k,extra){ (find[kind]=find[kind]||[]).push(id+' #'+i+' '+k+(extra?' · '+extra:'')); }
    var host=document.querySelector('#app'); document.body.dataset.view='lesson';
    var origErr=console.error, caught=[]; console.error=function(){ caught.push([].map.call(arguments,String).join(' ')); };
    var ids=Object.keys(C.skills).filter(function(id){ return !only.length || only.indexOf(C.skills[id].room)>=0; }), n=0;
    for (var ii=0; ii<ids.length; ii++) {
      var sk=C.skills[ids[ii]], st=[];
      /* the age the lesson is for: young lessons drawn for a young child */
      var age = {0:3,1:5,2:9,3:13,4:16}[sk.band] || 9;
      A.S.profiles[0].by=2026-age;
      try { st=Player.compose(sk, A.rng(11)); } catch(e){ add('COMPOSE', sk.id, 0, '', e.message); continue; }
      for (var i=0;i<st.length;i++){
        var s=st[i]; if (s.k==='sim') continue; n++;
        caught.length=0; host.innerHTML='<div class="view"></div>';
        try { Player.start(host.firstChild,{steps:[s,{k:'say',p:['x','x'],t:['x','x']}],skill:sk.id,hue:(C.rooms[sk.room]||{}).hue||'gold',title:sk.title,onDone:function(){},onExit:function(){}}); }
        catch(e){ add('THROW', sk.id, i, s.k, String(e.message).slice(0,120)); continue; }
        await wait(s.k==='trace'||s.k==='clock'||s.k==='line'?120:25);
        if (caught.length) add('ERROR', sk.id, i, s.k, caught[0].slice(0,140));
        var body=host.querySelector('.pl-body'), pl=host.querySelector('.pl');
        if (!body) { add('NOBODY', sk.id, i, s.k); continue; }
        var txt=(pl.innerText||'');
        var bad=txt.match(/\\b(undefined|null|NaN)\\b|\\[object /);
        if (bad) add('WORDS', sk.id, i, s.k, bad[0]+' in "'+txt.slice(Math.max(0,txt.indexOf(bad[0])-30), txt.indexOf(bad[0])+20).replace(/\\s+/g,' ')+'"');
        if (/NaN/.test(body.innerHTML.replace(/>[^<]*</g,'><'))) add('SVGNAN', sk.id, i, s.k);
        if (document.documentElement.scrollWidth>innerWidth+1) add('SIDEWAYS', sk.id, i, s.k, document.documentElement.scrollWidth+'px');
        var edge=null; [].forEach.call(pl.querySelectorAll('*'), function(e){ if(edge||e.closest('svg,canvas,.keybar,.hscroll,.tabs')) return; var r=e.getBoundingClientRect(); if(!r.width) return; var own=[].some.call(e.childNodes,function(nd){return nd.nodeType===3&&nd.textContent.trim()}); if(own&&(r.right>innerWidth+1||r.left<-1)) edge=e.tagName.toLowerCase()+'.'+String(e.className).split(' ')[0]+' "'+e.textContent.trim().slice(0,20)+'"'; });
        if (edge) add('EDGE', sk.id, i, s.k, edge);
        [].forEach.call(body.querySelectorAll('canvas'), function(cv){ if(!cv.width||!cv.height) { add('CANVAS0', sk.id, i, s.k); return; } try { var d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data, any=false; for (var q=3;q<d.length;q+=4*97) if (d[q]) { any=true; break; } if(!any) add('BLANK', sk.id, i, s.k); } catch(e){} });
        var small=null; [].forEach.call(body.querySelectorAll('button'), function(b){ var r=b.getBoundingClientRect(); if(!small&&r.width&&(r.width<40||r.height<40)&&!b.closest('.ayah,p')) small=b.className.split(' ')[0]+' '+Math.round(r.width)+'x'+Math.round(r.height); });
        if (small) add('TAP', sk.id, i, s.k, small);
        if (body.getBoundingClientRect().height<8 && s.k!=='say') add('EMPTY', sk.id, i, s.k);
        try { Player.stop(); } catch(e){}
      }
    }
    console.error=origErr;
    var sum={}; Object.keys(find).forEach(function(k){ sum[k]=find[k].length; });
    return JSON.stringify({steps:n, sum:sum, find:find});
  })()`);
  fs.writeFileSync(path.join(out, 'report-' + (process.env.SIZE || '390x844') + '-' + lang + '.json'), res);
  const r = JSON.parse(res); console.log('steps', r.steps, JSON.stringify(r.sum));
};
