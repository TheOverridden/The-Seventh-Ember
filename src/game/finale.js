const DEPTH_REVISION=12;
const ENDGAME_HP={bellkeeper:5100,colossus:8200,astronomer:11200,scribe:14500,regents:12000,seraph:26500,tyrant:90000,keeper:160000};
const ENDGAME_DAMAGE={bellkeeper:29,colossus:35,astronomer:39,scribe:44,regents:44,seraph:55,tyrant:63,keeper:72};
function depthCycle(){return G.run?.infinite?Math.floor((G.floor-51)/40)+1:0;}
function authoredDepth(){return G.floor>50?11+(G.floor-51)%40:G.floor;}
function depthHealth(f){const d=Math.max(0,f-11);return 1+d*.05+d*d*.00105;}
const depthSpawn=spawnEnemy;
spawnEnemy=function(type,x,y,elite){const e=depthSpawn(type,x,y,elite),c=LATE_ENEMIES[type];if(c){const f=authoredDepth(),d=Math.max(0,f-11),cycle=depthCycle();e.hp=e.max=Math.round(c.hp*depthHealth(f)*(elite?1.7:1)*Math.pow(1.5,cycle));e.dmg=Math.round(c.dmg*(1+d*.029)*Math.pow(1.18,cycle));e.spd=c.spd*(1+Math.min(.25,d*.006)+Math.min(.2,cycle*.025));e.xp=Math.round(c.xp*.78*(elite?1.6:1));e.depthRevision=DEPTH_REVISION;}return e;};
const depthBoss=makeLateBoss;
makeLateBoss=function(type,x,y,name,role){const b=depthBoss(type,x,y,name,role),cycle=depthCycle();b.hp=b.max=Math.round(ENDGAME_HP[b.bossKey]*Math.pow(1.65,cycle));b.dmg=Math.round(ENDGAME_DAMAGE[b.bossKey]*Math.pow(1.2,cycle));b.depthRevision=DEPTH_REVISION;b.bs.phase=0;b.bs.cycle=0;b.bs.events=[];b.bs.history=[];b.bs.mechanismCd=0;return b;};
const depthFire=fireVolley;
fireVolley=function(){const start=G.bullets.length;depthFire();const shots=G.bullets.slice(start);if(shots.some(b=>b.whiteStar))shots[0].whiteStar=true;for(let i=1;i<shots.length;i++){shots[i].dmg*=.68;shots[i].whiteStar=false;}};
const depthRecalc=recalc;
recalc=function(){depthRecalc();if(!G.player||!G.run)return;G.player.regen=.35*(G.run.up.regen||0)+(META.regen||0);G.player.speed=BASE.speed*(META.speed+.07*(G.run.up.speed||0));};
for(const id of ['regen','speed','proj']){const c=POOL.find(o=>o.id===id);if(c)c.ds=id==='regen'?'Restore 0.35 health each second':id==='speed'?'+7% movement speed':'Additional Ember Bolt · extra bolts deal 68% damage';}
const DEPTH_COSTS=[10,25,60,140,300,600,1200,2200,4000,7000,11000,16000];
for(const b of MASTERY_BRANCHES)for(let i=0;i<b.ids.length;i++){const n=NODE_BY_ID[b.ids[i]];if(n)n.cost=DEPTH_COSTS[i];}
MASTERY_COSTS.splice(0,MASTERY_COSTS.length,...DEPTH_COSTS);MASTERY_TOTAL=TREE_NODES.reduce((sum,n)=>sum+n.cost,0);
for(const n of TREE_NODES){if(n.fx?.dmg){n.fx.dmg=Math.round(n.fx.dmg*150)/100;n.desc=n.desc.replace(/\+\d+% damage/,'+'+Math.round(n.fx.dmg*100)+'% damage');}if(n.fx?.hp){n.fx.hp=Math.round(n.fx.hp*1.25);n.desc=n.desc.replace(/\+\d+ maximum health/,'+'+n.fx.hp+' maximum health');}if(n.fx?.armor){n.fx.armor*=2;n.desc=n.desc.replace(/\d+% less damage/,Math.round(n.fx.armor*100)+'% less damage');}}
const depthTreeSelect=selectNode;
selectNode=function(n){depthTreeSelect(n);const el=T('metaTotal');el.innerHTML=el.innerHTML.replace(/Typical full clear:[^<]+/,'Later floors reward developed branches. Capstones add new ways to fight.');};

ETYPES.bossMechanism={hp:160,spd:0,dmg:0,r:20,xp:0,spr:'bossMechanism',ai:'late',col:'#dfc38c',ess:0,kb:0};
function arenaBounds(){const r=G.world.exit;return{left:(r.x+1)*TILE+12,right:(r.x+r.w-1)*TILE-12,top:(r.y+1)*TILE+12,bottom:(r.y+r.h-1)*TILE-12,cx:r.cx*TILE+18,cy:r.cy*TILE+18};}
function bossNodes(b){return G.enemies.filter(e=>!e.dead&&e.mechanism&&e.ownerUid===b.uid);}
function placeMechanisms(b,kind,count){const a=arenaBounds(),radius=Math.max(70,Math.min(a.right-a.left,a.bottom-a.top)*.29);for(let i=0;i<count;i++){const ang=i*TAU/count+(b.bs.cycle||0)*.55+(kind==='bastion'?.85:0),p=safePosition(G.world,a.cx+Math.cos(ang)*radius,a.cy+Math.sin(ang)*radius,21);if(!p||d2(p.x,p.y,G.player.x,G.player.y)<55**2||G.enemies.some(e=>e.mechanism&&!e.dead&&d2(e.x,e.y,p.x,p.y)<64**2))continue;const e=spawnEnemy('bossMechanism',p.x,p.y,false);Object.assign(e,{mechanism:kind,ownerUid:b.uid,hp:130+authoredDepth()*5,max:130+authoredDepth()*5,aggro:true,col:b.col,solid:kind==='bastion',attackClock:2+i*.7,life:40,phase:0});}}
const depthKill=killEnemy;
killEnemy=function(e){if(e.mechanism){if(e.dead)return;e.dead=true;burst(e.x,e.y,18,e.col,150,.6,3,true);sfx('break');const owner=G.enemies.find(b=>b.uid===e.ownerUid);if(owner&&bossNodes(owner).length===0){owner.bs.exposed=5;owner.bs.mechanismCd=22;fieldNote('The core is open.',2.3);}return;}depthKill(e);};
const depthDamage=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
 if(!e||e.dead)return;
 if(e.mechanism){if(kind==='melee'||kind==='meleeWave')dmg*=1.7;depthDamage(e,dmg,ang,crit,kb,kind);return;}
 if(e.lateBoss&&e.bossKey==='bellkeeper'&&e.bs.mode==='submerge')return;
 if(e.lateBoss&&e.bossKey!=='bellkeeper'){
  const s=e.bs,n=bossNodes(e).length;
  if(n&&(e.bossKey==='colossus'||e.bossKey==='tyrant'||e.bossKey==='keeper'))dmg*=.42;
  if(s.exposed>0)dmg*=kind==='melee'||kind==='meleeWave'?1.65:1.18;
  if(e.bossKey==='seraph'&&s.airborne)dmg*=kind==='melee'?.2:.6;
  if(e.bossKey==='regents'){const other=G.enemies.find(o=>o!==e&&!o.dead&&o.bossKey==='regents');if(other&&d2(e.x,e.y,other.x,other.y)<140**2)dmg*=.55;}
 }
 depthDamage(e,dmg,ang,crit,kb,kind);
};
const depthMove=moveEnt;
moveEnt=function(w,e,dx,dy){const ox=e.x,oy=e.y,result=depthMove(w,e,dx,dy);if(!e.mechanism&&G.bossActive){for(const n of G.enemies){if(n.dead||!n.solid||n===e)continue;const rr=e.r+n.r;if(d2(e.x,e.y,n.x,n.y)<rr*rr&&d2(e.x,e.y,n.x,n.y)<d2(ox,oy,n.x,n.y)){e.x=ox;e.y=oy;return true;}}}return result;};
const depthLateAI=lateEnemyAI;
lateEnemyAI=function(e,dt,d,dx,dy){if(!e.mechanism){depthLateAI(e,dt,d,dx,dy);return;}const b=G.enemies.find(o=>o.uid===e.ownerUid&&!o.dead);if(!b){e.dead=true;return;}e.life-=dt;if(e.life<=0){killEnemy(e);return;}e.attackClock-=dt;e.phase+=dt;if(e.attackClock<=0){e.attackClock=e.mechanism==='siege'?3.4:4.8;const a=Math.atan2(G.player.y-e.y,G.player.x-e.x);if(e.mechanism==='lens')encounterHazard(b,'sweep',e.x,e.y,a,{delay:.85,life:1.1,len:360,turn:.5,width:7});else if(e.mechanism==='siege')encounterHazard(b,'shell',G.player.x,G.player.y,0,{delay:.95,life:.35,radius:37});else if(e.mechanism==='seal')encounterHazard(b,'glyph',e.x,e.y,a,{delay:.8,life:.55,len:240,width:8});}};

function encounterHazard(b,type,x,y,a,opts={}){const h={type,x,y,a,phase:'warn',t:opts.delay??.8,delay:opts.delay??.8,activeT:opts.life??.65,age:0,boss:true,authored:true,ownerUid:b.uid,color:b.col,damage:Math.round(b.dmg*(opts.damageMul??.65)),hitCd:0,...opts};G.world.lateHazards.push(h);return h;}
function scheduleBoss(b,after,kind,data={}){b.bs.events.push({after,kind,...data});}
function executeBossEvent(b,event){
 const p=G.player,a=arenaBounds(),s=b.bs,angle=Math.atan2(p.y-b.y,p.x-b.x),speed=280+authoredDepth()*1.3;
 if(event.kind==='fan'){const aim=event.a??angle,n=event.n||7;for(let i=0;i<n;i++)lateShot(b,aim+(i-(n-1)/2)*.14,speed,b.dmg*.6,b.col);}
 if(event.kind==='ring'){const gap=event.a??angle,n=event.n||20;for(let i=0;i<n;i++){const q=i*TAU/n;if(Math.abs(angleDiff(q,gap))<.34)continue;lateShot(b,q,speed*.8,b.dmg*.6,b.col);}}
 if(event.kind==='cut'){encounterHazard(b,'sweep',event.x??b.x,event.y??b.y,event.a??angle,{delay:.7,life:1.1,len:Math.hypot(a.right-a.left,a.bottom-a.top),turn:event.turn??.85,width:9});}
 if(event.kind==='rotor'){encounterHazard(b,'rotor',b.x,b.y,event.a??angle,{delay:event.delay??.82,life:event.life??5,len:Math.hypot(a.right-a.left,a.bottom-a.top),turn:event.turn??1,arms:event.arms??2,width:event.width??8,damageMul:event.damageMul??.7,followOwner:true});}
 if(event.kind==='charge'){s.a=event.a??angle;s.lungeLeft=event.time??.58;s.lungeSpeed=event.speed??560;s.hit=false;}
 if(event.kind==='trail'){for(const pos of (s.history||[]).filter((_,i)=>i%3===0).slice(-6))encounterHazard(b,'glyph',pos.x,pos.y,pos.a||0,{delay:.85,life:1.7,len:62,width:9});}
 if(event.kind==='impact')encounterHazard(b,'annulus',event.x??b.x,event.y??b.y,0,{delay:.65,life:1.5,radius:20,expand:180,width:13});
 if(event.kind==='lanes'){const vertical=event.vertical??(s.cycle%2===0),span=vertical?a.right-a.left:a.bottom-a.top,step=span/5,gap=event.gap??(s.cycle%5);for(let i=0;i<5;i++){if(i===gap)continue;encounterHazard(b,'glyph',vertical?a.left+step*(i+.5):a.left,vertical?a.top:a.top+step*(i+.5),vertical?Math.PI/2:0,{delay:1.15,life:1.8,len:vertical?a.bottom-a.top:a.right-a.left,width:Math.min(19,step*.22)});}}
}
function encounterAttack(b){
 const s=b.bs,a=arenaBounds(),p=G.player,angle=Math.atan2(p.y-b.y,p.x-b.x),phase=s.phase||0,k=b.bossKey;s.cycle++;s.events=[];s.mode='windup';s.t=s.duration=.8;s.a=angle;s.targetX=p.x;s.targetY=p.y;
 const move=s.cycle%3;
 if(k==='colossus'){
  s.kind=['hammer','furnace','slag'][move];
  if(move===0){scheduleBoss(b,.7,'impact');scheduleBoss(b,1.6,'cut',{a:angle-1.2,turn:1.1});}
  if(move===1){scheduleBoss(b,.3,'lanes');if(phase)scheduleBoss(b,2.7,'lanes',{vertical:s.cycle%2!==0,gap:(s.cycle+2)%5});}
  if(move===2){scheduleBoss(b,.7,'fan',{a:angle,n:9});scheduleBoss(b,1.8,'impact',{x:p.x,y:p.y});}
  s.total=phase?4.8:4.3;
 }else if(k==='astronomer'){
  s.kind=['refraction','parallax','orbit'][move];
  if(move===0){for(const n of bossNodes(b)){encounterHazard(b,'glyph',b.x,b.y,Math.atan2(n.y-b.y,n.x-b.x),{delay:.9,life:1.2,len:Math.hypot(n.x-b.x,n.y-b.y),width:6});scheduleBoss(b,.2,'cut',{x:n.x,y:n.y,a:Math.atan2(p.y-n.y,p.x-n.x)-.35,turn:.55});}if(!bossNodes(b).length)scheduleBoss(b,.3,'cut',{a:angle-.4});}
  if(move===1){scheduleBoss(b,.3,'lanes');scheduleBoss(b,2,'fan',{a:angle,n:5});}
  if(move===2){scheduleBoss(b,.6,'ring',{a:angle});scheduleBoss(b,1.6,'ring',{a:angle+Math.PI});}
  s.total=4.2;
 }else if(k==='scribe'){
  s.kind=['redaction','quill','rewrite'][move];
  if(move===0){scheduleBoss(b,.4,'trail');scheduleBoss(b,2,'cut',{a:angle-1,turn:.9});}
  if(move===1){s.lungeAt=.8;s.lungeLeft=.5;s.lungeSpeed=560; scheduleBoss(b,1.5,'trail');}
  if(move===2){scheduleBoss(b,.2,'lanes');scheduleBoss(b,2.1,'ring',{a:angle,n:18});}
  s.total=4.3;
 }else if(k==='regents'){
  const blade=b.twinRole==='blade',other=G.enemies.find(o=>o!==b&&o.bossKey==='regents'&&!o.dead);s.kind=blade?'crosscut':'decree';
  if(blade){s.lungeAt=.8;s.lungeLeft=.5;s.lungeSpeed=phase?650:540;s.a=angle;scheduleBoss(b,1.6,'cut',{a:angle-1.2,turn:1.2});}
  else{scheduleBoss(b,.25,'cut',{a:angle+.45,turn:-.8});scheduleBoss(b,1.8,'fan',{a:angle,n:7});}
  if(!other){scheduleBoss(b,2.6,'ring',{a:angle+Math.PI});s.total=4.1;}else s.total=4.6;
 }else if(k==='seraph'){
  const smove=phase?s.cycle%4:move;s.kind=['plunge','crosswind','feathers','corona'][smove];
  if(smove===0){s.lungeAt=.72;s.lungeLeft=.62;s.lungeSpeed=phase?790:700;scheduleBoss(b,1.35,'impact',{x:p.x,y:p.y});if(phase)scheduleBoss(b,2.5,'ring',{a:angle+Math.PI,n:18});}
  if(smove===1){scheduleBoss(b,.08,'lanes');scheduleBoss(b,1.75,'cut',{a:angle-1.15,turn:1.38});if(phase)scheduleBoss(b,3.05,'cut',{a:angle+1.05,turn:-1.25});}
  if(smove===2){scheduleBoss(b,.35,'fan',{a:angle-.46,n:7});scheduleBoss(b,1.15,'fan',{a:angle+.46,n:7});scheduleBoss(b,2.05,'ring',{a:angle+Math.PI,n:22});}
  if(smove===3){scheduleBoss(b,.08,'rotor',{a:angle-.55,turn:s.cycle%2?1.02:-1.02,arms:2,life:5.05,width:8,damageMul:.72});scheduleBoss(b,2.25,'ring',{a:angle,n:18});}
  s.total=smove===3?6.3:phase?4.25:4.5;
 }else if(k==='tyrant'){
  const tmove=phase?s.cycle%4:move;s.kind=['bombard','advance','lockdown','citadel'][tmove];
  if(tmove===0){for(let i=0;i<4+phase*2;i++){const x=clamp(p.x+(p.vigilVX||0)*(.25+i*.22),a.left+30,a.right-30),y=clamp(p.y+(p.vigilVY||0)*(.25+i*.22),a.top+30,a.bottom-30);encounterHazard(b,'shell',x,y,0,{delay:.65+i*.4,life:.42,radius:36+phase*3,damageMul:.7});}if(phase)scheduleBoss(b,2.4,'fan',{a:angle,n:9});}
  if(tmove===1){s.lungeAt=.72;s.lungeLeft=.72;s.lungeSpeed=phase?500:430;scheduleBoss(b,1.45,'impact');if(phase){scheduleBoss(b,2.35,'charge',{time:.64,speed:540});scheduleBoss(b,3.1,'impact');}}
  if(tmove===2){scheduleBoss(b,.08,'lanes');scheduleBoss(b,1.65,'cut',{a:angle-1.15,turn:1.05});scheduleBoss(b,3.05,'cut',{a:angle+1.1,turn:-1.05});}
  if(tmove===3){scheduleBoss(b,.25,'ring',{a:angle,n:24});scheduleBoss(b,1.2,'lanes',{vertical:s.cycle%2!==0,gap:(s.cycle+2)%5});scheduleBoss(b,3,'impact',{x:p.x,y:p.y});}
  s.total=tmove===3?5.4:phase?5.05:4.9;
 }else{
  const kmove=phase?s.cycle%4:move;s.kind=['memory','fracture','lastLight','finalOrbit'][kmove];
  if(kmove===0){scheduleBoss(b,.18,'trail');scheduleBoss(b,1.45,'ring',{a:angle,n:phase?24:20});if(phase)scheduleBoss(b,2.65,'cut',{a:angle-.9,turn:phase>1?1.35:1.05});if(phase>1)scheduleBoss(b,3.75,'ring',{a:angle+Math.PI,n:26});}
  if(kmove===1){scheduleBoss(b,.08,'lanes');s.lungeAt=phase?1.55:2.1;s.lungeLeft=.58;s.lungeSpeed=phase>1?760:650;if(phase)scheduleBoss(b,2.45,'lanes',{vertical:s.cycle%2!==0,gap:(s.cycle+2)%5});}
  if(kmove===2){scheduleBoss(b,.08,'cut',{a:angle-1.25,turn:phase>1?1.55:1.25});scheduleBoss(b,1.65,'impact',{x:p.x,y:p.y});if(phase){scheduleBoss(b,2.65,'ring',{a:angle+Math.PI,n:24});scheduleBoss(b,3.55,'fan',{a:angle,n:7});}}
  if(kmove===3){const final=phase>1;scheduleBoss(b,.06,'rotor',{a:angle-.45,turn:(s.cycle%2?1:-1)*(final?.72:.92),arms:final?3:2,life:final?6.25:5.15,width:final?9:8,damageMul:final?.72:.66});scheduleBoss(b,2.2,'fan',{a:angle,n:5});if(final)scheduleBoss(b,4.25,'fan',{a:angle+Math.PI,n:7});}
  s.total=kmove===3?(phase>1?7.05:6.2):phase>1?5.45:phase?5.05:4.6;
 }
 if(phase&&k==='astronomer')scheduleBoss(b,2.7,'ring',{a:angle+Math.PI,n:18});
 if(phase&&k==='scribe'&&move===1)scheduleBoss(b,2.7,'trail');
 if(phase&&k==='seraph'&&s.kind==='plunge')scheduleBoss(b,2.5,'cut',{a:angle+.9,turn:-1});
 if(k==='keeper'&&phase===2)scheduleBoss(b,3.7,'impact');
 s.elapsed=0;s.hit=false;
}
function authoredBossAI(b,dt,d,dx,dy){
 if(!b.introduced)return;const s=b.bs,p=G.player,a=arenaBounds();s.events=s.events||[];s.history=s.history||[];s.sample=(s.sample||0)-dt;s.exposed=Math.max(0,(s.exposed||0)-dt);s.mechanismCd=Math.max(0,(s.mechanismCd||0)-dt);
 if(s.sample<=0){s.sample=.18;s.history.push({x:p.x,y:p.y,a:Math.atan2(p.vigilVY||0,p.vigilVX||1)});if(s.history.length>24)s.history.shift();}
 const other=b.bossKey==='regents'&&G.enemies.find(e=>e!==b&&!e.dead&&e.bossKey==='regents');const phase=b.bossKey==='keeper'?(b.hp/b.max<=.30?2:b.hp/b.max<=.68?1:0):b.bossKey==='regents'?(!other?1:0):(b.hp/b.max<=.5?1:0);
 if(phase>(s.phase||0)){s.phase=phase;s.second=true;s.mode='shift';s.t=1.5;s.events=[];s.lungeLeft=0;s.total=0;G.world.lateHazards=G.world.lateHazards.filter(h=>h.ownerUid!==b.uid);G.ebul=[];burst(b.x,b.y,30,b.col,180,.9,3,true);sfx('roar2');if(b.bossKey==='keeper'){for(const e of bossNodes(b))e.dead=true;s.mechanismCd=99999;fieldNote(phase===1?'The cradle turns.':'The last lock breaks.',3);}return;}
 if(s.mode==='shift'){s.t-=dt;if(s.t<=0){s.mode='recover';s.t=1;s.exposed=2;}return;}
 const mechanism={colossus:'vent',astronomer:'lens',scribe:'seal',tyrant:'siege',keeper:'anchor'}[b.bossKey];
 if(mechanism&&!bossNodes(b).length&&s.mechanismCd<=0&&!(b.bossKey==='keeper'&&phase>0)){placeMechanisms(b,mechanism,b.bossKey==='tyrant'?2+phase:b.bossKey==='keeper'?3:2);if(b.bossKey==='tyrant')placeMechanisms(b,'bastion',2);s.mechanismCd=24;}
 if(!s.total){s.t-=dt;const side=b.twinRole==='blade'?1:-1;const step=d>190?1:d<100?-.4:0;moveEnt(G.world,b,(dx/Math.max(1,d)*step-dy/Math.max(1,d)*(b.bossKey==='regents'?.6*side:.1))*b.spd*dt,(dy/Math.max(1,d)*step+dx/Math.max(1,d)*(b.bossKey==='regents'?.6*side:.1))*b.spd*dt);if(s.t<=0)encounterAttack(b);return;}
 s.elapsed+=dt;s.t=Math.max(0,s.duration-s.elapsed);s.mode=s.elapsed<.8?'windup':s.elapsed>s.total-1?'recover':'wait';s.airborne=b.bossKey==='seraph'&&s.elapsed<s.total-1.3&&!(s.lungeLeft>0&&s.elapsed>=s.lungeAt);
 for(let i=s.events.length-1;i>=0;i--){const ev=s.events[i];ev.after-=dt;if(ev.after<=0){s.events.splice(i,1);executeBossEvent(b,ev);}}
 if(s.lungeLeft>0&&s.elapsed>=s.lungeAt){s.mode='dash';s.lungeLeft-=dt;const hit=moveEnt(G.world,b,Math.cos(s.a)*s.lungeSpeed*dt,Math.sin(s.a)*s.lungeSpeed*dt);if(!s.hit&&d2(b.x,b.y,p.x,p.y)<(b.r+p.r+5)**2){hurtPlayer(b.dmg,b.x,b.y);s.hit=true;}if(hit||s.lungeLeft<=0){s.lungeLeft=0;s.exposed=Math.max(s.exposed,1.7);}}
 if(s.elapsed>=s.total){s.total=0;s.mode='recover';s.t=phase?.95:1.25;s.exposed=Math.max(s.exposed,s.t);}
}
colossusAI=astronomerAI=scribeAI=regentAI=seraphAI=tyrantAI=keeperAI=authoredBossAI;
const depthFirstDamage=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){if(e?.warden&&kind==='melee'&&e.wb.mode==='windup'&&e.wb.kind!=='stars'&&e.wb.t<.24&&d2(e.x,e.y,G.player.x,G.player.y)<120**2){e.wb.mode='recover';e.wb.t=1.6;e.wb.followup=false;e.wb.parries=(e.wb.parries||0)+1;G.player.hitCd=Math.max(G.player.hitCd,.25);burst(e.x,e.y,16,'#ffe1a0',160,.4,2,true);fieldNote('His guard breaks.',1.8);dmg*=1.4;}depthFirstDamage(e,dmg,ang,crit,kb,kind);};
const depthMatriarch=matriarchAI;
matriarchAI=function(b,dt,d,dx,dy){const s=b.ms;if(b.introduced&&b.hp<b.max*.25&&!s.uprooted){s.uprooted=true;s.mode='bloom';s.t=s.duration=1.25;for(const e of G.enemies)if(e.owner===b.uid&&e.type==='gardenNest')e.dead=true;fieldNote('She tears free of the roots.',2.5);burst(b.x,b.y,28,'#c594a8',150,.7,3,true);}depthMatriarch(b,dt,d,dx,dy);if(s.uprooted&&s.mode==='wait'&&d>150)moveEnt(G.world,b,dx/Math.max(1,d)*27*dt,dy/Math.max(1,d)*27*dt);if(s.uprooted&&s.mode==='windup'&&s.kind==='plant'){s.kind='lash';s.t=Math.min(s.t,.58);}};
bellkeeperAI=function(b,dt,d,dx,dy){if(!b.introduced)return;const s=b.bs,p=G.player;s.phase=b.hp<b.max*.5?1:0;s.second=!!s.phase;s.mechanismCd=Math.max(0,(s.mechanismCd||0)-dt);s.exposed=Math.max(0,(s.exposed||0)-dt);if(!bossNodes(b).length&&s.mechanismCd<=0){placeMechanisms(b,'bell',2);s.mechanismCd=25;}s.t-=dt;
 if(s.mode==='submerge'){b.alpha=.16;if(s.t<=0){const pos=safePosition(G.world,s.targetX,s.targetY,b.r);if(pos){b.x=pos.x;b.y=pos.y;}b.alpha=1;encounterHazard(b,'annulus',b.x,b.y,0,{delay:.4,life:1.8,radius:24,expand:160,width:11});s.mode='recover';s.t=1.8;s.exposed=2;}return;}
 if(s.mode==='recover'){if(s.t<=0){s.mode='wait';s.t=.65;}return;}
 if(s.mode==='windup'){if(s.t>0)return;if(s.kind==='submerge'){s.mode='submerge';s.t=1.25;const a=arenaBounds();s.targetX=clamp(p.x+(p.vigilVX||0)*.5,a.left+40,a.right-40);s.targetY=clamp(p.y+(p.vigilVY||0)*.5,a.top+40,a.bottom-40);encounterHazard(b,'shell',s.targetX,s.targetY,0,{delay:1.25,life:.3,radius:35});}else{const nodes=bossNodes(b);for(const n of nodes)encounterHazard(b,'annulus',n.x,n.y,0,{delay:.5,life:2.1,radius:20,expand:s.second?160:130,width:10});if(!nodes.length)s.exposed=3;s.mode='recover';s.t=1.7;}return;}
 s.a=Math.atan2(dy,dx);moveEnt(G.world,b,(dx/Math.max(1,d)*.3-dy/Math.max(1,d)*.6)*b.spd*dt,(dy/Math.max(1,d)*.3+dx/Math.max(1,d)*.6)*b.spd*dt);if(s.t<=0){s.kind=(s.step++%3===1)?'bells':'submerge';s.mode='windup';s.t=s.duration=s.second?.6:.85;}
};
const depthTickHazards=tickLateHazards;
tickLateHazards=function(dt){const w=G.world;if(!w?.lateHazards)return;const custom=w.lateHazards.filter(h=>h.authored),normal=w.lateHazards.filter(h=>!h.authored);w.lateHazards=normal;depthTickHazards(dt);for(const h of custom){const owner=G.enemies.find(e=>e.uid===h.ownerUid&&!e.dead);if(!owner)continue;if(h.followOwner){h.x=owner.x;h.y=owner.y;}h.t-=dt;h.hitCd=Math.max(0,h.hitCd-dt);if(h.phase==='warn'&&h.t<=0){h.phase='active';h.t=h.activeT;h.age=0;sfx(h.type==='rotor'?'bossLaser':'eshoot');}if(h.phase==='active'){h.age+=dt;if(h.t<=0)continue;const p=G.player;let hit=false;if(h.type==='sweep'){h.a+=(h.turn||0)*dt;hit=lateLineHit(h,p,h.width||8);}else if(h.type==='rotor'){h.a+=(h.turn||0)*dt;for(let i=0;i<(h.arms||2)&&!hit;i++)hit=lateLineHit({...h,a:h.a+i*TAU/(h.arms||2)},p,h.width||8);}else if(h.type==='annulus'){h.radius+=(h.expand||160)*dt;hit=Math.abs(Math.hypot(p.x-h.x,p.y-h.y)-h.radius)<p.r+(h.width||12);}else if(h.type==='glyph')hit=lateLineHit(h,p,h.width||9);else hit=d2(p.x,p.y,h.x,h.y)<((h.radius||35)+p.r)**2;if(hit&&h.hitCd<=0){hurtPlayer(h.damage,h.x,h.y);h.hitCd=.5;}}w.lateHazards.push(h);}};
const depthDrawHazard=drawLateHazard;
drawLateHazard=function(ctx,h){if(!h.authored){depthDrawHazard(ctx,h);return;}ctx.save();ctx.translate(h.x,h.y);const active=h.phase==='active',u=clamp(1-h.t/h.delay,0,1);ctx.strokeStyle=active?h.color:'#a59b80';ctx.fillStyle=h.color;ctx.globalAlpha=active?.85:.35+u*.35;ctx.lineWidth=active?5:1.5;
 if(h.type==='annulus'){ctx.beginPath();ctx.arc(0,0,h.radius||20,0,TAU);ctx.stroke();if(!active){for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*TAU/8);ctx.fillRect(24,-2,5+u*9,3);ctx.restore();}}}
 else if(h.type==='rotor'){const arms=h.arms||2,len=h.len||420;for(let i=0;i<arms;i++){ctx.save();ctx.rotate(h.a+i*TAU/arms);if(active){ctx.strokeStyle=h.color;ctx.globalAlpha=.2;ctx.lineWidth=(h.width||8)*3.1;ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(len,0);ctx.stroke();ctx.strokeStyle='#fff8da';ctx.globalAlpha=.95;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(len,0);ctx.stroke();ctx.fillStyle='#ffffff';for(let q=28;q<len;q+=44){ctx.globalAlpha=.5+.35*Math.sin((h.age||0)*12+q);ctx.fillRect(q,-2,9,4);}}else{ctx.strokeStyle='#d8cfbd';ctx.globalAlpha=.25+u*.45;ctx.lineWidth=1.5;ctx.setLineDash([8,14]);ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(len,0);ctx.stroke();ctx.setLineDash([]);}ctx.restore();}ctx.strokeStyle=active?'#fff2be':h.color;ctx.globalAlpha=active?.9:.35+u*.45;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,24+Math.sin((h.age||u)*8)*3,0,TAU);ctx.stroke();for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*TAU/8-(h.a||0));ctx.fillRect(28,-2,active?9:5,3);ctx.restore();}}
 else if(h.type==='sweep'||h.type==='glyph'){ctx.rotate(h.a);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(h.len||280,0);ctx.stroke();if(!active){for(let x=0;x<(h.len||280);x+=28){ctx.fillRect(x,-2,8,3);if(h.type==='glyph')ctx.fillRect(x+5,-6,2,11);}}else{ctx.globalAlpha=.17;ctx.fillRect(0,-(h.width||9),h.len||280,(h.width||9)*2);}}
 else{ctx.fillStyle='#07090f';ctx.globalAlpha=.3+u*.35;ctx.beginPath();ctx.ellipse(0,0,h.radius||35,(h.radius||35)*.45,0,0,TAU);ctx.fill();ctx.strokeStyle=h.color;ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-20+i*10,0);ctx.lineTo(-16+i*9,-(active?28:6+u*12));ctx.stroke();}}
 ctx.restore();};
const depthUpdate=update;
update=function(dt){const p=G.player,ox=p?.x,oy=p?.y;depthUpdate(dt);if(p&&G.state==='playing'){p.vigilVX=(p.x-ox)/Math.max(.001,dt);p.vigilVY=(p.y-oy)/Math.max(.001,dt);}};

const CREATURE_ART={
 rippleLeech:['........hh......','...bbbbblb......','.bbllbbbbbbh....','bbbbb...bbwwbb..','bbbb....bbkkwb..','.bbbb....bbbb...','..bbbbb..bb.....','....bbbbbbb.....','......bbb.......'],
 pumpCrawler:['...h.....h......','..bbb...bbb.....','..bbbhhhbbb.....','.bllbbbbbbllb...','bbbbhkwwkhbbbb..','..bbhkwwkhbb....','..bbbbbbbbbb....','.bhb......bhb...','bhh........hhb..'],
 lampEel:['........hh......','.......hwwh.....','........bb......','........bb......','....bbbbbbblb...','..bbllbbkkwwbb..','.bbb....bbbbbb..','bbb.......bbb...','bbbb............','..bbbbbbbb......'],
 sluiceGuard:['..hhhhhhhhhhh...','..hbbbbbbbbbh...','..hbllbbllbbh...','..hbkkbbkkbbh...','..hhhhhhhhhhh...','.bbbhbbbbbhbbb..','.bbbhbbbbbhbbb..','...bhbbbbbhb....','...hhhhhhhhh....','...bbb...bbb....','..hhhh...hhhh...'],
 coalMite:['..h...h...h.....','...bbb.bbb......','..bllbbbllb.....','.bbbkwwkbbbb....','bbhbbbbbbbbhbb..','...bbbkkbbb.....','..bb..bb..bb....','.hb........bh...'],
 slagRunner:['.......hh.......','...bbbbbbh......','..bbllbbbbbb....','.bbbkkbbbbbbbb..','..bbbbbbbbbbb...','...bhbbbbbhb....','..hh..bbb..hh...','........b.......','.......hhh......','......hhhhh.....'],
 cinderValve:['.....hhh........','..hh.hbh.hh.....','..hbbbbbbbh.....','...bbhhhbb......','hhbbhwww hbbhh..','...bbhhhbb......','..hbbbbbbbh.....','..hh.hbh.hh.....','.....hhh........','...bb...bb......'],
 hammerFrame:['..........hhhhh.','..hhhh....hlllh.','..hkkh....hbbbh.','..hwwh....hhhhh.','..bbbbbbb...b...','.bblhhllb...b...','.bblbbllbbbbbb..','..bbhhbb....b...','..bbbbbb........','..bb..bb........','.hhh..hhh.......'],
 glassShard:['.......h........','......hlh.......','.....hwwlh......','....hwwwllh.....','...hwwwlllh.....','..hwwllllh......','...hllllh.......','....hllh........','.....hh.........','.....h..........'],
 lensMote:['.....hhhh.......','...hhllllhh.....','..hlwwwwwwlh....','.hlwwwbbwwwlh...','hlwwbbkkbbwwlh..','.hlwwwbbwwwlh...','..hlwwwwwwlh....','...hhllllhh.....','.....hhhh.......','..h........h....'],
 orbitHound:['...h......h.....','...bb....bb.....','...blbbbbblb....','..bbwwbbwwbb....','...bbbbbbbb.....','..hbbbbbbbbh....','.h.bbbbbbbb.h...','..bb.bbbb.bb....','.hh...bb...hh...','....h....h......'],
 mirrorShell:['.....hhhh.......','...hhllllhh.....','..hllhllhllh....','.hlllhllhlllh...','hllllhhhhllllh..','hllllhwwhllllh..','hllllhhhhllllh..','.hlllhllhlllh...','..hllhllhllh....','...hhllllhh.....','....bb..bb......'],
 inkMite:['.....bb.........','...bbbbbb.......','..bbllbbbb......','.bbbkkwwbbb.....','bbbbbbbbbbbb....','.bb..bbbb..bb...','bb...bb.bb..bb..','....bb...bb.....','..bb......bb....'],
 pageWraith:['h...........h...','hh.........hh...','hlhh.....hhwh...','hlllhhhhwwwwh...','.hlllhhwwwlh....','..hllkkwwlh.....','...hllwwlh......','..hllhwwwh......','.hllh..hwwh.....','hllh....hwwh....'],
 quillSentinel:['.........ww.....','.......wwllw....','.....wwlllh.....','....wlllhh......','...wlllh........','..wllhh.........','...hh...........','..hhbbbb........','.hhbkwwkb.......','hh.bbbbb........','...hh.hh........'],
 indexer:['..hhhhhhhhhh....','..hllbbllbbh....','..hhhhhhhhhh....','..hblbblbllh....','.bhhhhhhhhhhb...','.bhllbbllbbhb...','..hbkwwkbbbh....','..hhhhhhhhhh....','...bbb.bbb......','..hhhh.hhhh.....'],
 courtMask:['..h.......h.....','..hh.....hh.....','...hlllllh......','..hlwwwwllh.....','..hlkkwkk lh....','..hlllwwllh.....','...hlkkklh......','....hlllh.......','.....hhh........','....b...b.......'],
 ribbonDuelist:['.....hh.........','....hllh........','....hkkh....h...','..bbbbbbb..h....','.b..bbb..bh.....','b..hbbbh........','..h.bbb.h.......','.h..b.b..hh.....','....b.b....hh...','...hh.hh.....h..'],
 hushBell:['.....hhh........','.....hbh........','....hlllh.......','...hlllllh......','..hlllllllh.....','..hlkkwkk lh....','.hlllllllllh....','hhhhhhhhhhhhh...','.....bbb........','......h.........'],
 mourningGuard:['....hhhh........','...hllllh.......','...hlkklh.......','..bbbbbbbb......','.bbhbbbbhbb.....','bb.hbbbbh.bb....','...hbbbbh.......','..hhbbbbhh......','.hhbbbbbbhh.....','hhhhhhhhhhhh....'],
 choirWisp:['......hh........','.....hllh.......','.....hwwh.......','.....hwwh.......','.....hllh.......','....hhllhh......','..hhllkkllhh....','.hllllkkllllh...','..hhhllllhhh....','.....hhhh.......'],
 pinion:['h............h..','hlh........hlh..','hlllh....hlllh..','.hllllhhllllh...','..hlllwwlllh....','...hllkkllh.....','..hllhllhllh....','.hlh..hh..hlh...','h.......... h...'],
 cantor:['.....hhh........','....hwwwh.......','...hlkkwlh......','....hwwwh.......','...bbbbbbb......','..bhhhbhhhb.....','.b.hwhbhwh.b....','...hwhbhwh......','..hhhhhhhhh.....','...bb...bb......'],
 bellAngel:['hh..........hh..','hllh..hh..hllh..','.hllhhllhhllh...','..hllhwwhllh....','...hhhhhhhh.....','....hllllh......','...hllllllh.....','..hllkkwkllh....','.hhhhhhhhhhhh...','......bb........'],
 obsidianPawn:['.....hhh........','....hlllh.......','....hkkkh.......','.....bbb........','....bbbbb.......','...bbbbbbb......','...bhhhhb.......','....bbbb........','..hhhhhhhh......','.hhhhhhhhhh.....'],
 chainHound:['.h........h.....','.bb......bb.....','.bllbbbbllb.....','..bbwwwwbb......','..bbkkkkbb......','...bbbbbb.......','hbhbbbbbbhbh....','..hbb..bbh......','.hh......hh.....','h..........h....'],
 siegeEye:['.....hhhh.......','...hhllllhh.....','..hlwwwwwwlh....','.hlwwkkkkwwlh...','.hlwwkkkkwwlh...','..hlwwwwwwlh....','...hhhhhhhh.....','..bbb....bbb....','.bllb....bllb...','..bb......bb....'],
 barrierKnight:['.....hh.........','....hllh........','....hkkh........','.hhhhhhhhhhh....','.hlllhbbbbb h...','.hlllhbbkbbh....','.hlllhbbbbb h...','.hlllhbbbbbh....','.hhhhhhhhhhh....','...bb..bb.......','..hhh..hhh......'],
 memoryAsh:['......w.........','....whwh........','...whllhw.......','..hllwwllh......','...hlkklh.......','..hllbbllh......','.hlhllllhlh.....','h..hllllh..h....','..hll..llh......','...h....h.......'],
 starRemnant:['.......h........','......hlh.......','..h...hlh...h...','...hlhlllhllh...','....hllwwllh....','hhhhllwkkwllhhh.','....hllwwllh....','...hlhlllhllh...','..h...hlh...h...','......hlh.......'],
 keeperHand:['..hh.hh.hh......','..hl.hl.hl.hh...','..hl.hl.hl.hl...','..hl.hl.hl.hl...','..hlllllllhll...','hh.hlllllllh....','hlhhllwwlllh....','.hlllwwwwllh....','..hllwwwwlh.....','...hlllllh......','....hhhhh.......'],
 oathbound:['..h..hhh..h.....','..hhhhhhhhh.....','...hllkllh......','...hlwwwlh......','..hhhhhhhhh.....','.hhllhhhllhh....','hhllhbbbhllhh...','.hlhhbbbhhlh....','..hhhbbbhhh.....','...hhbbbhh......','..hhh...hhh.....']
};
const CREATURE_CACHE={};
function creatureSprite(e){if(CREATURE_CACHE[e.type])return CREATURE_CACHE[e.type];const map=CREATURE_ART[e.type];if(!map)return null;const palette={b:e.col,h:'#101723',l:'#b5c4c2',w:'#fff0c0',k:'#050810'};const frames=[];for(let f=0;f<3;f++){const c=document.createElement('canvas');c.width=20;c.height=16;const x=c.getContext('2d');for(let y=0;y<map.length;y++)for(let i=0;i<map[y].length;i++){const col=palette[map[y][i]];if(!col)continue;x.fillStyle=col;const sway=y>map.length*.65?(f===1?1:f===2?-1:0):0;x.fillRect(i+2+sway,y+1,1,1);}frames.push(c);}return CREATURE_CACHE[e.type]=frames;}
const depthDrawBody=drawLateBody;
drawLateBody=function(ctx,e){if(e.mechanism){drawMechanism(ctx,e);return;}const frames=creatureSprite(e);if(!frames){depthDrawBody(ctx,e);return;}const t=save.motion?0:G.tAll,phase=e.specialMode==='tell'?Math.min(1,1-e.specialT/(LATE_SPECIALS[e.type]?.tell||.6)):0;ctx.save();ctx.translate(Math.round(e.x),Math.round(e.y));ctx.imageSmoothingEnabled=false;const scale=Math.max(2,Math.round(e.r/7));ctx.scale(scale,scale);ctx.rotate(e.specialMode==='dash'?e.specialA||0:0);ctx.drawImage(frames[Math.floor(t*(e.lateRole==='rush'?9:5)+e.seed)%3],-10,-8-Math.round(Math.sin(t*3+e.seed)));if(e.elite){ctx.fillStyle='#e8b86e';for(let i=-1;i<=1;i++){ctx.fillRect(i*4-1,-9,2,3-Math.abs(i));}ctx.fillStyle='#f8e0a5';ctx.fillRect(-7,1,2,3);ctx.fillRect(5,1,2,3);}if(phase){ctx.fillStyle='#ffe5a6';ctx.globalAlpha=phase;ctx.fillRect(-3,-4,2,2);ctx.fillRect(2,-4,2,2);}ctx.restore();};
function drawMechanism(ctx,e){ctx.save();ctx.translate(Math.round(e.x),Math.round(e.y));ctx.fillStyle='#0a101a';ctx.fillRect(-22,-20,44,42);ctx.strokeStyle=e.col;ctx.lineWidth=2;ctx.strokeRect(-19,-17,38,34);ctx.fillStyle=e.col;const t=save.motion?0:e.phase;
 if(e.mechanism==='lens'||e.mechanism==='anchor'){ctx.rotate(t*.4);for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.fillRect(10,-3,12,6);}ctx.fillStyle='#fff2bd';ctx.fillRect(-5,-5,10,10);}
 else if(e.mechanism==='bell'){ctx.fillStyle='#c6a061';ctx.beginPath();ctx.moveTo(-9,-14);ctx.lineTo(9,-14);ctx.lineTo(16,12);ctx.lineTo(-16,12);ctx.closePath();ctx.fill();ctx.fillStyle='#f7d992';ctx.fillRect(-5,-10,4,18);ctx.fillRect(-3,12,6,7);}
 else if(e.mechanism==='vent'){for(let i=-1;i<=1;i++){ctx.fillRect(i*10-2,-13,4,24);ctx.fillStyle='#fff0b0';ctx.fillRect(i*10-1,-9,2,13);ctx.fillStyle=e.col;}}
 else if(e.mechanism==='seal'){ctx.fillStyle='#dacaa2';ctx.fillRect(-12,-16,24,32);ctx.fillStyle='#343044';for(let i=0;i<4;i++)ctx.fillRect(-8,-10+i*6,12-i%2*4,2);}
 else if(e.mechanism==='bastion'){for(let i=-1;i<=1;i++)ctx.fillRect(i*12-4,-24,8,47);}
 else{ctx.fillRect(-15,-8,30,16);ctx.fillRect(-5,-26,10,28);ctx.fillStyle='#fff0ba';ctx.fillRect(-2,-24,4,10);}
 ctx.restore();ctx.fillStyle='#101622';ctx.fillRect(e.x-20,e.y+26,40,3);ctx.fillStyle=e.col;ctx.fillRect(e.x-20,e.y+26,40*clamp(e.hp/e.max,0,1),3);}

const depthBossBody=drawLateBossBody;
drawLateBossBody=function(ctx,b){depthBossBody(ctx,b);if(b.bossKey==='bellkeeper')return;const t=save.motion?0:G.tAll,s=b.bs,phase=s.phase||0;ctx.save();ctx.translate(b.x,b.y);ctx.strokeStyle=b.col;ctx.fillStyle='#131925';ctx.lineWidth=2;
 if(b.bossKey==='colossus'){for(const side of [-1,1]){ctx.save();ctx.translate(side*40,8);ctx.rotate(side*Math.sin(t*1.4)*.08+(s.kind==='hammer'&&s.mode==='windup'?-side*.5:0));ctx.fillStyle='#392c2b';ctx.fillRect(-9,-30,18,58);ctx.strokeRect(-9,-30,18,58);ctx.fillStyle='#977a58';ctx.fillRect(-15,19,30,19);ctx.fillStyle='#ffc471';ctx.fillRect(-11,22,4,12);ctx.restore();}ctx.fillStyle='#151821';ctx.fillRect(-20,7,40,20);for(let i=0;i<6;i++){ctx.fillStyle=i%2?'#ffd078':'#87502e';ctx.fillRect(-16+i*6,10,3,12);}}
 else if(b.bossKey==='astronomer'){for(let i=0;i<5;i++){const a=t*.35+i*TAU/5,x=Math.cos(a)*48,y=Math.sin(a)*32;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='#314b60';ctx.fillRect(-8,-12,16,24);ctx.strokeRect(-8,-12,16,24);ctx.fillStyle='#d7ffff';ctx.fillRect(-4,-8,3,11);ctx.restore();}}
 else if(b.bossKey==='scribe'){for(let i=0;i<6;i++){ctx.save();ctx.translate(-32+i*12,15+Math.sin(t*2+i)*7);ctx.rotate(Math.sin(t+i)*.15);ctx.fillStyle=i%2?'#d7c49d':'#8c7c6b';ctx.fillRect(-5,0,11,29-i%3*5);ctx.fillStyle='#37303b';ctx.fillRect(-3,5,7,2);ctx.fillRect(-3,10,5,2);ctx.restore();}ctx.fillStyle='#17131c';ctx.fillRect(-23,-24,22,15);ctx.fillStyle='#fff0c0';ctx.fillRect(-20,-19,5,3);}
 else if(b.bossKey==='regents'){ctx.fillStyle='#dab57a';for(let i=-2;i<=2;i++)ctx.fillRect(i*7-2,-42-Math.abs(i)*3,4,12);ctx.fillStyle=b.twinRole==='blade'?'#b25473':'#7560a1';for(let i=0;i<4;i++)ctx.fillRect(-22+i*13,17,8,26+Math.sin(t*2+i)*4);}
 else if(b.bossKey==='seraph'){for(const side of [-1,1])for(let i=0;i<7;i++){ctx.save();ctx.translate(side*(22+i*6),-10+i*5);ctx.rotate(side*(.35+Math.sin(t*1.8)*.13));ctx.fillStyle=i%2?'#778bc7':'#b8c7ef';ctx.fillRect(-3,-5,6,24-i);ctx.fillStyle='#eaf0ff';ctx.fillRect(-2,-3,2,14);ctx.restore();}ctx.strokeStyle='#d8c792';ctx.beginPath();ctx.ellipse(0,-34,22,8,0,0,TAU);ctx.stroke();}
 else if(b.bossKey==='tyrant'){for(const side of [-1,1]){ctx.fillStyle='#24202b';ctx.fillRect(side*42-11,-31,22,57);ctx.strokeRect(side*42-11,-31,22,57);ctx.fillStyle='#b37753';for(let i=0;i<4;i++)ctx.fillRect(side*42-7,-23+i*12,14,3);ctx.fillStyle='#11151d';ctx.fillRect(side*23-6,-43,12,31);ctx.fillStyle='#ffc981';ctx.fillRect(side*23-3,-40,6,15);}ctx.fillStyle='#9d724b';ctx.fillRect(-19,16,38,6);}
 else{for(let i=0;i<8;i++){const a=i*TAU/8-t*.2,rr=38+phase*6;ctx.save();ctx.translate(Math.cos(a)*rr,Math.sin(a)*rr);ctx.rotate(a);ctx.fillStyle=i%2?'#f0cc85':'#7e655d';ctx.fillRect(-4,-8,8,16);ctx.fillStyle='#fff0c8';ctx.fillRect(-2,-6,2,8);ctx.restore();}ctx.fillStyle='#34262d';ctx.fillRect(-15,-15,30,29);ctx.fillStyle='#ffe2a1';ctx.fillRect(-10,-9,7,4);ctx.fillRect(3,-9,7,4);ctx.fillRect(-5,3,10,2);}
 if((b.bossKey==='seraph'&&s.kind==='corona')||(b.bossKey==='keeper'&&s.kind==='finalOrbit')){const arms=b.bossKey==='keeper'&&phase>1?3:2,spin=(s.mode==='windup'?.25:1)*(s.cycle%2?1:-1);ctx.strokeStyle='#fff0b8';ctx.lineWidth=2;ctx.globalAlpha=s.mode==='windup'?.45:.85;ctx.beginPath();ctx.arc(0,0,b.r+17,0,TAU);ctx.stroke();for(let i=0;i<arms;i++){const a=t*spin+i*TAU/arms;ctx.save();ctx.rotate(a);ctx.fillStyle=i%2?'#fff5d0':b.col;ctx.fillRect(b.r+13,-3,19,6);ctx.fillStyle='#ffffff';ctx.fillRect(b.r+28,-1,7,2);ctx.restore();}}
 if(s.exposed>0){ctx.strokeStyle='#ffe9ad';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,20+Math.sin(t*8)*2,0,TAU);ctx.stroke();}ctx.restore();};
const depthPortrait=drawPortrait;
drawPortrait=function(){if(!dialogue)return;const name=dialogue.lines[dialogue.index].speaker,key=LATE_BOSS_SPEAKERS.get(name);if(!key){depthPortrait();return;}const x=T('speakerPortrait').getContext('2d');x.clearRect(0,0,120,120);x.imageSmoothingEnabled=false;x.save();x.translate(60,66);const scale=key==='bellkeeper'?.67:key==='seraph'?.68:.73;x.scale(scale,scale);const type=Object.keys(LATE_BOSSES).find(t=>LATE_BOSSES[t].key===key),c=LATE_BOSSES[type],b={x:0,y:0,r:c.r,col:c.col,bossKey:key,twinRole:'blade',bs:{mode:'wait',a:0,t:0,duration:1,phase:0,second:false}};if(key==='regents'){x.scale(.7,.7);b.x=-30;drawLateBossBody(x,b);b.x=35;b.twinRole='bell';drawLateBossBody(x,b);}else drawLateBossBody(x,b);x.restore();};

const ENDING_SCENES=[
 {title:'The lock opens',speaker:'The First Keeper',text:'There. I can hear them again. All this time, I thought the silence meant they were gone.'},
 {title:'What the garden kept',speaker:'Wick',text:'They were still inside the star when it began to fail. You opened the gate to bring them out. The Keeper sealed it behind you. He thought the cold would kill them.'},
 {title:'The missing part',speaker:'Wick',text:'You gave me half your light so I could find the way back. Every time you went out, I carried the rest to the gate. I should have told you. I was afraid you’d ask me to stop.'},
 {title:'A door, at last',speaker:'You',text:'Then stay with me this time. We’re opening it together.'},
 {title:'Morning',speaker:'',text:'The first person through the gate shields her eyes. Behind her, someone laughs. Wick settles beside your shoulder. For once, the stairs are quiet.'}
];
let endingClock=0;
function beginEnding(){if(!G.run||G.dead||G.run.infinite)return;clearInput();meleeQueued=reloadQueued=false;G.descending=false;G.ebul=[];G.bullets=[];G.pendingLevels=0;G.world.lateHazards=[];G.portal.active=false;G.bossActive=false;G.run.campaignComplete=true;
 if(!G.run.campaignStats)G.run.campaignStats={kills:G.run.kills,ess:G.run.ess,time:G.run.t,level:G.run.level,guardians:10};save.campaignMedal=true;
 if(!G.run.victoryBanked){G.run.victoryBanked=true;save.victories++;save.bestFloor=Math.max(save.bestFloor,50);save.bestLevel=Math.max(save.bestLevel,G.run.level);G.run.campaignStats={kills:G.run.kills,ess:G.run.ess,time:G.run.t,level:G.run.level,guardians:10};addEss(600);G.run.campaignStats.ess=G.run.ess;save.campaignMedal=true;}
 G.run.endingStep=Number.isInteger(G.run.endingStep)?clamp(G.run.endingStep,0,ENDING_SCENES.length):0;dialogue=null;storyQueue=[];T('conversation').hidden=true;document.body.classList.remove('conversing');for(const id of ['win','chapterClear','pause','levelup','menu'])hide(id);setState('ending');musicInt=0;show('finale');endingClock=0;updateEndingText();saveNow();}
function updateEndingText(){const step=G.run.endingStep,scene=ENDING_SCENES[step],done=!scene;T('endingStory').hidden=done;T('endingResults').hidden=!done;T('endingNext').hidden=done;T('endingTitle').textContent=scene?.title||'THE FIRST DAWN';if(scene){T('endingSpeaker').textContent=scene.speaker;T('endingText').textContent=scene.text;T('endingNext').textContent=step===ENDING_SCENES.length-1?'SEE YOUR JOURNEY':'CONTINUE';}else{const r=G.run.campaignStats;T('endingNumbers').innerHTML=`<b>50<small>FLOORS CONQUERED</small></b><b>${r.guardians}<small>GUARDIANS</small></b><b>${fmt(r.kills)}<small>ENEMIES DEFEATED</small></b><b>${Math.floor(r.time/60)}:${String(Math.floor(r.time%60)).padStart(2,'0')}<small>TIME</small></b><b>◆ ${fmt(r.ess)}<small>ESSENCE EARNED</small></b>`;T('endingBuild').textContent=POOL.filter(o=>G.run.up[o.id]).map(o=>o.name+(G.run.up[o.id]>1?' ×'+G.run.up[o.id]:'')).join(' · ');G.run.endingSeen=true;G.run.wonShown=true;sfx('victory');}T('endingNext').focus({preventScroll:true});}
function advanceEnding(){if(G.state!=='ending'||endingClock<.7||G.run.endingStep>=ENDING_SCENES.length)return;G.run.endingStep++;endingClock=0;sfx('ui');if(G.run.endingStep===4)endingMusic();updateEndingText();saveNow();}
function enterInfinite(){if(G.state!=='ending'||!G.run?.endingSeen||!G.run.campaignComplete||G.run.infinite)return;hide('finale');G.run.infinite=true;G.run.won=false;G.run.wonShown=true;setState('playing');setupFloor(51);clearInput();saveNow();toast('ENDLESS DESCENT','Your victory is saved. The depths keep growing.');}
function finishCampaign(){if(!G.run?.endingSeen)return;hide('finale');G.dead=true;save.resume=null;saveNow();backToMenu();}
const depthVictory=victory;
victory=function(){if(G.floor>=50&&!G.run?.infinite){beginEnding();return;}depthVictory();};
const depthChapter=showChapterClear;
showChapterClear=function(){if(G.floor===50&&!G.run?.infinite){beginEnding();return;}if(G.run?.infinite){G.run.lateClearShown=G.floor;G.world.lateCleared=false;G.portal.active=true;return;}depthChapter();};
const depthKillBoss=killBoss;
killBoss=function(b){for(const e of G.enemies)if(e.mechanism&&e.ownerUid===b.uid)e.dead=true;depthKillBoss(b);if(b.bossKey==='keeper'&&G.floor===50&&!G.run.infinite){beginEnding();}else if(G.run?.infinite&&!G.boss){G.world.lateCleared=false;G.run.lateClearShown=G.floor;G.portal.active=true;}};
const depthDescend=descend;
descend=function(){if(!G.run)return;if(G.floor>=50&&!G.run.infinite){if(G.run.campaignComplete||G.world.lateCleared)beginEnding();return;}depthDescend();};
const depthFloor=setupFloor;
setupFloor=function(f){if(f>50&&!G.run?.infinite){if(G.run?.campaignComplete)beginEnding();return;}if(f<=50){depthFloor(f);return;}const mapped=11+(f-51)%40;depthFloor(mapped);G.floor=f;G.run.infinite=true;G.world.infiniteMapped=mapped;for(const e of G.enemies){if(e.lateBoss){e.hp=e.max=Math.round(ENDGAME_HP[e.bossKey]*Math.pow(1.65,depthCycle()));e.dmg=Math.round(ENDGAME_DAMAGE[e.bossKey]*Math.pow(1.2,depthCycle()));}else if(LATE_ENEMIES[e.type]){e.hp*=Math.pow(1.5,depthCycle());e.max=e.hp;e.dmg=Math.round(e.dmg*Math.pow(1.18,depthCycle()));}}storyQueue=[];dialogue=null;setState('playing');updateHUD(0);saveNow();};
const depthFloorInfo=lateFloorInfo;
lateFloorInfo=function(f){return depthFloorInfo(f>50?11+(f-51)%40:f);};
const depthFloorName=floorName;
floorName=function(f){return f>50?'Infinite '+(f-50)+' · '+depthFloorName(11+(f-51)%40):depthFloorName(f);};
const depthSnapshot=snapshotRun;
snapshotRun=function(){const state=G.state;if(state==='ending')G.state='paused';try{depthSnapshot();}finally{G.state=state;}if(save.resume&&G.run&&state==='ending')save.resume.ending=true;};
const depthValidate=validateSave;
validateSave=function(raw){const clean=depthValidate(raw);clean.campaignMedal=raw.campaignMedal===true;return clean;};
const depthResume=resumeRun;
resumeRun=function(){const ending=save.resume?.ending;depthResume();if(!G.run)return;if(G.floor>50&&!G.run.infinite){G.run.campaignComplete=true;G.run.victoryBanked=!!G.run.wonShown;G.run.endingStep=0;G.floor=50;beginEnding();return;}if(ending||G.run.campaignComplete&&!G.run.infinite){beginEnding();return;}for(const e of G.enemies){if(e.depthRevision===DEPTH_REVISION)continue;const hp=e.hp/e.max;if(e.lateBoss){e.max=ENDGAME_HP[e.bossKey];e.hp=e.max*hp;e.dmg=ENDGAME_DAMAGE[e.bossKey];e.bs.total=0;e.bs.events=[];e.bs.history=[];e.bs.t=1.5;}else if(LATE_ENEMIES[e.type]){const c=LATE_ENEMIES[e.type];e.max=c.hp*depthHealth(authoredDepth())*(e.elite?1.7:1);e.hp=e.max*hp;e.dmg=Math.round(c.dmg*(1+Math.max(0,authoredDepth()-11)*.029));}e.depthRevision=DEPTH_REVISION;}};
const depthMenuStats=refreshMenuStats;
refreshMenuStats=function(){depthMenuStats();const badge=T('campaignMedal');if(badge)badge.hidden=!save.campaignMedal;};
const depthHollowTick=hollowTick;
hollowTick=function(dt){if(G.state==='ending'){endingClock+=dt;drawEnding();return;}depthHollowTick(dt);};
function drawEnding(){const cv=T('endingCanvas'),x=cv.getContext('2d'),step=G.run?.endingStep||0,t=save.motion?4:endingClock,w=cv.width,h=cv.height;x.clearRect(0,0,w,h);x.fillStyle=step<4?'#060b16':'#242338';x.fillRect(0,0,w,h);x.imageSmoothingEnabled=false;
 for(let i=0;i<85;i++){const px=(i*137)%w,py=((i*73+t*(step>=4?-6:2))%h+h)%h;x.globalAlpha=.15+(i%7)*.08;x.fillStyle=step>=4?'#ffe0a0':'#849aba';x.fillRect(px,py,i%9===0?3:1,2);}x.globalAlpha=1;
 const open=step>=3?Math.min(1,t/3):0,cx=w/2,cy=h*.53;
 for(let i=0;i<10;i++){const a=i*TAU/10+t*.04,r=80+open*90,px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r*.5;x.fillStyle=i%2?'#5e5261':'#9b7b61';x.fillRect(Math.round(px)-12,Math.round(py)-7,24,14);x.fillStyle='#d4b78a';x.fillRect(Math.round(px)-10,Math.round(py)-6,7,2);}
 x.fillStyle='#34333f';x.fillRect(cx-56,cy-82,112,145);x.fillStyle='#b19a74';x.fillRect(cx-60,cy-84,12,150);x.fillRect(cx+48,cy-84,12,150);x.fillRect(cx-60,cy-90,120,10);x.fillStyle=step>=3?'#f3d7a0':'#090f1d';x.fillRect(cx-43,cy-75,86,136);
 if(step>=3){x.globalAlpha=Math.min(.65,t*.18);x.fillStyle='#ffe5b1';x.beginPath();x.moveTo(cx-42,cy+60);x.lineTo(cx+42,cy+60);x.lineTo(w*.91,h);x.lineTo(w*.09,h);x.closePath();x.fill();x.globalAlpha=1;}
 const ember=SPR.pIdle;if(ember){const fr=ember.frames[Math.floor(t*ember.fps)%ember.frames.length];x.drawImage(fr,cx-60,cy+32,ember.W*1.4,ember.H*1.4);}
 x.fillStyle='#fff0b8';x.fillRect(cx+32+Math.sin(t)*3,cy+38,5,8);x.fillStyle='#e7a85f';x.fillRect(cx+30+Math.sin(t)*3,cy+41,9,7);
 if(step>=4)for(let i=0;i<7;i++){const walk=save.motion?1:clamp((t-i*.5)/5,0,1),px=cx+(i-3)*11+walk*(i-3)*16,py=cy+30+walk*65;x.fillStyle=i%2?'#443d4e':'#51444b';x.fillRect(px-4,py-12,8,15);x.fillRect(px-3,py-19,6,6);x.fillRect(px-4,py+3,3,7);x.fillRect(px+1,py+3,3,7);}
}
function endingMusic(){if(!AC||!save.music)return;const now=AC.currentTime;[220,277.18,329.63,440,554.37,659.25].forEach((freq,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(0,now+i*.25);g.gain.linearRampToValueAtTime(.04,now+i*.25+.15);g.gain.exponentialRampToValueAtTime(.001,now+i*.25+3.5);o.connect(g);g.connect(musDry);o.start(now+i*.25);o.stop(now+i*.25+3.6);});}
function wireDepth(){on(T('endingNext'),'click',advanceEnding);on(T('endingInfinite'),'click',enterInfinite);on(T('endingFinish'),'click',finishCampaign);on(T('endingReplay'),'click',()=>{G.run.endingStep=0;endingClock=0;updateEndingText();saveNow();});addEventListener('keydown',e=>{if(G.state!=='ending')return;if(['Enter','Space'].includes(e.code)&&e.target?.tagName!=='BUTTON'){e.preventDefault();advanceEnding();}},true);}
const depthHUD=updateHUD;
updateHUD=function(dt){depthHUD(dt);const b=G.boss;if(!b?.introduced)return;if(b.warden){setTxt('floorObjective',b.wb.second?'BROKEN ARMOR · watch the second sweep':'THE LAST WATCH · Flare can break a committed swing');return;}if(b.matriarch){setTxt('floorObjective',b.ms.uprooted?'UPROOTED · the nests fall silent':b.ms.second?'IN BLOOM · clear the growing roots':'THE NURSERY · nests can be destroyed');return;}if(!b.lateBoss)return;const s=b.bs,n=bossNodes(b).length,beam=G.world.lateHazards?.find(h=>h.ownerUid===b.uid&&h.type==='rotor');if(beam){setTxt('floorObjective',beam.phase==='active'?'THE LIGHT TURNS · DASH THROUGH THE BEAM':'THE HALO IS OPENING');return;}const hints={bellkeeper:n?'SILENCE THE BELLS · '+n+' remaining':'THE BELLS ARE SILENT',colossus:n?'BREAK THE FURNACE VENTS · '+n:'EXPOSED CORE',astronomer:n?'LENSES REDIRECT THE BEAMS · '+n:'LENSES SHATTERED',scribe:'YOUR FOOTSTEPS BECOME INK',regents:'SEPARATE THE REGENTS · break their shared guard',seraph:s.airborne?'AIRBORNE · watch the wings':'GROUNDED · strike before she rises',tyrant:n?'DISMANTLE THE SIEGE · '+n+' mechanisms':'THE THRONE IS EXPOSED',keeper:['THE CRADLE · break its anchors','THE ARCHIVE · change your route','THE LAST LOCK · hold your ground'][s.phase||0]};setTxt('floorObjective',hints[b.bossKey]);};
const BOSS_PIXEL_SURFACE=document.createElement('canvas');BOSS_PIXEL_SURFACE.width=144;BOSS_PIXEL_SURFACE.height=144;
const detailedBossBody=drawLateBossBody;
drawLateBossBody=function(ctx,b){const surface=BOSS_PIXEL_SURFACE,x=surface.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,144,144);x.save();x.translate(72,72);x.scale(.7,.7);detailedBossBody(x,{...b,x:0,y:0});x.restore();x.globalCompositeOperation='source-atop';for(let i=0;i<160;i++){const px=20+(i*67)%105,py=18+(i*43)%105;x.fillStyle=i%3===0?'#ffffff18':'#03070b24';x.fillRect(px,py,i%4===0?3:1,1);}x.globalCompositeOperation='source-over';ctx.save();ctx.imageSmoothingEnabled=false;const lift=b.bossKey==='seraph'&&b.bs.airborne?14:0;ctx.drawImage(surface,b.x-144/1.4,b.y-144/1.4-lift,144/.7,144/.7);ctx.restore();};
const cinematicBase=drawEnding;
drawEnding=function(){cinematicBase();const cv=T('endingCanvas'),x=cv.getContext('2d'),w=cv.width,h=cv.height,cx=w/2,cy=h*.53,step=G.run.endingStep,t=save.motion?5:endingClock; x.save();x.imageSmoothingEnabled=false;
 for(const side of [-1,1])for(let tower=0;tower<3;tower++){const bx=cx+side*(140+tower*70),by=85+tower*23;x.fillStyle=step>=4?'#554859':'#111a29';x.fillRect(bx-17,by,34,h-by);for(let row=0;row<12;row++){const yy=by+row*17;x.fillStyle=row%2?'#2b3040':'#373442';x.fillRect(bx-17+(row%2)*4,yy,30,2);x.fillStyle='#796955';x.fillRect(bx-16,yy+2,2,12);}x.fillStyle='#b09a71';x.fillRect(bx-22,by-4,44,7);x.fillStyle='#e2c68e';x.fillRect(bx-20,by-4,9,2);}
 for(let row=0;row<3;row++){const yy=h-30+row*11;x.fillStyle=row%2?'#302d3b':'#242836';x.fillRect(0,yy,w,10);x.fillStyle='#8e765744';for(let col=0;col<14;col++)x.fillRect(col*60+(row%2)*25,yy,56,1);}
 if(step===0){x.save();x.translate(cx,cy-20);x.globalAlpha=Math.max(.15,1-t*.12);drawLateBossBody(x,{x:0,y:0,r:44,col:'#efc986',bossKey:'keeper',bs:{mode:'recover',a:0,t:1,duration:1,phase:2,second:true}});x.restore();for(let i=0;i<20;i++){const a=i*TAU/20,rr=35+Math.min(7,t)*10;x.fillStyle=i%2?'#efd29a':'#8d7367';x.fillRect(cx+Math.cos(a)*rr,cy-20+Math.sin(a)*rr*.6,4,3);}}
 if(step===1){for(let i=0;i<8;i++){const px=110+i*70,py=190+Math.sin(i)*12;x.fillStyle='#21302d';x.fillRect(px-20,py,40,12);x.fillStyle='#708368';x.fillRect(px-17,py,34,2);x.fillStyle='#b6b898';x.fillRect(px-3,py-19,6,17);x.fillStyle='#e1c4a0';x.fillRect(px-3,py-26,6,6);for(let j=0;j<4;j++){x.fillStyle=j%2?'#50664c':'#354a3b';x.fillRect(px-28+j*13,py+10+j*3,17,3);}}}
 if(step===2){x.fillStyle='#090e1dee';x.fillRect(cx-42,cy-75,84,134);for(let i=0;i<32;i++){const a=i*.23+t*.6,rr=16+i*1.2;x.fillStyle=i%2?'#f4b96c':'#8aaad5';x.globalAlpha=.3+i/50;x.fillRect(cx+Math.cos(a)*rr,cy-7+Math.sin(a)*rr*.65,3,3);}x.globalAlpha=1;x.fillStyle='#fff0bb';x.fillRect(cx-7,cy-18,14,22);x.fillStyle='#eda96a';x.fillRect(cx-10,cy-7,20,16);}
 if(step>=3){const light=Math.min(.45,t*.1);x.globalCompositeOperation='lighter';const g=x.createRadialGradient(cx,cy,5,cx,cy,180);g.addColorStop(0,'rgba(255,222,159,'+light+')');g.addColorStop(1,'rgba(255,210,150,0)');x.fillStyle=g;x.fillRect(cx-180,cy-150,360,330);x.globalCompositeOperation='source-over';for(let i=0;i<65;i++){const px=(i*157+t*(i%2?8:-8)+w*10)%w,py=(i*83-t*(7+i%4)+h*10)%h;x.fillStyle=['#f4d28e','#b1c3ca','#d39d78'][i%3];x.globalAlpha=.25+(i%6)*.1;x.fillRect(Math.round(px),Math.round(py),i%3===0?3:2,2);}x.globalAlpha=1;}
 x.restore();};
const fracturedArena=drawLateWorld;
drawLateWorld=function(ctx){fracturedArena(ctx);const b=G.boss;if(!b?.introduced||b.bossKey!=='keeper'||!(b.bs.phase>0))return;const a=arenaBounds(),t=save.motion?0:G.tAll;ctx.save();ctx.lineWidth=2;ctx.strokeStyle=b.bs.phase===2?'#ffd388aa':'#a78c7477';for(let i=0;i<12;i++){const angle=i*TAU/12,x=a.cx+Math.cos(angle)*(a.right-a.left)*.42,y=a.cy+Math.sin(angle)*(a.bottom-a.top)*.42;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(angle+.2)*17,y+Math.sin(angle+.2)*17);ctx.lineTo(x+Math.cos(angle)*35,y+Math.sin(angle)*35);ctx.stroke();ctx.fillStyle=i%2?'#d4ad7166':'#85717a88';ctx.fillRect(x+Math.cos(t*.25+i)*5,y+Math.sin(t*.4+i)*4,5,3);}ctx.restore();};
