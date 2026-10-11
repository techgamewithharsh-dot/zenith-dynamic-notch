'use strict';
// Self-contained browser demo. No native code, device access, tracking, or uploads.
(()=>{
 const stage=document.querySelector('.live-stage');if(!stage)return;
 const panel=document.getElementById('live-panel'),nav=document.querySelector('.panel-nav'),status=document.getElementById('demo-status');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const names={music:'Music',focus:'Focus',files:'Files',prompt:'Prompt',search:'Search',game:'Game'};
 const icons={play:'<path d="M7 4l14 10L7 24z"/>',pause:'<path d="M7 5h5v20H7zm10 0h5v20h-5z"/>',next:'<path d="M4 6l12 9L4 24zm12 0l12 9-12 9z"/>',prev:'<path d="M26 6L14 15l12 9zM14 6L2 15l12 9z"/>',shuffle:'<path d="M3 8h4c6 0 9 14 15 14h5M3 22h4c6 0 9-14 15-14h5" fill="none" stroke-width="2"/><path d="M23 4l5 4-5 4m0 6l5 4-5 4" fill="none" stroke-width="2"/>'};
 const svg=k=>`<svg viewBox="0 0 30 30" aria-hidden="true">${icons[k]}</svg>`;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let view='music',playing=false,track=0,position=84,shuffle=false,timerLength=25*60,remaining=timerLength,timerEnd=0,timerRunning=false,promptRunning=false,promptSpeed=24,promptY=0,editing=false,active=true,last=performance.now(),frame=0,gameOn=false,gameTick=0;
 let files=['Moodboard.png','Ideas.pdf'];
 let script='Welcome to your next great idea.\n\nTake a breath. Look toward the camera. Your words are right here, exactly where you need them.\n\nA little space for your notes. A little more room to be yourself.\n\nThis is Zenith. Your Mac, a little more alive.';
 const tracks=[['Quiet Horizons','Zenith Sessions · sample playback',226],['After the Rain','Zenith Sessions · sample playback',198],['Blue Hour','Zenith Sessions · sample playback',242]];
 const fmt=n=>`${Math.floor(Math.max(0,n)/60)}:${String(Math.floor(Math.max(0,n)%60)).padStart(2,'0')}`;
 const head=(art,kicker,title,sub)=>`<div class="lp-head"><div class="lp-art" aria-hidden="true">${art}</div><div class="lp-copy"><div class="lp-tag">${kicker}</div><h3>${title}</h3><p>${sub}</p></div><div class="lp-meter ${playing&&view==='music'?'':'paused'}" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div></div>`;
 const btn=(id,label,content,cls='')=>`<button data-action="${id}" aria-label="${label}" class="${cls}">${content}</button>`;
 Object.entries(names).forEach(([key,label])=>{let b=document.createElement('button');b.textContent=label;b.dataset.view=key;b.setAttribute('aria-pressed',String(key===view));b.onclick=()=>show(key);nav.append(b)});
 function show(key){view=key;editing=false;render();if(!reduced.matches)panel.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'cubic-bezier(.2,.7,.2,1)'});nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===key)));status.textContent=({music:'Sample playback · No audio or music-account connection',focus:'Start a real countdown · Runs while you explore',files:'Sample shelf · Nothing is uploaded',prompt:'Edit the script, then read at your own pace',search:'Search and open panels in this web preview',game:'Simulated metrics · Not your device performance'})[key];}
 function render(){
 if(view==='music')panel.innerHTML=head('♫','NOW PLAYING',tracks[track][0],tracks[track][1])+`<div class="lp-row"><span id="elapsed">${fmt(position)}</span><input aria-label="Playback position" id="seek" type="range" min="0" max="${tracks[track][2]}" value="${position}"><span id="duration">−${fmt(tracks[track][2]-position)}</span></div><div class="lp-controls">${btn('shuffle','Shuffle',svg('shuffle'),'icon-button')}${btn('prev','Previous track',svg('prev'),'icon-button')}${btn('play',playing?'Pause sample playback':'Start sample playback',svg(playing?'pause':'play'),'icon-button main-control')}${btn('next','Next track',svg('next'),'icon-button')}${btn('restart','Restart track','↺','icon-button')}</div>`;
 if(view==='focus')panel.innerHTML=head('◷','FOCUS SESSION',timerRunning?'One thing at a time.':'Make room for focus.','A little less distraction. A little more you.')+`<div class="lp-row"><span id="timer" class="timer-number">${fmt(remaining)}</span><div class="timer-track"><i id="timer-progress"></i></div></div><div class="lp-controls">${btn('preset5','5 minute timer','5 min')}${btn('preset25','25 minute timer','25 min')}${btn('timer',timerRunning?'Pause timer':'Start timer',timerRunning?'Pause':'Start')}${btn('timerreset','Reset timer','Reset')}</div>`;
 if(view==='files')panel.innerHTML=head('▱','FILE SHELF','A place for your next move.','Keep the little things close.')+`<div class="shelf-items">${files.length?files.map((f,i)=>`<div class="shelf-item"><span>▤ ${esc(f)}</span><button data-remove="${i}" aria-label="Remove ${esc(f)}">×</button></div>`).join(''):'<span style="font-size:13px;color:#bac5d6">A clean slate. Add a sample file below.</span>'}</div><div class="lp-controls">${btn('addfile','Add sample file','＋ Add sample')}${btn('reorder','Rearrange shelf','Rearrange')}${btn('clearfiles','Clear sample shelf','Clear')}</div>`;
 if(view==='prompt')panel.innerHTML=head('≋','TELEPROMPTER','Keep your eyes up.','Your words, right beneath the camera.')+(editing?`<textarea class="prompt-editor" aria-label="Teleprompter script">${esc(script)}</textarea>`:`<div class="prompt-text" tabindex="0" aria-label="Scrolling script">${esc(script).replace(/\n/g,'<br>')}</div>`)+`<div class="lp-controls">${btn('prompt',promptRunning?'Pause script':'Play script',promptRunning?'Pause':'Play')}${btn('edit',editing?'Save script':'Edit script',editing?'Done':'Edit')}<label style="font-size:11px">Speed <input id="prompt-speed" aria-label="Script speed" type="range" min="10" max="60" value="${promptSpeed}" style="width:65px;accent-color:#bdd4e7"></label>${btn('promptreset','Restart script','↺')}</div>`;
 if(view==='search')panel.innerHTML=head('⌁','THUNDERSTORM','A thought. An action.','Find a feature without leaving the moment.')+'<input id="command-search" class="search-commands" type="search" aria-label="Search demo commands" placeholder="Try music, timer, files or game…"><div class="command-results" id="command-results"></div>';
 if(view==='game')panel.innerHTML=head('⌁','GAME MODE',gameOn?'You’re in the zone.':'Ready when you are.','Two graphs. One quick glance. Sample data.')+`<div class="graphs"><div>CPU <span id="cpu">24%</span><svg viewBox="0 0 240 40" preserveAspectRatio="none" aria-label="Sample CPU graph"><polyline id="cpu-line"/></svg></div><div>GPU <span id="gpu">38%</span><svg viewBox="0 0 240 40" preserveAspectRatio="none" aria-label="Sample GPU graph"><polyline id="gpu-line"/></svg></div></div><div class="lp-controls">${btn('game',gameOn?'End sample game session':'Start sample game session',gameOn?'End session':'Start session')}<span style="font-size:10px;color:#bdc7d4">SIMULATED PERFORMANCE</span></div>`;
 panel.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>action(b.dataset.action));
 panel.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{files.splice(+b.dataset.remove,1);render()});
 const seek=panel.querySelector('#seek');if(seek)seek.oninput=()=>{position=+seek.value;updateMusic()};
 const sb=panel.querySelector('[data-action=shuffle]');if(sb)sb.setAttribute('aria-pressed',String(shuffle));
 const speed=panel.querySelector('#prompt-speed');if(speed)speed.oninput=()=>promptSpeed=+speed.value;
 const search=panel.querySelector('#command-search');if(search){commands('');search.oninput=()=>commands(search.value)}
 if(view==='prompt'&&!editing)panel.querySelector('.prompt-text').scrollTop=promptY;
 if(view==='game')drawGraphs();if(view==='focus')updateTimer();resume();
 }
 function commands(q){const entries=[['music','Play some music'],['focus','Start a focus timer'],['files','Open the file shelf'],['prompt','Read a script'],['game','View CPU / GPU graphs']].filter(([k,t])=>(k+' '+t).toLowerCase().includes(q.toLowerCase()));let box=panel.querySelector('#command-results');box.replaceChildren();entries.forEach(([k,t])=>{let b=document.createElement('button');b.className='lp-button';b.textContent=t;b.onclick=()=>show(k);box.append(b)});if(!entries.length)box.textContent='No matches. Try “timer” or “music”.'}
 function action(a){
 if(a==='play')playing=!playing;
 if(a==='next'||a==='prev'){track=(track+(a==='prev'?2:shuffle?2:1))%3;position=0}
 if(a==='restart')position=0;if(a==='shuffle')shuffle=!shuffle;
 if(a.startsWith('preset')){timerLength=remaining=+a.slice(6)*60;timerRunning=false}
 if(a==='timer'){if(timerRunning){remaining=Math.max(0,(timerEnd-Date.now())/1000);timerRunning=false}else{if(remaining<=0)remaining=timerLength;timerEnd=Date.now()+remaining*1000;timerRunning=true}}
 if(a==='timerreset'){remaining=timerLength;timerRunning=false}
 if(a==='addfile'){if(files.length<8)files.push(['Sketch.fig','Weekend.pdf','Photo.jpg','Notes.txt'][files.length%4]);else status.textContent='The sample shelf holds up to eight items.'}
 if(a==='reorder')files.reverse();if(a==='clearfiles')files=[];
 if(a==='prompt'){if(editing){script=panel.querySelector('textarea').value;editing=false}promptRunning=!promptRunning}
 if(a==='edit'){if(editing)script=panel.querySelector('textarea').value;editing=!editing;promptRunning=false}
 if(a==='promptreset'){promptY=0;promptRunning=false}
 if(a==='game'){gameOn=!gameOn;if(!reduced.matches)stage.animate([{boxShadow:'inset 0 0 0 1px #acddea00'},{boxShadow:'inset 0 0 80px #acddea55'},{boxShadow:'inset 0 0 0 1px #acddea00'}],{duration:1500,easing:'ease-in-out'})}
 render();
 }
 function updateMusic(){let t=panel.querySelector('#elapsed');if(t){t.textContent=fmt(position);panel.querySelector('#duration').textContent='−'+fmt(tracks[track][2]-position);panel.querySelector('#seek').value=position}}
 function updateTimer(){const t=panel.querySelector('#timer');if(t){t.textContent=fmt(Math.ceil(remaining));panel.querySelector('#timer-progress').style.width=(100*(1-remaining/timerLength))+'%'}}
 function drawGraphs(){['cpu','gpu'].forEach((id,i)=>{let el=panel.querySelector('#'+id+'-line');if(!el)return;let values=Array.from({length:31},(_,j)=>20+Math.sin((j+gameTick)*.43+i)*7+Math.sin((j+gameTick)*.8)*3);el.setAttribute('points',values.map((v,j)=>`${j*8},${40-v}`).join(' '));panel.querySelector('#'+id).textContent=Math.round(values[30]*(i?2:1.3))+'%'})}
 function tick(now){const dt=Math.min((now-last)/1000,.1);last=now;if(active&&!document.hidden){if(playing){position+=dt;if(position>=tracks[track][2]){track=(track+1)%3;position=0;if(view==='music')render()}if(view==='music')updateMusic()}if(view==='prompt'&&promptRunning&&!editing){let p=panel.querySelector('.prompt-text');promptY+=dt*promptSpeed;p.scrollTop=promptY;if(promptY>=p.scrollHeight-p.clientHeight){promptRunning=false;render()}}}if(playing||(view==='prompt'&&promptRunning))frame=requestAnimationFrame(tick)}
 // One shared frame loop only while visible; countdown uses wall time to avoid drift.
 function resume(){cancelAnimationFrame(frame);if(active&&!document.hidden){last=performance.now();if(playing||(view==='prompt'&&promptRunning))frame=requestAnimationFrame(tick)}}
 new IntersectionObserver(es=>{active=es[0].isIntersecting;stage.classList.toggle('inactive',!active);resume()},{threshold:0}).observe(stage);
 document.addEventListener('visibilitychange',resume);
 setInterval(()=>{if(timerRunning){remaining=Math.max(0,(timerEnd-Date.now())/1000);if(!remaining){timerRunning=false;status.textContent='Focus session complete. Take a breath.';if(view==='focus')render()}if(active&&!document.hidden&&view==='focus')updateTimer()}if(active&&!document.hidden&&view==='game'&&gameOn){gameTick++;drawGraphs()}},1000);
 document.querySelectorAll('[data-wall]').forEach(b=>b.onclick=()=>{stage.dataset.wallpaper=b.dataset.wall;document.querySelectorAll('[data-wall]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
 document.getElementById('glass-tint').oninput=e=>stage.style.setProperty('--glass',e.target.value/100);
 document.getElementById('reset-demo').onclick=()=>{playing=timerRunning=promptRunning=gameOn=false;track=0;position=84;remaining=timerLength=1500;promptY=0;files=['Moodboard.png','Ideas.pdf'];shuffle=false;show('music')};
 show('music');
})();
