// DFOUR mobile layout behaviour (only does anything inside #m, which is visible at <=900px)
(()=>{
const m=document.getElementById('m');if(!m)return;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const desk=matchMedia('(min-width:901px)');

// ---------- full-screen menu
const btn=m.querySelector('.m-menu'),nav=m.querySelector('.m-nav');
function setMenu(open){
  m.classList.toggle('m-open',open);document.body.classList.toggle('m-lock',open);
  btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Close menu':'Open menu');
  if(open)setTimeout(()=>nav.querySelector('a.l')?.focus({preventScroll:true}),400);
}
btn.addEventListener('click',()=>setMenu(!m.classList.contains('m-open')));
nav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('m-open')){setMenu(false);btn.focus()}});
desk.addEventListener('change',e=>{if(e.matches)setMenu(false)});

// ---------- highlight the current section in the menu
const ids=['m-home','m-about','m-process','m-services','m-clients','m-team','m-contact'];
const secs=ids.map(id=>document.getElementById(id)),links=[...nav.querySelectorAll('a.l')];
function mark(){
  let cur=ids[0];secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<=innerHeight*.4)cur=ids[i]});
  links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+cur));
}
addEventListener('scroll',mark,{passive:true});mark();

// ---------- reveal (ghost words) + count-up (stats)
const rio=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');rio.unobserve(en.target)}}),{threshold:.2});
m.querySelectorAll('.m-rv').forEach(el=>rio.observe(el));
const cio=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;const el=en.target;cio.unobserve(el);
  const to=+el.dataset.count,suf=el.dataset.suf||'',t0=performance.now(),dur=reduce?1:1600;
  (function step(t){const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(step)})(t0);
}),{threshold:.6});
m.querySelectorAll('.m-cnt').forEach(el=>{el.textContent='0'+(el.dataset.suf||'');cio.observe(el)});

// ---------- services carousel dots (native scroll-snap, dots follow)
const car=m.querySelector('#m-svc-car'),dots=[...m.querySelectorAll('.m-dots button')];
if(car&&dots.length){
  const cards=[...car.children];
  const step=()=>cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:car.clientWidth;
  let raf;
  car.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{
    const i=Math.max(0,Math.min(cards.length-1,Math.round(car.scrollLeft/step())));
    dots.forEach((d,j)=>{d.classList.toggle('on',j===i);d.setAttribute('aria-current',j===i)})})},{passive:true});
  dots.forEach((d,i)=>d.addEventListener('click',()=>car.scrollTo({left:i*step(),behavior:reduce?'auto':'smooth'})));
}

// ---------- floating CTA: visible after the hero, hidden near the contact section
const fab=m.querySelector('.m-fab');let inHero=true,inContact=false;
const upd=()=>fab.classList.toggle('show',!inHero&&!inContact&&!m.classList.contains('m-open'));
new IntersectionObserver(es=>{inHero=es[0].isIntersecting;upd()},{threshold:.35}).observe(document.getElementById('m-home'));
new IntersectionObserver(es=>{inContact=es[0].isIntersecting;upd()},{threshold:.15}).observe(document.getElementById('m-contact'));
new MutationObserver(upd).observe(m,{attributes:true,attributeFilter:['class']});
})();
