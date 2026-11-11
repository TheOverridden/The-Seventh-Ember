'use strict';

function worksiteWheel(ctx, x, y, r, angle = 0) {
  const p = (a, b, w, h, c) => descentPixel(ctx, a, b, w, h, c);
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    p(x + Math.cos(a) * r - 2, y + Math.sin(a) * r - 2, 4, 4, 'metalDark');
    p(x + Math.cos(a) * (r - 2) - 1, y + Math.sin(a) * (r - 2) - 1, 2, 2, 'brass');
  }
  for (let i = 0; i < 4; i++) {
    const a = angle + (i * Math.PI) / 2;
    descentLine(ctx, x, y, x + Math.cos(a) * (r - 3), y + Math.sin(a) * (r - 3), 2, 'brass');
  }
  p(x - 3, y - 3, 6, 6, 'metalDark');
  p(x - 2, y - 2, 3, 2, 'brassLight');
}

function worksiteChain(ctx, x, y, length, time = 0) {
  for (let i = 0; i < length; i += 6) {
    const offset = Math.floor(time * 12) % 6;
    descentPixel(ctx, x + (Math.floor(i / 6) % 2), y + i + offset, 3, 4, 'metalDark');
    descentPixel(ctx, x + 1, y + i + offset, 1, 2, 'metalLight');
  }
}

function worksiteGauge(ctx, x, y, on, time = 0) {
  descentPixel(ctx, x - 8, y - 7, 16, 15, 'ink');
  descentPixel(ctx, x - 6, y - 6, 12, 11, 'brassDark');
  descentPixel(ctx, x - 5, y - 5, 10, 9, 'clothDark');
  const angle = on ? -0.8 + Math.sin(time * 0.9) * 0.06 : -2.4;
  descentLine(ctx, x, y + 2, x + Math.cos(angle) * 5, y + 2 + Math.sin(angle) * 5, 1, 'woodDark');
  descentPixel(ctx, x - 4, y - 5, 3, 1, 'cloth');
}

function worksitePaper(ctx, x, y, w = 19, h = 14, filled = true) {
  descentPixel(ctx, x, y, w, h, 'woodDark');
  descentPixel(ctx, x, y - 1, w - 1, h - 2, 'cloth');
  for (let i = 0; i < 3; i++)
    descentPixel(ctx, x + 3, y + 2 + i * 3, filled ? w - 7 : 5, 1, '#8d896c');
}

function worksitePlatform(ctx, id) {
  const p = (x, y, w, h, c) => descentPixel(ctx, x, y, w, h, c);
  const green = ['garden', 'observatory'].includes(id),
    wet = id === 'reservoir';
  p(-105, 24, 211, 34, '#111a145c');
  p(-100, 25, 201, 25, green ? '#374331' : wet ? '#35443e' : '#3c4032');
  p(-100, 25, 201, 2, green ? '#657057' : '#686a50');
  p(-101, 49, 203, 5, '#1c2a20');
  for (let i = 0; i < 6; i++) {
    const x = -98 + i * 34;
    p(x, 29, 1, 17, '#28362a');
    p(x + 3, 47, 28, 1, '#4b5340');
  }
  p(-88, 57, 31, 2, '#53604555');
  p(51, 58, 34, 2, '#53604555');
}

const worksiteOldProp = drawDescentProp;
drawDescentProp = function (ctx, event, time = 0) {
  if (!event || !Number.isFinite(event.x) || !Number.isFinite(event.y)) return;
  const t = typeof save !== 'undefined' && save.motion ? 0 : time;
  const done = ['complete', 'helped'].includes(event.phase),
    progress = done ? 1 : Math.max(0, Math.min(1, event.progress || 0)),
    u = progress * progress * (3 - 2 * progress),
    id = event.chapterId;
  const p = (x, y, w, h, c) => descentPixel(ctx, x, y, w, h, c);
  ctx.save();
  ctx.translate(Math.round(event.x), Math.round(event.y));
  ctx.imageSmoothingEnabled = false;
  const scale = event.artScale || 1;
  ctx.scale(scale, scale);
  worksitePlatform(ctx, id);
  if (!event.optional) {
    if (id === 'gate') {
      p(-47, -27, 97, 60, 'ink');
      p(-45, -25, 93, 56, 'stoneDark');
      p(-45, -25, 93, 3, 'stoneLight');
      p(-45, 28, 93, 4, 'metalDark');
      p(-38, -19, 79, 43, '#141e19');
      for (let i = 0; i < 5; i++) p(-36 + i * 16, -17, 13, 39, '#25352b');
      const lift = Math.round(u * 39);
      p(-39, -22 - lift, 82, 41, 'metalDark');
      p(-37, -20 - lift, 78, 3, 'metalLight');
      for (let i = 0; i < 5; i++) p(-35 + i * 16, -15 - lift, 2, 29, 'metal');
      p(-32, -4 - lift, 66, 5, 'woodDark');
      p(-31, -4 - lift, 63, 1, 'woodLight');
      p(-46, -24, 4, 56, 'brassDark');
      p(46, -24, 4, 56, 'brassDark');
      p(-37, 20, 78, 6, 'brassDark');
      p(-36, 20, 75, 1, 'brassLight');
      if (u > 0.28) {
        descentLine(ctx, -38, 11, 8, 11, 5, 'metalDark');
        descentLine(ctx, 8, 11, 37, 3, 5, 'metalDark');
        descentLine(ctx, -37, 9, 8, 9, 2, '#b28b4c');
        descentLine(ctx, 8, 9, 36, 1, 2, '#b28b4c');
        for (let i = 0; i < 4; i++) p(-31 + i * 20, 8, 3, 4, 'brassLight');
      }
      descentCrate(ctx, 75, 34, 25, 20, true);
      descentLamp(ctx, 73, 10, t, true, 0.7);
      p(-30, 36, 60, 3, 'stoneDark');
    } else if (id === 'court') {
      for (const side of [-1, 1]) {
        const x = side * 43;
        p(x - 17, -66, 34, 68, 'ink');
        p(x - 15, -64, 30, 62, 'woodDark');
        p(x - 13, -61, 26, 3, 'woodLight');
        p(x - 11, -56, 22, 35, '#563f32');
        p(x - 8, -53, 16, 2, 'brassDark');
        p(x - 8, -26, 16, 2, 'brassDark');
        descentWorkBench(ctx, x, 7);
      }
      if (u > 0.18) {
        worksitePaper(ctx, -63, -10, 25, 18, true);
        worksitePaper(ctx, 31, -10, 25, 18, true);
        p(-55, -7, 14, 5, '#9eae8c');
        p(-53, -7, 9, 2, '#c5ccb0');
      }
      p(-14, 10, 29, 24, 'woodDark');
      p(-12, 9, 25, 3, 'brass');
      worksitePaper(ctx, -9, 12, 19, 13, u > 0.5);
      descentLamp(ctx, 82, 21, t, true, 0.7);
    } else {
      worksiteOldProp(ctx, { ...event, x: 0, y: 0 }, t);
      if (id === 'garden') {
        p(-94, 4, 40, 35, 'woodDark');
        p(-92, 3, 36, 4, 'woodLight');
        p(-91, 9, 33, 23, '#334c40');
        p(-89, 12 + Math.round(u * 13), 29, Math.max(2, 16 - Math.round(u * 13)), '#537f72');
        for (let i = 0; i < 3; i++) descentPlant(ctx, 61 + i * 13, 33, t + i, done ? 0.7 : 0.25);
        p(54, 32, 45, 5, 'wood');
        p(53, 31, 46, 2, 'woodLight');
        worksiteWheel(ctx, -40, -24, 11, u * Math.PI * 2);
        for (let i = 0; i < 4; i++) p(-90 + i * 8, 37, 5, 1, 'water');
      } else if (id === 'reservoir') {
        p(-67, -46, 7, 68, 'metalDark');
        p(-65, -45, 2, 65, 'metalLight');
        p(-69, -48, 48, 7, 'metalDark');
        p(-67, -48, 44, 2, 'metalLight');
        worksiteGauge(ctx, 52, -37, done, t);
        p(46, -27, 11, 50, 'metalDark');
        p(48, -25, 2, 46, 'metalLight');
        worksiteWheel(ctx, 72, 15, 18, done ? t * 1.8 : u * 3);
        descentLine(ctx, 29, -6, 68, 2, 3, 'woodDark');
        descentLine(ctx, 29, 1, 68, 24, 3, 'woodDark');
        p(-86, 30, 68, 8, '#233a35');
        p(-83, 31, 63, 3, done ? 'water' : '#33493e');
      } else if (id === 'foundry') {
        p(-85, 9, 46, 28, 'stoneDark');
        p(-84, 8, 45, 3, 'stoneLight');
        worksiteGauge(ctx, -63, -6, done, t);
        p(44, -30, 43, 10, 'metalDark');
        p(45, -29, 41, 2, 'metalLight');
        p(77, -22, 10, 53, 'metalDark');
        p(79, -21, 2, 50, 'metal');
        if (event.active && progress > 0.18 && progress < 0.78) {
          const x = 70 * (1 - u);
          p(x - 10, 3 - u * 28, 24, 10, 'metalDark');
          p(x - 8, 4 - u * 28, 20, 2, 'metalLight');
        }
        for (let i = 0; i < 3; i++) p(48 + i * 11, 33, 6, 2, '#9a7048');
      } else if (id === 'observatory') {
        p(-73, -51, 29, 57, 'stoneDark');
        p(46, -51, 27, 57, 'stoneDark');
        for (let i = 0; i < 4; i++) {
          p(-72, -50 + i * 15, 26, 2, 'stoneLight');
          p(47, -50 + i * 15, 24, 2, 'stoneLight');
        }
        p(-75, 6, 150, 7, 'stone');
        p(-72, 6, 144, 2, 'stoneLight');
        descentCrate(ctx, 68, 35, 34, 20, true);
        if (done) worksitePaper(ctx, 50, 7, 30, 17, true);
        else {
          p(54, 15, 25, 4, 'clothDark');
          p(55, 15, 23, 1, 'cloth');
        }
      } else if (id === 'archive') {
        for (const x of [-75, 58]) {
          p(x, -44, 22, 76, 'woodDark');
          p(x + 2, -43, 18, 2, 'woodLight');
          for (let row = 0; row < 4; row++) {
            p(x + 1, -30 + row * 17, 20, 3, 'woodLight');
            for (let i = 0; i < 3; i++)
              p(x + 3 + i * 5, -40 + row * 17, 4, 10, i % 2 ? 'clothDark' : 'metal');
          }
        }
        const width = done ? 66 : Math.round(20 + u * 46);
        p(-33, 18, width, 11, 'cloth');
        p(-34, 17, 3, 13, 'brassDark');
        p(-33 + width, 17, 3, 13, 'brassDark');
        for (let i = 0; i < 4; i++) p(-28 + i * 12, 21, 8, 1, 'metal');
      } else if (id === 'choir') {
        p(-74, -11, 29, 42, 'metalDark');
        p(-72, -9, 25, 3, 'metalLight');
        p(47, -11, 29, 42, 'metalDark');
        p(49, -9, 25, 3, 'metalLight');
        descentLine(ctx, -59, 1, -23, 12, 3, 'brass');
        descentLine(ctx, 25, 12, 62, 1, 3, done ? 'metalDark' : 'brass');
        p(-67, 2, 14, 13, '#e1c477');
        p(-64, 4, 5, 8, '#fff0bc');
        p(54, 2, 14, 13, done ? '#2e3b32' : '#a78b55');
        worksitePaper(ctx, -73, 31, 26, 14, true);
      } else if (id === 'citadel') {
        p(-79, -64, 11, 85, 'metalDark');
        p(-77, -61, 3, 79, 'metal');
        worksiteChain(ctx, -66, -66, 65, done ? 0 : event.active ? t : 0);
        const counterweight = Math.round(u * 26);
        p(-76, -25 + counterweight, 29, 27, 'stoneDark');
        p(-74, -23 + counterweight, 25, 3, 'stoneLight');
        worksiteWheel(ctx, 75, 16, 15, u * 5);
        p(64, 33, 27, 6, 'stone');
      } else if (id === 'heart') {
        p(-64, -66, 128, 10, 'metalDark');
        p(-62, -65, 124, 2, 'brass');
        for (let i = 0; i < 7; i++) {
          const x = -51 + i * 17;
          p(x, -52, 8, 10, 'metalDark');
          p(x + 2, -49, 4, 4, i === 6 ? 'ink' : done ? '#d6b979' : '#746244');
          descentLine(ctx, x + 3, -42, x + 3, -33, 2, 'metalDark');
        }
        worksiteGauge(ctx, 74, -6, done, t);
        p(64, 6, 22, 29, 'metalDark');
        p(68, 12, 13, 4, done ? 'brassLight' : 'brassDark');
      }
    }
  } else {
    const move = done ? 1 : u;
    if (id === 'gate') {
      p(-28, -62, 62, 58, 'stoneDark');
      p(-26, -60, 58, 3, 'stoneLight');
      p(4, -52, 8, 24, 'metalDark');
      p(4, -30, 26, 5, 'metal');
      const x = 17 + move * 47,
        y = -5 + move * 36;
      descentLamp(ctx, x, y, t, true, 0.9);
      descentCrate(ctx, 68, 39, 43, 16, done);
      p(12, -25, 2, 10, done ? 'metalDark' : 'brassDark');
      p(-38, 30, 55, 7, 'woodDark');
      p(-36, 29, 50, 2, 'woodLight');
    } else if (id === 'garden') {
      p(-65, 11, 53, 25, '#263f35');
      p(-63, 12, 49, 13, '#52796b');
      p(31, -26, 65, 6, 'woodLight');
      p(35, -20, 5, 55, 'woodDark');
      p(85, -20, 5, 55, 'woodDark');
      const x = -38 + move * 99,
        y = 8 - move * 34;
      p(x - 20, y - 3, 42, 10, 'woodDark');
      p(x - 20, y - 4, 42, 2, 'woodLight');
      for (let i = 0; i < 3; i++) descentPlant(ctx, x - 13 + i * 13, y - 3, t + i, 0.35);
      p(48, 14, 23, 17, 'clay');
      p(47, 13, 25, 3, 'clayLight');
    } else if (id === 'reservoir') {
      p(-34, -57, 78, 6, 'woodDark');
      p(-34, -57, 76, 2, 'woodLight');
      p(-30, -51, 6, 81, 'woodDark');
      p(32, -51, 6, 81, 'woodDark');
      p(-31, -27, 69, 5, 'wood');
      p(-28, -45, 29, 16, 'clothDark');
      p(7, -43, 22, 14, 'metalDark');
      const x = -9 + move * 65;
      descentCrate(ctx, x, 35, 42, 24, done);
      p(22, -17, 5, 40 - move * 17, 'woodDark');
      p(19, 22 - move * 17, 12, 5, 'woodLight');
      if (done) {
        p(55, 20, 16, 3, 'metalLight');
        p(67, 14, 3, 12, 'brass');
      }
    } else if (id === 'foundry') {
      descentWorkBench(ctx, 3, 23);
      p(-21, -53, 49, 51, 'stoneDark');
      p(-19, -51, 45, 2, 'stoneLight');
      const tilt = done ? 0 : 3;
      descentLamp(ctx, 8 + tilt, -9, t, true, 0.95);
      if (move < 0.7) {
        p(-14, -10, 36, 3, 'metalLight');
        p(-17, -12, 8, 7, 'metal');
      } else {
        p(-9, -11, 3, 19, 'metal');
        p(-9, 6, 29, 4, 'metalLight');
        p(17, -6, 3, 13, 'metalDark');
      }
      p(-29, 14, 13, 2, 'metalLight');
      p(-33, 12, 6, 5, 'metal');
    } else if (id === 'observatory') {
      p(-57, -69, 68, 75, 'stoneDark');
      p(-54, -66, 62, 63, '#77948a');
      p(-56, -69, 67, 3, 'stoneLight');
      descentLine(ctx, -13, 15, -16, -57, 4, 'leafDark');
      for (let i = 0; i < 5; i++)
        descentPoly(
          ctx,
          [
            [-16, -49 + i * 12],
            [-34, -57 + i * 12],
            [-32, -45 + i * 12],
            [-16, -39 + i * 12],
          ],
          'leaf'
        );
      descentWorkBench(ctx, 49, 27);
      p(38, -1, 23, 27, 'metalDark');
      p(40, 0, 19, 24, '#819b85');
      p(41, 12, 17, 10, 'water');
      p(42, 1, 2, 20, '#cbd4b1');
      if (move > 0.4) {
        descentLine(ctx, 50, 14, 47, -16, 2, 'leaf');
        p(44, -12, 12, 3, 'leafLight');
      }
      p(67, 18, 15, 2, 'metalLight');
      p(70, 15, 2, 8, 'metalDark');
    } else if (id === 'archive') {
      p(-41, -46, 91, 56, 'woodDark');
      p(-39, -44, 87, 3, 'woodLight');
      for (let i = 0; i < 3; i++) {
        p(-36, -35 + i * 14, 76, 11, 'wood');
        p(-4, -32 + i * 14, 12, 3, 'brassDark');
      }
      const extension = move * 27;
      p(-35, 4, 76, 7 + extension, 'woodDark');
      p(-32, 6, 70, 3 + extension, 'wood');
      p(-35, 5, 3, 8 + extension, 'woodLight');
      p(38, 5, 3, 8 + extension, 'woodLight');
      if (move > 0.25) {
        p(-12, 2 + extension * 0.45, 31, 13, 'metalDark');
        p(-10, 3 + extension * 0.45, 27, 3, 'metalLight');
        p(-5, 8 + extension * 0.45, 14, 2, 'brass');
      }
      p(-35, 10 + extension, 76, 7, 'woodDark');
      p(-34, 10 + extension, 74, 2, 'woodLight');
      p(-5, 13 + extension, 16, 2, 'brassDark');
      worksitePaper(ctx, 48, 14, 26, 18, true);
    } else if (id === 'court') {
      p(-43, -68, 84, 104, 'stoneDark');
      p(-40, -65, 78, 3, 'stoneLight');
      p(-34, -58, 60, 90, 'ink');
      for (let i = 0; i < 5; i++) p(-32 + i * 12 + move * 37, -55, 4, 85, 'metal');
      p(-34, -13, 61, 5, 'brassDark');
      p(-29, -13, 50, 1, 'brassLight');
      p(40, -7, 20, 7, 'metalDark');
      p(43, -4, 12 + move * 12, 3, 'brass');
      worksiteChain(ctx, 54, -40, 29, 0);
      p(44, -49, 19, 10, 'brassDark');
      p(-33, 34, 81, 5, 'stoneLight');
    } else if (id === 'choir') {
      p(-47, 26, 91, 8, 'stoneDark');
      descentLine(ctx, 1, -34, -26, 32, 4, 'metalDark');
      descentLine(ctx, 2, -34, 28, 32, 4, 'metalDark');
      descentLine(ctx, 1, -30, 2, 34, 4, 'metal');
      descentLamp(ctx, 1, -31, t, done || event.active, 1.15);
      descentLine(ctx, 7, -12, 64, 19, 3, done ? 'brass' : 'metalDark');
      p(61, 10, 23, 21, 'metalDark');
      p(65, 14, 14, 11, 'brassDark');
      p(-78, -63, 26, 38, 'stoneDark');
      descentLamp(ctx, -65, -31, t, done && Math.floor(t * 1.3) % 3 !== 0, 0.55);
    } else if (id === 'citadel') {
      p(-36, -69, 8, 108, 'woodDark');
      p(47, -69, 8, 108, 'woodDark');
      p(-36, -69, 91, 6, 'woodLight');
      worksiteWheel(ctx, 9, -61, 10, -move * 6);
      worksiteChain(ctx, -21, -58, 82 - move * 62, 0);
      worksiteChain(ctx, 39, -58, 82 - move * 62, 0);
      const y = 34 - move * 67;
      p(-28, y, 75, 7, 'wood');
      p(-29, y, 77, 2, 'woodLight');
      descentCrate(ctx, 9, y, 55, 30, false);
      p(-10, y - 31, 17, 6, 'cloth');
      p(11, y - 31, 19, 6, 'clothDark');
      p(-67, 34, 24, 6, 'stone');
      p(67, 34, 24, 6, 'stone');
    } else {
      p(-26, -61, 56, 86, 'metalDark');
      p(-23, -58, 50, 3, 'metalLight');
      p(-20, -52, 44, 62, 'ink');
      p(-23, 15, 51, 8, 'brassDark');
      descentLamp(ctx, 3, 10 - move * 12, t, true, 1.2);
      if (!done) {
        p(-3, -24, 6, 14, '#695f43');
        p(6, -19, 3, 11, '#5e5940');
      }
      p(53, 20, 23, 10, 'clothDark');
      p(55, 19, 19, 2, 'cloth');
      p(-54, 31, 16, 3, 'metal');
      p(-49, 27, 6, 9, 'metalDark');
    }
  }
  if (event.active) {
    const k = Math.floor(t * 7) % 5;
    if (['foundry', 'reservoir', 'citadel'].includes(id))
      p(5 + k * 4, -5 - (k % 3) * 3, 2, 2, 'brassLight');
  }
  ctx.restore();
};

const worksiteHearthResidents = drawHearthResidents;
drawHearthResidents = function (ctx, time = 0) {
  worksiteHearthResidents(ctx, time);
  const data = descentData(),
    chapters = data.chapters;
  if (chapters.archive?.help) {
    descentPixel(ctx, 203, 305, 20, 12, 'metalDark');
    descentPixel(ctx, 204, 305, 18, 3, 'metalLight');
    descentPixel(ctx, 210, 311, 7, 2, 'brass');
  }
  if (chapters.court?.help) {
    descentPixel(ctx, 332, 207, 37, 29, 'woodDark');
    worksitePaper(ctx, 336, 211, 29, 20, true);
    descentPixel(ctx, 343, 217, 13, 1, 'brassDark');
    descentPixel(ctx, 355, 217, 1, 8, 'brassDark');
  }
  if (chapters.heart?.help) descentLamp(ctx, 564, 272, time, true, 0.8);
  if (chapters.gate?.main) {
    descentPixel(ctx, 291, 242, 87, 16, 'metalDark');
    descentPixel(ctx, 293, 243, 83, 2, 'metal');
    for (let i = 0; i < 6; i++) {
      const id = ['gate', 'reservoir', 'foundry', 'archive', 'choir', 'citadel'][i];
      descentPixel(ctx, 298 + i * 13, 248, 7, 6, chapters[id]?.main ? '#d4ba77' : '#344536');
      if (chapters[id]?.main) descentPixel(ctx, 300 + i * 13, 249, 2, 3, '#f1dda2');
    }
  }
};
