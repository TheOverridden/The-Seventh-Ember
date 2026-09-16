/* ========================================================================
   PORTABLE EDITION — artwork, sound, UI, and saves stay inside this project.
   Boss names/ranks remain above in BOSS_NAMES / BOSS_RANK. Shared tuning below
   deliberately preserves the live build's combat values for future iteration.
   ======================================================================== */
const BOSS_TUNING={baseHp:260,chargeSpeed:430,chargeWarning:.8};
let entitySerial=0,aimTarget=null,selectedNode=null,storageMessage='',pendingImport=null,confirmCallback=null;
const deepCopy=o=>JSON.parse(JSON.stringify(o));
function offlineIcons(){
  const paths={
    play:'M8 4l12 8-12 8z', 'arrow-down':'M12 3v18m-7-7 7 7 7-7',
    gem:'M6 3h12l4 7-10 12L2 10z M2 10h20M6 3l6 19 6-19',
    sparkles:'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z',
    'book-open':'M12 5v16M3 3l9 2 9-2v16l-9 2-9-2z',
    music:'M9 17V5l11-2v12M9 17c0 4-6 4-6 1s6-4 6-1M20 15c0 4-6 4-6 1s6-4 6-1',
    'volume-2':'M3 9h4l5-5v16l-5-5H3z M16 8q6 4 0 8M19 4q9 8 0 16',
    heart:'M12 21S2 15 2 8a5 5 0 0 1 10-2A5 5 0 0 1 22 8c0 7-10 13-10 13z',
    sword:'M4 20 19 5l2-3-5 2L3 17m1-6 9 9',zap:'M13 2 3 14h8l-1 8 11-14h-8z',
    wind:'M2 8h14q7 0 4-5M2 12h18M2 16h12q7 0 4 5',
    copy:'M8 8h13v13H8zM4 16H2V2h14v2',target:'M2 12h20M12 2v20M12 5a7 7 0 1 0 0 14 7 7 0 1 0 0-14',
    eye:'M1 12q11-16 22 0-11 16-22 0zM12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6',
    magnet:'M4 2v12a8 8 0 0 0 16 0V2h-5v12a3 3 0 0 1-6 0V2zM4 7h5M15 7h5',
    activity:'M2 12h5l3-9 4 18 3-9h5',orbit:'M3 20C-4 9 18-6 22 5S7 31 3 20M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6',
    feather:'M3 21 17 7M7 17l-2-8L14 2q10-3 8 7l-8 9z',
    'refresh-ccw':'M3 10a9 9 0 0 1 16-5l3 3M22 2v6h-6M21 14a9 9 0 0 1-16 5l-3-3M2 22v-6h6',
    'rotate-ccw':'M3 10a9 9 0 1 1 1 9M3 3v7h7',
    axe:'M5 22 17 2M13 6l7-2q6 8-2 12l-8-4',
    flame:'M12 2S4 8 4 15a8 8 0 0 0 16 0c0-5-4-8-4-8l-2 5z',
    skull:'M5 16a9 9 0 1 1 14 0v6H5zM8 11h1m6 0h1M10 18v4m4-4v4',
    timer:'M9 2h6M12 2v3M12 7a7 7 0 1 0 0 14 7 7 0 1 0 0-14M12 10v5l3 2',
    map:'M2 5l7-3 6 3 7-3v17l-7 3-6-3-7 3zM9 2v17M15 5v17',
    home:'M2 11 12 2l10 9M5 9v13h14V9M10 22v-8h4v8',
    trophy:'M7 2h10v8a5 5 0 0 1-10 0zM7 4H2v3q0 5 5 5m10-8h5v3q0 5-5 5M12 15v7M7 22h10',
    mouse:'M7 10V7a5 5 0 0 1 10 0v10a5 5 0 0 1-10 0zM12 3v6'
  };
  document.querySelectorAll('i[data-lucide]').forEach(el=>{
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.6');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',paths[el.dataset.lucide]||paths.sparkles);svg.appendChild(p);el.replaceWith(svg);
  });
}
function resetTouchInput(){touchInput.moveX=touchInput.moveY=touchInput.aimX=touchInput.aimY=0;touchInput.aimActive=touchInput.fire=false;touchInput.movePointer=touchInput.aimPointer=null;for(const id of ['moveStick','aimStick']){const el=T(id);if(!el)continue;el.classList.remove('active');const knob=el.querySelector('.touch-knob');if(knob)knob.style.transform='translate(0px,0px)';}}
function clearInput(){for(const k in keys)keys[k]=false;mouse.down=false;interactQueued=false;dashQueued=false;aimTarget=null;resetTouchInput();}
function anyBlockingOverlay(){return G.skillsOpen||['howto','settings','confirmRun'].some(id=>T(id).classList.contains('open'));}
function nearestTarget(){
  if(!G.player)return null;let best=null,dist=600*600;
  for(const e of G.enemies){if(e.dead)continue;const dd=d2(G.player.x,G.player.y,e.x,e.y);if(dd<dist&&los(G.world,G.player.x,G.player.y,e.x,e.y)){best=e;dist=dd;}}
  return best;
}
function aimAngle(){
  const p=G.player;
  if(touchInput.aimActive&&Math.hypot(touchInput.aimX,touchInput.aimY)>.12)return Math.atan2(touchInput.aimY,touchInput.aimX);
  if(keys.KeyJ&&aimTarget&&!aimTarget.dead)return Math.atan2(aimTarget.y-p.y,aimTarget.x-p.x);
  if(keys.KeyJ)return p.face||0;
  return Math.atan2(mouse.y+G.cam.y-p.y,mouse.x+G.cam.x-p.x);
}
function safePosition(w,x,y,r){
  const free=(px,py)=>{
    for(let a=0;a<12;a++){const t=a/12*TAU;if(solidPx(w,px+Math.cos(t)*r,py+Math.sin(t)*r))return false;}
    return !solidPx(w,px,py);
  };
  if(free(x,y))return{x,y};
  for(let ring=1;ring<=5;ring++)for(let oy=-ring;oy<=ring;oy++)for(let ox=-ring;ox<=ring;ox++){
    if(Math.max(Math.abs(ox),Math.abs(oy))!==ring)continue;
    const px=(Math.floor(x/TILE)+ox+.5)*TILE,py=(Math.floor(y/TILE)+oy+.5)*TILE;
    if(free(px,py))return{x:px,y:py};
  }
  return null;
}
function fitTree(){
  if(!G.skillsOpen)return;const frame=document.querySelector('.tree-map'),wrap=T('treeWrap');
  const width=Math.min(frame.clientWidth-18,(frame.clientHeight-18)*1240/980);
  wrap.style.width=Math.max(100,width)+'px';wrap.style.height=Math.max(80,width*980/1240)+'px';
}
function selectNode(n){
  selectedNode=n;treeHover=n;const st=nodeState(n);paintSigilBadge(n);
  T('nodeTitle').textContent=n.name;T('nodeDesc').textContent=n.desc;
  T('nodePrice').textContent=st===2?'✓ Owned':'◆ '+n.cost;
  T('nodeStatus').textContent=st===0?'Requires '+NODE_BY_ID[n.req].name:st===1?'Collect '+(n.cost-save.essence)+' more essence':st===2?'Carried into every new descent.':'Ready to unlock for your next descent.';
  T('btnUnlock').disabled=st!==3;T('btnUnlock').textContent=st===2?'UNLOCKED':'UNLOCK SIGIL';
  document.querySelectorAll('[data-node]').forEach(el=>{const node=NODE_BY_ID[el.dataset.node],state=nodeState(node);el.classList.toggle('selected',node===n);el.setAttribute('aria-pressed',String(node===n));el.setAttribute('aria-label',node.name+' · '+(state===2?'owned':node.cost+' essence'+(state===0?' · locked':'')));});
  const m=computeMeta();T('metaTotal').innerHTML=`NEXT DESCENT<br><b>+${Math.round((m.dmg-1)*100)}%</b> damage · <b>+${m.hp}</b> health<br><b>+${Math.round((m.rate-1)*100)}%</b> casting rate · <b>+${Math.round((m.speed-1)*100)}%</b> speed<br>${Object.keys(save.nodes).length} / ${TREE_NODES.length} sigils awakened`;
}
function applyAudioSettings(){if(!AC)return;const t=AC.currentTime;musDry.gain.setTargetAtTime(save.music?.14:0,t,.08);musSend.gain.setTargetAtTime(save.music?.26:0,t,.08);if(droneG)droneG.gain.setTargetAtTime(save.music?.5:0,t,.08);}
function syncSettings(){
  for(const [id,key] of [['setMusic','music'],['setSfx','sfx'],['setMotion','motion'],['setTouch','touch']])T(id).checked=!!save[key];
  const touchDevice=(typeof navigator!=='undefined'&&navigator.maxTouchPoints>0)||(typeof matchMedia==='function'&&matchMedia('(pointer:coarse)').matches);
  T('setQuality').value=save.quality;document.body.classList.toggle('motion-low',!!save.motion);document.body.classList.toggle('touch',!!save.touch||touchDevice);
  T('btnMusic').classList.toggle('off',!save.music);T('btnSfx').classList.toggle('off',!save.sfx);
  T('btnMusic').setAttribute('aria-pressed',String(!!save.music));T('btnSfx').setAttribute('aria-pressed',String(!!save.sfx));
}
function syncSaveStatus(){
  if(!T('saveStatus'))return;
  T('saveStatus').textContent=storageMessage||'PROGRESS SAVED ON THIS DEVICE';
  T('settingsSave').textContent=storageMessage||'Your essence, skill tree, and current run save automatically. Export a backup before changing browsers or devices.';
  T('settingsSave').classList.toggle('warning',!!storageMessage);
}
function snapshotRun(){
  if(!G.run||!G.world||G.dead||!['playing','paused','levelup','win','winning'].includes(G.state))return;
  const w=G.world;
  // A single storage record makes essence and pickup collection atomic.
  const world={W:w.W,H:w.H,grid:Array.from(w.grid),shade:Array.from(w.shade),deco:Array.from(w.deco),reveal:Array.from(w.reveal),rooms:w.rooms,exit:w.exit,torches:w.torches,props:w.props||[],pi:w.pi};
  save.resume=deepCopy({version:2,floor:G.floor,run:G.run,meta:META,player:{...G.player,ghosts:[]},world,enemies:G.enemies.filter(e=>!e.dead),picks:G.picks,chests:G.chests,portal:G.portal,bullets:G.bullets.map(b=>({...b,hits:b.hits?Array.from(b.hits,e=>e.uid):[]})),ebul:G.ebul,bossUid:G.boss?.uid||0,bossActive:!!G.bossActive,pendingLevels:G.pendingLevels,cardIds:G.cardPool?.map(c=>c.id)||[],freeChoice:!!G.opts.freeChoice,state:G.state==='levelup'?'levelup':'paused',elapsed:G.t||0,descendTo:G.descending?G.floor+1:0});
}
function syncContinue(){
  const has=!!save.resume;T('btnContinue').hidden=!has;T('btnContinue').style.display=has?'inline-flex':'none';T('resumeHint').hidden=!has;
  T('btnStart').textContent=has?'BEGIN A NEW DESCENT':'BEGIN DESCENT';T('btnStart').classList.toggle('primary',!has);T('btnStart').classList.toggle('subtle',has);
  if(has)T('resumeHint').textContent='Floor '+save.resume.floor+' · Level '+save.resume.run.level+' · '+Math.floor(save.resume.run.t/60)+'m played';
  syncSaveStatus();
}
function resumeRun(){
  const r=save.resume;if(!r)return;initAudio();clearInput();
  try{validateCheckpoint(r);}catch(e){storageMessage='This run cannot be restored. Your permanent progress is safe.';save.resume=null;syncContinue();return;}
  const x=deepCopy(r);G.run=x.run;META=x.meta;G.player=x.player;G.player.ghosts=[];G.player.hitCd=Math.max(G.player.hitCd,.8);G.floor=x.floor;G.world=x.world;
  for(const k of ['grid','shade','deco','reveal'])G.world[k]=Uint8Array.from(x.world[k]);G.world.pal=PALETTES[G.world.pi];
  G.enemies=x.enemies;entitySerial=Math.max(0,...G.enemies.map(e=>e.uid));G.boss=G.enemies.find(e=>e.uid===x.bossUid)||null;G.bossActive=!!x.bossActive;
  G.bullets=x.bullets.map(b=>({...b,hits:new Set((b.hits||[]).map(uid=>G.enemies.find(e=>e.uid===uid)).filter(Boolean))}));
  G.ebul=x.ebul;G.picks=x.picks;G.chests=x.chests;G.portal=x.portal;G.parts=[];G.texts=[];G.dead=false;G.paused=false;G.descending=false;G.t=x.elapsed;G.victoryPending=0;G.pendingLevels=x.pendingLevels;G.opts.freeChoice=x.freeChoice;G.cardPool=null;G.skillsOpen=false;
  G.cam={x:G.player.x-G.w/2,y:G.player.y-G.h/2,shake:0};G.player.face=0;mouse.x=G.w/2+100;mouse.y=G.h/2;
  for(const id of ['menu','pause','dead','win','skills','settings','levelup'])hide(id);T('fade').style.opacity=0;T('chips').innerHTML='';
  for(const o of POOL)if(G.run.up[o.id])addChip(o);musicInt=clamp(.15+G.floor*.07,0,.75);
  if(x.descendTo)setupFloor(x.descendTo);
  T('bossbar').classList.toggle('on',!!G.bossActive);if(G.boss)T('bossname').textContent=G.boss.name;
  setState('playing');updateHUD(0);
  if(x.state==='levelup'&&G.pendingLevels>0){G.restoreCardIds=x.cardIds;triggerLevelup();}else pauseGame(true);
}
function validateCheckpoint(r){
  const fail=()=>{throw Error('Invalid run data');}, finite=(v,a=0,b=1e12)=>typeof v==='number'&&Number.isFinite(v)&&v>=a&&v<=b;
  if(!r||r.version!==2||!Number.isInteger(r.floor)||r.floor<1||r.floor>100000||!r.world||!r.run||!r.player||!r.meta)fail();
  const w=r.world;if(!Number.isInteger(w.W)||!Number.isInteger(w.H)||w.W<20||w.W>140||w.H<20||w.H>120||!Number.isInteger(w.pi)||w.pi<0||w.pi>=PALETTES.length)fail();
  for(const k of ['grid','shade','deco','reveal'])if(!Array.isArray(w[k])||w[k].length!==w.W*w.H||w[k].some(n=>!Number.isInteger(n)||n<0||n>(k==='grid'?2:k==='shade'?3:k==='reveal'?1:5)))fail();
  for(const k of ['rooms','torches','props'])if(!Array.isArray(w[k])||w[k].length>300)fail();
  if(!w.exit||!w.rooms.length||!finite(r.player.x,0,w.W*TILE)||!finite(r.player.y,0,w.H*TILE)||!finite(r.player.hp,.01)||!finite(r.player.maxHp,1)||!finite(r.player.r,1,40))fail();
  for(const k of ['level','xp','ess','kills','t'])if(!finite(r.run[k]))fail();
  if(!Number.isInteger(r.run.level)||r.run.level<1||!r.run.up||!['paused','levelup'].includes(r.state)||!finite(r.pendingLevels,0,10000))fail();
  for(const [key,val] of Object.entries(r.run.up)){const o=POOL.find(p=>p.id===key);if(!o||!Number.isInteger(val)||val<0||val>o.max)fail();}
  for(const k of ['dmg','hp','rate','speed','crit','mag','dash','xp','ess'])if(!finite(r.meta[k]))fail();
  for(const k of ['shotT','hitCd','dashT','dashCdT','kbx','kby','orbA','muzzle','face','dashDx','dashDy','ghostT','lean','dmg','shotInt','proj','pierce','ric','regen','orbN','dashCd','xpMul','execB','speed','magnet','critC'])if(!finite(r.player[k],-1e6,9e15))fail();
  for(const k of ['enemies','picks','chests','bullets','ebul','cardIds'])if(!Array.isArray(r[k])||r[k].length>1000)fail();
  if(r.cardIds.some(id=>!POOL.some(o=>o.id===id)&&id!=='emberglow'))fail();
  if(!r.portal||!finite(r.portal.x,0,w.W*TILE)||!finite(r.portal.y,0,w.H*TILE)||typeof r.portal.active!=='boolean')fail();
  for(const e of r.enemies){if(!ETYPES[e.type]&&e.type!=='boss')fail();for(const k of ['x','y','r','hp','max','spd','dmg','xp','uid','kb','kbx','kby','hitT','atkT','seed','t1','t2','orbT'])if(!finite(e[k],-1e6,9e15))fail();if(e.spr!==e.type||!['chase','zigzag','ranged','wisp','boss','gate','warden','garden','matriarch','late','lateBoss'].includes(e.ai))fail();if(e.isBoss)for(const k of ['tier','phase','chargeT','cvx','cvy','summonT','teleT','t3'])if(!finite(e[k],-1e6,1e12))fail();}
  for(const p of r.picks)if(!['xp','ess','heart'].includes(p.kind)||!finite(p.val)||!finite(p.x,-100,w.W*TILE+100)||!finite(p.y,-100,w.H*TILE+100)||!finite(p.vx,-1e4,1e4)||!finite(p.vy,-1e4,1e4)||!finite(p.t,-1e6,1e12))fail();
  for(const b of [...r.bullets,...r.ebul])for(const k of ['x','y','vx','vy','r','dmg','life'])if(!finite(b[k],-1e6,1e12))fail();
  for(const b of r.bullets)if(!Array.isArray(b.hits))fail();
  for(const c of r.chests)if(!finite(c.x,0,w.W*TILE)||!finite(c.y,0,w.H*TILE)||typeof c.opened!=='boolean')fail();
  return r;
}
function validateSave(raw){
  if(!raw||raw.v!==1||typeof raw!=='object')throw Error('Not a VoidFall save');
  const scan=(v,depth=0)=>{if(depth>12)throw Error('Save is too deeply nested');if(typeof v==='number'&&!Number.isFinite(v))throw Error('Invalid value');if(typeof v==='string'&&v.length>200)throw Error('Invalid text');if(v&&typeof v==='object'){if(Array.isArray(v)&&v.length>17000)throw Error('Save is too large');for(const k of Object.keys(v)){if(['__proto__','constructor','prototype'].includes(k))throw Error('Invalid key');scan(v[k],depth+1);}}};scan(raw);
  const clean=DEF_SAVE();for(const k of ['essence','bestFloor','bestLevel','totalRuns','totalKills','totalEssence','victories','guardians']){if(raw[k]!==undefined&&(!Number.isFinite(raw[k])||raw[k]<0))throw Error('Invalid progress');clean[k]=Math.min(1e12,Math.floor(raw[k]||0));}
  for(const k of ['tut','music','sfx','motion','touch'])if(raw[k]!==undefined)clean[k]=raw[k]?1:0;clean.quality=raw.quality==='light'?'light':'full';
  for(const k of ['musicVolume','sfxVolume'])if(Number.isFinite(raw[k]))clean[k]=clamp(raw[k],0,1);
  for(const n of TREE_NODES)if(raw.nodes&&raw.nodes[n.id]===true)clean.nodes[n.id]=true;
  if(raw.resume)clean.resume=validateCheckpoint(raw.resume);return clean;
}
function confirmAction(title,desc,label,fn){confirmCallback=fn;T('confirmTitle').textContent=title;T('confirmText').textContent=desc;T('btnConfirmRun').textContent=label;show('confirmRun');}
function requestStart(){if(save.resume)confirmAction('BEGIN AGAIN?','Your current descent will be replaced. All essence and permanent sigils are kept.','BEGIN AGAIN',startRun);else startRun();}
function openSettings(){if(G.state==='playing')pauseGame(true);syncSettings();syncSaveStatus();T('btnImport').disabled=G.state!=='menu';T('btnImport').title=G.state!=='menu'?'Return to the title screen to import progress':'';show('settings');}
function resetEverything(){
  clearInput();dialogue=null;storyQueue=[];armoryNotices=[];chapterBannerT=fieldNoteT=0;
  pendingImport=null;confirmCallback=null;
  G.run=null;G.world=null;G.player=null;G.boss=null;G.bossActive=false;G.dead=false;G.paused=false;G.descending=false;G.victoryPending=0;G.pendingLevels=0;G.cardPool=null;G.restoreCardIds=null;G.opts.freeChoice=false;G.floor=1;G.t=0;
  for(const k of ['enemies','bullets','ebul','picks','chests','parts','texts'])G[k]=[];
  for(const id of ['settings','confirmRun','pause','dead','win','levelup','skills','howto','memories','chapterClear'])hide(id);
  T('conversation').hidden=true;document.body.classList.remove('conversing');T('importReview').hidden=true;
  T('chapterBanner').classList.remove('visible');T('fieldNote').classList.remove('visible');T('bossbar').classList.remove('on');
  T('fade').style.opacity=0;T('vig').style.opacity=0;T('toasts').replaceChildren();T('chips').replaceChildren();
  save=validateSave(DEF_SAVE());META=computeMeta();G.skillsOpen=false;
  backToMenu();syncSettings();applyAudioSettings();saveNow();refreshMenuStats();T('btnStart').focus({preventScroll:true});
}

function wireAnalogStick(id,kind){
  const stick=T(id),knob=stick.querySelector('.touch-knob'),pointerKey=kind+'Pointer';
  const release=e=>{
    if(touchInput[pointerKey]!==null&&e&&e.pointerId!==touchInput[pointerKey])return;
    touchInput[pointerKey]=null;touchInput[kind+'X']=0;touchInput[kind+'Y']=0;
    if(kind==='aim'){touchInput.aimActive=false;touchInput.fire=false;}
    stick.classList.remove('active');knob.style.transform='translate(0px,0px)';
  };
  const move=e=>{
    if(touchInput[pointerKey]!==e.pointerId)return;
    const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,max=r.width*.34;
    let dx=e.clientX-cx,dy=e.clientY-cy,dist=Math.hypot(dx,dy);if(dist>max){dx*=max/dist;dy*=max/dist;dist=max;}
    const raw=dist/max,mag=raw<.12?0:(raw-.12)/.88,nx=dist?dx/dist*mag:0,ny=dist?dy/dist*mag:0;
    touchInput[kind+'X']=nx;touchInput[kind+'Y']=ny;
    if(kind==='aim'){touchInput.aimActive=mag>0;touchInput.fire=mag>.24;}
    knob.style.transform=`translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px)`;
  };
  on(stick,'pointerdown',e=>{if(G.state!=='playing'||anyBlockingOverlay())return;e.preventDefault();initAudio();touchInput[pointerKey]=e.pointerId;stick.setPointerCapture(e.pointerId);stick.classList.add('active');move(e);});
  on(stick,'pointermove',move);for(const ev of ['pointerup','pointercancel','lostpointercapture'])on(stick,ev,release);
}
function wireTouchAction(id,fn){
  const el=T(id);on(el,'pointerdown',e=>{e.preventDefault();el.classList.add('pressed');if(G.state==='playing'&&!anyBlockingOverlay()){initAudio();fn();}});
  for(const ev of ['pointerup','pointercancel','lostpointercapture'])on(el,ev,()=>el.classList.remove('pressed'));
}
function wireRefinements(){
  syncSettings();syncSaveStatus();
  on(T('btnContinue'),'click',resumeRun);on(T('btnPause'),'click',()=>pauseGame(true));
  on(T('btnSaveExit'),'click',()=>{saveNow();backToMenu();});
  on(T('btnSettings'),'click',openSettings);on(T('btnPauseSettings'),'click',openSettings);on(T('btnSettingsClose'),'click',()=>hide('settings'));
  on(T('btnResetEverything'),'click',()=>confirmAction('RESET EVERYTHING?','This erases all progress: the current run, essence, Skill Tree, ability blessings, records, memories, and settings. All dialogue will play again. This cannot be undone.','YES, RESET EVERYTHING',resetEverything));
  on(T('btnConfirmRun'),'click',()=>{hide('confirmRun');const fn=confirmCallback;confirmCallback=null;if(fn)fn();});on(T('btnCancelRun'),'click',()=>hide('confirmRun'));
  for(const [id,key] of [['setMusic','music'],['setSfx','sfx'],['setMotion','motion'],['setTouch','touch']])on(T(id),'change',()=>{initAudio();save[key]=T(id).checked?1:0;applyAudioSettings();syncSettings();saveNow();});
  on(T('setQuality'),'change',()=>{save.quality=T('setQuality').value;saveNow();});
  on(T('btnExport'),'click',()=>{saveNow();const blob=new Blob([JSON.stringify(save)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='voidfall-save-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);});
  on(T('btnImport'),'click',()=>T('saveFile').click());
  on(T('saveFile'),'change',async()=>{const file=T('saveFile').files[0];if(!file)return;try{if(file.size>1500000)throw Error('File is too large');const raw=JSON.parse(await file.text());if(raw?.progressionEpoch!==SAVE_PROGRESSION_EPOCH){const old=Error('OLD_PROGRESSION_SAVE');old.code='OLD_PROGRESSION_SAVE';throw old;}pendingImport=validateSave(raw);T('importSummary').textContent='Replace current progress with '+pendingImport.essence+' essence, '+Object.keys(pendingImport.nodes).length+' sigils, and best floor '+pendingImport.bestFloor+'? Export your current progress first if you want to keep it.';T('importReview').hidden=false;}catch(e){T('settingsSave').textContent=e?.code==='OLD_PROGRESSION_SAVE'?'That backup is from before the progression rebuild and cannot be restored. Your current progress has not changed.':'That save could not be read. Your current progress has not changed.';T('settingsSave').classList.add('warning');}T('saveFile').value='';});
  on(T('btnImportApply'),'click',()=>{if(!pendingImport)return;save=pendingImport;pendingImport=null;META=computeMeta();saveNow();refreshMenuStats();syncSettings();T('importReview').hidden=true;});
  on(T('btnImportCancel'),'click',()=>{pendingImport=null;T('importReview').hidden=true;});
  wireAnalogStick('moveStick','move');wireAnalogStick('aimStick','aim');
  wireTouchAction('touchDash',()=>dashQueued=true);wireTouchAction('touchEnter',()=>interactQueued=true);
}

/* Menu-only ornaments. These are inline interface shapes, with no image assets. */
function decorateMenus(){
  const emblems={howto:'book-open',pause:'orbit',dead:'flame',win:'sparkles',settings:'gem',confirmRun:'target'};
  for(const [id,icon] of Object.entries(emblems)){
    const panel=T(id).querySelector('.panel');
    if(!panel||panel.querySelector('.menu-emblem'))continue;
    const mark=document.createElement('div');mark.className='menu-emblem';mark.setAttribute('aria-hidden','true');
    mark.innerHTML=`<i data-lucide="${icon}"></i>`;
    panel.prepend(mark);
  }
  const lu=T('luWrap');
  if(!lu.querySelector('.menu-emblem')){
    const mark=document.createElement('div');mark.className='menu-emblem';mark.setAttribute('aria-hidden','true');
    mark.innerHTML='<i data-lucide="sparkles"></i>';lu.prepend(mark);
  }
  const inspector=document.querySelector('.tree-inspector');
  if(inspector&&!T('sigilBadge')){
    const badge=document.createElement('div');badge.id='sigilBadge';badge.className='sigil-badge';badge.setAttribute('aria-hidden','true');
    inspector.querySelector('.eyebrow').after(badge);
  }
  refreshIcons();
}
function paintSigilBadge(n){
  const badge=T('sigilBadge');if(!badge)return;
  const icons={m:'sword',v:'heart',f:'zap',g:'magnet',c:'eye',s:'wind',d:'feather',a:'gem'};
  const icon=n.id==='awaken'?'sparkles':n.id==='wind'?'flame':icons[n.id[0]]||'sparkles';
  badge.innerHTML=`<i data-lucide="${icon}"></i>`;
  badge.classList.toggle('owned',!!save.nodes[n.id]);refreshIcons();
}
