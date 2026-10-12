const SCRIBE_PIXEL_BODY = document.createElement('canvas');
SCRIBE_PIXEL_BODY.width = SCRIBE_PIXEL_BODY.height = 144;
const SCRIBE_PAPER_FRAMES = [
  { shoulder: 0, edge: -2, tail: 1, quill: -0.12, leaves: [0, 2, 3, 1, -1, -2] },
  { shoulder: 1, edge: 0, tail: -1, quill: -0.08, leaves: [-1, 1, 3, 3, 1, -1] },
  { shoulder: 2, edge: 2, tail: -2, quill: -0.03, leaves: [-2, -1, 1, 3, 3, 1] },
  { shoulder: 0, edge: 3, tail: 0, quill: -0.05, leaves: [-1, -2, -1, 1, 3, 3] },
  { shoulder: -1, edge: 1, tail: 2, quill: -0.1, leaves: [1, -1, -2, -1, 1, 3] },
  { shoulder: -2, edge: -1, tail: 2, quill: -0.14, leaves: [3, 1, -1, -2, -1, 1] },
];
if (!MID_SEQUENCES.scribe[1].includes('foldedPage'))
  MID_SEQUENCES.scribe[1].splice(2, 0, 'foldedPage');

const scribeStartMove = startScribeMove;
startScribeMove = function (b, kind) {
  delete b.bs.mid.scribeStroke;
  if (kind !== 'foldedPage') return scribeStartMove(b, kind);
  const target = midArenaPoint(G.player.x, G.player.y, 70),
    angle = Math.atan2(target.y - b.y, target.x - b.x);
  return beginMidMove(
    b,
    kind,
    0.72,
    3.05,
    [-0.58, 0.58, Math.PI / 2].map((turn, slot) => ({
      at: 0.06 + slot * 0.88,
      type: 'scribeFold',
      slot,
      x: target.x,
      y: target.y,
      turn: angle + turn,
    })),
    target
  );
};

function scribeFoldedPaths(b, event) {
  const arena = arenaBounds(),
    angle = event.turn || 0,
    ux = Math.cos(angle),
    uy = Math.sin(angle),
    vx = -uy,
    vy = ux,
    span = Math.hypot(arena.right - arena.left, arena.bottom - arena.top) * 0.56,
    gap = [0, 78, -78][event.slot || 0],
    center = { x: event.x ?? b.bs.mid.targetX, y: event.y ?? b.bs.mid.targetY },
    point = (distance, bend = 0) => ({
      x: center.x + ux * distance + vx * bend,
      y: center.y + uy * distance + vy * bend,
    });
  return [
    [point(-span, -20), point(gap - 104, -22), point(gap - 48)],
    [point(gap + 48), point(gap + 104, 22), point(span, 20)],
  ];
}

const scribeMidEvent = fireMidEvent;
fireMidEvent = function (b, event) {
  if (b.bossKey !== 'scribe') return scribeMidEvent(b, event);
  b.bs.mid.scribeStroke = {
    started: b.bs.mid.age,
    slot: event.slot || 0,
    kind: event.type,
  };
  if (event.type !== 'scribeFold') return scribeMidEvent(b, event);
  for (const points of scribeFoldedPaths(b, event))
    midHazard(b, 'inkTrail', {
      x: points[0].x,
      y: points[0].y,
      points,
      width: 10,
      delay: 0.52,
      life: 0.48,
      damageMul: 0.74,
      sound: 'midInk',
    });
  if (event.slot === 2) b.bs.exposed = Math.max(b.bs.exposed || 0, 1.75);
};

function scribeBodyPose(b) {
  const s = b.bs || {},
    m = s.mid || {},
    clock = save.motion ? 0 : m.clock || G.tAll,
    frame = SCRIBE_PAPER_FRAMES[Math.floor(clock * 3.5) % SCRIBE_PAPER_FRAMES.length],
    wind = s.mode === 'windup' ? clamp(1 - s.t / Math.max(0.01, s.duration), 0, 1) : 0,
    pose = {
      shoulder: frame.shoulder,
      edge: frame.edge,
      tail: frame.tail,
      leaves: frame.leaves.slice(),
      fold: 0,
      quill: frame.quill,
      quillX: 0,
      quillY: 0,
      eye: 0,
      spread: 0,
    };
  if (s.mode === 'windup') {
    const frameIndex = Math.min(5, Math.floor(wind * 6));
    pose.fold = [0, 2, 5, 9, 14, 18][frameIndex];
    pose.quill = [-0.12, -0.27, -0.42, -0.57, -0.75, -0.92][frameIndex];
    pose.quillY = -frameIndex * 2;
    pose.eye = frameIndex > 3 ? -1 : 0;
  } else if (s.mode === 'slam') {
    const stroke = m.scribeStroke,
      age = stroke ? Math.max(0, (m.age || 0) - stroke.started) : 1,
      release = Math.min(5, Math.floor(age / 0.12)),
      strokeDirection = stroke?.slot % 2 ? -1 : 1;
    pose.fold = [14, 5, 0, 3, 6, 2][release];
    pose.quill = [-0.92, -0.36, 0.42, 0.66, 0.27, -0.12][release] * strokeDirection;
    pose.quillX = [0, 4, 8, 10, 4, 0][release] * strokeDirection;
    pose.quillY = [-8, -2, 5, 8, 2, 0][release];
    pose.spread = [0, 4, 9, 6, 2, 0][release];
  } else if (s.mode === 'cool' || (s.exposed || 0) > 0) {
    pose.spread = 7;
    pose.quill = 0.35;
    pose.quillY = 8;
    pose.eye = 1;
  }
  if (s.mode === 'shift') {
    const u = clamp(1 - s.t / Math.max(0.01, s.duration), 0, 1);
    pose.fold = Math.round(Math.sin(u * Math.PI) * 19);
    pose.quill = -0.35 - pose.fold * 0.035;
    pose.spread = Math.round(u * 8);
  }
  return pose;
}

function scribePaperPolygon(ctx, points, color, outline = '#100e17', width = 2) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  if (outline) {
    ctx.strokeStyle = outline;
    ctx.lineWidth = width;
    ctx.stroke();
  }
}

function scribeBodyParts(ctx, b, pose) {
  const fold = pose.fold,
    left = -40 + fold * 0.48,
    right = 35 - fold * 0.8,
    px = (x, y, width, height, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), width, height);
    };
  for (let i = 0; i < 6; i++) {
    const x = -31 + i * 12,
      y = 17 + pose.leaves[i],
      pull = (2.5 - i) * fold * 0.18,
      spread = (i - 2.5) * pose.spread * 0.16,
      tip = y + 27 - (i % 3) * 5,
      flap = pose.leaves[(i + 2) % 6] + pose.spread * (i % 2 ? 0.6 : -0.35);
    scribePaperPolygon(
      ctx,
      [
        [x - 6 + pull, y - 3],
        [x + 6 + pull, y],
        [x + 5 + spread + flap, tip],
        [x - 5 + spread, tip + 3],
      ],
      i % 2 ? '#d7c49d' : '#8c7c6b'
    );
    px(x - 3 + pull, y + 4, 7, 2, '#51424b');
    px(x - 2 + pull, y + 9, 5, 1, '#655260');
    px(x - 1 + pull, y + 14, 4, 1, '#736174');
    px(x + 3 + spread, tip - 3, 2, 3, '#efe0b8');
  }
  ctx.beginPath();
  ctx.moveTo(left, -34 + pose.shoulder);
  ctx.bezierCurveTo(5, -51 + fold * 0.45, 52 - fold, -6 + pose.edge, right, 38 + pose.tail);
  ctx.bezierCurveTo(
    -8,
    22 + pose.tail,
    -32 + fold * 0.65,
    42 - fold * 0.25,
    left,
    -34 + pose.shoulder
  );
  ctx.closePath();
  ctx.fillStyle = '#26212a';
  ctx.fill();
  ctx.strokeStyle = '#100e17';
  ctx.lineWidth = 4;
  ctx.stroke();
  scribePaperPolygon(
    ctx,
    [
      [left + 6, -30],
      [-2 - fold * 0.12, -39 + pose.shoulder],
      [20 - fold * 0.4, -20],
      [2, -17],
      [-23 + fold * 0.3, -21],
    ],
    '#50414d',
    '#8e7968',
    1.5
  );
  scribePaperPolygon(
    ctx,
    [
      [3 - fold * 0.1, -19],
      [right + 2, -5 + pose.edge],
      [right - 3, 20 + pose.tail],
      [6, 13],
      [-2, -3],
    ],
    '#302733',
    '#78636c',
    1.5
  );
  scribePaperPolygon(
    ctx,
    [
      [left + 9, -12],
      [-5, -7],
      [12, 14],
      [right - 2, 31],
      [8, 23],
      [-15, 13],
    ],
    '#3c303c',
    '#8e7968',
    1.5
  );
  ctx.strokeStyle = b.col || '#d9c49d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(left + 9, -23 + pose.shoulder);
  ctx.bezierCurveTo(8 - fold * 0.35, -4, -2 + fold * 0.2, 14, right - 1, 29 + pose.tail);
  ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const x = left + 14 + i * (10 - fold * 0.08),
      y = -27 + i * 4 + pose.shoulder;
    px(x, y, 7, 2, '#a18a7c');
    px(x + 1, y + 3, 4, 1, '#d0bc98');
    px(x + 4, y + 6, 2, 3, '#15121b');
  }
  if (fold > 4) {
    scribePaperPolygon(
      ctx,
      [
        [right - 12, -25],
        [right + 4, -8],
        [right - 6, 22],
        [right - 15, 9],
      ],
      '#665361',
      '#c6b18f',
      1
    );
    px(right - 11, -11, 2, 18, '#2a212d');
  }
  const eyeX = -14 + fold * 0.15,
    eyeY = -18 + pose.eye;
  scribePaperPolygon(
    ctx,
    [
      [eyeX - 10, eyeY - 7],
      [eyeX + 11, eyeY - 8],
      [eyeX + 10, eyeY + 5],
      [eyeX - 10, eyeY + 6],
    ],
    '#17131c',
    '#806c66',
    1
  );
  px(eyeX - 6, eyeY - 2, 10, 5, '#f1e3bd');
  px(eyeX - 2, eyeY - 1, 3, 3, '#4b3b40');
  px(eyeX - 5, eyeY - 2, 2, 2, '#fff3cf');
  ctx.save();
  ctx.translate(24 + pose.quillX, -14 + pose.quillY);
  ctx.rotate(pose.quill);
  px(-3, -27, 6, 72, '#15121b');
  px(-1, -24, 3, 64, '#957d67');
  px(0, -23, 1, 59, '#e2cea4');
  scribePaperPolygon(
    ctx,
    [
      [0, -40],
      [11, -26],
      [9, -10],
      [1, 10],
      [-6, -7],
      [-5, -28],
    ],
    '#e6d4aa',
    '#766471',
    1.5
  );
  px(0, -31, 1, 37, '#806974');
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = '#a8907c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(1, -24 + i * 7);
    ctx.lineTo(i < 2 ? 8 : 6, -29 + i * 7);
    ctx.stroke();
  }
  scribePaperPolygon(
    ctx,
    [
      [-3, 38],
      [3, 38],
      [0, 49],
    ],
    '#b7a081',
    '#15121b',
    1
  );
  px(-3, 36, 6, 3, '#453544');
  ctx.restore();
}

const scribeDrawBossBody = drawLateBossBody;
drawLateBossBody = function (ctx, b) {
  if (b.bossKey !== 'scribe') return scribeDrawBossBody(ctx, b);
  const surface = SCRIBE_PIXEL_BODY,
    art = surface.getContext('2d');
  art.setTransform(1, 0, 0, 1, 0, 0);
  art.clearRect(0, 0, 144, 144);
  art.save();
  art.translate(72, 72);
  art.scale(0.7, 0.7);
  scribeBodyParts(art, b, scribeBodyPose(b));
  art.restore();
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(surface, b.x - 144 / 1.4, b.y - 144 / 1.4, 144 / 0.7, 144 / 0.7);
  ctx.restore();
};
