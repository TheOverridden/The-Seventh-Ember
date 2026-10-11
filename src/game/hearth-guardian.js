const HEARTH_CRUCIBLE_PALETTE = {
  dark: '#18191e',
  iron: '#343239',
  shadow: '#503729',
  bronze: '#927049',
  edge: '#d1a26a',
  light: '#f2cf96',
  ember: '#f08b48',
  hot: '#ffd38a',
  core: '#fff1c3',
};
function spawnHearthTrialGuardian() {
  const q = hearthTrial,
    tier = q.tier,
    point = safePosition(G.world, TILE * 14.5, TILE * 5.5, 38) || {
      x: TILE * 14.5,
      y: TILE * 5.5,
    },
    hp = [4000, 6500, 9500][tier],
    e = {
      type: 'trialGuardian',
      ai: 'trialGuardian',
      spr: 'hearthCrucible',
      x: point.x,
      y: point.y,
      r: 38,
      hp,
      max: hp,
      spd: [94, 108, 124][tier],
      dmg: [16, 23, 30][tier],
      xp: 0,
      kb: 0.035,
      kbx: 0,
      kby: 0,
      hitT: 0,
      atkT: 1.2,
      t1: 0,
      t2: 0,
      orbT: 0,
      seed: 2.618,
      aggro: true,
      dead: false,
      elite: false,
      isBoss: true,
      trialEnemy: true,
      trialRole: 'guardian',
      trialMode: 'walk',
      trialAngle: Math.PI / 2,
      phase: 0,
      cruciblePhase: 1,
      tier: tier + 1,
      name: 'THE CRUCIBLE',
      col: HEARTH_CRUCIBLE_PALETTE.ember,
      uid: ++entitySerial,
      crucible: {
        mode: 'approach',
        kind: '',
        t: 0,
        duration: 1.2,
        serial: 0,
        fired: {},
        a: Math.PI / 2,
        turn: 1,
        step: 0,
        playerX: G.player.x,
        playerY: G.player.y,
        vx: 0,
        vy: 0,
      },
    };
  q.guardianHazards = [];
  q.guardianPreviousPlayer = { x: G.player.x, y: G.player.y };
  G.enemies.push(e);
  CREATURE_MOTION.set(e, { x: e.x, y: e.y, travel: 0, phase: 0, moving: false });
  G.boss = e;
  G.bossActive = true;
  T('bossname').textContent = e.name;
  T('bossbar').classList.add('on');
  return e;
}
function hearthGuardianAngle(a, b) {
  return Math.atan2(Math.sin(a - b), Math.cos(a - b));
}
function hearthGuardianPointDistance(x, y, ax, ay, bx, by) {
  const dx = bx - ax,
    dy = by - ay,
    n = dx * dx + dy * dy,
    t = n ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / n)) : 0;
  return Math.hypot(x - ax - dx * t, y - ay - dy * t);
}
function hearthGuardianSegmentsTouch(ax, ay, bx, by, cx, cy, dx, dy, radius) {
  const abx = bx - ax,
    aby = by - ay,
    cdx = dx - cx,
    cdy = dy - cy,
    den = abx * cdy - aby * cdx;
  if (Math.abs(den) > 0.0001) {
    const ux = cx - ax,
      uy = cy - ay,
      t = (ux * cdy - uy * cdx) / den,
      u = (ux * aby - uy * abx) / den;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return true;
  }
  return (
    Math.min(
      hearthGuardianPointDistance(ax, ay, cx, cy, dx, dy),
      hearthGuardianPointDistance(bx, by, cx, cy, dx, dy),
      hearthGuardianPointDistance(cx, cy, ax, ay, bx, by),
      hearthGuardianPointDistance(dx, dy, ax, ay, bx, by)
    ) < radius
  );
}
function hearthGuardianRayLength(x, y, a, max = TILE * 28) {
  const dx = Math.cos(a),
    dy = Math.sin(a),
    w = G.world;
  for (let n = 12; n <= max; n += 8) {
    const tx = Math.floor((x + dx * n) / TILE),
      ty = Math.floor((y + dy * n) / TILE);
    if (tx < 0 || ty < 0 || tx >= w.W || ty >= w.H || !w.grid[ty * w.W + tx])
      return Math.max(0, n - 8);
  }
  return max;
}
function hearthGuardianHazard(e, kind, data = {}) {
  const q = hearthTrial;
  if (!q?.guardianHazards || q.guardianHazards.length >= 36) return null;
  const h = {
    kind,
    x: e.x,
    y: e.y,
    a: e.crucible.a,
    owner: e,
    t: 0,
    warning: 0.9,
    life: 0.3,
    damage: e.dmg,
    fired: false,
    ...data,
  };
  q.guardianHazards.push(h);
  return h;
}
function hearthGuardianFan(e, warning = 0.78, count = 3, spread = 0.16, aim = null) {
  const p = G.player,
    c = e.crucible,
    tier = hearthTrial.tier;
  return hearthGuardianHazard(e, 'fan', {
    a: aim === null ? Math.atan2(p.y + c.vy * 0.2 - e.y, p.x + c.vx * 0.2 - e.x) : aim,
    warning,
    life: 0.12,
    count,
    spread,
    speed: [230, 270, 305][tier] + e.phase * 12,
    damage: Math.round(e.dmg * 0.86),
  });
}
function hearthGuardianRing(e, warning = 0.95, offset = 0) {
  const p = G.player,
    tier = hearthTrial.tier;
  return hearthGuardianHazard(e, 'ring', {
    a: Math.atan2(p.y - e.y, p.x - e.x) + offset,
    warning,
    life: 3.1,
    speed: [155, 180, 210][tier] + e.phase * 10,
    gap: tier === 2 ? 0.38 : 0.47,
    width: 9,
    radius: 46,
    damage: Math.round(e.dmg * 0.9),
  });
}
function hearthGuardianPillar(e, x, y, warning = 0.92) {
  const pos = safePosition(G.world, x, y, 42);
  if (!pos) return;
  return hearthGuardianHazard(e, 'pillar', {
    x: pos.x,
    y: pos.y,
    warning,
    life: 1.15,
    radius: e.phase === 2 ? 44 : 38,
    damage: Math.round(e.dmg * 0.9),
  });
}
function hearthGuardianOnce(c, key, at, fn) {
  if (c.t >= at && !c.fired[key]) {
    c.fired[key] = true;
    fn();
  }
}
function hearthGuardianRecover(e, duration = null) {
  const c = e.crucible;
  c.mode = 'recover';
  c.t = 0;
  c.duration = duration === null ? [1.45, 1.2, 1.05][hearthTrial.tier] : duration;
  c.kind = '';
  e.trialMode = 'rest';
  burst(e.x, e.y - 25, 7, HEARTH_CRUCIBLE_PALETTE.hot, 90, 0.35, 2, true);
}
function hearthGuardianBeginAttack(e) {
  const p = G.player,
    q = hearthTrial,
    c = e.crucible,
    patterns =
      q.tier === 0
        ? ['charge', 'cleave', 'rivets', 'charge']
        : q.tier === 1
          ? ['charge', 'cleave', 'sweep', 'rivets', 'quench']
          : e.phase === 2
            ? ['judgment', 'charge', 'sweep', 'forging', 'quench', 'rivets']
            : ['charge', 'forging', 'sweep', 'cleave', 'rivets', 'quench'];
  c.kind = patterns[c.serial++ % patterns.length];
  c.mode = 'attack';
  c.t = 0;
  c.fired = {};
  c.a = Math.atan2(p.y - e.y, p.x - e.x);
  c.turn = c.serial % 2 ? 1 : -1;
  e.trialAngle = c.a;
  e.trialMode = 'attack';
  if (c.kind === 'charge') {
    c.warning = [0.98, 0.88, 0.8][q.tier];
    c.dashDuration = 0.62;
    c.dashSpeed = [660, 740, 820][q.tier] + e.phase * 25;
    c.returnStroke = q.tier === 2 && e.phase > 0;
    c.returnWarning = 0.72;
    c.duration = c.warning + c.dashDuration + (c.returnStroke ? c.returnWarning + 0.62 : 0);
    c.originX = e.x;
    c.originY = e.y;
    c.dashBlocked = false;
    e.trialMode = 'chargeWind';
    hearthGuardianHazard(e, 'lane', {
      warning: c.warning,
      life: c.dashDuration,
      width: e.r + 4,
      length: hearthGuardianRayLength(e.x, e.y, c.a, c.dashSpeed * c.dashDuration + 42),
    });
  } else if (c.kind === 'cleave') {
    c.duration = q.tier === 2 && e.phase > 0 ? 2.2 : 1.35;
    hearthGuardianHazard(e, 'sector', {
      a: c.a,
      warning: [0.95, 0.86, 0.8][q.tier],
      life: 0.25,
      radius: [165, 185, 205][q.tier],
      halfArc: 1.42,
    });
  } else if (c.kind === 'rivets') {
    c.duration = [2.35, 3.1, 3.7][q.tier];
  } else if (c.kind === 'sweep') {
    c.duration = q.tier === 2 && e.phase > 0 ? 5.75 : 3.8;
    hearthGuardianHazard(e, 'beam', {
      a: c.a - c.turn * 0.9,
      turn: c.turn * (q.tier === 2 ? 2.65 : 2.2),
      warning: 1.05,
      life: 2.5,
      width: q.tier === 2 ? 11 : 9,
      damage: Math.round(e.dmg * 0.88),
    });
  } else if (c.kind === 'quench') {
    c.duration = q.tier === 2 ? 3.65 : 2.5;
    hearthGuardianRing(e);
  } else if (c.kind === 'forging') {
    c.duration = 3.65;
  } else {
    c.duration = 6.65;
    hearthGuardianHazard(e, 'sector', {
      a: c.a,
      warning: 0.85,
      life: 0.23,
      radius: 210,
      halfArc: 1.4,
    });
  }
  sfx('charge');
}
function hearthGuardianDash(e, dt, a, speed, blockedKey) {
  const c = e.crucible;
  if (dt <= 0 || c[blockedKey]) return;
  const x = e.x,
    y = e.y,
    p = G.player,
    prev = hearthTrial.guardianPreviousPlayer || p;
  c[blockedKey] = moveEnt(G.world, e, Math.cos(a) * speed * dt, Math.sin(a) * speed * dt);
  e.trialMode = 'dash';
  e.trialAngle = a;
  if (hearthGuardianSegmentsTouch(x, y, e.x, e.y, prev.x, prev.y, p.x, p.y, e.r + p.r))
    hurtPlayer(e.dmg, x, y);
  if (c[blockedKey]) burst(e.x, e.y, 9, HEARTH_CRUCIBLE_PALETTE.edge, 140, 0.3, 3, true);
}
function tickHearthTrialGuardian(e, dt) {
  if (e.dead || !hearthTrial || hearthTrial.result) return;
  const c = e.crucible,
    p = G.player,
    q = hearthTrial,
    tier = q.tier,
    before = c.t,
    nextPhase = tier === 2 && e.hp <= e.max * 0.25 ? 2 : e.hp <= e.max * 0.55 ? 1 : 0;
  c.vx = Math.max(-300, Math.min(300, (p.x - c.playerX) / Math.max(0.001, dt)));
  c.vy = Math.max(-300, Math.min(300, (p.y - c.playerY) / Math.max(0.001, dt)));
  c.playerX = p.x;
  c.playerY = p.y;
  c.step += dt;
  if (nextPhase > e.phase && ['approach', 'recover'].includes(c.mode)) {
    e.phase = nextPhase;
    e.cruciblePhase = nextPhase + 1;
    c.mode = 'temper';
    c.t = 0;
    c.duration = 1.25;
    c.kind = '';
    e.trialMode = 'temper';
    q.guardianHazards = [];
    burst(e.x, e.y - 20, 22, HEARTH_CRUCIBLE_PALETTE.hot, 190, 0.6, 3, true);
    sfx('charge');
    return;
  }
  c.t += dt;
  if (c.mode === 'temper') {
    if (c.t >= c.duration) {
      c.mode = 'approach';
      c.t = 0;
      c.duration = 0.45;
      e.trialMode = 'walk';
    }
    return;
  }
  if (c.mode === 'recover') {
    e.trialMode = 'rest';
    if (c.t >= c.duration) {
      c.mode = 'approach';
      c.t = 0;
      c.duration = e.phase ? 0.45 : 0.65;
      e.trialMode = 'walk';
    }
    return;
  }
  if (c.mode === 'approach') {
    const a = Math.atan2(p.y - e.y, p.x - e.x),
      d = Math.hypot(p.x - e.x, p.y - e.y),
      lean = d < 125 ? -0.5 : d < 220 ? 0.65 : 1.35,
      side = Math.sin(c.serial * 1.7) * 0.28,
      speed = e.spd * (1 + e.phase * 0.12);
    moveEnt(
      G.world,
      e,
      (Math.cos(a) * lean - Math.sin(a) * side) * speed * dt,
      (Math.sin(a) * lean + Math.cos(a) * side) * speed * dt
    );
    c.a = a;
    e.trialAngle = a;
    e.trialMode = 'walk';
    if (c.t >= c.duration) hearthGuardianBeginAttack(e);
    return;
  }
  if (c.kind === 'charge') {
    hearthGuardianOnce(c, 'launch', c.warning, () => sfx('dash'));
    const first =
      Math.max(0, Math.min(c.t - c.warning, c.dashDuration)) -
      Math.max(0, Math.min(before - c.warning, c.dashDuration));
    hearthGuardianDash(e, first, c.a, c.dashSpeed, 'dashBlocked');
    if (c.returnStroke) {
      const returnAt = c.warning + c.dashDuration;
      hearthGuardianOnce(c, 'returnWarning', returnAt, () => {
        c.returnA = Math.atan2(c.originY - e.y, c.originX - e.x);
        c.returnBlocked = false;
        e.trialMode = 'chargeWind';
        hearthGuardianHazard(e, 'lane', {
          a: c.returnA,
          warning: c.returnWarning,
          life: 0.62,
          width: e.r + 4,
          length: hearthGuardianRayLength(e.x, e.y, c.returnA, c.dashSpeed * 0.62 + 42),
        });
      });
      const launchAt = returnAt + c.returnWarning,
        second =
          Math.max(0, Math.min(c.t - launchAt, 0.62)) -
          Math.max(0, Math.min(before - launchAt, 0.62));
      hearthGuardianOnce(c, 'returnLaunch', launchAt, () => sfx('dash'));
      hearthGuardianDash(e, second, c.returnA, c.dashSpeed * 1.05, 'returnBlocked');
    }
  } else if (c.kind === 'cleave') {
    if (tier === 2 && e.phase > 0)
      hearthGuardianOnce(c, 'backstroke', 1.12, () => {
        hearthGuardianHazard(e, 'sector', {
          a: c.a + Math.PI,
          warning: 0.72,
          life: 0.22,
          radius: 190,
          halfArc: 1.32,
        });
      });
  } else if (c.kind === 'rivets') {
    const salvos = [2, 3, 4][tier];
    for (let i = 0; i < salvos; i++)
      hearthGuardianOnce(c, 'rivet' + i, i * 0.8, () =>
        hearthGuardianFan(e, 0.75, [3, 5, 7][tier])
      );
  } else if (c.kind === 'sweep') {
    e.trialAngle =
      c.a -
      c.turn * 0.9 +
      c.turn * Math.max(0, Math.min(1, (c.t - 1.05) / 2.5)) * (tier === 2 ? 2.65 : 2.2);
    if (tier === 2 && e.phase > 0)
      hearthGuardianOnce(c, 'returnSweep', 3.62, () => {
        hearthGuardianHazard(e, 'beam', {
          a: e.trialAngle,
          turn: -c.turn * 2,
          warning: 0.82,
          life: 1.15,
          width: 10,
          damage: Math.round(e.dmg * 0.88),
        });
      });
  } else if (c.kind === 'quench') {
    hearthGuardianOnce(c, 'quenchFan', 0.25, () => hearthGuardianFan(e, 0.85, tier === 2 ? 5 : 3));
    if (tier === 2)
      hearthGuardianOnce(c, 'quenchReturn', 1.25, () => hearthGuardianRing(e, 0.88, c.turn * 0.95));
  } else if (c.kind === 'forging') {
    for (let i = 0; i < (e.phase === 2 ? 4 : 3); i++)
      hearthGuardianOnce(c, 'pillar' + i, i * 0.42, () => {
        hearthGuardianPillar(e, p.x + c.vx * 0.3, p.y + c.vy * 0.3);
      });
    hearthGuardianOnce(c, 'forgeFan', 1.5, () => hearthGuardianFan(e, 0.8, 7, 0.15));
    if (e.phase === 2) hearthGuardianOnce(c, 'forgeRing', 1.75, () => hearthGuardianRing(e, 0.95));
  } else if (c.kind === 'judgment') {
    hearthGuardianOnce(c, 'judgmentSweep', 1.15, () => {
      hearthGuardianHazard(e, 'beam', {
        a: Math.atan2(p.y - e.y, p.x - e.x) - c.turn * 1,
        turn: c.turn * 2.2,
        warning: 0.92,
        life: 1.7,
        width: 11,
        damage: Math.round(e.dmg * 0.9),
      });
    });
    hearthGuardianOnce(c, 'judgmentRing', 3.35, () => hearthGuardianRing(e, 0.9));
    for (let i = 0; i < 3; i++)
      hearthGuardianOnce(c, 'judgmentPillar' + i, 4.1 + i * 0.38, () => {
        hearthGuardianPillar(e, p.x + c.vx * 0.25, p.y + c.vy * 0.25, 0.9);
      });
  }
  if (c.t >= c.duration) hearthGuardianRecover(e);
}
function hearthGuardianDamage(e, amount, kind = 'shot') {
  if (!e?.crucible || e.dead) return amount;
  const exposed = e.crucible.mode === 'recover',
    multiplier = exposed ? 1.5 : e.crucible.mode === 'temper' ? 1.18 : 0.9;
  return amount * multiplier * (kind === 'melee' ? 1.18 : 1);
}
function tickHearthGuardianHazards(dt) {
  const q = hearthTrial,
    p = G.player;
  if (!q || q.id !== 'guardian' || q.result || !p) return;
  if (!G.boss || G.boss.dead) {
    q.guardianHazards = [];
    q.guardianPreviousPlayer = { x: p.x, y: p.y };
    return;
  }
  const prev = q.guardianPreviousPlayer || p;
  for (const h of q.guardianHazards || []) {
    const before = h.t;
    h.t += dt;
    if (h.t < h.warning) continue;
    if (before < h.warning) {
      sfx(h.kind === 'fan' ? 'eshoot' : 'dash');
      if (h.kind === 'pillar') burst(h.x, h.y, 8, HEARTH_CRUCIBLE_PALETTE.hot, 115, 0.4, 2, true);
    }
    if (h.kind === 'fan') {
      if (!h.fired) {
        h.fired = true;
        for (let i = 0; i < h.count && G.ebul.length < 160; i++) {
          const a = h.a + (i - (h.count - 1) / 2) * h.spread;
          G.ebul.push({
            x: h.x + Math.cos(a) * 46,
            y: h.y + Math.sin(a) * 46,
            vx: Math.cos(a) * h.speed,
            vy: Math.sin(a) * h.speed,
            r: 5,
            dmg: h.damage,
            life: 3.7,
            lateColor: HEARTH_CRUCIBLE_PALETTE.ember,
          });
        }
      }
      continue;
    }
    if (h.kind === 'lane') continue;
    if (h.t > h.warning + h.life && before > h.warning + h.life) continue;
    let hit = false;
    if (h.kind === 'sector' || h.kind === 'pillar') {
      const n = Math.max(1, Math.ceil(Math.hypot(p.x - prev.x, p.y - prev.y) / 5));
      for (let i = 0; i <= n && !hit; i++) {
        const px = prev.x + (p.x - prev.x) * (i / n),
          py = prev.y + (p.y - prev.y) * (i / n),
          d = Math.hypot(px - h.x, py - h.y);
        hit =
          d <= h.radius + p.r &&
          (h.kind === 'pillar' ||
            Math.abs(hearthGuardianAngle(Math.atan2(py - h.y, px - h.x), h.a)) <=
              h.halfArc + Math.asin(Math.min(1, p.r / Math.max(p.r, d))));
      }
    } else if (h.kind === 'ring') {
      const oldRadius = h.radius + Math.max(0, Math.min(h.life, before - h.warning)) * h.speed,
        radius = h.radius + Math.max(0, Math.min(h.life, h.t - h.warning)) * h.speed,
        n = Math.max(
          1,
          Math.ceil((Math.hypot(p.x - prev.x, p.y - prev.y) + radius - oldRadius) / 4)
        );
      for (let i = 0; i <= n && !hit; i++) {
        const f = i / n,
          px = prev.x + (p.x - prev.x) * f,
          py = prev.y + (p.y - prev.y) * f,
          r = oldRadius + (radius - oldRadius) * f,
          d = Math.hypot(px - h.x, py - h.y),
          a = Math.atan2(py - h.y, px - h.x),
          pad = Math.asin(Math.min(1, (p.r + h.width / 2) / Math.max(1, d)));
        hit =
          Math.abs(d - r) <= p.r + h.width / 2 &&
          Math.abs(hearthGuardianAngle(a, h.a)) >= h.gap - pad;
      }
    } else if (h.kind === 'beam') {
      const oldAngle = h.a + h.turn * Math.max(0, Math.min(1, (before - h.warning) / h.life)),
        angle = h.a + h.turn * Math.max(0, Math.min(1, (h.t - h.warning) / h.life)),
        far = Math.max(Math.hypot(prev.x - h.x, prev.y - h.y), Math.hypot(p.x - h.x, p.y - h.y)),
        n = Math.max(
          1,
          Math.ceil((Math.abs(angle - oldAngle) * far + Math.hypot(p.x - prev.x, p.y - prev.y)) / 4)
        );
      for (let i = 0; i <= n && !hit; i++) {
        const f = i / n,
          a = oldAngle + (angle - oldAngle) * f,
          len = hearthGuardianRayLength(h.x, h.y, a),
          px = prev.x + (p.x - prev.x) * f,
          py = prev.y + (p.y - prev.y) * f;
        hit =
          hearthGuardianPointDistance(
            px,
            py,
            h.x + Math.cos(a) * 42,
            h.y + Math.sin(a) * 42,
            h.x + Math.cos(a) * len,
            h.y + Math.sin(a) * len
          ) <=
          p.r + h.width / 2;
      }
    }
    if (hit && los(G.world, h.x, h.y, p.x, p.y)) hurtPlayer(h.damage, h.x, h.y);
  }
  q.guardianHazards = (q.guardianHazards || []).filter(
    (h) => !h.owner.dead && h.t <= h.warning + h.life
  );
  q.guardianPreviousPlayer = { x: p.x, y: p.y };
}
function hearthGuardianArc(ctx, x, y, radius, a, halfArc, width = 3, gap = false) {
  const count = Math.max(24, Math.ceil(radius / 3)),
    step = (Math.PI * 2) / count;
  for (let i = 0; i < count; i++) {
    const angle = i * step,
      inside = Math.abs(hearthGuardianAngle(angle, a)) <= halfArc;
    if (gap ? inside : !inside) continue;
    ctx.fillRect(
      Math.round(x + Math.cos(angle) * radius - width / 2),
      Math.round(y + Math.sin(angle) * radius - width / 2),
      width,
      width
    );
  }
}
function drawHearthGuardianHazards(ctx) {
  const q = hearthTrial;
  if (!q || q.id !== 'guardian') return;
  ctx.save();
  for (const h of q.guardianHazards || []) {
    const warning = h.t < h.warning,
      progress = Math.max(0, Math.min(1, h.t / h.warning)),
      pulse = save.motion ? 0.8 : 0.76 + Math.sin(G.tAll * 16) * 0.16;
    ctx.fillStyle = warning ? '#d9ad70' : '#ffd491';
    ctx.strokeStyle = warning ? '#d9ad70' : '#fff1c3';
    ctx.globalAlpha = warning ? 0.22 + progress * 0.28 : 0.85;
    if (h.kind === 'lane' || h.kind === 'beam' || h.kind === 'fan') {
      const a =
          h.kind === 'beam'
            ? h.a + (h.turn || 0) * Math.max(0, Math.min(1, (h.t - h.warning) / h.life))
            : h.a,
        angles =
          h.kind === 'fan'
            ? Array.from({ length: h.count }, (_, i) => a + (i - (h.count - 1) / 2) * h.spread)
            : [a];
      for (const angle of angles) {
        const length = h.kind === 'lane' ? h.length : hearthGuardianRayLength(h.x, h.y, angle),
          width = h.kind === 'lane' ? h.width * 2 : h.kind === 'fan' ? 2 : warning ? 3 : h.width;
        ctx.save();
        ctx.translate(Math.round(h.x), Math.round(h.y));
        ctx.rotate(angle);
        if (h.kind === 'lane') {
          ctx.globalAlpha = warning ? 0.12 + progress * 0.08 : 0.1;
          ctx.fillRect(0, -width / 2, length, width);
          ctx.globalAlpha = (warning ? 0.36 : 0.5) * pulse;
          ctx.fillRect(0, -width / 2, length, 2);
          ctx.fillRect(0, width / 2 - 2, length, 2);
          for (let x = 45; x < length; x += 52) {
            ctx.fillRect(x, -3, 14, 6);
            ctx.fillRect(x + 10, -7, 4, 14);
          }
        } else {
          if (!warning && h.kind === 'beam') {
            ctx.globalAlpha = 0.13;
            ctx.fillRect(42, -width * 1.8, Math.max(0, length - 42), width * 3.6);
            ctx.globalAlpha = 0.9;
          }
          ctx.fillRect(42, -width / 2, Math.max(0, length - 42), width);
          if (warning) {
            ctx.globalAlpha = 0.7 * pulse;
            ctx.fillRect(42, -4, 8 + progress * 18, 8);
          }
        }
        ctx.restore();
      }
      if (h.kind === 'beam' && warning) {
        ctx.globalAlpha = 0.25;
        hearthGuardianArc(ctx, h.x, h.y, 88, h.a + h.turn / 2, Math.abs(h.turn) / 2, 3);
        ctx.fillStyle = '#fff1c3';
        ctx.fillRect(h.x + Math.cos(h.a) * 88 - 4, h.y + Math.sin(h.a) * 88 - 4, 8, 8);
      }
    } else if (h.kind === 'sector') {
      ctx.beginPath();
      ctx.moveTo(h.x, h.y);
      ctx.arc(h.x, h.y, h.radius, h.a - h.halfArc, h.a + h.halfArc);
      ctx.closePath();
      ctx.globalAlpha = warning ? 0.09 + progress * 0.1 : 0.32;
      ctx.fill();
      ctx.globalAlpha = warning ? 0.45 + progress * 0.2 : 0.9;
      hearthGuardianArc(ctx, h.x, h.y, h.radius, h.a, h.halfArc, warning ? 3 : 7);
      for (const a of [h.a - h.halfArc, h.a + h.halfArc]) {
        ctx.beginPath();
        ctx.moveTo(h.x, h.y);
        ctx.lineTo(h.x + Math.cos(a) * h.radius, h.y + Math.sin(a) * h.radius);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    } else if (h.kind === 'ring') {
      const radius = h.radius + Math.max(0, h.t - h.warning) * h.speed;
      ctx.globalAlpha = warning ? 0.4 + progress * 0.3 : 0.9;
      hearthGuardianArc(ctx, h.x, h.y, radius, h.a, h.gap, warning ? 3 : h.width, true);
      if (warning) {
        ctx.globalAlpha = 0.25;
        hearthGuardianArc(ctx, h.x, h.y, 88, h.a, h.gap, 3, true);
      }
      ctx.fillStyle = '#bde1c2';
      ctx.globalAlpha = warning ? 0.8 : 0.6;
      for (const a of [h.a - h.gap, h.a + h.gap])
        ctx.fillRect(
          Math.round(h.x + Math.cos(a) * radius) - 3,
          Math.round(h.y + Math.sin(a) * radius) - 3,
          6,
          6
        );
    } else if (h.kind === 'pillar') {
      ctx.globalAlpha = warning ? 0.16 + progress * 0.16 : 0.4;
      ctx.fillRect(h.x - h.radius * 0.72, h.y - h.radius * 0.72, h.radius * 1.44, h.radius * 1.44);
      ctx.globalAlpha = warning ? 0.45 + progress * 0.3 : 0.85;
      hearthGuardianArc(ctx, h.x, h.y, h.radius, 0, Math.PI, warning ? 3 : 6);
      ctx.fillRect(h.x - 14, h.y - 2, 28, 4);
      ctx.fillRect(h.x - 2, h.y - 14, 4, 28);
      if (!warning) {
        const flicker = save.motion ? 0 : Math.floor(G.tAll * 12 + h.x) % 3;
        ctx.fillStyle = '#8d4c2e';
        ctx.fillRect(h.x - 17, h.y - 55, 34, 53);
        ctx.fillStyle = '#f29c52';
        ctx.fillRect(h.x - 13, h.y - 65 - flicker * 4, 26, 58);
        ctx.fillStyle = '#ffdaa0';
        ctx.fillRect(h.x - 6, h.y - 49, 12, 48);
        ctx.fillRect(h.x - 3, h.y - 73 + flicker * 3, 6, 27);
      }
    }
  }
  ctx.restore();
}
function hearthGuardianLink(ctx, ax, ay, bx, by, color, width = 4) {
  const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 3));
  ctx.fillStyle = color;
  for (let i = 0; i <= n; i++)
    ctx.fillRect(
      Math.round(ax + ((bx - ax) * i) / n - width / 2),
      Math.round(ay + ((by - ay) * i) / n - width / 2),
      width,
      width
    );
}
function hearthGuardianHammer(ctx, x, y, a, raised, palette) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(a);
  ctx.fillStyle = palette.dark;
  ctx.fillRect(-8, -4, 30, 10);
  ctx.fillRect(7, -18, 22, 34);
  ctx.fillStyle = palette.iron;
  ctx.fillRect(-6, -2, 24, 6);
  ctx.fillStyle = palette.bronze;
  ctx.fillRect(10, -15, 16, 28);
  ctx.fillStyle = palette.edge;
  ctx.fillRect(11, -14, 15, 4);
  ctx.fillRect(22, -10, 4, 20);
  ctx.fillStyle = raised ? palette.hot : palette.shadow;
  ctx.fillRect(12, -4, 9, 8);
  ctx.fillStyle = palette.light;
  ctx.fillRect(12, -12, 3, 3);
  ctx.fillRect(12, 7, 3, 3);
  ctx.restore();
}
function drawHearthTrialGuardian(ctx, e) {
  if (e.dead || !e.crucible) return;
  const c = e.crucible,
    palette = HEARTH_CRUCIBLE_PALETTE,
    t = save.motion ? 0 : G.tAll,
    hot = c.mode === 'attack' || c.mode === 'temper',
    open = c.mode === 'recover' || c.mode === 'temper',
    stride = save.motion ? 0 : Math.sin(c.step * 7) * (c.mode === 'approach' ? 5 : 1.5),
    bob = save.motion ? 0 : Math.sin(t * 3.2) * 2,
    orbit = t * (e.phase === 2 ? 1.3 : 0.8),
    phaseColor = e.phase === 2 ? '#fff1c3' : e.phase ? '#ffb86c' : palette.ember;
  ctx.save();
  ctx.translate(Math.round(e.x), Math.round(e.y));
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#080b12aa';
  ctx.fillRect(-53, 27, 106, 12);
  ctx.fillRect(-39, 39, 78, 4);
  const satellites = Array.from({ length: 3 }, (_, i) => {
    const a = orbit + (i * Math.PI * 2) / 3,
      spread = open ? 15 : 0;
    return { a, x: Math.cos(a) * (61 + spread), y: Math.sin(a) * 27 - 33 + bob };
  });
  for (const s of satellites.filter((part) => Math.sin(part.a) < 0)) {
    hearthGuardianLink(ctx, s.x * 0.35, s.y * 0.5 - 20, s.x, s.y, palette.shadow, 5);
    hearthGuardianHammer(ctx, s.x, s.y, s.a + Math.PI / 2, hot, palette);
  }
  for (const [side, lift] of [
    [-1, stride],
    [1, -stride],
  ]) {
    const hipX = side * 25,
      kneeX = side * 44,
      kneeY = 12 + lift,
      footX = side * 50,
      footY = 30;
    hearthGuardianLink(ctx, hipX, -1, kneeX, kneeY, palette.dark, 12);
    hearthGuardianLink(ctx, kneeX, kneeY, footX, footY, palette.dark, 11);
    hearthGuardianLink(ctx, hipX, -1, kneeX, kneeY, palette.bronze, 6);
    hearthGuardianLink(ctx, kneeX, kneeY, footX, footY, palette.iron, 6);
    ctx.fillStyle = palette.edge;
    ctx.fillRect(kneeX - 5, kneeY - 4, 10, 8);
    ctx.fillStyle = palette.shadow;
    ctx.fillRect(footX - 12, footY - 1, 25, 9);
    ctx.fillStyle = palette.edge;
    ctx.fillRect(footX - 11, footY, 22, 3);
  }
  hearthGuardianLink(ctx, 0, 4, 0, 36, palette.dark, 15);
  hearthGuardianLink(ctx, -1, 6, -1, 33, palette.bronze, 7);
  ctx.fillStyle = palette.dark;
  ctx.fillRect(-15, 32, 31, 12);
  ctx.fillStyle = palette.bronze;
  ctx.fillRect(-13, 34, 27, 7);
  ctx.fillStyle = palette.edge;
  ctx.fillRect(-12, 34, 25, 3);
  ctx.save();
  ctx.translate(0, Math.round(bob));
  ctx.fillStyle = palette.dark;
  ctx.fillRect(-29, -69, 58, 81);
  ctx.fillRect(-39, -57, 78, 57);
  ctx.fillRect(-33, -62, 66, 66);
  ctx.fillRect(-23, 12, 46, 6);
  ctx.fillStyle = palette.iron;
  ctx.fillRect(-26, -64, 52, 71);
  ctx.fillRect(-34, -52, 68, 49);
  ctx.fillStyle = palette.shadow;
  ctx.fillRect(-30, -55, 15, 47);
  ctx.fillRect(18, -55, 12, 47);
  ctx.fillStyle = palette.bronze;
  ctx.fillRect(-32, -55, 5, 46);
  ctx.fillRect(26, -55, 6, 46);
  ctx.fillRect(-25, -65, 50, 8);
  ctx.fillRect(-29, -7, 58, 9);
  ctx.fillRect(-20, 5, 40, 8);
  ctx.fillStyle = palette.edge;
  ctx.fillRect(-25, -65, 49, 3);
  ctx.fillRect(-32, -55, 3, 42);
  ctx.fillRect(-29, -7, 57, 3);
  ctx.fillStyle = palette.light;
  for (const [x, y] of [
    [-25, -52],
    [25, -52],
    [-25, -14],
    [25, -14],
  ])
    ctx.fillRect(x - 2, y - 2, 4, 4);
  ctx.fillStyle = palette.dark;
  ctx.fillRect(-19, -91, 38, 24);
  ctx.fillRect(-25, -83, 50, 9);
  ctx.fillStyle = palette.bronze;
  ctx.fillRect(-16, -88, 32, 19);
  ctx.fillRect(-22, -81, 44, 5);
  ctx.fillStyle = palette.edge;
  ctx.fillRect(-16, -88, 31, 3);
  ctx.fillRect(-22, -81, 43, 2);
  ctx.fillStyle = '#221d21';
  for (let x = -10; x <= 8; x += 9) ctx.fillRect(x, -85, 4, 11);
  ctx.fillStyle = phaseColor;
  for (let x = -10; x <= 8; x += 9) ctx.fillRect(x, -81, 3, 5);
  const shimmer = save.motion ? 0 : Math.floor(t * 9) % 3;
  ctx.globalAlpha = hot ? 0.8 : 0.42;
  ctx.fillStyle = palette.ember;
  ctx.fillRect(-9, -96 - shimmer * 2, 6, 8 + shimmer * 2);
  ctx.fillRect(3, -101 + shimmer * 2, 6, 12 - shimmer * 2);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#100f15';
  ctx.fillRect(-20, -54, 40, 42);
  ctx.fillRect(-25, -46, 50, 26);
  ctx.fillStyle = '#703c2c';
  ctx.fillRect(-17, -51, 34, 37);
  ctx.fillRect(-21, -42, 42, 20);
  ctx.fillStyle = phaseColor;
  ctx.fillRect(-10, -49, 20, 31);
  ctx.fillRect(-16, -41, 32, 16);
  ctx.fillRect(-5, -55 - shimmer, 10, 43 + shimmer);
  ctx.fillStyle = palette.hot;
  ctx.fillRect(-7, -45, 14, 23);
  ctx.fillRect(-11, -38, 22, 10);
  ctx.fillStyle = palette.core;
  ctx.fillRect(-4, -41, 8, 17);
  ctx.fillRect(-7, -36, 14, 7);
  const shutter = open ? 24 : 8;
  for (const side of [-1, 1]) {
    const x = side < 0 ? -16 - shutter : 8 + shutter;
    ctx.fillStyle = palette.dark;
    ctx.fillRect(x - 2, -54, 16, 42);
    ctx.fillStyle = palette.bronze;
    ctx.fillRect(x, -52, 12, 38);
    ctx.fillStyle = palette.edge;
    ctx.fillRect(x, -52, 3, 38);
    ctx.fillRect(x, -52, 12, 3);
    ctx.fillStyle = palette.shadow;
    ctx.fillRect(x + 5, -44, 4, 22);
  }
  if (e.phase > 0) {
    ctx.fillStyle = phaseColor;
    ctx.fillRect(-29, -26, 3, 12);
    ctx.fillRect(28, -39, 3, 11);
    ctx.fillRect(-9, 7, 19, 3);
  }
  if (e.phase === 2) {
    ctx.fillRect(-22, -60, 4, 9);
    ctx.fillRect(18, -16, 10, 3);
    ctx.fillStyle = palette.ember;
    ctx.fillRect(-35, -34, 5, 8);
    ctx.fillRect(31, -48, 5, 8);
  }
  ctx.restore();
  for (const s of satellites.filter((part) => Math.sin(part.a) >= 0)) {
    hearthGuardianLink(ctx, s.x * 0.35, s.y * 0.5 - 20, s.x, s.y, palette.dark, 7);
    hearthGuardianLink(ctx, s.x * 0.35, s.y * 0.5 - 20, s.x, s.y, palette.bronze, 3);
    ctx.fillStyle = palette.edge;
    ctx.fillRect(Math.round(s.x) - 5, Math.round(s.y) - 4, 10, 8);
    hearthGuardianHammer(ctx, s.x, s.y, s.a + Math.PI / 2, hot, palette);
  }
  if (open) {
    ctx.fillStyle = '#ffe7b3';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(-3, 49, 6, 6);
    ctx.fillRect(-12, 51, 5, 2);
    ctx.fillRect(7, 51, 5, 2);
    ctx.globalAlpha = 1;
  }
  if (e.hitT > 0) {
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#fff1c3';
    ctx.fillRect(-20, -55 + bob, 40, 3);
    ctx.fillRect(-3, -47 + bob, 6, 25);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  const left = G.cam.x + 35,
    right = G.cam.x + G.w - 35,
    top = G.cam.y + 95,
    bottom = G.cam.y + G.h - 75;
  if (e.x < left || e.x > right || e.y < top || e.y > bottom) {
    const px = Math.max(left, Math.min(right, e.x)),
      py = Math.max(top, Math.min(bottom, e.y)),
      a = Math.atan2(e.y - py, e.x - px);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(a);
    ctx.fillStyle = '#edbe7d';
    ctx.fillRect(-6, -5, 10, 10);
    ctx.fillRect(4, -3, 5, 6);
    ctx.fillRect(9, -1, 3, 2);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = '#ffe1ab';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(c.kind === 'charge' ? 'CRUCIBLE · CHARGE' : 'CRUCIBLE', px, py + 20);
    ctx.restore();
  }
}
