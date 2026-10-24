(() => {
 const root=document.querySelector('.zenith-highlights');if(!root)return;
 const ns='http://www.w3.org/2000/svg',reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const make=(tag,attrs)=>{const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));return e};
 const eq=root.querySelector('.native-eq'),rails=eq?.querySelector('.eq-rails'),grid=eq?.querySelector('.eq-grid');
 const thumbs=[],levels=[];
 if(eq&&rails&&grid){
  // The native 880 × 450 capture preserves Music’s actual chrome, labels and preamp.
  // Repaint only the ten-band plot so its handles can move between example profiles.
  for(let i=0;i<9;i++){const y=144+i*28;grid.append(make('path',{d:`M218 ${y}H820`,stroke:'#414141','stroke-width':i===4?2:1.6,fill:'none'}))}
  for(const x of [247,307,369,431,493,555,617,679,741,803]){
   rails.append(make('rect',{x:x-4,y:122,width:8,height:266,rx:4,fill:'#141414'}));
   const level=make('rect',{x:x-4,y:255,width:8,height:0,rx:3,fill:'#fa3356',class:'eq-level'});levels.push(level);rails.append(level);
   const thumb=make('g',{class:'eq-thumb',transform:'translate(0 0)'});thumb.append(make('circle',{cx:x,cy:255,r:16,fill:'#929795'}),make('circle',{cx:x,cy:255,r:8,fill:'#ff3659'}));thumbs.push(thumb);rails.append(thumb);
  }
  const curves={speakers:[1.2,.5,-.4,-1.3,-.6,.4,1.3,1.9,1.1,.4],headphones:[5.5,4.2,3.5,2.5,1.2,0,0,0,2.2,3.7]};
  const status=root.querySelector('#eq-demo-status'),badge=root.querySelector('.eq-demo-status');
  const surface=root.querySelector('.eq-demo'),connection=root.querySelector('.eq-connection'),autoButton=root.querySelector('[data-eq-autoplay]');
  let current='speakers',cycleTimer=0,visible=false,paused=reduced.matches,pageAway=false;
  const canCycle=()=>visible&&!document.hidden&&!paused&&!pageAway;
  function stopCycle(){clearTimeout(cycleTimer);cycleTimer=0}
  function scheduleCycle(){stopCycle();if(canCycle())cycleTimer=setTimeout(()=>{output(current==='speakers'?'headphones':'speakers');scheduleCycle()},4000)}
  function syncControls(){autoButton.textContent=paused?'Play':'Pause';autoButton.setAttribute('aria-label',paused?'Play automatic EQ preview':'Pause automatic EQ preview');autoButton.setAttribute('aria-pressed',String(!paused))}

  function output(which,animate=true){
   const label=which==='speakers'?'Mac speakers':'Headphones',curve=curves[which];if(!curve)return;
   const was=current;current=which;surface.dataset.output=which;
   connection.querySelector('.eq-connection-title').textContent=which==='headphones'?'Headphones connected':(animate?'Headphones disconnected':'Mac speakers active');
   connection.querySelector('.eq-connection-detail').textContent=which==='headphones'?'Your saved headphone sound':'Your saved speaker sound';
   connection.classList.remove('connection-arrive','connection-leave');
   if(animate&&was!==which&&!reduced.matches)requestAnimationFrame(()=>connection.classList.add(which==='headphones'?'connection-arrive':'connection-leave'));

   thumbs.forEach((thumb,i)=>{const delta=-curve[i]*(112/12);if(!animate)thumb.style.transition='none';thumb.style.transform=`translateY(${delta}px)`;const level=levels[i];if(!animate)level.style.transition='none';level.setAttribute('y',Math.min(255,255+delta));level.setAttribute('height',Math.abs(delta))});
   root.querySelectorAll('[data-eq-output]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.eqOutput===which)));
   eq.setAttribute('aria-label',`Apple Music Equalizer preview showing the saved ${label.toLowerCase()} curve`);status.textContent=`${label} · Saved sound loaded`;
   badge.classList.remove('changed');if(animate&&!reduced.matches)requestAnimationFrame(()=>badge.classList.add('changed'));
  }
  output('speakers',false);requestAnimationFrame(()=>requestAnimationFrame(()=>{thumbs.forEach(t=>t.style.removeProperty('transition'));levels.forEach(l=>l.style.removeProperty('transition'))}));
  root.querySelectorAll('[data-eq-output]').forEach(b=>b.addEventListener('click',()=>{if(current!==b.dataset.eqOutput)output(b.dataset.eqOutput);scheduleCycle()}));
  autoButton.addEventListener('click',()=>{paused=!paused;syncControls();scheduleCycle()});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;scheduleCycle()},{threshold:0}).observe(surface);
  document.addEventListener('visibilitychange',scheduleCycle);
  reduced.addEventListener('change',()=>{paused=reduced.matches;syncControls();scheduleCycle()});
  window.addEventListener('pagehide',()=>{pageAway=true;stopCycle()});
  window.addEventListener('pageshow',()=>{pageAway=false;scheduleCycle()});syncControls();
 }
 const file=root.querySelector('.file-demo'),convert=root.querySelector('[data-convert-demo]');let conversionTimer=0;
 convert?.addEventListener('click',()=>{
  if(file.dataset.state==='done'){file.dataset.state='ready';file.querySelector('.file-demo-label').textContent='3 images ready';convert.innerHTML='Try converting <span aria-hidden="true">→</span>';return}
  file.dataset.state='converting';convert.disabled=true;file.querySelector('.file-demo-label').textContent='Making your PDF…';
  conversionTimer=setTimeout(()=>{file.dataset.state='done';file.querySelector('.file-demo-label').textContent='Photos.pdf · Ready in its folder';convert.innerHTML='Try again <span aria-hidden="true">↻</span>';convert.disabled=false;conversionTimer=0},reduced.matches?0:850);
 });
 const game=root.querySelector('.game-demo'),gameButton=root.querySelector('[data-game-demo]');
 gameButton?.addEventListener('click',()=>{const busy=game.classList.toggle('busier');game.querySelector('.demo-cpu').innerHTML=(busy?'61':'32')+'<small>%</small>';game.querySelector('.demo-gpu').innerHTML=(busy?'84':'58')+'<small>%</small>';gameButton.innerHTML=(busy?'Back to a quieter moment':'Show a busier moment')+' <span aria-hidden="true">↗</span>'});
 const pin=root.querySelector('.pin-demo'),pinButton=root.querySelector('[data-pin-demo]'),outside=root.querySelector('[data-outside-demo]'),pinStatus=pin?.querySelector('.pin-demo-status');let pinned=false;
 pinButton?.addEventListener('click',()=>{pinned=!pinned;pin.classList.toggle('pinned',pinned);pinButton.setAttribute('aria-pressed',String(pinned));pinButton.setAttribute('aria-label',pinned?'Unpin example note':'Pin example note');pinStatus.textContent=pinned?'Pinned. Now try clicking outside.':'Unpinned. Clicking away closes it.'});
 outside?.addEventListener('click',()=>{if(pin.classList.contains('closed')){pin.classList.remove('closed');outside.innerHTML='Click outside the note <span aria-hidden="true">↗</span>';pinStatus.textContent='Try pinning it before clicking away.';return}if(pinned){pinStatus.textContent='Still here. That’s the point of pinning.'}else{pin.classList.add('closed');pinStatus.textContent='Unpinned notes close when you click away.';outside.innerHTML='Open the note again <span aria-hidden="true">↻</span>'}});
 const launcher=root.querySelector('.launcher-demo'),launcherGrid=launcher?.querySelector('.launcher-grid-preview'),swipeButton=root.querySelector('[data-swipe-demo]');
 let swiped=false;
 swipeButton?.addEventListener('click',()=>{
  swiped=!swiped;
  launcherGrid?.classList.toggle('swiped',swiped);
  swipeButton.innerHTML=swiped?'Release to Spring Snap <span aria-hidden="true">←</span>':'Simulate 2-Finger Swipe <span aria-hidden="true">→</span>';
 });
 // One visibility-gated four-second timer; no real device access or audio-route changes.
 window.addEventListener('pagehide',()=>{if(conversionTimer)clearTimeout(conversionTimer)});
})();
