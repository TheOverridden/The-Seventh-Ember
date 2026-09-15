/* ======================================================================
   ENDLESS ASCENSION · steep scaling, anti-circle pressure, and safe saves
   ====================================================================== */
const ENDLESS_DIFFICULTY_VERSION=3;
const ENDLESS_BOSS_WEIGHT={bellkeeper:.88,colossus:.94,astronomer:1,scribe:1.06,regents:.62,seraph:1.1,tyrant:1.17,keeper:1.25};
const endlessLayoutStyle=document.createElement('style');
endlessLayoutStyle.textContent='@media(max-width:700px){#topC{top:174px}}';
document.head?.appendChild(endlessLayoutStyle);
const endlessDepthAt=(f=G.floor)=>Math.max(0,f-50);
function endlessDifficulty(f=G.floor){
 const depth=endlessDepthAt(f),enemyHp=(8+depth*.42)*Math.pow(1.035,depth),enemyDmg=(1.2+depth*.035)*Math.pow(1.009,depth),bossBase=130000*Math.pow(1.055,depth)*(1+depth*.04),mechanism=(1+depth*.055)*Math.pow(1.026,depth);
 return{depth,threat:Math.min(99,1+Math.floor(Math.max(0,depth-1)/10)),enemyHp:Math.min(enemyHp,1e10),enemyDmg:Math.min(enemyDmg,1e7),bossBase:Math.min(bossBase,7e11),mechanism:Math.min(mechanism,1e8),haste:1+Math.min(.62,depth*.009),projectile:1+Math.min(.58,depth*.008),speed:1+Math.min(.3,depth*.0038),reinforcements:Math.min(14,2+Math.floor(Math.max(0,depth-1)/7))};
}
function endlessBossTarget(b,f=G.floor){
 const q=endlessDifficulty(f),weight=ENDLESS_BOSS_WEIGHT[b.bossKey]||1,mutation=endlessMutation(f).key,iron=mutation==='iron'?1.18:1,crowns=1+.25*oathRank('crowns');
 return Math.max(1,Math.min(8e15,Math.round(q.bossBase*weight*iron*crowns)));
}
function applyEndlessEntityDifficulty(e,preserveHealth=false){
 if(!e||e.dead||!G.run?.infinite||G.floor<=50)return e;const q=endlessDifficulty(),ratio=preserveHealth?clamp(e.hp/Math.max(1,e.max),0,1):1,mutation=endlessMutation(G.floor).key,iron=mutation==='iron'?1.18:1,motion=Math.pow(1.1,oathRank('motion'));
 if(e.lateBoss){const cfg=LATE_BOSSES[e.type],target=endlessBossTarget(e);e.max=target;e.hp=Math.max(1,Math.round(target*ratio));e.dmg=Math.max(1,Math.round((ENDGAME_DAMAGE[e.bossKey]||e.dmg)*q.enemyDmg));if(cfg)e.spd=cfg.spd*q.speed*motion;e.endlessDamageCeiling=.035;}
 else{const c=LATE_ENEMIES[e.type]||ETYPES[e.type],mapped=authoredDepth(),d=Math.max(0,mapped-11);if(c){const elite=e.elite?1.7:1,target=Math.max(1,Math.min(8e15,Math.round(c.hp*depthHealth(mapped)*elite*q.enemyHp*iron)));e.max=target;e.hp=Math.max(1,Math.round(target*ratio));e.dmg=Math.max(1,Math.min(1e12,Math.round(c.dmg*(1+d*.029)*q.enemyDmg)));e.spd=c.spd*(1+Math.min(.25,d*.006))*q.speed*(mutation==='relentless'?1.08:1)*motion*(e.specialQuarry?1.08:1);}}
 e.endlessScaled=true;e.endlessDifficultyVersion=ENDLESS_DIFFICULTY_VERSION;return e;
}
function scaleEndlessMechanism(e){
 if(!e||!G.run?.infinite||G.floor<=50||e.endlessMechanismVersion===ENDLESS_DIFFICULTY_VERSION)return e;const ratio=clamp(e.hp/Math.max(1,e.max),0,1),target=Math.max(1,Math.round(e.max*endlessDifficulty().mechanism));e.max=target;e.hp=Math.max(1,Math.round(target*ratio));e.endlessMechanismVersion=ENDLESS_DIFFICULTY_VERSION;return e;
}
function reinforceEndlessFloor(){
 const q=endlessDifficulty(),w=G.world;if(!w||q.depth<1)return;const blocked=new Set([0,w.rooms.indexOf(w.exit),w.storyRoom,...(w.echoSanctuaries||[]),...(w.specialEncounters||[]).map(sc=>sc.roomIndex)]),rooms=w.rooms.map((r,i)=>({r,i})).filter(o=>!blocked.has(o.i));if(!rooms.length)return;const current=G.enemies.filter(e=>!e.dead&&!e.isBoss&&!e.mechanism).length,add=Math.max(0,Math.min(q.reinforcements,46-current)),region=lateRegion(G.floor),ri=Math.max(0,LATE_REGIONS.indexOf(region)),roster=[...(LATE_ROSTERS[region.key]||[]),...(LATE_ROSTERS[LATE_REGIONS[(ri+1)%LATE_REGIONS.length].key]||[])];
 for(let i=0;i<add;i++){const r=rooms[(i*5+q.threat)%rooms.length].r,type=roster[(i*3+q.depth)%roster.length],rad=ETYPES[type]?.r||12,pos=safePosition(w,rand((r.x+1.2)*TILE,(r.x+r.w-1.2)*TILE),rand((r.y+1.2)*TILE,(r.y+r.h-1.2)*TILE),rad);if(!pos||d2(pos.x,pos.y,G.player.x,G.player.y)<260**2)continue;const e=spawnEnemy(type,pos.x,pos.y,q.depth>=18&&i===add-1);e.aggro=false;}
}

const ascensionSpawnEnemy=spawnEnemy;
spawnEnemy=function(type,x,y,elite){const e=ascensionSpawnEnemy(type,x,y,elite);if(G.run?.infinite&&G.floor>50&&ETYPES[type])applyEndlessEntityDifficulty(e,false);return e;};
const ascensionSetupFloor=setupFloor;
setupFloor=function(f){const out=ascensionSetupFloor(f);if(!G.run?.infinite||f<=50||!G.world)return out;G.enemies=G.enemies.filter(e=>!e.dead);for(const e of G.enemies)applyEndlessEntityDifficulty(e,false);reinforceEndlessFloor();G.world.endlessDifficultyVersion=ENDLESS_DIFFICULTY_VERSION;G.world.endlessThreat=endlessDifficulty(f).threat;G.world.endlessPressure=G.world.endlessPressure&&Number.isFinite(G.world.endlessPressure.t)?G.world.endlessPressure:{t:5.5,step:0};updateHUD(0);saveNow();return out;};

const ascensionMidPiece=placeMidGuardianPiece;
placeMidGuardianPiece=function(b,kind,slot,count,radius,hp){const e=ascensionMidPiece(b,kind,slot,count,radius,G.run?.infinite&&G.floor>50?Math.round(hp*endlessDifficulty().mechanism):hp);if(e)e.endlessMechanismVersion=ENDLESS_DIFFICULTY_VERSION;return e;};
const ascensionPlaceMechanisms=placeMechanisms;
placeMechanisms=function(b,kind,count){const before=new Set(G.enemies);const out=ascensionPlaceMechanisms(b,kind,count);if(G.run?.infinite&&G.floor>50)for(const e of G.enemies)if(!before.has(e)&&e.mechanism)scaleEndlessMechanism(e);return out;};
const ascensionMidState=midGuardianState;
midGuardianState=function(b){const ratio=clamp(b.hp/Math.max(1,b.max),0,1),m=ascensionMidState(b);if(G.run?.infinite&&G.floor>50){const target=endlessBossTarget(b);if(b.max!==target){b.max=target;b.hp=Math.max(1,Math.round(target*ratio));b.dmg=Math.max(1,Math.round((ENDGAME_DAMAGE[b.bossKey]||b.dmg)*endlessDifficulty().enemyDmg));b.endlessDamageCeiling=.035;}b.endlessDifficultyVersion=ENDLESS_DIFFICULTY_VERSION;}return m;};

const ascensionDamageEnemy=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){if(e?.bossKey==='bellkeeper'&&(e.bs?.mode==='submerge'||e.bs?.mid?.invulnerable))return;return ascensionDamageEnemy(e,dmg,ang,crit,kb,kind);};
const ascensionLateEnemyAI=lateEnemyAI;
lateEnemyAI=function(e,dt,d,dx,dy){return ascensionLateEnemyAI(e,G.run?.infinite&&G.floor>50?dt*endlessDifficulty().haste:dt,Math.max(1,d),dx,dy);};
const ascensionLateBossAI=lateBossAI;
lateBossAI=function(b,dt,d,dx,dy){return ascensionLateBossAI(b,G.run?.infinite&&G.floor>50?dt*endlessDifficulty().haste:dt,Math.max(1,d),dx,dy);};
const ascensionEnemyShoot=enemyShoot;
enemyShoot=function(e,ang,spd,dmg){if(G.run?.infinite&&G.floor>50)spd*=endlessDifficulty().projectile;return ascensionEnemyShoot(e,ang,spd,dmg);};
const ascensionLateShot=lateShot;
lateShot=function(e,ang,spd,dmg,col){if(G.run?.infinite&&G.floor>50)spd*=endlessDifficulty().projectile;return ascensionLateShot(e,ang,spd,dmg,col);};

function fireEndlessPressure(){
 const b=G.boss,p=G.player,w=G.world;if(!b?.introduced||!b.lateBoss||!p||!w?.lateHazards)return;const q=endlessDifficulty(),s=w.endlessPressure,a=arenaBounds(),lead=Math.min(.55,.22+q.depth*.0035),tx=clamp(p.x+(p.vigilVX||0)*lead,a.left+38,a.right-38),ty=clamp(p.y+(p.vigilVY||0)*lead,a.top+38,a.bottom-38),laws=q.depth<10?1:q.depth<25?2:3,law=s.step++%laws;
 if(law===0){const n=q.depth>=50?5:q.depth>=20?4:3;for(let i=0;i<n;i++){const turn=(i-(n-1)/2)*.64,r=22+i*21;encounterHazard(b,'shell',clamp(tx+Math.cos(turn)*r,a.left+34,a.right-34),clamp(ty+Math.sin(turn)*r,a.top+34,a.bottom-34),0,{delay:.52+i*.12,life:.34,radius:30+Math.min(10,q.threat),damageMul:.48});}}
 else if(law===1){encounterHazard(b,'annulus',a.cx,a.cy,0,{delay:.62,life:1.75,radius:20,expand:145+q.threat*5,width:11,damageMul:.52});for(let i=0;i<10+Math.min(8,q.threat);i++){const ang=i*TAU/(10+Math.min(8,q.threat));if(Math.abs(angleDiff(ang,Math.atan2(p.y-a.cy,p.x-a.cx)))<.34)continue;lateShot(b,ang,205+q.threat*5,b.dmg*.42,b.col);}}
 else{encounterHazard(b,'rotor',a.cx,a.cy,-Math.PI/2,{delay:.72,life:3.65,len:Math.hypot(a.right-a.left,a.bottom-a.top),turn:(s.step%2?1:-1)*(.68+Math.min(.34,q.depth*.004)),arms:q.depth>=70?3:2,width:8,damageMul:.55});}
 if(!G.run.endlessPressureSeen){G.run.endlessPressureSeen=true;fieldNote('The depth has learned your route.',2.8);}s.t=Math.max(4.2,8.2-q.depth*.035);
}
function tickEndlessPressure(dt){if(!G.run?.infinite||G.floor<=50||G.state!=='playing'||!G.bossActive||!G.boss?.introduced)return;const s=G.world.endlessPressure||(G.world.endlessPressure={t:5.5,step:0});s.t-=dt;if(s.t<=0)fireEndlessPressure();}
const ascensionBeforeUpdate=hollowBeforeUpdate;
hollowBeforeUpdate=function(dt){const stopped=ascensionBeforeUpdate(dt);if(!stopped)tickEndlessPressure(dt);return stopped;};

const ascensionUseFlame=useRestingFlame;
useRestingFlame=function(o){if(!G.run?.infinite||o.lit){ascensionUseFlame(o);return;}o.lit=true;const q=endlessDifficulty(),base=bossFloorAt(G.floor)?.28:.22,fatigue=Math.max(.36,1/(1+q.depth*.016)),penalty=Math.pow(.65,oathRank('ash'))*(endlessMutation(G.floor).key==='famine'?.55:1),heal=Math.max(1,Math.ceil(G.player.maxHp*base*fatigue*penalty));cardHeal(heal,'RESTING FLAME · '+heal+' HEALTH');G.world.torches.push({x:o.x,y:o.y-15,s:0});burst(o.x,o.y,24,'#ffd083',145,1,3,true);sfx('brazier');saveNow();};

const ascensionChooseCard=chooseCard;
chooseCard=function(i){
 const o=G.state==='levelup'&&G.cardPool?.[i];if(!o?.consumable)return ascensionChooseCard(i);cardHeal(Math.max(25,Math.ceil(G.player.maxHp*.15)),'EMBERGLOW');sfx('buy');G.pendingLevels=Math.max(0,G.pendingLevels-1);G.cardPool=null;if(G.pendingLevels>0)triggerLevelup();else{hide('levelup');setState('playing');G.player.hitCd=Math.max(G.player.hitCd,.8);nova(G.player.x,G.player.y,150,30);}saveNow();
};

const ascensionHUD=updateHUD;
updateHUD=function(dt){ascensionHUD(dt);if(!G.run?.infinite||G.floor<=50)return;const q=endlessDifficulty(),m=endlessMutation(G.floor),oaths=Object.values(G.run.endlessOaths||{}).reduce((a,b)=>a+b,0);setTxt('floorObjective','ENDLESS '+q.depth+' · THREAT '+q.threat+' · '+m.name+(oaths?' · '+oaths+' OATH'+(oaths===1?'':'S'):''));};
const ascensionSnapshot=snapshotRun;
snapshotRun=function(){ascensionSnapshot();if(save.resume&&G.run?.infinite&&G.world){save.resume.world.endlessDifficultyVersion=ENDLESS_DIFFICULTY_VERSION;save.resume.world.endlessThreat=G.world.endlessThreat||endlessDifficulty().threat;save.resume.world.endlessPressure=deepCopy(G.world.endlessPressure||{t:5.5,step:0});}};
const ascensionValidateCheckpoint=validateCheckpoint;
validateCheckpoint=function(r){const out=ascensionValidateCheckpoint(r);if(!r?.run?.infinite)return out;const fail=()=>{throw Error('Invalid Endless data');},o=r.run.endlessOaths,c=r.run.endlessOathChosen,p=r.world?.endlessPressure;if(o!==undefined&&(typeof o!=='object'||Array.isArray(o)))fail();if(o)for(const [id,n]of Object.entries(o))if(!ENDLESS_OATHS.some(q=>q.id===id)||!Number.isInteger(n)||n<0||n>100000)fail();if(c!==undefined&&(!Array.isArray(c)||c.length>100000||c.some(n=>!Number.isInteger(n)||n<51||n>1000000)))fail();if(r.run.endlessOathPending!==undefined&&(!Number.isInteger(r.run.endlessOathPending)||r.run.endlessOathPending<0||r.run.endlessOathPending>1000000))fail();if(r.run.endlessStacks!==undefined&&(!Number.isInteger(r.run.endlessStacks)||r.run.endlessStacks<0||r.run.endlessStacks>1000000))fail();if(p!==undefined&&(!p||!Number.isFinite(p.t)||!Number.isInteger(p.step)||Math.abs(p.t)>100000||p.step<0||p.step>1000000))fail();return out;};
const ascensionResume=resumeRun;
resumeRun=function(){ascensionResume();if(!G.run?.infinite||G.floor<=50||!G.world)return;G.run.endlessOaths=G.run.endlessOaths||{};G.run.endlessOathChosen=G.run.endlessOathChosen||[];for(const e of G.enemies){if(e.mechanism){if(e.endlessMechanismVersion!==ENDLESS_DIFFICULTY_VERSION)scaleEndlessMechanism(e);}else if(e.endlessDifficultyVersion!==ENDLESS_DIFFICULTY_VERSION)applyEndlessEntityDifficulty(e,true);}G.world.endlessDifficultyVersion=ENDLESS_DIFFICULTY_VERSION;G.world.endlessThreat=endlessDifficulty().threat;G.world.endlessPressure=G.world.endlessPressure&&Number.isFinite(G.world.endlessPressure.t)?G.world.endlessPressure:{t:5.5,step:0};updateHUD(0);saveNow();};

const ascensionBlocking=anyBlockingOverlay;
anyBlockingOverlay=function(){return !!T('endlessOath')?.classList.contains('open')||ascensionBlocking();};
const ascensionEsc=onEscKey;
onEscKey=function(){if(T('endlessOath')?.classList.contains('open')){T('oathGrid')?.firstChild?.focus({preventScroll:true});return;}return ascensionEsc();};
