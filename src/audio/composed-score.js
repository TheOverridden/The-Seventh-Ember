'use strict';
const TSE_SCORE_REGIONS={
 title:{name:'Falling Light',movement:'Overture',bpm:72,tonic:33,scale:[0,2,3,5,7,8,10],progression:[0,5,3,6,0,2,5,4],wave:'triangle',leadCut:1180,bass:[0,null,null,0,null,4,null,null,0,null,2,null,4,null,5,null]},
 hollow:{name:'Falling Light',movement:'The Hollow Gate',bpm:78,tonic:33,scale:[0,2,3,5,7,8,10],progression:[0,5,3,6,0,2,5,4],wave:'triangle',leadCut:1080,bass:[0,null,0,null,4,null,5,null,0,null,2,null,4,null,5,null]},
 garden:{name:'Falling Light',movement:'Rootbound',bpm:82,tonic:38,scale:[0,2,3,5,7,9,10],progression:[0,3,5,4,0,6,3,5],wave:'sine',leadCut:1380,bass:[0,null,null,4,null,5,null,4,0,null,2,null,4,null,5,null]},
 reservoir:{name:'Falling Light',movement:'Below the Waterline',bpm:74,tonic:31,scale:[0,2,3,5,7,9,10],progression:[0,6,3,5,0,2,6,4],wave:'sine',leadCut:920,bass:[0,null,null,null,4,null,2,null,0,null,null,5,null,4,null,null]},
 foundry:{name:'Falling Light',movement:'The Furnace Keeps Time',bpm:90,tonic:34,scale:[0,1,3,5,7,8,10],progression:[0,0,5,3,0,6,5,4],wave:'triangle',leadCut:1560,bass:[0,null,0,0,4,null,5,null,0,null,0,2,4,null,5,5]},
 observatory:{name:'Falling Light',movement:'Glass Constellations',bpm:76,tonic:35,scale:[0,2,4,6,7,9,11],progression:[0,4,2,5,0,6,3,4],wave:'sine',leadCut:1740,bass:[0,null,null,4,null,null,5,null,0,null,2,null,4,null,null,6]},
 archive:{name:'Falling Light',movement:'Margins Remember',bpm:72,tonic:33,scale:[0,1,3,5,7,8,10],progression:[0,2,5,3,0,6,2,4],wave:'triangle',leadCut:980,bass:[0,null,null,2,null,4,null,null,0,null,5,null,3,null,2,null]},
 court:{name:'Falling Light',movement:'Two Empty Thrones',bpm:84,tonic:36,scale:[0,2,3,5,7,8,11],progression:[0,3,6,5,0,2,3,4],wave:'triangle',leadCut:1320,bass:[0,null,4,null,5,null,4,null,0,null,2,null,5,null,4,null]},
 choir:{name:'Falling Light',movement:'A Voice Above',bpm:80,tonic:38,scale:[0,2,3,5,7,9,11],progression:[0,5,2,6,0,3,5,4],wave:'sine',leadCut:1620,bass:[0,null,null,4,null,5,null,6,0,null,2,null,4,null,5,null]},
 citadel:{name:'Falling Light',movement:'The Walls March',bpm:92,tonic:32,scale:[0,1,3,5,7,8,10],progression:[0,0,3,5,0,6,3,4],wave:'triangle',leadCut:1220,bass:[0,0,null,4,0,null,5,null,0,0,null,2,4,null,5,null]},
 heart:{name:'Falling Light',movement:'The First Promise',bpm:86,tonic:33,scale:[0,3,5,7,8,10,11],progression:[0,5,3,6,0,2,5,0],wave:'sine',leadCut:1840,bass:[0,null,4,null,5,null,6,null,0,2,null,4,null,5,null,6]}
};
const TSE_THEME=[
 null,null,0,null,2,null,3,null,5,null,3,2,0,null,null,null,
 null,0,2,null,3,5,7,null,6,null,5,3,2,null,null,null,
 null,null,0,null,2,3,5,null,8,null,7,5,3,null,2,null,
 0,null,2,null,3,null,5,6,5,null,3,2,0,null,null,null
];
const TSE_COUNTER=[null,7,null,null,6,null,5,null,null,4,null,null,3,null,2,null];
const TSE_SCORE={version:3,title:'Falling Light',timer:0,next:0,step:0,key:'',section:0,bus:null,bassBus:null,drone:[],scheduled:0,counts:{},lastEvent:'',movement:'Overture'};

function tseScoreRegion(){if(!G.run)return'title';return G.world?.region==='late'?(G.world.lateKey||'heart'):G.floor<=5?'hollow':'garden';}
function tseScoreProfile(){return TSE_SCORE_REGIONS[tseScoreRegion()]||TSE_SCORE_REGIONS.hollow;}
function tseScoreMidi(n){return 440*Math.pow(2,(n-69)/12);}
function tseScoreDegree(profile,degree,octaves=0){let octave=Math.floor(degree/7),index=degree%7;if(index<0){index+=7;octave--;}return profile.tonic+profile.scale[index]+12*(octave+octaves);}
function tseScoreActive(){return !!(AC&&save.music&&AC.state==='running'&&!document.hidden&&['menu','playing','paused','dialogue','chapter','levelup'].includes(G.state));}
function tseScoreOut(){return TSE_SCORE.bus||musLP;}
function tseScoreConnect(node,out=tseScoreOut()){node.connect(out);}
function tseScoreMark(kind){TSE_SCORE.scheduled++;TSE_SCORE.counts[kind]=(TSE_SCORE.counts[kind]||0)+1;TSE_SCORE.lastEvent=kind;}

function tseScoreVoice(midi,when,dur,vol,wave,cutoff,pan=0){
 if(!AC||!tseScoreOut())return;const out=tseScoreOut(),lp=AC.createBiquadFilter(),amp=AC.createGain(),body=AC.createOscillator(),airVoice=AC.createOscillator(),airGain=AC.createGain();
 lp.type='lowpass';lp.Q.value=.65;lp.frequency.setValueAtTime(cutoff,when);lp.frequency.exponentialRampToValueAtTime(Math.max(260,cutoff*.58),when+dur);
 amp.gain.setValueAtTime(.0001,when);amp.gain.exponentialRampToValueAtTime(vol,when+.035);amp.gain.setValueAtTime(vol*.72,when+Math.max(.05,dur*.42));amp.gain.exponentialRampToValueAtTime(.0001,when+dur);
 body.type=wave;body.frequency.value=tseScoreMidi(midi);body.detune.value=pan*3;
 airVoice.type='sine';airVoice.frequency.value=tseScoreMidi(midi+12);airVoice.detune.value=-pan*4;airGain.gain.value=.13;
 body.connect(lp);airVoice.connect(airGain);airGain.connect(lp);lp.connect(amp);amp.connect(out);body.start(when);airVoice.start(when);body.stop(when+dur+.05);airVoice.stop(when+dur+.05);tseScoreMark('melody');
}
function tseScorePad(profile,degrees,when,dur,intensity){
 if(!AC||!tseScoreOut())return;const lp=AC.createBiquadFilter(),amp=AC.createGain();lp.type='lowpass';lp.Q.value=.5;lp.frequency.setValueAtTime(420+intensity*260,when);lp.frequency.linearRampToValueAtTime(760+intensity*520,when+dur*.55);amp.gain.setValueAtTime(.0001,when);amp.gain.linearRampToValueAtTime(.014,when+Math.min(.55,dur*.2));amp.gain.setValueAtTime(.012,when+dur*.7);amp.gain.linearRampToValueAtTime(.0001,when+dur);lp.connect(amp);amp.connect(tseScoreOut());
 degrees.forEach((degree,i)=>{for(const detune of [-5,5]){const o=AC.createOscillator(),g=AC.createGain();o.type=i===0?'sine':'triangle';o.frequency.value=tseScoreMidi(tseScoreDegree(profile,degree,i===0?0:1));o.detune.value=detune;g.gain.value=(i===0?.72:.28);o.connect(g);g.connect(lp);o.start(when);o.stop(when+dur+.08);}});tseScoreMark('harmony');
}
function tseScoreBass(profile,degree,when,dur,accent=1){
 if(!AC||!TSE_SCORE.bassBus)return;const lp=AC.createBiquadFilter(),amp=AC.createGain(),sub=AC.createOscillator(),body=AC.createOscillator(),bodyGain=AC.createGain(),freq=tseScoreMidi(tseScoreDegree(profile,degree,0));
 lp.type='lowpass';lp.Q.value=1.15;lp.frequency.setValueAtTime(360,when);lp.frequency.exponentialRampToValueAtTime(105,when+dur);
 amp.gain.setValueAtTime(.0001,when);amp.gain.exponentialRampToValueAtTime(.072*accent,when+.018);amp.gain.setValueAtTime(.048*accent,when+dur*.55);amp.gain.exponentialRampToValueAtTime(.0001,when+dur);
 sub.type='sine';sub.frequency.setValueAtTime(freq*1.012,when);sub.frequency.exponentialRampToValueAtTime(freq,when+.06);body.type='triangle';body.frequency.value=freq*2;body.detune.value=-7;bodyGain.gain.value=.14;
 sub.connect(lp);body.connect(bodyGain);bodyGain.connect(lp);lp.connect(amp);amp.connect(TSE_SCORE.bassBus);sub.start(when);body.start(when);sub.stop(when+dur+.04);body.stop(when+dur+.04);tseScoreMark('bass');
}
function tseScoreNoise(when,dur,vol,frequency,type='bandpass'){
 if(!AC||!noiseBuf||!tseScoreOut())return;const source=AC.createBufferSource(),filter=AC.createBiquadFilter(),gain=AC.createGain();source.buffer=noiseBuf;filter.type=type;filter.frequency.value=frequency;filter.Q.value=.85;gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(vol,when+.008);gain.gain.exponentialRampToValueAtTime(.0001,when+dur);source.connect(filter);filter.connect(gain);gain.connect(tseScoreOut());source.start(when);source.stop(when+dur+.02);
}
function tseScoreKick(when,power){if(!AC||!TSE_SCORE.bassBus)return;const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(82,when);o.frequency.exponentialRampToValueAtTime(38,when+.17);g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(.062*power,when+.009);g.gain.exponentialRampToValueAtTime(.0001,when+.21);o.connect(g);g.connect(TSE_SCORE.bassBus);o.start(when);o.stop(when+.23);tseScoreMark('kick');}
function tseScoreDrums(step,when,pressure,boss){
 const beat=step%16;if((pressure>.2||boss)&&(beat===0||beat===8||(boss&&beat===11)))tseScoreKick(when,beat===0?1.1:.78);
 if((pressure>.36||boss)&&(beat===4||beat===12)){tseScoreNoise(when,.16,.026+pressure*.012,470,'bandpass');tseScoreMark('snare');}
 if((pressure>.55||boss)&&beat%2===0)tseScoreNoise(when,.045,.006+pressure*.004,3400,'highpass');
}
function tseScoreLeadDegree(step,section,boss){
 let degree=TSE_THEME[step%TSE_THEME.length];if(degree===null)return null;
 if(section===1&&step%8===0)degree+=2;if(section===2)degree=(step%16<8?degree+4:degree-2);if(section===3&&step%16>10)degree-=2;if(boss)degree=(degree+3+(step%4===0?7:0));return degree;
}
function tseScoreScheduleStep(when){
 const profile=tseScoreProfile(),boss=!!G.bossActive,pressure=clamp(globalThis.TheSeventhEmberCombatMix?.intensity||0,0,1),step=TSE_SCORE.step++,beat=60/(profile.bpm+(boss?12:Math.round(pressure*6)))/4,bar=Math.floor(step/16),local=step%16,section=Math.floor(bar/4)%4,chordRoot=profile.progression[bar%profile.progression.length];TSE_SCORE.section=section;TSE_SCORE.movement=profile.movement;
 if(local===0){tseScorePad(profile,[chordRoot,chordRoot+2,chordRoot+4],when,beat*17,pressure);tseScoreSetDrone(profile,when);}
 const bassDegree=profile.bass[local];if(bassDegree!==null)tseScoreBass(profile,chordRoot+bassDegree,when,beat*(boss?.92:1.55),local===0?1.14:1);
 const lead=tseScoreLeadDegree(step,section,boss);if(lead!==null&&(local%2===0||boss))tseScoreVoice(tseScoreDegree(profile,lead,2),when,beat*(boss?2.15:3.1),boss?.019:.014,profile.wave,profile.leadCut,boss?1:section-1.5);
 if((section===1||section===3||boss)&&TSE_COUNTER[local]!==null&&local%4===0)tseScoreVoice(tseScoreDegree(profile,chordRoot+TSE_COUNTER[local],1),when,beat*4.5,.008,'sine',760,-1);
 tseScoreDrums(step,when,G.state==='paused' ? 0 : pressure,boss);return beat;
}
function tseScoreScheduler(){
 if(!tseScoreActive()){TSE_SCORE.next=0;return;}const now=AC.currentTime,key=tseScoreRegion()+(G.bossActive?':guardian':'');
 if(key!==TSE_SCORE.key){TSE_SCORE.key=key;TSE_SCORE.step=0;TSE_SCORE.next=now+.08;}
 if(!TSE_SCORE.next||TSE_SCORE.next<now-.18)TSE_SCORE.next=now+.055;let guard=0;
 while(TSE_SCORE.next<now+.26&&guard++<12)TSE_SCORE.next+=tseScoreScheduleStep(TSE_SCORE.next);
}
function tseScoreSetDrone(profile,when=AC?.currentTime||0){if(!AC)return;const root=tseScoreMidi(profile.tonic);TSE_SCORE.drone.forEach((o,i)=>o.frequency.setTargetAtTime(root*(i===2?1.5:1)+(i===1?.13:0),when,.65));}
function tseScoreStartDrone(){
 droneLP=AC.createBiquadFilter();droneLP.type='lowpass';droneLP.frequency.value=150;droneLP.Q.value=.72;droneG=AC.createGain();droneG.gain.value=0;droneLP.connect(droneG);droneG.connect(musLP);TSE_SCORE.drone=[];
 [1,1,1.5].forEach((ratio,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=55*ratio;o.detune.value=i===0?-5:i===1?6:-2;g.gain.value=i===2?.06:.18;o.connect(g);g.connect(droneLP);o.start();TSE_SCORE.drone.push(o);});
}
function tseScoreCreateBus(){
 if(TSE_SCORE.bus)return;TSE_SCORE.bus=AC.createGain();TSE_SCORE.bus.gain.value=.9;TSE_SCORE.bus.connect(musLP);TSE_SCORE.bassBus=AC.createGain();const drive=AC.createWaveShaper(),low=AC.createBiquadFilter(),curve=new Float32Array(1024);for(let i=0;i<curve.length;i++){const x=i/(curve.length-1)*2-1;curve[i]=Math.tanh(x*1.45)/Math.tanh(1.45);}drive.curve=curve;drive.oversample='2x';low.type='lowshelf';low.frequency.value=115;low.gain.value=3.2;TSE_SCORE.bassBus.gain.value=.82;TSE_SCORE.bassBus.connect(drive);drive.connect(low);low.connect(musLP);
}

musicLoop=function(){};startDrone=tseScoreStartDrone;audioScoreScheduler=function(){};
audioHarmonyRoot=function(){return tseScoreMidi(tseScoreProfile().tonic);};
const tseComposedInitAudio=initAudio;
initAudio=function(){tseComposedInitAudio();if(!AC)return;tseScoreCreateBus();tseScoreSetDrone(tseScoreProfile());if(!TSE_SCORE.timer)TSE_SCORE.timer=setInterval(tseScoreScheduler,42);};
const tseComposedApplyAudioSettings=applyAudioSettings;
applyAudioSettings=function(){tseComposedApplyAudioSettings();if(!AC)return;const now=AC.currentTime,music=save.music?clamp(save.musicVolume??.82,0,1):0,effects=save.sfx?clamp(save.sfxVolume??.86,0,1):0;sfxDry.gain.setTargetAtTime(.58*effects,now,.1);sfxSend.gain.setTargetAtTime(.27*effects,now,.1);musDry.gain.setTargetAtTime(.32*music,now,.14);musSend.gain.setTargetAtTime(.34*music,now,.18);if(droneG)droneG.gain.setTargetAtTime(.14*music,now,.4);};

globalThis.TheSeventhEmberScore={version:3,title:TSE_SCORE.title,state:TSE_SCORE,profiles:TSE_SCORE_REGIONS,region:tseScoreRegion,schedule:tseScoreScheduler};
document.documentElement.dataset.audioScore='falling-light-v3';
