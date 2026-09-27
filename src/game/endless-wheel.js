const ENDLESS_BURDENS=[
 {id:'longHunt',name:'THE LONG HUNT',cat:'Hunt',mark:'↟',unlock:1,r:['A hunter enters every third room you cross.','Hunters arrive in pairs and enter more often.','The hunt never cools; surviving hunters follow through open rooms.']},
 {id:'markedEmber',name:'MARKED EMBER',cat:'Hunt',mark:'⌖',unlock:1,r:['One creature on each floor always knows where you are.','Two marked creatures ignore distance and closed doors.','Marked creatures gain speed whenever you Dash.']},
 {id:'closingHounds',name:'CLOSING HOUNDS',cat:'Hunt',mark:'⋔',unlock:1,r:['Spectral hounds cut through rooms from the edges.','The pack grows and approaches from opposing sides.','A final hound follows the space your first dodge leaves open.']},
 {id:'bloodScent',name:'BLOOD SCENT',cat:'Hunt',mark:'◒',unlock:25,r:['Wounded Embers draw faster pursuit.','Below half health, creatures strike and recover sooner.','Below one third health, the room calls another hunter.']},
 {id:'gatekeeper',name:'THE GATEKEEPER',cat:'Hunt',mark:'▥',unlock:50,r:['A hardened creature waits near the way down.','The Gatekeeper brings two escorts.','The Gatekeeper inherits a trait from the floor’s Guardian.']},
 {id:'cutoff',name:'CUTOFF',cat:'Hunt',mark:'╫',unlock:75,r:['A burning line occasionally seals the path behind you.','The line lasts longer and a second line closes from the side.','The cut moves, forcing a committed escape.']},
 {id:'secondShadow',name:'THE SECOND SHADOW',cat:'Echo',mark:'◐',unlock:1,r:['Some enemy shots return as pale echoes.','Every third volley leaves an echo.','Echoes return from the opposite direction as well.']},
 {id:'oldFootsteps',name:'OLD FOOTSTEPS',cat:'Echo',mark:'⌁',unlock:1,r:['A delayed slash crosses the path of your Dash.','Every Dash leaves a longer, faster echo.','Every third Dash leaves two crossing echoes.']},
 {id:'writtenAsh',name:'WRITTEN IN ASH',cat:'Echo',mark:'⌘',unlock:1,r:['Floor sigils wake beneath your last position.','Sigils wake sooner and release a small volley.','Two linked sigils remember consecutive positions.']},
 {id:'graveChorus',name:'THE GRAVE CHORUS',cat:'Echo',mark:'✣',unlock:25,r:['Defeated elites release a ring of pale shots.','Ordinary creatures can join the chorus.','Every death adds a note to the next ring.']},
 {id:'unfinishedDeath',name:'UNFINISHED DEATH',cat:'Echo',mark:'⟲',unlock:50,r:['One ordinary creature rises again each floor.','Three creatures may return with half their strength.','The first elite returns once as a brittle shade.']},
 {id:'borrowedMoment',name:'BORROWED MOMENT',cat:'Echo',mark:'◫',unlock:75,r:['Some hostile shots stop briefly before continuing.','Stopped shots turn toward your new position.','A second wave freezes while the first begins moving.']},
 {id:'stolenGround',name:'STOLEN GROUND',cat:'Ground',mark:'◇',unlock:1,r:['Small patches of floor smolder under recent footsteps.','The patches spread before fading.','Safe ground shifts whenever the room’s rhythm changes.']},
 {id:'unquietWalls',name:'UNQUIET WALLS',cat:'Ground',mark:'▤',unlock:1,r:['Nearby walls occasionally loose a straight volley.','Opposing walls answer one another.','The wall volley sweeps across the room.']},
 {id:'closingTeeth',name:'CLOSING TEETH',cat:'Ground',mark:'⋈',unlock:1,r:['Two narrow lanes close across the room.','A second bite follows at a right angle.','The gaps move between bites.']},
 {id:'deepCurrent',name:'THE DEEP CURRENT',cat:'Ground',mark:'≋',unlock:25,r:['A weak current moves across every room.','The current turns and strengthens during combat.','Creatures resist it while the Ember does not.']},
 {id:'rootedStone',name:'ROOTED STONE',cat:'Ground',mark:'⌇',unlock:50,r:['Standing still wakes roots beneath you.','Roots wake sooner and hold a wider space.','The roots branch toward your escape.']},
 {id:'fallingSky',name:'THE FALLING SKY',cat:'Ground',mark:'↓',unlock:75,r:['Fragments fall into occupied rooms.','More fragments fall around your predicted path.','The last fragment splits into a cross of sparks.']},
 {id:'crownedBlood',name:'CROWNED BLOOD',cat:'Swarm',mark:'♛',unlock:1,r:['One creature carries a crown and strengthens nearby allies.','The crown passes to the nearest survivor.','The bearer gains an attack from the creature it succeeds.']},
 {id:'sharedBreath',name:'SHARED BREATH',cat:'Swarm',mark:'∞',unlock:1,r:['Pairs of creatures share a thread of health.','More pairs form and share more damage.','Breaking one thread heals another living pair.']},
 {id:'funeralPair',name:'FUNERAL PAIR',cat:'Swarm',mark:'Ⅱ',unlock:1,r:['Two creatures bind together and enrage when separated.','The survivor gains the fallen partner’s speed.','The first fallen partner returns as a pursuing shade.']},
 {id:'borrowedFaces',name:'BORROWED FACES',cat:'Swarm',mark:'☷',unlock:25,r:['Some creatures imitate an Ember Bolt.','Imitators copy short volleys after you attack.','An imitator also copies the direction of your Dash.']},
 {id:'lastWitness',name:'THE LAST WITNESS',cat:'Swarm',mark:'Ⅰ',unlock:50,r:['The last creature in a room becomes stronger.','The Witness restores part of its health.','The Witness inherits two traits from the fallen.']},
 {id:'broodLaw',name:'BROOD LAW',cat:'Swarm',mark:'✥',unlock:75,r:['Some fallen creatures leave a small brood.','Broods hatch sooner and arrive in larger groups.','Living broods feed strength back to their parent kind.']},
 {id:'hollowFlames',name:'HOLLOW FLAMES',cat:'Hunger',mark:'♨',unlock:1,r:['Some Resting Flames demand a short ambush before healing.','Every Resting Flame demands stronger keepers.','A keeper must be defeated without leaving the room.']},
 {id:'ashCollector',name:'THE ASH COLLECTOR',cat:'Hunger',mark:'♜',unlock:1,r:['A creature gathers unclaimed experience and Essence.','The Collector moves faster and stores health drops.','Stored rewards strengthen it until they are recovered.']},
 {id:'witheringHarvest',name:'WITHERING HARVEST',cat:'Hunger',mark:'⌛',unlock:1,r:['Dropped rewards slowly fade.','Rewards fade sooner and drift toward nearby creatures.','A faded reward heals and strengthens the creature that takes it.']},
 {id:'bitterCure',name:'BITTER CURE',cat:'Hunger',mark:'✚',unlock:25,r:['Healing wakes a hostile cinder.','Larger heals wake a small group.','Every cure leaves a burning echo beneath you.']},
 {id:'hoardedLight',name:'HOARDED LIGHT',cat:'Hunger',mark:'●',unlock:50,r:['Unclaimed rewards dim the edge of your sight.','Collectors carry the stolen light into nearby rooms.','Darkness remains until every stolen reward is recovered.']},
 {id:'famineClock',name:'THE FAMINE CLOCK',cat:'Hunger',mark:'◷',unlock:75,r:['Crowded rooms enrage if left uncleared too long.','The clock runs faster and calls reinforcements.','Each expired clock shortens the next.']},
 {id:'bellDebt',name:'THE BELL’S DEBT',cat:'Bell',mark:'♢',unlock:1,r:['A distant bell releases an expanding ring.','The ring returns from the room’s edge.','The debt sounds twice with different gaps.']},
 {id:'seventhBeat',name:'THE SEVENTH BEAT',cat:'Bell',mark:'Ⅶ',unlock:1,r:['Every seventh enemy volley carries an extra shot.','The seventh volley becomes a narrow fan.','The seventh volley ends in a small ring.']},
 {id:'brokenRhythm',name:'BROKEN RHYTHM',cat:'Bell',mark:'⌁',unlock:1,r:['Enemies alternate between slow and hurried measures.','The hurried measure lasts longer.','Each switch releases a pulse from nearby creatures.']},
 {id:'doubleToll',name:'DOUBLE TOLL',cat:'Bell',mark:'◈',unlock:25,r:['Some room hazards repeat after a short silence.','The repeated hazard turns a quarter circle.','The second toll is followed by a quieter third.']},
 {id:'lateChime',name:'THE LATE CHIME',cat:'Bell',mark:'◴',unlock:50,r:['Occasional enemy volleys repeat after a delay.','Repeated volleys travel faster.','The echo aims at where you moved after the first volley.']},
 {id:'finalMeasure',name:'FINAL MEASURE',cat:'Bell',mark:'𝄂',unlock:75,r:['The last ordinary death in a room releases a short coda.','The coda gains a second expanding ring.','The final note wakes a distant creature.']},
 {id:'gatheringDark',name:'GATHERING DARK',cat:'Veil',mark:'◑',unlock:1,r:['Combat narrows the visible edge of the room.','The darkness gathers sooner.','Bright attacks briefly reveal shapes hiding inside it.']},
 {id:'falseShapes',name:'FALSE SHAPES',cat:'Veil',mark:'♧',unlock:1,r:['Some creatures cast harmless moving doubles.','Doubles survive longer and mirror attacks.','One double per room becomes real when struck.']},
 {id:'veiledIntent',name:'VEILED INTENT',cat:'Veil',mark:'⌒',unlock:1,r:['Endless hazards reveal themselves later.','Guardian warnings shorten slightly.','Some warnings begin at half brightness.']},
 {id:'moonlessRoom',name:'THE MOONLESS ROOM',cat:'Veil',mark:'☾',unlock:25,r:['One ordinary room on each floor loses most of its light.','Two rooms become moonless.','The darkness follows the largest surviving group.']},
 {id:'wrongReflection',name:'THE WRONG REFLECTION',cat:'Veil',mark:'⇆',unlock:50,r:['Some floor hazards appear again across the room.','Reflections arrive sooner.','The reflected shape moves in the opposite direction.']},
 {id:'watcher',name:'THE WATCHER',cat:'Veil',mark:'◉',unlock:75,r:['Remaining still draws a thin watching beam.','The Watcher notices sooner.','A second eye watches your likely escape.']},
 {id:'guardianDue',name:'THE GUARDIAN’S DUE',cat:'Crown',mark:'♚',unlock:1,r:['Guardians collect an extra Endless attack.','The extra attack arrives more often.','It joins the Guardian’s final phase permanently.']},
 {id:'siegeMemory',name:'SIEGE MEMORY',cat:'Crown',mark:'⌑',unlock:1,r:['Guardian arenas wake two old firing points.','Four firing points wake in sequence.','Destroyed firing points rebuild once.']},
 {id:'blackStandard',name:'THE BLACK STANDARD',cat:'Crown',mark:'⚑',unlock:1,r:['A standard bearer strengthens nearby creatures.','The standard’s reach grows.','The standard remains briefly after its bearer falls.']},
 {id:'inheritedArmor',name:'INHERITED ARMOR',cat:'Crown',mark:'⬡',unlock:25,r:['One creature carries armor that passes on death.','More armor passes and reduces more damage.','The armor returns to its first bearer as a shade.']},
 {id:'finalAudience',name:'THE FINAL AUDIENCE',cat:'Crown',mark:'♙',unlock:50,r:['Guardians summon a small audience during the fight.','The audience attacks in measured volleys.','The last spectator strengthens the Guardian until defeated.']},
 {id:'crownThorns',name:'CROWN OF THORNS',cat:'Crown',mark:'✺',unlock:75,r:['Guardians raise two thorn nodes that soften incoming damage.','Three nodes return once at half health.','The crown closes completely while any node survives.']}
];
const ENDLESS_CALAMITIES=[
 {id:'forkedNeedle',name:'THE FORKED NEEDLE',cat:'Calamity',mark:'⋔',desc:'Every third future spin lands twice.'},
 {id:'oldWound',name:'THE OLD WOUND',cat:'Calamity',mark:'⌁',desc:'When the wheel repeats a Burden, it gains two ranks if it can.'},
 {id:'blackOrbit',name:'BLACK ORBIT',cat:'Calamity',mark:'◉',desc:'Every Guardian fight gains a slow revolving line that must be crossed.'},
 {id:'convergence',name:'CONVERGENCE',cat:'Calamity',mark:'✣',desc:'Two owned Burdens rise by one rank for each floor.'},
 {id:'guardianChoice',name:'THE GUARDIAN’S CHOICE',cat:'Calamity',mark:'♛',desc:'Every Guardian chooses one owned Burden and brings it to Rank III for the fight.'},
 {id:'shatteredSpoke',name:'THE SHATTERED SPOKE',cat:'Calamity',mark:'✦',desc:'Each floor adds a changing temporary Burden to the collection.'},
 {id:'weightSeven',name:'THE WEIGHT OF SEVEN',cat:'Calamity',mark:'Ⅶ',desc:'Every seventh room wakes three collected hazards in sequence.'},
 {id:'handBeneath',name:'THE HAND BENEATH',cat:'Calamity',mark:'⌄',desc:'The first room of every floor begins under a hidden Rank I Burden.'}
];
const ENDLESS_BURDEN_BY_ID=Object.fromEntries(ENDLESS_BURDENS.map(function(b){return[b.id,b];}));
const ENDLESS_CALAMITY_BY_ID=Object.fromEntries(ENDLESS_CALAMITIES.map(function(b){return[b.id,b];}));
const ENDLESS_CATEGORIES=['All','Hunt','Echo','Ground','Swarm','Hunger','Bell','Veil','Crown','Calamity'];
const ENDLESS_PERIODIC=['longHunt','closingHounds','cutoff','writtenAsh','stolenGround','unquietWalls','closingTeeth','rootedStone','fallingSky','bellDebt','doubleToll','wrongReflection','watcher','guardianDue','siegeMemory','finalAudience'];
let endlessWheelAnimation=0,endlessWheelAngle=0,endlessWheelFilter='All',endlessWheelDamageLink=false,endlessWheelLastBoss=false,endlessWheelHealGuard=false;

function endlessWheelHash(value){
 let h=2166136261,s=String(value);
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
 h+=h<<13;h^=h>>>7;h+=h<<3;h^=h>>>17;h+=h<<5;
 return h>>>0;
}
function endlessWheelRandom(key){return endlessWheelHash(endlessWheelData().seed+'|'+key)/4294967296;}
function endlessWheelData(){
 if(!G.run)return null;
 let w=G.run.endlessWheel;
 if(!w||typeof w!=='object'){
  const source=G.run.runner?.seed||G.run.seed||Date.now().toString(36);
  w={version:1,seed:String(source).slice(0,64),burdens:{},calamities:{},spins:[],spinCount:0,lastSpinFloor:0,pending:null,runtime:null};
  G.run.endlessWheel=w;
 }
 w.burdens=w.burdens&&typeof w.burdens==='object'?w.burdens:{};
 w.calamities=w.calamities&&typeof w.calamities==='object'?w.calamities:{};
 w.spins=Array.isArray(w.spins)?w.spins.slice(-256):[];
 w.spinCount=Math.max(0,Math.floor(Number(w.spinCount)||0));
 return w;
}
function endlessWheelActive(){return !!(G.run?.infinite&&G.floor>50);}
function endlessCalamity(id){return !!endlessWheelData()?.calamities?.[id];}
function endlessBurdenRank(id){
 const w=endlessWheelData();
 if(!w)return 0;
 return Math.min(3,Math.max(0,(w.burdens[id]||0)+(w.runtime?.tempRanks?.[id]||0)));
}
function endlessBurdenWeight(){
 const w=endlessWheelData();
 if(!w)return 0;
 return Object.values(w.burdens).reduce(function(a,b){return a+Math.min(3,Math.max(0,b||0));},0)+Object.keys(w.calamities).length*4;
}
function endlessWheelShuffle(items,key){
 const out=items.slice();
 for(let i=out.length-1;i>0;i--){const j=Math.floor(endlessWheelRandom(key+'|'+i)*((i+1)));const t=out[i];out[i]=out[j];out[j]=t;}
 return out;
}
function endlessWheelCandidates(floor,spin){
 const depth=Math.max(1,floor-50),w=endlessWheelData();
 let standard=ENDLESS_BURDENS.filter(function(b){return depth>=b.unlock&&(w.burdens[b.id]||0)<3;});
 if(standard.length<12)standard=standard.concat(ENDLESS_BURDENS.filter(function(b){return !standard.includes(b)&&(w.burdens[b.id]||0)<3;}));
 standard=endlessWheelShuffle(standard,'candidates|'+floor+'|'+spin);
 const result=[],cats=new Set();
 for(const b of standard){if(result.length>=12)break;if(!cats.has(b.cat)){result.push(b);cats.add(b.cat);}}
 for(const b of standard){if(result.length>=12)break;if(!result.includes(b))result.push(b);}
 const calamities=ENDLESS_CALAMITIES.filter(function(c){return !w.calamities[c.id];});
 if(depth>=100&&calamities.length&&spin%4===3){
  const c=calamities[Math.floor(endlessWheelRandom('calamity|'+floor+'|'+spin)*calamities.length)];
  result[Math.floor(endlessWheelRandom('calamity-slot|'+floor+'|'+spin)*Math.max(1,result.length))]=c;
 }
 while(result.length<12){
  const fallback=ENDLESS_BURDENS[(result.length*7+spin)%ENDLESS_BURDENS.length];
  if(!result.includes(fallback))result.push(fallback);else result.push(ENDLESS_BURDENS[(result.length*11+floor)%ENDLESS_BURDENS.length]);
 }
 return result.slice(0,12);
}
function endlessWheelBuildUI(){
 if(T('endlessWheel'))return;
 const overlay=document.createElement('div');
 overlay.id='endlessWheel';overlay.className='ov';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','endlessWheelTitle');
 overlay.innerHTML='<section class="wheel-shell"><div class="wheel-sparks" aria-hidden="true"></div><div class="wheel-stage"><i class="wheel-chain left"></i><i class="wheel-chain right"></i><div class="wheel-halo"></div><canvas id="endlessWheelCanvas" width="720" height="720" aria-label="The Endless wheel"></canvas><div class="wheel-pointer" aria-hidden="true"></div></div><div class="wheel-copy"><div class="wheel-kicker" id="endlessWheelKicker">ENDLESS DEPTH</div><h2 id="endlessWheelTitle">The Wheel Below</h2><p id="endlessWheelIntro">The Hollow keeps what it learns. Every turn adds another law to this descent.</p><article class="wheel-result" id="endlessWheelResult"><span class="wheel-result-mark" id="endlessWheelResultMark">◆</span><small id="endlessWheelResultType">THE WHEEL IS WAITING</small><h3 id="endlessWheelResultName">Another law will follow you.</h3><div class="wheel-rank" id="endlessWheelRank" aria-label="Burden rank"><i></i><i></i><i></i></div><p id="endlessWheelResultText">Turn the wheel to bind the next Burden.</p></article><div class="wheel-actions"><button class="btn primary" id="endlessWheelAction">TURN THE WHEEL</button><button class="btn wheel-ledger-button" id="endlessWheelLedger">VIEW THE WEIGHT</button></div><div class="wheel-count"><span><b id="endlessWheelBurdenCount">0</b> BURDENS</span><span>·</span><span><b id="endlessWheelCalamityCount">0</b> CALAMITIES</span><span>·</span><span>WEIGHT <b id="endlessWheelWeight">0</b></span></div></div></section>';
 document.body.appendChild(overlay);
 const ledger=document.createElement('div');
 ledger.id='burdenLedger';ledger.className='ov';ledger.setAttribute('role','dialog');ledger.setAttribute('aria-modal','true');ledger.setAttribute('aria-labelledby','burdenLedgerTitle');
 ledger.innerHTML='<section class="burden-shell"><header class="burden-head"><div><small>THE LAWS OF THIS DESCENT</small><h2 id="burdenLedgerTitle">The Weight</h2></div><button class="btn" id="burdenLedgerClose">RETURN</button></header><div class="burden-summary"><span><b id="burdenLedgerOwned">0</b>BURDENS</span><span><b id="burdenLedgerCalamities">0</b>CALAMITIES</span><span><b id="burdenLedgerWeight">0</b>TOTAL WEIGHT</span></div><nav class="burden-filters" id="burdenFilters" aria-label="Burden categories"></nav><div class="burden-grid" id="burdenGrid"></div></section>';
 document.body.appendChild(ledger);
 const quick=document.createElement('button');
 quick.id='endlessWeightButton';quick.type='button';quick.setAttribute('aria-label','View collected Endless Burdens');quick.innerHTML='◆<span id="endlessWeightBadge">0</span>';document.body.appendChild(quick);
 const pauseButton=document.createElement('button');
 pauseButton.id='endlessWeightPause';pauseButton.type='button';pauseButton.className='btn endless-weight-pause';pauseButton.textContent='THE WEIGHT';T('btnPauseMemories')?.after(pauseButton);
 const sparks=overlay.querySelector('.wheel-sparks');
 for(let i=0;i<34;i++){const s=document.createElement('i');s.style.setProperty('--x',(3+endlessWheelHash('spark'+i)%95)+'%');s.style.setProperty('--d',(5+endlessWheelHash('spark-d'+i)%8)+'s');s.style.setProperty('--delay',(-endlessWheelHash('spark-l'+i)%100/10)+'s');sparks.appendChild(s);}
 on(T('endlessWheelAction'),'click',endlessWheelAction);
 on(T('endlessWheelLedger'),'click',function(){endlessWheelOpenLedger(true);});
 on(T('burdenLedgerClose'),'click',endlessWheelCloseLedger);
 on(quick,'click',function(){if(G.state==='playing')setState('paused');endlessWheelOpenLedger(false);});
 on(pauseButton,'click',function(){hide('pause');endlessWheelOpenLedger(false);});
 const filters=T('burdenFilters');
 for(const cat of ENDLESS_CATEGORIES){const b=document.createElement('button');b.type='button';b.textContent=cat;b.dataset.cat=cat;on(b,'click',function(){endlessWheelFilter=cat;endlessWheelRenderLedger();});filters.appendChild(b);}
}
function endlessWheelDraw(angle,lineup,landed){
 const cv=T('endlessWheelCanvas');if(!cv)return;
 const ctx=cv.getContext('2d'),cx=360,cy=360,r=294,step=TAU/12;
 ctx.clearRect(0,0,720,720);ctx.imageSmoothingEnabled=false;
 ctx.save();ctx.translate(cx,cy);
 const glow=ctx.createRadialGradient(0,0,80,0,0,350);glow.addColorStop(0,'rgba(255,143,58,.22)');glow.addColorStop(.52,'rgba(122,68,39,.11)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(-360,-360,720,720);
 for(let i=0;i<24;i++){ctx.save();ctx.rotate(i*TAU/24);ctx.fillStyle=i%2?'#32221a':'#5f412b';ctx.fillRect(-4,-342,8,27);ctx.fillStyle='#b58452';ctx.fillRect(-2,-339,3,19);ctx.restore();}
 ctx.beginPath();ctx.arc(0,0,330,0,TAU);ctx.lineWidth=25;ctx.strokeStyle='#171315';ctx.stroke();ctx.beginPath();ctx.arc(0,0,328,0,TAU);ctx.lineWidth=4;ctx.strokeStyle='#8b6844';ctx.stroke();ctx.beginPath();ctx.arc(0,0,309,0,TAU);ctx.lineWidth=5;ctx.strokeStyle='#38271f';ctx.stroke();
 for(let i=0;i<12;i++){
  const item=lineup?.[i]||ENDLESS_BURDENS[i],start=angle+i*step,end=start+step,isCal=!!ENDLESS_CALAMITY_BY_ID[item.id],active=i===landed;
  ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,r,start,end);ctx.closePath();
  const shade=(i%2?18:25)+(active?22:0);
  ctx.fillStyle=isCal?'hsl(354 47% '+(shade+2)+'%)':'hsl('+(22+i%3*5)+' 31% '+shade+'%)';ctx.fill();
  ctx.strokeStyle=active?'#ffd291':isCal?'#a85756':'#4f392c';ctx.lineWidth=active?5:3;ctx.stroke();
  ctx.save();ctx.rotate(start+step/2);ctx.translate(0,-205);ctx.rotate(Math.PI/2);
  ctx.fillStyle=active?'#fff0ca':isCal?'#e3a0a0':'#d0a878';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 21px Georgia';ctx.fillText(item.mark,0,-24);
  ctx.font='700 12px system-ui';const name=item.name.length>18?item.name.slice(0,17)+'…':item.name;ctx.fillText(name,0,5);
  const rank=ENDLESS_CALAMITY_BY_ID[item.id]?0:(endlessWheelData()?.burdens?.[item.id]||0)+1;
  if(rank){ctx.fillStyle='#e17939';ctx.font='700 9px system-ui';ctx.fillText('RANK '+Math.min(3,rank),0,27);}
  ctx.restore();
 }
 ctx.beginPath();ctx.arc(0,0,111,0,TAU);ctx.fillStyle='#0b0c10';ctx.fill();ctx.lineWidth=12;ctx.strokeStyle='#503627';ctx.stroke();ctx.beginPath();ctx.arc(0,0,91,0,TAU);ctx.lineWidth=2;ctx.strokeStyle='#ba7e47';ctx.stroke();
 const pulse=1+Math.sin(performance.now()/240)*.04;ctx.save();ctx.scale(pulse,pulse);ctx.globalCompositeOperation='lighter';const ember=ctx.createRadialGradient(0,5,2,0,5,67);ember.addColorStop(0,'rgba(255,248,198,.95)');ember.addColorStop(.18,'rgba(255,190,82,.9)');ember.addColorStop(.52,'rgba(231,77,31,.38)');ember.addColorStop(1,'rgba(231,77,31,0)');ctx.fillStyle=ember;ctx.beginPath();ctx.arc(0,5,67,0,TAU);ctx.fill();ctx.restore();
 ctx.fillStyle='#ffe7a7';ctx.beginPath();ctx.moveTo(0,-49);ctx.lineTo(22,-9);ctx.lineTo(12,35);ctx.lineTo(0,51);ctx.lineTo(-14,31);ctx.lineTo(-21,-8);ctx.closePath();ctx.fill();
 ctx.fillStyle='#f36b32';ctx.beginPath();ctx.moveTo(0,-34);ctx.lineTo(12,-4);ctx.lineTo(5,29);ctx.lineTo(-9,10);ctx.closePath();ctx.fill();
 ctx.fillStyle='#fff8cf';ctx.fillRect(-4,-17,8,28);
 for(let i=0;i<7;i++){ctx.save();ctx.rotate(performance.now()/1700+i*TAU/7);ctx.translate(0,-73);ctx.rotate(-performance.now()/1700-i*TAU/7);ctx.fillStyle=i%2?'#cc6d34':'#e9a357';ctx.fillRect(-4,-9,8,18);ctx.fillStyle='#ffcf7f';ctx.fillRect(-2,-7,3,9);ctx.restore();}
 ctx.restore();
}
function endlessWheelRenderLedger(){
 const w=endlessWheelData();if(!w)return;
 const owned=Object.keys(w.burdens).filter(function(id){return w.burdens[id]>0;}).length,cal=Object.keys(w.calamities).length,weight=endlessBurdenWeight();
 setTxt('burdenLedgerOwned',owned);setTxt('burdenLedgerCalamities',cal);setTxt('burdenLedgerWeight',weight);
 for(const b of T('burdenFilters').children)b.classList.toggle('on',b.dataset.cat===endlessWheelFilter);
 const grid=T('burdenGrid');grid.replaceChildren();
 const all=ENDLESS_BURDENS.concat(ENDLESS_CALAMITIES).filter(function(b){return endlessWheelFilter==='All'||b.cat===endlessWheelFilter;});
 for(const b of all){
  const calItem=!!ENDLESS_CALAMITY_BY_ID[b.id],rank=calItem?(w.calamities[b.id]?1:0):(w.burdens[b.id]||0),card=document.createElement('article');
  card.className='burden-card'+(rank?' active':'')+(calItem?' calamity':'');
  const text=rank?(calItem?b.desc:b.r[Math.max(0,rank-1)]):(calItem?'Unclaimed Calamity.':'Not yet bound to this descent.');
  let pips='';if(!calItem)for(let i=1;i<=3;i++)pips+='<i class="'+(i<=rank?'on':'')+'"></i>';
  card.innerHTML='<span class="sigil">'+b.mark+'</span><small>'+b.cat+(calItem?'':' · '+(rank?'RANK '+rank:'DORMANT'))+'</small><strong>'+b.name+'</strong><p>'+text+'</p>'+(calItem?'':'<div class="pips">'+pips+'</div>');
  grid.appendChild(card);
 }
}
function endlessWheelOpenLedger(fromWheel){
 endlessWheelBuildUI();T('burdenLedger').dataset.fromWheel=fromWheel?'1':'0';endlessWheelRenderLedger();show('burdenLedger');T('burdenLedgerClose').focus({preventScroll:true});
}
function endlessWheelCloseLedger(){
 const from=T('burdenLedger').dataset.fromWheel==='1';hide('burdenLedger');
 if(from){T('endlessWheelAction').focus({preventScroll:true});return;}
 if(G.run&&G.state==='paused'){show('pause');T('endlessWeightPause')?.focus({preventScroll:true});}
}
function endlessWheelRefreshCounts(){
 const w=endlessWheelData();if(!w)return;
 const owned=Object.keys(w.burdens).filter(function(id){return w.burdens[id]>0;}).length,cal=Object.keys(w.calamities).length;
 setTxt('endlessWheelBurdenCount',owned);setTxt('endlessWheelCalamityCount',cal);setTxt('endlessWheelWeight',endlessBurdenWeight());setTxt('endlessWeightBadge',endlessBurdenWeight());
}
function endlessWheelOffer(floor){
 if(!G.run?.infinite||floor<=50)return;
 endlessWheelBuildUI();
 const w=endlessWheelData();
 if(w.lastSpinFloor===floor&&!w.pending)return;
 if(!w.pending){
  const lineup=endlessWheelCandidates(floor,w.spinCount),outcome=Math.floor(endlessWheelRandom('outcome|'+floor+'|'+w.spinCount)*lineup.length);
  w.pending={floor,lineup:lineup.map(function(b){return b.id;}),outcome,status:'waiting',awards:[]};
  w.lastSpinFloor=floor;
 }
 const p=w.pending;if(p.status==='spinning')p.status='waiting';const lineup=p.lineup.map(function(id){return ENDLESS_BURDEN_BY_ID[id]||ENDLESS_CALAMITY_BY_ID[id];}).filter(Boolean);
 if(!lineup.length){w.pending=null;return;}
 hide('pause');hide('endlessOath');setState('paused');T('endlessWheel').dataset.phase=p.status||'waiting';
 setTxt('endlessWheelKicker','ENDLESS '+Math.max(1,floor-50)+' · SPIN '+(w.spinCount+1));
 setTxt('endlessWheelTitle','The Wheel Below');setTxt('endlessWheelIntro','The Hollow keeps what it learns. Every turn adds another law to this descent.');
 setTxt('endlessWheelResultType','THE WHEEL IS WAITING');setTxt('endlessWheelResultName','Another law will follow you.');setTxt('endlessWheelResultText','Turn the wheel to bind the next Burden.');
 setTxt('endlessWheelResultMark','◆');T('endlessWheelResult').dataset.kind='burden';
 for(const i of T('endlessWheelRank').children)i.classList.remove('on');
 T('endlessWheelAction').textContent='TURN THE WHEEL';T('endlessWheelAction').disabled=false;
 endlessWheelDraw(endlessWheelAngle,lineup,-1);endlessWheelRefreshCounts();show('endlessWheel');T('endlessWheelAction').focus({preventScroll:true});saveNow();
 if(p.status==='result')endlessWheelShowResult(p.awards||[]);
}
function offerEndlessOath(milestone){endlessWheelOffer(milestone);}
function endlessWheelApplyOne(id){
 const w=endlessWheelData(),cal=ENDLESS_CALAMITY_BY_ID[id],b=ENDLESS_BURDEN_BY_ID[id];
 if(cal){w.calamities[id]=true;return{id:id,old:0,rank:1,calamity:true};}
 if(!b)return null;
 const old=Math.min(3,w.burdens[id]||0),gain=endlessCalamity('oldWound')&&old>0?2:1,rank=Math.min(3,old+gain);
 w.burdens[id]=rank;return{id:id,old:old,rank:rank,calamity:false};
}
function endlessWheelFinishSpin(){
 const w=endlessWheelData(),p=w.pending;if(!p)return;
 const ids=[p.lineup[p.outcome]],double=endlessCalamity('forkedNeedle')&&((w.spinCount+1)%3===0);
 if(double){
  const options=p.lineup.filter(function(id){return id!==ids[0]&&!ENDLESS_CALAMITY_BY_ID[id]&&(w.burdens[id]||0)<3;});
  if(options.length)ids.push(options[Math.floor(endlessWheelRandom('fork|'+p.floor+'|'+w.spinCount)*options.length)]);
 }
 const awards=ids.map(endlessWheelApplyOne).filter(Boolean);p.awards=awards;p.status='result';w.spinCount++;w.spins.push({floor:p.floor,ids:ids.slice(),at:Math.round(G.run.t||0)});w.spins=w.spins.slice(-256);
 endlessWheelPrepareFloor(false);endlessWheelShowResult(awards);saveNow();
}
function endlessWheelShowResult(awards){
 const first=awards[0];if(!first)return;
 const data=ENDLESS_BURDEN_BY_ID[first.id]||ENDLESS_CALAMITY_BY_ID[first.id],cal=first.calamity;
 T('endlessWheel').dataset.phase='result';T('endlessWheelResult').dataset.kind=cal?'calamity':'burden';
 setTxt('endlessWheelResultType',cal?'CALAMITY BOUND':(first.old?'BURDEN DEEPENED':'BURDEN BOUND'));setTxt('endlessWheelResultName',data.name);setTxt('endlessWheelResultMark',data.mark);
 let text=cal?data.desc:data.r[first.rank-1];
 if(awards.length>1){const second=ENDLESS_BURDEN_BY_ID[awards[1].id];text+=' The Forked Needle also bound '+second.name+' at Rank '+awards[1].rank+'.';}
 setTxt('endlessWheelResultText',text);
 let i=0;for(const pip of T('endlessWheelRank').children){i++;pip.classList.toggle('on',!cal&&i<=first.rank);}
 T('endlessWheelAction').textContent='CARRY THE WEIGHT';T('endlessWheelAction').disabled=false;endlessWheelRefreshCounts();
 try{sfx(cal?'boss':'mythic');}catch(_){try{sfx('boss');}catch(__){}}
 T('endlessWheelAction').focus({preventScroll:true});
}
function endlessWheelAction(){
 const w=endlessWheelData(),p=w?.pending;if(!p)return;
 if(p.status==='result'){
  w.pending=null;G.run.endlessOathPending=0;hide('endlessWheel');setState('playing');if(G.player)G.player.hitCd=Math.max(G.player.hitCd||0,1.2);saveNow();return;
 }
 if(p.status==='spinning')return;
 p.status='spinning';T('endlessWheelAction').disabled=true;setTxt('endlessWheelResultType','THE WHEEL IS TURNING');setTxt('endlessWheelResultName','Listen for the iron.');setTxt('endlessWheelResultText','What lands will remain until this descent ends.');
 const lineup=p.lineup.map(function(id){return ENDLESS_BURDEN_BY_ID[id]||ENDLESS_CALAMITY_BY_ID[id];}),step=TAU/12,target=-Math.PI/2-(p.outcome+.5)*step,start=endlessWheelAngle,turns=save.motion?1:6,destination=target+turns*TAU;
 const duration=save.motion?900:(G.run?.runner?.timerEnabled?2700:4600),began=performance.now();let lastTick=-1;
 cancelAnimationFrame(endlessWheelAnimation);
 const frame=function(now){
  const q=Math.min(1,(now-began)/duration),ease=1-Math.pow(1-q,4);endlessWheelAngle=start+(destination-start)*ease;
  const tick=Math.floor((endlessWheelAngle-start)/step);if(tick!==lastTick){lastTick=tick;try{sfx('ui');}catch(_){}}
  endlessWheelDraw(endlessWheelAngle,lineup,q===1?p.outcome:-1);
  if(q<1){endlessWheelAnimation=requestAnimationFrame(frame);return;}
  endlessWheelAngle=target;endlessWheelDraw(endlessWheelAngle,lineup,p.outcome);endlessWheelFinishSpin();
 };
 endlessWheelAnimation=requestAnimationFrame(frame);
}
function endlessWheelRuntime(reset){
 const w=endlessWheelData();if(!w)return null;
 if(reset||!w.runtime||w.runtime.floor!==G.floor){
  w.runtime={floor:G.floor,clock:5.5,step:0,events:[],hazards:[],tempRanks:{},room:-1,rooms:0,shot:0,dash:0,still:0,lastX:G.player?.x||0,lastY:G.player?.y||0,lastDash:false,lastHp:G.player?.hp||0,revived:0,grave:0,pair:0,pickClock:0,bossStarted:false,coda:false,flameTrial:0,gatekeeper:false};
 }
 return w.runtime;
}
function endlessWheelTemporaryBurden(rt,key,count){
 const owned=ENDLESS_BURDENS.filter(function(b){return endlessBurdenRank(b.id)<3;});
 if(!owned.length)return;
 for(let i=0;i<count;i++){const b=owned[Math.floor(endlessWheelRandom(key+'|'+i)*owned.length)];rt.tempRanks[b.id]=Math.min(1,(rt.tempRanks[b.id]||0)+1);}
}
function endlessWheelPrepareFloor(reset){
 if(!endlessWheelActive()||!G.world||!G.player)return;
 const rt=endlessWheelRuntime(reset);
 if(reset){
  if(endlessCalamity('handBeneath'))endlessWheelTemporaryBurden(rt,'hand|'+G.floor,1);
  if(endlessCalamity('shatteredSpoke'))endlessWheelTemporaryBurden(rt,'spoke|'+G.floor,1);
  if(endlessCalamity('convergence')){
   const owned=ENDLESS_BURDENS.filter(function(b){return (endlessWheelData().burdens[b.id]||0)>0&&(endlessWheelData().burdens[b.id]||0)<3;});
   for(const b of endlessWheelShuffle(owned,'converge|'+G.floor).slice(0,2))rt.tempRanks[b.id]=1;
  }
 }
 let index=0;for(const e of G.enemies)if(!e.dead&&!e.isBoss&&!e.mechanism)endlessWheelMarkEnemy(e,index++);
 if(endlessBurdenRank('gatekeeper')&&!rt.gatekeeper)endlessWheelSpawnGatekeeper(rt);
 endlessWheelRefreshUI();
}
function endlessWheelSpawnGatekeeper(rt){
 const rank=endlessBurdenRank('gatekeeper'),room=G.world.exit,roster=LATE_ROSTERS?.[lateRegion(G.floor).key]||[];
 if(!room||!roster.length)return;
 const x=(room.x+1.7)*TILE,y=(room.y+room.h*.5)*TILE,type=roster[Math.floor(endlessWheelRandom('gate|'+G.floor)*roster.length)],e=spawnEnemy(type,x,y,true);e.aggro=false;e.wheelGatekeeper=true;e.max*=1+.3*rank;e.hp=e.max;rt.gatekeeper=true;
 for(let i=1;i<rank;i++){const a=i*TAU/rank,escort=spawnEnemy(roster[(i+2)%roster.length],x+Math.cos(a)*62,y+Math.sin(a)*62,false);escort.aggro=false;escort.wheelEscort=true;}
}
function endlessWheelMarkEnemy(e,index){
 if(!e||e.wheelMarked)return;
 const key='enemy|'+G.floor+'|'+(e.uid||index),rankMarked=endlessBurdenRank('markedEmber'),rankCrown=endlessBurdenRank('crownedBlood'),rankPair=endlessBurdenRank('sharedBreath'),rankFuneral=endlessBurdenRank('funeralPair');
 e.wheelMarked=true;
 if(rankMarked&&endlessWheelRandom(key+'|mark')<.07*rankMarked)e.wheelQuarry=true;
 if(rankCrown&&index%(Math.max(4,9-rankCrown))===0)e.wheelCrown=true;
 if(endlessBurdenRank('borrowedFaces')&&endlessWheelRandom(key+'|face')<.05*endlessBurdenRank('borrowedFaces'))e.wheelMimic=true;
 if(endlessBurdenRank('ashCollector')&&index===1){e.wheelCollector=true;e.wheelStore=0;e.max*=1+.18*endlessBurdenRank('ashCollector');e.hp=e.max;}
 if(endlessBurdenRank('blackStandard')&&index%(Math.max(5,11-endlessBurdenRank('blackStandard')))==2)e.wheelStandard=true;
 if(endlessBurdenRank('inheritedArmor')&&index===2)e.wheelArmor=endlessBurdenRank('inheritedArmor');
 if(endlessBurdenRank('falseShapes')&&index%Math.max(3,7-endlessBurdenRank('falseShapes'))===0)e.wheelFalse=true;
 const rt=endlessWheelRuntime();
 if(rankPair&&index%Math.max(4,7-rankPair)===0)rt.pair=e.uid;else if(rankPair&&rt.pair){const other=G.enemies.find(function(o){return o.uid===rt.pair&&!o.dead;});if(other){e.wheelLink=other.uid;other.wheelLink=e.uid;}rt.pair=0;}
 if(rankFuneral&&index%Math.max(5,8-rankFuneral)===1)e.wheelFuneral='waiting';else if(rankFuneral&&G.enemies.some(function(o){return o.wheelFuneral==='waiting'&&!o.dead;})){const other=G.enemies.find(function(o){return o.wheelFuneral==='waiting'&&!o.dead;});if(other){other.wheelFuneral=e.uid;e.wheelFuneral=other.uid;}}
}
function endlessWheelRefreshUI(){
 const visible=endlessWheelActive(),quick=T('endlessWeightButton'),pause=T('endlessWeightPause');
 quick?.classList.toggle('visible',visible&&G.state==='playing');pause?.classList.toggle('visible',visible);if(visible)endlessWheelRefreshCounts();
}

endlessWheelBuildUI();

function endlessWheelRoom(){
 if(!G.world?.rooms||!G.player)return null;
 for(let i=0;i<G.world.rooms.length;i++){const r=G.world.rooms[i],x=G.player.x/TILE,y=G.player.y/TILE;if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)return{room:r,index:i};}
 return null;
}
function endlessWheelBounds(){
 const current=endlessWheelRoom(),r=current?.room||G.world?.exit;
 if(!r)return{left:G.player.x-260,right:G.player.x+260,top:G.player.y-190,bottom:G.player.y+190,cx:G.player.x,cy:G.player.y};
 return{left:(r.x+.5)*TILE,right:(r.x+r.w-.5)*TILE,top:(r.y+.5)*TILE,bottom:(r.y+r.h-.5)*TILE,cx:(r.x+r.w*.5)*TILE,cy:(r.y+r.h*.5)*TILE};
}
function endlessWheelDamage(rank,mul){
 return Math.max(2,Math.round((G.player?.maxHp||100)*(.025+.012*rank)*(mul||1)));
}
function endlessWheelHazard(type,options){
 const rt=endlessWheelRuntime(),rank=options.rank||1,h=Object.assign({type:type,age:0,delay:Math.max(.2,.78-.1*rank),life:.55,rank:rank,damage:endlessWheelDamage(rank,1),hit:0},options);
 if(endlessBurdenRank('veiledIntent'))h.delay*=1-.12*endlessBurdenRank('veiledIntent');
 rt.hazards.push(h);if(rt.hazards.length>72)rt.hazards.splice(0,rt.hazards.length-72);
 return h;
}
function endlessWheelQueue(time,type,data){
 const rt=endlessWheelRuntime();rt.events.push({t:Math.max(.05,time),type:type,data:data||{}});if(rt.events.length>96)rt.events.splice(0,rt.events.length-96);
}
function endlessWheelSpawnHunter(count){
 const roster=LATE_ROSTERS?.[lateRegion(G.floor).key]||[],rooms=G.world?.rooms||[];if(!roster.length||!rooms.length)return;
 const candidates=rooms.filter(function(r){return d2(r.cx*TILE,r.cy*TILE,G.player.x,G.player.y)>300*300;});
 for(let i=0;i<count;i++){const room=candidates[(i+Math.floor(endlessWheelRandom('hunter|'+G.floor+'|'+endlessWheelRuntime().step)*Math.max(1,candidates.length)))%Math.max(1,candidates.length)]||rooms[0],type=roster[(i+endlessWheelRuntime().step)%roster.length],pos=safePosition(G.world,room.cx*TILE+rand(-35,35),room.cy*TILE+rand(-35,35),ETYPES[type]?.r||12);if(pos){const e=spawnEnemy(type,pos.x,pos.y,true);e.aggro=true;e.wheelHunter=true;}}
}
function endlessWheelSpawnBrood(x,y,count){
 const roster=LATE_ROSTERS?.[lateRegion(G.floor).key]||[],type=roster.find(function(id){return (ETYPES[id]?.r||99)<14;})||roster[0];if(!type)return;
 for(let i=0;i<count;i++){const a=i*TAU/count,pos=safePosition(G.world,x+Math.cos(a)*28,y+Math.sin(a)*28,ETYPES[type]?.r||9);if(pos){const e=spawnEnemy(type,pos.x,pos.y,false);e.aggro=true;e.wheelBrood=true;e.max*=.48;e.hp=e.max;e.dmg=Math.max(1,Math.round(e.dmg*.65));}}
}
function endlessWheelFirePulse(id,rank){
 if(!rank||G.state!=='playing'||G.dead)return;
 const p=G.player,b=endlessWheelBounds(),rt=endlessWheelRuntime(),boss=G.bossActive&&G.boss&&!G.boss.dead,base=Math.atan2(p.y-b.cy,p.x-b.cx);
 if(id==='longHunt'){endlessWheelSpawnHunter(Math.min(3,rank));fieldNote('The hunt has found this room.',1.8);}
 else if(id==='closingHounds'){
  const n=1+rank;for(let i=0;i<n;i++){const side=i%2,angle=side?0:Math.PI,x=side?b.left-22:b.right+22,y=clamp(p.y+(i-(n-1)/2)*52,b.top+20,b.bottom-20);endlessWheelHazard('hound',{x:x,y:y,vx:Math.cos(angle)*260,vy:Math.sin(angle)*260,radius:15,delay:.32,life:2.8,rank:rank});}
 }
 else if(id==='cutoff'){
  const a=Math.atan2(p.y-rt.lastY,p.x-rt.lastX)||base+Math.PI/2;endlessWheelHazard('line',{x:p.x-Math.cos(a)*46,y:p.y-Math.sin(a)*46,angle:a+Math.PI/2,length:Math.hypot(b.right-b.left,b.bottom-b.top),width:10+rank*3,delay:.46,life:.55+rank*.18,rank:rank,move:rank===3?42:0});
  if(rank>1)endlessWheelQueue(.7,'hazard',{type:'line',options:{x:p.x,y:p.y,angle:a,length:Math.hypot(b.right-b.left,b.bottom-b.top),width:10+rank*3,delay:.38,life:.5,rank:rank}});
 }
 else if(id==='writtenAsh'){
  endlessWheelHazard('sigil',{x:rt.lastX,y:rt.lastY,radius:30+rank*9,delay:.62,life:.5,rank:rank});
  if(rank===3)endlessWheelQueue(.55,'hazard',{type:'sigil',options:{x:p.x,y:p.y,radius:45,delay:.5,life:.5,rank:rank}});
 }
 else if(id==='stolenGround'){
  for(let i=0;i<rank+1;i++){const a=base+i*TAU/(rank+1),dist=42+i*19;endlessWheelHazard('zone',{x:p.x-Math.cos(a)*dist,y:p.y-Math.sin(a)*dist,radius:23+rank*5,delay:.5+i*.12,life:2.1+rank*.3,rank:rank,damage:endlessWheelDamage(rank,.75)});}
 }
 else if(id==='unquietWalls'){
  const horizontal=(rt.step+rank)%2===0,n=3+rank*2;for(let i=0;i<n;i++){const t=(i+.5)/n,x=horizontal?b.left:b.left+(b.right-b.left)*t,y=horizontal?b.top+(b.bottom-b.top)*t:b.top,a=horizontal?0:Math.PI/2;endlessWheelHazard('dart',{x:x,y:y,vx:Math.cos(a)*(235+rank*24),vy:Math.sin(a)*(235+rank*24),radius:5,delay:.42+i*.045,life:2.6,rank:rank,damage:endlessWheelDamage(rank,.6)});}
 }
 else if(id==='closingTeeth'){
  const angle=(rt.step%2)*Math.PI/2,gap=44-rank*5,offset=(rt.step%3-1)*55;endlessWheelHazard('line',{x:b.cx+Math.cos(angle+Math.PI/2)*(offset-gap),y:b.cy+Math.sin(angle+Math.PI/2)*(offset-gap),angle:angle,length:Math.hypot(b.right-b.left,b.bottom-b.top),width:14+rank*2,delay:.65,life:.42,rank:rank});endlessWheelHazard('line',{x:b.cx+Math.cos(angle+Math.PI/2)*(offset+gap),y:b.cy+Math.sin(angle+Math.PI/2)*(offset+gap),angle:angle,length:Math.hypot(b.right-b.left,b.bottom-b.top),width:14+rank*2,delay:.65,life:.42,rank:rank});
  if(rank>1)endlessWheelQueue(1.05,'hazard',{type:'line',options:{x:b.cx,y:b.cy,angle:angle+Math.PI/2,length:Math.hypot(b.right-b.left,b.bottom-b.top),width:13+rank*2,delay:.45,life:.38,rank:rank}});
 }
 else if(id==='rootedStone'){if(rt.still>.45){endlessWheelHazard('roots',{x:p.x,y:p.y,radius:28+rank*10,delay:.58,life:1.15,rank:rank});if(rank===3)for(let i=0;i<4;i++)endlessWheelHazard('roots',{x:p.x+Math.cos(i*TAU/4)*56,y:p.y+Math.sin(i*TAU/4)*56,radius:20,delay:.82+i*.06,life:.8,rank:rank});}}
 else if(id==='fallingSky'){
  for(let i=0;i<rank+2;i++){const lead=.18*i,x=clamp(p.x+(p.vigilVX||0)*lead+rand(-48,48),b.left+24,b.right-24),y=clamp(p.y+(p.vigilVY||0)*lead+rand(-48,48),b.top+24,b.bottom-24);endlessWheelHazard('fall',{x:x,y:y,radius:22+rank*3,delay:.72+i*.1,life:.3,rank:rank});}
 }
 else if(id==='bellDebt'){
  endlessWheelHazard('ring',{x:b.cx,y:b.cy,radius:12,endRadius:Math.max(b.right-b.left,b.bottom-b.top)*.72,width:9+rank*2,delay:.56,life:1.45-rank*.08,rank:rank});
  if(rank===3)endlessWheelQueue(1.6,'hazard',{type:'ring',options:{x:b.cx,y:b.cy,radius:Math.max(b.right-b.left,b.bottom-b.top)*.72,endRadius:8,width:10,delay:.25,life:1.1,rank:rank}});
 }
 else if(id==='doubleToll'){
  endlessWheelHazard('line',{x:b.cx,y:b.cy,angle:base+Math.PI/2,length:Math.hypot(b.right-b.left,b.bottom-b.top),width:10+rank*2,delay:.58,life:.38,rank:rank});
  endlessWheelQueue(.95,'hazard',{type:'line',options:{x:b.cx,y:b.cy,angle:base+Math.PI/2+(rank>1?Math.PI/2:0),length:Math.hypot(b.right-b.left,b.bottom-b.top),width:11+rank*2,delay:.4,life:.42,rank:rank}});
  if(rank===3)endlessWheelQueue(1.75,'hazard',{type:'sigil',options:{x:p.x,y:p.y,radius:34,delay:.4,life:.4,rank:rank}});
 }
 else if(id==='wrongReflection'){
  const x=b.cx-(p.x-b.cx),y=b.cy-(p.y-b.cy);endlessWheelHazard('sigil',{x:x,y:y,radius:30+rank*5,delay:.54,life:.45,rank:rank});if(rank>1)endlessWheelQueue(.45,'hazard',{type:'sigil',options:{x:p.x,y:p.y,radius:28+rank*5,delay:.42,life:.4,rank:rank}});
 }
 else if(id==='watcher'){if(rt.still>.7){const edge=endlessWheelRandom('eye|'+rt.step)<.5?{x:b.left,y:b.top+(b.bottom-b.top)*endlessWheelRandom('ey|'+rt.step)}:{x:b.left+(b.right-b.left)*endlessWheelRandom('ex|'+rt.step),y:b.top};endlessWheelHazard('line',{x:edge.x,y:edge.y,angle:Math.atan2(p.y-edge.y,p.x-edge.x),length:Math.hypot(b.right-b.left,b.bottom-b.top)*1.4,width:7+rank*2,delay:.62-rank*.08,life:.46,rank:rank});}}
 else if(id==='guardianDue'&&boss){
  const a=arenaBounds();endlessWheelHazard('ring',{x:a.cx,y:a.cy,radius:25,endRadius:Math.max(a.right-a.left,a.bottom-a.top)*.65,width:8+rank*2,delay:.52,life:1.25,rank:rank,damage:endlessWheelDamage(rank,1.2)});
 }
 else if(id==='siegeMemory'&&boss){
  const a=arenaBounds(),n=rank+1;for(let i=0;i<n;i++){const x=i%2?a.right:a.left,y=i<2?a.top:a.bottom,ang=Math.atan2(p.y-y,p.x-x);for(let j=0;j<3;j++)endlessWheelHazard('dart',{x:x,y:y,vx:Math.cos(ang+(j-1)*.13)*250,vy:Math.sin(ang+(j-1)*.13)*250,radius:6,delay:.46+i*.12,life:3,rank:rank,damage:endlessWheelDamage(rank,.65)});}
 }
 else if(id==='finalAudience'&&boss){
  const roster=LATE_ROSTERS?.[lateRegion(G.floor).key]||[],a=arenaBounds(),n=1+rank;for(let i=0;i<n;i++){const ang=i*TAU/n,pos=safePosition(G.world,a.cx+Math.cos(ang)*Math.min(150,(a.right-a.left)*.32),a.cy+Math.sin(ang)*Math.min(110,(a.bottom-a.top)*.32),12);if(pos&&roster.length){const e=spawnEnemy(roster[(i+rt.step)%roster.length],pos.x,pos.y,false);e.aggro=true;e.wheelAudience=true;}}
 }
 if(endlessBurdenRank('doubleToll')&&id!=='doubleToll'&&id!=='longHunt'&&id!=='finalAudience'&&endlessWheelRandom('double|'+rt.step)<.12*endlessBurdenRank('doubleToll'))endlessWheelQueue(1.25,'pulse',{id:id,rank:Math.max(1,rank-1)});
}
function endlessWheelPeriodic(){
 const rt=endlessWheelRuntime(),pool=ENDLESS_PERIODIC.filter(function(id){const rank=endlessBurdenRank(id);return rank>0&&(!['guardianDue','siegeMemory','finalAudience'].includes(id)||G.bossActive);});
 if(!pool.length){rt.clock=7;return;}
 const id=pool[rt.step%pool.length],rank=endlessBurdenRank(id);rt.step++;endlessWheelFirePulse(id,rank);
 const pressure=Math.min(2.6,endlessBurdenWeight()*.025),boss=G.bossActive?1.1:0;rt.clock=Math.max(4.4,9.2-pressure-boss+endlessWheelRandom('clock|'+G.floor+'|'+rt.step)*2.2);
}
function endlessWheelProcessEvent(event){
 const d=event.data||{};
 if(event.type==='hazard')endlessWheelHazard(d.type,d.options||{});
 else if(event.type==='pulse')endlessWheelFirePulse(d.id,d.rank);
 else if(event.type==='hunter')endlessWheelSpawnHunter(d.count||1);
 else if(event.type==='brood')endlessWheelSpawnBrood(d.x,d.y,d.count||2);
 else if(event.type==='resurrect'){
  const e=G.enemies.find(function(o){return o.uid===d.uid;});if(e&&e.dead){e.dead=false;e.hp=Math.max(1,e.max*(d.elite?.42:.3));e.wheelReturned=true;e.aggro=true;burst(e.x,e.y,18,'#b9dcff',150,.7,2.5,true);}
 }
 else if(event.type==='volley'){
  const e=G.enemies.find(function(o){return o.uid===d.uid&&!o.dead;});if(e){for(let i=0;i<d.count;i++){const a=d.angle+(i-(d.count-1)/2)*.13;G.ebul.push({x:e.x,y:e.y,vx:Math.cos(a)*d.speed,vy:Math.sin(a)*d.speed,r:5,dmg:d.damage,life:4.5,wheelPale:true});}}
 }
}
function endlessWheelHazardCollision(h,p){
 if(h.type==='circle'||h.type==='sigil'||h.type==='roots'||h.type==='fall'||h.type==='zone')return d2(h.x,h.y,p.x,p.y)<Math.pow((h.radius||24)+p.r,2);
 if(h.type==='hound'||h.type==='dart')return d2(h.x,h.y,p.x,p.y)<Math.pow((h.radius||7)+p.r,2);
 if(h.type==='ring'){const q=clamp((h.age-h.delay)/Math.max(.01,h.life),0,1),r=lerp(h.radius||0,h.endRadius||180,q);return Math.abs(Math.hypot(p.x-h.x,p.y-h.y)-r)<(h.width||9)+p.r;}
 if(h.type==='line'){const dx=p.x-h.x,dy=p.y-h.y,a=h.angle||0,along=Math.abs(dx*Math.cos(a)+dy*Math.sin(a)),across=Math.abs(-dx*Math.sin(a)+dy*Math.cos(a));return along<(h.length||600)/2+p.r&&across<(h.width||10)+p.r;}
 if(h.type==='rotor'){const dx=p.x-h.x,dy=p.y-h.y,a=(h.angle||0)+h.age*(h.turn||.6),arms=h.arms||2;for(let i=0;i<arms;i++){const arm=a+i*TAU/arms,along=Math.abs(dx*Math.cos(arm)+dy*Math.sin(arm)),across=Math.abs(-dx*Math.sin(arm)+dy*Math.cos(arm));if(along<(h.length||600)/2+p.r&&across<(h.width||8)+p.r)return true;}return false;}
 return false;
}
function endlessWheelTickHazards(dt){
 const rt=endlessWheelRuntime(),p=G.player;
 for(let i=rt.hazards.length-1;i>=0;i--){const h=rt.hazards[i];h.age+=dt;h.hit=Math.max(0,(h.hit||0)-dt);if((h.type==='hound'||h.type==='dart')&&h.age>=h.delay){h.x+=h.vx*dt;h.y+=h.vy*dt;}if(h.type==='line'&&h.move&&h.age>=h.delay){h.x+=Math.cos((h.angle||0)+Math.PI/2)*h.move*dt;h.y+=Math.sin((h.angle||0)+Math.PI/2)*h.move*dt;}if(h.age>=h.delay&&h.age<=h.delay+h.life&&!h.hit&&endlessWheelHazardCollision(h,p)){h.hit=.6;hurtPlayer(h.damage||endlessWheelDamage(h.rank||1,1),h.x,h.y);}if(h.age>h.delay+h.life+.1)rt.hazards.splice(i,1);}
}
function endlessWheelTickProjectiles(dt){
 for(const b of G.ebul){if(!b.wheelFreeze)continue;b.wheelFreeze-=dt;if(b.wheelFreeze<=0&&b.wheelHeld){const rank=endlessBurdenRank('borrowedMoment'),speed=Math.hypot(b.wheelVX,b.wheelVY);if(rank>1&&speed){const a=Math.atan2(G.player.y-b.y,G.player.x-b.x);b.vx=Math.cos(a)*speed;b.vy=Math.sin(a)*speed;}else{b.vx=b.wheelVX;b.vy=b.wheelVY;}b.wheelHeld=false;}else if(b.wheelFreeze>0&&!b.wheelHeld){b.wheelVX=b.vx;b.wheelVY=b.vy;b.vx=0;b.vy=0;b.wheelHeld=true;}}
}
function endlessWheelRoomStep(dt){
 const rt=endlessWheelRuntime(),now=endlessWheelRoom(),rankClock=endlessBurdenRank('famineClock');
 if(now&&now.index!==rt.room){
  rt.room=now.index;rt.rooms++;rt.roomAge=0;rt.coda=false;rt.famineExpired=false;
  const long=endlessBurdenRank('longHunt');if(long&&rt.rooms%Math.max(2,4-long)===0)endlessWheelQueue(.9,'hunter',{count:Math.min(3,long)});
  if(endlessCalamity('weightSeven')&&rt.rooms%7===0){const pool=ENDLESS_PERIODIC.filter(function(id){return endlessBurdenRank(id)>0;});for(let i=0;i<Math.min(3,pool.length);i++)endlessWheelQueue(.6+i*1.15,'pulse',{id:pool[(rt.step+i*3)%pool.length],rank:endlessBurdenRank(pool[(rt.step+i*3)%pool.length])});fieldNote('The seventh room bears the whole weight.',2.2);}
 }
 rt.roomAge=(rt.roomAge||0)+dt;
 if(rankClock&&rt.roomAge>Math.max(13,25-rankClock*4)&&!rt.famineExpired&&G.enemies.some(function(e){return !e.dead&&!e.isBoss&&d2(e.x,e.y,G.player.x,G.player.y)<650*650;})){
  rt.famineExpired=true;for(const e of G.enemies)if(!e.dead&&!e.isBoss){e.wheelFamine=true;if(!e.wheelFamineBase){e.wheelFamineBase=e.spd;e.spd*=1+.1*rankClock;}}if(rankClock>1)endlessWheelSpawnHunter(rankClock-1);fieldNote('The Famine Clock has emptied.',2);
 }
}
function endlessWheelTickEnemies(dt){
 const rt=endlessWheelRuntime(),p=G.player,blood=endlessBurdenRank('bloodScent'),currentBoss=!!(G.bossActive&&G.boss&&!G.boss.dead);
 for(const e of G.enemies){
  if(e.dead)continue;
  if(e.wheelQuarry){e.aggro=true;if(!e.wheelQuarryBase)e.wheelQuarryBase=e.spd;e.spd=e.wheelQuarryBase*(1+(blood&&p.hp<p.maxHp*.5?.08*blood:0));}
  if(blood&&p.hp<p.maxHp*.5){if(!e.wheelBloodBase)e.wheelBloodBase=e.spd;e.spd=Math.max(e.spd,e.wheelBloodBase*(1+.06*blood));}
  if(e.wheelStandard){for(const o of G.enemies)if(o!==e&&!o.dead&&d2(o.x,o.y,e.x,e.y)<Math.pow(150+endlessBurdenRank('blackStandard')*35,2)){o.hitT=Math.max(o.hitT||0,.02);}}
  if(e.wheelCollector&&G.picks.length){const nearest=G.picks.reduce(function(a,o){return !a||d2(o.x,o.y,e.x,e.y)<d2(a.x,a.y,e.x,e.y)?o:a;},null);if(nearest){const d=Math.sqrt(d2(nearest.x,nearest.y,e.x,e.y))||1;nearest.x+=(e.x-nearest.x)/d*90*dt;nearest.y+=(e.y-nearest.y)/d*90*dt;if(d<e.r+10){e.wheelStore+=(nearest.val||1);e.max*=1.008;e.hp=Math.min(e.max,e.hp+e.max*.012);G.picks.splice(G.picks.indexOf(nearest),1);}}}
 }
 if(currentBoss&&!rt.bossStarted){
  rt.bossStarted=true;
  if(endlessCalamity('guardianChoice')){const owned=ENDLESS_BURDENS.filter(function(b){return (endlessWheelData().burdens[b.id]||0)>0;});if(owned.length){const choice=owned[Math.floor(endlessWheelRandom('guardian-choice|'+G.floor)*owned.length)];rt.tempRanks[choice.id]=Math.max(rt.tempRanks[choice.id]||0,3-(endlessWheelData().burdens[choice.id]||0));fieldNote('The Guardian chose '+choice.name+'.',2.4);}}
  if(endlessCalamity('blackOrbit')){const a=arenaBounds();endlessWheelHazard('rotor',{x:a.cx,y:a.cy,angle:-Math.PI/2,length:Math.hypot(a.right-a.left,a.bottom-a.top)*1.15,width:7,delay:.8,life:999,rank:3,turn:.62,arms:2,damage:endlessWheelDamage(3,1.15)});}
  if(endlessBurdenRank('crownThorns'))endlessWheelSpawnThorns();
 }
 if(currentBoss&&endlessBurdenRank('crownThorns')>1&&G.boss.hp<G.boss.max*.5&&!rt.thornsReturned&&!G.enemies.some(function(e){return !e.dead&&e.wheelThorn;})){rt.thornsReturned=true;endlessWheelSpawnThorns();}
 if(!currentBoss&&endlessWheelLastBoss)rt.bossStarted=false;
 endlessWheelLastBoss=currentBoss;
}
function endlessWheelSpawnThorns(){
 const rank=endlessBurdenRank('crownThorns'),a=arenaBounds(),roster=LATE_ROSTERS?.[lateRegion(G.floor).key]||[],type=roster[0];if(!type)return;
 for(let i=0;i<Math.min(3,rank+1);i++){const ang=i*TAU/Math.min(3,rank+1)-Math.PI/2,pos=safePosition(G.world,a.cx+Math.cos(ang)*120,a.cy+Math.sin(ang)*88,12);if(pos){const e=spawnEnemy(type,pos.x,pos.y,true);e.wheelThorn=true;e.aggro=true;e.max*=1.7;e.hp=e.max;}}
}
function endlessWheelTick(dt){
 if(!endlessWheelActive()||G.state!=='playing'||!G.player||!G.world)return;
 const rt=endlessWheelRuntime();
 const moved=Math.hypot(G.player.x-rt.lastX,G.player.y-rt.lastY);rt.still=moved<.8?rt.still+dt:0;
 const dashing=G.player.dashT>0;if(dashing&&!rt.lastDash){rt.dash++;const rank=endlessBurdenRank('oldFootsteps');if(rank){const a=Math.atan2(G.player.vigilVY||G.player.y-rt.lastY,G.player.vigilVX||G.player.x-rt.lastX);endlessWheelQueue(.48,'hazard',{type:'line',options:{x:G.player.x,y:G.player.y,angle:a,length:130+rank*70,width:8+rank*2,delay:.25,life:.32,rank:rank}});if(rank===3&&rt.dash%3===0)endlessWheelQueue(.7,'hazard',{type:'line',options:{x:G.player.x,y:G.player.y,angle:a+Math.PI/2,length:240,width:10,delay:.24,life:.34,rank:rank}});}if(endlessBurdenRank('markedEmber')===3)for(const e of G.enemies)if(!e.dead&&e.wheelQuarry)e.spd*=1.025;}
 rt.lastDash=dashing;rt.clock-=dt;if(rt.clock<=0)endlessWheelPeriodic();
 for(let i=rt.events.length-1;i>=0;i--){const e=rt.events[i];e.t-=dt;if(e.t<=0){rt.events.splice(i,1);endlessWheelProcessEvent(e);}}
 endlessWheelTickHazards(dt);endlessWheelTickProjectiles(dt);endlessWheelRoomStep(dt);endlessWheelTickEnemies(dt);
 const current=endlessWheelRoom(),currentRoom=current?.index??-1,deep=endlessBurdenRank('deepCurrent');
 if(deep){const a=(G.floor*.71+(currentRoom+1)*1.37+Math.sin(G.tAll*.12))*1.9,force=(9+deep*7)*dt;moveEnt(G.world,G.player,Math.cos(a)*force,Math.sin(a)*force);for(const e of G.enemies)if(!e.dead&&!e.isBoss)moveEnt(G.world,e,Math.cos(a)*force*.3,Math.sin(a)*force*.3);}
 if(endlessBurdenRank('rootedStone')&&rt.still>1.2&&rt.clock>2.2){endlessWheelFirePulse('rootedStone',endlessBurdenRank('rootedStone'));rt.still=0;}
 if(endlessBurdenRank('watcher')&&rt.still>1.65&&rt.clock>1.8){endlessWheelFirePulse('watcher',endlessBurdenRank('watcher'));rt.still=0;}
 rt.lastX=G.player.x;rt.lastY=G.player.y;rt.lastHp=G.player.hp;
}
function endlessWheelRegisterShots(e,start){
 if(!endlessWheelActive()||!e)return;
 const rt=endlessWheelRuntime(),shots=G.ebul.slice(start),shadow=endlessBurdenRank('secondShadow'),moment=endlessBurdenRank('borrowedMoment'),late=endlessBurdenRank('lateChime'),seventh=endlessBurdenRank('seventhBeat');rt.shot++;
 if(moment&&rt.shot%Math.max(2,5-moment)===0)for(const b of shots)b.wheelFreeze=.32+moment*.14;
 if(shadow&&rt.shot%Math.max(2,5-shadow)===0)for(const b of shots.slice(0,4)){const speed=Math.hypot(b.vx,b.vy),angle=Math.atan2(b.vy,b.vx);endlessWheelQueue(.55,'volley',{uid:e.uid,count:1,angle:angle+(shadow===3?Math.PI:0),speed:speed*.92,damage:b.dmg*.7});}
 if(late&&rt.shot%Math.max(2,6-late)===0&&shots[0])endlessWheelQueue(.7,'volley',{uid:e.uid,count:Math.min(3,late),angle:Math.atan2(G.player.y-e.y,G.player.x-e.x),speed:Math.hypot(shots[0].vx,shots[0].vy)*(1+late*.06),damage:shots[0].dmg*.65});
 if(seventh&&rt.shot%7===0){const count=seventh===1?1:seventh===2?3:8,angle=Math.atan2(G.player.y-e.y,G.player.x-e.x);for(let i=0;i<count;i++){const a=seventh===3?i*TAU/count:angle+(i-(count-1)/2)*.12;G.ebul.push({x:e.x,y:e.y,vx:Math.cos(a)*230,vy:Math.sin(a)*230,r:5,dmg:Math.max(1,e.dmg*.5),life:4,wheelPale:true});}}
 if(e.wheelMimic&&rt.shot%3===0){const a=Math.atan2(G.player.y-e.y,G.player.x-e.x),rank=endlessBurdenRank('borrowedFaces');for(let i=0;i<rank;i++)G.ebul.push({x:e.x,y:e.y,vx:Math.cos(a+(i-(rank-1)/2)*.1)*260,vy:Math.sin(a+(i-(rank-1)/2)*.1)*260,r:4,dmg:Math.max(1,e.dmg*.42),life:3.4,wheelPale:true});}
}
function endlessWheelOnHeal(amount){
 if(!endlessWheelActive()||endlessWheelHealGuard||amount<=0)return;
 const rank=endlessBurdenRank('bitterCure');if(!rank)return;
 const count=Math.min(4,rank+Math.floor(amount/Math.max(1,G.player.maxHp*.24)));endlessWheelHealGuard=true;endlessWheelQueue(.45,'brood',{x:G.player.x,y:G.player.y,count:count});if(rank===3)endlessWheelHazard('zone',{x:G.player.x,y:G.player.y,radius:34,delay:.55,life:1.8,rank:rank});endlessWheelHealGuard=false;
}
function endlessWheelReleaseStored(e){
 if(!e.wheelStore)return;
 const count=Math.min(14,Math.max(2,Math.ceil(e.wheelStore/6))),each=Math.max(1,Math.ceil(e.wheelStore/count));for(let i=0;i<count;i++)spawnPick(i%4===0?'ess':'xp',e.x+rand(-18,18),e.y+rand(-18,18),each);
}
function endlessWheelAfterDeath(e){
 if(!endlessWheelActive()||!e?.dead)return;
 const rt=endlessWheelRuntime(),grave=endlessBurdenRank('graveChorus'),unfinished=endlessBurdenRank('unfinishedDeath'),brood=endlessBurdenRank('broodLaw'),final=endlessBurdenRank('finalMeasure');
 endlessWheelReleaseStored(e);
 if(grave&&(e.elite||grave===3||endlessWheelRandom('grave|'+e.uid)<.18*grave)){const n=5+grave*3;for(let i=0;i<n;i++){const a=i*TAU/n;G.ebul.push({x:e.x,y:e.y,vx:Math.cos(a)*(150+grave*25),vy:Math.sin(a)*(150+grave*25),r:4,dmg:Math.max(1,e.dmg*.3),life:3,wheelPale:true});}rt.grave++;}
 if(unfinished&&!e.isBoss&&!e.mechanism&&!e.wheelReturned&&rt.revived<unfinished+(unfinished===3?1:0)&&(unfinished===3&&e.elite||!e.elite)){rt.revived++;endlessWheelQueue(1.4,'resurrect',{uid:e.uid,elite:e.elite});}
 if(brood&&!e.isBoss&&!e.mechanism&&!e.wheelBrood&&endlessWheelRandom('brood|'+e.uid)<.13*brood)endlessWheelQueue(.7,'brood',{x:e.x,y:e.y,count:1+brood});
 if(e.wheelCrown){const next=G.enemies.filter(function(o){return !o.dead&&!o.isBoss&&!o.mechanism;}).sort(function(a,b){return d2(a.x,a.y,e.x,e.y)-d2(b.x,b.y,e.x,e.y);})[0];if(next)next.wheelCrown=true;}
 if(e.wheelArmor){const next=G.enemies.find(function(o){return !o.dead&&!o.isBoss&&!o.mechanism;});if(next)next.wheelArmor=Math.max(next.wheelArmor||0,e.wheelArmor);}
 if(e.wheelFuneral&&Number.isInteger(e.wheelFuneral)){const mate=G.enemies.find(function(o){return o.uid===e.wheelFuneral&&!o.dead;});if(mate){mate.spd*=1+.12*endlessBurdenRank('funeralPair');mate.dmg*=1+.1*endlessBurdenRank('funeralPair');mate.wheelMourning=true;if(endlessBurdenRank('funeralPair')===3)endlessWheelQueue(1,'brood',{x:e.x,y:e.y,count:1});}}
 const ordinary=G.enemies.filter(function(o){return !o.dead&&!o.isBoss&&!o.mechanism;});
 if(ordinary.length===1&&endlessBurdenRank('lastWitness')){const last=ordinary[0],rank=endlessBurdenRank('lastWitness');if(!last.wheelWitness){last.wheelWitness=true;last.max*=1+.22*rank;last.hp=Math.min(last.max,last.hp+last.max*.22*rank);last.spd*=1+.08*rank;last.dmg*=1+.1*rank;fieldNote('The last witness remains.',1.5);}}
 if(!ordinary.length&&final&&!rt.coda){rt.coda=true;const b=endlessWheelBounds();endlessWheelHazard('ring',{x:b.cx,y:b.cy,radius:12,endRadius:Math.max(b.right-b.left,b.bottom-b.top)*.7,width:8+final,delay:.55,life:1.2,rank:final});if(final>1)endlessWheelQueue(1.45,'hazard',{type:'ring',options:{x:b.cx,y:b.cy,radius:Math.max(b.right-b.left,b.bottom-b.top)*.7,endRadius:10,width:9,delay:.2,life:1.1,rank:final}});}
}
function endlessWheelDrawLinks(ctx){
 ctx.save();ctx.lineWidth=2;
 for(const e of G.enemies){if(e.dead||!e.wheelLink||e.uid>e.wheelLink)continue;const mate=G.enemies.find(function(o){return o.uid===e.wheelLink&&!o.dead;});if(!mate)continue;ctx.setLineDash([5,7]);ctx.lineDashOffset=-G.tAll*18;ctx.strokeStyle='rgba(193,217,238,.48)';ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(mate.x,mate.y);ctx.stroke();}
 ctx.restore();
}
function endlessWheelDrawMarks(ctx){
 const t=G.tAll;
 for(const e of G.enemies){if(e.dead)continue;ctx.save();ctx.translate(e.x,e.y);
  if(e.wheelQuarry){ctx.strokeStyle='rgba(255,104,72,.85)';ctx.lineWidth=2;ctx.rotate(t*.8);for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.beginPath();ctx.moveTo(e.r+7,0);ctx.lineTo(e.r+15,0);ctx.stroke();}}
  if(e.wheelCrown){ctx.fillStyle='#e5a153';ctx.beginPath();ctx.moveTo(-11,-e.r-11);ctx.lineTo(-6,-e.r-23);ctx.lineTo(0,-e.r-15);ctx.lineTo(7,-e.r-24);ctx.lineTo(12,-e.r-11);ctx.closePath();ctx.fill();}
  if(e.wheelCollector){ctx.strokeStyle='#b994d2';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,e.r+8,t,t+4.5);ctx.stroke();}
  if(e.wheelStandard){ctx.fillStyle='#171219';ctx.fillRect(e.r+5,-e.r-24,3,38);ctx.fillStyle='#9a493c';ctx.beginPath();ctx.moveTo(e.r+8,-e.r-22);ctx.lineTo(e.r+29,-e.r-15);ctx.lineTo(e.r+8,-e.r-7);ctx.closePath();ctx.fill();}
  if(e.wheelArmor){ctx.strokeStyle='rgba(218,191,141,.75)';ctx.lineWidth=3;ctx.setLineDash([7,4]);ctx.beginPath();ctx.arc(0,0,e.r+5,0,TAU);ctx.stroke();}
  if(e.wheelThorn){ctx.strokeStyle='#c25c4f';ctx.lineWidth=2;for(let i=0;i<7;i++){const a=i*TAU/7+t*.18;ctx.beginPath();ctx.moveTo(Math.cos(a)*(e.r+2),Math.sin(a)*(e.r+2));ctx.lineTo(Math.cos(a)*(e.r+11),Math.sin(a)*(e.r+11));ctx.stroke();}}
  if(e.wheelFalse){ctx.globalAlpha=.18;ctx.fillStyle='#cce7ff';for(let i=0;i<2;i++){const a=t*.7+i*Math.PI;ctx.beginPath();ctx.arc(Math.cos(a)*(e.r+22),Math.sin(a)*(e.r+14),e.r*.65,0,TAU);ctx.fill();}}
  ctx.restore();}
}
function endlessWheelDrawHazards(ctx){
 if(!endlessWheelActive())return;const rt=endlessWheelRuntime();
 for(const h of rt.hazards){const active=h.age>=h.delay,q=active?clamp((h.age-h.delay)/Math.max(.01,h.life),0,1):clamp(h.age/Math.max(.01,h.delay),0,1),alpha=active?.72:.13+.2*q;ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=active?'#ef7b4a':'#c7a17c';ctx.fillStyle=active?'rgba(214,72,42,.18)':'rgba(202,153,99,.055)';ctx.lineWidth=active?3:2;ctx.setLineDash(active?[]:[4,7]);
  if(['circle','sigil','roots','fall','zone'].includes(h.type)){ctx.beginPath();ctx.arc(h.x,h.y,h.radius||24,0,TAU);ctx.fill();ctx.stroke();if(h.type==='sigil'||h.type==='roots'){for(let i=0;i<6;i++){const a=i*TAU/6+G.tAll*.12,inner=(h.radius||24)*.35,outer=(h.radius||24)*.9;ctx.beginPath();ctx.moveTo(h.x+Math.cos(a)*inner,h.y+Math.sin(a)*inner);ctx.lineTo(h.x+Math.cos(a)*outer,h.y+Math.sin(a)*outer);ctx.stroke();}}if(h.type==='fall'&&!active){ctx.beginPath();ctx.moveTo(h.x,h.y-80*(1-q));ctx.lineTo(h.x,h.y-(h.radius||20));ctx.stroke();}}
  else if(h.type==='ring'){const rr=active?lerp(h.radius||0,h.endRadius||180,q):h.radius||10;ctx.lineWidth=h.width||9;ctx.beginPath();ctx.arc(h.x,h.y,rr,0,TAU);ctx.stroke();}
  else if(h.type==='line'){ctx.translate(h.x,h.y);ctx.rotate(h.angle||0);ctx.lineWidth=(h.width||10)*2;ctx.beginPath();ctx.moveTo(-(h.length||600)/2,0);ctx.lineTo((h.length||600)/2,0);ctx.stroke();}
  else if(h.type==='rotor'){ctx.translate(h.x,h.y);ctx.rotate((h.angle||0)+h.age*(h.turn||.6));ctx.lineWidth=(h.width||8)*2;for(let i=0;i<(h.arms||2);i++){ctx.rotate(TAU/(h.arms||2));ctx.beginPath();ctx.moveTo(-(h.length||600)/2,0);ctx.lineTo((h.length||600)/2,0);ctx.stroke();}}
  else if(h.type==='hound'||h.type==='dart'){ctx.translate(h.x,h.y);ctx.rotate(Math.atan2(h.vy||0,h.vx||1));ctx.fillStyle=active?'#f19a65':'#a47f67';ctx.beginPath();ctx.moveTo((h.radius||7)*1.5,0);ctx.lineTo(-(h.radius||7),-(h.radius||7)*.7);ctx.lineTo(-(h.radius||7),(h.radius||7)*.7);ctx.closePath();ctx.fill();}
  ctx.restore();}
}
function endlessWheelScreen(ctx){
 if(!endlessWheelActive()||!G.player)return;
 const dark=endlessBurdenRank('gatheringDark'),moon=endlessBurdenRank('moonlessRoom'),hoard=endlessBurdenRank('hoardedLight'),room=endlessWheelRoom(),moonlit=moon&&room&&endlessWheelHash('moon|'+G.floor+'|'+room.index)%Math.max(1,5-moon)===0,collector=G.enemies.some(function(e){return !e.dead&&e.wheelCollector&&e.wheelStore>0;});
 let opacity=dark*.065+(moonlit?.2:0)+(hoard&&collector?.08*hoard:0);if(G.bossActive)opacity*=.7;if(opacity<=.01)return;
 const x=G.player.x-G.cam.x,y=G.player.y-G.cam.y,radius=Math.max(125,300-dark*30-(moonlit?55:0));ctx.save();ctx.setTransform(G.dpr,0,0,G.dpr,0,0);const g=ctx.createRadialGradient(x,y,radius*.42,x,y,radius);g.addColorStop(0,'rgba(2,3,7,0)');g.addColorStop(1,'rgba(1,2,5,'+Math.min(.76,opacity)+')');ctx.fillStyle=g;ctx.fillRect(0,0,G.w,G.h);ctx.restore();
}

const endlessWheelSetup=setupFloor;
setupFloor=function(f){
 const out=endlessWheelSetup(f);
 if(G.run?.infinite&&f>50){endlessWheelPrepareFloor(true);if((f-51)%5===0)endlessWheelOffer(f);}
 return out;
};
const endlessWheelEnter=enterInfinite;
enterInfinite=function(){const out=endlessWheelEnter();if(G.run?.infinite){endlessWheelPrepareFloor(true);endlessWheelOffer(51);}return out;};
const endlessWheelResume=resumeRun;
resumeRun=function(){const out=endlessWheelResume();if(endlessWheelActive()){endlessWheelPrepareFloor(false);const w=endlessWheelData();if(w.pending)endlessWheelOffer(w.pending.floor);}return out;};
const endlessWheelSpawn=spawnEnemy;
spawnEnemy=function(type,x,y,elite){const e=endlessWheelSpawn(type,x,y,elite);if(endlessWheelActive()&&e&&!e.isBoss&&!e.mechanism)endlessWheelMarkEnemy(e,G.enemies.length-1);return e;};
const endlessWheelEnemyShoot=enemyShoot;
enemyShoot=function(e,ang,spd,dmg){const start=G.ebul.length,out=endlessWheelEnemyShoot(e,ang,spd,dmg);endlessWheelRegisterShots(e,start);return out;};
const endlessWheelLateShot=lateShot;
lateShot=function(e,ang,spd,dmg,col){const start=G.ebul.length,out=endlessWheelLateShot(e,ang,spd,dmg,col);endlessWheelRegisterShots(e,start);return out;};
const endlessWheelDamageEnemy=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind){
 if(endlessWheelActive()&&e&&!e.dead){
  if(e.wheelArmor)dmg*=1-(.1+.06*e.wheelArmor);
  if(e.isBoss&&G.enemies.some(function(o){return !o.dead&&o.wheelThorn;}))dmg*=endlessBurdenRank('crownThorns')===3?.08:.48;
  const standard=G.enemies.some(function(o){return !o.dead&&o.wheelStandard&&d2(o.x,o.y,e.x,e.y)<Math.pow(150+endlessBurdenRank('blackStandard')*35,2);});if(standard)dmg*=1-.08*endlessBurdenRank('blackStandard');
  if(e.wheelFalse&&!e.wheelFalseWoke&&endlessBurdenRank('falseShapes')===3){e.wheelFalseWoke=true;const pos=safePosition(G.world,e.x+rand(-35,35),e.y+rand(-35,35),e.r);if(pos){const double=spawnEnemy(e.type,pos.x,pos.y,false);double.aggro=true;double.wheelFalseDouble=true;double.max*=.55;double.hp=double.max;double.dmg*=.7;}}
 }
 const before=e?.hp,out=endlessWheelDamageEnemy(e,dmg,ang,crit,kb,kind);
 if(endlessWheelActive()&&!endlessWheelDamageLink&&e&&!e.dead&&before>e.hp&&e.wheelLink){const mate=G.enemies.find(function(o){return o.uid===e.wheelLink&&!o.dead;});if(mate){endlessWheelDamageLink=true;endlessWheelDamageEnemy(mate,(before-e.hp)*(.12+.08*endlessBurdenRank('sharedBreath')),ang,false,0,'shared');endlessWheelDamageLink=false;}}
 return out;
};
const endlessWheelKill=killEnemy;
killEnemy=function(e){const alive=e&&!e.dead,out=endlessWheelKill(e);if(alive&&e.dead)endlessWheelAfterDeath(e);return out;};
const endlessWheelHurt=hurtPlayer;
hurtPlayer=function(dmg,sx,sy){const before=G.player?.hp,out=endlessWheelHurt(dmg,sx,sy);if(endlessWheelActive()&&before>G.player?.hp&&endlessBurdenRank('bloodScent')===3&&G.player.hp<G.player.maxHp*.34&&!endlessWheelRuntime().bloodHunter){endlessWheelRuntime().bloodHunter=true;endlessWheelQueue(.8,'hunter',{count:1});}return out;};
const endlessWheelHeal=cardHeal;
cardHeal=function(amount,label){const before=G.player?.hp,out=endlessWheelHeal(amount,label);if(G.player&&G.player.hp>before)endlessWheelOnHeal(G.player.hp-before);return out;};
const endlessWheelFlame=useRestingFlame;
useRestingFlame=function(o){
 const rank=endlessWheelActive()?endlessBurdenRank('hollowFlames'):0;
 if(!rank||o.lit){return endlessWheelFlame(o);}
 const chosen=rank>1||endlessWheelHash('flame|'+G.floor+'|'+Math.round(o.x)+'|'+Math.round(o.y))%2===0;if(!chosen)return endlessWheelFlame(o);
 const living=G.enemies.some(function(e){return !e.dead&&e.wheelFlameKeeper;});
 if(o.wheelTrial==='pending'&&living){fieldNote('The Hollow Flame is still guarded.',1.8);return;}
 if(o.wheelTrial==='pending'&&!living){o.wheelTrial='cleared';return endlessWheelFlame(o);}
 o.wheelTrial='pending';const roster=LATE_ROSTERS?.[lateRegion(G.floor).key]||[];for(let i=0;i<rank+1;i++){const a=i*TAU/(rank+1),type=roster[(i+2)%roster.length],pos=type&&safePosition(G.world,o.x+Math.cos(a)*75,o.y+Math.sin(a)*75,ETYPES[type]?.r||12);if(pos){const e=spawnEnemy(type,pos.x,pos.y,true);e.aggro=true;e.wheelFlameKeeper=true;}}fieldNote('The flame asks for proof.',2);sfx('charge');saveNow();
};
const endlessWheelPicks=updatePicks;
updatePicks=function(dt){
 if(endlessWheelActive()){const rank=endlessBurdenRank('witheringHarvest'),ttl=Math.max(7,17-rank*3);for(let i=G.picks.length-1;i>=0;i--){const o=G.picks[i];o.wheelAge=(o.wheelAge||0)+dt;if(rank&&o.wheelAge>ttl){const enemy=G.enemies.filter(function(e){return !e.dead&&!e.isBoss;}).sort(function(a,b){return d2(a.x,a.y,o.x,o.y)-d2(b.x,b.y,o.x,o.y);})[0];if(enemy&&d2(enemy.x,enemy.y,o.x,o.y)<260*260){enemy.hp=Math.min(enemy.max,enemy.hp+enemy.max*.04*rank);enemy.dmg*=1+.008*rank;}G.picks.splice(i,1);}}}
 return endlessWheelPicks(dt);
};
const endlessWheelLateAI=lateEnemyAI;
lateEnemyAI=function(e,dt,d,dx,dy){const rank=endlessWheelActive()?endlessBurdenRank('brokenRhythm'):0,phase=rank?Math.sin(G.tAll*(1.15+rank*.12))>0:0;let factor=rank?(phase?1+.09*rank:Math.max(.72,1-.08*rank)):1;if(endlessWheelActive()){const crown=G.enemies.some(function(o){return !o.dead&&o.wheelCrown&&d2(o.x,o.y,e.x,e.y)<190*190;}),standard=G.enemies.some(function(o){return !o.dead&&o.wheelStandard&&d2(o.x,o.y,e.x,e.y)<Math.pow(150+endlessBurdenRank('blackStandard')*35,2);});if(crown)factor*=1+.04*endlessBurdenRank('crownedBlood');if(standard)factor*=1+.035*endlessBurdenRank('blackStandard');}return endlessWheelLateAI(e,dt*factor,d,dx,dy);};
const endlessWheelBeforeUpdate=hollowBeforeUpdate;
hollowBeforeUpdate=function(dt){const stopped=endlessWheelBeforeUpdate(dt);if(!stopped)endlessWheelTick(dt);return stopped;};
const endlessWheelDrawEnemiesBase=drawEnemies;
drawEnemies=function(ctx){if(endlessWheelActive())endlessWheelDrawLinks(ctx);endlessWheelDrawEnemiesBase(ctx);if(endlessWheelActive())endlessWheelDrawMarks(ctx);};
const endlessWheelCombatFX=drawCombatFX;
drawCombatFX=function(ctx){endlessWheelCombatFX(ctx);endlessWheelDrawHazards(ctx);};
const endlessWheelRenderBase=render;
render=function(){endlessWheelRenderBase();endlessWheelScreen(G.ctx);};
const endlessWheelHUD=updateHUD;
updateHUD=function(dt){const out=endlessWheelHUD(dt);if(endlessWheelActive()){const w=endlessWheelData(),latest=w.spins[w.spins.length-1],last=latest&&(ENDLESS_BURDEN_BY_ID[latest.ids[0]]||ENDLESS_CALAMITY_BY_ID[latest.ids[0]]);setTxt('floorObjective','ENDLESS '+(G.floor-50)+' · WEIGHT '+endlessBurdenWeight()+(last?' · '+last.name:''));}endlessWheelRefreshUI();return out;};
const endlessWheelBack=backToMenu;
backToMenu=function(){cancelAnimationFrame(endlessWheelAnimation);hide('endlessWheel');hide('burdenLedger');T('endlessWeightButton')?.classList.remove('visible');return endlessWheelBack();};
const endlessWheelBlocking=anyBlockingOverlay;
anyBlockingOverlay=function(){return T('endlessWheel')?.classList.contains('open')||T('burdenLedger')?.classList.contains('open')||endlessWheelBlocking();};
const endlessWheelEscape=onEscKey;
onEscKey=function(){if(T('burdenLedger')?.classList.contains('open')){endlessWheelCloseLedger();return;}if(T('endlessWheel')?.classList.contains('open'))return;return endlessWheelEscape();};
const endlessWheelValidateSave=validateSave;
validateSave=function(raw){const clean=endlessWheelValidateSave(raw);return clean;};
const endlessWheelValidateCheckpoint=validateCheckpoint;
validateCheckpoint=function(r){
 endlessWheelValidateCheckpoint(r);
 const w=r.run?.endlessWheel,fail=function(){throw Error('Invalid Endless wheel data');};
 if(w!==undefined){
  if(!w||typeof w!=='object'||w.version!==1||typeof w.seed!=='string'||w.seed.length>64||!Number.isInteger(w.spinCount)||w.spinCount<0||w.spinCount>20000||!Array.isArray(w.spins)||w.spins.length>256)fail();
  for(const id of Object.keys(w.burdens||{}))if(!ENDLESS_BURDEN_BY_ID[id]||!Number.isInteger(w.burdens[id])||w.burdens[id]<1||w.burdens[id]>3)fail();
  for(const id of Object.keys(w.calamities||{}))if(!ENDLESS_CALAMITY_BY_ID[id]||w.calamities[id]!==true)fail();
  if(w.pending){if(!Number.isInteger(w.pending.floor)||!Array.isArray(w.pending.lineup)||w.pending.lineup.length!==12||!Number.isInteger(w.pending.outcome)||w.pending.outcome<0||w.pending.outcome>=12||!['waiting','spinning','result'].includes(w.pending.status))fail();for(const id of w.pending.lineup)if(!ENDLESS_BURDEN_BY_ID[id]&&!ENDLESS_CALAMITY_BY_ID[id])fail();}
  if(w.runtime&&(!Number.isInteger(w.runtime.floor)||!Array.isArray(w.runtime.events)||w.runtime.events.length>96||!Array.isArray(w.runtime.hazards)||w.runtime.hazards.length>72))fail();
 }
 return r;
};
window.addEventListener('keydown',function(event){if(!T('endlessWheel')?.classList.contains('open')||event.repeat)return;if(event.code==='Enter'||event.code==='Space'){event.preventDefault();endlessWheelAction();}});
