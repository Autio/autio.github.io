const nav=document.getElementById('nav'),menu=document.getElementById('navLinks'),toggle=document.getElementById('navToggle');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>20),{passive:true});
toggle.addEventListener('click',()=>{const open=menu.classList.toggle('active');toggle.setAttribute('aria-expanded',String(open));});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('active');toggle.setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('active')){menu.classList.remove('active');toggle.setAttribute('aria-expanded','false');toggle.focus();}});
// The game is our own same-origin document. Fit its sheet rather than clipping
// enlarged text, open rules, or settings; keep normal iframe scrolling available.
const frame=document.getElementById('play');let observer,fitRequest;
function fitGame(){cancelAnimationFrame(fitRequest);fitRequest=requestAnimationFrame(()=>{try{const sheet=frame.contentDocument.querySelector('main');if(!sheet)return;const css=frame.contentWindow.getComputedStyle(sheet),height=Math.ceil(sheet.getBoundingClientRect().height+parseFloat(css.marginTop)+parseFloat(css.marginBottom)+2);if(Number.isFinite(height)&&height>0&&Math.abs(frame.getBoundingClientRect().height-height)>2)frame.style.blockSize=height+'px';}catch{}});}
function watchGame(){observer?.disconnect();try{const doc=frame.contentDocument,sheet=doc.querySelector('main');if(!sheet)return;
 // Remove viewport-height feedback while fitting the embedded sheet. This is
 // presentation-only: the downloadable game remains exactly the tested file.
 if(!doc.getElementById('embedded-fit')){const css=doc.createElement('style');css.id='embedded-fit';css.textContent='body{min-block-size:0}main{margin-block:16px!important}@media(min-width:600px){main{inline-size:min(calc(100% - 3rem),32rem)!important}}';doc.head.append(css);}
 if('ResizeObserver'in window){observer=new ResizeObserver(fitGame);observer.observe(sheet);}doc.fonts?.ready.then(fitGame);
 }catch{}fitGame();}
frame.addEventListener('load',watchGame);
try{if(frame.contentDocument?.readyState==='complete')watchGame();}catch{}
window.addEventListener('resize',fitGame);

if('ResizeObserver'in window){const navSize=new ResizeObserver(()=>document.documentElement.style.setProperty('--nav-height',nav.getBoundingClientRect().height+'px'));navSize.observe(nav);}
