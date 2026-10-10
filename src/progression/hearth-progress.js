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
  ['ember', 'Hearthgold', '#ffc76c', '#fff1c6'],
  ['rime', 'Rimeglass', '#a7e7eb', '#ecffff'],
  ['rose', 'Rose Ash', '#e7a19b', '#ffe7d1'],
  ['moss', 'Gardenlight', '#b3c684', '#f1edb0'],
  ['copper', 'Copperwake', '#df9d65', '#ffddb0'],
  ['moon', 'Moonwater', '#c2c4f5', '#f4f0ff'],
  ['amethyst', 'Amethyst Dust', '#b5a0df', '#ece1ff'],
  ['pearl', 'Pearl Fire', '#d8daca', '#ffffff'],
  ['crimson', 'Red Comet', '#ee765c', '#ffd9a0'],
  ['opal', 'Opal Thread', '#88c9b9', '#fcf0c8'],
  ['silver', 'Silverfall', '#b9c8d8', '#f4faff'],
  ['dawn', 'Seventh Dawn', '#f4c459', '#fffdf0'],
].map(([id, name, color, light]) => ({ id, name, color, light }));
const HEARTH_DECOR = [
  ['oak', 'Old Oak', 'floor'],
  ['slate', 'Cut Slate', 'floor'],
  ['mosaic', 'Star Mosaic', 'floor'],
  ['dawnstone', 'Dawnstone', 'floor'],
  ['linen', 'Faded Linen', 'banner'],
  ['roots', 'Rootwork', 'banner'],
  ['mooncloth', 'Mooncloth', 'banner'],
  ['suncloth', 'Seventh Sun', 'banner'],
  ['candle', 'Copper Candles', 'lights'],
  ['bellglass', 'Bellglass', 'lights'],
  ['orchard', 'Orchard Lanterns', 'lights'],
  ['stars', 'Captive Stars', 'lights'],
  ['herbs', 'Drying Herbs', 'shelf'],
  ['books', 'Kept Pages', 'shelf'],
  ['bottles', 'Moonwater Vials', 'shelf'],
  ['gears', 'Foundry Clock', 'shelf'],
  ['plain', 'Woven Runner', 'rug'],
  ['garden', 'Garden Weave', 'rug'],
  ['constellation', 'Constellation Rug', 'rug'],
  ['royal', 'Court Tapestry', 'rug'],
  ['night', 'Rain at Midnight', 'window'],
  ['rain', 'Garden Rain', 'window'],
  ['snow', 'Quiet Snow', 'window'],
  ['sunrise', 'First Dawn', 'window'],
].map(([id, name, slot]) => ({ id, name, slot }));
const HEARTH_MUSIC = [
  ['13_Before_the_First_Bell', 'Before the First Bell'],
  ['25_A_House_Remembered', 'A House Remembered'],
  ['26_Dust_in_the_Sunlight', 'Dust in the Sunlight'],
  ['14_Roots_Under_Rain', 'Roots Under Rain'],
  ['28_Keep_the_Flame', 'Keep the Flame'],
  ['24_No_Refunds_After_Dawn', 'No Refunds After Dawn'],
];
let hearthRevision = 0,
  hearthDirty = false,
  hearthSaveClock = 0;
function cleanHearth(raw) {
  const h = {
    version: 2,
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
  for (const combo of BLESSING_COMBOS)
    for (const kind of ['discover', 'mastery', 'floors', 'guardians']) {
      const id = combo.id + ':' + kind,
        n = raw.progress?.[id];
      if (Number.isFinite(n) && n > 0) h.progress[id] = Math.min(1000000, Math.floor(n));
      if (raw.completed?.[id] === true) h.completed[id] = true;
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
  for (const slot of Object.keys(h.layout)) {
    const d = HEARTH_DECOR.find((d) => d.slot === slot && d.id === raw.layout?.[slot]);
    if (d) h.layout[slot] = d.id;
  }
  for (const key of ['trail', 'shards']) {
    const p = HEARTH_PALETTES.find((p) => p.id === raw[key]);
    if (p) h[key] = p.id;
  }
  if (HEARTH_MUSIC.some((m) => m[0] === raw.music)) h.music = raw.music;
  return h;
}
function hearthData() {
  if (save.hearth?.version !== 2) save.hearth = cleanHearth(save.hearth);
  return save.hearth;
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
function hearthRecordGuardian(key) {
  if (!hearthRunEligible() || !GUARDIAN_ROSTER.some((g) => g.key === key)) return;
  const t = hearthRunTrack();
  if (t.guardians.includes(key + ':' + G.floor)) return;
  t.guardians.push(key + ':' + G.floor);
  t.guardians = t.guardians.slice(-100);
  const h = hearthData(),
    vows = t.vows || [];
  for (const id of vows) {
    h.vowSeals[id] = h.vowSeals[id] || {};
    h.vowSeals[id][key] = true;
  }
  if (key === 'keeper' && G.floor === 50) {
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
const hearthSetupFloor = setupFloor;
setupFloor = function (f) {
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
const hearthTick = hollowTick;
hollowTick = function (dt) {
  hearthTick(dt);
  hearthSaveClock -= dt;
  if (hearthDirty && hearthSaveClock <= 0) {
    hearthSaveClock = 4;
    hearthDirty = false;
    saveNow('hearth');
  }
};
