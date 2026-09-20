const SECRET_ROOM_VERSION=1;
const SECRET_ROOM_TYPES={
 cache:{name:'THE HIDDEN CACHE',verb:'OPEN THE CACHE',line:'A box sits where the room should end.',reward:'Marks, essence, and a blessing'},
 workshop:{name:'THE LOST WORKSHOP',verb:'USE THE BENCH',line:'The tools are warm. Nobody has touched them in years.',reward:'Choose one lasting run improvement'},
 quiet:{name:'THE QUIET ROOM',verb:'REST A MOMENT',line:'Nothing follows you across the threshold.',reward:'Restore health and steady the Ember'},
 shrine:{name:'THE EMBER SHRINE',verb:'MAKE AN OFFERING',line:'Seven cups. Six are cold.',reward:'Trade health for Marks and power'},
 trial:{name:'THE CLOSED TRIAL',verb:'WAKE THE SEAL',line:'The floor is waiting for your answer.',reward:'Clear a short trial for a rich reward'},
 wager:{name:'THE WAGER ROOM',verb:'PLACE TWO MARKS',line:'The little wheel has no losing spaces. That is suspicious.',reward:'Risk two Marks for a rare prize'},
 echo:{name:'THE ECHO SANCTUARY',verb:'LISTEN',line:'The room remembers a sound the Archive missed.',reward:'A Seventh Mark may be hidden here'},
 cartographer:{name:'THE CARTOGRAPHER’S ROOM',verb:'READ THE WALL',line:'Every corridor is drawn except the one behind you.',reward:'Reveal this floor and its portal'},
 armory:{name:'THE FORGOTTEN ARMORY',verb:'BREAK THE SEAL',line:'No blades. Only shapes an Ember can remember.',reward:'Strengthen one of your blessings'},
 false:{name:'THE FALSE ROOM',verb:'CHECK THE BACK WALL',line:'The dust stops halfway across the floor.',reward:'Find what the room is hiding'},
 deep:{name:'THE DEEP ROOM',verb:'TOUCH THE LOW FLAME',line:'This chamber was old before the first stair.',reward:'Many Marks and a chance at a Seventh Mark'},
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
function secretShouldAppear(f,run){if(f<=2||bossFloorAt(f)||run.guardianMode)return false;if(!run.secretRoomsFound)return true;if(run.secretFloorGap>=4)return true;const odds=f<=10?.27:f<=50?.32:.36;return chance(odds);}
function secretTypeFor(f,run,seed){
 if(!run.secretRoomsFound)return'cache';
 if(run.secretMarks>=3&&f-run.secretLastShopFloor>=5&&((seed+f)%7===0||run.secretRoomsFound-run.secretShopsSeen*4>=5))return'shop';
 const early=['cache','workshop','quiet','cartographer','false'],middle=['cache','workshop','shrine','trial','wager','echo','cartographer','armory','false'],late=['workshop','shrine','trial','wager','echo','armory','deep','false'];
 const pool=f<=10?early:f<=30?middle:late;return pool[(seed+f*3+run.secretRoomsFound)%pool.length];
}
function planSecretRoom(w=G.world,f=G.floor){
 const run=secretRun();if(!w||!run||w.secretRoom!==undefined)return w?.secretRoom||null;
 if(!secretShouldAppear(f,run)){w.secretRoom=null;run.secretFloorGap++;return null;}
 const candidates=secretEligibleRooms(w);if(!candidates.length){w.secretRoom=null;run.secretFloorGap++;return null;}
 const pick=candidates[Math.min(candidates.length-1,Math.floor(Math.random()*Math.min(4,candidates.length)))],seed=Math.floor(Math.random()*1000000),type=secretTypeFor(f,run,seed),r=pick.r;
 const x=(r.cx+.5)*TILE,y=(r.y+.48)*TILE;
 w.secretRoom={version:SECRET_ROOM_VERSION,id:'secret-'+f+'-'+pick.i+'-'+seed,type,region:secretRegionKey(f),roomIndex:pick.i,x,y,seed,discovered:false,opened:false,claimed:false,trialStarted:false,trialComplete:false,purchased:[],wagerResolved:false,entered:0};
 run.secretFloorGap=0;return w.secretRoom;
}
function currentSecret(){return G.world?.secretRoom||null;}
function secretDistance(s=currentSecret()){return s&&G.player?Math.sqrt(d2(G.player.x,G.player.y,s.x,s.y)):Infinity;}
function revealSecret(s=currentSecret()){
 if(!s||s.discovered)return false;s.discovered=true;s.revealedAt=G.t;const run=secretRun();run.secretRoomsFound++;G.world.mmDirty=true;burst(s.x,s.y+12,28,SECRET_REGIONS[s.region].accent,175,.8,3,true);toast('A HIDDEN WAY OPENS',SECRET_ROOM_TYPES[s.type].name.toLowerCase());fieldNote('The wall has a seam now. Step closer and use it.',3.4);sfx('secretReveal');saveNow();return true;
}
function secretNear(range=86){const s=currentSecret();return s&&secretDistance(s)<range?s:null;}
function secretFlareReveal(){const s=currentSecret();if(s&&!s.discovered&&secretDistance(s)<145)revealSecret(s);}
function secretMarks(n,label){const run=secretRun();run.secretMarks=Math.max(0,run.secretMarks+n);T('secretMarks').textContent=run.secretMarks;addText(G.player.x,G.player.y-28,(n>0?'+':'')+n+' MARK'+(Math.abs(n)===1?'':'S'),'#edcf83',13);if(label)fieldNote(label,2.4);}
function secretOwnedMarkFor(s){
 const owned=secretMarkList(),next=SEVENTH_MARKS.find(m=>G.floor>=m.min&&!owned.includes(m.id));if(!next||!['echo','deep'].includes(s.type))return null;
 const force=G.floor>=next.min+8,roll=((s.seed%100)/100)<(s.type==='deep'?.42:.25);return force||roll?next:null;
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
 const f=secretRun().secretForge;if(kind==='bright'){f.damage=(f.damage||0)+.09;toast('BRIGHTENED CORE','+9% ability damage this descent');}
 else if(kind==='vessel'){f.health=(f.health||0)+10;toast('WIDENED VESSEL','+10 maximum health this descent');}
 else{f.speed=(f.speed||0)+.06;toast('SURE STEP','+6% movement speed this descent');}
 recalc();if(kind==='vessel')G.player.hp=Math.min(G.player.maxHp,G.player.hp+10);finishSecretReward(s,2,Math.round(2+G.floor*.2));
}
function beginSecretTrial(s){
 if(s.trialStarted)return;s.trialStarted=true;s.opened=true;const r=G.world.rooms[s.roomIndex],roster=specialEncounterRoster(),count=G.floor<=10?2:Math.min(6,3+Math.floor(G.floor/20));let made=0;for(let i=0;i<count;i++){const type=roster[(s.seed+i*3)%roster.length],rad=ETYPES[type]?.r||12,pos=safePosition(G.world,rand((r.x+1.2)*TILE,(r.x+r.w-1.2)*TILE),rand((r.y+1.8)*TILE,(r.y+r.h-1.2)*TILE),rad);if(!pos)continue;const e=spawnEnemy(type,pos.x,pos.y,G.floor>20&&i===count-1);e.secretTrialId=s.id;e.aggro=true;e.max*=1.2;e.hp=e.max;made++;}if(!made)s.trialComplete=true;
 closeSecretRoom();toast('THE CLOSED TRIAL','clear the room');fieldNote('The hidden seal is awake.',2.5);sfx('roomSeal');saveNow();
}
function resolveWager(s){
 if(s.wagerResolved||secretRun().secretMarks<2)return;s.wagerResolved=true;secretMarks(-2);const roll=s.seed%5;if(roll===0){secretMarks(9,'The wheel stops on seven.');grantSecretBlessing(2);}else if(roll<=2){secretMarks(5,'The little pointer lands crooked.');grantSecretBlessing(1);}else{secretMarks(3,'Moth would call that a win.');addEss(8+Math.floor(G.floor*.35));}s.claimed=true;sfx('secretClaim');saveNow();renderSecretRoom();
}
function secretPrimaryAction(){
 const s=currentSecret();if(!s||s.claimed)return;
 if(s.type==='cache'){grantSecretBlessing(G.floor>=20?1:0);finishSecretReward(s,4,5+Math.floor(G.floor*.3));}
 else if(s.type==='quiet'){G.player.hp=Math.min(G.player.maxHp,G.player.hp+G.player.maxHp*.55);G.player.hitCd=Math.max(G.player.hitCd,2);finishSecretReward(s,1,0);}
 else if(s.type==='shrine'){const cost=Math.max(1,Math.round(G.player.maxHp*.12));G.player.hp=Math.max(1,G.player.hp-cost);secretRun().secretForge.damage=(secretRun().secretForge.damage||0)+.06;recalc();finishSecretReward(s,5,0);}
 else if(s.type==='cartographer'){revealWholeFloor();finishSecretReward(s,2,0);}
 else if(s.type==='armory'){const o=randomOwnedUpgradable();if(o){G.run.up[o.id]++;recalc();addChip(o);toast(o.name.toUpperCase(),'blessing strengthened');}else grantSecretBlessing(1);finishSecretReward(s,3,0);}
 else if(s.type==='false'){grantSecretBlessing(1);finishSecretReward(s,3,Math.round(4+G.floor*.25));}
 else if(s.type==='deep'){grantSecretBlessing(2);finishSecretReward(s,7,Math.round(8+G.floor*.45));}
 else if(s.type==='echo'){finishSecretReward(s,2,Math.round(3+G.floor*.2));}
 else if(s.type==='wager')resolveWager(s);
 else if(s.type==='trial'){if(s.trialComplete)finishSecretReward(s,6,Math.round(7+G.floor*.35));else beginSecretTrial(s);}
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
 if(s.type==='workshop')for(const [id,name,desc]of[['bright','BRIGHTEN THE CORE','+9% ability damage'],['vessel','WIDEN THE VESSEL','+10 maximum health'],['step','TRUE THE STEP','+6% movement speed']]){const b=document.createElement('button');b.className='secret-choice';b.innerHTML='<strong>'+name+'</strong><span>'+desc+'</span>';on(b,'click',()=>forgeChoice(id,s));wrap.appendChild(b);}
 if(s.type==='shop')for(const item of secretShopStock(s)){const bought=s.purchased.includes(item.id),can=secretRun().secretMarks>=item.cost,b=document.createElement('button');b.className='secret-stock';b.disabled=bought||!can;b.innerHTML='<span class="secret-stock-glyph">'+(item.id==='seventh'?'✦':'◇')+'</span><span><strong>'+item.name+'</strong><small>'+item.desc+'</small></span><b>'+ (bought?'TAKEN':item.cost+' ◆')+'</b>';on(b,'click',()=>buySecretItem(item.id));wrap.appendChild(b);}
}
function renderSecretRoom(){
 const s=currentSecret();if(!s)return;const info=SECRET_ROOM_TYPES[s.type],region=SECRET_REGIONS[s.region],run=secretRun(),title=T('secretTitle');secretOverlay.style.setProperty('--secret-accent',region.accent);secretOverlay.style.setProperty('--secret-hot',region.hot);T('secretRegion').textContent=region.name;title.textContent=info.name;title.classList.toggle('long',info.name.length>19);T('secretLine').textContent=s.type==='shop'?['"You found the hinge. Most don’t."','"Marks first. Questions after."','"Don’t touch the blue wax."'][s.entered%3]:info.line;T('secretReward').textContent=s.claimed?'THIS ROOM HAS GIVEN WHAT IT KEPT':info.reward;T('secretMarks').textContent=run.secretMarks;T('secretMarkCount').textContent=secretMarkList().length+' / 7';const action=T('secretAction');action.hidden=s.type==='workshop'||s.type==='shop'||s.claimed;action.textContent=s.type==='wager'&&run.secretMarks<2?'NEED 2 MARKS':s.type==='trial'&&s.trialStarted&&!s.trialComplete?'TRIAL IN PROGRESS':info.verb;action.disabled=(s.type==='wager'&&run.secretMarks<2)||(s.type==='trial'&&s.trialStarted&&!s.trialComplete);secretChoiceButtons(s);T('secretRoomState').textContent=s.type==='shop'?'MOTH · KEEPER OF THE BACK ROOM':s.claimed?'THE ROOM IS QUIET':s.discovered?'PASSAGE FOUND':'UNREAD';
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
function drawSecretEntrance(ctx){
 const s=currentSecret();if(!s)return;const p=SECRET_REGIONS[s.region],t=save.motion?0:G.tAll,x=Math.round(s.x),y=Math.round(s.y),known=s.discovered;ctx.save();ctx.translate(x,y);ctx.imageSmoothingEnabled=false;ctx.globalCompositeOperation='source-over';ctx.fillStyle='#05070a';ctx.globalAlpha=known?.96:.24;ctx.fillRect(-43,-12,86,72);ctx.fillStyle=p.dark;ctx.fillRect(-37,-7,74,64);for(let i=0;i<7;i++){ctx.fillStyle=i%2?p.accent+'35':p.hot+'25';ctx.fillRect(-35+i*11,-5+(i%2)*4,7,known?55:37);}ctx.strokeStyle=known?p.accent:p.accent+'55';ctx.lineWidth=known?3:1;ctx.strokeRect(-41,-10,82,70);ctx.beginPath();ctx.moveTo(-28,58);ctx.lineTo(-28,12);ctx.quadraticCurveTo(0,-25,28,12);ctx.lineTo(28,58);ctx.stroke();
 if(s.region==='garden'){ctx.strokeStyle=p.accent;ctx.lineWidth=5;for(const q of[-1,1]){ctx.beginPath();ctx.moveTo(q*43,61);ctx.bezierCurveTo(q*55,26,q*16,16,q*27,-15);ctx.stroke();}}
 else if(s.region==='reservoir'){ctx.fillStyle=p.accent+'66';for(let i=0;i<5;i++)ctx.fillRect(-34+i*17,54,11,3);ctx.fillStyle=p.hot;ctx.fillRect(-29,-3,58,3);}
 else if(s.region==='foundry'){ctx.fillStyle=p.accent+'55';ctx.fillRect(-35,39,70,13);for(let i=0;i<5;i++)ctx.fillRect(-31+i*15,7,7,28);}
 else if(s.region==='observatory'){ctx.strokeStyle=p.hot+'aa';ctx.beginPath();ctx.moveTo(-30,4);ctx.lineTo(6,27);ctx.lineTo(-9,57);ctx.moveTo(6,27);ctx.lineTo(30,8);ctx.stroke();}
 else if(s.region==='archive'){for(let i=0;i<6;i++){ctx.fillStyle=i%2?p.accent+'55':p.hot+'44';ctx.fillRect(-34+i*12,1,8,54);}}
 else if(s.region==='court'){ctx.fillStyle='#5b263c99';ctx.beginPath();ctx.moveTo(-34,-5);ctx.lineTo(34,-5);ctx.lineTo(26,53);ctx.lineTo(5,42);ctx.lineTo(-11,59);ctx.lineTo(-32,46);ctx.fill();}
 else if(s.region==='choir'){ctx.strokeStyle=p.accent;ctx.beginPath();ctx.arc(0,10,16,0,Math.PI);ctx.stroke();ctx.fillStyle=p.hot;ctx.fillRect(-2,10,4,33);}
 else if(s.region==='citadel'){ctx.fillStyle=p.accent+'55';for(let i=0;i<5;i++){ctx.fillRect(-40+i*20,-8+i*9,12,12);ctx.fillRect(-39+i*20,-7+i*9,5,5);}}
 else if(s.region==='heart'){ctx.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const a=t*.2+i*TAU/7,rr=42+Math.sin(t+i)*4;ctx.save();ctx.translate(Math.cos(a)*rr,22+Math.sin(a)*rr*.7);ctx.rotate(a+Math.PI/4);ctx.fillStyle=i%2?p.accent:p.hot;ctx.globalAlpha=known?.75:.22;ctx.fillRect(-5,-5,10,10);ctx.restore();}}
 else{ctx.fillStyle=p.accent+'77';for(let i=0;i<7;i++)ctx.fillRect(-31+i*10,-1+(i%2)*6,4,known?54:32);}
 ctx.globalCompositeOperation='lighter';for(let i=0;i<(known?12:5);i++){const a=t*(.25+i*.013)+i*TAU/12,rr=known?53:34;ctx.fillStyle=i%3?p.accent:p.hot;ctx.globalAlpha=known?.25:.08;ctx.fillRect(Math.round(Math.cos(a)*rr)-1,24+Math.round(Math.sin(a)*rr*.55)-1,i%4?2:3,i%4?2:3);}ctx.restore();
}
function drawSecretMinimap(){const s=currentSecret();if(!s?.discovered)return;const c=T('mm'),x=c.getContext('2d'),w=G.world,scale=Math.min((c.width-14)/w.W,(c.height-14)/w.H),ox=(c.width-w.W*scale)/2,oy=(c.height-w.H*scale)/2;x.save();x.strokeStyle=SECRET_REGIONS[s.region].accent;x.lineWidth=1;x.setLineDash([2,2]);x.beginPath();x.moveTo(ox+s.x/TILE*scale,oy+s.y/TILE*scale);x.lineTo(ox+(s.x/TILE+.9)*scale,oy+(s.y/TILE-.9)*scale);x.stroke();x.setLineDash([]);x.fillStyle=s.claimed?'#776f64':'#f0ce7c';x.fillRect(ox+(s.x/TILE+.9)*scale-2,oy+(s.y/TILE-.9)*scale-2,4,4);x.restore();}

const secretStrikeMelee=strikeMelee;
strikeMelee=function(){const out=secretStrikeMelee();secretFlareReveal();return out;};
const secretUpdateBase=update;
update=function(dt){
 if(G.state==='playing'&&!G.descending){const s=secretNear(88);if(s&&interactQueued){interactQueued=false;if(!s.discovered)revealSecret(s);else enterSecretRoom(s);return;}}
 return secretUpdateBase(dt);
};
const secretKillEnemy=killEnemy;
killEnemy=function(e){const id=e?.secretTrialId,was=e?.dead;secretKillEnemy(e);if(!was&&e?.dead&&id){const s=currentSecret();if(s?.id===id&&!G.enemies.some(q=>!q.dead&&q.secretTrialId===id)){s.trialComplete=true;toast('THE TRIAL IS QUIET','the hidden chamber has opened again');fieldNote('Return to the seam and claim what it kept.',3);sfx('roomClear');saveNow();}}};
const secretRecalcBase=recalc;
recalc=function(){secretRecalcBase();if(!G.player||!G.run)return;const f=secretRun().secretForge;G.player.maxHp+=Math.floor(f.health||0);G.player.hp=Math.min(G.player.hp,G.player.maxHp);G.player.dmg*=1+(f.damage||0);G.player.speed*=1+(f.speed||0);};
const secretDrawPropsBase=drawProps;
drawProps=function(ctx){secretDrawPropsBase(ctx);drawSecretEntrance(ctx);};
const secretDrawMinimapBase=drawMinimap;
drawMinimap=function(){secretDrawMinimapBase();drawSecretMinimap();};
const secretUpdateHUDBase=updateHUD;
updateHUD=function(dt){secretUpdateHUDBase(dt);if(!G.player||G.state!=='playing')return;const s=secretNear(96);if(!s)return;T('promptTxt').textContent=s.discovered?'ENTER THE HIDDEN PASSAGE':'A DRAFT MOVES THROUGH THE WALL · USE OR FLARE';T('prompt').classList.add('on');};
const secretSnapshotBase=snapshotRun;
snapshotRun=function(){const state=G.state;if(state==='secret')G.state='paused';try{secretSnapshotBase();}finally{G.state=state;}if(save.resume&&G.world){save.resume.world.secretRoom=deepCopy(G.world.secretRoom??null);}};
const secretResumeBase=resumeRun;
resumeRun=function(){secretResumeBase();if(!G.run||!G.world)return;secretRun();secretMarkList();if(G.world.secretRoom===undefined&&!(G.world.specialEncounters?.length>=2))planSecretRoom();};
const secretValidateCheckpointBase=validateCheckpoint;
validateCheckpoint=function(r){const out=secretValidateCheckpointBase(r),s=r.world?.secretRoom;if(s!==undefined&&s!==null){if(typeof s!=='object'||!SECRET_ROOM_TYPES[s.type]||!SECRET_REGIONS[s.region]||!Number.isInteger(s.roomIndex)||s.roomIndex<0||s.roomIndex>=r.world.rooms.length||!Number.isFinite(s.x)||!Number.isFinite(s.y)||!Number.isInteger(s.seed)||!Array.isArray(s.purchased)||s.purchased.length>12||s.purchased.some(id=>typeof id!=='string'||id.length>40))throw Error('Invalid hidden room data');}if(r.run.secretMarks!==undefined&&(!Number.isInteger(r.run.secretMarks)||r.run.secretMarks<0||r.run.secretMarks>9999))throw Error('Invalid hidden room marks');if(r.run.secretLastShopFloor!==undefined&&(!Number.isInteger(r.run.secretLastShopFloor)||r.run.secretLastShopFloor< -99||r.run.secretLastShopFloor>1000000))throw Error('Invalid hidden shop record');const forge=r.run.secretForge;if(forge!==undefined){if(!forge||typeof forge!=='object'||Array.isArray(forge))throw Error('Invalid hidden room forge');for(const [key,value]of Object.entries(forge))if(!['damage','health','speed'].includes(key)||!Number.isFinite(value)||value<0||value>10000)throw Error('Invalid hidden room forge');}return out;};
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
document.documentElement.dataset.secretRooms='v1';
