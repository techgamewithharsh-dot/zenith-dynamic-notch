// Actual native capture with accessible feature invitations. No native app source.
'use strict';
(()=>{
 const dialog=document.getElementById('native-invitation');if(!dialog)return;
 document.querySelectorAll('[data-feature]').forEach(button=>button.addEventListener('click',()=>{
  document.getElementById('invitation-feature').textContent=button.dataset.feature==='Home'?'ZENITH FOR MAC':button.dataset.feature.toUpperCase();
  dialog.showModal();
 }));
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
})();
