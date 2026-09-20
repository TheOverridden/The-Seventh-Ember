const ROOM_ENCOUNTER_VERSION=2;
document.documentElement.dataset.roomEncounters='v2';
const ROOM_ENCOUNTER_INFO={
 ambush:{name:'THE ROOM WAKES',hint:'Watch the walls. Clear each side as it opens.'},
 holdout:{name:'THE SLOW SEAL',hint:'Stand in the seal to close it faster.'},
 flameguard:{name:'KEEP THE FLAME',hint:'Stay near the flame. Drive back anything that reaches it.'},
 hunt:{name:'MARKED PREY',hint:'Corner it when the gold mark breaks.'},
 summoner:{name:'THE CALLER',hint:'Its shield thins when its summons fall.'},
 cache:{name:'THE SEALED CACHE',hint:'Break the locking waves. Take what the room kept.'}
};
function roomHasPoint(r,x,y,pad=0){return !!r&&x>=(r.x*TILE+pad)&&x<=((r.x+r.w)*TILE-pad)&&y>=(r.y*TILE+pad)&&y<=((r.y+r.h)*TILE-pad);}
function specialEncounterRoom(sc){return G.world?.rooms?.[sc?.roomIndex]||null;}
function specialEncounterAt(x=G.player?.x,y=G.player?.y){return G.world?.specialEncounters?.find(sc=>roomHasPoint(specialEncounterRoom(sc),x,y,5))||null;}
function specialEncounterById(id){return G.world?.specialEncounters?.find(sc=>sc.id===id)||null;}
function specialEncounterEnemies(sc){return (G.enemies||[]).filter(e=>!e.dead&&!e.isBoss&&!e.mechanism&&e.specialEncounterId===sc.id);}
function specialEncounterColor(){const w=G.world;if(w?.region==='late')return lateDecorColor(w.lateKey);if(G.floor<=5)return'#8fa9c4';if(G.floor<=10)return'#91ad78';return'#c39ae2';}
function specialEncounterRoster(){
 const w=G.world;if(w?.region==='late')return (LATE_ROSTERS[w.lateKey]||[]).filter(id=>ETYPES[id]);
 if(G.floor<=5)return (G.floor<3?['gateSentry','gateHound']:['gateSentry','gateHound','gateLantern','gateShield']).filter(id=>ETYPES[id]);
 if(G.floor<=10)return gardenRoster(G.floor).filter(id=>ETYPES[id]);
 return['slime','bat','spitter','brute','splitter','wisp'].filter(id=>ETYPES[id]);
}
function specialSpawnPoint(sc,radius=12){const r=specialEncounterRoom(sc);if(!r)return null;for(let i=0;i<24;i++){const x=rand((r.x+1.25)*TILE,(r.x+r.w-1.25)*TILE),y=rand((r.y+1.25)*TILE,(r.y+r.h-1.25)*TILE),p=safePosition(G.world,x,y,radius);if(p&&(!G.player||d2(p.x,p.y,G.player.x,G.player.y)>72**2)&&G.enemies.every(e=>e.dead||d2(p.x,p.y,e.x,e.y)>(e.r+radius+12)**2))return p;}return safePosition(G.world,r.cx*TILE+18,r.cy*TILE+18,radius);}
function spawnSpecialWave(sc,count,awake=true){
 const roster=specialEncounterRoster();let made=0;if(!roster.length)return made;for(let i=0;i<count&&G.enemies.filter(e=>!e.dead&&!e.isBoss).length<36;i++){const type=roster[(sc.seed+i+sc.waveIndex)%roster.length],rad=ETYPES[type]?.r||12;let pos=null;if(sc.nodes?.length){const node=sc.nodes[(sc.waveIndex+i)%sc.nodes.length];pos=safePosition(G.world,node.x,node.y,rad);if(pos&&G.player&&d2(pos.x,pos.y,G.player.x,G.player.y)<68**2)pos=null;}pos=pos||specialSpawnPoint(sc,rad);if(!pos)continue;const elite=G.floor>20&&sc.type!=='holdout'&&i===count-1&&((sc.waveIndex+sc.seed)%4===0),e=spawnEnemy(type,pos.x,pos.y,elite);e.specialEncounterId=sc.id;e.encounterRole=sc.type;e.aggro=awake;e.atkT=Math.max(e.atkT||0,.6);burst(pos.x,pos.y,9,specialEncounterColor(),110,.42,2,true);made++;}sc.waveIndex++;return made;
}
function markSpecialRoomEnemies(sc){const r=specialEncounterRoom(sc);for(const e of G.enemies)if(!e.dead&&!e.isBoss&&!e.growth&&!e.mechanism&&roomHasPoint(r,e.x,e.y))e.specialEncounterId=sc.id;if(!specialEncounterEnemies(sc).length)spawnSpecialWave(sc,G.floor<=3?1:2,false);}
function configureSpecialEncounter(sc){
 const r=specialEncounterRoom(sc);if(!r)return;sc.x=r.cx*TILE+18;sc.y=r.cy*TILE+18;sc.state=sc.state||'waiting';sc.waveIndex=sc.waveIndex||0;sc.waveDelay=sc.waveDelay??.7;sc.spawnT=sc.spawnT??2.8;sc.rewarded=!!sc.rewarded;sc.encounterVersion=ROOM_ENCOUNTER_VERSION;
 if(!Array.isArray(sc.nodes)||sc.nodes.length!==4){const left=(r.x+1.45)*TILE,right=(r.x+r.w-1.45)*TILE,top=(r.y+1.45)*TILE,bottom=(r.y+r.h-1.45)*TILE;sc.nodes=[{x:left,y:top},{x:right,y:top},{x:right,y:bottom},{x:left,y:bottom}];}
 markSpecialRoomEnemies(sc);
 if(sc.type==='ambush')sc.wavesRemaining=sc.wavesRemaining??(G.floor<=10?1:2);
 if(sc.type==='holdout'){sc.timer=sc.timer??(G.floor<=10?8:11);sc.duration=sc.duration||sc.timer;sc.centered=!!sc.centered;}
 if(sc.type==='flameguard'){sc.flame=sc.flame??100;sc.wavesRemaining=sc.wavesRemaining??(G.floor<=10?0:1);sc.flareT=sc.flareT??4.5;}
 if(sc.type==='cache'){sc.wavesRemaining=sc.wavesRemaining??(G.floor<=10?1:2);G.chests=G.chests.filter(c=>!roomHasPoint(r,c.x,c.y));}
 if(sc.type==='hunt'){
  let q=specialEncounterEnemies(sc).sort((a,b)=>b.max-a.max)[0];if(!q){spawnSpecialWave(sc,1,false);q=specialEncounterEnemies(sc)[0];}
  if(q&&!q.specialQuarry){q.specialQuarry=true;q.elite=true;q.max*=G.floor<=10?1.35:1.7;q.hp=q.max;q.spd*=1.08;sc.targetUid=q.uid;}sc.huntShiftT=sc.huntShiftT??2.4;sc.huntNode=sc.huntNode??0;
 }
 if(sc.type==='summoner'){
  let q=specialEncounterEnemies(sc).sort((a,b)=>b.max-a.max)[0];if(!q){spawnSpecialWave(sc,1,false);q=specialEncounterEnemies(sc)[0];}
  if(q&&!q.specialSummoner){q.specialSummoner=true;q.elite=true;q.max*=G.floor<=10?1.45:1.9;q.hp=q.max;sc.targetUid=q.uid;}
 }
 if(!G.world.torches.some(o=>o.encounter===sc.id))G.world.torches.push({x:sc.x,y:sc.y-8,s:sc.seed*.73,encounter:sc.id});
}
function specialEncounterTypes(f){if(f<=2)return['ambush'];if(f<=5)return['ambush','hunt','flameguard','cache'];return Object.keys(ROOM_ENCOUNTER_INFO);}
function installSpecialEncounters(){
 const w=G.world;if(!w||!G.run)return;if(Array.isArray(w.specialEncounters)){for(const sc of w.specialEncounters){if(!sc.complete)configureSpecialEncounter(sc);if(sc.active&&!sc.complete)sealSpecialEncounter(sc,true);}w.specialEncounterVersion=ROOM_ENCOUNTER_VERSION;return;}
 if(typeof planSecretRoom==='function')planSecretRoom(w,G.floor);
 const exitIndex=w.rooms.indexOf(w.exit),blocked=new Set([0,exitIndex,w.storyRoom,w.secretRoom?.roomIndex,...(w.echoSanctuaries||[])]),allCandidates=w.rooms.map((r,i)=>({r,i,has:G.enemies.some(e=>!e.dead&&!e.isBoss&&roomHasPoint(r,e.x,e.y)),roll:Math.random()})).filter(o=>!blocked.has(o.i));
 const earlyPlan=G.floor<=5&&typeof planEarlyEncounters==='function'?planEarlyEncounters(w,G.floor):null,deepCandidates=earlyPlan?allCandidates.filter(o=>(earlyPlan[o.i]?.rank??99)>=2):allCandidates;
 const candidates=(deepCandidates.length?deepCandidates:allCandidates).sort((a,b)=>(b.has-a.has)||(a.roll-b.roll));
 const roomBudget=G.floor===1?0:G.floor<=5||bossFloorAt(G.floor)||G.floor%3===0?1:2,count=Math.min(candidates.length,Math.max(0,roomBudget-(w.secretRoom?1:0))),types=specialEncounterTypes(G.floor),used=new Set();w.specialEncounters=[];w.specialEncounterVersion=ROOM_ENCOUNTER_VERSION;
 for(let i=0;i<count;i++){let type=types[(G.floor+i*3+Math.floor(candidates[i].roll*types.length))%types.length];while(used.has(type)&&used.size<types.length)type=types[(types.indexOf(type)+1)%types.length];used.add(type);const sc={id:'room-'+G.floor+'-'+candidates[i].i,type,roomIndex:candidates[i].i,seed:(G.floor*17+candidates[i].i*11+i*7)%97,active:false,entered:false,complete:false,failed:false,sealTiles:[]};w.specialEncounters.push(sc);configureSpecialEncounter(sc);}
}
function sealSpecialEncounter(sc,on){
 const w=G.world,r=specialEncounterRoom(sc);if(!w||!r)return;if(on&&(!sc.sealTiles||!sc.sealTiles.length)){sc.sealTiles=[];const seen=new Set(),add=(tx,ty)=>{if(tx<1||ty<1||tx>=w.W-1||ty>=w.H-1)return;const i=ty*w.W+tx;if(!seen.has(i)&&w.grid[i]===1){seen.add(i);sc.sealTiles.push({i,v:1});w.grid[i]=2;}};for(let x=r.x;x<r.x+r.w;x++){add(x,r.y-1);add(x,r.y+r.h);}for(let y=r.y;y<r.y+r.h;y++){add(r.x-1,y);add(r.x+r.w,y);}}
 else if(!on&&sc.sealTiles){for(const p of sc.sealTiles)w.grid[p.i]=p.v;sc.sealTiles=[];}w.mmDirty=true;
}
function activateSpecialEncounter(sc){if(!sc||sc.entered||sc.complete)return;sc.entered=sc.active=true;sc.state='active';sealSpecialEncounter(sc,true);for(const e of specialEncounterEnemies(sc))e.aggro=true;const info=ROOM_ENCOUNTER_INFO[sc.type];toast(info.name,info.hint);fieldNote(info.hint,3.6);burst(sc.x,sc.y,18,specialEncounterColor(),150,.6,2.4,true);sfx('roomSeal');saveNow();}
function completeSpecialEncounter(sc,success=true){
 if(sc.complete)return;sc.active=false;sc.complete=true;sc.state=success?'cleared':'dimmed';sc.failed=!success;sealSpecialEncounter(sc,false);if(!sc.rewarded){sc.rewarded=true;const mul=sc.type==='hunt'||sc.type==='summoner'?1.25:sc.type==='cache'?.75:1,ess=Math.max(3,Math.round((4+G.floor*.45)*mul*(success?1:.45)));addEss(ess);for(let i=0;i<(success?2:1);i++)spawnPick('xp',sc.x+rand(-16,16),sc.y+rand(-12,12),Math.max(2,Math.round(2+G.floor*.12)));addText(sc.x,sc.y-30,'+'+ess+' ROOM ESSENCE','#d9b9ff',13);G.run.specialRoomsCleared=(G.run.specialRoomsCleared||0)+1;}
 if(sc.type==='cache'&&!G.chests.some(c=>c.specialCache===sc.id)){const pos=safePosition(G.world,sc.x,sc.y,17)||{x:sc.x,y:sc.y};G.chests.push({...pos,opened:false,specialCache:sc.id});}
 toast(success?'ROOM CLEARED':'THE FLAME WENT QUIET',success?(sc.type==='cache'?'the cache opens':'the seal releases'):'the seal releases anyway');burst(sc.x,sc.y,24,success?'#e5cc88':'#8b8fa6',180,.7,2.8,true);sfx('roomClear');saveNow();
}
function tickSpecialEncounter(sc,dt){
 if(sc.complete)return;if(sc.encounterVersion!==ROOM_ENCOUNTER_VERSION)configureSpecialEncounter(sc);if(!sc.entered&&roomHasPoint(specialEncounterRoom(sc),G.player.x,G.player.y,7))activateSpecialEncounter(sc);if(!sc.active)return;const living=specialEncounterEnemies(sc);
 if(sc.type==='ambush'||sc.type==='cache'){
  if(!living.length){sc.waveDelay-=dt;if(sc.wavesRemaining>0&&sc.waveDelay<=0){const n=G.floor<=3?1:G.floor<=10?2:Math.min(4,2+Math.floor(G.floor/25));spawnSpecialWave(sc,n,true);sc.wavesRemaining--;sc.waveDelay=.8;sfx('roomWave');saveNow();}else if(sc.wavesRemaining<=0)completeSpecialEncounter(sc,true);}
 }else if(sc.type==='holdout'){
  const centered=d2(G.player.x,G.player.y,sc.x,sc.y)<72**2;sc.centered=centered;sc.timer-=dt*(centered?1.35:.62);sc.spawnT-=dt;if(sc.timer>0&&sc.spawnT<=0&&living.length<(G.floor<=10?4:7)){spawnSpecialWave(sc,G.floor<=10?1:2,true);sc.spawnT=G.floor<=10?3.2:2.65;sfx('roomWave');}if(sc.timer<=0)completeSpecialEncounter(sc,true);
 }else if(sc.type==='flameguard'){
  let pressure=0;for(const e of living){const dx=sc.x-e.x,dy=sc.y-e.y,d=Math.max(1,Math.hypot(dx,dy));if(d<60+e.r)pressure+=1;else moveEnt(G.world,e,dx/d*e.spd*dt*.32,dy/d*e.spd*dt*.32);}const tending=d2(G.player.x,G.player.y,sc.x,sc.y)<62**2;if(pressure)sc.flame=Math.max(0,sc.flame-dt*pressure*(G.floor<=10?5:7));else if(tending)sc.flame=Math.min(100,sc.flame+dt*2.4);if(sc.flame<=0){completeSpecialEncounter(sc,false);return;}sc.flareT-=dt;if(tending&&sc.flareT<=0){sc.flareT=4.5;for(const e of living)if(d2(e.x,e.y,sc.x,sc.y)<92**2)damageEnemy(e,Math.max(4,G.player.dmg*.22),Math.atan2(e.y-sc.y,e.x-sc.x),false,1.2,'roomFlame');burst(sc.x,sc.y,18,'#ffd58d',150,.45,2,true);sfx('roomWave');}if(!living.length){if(sc.wavesRemaining>0){spawnSpecialWave(sc,G.floor<=10?1:2,true);sc.wavesRemaining--;}else completeSpecialEncounter(sc,true);}
 }else if(sc.type==='hunt'){
  const q=G.enemies.find(e=>!e.dead&&e.uid===sc.targetUid);if(!q)completeSpecialEncounter(sc,true);else{sc.huntShiftT-=dt;q.quarryExposedT=Math.max(0,(q.quarryExposedT||0)-dt);if(sc.huntShiftT<=0){sc.huntShiftT=2.6;let best=0,bestD=-1;for(let i=0;i<sc.nodes.length;i++){const n=sc.nodes[i],score=d2(n.x,n.y,G.player.x,G.player.y);if(score>bestD){bestD=score;best=i;}}sc.huntNode=best;q.quarryExposedT=.72;burst(q.x,q.y,10,'#ffd67c',100,.35,2,true);}const n=sc.nodes[sc.huntNode%sc.nodes.length],dx=n.x-q.x,dy=n.y-q.y,d=Math.max(1,Math.hypot(dx,dy));if(q.quarryExposedT<=0)moveEnt(G.world,q,dx/d*q.spd*dt*.62,dy/d*q.spd*dt*.62);q.aggro=true;}
 }else if(sc.type==='summoner'){
  const q=G.enemies.find(e=>!e.dead&&e.uid===sc.targetUid);if(!q)completeSpecialEncounter(sc,true);else{const summons=living.filter(e=>e!==q);q.summonerShield=summons.length>0;sc.spawnT-=dt;if(sc.spawnT<=0&&living.length<(G.floor<=10?5:8)){spawnSpecialWave(sc,G.floor<=10?1:2,true);sc.spawnT=G.floor<=10?4.2:3.2;sfx('roomWave');}q.aggro=true;}
 }
}
function tickSpecialEncounters(dt){if(!G.world?.specialEncounters||!G.player)return;for(const sc of G.world.specialEncounters)tickSpecialEncounter(sc,dt);}
function specialEncounterObjective(sc){const n=specialEncounterEnemies(sc).length;if(sc.complete)return sc.failed?'THE FLAME WENT QUIET · ROOM OPEN':'ROOM CLEARED';if(sc.type==='ambush')return'THE ROOM WAKES · '+n+' REMAIN'+(sc.wavesRemaining?' · '+sc.wavesRemaining+' WAVE'+(sc.wavesRemaining===1?'':'S'):'');if(sc.type==='holdout')return'THE SLOW SEAL · '+Math.max(0,Math.ceil(sc.timer))+' SECONDS · '+(sc.centered?'SEAL QUICKENED':'RETURN TO THE CENTER');if(sc.type==='flameguard')return'KEEP THE FLAME · '+Math.ceil(sc.flame)+'% · '+n+' PRESSING IN';if(sc.type==='hunt')return'MARKED PREY · '+((G.enemies.find(e=>e.uid===sc.targetUid)?.quarryExposedT||0)>0?'STRIKE NOW':'CUT OFF ITS ESCAPE');if(sc.type==='summoner')return'THE CALLER · '+Math.max(0,n-1)+' SUMMONED · '+(n>1?'SHIELDED':'EXPOSED');return'THE SEALED CACHE · '+n+' REMAIN'+(sc.wavesRemaining?' · '+sc.wavesRemaining+' WAVE'+(sc.wavesRemaining===1?'':'S'):'');}
function drawSpecialEncounterIcon(ctx,sc,t,c){
 ctx.save();ctx.translate(sc.x,sc.y);ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=2;const pulse=1+Math.sin(t*2.4+sc.seed)*.06;ctx.scale(pulse,pulse);
 if(sc.type==='ambush'){for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*TAU/4+t*.08);ctx.beginPath();ctx.moveTo(25,-7);ctx.lineTo(16,0);ctx.lineTo(25,7);ctx.stroke();ctx.restore();}}
 else if(sc.type==='holdout'){ctx.beginPath();ctx.arc(0,0,22,-Math.PI/2,-Math.PI/2+TAU*clamp(sc.timer/(sc.duration||1),0,1));ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(t*.5)*14,Math.sin(t*.5)*14);ctx.stroke();}
 else if(sc.type==='flameguard'){ctx.fillRect(-5,0,10,15);ctx.fillStyle='#fff1bf';ctx.fillRect(-3,-8,6,14);ctx.fillStyle='#fff';ctx.fillRect(-1,-6,2,6);ctx.strokeStyle=sc.flame>25?c:'#dc7181';ctx.beginPath();ctx.arc(0,3,27,-Math.PI/2,-Math.PI/2+TAU*clamp(sc.flame/100,0,1));ctx.stroke();}
 else if(sc.type==='hunt'){ctx.rotate(Math.PI/4);ctx.strokeRect(-15,-15,30,30);ctx.rotate(-Math.PI/4);ctx.beginPath();ctx.moveTo(-26,0);ctx.lineTo(26,0);ctx.moveTo(0,-26);ctx.lineTo(0,26);ctx.stroke();}
 else if(sc.type==='summoner'){for(let i=0;i<3;i++){ctx.globalAlpha=.75-i*.18;ctx.beginPath();ctx.arc(0,0,9+i*9,(t*.45+i*.7)%TAU,(t*.45+i*.7)%TAU+4.7);ctx.stroke();}ctx.fillRect(-4,-4,8,8);}
 else{ctx.strokeRect(-21,-14,42,28);ctx.fillRect(-3,-14,6,28);ctx.strokeRect(-13,-6,26,12);}
 ctx.restore();
}
function drawSpecialEncounters(ctx){
 const list=G.world?.specialEncounters;if(!list)return;const t=save.motion?2:G.tAll,c=specialEncounterColor();ctx.save();ctx.globalCompositeOperation='lighter';for(const sc of list){const r=specialEncounterRoom(sc);if(!r)continue;ctx.globalAlpha=sc.complete?.12:sc.active?.62:.22;ctx.strokeStyle=c;ctx.lineWidth=sc.active?2:1;ctx.setLineDash(sc.active?[7,10]:[2,12]);ctx.lineDashOffset=-t*18;ctx.strokeRect(r.x*TILE+8,r.y*TILE+8,r.w*TILE-16,r.h*TILE-16);ctx.setLineDash([]);for(let i=0;i<(sc.nodes?.length||0);i++){const n=sc.nodes[i],lit=sc.active&&((sc.type==='hunt'&&i===sc.huntNode)||(sc.type==='ambush'&&i===sc.waveIndex%4));ctx.globalAlpha=sc.complete?.08:lit?.75:.2;ctx.strokeStyle=lit?'#fff0b7':c;ctx.lineWidth=2;ctx.save();ctx.translate(n.x,n.y);ctx.rotate(Math.PI/4+t*.08*(i%2?1:-1));ctx.strokeRect(-7,-7,14,14);ctx.fillStyle=ctx.strokeStyle;ctx.fillRect(-2,-2,4,4);ctx.restore();}drawSpecialEncounterIcon(ctx,sc,t,c);if(sc.active&&sc.type==='holdout'){ctx.globalAlpha=sc.centered?.48:.24;ctx.strokeStyle=sc.centered?'#fff0bd':c;ctx.lineWidth=3;ctx.beginPath();ctx.arc(sc.x,sc.y,70,-Math.PI/2,-Math.PI/2+TAU*clamp(1-sc.timer/(sc.duration||1),0,1));ctx.stroke();}if(sc.active&&sc.sealTiles)for(const p of sc.sealTiles){const tx=p.i%G.world.W,ty=Math.floor(p.i/G.world.W);ctx.fillStyle=c;ctx.globalAlpha=.35+.2*Math.sin(t*6+p.i);ctx.fillRect(tx*TILE+5,ty*TILE+13,TILE-10,8);ctx.fillStyle='#fff4cf';ctx.globalAlpha=.55;ctx.fillRect(tx*TILE+9,ty*TILE+16,TILE-18,2);}}
 for(const e of G.enemies){if(e.dead||(!e.specialQuarry&&!e.specialSummoner))continue;const exposed=e.specialQuarry&&e.quarryExposedT>0;ctx.globalAlpha=exposed?.95:.7;ctx.strokeStyle=exposed?'#fff3c1':e.specialQuarry?'#ffd67c':e.summonerShield?'#d7a4ef':'#eee1ff';ctx.lineWidth=exposed?3:2;ctx.beginPath();ctx.arc(e.x,e.y,e.r+11,t*(e.specialQuarry?-.8:.55),t*(e.specialQuarry?-.8:.55)+4.7);ctx.stroke();for(let i=0;i<4;i++){const a=i*TAU/4+t*.25;ctx.fillStyle=ctx.strokeStyle;ctx.fillRect(e.x+Math.cos(a)*(e.r+15)-2,e.y+Math.sin(a)*(e.r+15)-2,4,4);}}ctx.restore();
}

const specialEncounterDamageEnemy=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
 if(e?.specialSummoner&&e.summonerShield)dmg*=.32;
 if(e?.specialQuarry)dmg*=e.quarryExposedT>0?1.35:.72;
 return specialEncounterDamageEnemy(e,dmg,ang,crit,kb,kind);
};

const specialCanWakeEnemy=canWakeEnemy;
canWakeEnemy=function(e){const sc=e.specialEncounterId&&specialEncounterById(e.specialEncounterId);if(sc&&!sc.active&&!sc.complete)return false;return specialCanWakeEnemy(e);};
const specialSetupFloor=setupFloor;
setupFloor=function(f){const out=specialSetupFloor(f);if(G.run&&G.world){installSpecialEncounters();saveNow();}return out;};
const specialResumeRun=resumeRun;
resumeRun=function(){specialResumeRun();if(G.run&&G.world){installSpecialEncounters();updateHUD(0);}};
const specialSnapshotRun=snapshotRun;
snapshotRun=function(){specialSnapshotRun();if(save.resume&&G.world?.specialEncounters){save.resume.world.specialEncounters=deepCopy(G.world.specialEncounters);save.resume.world.specialEncounterVersion=G.world.specialEncounterVersion||ROOM_ENCOUNTER_VERSION;}};
const specialUpdate=update;
update=function(dt){specialUpdate(dt);if(G.state==='playing'&&!G.descending)tickSpecialEncounters(dt);};
const specialDrawProps=drawProps;
drawProps=function(ctx){specialDrawProps(ctx);drawSpecialEncounters(ctx);};
const specialUpdateHUD=updateHUD;
updateHUD=function(dt){specialUpdateHUD(dt);if(!G.player||!G.world||G.boss?.introduced)return;const sc=G.world.specialEncounters?.find(o=>o.active&&!o.complete)||specialEncounterAt();if(sc&&(sc.active||sc.complete))setTxt('floorObjective',specialEncounterObjective(sc));};
const specialSfx=sfx;
sfx=function(name,a){if(!['roomSeal','roomWave','roomClear'].includes(name))return specialSfx(name,a);if(!AC||!save.sfx)return;if(name==='roomSeal'){thump(118,48,.32,.05);air(.34,.028,340,1450,.72,0,'bandpass');}else if(name==='roomWave'){air(.18,.018,1200,340,.7,0);bell(220,.28,.008,0,true);}else{swell([196,293.66,392,587.33],.85,.022,0);bell(880,.55,.014,.1,false);}};
