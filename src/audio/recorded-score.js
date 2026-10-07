'use strict';

const TSE_RECORDED_POOLS=Object.freeze({
 title:['13_Before_the_First_Bell'],
 pause:['26_Dust_in_the_Sunlight'],
 hollow:['01_Ash_at_the_Door','13_Before_the_First_Bell'],
 garden:['02_Moss_Has_Teeth','14_Roots_Under_Rain'],
 reservoir:['03_Flooded_Bellworks','15_The_Sluice_Opens'],
 foundry:['04_Slagline_Seven','16_Copper_Teeth'],
 observatory:['05_Parallax_Bloom','17_A_Window_Without_Sky'],
 archive:['06_The_Pale_Minuet','18_Ink_Between_the_Lines'],
 court:['07_Two_Blades_One_Vow','19_The_Empty_Ballroom'],
 choir:['08_Breathless_Choir','20_Bells_Above_the_Wind'],
 citadel:['09_Blackstone_Procession','21_Siege_at_Blackstone'],
 heart:['10_The_Seventh_Dawn','22_The_Room_That_Kept_the_Light'],
 endless:['11_Stair_Without_End','23_The_Weight_Below','16_Copper_Teeth','21_Siege_at_Blackstone'],
 moth:['12_Moth_Counts_Twice','24_No_Refunds_After_Dawn'],
 memory:['25_A_House_Remembered','26_Dust_in_the_Sunlight'],
 guardian:['27_The_Bell_Does_Not_Yield','28_Keep_the_Flame']
});

const TSE_RECORDED_SCORE={decks:[],active:null,currentKey:'',pendingKey:'',token:0,timer:0,muted:true,pauseToken:0,cache:new Map(),positions:new Map(),failures:new Map(),error:''};

function tseRecordedRegion(){
 if(G.state==='echo')return'memory';
 if(G.state==='secret'&&typeof currentSecret==='function'&&currentSecret()?.type==='shop')return'moth';
 if(!G.run)return'title';
 if(G.state==='paused'&&T('pause').classList.contains('open'))return'pause';
 const region=G.run.infinite&&G.floor>50?'endless':G.world?.region==='late'?(G.world.lateKey||'heart'):G.floor<=5?'hollow':'garden';
 if(G.bossActive){if(region==='court')return'court';if(region==='heart')return'heart';return'guardian';}
 return region;
}

function tseRecordedTrack(){
 if(G.state==='ending'||G.bossActive&&tseRecordedRegion()==='heart')return'10_The_Seventh_Dawn';
 const region=tseRecordedRegion(),pool=TSE_RECORDED_POOLS[region]||TSE_RECORDED_POOLS.title;
 let variation=save.totalRuns||0;
 if(region==='memory'&&typeof activeMemoryEcho!=='undefined')for(const c of activeMemoryEcho?.id||'')variation+=c.charCodeAt(0);
 else if(region==='endless')variation+=Math.floor(Math.max(0,G.floor-51)/10);
 else if(region==='guardian')variation+=Math.floor(G.floor/5);
 else if(region!=='title')variation+=Math.floor((G.floor-1)/5);
 if(region==='court'&&G.bossActive)return TSE_RECORDED_POOLS.court[0];
 return pool[Math.abs(variation)%pool.length];
}

function tseRecordedCanPlay(){return !!(AC&&save.music&&(save.musicVolume??.82)>0&&AC.state==='running'&&!document.hidden);}

function tseRecordedHold(param,now){
 if(typeof param.cancelAndHoldAtTime==='function')param.cancelAndHoldAtTime(now);
 else{const value=param.value;param.cancelScheduledValues(now);param.setValueAtTime(value,now);}
}

function tseRecordedRamp(deck,value,time){
 if(!AC||!deck)return;const now=AC.currentTime;tseRecordedHold(deck.gain.gain,now);deck.gain.gain.linearRampToValueAtTime(value,now+time);
}

function tseRecordedDeck(){
 const gain=AC.createGain();gain.gain.value=0;gain.connect(musDry);
 return{gain,key:'',buffer:null,source:null,audio:null,media:null,offset:0,startedAt:0,startedOffset:0,generation:0};
}

function tseRecordedPrepare(){if(!TSE_RECORDED_SCORE.decks.length&&AC)TSE_RECORDED_SCORE.decks=[tseRecordedDeck(),tseRecordedDeck()];}

function tseRecordedPosition(deck){
 if(deck.audio&&!deck.buffer)return deck.audio.currentTime||0;
 if(!deck.buffer)return 0;
 return(deck.source?deck.startedOffset+Math.max(0,AC.currentTime-deck.startedAt):deck.offset)%deck.buffer.duration;
}

function tseRecordedStop(deck){
 if(!deck)return;deck.generation++;deck.offset=tseRecordedPosition(deck);
 if(deck.key)TSE_RECORDED_SCORE.positions.set(deck.key,deck.offset);
 if(deck.source){deck.source.stop();deck.source=null;}
 if(deck.audio)deck.audio.pause();
}

function tseRecordedRelease(deck){
 tseRecordedStop(deck);deck.buffer=null;deck.key='';
 if(deck.audio){deck.audio.removeAttribute('src');deck.audio.load();}
}

function tseRecordedStart(deck){
 if(deck.audio&&!deck.buffer){const promise=deck.audio.play();if(promise)promise.catch(()=>{if(deck===TSE_RECORDED_SCORE.active)TSE_RECORDED_SCORE.muted=true;});return;}
 if(!deck.buffer||deck.source)return;
 const source=AC.createBufferSource();source.buffer=deck.buffer;source.loop=true;source.loopStart=0;source.loopEnd=deck.buffer.duration;source.connect(deck.gain);
 deck.startedAt=AC.currentTime+.015;deck.startedOffset=deck.offset%deck.buffer.duration;deck.source=source;
 source.onended=()=>source.disconnect();source.start(deck.startedAt,deck.startedOffset);
}

function tseRecordedTrimCache(){
 const score=TSE_RECORDED_SCORE;
 for(const [key,entry]of score.cache){if(score.cache.size<=2)break;if(entry.buffer&&key!==score.currentKey&&key!==score.pendingKey)score.cache.delete(key);}
}

async function tseRecordedLoad(key){
 const score=TSE_RECORDED_SCORE;
 if(score.cache.has(key)){const entry=score.cache.get(key);score.cache.delete(key);score.cache.set(key,entry);return entry.promise;}
 const entry={buffer:null,promise:null};
 entry.promise=(async()=>{
  const response=await fetch('assets/music/'+key+'.ogg?v=2026100602',{credentials:'same-origin'});
  if(!response.ok)throw new Error('Music '+response.status);
  const buffer=await AC.decodeAudioData(await response.arrayBuffer());entry.buffer=buffer;tseRecordedTrimCache();return buffer;
 })().catch(error=>{score.cache.delete(key);throw error;});
 score.cache.set(key,entry);return entry.promise;
}

function tseRecordedNative(deck,key){
 if(!deck.audio){deck.audio=new Audio();deck.audio.preload='auto';deck.audio.playsInline=true;deck.audio.loop=true;deck.media=AC.createMediaElementSource(deck.audio);deck.media.connect(deck.gain);}
 deck.audio.src='assets/music/'+key+'.ogg?v=2026100602';deck.audio.load();
 const restore=()=>{if(deck.audio.duration>deck.offset)deck.audio.currentTime=deck.offset;};
 deck.audio.addEventListener('loadedmetadata',restore,{once:true});
}

async function tseRecordedSwitch(key,restart=false){
 const score=TSE_RECORDED_SCORE;
 if(!AC)return;tseRecordedPrepare();
 if(!restart&&score.currentKey===key){score.pendingKey='';score.token++;tseRecordedResume();return;}
 if(!restart&&score.pendingKey===key)return;
 if((score.failures.get(key)||0)>Date.now())return;
 const token=++score.token;score.pendingKey=key;
 let buffer=null;
 try{if(location.protocol!=='file:')buffer=await tseRecordedLoad(key);}
 catch(error){if(token===score.token){score.pendingKey='';score.error=error.message;score.failures.set(key,Date.now()+15000);}return;}
 if(token!==score.token)return;
 const old=score.active,next=score.decks.find(deck=>deck!==old)||score.decks[0];tseRecordedRelease(next);
 next.key=key;next.buffer=buffer;next.offset=restart?0:score.positions.get(key)||0;next.gain.gain.cancelScheduledValues(AC.currentTime);next.gain.gain.setValueAtTime(0,AC.currentTime);
 if(!buffer)tseRecordedNative(next,key);
 score.active=next;score.currentKey=key;score.pendingKey='';score.error='';score.muted=!tseRecordedCanPlay();score.pauseToken++;
 if(!score.muted){tseRecordedStart(next);tseRecordedRamp(next,1,old?1.5:.6);}
 if(old){tseRecordedRamp(old,0,1.5);const generation=old.generation;setTimeout(()=>{if(score.active!==old&&old.generation===generation)tseRecordedRelease(old);},1550);}
 tseRecordedTrimCache();
}

function tseRecordedPause(){
 const score=TSE_RECORDED_SCORE;if(score.muted)return;score.muted=true;const token=++score.pauseToken;
 for(const deck of score.decks)tseRecordedRamp(deck,0,.15);
 setTimeout(()=>{if(score.muted&&score.pauseToken===token)for(const deck of score.decks)tseRecordedStop(deck);},170);
}

function tseRecordedResume(){
 const score=TSE_RECORDED_SCORE,deck=score.active;if(!deck||!tseRecordedCanPlay())return;
 if(!score.muted&&(deck.source||deck.audio&&!deck.audio.paused&&!deck.buffer))return;
 score.muted=false;score.pauseToken++;tseRecordedStart(deck);tseRecordedRamp(deck,1,.3);
 for(const other of score.decks)if(other!==deck)tseRecordedStop(other);
}

function tseRecordedTick(){
 if(!tseRecordedCanPlay()){tseRecordedPause();return;}
 const score=TSE_RECORDED_SCORE,key=tseRecordedTrack();
 if(score.currentKey!==key&&score.pendingKey!==key){tseRecordedSwitch(key);return;}
 if(score.currentKey===key&&score.pendingKey){score.token++;score.pendingKey='';}
 tseRecordedResume();
}

const tseRecordedInitAudio=initAudio;
initAudio=function(){
 tseRecordedInitAudio();if(!AC)return;tseRecordedPrepare();applyAudioSettings();tseRecordedTick();
 if(!TSE_RECORDED_SCORE.timer){TSE_RECORDED_SCORE.timer=setInterval(tseRecordedTick,250);AC.addEventListener('statechange',tseRecordedTick);}
};

function applyAudioSettings(){
 if(!AC)return;const now=AC.currentTime,music=save.music?clamp(save.musicVolume??.82,0,1):0,effects=save.sfx?clamp(save.sfxVolume??.86,0,1):0;
 sfxDry.gain.setTargetAtTime(.58*effects,now,.1);sfxSend.gain.setTargetAtTime(.27*effects,now,.1);
 musDry.gain.setTargetAtTime(.86*music,now,.12);
 if(!music)tseRecordedPause();else tseRecordedTick();
}

function endingMusic(){if(AC&&save.music)tseRecordedSwitch('10_The_Seventh_Dawn',true);}
const tseRecordedSetState=setState;
setState=function(state){tseRecordedSetState(state);if(['menu','paused','playing'].includes(state))applyAudioSettings();else tseRecordedTick();};
function tseRecordedUnlock(){if(!AC||AC.state!=='running'||TSE_RECORDED_SCORE.muted&&tseRecordedCanPlay())initAudio();}
document.addEventListener('pointerdown',tseRecordedUnlock,{capture:true,passive:true});
document.addEventListener('keydown',tseRecordedUnlock,{capture:true});
window.addEventListener('load',()=>{initAudio();if(AC&&save.music&&location.protocol!=='file:')tseRecordedLoad(TSE_RECORDED_POOLS.title[0]).catch(()=>{});},{once:true});
document.addEventListener('visibilitychange',tseRecordedTick);
