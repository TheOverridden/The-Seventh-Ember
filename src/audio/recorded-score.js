'use strict';

const TSE_RECORDED_TRACKS=Object.freeze({
 title:{title:'Ash at the Door',file:'assets/music/01_Ash_at_the_Door.wav'},
 hollow:{title:'Ash at the Door',file:'assets/music/01_Ash_at_the_Door.wav'},
 garden:{title:'Moss Has Teeth',file:'assets/music/02_Moss_Has_Teeth.wav'},
 reservoir:{title:'Flooded Bellworks',file:'assets/music/03_Flooded_Bellworks.wav'},
 foundry:{title:'Slagline Seven',file:'assets/music/04_Slagline_Seven.wav'},
 observatory:{title:'Parallax Bloom',file:'assets/music/05_Parallax_Bloom.wav'},
 archive:{title:'The Pale Minuet',file:'assets/music/06_The_Pale_Minuet.wav'},
 court:{title:'Two Blades, One Vow',file:'assets/music/07_Two_Blades_One_Vow.wav'},
 choir:{title:'Breathless Choir',file:'assets/music/08_Breathless_Choir.wav'},
 citadel:{title:'Blackstone Procession',file:'assets/music/09_Blackstone_Procession.wav'},
 heart:{title:'The Seventh Dawn',file:'assets/music/10_The_Seventh_Dawn.wav'},
 endless:{title:'Stair Without End',file:'assets/music/11_Stair_Without_End.wav'},
 moth:{title:'Moth Counts Twice',file:'assets/music/12_Moth_Counts_Twice.wav'}
});

const TSE_RECORDED_SCORE={decks:[],active:null,currentKey:'',pendingKey:'',token:0,timer:0,muted:true,nextLoopAt:0};

function tseRecordedRegion(){
 if(G.state==='secret'&&typeof currentSecret==='function'&&currentSecret()?.type==='shop')return'moth';
 if(G.run?.infinite&&G.floor>50)return'endless';
 if(!G.run)return'title';
 return G.world?.region==='late'?(G.world.lateKey||'heart'):G.floor<=5?'hollow':'garden';
}

function tseRecordedCanPlay(){return !!(AC&&save.music&&AC.state==='running'&&!document.hidden);}

function tseRecordedHold(param,now){
 if(typeof param.cancelAndHoldAtTime==='function')param.cancelAndHoldAtTime(now);
 else{const value=param.value;param.cancelScheduledValues(now);param.setValueAtTime(value,now);}
}

function tseRecordedRamp(deck,value,time){
 if(!AC||!deck)return;const now=AC.currentTime;tseRecordedHold(deck.gain.gain,now);deck.gain.gain.linearRampToValueAtTime(value,now+time);
}

function tseRecordedSilenceOldScore(){
 if(TSE_SCORE.timer){clearInterval(TSE_SCORE.timer);TSE_SCORE.timer=0;}
 if(TSE_SCORE.bus&&AC)TSE_SCORE.bus.gain.setTargetAtTime(0,AC.currentTime,.02);
 if(TSE_SCORE.bassBus&&AC)TSE_SCORE.bassBus.gain.setTargetAtTime(0,AC.currentTime,.02);
 if(droneG&&AC)droneG.gain.setTargetAtTime(0,AC.currentTime,.02);
}

function tseRecordedDeck(){
 const audio=new Audio(),gain=AC.createGain(),room=AC.createGain(),source=AC.createMediaElementSource(audio);
 audio.preload='metadata';audio.playsInline=true;audio.loop=false;audio.volume=1;
 gain.gain.value=0;room.gain.value=.48;source.connect(gain);gain.connect(musDry);gain.connect(room);room.connect(musSend);
 return{audio,gain,room,key:''};
}

function tseRecordedPrepare(){
 if(TSE_RECORDED_SCORE.decks.length||!AC)return;
 TSE_RECORDED_SCORE.decks=[tseRecordedDeck(),tseRecordedDeck()];
}

function tseRecordedSwitch(key,restart=false){
 const score=TSE_RECORDED_SCORE,track=TSE_RECORDED_TRACKS[key]||TSE_RECORDED_TRACKS.title;
 if(!AC||!score.decks.length)return;
 if(!restart&&(score.currentKey===key||score.pendingKey===key)){tseRecordedResume();return;}
 const old=score.active,next=score.decks.find(deck=>deck!==old)||score.decks[0],token=++score.token;
 score.pendingKey=key;score.nextLoopAt=performance.now()+2500;next.audio.pause();next.gain.gain.cancelScheduledValues(AC.currentTime);next.gain.gain.setValueAtTime(0,AC.currentTime);next.key=key;next.audio.src=track.file+'?v=2026092201';next.audio.load();
 const begin=()=>{
  if(token!==score.token){next.audio.pause();return;}
  score.active=next;score.currentKey=key;score.pendingKey='';score.muted=false;tseRecordedRamp(next,1,old?1.35:.8);
  if(old){tseRecordedRamp(old,0,1.35);setTimeout(()=>{if(score.active!==old){old.audio.pause();old.audio.removeAttribute('src');old.audio.load();old.key='';}},1500);}
 };
 const started=next.audio.play();
 if(started&&typeof started.then==='function')started.then(begin).catch(()=>{if(token===score.token)score.pendingKey='';});
 else begin();
}

function tseRecordedPause(){
 const score=TSE_RECORDED_SCORE;if(score.muted)return;score.muted=true;
 for(const deck of score.decks)tseRecordedRamp(deck,0,.22);
 setTimeout(()=>{if(score.muted)for(const deck of score.decks)deck.audio.pause();},260);
}

function tseRecordedResume(){
 const score=TSE_RECORDED_SCORE,deck=score.active;if(!deck||!tseRecordedCanPlay())return;
 if(!score.muted&&!deck.audio.paused)return;score.muted=false;
 deck.audio.play().then(()=>tseRecordedRamp(deck,1,.35)).catch(()=>{});
}

function tseRecordedTick(){
 tseRecordedSilenceOldScore();
 if(!tseRecordedCanPlay()){tseRecordedPause();return;}
 const score=TSE_RECORDED_SCORE,key=tseRecordedRegion();
 if(score.currentKey!==key&&!score.pendingKey){tseRecordedSwitch(key);return;}
 tseRecordedResume();
 const deck=score.active,audio=deck?.audio,remaining=audio&&Number.isFinite(audio.duration)?audio.duration-audio.currentTime:Infinity;
 if(deck&&!score.pendingKey&&remaining<2.25&&audio.currentTime>4&&performance.now()>score.nextLoopAt)tseRecordedSwitch(key,true);
}

const tseRecordedInitAudio=initAudio;
initAudio=function(){
 tseRecordedInitAudio();if(!AC)return;tseRecordedSilenceOldScore();tseRecordedPrepare();applyAudioSettings();tseRecordedTick();
 if(!TSE_RECORDED_SCORE.timer)TSE_RECORDED_SCORE.timer=setInterval(tseRecordedTick,250);
};

const tseRecordedApplyAudioSettings=applyAudioSettings;
applyAudioSettings=function(){
 tseRecordedApplyAudioSettings();if(!AC)return;const now=AC.currentTime,music=save.music?clamp(save.musicVolume??.82,0,1):0;
 musDry.gain.setTargetAtTime(.86*music,now,.12);musSend.gain.setTargetAtTime(.12*music,now,.16);tseRecordedSilenceOldScore();
 if(!music)tseRecordedPause();else tseRecordedTick();
};

endingMusic=function(){if(AC&&save.music)tseRecordedSwitch('heart',true);};
document.addEventListener('visibilitychange',tseRecordedTick);
