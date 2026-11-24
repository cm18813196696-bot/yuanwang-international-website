/* =====================================================================
   STAVSJÖ Design Studio — parametric products + environments.
   Units: metres, y = up.  STAVSJO_BUILD(productKey, params, envKey)
   returns a scene {parts, env, cam, info} for the STAVSJO3D viewer.
   ===================================================================== */
(function(){
const {G,mat}=window.STAVSJO3D;
const TAU=Math.PI*2;
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};

const FIN={brushed:()=>mat('brushed'),mirror:()=>mat('mirror'),matte:()=>mat('matte'),bronze:()=>mat('mirror',{col:[.88,.74,.56],rough:.1}),black:()=>mat('mirror',{col:[.16,.16,.17],rough:.16})};
const LED={ice:[.5,.88,1],warm:[1,.72,.42],aurora:[.3,1,.62],violet:[.68,.45,1],white:[1,1,1],off:null};
const FINISH_OPTS=[['brushed','Brushed'],['mirror','Mirror'],['matte','Matte'],['bronze','Champagne bronze'],['black','Black PVD']];
const LED_OPTS=[['ice','Ice blue'],['warm','Warm'],['aurora','Aurora'],['violet','Violet'],['off','Off']];
const fmt=n=>(Math.round(n*10)/10).toFixed(1);

/* ---------- placing helpers ---------- */
const place=(g,f,off=0,y=0)=>G.move(G.rotY(g,Math.atan2(-f.nz,f.nx)),f.x+f.nx*off,y,f.z+f.nz*off);
const at=(g,x,z,a=0,y=0)=>G.move(G.rotY(g,a),x,y,z);
const frameAt=(out,dirX,dirZ)=>{const fs=G.along(out,.05);let best=fs[0],bs=-1e9;for(const f of fs){const s=f.x*dirX+f.z*dirZ-Math.abs(f.x*dirZ-f.z*dirX)*.6;if(s>bs){bs=s;best=f}}return best};
const extent=o=>{let r=0;o.forEach(p=>r=Math.max(r,Math.hypot(p[0],p[1])));return r};

function ngon(n,R,fr=.12){const o=[];for(let k=0;k<n;k++){const a0=(k-.5)/n*TAU+Math.PI/n,a1=(k+.5)/n*TAU+Math.PI/n,c=[Math.cos(a0)*R,Math.sin(a0)*R];
  const p=[Math.cos((k-1.5)/n*TAU+Math.PI/n)*R,Math.sin((k-1.5)/n*TAU+Math.PI/n)*R],q=[Math.cos(a1)*R,Math.sin(a1)*R];
  for(let s=0;s<=6;s++){const t=s/6;const A=[c[0]+(p[0]-c[0])*fr*(1-t),c[1]+(p[1]-c[1])*fr*(1-t)],B=[c[0]+(q[0]-c[0])*fr*t,c[1]+(q[1]-c[1])*fr*t];
    const u=(1-t)*(1-t),v=2*t*(1-t),w=t*t;const P0=[c[0]+(p[0]-c[0])*fr,c[1]+(p[1]-c[1])*fr],P2=[c[0]+(q[0]-c[0])*fr,c[1]+(q[1]-c[1])*fr];
    o.push([u*P0[0]+v*c[0]+w*P2[0],u*P0[1]+v*c[1]+w*P2[1]])}
  const n2=12;for(let s=1;s<n2;s++){const t=s/n2;const P2=[c[0]+(q[0]-c[0])*fr,c[1]+(q[1]-c[1])*fr],Q0=[q[0]+(c[0]-q[0])*fr,q[1]+(c[1]-q[1])*fr];o.push([P2[0]+(Q0[0]-P2[0])*t,P2[1]+(Q0[1]-P2[1])*t])}}
  return o}
function steam(R,y0,h,alpha=.5){return [G.merge(G.lathe([[R*.82,y0],[R*.72,y0+h*.5],[R*.5,y0+h]],64),G.lathe([[R*.45,y0],[R*.5,y0+h*.6],[R*.3,y0+h]],48)),{type:7,alpha,foam:y0,patS:h}]}
function outlineOf(shape,L,W){
  if(shape==='hex')return ngon(6,L/2);
  if(shape==='oct')return ngon(8,L/2,.08);
  if(shape==='round')return G.circle(L/2,128);
  if(shape==='square')return G.rrect(L,L,Math.min(.4,L*.16),12);
  if(shape==='oval')return G.rrect(L,W,W/2-.002,28);
  if(shape==='rect')return G.rrect(L,W,.14,8);
  if(shape==='soft')return G.rrect(L,W,Math.min(W*.32,1),16);
  const c=[[1,.05],[.82,.72],[.25,.95],[-.45,.82],[-.98,.4],[-.92,-.45],[-.4,-.92],[.2,-.7],[.72,-.82]];
  return G.spline(c.map(p=>[p[0]*L/2,p[1]*W/2]),14);
}

/* ---------- props ---------- */
function lounger(){
  const fr=G.merge(G.box(.05,.26,1.9,-.3,.13,0),G.box(.05,.26,1.9,.3,.13,0),G.box(.66,.04,.05,0,.25,.92),G.box(.66,.04,.05,0,.25,-.92));
  const cu=G.merge(G.rbox(.6,.09,1.25,.05,0,.28,.3),G.move(G.rotX(G.rbox(.6,.08,.7,.05,0,0,0),-.7),0,.32,-.55));
  return {frame:fr,cushion:cu};
}
function umbrella(){
  return {metal:G.merge(G.cyl(.025,2.4,12),G.cyl(.24,.05,24)),
          canvas:G.lathe([[0,2.52],[.15,2.5],[1.4,2.14],[1.4,2.14],[1.4,2.09],[1.34,2.09],[0,2.44]],8)};
}
function planter(s=1){
  const pot=G.scale(G.lathe([[0,0],[.2,0],[.2,0],[.27,.55],[.29,.55],[.29,.58],[.24,.58],[.23,.5],[0,.5]],28),s);
  const lv=[];for(let k=0;k<12;k++){const a=rnd()*TAU,r=rnd()*.2,h=.66+rnd()*.42,sz=.15+rnd()*.1,t=.7+rnd()*.5;
    lv.push(G.colorAll(G.move(G.sphere(sz*s,12),Math.cos(a)*r*s,h*s,Math.sin(a)*r*s),[t,t,t]))}
  return {pot,leaves:G.merge(...lv)};
}
function pine(h){
  const leaf=[];const n=6;
  for(let k=0;k<n;k++){const y0=h*(.1+.14*k),r=h*(.24-.034*k),hh=h*.26;leaf.push(G.move(G.lathe([[0,-.02*h],[r,0],[r,0],[r*.3,hh*.6],[0,hh]],9),0,y0,0))}
  return {leaf:G.merge(...leaf),trunk:G.cyl(h*.025,h*.14,8)};
}
function rock(s){const ph=rnd()*9;return G.map(G.sphere(1,12),p=>{const k=1+.22*Math.sin(p[0]*3+ph)+.18*Math.cos(p[2]*4+ph*2)+.12*Math.sin(p[1]*5);return [p[0]*s*k,Math.max(-.1,p[1]*s*.62*k),p[2]*s*.85*k]})}
function lantern(h=.45){
  return {frame:G.merge(G.box(.2,.03,.2,0,.015,0),G.box(.2,.03,.2,0,h,0),G.box(.02,h,.02,-.09,h/2,-.09),G.box(.02,h,.02,.09,h/2,-.09),G.box(.02,h,.02,-.09,h/2,.09),G.box(.02,h,.02,.09,h/2,.09),G.tube([[-.06,h,0],[0,h+.1,0],[.06,h,0]],.008,6,4)),
          light:G.box(.13,h-.08,.13,0,h/2,0)};
}
function handrailLocal(H,inDepth){ // local: +x outward, origin on rim line
  const mk=z=>G.tube([[.16,0,z],[.16,H+.55,z],[.08,H+.72,z],[-.28,H+.72,z],[-.42,H+.5,z],[-.46,H-inDepth,z]],.021,12,8);
  return G.merge(mk(-.21),mk(.21));
}
function stepsLocal(H,n=3){const g=[];const rise=(H-.05)/n;for(let k=0;k<n;k++){const h=rise*(n-k);g.push(G.box(.3,h,.9,.17+k*.3,h/2,0))}return G.merge(...g)}

/* =====================================================================
   VESSEL — one welded shell following any outline
   ===================================================================== */
function vessel(o){
  const P=[],out=o.outline,H=o.H,fl=o.floorY,fin=FIN[o.finish]();
  const led=LED[o.led],glow=led?led.map(c=>c*.2):[0,0,0];
  if(H>.06)P.push([G.sweep(out,[[0,0],[0,0],[.006,.02],[0,.04],[0,H-.012],[.004,H],[0,H]]),fin]);
  let io;
  if(o.rim==='overflow'){
    const d=o.deckW||.1,ch=.12;
    P.push([G.sweep(out,[[0,H],[0,H],[-d,H],[-d,H],[-d,H-.03]]),mat('steel',{rough:.09})]);
    P.push([G.sweep(out,[[-d,H-.03],[-d,H-.075],[-d-ch,H-.075],[-d-ch,H-.03]]),mat('dark')]);
    const bar=G.box(ch-.012,.022,.007);
    P.push([G.merge(...G.along(out,.042).map(f=>place(G.merge(bar),f,-(d+ch/2),H-.026))),mat('steel',{rough:.22,col:[.84,.86,.88]})]);
    io=-(d+ch);
  }else{
    P.push([G.sweep(out,[[0,H],[0,H],[-.05,H],[-.05,H]]),mat('mirror')]);io=-.05;
  }
  const inner=mat('steel',{rough:.14,col:[.84,.87,.9]});
  const prof=[[io,H-.02],[io-.015,H-.05]];let fi;
  if(o.bench){const by=Math.max(fl+.32,H-.52);prof.push([io-.015,by],[io-.015,by],[io-.4,by-.012],[io-.4,by-.012],[io-.42,fl+.04],[io-.47,fl]);fi=-(io-.47);o._jetY=by+.2}
  else{prof.push([io-.015,fl+.05],[io-.06,fl]);fi=-(io-.06);o._jetY=fl+.45}
  P.push([G.sweep(out,prof),inner]);
  P.push([G.cap(out,fl,fi),inner]);
  if(o.jets){const per=G.along(out,.05).length*.05,n=Math.max(6,Math.round(per/.85));const disc=G.rotZ(G.cyl(.04,.012,16),Math.PI/2);
    P.push([G.merge(...G.along(out,per/n).map(f=>place(G.merge(disc),f,io-.02,o._jetY))),mat('mirror')])}
  const wy=o.rim==='overflow'?H-.036:H-.014;
  if(led)P.push([G.sweep(out,[[io-.017,wy-.3],[io-.017,wy-.26]]),{type:4,col:led,emis:2.6}]);
  if(o.water)P.push([G.cap(out,wy,-io+.012),mat('water',{col:o.waterCol||[.1,.52,.6],alpha:o.waterAlpha??.55,foam:o.foam||0,glow})]);
  if(o.ledBase&&led)P.push([G.sweep(out,[[.011,.035],[.011,.095]]),{type:4,col:led,emis:1.6}]);
  P.push([G.shadowOf(out,.55,.004),mat('shadow',{alpha:.5})]);
  return {parts:P,io,wy};
}

/* =====================================================================
   PRODUCT 1 — HOT TUB
   ===================================================================== */
function hotTub(p){
  const L=p.size,W=p.shape==='oval'?Math.min(p.width,L-.2):L,H=p.height;
  const out=outlineOf(p.shape,L,W);
  const v=vessel({outline:out,H,floorY:.1,rim:'overflow',bench:true,finish:p.finish,led:p.led,water:p.water,foam:p.jets?1:0,jets:true});
  const P=v.parts,f=frameAt(out,1,0);
  if(p.rail)P.push([place(handrailLocal(H,.35),f),mat('mirror')]);
  if(p.steps)P.push([place(stepsLocal(H),f),mat('brushed',{rough:.3})]);
  if(p.rail){const fl=G.cyl(.06,.012,24);P.push([G.merge(place(G.move(G.merge(fl),.16,0,-.21),f,0,H),place(G.move(G.merge(fl),.16,0,.21),f,0,H)),mat('mirror')])}
  P.push([G.merge(G.disc(.13,.101,32),G.lathe([[.13,.101],[.15,.106],[.15,.11]],32)),mat('dark',{col:[.3,.31,.33],rough:.3})]);
  if(p.steam&&p.water)P.push(steam(extent(out)-.25,H-.03,1.3,.55));
  if(p.surround==='deck'){const dh=Math.min(H-.08,.45);
    P.push([G.merge(G.sweep(out,[[.01,dh],[1.2,dh],[1.2,dh],[1.2,0]]),G.cap(G.circle(extent(out)+1.2,96),dh,0)),{type:0,col:[.58,.38,.22],rough:.55,pat:1,patS:.14}]);
    P.push([G.sweep(out,[[1.2,dh-.02],[1.21,dh-.06]]),{type:4,col:LED[p.led]||[1,.75,.45],emis:1.6}]);}
  else if(p.surround==='pebble'){const pb=[];G.along(out,.09).forEach((f,i)=>{for(let k=0;k<3;k++){const s=.06+rnd()*.06,t=.55+rnd()*.4,o=.12+k*.16+rnd()*.05;
      pb.push(G.colorAll(G.move(G.scale(G.sphere(1,10),s*1.3,s*.55,s),f.x+f.nx*o,s*.35,f.z+f.nz*o),[t,t*.98,t*.95]))}});
    P.push([G.merge(...pb),{type:0,col:[.85,.84,.82],rough:.45}]);
    P.push([G.sweep(out,[[.04,.004],[.62,.004]]),{type:0,col:[.25,.25,.24],rough:.95,pat:3}]);}
  const area=G.area(out),vol=area*.82*(H-.14)*.86;
  const led=LED[p.led];
  return {parts:P,hole:null,r:extent(out)+(p.steps?1:.2),
    light:led?{pl:[0,H+.5,0],plc:led.map(c=>c*.5)}:null,
    cam:{target:[0,H*.55,0],dist:Math.max(5,L*2.5),pitch:.3,yaw:.7,minD:L*1.1,maxD:L*5.5},
    info:{dims:(['round','hex','oct'].includes(p.shape)?`Ø ${fmt(L)} m`:`${fmt(L)} × ${fmt(W)} m`)+` · ${Math.round(H*100)} cm high`,vol:`≈ ${fmt(vol)} m³ water`,seats:`${Math.max(2,Math.round((G.along(out,.05).length*.05-2.2)/.8))} seats`}};
}

/* =====================================================================
   PRODUCT 2 — SWIMMING POOL (three edge styles)
   ===================================================================== */
function pool(p){
  const L=p.length,W=p.width,led=LED[p.led],glow=led?led.map(c=>c*.14):[0,0,0];
  if(p.style==='infinity')return infinityPool(p,L,W,led,glow);
  const P=[];let out,v,H,depth=1.35;
  if(p.style==='raised'){
    H=.55;out=outlineOf(p.shape==='rect'?'soft':p.shape,L,W);
    v=vessel({outline:out,H,floorY:H-depth,rim:'lip',finish:p.finish,led:p.led,ledBase:true,water:true,waterCol:[.06,.42,.55]});
    P.push(...v.parts);
    const fs=G.along(out,G.along(out,.05).length*.05/7);
    P.push([G.merge(...fs.map(f=>place(G.box(.03,.11,.24),f,.012,.3))),mat('dark')]);
    P.push([G.merge(...fs.map(f=>place(G.box(.032,.065,.19),f,.014,.3))),{type:4,col:[1,1,.95],emis:2.4}]);
    P.push([G.sweep(out,[[.02,.012],[.24,.012]]),mat('dark',{rough:.5})]);
    P.push([G.sweep(out,[[.24,.02],[.24,.02],[1.05,.02],[1.05,.02],[1.05,0]]),{type:0,col:[.72,.72,.7],rough:.7,pat:5}]);
  }else{
    H=.03;out=outlineOf(p.shape==='oval'?'oval':p.shape==='free'?'free':'soft',L,W);
    v=vessel({outline:out,H,floorY:H-depth,rim:'overflow',deckW:.02,finish:p.finish,led:p.led,water:true,waterCol:[.06,.44,.56]});
    P.push(...v.parts);
    P.push([G.sweep(out,[[0,.03],[0,.03],[.7,.03],[.7,.03],[.7,0]]),{type:0,col:[.8,.79,.76],rough:.6,pat:2,patS:.7}]);
    P.push([place(handrailLocal(.03,.9),frameAt(out,1,0)),mat('mirror')]);
  }
  return {parts:P,hole:out,r:extent(out)+1.1,
    light:led?{pl:[0,1.2,0],plc:led.map(c=>c*.35)}:null,
    cam:{target:[0,.2,0],dist:Math.max(9,L*1.35),pitch:.3,yaw:.5,minD:L*.6,maxD:L*2.6},
    info:{dims:`${fmt(L)} × ${fmt(W)} m · ${fmt(depth)} m deep`,vol:`≈ ${Math.round(G.area(out)*depth*.97)} m³ water`,seats:p.style==='raised'?'Raised wall with LED line':'Deck-level overflow'}};
}
function infinityPool(p,L,W,led,glow){
  const P=[],H=1.2,t=.05,fin=FIN[p.finish]();
  P.push([G.merge(G.box(L+2*t,H,t,0,H/2,-W/2-t/2),G.box(t,H,W,-L/2-t/2,H/2,0),G.box(t,H,W,L/2+t/2,H/2,0),G.box(L+2*t,H-.03,t,0,(H-.03)/2,W/2+t/2)),fin]);
  P.push([G.box(L,.04,W,0,.1,0),mat('steel',{rough:.14})]);
  P.push([G.merge(G.box(L+2*t+.1,.035,.16,0,H+.017,-W/2-.03),G.box(.16,.035,W+.05,-L/2-.03,H+.017,-.02),G.box(.16,.035,W+.05,L/2+.03,H+.017,-.02)),mat('mirror')]);
  if(led)P.push([G.merge(G.box(L-.2,.03,.02,0,H-.35,-W/2+.012),G.box(.02,.03,W-.2,-L/2+.012,H-.35,0),G.box(.02,.03,W-.2,L/2-.012,H-.35,0)),{type:4,col:led,emis:2.6}]);
  P.push([G.box(L,.001,W+.07,0,H-.022,.035),mat('water',{col:[.08,.5,.6],alpha:.5,glow})]);
  P.push([G.box(L+.06,H-.3,.002,0,.3+(H-.33)/2,W/2+t+.012),mat('water',{col:[.25,.55,.6],alpha:.2,wave:0})]);
  const tz=W/2+t+.3;
  P.push([G.merge(G.box(L+2*t,.3,.04,0,.15,tz+.3),G.box(.04,.3,.6,-L/2-t+.02,.15,tz),G.box(.04,.3,.6,L/2+t-.02,.15,tz),G.box(L+2*t,.03,.6,0,.015,tz)),mat('brushed')]);
  P.push([G.box(L+.04,.001,.56,0,.24,tz),mat('water',{col:[.08,.45,.55],alpha:.6,foam:.5,glow})]);
  // raised timber deck behind and at one end, with steps
  const dx0=-L/2-1.7,dx1=L/2+.12,dz0=-W/2-2.5,dz1=-W/2-.1;
  const deck={type:0,col:[.6,.4,.24],rough:.55,pat:1,patS:.13};
  P.push([G.merge(G.box(dx1-dx0,.06,dz1-dz0,(dx0+dx1)/2,H-.03,(dz0+dz1)/2),G.box(1.55,.06,W+.1,dx0+.775,H-.03,-.05+.05)),deck]);
  P.push([G.merge(G.box(dx1-dx0-.1,H-.06,dz1-dz0-.1,(dx0+dx1)/2,(H-.06)/2,(dz0+dz1)/2),G.box(1.45,H-.06,W,dx0+.775,(H-.06)/2,0)),{type:0,col:[.2,.14,.1],rough:.8,grain:1}]);
  const st=[];for(let k=0;k<6;k++){const h=H-.2*(k+1)+.0;if(h>.05)st.push(G.box(1.45,h,.3,dx0+.775,h/2,W/2+.15+k*.3))}
  P.push([G.merge(...st),{type:0,col:[.55,.37,.22],rough:.55,grain:1}]);
  const fr=[],cu=[];const n=Math.max(2,Math.min(4,Math.floor(L/1.6)));
  for(let k=0;k<n;k++){const l=lounger(),x=-L/2+.6+k*1.15;fr.push(G.move(l.frame,x,H,dz0+1.15));cu.push(G.move(l.cushion,x,H,dz0+1.15))}
  P.push([G.merge(...fr),{type:0,col:[.86,.86,.84],rough:.35}]);P.push([G.merge(...cu),{type:0,col:[.97,.97,.95],rough:.85}]);
  P.push([place(handrailLocal(H,.8),{x:L/2+t,z:-W/4,nx:1,nz:0}),mat('mirror')]);
  P.push([G.shadowOf(G.rrect(L+2.2,W+3,.3,4).map(q=>[q[0]-.7,q[1]-.9]),.7,.004),mat('shadow',{alpha:.45})]);
  return {parts:P,hole:null,r:Math.hypot(L/2+1.7,W/2+2.5),
    light:led?{pl:[0,H+.8,0],plc:led.map(c=>c*.3)}:null,
    cam:{target:[0,.7,0],dist:Math.max(10,L*1.5),pitch:.26,yaw:.55,minD:L*.7,maxD:L*2.6},
    info:{dims:`${fmt(L)} × ${fmt(W)} m · 1.1 m deep`,vol:`≈ ${Math.round(L*W*1.08)} m³ water`,seats:'Vanishing edge with catch trough'}};
}

/* =====================================================================
   PRODUCT 3 — DESIGNER TUB (sculpted)
   ===================================================================== */
function designerTub(p){
  const F={wave:{a:.95,b:.46,h0:.56,lift:.12,rip:1,pw:1},boat:{a:1.2,b:.4,h0:.5,lift:.32,rip:0,pw:1.55},pebble:{a:.9,b:.54,h0:.58,lift:.03,rip:.25,pw:1}}[p.form];
  const k=p.length/(2*F.a),a=F.a*k,b=F.b*(.6+.4*k),P=[],NU=180,NV=64,fin=FIN[p.finish]();
  const sg=(v,pw)=>Math.sign(v)*Math.pow(Math.abs(v),pw);
  const Ht=th=>F.h0+F.lift*Math.pow(Math.abs(Math.cos(th)),2.5)+F.rip*(.025*Math.sin(5*th+.6)+.015*Math.sin(9*th));
  const rip=(th,v)=>F.rip*(.022*Math.sin(v*17+2.2*Math.sin(2*th)+3*th)+.012*Math.sin(v*31-4*th));
  const sOut=v=>.6+.4*(1-Math.pow(1-v,2.4));
  const outer=(u,v)=>{const th=u*TAU,s=sOut(v)*(1+rip(th,v)*Math.min(1,v*4));return [a*s*Math.cos(th),v*Ht(th),b*s*sg(Math.sin(th),F.pw)]};
  const inner=(u,v)=>{const th=u*TAU,Hh=Ht(th),y=.13+v*(Hh-.13),s=(.55+.36*(1-Math.pow(1-v,2)))*(1+.8*rip(th,v+.3)*v);return [a*s*Math.cos(th),y,b*s*sg(Math.sin(th),F.pw)]};
  P.push([G.param(NU,NV,outer),fin]);P.push([G.param(NU,NV,inner),fin]);
  P.push([G.param(NU,4,(u,v)=>{const A=outer(u,1),B=inner(u,1),kk=Math.sin(v*Math.PI);return [A[0]+(B[0]-A[0])*v,A[1]+(B[1]-A[1])*v+.016*kk,A[2]+(B[2]-A[2])*v]}),fin]);
  const ring=(fn,v)=>Array.from({length:NU},(_,i)=>{const q=fn(i/NU,v);return [q[0],q[2]]});
  P.push([G.cap(ring(inner,0),.13),fin]);P.push([G.cap(ring(outer,0),0),mat('dark')]);
  if(p.water)P.push([G.cap(ring(inner,.72),.13+.72*(F.h0-.13)-.02,.004),mat('water',{col:[.2,.55,.6],alpha:.35,wave:.5})]);
  if(p.mixer)P.push([G.merge(G.tube([[-a-.3,0,-.25],[-a-.3,.98,-.25],[-a-.25,1.08,-.25],[-a-.07,1.08,-.25],[-a-.03,1.0,-.25]],.024),G.cyl(.06,.02,24,-a-.3,0,-.25)),mat('mirror')]);
  P.push([G.shadowOf(ring(outer,.35),.4,.003),mat('shadow',{alpha:.65})]);
  return {parts:P,hole:null,r:a+.5,light:null,
    cam:{target:[0,.36,0],dist:Math.max(3.8,a*4.4),pitch:.28,yaw:.55,minD:a*2.2,maxD:a*9},
    info:{dims:`${fmt(a*2)} × ${fmt(b*2)} m · ${Math.round((F.h0+F.lift)*100)} cm high`,vol:`≈ ${Math.round(a*b*Math.PI*.45*(F.h0-.13)*.72*1000/10)*10} L water`,seats:'One-piece hand-finished shell'}};
}

/* =====================================================================
   PRODUCT 7 — TRENDING SIGNATURE SPA (moon waterfall, drop, heart, cloud)
   ===================================================================== */
function crescent(R,cy,th0,th1,wMax,dMax){ // solid crescent arch in the x-y plane, cross-section ellipse
  return G.param(28,90,(u,v)=>{const th=th0+(th1-th0)*v,s=Math.sin(Math.PI*v);const w=.025+wMax*Math.pow(s,.9),d=.03+dMax*Math.pow(s,.7);
    const a=u*TAU,cx=Math.cos(th),cyy=Math.sin(th);const rr=R+Math.cos(a)*w;return [cx*rr,cy+cyy*rr,Math.sin(a)*d]},true);
}
function iconSpa(p){
  const R=p.size/2,H=.62,P=[],fin=FIN[p.finish](),led=LED[p.led],glow=led?led.map(c=>c*.25):[0,0,0];
  const out=G.circle(R,128);
  const v=vessel({outline:out,H,floorY:.1,rim:'lip',bench:true,finish:p.finish,led:p.led,ledBase:true,water:true,waterCol:[.1,.5,.6],waterAlpha:.45,foam:p.form==='moon'?.35:0});
  P.push(...v.parts);
  // rolled outer rim band
  P.push([G.sweep(out,[[.0,H-.02],[.035,H-.01],[.04,H+.02],[.0,H+.03]]),mat('mirror')]);
  let top=H,info='Signature sculpture';
  if(p.form==='moon'){
    const Rm=R*1.02,cy=H+.05;
    P.push([G.move(crescent(Rm*.95,Rm*.95+cy-.05,-Math.PI*.5+.15,Math.PI*.5+.5,.16,.11),-R*.35,0,0),fin]);
    // waterfall from the tip of the moon into the pool
    const tipX=-R*.35+Math.cos(Math.PI*.5+.5)*Rm*.95,tipY=Rm*.95+cy-.05+Math.sin(Math.PI*.5+.5)*Rm*.95;
    const fall=G.param(2,30,(u,vv)=>{const y=tipY-(tipY-H+.02)*vv,x=tipX+.35*vv*vv;return [x+(u-.5)*.02,y,(u-.5)*.34]},false);
    P.push([fall,mat('water',{col:[.75,.9,.95],alpha:.4,wave:0})]);
    P.push([G.move(G.disc(.32,0,32),tipX+.35,H-.01,0),mat('water',{col:[.9,.95,.97],alpha:.3,foam:1,wave:.4})]);
    if(led)P.push([G.move(G.scale(crescent(Rm*.95,Rm*.95+cy-.05,-Math.PI*.5+.15,Math.PI*.5+.5,.004,.004),1,1,1),-R*.35,-.004,0),{type:4,col:led,emis:1.4}]);
    top=tipY;info='Crescent arch with waterfall';
  }else if(p.form==='drop'){
    const Hd=R*2.6,prof=[];for(let k=0;k<=40;k++){const s=k/40,r=R*1.05*Math.pow(Math.sin(Math.PI*Math.pow(s,.75)),1.1)*(1-.15*s);prof.push([Math.max(.012,r),H-.1+s*Hd])}
    const shell=G.lathe(prof,72,.8,TAU-.8),inner=G.lathe(prof.map(q=>[Math.max(.008,q[0]*.95),q[1]]),72,.8,TAU-.8);
    P.push([shell,fin]);P.push([inner,fin]);
    // opening edges
    [.8,TAU-.8].forEach(a=>P.push([G.tube(prof.filter((_,i)=>i%2===0).map(q=>[Math.cos(a)*q[0]*.975,q[1],Math.sin(a)*q[0]*.975]),.028,10,3),fin]));
    if(led)P.push([G.move(G.disc(.06,0,20),0,H-.1+Hd*.86,0),{type:4,col:led,emis:3}]);
    top=H+Hd;info='Teardrop shell over the spa';
  }else if(p.form==='heart'){
    const pts=[];for(let k=0;k<=64;k++){const t=k/64*TAU;const x=16*Math.pow(Math.sin(t),3),y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);pts.push([x*.055*R,H+.75*R+y*.055*R+.85*R,0])}
    const heart=G.merge(G.tube(pts,.07*R,18,3),G.cyl(.05,.3,16,0,H-.05,0));
    P.push([G.move(G.rotY(heart,0),0,0,-R*.15),fin]);
    if(led)P.push([G.move(G.tube(pts.map(q=>[q[0],q[1],q[2]+.07*R]),.008,6,3),0,0,-R*.15),{type:4,col:led,emis:2.4}]);
    top=H+2*R;info='Mirror heart arch';
  }else{ // cloud
    const cl=[];for(let k=0;k<26;k++){const a=k/26*TAU+rnd()*.2,s=.22+rnd()*.2;cl.push(G.move(G.scale(G.sphere(1,22),s*1.25,s,s*1.1),Math.cos(a)*(R+.12),H-.05+rnd()*.12,Math.sin(a)*(R+.12)))}
    for(let k=0;k<10;k++){const a=rnd()*TAU,s=.3+rnd()*.25;cl.push(G.move(G.scale(G.sphere(1,22),s*1.3,s*.8,s),Math.cos(a)*(R+.45),.15+rnd()*.25,Math.sin(a)*(R+.45)))}
    const puff=g=>{const ys=[];for(let k=1;k<g.p.length;k+=3)ys.push(g.p[k]);const y0=Math.min(...ys),y1=Math.max(...ys);g.c=[];for(let k=0;k<g.p.length;k+=3){const t=.62+.38*(g.p[k+1]-y0)/((y1-y0)||1);g.c.push(t,t,t*1.02)}return g};
    P.push([puff(G.merge(...cl)),{type:4,col:[1,1,1],emis:.95,cloud:1}]);
    // floating canopy cloud with rain
    if(p.canopy){const cc=[];for(let k=0;k<14;k++){const a=rnd()*TAU,r=rnd()*R*.55,s=.3+rnd()*.25;cc.push(G.move(G.scale(G.sphere(1,22),s*1.3,s*.75,s),Math.cos(a)*r,H+2.1+rnd()*.25,Math.sin(a)*r))}
      P.push([puff(G.merge(...cc)),{type:4,col:[1,1,1],emis:.9,cloud:1}]);
      P.push([G.lathe([[R*.45,H+2],[R*.5,H-.02]],48),mat('water',{col:[.85,.92,.96],alpha:.07,wave:0})]);}
    // glass stairs
    const f={x:R+.1,z:0,nx:1,nz:0},st=[];for(let k=0;k<4;k++)st.push(G.box(.32,.04,.8,.25+k*.32,H-.14*(k+1)+.02,0));
    P.push([place(G.merge(...st),f),mat('glass',{alpha:.35})]);
    P.push(steam(R,H-.03,1.2,.55));top=H+(p.canopy?2.4:.4);info='Cloud surround with mist';
  }
  if(p.form!=='cloud'&&p.steam)P.push(steam(R-.1,H-.03,1,.35));
  return {parts:P,hole:null,r:R+.8,light:led?{pl:[0,H+.8,0],plc:led.map(c=>c*.45)}:null,
    cam:{target:[0,Math.min(top,3)*.4,0],dist:Math.max(6.5,R*5.4),pitch:.2,yaw:.9,minD:R*2,maxD:R*9},
    info:{dims:`Ø ${fmt(R*2)} m spa · ${fmt(top)} m overall`,vol:`≈ ${fmt(Math.PI*R*R*.45)} m³ water`,seats:info}};
}

/* =====================================================================
   PRODUCT 4 — GLASS-FRONT SPA
   ===================================================================== */
function glassSpa(p){
  const S=p.size,H=1,t=.14,P=[],led=LED[p.led],glow=led?led.map(c=>c*.3):[0,0,0];
  const clad={white:{type:0,col:[.95,.96,.97],rough:.35},steel:mat('brushed'),timber:{type:0,col:[.5,.32,.2],rough:.55,grain:1}}[p.clad];
  P.push([G.merge(G.box(S,H,t,0,H/2,-S/2+t/2),G.box(t,H,S,-S/2+t/2,H/2,0),G.box(t,H,S,S/2-t/2,H/2,0),
    G.box(.32,H,t,-S/2+.16,H/2,S/2-t/2),G.box(.32,H,t,S/2-.16,H/2,S/2-t/2),G.box(S,.12,t,0,.06,S/2-t/2),G.box(S,.06,t,0,H-.03,S/2-t/2)),clad]);
  const lin=mat('steel',{rough:.16,col:[.8,.86,.9]});
  P.push([G.merge(G.box(S-2*t,.02,S-2*t,0,.12,0),G.box(S-2*t,H-.15,.01,0,.55,-S/2+t+.005),G.box(.01,H-.15,S-2*t,-S/2+t+.005,.55,0),G.box(.01,H-.15,S-2*t,S/2-t-.005,.55,0),G.box(S-2*t,.45,.45,0,.35,-S/2+t+.22)),lin]);
  if(led){const ls=[];const n=Math.max(2,Math.round(S/.9));for(let k=0;k<n;k++)ls.push(G.move(G.rotX(G.cyl(.065,.01,20),Math.PI/2),-S/2+t+(S-2*t)*(k+.5)/n,.72,-S/2+t+.012));
    [[-S/2+t+.012,.5,.35],[S/2-t-.012,.5,.35]].forEach(([x,y,z])=>ls.push(G.move(G.rotZ(G.cyl(.065,.01,20),Math.PI/2),x,y,z)));
    P.push([G.merge(...ls),{type:4,col:led,emis:4}])}
  P.push([G.box(S-.64,H-.18,.04,0,.12+(H-.18)/2,S/2-t/2),mat('glass',{alpha:.08,glow})]);
  P.push([G.box(S-2*t,.001,S-2*t,0,H-.07,0),mat('water',{col:[.08,.45,.6],alpha:.55,foam:p.jets?.5:0,glow})]);
  P.push([G.box(S-.66,H-.27,.002,0,.12+(H-.27)/2,S/2-t-.03),mat('water',{col:[.1,.45,.6],alpha:.5,wave:0,glow})]);
  P.push([G.merge(G.box(S+.04,.03,.13,0,H+.015,-S/2+.06),G.box(.13,.03,S,-S/2+.06,H+.015,0),G.box(.13,.03,S,S/2-.06,H+.015,0),G.box(S+.04,.03,.13,0,H+.015,S/2-.06)),mat('steel',{rough:.1})]);
  const f={x:S/2,z:-S/5,nx:1,nz:0};
  if(p.steps)P.push([place(stepsLocal(H,4),f),mat('brushed',{rough:.3})]);
  P.push([place(handrailLocal(H,.4),f),mat('mirror')]);
  P.push([G.shadowOf(G.rrect(S,S,.05,3),.5,.003),mat('shadow',{alpha:.55})]);
  return {parts:P,hole:null,r:S*.75+(p.steps?1:.3),light:led?{pl:[0,1.4,S/2+1.2],plc:led.map(c=>c*.45)}:null,
    cam:{target:[0,.6,0],dist:Math.max(6,S*2.6),pitch:.34,yaw:.42,minD:S*1.3,maxD:S*5},
    info:{dims:`${fmt(S)} × ${fmt(S)} m · 100 cm high`,vol:`≈ ${fmt((S-.28)*(S-.28)*.8)} m³ water`,seats:'Acrylic viewing window'}};
}

/* =====================================================================
   PRODUCT 5 — SAUNA ROOM (cut-away)
   ===================================================================== */
function sauna(p){
  const Wd=p.width,Dp=p.depth,Ht=2.4,P=[];
  const T={aspen:[[.86,.7,.48],[.92,.78,.56]],cedar:[[.66,.43,.25],[.78,.55,.33]],thermo:[[.36,.22,.13],[.5,.33,.2]]}[p.wood],wood=T[0],light=T[1];
  const led=LED[p.led]||[1,.7,.4];
  const slats=(len,h,axis,fixed,y0,tint)=>{const n=Math.floor(len/.1),g=[];for(let k=0;k<n;k++){const t=.9+rnd()*.2,c=-len/2+.05+k*.1;
    g.push(G.colorAll(axis==='x'?G.box(.088,h,.03,c,y0+h/2,fixed):G.box(.03,h,.088,fixed,y0+h/2,c),tint.map(v=>v*t)))}return G.merge(...g)};
  const planksX=(x0,x1,z0,z1,y,tint)=>{const g=[],n=Math.floor((z1-z0)/.102);for(let k=0;k<n;k++){const t=.9+rnd()*.2;g.push(G.colorAll(G.box(x1-x0,.035,.09,(x0+x1)/2,y-.017,z0+.05+k*.102),tint.map(v=>v*t)))}return G.merge(...g)};
  P.push([G.merge(slats(Wd,Ht,'x',-Dp/2,0,wood),slats(Dp,Ht,'z',-Wd/2,0,wood),slats(Dp,Ht,'z',Wd/2,0,wood)),mat('wood',{col:[1,1,1]})]);
  P.push([G.merge(G.box(Wd+.14,Ht+.05,.05,0,Ht/2,-Dp/2-.04),G.box(.05,Ht+.05,Dp+.05,-Wd/2-.04,Ht/2,0),G.box(.05,Ht+.05,Dp+.05,Wd/2+.04,Ht/2,0)),{type:0,col:[.13,.1,.08],rough:.8}]);
  P.push([G.box(Wd+.14,.06,Dp+.1,0,.03,0),{type:0,col:wood.map(c=>c*.55),rough:.6,pat:1,patS:.12}]);
  const hs=p.tiers===3?[1.32,.88,.45]:[1.05,.55];const bd=.56,wash=[],strips=[],tops=[],skirts=[];
  const washQ=(w,y0,y1,z)=>{const g=G.empty();[[-w/2,y1,1],[w/2,y1,1],[w/2,y0,0],[-w/2,y0,0]].forEach(([x,y,c])=>{g.p.push(x,y,z);g.c.push(led[0]*c,led[1]*c*.85,led[2]*c*.7)});g.i.push(0,1,2,0,2,3);return g};
  hs.forEach((y,k)=>{const z0=-Dp/2+k*bd;tops.push(planksX(-Wd/2+.03,Wd/2-.03,z0,z0+bd+.04,y,light));
    const zs=z0+bd+.01;skirts.push(slats(Wd-.06,y-.1,'x',zs,0.06,wood));
    wash.push(washQ(Wd-.1,y-.42,y-.05,zs+.018));strips.push(G.box(Wd-.1,.014,.014,0,y-.045,zs+.02))});
  wash.push(washQ(Wd-.1,hs[0]+.2,hs[0]+.58,-Dp/2+.035));strips.push(G.box(Wd-.1,.014,.014,0,hs[0]+.58,-Dp/2+.05));
  P.push([G.merge(...tops),mat('wood',{col:[1,1,1],rough:.5})]);P.push([G.merge(...skirts),mat('wood',{col:[1,1,1]})]);
  P.push([G.merge(...wash),{type:4,col:[1,1,1],emis:1.2,wash:1}]);P.push([G.merge(...strips),{type:4,col:led,emis:4}]);
  P.push([G.box(Wd-.1,.09,.035,0,hs[0]+.45,-Dp/2+.06),mat('wood',{col:light})]);
  const hx=Wd/2-.42,hz=Dp/2-.4;
  P.push([G.merge(G.rbox(.5,.75,.42,.04,hx,.06,hz),G.box(.56,.04,.48,hx,.83,hz)),mat('dark',{col:[.18,.18,.19],rough:.45})]);
  const st=[];for(let k=0;k<26;k++){const s=.05+rnd()*.03,t=.22+rnd()*.2;st.push(G.colorAll(G.move(G.scale(G.sphere(1,8),s,s*.8,s),hx-.2+rnd()*.4,.86+rnd()*.06,hz-.17+rnd()*.34),[t,t,t*1.02]))}
  P.push([G.merge(...st),{type:0,col:[1,1,1],rough:.8}]);
  P.push([G.merge(G.move(G.lathe([[0,0],[.14,0],[.14,0],[.17,.24],[.17,.24],[.155,.24],[.125,.03],[0,.03]],24),hx-.75,.06,hz),G.move(G.tube([[0,.2,0],[0,.3,-.1],[0,.42,-.3]],.012,8,4),hx-.75,.06,hz)),mat('wood',{col:[.78,.58,.36]})]);
  P.push([G.merge(G.rbox(.55,.04,.36,.03,-Wd/4,hs[0],-Dp/2+.3),G.rbox(.55,.04,.36,.03,Wd/4,hs[0],-Dp/2+.3)),{type:0,col:[.95,.94,.9],rough:.9}]);
  if(p.glass){const dw=.8,gx=-Wd/2+.55;
    P.push([G.merge(G.box(Wd-dw-.3,Ht-.1,.012,(Wd/2+gx+dw/2)/2+.1,Ht/2,Dp/2),G.box(dw,2.0,.012,gx,1.03,Dp/2+.02)),mat('glass',{alpha:.1})]);
    P.push([G.merge(G.box(Wd+.14,.05,.05,0,Ht,Dp/2),G.box(.04,Ht,.04,-Wd/2-.02,Ht/2,Dp/2),G.box(.04,Ht,.04,Wd/2+.02,Ht/2,Dp/2),G.box(.03,.35,.03,gx+dw/2-.08,1.05,Dp/2+.05)),mat('dark',{col:[.12,.12,.13]})])}
  P.push([G.shadowOf(G.rrect(Wd+.2,Dp+.2,.05,3),.5,.003),mat('shadow',{alpha:.5})]);
  return {parts:P,hole:null,r:Math.hypot(Wd/2,Dp/2)+.3,light:{pl:[0,1.9,.3],plc:led.map(c=>c*.9),force:true},
    cam:{target:[0,1.0,-.1],dist:Math.max(6,Wd*1.9),pitch:.26,yaw:.28,minD:Wd*.9,maxD:Wd*3.6},
    info:{dims:`${fmt(Wd)} × ${fmt(Dp)} m · 2.4 m high`,vol:`${p.tiers} bench tiers`,seats:`${Math.round(Wd/.6)*(p.tiers-1)}–${Math.round(Wd/.6)*p.tiers} seats`}};
}


/* =====================================================================
   PRODUCT 6 — HYDROMASSAGE LOUNGE POOL (bubble beds, neck jets, fountain)
   ===================================================================== */
function bed(){ // reclining hydromassage bed, length along +x (feet at x=0)
  const prof=[[0,.0],[.55,-.04],[1.05,.02],[1.35,.22],[1.55,.42],[1.68,.52]],segs=[];
  for(let k=0;k<prof.length-1;k++){const a=prof[k],b=prof[k+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);
    segs.push(G.move(G.rotZ(G.rbox(L+.06,.09,.66,.03,0,-.045,0),ang),(a[0]+b[0])/2,(a[1]+b[1])/2,0))}
  const pillow=G.move(G.rotZ(G.rbox(.24,.1,.5,.05,0,0,0),.6),1.6,.56,0);
  const holes=[];for(let i=0;i<5;i++)for(let j=0;j<4;j++){holes.push(G.move(G.disc(.016,0,10),.2+i*.17,.003+(i>3?.03:0)-.03*(i<2?0:0),-.2+j*.13))}
  const frame=G.merge(G.box(.5,.32,.6,.4,-.2,0),G.box(.4,.4,.6,1.35,-.08,0));
  return {shell:G.merge(...segs),pillow,frame,holes:G.merge(...holes)};
}
function loungePool(p){
  const R=p.size/2,H=.75,P=[],out=G.circle(R,160),fin=FIN[p.finish]();
  const v=vessel({outline:out,H,floorY:H-.82,rim:'lip',finish:p.finish,led:p.led,water:p.water,waterCol:[.12,.55,.62],waterAlpha:.32,foam:p.jets?.22:0,ledBase:false});
  P.push(...v.parts);
  // stone coping ring
  P.push([G.sweep(out,[[0,H],[0,H+.04],[.38,H+.04],[.38,H+.04],[.38,0]]),{type:0,col:[.9,.87,.8],rough:.4,pat:5}]);
  // beds around the wall
  const n=p.beds,sh=[],pi=[],fr=[],ho=[],nk=[],st=[];const y0=H-.62;
  for(let k=0;k<n;k++){const a=(k+.5)/n*TAU,b=bed(),rot=-a;const rr=R-.1;
    const T=g=>G.move(G.rotY(g,rot),Math.cos(a)*(rr-1.75),y0,Math.sin(a)*(rr-1.75));
    sh.push(T(b.shell));pi.push(T(b.pillow));fr.push(T(b.frame));ho.push(T(b.holes));
    const hx=Math.cos(a)*(rr-.02),hz=Math.sin(a)*(rr-.02),ix=Math.cos(a)*(rr-.32),iz=Math.sin(a)*(rr-.32);
    if(p.neck){nk.push(G.tube([[hx,H+.04,hz],[hx,H+.62,hz],[(hx+ix)/2,H+.78,(hz+iz)/2],[ix,H+.55,iz]],.022,10,6));
      st.push(G.tube([[ix,H+.53,iz],[ix*.995,H+.25,iz*.995],[ix*.99,y0+.6,iz*.99]],.03,8,4))}}
  P.push([G.merge(...sh),{type:0,col:[.94,.94,.92],rough:.25}]);P.push([G.merge(...pi),{type:0,col:[.97,.97,.96],rough:.5}]);
  P.push([G.merge(...fr),{type:0,col:[.85,.85,.83],rough:.4}]);P.push([G.merge(...ho),mat('dark',{col:[.35,.36,.38]})]);
  if(p.neck){P.push([G.merge(...nk),fin]);P.push([G.merge(...st),mat('water',{col:[.6,.8,.85],alpha:.35,wave:0})])}
  // centre feature
  const c=p.centre;
  if(c==='fountain'){P.push([G.merge(G.cyl(.06,1.5,20,0,H-.82,0),G.move(G.lathe([[0,0],[.85,-.06],[.9,-.03],[.9,0],[.05,.06]],64),0,H+.72,0)),fin]);
    P.push([G.move(G.lathe([[.9,0],[.96,-.4],[1.02,-1.4]],64),0,H+.69,0),mat('water',{col:[.7,.85,.9],alpha:.22,wave:0})])}
  else if(c==='column'){P.push([G.lathe([[0,H-.82],[.55,H-.82],[.55,H+.05],[.62,H+.08],[.62,H+.16],[.45,H+.2],[.42,H+.25],[.38,H+4],[.48,H+4.2],[.55,H+4.4],[0,H+4.4]],48),{type:0,col:[.93,.89,.8],rough:.35}]);
    P.push([G.move(G.lathe([[.38,0],[.5,.14],[.62,.3],[.62,.36]],32),0,H+3.98,0),mat('mirror',{col:[.9,.72,.4],rough:.2})])}
  if(p.steam&&p.water)P.push(steam(R,H-.05,1.1,.4));
  return {parts:P,hole:null,r:R+.4,light:LED[p.led]?{pl:[0,H+.6,0],plc:LED[p.led].map(x=>x*.4)}:null,
    cam:{target:[0,H*.6,0],dist:Math.max(8,R*2.1),pitch:.5,yaw:.6,minD:R*1.2,maxD:R*4},
    info:{dims:`Ø ${fmt(R*2)} m · ${Math.round((H+.04)*100)} cm wall`,vol:`≈ ${fmt(Math.PI*R*R*.72)} m³ water`,seats:`${n} hydromassage beds`}};
}

/* =====================================================================
   ENVIRONMENTS
   ===================================================================== */
const around=(n,r0,r1,fn)=>{for(let k=0;k<n;k++){const a=(k+rnd()*.7)/n*TAU,r=r0+rnd()*(r1-r0);fn(Math.cos(a)*r,Math.sin(a)*r,a,k)}};
function loungeSet(P,r,a0,n){const fr=[],cu=[];for(let k=0;k<n;k++){const a=a0+k*1.05/r,l=lounger(),x=Math.cos(a)*r,z=Math.sin(a)*r,rot=-a+Math.PI/2;fr.push(at(l.frame,x,z,rot));cu.push(at(l.cushion,x,z,rot))}
  P.push([G.merge(...fr),{type:0,col:[.8,.78,.74],rough:.4}]);P.push([G.merge(...cu),{type:0,col:[.96,.96,.94],rough:.85}])}
function lanterns(P,pts,col=[1,.72,.4]){const fr=[],li=[];pts.forEach(([x,z,h])=>{const l=lantern(h||.45);fr.push(at(l.frame,x,z,rnd()));li.push(at(l.light,x,z))});
  P.push([G.merge(...fr),mat('dark',{col:[.1,.1,.1]})]);P.push([G.merge(...li),{type:4,col,emis:1.5}])}
function planters(P,pts,leaf=[.2,.38,.15],pot=[.75,.74,.7]){const po=[],lv=[];pts.forEach(([x,z,s])=>{const pl=planter(s||1);po.push(at(pl.pot,x,z));lv.push(at(pl.leaves,x,z))});
  P.push([G.merge(...po),{type:0,col:pot,rough:.6}]);P.push([G.merge(...lv),{type:0,col:leaf,rough:.85}])}
function trees(P,n,r0,r1,snow){const lf=[],tr=[];around(n,r0,r1,(x,z)=>{const t=pine(4.5+rnd()*5),sh=.75+rnd()*.5;lf.push(G.colorAll(at(t.leaf,x,z,rnd()*6),[sh,sh,sh]));tr.push(at(t.trunk,x,z))});
  P.push([G.merge(...lf),{type:0,col:snow?[.5,.62,.66]:[.12,.26,.14],rough:.9}]);P.push([G.merge(...tr),{type:0,col:[.25,.17,.12],rough:.9}])}

/* Real-world settings. Each one is a photographed 360° HDR environment
   (see js/render3d.js) plus a textured ground pad that fades into the photo
   and a shadow catcher so the product's shadow lands on the real ground. */
const pad=(c,R,tex,extra)=>[G.ground(c.base,R,.003),Object.assign({type:0,col:[1,1,1],rough:1,tex,fade:[R*.55,R],ground:1},extra||{})];
const catcher=(c,a)=>[G.ground(c.base,60,.004),{type:8,alpha:a??.5,ground:1}];
const ENVS={
  zen(c){return {parts:[pad(c,c.r+2.6,'pebble',{col:[.72,.72,.7]}),catcher(c,.55)],env:{key:'zen'}}},
  studio(c){return {parts:[catcher(c,.45)],env:{key:'studio'}}},
  rotunda(c){return {parts:[pad(c,c.r+2.2,'marble'),catcher(c,.4)],env:{key:'rotunda'}}},
  roof(c){return {parts:[pad(c,c.r+3,'deck',{col:[.95,.9,.85]}),catcher(c,.45)],env:{key:'roof'}}},
  sea(c){return {parts:[pad(c,c.r+3,'deck'),catcher(c,.55)],env:{key:'sea'}}},
  forest(c){return {parts:[pad(c,c.r+2.6,'pebble'),catcher(c,.45)],env:{key:'forest'}}},
  snow(c){return {parts:[pad(c,c.r+3.2,'snow'),catcher(c,.5)],env:{key:'snow'}}},
  aurora(c){return {parts:[pad(c,c.r+2.6,'deck'),catcher(c,.4)],env:{key:'night'}}}
};
ENVS.night=ENVS.aurora;ENVS.hall=ENVS.rotunda;

/* =====================================================================
   PUBLIC API
   ===================================================================== */
const PRODUCTS=[
  {key:'icon',title:'Signature Spa',page:'designer-tubs',form:'Sculpture / designer tub',make:iconSpa,env:'zen',
   desc:'Our trending signature pieces: a round mirror-steel spa crowned by a crescent moon waterfall, a teardrop shell, a heart arch or a cloud.',
   defaults:{form:'moon',size:2.2,finish:'mirror',led:'warm',steam:true,canopy:true},
   controls:[{id:'form',label:'Signature form',type:'choice',options:[['moon','Moon waterfall'],['drop','Water drop'],['heart','Heart arch'],['cloud','Cloud']]},
     {id:'size',label:'Spa diameter',type:'range',min:1.6,max:3.2,step:.1,unit:'m'},
     {id:'finish',label:'Steel finish',type:'choice',options:FINISH_OPTS},{id:'led',label:'Lighting',type:'choice',options:LED_OPTS},
     {id:'canopy',label:'Rain cloud canopy',type:'toggle',when:p=>p.form==='cloud'},{id:'steam',label:'Hot spring steam',type:'toggle',when:p=>p.form!=='cloud'}]},
  {key:'lounge',title:'Hydromassage Lounge Pool',page:'hot-tubs',form:'Full hot spring / spa project',make:loungePool,env:'roof',
   desc:'Round spa pool with reclining bubble beds, neck-massage spouts and a centre fountain — as built in our hot spring hall projects.',
   defaults:{size:9,beds:8,centre:'fountain',finish:'mirror',led:'warm',neck:true,jets:true,steam:true,water:true},
   controls:[{id:'size',label:'Diameter',type:'range',min:7,max:14,step:.5,unit:'m'},{id:'beds',label:'Hydromassage beds',type:'choice',options:[[6,'6'],[8,'8'],[10,'10'],[12,'12']]},
     {id:'centre',label:'Centre feature',type:'choice',options:[['fountain','Umbrella fountain'],['column','Column'],['none','None']]},
     {id:'finish',label:'Steel finish',type:'choice',options:FINISH_OPTS},{id:'led',label:'Lighting',type:'choice',options:LED_OPTS},
     {id:'neck',label:'Neck-massage spouts',type:'toggle'},{id:'jets',label:'Bubble beds running',type:'toggle'},{id:'steam',label:'Hot spring steam',type:'toggle'},{id:'water',label:'Filled with water',type:'toggle'}]},
  {key:'tub',title:'Overflow Hot Tub',page:'hot-tubs',form:'Stainless steel hot tub / spa',make:hotTub,env:'rotunda',
   desc:'Free-standing welded spa with overflow grating, bench ring and hydro jets.',
   defaults:{shape:'round',size:2.6,width:1.9,height:.8,finish:'brushed',led:'ice',rail:true,steps:false,jets:true,water:true,steam:true,surround:'none'},
   controls:[{id:'shape',label:'Shape',type:'choice',options:[['round','Round'],['square','Square'],['oval','Oval'],['hex','Hexagon'],['oct','Octagon']]},
     {id:'surround',label:'Surround',type:'choice',options:[['none','Free-standing'],['deck','Timber deck'],['pebble','Pebble ring']]},
     {id:'size',label:'Diameter / length',type:'range',min:1.8,max:4,step:.1,unit:'m'},
     {id:'width',label:'Width',type:'range',min:1.6,max:3,step:.1,unit:'m',when:p=>p.shape==='oval'},
     {id:'height',label:'Wall height',type:'range',min:.7,max:1.05,step:.05,unit:'m'},
     {id:'finish',label:'Steel finish',type:'choice',options:FINISH_OPTS},{id:'led',label:'Lighting',type:'choice',options:LED_OPTS},
     {id:'jets',label:'Hydro jets running',type:'toggle'},{id:'steam',label:'Hot spring steam',type:'toggle'},{id:'rail',label:'Handrail',type:'toggle'},{id:'steps',label:'Entry steps',type:'toggle'},{id:'water',label:'Filled with water',type:'toggle'}]},
  {key:'pool',title:'Swimming Pool',page:'stainless-pools',form:'Stainless steel swimming pool',make:pool,env:'sea',
   desc:'Welded stainless pool in three edge styles: vanishing edge, raised LED wall or deck-level overflow.',
   defaults:{style:'infinity',shape:'oval',length:8,width:3.4,finish:'brushed',led:'ice'},
   controls:[{id:'style',label:'Edge style',type:'choice',options:[['infinity','Infinity edge'],['raised','Raised LED wall'],['flush','Deck-level']]},
     {id:'shape',label:'Outline',type:'choice',options:[['oval','Oval'],['soft','Soft rectangle'],['free','Freeform']],when:p=>p.style!=='infinity'},
     {id:'length',label:'Length',type:'range',min:5,max:14,step:.5,unit:'m'},{id:'width',label:'Width',type:'range',min:2.5,max:5,step:.1,unit:'m'},
     {id:'finish',label:'Steel finish',type:'choice',options:FINISH_OPTS},{id:'led',label:'Lighting',type:'choice',options:LED_OPTS}]},
  {key:'designer',title:'Designer Bathtub',page:'designer-tubs',form:'Sculpture / designer tub',make:designerTub,env:'studio',
   desc:'One-piece sculpted steel tub, hand-formed and hand-polished.',
   defaults:{form:'wave',length:1.9,finish:'mirror',water:false,mixer:true},
   controls:[{id:'form',label:'Form',type:'choice',options:[['wave','Wave'],['boat','Boat'],['pebble','Pebble']]},
     {id:'length',label:'Length',type:'range',min:1.6,max:2.4,step:.05,unit:'m'},
     {id:'finish',label:'Steel finish',type:'choice',options:FINISH_OPTS},{id:'water',label:'Filled with water',type:'toggle'},{id:'mixer',label:'Floor-standing mixer',type:'toggle'}]},
  {key:'glass',title:'Glass-Front Spa',page:'hot-tubs',form:'Stainless steel hot tub / spa',make:glassSpa,env:'roof',
   desc:'Steel-lined spa with acrylic viewing window, underwater lights and steel coping.',
   defaults:{size:2.6,clad:'white',led:'ice',jets:true,steps:true},
   controls:[{id:'size',label:'Size',type:'range',min:2,max:3.6,step:.1,unit:'m'},
     {id:'clad',label:'Surround',type:'choice',options:[['white','White composite'],['steel','Brushed steel'],['timber','Timber']]},
     {id:'led',label:'Lighting',type:'choice',options:LED_OPTS},{id:'jets',label:'Hydro jets running',type:'toggle'},{id:'steps',label:'Entry steps',type:'toggle'}]},
  {key:'sauna',title:'Sauna Room',page:'saunas',form:'Sauna / steam room',make:sauna,env:'snow',
   desc:'Timber sauna with tiered benches, hidden light lines and stone heater.',
   defaults:{width:3.4,depth:2.3,tiers:2,wood:'cedar',led:'warm',glass:false},
   controls:[{id:'width',label:'Width',type:'range',min:2.4,max:4.6,step:.1,unit:'m'},{id:'depth',label:'Depth',type:'range',min:2,max:3.2,step:.1,unit:'m'},
     {id:'tiers',label:'Bench tiers',type:'choice',options:[[2,'Two'],[3,'Three']]},
     {id:'wood',label:'Timber',type:'choice',options:[['aspen','Aspen'],['cedar','Cedar'],['thermo','Thermo-treated']]},
     {id:'led',label:'Light colour',type:'choice',options:[['warm','Warm'],['white','Neutral'],['ice','Ice blue'],['violet','Violet']]},
     {id:'glass',label:'Glass front & door',type:'toggle'}]}
];
const ENV_LIST=[['zen','Garden'],['studio','Studio'],['rotunda','Indoor pool room'],['roof','Rooftop dusk'],['sea','Beach'],['forest','Misty pines'],['snow','Snowy forest'],['aurora','Lakeside dusk']];

function build(key,params,envKey){
  seed=7;
  const pd=PRODUCTS.find(p=>p.key===key),p=Object.assign({},pd.defaults,params||{});
  const pr=pd.make(p);seed=99;
  const ev=ENVS[envKey||pd.env]({hole:pr.hole,base:pr.hole||G.circle(.04,48),r:pr.r});
  const env=Object.assign({},ev.env);let cam=pr.cam;
  if(ev.camMax){cam=Object.assign({},cam,{maxD:Math.min(cam.maxD,ev.camMax),dist:Math.min(cam.dist,ev.camMax)})}
  if(pr.light&&(pr.light.force||!env.plc||envKey==='aurora'&&false)){env.pl=pr.light.pl;env.plc=pr.light.plc}
  const parts=[...ev.parts];if(!pr.hole)parts.push([G.disc(.06,0,24),ev.parts[0][1]]);
  parts.push(...pr.parts);
  return {parts,env,cam,info:pr.info};
}
window.STAVSJO_PRODUCTS=PRODUCTS;window.STAVSJO_ENVS=ENV_LIST;window.STAVSJO_BUILD=build;
})();
