const REGION_GROOVE={
  hollow:{bpm:76,pattern:[0,null,7,12,3,null,7,null,0,12,7,null,3,7,12,null],motif:[0,3,7,10]},
  garden:{bpm:80,pattern:[0,7,12,null,3,7,10,null,0,12,10,7,3,null,7,12],motif:[0,2,5,7,9]},
  reservoir:{bpm:74,pattern:[0,null,12,7,3,null,10,7,0,7,12,null,3,10,7,null],motif:[0,2,3,7,9]},
  foundry:{bpm:86,pattern:[0,0,7,null,3,3,12,7,0,0,10,null,7,3,12,7],motif:[0,3,5,6,10]},
  observatory:{bpm:72,pattern:[0,null,12,7,null,3,10,null,0,7,14,null,12,10,7,null],motif:[0,2,6,7,11]},
  archive:{bpm:70,pattern:[0,null,7,3,12,null,10,null,0,3,7,null,10,7,3,null],motif:[0,1,5,7,8]},
  court:{bpm:82,pattern:[0,7,null,12,3,10,null,7,0,12,null,10,7,3,12,null],motif:[0,3,5,8,10]},
  choir:{bpm:78,pattern:[0,null,12,10,7,null,3,7,0,7,12,15,10,null,7,null],motif:[0,2,5,9,11]},
  citadel:{bpm:88,pattern:[0,0,null,7,3,3,null,10,0,7,12,7,3,null,10,7],motif:[0,1,5,6,10]},
  heart:{bpm:84,pattern:[0,7,12,15,10,7,3,null,0,12,10,7,15,12,7,null],motif:[0,3,7,8,11]}
};
const AUDIO_SCORE={timer:0,next:0,step:0,key:'',lastPickup:0};

function audioRegion(){return G.world?.region==='late'?(G.world.lateKey||'heart'):G.floor<=5?'hollow':'garden';}
function audioHarmonyRoot(){const i=chordI>0?(chordI-1)%CHORDS.length:0;return CHORDS[i][0];}
function audioScoreActive(){return AC&&save.music&&AC.state==='running'&&!document.hidden&&G.run&&['playing','dialogue','chapter'].includes(G.state);}

function warmFxTone(freq,dur=.32,vol=.025,delay=0,cutoff=920){
  if(!AC||!save.sfx)return;
  const t=AC.currentTime+delay,lp=AC.createBiquadFilter(),amp=AC.createGain(),body=AC.createOscillator(),grain=AC.createOscillator(),grainG=AC.createGain();
  lp.type='lowpass';lp.Q.value=.72;lp.frequency.setValueAtTime(Math.max(180,cutoff*.72),t);lp.frequency.exponentialRampToValueAtTime(Math.max(120,cutoff*.34),t+dur);
  amp.gain.setValueAtTime(.0001,t);amp.gain.exponentialRampToValueAtTime(vol,t+.018);amp.gain.exponentialRampToValueAtTime(.0001,t+dur);
  body.type='sine';body.frequency.setValueAtTime(freq*1.012,t);body.frequency.exponentialRampToValueAtTime(freq,t+.055);
  grain.type='triangle';grain.frequency.value=freq*2;grain.detune.value=-4;grainG.gain.value=.13;
  body.connect(lp);grain.connect(grainG);grainG.connect(lp);lp.connect(amp);amp.connect(sfxDry);amp.connect(sfxSend);
  body.start(t);grain.start(t);body.stop(t+dur+.04);grain.stop(t+dur+.04);
}
function audioRewardChord(freqs,dur,vol){freqs.forEach((f,i)=>warmFxTone(f,dur,vol*(i?0.7:1),i*.035,760+i*90));}
function audioBass(freq,when,accent,boss){
  if(!AC||!musLP)return;
  const dur=boss?.29:.42,lp=AC.createBiquadFilter(),amp=AC.createGain(),sub=AC.createOscillator(),body=AC.createOscillator(),bodyG=AC.createGain(),v=(boss?.052:.036)*accent;
  lp.type='lowpass';lp.Q.value=boss?1.05:.72;lp.frequency.setValueAtTime(boss?430:330,when);lp.frequency.exponentialRampToValueAtTime(boss?135:105,when+dur);
  amp.gain.setValueAtTime(.0001,when);amp.gain.exponentialRampToValueAtTime(v,when+.025);amp.gain.setValueAtTime(v*.72,when+dur*.48);amp.gain.exponentialRampToValueAtTime(.0001,when+dur);
  sub.type='sine';sub.frequency.setValueAtTime(freq*1.018,when);sub.frequency.exponentialRampToValueAtTime(freq,when+.07);
  body.type='triangle';body.frequency.value=freq*2;body.detune.value=-6;bodyG.gain.value=.11;
  sub.connect(lp);body.connect(bodyG);bodyG.connect(lp);lp.connect(amp);amp.connect(musLP);
  sub.start(when);body.start(when);sub.stop(when+dur+.05);body.stop(when+dur+.05);
}
function audioKick(when,power=1){
  if(!AC||!musLP)return;const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(74,when);o.frequency.exponentialRampToValueAtTime(38,when+.16);g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(.035*power,when+.012);g.gain.exponentialRampToValueAtTime(.0001,when+.2);o.connect(g);g.connect(musLP);o.start(when);o.stop(when+.23);
}
function audioMist(freq,when,dur=2.6){
  if(!AC||!musLP)return;const lp=AC.createBiquadFilter(),g=AC.createGain();lp.type='lowpass';lp.frequency.value=720;lp.Q.value=.4;g.gain.setValueAtTime(0,when);g.gain.linearRampToValueAtTime(.006,when+.45);g.gain.exponentialRampToValueAtTime(.0001,when+dur);
  for(const det of [-7,7]){const o=AC.createOscillator();o.type='sine';o.frequency.value=freq;o.detune.value=det;o.connect(lp);o.start(when);o.stop(when+dur+.1);}lp.connect(g);g.connect(musLP);
}
function audioScoreScheduler(){
  if(!audioScoreActive()){AUDIO_SCORE.next=0;return;}
  const key=audioRegion(),cfg=REGION_GROOVE[key]||REGION_GROOVE.hollow,boss=!!G.bossActive,now=AC.currentTime;
  if(AUDIO_SCORE.key!==key){AUDIO_SCORE.key=key;AUDIO_SCORE.step=0;AUDIO_SCORE.next=now+.08;}
  if(!AUDIO_SCORE.next||AUDIO_SCORE.next<now-.2)AUDIO_SCORE.next=now+.06;
  let guard=0;
  while(AUDIO_SCORE.next<now+.22&&guard++<5){
    const step=AUDIO_SCORE.step++,offset=cfg.pattern[step%cfg.pattern.length],root=audioHarmonyRoot(),pressure=clamp(globalThis.TheSeventhEmberCombatMix?.intensity||0,0,1),beat=60/(cfg.bpm+(boss?12:Math.round(pressure*10)))/2;
    if(offset!==null)audioBass(root*Math.pow(2,offset/12),AUDIO_SCORE.next,(step%8===0?1.18:1)*(1+pressure*.1),boss);
    if((boss&&step%4===0)||(!boss&&pressure>.62&&step%8===0))audioKick(AUDIO_SCORE.next,boss?(step%8===0?1.15:.82):.48+pressure*.25);
    if(step%16===6||step%16===14){const m=cfg.motif[(Math.floor(step/8)+G.floor)%cfg.motif.length];audioMist(root*4*Math.pow(2,m/12),AUDIO_SCORE.next+.02,boss?1.45:2.7);}
    AUDIO_SCORE.next+=beat;
  }
}

scorePulse=function(){};
const masteredInitAudio=initAudio;
initAudio=function(){masteredInitAudio();if(AC&&!AUDIO_SCORE.timer)AUDIO_SCORE.timer=setInterval(audioScoreScheduler,55);};
const masteredApplyAudio=applyAudioSettings;
applyAudioSettings=function(){masteredApplyAudio();if(!AC)return;const t=AC.currentTime;if(sfxDry)sfxDry.gain.setTargetAtTime(save.sfx?.58:0,t,.1);if(sfxSend)sfxSend.gain.setTargetAtTime(save.sfx?.28:0,t,.1);if(musDry)musDry.gain.setTargetAtTime(save.music?.27:0,t,.12);if(musSend)musSend.gain.setTargetAtTime(save.music?.38:0,t,.12);if(droneG)droneG.gain.setTargetAtTime(save.music?.42:0,t,.2);};

function masteredSound(name){
  const root=audioHarmonyRoot();
  if(name==='xp'){
    const now=AC.currentTime;if(now-AUDIO_SCORE.lastPickup<.025)return true;AUDIO_SCORE.lastPickup=now;
    const notes=[0,2,3,5,7,10,12],n=notes[Math.min(xpCombo,notes.length-1)],f=root*4*Math.pow(2,n/12);
    warmFxTone(f,.22,.021,0,720);air(.055,.008,620,210,.6,0,'lowpass');xpCombo++;xpComboT=1.1;return true;
  }
  if(name==='ess'){warmFxTone(root*4,.38,.025,0,780);warmFxTone(root*6,.46,.014,.045,980);air(.18,.012,900,260,.55,0,'lowpass');return true;}
  if(name==='heart'){warmFxTone(174.61,.42,.03,0,620);warmFxTone(220,.5,.02,.1,700);thump(92,58,.25,.035);return true;}
  if(name==='levelup'){swell([root*2,root*3,root*4,root*6],2.2,.046,0);audioRewardChord([root*4,root*5,root*6],1.25,.022);air(.9,.018,1800,520,.55,.08);return true;}
  if(name==='portal'){swell([root,root*1.5,root*2,root*3],2.7,.055,0);audioRewardChord([root*4,root*5,root*7],1.7,.019);air(1.2,.025,280,1450,.5,0);return true;}
  if(name==='chest'){thump(145,76,.17,.055);air(.12,.032,390,160,1.2,0,'lowpass');audioRewardChord([220,277.18,329.63],.85,.018);return true;}
  if(name==='buy'){audioRewardChord([196,246.94,293.66],.7,.022);air(.24,.012,950,340,.7,0,'lowpass');return true;}
  if(name==='brazier'){swell([98,146.83,196,293.66],1.9,.044,0);warmFxTone(392,.9,.016,.12,900);air(1.25,.035,310,1250,.5);return true;}
  if(name==='mythic'||name==='mythicClaim'||name==='mythicReveal'){thump(84,38,.55,.075);swell([55,82.41,110,164.81,220,329.63],2.25,.048,0);audioRewardChord([220,277.18,329.63,440],1.5,.019);return true;}
  if(name==='victory'){swell([root*2,root*3,root*4,root*5,root*6],3.2,.052,0);audioRewardChord([261.63,329.63,392,523.25],1.7,.021);air(1.4,.02,1500,380,.5,.1);return true;}
  if(name==='death'){swell([196,146.83,110,82.41],3.5,.052,0);warmFxTone(130.81,1.5,.024,.18,440);air(1.1,.022,420,90,.5,0,'lowpass');return true;}
  if(name==='boss'){thump(68,31,.7,.1);swell([41.2,61.74,82.41,123.47],3.1,.065,0);air(1.7,.04,190,62,.5,0,'lowpass');return true;}
  if(name==='shoot'){air(.12,.042,1250,330,.7,0);thump(176,82,.095,.038);return true;}
  if(name==='hit'||name==='feelBoltImpact'){air(.075,.044,690,220,1,0,'lowpass');thump(154,68,.085,.05);return true;}
  if(name==='die'||name==='feelBreak'||name==='break'){air(.34,.052,790,105,.7,0,'lowpass');thump(145,39,.31,.066);return true;}
  if(name==='hurt'){air(.36,.067,440,92,.6,0,'lowpass');thump(112,42,.39,.105);return true;}
  if(name==='dash'){air(.29,.052,330,1900,.85,0);air(.2,.021,1500,420,1,.045);thump(185,82,.09,.018);return true;}
  if(name==='flare'||name==='feelFlareImpact'){air(.28,.073,330,2200,.8);thump(180,62,.23,.072);warmFxTone(392,.28,.013,.025,840);return true;}
  if(name==='feelReload'){warmFxTone(329.63,.24,.017,0,720);warmFxTone(493.88,.2,.009,.04,820);return true;}
  if(name==='eshoot'){air(.13,.024,720,250,.9,0);thump(105,61,.08,.018);return true;}
  if(name==='charge'){air(.55,.045,170,1350,.8,0);thump(66,138,.48,.04);return true;}
  if(name==='roar2'){air(.72,.055,300,72,.6,0,'lowpass');thump(88,36,.72,.078);return true;}
  if(name==='nova'){thump(210,42,.52,.105);air(.55,.045,1200,230,.7,0,'lowpass');return true;}
  if(name==='comet'){air(.42,.065,1700,210,.7);thump(220,48,.4,.09);return true;}
  if(name==='shield'){warmFxTone(293.66,.42,.021,0,720);air(.19,.022,1100,380,.75);return true;}
  if(name==='roomSeal'){thump(96,43,.42,.075);air(.55,.035,520,120,.6,0,'lowpass');return true;}
  if(name==='roomWave'){thump(130,64,.18,.038);air(.15,.025,740,240,.75,0,'lowpass');return true;}
  if(name==='roomClear'){swell([110,164.81,220,277.18],1.4,.038,0);audioRewardChord([220,277.18,329.63],.8,.015);return true;}
  return false;
}
const unmasteredSfx=sfx;
sfx=function(name,a){if(!AC||!save.sfx)return;if(masteredSound(name))return;unmasteredSfx(name,a);};

globalThis.TheSeventhEmberAudio={version:2,region:audioRegion,grooves:Object.keys(REGION_GROOVE)};
document.documentElement.dataset.audioScore='rolling-v2';
