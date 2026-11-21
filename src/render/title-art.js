let titleGateBackdrop;
let titleMist;

function traceTitleArch(ctx, x, top, width, bottom) {
  const step = Math.round(width * 0.18);
  const shoulder = Math.round(width * 0.54);
  ctx.beginPath();
  ctx.moveTo(x - width, bottom);
  for (const [px, py] of [
    [x - width, top + 49],
    [x - width + step, top + 49],
    [x - width + step, top + 29],
    [x - shoulder, top + 29],
    [x - shoulder, top + 13],
    [x - step, top + 13],
    [x - step, top],
    [x + step, top],
    [x + step, top + 13],
    [x + shoulder, top + 13],
    [x + shoulder, top + 29],
    [x + width - step, top + 29],
    [x + width - step, top + 49],
    [x + width, top + 49],
    [x + width, bottom],
  ]) {
    ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function paintTitlePassage(ctx, shape, rect) {
  ctx.save();
  traceTitleArch(ctx, 240, 57, 70, 229);
  ctx.clip();
  const dark = ctx.createLinearGradient(0, 68, 0, 228);
  dark.addColorStop(0, '#100f13');
  dark.addColorStop(0.48, '#222424');
  dark.addColorStop(1, '#2e302a');
  rect(170, 57, 140, 172, dark);

  shape(
    [
      [170, 69],
      [241, 125],
      [241, 159],
      [170, 220],
    ],
    '#1b1e1d'
  );
  shape(
    [
      [310, 76],
      [268, 125],
      [268, 158],
      [310, 220],
    ],
    '#201d1c'
  );
  shape(
    [
      [241, 125],
      [248, 119],
      [265, 122],
      [268, 130],
      [268, 159],
      [241, 159],
    ],
    '#161719'
  );
  shape(
    [
      [245, 130],
      [252, 125],
      [263, 127],
      [266, 132],
      [266, 155],
      [245, 155],
    ],
    '#121417'
  );
  shape(
    [
      [247, 157],
      [265, 157],
      [302, 229],
      [182, 229],
    ],
    '#2d302b'
  );
  shape(
    [
      [252, 155],
      [261, 155],
      [278, 223],
      [213, 227],
    ],
    '#37372c'
  );
  shape(
    [
      [249, 160],
      [257, 159],
      [249, 214],
      [228, 215],
    ],
    '#6a503026'
  );
  shape(
    [
      [231, 173],
      [237, 168],
      [232, 181],
      [224, 182],
    ],
    '#54524572'
  );
  shape(
    [
      [274, 190],
      [289, 195],
      [295, 210],
      [278, 205],
    ],
    '#14191b78'
  );

  for (const [edge, top, span, bottom] of [
    [180, 94, 12, 209],
    [206, 102, 9, 188],
    [226, 116, 6, 171],
  ]) {
    shape(
      [
        [edge, top],
        [edge + span, top + 8],
        [edge + span, bottom - 9],
        [edge, bottom],
      ],
      '#101516'
    );
    shape(
      [
        [edge + span, top + 8],
        [edge + span + 2, top + 9],
        [edge + span + 2, bottom - 12],
        [edge + span, bottom - 9],
      ],
      '#54564683'
    );
  }
  for (const [edge, top, span, bottom] of [
    [299, 91, 9, 219],
    [286, 109, 6, 194],
    [274, 120, 4, 173],
  ]) {
    shape(
      [
        [edge, top],
        [edge - span, top + 9],
        [edge - span, bottom - 9],
        [edge, bottom],
      ],
      '#131516'
    );
    shape(
      [
        [edge - span - 2, top + 9],
        [edge - span, top + 8],
        [edge - span, bottom - 9],
        [edge - span - 2, bottom - 12],
      ],
      '#6c503b68'
    );
  }
  for (const [x, y, w] of [
    [244, 162, 20],
    [235, 172, 31],
    [225, 184, 43],
    [211, 201, 53],
    [197, 218, 74],
  ]) {
    rect(x, y + 1, w, 2, '#191c1b');
    rect(x + 1, y, Math.round(w * 0.56), 1, '#77735b65');
  }
  const light = ctx.createRadialGradient(255, 144, 1, 255, 150, 46);
  light.addColorStop(0, '#d79a5470');
  light.addColorStop(0.38, '#b774423a');
  light.addColorStop(1, '#a46e4300');
  rect(207, 100, 95, 95, light);
  rect(251, 151, 8, 2, '#69604b');
  rect(253, 153, 4, 3, '#22201d');
  ctx.restore();
}

function paintTitleMist() {
  const canvas = document.createElement('canvas');
  canvas.width = 146;
  canvas.height = 30;
  const ctx = canvas.getContext('2d');
  for (const [x, y, width, height] of [
    [33, 15, 31, 7],
    [63, 12, 40, 9],
    [91, 16, 41, 11],
    [118, 13, 27, 6],
  ]) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(width, height);
    const haze = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    haze.addColorStop(0, '#aab8a467');
    haze.addColorStop(0.44, '#9eaa9b33');
    haze.addColorStop(1, '#9eaa9b00');
    ctx.fillStyle = haze;
    ctx.fillRect(-1, -1, 2, 2);
    ctx.restore();
  }
  return canvas;
}

function paintTitleGate() {
  const art = document.createElement('canvas');
  art.width = 480;
  art.height = 330;
  const c = art.getContext('2d');
  const rect = (x, y, w, h, color) => {
    c.fillStyle = color;
    c.fillRect(x, y, w, h);
  };
  const shape = (points, color) => {
    c.fillStyle = color;
    c.beginPath();
    points.forEach(([x, y], index) => (index ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.closePath();
    c.fill();
  };
  const arch = (x, top, width, bottom, color) => {
    traceTitleArch(c, x, top, width, bottom);
    c.fillStyle = color;
    c.fill();
  };

  rect(0, 0, 480, 330, '#131211');
  const stone = ['#252222', '#292524', '#2c2826', '#312b27', '#272626'];
  for (let row = 0; row < 12; row++) {
    const y = 5 + row * 18;
    for (let col = -1; col < 13; col++) {
      const seed = (((col + 2) * 4919) ^ ((row + 3) * 6997)) >>> 0;
      const x = col * 43 - (row % 2) * 19;
      const width = 39 + (seed % 4);
      rect(x, y, width, 16, stone[(seed >>> 3) % stone.length]);
      rect(x + 2, y, width - 3, 1, '#524133');
      rect(x + 1, y + 15, width - 1, 1, '#1a1717');
      if (seed % 3 === 1) {
        const nick = 4 + ((seed >>> 8) % 27);
        rect(x + nick, y + 5, 8, 1, '#201c1b');
        rect(x + nick + 7, y + 6, 5, 1, '#44352a');
      }
    }
  }
  shape(
    [
      [0, 0],
      [118, 0],
      [152, 225],
      [0, 286],
    ],
    '#110f108a'
  );
  shape(
    [
      [480, 0],
      [373, 0],
      [346, 225],
      [480, 286],
    ],
    '#110f108a'
  );
  rect(0, 214, 480, 116, '#211b19');

  const floors = [214, 223, 234, 248, 267, 293, 329];
  for (let i = 0; i < floors.length - 1; i++) {
    const y = floors[i],
      next = floors[i + 1],
      depth = (y - 187) / 143,
      lower = (next - 187) / 143;
    const total = Math.ceil(238 / (depth * 90)) + 3;
    for (let k = -total; k < total; k++) {
      const u = (k + (i & 1) * 0.5) * 91;
      const topL = Math.round(240 + u * depth),
        topR = Math.round(240 + (u + 89) * depth);
      const botL = Math.round(240 + u * lower),
        botR = Math.round(240 + (u + 89) * lower);
      const seed = Math.abs((k * 1549) ^ (i * 7919));
      shape(
        [
          [topL, y],
          [topR, y],
          [botR, next - 2],
          [botL, next - 2],
        ],
        stone[seed % stone.length]
      );
      rect(topL + 1, y, Math.max(1, topR - topL - 2), 1, '#66514443');
      if (seed % 7 === 1) rect(topL + 3, y + 4, Math.max(1, (topR - topL) >> 2), 1, '#b88b5640');
    }
  }

  arch(240, 25, 105, 236, '#100e0e');
  arch(240, 31, 99, 232, '#695441');
  arch(240, 34, 94, 232, '#42352d');
  arch(240, 45, 84, 231, '#79624c');
  arch(240, 49, 79, 230, '#292321');
  arch(240, 54, 73, 229, '#ada078');
  arch(240, 57, 70, 229, '#171315');
  for (const side of [-1, 1]) {
    for (const [dx, y, span] of [
      [35, 44, 16],
      [62, 57, 11],
      [78, 76, 13],
      [88, 101, 11],
      [95, 198, 9],
    ]) {
      const x = 240 + dx * side;
      rect(x - span / 2, y, span, 2, '#b194638a');
      rect(x - span / 2 + 3, y + 2, span - 4, 1, '#241918af');
      rect(x - 1, y + 3, 1, 3, '#453329');
    }
  }
  shape(
    [
      [218, 31],
      [228, 21],
      [252, 21],
      [262, 31],
      [255, 49],
      [225, 49],
    ],
    '#201a18'
  );
  shape(
    [
      [221, 30],
      [229, 23],
      [251, 23],
      [259, 30],
      [253, 46],
      [227, 46],
    ],
    '#7e6244'
  );
  shape(
    [
      [225, 31],
      [231, 26],
      [249, 26],
      [255, 31],
      [250, 43],
      [230, 43],
    ],
    '#3d2c23'
  );
  shape(
    [
      [240, 27],
      [246, 33],
      [240, 40],
      [234, 33],
    ],
    '#aa7b48'
  );
  shape(
    [
      [240, 30],
      [243, 33],
      [240, 36],
      [237, 33],
    ],
    '#452e22'
  );

  for (const sign of [-1, 1]) {
    const x = 240 + sign * 92;
    rect(x - 4, 120, 8, 90, '#71604b');
    rect(x - 3, 121, 2, 85, '#abe0d02a');
    rect(x - 7, 117, 14, 4, '#362a25');
    rect(x - 8, 208, 16, 7, '#362a25');
    rect(x - 6, 208, 12, 2, '#9c805d');
    for (const y of [96, 125, 160, 191]) rect(x - 7, y, 17, 2, '#251a16');
    for (const [dx, y] of [
      [23, 67],
      [39, 53],
      [55, 41],
      [74, 58],
    ]) {
      const xx = 240 + sign * dx;
      rect(xx, y, 2, (dx % 3) + 7, '#342823');
      rect(xx + 2, y + 2, 1, 4, '#b89258');
    }
  }

  paintTitlePassage(c, shape, rect);
  for (const side of [-1, 1]) {
    const jamb = 240 + side * 64;
    const edge = 240 + side * 45;
    shape(
      [
        [jamb, 114],
        [edge, 133],
        [edge, 209],
        [jamb, 224],
      ],
      side < 0 ? '#33241e' : '#423023'
    );
    shape(
      [
        [jamb, 114],
        [jamb + side * -7, 118],
        [edge, 134],
        [edge + side * 4, 137],
      ],
      '#ac7849'
    );
    for (const y of [148, 169, 189]) {
      shape(
        [
          [jamb, y - 6],
          [edge, y],
          [edge, y + 3],
          [jamb, y - 2],
        ],
        '#1e1817'
      );
      rect(edge + side * 9 - 1, y - 2, 2, 2, '#9e7344');
    }
    rect(edge - 1, 152, 2, 53, '#bd8a53');
    rect(edge + side * 5 - 2, 178, 4, 7, '#151416');
    rect(edge + side * 5 - 1, 179, 2, 3, '#cb9e65');
  }
  for (const [x, height] of [
    [92, 77],
    [394, 92],
  ]) {
    const y = 48;
    rect(x - 18, y - 4, 36, 3, '#65513b');
    rect(x - 15, y - 5, 30, 1, '#9a7550');
    shape(
      [
        [x - 13, y],
        [x + 13, y],
        [x + 13, y + height],
        [x + 4, y + height - 8],
        [x - 1, y + height + 3],
        [x - 8, y + height - 4],
        [x - 13, y + height],
      ],
      '#4d302b'
    );
    rect(x - 11, y + 1, 2, height - 6, '#71433a');
    rect(x + 9, y + 1, 2, height - 8, '#2e2321');
    shape(
      [
        [x, y + 20],
        [x + 5, y + 31],
        [x, y + 42],
        [x - 5, y + 31],
      ],
      '#96653e'
    );
    rect(x - 1, y + 29, 2, 7, '#c89b63');
    rect(x - 7, y + height - 15, 5, 2, '#281b1a');
  }
  shape(
    [
      [218, 224],
      [260, 224],
      [312, 308],
      [173, 308],
    ],
    '#caab7214'
  );
  shape(
    [
      [230, 224],
      [249, 224],
      [277, 299],
      [209, 299],
    ],
    '#c3a97f12'
  );
  shape(
    [
      [224, 224],
      [230, 224],
      [210, 297],
      [150, 324],
    ],
    '#0807084d'
  );
  shape(
    [
      [249, 224],
      [260, 224],
      [302, 285],
      [330, 316],
    ],
    '#08070853'
  );
  for (let rung = 0; rung < 4; rung++) {
    const y = 225 + rung * 7,
      left = 164 - 8 * rung,
      width = 152 + 16 * rung;
    rect(left, y, width, 7, '#2b2420');
    rect(left + 1, y, width - 2, 2, '#856747');
    rect(left + 3, y + 5, width - 6, 2, '#150f0f');
    rect(222 - 4 * rung, y, 36 + 8 * rung, 1, '#ab8558');
    rect(236 - 4 * rung, y + 1, 4 + 8 * rung, 1, '#bf9765');
  }

  for (const x of [117, 362]) {
    for (let y = 26; y < 144; y += 8) {
      rect(x - 2, y, 5, 6, '#171517');
      rect(x - 1, y, 3, 1, '#735e46');
      rect(x, y + 2, 1, 4, '#69543e');
    }
    shape(
      [
        [x - 25, 164],
        [x + 25, 164],
        [x + 18, 172],
        [x - 18, 172],
      ],
      '#1b1411'
    );
    rect(x - 21, 163, 42, 3, '#9a6c3a');
    rect(x - 13, 169, 26, 1, '#5b422d');
    rect(x - 4, 172, 8, 12, '#312821');
    rect(x - 7, 183, 14, 2, '#775235');
    rect(x - 4, 158, 8, 3, '#e3934c');
  }

  for (const [x, y, w] of [
    [91, 250, 24],
    [149, 300, 22],
    [334, 277, 29],
    [389, 253, 30],
    [414, 309, 37],
  ]) {
    shape(
      [
        [x, y],
        [x + w, y - 3],
        [x + w + 5, y + 5],
        [x - 6, y + 6],
      ],
      '#0d0a0a90'
    );
    rect(x, y - 4, w, 5, '#3a2b24');
    rect(x + 2, y - 5, Math.round(w * 0.58), 1, '#765b42');
    rect(x + w - 6, y + 1, 8, 2, '#211b19');
  }
  const shade = c.createRadialGradient(240, 177, 40, 240, 183, 274);
  shade.addColorStop(0, '#0b090800');
  shade.addColorStop(0.55, '#0b090800');
  shade.addColorStop(1, '#090707e8');
  c.fillStyle = shade;
  c.fillRect(0, 0, 480, 330);
  return art;
}

function drawMenuBg() {
  const c = G.ctx;
  const t = save.motion ? 0 : G.tAll;
  const portrait = G.w <= 820 && G.h > 520;
  const scale = portrait ? Math.max(0.95, G.w / 430) : Math.max(G.h / 320, (G.w * 0.7) / 480);
  const x = (portrait ? G.w / 2 : G.w * 0.74) - 240 * scale;
  const y = portrait ? Math.round(G.h * 0.17 - 118 * scale) : (G.h - 330 * scale) / 2;
  if (!titleGateBackdrop || titleGateBackdrop.getContext('2d').isContextLost?.())
    titleGateBackdrop = paintTitleGate();
  if (!titleMist || titleMist.getContext('2d').isContextLost?.()) titleMist = paintTitleMist();

  c.fillStyle = '#090707';
  c.fillRect(0, 0, G.w, G.h);
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.scale(scale, scale);
  c.imageSmoothingEnabled = false;
  c.drawImage(titleGateBackdrop, 0, 0);

  c.save();
  traceTitleArch(c, 240, 57, 70, 229);
  c.clip();
  glowImg('ember', 255, 146, 28, 0.31 + Math.sin(t * 2.6) * 0.05);
  drawSpr('flame', 255, 147, 0.27, 0, 1, save.motion ? -G.tAll : 0);
  c.globalAlpha = 0.5;
  c.drawImage(titleMist, 203 + Math.round(Math.sin(t * 0.37) * 10), 175, 99, 22);
  c.globalAlpha = 0.76;
  c.drawImage(titleMist, 173 + Math.round(Math.sin(t * 0.28 + 1.7) * 9), 194, 125, 32);
  c.restore();
  glowImg('ember', 240, 249, 84, 0.12);
  for (const bx of [117, 362]) {
    const sway = Math.sin(t * 4 + bx);
    glowImg('ember', bx, 153, 72, 0.28 + sway * 0.05);
    drawSpr('flame', bx, 151 + Math.round(sway), 0.88, 0, 1, save.motion ? -G.tAll : bx);
  }

  for (let i = 0; i < 18; i++) {
    const drift = (i * 39 + t * (4 + (i % 4))) % 91;
    const side = i % 2 ? -1 : 1;
    const px = 240 + side * (61 + ((i * 17) % 75) + Math.sin(t * 0.61 + i) * 3);
    const py = 242 - drift;
    c.globalAlpha = (1 - drift / 105) * (i % 5 ? 0.31 : 0.53);
    c.fillStyle = i % 4 ? '#ef9850' : '#ffdb96';
    c.fillRect(Math.round(px), Math.round(py), 1, 1);
  }
  c.globalAlpha = 1;
  drawHearthEmber(c, 240, 273, t);
  c.restore();
}
