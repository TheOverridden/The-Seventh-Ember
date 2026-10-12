const KEEPER_BODY_FRAMES = [
  [0, 0, 0],
  [1, 0.018, 1],
  [2, 0.032, 2],
  [1, 0.018, 1],
  [0, 0, 0],
  [-1, -0.018, -1],
  [-2, -0.032, -2],
  [-1, -0.018, -1],
];
const KEEPER_BODY_SURFACE = document.createElement('canvas');
KEEPER_BODY_SURFACE.width = KEEPER_BODY_SURFACE.height = 144;

const keeperCradleAttack = encounterAttack;
encounterAttack = function (b) {
  const s = b.bs;
  if (b.bossKey !== 'keeper' || b.hp > b.max * 0.5 || ((s.cycle || 0) + 1) % 5 !== 0)
    return keeperCradleAttack(b);
  s.cycle++;
  s.kind = 'cinderCradle';
  s.mode = 'windup';
  s.t = s.duration = 0.8;
  s.elapsed = 0;
  s.total = s.phase > 1 ? 5.3 : 5.8;
  s.a = Math.atan2(G.player.y - b.y, G.player.x - b.x);
  s.events = [];
  s.lungeLeft = 0;
  s.lungeAt = 0;
  s.hit = false;
  s.targetX = G.player.x;
  s.targetY = G.player.y;
  scheduleBoss(b, 0.85, 'keeperInlay', { parity: 0, a: s.a });
  scheduleBoss(b, 1.65, 'keeperInlay', { parity: 1, a: s.a });
  scheduleBoss(b, 2.6, 'ring', { a: s.a, n: 22 });
  scheduleBoss(b, 3.45, 'ring', { a: s.a + (s.cycle % 2 ? 0.7 : -0.7), n: 22 });
};

const keeperCradleEvent = executeBossEvent;
executeBossEvent = function (b, event) {
  if (b.bossKey !== 'keeper' || event.kind !== 'keeperInlay') return keeperCradleEvent(b, event);
  const arena = arenaBounds(),
    radius = Math.min(230, (arena.right - arena.left) * 0.33, (arena.bottom - arena.top) * 0.33);
  for (let i = event.parity; i < 10; i += 2) {
    const a = event.a + (i * TAU) / 10,
      point = midArenaPoint(b.x + Math.cos(a) * radius, b.y + Math.sin(a) * radius, 36);
    midHazard(b, 'beamSegment', {
      x: point.x,
      y: point.y,
      x2: b.x + Math.cos(a) * 26,
      y2: b.y + Math.sin(a) * 26,
      delay: 0.48,
      life: 0.38,
      width: 9,
      damageMul: 0.7,
      color: '#efc986',
      sound: 'midLens',
    });
  }
};

function keeperBodyPose(b) {
  const s = b.bs || {},
    clock = save.motion ? 0 : G.tAll,
    frame = (clock * 3.5) % 8,
    i = Math.floor(frame),
    u = smoothBoss(frame - i),
    f = KEEPER_BODY_FRAMES[i],
    next = KEEPER_BODY_FRAMES[(i + 1) % 8],
    idle = f.map((v, j) => v + (next[j] - v) * u),
    wind = s.mode === 'windup' ? smoothBoss(clamp(1 - s.t / Math.max(0.01, s.duration), 0, 1)) : 0,
    elapsed = s.elapsed || 0;
  let fold = wind * 0.35,
    ring = clock * 0.12,
    core = idle[2];
  if (s.kind === 'cinderCradle' && s.total) {
    fold =
      elapsed < 0.8
        ? wind
        : elapsed < 2.3
          ? 1
          : 1 - smoothBoss(clamp((elapsed - 2.3) / 0.55, 0, 1));
    ring = (s.a || 0) + (elapsed < 2.3 ? 0 : (elapsed - 2.3) * 0.24);
    core = elapsed < 2.3 ? -3 : Math.max(0, 1 - Math.abs(elapsed - 2.6) / 0.35) * 6;
  } else if (s.mode === 'shift') {
    fold = Math.sin(clamp(1 - s.t / 1.5, 0, 1) * Math.PI) * 0.8;
  } else if (s.kind === 'fracture') fold += Math.max(0, 1 - Math.abs(elapsed - 1.55) / 0.45) * 0.55;
  else if (s.kind === 'lastLight') ring += wind * 0.38;
  return { fold, ring, idle, core };
}

function drawKeeperArt(ctx, b) {
  const p = keeperBodyPose(b),
    phase = b.bs?.phase || 0,
    px = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), w, h);
    };
  ctx.save();
  for (let i = 0; i < 10; i++) {
    const a = p.ring + (i * TAU) / 10,
      parity = i % 2 ? 1 : -1,
      radius = 10 + phase * 2 + p.idle[0] - p.fold * 6;
    ctx.save();
    ctx.rotate(a);
    ctx.translate(radius, 0);
    ctx.rotate(parity * (p.idle[1] + p.fold * 0.42));
    ctx.fillStyle = i % 2 ? '#efc986' : '#4a3340';
    ctx.strokeStyle = '#8e766a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(48 - p.fold * 10, -7);
    ctx.lineTo(33 - p.fold * 5, 9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    px(13, -3, 24, 2, i % 2 ? '#ffe8b3' : '#b99a76');
    px(31, -5, 3, 7, '#fff0c8');
    px(6, 1, 8, 3, '#685049');
    ctx.restore();
  }
  for (let i = 0; i < 8; i++) {
    const a = -p.ring + (i * TAU) / 8,
      radius = 38 + phase * 6 - p.fold * 14;
    ctx.save();
    ctx.translate(Math.cos(a) * radius, Math.sin(a) * radius);
    ctx.rotate(a);
    px(-4, -8, 8, 16, i % 2 ? '#f0cc85' : '#7e655d');
    px(-2, -6, 2, 8, '#fff0c8');
    ctx.restore();
  }
  ctx.fillStyle = '#17151b';
  ctx.strokeStyle = '#c9a573';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 25 + p.core * 0.25, 25 - p.fold * 4, 0, 0, TAU);
  ctx.fill();
  ctx.stroke();
  px(-15, -15, 30, 29, '#34262d');
  px(-14, -14, 28, 2, '#8e766a');
  px(-10, -9, 7, 4, '#ffe2a1');
  px(3, -9, 7, 4, '#ffe2a1');
  px(-5, 3, 10, 2, '#b69970');
  px(-3, -19, 6, 2, '#e0cda4');
  px(-8, 8, 16, 2, '#836753');
  ctx.fillStyle = b.bs?.exposed > 0 ? '#fff6dc' : '#fff1b8';
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(3, 9 + p.core - p.fold * 4), 0, TAU);
  ctx.fill();
  px(-2, -4, 3, 6, '#fff8e1');
  ctx.restore();
}

const keeperArtBody = drawLateBossBody;
drawLateBossBody = function (ctx, b) {
  if (b.bossKey !== 'keeper') return keeperArtBody(ctx, b);
  const x = KEEPER_BODY_SURFACE.getContext('2d');
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.clearRect(0, 0, 144, 144);
  x.save();
  x.translate(72, 72);
  x.scale(0.7, 0.7);
  drawKeeperArt(x, b);
  x.restore();
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(KEEPER_BODY_SURFACE, b.x - 144 / 1.4, b.y - 144 / 1.4, 144 / 0.7, 144 / 0.7);
  ctx.restore();
};
