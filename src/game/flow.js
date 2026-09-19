const needXP = l => Math.floor(14 + 11*l + 3.2*Math.pow(l,1.48) + .65*Math.pow(Math.max(0,l-12),2));
function setState(s){
  G.state=s;
  if(s!=='playing') clearInput();
  document.body.classList.toggle('play', s==='playing' || s==='dying');
  T('hud').classList.toggle('on', s!=='menu');
}
function recalc(){
  const p=G.player, u=G.run.up;
  const g=id=>u[id]||0;
  p.maxHp=Math.round((BASE.hp+META.hp+g('hp')*25)*(1-.1*g('glass')));
  p.hp=Math.min(p.hp,p.maxHp);
  p.dmg=BASE.dmg*META.dmg*(1+.18*g('dmg'))*(1+.4*g('glass'));
  p.shotInt=Math.max(.07,1/(BASE.rate*META.rate*(1+.15*g('rate'))));
  p.speed=BASE.speed*META.speed*(1+.10*g('speed'));
  p.magnet=BASE.magnet*META.mag*(1+.35*g('magnet'));
  p.critC=BASE.crit+META.crit+.08*g('crit');
  p.proj=1+g('proj');
  p.pierce=g('pierce');
  p.ric=g('ric');
  p.regen=.6*g('regen');
  p.orbN=g('orbital');
  p.dashCd=BASE.dashCd*META.dash*Math.pow(.85,g('dash'));
  p.xpMul=META.xp*(1+.15*g('xp'));
  p.execB=.30*g('exec');
}
function startRun(){
  G.run=null; save.resume=null; clearInput(); G.victoryPending=0;
  META=computeMeta();
  save.totalRuns++; markSave(); saveNow();
  G.run={level:1,xp:0,up:{},ess:0,kills:0,t:0,revUsed:false,won:false};
  G.floor=1; G.boss=null; G.bossActive=false; G.dead=false; G.pendingLevels=0; G.descending=false;
  G.player={x:0,y:0,r:12,hp:1,maxHp:1,shotT:0,hitCd:0,dashT:0,dashCdT:0,kbx:0,kby:0,
            orbA:0,muzzle:0,face:0,moving:false,lean:0,ghosts:[],ghostT:0,dashDx:1,dashDy:0,
            dmg:BASE.dmg,shotInt:.4,proj:1,pierce:0,ric:0,
            regen:0,orbN:0,dashCd:BASE.dashCd,xpMul:1,execB:0,speed:BASE.speed,magnet:BASE.magnet,critC:.05};
  recalc(); G.player.hp=G.player.maxHp;
  T('chips').innerHTML='';
  hide('howto'); hide('confirmRun'); hide('menu'); hide('dead'); hide('win'); hide('pause'); hide('levelup'); hide('skills'); G.skillsOpen=false; G.treeFrom='menu';
  setupFloor(1);
  setState('playing');
  musicInt=.2; mouse.x=G.w/2+100;mouse.y=G.h/2; updateHUD(0); saveNow();
  if(!save.tut){save.tut=1;markSave();saveNow();}
  else toast(floorName(1),'floor 1');
  G.tutQ=0;
}
function setupFloor(f){
  G.floor=f; save.bestFloor=Math.max(save.bestFloor,f); markSave();
  const w=G.world=genFloor(f);
  G.enemies.length=0; G.bullets.length=0; G.ebul.length=0; G.picks.length=0;
  G.chests.length=0; G.parts.length=0; G.texts.length=0;
  G.boss=null; G.bossActive=false; T('bossbar').classList.remove('on');
  const spawnR=w.rooms[0];
  G.player.x=spawnR.cx*TILE+TILE/2; G.player.y=spawnR.cy*TILE+TILE/2;
  G.player.kbx=G.player.kby=0; G.player.hitCd=1;
  G.cam.x=G.player.x-G.w/2; G.cam.y=G.player.y-G.h/2;
  const exit=w.exit, bossHere=bossFloorAt(f);
  G.portal={x:exit.cx*TILE+TILE/2, y:exit.cy*TILE+TILE/2, r:26, active:!bossHere, t:0};
  if(bossHere){ spawnBossAt(exit.cx*TILE+TILE/2, exit.cy*TILE-TILE*2); }
  const avail=['slime','bat'];
  if(f>=2)avail.push('spitter');
  if(f>=3)avail.push('brute');
  if(f>=4)avail.push('splitter');
  if(f>=6)avail.push('wisp');
  const eliteC=Math.min(.38,.04+.022*f);
  for(const r of w.rooms){
    if(r===spawnR) continue;
    const isExit=r===exit;
    const cap=bossHere?7:10;
    const n=isExit && bossHere ? 2 : Math.min(cap, 2+Math.floor(f*(bossHere ? .28 : .45))+irand(0,2));
    for(let i=0;i<n;i++){
      const x=irand(r.x+1,r.x+r.w-2)*TILE+TILE/2, y=irand(r.y+1,r.y+r.h-2)*TILE+TILE/2;
      if(d2(x,y,G.player.x,G.player.y)<300*300) continue;
      const type=pickA(avail),elite=chance(eliteC),pos=safePosition(w,x,y,ETYPES[type].r*(elite?1.3:1));
      if(pos&&(f>10||G.enemies.length<FLOOR_POPULATION[f-1]))spawnEnemy(type,pos.x,pos.y,elite);
    }
    if(!isExit && chance(.4)){
      const pos=safePosition(w,r.cx*TILE+TILE/2,r.cy*TILE+TILE/2,17);
      if(pos)G.chests.push({...pos,opened:false});
    }
  }
  for(let i=0;i<26;i++) part(rand(0,w.W*TILE),rand(0,w.H*TILE),rand(-6,6),rand(-14,-4),rand(3,7),rand(1,2.4),'rgba(255,180,94,.5)',true);
  musicInt=clamp(.15+f*.07,0,.75);
}
function descend(){
  if(G.descending || G.state!=="playing" || G.dead || (G.run.won&&!G.run.wonShown)) return; G.descending=true;
  const f=G.floor, token=G.run;
  sfx('portal');
  G.player.hp=Math.min(G.player.maxHp, G.player.hp+Math.round(G.player.maxHp*(G.floor<=10?.15:.08)));
  save.bestFloor=Math.max(save.bestFloor,f); markSave();
  const bonus=Math.round(f<=10?4+2*f:8+f*.7);
  addEss(bonus);
  addText(G.player.x,G.player.y-30,'+'+bonus+' DESCENT ESSENCE','#d8bdff',13);
  T('fade').style.opacity=1;
  setTimeout(()=>{
    if(G.run!==token || G.dead || G.state==="menu"){ G.descending=false; T('fade').style.opacity=0; return; }
    setupFloor(f+1);
    G.descending=false;
    toast(floorName(f+1), (bossFloorAt(f+1)?'floor '+(f+1)+' · guardian awaits':'floor '+(f+1)));
    musicInt=clamp(.15+(f+1)*.07,0,.75);
    T('fade').style.opacity=0; saveNow();
  },520);
}
function addEss(v){
  v=Math.round(v*META.ess); if(v<=0)return;
  G.run.ess+=v; save.essence+=v; save.totalEssence+=v; markSave();
}
function gainXP(v){
  const run=G.run;
  run.xp+=v*G.player.xpMul;
  while(run.xp>=needXP(run.level)){
    run.xp-=needXP(run.level); run.level++; save.bestLevel=Math.max(save.bestLevel,run.level);
    G.pendingLevels++;
  }
  if(G.pendingLevels>0 && G.state==='playing') triggerLevelup();
}
function triggerLevelup(){
  G.opts.freeChoice=false; setState('levelup');
  interactQueued=false; dashQueued=false;
  sfx('levelup');
  const p=G.player;
  burst(p.x,p.y,24,'#8ff7ff',240,.7,2.6,true);
  T('luTitle').textContent='LEVEL '+G.run.level;
  T('luSub').textContent='CHOOSE A BLESSING · PRESS 1 · 2 · 3';
  buildCards();
  show('levelup');
}
function openLevelup(free){
  G.opts.freeChoice=free;
  setState('levelup');
  interactQueued=false; dashQueued=false;
  if(free) G.pendingLevels++;
  T('luTitle').textContent= free ? 'TREASURE' : 'LEVEL '+G.run.level;
  T('luSub').textContent= free ? 'THE CACHE OFFERS A GIFT' : 'CHOOSE A BLESSING · PRESS 1 · 2 · 3';
  buildCards();
  show('levelup');
}
function buildCards(){
  const u=G.run.up;
  let pool=POOL.filter(o=>(u[o.id]||0)<o.max&&(!o.unlock||armoryData()[o.unlock]));
  if(pool.length===0) pool=[{id:'hp',r:0,max:99,w:1,icon:'heart',name:'Emberglow',ds:'Restore 25 HP'}];
  const picks=(G.restoreCardIds||[]).map(id=>POOL.find(o=>o.id===id)).filter(Boolean);G.restoreCardIds=null;if(picks.length)pool=[];
  while(picks.length<3 && pool.length){
    let tw=0; pool.forEach(o=>tw+=o.w*(o.r===0?1:(o.r===1 ? .55 : .3)));
    let roll=Math.random()*tw, sel=pool[0];
    for(const o of pool){ roll-=o.w*(o.r===0?1:(o.r===1 ? .55 : .3)); if(roll<=0){sel=o;break;} }
    picks.push(sel); pool=pool.filter(o=>o!==sel);
  }
  const wrap=T('cards'); wrap.innerHTML='';
  picks.forEach((o,i)=>{
    const st=G.run.up[o.id]||0;
    const el=document.createElement('button');
    el.className='card'; el.dataset.r=o.r; el.type='button';
    let pips='';
    if(o.max<=8){ pips='<div class="pips">'+Array.from({length:o.max},(_,k)=>`<em class="${k<st?'on':''}"></em>`).join('')+'</div>'; }
    el.innerHTML=`<span class="key">${i+1}</span><div class="rar">${RARITY[o.r].n}</div>
      <div class="ic"><i data-lucide="${o.icon}"></i></div>
      <div class="nm cinzel">${o.name}</div><div class="ds">${o.ds}</div>${pips}<div class="card-rank">${st ? "RANK "+(st+1) : "NEW BLESSING"}</div>`;
    on(el,'click',()=>chooseCard(i));
    el._up=o;
    wrap.appendChild(el);
  });
  G.cardPool=picks;
  refreshIcons();
}
function chooseCard(i){
  if(G.state!=='levelup'||!G.cardPool||!G.cardPool[i]) return;
  const o=G.cardPool[i];
  G.run.up[o.id]=(G.run.up[o.id]||0)+1;
  if(o.id==='hp') G.player.hp+=25;
  recalc();
  addChip(o);
  sfx('buy');
  G.pendingLevels=Math.max(0,G.pendingLevels-1);
  G.cardPool=null;
  if(G.pendingLevels>0){ triggerLevelup(); }
  else{
    hide('levelup');
    setState('playing');
    G.player.hitCd=Math.max(G.player.hitCd,.8); nova(G.player.x,G.player.y,150,30);
  }
  saveNow();
}
function addChip(o){
  const wrap=T('chips');
  let el=wrap.querySelector(`[data-up="${o.id}"]`);
  const n=G.run.up[o.id];
  if(!el){
    el=document.createElement('span');
    el.className='chip'+(o.r===1?' r1':o.r===2?' r2':'');
    el.dataset.up=o.id; el.title=o.name+' — '+o.ds;
    el.innerHTML=`<i data-lucide="${o.icon}"></i><b>${n}</b>`;
    wrap.appendChild(el);
    refreshIcons();
  } else el.querySelector('b').textContent=n;
}

function statBoxes(el,floor,level,kills,time){
  el.innerHTML=`
   <div class="sbox"><div class="v">${floor}</div><div class="k">FLOOR</div></div>
   <div class="sbox"><div class="v">${level}</div><div class="k">LEVEL</div></div>
   <div class="sbox"><div class="v">${kills}</div><div class="k">KILLS</div></div>
   <div class="sbox"><div class="v">${Math.floor(time/60)}:${String(Math.floor(time%60)).padStart(2,'0')}</div><div class="k">TIME</div></div>`;
}
function die(){
  if(G.dead) return;
  G.dead=true; save.resume=null; G.victoryPending=0; setState('dying');
  interactQueued=false; dashQueued=false; mouse.down=false;
  const p=G.player;
  burst(p.x,p.y,30,'#ffb45e',260,.9,3,true);
  burst(p.x,p.y,16,'#ff5d4d',180,.7,2.4,true);
  G.cam.shake=1;
  sfx('death');
  save.bestFloor=Math.max(save.bestFloor,G.floor);
  save.bestLevel=Math.max(save.bestLevel,G.run.level);
  saveNow();
  const token=G.run; setTimeout(()=>{
    if(G.run!==token || !G.dead) return;
    setState('dead');
    statBoxes(T('dStats'),G.floor,G.run.level,G.run.kills,G.run.t);
    T('dEssBox').innerHTML=`ESSENCE GATHERED&nbsp;&nbsp;<b>◆ ${fmt(G.run.ess)}</b>`;
    show('dead');
    musicInt=.1;
  },1300);
}
function victory(){
  if(G.state!=='playing'||G.dead||!G.run||G.run.wonShown)return;
  G.run.wonShown=true;G.victoryPending=0;setState('win');
  save.victories++;save.bestFloor=Math.max(save.bestFloor,G.floor);save.bestLevel=Math.max(save.bestLevel,G.run.level);
  addEss(150);sfx('victory');
  statBoxes(T('wStats'),G.floor,G.run.level,G.run.kills,G.run.t);
  T('wEssBox').innerHTML=`ESSENCE GATHERED&nbsp;&nbsp;<b>◆ ${fmt(G.run.ess)}</b>`;
  show('win');saveNow();
}
function pauseGame(onOff){
  if(G.state!=='playing' && G.state!=='paused') return;
  if(onOff && G.state==='playing'){
    G.paused=true; setState('paused');
    interactQueued=false; dashQueued=false; mouse.down=false;
    statBoxes(T('pStats'),G.floor,G.run.level,G.run.kills,G.run.t);
    show('pause'); saveNow();
  } else if(!onOff && G.state==='paused'){
    G.paused=false; hide('pause'); setState('playing');
  }
}
function abandonRun(){
  G.paused=false; hide('pause');
  G.dead=true; save.resume=null;
  save.bestFloor=Math.max(save.bestFloor,G.floor);
  save.bestLevel=Math.max(save.bestLevel,G.run.level);
  saveNow();
  backToMenu();
}
function backToMenu(){
  hide('dead'); hide('win'); hide('pause'); hide('levelup'); hide('skills'); G.skillsOpen=false;
  G.run=null; G.world=null; G.parts=[]; clearInput(); setState('menu');
  show('menu');
  refreshMenuStats();
  musicInt=0;
}
function onEscKey(){
  if(T('confirmRun').classList.contains('open')){hide('confirmRun');return;}
  if(T('settings').classList.contains('open')){hide('settings');return;}
  if(G.skillsOpen){ closeTree(); return; }
  if(T('howto').classList.contains('open')){ hide('howto'); return; }
  if(G.state==='playing') pauseGame(true);
  else if(G.state==='paused') pauseGame(false);
}

function update(dt){
  const p=G.player, w=G.world, run=G.run;
  if(G.descending)return;
  if(combatTick(dt))return;
  run.t+=dt; G.t+=dt;
  if(G.victoryPending>0){G.victoryPending-=dt;if(G.victoryPending<=0){victory();return;}}
  if(keys.KeyJ||touchInput.fire){aimTarget=nearestTarget();}else{aimTarget=null;}
  if(xpComboT>0){ xpComboT-=dt; if(xpComboT<=0) xpCombo=0; }
  let mx=0,my=0;
  if(keys.KeyW||keys.ArrowUp)my-=1;
  if(keys.KeyS||keys.ArrowDown)my+=1;
  if(keys.KeyA||keys.ArrowLeft)mx-=1;
  if(keys.KeyD||keys.ArrowRight)mx+=1;
  mx+=touchInput.moveX;my+=touchInput.moveY;
  if(mx||my){ const l=Math.hypot(mx,my); mx/=l; my/=l; }
  p.moving=!!(mx||my);
  p.dashCdT-=dt;
  dashBufferT=Math.max(0,dashBufferT-dt);
  if(dashQueued){
    if(p.dashCdT<=0 && p.dashT<=0){
      dashQueued=false;dashBufferT=0;
      const a=(mx||my)?Math.atan2(my,mx):aimAngle();
      p.dashT=.16+(META.dashIFrame||0); p.dashDx=Math.cos(a); p.dashDy=Math.sin(a);
      p.dashCdT=p.dashCd;
      if(p.reloadT>0)p.reloadT=0;
      sfx('dash');
      burst(p.x,p.y,8,'#ffd88a',140,.35,2,true);
    }else if(dashBufferT<=0)dashQueued=false;
  }
  if(p.dashT>0){
    p.dashT-=dt;
    moveEnt(w,p,p.dashDx*560*(META.dashSpeed||1)*(p.dashDistance||1)*dt,p.dashDy*560*(META.dashSpeed||1)*(p.dashDistance||1)*dt);
    part(p.x,p.y,rand(-20,20),rand(-20,20),.3,4,'rgba(255,200,110,.7)',true);
    p.ghostT-=dt;
    if(p.ghostT<=0){ p.ghostT=.022;
      p.ghosts.push({x:p.x,y:p.y+2,rot:Math.atan2(p.dashDy,p.dashDx)+Math.PI/2,life:1}); }
  } else {
    const sp=p.speed*(p.pathSpeed||1)*(p.meleeWindT>0?.72:p.meleeHitT>0?.86:1)*(p.reloadT>0?.76:1);
    moveEnt(w,p,mx*sp*dt+p.kbx*dt,my*sp*dt+p.kby*dt);
  }
  p.kbx*=Math.pow(.0005,dt); p.kby*=Math.pow(.0005,dt);
  p.hitCd-=dt; p.shotT-=dt; p.muzzle-=dt;
  p.lean=lerp(p.lean, mx*0.26, 1-Math.exp(-dt*9));
  for(let i=p.ghosts.length-1;i>=0;i--){
    const g=p.ghosts[i]; g.life-=dt*3.4;
    if(g.life<=0) p.ghosts.splice(i,1);
  }
  if(p.regen>0&&p.hp<p.maxHp) p.hp=Math.min(p.maxHp,p.hp+p.regen*dt);
  p.face=aimAngle();
  if((mouse.down || keys.KeyJ || touchInput.fire) && p.shotT<=0) fireVolley();
  if(p.orbN>0){
    p.orbA+=dt*2.7*(p.orbitRate||1);
    for(let i=0;i<p.orbN;i++){
      const a=p.orbA+i/p.orbN*TAU;
      const ox=p.x+Math.cos(a)*64, oy=p.y+Math.sin(a)*64;
      for(const e of G.enemies){
        if(e.dead||e.orbT>0) continue;
        if(d2(ox,oy,e.x,e.y)<(e.r+11)*(e.r+11)){
          e.orbT=.35;
          const crit=chance(p.critC); damageEnemy(e,p.dmg*.45*(p.orbitPower||1)*(crit?2:1),Math.atan2(e.y-p.y,e.x-p.x),crit,1,'orbital');
          burst(ox,oy,3,'#ffd88a',120,.25,2,true);
        }
      }
    }
  }
  if(interactQueued){
    interactQueued=false;
    if(G.portal && G.portal.active && d2(p.x,p.y,G.portal.x,G.portal.y)<80*80) descend();
  }
  if(G.descending)return;
  updateEnemies(dt); if(G.state!=='playing')return;
  updateBullets(dt); if(G.state!=='playing')return;
  updateEBullets(dt); if(G.state!=='playing')return;
  updatePicks(dt); if(G.state!=='playing'){updateHUD(0);return;}
  updateFx(dt);
  for(const c of G.chests){
    if(!c.opened && d2(p.x,p.y,c.x,c.y)<30*30){openChest(c);if(G.state!=="playing")return;}
  }
  const ptx=Math.floor(p.x/TILE), pty=Math.floor(p.y/TILE);
  for(let j=-7;j<=7;j++) for(let i=-7;i<=7;i++){
    if(i*i+j*j>52) continue;
    const tx=ptx+i, ty=pty+j;
    if(tx>=0&&ty>=0&&tx<w.W&&ty<w.H && !w.reveal[ty*w.W+tx]){ w.reveal[ty*w.W+tx]=1; w.mmDirty=true; }
  }
  const cam=G.cam;
  const tx=p.x-G.w/2, ty=p.y-G.h/2;
  cam.x=lerp(cam.x,tx,1-Math.exp(-dt*7));
  cam.y=lerp(cam.y,ty,1-Math.exp(-dt*7));
  cam.shake=Math.max(0,cam.shake-dt*2.4);
  saveTimer+=dt;
  if(saveTimer>3){saveTimer=0;saveNow();}
  updateHUD(dt);
}
function updateEnemies(dt){
  const p=G.player, w=G.world, es=G.enemies;
  for(let idx=es.length-1;idx>=0;idx--){
    const e=es[idx];
    if(e.dead){ es.splice(idx,1); continue; }
    e.hitT-=dt; e.orbT-=dt; e.atkT-=dt; e.t1-=dt;
    const dx=p.x-e.x, dy=p.y-e.y, dd=dx*dx+dy*dy, d=Math.sqrt(dd)||.0001;
    if(!e.aggro && d<enemyNoticeRange(e) && los(w,e.x,e.y,p.x,p.y) && canWakeEnemy(e)) e.aggro=true;
    let vx=0, vy=0;
    if(e.aggro){
      switch(e.ai){
        case 'chase': vx=dx/d*e.spd; vy=dy/d*e.spd; break;
        case 'zigzag':{
          const s=Math.sin(G.t*3.2+e.seed)*.7;
          const ca=Math.cos(s), sa=Math.sin(s);
          vx=(dx/d*ca-dy/d*sa)*e.spd; vy=(dx/d*sa+dy/d*ca)*e.spd; break; }
        case 'ranged':{
          const want=230;
          if(d>want+40){vx=dx/d*e.spd;vy=dy/d*e.spd;}
          else if(d<want-40){vx=-dx/d*e.spd;vy=-dy/d*e.spd;}
          else { vx=-dy/d*e.spd*.5; vy=dx/d*e.spd*.5; }
          if(e.t1<=0 && d<430 && los(w,e.x,e.y,p.x,p.y)){
            e.t1=rand(1.9,2.5);
            enemyShoot(e,Math.atan2(dy,dx),175,e.dmg+6);
          }
          break; }
        case 'wisp':{
          const s=Math.sin(G.t*4+e.seed)*.5;
          vx=(dx/d)*e.spd+(-dy/d)*s*e.spd; vy=(dy/d)*e.spd+(dx/d)*s*e.spd;
          if(e.t1<=0){
            e.t1=rand(4,5.5);
            burst(e.x,e.y,10,e.col,150,.4,2,true);
            const a=Math.random()*TAU, rr=rand(140,190);
            const nx=clamp(p.x+Math.cos(a)*rr,TILE,w.W*TILE-TILE), ny=clamp(p.y+Math.sin(a)*rr,TILE,w.H*TILE-TILE);
            if(!solidPx(w,nx,ny)){ e.x=nx; e.y=ny; }
            burst(e.x,e.y,10,e.col,150,.4,2,true);
            e.atkT=.7;
          }
          break; }
        case 'gate': gateEnemyAI(e,dt,d,dx,dy); break;
        case 'warden': wardenAI(e,dt,d,dx,dy); break;
        case 'garden': gardenEnemyAI(e,dt,d,dx,dy); break;
        case 'matriarch': matriarchAI(e,dt,d,dx,dy); break;
        case 'late': lateEnemyAI(e,dt,d,dx,dy); break;
        case 'lateBoss': lateBossAI(e,dt,d,dx,dy); break;
        case 'boss': bossAI(e,dt,d,dx,dy); break;
      }
      if(!e.isBoss || e.phase!==2){
        moveEnt(w,e,vx*dt+e.kbx*dt,vy*dt+e.kby*dt);
      }
    }
    e.kbx*=Math.pow(.001,dt); e.kby*=Math.pow(.001,dt);
    if(e.dmg>0 && !(e.lateBoss&&(e.bs.mode==='submerge'||e.bs.airborne)) && e.atkT<=0 && d<e.r+p.r+2){
      e.atkT=.7;
      hurtPlayer(e.dmg,e.x,e.y); if(G.dead)return;
    }
  }
  for(let i=0;i<es.length;i++){
    const a=es[i]; if(a.dead)continue;
    for(let j=i+1;j<es.length;j++){
      const b=es[j]; if(b.dead)continue;
      const dx=b.x-a.x, dy=b.y-a.y, rr=a.r+b.r;
      const dd=dx*dx+dy*dy;
      if(dd<rr*rr && dd>.01){
        const d=Math.sqrt(dd), push=(rr-d)*.4;
        const ux=dx/d, uy=dy/d;
        if(!a.isBoss){moveEnt(w,a,-ux*push,-uy*push);}
        if(!b.isBoss){moveEnt(w,b,ux*push,uy*push);}
      }
    }
  }
}
function bossAI(b,dt,d,dx,dy){
  const p=G.player;
  if(!G.bossActive){
    G.bossActive=true;
    T('bossname').textContent=b.name;
    T('bossbar').classList.add('on');
    toast(b.name,'slay the guardian to break the seal');
    sfx('boss');
  }
  musicInt=.95;
  const enrage=b.hp<b.max*.5;
  b.t2-=dt; b.t3-=dt; b.summonT-=dt;
  if(b.burstLeft>0){b.burstTimer-=dt;if(b.burstTimer<=0){for(let a=-1;a<=1;a++)enemyShoot(b,b.burstAngle+a*.13,215+b.tier*10,Math.floor(b.dmg*.6)+1);b.burstLeft--;b.burstTimer=.14;}}
  if(b.phase===2){
    b.chargeT-=dt;
    const wallHit=moveEnt(G.world,b,b.cvx*BOSS_TUNING.chargeSpeed*dt,b.cvy*BOSS_TUNING.chargeSpeed*dt);
    part(b.x,b.y,rand(-30,30),rand(-30,30),.3,4,'rgba(255,93,126,.7)',true);
    if(b.chargeT<=0 || wallHit){ b.phase=0; b.t2=rand(1,1.6); }
    return;
  }
  if(b.phase===1){
    b.teleT-=dt;
    if(b.teleT<=0){
      b.phase=2; b.chargeT=.55;
      sfx('roar2');
    }
    return;
  }
  b.x+=dx/d*b.spd*dt; b.y+=dy/d*b.spd*dt;
  collideCircle(G.world,b);
  if(b.t2<=0){
    const roll=Math.random();
    if(d>300 && roll<(enrage ? .4 : .25)){ b.phase=1; b.teleT=BOSS_TUNING.chargeWarning; const a=Math.atan2(dy,dx); b.cvx=Math.cos(a); b.cvy=Math.sin(a); sfx('charge'); }
    else if(roll<.55){ bossRing(b, enrage?18:14, 150+b.tier*8); b.t2=enrage?1.9:2.5; }
    else {
      const base=Math.atan2(dy,dx);
      b.burstLeft=3;b.burstTimer=0;b.burstAngle=base;
      b.t2=enrage?1.8:2.4;
    }
    if(b.t2<=0) b.t2=2;
  }
  if(b.summonT<=0 && G.enemies.length<26){
    b.summonT=enrage?7:11;
    for(let i=0;i<3;i++){
      const a=Math.random()*TAU;
      const type=pickA(['slime','bat','mite']),pos=safePosition(G.world,b.x+Math.cos(a)*60,b.y+Math.sin(a)*60,ETYPES[type].r);
      if(pos){const m=spawnEnemy(type,pos.x,pos.y,false);m.aggro=true;}
    }
    burst(b.x,b.y,16,'#b06cff',200,.5,2.4,true);
    sfx('roar2');
  }
}
function updateBullets(dt){
  const w=G.world,bs=G.bullets;
  for(let i=bs.length-1;i>=0;i--){
    const b=bs[i];b.life-=dt;let remove=b.life<=0;
    const steps=Math.max(1,Math.ceil(Math.hypot(b.vx,b.vy)*dt/6));
    for(let step=0;step<steps&&!remove;step++){
      b.x+=b.vx*dt/steps;b.y+=b.vy*dt/steps;
      if(solidPx(w,b.x,b.y)){burst(b.x,b.y,3,'#ffc46b',90,.2,1.6,true);remove=true;break;}
      for(const e of G.enemies){
        if(e.dead||b.hits?.has(e)||d2(b.x,b.y,e.x,e.y)>=(e.r+b.r)**2)continue;
        const crit=chance(G.player.critC);damageEnemy(e,b.dmg*(crit?2:1),Math.atan2(b.vy,b.vx),crit,1,b.melee?'meleeWave':'shot');
        if(!b.hits)b.hits=new Set();b.hits.add(e);
        if(b.pierce>0)b.pierce--;
        else if(b.ric>0){
          b.ric--;let best=null,dist=(b.ricRange||270)**2;
          for(const other of G.enemies){const dd=d2(b.x,b.y,other.x,other.y);if(!other.dead&&!b.hits.has(other)&&dd<dist&&los(w,b.x,b.y,other.x,other.y)){best=other;dist=dd;}}
          if(best){const a=Math.atan2(best.y-b.y,best.x-b.x),spd=Math.hypot(b.vx,b.vy);b.vx=Math.cos(a)*spd;b.vy=Math.sin(a)*spd;b.dmg*=b.ricPower||.7;b.life=Math.max(b.life,.5);}else remove=true;
        }else remove=true;
        break;
      }
    }
    if(remove)bs.splice(i,1);
  }
}
function updateEBullets(dt){
  const w=G.world,p=G.player,bs=G.ebul;
  for(let i=bs.length-1;i>=0;i--){
    const b=bs[i];b.life-=dt;let remove=b.life<=0;
    const steps=Math.max(1,Math.ceil(Math.hypot(b.vx,b.vy)*dt/6));
    for(let step=0;step<steps&&!remove;step++){
      b.x+=b.vx*dt/steps;b.y+=b.vy*dt/steps;
      if(solidPx(w,b.x,b.y))remove=true;
      else if(d2(b.x,b.y,p.x,p.y)<(b.r+p.r)**2){hurtPlayer(Math.max(1,Math.round(b.dmg)),b.x-b.vx*.05,b.y-b.vy*.05);remove=true;}
    }
    if(remove)bs.splice(i,1);if(G.dead)return;
  }
}
function updatePicks(dt){
  const p=G.player, ps=G.picks;
  for(let i=ps.length-1;i>=0;i--){
    const o=ps[i];
    o.t+=dt*3;
    o.x+=o.vx*dt; o.y+=o.vy*dt;
    o.vx*=Math.pow(.01,dt); o.vy*=Math.pow(.01,dt);
    const dd=d2(o.x,o.y,p.x,p.y), d=Math.sqrt(dd)||.0001;
    if(d<p.magnet){
      const pull=520*(1.6-d/p.magnet);
      o.x+=(p.x-o.x)/d*pull*dt; o.y+=(p.y-o.y)/d*pull*dt;
    }
    if(d<p.r+13){
      if(o.kind==='xp'){ gainXP(o.val); sfx('xp'); burst(o.x,o.y,2,'#8ff7ff',70,.25,1.6,true); }
      else if(o.kind==='ess'){ addEss(o.val); sfx('ess'); burst(o.x,o.y,4,'#c99bff',90,.3,1.8,true); }
      else { p.hp=Math.min(p.maxHp,p.hp+o.val); addText(p.x,p.y-20,'+'+o.val,'#ff8ba0',13); sfx('heart'); burst(o.x,o.y,5,'#ff5d76',100,.35,2,true); }
      ps.splice(i,1); if(G.state!=="playing")return;
    }
  }
}
function updateFx(dt){
  for(let i=G.parts.length-1;i>=0;i--){
    const o=G.parts[i];
    o.life-=dt;
    if(o.life<=0){ G.parts.splice(i,1); continue; }
    o.x+=o.vx*dt; o.y+=o.vy*dt;
    o.vx*=Math.pow(.05,dt); o.vy*=Math.pow(.05,dt);
  }
  for(let i=G.texts.length-1;i>=0;i--){
    const o=G.texts[i];
    o.life-=dt; o.y+=o.vy*dt; o.vy*=.96;
    if(o.life<=0) G.texts.splice(i,1);
  }
}
