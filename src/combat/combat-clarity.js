'use strict';

const COMBAT_CLARITY = {
  pressure: 0,
  renderMs: 0,
  offsetX: 0,
  offsetY: 0,
  reduction: { friendly: 0.52, glow: 0.72, impact: 0.5, debris: 0.6, trail: 0.65, flash: 0.45 },
  limits: { glow: 64, impact: 80, debris: 96, trail: 80 },
};
let combatClarityDeferWarnings = false;

function combatVisualVisible(x, y, radius = 0) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return true;
  const margin = radius + 40;
  return (
    x >= G.cam.x - margin &&
    y >= G.cam.y - margin &&
    x <= G.cam.x + G.w + margin &&
    y <= G.cam.y + G.h + margin
  );
}
function combatVisualPressure() {
  return COMBAT_CLARITY.pressure;
}
function combatVisualAlpha(kind) {
  return 1 - (COMBAT_CLARITY.reduction[kind] || 0) * COMBAT_CLARITY.pressure;
}
function combatVisualAllowance(kind, index, total) {
  const limit = COMBAT_CLARITY.limits[kind];
  if (!limit || !total || total <= limit) return true;
  const budget = Math.round(limit * (1 - COMBAT_CLARITY.pressure * 0.45));
  return Math.floor(((index + 1) * budget) / total) > Math.floor((index * budget) / total);
}
function combatClarityBeginFrame() {
  const busy = Math.max(
    (G.parts.length - 180) / 240,
    (G.bullets.length - 50) / 150,
    (G.ebul.length - 70) / 210
  );
  const slow = (COMBAT_CLARITY.renderMs - 12) / 18;
  const target = clamp(Math.max(busy, slow, save.quality === 'light' ? 0.65 : 0), 0, 1);
  const step = target > COMBAT_CLARITY.pressure ? 0.16 : 0.035;
  COMBAT_CLARITY.pressure = lerp(COMBAT_CLARITY.pressure, target, step);
  COMBAT_CLARITY.offsetX = 0;
  COMBAT_CLARITY.offsetY = 0;
}
function combatClarityGateHazard(ctx, h) {
  if (h.phase === 'rest') return;
  ctx.fillStyle = '#839da82a';
  ctx.fillRect(h.x, h.y, h.w, h.h);
  ctx.fillStyle = '#465c67';
  ctx.fillRect(h.x - 9, h.y - 8, 11, h.h + 16);
  ctx.fillRect(h.x + h.w - 2, h.y - 8, 11, h.h + 16);
  ctx.fillStyle = h.phase === 'active' ? '#d4f4ffc0' : '#e7c98135';
  ctx.fillRect(h.x, h.y, h.w, h.h);
  ctx.strokeStyle = h.phase === 'active' ? '#ecfcff' : '#e9cc84';
  ctx.lineWidth = 2;
  ctx.setLineDash(h.phase === 'active' ? [] : [8, 5]);
  ctx.strokeRect(h.x, h.y, h.w, h.h);
  ctx.setLineDash([]);
  if (h.phase === 'warn') {
    ctx.fillStyle = '#efda9b';
    ctx.fillRect(h.x, h.y + h.h + 4, h.w * clamp(1 - h.t / 1.15, 0, 1), 2);
  }
}
function combatClarityHostileShots(ctx) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  for (const b of G.ebul) {
    if (!combatVisualVisible(b.x, b.y, (b.r || 5) + 12)) continue;
    const x = Math.round(b.x),
      y = Math.round(b.y),
      radius = clamp(Math.round(b.r || 5), 3, 18),
      rim = radius + 1,
      bevel = Math.max(2, Math.round(rim * 0.32));
    ctx.fillStyle = '#100c18';
    if (b.garden) {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(Math.atan2(b.vy, b.vx));
      ctx.fillRect(-6, -5, 12, 10);
      ctx.fillRect(-11, -2, 20, 4);
      ctx.restore();
      drawSeedShot(ctx, b);
      continue;
    }
    ctx.fillRect(x - rim + bevel, y - rim, (rim - bevel) * 2, rim * 2);
    ctx.fillRect(x - rim, y - rim + bevel, rim * 2, (rim - bevel) * 2);
    if (b.lateColor) {
      ctx.fillStyle = b.lateColor;
      ctx.fillRect(x - radius + bevel, y - radius + 1, (radius - bevel) * 2, radius * 2 - 2);
      ctx.fillRect(x - radius + 1, y - radius + bevel, radius * 2 - 2, (radius - bevel) * 2);
      ctx.fillStyle = '#fff4d8';
      ctx.fillRect(x - 1, y - 1, 2, 2);
      ctx.fillStyle = '#ffffff75';
      ctx.fillRect(x - radius + 3, y - radius + 2, Math.max(1, radius - 2), 1);
    } else drawSpr('bEnemy', b.x, b.y, radius / 5, 0, 1, b.x * 0.01);
  }
  ctx.restore();
}
function combatClarityTerrainSignals(ctx) {
  const alpha = clamp((COMBAT_CLARITY.pressure - 0.15) * 1.1, 0, 0.7);
  if (!alpha || typeof drawEnvironmentalTrap !== 'function') return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  for (const h of G.world.terrainTraps || []) {
    if (h.phase !== 'active' && !(h.phase === 'warn' && h.t < 0.3)) continue;
    if (combatVisualVisible(h.x, h.y, Math.max(h.radius || 0, h.len || 0)))
      drawEnvironmentalTrap(ctx, h);
  }
  ctx.restore();
}
function combatClarityDrawWarnings(ctx) {
  if (!G.world || !G.player || G.state !== 'playing' || activeMemoryEcho) return;
  ctx.save();
  try {
    ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    const trial = isHearthTrial();
    ctx.translate(
      trial ? -Math.round(G.cam.x) : -G.cam.x + COMBAT_CLARITY.offsetX,
      trial ? -Math.round(G.cam.y) : -G.cam.y + COMBAT_CLARITY.offsetY
    );
    for (const h of G.world.lateHazards || []) drawLateHazard(ctx, h);
    if (G.world.region === 'hollow') {
      for (const h of G.world.hazards || []) {
        if (h.phase === 'rest') continue;
        if (!combatVisualVisible(h.x + h.w / 2, h.y + h.h / 2, Math.max(h.w, h.h))) continue;
        if (G.floor >= 6) drawGardenBramble(ctx, h);
        else combatClarityGateHazard(ctx, h);
      }
      drawWardenEnvironment(ctx);
    }
    for (const e of G.enemies) {
      if (!e.dead && e.matriarch) drawMatriarchRootwake(ctx, e);
      if (e.dead || e.lateBoss || e.ai !== 'late') continue;
      if (e.specialMode === 'tether' || combatVisualVisible(e.x, e.y, e.r + 80))
        drawLateEnemySkill(ctx, e);
    }
    if (trial) {
      drawHearthTrialSweeps(ctx);
      drawHearthTrialMarks(ctx);
      drawHearthGuardianHazards(ctx);
    } else endlessWheelDrawHazards(ctx);
    combatClarityTerrainSignals(ctx);
    combatClarityHostileShots(ctx);
  } finally {
    ctx.restore();
  }
}

const combatClarityLateHazard = drawLateHazard;
drawLateHazard = function (ctx, h) {
  if (!combatClarityDeferWarnings) return combatClarityLateHazard(ctx, h);
};
const combatClarityGardenBramble = drawGardenBramble;
drawGardenBramble = function (ctx, h) {
  if (!combatClarityDeferWarnings) return combatClarityGardenBramble(ctx, h);
};
const combatClarityWardenEnvironment = drawWardenEnvironment;
drawWardenEnvironment = function (ctx) {
  if (!combatClarityDeferWarnings) return combatClarityWardenEnvironment(ctx);
};
const combatClarityEnemySkill = drawLateEnemySkill;
drawLateEnemySkill = function (ctx, e) {
  if (!combatClarityDeferWarnings) return combatClarityEnemySkill(ctx, e);
};
const combatClarityWheelHazards = endlessWheelDrawHazards;
endlessWheelDrawHazards = function (ctx) {
  if (!combatClarityDeferWarnings) return combatClarityWheelHazards(ctx);
};
const combatClarityGuardianHazards = drawHearthGuardianHazards;
drawHearthGuardianHazards = function (ctx) {
  if (!combatClarityDeferWarnings) return combatClarityGuardianHazards(ctx);
};
const combatClarityRender = render;
render = function () {
  const start = performance.now();
  combatClarityBeginFrame();
  combatClarityDeferWarnings = !!G.world && G.state === 'playing' && !activeMemoryEcho;
  try {
    combatClarityRender();
  } finally {
    combatClarityDeferWarnings = false;
  }
  combatClarityDrawWarnings(G.ctx);
  COMBAT_CLARITY.renderMs = lerp(COMBAT_CLARITY.renderMs, performance.now() - start, 0.08);
};
