const galleryTabs=[...document.querySelectorAll('[data-preview]')];
const descriptions={
 music:['Music controls','Play, pause, skip and seek from the notch. Keep your current track and artwork visible while you work.','Compatible media apps'],
 files:['Files & sharing','Drop files into the shelf, send them with AirDrop, share them or copy them to the clipboard.','File actions in one place'],
 teleprompter:['Teleprompter','Read an auto-scrolling script beneath the webcam. Adjust the speed and text size for calls, presentations and recordings.','Your script, near the camera'],
 thunderstorm:['Thunderstorm launcher','Search apps and commands from the notch. Launch everyday tools and saved links to commands installed in Raycast.','Raycast required for Raycast commands'],
 mixer:['Audio mixer','Adjust the volume of supported running apps individually, with their controls collected in one panel.','App and permission dependent'],
 focus:['Focus timer','Choose a session length, start a focus timer and switch to a break without leaving your current task.','Focus and break sessions'],
 ai:['AI activity','Keep supported coding-agent activity and quota information nearby. Availability varies by integration and setup.','Values shown are illustrative'],
 game:['Game Mode','See supported performance metrics, temperature and power information, with shortcuts to graphs and gaming tools.','Metrics and controls depend on hardware']
};
function selectPreview(button,focus=false){
 const key=button.dataset.preview;const [title,copy,note]=descriptions[key];
 galleryTabs.forEach(tab=>{const selected=tab===button;tab.setAttribute('aria-selected',selected);tab.tabIndex=selected?0:-1});
 const img=document.querySelector('#feature-preview-image');img.src=`assets/screens/${key==='teleprompter'?'teleprompter-v2':key}.jpg`;img.alt=`Zenith ${title} panel and its floating toolbar`;
 document.querySelector('#preview-title').textContent=title;document.querySelector('#preview-description').textContent=copy;document.querySelector('#preview-note').textContent=note;
 if(focus)button.focus();
}
galleryTabs.forEach((button,index)=>{
 button.addEventListener('click',()=>selectPreview(button));
 button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%galleryTabs.length;if(event.key==='ArrowLeft')next=(index-1+galleryTabs.length)%galleryTabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=galleryTabs.length-1;if(next!==undefined){event.preventDefault();selectPreview(galleryTabs[next],true)}});
});
