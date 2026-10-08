const comboCheckedStates=new WeakSet();
const synergyStateBase=blessingComboState;
blessingComboState=function(){
 const s=synergyStateBase();if(!s||comboCheckedStates.has(s))return s;
 if(Array.isArray(s.counts))s.counts={};
 s.seen=s.seen.filter(id=>COMBO_BY_ID[id]).slice(0,BLESSING_COMBOS.length);
 s.effects=s.effects.filter(f=>f&&Number.isFinite(f.x)&&Number.isFinite(f.y)&&Number.isFinite(f.t)&&f.t>0&&f.t<=2&&typeof f.type==='string').slice(-64);
 s.fields=(Array.isArray(s.fields)?s.fields:[]).filter(f=>f&&['conductor','quake','magma','frost','wave','halo','meteor','moths'].includes(f.type)&&[f.x,f.y,f.t,f.max,f.age,f.power].every(Number.isFinite)&&f.t>0&&f.max>0&&f.max<=8).slice(-24);
 for(const f of s.fields){f.hit=Array.isArray(f.hit)?f.hit.filter(Number.isInteger).slice(0,200):[];f.tick=Number.isFinite(f.tick)?f.tick:0;f.a=Number.isFinite(f.a)?f.a:0;f.rank=Number.isFinite(f.rank)?clamp(f.rank,1,3):1;}
 for(const key of Object.keys(s.counts))if(!Number.isInteger(s.counts[key])||s.counts[key]<0||s.counts[key]>40)delete s.counts[key];
 if(!Number.isInteger(s.floor))s.floor=G.floor;
 comboCheckedStates.add(s);return s;
};
function comboField(type,x,y,options={}){
 if(!G.world||solidPx(G.world,x,y))return null;
 const s=blessingComboState(),life=options.life||3;
 const f={type,x,y,t:life,max:life,age:0,tick:0,power:1,a:0,rank:1,hit:[],...options};
 const cap={halo:1,conductor:3,moths:3,meteor:6,frost:6,magma:8,quake:3,wave:3}[type];
 const same=s.fields.filter(q=>q.type===type);while(same.length>=cap){const old=same.shift();if(type==='halo')comboReleaseHalo(old);s.fields.splice(s.fields.indexOf(old),1);}
 s.fields.push(f);while(s.fields.length>24)s.fields.shift();return f;
}
function comboTargets(x,y,radius){return expansionLiving().filter(e=>d2(e.x,e.y,x,y)<(radius+e.r)**2&&los(G.world,x,y,e.x,e.y)).sort((a,b)=>d2(a.x,a.y,x,y)-d2(b.x,b.y,x,y));}
function comboShot(x,y,a,power,type,options={}){
 if(G.bullets.filter(b=>b.comboKind).length>=64)return;
 expansionFriendlyShot(x,y,a,G.player.dmg*power,{comboKind:type,comboArt:type,...options});
}
function comboIcicles(x,y,a,n=3,power=.7,seeking=0){
 for(let i=0;i<n;i++)comboShot(x,y,a+(i-(n-1)/2)*.25,power,'hailstone',{r:7,pierce:1,speed:BASE.bulletSpd*.8,life:1.3,seeking});
 sfx('stitchPin');
}
function comboCrescent(a,power){comboShot(G.player.x,G.player.y,a,power,'moonShard',{r:17,pierce:4,speed:BASE.bulletSpd*.7,life:1.5});}
function comboArc(x,y,target,power,kind='comboLightning'){
 damageEnemy(target,G.player.dmg*power,Math.atan2(target.y-y,target.x-x),false,.15,kind);
 blessingEffect({type:'arc',x,y,x2:target.x,y2:target.y,color:'#eef7ff',max:.38});
}
function comboStitchPulse(power){
 const lines=starstitchLines();if(!lines.length)return;
 for(const e of expansionLiving())if(lines.some(([a,b])=>expansionSegmentDistance(e.x,e.y,a.x,a.y,b.x,b.y)<e.r+13&&los(G.world,a.x,a.y,e.x,e.y)))damageEnemy(e,G.player.dmg*power,0,false,.1,'comboStitch');
 for(const [a,b]of lines.slice(0,12))blessingEffect({type:'strand',x:a.x,y:a.y,x2:b.x,y2:b.y,max:.65});
}
function comboMeteor(x,y,power,main=true,delay=.8){return comboField('meteor',x,y,{life:delay,power,main,radius:main?(blessingComboActive('extinction')?180:110):75});}
function comboCallMeteor(){
 const p=G.player,a=aimAngle(),target=comboTargets(p.x,p.y,450).find(e=>Math.abs(angleDiff(Math.atan2(e.y-p.y,e.x-p.x),a))<.5);
 let x=p.x+Math.cos(a)*180,y=p.y+Math.sin(a)*180;
 if(target){x=target.x;y=target.y;}else for(let i=0;i<12&&solidPx(G.world,x,y);i++){x-=Math.cos(a)*14;y-=Math.sin(a)*14;}
 const power=(3+(blessingRank('meteorCore')-1))*(blessingComboActive('extinction')?1.5:1);
 comboMeteor(x,y,power);
 if(blessingComboActive('meteorSwarm')){comboTrialEvent('meteorSwarm');for(const side of [-1,1])comboMeteor(x+Math.cos(a+Math.PI/2)*68*side,y+Math.sin(a+Math.PI/2)*68*side,1.3,false,1.05);}
 sfx('comet');
}
function comboFissure(a){
 const p=G.player,rank=blessingRank('faultline'),turns=blessingComboActive('rupture')?[-.3,0,.3]:[0];
 if(turns.length===3)comboTrialEvent('rupture');
 for(const turn of turns)comboField('quake',p.x,p.y,{life:.85,a:a+turn,rank,power:1.8+.5*(rank-1),reach:300});
 sfx('break');
}
function comboMoths(n=3){const p=G.player;comboField('moths',p.x,p.y,{life:2.5,rank:blessingRank('lanternMoths'),n,power:1.2});}
function comboReleaseHalo(f){
 if(!blessingComboActive('gearstorm'))return;comboTrialEvent('gearstorm');
 for(let i=0;i<3;i++){const a=G.t*2.8+i*TAU/3,x=f.x+Math.cos(a)*85,y=f.y+Math.sin(a)*85,target=comboTargets(x,y,400)[0];comboShot(x,y,target?Math.atan2(target.y-y,target.x-x):a,1.2,'gearstorm',{r:13,ric:3,ricPower:.85,life:1.8});}
}
const synergyDamageEnemy=damageEnemy;
damageEnemy=function(e,damage,angle,crit,kb,kind='shot'){
 if(!e||e.dead||!G.run)return synergyDamageEnemy(e,damage,angle,crit,kb,kind);
 if(kind==='moonShard'&&crit&&blessingComboActive('bloodMoon'))damage*=1.5;
 const hp=e.hp,result=synergyDamageEnemy(e,damage,angle,crit,kb,kind);if(e.hp>=hp)return result;
 const s=blessingComboState(),p=G.player;
 if(kind==='hailstone'){
  if(blessingComboActive('icebreaker'))blessingBurst(e.x,e.y,55,p.dmg*.4,'icebreaker','#e9faff');
  if(blessingComboActive('glacier')){comboTrialEvent('glacier');comboField('frost',e.x,e.y,{life:2,radius:58});}
 }
 if(kind==='moonShard'&&crit&&blessingComboActive('bloodMoon')&&!(s.bloodMoonUntil>G.t)){
  s.bloodMoonUntil=G.t+.3;comboTrialEvent('bloodMoon');for(let i=0;i<6;i++)comboShot(e.x,e.y,i*TAU/6,.45,'moonSplinter',{r:4,life:.55,pierce:1});
  blessingEffect({type:'bloodMoon',x:e.x,y:e.y,radius:65,max:.55});
 }
 if(kind!=='shot')return result;
 if(blessingCount('hailstone',5))comboIcicles(e.x,e.y,angle,3,.7+.2*(blessingRank('hailstone')-1));
 if(blessingCount('stormCoil',8)){
  const rank=blessingRank('stormCoil');let x=e.x-Math.cos(angle)*36,y=e.y-Math.sin(angle)*36;if(solidPx(G.world,x,y)){x=e.x;y=e.y;}
  comboField('conductor',x,y,{life:4,rank,power:.8+.25*(rank-1),a:(s.serial=(s.serial||0)+1)*2.399});
  if(blessingComboActive('cageOfStars')&&!blessingComboActive('ballLightning'))starstitchPin(x,y);
 }
 return result;
};
const synergyFireVolley=fireVolley;
fireVolley=function(){
 const start=G.bullets.length,result=synergyFireVolley();if(!G.run||G.bullets.length===start)return result;
 const p=G.player,s=blessingComboState(),created=G.bullets.slice(start),a=aimAngle();s.casts=((s.casts||0)+1)%30;
 if(blessingCount('moonShard',6))comboCrescent(a,1.6+.4*(blessingRank('moonShard')-1));
 if(blessingCount('meteorCore',10))comboCallMeteor();
 if(blessingComboActive('whiteout')&&s.casts%6===0){comboTrialEvent('whiteout');for(let i=0;i<5;i++)comboShot(p.x,p.y,G.t*1.3+i*TAU/5,.8,'hailstone',{comboArt:'whiteout',r:7,pierce:1,speed:BASE.bulletSpd*.65,life:1.6,seeking:.11});}
 if(blessingComboActive('prismChoir')&&created.some(b=>b.echoCast))for(const side of [-1,1])comboShot(p.x,p.y,a+side*.25,.6,'prismChoir',{r:9,pierce:2,life:1.6});
 if(blessingComboActive('echoChamber'))for(const b of created)if(b.echoCast)b.comboArt='echoChamber';
 return result;
};
const synergyStrikeMelee=strikeMelee;
strikeMelee=function(){
 const result=synergyStrikeMelee();if(!G.run||!G.player)return result;
 const p=G.player,s=blessingComboState();s.flares=((s.flares||0)+1)%12;
 if(blessingCount('faultline',4))comboFissure(p.meleeAngle);
 if(blessingCount('tidePulse',3))comboField('wave',p.x,p.y,{life:blessingComboActive('undertow')?1.7:.85,power:(1+.35*(blessingRank('tidePulse')-1))*(blessingComboActive('tidalBore')?1.5:1),radius:blessingComboActive('tidalBore')?280:190});
 if(blessingCount('sawHalo',4))comboField('halo',p.x,p.y,{life:5,power:.85+.3*(blessingRank('sawHalo')-1)});
 if(blessingComboActive('moonwake')&&s.flares%2===0){comboTrialEvent('moonwake');for(const turn of [-.38,.38])comboCrescent(p.meleeAngle+turn,1.1);}
 if(blessingComboActive('hearthguard')&&s.flares%3===0&&!(s.hearthUntil>G.t)){s.hearthUntil=G.t+3;comboTrialEvent('hearthguard');comboMoths(1);p.cardWard=Math.min(p.maxHp*.35,(p.cardWard||0)+4*blessingRank('lanternMoths'));}
 if(blessingComboActive('rupture')){
  const x=p.x+Math.cos(p.meleeAngle)*110,y=p.y+Math.sin(p.meleeAngle)*110;
  for(const e of comboTargets(p.x,p.y,200))if(!e.isBoss){e.kbx+=(x-e.x)*.6;e.kby+=(y-e.y)*.6;}
 }
 return result;
};
const synergyKillEnemy=killEnemy;
killEnemy=function(e){
 const was=e?.dead,result=synergyKillEnemy(e);if(was||!e?.dead||!G.run)return result;
 if(blessingCount('lanternMoths',10))comboMoths();
 const s=blessingComboState();if(e.elite&&blessingComboActive('soulLantern')&&!(s.soulUntil>G.t)){s.soulUntil=G.t+6;comboMoths();blessingBurst(e.x,e.y,125,G.player.dmg*1.6,'soulLantern','#fff3bd');}
 return result;
};
function comboTickField(f,dt){
 const p=G.player;f.t-=dt;f.age+=dt;f.tick-=dt;
 if(f.type==='conductor'){
  if(blessingComboActive('ballLightning')){f.x=p.x+Math.cos(G.t*1.3+f.a)*100;f.y=p.y+Math.sin(G.t*1.3+f.a)*100;}
  if(f.tick<=0&&!solidPx(G.world,f.x,f.y)){f.tick=1;const targets=comboTargets(f.x,f.y,235).slice(0,blessingComboActive('forkedStorm')?3:1);
   if(targets.length===3)comboTrialEvent('forkedStorm');
   for(const e of targets){const hp=e.hp;comboArc(f.x,f.y,e,f.power);if(e.hp<hp&&blessingComboActive('ballLightning'))comboTrialEvent('ballLightning');if(blessingComboActive('stormglass')&&!e.dead){if(blessingFreeze(e,.8))comboTrialEvent('stormglass');}if(blessingComboActive('cageOfStars')&&!e.dead){starstitchPin(e.x,e.y,e);comboTrialEvent('cageOfStars');}}
   if(targets.length){if(blessingComboActive('cageOfStars'))comboStitchPulse(.35);sfx('stitchPin');}
  }
 }else if(f.type==='quake'){
  const before=Math.max(0,f.age-dt)/f.max*f.reach,front=Math.min(1,f.age/f.max)*f.reach;
  const x=f.x+Math.cos(f.a)*front,y=f.y+Math.sin(f.a)*front;
  if(solidPx(G.world,x,y)){f.t=0;return;}
  for(const e of expansionLiving())if(!f.hit.includes(e.uid)&&expansionSegmentDistance(e.x,e.y,f.x+Math.cos(f.a)*before,f.y+Math.sin(f.a)*before,x,y)<e.r+25&&los(G.world,f.x,f.y,e.x,e.y)){
   f.hit.push(e.uid);damageEnemy(e,p.dmg*f.power,f.a,false,.7,'faultline');
   if(blessingComboActive('thunderquake'))for(const target of comboTargets(e.x,e.y,190).filter(q=>q!==e).slice(0,2)){const hp=target.hp;comboArc(e.x,e.y,target,.6);if(target.hp<hp)comboTrialEvent('thunderquake');}
  }
  if(blessingComboActive('magmaFault')&&f.tick<=0){f.tick=.17;comboField('magma',x,y,{life:3,radius:37,power:.22});}
 }else if(f.type==='wave'){
  const back=f.age>.85,r=f.radius*clamp(back?2-f.age/.85:f.age/.85,0,1),old=f.radius*clamp(back?2-(f.age-dt)/.85:(f.age-dt)/.85,0,1);
  if(back&&!f.returning){f.returning=true;f.hit=[];}
  for(const e of expansionLiving()){
   const distance=Math.hypot(e.x-f.x,e.y-f.y);if(f.hit.includes(e.uid)||distance<Math.min(r,old)-e.r-12||distance>Math.max(r,old)+e.r+12||!los(G.world,f.x,f.y,e.x,e.y))continue;
   f.hit.push(e.uid);const hp=e.hp;damageEnemy(e,p.dmg*f.power,Math.atan2(e.y-f.y,e.x-f.x),false,back?0:blessingComboActive('tidalBore')?1.6:.65,'tidalPulse');
   if(e.hp<hp){if(back)comboTrialEvent('undertow');if(blessingComboActive('tidalBore'))comboTrialEvent('tidalBore');}
   if(blessingComboActive('permafrost')&&!e.dead){if(blessingFreeze(e,.95))comboTrialEvent('permafrost');}
   if(back&&!e.isBoss){const d=Math.max(1,distance);e.kbx+=(f.x-e.x)/d*180;e.kby+=(f.y-e.y)/d*180;}
  }
 }else if(f.type==='halo'){
  f.x=p.x;f.y=p.y;
  for(let i=0;i<3;i++){const a=G.t*2.8+i*TAU/3,x=p.x+Math.cos(a)*85,y=p.y+Math.sin(a)*85;
   for(const e of comboTargets(x,y,22))if(!(e.comboSawUntil>G.t)){e.comboSawUntil=G.t+.6;damageEnemy(e,p.dmg*f.power,a,false,.3,'sawHalo');
    if(blessingComboActive('iceHalo')&&!e.dead){if(blessingFreeze(e,.7))comboTrialEvent('iceHalo');}
    if(blessingComboActive('sawfire')){blessingIgnite(e,blessingRank('burn'),3);const s=blessingComboState();s.sawHits=((s.sawHits||0)+1)%3;if(!s.sawHits){comboTrialEvent('sawfire');comboShot(x,y,a,1.2,'sawfire',{r:13,pierce:2,life:.9});}}
   }
  }
  if(f.t<=0)comboReleaseHalo(f);
 }else if(f.type==='frost'||f.type==='magma'){
  if(f.tick<=0){f.tick=.5;for(const e of comboTargets(f.x,f.y,f.radius)){
   if(f.type==='frost')blessingFreeze(e,.65);else{damageEnemy(e,p.dmg*f.power,0,false,0,'magmaFault');blessingIgnite(e,1,2);}
  }}
 }else if(f.type==='meteor'&&f.t<=0){
  blessingBurst(f.x,f.y,f.radius,p.dmg*f.power,'meteorImpact','#ffdb8f');sfx('comet');if(f.main)comboTrialEvent('extinction');
  if(blessingComboActive('impactCrater')){comboTrialEvent('impactCrater');comboField('magma',f.x,f.y,{life:4,radius:f.main?85:48,power:.4,crater:true});}
  if(blessingComboActive('starforge')){const survivors=comboTargets(f.x,f.y,f.radius).slice(0,2);if(survivors.length)comboTrialEvent('starforge');for(const e of survivors)starstitchPin(e.x,e.y,e);comboStitchPulse(1);}
 }else if(f.type==='moths'){
  f.x=p.x;f.y=p.y;
  if(f.t<=0){cardHeal(f.rank*f.n);
   if(blessingComboActive('mothlight')){comboTrialEvent('mothlight');p.cardWard=Math.min(p.maxHp*.35,(p.cardWard||0)+3*f.rank*f.n);blessingEffect({type:'mothWard',x:p.x,y:p.y,radius:32,max:.7});}
   if(blessingComboActive('cinderMoths')){const targets=comboTargets(p.x,p.y,280);for(let i=0;i<f.n&&targets.length;i++){const e=targets[i%targets.length];if(e.dead)continue;comboArc(p.x,p.y,e,1.2,'cinderMoths');blessingIgnite(e,blessingRank('burn'),3);blessingEffect({type:'mothDive',x:p.x,y:p.y,x2:e.x,y2:e.y,max:.6});}}
  }
 }
}
const synergyTickBlessings=tickBlessings;
tickBlessings=function(dt){
 const result=synergyTickBlessings(dt),s=blessingComboState(),p=G.player;if(!s||!p||!G.world)return result;
 if(s.floor!==G.floor){s.fields=[];s.effects=[];s.floor=G.floor;s.wasDashing=false;}
 if(s.wasDashing&&p.dashT<=0){
  if(blessingComboActive('stormstep'))for(const e of comboTargets(p.x,p.y,230).slice(0,3)){const hp=e.hp;comboArc(p.x,p.y,e,.85);if(e.hp<hp)comboTrialEvent('stormstep');}
  if(blessingComboActive('trailOfGlass')){comboTrialEvent('trailOfGlass');comboIcicles(p.x,p.y,Math.atan2(p.dashDy,p.dashDx),5,.85);}
 }
 s.wasDashing=p.dashT>0;
 for(const b of G.bullets)if(b.comboKind==='moonShard'&&!b.eclipsed&&blessingComboActive('eclipse')&&(G.run.cardFields||[]).some(f=>f.kind==='blackHole'&&d2(b.x,b.y,f.x,f.y)<130**2)){
  b.eclipsed=true;comboTrialEvent('eclipse');b.dmg*=2;b.r+=8;b.pierce+=3;b.comboArt='eclipse';blessingEffect({type:'eclipse',x:b.x,y:b.y,radius:45,max:.6});
 }
 for(const f of [...s.fields])comboTickField(f,dt);s.fields=s.fields.filter(f=>f.t>0);
 return result;
};
