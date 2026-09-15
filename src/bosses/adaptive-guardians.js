/* ========================================================================
   THE LISTENING GUARDIANS
   Guardians read temporary blessings, while permanent Skill Tree progress
   remains the player's lasting advantage. Burst limits preserve the fights'
   authored phases instead of allowing one lucky build to erase them.
   ======================================================================== */
'use strict';

const ADAPTIVE_GUARDIAN_VERSION=2;
const ADAPTIVE_REQUIREMENT=[0,.02,.06,.10,.16,.23,.30,.37,.44,.52];
const ADAPTIVE_BUDGET=[.18,.135,.105,.08,.052,.044,.036,.03,.024,.019];
const ADAPTIVE_HIT_CAP=[.10,.08,.065,.055,.042,.036,.03,.026,.021,.017];
const ADAPTIVE_NAMES={
 warden:'THE STAR WARDEN',matriarch:'THE HOLLOW MATRIARCH',bellkeeper:'THE BELLKEEPER',
 colossus:'THE EMBER COLOSSUS',astronomer:'THE GLASS ASTRONOMER',scribe:'THE PALE SCRIBE',
 regents:'THE TWIN REGENTS',seraph:'THE VOID SERAPH',tyrant:'THE OBSIDIAN TYRANT',keeper:'THE FIRST KEEPER',
 uncounted:'THE UNCOUNTED'
};

function adaptiveClamp(v,a,b){return Math.max(a,Math.min(b,v));}
function adaptiveTier(b,floor=G.floor){
 if(b?.bossKey==='uncounted'||b?.bossKey==='unrecorded')return 11;
 return adaptiveClamp(Math.ceil(Math.min(50,Math.max(5,floor))/5),1,10);
}
function adaptiveMastery(nodes=save.nodes||{}){
 const owned=TREE_NODES.filter(n=>nodes[n.id]),nodeRatio=owned.length/Math.max(1,TREE_NODES.length);
 const paidRatio=owned.reduce((sum,n)=>sum+(Number(n.cost)||0),0)/Math.max(1,MASTERY_TOTAL||1);
 let branchDepth=0;
 for(const branch of MASTERY_BRANCHES){let depth=0;for(let i=0;i<branch.ids.length;i++)if(nodes[branch.ids[i]])depth=Math.max(depth,i+1);branchDepth+=depth/branch.ids.length;}
 branchDepth/=Math.max(1,MASTERY_BRANCHES.length);
 return adaptiveClamp(nodeRatio*.55+branchDepth*.30+Math.sqrt(adaptiveClamp(paidRatio,0,1))*.15,0,1);
}
function adaptiveBuild(up={}){
 const r=id=>Math.max(0,Number(up[id])||0);
 const scores={
  barrage:r('rate')*1.25+r('proj')*2.2+r('doubleCast')*2+r('sevenfold')*4+r('twinFlame')*4+r('magazine')*.35+r('quickload')*.55,
  burst:r('dmg')*1.1+r('crit')*.7+r('glass')*2.4+r('supernova')*4+r('whiteStar')*3+r('eliteBane')*2+r('fullHeart')*1.4+r('radiantDebt')*5+r('comet')*1.8,
  flare:r('edge')*1.8+r('aftershock')*1.8+r('echoFlare')*2+r('bladeEcho')*2+r('gravityFlare')+r('flarePractice')*.55,
  fortress:r('hp')*.32+r('regen')*.8+r('ironAsh')*1.2+r('bossWard')*1.6+r('guard')*1.2+r('mirrorSoul')*3+r('dawnward')*4+r('runRevive')*3+r('overheal')*1.2,
  motion:r('speed')*.75+r('dash')*.75+r('quickStep')*.8+r('dashReset')*1.5+r('riftBlink')*2+r('phoenixRush')*2
 };
 const totalRanks=Object.values(up).reduce((sum,v)=>sum+(Number.isFinite(Number(v))?Math.max(0,Number(v)):0),0);
 const mythics=['supernova','blackHole','sevenfold','mirrorSoul','starfall','radiantDebt','dawnward','worldfire','voidOrbit','endless'].reduce((n,id)=>n+(r(id)>0),0);
 const offense=(1+.18*r('dmg'))*(1+.15*r('rate'))*(1+.26*r('glass'))*(1+.31*r('proj'))*(1+.055*r('crit'))
  *(1+.12*r('edge'))*(1+.12*r('eliteBane'))*(1+.075*r('closeQuarters'))*(1+.08*r('kindleMark'))
  *(1+.10*r('doubleCast'))*(1+.16*r('whiteStar'))*(1+.20*r('sevenfold'))*(1+.22*r('twinFlame'))
  *(1+.30*r('radiantDebt'))*(1+.13*r('supernova'));
 const defense=(1+.10*r('hp'))*(1+.055*r('regen'))*(1+.055*r('ironAsh'))*(1+.07*r('bossWard'))
  *(1+.055*r('guard'))*(1+.09*r('overheal'))*(1+.12*r('mirrorSoul'))*(1+.14*r('dawnward'))*(1+.10*r('runRevive'));
 const collection=1+Math.min(1.35,totalRanks*.026+mythics*.11);
 const power=adaptiveClamp(Math.max(offense,collection),1,14);
 const strongest=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0],label=!strongest||strongest[1]<.6?'balanced':strongest[0];
 return{power,offense:adaptiveClamp(offense,1,14),defense:adaptiveClamp(defense,1,5),totalRanks,mythics,label,scores};
}
function adaptiveModel(tier,mastery,build,mode='campaign'){
 const i=adaptiveClamp(tier,1,10)-1,need=ADAPTIVE_REQUIREMENT[i],deficit=Math.max(0,need-mastery),lateWeight=i/9;
 const modeWeight=mode==='practice'?.55:mode==='rush'?.68:1;
 const tempHp=1+(Math.pow(build.power,.46)-1)*modeWeight;
 // Permanent progress remains the answer. A huge temporary build makes the
 // guardian sturdier, while missing late Skill Tree targets also sharpens it.
 const hp=adaptiveClamp(tempHp*(1+deficit*(2.1+lateWeight*4.4)*modeWeight),1,mode==='campaign'?7.2:3.8);
 const damage=adaptiveClamp(1+((build.defense-1)*.17+deficit*(.82+lateWeight*.78))*modeWeight,1,2.35);
 const tempo=adaptiveClamp(1+(Math.min(.24,(build.power-1)*.026)+deficit*(.32+lateWeight*.30))*modeWeight,1,1.5);
 return{need,deficit,hp,damage,tempo,budget:ADAPTIVE_BUDGET[i],hitCap:ADAPTIVE_HIT_CAP[i]};
}
function adaptiveBossKey(b){return b?.bossKey||(b?.warden?'warden':b?.matriarch?'matriarch':'guardian');}
function adaptiveMode(){return G.run?.mode==='practice'?'practice':G.run?.mode==='rush'?'rush':'campaign';}
function adaptiveGroupKey(b){return adaptiveMode()+':'+G.floor+':'+adaptiveBossKey(b);}
function adaptiveCurrentGroup(b){const key=adaptiveBossKey(b);return G.enemies.filter(e=>!e.dead&&e.isBoss&&adaptiveBossKey(e)===key);}

function applyAdaptiveGuardian(b,profile,mastery){
 if(!b||b.dead||G.run?.infinite||b.adapt?.version===ADAPTIVE_GUARDIAN_VERSION)return;
 const tier=adaptiveTier(b),model=adaptiveModel(Math.min(10,tier),mastery,profile,adaptiveMode()),ratio=adaptiveClamp(b.hp/Math.max(1,b.max),0,1);
 b.max=Math.max(1,Math.round(b.max*model.hp));b.hp=Math.max(1,Math.round(b.max*ratio));b.dmg=Math.max(1,Math.round(b.dmg*model.damage));b.spd*=1+Math.min(.12,(model.tempo-1)*.46);
 b.endlessDamageCeiling=Math.min(b.endlessDamageCeiling||1,model.hitCap);
 b.adapt={version:ADAPTIVE_GUARDIAN_VERSION,tier,key:adaptiveBossKey(b),read:profile.label,mastery,need:model.need,deficit:model.deficit,power:profile.power,tempo:model.tempo,budget:model.budget,hitCap:model.hitCap,counterT:adaptiveCounterInterval(tier,profile.power)*.68,counterStep:0,shieldUntil:0,gate:0};
}
function applyAdaptiveGroup(b,announce=true){
 if(!b||G.run?.infinite)return;
 const group=adaptiveCurrentGroup(b),profile=adaptiveBuild(G.run?.up||{}),mastery=adaptiveMastery();
 for(const e of group)applyAdaptiveGuardian(e,profile,mastery);
 const adapted=group.filter(e=>e.adapt?.version===ADAPTIVE_GUARDIAN_VERSION);if(!adapted.length)return;
 G.run.adaptiveBudgets=G.run.adaptiveBudgets&&typeof G.run.adaptiveBudgets==='object'?G.run.adaptiveBudgets:{};
 const key=adaptiveGroupKey(b),max=adapted.reduce((sum,e)=>sum+e.max,0),budget=adapted[0].adapt.budget;
 G.run.adaptiveBudgets[key]={start:G.run.t,spent:0,max,rate:budget};
 if(announce&&!G.run.adaptiveAnnouncements?.[key]){
  G.run.adaptiveAnnouncements=G.run.adaptiveAnnouncements||{};G.run.adaptiveAnnouncements[key]=true;
  const joke={barrage:'It counted every extra ember.',burst:'Yes, it saw the mythics.',flare:'It moved the furniture back.',fortress:'It noticed all that health.',motion:'Circling has been accounted for.',balanced:'It checked your pockets.'}[profile.label];
  toast('THE GUARDIAN READ YOUR BUILD',joke);fieldNote(profile.label.toUpperCase()+' BUILD · THE ROOM ANSWERS',2.5);
 }
}

function adaptiveCounterInterval(tier,power){return adaptiveClamp(15-tier*.58-(power-1)*.16,6.4,13.5);}
function adaptiveHazard(b,type,x,y,a,opts){const h=encounterHazard(b,type,x,y,a,opts);h.adaptive=true;return h;}
function adaptiveLanes(b,vertical,gap,delay=1.02){
 const a=arenaBounds(),span=vertical?a.right-a.left:a.bottom-a.top,step=span/5;
 for(let i=0;i<5;i++){if(i===gap)continue;adaptiveHazard(b,'glyph',vertical?a.left+step*(i+.5):a.left,vertical?a.top:a.top+step*(i+.5),vertical?Math.PI/2:0,{delay,life:1.45,len:vertical?a.bottom-a.top:a.right-a.left,width:Math.min(17,step*.2),damageMul:.62});}
}
function adaptiveCounter(b){
 if(!b?.lateBoss||!G.world?.lateHazards||!G.player)return;
 const s=b.bs||{},a=arenaBounds(),p=G.player,step=b.adapt.counterStep++,angle=Math.atan2(p.y-b.y,p.x-b.x),key=b.adapt.key;
 if(key==='bellkeeper')adaptiveHazard(b,'annulus',p.x,p.y,0,{delay:.78,life:1.25,radius:18,expand:175,width:11,damageMul:.55});
 else if(key==='colossus'){adaptiveLanes(b,step%2===0,(step+2)%5,1.06);adaptiveHazard(b,'shell',p.x+(p.vigilVX||0)*.38,p.y+(p.vigilVY||0)*.38,0,{delay:.82,life:.36,radius:35,damageMul:.62});}
 else if(key==='astronomer')adaptiveHazard(b,'rotor',b.x,b.y,angle-.55,{delay:.86,life:3.8,len:Math.hypot(a.right-a.left,a.bottom-a.top),turn:step%2?.78:-.78,arms:2,width:7,damageMul:.62,followOwner:true});
 else if(key==='scribe'){adaptiveLanes(b,step%2===0,(step*2+1)%5,.96);adaptiveHazard(b,'sweep',b.x,b.y,angle+(step%2?1:-1),{delay:.72,life:1.15,len:Math.hypot(a.right-a.left,a.bottom-a.top),turn:step%2?-1.05:1.05,width:7,damageMul:.58});}
 else if(key==='regents'){adaptiveHazard(b,'annulus',a.cx,a.cy,0,{delay:.72,life:1.35,radius:24,expand:190,width:12,damageMul:.6});bossRingLate(b,14,245,angle+.5);}
 else if(key==='seraph')adaptiveHazard(b,'rotor',b.x,b.y,angle-.4,{delay:.74,life:4.6,len:Math.hypot(a.right-a.left,a.bottom-a.top),turn:step%2?.96:-.96,arms:2,width:8,damageMul:.66,followOwner:true});
 else if(key==='tyrant'){
  for(let i=0;i<4;i++){const lead=.22+i*.18,x=adaptiveClamp(p.x+(p.vigilVX||0)*lead,a.left+30,a.right-30),y=adaptiveClamp(p.y+(p.vigilVY||0)*lead,a.top+30,a.bottom-30);adaptiveHazard(b,'shell',x,y,0,{delay:.62+i*.28,life:.38,radius:38,damageMul:.64});}
  if(step%2)adaptiveLanes(b,false,(step+1)%5,1.08);
 }else if(key==='keeper'){
  if(step%2===0)adaptiveHazard(b,'rotor',b.x,b.y,angle-.35,{delay:.7,life:5.4,len:Math.hypot(a.right-a.left,a.bottom-a.top),turn:step%4?.74:-.74,arms:3,width:8,damageMul:.68,followOwner:true});
  else{adaptiveLanes(b,step%4===1,(step+2)%5,.94);adaptiveHazard(b,'annulus',p.x,p.y,0,{delay:.76,life:1.25,radius:18,expand:185,width:11,damageMul:.62});}
 }else if(key==='uncounted'){
  adaptiveHazard(b,'rotor',b.x,b.y,angle-.3,{delay:.66,life:4.8,len:Math.hypot(a.right-a.left,a.bottom-a.top),turn:step%2?1.08:-1.08,arms:3,width:8,damageMul:.66,followOwner:true});
  adaptiveHazard(b,'annulus',p.x,p.y,0,{delay:.74,life:1.25,radius:20,expand:190,width:11,damageMul:.6});
 }
 s.adaptiveFlash=.45;burst(b.x,b.y,12,b.col,115,.34,2,true);sfx('eshoot');
}
function tickAdaptiveGuardian(b,dt){
 const a=b?.adapt;if(!a||G.run?.infinite||b!==G.boss||!b.introduced||G.state!=='playing')return;
 if(a.tier<3||!b.lateBoss)return;
 a.counterT-=dt;a.shieldUntil=Math.max(0,a.shieldUntil||0);
 const busy=b.bs?.mode==='shift'||G.world?.lateHazards?.some(h=>h.adaptive&&h.ownerUid===b.uid);
 if(a.counterT<=0&&!busy){adaptiveCounter(b);a.counterT=adaptiveCounterInterval(a.tier,a.power);}
}

function adaptivePhaseThresholds(e){
 if(e.bossKey==='regents')return[];
 if(e.bossKey==='keeper')return[.68,.30];
 if(e.bossKey==='uncounted')return[.66,.33];
 return[.5];
}
const adaptiveDamageEnemy=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
 const a=e?.adapt;if(!a||G.run?.infinite)return adaptiveDamageEnemy(e,dmg,ang,crit,kb,kind);
 if((a.shieldUntil||0)>G.run.t)return;
 const key=adaptiveGroupKey(e),budgets=G.run.adaptiveBudgets||(G.run.adaptiveBudgets={});let budget=budgets[key];
 if(!budget){const group=adaptiveCurrentGroup(e);budget=budgets[key]={start:G.run.t,spent:0,max:group.reduce((sum,b)=>sum+b.max,0)||e.max,rate:a.budget};}
 if(G.run.t-budget.start>=1){budget.start=G.run.t;budget.spent=0;budget.max=Math.max(budget.max,adaptiveCurrentGroup(e).reduce((sum,b)=>sum+b.max,0));}
 const allowed=Math.max(0,budget.max*budget.rate-budget.spent);if(allowed<1)return;
 dmg=Math.min(dmg,allowed,e.max*a.hitCap);
 const thresholds=adaptivePhaseThresholds(e),threshold=thresholds[a.gate];
 if(threshold){const gateHp=e.max*threshold;if(e.hp>gateHp)dmg=Math.min(dmg,e.hp-gateHp);}
 if(dmg<=0)return;
 const before=e.hp;adaptiveDamageEnemy(e,dmg,ang,crit,kb,kind);const dealt=Math.max(0,before-e.hp);budget.spent+=dealt;
 if(threshold&&!e.dead&&e.hp<=e.max*threshold+.5){a.gate++;a.shieldUntil=G.run.t+.85;addText(e.x,e.y-e.r-18,'ADAPTED', '#f3d6ff',13);burst(e.x,e.y,22,'#d7b4ff',175,.6,2.8,true);}
};

const adaptiveWardenActivation=activateWarden;
activateWarden=function(b){adaptiveWardenActivation(b);applyAdaptiveGroup(b);saveNow();};
const adaptiveMatriarchActivation=activateMatriarch;
activateMatriarch=function(b){adaptiveMatriarchActivation(b);applyAdaptiveGroup(b);saveNow();};
const adaptiveLateActivation=activateLateBoss;
activateLateBoss=function(b){adaptiveLateActivation(b);applyAdaptiveGroup(b);saveNow();};
const adaptiveSecretReveal=revealUncountedGuardian;
revealUncountedGuardian=function(){adaptiveSecretReveal();if(G.boss){applyAdaptiveGroup(G.boss);saveNow();}};

const adaptiveWardenAI=wardenAI;
wardenAI=function(b,dt,d,dx,dy){tickAdaptiveGuardian(b,dt);return adaptiveWardenAI(b,dt*(b.adapt?.tempo||1),Math.max(1,d),dx,dy);};
const adaptiveMatriarchAI=matriarchAI;
matriarchAI=function(b,dt,d,dx,dy){tickAdaptiveGuardian(b,dt);return adaptiveMatriarchAI(b,dt*(b.adapt?.tempo||1),Math.max(1,d),dx,dy);};
const adaptiveLateBossAI=lateBossAI;
lateBossAI=function(b,dt,d,dx,dy){tickAdaptiveGuardian(b,dt);return adaptiveLateBossAI(b,dt*(b.adapt?.tempo||1),Math.max(1,d),dx,dy);};

function ensureAdaptiveBadge(){
 let el=T('bossAdaptation');if(el)return el;el=document.createElement('div');el.id='bossAdaptation';el.hidden=true;el.setAttribute('aria-live','polite');T('bossname').after(el);return el;
}
const adaptiveHUD=updateHUD;
updateHUD=function(dt){
 adaptiveHUD(dt);const el=ensureAdaptiveBadge(),b=G.boss,a=b?.adapt;if(!a||b.dead||!b.introduced){el.hidden=true;return;}
 el.hidden=false;const tree=Math.round(a.mastery*100),need=Math.round(a.need*100),ready=a.mastery+1e-6>=a.need;
 el.classList.toggle('behind',!ready);el.textContent='READING '+a.read.toUpperCase()+'  ·  SKILL TREE '+tree+'% / '+need+'%'+(ready?'  ·  READY':'  ·  UNDERPOWERED');
};

const adaptiveLateBossBody=drawLateBossBody;
drawLateBossBody=function(ctx,b){
 adaptiveLateBossBody(ctx,b);const a=b.adapt;if(!a)return;const t=save.motion?0:G.tAll,shield=(a.shieldUntil||0)>(G.run?.t||0);
 ctx.save();ctx.translate(b.x,b.y);ctx.rotate(t*.23);ctx.strokeStyle=shield?'#f7e6ff':'#c7a3e8';ctx.globalAlpha=shield?.8:.18+.08*Math.sin(t*2.7);ctx.lineWidth=shield?3:1;
 for(let i=0;i<8;i++){ctx.rotate(TAU/8);ctx.beginPath();ctx.moveTo(b.r+9,-3);ctx.lineTo(b.r+16,0);ctx.lineTo(b.r+9,3);ctx.stroke();}ctx.restore();
};

const adaptiveResumeRun=resumeRun;
resumeRun=function(){
 adaptiveResumeRun();if(!G.run||G.run.infinite||!G.boss?.introduced)return;
 const group=adaptiveCurrentGroup(G.boss);if(group.some(b=>!b.adapt||b.adapt.version!==ADAPTIVE_GUARDIAN_VERSION))applyAdaptiveGroup(G.boss,false);
 else{G.run.adaptiveBudgets=G.run.adaptiveBudgets&&typeof G.run.adaptiveBudgets==='object'?G.run.adaptiveBudgets:{};const key=adaptiveGroupKey(G.boss);if(!G.run.adaptiveBudgets[key])G.run.adaptiveBudgets[key]={start:G.run.t,spent:0,max:group.reduce((sum,b)=>sum+b.max,0),rate:G.boss.adapt.budget};}
 updateHUD(0);saveNow();
};

globalThis.VoidFallBossDirector={version:ADAPTIVE_GUARDIAN_VERSION,requirements:[...ADAPTIVE_REQUIREMENT],budgets:[...ADAPTIVE_BUDGET],hitCaps:[...ADAPTIVE_HIT_CAP],mastery:adaptiveMastery,build:adaptiveBuild,model:adaptiveModel};
document.documentElement.dataset.bossDirector='listening-v1';
