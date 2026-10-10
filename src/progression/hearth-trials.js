const HEARTH_TRIAL_LEVELS = ['Kindling', 'Blaze', 'Inferno'];
const HEARTH_TRIALS = [
  {
    id: 'stitch',
    name: 'Starstitch Only',
    family: 'prism',
    rule: 'Bolt places pins; Flare collapses the threads. Only thread damage can hurt enemies.',
    detail:
      'Starstitch, longer threads, a quick pin cast, and Dash. Place pins across an enemy’s path.',
    rewards: [
      ['mosaic', 'books', 'constellation'],
      ['rime', 'amethyst'],
      ['rime', 'amethyst'],
    ],
  },
  {
    id: 'flare',
    name: 'Flare Only',
    family: 'fire',
    rule: 'Fight with Flare and Dash. Ember Bolt is disabled.',
    detail:
      'A wide Flare with faster recovery. Step into range, strike, and use the opening to move.',
    rewards: [
      ['dawnstone', 'suncloth', 'gears'],
      ['copper', 'crimson'],
      ['copper', 'crimson'],
    ],
  },
  {
    id: 'oneHeart',
    name: 'One Heart',
    family: 'soul',
    rule: 'Clear the encounter with 30 health and no healing.',
    detail: 'A steady Bolt, Flare, and Dash. No healing pickups or recovery between waves.',
    rewards: [
      ['mooncloth', 'bottles', 'snow'],
      ['rose', 'pearl'],
      ['rose', 'pearl'],
    ],
  },
  {
    id: 'defense',
    name: 'Hold the Hearth',
    family: 'fire',
    rule: 'Protect the central flame until every wave is defeated.',
    detail:
      'Bolt, Flare, and Dash. Watch the entrances: some enemies head for the flame instead of you.',
    rewards: [
      ['roots', 'orchard', 'garden'],
      ['moss', 'opal'],
      ['moss', 'opal'],
    ],
  },
  {
    id: 'constellation',
    name: 'Broken Constellation',
    family: 'prism',
    rule: 'Recover three fallen stars and clear the room.',
    detail: 'Starstitch threads and Dash. Collect all three stars while holding off the enemies.',
    rewards: [
      ['slate', 'bellglass', 'stars'],
      ['moon', 'silver'],
      ['moon', 'silver'],
    ],
  },
  {
    id: 'guardian',
    name: 'Guardian Trial',
    family: 'meteor',
    rule: 'Defeat the arena’s Guardian echo. Later tiers add new attack sequences.',
    detail:
      'A fixed Bolt and Flare build with Dash. The echo fights only here and grants no Archive credit.',
    rewards: [['royal', 'sunrise', 'rain'], ['dawn'], ['dawn']],
  },
].map(({ rewards, ...trial }) => ({
  ...trial,
  tiers: HEARTH_TRIAL_LEVELS.map((name, tier) => ({
    name,
    detail:
      trial.id === 'guardian'
        ? [
            'Charges, aimed volleys, and a radial burst. Below half health, the echo attacks faster.',
            'A turning beam joins the attack sequence. Dash through it, then use the recovery window.',
            'Faster beam sweeps, wider volleys, and shorter openings. The echo grows faster below half health.',
          ][tier]
        : [
            'Three waves · up to three enemies at once.',
            'Four waves · up to five enemies at once.',
            'Five waves · up to seven enemies at once.',
          ][tier] +
          (tier > 0 && ['oneHeart', 'constellation'].includes(trial.id)
            ? tier === 1
              ? ' Moving light sweeps cross the room. Dash through them.'
              : ' Light sweeps arrive more frequently. Watch both directions.'
            : ''),
    rewards: rewards[tier].map((id) => {
      const kind = tier === 0 ? 'decor' : tier === 1 ? 'trail' : 'shards',
        item = (kind === 'decor' ? HEARTH_DECOR : HEARTH_PALETTES).find((item) => item.id === id);
      return {
        kind,
        id,
        label: item.name + (kind === 'trail' ? ' trail' : kind === 'shards' ? ' shards' : ''),
      };
    }),
  })),
}));
const HEARTH_TRIAL_BY_ID = Object.fromEntries(HEARTH_TRIALS.map((trial) => [trial.id, trial]));
const HEARTH_COSMETIC_SOURCES = Object.fromEntries(
  HEARTH_TRIALS.flatMap((trial) =>
    trial.tiers.flatMap((tier, level) =>
      tier.rewards.map((reward) => [reward.kind + ':' + reward.id, { trial: trial.id, level }])
    )
  )
);
function cleanHearthTrials(raw) {
  const result = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;
  for (const trial of HEARTH_TRIALS)
    for (let tier = 0; tier < 3; tier++) {
      const id = trial.id + ':' + tier,
        record = raw[id];
      if (!record || !Number.isInteger(record.clears) || record.clears < 1) continue;
      result[id] = {
        clears: Math.min(1000000, record.clears),
        bestTime:
          Number.isFinite(record.bestTime) && record.bestTime > 0
            ? Math.min(86400, record.bestTime)
            : 0,
        bestHits:
          Number.isInteger(record.bestHits) && record.bestHits >= 0
            ? Math.min(1000000, record.bestHits)
            : null,
      };
    }
  return result;
}
function hearthTrialRecord(id, tier) {
  if (!HEARTH_TRIAL_BY_ID[id] || !Number.isInteger(tier) || tier < 0 || tier > 2) return null;
  return hearthData().trials[id + ':' + tier] || null;
}
function hearthTrialUnlocked(id, tier = 0) {
  return (
    !!HEARTH_TRIAL_BY_ID[id] &&
    Number.isInteger(tier) &&
    tier >= 0 &&
    tier <= 2 &&
    (tier === 0 || !!hearthTrialRecord(id, tier - 1)?.clears)
  );
}
function hearthCosmeticUnlocked(kind, id) {
  if (!['decor', 'trail', 'shards'].includes(kind)) return false;
  const list = kind === 'decor' ? HEARTH_DECOR : HEARTH_PALETTES;
  if (!list.some((item) => item.id === id)) return false;
  const key = kind + ':' + id,
    source = HEARTH_COSMETIC_SOURCES[key];
  return (
    !source ||
    hearthData().keptCosmetics.includes(key) ||
    !!hearthTrialRecord(source.trial, source.level)?.clears
  );
}
function hearthCosmeticSource(kind, id) {
  const source = HEARTH_COSMETIC_SOURCES[kind + ':' + id];
  if (!source) return '';
  return HEARTH_TRIAL_BY_ID[source.trial].name + ' · ' + HEARTH_TRIAL_LEVELS[source.level];
}
function hearthTrialRewardText(id, tier) {
  return (
    HEARTH_TRIAL_BY_ID[id]?.tiers[tier]?.rewards.map((reward) => reward.label).join(' · ') || ''
  );
}
function hearthAwardTrial(id, tier, seconds, hits) {
  if (
    !hearthTrialUnlocked(id, tier) ||
    !Number.isFinite(seconds) ||
    seconds <= 0 ||
    !Number.isInteger(hits) ||
    hits < 0
  )
    return null;
  const h = hearthData(),
    key = id + ':' + tier,
    old = h.trials[key],
    unlocked = HEARTH_TRIAL_BY_ID[id].tiers[tier].rewards.filter(
      (reward) => !hearthCosmeticUnlocked(reward.kind, reward.id)
    );
  h.trials[key] = {
    clears: Math.min(1000000, (old?.clears || 0) + 1),
    bestTime: old?.bestTime ? Math.min(old.bestTime, seconds) : seconds,
    bestHits:
      old?.bestHits === null || old?.bestHits === undefined ? hits : Math.min(old.bestHits, hits),
  };
  hearthRevision++;
  saveNow('hearth-trial-clear');
  return unlocked;
}
