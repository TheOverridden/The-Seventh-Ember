'use strict';

const ADAPTIVE_GUARDIAN_VERSION = 2;
const CAMPAIGN_GUARDIAN_BALANCE = [
  { health: 1250, damage: 14, expectedDps: 57, vitality: 125, tempo: 0.9, mastery: 0 },
  { health: 1680, damage: 17, expectedDps: 69, vitality: 125, tempo: 0.91, mastery: 0 },
  { health: 2260, damage: 21, expectedDps: 96, vitality: 150, tempo: 0.92, mastery: 0.025 },
  { health: 2800, damage: 27, expectedDps: 120, vitality: 150, tempo: 0.97, mastery: 0.05 },
  { health: 3200, damage: 30, expectedDps: 160, vitality: 175, tempo: 0.98, mastery: 0.08 },
  { health: 3700, damage: 34, expectedDps: 202, vitality: 175, tempo: 0.99, mastery: 0.12 },
  { health: 2250, damage: 36, expectedDps: 247, vitality: 200, tempo: 1, mastery: 0.17 },
  { health: 4850, damage: 42, expectedDps: 294, vitality: 200, tempo: 1.01, mastery: 0.22 },
  { health: 5580, damage: 48, expectedDps: 340, vitality: 225, tempo: 1.01, mastery: 0.27 },
  { health: 6650, damage: 54, expectedDps: 395, vitality: 225, tempo: 1.02, mastery: 0.33 },
];
const ADAPTIVE_BUDGET = [0.16, 0.13, 0.095, 0.07, 0.057, 0.048, 0.042, 0.036, 0.031, 0.027];
const ADAPTIVE_HIT_CAP = [0.1, 0.08, 0.065, 0.055, 0.048, 0.044, 0.042, 0.039, 0.036, 0.034];

function adaptiveClamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}
function adaptiveTier(b, floor = G.floor) {
  if (b?.bossKey === 'uncounted' || b?.bossKey === 'unrecorded') return 11;
  return adaptiveClamp(Math.ceil(Math.min(50, Math.max(5, floor)) / 5), 1, 10);
}
function adaptiveMastery(nodes = save.nodes || {}) {
  const owned = TREE_NODES.filter((n) => nodes[n.id]),
    nodeRatio = owned.length / Math.max(1, TREE_NODES.length);
  const paidRatio =
    owned.reduce((sum, n) => sum + (Number(n.cost) || 0), 0) / Math.max(1, MASTERY_TOTAL || 1);
  let branchDepth = 0;
  for (const branch of MASTERY_BRANCHES) {
    let depth = 0;
    for (let i = 0; i < branch.ids.length; i++)
      if (nodes[branch.ids[i]]) depth = Math.max(depth, i + 1);
    branchDepth += depth / branch.ids.length;
  }
  branchDepth /= Math.max(1, MASTERY_BRANCHES.length);
  return adaptiveClamp(
    nodeRatio * 0.55 + branchDepth * 0.3 + Math.sqrt(adaptiveClamp(paidRatio, 0, 1)) * 0.15,
    0,
    1
  );
}
function adaptiveBuild(up = {}) {
  const r = (id) => Math.max(0, Number(up[id]) || 0);
  const scores = {
    barrage:
      r('rate') * 1.25 +
      r('proj') * 2.2 +
      r('doubleCast') * 2 +
      r('sevenfold') * 4 +
      r('twinFlame') * 4 +
      r('magazine') * 0.35 +
      r('quickload') * 0.55,
    burst:
      r('dmg') * 1.1 +
      r('crit') * 0.7 +
      r('glass') * 2.4 +
      r('supernova') * 4 +
      r('whiteStar') * 3 +
      r('eliteBane') * 2 +
      r('fullHeart') * 1.4 +
      r('radiantDebt') * 5 +
      r('comet') * 1.8,
    flare:
      r('edge') * 1.8 +
      r('aftershock') * 1.8 +
      r('echoFlare') * 2 +
      r('bladeEcho') * 2 +
      r('gravityFlare') +
      r('flarePractice') * 0.55,
    fortress:
      r('hp') * 0.32 +
      r('regen') * 0.8 +
      r('ironAsh') * 1.2 +
      r('bossWard') * 1.6 +
      r('guard') * 1.2 +
      r('mirrorSoul') * 3 +
      r('dawnward') * 4 +
      r('runRevive') * 3 +
      r('overheal') * 1.2,
    motion:
      r('speed') * 0.75 +
      r('dash') * 0.75 +
      r('quickStep') * 0.8 +
      r('dashReset') * 1.5 +
      r('riftBlink') * 2 +
      r('phoenixRush') * 2,
  };
  const p = G.player,
    primary = activeForm('primary').id,
    formPower = { sunlance: 2.15, cinderburst: 1.65, starweaver: 1.24, ashDisc: 2.8 };
  const castTime = p.shotInt + p.reloadDuration / Math.max(1, p.magSize);
  const bolt = (p.dmg * (formPower[primary] || 1) * (1 + 0.58 * (p.proj - 1))) / castTime;
  const boltExtras =
    1 +
    0.13 * r('doubleCast') +
    0.23 * r('sevenfold') +
    0.2 * r('twinFlame') +
    0.14 * r('whiteStar');
  const flare = (p.dmg * MELEE.damage * (1 + 0.25 * r('edge'))) / Math.max(0.25, MELEE.cooldown);
  const flareExtras = 1 + 0.21 * r('bladeEcho') + 0.16 * r('echoFlare') + 0.12 * r('aftershock');
  const procCards = [
    'burn',
    'blackHole',
    'supernova',
    'starfall',
    'worldfire',
    'voidOrbit',
    'meteorCore',
    'stormCoil',
    'moonShard',
    'faultline',
    'orbital',
    'brightNeedle',
    'seventhConstellation',
    'sunspot',
    'hailstone',
    'sawHalo',
    'duelistEmber',
  ];
  const procRanks = procCards.reduce((sum, id) => sum + r(id), 0);
  const comboCount = BLESSING_COMBOS.filter((c) => c.cards.every((id) => r(id) > 0)).length;
  const crit = 1 + Math.min(1, p.critC) * (1 + (META.critPower || 0));
  const offense =
    Math.max(bolt * boltExtras, flare * flareExtras) *
    crit *
    (1 + 0.35 * r('eliteBane')) *
    (1 + 0.14 * r('fullHeart') + 0.09 * r('kindleMark') + 0.09 * r('closeQuarters')) *
    (1 + Math.min(0.85, procRanks * 0.025 + comboCount * 0.065)) *
    Math.pow(META.boss || 1, 0.4);
  const armor = Math.min(0.5, (p.metaArmor || 0) + (p.cardArmor || 0) + 0.07 * r('bossWard'));
  const defense = (p.maxHp + (p.regen || 0) * 8) / (1 - armor);
  const power = Math.max(1, offense / 36);
  const strongest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0],
    label = !strongest || strongest[1] < 0.6 ? 'balanced' : strongest[0];
  return {
    power,
    offense,
    defense,
    label,
    scores,
  };
}
function adaptiveModel(tier, mastery, build, mode = 'campaign') {
  const i = adaptiveClamp(tier, 1, 10) - 1;
  const stage = CAMPAIGN_GUARDIAN_BALANCE[i],
    deficit = Math.max(0, stage.mastery - mastery),
    attackRatio = Math.max(1, build.offense / stage.expectedDps),
    vitalityRatio = build.defense / stage.vitality;
  const model = {
    need: stage.mastery,
    deficit,
    baseHealth: DS_DEMO ? null : stage.health,
    baseDamage: DS_DEMO ? null : stage.damage,
    hp: Math.pow(attackRatio, 0.74) * (1 + deficit * 1.4),
    damage: adaptiveClamp(1 + (vitalityRatio - 1) * 0.46 + deficit * 0.28, 0.82, 1.65),
    tempo: stage.tempo + Math.min(0.07, (attackRatio - 1) * 0.015),
    budget: ADAPTIVE_BUDGET[i],
    hitCap: ADAPTIVE_HIT_CAP[i],
    counterInterval: tier <= 3 ? 0 : adaptiveCounterInterval(tier, build.power),
  };
  if (mode === 'practice') {
    const ascendant = G.run?.guardianMode?.difficulty === 'ascendant';
    const power = Math.max(1, build.offense / (stage.expectedDps * 0.85 + 130));
    return {
      ...model,
      baseHealth: null,
      baseDamage: null,
      need: 0,
      deficit: 0,
      hp: DS_DEMO ? 1 : 1 + (Math.pow(power, 0.65) - 1) * 0.45,
      damage: 1,
      tempo: DS_DEMO ? 1 : stage.tempo + (ascendant ? 0.055 : -0.02),
      budget: Math.max(ascendant ? 0.047 : 0.058, model.budget),
      hitCap: Math.max(0.055, model.hitCap),
      counterInterval: model.counterInterval * (ascendant ? 1.17 : 1.4),
    };
  }
  return mode === 'rush' && typeof bossRushAdaptiveModel === 'function'
    ? bossRushAdaptiveModel(model, build)
    : model;
}
function adaptiveBossKey(b) {
  return b?.bossKey || (b?.warden ? 'warden' : b?.matriarch ? 'matriarch' : 'guardian');
}
function adaptiveMode() {
  return G.run?.mode === 'practice' ? 'practice' : G.run?.mode === 'rush' ? 'rush' : 'campaign';
}
function adaptiveGroupKey(b) {
  return adaptiveMode() + ':' + G.floor + ':' + adaptiveBossKey(b);
}
function adaptiveCurrentGroup(b) {
  const key = adaptiveBossKey(b);
  return G.enemies.filter((e) => !e.dead && e.isBoss && adaptiveBossKey(e) === key);
}

function applyAdaptiveGuardian(b, profile, mastery) {
  if (!b || b.dead || G.run?.infinite || b.adapt?.version === ADAPTIVE_GUARDIAN_VERSION) return;
  const tier = adaptiveTier(b),
    mode = adaptiveMode(),
    model = adaptiveModel(tier, mastery, profile, mode),
    ratio = adaptiveClamp(b.hp / Math.max(1, b.max), 0, 1);
  b.max = Math.max(1, Math.round((model.baseHealth ?? b.max) * model.hp));
  b.hp = Math.max(1, Math.round(b.max * ratio));
  b.dmg = Math.max(1, Math.round((model.baseDamage ?? b.dmg) * model.damage));
  b.spd *= 1 + Math.min(0.12, (model.tempo - 1) * 0.46);
  b.adapt = {
    version: ADAPTIVE_GUARDIAN_VERSION,
    tier,
    key: adaptiveBossKey(b),
    mastery,
    need: model.need,
    deficit: model.deficit,
    power: profile.power,
    tempo: model.tempo,
    budget: model.budget,
    hitCap: model.hitCap,
    counterInterval: model.counterInterval,
    counterT: model.counterInterval * 0.85,
    counterStep: 0,
    shieldUntil: 0,
    gate: 0,
  };
}
function applyAdaptiveGroup(b, announce = true) {
  if (!b || G.run?.infinite) return;
  const group = adaptiveCurrentGroup(b);
  if (!group.some((e) => e.adapt?.version !== ADAPTIVE_GUARDIAN_VERSION)) return;
  const profile = adaptiveBuild(G.run?.up || {}),
    mastery = adaptiveMastery();
  for (const e of group) applyAdaptiveGuardian(e, profile, mastery);
  const adapted = group.filter((e) => e.adapt?.version === ADAPTIVE_GUARDIAN_VERSION);
  if (!adapted.length) return;
  G.run.adaptiveBudgets =
    G.run.adaptiveBudgets && typeof G.run.adaptiveBudgets === 'object' ? G.run.adaptiveBudgets : {};
  const key = adaptiveGroupKey(b),
    max = adapted.reduce((sum, e) => sum + e.max, 0),
    budget = adapted[0].adapt.budget;
  G.run.adaptiveBudgets[key] = { start: G.run.t, spent: 0, max, rate: budget };
  if (announce && !G.run.adaptiveAnnouncements?.[key]) {
    G.run.adaptiveAnnouncements = G.run.adaptiveAnnouncements || {};
    G.run.adaptiveAnnouncements[key] = true;
    const omen = {
      barrage: 'The air narrows around each cast.',
      burst: 'The ward gathers at the point of impact.',
      flare: 'Close flame wakes the outer ring.',
      fortress: 'Old stone draws breath beneath the floor.',
      motion: 'Each footfall returns as an echo.',
      balanced: 'Every seal turns at once.',
    }[profile.label];
    toast('THE OLD WARD STIRS', omen);
    fieldNote('THE GUARDIAN AWAKENS', 2.5);
  }
}

function adaptiveCounterInterval(tier, power) {
  return adaptiveClamp(15 - tier * 0.58 - (power - 1) * 0.16, 6.4, 13.5);
}
function adaptiveHazard(b, type, x, y, a, opts) {
  const h = encounterHazard(b, type, x, y, a, opts);
  h.adaptive = true;
  return h;
}
function adaptiveLanes(b, vertical, gap, delay = 1.02) {
  const a = arenaBounds(),
    span = vertical ? a.right - a.left : a.bottom - a.top,
    step = span / 5;
  for (let i = 0; i < 5; i++) {
    if (i === gap) continue;
    adaptiveHazard(
      b,
      'glyph',
      vertical ? a.left + step * (i + 0.5) : a.left,
      vertical ? a.top : a.top + step * (i + 0.5),
      vertical ? Math.PI / 2 : 0,
      {
        delay,
        life: 1.45,
        len: vertical ? a.bottom - a.top : a.right - a.left,
        width: Math.min(17, step * 0.2),
        damageMul: 0.62,
      }
    );
  }
}
function adaptiveCounter(b) {
  if (!b?.lateBoss || !G.world?.lateHazards || !G.player) return;
  const s = b.bs || {},
    a = arenaBounds(),
    p = G.player,
    step = b.adapt.counterStep++,
    angle = Math.atan2(p.y - b.y, p.x - b.x),
    key = b.adapt.key;
  if (key === 'bellkeeper')
    adaptiveHazard(b, 'annulus', p.x, p.y, 0, {
      delay: 0.78,
      life: 1.25,
      radius: 18,
      expand: 175,
      width: 11,
      damageMul: 0.55,
    });
  else if (key === 'colossus') {
    adaptiveLanes(b, step % 2 === 0, (step + 2) % 5, 1.06);
    adaptiveHazard(b, 'shell', p.x + (p.vigilVX || 0) * 0.38, p.y + (p.vigilVY || 0) * 0.38, 0, {
      delay: 0.82,
      life: 0.36,
      radius: 35,
      damageMul: 0.62,
    });
  } else if (key === 'astronomer')
    adaptiveHazard(b, 'rotor', b.x, b.y, angle - 0.55, {
      delay: 0.86,
      life: 3.8,
      len: Math.hypot(a.right - a.left, a.bottom - a.top),
      turn: step % 2 ? 0.78 : -0.78,
      arms: 2,
      width: 7,
      damageMul: 0.62,
      followOwner: true,
    });
  else if (key === 'scribe') {
    adaptiveLanes(b, step % 2 === 0, (step * 2 + 1) % 5, 0.96);
    adaptiveHazard(b, 'sweep', b.x, b.y, angle + (step % 2 ? 1 : -1), {
      delay: 0.72,
      life: 1.15,
      len: Math.hypot(a.right - a.left, a.bottom - a.top),
      turn: step % 2 ? -1.05 : 1.05,
      width: 7,
      damageMul: 0.58,
    });
  } else if (key === 'regents') {
    adaptiveHazard(b, 'annulus', a.cx, a.cy, 0, {
      delay: 0.72,
      life: 1.35,
      radius: 24,
      expand: 190,
      width: 12,
      damageMul: 0.6,
    });
    bossRingLate(b, 14, 245, angle + 0.5);
  } else if (key === 'seraph')
    adaptiveHazard(b, 'rotor', b.x, b.y, angle - 0.4, {
      delay: 0.74,
      life: 4.6,
      len: Math.hypot(a.right - a.left, a.bottom - a.top),
      turn: step % 2 ? 0.96 : -0.96,
      arms: 2,
      width: 8,
      damageMul: 0.66,
      followOwner: true,
    });
  else if (key === 'tyrant') {
    for (let i = 0; i < 4; i++) {
      const lead = 0.22 + i * 0.18,
        x = adaptiveClamp(p.x + (p.vigilVX || 0) * lead, a.left + 30, a.right - 30),
        y = adaptiveClamp(p.y + (p.vigilVY || 0) * lead, a.top + 30, a.bottom - 30);
      adaptiveHazard(b, 'shell', x, y, 0, {
        delay: 0.62 + i * 0.28,
        life: 0.38,
        radius: 38,
        damageMul: 0.64,
      });
    }
    if (step % 2) adaptiveLanes(b, false, (step + 1) % 5, 1.08);
  } else if (key === 'keeper') {
    if (step % 2 === 0)
      adaptiveHazard(b, 'rotor', b.x, b.y, angle - 0.35, {
        delay: 0.7,
        life: 5.4,
        len: Math.hypot(a.right - a.left, a.bottom - a.top),
        turn: step % 4 ? 0.74 : -0.74,
        arms: 3,
        width: 8,
        damageMul: 0.68,
        followOwner: true,
      });
    else {
      adaptiveLanes(b, step % 4 === 1, (step + 2) % 5, 0.94);
      adaptiveHazard(b, 'annulus', p.x, p.y, 0, {
        delay: 0.76,
        life: 1.25,
        radius: 18,
        expand: 185,
        width: 11,
        damageMul: 0.62,
      });
    }
  } else if (key === 'uncounted') {
    adaptiveHazard(b, 'rotor', b.x, b.y, angle - 0.3, {
      delay: 0.66,
      life: 4.8,
      len: Math.hypot(a.right - a.left, a.bottom - a.top),
      turn: step % 2 ? 1.08 : -1.08,
      arms: 3,
      width: 8,
      damageMul: 0.66,
      followOwner: true,
    });
    adaptiveHazard(b, 'annulus', p.x, p.y, 0, {
      delay: 0.74,
      life: 1.25,
      radius: 20,
      expand: 190,
      width: 11,
      damageMul: 0.6,
    });
  }
  s.adaptiveFlash = 0.45;
  burst(b.x, b.y, 12, b.col, 115, 0.34, 2, true);
  sfx('eshoot');
}
function tickAdaptiveGuardian(b, dt) {
  const a = b?.adapt;
  if (!a || G.run?.infinite || b !== G.boss || !b.introduced || G.state !== 'playing') return;
  if (a.tier < 3 || !b.lateBoss || a.counterInterval === 0) return;
  a.counterT -= dt;
  const busy =
    ['shift', 'barrier', 'submerge', 'eclipse'].includes(b.bs?.mode) ||
    G.world?.lateHazards?.some((h) => h.ownerUid === b.uid && (h.adaptive || h.type === 'rotor'));
  if (a.counterT <= 0 && !busy) {
    adaptiveCounter(b);
    a.counterT = a.counterInterval ?? adaptiveCounterInterval(a.tier, a.power);
  }
}

function adaptivePhaseThresholds(e) {
  if (e.warden) return [0.5, 0.22];
  if (e.bossKey === 'regents') return [];
  if (e.bossKey === 'keeper') return [0.68, 0.3];
  if (e.bossKey === 'uncounted') return [0.66, 0.33];
  return [0.5];
}
function limitAdaptiveDamage(e, dmg) {
  const a = e.adapt;
  if ((a.shieldUntil || 0) > G.run.t) return 0;
  const key = adaptiveGroupKey(e),
    budgets = G.run.adaptiveBudgets || (G.run.adaptiveBudgets = {});
  let budget = budgets[key];
  if (!budget) {
    const group = adaptiveCurrentGroup(e);
    budget = budgets[key] = {
      start: G.run.t,
      spent: 0,
      max: group.reduce((sum, b) => sum + b.max, 0) || e.max,
      rate: a.budget,
    };
  }
  if (G.run.t - budget.start >= 1) {
    budget.start = G.run.t;
    budget.spent = 0;
    budget.max = Math.max(
      budget.max,
      adaptiveCurrentGroup(e).reduce((sum, b) => sum + b.max, 0)
    );
  }
  const allowed = Math.max(0, budget.max * budget.rate - budget.spent);
  if (allowed < 1) return 0;
  dmg = Math.min(dmg, allowed, e.max * a.hitCap);
  const thresholds = adaptivePhaseThresholds(e),
    threshold = thresholds[a.gate];
  if (threshold) {
    const gateHp = e.max * threshold;
    if (e.hp > gateHp) dmg = Math.min(dmg, e.hp - gateHp);
  }
  return dmg;
}
function recordAdaptiveDamage(e, dealt) {
  const a = e.adapt,
    threshold = adaptivePhaseThresholds(e)[a.gate],
    budget = G.run.adaptiveBudgets[adaptiveGroupKey(e)];
  budget.spent += dealt;
  if (threshold && e.hp <= e.max * threshold + 1e-6) {
    a.gate++;
    a.shieldUntil = G.run.t + 0.85;
    burst(e.x, e.y, 22, '#d7b4ff', 175, 0.6, 2.8, true);
  }
}

const adaptiveWardenActivation = activateWarden;
activateWarden = function (b) {
  adaptiveWardenActivation(b);
  applyAdaptiveGroup(b);
  saveNow();
};
const adaptiveMatriarchActivation = activateMatriarch;
activateMatriarch = function (b) {
  adaptiveMatriarchActivation(b);
  applyAdaptiveGroup(b);
  saveNow();
};
const adaptiveLateActivation = activateLateBoss;
activateLateBoss = function (b) {
  adaptiveLateActivation(b);
  applyAdaptiveGroup(b);
  saveNow();
};
const adaptiveSecretReveal = revealUncountedGuardian;
revealUncountedGuardian = function () {
  adaptiveSecretReveal();
  if (G.boss) {
    applyAdaptiveGroup(G.boss);
    saveNow();
  }
};

const adaptiveWardenAI = wardenAI;
wardenAI = function (b, dt, d, dx, dy) {
  tickAdaptiveGuardian(b, dt);
  return adaptiveWardenAI(b, dt * (b.adapt?.tempo || 1), Math.max(1, d), dx, dy);
};
const adaptiveMatriarchAI = matriarchAI;
matriarchAI = function (b, dt, d, dx, dy) {
  tickAdaptiveGuardian(b, dt);
  return adaptiveMatriarchAI(b, dt * (b.adapt?.tempo || 1), Math.max(1, d), dx, dy);
};
const adaptiveLateBossAI = lateBossAI;
lateBossAI = function (b, dt, d, dx, dy) {
  tickAdaptiveGuardian(b, dt);
  return adaptiveLateBossAI(b, dt * (b.adapt?.tempo || 1), Math.max(1, d), dx, dy);
};

const adaptiveLateBossBody = drawLateBossBody;
drawLateBossBody = function (ctx, b) {
  adaptiveLateBossBody(ctx, b);
  const a = b.adapt;
  if (!a) return;
  const t = save.motion ? 0 : G.tAll,
    shield = (a.shieldUntil || 0) > (G.run?.t || 0);
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(t * 0.23);
  ctx.strokeStyle = shield ? '#f7e6ff' : '#c7a3e8';
  ctx.globalAlpha = shield ? 0.8 : 0.18 + 0.08 * Math.sin(t * 2.7);
  ctx.lineWidth = shield ? 3 : 1;
  for (let i = 0; i < 8; i++) {
    ctx.rotate(TAU / 8);
    ctx.beginPath();
    ctx.moveTo(b.r + 9, -3);
    ctx.lineTo(b.r + 16, 0);
    ctx.lineTo(b.r + 9, 3);
    ctx.stroke();
  }
  ctx.restore();
};

const adaptiveResumeRun = resumeRun;
resumeRun = function () {
  adaptiveResumeRun();
  if (!G.run || G.run.infinite || !G.boss?.introduced) return;
  const group = adaptiveCurrentGroup(G.boss);
  if (group.some((b) => !b.adapt || b.adapt.version !== ADAPTIVE_GUARDIAN_VERSION))
    applyAdaptiveGroup(G.boss, false);
  else {
    G.run.adaptiveBudgets =
      G.run.adaptiveBudgets && typeof G.run.adaptiveBudgets === 'object'
        ? G.run.adaptiveBudgets
        : {};
    const key = adaptiveGroupKey(G.boss);
    if (!G.run.adaptiveBudgets[key])
      G.run.adaptiveBudgets[key] = {
        start: G.run.t,
        spent: 0,
        max: group.reduce((sum, b) => sum + b.max, 0),
        rate: G.boss.adapt.budget,
      };
  }
  updateHUD(0);
  saveNow();
};
