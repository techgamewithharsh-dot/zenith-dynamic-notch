/* Progressive enhancements. Content and downloads work without JavaScript. */
(() => {
 'use strict';
 const $ = (s) => document.querySelector(s);
 const $$ = (s) => [...document.querySelectorAll(s)];
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 if(!CSS.supports('animation-timeline: view()'))document.documentElement.classList.add('no-scroll-timeline');
 const menu=$('.mobile-menu');const toggle=$('.menu-toggle');
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.hidden=!open;});
 menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false');}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu&&!menu.hidden){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus();}});

 const clockKeys=['modern','rounded','serif'];let clockChoice='modern',clockManual=false;
 const clockCapture=$('.clock-capture');
 if(clockCapture)clockKeys.slice(1).forEach(key=>{const image=new Image();image.src=`assets/editorial/clock-${key}.webp`;image.alt=`Actual Zenith ${key} clock at 11:23`;image.className='clock-layer';image.dataset.style=key;clockCapture.append(image);});
 const setClock=key=>{clockChoice=key;if(!clockCapture)return;[...clockCapture.querySelectorAll('img')].forEach(img=>img.style.opacity=(img.dataset.style||'modern')===key?'1':'0');$$('[data-clock]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.clock===key)));};
 $$('[data-clock]').forEach(b=>b.addEventListener('click',()=>{clockManual=true;setClock(b.dataset.clock);}));

 const scenes=[{section:$('.opening-sequence'),video:$('#hero-scroll-video'),length:10.52},
 {section:$('.wallpaper-sequence'),video:$('#lock-scroll-video'),length:20}].filter(s=>s.section&&s.video);
 const clamp=v=>Math.max(0,Math.min(1,v));
 scenes.forEach(scene=>{
  scene.target=0;
  scene.seek=()=>{const v=scene.video;if(v.readyState<1||v.seeking)return;
   const target=Math.min(scene.target,Math.max(0,v.duration-.04));
   if(Math.abs(v.currentTime-target)>.025)v.currentTime=target;
  };
  scene.video.addEventListener('loadedmetadata',scene.seek);
  scene.video.addEventListener('loadeddata',scene.seek);
  scene.video.addEventListener('seeked',scene.seek);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{
   if(entries.some(e=>e.isIntersecting)&&scene.video.preload==='none'){scene.video.preload='auto';scene.video.load();}
  },{rootMargin:'800px'}).observe(scene.section);
 });
 let pending=false;
 const updateScenes=()=>{
  pending=false;const height=innerHeight;
  scenes.forEach(scene=>{
   const r=scene.section.getBoundingClientRect();
   const p=clamp((-r.top)/Math.max(1,r.height-height));
   let videoProgress=p;
   if(scene.video.id==='hero-scroll-video'){
    // Start scrubbing once the MacBook rises into center-stage (p > 0.14)
    const q=clamp((p-.14)/.82);
    videoProgress=q<.38?(q/.38)*.26:q<.68?.26+((q-.38)/.30)*.55:.81+((q-.68)/.32)*.19;
    if(!reduced.matches&&innerHeight>=650){
     const enter=clamp(p/.18),copy=clamp(p/.14);
     $('.opening-copy').style.opacity=String(1-copy);
     $('.opening-copy').style.transform=`translateY(${-copy*95}px)`;
     const zoom=clamp((p-.22)/.38), retreat=clamp((p-.84)/.16);
     const magnify=1+zoom*(innerWidth<700?.26:.72)-retreat*.16;
     // At p=0 (enter=0), startY = 0.95 * height so the MacBook starts cleanly below the viewport
     // On first scroll, enter quickly increases from 0 to 1 and MacBook smoothly rises into center stage!
     const startY = (1-enter)*height*0.95;
     $('.opening-product').style.transform=`translateY(calc(-50% + ${startY+zoom*height*.18-retreat*height*.10}px)) scale(${magnify})`;
     $('.scroll-cue').style.opacity=String(1-clamp(p/.07));
    }
   }
   if(scene.video.id==='lock-scroll-video'){
    const lockP = clamp((p - 0.26) / 0.62);
    videoProgress = lockP;
    const lines=$$('.lyric-track p');
    const track=$('.lyric-track');
    const container=$('.scroll-lyrics');
    if(lines.length&&track&&container){
     const position=(reduced.matches?0:lockP)*(lines.length-1);
     const cH = container.clientHeight || 280;
     const line0 = lines[0];
     const line1 = lines[1];
     const stepY = (line1 && line0) ? (line1.offsetTop - line0.offsetTop) : 46;
     const activeCenter = (line0 ? line0.offsetTop : 40) + position * stepY + (line0 ? line0.offsetHeight / 2 : 16);
     const trackY = (cH / 2) - activeCenter;
     track.style.transform = `translate3d(0, ${trackY.toFixed(1)}px, 0)`;

     lines.forEach((line,i)=>{
      const distance=Math.abs(i-position);
      // Apple Music progressive focus curve — 5 to 6 lines visible simultaneously!
      const alpha = distance < 0.6 ? 1.0 : distance < 1.6 ? 0.78 - (distance - 0.6) * 0.18 : distance < 2.8 ? 0.58 - (distance - 1.6) * 0.16 : Math.max(0.24, 0.38 - (distance - 2.8) * 0.08);
      const blurAmount = distance < 0.75 ? 0 : Math.min(1.0, (distance - 0.75) * 0.30);
      const scale = Math.max(0.91, 1.04 - distance * 0.024);
      line.style.opacity = alpha.toFixed(3);
      line.style.filter = blurAmount > 0.12 ? `blur(${blurAmount.toFixed(2)}px)` : 'none';
      line.style.transform = `scale(${scale.toFixed(3)})`;
     });
    }
   }
   scene.target=reduced.matches?0:videoProgress*scene.length;scene.seek();
  });
  const landscape=$('.landscape-story');
  if(landscape&&!clockManual&&!reduced.matches){const r=landscape.getBoundingClientRect();const p=clamp(-r.top/Math.max(1,r.height-height));const key=clockKeys[Math.min(2,Math.floor(p*3))];if(key!==clockChoice)setClock(key);}
  const fold=$('.fold-story');
  if(fold&&!reduced.matches){
   const r=fold.getBoundingClientRect();const p=clamp(-r.top/Math.max(1,r.height-height));
   const phase=p<.5?p*2:(1-p)*2;
   window.zenithFold?.(phase);
   const pill=$('#fold-angle-pill');
   if(pill){const angle=Math.round(118-phase*46);pill.textContent=`HINGE SENSOR · ${angle}° LIVE BEND`;}
  }
  const immersive=$$('.immersive-scene').some(el=>{const r=el.getBoundingClientRect();return r.top<height*.12&&r.bottom>height*.88;});
  $('.site-header')?.classList.toggle('scene-hidden',immersive);
 };
 const queueScenes=()=>{if(!pending){pending=true;requestAnimationFrame(updateScenes);}};
 addEventListener('scroll',queueScenes,{passive:true});addEventListener('resize',queueScenes);
 reduced.addEventListener('change',queueScenes);updateScenes();

 const eq = $('#eq-demo');
 if (eq) {
  let device = 'headphones', auto = !reduced.matches, visible = false, timer, disconnectTimer;
  // Ten bands matching native Apple Music Equaliser: 32, 64, 125, 250, 500, 1K, 2K, 4K, 8K, 16K in dB (-12 to +12)
  const curves = {
   speakers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   headphones: [5.5, 4.2, 3.5, 2.0, 0.8, -0.4, 0.6, 2.4, 4.2, 5.0]
  };
  const island = $('#di-notch-island');
  const airpodSvg = $('.airpod-svg');
  const autoButton = $('#eq-auto');
  const presetLabel = $('#eq-preset-name');
  const livePill = $('#eq-live-pill');

  const update = (next) => {
   device = next;
   const isHeadphones = next === 'headphones';
   clearTimeout(disconnectTimer);

   // 1. Dynamic Island Notch animation (widens left-to-right on connect, exit animation on disconnect)
   if (island) {
    const titleEl = $('#di-device-title');
    const subEl = $('#di-device-sub');

    if (isHeadphones) {
     island.classList.remove('is-disconnecting');
     island.classList.add('is-connected');
     if (titleEl) titleEl.textContent = 'AirPods Pro';
     if (subEl) subEl.textContent = 'Connected · 100%';

     // Restart 3D AirPods rotation
     if (airpodSvg) {
      airpodSvg.style.animation = 'none';
      requestAnimationFrame(() => {
       requestAnimationFrame(() => {
        airpodSvg.style.animation = '';
       });
      });
     }
    } else {
     // Disconnection exit animation: brief disconnect badge then smooth collapse
     island.classList.remove('is-connected');
     island.classList.add('is-disconnecting');
     if (titleEl) titleEl.textContent = 'AirPods Pro';
     if (subEl) subEl.textContent = 'Disconnected';

     disconnectTimer = setTimeout(() => {
      island.classList.remove('is-disconnecting');
      if (titleEl) titleEl.textContent = 'Mac speakers';
      if (subEl) subEl.textContent = 'Default Output';
     }, 750);
    }
   }

   // 2. Apple Music Equalizer sliders & authentic pink stems
   // 140px channel: center 0dB is at 70px. Decibels range -12dB to +12dB (travel = 58px each way)
   const currentCurve = curves[next];
   $$('.native-eq-grid .eq-slider-thumb[data-band-idx]').forEach((thumb, i) => {
    const db = currentCurve[i] || 0;
    const centerY = 70;
    const y = centerY - (db / 12) * 58;
    thumb.style.transform = `translateY(${(y - 7).toFixed(1)}px)`;

    const stem = $(`.eq-stem[data-stem-idx="${i}"]`);
    if (stem) {
     if (y < centerY) {
      // Above 0dB: stem rises from center line (70px) up to knob center (y)
      stem.style.top = `${y.toFixed(1)}px`;
      stem.style.height = `${(centerY - y).toFixed(1)}px`;
     } else if (y > centerY) {
      // Below 0dB: stem drops from center line (70px) down to knob center (y)
      stem.style.top = `${centerY}px`;
      stem.style.height = `${(y - centerY).toFixed(1)}px`;
     } else {
      stem.style.top = `${centerY}px`;
      stem.style.height = '0px';
     }
    }
   });

   // Preamp slider & stem
   const preampDb = isHeadphones ? 2.5 : 0;
   const preampCenter = 70;
   const preampY = preampCenter - (preampDb / 12) * 58;
   const preampThumb = $('.preamp-thumb');
   const preampStem = $('.preamp-stem');
   if (preampThumb) preampThumb.style.transform = `translateY(${(preampY - 7).toFixed(1)}px)`;
   if (preampStem) {
    if (preampY < preampCenter) {
     preampStem.style.top = `${preampY.toFixed(1)}px`;
     preampStem.style.height = `${(preampCenter - preampY).toFixed(1)}px`;
    } else {
     preampStem.style.top = `${preampCenter}px`;
     preampStem.style.height = '0px';
    }
   }

   // 3. Preset label & Meta telemetry
   if (presetLabel) {
    presetLabel.textContent = isHeadphones ? 'Custom · AirPods Pro' : 'Manual';
   }
   if (livePill) {
    livePill.innerHTML = isHeadphones
     ? '<i class="live-dot"></i> Connected · Saved EQ active'
     : '<i class="live-dot" style="background:#8e8e93;box-shadow:none"></i> Disconnected · Flat speaker EQ';
   }

   // 4. Active button state
   $$('[data-device]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.device === next)));
  };

  const schedule = () => {
   clearInterval(timer); timer = undefined;
   if (autoButton) {
    autoButton.setAttribute('aria-pressed', String(auto));
    autoButton.textContent = auto ? 'Pause demo' : 'Play demo';
    autoButton.setAttribute('aria-label', auto ? 'Pause automatic EQ preview' : 'Play automatic EQ preview');
   }
   if (auto && visible && !document.hidden) {
    timer = setInterval(() => update(device === 'speakers' ? 'headphones' : 'speakers'), 3600);
   }
  };

  $$('[data-device]').forEach(b => b.addEventListener('click', () => {
   auto = false;
   update(b.dataset.device);
   schedule();
  }));

  autoButton?.addEventListener('click', () => {
   auto = !auto;
   schedule();
  });

  if ('IntersectionObserver' in window) {
   new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
   }, { threshold: 0.15 }).observe(eq);
  } else {
   visible = true;
  }

  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => {
   if (reduced.matches) auto = false;
   schedule();
  });

  // Initial update
  update(device);
  schedule();
 }

 const rail=$('.showcase-track');
 if(rail){
  const cards=[...rail.children],dots=$$('[data-slide]'),play=$('.showcase-play'),root=rail.parentElement;
  let index=0,auto=!reduced.matches,visible=false,frame=0,last=0,elapsed=0,settling=false,settleTimer;
  const duration=6500;
  const mark=()=>{dots.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));play.textContent=auto?'Ⅱ':'▶';play.setAttribute('aria-label',auto?'Pause feature carousel':'Play feature carousel');play.setAttribute('aria-pressed',String(auto));};
  const go=i=>{index=i;elapsed=0;settling=true;mark();root.style.setProperty('--slide-progress','0');const card=cards[i].getBoundingClientRect(),box=rail.getBoundingClientRect();rail.scrollTo({left:rail.scrollLeft+card.left-box.left-(rail.clientWidth-card.width)/2,behavior:reduced.matches?'instant':'smooth'});clearTimeout(settleTimer);settleTimer=setTimeout(()=>{settling=false;last=0;},800);};
  const tick=now=>{frame=0;if(!auto||!visible||document.hidden){last=0;return;}if(last&&!settling)elapsed+=Math.min(100,now-last);last=now;root.style.setProperty('--slide-progress',String(Math.min(1,elapsed/duration)));if(elapsed>=duration)go((index+1)%cards.length);frame=requestAnimationFrame(tick);};
  const schedule=()=>{cancelAnimationFrame(frame);last=0;mark();if(auto&&visible&&!document.hidden)frame=requestAnimationFrame(tick);};
  dots.forEach(b=>b.addEventListener('click',()=>{go(Number(b.dataset.slide));schedule();}));
  $$('[data-gallery-step]').forEach(b=>b.addEventListener('click',()=>{auto=false;go((index+Number(b.dataset.galleryStep)+cards.length)%cards.length);schedule();}));
  play.addEventListener('click',()=>{auto=!auto;schedule();});
  const manual=()=>{auto=false;settling=false;clearTimeout(settleTimer);schedule();};
  rail.addEventListener('pointerdown',manual);rail.addEventListener('wheel',event=>{if(Math.abs(event.deltaX)>Math.abs(event.deltaY))manual();},{passive:true});
  rail.addEventListener('scroll',()=>{if(settling)return;const center=rail.getBoundingClientRect().left+rail.clientWidth/2;const next=cards.reduce((best,c,i)=>Math.abs(c.getBoundingClientRect().left+c.clientWidth/2-center)<Math.abs(cards[best].getBoundingClientRect().left+cards[best].clientWidth/2-center)?i:best,0);if(next!==index){index=next;elapsed=0;root.style.setProperty('--slide-progress','0');mark();}},{passive:true});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.25}).observe(rail);
  document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',()=>{if(reduced.matches)auto=false;schedule();});schedule();
 }

 const search = $('#feature-search'),category = $('#feature-category');
 if(search && category){
  const filter = () => {
   const query=search.value.toLocaleLowerCase().trim();let count=0;
   $$('.feature-group').forEach(group=>{
    let matches=0;
    group.querySelectorAll('.feature-entry').forEach(entry=>{
     const show=(!category.value||category.value==='all'||category.value===group.id) && entry.textContent.toLocaleLowerCase().includes(query);
     entry.hidden=!show;if(show){matches++;count++;}
    }); group.hidden=matches===0;
   });
   $('#feature-count').textContent=`${count} features`;$('#feature-empty').hidden=count!==0;
  };
  search.addEventListener('input',filter);category.addEventListener('change',filter);filter();
 }

 if('IntersectionObserver' in window && !reduced.matches){
  const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
  $$('.reveal').forEach(el=>observer.observe(el));
  document.documentElement.classList.add('motion-ready');
 }
})();
