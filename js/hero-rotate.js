// Hero headline: Web Development → UI/UX Development → Brand Identity → Digital Marketing (every 3s)
(()=>{
const SETS=[['Web','Development'],['UI/UX','Development'],['Brand','Identity'],['Digital','Marketing']];
const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const heroes=[
  {el:document.querySelector('#canvas h1'),html:(a,b)=>`${a}<br/>${b}`},
  {el:document.querySelector('.m-plate h1'),html:(a,b)=>`${a}<b>${b}</b>`}
].filter(h=>h.el);
if(!heroes.length)return;
let i=0,busy=false;
async function swap(h,n){
  const el=h.el,[a,b]=SETS[n];
  if(reduce){el.innerHTML=h.html(a,b);return}
  const out=el.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-22px)'}],{duration:320,easing:'ease-in',fill:'forwards'});
  await out.finished;
  el.innerHTML=h.html(a,b);
  const inn=el.animate([{opacity:0,transform:'translateY(26px)'},{opacity:1,transform:'none'}],{duration:520,easing:'cubic-bezier(.2,.7,.2,1)'});
  out.cancel();await inn.finished;
}
async function next(){
  if(busy||document.hidden)return;busy=true;
  i=(i+1)%SETS.length;
  try{await Promise.all(heroes.map(h=>swap(h,i)))}finally{busy=false}
}
let started=false;
function start(){if(started)return;started=true;setInterval(next,3000)}
if(!root.classList.contains('loading'))start();else addEventListener('dfour:ready',start,{once:true});
})();
