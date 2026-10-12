const BELLKEEPER_WATER_TIMING = { dive: 0.5, travel: 0.46, rise: 0.58 };
const BELLKEEPER_PIXEL_BODY = document.createElement('canvas');
BELLKEEPER_PIXEL_BODY.width = BELLKEEPER_PIXEL_BODY.height = 144;
if (!MID_SEQUENCES.bellkeeper[1].includes('returningToll'))
  MID_SEQUENCES.bellkeeper[1].splice(2, 0, 'returningToll');

function bellkeeperWaterPose(b) {
  const water = b.bs?.mid?.bellWater;
  if (!water) return { stage: 'surface', u: 0, drop: 0 };
  const age = Math.max(0, water.elapsed ?? (b.bs.mid.age || 0) - water.started),
    timing = BELLKEEPER_WATER_TIMING;
  if (age < timing.dive) {
    const u = clamp(age / timing.dive, 0, 1);
    return { stage: 'dive', u, drop: 154 * smoothBoss(u) };
  }
  if (age < timing.dive + timing.travel)
    return { stage: 'travel', u: (age - timing.dive) / timing.travel, drop: 154 };
  const u = clamp((age - timing.dive - timing.travel) / timing.rise, 0, 1);
  return { stage: 'rise', u, drop: 154 * (1 - smoothBoss(u)) };
}

function bellkeeperSubmersionDepth(b, pose) {
  let transform = [1, 0, 0, 1, 0, 0],
    minimum = Infinity,
    pathMinimum = Infinity;
  const stack = [],
    point = (x, y) => transform[1] * x + transform[3] * y + transform[5],
    bounds = {
      lineWidth: 1,
      save() {
        stack.push({ transform: transform.slice(), lineWidth: this.lineWidth });
      },
      restore() {
        const last = stack.pop();
        transform = last.transform;
        this.lineWidth = last.lineWidth;
      },
      rotate(angle) {
        const [a, b, c, d, e, f] = transform,
          cosine = Math.cos(angle),
          sine = Math.sin(angle);
        transform = [
          a * cosine + c * sine,
          b * cosine + d * sine,
          c * cosine - a * sine,
          d * cosine - b * sine,
          e,
          f,
        ];
      },
      translate(x, y) {
        transform[4] += transform[0] * x + transform[2] * y;
        transform[5] += transform[1] * x + transform[3] * y;
      },
      beginPath() {
        pathMinimum = Infinity;
      },
      moveTo(x, y) {
        pathMinimum = Math.min(pathMinimum, point(x, y));
      },
      lineTo(x, y) {
        this.moveTo(x, y);
      },
      closePath() {},
      fill() {
        minimum = Math.min(minimum, pathMinimum);
      },
      stroke() {
        minimum = Math.min(minimum, pathMinimum - this.lineWidth / 2);
      },
      fillRect(x, y, width, height) {
        minimum = Math.min(
          minimum,
          point(x, y),
          point(x + width, y),
          point(x, y + height),
          point(x + width, y + height)
        );
      },
    };
  bellkeeperBodyParts(bounds, b, pose);
  return 24 - Math.max(-144 / 1.4, minimum);
}

const bellkeeperStartMove = startBellMove;
startBellMove = function (b, kind) {
  if (kind === 'undertow') {
    const target = midArenaPoint(G.player.x, G.player.y, 60);
    return beginMidMove(
      b,
      kind,
      0.32,
      2.5,
      [{ at: 0.02, type: 'bellSink', x: target.x, y: target.y }],
      target
    );
  }
  if (kind === 'returningToll') {
    const target = midArenaPoint(G.player.x, G.player.y, 60);
    return beginMidMove(
      b,
      kind,
      0.56,
      3.4,
      [
        { at: 0.04, type: 'bellOutward' },
        { at: 1.32, type: 'bellReturning' },
        { at: 2.44, type: 'bellJet' },
      ],
      target
    );
  }
  return bellkeeperStartMove(b, kind);
};

function bellkeeperBeginDive(b, event) {
  const m = b.bs.mid,
    target = midArenaPoint(event.x ?? m.targetX, event.y ?? m.targetY, 60),
    point = safePosition(G.world, target.x, target.y, b.r) || target;
  m.bellWater = {
    started: m.age,
    elapsed: 0,
    fromX: b.x,
    fromY: b.y,
    toX: point.x,
    toY: point.y,
    submerged: false,
    emerged: false,
    interrupted: false,
    heading: b.bs.a || 0,
  };
  b.kbx = b.kby = 0;
  b.alpha = 1;
  sfx('midBell');
}

function bellkeeperTickDive(b, dt) {
  const m = b.bs.mid,
    water = m?.bellWater;
  if (!water) return;
  water.elapsed = (water.elapsed ?? Math.max(0, (m.age || 0) - water.started)) + dt;
  if (b.bs.mode !== 'slam' || b.bs.kind !== 'undertow') water.interrupted = true;
  const pose = bellkeeperWaterPose(b);
  if (pose.stage === 'travel') {
    const u = smoothBoss(pose.u);
    b.x = water.fromX + (water.toX - water.fromX) * u;
    b.y = water.fromY + (water.toY - water.fromY) * u;
  } else if (pose.stage === 'rise') {
    b.x = water.toX;
    b.y = water.toY;
    if (pose.u > 0.4 && !water.emerged) {
      water.emerged = true;
      const facing = Math.atan2(G.player.y - b.y, G.player.x - b.x);
      if (!water.interrupted)
        midHazard(b, 'toneRing', {
          x: b.x,
          y: b.y,
          startR: 24,
          endR: 260,
          gapA: facing,
          gapWidth: m.phase ? 0.82 : 0.98,
          width: 10,
          delay: 0.32,
          life: 1.45,
          damageMul: 0.72,
        });
      burst(b.x, b.y + 8, 14, '#abdfe3', 100, 0.45, 2, true);
      sfx('midBell');
      b.bs.exposed = Math.max(b.bs.exposed || 0, 1.35);
    }
    if (pose.u >= 1) {
      delete m.bellWater;
      m.invulnerable = false;
      b.alpha = 1;
      return;
    }
  }
  water.submerged = pose.drop >= bellkeeperSubmersionDepth(b, pose);
  m.invulnerable = water.submerged;
  if (water.submerged) b.hitT = 0;
  b.kbx = b.kby = 0;
  b.alpha = 1;
}

const bellkeeperMidEvent = fireMidEvent;
fireMidEvent = function (b, event) {
  if (b.bossKey !== 'bellkeeper') return bellkeeperMidEvent(b, event);
  if (event.type === 'bellSink') return bellkeeperBeginDive(b, event);
  if (event.type === 'bellRise' && b.bs.mid?.bellWater) return;
  if (event.type === 'bellOutward' || event.type === 'bellReturning') {
    const m = b.bs.mid,
      arena = arenaBounds(),
      returning = event.type === 'bellReturning',
      radius = clamp(Math.min(arena.right - arena.left, arena.bottom - arena.top) * 0.65, 210, 330);
    if (!returning) m.bellReturn = { x: b.x, y: b.y, gap: b.bs.a || 0, radius };
    const origin = m.bellReturn || { x: b.x, y: b.y, gap: b.bs.a || 0, radius };
    midHazard(b, 'toneRing', {
      x: origin.x,
      y: origin.y,
      startR: returning ? origin.radius : 24,
      endR: returning ? 24 : origin.radius,
      gapA: origin.gap + (returning ? Math.PI / 2 : 0),
      gapWidth: returning ? 0.94 : 1.06,
      width: returning ? 9 : 11,
      delay: 0.24,
      life: returning ? 1.45 : 1.12,
      damageMul: returning ? 0.68 : 0.72,
    });
    return;
  }
  if (event.type === 'bellJet') {
    const angle = Math.atan2(b.bs.mid.targetY - b.y, b.bs.mid.targetX - b.x);
    for (const offset of [-0.14, 0, 0.14])
      enemyShoot(b, angle + offset, 230, Math.round(b.dmg * 0.58));
    sfx('eshoot');
    return;
  }
  return bellkeeperMidEvent(b, event);
};

const bellkeeperMiddleAI = middleGuardianAI;
middleGuardianAI = function (b, dt, d, dx, dy) {
  const result = bellkeeperMiddleAI(b, dt, d, dx, dy);
  if (b.bossKey === 'bellkeeper') {
    const m = b.bs.mid,
      haste = m?.desperate ? 1.24 : m?.phase ? 1.14 : 1;
    bellkeeperTickDive(b, dt * midGuardianHaste() * haste);
  }
  return result;
};
bellkeeperAI = middleGuardianAI;

const bellkeeperDamageEnemy = damageEnemy;
damageEnemy = function (e, dmg, angle, crit, kb, kind = 'shot') {
  if (e?.bossKey === 'bellkeeper' && e.bs?.mid?.bellWater?.submerged) return;
  return bellkeeperDamageEnemy(e, dmg, angle, crit, kb, kind);
};

function bellkeeperPolygon(ctx, points, fill, outline = '#09151d', width = 2) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (outline) {
    ctx.strokeStyle = outline;
    ctx.lineWidth = width;
    ctx.stroke();
  }
}

function bellkeeperBodyParts(ctx, b, pose) {
  const s = b.bs || {},
    clock = save.motion ? 0 : (b.bs?.mid?.clock ?? G.tAll),
    swimming = !['windup', 'shift'].includes(s.mode),
    cast = s.kind === 'returningToll' || s.kind === 'toll' || s.kind === 'dissonance',
    wind = s.mode === 'windup' ? smoothBoss(1 - s.t / Math.max(0.01, s.duration)) : 0,
    strike = s.mode === 'slam' && cast ? Math.exp(-((s.mid?.age || 0) % 1.28) * 7) : 0,
    stroke = clock * (swimming ? 3.1 : 1.8),
    dive = pose.stage === 'dive' ? pose.u : pose.stage === 'rise' ? 1 - pose.u : 0,
    spine = Array.from({ length: 7 }, (_, i) => ({
      x: -77 + i * 12,
      y: Math.round(Math.sin(stroke - i * 0.62) * (7 - i * 0.55) - dive * (6 - i) * 2.3),
      r: 6 + i * 1.4,
    }));
  ctx.save();
  ctx.rotate(s.a || 0);
  const tail = spine[0];
  bellkeeperPolygon(
    ctx,
    [
      [tail.x + 4, tail.y - 5],
      [tail.x - 18, tail.y - 21 - Math.sin(stroke) * 4],
      [tail.x - 13, tail.y - 3],
      [tail.x - 20, tail.y + 20 + Math.sin(stroke) * 4],
      [tail.x + 4, tail.y + 5],
    ],
    '#315b67',
    '#6ab8c4'
  );
  for (let i = 0; i < spine.length - 1; i++) {
    const p = spine[i],
      q = spine[i + 1];
    bellkeeperPolygon(
      ctx,
      [
        [p.x - 5, p.y - p.r],
        [q.x + 6, q.y - q.r],
        [q.x + 6, q.y + q.r],
        [p.x - 5, p.y + p.r],
      ],
      i % 2 ? '#254957' : '#315b67',
      '#09151d',
      3
    );
    ctx.fillStyle = '#6aaeb9';
    ctx.fillRect(p.x, p.y - p.r + 2, 9, 2);
    ctx.fillStyle = '#173640';
    ctx.fillRect(p.x + 1, p.y + 4, 9, 3);
    ctx.fillStyle = '#8ccbd0';
    ctx.fillRect(p.x + 3, p.y - p.r + 1, 2, 2);
    bellkeeperPolygon(
      ctx,
      [
        [p.x + 2, p.y - p.r],
        [p.x - 4, p.y - p.r - 8],
        [p.x + 12, p.y - p.r - 3],
      ],
      '#477781',
      '#83bec6',
      1
    );
  }
  const headY = Math.round(Math.sin(stroke - 4.2) * 1.5 + wind * 4 - strike * 3);
  ctx.save();
  ctx.translate(0, headY);
  ctx.rotate(-wind * 0.09 + strike * 0.12);
  bellkeeperPolygon(
    ctx,
    [
      [-9, -4],
      [-2, -22],
      [19, -29],
      [43, -17],
      [54, -2],
      [46, 17],
      [20, 25],
      [-3, 13],
    ],
    '#102832',
    '#6bc7d7',
    3
  );
  bellkeeperPolygon(
    ctx,
    [
      [-2, -21],
      [-9, -40],
      [19, -27],
    ],
    '#386976',
    '#83dbe1'
  );
  const fin = Math.sin(stroke - 0.5) * 4;
  bellkeeperPolygon(
    ctx,
    [
      [6, 17],
      [-2 + fin, 37],
      [26, 22],
    ],
    '#315e6b',
    '#83dbe1'
  );
  bellkeeperPolygon(
    ctx,
    [
      [1, -16],
      [21, -21],
      [40, -13],
      [34, -5],
      [8, -5],
    ],
    '#315b67',
    null
  );
  ctx.fillStyle = '#6babb5';
  ctx.fillRect(9, -17, 9, 2);
  ctx.fillRect(20, -20, 8, 2);
  ctx.fillStyle = '#f2dda0';
  ctx.fillRect(38, -13, 9, 7);
  ctx.fillStyle = '#fff7ce';
  ctx.fillRect(39, -12, 3, 2);
  ctx.fillStyle = '#10151c';
  ctx.fillRect(43, -11, 3, 4);
  ctx.fillStyle = '#508a97';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(17 + i * 7, 2 + i * 2, 2, 7);
    ctx.fillStyle = i % 2 ? '#77bac3' : '#508a97';
  }
  const jaw = Math.round(strike * 6 + wind * 2);
  bellkeeperPolygon(
    ctx,
    [
      [29, 12],
      [49, 7],
      [43, 18 + jaw],
      [32, 20 + jaw],
    ],
    '#08131a',
    '#5baab6'
  );
  ctx.fillStyle = '#91bcc1';
  ctx.fillRect(39, 14, 3, 3);
  ctx.fillRect(44, 11, 2, 3);
  ctx.strokeStyle = '#75552a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-10, -25);
  ctx.lineTo(-4, -35);
  ctx.lineTo(16, -39);
  ctx.lineTo(38, -26);
  ctx.stroke();
  ctx.strokeStyle = '#d0ac65';
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const bx = -2 + i * 16,
      swing = save.motion
        ? 0
        : Math.sin(stroke - i * 0.48) * 0.11 + strike * (i - 1) * 0.44 - wind * 0.16;
    ctx.save();
    ctx.translate(bx, -30 + Math.abs(i - 1) * 5);
    ctx.rotate(swing);
    ctx.fillStyle = '#75552a';
    ctx.fillRect(-1, -1, 3, 10);
    bellkeeperPolygon(
      ctx,
      [
        [-6, 7],
        [6, 7],
        [9, 19],
        [-9, 19],
      ],
      cast && wind > 0.4 ? '#d9b25a' : '#a77c3e',
      '#e4c175',
      1.5
    );
    ctx.fillStyle = '#5d3d1d';
    ctx.fillRect(-2, 18, 4, 6);
    ctx.fillStyle = '#f0d58e';
    ctx.fillRect(-5, 10, 2, 6);
    ctx.fillRect(-7, 18, 14, 1);
    ctx.restore();
  }
  ctx.restore();
  ctx.restore();
}

function bellkeeperWaterMarks(ctx, b, pose) {
  const water = b.bs?.mid?.bellWater,
    active = pose.stage !== 'surface',
    clock = save.motion ? 0 : (b.bs?.mid?.clock ?? G.tAll);
  ctx.save();
  ctx.strokeStyle = '#7ac2ce';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < (active ? 4 : 2); i++) {
    const phase = (clock * 0.7 + i / 4) % 1;
    ctx.globalAlpha = (active ? 0.38 : 0.13) * (1 - phase);
    ctx.beginPath();
    ctx.ellipse(b.x, b.y + 18, 21 + phase * 42, 7 + phase * 13, 0, 0.1, Math.PI * 1.94);
    ctx.stroke();
  }
  if (water && !water.emerged) {
    const riseSoon = pose.stage === 'travel' ? pose.u : pose.stage === 'rise' ? 1 : 0.16;
    ctx.globalAlpha = 0.12 + riseSoon * 0.32;
    for (let i = 0; i < 7; i++) {
      const angle = i * 2.4,
        radius = 7 + ((i * 11 + clock * 14) % 23),
        x = water.toX + Math.cos(angle) * radius,
        y = water.toY + Math.sin(angle) * radius * 0.45;
      ctx.strokeRect(Math.round(x), Math.round(y - ((clock * 8 + i * 3) % 9)), 3, 3);
    }
    if (pose.stage === 'travel') {
      ctx.globalAlpha = 0.2;
      for (let i = 0; i < 5; i++) {
        const u = clamp(pose.u - i * 0.08, 0, 1),
          x = water.fromX + (water.toX - water.fromX) * smoothBoss(u),
          y = water.fromY + (water.toY - water.fromY) * smoothBoss(u);
        ctx.beginPath();
        ctx.ellipse(x, y + 10, 9 + i * 3, 3 + i, 0, Math.PI * 0.15, Math.PI * 0.84);
        ctx.stroke();
      }
    }
  }
  if (pose.stage === 'rise') {
    const splash = Math.sin(Math.PI * pose.u);
    ctx.fillStyle = '#b5e5e8';
    ctx.globalAlpha = splash * 0.8;
    for (let i = 0; i < 12; i++) {
      const angle = (i * TAU) / 12,
        radius = 17 + pose.u * 39,
        height = Math.sin(Math.PI * pose.u) * (15 + (i % 3) * 6);
      ctx.fillRect(
        Math.round(b.x + Math.cos(angle) * radius),
        Math.round(b.y + 17 + Math.sin(angle) * radius * 0.35 - height),
        2,
        4 + (i % 3)
      );
    }
  }
  ctx.restore();
}

const bellkeeperDrawBossBody = drawLateBossBody;
drawLateBossBody = function (ctx, b) {
  if (b.bossKey !== 'bellkeeper') return bellkeeperDrawBossBody(ctx, b);
  const pose = bellkeeperWaterPose(b),
    surface = BELLKEEPER_PIXEL_BODY,
    art = surface.getContext('2d');
  bellkeeperWaterMarks(ctx, b, pose);
  if (pose.drop > 0 && pose.drop >= bellkeeperSubmersionDepth(b, pose)) return;
  art.setTransform(1, 0, 0, 1, 0, 0);
  art.clearRect(0, 0, 144, 144);
  art.save();
  art.translate(72, 72);
  art.scale(0.7, 0.7);
  bellkeeperBodyParts(art, b, pose);
  art.restore();
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  if (pose.stage !== 'surface') {
    ctx.beginPath();
    ctx.rect(b.x - 140, b.y - 150, 280, 168);
    ctx.clip();
  }
  ctx.drawImage(surface, b.x - 144 / 1.4, b.y - 144 / 1.4 + pose.drop, 144 / 0.7, 144 / 0.7);
  ctx.restore();
};

const bellkeeperDrawLateEnemy = drawLateEnemy;
drawLateEnemy = function (ctx, e) {
  if (e.bossKey === 'bellkeeper' && e.bs?.mid?.bellWater?.submerged)
    return drawLateBossBody(ctx, e);
  return bellkeeperDrawLateEnemy(ctx, e);
};
