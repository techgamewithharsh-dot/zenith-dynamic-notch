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

// Slow word reveals preserve headings, links, emphasis and normal reading order.
if(!reduceMotion.matches && 'IntersectionObserver' in window){
 const headings=document.querySelectorAll('.hero>h1,.playground-heading h2,.intro-grid h2,.story-card h2,.directory-cta h2,.creator-band h2,.beta-band h2,.page-heading h1');
 const textIO=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('text-in-view');textIO.unobserve(e.target)}}),{threshold:.2});
 headings.forEach(heading=>{const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);let word=0;nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part)){fragment.append(document.createTextNode(part));return}const span=document.createElement('span');span.className='motion-word';span.style.setProperty('--word-delay',Math.min(word++*.12,.8)+'s');span.textContent=part;fragment.append(span)});node.replaceWith(fragment)});textIO.observe(heading)});
}
