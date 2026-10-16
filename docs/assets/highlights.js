(() => {
  'use strict';
  const section = document.querySelector('#keyboard-demo');
  if (!section) return;
  const board = section.querySelector('.mac-keyboard');
  const toggle = section.querySelector('.keyboard-optin');
  const status = section.querySelector('.keyboard-status');
  const volume = section.querySelector('input[type="range"]');
  const rows = [
    [['Backquote','`'],['Digit1','1'],['Digit2','2'],['Digit3','3'],['Digit4','4'],['Digit5','5'],['Digit6','6'],['Digit7','7'],['Digit8','8'],['Digit9','9'],['Digit0','0'],['Minus','−'],['Equal','='],['Backspace','⌫',1.5]],
    [['Tab','⇥',1.5],...Array.from('QWERTYUIOP',c=>['Key'+c,c]),['BracketLeft','['],['BracketRight',']'],['Backslash','\\']],
    [['CapsLock','⇪',1.75],...Array.from('ASDFGHJKL',c=>['Key'+c,c]),['Semicolon',';'],['Quote',"'"],['Enter','↩',1.75]],
    [['ShiftLeft','⇧',2.25],...Array.from('ZXCVBNM',c=>['Key'+c,c]),['Comma',','],['Period','.'],['Slash','/'],['ShiftRight','⇧',2.25]],
    [['Fn','fn'],['ControlLeft','⌃'],['AltLeft','⌥'],['MetaLeft','⌘',1.25],['Space','',5.5],['MetaRight','⌘',1.25],['AltRight','⌥'],['ArrowLeft','←'],['ArrowUp','↑'],['ArrowRight','→']]
  ];
  let enabled = false, audio = null, noise = null;
  const buttons = new Map(), pressed = new Set(), voices = new Set();
  for (const keys of rows) {
    const row = document.createElement('div'); row.className = 'keyboard-row';
    for (const [code,label,units=1] of keys) {
      const key = document.createElement('button'); key.type='button'; key.className='mac-key';
      key.style.setProperty('--units',units); key.textContent=label; key.disabled=true;
      key.setAttribute('aria-label', code==='Space'?'Space':label); key.tabIndex=-1;
      key.addEventListener('pointerdown',event=>{if(!enabled)return;event.preventDefault();key.setPointerCapture(event.pointerId);board.focus({preventScroll:true});down(code);});
      const release=()=>up(code); key.addEventListener('pointerup',release); key.addEventListener('pointercancel',release); key.addEventListener('lostpointercapture',release);
      row.append(key); buttons.set(code,key);
    }
    board.append(row);
  }
  function sound(code, release) {
    if(!audio || audio.state!=='running' || !enabled || voices.size>24) return;
    const now=audio.currentTime, gain=audio.createGain(), filter=audio.createBiquadFilter();
    const source=audio.createBufferSource();source.buffer=noise;
    filter.type='bandpass';filter.frequency.value=code==='Space'?620:release?2200:1200;filter.Q.value=.8;
    source.playbackRate.value=code==='Space' ? 0.8 : 1;
    gain.gain.setValueAtTime(Math.max(.0001,Number(volume.value)*(release ? 0.12 : 0.35)),now);
    gain.gain.exponentialRampToValueAtTime(.0001,now+(release ? 0.025 : 0.065));
    source.connect(filter);filter.connect(gain);gain.connect(audio.destination);
    source.start(now);source.stop(now+.075);voices.add(source);
    source.onended=()=>{voices.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};
  }
  function down(code){if(!enabled || !buttons.has(code) || pressed.has(code))return;pressed.add(code);buttons.get(code).classList.add('down');sound(code,false);}
  function up(code){if(!pressed.has(code))return;pressed.delete(code);buttons.get(code)?.classList.remove('down');sound(code,true);}
  function clear(){pressed.clear();buttons.forEach(key=>key.classList.remove('down'));}
  function stop(){enabled=false;clear();buttons.forEach(key=>key.disabled=true);board.classList.remove('enabled');toggle.textContent='Enable sound demo';toggle.setAttribute('aria-pressed','false');status.textContent='Sound is off. Enable the demo to try it.';voices.forEach(source=>{try{source.stop();}catch{}});if(audio?.state==='running')audio.suspend();}
  toggle.addEventListener('click',async()=>{
    if(enabled){stop();return;}
    toggle.disabled=true;
    try{
      const Context=window.AudioContext||window.webkitAudioContext;
      if(!Context)throw new Error('unsupported');
      if(!audio){audio=new Context();noise=audio.createBuffer(1,Math.ceil(audio.sampleRate*.09),audio.sampleRate);const data=noise.getChannelData(0);let seed=47;for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=(seed/4294967296*2-1)*Math.exp(-i/(audio.sampleRate*.018));}}
      await audio.resume();enabled=true;buttons.forEach(key=>key.disabled=false);board.classList.add('enabled');
      toggle.textContent='Turn sound off';toggle.setAttribute('aria-pressed','true');status.textContent='Click a key, or focus the keyboard and type. Blue means pressed.';board.focus({preventScroll:true});
    }catch{status.textContent='Audio is unavailable in this browser. Try Safari, Chrome or Firefox.';}
    finally{toggle.disabled=false;}
  });
  board.addEventListener('keydown',event=>{
    if(!enabled || event.repeat || event.metaKey || event.ctrlKey || event.altKey || event.code==='Tab')return;
    if(buttons.has(event.code)){event.preventDefault();down(event.code);}
  });
  board.addEventListener('keyup',event=>{if(pressed.has(event.code)){event.preventDefault();up(event.code);}});
  board.addEventListener('blur',clear,true);
  window.addEventListener('blur',()=>{if(enabled)stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden && enabled)stop();});
})();
