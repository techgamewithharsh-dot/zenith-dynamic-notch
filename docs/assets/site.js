const search=document.getElementById('feature-search');
if(search) search.addEventListener('input',()=>{
 const query=search.value.trim().toLocaleLowerCase();let visible=0;
 document.querySelectorAll('.feature-item').forEach(item=>{const match=item.dataset.search.toLocaleLowerCase().includes(query);item.hidden=!match;if(match)visible++;});
 document.querySelectorAll('.feature-group').forEach(group=>group.hidden=!group.querySelector('.feature-item:not([hidden])'));
 document.getElementById('search-status').textContent=visible ? `${visible} feature${visible===1?'':'s'} listed` : 'No matching features. Try a different word.';
});

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const reveals=document.querySelectorAll('.intro-grid,.story-card,.directory-cta,.creator-band,.beta-band');
if(!reduceMotion.matches && 'IntersectionObserver' in window){
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}}),{threshold:.12});
 reveals.forEach(e=>{e.classList.add('reveal');io.observe(e)});
}
