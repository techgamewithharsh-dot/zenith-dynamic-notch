/* Small, deliberate interactions. No continuously running decorative loop. */
(() => {
 const stage=document.querySelector('.island-theater');
 if(stage){
  const content={
   music:{title:'A little closer<br>to your favorite song.',description:'Playback, progress and a glance at what’s playing.<br>Right above everything else.',label:'01 / MUSIC',alt:'Actual Zenith music panel'},
   files:{title:'Drop it here.<br>Take it anywhere.',description:'Keep files close. Share them, convert them,<br>or pick up where you left off.',label:'02 / FILES',alt:'Actual Zenith file sharing and conversion panel'},
   focus:{title:'Your time.<br>A little more focused.',description:'Set a timer and stay in your flow.<br>Your countdown stays quietly in sight.',label:'03 / FOCUS',alt:'Actual Zenith focus timer panel'}
  };
  let request=0;
  stage.querySelectorAll('[data-island-tab]').forEach(button=>button.addEventListener('click',async()=>{
   const key=button.dataset.islandTab,data=content[key];if(stage.dataset.island===key)return;
   const id=++request, image=new Image();image.src=`assets/editorial/${key}.webp`;
   try{await image.decode();}catch{return;}if(id!==request)return;
   const preview=document.getElementById('island-preview');preview.src=image.src;preview.alt=data.alt;
   stage.dataset.island=key;
   document.getElementById('island-title').innerHTML=data.title;
   document.getElementById('island-description').innerHTML=data.description;
   document.getElementById('island-kicker').textContent=data.label;
   document.getElementById('island-counter').textContent=data.label.slice(0,2)+' — 03';
   stage.querySelectorAll('[data-island-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   if(!matchMedia('(prefers-reduced-motion: reduce)').matches)preview.animate([{opacity:.45,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'cubic-bezier(.2,.75,.2,1)'});
  }));
 }
 document.querySelectorAll('[data-gallery-step]').forEach(button=>button.addEventListener('click',()=>{
  const dots=[...document.querySelectorAll('[data-slide]')];
  const current=dots.findIndex(b=>b.getAttribute('aria-pressed')==='true');
  dots[(current+Number(button.dataset.galleryStep)+dots.length)%dots.length]?.click();
 }));
})();
