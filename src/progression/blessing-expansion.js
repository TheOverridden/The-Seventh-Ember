const BLESSING_EXPANSION_VERSION=1;
const EXPANDED_CARD_ROWS=[
 ['lastCoal',0,3,7,3,'circle-dot','Heavy Ember','Every fifth Bolt hit explodes for 80% damage per rank'],
 ['warmStart',0,3,7,5,'zap','Steady Heat','Cast Bolts 8% faster per rank'],
 ['openHand',0,3,7,7,'hand','Open Hand','Flare hits restore part of Dash recovery'],
 ['heavyArc',0,3,7,9,'waves','Heavy Arc','Flare inflicts stronger knockback and briefly disrupts ordinary enemies'],
 ['followThrough',0,3,7,11,'flame','Searing Arc','Flare ignites enemies for 3s. Ranks strengthen and extend the burn'],
 ['counterstep',0,3,7,13,'waves','Wide Flare','Flare gains 12% damage and 12 reach per rank'],
 ['emberRhythm',0,3,7,15,'repeat-2','Ember Rhythm','Alternating Bolt and Flare builds a short damage bonus'],
 ['ashenPace',0,3,7,17,'footprints','Ashen Pace','Continuous movement gradually increases movement speed'],
 ['backdraft',0,3,7,19,'wind','Backdraft','Dash damages burning enemies and refreshes their fire'],
 ['pilgrimHeat',0,3,7,21,'shield','Pilgrim’s Heat','Entering an uncleared room grants a temporary ward'],
 ['quietCore',0,3,7,23,'circle','Quiet Core','After avoiding damage, the next hit deals less damage'],
 ['temperedGlow',0,3,7,25,'shield-plus','Tempered Glow','Wards become stronger and fade more slowly'],
 ['cinderSkin',0,3,7,27,'flame','Cinder Skin','Take less contact damage from enemies'],
 ['hammerSpark',0,3,7,29,'hammer','Hammer Spark','Flare deals extra damage to armor, barriers, and mechanisms'],
 ['bellTiming',0,3,7,31,'bell','Bell Timing','Every seventh Bolt shortens Flare and Dash recovery'],
 ['hearthTax',0,3,7,33,'gem','Hearth Tax','Hearts collected at full health become Essence'],
 ['lowLantern',0,3,7,35,'lamp','Low Lantern','At low health, Hearts and Essence fly toward the Ember from farther away'],
 ['warmTrail',0,3,7,37,'sparkles','Warm Trail','Collecting Essence briefly increases movement speed'],
 ['ashMemory',0,3,7,39,'brain','Ash Memory','The first enemy kind defeated each floor takes more damage afterward'],
 ['hollowStep',0,3,7,41,'feather','Hollow Step','Dashing through a hostile shot shortens Dash recovery'],

 ['quickdraw',1,3,5,9,'snowflake','Frostbite','Deal 20% more damage per rank to frozen or chilled enemies'],
 ['emberRelay',1,3,5,11,'refresh-ccw','Ember Relay','The first enemy struck by Flare restores an Ember charge'],
 ['cinderLadder',1,3,5,13,'trending-up','Cinder Ladder','Rapid kills build casting speed'],
 ['glassThread',1,3,5,15,'crosshair','Glass Thread','Repeated Bolts against one target gain damage and piercing power'],
 ['turningSpark',1,3,5,17,'undo-2','Turning Spark','A Bolt that misses turns around once and searches for an enemy'],
 ['furnaceMouth',1,3,5,19,'flame-kindling','Furnace Mouth','Every third Flare erupts in a broad burning cone for 150% damage per rank'],
 ['nearMiss',1,3,5,21,'circle-dashed','Near Miss','Hostile shots passing narrowly beside the Ember charge Flare'],
 ['brushfire',1,3,5,23,'trees','Brushfire','Dashing near burning enemies spreads their fire'],
 ['severingLight',1,3,5,25,'scissors','Severing Light','Flare temporarily strips enemy armor and resistance'],
 ['crackedBell',1,3,5,27,'bell-ring','Cracked Bell','Flare delays the next attack of enemies it interrupts'],
 ['ashDividend',1,3,5,29,'heart','Ash Dividend','Elites release healing and a short damage bonus'],
 ['loopingSigil',1,3,5,31,'rotate-cw','Looping Sigil','The first wall struck bends a Bolt toward a new target'],
 ['emberLine',1,3,5,33,'minus','Ember Line','Every third aimed volley leaves a damaging thread through the room'],
 ['forkedArc',1,3,5,35,'git-branch','Forked Arc','The first enemy struck by Flare releases two side crescents'],
 ['roomTone',1,3,5,37,'snowflake','Cold Front','Defeating a frozen enemy freezes nearby creatures for 1s per rank. Guardians are chilled'],
 ['keptPromise',1,3,5,39,'badge-check','Kept Promise','Untouched room clears improve Heart and Essence drops'],
 ['siegeEmber',1,3,5,41,'target','Siege Ember','Maintaining pressure against one elite or Guardian raises damage'],
 ['wardenPalm',1,3,5,43,'shield-check','Warden’s Palm','Flare reflects the first hostile projectile it touches'],
 ['smolderstep',1,3,5,45,'bomb','Smolderstep','Dash leaves a dormant ember that explodes beneath an enemy'],
 ['kindredSparks',1,3,5,47,'merge','Kindred Sparks','Nearby friendly projectiles bend toward a shared target'],

 ['perfectRekindle',2,2,3,17,'timer','Perfect Rekindle','Press Rekindle again on the final beat to finish instantly and release a ring'],
 ['coronaStep',2,2,3,20,'orbit','Corona Step','Dash creates two rotating crescents at its destination'],
 ['ashDoppelganger',2,2,3,23,'copy','Ash Doppelganger','A spectral Ember repeats your next Bolts after Dash'],
 ['chainRooms',2,2,3,26,'link','Chain of Rooms','No-hit room clears build damage; taking a hit removes one stack'],
 ['crucible',2,2,3,29,'flame','The Crucible','Burn damage charges the size and power of the next Flare'],
 ['slingshotRune',2,2,3,32,'refresh-cw','Slingshot Rune','Ricocheting Bolts accelerate, grow, and gain damage'],
 ['lanternEater',2,2,3,35,'shield-ellipsis','Lantern Eater','Flare devours hostile shots to restore recovery and ward the Ember'],
 ['gravityWake',2,2,3,38,'move','Gravity Wake','Dash drags ordinary enemies along its path and throws them outward'],
 ['closingArgument',2,2,3,41,'badge-x','Closing Argument','Flare executes badly wounded ordinary enemies'],
 ['redThread',2,2,3,44,'share-2','Red Thread','The first target in a room shares damage with nearby creatures'],
 ['bankedConstellation',2,2,3,47,'asterisk','Banked Constellation','Every twelfth Bolt hit summons four seeking stars. Rank two adds a star and damage'],
 ['heatSink',2,2,3,50,'shield-half','Heat Sink','Damage absorbed by wards charges the next Flare'],
 ['clockworkFlame',2,2,3,53,'settings','Clockwork Flame','Using Bolt, Flare, and Dash in order empowers the completed cycle'],
 ['unbrokenStep',2,2,3,56,'chevrons-right','Unbroken Step','Dashing through danger builds damage and speed until hit'],
 ['smokeBetween',2,2,3,59,'cloud','Smoke Between','A perfectly timed Dash erases nearby shots and leaves a safe space'],
 ['shatteredCrown',2,2,3,62,'crown','Shattered Crown','Guardian mechanisms leave fragments that strengthen the fight'],
 ['emptyChamber',2,2,3,65,'pause','Still Pulse','Every sixth Bolt hit suspends hostile shots for 0.6s. Rank two adds 0.15s. Recharges in 3s'],
 ['wildfirePact',2,2,3,68,'flame-kindling','Wildfire Pact','Burning enemies take more damage for each nearby burning creature'],
 ['crossroads',2,2,3,71,'split','Crossroads','Every fifth cast splits into three paths. Ranks strengthen the side Bolts'],
 ['duelistEmber',2,2,3,74,'swords','Duelist’s Ember','Against one remaining enemy, Flare grows stronger and restores Dash'],

 ['seventhHand',3,1,1,24,'hand','The Seventh Hand','A spectral Ember follows behind and repeats every Bolt and Flare'],
 ['solarRequiem',3,1,1,28,'sun','Solar Requiem','Every eighth cast summons seven seeking, piercing solar lances for 235% damage each'],
 ['ashenHour',3,1,1,32,'hourglass','The Ashen Hour','Once per room, low health freezes danger, restores health, and resets Flare'],
 ['hearthWorld',3,1,1,36,'heart-handshake','Hearth of the World','Excess healing permanently becomes maximum health and orbiting hearths'],
 ['longDawn',3,1,1,40,'sunrise','The Long Dawn','A recurring sunrise crosses the room, destroys enemies, and restores health'],
 ['crownlessKing',3,1,1,44,'crown','The Crownless King','The first elite defeated each floor surrenders one of its traits'],
 ['unmakingFlame',3,1,1,48,'eraser','Unmaking Flame','Flare erases wounded enemies and tears health from Guardians'],
 ['phoenixLaw',3,1,1,52,'flame-kindling','Phoenix Law','Once every five floors, lethal damage restores the Ember and burns the room'],
 ['sevenSuns',3,1,1,56,'sun-medium','Seven Suns','Every seventh Flare summons seven orbiting beam-firing suns'],
 ['doorStars',3,1,1,60,'between-horizontal-start','Door Between Stars','Dash leaves linked portals that strengthen friendly projectiles'],
 ['livingConstellation',3,1,1,64,'sparkles','Living Constellation','Defeated enemies become following stars that cast their own Bolts'],
 ['blackBell',3,1,1,68,'bell','The Black Bell','Every twenty-five kills tolls catastrophic damage through the room'],
 ['furnaceEnd',3,1,1,70,'infinity','Furnace Without End','Every twentieth Bolt hit grants 7s of free, faster casting. Recharges in 18s'],
 ['firstSparkReturned',3,1,1,72,'sun','The First Spark Returned','Every eighth cast becomes a colossal, piercing Bolt for 500% damage'],
 ['goldenThread',3,1,1,74,'network','The Golden Thread','Critical hits bind enemies so damage echoes through the entire group'],
 ['onlyEmber',3,1,1,76,'flame','The Only Ember Left','Fighting a lone Guardian grants power, speed, and free Flares after dodges'],
 ['archiveFire',3,1,1,77,'library','Archive Fire','Each floor lends a fully ranked blessing you do not own'],
 ['starlessCrown',3,1,1,78,'orbit','The Starless Crown','Near-missed hostile shots orbit the Ember before returning to enemies'],
 ['seventhWish',3,1,1,79,'layout-grid','The Seventh Wish','Every seventh level offers seven blessings and allows two choices'],
 ['finalMatch',3,1,1,80,'sparkle','The Final Match','Guardian final phases grant infinite charges and overwhelming power'],

 ['brightNeedle',0,3,6,8,'needle','Bright Needle','Starstitch pins appear more frequently'],
 ['longThread',0,3,6,11,'move-horizontal','Long Thread','Starstitch strands connect across greater distances'],
 ['heldPattern',0,3,6,14,'clock-3','Held Pattern','Starstitch pins and strands remain longer'],
 ['hotWire',0,3,6,17,'zap','Hot Wire','Starstitch strands deal more contact damage'],
 ['runningStitch',1,2,4,20,'chevrons-right','Running Stitch','Dashing through a strand sends a pulse through the pattern'],
 ['cinderThread',1,2,4,23,'flame','Cinder Thread','Fire travels between enemies joined by Starstitch'],
 ['knottedLight',1,2,4,26,'focus','Knotted Light','Enemies near Starstitch pins are slowed and scorched'],
 ['wallscript',1,2,4,29,'panel-top','Wallscript','Bolts that meet walls can leave Starstitch pins'],
 ['constellationCage',2,2,3,34,'triangle','Constellation Cage','Completing a triangle burns everything enclosed'],
 ['drawnTight',2,2,3,40,'minimize-2','Drawn Tight','Flare pulls enemies inward before collapsing Starstitch'],
 ['counterweave',2,2,3,46,'shield-ban','Counterweave','Hostile shots crossing Starstitch strands slow and break'],
 ['unfinishedPattern',2,2,3,52,'circle-dashed','Unfinished Pattern','Pins remain suspended when their marked enemy dies'],
 ['seventhConstellation',3,1,1,60,'star','The Seventh Constellation','Seven pins form a living glyph that fires and collapses into starfall']
];
const EXPANDED_BLESSINGS=EXPANDED_CARD_ROWS.map(([id,r,max,w,minFloor,icon,name,ds])=>({id,r,max,w,minFloor,icon,name,ds,expansion:BLESSING_EXPANSION_VERSION}));
for(const card of EXPANDED_BLESSINGS)if(!POOL.some(o=>o.id===card.id))POOL.push(card);

const STARSTITCH_IDS=['brightNeedle','longThread','heldPattern','hotWire','runningStitch','cinderThread','knottedLight','wallscript','constellationCage','drawnTight','counterweave','unfinishedPattern','seventhConstellation'];
const EXPANDED_EFFECT_GROUPS={
 fire:['emberRhythm','turningSpark','bellTiming','loopingSigil','emberLine','kindredSparks','ashDoppelganger','crossroads','slingshotRune','seventhHand','firstSparkReturned','solarRequiem'],
 hits:['lastCoal','bankedConstellation','emptyChamber','furnaceEnd'],
 stats:['warmStart','counterstep','quickdraw'],
 flare:['openHand','heavyArc','followThrough','furnaceMouth','emberRhythm','emberRelay','severingLight','crackedBell','forkedArc','wardenPalm','crucible','lanternEater','closingArgument','heatSink','duelistEmber','seventhHand','unmakingFlame','sevenSuns'],
 dash:['backdraft','hollowStep','brushfire','smolderstep','coronaStep','gravityWake','clockworkFlame','unbrokenStep','smokeBetween','doorStars','onlyEmber'],
 room:['pilgrimHeat','keptPromise','chainRooms','ashenHour','archiveFire'],
 frost:['roomTone'],
 defense:['quietCore','temperedGlow','cinderSkin','lowLantern','nearMiss','emptyChamber','phoenixLaw','starlessCrown'],
 rewards:['hearthTax','warmTrail','ashMemory','cinderLadder','ashDividend','hearthWorld','crownlessKing','livingConstellation','blackBell','seventhWish'],
 damage:['hammerSpark','glassThread','siegeEmber','redThread','wildfirePact','shatteredCrown','goldenThread','onlyEmber','finalMatch'],
 reload:['perfectRekindle'],
 motion:['ashenPace','warmTrail','unbrokenStep'],
 fields:['turningSpark','loopingSigil','emberLine','smolderstep','coronaStep','ashDoppelganger','bankedConstellation','doorStars','livingConstellation','longDawn'],
 stitch:STARSTITCH_IDS
};
const EXPANDED_EFFECT_IDS=new Set(Object.values(EXPANDED_EFFECT_GROUPS).flat());
function blessingRank(id){return G.run?.up?.[id]||0;}
function expansionState(){
 if(!G.run)return null;
 const s=G.run.blessingExpansion&&typeof G.run.blessingExpansion==='object'?G.run.blessingExpansion:G.run.blessingExpansion={};
 if(!Array.isArray(s.pins))s.pins=[];
 if(!Array.isArray(s.mines))s.mines=[];
 if(!Array.isArray(s.echoShots))s.echoShots=[];
 if(!Array.isArray(s.echoFlares))s.echoFlares=[];
 if(!Array.isArray(s.lines))s.lines=[];
 if(!Array.isArray(s.bankStars))s.bankStars=[];
 if(!Array.isArray(s.livingStars))s.livingStars=[];
 if(!Array.isArray(s.suns))s.suns=[];
 if(!Array.isArray(s.returnShots))s.returnShots=[];
 if(!Array.isArray(s.wishLevels))s.wishLevels=[];
 if(!Array.isArray(s.wishTakenIds))s.wishTakenIds=[];
 if(!Array.isArray(s.hearthBlocks))s.hearthBlocks=[];
 if(!s.visitedRooms||typeof s.visitedRooms!=='object')s.visitedRooms={};
 return s;
}
function expansionLiving(){return (G.enemies||[]).filter(e=>!e.dead);}
function expansionNearest(x,y,filter=()=>true){let found=null,best=Infinity;for(const e of expansionLiving()){if(!filter(e))continue;const d=d2(x,y,e.x,e.y);if(d<best){best=d;found=e;}}return found;}
function expansionRoomIndex(x=G.player?.x,y=G.player?.y){return G.world?.rooms?.findIndex(r=>x>=r.x*TILE&&x<=(r.x+r.w)*TILE&&y>=r.y*TILE&&y<=(r.y+r.h)*TILE)??-1;}
function expansionRoomEnemies(index=expansionRoomIndex()){const r=G.world?.rooms?.[index];return !r?[]:expansionLiving().filter(e=>e.x>=r.x*TILE&&e.x<=(r.x+r.w)*TILE&&e.y>=r.y*TILE&&e.y<=(r.y+r.h)*TILE);}
function expansionHeal(amount,label){if(!G.player||amount<=0)return 0;const before=G.player.hp;cardHeal(amount,label);return G.player.hp-before;}
function expansionFriendlyShot(x,y,a,dmg,options={}){const speed=options.speed||BASE.bulletSpd;G.bullets.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:options.r||6,dmg,pierce:options.pierce||0,ric:options.ric||0,life:options.life||1.2,hits:null,seeking:options.seeking||0,late:true,whiteStar:false,expansion:true,...options});}
function expansionAction(action){
 const s=expansionState(),rank=blessingRank('clockworkFlame');if(!s||!rank)return;
 const order=['bolt','flare','dash'],expected=order[s.clockStep||0];
 if(action===expected)s.clockStep=(s.clockStep||0)+1;else s.clockStep=action==='bolt'?1:0;
 if(s.clockStep>=3){s.clockStep=0;s.clockBuff=4+rank;nova(G.player.x,G.player.y,95+25*rank,G.player.dmg*(1.1+.45*rank));addText(G.player.x,G.player.y-27,'CLOCKWORK','#ffd78f',12);}
}
function expansionSegmentDistance(px,py,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,len=dx*dx+dy*dy;if(!len)return Math.hypot(px-ax,py-ay);const t=clamp(((px-ax)*dx+(py-ay)*dy)/len,0,1);return Math.hypot(px-(ax+dx*t),py-(ay+dy*t));}
function starstitchActive(){return STARSTITCH_IDS.some(id=>blessingRank(id)>0);}
function starstitchPinLimit(){return blessingRank('seventhConstellation')?7:3;}
function starstitchPin(x,y,target=null){
 const s=expansionState();if(!s||!starstitchActive())return;
 if(target){const existing=s.pins.find(p=>p.uid===target.uid);if(existing){existing.life=8+3*blessingRank('heldPattern');return;}}
 s.pins.push({x,y,uid:target?.uid||0,life:8+3*blessingRank('heldPattern'),wall:!target});
 while(s.pins.length>starstitchPinLimit())s.pins.shift();
 burst(x,y,8,'#9ef5ff',90,.36,2,true);sfx('stitchPin');
}
function starstitchLines(){
 const s=expansionState();if(!s||s.pins.length<2)return[];const max=260+70*blessingRank('longThread'),lines=[];
 for(let i=1;i<s.pins.length;i++){const a=s.pins[i-1],b=s.pins[i];if(d2(a.x,a.y,b.x,b.y)<=max*max)lines.push([a,b]);}
 if(s.pins.length>=3){const a=s.pins[s.pins.length-1],b=s.pins[0];if(d2(a.x,a.y,b.x,b.y)<=max*max)lines.push([a,b]);}
 if(blessingRank('seventhConstellation')&&s.pins.length===7)for(let i=0;i<7;i++){const a=s.pins[i],b=s.pins[(i+3)%7];if(d2(a.x,a.y,b.x,b.y)<=max*max*1.8)lines.push([a,b]);}
 return lines;
}
function starstitchCollapse(){
 const s=expansionState();if(!s||s.pins.length<3)return false;const pins=s.pins.slice(),cx=pins.reduce((n,p)=>n+p.x,0)/pins.length,cy=pins.reduce((n,p)=>n+p.y,0)/pins.length,drawn=blessingRank('drawnTight');
 if(drawn)for(const e of expansionLiving()){const d=Math.max(1,Math.hypot(cx-e.x,cy-e.y));if(d<330){const force=e.isBoss?45:130+70*drawn;e.kbx+=(cx-e.x)/d*force;e.kby+=(cy-e.y)/d*force;}}
 for(const [a,b]of starstitchLines())for(const e of expansionLiving())if(expansionSegmentDistance(e.x,e.y,a.x,a.y,b.x,b.y)<e.r+18)damageEnemy(e,G.player.dmg*(.7+.28*blessingRank('hotWire')+.3*drawn),Math.atan2(e.y-cy,e.x-cx),false,.45,'starstitchCollapse');
 if(blessingRank('seventhConstellation')&&pins.length===7){for(const p of pins){const target=expansionNearest(p.x,p.y);if(target)expansionFriendlyShot(p.x,p.y,Math.atan2(target.y-p.y,target.x-p.x),G.player.dmg*2.8,{r:10,pierce:3,seeking:.18,life:1.8,stitchStar:true});}nova(cx,cy,230,G.player.dmg*5.5);sfx('mythic');}
 else nova(cx,cy,105+pins.length*16,G.player.dmg*(.8+pins.length*.32));
 s.pins=[];return true;
}
function expansionPointInTriangle(px,py,a,b,c){const sign=(p1x,p1y,p2x,p2y,p3x,p3y)=>(p1x-p3x)*(p2y-p3y)-(p2x-p3x)*(p1y-p3y),area=sign(a.x,a.y,b.x,b.y,c.x,c.y),max=260+70*blessingRank('longThread'),d1=sign(px,py,a.x,a.y,b.x,b.y),d2v=sign(px,py,b.x,b.y,c.x,c.y),d3=sign(px,py,c.x,c.y,a.x,a.y),neg=d1<0||d2v<0||d3<0,pos=d1>0||d2v>0||d3>0;return Math.abs(area)>=16&&d2(a.x,a.y,b.x,b.y)<=max*max&&d2(b.x,b.y,c.x,c.y)<=max*max&&d2(c.x,c.y,a.x,a.y)<=max*max&&!(neg&&pos);}

function expansionRhythm(action){
 const rank=blessingRank('emberRhythm'),s=expansionState();if(!rank||!s)return;
 if(s.rhythmLast&&s.rhythmLast!==action)s.rhythmCount=(s.rhythmCount||0)+1;else if(s.rhythmLast===action)s.rhythmCount=0;
 s.rhythmLast=action;
 if(s.rhythmCount>=3){s.rhythmCount=0;s.rhythmBuff=3.5+rank;addText(G.player.x,G.player.y-25,'RHYTHM','#ffc879',11);}
}
function expansionRenderCard(card,index){
 const rank=G.run.up[card.id]||0,el=document.createElement('button');el.className='card'+(card.r===3?' mythic-reveal':'');el.dataset.r=card.r;el.type='button';
 const pips=card.max<=8?'<div class="pips">'+Array.from({length:card.max},(_,i)=>'<em class="'+(i<rank?'on':'')+'"></em>').join('')+'</div>':'';
 el.innerHTML='<span class="key">'+(index+1)+'</span><div class="rar">'+RARITY[card.r].n+'</div><div class="ic"><i data-lucide="'+card.icon+'"></i></div><div class="nm cinzel">'+card.name+'</div><div class="ds">'+card.ds+'</div>'+pips+'<div class="card-rank">'+(rank?'RANK '+(rank+1):'NEW BLESSING')+'</div>';
 el._up=card;on(el,'click',()=>chooseCard(index));return el;
}

const expansionBuildCards=buildCards;
buildCards=function(){
 const restoring=Array.isArray(G.restoreCardIds)&&G.restoreCardIds.length>0;expansionBuildCards();
 const s=expansionState(),wish=blessingRank('seventhWish')&&!G.opts.freeChoice&&G.run.level%7===0&&!s.wishLevels.includes(G.run.level);
 T('luWrap').classList.toggle('seventh-wish-draft',wish);
 if(!wish)return;
 if(!restoring||s.wishLevel!==G.run.level||!s.wishRemaining){s.wishRemaining=2;s.wishLevel=G.run.level;s.wishTakenIds=[];}
 let pool=POOL.filter(o=>(G.run.up[o.id]||0)<o.max&&(!o.unlock||armoryData()[o.unlock])&&G.floor>=(o.minFloor||1)&&!G.cardPool.includes(o)&&(!G.cardPool.some(c=>c.r===3)||o.r!==3));
 while(G.cardPool.length<7&&pool.length){let rarity=rollRarity(pool);if(G.cardPool.some(o=>o.r===3)&&rarity===3)rarity=2;let tier=pool.filter(o=>o.r===rarity);if(!tier.length)tier=pool;let total=tier.reduce((n,o)=>n+o.w,0),roll=Math.random()*total,selected=tier[0];for(const o of tier){roll-=o.w;if(roll<=0){selected=o;break;}}G.cardPool.push(selected);pool=pool.filter(o=>o!==selected&&(selected.r!==3||o.r!==3));}
 const wrap=T('cards');for(let i=wrap.children.length;i<G.cardPool.length;i++)wrap.appendChild(expansionRenderCard(G.cardPool[i],i));
 for(let i=0;i<G.cardPool.length;i++)if(s.wishTakenIds.includes(G.cardPool[i].id)){const el=wrap.children[i];el.disabled=true;el.classList.add('wish-taken');el.querySelector('.card-rank').textContent='TAKEN';}
 const available=G.cardPool.filter(o=>!s.wishTakenIds.includes(o.id)&&(o.consumable||(G.run.up[o.id]||0)<o.max)).length;s.wishRemaining=Math.min(s.wishRemaining,available||1);T('luSub').textContent=s.wishRemaining>1?'THE SEVENTH WISH · CHOOSE TWO':'THE SEVENTH WISH · CHOOSE ONE MORE';refreshIcons();
};

const expansionChooseCard=chooseCard;
chooseCard=function(i){
 const s=expansionState(),card=G.state==='levelup'&&G.cardPool?.[i];if(!card)return expansionChooseCard(i);
 if(s.wishRemaining&&(s.wishTakenIds.includes(card.id)||(!card.consumable&&(G.run.up[card.id]||0)>=card.max)))return;
 if(s.wishRemaining>1){s.wishTakenIds.push(card.id);if(card.consumable)cardHeal(G.player.maxHp*.15);else G.run.up[card.id]=(G.run.up[card.id]||0)+1;if(card.id==='hp')G.player.hp+=25;recalc();addChip(card);sfx('buy');if(card.r===3){G.run.mythicsFound=(G.run.mythicsFound||0)+1;toast('MYTHIC · '+card.name,'the dark gave up something rare');sfx('mythicClaim');}s.wishRemaining=1;const el=T('cards').children[i];if(el){el.disabled=true;el.classList.add('wish-taken');el.querySelector('.card-rank').textContent='TAKEN';}T('luSub').textContent='THE SEVENTH WISH · CHOOSE ONE MORE';if(typeof checkEvolutions==='function')checkEvolutions(true);saveNow();return;}
 if(s.wishRemaining===1){s.wishRemaining=0;s.wishTakenIds=[];if(!s.wishLevels.includes(s.wishLevel))s.wishLevels.push(s.wishLevel);T('luWrap').classList.remove('seventh-wish-draft');}
 return expansionChooseCard(i);
};

const expansionRecalc=recalc;
recalc=function(){
 expansionRecalc();if(!G.player||!G.run)return;const p=G.player,s=expansionState();
 p.maxHp+=Math.floor(s.hearthWorldHp||0);p.hp=Math.min(p.hp,p.maxHp);
 if(s.crownlessPower){p.dmg*=1+(s.crownlessPower.dmg||0);p.speed*=1+(s.crownlessPower.speed||0);p.critC+=s.crownlessPower.crit||0;p.shotInt*=1-(s.crownlessPower.rate||0);}
 p.expansionBaseMagnet=p.magnet;
};

function expansionRestoreBorrowed(){
 const s=expansionState();if(!s?.archiveBorrowed)return;const b=s.archiveBorrowed;if(b.previous>0)G.run.up[b.id]=b.previous;else delete G.run.up[b.id];s.archiveBorrowed=null;
}
function expansionBorrowBlessing(){
 if(!blessingRank('archiveFire'))return;const s=expansionState(),pool=POOL.filter(o=>o.max>0&&o.r<3&&G.floor>=(o.minFloor||1)&&!(G.run.up[o.id]||0)&&(!o.unlock||armoryData()[o.unlock])&&o.id!=='archiveFire');if(!pool.length)return;const card=pool[Math.abs((G.run.seedHash||G.floor*7919)+G.floor*37)%pool.length],previous=G.run.up[card.id]||0;G.run.up[card.id]=card.max;s.archiveBorrowed={id:card.id,previous};toast('ARCHIVE FIRE',card.name+' · borrowed for this floor');
}
const expansionSetupFloor=setupFloor;
setupFloor=function(f){
 if(G.run)expansionRestoreBorrowed();const out=expansionSetupFloor(f);if(!G.run)return out;const s=expansionState();
 s.floor=f;s.roomIndex=-1;s.roomAge=0;s.roomHit=false;s.roomCombat=false;s.visitedRooms={};s.ashMemoryType='';s.crownlessPower=null;s.crownTaken=false;s.phoenixReady=f>=(s.phoenixLastFloor||-9)+5;s.pins=[];s.mines=[];s.lines=[];s.echoShots=[];s.echoFlares=[];s.bankStars=[];s.suns=[];s.returnShots=[];s.portal=null;s.portalStart=null;s.wasDashing=false;s.freezeT=0;s.emptyChamberT=0;s.shatteredFragments=0;s.guardianFinalUid=0;
 expansionBorrowBlessing();recalc();return out;
};

const expansionStartRun=startRun;
startRun=function(){const out=expansionStartRun();if(G.run){G.run.blessingExpansion={};expansionState();recalc();}return out;};
const expansionResumeRun=resumeRun;
resumeRun=function(){const out=expansionResumeRun();if(G.run){expansionState();recalc();}return out;};

function recordPerfectRekindle(){const s=expansionState();s.perfectReloads=(s.perfectReloads||0)+1;}
const expansionBeginReload=beginReload;
beginReload=function(){
 const p=G.player,rank=blessingRank('perfectRekindle');if(p&&p.reloadT>0&&rank){const progress=1-p.reloadT/Math.max(.01,p.reloadDuration),window=.16+.07*rank;if(progress>=1-window){p.reloadT=0;p.ammo=p.magSize;p.shotT=0;recordPerfectRekindle();nova(p.x,p.y,110+25*rank,p.dmg*(1.2+.8*rank));burst(p.x,p.y,22,'#fff1b1',210,.55,3,true);addText(p.x,p.y-26,'PERFECT','#fff0ad',13);sfx('mythic');return true;}return false;}return expansionBeginReload();
};

const expansionFireVolley=fireVolley;
fireVolley=function(){
 const p=G.player;if(!p||!G.run)return expansionFireVolley();const s=expansionState(),start=G.bullets.length,beforeAngle=aimAngle();expansionFireVolley();const created=G.bullets.slice(start);if(!created.length)return;
 expansionAction('bolt');expansionRhythm('bolt');s.totalCasts=(s.totalCasts||0)+1;
 for(const b of created){if(blessingRank('glassThread')&&(s.glassHits||0)>=3)b.pierce=(b.pierce||0)+blessingRank('glassThread');if(blessingRank('turningSpark'))b.turningSpark=blessingRank('turningSpark');}
 if(blessingRank('bellTiming')&&s.totalCasts%7===0){p.meleeCdT=Math.max(0,p.meleeCdT-.32*blessingRank('bellTiming'));p.dashCdT=Math.max(0,p.dashCdT-.28*blessingRank('bellTiming'));}
 if(blessingRank('crossroads')&&s.totalCasts%5===0){for(const src of created.slice(0,2))for(const turn of [-.48,.48]){const speed=Math.hypot(src.vx,src.vy),a=beforeAngle+turn;G.bullets.push({...src,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,dmg:src.dmg*(.52+.14*blessingRank('crossroads')),hits:null,whiteStar:false});}}
 if(blessingRank('emberLine')&&s.totalCasts%3===0)s.lines.push({x1:p.x,y1:p.y,x2:p.x+Math.cos(beforeAngle)*(330+55*blessingRank('emberLine')),y2:p.y+Math.sin(beforeAngle)*(330+55*blessingRank('emberLine')),t:2.4+.8*blessingRank('emberLine'),tick:0});
 if(s.doppelReady>0&&blessingRank('ashDoppelganger')){const count=Math.min(created.length,2);for(const b of created.slice(0,count))s.echoShots.push({delay:.28,x:s.doppelX,y:s.doppelY,b:{...b,hits:null,dmg:b.dmg*(.45+.18*blessingRank('ashDoppelganger')),whiteStar:false}});s.doppelReady--;}
 if(blessingRank('seventhHand'))for(const b of created.slice(0,3))s.echoShots.push({delay:.34,x:s.handX??p.x,y:s.handY??p.y,b:{...b,hits:null,dmg:b.dmg*.55,whiteStar:false}});
 if((s.furnaceT||0)>0){p.ammo=Math.min(p.magSize,p.ammo+1);p.reloadT=0;p.shotT*=.7;}
};

function expansionFlareTargets(){
 const p=G.player;if(!p)return[];return expansionLiving().filter(e=>d2(p.x,p.y,e.x,e.y)<=(MELEE.reach+e.r+18)**2&&(MELEE.halfArc>=Math.PI-0.05||Math.abs(angleDiff(Math.atan2(e.y-p.y,e.x-p.x),p.meleeAngle))<=MELEE.halfArc)&&los(G.world,p.x,p.y,e.x,e.y));
}
function expansionReflectShot(radius,all=false){
 const p=G.player;if(!p)return 0;let count=0;G.ebul=G.ebul.filter(b=>{if(d2(b.x,b.y,p.x,p.y)>radius*radius||!all&&count)return true;const target=expansionNearest(b.x,b.y),a=target?Math.atan2(target.y-b.y,target.x-b.x):p.face;expansionFriendlyShot(b.x,b.y,a,p.dmg*(1.3+.35*blessingRank('wardenPalm')),{r:6,pierce:1,seeking:.12,life:1.4});count++;return false;});return count;
}
const expansionStrikeMelee=strikeMelee;
strikeMelee=function(){
 const p=G.player;if(!p||!G.run)return expansionStrikeMelee();const s=expansionState(),oldDamage=MELEE.damage,oldReach=MELEE.reach;let mult=1;
 if(blessingRank('crucible')&&(s.crucible||0)>0){mult*=1+Math.min(1.8,s.crucible*.035*blessingRank('crucible'));MELEE.reach+=Math.min(50,s.crucible*1.25);s.crucible=0;}
 if(blessingRank('heatSink')&&(s.heatSink||0)>0){mult*=1+Math.min(2,s.heatSink/Math.max(1,p.maxHp)*2*blessingRank('heatSink'));s.heatSink=0;}
 if(blessingRank('duelistEmber')&&expansionLiving().length===1)mult*=1+.48*blessingRank('duelistEmber');
 const targets=expansionFlareTargets();MELEE.damage*=mult;try{expansionStrikeMelee();}finally{MELEE.damage=oldDamage;MELEE.reach=oldReach;}s.lastFlare=G.t;expansionAction('flare');expansionRhythm('flare');s.flareCount=(s.flareCount||0)+1;
 const open=blessingRank('openHand');if(open&&targets.length)p.dashCdT=Math.max(0,p.dashCdT-.14*open*Math.min(4,targets.length));
 const relay=blessingRank('emberRelay');if(relay&&targets.length)p.ammo=Math.min(p.magSize,p.ammo+Math.min(relay,1+Math.floor(targets.length/4)));
 const heavy=blessingRank('heavyArc'),sever=blessingRank('severingLight'),cracked=blessingRank('crackedBell');
 for(const e of targets){if(heavy&&!e.isBoss){const a=Math.atan2(e.y-p.y,e.x-p.x);e.kbx+=Math.cos(a)*75*heavy;e.kby+=Math.sin(a)*75*heavy;e.atkT=Math.max(e.atkT||0,.1*heavy);}if(sever)e.expSeverT=Math.max(e.expSeverT||0,G.t+2+sever);if(cracked)e.atkT=Math.max(e.atkT||0,.45*cracked);}
 if(blessingRank('forkedArc')&&targets.length){for(const turn of [-.58,.58])expansionFriendlyShot(p.x,p.y,p.meleeAngle+turn,p.dmg*MELEE.damage*(.34+.12*blessingRank('forkedArc')),{r:9,pierce:3,life:.75,melee:true});}
 let eaten=0;if(blessingRank('wardenPalm'))eaten+=expansionReflectShot(MELEE.reach+45,false);if(blessingRank('lanternEater')){const before=G.ebul.length;G.ebul=G.ebul.filter(b=>d2(b.x,b.y,p.x,p.y)>(MELEE.reach+55)**2);eaten+=before-G.ebul.length;if(eaten){p.meleeCdT=Math.max(0,p.meleeCdT-.2*eaten*blessingRank('lanternEater'));p.cardWard=(p.cardWard||0)+Math.min(p.maxHp*.2,eaten*(1+blessingRank('lanternEater')));}}
 if(blessingRank('closingArgument'))for(const e of targets)if(!e.dead&&!e.isBoss&&e.hp/e.max<.15+.07*blessingRank('closingArgument'))damageEnemy(e,e.hp+1,Math.atan2(e.y-p.y,e.x-p.x),false,1,'closingArgument');
 if(blessingRank('unmakingFlame'))for(const e of targets)if(!e.dead){if(!e.isBoss&&e.hp/e.max<.35)damageEnemy(e,e.hp+1,0,false,0,'unmaking');else if(e.isBoss&&(!e.expUnmakingT||e.expUnmakingT<=G.t)){e.expUnmakingT=G.t+8;damageEnemy(e,e.max*.045,0,false,0,'unmaking');}}
 if(blessingRank('duelistEmber')&&targets.length&&expansionLiving().length===1)p.dashCdT=0;
 if(blessingRank('sevenSuns')&&s.flareCount%7===0){s.suns=Array.from({length:7},(_,i)=>({a:i*TAU/7,t:10,shot:i*.08}));sfx('mythic');}
 if(blessingRank('seventhHand'))s.echoFlares.push({delay:.38,x:s.handX??p.x,y:s.handY??p.y,a:p.meleeAngle,power:.55});
 if(starstitchActive())starstitchCollapse();
};

const expansionDamageEnemy=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
 if(!e||e.dead)return;const s=expansionState(),p=G.player,u=G.run?.up||{};let amount=dmg;
 if(s?.rhythmBuff>0)amount*=1+.12*blessingRank('emberRhythm');
 if(s?.chainStacks)amount*=1+s.chainStacks*.04*blessingRank('chainRooms');
 if(s?.unbrokenStacks)amount*=1+s.unbrokenStacks*.045*blessingRank('unbrokenStep');
 if(s?.clockBuff>0)amount*=1+.3*blessingRank('clockworkFlame');
 if(s?.ashDividendT>0)amount*=1+.18*blessingRank('ashDividend');
 if(s?.ashMemoryType&&e.type===s.ashMemoryType)amount*=1+.06*blessingRank('ashMemory');
 if(e.expSeverT>G.t)amount*=1+.12*blessingRank('severingLight');
 if((e.mechanism||e.type==='barrierKnight'||e.type==='mirrorShell')&&blessingRank('hammerSpark')&&(kind==='melee'||kind==='meleeWave'))amount*=1+.22*blessingRank('hammerSpark');
 if(kind==='shot'&&blessingRank('glassThread')){if(s.glassUid===e.uid&&G.t-(s.glassT||0)<2.2)s.glassHits=(s.glassHits||0)+1;else{s.glassUid=e.uid;s.glassHits=1;}s.glassT=G.t;amount*=1+Math.min(.6,s.glassHits*.035*blessingRank('glassThread'));}
 if((e.elite||e.isBoss)&&blessingRank('siegeEmber')){if(s.siegeUid===e.uid&&G.t-(s.siegeT||0)<1.8)s.siegeHits=(s.siegeHits||0)+1;else{s.siegeUid=e.uid;s.siegeHits=1;}s.siegeT=G.t;amount*=1+Math.min(.75,s.siegeHits*.018*blessingRank('siegeEmber'));}
 if(e.burnT>0&&blessingRank('wildfirePact')){const nearby=expansionLiving().filter(q=>q!==e&&q.burnT>0&&d2(q.x,q.y,e.x,e.y)<230**2).length;amount*=1+Math.min(.75,nearby*.09*blessingRank('wildfirePact'));}
 if(e.isBoss&&s?.shatteredFragments)amount*=1+s.shatteredFragments*.08*blessingRank('shatteredCrown');
 if(e.isBoss&&blessingRank('onlyEmber')&&!expansionLiving().some(q=>q!==e&&!q.isBoss))amount*=1.75;
 if(s?.finalMatchT>0)amount*=2;
 if(blessingRank('duelistEmber')&&expansionLiving().length===1)amount*=1+.22*blessingRank('duelistEmber');
 if(kind==='burn'&&blessingRank('crucible'))s.crucible=Math.min(40,(s.crucible||0)+amount/Math.max(1,p.dmg));
 const wasDead=e.dead;expansionDamageEnemy(e,amount,ang,crit,kb,kind);
 if(wasDead||!s)return;
 if(kind==='shot'&&starstitchActive()&&!e.dead){s.stitchHits=(s.stitchHits||0)+1;const form=typeof activeForm==='function'?activeForm('primary').id:'emberBolt',every=form==='sunlance'?1:Math.max(2,9-2*blessingRank('brightNeedle')-(form==='cinderburst'?2:form==='starweaver'?1:0));if(s.stitchHits%every===0&&(!e.expPinT||e.expPinT<=G.t)){e.expPinT=G.t+(form==='sunlance'?.22:.06);starstitchPin(e.x,e.y,e);}}
 if(blessingRank('redThread')&&kind!=='redThread'&&!e.dead){if(!s.redThreadSet){s.redThreadSet=true;e.expRedThread=true;const near=expansionLiving().filter(q=>q!==e).sort((a,b)=>d2(a.x,a.y,e.x,e.y)-d2(b.x,b.y,e.x,e.y)).slice(0,1+blessingRank('redThread'));for(const q of near)q.expRedThread=true;}if(e.expRedThread)for(const q of expansionLiving())if(q!==e&&q.expRedThread)expansionDamageEnemy(q,amount*(.16+.08*blessingRank('redThread')),ang,false,0,'redThread');}
 if(crit&&blessingRank('goldenThread')&&kind!=='goldenThread'){e.expGolden=true;const near=expansionLiving().filter(q=>q!==e).sort((a,b)=>d2(a.x,a.y,e.x,e.y)-d2(b.x,b.y,e.x,e.y)).slice(0,5);for(const q of near)q.expGolden=true;for(const q of expansionLiving())if(q!==e&&q.expGolden)expansionDamageEnemy(q,amount*.35,ang,false,0,'goldenThread');}
};

const expansionHurtPlayer=hurtPlayer;
hurtPlayer=function(dmg,sx,sy){
 const p=G.player,s=expansionState();if(!p||!s)return expansionHurtPlayer(dmg,sx,sy);const valid=p.hitCd<=0&&p.dashT<=0&&G.state==='playing'&&!G.dead;if(!valid)return;let amount=dmg;
 if(valid&&blessingRank('quietCore')&&G.t-(s.lastHurt||-99)>5)amount*=1-.08*blessingRank('quietCore');
 if(valid&&blessingRank('cinderSkin')&&expansionLiving().some(e=>d2(e.x,e.y,sx,sy)<70**2))amount*=1-.07*blessingRank('cinderSkin');

 const hp=p.hp,ward=p.cardWard||0;expansionHurtPlayer(amount,sx,sy);const lost=Math.max(0,hp-p.hp),absorbed=Math.max(0,ward-(p.cardWard||0));if(!lost&&!absorbed&&!(p.hp>hp&&p.hitCd>0))return;
 s.lastHurt=G.t;s.roomHit=true;s.chainStacks=Math.max(0,(s.chainStacks||0)-1);s.unbrokenStacks=0;s.keptStacks=0;if(absorbed&&blessingRank('heatSink'))s.heatSink=Math.min(p.maxHp,(s.heatSink||0)+absorbed);
 if(blessingRank('ashenHour')&&!s.ashenHourRoom&&p.hp>0&&p.hp<p.maxHp*.4){s.ashenHourRoom=true;s.freezeT=3.2;p.meleeCdT=0;expansionHeal(p.maxHp*.16,'THE ASHEN HOUR');burst(p.x,p.y,38,'#d7ecff',260,.9,4,true);sfx('mythic');}
};

const expansionDie=die;
die=function(){const p=G.player,s=expansionState();if(p&&s&&p.hp<=0&&blessingRank('phoenixLaw')&&G.floor>=(s.phoenixLastFloor||-9)+5){s.phoenixLastFloor=G.floor;p.hp=p.maxHp;p.hitCd=4;p.reloadT=0;p.ammo=p.magSize;for(const e of expansionLiving()){e.burnT=Math.max(e.burnT||0,9);e.burnRank=Math.max(e.burnRank||0,6);}nova(p.x,p.y,360,p.dmg*9);toast('PHOENIX LAW','the room burns before you do');sfx('mythic');saveNow();return;}return expansionDie();};

const expansionKillEnemy=killEnemy;
killEnemy=function(e){
 const was=e?.dead,s=expansionState(),kind=e?.type,x=e?.x,y=e?.y,elite=e?.elite,isBoss=e?.isBoss,mechanism=e?.mechanism;expansionKillEnemy(e);if(was||!e?.dead||!s)return;
 if(!s.ashMemoryType&&!isBoss)s.ashMemoryType=kind;
 if(blessingRank('cinderLadder')){s.cinderLadder=Math.min(12,(s.cinderLadder||0)+1);s.cinderLadderT=2.4;}
 if(elite&&!isBoss&&blessingRank('ashDividend')){expansionHeal(4+4*blessingRank('ashDividend'),'ASH DIVIDEND');s.ashDividendT=5+blessingRank('ashDividend');}
 if(mechanism&&blessingRank('shatteredCrown')){s.shatteredFragments=(s.shatteredFragments||0)+1;addText(x,y-18,'CROWN FRAGMENT','#ffe09a',11);}
 if(elite&&!isBoss&&blessingRank('crownlessKing')&&!s.crownTaken){s.crownTaken=true;const n=Math.abs((e.uid||1)+(G.floor||1))%4;s.crownlessPower=n===0?{dmg:.25}:n===1?{speed:.18}:n===2?{crit:.14}:{rate:.16};recalc();toast('THE CROWNLESS KING',['power taken','speed taken','sight taken','cadence taken'][n]);}
 if(blessingRank('livingConstellation')&&!isBoss&&s.livingStars.length<7&&chance(.22)){s.livingStars.push({a:Math.random()*TAU,t:999,shot:rand(.1,.8),color:e.col||'#ffe3a3'});}
 if(blessingRank('blackBell')&&!s.blackBellActive){s.blackBellKills=(s.blackBellKills||0)+1;if(s.blackBellKills>=25){s.blackBellKills=0;s.blackBellActive=true;for(const q of expansionLiving()){const hit=q.isBoss?q.max*.08:q.max*.5;expansionDamageEnemy(q,hit,0,false,0,'blackBell');}s.blackBellActive=false;burst(G.player.x,G.player.y,55,'#b9a6ff',340,1,5,true);toast('THE BLACK BELL','the room answers');sfx('mythic');}}
 if(s.longDawnActive)expansionHeal(2);
 if(blessingRank('keptPromise')&&s.keptStacks){if(chance(Math.min(.45,s.keptStacks*.025*blessingRank('keptPromise'))))spawnPick('heart',x,y,10+2*blessingRank('keptPromise'));if(chance(Math.min(.55,s.keptStacks*.035*blessingRank('keptPromise'))))spawnPick('ess',x+6,y,1+blessingRank('keptPromise'));}
};

function expansionOverheal(excess){
 const p=G.player,s=expansionState();if(!p||!s||!blessingRank('hearthWorld')||excess<=0)return;
 s.hearthWorldCarry=(s.hearthWorldCarry||0)+excess*.25;const gain=Math.floor(s.hearthWorldCarry);if(!gain)return;
 s.hearthWorldCarry-=gain;s.hearthWorldHp=(s.hearthWorldHp||0)+gain;p.maxHp+=gain;p.hp+=gain;
 if(Math.floor(s.hearthWorldHp/50)>(s.hearthWorldFlames||0)){s.hearthWorldFlames=Math.floor(s.hearthWorldHp/50);toast('HEARTH OF THE WORLD','another flame joins the orbit');}
}
const expansionCardHeal=cardHeal;
cardHeal=function(amount,label){const p=G.player;if(!p||!Number.isFinite(amount)||amount<=0)return;const excess=Math.max(0,p.hp+amount-p.maxHp),out=expansionCardHeal(amount,label);expansionOverheal(excess);return out;};
const expansionUpdatePicks=updatePicks;
updatePicks=function(dt){
 const p=G.player,s=expansionState();if(!p||!s)return expansionUpdatePicks(dt);
 let room=Math.max(0,p.maxHp-p.hp),excess=0;const before=new Map(G.picks.map(o=>[o,{kind:o.kind,val:o.val}]));
 expansionUpdatePicks(dt);
 for(const [pick,item]of before){if(G.picks.includes(pick))continue;
  if(item.kind==='ess'&&blessingRank('warmTrail'))s.warmTrailT=Math.min(6,(s.warmTrailT||0)+1.2*blessingRank('warmTrail'));
  if(item.kind==='heart'){if(room<=0&&blessingRank('hearthTax'))addEss(blessingRank('hearthTax'));excess+=Math.max(0,item.val-room);room=Math.max(0,room-item.val);}
 }
 expansionOverheal(excess);
};

function expansionRoomTick(dt){
 const s=expansionState(),p=G.player;if(!s||!p)return;const index=expansionRoomIndex(),enemies=expansionRoomEnemies(index);
 if(index!==s.roomIndex){s.roomIndex=index;s.roomAge=0;s.roomHit=false;s.roomCombat=enemies.length>0;s.ashenHourRoom=false;s.redThreadSet=false;for(const e of expansionLiving()){e.expRedThread=false;e.expGolden=false;}if(index>=0&&!s.visitedRooms[index]){s.visitedRooms[index]=true;if(enemies.length&&blessingRank('pilgrimHeat'))p.cardWard=(p.cardWard||0)+p.maxHp*(.025+.015*blessingRank('pilgrimHeat'))*(1+.15*blessingRank('temperedGlow'));}}
 s.roomAge=(s.roomAge||0)+dt;
 if(enemies.length)s.roomCombat=true;
 if(s.roomCombat&&!enemies.length){s.roomCombat=false;const clean=!s.roomHit;if(blessingRank('keptPromise')&&clean)s.keptStacks=Math.min(12,(s.keptStacks||0)+1);if(blessingRank('chainRooms')&&clean)s.chainStacks=Math.min(8,(s.chainStacks||0)+1);}
}
function expansionDashTick(dt){
 const s=expansionState(),p=G.player;if(!s||!p)return;const dashing=p.dashT>0;
 if(dashing&&!s.wasDashing){s.dashStartX=p.x;s.dashStartY=p.y;s.dashDanger=false;s.dashLinePulse=false;s.handX=p.x;s.handY=p.y;expansionAction('dash');if(blessingRank('smolderstep'))s.mines.push({x:p.x,y:p.y,t:7,power:blessingRank('smolderstep')});if(blessingRank('doorStars'))s.portalStart={x:p.x,y:p.y};}
 if(dashing){
  for(const b of G.ebul)if(d2(b.x,b.y,p.x,p.y)<58**2){s.dashDanger=true;if(blessingRank('hollowStep')&&!s.hollowDash){s.hollowDash=true;p.dashCdT=Math.max(0,p.dashCdT-.22*blessingRank('hollowStep'));}if(blessingRank('smokeBetween')&&!s.smokeDash){s.smokeDash=true;p.hitCd=Math.max(p.hitCd,.5);G.ebul=G.ebul.filter(q=>d2(q.x,q.y,p.x,p.y)>115**2);burst(p.x,p.y,22,'#d4e8ef',170,.55,3,true);}}
  if(blessingRank('backdraft')||blessingRank('brushfire')||blessingRank('gravityWake'))for(const e of expansionLiving()){const near=d2(e.x,e.y,p.x,p.y)<(e.r+34)**2;if(!near)continue;if(blessingRank('backdraft')&&e.burnT>0&&e.expBackDash!==s.dashStartX){e.expBackDash=s.dashStartX;e.burnT+=1.2*blessingRank('backdraft');damageEnemy(e,p.dmg*.32*blessingRank('backdraft'),p.face,false,.2,'backdraft');}if(blessingRank('brushfire')&&e.burnT>0)for(const q of expansionLiving())if(q!==e&&d2(q.x,q.y,e.x,e.y)<150**2){q.burnT=Math.max(q.burnT||0,2+blessingRank('brushfire'));q.burnRank=Math.max(q.burnRank||0,blessingRank('brushfire'));}if(blessingRank('gravityWake')&&!e.isBoss){e.kbx+=(p.x-e.x)*.9*blessingRank('gravityWake');e.kby+=(p.y-e.y)*.9*blessingRank('gravityWake');}}
  if(blessingRank('runningStitch')&&!s.dashLinePulse)for(const [a,b]of starstitchLines())if(expansionSegmentDistance(p.x,p.y,a.x,a.y,b.x,b.y)<22){s.dashLinePulse=true;for(const e of expansionLiving())if(starstitchLines().some(([q,r])=>expansionSegmentDistance(e.x,e.y,q.x,q.y,r.x,r.y)<e.r+22))damageEnemy(e,p.dmg*(.35+.3*blessingRank('runningStitch')),0,false,.25,'runningStitch');break;}
 }
 if(!dashing&&s.wasDashing){s.lastDashEnd=G.t;s.doppelReady=blessingRank('ashDoppelganger')?1+blessingRank('ashDoppelganger'):0;s.doppelX=s.dashStartX;s.doppelY=s.dashStartY;s.hollowDash=false;s.smokeDash=false;if(s.dashDanger&&blessingRank('unbrokenStep'))s.unbrokenStacks=Math.min(8,(s.unbrokenStacks||0)+1);
  if(blessingRank('coronaStep'))for(const turn of [-Math.PI/2,Math.PI/2])expansionFriendlyShot(p.x,p.y,(p.face||0)+turn,p.dmg*(.75+.35*blessingRank('coronaStep')),{r:12,pierce:5,life:1,corona:true});
  if(blessingRank('gravityWake'))nova(p.x,p.y,75+25*blessingRank('gravityWake'),p.dmg*(.6+.45*blessingRank('gravityWake')));
  if(blessingRank('doorStars')&&s.portalStart)s.portal={id:(s.portalSerial=(s.portalSerial||0)+1),ax:s.portalStart.x,ay:s.portalStart.y,bx:p.x,by:p.y,t:7};
  if(blessingRank('onlyEmber')&&G.bossActive&&expansionLiving().filter(e=>!e.isBoss).length===0){s.onlyEmberDashes=(s.onlyEmberDashes||0)+1;if(s.onlyEmberDashes%3===0){p.meleeCdT=0;s.echoFlares.push({delay:.08,x:p.x,y:p.y,a:p.face,power:1.25});}}
 }
 s.wasDashing=dashing;
}
function expansionFieldsTick(dt){
 const s=expansionState(),p=G.player;if(!s||!p)return;
 if(!Array.isArray(s.hearthBlocks))s.hearthBlocks=[];const hearths=Math.min(7,s.hearthWorldFlames||0);while(s.hearthBlocks.length<hearths)s.hearthBlocks.push(0);s.hearthBlocks=s.hearthBlocks.slice(0,hearths).map(t=>Math.max(0,t-dt));
 for(let i=s.mines.length-1;i>=0;i--){const m=s.mines[i];m.t-=dt;const target=expansionNearest(m.x,m.y,e=>d2(e.x,e.y,m.x,m.y)<72**2);if(target||m.t<=0){if(target)nova(m.x,m.y,75+15*m.power,p.dmg*(.65+.42*m.power));s.mines.splice(i,1);}}
 for(let i=s.echoShots.length-1;i>=0;i--){const q=s.echoShots[i];q.delay-=dt;if(q.delay<=0){const target=expansionNearest(q.x,q.y),a=target?Math.atan2(target.y-q.y,target.x-q.x):Math.atan2(q.b.vy,q.b.vx),speed=Math.hypot(q.b.vx,q.b.vy);G.bullets.push({...q.b,x:q.x,y:q.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,hits:null});s.echoShots.splice(i,1);}}
 for(let i=s.echoFlares.length-1;i>=0;i--){const q=s.echoFlares[i];q.delay-=dt;if(q.delay<=0){for(const e of expansionLiving()){const d=Math.hypot(e.x-q.x,e.y-q.y),diff=Math.abs(angleDiff(Math.atan2(e.y-q.y,e.x-q.x),q.a));if(d<MELEE.reach+45&&diff<MELEE.halfArc+.2)damageEnemy(e,p.dmg*MELEE.damage*q.power,q.a,false,.5,'seventhHand');}burst(q.x,q.y,18,'#ffe0a2',160,.45,2.5,true);s.echoFlares.splice(i,1);}}
 for(let i=s.lines.length-1;i>=0;i--){const q=s.lines[i];q.t-=dt;q.tick-=dt;if(q.tick<=0){q.tick=.2;for(const e of expansionLiving())if(expansionSegmentDistance(e.x,e.y,q.x1,q.y1,q.x2,q.y2)<e.r+10)damageEnemy(e,p.dmg*.18*blessingRank('emberLine'),0,false,0,'emberLine');}if(q.t<=0)s.lines.splice(i,1);}
 for(let i=s.bankStars.length-1;i>=0;i--){const q=s.bankStars[i];q.t-=dt;q.a+=dt*2.2;q.shot-=dt;if(q.shot<=0){const x=p.x+Math.cos(q.a)*58,y=p.y+Math.sin(q.a)*58,target=expansionNearest(x,y);if(target)expansionFriendlyShot(x,y,Math.atan2(target.y-y,target.x-x),p.dmg*q.power,{r:6,seeking:.12,pierce:1});s.bankStars.splice(i,1);}else if(q.t<=0)s.bankStars.splice(i,1);}
 for(const q of s.livingStars){q.a+=dt*(.45+s.livingStars.length*.03);q.shot-=dt;if(q.shot<=0){q.shot=1.15;const x=p.x+Math.cos(q.a)*(72+s.livingStars.indexOf(q)*3),y=p.y+Math.sin(q.a)*(52+s.livingStars.indexOf(q)*2),target=expansionNearest(x,y);if(target)expansionFriendlyShot(x,y,Math.atan2(target.y-y,target.x-x),p.dmg*.72,{r:5,seeking:.18,life:1.4,livingStar:true});}}
 for(let i=s.suns.length-1;i>=0;i--){const q=s.suns[i];q.t-=dt;q.a+=dt*.85;q.shot-=dt;if(q.shot<=0){q.shot=.52;const x=p.x+Math.cos(q.a)*92,y=p.y+Math.sin(q.a)*68,target=expansionNearest(x,y);if(target)damageEnemy(target,p.dmg*.62,Math.atan2(target.y-y,target.x-x),false,0,'sevenSuns');}if(q.t<=0)s.suns.splice(i,1);}
 for(let i=s.returnShots.length-1;i>=0;i--){const q=s.returnShots[i];q.t-=dt;q.a+=dt*2.5;if(q.t<=0){const x=p.x+Math.cos(q.a)*74,y=p.y+Math.sin(q.a)*54,target=expansionNearest(x,y);if(target)expansionFriendlyShot(x,y,Math.atan2(target.y-y,target.x-x),p.dmg*2.1,{r:7,seeking:.18,pierce:2});s.returnShots.splice(i,1);}}
 if(s.portal){if(!Number.isInteger(s.portal.id))s.portal.id=(s.portalSerial=(s.portalSerial||0)+1);s.portal.t-=dt;if(s.portal.t<=0)s.portal=null;else for(const b of G.bullets){if(b.portalCd>G.t||b.portalPair===s.portal.id)continue;const da=d2(b.x,b.y,s.portal.ax,s.portal.ay),db=d2(b.x,b.y,s.portal.bx,s.portal.by);if(da<24**2||db<24**2){const fromA=da<db;b.x=(fromA?s.portal.bx:s.portal.ax)+b.vx*.04;b.y=(fromA?s.portal.by:s.portal.ay)+b.vy*.04;b.vx*=1.35;b.vy*=1.35;b.dmg*=1.5;b.portalCd=G.t+.25;b.portalPair=s.portal.id;burst(b.x,b.y,7,'#bfbcff',130,.35,2,true);}}}
}

function starstitchTick(dt){
 const s=expansionState(),p=G.player;if(!s||!p||!starstitchActive())return;
 for(let i=s.pins.length-1;i>=0;i--){const pin=s.pins[i];pin.life-=dt;if(pin.uid){const target=G.enemies.find(e=>e.uid===pin.uid&&!e.dead);if(target){pin.x=target.x;pin.y=target.y;}else if(blessingRank('unfinishedPattern'))pin.uid=0;else{s.pins.splice(i,1);continue;}}if(pin.life<=0)s.pins.splice(i,1);}
 const lines=starstitchLines(),wire=blessingRank('hotWire');
 for(const e of expansionLiving()){
  if((e.expStitchT||0)<=G.t&&lines.some(([a,b])=>expansionSegmentDistance(e.x,e.y,a.x,a.y,b.x,b.y)<e.r+9)){e.expStitchT=G.t+.28;damageEnemy(e,p.dmg*(.09+.075*wire),0,false,0,'starstitch');}
  if(blessingRank('knottedLight')&&s.pins.some(q=>d2(q.x,q.y,e.x,e.y)<(e.r+42)**2)){e.expSlowUntil=G.t+.12;e.expSlowMul=Math.max(.4,1-.15*blessingRank('knottedLight'));if((e.expKnotT||0)<=G.t){e.expKnotT=G.t+.45;damageEnemy(e,p.dmg*.08*blessingRank('knottedLight'),0,false,0,'knottedLight');}}
 }
 if(blessingRank('constellationCage')&&s.pins.length>=3){const a=s.pins[0],b=s.pins[1],c=s.pins[2];for(const e of expansionLiving())if((e.expCageT||0)<=G.t&&expansionPointInTriangle(e.x,e.y,a,b,c)){e.expCageT=G.t+.34;damageEnemy(e,p.dmg*.12*blessingRank('constellationCage'),0,false,0,'constellationCage');}}
 if(blessingRank('cinderThread')){const burning=s.pins.find(q=>{const e=G.enemies.find(x=>x.uid===q.uid&&!x.dead);return e?.burnT>0;});if(burning)for(const pin of s.pins){const e=G.enemies.find(x=>x.uid===pin.uid&&!x.dead);if(e){e.burnT=Math.max(e.burnT||0,1.8+blessingRank('cinderThread'));e.burnRank=Math.max(e.burnRank||0,blessingRank('cinderThread'));}}}
 if(blessingRank('seventhConstellation')&&s.pins.length===7){s.stitchShot=(s.stitchShot||0)-dt;if(s.stitchShot<=0){s.stitchShot=.85;for(const pin of s.pins){const target=expansionNearest(pin.x,pin.y);if(target)expansionFriendlyShot(pin.x,pin.y,Math.atan2(target.y-pin.y,target.x-pin.x),p.dmg*.55,{r:5,seeking:.12,life:1.1});}}}
}

const expansionTickBlessings=tickBlessings;
tickBlessings=function(dt){
 const p=G.player,s=expansionState();if(!p||!s)return expansionTickBlessings(dt);const ward=p.cardWard||0;expansionTickBlessings(dt);
 for(const key of ['rhythmBuff','warmTrailT','ashDividendT','clockBuff','furnaceT','finalMatchT','emptyChamberT'])s[key]=Math.max(0,(s[key]||0)-dt);
 if(s.cinderLadderT>0)s.cinderLadderT-=dt;else s.cinderLadder=Math.max(0,(s.cinderLadder||0)-dt*2);
 let speed=1;if(blessingRank('ashenPace')){s.movingT=p.moving?Math.min(4,(s.movingT||0)+dt):0;speed+=Math.min(.18,s.movingT*.018*blessingRank('ashenPace'));}if(s.warmTrailT>0)speed+=.06*blessingRank('warmTrail');if(s.unbrokenStacks)speed+=.025*s.unbrokenStacks*blessingRank('unbrokenStep');if(blessingRank('onlyEmber')&&G.bossActive&&expansionLiving().filter(e=>!e.isBoss).length===0)speed+=.2;p.pathSpeed=(p.pathSpeed||1)*speed;
 p.magnet=p.expansionBaseMagnet||p.magnet;if(blessingRank('lowLantern')&&p.hp<p.maxHp*.35)p.magnet*=1+.45*blessingRank('lowLantern');
 if(blessingRank('temperedGlow')&&ward>(p.cardWard||0)&&p.hitCd<=0)p.cardWard=Math.min(ward,(p.cardWard||0)+dt*.22*blessingRank('temperedGlow'));
 if((s.cinderLadder||0)>0)p.shotT-=dt*Math.min(.28,s.cinderLadder*.012*blessingRank('cinderLadder'));
 expansionRoomTick(dt);expansionDashTick(dt);expansionFieldsTick(dt);starstitchTick(dt);
 if(blessingRank('longDawn')){s.longDawnT=(s.longDawnT??45)-dt;if(s.longDawnT<=0){s.longDawnT=45;s.longDawnActive=true;for(const e of expansionLiving())damageEnemy(e,p.dmg*6,0,false,1,'longDawn');s.longDawnActive=false;burst(p.x,p.y,60,'#fff0a8',420,1.2,6,true);toast('THE LONG DAWN','morning crosses the room');sfx('mythic');}}
 if(blessingRank('finalMatch')&&G.boss&&!G.boss.dead&&G.boss.hp/G.boss.max<.32&&s.guardianFinalUid!==G.boss.uid){s.guardianFinalUid=G.boss.uid;s.finalMatchT=8;p.ammo=p.magSize;p.reloadT=0;p.meleeCdT=0;p.dashCdT=0;toast('THE FINAL MATCH','burn brighter than the ending');sfx('mythic');}
 if(s.finalMatchT>0){p.ammo=p.magSize;p.reloadT=0;p.shotT-=dt*.5;p.meleeCdT=Math.max(0,p.meleeCdT-dt*.7);}
};

const expansionUpdateEnemies=updateEnemies;
updateEnemies=function(dt){const s=expansionState();if(s?.freezeT>0){s.freezeT=Math.max(0,s.freezeT-dt);return;}const slowed=[];for(const e of G.enemies)if(!e.dead&&e.expSlowUntil>G.t){slowed.push([e,e.spd]);e.spd*=e.expSlowMul||1;}try{return expansionUpdateEnemies(dt);}finally{for(const [e,spd]of slowed)e.spd=spd;}};

const expansionUpdateBullets=updateBullets;
updateBullets=function(dt){
 const s=expansionState(),p=G.player;if(!s||!p)return expansionUpdateBullets(dt);const ric=new Map(G.bullets.map(b=>[b,b.ric||0]));
 for(const b of G.bullets){
  if(blessingRank('turningSpark')&&b.turningSpark&&!b.turned&&b.life<.12){const target=expansionNearest(b.x,b.y,e=>!b.hits?.has(e));if(target){const speed=Math.hypot(b.vx,b.vy),a=Math.atan2(target.y-b.y,target.x-b.x);b.vx=Math.cos(a)*speed;b.vy=Math.sin(a)*speed;b.life=.75+.15*b.turningSpark;b.seeking=Math.max(b.seeking||0,.08*b.turningSpark);b.turned=true;}}
  const speed=Math.hypot(b.vx,b.vy),ahead=solidPx(G.world,b.x+b.vx/Math.max(1,speed)*10,b.y+b.vy/Math.max(1,speed)*10);
  if(ahead&&blessingRank('wallscript')&&!b.wallPinned){b.wallPinned=true;starstitchPin(b.x,b.y,null);}
  if(ahead&&blessingRank('loopingSigil')&&!b.looped){const target=expansionNearest(b.x,b.y,e=>!b.hits?.has(e));if(target){const a=Math.atan2(target.y-b.y,target.x-b.x);b.x-=b.vx/Math.max(1,speed)*12;b.y-=b.vy/Math.max(1,speed)*12;b.vx=Math.cos(a)*speed;b.vy=Math.sin(a)*speed;b.life=Math.max(b.life,.7+.15*blessingRank('loopingSigil'));b.looped=true;}}
  if(blessingRank('kindredSparks')){const target=expansionNearest(b.x,b.y);if(target){const a=Math.atan2(target.y-b.y,target.x-b.x),wantX=Math.cos(a)*speed,wantY=Math.sin(a)*speed,k=.025*blessingRank('kindredSparks');b.vx=lerp(b.vx,wantX,k);b.vy=lerp(b.vy,wantY,k);}}
 }
 expansionUpdateBullets(dt);
 if(blessingRank('slingshotRune'))for(const b of G.bullets)if(ric.has(b)&&(b.ric||0)<ric.get(b)){const gain=1+.18*blessingRank('slingshotRune');b.vx*=gain;b.vy*=gain;b.dmg*=gain;b.r+=2*blessingRank('slingshotRune');}
};

const expansionUpdateEBullets=updateEBullets;
updateEBullets=function(dt){
 const s=expansionState(),p=G.player;if(!s||!p)return expansionUpdateEBullets(dt);if(s.freezeT>0)return;
 const lines=starstitchLines();G.ebul=G.ebul.filter(b=>{
  const hearths=Math.min(7,s.hearthWorldFlames||0);for(let i=0;i<hearths;i++){const a=(save.motion?0:G.tAll)*(.58+i*.025)+i*TAU/hearths,r=46+(i%2)*12,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r*.72;if(!(s.hearthBlocks?.[i]>0)&&d2(b.x,b.y,x,y)<(b.r+10)**2){s.hearthBlocks[i]=1.5;burst(x,y,9,'#ffd78b',125,.36,2,true);return false;}}
  const dist=Math.sqrt(d2(b.x,b.y,p.x,p.y));if(dist>p.r+12&&dist<66&&!b.expNear&&((b.x-p.x)*b.vx+(b.y-p.y)*b.vy)>0){b.expNear=true;if(blessingRank('nearMiss'))p.meleeCdT=Math.max(0,p.meleeCdT-.16*blessingRank('nearMiss'));if(blessingRank('starlessCrown')){s.returnShots.push({a:Math.atan2(b.y-p.y,b.x-p.x),t:.8});return false;}}
  if(blessingRank('counterweave')){const touching=lines.map(([a,c],i)=>expansionSegmentDistance(b.x,b.y,a.x,a.y,c.x,c.y)<b.r+5?i:-1).filter(i=>i>=0),crossed=touching.filter(i=>!b.expWeaveTouch?.includes(i));b.expWeaveTouch=touching;if(crossed.length){b.expWeave=(b.expWeave||0)+crossed.length;if(blessingRank('counterweave')>=2||b.expWeave>=2)return false;b.vx*=.45;b.vy*=.45;}}
  return true;
 });
 if(s.emptyChamberT>0)return;return expansionUpdateEBullets(dt);
};

const expansionDrawCombatFX=drawCombatFX;
drawCombatFX=function(ctx){
 expansionDrawCombatFX(ctx);const s=expansionState(),p=G.player;if(!s||!p)return;const t=save.motion?0:G.tAll,lines=starstitchLines();ctx.save();ctx.globalCompositeOperation='lighter';
 for(const [a,b]of lines){const pulse=.56+.24*Math.sin(t*7+a.x*.012);ctx.strokeStyle='rgba(115,228,239,'+pulse+')';ctx.lineWidth=2;ctx.setLineDash([7,5]);ctx.lineDashOffset=-t*32;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='rgba(220,255,250,.25)';ctx.lineWidth=6;ctx.stroke();}
 for(const pin of s.pins){ctx.save();ctx.translate(pin.x,pin.y);ctx.rotate(t*.65+pin.x*.01);ctx.strokeStyle='#d8ffff';ctx.fillStyle='#6fd8e7';ctx.globalAlpha=.85;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<4;i++){const a=i*TAU/4-Math.PI/2,r=i%2?5:10;i?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.stroke();ctx.fillRect(-2,-2,4,4);ctx.restore();}
 for(const q of s.lines){ctx.strokeStyle='rgba(255,170,91,'+(.32+.22*Math.sin(t*9))+')';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(q.x1,q.y1);ctx.lineTo(q.x2,q.y2);ctx.stroke();ctx.strokeStyle='#ffd69a';ctx.lineWidth=1.5;ctx.stroke();}
 for(const m of s.mines){ctx.save();ctx.translate(m.x,m.y);ctx.rotate(t*.5);ctx.strokeStyle='#ffad5f';ctx.globalAlpha=.65;ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);ctx.strokeRect(8,-3,8,6);}ctx.fillStyle='#fff0b6';ctx.fillRect(-3,-3,6,6);ctx.restore();}
 for(const q of s.bankStars){const x=p.x+Math.cos(q.a)*58,y=p.y+Math.sin(q.a)*58;ctx.fillStyle='#ffe5a2';ctx.globalAlpha=.8;ctx.save();ctx.translate(x,y);ctx.rotate(t);ctx.fillRect(-4,-4,8,8);ctx.restore();}
 for(let i=0;i<s.livingStars.length;i++){const q=s.livingStars[i],x=p.x+Math.cos(q.a)*(72+i*3),y=p.y+Math.sin(q.a)*(52+i*2);ctx.fillStyle=q.color||'#fff0b0';ctx.globalAlpha=.72;ctx.fillRect(x-3,y-3,6,6);ctx.strokeStyle='#fff8d2';ctx.lineWidth=1;ctx.strokeRect(x-6,y-6,12,12);}
 for(const q of s.suns){const x=p.x+Math.cos(q.a)*92,y=p.y+Math.sin(q.a)*68;ctx.fillStyle='#fff8c7';ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fill();ctx.strokeStyle='#ffb457';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,12,t+q.a,t+q.a+4.8);ctx.stroke();}
 for(let i=0;i<Math.min(7,s.hearthWorldFlames||0);i++){const a=t*(.58+i*.025)+i*TAU/Math.min(7,s.hearthWorldFlames),r=46+(i%2)*12,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r*.72,ready=!(s.hearthBlocks?.[i]>0);ctx.fillStyle=ready?'#fff2b0':'#9b6b48';ctx.globalAlpha=ready?.9:.35;ctx.fillRect(x-3,y-7,6,10);ctx.fillStyle='#ff6e3f';ctx.fillRect(x-5,y+2,10,4);}
 if(s.portal){for(const [x,y]of [[s.portal.ax,s.portal.ay],[s.portal.bx,s.portal.by]]){ctx.strokeStyle='#b7afff';ctx.globalAlpha=.66;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,14,25,t*.4,0,TAU);ctx.stroke();ctx.fillStyle='rgba(113,92,211,.16)';ctx.fill();}}
 if(s.doppelReady>0){ctx.strokeStyle='#ffe0aa';ctx.globalAlpha=.28;ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.doppelX,s.doppelY,17,0,TAU);ctx.stroke();}
 if(blessingRank('seventhHand')){const hx=s.handX??p.x,hy=s.handY??p.y;ctx.strokeStyle='#fff0bf';ctx.globalAlpha=.24;ctx.lineWidth=2;ctx.beginPath();ctx.arc(hx,hy,14,0,TAU);ctx.stroke();ctx.fillStyle='#ffbd69';ctx.fillRect(hx-3,hy-3,6,6);}
 ctx.restore();
};

function blessingExpansionAudit(){
 const ids=EXPANDED_BLESSINGS.map(card=>card.id),counts=[0,0,0,0];for(const card of EXPANDED_BLESSINGS)counts[card.r]++;
 return{version:BLESSING_EXPANSION_VERSION,cards:ids.length,unique:new Set(ids).size,rarities:counts,starstitch:STARSTITCH_IDS.length,uncovered:ids.filter(id=>!EXPANDED_EFFECT_IDS.has(id)),missingFromPool:ids.filter(id=>!POOL.some(card=>card.id===id)),invalid:EXPANDED_BLESSINGS.filter(card=>!card.name||!card.ds||card.max<1||card.minFloor<1||card.minFloor>80).map(card=>card.id)};
}
window.blessingExpansionAudit=blessingExpansionAudit;
document.documentElement.dataset.blessingExpansion='v'+BLESSING_EXPANSION_VERSION;
document.documentElement.dataset.blessingExpansionAudit=JSON.stringify(blessingExpansionAudit());

const expansionSyncWeaponHUD=syncWeaponHUD;
syncWeaponHUD=function(){
 expansionSyncWeaponHUD();const p=G.player;if(!p)return;
 const active=p.reloadT>0&&blessingRank('perfectRekindle')>0,ready=active&&1-p.reloadT/Math.max(.01,p.reloadDuration)>=1-(.16+.07*blessingRank('perfectRekindle'));
 T('weaponHUD').classList.toggle('perfect-rekindle-ready',!!ready);
 if(active){T('btnReload').disabled=false;T('btnReload').setAttribute('aria-label',ready?'Perfect Rekindle: press now':'Rekindling: wait for the gold window');const el=T('touchReload');el.classList.toggle('cooling',!ready);el.setAttribute('aria-disabled','false');el.querySelector('.touch-state').textContent=ready?'TAP NOW':'WAIT FOR GOLD';}
 else T('btnReload').setAttribute('aria-label','Rekindle ember charges');
};
addEventListener('keydown',e=>{if(e.repeat||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||G.state!=='levelup'||anyBlockingOverlay())return;const m=/^(?:Digit|Numpad)([4-7])$/.exec(e.code);if(m&&G.cardPool?.[Number(m[1])-1]){e.preventDefault();chooseCard(Number(m[1])-1);}});
