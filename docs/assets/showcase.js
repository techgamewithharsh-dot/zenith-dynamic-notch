const galleryTabs=[...document.querySelectorAll('[data-preview]')];
const descriptions={
 launcher:['Zenith Launcher','A fluid, ProMotion 120Hz app launcher with SpringBoard-grade trackpad swipe dynamics, zero micro-stutter, and full-screen grid organization.','Actual App Screenshot · ProMotion 120Hz Spring Dynamics'],
 face:['Face ID','Zenith’s experimental camera-based recognition brings a face-scan experience to its lock screen. Configure and preview it in the app.','Generated UI concept · Camera permission required · Not Apple Face ID'],
 music:['Music controls','Play, pause, skip and seek from the notch. Keep your current track and artwork visible while you work.','Compatible media apps'],
 files:['Files & sharing','Drop files into the shelf, send them with AirDrop, share them or copy them to the clipboard.','File actions in one place'],
 teleprompter:['Teleprompter','Read an auto-scrolling script beneath the webcam. Adjust the speed and text size for calls, presentations and recordings.','Your script, near the camera'],
 thunderstorm:['Thunderstorm launcher','Search apps and commands from the notch. Launch everyday tools and saved links to commands installed in Raycast.','Raycast required for Raycast commands'],
 mixer:['Audio mixer','Adjust the volume of supported running apps individually, with their controls collected in one panel.','App and permission dependent'],
 focus:['Focus timer','Choose a session length, start a focus timer and switch to a break without leaving your current task.','Focus and break sessions'],
 ai:['AI activity','Keep supported coding-agent activity and quota information nearby. Availability varies by integration and setup.','Values shown are illustrative'],
 'focus-active':['Active focus session','Keep the remaining time and session progress visible. Pause, restart or extend a focus session from the same compact panel.','Focus timer in progress'],
 tasks:['Tasks','Add quick to-dos, mark them complete and keep your task list within reach of the notch.','Your everyday checklist'],
 camera:['Camera preview','Check your framing with a live camera view directly inside the notch.','AI-generated camera image · Camera permission required'],
 lid:['3D Lid','A Duo-style folding-screen animation follows the hinge as you close your Mac. Preview the effect and choose the angle at which folding begins.','Experimental · hinge sensing depends on hardware'],
 game:['Game Mode','See supported performance metrics, temperature and power information, with shortcuts to graphs and gaming tools.','Metrics and controls depend on hardware']
};
let previewRequest=0;
async function selectPreview(button,focus=false){
 const request=++previewRequest;
 const key=button.dataset.preview;const [title,copy,note]=descriptions[key]||descriptions['files'];
 galleryTabs.forEach(tab=>{const selected=tab===button;tab.setAttribute('aria-selected',selected);tab.tabIndex=selected?0:-1});
 const img=document.querySelector('#feature-preview-image');
 const next=new Image();next.src=`assets/screens/${key}-wide.jpg`;
 try{await next.decode()}catch{return}
 if(request!==previewRequest)return;
 img.getAnimations().forEach(animation=>animation.cancel());
 img.src=next.src;
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)img.animate([{opacity:.65,translate:"0 8px"},{opacity:1,translate:"0 0"}],{duration:420,easing:"cubic-bezier(.17,.98,.28,1.02)"});
 img.alt=`Zenith ${title} panel and its floating toolbar`;
 document.querySelector('.preview-copy .small-label').textContent=key==='face'?'ILLUSTRATIVE UI CONCEPT':key==='camera'?'APP UI · ILLUSTRATIVE CAMERA FEED':'ACTUAL APP SCREENSHOT';
 document.querySelector('#preview-title').textContent=title;document.querySelector('#preview-description').textContent=copy;document.querySelector('#preview-note').textContent=note;
 if(focus)button.focus();
}
galleryTabs.forEach((button,index)=>{
 button.addEventListener('click',()=>selectPreview(button));
 button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%galleryTabs.length;if(event.key==='ArrowLeft')next=(index-1+galleryTabs.length)%galleryTabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=galleryTabs.length-1;if(next!==undefined){event.preventDefault();selectPreview(galleryTabs[next],true)}});
});
