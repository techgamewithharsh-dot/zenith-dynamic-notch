(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches || !('IntersectionObserver' in window)) return;
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
 }),{threshold:.08});
 document.querySelectorAll('.section-introduction,.special-heading,.special-eq,.keyboard-showcase,.special-card,.lock-images figure,.download-heading').forEach(node=>{
  node.classList.add('editorial-reveal');observer.observe(node);
 });
})();
