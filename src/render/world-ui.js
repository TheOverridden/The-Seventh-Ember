let lightCv=null, lctx=null, treeCtx=null;
function resize(){
  G.dpr=Math.min(window.devicePixelRatio||1,1.5);
  G.w=innerWidth; G.h=innerHeight;
  G.cv.width=G.w*G.dpr; G.cv.height=G.h*G.dpr;
  G.cv.style.width=G.w+'px'; G.cv.style.height=G.h+'px';
  lightCv.width=Math.ceil(G.w/4); lightCv.height=Math.ceil(G.h/4);
}

function render(){
  const ctx=G.ctx;
  ctx.setTransform(G.dpr,0,0,G.dpr,0,0);
  ctx.fillStyle='#05060a'; ctx.fillRect(0,0,G.w,G.h);
  if(G.state==='menu'||!G.world){ drawMenuBg(); return; }
  const cam=G.cam;
  const amp=save.motion?0:cam.shake*cam.shake*10;
  const sx=rand(-1,1)*amp, sy=rand(-1,1)*amp;
  ctx.save();
  ctx.translate(-cam.x+sx,-cam.y+sy);
  drawTiles(ctx);drawPixelFloorDetails(ctx);
  drawHollowFloor(ctx);
  drawLateWorld(ctx);
  drawProps(ctx);
  drawTorches(ctx);
  drawPortalChests(ctx);
  drawPicks(ctx);
  drawEnemies(ctx);
  drawBullets(ctx);
  drawPlayer(ctx);
  drawCombatFX(ctx);drawPixelEntityDetails(ctx);
  drawParticles(ctx);
  drawTexts(ctx);
  ctx.restore();
  if(save.quality!=="light")lightingPass(sx,sy);
  if(G.state==='playing') drawCrosshair(ctx);
}
function drawTiles(ctx){
  const w=G.world, ts=TILE, pi=w.pi;
  const fl=FLOORT[pi], dc=DECOT[pi], cap=WALLTOP[pi], face=WALLFACE[pi];
  const x0=Math.max(0,Math.floor(G.cam.x/ts)-1), x1=Math.min(w.W-1,Math.ceil((G.cam.x+G.w)/ts)+1);
  const y0=Math.max(0,Math.floor(G.cam.y/ts)-1), y1=Math.min(w.H-1,Math.ceil((G.cam.y+G.h)/ts)+2);
  ctx.imageSmoothingEnabled=false;
  const S=(img,wx,wy)=>ctx.drawImage(img,0,0,TP,TP,wx,wy,ts,ts);
  for(let ty=y0;ty<=y1;ty++) for(let tx=x0;tx<=x1;tx++){
    const i=ty*w.W+tx;
    if(w.grid[i]!==1) continue;
    const wx=tx*ts, wy=ty*ts;
    S(fl[w.shade[i]&3],wx,wy);
    const d=w.deco[i];
    if(d===1) S(dc.crack,wx,wy);
    else if(d===2) S(dc.peb,wx,wy);
    else if(d===3 && !((w.region==='hollow'&&G.floor<=10)||w.region==='late')) S(dc.rune,wx,wy);
    else if(d===4 && !(w.region==='hollow'&&G.floor<=5)) S(dc.moss,wx,wy);
    else if(d===5) S(dc.grate,wx,wy);
    if(isSolidTile(w,tx,ty-1)) S(AOT.N,wx,wy);
    if(isSolidTile(w,tx,ty+1)) S(AOT.S,wx,wy);
    if(isSolidTile(w,tx-1,ty)) S(AOT.W,wx,wy);
    if(isSolidTile(w,tx+1,ty)) S(AOT.E,wx,wy);
  }
  for(let ty=y0;ty<=y1;ty++) for(let tx=x0;tx<=x1;tx++){
    const i=ty*w.W+tx;
    if(w.grid[i]===1) continue;
    if(isSolidTile(w,tx+1,ty)&&isSolidTile(w,tx-1,ty)&&isSolidTile(w,tx,ty+1)&&isSolidTile(w,tx,ty-1)) continue;
    const wx=tx*ts, wy=ty*ts;
    if(!isSolidTile(w,tx,ty+1)) S(face,wx,wy);
    else S(cap,wx,wy);
  }
  ctx.imageSmoothingEnabled=true;
}
function drawProps(ctx){
  const w=G.world, cam=G.cam;
  if(!w.props) return;
  for(const o of w.props){
    if(o.x<cam.x-40||o.x>cam.x+G.w+40||o.y<cam.y-40||o.y>cam.y+G.h+40) continue;
    if(o.t==='pr_shroom') glowImg('violet',o.x,o.y,16,.2);
    drawSpr(o.t,o.x,o.y,1,0,1,o.x*.01);
  }
}
function drawTorches(ctx){
  const w=G.world, cam=G.cam, t=G.tAll;
  for(const o of w.torches){
    if(o.x<cam.x-60||o.x>cam.x+G.w+60||o.y<cam.y-60||o.y>cam.y+G.h+60) continue;
    glowImg('ember',o.x,o.y-6,36+Math.sin(t*9+o.s)*4,.55);
    drawSpr('pr_sconce',o.x,o.y+6);
    drawSpr('flame',o.x,o.y-5,1,0,1,o.s);
  }
}
function drawPortalChests(ctx){
  const t=G.tAll, p=G.portal;
  if(p){
    const pulse=1+Math.sin(t*2.4)*.06;
    glowImg('gold',p.x,p.y,p.active?70:40,(p.active ? .5 : .14));
    drawSpr('portal',p.x,p.y,pulse*(p.active?1:.9),0,p.active?1:.45);
    if(p.active){
      ctx.save(); ctx.globalCompositeOperation='lighter';
      ctx.strokeStyle='rgba(255,214,130,'+(0.22+Math.sin(t*3)*.1)+')';
      ctx.lineWidth=2; ctx.beginPath(); ctx.arc(p.x,p.y,34+Math.sin(t*2.4)*5,0,TAU); ctx.stroke();
      ctx.restore();
    }
  }
  for(const c of G.chests){
    if(!c.opened) glowImg('gold',c.x,c.y,26,.25+Math.sin(t*3+c.x)*.08);
    drawSpr(c.opened?'chestOpen':'chest',c.x,c.y,1,0,(c.opened ? .55 : 1));
  }
}
function drawPicks(ctx){
  for(const o of G.picks){
    const bob=Math.sin(o.t)*2;
    if(o.kind==='xp') glowImg('cyan',o.x,o.y,11,.45);
    else if(o.kind==='ess') glowImg('violet',o.x,o.y,13,.5);
    else glowImg('pink',o.x,o.y,13,.5);
    drawSpr(o.kind==='xp'?'xp':o.kind==='ess'?'ess':'heart',o.x,o.y+bob,1,0,1,o.val*.13);
  }
}
const EGLOW={slime:'violet',mite:'violet',bat:'magenta',spitter:'teal',brute:'violet',splitter:'orchid',wisp:'blue',boss:'magenta'};
function drawEnemies(ctx){
  const t=G.tAll;
  for(const e of G.enemies){
    if(e.dead)continue;
    if(e.ai==='late'||e.ai==='lateBoss'){drawLateEnemy(ctx,e);continue;}
    if(e.ai==='garden'||e.matriarch){drawGardenEnemy(ctx,e);continue;}
    if(e.ai==='gate'||e.warden){drawGateEnemy(ctx,e);continue;}
    ctx.fillStyle='rgba(0,0,0,.42)';
    ctx.beginPath(); ctx.ellipse(e.x,e.y+e.r*.85,e.r*.85,e.r*.36,0,0,TAU); ctx.fill();
    glowImg(EGLOW[e.type]||'violet',e.x,e.y,e.r*2.1,(e.isBoss ? .4 : .24));
    let s=1, rot=0;
    if(e.type==='bat') rot=Math.sin(t*8+e.seed)*.18;
    else if(e.type==='spitter') rot=Math.atan2(G.player.y-e.y,G.player.x-e.x);
    else if(e.type==='wisp') s=1+Math.sin(t*5+e.seed)*.05;
    if(e.isBoss){
      rot=t*.4;
      if(e.phase===1){ s=1+Math.sin(t*30)*.05; }
      s*=1+Math.sin(t*2)*.03;
    }
    drawSpr(e.spr,e.x,e.y,s*(e.elite&&!e.isBoss?1.18:1),rot,1,e.seed);
    if(e.elite&&!e.isBoss){
      ctx.save(); ctx.globalCompositeOperation='lighter';
      ctx.strokeStyle='rgba(255,207,107,.8)'; ctx.lineWidth=1.6;
      ctx.beginPath(); ctx.arc(e.x,e.y,e.r+6,t*2,t*2+4.2); ctx.stroke(); ctx.restore();
    }
    if(e.hitT>0){
      ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=e.hitT*4;
      ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.arc(e.x,e.y,e.r*.9,0,TAU); ctx.fill(); ctx.restore();
    }
    if(e.isBoss&&e.phase===1){
      const p=1-e.teleT/BOSS_TUNING.chargeWarning;
      ctx.save();ctx.translate(e.x,e.y);ctx.rotate(Math.atan2(e.cvy,e.cvx));ctx.fillStyle='rgba(255,93,126,.13)';ctx.fillRect(0,-e.r,270,e.r*2);ctx.strokeStyle='#ff7a95';ctx.setLineDash([9,9]);ctx.lineWidth=2;ctx.strokeRect(0,-e.r,270,e.r*2);ctx.restore();
      ctx.save(); ctx.globalCompositeOperation='lighter';
      ctx.strokeStyle='rgba(255,80,110,'+(0.4+Math.sin(t*30)*.3)+')'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(e.x,e.y,e.r+10+p*26,0,TAU); ctx.stroke(); ctx.restore();
    }
    if(e.type==='spitter'&&e.aggro&&e.t1<0.35&&e.t1>0) glowImg('teal',e.x,e.y,e.r+8,.5);
    if(!e.isBoss && e.hp<e.max){
      const wpx=e.r*2;
      ctx.fillStyle='rgba(0,0,0,.6)'; ctx.fillRect(e.x-wpx/2-1,e.y-e.r-10,wpx+2,5);
      ctx.fillStyle=e.elite?'#ffcf6b':'#ff5d6d'; ctx.fillRect(e.x-wpx/2,e.y-e.r-9,wpx*clamp(e.hp/e.max,0,1),3);
    }
  }
}
function drawBullets(ctx){
  ctx.save(); ctx.globalCompositeOperation='lighter';
  for(const b of G.bullets){
    ctx.strokeStyle='rgba(255,180,90,.55)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(b.x-b.vx*.035,b.y-b.vy*.035); ctx.lineTo(b.x,b.y); ctx.stroke();
    drawSpr('bEmber',b.x,b.y,1,0,1,b.x*.01);
    glowImg('ember',b.x,b.y,12,.4);
  }
  for(const b of G.ebul){
    if(b.garden){drawSeedShot(ctx,b);continue;}
    if(b.lateColor){ctx.strokeStyle=b.lateColor+'aa';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x-b.vx*.04,b.y-b.vy*.04);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.fillStyle=b.lateColor;ctx.fillRect(b.x-3,b.y-3,6,6);continue;}
    ctx.strokeStyle='rgba(255,93,138,.5)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(b.x-b.vx*.035,b.y-b.vy*.035); ctx.lineTo(b.x,b.y); ctx.stroke();
    drawSpr('bEnemy',b.x,b.y,1,0,1,b.x*.01);
    glowImg('magenta',b.x,b.y,12,.4);
  }
  ctx.restore();
  const p=G.player;
  if(p&&p.orbN>0){
    for(let i=0;i<p.orbN;i++){
      const a=p.orbA+i/p.orbN*TAU;
      const ox=p.x+Math.cos(a)*64, oy=p.y+Math.sin(a)*64;
      glowImg('gold',ox,oy,16,.5);
      drawSpr('pShard',ox,oy,1,a+Math.PI/2);
    }
  }
}
function drawPlayer(ctx){
  const p=G.player; if(!p||G.dead&&G.state==='dead') return;
  const blink=p.hitCd>0&&p.dashT<=0&&(G.tAll*18|0)%2===0&&G.state==='playing';
  if(p.ghosts) for(const g of p.ghosts){
    drawSpr('pDash',g.x,g.y,1,g.rot,clamp(g.life,0,1)*.32);
  }
  if(!blink){
    const hov=Math.sin(G.tAll*2.4)*1.8;
    ctx.fillStyle='rgba(0,0,0,.42)';
    ctx.beginPath(); ctx.ellipse(p.x,p.y+p.r*1.05,p.r*(.85-hov*.03),p.r*.34,0,0,TAU); ctx.fill();
    glowImg('ember',p.x,p.y-4,54,.62);
    glowImg('gold',p.x,p.y-6,26,.38);
    if(p.muzzle>0){
      ctx.save(); ctx.globalCompositeOperation='lighter';
      ctx.strokeStyle='rgba(255,196,107,.55)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(p.x,p.y-4);
      ctx.lineTo(p.x+Math.cos(p.face)*30,p.y-4+Math.sin(p.face)*30); ctx.stroke(); ctx.restore();
    }
    const dashing=p.dashT>0,cy=p.y+2-(dashing?0:hov),oa=G.tAll*(dashing?4.2:1.78);
    const state = dashing ? 'pDash' : (p.moving ? 'pMove' : 'pIdle');
    const rot = dashing ? Math.atan2(p.dashDy,p.dashDx)+Math.PI/2 : p.lean;
    ctx.save();ctx.translate(p.x,cy-4);ctx.rotate(-oa*.18);ctx.globalCompositeOperation='lighter';
    ctx.strokeStyle='rgba(255,199,103,.22)';ctx.lineWidth=1.5;
    for(let i=0;i<6;i++){const a=i*TAU/6+.12;ctx.beginPath();ctx.arc(0,0,15,a,a+.42);ctx.stroke();}
    ctx.strokeStyle='rgba(255,241,184,.12)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,20,8,.3,0,TAU);ctx.stroke();ctx.restore();
    const satellites=[0,TAU/3,TAU*2/3].map((off,i)=>{
      const a=oa+off,r=19+(i===1?3:i===2?-1:0);
      return {a,i,x:p.x+Math.cos(a)*r,y:cy-5+Math.sin(a)*(7+i*.8),front:Math.sin(a)>=0};
    });
    const drawSatellite=s=>{
      const depth=s.front?1:.72,sc=(s.front?1.02:.82)+(s.i===1?.07:0);
      glowImg('gold',s.x,s.y,12+(s.front?3:0),.3*depth);
      drawSpr('pShard',s.x,s.y,sc,s.a*.72+G.tAll*.45,depth);
      ctx.fillStyle=s.front?'#fff0ae':'#ba7a35';ctx.fillRect(Math.round(s.x+Math.cos(s.a)*5)-1,Math.round(s.y+Math.sin(s.a)*3)-1,2,2);
    };
    for(const s of satellites)if(!s.front)drawSatellite(s);
    drawSpr(state, p.x, cy, dashing?1.06:1, rot);
    for(const s of satellites)if(s.front)drawSatellite(s);
    if(!save.motion)for(let i=0;i<4;i++){
      const u=(G.tAll*(.31+i*.027)+i*.23)%1;
      const ox=p.x-6+i*4+Math.sin(G.tAll*2.4+i*1.7)*2,oy=cy-8-u*21;
      ctx.fillStyle=i===2?'#fff3bf':i%2?'#ffbe5c':'#f67a35';ctx.fillRect(Math.round(ox),Math.round(oy),i===2?2:1,i===2?2:1);
    }
  }
  if(p.hitCd>0&&p.dashT<=0){
    ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=.3;
    ctx.strokeStyle='#ffb45e'; ctx.beginPath(); ctx.arc(p.x,p.y,p.r+5,0,TAU); ctx.stroke(); ctx.restore();
  }
}
function drawParticles(ctx){
  ctx.save();
  for(const o of G.parts){
    const a=clamp(o.life/o.max,0,1);
    if(o.col==='ring'){
      ctx.globalCompositeOperation='lighter';
      ctx.strokeStyle='rgba(255,180,94,'+(a*.7)+')'; ctx.lineWidth=3*a+1;
      ctx.beginPath(); ctx.arc(o.x,o.y,(1-a)*o.size,0,TAU); ctx.stroke();
    } else if(o.glow){
      ctx.globalCompositeOperation='lighter';
      ctx.globalAlpha=a;
      ctx.fillStyle=o.col;
      ctx.fillRect(o.x-o.size/2,o.y-o.size/2,o.size,o.size);
    } else {
      ctx.globalCompositeOperation='source-over';
      ctx.globalAlpha=a;
      ctx.fillStyle=o.col;
      ctx.fillRect(o.x-o.size/2,o.y-o.size/2,o.size,o.size);
    }
  }
  ctx.restore();
  ctx.globalAlpha=1;
}
function drawTexts(ctx){
  ctx.textAlign='center';
  for(const o of G.texts){
    const a=clamp(o.life/o.max,0,1);
    ctx.font='800 '+o.size+'px system-ui, sans-serif';
    ctx.globalAlpha=a;
    ctx.strokeStyle='rgba(0,0,0,.8)'; ctx.lineWidth=3;
    ctx.strokeText(o.txt,o.x,o.y);
    ctx.fillStyle=o.col;
    ctx.fillText(o.txt,o.x,o.y);
  }
  ctx.globalAlpha=1;
}
function lightingPass(sx,sy){
  const lw=lightCv.width, lh=lightCv.height, cam=G.cam;
  lctx.setTransform(1,0,0,1,0,0);
  lctx.globalCompositeOperation='source-over';
  lctx.fillStyle=G.world.pal.fog+'.5)';
  lctx.fillRect(0,0,lw,lh);
  lctx.globalCompositeOperation='destination-out';
  const hole=(wx,wy,r,a)=>{
    const x=(wx-cam.x+sx)/4, y=(wy-cam.y+sy)/4, rr=r/4;
    if(x<-rr||y<-rr||x>lw+rr||y>lh+rr) return;
    const g=lctx.createRadialGradient(x,y,rr*.08,x,y,rr);
    g.addColorStop(0,'rgba(255,255,255,'+a+')'); g.addColorStop(1,'rgba(255,255,255,0)');
    lctx.fillStyle=g; lctx.beginPath(); lctx.arc(x,y,rr,0,TAU); lctx.fill();
  };
  const p=G.player, t=G.tAll;
  if(p){ hole(p.x,p.y,480,1); hole(p.x,p.y,190,.8); }
  for(const o of G.world.torches) hole(o.x,o.y,175+Math.sin(t*9+o.s)*18,.9);
  if(G.portal) hole(G.portal.x,G.portal.y,G.portal.active?215:100,.9);
  let oc=0; for(const o of G.picks){ if(oc++>26)break; hole(o.x,o.y,62,.6); }
  let bc=0; for(const b of G.bullets){ if(bc++>12)break; hole(b.x,b.y,66,.65); }
  let ec=0; for(const b of G.ebul){ if(ec++>10)break; hole(b.x,b.y,56,.55); }
  if(G.boss&&!G.boss.dead) hole(G.boss.x,G.boss.y,260,.95);
  for(const c of G.chests) hole(c.x,c.y,86,.55);
  for(const o of G.world.fixtures||[])hole(o.x,o.y,120,o.kind==='echo'?.65:.8);
  const ctx=G.ctx;
  ctx.save(); ctx.imageSmoothingEnabled=true;
  ctx.drawImage(lightCv,0,0,lw,lh,0,0,G.w,G.h);
  ctx.restore();
}
function drawCrosshair(ctx){
  const p=G.player;
  const m=keys.KeyJ?(aimTarget?{x:aimTarget.x-G.cam.x,y:aimTarget.y-G.cam.y}:{x:p.x-G.cam.x+Math.cos(p.face)*75,y:p.y-G.cam.y+Math.sin(p.face)*75}):mouse;
  const r=9+(p&&p.muzzle>0?4:0);
  ctx.strokeStyle='rgba(255,214,140,.9)'; ctx.lineWidth=1.6;
  ctx.beginPath(); ctx.arc(m.x,m.y,r,0,TAU); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(m.x-r-4,m.y); ctx.lineTo(m.x-r+2,m.y);
  ctx.moveTo(m.x+r+4,m.y); ctx.lineTo(m.x+r-2,m.y);
  ctx.moveTo(m.x,m.y-r-4); ctx.lineTo(m.x,m.y-r+2);
  ctx.moveTo(m.x,m.y+r+4); ctx.lineTo(m.x,m.y+r-2);
  ctx.stroke();
}
function drawMenuBg(){
  const ctx=G.ctx,t=save.motion?0:G.tAll,portrait=G.w<=820&&G.h>520,short=G.h<=520&&G.w>G.h;
  const cx=portrait?G.w*.5:short?G.w*.78:G.w*.745,cy=portrait?Math.min(184,G.h*.22):G.h*.47;
  const unit=portrait?clamp(G.w/11,25,37):Math.min(55,G.w/23,G.h/13.2),radius=portrait?6:7;
  const sky=ctx.createLinearGradient(0,0,0,G.h);sky.addColorStop(0,'#120e0d');sky.addColorStop(.54,'#0b0909');sky.addColorStop(1,'#050403');ctx.fillStyle=sky;ctx.fillRect(0,0,G.w,G.h);
  const halo=ctx.createRadialGradient(cx,cy,unit*.4,cx,cy,unit*8.8);halo.addColorStop(0,'rgba(222,170,92,.17)');halo.addColorStop(.42,'rgba(126,85,48,.08)');halo.addColorStop(1,'rgba(5,4,3,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,G.w,G.h);
  ctx.save();ctx.translate(cx,cy);ctx.rotate(portrait?0:-.055);ctx.imageSmoothingEnabled=false;
  for(let y=-radius;y<=radius;y++)for(let x=-radius;x<=radius;x++){
    const ax=Math.abs(x),ay=Math.abs(y),edge=Math.max(ax,ay);if(edge>radius||ax+ay>radius*1.72)continue;
    const outer=edge===radius||ax+ay>radius*1.54,shade=((x*5+y*3)%4+4)%4;
    ctx.globalAlpha=outer?.72:.96;ctx.fillStyle=['#27201e','#201b1a','#2d2521','#191616'][shade];ctx.fillRect(x*unit,y*unit,unit-2,unit-2);
    ctx.fillStyle=outer?'#594839':'#3e342d';ctx.fillRect(x*unit,y*unit,unit-2,2);
    ctx.fillStyle='#110e0d';ctx.fillRect(x*unit+unit-3,y*unit,2,unit-2);
    if((x*11+y*7)%9===0&&!outer){ctx.fillStyle='#a2785124';ctx.fillRect(x*unit+unit*.22,y*unit+unit*.68,unit*.34,2);}
    if(outer){ctx.fillStyle='#3c3029';ctx.fillRect(x*unit,y*unit,unit-2,Math.max(6,unit*.3));ctx.fillStyle='#776047';ctx.fillRect(x*unit+3,y*unit+3,unit-8,2);}
  }
  ctx.globalAlpha=1;ctx.translate(unit/2,unit/2);
  const chamber=unit*(radius-.18);ctx.strokeStyle='#ad875e44';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<8;i++){const a=Math.PI/8+i*TAU/8,x=Math.cos(a)*chamber,y=Math.sin(a)*chamber;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.stroke();
  const ring=unit*2.52;ctx.strokeStyle='#d5b66d5c';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,ring,0,TAU);ctx.stroke();ctx.strokeStyle='#c98e5738';ctx.beginPath();ctx.arc(0,0,ring+unit*.38,0,TAU);ctx.stroke();
  for(let i=0;i<16;i++){const a=i/16*TAU;ctx.save();ctx.rotate(a);ctx.fillStyle=i%4===0?'#e1c47f99':'#b49a765c';ctx.fillRect(ring+unit*.18,-1,i%4===0?unit*.28:unit*.15,2);ctx.restore();}
  for(const [x,y]of[[-4.8,-4.25],[4.8,-4.25],[-4.8,4.25],[4.8,4.25]]){glowImg('ember',x*unit,y*unit,unit*2.35,.48);drawSpr('flame',x*unit,y*unit,portrait?1.05:1.35,0,.95);}
  ctx.save();ctx.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const a=t*.22+i*TAU/7,rr=unit*(2.02+.09*Math.sin(t*.7+i));ctx.save();ctx.translate(Math.cos(a)*rr,Math.sin(a)*rr*.72);ctx.rotate(a+t*.13+Math.PI/4);ctx.fillStyle=i%2?'#e8a25c':'#f1ca76';ctx.globalAlpha=.72;ctx.fillRect(-5,-5,10,10);ctx.fillStyle='#fff0c9';ctx.globalAlpha=.7;ctx.fillRect(-2,-4,4,5);ctx.fillStyle='#75462c';ctx.globalAlpha=.9;ctx.fillRect(-2,1,4,4);ctx.restore();}ctx.restore();
  glowImg('gold',0,0,unit*4.4,.52);glowImg('ember',0,0,unit*3.1,.14);drawSpr('portal',0,0,(portrait?1.55:2.15)+Math.sin(t*1.1)*.035,0,.98);
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.rotate(Math.PI/4+Math.sin(t*.55)*.025);ctx.strokeStyle='#e9ca7e';ctx.globalAlpha=.58;ctx.lineWidth=2;ctx.strokeRect(-13,-13,26,26);ctx.fillStyle='#fff0b5';ctx.globalAlpha=.82;ctx.fillRect(-7,-7,14,14);ctx.fillStyle='#ffd38a';ctx.globalAlpha=.96;ctx.fillRect(-3,-3,6,6);ctx.restore();
  const py=unit*(portrait?2.7:3.12);glowImg('ember',0,py-5,unit*1.65,.33);drawSpr('pIdle',0,py,portrait?1.12:1.55,0,1);
  ctx.globalCompositeOperation='lighter';for(let i=0;i<9;i++){const a=t*(i%2?.32:-.26)+i*TAU/9,rr=unit*(3.5+(i%3)*.38);ctx.fillStyle=i%3?'#d99a5b':'#e7c474';ctx.globalAlpha=.18+(i%2)*.12;ctx.fillRect(Math.round(Math.cos(a)*rr)-1,Math.round(Math.sin(a)*rr*.72)-1,i%3?2:3,i%3?2:3);}ctx.restore();
  const vignette=ctx.createRadialGradient(cx,cy,unit*1.3,cx,cy,Math.max(G.w,G.h)*.72);vignette.addColorStop(0,'rgba(5,4,3,0)');vignette.addColorStop(.58,'rgba(5,4,3,.08)');vignette.addColorStop(1,'rgba(2,2,2,.88)');ctx.fillStyle=vignette;ctx.fillRect(0,0,G.w,G.h);
  for(let i=0;i<46;i++){const drift=t*(7+i%6),x=(i*173.7+drift*(i%2?1:-.45)+G.w*2)%G.w,y=(G.h-((drift+i*67)%G.h));ctx.fillStyle=i%5?'#ce8d52':'#e7bd72';ctx.globalAlpha=.07+(i%4)*.035;ctx.fillRect(Math.round(x),Math.round(y),i%5?1:2,i%5?1:2);}ctx.globalAlpha=1;
}

const hudCache={};
function setTxt(id,v){ if(hudCache[id]!==v){ hudCache[id]=v; T(id).textContent=v; } }
function updateHUD(dt){
  const p=G.player, run=G.run;
  T('hpfill').style.width=clamp(p.hp/p.maxHp*100,0,100)+'%';
  setTxt('hptext',Math.max(0,Math.ceil(p.hp))+' / '+p.maxHp);
  const need=needXP(run.level);
  T('xpfill').style.width=clamp(run.xp/need*100,0,100)+'%';
  setTxt('lvlbadge','LV '+run.level);
  setTxt('xptext',Math.floor(run.xp)+' / '+need+' XP');
  setTxt('stFloor',G.floor);setTxt('floorBanner',String(G.floor).padStart(2,'0')+' / '+floorName(G.floor));setTxt('floorObjective',G.boss?'Defeat the guardian to open the portal':'Find the golden portal · explore for power');
  setTxt('stEss',fmt(run.ess));
  setTxt('stKills',run.kills);
  setTxt('stTime',Math.floor(run.t/60)+':'+String(Math.floor(run.t%60)).padStart(2,'0'));
  const dm=T('dashmeter');
  const pc=p.dashCdT>0 ? 1-p.dashCdT/p.dashCd : 1;
  dm.style.setProperty('--p',clamp(pc,0,1).toFixed(3));
  const vig=T('vig');
  const o=parseFloat(vig.style.opacity||0);
  if(o>0) vig.style.opacity=Math.max(0,o-dt*1.8).toFixed(2);
  T('lowvig').style.opacity=p.hp<p.maxHp*.3?1:0;
  if(G.boss&&!G.boss.dead){
    T('bossfill').style.width=clamp(G.boss.hp/G.boss.max*100,0,100)+'%';
  }
  const pr=G.portal;
  if(pr && d2(p.x,p.y,pr.x,pr.y)<90*90){
    T('promptTxt').textContent= pr.active ? 'DESCEND TO FLOOR '+(G.floor+1) : 'SEALED — SLAY THE GUARDIAN';
    T('prompt').classList.add('on');
  } else T('prompt').classList.remove('on');
  G.mmT=(G.mmT||0)-dt;
  if(G.mmT<=0){ G.mmT=.25; drawMinimap(); }
}
function drawMinimap(){
  const c=T('mm'), x=c.getContext('2d'), w=G.world;
  x.fillStyle='rgba(7,9,15,.9)'; x.fillRect(0,0,c.width,c.height);
  const s=Math.min((c.width-14)/w.W,(c.height-14)/w.H), ox=(c.width-w.W*s)/2, oy=(c.height-w.H*s)/2;
  const p=G.player;
  const tx0=Math.floor(p.x/TILE);
  x.fillStyle='#2c3552';
  for(let ty=0;ty<w.H;ty++) for(let tx=0;tx<w.W;tx++){
    if(!w.reveal[ty*w.W+tx]||w.grid[ty*w.W+tx]!==1) continue;
    x.fillRect(ox+tx*s,oy+ty*s,s+0.5,s+0.5);
  }
  if(G.portal&&w.reveal[Math.floor(G.portal.y/TILE)*w.W+Math.floor(G.portal.x/TILE)]){
    x.fillStyle=G.portal.active?'#ffd88a':'#5a4a6a';
    x.beginPath(); x.arc(ox+G.portal.x/TILE*s,oy+G.portal.y/TILE*s,3,0,TAU); x.fill();
  }
  x.fillStyle='#ffb45e';
  x.beginPath(); x.arc(ox+tx0*s+ (p.x/TILE-tx0)*s,oy+p.y/TILE*s,2.6,0,TAU); x.fill();
}

const BRANCH_ENDS=[
  {id:'m5',t:'MIGHT',      dx:0, dy:78},
  {id:'v5',t:'VITALITY',   dx:0, dy:78},
  {id:'f4',t:'FOCUS',      dx:0, dy:-40},
  {id:'g3',t:'LODESTONE',  dx:0, dy:78},
  {id:'c3',t:'ARCANE EYE', dx:0, dy:-40},
  {id:'s4',t:'CELERITY',   dx:0, dy:-40},
  {id:'d3',t:'PHANTOM STEP',dx:0,dy:78},
  {id:'a4',t:'AVARICE',    dx:0, dy:78}
];
let treeHover=null, treePulse=0;
function openTree(from){
  G.skillsOpen=true; G.treeFrom=from||'menu';
  if(from==='menu') hide('menu');
  refreshTreeEss();
  show('skills');fitTree();selectNode(selectedNode||NODE_BY_ID.awaken);
  const wrap=T('treeWrap');
  wrap.scrollLeft=Math.max(0,(1240-wrap.clientWidth)/2);
  wrap.scrollTop=Math.max(0,(980-wrap.clientHeight)/2);
}
function closeTree(){
  G.skillsOpen=false; hide('skills'); hideTip();
  if(G.treeFrom==='menu') show('menu');
}
function refreshTreeEss(){ T('treeEss').querySelector('b').textContent=fmt(save.essence); }
function nodeAt(mx,my){
  for(const n of TREE_NODES){ const r=(n.r||20)+6;
    if(d2(mx,my,n.x,n.y)<r*r) return n; }
  return null;
}
function showTip(n,mx,my){
  const tip=T('treeTip'), st=nodeState(n);
  let status='';
  if(st===2) status='<span style="color:#8fe3a0">UNLOCKED</span>';
  else if(st===0) status='<span style="color:#8a98b4">LOCKED — unlock the previous node</span>';
  else if(st===1) status='<span style="color:#ff9d8a">NOT ENOUGH ESSENCE</span>';
  else status='<span style="color:#8ff7ff">CLICK TO UNLOCK</span>';
  tip.innerHTML=`<div class="tn">${n.name}</div><div class="td">${n.desc}</div>
    <div class="tc">${st===2?'':'◆ '+n.cost+' essence · '}${status}</div>`;
  tip.style.display='block';
  const tx=Math.max(8,Math.min(innerWidth-262,mx+18)), ty=Math.min(innerHeight-140,my+16);
  tip.style.left=tx+'px'; tip.style.top=ty+'px';
}
function hideTip(){ T('treeTip').style.display='none'; }
function tryBuyNode(n){
  const st=nodeState(n);
  if(st===2){ return; }
  if(st!==3){ sfx('deny'); return; }
  save.essence-=n.cost; save.nodes[n.id]=true;
  META=computeMeta();
  saveNow(); refreshTreeEss(); refreshMenuStats();
  sfx('buy'); selectNode(n);
}
function drawTree(t){
  if(!treeCtx){
    const cv=T('treeCv');
    const d=Math.min(window.devicePixelRatio||1,2);
    cv.width=Math.round(1240*d); cv.height=Math.round(980*d);
    cv.style.width='1240px'; cv.style.height='980px';
    treeCtx=cv.getContext('2d');
    treeCtx.setTransform(d,0,0,d,0,0);
  }
  const x=treeCtx;
  x.clearRect(0,0,1240,980);
  x.fillStyle='rgba(120,140,200,.05)';
  for(let i=0;i<54;i++){ const dxx=(i*733)%1230+5, dyy=(i*421)%970+5; x.fillRect(dxx,dyy,2,2); }
  const aura=x.createRadialGradient(620,470,10,620,470,240);
  aura.addColorStop(0,'rgba(232,196,118,.10)'); aura.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle=aura; x.beginPath(); x.arc(620,470,240,0,TAU); x.fill();
  x.lineCap='round';
  for(const n of TREE_NODES){
    if(!n.req) continue;
    const r=NODE_BY_ID[n.req];
    const owned=save.nodes[n.id]&&save.nodes[n.req];
    const avail=!save.nodes[n.id]&&save.nodes[n.req];
    x.beginPath();
    if(r.id==='awaken'){
      const mx2=(r.x+n.x)/2, my2=(r.y+n.y)/2, ddx=n.x-r.x, ddy=n.y-r.y, dd=Math.hypot(ddx,ddy)||1;
      x.moveTo(r.x,r.y);
      x.quadraticCurveTo(mx2-ddy/dd*16, my2+ddx/dd*16, n.x, n.y);
    } else { x.moveTo(r.x,r.y); x.lineTo(n.x,n.y); }
    if(owned){
      x.setLineDash([]); x.strokeStyle='rgba(232,196,118,.92)'; x.lineWidth=3.2;
      x.shadowColor='rgba(255,216,138,.5)'; x.shadowBlur=8;
    } else if(avail){
      x.setLineDash([8,10]); x.lineDashOffset=-t*30;
      x.strokeStyle='rgba(143,247,255,.45)'; x.lineWidth=2.2;
    } else {
      x.setLineDash([3,9]); x.lineDashOffset=0;
      x.strokeStyle='rgba(110,122,155,.20)'; x.lineWidth=2;
    }
    x.stroke(); x.shadowBlur=0; x.setLineDash([]);
  }
  x.textAlign='center'; x.textBaseline='middle';
  x.font='800 16px system-ui, sans-serif';
  for(const b of BRANCH_ENDS){
    const n=NODE_BY_ID[b.id]; if(!n) continue;
    const lx=clamp(n.x+b.dx, 70, 1170), ly=clamp(n.y+b.dy, 22, 958);
    const tw=x.measureText(b.t).width+20;
    x.beginPath();
    if(x.roundRect) x.roundRect(lx-tw/2, ly-11, tw, 22, 11); else x.rect(lx-tw/2, ly-11, tw, 22);
    x.fillStyle='rgba(8,10,16,.9)'; x.fill();
    x.strokeStyle='rgba(232,196,118,.28)'; x.lineWidth=1; x.stroke();
    x.fillStyle='#e8d5ae';
    x.fillText(b.t, lx, ly+.5);
  }
  const diamond=(cx,cy,r)=>{ x.beginPath(); x.moveTo(cx,cy-r); x.lineTo(cx+r,cy); x.lineTo(cx,cy+r); x.lineTo(cx-r,cy); x.closePath(); };
  const pill=(px3,py3,w3,h3,r3)=>{ x.beginPath(); if(x.roundRect) x.roundRect(px3,py3,w3,h3,r3); else x.rect(px3,py3,w3,h3); };
  x.imageSmoothingEnabled=false;
  for(const n of TREE_NODES){
    const st=nodeState(n);
    const R=(n.r||20)*(n===treeHover?1.15:1);
    const icn=n.id==='awaken'?'st': n.id==='wind'?'pl': NODE_ICON[n.id[0]];
    if(st===2){ x.shadowColor='rgba(255,216,138,.9)'; x.shadowBlur=18; }
    else if(st===3){ x.shadowColor='rgba(143,247,255,.8)'; x.shadowBlur=10+Math.sin(t*4+n.x)*5; }
    diamond(n.x,n.y,R);
    x.fillStyle= st===2 ? '#e8c476' : st===3 ? '#101c30' : st===1 ? '#0d1322' : '#070a12';
    x.fill(); x.shadowBlur=0;
    x.lineWidth=2;
    x.strokeStyle= st===2 ? 'rgba(255,240,200,.95)'
                 : st===3 ? 'rgba(143,247,255,'+(0.65+Math.sin(t*4+n.x)*.3)+')'
                 : st===1 ? '#8b9db6' : '#536379';
    x.stroke();
    diamond(n.x,n.y,R*.7);
    x.strokeStyle= st===2 ? 'rgba(120,85,20,.5)' : 'rgba(255,255,255,.07)';
    x.lineWidth=1.2; x.stroke();
    const icol= st===2 ? '#221606' : st===3 ? '#8ff7ff' : st===1 ? '#b3c3d5' : '#7c8da6';
    const ic=iconImg(icn,icol);
    const isz=R*.98;
    x.drawImage(ic, n.x-isz/2, n.y-isz/2, isz, isz);
    if(st===0){ const lk=iconImg('lk','#3c465e'); x.drawImage(lk, n.x+R*.3, n.y+R*.3, 13, 13); }
    if(n===treeHover){ diamond(n.x,n.y,R+6); x.strokeStyle='rgba(255,255,255,.55)'; x.lineWidth=1.4; x.stroke(); }
    if(st!==2){
      const label=String(n.cost);
      x.font='800 16px system-ui, sans-serif';
      x.textAlign='center'; x.textBaseline='middle';
      const tw=x.measureText(label).width+26;
      const py=n.y+R+11;
      pill(n.x-tw/2, py, tw, 21, 10.5);
      x.fillStyle= st===3? 'rgba(26,18,44,.96)':'rgba(9,11,18,.94)'; x.fill();
      x.strokeStyle= st===3? 'rgba(216,189,255,.6)':'rgba(110,122,155,.34)'; x.lineWidth=1; x.stroke();
      x.fillStyle= st===3? '#c99bff':'#59647e';
      x.beginPath(); x.arc(n.x-tw/2+9, py+10.5, 3.2, 0, TAU); x.fill();
      x.fillStyle= st===3? '#efe2ff':'#adbbce';
      x.fillText(label, n.x+4, py+11);
    }
  }
  x.imageSmoothingEnabled=true;
  x.textBaseline='alphabetic';
  treePulse=t;
}
function wireTree(){
  const wrap=T('treeNodes');
  for(const n of TREE_NODES){const el=document.createElement('button');el.className='node-hit';el.style.left=(n.x/1240*100)+'%';el.style.top=(n.y/980*100)+'%';el.dataset.node=n.id;el.title=n.name;el.setAttribute('aria-label',n.name+' · '+n.cost+' essence');on(el,'click',()=>selectNode(n));on(el,'focus',()=>selectNode(n));wrap.appendChild(el);}
  on(T('btnUnlock'),'click',()=>{if(selectedNode)tryBuyNode(selectedNode);});
  addEventListener('resize',fitTree);
}

function refreshMenuStats(){
  T('menuStats').innerHTML=
   `<span>BEST FLOOR <b>${save.bestFloor||'—'}</b></span>
    <span>RUNS <b>${save.totalRuns}</b></span>
    <span>KILLS <b>${save.totalKills}</b></span>
    <span>GUARDIANS <b>${save.guardians}</b></span>
    <span>ESSENCE <b style="color:#d8bdff">◆ ${fmt(save.essence)}</b></span>`;
  syncContinue();
}
function toggleMusic(){
  save.music=save.music?0:1; markSave(); saveNow();
  T('btnMusic').classList.toggle('off',!save.music); applyAudioSettings();syncSettings();
}
function toggleSfx(){
  save.sfx=save.sfx?0:1; markSave(); saveNow();
  T('btnSfx').classList.toggle('off',!save.sfx);
  if(save.sfx) sfx('ui');syncSettings();
}
function wireButtons(){
  on(T('btnStart'),'click',()=>{ initAudio(); sfx('ui'); requestStart(); });
  on(T('btnTree'),'click',()=>{ sfx('ui'); openTree('menu'); });
  on(T('btnHow'),'click',()=>{ sfx('ui'); show('howto'); });
  on(T('btnHowClose'),'click',()=>{ sfx('ui'); hide('howto'); });
  on(T('btnMusic'),'click',()=>{ initAudio(); toggleMusic(); });
  on(T('btnSfx'),'click',()=>{ initAudio(); toggleSfx(); });
  on(T('btnResume'),'click',()=>{ sfx('ui'); pauseGame(false); });
  on(T('btnAbandon'),'click',()=>confirmAction('END THIS RUN?','Your essence and permanent upgrades are kept. This descent will end.','END RUN',abandonRun));
  on(T('btnDeadTree'),'click',()=>{ sfx('ui'); openTree('dead'); });
  on(T('btnDeadMenu'),'click',()=>{ sfx('ui'); startRun(); });
  on(T('btnWinGo'),'click',()=>{ sfx('ui'); hide('win'); setState('playing'); });
  on(T('btnWinEnd'),'click',()=>{sfx('ui');G.dead=true;save.resume=null;saveNow();backToMenu();});
  on(T('btnTreeBack'),'click',()=>{ sfx('ui'); closeTree(); });
  T('btnMusic').classList.toggle('off',!save.music);
  T('btnSfx').classList.toggle('off',!save.sfx);
}

let lastT=0, fpsE=60, fpsTick=0;
function loop(now){
  requestAnimationFrame(loop);
  const dt=clamp((now-lastT)/1000,0,.033); lastT=now;
  G.tAll=(G.tAll||0)+dt;
  fpsE=lerp(fpsE,1/Math.max(dt,.0001),.05);
  fpsTick-=dt;
  if(fpsTick<=0){ fpsTick=.5; T('fps').textContent=Math.round(fpsE)+' FPS';
    if(save.quality==='light'||fpsE<33)G.partScale=.4;else if(fpsE>52)G.partScale=1;
  }
  hollowTick(dt);
  if(G.state==='playing') update(dt);
  else if(G.state==='dying'){ updateFx(dt); G.cam.shake=Math.max(0,G.cam.shake-dt*1.8); }
  else if(G.state==='winning'){ updateFx(dt); }
  render();
  if(G.skillsOpen) drawTree(G.tAll);
}
function init(){
  loadSave(); META=computeMeta();
  G.cv=T('cv'); G.ctx=G.cv.getContext('2d');
  lightCv=document.createElement('canvas'); lctx=lightCv.getContext('2d');
  bakeAllGlows(); bakeAll(); bakePerfectEmber(); bakeTiles(); bakeHollowSprites();bakeGardenSprites();
  resize(); addEventListener('resize',resize);
  wireButtons(); wireTree();wireRefinements();decorateMenus();wireHollow();wireCombat();wireLate();wireMastery();wireDepth();
  refreshIcons(); refreshMenuStats();
  setState('menu');
  G.tAll=0;
  T('fade').style.opacity=0;
  lastT=performance.now();
  requestAnimationFrame(loop);
}
