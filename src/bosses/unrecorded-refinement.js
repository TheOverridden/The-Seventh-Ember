function uncountedCounterweightPhase(b) {
  return b.hp > b.max * 0.66 ? 0 : b.hp > b.max * 0.33 ? 1 : 2;
}

function beginUncountedCounterweight(b) {
  const s = b.bs,
    axis = Math.atan2(G.player.y - b.y, G.player.x - b.x);
  s.counterweight = {
    clock: 0,
    duration: 3.95,
    axis,
    safeA: axis + Math.PI / 2,
    first: false,
    second: false,
    crown: false,
  };
  s.step++;
  s.kind = 'counterweight';
  s.mode = 'windup';
  s.a = axis;
  s.t = s.duration = s.counterweight.duration;
  s.targetX = G.player.x;
  s.targetY = G.player.y;
  s.hit = false;
}

function tickUncountedCounterweight(b, dt) {
  const s = b.bs,
    q = s.counterweight;
  q.clock += dt;
  s.a = q.axis;
  s.duration = q.duration;
  s.t = Math.max(0, q.duration - q.clock);
  s.mode = q.clock < 0.64 ? 'windup' : q.clock < 2.85 ? 'wait' : 'recover';
  if (!q.first && q.clock >= 0.64) {
    q.first = true;
    encounterHazard(b, 'sweep', b.x, b.y, q.axis - 0.5, {
      delay: 0.22,
      life: 0.64,
      len: 540,
      width: 8,
      turn: 1.45,
      damageMul: 0.61,
    });
    sfx('bossLaser');
  }
  if (!q.second && q.clock >= 1.64) {
    q.second = true;
    encounterHazard(b, 'sweep', b.x, b.y, q.axis + Math.PI + 0.5, {
      delay: 0.22,
      life: 0.64,
      len: 540,
      width: 8,
      turn: -1.45,
      damageMul: 0.61,
      color: '#d9a9ed',
    });
    sfx('bossLaser');
  }
  if (!q.crown && q.clock >= 2.78) {
    q.crown = true;
    for (let i = 0; i < 22; i++) {
      const a = q.axis + (i * TAU) / 22;
      if (Math.abs(angleDiff(a, q.safeA)) < 0.38) continue;
      lateShot(b, a, 280, b.dmg * 0.54, i % 2 ? b.col : '#e3b4ef');
    }
    sfx('eshoot');
  }
  if (q.clock >= q.duration) {
    delete s.counterweight;
    finishBossMove(b, 0.24);
  }
}

const refinedUncountedAI = uncountedAI;
uncountedAI = function (b, dt, d, dx, dy) {
  const s = b.bs,
    phase = uncountedCounterweightPhase(b);
  if (phase > (s.secretPhase || 0) || s.mode === 'shift') {
    delete s.counterweight;
    return refinedUncountedAI(b, dt, d, dx, dy);
  }
  if (s.kind === 'counterweight' && s.counterweight) {
    if (b.hp > b.max * 0.5) {
      delete s.counterweight;
      finishBossMove(b, 0.45);
      return;
    }
    return tickUncountedCounterweight(b, dt);
  }
  if (b.hp <= b.max * 0.5 && s.mode === 'wait' && s.t <= dt && s.step % 4 === 3) {
    beginUncountedCounterweight(b);
    return;
  }
  return refinedUncountedAI(b, dt, d, dx, dy);
};

const UNRECORDED_MASK_FRAMES = [
  [0, 0, 0, 0, 0, 0, 1, 1, 0],
  [1, -1, -0.05, 0.04, 1, 1, 0.9, 1.12, -0.08],
  [4, -2, -0.2, 0.03, 3, 0, 0.74, 1.28, -0.2],
  [7, -1, -0.34, 0.08, 7, 2, 1.24, 0.85, 0.17],
  [3, 1, -0.12, 0.08, 4, 1, 1.1, 0.92, 0.04],
  [4, -2, -0.03, 0.2, 3, 0, 0.74, 1.28, 0.2],
  [7, -1, -0.08, 0.34, 7, 2, 1.24, 0.85, -0.17],
  [5, -3, -0.17, 0.17, 9, 2, 1.18, 1.1, 0],
  [2, 1, -0.04, 0.04, 3, 1, 0.92, 1.04, 0.04],
];

function unrecordedBodyFrame(b) {
  const s = b.bs,
    q = s.counterweight;
  if (s.mode === 'shift') return 7;
  if (s.mode === 'recover') return 8;
  if (s.mode === 'dash') return 3;
  if (q) {
    if (q.clock < 0.24) return 1;
    if (q.clock < 0.64) return 2;
    if (q.clock < 0.96) return 3;
    if (q.clock < 1.3) return 4;
    if (q.clock < 1.64) return 5;
    if (q.clock < 1.96) return 6;
    if (q.clock < 2.4) return 4;
    if (q.clock < 2.85) return 7;
    return 8;
  }
  if (s.mode !== 'windup') return 0;
  const u = 1 - s.t / Math.max(0.01, s.duration);
  if (s.kind === 'crown' || s.kind === 'collapse') return u < 0.35 ? 1 : u < 0.75 ? 2 : 7;
  if (s.kind === 'turn') return u < 0.35 ? 1 : u < 0.7 ? 2 : 5;
  return u < 0.35 ? 1 : u < 0.7 ? 2 : 3;
}

const UNRECORDED_PIXEL_BODY = document.createElement('canvas');
UNRECORDED_PIXEL_BODY.width = 144;
UNRECORDED_PIXEL_BODY.height = 144;

function drawUnrecordedBodyParts(ctx, b, frame) {
  const s = b.bs,
    phase = s.secretPhase || 0,
    q = s.counterweight,
    t = save.motion ? 0 : G.tAll,
    [gap, brow, leftTilt, rightTilt, jaw, coreY, coreW, coreH, ringTilt] =
      UNRECORDED_MASK_FRAMES[frame],
    px = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), w, h);
    };
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let ring = 0; ring < 3; ring++) {
    ctx.save();
    const rotation = q
      ? q.axis + ring * 2.1 + ringTilt * (ring + 1)
      : t * (ring % 2 ? -0.55 : 0.42) + ring * 2.1 + ringTilt;
    ctx.rotate(rotation);
    ctx.strokeStyle = (ring === 2 ? '#e8b9ef' : '#86dfdc') + (ring === phase ? 'dd' : '68');
    ctx.lineWidth = ring === phase ? 3 : 1.5;
    ctx.setLineDash(ring === 1 ? [7, 7] : []);
    ctx.beginPath();
    ctx.ellipse(0, 0, 48 + ring * 11, 19 + ring * 7, 0, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
    for (let i = 0; i < 3; i++) {
      const a = (i * TAU) / 3,
        rr = 48 + ring * 11;
      px(
        Math.cos(a) * rr - 3,
        Math.sin(a) * (19 + ring * 7) - 3,
        6,
        6,
        i === phase ? '#f4e4b3' : '#75c9cc'
      );
    }
    ctx.restore();
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = '#9ce7e3';
  ctx.lineWidth = 3;
  ctx.fillStyle = '#09151d';
  ctx.beginPath();
  ctx.moveTo(-20, -18 + brow);
  ctx.lineTo(0, -35 + brow);
  ctx.lineTo(20, -18 + brow);
  ctx.lineTo(13, -9 + brow);
  ctx.lineTo(-13, -9 + brow);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  px(-3, -29 + brow, 6, 8, '#416269');
  px(-1, -31 + brow, 2, 7, '#d8f8e9');
  ctx.save();
  ctx.translate(0, coreY);
  ctx.scale(coreW, coreH);
  ctx.fillStyle = '#295660';
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(10, 3);
  ctx.lineTo(0, 16);
  ctx.lineTo(-10, 3);
  ctx.closePath();
  ctx.fill();
  px(-3, -3, 6, 11, phase === 2 ? '#edc6e9' : '#c6f4e8');
  px(-6, 0, 12, 4, '#85dbd6');
  px(-1, -2, 2, 8, '#fbf6d5');
  ctx.restore();
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * (8 + gap), 0);
    ctx.rotate(side < 0 ? leftTilt : rightTilt);
    ctx.fillStyle = '#09151d';
    ctx.strokeStyle = side < 0 ? '#9ce7e3' : phase === 2 ? '#d9a9ed' : '#85dbd6';
    ctx.beginPath();
    ctx.moveTo(side * 4, -23);
    ctx.lineTo(side * 17, -18);
    ctx.lineTo(side * 13, 17);
    ctx.lineTo(side * 4, 11);
    ctx.lineTo(side, -4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#d7f8ef';
    ctx.beginPath();
    ctx.moveTo(side * 6, -12);
    ctx.lineTo(-side * 4, -17);
    ctx.lineTo(-side, -4);
    ctx.closePath();
    ctx.fill();
    px(side * 9 - 1, -3, 2, 10, '#507b82');
    px(side * 5 - 1, 8, 2, 5, '#c29bcd');
    ctx.restore();
  }
  ctx.save();
  ctx.translate(0, jaw);
  ctx.fillStyle = '#09151d';
  ctx.strokeStyle = phase === 2 ? '#d9a9ed' : '#85dbd6';
  ctx.beginPath();
  ctx.moveTo(-18, 15);
  ctx.lineTo(-20, 25);
  ctx.lineTo(0, 39);
  ctx.lineTo(20, 25);
  ctx.lineTo(18, 15);
  ctx.lineTo(0, 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  px(-11, 24, 5, 2, '#42616c');
  px(6, 24, 5, 2, '#42616c');
  px(-4, 28, 8, 2, '#a2dad7');
  px(-2, 32, 4, 3, '#d3b8d6');
  ctx.restore();
  for (let i = 0; i < 6; i++) {
    const a = t * (i % 2 ? -0.9 : 0.75) + (i * TAU) / 6,
      rr = 31 + 9 * (save.motion ? 0 : Math.sin(t * 1.7 + i));
    px(Math.cos(a) * rr - 2, Math.sin(a) * rr - 2, 4, 4, i % 2 ? '#cf9fe2' : '#85ded8');
  }
  ctx.restore();
}

const refinedUnrecordedDrawBody = drawLateBossBody;
drawLateBossBody = function (ctx, b) {
  if (b.bossKey !== 'uncounted') return refinedUnrecordedDrawBody(ctx, b);
  const surface = UNRECORDED_PIXEL_BODY,
    art = surface.getContext('2d');
  art.setTransform(1, 0, 0, 1, 0, 0);
  art.clearRect(0, 0, 144, 144);
  art.save();
  art.translate(72, 72);
  art.scale(0.7, 0.7);
  drawUnrecordedBodyParts(art, b, unrecordedBodyFrame(b));
  art.restore();
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(surface, b.x - 144 / 1.4, b.y - 144 / 1.4, 144 / 0.7, 144 / 0.7);
  ctx.restore();
};
