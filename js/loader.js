// 3-second preloader: counter + bar run 0→100 over 3s, then the curtain lifts
(()=>{
const el=document.getElementById('loader'),root=document.documentElement;if(!el)return;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const ready=()=>dispatchEvent(new Event('dfour:ready'));
const finish=()=>{root.classList.remove('loading');el.remove();ready()};
if(reduce){finish();return}
const num=el.querySelector('.ld-num'),bar=el.querySelector('.ld-bar i'),DUR=3000,t0=performance.now();
scrollTo(0,0);
(function tick(t){
  const p=Math.min(1,(t-t0)/DUR),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2; // ease in-out
  num.textContent=Math.round(e*100);bar.style.transform=`scaleX(${e})`;
  if(p<1)return requestAnimationFrame(tick);
  el.classList.add('done');root.classList.remove('loading');ready();
  el.addEventListener('transitionend',()=>el.remove(),{once:true});
  setTimeout(()=>el.remove(),1200);
})(t0);
})();
