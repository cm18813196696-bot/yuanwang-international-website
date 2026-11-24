/* =====================================================================
   STAVSJÖ 3D — a small WebGL2 renderer for the product models.
   No libraries needed. Polished / brushed steel, animated water,
   glass, LED light strips, wood, contact shadows.
   ===================================================================== */
(function () {
'use strict';

/* ---------------- math ---------------- */
const V = {
  sub:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],
  add:(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],
  mul:(a,s)=>[a[0]*s,a[1]*s,a[2]*s],
  dot:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],
  cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
  norm:(a)=>{const l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l]}
};
function perspective(fov,asp,n,f){const t=1/Math.tan(fov/2);return new Float32Array([t/asp,0,0,0,0,t,0,0,0,0,(f+n)/(n-f),-1,0,0,2*f*n/(n-f),0])}
function lookAt(e,c,up){const z=V.norm(V.sub(e,c)),x=V.norm(V.cross(up,z)),y=V.cross(z,x);
  return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-V.dot(x,e),-V.dot(y,e),-V.dot(z,e),1])}
function mmul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s}return o}

/* ---------------- geometry ----------------
   A geometry is {p:[...], c:[...], i:[...]} (positions, colours, indices).
   Normals are computed smoothly; repeat a profile point to get a sharp edge. */
const G = {};
G.empty=()=>({p:[],c:[],i:[]});
G.merge=(...gs)=>{const o=G.empty();for(const g of gs){const b=o.p.length/3;o.p.push(...g.p);o.c.push(...g.c);for(const k of g.i)o.i.push(k+b)}return o};
G.colorAll=(g,col)=>{g.c=[];for(let k=0;k<g.p.length/3;k++)g.c.push(...col);return g};
G.map=(g,fn)=>{for(let k=0;k<g.p.length;k+=3){const q=fn([g.p[k],g.p[k+1],g.p[k+2]]);g.p[k]=q[0];g.p[k+1]=q[1];g.p[k+2]=q[2]}return g};
G.move=(g,x,y,z)=>G.map(g,p=>[p[0]+x,p[1]+y,p[2]+z]);
G.rotY=(g,a)=>{const c=Math.cos(a),s=Math.sin(a);return G.map(g,p=>[p[0]*c+p[2]*s,p[1],-p[0]*s+p[2]*c])};
G.rotX=(g,a)=>{const c=Math.cos(a),s=Math.sin(a);return G.map(g,p=>[p[0],p[1]*c-p[2]*s,p[1]*s+p[2]*c])};
G.rotZ=(g,a)=>{const c=Math.cos(a),s=Math.sin(a);return G.map(g,p=>[p[0]*c-p[1]*s,p[0]*s+p[1]*c,p[2]])};
G.scale=(g,x,y,z)=>G.map(g,p=>[p[0]*x,p[1]*(y??x),p[2]*(z??x)]);

/* grid of points rows x cols -> quads */
function gridGeo(rows,cols,pt,closeU,col){
  const g=G.empty();
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){g.p.push(...pt(r,c));g.c.push(...(col?col(r,c):[1,1,1]))}
  const cu=closeU?cols:cols-1;
  for(let r=0;r<rows-1;r++)for(let c=0;c<cu;c++){
    const a=r*cols+c,b=r*cols+(c+1)%cols,d=(r+1)*cols+c,e=(r+1)*cols+(c+1)%cols;
    g.i.push(a,d,b,b,d,e)}
  return g;
}
/* surface of revolution: profile = [[radius,y],...] */
G.lathe=(prof,seg=96,a0=0,a1=Math.PI*2)=>{
  const full=Math.abs(a1-a0-Math.PI*2)<1e-6, n=full?seg:seg+1;
  return gridGeo(prof.length,n,(r,c)=>{const a=a0+(a1-a0)*c/seg;return [prof[r][0]*Math.cos(a),prof[r][1],prof[r][0]*Math.sin(a)]},full);
};
/* sweep a 2D profile [[outwardOffset,y],...] around a closed outline [[x,z],...] */
G.sweep=(outline,prof,col)=>{
  const n=outline.length, nrm=outline.map((p,k)=>{const a=outline[(k-1+n)%n],b=outline[(k+1)%n];const dx=b[0]-a[0],dz=b[1]-a[1];const l=Math.hypot(dx,dz)||1;return [dz/l,-dx/l]});
  // make normals point outward
  let cx=0,cz=0;outline.forEach(p=>{cx+=p[0];cz+=p[1]});cx/=n;cz/=n;
  let s=0;outline.forEach((p,k)=>{s+=(p[0]-cx)*nrm[k][0]+(p[1]-cz)*nrm[k][1]});
  if(s<0)nrm.forEach(v=>{v[0]=-v[0];v[1]=-v[1]});
  return gridGeo(prof.length,n,(r,c)=>[outline[c][0]+nrm[c][0]*prof[r][0],prof[r][1],outline[c][1]+nrm[c][1]*prof[r][0]],true,col?(r,c)=>col(r,c,n):null);
};
/* flat cap for a (star-shaped) outline at height y */
G.cap=(outline,y,inset=0)=>{
  const g=G.empty();let cx=0,cz=0;outline.forEach(p=>{cx+=p[0];cz+=p[1]});cx/=outline.length;cz/=outline.length;
  g.p.push(cx,y,cz);g.c.push(1,1,1);
  outline.forEach(p=>{const dx=p[0]-cx,dz=p[1]-cz,l=Math.hypot(dx,dz)||1;g.p.push(p[0]-dx/l*inset,y,p[1]-dz/l*inset);g.c.push(1,1,1)});
  const n=outline.length;for(let k=0;k<n;k++)g.i.push(0,1+k,1+(k+1)%n);return g;
};
G.box=(w,h,d,x=0,y=0,z=0)=>{
  const g=G.empty(),X=w/2,Y=h/2,Z=d/2;
  const f=[[[-X,-Y,Z],[X,-Y,Z],[X,Y,Z],[-X,Y,Z]],[[X,-Y,-Z],[-X,-Y,-Z],[-X,Y,-Z],[X,Y,-Z]],[[-X,Y,Z],[X,Y,Z],[X,Y,-Z],[-X,Y,-Z]],
           [[-X,-Y,-Z],[X,-Y,-Z],[X,-Y,Z],[-X,-Y,Z]],[[X,-Y,Z],[X,-Y,-Z],[X,Y,-Z],[X,Y,Z]],[[-X,-Y,-Z],[-X,-Y,Z],[-X,Y,Z],[-X,Y,-Z]]];
  f.forEach((q,k)=>{q.forEach(v=>{g.p.push(v[0]+x,v[1]+y,v[2]+z);g.c.push(1,1,1)});const b=k*4;g.i.push(b,b+1,b+2,b,b+2,b+3)});
  return g;
};
/* rounded-corner box via sweep of a rounded rectangle */
G.rbox=(w,h,d,r,x=0,y=0,z=0)=>{const o=G.rrect(w,d,r,6);return G.move(G.merge(G.sweep(o,[[0,0],[0,0],[0,h],[0,h]]),G.cap(o,h),G.cap(o,0)),x,y,z)};
G.cyl=(r,h,seg=32,x=0,y=0,z=0)=>G.move(G.lathe([[0,0],[r,0],[r,0],[r,h],[r,h],[0,h]],seg),x,y,z);
G.sphere=(r,seg=24)=>{const p=[];for(let k=0;k<=seg/2;k++){const a=-Math.PI/2+Math.PI*k/(seg/2);p.push([Math.cos(a)*r+1e-5,Math.sin(a)*r])}return G.lathe(p,seg)};
G.disc=(r,y,seg=96)=>G.cap(Array.from({length:seg},(_,k)=>[Math.cos(k/seg*Math.PI*2)*r,Math.sin(k/seg*Math.PI*2)*r]),y);
/* tube along a path of points */
G.tube=(pts,r,seg=14,smooth=8)=>{
  // Catmull-Rom smoothing
  const P=[];for(let k=0;k<pts.length-1;k++){const p0=pts[Math.max(k-1,0)],p1=pts[k],p2=pts[k+1],p3=pts[Math.min(k+2,pts.length-1)];
    for(let s=0;s<smooth;s++){const t=s/smooth,t2=t*t,t3=t2*t;P.push([0,1,2].map(i=>.5*((2*p1[i])+(-p0[i]+p2[i])*t+(2*p0[i]-5*p1[i]+4*p2[i]-p3[i])*t2+(-p0[i]+3*p1[i]-3*p2[i]+p3[i])*t3)))}}
  P.push(pts[pts.length-1]);
  let up=[0,1,0];
  const rows=P.map((p,k)=>{const T=V.norm(V.sub(P[Math.min(k+1,P.length-1)],P[Math.max(k-1,0)]));if(Math.abs(V.dot(T,up))>.95)up=[1,0,0];const N=V.norm(V.cross(T,up)),B=V.cross(N,T);return {p,N,B}});
  const g=gridGeo(rows.length,seg,(ri,c)=>{const a=c/seg*Math.PI*2,R=rows[ri];return V.add(R.p,V.add(V.mul(R.N,Math.cos(a)*r),V.mul(R.B,Math.sin(a)*r)))},true);
  // end caps
  [0,rows.length-1].forEach(k=>{const b=g.p.length/3;g.p.push(...rows[k].p);g.c.push(1,1,1);for(let c=0;c<seg;c++)g.i.push(b,k*seg+c,k*seg+(c+1)%seg)});
  return g;
};
/* parametric surface fn(u,v)->[x,y,z], u wraps */
G.param=(nu,nv,fn,closeU=true)=>gridGeo(nv+1,closeU?nu:nu+1,(r,c)=>fn(c/nu,r/nv),closeU);
/* outlines */
G.rrect=(w,d,r,seg=8)=>{const o=[],cs=[[w/2-r,d/2-r,0],[-w/2+r,d/2-r,Math.PI/2],[-w/2+r,-d/2+r,Math.PI],[w/2-r,-d/2+r,Math.PI*1.5]];
  cs.forEach(([cx,cz,a0])=>{for(let k=0;k<=seg;k++){const a=a0+Math.PI/2*k/seg;o.push([cx+Math.cos(a)*r,cz+Math.sin(a)*r])}});return o};
G.spline=(ctrl,per=12)=>{const o=[],n=ctrl.length;for(let k=0;k<n;k++){const p0=ctrl[(k-1+n)%n],p1=ctrl[k],p2=ctrl[(k+1)%n],p3=ctrl[(k+2)%n];
  for(let s=0;s<per;s++){const t=s/per,t2=t*t,t3=t2*t;o.push([0,1].map(i=>.5*((2*p1[i])+(-p0[i]+p2[i])*t+(2*p0[i]-5*p1[i]+4*p2[i]-p3[i])*t2+(-p0[i]+3*p1[i]-3*p2[i]+p3[i])*t3)))}}return o};
/* soft contact shadow (alpha stored in colour.r) */
G.shadow=(w,d,soft=.6,y=.004,round=false)=>{
  const g=G.empty(),N=72,R=12,ex=round?2:8;
  g.p.push(0,y,0);g.c.push(1,1,1);
  for(let ring=1;ring<=R;ring++){const s=ring/R,hx=s*(w/2+soft),hz=s*(d/2+soft);
    const e=Math.max(0,(s*(w/2+soft)-w/2))/soft,al=Math.pow(Math.max(0,1-e),2.2);
    for(let k=0;k<N;k++){const a=k/N*Math.PI*2,c=Math.cos(a),sn=Math.sin(a);
      const x=Math.sign(c)*Math.pow(Math.abs(c),2/ex),z=Math.sign(sn)*Math.pow(Math.abs(sn),2/ex);
      g.p.push(x*hx,y,z*hz);g.c.push(al,al,al)}}
  for(let k=0;k<N;k++)g.i.push(0,1+k,1+(k+1)%N);
  for(let ring=1;ring<R;ring++){const b=1+(ring-1)*N,c=1+ring*N;for(let k=0;k<N;k++){const k1=(k+1)%N;g.i.push(b+k,c+k,b+k1,b+k1,c+k,c+k1)}}
  return g;
};

G.circle=(r,n=96)=>Array.from({length:n},(_,k)=>[Math.cos(k/n*Math.PI*2)*r,Math.sin(k/n*Math.PI*2)*r]);
G.ground=(outline,R,y)=>outline?G.sweep(outline,[[0,y],[R,y]]):G.disc(R,y,72);
G.area=o=>{let a=0;for(let k=0;k<o.length;k++){const p=o[k],q=o[(k+1)%o.length];a+=p[0]*q[1]-q[0]*p[1]}return Math.abs(a)/2};
/* evenly spaced frames along an outline: [{x,z,nx,nz,ang}] (n = outward normal) */
G.along=(o,step)=>{const n=o.length;let cx=0,cz=0;o.forEach(p=>{cx+=p[0];cz+=p[1]});cx/=n;cz/=n;const out=[];let acc=0;
  for(let k=0;k<n;k++){const p=o[k],q=o[(k+1)%n];const dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz);let nx=dz/L,nz=-dx/L;
    if((p[0]-cx)*nx+(p[1]-cz)*nz<0){nx=-nx;nz=-nz}
    while(acc<L){const t=acc/L;out.push({x:p[0]+dx*t,z:p[1]+dz*t,nx,nz,ang:Math.atan2(dz,dx)});acc+=step}acc-=L}
  return out};
/* soft shadow that follows an outline */
G.shadowOf=(o,soft=.5,y=.004)=>G.merge(G.cap(o,y),G.sweep(o,[[0,y],[soft*.5,y],[soft,y]],(r)=>r===0?[1,1,1]:r===1?[.35,.35,.35]:[0,0,0]));

/* ---------------- materials ---------------- */
const MAT = {
  mirror:  {type:1,col:[.93,.94,.96],rough:.035},
  steel:   {type:1,col:[.86,.88,.9],rough:.14},
  brushed: {type:1,col:[.82,.84,.87],rough:.26,brush:1},
  matte:   {type:1,col:[.74,.76,.79],rough:.5},
  dark:    {type:1,col:[.25,.26,.28],rough:.35},
  water:   {type:2,col:[.02,.35,.45],alpha:.55,wave:1},
  glass:   {type:3,col:[.85,.95,1],alpha:.12},
  white:   {type:0,col:[.9,.9,.88],rough:.5},
  wood:    {type:0,col:[.62,.4,.22],rough:.6,grain:1},
  shadow:  {type:5,alpha:.55}
};
const mat=(base,over)=>Object.assign({},MAT[base]||{},over||{});

/* ---------------- shaders ---------------- */
const VS=`#version 300 es
in vec3 aP;in vec3 aN;in vec3 aC;uniform mat4 uVP;out vec3 vP;out vec3 vN;out vec3 vC;
void main(){vP=aP;vN=aN;vC=aC;gl_Position=uVP*vec4(aP,1.);}`;
const FS=`#version 300 es
precision highp float;
in vec3 vP;in vec3 vN;in vec3 vC;out vec4 o;
uniform vec3 uEye;uniform float uT;uniform int uType,uPat,uSil;uniform vec3 uCol;uniform float uRough,uEmis,uAlpha,uFoam,uWave,uBrush,uGrain,uPatS;
uniform vec3 uSkyTop,uSkyHor,uGnd,uSun,uSunCol,uGlow,uPLp,uPLc,uSilC;
uniform float uExpo,uBox,uRoom,uCloud,uStars,uAurora,uFog0,uFog1,uSunGlow;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
vec3 lin(vec3 c){return pow(max(c,0.),vec3(2.2));}
float pines(float x){float id=floor(x),f=fract(x);float h=.03+.075*hash(vec2(id,3.));float tri=1.-abs(f-.5)*2.;return h*pow(tri,1.3)+.012*step(.2,tri)*fract(tri*5.)*h*6.;}
vec3 sky(vec3 d){
  float t=d.y;vec3 hor=lin(uSkyHor);
  vec3 c=t>0.?mix(hor,lin(uSkyTop),pow(clamp(t,0.,1.),.42)):mix(hor*.6,lin(uGnd),pow(clamp(-t*4.,0.,1.),.5));
  float az=atan(d.z,d.x);float sd=max(dot(d,uSun),0.);
  c+=lin(uSunCol)*(pow(sd,6.)*.18+pow(sd,48.)*.5)*uSunGlow;
  if(t>0.){
    if(uStars>0.){vec2 g=vec2(az*60.,t*95.);vec2 id=floor(g);float h=hash(id);float s=step(.975,h)*smoothstep(.45,.05,length(fract(g)-.5));c+=uStars*s*(.5+.5*sin(uT*1.5+h*90.))*vec3(.9,.95,1.)*1.5;}
    if(uAurora>0.){float n=noise(vec2(az*2.5+uT*.04,3.));float n2=noise(vec2(az*6.-uT*.03,9.));
      float y0=.07+.1*n+.04*n2;float band=smoothstep(0.,.03,t-y0)*smoothstep(.38,.0,t-y0);
      float rays=.45+.55*noise(vec2(az*55.+n*4.,uT*.25));
      c+=uAurora*band*rays*mix(vec3(.05,1.,.45),vec3(.35,.2,1.),smoothstep(.0,.34,t-y0))*1.5*smoothstep(.15,.6,n+n2*.5);}
    if(uCloud>0.){vec2 p=d.xz/(t+.14)*1.1+vec2(uT*.012,0.);float f=noise(p)*.5+noise(p*2.1+3.)*.25+noise(p*4.3)*.125+noise(p*8.9)*.07;
      float m=smoothstep(.48,.74,f)*uCloud*smoothstep(0.,.1,t);vec3 cc=mix(hor,vec3(1.),.55)+lin(uSunCol)*.35*pow(sd,3.);
      cc*=.8+.25*smoothstep(.55,.9,f);c=mix(c,cc,m*.92);}
    if(uSil==1){float tl=max(pines(az*30.),pines(az*19.+4.)*1.35);vec3 sc=mix(hor*.8,lin(uSilC),smoothstep(0.,.07,t));
      float far=.035+.03*noise(vec2(az*9.,2.));c=mix(c,mix(hor,lin(uSilC),.35),smoothstep(far+.004,far-.004,t)*.9);
      c=mix(c,sc,smoothstep(tl+.003,tl-.003,t));}
    else if(uSil==2){float h1=.09+.1*noise(vec2(az*1.7,1.))+.05*noise(vec2(az*5.,7.))+.02*noise(vec2(az*14.,2.));
      float h2=.05+.06*noise(vec2(az*2.6+9.,4.))+.025*noise(vec2(az*9.,5.));
      vec3 rock=lin(uSilC);float sn=smoothstep(h1*.45,h1*.8,t+.02*noise(vec2(az*40.,t*90.)));
      vec3 m1=mix(mix(rock,hor,.45),mix(vec3(.75,.8,.9)*(.05+length(lin(uSkyTop))*1.2),hor,.3),sn);
      c=mix(c,m1,smoothstep(h1+.003,h1-.003,t));c=mix(c,mix(rock*.7,hor,smoothstep(.06,0.,t)*.6),smoothstep(h2+.003,h2-.003,t));}
    else if(uSil==3){float x=az*34.;float id=floor(x),f=fract(x);float h=.03+.15*pow(hash(vec2(id,1.)),2.2);h*=step(f,.86);
      float x2=az*21.+.4;float h3=(.02+.1*pow(hash(vec2(floor(x2),5.)),2.))*step(fract(x2),.9);
      if(t<h3){vec3 b=mix(hor*.5,lin(uSilC)*1.6,smoothstep(0.,.06,t));c=mix(c,b,.85);}
      if(t<h){vec3 b=mix(hor*.35,lin(uSilC),smoothstep(0.,.05,t));vec2 w=vec2(f*7.,t*260.);vec2 wi=floor(w);
        float lit=step(.62,hash(wi+id*13.))*step(.2,fract(w.x))*step(.3,fract(w.y));
        c=b+lit*vec3(1.,.72,.36)*.9;}}
  }
  c+=uBox*4.*smoothstep(.955,.975,dot(d,normalize(vec3(.55,.62,.55))))*vec3(1.,.98,.95);
  c+=uBox*2.2*smoothstep(.94,.965,dot(d,normalize(vec3(-.75,.4,-.2))));
  c+=uBox*1.6*smoothstep(.9,.93,dot(d,normalize(vec3(.1,.9,-.4))));
  c+=uBox*1.1*smoothstep(.025,.0,abs(t-.16))*smoothstep(-.3,.5,d.x);
  if(uRoom>0.){float win=smoothstep(-.02,.06,sin(az*3.+.7)-.45)*smoothstep(.5,.3,abs(t-.1));
    float panel=.5+.5*smoothstep(-.1,.1,sin(az*11.));
    c=mix(c,c*mix(.4,1.,1.-smoothstep(.55,.25,abs(t-.05)))*(.8+.2*panel),uRoom)+uRoom*win*vec3(.7,.72,.75);}
  c+=lin(uSunCol)*6.*smoothstep(.9992,.9996,dot(d,uSun))*uSunGlow;
  return c;}
vec3 skyBlur(vec3 d){float t=d.y;vec3 c=t>0.?mix(lin(uSkyHor),lin(uSkyTop),t):mix(lin(uSkyHor)*.6,lin(uGnd),sqrt(-t));
  return c+uBox*.35*max(dot(d,normalize(vec3(.55,.62,.55))),0.)+lin(uSunCol)*.12*max(dot(d,uSun),0.)+uAurora*vec3(.004,.02,.014)*max(t,0.);}
vec3 env(vec3 r,float ro){return mix(sky(r),skyBlur(r),clamp(ro*2.2,0.,1.));}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
float spec(vec3 n,vec3 v,vec3 l,float r){vec3 h=normalize(v+l);float a=max(r*r,.0015);float nh=max(dot(n,h),0.);float d=nh*nh*(a*a-1.)+1.;return a*a/(3.1416*d*d);}
void main(){
  vec3 Vd=uEye-vP;float fd=length(Vd);vec3 V=Vd/fd;
  if(uType==6){vec3 c=aces(sky(-V)*uExpo);o=vec4(pow(c,vec3(1./2.2)),1.);return;}
  vec3 N=normalize(vN);if(dot(N,V)<0.)N=-N;
  vec3 col;float a=1.;vec3 alb=lin(uCol*vC);vec3 cm=lin(uCol);vec3 sunC=lin(uSunCol);vec3 plC=lin(uPLc);vec3 glw=lin(uGlow);
  vec3 L=uPLp-vP;float ld=length(L);L/=ld;float att=1./(1.+ld*ld*.35);
  if(uType==5){o=vec4(0,0,0,vC.r*uAlpha);return;}
  if(uType==7){float az=atan(vP.z,vP.x);float h=uFoam;float y=(vP.y-h)/uPatS;
    float n=noise(vec2(az*3.+vP.y*.8,vP.y*2.6-uT*.55))*.6+noise(vec2(az*7.-uT*.2,vP.y*5.-uT*.9))*.4;
    float al=smoothstep(.42,.85,n)*smoothstep(0.,.12,y)*smoothstep(1.,.35,y)*uAlpha*(.35+.65*pow(abs(dot(N,V)),.6));
    vec3 c=skyBlur(vec3(0.,1.,0.))*1.1+lin(uSunCol)*.15+glw*.6;c=aces(c*uExpo);o=vec4(pow(c,vec3(1./2.2)),al);return;}
  if(uType==4){col=alb*uEmis;}
  else if(uType==1){
    float ro=uRough;vec3 Nn=N;
    if(uBrush>0.){float lod=smoothstep(14.,2.5,fd);float b=noise(vec2(vP.y*140.,atan(vP.z,vP.x)*1.5+vP.x*.3))*.6+noise(vec2(vP.y*37.,vP.x+vP.z))*.4;ro+=(.06*b-.03)*lod;Nn=normalize(N+vec3(0.,(b-.5)*.014*lod,0.));}
    vec3 R=reflect(-V,Nn);vec3 F=cm+(1.-cm)*pow(1.-max(dot(Nn,V),0.),5.);
    col=env(R,ro)*F;
    col+=F*sunC*spec(Nn,V,uSun,ro+.05)*max(dot(Nn,uSun),0.)*.6;
    col+=F*plC*spec(Nn,V,L,ro+.12)*att*max(dot(Nn,L),0.)*2.+F*plC*att*.06;
    col+=glw*.25*max(N.y,0.);
  }
  else if(uType==2){
    vec2 q=vP.xz;float t=uT;
    float dx=.5*3.1*cos(3.1*q.x+1.7*t)+.25*5.3*cos(5.3*(q.x+q.y)+2.3*t)+.15*7.1*cos(7.1*q.x-6.3*q.y+3.*t);
    float dz=.5*2.7*cos(2.7*q.y-1.3*t)+.25*5.3*cos(5.3*(q.x+q.y)+2.3*t)-.15*6.3*cos(7.1*q.x-6.3*q.y+3.*t);
    vec3 n=N;
    if(abs(vN.y)>.5){n=normalize(vec3(-uWave*.035*dx,1.,-uWave*.035*dz));}
    else{n=normalize(N+vec3(0.,.15*sin(vP.y*40.-t*8.),0.)+.08*vec3(sin(q.x*30.+t*5.),0.,0.));}
    float cv=max(dot(n,V),0.);float fr=.02+.98*pow(1.-cv,5.);
    vec3 R=reflect(-V,n);R.y=abs(R.y);
    vec3 body=cm+glw;
    float caus=pow(noise(q*6.+vec2(t*.5,t*.3))*noise(q*9.-t*.4),2.)*.8;
    body+=caus*(vec3(.05,.2,.25)+glw*2.)*(.4+length(glw)*3.);
    col=mix(body,sky(R),fr);
    col+=sunC*spec(n,V,uSun,.05)*.25+plC*spec(n,V,L,.08)*att*.4;
    a=mix(uAlpha,1.,fr);
    if(uFoam>0.){float f1=noise(q*30.+vec2(t*2.3,t*1.9)),f2=noise(q*9.-vec2(t*.9,t*1.4)),f3=noise(q*70.+vec2(t*3.,-t*2.7));float f=f1*.4+f2*.45+f3*.3;float fm=smoothstep(.52,.72,f)*uFoam;vec3 fc=vec3(.92,.96,.97)*(skyBlur(vec3(0.,1.,0.))*1.6+sunC*.5+glw*3.+plC*att);col=mix(col,min(fc,vec3(1.2)),fm*.85);a=max(a,fm*.9);}
  }
  else if(uType==3){
    float fr=.04+.96*pow(1.-max(dot(N,V),0.),5.);vec3 R=reflect(-V,N);
    col=sky(R)*fr+cm*.04+glw*.15;a=uAlpha+fr*.55;
  }
  else{
    float ro=uRough;
    if(uGrain>0.){float gr=noise(vec2(vP.x*2.,vP.z*60.+vP.y*60.))*.5+noise(vec2(vP.x*.5,vP.z*12.+vP.y*12.))*.5;alb*=.82+.3*gr;}
    if(uPat==1){float w=uPatS;float id=floor(vP.z/w),f=fract(vP.z/w);float tint=.78+.4*hash(vec2(id,1.));
      float gap=smoothstep(0.,.03,f)*smoothstep(1.,.97,f);float jx=fract(vP.x/2.6+hash(vec2(id,7.)));gap*=smoothstep(0.,.003,abs(jx-.5));
      float lod=smoothstep(30.,5.,fd);float gr=noise(vec2(vP.x*3.,vP.z*110.))*.6+noise(vec2(vP.x*.7,vP.z*30.))*.4;alb*=mix(1.,tint,.4+.6*lod)*mix(1.,.8+.4*gr,lod)*mix(1.,mix(.15,1.,gap),lod*.9+.1*0.);}
    else if(uPat==2){vec2 g=vP.xz/uPatS;vec2 id=floor(g),f=fract(g);float tint=.84+.3*hash(id);float e=min(min(f.x,1.-f.x),min(f.y,1.-f.y));
      float lod=smoothstep(40.,8.,fd);alb*=mix(1.,tint,lod)*mix(1.,mix(.35,1.,smoothstep(0.,.012,e)),lod)*(.88+.24*noise(vP.xz*7.)*noise(vP.xz*23.+3.)*2.);}
    else if(uPat==3){float n=noise(vP.xz*.6)*.6+noise(vP.xz*3.)*.4;alb*=.86+.16*n;ro=.9;
      alb+=step(.992,hash(floor(vP.xz*300.)))*.6;}
    else if(uPat==4){float lod=smoothstep(30.,4.,fd);float n=noise(vP.xz*1.3)*.4+noise(vP.xz*7.)*.3+noise(vP.xz*60.)*.3*lod+.15*(1.-lod);alb*=.6+.8*n;alb=mix(alb,alb*vec3(1.25,1.1,.55),noise(vP.xz*.35+9.)*.45);}
    else if(uPat==5){alb*=.8+.4*noise(vP.xz*2.5)*noise(vP.xz*19.+3.)*2.;}
    vec3 R=reflect(-V,N);
    col=alb*(skyBlur(N)*.8+sunC*max(dot(N,uSun),0.)*.9)+alb*plC*max(dot(N,L),0.)*att*2.2+alb*glw*.3*max(N.y,0.);
    float fr=.04+.96*pow(1.-max(dot(N,V),0.),5.);
    col+=env(R,max(ro,.25))*fr*(1.-ro)*.6;
  }
  if(uFog1>0.){float fg=smoothstep(uFog0,uFog1,fd);vec3 fc=lin(uSkyHor)+lin(uSunCol)*pow(max(dot(-V,uSun),0.),6.)*.18*uSunGlow;col=mix(col,fc,fg);if(uType==2||uType==3)a=mix(a,1.,fg);}
  col=aces(col*uExpo);
  o=vec4(pow(col,vec3(1./2.2)),a);
}`;

/* ---------------- viewer ---------------- */
function legacyViewer(canvas,opts={},sharedCam){
  opts=Object.assign({},opts);if(window.STAVSJO_MANUAL)opts.manual=true;
  const gl=canvas.getContext('webgl2',{antialias:true,premultipliedAlpha:false,alpha:false,preserveDrawingBuffer:!!opts.manual});
  if(!gl){canvas.dataset.nogl='1';return null}
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o};
  const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(pr));
  gl.useProgram(pr);
  const U={};['uVP','uEye','uT','uType','uPat','uPatS','uSil','uSilC','uCol','uRough','uEmis','uAlpha','uFoam','uWave','uBrush','uGrain','uSkyTop','uSkyHor','uGnd','uSun','uSunCol','uGlow','uPLp','uPLc','uExpo','uBox','uRoom','uCloud','uStars','uAurora','uFog0','uFog1','uSunGlow'].forEach(n=>U[n]=gl.getUniformLocation(pr,n));
  const A={P:gl.getAttribLocation(pr,'aP'),N:gl.getAttribLocation(pr,'aN'),C:gl.getAttribLocation(pr,'aC')};
  let items=[],env={},t0=performance.now(),pend=false;
  const cam=sharedCam||{yaw:.7,pitch:.3,dist:7,target:[0,.5,0],fov:40,lift:.13,minD:2.5,maxD:18,auto:opts.autoRotate!==false,autoSpeed:opts.spin||.18,vy:0,vp:0};

  function upload(geo,m){
    const p=new Float32Array(geo.p),n=new Float32Array(p.length);
    for(let k=0;k<geo.i.length;k+=3){const a=geo.i[k]*3,b=geo.i[k+1]*3,c=geo.i[k+2]*3;
      const e1=[p[b]-p[a],p[b+1]-p[a+1],p[b+2]-p[a+2]],e2=[p[c]-p[a],p[c+1]-p[a+1],p[c+2]-p[a+2]],f=V.cross(e1,e2);
      for(const v of [a,b,c]){n[v]+=f[0];n[v+1]+=f[1];n[v+2]+=f[2]}}
    for(let k=0;k<n.length;k+=3){const l=Math.hypot(n[k],n[k+1],n[k+2])||1;n[k]/=l;n[k+1]/=l;n[k+2]/=l}
    const vao=gl.createVertexArray();gl.bindVertexArray(vao);
    const buf=(data,loc)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);return b};
    const bufs=[buf(p,A.P),buf(n,A.N),buf(new Float32Array(geo.c.length?geo.c:Array(p.length).fill(1)),A.C)];
    const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(geo.i),gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    return {vao,count:geo.i.length,m,bufs:[...bufs,ib]};
  }
  const skyItem=upload(G.sphere(150,24),{type:6});
  function setModel(model,o={}){
    items.forEach(it=>{gl.deleteVertexArray(it.vao);it.bufs.forEach(b=>gl.deleteBuffer(b))});
    items=model.parts.filter(p=>p&&p[0]&&p[0].i.length&&p[1].type!==8).map(([geo,m])=>upload(geo,m));
    const order=m=>m.type===5?1:(m.type===2?2:(m.type===3?3:(m.type===7?4:0)));
    items.sort((a,b)=>order(a.m)-order(b.m));
    env=Object.assign({skyTop:[.55,.68,.85],skyHor:[1,.97,.92],gnd:[.22,.2,.18],sun:[.5,.8,.35],sunCol:[1,.95,.85],glow:[0,0,0],pl:[0,5,0],plc:[0,0,0],expo:1,box:0,room:0,cloud:0,stars:0,aurora:0,sil:0,silC:[.1,.15,.1],fog0:30,fog1:0,sunGlow:1},model.env||{});
    if(model.cam&&!o.keepCam)Object.assign(cam,model.cam);
    else if(model.cam){cam.minD=model.cam.minD;cam.maxD=model.cam.maxD;cam.target=model.cam.target;cam.dist=Math.min(cam.maxD,Math.max(cam.minD,cam.dist))}
    if(opts.camOverride)Object.assign(cam,opts.camOverride);
    if(opts.manual&&!pend){pend=true;setTimeout(()=>{pend=false;frame(3000)},0)}
  }

  const ptrs=new Map();let lastPinch=0,idle=0;
  canvas.style.touchAction='pan-y';
  canvas.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,[e.clientX,e.clientY]);try{canvas.setPointerCapture(e.pointerId)}catch(_){}idle=0;cam.auto=false});
  canvas.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;const pv=ptrs.get(e.pointerId);const dx=e.clientX-pv[0],dy=e.clientY-pv[1];ptrs.set(e.pointerId,[e.clientX,e.clientY]);
    if(ptrs.size===1){cam.vy=-dx*.006;if(e.pointerType==='mouse')cam.vp=dy*.004}
    else if(ptrs.size===2&&opts.zoom!==false){const [a,b]=[...ptrs.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(lastPinch)cam.dist=Math.min(cam.maxD,Math.max(cam.minD,cam.dist*lastPinch/d));lastPinch=d}});
  const up=e=>{ptrs.delete(e.pointerId);lastPinch=0;idle=performance.now()};
  canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
  if(opts.zoom!==false)canvas.addEventListener('wheel',e=>{e.preventDefault();cam.dist=Math.min(cam.maxD,Math.max(cam.minD,cam.dist*(1+Math.sign(e.deltaY)*.08)))},{passive:false});

  let visible=true;new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(canvas);
  function draw(it){
    const m=it.m;const tr=m.type===2||m.type===3||m.type===5||m.type===7;
    if(tr){gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(m.type!==5&&!!m.depthWrite)}else{gl.disable(gl.BLEND);gl.depthMask(m.type!==6)}
    if(m.type===5){gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(-1,-1)}else gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.uniform1i(U.uType,m.type);gl.uniform3fv(U.uCol,m.col||[1,1,1]);gl.uniform1f(U.uRough,m.rough??.5);gl.uniform1f(U.uEmis,m.emis??1);
    gl.uniform1f(U.uAlpha,m.alpha??1);gl.uniform1f(U.uFoam,m.foam||0);gl.uniform1f(U.uWave,m.wave??1);gl.uniform1f(U.uBrush,m.brush||0);gl.uniform1f(U.uGrain,m.grain||0);
    gl.uniform1i(U.uPat,m.pat||0);gl.uniform1f(U.uPatS,m.patS||1);
    gl.uniform3fv(U.uGlow,m.glow||env.glow);
    gl.bindVertexArray(it.vao);gl.drawElements(gl.TRIANGLES,it.count,gl.UNSIGNED_INT,0);
  }
  function frame(now){
    if(!opts.manual)requestAnimationFrame(frame);
    if((!visible&&!opts.manual)||!items.length)return;
    const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,opts.maxDpr||2);
    if(!w||!h)return;
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}
    if(!cam.auto&&idle&&now-idle>3500&&opts.autoRotate!==false)cam.auto=true;
    cam.yaw+=cam.vy+(cam.auto?cam.autoSpeed*.016:0);cam.pitch=Math.min(1.35,Math.max(.06,cam.pitch+cam.vp));cam.vy*=.88;cam.vp*=.85;
    const t=(now-t0)/1000;
    const off=opts.offsetX||0;
    const eye=[cam.target[0]+cam.dist*Math.cos(cam.pitch)*Math.sin(cam.yaw),Math.max(.12,cam.target[1]+cam.dist*Math.sin(cam.pitch)),cam.target[2]+cam.dist*Math.cos(cam.pitch)*Math.cos(cam.yaw)];
    const P=perspective(cam.fov*Math.PI/180,w/h,.05,400);if(off&&w>900)P[8]=off;
    const look=[cam.target[0],cam.target[1]+cam.dist*cam.lift,cam.target[2]];
    const vp=mmul(P,lookAt(eye,look,[0,1,0]));
    gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);
    gl.uniformMatrix4fv(U.uVP,false,vp);gl.uniform3fv(U.uEye,eye);gl.uniform1f(U.uT,t);
    gl.uniform3fv(U.uSkyTop,env.skyTop);gl.uniform3fv(U.uSkyHor,env.skyHor);gl.uniform3fv(U.uGnd,env.gnd);gl.uniform3fv(U.uSun,V.norm(env.sun));gl.uniform3fv(U.uSunCol,env.sunCol);
    gl.uniform3fv(U.uPLp,env.pl);gl.uniform3fv(U.uPLc,env.plc);gl.uniform1f(U.uExpo,env.expo);gl.uniform1f(U.uBox,env.box);gl.uniform1f(U.uRoom,env.room);
    gl.uniform1f(U.uCloud,env.cloud);gl.uniform1f(U.uStars,env.stars);gl.uniform1f(U.uAurora,env.aurora);gl.uniform1i(U.uSil,env.sil);gl.uniform3fv(U.uSilC,env.silC);
    gl.uniform1f(U.uFog0,env.fog0);gl.uniform1f(U.uFog1,env.fog1);gl.uniform1f(U.uSunGlow,env.sunGlow);
    // sky is centred on the eye
    gl.disable(gl.DEPTH_TEST);const vp2=mmul(P,lookAt([0,0,0],V.sub(look,eye),[0,1,0]));gl.uniformMatrix4fv(U.uVP,false,vp2);gl.uniform3fv(U.uEye,[0,0,0]);draw(skyItem);
    gl.enable(gl.DEPTH_TEST);gl.uniformMatrix4fv(U.uVP,false,vp);gl.uniform3fv(U.uEye,eye);
    for(const it of items)draw(it);
    gl.depthMask(true);gl.disable(gl.BLEND);
  }
  if(!opts.manual)requestAnimationFrame(frame);
  return {setModel,cam,render:(ms)=>frame(ms??performance.now())};
}

/* ---------------- public viewer ----------------
   Uses the physically based three.js renderer (js/render3d.js) with real HDR
   environments. The call returns at once; the engine loads in the background
   and any setModel() made meanwhile is applied when it is ready. Browsers that
   cannot load it (no import maps / no WebGL2) fall back to the renderer above. */
function viewer(canvas,opts={}){
  opts=Object.assign({},opts);if(window.STAVSJO_MANUAL||/[?&]still=1/.test(location.search))opts.manual=true;
  const cam={yaw:.7,pitch:.3,dist:7,target:[0,.5,0],fov:40,lift:.13,minD:2.5,maxD:18,auto:opts.autoRotate!==false,autoSpeed:opts.spin||.18,vy:0,vp:0};
  let impl=null,pending=null,failed=false;
  const api={cam,setModel(m,o){if(impl)impl.setModel(m,o);else{pending=[m,o||{}];if(m.cam&&!(o&&o.keepCam))Object.assign(cam,m.cam)}},render(ms){if(impl)impl.render(ms)}};
  const fallback=e=>{if(failed)return;failed=true;console.warn('STAVSJO 3D: using basic renderer',e);try{impl=legacyViewer(canvas,opts,cam)}catch(err){console.error(err)}if(impl&&pending)impl.setModel(pending[0],pending[1])};
  const supportsMaps=HTMLScriptElement.supports&&HTMLScriptElement.supports('importmap');
  const probe=document.createElement('canvas').getContext('webgl2');
  if(!supportsMaps||!probe||window.STAVSJO_BASIC){fallback('unsupported');return api}
  import(new URL('js/render3d.js',document.baseURI).href).then(mod=>{
    impl=mod.createViewer(canvas,opts,cam);
    if(pending)impl.setModel(pending[0],pending[1]);
  }).catch(fallback);
  return api;
}

window.STAVSJO3D={G,MAT,mat,viewer,legacyViewer};
})();
