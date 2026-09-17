const MASTERY_COSTS=[10,25,60,140,300,600,1200,2200,4000,7000,11000,16000];
const MASTERY_BRANCHES=[
 {key:'m',name:'EMBERCRAFT',color:'#ff9b62',icon:'sw',v:[47,0],ids:Array.from({length:12},(_,i)=>'m'+(i+1)),nodes:[
  ['Kindled Force','+4% damage to Ember Bolt and Flare.',{dmg:.04}],
  ['Hotter Core','+4% damage to Ember Bolt and Flare.',{dmg:.04}],
  ['Steady Hand','+5% damage to Ember Bolt and Flare.',{dmg:.05}],
  ['Flare Temper','+10% Flare damage.',{flare:.10}],
  ['Bright Iron','+6% damage to Ember Bolt and Flare.',{dmg:.06}],
  ['Guardian’s Mark','+8% damage to guardians.',{boss:.08}],
  ['White Heat','+8% damage to Ember Bolt and Flare.',{dmg:.08}],
  ['Furnace Pulse','Every twelfth Ember Bolt carries a small star nova.',{boltNovaEvery:12}],
  ['Deep Burn','Ember Bolt applies a weak lasting burn.',{brand:1}],
  ['Star Pressure','+12% damage to guardians.',{boss:.12}],
  ['Living Furnace','+10% damage to Ember Bolt and Flare.',{dmg:.10}],
  ['Sun in the Hand','Every eighth Ember Bolt erupts; Flare always releases a light crescent.',{boltNovaEvery:8,flareWave:true}]
 ]},
 {key:'v',name:'HEARTH',color:'#ff7d98',icon:'hp',v:[-47,0],ids:['v1','v2','v3','v4','v5','v6','v7','v8','v9','v10','v11','wind'],nodes:[
  ['Banked Warmth','+10 maximum health.',{hp:10}],
  ['Thicker Flame','+10 maximum health.',{hp:10}],
  ['Held Spark','+12 maximum health.',{hp:12}],
  ['Ember Skin','Take 3% less damage.',{armor:.03}],
  ['Deep Hearth','+15 maximum health.',{hp:15}],
  ['Warm Threshold','Descending restores an additional 4% health.',{floorHeal:.04}],
  ['Refusing Dark','+20 maximum health.',{hp:20}],
  ['Cinder Shell','Take 4% less damage.',{armor:.04}],
  ['Patient Coal','Regenerate 0.12 health each second.',{regen:.12}],
  ['Old Fire','+30 maximum health.',{hp:30}],
  ['Homeward Heat','Descending restores an additional 6% health.',{floorHeal:.06}],
  ['Second Wind','Once per run, refuse death and return at half health.',{revive:true}]
 ]},
 {key:'f',name:'FOCUS',color:'#72d7ff',icon:'fr',v:[0,-38],ids:Array.from({length:12},(_,i)=>'f'+(i+1)),nodes:[
  ['Quick Thought','+3% Ember Bolt casting rate.',{rate:.03}],
  ['Short Breath','Rekindle 5% faster.',{reload:.05}],
  ['Clear Motion','+3% Ember Bolt casting rate.',{rate:.03}],
  ['Spare Charge','Hold one additional Ember Bolt charge.',{charges:1}],
  ['Practiced Sigil','+4% Ember Bolt casting rate.',{rate:.04}],
  ['Even Breathing','Rekindle 7% faster.',{reload:.07}],
  ['Fast Hands','+5% Ember Bolt casting rate.',{rate:.05}],
  ['Deep Well','Hold one additional Ember Bolt charge.',{charges:1}],
  ['Kindled Guard','Beginning Rekindle grants a brief ward.',{rekindleWard:1}],
  ['No Hesitation','+6% Ember Bolt casting rate.',{rate:.06}],
  ['One Breath','Rekindle 10% faster.',{reload:.10}],
  ['Perfect Recall','Hold two more charges; finishing Rekindle releases a pulse.',{charges:2,overcharge:1}]
 ]},
 {key:'g',name:'LODESTONE',color:'#8ce8d4',icon:'mg',v:[0,38],ids:Array.from({length:12},(_,i)=>'g'+(i+1)),nodes:[
  ['Soft Pull','+12% pickup reach.',{mag:.12}],
  ['Longer Reach','+12% pickup reach.',{mag:.12}],
  ['Open Hand','+15% pickup reach.',{mag:.15}],
  ['Lessons Kept','+4% run XP.',{xp:.04}],
  ['Wide Orbit','+20% pickup reach.',{mag:.20}],
  ['Violet Thread','+5% essence gained.',{ess:.05}],
  ['First Satellite','Begin every descent with one orbiting cinder.',{orbit:1}],
  ['Fast Learner','+6% run XP.',{xp:.06}],
  ['Roomwide Pull','+30% pickup reach.',{mag:.30}],
  ['Essence Current','+8% essence gained.',{ess:.08}],
  ['Second Satellite','Begin every descent with another orbiting cinder.',{orbit:1}],
  ['Little Constellation','Begin every descent with a third orbiting cinder.',{orbit:1}]
 ]},
 {key:'c',name:'ARCANE EYE',color:'#f0d98b',icon:'ey',v:[39,-34],ids:Array.from({length:12},(_,i)=>'c'+(i+1)),nodes:[
  ['Sharp Glint','+1.5% critical chance.',{crit:.015}],
  ['Patient Aim','+1.5% critical chance.',{crit:.015}],
  ['Needle Light','Ember Bolt pierces one additional target.',{pierce:1}],
  ['Read the Motion','+2% critical chance.',{crit:.02}],
  ['Hard Spark','Critical hits deal 10% more critical damage.',{critPower:.10}],
  ['Unblinking','+2.5% critical chance.',{crit:.025}],
  ['Through the Crowd','Ember Bolt pierces one additional target.',{pierce:1}],
  ['Exacting Light','Critical hits deal 15% more critical damage.',{critPower:.15}],
  ['Fault Finder','+3% critical chance.',{crit:.03}],
  ['Guardian Anatomy','+6% damage to guardians.',{boss:.06}],
  ['Last Detail','+3.5% critical chance.',{crit:.035}],
  ['The Open Eye','Critical hits release a small nova, with a short cooldown.',{critNova:true}]
 ]},
 {key:'s',name:'CELERITY',color:'#70e0b1',icon:'bt',v:[-39,-34],ids:Array.from({length:12},(_,i)=>'s'+(i+1)),nodes:[
  ['Light Step','+2.5% movement speed.',{speed:.025}],
  ['Loose Ash','+2.5% movement speed.',{speed:.025}],
  ['Quick Turn','+3% movement speed.',{speed:.03}],
  ['Long Stride','+3% movement speed.',{speed:.03}],
  ['No Footfall','+3.5% movement speed.',{speed:.035}],
  ['Passing Wind','+3.5% movement speed.',{speed:.035}],
  ['Corner Cut','+4% movement speed.',{speed:.04}],
  ['Running Flame','+4% movement speed.',{speed:.04}],
  ['Uncaught','+4.5% movement speed.',{speed:.045}],
  ['Faster Than Fear','+4.5% movement speed.',{speed:.045}],
  ['Cinder Gale','+5% movement speed.',{speed:.05}],
  ['Weightless','+5% movement speed and stronger knockback resistance.',{speed:.05,steady:true}]
 ]},
 {key:'d',name:'PHANTOM STEP',color:'#aab6ff',icon:'ft',v:[39,34],ids:Array.from({length:12},(_,i)=>'d'+(i+1)),nodes:[
  ['Short Return','Dash recovers 5% faster.',{dash:.05}],
  ['Second Footprint','Dash recovers 5% faster.',{dash:.05}],
  ['Long Vanish','Dash travels 6% faster.',{dashSpeed:.06}],
  ['Thin Air','Dash lasts 0.02 seconds longer.',{dashIFrame:.02}],
  ['Wake of Ash','Dash leaves a weak damaging ember trail.',{dashTrail:1}],
  ['Quick Return','Dash recovers 6% faster.',{dash:.06}],
  ['Longer Vanish','Dash travels 8% faster.',{dashSpeed:.08}],
  ['Burning Wake','The ember trail deals more damage.',{dashTrail:1}],
  ['Between Blinks','Dash lasts 0.02 seconds longer.',{dashIFrame:.02}],
  ['Nearer Again','Dash recovers 8% faster.',{dash:.08}],
  ['Gone Before Impact','Dash travels 10% faster.',{dashSpeed:.10}],
  ['Ashen Passage','Dash leaves a broad burning trail and recovers 8% faster.',{dashTrail:1,dash:.08}]
 ]},
 {key:'a',name:'FORTUNE',color:'#d7a5ff',icon:'gm',v:[-39,34],ids:Array.from({length:12},(_,i)=>'a'+(i+1)),nodes:[
  ['Greed I','+5% run XP.',{xp:.05}],
  ['Fortune I','+5% essence gained.',{ess:.05}],
  ['Marked Cards','Slightly better blessing rarity.',{rarity:.015}],
  ['Greed II','+7% run XP.',{xp:.07}],
  ['Fortune II','+8% essence gained.',{ess:.08}],
  ['Loaded Draw','Better blessing rarity.',{rarity:.02}],
  ['Greed III','+10% run XP.',{xp:.10}],
  ['Fortune III','+10% essence gained.',{ess:.10}],
  ['Cut Deck','Better blessing rarity.',{rarity:.025}],
  ['Fortune IV','+12% essence gained.',{ess:.12}],
  ['Golden Draw','Greatly improved blessing rarity.',{rarity:.03}],
  ['House of Stars','Improved blessing rarity and +5% essence gained.',{rarity:.04,ess:.05}]
 ]}
];

const MASTERY_SHAPE=[
 {radius:80, turn:0,    parents:[]},
 {radius:145,turn:-.16, parents:[0]},
 {radius:175,turn:.16,  parents:[0]},
 {radius:220,turn:-.24, parents:[1]},
 {radius:270,turn:-.08, parents:[1]},
 {radius:240,turn:.08,  parents:[2]},
 {radius:285,turn:.24,  parents:[2]},
 {radius:315,turn:-.255,parents:[3]},
 {radius:355,turn:-.085,parents:[4]},
 {radius:325,turn:.085, parents:[5]},
 {radius:365,turn:.255, parents:[6]},
 {radius:430,turn:0,    parents:[7,8,9,10]}
];
const MASSIVE_TREE=[{id:'awaken',L:'A',x:620,y:490,r:27,cost:5,req:null,reqs:[],name:'Awakening',desc:'Open your eyes in the dark. +5% damage and +10 maximum health.',branch:'CORE',tier:0,color:'#f0c979',icon:'st',fx:{dmg:.05,hp:10}}];
for(const branch of MASTERY_BRANCHES){
 const angle=Math.atan2(branch.v[1],branch.v[0]);
 for(let i=0;i<12;i++){
  const id=branch.ids[i],entry=branch.nodes[i],tier=i+1,shape=MASTERY_SHAPE[i],a=angle+shape.turn;
  const reqs=shape.parents.length?shape.parents.map(p=>branch.ids[p]):['awaken'];
  MASSIVE_TREE.push({id,L:branch.key.toUpperCase(),x:Math.round(620+Math.cos(a)*shape.radius),y:Math.round(490+Math.sin(a)*shape.radius),r:tier===12?21:tier%4===0?17:13,cost:MASTERY_COSTS[i],req:reqs[0],reqs,name:entry[0],desc:entry[1],fx:entry[2],branch:branch.name,tier,color:branch.color,icon:branch.icon,turn:shape.turn});
 }
}
TREE_NODES.splice(0,TREE_NODES.length,...MASSIVE_TREE);
for(const id of Object.keys(NODE_BY_ID))delete NODE_BY_ID[id];
for(const n of TREE_NODES)NODE_BY_ID[n.id]=n;
BRANCH_ENDS.splice(0,BRANCH_ENDS.length,...MASTERY_BRANCHES.map(b=>({id:b.ids[11],t:b.name,dx:0,dy:0})));
let MASTERY_TOTAL=TREE_NODES.reduce((sum,n)=>sum+n.cost,0);
const masteryParents=n=>(n.reqs?.length?n.reqs:n.req?[n.req]:[]).map(id=>NODE_BY_ID[id]).filter(Boolean);
nodeState=function(n){if(save.nodes[n.id])return 2;if(masteryParents(n).some(p=>!save.nodes[p.id]))return 0;return save.essence>=n.cost?3:1;};

computeMeta=function(){
 const m={dmg:1,hp:0,rate:1,speed:1,crit:0,mag:1,dash:1,xp:1,ess:1,revive:false,reload:1,charges:0,armor:0,floorHeal:0,regen:0,boss:1,flare:1,flareReach:0,flareCd:1,pierce:0,orbit:0,rarity:0,critPower:0,dashSpeed:1,dashIFrame:0,dashTrail:0,rekindleWard:0,overcharge:0,brand:0,boltNovaEvery:0,flareWave:false,critNova:false,steady:false};
 for(const n of TREE_NODES){if(!save.nodes[n.id])continue;for(const [key,val] of Object.entries(n.fx||{})){
   if(['dash','reload','flareCd'].includes(key))m[key]*=1-val;
   else if(['dmg','hp','rate','speed','crit','mag','xp','ess','armor','floorHeal','regen','charges','flareReach','pierce','orbit','rarity','critPower','dashIFrame','dashTrail','rekindleWard','overcharge','brand'].includes(key))m[key]+=val;
   else if(['boss','flare','dashSpeed'].includes(key))m[key]+=val;
   else if(key==='boltNovaEvery')m.boltNovaEvery=m.boltNovaEvery?Math.min(m.boltNovaEvery,val):val;
   else m[key]=m[key]||val;
  }}
 return m;
};

const beforeMasteryInitCombat=initCombat;
initCombat=function(){
 beforeMasteryInitCombat();if(!G.player||!G.run)return;const p=G.player,u=G.run.up||{};
 p.magSize=6+2*(u.magazine||0)+(u.reserve||0)+Math.round(META.charges||0);
 p.reloadDuration=1.65*Math.pow(.82,u.quickload||0)*(META.reload||1);
 p.ammo=Math.min(p.ammo??p.magSize,p.magSize);
};
const beforeMasteryRecalc=recalc;
recalc=function(){beforeMasteryRecalc();if(!G.player||!G.run)return;const p=G.player;p.pierce+=META.pierce||0;p.regen+=META.regen||0;p.orbN+=META.orbit||0;MELEE.damage=2.25*(META.flare||1);p.flareReach=(p.flareReach||66)+(META.flareReach||0);MELEE.reach=p.flareReach;MELEE.cooldown=.92*(META.flareCd||1);p.metaArmor=META.armor||0;};
const beforeMasteryDamageEnemy=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
 if(!e||e.dead)return;if(e.isBoss)dmg*=META.boss||1;if(crit&&META.critPower)dmg*=(2+META.critPower)/2;
 const live=!e.dead;beforeMasteryDamageEnemy(e,dmg,ang,crit,kb,kind);
 if(live&&!e.dead&&kind==='shot'&&META.brand){e.burnT=Math.max(e.burnT||0,2.2);e.burnRank=Math.max(e.burnRank||0,META.brand);e.burnTick=Math.min(e.burnTick||.45,.45);}
 if(live&&crit&&META.critNova&&G.run&&(G.run.metaCritNovaT||0)<=G.t){G.run.metaCritNovaT=G.t+.7;nova(e.x,e.y,72,G.player.dmg*.35);}
};
const beforeMasteryHurtPlayer=hurtPlayer;
hurtPlayer=function(dmg,sx,sy){
 const p=G.player,hp=p?.hp,reduced=Math.max(1,Math.round(dmg*(1-(META.armor||0))));
 beforeMasteryHurtPlayer(reduced,sx,sy);
 if(p&&p.hp<hp&&META.steady){p.kbx*=.7;p.kby*=.7;}
};
const beforeMasteryFireVolley=fireVolley;
fireVolley=function(){const start=G.bullets.length,ammo=G.player?.ammo;beforeMasteryFireVolley();if(!G.player||G.bullets.length===start||G.player.ammo===ammo)return;if(META.boltNovaEvery){G.player.metaCasts=(G.player.metaCasts||0)+1;if(G.player.metaCasts%META.boltNovaEvery===0){for(const b of G.bullets.slice(start)){b.whiteStar=true;b.r=Math.max(b.r,7);}}}};
const beforeMasteryStrikeMelee=strikeMelee;
strikeMelee=function(){const p=G.player,start=G.bullets.length,a=p.meleeAngle;beforeMasteryStrikeMelee();if(META.flareWave&&!G.run.up.bladeEcho&&G.bullets.length===start){const damage=p.dmg*MELEE.damage;G.bullets.push({x:p.x+Math.cos(a)*20,y:p.y+Math.sin(a)*20,vx:Math.cos(a)*420,vy:Math.sin(a)*420,r:12,dmg:damage*.48,pierce:10,ric:0,life:.55,hits:null,melee:true,late:true,burn:0,blast:0,fork:0,whiteStar:false});}};
const beforeMasteryTickBlessings=tickBlessings;
tickBlessings=function(dt){const p=G.player;if(!p){beforeMasteryTickBlessings(dt);return;}const was=p._masteryReload||false;beforeMasteryTickBlessings(dt);if(p.reloadT>0&&!was&&META.rekindleWard)p.guardT=Math.max(p.guardT||0,.55);if(was&&p.reloadT===0&&META.overcharge)nova(p.x,p.y,105,p.dmg*1.3);p._masteryReload=p.reloadT>0;};
const beforeMasteryDescend=descend;
descend=function(){const p=G.player,extra=p&&META.floorHeal?Math.round(p.maxHp*META.floorHeal):0;beforeMasteryDescend();if(p&&extra)p.hp=Math.min(p.maxHp,p.hp+extra);};
const beforeMasteryResume=resumeRun;
resumeRun=function(){beforeMasteryResume();if(G.run){META=computeMeta();recalc();updateHUD(0);}};

const beforeMasteryRarityOdds=rarityOdds;
rarityOdds=function(){const o=beforeMasteryRarityOdds(),luck=META.rarity||0,shift=Math.min(o[0]-.18,luck);if(shift>0){o[0]-=shift;o[1]+=shift*.28;o[2]+=shift*.48;o[3]+=shift*.24;}return o;};

const beforeMasteryRefreshTreeEss=refreshTreeEss;
refreshTreeEss=function(){beforeMasteryRefreshTreeEss();const owned=TREE_NODES.filter(n=>save.nodes[n.id]).length,el=T('treeMastery');if(el)el.textContent=owned+' / '+TREE_NODES.length+' SIGILS';const bar=T('treeMasteryFill');if(bar)bar.style.width=(owned/TREE_NODES.length*100)+'%';};
const beforeMasterySelectNode=selectNode;
selectNode=function(n){beforeMasterySelectNode(n);const eye=document.querySelector('.tree-inspector .eyebrow');if(eye)eye.textContent=(n.branch||'CORE')+(n.tier?' · TIER '+n.tier:'');const m=computeMeta(),owned=TREE_NODES.filter(q=>save.nodes[q.id]).length,remaining=TREE_NODES.reduce((sum,q)=>sum+(save.nodes[q.id]?0:q.cost),0);T('metaTotal').innerHTML=`NEXT DESCENT<br><b>+${Math.round((m.dmg-1)*100)}%</b> damage · <b>+${m.hp}</b> health<br><b>+${Math.round((m.rate-1)*100)}%</b> cast rate · <b>+${Math.round((m.speed-1)*100)}%</b> speed<br><b>+${Math.round((m.ess-1)*100)}%</b> essence · <b>+${Math.round((m.xp-1)*100)}%</b> run XP<br><span>${owned} / ${TREE_NODES.length} sigils · ◆ ${fmt(remaining)} remaining</span><small>Typical full clear: about ◆ 10,500 before tree bonuses.</small>`;refreshTreeEss();};

drawTree=function(t){
 if(!treeCtx){const cv=T('treeCv'),d=Math.min(devicePixelRatio||1,2);cv.width=Math.round(1240*d);cv.height=Math.round(980*d);cv.style.width='1240px';cv.style.height='980px';treeCtx=cv.getContext('2d');treeCtx.setTransform(d,0,0,d,0,0);}
 const x=treeCtx;x.clearRect(0,0,1240,980);x.imageSmoothingEnabled=false;x.fillStyle='#070b12';x.fillRect(0,0,1240,980);
 const bg=x.createRadialGradient(620,490,20,620,490,610);bg.addColorStop(0,'#17202d');bg.addColorStop(.48,'#0b111b');bg.addColorStop(1,'#05080e');x.fillStyle=bg;x.fillRect(0,0,1240,980);
 x.globalAlpha=.24;for(let i=0;i<170;i++){const px=(i*613)%1220+10,py=(i*347)%960+10,s=i%11===0?2:1;x.fillStyle=i%7===0?'#e9ca83':'#75869c';x.fillRect(px,py,s,s);}x.globalAlpha=1;
 x.save();x.translate(620,490);for(let r=92;r<560;r+=92){x.strokeStyle='rgba(135,154,185,'+(r%184===0?.12:.055)+')';x.lineWidth=1;x.setLineDash([2,12]);x.beginPath();x.arc(0,0,r,0,TAU);x.stroke();}x.setLineDash([]);x.restore();
 for(const b of MASTERY_BRANCHES){for(const path of [[0,1,4,8,11],[0,2,5,9,11]]){const pts=[{x:620,y:490},...path.map(i=>NODE_BY_ID[b.ids[i]])];x.strokeStyle=b.color+'12';x.lineWidth=28;x.lineCap='round';x.beginPath();x.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length-1;i++){const q=pts[i],n=pts[i+1];x.quadraticCurveTo(q.x,q.y,(q.x+n.x)/2,(q.y+n.y)/2);}x.lineTo(pts.at(-1).x,pts.at(-1).y);x.stroke();}}
 for(const n of TREE_NODES){for(const p of masteryParents(n)){const owned=save.nodes[n.id]&&save.nodes[p.id],open=save.nodes[p.id],c=n.color||'#e8c476',dx=n.x-p.x,dy=n.y-p.y,len=Math.max(1,Math.hypot(dx,dy)),curl=(n.turn||0)*34+(n.tier%2?5:-5),px=-dy/len,py=dx/len,c1x=p.x+dx*.34+px*curl,c1y=p.y+dy*.34+py*curl,c2x=p.x+dx*.68+px*curl,c2y=p.y+dy*.68+py*curl;x.beginPath();x.moveTo(p.x,p.y);x.bezierCurveTo(c1x,c1y,c2x,c2y,n.x,n.y);x.strokeStyle=owned?c:open?c+'78':'#55627338';x.lineWidth=owned?3:1.5;x.setLineDash(owned?[]:open?[5,5]:[2,7]);x.lineDashOffset=-t*18;x.shadowColor=owned?c:'transparent';x.shadowBlur=owned?8:0;x.stroke();x.shadowBlur=0;x.setLineDash([]);if(open&&!save.nodes[n.id]){const u=(t*.35+n.tier*.08)%1,iv=1-u,bx=iv*iv*iv*p.x+3*iv*iv*u*c1x+3*iv*u*u*c2x+u*u*u*n.x,by=iv*iv*iv*p.y+3*iv*iv*u*c1y+3*iv*u*u*c2y+u*u*u*n.y;x.fillStyle=c;x.globalAlpha=.35+.35*Math.sin(t*4);x.fillRect(bx-2,by-2,4,4);x.globalAlpha=1;}}}
 for(const b of MASTERY_BRANCHES){
  const end=NODE_BY_ID[b.ids[11]],dx=b.v[0],dy=b.v[1],len=Math.hypot(dx,dy),nx=dx/len,ny=dy/len;
  let lx=end.x+nx*72,ly=end.y+ny*72;
  x.font='800 12px system-ui';x.textAlign='center';x.textBaseline='middle';const tw=x.measureText(b.name).width+18;
  lx=clamp(lx,tw/2+8,1240-tw/2-8);ly=clamp(ly,14,966);
  x.fillStyle='#070b12e8';x.fillRect(lx-tw/2,ly-9,tw,18);x.strokeStyle=b.color+'88';x.strokeRect(lx-tw/2+.5,ly-8.5,tw-1,17);x.fillStyle=b.color;x.fillText(b.name,lx,ly+.5);
 }
 for(const n of TREE_NODES){const st=nodeState(n),R=n.r||13,c=n.color||'#f0c979',selected=n===treeHover;x.save();x.translate(n.x,n.y);if(st===2||st===3){x.shadowColor=c;x.shadowBlur=st===2?12:8+Math.sin(t*4+n.x)*3;}x.rotate(Math.PI/4);x.fillStyle=st===2?c:st===3?'#142333':st===1?'#111926':'#080c14';x.fillRect(-R,-R,R*2,R*2);x.shadowBlur=0;x.strokeStyle=st===2?'#fff3c8':st===3?c:st===1?c+'88':'#536174';x.lineWidth=selected?3:st===2?2.2:1.5;x.strokeRect(-R+.5,-R+.5,R*2-1,R*2-1);x.strokeStyle=st===2?'#5b3b19':c+'38';x.lineWidth=1;x.strokeRect(-R*.66,-R*.66,R*1.32,R*1.32);x.restore();const icon=iconImg(n.icon||'st',st===2?'#211508':st===3?c:st===1?'#aebdca':'#536174'),isz=R*1.05;x.drawImage(icon,n.x-isz/2,n.y-isz/2,isz,isz);if(n.tier&&n.tier%4===0){x.strokeStyle=st===2?c:c+'55';x.lineWidth=1;x.beginPath();x.arc(n.x,n.y,R+5,0,TAU);x.stroke();}if(st===0){const lk=iconImg('lk','#536174');x.drawImage(lk,n.x+R*.32,n.y+R*.25,10,10);}if(st===3||selected&&st!==2){const label='◆ '+fmt(n.cost);x.font='800 9px system-ui';x.textAlign='center';x.textBaseline='middle';const vx=n.x-620,vy=n.y-490,vl=Math.max(1,Math.hypot(vx,vy)),px=n.x+vx/vl*(R+13),py=n.y+vy/vl*(R+13),tw=x.measureText(label).width+9;x.fillStyle='#090d16e8';x.fillRect(px-tw/2,py-7,tw,14);x.strokeStyle=c+'88';x.strokeRect(px-tw/2+.5,py-6.5,tw-1,13);x.fillStyle=st===3?c:'#a9b4c2';x.fillText(label,px,py+.5);}}
 x.save();x.translate(620,490);x.rotate(t*.08);x.strokeStyle='#f0c97988';x.lineWidth=1.5;for(let i=0;i<8;i++){x.rotate(TAU/8);x.beginPath();x.moveTo(34,0);x.lineTo(44,0);x.stroke();}x.restore();x.imageSmoothingEnabled=true;
};

function drawPixelFloorDetails(ctx){
 const w=G.world;if(!w)return;const x0=Math.max(0,Math.floor(G.cam.x/TILE)-1),x1=Math.min(w.W-1,Math.ceil((G.cam.x+G.w)/TILE)+1),y0=Math.max(0,Math.floor(G.cam.y/TILE)-1),y1=Math.min(w.H-1,Math.ceil((G.cam.y+G.h)/TILE)+1),accent=w.region==='late'?lateDecorColor(w.lateKey):w.region==='hollow'?(G.floor>5?'#73906c':'#7f93a6'):'#8190a4';ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha=save.quality==='light'?.18:.3;
 for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){const i=ty*w.W+tx;if(w.grid[i]!==1)continue;const h=((tx*73856093)^(ty*19349663)^(G.floor*83492791))>>>0;if(h%5)continue;const px=tx*TILE+4+h%24,py=ty*TILE+5+(h>>>5)%22;ctx.fillStyle=h%3?accent:'#d7c49b';ctx.fillRect(px,py,h%11===0?3:2,1);ctx.fillStyle='#05070b88';ctx.fillRect(px+1,py+2,2,1);if(h%29===0){ctx.fillStyle=accent;ctx.fillRect(tx*TILE+3,ty*TILE+3,2,2);ctx.fillRect(tx*TILE+TILE-5,ty*TILE+TILE-5,2,2);}}
 ctx.restore();
}
function drawPixelEntityDetails(ctx){
 const t=save.motion?0:G.tAll;ctx.save();ctx.imageSmoothingEnabled=false;
 for(const e of G.enemies){if(e.dead||e.x<G.cam.x-70||e.x>G.cam.x+G.w+70||e.y<G.cam.y-70||e.y>G.cam.y+G.h+70)continue;const r=e.r,c=e.col||'#c9a0ff';ctx.fillStyle='#ffffffa8';ctx.fillRect(Math.round(e.x-r*.36),Math.round(e.y-r*.54),Math.max(2,Math.round(r*.16)),2);ctx.fillStyle='#090b11a8';ctx.fillRect(Math.round(e.x+r*.18),Math.round(e.y+r*.48),Math.max(2,Math.round(r*.2)),2);if(e.isBoss){for(let i=0;i<6;i++){const a=i*TAU/6+t*.18,rr=r+9+(i%2)*3;ctx.fillStyle=i%2?c:'#f4dfad';ctx.fillRect(Math.round(e.x+Math.cos(a)*rr)-2,Math.round(e.y+Math.sin(a)*rr)-2,4,4);}}else{ctx.fillStyle=e.lateRole==='ranged'?'#dffaff':'#fff0b8';const eyeY=Math.round(e.y-r*.16);ctx.fillRect(Math.round(e.x-r*.2),eyeY,2,2);if(e.r>12)ctx.fillRect(Math.round(e.x+r*.11),eyeY,2,2);}}
 if(G.portal){const p=G.portal,c=p.active?'#ffd786':'#7d7465';ctx.strokeStyle=c+'aa';ctx.lineWidth=1;for(let i=0;i<4;i++){const a=t*.22+i*TAU/4,rr=31;ctx.strokeRect(Math.round(p.x+Math.cos(a)*rr)-2,Math.round(p.y+Math.sin(a)*rr)-2,4,4);}}
 for(const c of G.chests)if(!c.opened){ctx.fillStyle='#ffe0a0';ctx.fillRect(Math.round(c.x)-8,Math.round(c.y)-7,3,2);ctx.fillRect(Math.round(c.x)+5,Math.round(c.y)-7,3,2);}
 for(const b of G.bullets){ctx.fillStyle='#fff6c9';ctx.fillRect(Math.round(b.x)-2,Math.round(b.y)-2,4,4);ctx.fillStyle='#ff9d4f';ctx.fillRect(Math.round(b.x-b.vx*.018)-1,Math.round(b.y-b.vy*.018)-1,2,2);}
 ctx.restore();
}
