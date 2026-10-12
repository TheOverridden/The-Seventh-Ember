const SERAPH_WING_FRAMES = [
  { shoulder: -0.06, elbow: -0.08, fan: -0.05, head: 0, tail: 0 },
  { shoulder: -0.12, elbow: -0.16, fan: -0.11, head: -1, tail: -1 },
  { shoulder: -0.18, elbow: -0.2, fan: -0.13, head: -2, tail: -2 },
  { shoulder: -0.1, elbow: -0.07, fan: 0.04, head: -1, tail: 0 },
  { shoulder: 0.08, elbow: 0.12, fan: 0.16, head: 1, tail: 2 },
  { shoulder: 0.17, elbow: 0.18, fan: 0.2, head: 2, tail: 3 },
  { shoulder: 0.1, elbow: 0.06, fan: 0.1, head: 1, tail: 2 },
  { shoulder: 0.01, elbow: -0.04, fan: 0.01, head: 0, tail: 1 },
];
const SERAPH_BODY_SURFACE = document.createElement('canvas');
SERAPH_BODY_SURFACE.width = SERAPH_BODY_SURFACE.height = 144;

const seraphPinionAttack = encounterAttack;
encounterAttack = function (b) {
  const s = b.bs;
  if (b.bossKey !== 'seraph' || b.hp > b.max * 0.5 || ((s.cycle || 0) + 1) % 5 !== 0)
    return seraphPinionAttack(b);
  s.cycle = (s.cycle || 0) + 1;
  s.kind = 'pinion';
  s.mode = 'windup';
  s.t = s.duration = 0.8;
  s.elapsed = 0;
  s.total = 4.7;
  s.a = Math.atan2(G.player.y - b.y, G.player.x - b.x);
  s.targetX = G.player.x;
  s.targetY = G.player.y;
  s.lungeAt = 0;
  s.lungeLeft = 0;
  s.hit = false;
  s.events = [];
  s.seraphPinion = {
    angle: s.a,
    targetX: s.targetX,
    targetY: s.targetY,
    wall: 0,
    wallAt: -1,
  };
  scheduleBoss(b, 0.86, 'seraphFeatherWall', { side: -1 });
  scheduleBoss(b, 1.48, 'seraphFeatherWall', { side: 1 });
  scheduleBoss(b, 2.2, 'charge', { a: s.a, time: 0.5, speed: 540 });
  scheduleBoss(b, 2.78, 'seraphLanding');
};

const seraphPinionEvent = executeBossEvent;
executeBossEvent = function (b, event) {
  if (b.bossKey !== 'seraph') return seraphPinionEvent(b, event);
  if (event.kind === 'seraphLanding') {
    b.bs.airborne = false;
    b.bs.exposed = Math.max(b.bs.exposed || 0, 1.92);
    encounterHazard(b, 'annulus', b.x, b.y, 0, {
      delay: 0.34,
      life: 0.7,
      radius: 42,
      expand: 130,
      width: 9,
      damageMul: 0.7,
    });
    burst(b.x, b.y + 9, 14, '#d2d9ef', 130, 0.45, 2, true);
    sfx('midHammer');
    return;
  }
  if (event.kind !== 'seraphFeatherWall') return seraphPinionEvent(b, event);
  const pinion = b.bs.seraphPinion;
  if (!pinion) return;
  const side = event.side,
    tip = seraphWingTip(b, side),
    origin = { ...b, x: tip.x, y: tip.y, r: 0 },
    aim = Math.atan2(pinion.targetY - origin.y, pinion.targetX - origin.x),
    gap = aim + side * 0.13;
  for (let i = -6; i <= 6; i++) {
    const angle = aim + i * 0.105;
    if (Math.abs(angleDiff(angle, gap)) < 0.19) continue;
    const shot = lateShot(origin, angle, 278, b.dmg * 0.67, '#d7d8fb');
    if (shot) {
      shot.seraphFeather = true;
      shot.r = 4;
    }
  }
  pinion.wall = side;
  pinion.wallAt = b.bs.elapsed;
  burst(origin.x, origin.y, 6, '#cbd6ff', 70, 0.25, 2, true);
  sfx('eshoot');
};

const seraphWingAI = seraphAI;
seraphAI = function (b, dt, d, dx, dy) {
  seraphWingAI(b, dt, d, dx, dy);
  if (!b.introduced) return;
  const s = b.bs;
  s.seraphClock = (s.seraphClock || 0) + dt;
  if (s.kind === 'pinion' && s.total) {
    if (s.elapsed >= 2.2) s.airborne = false;
    if (s.elapsed >= 2.78) s.mode = 'recover';
  }
};

function seraphBodyPose(b) {
  const s = b.bs || {},
    clock = save.motion ? 0 : (s.seraphClock ?? G.tAll),
    frame = (((clock * 5.5) % 8) + 8) % 8,
    index = Math.floor(frame),
    first = SERAPH_WING_FRAMES[index],
    next = SERAPH_WING_FRAMES[(index + 1) % 8],
    mix = smoothBoss(frame - index),
    lerp = (a, c, u = mix) => a + (c - a) * u,
    pose = {
      shoulder: lerp(first.shoulder, next.shoulder),
      elbow: lerp(first.elbow, next.elbow),
      fan: lerp(first.fan, next.fan),
      head: lerp(first.head, next.head),
      tail: lerp(first.tail, next.tail),
      fold: 0,
      roll: 0,
      crouch: 0,
      halo: 0,
      release: 0,
      side: 0,
      lift: s.airborne ? 14 : 0,
    },
    wind = s.mode === 'windup' ? smoothBoss(clamp(1 - s.t / Math.max(0.01, s.duration), 0, 1)) : 0,
    elapsed = s.elapsed || 0;
  if (s.kind === 'pinion' && s.total) {
    if (elapsed < 0.8) {
      pose.fold = wind * 0.82;
      pose.head = lerp(pose.head, -3, wind);
      pose.halo = wind * 0.15;
    } else if (elapsed < 2.2) {
      const wall = elapsed < 1.23 ? -1 : 1,
        start = wall < 0 ? 0.8 : 1.23,
        u = clamp((elapsed - start) / 0.23, 0, 1);
      pose.fold = 0.82 - smoothBoss(u) * 0.68;
      pose.side = wall;
      pose.release = Math.max(0, 1 - Math.abs(elapsed - (wall < 0 ? 0.86 : 1.48)) / 0.22);
      pose.fan = -0.25 + pose.release * 0.8;
      pose.elbow = 0.05 + pose.release * 0.3;
      pose.head = -2;
    } else if (elapsed < 2.78) {
      const u = clamp((elapsed - 2.2) / 0.58, 0, 1);
      pose.fold = 0.76;
      pose.roll = clamp(Math.sin(s.a || 0) * 0.25, -0.25, 0.25);
      pose.head = 2 + u * 3;
      pose.tail = -8;
      pose.lift = 14 * (1 - smoothBoss(u));
    } else {
      const u = clamp((elapsed - 2.78) / 0.48, 0, 1);
      pose.fold = 0.76 * (1 - smoothBoss(u));
      pose.crouch = Math.sin(u * Math.PI) * 5;
      pose.shoulder = lerp(0.3, pose.shoulder, smoothBoss(u));
      pose.elbow = lerp(0.4, pose.elbow, smoothBoss(u));
      pose.lift = 0;
    }
  } else if (s.mode === 'dash' || s.mode === 'dive') {
    pose.fold = 0.72;
    pose.head = 4;
    pose.tail = -7;
    pose.roll = clamp(Math.sin(s.a || 0) * 0.25, -0.25, 0.25);
    pose.lift = 5;
  } else if (s.mode === 'windup') {
    pose.fold = wind * (s.kind === 'plunge' ? 0.78 : s.kind === 'corona' ? 0.12 : 0.4);
    pose.head -= wind * 2;
    pose.shoulder -= wind * 0.22;
    pose.fan -= wind * 0.18;
    pose.halo = s.kind === 'corona' ? wind * 0.45 : 0;
  } else if (s.mode === 'recover') {
    const u = clamp(s.t / Math.max(0.01, s.duration || 1), 0, 1);
    pose.crouch = u * 3;
    pose.shoulder += u * 0.15;
    pose.elbow += u * 0.12;
    pose.lift = 0;
  } else if (s.mode === 'shift') {
    const u = clamp(1 - s.t / 1.5, 0, 1);
    pose.shoulder -= Math.sin(u * Math.PI) * 0.4;
    pose.elbow -= Math.sin(u * Math.PI) * 0.2;
    pose.fan -= Math.sin(u * Math.PI) * 0.25;
    pose.halo = u * 0.4;
  }
  return pose;
}

function seraphWingTip(b, side) {
  const pose = seraphBodyPose(b),
    stroke = pose.release * (pose.side === side ? 1 : 0.3),
    shoulder = pose.shoulder + pose.fold * 1.02 - stroke * 0.24,
    elbow = pose.elbow + pose.fold * 0.37,
    armX = 27 + Math.cos(elbow) * 20 - Math.sin(elbow) * 11,
    armY = -10 + Math.sin(elbow) * 20 + Math.cos(elbow) * 11,
    x = side * (8 + Math.cos(shoulder) * armX - Math.sin(shoulder) * armY),
    y = -4 + Math.sin(shoulder) * armX + Math.cos(shoulder) * armY;
  return {
    x: b.x + Math.cos(pose.roll) * x - Math.sin(pose.roll) * y,
    y: b.y + Math.sin(pose.roll) * x + Math.cos(pose.roll) * y + pose.crouch - pose.lift,
  };
}

function seraphWingParts(ctx, b, pose, side) {
  const stroke = pose.release * (pose.side === side ? 1 : 0.3),
    shoulder = pose.shoulder + pose.fold * 1.02 - stroke * 0.24,
    elbow = pose.elbow + pose.fold * 0.37;
  ctx.save();
  ctx.scale(side, 1);
  ctx.translate(8, -4);
  ctx.rotate(shoulder);
  ctx.fillStyle = '#111522';
  ctx.beginPath();
  ctx.moveTo(-5, 0);
  ctx.lineTo(12, -22);
  ctx.lineTo(31, -24);
  ctx.lineTo(41, -10);
  ctx.lineTo(24, 19);
  ctx.lineTo(3, 10);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#272a46';
  ctx.beginPath();
  ctx.moveTo(0, -2);
  ctx.lineTo(13, -18);
  ctx.lineTo(28, -20);
  ctx.lineTo(35, -9);
  ctx.lineTo(22, 14);
  ctx.lineTo(7, 7);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#64769a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(4, -1);
  ctx.lineTo(16, -13);
  ctx.lineTo(29, -12);
  ctx.stroke();
  ctx.fillStyle = '#8899bd';
  ctx.fillRect(11, -13, 3, 3);
  ctx.translate(27, -10);
  ctx.rotate(elbow);
  ctx.fillStyle = '#272a46';
  ctx.beginPath();
  ctx.moveTo(-5, -7);
  ctx.lineTo(11, -14);
  ctx.lineTo(27, -1);
  ctx.lineTo(16, 31);
  ctx.lineTo(-6, 18);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#10131c';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = b.col;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-2, -3);
  ctx.lineTo(15, 1);
  ctx.lineTo(12, 24);
  ctx.stroke();
  for (let i = 0; i < 7; i++) {
    const angle = -0.24 + i * 0.085 + pose.fan + stroke * 0.2,
      length = 31 - i * 1.6,
      featherX = 1 + i * 3,
      featherY = -9 + i * 3.8;
    ctx.save();
    ctx.translate(featherX, featherY);
    ctx.rotate(angle);
    ctx.fillStyle = '#101423';
    ctx.beginPath();
    ctx.moveTo(-4, -4);
    ctx.lineTo(4, -5);
    ctx.lineTo(7, length - 7);
    ctx.lineTo(2, length);
    ctx.lineTo(-3, length - 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = i % 2 ? '#778bc7' : '#b8c7ef';
    ctx.beginPath();
    ctx.moveTo(-2, -2);
    ctx.lineTo(2, -3);
    ctx.lineTo(5, length - 8);
    ctx.lineTo(1, length - 3);
    ctx.lineTo(-1, length - 5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#eaf0ff';
    ctx.fillRect(-1, 0, 1.5, Math.max(4, length - 8));
    ctx.fillStyle = '#59658b';
    ctx.fillRect(2, 7, 2, 7);
    if (b.bs?.second && i === 5) {
      ctx.fillStyle = '#171b2b';
      ctx.fillRect(2, length - 8, 4, 3);
    }
    ctx.restore();
  }
  ctx.restore();
}

function seraphBodyParts(ctx, b, pose) {
  ctx.save();
  ctx.translate(0, pose.crouch);
  ctx.rotate(pose.roll);
  for (const side of [-1, 1]) seraphWingParts(ctx, b, pose, side);
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 5, 8);
    ctx.rotate(side * (0.1 + pose.fold * 0.18));
    ctx.fillStyle = '#20263d';
    ctx.fillRect(-4, 0, 8, 25 + pose.tail);
    ctx.fillStyle = '#6b78aa';
    ctx.fillRect(-2, 3, 2, 18 + pose.tail);
    ctx.fillStyle = '#bfcbe7';
    ctx.fillRect(-1, 4, 1, 12 + pose.tail);
    ctx.restore();
  }
  ctx.fillStyle = '#111522';
  ctx.beginPath();
  ctx.moveTo(-12, -4);
  ctx.lineTo(-9, 12);
  ctx.lineTo(0, 23 + pose.tail * 0.2);
  ctx.lineTo(9, 12);
  ctx.lineTo(12, -4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3d486e';
  ctx.fillRect(-7, 0, 14, 7);
  ctx.fillStyle = '#b1bedf';
  ctx.fillRect(-2, 2, 4, 9);
  ctx.save();
  ctx.translate(0, pose.head);
  ctx.fillStyle = '#10121c';
  ctx.beginPath();
  ctx.arc(0, -9, 17, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = '#526384';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#1d263b';
  ctx.fillRect(-10, -21, 20, 5);
  ctx.fillStyle = '#eef0ff';
  ctx.fillRect(-4, -14, 8, 10);
  ctx.fillStyle = '#b1c0ff';
  ctx.fillRect(-2, -12, 4, 9);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-3, -14, 2, 3);
  ctx.fillStyle = '#7484ad';
  for (const side of [-1, 1]) {
    ctx.fillRect(side * 10 - 2, -20, 4, 2);
    ctx.fillRect(side * 11 - 1, -15, 2, 7);
  }
  ctx.save();
  ctx.translate(0, -34);
  ctx.rotate(pose.halo);
  ctx.strokeStyle = '#171d2a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 8, 0, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = '#d8c792';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#fff1c9';
  ctx.fillRect(-17, -6, 4, 1);
  ctx.fillRect(12, 4, 3, 1);
  ctx.restore();
  ctx.restore();
  if (b.adapt && (b.adapt.shieldUntil || 0) > (G.run?.t || 0)) {
    ctx.save();
    ctx.rotate((save.motion ? 0 : G.tAll) * 0.23);
    ctx.strokeStyle = '#f7e6ff';
    ctx.globalAlpha *= 0.8;
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      ctx.rotate(TAU / 8);
      ctx.beginPath();
      ctx.moveTo(b.r + 9, -3);
      ctx.lineTo(b.r + 16, 0);
      ctx.lineTo(b.r + 9, 3);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}

const seraphDrawBossBody = drawLateBossBody;
drawLateBossBody = function (ctx, b) {
  if (b.bossKey !== 'seraph') return seraphDrawBossBody(ctx, b);
  const surface = SERAPH_BODY_SURFACE,
    art = surface.getContext('2d'),
    pose = seraphBodyPose(b);
  art.setTransform(1, 0, 0, 1, 0, 0);
  art.clearRect(0, 0, 144, 144);
  art.save();
  art.translate(72, 72);
  art.scale(0.7, 0.7);
  seraphBodyParts(art, b, pose);
  art.restore();
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(surface, b.x - 144 / 1.4, b.y - 144 / 1.4 - pose.lift, 144 / 0.7, 144 / 0.7);
  ctx.restore();
};
