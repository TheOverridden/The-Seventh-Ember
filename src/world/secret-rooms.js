const SECRET_ROOM_VERSION=3;
const SECRET_ROOM_TYPES={
 cache:{name:'THE HIDDEN CACHE',verb:'OPEN THE CACHE',line:'A box sits where the room should end.',reward:'A rare blessing, many Marks, and a large Essence cache'},
 workshop:{name:'THE LOST WORKSHOP',verb:'USE THE BENCH',line:'The tools are warm. Nobody has touched them in years.',reward:'Choose one major improvement for this descent'},
 quiet:{name:'THE QUIET ROOM',verb:'REST A MOMENT',line:'Nothing follows you across the threshold.',reward:'Fully restore the Ember, gain a ward, and take the room’s Marks'},
 shrine:{name:'THE EMBER SHRINE',verb:'MAKE AN OFFERING',line:'Seven cups. Six are cold.',reward:'Trade health for an Epic blessing, power, Marks, and Essence'},
 trial:{name:'THE CLOSED TRIAL',verb:'WAKE THE SEAL',line:'The floor is waiting for your answer.',reward:'Survive an elite trial for an exceptional reward'},
 wager:{name:'THE WAGER ROOM',verb:'PLACE THREE MARKS',line:'The little wheel has no losing spaces. That is suspicious.',reward:'Risk three Marks for an Epic or Mythic prize'},
 echo:{name:'THE ECHO SANCTUARY',verb:'LISTEN',line:'The room remembers a sound the Archive missed.',reward:'A Seventh Mark may be hidden here'},
 cartographer:{name:'THE CARTOGRAPHER’S ROOM',verb:'READ THE WALL',line:'Every corridor is drawn except the one behind you.',reward:'Reveal the floor and take six Marks with a large Essence cache'},
 armory:{name:'THE FORGOTTEN ARMORY',verb:'BREAK THE SEAL',line:'No blades. Only shapes an Ember can remember.',reward:'Strengthen two blessings and recover the room’s hoard'},
 false:{name:'THE FALSE ROOM',verb:'CHECK THE BACK WALL',line:'The dust stops halfway across the floor.',reward:'An Epic blessing, eight Marks, and a large Essence cache'},
 deep:{name:'THE DEEP ROOM',verb:'TOUCH THE LOW FLAME',line:'This chamber was old before the first stair.',reward:'A Mythic blessing, fifteen Marks, and a chance at a Seventh Mark'},
 shop:{name:'THE BACK ROOM',verb:'',line:'Moth has kept the lamp on.',reward:'Spend Marks on run-changing goods'}
};
const SECRET_REGIONS={
 gate:{name:'THE HOLLOW GATE',accent:'#9fb8cd',hot:'#e8d2a4',dark:'#111925',dust:'#8294a3',motif:'iron'},
 garden:{name:'THE ROOTBOUND GARDENS',accent:'#9dc184',hot:'#d6dca0',dark:'#101b16',dust:'#78936b',motif:'root'},
 reservoir:{name:'THE DROWNED RESERVOIR',accent:'#6ed2df',hot:'#b9f1df',dark:'#071a21',dust:'#5a9ba7',motif:'water'},
 foundry:{name:'THE EMBER FOUNDRY',accent:'#f28c52',hot:'#ffe19a',dark:'#20100c',dust:'#b55d3f',motif:'forge'},
 observatory:{name:'THE SHATTERED OBSERVATORY',accent:'#86deee',hot:'#e5fbff',dark:'#0d1725',dust:'#769cb4',motif:'glass'},
 archive:{name:'THE BURIED ARCHIVE',accent:'#d3c299',hot:'#fff0ba',dark:'#17150f',dust:'#9c8e70',motif:'paper'},
 court:{name:'THE SILENT COURT',accent:'#e0a0af',hot:'#ffe0cf',dark:'#1d1018',dust:'#a77b86',motif:'cloth'},
 choir:{name:'THE CHOIR SPIRE',accent:'#aabaff',hot:'#eef0ff',dark:'#101224',dust:'#7c85b8',motif:'bell'},
 citadel:{name:'THE BLACK CITADEL',accent:'#e27a58',hot:'#ffd0a3',dark:'#190d0b',dust:'#965341',motif:'chain'},
 heart:{name:'THE HEART OF THE STAR',accent:'#efc96f',hot:'#fff5bd',dark:'#191307',dust:'#b69655',motif:'star'}
};
const SEVENTH_MARKS=[
 {id:'stone',name:'MARK BENEATH STONE',min:3},
 {id:'water',name:'MARK BENEATH WATER',min:11},
 {id:'fire',name:'MARK BENEATH FIRE',min:16},
 {id:'glass',name:'MARK BEHIND GLASS',min:21},
 {id:'name',name:'MARK BETWEEN NAMES',min:26},
 {id:'song',name:'MARK WITHOUT A SONG',min:36},
 {id:'dawn',name:'MARK BEFORE DAWN',min:46}
];
const secretOverlay=T('secretRoom'),secretCanvas=T('secretCanvas'),secretCtx=secretCanvas.getContext('2d');
let secretAnim=0,secretOpenAt=0,secretPreviousState='playing';

function secretRegionKey(f=G.floor){if(f<=5)return'gate';if(f<=10)return'garden';return lateRegion(f)?.key||['reservoir','foundry','observatory','archive','court','choir','citadel','heart'][Math.floor(((f-11)%40+40)%40/5)]||'heart';}
function secretRun(){if(!G.run)return null;G.run.secretMarks=Math.max(0,Math.floor(G.run.secretMarks||0));G.run.secretRoomsFound=Math.max(0,Math.floor(G.run.secretRoomsFound||0));G.run.secretFloorGap=Math.max(0,Math.floor(G.run.secretFloorGap||0));G.run.secretShopsSeen=Math.max(0,Math.floor(G.run.secretShopsSeen||0));G.run.secretLastShopFloor=Number.isInteger(G.run.secretLastShopFloor)?G.run.secretLastShopFloor:-99;G.run.secretForge=G.run.secretForge&&typeof G.run.secretForge==='object'?G.run.secretForge:{};return G.run;}
function secretMarkList(){save.seventhMarks=Array.isArray(save.seventhMarks)?save.seventhMarks.filter(id=>SEVENTH_MARKS.some(m=>m.id===id)).filter((id,i,a)=>a.indexOf(id)===i):[];return save.seventhMarks;}
function secretEligibleRooms(w){const exit=w.rooms.indexOf(w.exit),blocked=new Set([0,exit,w.storyRoom,...(w.echoSanctuaries||[]),...(w.specialEncounters||[]).map(o=>o.roomIndex)]);return w.rooms.map((r,i)=>({r,i,depth:d2(r.cx,r.cy,w.rooms[0].cx,w.rooms[0].cy)})).filter(o=>!blocked.has(o.i)&&o.r.w>=8&&o.r.h>=7).sort((a,b)=>b.depth-a.depth);}
function secretShouldAppear(f,run){if(f<=3||bossFloorAt(f)||run.guardianMode)return false;const pity=run.secretRoomsFound?9:6;if(run.secretFloorGap>=pity)return true;const odds=f<=10?.08:f<=50?.1:.12;return chance(odds);}
function secretTypeFor(f,run,seed){
 if(!run.secretRoomsFound)return'cache';
 if(run.secretMarks>=3&&f-run.secretLastShopFloor>=5&&((seed+f)%7===0||run.secretRoomsFound-run.secretShopsSeen*4>=5))return'shop';
 const early=['cache','workshop','quiet','cartographer','false'],middle=['cache','workshop','shrine','trial','wager','echo','cartographer','armory','false'],late=['workshop','shrine','trial','wager','echo','armory','deep','false'];
 const pool=f<=10?early:f<=30?middle:late;return pool[(seed+f*3+run.secretRoomsFound)%pool.length];
}
function secretWallSites(w,r,keepClear=true){
 const sites=[],normals=[[0,1],[-1,0],[0,-1],[1,0]];
 for(let side=0;side<4;side++){
  const vertical=side%2===1,start=vertical?r.y+1:r.x+1,end=vertical?r.y+r.h-3:r.x+r.w-3,[nx,ny]=normals[side];
  for(let along=start;along<=end;along++){
   const tx=vertical?(side===1?r.x+r.w:r.x-1):along,ty=vertical?along:(side===0?r.y-1:r.y+r.h),at=(k,depth)=>({x:tx+(vertical?0:k)+nx*depth,y:ty+(vertical?k:0)+ny*depth});
   let valid=true;
   for(let k=-1;k<=2;k++){const q=at(k,0),back=at(k,-1);if(q.x<1||q.y<1||q.x>=w.W-1||q.y>=w.H-1||w.grid[q.y*w.W+q.x]!==0||w.grid[back.y*w.W+back.x]===1){valid=false;break;}}
   for(let k=0;k<2&&valid;k++)for(let depth=1;depth<=2;depth++){const q=at(k,depth);if(w.grid[q.y*w.W+q.x]!==1)valid=false;}
   if(!valid)continue;
   const wx=(tx+(vertical?.5:1))*TILE,wy=(ty+(vertical?1:.5))*TILE,x=wx+nx*TILE,y=wy+ny*TILE;
   if(keepClear&&[...(w.props||[]),...(w.torches||[]),...(w.hollowDecor||[]),...(w.lateDecor||[])].some(o=>Number.isFinite(o.x)&&Number.isFinite(o.y)&&d2(o.x,o.y,wx,wy)<64**2))continue;
   sites.push({tx,ty,side,x,y});
  }
 }
 return sites;
}
function secretWallPosition(s){
 const wall=s.wall;if(!wall)return null;const vertical=wall.side%2===1,[nx,ny]=[[0,1],[-1,0],[0,-1],[1,0]][wall.side];
 return {x:(wall.tx+(vertical?.5:1))*TILE,y:(wall.ty+(vertical?1:.5))*TILE,nx,ny,angle:[0,Math.PI/2,Math.PI,-Math.PI/2][wall.side]};
}
function anchorSecretRoom(s,w=G.world){
 if(!s||s.wall||!w)return s;const r=w.rooms[s.roomIndex];if(!r)return s;
 let sites=secretWallSites(w,r);if(!sites.length)sites=secretWallSites(w,r,false);sites.sort((a,b)=>d2(a.x,a.y,s.x,s.y)-d2(b.x,b.y,s.x,s.y));
 if(sites.length){const site=sites[0];s.wall={tx:site.tx,ty:site.ty,side:site.side};s.x=site.x;s.y=site.y;s.version=SECRET_ROOM_VERSION;s.inspected=!!(s.sealReady||s.listen>0||s.seals>0);}
 return s;
}
function planSecretRoom(w=G.world,f=G.floor){
 const run=secretRun();if(!w||!run||w.secretRoom!==undefined)return w?.secretRoom||null;
 if(!secretShouldAppear(f,run)){w.secretRoom=null;run.secretFloorGap++;return null;}
 const candidates=secretEligibleRooms(w).map(o=>({...o,sites:secretWallSites(w,o.r)})).filter(o=>o.sites.length);if(!candidates.length){w.secretRoom=null;run.secretFloorGap++;return null;}
 const pick=candidates[Math.min(candidates.length-1,Math.floor(Math.random()*Math.min(2,candidates.length)))],seed=Math.floor(Math.random()*1000000),type=secretTypeFor(f,run,seed),site=pick.sites[seed%pick.sites.length];
 w.secretRoom={version:SECRET_ROOM_VERSION,id:'secret-'+f+'-'+pick.i+'-'+seed,type,region:secretRegionKey(f),roomIndex:pick.i,x:site.x,y:site.y,wall:{tx:site.tx,ty:site.ty,side:site.side},seed,discovered:false,opened:false,claimed:false,trialStarted:false,trialComplete:false,purchased:[],wagerResolved:false,entered:0,inspected:false,listen:0,seals:0,sealReady:false};
 run.secretFloorGap=0;return w.secretRoom;
}
function currentSecret(){return anchorSecretRoom(G.world?.secretRoom)||null;}
function secretDistance(s=currentSecret()){return s&&G.player?Math.sqrt(d2(G.player.x,G.player.y,s.x,s.y)):Infinity;}
function revealSecret(s=currentSecret()){
 if(!s||s.discovered)return false;s.discovered=true;s.revealedAt=G.t;const run=secretRun();run.secretRoomsFound++;G.world.mmDirty=true;const wall=secretWallPosition(s);burst(wall?.x??s.x,wall?.y??s.y,28,SECRET_REGIONS[s.region].dust,95,.8,2,false);toast('A HIDDEN WAY OPENS',SECRET_ROOM_TYPES[s.type].name.toLowerCase());fieldNote('The wall slides back. There’s a room behind it.',3.4);sfx('secretReveal');saveNow();return true;
}
function secretNear(range=86){const s=currentSecret();if(!s||secretDistance(s)>=range||!G.player)return null;const r=G.world.rooms[s.roomIndex];return roomHasPoint(r,G.player.x,G.player.y)&&los(G.world,G.player.x,G.player.y,s.x,s.y)?s:null;}
function secretRoomClear(s=currentSecret()){if(!s||!G.world?.rooms)return false;const r=G.world.rooms[s.roomIndex];return !G.enemies.some(e=>!e.dead&&!e.isBoss&&e.x>r.x*TILE&&e.x<(r.x+r.w)*TILE&&e.y>r.y*TILE&&e.y<(r.y+r.h)*TILE);}
function secretFlareReveal(){const s=secretNear(58);if(!s||s.discovered||(s.seals||0)>=3||!s.inspected||!s.sealReady||!secretRoomClear(s))return false;const wall=secretWallPosition(s);if(wall&&d2(G.player.x,G.player.y,wall.x,wall.y)>(MELEE.reach+4)**2)return false;const angle=Math.atan2((wall?.y??s.y)-G.player.y,(wall?.x??s.x)-G.player.x);if(Math.abs(angleDiff(angle,G.player.meleeAngle))>MELEE.halfArc)return false;s.seals=Math.min(3,(s.seals||0)+1);const k=s.seals-1,x=wall?wall.x+Math.cos(wall.angle)*[-22,4,22][k]:s.x,y=wall?wall.y+Math.sin(wall.angle)*[-22,4,22][k]:s.y;burst(x,y,6,SECRET_REGIONS[s.region].dust,55,.35,2,false);if(s.seals<3)fieldNote(['One fastening breaks.','A second fastening breaks.'][s.seals-1],1.7);else fieldNote('It’s loose. Give it a push.',2.2);sfx('secretReveal');saveNow();return true;}
function secretMarks(n,label){const run=secretRun();run.secretMarks=Math.max(0,run.secretMarks+n);T('secretMarks').textContent=run.secretMarks;addText(G.player.x,G.player.y-28,(n>0?'+':'')+n+' MARK'+(Math.abs(n)===1?'':'S'),'#edcf83',13);if(label)fieldNote(label,2.4);}
function secretOwnedMarkFor(s){
 const owned=secretMarkList(),next=SEVENTH_MARKS.find(m=>G.floor>=m.min&&!owned.includes(m.id));if(!next||!['echo','deep'].includes(s.type))return null;
 const force=G.floor>=next.min+4,roll=((s.seed%100)/100)<(s.type==='deep'?.68:.42);return force||roll?next:null;
}
function grantSeventhMark(s){
 const mark=secretOwnedMarkFor(s);if(!mark)return false;secretMarkList().push(mark.id);markSave();T('secretMarkCount').textContent=save.seventhMarks.length+' / 7';toast(mark.name,save.seventhMarks.length===7?'the hidden lock is complete':'one line of the hidden lock');sfx('secretMark');return true;
}
function eligibleSecretCards(minR=0){return POOL.filter(o=>o.r>=minR&&(G.run.up[o.id]||0)<o.max&&(!o.unlock||armoryData()[o.unlock])&&G.floor>=(o.minFloor||1));}
function grantSecretBlessing(minR=0){
 const pool=eligibleSecretCards(minR);if(!pool.length){G.player.hp=Math.min(G.player.maxHp,G.player.hp+30);return null;}const top=pool.sort((a,b)=>b.r-a.r||Math.random()-.5).slice(0,Math.min(7,pool.length)),o=pickA(top);G.run.up[o.id]=(G.run.up[o.id]||0)+1;if(o.id==='hp')G.player.hp+=25;recalc();addChip(o);toast(o.name.toUpperCase(),RARITY[o.r]?.n+' blessing');sfx(o.r===3?'mythic':'buy');return o;
}
function revealWholeFloor(){const w=G.world;w.reveal.fill(1);w.mmDirty=true;G.portal.secretMapped=true;}
function randomOwnedUpgradable(){const list=POOL.filter(o=>(G.run.up[o.id]||0)>0&&(G.run.up[o.id]||0)<o.max);return list.length?pickA(list):null;}
function finishSecretReward(s,marks=2,ess=0){if(s.claimed)return;s.claimed=true;if(marks)secretMarks(marks);if(ess)addEss(ess);grantSeventhMark(s);sfx('secretClaim');saveNow();renderSecretRoom();}
function forgeChoice(kind,s){
 const f=secretRun().secretForge;if(kind==='bright'){f.damage=(f.damage||0)+.18;toast('BRIGHTENED CORE','+18% ability damage this descent');}
 else if(kind==='vessel'){f.health=(f.health||0)+24;toast('WIDENED VESSEL','+24 maximum health this descent');}
 else{f.speed=(f.speed||0)+.12;toast('SURE STEP','+12% movement speed this descent');}
 recalc();if(kind==='vessel')G.player.hp=Math.min(G.player.maxHp,G.player.hp+24);finishSecretReward(s,6,Math.round(15+G.floor*1.2));
}
function beginSecretTrial(s){
 if(s.trialStarted)return;s.trialStarted=true;s.opened=true;const r=G.world.rooms[s.roomIndex],roster=specialEncounterRoster(),count=G.floor<=10?4:Math.min(9,5+Math.floor(G.floor/16));let made=0;for(let i=0;i<count;i++){const type=roster[(s.seed+i*3)%roster.length],rad=ETYPES[type]?.r||12,pos=safePosition(G.world,rand((r.x+1.2)*TILE,(r.x+r.w-1.2)*TILE),rand((r.y+1.8)*TILE,(r.y+r.h-1.2)*TILE),rad);if(!pos)continue;const e=spawnEnemy(type,pos.x,pos.y,G.floor>12&&i>=count-2);e.secretTrialId=s.id;e.aggro=true;e.max*=1.55;e.hp=e.max;e.dmg*=1.2;made++;}if(!made)s.trialComplete=true;
 closeSecretRoom();toast('THE CLOSED TRIAL','clear the room');fieldNote('The hidden seal is awake.',2.5);sfx('roomSeal');saveNow();
}
function resolveWager(s){
 if(s.wagerResolved||secretRun().secretMarks<3)return;s.wagerResolved=true;secretMarks(-3);const roll=s.seed%5;if(roll===0){secretMarks(18,'The wheel stops on seven.');grantSecretBlessing(3);}else if(roll<=2){secretMarks(12,'The little pointer lands crooked.');grantSecretBlessing(2);}else{secretMarks(7,'Moth would call that a win.');addEss(35+Math.floor(G.floor*1.4));}s.claimed=true;sfx('secretClaim');saveNow();renderSecretRoom();
}
function secretPrimaryAction(){
 const s=currentSecret();if(!s||s.claimed)return;
 if(s.type==='cache'){grantSecretBlessing(G.floor>=20?2:1);finishSecretReward(s,9,24+Math.floor(G.floor*1.4));}
 else if(s.type==='quiet'){G.player.hp=G.player.maxHp;G.player.cardWard=Math.max(G.player.cardWard||0,G.player.maxHp*.25);G.player.hitCd=Math.max(G.player.hitCd,3);finishSecretReward(s,4,Math.round(10+G.floor*.7));}
 else if(s.type==='shrine'){const cost=Math.max(1,Math.round(G.player.maxHp*.18));G.player.hp=Math.max(1,G.player.hp-cost);secretRun().secretForge.damage=(secretRun().secretForge.damage||0)+.14;recalc();grantSecretBlessing(2);finishSecretReward(s,12,Math.round(12+G.floor));}
 else if(s.type==='cartographer'){revealWholeFloor();finishSecretReward(s,6,Math.round(18+G.floor));}
 else if(s.type==='armory'){for(let i=0;i<2;i++){const o=randomOwnedUpgradable();if(o){G.run.up[o.id]++;recalc();addChip(o);toast(o.name.toUpperCase(),'blessing strengthened');}else grantSecretBlessing(2);}finishSecretReward(s,8,Math.round(18+G.floor));}
 else if(s.type==='false'){grantSecretBlessing(2);finishSecretReward(s,8,Math.round(24+G.floor*1.25));}
 else if(s.type==='deep'){grantSecretBlessing(3);finishSecretReward(s,15,Math.round(45+G.floor*2.2));}
 else if(s.type==='echo'){grantSecretBlessing(1);finishSecretReward(s,7,Math.round(18+G.floor));}
 else if(s.type==='wager')resolveWager(s);
 else if(s.type==='trial'){if(s.trialComplete){grantSecretBlessing(2);finishSecretReward(s,14,Math.round(40+G.floor*1.8));}else beginSecretTrial(s);}
}
function secretShopStock(s){
 const all=[
  {id:'mend',name:'RESTITCHED HEART',cost:2,desc:'Restore 45% health.',buy(){G.player.hp=Math.min(G.player.maxHp,G.player.hp+G.player.maxHp*.45);}},
  {id:'map',name:'WARM-STONE MAP',cost:2,desc:'Reveal the entire floor and its portal.',buy(){revealWholeFloor();}},
  {id:'blessing',name:'BORROWED BLESSING',cost:5,desc:'Receive a rare-or-better run blessing.',buy(){grantSecretBlessing(2);}},
  {id:'temper',name:'TEMPERED MEMORY',cost:4,desc:'Raise one blessing you already carry.',buy(){const o=randomOwnedUpgradable();if(o){G.run.up[o.id]++;recalc();addChip(o);toast(o.name.toUpperCase(),'rank raised');}else grantSecretBlessing(1);}},
  {id:'vessel',name:'EMBERGLASS VESSEL',cost:6,desc:'+14 maximum health for this descent.',buy(){const f=secretRun().secretForge;f.health=(f.health||0)+14;recalc();G.player.hp=Math.min(G.player.maxHp,G.player.hp+14);}}
 ];
 const chosen=[all[(s.seed+1)%all.length],all[(s.seed+3)%all.length],all[(s.seed+4)%all.length]];if(secretMarkList().length===7)chosen.push({id:'seventh',name:'CINDER OF THE SEVENTH',cost:9,desc:'Receive a Mythic blessing. Once each descent.',buy(){grantSecretBlessing(3);}});return chosen;
}
function buySecretItem(id){
 const s=currentSecret(),item=secretShopStock(s).find(o=>o.id===id);if(!item||(s.purchased||[]).includes(id)||secretRun().secretMarks<item.cost)return;secretMarks(-item.cost);s.purchased.push(id);item.buy();s.claimed=s.purchased.length>=secretShopStock(s).length;toast(item.name,'Moth slides it across the table.');sfx('secretBuy');saveNow();renderSecretRoom();
}
function secretChoiceButtons(s){
 const wrap=T('secretChoices');wrap.replaceChildren();if(s.claimed)return;
 if(s.type==='workshop')for(const [id,name,desc]of[['bright','BRIGHTEN THE CORE','+18% ability damage'],['vessel','WIDEN THE VESSEL','+24 maximum health'],['step','TRUE THE STEP','+12% movement speed']]){const b=document.createElement('button');b.className='secret-choice';b.innerHTML='<strong>'+name+'</strong><span>'+desc+'</span>';on(b,'click',()=>forgeChoice(id,s));wrap.appendChild(b);}
 if(s.type==='shop')for(const item of secretShopStock(s)){const bought=s.purchased.includes(item.id),can=secretRun().secretMarks>=item.cost,b=document.createElement('button');b.className='secret-stock';b.disabled=bought||!can;b.innerHTML='<span class="secret-stock-glyph">'+(item.id==='seventh'?'✦':'◇')+'</span><span><strong>'+item.name+'</strong><small>'+item.desc+'</small></span><b>'+ (bought?'TAKEN':item.cost+' ◆')+'</b>';on(b,'click',()=>buySecretItem(item.id));wrap.appendChild(b);}
}
function renderSecretRoom(){
 const s=currentSecret();if(!s)return;const info=SECRET_ROOM_TYPES[s.type],region=SECRET_REGIONS[s.region],run=secretRun(),title=T('secretTitle');secretOverlay.style.setProperty('--secret-accent',region.accent);secretOverlay.style.setProperty('--secret-hot',region.hot);T('secretRegion').textContent=region.name;title.textContent=info.name;title.classList.toggle('long',info.name.length>19);T('secretLine').textContent=s.type==='shop'?['"You found the hinge. Most don’t."','"Marks first. Questions after."','"Don’t touch the blue wax."'][s.entered%3]:info.line;T('secretReward').textContent=s.claimed?'THIS ROOM HAS GIVEN WHAT IT KEPT':info.reward;T('secretMarks').textContent=run.secretMarks;T('secretMarkCount').textContent=secretMarkList().length+' / 7';const action=T('secretAction');action.hidden=s.type==='workshop'||s.type==='shop'||s.claimed;action.textContent=s.type==='wager'&&run.secretMarks<3?'NEED 3 MARKS':s.type==='trial'&&s.trialStarted&&!s.trialComplete?'TRIAL IN PROGRESS':info.verb;action.disabled=(s.type==='wager'&&run.secretMarks<3)||(s.type==='trial'&&s.trialStarted&&!s.trialComplete);secretChoiceButtons(s);T('secretRoomState').textContent=s.type==='shop'?'MOTH · KEEPER OF THE BACK ROOM':s.claimed?'THE ROOM IS QUIET':s.discovered?'PASSAGE FOUND':'UNREAD';
}
function enterSecretRoom(s=currentSecret()){
 if(!s||!s.discovered)return;s.opened=true;s.entered=(s.entered||0)+1;if(s.type==='shop'){const run=secretRun();if(!s.shopCounted){s.shopCounted=true;run.secretShopsSeen++;run.secretLastShopFloor=G.floor;}}secretPreviousState=G.state;G.state='secret';G.paused=true;clearInput();document.body.classList.add('secret-open');show('secretRoom');renderSecretRoom();secretOpenAt=performance.now();cancelAnimationFrame(secretAnim);secretAnim=requestAnimationFrame(drawSecretFrame);sfx('secretOpen');saveNow();setTimeout(()=>T('secretLeave').focus({preventScroll:true}),60);
}
function closeSecretRoom(){if(!secretOverlay.classList.contains('open'))return;hide('secretRoom');document.body.classList.remove('secret-open');cancelAnimationFrame(secretAnim);G.state=secretPreviousState==='playing'?'playing':secretPreviousState;G.paused=false;if(G.player)G.player.hitCd=Math.max(G.player.hitCd,.8);T('cv').focus({preventScroll:true});saveNow();}
function secretPx(c,x,y,w,h,col,a=1){c.globalAlpha=a;c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function secretPerspective(c,p,w,h,t){
 const horizon=h*.32;c.fillStyle=p.dark;c.fillRect(0,0,w,h);const bg=c.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#030507');bg.addColorStop(.42,p.dark);bg.addColorStop(1,'#070706');c.fillStyle=bg;c.fillRect(0,0,w,h);
 c.fillStyle=p.accent+'16';c.beginPath();c.moveTo(w*.16,h);c.lineTo(w*.41,horizon);c.lineTo(w*.59,horizon);c.lineTo(w*.84,h);c.fill();c.strokeStyle=p.accent+'35';c.lineWidth=2;for(let i=0;i<9;i++){const y=horizon+Math.pow(i/8,1.75)*(h-horizon);c.beginPath();c.moveTo(w*.16-(y-horizon)*.18,y);c.lineTo(w*.84+(y-horizon)*.18,y);c.stroke();}for(let i=-5;i<=5;i++){c.beginPath();c.moveTo(w*.5+i*18,horizon);c.lineTo(w*.5+i*80,h);c.stroke();}
 c.fillStyle='#030405';c.fillRect(0,0,w*.13,h);c.fillRect(w*.87,0,w*.13,h);for(let i=0;i<7;i++){const y=18+i*68;secretPx(c,18,y,86,5,p.accent,.12);secretPx(c,w-104,y,86,5,p.accent,.12);secretPx(c,32,y+9,4,34,p.hot,.08);secretPx(c,w-36,y+9,4,34,p.hot,.08);}c.globalAlpha=1;
 const cx=w*.5,cy=horizon+12;for(let i=0;i<5;i++){c.strokeStyle=i===4?p.hot+'99':p.accent+(28+i*12).toString(16).padStart(2,'0');c.lineWidth=2+i*3;c.strokeRect(cx-112-i*18,cy-90-i*14,224+i*36,180+i*28);}c.fillStyle='#050607';c.fillRect(cx-104,cy-82,208,174);
 const glow=c.createRadialGradient(cx,cy+15,4,cx,cy+15,190);glow.addColorStop(0,p.accent+'35');glow.addColorStop(1,'transparent');c.fillStyle=glow;c.fillRect(cx-210,cy-190,420,380);
 for(let i=0;i<32;i++){const tt=(t*.012+i*31)%260,x=(i*83%w),y=h-((tt+i*41)%h);secretPx(c,x,y,i%7?2:3,i%7?2:3,i%3?p.accent:p.hot,.1+(i%4)*.045);}c.globalAlpha=1;
}
function drawSecretArchitecture(c,s,p,w,h,t){
 const cx=w*.5,cy=h*.37;
 if(s.region==='garden'){c.strokeStyle=p.accent+'aa';c.lineWidth=9;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(cx+i*82,h*.9);c.bezierCurveTo(cx+i*120,cy+120,cx+i*34,cy-30,cx+i*58,50);c.stroke();}for(let i=0;i<18;i++)secretPx(c,cx-170+(i*37)%340,74+(i*61)%270,4,4,i%4?p.accent:p.hot,.28);}
 else if(s.region==='reservoir'){c.strokeStyle=p.accent+'75';c.lineWidth=4;for(let i=-3;i<=3;i++){c.beginPath();c.moveTo(cx+i*52,45);c.lineTo(cx+i*52,cy+165);c.stroke();}for(let i=0;i<12;i++){const x=cx-280+i*51;secretPx(c,x,cy+170+Math.sin(t*.002+i)*4,34,2,p.hot,.22);}}
 else if(s.region==='foundry'){for(let i=-3;i<=3;i++){secretPx(c,cx+i*65-11,58,22,230,'#24120e',1);secretPx(c,cx+i*65-5,65,10,215,p.accent,.28);}secretPx(c,cx-230,cy+130,460,13,p.hot,.26);}
 else if(s.region==='observatory'){c.save();c.translate(cx,cy+15);for(let i=0;i<9;i++){c.rotate(TAU/9);c.strokeStyle=i%2?p.accent+'4f':p.hot+'68';c.lineWidth=3;c.strokeRect(42,-4,116,8);}c.restore();c.strokeStyle=p.hot+'55';c.lineWidth=2;c.beginPath();c.arc(cx,cy+15,118,0,TAU);c.stroke();}
 else if(s.region==='archive'){for(let side of[-1,1])for(let i=0;i<5;i++){const x=cx+side*(155+i%2*18),y=80+i*63;secretPx(c,x-34,y,68,43,'#211b12',1);for(let j=0;j<7;j++)secretPx(c,x-29+j*8,y+8,5,27,j%2?p.accent:p.hot,.2+(j%3)*.08);}}
 else if(s.region==='court'){for(let side of[-1,1]){c.fillStyle=side<0?'#3d1728':'#2e1b38';c.beginPath();c.moveTo(cx+side*130,45);c.lineTo(cx+side*300,95);c.lineTo(cx+side*250,360);c.lineTo(cx+side*110,320);c.fill();secretPx(c,cx+side*185,75,4,250,p.hot,.28);}}
 else if(s.region==='choir'){for(let i=0;i<7;i++){const x=cx-240+i*80,y=70+(i%2)*25;c.strokeStyle=p.accent+'73';c.lineWidth=3;c.beginPath();c.moveTo(x,0);c.lineTo(x,y);c.stroke();c.beginPath();c.arc(x,y+18,16,0,Math.PI);c.stroke();}}
 else if(s.region==='citadel'){for(let side of[-1,1]){for(let i=0;i<6;i++){const x=cx+side*(132+i*28),y=28+i*38;secretPx(c,x,y,16,16,'#0a0809',1);c.strokeStyle=p.accent+'55';c.strokeRect(x,y,16,16);}secretPx(c,cx+side*124,40,12,290,p.hot,.12);}}
 else if(s.region==='heart'){c.save();c.translate(cx,cy);c.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const a=t*.00012+i*TAU/7,rr=105+(i%2)*28;c.save();c.translate(Math.cos(a)*rr,Math.sin(a)*rr*.7);c.rotate(a+Math.PI/4);secretPx(c,-8,-8,16,16,i%2?p.accent:p.hot,.65);secretPx(c,-3,-6,6,7,'#fffbd5',.8);c.restore();}c.restore();}
 else{for(let side of[-1,1])for(let i=0;i<6;i++){const x=cx+side*(130+i*27),y=72+i*47;secretPx(c,x,y,48,28,'#18212a',1);secretPx(c,x+4,y+4,40,3,p.accent,.16);}for(let i=0;i<7;i++)secretPx(c,cx-150+i*50,54,7,245,p.hot,.07);}
}
function drawMoth(c,p,w,h,t){
 const x=w*.5,y=h*.49,bob=Math.sin(t*.0022)*4;c.save();c.translate(x,y+bob);c.globalCompositeOperation='lighter';const wing=Math.sin(t*.0017)*.08;for(const side of[-1,1]){c.save();c.scale(side,1);c.rotate(wing*side);c.fillStyle=p.accent+'2d';c.beginPath();c.moveTo(14,-35);c.lineTo(78,-78);c.lineTo(67,-15);c.lineTo(92,28);c.lineTo(27,18);c.closePath();c.fill();c.strokeStyle=p.hot+'68';c.lineWidth=2;c.stroke();for(let i=0;i<4;i++){c.strokeStyle=p.accent+'55';c.beginPath();c.moveTo(24,-24+i*13);c.lineTo(71,-55+i*23);c.stroke();}c.restore();}c.globalCompositeOperation='source-over';secretPx(c,-23,-37,46,79,'#0b0d11',1);secretPx(c,-18,-31,36,62,'#22202a',1);secretPx(c,-13,-26,26,21,p.accent,.16);secretPx(c,-9,-17,18,13,'#050609',1);secretPx(c,-6,-12,4,3,p.hot,.9);secretPx(c,2,-12,4,3,p.hot,.9);secretPx(c,-27,27,54,8,'#11131a',1);secretPx(c,-5,33,10,35,'#171923',1);c.strokeStyle=p.hot+'88';c.lineWidth=2;c.beginPath();c.moveTo(-31,8);c.lineTo(-66,36);c.lineTo(-80,74);c.stroke();secretPx(c,-84,72,16,4,p.hot,.7);c.restore();
}
function drawSecretFocal(c,s,p,w,h,t){
 const x=w*.5,y=h*.55;if(s.type==='shop'){drawMoth(c,p,w,h,t);for(let i=0;i<5;i++){secretPx(c,x-190+i*95,y+103,66,9,'#17130e',1);secretPx(c,x-182+i*95,y+88,50,18,p.accent,.12+(i%2)*.08);}return;}
 c.save();c.translate(x,y);c.globalCompositeOperation='source-over';
 if(s.type==='cache'||s.type==='false'){secretPx(c,-64,-23,128,58,'#120f0b',1);secretPx(c,-58,-17,116,46,p.accent,.22);secretPx(c,-5,-17,10,46,p.hot,.65);c.strokeStyle=p.hot+'aa';c.lineWidth=3;c.strokeRect(-64,-23,128,58);for(let i=0;i<7;i++){const a=t*.001+i*TAU/7;secretPx(c,Math.cos(a)*82-2,Math.sin(a)*34-2,4,4,p.hot,.55);}}
 else if(s.type==='workshop'||s.type==='armory'){secretPx(c,-126,26,252,20,'#19140f',1);secretPx(c,-114,-5,228,33,'#282018',1);for(let i=0;i<6;i++){secretPx(c,-104+i*42,-20-(i%2)*18,8,26,p.accent,.55);secretPx(c,-108+i*42,-25-(i%2)*18,16,6,p.hot,.5);}secretPx(c,-8,-58,16,64,p.hot,.65);}
 else if(s.type==='quiet'){for(let i=0;i<7;i++){const a=i*TAU/7+t*.0002;c.strokeStyle=p.accent+'77';c.lineWidth=3;c.beginPath();c.arc(0,0,36+i*12,a,a+3.8);c.stroke();}secretPx(c,-6,-18,12,36,p.hot,.85);secretPx(c,-2,-26,4,18,'#fff8d8',.9);}
 else if(s.type==='shrine'||s.type==='deep'){for(let i=0;i<7;i++){const a=i*TAU/7;c.save();c.rotate(a);secretPx(c,46,-6,34,12,p.accent,.38);secretPx(c,72,-3,9,6,p.hot,.8);c.restore();}secretPx(c,-18,-18,36,36,p.hot,.4);secretPx(c,-8,-8,16,16,'#fff3bf',.82);}
 else if(s.type==='trial'){c.strokeStyle=p.hot+'b8';c.lineWidth=4;for(let i=0;i<3;i++){c.beginPath();c.arc(0,0,35+i*28,t*.001*(i%2?1:-1),t*.001*(i%2?1:-1)+4.7);c.stroke();}secretPx(c,-11,-11,22,22,p.accent,.7);}
 else if(s.type==='wager'){c.save();c.rotate(t*.0008);c.strokeStyle=p.hot+'aa';c.lineWidth=5;c.beginPath();c.arc(0,0,72,0,TAU);c.stroke();for(let i=0;i<14;i++){c.rotate(TAU/14);secretPx(c,52,-4,22,8,i%2?p.accent:p.hot,.7);}c.restore();secretPx(c,-4,-92,8,33,'#fff0bc',.85);}
 else if(s.type==='echo'){for(let i=0;i<5;i++){c.strokeStyle=p.accent+(35+i*18).toString(16);c.lineWidth=2+i;c.beginPath();c.ellipse(0,0,28+i*18,58+i*10,0,t*.0003+i*.5,t*.0003+i*.5+4.7);c.stroke();}secretPx(c,-3,-30,6,60,p.hot,.74);}
 else if(s.type==='cartographer'){secretPx(c,-132,-82,264,164,'#191713',1);secretPx(c,-124,-74,248,148,'#c6ad7855',1);c.strokeStyle=p.hot+'8a';c.lineWidth=2;for(let i=0;i<11;i++){c.beginPath();c.moveTo(-112+(i*37)%210,-58+(i*23)%120);c.lineTo(-95+(i*61)%210,-45+(i*43)%120);c.lineTo(-72+(i*71)%210,-62+(i*29)%120);c.stroke();}secretPx(c,58,-18,7,7,'#fff4c0',.95);}
 c.restore();
}
function drawSecretFrame(now){
 if(!secretOverlay.classList.contains('open'))return;const s=currentSecret();if(!s)return;const p=SECRET_REGIONS[s.region],c=secretCtx,w=secretCanvas.width,h=secretCanvas.height,t=save.motion?2400:now-secretOpenAt;secretPerspective(c,p,w,h,t);drawSecretArchitecture(c,s,p,w,h,t);drawSecretFocal(c,s,p,w,h,t);const v=c.createRadialGradient(w*.5,h*.48,80,w*.5,h*.5,w*.58);v.addColorStop(0,'transparent');v.addColorStop(1,'rgba(0,0,0,.78)');c.fillStyle=v;c.fillRect(0,0,w,h);secretAnim=requestAnimationFrame(drawSecretFrame);
}
function drawSecretWallTexture(ctx,s){
 const stone=TILE_PAL[G.world.pi],region=s.region,p=SECRET_REGIONS[region],px=(x,y,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(x,y,w,h);};
 for(let row=0;row<3;row++){
  const y=-16+row*10,offset=row%2?-8:0;
  for(let x=-34+offset;x<34;x+=22){const left=Math.max(-34,x),width=Math.min(x+20,34)-left;if(width<=0)continue;px(left,y,width,8,(row+Math.floor(x/22))%2?stone.wb:stone.wa);px(left,y,width,2,stone.lip);px(left,y+6,width,2,stone.wc);}
 }
 if(region==='gate'){
  px(-18,-6,28,2,stone.wb);px(-16,-6,2,10,stone.mo);px(-16,2,20,2,stone.mo);px(4,2,2,10,stone.mo);px(-14,-4,2,6,stone.lip);px(-4,12,22,2,stone.wb);px(-30,-12,6,2,p.dust);px(24,6,4,2,stone.lip);
 }else if(region==='garden'){
  for(const side of[-1,1]){const root='#40543b';px(side<0?-36:30,-16,6,18,root);px(side<0?-30:24,-4,6,10,root);px(side<0?-24:18,4,6,6,root);px(side<0?-18:12,8,6,4,root);px(side<0?-32:28,-14,2,14,'#7d8a5b');px(side<0?-28:22,-4,2,8,'#7d8a5b');px(side<0?-24:18,0,8,2,'#8d9c6b');px(side<0?-18:10,6,8,2,'#4a6a46');}px(-10,-4,20,10,stone.wb);px(-6,-6,12,2,stone.lip);px(-34,10,8,4,'#526f48');px(28,12,6,4,'#526f48');
 }else if(region==='reservoir'){
  for(const x of[-34,-28,26,32]){px(x,-14,4,26,'#16292f');px(x,-10,2,18,'#335258');}px(-22,-12,42,22,stone.wa);px(-18,-12,34,2,stone.lip);px(-32,10,18,4,'#406064');px(12,10,22,4,'#406064');px(-12,10,22,2,stone.wb);px(-28,2,8,2,'#608080');px(22,4,10,2,'#608080');px(-18,-6,4,2,p.dust);
 }else if(region==='foundry'){
  px(-34,-14,68,28,'#352521');px(-34,-14,68,2,'#6b4735');px(-34,12,68,2,'#181513');px(-4,-12,2,24,'#181513');px(-2,-10,2,18,'#80604a');px(-28,-8,20,2,'#51372d');px(8,-4,18,2,'#6f5140');for(const x of[-28,28])for(const y of[-10,8]){px(x,y,4,4,'#171413');px(x,y,2,2,'#94765a');}px(-32,10,26,2,'#171413');px(10,10,22,2,'#171413');px(-6,10,16,2,'#654c3c');
 }else if(region==='observatory'){
  for(let i=0;i<6;i++){const x=-30+i*10;px(x,-12+(i%3)*6,8,2,'#6d838d');px(x+2,-10+(i%3)*6,2,6,'#324655');}px(-18,-4,12,2,'#9daaaa');px(-6,-2,10,2,'#9daaaa');px(4,4,14,2,'#9daaaa');px(16,6,2,6,'#465b69');px(18,10,10,2,'#465b69');px(-8,0,2,4,stone.mo);px(-12,2,6,2,stone.mo);px(24,-12,4,2,p.dust);
 }else if(region==='archive'){
  for(let i=0;i<3;i++){const x=-28+i*22;for(let j=0;j<4;j++){const y=-12+j*6,len=6+((s.seed+i+j)%3)*2;px(x,y,len,2,'#8c8576');px(i===1?x+len-2:x,y+2,2,2,'#605d54');}}px(-4,-14,2,26,stone.mo);px(-2,-12,2,20,stone.lip);px(-26,14,14,2,'#a39a83');px(-8,12,4,2,'#a39a83');
 }else if(region==='court'){
  for(let i=0;i<8;i++){const x=-34+i*9,y=(i===3||i===4)?-2:-6;px(x,y,4,8,'#625054');px(x+4,y+4,4,2,'#88716e');px(x+2,y+2,2,4,'#a28a7f');}px(-26,10,52,2,'#302027');px(-26,12,20,2,'#7f635e');px(10,12,16,2,'#7f635e');px(0,10,6,4,stone.wb);
 }else if(region==='choir'){
  for(let i=0;i<7;i++){const x=-30+i*10;px(x,-12,2,24,'#192032');px(x+2,-12,2,22,'#60677c');px(x,8,6,2,'#424a60');}px(-10,-6,20,14,stone.wb);for(const x of[-8,2]){px(x,-6,2,14,'#192032');px(x+2,-6,2,12,'#60677c');}px(-10,8,20,2,'#777b88');px(-28,14,8,2,p.dust);
 }else if(region==='citadel'){
  px(-34,-14,68,28,'#282329');for(let i=0;i<3;i++){const x=-32+i*22;px(x,-12,20,24,'#403438');px(x,-12,20,2,'#685256');px(x+18,-10,2,22,'#17161c');px(x+2,-8,2,2,'#987c6b');px(x+2,8,2,2,'#987c6b');}px(-12,-12,22,2,'#403438');px(-12,-10,20,2,'#685256');px(-12,10,20,2,'#17161c');px(8,-8,2,16,'#17161c');px(-10,14,14,2,'#8c7368');
 }else{
  for(let i=0;i<6;i++){const x=-34+i*12,y=-10+(i%2)*8;px(x,y,8,2,'#9b825f');px(x+6,y,2,6,'#665944');px(x+6,y+4,8,2,'#9b825f');}px(-10,-2,8,2,stone.wb);px(-8,0,8,2,'#b19b77');px(-2,2,2,8,'#b19b77');px(0,8,10,2,'#b19b77');px(-26,10,4,2,p.dust);px(24,-10,4,2,p.dust);
 }
 for(let i=0;i<3;i++){
  const x=[-22,4,22][i];px(x,6,4,4,stone.wc);
  if(i<(s.seals||0)){px(x-2,8,8,2,stone.mo);px(x+2,10,2,4,stone.mo);}
  else if(s.sealReady){px(x,6,2,2,p.hot);px(x+2,8,2,2,p.dust);}
  else px(x,6,2,2,stone.wb);
 }
}
function drawSecretEntrance(ctx){
 const s=currentSecret(),wall=s&&secretWallPosition(s);if(!wall||!G.player)return;
 if(wall.x<G.cam.x-80||wall.x>G.cam.x+G.w+80||wall.y<G.cam.y-80||wall.y>G.cam.y+G.h+80)return;
 const r=G.world.rooms[s.roomIndex],visible=roomHasPoint(r,G.player.x,G.player.y)&&los(G.world,G.player.x,G.player.y,s.x,s.y);
 if(!s.discovered&&!visible)return;
 ctx.save();ctx.translate(Math.round(wall.x),Math.round(wall.y));ctx.rotate(wall.angle);ctx.imageSmoothingEnabled=false;ctx.beginPath();ctx.rect(-36,-18,72,36);ctx.clip();
 if(!s.discovered)drawSecretWallTexture(ctx,s);
 else{
  const stone=TILE_PAL[G.world.pi],p=SECRET_REGIONS[s.region],age=G.t-(s.revealedAt??-100),u=save.motion?1:clamp(age/.85,0,1),slide=Math.round((1-Math.pow(1-u,3))*24/2)*2;
  ctx.fillStyle='#05070a';ctx.fillRect(-36,-18,72,36);ctx.fillStyle=p.dark;ctx.fillRect(-20,-14,40,24);ctx.fillStyle='#05070a';ctx.fillRect(-14,-16,28,18);
  for(let i=0;i<3;i++){ctx.fillStyle=i%2?stone.wb:stone.wc;ctx.fillRect(-12-i*4,2+i*4,24+i*8,2);ctx.fillStyle=p.dust;ctx.fillRect(-10-i*4,2+i*4,20+i*8,1);}
  for(const side of[-1,1]){ctx.save();ctx.translate(side*slide,0);ctx.beginPath();ctx.rect(side<0?-36:0,-18,36,36);ctx.clip();drawSecretWallTexture(ctx,s);ctx.restore();}
  ctx.fillStyle=stone.lip;ctx.fillRect(-24,-18,48,2);ctx.fillStyle=stone.wc;ctx.fillRect(-24,16,48,2);ctx.fillStyle=p.dust;ctx.fillRect(-24,-16,2,32);ctx.fillRect(22,-16,2,32);ctx.fillStyle=p.hot;ctx.fillRect(-20,12,40,2);
 }
 ctx.restore();
}
function drawSecretMinimap(){
 const s=currentSecret(),wall=s&&secretWallPosition(s);if(!s?.discovered||!wall)return;const c=T('mm'),x=c.getContext('2d'),w=G.world,scale=Math.min((c.width-14)/w.W,(c.height-14)/w.H),ox=(c.width-w.W*scale)/2,oy=(c.height-w.H*scale)/2,tx=wall.x/TILE-wall.nx*.5,ty=wall.y/TILE-wall.ny*.5;
 x.save();x.strokeStyle=SECRET_REGIONS[s.region].dust;x.lineWidth=1;x.beginPath();x.moveTo(ox+s.x/TILE*scale,oy+s.y/TILE*scale);x.lineTo(ox+tx*scale,oy+ty*scale);x.stroke();x.fillStyle=s.claimed?'#776f64':'#f0ce7c';x.fillRect(ox+tx*scale-2,oy+ty*scale-2,4,4);x.restore();
}
function inspectSecretRoom(s){
 if(!s.inspected){s.inspected=true;s.listen=0;s.listenX=G.player.x;s.listenY=G.player.y;saveNow();}
 if((s.seals||0)>=3)revealSecret(s);
 else if(s.sealReady)fieldNote('Three fastenings. Break them with Flare.',2.2);
 else fieldNote('That part sounds hollow. Stay still and listen.',2.4);
}
function listenAtSecretRoom(s,dt){
 if(!s.inspected||s.sealReady)return;const p=G.player,moved=Math.hypot(p.x-(s.listenX??p.x),p.y-(s.listenY??p.y));s.listenX=p.x;s.listenY=p.y;
 if(secretDistance(s)<48&&moved<1.2)s.listen=Math.min(2.4,(s.listen||0)+dt);else s.listen=Math.max(0,(s.listen||0)-dt*.6);
 if(s.listen>=2.25){s.sealReady=true;fieldNote('Three small catches lifted. Flare can break them.',2.8);sfx('secretOpen');saveNow();}
}

const secretStrikeMelee=strikeMelee;
strikeMelee=function(){const out=secretStrikeMelee();secretFlareReveal();return out;};
const secretUpdateBase=update;
update=function(dt){
 if(G.state==='playing'&&!G.descending){const s=secretNear(58);if(s){if(s.discovered&&interactQueued){interactQueued=false;enterSecretRoom(s);return;}if(!s.discovered&&secretRoomClear(s)){listenAtSecretRoom(s,dt);if(interactQueued){interactQueued=false;inspectSecretRoom(s);return;}}}}
 return secretUpdateBase(dt);
};
const secretKillEnemy=killEnemy;
killEnemy=function(e){const id=e?.secretTrialId,was=e?.dead;secretKillEnemy(e);if(!was&&e?.dead&&id){const s=currentSecret();if(s?.id===id&&!G.enemies.some(q=>!q.dead&&q.secretTrialId===id)){s.trialComplete=true;toast('THE TRIAL IS QUIET','the hidden chamber has opened again');fieldNote('Return to the seam and claim what it kept.',3);sfx('roomClear');saveNow();}}};
const secretRecalcBase=recalc;
recalc=function(){secretRecalcBase();if(!G.player||!G.run)return;const f=secretRun().secretForge;G.player.maxHp+=Math.floor(f.health||0);G.player.hp=Math.min(G.player.hp,G.player.maxHp);G.player.dmg*=1+(f.damage||0);G.player.speed*=1+(f.speed||0);};
const secretDrawPropsBase=drawProps;
drawProps=function(ctx){drawSecretEntrance(ctx);secretDrawPropsBase(ctx);};
const secretDrawMinimapBase=drawMinimap;
drawMinimap=function(){secretDrawMinimapBase();drawSecretMinimap();};
const secretUpdateHUDBase=updateHUD;
updateHUD=function(dt){secretUpdateHUDBase(dt);if(!G.player||G.state!=='playing')return;const s=secretNear(58);if(!s||!s.discovered&&(!s.inspected||!secretRoomClear(s)))return;T('promptTxt').textContent=s.discovered?'ENTER THE HIDDEN PASSAGE':(s.seals||0)>=3?'PUSH THE LOOSE WALL · USE':s.sealReady?'BREAK THE CATCHES · FLARE':'KEEP STILL AND LISTEN';T('prompt').classList.add('on');};
const secretSnapshotBase=snapshotRun;
snapshotRun=function(){const state=G.state;if(state==='secret')G.state='paused';try{secretSnapshotBase();}finally{G.state=state;}if(save.resume&&G.world){save.resume.world.secretRoom=deepCopy(G.world.secretRoom??null);}};
const secretResumeBase=resumeRun;
resumeRun=function(){secretResumeBase();if(!G.run||!G.world)return;secretRun();secretMarkList();anchorSecretRoom(G.world.secretRoom);if(G.world.secretRoom===undefined&&!(G.world.specialEncounters?.length>=2))planSecretRoom();};
const secretValidateCheckpointBase=validateCheckpoint;
validateCheckpoint=function(r){const out=secretValidateCheckpointBase(r),s=r.world?.secretRoom;if(s!==undefined&&s!==null){if(typeof s!=='object'||!SECRET_ROOM_TYPES[s.type]||!SECRET_REGIONS[s.region]||!Number.isInteger(s.roomIndex)||s.roomIndex<0||s.roomIndex>=r.world.rooms.length||!Number.isFinite(s.x)||s.x<0||s.x>r.world.W*TILE||!Number.isFinite(s.y)||s.y<0||s.y>r.world.H*TILE||!Number.isInteger(s.seed)||!Array.isArray(s.purchased)||s.purchased.length>12||s.purchased.some(id=>typeof id!=='string'||id.length>40))throw Error('Invalid hidden room data');if(s.wall!==undefined){const a=s.wall;if(!a||!Number.isInteger(a.tx)||!Number.isInteger(a.ty)||!Number.isInteger(a.side)||a.side<0||a.side>3||a.tx<1||a.ty<1||a.tx>=r.world.W-1||a.ty>=r.world.H-1)throw Error('Invalid hidden wall');const vertical=a.side%2===1,[nx,ny]=[[0,1],[-1,0],[0,-1],[1,0]][a.side],x=(a.tx+(vertical?.5:1))*TILE+nx*TILE,y=(a.ty+(vertical?1:.5))*TILE+ny*TILE;if(Math.abs(s.x-x)>.01||Math.abs(s.y-y)>.01||!roomHasPoint(r.world.rooms[s.roomIndex],x,y,12))throw Error('Invalid hidden wall position');for(let k=0;k<2;k++)if(r.world.grid[(a.ty+(vertical?k:0))*r.world.W+a.tx+(vertical?0:k)]!==0)throw Error('Invalid hidden wall');}if(s.inspected!==undefined&&typeof s.inspected!=='boolean')throw Error('Invalid hidden room inspection');}if(r.run.secretMarks!==undefined&&(!Number.isInteger(r.run.secretMarks)||r.run.secretMarks<0||r.run.secretMarks>9999))throw Error('Invalid hidden room marks');if(r.run.secretLastShopFloor!==undefined&&(!Number.isInteger(r.run.secretLastShopFloor)||r.run.secretLastShopFloor< -99||r.run.secretLastShopFloor>1000000))throw Error('Invalid hidden shop record');const forge=r.run.secretForge;if(forge!==undefined){if(!forge||typeof forge!=='object'||Array.isArray(forge))throw Error('Invalid hidden room forge');for(const [key,value]of Object.entries(forge))if(!['damage','health','speed'].includes(key)||!Number.isFinite(value)||value<0||value>10000)throw Error('Invalid hidden room forge');}return out;};
const secretValidateSaveBase=validateSave;
validateSave=function(raw){const clean=secretValidateSaveBase(raw);clean.seventhMarks=Array.isArray(raw?.seventhMarks)?raw.seventhMarks.filter(id=>SEVENTH_MARKS.some(m=>m.id===id)).filter((id,i,a)=>a.indexOf(id)===i):[];return clean;};
const secretBlockingBase=anyBlockingOverlay;
anyBlockingOverlay=function(){return secretOverlay.classList.contains('open')||secretBlockingBase();};
const secretEscBase=onEscKey;
onEscKey=function(){if(secretOverlay.classList.contains('open')){closeSecretRoom();return;}return secretEscBase();};
const secretSfxBase=sfx;
sfx=function(name,a){if(!['secretReveal','secretOpen','secretClaim','secretBuy','secretMark'].includes(name))return secretSfxBase(name,a);if(!AC||!save.sfx)return;if(name==='secretReveal'){thump(88,38,.42,.05);air(.7,.025,180,1280,.7,0,'bandpass');bell(392,.55,.012,.18,true);}else if(name==='secretOpen'){swell([98,146.83,196,293.66],1,.016,0);bell(587.33,.7,.009,.2,false);}else if(name==='secretBuy'){bell(523.25,.25,.012,0,false);bell(783.99,.35,.009,.08,false);}else if(name==='secretMark'){swell([130.81,196,261.63,392,523.25],1.2,.024,0);bell(1046.5,.9,.012,.3,true);}else{swell([174.61,261.63,349.23,523.25],.8,.018,0);}};

on(T('secretAction'),'click',secretPrimaryAction);
on(T('secretLeave'),'click',closeSecretRoom);
secretMarkList();
document.documentElement.dataset.secretRooms='v3';
