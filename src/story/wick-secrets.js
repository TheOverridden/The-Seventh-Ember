'use strict';

(()=>{
 const scenes=['wickPointer1','wickPointer2','wickPointer3','wickPointer4','wickPointer5','wickPointer6'];
 Object.assign(HOLLOW_SCENES,{
  wickPointer1:{title:'The portal is over there',where:'An open gate',hidden:true,lines:[['Wick','Um. The portal is over there.']]},
  wickPointer2:{title:'The large glowing thing',where:'An open gate',hidden:true,lines:[['Wick','The large glowing thing. With the stairs.']]},
  wickPointer3:{title:'It is still there',where:'An open gate',hidden:true,lines:[['Wick','It is still there.']]},
  wickPointer4:{title:'What do you expect?',where:'An open gate',hidden:true,lines:[['Wick','I don’t know what you expect me to do.']]},
  wickPointer5:{title:'Mara’s labels',where:'An open gate',hidden:true,lines:[['Wick','I used to wonder why Mara labeled every door.']]},
  wickPointer6:{title:'Fine',where:'An open gate',hidden:true,lines:[['Wick','...Fine. Take this. It points.']]},
  wickPointerAfter:{title:'It has opinions',where:'An open gate',hidden:true,lines:[['Wick','At the portal, mostly. It has opinions about enemies.']]}
 });
 Object.assign(ARMORY,{wickPointer:{name:'Wick’s Pointer',requirement:'Try Wick’s patience near an open portal',detail:'Marks the room’s greatest threat. Marked enemies take more damage and return one Ember Bolt charge.'}});
 const card={id:'wickPointer',r:2,max:1,w:2,minFloor:1,icon:'target',name:'Wick’s Pointer',ds:'Marks the greatest threat · +18% damage · marked defeats restore one charge',unlock:'wickPointer'};
 POOL.push(card);
 const gift=T('wickGift'),recall=T('portalRecall');
 let presses=0,pressWindow=0,returnQueued=false,returning=false,targetClock=0;

 function portalTileSeen(){
  const p=G.portal,w=G.world;if(!p||!w)return false;
  const x=Math.floor(p.x/TILE),y=Math.floor(p.y/TILE),seen=!!w.reveal?.[y*w.W+x];
  if(seen&&!p.discovered){p.discovered=true;markSave();saveNow('portal-found');}
  return !!p.discovered||seen;
 }
 function realInteractionNear(){
  if(!G.player)return false;
  const p=G.player;
  if(G.portal&&d2(p.x,p.y,G.portal.x,G.portal.y)<90**2)return true;
  const fixtures=G.world?.region==='late'?G.world?.lateFixtures:G.world?.fixtures;
  if(fixtures?.some(o=>d2(p.x,p.y,o.x,o.y)<78**2))return true;
  return false;
 }
 function nextScene(){return scenes.find(id=>!storyData().seen[id]);}
 function canPesterWick(){
  return G.state==='playing'&&G.run&&!G.run.mode&&G.portal?.active&&portalTileSeen()&&!G.descending&&!realInteractionNear()&&!G.enemies.some(e=>!e.dead)&&!armoryData().wickPointer&&!dialogue;
 }
 function canRecall(){
  return G.state==='playing'&&G.run&&!G.run.mode&&G.portal?.active&&portalTileSeen()&&!G.descending&&!returning&&d2(G.player.x,G.player.y,G.portal.x,G.portal.y)>105**2;
 }
 function landingPosition(){
  const portal=G.portal,p=G.player;
  for(let i=0;i<12;i++){
   const a=Math.PI/2+i*TAU/12,pos=safePosition(G.world,portal.x+Math.cos(a)*54,portal.y+Math.sin(a)*54,p.r);
   if(pos&&!G.enemies.some(e=>!e.dead&&d2(pos.x,pos.y,e.x,e.y)<70**2))return pos;
  }
  return safePosition(G.world,portal.x,portal.y+54,p.r)||{x:portal.x,y:portal.y+54};
 }
 function returnToPortal(){
  if(!canRecall())return;
  returning=true;returnQueued=false;const p=G.player,pos=landingPosition();clearInput();setState('returning');T('fade').style.opacity=.78;sfx('portal');burst(p.x,p.y,15,'#efb96f',150,.45,2,true);
  setTimeout(()=>{
   if(!G.run||!G.player||!G.portal){returning=false;T('fade').style.opacity=0;return;}
   p.x=pos.x;p.y=pos.y;p.kbx=p.kby=0;p.hitCd=Math.max(p.hitCd,1.1);G.cam.x=p.x-G.w/2;G.cam.y=p.y-G.h/2;
   burst(p.x,p.y,20,'#ffd88a',180,.55,2.5,true);T('fade').style.opacity=0;returning=false;setState('playing');updateHUD(0);fieldNote('The open gate draws you back.',2);saveNow('portal-return');G.cv.focus({preventScroll:true});
  },260);
 }
 function openGift(){
  if(armoryData().wickPointer||gift.classList.contains('open'))return;
  clearInput();setState('wick-gift');show('wickGift');sfx('mythicReveal');T('wickGiftTake').focus({preventScroll:true});
 }
 function takeGift(){
  if(armoryData().wickPointer)return;
  unlockArmory('wickPointer');
  if(G.run&&G.player){G.run.up.wickPointer=1;addChip(card);recalc();}
  hide('wickGift');setState('playing');G.player.hitCd=Math.max(G.player.hitCd,1);saveNow('wick-pointer');beginDialogue('wickPointerAfter',false,0,'playing');
 }
 function pointerActive(){return !!(G.run?.up?.wickPointer&&G.player&&G.world);}
 function targetScore(e){
  let score=0;if(e.mechanism)score+=1400;if(e.midPiece||e.type==='gardenNest')score+=1250;if(e.isBoss)score+=1000;if(e.elite)score+=420;score+=(e.dmg||0)*6+(e.max||e.maxHp||0)*.025;score-=Math.sqrt(d2(G.player.x,G.player.y,e.x,e.y))*.18;return score;
 }
 function markedTarget(){return G.enemies.find(e=>!e.dead&&e.uid===G.run?.wickPointerUid)||null;}
 function chooseTarget(){
  if(!pointerActive())return null;
  const live=G.enemies.filter(e=>!e.dead);if(!live.length){G.run.wickPointerUid=0;return null;}
  live.sort((a,b)=>targetScore(b)-targetScore(a));G.run.wickPointerUid=live[0].uid;return live[0];
 }
 function drawPointer(ctx){
  if(!pointerActive()||G.dead)return;
  const p=G.player,t=save.motion?0:G.tAll,target=markedTarget(),orbit=t*.72,fx=p.x+Math.cos(orbit)*31,fy=p.y-11+Math.sin(orbit)*13;ctx.save();ctx.globalCompositeOperation='lighter';
  for(let i=0;i<7;i++){const a=-t*2.1+i*TAU/7,rr=9+Math.sin(t*3+i)*1.2,x=fx+Math.cos(a)*rr,y=fy+Math.sin(a)*rr*.7;ctx.save();ctx.translate(x,y);ctx.rotate(a+Math.PI/4);ctx.fillStyle=i%2?'#d88943':'#ffd990';ctx.globalAlpha=.7;ctx.fillRect(-1,-2,2,4);ctx.fillStyle='#fff2bd';ctx.globalAlpha=.9;ctx.fillRect(0,-2,1,2);ctx.restore();}
  ctx.save();ctx.translate(fx,fy);ctx.fillStyle='#e96330';ctx.globalAlpha=.86;ctx.beginPath();ctx.moveTo(0,-7);ctx.bezierCurveTo(6,-2,6,5,0,8);ctx.bezierCurveTo(-6,5,-5,-1,0,-7);ctx.fill();ctx.fillStyle='#ffe29c';ctx.globalAlpha=.95;ctx.beginPath();ctx.moveTo(0,-3);ctx.bezierCurveTo(3,0,3,4,0,5);ctx.bezierCurveTo(-3,3,-2,0,0,-3);ctx.fill();ctx.restore();
  if(target){
   const r=target.r+12+Math.sin(t*4)*2;ctx.translate(target.x,target.y);ctx.rotate(Math.PI/4);ctx.strokeStyle='#ffd887';ctx.globalAlpha=.9;ctx.lineWidth=2;ctx.strokeRect(-r*.72,-r*.72,r*1.44,r*1.44);ctx.rotate(-Math.PI/4);for(let i=0;i<7;i++){const a=i*TAU/7+t*.2;ctx.fillStyle=i%2?'#f5a65b':'#ffe4a0';ctx.fillRect(Math.cos(a)*(r+5)-1,Math.sin(a)*(r+5)-1,3,3);}
  }else if(G.portal){
   const a=Math.atan2(G.portal.y-fy,G.portal.x-fx),x=fx+Math.cos(a)*17,y=fy+Math.sin(a)*17;ctx.translate(x,y);ctx.rotate(a+Math.PI/2);ctx.fillStyle='#ffd887';ctx.globalAlpha=.9;ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(5,5);ctx.lineTo(0,2);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();
  }
  ctx.restore();
 }

 const baseUpdate=update;
 update=function(dt){
  pressWindow=Math.max(0,pressWindow-dt);if(!pressWindow)presses=0;portalTileSeen();
  if(returnQueued){returnQueued=false;if(canRecall()){returnToPortal();return;}}
  if(interactQueued&&canPesterWick()){
   interactQueued=false;presses++;pressWindow=2.5;const id=nextScene(),needed=id==='wickPointer1'?8:6;
   if(id&&presses>=needed){presses=0;pressWindow=0;beginDialogue(id,false,0,'playing');return;}
  }
  if(storyData().seen.wickPointer6&&!armoryData().wickPointer&&G.state==='playing'){openGift();return;}
  const out=baseUpdate(dt);if(G.state==='playing'){portalTileSeen();targetClock-=dt;if(pointerActive()&&(targetClock<=0||!markedTarget())){targetClock=.4;chooseTarget();}}return out;
 };
 const baseFinishDialogue=finishDialogue;
 finishDialogue=function(){const id=dialogue?.id;baseFinishDialogue();if(id==='wickPointer6'&&!armoryData().wickPointer)openGift();};
 const baseDamageEnemy=damageEnemy;
 damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){if(pointerActive()&&e&&!e.dead&&e.uid===G.run.wickPointerUid)dmg*=1.18;return baseDamageEnemy(e,dmg,ang,crit,kb,kind);};
 const baseKillEnemy=killEnemy;
 killEnemy=function(e){const marked=pointerActive()&&e&&!e.dead&&e.uid===G.run.wickPointerUid,ammo=G.player?.ammo||0;baseKillEnemy(e);if(marked&&e.dead&&G.player){G.player.ammo=Math.min(G.player.magSize,G.player.ammo+1);G.run.wickPointerUid=0;targetClock=0;if(G.player.ammo>ammo)addText(G.player.x,G.player.y-25,'+1 EMBER CHARGE','#ffd98b',11);}};
 const baseDrawCombatFX=drawCombatFX;
 drawCombatFX=function(ctx){baseDrawCombatFX(ctx);drawPointer(ctx);};
 const baseUpdateHUD=updateHUD;
 updateHUD=function(dt){const out=baseUpdateHUD(dt),visible=canRecall();recall.hidden=!visible;recall.setAttribute('aria-hidden',String(!visible));recall.classList.toggle('prompt-clear',T('prompt').classList.contains('on'));return out;};
 const baseSetupFloor=setupFloor;
 setupFloor=function(f){presses=0;pressWindow=0;returnQueued=false;returning=false;targetClock=0;recall.hidden=true;return baseSetupFloor(f);};
 const baseBackToMenu=backToMenu;
 backToMenu=function(){presses=0;pressWindow=0;returnQueued=false;returning=false;recall.hidden=true;hide('wickGift');return baseBackToMenu();};
 const baseBlocking=anyBlockingOverlay;
 anyBlockingOverlay=function(){return gift.classList.contains('open')||returning||baseBlocking();};

 on(recall,'click',()=>{if(canRecall()){returnQueued=true;initAudio();}});
 on(T('wickGiftTake'),'click',takeGift);
 addEventListener('keydown',e=>{
  if(gift.classList.contains('open')){if(e.code==='Tab'){e.preventDefault();T('wickGiftTake').focus({preventScroll:true});}else if(['Enter','Space'].includes(e.code)){e.preventDefault();if(!e.repeat)takeGift();}return;}
  if(e.repeat||e.code!=='KeyQ'||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)||G.state!=='playing'||anyBlockingOverlay())return;
  e.preventDefault();returnQueued=true;initAudio();
 },true);
})();
