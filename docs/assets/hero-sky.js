(() => {
 const hero=document.querySelector('.spacious-hero'),header=document.querySelector('.spacious-site header');
 if(!hero||!header)return;
 const title=hero.querySelector('h1'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const sky=document.createElement('div');sky.className='hero-sky';sky.setAttribute('aria-hidden','true');
 const stars=document.createElement('div');stars.className='hero-stars';
 const canvas=document.createElement('canvas');canvas.className='hero-comet';sky.append(stars,canvas);hero.prepend(sky);
 // Decorative outlines remain outside the navigation's interaction layer.
 const divider=document.createElement('div');divider.className='header-divider';divider.setAttribute('aria-hidden','true');
 divider.innerHTML='<svg viewBox="0 0 1000 30" preserveAspectRatio="none"><path class="divider-notch" d="M0 .5H390C401 .5 401 1 405 12C409 25 416 28 429 28H571C584 28 591 25 595 12C599 1 599 .5 610 .5H1000"/><path class="divider-straight" d="M0 .5H1000"/></svg>';
 header.append(divider);
 new IntersectionObserver(entries=>header.classList.toggle('title-visible',entries[0].isIntersecting),{rootMargin:'-82px 0px 0px 0px',threshold:0}).observe(title);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let width=0,height=0,visible=false,raf=0,timer=0,flight=null;
 const hash=i=>{const value=Math.sin(i*127.1+311.7)*43758.5453;return value-Math.floor(value)};
 function populateStars(){
  stars.replaceChildren();const count=width<600?22:42;
  for(let i=0;i<count;i++){
   let x=hash(i*7+1),y=hash(i*7+3);
   if(x>.30&&x<.70&&y>.2&&y<.74)x=x<.5?x*.55:.75+x*.2;
   const star=document.createElement('i'),size=.7+hash(i*7+5)*1.3;
   star.style.cssText=`left:${x*100}%;top:${y*100}%;width:${size}px;height:${size}px;--star-alpha:${.12+hash(i+8)*.23};--star-time:${6+hash(i+9)*8}s;animation-delay:${-hash(i+10)*14}s`;
   stars.append(star);
  }
 }
 const canRun=()=>visible&&!document.hidden&&!reduced.matches;
 function stop(){clearTimeout(timer);cancelAnimationFrame(raf);timer=raf=0;flight=null;ctx.clearRect(0,0,width,height)}
 function schedule(first=false){clearTimeout(timer);if(canRun())timer=setTimeout(launch,first?4500:9000+Math.random()*11000)}
 function resize(){
  const bounds=hero.getBoundingClientRect();width=bounds.width;height=bounds.height;
  const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  populateStars();stop();schedule(true);
 }
 // Pre-sample a soft curve and index its cumulative distance, as in the keynote.
 function launch(){
  if(!canRun())return;const right=Math.random()>.5,upper=Math.random()>.45;
  const startY=height*(upper?.12:.69),endY=height*(upper?.34:.92);
  const p0={x:right?-100:width+100,y:startY},p1={x:width*(right?.4:.6),y:startY+height*.03},p2={x:right?width+100:-100,y:endY};
  const points=[],distances=[0];let distance=0;
  for(let i=0;i<=220;i++){
   const t=i/220,a=1-t,p={x:a*a*p0.x+2*a*t*p1.x+t*t*p2.x,y:a*a*p0.y+2*a*t*p1.y+t*t*p2.y};
   if(i)distance+=Math.hypot(p.x-points[i-1].x,p.y-points[i-1].y);
   points.push(p);if(i)distances.push(distance);
  }
  flight={points,distances,distance,start:performance.now(),duration:4200+Math.random()*1200,tail:100+Math.random()*45};raf=requestAnimationFrame(draw);
 }
 function pointAt(distance){
  const f=flight,d=Math.max(0,Math.min(f.distance,distance));let lo=0,hi=f.distances.length-1;
  while(lo<hi){const mid=(lo+hi)>>1;if(f.distances[mid]<d)lo=mid+1;else hi=mid}
  const i=Math.max(1,lo),start=f.distances[i-1],span=f.distances[i]-start,t=span?(d-start)/span:0,a=f.points[i-1],b=f.points[i];
  return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t};
 }
 function draw(now){
  if(!canRun()||!flight){stop();return}const u=(now-flight.start)/flight.duration;
  ctx.clearRect(0,0,width,height);if(u>=1){flight=null;raf=0;schedule();return}
  const travelled=u*flight.distance,head=pointAt(travelled),tail=pointAt(travelled-flight.tail);
  const opacity=Math.min(1,u/.14,(1-u)/.18)*.58;
  ctx.save();ctx.globalAlpha=opacity;ctx.globalCompositeOperation='lighter';
  const gradient=ctx.createLinearGradient(tail.x,tail.y,head.x,head.y);gradient.addColorStop(0,'rgba(185,140,82,0)');gradient.addColorStop(.4,'rgba(212,174,113,.10)');gradient.addColorStop(.82,'rgba(236,206,156,.5)');gradient.addColorStop(1,'rgba(240,245,255,.9)');
  for(const [lineWidth,alpha] of [[5,.12],[2,.3],[.8,.85]]){
   ctx.globalAlpha=opacity*alpha;ctx.beginPath();
   for(let i=0;i<=36;i++){const p=pointAt(travelled-flight.tail*(1-i/36));if(!i)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y)}
   ctx.strokeStyle=gradient;ctx.lineWidth=lineWidth;ctx.lineCap='round';ctx.stroke();
  }
  ctx.globalAlpha=opacity;const glow=ctx.createRadialGradient(head.x,head.y,0,head.x,head.y,9);
  glow.addColorStop(0,'rgba(245,249,255,.85)');glow.addColorStop(.18,'rgba(240,214,171,.35)');glow.addColorStop(1,'rgba(220,174,110,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(head.x,head.y,9,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#edf3ff';ctx.beginPath();ctx.arc(head.x,head.y,1.15,0,Math.PI*2);ctx.fill();ctx.restore();raf=requestAnimationFrame(draw);
 }
 function sync(){sky.classList.toggle('sky-paused',!canRun());if(canRun())schedule(true);else stop()}
 new ResizeObserver(resize).observe(hero);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.12;sync()},{threshold:.12}).observe(hero);
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
})();
