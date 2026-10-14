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
    rule: 'Defeat the Crucible, the living forge that judges the Hearth’s challengers.',
    detail:
      'Bolt, Flare, and Dash. Break the Crucible’s furnace core between its attack sequences.',
    rewards: [['royal', 'sunrise', 'rain'], ['dawn'], ['dawn']],
  },
  {
    id: 'crossfire',
    name: 'Crossfire',
    family: 'storm',
    rule: 'Survive converging volleys with Ember Bolt. Flare is disabled.',
    detail: 'Bolt and Dash. Keep moving between the firing lines and make every reload count.',
    tierDetails: [
      'Paired marksmen fire from opposite approaches. Break one side before their volleys meet.',
      'More firing pairs and faster shots close the gaps. Choose a target while dodging both sides.',
      'Dense volleys overlap at close intervals. Constant movement and disciplined reloads are essential.',
    ],
  },
  {
    id: 'pursuit',
    name: 'The Pursuit',
    family: 'blade',
    rule: 'Outlast hunters and their ranged support without Dash.',
    detail:
      'Bolt and Flare. Dash is disabled; escape by moving, clearing a path, and timing Flare.',
    tierDetails: [
      'Fast hunters close in while ranged enemies cut off your retreat.',
      'Larger packs and quicker pursuit demand a clear escape route before every attack.',
      'Relentless hunters and dense ranged support punish dead ends. Keep an opening in the pack.',
    ],
  },
  {
    id: 'lastLight',
    name: 'The Last Light',
    family: 'moon',
    rule: 'Fight with limited health inside a moving light. Darkness burns, and the light shrinks each wave.',
    detail:
      'Bolt, Flare, and Dash. No healing. Follow the hearth light while holding back the wave.',
    tierDetails: [
      'The safe light moves across the arena and contracts after every wave.',
      'A tighter light and faster enemies make each crossing dangerous. Anticipate its next position.',
      'The smallest safe light leaves little room to dodge. Clear space before the next contraction.',
    ],
  },
  {
    id: 'relay',
    name: 'Ember Relay',
    family: 'prism',
    rule: 'Carry the ember to four beacons in order and hold each one while enemies attack.',
    detail:
      'Bolt, Flare, and Dash. Stay inside the active beacon to kindle it, then reach the next.',
    tierDetails: [
      'Four beacons must be kindled in sequence. Enemies pressure you during each hold.',
      'Longer beacon holds and stronger waves force you to defend each checkpoint.',
      'The longest holds face overwhelming waves. Secure the beacon while keeping a route to the next.',
    ],
  },
  {
    id: 'pressure',
    name: 'Under Pressure',
    family: 'stone',
    rule: 'Armored enemies resist damage until you attack at close range.',
    detail:
      'Bolt, Flare, and Dash. Step close to crack enemy armor, then attack before the pack surrounds you.',
    tierDetails: [
      'Distant attacks are heavily resisted. Fight near the enemy to deal full damage.',
      'Faster armored packs crowd the arena. Isolate a target and commit at close range.',
      'Dense armored waves leave few safe approaches. Chain close attacks and escape immediately.',
    ],
  },
  {
    id: 'glasshouse',
    name: 'The Glasshouse',
    family: 'prism',
    rule: 'Observatory volleys ricochet from the walls. A missed shot can return behind you.',
    detail:
      'Bolt, Flare, and Dash. Track reflected enemy projectiles as you move between firing lanes.',
    tierDetails: [
      'Reflected Observatory shots cross the room a second time. Watch the walls as well as the enemies.',
      'Quicker enemies and returning volleys tighten the firing lanes. Keep track of missed shots.',
      'Repeated ricochets and overlapping volleys turn every wall into another threat.',
    ],
  },
  {
    id: 'gauntlet',
    name: 'The Gauntlet',
    family: 'blade',
    rule: 'Clear a long sequence of mixed enemy waves without healing or recovery.',
    detail:
      'Bolt, Flare, and Dash. Every hit carries into the next wave; manage space and your ammunition.',
    tierDetails: [
      'Enemies from different regions combine their attacks. No health returns between waves.',
      'Longer waves combine ranged pressure, heavy bodies, and fast hunters.',
      'The longest endurance fight throws dense, diverse threats at you with almost no respite.',
    ],
  },
  {
    id: 'cinderRain',
    name: 'Cinder Rain',
    family: 'meteor',
    rule: 'Foundry enemies advance while marked flame strikes fall across the arena.',
    detail:
      'Bolt, Flare, and Dash. Leave burning strike marks before impact and fight from the gaps.',
    tierDetails: [
      'Falling cinders mark the floor before impact. Keep the Foundry wave outside your escape route.',
      'More flame strikes fall with shorter warnings while heavier Foundry enemies advance.',
      'Rapid cinder barrages overlap the densest Foundry waves. Plan your next step before impact.',
    ],
  },
  {
    id: 'twinFlames',
    name: 'Twin Flames',
    family: 'fire',
    rule: 'Protect two separated hearth flames from the Garden’s invading enemies.',
    detail:
      'Bolt, Flare, and Dash. Either flame going out ends the trial. Move between both defenses.',
    tierDetails: [
      'Garden enemies approach both flames. Split your attention and intercept attacks early.',
      'More attackers press both sides while the flames have less health to spare.',
      'Relentless waves threaten both flames at once. Every delayed interception costs precious flame health.',
    ],
  },
  {
    id: 'blackout',
    name: 'Blackout',
    family: 'moon',
    rule: 'Survive Citadel hunters inside rotating light lanes. Darkness burns outside them.',
    detail:
      'Bolt, Flare, and Dash. Follow the turning lanes and attack before hunters push you into darkness.',
    tierDetails: [
      'Rotating light lanes offer safe paths through the arena while Citadel hunters close in.',
      'Narrower lanes turn faster and stronger hunters contest your next safe position.',
      'The narrowest, fastest lanes face the most aggressive hunters. Master the rotation to survive.',
    ],
  },
].map(({ rewards, tierDetails, ...trial }) => ({
  ...trial,
  tiers: HEARTH_TRIAL_LEVELS.map((name, tier) => ({
    name,
    detail: tierDetails
      ? tierDetails[tier]
      : trial.id === 'guardian'
        ? [
            'Kiln cleaves, aimed rivet salvos, and charged lanes. The Crucible’s molten core burns hotter as its health falls.',
            'Broken quench rings and a moving furnace sweep join stronger, faster attacks. Read the warnings and punish its recovery.',
            'Returning hammer strokes and delayed tempering pillars join the full moveset. Final-phase attack chains leave only brief openings.',
          ][tier]
        : [
            'Stronger enemies press every wave. Watch their attack warnings and keep an escape route.',
            'A few extra attackers and quicker enemies put more pressure on the same room.',
            'Two additional waves bring larger packs, tougher enemies, and shorter attack warnings.',
          ][tier] +
          (tier > 0 && ['oneHeart', 'constellation'].includes(trial.id)
            ? tier === 1
              ? ' Moving light sweeps cross the room. Dash through them.'
              : ' Light sweeps arrive more frequently. Watch both directions.'
            : ''),
    rewards: rewards
      ? rewards[tier].map((id) => {
          const kind = tier === 0 ? 'decor' : tier === 1 ? 'trail' : 'shards',
            item = (kind === 'decor' ? HEARTH_DECOR : HEARTH_PALETTES).find(
              (item) => item.id === id
            );
          return {
            kind,
            id,
            label: item.name + (kind === 'trail' ? ' trail' : kind === 'shards' ? ' shards' : ''),
          };
        })
      : [
          {
            kind: 'essence',
            id: trial.id + ':' + tier,
            amount: [80, 180, 350][tier],
            label: [80, 180, 350][tier] + ' Essence',
          },
        ],
  })),
}));
const HEARTH_TRIAL_BY_ID = Object.fromEntries(HEARTH_TRIALS.map((trial) => [trial.id, trial]));
const HEARTH_COSMETIC_SOURCES = Object.fromEntries(
  HEARTH_TRIALS.flatMap((trial) =>
    trial.tiers.flatMap((tier, level) =>
      tier.rewards
        .filter((reward) => ['decor', 'trail', 'shards'].includes(reward.kind))
        .map((reward) => [reward.kind + ':' + reward.id, { trial: trial.id, level }])
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
    unlocked = HEARTH_TRIAL_BY_ID[id].tiers[tier].rewards.filter((reward) =>
      reward.kind === 'essence' ? !old?.clears : !hearthCosmeticUnlocked(reward.kind, reward.id)
    );
  const essence = unlocked.reduce(
    (amount, reward) => amount + (reward.kind === 'essence' ? reward.amount : 0),
    0
  );
  save.essence += essence;
  save.totalEssence += essence;
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
