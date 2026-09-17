const MID_GUARDIAN_VERSION=2;
const MID_GUARDIAN_KEYS=new Set(['bellkeeper','colossus','astronomer','scribe']);
Object.assign(ENDGAME_HP,{bellkeeper:6400,colossus:9800,astronomer:13400,scribe:17800});
Object.assign(ENDGAME_DAMAGE,{bellkeeper:30,colossus:36,astronomer:41,scribe:46});
Object.assign(LATE_BOSSES.bellkeeper,{hp:6400,dmg:30});
Object.assign(LATE_BOSSES.emberColossus,{hp:9800,dmg:36});
Object.assign(LATE_BOSSES.glassAstronomer,{hp:13400,dmg:41});
Object.assign(LATE_BOSSES.paleScribe,{hp:17800,dmg:46});

const middleMakeLateBoss=makeLateBoss;
makeLateBoss=function(type,x,y,name,role=''){
 const b=middleMakeLateBoss(type,x,y,name,role);if(MID_GUARDIAN_KEYS.has(b.bossKey))b.midGuardianVersion=MID_GUARDIAN_VERSION;return b;
};
function midGuardianPieces(b,kind=''){return G.enemies.filter(e=>!e.dead&&e.midPiece&&e.ownerUid===b.uid&&(!kind||e.mechanism===kind)).sort((a,b)=>a.midSlot-b.midSlot);}
function discardMidGuardianPieces(b){for(const e of G.enemies)if(!e.dead&&e.mechanism&&e.ownerUid===b.uid)e.dead=true;}
function clearMidGuardianHazards(b){if(G.world?.lateHazards)G.world.lateHazards=G.world.lateHazards.filter(h=>h.ownerUid!==b.uid);}
function placeMidGuardianPiece(b,kind,slot,count,radius,hp){
 const a=arenaBounds(),angle=-Math.PI/2+slot*TAU/count+(b.bs.mid?.phase||0)*.31,tx=a.cx+Math.cos(angle)*radius,ty=a.cy+Math.sin(angle)*radius*.78,pos=safePosition(G.world,tx,ty,20)||{x:tx,y:ty},e=spawnEnemy('bossMechanism',pos.x,pos.y,false),scale=Math.pow(1.35,depthCycle());
 Object.assign(e,{midPiece:true,midSlot:slot,mechanism:kind,ownerUid:b.uid,hp:Math.round(hp*scale),max:Math.round(hp*scale),aggro:true,solid:false,life:999999,attackClock:999999,phase:slot*.8,col:b.col,mouthA:angle+Math.PI,orbitA:angle,orbitRadius:radius,orbitRate:(slot%2?1:-1)*(.16+(b.bs.mid?.phase||0)*.05),sanctuaryT:0,depthRevision:DEPTH_REVISION});return e;
}
function createMidGuardianPieces(b){
 discardMidGuardianPieces(b);const a=arenaBounds(),radius=Math.max(82,Math.min(a.right-a.left,a.bottom-a.top)*.31),m=b.bs.mid,phase=m.phase||0;
 if(b.bossKey==='bellkeeper')for(let i=0;i<2;i++)placeMidGuardianPiece(b,'bell',i,2,radius,phase?500:420);
 else if(b.bossKey==='colossus')for(let i=0;i<(phase?3:2);i++)placeMidGuardianPiece(b,'vent',i,phase?3:2,radius,phase?640:560);
 else if(b.bossKey==='astronomer')for(let i=0;i<(phase?4:3);i++)placeMidGuardianPiece(b,'lens',i,phase?4:3,radius,phase?590:500);
 else for(let i=0;i<3;i++)placeMidGuardianPiece(b,'seal',i,3,radius,phase?720:610);
 m.respawn=0;m.pieceSet=(m.pieceSet||0)+1;
}
function midGuardianState(b){
 const s=b.bs;if(s.mid?.version===MID_GUARDIAN_VERSION)return s.mid;
 if(b.midGuardianVersion!==MID_GUARDIAN_VERSION){const ratio=clamp(b.hp/Math.max(1,b.max),0,1),cycle=depthCycle();b.max=Math.round(ENDGAME_HP[b.bossKey]*Math.pow(1.65,cycle));b.hp=Math.max(1,Math.round(b.max*ratio));b.dmg=Math.round(ENDGAME_DAMAGE[b.bossKey]*Math.pow(1.2,cycle));b.midGuardianVersion=MID_GUARDIAN_VERSION;}
 discardMidGuardianPieces(b);clearMidGuardianHazards(b);const phase=b.hp<=b.max*.5?1:0;
 s.mid={version:MID_GUARDIAN_VERSION,phase,clock:0,step:0,age:0,duration:0,events:[],fired:{},respawn:0,pieceSet:0,invulnerable:false,targetX:b.x,targetY:b.y,history:[],sample:0};s.phase=phase;s.second=!!phase;s.mode='recover';s.kind='arrival';s.t=s.duration=1.05;s.events=[];b.alpha=1;createMidGuardianPieces(b);return s.mid;
}
function midGuardianHaste(){return G.run?.infinite?(endlessMutation(G.floor).key==='relentless'?1.12:1)*Math.pow(1.1,oathRank('motion')):1;}
function midHazard(b,type,data={}){const delay=data.delay??.65,life=data.life??.42,h={midGuardianHazard:true,authored:true,boss:true,ownerUid:b.uid,type,phase:'warn',t:delay,delay,activeT:life,age:0,hitCd:0,damage:Math.max(1,Math.round(b.dmg*(data.damageMul??.7))),color:b.col,x:data.x??b.x,y:data.y??b.y,a:data.a||0,...data};G.world.lateHazards.push(h);return h;}
function midLineDistance(h,p){return segmentDistance(p.x,p.y,h.x,h.y,h.x2,h.y2);}
function midSplitLineHit(h,p){
 const dx=h.x2-h.x,dy=h.y2-h.y,len=Math.max(1,Math.hypot(dx,dy)),u=clamp(((p.x-h.x)*dx+(p.y-h.y)*dy)/(len*len),0,1),gap=(h.gap??.5)*len;if(Math.abs(u*len-gap)<(h.gapSize||42))return false;return segmentDistance(p.x,p.y,h.x,h.y,h.x2,h.y2)<p.r+(h.width||10);
}
function tickOneMidHazard(h,dt){
 const owner=G.enemies.find(e=>!e.dead&&e.uid===h.ownerUid);if(!owner)return false;h.t-=dt;h.hitCd=Math.max(0,(h.hitCd||0)-dt);
 if(h.phase==='warn'&&h.t<=0){h.phase='active';h.t=h.activeT;h.age=0;sfx(h.sound||({toneRing:'midBell',impact:'midHammer',beamSegment:'midLens',eclipse:'midLens',inkTrail:'midInk',inkRune:'midInk'}[h.type]||'eshoot'));}
 if(h.phase!=='active')return true;h.age+=dt;if(h.t<=0)return false;const p=G.player;let hit=false;
 if(h.type==='toneRing'){const q=clamp(h.age/Math.max(.01,h.activeT),0,1);h.radius=(h.startR||18)+((h.endR||250)-(h.startR||18))*q;const ang=Math.atan2(p.y-h.y,p.x-h.x),safe=Math.abs(angleDiff(ang,h.gapA||0))<(h.gapWidth||.72)/2;hit=!safe&&Math.abs(Math.hypot(p.x-h.x,p.y-h.y)-h.radius)<p.r+(h.width||10);}
 else if(h.type==='splitLine')hit=midSplitLineHit(h,p);
 else if(h.type==='beamSegment'||h.type==='quake')hit=midLineDistance(h,p)<p.r+(h.width||9);
 else if(h.type==='slagPool')hit=d2(p.x,p.y,h.x,h.y)<((h.radius||42)+p.r)**2;
 else if(h.type==='impact')hit=d2(p.x,p.y,h.x,h.y)<((h.radius||48)+p.r)**2;
 else if(h.type==='eclipse'){if(!h.evaluated){h.evaluated=true;hit=Math.hypot(p.x-h.safeX,p.y-h.safeY)>h.safeR-p.r;}}
 else if(h.type==='inkRune'){if(!h.evaluated){h.evaluated=true;hit=d2(p.x,p.y,h.x,h.y)<((h.radius||43)+p.r)**2;}}
 else if(h.type==='inkTrail'){for(let i=1;i<(h.points||[]).length&&!hit;i++)hit=segmentDistance(p.x,p.y,h.points[i-1].x,h.points[i-1].y,h.points[i].x,h.points[i].y)<p.r+(h.width||10);}
 if(hit&&h.hitCd<=0){hurtPlayer(h.damage,h.x,h.y);h.hitCd=h.type==='slagPool'?.72:.5;}return true;
}
const middleTickLateHazards=tickLateHazards;
tickLateHazards=function(dt){
 const w=G.world;if(!w?.lateHazards)return middleTickLateHazards(dt);const ours=w.lateHazards.filter(h=>h.midGuardianHazard);w.lateHazards=w.lateHazards.filter(h=>!h.midGuardianHazard);middleTickLateHazards(dt);for(const h of ours)if(tickOneMidHazard(h,dt))w.lateHazards.push(h);
};
function drawMidLine(ctx,h,active,alpha,width=2){ctx.strokeStyle=active?'#fff4ce':h.color;ctx.globalAlpha=alpha;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(h.x,h.y);ctx.lineTo(h.x2,h.y2);ctx.stroke();}
const middleDrawLateHazard=drawLateHazard;
drawLateHazard=function(ctx,h){
 if(!h.midGuardianHazard)return middleDrawLateHazard(ctx,h);const active=h.phase==='active',u=active?1:clamp(1-h.t/Math.max(.01,h.delay),0,1),t=save.motion?1:G.tAll;ctx.save();ctx.globalCompositeOperation='lighter';
 if(h.type==='toneRing'){const r=h.radius||h.startR||18,g=h.gapA||0,w=h.gapWidth||.72;ctx.strokeStyle=active?'#e9ffff':h.color;ctx.globalAlpha=active?.72:.18+u*.3;ctx.lineWidth=active?Math.max(4,(h.width||10)*.65):2;ctx.beginPath();ctx.arc(h.x,h.y,r,g+w/2,g+TAU-w/2);ctx.stroke();for(const side of [-1,1]){const a=g+side*w/2;ctx.fillStyle='#fff3bf';ctx.globalAlpha=.65;ctx.fillRect(h.x+Math.cos(a)*r-2,h.y+Math.sin(a)*r-2,4,4);}}
 else if(h.type==='splitLine'){const dx=h.x2-h.x,dy=h.y2-h.y,len=Math.max(1,Math.hypot(dx,dy)),ux=dx/len,uy=dy/len,gap=(h.gap??.5)*len,half=h.gapSize||42;ctx.strokeStyle=active?'#fff0c2':h.color;ctx.lineWidth=active?(h.width||10):2;ctx.globalAlpha=active?.7:.16+u*.32;for(const [a,b]of[[0,Math.max(0,gap-half)],[Math.min(len,gap+half),len]]){ctx.beginPath();ctx.moveTo(h.x+ux*a,h.y+uy*a);ctx.lineTo(h.x+ux*b,h.y+uy*b);ctx.stroke();}ctx.fillStyle='#ffffff';ctx.globalAlpha=.55;ctx.fillRect(h.x+ux*gap-uy*3-2,h.y+uy*gap+ux*3-2,4,4);ctx.fillRect(h.x+ux*gap+uy*3-2,h.y+uy*gap-ux*3-2,4,4);}
 else if(h.type==='beamSegment'||h.type==='quake'){drawMidLine(ctx,h,active,active?.76:.16+u*.34,active?Math.max(3,(h.width||9)*.62):1.5);if(active){ctx.strokeStyle=h.color;ctx.globalAlpha=.12;ctx.lineWidth=(h.width||9)*1.9;ctx.beginPath();ctx.moveTo(h.x,h.y);ctx.lineTo(h.x2,h.y2);ctx.stroke();}}
 else if(h.type==='slagPool'||h.type==='impact'||h.type==='inkRune'){const r=h.radius||44;ctx.translate(h.x,h.y);ctx.strokeStyle=active?'#fff0c0':h.color;ctx.fillStyle=h.color;ctx.globalAlpha=active?.22:.08+u*.16;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.globalAlpha=active?.72:.18+u*.35;ctx.lineWidth=active?3:1.5;ctx.beginPath();ctx.arc(0,0,r*(active?1:.55+u*.45),0,TAU);ctx.stroke();if(h.type==='inkRune'){ctx.rotate((h.rune||0)*Math.PI/2);ctx.fillRect(-2,-r*.65,4,r*1.3);ctx.fillRect(-r*.42,-2,r*.84,4);}}
 else if(h.type==='eclipse'){const pulse=3*Math.sin(t*5);ctx.strokeStyle='#e7ffff';ctx.globalAlpha=.25+u*.4;ctx.lineWidth=2;ctx.beginPath();ctx.arc(h.safeX,h.safeY,h.safeR+pulse,0,TAU);ctx.stroke();ctx.strokeStyle=h.color;ctx.globalAlpha=.18+u*.28;for(let i=0;i<12;i++){const a=i*TAU/12;ctx.beginPath();ctx.moveTo(h.safeX+Math.cos(a)*(h.safeR+8),h.safeY+Math.sin(a)*(h.safeR+8));ctx.lineTo(h.safeX+Math.cos(a)*(h.safeR+22+u*13),h.safeY+Math.sin(a)*(h.safeR+22+u*13));ctx.stroke();}}
 else if(h.type==='inkTrail'){const pts=h.points||[];ctx.strokeStyle=active?'#f3e4c5':h.color;ctx.globalAlpha=active?.78:.16+u*.38;ctx.lineWidth=active?(h.width||10):2;ctx.lineJoin='bevel';ctx.beginPath();for(let i=0;i<pts.length;i++)i?ctx.lineTo(pts[i].x,pts[i].y):ctx.moveTo(pts[i].x,pts[i].y);ctx.stroke();if(!active)for(let i=1;i<pts.length;i+=2){ctx.fillStyle='#fff0c4';ctx.fillRect(pts[i].x-2,pts[i].y-2,4,4);}}
 ctx.restore();
};

function midPieceBroken(owner,e){
 const m=owner.bs?.mid;if(!m||midGuardianPieces(owner).length)return;m.respawn={bellkeeper:13,colossus:15,astronomer:14,scribe:16}[owner.bossKey];owner.bs.exposed={bellkeeper:5.5,colossus:6.5,astronomer:6,scribe:6}[owner.bossKey];m.events=[];m.invulnerable=false;owner.alpha=1;owner.bs.mode='cool';owner.bs.t=owner.bs.duration=1.05;clearMidGuardianHazards(owner);const note={bellkeeper:'Both bells go quiet.',colossus:'Pressure gone. The core opens.',astronomer:'The light loses its path.',scribe:'The last seal tears.'}[owner.bossKey];fieldNote(note,2.3);sfx('midBreak');
}
const middleKillEnemy=killEnemy;
killEnemy=function(e){const was=e?.dead,owner=e?.midPiece&&G.enemies.find(o=>!o.dead&&o.uid===e.ownerUid);middleKillEnemy(e);if(owner&&!was&&e.dead)midPieceBroken(owner,e);};
const middleDamageEnemy=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
 if(e?.lateBoss&&e.introduced&&MID_GUARDIAN_KEYS.has(e.bossKey)){const s=e.bs,m=s.mid;if(m?.invulnerable||s.mode==='shift')return;const pieces=midGuardianPieces(e).length;if(pieces&&(e.bossKey==='bellkeeper'||e.bossKey==='astronomer'||e.bossKey==='scribe'))dmg*=e.bossKey==='bellkeeper'?.58:e.bossKey==='astronomer'?.72:.68;}
 return middleDamageEnemy(e,dmg,ang,crit,kb,kind);
};
const middleLateEnemyAI=lateEnemyAI;
lateEnemyAI=function(e,dt,d,dx,dy){
 if(!e.midPiece)return middleLateEnemyAI(e,dt,d,dx,dy);const owner=G.enemies.find(o=>!o.dead&&o.uid===e.ownerUid);if(!owner){e.dead=true;return;}e.phase=(e.phase||0)+dt;e.sanctuaryT=Math.max(0,(e.sanctuaryT||0)-dt);if(e.mechanism==='lens'&&e.sanctuaryT<=0){const a=arenaBounds(),m=owner.bs.mid;e.orbitA+=(e.orbitRate||.15)*dt*(m.phase?1.32:1);const tx=a.cx+Math.cos(e.orbitA)*e.orbitRadius,ty=a.cy+Math.sin(e.orbitA)*e.orbitRadius*.72;e.x+=(tx-e.x)*Math.min(1,dt*2.2);e.y+=(ty-e.y)*Math.min(1,dt*2.2);}if(e.mechanism==='bell')e.mouthA+=(Math.sin(G.tAll*.8+e.midSlot)*.08-angleDiff(e.mouthA,e.orbitA+Math.PI))*.02;
};

function beginMidMove(b,kind,wind,duration,events,target={}){const s=b.bs,m=s.mid;s.kind=kind;s.mode='windup';s.t=s.duration=wind;m.age=0;m.duration=duration;m.events=events.map((e,i)=>({id:(m.step+1)*20+i,...e,fired:false}));m.targetX=target.x??G.player.x;m.targetY=target.y??G.player.y;s.a=Math.atan2(m.targetY-b.y,m.targetX-b.x);}
function midArenaPoint(x,y,pad=32){const a=arenaBounds();return{x:clamp(x,a.left+pad,a.right-pad),y:clamp(y,a.top+pad,a.bottom-pad)};}
function fireMidEvent(b,e){
 const s=b.bs,m=s.mid,p=G.player,a=arenaBounds(),pieces=midGuardianPieces(b),target={x:e.x??m.targetX,y:e.y??m.targetY};
 if(e.type==='bellRing'){const src=pieces[e.slot%Math.max(1,pieces.length)]||b,gap=(src.mouthA??Math.atan2(a.cy-src.y,a.cx-src.x))+(e.turn||0);if(src!==b)src.mouthA=gap;midHazard(b,'toneRing',{x:src.x,y:src.y,startR:18,endR:e.endR||Math.hypot(a.right-a.left,a.bottom-a.top)*.75,gapA:gap,gapWidth:e.gapWidth||.82,width:e.width||10,delay:.24,life:e.life||1.55,damageMul:.72});}
 else if(e.type==='bellSink'){m.invulnerable=true;b.alpha=.14;burst(b.x,b.y,16,b.col,90,.5,2,true);}
 else if(e.type==='bellRise'){const q=midArenaPoint(target.x,target.y,55),pos=safePosition(G.world,q.x,q.y,b.r)||q;b.x=pos.x;b.y=pos.y;b.alpha=1;m.invulnerable=false;midHazard(b,'toneRing',{x:b.x,y:b.y,startR:22,endR:260,gapA:Math.atan2(p.y-b.y,p.x-b.x),gapWidth:m.phase?.68:.86,width:11,delay:.28,life:1.4,damageMul:.75});s.exposed=Math.max(s.exposed||0,1.15);}
 else if(e.type==='current'){const vertical=!!e.vertical,gapPx=vertical?clamp(target.y,a.top+60,a.bottom-60):clamp(target.x,a.left+60,a.right-60),gap=vertical?(gapPx-a.top)/(a.bottom-a.top):(gapPx-a.left)/(a.right-a.left),off=e.offset||0;midHazard(b,'splitLine',{x:vertical?a.cx+off:a.left,y:vertical?a.top:a.cy+off,x2:vertical?a.cx+off:a.right,y2:vertical?a.bottom:a.cy+off,gap,gapSize:m.phase?38:48,width:m.phase?13:11,delay:e.delay??.58,life:.48,damageMul:.68});}
 else if(e.type==='forgeSlam'){const q=midArenaPoint(target.x,target.y,58),fromA=Math.atan2(q.y-b.y,q.x-b.x),land=midArenaPoint(q.x-Math.cos(fromA)*62,q.y-Math.sin(fromA)*62,54);b.x=land.x;b.y=land.y;midHazard(b,'impact',{x:q.x,y:q.y,radius:e.radius||54,delay:.22,life:.34,damageMul:.86});for(let i=0;i<4;i++){const ang=i*TAU/4+(e.turn||0),len=150+(m.phase?28:0);midHazard(b,'quake',{x:q.x+Math.cos(ang)*25,y:q.y+Math.sin(ang)*25,x2:q.x+Math.cos(ang)*len,y2:q.y+Math.sin(ang)*len,width:8,delay:.38,life:.38,damageMul:.65});}G.cam.shake=.85;}
 else if(e.type==='ventBlast'){const srcs=pieces.length?pieces:[b];for(const src of srcs){const ang=Math.atan2(target.y-src.y,target.x-src.x);for(const off of (m.phase?[-.19,0,.19]:[-.13,.13]))midHazard(b,'beamSegment',{x:src.x,y:src.y,x2:src.x+Math.cos(ang+off)*410,y2:src.y+Math.sin(ang+off)*410,width:8,delay:.55,life:.38,damageMul:.62,sound:'midHammer'});}}
 else if(e.type==='slag'){midHazard(b,'slagPool',{x:target.x,y:target.y,radius:e.radius||42,delay:.55,life:e.life||3.6,damageMul:.42,sound:'midHammer'});}
 else if(e.type==='forgeLane'){const vertical=!!e.vertical,gap=vertical?(target.y-a.top)/(a.bottom-a.top):(target.x-a.left)/(a.right-a.left);midHazard(b,'splitLine',{x:vertical?a.cx+(e.offset||0):a.left,y:vertical?a.top:a.cy+(e.offset||0),x2:vertical?a.cx+(e.offset||0):a.right,y2:vertical?a.bottom:a.cy+(e.offset||0),gap:clamp(gap,.15,.85),gapSize:44,width:14,delay:.72,life:.5,damageMul:.72,sound:'midHammer'});}
 else if(e.type==='refract'){if(!pieces.length){for(let i=-2;i<=2;i++)lateShot(b,Math.atan2(target.y-b.y,target.x-b.x)+i*.17,270,b.dmg*.58,b.col);return;}for(const lens of pieces){const toLens=Math.atan2(lens.y-b.y,lens.x-b.x),out=Math.atan2(target.y-lens.y,target.x-lens.x)+(e.turn||0);midHazard(b,'beamSegment',{x:b.x,y:b.y,x2:lens.x,y2:lens.y,width:5,delay:.64,life:.46,damageMul:.58,sound:'midLens'});midHazard(b,'beamSegment',{x:lens.x,y:lens.y,x2:lens.x+Math.cos(out)*620,y2:lens.y+Math.sin(out)*620,width:m.phase?9:8,delay:.64,life:.46,damageMul:.72,sound:'midLens'});lens.orbitA=toLens;}}
 else if(e.type==='constellation'){if(pieces.length<2)return;for(let i=0;i<pieces.length;i++){if(i===e.gap)continue;const q=pieces[(i+1)%pieces.length];midHazard(b,'beamSegment',{x:pieces[i].x,y:pieces[i].y,x2:q.x,y2:q.y,width:m.phase?9:7,delay:.72,life:.6,damageMul:.68,sound:'midLens'});}}
 else if(e.type==='eclipse'){const lens=pieces[e.slot%Math.max(1,pieces.length)]||b;lens.sanctuaryT=1.8;midHazard(b,'eclipse',{x:a.cx,y:a.cy,safeX:lens.x,safeY:lens.y,safeR:m.phase?58:68,delay:1.25,life:.28,damageMul:.82,sound:'midLens'});}
 else if(e.type==='redact'){let pts=(e.points||[]).map(q=>({x:q.x,y:q.y}));if(e.mirror)pts=pts.map(q=>({x:a.cx-(q.x-a.cx),y:a.cy-(q.y-a.cy)}));if(pts.length>1)midHazard(b,'inkTrail',{x:pts[0].x,y:pts[0].y,points:pts,width:m.phase?12:10,delay:e.delay??.72,life:e.life||.48,damageMul:.72,sound:'midInk'});}
 else if(e.type==='margin'){const vertical=!!e.vertical,gap=vertical?(target.y-a.top)/(a.bottom-a.top):(target.x-a.left)/(a.right-a.left),positions=e.positions||[-70,70];for(const off of positions)midHazard(b,'splitLine',{x:vertical?a.cx+off:a.left,y:vertical?a.top:a.cy+off,x2:vertical?a.cx+off:a.right,y2:vertical?a.bottom:a.cy+off,gap:clamp(gap,.17,.83),gapSize:m.phase?36:46,width:11,delay:e.delay??.72,life:.5,damageMul:.68,sound:'midInk'});}
 else if(e.type==='quillHop'){const q=midArenaPoint(target.x,target.y,52),ox=b.x,oy=b.y;b.x=q.x;b.y=q.y;midHazard(b,'beamSegment',{x:ox,y:oy,x2:q.x,y2:q.y,width:11,delay:.22,life:.42,damageMul:.78,sound:'midInk'});burst(q.x,q.y,10,b.col,90,.35,2,true);}
 else if(e.type==='rune')midHazard(b,'inkRune',{x:target.x,y:target.y,radius:e.radius||43,rune:e.rune||0,delay:e.delay??.58,life:.28,damageMul:.72,sound:'midInk'});
}
function startBellMove(b,kind){const m=b.bs.mid,p=G.player,target=midArenaPoint(p.x+(p.vigilVX||0)*.3,p.y+(p.vigilVY||0)*.3,58);if(kind==='toll')beginMidMove(b,kind,.72,2.45,[{at:.05,type:'bellRing',slot:0},{at:.78,type:'bellRing',slot:1,turn:.2}],target);else if(kind==='dissonance')beginMidMove(b,kind,.62,2.95,[{at:.05,type:'bellRing',slot:0,gapWidth:.7,life:1.35},{at:.54,type:'bellRing',slot:1,turn:-.35,gapWidth:.7,life:1.35},{at:1.08,type:'bellRing',slot:0,turn:.55,gapWidth:.62,life:1.3}],target);else if(kind==='undertow')beginMidMove(b,kind,.58,2.2,[{at:.02,type:'bellSink'},{at:.88,type:'bellRise',x:target.x,y:target.y}],target);else beginMidMove(b,kind,.68,2.55,[{at:.08,type:'current',vertical:false,offset:-70,x:target.x,y:target.y},{at:.7,type:'current',vertical:true,offset:68,x:target.x,y:target.y},{at:1.28,type:'current',vertical:false,offset:70,x:target.x,y:target.y}],target);}
function startColossusMove(b,kind){const p=G.player,target=midArenaPoint(p.x+(p.vigilVX||0)*.38,p.y+(p.vigilVY||0)*.38,60);if(kind==='hammer')beginMidMove(b,kind,.82,1.7,[{at:.08,type:'forgeSlam',x:target.x,y:target.y}],target);else if(kind==='hammerfall'){const a=arenaBounds(),q=midArenaPoint(a.cx-(target.x-a.cx)*.55,a.cy-(target.y-a.cy)*.55,60);beginMidMove(b,kind,.68,2.35,[{at:.05,type:'forgeSlam',x:target.x,y:target.y},{at:1.05,type:'forgeSlam',x:q.x,y:q.y,turn:.38,radius:58}],target);}else if(kind==='pressure')beginMidMove(b,kind,.72,2.3,[{at:.05,type:'ventBlast',x:target.x,y:target.y},{at:1.02,type:'ventBlast',x:G.player.x,y:G.player.y}],target);else if(kind==='slag')beginMidMove(b,kind,.62,2.4,[{at:.05,type:'slag',x:target.x,y:target.y},{at:.48,type:'slag',x:target.x+70,y:target.y-38},{at:.92,type:'slag',x:target.x-62,y:target.y+46}],target);else beginMidMove(b,kind,.78,2.85,[{at:.05,type:'forgeLane',vertical:false,offset:-72,x:target.x,y:target.y},{at:.78,type:'forgeLane',vertical:true,offset:70,x:target.x,y:target.y},{at:1.5,type:'forgeSlam',x:target.x,y:target.y,radius:61}],target);}
function startAstronomerMove(b,kind){const m=b.bs.mid,p=G.player,target=midArenaPoint(p.x+(p.vigilVX||0)*.22,p.y+(p.vigilVY||0)*.22,54),pieces=midGuardianPieces(b);if(kind==='refraction')beginMidMove(b,kind,.8,1.85,[{at:.06,type:'refract',x:target.x,y:target.y}],target);else if(kind==='parallax')beginMidMove(b,kind,.68,2.65,[{at:.04,type:'refract',x:target.x,y:target.y,turn:-.18},{at:1.08,type:'refract',x:G.player.x,y:G.player.y,turn:.28}],target);else if(kind==='constellation')beginMidMove(b,kind,.75,2.05,[{at:.05,type:'constellation',gap:(m.step+(m.phase?1:0))%Math.max(1,pieces.length)}],target);else beginMidMove(b,kind,.58,1.9,[{at:.03,type:'eclipse',slot:m.step%Math.max(1,pieces.length)}],target);}
function recentScribePath(m){const pts=(m.history||[]).slice(-13);if(pts.length<3){const p=G.player;return[{x:p.x-70,y:p.y},{x:p.x,y:p.y},{x:p.x+70,y:p.y}];}return pts.filter((_,i)=>i%2===0).map(q=>({x:q.x,y:q.y}));}
function startScribeMove(b,kind){const m=b.bs.mid,p=G.player,target=midArenaPoint(p.x,p.y,48),path=recentScribePath(m),rev=[...path].reverse();if(kind==='redaction')beginMidMove(b,kind,.68,1.9,[{at:.05,type:'redact',points:path}],target);else if(kind==='palimpsest')beginMidMove(b,kind,.6,2.45,[{at:.04,type:'redact',points:path},{at:.82,type:'redact',points:path,mirror:true,delay:.62}],target);else if(kind==='margins')beginMidMove(b,kind,.72,2.25,[{at:.05,type:'margin',vertical:m.step%2===0,x:target.x,y:target.y},{at:.92,type:'margin',vertical:m.step%2!==0,positions:[-38,38],x:target.x,y:target.y}],target);else if(kind==='quill')beginMidMove(b,kind,.56,2.15,rev.slice(0,3).map((q,i)=>({at:.12+i*.55,type:'quillHop',x:q.x,y:q.y})),target);else{const a=arenaBounds(),r=86;beginMidMove(b,kind,.66,2.45,[0,1,2,3].map(i=>({at:.08+i*.48,type:'rune',rune:i,x:clamp(target.x+Math.cos(i*TAU/4)*r,a.left+50,a.right-50),y:clamp(target.y+Math.sin(i*TAU/4)*r,a.top+50,a.bottom-50)})),target);}}
const MID_SEQUENCES={bellkeeper:[['toll','undertow','crosscurrent'],['dissonance','undertow','crosscurrent','toll']],colossus:[['hammer','pressure','slag'],['hammerfall','pressure','meltdown','slag']],astronomer:[['refraction','constellation','eclipse'],['parallax','eclipse','constellation','refraction']],scribe:[['redaction','margins','quill'],['palimpsest','rewrite','quill','margins']]};
function moveMiddleGuardian(b,dt,d,dx,dy){const k=b.bossKey,s=b.bs,m=s.mid,den=Math.max(1,d);if(k==='bellkeeper'){const sway=Math.sin(m.clock*.9+(m.phase||0));moveEnt(G.world,b,(dx/den*.22-dy/den*sway*.55)*b.spd*dt,(dy/den*.22+dx/den*sway*.55)*b.spd*dt);}else if(k==='colossus'){if(d>155)moveEnt(G.world,b,dx/den*b.spd*dt,dy/den*b.spd*dt);}else if(k==='astronomer'){const step=d>245?1:d<165?-.7:0,side=Math.sin(m.clock*.55);moveEnt(G.world,b,(dx/den*step-dy/den*side*.5)*b.spd*dt,(dy/den*step+dx/den*side*.5)*b.spd*dt);}else{const step=d>220?1:d<145?-.45:0,side=Math.sin(m.clock*.7)*.35;moveEnt(G.world,b,(dx/den*step-dy/den*side)*b.spd*dt,(dy/den*step+dx/den*side)*b.spd*dt);}}
function startNextMiddleMove(b){const m=b.bs.mid,list=MID_SEQUENCES[b.bossKey][m.phase],kind=list[m.step++%list.length];if(b.bossKey==='bellkeeper')startBellMove(b,kind);else if(b.bossKey==='colossus')startColossusMove(b,kind);else if(b.bossKey==='astronomer')startAstronomerMove(b,kind);else startScribeMove(b,kind);}
function middleGuardianAI(b,dt,d,dx,dy){
 if(!b.introduced)return;dt*=midGuardianHaste();const s=b.bs,m=midGuardianState(b),p=G.player;m.clock+=dt;s.exposed=Math.max(0,(s.exposed||0)-dt);m.respawn=Math.max(0,(m.respawn||0)-dt);
 if(b.bossKey==='scribe'){m.sample-=dt;if(m.sample<=0){m.sample=.14;m.history.push({x:p.x,y:p.y});if(m.history.length>30)m.history.shift();}}
 const phase=b.hp<=b.max*.5?1:0;if(phase>m.phase){m.phase=phase;s.phase=phase;s.second=true;s.mode='shift';s.kind='phase';s.t=s.duration=1.55;m.events=[];m.invulnerable=false;b.alpha=1;discardMidGuardianPieces(b);clearMidGuardianHazards(b);G.ebul=[];burst(b.x,b.y,32,b.col,190,.9,3,true);fieldNote({bellkeeper:'The drowned bells answer together.',colossus:'The second furnace opens.',astronomer:'The dome loses its horizon.',scribe:'The clean copy tears in half.'}[b.bossKey],2.8);sfx('midPhase');return;}
 if(s.mode==='shift'){s.t-=dt;if(s.t<=0){createMidGuardianPieces(b);s.mode='recover';s.t=s.duration=.8;s.exposed=1.3;}return;}
 if(!midGuardianPieces(b).length&&m.respawn<=0&&s.mode!=='cool')createMidGuardianPieces(b);
 if(s.mode==='cool'){s.t-=dt;if(s.t<=0){s.mode='recover';s.t=s.duration=.5;}return;}
 if(s.mode==='windup'){s.t-=dt;if(s.t<=0){s.mode='slam';s.t=s.duration=m.duration;m.age=0;}return;}
 if(s.mode==='slam'){s.t-=dt;m.age+=dt;for(const e of m.events)if(!e.fired&&e.at<=m.age){e.fired=true;fireMidEvent(b,e);}if(s.t<=0){m.invulnerable=false;b.alpha=1;s.mode='recover';s.t=s.duration=m.phase?.55:.72;s.exposed=Math.max(s.exposed||0,.45);}return;}
 if(s.mode==='recover'){s.t-=dt;if(s.t<=0){s.mode='wait';s.t=m.phase?.3:.48;}return;}
 s.t-=dt;moveMiddleGuardian(b,dt,d,dx,dy);if(s.t<=0)startNextMiddleMove(b);
}
bellkeeperAI=colossusAI=astronomerAI=scribeAI=middleGuardianAI;

const middleActivateLateBoss=activateLateBoss;
activateLateBoss=function(b){middleActivateLateBoss(b);if(MID_GUARDIAN_KEYS.has(b.bossKey)){for(const e of G.enemies)if(e.lateBoss&&e.bossKey===b.bossKey)midGuardianState(e);saveNow();}};
const middleResumeRun=resumeRun;
resumeRun=function(){middleResumeRun();if(G.boss?.introduced&&MID_GUARDIAN_KEYS.has(G.boss.bossKey)){for(const b of G.enemies)if(!b.dead&&b.lateBoss&&b.bossKey===G.boss.bossKey)midGuardianState(b);updateHUD(0);}};
const middleKillBoss=killBoss;
killBoss=function(b){if(MID_GUARDIAN_KEYS.has(b?.bossKey)){clearMidGuardianHazards(b);discardMidGuardianPieces(b);}return middleKillBoss(b);};

const middleDrawMechanism=drawMechanism;
drawMechanism=function(ctx,e){
 if(!e.midPiece)return middleDrawMechanism(ctx,e);const t=save.motion?1:G.tAll,pulse=.5+.5*Math.sin(t*4+e.midSlot);ctx.save();ctx.translate(Math.round(e.x),Math.round(e.y));ctx.imageSmoothingEnabled=false;ctx.globalCompositeOperation='lighter';ctx.strokeStyle=e.col;ctx.fillStyle='#0a1018';ctx.lineWidth=2;
 if(e.mechanism==='bell'){ctx.strokeStyle='#7399a2';ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(0,-20);ctx.stroke();ctx.rotate(e.mouthA-Math.PI/2);ctx.fillStyle='#173039';ctx.beginPath();ctx.moveTo(-12,-18);ctx.lineTo(12,-18);ctx.lineTo(19,12);ctx.lineTo(-19,12);ctx.closePath();ctx.fill();ctx.strokeStyle=e.col;ctx.stroke();ctx.fillStyle='#ccecf0';ctx.fillRect(-5,-14,3,21);ctx.fillStyle='#f0d18d';ctx.fillRect(-3,12,6,8);ctx.globalAlpha=.35+pulse*.25;ctx.strokeStyle='#e8ffff';ctx.beginPath();ctx.arc(0,0,24,0,TAU);ctx.stroke();}
 else if(e.mechanism==='vent'){ctx.fillStyle='#2a2020';ctx.fillRect(-21,-19,42,38);ctx.strokeStyle='#9b6950';ctx.strokeRect(-21,-19,42,38);for(let i=-1;i<=1;i++){ctx.fillStyle='#bd7245';ctx.fillRect(i*11-3,-25,6,34);ctx.fillStyle='#ffe19a';ctx.globalAlpha=.35+pulse*.45;ctx.fillRect(i*11-1,-20,2,22);}ctx.globalAlpha=1;ctx.strokeStyle=e.col;ctx.beginPath();ctx.arc(0,10,10,0,TAU);ctx.stroke();}
 else if(e.mechanism==='lens'){ctx.rotate(e.orbitA+t*.2);ctx.strokeStyle=e.sanctuaryT>0?'#ffffff':e.col;ctx.globalAlpha=e.sanctuaryT>0?.95:.75;for(let i=0;i<3;i++){ctx.rotate(Math.PI/3);ctx.strokeRect(-22+i*4,-7-i*2,44-i*8,14+i*4);}ctx.rotate(-e.orbitA-t*.2);ctx.fillStyle=e.sanctuaryT>0?'#ffffff':'#bdf6ff';ctx.globalAlpha=.6+pulse*.35;ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(10,0);ctx.lineTo(0,12);ctx.lineTo(-10,0);ctx.closePath();ctx.fill();}
 else{ctx.rotate(Math.sin(t*.7+e.midSlot)*.08);ctx.fillStyle='#26222b';ctx.fillRect(-17,-24,34,46);ctx.strokeStyle=e.col;ctx.strokeRect(-17,-24,34,46);ctx.fillStyle='#e8d9b9';ctx.fillRect(-12,-19,24,35);ctx.fillStyle='#51475a';for(let i=0;i<5;i++)ctx.fillRect(-8,-13+i*6,12-(i%2)*5,2);ctx.fillStyle=e.col;ctx.globalAlpha=.55+pulse*.3;ctx.fillRect(13,-20,3,38);}
 ctx.restore();ctx.fillStyle='#101622';ctx.fillRect(e.x-22,e.y+29,44,3);ctx.fillStyle=e.col;ctx.fillRect(e.x-22,e.y+29,44*clamp(e.hp/e.max,0,1),3);
};
const middleDrawLateBossBody=drawLateBossBody;
drawLateBossBody=function(ctx,b){
 middleDrawLateBossBody(ctx,b);if(!MID_GUARDIAN_KEYS.has(b.bossKey))return;const t=save.motion?1:G.tAll,s=b.bs||{},m=s.mid||{phase:s.phase||0};ctx.save();ctx.translate(b.x,b.y);ctx.globalCompositeOperation='lighter';ctx.strokeStyle=b.col;ctx.lineWidth=2;
 if(b.bossKey==='bellkeeper'){ctx.globalAlpha=.55;for(const side of [-1,1]){ctx.save();ctx.translate(side*27,-4+Math.sin(t*2+side)*3);ctx.beginPath();ctx.moveTo(-8,-10);ctx.lineTo(8,-10);ctx.lineTo(12,10);ctx.lineTo(-12,10);ctx.closePath();ctx.stroke();ctx.fillStyle='#f3d59a';ctx.fillRect(-2,9,4,7);ctx.restore();}ctx.strokeStyle='#dffcff';for(let i=0;i<3;i++){ctx.globalAlpha=.16+i*.08;ctx.beginPath();ctx.arc(0,18,24+i*8+Math.sin(t*2+i)*2,0,TAU);ctx.stroke();}}
 else if(b.bossKey==='colossus'){const hot=s.kind==='meltdown'||s.kind==='pressure';ctx.fillStyle=hot?'#ffb05e':'#713e2e';ctx.globalAlpha=hot?.82:.52;ctx.fillRect(-16,-4,32,26);ctx.fillStyle='#fff0ad';ctx.globalAlpha=.35+.35*Math.sin(t*5);for(let i=0;i<4;i++)ctx.fillRect(-12+i*8,0,4,18);for(const side of [-1,1]){ctx.strokeStyle='#c4835d';ctx.globalAlpha=.55;ctx.strokeRect(side*35-7,-28,14,48);ctx.fillStyle='#ffcb77';ctx.globalAlpha=hot?.65:.25;ctx.fillRect(side*35-3,-22,6,34);}}
 else if(b.bossKey==='astronomer'){for(let i=0;i<7;i++){const ang=i*TAU/7+t*.18*(i%2?1:-1),rr=32+(i%2)*15;ctx.fillStyle=i%2?'#ffffff':b.col;ctx.globalAlpha=.2+(i%3)*.16;ctx.save();ctx.translate(Math.cos(ang)*rr,Math.sin(ang)*rr*.65);ctx.rotate(ang);ctx.fillRect(-4,-2,9,4);ctx.restore();}ctx.strokeStyle='#e8ffff';ctx.globalAlpha=.55;ctx.beginPath();ctx.ellipse(0,0,45,17,t*.12,0,TAU);ctx.stroke();}
 else{ctx.strokeStyle='#efe1c3';ctx.globalAlpha=.42;for(let i=0;i<5;i++){const y=-25+i*13,flutter=Math.sin(t*2+i)*5;ctx.beginPath();ctx.moveTo(-34+flutter,y);ctx.quadraticCurveTo(0,y-7,34-flutter,y+2);ctx.stroke();}ctx.fillStyle='#473e4c';ctx.globalAlpha=.7;ctx.save();ctx.rotate(s.kind==='quill'?.45:-.15);ctx.fillRect(20,-38,4,68);ctx.fillStyle='#f6e7c7';ctx.fillRect(21,-42,2,32);ctx.restore();}
 if(m.phase){ctx.strokeStyle='#fff0be';ctx.globalAlpha=.35+.18*Math.sin(t*6);ctx.beginPath();ctx.arc(0,0,b.r+13,0,TAU);ctx.stroke();}ctx.restore();
};
const middleDrawLateWorld=drawLateWorld;
drawLateWorld=function(ctx){
 middleDrawLateWorld(ctx);const b=G.boss;if(!b?.introduced||!MID_GUARDIAN_KEYS.has(b.bossKey))return;const a=arenaBounds(),t=save.motion?1:G.tAll,m=b.bs.mid||{phase:0},pieces=midGuardianPieces(b);ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineWidth=1;
 if(b.bossKey==='bellkeeper'){ctx.strokeStyle='#7bd5df';for(let i=0;i<7;i++){ctx.globalAlpha=.07+(i%2)*.035;ctx.beginPath();for(let x=a.left;x<=a.right;x+=18)ctx.lineTo(x,a.top+35+i*(a.bottom-a.top-70)/6+Math.sin(x*.025+t*.7+i)*4);ctx.stroke();}}
 else if(b.bossKey==='colossus'){ctx.strokeStyle='#e77848';for(let i=0;i<9;i++){const x=a.left+28+i*(a.right-a.left-56)/8;ctx.globalAlpha=.08+(i%3)*.025;ctx.beginPath();ctx.moveTo(x,a.top+18);ctx.lineTo(x+Math.sin(i*3)*25,a.bottom-18);ctx.stroke();}ctx.fillStyle='#ffb05b';ctx.globalAlpha=.12+.06*Math.sin(t*3);ctx.fillRect(a.left,a.top,a.right-a.left,5+(m.phase||0)*3);ctx.fillRect(a.left,a.bottom-7-(m.phase||0)*3,a.right-a.left,7+(m.phase||0)*3);}
 else if(b.bossKey==='astronomer'){ctx.strokeStyle='#9be9f2';for(let i=0;i<pieces.length;i++){const q=pieces[(i+1)%Math.max(1,pieces.length)];if(!q)continue;ctx.globalAlpha=.09;ctx.setLineDash([3,11]);ctx.lineDashOffset=-t*8;ctx.beginPath();ctx.moveTo(pieces[i].x,pieces[i].y);ctx.lineTo(q.x,q.y);ctx.stroke();}ctx.setLineDash([]);for(let i=0;i<24;i++){ctx.fillStyle=i%3?'#c8f7ff':'#fff1bc';ctx.globalAlpha=.12+(i%4)*.04;ctx.fillRect(a.left+(i*83)%(a.right-a.left),a.top+(i*47)%(a.bottom-a.top),i%5?1:2,1);}}
 else{ctx.strokeStyle='#d9c49d';for(let i=0;i<12;i++){const y=a.top+20+i*(a.bottom-a.top-40)/11;ctx.globalAlpha=i%3===0?.1:.045;ctx.beginPath();ctx.moveTo(a.left+16,y);ctx.lineTo(a.right-16,y+Math.sin(i+t*.2)*2);ctx.stroke();}ctx.globalAlpha=.11;ctx.strokeRect(a.left+30,a.top+24,a.right-a.left-60,a.bottom-a.top-48);}
 ctx.restore();
};
const middleUpdateHUD=updateHUD;
updateHUD=function(dt){middleUpdateHUD(dt);const b=G.boss;if(!b?.introduced||!MID_GUARDIAN_KEYS.has(b.bossKey))return;const s=b.bs,m=s.mid||{phase:0},n=midGuardianPieces(b).length;if(s.mode==='shift'){setTxt('floorObjective',{bellkeeper:'A SECOND CHOIR RISES',colossus:'THE SECOND FURNACE OPENS',astronomer:'PARALLAX · THE SKY MOVES TWICE',scribe:'PALIMPSEST · THE OLD PATH RETURNS'}[b.bossKey]);return;}const text={bellkeeper:n?'READ THE BELL MOUTHS · '+n+' RESONATING':'THE CHOIR IS SILENT · STRIKE',colossus:n?'BREAK THE PRESSURE VALVES · '+n:'CORE COOLING · STRIKE',astronomer:s.kind==='eclipse'?'ECLIPSE · REACH THE BRIGHT LENS':n?'FOLLOW THE REFRACTION · '+n+' LENSES':'NO PATH FOR THE LIGHT · STRIKE',scribe:n?'THE SCRIBE REMEMBERS YOUR PATH · '+n+' SEALS':'THE RECORD IS OPEN · STRIKE'}[b.bossKey];setTxt('floorObjective',text);};
const middleSfx=sfx;
sfx=function(name,a){if(!['midBell','midHammer','midLens','midInk','midPhase','midBreak'].includes(name))return middleSfx(name,a);if(!AC||!save.sfx)return;if(name==='midBell'){bell(146.83,.8,.038,0,true);bell(293.66,.5,.018,.045,false);air(.5,.022,680,160,.8,0,'bandpass');}else if(name==='midHammer'){thump(132,35,.34,.09);air(.22,.035,1250,230,.72,0,'lowpass');}else if(name==='midLens'){bell(987.77,.44,.022,0,false);bell(1479.98,.32,.012,.035,false);air(.2,.015,3200,900,.85,0,'highpass');}else if(name==='midInk'){air(.24,.025,620,1900,.75,0,'bandpass');thump(180,74,.12,.025);}else if(name==='midPhase'){swell([110,164.81,220,329.63],1.05,.032,0);thump(92,31,.55,.08);}else{swell([196,261.63,392],.65,.025,0);air(.28,.03,1800,360,.75,0,'bandpass');}};
