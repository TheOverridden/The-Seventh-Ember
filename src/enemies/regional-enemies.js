const LATE_ENEMIES={
 rippleLeech:{region:'reservoir',role:'rush',hp:105,spd:102,dmg:14,r:11,xp:14,col:'#62b5c3',shape:'leech'},
 pumpCrawler:{region:'reservoir',role:'orbit',hp:140,spd:78,dmg:16,r:15,xp:17,col:'#6f9aa0',shape:'crawler'},
 lampEel:{region:'reservoir',role:'ranged',hp:125,spd:58,dmg:15,r:14,xp:16,col:'#8dd8d3',shape:'eel'},
 sluiceGuard:{region:'reservoir',role:'guard',hp:260,spd:42,dmg:22,r:20,xp:24,col:'#54777c',shape:'sluice'},
 coalMite:{region:'foundry',role:'rush',hp:135,spd:106,dmg:16,r:11,xp:16,col:'#d56b43',shape:'coal'},
 slagRunner:{region:'foundry',role:'orbit',hp:175,spd:88,dmg:19,r:15,xp:19,col:'#a6553e',shape:'slag'},
 cinderValve:{region:'foundry',role:'ranged',hp:165,spd:50,dmg:18,r:15,xp:19,col:'#f29a55',shape:'valve'},
 hammerFrame:{region:'foundry',role:'guard',hp:320,spd:39,dmg:25,r:22,xp:28,col:'#76534b',shape:'hammer'},
 glassShard:{region:'observatory',role:'rush',hp:170,spd:116,dmg:18,r:11,xp:20,col:'#72d5e7',shape:'shard'},
 lensMote:{region:'observatory',role:'ranged',hp:150,spd:62,dmg:17,r:13,xp:22,col:'#9be9f2',shape:'lens'},
 orbitHound:{region:'observatory',role:'orbit',hp:215,spd:94,dmg:21,r:16,xp:25,col:'#668dd5',shape:'hound'},
 mirrorShell:{region:'observatory',role:'guard',hp:360,spd:45,dmg:26,r:21,xp:31,col:'#93aaba',shape:'shell'},
 inkMite:{region:'archive',role:'rush',hp:195,spd:108,dmg:20,r:11,xp:22,col:'#988f86',shape:'ink'},
 pageWraith:{region:'archive',role:'orbit',hp:185,spd:86,dmg:21,r:15,xp:24,col:'#d8caa9',shape:'page'},
 quillSentinel:{region:'archive',role:'ranged',hp:230,spd:55,dmg:23,r:16,xp:27,col:'#c6a875',shape:'quill'},
 indexer:{region:'archive',role:'guard',hp:420,spd:40,dmg:29,r:22,xp:34,col:'#7f7163',shape:'shelf'},
 courtMask:{region:'court',role:'rush',hp:225,spd:112,dmg:23,r:12,xp:25,col:'#e19aab',shape:'mask'},
 ribbonDuelist:{region:'court',role:'orbit',hp:260,spd:91,dmg:25,r:16,xp:28,col:'#bd6e83',shape:'ribbon'},
 hushBell:{region:'court',role:'ranged',hp:235,spd:52,dmg:24,r:15,xp:28,col:'#c7a779',shape:'bell'},
 mourningGuard:{region:'court',role:'guard',hp:470,spd:43,dmg:31,r:22,xp:37,col:'#7f5364',shape:'guard'},
 choirWisp:{region:'choir',role:'rush',hp:245,spd:125,dmg:25,r:11,xp:27,col:'#afbdff',shape:'note'},
 pinion:{region:'choir',role:'orbit',hp:280,spd:102,dmg:27,r:16,xp:30,col:'#8093d5',shape:'wing'},
 cantor:{region:'choir',role:'ranged',hp:270,spd:58,dmg:26,r:16,xp:31,col:'#c6ceef',shape:'cantor'},
 bellAngel:{region:'choir',role:'guard',hp:520,spd:47,dmg:34,r:23,xp:40,col:'#7f86ae',shape:'angel'},
 obsidianPawn:{region:'citadel',role:'rush',hp:295,spd:105,dmg:29,r:13,xp:31,col:'#aa5f50',shape:'pawn'},
 chainHound:{region:'citadel',role:'orbit',hp:340,spd:96,dmg:31,r:17,xp:34,col:'#6c4d53',shape:'chain'},
 siegeEye:{region:'citadel',role:'ranged',hp:315,spd:48,dmg:31,r:17,xp:35,col:'#e47a5e',shape:'eye'},
 barrierKnight:{region:'citadel',role:'guard',hp:610,spd:39,dmg:38,r:24,xp:45,col:'#50444c',shape:'knight'},
 memoryAsh:{region:'heart',role:'rush',hp:335,spd:130,dmg:31,r:12,xp:34,col:'#f2bc6d',shape:'ash'},
 starRemnant:{region:'heart',role:'orbit',hp:390,spd:106,dmg:34,r:18,xp:38,col:'#b68b76',shape:'star'},
 keeperHand:{region:'heart',role:'ranged',hp:370,spd:62,dmg:34,r:18,xp:39,col:'#e2c486',shape:'hand'},
 oathbound:{region:'heart',role:'guard',hp:700,spd:45,dmg:42,r:25,xp:50,col:'#796153',shape:'oath'}
};
for(const [type,o] of Object.entries(LATE_ENEMIES))ETYPES[type]={hp:o.hp,spd:o.spd,dmg:o.dmg,r:o.r,xp:o.xp,spr:type,ai:'late',col:o.col,ess:.65,kb:o.role==='guard'?.18:.75};
const LATE_ROSTERS={
 reservoir:['rippleLeech','pumpCrawler','lampEel','sluiceGuard'],foundry:['coalMite','slagRunner','cinderValve','hammerFrame'],observatory:['glassShard','lensMote','orbitHound','mirrorShell'],archive:['inkMite','pageWraith','quillSentinel','indexer'],court:['courtMask','ribbonDuelist','hushBell','mourningGuard'],choir:['choirWisp','pinion','cantor','bellAngel'],citadel:['obsidianPawn','chainHound','siegeEye','barrierKnight'],heart:['memoryAsh','starRemnant','keeperHand','oathbound']
};
const beforeLateSpawnEnemy=spawnEnemy;
spawnEnemy=function(type,x,y,elite){
  const e=beforeLateSpawnEnemy(type,x,y,elite),cfg=LATE_ENEMIES[type];if(!cfg)return e;
  const scale=1+Math.max(0,G.floor-11)*.022;e.hp=e.max=Math.round(cfg.hp*scale*(elite?1.5:1));e.spd=cfg.spd*(1+Math.max(0,G.floor-11)*.0025);e.dmg=Math.round(cfg.dmg*(1+Math.max(0,G.floor-11)*.014));e.xp=Math.round(cfg.xp*(elite?1.75:1));e.lateRole=cfg.role;e.lateShape=cfg.shape;e.action='stalk';e.actionT=rand(.4,1.1);e.face=0;e.specialMode='';e.specialT=0;e.specialCd=rand(1.4,3.2);e.specialPulse=0;e.balanceVersion=4;return e;
};
function lateFloorInfo(f){const r=lateRegion(f);return r?r.floors[f-r.from]:null;}
function latePlace(w,room,radius=18){for(let n=0;n<80;n++){const x=(irand(room.x+2,room.x+room.w-3)+.5)*TILE,y=(irand(room.y+2,room.y+room.h-3)+.5)*TILE,p=safePosition(w,x,y,radius);if(p&&G.enemies.every(e=>d2(e.x,e.y,p.x,p.y)>(e.r+radius+34)**2))return p;}return null;}
function createLateDoors(w){
  const r=w.exit,doors=[],add=(x,y)=>{if(x>=0&&y>=0&&x<w.W&&y<w.H&&w.grid[y*w.W+x]===1&&!doors.some(p=>p.x===x&&p.y===y))doors.push({x,y});};
  for(let x=r.x;x<r.x+r.w;x++){add(x,r.y-1);add(x,r.y+r.h);}for(let y=r.y;y<r.y+r.h;y++){add(r.x-1,y);add(r.x+r.w,y);}return doors;
}
function sealLateArena(on){const w=G.world;if(!w?.lateDoors)return;w.sealed=on;for(const p of w.lateDoors)w.grid[p.y*w.W+p.x]=on?2:1;w.mmDirty=true;}
function lateHazardFor(region,room,index){
  const x=room.cx*TILE+18,y=room.cy*TILE+18,base={x,y,t:rand(.8,2.5),phase:'rest',activeT:0,seed:index,hit:false};
  if(region.key==='reservoir')return{...base,type:'ripple',a:rand(0,TAU),radius:58+index%2*15};
  if(region.key==='foundry')return{...base,type:'vent',a:chance(.5)?0:Math.PI/2,len:Math.max(130,room.w*TILE*.42)};
  if(region.key==='observatory')return{...base,type:'prism',a:rand(0,TAU),len:Math.min(room.w,room.h)*TILE*.48};
  if(region.key==='archive')return{...base,type:'inkline',a:chance(.5)?0:Math.PI/2,len:Math.max(120,(chance(.5)?room.w:room.h)*TILE*.38)};
  if(region.key==='court')return{...base,type:'hush',radius:70+index%3*12};
  if(region.key==='choir')return{...base,type:'gust',a:rand(0,TAU),len:Math.max(130,room.w*TILE*.4)};
  if(region.key==='citadel')return{...base,type:'shell',radius:34};
  return{...base,type:'rift',radius:48+index%2*12,a:rand(0,TAU)};
}
function setupLateFloor(f){
  const region=lateRegion(f),w=G.world;w.region='late';w.lateKey=region.key;w.pi=region.pi;w.pal=PALETTES[w.pi];w.lateDecor=[];w.lateHazards=[];w.lateFixtures=[];w.lateDoors=bossFloorAt(f)?createLateDoors(w):[];w.sealed=false;w.lateCleared=false;
  G.enemies=[];G.bullets=[];G.ebul=[];G.picks=[];G.chests=[];G.boss=null;G.bossActive=false;T('bossbar').classList.remove('on');
  const start=w.rooms[0],exit=w.exit;G.player.x=start.cx*TILE+18;G.player.y=start.cy*TILE+18;G.player.hitCd=1;G.cam.x=G.player.x-G.w/2;G.cam.y=G.player.y-G.h/2;G.portal={x:exit.cx*TILE+18,y:exit.cy*TILE+18,r:26,active:!bossFloorAt(f),t:0};
  for(let i=0;i<w.rooms.length;i++){const room=w.rooms[i];w.lateDecor.push({type:region.key,x:room.cx*TILE+18,y:room.cy*TILE+18,w:(room.w-2)*TILE,h:(room.h-2)*TILE,seed:i});if(i>1&&room!==exit&&i%4===1)w.lateHazards.push(lateHazardFor(region,room,i));}
  const traceRooms=w.rooms.filter(r=>r!==start&&r!==exit),traceRoom=traceRooms[irand(0,traceRooms.length-1)]||w.rooms[1]||start,tracePos=latePlace(w,traceRoom,20);if(tracePos)w.lateFixtures.push({kind:'trace',id:'trace'+f,...tracePos});
  const roster=LATE_ROSTERS[region.key],rooms=w.rooms.filter(r=>r!==start&&r!==exit),within=f-region.from,target=bossFloorAt(f)?Math.min(15,9+region.stage):Math.min(30,12+region.stage+within*2),eliteChance=.08+(region.stage-5)*.035;let spawned=0;
  for(let pass=0;pass<3&&spawned<target;pass++)for(let ri=0;ri<rooms.length&&spawned<target;ri++){if(pass>0&&ri<2)continue;const room=rooms[ri],type=roster[(ri+pass+within)%roster.length],pos=latePlace(w,room,ETYPES[type].r);if(pos){spawnEnemy(type,pos.x,pos.y,chance(eliteChance));spawned++;}}
  if(!bossFloorAt(f)&&(within===1||within===3)&&rooms.length){const room=rooms[(region.stage+within*2)%rooms.length],pos=latePlace(w,room,17);if(pos)G.chests.push({...pos,opened:false,lateCache:true});}
  if(bossFloorAt(f))spawnLateBoss(region);G.player.ammo=Math.min(G.player.ammo??G.player.magSize,G.player.magSize);G.run.lateClearShown=G.run.lateClearShown===f?0:G.run.lateClearShown;
  const arrivals={reservoir:'reservoirArrival',foundry:'foundryArrival',observatory:'obsArrival',archive:'archiveArrival',court:'courtArrival',choir:'choirArrival',citadel:'citadelArrival',heart:'heartArrival'};if(f===region.from)queueStory(arrivals[region.key]);announceLateFloor();musicInt=.56+region.stage*.04;saveNow();
}
const beforeLateSetupFloor=setupFloor;
setupFloor=function(f){beforeLateSetupFloor(f);if(lateRegion(f))setupLateFloor(f);};

function lateShot(e,a,speed,dmg,color=e.col){enemyShoot(e,a,speed,dmg);const b=G.ebul[G.ebul.length-1];b.lateColor=color;b.r=5;b.life=3.5;return b;}
const COMBAT_AUDIT_VERSION=7;
const LATE_SPECIALS={
 rippleLeech:{name:'undertow lunge',cd:4.2,range:190,tell:.28},pumpCrawler:{name:'pump suction',cd:6.2,range:250,tell:.55},lampEel:{name:'forked current',cd:4.8,range:390,tell:.38},sluiceGuard:{name:'sluice wave',cd:6.5,range:310,tell:.62},
 coalMite:{name:'coal burst',cd:4.4,range:170,tell:.25},slagRunner:{name:'slag trail',cd:5.4,range:230,tell:.42},cinderValve:{name:'rotary volley',cd:5.8,range:420,tell:.52},hammerFrame:{name:'hammerfall',cd:6.8,range:145,tell:.68},
 glassShard:{name:'ricochet cut',cd:4.7,range:260,tell:.3},lensMote:{name:'measuring beam',cd:5.7,range:450,tell:.58},orbitHound:{name:'parallax pounce',cd:5.1,range:290,tell:.4},mirrorShell:{name:'mirror closure',cd:7.4,range:360,tell:.5},
 inkMite:{name:'ink blink',cd:4.6,range:220,tell:.3},pageWraith:{name:'page phase',cd:5.3,range:300,tell:.42},quillSentinel:{name:'triple redaction',cd:6.1,range:430,tell:.58},indexer:{name:'misfile',cd:8.2,range:380,tell:.72},
 courtMask:{name:'false bow',cd:4.5,range:220,tell:.36},ribbonDuelist:{name:'ribbon crosscut',cd:5.2,range:250,tell:.42},hushBell:{name:'hush toll',cd:6.6,range:330,tell:.64},mourningGuard:{name:'mourning vigil',cd:8,range:380,tell:.7},
 choirWisp:{name:'six-note refrain',cd:4.7,range:270,tell:.36},pinion:{name:'pinion dive',cd:4.9,range:300,tell:.34},cantor:{name:'broken chord',cd:6.2,range:430,tell:.6},bellAngel:{name:'bell-wing gust',cd:6.8,range:350,tell:.58},
 obsidianPawn:{name:'rank advance',cd:5.2,range:240,tell:.44},chainHound:{name:'chain drag',cd:6,range:300,tell:.48},siegeEye:{name:'siege line',cd:6.5,range:470,tell:.72},barrierKnight:{name:'barrier charge',cd:7.1,range:280,tell:.62},
 memoryAsh:{name:'remembered step',cd:4.4,range:270,tell:.3},starRemnant:{name:'fallen constellation',cd:5.9,range:340,tell:.48},keeperHand:{name:'grasping fan',cd:5.5,range:430,tell:.5},oathbound:{name:'keeper oath',cd:7.6,range:360,tell:.68}
};
function finishLateSpecial(e,mul=1){const c=LATE_SPECIALS[e.type];e.specialMode='';e.specialT=0;e.specialCd=(c?.cd||5)*mul*rand(.9,1.1);e.alpha=1;e.specialHit=false;}
function enemyHazard(e,type,x=e.x,y=e.y,a=0,delay=.35,life=.32,extra={}){
  G.world.lateHazards.push({type,x,y,a,t:delay,phase:'warn',activeT:life,boss:true,hit:false,color:e.col,damage:Math.max(5,Math.round(e.dmg*.72)),...extra});
}
function beginEnemyDash(e,a,speed,time,trail=false,bounces=0){
  e.specialMode='dash';e.specialT=time;e.specialA=a;e.specialSpeed=speed;e.specialTrail=trail?0:.99;e.specialBounces=bounces;e.specialHit=false;
}
function executeLateSpecial(e){
  const p=G.player,a=e.specialA,d=e.specialDistance||1;
  e.specialPulse=.45;
  if(e.type==='rippleLeech')beginEnemyDash(e,a,455,.38);
  else if(e.type==='pumpCrawler'){e.specialMode='suction';e.specialT=.82;e.specialHit=false;}
  else if(e.type==='lampEel'){for(const q of [-.3,0,.3])lateShot(e,a+q,230,e.dmg*.72);finishLateSpecial(e);}
  else if(e.type==='sluiceGuard'){for(const q of [-.42,0,.42])enemyHazard(e,'wave',e.x,e.y,a+q,.3,.38,{len:285,width:12});finishLateSpecial(e);}
  else if(e.type==='coalMite')beginEnemyDash(e,a,520,.25);
  else if(e.type==='slagRunner')beginEnemyDash(e,a,405,.5,true);
  else if(e.type==='cinderValve'){for(let i=0;i<8;i++)lateShot(e,a+i*TAU/8,205,e.dmg*.58);finishLateSpecial(e);}
  else if(e.type==='hammerFrame'){enemyHazard(e,'shell',e.x,e.y,0,.34,.3,{radius:76});finishLateSpecial(e,1.08);}
  else if(e.type==='glassShard')beginEnemyDash(e,a,565,.48,false,2);
  else if(e.type==='lensMote'){enemyHazard(e,'beam',e.x,e.y,a,.42,.46,{len:470,width:8});finishLateSpecial(e);}
  else if(e.type==='orbitHound'){const side=Math.sin(e.seed)>0?1:-1,pos=safePosition(G.world,p.x+Math.cos(a+side*Math.PI/2)*105,p.y+Math.sin(a+side*Math.PI/2)*105,e.r);if(pos){e.x=pos.x;e.y=pos.y;}beginEnemyDash(e,Math.atan2(p.y-e.y,p.x-e.x),475,.36);}
  else if(e.type==='mirrorShell'){e.specialMode='shell';e.specialT=1.2;}
  else if(e.type==='inkMite'){const pos=safePosition(G.world,p.x-Math.cos(a)*75+Math.sin(a)*45,p.y-Math.sin(a)*75-Math.cos(a)*45,e.r);if(pos){e.x=pos.x;e.y=pos.y;}enemyHazard(e,'glyph',e.x,e.y,Math.atan2(p.y-e.y,p.x-e.x),.28,.34,{len:190,width:8});finishLateSpecial(e);}
  else if(e.type==='pageWraith'){e.specialMode='phase';e.specialT=1.05;e.alpha=.3;}
  else if(e.type==='quillSentinel'){for(const q of [-34,0,34]){const ox=Math.cos(a+Math.PI/2)*q,oy=Math.sin(a+Math.PI/2)*q;enemyHazard(e,'inkline',e.x+ox,e.y+oy,a,.42,.36,{len:300,width:8});}finishLateSpecial(e);}
  else if(e.type==='indexer'){if(G.enemies.filter(x=>!x.dead).length<28){for(const side of [-1,1]){const pos=safePosition(G.world,e.x+side*38,e.y+rand(-24,24),11);if(pos){const m=spawnEnemy('inkMite',pos.x,pos.y,false);m.aggro=true;m.specialCd=2.2;}}}finishLateSpecial(e,1.2);}
  else if(e.type==='courtMask'){const pos=safePosition(G.world,p.x-Math.cos(a)*92,p.y-Math.sin(a)*92,e.r);if(pos){e.x=pos.x;e.y=pos.y;}beginEnemyDash(e,Math.atan2(p.y-e.y,p.x-e.x),490,.3);}
  else if(e.type==='ribbonDuelist'){for(const q of [-.56,0,.56])lateShot(e,a+q,255,e.dmg*.62);beginEnemyDash(e,a+Math.sin(e.seed)*.28,350,.3);}
  else if(e.type==='hushBell'){enemyHazard(e,'hush',p.x,p.y,0,.5,.5,{radius:76});finishLateSpecial(e);}
  else if(e.type==='mourningGuard'){e.specialMode='aura';e.specialT=1.8;}
  else if(e.type==='choirWisp'){for(let i=0;i<6;i++)lateShot(e,i*TAU/6+a,235,e.dmg*.6);finishLateSpecial(e);}
  else if(e.type==='pinion')beginEnemyDash(e,a,610,.34);
  else if(e.type==='cantor'){for(const q of [-.22,0,.22])enemyHazard(e,'wave',e.x,e.y,a+q,.4,.42,{len:330,width:10});finishLateSpecial(e);}
  else if(e.type==='bellAngel'){enemyHazard(e,'gust',e.x,e.y,a,.34,.52,{len:300,width:22});beginEnemyDash(e,a,360,.38);}
  else if(e.type==='obsidianPawn'){for(const ally of G.enemies)if(ally!==e&&!ally.dead&&ally.type==='obsidianPawn'&&d2(ally.x,ally.y,e.x,e.y)<150**2)beginEnemyDash(ally,a,370,.34);beginEnemyDash(e,a,425,.4);}
  else if(e.type==='chainHound'){e.specialMode='tether';e.specialT=.82;}
  else if(e.type==='siegeEye'){enemyHazard(e,'beam',e.x,e.y,a,.52,.58,{len:540,width:13});finishLateSpecial(e,1.08);}
  else if(e.type==='barrierKnight'){e.specialMode='barrier';e.specialT=.78;}
  else if(e.type==='memoryAsh'){const pos=safePosition(G.world,p.x-Math.cos(a)*105,p.y-Math.sin(a)*105,e.r);if(pos){e.x=pos.x;e.y=pos.y;}beginEnemyDash(e,Math.atan2(p.y-e.y,p.x-e.x),540,.31);}
  else if(e.type==='starRemnant'){const q=a+Math.PI+Math.sin(e.seed)*.7,pos=safePosition(G.world,p.x+Math.cos(q)*135,p.y+Math.sin(q)*135,e.r);if(pos){e.x=pos.x;e.y=pos.y;}for(let i=0;i<9;i++)lateShot(e,i*TAU/9+G.t*.1,225,e.dmg*.52);finishLateSpecial(e);}
  else if(e.type==='keeperHand'){for(const q of [-.5,-.25,0,.25,.5])lateShot(e,a+q,275-Math.abs(q)*45,e.dmg*.64);finishLateSpecial(e);}
  else if(e.type==='oathbound'){e.specialMode='oath';e.specialT=1.35;enemyHazard(e,'rift',e.x,e.y,0,.55,.42,{radius:92});}
  else finishLateSpecial(e);
}
function lateEnemySpecial(e,dt,d,dx,dy){
  const cfg=LATE_SPECIALS[e.type],p=G.player;if(!cfg)return false;
  e.specialCd=Math.max(0,(e.specialCd||0)-dt);e.specialPulse=Math.max(0,(e.specialPulse||0)-dt);
  if(e.specialMode==='tell'){
    e.specialT-=dt;if(e.specialT<=0)executeLateSpecial(e);return true;
  }
  if(e.specialMode==='dash'){
    e.specialT-=dt;const hit=moveEnt(G.world,e,Math.cos(e.specialA)*e.specialSpeed*dt,Math.sin(e.specialA)*e.specialSpeed*dt);
    if(e.specialTrail<.9){e.specialTrail-=dt;if(e.specialTrail<=0){e.specialTrail=.11;enemyHazard(e,G.world.lateKey==='foundry'?'shell':'rift',e.x,e.y,0,.12,.2,{radius:22,width:7});}}
    if(!e.specialHit&&d2(e.x,e.y,p.x,p.y)<(e.r+p.r+8)**2){hurtPlayer(e.dmg,e.x,e.y);e.specialHit=true;}
    if(hit&&e.specialBounces>0){e.specialBounces--;e.specialA+=Math.PI*.65+Math.sin(e.seed)*.35;}
    if(e.specialT<=0||hit&&e.specialBounces<=0)finishLateSpecial(e);return true;
  }
  if(e.specialMode==='suction'){
    e.specialT-=dt;const dd=Math.max(1,Math.hypot(p.x-e.x,p.y-e.y));if(p.dashT<=0){p.kbx+=(e.x-p.x)/dd*34;p.kby+=(e.y-p.y)/dd*34;}if(e.specialT<=0){enemyHazard(e,'ripple',e.x,e.y,0,.18,.3,{radius:64});finishLateSpecial(e);}return true;
  }
  if(e.specialMode==='phase'){
    e.specialT-=dt;const dd=Math.max(1,d);moveEnt(G.world,e,dx/dd*e.spd*2.15*dt,dy/dd*e.spd*2.15*dt);if(e.specialT<=0){e.alpha=1;for(let i=0;i<5;i++)lateShot(e,i*TAU/5,200,e.dmg*.48);finishLateSpecial(e);}return true;
  }
  if(e.specialMode==='tether'){
    e.specialT-=dt;const dd=Math.max(1,d);if(dd>75&&p.dashT<=0){p.kbx-=dx/dd*28;p.kby-=dy/dd*28;}if(e.specialT<=0){beginEnemyDash(e,Math.atan2(dy,dx),420,.3);}return true;
  }
  if(e.specialMode==='shell'||e.specialMode==='aura'||e.specialMode==='oath'){
    e.specialT-=dt;
    if(e.specialT<=0){if(e.specialMode==='shell')for(let i=0;i<7;i++)lateShot(e,i*TAU/7,220,e.dmg*.55);else if(e.specialMode==='oath')beginEnemyDash(e,Math.atan2(dy,dx),430,.38);else finishLateSpecial(e);if(e.specialMode==='shell')finishLateSpecial(e);}return true;
  }
  if(e.specialMode==='barrier'){
    e.specialT-=dt;if(e.specialT<=0)beginEnemyDash(e,Math.atan2(dy,dx),455,.42);return true;
  }
  if(e.specialCd<=0&&d<cfg.range&&['stalk','recover'].includes(e.action)){
    e.specialMode='tell';e.specialT=cfg.tell;e.specialA=Math.atan2(dy,dx);e.specialDistance=d;e.face=e.specialA;return true;
  }
  return false;
}
const LATE_GAITS={
 rippleLeech:{near:92,far:148,orbit:.12,tempo:1.18},pumpCrawler:{near:145,far:215,orbit:.56,tempo:.72},lampEel:{near:245,far:350,orbit:-.28,tempo:.82},sluiceGuard:{near:165,far:235,orbit:.08,tempo:.58},
 coalMite:{near:75,far:130,orbit:-.12,tempo:1.3},slagRunner:{near:125,far:205,orbit:.72,tempo:1.05},cinderValve:{near:260,far:370,orbit:.44,tempo:.68},hammerFrame:{near:135,far:205,orbit:-.05,tempo:.5},
 glassShard:{near:80,far:155,orbit:.34,tempo:1.42},lensMote:{near:285,far:410,orbit:-.5,tempo:.62},orbitHound:{near:120,far:205,orbit:.86,tempo:1.1},mirrorShell:{near:175,far:250,orbit:-.18,tempo:.46},
 inkMite:{near:78,far:145,orbit:-.38,tempo:1.18},pageWraith:{near:150,far:235,orbit:.66,tempo:.9},quillSentinel:{near:270,far:395,orbit:-.24,tempo:.6},indexer:{near:185,far:265,orbit:.06,tempo:.42},
 courtMask:{near:95,far:165,orbit:.48,tempo:1.28},ribbonDuelist:{near:125,far:215,orbit:-.92,tempo:1.02},hushBell:{near:250,far:355,orbit:.16,tempo:.54},mourningGuard:{near:180,far:255,orbit:-.06,tempo:.4},
 choirWisp:{near:86,far:160,orbit:.74,tempo:1.4},pinion:{near:115,far:210,orbit:-1.02,tempo:1.2},cantor:{near:270,far:405,orbit:.38,tempo:.58},bellAngel:{near:170,far:255,orbit:-.32,tempo:.48},
 obsidianPawn:{near:90,far:165,orbit:.04,tempo:1.08},chainHound:{near:120,far:210,orbit:.7,tempo:1.06},siegeEye:{near:300,far:440,orbit:-.12,tempo:.5},barrierKnight:{near:170,far:245,orbit:.03,tempo:.38},
 memoryAsh:{near:80,far:155,orbit:-.82,tempo:1.45},starRemnant:{near:145,far:245,orbit:.94,tempo:1.16},keeperHand:{near:260,far:400,orbit:-.52,tempo:.7},oathbound:{near:175,far:250,orbit:.09,tempo:.42}
};
function lateEnemyAI(e,dt,d,dx,dy){
  const p=G.player,w=G.world;e.actionT-=dt;e.face=Math.atan2(dy,dx);const role=e.lateRole,gait=LATE_GAITS[e.type]||{near:130,far:220,orbit:0,tempo:1};if(lateEnemySpecial(e,dt,d,dx,dy))return;
  if(e.action==='warn'){if(e.actionT>0)return;if(role==='ranged'){const n=e.elite?5:3;for(let i=0;i<n;i++)lateShot(e,e.face+(i-(n-1)/2)*.16,210+G.floor*1.4,e.dmg,e.col);e.action='recover';e.actionT=1.05;return;}e.action='strike';e.actionT=role==='guard'?.42:.28;e.strikeHit=false;return;}
  if(e.action==='strike'){
    const speed=role==='guard'?390:330,hit=moveEnt(w,e,Math.cos(e.face)*speed*dt,Math.sin(e.face)*speed*dt);if(!e.strikeHit&&d<e.r+p.r+9){hurtPlayer(e.dmg,e.x,e.y);e.strikeHit=true;}if(e.actionT<=0||hit){e.action='recover';e.actionT=role==='guard'?1.1:.72;}return;
  }
  if(e.action==='recover'){if(e.actionT<=0){e.action='stalk';e.actionT=rand(.35,.7);}return;}
  const dd=Math.max(1,d),phase=G.t*(2.1*gait.tempo)+(e.seed||0),cadence=.72+.28*Math.sin(phase),step=d>gait.far?1:d<gait.near?-.48:role==='rush'?.3:0;
  const side=gait.orbit*(role==='guard'?.34:1)*cadence,pace=e.spd*(role==='guard'?.88:1);
  moveEnt(w,e,(dx/dd*step-dy/dd*side)*pace*dt,(dy/dd*step+dx/dd*side)*pace*dt);
  const attackRange=role==='ranged'?Math.min(470,gait.far+80):role==='guard'?Math.max(190,gait.far-18):Math.max(145,gait.near+45);
  if(e.actionT<=0&&d<attackRange&&(role!=='ranged'||los(w,e.x,e.y,p.x,p.y))){e.action='warn';e.actionT=(role==='guard'?.72:role==='ranged'?.56:.42)/Math.max(.82,gait.tempo);}
}
function announceLateFloor(){const r=lateRegion(G.floor),f=lateFloorInfo(G.floor);if(!r||!f)return;T('chapterRegion').textContent='STAGE '+roman(r.stage)+' · '+r.name.toUpperCase();T('chapterPlace').textContent=f[0];T('chapterHint').textContent=f[1];chapterBannerT=4;T('chapterBanner').classList.add('visible');}
