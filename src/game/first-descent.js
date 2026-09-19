'use strict';

const KINDLED_DURATION=3.4;
function initEmberRhythm(p=G.player){
 if(!p)return;
 for(const key of ['kindledT','rhythmDashSerial'])if(!Number.isFinite(p[key]))p[key]=0;
}
function kindleFlare(source){
 const p=G.player;if(!p||G.state!=='playing')return;
 initEmberRhythm(p);const fresh=p.kindledT<=0;p.kindledT=KINDLED_DURATION;
 if(fresh){addText(p.x,p.y-27,'KINDLED','#fff0a6',14);burst(p.x,p.y,14,'#ffd478',150,.42,2.4,true);if(typeof combatPolishFlash==='function')combatPolishFlash(.045,'#ffe2a0');}
 if(!p.kindledLearnedRun){p.kindledLearnedRun=true;fieldNote('A close dash kindled your Flare. Strike before the light fades.',3.2);}
 if(source)source.kindledClaimed=true;
 syncWeaponHUD();
}
function kindleFromCloseDash(p){
 for(const b of G.ebul||[])if(b.polishDodged&&!b.kindledClaimed)kindleFlare(b);
 if(p.dashT<=0)return;
 for(const e of G.enemies||[]){
  if(e.dead||e.rhythmDashRead===p.rhythmDashSerial)continue;
  let danger=false,range=0;
  if(e.ai==='gate'&&['warn','leap'].includes(e.action)){danger=true;range=e.type==='gateHound'?94:128;}
  else if(e.warden&&e.introduced&&['windup','swing','lunge'].includes(e.wb?.mode)){danger=true;range=WARDEN_REACH+48;}
  if(danger&&d2(p.x,p.y,e.x,e.y)<range*range){e.rhythmDashRead=p.rhythmDashSerial;kindleFlare(e);}
 }
}

const firstDescentUpdate=update;
update=function(dt){
 const p0=G.player,before=p0?.dashT||0,result=firstDescentUpdate(dt),p=G.player;
 if(!p||G.state!=='playing')return result;
 initEmberRhythm(p);if(before<=0&&p.dashT>0)p.rhythmDashSerial++;
 p.kindledT=Math.max(0,p.kindledT-dt);if(p.dashT>0)kindleFromCloseDash(p);return result;
};

const firstDescentStrike=strikeMelee;
strikeMelee=function(){
 const p=G.player;if(!p)return firstDescentStrike();initEmberRhythm(p);
 const kindled=p.kindledT>0,before=(G.enemies||[]).reduce((n,e)=>n+(e.dead?0:e.hp),0);p.kindledStrike=kindled;
 const result=firstDescentStrike(),after=(G.enemies||[]).reduce((n,e)=>n+(e.dead?0:Math.max(0,e.hp)),0),hit=after<before;
 p.kindledStrike=false;if(kindled)p.kindledT=0;
 if(kindled&&hit){
  p.meleeCdT=Math.min(p.meleeCdT,.44);
  if(p.reloadT>0)p.reloadT=Math.max(.12,p.reloadT-.55);else p.ammo=Math.min(p.magSize,p.ammo+1);
  addText(p.x,p.y-29,'KINDLED FLARE','#fff2b3',15);burst(p.x+Math.cos(p.meleeAngle)*42,p.y+Math.sin(p.meleeAngle)*42,18,'#ffe09a',190,.5,2.8,true);
  if(typeof combatPolishFreeze==='function')combatPolishFreeze(.036);if(typeof combatPolishRumble==='function')combatPolishRumble(23,.32,.48);learnOnboarding?.('kindled');
 }
 return result;
};

const firstDescentDamage=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
 if(!e||e.dead)return firstDescentDamage(e,dmg,ang,crit,kb,kind);
 const p=G.player,kindled=kind==='melee'&&p?.kindledStrike,opening=e.ai==='gate'&&e.action==='recover',interrupt=kindled&&e.ai==='gate'&&['warn','leap'].includes(e.action),wardenOpening=e.warden&&e.wb?.mode==='recover';
 if(kind==='melee'&&opening)dmg*=1.22;
 if(kindled)dmg*=1.35;
 if(kindled&&wardenOpening)dmg*=1.3;
 const result=firstDescentDamage(e,dmg,ang,crit,kb,kind);
 if(interrupt&&!e.dead){e.action='recover';e.actionT=.68;e.strikeT=0;burst(e.x,e.y,9,'#ffe0a0',120,.34,2,true);}
 if(kindled&&wardenOpening&&!e.dead&&!e.wb.kindledOpened){e.wb.kindledOpened=true;e.wb.t=Math.max(e.wb.t,.38);}
 return result;
};

const firstDescentBuildCards=buildCards;
buildCards=function(){
 if(G.floor===1&&G.opts.freeChoice&&!G.run.openingGiftClaimed){G.restoreCardIds=['dmg','speed','dash'];G.run.openingGiftClaimed=true;}
 return firstDescentBuildCards();
};

const firstDescentSetup=setupFloor;
setupFloor=function(f){const result=firstDescentSetup(f);initEmberRhythm();if(G.player)G.player.kindledT=0;return result;};
const firstDescentStart=startRun;
startRun=function(){const result=firstDescentStart();initEmberRhythm();return result;};
const firstDescentResume=resumeRun;
resumeRun=function(){const result=firstDescentResume();initEmberRhythm();return result;};

const firstDescentSync=syncWeaponHUD;
syncWeaponHUD=function(){
 firstDescentSync();const p=G.player,hud=T('weaponHUD');if(!p||!hud)return;const kindled=(p.kindledT||0)>0;
 hud.classList.toggle('kindled',kindled);T('touchMelee')?.classList.toggle('kindled',kindled);if(kindled){T('bladeReady').textContent='KINDLED FLARE · '+p.kindledT.toFixed(1)+'s';T('weaponStatus').textContent=p.reloadT>0?'REKINDLING · FLARE ARMED':'EMBER BOLT · FLARE ARMED';}
};

const firstDescentDrawPlayer=drawPlayer;
drawPlayer=function(ctx){
 firstDescentDrawPlayer(ctx);const p=G.player;if(!p||p.kindledT<=0||G.dead)return;const t=save.motion?0:G.tAll,q=clamp(p.kindledT/KINDLED_DURATION,0,1);
 ctx.save();ctx.translate(p.x,p.y-3);ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#ffe5a3';ctx.globalAlpha=.32+.3*q;ctx.lineWidth=2;
 for(let i=0;i<3;i++){const a=t*(1.8+i*.3)+i*TAU/3;ctx.beginPath();ctx.arc(0,0,23+i*4,a,a+.74);ctx.stroke();ctx.fillStyle=i?'#ffb55d':'#fff4c4';ctx.fillRect(Math.cos(a+.74)*(23+i*4)-2,Math.sin(a+.74)*(23+i*4)-2,4,4);}
 ctx.restore();
};

const firstDescentHUD=updateHUD;
updateHUD=function(dt){
 firstDescentHUD(dt);if(!G.world||G.floor>5||G.boss?.introduced)return;const active=G.world.specialEncounters?.find(o=>o.active&&!o.complete);if(active)return;
 const goals=['LEARN BOLT · FLARE','DASH CLOSE · KINDLE FLARE','STRIKE DURING RECOVERY','CONTROL THE ROOM','FIND THE WARDEN'];setTxt('floorObjective',goals[G.floor-1]);
};

const firstDescentStyle=document.createElement('style');firstDescentStyle.textContent=`
#weaponHUD.kindled{border-color:#ffe29acc!important;box-shadow:inset 3px 0 #ffd36b,0 0 30px #ffb64b38!important}#weaponHUD.kindled #bladeReady,#weaponHUD.kindled #weaponStatus{color:#fff0b3!important;text-shadow:0 0 9px #ffbd58aa}#weaponHUD.kindled #bladeProgress{background:#ffe08a;box-shadow:0 0 10px #ffbd55}
.touch-action#touchMelee.kindled{border-color:#ffe29acc;box-shadow:inset 0 0 0 5px #ffd88420,0 0 25px #ffb14866}
`;if(document.head)document.head.appendChild(firstDescentStyle);
