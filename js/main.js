// ---------- scale the 1920px Figma canvas to the viewport (exact proportions at every size)
const stage=document.getElementById('stage'),canvas=document.getElementById('canvas'),hdr=document.getElementById('hdr');
const W=1920,H=8290,HDR=97,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let k=1;
function fit(){k=document.documentElement.clientWidth/W;canvas.style.transform=`scale(${k})`;stage.style.height=H*k+'px';onScroll()}

// ---------- sticky header + active nav link
const anchors=[...document.querySelectorAll('.anc')].map(a=>({id:a.id,top:parseFloat(a.style.top)}));
const navLinks=[...hdr.querySelectorAll('a.t')];
function onScroll(){
  const y=Math.max(0,scrollY/k);
  hdr.style.top=y+'px';hdr.classList.toggle('stuck',y>10);
  let cur='home';for(const a of anchors){if(y+HDR+120>=a.top)cur=a.id}
  navLinks.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+cur));
}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',fit);fit();

// ---------- smooth in-page links (account for the sticky header)
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  if(a.closest('#m'))return; // mobile layout uses native smooth scrolling (see css/mobile.css)
  const id=a.getAttribute('href').slice(1);if(!id)return;const el=document.getElementById(id);if(!el)return;
  e.preventDefault();
  const top=(parseFloat(el.style.top)-(id==='home'?0:HDR))*k;
  scrollTo({top,behavior:reduce?'auto':'smooth'});history.replaceState(null,'','#'+id);
}));

// ---------- reveal on scroll + count-up
const io=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;const el=en.target;io.unobserve(el);el.classList.add('in');
  const d=parseFloat(getComputedStyle(el).getPropertyValue('--d'))||0;
  setTimeout(()=>el.classList.add('done'),(d+1.1)*1000);
}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
const cio=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return;const el=en.target;cio.unobserve(el);
  const to=+el.dataset.count,suf=el.dataset.suf||'',t0=performance.now(),dur=reduce?1:1800;
  (function step(t){const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(step)})(t0);
}),{threshold:.6});
document.querySelectorAll('.cnt').forEach(el=>{el.textContent='0'+el.dataset.suf;cio.observe(el)});

// ---------- services carousel: 4 cards, dots, swipe/drag, autoplay
const row=document.getElementById('cards'),dots=[...document.querySelectorAll('.cdot')],STEP=1079,N=4;
let idx=0,timer,vis=false;
// dot geometry from the design: active 19px, others 13px
function layoutDots(){
  let x=0;dots.forEach((d,i)=>{const a=i===idx,s=a?19:13;
    Object.assign(d.style,{left:x+'px',top:(a?4.9:7.9)+'px',width:s+'px',height:s+'px',background:a?'#00df82':'rgba(0,223,130,.4)'});
    d.classList.toggle('on',a);x+=s+(a||i+1===idx?11.9:8)})}
function go(i){idx=(i+N)%N;row.style.transform=`translateX(${-STEP*idx}px)`;layoutDots();restart()}
function restart(){clearInterval(timer);if(!reduce&&vis)timer=setInterval(()=>go(idx+1),5000)}
dots.forEach((d,i)=>{d.addEventListener('click',()=>go(i));d.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go(i)}})});
document.getElementById('services-wrap')?.addEventListener('mouseenter',()=>clearInterval(timer));
row.parentElement.addEventListener('mouseenter',()=>clearInterval(timer));
row.parentElement.addEventListener('mouseleave',restart);
let sx=0,dx=0,drag=false,moved=false;
row.addEventListener('pointerdown',e=>{drag=true;moved=false;sx=e.clientX;dx=0;row.classList.add('drag');row.setPointerCapture(e.pointerId)});
row.addEventListener('pointermove',e=>{if(!drag)return;dx=(e.clientX-sx)/k;if(Math.abs(dx)>6)moved=true;row.style.transform=`translateX(${-STEP*idx+dx}px)`});
const end=()=>{if(!drag)return;drag=false;row.classList.remove('drag');if(dx<-120)go(idx+1);else if(dx>120)go(idx-1);else go(idx)};
row.addEventListener('pointerup',end);row.addEventListener('pointercancel',end);
row.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
go(0);
// start on the first card (Web Development) every time the carousel scrolls into view; only autoplay while visible
new IntersectionObserver(es=>{
  vis=es[0].isIntersecting;
  if(vis){restart()}
  else{clearInterval(timer);row.style.transition='none';idx=0;row.style.transform='translateX(0)';layoutDots();void row.offsetWidth;row.style.transition=''}
},{threshold:.2}).observe(row.parentElement);
