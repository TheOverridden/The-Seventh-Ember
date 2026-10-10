'use strict';
const T = (id) => document.getElementById(id);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const irand = (a, b) => Math.floor(rand(a, b + 1));
const chance = (p) => Math.random() < p;
const pickA = (arr) => arr[Math.floor(Math.random() * arr.length)];
const TAU = Math.PI * 2;
const d2 = (x1, y1, x2, y2) => {
  const dx = x2 - x1,
    dy = y2 - y1;
  return dx * dx + dy * dy;
};
const fmt = (v) => (v >= 10000 ? (v / 1000).toFixed(1) + 'k' : Math.floor(v));
const on = (el, ev, fn) => {
  if (!el) return false;
  el.addEventListener(ev, fn);
  return true;
};
const refreshIcons = () => offlineIcons();
const show = (id) => T(id).classList.add('open');
const hide = (id) => T(id).classList.remove('open');

const SAVE_KEY = 'the_seventh_ember_save_v1';
const SAVE_PROGRESSION_EPOCH = 2;
const DEF_SAVE = () => ({
  v: 1,
  progressionEpoch: SAVE_PROGRESSION_EPOCH,
  essence: 0,
  nodes: {},
  bestFloor: 0,
  bestLevel: 0,
  totalRuns: 0,
  totalKills: 0,
  totalEssence: 0,
  victories: 0,
  guardians: 0,
  tut: 0,
  music: 1,
  sfx: 1,
  musicVolume: 0.82,
  sfxVolume: 0.86,
  motion: 0,
  touch: 0,
  quality: 'full',
  runTimer: 0,
  runSeed: '',
  resume: null,
});
let save = DEF_SAVE();
let saveTimer = 0;

const TREE_NODES = [
  {
    id: 'awaken',
    L: 'A',
    x: 620,
    y: 470,
    r: 24,
    cost: 5,
    req: null,
    name: 'Awakening',
    desc: 'Open your eyes in the dark. +5% damage, +10 max HP.',
  },
  {
    id: 'm1',
    L: 'M',
    x: 770,
    y: 470,
    cost: 8,
    req: 'awaken',
    name: 'Might I',
    desc: '+8% damage.',
  },
  { id: 'm2', L: 'M', x: 875, y: 470, cost: 18, req: 'm1', name: 'Might II', desc: '+8% damage.' },
  { id: 'm3', L: 'M', x: 980, y: 470, cost: 32, req: 'm2', name: 'Might III', desc: '+8% damage.' },
  { id: 'm4', L: 'M', x: 1085, y: 470, cost: 56, req: 'm3', name: 'Might IV', desc: '+8% damage.' },
  { id: 'm5', L: 'M', x: 1190, y: 470, cost: 88, req: 'm4', name: 'Might V', desc: '+8% damage.' },
  {
    id: 'v1',
    L: 'V',
    x: 470,
    y: 470,
    cost: 8,
    req: 'awaken',
    name: 'Vitality I',
    desc: '+15 max HP.',
  },
  {
    id: 'v2',
    L: 'V',
    x: 365,
    y: 470,
    cost: 18,
    req: 'v1',
    name: 'Vitality II',
    desc: '+15 max HP.',
  },
  {
    id: 'v3',
    L: 'V',
    x: 260,
    y: 470,
    cost: 32,
    req: 'v2',
    name: 'Vitality III',
    desc: '+15 max HP.',
  },
  {
    id: 'v4',
    L: 'V',
    x: 155,
    y: 470,
    cost: 56,
    req: 'v3',
    name: 'Vitality IV',
    desc: '+15 max HP.',
  },
  { id: 'v5', L: 'V', x: 60, y: 470, cost: 88, req: 'v4', name: 'Vitality V', desc: '+15 max HP.' },
  {
    id: 'f1',
    L: 'F',
    x: 620,
    y: 330,
    cost: 10,
    req: 'awaken',
    name: 'Focus I',
    desc: '+6% casting rate.',
  },
  {
    id: 'f2',
    L: 'F',
    x: 620,
    y: 230,
    cost: 22,
    req: 'f1',
    name: 'Focus II',
    desc: '+6% casting rate.',
  },
  {
    id: 'f3',
    L: 'F',
    x: 620,
    y: 135,
    cost: 40,
    req: 'f2',
    name: 'Focus III',
    desc: '+6% casting rate.',
  },
  {
    id: 'f4',
    L: 'F',
    x: 620,
    y: 58,
    cost: 64,
    req: 'f3',
    name: 'Focus IV',
    desc: '+6% casting rate.',
  },
  {
    id: 'g1',
    L: 'L',
    x: 620,
    y: 610,
    cost: 10,
    req: 'awaken',
    name: 'Lodestone I',
    desc: '+18% pickup radius.',
  },
  {
    id: 'g2',
    L: 'L',
    x: 620,
    y: 710,
    cost: 22,
    req: 'g1',
    name: 'Lodestone II',
    desc: '+18% pickup radius.',
  },
  {
    id: 'g3',
    L: 'L',
    x: 620,
    y: 810,
    cost: 40,
    req: 'g2',
    name: 'Lodestone III',
    desc: '+18% pickup radius.',
  },
  {
    id: 'c1',
    L: 'C',
    x: 715,
    y: 375,
    cost: 14,
    req: 'awaken',
    name: 'Arcane Eye I',
    desc: '+3% critical chance.',
  },
  {
    id: 'c2',
    L: 'C',
    x: 786,
    y: 304,
    cost: 30,
    req: 'c1',
    name: 'Arcane Eye II',
    desc: '+3% critical chance.',
  },
  {
    id: 'c3',
    L: 'C',
    x: 853,
    y: 237,
    cost: 54,
    req: 'c2',
    name: 'Arcane Eye III',
    desc: '+3% critical chance.',
  },
  {
    id: 's1',
    L: 'S',
    x: 525,
    y: 375,
    cost: 10,
    req: 'awaken',
    name: 'Celerity I',
    desc: '+4% move speed.',
  },
  {
    id: 's2',
    L: 'S',
    x: 454,
    y: 304,
    cost: 22,
    req: 's1',
    name: 'Celerity II',
    desc: '+4% move speed.',
  },
  {
    id: 's3',
    L: 'S',
    x: 387,
    y: 237,
    cost: 40,
    req: 's2',
    name: 'Celerity III',
    desc: '+4% move speed.',
  },
  {
    id: 's4',
    L: 'S',
    x: 325,
    y: 175,
    cost: 64,
    req: 's3',
    name: 'Celerity IV',
    desc: '+4% move speed.',
  },
  {
    id: 'd1',
    L: 'P',
    x: 715,
    y: 565,
    cost: 14,
    req: 'awaken',
    name: 'Phantom Step I',
    desc: '−8% dash cooldown.',
  },
  {
    id: 'd2',
    L: 'P',
    x: 786,
    y: 636,
    cost: 30,
    req: 'd1',
    name: 'Phantom Step II',
    desc: '−8% dash cooldown.',
  },
  {
    id: 'd3',
    L: 'P',
    x: 853,
    y: 703,
    cost: 54,
    req: 'd2',
    name: 'Phantom Step III',
    desc: '−8% dash cooldown.',
  },
  {
    id: 'a1',
    L: 'G',
    x: 525,
    y: 565,
    cost: 10,
    req: 'awaken',
    name: 'Greed I',
    desc: '+10% XP gained.',
  },
  {
    id: 'a2',
    L: 'G',
    x: 454,
    y: 636,
    cost: 22,
    req: 'a1',
    name: 'Fortune I',
    desc: '+12% essence gained.',
  },
  {
    id: 'a3',
    L: 'G',
    x: 387,
    y: 703,
    cost: 44,
    req: 'a2',
    name: 'Greed II',
    desc: '+10% XP gained.',
  },
  {
    id: 'a4',
    L: 'G',
    x: 325,
    y: 766,
    cost: 70,
    req: 'a3',
    name: 'Fortune II',
    desc: '+15% essence gained.',
  },
  {
    id: 'wind',
    L: '+',
    x: 460,
    y: 740,
    r: 30,
    cost: 140,
    req: 'awaken',
    name: 'SECOND WIND',
    desc: 'Once per run, refuse death — revive at 50% HP in a burst of embers.',
  },
];
const NODE_BY_ID = {};
TREE_NODES.forEach((n) => (NODE_BY_ID[n.id] = n));
function nodeState(n) {
  if (save.nodes[n.id]) return 2;
  if (n.req && !save.nodes[n.req]) return 0;
  return save.essence >= n.cost ? 3 : 1;
}
function computeMeta() {
  const n = save.nodes;
  let m = {
    dmg: 1,
    hp: 0,
    rate: 1,
    speed: 1,
    crit: 0,
    mag: 1,
    dash: 1,
    xp: 1,
    ess: 1,
    revive: false,
  };
  if (n.awaken) {
    m.dmg += 0.05;
    m.hp += 10;
  }
  ['m1', 'm2', 'm3', 'm4', 'm5'].forEach((id) => {
    if (n[id]) m.dmg += 0.08;
  });
  ['v1', 'v2', 'v3', 'v4', 'v5'].forEach((id) => {
    if (n[id]) m.hp += 15;
  });
  ['f1', 'f2', 'f3', 'f4'].forEach((id) => {
    if (n[id]) m.rate += 0.06;
  });
  ['s1', 's2', 's3', 's4'].forEach((id) => {
    if (n[id]) m.speed += 0.04;
  });
  ['c1', 'c2', 'c3'].forEach((id) => {
    if (n[id]) m.crit += 0.03;
  });
  ['g1', 'g2', 'g3'].forEach((id) => {
    if (n[id]) m.mag += 0.18;
  });
  ['d1', 'd2', 'd3'].forEach((id) => {
    if (n[id]) m.dash *= 0.92;
  });
  if (n.a1) m.xp += 0.1;
  if (n.a2) m.ess += 0.12;
  if (n.a3) m.xp += 0.1;
  if (n.a4) m.ess += 0.15;
  if (n.wind) m.revive = true;
  return m;
}
let META = computeMeta();

let AC = null,
  masterG = null,
  sfxDry = null,
  sfxSend = null,
  musDry = null,
  noiseBuf = null,
  revNode = null,
  musLP = null;
function makeIR(dur, decay) {
  const rate = AC.sampleRate,
    len = Math.max(1, Math.floor(rate * dur));
  const buf = AC.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const t = i / len;
      const n = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
      lp = lp * 0.72 + n * 0.28;
      d[i] = lp * (1 - t * 0.15);
    }
  }
  return buf;
}
function initAudio() {
  if (AC) {
    if (AC.state === 'suspended') AC.resume().catch(() => {});
    return;
  }
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    const comp = AC.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 26;
    comp.ratio.value = 2.6;
    comp.attack.value = 0.02;
    comp.release.value = 0.34;
    masterG = AC.createGain();
    masterG.gain.value = 0.9;
    comp.connect(masterG);
    masterG.connect(AC.destination);
    revNode = AC.createConvolver();
    revNode.buffer = makeIR(4.2, 2.6);
    const revLP = AC.createBiquadFilter();
    revLP.type = 'lowpass';
    revLP.frequency.value = 2600;
    const revGain = AC.createGain();
    revGain.gain.value = 0.9;
    revNode.connect(revLP);
    revLP.connect(revGain);
    revGain.connect(comp);
    sfxDry = AC.createGain();
    sfxDry.gain.value = 0.5;
    sfxDry.connect(comp);
    sfxSend = AC.createGain();
    sfxSend.gain.value = 0.3;
    sfxSend.connect(revNode);
    musLP = AC.createBiquadFilter();
    musLP.type = 'lowpass';
    musLP.frequency.value = 900;
    musLP.Q.value = 0.4;
    musDry = AC.createGain();
    musDry.gain.value = 0.34;
    musLP.connect(musDry);
    musDry.connect(comp);
    const len = AC.sampleRate * 2;
    noiseBuf = AC.createBuffer(1, len, AC.sampleRate);
    const d = noiseBuf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = last * 0.34 + w * 0.66;
      d[i] = last;
    }
  } catch (e) {
    AC = null;
  }
}
function bell(f, dur, vol, delay, warm) {
  if (!AC) return;
  const t0 = AC.currentTime + (delay || 0);
  const parts = warm
    ? [
        [1, 1],
        [2.01, 0.28],
        [2.98, 0.1],
      ]
    : [
        [1, 1],
        [2.02, 0.42],
        [3.01, 0.2],
        [4.23, 0.08],
      ];
  for (const [mul, amp] of parts) {
    const o = AC.createOscillator(),
      g = AC.createGain();
    o.type = 'sine';
    o.frequency.value = Math.max(20, f * mul);
    const v = vol * amp,
      dd = dur * (1 - (mul - 1) * 0.14);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(v, t0 + 0.018);
    g.gain.exponentialRampToValueAtTime(0.00008, t0 + Math.max(0.08, dd));
    o.connect(g);
    g.connect(sfxDry);
    g.connect(sfxSend);
    o.start(t0);
    o.stop(t0 + dur + 0.15);
  }
}
function air(dur, vol, f0, f1, q, delay, type) {
  if (!AC) return;
  const t0 = AC.currentTime + (delay || 0);
  const s = AC.createBufferSource();
  s.buffer = noiseBuf;
  s.loop = true;
  const bp = AC.createBiquadFilter();
  bp.type = type || 'bandpass';
  bp.frequency.setValueAtTime(Math.max(30, f0), t0);
  bp.frequency.exponentialRampToValueAtTime(Math.max(30, f1 || f0), t0 + dur);
  bp.Q.value = q || 0.8;
  const g = AC.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + Math.min(0.05, dur * 0.3));
  g.gain.exponentialRampToValueAtTime(0.00008, t0 + dur);
  s.connect(bp);
  bp.connect(g);
  g.connect(sfxDry);
  g.connect(sfxSend);
  s.start(t0);
  s.stop(t0 + dur + 0.1);
}
function thump(f0, f1, dur, vol, delay) {
  if (!AC) return;
  const t0 = AC.currentTime + (delay || 0);
  const o = AC.createOscillator(),
    g = AC.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(Math.max(20, f0), t0);
  o.frequency.exponentialRampToValueAtTime(Math.max(18, f1), t0 + dur);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.00008, t0 + dur);
  o.connect(g);
  g.connect(sfxDry);
  g.connect(sfxSend);
  o.start(t0);
  o.stop(t0 + dur + 0.1);
}
function swell(freqs, dur, vol, delay) {
  if (!AC) return;
  const t0 = AC.currentTime + (delay || 0);
  const lp = AC.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(500, t0);
  lp.frequency.linearRampToValueAtTime(2100, t0 + dur * 0.45);
  lp.frequency.linearRampToValueAtTime(700, t0 + dur);
  lp.connect(sfxDry);
  lp.connect(sfxSend);
  freqs.forEach((f, i) => {
    [-4, 4].forEach((det) => {
      const o = AC.createOscillator(),
        g = AC.createGain();
      o.type = i % 2 ? 'sine' : 'triangle';
      o.frequency.value = f;
      o.detune.value = det;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(vol, t0 + dur * 0.22);
      g.gain.linearRampToValueAtTime(vol * 0.7, t0 + dur * 0.55);
      g.gain.linearRampToValueAtTime(0, t0 + dur);
      o.connect(g);
      g.connect(lp);
      o.start(t0);
      o.stop(t0 + dur + 0.2);
    });
  });
}
let xpCombo = 0,
  xpComboT = 0;

function sfx(name) {
  if (!AC || !save.sfx) return;
  switch (name) {
    case 'ui':
      air(0.05, 0.022, 2400, 1300, 1.2, 0);
      break;
    case 'deny':
      thump(110, 72, 0.22, 0.055);
      air(0.14, 0.02, 300, 160, 0.9, 0, 'lowpass');
      break;
  }
}
