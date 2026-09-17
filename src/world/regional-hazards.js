function lateLineHit(h,p,width=h.width||10){const x2=h.x+Math.cos(h.a)*(h.len||300),y2=h.y+Math.sin(h.a)*(h.len||300);return segmentDistance(p.x,p.y,h.x,h.y,x2,y2)<p.r+width;}
function tickLateHazards(dt){
  const w=G.world,p=G.player;if(!w?.lateHazards)return;
  for(let i=w.lateHazards.length-1;i>=0;i--){const h=w.lateHazards[i];h.t-=dt;h.hitCd=Math.max(0,(h.hitCd||0)-dt);
    if(h.phase==='rest'&&h.t<=0){h.phase='warn';h.t=h.type==='shell'||h.type==='rift'?.72:.8;h.a+=(h.type==='prism'?rand(.5,1.2):0);}
    else if(h.phase==='warn'&&h.t<=0){h.phase='active';h.t=h.activeT||.36;h.hit=false;sfx(h.type==='shell'?'roar2':'eshoot');}
    else if(h.phase==='active'&&h.t<=0){if(h.boss){w.lateHazards.splice(i,1);continue;}h.phase='rest';h.t=2.5+rand(0,1.5);h.hit=false;}
    if(h.phase!=='active')continue;let hit=false;
    if(['prism','inkline','vent','gust','beam','glyph','wave'].includes(h.type))hit=lateLineHit(h,p,h.type==='vent'?18:h.type==='gust'?20:h.width||9);
    else hit=d2(h.x,h.y,p.x,p.y)<((h.radius||55)+p.r)**2;
    if(hit&&h.hitCd<=0){
      if(h.type==='gust'){const push=260,a=h.a;p.kbx+=Math.cos(a)*push;p.kby+=Math.sin(a)*push;h.hitCd=.18;}
      else{const base=lateRegion(G.floor)?.stage||3;hurtPlayer(Math.max(1,Math.round(h.damage??((h.boss?8:5)+base*2))),h.x,h.y);h.hitCd=.55;}
    }
  }
}
function lateDecorColor(key){return{reservoir:'#5ea8b5',foundry:'#ca6641',observatory:'#77cadb',archive:'#aa9878',court:'#a96b7c',choir:'#8395d3',citadel:'#9c5547',heart:'#d5a95f'}[key]||'#8794a8';}
function drawLateDecor(ctx,o){
  const key=o.type,c=lateDecorColor(key),t=save.motion?0:G.tAll;ctx.save();ctx.translate(o.x,o.y);ctx.strokeStyle=c+'55';ctx.fillStyle=c+'16';ctx.lineWidth=2;
  if(key==='reservoir'){ctx.fillRect(-o.w/2,-o.h/2,o.w,o.h);ctx.strokeStyle=c+'38';for(let y=-o.h/2+18;y<o.h/2;y+=34){ctx.beginPath();for(let x=-o.w/2;x<o.w/2;x+=18)ctx.lineTo(x,y+Math.sin(x*.03+o.seed)*3);ctx.stroke();}ctx.fillStyle='#273d44';ctx.fillRect(-22,-22,44,44);ctx.strokeStyle=c;ctx.beginPath();ctx.arc(0,0,15,0,TAU);ctx.stroke();}
  else if(key==='foundry'){ctx.fillStyle='#3d221d55';ctx.fillRect(-o.w/2,-o.h/2,o.w,o.h);for(let x=-o.w/2+24;x<o.w/2;x+=48){ctx.fillStyle='#49332e';ctx.fillRect(x,-o.h/2+8,7,o.h-16);ctx.fillStyle=c+'66';ctx.fillRect(x+2,-o.h/2+12,3,o.h-24);}ctx.fillStyle=c+'55';ctx.beginPath();ctx.arc(0,0,17+Math.sin(t*2+o.seed)*2,0,TAU);ctx.fill();}
  else if(key==='observatory'){for(let i=0;i<3;i++){ctx.rotate(i*2.05+o.seed);ctx.beginPath();ctx.ellipse(0,0,Math.min(o.w,o.h)*(.18+i*.05),17+i*4,0,0,TAU);ctx.stroke();}ctx.fillStyle=c+'55';ctx.beginPath();ctx.arc(0,0,7,0,TAU);ctx.fill();}
  else if(key==='archive'){for(let y=-o.h/2+28;y<o.h/2;y+=55){ctx.fillStyle='#4b4034';ctx.fillRect(-o.w/2+14,y,o.w-28,10);for(let x=-o.w/2+22;x<o.w/2-15;x+=13){ctx.fillStyle=(x/13+o.seed)%2?'#8b7757':'#60594c';ctx.fillRect(x,y-25,8,24);}}}
  else if(key==='court'){ctx.fillStyle=c+'20';ctx.fillRect(-o.w*.34,-o.h*.42,o.w*.68,o.h*.84);ctx.strokeRect(-o.w*.34+8,-o.h*.42+8,o.w*.68-16,o.h*.84-16);for(const side of [-1,1]){ctx.fillStyle='#49313b';ctx.fillRect(side*(o.w*.31)-11,-20,22,42);ctx.fillStyle=c+'77';ctx.beginPath();ctx.arc(side*(o.w*.31),-24,9,0,TAU);ctx.fill();}}
  else if(key==='choir'){for(let x=-o.w/2+30;x<o.w/2;x+=70){ctx.fillStyle='#444c70';ctx.fillRect(x,-o.h/2+12,8,o.h-24);ctx.fillStyle=c+'88';ctx.beginPath();ctx.arc(x+4,-o.h/2+24,10,0,Math.PI);ctx.fill();}ctx.strokeStyle=c+'45';for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(0,0,30+i*17,t*.1+i,t*.1+i+4.5);ctx.stroke();}}
  else if(key==='citadel'){ctx.fillStyle='#241c22aa';ctx.fillRect(-o.w/2,-o.h/2,o.w,o.h);ctx.strokeStyle=c+'50';for(let x=-o.w/2+18;x<o.w/2;x+=54){ctx.beginPath();ctx.moveTo(x,-o.h/2);ctx.lineTo(x+28,o.h/2);ctx.stroke();}ctx.fillStyle='#5d3b36';ctx.fillRect(-28,-18,56,36);ctx.fillStyle=c+'aa';ctx.fillRect(-4,-25,8,50);}
  else{ctx.strokeStyle=c+'55';for(let i=0;i<8;i++){ctx.rotate(TAU/8);ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(Math.min(o.w,o.h)*.32,0);ctx.stroke();ctx.fillStyle=c+(i%2?'38':'70');ctx.fillRect(30,-3,11,6);}ctx.fillStyle='#fff0bb99';ctx.beginPath();ctx.arc(0,0,9+Math.sin(t*2)*2,0,TAU);ctx.fill();}ctx.restore();
}
function drawLateHazard(ctx,h){
  const warn=h.phase==='warn',active=h.phase==='active',u=warn?clamp(1-h.t/(h.boss?.7:.8),0,1):0,c=h.color||lateDecorColor(G.world.lateKey);ctx.save();ctx.translate(h.x,h.y);ctx.rotate(h.a||0);ctx.globalCompositeOperation='lighter';ctx.lineWidth=active?4:1.5;ctx.strokeStyle=active?c:c+(warn?'88':'30');ctx.fillStyle=c+(active?'30':'10');
  if(['prism','inkline','vent','gust','beam','glyph','wave'].includes(h.type)){const len=h.len||280;ctx.setLineDash(active?[]:h.type==='inkline'||h.type==='glyph'?[4,9]:[13,13]);ctx.beginPath();ctx.moveTo(0,0);if(h.type==='wave'){for(let x=0;x<len;x+=14)ctx.lineTo(x,Math.sin(x*.08)*12);}else ctx.lineTo(len,0);ctx.stroke();ctx.setLineDash([]);if(warn){ctx.fillStyle=c;ctx.globalAlpha=.45+.35*u;ctx.fillRect(0,-2,len*u,4);}if(h.type==='vent'){for(let x=15;x<len;x+=35){ctx.beginPath();ctx.moveTo(x,-8);ctx.lineTo(x-8,-18);ctx.moveTo(x,8);ctx.lineTo(x-8,18);ctx.stroke();}}}
  else{const r=h.radius||55;ctx.beginPath();ctx.ellipse(0,0,r,r*.42,0,0,TAU);ctx.stroke();if(active){ctx.beginPath();ctx.ellipse(0,0,r*.55,r*.2,0,0,TAU);ctx.fill();}else if(warn){ctx.beginPath();ctx.ellipse(0,0,r*u,r*.42*u,0,0,TAU);ctx.stroke();}}
  ctx.restore();
}
function drawLateWorld(ctx){
  const w=G.world;if(w?.region!=='late')return;for(const o of w.lateDecor||[])if(o.x>G.cam.x-o.w&&o.x<G.cam.x+G.w+o.w&&o.y>G.cam.y-o.h&&o.y<G.cam.y+G.h+o.h)drawLateDecor(ctx,o);for(const h of w.lateHazards||[])drawLateHazard(ctx,h);
  if(w.sealed)for(const p of w.lateDoors||[]){const x=p.x*TILE,y=p.y*TILE,c=lateDecorColor(w.lateKey);ctx.fillStyle='#0b0d14';ctx.fillRect(x,y,TILE,TILE);ctx.fillStyle=c;for(let i=0;i<4;i++)ctx.fillRect(x+4+i*9,y+3,3,TILE-6);}
  for(const o of w.lateFixtures||[]){if(o.kind!=='trace')continue;const seen=!!storyData().seen[o.id],near=d2(o.x,o.y,G.player.x,G.player.y)<82**2;drawEchoArtifact(ctx,o,seen,near,save.motion?0:G.tAll);}
}

function drawLateBody(ctx,e){
  const t=save.motion?0:G.tAll,shape=e.lateShape,c=e.col,warn=e.action==='warn',strike=e.action==='strike',pulse=1+Math.sin(t*3+e.seed)*.04;ctx.save();ctx.translate(e.x,e.y);ctx.rotate((shape==='eel'||shape==='ribbon'||shape==='chain')?e.face:0);ctx.scale(pulse*(e.elite?1.13:1),pulse*(e.elite?1.13:1));ctx.strokeStyle='#11131c';ctx.fillStyle=c;ctx.lineWidth=3;
  if(['leech','eel','ribbon','chain'].includes(shape)){ctx.beginPath();ctx.moveTo(-e.r*1.3,0);ctx.bezierCurveTo(-e.r*.5,-e.r,e.r*.5,e.r,e.r*1.4,0);ctx.lineWidth=e.r*.65;ctx.strokeStyle='#10131a';ctx.stroke();ctx.lineWidth=e.r*.38;ctx.strokeStyle=c;ctx.stroke();}
  else if(['crawler','hound','guard','angel','knight','oath'].includes(shape)){ctx.beginPath();ctx.moveTo(-e.r,-e.r*.5);ctx.lineTo(0,-e.r);ctx.lineTo(e.r,e.r*.1);ctx.lineTo(e.r*.5,e.r);ctx.lineTo(-e.r*.65,e.r*.75);ctx.closePath();ctx.fill();ctx.stroke();for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*5,e.r*.55);ctx.lineTo(side*e.r*1.15,e.r*1.25);ctx.strokeStyle=c;ctx.lineWidth=5;ctx.stroke();}}
  else if(['lens','eye','valve','bell','cantor'].includes(shape)){ctx.beginPath();ctx.ellipse(0,0,e.r,e.r*.68,0,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#12131c';ctx.beginPath();ctx.arc(0,0,e.r*.35,0,TAU);ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.rotate(TAU/4);ctx.beginPath();ctx.moveTo(e.r*.8,0);ctx.lineTo(e.r*1.35,0);ctx.stroke();}}
  else if(['shell','shelf','hammer'].includes(shape)){ctx.fillRect(-e.r,-e.r*.8,e.r*2,e.r*1.6);ctx.strokeRect(-e.r,-e.r*.8,e.r*2,e.r*1.6);ctx.fillStyle='#1b1920';ctx.fillRect(-e.r*.55,-e.r*.4,e.r*1.1,e.r*.8);for(let i=-1;i<=1;i++){ctx.fillStyle=c;ctx.fillRect(i*e.r*.5-2,-e.r,4,e.r*2);}}
  else if(['page','wing','note','ash'].includes(shape)){for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(side*e.r*1.5,-e.r,side*e.r*1.2,e.r);ctx.quadraticCurveTo(side*e.r*.55,e.r*.45,0,0);ctx.fill();ctx.stroke();}ctx.fillStyle='#fff2cf';ctx.fillRect(-3,-5,6,10);}
  else if(['quill','hand','sluice'].includes(shape)){ctx.rotate(Math.PI/4);ctx.fillRect(-e.r*.3,-e.r,e.r*.6,e.r*2);ctx.strokeRect(-e.r*.3,-e.r,e.r*.6,e.r*2);ctx.fillStyle='#eee2bd';ctx.fillRect(-2,-e.r*1.25,4,e.r*.6);}
  else{ctx.rotate(t*.25+e.seed);for(let i=0;i<6;i++){ctx.rotate(TAU/6);ctx.beginPath();ctx.moveTo(3,0);ctx.lineTo(e.r*1.25,-4);ctx.lineTo(e.r*.8,6);ctx.closePath();ctx.fill();ctx.stroke();}ctx.fillStyle='#fff0bd';ctx.beginPath();ctx.arc(0,0,e.r*.28,0,TAU);ctx.fill();}
  if(warn){ctx.strokeStyle='#fff0ba';ctx.globalAlpha=.55+.35*Math.sin(t*18);ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,e.r+7,0,TAU);ctx.stroke();}if(strike)ctx.rotate(Math.sin(t*30)*.1);ctx.restore();
}
function drawLateBossBody(ctx,b){
  const t=save.motion?0:G.tAll,s=b.bs,wind=s.mode==='windup',u=wind?smoothBoss(1-s.t/Math.max(.01,s.duration)):0,c=b.col,second=s.second;ctx.save();ctx.translate(b.x,b.y);ctx.rotate((s.mode==='dash'||s.mode==='dive'||s.mode==='ram')?s.a:0);const squash=wind?.08*u:0;ctx.scale(1+squash,1-squash);ctx.strokeStyle='#10131c';ctx.fillStyle=c;ctx.lineWidth=4;
  if(b.bossKey==='bellkeeper'){
    const swim=save.motion?0:Math.sin(t*2.35)*5,face=s.a||0;ctx.rotate(face);
    ctx.strokeStyle='#09151d';ctx.lineWidth=31;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-78,swim);ctx.bezierCurveTo(-57,-25-swim,-28,24+swim,2,-2);ctx.stroke();
    ctx.strokeStyle='#254957';ctx.lineWidth=24;ctx.stroke();ctx.strokeStyle=c;ctx.lineWidth=9;ctx.stroke();
    ctx.strokeStyle='#b8edf0';ctx.globalAlpha=.55;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-67,swim-3);ctx.bezierCurveTo(-48,-17-swim,-23,15+swim,-2,-5);ctx.stroke();ctx.globalAlpha=1;
    ctx.fillStyle='#315b67';ctx.beginPath();ctx.moveTo(-68,swim);ctx.lineTo(-91,-21+swim);ctx.lineTo(-84,3+swim);ctx.lineTo(-94,24+swim);ctx.closePath();ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=3;ctx.stroke();
    for(let i=0;i<5;i++){const px=-55+i*13,py=Math.sin(t*2.35-i*.72)*8-2;ctx.save();ctx.translate(px,py);ctx.rotate(Math.sin(t*1.4-i)*.18);ctx.fillStyle=i%2?'#3a6671':'#284d5a';ctx.beginPath();ctx.moveTo(-6,-12);ctx.lineTo(7,-9);ctx.lineTo(5,8);ctx.lineTo(-7,10);ctx.closePath();ctx.fill();ctx.strokeStyle='#78ced6';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();}
    ctx.fillStyle='#102832';ctx.beginPath();ctx.moveTo(-4,-22);ctx.quadraticCurveTo(22,-33,45,-16);ctx.lineTo(53,-2);ctx.lineTo(46,17);ctx.lineTo(18,25);ctx.lineTo(-3,13);ctx.lineTo(-11,-3);ctx.closePath();ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=4;ctx.stroke();
    ctx.fillStyle='#386976';ctx.beginPath();ctx.moveTo(1,-21);ctx.lineTo(-8,-42);ctx.lineTo(20,-27);ctx.closePath();ctx.fill();ctx.strokeStyle='#83dbe1';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#315e6b';ctx.beginPath();ctx.moveTo(7,17);ctx.lineTo(-1,38);ctx.lineTo(25,22);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#f2dda0';ctx.beginPath();ctx.arc(31,-11,6,0,TAU);ctx.fill();ctx.fillStyle='#10151c';ctx.beginPath();ctx.arc(33,-11,2.5,0,TAU);ctx.fill();ctx.fillStyle='#fff7ce';ctx.fillRect(29,-14,2,2);
    ctx.strokeStyle='#76c7d0';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(17+i*6,3+i*2);ctx.lineTo(23+i*6,8+i*2);ctx.stroke();}
    ctx.fillStyle='#08131a';ctx.beginPath();ctx.moveTo(31,14);ctx.lineTo(49,8);ctx.lineTo(42,18);ctx.closePath();ctx.fill();ctx.strokeStyle='#5baab6';ctx.stroke();
    const bellGlow=wind&&s.kind==='bells'?u:second?.35:0;ctx.strokeStyle='#b99654';ctx.lineWidth=5;ctx.beginPath();ctx.arc(11,-24,27,Math.PI,TAU);ctx.stroke();
    for(const bx of [-2,15,31]){ctx.strokeStyle='#75552a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx,-32+Math.abs(bx-15)*.22);ctx.lineTo(bx,-17);ctx.stroke();ctx.fillStyle=bellGlow>.05?'#f1cd69':'#a77c3e';ctx.beginPath();ctx.moveTo(bx-7,-17);ctx.lineTo(bx+7,-17);ctx.lineTo(bx+10,-4);ctx.lineTo(bx-10,-4);ctx.closePath();ctx.fill();ctx.strokeStyle='#e4c175';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#5d3d1d';ctx.fillRect(bx-2,-4,4,7);if(bellGlow>.05){ctx.strokeStyle='rgba(255,224,132,'+(.25+.35*bellGlow)+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(bx,-9,12+bellGlow*4,0,TAU);ctx.stroke();}}
    ctx.lineCap='butt';
  }
  else if(b.bossKey==='colossus'){ctx.fillStyle='#4c322d';ctx.fillRect(-34,-38,68,75);ctx.strokeRect(-34,-38,68,75);ctx.fillStyle=c;for(const side of [-1,1]){ctx.fillRect(side*18-7,-23,14,35);ctx.fillStyle='#ffcf76';ctx.fillRect(side*18-3,-18,6,24);ctx.fillStyle=c;}ctx.fillStyle='#17151b';ctx.fillRect(-16,-50,32,19);ctx.fillStyle='#ffd083';ctx.fillRect(-8,-45,16,7);for(const side of [-1,1]){ctx.strokeStyle='#35262a';ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(side*31,-20);ctx.lineTo(side*47,22);ctx.stroke();}}
  else if(b.bossKey==='astronomer'){ctx.fillStyle='#1c2030';ctx.beginPath();ctx.arc(0,0,23,0,TAU);ctx.fill();ctx.stroke();for(let i=0;i<3;i++){ctx.save();ctx.rotate(t*(.18+i*.06)+i*2.1);ctx.strokeStyle=i===0?'#d9f5f5':c;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,42+i*13,15+i*5,0,0,TAU);ctx.stroke();ctx.fillStyle=c;ctx.beginPath();ctx.arc(42+i*13,0,5+i,0,TAU);ctx.fill();ctx.restore();}ctx.fillStyle='#fff4c5';ctx.beginPath();ctx.arc(0,0,8,0,TAU);ctx.fill();}
  else if(b.bossKey==='scribe'){ctx.rotate(Math.sin(t*.8)*.08);ctx.fillStyle='#26212a';ctx.beginPath();ctx.moveTo(-40,-34);ctx.bezierCurveTo(18,-52,52,-5,31,38);ctx.bezierCurveTo(-8,22,-32,42,-40,-34);ctx.fill();ctx.stroke();ctx.strokeStyle=c;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-31,-23);ctx.bezierCurveTo(8,-4,-2,14,35,29);ctx.stroke();ctx.fillStyle='#f1e3bd';ctx.beginPath();ctx.arc(-12,-15,7,0,TAU);ctx.fill();}
  else if(b.bossKey==='regents'){ctx.fillStyle=b.twinRole==='blade'?'#5a2f40':'#392b4b';ctx.beginPath();ctx.moveTo(-25,35);ctx.lineTo(-28,-11);ctx.lineTo(0,-39);ctx.lineTo(28,-11);ctx.lineTo(25,35);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-15,-13);ctx.lineTo(0,-28);ctx.lineTo(15,-13);ctx.lineTo(9,5);ctx.lineTo(-9,5);ctx.closePath();ctx.fill();ctx.fillStyle='#15131a';ctx.fillRect(-10,-10,6,4);ctx.fillRect(4,-10,6,4);if(b.twinRole==='blade'){ctx.strokeStyle=c;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(16,5);ctx.lineTo(52,-29);ctx.stroke();}else{ctx.strokeStyle=c;ctx.lineWidth=3;ctx.beginPath();ctx.arc(26,8,17,0,TAU);ctx.stroke();}}
  else if(b.bossKey==='seraph'){ctx.fillStyle='#272a46';for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(0,-5);ctx.bezierCurveTo(side*38,-48,side*70,-35,side*54,28);ctx.bezierCurveTo(side*30,13,side*18,22,0,-5);ctx.fill();ctx.stroke();for(let i=0;i<3;i++){ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(side*12,-1+i*6);ctx.lineTo(side*(48+i*5),-24+i*18);ctx.stroke();}}ctx.fillStyle='#11131c';ctx.beginPath();ctx.arc(0,-9,16,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#eef0ff';ctx.fillRect(-4,-14,8,10);}
  else if(b.bossKey==='tyrant'){ctx.fillStyle='#282127';ctx.fillRect(-48,-31,96,67);ctx.strokeRect(-48,-31,96,67);ctx.fillStyle=c;ctx.fillRect(-39,-21,12,43);ctx.fillRect(27,-21,12,43);ctx.fillStyle='#17151b';ctx.fillRect(-20,-50,40,35);ctx.strokeRect(-20,-50,40,35);for(let i=-2;i<=2;i++){ctx.fillStyle=c;ctx.fillRect(i*15-3,-58-Math.abs(i)*5,6,16);}ctx.strokeStyle='#17151b';ctx.lineWidth=11;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*43,18);ctx.lineTo(side*62,38);ctx.stroke();}}
  else{for(let i=0;i<10;i++){ctx.save();ctx.rotate(t*.12+i*TAU/10);ctx.fillStyle=i%2?c:'#4a3340';ctx.beginPath();ctx.moveTo(11,0);ctx.lineTo(58,-7);ctx.lineTo(43,9);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}ctx.fillStyle='#17151b';ctx.beginPath();ctx.arc(0,0,25,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#fff1b8';ctx.beginPath();ctx.arc(0,0,9+Math.sin(t*2.3)*2,0,TAU);ctx.fill();}
  if(second){ctx.strokeStyle='#ffd284aa';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,b.r+13+Math.sin(t*4)*3,0,TAU);ctx.stroke();}if(wind){ctx.globalAlpha=.45+.35*u;ctx.strokeStyle='#fff1c2';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,b.r+20-u*7,-Math.PI*u,Math.PI*u);ctx.stroke();}ctx.restore();
}
function drawLateEnemySkill(ctx,e){
  const mode=e.specialMode,t=save.motion?0:G.tAll,c=e.col;if(!mode&&!(e.specialPulse>0))return;ctx.save();ctx.globalCompositeOperation='lighter';
  if(mode==='tell'){
    const cfg=LATE_SPECIALS[e.type],u=clamp(1-e.specialT/(cfg?.tell||.5),0,1);ctx.strokeStyle=c;ctx.globalAlpha=.28+.45*u;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(e.x,e.y,e.r+7+u*4,e.specialA-.7,e.specialA+.7);ctx.stroke();
    ctx.fillStyle=c;for(let i=0;i<3;i++){const a=e.specialA+(i-1)*.36,rr=e.r+12+u*5;ctx.fillRect(Math.round(e.x+Math.cos(a)*rr)-1,Math.round(e.y+Math.sin(a)*rr)-1,3,3);}
  }else if(mode==='suction'){
    ctx.strokeStyle=c+'99';ctx.lineWidth=2;for(let i=0;i<4;i++){const a=t*.8+i*TAU/4,r=28+i*7;ctx.beginPath();ctx.arc(e.x,e.y,r,a,a+1.5);ctx.stroke();}
  }else if(mode==='tether'){
    ctx.strokeStyle=c+'aa';ctx.lineWidth=3;ctx.setLineDash([7,5]);ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(G.player.x,G.player.y);ctx.stroke();ctx.setLineDash([]);
  }else if(['shell','barrier'].includes(mode)){
    ctx.strokeStyle=c;ctx.globalAlpha=.7;ctx.lineWidth=3;const sides=mode==='shell'?8:5,r=e.r+10;ctx.beginPath();for(let i=0;i<=sides;i++){const a=i*TAU/sides+(mode==='barrier'?e.face:0),x=e.x+Math.cos(a)*r,y=e.y+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  }else if(['aura','oath'].includes(mode)){
    ctx.strokeStyle=c+'88';ctx.lineWidth=2;for(let i=0;i<2;i++){ctx.beginPath();ctx.arc(e.x,e.y,(mode==='oath'?58:48)+i*11+Math.sin(t*3+i)*3,0,TAU);ctx.stroke();}
  }else if(mode==='phase'){ctx.strokeStyle=c+'88';ctx.lineWidth=2;for(let i=1;i<=3;i++){ctx.globalAlpha=.28/i;ctx.strokeRect(e.x-e.r-i*7,e.y-e.r*.7-i*3,e.r*2+i*14,e.r*1.4+i*6);}}
  if(e.specialPulse>0){ctx.strokeStyle='#fff1bd';ctx.globalAlpha=e.specialPulse/.45;ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,e.r+8+(1-e.specialPulse/.45)*18,0,TAU);ctx.stroke();}
  ctx.restore();
}
function drawLateEnemy(ctx,e){
  ctx.fillStyle='rgba(0,0,0,.44)';ctx.beginPath();ctx.ellipse(e.x,e.y+e.r*.9,e.r*.9,e.r*.34,0,0,TAU);ctx.fill();glowImg(e.bossKey==='colossus'||G.world.lateKey==='foundry'?'ember':'violet',e.x,e.y,e.r*(e.isBoss?2.8:2),e.isBoss?.3:.16);
  if(e.lateBoss)drawLateBossBody(ctx,e);else drawLateBody(ctx,e);
  if(!e.lateBoss)drawLateEnemySkill(ctx,e);
  if(e.hitT>0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(.65,e.hitT*4);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(e.x,e.y,e.r*.85,0,TAU);ctx.fill();ctx.restore();}
  if(e.elite&&!e.isBoss){ctx.strokeStyle='#ffcf6b';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(e.x,e.y,e.r+7,G.tAll*2,G.tAll*2+4.5);ctx.stroke();}if(!e.isBoss&&e.hp<e.max){const w=e.r*2;ctx.fillStyle='#090812';ctx.fillRect(e.x-w/2-1,e.y-e.r-11,w+2,5);ctx.fillStyle=e.elite?'#ffcf6b':'#ff6679';ctx.fillRect(e.x-w/2,e.y-e.r-10,w*clamp(e.hp/e.max,0,1),3);}
}
