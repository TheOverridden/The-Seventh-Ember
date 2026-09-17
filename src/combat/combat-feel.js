const COMBAT_FEEL={casts:[],impacts:[],deaths:[],hurtT:0,hurtA:0,serial:0};
function combatFeelReset(){COMBAT_FEEL.casts.length=0;COMBAT_FEEL.impacts.length=0;COMBAT_FEEL.deaths.length=0;COMBAT_FEEL.hurtT=0;}
function combatFeelColor(kind,crit){if(crit)return'#fff3ae';if(kind==='melee')return'#ffd27a';if(kind==='storm')return'#9eeaff';if(kind==='burn')return'#ff8c56';return'#ffc16b';}
function combatFeelCast(kind,x,y,a,power=1){const max=kind==='flare'?.34:.18;COMBAT_FEEL.casts.push({kind,x,y,a,power,life:max,max,seed:++COMBAT_FEEL.serial});if(COMBAT_FEEL.casts.length>34)COMBAT_FEEL.casts.shift();}
function combatFeelImpact(e,damage,a,crit,kind,killed){const max=killed?.46:kind==='melee'?.24:.18,col=combatFeelColor(kind,crit),r=Math.max(8,e.r||10),x=e.x-Math.cos(a)*r*.42,y=e.y-Math.sin(a)*r*.42;COMBAT_FEEL.impacts.push({x,y,a,crit,kind,killed,col,r,damage,life:max,max,seed:++COMBAT_FEEL.serial});if(COMBAT_FEEL.impacts.length>90)COMBAT_FEEL.impacts.shift();if(killed){COMBAT_FEEL.deaths.push({x:e.x,y:e.y,r,col:e.col||col,life:.58,max:.58,seed:COMBAT_FEEL.serial});if(COMBAT_FEEL.deaths.length>30)COMBAT_FEEL.deaths.shift();}}
function tickCombatFeel(dt){
 for(const list of [COMBAT_FEEL.casts,COMBAT_FEEL.impacts,COMBAT_FEEL.deaths])for(let i=list.length-1;i>=0;i--){list[i].life-=dt;if(list[i].life<=0)list.splice(i,1);}
 COMBAT_FEEL.hurtT=Math.max(0,COMBAT_FEEL.hurtT-dt);const p=G.player;if(p){p.feelShotT=Math.max(0,(p.feelShotT||0)-dt);p.feelFlareT=Math.max(0,(p.feelFlareT||0)-dt);p.feelReadyT=Math.max(0,(p.feelReadyT||0)-dt);}for(const e of G.enemies||[])e.feelHitT=Math.max(0,(e.feelHitT||0)-dt);
}
const combatFeelSfx=sfx;
sfx=function(name,a){
 if(name==='feelBoltImpact'||name==='feelFlareImpact'||name==='feelBreak'||name==='feelReload'){
  if(!AC||!save.sfx)return;
  if(name==='feelBoltImpact'){air(.055,.018,2100,780,.85,0);thump(225,105,.07,.024);}
  else if(name==='feelFlareImpact'){air(.15,.033,3300,470,.9,0);thump(285,68,.14,.075);bell(523.25,.22,.015,0,false);}
  else if(name==='feelBreak'){air(.28,.04,1700,180,.72,0,'lowpass');thump(185,46,.25,.075);}
  else{bell(659.25,.26,.018,0,false);bell(987.77,.18,.011,.035,false);}
  return;
 }
 combatFeelSfx(name,a);if(!AC||!save.sfx)return;
 if(name==='shoot')bell(784,.12,.009,0,false);
 else if(name==='dash')thump(245,92,.08,.018);
};
const combatFeelFireVolley=fireVolley;
fireVolley=function(){
 const p=G.player;if(!p)return combatFeelFireVolley();const start=G.bullets.length,ammo=p.ammo;combatFeelFireVolley();const made=G.bullets.slice(start);if(!made.length||p.ammo===ammo)return;
 p.feelShotT=.15;const a=Math.atan2(made[0].vy,made[0].vx);combatFeelCast('bolt',p.x+Math.cos(a)*15,p.y+Math.sin(a)*15,a,Math.min(1.8,.8+made.length*.18));for(let i=0;i<made.length;i++){made[i].feelSeed=++COMBAT_FEEL.serial;made[i].feelBorn=G.tAll;made[i].feelLead=i===(made.length>>1);}G.cam.shake=Math.min(.45,G.cam.shake+.055);
};
const combatFeelStrikeMelee=strikeMelee;
strikeMelee=function(){const p=G.player;if(!p)return combatFeelStrikeMelee();const a=p.meleeAngle;combatFeelCast('flare',p.x,p.y,a,1+.14*(G.run?.up?.edge||0));p.feelFlareT=.32;combatFeelStrikeMelee();G.cam.shake=Math.min(.72,G.cam.shake+.16);};
const combatFeelDamageEnemy=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
 if(!e||e.dead)return combatFeelDamageEnemy(e,dmg,ang,crit,kb,kind);const before=e.hp,wasDead=e.dead;combatFeelDamageEnemy(e,dmg,ang,crit,kb,kind);const dealt=Math.max(0,before-e.hp);if(!dealt)return;
 const killed=!wasDead&&e.dead;e.feelHitT=kind==='melee'?.18:.12;e.feelHitMax=e.feelHitT;e.feelHitA=Number.isFinite(ang)?ang:0;e.feelHitPower=Math.min(1.7,.55+dealt/Math.max(1,e.max)*5+(crit?.3:0));combatFeelImpact(e,dealt,e.feelHitA,crit,kind,killed);G.cam.shake=Math.min(.9,G.cam.shake+(kind==='melee'?.11:crit?.07:.025)+(killed?.08:0));if(kind==='melee')sfx('feelFlareImpact');else if(crit)sfx('feelBoltImpact');if(killed)sfx('feelBreak');
};
const combatFeelHurtPlayer=hurtPlayer;
hurtPlayer=function(dmg,sx,sy){const p=G.player,before=p?.hp;combatFeelHurtPlayer(dmg,sx,sy);if(p&&p.hp<before){COMBAT_FEEL.hurtT=.48;COMBAT_FEEL.hurtA=Math.atan2(sy-p.y,sx-p.x);}};
const combatFeelBeginReload=beginReload;
beginReload=function(){const p=G.player,started=combatFeelBeginReload();if(started&&p){p.feelReloadSeen=true;combatFeelCast('reload',p.x,p.y-5,p.face||0,1);}return started;};
const combatFeelTickBase=combatTick;
combatTick=function(dt){const p=G.player,before=p?.reloadT||0,result=combatFeelTickBase(dt);if(p&&before>0&&p.reloadT===0){p.feelReadyT=.38;sfx('feelReload');combatFeelCast('ready',p.x,p.y-5,p.face||0,1);}return result;};
const combatFeelUpdateFx=updateFx;
updateFx=function(dt){combatFeelUpdateFx(dt);tickCombatFeel(dt);};
const combatFeelSetupFloor=setupFloor;
setupFloor=function(f){combatFeelReset();return combatFeelSetupFloor(f);};
const combatFeelDrawEnemies=drawEnemies;
drawEnemies=function(ctx){
 const shifted=[];for(const e of G.enemies||[]){if(!e.dead&&e.feelHitT>0){const q=e.feelHitT/Math.max(.001,e.feelHitMax||e.feelHitT),kick=Math.sin(q*Math.PI)*5*(e.feelHitPower||1),ox=Math.cos(e.feelHitA||0)*kick,oy=Math.sin(e.feelHitA||0)*kick;shifted.push([e,e.x,e.y]);e.x+=ox;e.y+=oy;}}
 combatFeelDrawEnemies(ctx);for(const [e,x,y]of shifted){e.x=x;e.y=y;const q=e.feelHitT/Math.max(.001,e.feelHitMax||e.feelHitT),r=(e.r||12)+5+(1-q)*7;ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=e.feelHitPower>1.1?'#fff2af':'#dff7ff';ctx.globalAlpha=q*.58;ctx.lineWidth=2;for(let i=0;i<4;i++){const a=(e.feelHitA||0)+Math.PI+i*Math.PI/2;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);ctx.lineTo(x+Math.cos(a)*(r+5),y+Math.sin(a)*(r+5));ctx.stroke();}ctx.restore();}
};
const combatFeelDrawBullets=drawBullets;
drawBullets=function(ctx){
 combatFeelDrawBullets(ctx);const t=save.motion?0:G.tAll;ctx.save();ctx.globalCompositeOperation='lighter';for(const b of G.bullets){if(b.melee)continue;const speed=Math.max(1,Math.hypot(b.vx,b.vy)),nx=b.vx/speed,ny=b.vy/speed,size=b.comet?2.1:b.whiteStar?1.55:1,age=Math.max(0,t-(b.feelBorn||t));ctx.strokeStyle=b.whiteStar?'#dcfbff':'#ffcc77';ctx.globalAlpha=b.whiteStar?.74:.48;ctx.lineWidth=1.2*size;ctx.beginPath();ctx.moveTo(b.x-nx*14*size,b.y-ny*14*size);ctx.lineTo(b.x+nx*4,b.y+ny*4);ctx.stroke();ctx.fillStyle='#ffffff';ctx.globalAlpha=.9;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(Math.atan2(b.vy,b.vx));ctx.fillRect(-2*size,-2*size,7*size,4*size);ctx.fillStyle=b.whiteStar?'#9eeaff':'#ff9b4d';ctx.fillRect(-8*size,-1*size,6*size,2*size);ctx.restore();if(b.feelLead||b.comet||b.whiteStar){const a=t*9+(b.feelSeed||0);ctx.fillStyle=b.whiteStar?'#bdf7ff':'#ffe19a';ctx.globalAlpha=.42;ctx.fillRect(b.x+Math.cos(a)*7*size-1,b.y+Math.sin(a)*7*size-1,2,2);ctx.fillRect(b.x-Math.cos(a)*7*size-1,b.y-Math.sin(a)*7*size-1,2,2);}if(age<.08){ctx.strokeStyle='#fff0bd';ctx.globalAlpha=(.08-age)*5;ctx.beginPath();ctx.arc(b.x,b.y,5+age*90,0,TAU);ctx.stroke();}}
 ctx.restore();
};
function drawCombatFeelWorld(ctx){
 ctx.save();ctx.globalCompositeOperation='lighter';
 for(const c of COMBAT_FEEL.casts){const q=1-c.life/c.max,fade=Math.sin(Math.PI*Math.min(1,q));ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.a);if(c.kind==='bolt'){ctx.strokeStyle='#ffd88c';ctx.globalAlpha=(1-q)*.72;ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,10+q*18+i*4,-.72+i*.18,.72-i*.18);ctx.stroke();}for(let i=-2;i<=2;i++){ctx.fillStyle=i%2?'#ffffff':'#ff9b4b';ctx.globalAlpha=(1-q)*(.35+Math.abs(i)*.08);ctx.fillRect(6+q*(13+Math.abs(i)*3),i*4-1,7-Math.abs(i),2);}}
  else if(c.kind==='flare'){const lead=-.98+Math.sqrt(q)*1.96,trail=Math.max(-.98,lead-1.34);ctx.strokeStyle='#ffb45f';ctx.globalAlpha=fade*.22;ctx.lineWidth=8;ctx.beginPath();ctx.arc(0,0,(42+q*42)*c.power,-.98,.98);ctx.stroke();for(let i=0;i<7;i++){const d=i/6,rr=(38+q*48)*c.power-i*2;ctx.strokeStyle=i<2?'#ffffff':i<5?'#ffe5a1':'#ff9d54';ctx.globalAlpha=fade*(.28+d*.68);ctx.lineWidth=1+d*4.5;ctx.beginPath();ctx.arc(0,0,rr,trail+d*.035,lead);ctx.stroke();}ctx.strokeStyle='#ffffff';ctx.globalAlpha=fade*.82;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(Math.cos(lead)*24,Math.sin(lead)*24);ctx.lineTo(Math.cos(lead)*(83*c.power),Math.sin(lead)*(83*c.power));ctx.stroke();ctx.fillStyle='#ffc066';for(let i=0;i<11;i++){const a=-.9+i*.18,rr=32+q*(48+i%3*8);ctx.globalAlpha=fade*(.28+i%3*.14);ctx.fillRect(Math.cos(a)*rr-2,Math.sin(a)*rr-1,5,3);}}
  else{const spin=save.motion?0:G.tAll;ctx.strokeStyle=c.kind==='ready'?'#d9fbff':'#f2ca78';ctx.globalAlpha=(1-q)*.65;ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,12+q*24+i*5,spin+i,Math.PI*1.35+spin+i);ctx.stroke();}}
  ctx.restore();
 }
 for(const h of COMBAT_FEEL.impacts){const q=1-h.life/h.max,fade=1-q;ctx.save();ctx.translate(h.x,h.y);ctx.rotate(h.a);ctx.strokeStyle=h.col;ctx.fillStyle=h.col;ctx.globalAlpha=fade*(h.crit?.95:.7);ctx.lineWidth=h.kind==='melee'?3:2;ctx.beginPath();ctx.moveTo(-5-q*4,0);ctx.lineTo(10+q*(h.kind==='melee'?30:17),0);ctx.stroke();for(let i=-2;i<=2;i++){const a=i*.48,rr=6+q*(14+Math.abs(i)*5);ctx.fillRect(Math.cos(a)*rr-1,Math.sin(a)*rr-1,3+(h.crit?2:0),2);}ctx.strokeStyle=h.crit?'#ffffff':h.col;ctx.globalAlpha=fade*.5;ctx.beginPath();ctx.arc(0,0,h.r*(.35+q*.85),0,TAU);ctx.stroke();ctx.restore();}
 for(const d of COMBAT_FEEL.deaths){const q=1-d.life/d.max,fade=1-q;ctx.save();ctx.translate(d.x,d.y);ctx.strokeStyle=d.col;ctx.globalAlpha=fade*.48;ctx.lineWidth=2;for(let i=0;i<2;i++){ctx.beginPath();ctx.arc(0,0,d.r*(.8+q*(1.8+i*.8)),q*2+i,TAU-q*1.2+i);ctx.stroke();}for(let i=0;i<8;i++){const a=i*TAU/8+d.seed,rr=d.r*(.6+q*2.5);ctx.fillStyle=i%2?'#ffffff':d.col;ctx.globalAlpha=fade*(.24+i%3*.08);ctx.fillRect(Math.cos(a)*rr-2,Math.sin(a)*rr-2,4,4);}ctx.restore();}
 ctx.restore();
}
const combatFeelDrawCombatFX=drawCombatFX;
drawCombatFX=function(ctx){combatFeelDrawCombatFX(ctx);drawCombatFeelWorld(ctx);};
function drawCombatFeelScreen(ctx){
 if(!G.world||G.state==='menu')return;const p=G.player;ctx.save();ctx.setTransform(G.dpr,0,0,G.dpr,0,0);if(COMBAT_FEEL.hurtT>0){const q=COMBAT_FEEL.hurtT/.48,grad=ctx.createRadialGradient(G.w/2,G.h/2,Math.min(G.w,G.h)*.18,G.w/2,G.h/2,Math.max(G.w,G.h)*.7);grad.addColorStop(0,'rgba(0,0,0,0)');grad.addColorStop(1,'rgba(210,38,48,'+(q*.28)+')');ctx.fillStyle=grad;ctx.fillRect(0,0,G.w,G.h);ctx.translate(G.w/2,G.h/2);ctx.rotate(COMBAT_FEEL.hurtA);ctx.fillStyle='rgba(255,122,106,'+(q*.65)+')';ctx.beginPath();ctx.moveTo(Math.min(G.w,G.h)*.28,-9);ctx.lineTo(Math.min(G.w,G.h)*.34,0);ctx.lineTo(Math.min(G.w,G.h)*.28,9);ctx.closePath();ctx.fill();}
 if(p&&p.hp<p.maxHp*.28&&G.state==='playing'){const pulse=save.motion?.12:.08+.055*(.5+.5*Math.sin(G.tAll*4));ctx.strokeStyle='rgba(255,79,84,'+pulse+')';ctx.lineWidth=8;ctx.strokeRect(4,4,G.w-8,G.h-8);}ctx.restore();
}
const combatFeelRender=render;
render=function(){combatFeelRender();drawCombatFeelScreen(G.ctx);};
const combatFeelSyncWeaponHUD=syncWeaponHUD;
syncWeaponHUD=function(){combatFeelSyncWeaponHUD();const hud=T('weaponHUD'),p=G.player;if(!hud||!p)return;hud.classList.toggle('feel-shot',p.feelShotT>0);hud.classList.toggle('feel-flare',p.feelFlareT>0);hud.classList.toggle('feel-ready',p.feelReadyT>0);};
const combatFeelStyle=document.createElement('style');combatFeelStyle.textContent=`
#weaponHUD.feel-shot{box-shadow:inset 0 0 0 4px #ffc46630,0 0 24px #ffad4930}#weaponHUD.feel-shot #ammoCount{color:#fff1bd;text-shadow:0 0 8px #ffbb55}
#weaponHUD.feel-flare{border-color:#f6d58dcc;box-shadow:inset 0 0 0 4px #ffd47a32,0 0 28px #ff9c4938}#weaponHUD.feel-flare #bladeReady{color:#fff1bd}
#weaponHUD.feel-ready{border-color:#bcecf1aa;box-shadow:inset 0 0 0 4px #bcecf122,0 0 23px #8ee6ef2f}#weaponHUD.feel-ready #weaponStatus{color:#dffcff}
`;if(document.head)document.head.appendChild(combatFeelStyle);
