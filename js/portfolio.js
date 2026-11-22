// ---- Edit the live-site URLs here (empty = button does nothing yet) ----
const LIVE={wedding:'',dreamer:'',portfolio:'',unique:'',aurea:''};

const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
// ---- scale the 1920px Figma header/footer to the viewport
const pairs=[['pfh','pfhc',97],['pff','pffc',665]];
function fit(){const k=document.documentElement.clientWidth/1920;
  pairs.forEach(([w,c,h])=>{const W=document.getElementById(w),C=document.getElementById(c);if(!W||!C)return;
    C.style.transform=`scale(${k})`;W.style.height=h*k+'px'});}
addEventListener('resize',fit);fit();
const hdr=document.getElementById('hdr');
addEventListener('scroll',()=>hdr&&hdr.classList.toggle('stuck',scrollY>10),{passive:true});

// ---- live-site links
document.querySelectorAll('a.live').forEach(a=>{
  const u=LIVE[a.dataset.live];
  if(u){a.href=u;a.target='_blank';a.rel='noopener'}
  else a.addEventListener('click',e=>e.preventDefault());
});

// ---- filters (desktop tabs + mobile chips)
const items=[...document.querySelectorAll('.pf-row,.pm-card')],empties=[...document.querySelectorAll('.pf-empty')];
const btns=[...document.querySelectorAll('.pf-tab,.pm-chip')];
function filter(f){
  btns.forEach(b=>b.classList.toggle('on',b.dataset.f===f));
  let shown=0;
  items.forEach(el=>{const ok=f==='all'||el.dataset.cat.split(' ').includes(f);el.hidden=!ok;if(ok){shown++;el.classList.remove('in');void el.offsetWidth;io.observe(el)}});
  const n=shown/2; // each project exists once for desktop and once for mobile
  empties.forEach(e=>e.hidden=n>0);
}
btns.forEach(b=>b.addEventListener('click',()=>filter(b.dataset.f)));

// ---- reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
items.forEach(el=>io.observe(el));

// ---- mobile menu (same behaviour as the home page)
const m=document.getElementById('m'),btn=m.querySelector('.m-menu'),nav=m.querySelector('.m-nav');
function setMenu(open){m.classList.toggle('m-open',open);document.body.classList.toggle('m-lock',open);
  btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Close menu':'Open menu')}
btn.addEventListener('click',()=>setMenu(!m.classList.contains('m-open')));
nav.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('m-open')){setMenu(false);btn.focus()}});
matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)setMenu(false)});
