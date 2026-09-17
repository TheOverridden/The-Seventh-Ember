const keys={}; const mouse={x:0,y:0,down:false};
const touchInput={moveX:0,moveY:0,aimX:0,aimY:0,aimActive:false,fire:false,movePointer:null,aimPointer:null};
let interactQueued=false, dashQueued=false;
addEventListener('keydown', e=>{
  if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
    if(G.state==='playing' && !anyBlockingOverlay()) e.preventDefault();
  }
  if(e.repeat || keys[e.code]) return;
  keys[e.code]=true; initAudio();
  if(e.code==='Escape'){onEscKey();return;}
  if(anyBlockingOverlay()) return;
  if(e.code==='KeyM') toggleMusic();
  if(e.code==='KeyP') onEscKey();
  if(G.state==='playing'){
    if(e.code==='Space') dashQueued=true;
    if(e.code==='KeyE') interactQueued=true;
  }
  if(G.state==='levelup'){
    if(e.code==='Digit1'||e.code==='Numpad1') chooseCard(0);
    if(e.code==='Digit2'||e.code==='Numpad2') chooseCard(1);
    if(e.code==='Digit3'||e.code==='Numpad3') chooseCard(2);
  }
  if(G.state==='menu' && e.code==='Enter' && e.target===document.body) requestStart();
});
addEventListener('keyup',e=>{keys[e.code]=false;});
addEventListener('blur',()=>{clearInput(); if(G.state==='playing')pauseGame(true); saveNow();});
addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
addEventListener('mousedown',e=>{if(e.button===0 && e.target.id==='cv' && G.state==='playing'){mouse.down=true;initAudio();}});
addEventListener('mouseup',e=>{if(e.button===0)mouse.down=false;});
addEventListener('contextmenu',e=>{if(e.target.id==='cv')e.preventDefault();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(G.state==='playing')pauseGame(true);saveNow();if(AC)AC.suspend().catch(()=>{});}else if(AC)AC.resume().catch(()=>{});});
addEventListener('pagehide',()=>saveNow());
addEventListener('beforeunload',()=>saveNow());
