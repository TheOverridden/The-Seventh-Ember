'use strict';
/* The closing combat pass joins the existing hit, death, room, boss, and music
   systems. It changes presentation only: damage and attack timing stay intact. */
const COMBAT_FINALE={finishers:[],waves:[],phaseByUid:new Map(),clearedRooms:new Set(),intensity:0,target:0,calloutT:0,serial:0};
const COMBAT_PHASE_TITLES={
 warden:'THE SHIELD BREAKS',matriarch:'THE ROOTS WAKE',bellkeeper:'THE SECOND CHOIR RISES',colossus:'THE FURNACE OPENS',astronomer:'THE LENSES TURN',scribe:'THE OLD INK RUNS',regents:'ONE THRONE REMAINS',seraph:'THE WINGS TURN',tyrant:'THE CITADEL MOVES',keeper:'THE STAR OPENS',uncounted:'THE COUNT BREAKS'
};
function combatFinaleReduced(){return !!save.motion;}
function combatFinaleRoomIndex(x,y){return G.world?.rooms?.findIndex(r=>x>=r.x*TILE&&x<(r.x+r.w)*TILE&&y>=r.y*TILE&&y<(r.y+r.h)*TILE)??-1;}
function combatFinaleStyle(e){
 if(e.warden||e.ai==='gate')return'fracture';
 if(e.matriarch||e.ai==='garden')return'bloom';
 if(e.bossKey==='bellkeeper'||e.type?.toLowerCase().includes('drown'))return'ripple';
 if(e.bossKey==='colossus'||e.type?.toLowerCase().includes('ember'))return'cinder';
 if(e.bossKey==='astronomer'||e.bossKey==='seraph'||e.bossKey==='keeper')return'star';
 if(e.bossKey==='scribe')return'ink';
 return e.isBoss?'crown':'shard';
}
function combatFinaleAccent(e){
 if(e.ai==='garden'||e.matriarch)return'#d7e99b';
 if(e.bossKey==='bellkeeper')return'#a8eff4';
 if(e.bossKey==='colossus')return'#ffd18a';
 if(e.bossKey==='scribe')return'#eadbbb';
 return e.col||'#c8e8ef';
}
function combatFinaleDeath(e){
 const boss=!!e.isBoss,max=boss?1.05:e.elite?.72:.52;
 COMBAT_FINALE.finishers.push({x:e.x,y:e.y,r:Math.max(9,e.r||10),col:e.col||'#b6dbe4',accent:combatFinaleAccent(e),style:combatFinaleStyle(e),boss,life:max,max,seed:++COMBAT_FINALE.serial});
 if(COMBAT_FINALE.finishers.length>42)COMBAT_FINALE.finishers.shift();
 COMBAT_FINALE.intensity=Math.min(1,COMBAT_FINALE.intensity+(boss?.4:e.elite?.18:.08));
}
function combatFinaleRoomWave(room,strong=false){
 if(!room)return;const max=strong?.92:.62;
 COMBAT_FINALE.waves.push({x:room.cx*TILE+18,y:room.cy*TILE+18,r:Math.hypot(room.w*TILE,room.h*TILE)*.42,life:max,max,strong});
 if(COMBAT_FINALE.waves.length>12)COMBAT_FINALE.waves.shift();
 sfx(strong?'combatRoomBreak':'combatRoomClear');
}
function combatFinaleCheckRoom(e){
 if(e.isBoss||e.growth||e.mechanism||e.specialEncounterId)return;
 const ri=combatFinaleRoomIndex(e.x,e.y),room=G.world?.rooms?.[ri];
 if(ri<1||!room||COMBAT_FINALE.clearedRooms.has(ri)||combatFinaleRoomIndex(G.player.x,G.player.y)!==ri)return;
 const alive=G.enemies.some(o=>o!==e&&!o.dead&&!o.isBoss&&!o.growth&&!o.mechanism&&combatFinaleRoomIndex(o.x,o.y)===ri);
 if(!alive){COMBAT_FINALE.clearedRooms.add(ri);combatFinaleRoomWave(room,false);}
}
const combatFinaleKillEnemy=killEnemy;
killEnemy=function(e){
 if(!e||e.dead)return combatFinaleKillEnemy(e);
 const result=combatFinaleKillEnemy(e);
 if(e.dead){combatFinaleDeath(e);combatFinaleCheckRoom(e);}
 return result;
};
const combatFinaleCompleteRoom=completeSpecialEncounter;
completeSpecialEncounter=function(sc,success=true){
 const fresh=sc&&!sc.complete,result=combatFinaleCompleteRoom(sc,success);
 if(fresh&&sc.complete){const room=specialEncounterRoom(sc);if(room){COMBAT_FINALE.clearedRooms.add(sc.roomIndex);combatFinaleRoomWave(room,true);}}
 return result;
};
function combatFinalePhase(e){
 if(e.warden)return e.wb?.second?2:1;
 if(e.matriarch)return e.ms?.second?2:1;
 if(e.bossKey==='uncounted')return 1+(e.bs?.secretPhase||0);
 if(e.bs?.mid&&Number.isFinite(e.bs.mid.phase))return 1+e.bs.mid.phase;
 if(e.bs)return e.bs.second?2:1;
 return e.hp<=e.max*.5?2:1;
}
const phaseCallout=document.createElement('div');phaseCallout.id='combatPhaseCallout';phaseCallout.setAttribute('role','status');phaseCallout.innerHTML='<span id="combatPhaseLabel">PHASE II</span><strong id="combatPhaseTitle"></strong>';document.body.append(phaseCallout);
function combatFinalePhaseTitle(e){return COMBAT_PHASE_TITLES[e.warden?'warden':e.matriarch?'matriarch':e.bossKey]||'THE GUARDIAN CHANGES';}
function combatFinalePhaseShift(e,phase){
 T('combatPhaseLabel').textContent='PHASE '+['I','II','III','IV'][Math.min(3,phase-1)];T('combatPhaseTitle').textContent=combatFinalePhaseTitle(e);phaseCallout.classList.remove('visible');void phaseCallout.offsetWidth;phaseCallout.classList.add('visible');COMBAT_FINALE.calloutT=1.8;
 if(typeof combatPolishFreeze==='function')combatPolishFreeze(.052);if(typeof combatPolishFlash==='function')combatPolishFlash(.11,e.col||'#fff0bd');sfx('combatPhaseShift');
 COMBAT_FINALE.finishers.push({x:e.x,y:e.y,r:(e.r||30)*1.15,col:e.col||'#d9c4ff',accent:'#fff0c2',style:'phase',boss:true,life:1,max:1,seed:++COMBAT_FINALE.serial});
}
function combatFinaleScanPhases(){
 const live=new Set();for(const e of G.enemies||[]){if(!e.isBoss||e.dead||!e.introduced)continue;live.add(e.uid);const phase=combatFinalePhase(e),before=COMBAT_FINALE.phaseByUid.get(e.uid);if(before===undefined)COMBAT_FINALE.phaseByUid.set(e.uid,phase);else if(phase>before){COMBAT_FINALE.phaseByUid.set(e.uid,phase);combatFinalePhaseShift(e,phase);}}
 for(const uid of COMBAT_FINALE.phaseByUid.keys())if(!live.has(uid))COMBAT_FINALE.phaseByUid.delete(uid);
}
function combatFinaleThreat(){
 if(!G.player||G.state!=='playing')return 0;const p=G.player;
 if(G.bossActive)return 1;
 const near=G.enemies.filter(e=>!e.dead&&e.aggro&&d2(e.x,e.y,p.x,p.y)<520**2).length,shots=G.ebul.filter(b=>d2(b.x,b.y,p.x,p.y)<430**2).length,wounded=p.hp<p.maxHp*.35?.12:0;
 return clamp(near/6+shots/18+wounded,0,1);
}
function combatFinaleTick(dt){
 for(const list of [COMBAT_FINALE.finishers,COMBAT_FINALE.waves])for(let i=list.length-1;i>=0;i--){list[i].life-=dt;if(list[i].life<=0)list.splice(i,1);}
 COMBAT_FINALE.target=combatFinaleThreat();COMBAT_FINALE.intensity=lerp(COMBAT_FINALE.intensity,COMBAT_FINALE.target,1-Math.exp(-dt*(COMBAT_FINALE.target>COMBAT_FINALE.intensity?3.6:1.5)));
 if(COMBAT_FINALE.calloutT>0){COMBAT_FINALE.calloutT-=dt;if(COMBAT_FINALE.calloutT<=0)phaseCallout.classList.remove('visible');}
 combatFinaleScanPhases();
}
globalThis.VoidFallCombatMix={version:1,intensity:0};
const combatFinaleUpdate=update;
update=function(dt){const result=combatFinaleUpdate(dt);combatFinaleTick(Math.min(dt,.05));globalThis.VoidFallCombatMix.intensity=COMBAT_FINALE.intensity;return result;};
const combatFinaleSetup=setupFloor;
setupFloor=function(f){COMBAT_FINALE.finishers.length=0;COMBAT_FINALE.waves.length=0;COMBAT_FINALE.phaseByUid.clear();COMBAT_FINALE.clearedRooms.clear();COMBAT_FINALE.intensity=COMBAT_FINALE.target=0;phaseCallout.classList.remove('visible');return combatFinaleSetup(f);};
if(typeof combatFeelColor==='function'){
 const combatFinaleBaseColor=combatFeelColor;
 combatFeelColor=function(kind,crit){if(crit)return'#fff3ae';const k=String(kind||'');if(k.includes('storm')||k.includes('arc'))return'#9eeaff';if(k.includes('burn')||k.includes('phoenix')||k.includes('roomFlame'))return'#ff935b';if(k.includes('orbital'))return'#d7b6ff';if(k==='melee')return'#ffd27a';return combatFinaleBaseColor(kind,crit);};
}
const combatFinaleSfx=sfx;
sfx=function(name,a){
 if(!['combatRoomClear','combatRoomBreak','combatPhaseShift'].includes(name))return combatFinaleSfx(name,a);
 if(!AC||!save.sfx)return;
 if(name==='combatPhaseShift'){thump(76,34,.62,.085);air(.7,.052,260,1250,.68,0,'bandpass');swell([55,82.41,110,164.81],1.25,.035,0);}
 else if(name==='combatRoomBreak'){thump(138,54,.3,.045);air(.42,.03,920,210,.62,0,'lowpass');warmFxTone(293.66,.48,.013,.04,760);}
 else{air(.24,.018,720,190,.48,0,'lowpass');warmFxTone(220,.26,.008,0,620);}
};
function combatFinaleDraw(ctx){
 ctx.save();ctx.globalCompositeOperation='lighter';const t=combatFinaleReduced()?0:G.tAll;
 for(const w of COMBAT_FINALE.waves){const q=1-w.life/w.max,fade=1-q;ctx.save();ctx.translate(w.x,w.y);ctx.strokeStyle=w.strong?'#f0d28d':'#aecbd0';ctx.globalAlpha=fade*(w.strong?.36:.2);ctx.lineWidth=w.strong?3:1.5;ctx.beginPath();ctx.ellipse(0,0,w.r*q,w.r*q*.68,0,0,TAU);ctx.stroke();ctx.setLineDash([5,11]);ctx.lineDashOffset=-q*34;ctx.beginPath();ctx.ellipse(0,0,w.r*(.28+q*.82),w.r*(.18+q*.55),0,0,TAU);ctx.stroke();ctx.restore();}
 for(const f of COMBAT_FINALE.finishers){const q=1-f.life/f.max,fade=1-q,rr=f.r*(.7+q*(f.boss?3.2:2.1));ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.seed*.7+(combatFinaleReduced()?0:q*.7));ctx.strokeStyle=f.accent;ctx.fillStyle=f.col;ctx.globalAlpha=fade*(f.boss?.62:.48);ctx.lineWidth=f.boss?2.5:1.5;
  if(f.style==='bloom'){for(let i=0;i<6;i++){ctx.rotate(TAU/6);ctx.beginPath();ctx.ellipse(rr*.58,0,rr*.42,rr*.16,0,0,TAU);ctx.stroke();}}
  else if(f.style==='ripple'){for(let i=0;i<3;i++){ctx.globalAlpha=fade*(.4-i*.09);ctx.beginPath();ctx.ellipse(0,0,rr*(.45+i*.25),rr*(.18+i*.1),0,0,TAU);ctx.stroke();}}
  else if(f.style==='ink'){for(let i=0;i<7;i++){const a=i*2.4+f.seed,r=rr*(.35+i%3*.22);ctx.fillRect(Math.cos(a)*r-2,Math.sin(a)*r+q*18-2,4,4);}}
  else if(f.style==='cinder'){for(let i=0;i<8;i++){const a=i*TAU/8+t*.25,r=rr*(.35+i%2*.3);ctx.globalAlpha=fade*(.25+i%3*.1);ctx.fillRect(Math.cos(a)*r-2,Math.sin(a)*r-q*22-3,4,7);}}
  else if(f.style==='star'||f.style==='phase'){const points=f.style==='phase'?12:8;ctx.beginPath();for(let i=0;i<points*2;i++){const a=i*Math.PI/points,r=i%2?rr*.42:rr;i?ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r):ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(0,0,rr*.3,0,TAU);ctx.stroke();}
  else{const points=f.boss?10:6;for(let i=0;i<points;i++){const a=i*TAU/points,r1=rr*.18,r2=rr*(.55+i%2*.25);ctx.beginPath();ctx.moveTo(Math.cos(a)*r1,Math.sin(a)*r1);ctx.lineTo(Math.cos(a+.08)*r2,Math.sin(a+.08)*r2);ctx.stroke();}}
  ctx.restore();}
 ctx.restore();
}
const combatFinaleDrawFx=drawCombatFX;
drawCombatFX=function(ctx){combatFinaleDrawFx(ctx);combatFinaleDraw(ctx);};
globalThis.VoidFallCombatFinale={version:1,state:COMBAT_FINALE,phase:combatFinalePhase,threat:combatFinaleThreat};
document.documentElement.dataset.combatFinale='v1';
