'use strict';

const ADAPTIVE_GUARDIAN_VERSION = 2;
const ADAPTIVE_REQUIREMENT = [0, 0.02, 0.06, 0.1, 0.16, 0.23, 0.3, 0.37, 0.44, 0.52];
const ADAPTIVE_BUDGET = [0.18, 0.135, 0.105, 0.08, 0.052, 0.044, 0.036, 0.03, 0.024, 0.019];
const ADAPTIVE_HIT_CAP = [0.1, 0.08, 0.065, 0.055, 0.042, 0.036, 0.03, 0.026, 0.021, 0.017];

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
  const totalRanks = Object.values(up).reduce(
    (sum, v) => sum + (Number.isFinite(Number(v)) ? Math.max(0, Number(v)) : 0),
    0
  );
  const mythics = [
    'supernova',
    'blackHole',
    'sevenfold',
    'mirrorSoul',
    'starfall',
    'radiantDebt',
    'dawnward',
    'worldfire',
    'voidOrbit',
    'endless',
  ].reduce((n, id) => n + (r(id) > 0), 0);
  const offense =
    (1 + 0.18 * r('dmg')) *
    (1 + 0.15 * r('rate')) *
    (1 + 0.26 * r('glass')) *
    (1 + 0.31 * r('proj')) *
    (1 + 0.055 * r('crit')) *
    (1 + 0.12 * r('edge')) *
    (1 + 0.12 * r('eliteBane')) *
    (1 + 0.075 * r('closeQuarters')) *
    (1 + 0.08 * r('kindleMark')) *
    (1 + 0.1 * r('doubleCast')) *
    (1 + 0.16 * r('whiteStar')) *
    (1 + 0.2 * r('sevenfold')) *
    (1 + 0.22 * r('twinFlame')) *
    (1 + 0.3 * r('radiantDebt')) *
    (1 + 0.13 * r('supernova'));
  const defense =
    (1 + 0.1 * r('hp')) *
    (1 + 0.055 * r('regen')) *
    (1 + 0.055 * r('ironAsh')) *
    (1 + 0.07 * r('bossWard')) *
    (1 + 0.055 * r('guard')) *
    (1 + 0.09 * r('overheal')) *
    (1 + 0.12 * r('mirrorSoul')) *
    (1 + 0.14 * r('dawnward')) *
    (1 + 0.1 * r('runRevive'));
  const collection = 1 + Math.min(1.35, totalRanks * 0.026 + mythics * 0.11);
  const power = adaptiveClamp(Math.max(offense, collection), 1, 14);
  const strongest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0],
    label = !strongest || strongest[1] < 0.6 ? 'balanced' : strongest[0];
  return {
    power,
    offense: adaptiveClamp(offense, 1, 14),
    defense: adaptiveClamp(defense, 1, 5),
    totalRanks,
    mythics,
    label,
    scores,
  };
}
function adaptiveModel(tier, mastery, build, mode = 'campaign') {
  const i = adaptiveClamp(tier, 1, 10) - 1,
    need = ADAPTIVE_REQUIREMENT[i],
    deficit = Math.max(0, need - mastery),
    lateWeight = i / 9;
  const modeWeight = mode === 'practice' ? 0.55 : mode === 'rush' ? 0.68 : 1;
  const tempHp = 1 + (Math.pow(build.power, 0.46) - 1) * modeWeight;
  const hp = adaptiveClamp(
    tempHp * (1 + deficit * (2.1 + lateWeight * 4.4) * modeWeight),
    1,
    mode === 'campaign' ? 7.2 : 3.8
  );
  const damage = adaptiveClamp(
    1 + ((build.defense - 1) * 0.17 + deficit * (0.82 + lateWeight * 0.78)) * modeWeight,
    1,
    2.35
  );
  const tempo = adaptiveClamp(
    1 +
      (Math.min(0.24, (build.power - 1) * 0.026) + deficit * (0.32 + lateWeight * 0.3)) *
        modeWeight,
    1,
    1.5
  );
  return {
    need,
    deficit,
    hp,
    damage,
    tempo,
    budget: ADAPTIVE_BUDGET[i],
    hitCap: ADAPTIVE_HIT_CAP[i],
  };
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
    model = adaptiveModel(Math.min(10, tier), mastery, profile, adaptiveMode()),
    ratio = adaptiveClamp(b.hp / Math.max(1, b.max), 0, 1);
  b.max = Math.max(1, Math.round(b.max * model.hp));
  b.hp = Math.max(1, Math.round(b.max * ratio));
  b.dmg = Math.max(1, Math.round(b.dmg * model.damage));
  b.spd *= 1 + Math.min(0.12, (model.tempo - 1) * 0.46);
  b.endlessDamageCeiling = Math.min(b.endlessDamageCeiling || 1, model.hitCap);
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
    counterT: adaptiveCounterInterval(tier, profile.power) * 0.68,
    counterStep: 0,
    shieldUntil: 0,
    gate: 0,
  };
}
function applyAdaptiveGroup(b, announce = true) {
  if (!b || G.run?.infinite) return;
  const group = adaptiveCurrentGroup(b),
    profile = adaptiveBuild(G.run?.up || {}),
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
  if (a.tier < 3 || !b.lateBoss) return;
  a.counterT -= dt;
  a.shieldUntil = Math.max(0, a.shieldUntil || 0);
  const busy =
    b.bs?.mode === 'shift' || G.world?.lateHazards?.some((h) => h.adaptive && h.ownerUid === b.uid);
  if (a.counterT <= 0 && !busy) {
    adaptiveCounter(b);
    a.counterT = adaptiveCounterInterval(a.tier, a.power);
  }
}

function adaptivePhaseThresholds(e) {
  if (e.bossKey === 'regents') return [];
  if (e.bossKey === 'keeper') return [0.68, 0.3];
  if (e.bossKey === 'uncounted') return [0.66, 0.33];
  return [0.5];
}
const adaptiveDamageEnemy = damageEnemy;
damageEnemy = function (e, dmg, ang, crit, kb, kind = 'shot') {
  const a = e?.adapt;
  if (!a || G.run?.infinite) return adaptiveDamageEnemy(e, dmg, ang, crit, kb, kind);
  if ((a.shieldUntil || 0) > G.run.t) return;
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
  if (allowed < 1) return;
  dmg = Math.min(dmg, allowed, e.max * a.hitCap);
  const thresholds = adaptivePhaseThresholds(e),
    threshold = thresholds[a.gate];
  if (threshold) {
    const gateHp = e.max * threshold;
    if (e.hp > gateHp) dmg = Math.min(dmg, e.hp - gateHp);
  }
  if (dmg <= 0) return;
  const before = e.hp;
  adaptiveDamageEnemy(e, dmg, ang, crit, kb, kind);
  const dealt = Math.max(0, before - e.hp);
  budget.spent += dealt;
  if (threshold && !e.dead && e.hp <= e.max * threshold + 0.5) {
    a.gate++;
    a.shieldUntil = G.run.t + 0.85;
    addText(e.x, e.y - e.r - 18, 'WARD RENEWED', '#f3d6ff', 13);
    burst(e.x, e.y, 22, '#d7b4ff', 175, 0.6, 2.8, true);
  }
};

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
