document.querySelectorAll('.product-stage').forEach(stage=>{
  const canvas=stage.querySelector('canvas'),ctx=canvas.getContext('2d');
  const slider=stage.querySelector('input'),button=stage.querySelector('button');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let angle=.44,paused=reduced.matches,drag=false,lastX=0,visible=true,time=0,previous=0;
  function label(){button.textContent=paused?'Play / 播放':'Pause / 暂停';button.setAttribute('aria-pressed',String(paused));}
  label();button.onclick=()=>{paused=!paused;label();};
  slider.oninput=()=>{angle=Number(slider.value)*Math.PI/180;paused=true;label();};
  canvas.onpointerdown=e=>{drag=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId);};
  canvas.onpointermove=e=>{if(drag){angle+=(e.clientX-lastX)*.008;lastX=e.clientX;slider.value=Math.round(angle*180/Math.PI);}};
  canvas.onpointerup=canvas.onpointercancel=()=>drag=false;
  canvas.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();angle+=(e.key==='ArrowLeft'?-.1:.1);}};
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(stage);
  function draw(now){
    const delta=Math.min((now-previous)/1000,.05);previous=now;
    if(visible&&!document.hidden){
      if(!paused&&!drag){time+=delta;angle+=delta*.12;}
      const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
      if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      const scale=Math.min(w/5.6,h/3.6),cos=Math.cos(angle),sin=Math.sin(angle);
      const project=(x,y,z)=>{const a=x*cos-z*sin,b=x*sin+z*cos;return [w/2+a*scale,h*.55+(b*.48-y*.88)*scale,b*.88+y*.48];};
      function polygon(points,fill,stroke){
        ctx.beginPath();points.forEach((p,i)=>{const q=project(...p);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.6;ctx.stroke();}
      }
      const faces=[],round=stage.dataset.model!=='steel',n=round?96:4;
      const ring=(i,r,y)=>{const a=i/n*Math.PI*2+Math.PI/4;return [Math.cos(a)*r*(round?1.35:1.65),y,Math.sin(a)*r];};
      for(let i=0;i<n;i++){
        const points=[ring(i,1,0),ring(i+1,1,0),ring(i+1,1,.55),ring(i,1,.55)];
        const light=Math.round(105+85*(.5+.5*Math.cos(i/n*Math.PI*2+angle)));
        faces.push({points,depth:points.reduce((s,p)=>s+project(...p)[2],0)/4,fill:`rgb(${light},${light+8},${light+12})`});
      }
      const shadow=ctx.createRadialGradient(w/2,h*.72,10,w/2,h*.72,w*.32);shadow.addColorStop(0,'#0009');shadow.addColorStop(1,'#0000');ctx.fillStyle=shadow;ctx.fillRect(0,0,w,h);
      faces.sort((a,b)=>b.depth-a.depth).forEach(f=>polygon(f.points,f.fill,'#c6e0e133'));
      polygon(Array.from({length:n},(_,i)=>ring(i,1,.55)),'#b8cbcc','#ebffff');
      polygon(Array.from({length:n},(_,i)=>ring(i,.88,.56)),stage.dataset.model==='signature'?'#23477a':'#087b8a','#90e3ed');
      for(let j=0;j<8;j++){
        const r=.12+j*.095+Math.sin(time*1.2+j)*.012;
        ctx.beginPath();for(let i=0;i<=96;i++){const a=i/96*Math.PI*2;const q=project(Math.cos(a)*r*1.3,.565,Math.sin(a)*r*.78);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}
        ctx.strokeStyle='rgba(172,243,245,.16)';ctx.stroke();
      }
      if(stage.dataset.model!=='steel'){
        for(let i=0;i<48;i++){
          const a=i/48*Math.PI*2,x=Math.cos(a)*1.65,z=Math.sin(a)*1.65;
          const height=stage.dataset.model==='show'?.5+.5*Math.sin(time*1.5+i*.4):.9;
          const q=project(x,.1,z),top=project(x,height,z);
          ctx.strokeStyle=stage.dataset.model==='show'?'#79dedba0':'#aa99ff60';ctx.lineWidth=stage.dataset.model==='show'?2:1;ctx.beginPath();ctx.moveTo(...q.slice(0,2));ctx.lineTo(...top.slice(0,2));ctx.stroke();
          ctx.fillStyle='#d0c6ff';ctx.beginPath();ctx.arc(top[0],top[1],1.6,0,Math.PI*2);ctx.fill();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
});
