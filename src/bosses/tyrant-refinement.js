const TYRANT_STRIDE_FRAMES = [
  [0, 0, 0, 0],
  [5, -2, -3, 0],
  [8, -5, -6, 0],
  [4, -2, -3, 0],
  [0, 0, 0, 0],
  [-3, 0, 5, -2],
  [-6, 0, 8, -5],
  [-3, 0, 4, -2],
];
const TYRANT_BODY_SURFACE = document.createElement('canvas');
TYRANT_BODY_SURFACE.width = TYRANT_BODY_SURFACE.height = 144;

const tyrantBreachAttack = encounterAttack;
encounterAttack = function (b) {
  const s = b.bs;
  if (b.bossKey !== 'tyrant' || b.hp > b.max * 0.5 || ((s.cycle || 0) + 1) % 5 !== 0)
    return tyrantBreachAttack(b);
  s.cycle++;
  s.kind = 'breachPress';
  s.mode = 'windup';
  s.t = s.duration = 0.8;
  s.elapsed = 0;
  s.total = 4.9;
  s.a = Math.atan2(G.player.y - b.y, G.player.x - b.x);
  s.targetX = G.player.x;
  s.targetY = G.player.y;
  s.events = [];
  s.lungeLeft = 0;
  s.lungeAt = 0;
  s.hit = false;
  scheduleBoss(b, 0.84, 'charge', { a: s.a, time: 0.42, speed: 220 });
  scheduleBoss(b, 1.32, 'tyrantBroadside', { a: s.a, side: -1 });
  scheduleBoss(b, 1.95, 'charge', { a: s.a, time: 0.42, speed: 220 });
  scheduleBoss(b, 2.43, 'tyrantBroadside', { a: s.a, side: 1 });
  scheduleBoss(b, 3.12, 'impact');
};

const tyrantBreachEvent = executeBossEvent;
executeBossEvent = function (b, event) {
  if (b.bossKey !== 'tyrant' || event.kind !== 'tyrantBroadside')
    return tyrantBreachEvent(b, event);
  const side = event.side,
    a = event.a,
    x = b.x + Math.cos(a + (side * Math.PI) / 2) * 46,
    y = b.y + Math.sin(a + (side * Math.PI) / 2) * 46;
  for (const offset of [-0.24, 0.24]) {
    encounterHazard(b, 'glyph', x, y, a + (side * Math.PI) / 2 + offset, {
      delay: 0.48,
      life: 0.38,
      len: 500,
      width: 12,
      damageMul: 0.72,
    });
  }
  burst(x, y, 12, '#d9a574', 110, 0.35, 2, true);
  sfx('midHammer');
};

const tyrantArtAI = tyrantAI;
tyrantAI = function (b, dt, d, dx, dy) {
  const x = b.x,
    y = b.y;
  tyrantArtAI(b, dt, d, dx, dy);
  const distance = Math.hypot(b.x - x, b.y - y);
  b.bs.tyrantStride = ((b.bs.tyrantStride || 0) + Math.min(40, distance) / 11) % 8;
  b.bs.tyrantMoving = distance > 0.05;
};

function tyrantBodyPose(b) {
  const s = b.bs || {},
    elapsed = s.elapsed || 0,
    frame = save.motion || !s.tyrantMoving ? 0 : s.tyrantStride || 0,
    index = Math.floor(frame) % 8,
    u = smoothBoss(frame - Math.floor(frame)),
    first = TYRANT_STRIDE_FRAMES[index],
    next = TYRANT_STRIDE_FRAMES[(index + 1) % 8],
    feet = first.map((v, i) => v + (next[i] - v) * u),
    wind = s.mode === 'windup' ? smoothBoss(clamp(1 - s.t / Math.max(0.01, s.duration), 0, 1)) : 0;
  let hinge = wind * 0.22,
    recoil = 0,
    brace = 0;
  if (s.kind === 'breachPress' && s.total) {
    hinge =
      elapsed < 0.8 ? wind * 0.55 : elapsed < 3.45 ? 0.55 : Math.max(0, (3.95 - elapsed) * 1.1);
    brace =
      elapsed > 2.85 && elapsed < 3.5
        ? Math.sin(clamp((elapsed - 2.85) / 0.65, 0, 1) * Math.PI) * 4
        : 0;
    for (const hit of [1.32, 2.43, 3.12])
      recoil += Math.max(0, 1 - Math.abs(elapsed - hit) / 0.18) * 4;
  } else if (s.total) {
    const pulse = Math.max(0, 1 - Math.abs(elapsed - 1.15) / 0.22);
    recoil = pulse * 3;
    hinge += s.kind === 'bombard' ? 0.28 * Math.min(1, elapsed / 0.8) : 0;
  }
  return {
    feet,
    hinge,
    recoil,
    brace,
    crown: s.mode === 'shift' ? Math.sin(clamp(1 - s.t / 1.5, 0, 1) * Math.PI) * 7 : 0,
  };
}

function drawTyrantArt(ctx, b) {
  const p = tyrantBodyPose(b),
    c = b.col || '#b37753',
    px = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), w, h);
    };
  ctx.save();
  for (const side of [-1, 1]) {
    const i = side < 0 ? 0 : 2,
      step = p.feet[i],
      lift = p.feet[i + 1];
    px(side * 29 - 9 + step, 19 + lift, 18, 29, '#13151b');
    px(side * 29 - 7 + step, 22 + lift, 14, 8, '#49353c');
    px(side * 29 - 4 + step, 28 + lift, 3, 17, '#987255');
    px(side * 29 - 14 + step, 43 + lift, 28, 8, '#282127');
    px(side * 29 - 13 + step, 44 + lift, 26, 2, '#78604f');
  }
  ctx.translate(0, p.brace - p.recoil);
  px(-48, -31, 96, 67, '#282127');
  px(-46, -29, 92, 3, '#8f6650');
  px(-45, 31, 90, 4, '#0d1219');
  for (const side of [-1, 1]) {
    px(side * 23 - 6, -43, 12, 31, '#11151d');
    px(side * 23 - 3, -40, 6, 15, '#ffc981');
    ctx.save();
    ctx.translate(side * 43, -22);
    ctx.rotate(side * p.hinge);
    px(-11, -9, 22, 57, '#24202b');
    px(-10, -8, 3, 53, '#624837');
    for (let i = 0; i < 4; i++) {
      px(-7, -1 + i * 12, 14, 3, '#b37753');
      px(-6, i * 12, 6, 1, '#ddad7a');
    }
    px(-7, 32, 14, 12, '#10131a');
    px(-5, 35, 10, 3, c);
    ctx.restore();
    px(side * 37 - 4, -17, 8, 35, '#332b32');
  }
  px(-20, -50 - p.crown, 40, 35, '#17151b');
  px(-19, -49 - p.crown, 38, 2, '#755443');
  for (let i = -2; i <= 2; i++) {
    px(i * 15 - 3, -58 - Math.abs(i) * 5 - p.crown, 6, 16, c);
    px(i * 15 - 2, -58 - Math.abs(i) * 5 - p.crown, 2, 9, '#e6bb80');
  }
  px(-14, -31 - p.crown, 28, 6, '#090d14');
  px(-11, -30 - p.crown, 8, 3, '#ffc981');
  px(3, -30 - p.crown, 8, 3, '#ffc981');
  px(-19, 16, 38, 6, '#9d724b');
  px(-16, 17, 32, 2, '#dfb079');
  for (let i = 0; i < 5; i++) {
    px(-15 + i * 7, -8, 3, 18, '#11141c');
    px(-15 + i * 7, -7, 2, 5, b.bs?.exposed > 0 ? '#ffe0a3' : '#78503a');
  }
  ctx.restore();
}

const tyrantArtBody = drawLateBossBody;
drawLateBossBody = function (ctx, b) {
  if (b.bossKey !== 'tyrant') return tyrantArtBody(ctx, b);
  const x = TYRANT_BODY_SURFACE.getContext('2d');
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.clearRect(0, 0, 144, 144);
  x.save();
  x.translate(72, 72);
  x.scale(0.7, 0.7);
  drawTyrantArt(x, b);
  x.restore();
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(TYRANT_BODY_SURFACE, b.x - 144 / 1.4, b.y - 144 / 1.4, 144 / 0.7, 144 / 0.7);
  ctx.restore();
};
