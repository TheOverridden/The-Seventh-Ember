const beforeLateFloorName=floorName;floorName=function(f){const r=lateRegion(f),info=lateFloorInfo(f);return r&&info?info[0]:beforeLateFloorName(f);};
function playerInLateArena(){const w=G.world,r=w?.exit,p=G.player;return !!(w?.region==='late'&&r&&p&&p.x>r.x*TILE&&p.x<(r.x+r.w)*TILE&&p.y>r.y*TILE&&p.y<(r.y+r.h)*TILE);}
const beforeLateHollowUpdate=hollowBeforeUpdate;
hollowBeforeUpdate=function(dt){
  tickBlessings(dt);
  if(interactQueued){const tr=nearestTrace();if(tr){interactQueued=false;openTrace(tr.id,!!storyData().seen[tr.id]);return true;}}
  if(G.world?.region!=='late')return beforeLateHollowUpdate(dt);
  const w=G.world;if(w.lateCleared&&G.run.lateClearShown!==G.floor){const scene=LATE_BOSS_SCENES[lateRegion(G.floor).bossKey][1];if(!storyData().seen[scene])beginDialogue(scene);else{G.run.lateClearShown=G.floor;showChapterClear();}return true;}
  if(G.boss?.lateBoss&&!G.boss.introduced&&playerInLateArena()){activateLateBoss(G.boss);if(G.state!=='playing')return true;}
  tickLateHazards(dt);return G.dead;
};
const beforeLateUpdateHUD=updateHUD;
updateHUD=function(dt){
  beforeLateUpdateHUD(dt);if(G.world?.region!=='late')return;const r=lateRegion(G.floor),tr=nearestTrace();
  setTxt('floorObjective',G.boss?(G.boss.introduced?r.boss:r.name.toUpperCase()+' · reach the guardian'):r.name.toUpperCase()+' · find the portal');
  if(tr){T('promptTxt').textContent=storyData().seen[tr.id]?'INSPECT RECOVERED TRACE':'RECOVER TRACE';T('prompt').classList.add('on');}
  if(r.key==='court'&&G.bossActive){const twins=G.enemies.filter(e=>e.lateBoss&&e.bossKey==='regents'&&!e.dead),hp=twins.reduce((n,e)=>n+e.hp,0),max=twins.reduce((n,e)=>n+e.max,0);T('bossfill').style.width=(max?clamp(hp/max,0,1)*100:0)+'%';}
};
const beforeLateSnapshot=snapshotRun;
snapshotRun=function(){beforeLateSnapshot();if(save.resume&&G.world?.region==='late'){const w=G.world;Object.assign(save.resume.world,deepCopy({region:'late',lateKey:w.lateKey,lateDecor:w.lateDecor||[],lateHazards:w.lateHazards||[],lateFixtures:w.lateFixtures||[],lateDoors:w.lateDoors||[],sealed:!!w.sealed,lateCleared:!!w.lateCleared}));}};
const beforeLateValidateCheckpoint=validateCheckpoint;
validateCheckpoint=function(r){
  beforeLateValidateCheckpoint(r);if(r.world?.region!=='late')return r;const fail=()=>{throw Error('Invalid late-stage data');},finite=(n,a=-1e6,b=1e9)=>typeof n==='number'&&Number.isFinite(n)&&n>=a&&n<=b,w=r.world;
  if(!lateRegion(r.floor)||w.lateKey!==lateRegion(r.floor).key)fail();for(const k of ['lateDecor','lateHazards','lateFixtures','lateDoors'])if(!Array.isArray(w[k])||w[k].length>300)fail();
  for(const o of [...w.lateDecor,...w.lateHazards,...w.lateFixtures])if(!finite(o.x,0,w.W*TILE)||!finite(o.y,0,w.H*TILE))fail();for(const o of w.lateFixtures)if(o.kind!=='brazier'&&(o.kind!=='trace'||!TRACE_RECORDS[o.id]))fail();for(const e of r.enemies)if(e.ai==='lateBoss'&&(!e.lateBoss||!e.bs||!['wait','windup','recover','shift','dash','dive','ram','barrier','cool','slam','submerge'].includes(e.bs.mode)||!finite(e.bs.t)||!finite(e.bs.a)))fail();return r;
};
const beforeLateValidateSave=validateSave;
validateSave=function(raw){const clean=beforeLateValidateSave(raw);if(raw.story?.seen)for(const id of Object.keys(TRACE_RECORDS))if(raw.story.seen[id]===true)clean.story.seen[id]=true;return clean;};
const beforeLateResume=resumeRun;
resumeRun=function(){const pending=save.resume?deepCopy(save.resume):null;beforeLateResume();if(!G.run)return;if(G.floor>=11&&G.floor<=50&&G.world.region!=='late'){const hp=G.player.hp,level=G.run.level,xp=G.run.xp,up=deepCopy(G.run.up),ess=save.essence;setupFloor(G.floor);G.run.level=level;G.run.xp=xp;G.run.up=up;save.essence=ess;recalc();G.player.hp=Math.min(G.player.maxHp,hp);setState('playing');pauseGame(true);saveNow();}else if(G.world.region==='late'){G.world.pal=PALETTES[G.world.pi];updateHUD(0);}};
const beforeLateAnyBlocking=anyBlockingOverlay;anyBlockingOverlay=function(){return beforeLateAnyBlocking()||T('traceRecord').classList.contains('open');};
const beforeLateReset=resetEverything;resetEverything=function(){T('traceRecord').classList.remove('open');activeTrace=null;beforeLateReset();};
function wireLate(){
  on(T('traceClose'),'click',closeTrace);
  addEventListener('keydown',e=>{if(T('traceRecord').classList.contains('open')&&['Escape','Enter','Space'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();closeTrace();}},true);
  T('chapterContinue').addEventListener('click',e=>{if(G.floor===50&&G.state==='chapter'){e.preventDefault();e.stopImmediatePropagation();hide('chapterClear');setState('playing');victory();}},true);
}
