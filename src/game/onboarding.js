'use strict';
const ONBOARDING_VERSION=2;
const ONBOARDING_STEPS=['move','bolt','flare','dash','kindled','rekindle','interact','blessing','warden'];
let onboardingMoveT=0,onboardingDashT=0,onboardingDeadShown=false;
function cleanOnboarding(raw,totalRuns=0){
 const out={version:ONBOARDING_VERSION};
 if(!raw&&totalRuns>=3){for(const id of ONBOARDING_STEPS)out[id]=true;return out;}
 for(const id of ONBOARDING_STEPS)out[id]=raw?.[id]===true;
 return out;
}
const onboardingValidate=validateSave;
validateSave=function(raw){const out=onboardingValidate(raw);out.onboarding=cleanOnboarding(raw?.onboarding,out.totalRuns);return out;};
function onboardingData(){return save.onboarding||(save.onboarding=cleanOnboarding(null,save.totalRuns));}
function learnOnboarding(id){const data=onboardingData();if(data[id])return;data[id]=true;markSave();saveNow();if(T('onboardingCoach')?.dataset.step===id)hideOnboardingCoach();}
function onboardingTouch(){return document.body.classList.contains('touch');}
const ONBOARDING_COPY={
 move:['MOVE FIRST',()=>onboardingTouch()?'Drag the left ember-ring to move.':'Use WASD or the arrow keys to move.'],
 bolt:['EMBER BOLT',()=>onboardingTouch()?'Hold the right ember-ring toward the creature.':'Aim with the mouse and hold click, or hold J.'],
 flare:['FLARE',()=>onboardingTouch()?'Tap FLARE when a creature gets close. It hits much harder.':'Press K or right-click when a creature gets close. Flare hits much harder.'],
 dash:['DASH THROUGH DANGER',()=>onboardingTouch()?'Tap DASH as an attack reaches you. You cannot be hurt during the burst.':'Press Space as an attack reaches you. You cannot be hurt during the burst.'],
 kindled:['DASH COUNTER',()=> 'A close dash through danger empowers your next Flare. Strike before the gold light fades.'],
 rekindle:['REKINDLE',()=>onboardingTouch()?'Your six bolts are nearly spent. Tap REKINDLE now, or it will begin automatically at empty.':'Your six bolts are nearly spent. Press R now, or Rekindle begins automatically at empty.'],
 interact:['THE RESTING FLAME',()=>onboardingTouch()?'Stand near the flame and tap USE to recover health.':'Stand near the flame and press E to recover health.'],
 blessing:['CHOOSE WHAT CHANGES',()=> 'Blessings last for this descent. Pick one that works with the way you are fighting.'],
 warden:['THE LAST WATCH',()=> 'Mara follows careless Bolts. Dash close to the glaive, then answer with Flare while her guard is open.']
};
const coach=document.createElement('aside');coach.id='onboardingCoach';coach.setAttribute('role','status');coach.setAttribute('aria-live','polite');coach.innerHTML='<span>FIRST DESCENT</span><strong id="onboardingTitle"></strong><p id="onboardingText"></p><i aria-hidden="true"></i>';document.body.append(coach);
function hideOnboardingCoach(){coach.classList.remove('visible');coach.dataset.step='';}
function showOnboardingCoach(id){if(onboardingData()[id]||coach.dataset.step===id)return;const copy=ONBOARDING_COPY[id];coach.dataset.step=id;T('onboardingTitle').textContent=copy[0];T('onboardingText').textContent=copy[1]();coach.classList.add('visible');}
function nearEnemy(range){const p=G.player;return p&&G.enemies.find(e=>!e.dead&&!e.isBoss&&!e.growth&&!e.mechanism&&d2(p.x,p.y,e.x,e.y)<range*range&&los(G.world,p.x,p.y,e.x,e.y));}
function onboardingWanted(){
 const d=onboardingData(),p=G.player;if(!p||G.floor>5)return'';
 if(!d.move)return'move';
 if(!d.bolt&&nearEnemy(390))return'bolt';
 if(!d.flare&&nearEnemy(145))return'flare';
 const danger=G.ebul.some(b=>d2(p.x,p.y,b.x,b.y)<155**2)||G.enemies.some(e=>!e.dead&&(e.action==='warn'||e.ai==='warden'&&e.wb?.mode==='windup'));
 if(!d.dash&&danger)return'dash';
 if(!d.kindled&&p.kindledT>0)return'kindled';
 if(!d.rekindle&&(p.ammo??p.magSize)>0&&(p.ammo??99)<=2)return'rekindle';
 const resting=typeof nearestRestingFlame==='function'&&nearestRestingFlame();
 if(!d.interact&&resting&&!resting.lit)return'interact';
 if(!d.warden&&G.boss?.warden&&G.boss.introduced)return'warden';
 return'';
}
function tickOnboarding(dt){
 if(!G.run||G.state!=='playing'||dialogue||anyBlockingOverlay()){hideOnboardingCoach();return;}
 const p=G.player;if(p?.moving){onboardingMoveT+=dt;if(onboardingMoveT>.22)learnOnboarding('move');}
 if(p?.dashT>0){onboardingDashT+=dt;if(onboardingDashT>.025)learnOnboarding('dash');}else onboardingDashT=0;
 const wanted=onboardingWanted();if(wanted)showOnboardingCoach(wanted);else hideOnboardingCoach();
 if(T('dead').classList.contains('open')&&!onboardingDeadShown){onboardingDeadShown=true;refreshFirstDeathGuide();}
}
const onboardingStart=startRun;
startRun=function(){onboardingMoveT=onboardingDashT=0;onboardingDeadShown=false;hideOnboardingCoach();return onboardingStart();};
const onboardingFire=fireVolley;
fireVolley=function(){const before=G.player?.ammo??0,out=onboardingFire();if((G.player?.ammo??before)<before)learnOnboarding('bolt');return out;};
const onboardingMelee=beginMelee;
beginMelee=function(){const out=onboardingMelee();if(out!==false)learnOnboarding('flare');return out;};
const onboardingReload=beginReload;
beginReload=function(){const manual=(G.player?.ammo??0)>0,out=onboardingReload();if(manual&&out===true)learnOnboarding('rekindle');return out;};
const onboardingFlame=useRestingFlame;
useRestingFlame=function(o){const fresh=!o.lit,out=onboardingFlame(o);if(fresh)learnOnboarding('interact');return out;};
const onboardingCard=chooseCard;
chooseCard=function(i){const valid=G.state==='levelup'&&G.cardPool?.[i],out=onboardingCard(i);if(valid)learnOnboarding('blessing');return out;};
function firstBlessingPrompt(){if(!onboardingData().blessing)T('luSub').textContent='BLESSINGS LAST FOR THIS DESCENT · CHOOSE HOW YOUR EMBER CHANGES';}
const onboardingTriggerLevel=triggerLevelup;
triggerLevelup=function(){const out=onboardingTriggerLevel();firstBlessingPrompt();return out;};
const onboardingOpenLevel=openLevelup;
openLevelup=function(free){const out=onboardingOpenLevel(free);firstBlessingPrompt();return out;};
const onboardingDamage=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind){const lesson=e?.warden&&e.introduced&&e.wb?.mode==='recover',out=onboardingDamage(e,dmg,ang,crit,kb,kind);if(lesson)learnOnboarding('warden');return out;};
const onboardingUpdate=update;
update=function(dt){const out=onboardingUpdate(dt);tickOnboarding(dt);return out;};
const deathGuide=document.createElement('div');deathGuide.id='firstDeathGuide';deathGuide.innerHTML='<strong>LEARN FROM THE FALL</strong><p id="firstDeathGuideText"></p>';T('dead').querySelector('.btnrow').before(deathGuide);
function refreshFirstDeathGuide(){
 const recap=save.lastRunRecap,goal=typeof recapNextGoal==='function'?recapNextGoal():null;
 const cause=recap?.death?.source&&recap.death.source!=='Cause not recorded'?recap.death.source:'the last encounter';
 T('firstDeathGuideText').textContent='The Run Recap shows how '+cause+' ended this descent. '+(goal?.node?'Your next suggested sigil is '+goal.node.name+'.':'Spend your essence before rising again.');
 deathGuide.hidden=G.floor>5;
}
const onboardingDie=die;
die=function(){const out=onboardingDie();setTimeout(()=>{if(G.dead)refreshFirstDeathGuide();},1350);return out;};
const onboardingChapter=showChapterClear;
showChapterClear=function(){onboardingChapter();if(G.floor===5){T('chapterCompleteLabel').textContent='THE FIRST GATE OPENS';T('chapterCompleteText').textContent='Mara lowers her glaive. Roots have split the stairs below.';T('chapterContinue').textContent='ENTER THE ROOTBOUND GARDENS';}};
