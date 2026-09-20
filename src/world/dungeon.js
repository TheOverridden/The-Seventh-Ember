function genFloor(f){
  const W=88,H=68;
  let grid=null, rooms=null, tries=0;
  while(tries++<40){
    grid=new Uint8Array(W*H); rooms=[];
    for(let a=0;a<100 && rooms.length<11;a++){
      const rw=irand(8,14), rh=irand(7,12);
      const rx=irand(2,W-rw-2), ry=irand(2,H-rh-2);
      let ok=true;
      for(const r of rooms){
        if(rx<r.x+r.w+2 && rx+rw+2>r.x && ry<r.y+r.h+2 && ry+rh+2>r.y){ ok=false; break; }
      }
      if(!ok) continue;
      for(let y=ry;y<ry+rh;y++) for(let x=rx;x<rx+rw;x++) grid[y*W+x]=1;
      rooms.push({x:rx,y:ry,w:rw,h:rh,cx:rx+(rw>>1),cy:ry+(rh>>1)});
    }
    if(rooms.length>=9) break;
  }
  const carve=(x,y)=>{ for(let j=-1;j<=0;j++) for(let i=-1;i<=0;i++){ const tx=x+i,ty=y+j; if(tx>0&&ty>0&&tx<W-1&&ty<H-1) grid[ty*W+tx]=1; } };
  const link=(a,b)=>{
    let x=a.cx,y=a.cy;
    const horizFirst=chance(.5);
    const walkX=()=>{ while(x!==b.cx){ x+=Math.sign(b.cx-x); carve(x,y);} };
    const walkY=()=>{ while(y!==b.cy){ y+=Math.sign(b.cy-y); carve(x,y);} };
    if(horizFirst){walkX();walkY();} else {walkY();walkX();}
  };
  const connected=[rooms[0]], remaining=rooms.slice(1);
  while(remaining.length){
    let ai=0,bi=0,best=Infinity;
    connected.forEach((a,i)=>remaining.forEach((b,j)=>{const dd=d2(a.cx,a.cy,b.cx,b.cy);if(dd<best){best=dd;ai=i;bi=j;}}));
    link(connected[ai],remaining[bi]); connected.push(remaining.splice(bi,1)[0]);
  }
  link(rooms[irand(0,rooms.length-1)],rooms[irand(0,rooms.length-1)]);
  link(rooms[irand(0,rooms.length-1)],rooms[irand(0,rooms.length-1)]);
  let exit=rooms[0],bd=-1;
  for(const r of rooms){ const d=d2(r.cx,r.cy,rooms[0].cx,rooms[0].cy); if(d>bd){bd=d;exit=r;} }
  if(bossFloorAt(f)){
    exit.x=clamp(exit.cx-8,2,W-18); exit.y=clamp(exit.cy-7,2,H-16); exit.w=17; exit.h=15;
    for(let y=exit.y;y<exit.y+exit.h;y++) for(let x=exit.x;x<exit.x+exit.w;x++) grid[y*W+x]=1;
  }
  for(const r of rooms){
    if(r===rooms[0]||r===exit) continue;
    if(r.w>=10&&r.h>=9&&chance(.55)){
      const n=irand(1,3);
      for(let i=0;i<n;i++){ const px=irand(r.x+2,r.x+r.w-3), py=irand(r.y+2,r.y+r.h-3); grid[py*W+px]=2; }
    }
  }
  const shade=new Uint8Array(W*H), deco=new Uint8Array(W*H);
  const solidG=(tx,ty)=> tx<0||ty<0||tx>=W||ty>=H || grid[ty*W+tx]!==1;
  for(let i=0;i<W*H;i++){
    shade[i]=irand(0,3);
    if(grid[i]===1){
      const r=Math.random();
      deco[i]= r<.07 ? 1 : r<.13 ? 2 : r<.15 ? 3 : r<.20 ? 4 : r<.212 ? 5 : 0;
    }
  }
  const props=[];
  const PT=['pr_skull','pr_bones','pr_pot','pr_crate','pr_rubble','pr_shroom'];
  for(const r of rooms){
    const n=irand(2,5);
    for(let k=0;k<n;k++){
      const tx=irand(r.x+1,r.x+r.w-2), ty=irand(r.y+1,r.y+r.h-2);
      if(grid[ty*W+tx]!==1) continue;
      props.push({t:pickA(PT), x:tx*TILE+TILE/2+rand(-7,7), y:ty*TILE+TILE/2+rand(-7,7)});
    }
    if(chance(.55)){
      const bx=irand(r.x+1,r.x+r.w-2);
      if(solidG(bx,r.y-1)) props.push({t:'pr_banner', x:bx*TILE+TILE/2, y:(r.y-1)*TILE+TILE/2+3});
    }
    if(chance(.35)){
      const bx=irand(r.x+1,r.x+r.w-2);
      if(solidG(bx,r.y-1)) props.push({t:'pr_chain', x:bx*TILE+TILE/2, y:(r.y-1)*TILE+TILE/2});
    }
  }
  props.sort((a,b)=>a.y-b.y);
  const torches=[];
  for(const r of rooms){
    const n=irand(2,4);
    for(let i=0;i<n;i++){
      const side=irand(0,3);
      let tx,ty,ox=0,oy=0;
      if(side===0){ tx=irand(r.x,r.x+r.w-1); ty=r.y-1;  oy= TILE*0.42; }
      else if(side===1){ tx=irand(r.x,r.x+r.w-1); ty=r.y+r.h; oy=-TILE*0.30; }
      else if(side===2){ ty=irand(r.y,r.y+r.h-1); tx=r.x-1;  ox= TILE*0.34; }
      else { ty=irand(r.y,r.y+r.h-1); tx=r.x+r.w; ox=-TILE*0.34; }
      if(!solidG(tx,ty)) continue;
      torches.push({x:tx*TILE+TILE/2+ox, y:ty*TILE+TILE/2+oy, s:Math.random()*TAU});
    }
  }
  const pi=Math.floor((f-1)/5)%PALETTES.length;
  return {W,H,grid,rooms,exit,shade,deco,torches,props,pal:PALETTES[pi], pi,
          reveal:new Uint8Array(W*H), mmDirty:true};
}
const isSolidTile=(wld,tx,ty)=> tx<0||ty<0||tx>=wld.W||ty>=wld.H || wld.grid[ty*wld.W+tx]!==1;
function solidPx(wld,wx,wy){ return isSolidTile(wld, Math.floor(wx/TILE), Math.floor(wy/TILE)); }
function collideCircle(wld,e){
  let hit=false;
  for(let it=0;it<2;it++){
    const tx0=Math.floor((e.x-e.r)/TILE), tx1=Math.floor((e.x+e.r)/TILE);
    const ty0=Math.floor((e.y-e.r)/TILE), ty1=Math.floor((e.y+e.r)/TILE);
    for(let ty=ty0;ty<=ty1;ty++) for(let tx=tx0;tx<=tx1;tx++){
      if(!isSolidTile(wld,tx,ty)) continue;
      const cx=clamp(e.x, tx*TILE, tx*TILE+TILE), cy=clamp(e.y, ty*TILE, ty*TILE+TILE);
      const dx=e.x-cx, dy=e.y-cy, dd=dx*dx+dy*dy;
      if(dd < e.r*e.r){
        hit=true;
        if(dd<.00001){
          const opts=[{d:e.x-tx*TILE,x:tx*TILE-e.r,y:e.y},{d:tx*TILE+TILE-e.x,x:tx*TILE+TILE+e.r,y:e.y},{d:e.y-ty*TILE,x:e.x,y:ty*TILE-e.r},{d:ty*TILE+TILE-e.y,x:e.x,y:ty*TILE+TILE+e.r}];
          opts.sort((a,b)=>a.d-b.d); e.x=opts[0].x; e.y=opts[0].y;
        }else{const d=Math.sqrt(dd),push=e.r-d;e.x+=dx/d*push;e.y+=dy/d*push;}
      }
    }
  }
  return hit;
}
function moveEnt(wld,e,dx,dy){
  const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/8));let hit=false;
  for(let i=0;i<steps;i++){e.x+=dx/steps;e.y+=dy/steps;hit=collideCircle(wld,e)||hit;}
  return hit;
}
function los(wld,x1,y1,x2,y2){
  const d=Math.sqrt(d2(x1,y1,x2,y2)), steps=Math.ceil(d/18);
  for(let i=1;i<steps;i++){
    const t=i/steps;
    if(solidPx(wld, lerp(x1,x2,t), lerp(y1,y2,t))) return false;
  }
  return true;
}

function part(x,y,vx,vy,life,size,col,glow){
  if(G.parts.length>420*G.partScale){ G.parts.shift(); }
  G.parts.push({x,y,vx,vy,life,max:life,size,col,glow:!!glow});
}
function burst(x,y,n,col,spd,life,size,glow){
  n=Math.ceil(n*G.partScale);
  for(let i=0;i<n;i++){ const a=Math.random()*TAU, s=rand(.2,1)*spd;
    part(x,y,Math.cos(a)*s,Math.sin(a)*s,rand(.5,1)*life,rand(.6,1.5)*size,col,glow); }
}
function addText(x,y,txt,col,size){
  if(G.texts.length>40) G.texts.shift();
  G.texts.push({x,y,txt,col,size:size||13,life:.9,max:.9,vy:-46});
}
function toast(txt,sub){
  const w=T('toasts');
  const el=document.createElement('div');
  el.className='toast'; el.innerHTML=txt+(sub?`<span class="sub">${sub}</span>`:'');
  w.appendChild(el);
  while(w.children.length>2) w.removeChild(w.firstChild);
  setTimeout(()=>{ if(el.parentNode) el.parentNode.removeChild(el); },3400);
}

const ETYPES={
  slime:   {hp:18, spd:58,  dmg:8,  r:13, xp:3, spr:'slime',   ai:'chase',   col:'#b06cff', ess:.30, kb:1},
  bat:     {hp:10, spd:118, dmg:6,  r:9,  xp:2, spr:'bat',     ai:'zigzag',  col:'#ff4d6d', ess:.24, kb:1.3},
  spitter: {hp:15, spd:46,  dmg:6,  r:12, xp:4, spr:'spitter', ai:'ranged',  col:'#54dcbe', ess:.34, kb:1},
  brute:   {hp:60, spd:35,  dmg:16, r:20, xp:8, spr:'brute',   ai:'chase',   col:'#a98fff', ess:.55, kb:.25},
  splitter:{hp:34, spd:42,  dmg:9,  r:15, xp:6, spr:'splitter',ai:'chase',   col:'#e06edc', ess:.5,  kb:.7},
  mite:    {hp:6,  spd:126, dmg:4,  r:7,  xp:1, spr:'mite',    ai:'zigzag',  col:'#d88bff', ess:.08, kb:1.6},
  wisp:    {hp:22, spd:74,  dmg:10, r:11, xp:6, spr:'wisp',    ai:'wisp',    col:'#8cb4ff', ess:.45, kb:.8},
};
function spawnEnemy(type,x,y,elite){
  const t=ETYPES[type], f=G.floor, dep=f-1;
  const hpMul=(1+.24*dep+.015*dep*dep)*(elite?3.2:1);
  const dmgMul=(1+.09*dep+.004*dep*dep)*(elite?1.6:1);
  const spdMul=1+Math.min(.4,dep*.012);
  const e={
    type, ai:t.ai, x, y, r:t.r*(elite?1.3:1), hp:t.hp*hpMul, max:t.hp*hpMul,
    spd:t.spd*rand(.9,1.1)*spdMul, dmg:Math.round(t.dmg*dmgMul), xp:Math.round(t.xp*(1+.07*dep))*(elite?3:1),
    col:t.col, spr:t.spr, elite:!!elite, kb:t.kb, kbx:0, kby:0,
    hitT:0, atkT:rand(.2,.8), seed:Math.random()*TAU, t1:rand(1,2), t2:0, orbT:0,
    aggro:false, isBoss:false, dead:false
  };
  e.uid=++entitySerial; G.enemies.push(e); return e;
}
function spawnBossAt(x,y){
  const f=G.floor, dep=f-1, tier=Math.max(1,Math.ceil(f/5));
  const hp=BOSS_TUNING.baseHp*(1+.34*(tier-1))*(1+.10*dep+.006*dep*dep);
  const b={
    type:'boss', ai:'boss', x, y, r:34, hp, max:hp,
    spd:56+Math.min(26,tier*2), dmg:Math.round(20*(1+.12*dep+.005*dep*dep)), xp:Math.round(45+18*tier),
    col:'#d8c389', spr:'gateWarden', elite:true, kb:.06, kbx:0, kby:0,
    hitT:0, atkT:0, seed:0, t1:2, t2:1.2, t3:6, orbT:0,
    aggro:false, isBoss:true, dead:false, tier,
    name:bossTitle(f), phase:0, chargeT:0, cvx:0, cvy:0, summonT:9, teleT:0
  };
  b.uid=++entitySerial; G.enemies.push(b); G.boss=b; return b;
}
function enemyShoot(e,ang,spd,dmg){
  G.ebul.push({x:e.x,y:e.y,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,r:5,dmg,life:4.5});
  sfx('eshoot');
}
function bossRing(e,n,spd){
  const off=Math.random()*TAU;
  for(let i=0;i<n;i++){ const a=off+i/n*TAU;
    G.ebul.push({x:e.x+Math.cos(a)*e.r,y:e.y+Math.sin(a)*e.r,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:6,dmg:Math.floor(e.dmg*.55)+1,life:6});
  }
  sfx('eshoot');
}

function fireVolley(){
  const p=G.player;
  const ma=aimAngle();
  const n=p.proj, spread=.075;
  for(let i=0;i<n;i++){
    const a=ma+(i-(n-1)/2)*spread;
    G.bullets.push({x:p.x+Math.cos(a)*14,y:p.y+Math.sin(a)*14,
      vx:Math.cos(a)*BASE.bulletSpd,vy:Math.sin(a)*BASE.bulletSpd,
      r:5, dmg:p.dmg, pierce:p.pierce, ric:p.ric, life:1.15, hits:null});
  }
  p.shotT=p.shotInt; p.muzzle=.06;
  G.cam.shake=Math.min(.35,G.cam.shake+.04);
  burst(p.x+Math.cos(ma)*20, p.y+Math.sin(ma)*20, 3, '#ffc46b', 120, .22, 2.2, true);
  sfx('shoot');
}
function damageEnemy(e,dmg,ang,isCrit,kbMul){
  if(e.dead) return;
  const p=G.player;
  if(p.execB>0 && e.hp < e.max*.3) dmg*=1+p.execB;
  dmg*=rand(.92,1.1);
  dmg=Math.max(1,Math.round(dmg));
  if(e.endlessDamageCeiling)dmg=Math.min(dmg,Math.max(1,Math.round(e.max*e.endlessDamageCeiling)));
  if(e.lateBoss&&e.bs){
    if(e.bossKey==='regents'){
      const other=G.enemies.find(o=>o!==e&&!o.dead&&o.bossKey==='regents');
      if(other){
        if(e.bs.mode==='shift'||e.bs.duet?.mode==='shift')return;
        const floor=other.hp/other.max>.28?e.max*.08:0;
        if(floor&&e.hp>=floor)dmg=Math.min(dmg,e.hp-floor);
        if(dmg<=0)return;
      }
    }else{
      if(e.bs.mode==='shift')return;
      const phase=e.bs.phase||0,cut=e.bossKey==='keeper'?(phase===0?.68:phase===1?.30:0):phase===0?.5:0;
      if(cut&&e.hp>=e.max*cut)dmg=Math.min(dmg,e.hp-e.max*cut);
      if(dmg<=0)return;
    }
  }
  e.hp-=dmg; e.hitT=.13;
  const kb=150*e.kb*(kbMul||1);
  e.kbx+=Math.cos(ang)*kb; e.kby+=Math.sin(ang)*kb;
  addText(e.x+rand(-8,8), e.y-e.r-4, dmg, isCrit?'#ffd88a':'#ffffff', isCrit?17:12);
  if(isCrit) burst(e.x,e.y,4,'#ffd88a',150,.3,2,true);
  sfx('hit');
  if(e.hp<=0) killEnemy(e);
}
function killEnemy(e){
  if(e.dead) return; e.dead=true;
  const run=G.run;
  run.kills++; save.totalKills++; markSave();
  burst(e.x,e.y,14,e.col,210,.5,2.6,true);
  burst(e.x,e.y,6,'#ffffff',120,.3,1.8,false);
  G.cam.shake=Math.min(.5,G.cam.shake+.12);
  const orbN=e.xp>=8?3 : e.xp>=4?2 : 1;
  for(let i=0;i<orbN;i++) spawnPick('xp', e.x+rand(-14,14), e.y+rand(-14,14), Math.ceil(e.xp/orbN));
  if(chance(e.elite ? .9 : (ETYPES[e.type]?.ess ?? .3))) spawnPick('ess', e.x, e.y-6, e.elite?irand(5,9):irand(1,2));
  if(chance(e.elite ? .14 : .05)) spawnPick('heart', e.x+10, e.y+6, 14);
  if(e.type==='splitter'){
    for(let i=0;i<3;i++){ const pos=safePosition(G.world,e.x+rand(-16,16),e.y+rand(-16,16),7);if(pos){const m=spawnEnemy('mite',pos.x,pos.y,false);m.aggro=true;} }
  }
  if(e.isBoss){ killBoss(e); return; }
  sfx('die');
}
function hurtPlayer(dmg, sx, sy){
  const p=G.player;
  if(p.hitCd>0 || p.dashT>0 || G.state!=='playing' || G.dead) return;
  p.hp-=dmg; p.hitCd=.65;
  const a=Math.atan2(p.y-sy,p.x-sx);
  p.kbx=Math.cos(a)*260; p.kby=Math.sin(a)*260;
  G.cam.shake=Math.min(.65,G.cam.shake+.35);
  T('vig').style.opacity=.85;
  burst(p.x,p.y,10,'#ff5d4d',190,.45,2.6,true);
  addText(p.x,p.y-18,'-'+dmg,'#ff7a70',15);
  sfx('hurt');
  if(p.hp<=0){
    if(META.revive && !G.run.revUsed){
      G.run.revUsed=true; p.hp=Math.round(p.maxHp*.5); p.hitCd=2;
      toast('SECOND WIND','death refused — once');
      nova(p.x,p.y,200,130);
      sfx('nova');
    } else die();
  }
}
function nova(x,y,r,dmg){
  burst(x,y,26,'#ffb45e',300,.6,3,true);
  G.parts.push({x,y,vx:0,vy:0,life:.4,max:.4,size:r,col:'ring',glow:true});
  for(const e of G.enemies){
    if(!e.dead && d2(x,y,e.x,e.y)<r*r) damageEnemy(e,dmg,Math.atan2(e.y-y,e.x-x),false,1.6);
  }
  G.cam.shake=Math.min(.8,G.cam.shake+.3);
}

function spawnPick(kind,x,y,val){
  const arr=G.picks;
  if(arr.length>260){
    const o=arr.find(o=>o.kind===kind); if(o){ o.val+=val; return; }
  }
  arr.push({kind,x,y,vx:rand(-60,60),vy:rand(-60,60),val,t:Math.random()*TAU});
}

function killBoss(b){
  save.guardians++;markSave();
  G.boss=null; G.bossActive=false;
  T('bossbar').classList.remove('on');
  burst(b.x,b.y,40,'#ff5d7e',320,.8,3.2,true);
  burst(b.x,b.y,20,'#ffd88a',220,.7,2.6,true);
  G.cam.shake=1;
  sfx('die'); sfx('boss');
  for(let i=0;i<8;i++) spawnPick('xp', b.x+rand(-40,40), b.y+rand(-40,40), 10);
  for(let i=0;i<4;i++) spawnPick('ess', b.x+rand(-30,30), b.y+rand(-30,30), Math.round((10+4*b.tier)/2));
  spawnPick('heart', b.x, b.y, 30);
  if(G.portal){ G.portal.active=true; toast('THE SEAL BREAKS','the portal opens'); }
  const bonus=Math.round(18+b.tier*7);
  addEss(bonus);
  addText(b.x,b.y-40,'+'+Math.round(bonus*META.ess)+' ESSENCE','#d8bdff',14);
  if(G.floor%10===0){
    toast('DEPTH '+G.floor+' CONQUERED','the void deepens · +bonus essence');
    addEss(60+G.floor*4);
    sfx('victory');
  }
}
function openChest(c){
  c.opened=true;
  burst(c.x,c.y,14,'#ffd88a',180,.5,2.4,true);
  sfx('chest');
  if(chance(.5)){
    const v=Math.round(10+G.floor*(G.floor<=10?4:1.8));
    spawnPick('ess',c.x,c.y,v);
    addText(c.x,c.y-22,'ESSENCE CACHE','#d8bdff',13);
  } else {
    openLevelup(true);
  }
}
