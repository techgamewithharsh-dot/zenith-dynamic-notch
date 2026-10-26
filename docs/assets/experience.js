/* One owner for the new native-EQ demonstration and lower-page visual movement. */
(() => {
 'use strict';
 const root=document.querySelector('.sound-journey');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=x=>Math.max(0,Math.min(1,x));
 const ease=x=>x*x*(3-2*x);
 const closing=document.querySelector('#download');
 let frame=0;
 function render(){
  frame=0;
  if(root){
   const r=root.getBoundingClientRect(),h=innerHeight;
   if(r.bottom>0&&r.top<h){
    const enter=reduce.matches?1:ease(clamp((h-r.top)/(h*.85)));
    const p=reduce.matches?0:clamp(-r.top/Math.max(1,r.height-h));
    root.style.setProperty('--sound-y',`${(1-enter)*95}px`);
    root.style.setProperty('--sound-tilt',`${(1-enter)*20}deg`);
    root.style.setProperty('--sound-turn',`${Math.sin(p*Math.PI*2)*5}deg`);
    root.style.setProperty('--sound-scale',String(.88+enter*.12+Math.sin(p*Math.PI)*.035));
    root.style.setProperty('--sound-copy-y',`${-p*12}px`);
    root.style.setProperty('--sound-halo',String(.9+p*.3));
   }
  }
  if(closing&&!reduce.matches){const r=closing.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)closing.style.setProperty('--closing-drift',`${(clamp((innerHeight-r.top)/(innerHeight+r.height))-.5)*70}px`)}
 }
 const scheduleRender=()=>{if(!frame)frame=requestAnimationFrame(render)};
 addEventListener('scroll',scheduleRender,{passive:true});addEventListener('resize',scheduleRender);reduce.addEventListener('change',scheduleRender);render();
 document.querySelectorAll('[data-mood]').forEach(button=>button.addEventListener('click',()=>{
  closing.dataset.mood=button.dataset.mood;
  document.querySelectorAll('[data-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 }));
 if(!root)return;
 const stage=root.querySelector('.sound-theater'),notch=root.querySelector('.sound-notch'),video=root.querySelector('video');
 const native=root.querySelector('.sound-native-eq'),status=root.querySelector('#sound-state'),autoButton=root.querySelector('#sound-auto');
 const ns='http://www.w3.org/2000/svg';
 const svg=(tag,attrs)=>{const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));return el};
 const grid=root.querySelector('.sound-eq-grid'),rails=root.querySelector('.sound-eq-rails');
 for(let i=0;i<9;i++)grid.append(svg('path',{d:`M218 ${144+i*28}H820`,stroke:'#414141','stroke-width':i===4?2:1.6}));
 const knobs=[],fills=[];
 for(const x of [247,307,369,431,493,555,617,679,741,803]){
  rails.append(svg('rect',{x:x-4,y:122,width:8,height:266,rx:4,fill:'#141414'}));
  const fill=svg('rect',{x:x-4,y:255,width:8,height:0,rx:3,fill:'#fa3356',class:'sound-eq-fill'});rails.append(fill);fills.push(fill);
  const knob=svg('g',{class:'sound-eq-knob'});knob.append(svg('circle',{cx:x,cy:255,r:16,fill:'#929795'}),svg('circle',{cx:x,cy:255,r:8,fill:'#ff3659'}));rails.append(knob);knobs.push(knob);
 }
 const curves={headphones:[5.5,4.2,3.5,2.5,1.2,0,0,0,2.2,3.7],speakers:Array(10).fill(0)};
 let output='speakers',auto=!reduce.matches,visible=false,cycle=0,toastTimer=0,away=false;
 const stop=()=>{clearTimeout(cycle);cycle=0};
 const playing=()=>visible&&!document.hidden&&!away;
 const sync=()=>{autoButton.textContent=auto?'Pause demo':'Play demo';autoButton.setAttribute('aria-pressed',String(auto));autoButton.setAttribute('aria-label',auto?'Pause connection demo':'Play connection demo')};
 function animateVideo(){if(playing()&&!reduce.matches&&notch.dataset.toast!=='idle')video.play().catch(()=>{});else video.pause()}
 function setOutput(next,toast=true){
  output=next;stage.dataset.output=next;
  const connected=next==='headphones';
  status.textContent=connected?'AirPods Pro · Saved EQ loaded':'Mac speakers · Flat EQ';
  native.setAttribute('aria-label',`Apple Music Equalizer, ${connected?'saved AirPods':'flat speaker'} profile`);
  curves[next].forEach((db,i)=>{const delta=-db*(112/12);knobs[i].style.transform=`translateY(${delta}px)`;fills[i].setAttribute('y',Math.min(255,255+delta));fills[i].setAttribute('height',Math.abs(delta))});
  root.querySelectorAll('[data-sound-output]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.soundOutput===next)));
  clearTimeout(toastTimer);
  if(toast){
   notch.dataset.toast=connected?'connected':'disconnected';
   notch.querySelector('small').textContent=connected?'Connected':'Disconnected';
   notch.querySelector('.sound-notch-check').textContent=connected?'✓':'×';
   video.currentTime=0;animateVideo();
   toastTimer=setTimeout(()=>{notch.dataset.toast='idle';video.pause()},3200);
  }
 }
 function schedule(){stop();sync();animateVideo();if(auto&&playing())cycle=setTimeout(()=>{setOutput(output==='speakers'?'headphones':'speakers');schedule()},4800)}
 root.querySelectorAll('[data-sound-output]').forEach(b=>b.addEventListener('click',()=>{auto=false;setOutput(b.dataset.soundOutput);schedule()}));
 autoButton.addEventListener('click',()=>{auto=!auto;schedule()});
 new IntersectionObserver(entries=>{const was=visible;visible=entries[0].isIntersecting;if(visible&&!was&&auto){setOutput('headphones')}schedule()},{threshold:.55}).observe(stage);
 document.addEventListener('visibilitychange',schedule);
 reduce.addEventListener('change',()=>{if(reduce.matches)auto=false;schedule()});
 addEventListener('pagehide',()=>{away=true;stop();clearTimeout(toastTimer);video.pause()});addEventListener('pageshow',()=>{away=false;schedule()});
 setOutput('speakers',false);sync();
})();

/* Local preview only: no camera, credentials or authentication requests. */
(()=>{
 const root=document.querySelector('#face-unlock');if(!root)return;
 const trigger=root.querySelector('.face-trigger'),label=root.querySelector('.face-scan-label'),status=root.querySelector('.face-status');
 let timers=[];const clear=()=>{timers.forEach(clearTimeout);timers=[];};
 const reset=()=>{clear();root.dataset.state='locked';trigger.disabled=false;trigger.textContent='Try face unlock ↗';label.textContent='Ready when you are';status.textContent='Interactive preview · No camera access';};
 trigger.addEventListener('click',()=>{
  clear();root.dataset.state='scanning';trigger.disabled=true;label.textContent='Looking for you…';status.textContent='Scanning · Simulated preview';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  timers.push(setTimeout(()=>{root.dataset.state='verified';label.textContent='Recognized';status.textContent='Recognized · Unlocking…';},reduced?100:1700));
  timers.push(setTimeout(()=>{root.dataset.state='unlocked';trigger.disabled=false;trigger.textContent='Replay unlock ↗';status.textContent='Welcome back · Demo unlocked';},reduced?250:2700));
 });
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)reset();},{threshold:0}).observe(root);
 addEventListener('pagehide',reset);
 const inputs=[...document.querySelectorAll('[data-price]')],total=document.querySelector('#value-total');
 inputs.forEach(input=>input.addEventListener('change',()=>{total.textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(inputs.reduce((sum,item)=>sum+(item.checked?Number(item.dataset.price):0),0));}));
})();
