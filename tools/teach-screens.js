/* Development: every step of every taught lesson, drawn by its real screen code in both languages. Reports exceptions, text that overflows, and English left in Arabic.
   Run: node tools/cdp.js tools/teach-screens.js build/e2e   (dev server on 5191) */
module.exports = async (p) => {
  await p.size(360, 740); await p.open('#/home');
  const r = await p.eval(`(async function(){
    var ids=Object.keys(C.skills).filter(function(k){return C.skills[k].teach});
    var host=document.createElement('div');host.style.cssText='position:fixed;left:0;top:0;width:360px;height:740px;overflow:auto;opacity:0;pointer-events:none;z-index:-1';document.body.appendChild(host);
    var errs=[],counts={},lang0=A.S.lang,steps=0;
    ['en','ar'].forEach(function(lang){
      A.S.lang=lang;A.applyTheme();
      ids.forEach(function(id){
        var sk=C.skills[id];
        for(var seed=1;seed<=3;seed++){
          var rng=A.rng(seed*31+id.length),list=[];
          try{
            [sk.meet,sk.guided].forEach(function(f){var a=typeof f==='function'?f(rng):f;if(a)list=list.concat(a)});
            for(var i=0;i<(sk.soloN||0);i++){var q=sk.solo(rng,i);list.push(Array.isArray(q)?q[0]:q)}
            var mk=typeof sk.make==='function'?sk.make(rng):sk.make;if(mk)list=list.concat(mk);
            list.push(sk.review(rng));
          }catch(e){errs.push(id+' build: '+e.message);continue}
          list.forEach(function(s){
            if(!s)return;steps++;counts[s.k]=(counts[s.k]||0)+1;
            host.innerHTML='<div class="pl"><div class="pl-p"></div><div class="step-in"></div><div class="pl-foot"></div></div>';
            var el=host.querySelector('.step-in');
            var ctx={el:el,step:s,rng:rng,stage:3,foot:host.querySelector('.pl-foot'),ok:function(){},bad:function(){},done:function(){},next:function(){},say:function(){},setCleanup:function(){},showNext:function(){},onReveal:function(f){ctx._r=f},logErr:function(){},skillId:id};
            try{ if(!I[s.k]){errs.push(id+' no instrument '+s.k);return} I[s.k](ctx); if(ctx._r&&s.workS){ctx._r();Teach.reveal(ctx,s)} }catch(e){errs.push(id+' '+s.k+': '+e.message);return}
            var cl=el.cloneNode(true);cl.querySelectorAll('svg').forEach(function(x){x.remove()});var t=(cl.textContent||'')+' '+(s.p?A.L(s.p):'');
            if(/undefined|NaN(?![O₀-₉])|\\[object/.test(t))errs.push(id+' '+s.k+' reads badly: '+t.slice(0,80));
            /* in Arabic, international symbols stay Latin: units, chemical formulae, DNA letters */
            if(lang==='ar'){var EL=C.TS.EL.join('|'),latin=function(wd){return C.TS.UNITS.indexOf(wd)>=0||/^(DNA|ADH|MHz|UKMT|AMC|alcohol|alkali)$/.test(wd)||/^[ATCG]+$/.test(wd)||/^[Tt]+$/.test(wd)||/^[A-Z]{3}$/.test(wd)||new RegExp('^(?:'+EL+')+$').test(wd)};
              var left=(t.replace(/sin|cos|tan|cm|km|mm|m\\/s|km\\/h/g,'').match(/[A-Za-z]{3,}/g)||[]).filter(function(wd){return !latin(wd)});if(left.length)errs.push(id+' '+s.k+' English in Arabic: '+left.slice(0,4).join(' '))}
            if(el.scrollWidth>el.clientWidth+2)errs.push(id+' '+s.k+' '+lang+' too wide '+el.scrollWidth);
          });
        }
      });
    });
    A.S.lang=lang0;A.applyTheme();host.remove();
    var seen={},uniq=errs.filter(function(e){var k=e.replace(/[0-9٠-٩]+/g,'#');if(seen[k])return false;seen[k]=1;return true});
    return JSON.stringify({ids:ids.length,steps:steps,counts:counts,errs:uniq.length,list:uniq.slice(0,50)});
  })()`);
  const o = JSON.parse(r);
  console.log(o.ids + ' sessions, ' + o.steps + ' steps', JSON.stringify(o.counts));
  o.list.forEach(x => console.log('  ' + x));
  console.log(o.errs + ' problems');
};
