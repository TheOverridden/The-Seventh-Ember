const FLOOR_POPULATION=[5,7,8,9,4,9,11,12,14,5];
const ENCOUNTER_VERSION=3;
function earlyAttackLimit(f){return f===1?1:f<=3?2:f<=7?3:4;}
function earlyRoomLimit(f){return f<=3||bossFloorAt(f)?1:2;}
function enemyNoticeRange(e){return e.isBoss?470:G.floor===1?220:G.floor<=3?270:G.floor<=10?320:400;}
function canWakeEnemy(e){
  if(e.growth)return false;if(e.isBoss||G.floor>10)return true;
  const p=G.player,s=G.world.rooms[0];
  if(!e.provoked&&p.x>s.x*TILE&&p.x<(s.x+s.w)*TILE&&p.y>s.y*TILE&&p.y<(s.y+s.h)*TILE)return false;
  return G.enemies.filter(o=>!o.dead&&!o.isBoss&&!o.growth&&o.aggro&&d2(o.x,o.y,p.x,p.y)<600**2).length<earlyAttackLimit(G.floor);
}
function planEarlyEncounters(w,f){
  const dist=new Int32Array(w.grid.length);dist.fill(-1);
  const start=w.rooms[0].cy*w.W+w.rooms[0].cx,q=[start];dist[start]=0;
  for(let i=0;i<q.length;i++)for(const n of [q[i]-1,q[i]+1,q[i]-w.W,q[i]+w.W])if(w.grid[n]===1&&dist[n]<0){dist[n]=dist[q[i]]+1;q.push(n);}
  const rooms=w.rooms.map((r,i)=>({r,i,d:dist[r.cy*w.W+r.cx]})).filter(o=>o.i>0&&(!bossFloorAt(f)||o.r!==w.exit)).sort((a,b)=>a.d-b.d);
  const plan=w.rooms.map(()=>({count:0,rank:0,total:rooms.length}));
  rooms.forEach((o,i)=>plan[o.i].rank=i);
  const target=FLOOR_POPULATION[f-1],used=Math.min(target,rooms.length);
  for(let i=0;i<used;i++){const index=used===1?0:Math.round(i*(rooms.length-1)/(used-1));plan[rooms[index].i].count=1;}
  let left=target-used;
  for(let i=rooms.length-1;i>1&&left>0;i--)if(plan[rooms[i].i].count<earlyRoomLimit(f)){plan[rooms[i].i].count++;left--;}
  return plan;
}
function chapterEnemyType(f,room,i){
  const rank=room.rank;
  if(f===1)return rank<room.total-2?'gateSentry':'gateHound';
  if(f<=5){
    if(rank<2)return rank===0?'gateSentry':'gateHound';
    if(f>=3&&rank===room.total-2&&i===0)return 'gateShield';
    return ['gateSentry','gateHound','gateLantern'][(rank+i)%3];
  }
  const roster=gardenRoster(f);
  return rank<2?(rank===0?'mossSlime':'petalBat'):roster[(rank+i)%roster.length];
}
function earlySpawnSpace(w,f,pos,r){
  const s=w.rooms[0];
  return pos.x>(r.x+1)*TILE&&pos.x<(r.x+r.w-1)*TILE&&pos.y>(r.y+1)*TILE&&pos.y<(r.y+r.h-1)*TILE
    &&!(pos.x>(s.x-1)*TILE&&pos.x<(s.x+s.w+1)*TILE&&pos.y>(s.y-1)*TILE&&pos.y<(s.y+s.h+1)*TILE)
    &&d2(pos.x,pos.y,G.player.x,G.player.y)>360**2
    &&G.enemies.every(e=>d2(pos.x,pos.y,e.x,e.y)>(f===1?230:140)**2);
}
function adjustEarlyReward(e){if(!e.isBoss&&!e.growth&&e.type!=='gardenMite'&&e.encounterVersion!==ENCOUNTER_VERSION){e.xp=Math.round(e.xp*1.5);e.encounterVersion=ENCOUNTER_VERSION;}}
function thinEarlyCheckpoint(){
  const w=G.world,f=G.floor;if(!w||f>10||w.encounterVersion===ENCOUNTER_VERSION)return;
  const groups=w.rooms.map(()=>[]),protectedEnemies=G.enemies.filter(e=>e.isBoss||e.growth||e.owner||e.dead);
  for(const e of G.enemies){
    if(protectedEnemies.includes(e))continue;
    let ri=w.rooms.findIndex(r=>e.x>=r.x*TILE&&e.x<(r.x+r.w)*TILE&&e.y>=r.y*TILE&&e.y<(r.y+r.h)*TILE);
    if(ri<0)ri=w.rooms.map((r,i)=>({i,d:d2(e.x,e.y,r.cx*TILE+18,r.cy*TILE+18)})).sort((a,b)=>a.d-b.d)[0].i;
    if(ri>0)groups[ri].push(e);
  }
  const keep=[];for(const group of groups)group.sort((a,b)=>d2(a.x,a.y,G.player.x,G.player.y)-d2(b.x,b.y,G.player.x,G.player.y));
  for(let pass=0;pass<earlyRoomLimit(f);pass++)for(const group of groups)if(group[pass]&&keep.length<FLOOR_POPULATION[f-1])keep.push(group[pass]);
  keep.sort((a,b)=>d2(a.x,a.y,G.player.x,G.player.y)-d2(b.x,b.y,G.player.x,G.player.y));
  let awake=0;for(const e of keep){adjustEarlyReward(e);if(e.aggro&&++awake>earlyAttackLimit(f))e.aggro=false;}
  G.enemies=[...protectedEnemies,...keep];w.encounterVersion=ENCOUNTER_VERSION;saveNow();
}
HOLLOW_FLOORS.push(
  {name:'The Overgrown Walk',hint:'The roots found a way through.'},
  {name:'Glasshouse Ruins',hint:'There is no sky above the broken glass.'},
  {name:'The Still Courtyard',hint:'Someone kept this place alive.'},
  {name:'The Nursery',hint:'Not every rustle is a footstep.'},
  {name:'The Root Chamber',hint:'Something is tending the beds.'}
);
Object.assign(HOLLOW_SCENES,{
  gardenArrival:{title:'Through the gate',where:'The Overgrown Walk',lines:[['You','Roots. All the way through the stone.'],['Wick','Mind where you step.'],['You','Are they alive?'],['Wick','That isn’t the part I’m worried about.']]},
  gardenChoice:{title:'Your handwriting',where:'The Still Courtyard',lines:[['A memory','A wooden sign hangs crookedly from a branch. KEEP THE GATE CLOSED.'],['You','That’s my handwriting.'],{speaker:'You',choices:[{label:'You knew, didn’t you?',reply:[['Wick','I watched you paint it.'],['You','And you were going to let me walk past?'],['Wick','I wanted you to recognize something on your own.']]},{label:'Turn the sign over.',reply:[['A memory','On the back, smaller: EVEN IF THEY ASK NICELY.'],['You','I was having a bad day.'],['Wick','You were having a very long one.']]}]}]},
  nurseryTalk:{title:'Count the beds',where:'The Nursery',lines:[['You','These aren’t flower beds.'],['Wick','They used to be.'],['You','What happened?'],['Wick','You stopped coming back.']]},
  matriarchBefore:{title:'The gardener',where:'The Root Chamber',lines:[['The Hollow Matriarch','Leave the light outside.'],['You','You grew through the gate.'],['The Hollow Matriarch','It was open when you left.'],['You','What’s under those roots?'],['The Hollow Matriarch','What you planted.'],['Wick','Don’t get close to the nests.'],['The Hollow Matriarch','He always says that.']]},
  matriarchAfter:{title:'Until morning',where:'The Root Chamber',lines:[['You','I remember a spade.'],['The Hollow Matriarch','You left it by the door.'],['You','Did I bury someone?'],['The Hollow Matriarch','You asked me to keep them warm.'],['Wick','We need to go.'],['You','Are they still here?'],['The Hollow Matriarch','Listen.']]},
  echo6:{title:'The beans',where:'The Overgrown Walk · recovered trace',echo:true,lines:[['A voice','Don’t pull that.'],['Another voice','It’s a weed.'],['A voice','That’s what you said about the beans.']]},
  echo7:{title:'Broken inward',where:'Glasshouse Ruins · recovered trace',echo:true,lines:[['A voice','The glass broke inward.'],['Another voice','Storm?'],['A voice','Not outside.']]},
  echo8:{title:'If it calls',where:'The Still Courtyard · recovered trace',echo:true,lines:[['A voice','If it starts calling you, fetch me.'],['A child','Even if it sounds like you?'],['A voice','Especially then.']]},
  echo9:{title:'Seven names',where:'The Nursery · recovered trace',echo:true,lines:[['A voice','Count them again.'],['Another voice','I did.'],['A voice','There are six beds.'],['Another voice','Then why are there seven names?']]},
  echo10:{title:'Keep them warm',where:'The Root Chamber · recovered trace',echo:true,lines:[['A memory','Earth clings to the handle of a spade. Your hands are shaking.'],['Your voice','Keep them here until morning.'],['A softer voice','And if you don’t come back?'],['Your voice','Don’t let the light go out.']]}
});
Object.assign(ETYPES,{
  mossSlime:{hp:74,spd:68,dmg:11,r:13,xp:10,spr:'mossSlime',ai:'garden',col:'#8cbf6f',ess:.4,kb:.8},
  petalBat:{hp:60,spd:106,dmg:10,r:11,xp:9,spr:'petalBat',ai:'garden',col:'#d49ab7',ess:.4,kb:1},
  thornSpitter:{hp:78,spd:53,dmg:12,r:13,xp:12,spr:'thornSpitter',ai:'garden',col:'#b7b673',ess:.5,kb:.7},
  barkback:{hp:146,spd:42,dmg:17,r:20,xp:18,spr:'barkback',ai:'garden',col:'#879d68',ess:.7,kb:.2},
  gardenMite:{hp:36,spd:96,dmg:9,r:8,xp:0,spr:'gardenMite',ai:'garden',col:'#b7cc75',ess:0,kb:1.1},
  gardenRoot:{hp:45,spd:0,dmg:0,r:14,xp:0,spr:'gardenRoot',ai:'garden',col:'#84985a',ess:0,kb:0,growth:true},
  gardenNest:{hp:70,spd:0,dmg:0,r:18,xp:0,spr:'gardenNest',ai:'garden',col:'#c59c90',ess:0,kb:0,growth:true}
});
function gardenRoster(f){return f===6?['mossSlime','petalBat']:f===7?['mossSlime','petalBat','thornSpitter']:['mossSlime','petalBat','thornSpitter','barkback'];}
Object.assign(ARMORY,{
  pruning:{name:'Pruning Flare',requirement:'Reach Glasshouse Ruins',detail:'Flare can earn extra damage against nests and roots.'},
  afterbloom:{name:'Afterbloom',requirement:'Defeat the Hollow Matriarch',detail:'Critical hits can restore a little health.'}
});
POOL.push({id:'pruning',r:0,max:2,w:5,icon:'sparkles',name:'Pruning Flare',ds:'+60% Flare damage against nests and roots',unlock:'pruning'},
  {id:'afterbloom',r:2,max:1,w:3,icon:'heart',name:'Afterbloom',ds:'Critical hits restore 2 health, at most once per second',unlock:'afterbloom'});

const beforeGarden={genHollowFloor,spawnEnemy,setupFloor,hollowBeforeUpdate,damageEnemy,killEnemy,killBoss,updateHUD,validateCheckpoint,drawHollowFloor,resumeRun};
genHollowFloor=function(f){
  const w=beforeGarden.genHollowFloor(f);w.encounterVersion=ENCOUNTER_VERSION;if(f<6)return w;
  w.hollowDecor=w.hollowDecor.filter(o=>o.type!=='carpet'&&o.type!=='statue');
  for(let i=0;i<w.rooms.length;i++){
    const r=w.rooms[i];
    w.hollowDecor.push({type:'moss',x:r.cx*TILE+18,y:r.cy*TILE+18,w:(r.w-2)*TILE,h:(r.h-2)*TILE,seed:i});
    w.hollowDecor.push({type:'vine',x:(r.x+1)*TILE+18,y:(r.y+1)*TILE+18,w:(r.w-2)*TILE,h:(r.h-2)*TILE,seed:i});
    if(f===7||f===8)w.hollowDecor.push({type:'trellis',x:(r.x+r.w-2)*TILE+18,y:(r.y+2)*TILE+18,seed:i});
    if(i>0)w.hollowDecor.push({type:'planter',x:(r.x+2)*TILE+18,y:(r.y+2)*TILE+18,seed:i});
  }
  w.hazards=[];
  if(f===7||f===9)for(const r of w.rooms.slice(2,4)){w.hazards.push({x:(r.x+2)*TILE,y:(r.cy+1)*TILE,w:Math.min(4,r.w-4)*TILE,h:14,t:rand(2,4),phase:'rest'});}
  return w;
};
spawnEnemy=function(type,x,y,elite){
  const e=beforeGarden.spawnEnemy(type,x,y,elite);if(e.ai!=='garden')return e;
  const base=ETYPES[type],depth=Math.max(0,G.floor-6);e.hp=e.max=Math.round(base.hp*(1+depth*.085)*(elite?1.45:1));e.spd=base.spd;e.dmg=Math.round(base.dmg*(1+depth*.04));e.xp=base.xp;e.face=0;e.action='stalk';e.actionT=.8;e.growth=!!base.growth;e.age=0;e.rootA=rand(0,TAU);e.hatchT=4.8;e.owner=0;e.balanceVersion=2;return e;
};
setupFloor=function(f){beforeGarden.setupFloor(f);if(f<=10)for(const e of G.enemies)adjustEarlyReward(e);if(f===6)queueStory('gardenArrival');if(f===7)unlockArmory('pruning');if(f===9)queueStory('nurseryTalk');};
resumeRun=function(){beforeGarden.resumeRun();if(G.run&&!G.dead)thinEarlyCheckpoint();};
function shootSeed(e,a,speed,dmg){enemyShoot(e,a,speed,dmg);const b=G.ebul[G.ebul.length-1];b.garden=true;b.r=6;b.life=3.2;}
function gardenEnemyAI(e,dt,d,dx,dy){
  if(e.growth)return;const p=G.player,w=G.world;e.actionT-=dt;
  if(e.action==='warn'){
    if(e.actionT<=0){
      if(e.type==='thornSpitter'){for(const a of [-.09,.09])shootSeed(e,e.face+a,235,e.dmg);e.action='recover';e.actionT=1.2;}
      else if(e.type==='barkback'){for(const a of [-.25,0,.25])shootSeed(e,e.face+a,160,e.dmg);e.action='recover';e.actionT=1.4;e.strikeT=.22;}
      else{e.action='leap';e.actionT=e.type==='petalBat'?.32:.24;}
    }return;
  }
  if(e.action==='leap'){moveEnt(w,e,Math.cos(e.face)*310*dt,Math.sin(e.face)*310*dt);if(e.actionT<=0){e.action='recover';e.actionT=.8;}return;}
  if(e.action==='recover'){e.strikeT=Math.max(0,(e.strikeT||0)-dt);if(e.actionT<=0){e.action='stalk';e.actionT=.4;}return;}
  e.face=Math.atan2(dy,dx);
  if(e.type==='gardenMite'){moveEnt(w,e,dx/Math.max(1,d)*e.spd*dt,dy/Math.max(1,d)*e.spd*dt);return;}
  const ranged=e.type==='thornSpitter',range=ranged?260:e.type==='barkback'?155:135;
  const step=ranged?(d>260?1:d<180?-1:0):d>range*.72?1:0;
  moveEnt(w,e,dx/Math.max(1,d)*e.spd*dt*step,dy/Math.max(1,d)*e.spd*dt*step);
  if(d<(ranged?370:range)&&e.actionT<=0&&los(w,e.x,e.y,p.x,p.y)){e.action='warn';e.actionT=e.type==='barkback'?.8:.6;}
}
function segmentDistance(px,py,x1,y1,x2,y2){const vx=x2-x1,vy=y2-y1,l=vx*vx+vy*vy,t=l?clamp(((px-x1)*vx+(py-y1)*vy)/l,0,1):0;return Math.hypot(px-x1-t*vx,py-y1-t*vy);}
function tickGardenGrowth(dt){
  const b=G.boss,p=G.player;
  for(const e of G.enemies){if(e.dead||!e.growth)continue;e.age+=dt;
    if(e.type==='gardenRoot'&&e.age>1.15){const len=100;const x=e.x+Math.cos(e.rootA)*len,y=e.y+Math.sin(e.rootA)*len;if(segmentDistance(p.x,p.y,e.x,e.y,x,y)<p.r+7&&los(G.world,e.x,e.y,p.x,p.y))hurtPlayer(b?.ms?.second?11:9,e.x,e.y);}
    if(e.type==='gardenNest'&&e.age>1.5){e.hatchT-=dt;
      if(e.hatchT<=0){e.hatchT=5;const limit=b?.ms?.second?3:2;
        if(G.enemies.filter(m=>!m.dead&&m.type==='gardenMite').length<limit){
          const pos=safePosition(G.world,e.x+rand(-28,28),e.y+rand(-28,28),8);
          if(pos){const m=spawnEnemy('gardenMite',pos.x,pos.y,false);m.owner=e.owner;m.aggro=true;burst(e.x,e.y,5,'#b9c686',65,.3,2,false);}
        }
      }
    }
  }
}
const MATRIARCH_HP=2550;
function spawnMatriarch(){
  const w=G.world,r=w.exit,b=spawnBossAt(r.cx*TILE+18,(r.cy-2)*TILE+18);
  Object.assign(b,{matriarch:true,ai:'matriarch',name:'THE HOLLOW MATRIARCH',hp:MATRIARCH_HP,max:MATRIARCH_HP,r:33,dmg:22,spd:57,xp:135,col:'#ba87a1',tier:2,kb:0,introduced:false,balanceVersion:2});
  b.ms={mode:'wait',kind:'',t:1.2,duration:1.2,a:Math.PI/2,step:0,second:false,hit:false,followup:false};return b;
}
function activateMatriarch(b){b.introduced=true;b.aggro=true;G.bossActive=true;G.ebul=[];G.bullets=[];chapterBannerT=0;T('chapterBanner').classList.remove('visible');sealWardenArena(true);T('bossname').textContent=b.name;T('bossbar').classList.add('on');sfx('boss');if(!storyData().seen.matriarchBefore)beginDialogue('matriarchBefore');saveNow();}
function plantGrowth(b,type){
  const limit=type==='gardenNest'?2:b.ms.second?4:3;
  if(G.enemies.filter(e=>!e.dead&&e.type===type).length>=limit)return;
  const r=G.world.exit;
  for(let n=0;n<35;n++){
    let x=(irand(r.x+2,r.x+r.w-3)+.5)*TILE,y=(irand(r.y+2,r.y+r.h-3)+.5)*TILE;
    if(type==='gardenRoot'&&n<12){
      const p=G.player,dx=p.x-b.x,dy=p.y-b.y,d=Math.max(100,Math.hypot(dx,dy));
      const turn=clamp((dx*(b.ms.vy||0)-dy*(b.ms.vx||0))/(d*d),-1.4,1.4);
      const ahead=Math.atan2(dy,dx)+(Math.abs(turn)>.12?turn*1.35:rand(-.9,.9)),radius=d+45;
      x=clamp(b.x+Math.cos(ahead)*radius+rand(-18,18),(r.x+2)*TILE,(r.x+r.w-2)*TILE);
      y=clamp(b.y+Math.sin(ahead)*radius+rand(-18,18),(r.y+2)*TILE,(r.y+r.h-2)*TILE);
    }
    const pos=safePosition(G.world,x,y,20);if(!pos||d2(pos.x,pos.y,G.player.x,G.player.y)<100**2||d2(pos.x,pos.y,b.x,b.y)<80**2||G.enemies.some(e=>!e.dead&&d2(pos.x,pos.y,e.x,e.y)<65**2))continue;
    const e=spawnEnemy(type,pos.x,pos.y,false);e.hp=e.max=type==='gardenNest'?70:45;e.owner=b.uid;e.rootA=type==='gardenRoot'?Math.atan2(b.y-e.y,b.x-e.x):0;e.hatchT=4.8;
    burst(e.x,e.y,7,'#83965d',75,.5,2,false);return;
  }
}
function matriarchAI(b,dt,d,dx,dy){
  if(!b.introduced)return;const a=b.ms,p=G.player,w=G.world;a.t-=dt;musicInt=.85;
  const maxSpeed=p.speed*1.1;
  a.vx=lerp(a.vx||0,clamp((p.x-(a.px??p.x))/Math.max(.001,dt),-maxSpeed,maxSpeed),.3);
  a.vy=lerp(a.vy||0,clamp((p.y-(a.py??p.y))/Math.max(.001,dt),-maxSpeed,maxSpeed),.3);a.px=p.x;a.py=p.y;
  if(!a.second&&b.hp<=b.max*.5){a.second=true;a.mode='bloom';a.t=1.1;a.duration=1.1;burst(b.x,b.y,22,'#d1a6b9',160,.7,3,false);sfx('roar2');return;}
  if(a.mode==='bloom'){if(a.t<=0){a.mode='recover';a.t=.6;}return;}
  if(a.mode==='windup'){
    if(a.t>.22&&(a.kind==='lash'||a.kind==='seeds')){const lead=a.kind==='lash'?.36:Math.min(.95,d/290+.22);a.a=Math.atan2(p.y+a.vy*lead-b.y,p.x+a.vx*lead-b.x);}
    if(a.t>0)return;
    if(a.kind==='plant'){plantGrowth(b,'gardenNest');plantGrowth(b,'gardenRoot');if(a.second)plantGrowth(b,'gardenRoot');a.mode='recover';a.t=1.15;sfx('chest');return;}
    if(a.kind==='seeds'){for(const angle of (a.second?[-.4,-.2,0,.2,.4]:[-.24,0,.24]))shootSeed(b,a.a+angle,a.second?305:290,b.dmg*(a.second?.72:.65));a.mode='recover';a.t=a.second?.76:.95;return;}
    a.mode=a.kind==='lash'?'lash':'rake';a.t=a.duration=a.kind==='lash'?.52:.34;a.hit=false;sfx('dash');return;
  }
  if(a.mode==='lash'){
    const u=clamp(1-a.t/a.duration,0,1),len=340*Math.sin(Math.PI*u),tx=b.x+Math.cos(a.a)*len,ty=b.y+Math.sin(a.a)*len;
    if(!a.hit&&segmentDistance(p.x,p.y,b.x,b.y,tx,ty)<p.r+9&&los(w,b.x,b.y,p.x,p.y)){hurtPlayer(b.dmg*(a.second?1.1:1),b.x,b.y);a.hit=true;}
    if(a.t<=0){a.mode='recover';a.t=a.second?.6:1.0;}return;
  }
  if(a.mode==='rake'){
    const u=clamp(1-a.t/a.duration,0,1),prev=clamp(1-(a.t+dt)/a.duration,0,1),sign=a.followup?-1:1;
    const start=sign*(-1.05+2.1*prev),end=sign*(-1.05+2.1*u),angle=angleDiff(Math.atan2(p.y-b.y,p.x-b.x),a.a);
    if(!a.hit&&d<154+p.r&&angle>=Math.min(start,end)-.15&&angle<=Math.max(start,end)+.15&&los(w,b.x,b.y,p.x,p.y)){hurtPlayer(b.dmg*(a.second?1.1:1),b.x,b.y);a.hit=true;}
    if(a.t<=0){if(a.second&&!a.followup){a.followup=true;a.mode='windup';a.t=a.duration=.32;a.a=Math.atan2(p.y-b.y,p.x-b.x);}else{a.mode='recover';a.t=a.second?.65:1.05;}}return;
  }
  if(a.mode==='recover'){if(a.t<=0){a.mode='wait';a.t=a.second?.14:.35;}return;}
  a.a=Math.atan2(dy,dx);
  if(d>150)moveEnt(w,b,dx/Math.max(d,1)*(a.second?82:57)*dt,dy/Math.max(d,1)*(a.second?74:57)*dt);
  if(a.t>0)return;
  const pattern=a.second?['plant','rake','lash','seeds','rake','plant','lash']:['plant','lash','rake','seeds'];a.kind=pattern[a.step++%pattern.length];if(a.kind==='rake'&&d>190)a.kind='lash';
  a.mode='windup';a.followup=false;a.a=Math.atan2(dy,dx);a.t=a.duration=a.kind==='plant'?(a.second?.78:.95):a.kind==='seeds'?(a.second?.62:.75):a.second?.48:.7;
}
hollowBeforeUpdate=function(dt){
  if(G.player?.bloomCd>0)G.player.bloomCd=Math.max(0,G.player.bloomCd-dt);
  if(G.floor<=10&&G.player&&G.world)for(const e of G.enemies)if(e.aggro&&!e.isBoss&&!e.growth&&d2(e.x,e.y,G.player.x,G.player.y)>650**2&&!los(G.world,e.x,e.y,G.player.x,G.player.y))e.aggro=false;
  if(G.floor>=6&&G.floor<=10&&G.world?.region==='hollow'){
    if(G.boss?.matriarch&&!G.boss.introduced&&playerInArena()){activateMatriarch(G.boss);return true;}
    if(G.floor===8&&!storyData().seen.gardenChoice){const r=G.world.rooms[G.world.storyRoom],p=G.player;if(p.x>r.x*TILE&&p.x<(r.x+r.w)*TILE&&p.y>r.y*TILE&&p.y<(r.y+r.h)*TILE)queueStory('gardenChoice');}
    tickGardenGrowth(dt);if(G.dead)return true;
  }
  return beforeGarden.hollowBeforeUpdate(dt);
};
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
  if(e.matriarch){if(!e.introduced)return;if(e.ms.mode==='bloom')dmg*=.7;if(e.ms.mode==='recover')dmg*=kind==='melee'?1.4:1.15;}
  if(e.growth&&kind==='melee')dmg*=1+.6*(G.run.up.pruning||0);
  const live=!e.dead;beforeGarden.damageEnemy(e,dmg,ang,crit,kb,kind);
  if(live&&!e.dead&&G.floor<=10&&!e.isBoss&&!e.growth){e.provoked=true;if(canWakeEnemy(e))e.aggro=true;}
  if(live&&crit&&!e.growth&&G.run.up.afterbloom&&!(G.player.bloomCd>0)){G.player.hp=Math.min(G.player.maxHp,G.player.hp+2);G.player.bloomCd=1;}
};
killEnemy=function(e){
  if(e.growth||e.type==='gardenMite'){
    if(e.dead)return;e.dead=true;burst(e.x,e.y,10,e.col,110,.45,2,false);sfx('die');return;
  }
  beforeGarden.killEnemy(e);
};
killBoss=function(b){
  beforeGarden.killBoss(b);if(!b.matriarch)return;
  G.enemies=G.enemies.filter(e=>e.owner!==b.uid);G.ebul=[];sealWardenArena(false);G.world.wardCleared=true;G.player.hitCd=2;unlockArmory('afterbloom');
  let xp=0;G.picks=G.picks.filter(o=>{if(d2(o.x,o.y,b.x,b.y)>130**2)return true;if(o.kind==='xp')xp+=o.val;else if(o.kind==='ess')addEss(o.val);else if(o.kind==='heart')G.player.hp=Math.min(G.player.maxHp,G.player.hp+o.val);return false;});
  if(xp)gainXP(xp);updateHUD(0);saveNow();
};
updateHUD=function(dt){beforeGarden.updateHUD(dt);if(G.floor>=6&&G.floor<=10&&G.world?.region==='hollow')setTxt('floorObjective',G.boss?.introduced?'THE ROOT CHAMBER':'THE ROOTBOUND GARDENS · explore, then find the portal');};
validateCheckpoint=function(r){
  beforeGarden.validateCheckpoint(r);const n=(x,lo=-1e6,hi=1e6)=>typeof x==='number'&&Number.isFinite(x)&&x>=lo&&x<=hi;
  for(const e of r.enemies){
    if(e.ai==='garden'&&(!['stalk','warn','leap','recover'].includes(e.action)||!n(e.actionT)||!n(e.face)||!n(e.age,0)||!n(e.rootA)||!n(e.hatchT)||!n(e.owner,0)))throw Error('Invalid garden creature');
    if(e.matriarch){const a=e.ms;if(e.ai!=='matriarch'||!a||!['wait','windup','rake','lash','recover','bloom'].includes(a.mode)||!['','plant','rake','lash','seeds'].includes(a.kind)||!n(a.t)||!n(a.duration,0)||!n(a.a)||!n(a.step,0)||typeof a.second!=='boolean')throw Error('Invalid Matriarch phase');}
  }
  if(r.player.bloomCd!==undefined&&!n(r.player.bloomCd,0,1))throw Error('Invalid healing state');return r;
};

function bakeGardenSprites(){
  bakeGardenCreatureVariants();
  SPR.gardenMatriarch=pxGen(54,40,4,(i,j,f)=>{
    const x=i-26.5,y=j-23,phase=f*TAU/4;
    for(let s of [-1,1])for(let k=0;k<3;k++){
      const rootY=18+k*5,tipX=26.5+s*(23-k*2),tipY=rootY+7+Math.sin(phase+k)*1.1;
      if(segmentDistance(i,j,26.5+s*10,rootY,tipX,tipY)<1.9)return j<tipY?'#819667':'#293628';
    }
    const body=x*x/210+y*y/95;
    if(body<1.08){if(body>.93)return '#182821';if(body>.73)return y<0?'#88a779':'#334e39';
      if(Math.abs(x)<7&&y>1&&y<7)return Math.floor(x+y)%5===0?'#d1b8a4':'#87726e';
      if((Math.floor(i/4)+Math.floor(j/3))%4===0)return '#71876a';return y<0?'#587b55':'#304b38';}
    const hx=i-26.5,hy=j-11,rad=Math.hypot(hx,hy),a=Math.atan2(hy,hx),edge=9.3+Math.sin(a*6+phase*.08)*2.5;
    if(rad<edge){if(rad>edge-1.3)return '#432c45';if(rad>6)return hy<0?'#d6a3b1':'#9c667f';
      if(rad>4.8)return '#e2ceba';if((i===24||i===25||i===28||i===29)&&j>=9&&j<=10)return '#f5e6b9';return '#202329';}
    return null;
  },{fps:4,sc:2.3});
  SPR.gardenMatriarch=pxGen(60,48,6,(i,j,f)=>{
    const phase=f/6*TAU,x=i-29.5,y=j;
    for(let side of [-1,1])for(let k=0;k<3;k++){
      const bx=29.5+side*(9+k*2),by=27+k*4,tx=29.5+side*(27-k*2),ty=32+k*5+Math.sin(phase+k*1.7)*1.8;
      const d=segmentDistance(i,j,bx,by,tx,ty);if(d<2.5)return d>1.4?'#182a20':k===1?'#91a36d':'#506d49';
    }
    const hx=x,hy=y-11,ang=Math.atan2(hy,hx),rad=Math.hypot(hx,hy),petal=10+Math.cos(ang*7+phase*.08)*3.2;
    if(rad<petal){if(rad>petal-1.5)return '#3b263d';if(rad>6.1)return hy<0?'#ddaeb8':'#a46b82';if(rad>4.5)return '#ebd7bd';if((i===27||i===28||i===31||i===32)&&j>=10&&j<=12)return '#f7e6a8';return '#171c22';}
    const abdomen=x*x/245+(y-28)*(y-28)/115;
    if(abdomen<1.08){if(abdomen>.9)return '#15261d';if(y<24)return '#7d9a69';if((Math.floor(x/4)+Math.floor(y/3)+f)%5===0)return '#c7aa91';if(Math.abs(x)<7&&y>28&&y<35)return '#8f7169';return y<30?'#4e704d':'#294335';}
    const chest=x*x/120+(y-20)*(y-20)/72;if(chest<1){if(chest>.82)return '#1a2a20';return y<19?'#91a873':'#3e6142';}
    return null;
  },{fps:6,sc:2.15});
  SPR.gardenRoot=pxGen(17,17,2,(x,y,f)=>{const dx=x-8,dy=y-8,r=Math.hypot(dx,dy);if(r>7)return null;if(r>5.8)return '#273c2b';if(r>4)return '#668953';if(Math.abs(dx)<2&&Math.abs(dy)<3)return f?'#e1c697':'#c8ab80';return '#a28279';},{fps:3,sc:2});
  SPR.gardenNest=pxGen(24,22,3,(x,y,f)=>{
    for(const[cx,cy]of [[7,12],[15,12],[11,7]]){const dx=x-cx,dy=y-cy,d=dx*dx/25+dy*dy/44;if(d<1){if(d>.8)return '#403b34';if(dx< -1&&dy<1)return '#d9c6ac';return (x+y+f)%7===0?'#967b7b':'#b3958d';}}
    if(y>15&&y<20&&x>2&&x<21)return (x+y)%3===0?'#829865':'#3a5137';return null;
  },{fps:3,sc:2});
}
function drawSeedShot(ctx,b){const a=Math.atan2(b.vy,b.vx);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);ctx.fillStyle='#385536';ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(0,-5);ctx.lineTo(7,0);ctx.lineTo(0,5);ctx.closePath();ctx.fill();ctx.fillStyle='#d6d598';ctx.fillRect(-2,-2,6,3);ctx.restore();}
function drawGardenDecor(ctx,o,t){
  if(o.type==='moss'){
    for(let i=0;i<15;i++){const x=Math.sin(i*9.2+o.seed)*o.w*.46,y=Math.cos(i*5.7+o.seed)*o.h*.45;ctx.fillStyle=i%2?'#43784c20':'#59846126';ctx.beginPath();ctx.ellipse(x,y,13+(i%4)*7,6+(i%3)*5,0,0,TAU);ctx.fill();}
  }else if(o.type==='vine'){
    ctx.strokeStyle='#1e322b';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-12,0);ctx.bezierCurveTo(o.w*.35,27,o.w*.65,-16,o.w-25,8);ctx.stroke();ctx.strokeStyle='#638257';ctx.lineWidth=2;ctx.stroke();
    for(let i=0;i<7;i++){const x=i*(o.w-30)/7,y=Math.sin(i*2)*9;ctx.fillStyle=i%2?'#5b8755':'#87a36a';ctx.beginPath();ctx.ellipse(x,y,8,3.5,i%2?-.6:.6,0,TAU);ctx.fill();}
  }else if(o.type==='planter'){
    ctx.fillStyle='#182c25';ctx.fillRect(-24,-15,48,32);ctx.fillStyle='#607168';ctx.fillRect(-24,-15,48,5);ctx.fillRect(-24,-15,5,32);ctx.fillRect(19,-15,5,32);ctx.fillRect(-24,13,48,4);ctx.fillStyle='#253a28';ctx.fillRect(-19,-9,38,21);
    for(let i=0;i<5;i++){const x=-15+i*7;ctx.strokeStyle='#7a9460';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,10);ctx.lineTo(x+Math.sin(t*.5+i)*2,-12-i%3*4);ctx.stroke();ctx.fillStyle=i%2?'#ad879e':'#b5c390';ctx.fillRect(x-2,-15-i%3*4,5,5);}
  }else if(o.type==='trellis'){
    ctx.strokeStyle='#75958d66';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-19,20);ctx.lineTo(-19,-44);ctx.lineTo(0,-57);ctx.lineTo(19,-44);ctx.lineTo(19,20);ctx.moveTo(-19,-18);ctx.lineTo(19,-18);ctx.moveTo(0,-57);ctx.lineTo(0,10);ctx.stroke();ctx.fillStyle='#9cc5b229';ctx.beginPath();ctx.moveTo(-17,-39);ctx.lineTo(-3,-48);ctx.lineTo(-9,-14);ctx.closePath();ctx.fill();
  }
}
function drawGardenBramble(ctx,h){
  const grown=h.phase==='active',waking=h.phase==='warn';ctx.strokeStyle='#31442c';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(h.x,h.y+7);ctx.lineTo(h.x+h.w,h.y+7);ctx.stroke();
  for(let i=0;i<h.w/13;i++){const x=h.x+i*13,height=grown?17:waking?6+Math.sin(G.tAll*10+i)*2:3;ctx.fillStyle=grown?'#b4b480':waking?'#93a572':'#596b45';ctx.beginPath();ctx.moveTo(x-4,h.y+9);ctx.lineTo(x+2,h.y+9-height);ctx.lineTo(x+5,h.y+9);ctx.closePath();ctx.fill();}
}
function drawRootArm(ctx,b,a,reach,alpha=1,bend=12){
  if(reach<3)return;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(a);ctx.globalAlpha=alpha;
  ctx.strokeStyle='#17271d';ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(18,0);ctx.quadraticCurveTo(reach*.48,bend,reach,-2);ctx.stroke();ctx.strokeStyle='#718c59';ctx.lineWidth=7;ctx.stroke();ctx.strokeStyle='#a9b67b';ctx.lineWidth=2;ctx.stroke();
  ctx.strokeStyle='#d2cc91';ctx.lineWidth=3;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(reach-7,-3+i*4);ctx.lineTo(reach+10,-10+i*8);ctx.stroke();}ctx.restore();
}
function drawGardenEnemy(ctx,e){
  const t=save.motion?0:G.tAll;
  ctx.fillStyle='#0006';ctx.beginPath();ctx.ellipse(e.x,e.y+e.r*.7,e.r*.95,e.r*.35,0,0,TAU);ctx.fill();
  if(e.matriarch){
    const a=e.ms,wind=a.mode==='windup',charge=wind?smoothBoss(1-a.t/Math.max(.01,a.duration)):0;
    const lash=a.mode==='lash',rake=a.mode==='rake',activeU=(lash||rake)?clamp(1-a.t/a.duration,0,1):0;
    let bx=e.x,by=e.y-9,sx=1,sy=1,rot=Math.sin(t*1.1)*.018;
    if(wind&&a.kind==='lash'){bx-=Math.cos(a.a)*charge*9;by-=Math.sin(a.a)*charge*9;sy=1+charge*.09;sx=1-charge*.08;}
    if(wind&&a.kind==='plant'){by+=charge*9;sx=1+charge*.09;sy=1-charge*.07;}
    if(wind&&a.kind==='rake'){rot-=Math.sin(a.a)*charge*.1;sx=1-charge*.05;}
    if(lash){const surge=Math.sin(Math.PI*activeU);bx+=Math.cos(a.a)*surge*8;by+=Math.sin(a.a)*surge*8;sy=1+surge*.05;}
    if(rake)rot+=(-.08+.16*activeU)*(a.followup?-1:1);
    if(a.mode==='bloom'){const u=1-a.t/1.1;sx=1+Math.sin(u*Math.PI*3)*.09;sy=1+Math.sin(u*Math.PI*3)*.12;}
    const pose={...e,x:bx,y:by+8};glowImg(a.second?'orchid':'teal',bx,by+4,86,a.mode==='bloom'?.62:.28);
    if(wind&&a.kind==='lash'){const r=62*(1-charge);drawRootArm(ctx,pose,a.a-1.25+charge*.56,r,.9,22);drawRootArm(ctx,pose,a.a+1.25-charge*.56,r,.9,-22);}
    else if(lash){drawRootArm(ctx,pose,a.a,340*Math.sin(Math.PI*activeU),1,24*Math.sin(TAU*activeU));drawRootArm(ctx,pose,a.a+1.4,62,.55,-18);}
    else if(wind&&a.kind==='rake'){const r=64+84*charge;drawRootArm(ctx,pose,a.a-.9-charge*.18,r,1,18);drawRootArm(ctx,pose,a.a+.9+charge*.18,r,.72,-18);}
    else if(rake){const sign=a.followup?-1:1,aa=a.a+sign*(-1.05+2.1*activeU);drawRootArm(ctx,pose,aa,148,1,sign*18);drawRootArm(ctx,pose,a.a-sign*.92,68,.62,-sign*14);}
    else if(wind&&a.kind==='plant'){drawRootArm(ctx,pose,a.a-1.3,62+charge*45,.8,30);drawRootArm(ctx,pose,a.a+1.3,62+charge*45,.8,-30);}
    else{drawRootArm(ctx,pose,a.a-.86,64,.78,15);drawRootArm(ctx,pose,a.a+.86,64,.78,-15);}
    ctx.save();ctx.translate(bx,by);ctx.rotate(rot);ctx.scale(sx,sy);drawSpr('gardenMatriarch',0,0,1,0,1);ctx.restore();
    if(wind&&a.kind==='seeds'){glowImg('gold',bx,by-20,13+charge*14,.24+charge*.45);for(let i=0;i<5;i++){const q=a.a+(i-2)*.17,rr=20+charge*14;ctx.fillStyle='#d8d08c';ctx.fillRect(bx+Math.cos(q)*rr-1,by-10+Math.sin(q)*rr-1,3,3);}}
    if(wind&&a.kind==='plant')for(let i=0;i<7;i++){const an=t+i*TAU/7,rr=46-charge*22;ctx.fillStyle='#b3c18b';ctx.fillRect(bx+Math.cos(an)*rr,by+15+Math.sin(an)*rr*.35,3,4);}
    if(a.second){ctx.save();ctx.translate(bx,by+7);ctx.rotate(t*.22);ctx.strokeStyle='#d8b1b177';ctx.lineWidth=2;for(let i=0;i<6;i++){ctx.rotate(TAU/6);ctx.beginPath();ctx.moveTo(43,0);ctx.quadraticCurveTo(52,8,60,0);ctx.stroke();}ctx.restore();}
  }else if(e.growth){
    const scale=clamp(e.age/1.1,.15,1);
    if(e.type==='gardenRoot'){
      const len=100*scale;ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.rootA);ctx.strokeStyle='#203b2a';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(len*.5,8,len,0);ctx.stroke();ctx.strokeStyle=e.age>1.15?'#8b9c60':'#657d4e';ctx.lineWidth=4;ctx.stroke();
      for(let i=1;i<7;i++){const x=i*len/7;ctx.fillStyle=e.age>1.15?'#c2bf87':'#71885b';ctx.beginPath();ctx.moveTo(x-3,2);ctx.lineTo(x+2,-9);ctx.lineTo(x+5,3);ctx.closePath();ctx.fill();}ctx.restore();
    }
    drawSpr(e.spr,e.x,e.y,scale,0,1,e.seed);
    if(e.type==='gardenNest'&&e.hatchT<1.2){glowImg('gold',e.x,e.y-6,20,.2);}
  }else{
    const warn=e.action==='warn',bat=e.type==='petalBat',bob=bat?Math.sin(t*8+e.seed)*3:0;
    glowImg(e.type==='thornSpitter'?'gold':'teal',e.x,e.y,e.r*2.1,warn?.33:.2);
    const rot=bat?Math.sin(t*7+e.seed)*.15:e.type==='thornSpitter'?e.face:0;
    ctx.save();ctx.translate(e.x,e.y+bob);ctx.scale(warn?1.08:1,warn?.92:1);drawSpr(e.spr,0,0,e.elite?1.18:1,rot,1,e.seed);ctx.restore();
    if(e.type==='barkback'){ctx.strokeStyle='#a0ac76';ctx.lineWidth=2;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(e.x+s*12,e.y-10);ctx.lineTo(e.x+s*19,e.y-22);ctx.lineTo(e.x+s*26,e.y-25);ctx.stroke();}}
    if(e.elite){ctx.strokeStyle='#e6c37b';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(e.x,e.y,e.r+6,t,t+4.2);ctx.stroke();}
  }
  if(!e.isBoss&&e.hp<e.max){const width=e.r*2;ctx.fillStyle='#102019';ctx.fillRect(e.x-width/2,e.y-e.r-12,width,4);ctx.fillStyle=e.growth?'#dbc18f':'#d792a8';ctx.fillRect(e.x-width/2,e.y-e.r-12,width*clamp(e.hp/e.max,0,1),3);}
  if(e.hitT>0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=e.hitT*3;ctx.fillStyle='#fff1d1';ctx.beginPath();ctx.arc(e.x,e.y,e.r*.65,0,TAU);ctx.fill();ctx.restore();}
}

function bakeGardenCreatureVariants(){
  SPR.mossSlime=px([
   ["....oooooo......","...obbbbbbo.....","..obllllllbo....","..oblllllbbo....",".obblbbbbbbbo...",".obwwkbbbwwkbo..",".obwwkbbbwwkbo..",".obbbbbbbbbbbo..",".obbbbkbbbkbbo..",".obbbbbbbbbbbo..","..obbbbbbbbo....","...obbbbboo.....","....ooooo......."],
   ["................","................","................","...oooooooo.....","..obllllllbbo...",".obllllllllbbo..",".obwwkbbbbwwkbo.",".obwwkbbbbwwkbo.",".obbbbbbkbbbbbo.",".obbbbbbbbbbbbo.","..obbbbbbbbbbo..","..ooooooooooo...","................"]
  ],{o:'#1b3229',b:'#557b4d',l:'#a6bf7d',w:'#eef0c9',k:'#20362b'},{fps:3,sc:2});
  SPR.petalBat=px([
   [".oo........oo.","odwo......owdo","owwwo....owwwo","owwwwoooowwwwo",".owwwobbbbowwwo.","..owwbbkkbbwwo..","...dwbbkkbbwd...","....obbbbbbo....",".....oo..oo....."],
   ["................","................","..oo........oo..",".owwo......owwo.",".owwwobbbbowwwo.","..dwwbbkkbbwwd..","...dwbbkkbbwd...","....obbbbbbo....",".....oo..oo....."]
  ],{o:'#342334',w:'#97617c',d:'#56384f',b:'#c697ae',k:'#342334'},{fps:9,sc:2});
  SPR.thornSpitter=px([
   ["......oooo......","....oobbbboo....","...obllllbboo...","..obllwwlllbbo..","..obllwkllbbbo..","..obllwwllbbbo..","..obbbbbblbbbo..","..obbbbbblbbbmo.","..obbbbbbblbbmo.","..obbbbbbbbbbo...","...obbbbbbbbo...",".....ooooooo....."],
   ["......oooo......","....oobbbboo....","...obllllbboo...","..obllwwlllbbo..","..obllwkllbbbo..","..obllwwllbbbo..","..obbbbbmmmmmo..","..obbbbbmkm m o..","..obbbbbmmmmmo..","..obbbbbbbbbbo...","...obbbbbbbbo...",".....ooooooo....."]
  ],{o:'#263322',b:'#718943',l:'#bbc27b',w:'#eef0c9',k:'#253827',m:'#cb9a9e'},{fps:3,sc:2});
  SPR.barkback=px([
   ["......oooooooo......","....oobbbbbbbboo....","...obllllllllbbo....","..obllbbbbbbbbbbo...","..obbyybbbbyybbbo...","..obbyybbbbyybbbo...","..obbbbbbkbbbbbo....","..obbbbkbbbbbbbo....","..obbbkbbbbbbbbo....","..obbbbbbbbbbbo.....","...obbbbbbbbo.......","....obbbooobbbo.....","....obbo..obbo......","....ooo....ooo......"],
   ["......oooooooo......","....oobbbbbbbboo....","...obllllllllbbo....","..obllbbbbbbbbbbo...","..obbhhbbbbhhbbbo...","..obbhhbbbbhhbbbo...","..obbbbbbkbbbbbo....","..obbbbkbbbbbbbo....","..obbbkbbbbbbbbo....","..obbbbbbbbbbbo.....","...obbbbbbbbo.......","....obbbooobbbo.....",".....obbo..obbo.....",".....ooo....ooo....."]
  ],{o:'#172e25',b:'#4f6352',l:'#869973',h:'#d0d5a0',y:'#dbb283',k:'#253929'},{fps:2,sc:2});
  SPR.gardenMite=px([
   ["...oooo...","..obbbbo..",".oblllbbo.",".obwkkbbo.",".obbbkbbo.","..obbbbo..","...oooo..."],
   ["..........","..oooooo..",".obllllbbo",".obwkkwbbo",".obbbbbbbo","..oooooo.."]
  ],{o:'#253a25',b:'#7b935d',l:'#bed18c',w:'#ece8bc',k:'#283b25'},{fps:4,sc:2});
}
