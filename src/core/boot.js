function finishBoot(){
 const root=document.documentElement,screen=T('bootScreen');
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  root.classList.remove('booting');root.classList.add('boot-ready');
  if(!screen)return;
  const remove=()=>screen.remove();
  screen.addEventListener('transitionend',remove,{once:true});
  setTimeout(remove,1200);
 }));
}

try{
 installGuardianModes();
 init();
 showTheSeventhEmberUpdates();
}finally{
 finishBoot();
}
