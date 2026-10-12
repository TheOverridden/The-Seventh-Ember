const COLOSSUS_PIXEL_BODY = document.createElement('canvas');
COLOSSUS_PIXEL_BODY.width = COLOSSUS_PIXEL_BODY.height = 144;
const COLOSSUS_GAIT = [
  { left: [0, 0], right: [2, -2], piston: 0 },
  { left: [0, 0], right: [0, -6], piston: 2 },
  { left: [1, -2], right: [-3, -3], piston: 1 },
  { left: [2, -2], right: [0, 0], piston: 0 },
  { left: [0, -6], right: [0, 0], piston: 2 },
  { left: [-3, -3], right: [1, -2], piston: 1 },
];
const COLOSSUS_HAMMER_POSES = [
  [0, 22],
  [-7, 13],
  [-16, -6],
  [-25, -26],
  [-31, -44],
  [-35, -59],
];
if (!MID_SEQUENCES.colossus[1].includes('heavyTread'))
  MID_SEQUENCES.colossus[1].splice(2, 0, 'heavyTread');

const colossusStartMove = startColossusMove;
startColossusMove = function (b, kind) {
  delete b.bs.mid.colossusMotion;
  if (kind !== 'heavyTread') return colossusStartMove(b, kind);
  const target = midArenaPoint(G.player.x, G.player.y, 68),
    angle = Math.atan2(target.y - b.y, target.x - b.x),
    stride = clamp(Math.hypot(target.x - b.x, target.y - b.y) / 3, 42, 76),
    events = [];
  for (let step = 0; step < 3; step++) {
    const point = midArenaPoint(
      b.x + Math.cos(angle) * stride * (step + 1),
      b.y + Math.sin(angle) * stride * (step + 1),
      62
    );
    events.push({
      at: 0.06 + step * 0.88,
      type: 'colossusStep',
      x: point.x,
      y: point.y,
      turn: angle,
      slot: step % 2,
    });
  }
  events.push({ at: 2.66, type: 'colossusRelease' });
  return beginMidMove(b, kind, 0.64, 3.05, events, target);
};

function colossusBeginStride(b, event, duration, kind) {
  const point =
    safePosition(G.world, event.x, event.y, b.r) || midArenaPoint(event.x, event.y, b.r + 12);
  b.bs.mid.colossusMotion = {
    fromX: b.x,
    fromY: b.y,
    toX: point.x,
    toY: point.y,
    started: b.bs.mid.age,
    duration,
    side: event.slot ? 1 : -1,
    kind,
  };
  b.kbx = b.kby = 0;
  return point;
}

const colossusMidEvent = fireMidEvent;
fireMidEvent = function (b, event) {
  if (b.bossKey !== 'colossus') return colossusMidEvent(b, event);
  if (event.type === 'colossusStep') {
    const point = colossusBeginStride(b, event, 0.36, 'tread'),
      angle = event.turn || 0,
      side = event.slot ? 1 : -1,
      foot = {
        x: point.x - Math.sin(angle) * side * 25,
        y: point.y + Math.cos(angle) * side * 25,
      };
    midHazard(b, 'impact', {
      x: foot.x,
      y: foot.y,
      radius: 40,
      delay: 0.36,
      life: 0.28,
      damageMul: 0.76,
      sound: 'midHammer',
      colossusFoot: true,
    });
    for (const turn of [-0.58, 0.58])
      midHazard(b, 'quake', {
        x: foot.x + Math.cos(angle + turn) * 26,
        y: foot.y + Math.sin(angle + turn) * 26,
        x2: foot.x + Math.cos(angle + turn) * 205,
        y2: foot.y + Math.sin(angle + turn) * 205,
        width: 8,
        delay: 0.56,
        life: 0.38,
        damageMul: 0.62,
        sound: 'midHammer',
        colossusFracture: true,
      });
    return;
  }
  if (event.type === 'colossusRelease') {
    delete b.bs.mid.colossusMotion;
    b.bs.exposed = Math.max(b.bs.exposed || 0, 2.1);
    burst(b.x - 30, b.y - 35, 8, '#b6a692', 74, 0.58, 2, true);
    burst(b.x + 30, b.y - 35, 8, '#b6a692', 74, 0.58, 2, true);
    sfx('reload');
    return;
  }
  if (event.type === 'forgeSlam') {
    const fromX = b.x,
      fromY = b.y,
      result = colossusMidEvent(b, event),
      toX = b.x,
      toY = b.y;
    b.x = fromX;
    b.y = fromY;
    colossusBeginStride(b, { x: toX, y: toY, slot: event.turn ? 1 : 0 }, 0.22, 'hammer');
    return result;
  }
  return colossusMidEvent(b, event);
};

function colossusTickStride(b) {
  const motion = b.bs.mid?.colossusMotion;
  if (!motion) return;
  if (b.bs.mode !== 'slam') {
    delete b.bs.mid.colossusMotion;
    return;
  }
  const u = clamp((b.bs.mid.age - motion.started) / motion.duration, 0, 1),
    eased = smoothBoss(u);
  b.x = motion.fromX + (motion.toX - motion.fromX) * eased;
  b.y = motion.fromY + (motion.toY - motion.fromY) * eased;
  b.kbx = b.kby = 0;
  if (u >= 1 && !motion.planted) {
    motion.planted = true;
    G.cam.shake = Math.max(G.cam.shake || 0, motion.kind === 'hammer' ? 0.7 : 0.42);
  }
}

const colossusMiddleAI = middleGuardianAI;
middleGuardianAI = function (b, dt, d, dx, dy) {
  const result = colossusMiddleAI(b, dt, d, dx, dy);
  if (b.bossKey === 'colossus') colossusTickStride(b);
  return result;
};
colossusAI = middleGuardianAI;

function colossusBodyPose(b) {
  const s = b.bs || {},
    m = s.mid || {},
    wind = s.mode === 'windup' ? clamp(1 - s.t / Math.max(0.01, s.duration), 0, 1) : 0,
    walking = s.mode === 'wait' && Math.hypot(G.player.x - b.x, G.player.y - b.y) > 155,
    gait = COLOSSUS_GAIT[walking && !save.motion ? Math.floor((m.clock || 0) * 5) % 6 : 0],
    pose = {
      left: gait.left.slice(),
      right: gait.right.slice(),
      piston: gait.piston,
      elbowLeft: 0,
      wristLeft: 22,
      elbowRight: 0,
      wristRight: 22,
      doors: 0,
      head: 0,
      brace: 0,
    };
  const hammer = ['hammer', 'hammerfall', 'meltdown'].includes(s.kind);
  if (hammer && s.mode === 'windup') {
    const arm = COLOSSUS_HAMMER_POSES[Math.min(5, Math.floor(wind * 6))];
    pose.elbowLeft = arm[0];
    pose.wristLeft = arm[1];
    if (s.kind === 'hammerfall') {
      pose.elbowRight = arm[0] + 4;
      pose.wristRight = arm[1] + 7;
    }
    pose.brace = Math.round(wind * 3);
    pose.head = Math.round(wind * 2);
  } else if (hammer && s.mode === 'slam') {
    const strikes = (m.events || []).filter((event) => event.type === 'forgeSlam'),
      previous = strikes.filter((event) => event.at <= (m.age || 0)).at(-1),
      age = previous ? m.age - previous.at : -1,
      after = age >= 0 ? Math.min(4, Math.floor(age / 0.12)) : -1,
      arm =
        after < 0
          ? [-35, -59]
          : [
              [14, 43],
              [10, 36],
              [4, 27],
              [1, 24],
              [0, 22],
            ][after];
    if (previous?.turn) {
      pose.elbowRight = arm[0];
      pose.wristRight = arm[1];
    } else {
      pose.elbowLeft = arm[0];
      pose.wristLeft = arm[1];
    }
    pose.brace = after === 0 ? 5 : after === 1 ? 3 : 0;
  }
  if (s.kind === 'heavyTread') {
    pose.brace = s.mode === 'windup' ? Math.round(wind * 3) : 2;
    pose.elbowLeft = pose.elbowRight = 4;
    pose.wristLeft = pose.wristRight = 27;
    const motion = m.colossusMotion;
    if (s.mode === 'slam' && motion?.kind === 'tread') {
      const age = Math.max(0, m.age - motion.started),
        u = clamp(age / motion.duration, 0, 1),
        lift = Math.round(Math.sin(Math.PI * u) * 16),
        foot = motion.side < 0 ? pose.left : pose.right;
      foot[0] = Math.round(Math.sin(Math.PI * u) * motion.side * 4);
      foot[1] = -lift;
      pose.piston = Math.round(lift * 0.32);
      pose.brace = age > motion.duration && age < motion.duration + 0.15 ? 4 : 2;
    }
  }
  const heating = ['pressure', 'meltdown', 'slag'].includes(s.kind);
  if (heating) {
    pose.doors = s.mode === 'windup' ? Math.round(wind * 7) : s.mode === 'slam' ? 7 : 2;
    if (!hammer) {
      pose.elbowLeft = pose.elbowRight = -5 - pose.doors;
      pose.wristLeft = pose.wristRight = 17 - pose.doors * 2;
    }
  }
  if (s.mode === 'cool' || (s.exposed || 0) > 0) {
    pose.doors = 9;
    pose.head = 2;
  }
  if (s.mode === 'shift') {
    pose.doors = 10;
    pose.elbowLeft = pose.elbowRight = -14;
    pose.wristLeft = pose.wristRight = -8;
    pose.brace = 3;
  }
  return pose;
}

function colossusPlate(ctx, x, y, width, height, color, trim = '#9c7255') {
  ctx.fillStyle = '#17151b';
  ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = trim;
  ctx.fillRect(x + 2, y + 1, width - 4, 2);
  ctx.fillStyle = '#2a2022';
  ctx.fillRect(x + 2, y + height - 4, width - 4, 3);
}

function colossusBodyParts(ctx, b, pose) {
  const px = (x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), width, height);
  };
  for (const side of [-1, 1]) {
    const foot = side < 0 ? pose.left : pose.right,
      hipX = side * 18,
      shinX = hipX + foot[0],
      shinY = 34 + foot[1];
    px(hipX - 9, 22, 18, 19, '#241e22');
    px(hipX - 4, 24, 8, 26 + foot[1], '#8e775d');
    px(hipX - 2, 27, 3, 20 + foot[1], '#c8ac7c');
    colossusPlate(ctx, shinX - 11, shinY, 22, 17, '#52382f');
    px(shinX - 9, shinY + 5, 18, 3, '#98745a');
    colossusPlate(ctx, shinX - 14, shinY + 17, 28, 11, '#44312c');
    px(shinX - 11, shinY + 18, 22, 2, '#b88a61');
    for (const x of [-7, 6]) px(shinX + x, shinY + 23, 2, 2, '#dac096');
  }
  const torsoY = -38 + pose.brace;
  colossusPlate(ctx, -34, torsoY, 68, 70 - pose.brace, '#4c322d');
  px(-29, torsoY + 7, 58, 2, '#b2875f');
  px(-25, torsoY + 12, 50, 4, '#2a2022');
  px(-22, torsoY + 13, 12, 1, '#94674c');
  px(10, torsoY + 13, 12, 1, '#94674c');
  for (const side of [-1, 1]) {
    const elbow = side < 0 ? pose.elbowLeft : pose.elbowRight,
      wrist = side < 0 ? pose.wristLeft : pose.wristRight;
    px(side * 29 - 6, -26 + pose.brace, 12, 20, '#20191e');
    colossusPlate(ctx, side * 35 - 9, -30 + pose.brace, 18, 19, '#76513b', '#c39162');
    ctx.strokeStyle = '#17151b';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(side * 36, -15 + pose.brace);
    ctx.lineTo(side * 45, elbow);
    ctx.stroke();
    ctx.strokeStyle = '#594030';
    ctx.lineWidth = 10;
    ctx.stroke();
    px(side * 45 - 6, elbow - 6, 12, 12, '#ac875d');
    px(side * 45 - 3, elbow - 3, 6, 6, '#38272a');
    ctx.strokeStyle = '#201b20';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(side * 45, elbow);
    ctx.lineTo(side * 49, wrist);
    ctx.stroke();
    ctx.strokeStyle = '#aa8b65';
    ctx.lineWidth = 5;
    ctx.stroke();
    colossusPlate(ctx, side * 49 - 12, wrist - 7, 24, 23, '#6a4634', '#cf9b62');
    px(side * 49 - 9, wrist + 4, 18, 3, '#32242a');
    px(side * 49 - 10, wrist + 12, 20, 4, '#8f684b');
    for (const y of [-26, -15, 12, 25]) {
      px(side * 29 - 2, y + pose.brace, 4, 3, '#c49a6c');
      px(side * 29, y + pose.brace + 1, 2, 2, '#251e23');
    }
  }
  colossusPlate(ctx, -18, torsoY + 26, 36, 35, '#24191d', '#a3754f');
  px(-13, torsoY + 30, 26, 26, '#c4542e');
  const hot = b.bs?.mode === 'slam' && ['pressure', 'meltdown'].includes(b.bs.kind),
    glow = hot || pose.doors > 6 ? '#ffe0a0' : '#ee9553';
  for (let i = 0; i < 4; i++) {
    const height = 16 + ((i * 3 + pose.piston + (b.bs?.mid?.phase || 0)) % 4) * 2;
    px(-11 + i * 6, torsoY + 55 - height, 4, height, glow);
    px(-10 + i * 6, torsoY + 55 - height, 2, Math.max(3, height - 10), '#fff0be');
  }
  for (const side of [-1, 1]) {
    const x = side < 0 ? -16 - pose.doors : pose.doors;
    colossusPlate(ctx, x, torsoY + 27, 16, 33, '#614030');
    for (let i = 0; i < 3; i++) {
      px(x + 3, torsoY + 32 + i * 8, 10, 3, '#221b1f');
      px(x + 4, torsoY + 34 + i * 8, 8, 1, '#d69559');
    }
    px(x + (side < 0 ? 11 : 3), torsoY + 39, 2, 10, '#d8ad75');
  }
  px(-24, 27, 48, 4, '#8d6048');
  px(-20, 31, 40, 3, '#33242a');
  const headY = -51 + pose.head + pose.brace;
  colossusPlate(ctx, -16, headY, 32, 20, '#2a2226', '#b69368');
  px(-12, headY + 3, 24, 3, '#78604a');
  px(-10, headY + 8, 20, 7, '#20171d');
  px(-8, headY + 9, 16, 4, '#ffce79');
  px(-5, headY + 10, 3, 2, '#fff3bc');
  px(3, headY + 10, 3, 2, '#fff3bc');
  px(-13, headY + 17, 26, 2, '#5a4033');
  for (const side of [-1, 1]) {
    const chimneyX = side * 22 - 5;
    colossusPlate(ctx, chimneyX, torsoY - 17, 10, 26, '#493a32');
    px(chimneyX + 1, torsoY - 17, 8, 3, '#b28b62');
    px(chimneyX + 2, torsoY - 13, 6, 5, '#1b181e');
  }
}

const colossusDrawBossBody = drawLateBossBody;
drawLateBossBody = function (ctx, b) {
  if (b.bossKey !== 'colossus') return colossusDrawBossBody(ctx, b);
  const surface = COLOSSUS_PIXEL_BODY,
    art = surface.getContext('2d');
  art.setTransform(1, 0, 0, 1, 0, 0);
  art.clearRect(0, 0, 144, 144);
  art.save();
  art.translate(72, 72);
  art.scale(0.7, 0.7);
  colossusBodyParts(art, b, colossusBodyPose(b));
  art.restore();
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(surface, b.x - 144 / 1.4, b.y - 144 / 1.4, 144 / 0.7, 144 / 0.7);
  ctx.restore();
};

const colossusDrawHazard = drawLateHazard;
drawLateHazard = function (ctx, hazard) {
  if (!hazard.colossusFoot && !hazard.colossusFracture) return colossusDrawHazard(ctx, hazard);
  const active = hazard.phase === 'active',
    progress = active ? 1 : clamp(1 - hazard.t / Math.max(0.01, hazard.delay), 0, 1);
  ctx.save();
  ctx.strokeStyle = active ? '#ffe6ad' : '#bd6840';
  ctx.globalAlpha = active ? 0.85 : 0.2 + progress * 0.22;
  ctx.lineWidth = active ? 3 : 1.5;
  if (hazard.colossusFoot) {
    const radius = hazard.radius || 40;
    for (let i = 0; i < 6; i++) {
      const angle = (i * TAU) / 6,
        inner = active ? 8 : radius * 0.65,
        outer = radius * (active ? 1 : 0.85);
      ctx.beginPath();
      ctx.moveTo(hazard.x + Math.cos(angle) * inner, hazard.y + Math.sin(angle) * inner);
      ctx.lineTo(
        hazard.x + Math.cos(angle + 0.08) * outer,
        hazard.y + Math.sin(angle + 0.08) * outer
      );
      ctx.stroke();
    }
    if (active) {
      ctx.fillStyle = '#e9974c';
      ctx.globalAlpha = 0.16;
      ctx.fillRect(hazard.x - 23, hazard.y - 13, 46, 26);
    }
  } else {
    const dx = hazard.x2 - hazard.x,
      dy = hazard.y2 - hazard.y,
      length = Math.max(1, Math.hypot(dx, dy)),
      px = -dy / length,
      py = dx / length;
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) {
      const offset = i > 0 && i < 8 ? (i % 2 ? 1 : -1) * (active ? 3 : 1) : 0,
        x = hazard.x + (dx * i) / 8 + px * offset,
        y = hazard.y + (dy * i) / 8 + py * offset;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
    if (active) {
      ctx.strokeStyle = '#d97640';
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = (hazard.width || 8) * 1.5;
      ctx.stroke();
    }
  }
  ctx.restore();
};
