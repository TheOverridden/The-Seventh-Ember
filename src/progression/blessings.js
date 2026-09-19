const LONG_DESCENT_BLESSINGS=[
 {id:'coalHeart',r:0,max:3,w:7,minFloor:2,icon:'heart',name:'Coal Heart',ds:'Heart drops restore 25% more health per rank'},
 {id:'longFuse',r:0,max:3,w:8,minFloor:3,icon:'arrow-up-right',name:'Long Fuse',ds:'+20% Ember Bolt range'},
 {id:'quickStep',r:0,max:3,w:8,minFloor:4,icon:'feather',name:'Lightfoot',ds:'+10% dash distance'},
 {id:'ironAsh',r:0,max:3,w:7,minFloor:5,icon:'shield',name:'Iron Ash',ds:'Take 4% less damage'},
 {id:'firstSpark',r:0,max:3,w:7,minFloor:6,icon:'sun',name:'First Spark',ds:'The first Bolt after Rekindling deals +45% damage'},
 {id:'flarePractice',r:0,max:3,w:8,minFloor:7,icon:'flame',name:'Practiced Flare',ds:'Flare recovers 9% faster'},
 {id:'emberReach',r:0,max:3,w:7,minFloor:8,icon:'circle',name:'Heavy Sparks',ds:'Ember Bolts grow larger and easier to land'},
 {id:'lowGlow',r:0,max:3,w:6,minFloor:9,icon:'activity',name:'Low Glow',ds:'Regenerate faster while below 40% health'},
 {id:'pathfinder',r:0,max:3,w:7,minFloor:10,icon:'compass',name:'Pathfinder',ds:'Move faster for the first 10 seconds of each floor'},
 {id:'clearPath',r:0,max:3,w:7,minFloor:11,icon:'wind',name:'Clear the Way',ds:'Flare can strike one additional enemy'},
 {id:'patientAim',r:0,max:3,w:6,minFloor:12,icon:'crosshair',name:'Patient Aim',ds:'Bolts gain damage while you have not cast recently'},
 {id:'warmPocket',r:0,max:3,w:6,minFloor:13,icon:'gem',name:'Warm Pocket',ds:'Essence pickups have a chance to be worth one more'},

 {id:'seeking',r:1,max:2,w:6,minFloor:9,icon:'navigation',name:'Seeking Embers',ds:'Bolts gently curve toward nearby enemies'},
 {id:'cauterize',r:1,max:2,w:5,minFloor:11,icon:'flame',name:'Cauterize',ds:'Burning enemies deal 8% less contact damage'},
 {id:'dashBurst',r:1,max:2,w:5,minFloor:12,icon:'wind',name:'Flash Step',ds:'Ending a dash releases a small damaging pulse'},
 {id:'critMend',r:1,max:2,w:4,minFloor:14,icon:'heart-pulse',name:'Merciful Spark',ds:'Every eighth critical hit restores health'},
 {id:'flareGuard',r:1,max:2,w:5,minFloor:15,icon:'shield',name:'Flare Ward',ds:'Casting Flare grants a brief ward'},
 {id:'refund',r:1,max:2,w:5,minFloor:16,icon:'rotate-ccw',name:'Returning Heat',ds:'Critical Bolts can refund their charge'},
 {id:'orbitSpeed',r:1,max:2,w:5,minFloor:17,icon:'orbit',name:'Swift Orbit',ds:'Cinders orbit faster and hit harder'},
 {id:'kindleMark',r:1,max:2,w:5,minFloor:18,icon:'target',name:'Kindle Mark',ds:'Repeated hits build damage against one target'},
 {id:'emberMine',r:1,max:2,w:4,minFloor:19,icon:'sparkles',name:'Dying Spark',ds:'Expired Bolts burst around themselves'},
 {id:'essPulse',r:1,max:2,w:4,minFloor:20,icon:'gem',name:'Resonant Shard',ds:'Every eighth essence pickup releases a pulse'},
 {id:'bossWard',r:1,max:2,w:4,minFloor:21,icon:'shield-check',name:'Guardian Ward',ds:'Guardian attacks deal 7% less damage'},
 {id:'closeQuarters',r:1,max:2,w:5,minFloor:22,icon:'focus',name:'Nearlight',ds:'Bolts deal +18% damage at close range'},

 {id:'comet',r:2,max:2,w:4,minFloor:16,icon:'star',name:'Comet Ember',ds:'Every ninth cast launches a large piercing comet'},
 {id:'phoenixWake',r:2,max:2,w:3,minFloor:19,icon:'flame',name:'Phoenix Wake',ds:'Taking damage leaves a burning ring behind'},
 {id:'gravityFlare',r:2,max:2,w:3,minFloor:21,icon:'circle-dot',name:'Gravity Flare',ds:'Flare pulls nearby enemies toward its center'},
 {id:'doubleCast',r:2,max:2,w:3,minFloor:23,icon:'copy-plus',name:'Echo Cast',ds:'Every fifth cast repeats itself without using a charge'},
 {id:'echoFlare',r:2,max:2,w:3,minFloor:25,icon:'waves',name:'Returning Flare',ds:'Flare repeats from your previous position'},
 {id:'shockChain',r:2,max:2,w:3,minFloor:27,icon:'zap',name:'Storm Thread',ds:'Critical hits arc damage to nearby enemies'},
 {id:'breaker',r:2,max:2,w:3,minFloor:29,icon:'hammer',name:'Lockbreaker',ds:'Deal +45% damage to guardian mechanisms'},
 {id:'berserk',r:2,max:2,w:3,minFloor:31,icon:'gauge',name:'Fever Flame',ds:'Cast faster as health falls'},
 {id:'overheal',r:2,max:2,w:3,minFloor:33,icon:'shield-plus',name:'Overflowing Light',ds:'Excess healing becomes a temporary ward'},
 {id:'dashReset',r:2,max:1,w:3,minFloor:35,icon:'skull',name:'Ashen Pursuit',ds:'Elite kills instantly restore Dash'},
 {id:'prismBolt',r:2,max:2,w:3,minFloor:37,icon:'triangle',name:'Prism Bolt',ds:'Ricochets retain more damage and seek farther'},
 {id:'sunspot',r:2,max:2,w:3,minFloor:39,icon:'sun',name:'Sunspot',ds:'Cinders periodically erupt around you'},
 {id:'timePocket',r:2,max:2,w:3,minFloor:41,icon:'hourglass',name:'Still Time',ds:'Standing still slows nearby enemy projectiles'},
 {id:'heartfire',r:2,max:2,w:3,minFloor:43,icon:'heart',name:'Heartfire',ds:'Healing briefly raises damage and casting speed'},

 {id:'supernova',r:3,max:1,w:1,minFloor:22,icon:'sun',name:'Supernova',ds:'Every tenth critical hit detonates an enormous 800% damage nova'},
 {id:'blackHole',r:3,max:1,w:1,minFloor:28,icon:'circle-dot',name:'Black Star',ds:'Every eighth cast opens a huge seven-second gravity well'},
 {id:'sevenfold',r:3,max:1,w:1,minFloor:32,icon:'asterisk',name:'Sevenfold Flame',ds:'Every fourth cast becomes a piercing nine-Bolt fan'},
 {id:'mirrorSoul',r:3,max:1,w:1,minFloor:36,icon:'shield',name:'Mirror Soul',ds:'Flare devours nearby hostile shots, heals you, and returns their light'},
 {id:'starfall',r:3,max:1,w:1,minFloor:40,icon:'sparkles',name:'Starfall',ds:'Every seventh kill calls four stars; elites call six'},
 {id:'radiantDebt',r:3,max:1,w:1,minFloor:44,icon:'flame',name:'Radiant Debt',ds:'Double all damage dealt, but enemy hits deal 15% more damage'},
 {id:'dawnward',r:3,max:1,w:1,minFloor:48,icon:'sunrise',name:'Dawnward',ds:'Once each floor, defy death at 55% health and fully rekindle'},
 {id:'worldfire',r:3,max:1,w:1,minFloor:52,icon:'flame-kindling',name:'Worldfire',ds:'Burning enemies erupt for 240% damage and ignite everything nearby'},
 {id:'voidOrbit',r:3,max:1,w:1,minFloor:60,icon:'orbit',name:'Void Orbit',ds:'Three dark cinders devour hostile shots and fire them back'},
 {id:'endless',r:3,max:1,w:1,minFloor:70,icon:'infinity',name:'The Endless Ember',ds:'Every 20 seconds, permanently gain 5% damage and 2% cast speed'}
];
POOL.push(...LONG_DESCENT_BLESSINGS);
RARITY[2].n='EPIC';

buildCards=function(){
 const u=G.run.up,eligible=o=>(u[o.id]||0)<o.max&&(!o.unlock||armoryData()[o.unlock])&&G.floor>=(o.minFloor||1);
 let pool=POOL.filter(eligible);if(!pool.length)pool=[{id:'hp',r:0,max:99,w:1,icon:'heart',name:'Emberglow',ds:'Restore 25 health'}];
 const picks=(G.restoreCardIds||[]).map(id=>POOL.find(o=>o.id===id)).filter(Boolean);G.restoreCardIds=null;
 while(picks.length<3&&pool.length){const rarity=rollRarity(pool),tier=pool.filter(o=>o.r===rarity);let total=tier.reduce((n,o)=>n+o.w,0),roll=Math.random()*total,sel=tier[0];for(const o of tier){roll-=o.w;if(roll<=0){sel=o;break;}}picks.push(sel);pool=pool.filter(o=>o!==sel);}
 const wrap=T('cards');wrap.replaceChildren();for(let i=0;i<picks.length;i++){const o=picks[i],rank=u[o.id]||0,el=document.createElement('button');el.className='card';el.dataset.r=o.r;el.type='button';const pips=o.max<=8?'<div class="pips">'+Array.from({length:o.max},(_,k)=>`<em class="${k<rank?'on':''}"></em>`).join('')+'</div>':'';el.innerHTML=`<span class="key">${i+1}</span><div class="rar">${RARITY[o.r].n}</div><div class="ic"><i data-lucide="${o.icon}"></i></div><div class="nm cinzel">${o.name}</div><div class="ds">${o.ds}</div>${pips}<div class="card-rank">${o.consumable?'TAKE THE WARMTH':rank?'RANK '+(rank+1):'NEW BLESSING'}</div>`;el._up=o;on(el,'click',()=>chooseCard(i));wrap.appendChild(el);}G.cardPool=picks;refreshIcons();
};
rarityOdds=function(){const depth=clamp((G.floor-1)/79,0,1),treasure=G.opts.freeChoice?1:0,luck=META.rarity||0;let o=[.55-depth*.27,.29-depth*.02,.13+depth*.15,.03+depth*.14];o[0]-=treasure*.10;o[2]+=treasure*.055;o[3]+=treasure*.045;const shift=Math.min(Math.max(0,o[0]-.18),luck);o[0]-=shift;o[1]+=shift*.25;o[2]+=shift*.48;o[3]+=shift*.27;const total=o.reduce((a,b)=>a+b,0);return o.map(v=>v/total);};

const longRecalc=recalc;
recalc=function(){longRecalc();if(!G.player||!G.run)return;const p=G.player,u=G.run.up,g=id=>u[id]||0;p.dmg*=1+g('radiantDebt');p.dmg*=Math.pow(1.05,G.run.endlessStacks||0);p.shotInt*=Math.pow(.98,G.run.endlessStacks||0);MELEE.cooldown=MELEE.baseCooldown*Math.pow(.91,g('flarePractice'));MELEE.cleave=[1,.72,.55,.4,...Array(g('clearPath')).fill(.35)];p.dashDistance=1+.10*g('quickStep');p.cardArmor=.04*g('ironAsh');p.bulletLife=1+.20*g('longFuse');p.bulletSize=1+g('emberReach');p.orbitPower=(1+.25*g('orbitSpeed'))*(g('ashCrown')?1.8:1);p.orbitRate=1+.18*g('orbitSpeed');};
const longFire=fireVolley;
fireVolley=function(){const p=G.player,u=G.run.up,start=G.bullets.length,beforeAmmo=p.ammo;longFire();if(G.bullets.length===start)return;const created=G.bullets.slice(start);p.cardCasts=(p.cardCasts||0)+1;const patient=Math.max(0,Math.min(.45,(G.t-(p.lastCardCast||-9))*.06))*(u.patientAim||0);p.lastCardCast=G.t;for(const b of created){b.life*=p.bulletLife||1;b.r+=(p.bulletSize||1)-1;b.dmg*=1+patient;if(u.seeking)b.seeking=.055*u.seeking;if(u.closeQuarters)b.closeQuarters=u.closeQuarters;if(u.emberMine)b.emberMine=u.emberMine;if(u.prismBolt){b.ricRange=330+70*u.prismBolt;b.ricPower=.82+.07*u.prismBolt;}}
 if(u.firstSpark&&p.ammo===p.magSize-1)for(const b of created)b.dmg*=1+.45*u.firstSpark;
 if(u.comet&&p.cardCasts%9===0){const b=created[0];G.bullets.push({...b,r:10+2*u.comet,dmg:b.dmg*(1.4+.5*u.comet),pierce:7,life:1.8,comet:true,hits:null});sfx('comet');}
 if(u.doubleCast&&p.cardCasts%5===0)for(const b of created)G.bullets.push({...b,x:p.x,y:p.y,dmg:b.dmg*(.62+.18*u.doubleCast),hits:null,whiteStar:false});
 if(u.sevenfold&&p.cardCasts%4===0){const a=aimAngle();for(let i=-4;i<=4;i++)G.bullets.push({x:p.x,y:p.y,vx:Math.cos(a+i*.14)*BASE.bulletSpd,vy:Math.sin(a+i*.14)*BASE.bulletSpd,r:6,dmg:p.dmg*.82,pierce:2,ric:0,life:1.25,hits:null,late:true});sfx('mythic');}
 if(u.blackHole&&p.cardCasts%8===0){G.run.cardFields=G.run.cardFields||[];G.run.cardFields.push({x:p.x+Math.cos(aimAngle())*150,y:p.y+Math.sin(aimAngle())*150,t:7,tick:0,kind:'blackHole',rank:2.4,mythicReforged:true});sfx('mythic');}
 if(u.refund&&beforeAmmo>p.ammo&&chance(.10*u.refund+p.critC*.2))p.ammo=Math.min(p.magSize,p.ammo+1);
};
const longStrike=strikeMelee;
strikeMelee=function(){const p=G.player,u=G.run.up,oldX=p.lastFlareX??p.x,oldY=p.lastFlareY??p.y,a=p.meleeAngle;longStrike();p.lastFlareX=p.x;p.lastFlareY=p.y;if(u.flareGuard)p.guardT=Math.max(p.guardT||0,.32+.14*u.flareGuard);if(u.gravityFlare)for(const e of G.enemies){if(e.dead||e.isBoss)continue;const d=Math.max(1,Math.hypot(e.x-p.x,e.y-p.y));if(d<190){e.kbx+=(p.x-e.x)/d*130*u.gravityFlare;e.kby+=(p.y-e.y)/d*130*u.gravityFlare;}}if(u.echoFlare){G.run.cardFlares=G.run.cardFlares||[];G.run.cardFlares.push({x:oldX,y:oldY,a,t:.32,rank:u.echoFlare});}if(u.mirrorSoul){let returned=0;G.ebul=G.ebul.filter(b=>{if(d2(b.x,b.y,p.x,p.y)<205**2){returned++;return false;}return true;});if(returned){nova(p.x,p.y,185,p.dmg*Math.min(6,returned*.6));cardHeal(Math.min(10,returned*2));burst(p.x,p.y,24,'#d8c4ff',220,.6,3,true);sfx('mythic');}}sfx('flare');};
const longDamage=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){if(!e||e.dead)return;const u=G.run?.up||{},p=G.player;if(e.mechanism&&u.breaker)dmg*=1+.45*u.breaker;if(kind==='shot'&&u.closeQuarters&&d2(e.x,e.y,p.x,p.y)<175**2)dmg*=1+.18*u.closeQuarters;if(p.heartfireT>0)dmg*=1+.12*(u.heartfire||0);if(u.kindleMark){if(e.cardMarkT<G.t||e.cardMarkOwner!==1)e.cardMark=0;e.cardMarkOwner=1;e.cardMarkT=G.t+2;e.cardMark=Math.min(8,(e.cardMark||0)+1);dmg*=1+e.cardMark*.025*u.kindleMark;}longDamage(e,dmg,ang,crit,kb,kind);if(crit&&!e.dead){G.run.cardCrit=(G.run.cardCrit||0)+1;if(u.critMend&&G.run.cardCrit%(10-2*u.critMend)===0)cardHeal(3*u.critMend,'MERCIFUL SPARK');if(u.shockChain){const targets=G.enemies.filter(q=>q!==e&&!q.dead&&d2(q.x,q.y,e.x,e.y)<230**2).slice(0,u.shockChain+1);for(const q of targets)longDamage(q,p.dmg*.35*u.shockChain,Math.atan2(q.y-e.y,q.x-e.x),false,.2,'storm');}if(u.supernova){G.run.superCrit=(G.run.superCrit||0)+1;if(G.run.superCrit%10===0){nova(e.x,e.y,340,p.dmg*8);burst(e.x,e.y,42,'#fff0a8',320,.9,4,true);sfx('mythic');}}}};
const longHurt=hurtPlayer;
hurtPlayer=function(dmg,sx,sy){const p=G.player,u=G.run?.up||{};if(!p)return;if(u.cauterize){const source=G.enemies.find(e=>!e.dead&&d2(e.x,e.y,sx,sy)<60**2);if(source?.burnT>0)dmg*=1-.08*u.cauterize;}dmg*=1-(p.cardArmor||0);if(G.bossActive&&u.bossWard)dmg*=1-.07*u.bossWard;if(u.radiantDebt)dmg*=1.15;if(p.cardWard>0){const used=Math.min(p.cardWard,dmg);p.cardWard-=used;dmg-=used;if(dmg<1){sfx('shield');return;}dmg=Math.max(1,Math.round(dmg));}if(p.hp-dmg<=0&&u.dawnward&&G.run.dawnwardFloor!==G.floor){G.run.dawnwardFloor=G.floor;p.hp=Math.max(1,Math.round(p.maxHp*.55));p.hitCd=4;p.dashCdT=0;p.meleeCdT=0;p.reloadT=0;p.ammo=p.magSize;nova(p.x,p.y,260,p.dmg*8);burst(p.x,p.y,48,'#fff1b0',340,1,4,true);toast('DAWNWARD','death refused · flame restored');sfx('mythic');return;}const hp=p.hp;longHurt(dmg,sx,sy);if(p.hp<hp&&u.phoenixWake){G.run.cardFields=G.run.cardFields||[];G.run.cardFields.push({x:p.x,y:p.y,t:3,tick:0,kind:'phoenix',rank:u.phoenixWake});}};
const longKill=killEnemy;
killEnemy=function(e){const was=e.dead,burning=e.burnT>0,x=e.x,y=e.y,elite=e.elite;longKill(e);if(was||!e.dead||!G.run)return;const u=G.run.up;if(elite&&u.dashReset)G.player.dashCdT=0;if(u.starfall){G.run.mythicStarKills=(G.run.mythicStarKills||0)+1;const n=elite?6:G.run.mythicStarKills%7===0?4:0;if(n){G.run.cardStrikes=G.run.cardStrikes||[];for(let i=0;i<n;i++)G.run.cardStrikes.push({x:x+rand(-90,90),y:y+rand(-90,90),t:.25+i*.18,power:elite?3:2.3});sfx('mythic');}}if(burning&&u.worldfire){for(const q of G.enemies)if(!q.dead&&d2(q.x,q.y,x,y)<190**2){q.burnT=6;q.burnRank=Math.max(q.burnRank||0,4);q.burnTick=.18;}nova(x,y,180,G.player.dmg*2.4);burst(x,y,30,'#ff8f55',260,.7,3.4,true);}};
function cardHeal(amount,label){const p=G.player,u=G.run.up,before=p.hp;p.hp=Math.min(p.maxHp,p.hp+amount);const excess=Math.max(0,before+amount-p.maxHp);if(excess&&u.overheal)p.cardWard=Math.min(p.maxHp*.35,(p.cardWard||0)+excess*(1+.5*u.overheal));if(p.hp>before){p.heartfireT=u.heartfire?4:0;addText(p.x,p.y-22,'+'+Math.round(p.hp-before),'#ffac82',13);if(label)fieldNote(label,1.5);sfx('heart');}};
const longTick=tickBlessings;
tickBlessings=function(dt){const p=G.player;if(!p){longTick(dt);return;}const u=G.run.up;longTick(dt);p.cardWard=Math.max(0,(p.cardWard||0)-dt*.7);p.heartfireT=Math.max(0,(p.heartfireT||0)-dt);if(u.lowGlow&&p.hp<p.maxHp*.4)p.hp=Math.min(p.maxHp,p.hp+dt*.32*u.lowGlow);p.pathSpeed=u.pathfinder&&G.run.floorAge<10?1+u.pathfinder*.025:1;if(u.berserk)p.shotT-=dt*(1-p.hp/p.maxHp)*.35*u.berserk;if(p.heartfireT>0)p.shotT-=dt*.12*u.heartfire;
 for(const b of G.bullets){if(b.seeking){let target=null,best=180**2;for(const e of G.enemies){const dd=d2(b.x,b.y,e.x,e.y);if(!e.dead&&dd<best){best=dd;target=e;}}if(target){const speed=Math.hypot(b.vx,b.vy),a=Math.atan2(target.y-b.y,target.x-b.x),wantX=Math.cos(a)*speed,wantY=Math.sin(a)*speed;b.vx=lerp(b.vx,wantX,b.seeking);b.vy=lerp(b.vy,wantY,b.seeking);}}if(b.emberMine&&b.life<.04&&!b.mined){b.mined=true;nova(b.x,b.y,38+12*b.emberMine,p.dmg*.22*b.emberMine);}}
 const dashed=p._cardDash&&!p.dashT;if(dashed&&u.dashBurst)nova(p.x,p.y,65+15*u.dashBurst,p.dmg*.55*u.dashBurst);p._cardDash=p.dashT>0;
 if(u.timePocket&&!p.moving)for(const b of G.ebul)if(d2(b.x,b.y,p.x,p.y)<260**2){b.vx*=Math.pow(.72,dt*u.timePocket);b.vy*=Math.pow(.72,dt*u.timePocket);}
 if(u.voidOrbit&&G.ebul.length){p.voidOrbitA=(p.voidOrbitA||0)+dt*2.1;for(let i=0;i<3;i++){const a=p.voidOrbitA+i*TAU/3,ox=p.x+Math.cos(a)*78,oy=p.y+Math.sin(a)*78,hit=G.ebul.findIndex(b=>d2(b.x,b.y,ox,oy)<25**2);if(hit>=0){G.ebul.splice(hit,1);const target=G.enemies.filter(e=>!e.dead).sort((q,r)=>d2(q.x,q.y,ox,oy)-d2(r.x,r.y,ox,oy))[0];if(target){const aim=Math.atan2(target.y-oy,target.x-ox);G.bullets.push({x:ox,y:oy,vx:Math.cos(aim)*BASE.bulletSpd,vy:Math.sin(aim)*BASE.bulletSpd,r:7,dmg:p.dmg*1.5,pierce:2,ric:0,life:1.1,hits:null,late:true,whiteStar:false,voidReturn:true});}burst(ox,oy,12,'#c49aff',170,.45,2.6,true);sfx('shield');}}}
 if(u.sunspot){p.sunspotT=(p.sunspotT||0)-dt;if(p.sunspotT<=0){p.sunspotT=7-u.sunspot;for(const e of G.enemies)if(!e.dead&&d2(e.x,e.y,p.x,p.y)<105**2)longDamage(e,p.dmg*.45*u.sunspot,Math.atan2(e.y-p.y,e.x-p.x),false,.2,'sunspot');burst(p.x,p.y,14,'#ffd36e',100,.35,2,true);}}
 if(u.endless){p.endlessT=(p.endlessT||20)-dt;if(p.endlessT<=0){p.endlessT=20;G.run.endlessStacks=(G.run.endlessStacks||0)+1;p.dmg*=1.05;p.shotInt*=.98;addText(p.x,p.y-25,'ENDLESS +5%','#ffc86c',14);burst(p.x,p.y,18,'#ffd88a',150,.45,2.5,true);sfx('mythic');}}
 if(G.run.cardFields)for(let i=G.run.cardFields.length-1;i>=0;i--){const f=G.run.cardFields[i];f.t-=dt;f.tick-=dt;if(f.tick<=0){f.tick=.25;for(const e of G.enemies)if(!e.dead&&d2(e.x,e.y,f.x,f.y)<(f.kind==='blackHole'?(f.mythicReforged?175:125):90)**2){if(f.kind==='blackHole'&&!e.isBoss){const d=Math.max(1,Math.hypot(f.x-e.x,f.y-e.y));e.kbx+=(f.x-e.x)/d*(f.mythicReforged?150:85);e.kby+=(f.y-e.y)/d*(f.mythicReforged?150:85);}longDamage(e,p.dmg*(f.kind==='blackHole'?.22:.16)*(f.rank||1),0,false,0,f.kind);}}if(f.t<=0)G.run.cardFields.splice(i,1);}
 if(G.run.cardFlares)for(let i=G.run.cardFlares.length-1;i>=0;i--){const q=G.run.cardFlares[i];q.t-=dt;if(q.t<=0){for(const e of G.enemies)if(!e.dead&&d2(e.x,e.y,q.x,q.y)<(100+15*q.rank)**2)longDamage(e,p.dmg*MELEE.damage*.45*q.rank,Math.atan2(e.y-q.y,e.x-q.x),false,.5,'echoFlare');burst(q.x,q.y,18,'#ffce83',150,.4,2.5,true);G.run.cardFlares.splice(i,1);}}
 if(G.run.cardStrikes)for(let i=G.run.cardStrikes.length-1;i>=0;i--){const q=G.run.cardStrikes[i];q.t-=dt;if(q.t<=0){nova(q.x,q.y,105,p.dmg*(q.power||1.8));burst(q.x,q.y,20,'#ffe6a0',230,.55,3,true);G.run.cardStrikes.splice(i,1);sfx('comet');}}
};
const longUpdatePicks=updatePicks;
updatePicks=function(dt){const p=G.player,hp=p?.hp||0,before=new Map(G.picks.map(o=>[o,o.kind]));longUpdatePicks(dt);if(!G.run||!p)return;const u=G.run.up,collected=[...before].filter(([o])=>!G.picks.includes(o));for(const [o,kind] of collected){if(kind==='ess'){if(u.warmPocket&&chance(.18*u.warmPocket))addEss(1);if(u.essPulse){G.run.essPulse=(G.run.essPulse||0)+1;if(G.run.essPulse%8===0)nova(p.x,p.y,105,p.dmg*.65*u.essPulse);}}if(kind==='heart'){const bonus=o.val*.25*(u.coalHeart||0);if(bonus)cardHeal(bonus);if(u.heartfire)p.heartfireT=4;}}if(p.hp>hp&&u.heartfire)p.heartfireT=4;};
