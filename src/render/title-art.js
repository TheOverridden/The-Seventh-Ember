let titleGateBackdrop;

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
    const step = Math.round(width * 0.18);
    const shoulder = Math.round(width * 0.54);
    shape(
      [
        [x - width, bottom],
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
      ],
      color
    );
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
  for (const [dx, dy] of [
    [0, -6],
    [-9, -2],
    [9, -2],
    [-8, 4],
    [8, 4],
    [-3, 6],
    [3, 6],
  ]) {
    rect(239 + dx, 34 + dy, 3, 2, dx ? '#b78a55' : '#edc586');
  }

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

  arch(240, 76, 59, 226, '#291c18');
  arch(240, 94, 49, 225, '#522d21');
  arch(240, 110, 42, 225, '#7d482d');
  arch(240, 128, 34, 225, '#ba6d3e');
  arch(240, 147, 27, 225, '#dd9858');
  arch(240, 160, 19, 225, '#f4c283');
  rect(223, 208, 34, 16, '#ffdf9d');
  rect(239, 177, 2, 45, '#fff1b7');
  for (const [y, half] of [
    [170, 23],
    [184, 31],
    [201, 37],
    [215, 47],
  ]) {
    rect(240 - half, y, 2 * half, 2, '#45291f70');
    rect(241 - half, y + 2, 2 * half - 2, 1, '#ffce8068');
  }
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
    '#fdab4f1d'
  );
  shape(
    [
      [230, 224],
      [249, 224],
      [277, 299],
      [209, 299],
    ],
    '#ffe2a624'
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
    rect(222 - 4 * rung, y, 36 + 8 * rung, 1, '#db9a58');
    rect(236 - 4 * rung, y + 1, 4 + 8 * rung, 1, '#f5bc71');
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

  c.fillStyle = '#090707';
  c.fillRect(0, 0, G.w, G.h);
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.scale(scale, scale);
  c.imageSmoothingEnabled = false;
  c.drawImage(titleGateBackdrop, 0, 0);

  glowImg('ember', 240, 217, 125, 0.24);
  glowImg('gold', 240, 208, 79, 0.29 + Math.sin(t * 1.4) * 0.048);
  glowImg('ember', 240, 254, 96, 0.18);
  const sealY = 162 + Math.sin(t * 1.2) * 2;
  glowImg('ember', 240, sealY, 43, 0.31);
  c.strokeStyle = '#ffcd7e5b';
  c.lineWidth = 1;
  c.beginPath();
  c.ellipse(240, sealY, 29, 24, 0, 0, TAU);
  c.stroke();
  for (let i = 0; i < 7; i++) {
    const angle = (i * TAU) / 7 - Math.PI / 2 + t * 0.22;
    const sx = Math.round(240 + Math.cos(angle) * 29);
    const sy = Math.round(sealY + Math.sin(angle) * 24);
    c.fillStyle = '#51281e';
    c.fillRect(sx - 2, sy - 2, 5, 5);
    c.fillStyle = i === 0 ? '#ffdfa0' : '#cf9254';
    c.fillRect(sx - 1, sy - 1, 3, 3);
    c.fillStyle = '#ffe2a5';
    c.fillRect(sx, sy - 1, 1, 1);
  }
  c.save();
  c.translate(240, Math.round(sealY));
  c.rotate(Math.PI / 4);
  c.fillStyle = '#d5894a';
  c.fillRect(-5, -5, 10, 10);
  c.fillStyle = '#ffda90';
  c.fillRect(-4, -4, 6, 6);
  c.fillStyle = '#fff1c4';
  c.fillRect(-3, -3, 2, 3);
  c.restore();
  for (const bx of [117, 362]) {
    const sway = Math.sin(t * 4 + bx);
    glowImg('ember', bx, 153, 72, 0.28 + sway * 0.05);
    drawSpr('flame', bx, 151 + Math.round(sway), 0.88, 0, 1, save.motion ? -G.tAll : bx);
  }

  for (let i = 0; i < 31; i++) {
    const drift = (i * 39 + t * (4 + (i % 4))) % 91;
    const px = ((i * 67) % 201) + 139 + Math.sin(t * 0.61 + i) * ((i % 5) + 2);
    const py = 242 - drift;
    c.globalAlpha = (1 - drift / 105) * (i % 5 ? 0.31 : 0.53);
    c.fillStyle = i % 4 ? '#ef9850' : '#ffdb96';
    c.fillRect(Math.round(px), Math.round(py), i % 5 ? 1 : 2, i % 11 ? 1 : 2);
  }
  c.globalAlpha = 1;
  drawHearthEmber(c, 240, 273, t);
  c.restore();
}
