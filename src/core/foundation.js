'use strict';
const T = id => document.getElementById(id);
const clamp = (v,a,b)=> v<a?a : v>b?b : v;
const lerp  = (a,b,t)=> a+(b-a)*t;
const rand  = (a,b)=> a+Math.random()*(b-a);
const irand = (a,b)=> Math.floor(rand(a,b+1));
const chance= p => Math.random()<p;
const pickA = arr => arr[Math.floor(Math.random()*arr.length)];
const TAU = Math.PI*2;
const d2 = (x1,y1,x2,y2)=>{const dx=x2-x1,dy=y2-y1;return dx*dx+dy*dy;};
const fmt = v => v>=10000 ? (v/1000).toFixed(1)+'k' : Math.floor(v);
const on = (el,ev,fn)=>{
  if(!el)return false;
  el.addEventListener(ev,fn);
  return true;
};
const refreshIcons = ()=> offlineIcons();
const show = id => T(id).classList.add('open');
const hide = id => T(id).classList.remove('open');

const SAVE_KEY='the_seventh_ember_save_v1';
const SAVE_PROGRESSION_EPOCH=2;
const DEF_SAVE = ()=>({v:1, progressionEpoch:SAVE_PROGRESSION_EPOCH, essence:0, nodes:{}, bestFloor:0, bestLevel:0, totalRuns:0, totalKills:0, totalEssence:0, victories:0, guardians:0, tut:0, music:1, sfx:1, musicVolume:.82, sfxVolume:.86, motion:0, touch:0, quality:"full", runTimer:0, runSeed:'', resume:null});
let save = DEF_SAVE();
let saveDirty=false, saveTimer=0;
function loadSave(){
  try{const raw=localStorage.getItem(SAVE_KEY);if(raw){const p=JSON.parse(raw),r=p.resume;save=validateSave({...p,resume:null});if(r){try{save.resume=validateCheckpoint(r);}catch(e){storageMessage='The unfinished run could not be restored. Your permanent progress is safe.';}}}}
  catch(e){storageMessage='Saved progress could not be loaded. You can import a backup in Settings.';}
}
function saveNow(){ snapshotRun(); try{ localStorage.setItem(SAVE_KEY, JSON.stringify(save)); saveDirty=false; storageMessage=''; }catch(e){ storageMessage='Automatic saving is unavailable. Export a save to keep your progress.'; } syncSaveStatus(); }
function markSave(){ saveDirty=true; }

const TREE_NODES=[
 {id:'awaken', L:'A', x:620, y:470, r:24, cost:5,  req:null,      name:'Awakening',      desc:'Open your eyes in the dark. +5% damage, +10 max HP.'},
 {id:'m1',L:'M',x:770,y:470,cost:8, req:'awaken',name:'Might I',   desc:'+8% damage.'},
 {id:'m2',L:'M',x:875,y:470,cost:18,req:'m1',    name:'Might II',  desc:'+8% damage.'},
 {id:'m3',L:'M',x:980,y:470,cost:32,req:'m2',    name:'Might III', desc:'+8% damage.'},
 {id:'m4',L:'M',x:1085,y:470,cost:56,req:'m3',   name:'Might IV',  desc:'+8% damage.'},
 {id:'m5',L:'M',x:1190,y:470,cost:88,req:'m4',   name:'Might V',   desc:'+8% damage.'},
 {id:'v1',L:'V',x:470,y:470,cost:8, req:'awaken',name:'Vitality I',  desc:'+15 max HP.'},
 {id:'v2',L:'V',x:365,y:470,cost:18,req:'v1',    name:'Vitality II', desc:'+15 max HP.'},
 {id:'v3',L:'V',x:260,y:470,cost:32,req:'v2',    name:'Vitality III',desc:'+15 max HP.'},
 {id:'v4',L:'V',x:155,y:470,cost:56,req:'v3',    name:'Vitality IV', desc:'+15 max HP.'},
 {id:'v5',L:'V',x:60, y:470,cost:88,req:'v4',    name:'Vitality V',  desc:'+15 max HP.'},
 {id:'f1',L:'F',x:620,y:330,cost:10,req:'awaken',name:'Focus I',   desc:'+6% casting rate.'},
 {id:'f2',L:'F',x:620,y:230,cost:22,req:'f1',    name:'Focus II',  desc:'+6% casting rate.'},
 {id:'f3',L:'F',x:620,y:135,cost:40,req:'f2',    name:'Focus III', desc:'+6% casting rate.'},
 {id:'f4',L:'F',x:620,y:58, cost:64,req:'f3',    name:'Focus IV',  desc:'+6% casting rate.'},
 {id:'g1',L:'L',x:620,y:610,cost:10,req:'awaken',name:'Lodestone I',  desc:'+18% pickup radius.'},
 {id:'g2',L:'L',x:620,y:710,cost:22,req:'g1',    name:'Lodestone II', desc:'+18% pickup radius.'},
 {id:'g3',L:'L',x:620,y:810,cost:40,req:'g2',    name:'Lodestone III',desc:'+18% pickup radius.'},
 {id:'c1',L:'C',x:715,y:375,cost:14,req:'awaken',name:'Arcane Eye I',  desc:'+3% critical chance.'},
 {id:'c2',L:'C',x:786,y:304,cost:30,req:'c1',    name:'Arcane Eye II', desc:'+3% critical chance.'},
 {id:'c3',L:'C',x:853,y:237,cost:54,req:'c2',    name:'Arcane Eye III',desc:'+3% critical chance.'},
 {id:'s1',L:'S',x:525,y:375,cost:10,req:'awaken',name:'Celerity I',   desc:'+4% move speed.'},
 {id:'s2',L:'S',x:454,y:304,cost:22,req:'s1',    name:'Celerity II',  desc:'+4% move speed.'},
 {id:'s3',L:'S',x:387,y:237,cost:40,req:'s2',    name:'Celerity III', desc:'+4% move speed.'},
 {id:'s4',L:'S',x:325,y:175,cost:64,req:'s3',    name:'Celerity IV',  desc:'+4% move speed.'},
 {id:'d1',L:'P',x:715,y:565,cost:14,req:'awaken',name:'Phantom Step I',  desc:'−8% dash cooldown.'},
 {id:'d2',L:'P',x:786,y:636,cost:30,req:'d1',    name:'Phantom Step II', desc:'−8% dash cooldown.'},
 {id:'d3',L:'P',x:853,y:703,cost:54,req:'d2',    name:'Phantom Step III',desc:'−8% dash cooldown.'},
 {id:'a1',L:'G',x:525,y:565,cost:10,req:'awaken',name:'Greed I',     desc:'+10% XP gained.'},
 {id:'a2',L:'G',x:454,y:636,cost:22,req:'a1',    name:'Fortune I',   desc:'+12% essence gained.'},
 {id:'a3',L:'G',x:387,y:703,cost:44,req:'a2',    name:'Greed II',    desc:'+10% XP gained.'},
 {id:'a4',L:'G',x:325,y:766,cost:70,req:'a3',    name:'Fortune II',  desc:'+15% essence gained.'},
 {id:'wind',L:'+',x:460,y:740,r:30,cost:140,req:'awaken',name:'SECOND WIND',desc:'Once per run, refuse death — revive at 50% HP in a burst of embers.'}
];
const NODE_BY_ID={}; TREE_NODES.forEach(n=>NODE_BY_ID[n.id]=n);
function nodeState(n){
  if(save.nodes[n.id]) return 2;
  if(n.req && !save.nodes[n.req]) return 0;
  return save.essence>=n.cost ? 3 : 1;
}
function computeMeta(){
  const n=save.nodes;
  let m={dmg:1, hp:0, rate:1, speed:1, crit:0, mag:1, dash:1, xp:1, ess:1, revive:false};
  if(n.awaken){m.dmg+=.05; m.hp+=10;}
  ['m1','m2','m3','m4','m5'].forEach(id=>{if(n[id])m.dmg+=.08;});
  ['v1','v2','v3','v4','v5'].forEach(id=>{if(n[id])m.hp+=15;});
  ['f1','f2','f3','f4'].forEach(id=>{if(n[id])m.rate+=.06;});
  ['s1','s2','s3','s4'].forEach(id=>{if(n[id])m.speed+=.04;});
  ['c1','c2','c3'].forEach(id=>{if(n[id])m.crit+=.03;});
  ['g1','g2','g3'].forEach(id=>{if(n[id])m.mag+=.18;});
  ['d1','d2','d3'].forEach(id=>{if(n[id])m.dash*=.92;});
  if(n.a1)m.xp+=.10; if(n.a2)m.ess+=.12; if(n.a3)m.xp+=.10; if(n.a4)m.ess+=.15;
  if(n.wind)m.revive=true;
  return m;
}
let META = computeMeta();

let AC=null, masterG=null, sfxDry=null, sfxSend=null, musDry=null, musSend=null,
    noiseBuf=null, revNode=null, musLP=null, musicInt=0, droneG=null, droneLP=null;
function makeIR(dur,decay){
  const rate=AC.sampleRate, len=Math.max(1,Math.floor(rate*dur));
  const buf=AC.createBuffer(2,len,rate);
  for(let ch=0;ch<2;ch++){
    const d=buf.getChannelData(ch);
    let lp=0;
    for(let i=0;i<len;i++){
      const t=i/len;
      const n=(Math.random()*2-1)*Math.pow(1-t,decay);
      lp=lp*0.72+n*0.28;
      d[i]=lp*(1-t*0.15);
    }
  }
  return buf;
}
function initAudio(){
  if(AC) { if(AC.state==='suspended') AC.resume().catch(()=>{}); return; }
  try{
    AC=new (window.AudioContext||window.webkitAudioContext)();
    const comp=AC.createDynamicsCompressor();
    comp.threshold.value=-16; comp.knee.value=26; comp.ratio.value=2.6;
    comp.attack.value=.02; comp.release.value=.34;
    masterG=AC.createGain(); masterG.gain.value=.9;
    comp.connect(masterG); masterG.connect(AC.destination);
    revNode=AC.createConvolver(); revNode.buffer=makeIR(4.2,2.6);
    const revLP=AC.createBiquadFilter(); revLP.type='lowpass'; revLP.frequency.value=2600;
    const revGain=AC.createGain(); revGain.gain.value=.9;
    revNode.connect(revLP); revLP.connect(revGain); revGain.connect(comp);
    sfxDry=AC.createGain(); sfxDry.gain.value=.5;  sfxDry.connect(comp);
    sfxSend=AC.createGain(); sfxSend.gain.value=.3; sfxSend.connect(revNode);
    musLP=AC.createBiquadFilter(); musLP.type='lowpass'; musLP.frequency.value=900; musLP.Q.value=.4;
    musDry=AC.createGain(); musDry.gain.value=.34; musLP.connect(musDry); musDry.connect(comp);
    musSend=AC.createGain(); musSend.gain.value=.55; musLP.connect(musSend); musSend.connect(revNode);
    const len=AC.sampleRate*2; noiseBuf=AC.createBuffer(1,len,AC.sampleRate);
    const d=noiseBuf.getChannelData(0);
    let last=0;
    for(let i=0;i<len;i++){ const w=Math.random()*2-1; last=last*.34+w*.66; d[i]=last; }
    startDrone();
    musicLoop();
  }catch(e){ AC=null; }
}
function bell(f,dur,vol,delay,warm){
  if(!AC) return; const t0=AC.currentTime+(delay||0);
  const parts=warm?[[1,1],[2.01,.28],[2.98,.10]]:[[1,1],[2.02,.42],[3.01,.2],[4.23,.08]];
  for(const [mul,amp] of parts){
    const o=AC.createOscillator(), g=AC.createGain();
    o.type='sine'; o.frequency.value=Math.max(20,f*mul);
    const v=vol*amp, dd=dur*(1-(mul-1)*0.14);
    g.gain.setValueAtTime(0,t0);
    g.gain.linearRampToValueAtTime(v,t0+.018);
    g.gain.exponentialRampToValueAtTime(.00008,t0+Math.max(.08,dd));
    o.connect(g); g.connect(sfxDry); g.connect(sfxSend);
    o.start(t0); o.stop(t0+dur+.15);
  }
}
function air(dur,vol,f0,f1,q,delay,type){
  if(!AC) return; const t0=AC.currentTime+(delay||0);
  const s=AC.createBufferSource(); s.buffer=noiseBuf; s.loop=true;
  const bp=AC.createBiquadFilter(); bp.type=type||'bandpass';
  bp.frequency.setValueAtTime(Math.max(30,f0),t0);
  bp.frequency.exponentialRampToValueAtTime(Math.max(30,f1||f0),t0+dur);
  bp.Q.value=q||.8;
  const g=AC.createGain();
  g.gain.setValueAtTime(0,t0);
  g.gain.linearRampToValueAtTime(vol,t0+Math.min(.05,dur*.3));
  g.gain.exponentialRampToValueAtTime(.00008,t0+dur);
  s.connect(bp); bp.connect(g); g.connect(sfxDry); g.connect(sfxSend);
  s.start(t0); s.stop(t0+dur+.1);
}
function thump(f0,f1,dur,vol,delay){
  if(!AC) return; const t0=AC.currentTime+(delay||0);
  const o=AC.createOscillator(), g=AC.createGain();
  o.type='sine'; o.frequency.setValueAtTime(Math.max(20,f0),t0);
  o.frequency.exponentialRampToValueAtTime(Math.max(18,f1),t0+dur);
  g.gain.setValueAtTime(0,t0);
  g.gain.linearRampToValueAtTime(vol,t0+.012);
  g.gain.exponentialRampToValueAtTime(.00008,t0+dur);
  o.connect(g); g.connect(sfxDry); g.connect(sfxSend);
  o.start(t0); o.stop(t0+dur+.1);
}
function swell(freqs,dur,vol,delay){
  if(!AC) return; const t0=AC.currentTime+(delay||0);
  const lp=AC.createBiquadFilter(); lp.type='lowpass';
  lp.frequency.setValueAtTime(500,t0);
  lp.frequency.linearRampToValueAtTime(2100,t0+dur*.45);
  lp.frequency.linearRampToValueAtTime(700,t0+dur);
  lp.connect(sfxDry); lp.connect(sfxSend);
  freqs.forEach((f,i)=>{
    [-4,4].forEach(det=>{
      const o=AC.createOscillator(), g=AC.createGain();
      o.type= i%2 ? 'sine' : 'triangle';
      o.frequency.value=f; o.detune.value=det;
      g.gain.setValueAtTime(0,t0);
      g.gain.linearRampToValueAtTime(vol,t0+dur*.22);
      g.gain.linearRampToValueAtTime(vol*.7,t0+dur*.55);
      g.gain.linearRampToValueAtTime(0,t0+dur);
      o.connect(g); g.connect(lp); o.start(t0); o.stop(t0+dur+.2);
    });
  });
}
let xpCombo=0, xpComboT=0;
const PENT=[261.63,293.66,349.23,392.00,440.00,523.25,587.33,698.46];
function sfx(name,a){
  if(!AC||!save.sfx) return;
  switch(name){
    case 'shoot': air(.13,.05,1500,420,.7,0); thump(190,95,.10,.045); break;
    case 'hit':   air(.07,.05,780,300,1.1,0,'lowpass'); thump(165,78,.09,.06); break;
    case 'die':   air(.34,.055,900,150,.7,0,'lowpass'); thump(150,52,.26,.06); break;
    case 'hurt':  air(.34,.075,520,120,.6,0,'lowpass'); thump(120,48,.38,.13); break;
    case 'xp':    { const f=PENT[Math.min(xpCombo,PENT.length-1)]*2; bell(f,.5,.038,0,false); xpCombo++; xpComboT=1.1; break; }
    case 'ess':   bell(1046.5,.85,.042,0,false); bell(1568,.5,.018,.02,false); break;
    case 'heart': bell(392,.9,.05,0,true); bell(587.33,.7,.026,.05,true); break;
    case 'levelup': swell([261.63,329.63,392,523.25],2.0,.052,0); bell(1046.5,1.4,.03,.18,false); air(.9,.012,4200,1800,.5,.1); break;
    case 'dash':  air(.30,.06,380,2400,.9,0); air(.22,.03,2200,500,1.1,.05); break;
    case 'portal':swell([98,146.83,196,293.66],2.6,.06,0); [392,523.25,659.25,784].forEach((f,i)=>bell(f,1.5,.032,.25+i*.13,true)); break;
    case 'chest': air(.10,.05,420,180,1.4,0,'lowpass'); thump(150,88,.14,.05); bell(659.25,1.0,.03,.09,true); bell(987.77,.8,.02,.15,true); break;
    case 'ui':    air(.05,.022,2400,1300,1.2,0); break;
    case 'deny':  thump(110,72,.22,.055); air(.14,.02,300,160,.9,0,'lowpass'); break;
    case 'buy':   bell(523.25,1.1,.045,0,true); bell(784,.9,.03,.07,true); air(.5,.012,3600,1600,.6,.05); break;
    case 'boss':  swell([41.2,61.74,82.41],3.2,.10,0); air(1.8,.05,220,70,.5,0,'lowpass'); break;
    case 'roar2': air(.7,.06,340,90,.6,0,'lowpass'); thump(96,44,.7,.09); break;
    case 'nova':  thump(220,48,.5,.11); air(.5,.05,1400,300,.7,0,'lowpass'); break;
    case 'death': swell([220,164.81,130.81],3.4,.055,0); [329.63,261.63,196,146.83].forEach((f,i)=>bell(f,2.2,.032,i*.42,true)); break;
    case 'victory':swell([261.63,392,523.25,659.25],3.0,.055,0); [523.25,659.25,784,1046.5].forEach((f,i)=>bell(f,1.8,.034,i*.16,true)); break;
    case 'eshoot':air(.12,.028,900,320,.9,0); break;
    case 'charge':air(.55,.05,180,1500,.8,0); thump(70,150,.5,.045); break;
  }
}
const CHORDS=[
  [55,82.41,130.81,164.81],
  [49,73.42,116.54,146.83],
  [43.65,65.41,103.83,130.81],
  [48.99,73.42,123.47,146.83]
];
const MEL=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];
let chordI=0, padT=0, melT=6, breathT=9;
function startDrone(){
  droneLP=AC.createBiquadFilter(); droneLP.type='lowpass'; droneLP.frequency.value=220; droneLP.Q.value=.6;
  droneG=AC.createGain(); droneG.gain.value=0;
  droneLP.connect(droneG); droneG.connect(musLP);
  [55,55.2,82.41].forEach((f,i)=>{
    const o=AC.createOscillator(), g=AC.createGain();
    o.type='sine'; o.frequency.value=f; o.detune.value=i===1?7:-5;
    g.gain.value=(i===2 ? .10 : .22);
    o.connect(g); g.connect(droneLP); o.start();
  });
  const lfo=AC.createOscillator(), lg=AC.createGain();
  lfo.type='sine'; lfo.frequency.value=.055; lg.gain.value=.05;
  lfo.connect(lg); lg.connect(droneG.gain); lfo.start();
}
function padChord(fs){
  const t0=AC.currentTime, dur=13;
  const lp=AC.createBiquadFilter(); lp.type='lowpass';
  lp.frequency.setValueAtTime(420+musicInt*280,t0);
  lp.frequency.linearRampToValueAtTime(760+musicInt*900,t0+dur*.45);
  lp.frequency.linearRampToValueAtTime(430+musicInt*260,t0+dur);
  lp.Q.value=.5; lp.connect(musLP);
  fs.forEach((f,i)=>{
    [-6,6].forEach(det=>{
      const o=AC.createOscillator(), g=AC.createGain();
      o.type= i<2 ? 'sine' : 'triangle';
      o.frequency.value=f; o.detune.value=det;
      const v=(i<2 ? .05 : .028)*(1-musicInt*.15);
      g.gain.setValueAtTime(0,t0);
      g.gain.linearRampToValueAtTime(v,t0+4.5);
      g.gain.linearRampToValueAtTime(v*.85,t0+dur*.7);
      g.gain.linearRampToValueAtTime(0,t0+dur);
      o.connect(g); g.connect(lp);
      o.start(t0); o.stop(t0+dur+.4);
    });
  });
}
function musicLoop(){
  if(!AC) return;
  setInterval(()=>{
    if(!AC) return;
    const want = save.music ? (0.32+musicInt*0.34) : 0;
    musDry.gain.setTargetAtTime(want*.62, AC.currentTime, 1.2);
    musSend.gain.setTargetAtTime(want*.9, AC.currentTime, 1.2);
    if(droneG) droneG.gain.setTargetAtTime(save.music?(.5+musicInt*.5):0, AC.currentTime, 2.0);
    if(musLP) musLP.frequency.setTargetAtTime(760+musicInt*1500, AC.currentTime, 1.5);
    if(!save.music||document.hidden||AC.state!=='running'||G.state==='ending') return;
    padT-=0.5; melT-=0.5; breathT-=0.5;
    if(padT<=0){ padChord(CHORDS[chordI%CHORDS.length]); chordI++; padT=10.5; }
    if(melT<=0){
      melT = 5.5+Math.random()*7 - musicInt*2.2;
      if(chance(.55+musicInt*.2)){
        const f=pickA(MEL)*(chance(.35) ? .5 : 1);
        const t0=AC.currentTime;
        [[1,1],[2.01,.3],[3.02,.12]].forEach(([mul,amp])=>{
          const o=AC.createOscillator(), g=AC.createGain();
          o.type='sine'; o.frequency.value=f*mul;
          g.gain.setValueAtTime(0,t0);
          g.gain.linearRampToValueAtTime(.026*amp,t0+.25);
          g.gain.exponentialRampToValueAtTime(.00008,t0+3.2);
          o.connect(g); g.connect(musLP); o.start(t0); o.stop(t0+3.4);
        });
      }
    }
    if(breathT<=0){
      breathT=7+Math.random()*9;
      const t0=AC.currentTime, dur=5+Math.random()*4;
      const s=AC.createBufferSource(); s.buffer=noiseBuf; s.loop=true;
      const bp=AC.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=.55;
      bp.frequency.setValueAtTime(260,t0);
      bp.frequency.linearRampToValueAtTime(520,t0+dur*.5);
      bp.frequency.linearRampToValueAtTime(240,t0+dur);
      const g=AC.createGain();
      g.gain.setValueAtTime(0,t0);
      g.gain.linearRampToValueAtTime(.012+musicInt*.012,t0+dur*.45);
      g.gain.linearRampToValueAtTime(0,t0+dur);
      s.connect(bp); bp.connect(g); g.connect(musLP);
      s.start(t0); s.stop(t0+dur+.2);
    }
  },500);
}
