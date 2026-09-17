const ENDLESS_MUTATIONS=[
 {key:'relentless',name:'RELENTLESS',desc:'Enemies move and use their abilities faster.'},
 {key:'iron',name:'IRON PROCESSION',desc:'Enemies carry heavier bodies and more health.'},
 {key:'volatile',name:'VOLATILE DEAD',desc:'Defeated elites burst into a final projectile ring.'},
 {key:'famine',name:'THE FAMINE',desc:'Resting Flames heal less, but essence is richer.'},
 {key:'storm',name:'STAR STORM',desc:'Hostile projectiles travel faster.'},
 {key:'exposed',name:'OPEN WOUND',desc:'You and the dungeon both deal more damage.'}
];
const ENDLESS_OATHS=[
 {id:'teeth',name:'OATH OF TEETH',gift:'+20% damage',price:'Enemy hits deal +18% damage'},
 {id:'ash',name:'OATH OF ASH',gift:'+30% essence',price:'Resting Flames heal 35% less'},
 {id:'motion',name:'OATH OF MOTION',gift:'+12% speed and faster Dash',price:'Enemies move and act 10% faster'},
 {id:'glassOath',name:'OATH OF GLASS',gift:'+14% critical chance',price:'Lose 18% maximum health'},
 {id:'crowns',name:'OATH OF CROWNS',gift:'+25% damage to guardians',price:'Guardians gain 25% maximum health'},
 {id:'stars',name:'OATH OF STARS',gift:'Better Epic and Mythic odds',price:'Enemy projectiles travel 20% faster'}
];
const endlessMutation=f=>ENDLESS_MUTATIONS[Math.floor(Math.max(0,f-51)/5)%ENDLESS_MUTATIONS.length];
const oathRank=id=>Math.min(16,G.run?.endlessOaths?.[id]||0);
function endlessUI(){if(T('endlessOath'))return;const style=document.createElement('style');style.textContent=`#endlessOath{z-index:145;background:radial-gradient(circle at 50% 30%,#24172dbb,#050711f2);padding:18px;overflow:auto}.endless-shell{width:min(900px,96vw);margin:auto;text-align:center;border:1px solid #bc8ee677;background:#0b101cee;padding:26px;box-shadow:0 0 90px #8b52c022;position:relative}.endless-shell:before{content:'';position:absolute;inset:7px;border:1px solid #d1adff22;pointer-events:none}.endless-kicker{font:10px system-ui;letter-spacing:.32em;color:#b998d2}.endless-shell h2{font:clamp(27px,5vw,45px) Georgia;color:#ead7ff;margin:12px}.endless-shell>p{color:#aeb6c9;font:13px/1.7 system-ui}.oath-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:24px 0 14px}.oath-card{min-height:210px;color:#ded9e9;border:1px solid #8869a9;background:linear-gradient(155deg,#171426,#0b101b);padding:20px 14px;cursor:pointer;transition:.18s transform,.18s border-color}.oath-card:hover,.oath-card:focus{transform:translateY(-4px);border-color:#e5c5ff;outline:none}.oath-card strong{display:block;font:18px Georgia;color:#f0dfff;margin:22px 0}.oath-card span,.oath-card small{display:block;font:12px/1.55 system-ui}.oath-card span{color:#a8e5c8}.oath-card small{color:#e39da8;margin-top:12px}.endless-mutation{color:#d0a9ed!important}#endlessRecord{color:#d8b8ee;border:1px solid #8c6ca166;padding:7px 13px;margin-top:8px;font:10px system-ui;letter-spacing:.1em}@media(max-width:700px){.oath-grid{grid-template-columns:1fr}.oath-card{min-height:130px}}`;document.head.appendChild(style);const panel=document.createElement('div');panel.id='endlessOath';panel.className='ov';panel.innerHTML=`<div class="endless-shell"><div class="endless-kicker">ENDLESS DESCENT · BINDING CHOICE</div><h2>Choose an Oath</h2><p>The deeper path gives something and takes something. Oaths stack and last until this descent ends.</p><p class="endless-mutation" id="endlessMutation"></p><div class="oath-grid" id="oathGrid"></div></div>`;document.body.appendChild(panel);}
endlessUI();
function endlessOathChoices(milestone){const start=Math.floor((milestone-51)/10)%ENDLESS_OATHS.length;return[ENDLESS_OATHS[start],ENDLESS_OATHS[(start+2)%6],ENDLESS_OATHS[(start+4)%6]];}
function offerEndlessOath(milestone){if(!G.run?.infinite||G.run.endlessOathChosen?.includes(milestone))return;G.run.endlessOathPending=milestone;G.run.endlessOaths=G.run.endlessOaths||{};G.run.endlessOathChosen=G.run.endlessOathChosen||[];hide('pause');setState('paused');const m=endlessMutation(G.floor);T('endlessMutation').textContent=G.floor+' · '+m.name+' — '+m.desc;const grid=T('oathGrid');grid.replaceChildren();for(const oath of endlessOathChoices(milestone)){const b=document.createElement('button');b.className='oath-card';b.innerHTML=`<em>◆</em><strong>${oath.name}</strong><span>${oath.gift}</span><small>${oath.price}</small>`;on(b,'click',()=>chooseEndlessOath(oath.id));grid.appendChild(b);}show('endlessOath');grid.firstChild?.focus({preventScroll:true});saveNow();}
function chooseEndlessOath(id){const run=G.run,oath=ENDLESS_OATHS.find(o=>o.id===id);if(!run?.infinite||!oath||!run.endlessOathPending)return;run.endlessOaths=run.endlessOaths||{};run.endlessOaths[id]=(run.endlessOaths[id]||0)+1;run.endlessOathChosen=run.endlessOathChosen||[];run.endlessOathChosen.push(run.endlessOathPending);run.endlessOathPending=0;hide('endlessOath');recalc();setState('playing');G.player.hitCd=Math.max(G.player.hitCd,1);toast(oath.name,oath.gift.toLowerCase()+' · '+oath.price.toLowerCase());sfx('mythic');saveNow();}
function remixEndlessFloor(){if(!G.run?.infinite||G.floor<=50||!G.world)return;const f=G.floor,depth=f-50,mutation=endlessMutation(f),region=lateRegion(f),ri=LATE_REGIONS.indexOf(region),next=LATE_REGIONS[(ri+1)%LATE_REGIONS.length],mix=LATE_ROSTERS[next.key],candidates=G.enemies.filter(e=>!e.isBoss&&!e.mechanism);for(let i=0;i<candidates.length;i++)if(i%3===1){const old=candidates[i],type=mix[(i+depth)%mix.length],replacement=spawnEnemy(type,old.x,old.y,old.elite);old.dead=true;replacement.aggro=old.aggro;}
 const gradualHp=Math.pow(1.012,depth-1),gradualDmg=Math.pow(1.006,depth-1);for(const e of G.enemies){if(e.dead||e.endlessScaled)continue;e.endlessScaled=true;e.max=Math.round(e.max*gradualHp);e.hp=e.max;e.dmg=Math.max(1,Math.round(e.dmg*gradualDmg));if(mutation.key==='relentless'){e.spd*=1.08;e.specialCd=(e.specialCd||2)*.82;}if(mutation.key==='iron'){e.max=Math.round(e.max*1.18);e.hp=e.max;}if(oathRank('motion')){e.spd*=1+.1*oathRank('motion');e.specialCd=(e.specialCd||2)*Math.pow(.9,oathRank('motion'));}if(e.isBoss&&oathRank('crowns')){e.max=Math.round(e.max*(1+.25*oathRank('crowns')));e.hp=e.max;}}
 G.world.endlessMutation=mutation.key;G.world.endlessDepth=depth;save.bestEndless=Math.max(save.bestEndless||0,depth);markSave();
}
const endlessSetup=setupFloor;
setupFloor=function(f){endlessSetup(f);if(G.run?.infinite&&f>50){remixEndlessFloor();if((f-51)%10===0&&!G.run.endlessOathChosen?.includes(f))offerEndlessOath(f);updateHUD(0);saveNow();}};
const endlessEnter=enterInfinite;
enterInfinite=function(){endlessEnter();if(G.run?.infinite){G.run.endlessOaths=G.run.endlessOaths||{};G.run.endlessOathChosen=G.run.endlessOathChosen||[];if(!G.run.endlessOathChosen.includes(51))offerEndlessOath(51);}};
const endlessResume=resumeRun;
resumeRun=function(){endlessResume();if(G.run?.infinite){G.world.endlessMutation=endlessMutation(G.floor).key;G.world.endlessDepth=G.floor-50;if(G.run.endlessOathPending)offerEndlessOath(G.run.endlessOathPending);}};
const endlessRecalc=recalc;
recalc=function(){endlessRecalc();if(!G.player||!G.run?.infinite)return;const p=G.player;p.dmg*=Math.pow(1.2,oathRank('teeth'));p.speed*=Math.pow(1.12,oathRank('motion'));p.dashCd*=Math.pow(.9,oathRank('motion'));p.maxHp=Math.max(20,Math.round(p.maxHp*Math.pow(.82,oathRank('glassOath'))));p.hp=Math.min(p.hp,p.maxHp);p.critC+=.14*oathRank('glassOath');};
const endlessDamage=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){if(G.run?.infinite){if(e.isBoss)dmg*=Math.pow(1.25,oathRank('crowns'));if(endlessMutation(G.floor).key==='exposed')dmg*=1.15;}endlessDamage(e,dmg,ang,crit,kb,kind);};
const endlessHurt=hurtPlayer;
hurtPlayer=function(dmg,sx,sy){if(G.run?.infinite){dmg*=Math.pow(1.18,oathRank('teeth'));if(endlessMutation(G.floor).key==='exposed')dmg*=1.2;}endlessHurt(dmg,sx,sy);};
const endlessShoot=enemyShoot;
enemyShoot=function(e,ang,spd,dmg){if(G.run?.infinite){if(endlessMutation(G.floor).key==='storm')spd*=1.18;spd*=Math.pow(1.2,oathRank('stars'));}return endlessShoot(e,ang,spd,dmg);};
const endlessAuthoredBoss=authoredBossAI;
authoredBossAI=function(b,dt,d,dx,dy){const haste=G.run?.infinite?(endlessMutation(G.floor).key==='relentless'?1.12:1)*Math.pow(1.1,oathRank('motion')):1;return endlessAuthoredBoss(b,dt*haste,d,dx,dy);};
colossusAI=astronomerAI=scribeAI=regentAI=seraphAI=tyrantAI=keeperAI=authoredBossAI;
const endlessBellkeeper=bellkeeperAI;
bellkeeperAI=function(b,dt,d,dx,dy){const haste=G.run?.infinite?(endlessMutation(G.floor).key==='relentless'?1.12:1)*Math.pow(1.1,oathRank('motion')):1;return endlessBellkeeper(b,dt*haste,d,dx,dy);};
const endlessEss=addEss;
addEss=function(v){if(G.run?.infinite){v*=Math.pow(1.3,oathRank('ash'));if(endlessMutation(G.floor).key==='famine')v*=1.25;v=Math.max(1,Math.round(v));}return endlessEss(v);};
const endlessOdds=rarityOdds;
rarityOdds=function(){const o=endlessOdds();if(!G.run?.infinite||!oathRank('stars'))return o;const shift=Math.min(o[0]-.1,.055*oathRank('stars'));o[0]-=shift;o[2]+=shift*.58;o[3]+=shift*.42;return o;};
const endlessUseFlame=useRestingFlame;
useRestingFlame=function(o){if(!G.run?.infinite||o.lit){endlessUseFlame(o);return;}o.lit=true;const base=bossFloorAt(G.floor)?.28:.22,penalty=Math.pow(.65,oathRank('ash'))*(endlessMutation(G.floor).key==='famine'?.55:1),heal=Math.max(1,Math.ceil(G.player.maxHp*base*penalty));cardHeal(heal,'RESTING FLAME · '+heal+' HEALTH');G.world.torches.push({x:o.x,y:o.y-15,s:0});burst(o.x,o.y,24,'#ffd083',145,1,3,true);sfx('brazier');saveNow();};
const endlessKill=killEnemy;
killEnemy=function(e){const burstElite=G.run?.infinite&&endlessMutation(G.floor).key==='volatile'&&e.elite&&!e.dead,x=e.x,y=e.y,dmg=e.dmg;endlessKill(e);if(burstElite&&e.dead&&G.state==='playing'){for(let i=0;i<8;i++){const a=i*TAU/8;G.ebul.push({x,y,vx:Math.cos(a)*175,vy:Math.sin(a)*175,r:5,dmg:Math.max(1,Math.round(dmg*.28)),life:2.4,lateColor:'#d18aff'});}sfx('eshoot');}};
const endlessHUD=updateHUD;
updateHUD=function(dt){endlessHUD(dt);if(!G.run?.infinite||G.floor<=50)return;const m=endlessMutation(G.floor),depth=G.floor-50,oaths=Object.values(G.run.endlessOaths||{}).reduce((a,b)=>a+b,0);setTxt('floorObjective','ENDLESS '+depth+' · '+m.name+(oaths?' · '+oaths+' OATH'+(oaths===1?'':'S'):''));};
const endlessFloorName=floorName;
floorName=function(f){return f>50?'Endless '+(f-50)+' · '+depthFloorName(11+(f-51)%40):endlessFloorName(f);};
const endlessSave=validateSave;
validateSave=function(raw){const clean=endlessSave(raw);clean.bestEndless=Number.isInteger(raw.bestEndless)&&raw.bestEndless>=0?Math.min(raw.bestEndless,999999):0;return clean;};
const endlessMenu=refreshMenuStats;
refreshMenuStats=function(){endlessMenu();let badge=T('endlessRecord');if(!badge){badge=document.createElement('div');badge.id='endlessRecord';badge.className='menu-record';T('campaignMedal')?.after(badge);}if(badge){badge.hidden=!(save.bestEndless>0);badge.textContent='ENDLESS RECORD · DEPTH '+(save.bestEndless||0);}};
