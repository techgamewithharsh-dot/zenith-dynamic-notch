/* Zenith Observatory scroll choreography + localhost live auto-reload. */
(() => {
 'use strict';
 const hero = document.querySelector('.opening-sequence');
 const kinetic = document.querySelector('.kinetic-story');
 const atmo = document.querySelector('.zenith-atmosphere');
 const atmoBoxes = [...document.querySelectorAll('.atmo-ui-box')];
 const lockSeq = document.querySelector('#lock-screen.wallpaper-sequence');
 const lockItems = [...document.querySelectorAll('.lock-anim-item')];
 const lockDetailsStage = document.querySelector('.lock-details-stage');
 const depthScene = document.querySelector('.depth-scene');
 const scrollCards = [...document.querySelectorAll('.scroll-card')];
 const reduce = matchMedia('(prefers-reduced-motion: reduce)');
 let queued = false;

 const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
 const smooth = t => t * t * (3 - 2 * t);

 const boxConfigs = [
  { xIn: -16, yIn: -10, rotBase: -2.2, rotSwing: 2.0, start: 0.04, end: 0.36 },
  { xIn: 22, yIn: 16, rotBase: 2.4, rotSwing: -2.2, start: 0.08, end: 0.40 },
  { xIn: -12, yIn: 18, rotBase: 1.6, rotSwing: -1.6, start: 0.14, end: 0.46 },
  { xIn: 24, yIn: -12, rotBase: -2.8, rotSwing: 2.4, start: 0.18, end: 0.50 }
 ];

 const render = () => {
  queued = false;
  const h = innerHeight;

  if (reduce.matches) {
   hero?.style.setProperty('--cloud-shift', '0px');
   kinetic?.style.setProperty('--o-stretch', '1');
   lockSeq?.style.setProperty('--lock-ui-alpha', '1');
   lockSeq?.style.setProperty('--lock-ui-y', '0px');
   lockSeq?.style.setProperty('--lock-ui-scale', '1');
   return;
  }

  // 1. Hero clouds & arrival scale
  if (hero) {
   const r = hero.getBoundingClientRect();
   if (r.bottom > 0 && r.top < h) {
    const p = clamp(-r.top / Math.max(1, r.height - h));
    hero.style.setProperty('--arrival-scale', String(1 + p * 0.065));
    hero.style.setProperty('--cloud-shift', `${p * innerWidth * 0.35}px`);
   }
  }

  // 2. Kinetic "So much more."
  if (kinetic) {
   const r = kinetic.getBoundingClientRect();
   if (r.bottom > 0 && r.top < h) {
    const p = clamp(-r.top / Math.max(1, r.height - h));
    kinetic.style.setProperty('--o-stretch', String(1 + Math.sin(p * Math.PI) * (innerWidth < 700 ? 1.2 : 2.8)));
   }
  }

  // 3. 3rd Image Section (.zenith-atmosphere): Scroll animation on the 4 UI boxes
  if (atmo) {
   const r = atmo.getBoundingClientRect();
   if (r.bottom > -100 && r.top < h + 100) {
    const p = clamp((h - r.top) / (h + r.height));
    atmo.style.setProperty('--atmo-bg-scale', (1.1 - p * 0.08).toFixed(4));
    atmo.style.setProperty('--atmo-bg-y', `${((p - 0.5) * 28).toFixed(1)}px`);
    atmo.style.setProperty('--atmo-copy-y', `${((0.45 - p) * 26).toFixed(1)}px`);

    atmoBoxes.forEach((box, i) => {
     const cfg = boxConfigs[i] || boxConfigs[0];
     const enter = smooth(clamp((p - cfg.start) / (cfg.end - cfg.start)));
     const exit = smooth(clamp((p - 0.82) / 0.18));
     const floatOffset = (p - 0.5) * -22 * (i % 2 === 0 ? 1 : 0.75);
     const x = (1 - enter) * cfg.xIn;
     const y = (1 - enter) * cfg.yIn + floatOffset - exit * 18;
     const rot = cfg.rotBase + (1 - enter) * cfg.rotSwing;
     const scale = 0.90 + 0.10 * enter - 0.03 * exit;
     const alpha = clamp(enter * (1 - exit * 0.45));
     box.style.setProperty('--box-x', `${x.toFixed(1)}px`);
     box.style.setProperty('--box-y', `${y.toFixed(1)}px`);
     box.style.setProperty('--box-rot', `${rot.toFixed(2)}deg`);
     box.style.setProperty('--box-scale', scale.toFixed(3));
     box.style.setProperty('--box-alpha', alpha.toFixed(3));
    });
   }
  }

  // 4. Unified Lock Screen Stage (#lock-screen)
  if (lockSeq) {
   const r = lockSeq.getBoundingClientRect();
   if (r.bottom > -200 && r.top < h + 200) {
    const enterView = clamp((h - r.top) / h);
    const pinnedP = clamp(-r.top / Math.max(1, r.height - h));

    lockItems.forEach((item, idx) => {
     const stepDelay = idx * 0.032;
     const inProgress = smooth(clamp((enterView - 0.18 - stepDelay * 1.4) / 0.58));
     const outStart = 0.14 + stepDelay;
     const outProgress = smooth(clamp((pinnedP - outStart) / 0.19));
     const alpha = clamp(inProgress * (1 - outProgress));
     const y = (1 - inProgress) * 44 - outProgress * 64;
     const scale = 0.94 + 0.06 * inProgress + outProgress * 0.04;
     const blur = (1 - inProgress) * 8 + outProgress * 10;
     item.style.setProperty('--item-alpha', alpha.toFixed(3));
     item.style.setProperty('--item-y', `${y.toFixed(1)}px`);
     item.style.setProperty('--item-scale', scale.toFixed(3));
     item.style.setProperty('--item-blur', `${blur.toFixed(1)}px`);
    });

    const revealUI = smooth(clamp((pinnedP - 0.22) / 0.16));
    const exitUI = smooth(clamp((pinnedP - 0.82) / 0.14));
    const uiAlpha = clamp(revealUI * (1 - exitUI));

    lockSeq.style.setProperty('--lock-bg-alpha', (1 - revealUI * 0.72 * (1 - exitUI * 0.75)).toFixed(3));
    lockSeq.style.setProperty('--lock-veil-alpha', ((1 - revealUI) * 0.78).toFixed(3));
    lockSeq.style.setProperty('--lock-bg-scale', (1.03 + pinnedP * 0.08).toFixed(3));
    lockSeq.style.setProperty('--lock-bg-blur', `${(revealUI * (1 - exitUI * 0.6) * 18).toFixed(1)}px`);
    lockSeq.style.setProperty('--lock-bg-bright', (0.94 - revealUI * 0.44 * (1 - exitUI * 0.8)).toFixed(3));

    lockSeq.style.setProperty('--lock-ui-alpha', uiAlpha.toFixed(3));
    lockSeq.style.setProperty('--lock-ui-y', `${((1 - revealUI) * 46 - exitUI * 44).toFixed(1)}px`);
    lockSeq.style.setProperty('--lock-ui-scale', (0.96 + revealUI * 0.04 - exitUI * 0.03).toFixed(3));
   }
  }

  // 5. Reused 4th image (rose-gallery.webp) inside .lock-details-stage parallax
  if (lockDetailsStage) {
   const r = lockDetailsStage.getBoundingClientRect();
   if (r.bottom > 0 && r.top < h) {
    const p = clamp((h - r.top) / (h + r.height));
    lockDetailsStage.style.setProperty('--rose-gallery-y', `${(-9 + p * 12).toFixed(2)}%`);
   }
  }

  // 6. Live scroll-parallax Clock Depth (.depth-scene)
  if (depthScene) {
   const r = depthScene.getBoundingClientRect();
   if (r.bottom > 0 && r.top < h) {
    const p = clamp((h - r.top) / (h + r.height));
    depthScene.style.setProperty('--depth-clock-y', `${((p - 0.5) * 28).toFixed(1)}px`);
    depthScene.style.setProperty('--depth-fg-y', `${((0.5 - p) * 18).toFixed(1)}px`);
   }
  }

  // 7. Universal scroll-driven 3D entrance & parallax for all bottom .scroll-card elements
  scrollCards.forEach(card => {
   const r = card.getBoundingClientRect();
   if (r.top < h + 120 && r.bottom > -120) {
    const idx = Number(card.style.getPropertyValue('--card-idx') || 0);
    const raw = (h - r.top) / (h * 0.45);
    const enter = smooth(clamp(raw - idx * 0.07));
    card.style.setProperty('--sc-alpha', (0.28 + 0.72 * enter).toFixed(3));
    card.style.setProperty('--sc-y', `${((1 - enter) * 32).toFixed(1)}px`);
    card.style.setProperty('--sc-scale', (0.96 + 0.04 * enter).toFixed(3));
   } else if (r.top <= 0) {
    card.style.setProperty('--sc-alpha', '1');
    card.style.setProperty('--sc-y', '0px');
    card.style.setProperty('--sc-scale', '1');
   }
  });
 };

 const schedule = () => {
  if (!queued) {
   queued = true;
   requestAnimationFrame(render);
  }
 };

 addEventListener('scroll', schedule, { passive: true });
 addEventListener('resize', schedule);
 reduce.addEventListener('change', schedule);
 render();

 // Real-time localhost live-reload watcher so edits on disk show immediately in the open preview tab
 if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
  const watched = ['index.html', 'assets/observatory.css', 'assets/editorial.js', 'assets/observatory.js'];
  const stamps = new Map();
  const check = async () => {
   for (const url of watched) {
    try {
     const res = await fetch(`${url}?_t=${Date.now()}`, { method: 'HEAD', cache: 'no-store' });
     const sig = `${res.headers.get('last-modified') || ''}:${res.headers.get('content-length') || ''}`;
     if (!stamps.has(url)) stamps.set(url, sig);
     else if (stamps.get(url) !== sig) {
      stamps.set(url, sig);
      location.reload();
      return;
     }
    } catch {}
   }
  };
  setInterval(check, 900);
 }
})();
