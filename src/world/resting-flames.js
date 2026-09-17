function floorFixtures(){return G.world?.region==='late'?G.world.lateFixtures:G.world?.fixtures;}
function ensureRestingFlame(){if(!G.world||!G.player)return;const list=floorFixtures();if(!list)return;let b=list.find(o=>o.kind==='brazier'),s=G.world.rooms[0],pos=safePosition(G.world,s.cx*TILE+18+58,s.cy*TILE+18,18)||{x:G.player.x+50,y:G.player.y};if(!b){b={kind:'brazier',x:pos.x,y:pos.y,lit:false,resting:true};list.push(b);}else if(!b.lit){b.x=pos.x;b.y=pos.y;b.resting=true;}G.world.restingFlame=b;}
const longSetup=setupFloor;
setupFloor=function(f){longSetup(f);if(G.run){G.run.floorAge=0;ensureRestingFlame();}};
const longResumeCards=resumeRun;
resumeRun=function(){longResumeCards();if(G.run)ensureRestingFlame();};
function nearestRestingFlame(){const list=floorFixtures()||[];let best=null,dist=74**2;for(const o of list)if(o.kind==='brazier'){const dd=d2(o.x,o.y,G.player.x,G.player.y);if(dd<dist){dist=dd;best=o;}}return best;}
function useRestingFlame(o){if(o.lit){fieldNote('The Resting Flame has gone quiet.',2);return;}o.lit=true;const heal=Math.ceil(G.player.maxHp*(bossFloorAt(G.floor)?.28:.22));cardHeal(heal,'RESTING FLAME · '+heal+' HEALTH');G.world.torches.push({x:o.x,y:o.y-15,s:0});burst(o.x,o.y,24,'#ffd083',145,1,3,true);sfx('brazier');saveNow();}
const longBeforeUpdate=hollowBeforeUpdate;
hollowBeforeUpdate=function(dt){if(G.run)G.run.floorAge=(G.run.floorAge||0)+dt;if(interactQueued){const b=nearestRestingFlame();if(b){interactQueued=false;useRestingFlame(b);return true;}}return longBeforeUpdate(dt);};
const longHUD=updateHUD;
updateHUD=function(dt){longHUD(dt);if(!G.player||G.state!=='playing')return;const b=nearestRestingFlame();if(b){T('promptTxt').textContent=b.lit?'RESTING FLAME SPENT':'REST · RESTORE '+(bossFloorAt(G.floor)?28:22)+'% HEALTH';T('prompt').classList.add('on');}};
function drawRestingFlame(ctx,o){const t=save.motion?0:G.tAll,lit=o.lit;ctx.save();ctx.translate(Math.round(o.x),Math.round(o.y));ctx.fillStyle='#16151a';ctx.fillRect(-17,8,34,7);ctx.fillStyle='#554535';ctx.fillRect(-13,2,26,8);ctx.fillStyle='#9b7b54';ctx.fillRect(-10,0,20,3);ctx.strokeStyle='#c7a36f';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-13,1);ctx.lineTo(-18,-10);ctx.moveTo(13,1);ctx.lineTo(18,-10);ctx.stroke();for(let i=0;i<5;i++){const a=t*(i%2?1.1:-.8)+i*TAU/5,r=lit?18:11;ctx.fillStyle=lit?(i%2?'#ffd98d':'#ff8c4d'):'#51483f';ctx.fillRect(Math.cos(a)*r-2,-13+Math.sin(a)*r*.45-2,4,4);}if(lit){glowImg('ember',0,-12,58,.42);ctx.fillStyle='#fff0bb';ctx.fillRect(-3,-22+Math.sin(t*6)*2,6,16);ctx.fillStyle='#ff9b4d';ctx.fillRect(-7,-15,14,13);}ctx.restore();}
const longDrawLate=drawLateWorld;
drawLateWorld=function(ctx){longDrawLate(ctx);if(G.world?.region==='late')for(const o of G.world.lateFixtures||[])if(o.kind==='brazier')drawRestingFlame(ctx,o);};
const longValidateCheckpoint=validateCheckpoint;
validateCheckpoint=function(r){const out=longValidateCheckpoint(r);const list=r.world?.region==='late'?r.world.lateFixtures:r.world?.fixtures||[];for(const o of list)if(o.kind==='brazier'&&typeof o.lit!=='boolean')throw Error('Invalid Resting Flame');return out;};
