/* Development only: a student who answers through the real buttons. Used with tools/cdp.js.
   Exports a browser-side script. window.__walk(ids) completes each lesson by clicking, and reports what it asked and anything it could not answer. */
module.exports = `(function(){
  var cap=null, s0=Player.start; Player.start=function(h,o){cap=o; return s0(h,o)};
  function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}
  function L0(x){return Array.isArray(x)?x[0]:x}
  function normalKey(ch){return ch==='-'||ch==='−'?'-':ch}
  async function answer(step,log){
    if(step.k==='pad'){var v=String(step.a).replace(/−/g,'-');for(var i=0;i<v.length;i++){var b=A.$('.pad button[data-d="'+v[i]+'"]');if(!b)return 'no digit '+v[i];b.click()}A.$('.pad button[data-d="go"]').click();return null}
    if(step.k==='along'){for(var wt=0;wt<20&&!A.$('.al-in > *');wt++)await wait(50);for(var si=0;si<step.s.length;si++){var x=step.s[si];if(x[3]==null)continue;
      /* a missing word is chosen from buttons */
      if(Array.isArray(x[3])){var want=A.L(x[3]),wb=null;for(var ww=0;ww<20&&!wb;ww++){wb=A.$$('.al-c').filter(function(b){return b.textContent.trim()===want.trim()})[0];if(!wb)await wait(40)}if(!wb)return 'no word '+want;wb.click();await wait(30);continue}
      for(var wp=0;wp<20&&!A.$('.al-in .pad');wp++)await wait(30);var av=String(x[3]).replace(/−/g,'-');for(var ci=0;ci<av.length;ci++){var bb=A.$('.pad button[data-d="'+av[ci]+'"]');if(!bb)return 'no key '+av[ci]+' in '+av;bb.click()}A.$('.pad button[data-d="go"]').click()}return null}
    if(step.k==='spot'){for(var ws=0;ws<20&&!A.$('.sp-l');ws++)await wait(50);var sb=A.$('.sp-l[data-i="'+step.w+'"]');if(!sb)return 'no line';sb.click();return null}
    if(step.k==='expr'){var v2=String(step.a).replace(/−/g,'-');for(var j=0;j<v2.length;j++){var k=normalKey(v2[j]);var b2=A.$('.xkeys button[data-k="'+k+'"]');if(!b2)return 'no key '+k;b2.click()}A.$('.xkeys button[data-k="ok"]').click();return null}
    if(step.k==='choice'){var opts=A.$$('.opt');var hit=opts.filter(function(o){var r=(step.o||[]).filter(function(x){return x.ok})[0];var t=r&&L0(r.t);return t&&o.textContent.trim()===String(t).trim()})[0];if(!hit)return 'right option not on screen';hit.click();return null}
    return 'skip:'+step.k;
  }
  window.__walk=async function(ids,keep){
    var out=[];
    for(var n=0;n<ids.length;n++){
      var id=ids[n],rec={id:id,q:[],bad:[]};cap=null;location.hash='#/lesson/'+id;await wait(350);
      for(var g=0;g<40;g++){
        var ph=A.$('.pl-ph');if(!ph||!cap)break;
        var host=A.$('.step');if(!host)break;
        var kind=(host.className.match(/st-([a-z]+)/)||[])[1];
        var prompt=(A.$('.pl-p')||{}).textContent||'';
        var eq=(A.$('.pad-given,.pad-code,.pad-eq')||{}).textContent||'';
        var st=Player.cur();
        if(kind==='work'){var wg,wq=0;while((wg=A.$('.wkx-go'))&&wq++<30){wg.click();await wait(20)}if(wq>30)rec.bad.push('work button never went away: '+prompt.slice(0,40));var nw=A.$('.pl-next');if(nw)nw.click();else A.acts['pl-next']();await wait(60);continue}
        if(kind==='say'||kind==='sim'||kind==='mission'||kind==='body'||kind==='watch'){if(kind==='say')rec.q.push('P '+prompt);var nb=A.$('.pl-next');if(nb)nb.click();else A.acts['pl-next']();await wait(60);continue}
        if(!st){rec.bad.push('no step for '+kind+': '+prompt.slice(0,40));A.acts['pl-next']();await wait(60);continue}
        var line=(ph.textContent||'').slice(0,8)+' | '+prompt+(eq?' | '+eq:'')+' => ';
        if(st.k==='choice'){var r0=st.o.filter(function(x){return x.ok})[0];line+=L0(r0.t)+'   ['+st.o.filter(function(x){return !x.ok}).map(function(x){return L0(x.t)}).join(' / ')+']'}else line+=st.a;
        rec.q.push(line);
        var e=await answer(st,rec);
        if(e){rec.bad.push(e+' @ '+prompt.slice(0,40));A.acts['pl-next']();await wait(60);continue}
        await wait(st.k==='along'?1150:520);
        if(Player.cur()===st&&!A.$('.pl-next')){rec.bad.push('REJECTED '+prompt.slice(0,40)+' a='+st.a)}
        var nx=A.$('.pl-next');if(nx){nx.click();await wait(60)}
      }
      rec.end=(A.$('.tres small,.lesson-done,.done-h')||{}).textContent||(document.body.innerText||'').slice(0,20);
      rec.forged=!!(A.D().keys[id]&&A.D().keys[id].forged);
      out.push(rec);
    }
    return out;
  };
})()`;
