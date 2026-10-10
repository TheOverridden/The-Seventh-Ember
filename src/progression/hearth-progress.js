const COMBO_MASTERY = {
  thermalShock: [16, 'Release 16 Thermal Shock blasts.'],
  shatter: [16, 'Shatter chilled enemies with Flare 16 times.'],
  stormfront: [18, 'Trigger 18 frost-and-lightning chains.'],
  cinderwheel: [40, 'Ignite enemies with orbiting cinders 40 times.'],
  collapsedSun: [24, 'Release 24 fire pulses from Black Stars.'],
  echoChamber: [36, 'Fire 36 repeated ricocheting Bolts.'],
  icebreaker: [24, 'Release 24 icicle splash bursts.'],
  glacier: [24, 'Create 24 frost patches with icicle hits.'],
  whiteout: [18, 'Release 18 seeking icicle fans.'],
  stormglass: [30, 'Freeze or chill 30 targets with conductors.'],
  forkedStorm: [20, 'Strike three targets in one conductor pulse 20 times.'],
  ballLightning: [30, 'Land 30 hits from orbiting conductors.'],
  thunderquake: [30, 'Land 30 lightning hits from fissures.'],
  magmaFault: [40, 'Land 40 hits from molten fissure patches.'],
  rupture: [18, 'Open 18 triple fissures.'],
  tidalBore: [30, 'Strike 30 targets with enlarged waves.'],
  permafrost: [30, 'Freeze or chill 30 targets with waves.'],
  undertow: [30, 'Land 30 returning-wave hits.'],
  bloodMoon: [18, 'Release 18 critical crescent razor bursts.'],
  moonwake: [24, 'Release 24 pairs of crossing crescents.'],
  eclipse: [24, 'Transform 24 crescents inside Black Stars.'],
  sawfire: [30, 'Launch 30 burning blades from halo contacts.'],
  gearstorm: [24, 'Release 24 halos as ricocheting blades.'],
  iceHalo: [30, 'Freeze or chill 30 targets with ice blades.'],
  meteorSwarm: [24, 'Call 24 meteor swarms.'],
  impactCrater: [24, 'Leave 24 craters after meteor impacts.'],
  extinction: [24, 'Release 24 enlarged main meteors.'],
  mothlight: [24, 'Complete 24 ward-bearing moth flocks.'],
  cinderMoths: [30, 'Land 30 moth dive attacks.'],
  soulLantern: [18, 'Release 18 elite-triggered lantern bursts.'],
  prismChoir: [36, 'Land 36 crystalline echo lance hits.'],
  starforge: [24, 'Pin survivors with meteor impacts 24 times.'],
  stormstep: [30, 'Land 30 lightning hits at the end of a dash.'],
  trailOfGlass: [24, 'Release 24 icicle fans at the end of a dash.'],
  hearthguard: [24, 'Summon 24 protective moths with Flare.'],
  cageOfStars: [30, 'Pin 30 conductor targets into Starstitch.'],
};
const HEARTH_CHALLENGES = BLESSING_COMBOS.flatMap((c) => [
  {
    id: c.id + ':discover',
    combo: c.id,
    kind: 'discover',
    target: 1,
    name: c.name,
    ds: 'Hold both ingredients together in a descent.',
  },
  {
    id: c.id + ':mastery',
    combo: c.id,
    kind: 'mastery',
    target: COMBO_MASTERY[c.id][0],
    name: c.name + ' · Practice',
    ds: COMBO_MASTERY[c.id][1],
  },
  {
    id: c.id + ':floors',
    combo: c.id,
    kind: 'floors',
    target: 5,
    name: c.name + ' · The Long Way',
    ds: 'Finish five floors with this combination active. Progress carries between descents.',
  },
  {
    id: c.id + ':guardians',
    combo: c.id,
    kind: 'guardians',
    target: 3,
    name: c.name + ' · Three Bells',
    ds: 'Defeat three Guardians with this combination active. Progress carries between descents.',
  },
]);
const HEARTH_VOWS = [
  {
    id: 'heart',
    name: 'Frail Heart',
    mark: 'I',
    ds: 'Maximum health is capped at 60. Healing still works.',
    short: '60 HP CAP',
  },
  {
    id: 'bolt',
    name: 'Dimmed Bolt',
    mark: 'II',
    ds: 'Direct Ember Bolt hits deal 40% less damage. Flare and triggered abilities retain their power.',
    short: '−40% BOLT',
  },
  {
    id: 'reserve',
    name: 'Narrow Well',
    mark: 'III',
    ds: 'Hold at most three charges before Rekindling. Charge refunds and free-cast blessings still work.',
    short: '3 CHARGES',
  },
  {
    id: 'step',
    name: 'Heavy Step',
    mark: 'IV',
    ds: 'Dash recovery cannot fall below 3.2 seconds. Dash distance and invulnerability are unchanged.',
    short: '3.2s DASH',
  },
  {
    id: 'iron',
    name: 'Brittle Ash',
    mark: 'V',
    ds: 'Incoming damage increases by 50%. Armor and normal hit protection still apply.',
    short: '+50% DAMAGE',
  },
  {
    id: 'ward',
    name: 'Bare Flame',
    mark: 'VI',
    ds: 'Temporary health wards cannot form or absorb damage. Healing and dash invulnerability still work.',
    short: 'NO WARDS',
  },
];
const HEARTH_PALETTES = [
  ['ember', 'Hearthgold', '#ffc76c', '#fff1c6', 0],
  ['rime', 'Rimeglass', '#a7e7eb', '#ecffff', 6],
  ['rose', 'Rose Ash', '#e7a19b', '#ffe7d1', 12],
  ['moss', 'Gardenlight', '#b3c684', '#f1edb0', 20],
  ['copper', 'Copperwake', '#df9d65', '#ffddb0', 30],
  ['moon', 'Moonwater', '#c2c4f5', '#f4f0ff', 42],
  ['amethyst', 'Amethyst Dust', '#b5a0df', '#ece1ff', 54],
  ['pearl', 'Pearl Fire', '#d8daca', '#ffffff', 68],
  ['crimson', 'Red Comet', '#ee765c', '#ffd9a0', 84],
  ['opal', 'Opal Thread', '#88c9b9', '#fcf0c8', 100],
  ['silver', 'Silverfall', '#b9c8d8', '#f4faff', 118],
  ['dawn', 'Seventh Dawn', '#f4c459', '#fffdf0', 144],
].map(([id, name, color, light, need]) => ({ id, name, color, light, need }));
const HEARTH_DECOR = [
  ['oak', 'Old Oak', 'floor', 0],
  ['slate', 'Cut Slate', 'floor', 18],
  ['mosaic', 'Star Mosaic', 'floor', 60],
  ['dawnstone', 'Dawnstone', 'floor', 120],
  ['linen', 'Faded Linen', 'banner', 0],
  ['roots', 'Rootwork', 'banner', 12],
  ['mooncloth', 'Mooncloth', 'banner', 42],
  ['suncloth', 'Seventh Sun', 'banner', 100],
  ['candle', 'Copper Candles', 'lights', 0],
  ['bellglass', 'Bellglass', 'lights', 24],
  ['orchard', 'Orchard Lanterns', 'lights', 54],
  ['stars', 'Captive Stars', 'lights', 118],
  ['herbs', 'Drying Herbs', 'shelf', 0],
  ['books', 'Kept Pages', 'shelf', 20],
  ['bottles', 'Moonwater Vials', 'shelf', 68],
  ['gears', 'Foundry Clock', 'shelf', 84],
  ['plain', 'Woven Runner', 'rug', 0],
  ['garden', 'Garden Weave', 'rug', 30],
  ['constellation', 'Constellation Rug', 'rug', 76],
  ['royal', 'Court Tapestry', 'rug', 132],
  ['night', 'Rain at Midnight', 'window', 0],
  ['rain', 'Garden Rain', 'window', 36],
  ['snow', 'Quiet Snow', 'window', 90],
  ['sunrise', 'First Dawn', 'window', 144],
].map(([id, name, slot, need]) => ({ id, name, slot, need }));
const HEARTH_MUSIC = [
  ['13_Before_the_First_Bell', 'Before the First Bell'],
  ['25_A_House_Remembered', 'A House Remembered'],
  ['26_Dust_in_the_Sunlight', 'Dust in the Sunlight'],
  ['14_Roots_Under_Rain', 'Roots Under Rain'],
  ['28_Keep_the_Flame', 'Keep the Flame'],
  ['24_No_Refunds_After_Dawn', 'No Refunds After Dawn'],
];
const HEARTH_CHALLENGE_BY_ID = Object.fromEntries(HEARTH_CHALLENGES.map((c) => [c.id, c]));
let hearthRevision = 0,
  hearthDirty = false,
  hearthSaveClock = 0;
function cleanHearth(raw) {
  const h = {
    version: 1,
    progress: {},
    completed: {},
    vowSeals: {},
    crowns: [],
    selectedVows: [],
    trail: 'ember',
    shards: 'ember',
    music: HEARTH_MUSIC[0][0],
    layout: {
      floor: 'oak',
      banner: 'linen',
      lights: 'candle',
      shelf: 'herbs',
      rug: 'plain',
      window: 'night',
    },
    tracked: '',
  };
  if (!raw || typeof raw !== 'object') return h;
  for (const c of HEARTH_CHALLENGES) {
    const n = raw.progress?.[c.id];
    if (Number.isFinite(n) && n > 0) h.progress[c.id] = Math.min(c.target, Math.floor(n));
    if (h.progress[c.id] >= c.target) h.completed[c.id] = true;
  }
  for (const v of HEARTH_VOWS) {
    h.vowSeals[v.id] = {};
    for (const g of GUARDIAN_ROSTER)
      if (raw.vowSeals?.[v.id]?.[g.key] === true) h.vowSeals[v.id][g.key] = true;
  }
  h.crowns = Array.isArray(raw.crowns)
    ? [...new Set(raw.crowns.filter((n) => Number.isInteger(n) && n > 0 && n < 64))]
    : [];
  h.selectedVows = Array.isArray(raw.selectedVows)
    ? HEARTH_VOWS.filter((v) => raw.selectedVows.includes(v.id)).map((v) => v.id)
    : [];
  const count = Object.keys(h.completed).length;
  for (const slot of Object.keys(h.layout)) {
    const d = HEARTH_DECOR.find((d) => d.slot === slot && d.id === raw.layout?.[slot]);
    if (d && count >= d.need) h.layout[slot] = d.id;
  }
  for (const key of ['trail', 'shards']) {
    const p = HEARTH_PALETTES.find((p) => p.id === raw[key]);
    if (p && count >= p.need) h[key] = p.id;
  }
  if (HEARTH_MUSIC.some((m) => m[0] === raw.music)) h.music = raw.music;
  if (HEARTH_CHALLENGE_BY_ID[raw.tracked] && !h.completed[raw.tracked]) h.tracked = raw.tracked;
  return h;
}
function hearthData() {
  if (save.hearth?.version !== 1) save.hearth = cleanHearth(save.hearth);
  return save.hearth;
}
function hearthCount() {
  return Object.keys(hearthData().completed).length;
}
function hearthVowsUnlocked() {
  return !!(
    save.campaignMedal ||
    save.victories ||
    achievementData().guardians.length ||
    Object.values(save.guardianRecords || {}).some((r) => r.standard?.wins || r.ascendant?.wins)
  );
}
function hearthRunEligible() {
  return !!(G.run && !G.run.guardianMode && !G.dead);
}
function hearthRunTrack() {
  if (!G.run) return null;
  const t = G.run.hearthTrack || (G.run.hearthTrack = { floor: G.floor, guardians: [], vows: [] });
  if (!Array.isArray(t.guardians)) t.guardians = [];
  return t;
}
function hearthAdvance(id, n = 1) {
  const c = HEARTH_CHALLENGE_BY_ID[id];
  if (!c || !hearthRunEligible()) return;
  const h = hearthData(),
    old = h.progress[id] || 0;
  if (old >= c.target) return;
  h.progress[id] = Math.min(c.target, old + n);
  hearthRevision++;
  hearthDirty = true;
  if (h.progress[id] >= c.target) {
    h.completed[id] = true;
    if (h.tracked === id) h.tracked = '';
    if (typeof buildAnnounce === 'function') buildAnnounce('Challenge complete · ' + c.name);
  }
}
function comboTrialEvent(id, n = 1) {
  if (hearthRunEligible() && blessingComboActive(id)) hearthAdvance(id + ':mastery', n);
}
function hearthDiscover() {
  if (!hearthRunEligible()) return;
  for (const c of BLESSING_COMBOS) if (blessingComboActive(c.id)) hearthAdvance(c.id + ':discover');
}
function hearthFinishFloor(f) {
  const t = hearthRunTrack();
  if (!hearthRunEligible() || f <= (t.lastFinished || 0)) return;
  t.lastFinished = f;
  hearthDiscover();
  for (const c of BLESSING_COMBOS) if (blessingComboActive(c.id)) hearthAdvance(c.id + ':floors');
}
function hearthRecordGuardian(key) {
  if (!hearthRunEligible() || !GUARDIAN_ROSTER.some((g) => g.key === key)) return;
  const t = hearthRunTrack();
  if (t.guardians.includes(key + ':' + G.floor)) return;
  t.guardians.push(key + ':' + G.floor);
  t.guardians = t.guardians.slice(-100);
  for (const c of BLESSING_COMBOS)
    if (blessingComboActive(c.id)) hearthAdvance(c.id + ':guardians');
  const h = hearthData(),
    vows = t.vows || [];
  for (const id of vows) {
    h.vowSeals[id] = h.vowSeals[id] || {};
    h.vowSeals[id][key] = true;
  }
  if (key === 'keeper' && G.floor === 50) {
    hearthFinishFloor(50);
    if (vows.length) {
      const mask = HEARTH_VOWS.reduce((n, v, i) => n | (vows.includes(v.id) ? 1 << i : 0), 0);
      if (!h.crowns.includes(mask)) h.crowns.push(mask);
    }
  }
  hearthRevision++;
  hearthDirty = true;
}
const hearthValidateSave = validateSave;
validateSave = function (raw) {
  const out = hearthValidateSave(raw);
  out.hearth = cleanHearth(raw?.hearth);
  return out;
};
const hearthValidateCheckpoint = validateCheckpoint;
validateCheckpoint = function (raw) {
  const out = hearthValidateCheckpoint(raw),
    t = out.run.hearthTrack;
  if (t) {
    out.run.hearthTrack = {
      floor: out.floor,
      lastFinished: Number.isInteger(t.lastFinished) ? clamp(t.lastFinished, 0, out.floor) : 0,
      guardians: Array.isArray(t.guardians)
        ? t.guardians.filter((k) => typeof k === 'string' && k.length < 40).slice(-100)
        : [],
      vows: Array.isArray(t.vows)
        ? HEARTH_VOWS.filter((v) => t.vows.includes(v.id)).map((v) => v.id)
        : [],
    };
  }
  return out;
};
const hearthChooseCard = chooseCard;
chooseCard = function (i) {
  const out = hearthChooseCard(i);
  hearthDiscover();
  return out;
};
const hearthSetupFloor = setupFloor;
setupFloor = function (f) {
  if (hearthRunEligible() && G.world && f === G.floor + 1) hearthFinishFloor(G.floor);
  const out = hearthSetupFloor(f);
  if (G.run) hearthRunTrack().floor = f;
  return out;
};
const hearthKillBoss = killBoss;
killBoss = function (b) {
  const other =
      b?.bossKey === 'regents' &&
      G.enemies.some((e) => e !== b && !e.dead && e.bossKey === 'regents'),
    key = b?.warden ? 'warden' : b?.matriarch ? 'matriarch' : b?.bossKey;
  if (b?.dead && !other) hearthRecordGuardian(key);
  return hearthKillBoss(b);
};
const hearthDamageEnemy = damageEnemy;
damageEnemy = function (e, damage, a, crit, kb, kind = 'shot') {
  const hp = e?.hp,
    out = hearthDamageEnemy(e, damage, a, crit, kb, kind);
  if (e && e.hp < hp) {
    const id = { magmaFault: 'magmaFault', cinderMoths: 'cinderMoths', prismChoir: 'prismChoir' }[
      kind
    ];
    if (id) comboTrialEvent(id);
    if (kind === 'orbital' && e.burnT > 0) comboTrialEvent('cinderwheel');
  }
  return out;
};
const hearthBlessingEffect = blessingEffect;
blessingEffect = function (f) {
  if (['thermalShock', 'shatter', 'collapsedSun', 'icebreaker', 'soulLantern'].includes(f.type))
    comboTrialEvent(f.type);
  return hearthBlessingEffect(f);
};
const hearthTick = hollowTick;
hollowTick = function (dt) {
  hearthTick(dt);
  if (G.state === 'playing') hearthDiscover();
  hearthSaveClock -= dt;
  if (hearthDirty && hearthSaveClock <= 0) {
    hearthSaveClock = 4;
    hearthDirty = false;
    saveNow('hearth');
  }
};
