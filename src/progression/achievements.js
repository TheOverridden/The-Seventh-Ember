const ACHIEVEMENT_CATEGORIES={descent:'The Descent',combat:'Combat',blessings:'Blessings',mastery:'Mastery',exploration:'Exploration',endless:'Endless',archive:'The Archive'};
const ACHIEVEMENTS=[];
function achievementSeries(category,stat,rows){for(const [id,name,target,description,secret=false]of rows)ACHIEVEMENTS.push({id,name,target,description,secret,category,stat});}
achievementSeries('descent','runs',[
 ['firstDescent','Into the Hollow',1,'Begin your first descent.'],['runs10','Still Burning',10,'Begin 10 descents.'],['runs50','Habit of Returning',50,'Begin 50 descents.'],['runs100','A Hundred Sparks',100,'Begin 100 descents.']
]);
achievementSeries('descent','floor',[
 ['floor5','The Last Watch',5,'Reach floor 5.'],['floor10','Under the Roots',10,'Reach floor 10.'],['floor15','Below the Waterline',15,'Reach floor 15.'],['floor20','Into the Furnace',20,'Reach floor 20.'],['floor25','An Impossible Sky',25,'Reach floor 25.'],['floor30','The Missing Pages',30,'Reach floor 30.'],['floor35','Two Empty Thrones',35,'Reach floor 35.'],['floor40','Above the Choir',40,'Reach floor 40.'],['floor45','Walls Turned Inward',45,'Reach floor 45.'],['floor50','At the Heart',50,'Reach floor 50.']
]);
achievementSeries('descent','victories',[
 ['firstDawn','First Dawn',1,'Complete the campaign.'],['dawn5','Dawn Returns',5,'Complete the campaign 5 times.'],['dawn10','The Dark Remembers',10,'Complete the campaign 10 times.']
]);
achievementSeries('descent','level',[
 ['level10','A Growing Flame',10,'Reach level 10 in one descent.'],['level25','Gathering Heat',25,'Reach level 25 in one descent.'],['level50','White Heat',50,'Reach level 50 in one descent.'],['level80','Still Room to Grow',80,'Reach level 80 in one descent.']
]);
achievementSeries('combat','kills',[
 ['kills100','Ash on the Floor',100,'Defeat 100 enemies.'],['kills1000','A Thousand Cinders',1000,'Defeat 1,000 enemies.'],['kills10000','The Long Burn',10000,'Defeat 10,000 enemies.'],['kills50000','Nothing Left Cold',50000,'Defeat 50,000 enemies.']
]);
achievementSeries('combat','runKills',[
 ['runKills100','Room to Breathe',100,'Defeat 100 enemies in one descent.'],['runKills500','Through the Crowd',500,'Defeat 500 enemies in one descent.'],['runKills1000','An Ember Army',1000,'Defeat 1,000 enemies in one descent.']
]);
achievementSeries('combat','flareKills',[
 ['flare1','Close Enough',1,'Defeat an enemy with Flare.'],['flare100','Keep Your Distance',100,'Defeat 100 enemies with Flare.'],['flare1000','Within Reach',1000,'Defeat 1,000 enemies with Flare.']
]);
achievementSeries('combat','perfectReloads',[
 ['perfect1','Just in Time',1,'Perform a Perfect Rekindle.'],['perfect25','Good Timing',25,'Perform 25 Perfect Rekindles.'],['perfect100','Without Missing a Beat',100,'Perform 100 Perfect Rekindles.']
]);
achievementSeries('combat','cleanRooms',[
 ['cleanRoom1','Untouched',1,'Clear a combat room without losing health.'],['cleanRoom25','Light on Your Feet',25,'Clear 25 combat rooms without losing health.'],['cleanRoom100','No Loose Steps',100,'Clear 100 combat rooms without losing health.']
]);
achievementSeries('combat','cleanGuardian',[
 ['cleanGuardian1','Unbroken Flame',1,'Defeat a Guardian without losing health.']
]);
for(const g of GUARDIAN_ROSTER)achievementSeries('combat','guardian:'+g.key,[[
 'guardian_'+g.key,g.name.replace(/^THE /,'').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()),1,'Defeat '+g.name.toLowerCase()+'.'
]]);
achievementSeries('blessings','blessingCount',[
 ['blessings10','A Handful of Light',10,'Discover 10 different blessings.'],['blessings25','New Ways to Burn',25,'Discover 25 different blessings.'],['blessings50','A Full Deck',50,'Discover 50 different blessings.'],['blessings100','Collector of Sparks',100,'Discover 100 different blessings.'],['blessings150','The Growing Library',150,'Discover 150 different blessings.']
]);
achievementSeries('blessings','mythicCount',[
 ['mythic1','Something Rare',1,'Discover your first Mythic blessing.'],['mythic5','Five Impossible Things',5,'Discover 5 different Mythic blessings.'],['mythic15','A Pocket of Miracles',15,'Discover 15 different Mythic blessings.']
]);
achievementSeries('blessings','runBlessings',[
 ['build10','Finding a Shape',10,'Hold 10 different blessings in one descent.'],['build30','Many Moving Parts',30,'Hold 30 different blessings in one descent.'],['build60','A Walking Constellation',60,'Hold 60 different blessings in one descent.']
]);
achievementSeries('blessings','runMythics',[
 ['runMythic3','Three Wishes',3,'Hold 3 different Mythics in one descent.'],['runMythic7','Seven Impossible Things',7,'Hold 7 different Mythics in one descent.']
]);
achievementSeries('blessings','maxedBlessings',[
 ['blessingMax1','A Spark Perfected',1,'Master every rank of a blessing.'],['blessingMax10','Ten Bright Sparks',10,'Master 10 different blessings.']
]);
achievementSeries('blessings','stitchPins',[
 ['stitch3','Connect the Stars',3,'Hold three Starstitch pins at once.'],['stitch7','The Seventh Constellation',7,'Hold seven Starstitch pins at once.']
]);
achievementSeries('blessings','wishDrafts',[
 ['wish1','Make Another Wish',1,'Finish a Seventh Wish draft with two different choices.']
]);
achievementSeries('blessings','hearthGrowth',[
 ['hearth50','A Hearth That Grows',50,'Gain 50 maximum health through Hearth of the World in one descent.']
]);
achievementSeries('mastery','sigils',[
 ['sigil1','The First Mark',1,'Purchase a Skill Tree sigil.'],['sigils10','Taking Root',10,'Purchase 10 sigils.'],['sigils25','Spreading Branches',25,'Purchase 25 sigils.'],['sigils50','Deep Roots',50,'Purchase 50 sigils.'],['sigilsAll','The Whole Tree',TREE_NODES.length,'Purchase every Skill Tree sigil.']
]);
achievementSeries('mastery','essence',[
 ['essence1000','A Little to Keep',1000,'Recover 1,000 permanent Essence.'],['essence10000','A Full Lantern',10000,'Recover 10,000 permanent Essence.'],['essence100000','The Ember Hoard',100000,'Recover 100,000 permanent Essence.'],['essenceMillion','A Million Lights',1000000,'Recover 1,000,000 permanent Essence.']
]);
achievementSeries('mastery','forms',[
 ['form1','A Different Flame',1,'Unlock an additional Ember form.'],['forms5','Changing Shape',5,'Unlock 5 additional forms.'],['formsAll','Every Shape of Fire',EMBER_FORMS.filter(f=>f.req.length).length,'Unlock every additional form.']
]);
achievementSeries('mastery','evolutions',[
 ['evolution1','Something New',1,'Awaken a form evolution.'],['evolutions3','Threefold Flame',3,'Awaken three different form evolutions.']
]);
achievementSeries('exploration','secrets',[
 ['secret1','A Seam in the Stone',1,'Unseal a hidden passage.'],['secrets10','Behind the Walls',10,'Unseal 10 hidden passages.'],['secrets50','Nothing Stays Hidden',50,'Unseal 50 hidden passages.']
]);
achievementSeries('exploration','secretRegions',[
 ['secretRegions5','Other Doors',5,'Unseal passages in five different regions.'],['secretRegions10','Every Wall Has a Memory',10,'Unseal a passage in all ten regions.']
]);
achievementSeries('exploration','shopBuys',[
 ['moth1','Marks on the Table',1,'Buy something from Moth.'],['moth10','A Regular Customer',10,'Buy 10 things from Moth.']
]);
achievementSeries('exploration','marks',[
 ['mark1','A Kept Fragment',1,'Recover a Seventh Mark.'],['marksAll','The Seven Marks',7,'Recover all seven Seventh Marks.']
]);
achievementSeries('exploration','echoes',[
 ['echo1','Someone Was Here',1,'Witness a memory to its end.'],['echo5','Listening to the Rooms',5,'Witness five different memories to their end.'],['echo15','Voices in the Stone',15,'Witness fifteen different memories to their end.']
]);
achievementSeries('endless','depth',[
 ['depth1','Past the Dawn',1,'Reach Endless depth 1.'],['depth10','Below the Ending',10,'Reach Endless depth 10.'],['depth25','A Longer Night',25,'Reach Endless depth 25.'],['depth50','Another Fifty',50,'Reach Endless depth 50.'],['depth100','A Hundred Below',100,'Reach Endless depth 100.'],['depth150','The Far Dark',150,'Reach Endless depth 150.'],['depth200','Two Hundred Below',200,'Reach Endless depth 200.']
]);
achievementSeries('endless','wheelSpins',[
 ['wheel1','The First Turn',1,'Accept a Burden from the Endless wheel.'],['wheel10','The Weight Grows',10,'Accept 10 wheel results in one descent.'],['wheel25','Keep Turning',25,'Accept 25 wheel results in one descent.']
]);
achievementSeries('endless','burdenKinds',[
 ['burdens10','Ten Bad Things',10,'Carry 10 different Burdens at once.'],['burdens25','A Heavy Collection',25,'Carry 25 different Burdens at once.']
]);
achievementSeries('endless','calamities',[
 ['calamity1','It Gets Worse',1,'Carry a Calamity.'],['calamities3','Against the Odds',3,'Carry three Calamities at once.']
]);
achievementSeries('archive','archiveWins',[
 ['archive1','Answer the Record',1,'Clear a Guardian in the Archive.'],['archive10','All Ten Records',10,'Clear every Guardian in the Archive.']
]);
achievementSeries('archive','ascendantWins',[
 ['ascendant1','The Higher Bell',1,'Clear an Ascendant Guardian record.'],['ascendant10','Nothing Left Unanswered',10,'Clear every Ascendant Guardian record.']
]);
achievementSeries('archive','rushStandard',[
 ['rush1','Ten Bells',1,'Complete the standard Boss Rush.']
]);
achievementSeries('archive','rushNightfall',[
 ['nightfall1','Through Nightfall',1,'Complete the Nightfall Boss Rush.']
]);
achievementSeries('archive','rushClean',[
 ['rushClean1','Not a Scratch',1,'Complete a Boss Rush without taking a hit.']
]);
achievementSeries('archive','lastGuest',[
 ['lastGuest','One More Thing',1,'Answer the bell that should not have rung.',true]
]);
const ACHIEVEMENT_BY_ID=Object.fromEntries(ACHIEVEMENTS.map(a=>[a.id,a]));
const ACHIEVEMENT_STATS=new Set(ACHIEVEMENTS.map(a=>a.stat));
const achievementQueue=[];
let achievementRevision=0,achievementRendered=-1;
let achievementClock=0,achievementToastClock=0,achievementReturnFocus=null,achievementCategory='all',achievementStatus='all';
const achievementInert=[];

function cleanAchievements(raw){
 const out={version:1,unlocked:{},stats:{},blessings:[],mastered:[],evolutions:[],guardians:[],regions:[]};
 if(!raw||typeof raw!=='object')return out;
 for(const id of Object.keys(ACHIEVEMENT_BY_ID)){const at=raw.unlocked?.[id];if(Number.isFinite(at)&&at>0)out.unlocked[id]=Math.min(Date.now(),Math.floor(at));}
 for(const key of ACHIEVEMENT_STATS){const value=raw.stats?.[key];if(Number.isFinite(value)&&value>=0)out.stats[key]=Math.min(1e12,Math.floor(value));}
 const ids=new Set(POOL.map(o=>o.id));
 for(const key of ['blessings','mastered'])if(Array.isArray(raw[key]))out[key]=[...new Set(raw[key].filter(id=>ids.has(id)))];
 if(Array.isArray(raw.evolutions))out.evolutions=[...new Set(raw.evolutions.filter(id=>Object.hasOwn(EVOLUTION_BY_ID,id)))].slice(0,100);
 if(Array.isArray(raw.guardians))out.guardians=[...new Set(raw.guardians.filter(id=>GUARDIAN_ROSTER.some(g=>g.key===id)))];
 if(Array.isArray(raw.regions))out.regions=[...new Set(raw.regions.filter(id=>Object.hasOwn(SECRET_REGIONS,id)))];
 return out;
}
function achievementData(){if(save.achievements?.version!==1)save.achievements=cleanAchievements(save.achievements);return save.achievements;}
function achievementMax(key,value){const a=achievementData(),n=Math.max(0,Math.floor(Number(value)||0));if(n>(a.stats[key]||0)){a.stats[key]=Math.min(n,1e12);achievementRevision++;markSave();}}
function achievementAdd(key,n=1){achievementMax(key,(achievementData().stats[key]||0)+n);}
function achievementRemember(key,id){const a=achievementData();if(!a[key].includes(id)){a[key].push(id);achievementRevision++;markSave();}}
function achievementSync(){
 const a=achievementData(),stats={runs:save.totalRuns,floor:save.bestFloor,victories:Math.max(save.victories||0,save.campaignMedal?1:0),level:save.bestLevel,kills:save.totalKills,essence:save.totalEssence,depth:save.bestEndless,sigils:TREE_NODES.filter(n=>save.nodes?.[n.id]).length,forms:EMBER_FORMS.filter(f=>f.req.length&&save.forms?.[f.id]).length,marks:save.seventhMarks?.length||0};
 for(const g of GUARDIAN_ROSTER){const records=save.guardianRecords?.[g.key];if(records?.standard?.wins||records?.ascendant?.wins||save.campaignMedal)achievementRemember('guardians',g.key);}
 stats.archiveWins=GUARDIAN_ROSTER.filter(g=>save.guardianRecords?.[g.key]?.standard?.wins>0||save.guardianRecords?.[g.key]?.ascendant?.wins>0).length;
 stats.ascendantWins=GUARDIAN_ROSTER.filter(g=>save.guardianRecords?.[g.key]?.ascendant?.wins>0).length;
 stats.rushStandard=save.bossRush?.standard?.bestTime>0?1:0;stats.rushNightfall=save.bossRush?.nightfall?.bestTime>0?1:0;
 stats.rushClean=['standard','nightfall'].some(d=>save.bossRush?.[d]?.bestTime>0&&save.bossRush[d].bestHits===0)?1:0;
 stats.cleanGuardian=GUARDIAN_ROSTER.some(g=>['standard','ascendant'].some(d=>save.guardianRecords?.[g.key]?.[d]?.wins>0&&save.guardianRecords[g.key][d].bestHits===0))?1:0;
 stats.echoes=Object.values(save.story?.archive?.echoes||{}).filter(e=>e.completed).length;
 const activeRun=G.run&&!G.run.guardianMode?G.run:!G.run?save.resume?.run:null;
 if(activeRun){
  const run=activeRun,s=run.blessingExpansion||{},cards=POOL.filter(o=>run.up?.[o.id]>0&&s.archiveBorrowed?.id!==o.id);
  for(const o of cards){achievementRemember('blessings',o.id);if(run.up[o.id]>=o.max)achievementRemember('mastered',o.id);}
  for(const id of run.evolutions||[])achievementRemember('evolutions',id);
  stats.floor=Math.max(stats.floor||0,G.run?G.floor:save.resume.floor);stats.level=Math.max(stats.level||0,run.level);stats.runKills=run.kills;stats.runBlessings=cards.length;stats.runMythics=cards.filter(o=>o.r===3).length;stats.stitchPins=s.pins?.length||0;stats.wishDrafts=s.wishLevels?.length||0;stats.hearthGrowth=s.hearthWorldHp||0;stats.secrets=run.secretRoomsFound||0;
  const secret=(G.run?G.world:save.resume?.world)?.secretRoom;if(secret?.discovered&&Object.hasOwn(SECRET_REGIONS,secret.region))achievementRemember('regions',secret.region);
  if(run.infinite){const w=run.endlessWheel||{};stats.wheelSpins=w.spinCount;stats.burdenKinds=Object.values(w.burdens||{}).filter(v=>v>0).length;stats.calamities=Object.values(w.calamities||{}).filter(Boolean).length;}
 }
 stats.blessingCount=a.blessings.length;stats.mythicCount=a.blessings.filter(id=>POOL.find(o=>o.id===id)?.r===3).length;stats.maxedBlessings=a.mastered.length;stats.evolutions=a.evolutions.length;stats.secretRegions=a.regions.length;
 for(const g of a.guardians)stats['guardian:'+g]=1;
 for(const [key,value]of Object.entries(stats))achievementMax(key,value);
}
function checkAchievements(silent=false){
 achievementSync();const data=achievementData();let changed=false;
 for(const a of ACHIEVEMENTS)if(!data.unlocked[a.id]&&(data.stats[a.stat]||0)>=a.target){data.unlocked[a.id]=Date.now();changed=true;if(!silent)achievementQueue.push(a.id);}
 if(changed){achievementRevision++;markSave();updateAchievementButtons();}
 return changed;
}
function updateAchievementButtons(){const count=Object.keys(achievementData().unlocked).length;const b=T('btnAchievements');if(b){b.querySelector('small').textContent=count+' / '+ACHIEVEMENTS.length;b.setAttribute('aria-label','Achievements: '+count+' of '+ACHIEVEMENTS.length+' unlocked');}}
function achievementBadge(a,unlocked){
 const marks={descent:'M16 5v15m-6-6 6 6 6-6M8 26h16',combat:'M7 25 25 7M7 7l18 18M6 22l4 4M22 6l4 4',blessings:'M16 4l4 8 9 4-9 4-4 8-4-8-9-4 9-4Z',mastery:'M16 26V6M16 18l-7-5V8M16 14l7-5V5M16 23l9-6M16 23l-9-5',exploration:'M8 26V12l8-8 8 8v14M12 26V14h8v12M19 19h1',endless:'M7 16c0-9 9-9 18 0s0 9-9 0-9-9-9 0 9 9 18 0',archive:'M7 7h8v18H7ZM17 7h8v18h-8M11 11v10M21 11v10'};
 return '<svg viewBox="0 0 32 32" aria-hidden="true"><path class="badge-frame" d="M8 1h16l7 7v16l-7 7H8l-7-7V8Z"/><path class="badge-symbol" d="'+(a.secret&&!unlocked?'M12 11a4 4 0 1 1 6 3l-2 2v3M16 23h.1':marks[a.category])+'"/></svg>';
}
function renderAchievements(){
 achievementRendered=achievementRevision;
 const data=achievementData(),count=Object.keys(data.unlocked).length,search=T('achievementSearch').value.trim().toLowerCase();
 T('achievementCount').textContent=count+' / '+ACHIEVEMENTS.length;T('achievementProgress').style.width=(count/ACHIEVEMENTS.length*100)+'%';
 const list=ACHIEVEMENTS.filter(a=>(achievementCategory==='all'||a.category===achievementCategory)&&(achievementStatus==='all'||(achievementStatus==='unlocked')===!!data.unlocked[a.id])&&(!search||(a.secret&&!data.unlocked[a.id]?'hidden achievement':a.name+' '+a.description).toLowerCase().includes(search)));
 list.sort((a,b)=>Number(!!data.unlocked[b.id])-Number(!!data.unlocked[a.id])||Object.keys(ACHIEVEMENT_CATEGORIES).indexOf(a.category)-Object.keys(ACHIEVEMENT_CATEGORIES).indexOf(b.category));
 const grid=T('achievementGrid');grid.replaceChildren();
 for(const a of list){const unlocked=!!data.unlocked[a.id],hidden=a.secret&&!unlocked,card=document.createElement('article'),progress=Math.min(a.target,data.stats[a.stat]||0);card.className='achievement-card'+(unlocked?' unlocked':'')+(hidden?' secret':'');card.dataset.id=a.id;
  card.innerHTML='<div class="achievement-badge">'+achievementBadge(a,unlocked)+'</div><div class="achievement-copy"><small>'+ACHIEVEMENT_CATEGORIES[a.category]+'</small><h3></h3><p></p><div class="achievement-meter"><i style="width:'+(progress/a.target*100)+'%"></i></div><span class="achievement-card-state"></span></div>';
  card.querySelector('h3').textContent=hidden?'Hidden Achievement':a.name;card.querySelector('p').textContent=hidden?'There is something left to find.':a.description;card.querySelector('.achievement-card-state').textContent=unlocked?'UNLOCKED · '+new Date(data.unlocked[a.id]).toLocaleDateString():hidden?'UNDISCOVERED':progress.toLocaleString()+' / '+a.target.toLocaleString();if(hidden)card.querySelector('.achievement-meter').hidden=true;grid.appendChild(card);
 }
 T('achievementEmpty').hidden=!!list.length;T('achievementResults').textContent=list.length+' achievements';
 for(const b of T('achievementCategories').children)b.setAttribute('aria-pressed',String(b.dataset.category===achievementCategory));
}
function openAchievements(){
 if(T('achievements').classList.contains('open'))return;
 achievementReturnFocus=document.activeElement;if(G.state==='playing')pauseGame(true);clearInput();checkAchievements(true);renderAchievements();for(const el of [...document.querySelectorAll('.ov.open'),T('cv'),T('hud')].filter(Boolean)){if(el.id==='achievements')continue;achievementInert.push([el,el.inert]);el.inert=true;}show('achievements');T('achievementClose').focus({preventScroll:true});
}
function closeAchievements(){hide('achievements');for(const [el,inert]of achievementInert.splice(0))el.inert=inert;(achievementReturnFocus?.isConnected?achievementReturnFocus:T(G.state==='menu'?'btnAchievements':'btnResume'))?.focus({preventScroll:true});}
function installAchievements(){
 if(T('achievements'))return;
 const b=document.createElement('button');b.id='btnAchievements';b.className='btn achievement-menu-btn';b.type='button';b.innerHTML='<span aria-hidden="true">✦</span> ACHIEVEMENTS <small></small>';T('menuStats').before(b);on(b,'click',openAchievements);
 const pause=document.createElement('button');pause.id='btnPauseAchievements';pause.className='btn';pause.textContent='ACHIEVEMENTS';T('btnPauseMemories').after(pause);on(pause,'click',openAchievements);
 const panel=document.createElement('div');panel.id='achievements';panel.className='ov';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','achievementTitle');
 panel.innerHTML='<section class="achievement-shell"><header><div><small class="achievement-kicker">THE RECORD OF YOUR FLAME</small><h2 id="achievementTitle">Achievements</h2></div><button class="btn" id="achievementClose" type="button" aria-label="Close achievements">BACK <kbd>Esc</kbd></button></header><div class="achievement-summary"><span>Every descent leaves a mark.</span><b id="achievementCount"></b><div><i id="achievementProgress"></i></div></div><nav id="achievementCategories" aria-label="Achievement categories"></nav><div class="achievement-filters"><label><span>SEARCH</span><input id="achievementSearch" type="search" placeholder="Find an achievement" maxlength="80"></label><label><span>SHOW</span><select id="achievementStatus"><option value="all">All achievements</option><option value="unlocked">Unlocked</option><option value="locked">Locked</option></select></label><span id="achievementResults" aria-live="polite"></span></div><div class="achievement-scroll"><div id="achievementGrid"></div><p id="achievementEmpty" hidden>No achievements match these filters.</p></div><footer>Progress saves with your game. Archive loadouts do not count as discovered blessings.</footer></section>';
 document.body.appendChild(panel);
 for(const [id,name]of [['all','All'],...Object.entries(ACHIEVEMENT_CATEGORIES)]){const tab=document.createElement('button');tab.type='button';tab.dataset.category=id;tab.textContent=name;on(tab,'click',()=>{achievementCategory=id;renderAchievements();});T('achievementCategories').appendChild(tab);}
 on(T('achievementClose'),'click',closeAchievements);on(T('achievementSearch'),'input',renderAchievements);on(T('achievementStatus'),'change',e=>{achievementStatus=e.target.value;renderAchievements();});
 on(panel,'keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeAchievements();}if(e.key==='Tab'){const items=[...panel.querySelectorAll('button,input,select')].filter(el=>!el.disabled&&el.getClientRects().length),first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
}

const achievementValidateSave=validateSave;
validateSave=function(raw){const clean=achievementValidateSave(raw);clean.achievements=cleanAchievements(raw?.achievements);return clean;};
const achievementLoadSave=loadSave;
loadSave=function(){achievementLoadSave();checkAchievements(true);};
const achievementBlocking=anyBlockingOverlay;
anyBlockingOverlay=function(){return achievementBlocking()||T('achievements')?.classList.contains('open');};
const achievementInit=init;
init=function(){installAchievements();achievementInit();checkAchievements(true);updateAchievementButtons();};
const achievementMenu=refreshMenuStats;
refreshMenuStats=function(){achievementMenu();checkAchievements(true);updateAchievementButtons();};
const achievementReset=resetEverything;
resetEverything=function(){achievementQueue.length=0;achievementClock=achievementToastClock=0;closeAchievements();achievementReset();updateAchievementButtons();};
const achievementHurt=hurtPlayer;
hurtPlayer=function(...args){const p=G.player,before=p?.hp,hitCd=p?.hitCd,valid=p&&p.hitCd<=0&&p.dashT<=0&&G.state==='playing'&&!G.dead;const out=achievementHurt(...args);if(p&&valid&&(p.hp<before||p.hitCd>hitCd)&&G.run){const track=G.run.achievementTrack||(G.run.achievementTrack={});track.floorHits=(track.floorHits||0)+1;markSave();}return out;};
const achievementSetupFloor=setupFloor;
setupFloor=function(f){const out=achievementSetupFloor(f);if(G.run){G.run.achievementTrack=G.run.achievementTrack||{};G.run.achievementTrack.floorHits=0;}checkAchievements();return out;};
const achievementDamage=damageEnemy;
damageEnemy=function(e,amount,angle,crit,kb,kind='shot'){const alive=e&&!e.dead,out=achievementDamage(e,amount,angle,crit,kb,kind);if(alive&&e.dead&&!e.isBoss&&!e.mechanism&&/melee|flare/i.test(kind))achievementAdd('flareKills');return out;};
const achievementKillBoss=killBoss;
killBoss=function(b){const other=b?.bossKey==='regents'&&G.enemies.some(e=>e!==b&&!e.dead&&e.bossKey==='regents'),key=b?.warden?'warden':b?.matriarch?'matriarch':b?.bossKey;const out=achievementKillBoss(b);if(!other&&GUARDIAN_ROSTER.some(g=>g.key===key)){achievementRemember('guardians',key);if(!(G.run?.achievementTrack?.floorHits??G.run?.archiveGuardianHits??G.run?.guardianMode?.hits??0))achievementAdd('cleanGuardian');}checkAchievements();return out;};
const achievementReload=beginReload;
beginReload=function(){const before=G.run?.blessingExpansion?.perfectReloads||0,out=achievementReload();if((G.run?.blessingExpansion?.perfectReloads||0)>before)achievementAdd('perfectReloads');return out;};
const achievementRoomTick=expansionRoomTick;
expansionRoomTick=function(dt){const before=expansionState(),room=before?.roomIndex,fighting=before?.roomCombat,hit=before?.roomHit;achievementRoomTick(dt);if(fighting&&!hit&&room===before?.roomIndex&&!before.roomCombat&&room>=0){const track=G.run.achievementTrack||(G.run.achievementTrack={});track.cleanRooms=track.cleanRooms||{};const id=G.floor+':'+room;if(!track.cleanRooms[id]){track.cleanRooms[id]=true;achievementAdd('cleanRooms');}}};
const achievementRevealSecret=revealSecret;
revealSecret=function(s=currentSecret()){const discovered=s?.discovered,out=achievementRevealSecret(s);if(!discovered&&s?.discovered){achievementAdd('secrets');achievementRemember('regions',s.region);checkAchievements();}return out;};
const achievementShop=buySecretItem;
buySecretItem=function(id){const s=currentSecret(),before=s?.purchased?.length||0,out=achievementShop(id);if((s?.purchased?.length||0)>before){achievementAdd('shopBuys');checkAchievements();}return out;};
const achievementRush=finishBossRush;
finishBossRush=function(){const out=achievementRush();if(G.run?.guardianMode?.secretDefeated)achievementAdd('lastGuest');checkAchievements();return out;};
const achievementSnapshot=snapshotRun;
snapshotRun=function(){checkAchievements();return achievementSnapshot();};
const achievementChooseCard=chooseCard;
chooseCard=function(i){const out=achievementChooseCard(i);checkAchievements();return out;};
const achievementPin=starstitchPin;
starstitchPin=function(...args){const out=achievementPin(...args);achievementMax('stitchPins',G.run?.blessingExpansion?.pins?.length||0);return out;};
const achievementTick=hollowTick;
hollowTick=function(dt){achievementTick(dt);achievementClock-=dt;achievementToastClock-=dt;if(achievementClock<=0){achievementClock=1;checkAchievements();if(T('achievements')?.classList.contains('open')&&achievementRendered!==achievementRevision)renderAchievements();}if(achievementToastClock<=0&&achievementQueue.length&&!document.hidden&&G.state!=='menu'&&!anyBlockingOverlay()&&G.state!=='dialogue'){const a=ACHIEVEMENT_BY_ID[achievementQueue.shift()];toast('ACHIEVEMENT · '+a.name,a.description);achievementToastClock=5;markSave();}};

const achievementEsc=onEscKey;
onEscKey=function(){if(T('achievements')?.classList.contains('open')){closeAchievements();return;}return achievementEsc();};
