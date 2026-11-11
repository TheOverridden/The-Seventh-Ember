'use strict';

const DESCENT_ART = {
  ink: '#171c1c',
  stone: '#39413a',
  stoneLight: '#69705a',
  stoneDark: '#252e2a',
  brass: '#ae8d50',
  brassLight: '#e4c88d',
  brassDark: '#6a5736',
  metal: '#506663',
  metalLight: '#95a795',
  metalDark: '#2c403e',
  wood: '#80613c',
  woodLight: '#b39762',
  woodDark: '#493e2b',
  clay: '#a76b49',
  clayLight: '#d29b6a',
  leaf: '#799354',
  leafLight: '#b0bc79',
  leafDark: '#465d3c',
  cloth: '#d4c8a6',
  clothDark: '#a59c7e',
  water: '#598983',
};

function descentPixel(ctx, x, y, width, height, color) {
  ctx.fillStyle = DESCENT_ART[color] || color;
  ctx.fillRect(
    Math.round(x),
    Math.round(y),
    Math.max(0, Math.round(width)),
    Math.max(0, Math.round(height))
  );
}

function descentPoly(ctx, points, color) {
  const first = Math.floor(Math.min(...points.map((p) => p[1]))),
    last = Math.ceil(Math.max(...points.map((p) => p[1])));
  for (let y = first; y < last; y++) {
    const hits = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i],
        b = points[(i + 1) % points.length];
      if ((a[1] <= y + 0.5 && b[1] > y + 0.5) || (b[1] <= y + 0.5 && a[1] > y + 0.5))
        hits.push(a[0] + ((y + 0.5 - a[1]) * (b[0] - a[0])) / (b[1] - a[1]));
    }
    hits.sort((a, b) => a - b);
    for (let i = 0; i < hits.length; i += 2) {
      const x = Math.ceil(hits[i] - 0.5);
      descentPixel(ctx, x, y, Math.ceil(hits[i + 1] - 0.5) - x, 1, color);
    }
  }
}

function descentLine(ctx, x1, y1, x2, y2, width, color) {
  const count = Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1));
  for (let i = 0; i <= count; i++)
    descentPixel(
      ctx,
      x1 + ((x2 - x1) * i) / count - width / 2,
      y1 + ((y2 - y1) * i) / count - width / 2,
      width,
      width,
      color
    );
}

function descentShadow(ctx, x, y, width = 56) {
  descentPixel(ctx, x - width / 2, y - 2, width, 6, '#0b110e70');
  descentPixel(ctx, x - width / 2 + 5, y + 4, width - 10, 3, '#0b110e35');
}

function descentLamp(ctx, x, y, t, lit = true, scale = 1) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(scale, scale);
  const p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c);
  p(-7, -26, 14, 3, 'ink');
  p(-5, -29, 10, 3, 'brassDark');
  p(-3, -33, 6, 5, 'brass');
  p(-2, -33, 3, 2, 'brassLight');
  p(-7, -23, 2, 19, 'metalDark');
  p(5, -23, 2, 19, 'metalDark');
  p(-5, -22, 10, 16, lit ? '#a88e51' : '#35483e');
  if (lit) {
    const shift = Math.floor(Math.sin(t * 6) * 1.4);
    p(-3, -18 + shift, 6, 11, '#e8b76c');
    p(-1, -20 + shift, 3, 12, '#fff0b4');
    p(-4, -10, 8, 3, '#df9c4c');
  }
  p(-8, -5, 16, 4, 'brassDark');
  p(-7, -5, 14, 1, 'brassLight');
  p(-5, -1, 10, 3, 'metalDark');
  ctx.restore();
}

function descentPlant(ctx, x, y, t, growth = 1) {
  const p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c),
    sway = Math.round(Math.sin(t * 1.7 + x * 0.1));
  p(x - 6, y - 9, 12, 8, 'ink');
  p(x - 5, y - 8, 10, 7, 'clay');
  p(x - 4, y - 7, 2, 5, 'clayLight');
  p(x - 7, y - 11, 14, 4, 'clayLight');
  p(x - 5, y - 11, 10, 2, 'woodDark');
  const h = Math.round(11 + growth * 12);
  descentLine(ctx, x, y - 11, x + sway, y - h, 2, 'leaf');
  for (let k = 0; k < (growth > 0.5 ? 3 : 2); k++) {
    const ly = y - 15 - k * 5,
      side = k % 2 ? 1 : -1;
    descentPoly(
      ctx,
      [
        [x + sway, ly + 2],
        [x + sway + side * 7, ly - 4],
        [x + sway + side * 8, ly],
        [x + sway + side * 3, ly + 3],
      ],
      k % 2 ? 'leafLight' : 'leaf'
    );
    p(x + sway + side * 3, ly, 2, 1, 'leafLight');
  }
}

function descentCrate(ctx, x, y, width = 34, height = 22, open = false) {
  const p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c);
  p(x - width / 2 - 1, y - height - 1, width + 2, height + 2, 'ink');
  p(x - width / 2, y - height, width, height, 'woodDark');
  p(x - width / 2 + 2, y - height + 2, width - 4, height - 4, 'wood');
  for (let i = 0; i < 3; i++)
    p(x - width / 2 + 3 + i * (width / 3), y - height + 3, 1, height - 5, 'woodDark');
  p(x - width / 2, y - height, width, 3, 'woodLight');
  p(x - width / 2, y - 4, width, 3, 'woodLight');
  p(x - width / 2 + 4, y - height, 3, height, 'metalDark');
  p(x + width / 2 - 7, y - height, 3, height, 'metalDark');
  if (open) {
    p(x - width / 2 + 2, y - height + 3, width - 4, 5, 'ink');
    p(x - width / 2 + 3, y - height - 8, width - 6, 6, 'wood');
  } else {
    p(x - 3, y - height + 2, 6, 8, 'brassDark');
    p(x - 2, y - height + 3, 4, 2, 'brassLight');
  }
}

function descentWorkBench(ctx, x, y) {
  const p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c);
  p(x - 39, y - 4, 78, 6, 'ink');
  p(x - 37, y - 6, 74, 5, 'wood');
  p(x - 36, y - 6, 71, 2, 'woodLight');
  p(x - 33, y + 2, 5, 21, 'woodDark');
  p(x + 28, y + 2, 5, 21, 'woodDark');
  p(x - 32, y + 3, 2, 17, 'wood');
  p(x + 29, y + 3, 2, 17, 'wood');
  p(x - 31, y + 12, 62, 3, 'woodDark');
}

function drawDescentProp(ctx, event, time = 0) {
  if (!event || !Number.isFinite(event.x) || !Number.isFinite(event.y)) return;
  ctx.save();
  ctx.translate(Math.round(event.x), Math.round(event.y));
  ctx.imageSmoothingEnabled = false;
  const p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c),
    complete = ['complete', 'helped'].includes(event.phase),
    working = event.progress > 0 && event.progress < 1,
    t = typeof save !== 'undefined' && save.motion ? 0 : time,
    key = String(event.prop || event.chapterId || '').toLowerCase(),
    id = String(event.chapterId || '').toLowerCase();
  descentShadow(ctx, 6, 23, 90);
  if (event.optional) {
    if (/lamp|bracket|light/.test(key)) {
      descentWorkBench(ctx, 5, 0);
      descentLamp(ctx, -8, -7, t, complete);
      descentCrate(ctx, 23, -7, 17, 13, complete);
      p(-30, -10, 12, 3, 'metal');
      p(-29, -12, 2, 8, 'metalLight');
      p(-20, -12, 2, 8, 'metalLight');
    } else if (
      /seed|plant|tray|tin/.test(key) ||
      id === 'garden' ||
      id === 'observatory' ||
      id === 'archive'
    ) {
      descentWorkBench(ctx, 4, 5);
      descentPlant(ctx, -22, 0, t, complete ? 1 : 0.3);
      descentPlant(ctx, 4, 0, t + 1.3, 0.4);
      descentCrate(ctx, 28, 1, 18, 15, complete);
      p(-27, 19, 18, 8, 'clay');
      p(-26, 19, 16, 2, 'clayLight');
    } else {
      descentCrate(ctx, 0, 18, 48, 30, complete || event.phase === 'taken');
      descentLamp(ctx, 27, 18, t, complete, 0.65);
      p(-14, -17, 20, 4, 'metalDark');
      p(-12, -18, 16, 2, 'metalLight');
    }
  } else if (/pump/.test(key) || id === 'reservoir') {
    p(-34, 9, 75, 13, 'ink');
    p(-32, 10, 70, 9, 'stone');
    p(-29, 10, 62, 2, 'stoneLight');
    p(-2, -40, 18, 51, 'ink');
    p(0, -38, 14, 47, 'metal');
    p(1, -36, 3, 42, 'metalLight');
    p(11, -35, 2, 43, 'metalDark');
    p(-7, -46, 28, 10, 'metalDark');
    p(-5, -45, 23, 3, 'metalLight');
    p(2, -51, 12, 5, 'brassDark');
    p(4, -52, 8, 2, 'brassLight');
    p(14, -30, 24, 11, 'ink');
    p(14, -28, 22, 7, 'metal');
    p(18, -28, 17, 2, 'metalLight');
    p(30, -22, 8, 13, 'metalDark');
    p(29, -9, 12, 3, 'metalLight');
    p(-29, -19, 23, 24, 'ink');
    p(-28, -16, 21, 18, 'brassDark');
    p(-25, -19, 15, 24, 'brassDark');
    p(-26, -16, 17, 2, 'brassLight');
    const a = complete ? t * 2 : working ? event.progress * 2 : 0.25,
      cx = -18,
      cy = -7;
    for (let i = 0; i < 4; i++) {
      const angle = a + (i * Math.PI) / 2;
      descentLine(ctx, cx, cy, cx + Math.cos(angle) * 10, cy + Math.sin(angle) * 10, 3, 'brass');
    }
    p(-21, -10, 6, 6, 'metalDark');
    p(-20, -10, 3, 2, 'brassLight');
    if (complete) {
      p(33, -6, 5, 20, 'water');
      p(34, -4, 2, 16, '#a0c0aa');
      for (let i = 0; i < 3; i++) p(29 + i * 5, 13 + ((Math.floor(t * 8) + i) % 4), 5, 1, 'water');
    } else {
      p(34, -3 + (Math.floor(t * 2) % 9), 2, 3, 'water');
    }
  } else if (/nursery|irrigation|bed|seed|garden/.test(key) || id === 'garden') {
    p(-36, 7, 76, 16, 'woodDark');
    p(-36, 5, 76, 4, 'woodLight');
    p(-34, 9, 72, 10, complete ? '#554b30' : '#3e6153');
    for (let i = 0; i < 4; i++) {
      p(-33 + i * 18, 18, 15, 2, 'wood');
      if (i) descentPlant(ctx, -32 + i * 19, 6, t + i, complete ? 0.8 : 0.25);
    }
    p(-42, -25, 9, 45, 'metalDark');
    p(-40, -24, 3, 43, 'metalLight');
    p(-41, -26, 19, 5, 'metal');
    p(-33, -23, 8, 9, 'brassDark');
    p(-31, -22, 3, 6, 'brassLight');
    if (!complete) {
      p(-28, -14, 3, 20, 'water');
      p(-32, 10, 61, 1, '#8bb2a0');
      p(-18, 13, 28, 1, '#739d8c');
    }
    for (let i = 0; i < 7; i++) {
      const x = -26 + i * 9;
      ctx.save();
      ctx.translate(x, -17);
      ctx.scale(0.32, 0.32);
      descentFrame(ctx, 0, 0, false, t, i, true);
      ctx.restore();
      if (i < 6) {
        p(x - 2, -15, 4, 2, '#936e4e');
        p(x - 1, -15, 2, 1, '#c19e69');
      }
    }
    p(29, -31, 12, 4, 'brassDark');
    p(31, -30, 8, 2, 'brass');
  } else if (/pipe|cool|valve|foundry/.test(key) || id === 'foundry') {
    p(-36, -31, 73, 12, 'ink');
    p(-35, -29, 71, 8, 'metal');
    p(-35, -29, 71, 2, 'metalLight');
    p(-35, -23, 71, 2, 'metalDark');
    p(-23, -34, 5, 18, 'brassDark');
    p(-22, -32, 2, 14, 'brassLight');
    p(22, -34, 5, 18, 'brassDark');
    p(23, -32, 2, 14, 'brassLight');
    if (!complete) {
      p(-6, -32, 12, 13, 'ink');
      p(-4, -30, 3, 10, 'metalDark');
      p(3, -29, 3, 9, 'brassDark');
    } else {
      p(-7, -32, 16, 13, 'metalDark');
      p(-6, -31, 14, 3, 'metalLight');
      p(-5, -27, 12, 7, 'metal');
      p(-3, -27, 2, 6, 'metalLight');
    }
    p(-29, -18, 4, 39, 'stoneDark');
    p(28, -18, 4, 39, 'stoneDark');
    p(-33, 16, 12, 6, 'stone');
    p(24, 16, 12, 6, 'stone');
    descentCrate(ctx, -8, 21, 36, 20, false);
    p(-12, -1, 19, 5, 'metalDark');
    p(-11, -1, 18, 2, 'metalLight');
    if (!complete)
      for (let i = 0; i < 3; i++) {
        const u = (t * 0.3 + i / 3) % 1;
        p(-3 + i * 2, -33 - u * 16, 2, 3, '#bcbca677');
      }
  } else if (/lens|sky|observation/.test(key) || id === 'observatory') {
    p(-35, -59, 72, 72, 'ink');
    p(-33, -57, 68, 67, 'stone');
    p(-30, -53, 62, 59, 'brassDark');
    p(-27, -50, 56, 53, complete ? '#567b77' : '#202f33');
    if (complete) {
      p(-25, -48, 52, 49, '#93b4a1');
      p(-25, -48, 52, 22, '#779e9b');
      p(-19 + Math.round(Math.sin(t * 0.1) * 4), -41, 27, 4, '#d5dac0');
      p(-13, -45, 17, 4, '#d5dac0');
      p(5, -31, 14, 2, '#c9d3b9');
      p(-25, -3, 52, 5, 'leafDark');
      for (let i = 0; i < 5; i++) p(-22 + i * 10, -5 - (i % 3) * 3, 5, 7, 'leaf');
    } else for (let i = 0; i < 4; i++) p(-26, -49 + i * 13, 55, 11, 'metalDark');
    p(-29, -53, 62, 3, 'brassLight');
    p(-30, 4, 64, 5, 'brass');
    p(-2, -51, 3, 55, 'brassDark');
    p(-27, -25, 55, 3, 'brassDark');
    p(-21, 13, 43, 6, 'stoneDark');
    p(-17, 17, 35, 5, 'stone');
    p(17, -2, 18, 6, 'metal');
    p(30, 1, 4, 17, 'brassDark');
    p(31, 1, 2, 14, 'brassLight');
  } else if (/ledger|record|roster|archive/.test(key) || id === 'archive') {
    p(-37, -49, 73, 52, 'woodDark');
    p(-34, -47, 67, 3, 'woodLight');
    for (let row = 0; row < 3; row++) {
      p(-34, -32 + row * 15, 67, 3, 'woodLight');
      for (let i = 0; i < 7; i++) {
        const x = -32 + i * 9;
        p(x, -44 + row * 15, 6, 11, i % 3 === 0 ? 'metalDark' : i % 2 ? 'clothDark' : 'wood');
        p(x + 1, -41 + row * 15, 4, 2, 'brass');
      }
    }
    descentWorkBench(ctx, 0, 4);
    p(-23, -12, 43, 14, 'ink');
    p(-22, -13, 20, 13, 'cloth');
    p(-1, -13, 20, 13, '#b7ad8b');
    p(-2, -13, 2, 14, 'woodDark');
    for (let row = 0; row < 3; row++) {
      p(-18, -10 + row * 4, 12, 1, 'wood');
      p(3, -10 + row * 4, complete ? 12 : 7, 1, 'wood');
    }
    if (complete) {
      p(24, -15, 12, 14, 'cloth');
      p(25, -12, 8, 1, 'metal');
      p(25, -8, 7, 1, 'metal');
      p(25, -4, 4, 1, 'metal');
    }
    descentLamp(ctx, -29, -3, t, true, 0.55);
  } else if (/lock|court|paired/.test(key) || id === 'court') {
    for (const side of [-1, 1]) {
      const x = side * 25;
      p(x - 14, -45, 28, 63, 'ink');
      p(x - 12, -43, 24, 58, 'stone');
      p(x - 10, -41, 20, 3, 'brass');
      p(x - 8, -36, 16, 35, 'metalDark');
      p(x - 3, -30, 6, 24, complete ? 'brassLight' : 'brassDark');
      const lever = complete ? 10 : -10;
      descentLine(ctx, x, -10, x + side * 9, -10 + lever, 4, 'ink');
      descentLine(ctx, x, -10, x + side * 9, -10 + lever, 2, 'brass');
      p(x - 4, 5, 8, 4, complete ? '#c5d48b' : '#8d5848');
      p(x - 16, 15, 32, 7, 'stoneDark');
    }
    p(-11, 4, 22, 3, 'brassDark');
    p(-9, 4, 18, 1, 'brassLight');
  } else if (/bell|signal|choir/.test(key) || id === 'choir') {
    p(-32, -52, 65, 6, 'woodDark');
    p(-31, -52, 63, 2, 'woodLight');
    p(-29, -47, 5, 67, 'woodDark');
    p(25, -47, 5, 67, 'woodDark');
    for (let i = 0; i < 3; i++) {
      const x = -18 + i * 19,
        y = -36 + i * 3;
      p(x - 1, -46, 2, 12, 'brassDark');
      p(x - 5, y, 10, 5, 'brassDark');
      descentPoly(
        ctx,
        [
          [x - 5, y + 2],
          [x + 5, y + 2],
          [x + 7, y + 13],
          [x + 10, y + 17],
          [x - 10, y + 17],
          [x - 7, y + 13],
        ],
        'brass'
      );
      p(x - 4, y + 4, 2, 9, 'brassLight');
      p(x - 10, y + 16, 20, 3, 'brassDark');
      p(x - 1, y + 18, 3, 4, 'brassDark');
      if (!complete) p(x + 7, y + 7 + Math.floor(Math.sin(t * 2 + i)), 2, 5, 'metalLight');
    }
    p(-11, 3, 24, 17, 'metalDark');
    p(-9, 4, 20, 3, 'metalLight');
    p(-7, 10, 5, 5, complete ? '#a6ba79' : '#9b6349');
    p(4, 10, 5, 5, '#ddc37d');
    descentLine(ctx, 1, -10, 1, 3, 3, complete ? 'metalDark' : 'brass');
    descentLamp(ctx, 38, 19, t, true, 0.6);
  } else if (/frame|heart|return/.test(key) || id === 'heart') {
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.translate(-37 + i * 14, 16);
      ctx.scale(0.55, 0.85);
      descentFrame(ctx, 0, 0, false, t, i);
      ctx.restore();
    }
    p(-45, 20, 89, 5, 'stoneDark');
    p(-43, 20, 85, 1, 'brass');
    p(38, -38, 11, 15, 'metalDark');
    p(40, -36, 7, 10, complete ? 'brassDark' : 'metal');
    if (complete) {
      p(42, -34, 3, 6, 'ink');
      p(37, -42, 12, 3, 'metal');
      p(38, -42, 10, 1, 'metalLight');
    } else {
      p(41, -35, 4, 1, 'metalLight');
      p(44, -28, 1, 2, 'brass');
    }
  } else {
    const gate = /shutter|citadel|gate/.test(key) || id === 'citadel';
    p(-33, -55, 66, 77, 'ink');
    p(-31, -53, 62, 73, 'stoneDark');
    p(-29, -51, 58, 4, 'stoneLight');
    p(-29, -47, 7, 65, 'stone');
    p(22, -47, 7, 65, 'stone');
    p(-22, -46, 44, 62, complete ? '#151e1c' : 'metalDark');
    const raise = complete ? 39 : working ? event.progress * 39 : 0;
    for (let i = 0; i < 5; i++) p(-20 + i * 9, -44, 3, Math.max(5, 60 - raise), 'metal');
    p(-22, -28 - raise * 0.25, 44, 4, 'brassDark');
    p(-20, -28 - raise * 0.25, 40, 1, 'brassLight');
    p(-37, 15, 74, 8, 'stoneDark');
    p(-35, 15, 70, 2, 'stoneLight');
    if (!gate || complete) {
      p(-18, 8, 36, 3, complete ? 'brassLight' : 'brassDark');
      p(-15, 12, 30, 2, 'brassDark');
    }
    if (!complete) {
      descentLine(ctx, -22, -8, 22, 1, 6, 'woodDark');
      descentLine(ctx, -22, -9, 22, 0, 2, 'woodLight');
    } else {
      p(29, 5, 16, 4, 'woodDark');
      p(29, 5, 16, 1, 'woodLight');
    }
    descentLamp(ctx, -40, -8, t, complete || id !== 'gate', 0.65);
    if (id === 'citadel') {
      p(29, -49, 15, 40, 'ink');
      p(31, -47, 11, 36, 'metalDark');
      p(33, -45, 3, 28, 'metal');
      for (let i = 0; i < 6; i++) p(34, -42 + i * 5, 6, 2, 'brassDark');
      p(28, -12, 17, 8, 'metalDark');
      p(29, -12, 15, 2, 'brass');
      const a = complete ? t * 0.8 : working ? event.progress * 3 : 0;
      for (let i = 0; i < 4; i++) {
        const b = a + (i * Math.PI) / 2;
        descentLine(ctx, 36, -8, 36 + Math.cos(b) * 7, -8 + Math.sin(b) * 7, 2, 'brassLight');
      }
      p(34, -10, 4, 4, 'brassDark');
      p(-30, -56, 59, 3, 'brassDark');
      p(-27, -56, 53, 1, 'brassLight');
    }
  }
  if (working) {
    p(-23, 28, 46, 3, 'ink');
    p(-22, 29, 44 * Math.max(0, Math.min(1, event.progress)), 1, 'brassLight');
  }
  ctx.restore();
}

function descentFrame(ctx, x, y, opened, t, index = 0, empty = false) {
  const p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c);
  p(x - 12, y - 53, 24, 54, 'ink');
  p(x - 10, y - 51, 20, 49, 'metalDark');
  p(x - 8, y - 48, 16, 43, '#25342f');
  p(x - 10, y - 51, 20, 2, 'brass');
  p(x - 10, y - 49, 2, 46, 'metal');
  p(x + 8, y - 49, 2, 46, 'metal');
  p(x - 13, y - 2, 26, 5, 'stoneDark');
  p(x - 11, y - 2, 22, 1, 'brassLight');
  const shift = opened ? 11 : 0;
  p(x - 7 - shift, y - 45, 5, 37, 'metal');
  p(x + 2 + shift, y - 45, 5, 37, 'metal');
  p(x - 6 - shift, y - 43, 1, 32, 'metalLight');
  p(x + 3 + shift, y - 43, 1, 32, 'metalLight');
  p(x - 3, y - 12, 6, 4, opened ? 'brassLight' : 'brassDark');
  if (!empty)
    descentSmallFlame(
      ctx,
      x,
      y - 22 - (opened ? Math.sin(t * 2 + index) * 2 : 0),
      t + index,
      opened ? 1 : 0.55
    );
}

function descentWick(ctx, x, y, t, scale = 1) {
  drawWickCharacter(ctx, x, y - 7, 30 * scale, t);
}

function descentSmallFlame(ctx, x, y, t, scale = 1) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(scale, scale);
  const p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c),
    flick = Math.round(Math.sin(t * 6));
  p(-5, -6, 10, 10, '#73452c');
  p(-4, -8, 8, 11, '#c8853f');
  p(-3, -11 + flick, 5, 13, '#f0bb64');
  p(-1, -13 + flick, 3, 13, '#f9d995');
  p(-1, -6, 3, 7, '#fff1be');
  p(-2, 3, 5, 2, '#b5793c');
  ctx.restore();
}

function drawDescentResident(ctx, event, time = 0, mode = 'idle') {
  if (!event || !Number.isFinite(event.x) || !Number.isFinite(event.y)) return;
  const t = typeof save !== 'undefined' && save.motion ? 0 : time,
    active = event.progress > 0 && event.progress < 1,
    pose = active ? 'work' : mode,
    x = event.x - 82,
    y = event.y + 43;
  if (event.npc === 'oren' || event.npc === 'nell') {
    if (typeof ResidentArt === 'undefined') return;
    descentShadow(ctx, x, y, 23);
    ctx.save();
    ctx.translate(Math.round(x - 24), Math.round(y - 54));
    ResidentArt.paint(
      ctx,
      event.npc,
      pose,
      Math.floor(t * (pose === 'walk' ? 10 : pose === 'work' ? 8 : pose === 'talk' ? 6 : 4)) % 16,
      1
    );
    ctx.restore();
  } else {
    drawWickCharacter(ctx, x, y - 27, 30, t, {
      moving: mode === 'walk',
      speaking: mode === 'talk',
      lookX: 1,
      lookY: 0,
    });
    descentPixel(ctx, x - 8, y - 12, 16, 2, '#7e613135');
  }
}

function drawDescentPortrait(ctx, speaker, time = 0) {
  const name = String(speaker || '').toLowerCase(),
    id = name === 'oren' ? 'oren' : name === 'nell' ? 'nell' : null,
    t = typeof save !== 'undefined' && save.motion ? 0 : time;
  if (!id && !['wick', 'you', 'ember', 'mara'].includes(name)) return false;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.scale(ctx.canvas.width / 120, ctx.canvas.height / 120);
  descentPixel(ctx, 0, 0, 120, 120, '#202b24');
  descentPixel(ctx, 6, 6, 108, 108, '#2a352b');
  for (let y = 10; y < 110; y += 10) descentPixel(ctx, 10, y, 100, 1, '#71806417');
  descentPixel(ctx, 6, 6, 108, 1, '#a38d5866');
  descentPixel(ctx, 6, 113, 108, 1, '#a38d5866');
  if (id && typeof ResidentArt !== 'undefined') {
    ctx.save();
    ctx.beginPath();
    ctx.rect(7, 7, 106, 106);
    ctx.clip();
    ctx.translate(-14, -13);
    ctx.scale(3.2, 3.2);
    ResidentArt.paint(ctx, id, 'talk', Math.floor(t * 6) % 16, 1);
    ctx.restore();
  } else if (name === 'mara') {
    ctx.save();
    ctx.beginPath();
    ctx.rect(7, 7, 106, 106);
    ctx.clip();
    descentArtSprite(ctx, 'gateWarden', 60, 159, 153, t);
    ctx.restore();
  } else if (name === 'wick') {
    drawWickCharacter(ctx, 60, 62, 88, t);
  } else descentArtEmber(ctx, 60, 75, t, 1.45);
  ctx.restore();
  return true;
}

function descentArtSprite(ctx, key, x, y, height, t, alpha = 1) {
  const sprite = typeof SPR !== 'undefined' ? SPR[key] : null;
  if (!sprite?.frames?.length) return false;
  const frame = sprite.frames[Math.floor(t * (sprite.fps || 4)) % sprite.frames.length],
    scale = height / sprite.H;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    frame,
    Math.round(x - (sprite.W * scale) / 2),
    Math.round(y - height),
    Math.round(sprite.W * scale),
    Math.round(height)
  );
  ctx.restore();
  return true;
}

function descentArtEmber(ctx, x, y, t, scale = 1) {
  if (typeof drawHearthEmber === 'function') {
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y - 12));
    ctx.scale(scale * 1.25, scale * 1.25);
    drawHearthEmber(ctx, 0, 0, t);
    ctx.restore();
    return;
  }
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(scale, scale);
  descentShadow(ctx, 0, 4, 20);
  const orbit = t * 1.78;
  for (let i = 0; i < 3; i++) {
    const a = orbit + (i * Math.PI * 2) / 3,
      sx = Math.cos(a) * 17,
      sy = -15 + Math.sin(a) * 7;
    if (!descentArtSprite(ctx, 'pShard', sx, sy + 3, 10, t))
      descentSmallFlame(ctx, sx, sy, t + i, 0.4);
  }
  if (!descentArtSprite(ctx, 'pIdle', 0, 0, 31, t)) descentSmallFlame(ctx, 0, -13, t, 1.25);
  ctx.restore();
}

function drawHearthResidents(ctx, time = 0) {
  const data = typeof descentData === 'function' ? descentData() : null;
  if (!data) return;
  const chapters = data.chapters || {},
    t = typeof save !== 'undefined' && save.motion ? 0 : time;
  if (chapters.garden?.main || chapters.garden?.help) {
    if (chapters.garden.help) {
      descentPlant(ctx, 171, 310, t, 0.9);
      descentPlant(ctx, 197, 311, t + 1.7, chapters.reservoir?.main ? 1.1 : 0.4);
      descentCrate(ctx, 184, 334, 31, 16, true);
    }
    if (chapters.observatory?.help || chapters.archive?.help)
      descentPlant(ctx, 146, 280, t + 3, 0.6);
    if (typeof ResidentArt !== 'undefined') {
      descentShadow(ctx, 157, 327, 23);
      ctx.save();
      ctx.translate(133, 273);
      ResidentArt.paint(
        ctx,
        'nell',
        chapters.garden.help ? 'work' : 'idle',
        Math.floor(t * (chapters.garden.help ? 8 : 4)) % 16,
        1
      );
      ctx.restore();
    }
  }
  if (chapters.reservoir?.main || chapters.reservoir?.help) {
    descentWorkBench(ctx, 455, 298);
    if (chapters.reservoir.help) descentCrate(ctx, 465, 319, 29, 16, true);
    if (chapters.foundry?.help) descentLamp(ctx, 475, 290, t, true, 0.7);
    descentPixel(ctx, 445, 291, 18, 2, 'metalLight');
    descentPixel(ctx, 459, 287, 3, 8, 'brass');
    if (typeof ResidentArt !== 'undefined') {
      descentShadow(ctx, 410, 322, 24);
      ctx.save();
      ctx.translate(386, 268);
      ResidentArt.paint(ctx, 'oren', 'work', Math.floor(t * 8) % 16, 1);
      ctx.restore();
    }
  }
  if (chapters.gate?.help) descentLamp(ctx, 232, 264, t, true, 0.8);
  if (chapters.choir?.help) {
    descentPixel(ctx, 506, 225, 13, 19, 'metalDark');
    descentPixel(ctx, 510, 229, 5, 8, '#d8cc8c');
    descentPixel(ctx, 507, 244, 11, 2, 'brassDark');
  }
  if (chapters.citadel?.help) descentCrate(ctx, 548, 326, 43, 25, false);
}

function descentEndingWall(ctx, light = false) {
  const p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c);
  p(0, 0, 640, 360, light ? '#6f8772' : '#18211e');
  for (let row = 0; row < 10; row++)
    for (let col = -1; col < 12; col++) {
      const x = col * 60 + (row % 2) * 30,
        y = 14 + row * 25;
      p(
        x + 2,
        y,
        56,
        23,
        light
          ? ['#747b63', '#7f8266', '#696e58'][(row + col + 30) % 3]
          : ['#303b32', '#374136', '#29342e'][(row + col + 30) % 3]
      );
      p(x + 3, y, 53, 2, light ? '#a4a385' : '#4e5845');
    }
  p(0, 265, 640, 95, light ? '#74765b' : '#353d30');
  for (let row = 0; row < 4; row++) {
    p(0, 267 + row * 25, 640, 2, light ? '#565e48' : '#202b25');
    for (let col = 0; col < 11; col++)
      p(col * 64 + (row % 2) * 32, 269 + row * 25, 2, 23, light ? '#666c51' : '#28342b');
  }
}

function descentEndingGate(ctx, t, opened = false) {
  const p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c);
  descentEndingWall(ctx, opened);
  p(187, 32, 266, 247, 'ink');
  p(200, 41, 240, 232, 'stoneDark');
  p(221, 57, 198, 209, opened ? '#adbf9b' : '#25362d');
  if (opened) {
    p(221, 57, 198, 89, '#91b3ac');
    p(253, 89, 91, 10, '#e1dfbe');
    p(268, 81, 57, 8, '#e1dfbe');
    p(221, 150, 198, 115, '#91a375');
    for (let i = 0; i < 15; i++) {
      const x = 225 + i * 13;
      p(x, 158 - (i % 4) * 4, 12, 10 + (i % 4) * 4, '#5f7d59');
    }
    for (let i = 0; i < 9; i++) p(245 + ((i * 23) % 153), 190 + ((i * 17) % 63), 3, 6, '#c0c18a');
    p(281, 202, 89, 64, '#b3b08a');
    p(294, 181, 59, 21, '#b3b08a');
    for (let i = 0; i < 6; i++) p(291 - i * 3, 257 - i * 10, 75 + i * 2, 2, '#899576');
  }
  for (const side of [0, 1]) {
    const x = side ? 419 : 187;
    p(x, 32, 34, 247, 'stoneDark');
    p(x + 3, 35, 27, 242, 'stone');
    for (let i = 0; i < 8; i++) {
      p(x + 3, 43 + i * 29, 27, 4, 'stoneLight');
      p(x + 3, 47 + i * 29, 3, 20, '#79816a');
    }
  }
  p(187, 29, 266, 22, 'stone');
  p(194, 29, 251, 5, 'stoneLight');
  p(215, 49, 207, 8, 'brassDark');
  const raise = opened ? 152 : 0;
  for (let i = 0; i < 10; i++) {
    p(226 + i * 20, 58, 7, 205 - raise, 'metalDark');
    p(227 + i * 20, 58, 2, 204 - raise, 'metal');
  }
  p(221, 123 - raise * 0.38, 198, 9, 'brassDark');
  p(225, 123 - raise * 0.38, 190, 3, 'brass');
  p(179, 274, 284, 10, 'stoneDark');
  p(187, 274, 268, 3, 'stoneLight');
  p(172, 284, 300, 11, 'stone');
  p(172, 284, 300, 2, 'stoneLight');
  descentLamp(ctx, 160, 181, t, true, 1.1);
  descentLamp(ctx, 481, 181, t + 1, true, 1.1);
}

function descentEndingOutside(ctx, t, walk) {
  const p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c);
  p(0, 0, 640, 360, '#a7baa0');
  p(0, 0, 640, 48, '#718f91');
  p(0, 48, 640, 48, '#8ca7a0');
  p(0, 96, 640, 54, '#adbca0');
  p(479, 33, 25, 25, '#dfd4a0');
  p(474, 38, 35, 15, '#dfd4a0');
  for (let i = 0; i < 4; i++) {
    const x = 43 + i * 157 + Math.floor(Math.sin(t * 0.035 + i) * 7),
      y = 32 + (i % 2) * 36;
    p(x, y, 91, 6, '#cbd2b7');
    p(x + 15, y - 5, 48, 5, '#d9dcc1');
    p(x - 10, y + 6, 81, 3, '#bdcbb2');
  }
  descentPoly(
    ctx,
    [
      [0, 146],
      [95, 107],
      [151, 120],
      [216, 88],
      [301, 111],
      [382, 91],
      [455, 116],
      [531, 103],
      [640, 126],
      [640, 179],
      [0, 179],
    ],
    '#8c9f82'
  );
  for (let i = 0; i < 7; i++) {
    const x = 192 + i * 57,
      y = 116 + (i % 3) * 7;
    p(x, y, 14 + (i % 3) * 3, 37, '#879b82');
    p(x + 2, y - 5, 10, 5, '#879b82');
    p(x + 5, y + 8, 3, 8, '#a6b59a');
    if (i % 2) p(x - 12, y + 15, 12, 22, '#879b82');
  }
  for (let i = 0; i < 11; i++) {
    const x = i * 65 - 15,
      h = 35 + (i % 4) * 9;
    p(x + 21, 143 - h, 5, h + 38, '#5a7158');
    const y = 111 - h / 3;
    descentPoly(
      ctx,
      [
        [x - 8, y + 20],
        [x - 8, y + 5],
        [x + 4, y + 5],
        [x + 4, y - 6],
        [x + 19, y - 6],
        [x + 19, y - 13],
        [x + 36, y - 13],
        [x + 36, y - 3],
        [x + 48, y - 3],
        [x + 48, y + 9],
        [x + 58, y + 9],
        [x + 58, y + 29],
        [x + 43, y + 29],
        [x + 43, y + 37],
        [x + 6, y + 37],
        [x + 6, y + 29],
        [x - 8, y + 29],
      ],
      i % 3 ? '#697f5c' : '#72875f'
    );
    p(x + 3, y + 7, 14, 6, '#84976a');
    p(x + 15, y - 2, 17, 4, '#84976a');
    p(x + 29, y + 17, 22, 5, '#5f7756');
  }
  p(0, 166, 640, 194, '#7d8f60');
  p(0, 166, 640, 14, '#71865c');
  descentPoly(
    ctx,
    [
      [158, 185],
      [223, 180],
      [255, 186],
      [281, 179],
      [318, 182],
      [379, 171],
      [436, 177],
      [640, 190],
      [640, 203],
      [450, 193],
      [390, 190],
      [320, 198],
      [219, 195],
      [164, 200],
    ],
    '#8e9d69'
  );
  descentPoly(
    ctx,
    [
      [220, 166],
      [294, 166],
      [556, 360],
      [115, 360],
    ],
    '#aaa782'
  );
  descentPoly(
    ctx,
    [
      [220, 166],
      [227, 166],
      [139, 360],
      [115, 360],
    ],
    '#929878'
  );
  for (let row = 0; row < 7; row++) {
    const y = 176 + row * 27,
      start = 231 - row * 17,
      width = 48 + row * 27;
    p(start, y, width, 2, '#8b9270');
    p(start + width + 5, y + 7, 45 + row * 4, 2, '#8b9270');
    p(start + width / 2, y + 2, 2, 17, '#929878');
    p(start + width / 2 + 2, y + 17, 15, 2, '#929878');
    p(start + 8, y + 3, 20, 2, '#c2b991');
  }
  descentPoly(
    ctx,
    [
      [300, 190],
      [307, 183],
      [325, 187],
      [334, 200],
      [323, 207],
      [305, 203],
    ],
    '#6e845b'
  );
  descentPoly(
    ctx,
    [
      [370, 276],
      [381, 267],
      [400, 273],
      [410, 289],
      [394, 297],
      [375, 287],
    ],
    '#6e845b'
  );
  p(400, 279, 13, 3, '#687b58');
  p(382, 272, 12, 2, '#a7b17e');
  p(0, 17, 145, 263, '#3a4539');
  p(13, 20, 131, 245, '#6b725b');
  for (let row = 0; row < 9; row++) {
    p(12, 24 + row * 27, 126, 3, '#8b8d6b');
    p(row % 2 ? 58 : 99, 27 + row * 27, 3, 23, '#4d5947');
  }
  p(20, 86, 90, 171, '#222e27');
  p(22, 87, 12, 172, '#5b6852');
  p(108, 82, 28, 181, '#859074');
  p(116, 83, 6, 175, '#afb08a');
  p(7, 260, 151, 13, '#57624d');
  p(14, 260, 137, 3, '#a3a481');
  p(0, 13, 153, 9, '#4d5b48');
  p(8, 12, 137, 3, '#969975');
  p(12, 22, 130, 3, '#a2a17b');
  p(31, 33, 26, 3, '#898e6d');
  p(95, 62, 26, 2, '#a4a580');
  p(17, 208, 12, 3, '#838f6c');
  descentLine(ctx, 71, 28, 65, 48, 2, '#394d3b');
  descentLine(ctx, 65, 48, 73, 58, 2, '#394d3b');
  for (let i = 0; i < 11; i++) {
    const x = 132 + (i % 3) * 5,
      y = 32 + i * 19;
    p(x, y, 3, 22, '#405a3c');
    p(x - 8, y + 3, 10, 6, i % 2 ? '#73905a' : '#607e4d');
    p(x + 2, y + 11, 9, 5, '#829a60');
  }
  for (const [x, y, w] of [
    [35, 280, 45],
    [68, 291, 20],
    [118, 287, 35],
    [463, 330, 38],
    [560, 307, 29],
    [537, 329, 53],
  ]) {
    p(x, y, w, 6, '#4f664a');
    p(x + 4, y - 4, w - 9, 4, '#7e8d64');
    p(x + 6, y - 4, w - 15, 2, '#acaf82');
  }
  for (let i = 0; i < 58; i++) {
    const x = (i * 47 + 22) % 640,
      y = 190 + ((i * 31) % 169);
    if (x > 160 && x < 410 && y > 220) continue;
    p(x, y, 2, 5 + (i % 4), i % 3 ? '#566f48' : '#aabd7c');
    p(x - 2, y + 3, 2, 2, '#738b54');
    if (i % 7 === 0) {
      p(x + 3, y + 1, 3, 3, '#d5cc93');
      p(x + 4, y, 1, 5, '#e5ddb1');
    }
  }
  for (const x of [490, 529, 571]) {
    p(x, 206, 5, 80, '#677d58');
    p(x - 2, 225, 9, 4, '#89956c');
    p(x - 2, 262, 9, 4, '#89956c');
  }
  p(484, 228, 95, 4, '#75845b');
  p(484, 265, 95, 4, '#75845b');
  for (let i = 0; i < 12; i++) {
    const x = 484 + i * 8;
    p(x, 270 + (i % 3) * 2, 2, 14, '#567246');
    p(x - 2, 274 + (i % 2) * 2, 7, 3, '#749057');
  }
  descentLine(ctx, 578, 268, 606, 294, 4, '#536848');
  descentLine(ctx, 578, 266, 606, 292, 2, '#a4a776');
  const data = typeof descentData === 'function' ? descentData() : { chapters: {} };
  if (data.chapters?.garden?.help) descentPlant(ctx, 172, 291, t, 1.5);
  if (data.chapters?.citadel?.help) descentCrate(ctx, 490, 314, 52, 30, true);
  if (typeof ResidentArt !== 'undefined') {
    ctx.save();
    ctx.translate(185, 211);
    ResidentArt.paint(ctx, 'nell', 'idle', Math.floor(t * 4) % 16, 1);
    ctx.restore();
    ctx.save();
    ctx.translate(408, 227);
    ResidentArt.paint(ctx, 'oren', 'idle', Math.floor(t * 4) % 16, -1);
    ctx.restore();
  }
  descentLamp(ctx, 433, 294, t, true, 0.7);
  const x = Math.max(255, Math.min(385, walk?.x ?? 318)),
    y = Math.max(235, Math.min(317, walk?.y ?? 281));
  descentArtEmber(ctx, x, y, t, 1.2);
  descentWick(ctx, x - 44, y - 22 + Math.sin(t * 2.4) * 2, t, 1.05);
  for (let i = 0; i < 6; i++) descentSmallFlame(ctx, 75 + i * 16, 252 + (i % 2) * 14, t + i, 0.45);
}

function drawDescentEnding(ctx, step, time = 0, walk = null) {
  const t = typeof save !== 'undefined' && save.motion ? 4 : time;
  ctx.save();
  ctx.setTransform(ctx.canvas.width / 640, 0, 0, ctx.canvas.height / 360, 0, 0);
  ctx.imageSmoothingEnabled = false;
  const p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c);
  if (step >= 6) {
    descentEndingOutside(ctx, t, walk);
  } else if (step === 4) {
    if (typeof hearthBuildRoom === 'function') ctx.drawImage(hearthBuildRoom(), 0, 0);
    else descentEndingWall(ctx);
    if (typeof hearthFlame === 'function') hearthFlame(ctx, 326, 219, t, 1.08);
    drawHearthResidents(ctx, t);
    descentArtEmber(ctx, 326, 302, t, 1);
    descentWick(ctx, 289, 289, t, 1);
    descentPixel(ctx, 581, 268, 31, 3, '#d5c98e');
  } else if (step === 5) {
    descentEndingGate(ctx, t, true);
    descentArtSprite(ctx, 'gateWarden', 460, 277, 92, t);
    descentArtEmber(ctx, 309, 282, t, 1.1);
    descentWick(ctx, 273, 266, t, 1);
    if (typeof ResidentArt !== 'undefined') {
      ctx.save();
      ctx.translate(188, 235);
      ResidentArt.paint(ctx, 'nell', 'idle', Math.floor(t * 4) % 16, 1);
      ctx.restore();
    }
  } else if (step === 3) {
    descentEndingWall(ctx);
    for (let i = 0; i < 3; i++) {
      const x = 14 + i * 211;
      p(x, 32, 190, 210, 'ink');
      p(x + 4, 36, 182, 201, 'stoneDark');
      p(x + 7, 39, 176, 3, 'stoneLight');
      p(x + 8, 49, 174, 170, '#2d3930');
      p(x + 18, 53, 11, 31, 'metalDark');
      p(x + 20, 55, 2, 26, 'metal');
      p(x + 163, 53, 11, 31, 'metalDark');
      p(x + 165, 55, 2, 26, 'metal');
      p(x + 16, 225, 156, 5, 'brassDark');
      p(x + 18, 225, 152, 1, 'brassLight');
    }
    const fixtures = [
      { prop: 'pump', chapterId: 'reservoir' },
      { prop: 'pipe', chapterId: 'foundry' },
      { prop: 'locks', chapterId: 'court' },
    ];
    fixtures.forEach((e, i) => {
      ctx.save();
      ctx.translate(106 + i * 211, 178);
      ctx.scale(1.8, 1.8);
      drawDescentProp(ctx, { ...e, x: 0, y: 0, phase: 'complete' }, t);
      ctx.restore();
    });
    p(20, 270, 600, 5, 'brassDark');
    p(22, 270, 596, 1, 'brassLight');
    for (let i = 0; i < 5; i++) p(51 + i * 126, 291, 4, 25, 'metalDark');
  } else {
    descentEndingWall(ctx);
    p(23, 31, 594, 216, 'stoneDark');
    p(31, 36, 578, 4, 'stoneLight');
    for (let i = 0; i < 6; i++) {
      const x = 43 + i * 96;
      p(x, 51, 70, 187, '#1e2a24');
      p(x + 3, 54, 64, 179, '#354237');
      p(x + 5, 56, 60, 2, '#5b674c');
      p(x + 7, 64, 56, 53, '#26332b');
      p(x + 10, 67, 50, 3, '#3d4e3b');
      p(x + 9, 225, 52, 4, 'metalDark');
      p(x + 10, 225, 50, 1, 'metalLight');
      p(x + 31, 117, 7, 19, 'metalDark');
      p(x + 32, 118, 2, 17, 'metal');
      p(x + 14, 78, 5, 14, step >= 1 ? '#b4c485' : '#745347');
      p(x + 25, 79, 27, 2, '#526443');
      p(x + 25, 85, 20, 2, '#526443');
    }
    p(277, 37, 86, 210, 'ink');
    p(284, 43, 72, 196, 'metalDark');
    p(291, 49, 58, 183, 'stone');
    p(295, 53, 50, 3, 'stoneLight');
    p(298, 62, 44, 104, 'metalDark');
    for (let row = 0; row < 5; row++) {
      p(302, 68 + row * 18, 36, 4, '#3e5746');
      p(304, 69 + row * 18, step >= 1 ? 29 : 8, 2, step >= 1 ? '#b2c17e' : '#6c5840');
    }
    for (const side of [-1, 1]) {
      const x = side < 0 ? 28 : 607;
      p(x, 44, 5, 186, 'metalDark');
      p(x + 1, 45, 1, 184, 'metal');
      p(side < 0 ? 32 : 364, 239, 244, 5, 'metalDark');
      p(side < 0 ? 32 : 364, 239, 244, 1, 'metal');
    }
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.translate(78 + i * 96, 222);
      ctx.scale(1.6, 1.6);
      const open = step >= 2 && ((typeof save !== 'undefined' && save.motion) || t > i * 0.3);
      descentFrame(ctx, 0, 0, open, t, i, open);
      ctx.restore();
      if (open) {
        const move = Math.max(0, Math.min(1, (t - i * 0.3) / 2.7)),
          ease = move * move * (3 - 2 * move);
        descentSmallFlame(
          ctx,
          78 + i * 96 + (124 + i * 14 - (78 + i * 96)) * ease,
          187 + (275 + (i % 2) * 13 - 187) * ease + Math.sin(t * 2 + i) * 2,
          t + i,
          0.82
        );
      }
    }
    p(254, 245, 132, 13, 'ink');
    p(257, 246, 126, 5, 'brassDark');
    p(258, 246, 124, 2, 'brassLight');
    p(296, 186, 48, 58, 'metalDark');
    p(299, 189, 42, 17, 'metal');
    p(303, 192, 12, 8, step >= 1 ? '#d2d391' : '#8b5849');
    p(323, 192, 12, 8, 'brassLight');
    const lever = step >= 1 ? 12 : -14;
    descentLine(ctx, 317, 223, 335, 223 + lever, 6, 'ink');
    descentLine(ctx, 317, 223, 335, 223 + lever, 3, 'brass');
    p(325, 221 + lever, 16, 5, 'brassLight');
    descentArtEmber(ctx, 319, 289, t, 1.2);
    descentWick(ctx, 273, 274, t, 1.05);
    for (const x of [42, 595]) descentLamp(ctx, x, 123, t, step >= 1, 1.2);
    for (let i = 0; i < 4; i++) {
      p(279 + i * 25, 268, 7, 4, '#677055');
      p(280 + i * 25, 268, 5, 1, '#a1a778');
    }
    if (step === 0) {
      p(266, 245, 8, 24, 'metalDark');
      p(270, 242, 7, 5, 'brass');
    }
  }
  p(0, 0, 640, 4, '#161f1b');
  p(0, 356, 640, 4, '#161f1b');
  ctx.restore();
}

function drawDescentDemoEnding(ctx, elapsedOrData = 0, still = false) {
  const info = elapsedOrData && typeof elapsedOrData === 'object' ? elapsedOrData : {},
    elapsed =
      typeof elapsedOrData === 'number'
        ? elapsedOrData
        : Number(info.elapsed ?? info.time ?? info.t ?? 0),
    t = still || info.still || (typeof save !== 'undefined' && save.motion) ? 8 : elapsed,
    p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c),
    data = typeof descentData === 'function' ? descentData() : { chapters: {} };
  ctx.save();
  ctx.setTransform(ctx.canvas.width / 640, 0, 0, ctx.canvas.height / 360, 0, 0);
  ctx.imageSmoothingEnabled = false;
  if (t < 4.2) {
    p(0, 0, 640, 360, '#24372c');
    for (let row = 0; row < 9; row++)
      for (let col = -1; col < 12; col++) {
        const x = col * 60 + (row % 2) * 30,
          y = 15 + row * 25;
        p(x + 2, y, 56, 23, ['#344333', '#3a4936', '#304131'][(row + col + 30) % 3]);
        p(x + 3, y, 52, 2, '#596348');
      }
    p(0, 240, 640, 120, '#3d4936');
    for (let y = 244; y < 360; y += 27) {
      p(0, y, 640, 2, '#2a392d');
      for (let x = 0; x < 640; x += 64) p(x + (y % 2) * 20, y, 2, 25, '#2c3c2d');
    }
    for (const x of [34, 592]) {
      p(x, 23, 15, 219, '#283b2a');
      p(x + 3, 24, 6, 214, '#58704b');
      for (let i = 0; i < 8; i++) {
        p(x - 8, 39 + i * 23, 18, 7, '#698252');
        p(x + 6, 48 + i * 23, 21, 8, '#82965f');
      }
    }
    p(233, 26, 171, 107, '#1a2923');
    p(239, 31, 159, 96, '#6c8e79');
    for (let i = 0; i < 4; i++) {
      p(243 + i * 39, 32, 4, 94, '#536d50');
      p(243, 55 + i * 24, 150, 3, '#4b6549');
    }
    p(240, 128, 160, 7, '#8a9062');
    const drain = Math.min(1, Math.max(0, t / 2.8));
    if (drain < 1) {
      p(118, 276, 359, Math.max(1, Math.round((1 - drain) * 32)), '#426e60');
      p(131, 281, 110, 2, '#759c7d');
      p(300, 288, 143, 1, '#6b9173');
    }
    ctx.save();
    ctx.translate(440, 235);
    ctx.scale(1.7, 1.7);
    drawDescentProp(
      ctx,
      {
        x: 0,
        y: 0,
        chapterId: 'garden',
        prop: 'nursery',
        phase: drain > 0.6 ? 'complete' : 'introduced',
      },
      t
    );
    ctx.restore();
    if (typeof ResidentArt !== 'undefined') {
      ctx.save();
      ctx.translate(328, 218);
      ResidentArt.paint(ctx, 'nell', drain < 0.8 ? 'work' : 'idle', Math.floor(t * 8) % 16, 1);
      ctx.restore();
    }
    descentArtEmber(ctx, 258, 286, t, 1.05);
    descentWick(ctx, 217, 269, t, 1);
    for (let i = 0; i < 5; i++) {
      p(515 + i * 10, 282 - i * 7, 75 - i * 10, 6, '#637252');
      p(515 + i * 10, 282 - i * 7, 75 - i * 10, 1, '#91a475');
    }
    descentLamp(ctx, 166, 194, t, true, 1);
  } else {
    if (typeof hearthBuildRoom === 'function') ctx.drawImage(hearthBuildRoom(), 0, 0);
    else descentEndingWall(ctx);
    if (typeof hearthFlame === 'function') hearthFlame(ctx, 326, 219, t, 1.08);
    if (data.chapters?.gate?.help) descentLamp(ctx, 227, 264, t, true, 0.85);
    if (data.chapters?.garden?.help) {
      descentPlant(ctx, 173, 310, t, 0.9);
      descentPlant(ctx, 197, 311, t + 1, 0.5);
    }
    if (typeof ResidentArt !== 'undefined') {
      ctx.save();
      ctx.translate(135, 273);
      ResidentArt.paint(ctx, 'nell', 'idle', Math.floor(t * 4) % 16, 1);
      ctx.restore();
    }
    descentArtEmber(ctx, 326, 302, t, 1);
    descentWick(ctx, 284, 284, t, 1);
    p(494, 302, 8, 3, '#bc9e61');
    p(508, 302, 8, 3, '#bc9e61');
    p(522, 302, 8, 3, '#bc9e61');
  }
  p(0, 0, 640, 4, '#19251c');
  p(0, 356, 640, 4, '#19251c');
  ctx.restore();
}
