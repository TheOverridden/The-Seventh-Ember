'use strict';

const RUNNER_TOOLS_VERSION=2;
const runnerNativeRandom=Math.random;
let runnerPending=null,runnerSeedSaveTimer=0;

function runnerHash(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,2246822507);h^=h>>>13;h=Math.imul(h,3266489909);h^=h>>>16;return h>>>0;}
function runnerHex(value){return('00000000'+(value>>>0).toString(16).toUpperCase()).slice(-8);}
function runnerCleanSeed(value){return String(value||'').toUpperCase().replace(/[^A-Z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(0,28);}
function runnerRandomSeed(){const values=new Uint32Array(2);if(globalThis.crypto?.getRandomValues)crypto.getRandomValues(values);else{values[0]=(runnerNativeRandom()*0xffffffff)>>>0;values[1]=Date.now()>>>0;}return'EMBER-'+runnerHex(values[0]).slice(0,4)+'-'+runnerHex(values[1]).slice(0,4);}
function runnerDailySeed(){return'DAILY-'+new Date().toISOString().slice(0,10).replaceAll('-','');}
function runnerNext(holder,key='rngState'){let x=holder[key]>>>0;if(!x)x=0x6d2b79f5;x^=x<<13;x^=x>>>17;x^=x<<5;holder[key]=x>>>0;return holder[key]/4294967296;}
function runnerWithRandom(holder,key,fn){const previous=Math.random;Math.random=()=>runnerNext(holder,key);try{return fn();}finally{Math.random=previous;}}
function runnerWithDerived(seed,label,fn){const holder={state:runnerHash(seed+'|'+label)||1};return runnerWithRandom(holder,'state',fn);}
function runnerData(){return G.run?.runner||runnerPending;}
function runnerCreate(seed,fixed){return{version:RUNNER_TOOLS_VERSION,seed,fixed:!!fixed,rngState:runnerHash(seed+'|gameplay')||1,offerIndex:0,legacy:false};}
function runnerFormat(seconds){const ms=Math.max(0,Math.round((seconds||0)*1000)),hours=Math.floor(ms/3600000),minutes=Math.floor(ms%3600000/60000),secs=Math.floor(ms%60000/1000),millis=ms%1000;return(hours?hours+':'+String(minutes).padStart(2,'0'):String(minutes).padStart(2,'0'))+':'+String(secs).padStart(2,'0')+'.'+String(millis).padStart(3,'0');}
function runnerCopy(text,button){if(!text)return;const done=()=>{const old=button?.textContent;if(button){button.textContent='COPIED';setTimeout(()=>button.textContent=old,900);}};if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(done).catch(()=>runnerCopyFallback(text,done));else runnerCopyFallback(text,done);}
function runnerCopyFallback(text,done){const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();try{document.execCommand('copy');done();}catch(_){ }area.remove();}

function runnerCleanData(raw,legacy=false){if(!raw||typeof raw!=='object')throw Error('Invalid run seed data');const seed=runnerCleanSeed(raw.seed);if(!seed)throw Error('Invalid run seed data');const rng=Number(raw.rngState),offer=Number(raw.offerIndex);if(!Number.isInteger(rng)||rng<0||rng>0xffffffff||!Number.isInteger(offer)||offer<0||offer>10000)throw Error('Invalid run seed data');return{version:RUNNER_TOOLS_VERSION,seed,fixed:legacy?raw.category==='seeded':raw.fixed===true,rngState:rng>>>0,offerIndex:offer,legacy:legacy||raw.legacy===true};}
function runnerUpdateHud(){const hud=T('runTimerHud'),run=G.run,data=runnerData(),visible=!!save.runTimer&&!!run&&G.state!=='menu';hud.hidden=!visible;if(!visible)return;T('runTimerValue').textContent=runnerFormat(run.t);T('runTimerSeed').textContent=data?.seed||'UNSEEDED RUN';hud.setAttribute('aria-label',data?'Copy current run seed '+data.seed:'Run timer');}
function runnerSyncSettings(){const timer=T('setRunTimer'),input=T('setRunSeed'),copy=T('runnerCopySeed'),status=T('runnerSeedStatus');if(!timer||!input)return;timer.checked=!!save.runTimer;if(document.activeElement!==input)input.value=runnerCleanSeed(save.runSeed);copy.disabled=!runnerCleanSeed(save.runSeed);const data=G.run?.runner;if(data)status.textContent='Current descent: '+data.seed+'. Seed changes apply to the next new descent.';else if(G.run)status.textContent='This existing descent predates seeded runs. Your choice applies next time.';else status.textContent=save.runSeed?'The next new descent will use '+runnerCleanSeed(save.runSeed)+'.':'The next new descent will receive a fresh random seed.';runnerUpdateHud();}
function runnerQueueSave(){clearTimeout(runnerSeedSaveTimer);runnerSeedSaveTimer=setTimeout(()=>{runnerSeedSaveTimer=0;saveNow();},250);}
function runnerSetSeed(value){clearTimeout(runnerSeedSaveTimer);runnerSeedSaveTimer=0;save.runSeed=runnerCleanSeed(value);markSave();runnerSyncSettings();saveNow();}

const runnerValidateSaveBase=validateSave;
validateSave=function(raw){const clean=runnerValidateSaveBase(raw);clean.runTimer=raw?.runTimer?1:0;clean.runSeed=runnerCleanSeed(raw?.runSeed);return clean;};
const runnerValidateCheckpointBase=validateCheckpoint;
validateCheckpoint=function(checkpoint){const out=runnerValidateCheckpointBase(checkpoint),run=out.run,legacy=run?.speedrun;if(run?.runner)run.runner=runnerCleanData(run.runner);else if(legacy)run.runner=runnerCleanData(legacy,true);if(legacy)delete run.speedrun;return out;};

const runnerStartRunBase=startRun;
startRun=function(){const configured=runnerCleanSeed(save.runSeed),seed=configured||runnerRandomSeed();runnerPending=runnerCreate(seed,!!configured);try{return runnerStartRunBase();}finally{runnerPending=null;runnerUpdateHud();runnerSyncSettings();}};
const runnerSetupFloorBase=setupFloor;
setupFloor=function(floor){const data=runnerData();if(data&&G.run&&!G.run.runner)G.run.runner=data;return data?runnerWithDerived(data.seed,'floor-'+floor,()=>runnerSetupFloorBase(floor)):runnerSetupFloorBase(floor);};
const runnerBuildCardsBase=buildCards;
buildCards=function(){const data=runnerData();if(!data)return runnerBuildCardsBase();const restored=Array.isArray(G.restoreCardIds)&&G.restoreCardIds.length>0,index=data.offerIndex||0;if(!restored)data.offerIndex=index+1;return runnerWithDerived(data.seed,'blessing-'+index,()=>runnerBuildCardsBase());};
const runnerUpdateBase=update;
update=function(dt){const data=runnerData();return data?runnerWithRandom(data,'rngState',()=>runnerUpdateBase(dt)):runnerUpdateBase(dt);};
const runnerSfxBase=sfx;
sfx=function(...args){if(!runnerData())return runnerSfxBase(...args);const previous=Math.random;Math.random=runnerNativeRandom;try{return runnerSfxBase(...args);}finally{Math.random=previous;}};
const runnerBurstBase=burst;
burst=function(...args){if(!runnerData())return runnerBurstBase(...args);const previous=Math.random;Math.random=runnerNativeRandom;try{return runnerBurstBase(...args);}finally{Math.random=previous;}};
const runnerResumeRunBase=resumeRun;
resumeRun=function(){const legacy=save.resume?.run?.runner?.legacy===true,result=runnerResumeRunBase();if(legacy&&G.run){const ratio=G.player.hp/Math.max(1,G.player.maxHp);META=computeMeta();recalc();G.player.hp=clamp(G.player.maxHp*ratio,.01,G.player.maxHp);G.run.runner.legacy=false;saveNow();}runnerUpdateHud();runnerSyncSettings();return result;};
const runnerBackToMenuBase=backToMenu;
backToMenu=function(){const result=runnerBackToMenuBase();runnerUpdateHud();runnerSyncSettings();return result;};
const runnerSyncSettingsBase=syncSettings;
syncSettings=function(){runnerSyncSettingsBase();runnerSyncSettings();};
const runnerUpdateHudBase=updateHUD;
updateHUD=function(dt){const result=runnerUpdateHudBase(dt);runnerUpdateHud();return result;};

on(T('setRunTimer'),'change',()=>{save.runTimer=T('setRunTimer').checked?1:0;markSave();runnerSyncSettings();saveNow();});
on(T('setRunSeed'),'input',()=>{const input=T('setRunSeed');input.value=String(input.value||'').toUpperCase().replace(/[^A-Z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-+/,'').slice(0,28);save.runSeed=input.value;markSave();runnerSyncSettings();runnerQueueSave();});
on(T('setRunSeed'),'change',()=>runnerSetSeed(T('setRunSeed').value));
on(T('runnerRandomSeed'),'click',()=>runnerSetSeed(runnerRandomSeed()));
on(T('runnerDailySeed'),'click',()=>runnerSetSeed(runnerDailySeed()));
on(T('runnerClearSeed'),'click',()=>runnerSetSeed(''));
on(T('runnerCopySeed'),'click',()=>runnerCopy(runnerCleanSeed(save.runSeed),T('runnerCopySeed')));
on(T('runTimerHud'),'click',()=>runnerCopy(G.run?.runner?.seed,T('runTimerSeed')));

runnerSyncSettings();
