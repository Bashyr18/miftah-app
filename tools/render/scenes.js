/* The art: every object is geometry and material, lit and path traced. Nothing has a face. Shared: GLSL helpers from render.html. */
window.defaults = {};
const S = window.SCENES = [];
const add = (name, code, o) => S.push(Object.assign({ name, code }, o || {}));
const GOLD = 'vec3(1.,.74,.36)', BRASS = 'vec3(.95,.68,.32)';

/* ---------- the key, the heart of the app ---------- */
add('key', `
float bow(vec3 p){ float a=atan(p.y,p.x); float rr=length(p.xy); float R0=.47+.055*cos(a*8.)+.012*cos(a*16.); float d=max(rr-R0,abs(p.z)-.075); d=max(d,-(rr-.2)); return d-.012; }
float map(vec3 p){ float r=1e5; p.yz*=R(.1); p.xy*=R(-.32); p.xz*=R(.42); p.y-=.12;
 vec3 q=p-vec3(0,.42,0);
 U(bow(q),1);
 U(max(length(vec2(length(q.xy)-.2,q.z))-.03,-1.),1);
 U(length(vec2(length(q.xy)-.37,q.z-.075))-.015,1); U(length(vec2(length(q.xy)-.37,q.z+.075))-.015,1);
 float st=length(vec2(abs(atan(q.y,q.x)*8./6.2832-floor(atan(q.y,q.x)*8./6.2832+.5))*1.2+length(q.xy)*.02-.0,length(q.xy)-.135))-.0;
 U(max(sph(q,.11),abs(q.z)-.03),2);
 vec3 s=p-vec3(0,-.33,0);
 U(cyl(s,.57,.058,.01),1);
 U(cyl(p-vec3(0,-.02,0),.03,.092,.012),1); U(cyl(p-vec3(0,.04,0),.016,.075,.008),1); U(cyl(p-vec3(0,-.84,0),.03,.076,.012),1);
 U(rbox(p-vec3(.14,-.78,0),vec3(.1,.042,.034),.008),1); U(rbox(p-vec3(.12,-.63,0),vec3(.08,.042,.034),.008),1); U(rbox(p-vec3(.09,-.48,0),vec3(.05,.03,.034),.008),1);
 return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(1.,.84,.5),.12,1.); float w=fbm(p*30.)*.08; return M(${GOLD},.2+w,1.); }`, { shadow: .42, spp: 300 });

/* ---------- food ---------- */
add('date', `
float map(vec3 p){ float r=1e5; p.xy*=R(.5); float w=(sin(p.y*22.+sin(p.x*16.)*1.3)*.5+.5)*.018+fbm(p*9.)*.03; U(ell(p,vec3(.42,.8,.42))-w+.02,1); U(cyl(p-vec3(0,.76,0),.06,.08,.02),2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.75,.55,.25),.6,0.); float f=fbm(p*5.); vec3 a=mix(vec3(.2,.06,.018),vec3(.42,.16,.04),f); return M(a,.3+.3*f,0.); }`);
add('apple', `
float map(vec3 p){ float r=1e5; p.y+=.04; float a=length(p.xz); float d=length(vec2(a-.34,p.y*1.02))-.56; float h=exp(-a*a*18.)*.24; d+=h*smoothstep(-.1,.5,p.y)+exp(-a*a*30.)*.1*smoothstep(.1,-.5,p.y); U(d*.8,1); U(cap(p,vec3(0,.3,0),vec3(.08,.92,.02),.032),2); vec3 l=p-vec3(.28,.84,0); l.xy*=R(-.55); U(ell(l,vec3(.3,.018,.13)),3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.25,.13,.05),.7,0.); if(gM==3) return M(vec3(.16,.5,.12),.4,0.); float s=fbm(vec3(p.x*3.,p.y*12.,p.z*3.)); vec3 a=mix(vec3(.62,.02,.03),vec3(.85,.22,.05),smoothstep(.35,.8,s)); return M(a,.14,0.); }`);
add('orange', `
float map(vec3 p){ float r=1e5; float d=sph(p,.86)-vn(p*40.)*.007; U(d,1); U(cap(p,vec3(0,.84,0),vec3(.01,.93,0),.03),2); vec3 l=p-vec3(.2,.95,0); l.xy*=R(-.3); U(ell(l,vec3(.26,.016,.1)),3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.2,.2,.06),.7,0.); if(gM==3) return M(vec3(.1,.42,.13),.4,0.); return M(vec3(.95,.42,.03),.32,0.); }`);
add('olive', `
float map(vec3 p){ float r=1e5; p.xy*=R(-.3); U(ell(p,vec3(.52,.76,.52)),1); U(cap(p,vec3(0,.72,0),vec3(.1,1.02,0),.022),2); vec3 l=p-vec3(.34,.98,0); l.xy*=R(-.35); U(ell(l,vec3(.38,.016,.1)),3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.25,.18,.08),.7,0.); if(gM==3) return M(vec3(.2,.34,.14),.5,0.); return M(mix(vec3(.2,.27,.05),vec3(.36,.42,.1),fbm(p*3.)),.2,0.); }`);
add('grape', `
float map(vec3 p){ float r=1e5; p.y-=.05; for(int i=0;i<4;i++){ float y=.5-float(i)*.33; float n=float(4-i); for(int j=0;j<int(n)+1;j++){ float a=float(j)/(n+1.)*6.28+float(i); vec3 c=vec3(cos(a)*.1*n,y,sin(a)*.1*n); U(sph(p-c,.25),1);} } U(cap(p,vec3(0,.62,0),vec3(.03,.98,0),.03),2); vec3 l=p-vec3(.3,.86,0); l.xy*=R(-.4); U(ell(l,vec3(.36,.016,.25)),3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.25,.15,.06),.7,0.); if(gM==3) return M(vec3(.15,.45,.14),.45,0.); return M(vec3(.2,.06,.3),.12,0.); }`);
add('bread', `
float map(vec3 p){ float r=1e5; p.xz*=R(.5); float s=fbm(p*5.)*.03; float d=rbox(p-vec3(0,-.25,0),vec3(.82,.42,.48),.26); d=smin(d,ell(p-vec3(0,.12,0),vec3(.85,.42,.54)),.1); for(int i=-1;i<2;i++){ d=smax(d,-ell(p-vec3(float(i)*.45,.5,0),vec3(.05,.07,.42)),.04);} U(d-s,1); return r; }
Mat mat(vec3 p,vec3 n){ float k=smoothstep(.0,.5,p.y); vec3 c=mix(vec3(.72,.42,.16),vec3(.5,.24,.07),k); c=mix(c,vec3(.95,.8,.55),smoothstep(.54,.48,abs(p.y-.45)+1.)*.0); return M(c,.65,0.); }`);
/* ---------- nature ---------- */
add('leaf', `
float map(vec3 p){ float r=1e5; p.xy*=R(.75); p.xz*=R(.5); float w=.62*sqrt(max(0.,1.-pow((p.y)/1.05,2.)))*(1.-.18*p.y); float bend=p.x*p.x*.25; float v=abs(sin(p.y*16.-abs(p.x)*9.))*.008; float d=max(abs(p.z-bend)-.016+v,abs(p.x)-w); U(d*.6,1); U(cap(p,vec3(0,-1.28,bend),vec3(0,.98,.01),.018),2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.3,.42,.1),.5,0.); float v=abs(sin(p.y*16.-abs(p.x)*9.)); return M(mix(vec3(.05,.3,.08),vec3(.16,.5,.12),v*.6+fbm(p*6.)*.4),.42,0.); }`);
const trunk = `vec3 tq=p; tq.x+=sin(p.y*1.2)*.05;`;
add('tree', `
float map(vec3 p){ float r=1e5; U(cyl(p-vec3(0,-.62,0),.42,.11+max(0.,-p.y-.7)*.2,.05)+fbm(p*14.)*.02,1); float f=fbm(p*5.)*.17; float d=sph(p-vec3(0,.38,0),.56); d=smin(d,sph(p-vec3(-.42,.1,.1),.38),.14); d=smin(d,sph(p-vec3(.42,.12,-.05),.4),.14); d=smin(d,sph(p-vec3(.05,.08,.42),.36),.14); U(d+f-.06,2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==1) return M(vec3(.26,.15,.08),.8,0.); float f=fbm(p*9.); return M(mix(vec3(.05,.24,.07),vec3(.28,.55,.14),f),.7,0.); }`);
add('palm', `
float frond(vec3 p,float a,float c){ p.xz*=R(a); float t=clamp(p.x/1.,0.,1.); float y=.0+.28*t-c*t*t*.85; vec3 q=vec3(p.x,p.y-y,p.z); float w=(1.-t)*.17*smoothstep(0.,.1,t)+.015; float v=abs(fract(t*16.)-.5)*.5; return max(max(abs(q.y)-.012,abs(q.z)-w*(1.-v*.65)),max(-p.x,p.x-1.))*.65; }
float map(vec3 p){ float r=1e5; vec3 c=p-vec3(0,.3,0); float rg=sin(p.y*26.)*.008; vec3 q=p; q.x+=(p.y+1.)*(p.y+1.)*.06; U(cap(q,vec3(0,-1.02,0),vec3(0,.3,0),.06+max(0.,-p.y)*.02)+rg,1); vec3 h=p-vec3(.21,.34,0); for(int i=0;i<9;i++){ float a=float(i)*.698; U(frond(h,a,.6+.25*sin(float(i)*2.3)),2);} for(int i=0;i<5;i++){ float a=float(i)*1.26; U(sph(h-vec3(cos(a)*.1,-.08,sin(a)*.1),.052),3);} return r; }
Mat mat(vec3 p,vec3 n){ if(gM==1) return M(vec3(.32,.21,.12),.85,0.); if(gM==3) return M(vec3(.45,.2,.05),.35,0.); return M(mix(vec3(.05,.3,.1),vec3(.25,.5,.12),fbm(p*5.)),.5,0.); }`);
add('flower', `
float map(vec3 p){ float r=1e5; p.y-=.2; p.yz*=R(.55); U(cyl(p-vec3(0,0,0)+vec3(0,.02,0),.11,.2,.1)+vn(p*50.)*.012,2); float a=atan(p.z,p.x); float k=mod(a+.45,1.2566)-.6283; vec3 q=vec3(cos(k),0,sin(k))*length(p.xz); q.y=p.y; U(ell(q-vec3(.42,.02+q.x*q.x*.2,0),vec3(.32,.05,.25)),1); p=p; U(cap(vec3(p.x,p.y,p.z),vec3(0,-.1,0),vec3(0,-.1,0),.0),1); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.98,.68,.1),.5,0.); float k=length(p.xz)-.2; return M(mix(vec3(.95,.18,.42),vec3(1.,.55,.72),clamp(k*1.3,0.,1.)),.42,0.); }`, { cam: [0, .6, 4.2] });
add('seed', `
float lf(vec3 p){ return ell(p,vec3(.34,.03,.17)); }
float map(vec3 p){ float r=1e5; U(cyl(p-vec3(0,-.92,0),.1,.72,.1)+fbm(p*9.)*.05,1); float bx=sin(p.y*2.)*.03; U(cap(p+vec3(bx,0,0),vec3(0,-.85,0),vec3(0,.12,0),.038),2); vec3 a=p-vec3(-.27,.28,0); a.xy*=R(.5); U(lf(a),3); vec3 b=p-vec3(.27,.36,0); b.xy*=R(-.55); U(lf(b),3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==1) return M(mix(vec3(.13,.07,.04),vec3(.24,.14,.08),fbm(p*14.)),.9,0.); if(gM==2) return M(vec3(.3,.55,.18),.5,0.); return M(mix(vec3(.12,.46,.13),vec3(.34,.68,.18),fbm(p*6.)),.4,0.); }`);
add('plant', `
float lf(vec3 p){ float b=p.x*p.x*.55; return ell(p-vec3(0,-b,0),vec3(.36,.02,.15)); }
float map(vec3 p){ float r=1e5; vec3 q=p-vec3(0,-.62,0); float rr=.36+(q.y+.38)*.28; float d=max(length(q.xz)-rr,abs(q.y)-.38); d=max(d,-max(length(q.xz)-rr+.05,-(q.y-.26))); U(d-.012,1); U(cyl(p-vec3(0,-.2,0),.055,.5,.03),1); U(cyl(p-vec3(0,-.3,0),.02,.42,.01)+fbm(p*20.)*.02,4); U(cap(p,vec3(0,-.3,0),vec3(0,.72,0),.03),2); for(int i=0;i<5;i++){ float y=-.02+float(i)*.17; float s=mod(float(i),2.)<.5?1.:-1.; vec3 a=p-vec3(s*.3,y,float(i-2)*.05); a.x*=s; a.xy*=R(-.22); a=a; U(lf(a)*.8,3);} U(ell(p-vec3(0,.76,0),vec3(.09,.18,.09)),3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==1) return M(mix(vec3(.65,.27,.12),vec3(.5,.19,.09),fbm(p*8.)),.55,0.); if(gM==4) return M(vec3(.1,.06,.04),.9,0.); if(gM==2) return M(vec3(.3,.5,.16),.5,0.); return M(mix(vec3(.08,.4,.14),vec3(.3,.62,.2),fbm(p*5.)),.32,0.); }`);
add('sun', `
float map(vec3 p){ float r=1e5; U(sph(p,.52),1); float a=atan(p.y,p.x); float k=mod(a+.3927,.7854)-.3927; vec3 q=vec3(length(p.xy)*cos(k),length(p.xy)*sin(k),p.z); U(cap(q,vec3(.68,0,0),vec3(.96,0,0),.05+max(0.,.96-q.x)*.04),2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return E(vec3(1.),vec3(3.,1.7,.4)); float f=fbm(p*5.); return E(vec3(1.),mix(vec3(3.2,1.8,.35),vec3(4.,3.,1.),f)); }`, { shadow: 0 });
add('moon', `
float cr(vec3 p,vec3 c,float s){ float d=length(normalize(p)-normalize(c))/s; return (smoothstep(1.,.75,d)*-.05+smoothstep(.8,1.1,d)*smoothstep(1.4,1.1,d)*.02); }
float map(vec3 p){ float r=1e5; float d=sph(p,.9); d-=cr(p,vec3(.3,.5,.8),.22)+cr(p,vec3(-.4,.1,.9),.14)+cr(p,vec3(.1,-.4,.9),.17)+cr(p,vec3(.6,-.1,.7),.1)+cr(p,vec3(-.2,.7,.6),.1); d-=(fbm(p*5.)-.5)*.03; U(d,1); return r; }
Mat mat(vec3 p,vec3 n){ float f=fbm(p*3.5); return M(mix(vec3(.42,.41,.4),vec3(.82,.8,.74),smoothstep(.3,.7,f)),.85,0.); }`, { shadow: 0, sun: [-.75, .35, .55], sunCol: [3.2, 3.1, 2.9], envK: .22 });
add('star', `
float map(vec3 p){ float r=1e5; p.xz*=R(.35); p.yz*=R(.15); float a=atan(p.y,p.x); float k=abs(mod(a+.3927,.7854)-.3927); float rr=length(p.xy); float o=mix(.46,.92,pow(k/.3927,1.)*0.+0.); float e=.5+.42*(1.-k/.3927); float h=.17*(1.-rr/e); U(max(rr-e,abs(p.z)-max(h,0.))*.55,1); return r; }
Mat mat(vec3 p,vec3 n){ return M(${GOLD},.17,1.); }`);
add('cloud', `
float map(vec3 p){ float r=1e5; float d=sph(p-vec3(0,.12,0),.46); d=smin(d,sph(p-vec3(-.48,-.08,0),.36),.14); d=smin(d,sph(p-vec3(.5,-.06,.04),.38),.14); d=smin(d,sph(p-vec3(.2,.26,-.1),.36),.14); d=smin(d,rbox(p-vec3(0,-.24,0),vec3(.82,.2,.32),.19),.1); U(d+fbm(p*6.)*.05,1); return r; }
Mat mat(vec3 p,vec3 n){ return M(vec3(.96,.97,1.),.9,0.); }`);
const cloudTop = `float d=sph(p-vec3(0,.42,0),.4); d=smin(d,sph(p-vec3(-.42,.26,0),.3),.12); d=smin(d,sph(p-vec3(.44,.27,.04),.32),.12); d=smin(d,rbox(p-vec3(0,.1,0),vec3(.72,.16,.28),.15),.08); U(d+fbm(p*6.)*.04,1);`;
add('rain', `
float drop(vec3 p){ p.y-=.1; float t=clamp(p.y/.28,0.,1.); return ell(p-vec3(0,-.03,0),vec3(.08,.11,.08))-0.; }
float dr(vec3 p){ float d=sph(p,.09); vec2 q=vec2(length(p.xz),p.y-.1); float c=length(q-vec2(0.,.0))-.0; return smin(d,cap(p,vec3(0),vec3(0,.2,0),.012),.09); }
float map(vec3 p){ float r=1e5; ${cloudTop} U(dr(p-vec3(-.38,-.5,0)),2); U(dr(p-vec3(.04,-.72,.05)),2); U(dr(p-vec3(.44,-.48,0)),2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return G(vec3(.45,.75,.95),.03); return M(vec3(.68,.72,.8),.9,0.); }`, { ground: -1.02 });
add('drop', `
float map(vec3 p){ float r=1e5; p.y+=.14; float h=clamp(p.y/1.05,0.,1.); float w=.62*pow(1.-h,1.5); float d=length(p.xz)-w; if(p.y<0.) d=length(p)-.62; else d=d*.6; U(d,1); return r; }
Mat mat(vec3 p,vec3 n){ return G(vec3(.3,.64,.93),.01); }`, { spp: 400 });
add('stone', `
float map(vec3 p){ float r=1e5; p.y+=.28; float d=ell(p,vec3(.88,.58,.68)); d+=(fbm(p*2.6)-.5)*.32+(fbm(p*9.)-.5)*.05; U(d*.7,1); return r; }
Mat mat(vec3 p,vec3 n){ float f=fbm(p*7.); return M(mix(vec3(.2,.2,.21),vec3(.5,.49,.46),f),.75,0.); }`);
add('feather', `
float map(vec3 p){ float r=1e5; p.xy*=R(-.6); p.xz*=R(.4); float t=(p.y+.95)/1.95; float w=.32*sin(clamp(t,0.,1.)*3.1)*(.75+.25*t)+.0; float be=p.y*p.y*.18; float bf=p.x*.4; float v=abs(fract((p.y-abs(p.x)*1.3)*18.)-.5)*.012; float d=max(abs(p.z-be-abs(p.x)*.25)-.012-v,abs(p.x)-w); d=max(d,abs(p.y)-.98); U(d*.55,1); U(cap(p,vec3(0,-1.25,be),vec3(0,.96,.18),.014),2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.9,.85,.72),.4,0.); return M(mix(vec3(.82,.88,.96),vec3(.98,.98,1.),smoothstep(0.,.2,abs(p.x))),.6,0.); }`);
add('coin', `
float map(vec3 p){ float r=1e5; p.y-=.0; p.yz*=R(1.15); p.xz*=R(.35); float rr=length(p.xz); float a=atan(p.z,p.x); float k=abs(mod(a+.3927,.7854)-.3927); float st=max(rr-(.34+.2*(1.-k/.3927)),abs(p.y)-.13); float rim=max(rr-.86,abs(p.y)-.12)-.012; rim=max(rim,-max(rr-.74,abs(p.y)-.075)); U(rim,1); U(max(rr-.78,abs(p.y)-.08),1); U(st-.008,1); return r; }
Mat mat(vec3 p,vec3 n){ return M(${GOLD},.2+fbm(p*20.)*.1,1.); }`);
/* ---------- things ---------- */
add('book', `
float map(vec3 p){ float r=1e5; p.xz*=R(-.42); p.y+=.45; p.xy*=R(.0); float ax=abs(p.x); float cv=.18*exp(-ax*2.)-.05; float pg=rbox(vec3(ax-.5,p.y-.12-cv,p.z),vec3(.48,.1,.62),.03); U(pg,2); float cover=rbox(vec3(ax-.5,p.y+.0,p.z),vec3(.54,.025,.68),.02); U(cover,1); U(rbox(vec3(p.x,p.y+.0,p.z),vec3(.06,.03,.68),.02),1); for(int i=0;i<1;i++){ U(max(abs(p.z)-.68,length(vec2(ax-.5,p.y+.0))-.0)+1.,3);} return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2){ float l=abs(fract(p.y*90.)-.5); vec3 c=vec3(.93,.87,.72)*(n.y>.6?1.:.85+l*.2); if(n.y>.6){ float ax=abs(p.x); float ln=smoothstep(.09,.05,abs(fract(p.z*7.)-.5))*step(ax,.9)*step(.14,ax); c=mix(c,vec3(.32,.26,.2),ln*.55); } return M(c,.6,0.); } float e=step(.6,abs(p.z))+step(.92,abs(p.x)); return M(mix(vec3(.03,.28,.2),vec3(.82,.6,.25),e*.0),.38,0.); }`, { cam: [0, 1.5, 4.1], target: [0, -.1, 0] });
add('lantern', `
float map(vec3 p){ float r=1e5; p.y+=.02; vec3 q=p; float a=atan(q.z,q.x); float k=abs(mod(a,1.0472)-.5236); float rr=length(q.xz)*cos(k); U(max(rr-.33-(q.y+.1)*-.06,abs(q.y+.08)-.46),4);
 float fr=max(abs(rr-(.35+(q.y+.1)*-.06))-.022,abs(q.y+.08)-.5); float rib=abs(length(q.xz)*sin(k))-.0; U(max(max(rr-.37-(q.y+.1)*-.06,-(rr-.3)),min(.5236-k-.0+.47,10.)),3); U(max(abs(rr-.36)-.0,abs(q.y+.08)-.0)+1.,3);
 U(cyl(q+vec3(0,.58,0),.05,.42,.015),1); U(cyl(q+vec3(0,.68,0),.05,.28,.015),1); U(cyl(q-vec3(0,.42,0),.03,.4,.01),1);
 float dome=max(sph(q-vec3(0,.36,0),.38),-(q.y-.42)); U(dome,1); U(sph(q-vec3(0,.79,0),.05),1); U(tor((q-vec3(0,.92,0)).xzy,.075,.018),1); for(int i=0;i<6;i++){ float aa=float(i)*1.0472; vec3 c=vec3(cos(aa),0,sin(aa))*.37; U(cap(q,c+vec3(0,-.52,0),c*.9+vec3(0,.38,0),.018),1);} U(sph(q+vec3(0,.08,0),.1),5); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==1||gM==3) return M(${BRASS},.28,1.); if(gM==5) return E(vec3(1.),vec3(16.,8.5,2.5)); return E(vec3(.95,.72,.3),vec3(2.4,1.25,.36)); }`, { envK: .55 });
add('cup', `
float map(vec3 p){ float r=1e5; p.y+=.2; vec3 q=p; float rr=length(q.xz); float d=max(abs(rr-.56-q.y*.04)-.035,abs(q.y)-.62); d=min(d,max(rr-.56,abs(q.y+.58)-.04)); U(d-.012,1); U(max(rr-.53,abs(q.y-.45)-.1)+.0,2); vec3 h=q-vec3(.6,.02,0); float t=tor(h.xzy,.27,.055); U(max(t,-(q.x-.54)),1); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return G(vec3(.35,.68,.92),.02); float b=smoothstep(.0,.015,abs(p.y-.0-.33)-.03); return M(mix(${GOLD},vec3(.92,.91,.86),b),.14,0.); }`);
add('shoe', `
float map(vec3 p){ float r=1e5; p.xz*=R(.45); p.y+=.5; float t=clamp((p.x+.9)/1.8,0.,1.); float hgt=mix(.62,.3,smoothstep(.1,.6,t)); float d=rbox(p-vec3(0,.28,0),vec3(.92,.28,.36-.06*(1.-t)),.2); d=smin(d,ell(p-vec3(-.45,.5,0),vec3(.42,.42,.34)),.12); d=smax(d,-ell(p-vec3(-.48,.88,0),vec3(.28,.14,.22)),.03); U(d,1); U(rbox(p-vec3(0,.04,0),vec3(.96,.05,.38),.05),2); for(int i=0;i<4;i++){ U(cap(p,vec3(-.1+float(i)*.16,.62-float(i)*.06,-.14),vec3(-.1+float(i)*.16,.62-float(i)*.06,.14),.016),3);} return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.12,.09,.07),.7,0.); if(gM==3) return M(vec3(.9,.86,.75),.7,0.); return M(mix(vec3(.5,.26,.12),vec3(.62,.34,.16),fbm(p*5.)),.42,0.); }`);
add('ball', `
float map(vec3 p){ float r=1e5; U(sph(p,.84),1); return r; }
Mat mat(vec3 p,vec3 n){ float s=atan(p.z,p.x)*3./3.14159; float y=abs(fract(s)-.5); vec3 c=mod(floor(s),2.)<.5?vec3(.9,.14,.2):vec3(.98,.95,.9); if(abs(p.y)<.04) c=vec3(.98,.95,.9); return M(c,.22,0.); }`);
add('spoon', `
float map(vec3 p){ float r=1e5; p.xy*=R(-.65); p.xz*=R(.25); vec3 h=p-vec3(0,.55,0); float bowl=ell(h,vec3(.28,.42,.1)); bowl=max(bowl,-ell(h-vec3(0,0,.11),vec3(.25,.38,.1))); U(bowl-.008,1); float w=.042-p.y*.008; U(rbox(p-vec3(0,-.45,-.02-p.y*.02),vec3(w,.72,.012),.008),1); return r; }
Mat mat(vec3 p,vec3 n){ return M(vec3(.9,.91,.93),.14,1.); }`);
add('boat', `
float map(vec3 p){ float r=1e5; p.y+=.42; p.xz*=R(.5); float t=p.x; float wd=.34*(1.-t*t/1.); float hull=rbox(vec3(p.x,p.y+.0,p.z),vec3(1.,.24,.34),.18); hull=max(hull,abs(p.z)-max(wd,0.)-.02-(p.y)*.25); hull=max(hull,(-p.y-.16+.24*abs(p.x)*abs(p.x)*.0)); hull=smax(hull,-rbox(p-vec3(0,.28,0),vec3(.75,.1,.2),.08),.03); U(hull*.8,1); U(cyl(p-vec3(0,.72,0),.72,.022,.01),2); float t2=clamp((p.y-.35)/1.,0.,1.); float sail=max(max(abs(p.z-sin(p.y*2.)*.06)-.008,p.x-.04),-(p.x-.04+(1.-t2)*.62)); sail=max(sail,max(.28-p.y,p.y-1.35)); U(sail*.7,3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==1) return M(mix(vec3(.45,.22,.09),vec3(.62,.34,.14),smoothstep(.3,.7,fbm(vec3(p.x*2.,p.y*22.,p.z*2.)))),.45,0.); if(gM==2) return M(vec3(.3,.18,.08),.55,0.); return M(vec3(.96,.93,.86),.8,0.); }`);
add('wood', `
float map(vec3 p){ float r=1e5; p.xz*=R(.55); p.y+=.42; p.xy=vec2(p.x,p.y); float d=length(p.yz)-.46-fbm(vec3(p.x*2.,p.yz*5.))*.04; d=max(d,abs(p.x)-1.); U(d-.015,1); return r; }
Mat mat(vec3 p,vec3 n){ float end=step(.98,abs(p.x)); if(abs(n.x)>.8){ float rg=sin(length(p.yz)*38.+fbm(p*4.)*3.)*.5+.5; return M(mix(vec3(.72,.5,.28),vec3(.5,.3,.14),rg),.6,0.); } return M(mix(vec3(.2,.11,.06),vec3(.38,.22,.11),fbm(vec3(p.x*2.,p.yz*16.))),.8,0.); }`);
add('nail', `
float map(vec3 p){ float r=1e5; p.xy*=R(-.7); p.xz*=R(.2); U(cyl(p-vec3(0,.86,0),.03,.2,.012),1); float t=clamp((p.y+.9)/.2,0.,1.); U(max(length(p.xz)-.052*smoothstep(0.,1.,t),abs(p.y+.08)-.92)*.9,1); return r; }
Mat mat(vec3 p,vec3 n){ return M(vec3(.72,.72,.74),.3+fbm(p*30.)*.1,1.); }`);
add('ice', `
float map(vec3 p){ float r=1e5; p.xz*=R(.6); p.xy*=R(.08); p.yz*=R(.1); U(rbox(p,vec3(.66,.6,.66),.13),1); return r; }
Mat mat(vec3 p,vec3 n){ return G(vec3(.68,.88,.98),.04); }`, { spp: 400, shadow: .35 });
add('torch', `
float map(vec3 p){ float r=1e5; p.xy*=R(.28); p.xz*=R(.3); vec3 q=p.yxz; U(cyl(q+vec3(0,.28,0),.56,.22,.03),1); float t=clamp((p.x-.28)/.3,0.,1.); float hd=max(length(p.yz)-(.22+t*.14),max(.28-p.x,p.x-.58)); U(hd,2); U(cyl(vec3(p.y,p.x-.6,p.z),.04,.38,.01),2); U(max(length(p.yz)-.3,abs(p.x-.61)-.012),3); U(rbox(p-vec3(-.2,.22,0),vec3(.1,.035,.06),.02),4); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==3) return E(vec3(1.),vec3(10.,8.5,4.5)); if(gM==2) return M(vec3(.75,.76,.8),.22,1.); if(gM==4) return M(vec3(.9,.2,.12),.4,0.); return M(vec3(.08,.08,.1),.42,0.); }`);
add('pot', `
float map(vec3 p){ float r=1e5; p.y+=.28; float rr=length(p.xz); float body=max(rbox(vec3(rr-.0,p.y,0.),vec3(.76,.48,1.),.1),-.0); float shell=max(abs(rr-.72)-.03,abs(p.y)-.46); U(smin(shell,max(rr-.72,abs(p.y+.44)-.03),.01)-.01,1); U(tor((p-vec3(0,.46,0)),.74,.025),1); U(max(rr-.68,abs(p.y-.28)-.01)-.0,3); for(int i=0;i<2;i++){ float s=i==0?1.:-1.; vec3 h=p-vec3(s*.86,.3,0); U(tor(h.xzy,.1,.022),1);} return r; }
Mat mat(vec3 p,vec3 n){ if(gM==3) return G(vec3(.45,.78,.94),.02); return M(vec3(.82,.83,.86),.2,1.); }`);
add('soap', `
float bub(vec3 p,float r_){ return abs(sph(p,r_))-.004; }
float map(vec3 p){ float r=1e5; p.xz*=R(.45); p.y+=.5; U(rbox(p-vec3(0,0,0),vec3(.68,.25,.44),.22),1); vec3 b=p; U(sph(b-vec3(-.34,.62,0),.16),2); U(sph(b-vec3(.1,.86,.1),.12),2); U(sph(b-vec3(.42,.58,0),.2),2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return G(vec3(.95,.97,1.),.02); return M(vec3(.96,.72,.78),.32,0.); }`);
add('tap', `
float map(vec3 p){ float r=1e5; p.xz*=R(.3); p.x+=.1; p.y-=.0; U(cyl(vec3(p.y-.2,p.x+.65,p.z),.1,.14,.02),1); U(cap(p,vec3(-.6,.2,0),vec3(.28,.2,0),.1),1); vec3 c=p-vec3(.28,.0,0); float k=length(vec2(length(c.xy)-.2,c.z))-.095; U(max(k,-max(c.x*-1.+.0,c.y)-.0),1); U(cyl(p-vec3(.48,-.14,0),.12,.11,.02),1); U(cyl(p-vec3(-.1,.42,0),.12,.04,.01),1); U(cyl(p-vec3(-.1,.56,0),.04,.15,.015),2); vec3 d=p-vec3(.48,-.58,0); float q=clamp(d.y/.24,0.,1.); U(smin(sph(d,.11),cap(d,vec3(0),vec3(0,.2,0),.012),.1),3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==3) return G(vec3(.35,.7,.95),.02); if(gM==2) return M(${BRASS},.2,1.); return M(vec3(.86,.87,.9),.1,1.); }`);
add('pencil', `
float map(vec3 p){ float r=1e5; p.xy*=R(-.75); p.xz*=R(.28); float a=atan(p.z,p.x); float k=abs(mod(a,1.0472)-.5236); float hex=length(p.xz)*cos(k)-.1; U(max(hex,max(p.y-.95,-.5-p.y)),1); float t=clamp((p.y+.95)/.45,0.,1.); U(max(length(p.xz)-.105*t,max(p.y+.5,-.95-p.y))*.85,2); U(cyl(p-vec3(0,1.0,0),.06,.105,.01),3); U(cap(p,vec3(0,1.06,0),vec3(0,1.14,0),.08),4); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==1) return M(vec3(.95,.62,.08),.28,0.); if(gM==2) return p.y<-.8?M(vec3(.08,.08,.09),.35,0.):M(vec3(.86,.7,.5),.7,0.); if(gM==3) return M(vec3(.8,.8,.82),.25,1.); return M(vec3(.9,.42,.5),.75,0.); }`);
add('magnet', `
float map(vec3 p){ float r=1e5; p.xy*=R(.2); p.xz*=R(.32); vec3 q=p-vec3(0,.2,0); float ar=max(abs(length(q.xy)-.5)-.2,max(abs(q.z)-.2,-q.y))-.02; float ls=rbox(vec3(abs(p.x)-.5,p.y+.28,p.z),vec3(.18,.48,.18),.02); U(min(ar,ls),1); return r; }
Mat mat(vec3 p,vec3 n){ if(p.y<-.45) return M(vec3(.8,.81,.84),.18,1.); return M(vec3(.78,.06,.07),.2,0.); }`);
add('lock', `
float map(vec3 p){ float r=1e5; p.y+=.28; p.xz*=R(.3); U(rbox(p,vec3(.62,.5,.26),.11),1); vec3 q=p-vec3(0,.5,0); U(max(tor(q.xzy,.36,.075),-q.y-.05),2); U(cap(q,vec3(-.36,-.05,0),vec3(-.36,0,0),.075),2); U(cap(q,vec3(.36,-.05,0),vec3(.36,0,0),.075),2); vec3 k=p-vec3(0,.04,.25); U(max(sph(k,.12),abs(k.z)-.02),3); U(rbox(k-vec3(0,-.15,0),vec3(.04,.12,.02),.01),3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.82,.83,.86),.15,1.); if(gM==3) return M(vec3(.06,.05,.04),.5,0.); return M(${GOLD},.24,1.); }`);
add('door', `
float map(vec3 p){ float r=1e5; p.y+=.0; p.xz*=R(.25); float w=.72; float top=length(vec2(p.x,(p.y-.32)*.9))-.74; float shape=max(abs(p.x)-.74,-.0); shape=(p.y>.32)?top:max(abs(p.x)-.74,-(p.y+1.0)); U(max(shape,abs(p.z)-.09)-.015,1); float sh=(p.y>.32)?length(vec2(p.x,(p.y-.32)*.9))-.6:max(abs(p.x)-.6,-(p.y+.9)); U(max(sh,abs(p.z)-.12),2); U(max(abs(p.x)-.012,abs(p.z)-.13),3); U(sph(p-vec3(.12,-.1,.15),.05),3); U(sph(p-vec3(-.12,-.1,.15),.05),3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==3) return M(${GOLD},.22,1.); float g=smoothstep(.3,.7,fbm(vec3(p.x*18.,p.y*2.,p.z*2.))); if(gM==1) return M(mix(vec3(.3,.14,.06),vec3(.42,.22,.1),g),.5,0.); return M(mix(vec3(.42,.2,.08),vec3(.58,.32,.14),g),.42,0.); }`);
/* ---------- animals: far-off, featureless forms ---------- */
add('camel', `
float leg(vec3 p,vec3 a,vec3 b){ return cap(p,a,b,.05); }
float map(vec3 p){ float r=1e5; p.xz*=R(.35); p.y+=.05; float d=ell(p-vec3(.05,.08,0),vec3(.6,.26,.24)); d=smin(d,ell(p-vec3(.08,.34,0),vec3(.26,.28,.18)),.12); d=smin(d,cap(p,vec3(-.42,.1,0),vec3(-.74,.5,0),.09),.08); d=smin(d,ell(p-vec3(-.82,.56,0),vec3(.16,.08,.08)),.04); d=smin(d,leg(p,vec3(-.35,-.05,.12),vec3(-.36,-.95,.13)),.05); d=smin(d,leg(p,vec3(-.35,-.05,-.12),vec3(-.32,-.95,-.13)),.05); d=smin(d,leg(p,vec3(.42,-.05,.12),vec3(.46,-.95,.13)),.05); d=smin(d,leg(p,vec3(.42,-.05,-.12),vec3(.4,-.95,-.13)),.05); d=smin(d,cap(p,vec3(.62,.1,0),vec3(.72,-.22,0),.02),.03); U(d+fbm(p*22.)*.006,1); return r; }
Mat mat(vec3 p,vec3 n){ return M(mix(vec3(.5,.34,.18),vec3(.68,.5,.28),fbm(p*5.)),.8,0.); }`);
add('sheep', `
float map(vec3 p){ float r=1e5; p.xz*=R(.45); p.y+=.05; float d=1e5; for(int i=0;i<14;i++){ float a=float(i)*2.4; float y=sin(float(i)*1.3)*.2+.05; vec3 c=vec3(cos(a)*.42*(1.-float(i)*.015),y,sin(a)*.26); d=smin(d,sph(p-c,.27),.05); } U(d+vn(p*30.)*.012,1); U(ell(p-vec3(-.64,.14,0),vec3(.2,.17,.15)),2); U(ell(p-vec3(-.6,.3,.14),vec3(.05,.02,.1)),2); U(ell(p-vec3(-.6,.3,-.14),vec3(.05,.02,.1)),2); float l=1e5; for(int i=0;i<4;i++){ float sx=i<2?-.28:.3; float sz=mod(float(i),2.)<.5?.14:-.14; l=min(l,cap(p,vec3(sx,-.2,sz),vec3(sx,-.92,sz),.042)); } U(l,2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.12,.1,.09),.65,0.); return M(vec3(.95,.93,.87),.9,0.); }`);
add('bird', `
float map(vec3 p){ float r=1e5; p.xz*=R(.7); p.xy*=R(.12); float d=ell(p,vec3(.42,.2,.2)); d=smin(d,ell(p-vec3(-.38,.09,0),vec3(.13,.12,.12)),.08); d=smin(d,ell(p-vec3(-.53,.08,0),vec3(.08,.03,.03)),.02); d=smin(d,ell(p-vec3(.52,-.02,0),vec3(.32,.03,.1)),.04); U(d,1); vec3 w=vec3(p.x,p.y,abs(p.z)); float t=clamp(w.z/.92,0.,1.); float ww=max(max(abs(w.y-.08-t*.42+t*t*.18)-.018,abs(w.x-t*.14)-(.2*(1.-t*t)+.012)),max(-w.z,w.z-.92)); U(ww*.7,1); return r; }
Mat mat(vec3 p,vec3 n){ return M(mix(vec3(.1,.17,.3),vec3(.26,.42,.62),fbm(p*5.)),.42,0.); }`, { shadow: 0 });
add('fish', `
float map(vec3 p){ float r=1e5; p.xz*=R(.35); p.xy*=R(.08); float e=ell(p,vec3(.72,.34,.17)); float t=max(max(abs(p.z)-.012,abs(p.y)-(.06+max(0.,p.x-.6)*.9)),max(.6-p.x,p.x-1.02)); float f=max(max(abs(p.z)-.01,p.y-(.5-abs(p.x)*.5)),max(.15-p.y,abs(p.x)-.4)); U(smin(e,min(t,f),.03),1); return r; }
Mat mat(vec3 p,vec3 n){ float s=smoothstep(.0,.5,sin(p.x*60.+sin(p.y*40.)*2.)*.5+.5)*.12; return M(mix(vec3(.15,.55,.75),vec3(.9,.95,.95),smoothstep(.1,-.2,p.y))+s,.2,0.); }`, { shadow: 0 });
add('butterfly', `
float map(vec3 p){ float r=1e5; p.xz*=R(.5); p.yz*=R(.6); vec3 w=vec3(abs(p.x),p.y,p.z-abs(p.x)*.35); float u=ell(w-vec3(.48,.3,0),vec3(.48,.4,.015)); float l=ell(w-vec3(.34,-.32,0),vec3(.33,.3,.015)); U(min(u,l)*.7,1); U(cap(p,vec3(0,-.42,0),vec3(0,.34,0),.045),2); U(cap(p,vec3(0,.34,0),vec3(.16,.62,.05),.009),2); U(cap(p,vec3(0,.34,0),vec3(-.16,.62,.05),.009),2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.05,.04,.04),.5,0.); vec3 w=vec3(abs(p.x),p.y,0.); float e=smoothstep(.34,.4,length((w.xy-vec2(.48,.3))/vec2(.48,.4))*.4)+smoothstep(.3,.36,length((w.xy-vec2(.34,-.32))/vec2(.33,.3))*.36); vec3 c=mix(vec3(.98,.5,.06),vec3(.06,.04,.04),clamp(e,0.,1.)); float d=smoothstep(.06,.05,length(w.xy-vec2(.72,.25))); c=mix(c,vec3(1.),d); return M(c,.5,0.); }`, { shadow: .25 });
add('bee', `
float map(vec3 p){ float r=1e5; p.xz*=R(.55); p.xy*=R(.1); U(ell(p,vec3(.56,.34,.34)),1); U(sph(p-vec3(-.46,.04,0),.2),2); vec3 w=vec3(p.x,p.y,abs(p.z)); w.xz*=R(.5); U(ell(w-vec3(.1,.44,.24),vec3(.2,.022,.36)),3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.05,.04,.03),.5,0.); if(gM==3) return G(vec3(.92,.96,1.),.04); float b=step(.5,fract(p.x*3.1)); return M(mix(vec3(.05,.04,.03),vec3(.98,.68,.07),b),.42,0.); }`);
/* ---------- places ---------- */
const domeP = `float dome(vec3 p,float R0){ float r0=length(p.xz); float a=atan(p.z,p.x); float rb=abs(fract(a*16./6.2832)-.5)*.008; float d=length(vec3(p.x,p.y*.86,p.z))-R0+rb; return max(d,-p.y); }`;
add('masjid', `${domeP}
float map(vec3 p){ float r=1e5; p.xz*=R(.36); p.y+=.92; U(rbox(p-vec3(0,.04,0),vec3(1.,.04,.62),.015),4); U(rbox(p-vec3(0,.42,0),vec3(.72,.34,.42),.02),1); vec3 a=vec3(mod(p.x+.3,.3)-.15,p.y-.32,p.z-.42); float arch=max(abs(a.x)-.09,-a.y-.28); arch=(a.y>0.)?length(a.xy)-.09:arch; float ax=max(arch,abs(a.z)-.05); r=max(r,-ax); U(cyl(p-vec3(0,.85,0),.12,.36,.01),1); U(dome(p-vec3(0,.96,0),.38),2); U(sph(p-vec3(0,1.36,0),.03),3); U(cap(p,vec3(0,1.36,0),vec3(0,1.52,0),.009),3); for(int i=0;i<2;i++){ float s=i==0?-1.:1.; vec3 m=p-vec3(s*.86,0,.16); U(cyl(m-vec3(0,.72,0),.72,.075,.012),1); U(cyl(m-vec3(0,1.1,0),.02,.11,.01),4); U(cyl(m-vec3(0,1.47,0),.02,.09,.01),4); float tp=clamp((m.y-1.46)/.32,0.,1.); U(max(length(m.xz)-.08*(1.-tp),max(1.46-m.y,m.y-1.78))*.8,2); } return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(${GOLD},.22,1.); if(gM==3) return M(${GOLD},.2,1.); if(gM==4) return M(vec3(.72,.62,.42),.5,0.); return M(vec3(.95,.92,.84),.6,0.); }`, { cam: [0, .5, 5.2] });
add('kaaba', `
float map(vec3 p){ float r=1e5; p.y+=.2; p.xz*=R(.62); U(rbox(p,vec3(.68,.76,.68),.012),1); U(rbox(p-vec3(0,.34,0),vec3(.69,.09,.69),.002),2); U(rbox(p-vec3(.0,-.22,.685),vec3(.14,.26,.014),.004),2); U(rbox(p-vec3(0,-.78,0),vec3(.74,.03,.74),.012),3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(${GOLD},.26,1.); if(gM==3) return M(vec3(.82,.8,.74),.5,0.); return M(vec3(.018,.018,.022),.42,0.); }`);
add('mountain', `
float map(vec3 p){ float r=1e5; p.y+=1.02; float h=1.75-length(p.xz*vec2(.95,1.15))*1.9; h=max(h,.95-length((p.xz-vec2(.72,.2))*1.4)*1.6); h=max(h,.72-length((p.xz+vec2(.8,.1))*1.4)*1.5); float n=fbm(p*vec3(3.5,2.5,3.5))*.42+fbm(p*9.)*.09; U((p.y-h*max(1.,1.)+n-.1)*.42,1); return r; }
Mat mat(vec3 p,vec3 n){ float s=smoothstep(1.05,1.25,p.y+1.02+n.y*.1); vec3 c=mix(vec3(.25,.2,.17),vec3(.46,.37,.27),fbm(p*5.)); return M(mix(c,vec3(.95,.95,1.),s),.85,0.); }`, { shadow: 0, ground: -60 });
add('cave', `
float map(vec3 p){ float r=1e5; p.y+=1.02; float h=1.5-length(p.xz*vec2(.8,1.))*1.15; float n=fbm(p*vec3(3.,2.5,3.))*.46; float d=(p.y-h+n-.1)*.5; d=smax(d,-ell(p-vec3(0,.36,1.2),vec3(.4,.56,1.2)),.09); U(d,1); return r; }
Mat mat(vec3 p,vec3 n){ return M(mix(vec3(.24,.17,.12),vec3(.5,.38,.26),fbm(p*5.)),.9,0.); }`, { shadow: 0, ground: -60 });
add('well', `
float map(vec3 p){ float r=1e5; p.y+=.54; float rr=length(p.xz); float a=atan(p.z,p.x); float rows=floor(p.y*6.); float br=abs(fract(a*8./6.2832+rows*.5)-.5); float mort=smoothstep(.04,.0,abs(fract(p.y*6.)-.5)-.44)*.01+smoothstep(.46,.5,br)*.01; U(max(abs(rr-.56)-.1+mort,abs(p.y)-.48),1); U(max(rr-.52,abs(p.y-.3)-.02),3); for(int i=0;i<2;i++){ float s=i==0?-1.:1.; U(rbox(p-vec3(s*.62,.88,0),vec3(.045,.42,.045),.012),2);} vec3 t=p-vec3(0,1.3,0); U(rbox(t,vec3(.82,.03,.4),.01),4); t.y-=.14*(1.-abs(t.z)/.4); U(0.+1e5,4); U(cap(p,vec3(-.62,1.14,0),vec3(.62,1.14,0),.03),2); U(cap(p,vec3(0,1.14,0),vec3(0,.72,0),.01),5); U(cyl(p-vec3(0,.64,0),.08,.11,.012),2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.36,.2,.1),.6,0.); if(gM==3) return G(vec3(.2,.5,.7),.02); if(gM==4) return M(vec3(.46,.24,.12),.6,0.); if(gM==5) return M(vec3(.7,.6,.42),.8,0.); return M(mix(vec3(.45,.42,.38),vec3(.65,.6,.54),fbm(p*9.)),.8,0.); }`, { cam: [0, 1., 5.0], target: [0, .02, 0] });
add('tent', `
float map(vec3 p){ float r=1e5; p.y+=1.02; p.xz*=R(.5); float h=1.3-max(abs(p.x)*.95,abs(p.z)*1.45)*1.0; float d=(p.y-h); d=max(d,-p.y); d=smax(d,-max(abs(p.x)-.0-(1.-min(p.y,1.))*.2,max(-p.z,p.y-.9)),.01); U(d*.6,1); U(cyl(p-vec3(0,.68,.01),.68,.02,.01),2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.3,.18,.1),.7,0.); float st=step(.5,fract(p.x*2.4)); return M(mix(vec3(.62,.2,.14),vec3(.88,.78,.6),st),.8,0.); }`);
/* ---------- body ---------- */
add('hand', `
float fg(vec3 p,vec3 a,float l,float r_,float ang){ vec3 q=p-a; q.xy*=R(ang); return cap(q,vec3(0),vec3(0,l,0),r_); }
float map(vec3 p){ float r=1e5; p.y+=.32; p.yz*=R(.12); p.xz*=R(.1); float d=rbox(p,vec3(.38,.42,.075),.1); d=smin(d,cap(p,vec3(0,-.45,0),vec3(0,-.8,0),.24),.08); d=smin(d,fg(p,vec3(-.34,.32,0),.62,.08,.1),.05); d=smin(d,fg(p,vec3(-.12,.38,0),.78,.085,.02),.05); d=smin(d,fg(p,vec3(.11,.38,0),.8,.085,-.02),.05); d=smin(d,fg(p,vec3(.33,.33,0),.68,.08,-.1),.05); d=smin(d,fg(p,vec3(.42,-.1,.02),.52,.09,-.85),.08); U(d,1); return r; }
Mat mat(vec3 p,vec3 n){ return M(vec3(.82,.56,.4),.5,0.); }`);
add('foot', `
float map(vec3 p){ float r=1e5; p.y+=.96; p.xz*=R(.55); float d=ell(p-vec3(.0,.1,0),vec3(.72,.16,.3)); d=smin(d,ell(p-vec3(.46,.32,0),vec3(.3,.34,.24)),.2); d=smin(d,cap(p,vec3(.5,.4,0),vec3(.56,1.05,0),.2),.1); U(d,1); for(int i=0;i<5;i++){ float z=-.2+float(i)*.1; U(sph(p-vec3(-.74+abs(float(i)-.0)*.04,.08,z),.07-float(i)*.007),1);} return r; }
Mat mat(vec3 p,vec3 n){ return M(vec3(.82,.56,.4),.5,0.); }`);
add('ear', `
float map(vec3 p){ float r=1e5; p.xz*=R(.4); for(int i=0;i<3;i++){ float R_=.34+float(i)*.28; vec3 q=p-vec3(-.5,0,0); float d=abs(length(q.xy)-R_)-.035; float a=atan(q.y,q.x); d=max(d,abs(a)-.72); d=max(d,abs(q.z)-.045); U(d*.8,1);} U(sph(p-vec3(-.5,0,0),.15),2); return r; }
Mat mat(vec3 p,vec3 n){ return gM==2?M(vec3(.95,.5,.1),.2,0.):M(${GOLD},.2,1.); }`);
/* ---------- shapes, as glazed tiles ---------- */
const shape = (name, sd, col) => add(name, `
float s2(vec2 p){ ${sd} }
float map(vec3 p){ float r=1e5; p.yz*=R(.52); p.xz*=R(.32); float d=s2(p.xy); vec2 w=vec2(d,abs(p.z)-.14); U(min(max(w.x,w.y),0.)+length(max(w,0.))-.05,1); return r; }
Mat mat(vec3 p,vec3 n){ return M(${col},.12,0.); }`);
shape('circle', 'return length(p)-.76;', 'vec3(.86,.14,.3)');
shape('square', 'vec2 q=abs(p)-.66; return length(max(q,0.))+min(max(q.x,q.y),0.);', 'vec3(.1,.32,.8)');
shape('rect', 'vec2 q=abs(p)-vec2(.86,.48); return length(max(q,0.))+min(max(q.x,q.y),0.);', 'vec3(.08,.56,.3)');
shape('triangle', 'p.y+=.22; float k=1.732; p.x=abs(p.x)-.86; p.y=p.y+.86/k; if(p.x+k*p.y>0.) p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.; p.x-=clamp(p.x,-1.72,0.); return -length(p)*sign(p.y);', 'vec3(.92,.42,.05)');
shape('hexagon', 'vec3 k=vec3(-.866,.5,.577); p=abs(p); p-=2.*min(dot(k.xy,p),0.)*k.xy; p-=vec2(clamp(p.x,-k.z*.72,k.z*.72),.72); return length(p)*sign(p.y);', 'vec3(.42,.2,.72)');
shape('octa', 'float a=atan(p.y,p.x); float k=abs(mod(a+.3927,.7854)-.3927); return length(p)*cos(k)-(.5+.32*(1.-k/.3927)*.0)-.0+(k/.3927-.6)*.18;', 'vec3(.96,.68,.2)');

/* ---------- base-ten blocks and maths things ---------- */
const CUBELET = `float cube(vec3 p){ return rbox(p,vec3(.098),.012); }`;
add('b-one', `${CUBELET}
float map(vec3 p){ float r=1e5; p.y+=.16; p.yz*=R(.0); p.xz*=R(.62); p*=.28; U(cube(p)/.28*.28,1); return r/.28; }
Mat mat(vec3 p,vec3 n){ return M(vec3(.92,.42,.06),.3,0.); }`);
add('b-ten', `
float map(vec3 p){ float r=1e5; p.xz*=R(.5); p.xy*=R(-.12); float q=p.y; float c=clamp(round(q/.19),-4.,5.)-.5; vec3 s=vec3(p.x,p.y-c*.19,p.z); U(rbox(s,vec3(.09),.012),1); return r; }
Mat mat(vec3 p,vec3 n){ return M(vec3(.95,.68,.14),.32,0.); }`, { fov: 28 });
add('b-hundred', `
float map(vec3 p){ float r=1e5; p.xz*=R(.5); p.yz*=R(.55); vec2 g=clamp(round((p.xy+.085)/.17)-.0,-4.,5.); vec3 s=vec3(p.x-(g.x-.5)*.17,p.y-(g.y-.5)*.17,p.z); U(rbox(s,vec3(.08,.08,.08),.012),1); return r; }
Mat mat(vec3 p,vec3 n){ return M(vec3(.16,.38,.86),.3,0.); }`);
add('plate', `
float map(vec3 p){ float r=1e5; float rr=length(p.xz); float h=.0+.34*smoothstep(.62,1.,rr)*smoothstep(0.,1.,rr); U(max(abs(p.y-h)-.022,rr-1.)*.7,1); U(tor(p-vec3(0,.34,0),1.,.022),2); U(tor(p-vec3(0,.018,0),.66,.006),2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(${GOLD},.2,1.); return M(vec3(.95,.93,.88),.12,0.); }`, { cam: [0, 5.2, 2.2], target: [0, 0, 0], fov: 25, ground: -.1, shadow: .4, w: 768, h: 768 });
add('bulb', `
float map(vec3 p){ float r=1e5; p.y-=.14; float d=sph(p-vec3(0,.2,0),.56); d=smin(d,cyl(p+vec3(0,.42,0),.2,.22,.02),.18); U(abs(d)-.006,2); U(tor((p-vec3(0,.14,0)).xzy,.1,.009),3); U(cap(p,vec3(-.1,.14,0),vec3(-.05,-.42,0),.007),4); U(cap(p,vec3(.1,.14,0),vec3(.05,-.42,0),.007),4); float rg=sin(p.y*42.)*.012; U(cyl(p+vec3(0,.72,0),.2,.22,.02)+rg,4); U(cyl(p+vec3(0,.96,0),.05,.11,.02),5); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return G(vec3(.98,.98,.98),.01); if(gM==3) return E(vec3(1.),vec3(9.,5.,1.5)); if(gM==4) return M(vec3(.78,.78,.8),.3,1.); return M(vec3(.05,.05,.05),.5,0.); }`, { shadow: .4 });
add('battery', `
float map(vec3 p){ float r=1e5; p.xy*=R(1.2); p.xz*=R(.3); U(cyl(p,.72,.3,.03),1); U(cyl(p-vec3(0,.76,0),.05,.11,.02),2); U(cyl(p+vec3(0,.74,0),.02,.26,.01),2); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(vec3(.85,.85,.88),.2,1.); return p.y>.1?M(vec3(.95,.45,.06),.25,0.):M(vec3(.05,.05,.06),.22,0.); }`);
/* a textured moon face-on, for the phase simulator */
add('moonface', `
float cr(vec3 p,vec3 c,float s){ float d=length(normalize(p)-normalize(c))/s; return (smoothstep(1.,.78,d)*-.025+smoothstep(.8,1.05,d)*smoothstep(1.3,1.05,d)*.012); }
float map(vec3 p){ float r=1e5; float d=sph(p,.98); d-=cr(p,vec3(.3,.5,.8),.2)+cr(p,vec3(-.4,.1,.9),.13)+cr(p,vec3(.1,-.4,.9),.16)+cr(p,vec3(.6,-.1,.7),.09)+cr(p,vec3(-.2,.7,.6),.1)+cr(p,vec3(-.6,-.5,.6),.12)+cr(p,vec3(.5,.55,.65),.07); d-=(fbm(p*6.)-.5)*.012; U(d,1); return r; }
Mat mat(vec3 p,vec3 n){ float f=fbm(p*2.6); float mare=smoothstep(.42,.6,fbm(p*1.7+3.)); return M(mix(vec3(.3,.3,.3),vec3(.82,.8,.75),mare*.8+f*.2),.9,0.); }`, { shadow: 0, env: 0, envK: .9, sun: [0, 0, 1], sunCol: [.6, .6, .6], ground: -60, ortho: 1.02, cam: [0, 0, 6], target: [0, 0, 0], w: 640, h: 640 });

/* ---------- architecture: the carved door, and a niche for each room ---------- */
const ROSETTE = `
float star8(vec2 p){ float a=atan(p.y,p.x); float k=abs(mod(a+.3927,.7854)-.3927); return length(p)*cos(k)-.1-(.3927-k)*.0-.12+(k/.3927)*.02; }
float pat(vec2 p,float s){ p/=s; vec2 c=floor(p+.5); vec2 q=p-c; float st=star8(q*1.15)/1.15; float cross_=min(abs(q.x)-.0,abs(q.y)-.0); float a=atan(q.y,q.x); float k=abs(mod(a+.3927,.7854)-.3927); float rr=length(q); float e=rr*cos(k-.0)-.3-.14*(1.-k/.3927); return e*s; }`;
add('leaf-door', `${ROSETTE}
float map(vec3 p){ float r=1e5; float carve=smoothstep(-.012,.012,pat(p.xy,.56)); float inner=smoothstep(.0,.02,abs(pat(p.xy,.56))-.016); float z=.0-.012*(1.-inner); float d=rbox(p,vec3(.8,1.82,.09),.012); d=max(d,p.z-.09-z*0.-z); U(d,1);
 vec2 s=vec2(mod(p.x+.14,.28)-.14,mod(p.y+.14,.28)-.14); float edge=max(abs(p.x)-.74,abs(p.y)-1.76); U(max(sph(vec3(s,p.z-.09),.022),-1.)+(step(-.0,edge)<.5?1e5*0.+((edge<-.02&&edge>-.08)?0.:1.):0.)*1.,2);
 U(rbox(p-vec3(0,0,.1),vec3(.8,.018,.012),.004),2);
 return r; }
Mat mat(vec3 p,vec3 n){ if(gM==2) return M(${GOLD},.22,1.); float g=fbm(vec3(p.x*26.,p.y*2.6,p.z*5.)); vec3 c=mix(vec3(.16,.075,.03),vec3(.33,.17,.07),g); float ln=smoothstep(.02,.0,abs(pat(p.xy,.56))-.006); c=mix(c,vec3(.72,.5,.2),ln*.75); return M(c,.42-.1*ln,ln*.0); }`, { w: 720, h: 1600, ortho: 1.84, cam: [0, 0, 6], target: [0, 0, 0], ground: -60, shadow: 0, env: 0, envK: .6, sun: [-.4, .75, .9], spp: 200 });
const ARCH = `
float archD(vec2 p,float w,float h){ /* a pointed arch: two arcs meeting above a rectangle */
 float sp=h*.42; if(p.y<sp) return max(abs(p.x)-w,-(p.y+h)); vec2 q=vec2(abs(p.x)+w*.42,p.y-sp); return length(q)-w*1.42; }`;
const HUES = { emerald: [.05, .55, .34], rose: [.75, .12, .28], teal: [.04, .46, .56], sapphire: [.1, .24, .72], violet: [.34, .16, .68], amber: [.82, .38, .06], gold: [.8, .56, .16] };
Object.keys(HUES).forEach(function (h) {
  add('niche-' + h, `${ROSETTE}${ARCH}
float map(vec3 p){ float r=1e5; float o=archD(p.xy,.76,1.08); float frame=max(o,abs(p.z)-.14); float inner=archD(p.xy,.6,.94); frame=max(frame,-max(inner,-.4-p.z+.0-1.)); U(rbox(p-vec3(0,0,0),vec3(.0),.0)+1e3,1); U(max(frame,-(inner))-.0,1); U(max(inner,abs(p.z+.2)-.1),2); float gold=abs(archD(p.xy,.685,1.01))-.012; U(max(gold,abs(p.z-.145)-.012),3); float gold2=abs(inner)-.012; U(max(gold2,abs(p.z-.14)-.016),3); return r; }
Mat mat(vec3 p,vec3 n){ if(gM==3) return M(${GOLD},.2,1.); vec3 c=vec3(${HUES[h].join(',')}); if(gM==2){ float ln=smoothstep(.016,.0,abs(pat(p.xy+vec2(0,.1),.42))-.004); vec3 m=mix(c*.32,c*.62,smoothstep(-1.,.8,p.y)); Mat q=M(mix(m,vec3(1.,.74,.36),ln*.85),.35,ln>.5?1.:0.); q.e=c*(.65*exp(-1.2*length(p.xy-vec2(0,.05))))*1.3; return q; } float ln=smoothstep(.014,.0,abs(pat(p.xy,.3))-.003); return M(mix(c*.92,vec3(.98,.95,.86),ln*.7),.16,0.); }`, { group: 'niche', w: 640, h: 820, ortho: 1.15, cam: [0, 0, 6], target: [0, 0, 0], ground: -60, shadow: 0, sun: [-.45, .7, .9], spp: 220 });
});

/* ---------- the courtyard: one masjid, five lights ---------- */
const COURT = `${domeP}
float palm(vec3 p){ float d=cap(p+vec3(sin(p.y*.8)*.08,0,0),vec3(0,0,0),vec3(0,1.2,0),.035); vec3 h=p-vec3(.1,1.22,0); for(int i=0;i<7;i++){ vec3 q=h; q.xz*=R(float(i)*.9); float t=clamp(q.x/.62,0.,1.); float y=.1*t-.42*t*t; d=min(d,max(max(abs(q.y-y)-.008,abs(q.z)-(.05*(1.-t)+.004)),max(-q.x,q.x-.62))*.7); } return d; }
float map(vec3 p){ float r=1e5;
 U(p.y,6);                                      /* ground */
 float pool=rbox(p-vec3(0,.0,2.7),vec3(1.1,.02,.62),.01); U(pool,7);
 U(max(rbox(p-vec3(0,.05,2.7),vec3(1.2,.05,.72),.01),-rbox(p-vec3(0,.08,2.7),vec3(1.1,.06,.62),.01)),8);
 U(rbox(p-vec3(0,.72,0),vec3(2.1,.72,.9),.015),1);
 vec3 a=vec3(mod(p.x+.3,.6)-.3,p.y,p.z-.9); float ar=(a.y>.72)?length(a.xy-vec2(0,.72))-.22:max(abs(a.x)-.22,-a.y);
 r=max(r,-max(ar,abs(a.z)-.12)); if(max(ar,abs(a.z)-.1)<r){ }
 U(max(ar+.0,abs(a.z+.11)-.012),9);
 U(rbox(p-vec3(0,1.46,.0),vec3(2.14,.04,.94),.01),4);
 U(cyl(p-vec3(0,1.7,0),.26,.82,.01),1); U(cyl(p-vec3(0,1.98,0),.03,.86,.01),4);
 U(dome(p-vec3(0,2.0,0),.84),2); U(sph(p-vec3(0,2.98,0),.05),3); U(cap(p,vec3(0,2.98,0),vec3(0,3.28,0),.016),3);
 for(int i=0;i<4;i++){ float x=i<2?-1.2:1.2; float z=mod(float(i),2.)<.5?.0:.0; if(i>1&&i>9) continue; vec3 c=p-vec3(x,1.46,0.); if(i%2==0){ U(dome(c,.3),2); U(cyl(c+vec3(0,-.02,0),.03,.3,.01),4); U(cap(c,vec3(0,.34,0),vec3(0,.46,0),.008),3);} }
 for(int i=0;i<2;i++){ float s=i==0?-1.:1.; vec3 m=p-vec3(s*2.42,0,.5); U(cyl(m-vec3(0,1.72,0),1.72,.17,.02),1); U(cyl(m-vec3(0,2.5,0),.04,.25,.01),4); U(cyl(m-vec3(0,3.3,0),.04,.22,.01),4); float tp=clamp((m.y-3.32)/.62,0.,1.); U(max(length(m.xz)-.17*(1.-tp),max(3.32-m.y,m.y-3.94))*.8,2); }
 U(palm(p-vec3(-3.3,0,1.3)),10); U(palm((p-vec3(3.4,0,1.5))*.9)/.9,10); U(palm((p-vec3(-4.4,0,-.2))*.8)/.8,10); U(palm((p-vec3(4.5,0,.1))*.75)/.75,10);
 float hill=p.y-1.3+length(p.xz-vec2(.0,-9.))*.14+sin(p.x*.5)*.4+fbm(p*.7)*.5; U(hill*.6,11);
 return r; }
Mat mat(vec3 p,vec3 n){
 if(gM==2) return M(uTint.x>.5?vec3(1.,.74,.36):vec3(.9,.66,.32),.24,1.); if(gM==3) return M(vec3(1.,.74,.36),.2,1.); if(gM==4) return M(vec3(.68,.58,.42),.5,0.);
 if(gM==6){ float t=abs(fract(p.x*1.2)-.5)<.012||abs(fract(p.z*1.2)-.5)<.012?1.:0.; return M(mix(vec3(.62,.54,.42),vec3(.46,.4,.31),t),.34,0.); }
 if(gM==7) return M(vec3(.1,.28,.36),.02,0.);
 if(gM==8) return M(vec3(.78,.72,.6),.4,0.);
 if(gM==9){ if(uTint.y>.5) return E(vec3(.2),vec3(5.,2.9,1.1)*(.7+.3*fbm(p*3.))); return M(vec3(.08,.1,.13),.5,0.); }
 if(gM==10) return (p.y>.9&&abs(p.x)>0.)?M(vec3(.08,.3,.12),.6,0.):M(vec3(.25,.17,.1),.8,0.);
 if(gM==11) return M(mix(vec3(.5,.42,.32),vec3(.34,.3,.26),fbm(p*.8)),.95,0.);
 float a=fbm(p*vec3(3.,6.,3.)); return M(mix(vec3(.92,.88,.78),vec3(.82,.77,.66),a),.62,0.); }`;
const camC = { cam: [0, 1.15, 10.8], target: [0, 1.62, 0], fov: 34, w: 1280, h: 880, ground: -60, shadow: 0, env: 1, spp: 260, group: 'court' };
add('court-day', COURT, Object.assign({}, camC, { sun: [-.5, .85, .55], sunCol: [4.2, 3.9, 3.4], skyA: [.28, .5, .95], skyB: [.75, .85, .98], envK: 1.05, sunR: .03 }));
add('court-dawn', COURT, Object.assign({}, camC, { sun: [-.9, .16, .5], sunCol: [4.4, 2.5, 1.5], skyA: [.32, .36, .7], skyB: [1., .68, .5], envK: .72, sunR: .04 }));
add('court-gold', COURT, Object.assign({}, camC, { sun: [.8, .26, .55], sunCol: [5., 3.3, 1.7], skyA: [.34, .46, .78], skyB: [1., .8, .55], envK: .75, sunR: .04 }));
add('court-dusk', COURT, Object.assign({}, camC, { tint: [1, 1, 0], sun: [.95, .05, .2], sunCol: [2.6, 1.1, .7], skyA: [.14, .14, .36], skyB: [.82, .42, .36], envK: .62, sunR: .05, exp: 1.1 }));
add('court-night', COURT, Object.assign({}, camC, { tint: [1, 1, 0], sun: [.4, .7, .6], sunCol: [.36, .42, .62], skyA: [.03, .05, .13], skyB: [.08, .1, .22], envK: .8, sunR: .05, exp: 1.35, spp: 340 }));
