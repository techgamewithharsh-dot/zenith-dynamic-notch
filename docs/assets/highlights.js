(() => {
  'use strict';
  const section = document.querySelector('#keyboard-demo');
  if (!section) return;
  const board = section.querySelector('.mac-keyboard');
  const status = section.querySelector('.keyboard-status');
  const volume = section.querySelector('input[type="range"]');
  const profileButtons = [...section.querySelectorAll('[data-switch-profile]')];

  const profiles = {
    creamy: { downFreq: 1180, upFreq: 2100, spaceFreq: 610, q: 0.85, decay: 0.068, label: 'Creamy Linear switch active — warm, smooth bottom-out.' },
    thock:  { downFreq: 760,  upFreq: 1450, spaceFreq: 440, q: 1.15, decay: 0.082, label: 'Tactile Thock switch active — deep, resonant acoustic body.' },
    crisp:  { downFreq: 1950, upFreq: 2900, spaceFreq: 920, q: 1.40, decay: 0.048, label: 'Crisp Clicky switch active — sharp tactile snap.' },
    silent: { downFreq: 540,  upFreq: 980,  spaceFreq: 360, q: 0.65, decay: 0.038, label: 'Studio Quiet switch active — dampened low-profile acoustics.' }
  };
  let currentProfile = 'creamy';

  profileButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentProfile = btn.dataset.switchProfile || 'creamy';
      profileButtons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      activate();
      sound('KeyF', false);
      if (profiles[currentProfile]) status.textContent = profiles[currentProfile].label;
    });
  });

  const rows = [
    [['Escape','esc'],...Array.from({length:12},(_,i)=>['F'+(i+1),'F'+(i+1)])],
    [['Backquote','`'],['Digit1','1'],['Digit2','2'],['Digit3','3'],['Digit4','4'],['Digit5','5'],['Digit6','6'],['Digit7','7'],['Digit8','8'],['Digit9','9'],['Digit0','0'],['Minus','−'],['Equal','='],['Backspace','⌫',1.5]],
    [['Tab','⇥',1.5],...Array.from('QWERTYUIOP',c=>['Key'+c,c]),['BracketLeft','['],['BracketRight',']'],['Backslash','\\']],
    [['CapsLock','⇪',1.75],...Array.from('ASDFGHJKL',c=>['Key'+c,c]),['Semicolon',';'],['Quote',"'"],['Enter','↩',1.75]],
    [['ShiftLeft','⇧',2.25],...Array.from('ZXCVBNM',c=>['Key'+c,c]),['Comma',','],['Period','.'],['Slash','/'],['ShiftRight','⇧',2.25]],
    [['Fn','fn'],['ControlLeft','⌃'],['AltLeft','⌥'],['MetaLeft','⌘',1.25],['Space','',5.5],['MetaRight','⌘',1.25],['AltRight','⌥'],['ArrowLeft','←'],['ArrowUp','↑'],['ArrowDown','↓'],['ArrowRight','→']]
  ];
  let enabled = true, audio = null, noise = null;
  const buttons = new Map(), pressed = new Set(), voices = new Set();
  for (const keys of rows) {
    const row = document.createElement('div'); row.className = 'keyboard-row';
    for (const [code,label,units=1] of keys) {
      const key = document.createElement('button'); key.type='button'; key.className='mac-key';
      key.style.setProperty('--units',units); key.textContent=label; key.disabled=false;
      key.setAttribute('aria-label', ({Backspace:'Delete',Tab:'Tab',CapsLock:'Caps Lock',Enter:'Return',ShiftLeft:'Left Shift',ShiftRight:'Right Shift',ControlLeft:'Control',AltLeft:'Left Option',AltRight:'Right Option',MetaLeft:'Left Command',MetaRight:'Right Command',Space:'Space',ArrowLeft:'Left arrow',ArrowRight:'Right arrow',ArrowUp:'Up arrow',ArrowDown:'Down arrow',Escape:'Escape',Fn:'Function'})[code]||label); key.tabIndex=-1;
      key.addEventListener('pointerdown',event=>{if(!enabled)return;event.preventDefault();key.setPointerCapture(event.pointerId);board.focus({preventScroll:true});activate();down(code);});
      const release=()=>up(code); key.addEventListener('pointerup',release); key.addEventListener('pointercancel',release); key.addEventListener('lostpointercapture',release);
      row.append(key); buttons.set(code,key);
    }
    board.append(row);
  }
  function sound(code, release) {
    if(!audio || audio.state!=='running' || !enabled || voices.size>24) return;
    const prof = profiles[currentProfile] || profiles.creamy;
    const now=audio.currentTime, gain=audio.createGain(), filter=audio.createBiquadFilter();
    const source=audio.createBufferSource();source.buffer=noise;
    filter.type='bandpass';
    filter.frequency.value=code==='Space'?prof.spaceFreq:release?prof.upFreq:prof.downFreq;
    filter.Q.value=prof.q;
    source.playbackRate.value=code==='Space' ? 0.8 : 1;
    gain.gain.setValueAtTime(Math.max(.0001,Number(volume.value)*(release ? 0.12 : 0.38)),now);
    gain.gain.exponentialRampToValueAtTime(.0001,now+(release ? 0.025 : prof.decay));
    source.connect(filter);filter.connect(gain);gain.connect(audio.destination);
    source.start(now);source.stop(now+.09);voices.add(source);
    source.onended=()=>{voices.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};
  }
  function down(code){if(!enabled || !buttons.has(code) || pressed.has(code))return;pressed.add(code);buttons.get(code).classList.add('down');sound(code,false);}
  function up(code){if(!pressed.has(code))return;pressed.delete(code);buttons.get(code)?.classList.remove('down');sound(code,true);}
  function clear(){pressed.clear();buttons.forEach(key=>key.classList.remove('down'));}
  function stop(){clear();voices.forEach(source=>{try{source.stop();}catch{}});if(audio?.state==='running')audio.suspend();}
  function activate(){
    try{
      const Context=window.AudioContext||window.webkitAudioContext;
      if(!Context)throw new Error('unsupported');
      if(!audio){audio=new Context();noise=audio.createBuffer(1,Math.ceil(audio.sampleRate*.09),audio.sampleRate);const data=noise.getChannelData(0);let seed=47;for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=(seed/4294967296*2-1)*Math.exp(-i/(audio.sampleRate*.018));}}
      if(audio.state!=='running')audio.resume().then(()=>{for(const code of pressed)sound(code,false);}).catch(()=>{status.textContent='Audio is unavailable. The keyboard still responds visually.';});
      board.classList.add('enabled');status.textContent=profiles[currentProfile]?.label || 'That’s the feeling. Keep typing.';
    }catch{status.textContent='Audio is unavailable. The keyboard still responds visually.';}
  }
  board.addEventListener('keydown',event=>{
    if(!enabled || event.repeat || event.metaKey || event.ctrlKey || event.altKey || event.code==='Tab')return;
    if(buttons.has(event.code)){event.preventDefault();activate();down(event.code);}
  });
  board.addEventListener('keyup',event=>{if(pressed.has(event.code)){event.preventDefault();up(event.code);}});
  board.addEventListener('blur',clear,true);
  window.addEventListener('blur',()=>{if(enabled)stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden && enabled)stop();});
})();
