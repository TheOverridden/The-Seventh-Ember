function rarityOdds(){
  const depth=clamp((G.floor-1)/49,0,1),treasure=G.opts.freeChoice?1:0;
  return [Math.max(.38,.67-depth*.2-treasure*.08),.25+depth*.08,.075+depth*.095+treasure*.05,.005+depth*.025+treasure*.03];
}
function rollRarity(pool){
  const odds=rarityOdds(),available=new Set(pool.map(o=>o.r));let total=0;
  for(let i=0;i<4;i++)if(available.has(i))total+=odds[i];
  let roll=Math.random()*total;
  for(let i=0;i<4;i++)if(available.has(i)){roll-=odds[i];if(roll<=0)return i;}
  return pool[0]?.r||0;
}
buildCards=function(){
  const u=G.run.up;let pool=POOL.filter(o=>(u[o.id]||0)<o.max&&(!o.unlock||armoryData()[o.unlock]));
  if(!pool.length)pool=[{id:'hp',r:0,max:99,w:1,icon:'heart',name:'Emberglow',ds:'Restore 25 health'}];
  const picks=(G.restoreCardIds||[]).map(id=>POOL.find(o=>o.id===id)).filter(Boolean);G.restoreCardIds=null;
  while(picks.length<3&&pool.length){
    const rarity=rollRarity(pool),tier=pool.filter(o=>o.r===rarity);let total=tier.reduce((n,o)=>n+o.w,0),roll=Math.random()*total,sel=tier[0];
    for(const o of tier){roll-=o.w;if(roll<=0){sel=o;break;}}
    picks.push(sel);pool=pool.filter(o=>o!==sel);
  }
  const wrap=T('cards');wrap.replaceChildren();
  for(let i=0;i<picks.length;i++){
    const o=picks[i],rank=G.run.up[o.id]||0,el=document.createElement('button');el.className='card';el.dataset.r=o.r;el.type='button';
    const pips=o.max<=8?'<div class="pips">'+Array.from({length:o.max},(_,k)=>`<em class="${k<rank?'on':''}"></em>`).join('')+'</div>':'';
    el.innerHTML=`<span class="key">${i+1}</span><div class="rar">${RARITY[o.r].n}</div><div class="ic"><i data-lucide="${o.icon}"></i></div><div class="nm cinzel">${o.name}</div><div class="ds">${o.ds}</div>${pips}<div class="card-rank">${rank?'RANK '+(rank+1):'NEW BLESSING'}</div>`;
    el._up=o;on(el,'click',()=>chooseCard(i));wrap.appendChild(el);
  }
  G.cardPool=picks;refreshIcons();
};
addChip=function(o){
  const wrap=T('chips'),rank=G.run.up[o.id];let el=wrap.querySelector(`[data-up="${o.id}"]`);
  if(!el){el=document.createElement('span');el.dataset.up=o.id;el.title=o.name+' — '+o.ds;el.innerHTML=`<i data-lucide="${o.icon}"></i><b>${rank}</b>`;wrap.appendChild(el);refreshIcons();}
  el.className='chip r'+o.r;el.querySelector('b').textContent=rank;
};

const beforeLateRecalc=recalc;
recalc=function(){
  beforeLateRecalc();if(!G.player||!G.run)return;const p=G.player,u=G.run.up,g=id=>u[id]||0;
  p.magSize=6+2*g('magazine')+g('reserve');p.reloadDuration=1.65*Math.pow(.82,g('quickload'));p.ammo=Math.min(p.ammo??p.magSize,p.magSize);
  p.flareReach=66+16*g('flareReach');p.flareArc=.8+.12*g('flareReach');
  MELEE.reach=p.flareReach;MELEE.halfArc=p.flareArc;
  p.orbN+=g('ashCrown')?5:0;p.runRevive=!!g('runRevive');
};

const beforeLateFireVolley=fireVolley;
fireVolley=function(){
  const p=G.player;if(!p)return;const start=G.bullets.length,ammo=p.ammo;
  beforeLateFireVolley();if(G.bullets.length===start||p.ammo===ammo)return;
  p.lateCast=(p.lateCast||0)+1;if(!Number.isFinite(p.lateBolt))p.lateBolt=Math.max(0,p.lateCast-1);if(!Number.isFinite(p.chainBolt))p.chainBolt=Math.max(0,p.lateCast-1);const u=G.run.up,created=G.bullets.slice(start);
  for(const b of created){
    p.lateBolt=(p.lateBolt||0)+1;p.chainBolt=(p.chainBolt||0)+1;
    b.late=true;b.burn=u.burn||0;b.blast=u.blast||0;
    b.fork=u.chain&&p.chainBolt%4===0?u.chain:0;
    b.whiteStar=!!(u.whiteStar&&p.lateCast%4===0);
    if(b.whiteStar)b.r+=4;
  }
  if(u.twinFlame){for(const src of created){const base=Math.atan2(src.vy,src.vx),speed=Math.hypot(src.vx,src.vy);for(const turn of [Math.PI,Math.PI/2,-Math.PI/2]){const a=base+turn;G.bullets.push({...src,x:p.x+Math.cos(a)*14,y:p.y+Math.sin(a)*14,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,hits:null,whiteStar:false,fork:0});}}}
};
function forkBolts(source,target,count=2){
  const options=G.enemies.filter(e=>!e.dead&&e!==target&&d2(e.x,e.y,target.x,target.y)<260**2&&los(G.world,target.x,target.y,e.x,e.y)).sort((a,b)=>d2(a.x,a.y,target.x,target.y)-d2(b.x,b.y,target.x,target.y));
  for(const e of options.slice(0,count)){const a=Math.atan2(e.y-target.y,e.x-target.x),speed=BASE.bulletSpd*.8;G.bullets.push({x:target.x,y:target.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:4,dmg:source.dmg*.65,pierce:0,ric:0,life:.65,hits:new Set([target]),late:true,burn:source.burn||0,blast:0,fork:0,whiteStar:false});}
}
updateBullets=function(dt){
  const w=G.world,bs=G.bullets;
  for(let i=bs.length-1;i>=0;i--){
    const b=bs[i];b.life-=dt;let remove=b.life<=0;const steps=Math.max(1,Math.ceil(Math.hypot(b.vx,b.vy)*dt/6));
    for(let step=0;step<steps&&!remove;step++){
      b.x+=b.vx*dt/steps;b.y+=b.vy*dt/steps;if(solidPx(w,b.x,b.y)){burst(b.x,b.y,3,'#ffc46b',90,.2,1.6,true);remove=true;break;}
      for(const e of G.enemies){
        if(e.dead||b.hits?.has(e)||d2(b.x,b.y,e.x,e.y)>=(e.r+b.r)**2)continue;
        const crit=chance(G.player.critC);damageEnemy(e,b.dmg*(crit?2:1),Math.atan2(b.vy,b.vx),crit,1,b.melee?'meleeWave':'shot');
        if(!b.hits)b.hits=new Set();b.hits.add(e);
        if(b.whiteStar){nova(e.x,e.y,170,G.player.dmg*2.8);burst(e.x,e.y,32,'#fff1bc',285,.72,3.8,true);b.whiteStar=false;sfx('mythic');}
        if(b.fork){forkBolts(b,e,1+b.fork);b.fork=0;}
        if(crit&&b.blast){for(const other of G.enemies)if(other!==e&&!other.dead&&d2(other.x,other.y,e.x,e.y)<(52+18*b.blast)**2)damageEnemy(other,b.dmg*.22*b.blast,Math.atan2(other.y-e.y,other.x-e.x),false,.4,'blast');}
        if(b.pierce>0)b.pierce--;
        else if(b.ric>0){b.ric--;let best=null,dist=(b.ricRange||270)**2;for(const other of G.enemies){const dd=d2(b.x,b.y,other.x,other.y);if(!other.dead&&!b.hits.has(other)&&dd<dist&&los(w,b.x,b.y,other.x,other.y)){best=other;dist=dd;}}if(best){const a=Math.atan2(best.y-b.y,best.x-b.x),speed=Math.hypot(b.vx,b.vy);b.vx=Math.cos(a)*speed;b.vy=Math.sin(a)*speed;b.dmg*=b.ricPower||.7;b.life=Math.max(b.life,.5);}else remove=true;}
        else remove=true;break;
      }
    }
    if(remove)bs.splice(i,1);
  }
};

const beforeLateDamageEnemy=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
  if(!e||e.dead||e.lateBoss&&!e.introduced)return;const u=G.run?.up||{},p=G.player;
  if(e.lateBoss){if(e.bossKey==='tyrant'&&e.bs.mode==='barrier')dmg*=.3;else if(e.bossKey==='colossus'&&e.bs.mode==='cool')dmg*=1.45;else if(e.bs.mode==='recover')dmg*=kind==='melee'||kind==='meleeWave'?1.28:1.1;}
  if(e.ai==='late'){
    if(e.type==='mirrorShell'&&e.specialMode==='shell')dmg*=.22;
    if(e.type==='barrierKnight'&&e.specialMode==='barrier')dmg*=.18;
    const mourner=G.enemies.find(a=>!a.dead&&a.type==='mourningGuard'&&a.specialMode==='aura'&&a!==e&&d2(a.x,a.y,e.x,e.y)<145**2);
    if(mourner)dmg*=.55;
    const sworn=G.enemies.find(a=>!a.dead&&a.type==='oathbound'&&a.specialMode==='oath'&&a!==e&&d2(a.x,a.y,e.x,e.y)<160**2);
    if(sworn)dmg*=.68;
  }
  if(u.fullHeart&&p.hp>p.maxHp*.8)dmg*=1+.22*u.fullHeart;
  if(u.lastLight)dmg*=1+2*(1-p.hp/p.maxHp);
  if(u.stillness)dmg*=1+Math.min(.18*u.stillness,(p.stillT||0)*.12*u.stillness);
  if(u.eliteBane&&(e.elite||e.isBoss))dmg*=1+.35*u.eliteBane;
  beforeLateDamageEnemy(e,dmg,ang,crit,kb,kind);
  if(!e.dead&&kind==='shot'&&u.burn){e.burnT=3;e.burnRank=Math.max(e.burnRank||0,u.burn);e.burnTick=Math.min(e.burnTick||.45,.45);}
  if(!e.dead&&u.ashCrown&&kind==='orbital'){e.burnT=Math.max(e.burnT||0,5);e.burnRank=Math.max(e.burnRank||0,4);e.burnTick=Math.min(e.burnTick||.45,.3);}
};
const beforeLateStrikeMelee=strikeMelee;
strikeMelee=function(){const p=G.player,a=p.meleeAngle;beforeLateStrikeMelee();const rank=G.run.up.aftershock||0;if(rank){G.run.aftershocks=G.run.aftershocks||[];G.run.aftershocks.push({x:p.x,y:p.y,a,t:.28,rank});}};
const beforeLateKillEnemy=killEnemy;
killEnemy=function(e){
  const was=e.dead,kills=G.run?.kills||0;
  if(!was&&G.state==='playing'&&(e.type==='coalMite'||e.type==='choirWisp')){
    const n=e.type==='coalMite'?5:8,speed=e.type==='coalMite'?155:205,mul=e.type==='coalMite'?.38:.32;
    for(let i=0;i<n;i++){const a=i*TAU/n+e.seed;G.ebul.push({x:e.x,y:e.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:e.type==='coalMite'?4:5,dmg:Math.max(1,Math.round(e.dmg*mul)),life:2.2,lateColor:e.col});}
    sfx('eshoot');
  }
  beforeLateKillEnemy(e);if(was||!e.dead||!G.run)return;const rank=G.run.up.leech||0;if(rank&&G.run.kills>kills&&G.run.kills%6===0){G.player.hp=Math.min(G.player.maxHp,G.player.hp+5*rank);addText(G.player.x,G.player.y-20,'WARM HANDS','#ffc982',12);}
};
const beforeLateHurtPlayer=hurtPlayer;
hurtPlayer=function(dmg,sx,sy){
  const p=G.player,u=G.run?.up||{};if(!p)return;
  if(p.guardT>0){dmg=Math.max(1,Math.round(dmg*.4));p.guardT=0;burst(p.x,p.y,10,'#ffe2a0',120,.35,2,true);}
  if(p.hp-dmg<=0&&u.runRevive&&!G.run.runRevUsed&&p.hitCd<=0&&p.dashT<=0&&G.state==='playing'){G.run.runRevUsed=true;p.hp=Math.max(1,Math.round(p.maxHp*.35));p.hitCd=2;nova(p.x,p.y,180,p.dmg*4);toast('SECOND EMBER','one more chance');saveNow();return;}
  const hp=p.hp;beforeLateHurtPlayer(dmg,sx,sy);
  if(p.hp<hp&&u.thorns){let target=null,best=150**2;for(const e of G.enemies){const dd=d2(e.x,e.y,sx,sy);if(!e.dead&&dd<best){best=dd;target=e;}}if(target)damageEnemy(target,p.dmg*.65*u.thorns,Math.atan2(target.y-p.y,target.x-p.x),false,0,'reprisal');}
};
function tickBlessings(dt){
  const p=G.player,u=G.run?.up||{};if(!p)return;
  if(G.floor>10&&p.bloomCd>0)p.bloomCd=Math.max(0,p.bloomCd-dt);
  p.stillT=p.moving?0:Math.min(3,(p.stillT||0)+dt);p.guardT=Math.max(0,(p.guardT||0)-dt);
  if(p.reloadT>0&&!p._wasReloading&&u.guard)p.guardT=.35+.22*u.guard;
  if(p._wasReloading&&p.reloadT===0&&u.overcharge){nova(p.x,p.y,85+20*u.overcharge,p.dmg*(1.2+.5*u.overcharge));}
  p._wasReloading=p.reloadT>0;
  const effectiveDashTrail=(u.dashTrail||0)+(META.dashTrail||0);if(effectiveDashTrail&&p.dashT>0){p.wakeT=(p.wakeT||0)-dt;if(p.wakeT<=0){p.wakeT=.07;G.run.wake=G.run.wake||[];G.run.wake.push({x:p.x,y:p.y,t:.42,rank:effectiveDashTrail});}}
  for(const e of G.enemies){if(e.dead||!(e.burnT>0))continue;e.burnT-=dt;e.burnTick=(e.burnTick||0)-dt;if(e.burnTick<=0){e.burnTick=.5;damageEnemy(e,p.dmg*.1*(e.burnRank||1),0,false,0,'burn');burst(e.x,e.y,2,'#ff914d',45,.25,2,true);}}
  if(G.run.wake)for(let i=G.run.wake.length-1;i>=0;i--){const q=G.run.wake[i];q.t-=dt;if(q.t<=0){G.run.wake.splice(i,1);continue;}for(const e of G.enemies)if(!e.dead&&(e.wakeHit||0)<=G.t&&d2(q.x,q.y,e.x,e.y)<(30+8*q.rank)**2){e.wakeHit=G.t+.18;damageEnemy(e,p.dmg*.18*q.rank,0,false,0,'wake');}}
  if(G.run.aftershocks)for(let i=G.run.aftershocks.length-1;i>=0;i--){const q=G.run.aftershocks[i];q.t-=dt;if(q.t<=0){for(const e of G.enemies)if(!e.dead&&d2(q.x,q.y,e.x,e.y)<(98+14*q.rank)**2)damageEnemy(e,p.dmg*.55*q.rank,Math.atan2(e.y-q.y,e.x-q.x),false,.6,'aftershock');burst(q.x,q.y,16,'#ffc26f',150,.45,2.5,true);G.run.aftershocks.splice(i,1);}}
}
