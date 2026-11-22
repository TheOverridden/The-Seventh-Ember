const TITLE_WIDTH = 384;
const TITLE_HEIGHT = 316;
const TITLE_BRAZIERS = [
  [77, 135],
  [307, 135],
  [86, 226],
  [298, 226],
];
let titleShrine;

function titleOutline(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.closePath();
}

function paintTitleShrine() {
  const art = document.createElement('canvas');
  art.width = TITLE_WIDTH;
  art.height = TITLE_HEIGHT;
  const ctx = art.getContext('2d');
  const rect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  };
  const shape = (points, color) => {
    ctx.fillStyle = color;
    titleOutline(ctx, points);
    ctx.fill();
  };
  const oval = (x, y, width, height, color) => {
    for (let dy = -height; dy <= height; dy++) {
      const half = Math.floor(width * Math.sqrt(1 - (dy / height) ** 2));
      rect(x - half, y + dy, half * 2 + 1, 1, color);
    }
  };
  const glow = (x, y, radius, color, transparent) => {
    const haze = ctx.createRadialGradient(x, y, 2, x, y, radius);
    haze.addColorStop(0, color);
    haze.addColorStop(1, transparent);
    rect(x - radius, y - radius, radius * 2, radius * 2, haze);
  };

  rect(0, 0, TITLE_WIDTH, TITLE_HEIGHT, '#0b090a');
  glow(192, 154, 188, '#32231f', '#32231f00');
  shape(
    [
      [15, 111],
      [63, 79],
      [83, 88],
      [54, 195],
      [40, 251],
      [0, 265],
    ],
    '#171616'
  );
  shape(
    [
      [384, 101],
      [352, 75],
      [333, 101],
      [349, 201],
      [367, 229],
      [384, 219],
    ],
    '#171415'
  );
  for (const [x, y] of [
    [27, 162],
    [23, 233],
    [55, 279],
    [322, 281],
    [349, 250],
    [361, 190],
  ]) {
    shape(
      [
        [x - 11, y + 2],
        [x - 7, y - 5],
        [x + 5, y - 8],
        [x + 14, y - 2],
        [x + 12, y + 7],
        [x - 6, y + 8],
      ],
      '#24201e'
    );
    rect(x - 6, y - 4, 8, 1, '#473a31');
    rect(x + 2, y + 4, 10, 3, '#121113');
  }

  const platform = [
    [63, 106],
    [321, 106],
    [350, 133],
    [350, 244],
    [324, 269],
    [59, 269],
    [33, 244],
    [33, 133],
  ];
  shape(
    platform.map(([x, y]) => [x, y + 13]),
    '#08090b'
  );
  shape(
    platform.map(([x, y]) => [x, y + 7]),
    '#211b1b'
  );
  shape(platform, '#292322');
  ctx.save();
  titleOutline(ctx, platform);
  ctx.clip();
  const slabs = ['#36302c', '#342e2c', '#3d352f', '#302b2a', '#3a342f'];
  for (let row = 0; row < 10; row++) {
    const y = 107 + row * 17;
    for (let col = 0; col < 15; col++) {
      const x = 14 + col * 27 - (row % 2) * 13;
      const noise = (((col + 13) * 7517) ^ ((row + 17) * 12653)) >>> 0;
      rect(x, y, 26, 16, slabs[noise % slabs.length]);
      rect(x + 1, y, 23, 1, '#6b564240');
      rect(x + 1, y + 15, 25, 1, '#1b1919');
      if (noise % 4 === 0) {
        const notch = x + 4 + ((noise >>> 8) % 12);
        rect(notch, y + 6, 6, 1, '#221f1e');
        rect(notch + 5, y + 7, 3, 1, '#221f1e');
        rect(notch + 1, y + 7, 4, 1, '#76614b5c');
      }
      if (noise % 7 === 1) rect(x + 9, y + 10, 3, 1, '#ab9b7350');
    }
  }
  for (const [x, y] of [
    [48, 155],
    [68, 175],
    [47, 226],
    [97, 256],
    [316, 166],
    [333, 222],
    [286, 257],
  ]) {
    rect(x, y, 9, 3, '#394032');
    rect(x + 2, y - 1, 3, 2, '#72765275');
    rect(x + 6, y + 2, 5, 1, '#555641');
  }
  ctx.restore();

  shape(
    [
      [33, 244],
      [59, 269],
      [324, 269],
      [350, 244],
      [350, 250],
      [324, 277],
      [59, 277],
      [33, 251],
    ],
    '#44332a'
  );
  rect(60, 268, 263, 2, '#866745');
  rect(61, 275, 262, 2, '#181516');
  for (let x = 63; x < 315; x += 22) {
    const offset = x % 3;
    rect(x + offset, 270, 1, 5, '#221c1a');
    rect(x + offset + 2, 271, 13, 1, '#64503e');
  }

  rect(49, 71, 286, 54, '#211c1b');
  rect(52, 70, 280, 8, '#514238');
  rect(53, 70, 279, 1, '#8b6f50');
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 11; col++) {
      const x = 54 + col * 26 + (row % 2) * 8;
      if (x > 322) continue;
      const y = 79 + row * 11;
      const width = Math.min(25, 333 - x);
      rect(x, y, width, 10, slabs[(col + row * 3) % slabs.length]);
      rect(x + 1, y, width - 2, 1, '#7d644c73');
    }
  }
  rect(52, 119, 280, 6, '#100f11');
  rect(52, 118, 280, 1, '#7a6146');
  for (const x of [62, 320]) {
    rect(x - 6, 67, 14, 50, '#292526');
    rect(x - 5, 68, 3, 47, '#645748');
    rect(x + 3, 68, 4, 47, '#151515');
    rect(x - 8, 67, 18, 4, '#837050');
    rect(x - 8, 114, 18, 4, '#5a4837');
  }

  for (const [x, tip] of [
    [106, 103],
    [278, 110],
  ]) {
    shape(
      [
        [x - 8, 74],
        [x + 8, 74],
        [x + 8, tip - 4],
        [x + 1, tip - 1],
        [x - 4, tip - 3],
        [x - 8, tip],
      ],
      '#553333'
    );
    rect(x - 9, 73, 18, 2, '#875f42');
    rect(x - 6, 75, 1, tip - 79, '#96664c');
    shape(
      [
        [x, 82],
        [x + 4, 87],
        [x, 92],
        [x - 4, 87],
      ],
      '#aa7951'
    );
  }

  const arch = (radius, top, base, color) => {
    const path = [[192 - radius, base]];
    for (let y = top + 29; y >= top; y -= 2) {
      const step = (y - top) / 30;
      path.push([192 - Math.max(9, Math.round(radius * Math.sqrt(1 - (1 - step) ** 2))), y]);
    }
    for (let i = path.length - 1; i >= 0; i--) path.push([384 - path[i][0], path[i][1]]);
    shape(path, color);
  };
  arch(63, 21, 127, '#161314');
  arch(58, 24, 123, '#887257');
  arch(54, 27, 123, '#4c3e35');
  arch(46, 31, 120, '#775e48');
  arch(42, 35, 120, '#171516');
  shape(
    [
      [182, 23],
      [189, 19],
      [197, 19],
      [202, 24],
      [199, 32],
      [186, 32],
    ],
    '#5d4b3f'
  );
  rect(188, 20, 10, 1, '#bd9a6c');
  shape(
    [
      [192, 23],
      [196, 26],
      [192, 30],
      [188, 26],
    ],
    '#997554'
  );
  for (const side of [-1, 1]) {
    for (const [dx, y] of [
      [23, 28],
      [34, 32],
      [43, 39],
      [51, 49],
      [54, 69],
      [54, 94],
      [54, 113],
    ]) {
      const x = 192 + dx * side;
      rect(x - 2, y, 5, 1, '#b09769');
      rect(x - 2, y + 1, 6, 2, '#2a2321');
    }
    const anchor = 192 + side * 36;
    shape(
      [
        [anchor, 56],
        [192 + side * 30, 47],
        [192 + side * 18, 41],
        [192 + side * 3, 40],
        [192 + side * 3, 116],
        [anchor, 116],
      ],
      side < 0 ? '#44433b' : '#363830'
    );
    shape(
      [
        [anchor - side * 2, 61],
        [192 + side * 23, 51],
        [192 + side * 7, 48],
        [192 + side * 7, 108],
        [anchor - side * 2, 108],
      ],
      '#252729'
    );
    for (const y of [67, 81, 95]) {
      rect(Math.min(anchor, 192 + side * 6), y, 31, 4, '#5b5040');
      rect(Math.min(anchor, 192 + side * 6), y, 29, 1, '#8b7557');
      rect(anchor - 1, y + 1, 2, 2, '#c09f6f');
    }
    rect(192 + side * 12 - 2, 86, 5, 1, '#a78957');
    rect(192 + side * 12 - 2, 87, 1, 4, '#8a6941');
  }
  shape(
    [
      [190, 42],
      [193, 42],
      [193, 59],
      [192, 61],
      [195, 80],
      [193, 85],
      [194, 116],
      [190, 116],
      [191, 84],
      [190, 73],
    ],
    '#b36935'
  );
  rect(192, 82, 1, 29, '#fbb86b');
  rect(191, 71, 1, 16, '#d58d46');

  rect(153, 118, 78, 3, '#686052');
  rect(149, 121, 86, 5, '#292626');
  rect(147, 125, 90, 1, '#967046');
  rect(187, 117, 12, 2, '#e9ac68');
  shape(
    [
      [184, 126],
      [200, 126],
      [221, 155],
      [160, 155],
    ],
    '#a567321a'
  );
  glow(192, 109, 44, '#fb9c4c45', '#fb9c4c00');

  oval(192, 180, 63, 36, '#1c1a1c');
  oval(192, 176, 60, 34, '#716048');
  oval(192, 175, 56, 31, '#35312d');
  oval(192, 175, 50, 27, '#8d714c');
  oval(192, 175, 48, 25, '#36312a');
  oval(192, 175, 36, 19, '#544638');
  shape(
    [
      [192, 152],
      [233, 175],
      [192, 198],
      [151, 175],
    ],
    '#6f5436'
  );
  shape(
    [
      [192, 155],
      [229, 175],
      [192, 195],
      [155, 175],
    ],
    '#34302c'
  );
  shape(
    [
      [192, 163],
      [210, 175],
      [192, 187],
      [174, 175],
    ],
    '#b99358'
  );
  shape(
    [
      [192, 166],
      [206, 175],
      [192, 184],
      [178, 175],
    ],
    '#66503a'
  );
  for (let i = 0; i < 14; i++) {
    const angle = (i * TAU) / 14;
    const x = Math.cos(angle) * 53 + 192;
    const y = Math.sin(angle) * 29 + 175;
    rect(x - 1, y - 1, 2, 2, i % 2 ? '#c09b65' : '#292826');
  }
  for (const [x, y, span] of [
    [151, 152, 8],
    [226, 189, 9],
    [161, 198, 12],
    [222, 153, 6],
  ]) {
    rect(x, y, span, 1, '#c6a977');
    rect(x + 2, y + 1, span - 5, 1, '#574532');
  }
  for (const [first, last] of [
    [3.35, 4.16],
    [4.7, 5.03],
    [5.36, 5.97],
    [0.27, 0.59],
  ]) {
    for (let a = first; a < last; a += 0.032) {
      const x = 192 + Math.cos(a) * 59;
      const y = 176 + Math.sin(a) * 33;
      rect(x, y, 2, 1, '#d2af74');
    }
  }
  glow(192, 174, 57, '#e4a4503c', '#e4a45000');

  for (const [x, y] of TITLE_BRAZIERS) {
    oval(x, y + 12, 16, 5, '#151416');
    shape(
      [
        [x - 13, y + 3],
        [x + 13, y + 3],
        [x + 8, y + 8],
        [x - 8, y + 8],
      ],
      '#48352a'
    );
    rect(x - 11, y + 2, 22, 2, '#9d784a');
    rect(x - 5, y + 8, 10, 4, '#5d4431');
    rect(x - 7, y + 11, 14, 2, '#785b3a');
    glow(x, y, 44, '#df8d4b51', '#df8d4b00');
  }

  const shade = ctx.createRadialGradient(194, 155, 84, 194, 156, 201);
  shade.addColorStop(0, '#100c0d00');
  shade.addColorStop(0.67, '#100d0f06');
  shade.addColorStop(1, '#090709b0');
  rect(0, 0, TITLE_WIDTH, TITLE_HEIGHT, shade);
  return art;
}

function drawMenuBg() {
  const ctx = G.ctx;
  const time = save.motion ? 0 : G.tAll;
  const portrait = G.w <= 820 && G.h > 520;
  const scale = portrait
    ? Math.max(0.96, (G.w * 0.95) / TITLE_WIDTH)
    : Math.min((G.h * 0.94) / TITLE_HEIGHT, (G.w * 0.64) / TITLE_WIDTH);
  const x = (portrait ? G.w * 0.5 : G.w * 0.71) - (TITLE_WIDTH * scale) / 2;
  const y = portrait ? G.h * 0.182 - TITLE_HEIGHT * scale * 0.41 : (G.h - TITLE_HEIGHT * scale) / 2;
  if (!titleShrine || titleShrine.getContext('2d').isContextLost?.())
    titleShrine = paintTitleShrine();

  ctx.fillStyle = '#090708';
  ctx.fillRect(0, 0, G.w, G.h);
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(titleShrine, 0, 0);

  glowImg('gold', 193, 102, 43, 0.18 + Math.sin(time * 1.35) * 0.035);
  glowImg('gold', 192, 175, 51, 0.21 + Math.sin(time * 1.62) * 0.035);
  for (const [bx, by] of TITLE_BRAZIERS) {
    const sway = Math.sin(time * 4.5 + bx);
    glowImg('ember', bx, by - 4, 25, 0.32 + sway * 0.055);
    drawSpr('flame', bx, by - 4, 0.68, 0, 1, save.motion ? -G.tAll : bx);
    for (let i = 0; i < 3; i++) {
      const rise = (time * (0.32 + i * 0.07) + 0.36 * i + bx * 0.019) % 1;
      ctx.globalAlpha = (1 - rise) * 0.5;
      ctx.fillStyle = i === 0 ? '#ffcd81' : '#c8814b';
      ctx.fillRect(
        Math.round(bx + Math.sin(time * 1.1 + i * 3) * 6),
        Math.round(by - 11 - rise * 23),
        1,
        1
      );
    }
    ctx.globalAlpha = 1;
  }
  drawHearthEmber(ctx, 192, 233, time);
  ctx.restore();
}
