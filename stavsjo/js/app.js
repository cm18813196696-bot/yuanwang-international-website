/* STAVSJÖ — page logic: routing, collections, Design Studio, quote form, cookie notice */
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

/* ---------- contact links ---------- */
const LINKS={email:"mailto:"+CONTACT.email,office:"mailto:"+CONTACT.office,phone:"tel:"+CONTACT.phone.replace(/[^+\d]/g,''),whatsapp:"https://wa.me/"+CONTACT.waNumber,instagram:"https://www.instagram.com/"+CONTACT.instagram+"/",tiktok:"https://www.tiktok.com/@"+CONTACT.tiktok,web:"https://"+CONTACT.web};
const TEXT={email:CONTACT.email,office:CONTACT.office,phone:CONTACT.phone,wechat:CONTACT.wechat,address:CONTACT.address,whatsapp:CONTACT.whatsapp,instagram:"@"+CONTACT.instagram,tiktok:"@"+CONTACT.tiktok,web:CONTACT.web};
function wire(root=document){
  root.querySelectorAll('[data-link]').forEach(a=>{a.href=LINKS[a.dataset.link];if(!['email','office','phone'].includes(a.dataset.link)){a.target='_blank';a.rel='noopener'}});
  root.querySelectorAll('[data-text]').forEach(e=>e.textContent=TEXT[e.dataset.text]);
}
wire();

/* ---------- menus, tiles ---------- */
$('#ddMenu').innerHTML=COLLECTIONS.map(c=>`<a href="#${c.key}">${c.name}</a>`).join('');
$('#footCols').innerHTML=COLLECTIONS.map(c=>`<li><a href="#${c.key}">${c.name}</a></li>`).join('');
$('#tiles').innerHTML=COLLECTIONS.map((c,i)=>`<a class="tile reveal" href="#${c.key}"><img src="img/${c.img}.jpg" alt="${c.name}" loading="lazy"><i>0${i+1}</i><div><small>Collection</small><b>${c.name}</b><span>${c.tagline}</span></div></a>`).join('');
$('#projTiles').innerHTML=[["proj-alps","Mountain infinity pool"],["proj-mountain","Outdoor stainless spa"],["proj-indoor","Indoor spa hall"],["proj-kids","Family pool"]].map(p=>`<div class="tile" style="aspect-ratio:1"><img src="img/${p[0]}.jpg" alt="${p[1]}" loading="lazy"><div><b style="font-size:22px">${p[1]}</b></div></div>`).join('');

/* ---------- v8: company, systems, project index, marquee ---------- */
const sysHTML=COMPANY.systems.map(s=>`<div><i>${s[0]}</i><b>${s[1]}</b><span>${s[2]}</span></div>`).join('');
$('#slogan').textContent=COMPANY.slogan;$('#sys4').innerHTML=sysHTML;
$('#aboutSlogan').textContent=COMPANY.slogan;$('#aboutIntro').textContent=COMPANY.intro;$('#aboutSys').innerHTML=sysHTML;
function pindex(list){return list.map((p,i)=>`<a class="pcard${p[1]?'':' noimg'}" href="#projects" data-goto="${p[0]}">
  <div class="pim">${p[1]?`<img src="img/${p[1]}.jpg" alt="${p[3]}" loading="lazy">`:`<div class="topo"><span>Hot spring<br>wellness resort</span></div>`}<i>${String(i+1).padStart(2,'0')}</i></div>
  <div class="pbd"><small>${p[2]}</small><b>${p[3]}</b><span>${p[4]}</span></div></a>`).join('')}
$('#homeIndex').innerHTML=pindex(PROJECT_INDEX.slice(0,6));
const refs=["Arxan Linhai Yitang Wellness Hotel","Gubei Water Town","Beijing Valley","Siji Nanhe, Changchun","Manxin Mansion, Water Great Wall","Langya Ancient City Water Show","Jinyu Badaling Hot Spring Resort","Ruilinwan Hot Spring Hotel","STAVSJÖ Hotel, Sweden","Tianjin Dongjiang Port","Xinzhou Qingliangwan"];
$('#mq').innerHTML=[...refs,...refs].map(r=>`<span>${r}</span>`).join('');

/* ---------- collection page ---------- */
function prodCard(p,c){return `<article class="prod" data-form="${c.form}" data-name="${p.name}"><div class="ph"><img src="img/${p.img}.jpg" alt="${p.name}" loading="lazy">${p.badge?`<span class="badge">${p.badge}</span>`:''}<span class="quick">Get factory price →</span></div><div class="bd"><h4>${p.name}</h4><p>${p.text}</p><div class="price">Factory-direct · made to order</div></div></article>`}
function renderCollection(c){
  const items=PRODUCTS.filter(p=>p.cat===c.cat),others=COLLECTIONS.filter(o=>o!==c);
  $('#collection').innerHTML=`
  <section class="phero"><img src="img/${c.img}.jpg" alt=""><div class="wrap">
    <div class="crumb"><a href="#home">Home</a> / Collections / ${c.short}</div>
    <h1>${c.name}</h1><p>${c.tagline}</p>
    <div class="cta" style="margin-top:26px"><a class="btn btn-deal" href="#contact" data-prefill="${c.form}|">Get factory price</a>${c.studio?`<a class="btn btn-line" href="#studio" data-studio="${c.studio}">Design in 3D</a>`:''}</div>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="wrap">
    <div class="facts4">${c.facts.map(f=>`<div><b>${f[0]}</b><span>${f[1]}</span></div>`).join('')}</div>
    <div class="two" style="margin-top:70px">
      <div><div class="kicker">Overview</div><h2>${c.name.split(' ').slice(0,-1).join(' ')||c.name}<br><em>${c.name.split(' ').slice(-1)}</em></h2><p class="lead">${c.intro}</p>
        <div class="kicker" style="margin-top:34px">Typical applications</div><div class="chips">${c.apps.map(a=>`<span class="chip">${a}</span>`).join('')}</div></div>
      <div><div class="kicker">Specification</div><table class="spec">${c.specs.map(s=>`<tr><th>${s[0]}</th><td>${s[1]}</td></tr>`).join('')}</table>
        <p class="note">Scope, dimensions and compliance documents are confirmed in the quotation. Final dimensions and fittings follow the approved project drawing.</p></div>
    </div>
  </div></section>
  <section class="sec mistbg"><div class="wrap">
    <div class="head2"><div><div class="kicker">Models & references</div><h2>In this collection</h2></div><p class="lead">Select a model to request its factory price. Every model can be resized and refinished.</p></div>
    <div class="grid">${items.map(p=>prodCard(p,c)).join('')}</div>
  </div></section>
  <section class="sec"><div class="wrap">
    <div class="kicker">For your quotation</div><h2>What we need from you.</h2>
    <div class="cols3" style="margin-top:36px">
      <div class="box"><span class="n">01</span><h3>Site & use</h3><p>Hotel, resort, villa, rooftop or public facility — plus the country and any local rules.</p></div>
      <div class="box"><span class="n">02</span><h3>Geometry & water</h3><p>Dimensions, water depth and source-water report, operating temperature, preferred grade and finish.</p></div>
      <div class="box"><span class="n">03</span><h3>Access & timing</h3><p>Delivery route, lifting limits, power supply and your target opening date.</p></div>
    </div>
    <div class="cta" style="margin-top:40px"><a class="btn btn-deal" href="#contact" data-prefill="${c.form}|">Start my quotation</a><a class="btn btn-line" href="#after-sales">After-sales policy</a></div>
    <div class="kicker" style="margin-top:80px">Other collections</div>
    <div class="chips">${others.map(o=>`<a class="chip" style="text-decoration:none" href="#${o.key}">${o.name} →</a>`).join('')}</div>
  </div></section>`;
}
document.addEventListener('click',e=>{
  const p=e.target.closest('.prod');if(p){prefill(p.dataset.form,'Interested in: '+p.dataset.name);location.hash='contact';return}
  const pf=e.target.closest('[data-prefill]');if(pf){const [f,d]=pf.dataset.prefill.split('|');prefill(f,d)}
  const st=e.target.closest('[data-studio]');if(st)pendingProduct=st.dataset.studio;
  const j=e.target.closest('[data-jump]');if(j)jumpTo(j.dataset.jump);
  const go=e.target.closest('[data-goto]');if(go){if(location.hash===(go.getAttribute('href')||'#projects')){e.preventDefault();jumpTo(go.dataset.goto)}else pendingJump=go.dataset.goto}
});
let pendingJump=null;
function jumpTo(id){const t=document.getElementById(id);if(t)window.scrollTo({top:t.getBoundingClientRect().top+scrollY-130,behavior:'smooth'})}
function prefill(form,details){if(form)$('#qProduct').value=form;if(details){$('#qDetails').value=details+'\n'}}

/* ---------- engineering gallery + certificates ---------- */
const PROJ_GAL=[['../proj/im-hall','Hot spring hall','Domed hall with acrylic-walled pool and hydromassage loungers'],['../proj/im-filters','Plant room','Filtration tanks and pipework being installed'],['../proj/im-acrylic','Pool construction','Curved acrylic panels with stainless channel'],['../proj/im-build','Spa pools in progress','Benches, jet connections and stone cladding'],['../proj/im-control','Control cabinet','PLC control for pumps, heating and dosing'],['../proj/im-finished','Ready for water','Finished pool before filling'],['../proj/im-colonnade','Pool hall','Acrylic pool wall in the colonnade'],['install-crane','Delivery','Prefabricated shells arrive finished'],['install-waterpark','Water park','Multiple pools during installation']];
function gal(el,list){$(el).classList.toggle('nobig',(list.length-1)%4!==0);$(el).innerHTML=list.map(g=>`<figure data-zoom data-src="img/eng/${g[0]}.jpg" data-cap="${g[1]} — ${g[2]}"><div class="im"><img src="img/eng/${g[0]}.jpg" alt="${g[1]}" loading="lazy"></div><figcaption><b>${g[1]}</b><span>${g[2]}</span></figcaption></figure>`).join('')}
function renderEng(){galx('#galFactory',FACTORY);gal('#galFab',ENG.fabrication);gal('#galDet',ENG.details);gal('#galDraw',ENG.drawings);gal('#galInst',ENG.install);gal('#galRef',ENG.refurb);
  $('#galProc').innerHTML=PROCESS.map((p,i)=>`<figure data-zoom data-src="img/${p[0]}.jpg" data-cap="${String(i+1).padStart(2,'0')} · ${p[1]} — ${p[2]}"><div class="im"><img src="img/${p[0]}.jpg" alt="${p[1]}" loading="lazy"><i>${String(i+1).padStart(2,'0')}</i></div><figcaption><b>${p[1]}</b><span>${p[2]}</span></figcaption></figure>`).join('');
  $('#procClips').innerHTML=clips(PROCESS_CLIPS)}

/* ---------- v6: generic gallery, video clips, projects, partners, controls ---------- */
function galx(el,list){const e=$(el);e.classList.toggle('nobig',(list.length-1)%4!==0);e.innerHTML=list.map(g=>`<figure data-zoom data-src="img/${g[0]}.jpg" data-cap="${g[1]} — ${g[2]}"><div class="im"><img src="img/${g[0]}.jpg" alt="${g[1]}" loading="lazy"></div><figcaption><b>${g[1]}</b><span>${g[2]}</span></figcaption></figure>`).join('')}
function clips(list){return list.map(c=>`<figure class="clip ${c[3]==='v'?'vert':'horiz'}"><video src="media/${c[0]}.mp4" poster="img/poster/${c[0]}.jpg" controls playsinline muted preload="none"></video><figcaption><b>${c[1]}</b><span>${c[2]}</span></figcaption></figure>`).join('')}
function renderProjects(){
  galx('#galProj',ARXAN_GAL);$('#arxClips').innerHTML=clips(ARXAN_CLIPS);
  $('#pjIndex').innerHTML=pindex(PROJECT_INDEX);
  $('#arxFacts').innerHTML=ARXAN.facts.map(f=>`<div><b>${f[0]}</b><span>${f[1]}</span></div>`).join('');
  $('#cases').innerHTML=CASES.map((c,i)=>`<section class="sec case ${i%2?'mistbg':''}" id="${c.id}"><div class="wrap">
    <div class="two"><div><div class="kicker">Case ${String(i+2).padStart(2,'0')} · ${c.kicker}</div><h2>${c.title}<br><em>${c.em}</em></h2><p class="lead">${c.lead}</p>
      ${c.facts?`<div class="pfacts">${c.facts.map(f=>`<div><b>${f[0]}</b><span>${f[1]}</span></div>`).join('')}</div>`:''}
      <div class="cta" style="margin-top:26px"><a class="btn btn-deal" href="#contact" data-prefill="${c.form}">Plan a similar project</a></div></div>
      <table class="spec">${c.spec.map(s=>`<tr><th>${s[0]}</th><td>${s[1]}</td></tr>`).join('')}</table></div>
    ${c.gal.length?`<div class="gal" id="gal-${c.id}" style="margin-top:56px"></div>`:`<p class="note" style="margin-top:40px">Project photographs to follow.</p>`}
    ${c.clips.length?`<div class="kicker" style="margin-top:56px">Site footage</div><div class="clips">${clips(c.clips)}</div>`:''}
  </div></section>`).join('');
  CASES.forEach(c=>{if(c.gal.length)galx('#gal-'+c.id,c.gal)});
  $('#energyCases').innerHTML=ENERGY.map((e,i)=>`<div class="ecase"><div><div class="kicker">Energy centre ${String(i+1).padStart(2,'0')}</div><h3>${e.title}</h3><p class="meta">${e.place}</p>
    <div class="efacts">${e.facts.map(f=>`<div><b>${f[0]}</b><span>${f[1]}</span></div>`).join('')}</div><p>${e.text}</p></div>
    ${e.gal.length?`<div class="gal nobig egal">${e.gal.map(g=>`<figure data-zoom data-src="img/${g[0]}.jpg" data-cap="${e.title} — ${g[1]}: ${g[2]}"><div class="im"><img src="img/${g[0]}.jpg" alt="${g[1]}" loading="lazy"></div><figcaption><b>${g[1]}</b><span>${g[2]}</span></figcaption></figure>`).join('')}</div>`:'<div></div>'}</div>`).join('');
}
function renderDesigns(){
  $('#designNav').innerHTML=DESIGNS.map(d=>`<a href="javascript:void 0" data-jump="${d.id}">${d.nav}</a>`).join('');
  $('#designs').innerHTML=DESIGNS.map((d,i)=>`<section class="sec ${i%2?'mistbg':''}" id="${d.id}"><div class="wrap">
    <div class="head2"><div><div class="kicker">${d.kicker}</div><h2>${d.title}<br><em>${d.em}</em></h2></div><div class="dtext"><p class="lead">${d.text}</p><p class="note"><b>Design scope:</b> ${d.scope}</p></div></div>
    <div class="gal" id="gal-${d.id}"></div></div></section>`).join('');
  DESIGNS.forEach(d=>galx('#gal-'+d.id,d.gal));
}
function renderHomeProducts(){$('#homeProducts').innerHTML=HOME_PICKS.map(n=>PRODUCTS.find(p=>p.name===n)).filter(Boolean).map(p=>prodCard(p,COLLECTIONS.find(c=>c.cat===p.cat))).join('')}
renderHomeProducts();
function renderPartners(){$('#partners').innerHTML=PARTNERS.map(p=>`<div class="pcat"><div><h3>${p.title}</h3><p>${p.text}</p></div><div><div class="gal nobig pgal">${p.gal.map(g=>`<figure data-zoom data-src="img/${g[0]}.jpg" data-cap="${g[1]} — ${g[2]}"><div class="im"><img src="img/${g[0]}.jpg" alt="${g[1]}" loading="lazy"></div><figcaption><b>${g[1]}</b><span>${g[2]}</span></figcaption></figure>`).join('')}</div>${p.clips?`<div class="clips" style="margin-top:18px">${clips(p.clips)}</div>`:''}</div></div>`).join('')}
function renderControls(){$('#controls').innerHTML=CONTROLS.map(c=>`<div class="box"><span class="n">${c.n}</span><h3>${c.title}</h3><ul>${c.items.map(i=>`<li>${i}</li>`).join('')}</ul></div>`).join('')}
function renderCerts(){$('#certs').innerHTML=CERTS.map(c=>`<div class="certco"><div><div class="kicker">Certificate holder</div><h3>${c.holder}</h3>
  <p class="meta">${c.place}</p><p class="meta"><b>Scope:</b> ${c.scope}</p><p class="meta"><b>Issued by:</b> ${c.issuer}</p><p class="meta"><b>Verify:</b> ${c.verify}</p></div>
  <div class="certs">${c.items.map(i=>`<div class="cert" data-zoom data-src="img/cert/${i[4]}.jpg" data-cap="${i[0]} · ${c.holder} · No. ${i[2]} · ${i[3]}"><div class="im"><img src="img/cert/${i[4]}.jpg" alt="${i[0]} certificate — ${c.holder}" loading="lazy"></div><b>${i[0]}</b><span>${i[1]}</span><span>No. ${i[2]}</span><span>${i[3]}</span></div>`).join('')}</div></div>`).join('')}

/* ---------- lightbox ---------- */
let lbList=[],lbI=0;
function lbShow(i){lbI=(i+lbList.length)%lbList.length;const e=lbList[lbI];$('#lbImg').src=e.dataset.src||e.getAttribute('src');$('#lbCap').textContent=e.dataset.cap||e.alt||''}
document.addEventListener('click',e=>{const z=e.target.closest('[data-zoom]');if(!z)return;e.preventDefault();
  const scope=z.closest('.gal,.certs,section')||document;lbList=[...scope.querySelectorAll('[data-zoom]')];lbShow(lbList.indexOf(z));$('#lb').classList.add('open')});
$('#lbX').onclick=()=>$('#lb').classList.remove('open');$('#lbP').onclick=()=>lbShow(lbI-1);$('#lbN').onclick=()=>lbShow(lbI+1);
$('#lb').addEventListener('click',e=>{if(e.target.id==='lb')$('#lb').classList.remove('open')});
document.addEventListener('keydown',e=>{if(!$('#lb').classList.contains('open'))return;if(e.key==='Escape')$('#lb').classList.remove('open');if(e.key==='ArrowLeft')lbShow(lbI-1);if(e.key==='ArrowRight')lbShow(lbI+1)});

/* ---------- router ---------- */
const STATIC=['faq','privacy','home','design','projects','hot-spring-tech','studio','engineering','technology','quality','after-sales','about','contact'];
function route(){
  let h=(location.hash||'#home').slice(1);const col=COLLECTIONS.find(c=>c.key===h);
  if(!col&&!STATIC.includes(h))h='home';
  if(col)renderCollection(col);
  const view=col?'collection':h;
  $$('.view').forEach(v=>v.classList.toggle('on',v.dataset.view===view));
  $$('#links>a').forEach(a=>a.classList.toggle('cur',a.getAttribute('href')==='#'+h));
  document.body.classList.toggle('in-studio',h==='studio');
  $('#links').classList.remove('open');window.scrollTo(0,0);if(h==='engineering'&&!$('#galFab').innerHTML)renderEng();if(h==='quality'&&!$('#certs').innerHTML){renderCerts();renderPartners();STAVSJO_TECH.renderCreds()}if(h==='projects'&&!$('#galProj').innerHTML){renderProjects();STAVSJO_TECH.renderPList()}if(h==='hot-spring-tech'&&!$('#geoFlow').innerHTML)STAVSJO_TECH.renderTech();if(h==='design'&&!$('#designs').innerHTML)renderDesigns();if(h==='technology'&&!$('#controls').innerHTML)renderControls();$$('video').forEach(v=>{if(!v.closest('.view.on'))v.pause()})
  document.title=(col?col.name:{home:'Factory-Direct Stainless Steel Pools, Spas & Saunas',studio:'3D Design Studio',design:'Design Portfolio','hot-spring-tech':'Hot Spring Technology',technology:'Technology & Materials',engineering:'Factory & Engineering',projects:'Projects',quality:'Quality & Supply Chain','after-sales':'After-Sales Service',about:'About',contact:'Contact & Quote',faq:'FAQ — Buying from Overseas',privacy:'Privacy Notice'}[h])+' — STAVSJÖ';
  if(h==='studio')openStudio();
  if(h==='home')startHero();
  observe();
  if(pendingJump){const id=pendingJump;pendingJump=null;setTimeout(()=>jumpTo(id),60)}
}
window.addEventListener('hashchange',route);
$('#burger').onclick=()=>$('#links').classList.toggle('open');
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.1});
function observe(){$$('.view.on .reveal:not(.in)').forEach(el=>io.observe(el))}

/* ---------- 3D: hero ---------- */
let hero;
function startHero(){
  if(hero||!window.STAVSJO3D)return;
  try{hero=STAVSJO3D.viewer($('#hero3d'),{zoom:false,spin:.12,maxDpr:1.5,offsetX:-.5});
    if(hero){const he=new URLSearchParams(location.search).get('he');const m=STAVSJO_BUILD('icon',{form:'moon',finish:'mirror',led:'warm',size:2.2},STAVSJO_ENVS.some(e=>e[0]===he)?he:'zen');const nar=innerWidth<900;m.cam=Object.assign({},m.cam,nar?{dist:11.5,pitch:.18,yaw:.9,lift:.28}:{dist:8.6,pitch:.16,yaw:.9});hero.setModel(m)}
  }catch(e){console.error(e)}
}

/* ---------- 3D: Design Studio ---------- */
let studio,curKey='icon',curEnv=null,pendingProduct=null;const state={};
function label(c,p){const v=p[c.id];if(c.type==='range')return v.toFixed(c.step<.1?2:1)+' '+c.unit;return ''}
function rebuild(keepCam){
  const pd=STAVSJO_PRODUCTS.find(p=>p.key===curKey),m=STAVSJO_BUILD(curKey,state[curKey],curEnv);
  if(studio)studio.setModel(m,{keepCam});
  $('#rDims').textContent=m.info.dims;$('#rVol').textContent=m.info.vol;$('#rSeat').textContent=m.info.seats;
  const p=state[curKey],sum=pd.controls.filter(c=>!c.when||c.when(p)).map(c=>{const v=p[c.id];
    return c.label+': '+(c.type==='choice'?(c.options.find(o=>o[0]===v)||[0,v])[1]:c.type==='toggle'?(v?'yes':'no'):label(c,p))}).join('\n');
  const link=designLink();
  $('#sQuote').onclick=()=>prefill(pd.form,`Design Studio configuration — ${pd.title}\n${sum}\nSize: ${m.info.dims}\nSetting viewed: ${(STAVSJO_ENVS.find(e=>e[0]===curEnv)||[])[1]}\nDesign link: ${link}`);
  const sh=$('#sShare');if(sh){sh.textContent='Copy a link to this design';sh.onclick=async()=>{try{await navigator.clipboard.writeText(designLink());sh.textContent='Link copied ✓'}catch(_){prompt('Copy this link:',designLink())}}}
}
/* a link that reopens the studio with this exact product, setting and options */
function designLink(){
  const pd=STAVSJO_PRODUCTS.find(p=>p.key===curKey),p=state[curKey],q=new URLSearchParams({p:curKey});
  if(curEnv&&curEnv!==pd.env)q.set('e',curEnv);
  for(const k in p)if(String(p[k])!==String(pd.defaults[k]))q.set(k,typeof p[k]==='boolean'?(p[k]?'1':'0'):String(p[k]));
  return location.origin+location.pathname+'?'+q.toString()+'#studio';
}
function drawControls(){
  const pd=STAVSJO_PRODUCTS.find(p=>p.key===curKey),p=state[curKey];
  $('#sTitle').textContent=pd.title;$('#sDesc').textContent=pd.desc;$('#sMore').href='#'+pd.page;
  $('#ctls').innerHTML=pd.controls.filter(c=>!c.when||c.when(p)).map(c=>{
    if(c.type==='choice')return `<div class="ctl"><label>${c.label}</label><div class="seg">${c.options.map(o=>`<button type="button" data-id="${c.id}" data-v="${o[0]}" class="${String(p[c.id])===String(o[0])?'on':''}">${o[1]}</button>`).join('')}</div></div>`;
    if(c.type==='range')return `<div class="ctl"><label>${c.label}<b id="lb-${c.id}">${label(c,p)}</b></label><input type="range" data-id="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${p[c.id]}"></div>`;
    return `<div class="ctl"><label class="tog" style="margin:0;text-transform:none;letter-spacing:0;font-size:14px;color:#fff">${c.label}<input type="checkbox" data-id="${c.id}" ${p[c.id]?'checked':''}></label></div>`}).join('');
  [...$('#ptabs').children].forEach(b=>b.classList.toggle('on',b.dataset.k===curKey));
  [...$('#envbar').children].forEach(b=>b.classList.toggle('on',b.dataset.e===curEnv));
}
function pickProduct(k){curKey=k;const pd=STAVSJO_PRODUCTS.find(p=>p.key===k);curEnv=pd.env;drawControls();rebuild(false)}
function openStudio(){
  if(!window.STAVSJO3D)return;
  if(!studio){
    STAVSJO_PRODUCTS.forEach(p=>state[p.key]=Object.assign({},p.defaults));
    $('#ptabs').innerHTML=STAVSJO_PRODUCTS.map(p=>`<button type="button" data-k="${p.key}">${p.title}</button>`).join('');
    $('#envbar').innerHTML=STAVSJO_ENVS.map(e=>`<button type="button" data-e="${e[0]}">${e[1]}</button>`).join('');
    $('#ptabs').onclick=e=>{const b=e.target.closest('button');if(b)pickProduct(b.dataset.k)};
    $('#envbar').onclick=e=>{const b=e.target.closest('button');if(b){curEnv=b.dataset.e;drawControls();rebuild(true)}};
    const ctl=$('#ctls');
    ctl.addEventListener('click',e=>{const b=e.target.closest('.seg button');if(!b)return;const pd=STAVSJO_PRODUCTS.find(p=>p.key===curKey),c=pd.controls.find(c=>c.id===b.dataset.id);
      const raw=b.dataset.v,opt=c.options.find(o=>String(o[0])===raw);state[curKey][c.id]=opt[0];drawControls();rebuild(true)});
    ctl.addEventListener('input',e=>{const t=e.target;if(!t.dataset.id)return;const pd=STAVSJO_PRODUCTS.find(p=>p.key===curKey),c=pd.controls.find(c=>c.id===t.dataset.id);
      if(t.type==='range'){state[curKey][c.id]=+t.value;const l=document.getElementById('lb-'+c.id);if(l)l.textContent=label(c,state[curKey])}
      else if(t.type==='checkbox'){state[curKey][c.id]=t.checked}
      rebuild(true)});
    try{studio=STAVSJO3D.viewer($('#studio3d'),{spin:.1})}catch(e){console.error(e)}
    // a shared design link can carry the product, setting and options: ?p=tub&e=sea&shape=oct&finish=brushed
    const q=new URLSearchParams(location.search),qp=q.get('p'),qe=q.get('e');
    if(qp&&state[qp]){pendingProduct=qp;const st=state[qp];q.forEach((v,k)=>{if(k in st)st[k]=typeof st[k]==='number'?+v:typeof st[k]==='boolean'?(v==='1'||v==='true'):v})}
    pickProduct(pendingProduct||curKey);pendingProduct=null;
    if(qe&&STAVSJO_ENVS.some(x=>x[0]===qe)){curEnv=qe;drawControls();rebuild(false)}
  }else if(pendingProduct){pickProduct(pendingProduct);pendingProduct=null}
}
window.STAVSJO_APP={pick:pickProduct,env:e=>{curEnv=e;drawControls();rebuild(true)},set:(id,v)=>{state[curKey][id]=v;drawControls();rebuild(true)},viewers:()=>({hero,studio})};

/* ---------- quote form ----------
   With a Formspree ID in js/site-config.js, "Send request" delivers the enquiry
   straight to our inbox, and WhatsApp enquiries are copied there too.
   Without one (or if sending fails) the form prepares an email or a WhatsApp
   message for the visitor to send themselves. */
const CFG=window.STAVSJO_CONFIG||{},FS=(CFG.formspree||'').trim();
const form=$('#qform');let via='email',sending=false;
form.querySelectorAll('button[data-via]').forEach(b=>b.addEventListener('click',()=>via=b.dataset.via));
const sendBtn=form.querySelector('button[data-via="email"]');
if(FS&&sendBtn)sendBtn.innerHTML='<svg class="ic"><use href="#i-mail"/></svg>Send request';
function toFormspree(lines,subj,channel,keepalive){
  const data={_subject:subj,email:form.Email.value.trim(),channel,_gotcha:(form._gotcha||{}).value||''};
  lines.forEach(([k,v])=>data[k]=v);data.Page=location.href;
  return fetch('https://formspree.io/f/'+encodeURIComponent(FS),{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(data),keepalive:!!keepalive})
    .then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r});
}
function showManual(body,subj,note){
  $('#qtext').textContent=body;const open=$('#qopen');$('#qdone h3').textContent='Almost done';
  ['#qopen','#qcopy','#qtext'].forEach(s=>$(s).style.display='');$('#qback').textContent='Edit';
  if(via==='whatsapp'){open.href=`https://wa.me/${CONTACT.waNumber}?text=${encodeURIComponent(body)}`;open.target='_blank';open.textContent='Open WhatsApp';$('#qmsg').innerHTML=`Your message is ready. Tap below to send it to us on WhatsApp (<b>${CONTACT.whatsapp}</b>).`}
  else{open.href=`mailto:${CONTACT.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;open.removeAttribute('target');open.textContent='Open my email app';$('#qmsg').innerHTML=(note||'')+`Your message is ready. Tap below to send it to <b>${CONTACT.email}</b>, or copy the text into your own email.`}
  $('#qfields').style.display='none';$('#qdone').style.display='block';
}
function showSent(email){
  $('#qdone h3').textContent='Thank you — request received';
  $('#qmsg').innerHTML=`We have your enquiry and will reply to <b>${email.replace(/[<>&"]/g,'')}</b> within 1 working day. For a faster answer, message us on WhatsApp (<b>${CONTACT.whatsapp}</b>).`;
  ['#qopen','#qcopy','#qtext'].forEach(s=>$(s).style.display='none');$('#qback').textContent='Send another request';
  $('#qfields').style.display='none';$('#qdone').style.display='block';
}
form.addEventListener('submit',e=>{
  e.preventDefault();if(sending)return;let ok=true;
  form.querySelectorAll('#qfields [required]').forEach(i=>{const bad=i.type==='checkbox'?!i.checked:!i.value.trim()||(i.type==='email'&&!/^\S+@\S+\.\S+$/.test(i.value));const box=i.closest('.f');if(box)box.classList.toggle('err',bad);if(bad)ok=false});
  if(!ok){$('#qerr').textContent='Please complete the required fields and tick the consent box.';return}
  $('#qerr').textContent='';
  const pairs=[...form.querySelectorAll('#qfields [name]')].filter(i=>i.name!=='_gotcha'&&i.value.trim()).map(i=>[i.name,i.value.trim()]);
  const body="STAVSJÖ quote request\n\n"+pairs.map(([k,v])=>`${k}: ${v}`).join('\n'),subj=`Quote request — ${form.Product.value} — ${form.Country.value}`;
  track('generate_lead',{method:via,product:form.Product.value,country:form.Country.value});
  if(!FS){showManual(body,subj);return}
  if(via==='whatsapp'){toFormspree(pairs,subj+' (via WhatsApp)','whatsapp',true).catch(()=>{});showManual(body,subj);return}
  sending=true;const label=sendBtn.innerHTML;sendBtn.disabled=true;sendBtn.textContent='Sending…';
  toFormspree(pairs,subj,'website form').then(()=>{showSent(form.Email.value.trim());form.reset();$('#qOk').checked=false})
    .catch(()=>showManual(body,subj,'We could not send your request automatically. '))
    .finally(()=>{sending=false;sendBtn.disabled=false;sendBtn.innerHTML=label});
});
$('#qback').onclick=()=>{$('#qfields').style.display='';$('#qdone').style.display='none'};
$('#qcopy').onclick=async e=>{try{await navigator.clipboard.writeText($('#qtext').textContent);e.target.textContent='Copied ✓'}catch(_){e.target.textContent='Select the text to copy'}};

/* ---------- analytics (Google Analytics 4, only after consent) ---------- */
const GA=(CFG.ga||'').trim();let gaOn=false;
function loadGA(){
  if(gaOn||!/^G-[A-Z0-9]+$/i.test(GA))return;gaOn=true;
  window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};
  gtag('js',new Date());gtag('config',GA,{page_location:location.href,page_title:document.title});
  const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA);document.head.appendChild(s);
  addEventListener('hashchange',()=>setTimeout(()=>gtag('event','page_view',{page_location:location.href,page_title:document.title}),60));
}
function track(name,params){if(gaOn&&window.gtag)gtag('event',name,params||{})}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="https://wa.me"],a[href^="mailto:"]');if(a)track(a.href.startsWith('mailto')?'contact_email':'contact_whatsapp',{link_location:location.hash||'#home'})});

/* ---------- cookie notice ---------- */
const ck=$('#ck');
const getC=()=>{try{return JSON.parse(localStorage.getItem('stavsjo_consent'))}catch(_){return null}};
const setC=v=>{try{localStorage.setItem('stavsjo_consent',JSON.stringify(Object.assign({necessary:true,date:new Date().toISOString()},v)))}catch(_){}ck.classList.remove('open','more');if(v.analytics)loadGA();else if(gaOn)location.reload()};
const saved=getC();if(!saved){if(!/[?&]still=1/.test(location.search))setTimeout(()=>ck.classList.add('open'),900)}else{$('#ckA').checked=!!saved.analytics;$('#ckM').checked=!!saved.marketing;if(saved.analytics)loadGA()}
$('#ckYes').onclick=()=>{$('#ckA').checked=$('#ckM').checked=true;setC({analytics:true,marketing:true})};
$('#ckNo').onclick=()=>{if(ck.classList.contains('more'))setC({analytics:$('#ckA').checked,marketing:$('#ckM').checked});else{$('#ckA').checked=$('#ckM').checked=false;setC({analytics:false,marketing:false})}};
$('#ckMore').onclick=()=>{const m=ck.classList.toggle('more');$('#ckNo').textContent=m?'Save my choices':'Necessary only';$('#ckMore').textContent=m?'Hide preferences':'Manage preferences'};
$('#ckAgain').onclick=()=>ck.classList.add('open');

$('#yr').textContent=new Date().getFullYear();
route();
})();
