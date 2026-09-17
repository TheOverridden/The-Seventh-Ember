const LATE_BOSSES={
 bellkeeper:{key:'bellkeeper',hp:3900,r:34,dmg:27,spd:72,col:'#6bc7d7'},emberColossus:{key:'colossus',hp:5100,r:45,dmg:31,spd:43,col:'#f08a4e'},
 glassAstronomer:{key:'astronomer',hp:6500,r:35,dmg:34,spd:65,col:'#89e1ef'},paleScribe:{key:'scribe',hp:7600,r:38,dmg:38,spd:58,col:'#decda7'},
 firstRegent:{key:'regents',hp:4700,r:31,dmg:36,spd:82,col:'#ea9caf'},secondRegent:{key:'regents',hp:4700,r:31,dmg:34,spd:70,col:'#b86f84'},
 voidSeraph:{key:'seraph',hp:9400,r:40,dmg:43,spd:88,col:'#b1c0ff'},obsidianTyrant:{key:'tyrant',hp:11200,r:48,dmg:48,spd:46,col:'#ee8668'},firstKeeper:{key:'keeper',hp:14200,r:44,dmg:52,spd:72,col:'#f4c66f'}
};
for(const [type,o] of Object.entries(LATE_BOSSES))ETYPES[type]={hp:o.hp,spd:o.spd,dmg:o.dmg,r:o.r,xp:220,spr:type,ai:'lateBoss',col:o.col,ess:1,kb:0};
function makeLateBoss(type,x,y,name,role=''){
  const c=LATE_BOSSES[type],scale=1+Math.max(0,G.run.level-14)*.018,b=spawnEnemy(type,x,y,false),hp=Math.round(c.hp*scale);Object.assign(b,{lateBoss:true,bossKey:c.key,isBoss:true,name,hp,max:hp,r:c.r,dmg:c.dmg,spd:c.spd,xp:180+(G.floor-20)*4,col:c.col,kb:0,aggro:false,introduced:false,tier:Math.ceil(G.floor/5),phase:0,chargeT:0,cvx:0,cvy:0,summonT:99,teleT:0,t3:0,twinRole:role});
  b.bs={mode:'wait',kind:'',t:1.1,duration:1.1,a:Math.PI/2,step:0,second:false,hit:false,targetX:x,targetY:y};return b;
}
function spawnLateBoss(region){
  const r=G.world.exit,x=r.cx*TILE+18,y=(r.cy-2)*TILE+18;let b;
  if(region.key==='reservoir')b=makeLateBoss('bellkeeper',x,y,region.boss);
  else if(region.key==='foundry')b=makeLateBoss('emberColossus',x,y,region.boss);
  else if(region.key==='observatory')b=makeLateBoss('glassAstronomer',x,y,region.boss);
  else if(region.key==='archive')b=makeLateBoss('paleScribe',x,y,region.boss);
  else if(region.key==='court'){b=makeLateBoss('firstRegent',x-58,y,region.boss,'blade');makeLateBoss('secondRegent',x+58,y,region.boss,'bell');}
  else if(region.key==='choir')b=makeLateBoss('voidSeraph',x,y,region.boss);
  else if(region.key==='citadel')b=makeLateBoss('obsidianTyrant',x,y,region.boss);
  else b=makeLateBoss('firstKeeper',x,y,region.boss);
  G.boss=b;G.portal.active=false;return b;
}
const LATE_BOSS_SCENES={bellkeeper:['bellkeeperBefore','bellkeeperAfter'],colossus:['colossusBefore','colossusAfter'],astronomer:['astronomerBefore','astronomerAfter'],scribe:['scribeBefore','scribeAfter'],regents:['regentsBefore','regentsAfter'],seraph:['seraphBefore','seraphAfter'],tyrant:['tyrantBefore','tyrantAfter'],keeper:['keeperBefore','keeperAfter']};
function activateLateBoss(b){
  const same=G.enemies.filter(e=>e.lateBoss&&!e.dead&&e.bossKey===b.bossKey);for(const e of same){e.introduced=true;e.aggro=true;}G.boss=same[0]||b;G.bossActive=true;G.ebul=[];G.bullets=[];sealLateArena(true);chapterBannerT=0;T('chapterBanner').classList.remove('visible');T('bossname').textContent=b.name;T('bossbar').classList.add('on');sfx('boss');const scene=LATE_BOSS_SCENES[b.bossKey][0];if(!storyData().seen[scene])beginDialogue(scene);saveNow();
}
function bossHazard(type,x,y,a=0,delay=.7,life=.35,extra={}){G.world.lateHazards.push({type,x,y,a,t:delay,phase:'warn',activeT:life,boss:true,hit:false,...extra});}
function bossRingLate(b,count,speed,offset=0){for(let i=0;i<count;i++)lateShot(b,offset+i*TAU/count,speed,b.dmg*.62,b.col);}
function beginBossMove(b,kind,time){const s=b.bs;s.kind=kind;s.mode='windup';s.t=s.duration=time;s.hit=false;s.a=Math.atan2(G.player.y-b.y,G.player.x-b.x);s.targetX=G.player.x;s.targetY=G.player.y;}
function finishBossMove(b,time=.65){b.bs.mode='recover';b.bs.t=b.bs.duration=time;}
function bellkeeperAI(b,dt,d,dx,dy){
  const s=b.bs,p=G.player;if(s.mode==='windup'){s.t-=dt;if(s.t>.2){s.targetX=p.x;s.targetY=p.y;s.a=Math.atan2(p.y-b.y,p.x-b.x);}if(s.t>0)return;if(s.kind==='submerge'){s.mode='submerge';s.t=s.duration=.72;b.alpha=.2;bossHazard('ripple',s.targetX,s.targetY,0,.5,.3,{radius:52,color:b.col});}
    else if(s.kind==='bells'){for(let ring=0;ring<(s.second?2:1);ring++)setTimeout(()=>{if(!b.dead&&G.state==='playing')bossRingLate(b,s.second?16:12,180+ring*40,G.t+ring*.2);},ring*180);finishBossMove(b,.72);}
    else{bossHazard('wave',b.x,b.y,s.a,.2,.45,{len:560,width:14,color:b.col});finishBossMove(b,.58);}return;}
  if(s.mode==='submerge'){s.t-=dt;if(s.t<=0){const pos=safePosition(G.world,s.targetX,s.targetY,b.r);if(pos){b.x=pos.x;b.y=pos.y;}b.alpha=1;bossRingLate(b,s.second?14:10,210,G.t);finishBossMove(b,.6);}return;}
  if(s.mode==='recover'){s.t-=dt;if(s.t<=0){s.mode='wait';s.t=s.second?.18:.42;}return;}if(!s.second&&b.hp<b.max*.5){s.second=true;s.mode='shift';s.t=.9;burst(b.x,b.y,24,b.col,170,.7,3,true);return;}if(s.mode==='shift'){s.t-=dt;if(s.t<=0)finishBossMove(b,.28);return;}s.t-=dt;const side=Math.sin(G.t*1.2);moveEnt(G.world,b,(dx/d*.35-dy/d*side*.55)*b.spd*dt,(dy/d*.35+dx/d*side*.55)*b.spd*dt);if(s.t<=0){const list=s.second?['submerge','bells','wave','submerge','wave']:['submerge','wave','bells'];beginBossMove(b,list[s.step++%list.length],.68);}
}
function colossusAI(b,dt,d,dx,dy){
  const s=b.bs,p=G.player;if(s.mode==='windup'){s.t-=dt;if(s.t>.18){s.a=Math.atan2(p.y-b.y,p.x-b.x);s.targetX=p.x;s.targetY=p.y;}if(s.t>0)return;if(s.kind==='slam'){s.mode='slam';s.t=s.duration=.32;s.hit=false;}
    else if(s.kind==='vents'){for(const a of [-.48,-.24,0,.24,.48])lateShot(b,s.a+a,s.second?285:245,b.dmg*.68,b.col);finishBossMove(b,.85);}
    else{for(let i=0;i<(s.second?5:3);i++)bossHazard('vent',p.x+rand(-160,160),p.y+rand(-120,120),rand(0,TAU),.55+i*.08,.42,{len:190,width:18,color:b.col});s.mode='cool';s.t=s.duration=1.15;}return;}
  if(s.mode==='slam'){s.t-=dt;if(s.t<=0&&!s.hit){s.hit=true;bossRingLate(b,s.second?18:13,220,G.t);bossHazard('shell',b.x,b.y,0,.05,.25,{radius:78,color:b.col});G.cam.shake=.8;}if(s.t<=-.18)finishBossMove(b,.82);return;}
  if(s.mode==='cool'){s.t-=dt;if(s.t<=0)finishBossMove(b,.45);return;}if(s.mode==='recover'){s.t-=dt;if(s.t<=0){s.mode='wait';s.t=s.second?.2:.52;}return;}if(!s.second&&b.hp<b.max*.5){s.second=true;s.mode='shift';s.t=1;burst(b.x,b.y,26,b.col,180,.8,3,true);return;}if(s.mode==='shift'){s.t-=dt;if(s.t<=0)finishBossMove(b,.3);return;}s.t-=dt;if(d>170)moveEnt(G.world,b,dx/d*b.spd*dt,dy/d*b.spd*dt);if(s.t<=0){const list=s.second?['slam','vents','overheat','slam','vents']:['slam','vents','overheat'];beginBossMove(b,list[s.step++%list.length],.78);}
}
function astronomerAI(b,dt,d,dx,dy){
  const s=b.bs,p=G.player;if(s.mode==='windup'){s.t-=dt;if(s.t>.18)s.a=Math.atan2(p.y-b.y,p.x-b.x);if(s.t>0)return;if(s.kind==='beam'){bossHazard('beam',b.x,b.y,s.a,.18,s.second?.42:.32,{len:560,width:9,color:b.col});finishBossMove(b,.55);}
    else if(s.kind==='prism'){for(const a of [-.52,-.26,0,.26,.52])lateShot(b,s.a+a,s.second?300:265,b.dmg*.7,b.col);finishBossMove(b,.7);}
    else{bossRingLate(b,s.second?18:14,s.second?245:215,G.t*.5);finishBossMove(b,.62);}return;}
  if(s.mode==='recover'){s.t-=dt;if(s.t<=0){s.mode='wait';s.t=s.second?.18:.4;}return;}if(!s.second&&b.hp<b.max*.5){s.second=true;s.mode='shift';s.t=1;burst(b.x,b.y,24,b.col,180,.7,3,true);return;}if(s.mode==='shift'){s.t-=dt;if(s.t<=0)finishBossMove(b,.3);return;}
  s.t-=dt;const orbit=Math.sin(G.t*.7+b.seed),step=d>250?1:d<170?-1:0;moveEnt(G.world,b,(dx/d*step-dy/d*orbit*.4)*b.spd*dt,(dy/d*step+dx/d*orbit*.4)*b.spd*dt);if(s.t<=0){const k=(s.second?['beam','prism','beam','orbit']:['beam','prism','orbit'])[s.step++%(s.second?4:3)];beginBossMove(b,k,k==='beam'?.68:.56);}
}
function scribeAI(b,dt,d,dx,dy){
  const s=b.bs,p=G.player;if(s.mode==='windup'){s.t-=dt;if(s.t>.2)s.a=Math.atan2(p.y-b.y,p.x-b.x);if(s.t>0)return;if(s.kind==='script'){const n=s.second?4:3;for(let i=0;i<n;i++){const a=s.a+(i-(n-1)/2)*.42,bx=p.x+Math.cos(a+Math.PI/2)*(i-(n-1)/2)*34,by=p.y+Math.sin(a+Math.PI/2)*(i-(n-1)/2)*34;bossHazard('glyph',bx,by,a,.58,.38,{len:240,width:10,color:b.col});}finishBossMove(b,.72);}
    else if(s.kind==='quill'){s.mode='dash';s.t=s.duration=.5;s.a=Math.atan2(s.targetY-b.y,s.targetX-b.x);s.hit=false;}
    else{for(let i=0;i<(s.second?12:9);i++)if(i%3!==1)lateShot(b,i*TAU/(s.second?12:9)+G.t*.2,230,b.dmg*.65,b.col);finishBossMove(b,.65);}return;}
  if(s.mode==='dash'){s.t-=dt;const hit=moveEnt(G.world,b,Math.cos(s.a)*(s.second?560:490)*dt,Math.sin(s.a)*(s.second?560:490)*dt);if(!s.hit&&d2(b.x,b.y,p.x,p.y)<(b.r+p.r+8)**2){hurtPlayer(b.dmg,b.x,b.y);s.hit=true;}if(s.t<=0||hit)finishBossMove(b,.72);return;}
  if(s.mode==='recover'){s.t-=dt;if(s.t<=0){s.mode='wait';s.t=s.second?.16:.35;}return;}if(!s.second&&b.hp<b.max*.5){s.second=true;s.mode='shift';s.t=.9;burst(b.x,b.y,22,b.col,160,.7,3,true);return;}if(s.mode==='shift'){s.t-=dt;if(s.t<=0)finishBossMove(b,.3);return;}
  s.t-=dt;if(d>210)moveEnt(G.world,b,dx/d*b.spd*dt,dy/d*b.spd*dt);if(s.t<=0){const list=s.second?['script','quill','ring','script','quill']:['script','ring','quill'];beginBossMove(b,list[s.step++%list.length],.68);}
}
function regentAI(b,dt,d,dx,dy){
  const s=b.bs,p=G.player,other=G.enemies.find(e=>e.lateBoss&&e.bossKey==='regents'&&e!==b&&!e.dead);s.second=!other;
  if(s.mode==='windup'){s.t-=dt;if(s.t>.15)s.a=Math.atan2(p.y-b.y,p.x-b.x);if(s.t>0)return;if(b.twinRole==='blade'){s.mode='dash';s.t=s.duration=s.second?.58:.42;s.hit=false;}else{const count=s.second?11:7;for(let i=0;i<count;i++)lateShot(b,s.a+(i-(count-1)/2)*.14,250,b.dmg*.68,b.col);finishBossMove(b,s.second?.45:.72);}return;}
  if(s.mode==='dash'){s.t-=dt;const hit=moveEnt(G.world,b,Math.cos(s.a)*(s.second?600:500)*dt,Math.sin(s.a)*(s.second?600:500)*dt);if(!s.hit&&d2(b.x,b.y,p.x,p.y)<(b.r+p.r+10)**2){hurtPlayer(b.dmg*(s.second?1.15:1),b.x,b.y);s.hit=true;}if(s.t<=0||hit){if(s.second)bossRingLate(b,8,200,G.t);finishBossMove(b,.55);}return;}
  if(s.mode==='recover'){s.t-=dt;if(s.t<=0){s.mode='wait';s.t=s.second?.14:.4;}return;}s.t-=dt;const side=b.twinRole==='blade'?1:-1,step=d>180?1:d<120?-.4:0;moveEnt(G.world,b,(dx/d*step-dy/d*side*.35)*b.spd*dt,(dy/d*step+dx/d*side*.35)*b.spd*dt);if(s.t<=0)beginBossMove(b,b.twinRole,.58);
}
function seraphAI(b,dt,d,dx,dy){
  const s=b.bs,p=G.player;if(s.mode==='windup'){s.t-=dt;if(s.t>.2){s.targetX=p.x;s.targetY=p.y;s.a=Math.atan2(p.y-b.y,p.x-b.x);}if(s.t>0)return;if(s.kind==='dive'){s.mode='dive';s.t=s.duration=.48;s.hit=false;}
    else{const count=s.second?7:5;for(const side of [-1,1])for(let i=0;i<count;i++)lateShot(b,s.a+side*(.2+i*.12),290-i*8,b.dmg*.64,b.col);finishBossMove(b,.58);}return;}
  if(s.mode==='dive'){s.t-=dt;const a=Math.atan2(s.targetY-b.y,s.targetX-b.x),hit=moveEnt(G.world,b,Math.cos(a)*(s.second?680:590)*dt,Math.sin(a)*(s.second?680:590)*dt);if(!s.hit&&d2(b.x,b.y,p.x,p.y)<(b.r+p.r+12)**2){hurtPlayer(b.dmg*1.1,b.x,b.y);s.hit=true;}if(s.t<=0||hit){bossRingLate(b,s.second?12:8,205,G.t);finishBossMove(b,.65);}return;}
  if(s.mode==='recover'){s.t-=dt;if(s.t<=0){s.mode='wait';s.t=s.second?.12:.32;}return;}if(!s.second&&b.hp<b.max*.5){s.second=true;s.mode='shift';s.t=.85;return;}if(s.mode==='shift'){s.t-=dt;if(s.t<=0)finishBossMove(b,.25);return;}s.t-=dt;const sway=Math.sin(G.t*1.8);moveEnt(G.world,b,(dx/d*.3-dy/d*sway*.7)*b.spd*dt,(dy/d*.3+dx/d*sway*.7)*b.spd*dt);if(s.t<=0)beginBossMove(b,(s.step++%3===0?'dive':'wings'),s.second?.48:.65);
}
function tyrantAI(b,dt,d,dx,dy){
  const s=b.bs,p=G.player;if(s.mode==='windup'){s.t-=dt;if(s.t>.2){s.a=Math.atan2(p.y-b.y,p.x-b.x);s.targetX=p.x;s.targetY=p.y;}if(s.t>0)return;if(s.kind==='siege'){const n=s.second?5:3;for(let i=0;i<n;i++)bossHazard('shell',p.x+rand(-150,150),p.y+rand(-110,110),0,.62+i*.1,.25,{radius:38,color:b.col});finishBossMove(b,.9);}
    else if(s.kind==='wall'){s.mode='barrier';s.t=s.duration=s.second?1.25:1.6;bossRingLate(b,s.second?14:10,170,G.t);}
    else{s.mode='ram';s.t=s.duration=.62;s.hit=false;}return;}
  if(s.mode==='ram'){s.t-=dt;const hit=moveEnt(G.world,b,Math.cos(s.a)*(s.second?490:410)*dt,Math.sin(s.a)*(s.second?490:410)*dt);if(!s.hit&&d2(b.x,b.y,p.x,p.y)<(b.r+p.r+12)**2){hurtPlayer(b.dmg,b.x,b.y);s.hit=true;}if(s.t<=0||hit)finishBossMove(b,.95);return;}
  if(s.mode==='barrier'){s.t-=dt;if(s.t<=0)finishBossMove(b,.55);return;}if(s.mode==='recover'){s.t-=dt;if(s.t<=0){s.mode='wait';s.t=s.second?.2:.5;}return;}if(!s.second&&b.hp<b.max*.5){s.second=true;s.mode='shift';s.t=1;return;}if(s.mode==='shift'){s.t-=dt;if(s.t<=0)finishBossMove(b,.3);return;}s.t-=dt;if(d>175)moveEnt(G.world,b,dx/d*b.spd*dt,dy/d*b.spd*dt);if(s.t<=0){const list=s.second?['siege','ram','wall','siege','ram']:['siege','wall','ram'];beginBossMove(b,list[s.step++%list.length],.78);}
}
function keeperAI(b,dt,d,dx,dy){
  const s=b.bs,p=G.player;if(s.mode==='windup'){s.t-=dt;if(s.t>.18){s.a=Math.atan2(p.y-b.y,p.x-b.x);s.targetX=p.x;s.targetY=p.y;}if(s.t>0)return;
    if(s.kind==='beam'){for(const off of (s.second?[-.28,0,.28]:[0]))bossHazard('beam',b.x,b.y,s.a+off,.16,.38,{len:620,width:10,color:b.col});finishBossMove(b,.5);}
    else if(s.kind==='glyph'){for(let i=-1;i<=1;i++)bossHazard('glyph',p.x+i*50,p.y-i*35,s.a+i*.5,.48,.36,{len:260,width:11,color:b.col});finishBossMove(b,.6);}
    else if(s.kind==='dive'){s.mode='dive';s.t=s.duration=.5;s.hit=false;}
    else if(s.kind==='siege'){for(let i=0;i<(s.second?6:4);i++)bossHazard('rift',p.x+rand(-170,170),p.y+rand(-130,130),rand(0,TAU),.5+i*.08,.4,{radius:42,color:b.col});finishBossMove(b,.75);}
    else{bossRingLate(b,s.second?22:16,s.second?275:235,G.t*.3);finishBossMove(b,.55);}return;}
  if(s.mode==='dive'){s.t-=dt;const a=Math.atan2(s.targetY-b.y,s.targetX-b.x),hit=moveEnt(G.world,b,Math.cos(a)*(s.second?720:630)*dt,Math.sin(a)*(s.second?720:630)*dt);if(!s.hit&&d2(b.x,b.y,p.x,p.y)<(b.r+p.r+14)**2){hurtPlayer(b.dmg,b.x,b.y);s.hit=true;}if(s.t<=0||hit)finishBossMove(b,.62);return;}
  if(s.mode==='recover'){s.t-=dt;if(s.t<=0){s.mode='wait';s.t=s.second?.1:.28;}return;}if(!s.second&&b.hp<b.max*.5){s.second=true;s.mode='shift';s.t=1.1;G.ebul=[];burst(b.x,b.y,30,b.col,230,.8,3,true);return;}if(s.mode==='shift'){s.t-=dt;if(s.t<=0)finishBossMove(b,.2);return;}s.t-=dt;const sway=Math.sin(G.t*.9);moveEnt(G.world,b,(dx/d*.45-dy/d*sway*.35)*b.spd*dt,(dy/d*.45+dx/d*sway*.35)*b.spd*dt);if(s.t<=0){const list=s.second?['beam','glyph','dive','siege','ring','beam']:['beam','ring','glyph','dive','siege'];beginBossMove(b,list[s.step++%list.length],s.second?.48:.65);}
}
function lateBossAI(b,dt,d,dx,dy){if(!b.introduced)return;musicInt=1;({bellkeeper:bellkeeperAI,colossus:colossusAI,astronomer:astronomerAI,scribe:scribeAI,regents:regentAI,seraph:seraphAI,tyrant:tyrantAI,keeper:keeperAI}[b.bossKey]||keeperAI)(b,dt,d,dx,dy);}

const beforeLateKillBoss=killBoss;
killBoss=function(b){
  if(!b.lateBoss){beforeLateKillBoss(b);return;}
  if(b.bossKey==='regents'){const other=G.enemies.find(e=>e.lateBoss&&e.bossKey==='regents'&&e!==b&&!e.dead);if(other){G.boss=other;G.bossActive=true;other.bs.second=true;other.hp=Math.min(other.max,other.hp+Math.round(other.max*.18));T('bossname').textContent='THE LAST REGENT';toast('ONE THRONE REMAINS','the survivor changes the pattern');sfx('roar2');saveNow();return;}}
  beforeLateKillBoss(b);sealLateArena(false);G.world.lateCleared=true;G.player.hitCd=2;G.ebul=[];saveNow();
};
