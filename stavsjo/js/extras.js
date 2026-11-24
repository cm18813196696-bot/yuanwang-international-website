/* STAVSJÖ — small UX extras: scroll progress, header state, back-to-top, FAQ accordion */
(function(){
  const $=s=>document.querySelector(s);
  const bar=$('#sprog'),top=$('#totop'),head=document.querySelector('header');
  function onScroll(){
    const h=document.documentElement,max=h.scrollHeight-innerHeight;
    if(bar)bar.style.transform='scaleX('+(max>0?Math.min(1,scrollY/max):0)+')';
    if(top)top.classList.toggle('on',scrollY>900);
    if(head)head.classList.toggle('scrolled',scrollY>8);
  }
  addEventListener('scroll',onScroll,{passive:true});addEventListener('hashchange',()=>setTimeout(onScroll,80));onScroll();
  if(top)top.onclick=()=>scrollTo({top:0,behavior:'smooth'});

  /* FAQ: one answer open at a time */
  document.querySelectorAll('.faq details').forEach(d=>d.addEventListener('toggle',()=>{
    if(d.open)document.querySelectorAll('.faq details[open]').forEach(o=>{if(o!==d)o.open=false});
  }));

  /* "Cookie preferences" buttons inside pages reuse the footer button */
  document.addEventListener('click',e=>{if(e.target.closest('[data-ck]')){const b=$('#ckAgain');if(b)b.click()}});

  /* mark the current nav dropdown */
  function markNav(){
    const h=location.hash||'#home';
    document.querySelectorAll('#links .dd').forEach(dd=>dd.classList.toggle('cur',!!dd.querySelector('a[href="'+h+'"]')));
  }
  addEventListener('hashchange',markNav);markNav();
})();
