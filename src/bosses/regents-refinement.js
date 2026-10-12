function regentHandoverAvailable(pair, c) {
  if (pair.length !== 2 || !c.phase) return false;
  const hp = pair.reduce((sum, b) => sum + b.hp, 0),
    max = pair.reduce((sum, b) => sum + b.max, 0);
  return max > 0 && hp <= max * 0.5;
}

const regentRefinedBeginMeasure = beginRegentMeasure;
beginRegentMeasure = function (pair, c, forced) {
  const available = regentHandoverAvailable(pair, c);
  if (forced === 'handover' && !available) forced = undefined;
  const handover = available && (forced === 'handover' || (!forced && c.step % 5 === 3));
  regentRefinedBeginMeasure(pair, c, handover ? 'handover' : forced);
  if (!handover) return;
  const blade = pair.find((b) => b.twinRole === 'blade'),
    bell = pair.find((b) => b.twinRole === 'bell');
  c.duration = 4.75;
  c.relayAx = blade.x;
  c.relayAy = blade.y;
  c.relayBx = bell.x;
  c.relayBy = bell.y;
  for (const b of pair) b.bs.duration = c.duration;
};

function regentHandoverDash(b, x, y) {
  const distance = Math.hypot(x - b.x, y - b.y),
    speed = Math.min(850, Math.max(280, distance / 0.6));
  regentDashToward(b, x, y, speed, Math.max(0.12, distance / speed));
}

const regentRefinedFormation = moveRegentFormation;
moveRegentFormation = function (pair, c, dt) {
  if (c.kind !== 'handover') return regentRefinedFormation(pair, c, dt);
  for (const b of pair) {
    if (tickRegentDash(b, dt)) continue;
    const blade = b.twinRole === 'blade',
      swapped = c.clock >= 0.68 && c.clock < 2.76,
      atA = blade !== swapped,
      x = atA ? c.relayAx : c.relayBx,
      y = atA ? c.relayAy : c.relayBy;
    regentMoveTo(b, x, y, dt, c.clock > 3.55 ? 150 : 235);
  }
};

const regentRefinedFireMeasure = fireRegentMeasure;
fireRegentMeasure = function (pair, c) {
  if (c.kind !== 'handover') return regentRefinedFireMeasure(pair, c);
  const blade = pair.find((b) => b.twinRole === 'blade'),
    bell = pair.find((b) => b.twinRole === 'bell');
  if (!blade || !bell) return;
  const exchange = (reverse) => {
    const ax = reverse ? c.relayBx : c.relayAx,
      ay = reverse ? c.relayBy : c.relayAy,
      bx = reverse ? c.relayAx : c.relayBx,
      by = reverse ? c.relayAy : c.relayBy,
      angle = Math.atan2(by - ay, bx - ax);
    regentCutAt(blade, blade.x, blade.y, angle, reverse ? -0.36 : 0.36, 0.2);
    regentHandoverDash(blade, bx, by);
    regentHandoverDash(bell, ax, ay);
  };
  regentOnce(c, 'relayFirst', 0.68, () => exchange(false));
  regentOnce(c, 'relayFirstBell', 1.3, () => {
    encounterHazard(bell, 'annulus', c.relayBx, c.relayBy, 0, {
      delay: 0.28,
      life: 1.42,
      radius: 16,
      expand: 205,
      width: 9,
      damageMul: 0.6,
    });
    sfx('regentBell');
  });
  regentOnce(c, 'relaySecond', 2.76, () => exchange(true));
  regentOnce(c, 'relaySecondBell', 3.38, () => {
    encounterHazard(bell, 'annulus', c.relayAx, c.relayAy, 0, {
      delay: 0.28,
      life: 1.05,
      radius: 16,
      expand: 205,
      width: 9,
      damageMul: 0.6,
    });
    sfx('regentBell');
  });
};

const REGENT_BLADE_FRAMES = [
  [0, 0, 0, 0, -0.06, -0.7, 0.32, 0, 0, 0, 0],
  [-2, 2, -2, 1, -0.12, -1.08, 0.45, -2, 2, 2, -1],
  [-3, 1, -3, 0, -0.17, -1.45, 0.64, -4, 3, 3, -2],
  [-1, 2, -1, 1, -0.1, -1.7, 0.5, -4, 1, 4, -2],
  [3, 1, 2, 0, 0.14, -0.24, -0.45, 3, -3, -3, 4],
  [4, 0, 3, -1, 0.19, 0.18, -0.65, 4, -4, -5, 5],
  [2, 1, 1, 0, 0.07, -0.35, -0.1, 2, -1, -2, 3],
  [0, 2, 0, 1, 0, -0.5, 0.18, 0, 0, 2, 1],
  [-1, 3, 0, 3, -0.02, -0.4, 0.25, 0, 0, 1, 1],
];
const REGENT_BELL_FRAMES = [
  [0, 0, 0, 0, 0.06, -0.23, 0.27, 0, 0, 0, 0],
  [1, 2, 1, 1, 0.11, -0.5, 0.47, 1, -1, -1, 2],
  [2, 1, 1, -1, 0.15, -0.85, 0.61, 3, -3, -3, 3],
  [0, 0, 0, -2, 0.08, -1.15, 0.58, 1, -1, -2, 3],
  [-2, 1, -2, 0, -0.12, 0.17, -0.36, -3, 3, 4, -3],
  [-3, 0, -2, 0, -0.17, 0.51, -0.53, -4, 4, 5, -4],
  [-1, 1, -1, 0, -0.06, -0.12, 0.02, -1, 2, 2, -2],
  [0, 2, 0, 1, 0, -0.18, 0.2, 0, 0, 1, 2],
  [1, 3, 0, 3, 0.02, -0.1, 0.23, 0, 0, 1, 1],
];
const REGENT_WALK_FRAMES = [0, 1, 2, 0, 6, 7];

function regentBodyFrame(b) {
  const s = b.bs || {},
    c = s.duet,
    blade = b.twinRole === 'blade';
  if (!c) return 0;
  if (s.mode === 'shift' || c.mode === 'shift') return 8;
  if (save.motion) return s.mode === 'dash' ? 4 : s.mode === 'windup' ? 2 : 0;
  if (s.duetDash?.left > 0) return s.duetDash.left > 0.32 ? 4 : 5;
  if (s.mode === 'recover' || c.clock > c.duration - 0.5) return 7;
  const fast = c.phase > 0,
    beats =
      {
        crossing: blade ? [0.62, 1.65] : [0.62, 1.65, ...(fast ? [2.62] : [])],
        counterstep: fast ? [0.58, 1.42, 2.26, 3.1] : [0.62, 1.55, 2.48],
        pincer: fast ? [0.74, 1.93, 3.02] : [0.74, 1.93],
        crescendo: [0.55, 1.45, 2.38, 3.42],
        handover: blade ? [0.68, 2.76] : [1.3, 3.38],
        theLastBlade: [0.48, 1.35, 2.22, 3.05],
        theLastBell: [0.48, 1.35, 2.22, 3.05],
      }[c.kind] || [];
  for (const at of beats) {
    const d = c.clock - at;
    if (d < -0.36 || d > 0.5) continue;
    return d < -0.22 ? 1 : d < -0.1 ? 2 : d < 0 ? 3 : d < 0.14 ? 4 : d < 0.3 ? 5 : 6;
  }
  if (c.kind === 'handover') return c.clock < 0.4 ? 1 : 0;
  return REGENT_WALK_FRAMES[Math.floor(c.clock * 8) % REGENT_WALK_FRAMES.length];
}

const REGENT_REFINED_SURFACE = document.createElement('canvas');
REGENT_REFINED_SURFACE.width = 144;
REGENT_REFINED_SURFACE.height = 144;

function drawRegentRefinedBody(ctx, b, frame) {
  const blade = b.twinRole === 'blade',
    pose = (blade ? REGENT_BLADE_FRAMES : REGENT_BELL_FRAMES)[frame],
    [hipX, hipY, headX, headY, turn, arm, backArm, leftFoot, rightFoot, hemA, hemB] = pose,
    robe = blade ? '#5a2f40' : '#392b4b',
    light = blade ? '#b25473' : '#7560a1',
    edge = blade ? '#d094a0' : '#ac9cce',
    c = b.col,
    px = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), w, h);
    };
  ctx.save();
  const duet = b.bs?.duet,
    facing =
      duet?.kind === 'handover'
        ? Math.atan2(duet.relayBy - duet.relayAy, duet.relayBx - duet.relayAx) +
          (b.twinRole === 'bell' ? Math.PI : 0) +
          (duet.clock >= 2.76 ? Math.PI : 0)
        : b.bs?.duetDash?.left > 0
          ? b.bs.duetDash.a
          : b.bs?.a || 0;
  if (Math.cos(facing) < 0) ctx.scale(-1, 1);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#10131c';
  px(-16 + leftFoot, 30, 10, 10, '#17121c');
  px(6 + rightFoot, 30, 10, 10, '#17121c');
  px(-15 + leftFoot, 32, 8, 3, '#8e6e67');
  px(7 + rightFoot, 32, 8, 3, '#6e5063');
  ctx.translate(hipX, hipY);
  ctx.fillStyle = robe;
  ctx.beginPath();
  ctx.moveTo(-25 + hemA, 35);
  ctx.lineTo(-28, -11);
  ctx.lineTo(headX, -39 + headY);
  ctx.lineTo(28, -11);
  ctx.lineTo(25 + hemB, 35);
  ctx.lineTo(8, 31);
  ctx.lineTo(-5, 36);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const shift = i < 2 ? hemA : hemB;
    px(-22 + i * 13 + shift * 0.35, 17, 7, 18 + (i % 2) * 7, light);
    px(-20 + i * 13 + shift * 0.35, 20, 2, 13 + (i % 2) * 5, edge);
  }
  px(-21 + hemA, 31, 7, 3, '#b78e79');
  px(15 + hemB, 31, 7, 3, '#b78e79');
  ctx.save();
  ctx.translate(-19, -7);
  ctx.rotate(backArm);
  px(-6, -5, 12, 17, '#201722');
  px(-4, -4, 9, 13, light);
  px(-3, 10, 7, 5, '#b7987d');
  ctx.restore();
  ctx.save();
  ctx.rotate(turn);
  px(-13, -16, 26, 23, '#211824');
  px(-11, -14, 22, 18, robe);
  px(-10, -13, 3, 12, '#b78e79');
  px(8, -13, 2, 12, '#79576d');
  px(-2, -2, 4, 10, '#b79b7e');
  px(-11, 8, 22, 3, '#a88571');
  px(-3, 7, 6, 5, '#e1c7a0');
  ctx.save();
  ctx.translate(headX, headY);
  ctx.fillStyle = c;
  ctx.beginPath();
  ctx.moveTo(-15, -13);
  ctx.lineTo(0, -28);
  ctx.lineTo(15, -13);
  ctx.lineTo(9, 5);
  ctx.lineTo(-9, 5);
  ctx.closePath();
  ctx.fill();
  px(-10, -10, 6, 4, '#15131a');
  px(4, -10, 6, 4, '#15131a');
  px(-8, -10, 3, 1, '#f6dab5');
  px(5, -10, 3, 1, '#e5c7a3');
  px(-2, -20, 4, 7, '#695264');
  px(-6, -25, 12, 2, '#dabfa3');
  for (let i = -2; i <= 2; i++) {
    px(i * 7 - 2, -42 - Math.abs(i) * 3, 4, 12, '#dab57a');
    px(i * 7 - 1, -41 - Math.abs(i) * 3, 1, 5, '#f1d89c');
  }
  px(-16, -33, 32, 3, '#b89667');
  px(-12, -31, 24, 2, '#59413d');
  ctx.restore();
  ctx.restore();
  ctx.save();
  ctx.translate(19, -6);
  ctx.rotate(arm);
  px(-6, -6, 12, 19, '#211623');
  px(-4, -5, 9, 16, light);
  px(-3, 12, 7, 5, '#b7987d');
  px(-4, 9, 9, 3, '#dabfa3');
  if (blade) {
    ctx.save();
    ctx.translate(0, 16);
    ctx.rotate(-Math.PI / 2);
    px(-2, 0, 4, 8, '#634d47');
    px(-7, 6, 14, 3, '#bd9d80');
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(-3, 9);
    ctx.lineTo(-3, 38);
    ctx.lineTo(0, 47);
    ctx.lineTo(4, 38);
    ctx.lineTo(4, 9);
    ctx.closePath();
    ctx.fill();
    px(0, 11, 2, 28, '#ffe8ed');
    px(-2, 9, 2, 16, '#b07585');
    ctx.restore();
  } else {
    ctx.translate(0, 26);
    ctx.strokeStyle = c;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 17, 0, TAU);
    ctx.stroke();
    px(-10, -8, 20, 3, '#d3b28a');
    px(-12, -5, 3, 13, '#b39aba');
    px(10, -5, 3, 13, '#7a628f');
    px(-13, 8, 26, 3, '#d3b28a');
    px(frame === 4 ? 4 : frame === 5 ? -4 : -1, -3, 3, 15, '#b89563');
    px(-2, 10, 5, 4, '#f5d898');
  }
  ctx.restore();
  ctx.restore();
}

const regentRefinedDrawBossBody = drawLateBossBody;
drawLateBossBody = function (ctx, b) {
  if (b.bossKey !== 'regents') return regentRefinedDrawBossBody(ctx, b);
  const surface = REGENT_REFINED_SURFACE,
    art = surface.getContext('2d');
  art.setTransform(1, 0, 0, 1, 0, 0);
  art.clearRect(0, 0, 144, 144);
  art.save();
  art.translate(72, 72);
  art.scale(0.7, 0.7);
  drawRegentRefinedBody(art, b, regentBodyFrame(b));
  art.restore();
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(surface, b.x - 144 / 1.4, b.y - 144 / 1.4, 144 / 0.7, 144 / 0.7);
  ctx.restore();
};
