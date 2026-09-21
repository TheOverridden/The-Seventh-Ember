function finishBoot(){
 const root=document.documentElement,screen=T('bootScreen');
 const reveal=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
  root.classList.remove('booting');root.classList.add('boot-ready');
  if(!screen)return;
  const remove=()=>screen.remove();
  screen.addEventListener('transitionend',remove,{once:true});
  setTimeout(remove,1200);
 }));
 setTimeout(reveal,Math.max(0,650-performance.now()));
}

try{
 installGuardianModes();
 init();
 showTheSeventhEmberUpdates();
}finally{
 finishBoot();
}
