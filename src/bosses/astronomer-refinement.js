const ASTRONOMER_BODY_FRAMES = [
  { ring: [0, 2.1, 4.2], tilt: [15, 20, 25], iris: 8, plates: 0, lens: 0 },
  { ring: [0.05, 2.06, 4.25], tilt: [17, 19, 23], iris: 8, plates: 2, lens: 1 },
  { ring: [0.1, 2.01, 4.31], tilt: [19, 17, 21], iris: 7, plates: 3, lens: 2 },
  { ring: [0.14, 1.97, 4.36], tilt: [20, 16, 22], iris: 7, plates: 2, lens: 1 },
  { ring: [0.16, 1.94, 4.39], tilt: [18, 18, 24], iris: 8, plates: 0, lens: 0 },
  { ring: [0.12, 1.99, 4.33], tilt: [16, 21, 26], iris: 9, plates: -2, lens: -1 },
  { ring: [0.07, 2.04, 4.27], tilt: [14, 23, 27], iris: 9, plates: -3, lens: -2 },
  { ring: [0.02, 2.08, 4.22], tilt: [14, 21, 26], iris: 8, plates: -2, lens: -1 },
];
const ASTRONOMER_PIXEL_BODY = document.createElement('canvas');
ASTRONOMER_PIXEL_BODY.width = 144;
ASTRONOMER_PIXEL_BODY.height = 144;

if (!MID_SEQUENCES.astronomer[1].includes('aperture'))
  MID_SEQUENCES.astronomer[1].splice(1, 0, 'aperture');

const astronomerStartMove = startAstronomerMove;
startAstronomerMove = function (b, kind) {
  if (kind !== 'aperture' || !b.bs.mid?.phase) return astronomerStartMove(b, kind);
  const m = b.bs.mid,
    p = G.player,
    target = midArenaPoint(p.x, p.y, 54),
    angle = Math.atan2(target.y - b.y, target.x - b.x),
    turn = m.step % 2 ? 1 : -1;
  m.astronomerAperture = { angle, turn, wave: -1 };
  beginMidMove(
    b,
    kind,
    0.78,
    2.15,
    [
      { at: 0.08, type: 'apertureWave', wave: 0 },
      { at: 0.74, type: 'apertureWave', wave: 1 },
      { at: 1.4, type: 'apertureWave', wave: 2 },
      { at: 2.02, type: 'apertureOpen' },
    ],
    target
  );
};

function astronomerApertureAngle(b, wave) {
  const aperture = b.bs.mid?.astronomerAperture,
    center = aperture?.angle ?? b.bs.a ?? 0,
    turn = aperture?.turn || 1;
  return center + [0, 0.4 * turn, -0.32 * turn][clamp(wave, 0, 2)];
}

const astronomerMidEvent = fireMidEvent;
fireMidEvent = function (b, event) {
  if (b.bossKey !== 'astronomer') return astronomerMidEvent(b, event);
  if (event.type === 'apertureOpen') {
    b.bs.exposed = Math.max(b.bs.exposed || 0, 1.35);
    return;
  }
  if (event.type !== 'apertureWave') return astronomerMidEvent(b, event);
  const aperture = b.bs.mid?.astronomerAperture;
  if (!aperture) return;
  aperture.wave = event.wave;
  const angle = astronomerApertureAngle(b, event.wave),
    arena = arenaBounds(),
    length = Math.hypot(arena.right - arena.left, arena.bottom - arena.top) + 80;
  for (const side of [-1, 1]) {
    const ray = angle + side * 0.27,
      startX = b.x + Math.cos(ray) * 48,
      startY = b.y + Math.sin(ray) * 48;
    midHazard(b, 'beamSegment', {
      x: startX,
      y: startY,
      x2: startX + Math.cos(ray) * length,
      y2: startY + Math.sin(ray) * length,
      width: 8,
      delay: 0.32,
      life: 0.27,
      damageMul: 0.74,
      sound: 'midLens',
      astronomerAperture: true,
    });
  }
};

function astronomerBodyPose(b) {
  const s = b.bs || {},
    m = s.mid || {},
    clock = save.motion ? 0 : (m.clock ?? G.tAll),
    frame = (((clock * 4.5) % 8) + 8) % 8,
    index = Math.floor(frame),
    first = ASTRONOMER_BODY_FRAMES[index],
    next = ASTRONOMER_BODY_FRAMES[(index + 1) % 8],
    mix = smoothBoss(frame - index),
    lerp = (a, c, u = mix) => a + (c - a) * u,
    pose = {
      ring: first.ring.map((a, i) => lerp(a, next.ring[i])),
      tilt: first.tilt.map((a, i) => lerp(a, next.tilt[i])),
      iris: lerp(first.iris, next.iris),
      plates: lerp(first.plates, next.plates),
      lens: lerp(first.lens, next.lens),
      focus: 0,
      angle: s.a || 0,
      open: 0,
      recoil: 0,
    };
  const wind = s.mode === 'windup' ? smoothBoss(1 - s.t / Math.max(0.01, s.duration)) : 0;
  if (s.kind === 'aperture' && m.astronomerAperture) {
    let focus = wind,
      wave = 0;
    if (s.mode === 'slam') {
      const age = m.age || 0;
      wave = age < 0.5 ? 0 : age < 1.16 ? 1 : 2;
      const previous = Math.max(0, wave - 1),
        settle = clamp((age - [0, 0.5, 1.16][wave]) / 0.22, 0, 1);
      pose.angle = lerp(
        astronomerApertureAngle(b, previous),
        astronomerApertureAngle(b, wave),
        smoothBoss(settle)
      );
      const since = age - [0.4, 1.06, 1.72][wave];
      pose.recoil = since >= 0 ? Math.max(0, 1 - since / 0.18) : 0;
      focus = age > 1.97 ? Math.max(0, 1 - (age - 1.97) / 0.18) : 1;
    } else if (s.mode === 'recover') {
      focus = 0;
      pose.open = clamp((s.exposed || 0) / 1.35, 0, 1);
    }
    if (s.mode === 'windup') pose.angle = astronomerApertureAngle(b, 0);
    pose.focus = focus;
    pose.ring = pose.ring.map((a, i) => lerp(a, pose.angle + [0, 0.78, -0.78][i], focus));
    pose.tilt = pose.tilt.map((a, i) => lerp(a, [7, 12, 18][i], focus));
    pose.iris = lerp(pose.iris, 2, focus);
    pose.plates = lerp(pose.plates, -7, focus);
  } else if (s.mode === 'windup') {
    pose.focus = wind * (s.kind === 'eclipse' ? 0.85 : 0.6);
    pose.iris = lerp(pose.iris, s.kind === 'eclipse' ? 2 : 5, wind);
    pose.tilt = pose.tilt.map((a, i) => lerp(a, a - 5 + i * 2, wind));
    pose.plates -= wind * 4;
  } else if (s.mode === 'slam') {
    const age = m.age || 0,
      release = Math.max(0, 1 - age / 0.28);
    pose.recoil = release;
    pose.iris += release * 4;
    pose.plates += release * 5;
    if (s.kind === 'constellation') {
      pose.ring = pose.ring.map((a, i) => a + Math.sin(age * 3 + i) * 0.12);
      pose.tilt = [21, 26, 30];
    }
  } else if (s.mode === 'shift') {
    const u = smoothBoss(1 - s.t / Math.max(0.01, s.duration));
    pose.ring = pose.ring.map((a, i) => a + u * (i % 2 ? -0.8 : 0.8));
    pose.tilt = pose.tilt.map((a, i) => a + Math.sin(u * Math.PI) * (8 + i * 3));
    pose.plates += Math.sin(u * Math.PI) * 8;
    pose.iris = 4 + Math.sin(u * Math.PI) * 8;
  }
  if ((s.exposed || 0) > 0 && s.mode !== 'windup' && s.mode !== 'shift') {
    pose.open = Math.max(pose.open, Math.min(1, s.exposed));
    pose.iris = Math.max(pose.iris, 9 + pose.open * 3);
  }
  return pose;
}

function astronomerRing(ctx, b, pose, index, front) {
  const radius = 42 + index * 13,
    tilt = pose.tilt[index],
    angle = pose.ring[index],
    start = front ? 0 : Math.PI,
    end = front ? Math.PI : TAU;
  ctx.save();
  ctx.rotate(angle);
  ctx.strokeStyle = '#101722';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, tilt, 0, start, end);
  ctx.stroke();
  ctx.strokeStyle = index ? b.col : '#d9f5f5';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.strokeStyle = index ? '#406a7f' : '#8baeb7';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 1.5, radius - 1, tilt, 0, start, end);
  ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i * TAU) / 8,
      y = Math.sin(a) * tilt;
    if (y >= 0 !== front) continue;
    const x = Math.cos(a) * radius;
    ctx.fillStyle = i % 2 ? '#304d60' : '#bedadd';
    ctx.fillRect(Math.round(x) - 1, Math.round(y) - 2, 3, 4);
  }
  ctx.restore();
}

function astronomerLens(ctx, b, x, y, angle, size, charge, broken) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angle);
  ctx.fillStyle = '#101722';
  ctx.fillRect(-size - 2, -size - 5, size * 2 + 4, size * 2 + 10);
  ctx.fillStyle = '#314b60';
  ctx.fillRect(-size, -size - 3, size * 2, size * 2 + 6);
  ctx.fillStyle = '#759cae';
  ctx.fillRect(-size, -size - 3, 2, size * 2 + 4);
  ctx.fillStyle = '#172d3b';
  ctx.fillRect(-size + 3, -size, Math.max(2, size * 2 - 6), size * 2);
  ctx.fillStyle = charge > 0.7 ? '#fff4c5' : '#d7ffff';
  ctx.fillRect(-size + 2, -size + 1, 3, Math.max(3, size * 2 - 3));
  ctx.fillStyle = charge > 0.7 ? '#fffbe1' : b.col;
  ctx.fillRect(0, -size + 3, Math.max(2, size - 2), Math.max(2, size * 2 - 6));
  ctx.fillStyle = '#b8d0ce';
  ctx.fillRect(-size - 1, -size - 5, 3, 3);
  ctx.fillRect(size - 2, size + 2, 3, 3);
  if (broken) {
    ctx.fillStyle = '#182633';
    ctx.fillRect(size - 4, -size, 5, 3);
    ctx.fillRect(size - 2, -size + 3, 3, 4);
    ctx.fillStyle = '#c2edf0';
    ctx.fillRect(size - 6, -size + 2, 2, 2);
  }
  ctx.restore();
}

function astronomerBodyParts(ctx, b, pose) {
  const s = b.bs || {},
    second = !!s.mid?.phase || !!s.second,
    clock = save.motion ? 0 : (s.mid?.clock ?? G.tAll);
  for (let i = 2; i >= 0; i--) astronomerRing(ctx, b, pose, i, false);
  const plates = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * TAU) / 5 + 0.35 + pose.plates * 0.025,
      radius = 48 + pose.plates + (i % 2) * pose.lens,
      x = Math.cos(angle) * radius,
      y = Math.sin(angle) * 32;
    plates.push({ angle, x, y, i });
  }
  for (const plate of plates)
    if (plate.y < 0)
      astronomerLens(ctx, b, plate.x, plate.y, plate.angle, 7, pose.focus, second && plate.i === 1);
  ctx.fillStyle = '#10131c';
  ctx.beginPath();
  ctx.arc(0, 0, 25, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#1c2030';
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = '#355568';
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const a = (i * TAU) / 12 + 0.08,
      x = Math.round(Math.cos(a) * 19),
      y = Math.round(Math.sin(a) * 19);
    ctx.fillStyle = i % 3 ? '#3f697c' : '#bbd5cd';
    ctx.fillRect(x - 1, y - 1, 2, 2);
  }
  ctx.save();
  ctx.rotate(pose.angle * pose.focus);
  const aperture = pose.iris;
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((i * TAU) / 6 + pose.focus * 0.38);
    ctx.fillStyle = '#2b4355';
    ctx.beginPath();
    ctx.moveTo(aperture, -2);
    ctx.lineTo(18, -8);
    ctx.lineTo(20, 3);
    ctx.lineTo(aperture + 3, 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#7697a7';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = pose.focus > 0.85 ? '#bcecf3' : '#fff4c5';
  ctx.beginPath();
  ctx.arc(0, 0, aperture, 0, TAU);
  ctx.fill();
  ctx.fillStyle = '#ffffdf';
  ctx.fillRect(-Math.max(1, aperture * 0.4), -Math.max(1, aperture * 0.4), 3, 3);
  ctx.restore();
  if (second) {
    ctx.strokeStyle = '#1b2634';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-15, -11);
    ctx.lineTo(-10, -8);
    ctx.lineTo(-13, -4);
    ctx.moveTo(12, 7);
    ctx.lineTo(17, 12);
    ctx.stroke();
  }
  for (const plate of plates)
    if (plate.y >= 0)
      astronomerLens(ctx, b, plate.x, plate.y, plate.angle, 7, pose.focus, second && plate.i === 1);
  for (let i = 0; i < 3; i++) {
    astronomerRing(ctx, b, pose, i, true);
    const angle = pose.ring[i],
      radius = 42 + i * 13 + pose.recoil * 3,
      x = Math.cos(angle) * radius,
      y = Math.sin(angle) * radius;
    astronomerLens(ctx, b, x, y, angle, 5 + i, pose.focus, second && i === 2);
  }
  if (s.kind === 'aperture' && pose.focus > 0.2) {
    for (const side of [-1, 1]) {
      const angle = pose.angle + side * 0.27,
        x = Math.cos(angle) * (49 + pose.recoil * 3),
        y = Math.sin(angle) * (49 + pose.recoil * 3);
      ctx.save();
      ctx.translate(Math.round(x), Math.round(y));
      ctx.rotate(angle);
      ctx.fillStyle = '#152534';
      ctx.fillRect(-6, -5, 13, 10);
      ctx.fillStyle = pose.recoil ? '#fffbe3' : '#c4f0f2';
      ctx.fillRect(0, -3, 6, 6);
      ctx.fillStyle = '#5c889d';
      ctx.fillRect(-5, -4, 3, 8);
      ctx.restore();
    }
  }
  if (pose.open > 0) {
    ctx.save();
    ctx.strokeStyle = '#ffe5a7';
    ctx.globalAlpha *= pose.open * 0.6;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
  const shield = b.adapt && (b.adapt.shieldUntil || 0) > (G.run?.t || 0);
  if (shield) {
    ctx.save();
    ctx.rotate(clock * 0.23);
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
}

const astronomerDrawBossBody = drawLateBossBody;
drawLateBossBody = function (ctx, b) {
  if (b.bossKey !== 'astronomer') return astronomerDrawBossBody(ctx, b);
  const surface = ASTRONOMER_PIXEL_BODY,
    art = surface.getContext('2d'),
    pose = astronomerBodyPose(b);
  art.setTransform(1, 0, 0, 1, 0, 0);
  art.clearRect(0, 0, 144, 144);
  art.save();
  art.translate(72, 72);
  art.scale(0.7, 0.7);
  astronomerBodyParts(art, b, pose);
  art.restore();
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(surface, b.x - 144 / 1.4, b.y - 144 / 1.4, 144 / 0.7, 144 / 0.7);
  ctx.restore();
};
