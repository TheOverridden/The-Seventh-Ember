'use strict';

const REWARD_TONICS=Object.freeze({title:33,hollow:33,garden:38,reservoir:31,foundry:34,observatory:35,archive:33,court:36,choir:38,citadel:32,heart:33});
let lastRewardPickup=0;

function rewardToneRoot(){
 const region=!G.run?'title':G.world?.region==='late'?(G.world.lateKey||'heart'):G.floor<=5?'hollow':'garden';
 return 440*Math.pow(2,((REWARD_TONICS[region]??33)-69)/12);
}

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

function masteredSound(name){
  const root=rewardToneRoot();
  if(name==='xp'){
    const now=AC.currentTime;if(now-lastRewardPickup<.025)return true;lastRewardPickup=now;
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
