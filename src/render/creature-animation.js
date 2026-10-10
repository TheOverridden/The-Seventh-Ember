const CREATURE_MOTION = new WeakMap(),
  CREATURE_FRAME_CACHE = new WeakMap();
const CREATURE_PROFILES = {
  slime: { kind: 'ooze', hem: 8, rate: 0.85, stride: 46 },
  splitter: { kind: 'ooze', hem: 9, rate: 0.7, stride: 58 },
  mite: { kind: 'scuttle', hem: 5, rate: 2.8, stride: 22 },
  spitter: { kind: 'slug', hem: 9, rate: 0.8, stride: 48 },
  brute: {
    kind: 'walk',
    rate: 1.5,
    stride: 54,
    legs: [
      [4, 11, 5, 3, 0],
      [11, 11, 5, 3, 4],
    ],
  },
  bat: { kind: 'wing', rate: 3.1, wing: [6, 10, 5, 7], stroke: 3 },
  wisp: { kind: 'ghost', hem: 8, rate: 0.6 },
  rippleLeech: { kind: 'swim', origin: [2, 1], neck: 10, tailY: 2, rate: 1.2, stride: 42 },
  pumpCrawler: {
    kind: 'crawl',
    origin: [2, 1],
    rate: 2,
    stride: 36,
    legs: [
      [0, 7, 4, 2, 0],
      [10, 7, 4, 2, 4],
    ],
  },
  lampEel: { kind: 'swim', origin: [2, 1], neck: 10, tailY: 4, rate: 1.1, stride: 48 },
  sluiceGuard: {
    kind: 'walk',
    origin: [2, 1],
    rate: 1.4,
    stride: 56,
    legs: [
      [2, 9, 5, 2, 0],
      [9, 9, 5, 2, 4],
    ],
  },
  coalMite: {
    kind: 'crawl',
    origin: [2, 1],
    rate: 2.7,
    stride: 28,
    legs: [
      [1, 6, 3, 2, 0],
      [6, 6, 2, 1, 4],
      [10, 6, 3, 2, 4],
    ],
  },
  slagRunner: {
    kind: 'run',
    origin: [2, 1],
    rate: 2.6,
    stride: 35,
    legs: [
      [2, 5, 3, 2, 0],
      [9, 5, 3, 2, 4],
    ],
  },
  cinderValve: {
    kind: 'walk',
    origin: [2, 1],
    rate: 1.7,
    stride: 46,
    legs: [
      [3, 8, 2, 2, 0],
      [8, 8, 2, 2, 4],
    ],
  },
  hammerFrame: {
    kind: 'walk',
    origin: [2, 1],
    rate: 1.2,
    stride: 60,
    legs: [
      [1, 9, 3, 2, 0],
      [6, 9, 3, 2, 4],
    ],
  },
  glassShard: { kind: 'float', rate: 0.55, rock: 0.045 },
  lensMote: { kind: 'float', rate: 0.45, rock: 0.025 },
  orbitHound: {
    kind: 'crawl',
    origin: [2, 1],
    rate: 2.1,
    stride: 38,
    legs: [
      [1, 7, 3, 2, 0],
      [10, 7, 3, 2, 4],
    ],
  },
  mirrorShell: {
    kind: 'walk',
    origin: [2, 1],
    rate: 1,
    stride: 64,
    legs: [
      [4, 9, 2, 2, 0],
      [8, 9, 2, 2, 4],
    ],
  },
  inkMite: {
    kind: 'crawl',
    origin: [2, 1],
    rate: 2.2,
    stride: 32,
    legs: [
      [0, 5, 3, 2, 0],
      [10, 5, 3, 2, 4],
      [2, 7, 4, 2, 4],
      [8, 7, 3, 2, 0],
    ],
  },
  pageWraith: { kind: 'cloth', origin: [2, 1], hem: 7, rate: 0.8 },
  quillSentinel: {
    kind: 'walk',
    origin: [2, 1],
    rate: 1.8,
    stride: 42,
    legs: [
      [3, 9, 2, 2, 0],
      [6, 9, 2, 2, 4],
    ],
  },
  indexer: {
    kind: 'walk',
    origin: [2, 1],
    rate: 1.3,
    stride: 54,
    legs: [
      [2, 8, 4, 2, 0],
      [7, 8, 4, 2, 4],
    ],
  },
  courtMask: { kind: 'float', rate: 0.42, rock: 0.035 },
  ribbonDuelist: {
    kind: 'walk',
    origin: [2, 1],
    rate: 2.2,
    stride: 36,
    legs: [
      [3, 7, 2, 3, 0],
      [6, 7, 2, 3, 4],
    ],
  },
  hushBell: { kind: 'bell', origin: [2, 1], clapper: [5, 8, 3, 2], rate: 0.55 },
  mourningGuard: { kind: 'cloth', origin: [2, 1], hem: 7, rate: 0.5 },
  choirWisp: { kind: 'ghost', origin: [2, 1], hem: 7, rate: 0.65 },
  pinion: { kind: 'wing', origin: [2, 1], wing: [5, 8, 4, 9], stroke: 2, rate: 2 },
  cantor: {
    kind: 'walk',
    origin: [2, 1],
    rate: 1.5,
    stride: 52,
    legs: [
      [3, 8, 2, 2, 0],
      [8, 8, 2, 2, 4],
    ],
  },
  bellAngel: { kind: 'wing', origin: [2, 1], wing: [5, 9, 3, 4], stroke: 2, rate: 1.3 },
  obsidianPawn: { kind: 'slide', rate: 0.5, rock: 0.014 },
  chainHound: {
    kind: 'crawl',
    origin: [2, 1],
    rate: 2.2,
    stride: 40,
    legs: [
      [0, 7, 4, 3, 0],
      [8, 7, 4, 3, 4],
    ],
  },
  siegeEye: {
    kind: 'walk',
    origin: [2, 1],
    rate: 1.3,
    stride: 58,
    legs: [
      [1, 7, 4, 3, 0],
      [9, 7, 4, 3, 4],
    ],
  },
  barrierKnight: {
    kind: 'walk',
    origin: [2, 1],
    rate: 1.2,
    stride: 62,
    legs: [
      [2, 9, 4, 2, 0],
      [7, 9, 4, 2, 4],
    ],
  },
  memoryAsh: { kind: 'ghost', origin: [2, 1], hem: 7, rate: 0.55 },
  starRemnant: { kind: 'float', rate: 0.38, rock: 0.07 },
  keeperHand: {
    kind: 'hand',
    origin: [2, 1],
    rate: 1.6,
    stride: 42,
    fingers: [
      [2, 0, 2, 4, 0],
      [5, 0, 2, 4, 2],
      [8, 0, 2, 4, 4],
      [11, 1, 2, 4, 6],
    ],
  },
  oathbound: {
    kind: 'walk',
    origin: [2, 1],
    rate: 1.4,
    stride: 58,
    legs: [
      [2, 9, 3, 2, 0],
      [8, 9, 3, 2, 4],
    ],
  },
  warden: {
    kind: 'walk',
    rate: 1.2,
    stride: 100,
    cape: true,
    legs: [
      [9, 35, 8, 7, 0],
      [21, 35, 8, 7, 4],
    ],
  },
  matriarch: { kind: 'authored', rate: 1.25, stride: 105 },
};
const CREATURE_ALIASES = {
  trialGuardian: 'warden',
  gateSentry: 'slime',
  mossSlime: 'slime',
  gateHound: 'bat',
  petalBat: 'bat',
  gateLantern: 'spitter',
  thornSpitter: 'spitter',
  gateShield: 'brute',
  barkback: 'brute',
  gardenMite: 'mite',
};

const CREATURE_FALLBACK_PROFILE = { kind: 'float', rate: 0.5 };
function creatureProfile(e) {
  return (
    CREATURE_PROFILES[
      e.warden ? 'warden' : e.matriarch ? 'matriarch' : CREATURE_ALIASES[e.type] || e.type
    ] || CREATURE_FALLBACK_PROFILE
  );
}

function creatureAirborne(profile) {
  return ['wing', 'float', 'ghost', 'cloth', 'bell'].includes(profile.kind);
}
function creaturePhase(e, time = G.tAll) {
  const p = creatureProfile(e);
  return creatureAirborne(p)
    ? (((time * p.rate + (e.seed || 0) * 0.159) % 1) + 1) % 1
    : (((CREATURE_MOTION.get(e)?.phase || 0) % 1) + 1) % 1;
}
function creatureMotionFrame(e) {
  return save.motion ? 0 : Math.floor(creaturePhase(e) * 8) % 8;
}
function movingCreature(e) {
  return !save.motion && !!CREATURE_MOTION.get(e)?.moving;
}
function creaturePose(e, time = G.tAll) {
  const p = creatureProfile(e);
  if (save.motion) return { y: 0, rot: 0 };
  const phase = creaturePhase(e, time),
    beat = Math.sin(phase * TAU);
  if (p.kind === 'wing') return { y: -0.35 * Math.sin(phase * TAU - 0.6), rot: 0 };
  if (creatureAirborne(p))
    return {
      y: Math.sin((time * p.rate * 0.6 + (e.seed || 0) * 0.159) * TAU) * 0.65,
      rot: beat * (p.rock || 0),
    };
  if (p.kind === 'slide')
    return {
      y: 0,
      rot: movingCreature(e) ? Math.sin(time * 3 + (e.seed || 0)) * (p.rock || 0) : 0,
    };
  return { y: 0, rot: 0 };
}
const creatureMotionUpdate = updateEnemies;
updateEnemies = function (dt) {
  for (const e of G.enemies)
    if (!CREATURE_MOTION.has(e))
      CREATURE_MOTION.set(e, { x: e.x, y: e.y, travel: 0, phase: 0, moving: false });
  creatureMotionUpdate(dt);
  for (const e of G.enemies) {
    if (e.dead) continue;
    let motion = CREATURE_MOTION.get(e);
    if (!motion) {
      CREATURE_MOTION.set(e, { x: e.x, y: e.y, travel: 0, phase: 0, moving: false });
      continue;
    }
    const distance = Math.hypot(e.x - motion.x, e.y - motion.y),
      profile = creatureProfile(e),
      step = distance > 0.015 && distance < Math.max(TILE * 1.5, (e.spd || 0) * dt * 4),
      air = creatureAirborne(profile);
    motion.moving = step;
    motion.x = e.x;
    motion.y = e.y;
    const rushing = e.action === 'leap' || e.specialMode === 'dash' || e.wb?.mode === 'lunge';
    if (save.motion || rushing) {
      motion.phase = 0;
      continue;
    }
    if (step) {
      motion.travel += distance;
      motion.phase =
        (motion.phase +
          Math.min(
            distance / Math.max(profile.stride || 48, e.r * 2.8),
            dt * (profile.rate || 1.6)
          )) %
        1;
    } else if (!air) {
      const contact = Math.round(motion.phase * 2) / 2,
        delta = contact - motion.phase;
      motion.phase =
        Math.abs(delta) < 0.008
          ? contact % 1
          : (motion.phase + Math.sign(delta) * Math.min(Math.abs(delta), dt * 2.5) + 1) % 1;
    }
  }
};
function creatureFrames(source, type) {
  const profile = creatureProfile(typeof type === 'string' ? { type } : type),
    key = profile;
  let cache = CREATURE_FRAME_CACHE.get(source);
  if (!cache) {
    cache = new Map();
    CREATURE_FRAME_CACHE.set(source, cache);
  }
  if (cache.has(key)) return cache.get(key);
  const W = source.width,
    H = source.height,
    pad = 3,
    frames = [],
    pixels = source.getContext('2d').getImageData(0, 0, W, H),
    origin = profile.origin || [0, 0],
    parts = [];
  let bottom = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) if (pixels.data[(y * W + x) * 4 + 3]) bottom = Math.max(bottom, y);
  function part(rect, kind) {
    const [x, y, w, h, phase = 0] = rect;
    parts.push({ x: x + origin[0], y: y + origin[1], w, h, phase, kind });
  }
  for (const rect of profile.legs || []) part(rect, 'leg');
  for (const rect of profile.fingers || []) part(rect, 'finger');
  if (profile.wing) {
    const [left, right, hingeY, bottom] = profile.wing;
    parts.push(
      {
        kind: 'wing',
        side: -1,
        hingeX: left + origin[0],
        hingeY: hingeY + origin[1],
        bottom: bottom + origin[1],
      },
      {
        kind: 'wing',
        side: 1,
        hingeX: right + origin[0],
        hingeY: hingeY + origin[1],
        bottom: bottom + origin[1],
      }
    );
  }
  if (profile.clapper) part(profile.clapper, 'clapper');
  const inPart = (p, x, y) =>
    p.kind === 'wing'
      ? y < p.bottom && (p.side < 0 ? x < p.hingeX : x >= p.hingeX)
      : x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h;
  const footX = [0, 0, 1, 1, 0, 0, -1, -1],
    footY = [0, -1, -1, 0, 0, 0, 0, 0],
    wingDrop = [0, 1, 3, 2, 0, -1, -2, -1],
    wingSpan = [1, 0.93, 0.8, 0.86, 1, 0.96, 0.92, 0.96];
  function color(image, x, y, sx, sy) {
    sx = Math.floor(sx);
    sy = Math.floor(sy);
    if (sx < 0 || sx >= W || sy < 0 || sy >= H) return;
    const i = (sy * W + sx) * 4,
      j = ((y + pad) * (W + pad * 2) + x + pad) * 4;
    if (!pixels.data[i + 3]) return;
    image.data.set(pixels.data.subarray(i, i + 4), j);
  }
  for (let f = 0; f < 8; f++) {
    const canvas = document.createElement('canvas');
    canvas.width = W + pad * 2;
    canvas.height = H + pad * 2;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    if (
      f === 0 ||
      (f === 4 && !['wing', 'swim', 'ghost', 'cloth', 'bell'].includes(profile.kind))
    ) {
      ctx.drawImage(source, pad, pad);
      frames.push(canvas);
      continue;
    }
    const image = ctx.createImageData(canvas.width, canvas.height),
      phase = (f / 8) * TAU;
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        if (parts.some((p) => inPart(p, x, y))) {
          if (profile.cape && y <= 40) {
            const i = ((y + pad) * canvas.width + x + pad) * 4;
            image.data.set([37, 43, 66, 255], i);
          }
          continue;
        }
        let sx = x + 0.5,
          sy = y + 0.5;
        const hem = (profile.hem || 0) + origin[1];
        if (['ooze', 'slug', 'scuttle'].includes(profile.kind) && y >= hem) {
          const t = clamp((y - hem) / Math.max(1, bottom - hem), 0, 1),
            spread =
              1 +
              Math.sin(phase) *
                t *
                (profile.kind === 'scuttle' ? 0.35 : profile.kind === 'slug' ? 0.27 : 0.32),
            center = profile.kind === 'slug' ? 8 : W / 2;
          sx = center + (sx - center) / spread;
        } else if ((profile.kind === 'cloth' || profile.kind === 'ghost') && y >= hem) {
          const t = clamp((y - hem) / Math.max(1, bottom - hem), 0, 1);
          sx -= Math.sin(phase - (y - hem) * 0.35) * t * 0.85;
        } else if (
          profile.kind === 'swim' &&
          x < profile.neck + origin[0] &&
          y >= profile.tailY + origin[1]
        ) {
          const depth = (profile.neck + origin[0] - x) / Math.max(1, profile.neck),
            lag = depth * 3;
          sy -= (Math.sin(phase - lag) + Math.sin(lag)) * depth * 0.7;
        }
        color(image, x, y, sx, sy);
      }
    for (const p of parts)
      for (let y = -pad; y < H + pad; y++)
        for (let x = -pad; x < W + pad; x++) {
          let sx = x + 0.5,
            sy = y + 0.5;
          if (p.kind === 'wing') {
            const extent = Math.max(1, p.side < 0 ? p.hingeX : W - p.hingeX),
              span = wingSpan[f],
              slope = (((wingDrop[f] * (profile.stroke || 3)) / 3) * p.side) / extent;
            sx = p.hingeX + (sx - p.hingeX) / span;
            sy -= (sx - p.hingeX) * slope;
          } else if (p.kind === 'clapper') {
            sx -= Math.sin(phase);
          } else {
            const k = (f + p.phase) % 8,
              dx = footX[k],
              dy = footY[k];
            if (p.kind === 'finger') {
              const t = clamp((p.y + p.h - sy) / p.h, 0, 1);
              sx -= dx * t;
              sy -= dy * t;
            } else {
              const height = Math.max(1, p.h + dy),
                t = clamp((sy - p.y) / height, 0, 1);
              sy = p.y + ((sy - p.y) * p.h) / height;
              sx -= dx * t;
            }
          }
          if (inPart(p, Math.floor(sx), Math.floor(sy))) color(image, x, y, sx, sy);
        }
    ctx.putImageData(image, 0, 0);
    frames.push(canvas);
  }
  cache.set(key, frames);
  return frames;
}
function creatureImage(e, source, spr) {
  const frame = creatureMotionFrame(e);
  if (creatureProfile(e).kind === 'authored' && spr) source = spr.frames[frame % spr.frames.length];
  return creatureFrames(source, e)[creatureProfile(e).kind === 'authored' ? 0 : frame];
}
function drawCreatureSprite(ctx, e, name, x, y, scale = 1, rot = 0, alpha = 1) {
  const spr = SPR[name];
  if (!spr) return;
  const profile = creatureProfile(e),
    mouth =
      profile.kind === 'slug' && (e.action === 'warn' || (e.aggro && e.t1 > 0 && e.t1 < 0.28)),
    source = spr.frames[mouth ? Math.min(1, spr.frames.length - 1) : 0],
    image = creatureImage(e, source, spr),
    pose = creaturePose(e),
    unit = spr.sc * scale;
  ctx.save();
  ctx.translate(x, y + pose.y * unit);
  if (rot || pose.rot) ctx.rotate(rot + pose.rot);
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = alpha;
  ctx.drawImage(
    image,
    (-spr.W / 2 - 3) * unit,
    (-spr.H / 2 - 3) * unit,
    image.width * unit,
    image.height * unit
  );
  ctx.restore();
}
const stillLateCreature = drawLateBody;
drawLateBody = function (ctx, e) {
  if (e.mechanism) return stillLateCreature(ctx, e);
  const source = creatureSprite(e)?.[0];
  if (!source) return stillLateCreature(ctx, e);
  const frame = creatureImage(e, source),
    pose = creaturePose(e),
    scale = Math.max(2, Math.round(e.r / 7)),
    tell =
      e.specialMode === 'tell'
        ? clamp(1 - e.specialT / (LATE_SPECIALS[e.type]?.tell || 0.6), 0, 1)
        : 0;
  ctx.save();
  ctx.translate(Math.round(e.x), Math.round(e.y) + pose.y * scale);
  ctx.imageSmoothingEnabled = false;
  ctx.scale(scale, scale);
  ctx.rotate((e.specialMode === 'dash' ? e.specialA || 0 : 0) + pose.rot);
  ctx.drawImage(frame, -13, -11);
  if (e.elite) {
    ctx.fillStyle = '#e8b86e';
    for (let i = -1; i <= 1; i++) ctx.fillRect(i * 4 - 1, -9, 2, 3 - Math.abs(i));
    ctx.fillStyle = '#f8e0a5';
    ctx.fillRect(-7, 1, 2, 3);
    ctx.fillRect(5, 1, 2, 3);
  }
  if (tell) {
    ctx.fillStyle = '#ffe5a6';
    ctx.globalAlpha = tell;
    ctx.fillRect(-3, -4, 2, 2);
    ctx.fillRect(2, -4, 2, 2);
  }
  ctx.restore();
};

function drawGuardianSurfaceDetails(ctx, b) {
  const s = b.bs || {},
    t = save.motion ? 0 : G.tAll,
    wind = s.mode === 'windup',
    u = wind ? smoothBoss(1 - s.t / Math.max(0.01, s.duration)) : 0,
    px = (x, y, w, h, col) => {
      ctx.fillStyle = col;
      ctx.fillRect(x, y, w, h);
    };
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  ctx.rotate(['dash', 'dive', 'ram'].includes(s.mode) ? s.a || 0 : 0);
  ctx.scale(1 + 0.08 * u, 1 - 0.08 * u);
  if (b.bossKey === 'bellkeeper') {
    ctx.rotate(s.a || 0);
    for (let i = 0; i < 5; i++) {
      const x = -56 + i * 13,
        y = Math.round(Math.sin(t * 2.35 - i * 0.72) * 8) - 2;
      px(x - 4, y - 6, 5, 2, '#8baeb3');
      px(x - 5, y + 2, 8, 2, '#132d38');
    }
    for (const x of [-2, 15, 31]) {
      px(x - 5, -12, 2, 7, '#f8da99');
      px(x - 3, -7, 6, 1, '#7c562d');
      px(x + 2, -12, 2, 5, '#7c562d');
    }
    px(1, 5, 8, 2, '#5b8590');
    px(4, 9, 8, 2, '#183640');
  } else if (b.bossKey === 'colossus') {
    for (const side of [-1, 1])
      for (let i = 0; i < 4; i++) {
        px(side * 28 - 2, -32 + i * 16, 4, 3, '#b28b61');
        px(side * 28, -30 + i * 16, 2, 2, '#221f22');
      }
    px(-10, -34, 20, 3, '#836951');
    px(-8, -29, 16, 2, '#252026');
    px(-2, -23, 4, 12, '#291e22');
    px(-12, 30, 24, 3, '#917152');
    px(-10, -49, 5, 2, '#73685c');
    px(7, -49, 4, 2, '#73685c');
  } else if (b.bossKey === 'astronomer') {
    for (let i = 0; i < 12; i++) {
      const a = (i * TAU) / 12,
        x = Math.round(Math.cos(a) * 18),
        y = Math.round(Math.sin(a) * 18);
      px(x, y, 2, 2, i % 3 ? '#3f697c' : '#bbd5cd');
    }
    px(-16, -6, 3, 12, '#527b8d');
    px(12, -8, 3, 12, '#294151');
    px(-3, 11, 7, 2, '#738a8d');
  } else if (b.bossKey === 'scribe') {
    ctx.rotate(Math.sin(t * 0.8) * 0.08);
    for (let i = 0; i < 5; i++) {
      const x = -23 + i * 10,
        y = -26 + i * 4;
      px(x, y, 7, 2, '#74636f');
      px(x + 1, y + 3, 4, 1, '#baad91');
      px(x + 4, y + 6, 2, 3, '#15121b');
    }
    px(15, -4, 9, 2, '#7b6b73');
    px(18, -1, 5, 1, '#aa9984');
    px(-28, 6, 10, 2, '#75606c');
    px(-22, 9, 8, 2, '#baad91');
  } else if (b.bossKey === 'regents') {
    for (const side of [-1, 1]) {
      px(side * 19 - 1, -9, 3, 13, '#b78e79');
      px(side * 18 - 2, 7, 4, 2, '#79576d');
      px(side * 10 - 1, 12, 2, 20, '#c49f86');
      px(side * 10 + 1, 16, 2, 14, '#352332');
    }
    px(-6, -25, 12, 2, '#dabfa3');
    px(-2, -22, 4, 5, '#695264');
    px(-2, 2, 4, 7, '#b79b7e');
    for (let i = -1; i <= 1; i++)
      px(i * 12 - 2, 28, 4, 2, b.twinRole === 'blade' ? '#d094a0' : '#ac9cce');
  } else if (b.bossKey === 'seraph') {
    for (const side of [-1, 1])
      for (let i = 0; i < 4; i++) {
        const x = side * (15 + i * 7),
          y = -12 + i * 6;
        px(x, y, 3, 8, '#d2d9e9');
        px(x + side * 3, y + 3, 2, 7, '#59658b');
      }
    px(-9, -19, 4, 2, '#8c9fb8');
    px(6, -19, 4, 2, '#8c9fb8');
    px(-8, -2, 3, 2, '#505b7b');
    px(6, -1, 3, 2, '#505b7b');
  } else if (b.bossKey === 'tyrant') {
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        px(side * 12 - 2, -10 + i * 10, 4, 2, '#7a625b');
        px(side * 36 - 2, -26 + i * 12, 3, 2, '#ddad7a');
      }
      px(side * 4 - 1, -42, 2, 12, '#856457');
      px(side * 14 - 1, -38, 2, 11, '#49353c');
    }
    px(-16, -21, 32, 2, '#a58667');
    px(-13, -19, 26, 2, '#261f29');
    px(-6, -30, 12, 3, '#dba773');
    px(-4, -29, 8, 1, '#ffe2a7');
    px(-23, 5, 46, 2, '#49343b');
    px(-19, 7, 38, 2, '#1b1923');
  } else if (b.bossKey === 'keeper') {
    for (const side of [-1, 1]) {
      px(side * 16 - 1, -12, 2, 24, '#8e766a');
      px(side * 12 - 2, 13, 4, 2, '#b79b71');
      px(side * 8 - 2, 16, 4, 2, '#655047');
    }
    px(-7, -17, 14, 2, '#b8a180');
    px(-3, -19, 6, 2, '#e0cda4');
    px(-8, 8, 16, 2, '#836753');
    px(-3, 10, 6, 2, '#c6ac7c');
  }
  ctx.restore();
}
