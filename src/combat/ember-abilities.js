const ARMORY={
  magazine:{name:'Deep Wells',requirement:'Reach the Lantern Walks',detail:'Hold more ember charges before Rekindling.'},
  edge:{name:'Bright Core',requirement:'Reach the Bell Court',detail:'Stronger Flare attacks can now appear among your blessings.'},
  quickload:{name:'Quickening',requirement:'Reach the Empty Barracks',detail:'Rekindle your ember charges more quickly.'},
  bladeEcho:{name:'Warden’s Wake',requirement:'Defeat the Star Warden',detail:'Flare can now release a piercing wave of light.'}
};
POOL.push(
  {id:'magazine',r:0,max:3,w:6,icon:'circles',name:'Deep Wells',ds:'+2 ember charges before Rekindling',unlock:'magazine'},
  {id:'edge',r:0,max:3,w:7,icon:'sparkles',name:'Bright Core',ds:'+25% Flare damage',unlock:'edge'},
  {id:'quickload',r:0,max:3,w:6,icon:'rotate-ccw',name:'Quickening',ds:'Rekindle 18% faster',unlock:'quickload'},
  {id:'bladeEcho',r:2,max:1,w:3,icon:'wind',name:'Warden’s Wake',ds:'Flare releases a piercing wave forward',unlock:'bladeEcho'}
);
const MELEE={damage:2.25,reach:66,halfArc:.8,windup:.22,swing:.22,cooldown:.92,cleave:[1,.65,.45]};
let meleeQueued=false,reloadQueued=false,armoryNotices=[];
function armoryData(){if(!save.armory)save.armory={};return save.armory;}
function unlockArmory(id){if(armoryData()[id])return;armoryData()[id]=true;armoryNotices.push(id);markSave();}
function initCombat(){
  const p=G.player;if(!p||!G.run)return;
  p.magSize=6+(G.run.up.magazine||0)*2;p.reloadDuration=1.65*Math.pow(.82,G.run.up.quickload||0);
  p.ammo=Number.isFinite(p.ammo)?clamp(Math.floor(p.ammo),0,p.magSize):p.magSize;
  for(const key of ['reloadT','meleeCdT','meleeWindT','meleeHitT','meleeAngle'])if(!Number.isFinite(p[key]))p[key]=0;
}
function beginReload(){
  const p=G.player;if(G.state!=='playing'||!p||p.reloadT>0||p.ammo>=p.magSize)return false;
  p.reloadT=p.reloadDuration;sfx('ui');return true;
}
function beginMelee(){
  const p=G.player;if(G.state!=='playing'||!p||p.meleeCdT>0||p.dashT>0)return false;
  const target=nearestTarget();p.meleeAngle=target&&d2(p.x,p.y,target.x,target.y)<160**2?Math.atan2(target.y-p.y,target.x-p.x):aimAngle();
  p.meleeWindT=MELEE.windup;p.meleeCdT=MELEE.cooldown;p.shotT=Math.max(p.shotT,.4);return true;
}
function strikeMelee(){
  const p=G.player,damage=p.dmg*MELEE.damage*(1+.25*(G.run.up.edge||0));p.meleeHitT=MELEE.swing;sfx('dash');
  const targets=G.enemies.filter(e=>!e.dead&&d2(p.x,p.y,e.x,e.y)<=(MELEE.reach+e.r)**2&&Math.abs(angleDiff(Math.atan2(e.y-p.y,e.x-p.x),p.meleeAngle))<=MELEE.halfArc&&los(G.world,p.x,p.y,e.x,e.y));
  targets.sort((a,b)=>d2(p.x,p.y,a.x,a.y)-d2(p.x,p.y,b.x,b.y));
  for(let i=0;i<Math.min(targets.length,MELEE.cleave.length);i++){
    const e=targets[i],a=Math.atan2(e.y-p.y,e.x-p.x),crit=chance(p.critC);
    damageEnemy(e,damage*MELEE.cleave[i]*(crit?2:1),a,crit,.8,'melee');burst(e.x,e.y,5,'#ffcf90',110,.24,2,true);
  }
  if(G.run.up.bladeEcho){G.bullets.push({x:p.x+Math.cos(p.meleeAngle)*20,y:p.y+Math.sin(p.meleeAngle)*20,vx:Math.cos(p.meleeAngle)*390,vy:Math.sin(p.meleeAngle)*390,r:12,dmg:damage*.5,pierce:8,ric:0,life:.5,hits:null,melee:true});}
}
function combatTick(dt){
  const p=G.player;initCombat();
  if(armoryNotices.length&&fieldNoteT<=0){const id=armoryNotices.shift();fieldNote(ARMORY[id].name+' unlocked. Look for it in blessing drafts.',5.5);}
  p.meleeCdT=Math.max(0,p.meleeCdT-dt);p.meleeHitT=Math.max(0,p.meleeHitT-dt);
  if(p.reloadT>0){p.reloadT=Math.max(0,p.reloadT-dt);if(p.reloadT===0){p.ammo=p.magSize;sfx('ui');}}
  if(reloadQueued){reloadQueued=false;beginReload();}
  if(dashQueued&&p.meleeWindT>0){p.meleeWindT=0;p.meleeCdT=.25;}
  if(meleeQueued){meleeQueued=false;beginMelee();}
  if(p.meleeWindT>0){p.meleeWindT=Math.max(0,p.meleeWindT-dt);if(p.meleeWindT===0)strikeMelee();}
  if(G.dead||G.state!=='playing')return true;return false;
}
function syncWeaponHUD(){
  const p=G.player;if(!p)return;initCombat();
  setTxt('ammoCount',p.ammo+' / '+p.magSize);setTxt('weaponStatus',p.reloadT>0?'REKINDLING':p.ammo===0?'DARK':'EMBER BOLT');
  setTxt('bladePower',(MELEE.damage*(1+.25*(G.run.up.edge||0))).toFixed(2)+'×');
  const key=p.ammo+':'+p.magSize;if(T('ammoRounds').dataset.count!==key){T('ammoRounds').dataset.count=key;T('ammoRounds').innerHTML=Array.from({length:p.magSize},(_,i)=>'<i class="'+(i<p.ammo?'loaded':'')+'"></i>').join('');}
  T('reloadProgress').style.width=(p.reloadT>0?(1-p.reloadT/p.reloadDuration)*100:0)+'%';T('weaponHUD').classList.toggle('rekindling',p.reloadT>0);
  T('bladeReady').textContent=p.meleeCdT>0?'FLARE RECOVERING':'FLARE READY';T('bladeProgress').style.width=(1-clamp(p.meleeCdT/MELEE.cooldown,0,1))*100+'%';
  T('btnReload').disabled=p.reloadT>0||p.ammo>=p.magSize;T('btnMelee').disabled=p.meleeCdT>0;
  const touchStates=[['touchMelee',p.meleeCdT>0],['touchDash',p.dashCdT>0],['touchReload',p.reloadT>0||p.ammo>=p.magSize]];
  for(const [id,cooling] of touchStates){const el=T(id);el.classList.toggle('cooling',cooling);el.setAttribute('aria-disabled',String(cooling));}
}
function drawFlareArc(ctx,x,y,a,r,t,half=.8,color='#fff0cc'){
  if(t<=0||t>=1)return;const end=-half+2*half*t,start=Math.max(-half,end-.82),fade=Math.sin(Math.PI*t);
  ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalCompositeOperation='lighter';
  for(let i=0;i<6;i++){const v=(i+1)/6;ctx.beginPath();ctx.arc(0,0,r-i*2,start+(end-start)*i/6,end);ctx.strokeStyle=i<2?'#fff4cf':i<4?'#ffc76f':'#ef6f5d';ctx.globalAlpha=fade*(.12+.58*v);ctx.lineWidth=1+5*v;ctx.stroke();}
  for(let i=0;i<5;i++){const q=start+(end-start)*(i/4),rr=r+4+Math.sin(i*8+t*9)*5;ctx.fillStyle=color;ctx.globalAlpha=fade*(.35+i*.09);ctx.fillRect(Math.cos(q)*rr-1,Math.sin(q)*rr-1,3,3);}
  ctx.restore();
}
function drawCombatFX(ctx){
  const p=G.player;if(!p||G.dead)return;const blink=p.hitCd>0&&p.dashT<=0&&(G.tAll*18|0)%2===0&&G.state==='playing';if(blink||p.dashT>0)return;
  const t=save.motion?0:G.tAll,face=p.face||0;
  if(p.reloadT>0){
    const u=1-p.reloadT/p.reloadDuration,ease=u*u*(3-2*u),radius=38*(1-ease)+10;
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<p.magSize;i++){const a=t*4+i/p.magSize*TAU,rr=radius+(i%2)*4,x=p.x+Math.cos(a)*rr,y=p.y-4+Math.sin(a)*rr*.52;ctx.fillStyle=i<p.ammo?'#9a663d':'#ffd37d';ctx.globalAlpha=.28+.55*ease;ctx.fillRect(x-2,y-2,4,4);ctx.strokeStyle='#ffe7ac55';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(p.x,p.y-4);ctx.stroke();}
    ctx.strokeStyle='#f1c67588';ctx.globalAlpha=.4+ease*.5;ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y-4,10+ease*8,0,TAU*ease);ctx.stroke();ctx.restore();
  }
  if(p.muzzle>0){
    const u=clamp(p.muzzle/.06,0,1),cx=p.x+Math.cos(face)*12,cy=p.y-4+Math.sin(face)*12;glowImg('ember',cx,cy,30,u*.65);
    ctx.save();ctx.translate(cx,cy);ctx.rotate(face);ctx.globalCompositeOperation='lighter';ctx.fillStyle='#fff5cb';ctx.globalAlpha=u;ctx.beginPath();ctx.moveTo(-5,-4);ctx.lineTo(18,0);ctx.lineTo(-5,4);ctx.closePath();ctx.fill();ctx.fillStyle='#ffad55';for(let i=0;i<3;i++)ctx.fillRect(7+i*7,(i-1)*5,4-i,3-i*.5);ctx.restore();
  }
  if(p.meleeWindT>0){
    const u=1-p.meleeWindT/MELEE.windup;ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<7;i++){const a=p.meleeAngle+Math.PI+Math.sin(i*4.7)*.8,rr=45*(1-u)+8+i%2*5;ctx.fillStyle=i%2?'#ff9a54':'#ffe09b';ctx.globalAlpha=.25+u*.6;ctx.fillRect(p.x+Math.cos(a)*rr-2,p.y+Math.sin(a)*rr-2,3,3);}
    ctx.strokeStyle='#f8b76699';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,12+u*11,p.meleeAngle-.8,p.meleeAngle+.8);ctx.stroke();ctx.restore();
  }
  if(p.meleeHitT>0){const u=1-p.meleeHitT/MELEE.swing;drawFlareArc(ctx,p.x,p.y,p.meleeAngle,MELEE.reach,u,MELEE.halfArc);glowImg('ember',p.x,p.y,42,Math.sin(Math.PI*u)*.45);}
  for(const b of G.bullets)if(b.melee){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#ffd48a';ctx.lineWidth=4;ctx.beginPath();ctx.arc(-9,0,22,-.9,.9);ctx.stroke();ctx.strokeStyle='#fff1c9';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();}
}

function renderArmory(){
  const list=T('armoryList');list.replaceChildren();
  for(const[id,o]of Object.entries(ARMORY)){const row=document.createElement('div');row.className='armory-entry'+(armoryData()[id]?' unlocked':'');const title=document.createElement('strong'),desc=document.createElement('small');title.textContent=armoryData()[id]?o.name:'Undiscovered blessing';desc.textContent=armoryData()[id]?o.detail:o.requirement;row.append(title,desc);list.appendChild(row);}
}
function wireCombat(){
  on(T('btnReload'),'click',()=>{if(G.state==='playing')reloadQueued=true;});on(T('btnMelee'),'click',()=>{if(G.state==='playing')meleeQueued=true;});
  on(T('touchMelee'),'pointerdown',e=>{e.preventDefault();if(G.state==='playing')meleeQueued=true;});on(T('touchReload'),'click',()=>{if(G.state==='playing')reloadQueued=true;});
  addEventListener('keydown',e=>{if(e.repeat||G.state!=='playing'||anyBlockingOverlay()||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;if(e.code==='KeyK'){e.preventDefault();meleeQueued=true;}if(e.code==='KeyR'){e.preventDefault();reloadQueued=true;}});
  addEventListener('mousedown',e=>{if(e.button===2&&e.target.id==='cv'&&G.state==='playing'){e.preventDefault();meleeQueued=true;initAudio();}});
}
const beforeCombat={fireVolley,recalc,startRun,setupFloor,resumeRun,damageEnemy,killBoss,validateSave,validateCheckpoint,updateHUD,clearInput,renderMemories,chooseCard};
fireVolley=function(){const p=G.player;initCombat();if(p.reloadT>0||p.meleeWindT>0||p.meleeHitT>.08)return;if(p.ammo<=0){beginReload();return;}p.ammo--;beforeCombat.fireVolley();if(p.ammo===0)beginReload();};
recalc=function(){beforeCombat.recalc();initCombat();};
startRun=function(){beforeCombat.startRun();initCombat();syncWeaponHUD();};
setupFloor=function(f){beforeCombat.setupFloor(f);initCombat();if(f===2)unlockArmory('magazine');if(f===3)unlockArmory('edge');if(f===4)unlockArmory('quickload');};
resumeRun=function(){beforeCombat.resumeRun();migrateEnemyBalance();initCombat();syncWeaponHUD();};
clearInput=function(){beforeCombat.clearInput();meleeQueued=false;reloadQueued=false;};
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
  if(e.warden){
    if(!e.introduced)return;const b=e.wb;
    if(kind==='melee'){
      if(!b.second&&b.mode==='wait'&&Math.abs(angleDiff(ang+Math.PI,b.a))<1.15)dmg*=1.4;
    }else if(!b.second&&b.mode==='windup'&&Math.abs(angleDiff(ang+Math.PI,b.a))<1.15)dmg*=.35;
  }
  if(e.type==='gateShield'&&kind==='melee'&&e.action!=='recover'){
    const front=Math.abs(angleDiff(ang+Math.PI,e.face||0))<1.15;
    if(front)dmg*=1.75;
    if((e.staggerCd||0)<=0){
      e.guardHits=(e.guardHits||0)+1;
      if(e.guardHits>=2){e.guardHits=0;e.staggerCd=2.4;e.action='recover';e.actionT=.38;if(front)dmg/=1.75;burst(e.x,e.y,7,'#b9a4ff',100,.3,2,true);}
    }
  }
  beforeCombat.damageEnemy(e,dmg,ang,crit,kb,kind);
};
killBoss=function(b){beforeCombat.killBoss(b);if(b.warden){
  unlockArmory('bladeEcho');let xp=0;
  G.picks=G.picks.filter(o=>{if(d2(o.x,o.y,b.x,b.y)>130**2)return true;if(o.kind==='xp')xp+=o.val;else if(o.kind==='ess')addEss(o.val);else if(o.kind==='heart')G.player.hp=Math.min(G.player.maxHp,G.player.hp+o.val);return false;});
  if(xp)gainXP(xp);updateHUD(0);saveNow();
}};
updateHUD=function(dt){beforeCombat.updateHUD(dt);syncWeaponHUD();if(G.boss?.warden&&G.boss.introduced)setTxt('floorObjective','THE LAST WATCH');};
renderMemories=function(){beforeCombat.renderMemories();renderArmory();};
chooseCard=function(i){beforeCombat.chooseCard(i);if(G.player&&G.run)updateHUD(0);};
validateSave=function(raw){const clean=beforeCombat.validateSave(raw);clean.armory={};for(const id of Object.keys(ARMORY))if(raw.armory?.[id]===true)clean.armory[id]=true;return clean;};
validateCheckpoint=function(r){beforeCombat.validateCheckpoint(r);for(const k of ['ammo','reloadT','meleeCdT','meleeWindT','meleeHitT','meleeAngle'])if(r.player[k]!==undefined&&(typeof r.player[k]!=='number'||!Number.isFinite(r.player[k])||Math.abs(r.player[k])>1e6))throw Error('Invalid ability state');if(r.player.ammo!==undefined&&(r.player.ammo<0||!Number.isInteger(r.player.ammo)||r.player.ammo>12))throw Error('Invalid charge count');for(const e of r.enemies)for(const k of ['balanceVersion','guardHits','staggerCd'])if(e[k]!==undefined&&(!Number.isFinite(e[k])||e[k]<0||e[k]>1e6))throw Error('Invalid enemy state');return r;};
function migrateEnemyBalance(){
  if(!G.run||!G.enemies)return;
  let changed=false;
  for(const e of G.enemies){
    if(e.dead||e.balanceVersion===2||!(e.ai==='gate'||e.warden))continue;
    const ratio=clamp(e.hp/e.max,0,1),t=ETYPES[e.type];
    e.max=e.warden?WARDEN_HP:Math.round(t.hp*(1+Math.max(0,G.floor-1)*.11)*(e.elite?1.55:1));
    e.hp=Math.max(1,Math.round(e.max*ratio));e.balanceVersion=2;e.staggerCd=0;e.guardHits=0;if(!e.warden)e.col=t.col;
    changed=true;
  }
  if(changed)saveNow();
}
