const COMBAT_POLISH={
  freeze:0,spawns:[],debris:[],dashes:[],near:[],flash:0,flashCol:'#ffffff',
  lookX:0,lookY:0,appliedX:0,appliedY:0,serial:0
};

function combatPolishReduced(){return !!save.motion;}
function combatPolishFreeze(t){
  if(combatPolishReduced())return;
  COMBAT_POLISH.freeze=Math.min(.06,Math.max(COMBAT_POLISH.freeze,t));
}
function combatPolishFlash(amount,col){
  COMBAT_POLISH.flash=Math.max(COMBAT_POLISH.flash,combatPolishReduced()?amount*.25:amount);
  COMBAT_POLISH.flashCol=col||'#fff7dd';
}
function combatPolishRumble(duration,strong,weak){
  if(combatPolishReduced())return;
  const touch=document.body?.classList.contains('touch');
  try{if(touch&&navigator.vibrate)navigator.vibrate(Math.min(45,duration));}catch(_){ }
  try{
    const pads=navigator.getGamepads?.()||[];
    for(const pad of pads){
      const motor=pad?.vibrationActuator;
      if(motor?.playEffect)motor.playEffect('dual-rumble',{duration,startDelay:0,strongMagnitude:strong,weakMagnitude:weak}).catch?.(()=>{});
    }
  }catch(_){ }
}
function combatPolishReset(){
  COMBAT_POLISH.freeze=0;COMBAT_POLISH.spawns.length=0;COMBAT_POLISH.debris.length=0;
  COMBAT_POLISH.dashes.length=0;COMBAT_POLISH.near.length=0;COMBAT_POLISH.flash=0;
  COMBAT_POLISH.lookX=COMBAT_POLISH.lookY=COMBAT_POLISH.appliedX=COMBAT_POLISH.appliedY=0;
}
function combatPolishSpawn(e,boss){
  if(!e)return e;
  const max=boss?.62:.3;
  e.polishSpawnT=max;e.polishSpawnMax=max;e.polishSpawnSeed=++COMBAT_POLISH.serial;
  COMBAT_POLISH.spawns.push({x:e.x,y:e.y,r:e.r||12,col:e.col||'#bdefff',life:max,max,seed:e.polishSpawnSeed,boss:!!boss});
  if(COMBAT_POLISH.spawns.length>48)COMBAT_POLISH.spawns.shift();
  return e;
}
function combatPolishDebris(e){
  const boss=!!e.isBoss,count=combatPolishReduced()?(boss?8:3):(boss?24:e.elite?13:7),base=e.col||'#be9cff';
  for(let i=0;i<count;i++){
    const a=i/count*TAU+Math.random()*.65,spd=rand(boss?90:55,boss?270:190),max=rand(.32,boss?.85:.58);
    COMBAT_POLISH.debris.push({x:e.x,y:e.y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd-20,rot:Math.random()*TAU,spin:rand(-9,9),size:rand(boss?3:2,boss?8:5),col:i%4===0?'#ffffff':base,life:max,max});
  }
  if(COMBAT_POLISH.debris.length>150)COMBAT_POLISH.debris.splice(0,COMBAT_POLISH.debris.length-150);
}

const combatPolishSpawnEnemy=spawnEnemy;
spawnEnemy=function(type,x,y,elite){return combatPolishSpawn(combatPolishSpawnEnemy(type,x,y,elite),false);};
const combatPolishSpawnBossAt=spawnBossAt;
spawnBossAt=function(x,y){return combatPolishSpawn(combatPolishSpawnBossAt(x,y),true);};
if(typeof makeLateBoss==='function'){
  const combatPolishMakeLateBoss=makeLateBoss;
  makeLateBoss=function(...args){
    const e=combatPolishMakeLateBoss(...args);let fx=null;
    for(let i=COMBAT_POLISH.spawns.length-1;i>=0;i--)if(COMBAT_POLISH.spawns[i].seed===e.polishSpawnSeed){fx=COMBAT_POLISH.spawns[i];break;}
    e.polishSpawnT=e.polishSpawnMax=.62;if(fx){fx.life=fx.max=.62;fx.boss=true;}return e;
  };
}

const combatPolishEnemyShoot=enemyShoot;
enemyShoot=function(e,ang,spd,dmg){
  const n=G.ebul.length,result=combatPolishEnemyShoot(e,ang,spd,dmg);
  for(let i=n;i<G.ebul.length;i++){G.ebul[i].polishBorn=G.tAll;G.ebul[i].polishSeed=++COMBAT_POLISH.serial;}
  return result;
};

const combatPolishKillEnemy=killEnemy;
killEnemy=function(e){
  if(!e||e.dead)return combatPolishKillEnemy(e);
  const boss=!!e.isBoss,result=combatPolishKillEnemy(e);
  if(e.dead){
    combatPolishDebris(e);combatPolishFreeze(boss?.055:.032);combatPolishFlash(boss?.17:.055,boss?'#ffe0aa':e.col);
    combatPolishRumble(boss?42:18,boss?.75:.2,boss?.55:.25);
  }
  return result;
};

const combatPolishDamageEnemy=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind){
  if(!e||e.dead)return combatPolishDamageEnemy(e,dmg,ang,crit,kb,kind);
  const before=e.hp,result=combatPolishDamageEnemy(e,dmg,ang,crit,kb,kind),dealt=Math.max(0,before-e.hp);
  if(dealt>0&&!e.dead){
    if(kind==='melee'){combatPolishFreeze(.022);combatPolishRumble(15,.18,.32);}
    else if(crit){combatPolishFreeze(.014);combatPolishFlash(.035,'#fff0ae');combatPolishRumble(10,.12,.2);}
  }
  return result;
};

const combatPolishHurtPlayer=hurtPlayer;
hurtPlayer=function(dmg,sx,sy){
  const p=G.player,before=p?.hp,result=combatPolishHurtPlayer(dmg,sx,sy);
  if(p&&p.hp<before){combatPolishFreeze(.04);combatPolishFlash(.12,'#ff5f68');combatPolishRumble(38,.7,.42);}
  return result;
};

const combatPolishStrikeMelee=strikeMelee;
strikeMelee=function(){const result=combatPolishStrikeMelee();combatPolishRumble(16,.12,.3);return result;};

function combatPolishTick(dt){
  COMBAT_POLISH.flash=Math.max(0,COMBAT_POLISH.flash-dt*1.9);
  for(const list of [COMBAT_POLISH.spawns,COMBAT_POLISH.dashes,COMBAT_POLISH.near]){
    for(let i=list.length-1;i>=0;i--){list[i].life-=dt;if(list[i].life<=0)list.splice(i,1);}
  }
  for(let i=COMBAT_POLISH.debris.length-1;i>=0;i--){
    const d=COMBAT_POLISH.debris[i];d.life-=dt;if(d.life<=0){COMBAT_POLISH.debris.splice(i,1);continue;}
    d.x+=d.vx*dt;d.y+=d.vy*dt;d.vx*=Math.pow(.045,dt);d.vy=d.vy*Math.pow(.11,dt)+28*dt;d.rot+=d.spin*dt;
  }
  for(const e of G.enemies||[])e.polishSpawnT=Math.max(0,(e.polishSpawnT||0)-dt);
}
const combatPolishUpdateFx=updateFx;
updateFx=function(dt){combatPolishUpdateFx(dt);combatPolishTick(dt);};

function combatPolishDashStart(p){
  const a=Math.atan2(p.dashDy,p.dashDx),max=.34;
  COMBAT_POLISH.dashes.push({x:p.x,y:p.y,a,life:max,max});
  combatPolishRumble(20,.2,.42);
}
function combatPolishNearMisses(p){
  if(!p||p.dashT<=0)return;
  for(const b of G.ebul||[]){
    if(b.polishDodged)continue;
    const rr=(p.r||9)+(b.r||5)+25,dd=d2(p.x,p.y,b.x,b.y);
    if(dd<rr*rr&&dd>((p.r||9)+(b.r||5)+2)**2){
      b.polishDodged=true;const max=.3;
      COMBAT_POLISH.near.push({x:b.x,y:b.y,a:Math.atan2(b.vy,b.vx),life:max,max});
      combatPolishRumble(12,.08,.22);
      if(AC&&save.sfx){bell(880,.16,.012,0,false);air(.08,.012,2600,900,1.2,0);}
    }
  }
}

const combatPolishUpdate=update;
update=function(dt){
  if(COMBAT_POLISH.freeze>0&&G.state==='playing'){
    COMBAT_POLISH.freeze=Math.max(0,COMBAT_POLISH.freeze-dt);
    updateFx(Math.min(dt,.016));updateHUD(0);return;
  }
  const p0=G.player,beforeDash=p0?.dashT||0;
  if(G.cam&&(COMBAT_POLISH.appliedX||COMBAT_POLISH.appliedY)){G.cam.x-=COMBAT_POLISH.appliedX;G.cam.y-=COMBAT_POLISH.appliedY;COMBAT_POLISH.appliedX=COMBAT_POLISH.appliedY=0;}
  const result=combatPolishUpdate(dt),p=G.player;
  if(!p||!G.cam)return result;
  if(beforeDash<=0&&p.dashT>0)combatPolishDashStart(p);
  combatPolishNearMisses(p);
  const active=G.state==='playing'&&!combatPolishReduced(),aiming=active&&(mouse.down||keys.KeyJ||touchInput.aimActive),moveMag=Math.hypot(touchInput.moveX||0,touchInput.moveY||0);
  let targetX=0,targetY=0;
  if(active){
    if(aiming){targetX=Math.cos(p.face||0)*28;targetY=Math.sin(p.face||0)*28;}
    if(moveMag>.15){targetX+=touchInput.moveX*8;targetY+=touchInput.moveY*8;}
  }
  const follow=1-Math.exp(-Math.min(dt,.05)*5.5);
  COMBAT_POLISH.lookX=lerp(COMBAT_POLISH.lookX,targetX,follow);COMBAT_POLISH.lookY=lerp(COMBAT_POLISH.lookY,targetY,follow);
  COMBAT_POLISH.appliedX=COMBAT_POLISH.lookX;COMBAT_POLISH.appliedY=COMBAT_POLISH.lookY;
  G.cam.x+=COMBAT_POLISH.appliedX;G.cam.y+=COMBAT_POLISH.appliedY;
  return result;
};

const combatPolishSetupFloor=setupFloor;
setupFloor=function(f){
  if(G.cam&&(COMBAT_POLISH.appliedX||COMBAT_POLISH.appliedY)){G.cam.x-=COMBAT_POLISH.appliedX;G.cam.y-=COMBAT_POLISH.appliedY;}
  combatPolishReset();return combatPolishSetupFloor(f);
};

const combatPolishDrawBullets=drawBullets;
drawBullets=function(ctx){
  combatPolishDrawBullets(ctx);
  ctx.save();
  for(const b of G.ebul||[]){
    const sp=Math.max(1,Math.hypot(b.vx||0,b.vy||0)),nx=(b.vx||0)/sp,ny=(b.vy||0)/sp,r=Math.max(3,b.r||5),pulse=combatPolishReduced()?0:.5+.5*Math.sin(G.tAll*9+(b.polishSeed||0));
    ctx.globalCompositeOperation='source-over';ctx.lineCap='square';ctx.strokeStyle='#190d22';ctx.globalAlpha=.9;ctx.lineWidth=Math.max(4,r*.95);
    ctx.beginPath();ctx.moveTo(b.x-nx*(r+8),b.y-ny*(r+8));ctx.lineTo(b.x+nx*2,b.y+ny*2);ctx.stroke();
    ctx.strokeStyle='#ff557e';ctx.globalAlpha=.82;ctx.lineWidth=Math.max(1.5,r*.34);ctx.beginPath();ctx.moveTo(b.x-nx*(r+7),b.y-ny*(r+7));ctx.lineTo(b.x+nx*3,b.y+ny*3);ctx.stroke();
    ctx.globalCompositeOperation='lighter';ctx.fillStyle='#fff1f5';ctx.globalAlpha=.9;ctx.fillRect(Math.round(b.x-r*.32),Math.round(b.y-r*.32),Math.max(2,r*.64),Math.max(2,r*.64));
    ctx.strokeStyle='#ff7c9c';ctx.globalAlpha=.28+pulse*.15;ctx.lineWidth=1;ctx.beginPath();ctx.arc(b.x,b.y,r+3+pulse*2,0,TAU);ctx.stroke();
  }
  for(const b of G.bullets||[]){if(b.melee)continue;const r=b.whiteStar?3:2;ctx.globalCompositeOperation='lighter';ctx.fillStyle='#fffdf0';ctx.globalAlpha=.88;ctx.fillRect(Math.round(b.x-r),Math.round(b.y-r),r*2,r*2);}
  ctx.restore();
};

function combatPolishDrawWorld(ctx){
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const s of COMBAT_POLISH.spawns){
    const q=1-s.life/s.max,fade=Math.sin(Math.PI*Math.min(1,q)),r=s.r*(.55+q*(s.boss?2.8:1.7));
    ctx.save();ctx.translate(s.x,s.y);ctx.rotate((save.motion?0:G.tAll)*.35+s.seed);ctx.strokeStyle=s.col;ctx.globalAlpha=fade*(s.boss?.55:.32);ctx.lineWidth=s.boss?2:1;
    for(let i=0;i<(s.boss?3:2);i++){const rr=r+i*7;ctx.beginPath();for(let k=0;k<8;k++){const a=k*TAU/8,x=Math.cos(a)*rr,y=Math.sin(a)*rr;k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.stroke();}
    ctx.fillStyle='#dffbff';for(let i=0;i<(s.boss?14:6);i++){const a=i*2.399+s.seed,rr=r*(.35+(i%4)*.18),sz=s.boss?3:2;ctx.globalAlpha=fade*(.18+(i%3)*.08);ctx.fillRect(Math.cos(a)*rr-sz/2,Math.sin(a)*rr-q*16-sz/2,sz,sz);}
    ctx.restore();
  }
  for(const d of COMBAT_POLISH.debris){const q=d.life/d.max;ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.rot);ctx.fillStyle=d.col;ctx.globalAlpha=q*q*.78;ctx.fillRect(-d.size/2,-d.size/2,d.size,d.size);ctx.fillStyle='#ffffff';ctx.globalAlpha=q*.22;ctx.fillRect(-d.size*.18,-d.size*.18,d.size*.36,d.size*.36);ctx.restore();}
  for(const d of COMBAT_POLISH.dashes){const q=1-d.life/d.max,fade=1-q;ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.a);ctx.strokeStyle='#ffe0a0';ctx.globalAlpha=fade*.52;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,15+q*30,9+q*17,0,0,TAU);ctx.stroke();for(let i=-2;i<=2;i++){ctx.globalAlpha=fade*(.18+(2-Math.abs(i))*.08);ctx.beginPath();ctx.moveTo(-8,i*5);ctx.lineTo(-32-q*34,i*8);ctx.stroke();}ctx.restore();}
  for(const n of COMBAT_POLISH.near){const q=1-n.life/n.max,fade=1-q;ctx.save();ctx.translate(n.x,n.y);ctx.rotate(n.a);ctx.strokeStyle='#dffcff';ctx.globalAlpha=fade*.75;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-13-q*10,-8);ctx.lineTo(0,0);ctx.lineTo(-13-q*10,8);ctx.stroke();ctx.restore();}
  if(G.player&&G.state==='playing'&&!document.body.classList.contains('touch')){
    const wx=mouse.x+G.cam.x,wy=mouse.y+G.cam.y,t=combatPolishReduced()?0:G.tAll;
    ctx.save();ctx.translate(wx,wy);ctx.rotate(t*.45);ctx.strokeStyle=mouse.down?'#ffd187':'#c4d8dc';ctx.globalAlpha=mouse.down?.64:.38;ctx.lineWidth=1;
    for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(mouse.down?15:12,0);ctx.stroke();}ctx.fillStyle='#ffffff';ctx.globalAlpha=.65;ctx.fillRect(-1,-1,2,2);ctx.restore();
  }
  ctx.restore();
}
const combatPolishDrawCombatFX=drawCombatFX;
drawCombatFX=function(ctx){combatPolishDrawCombatFX(ctx);combatPolishDrawWorld(ctx);};

const combatPolishRender=render;
render=function(){
  combatPolishRender();
  if(COMBAT_POLISH.flash<=0||G.state==='menu')return;
  const ctx=G.ctx;ctx.save();ctx.setTransform(G.dpr,0,0,G.dpr,0,0);ctx.fillStyle=COMBAT_POLISH.flashCol;ctx.globalAlpha=Math.min(.13,COMBAT_POLISH.flash);ctx.fillRect(0,0,G.w,G.h);ctx.restore();
};
