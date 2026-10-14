const secretArtRooms = new Map();
function secretArtPixel(c, x, y, w, h, color) {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
function secretArtPoly(c, points, color) {
  c.fillStyle = color;
  const top = Math.ceil(Math.min(...points.map((p) => p[1]))),
    bottom = Math.floor(Math.max(...points.map((p) => p[1])));
  for (let y = top; y < bottom; y++) {
    const edges = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i],
        b = points[(i + 1) % points.length],
        sample = y + 0.5;
      if ((a[1] <= sample && b[1] > sample) || (b[1] <= sample && a[1] > sample))
        edges.push(a[0] + ((sample - a[1]) * (b[0] - a[0])) / (b[1] - a[1]));
    }
    edges.sort((a, b) => a - b);
    for (let i = 0; i < edges.length; i += 2)
      c.fillRect(
        Math.ceil(edges[i]),
        y,
        Math.max(0, Math.ceil(edges[i + 1]) - Math.ceil(edges[i])),
        1
      );
  }
}
function secretArtLine(c, x0, y0, x1, y1, color, width = 1) {
  x0 = Math.round(x0);
  y0 = Math.round(y0);
  x1 = Math.round(x1);
  y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0),
    dy = -Math.abs(y1 - y0),
    sx = x0 < x1 ? 1 : -1,
    sy = y0 < y1 ? 1 : -1;
  let error = dx + dy;
  c.fillStyle = color;
  for (;;) {
    c.fillRect(x0, y0, width, width);
    if (x0 === x1 && y0 === y1) break;
    const step = error * 2;
    if (step >= dy) {
      error += dy;
      x0 += sx;
    }
    if (step <= dx) {
      error += dx;
      y0 += sy;
    }
  }
}
function secretArtOval(c, x, y, rx, ry, color, thickness = 0) {
  c.fillStyle = color;
  for (let row = -Math.floor(ry); row <= ry; row++) {
    const half = Math.floor(rx * Math.sqrt(Math.max(0, 1 - (row * row) / (ry * ry))));
    if (thickness && Math.abs(row) < ry - thickness) {
      const inner = Math.floor(
        (rx - thickness) * Math.sqrt(Math.max(0, 1 - (row * row) / (ry - thickness) ** 2))
      );
      c.fillRect(Math.round(x - half), Math.round(y + row), half - inner + 1, 1);
      c.fillRect(Math.round(x + inner), Math.round(y + row), half - inner + 1, 1);
    } else c.fillRect(Math.round(x - half), Math.round(y + row), half * 2 + 1, 1);
  }
}
function secretArtStar(c, x, y, color, size = 3) {
  secretArtPixel(c, x, y - size, 1, size * 2 + 1, color);
  secretArtPixel(c, x - size, y, size * 2 + 1, 1, color);
  secretArtPixel(c, x - 1, y - 1, 3, 3, color);
}
function secretArtGlow(c, x, y, radius, color, alpha = 0.2) {
  const glow = c.createRadialGradient(x, y, 1, x, y, radius);
  glow.addColorStop(0, color);
  glow.addColorStop(1, color + '00');
  c.save();
  c.globalAlpha = alpha;
  c.fillStyle = glow;
  c.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  c.restore();
}
function secretArtFlame(c, x, y, t, scale = 1, cold = false) {
  const frame = save.motion ? 0 : Math.floor(t * 7) % 6,
    lean = [0, 2, 1, -1, -2, 0][frame],
    lift = [0, -2, 1, -1, 2, -1][frame],
    colors = cold
      ? ['#355d77', '#69aabd', '#c1e8e9', '#f1f7da']
      : ['#a9432a', '#ec843b', '#ffc966', '#fff0b7'];
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.scale(scale, scale);
  secretArtPoly(
    c,
    [
      [-12, 0],
      [-14, -6],
      [-10, -10],
      [-10, -18],
      [-6, -14],
      [-5, -25],
      [-1 + lean, -33 + lift],
      [1 + lean, -23],
      [5, -17],
      [8, -22],
      [9, -12],
      [13, -7],
      [11, 0],
    ],
    colors[0]
  );
  secretArtPoly(
    c,
    [
      [-9, 0],
      [-10, -7],
      [-6, -12],
      [-4, -10],
      [-3, -22],
      [lean, -29 + lift],
      [3, -19],
      [5, -11],
      [8, -15],
      [10, -6],
      [8, 0],
    ],
    colors[1]
  );
  secretArtPoly(
    c,
    [
      [-6, 0],
      [-7, -6],
      [-3, -11],
      [-2, -19],
      [1, -23 + lift],
      [3, -13],
      [6, -8],
      [7, -3],
      [5, 1],
    ],
    colors[2]
  );
  secretArtPoly(
    c,
    [
      [-3, 0],
      [-4, -4],
      [-1, -10],
      [1, -14],
      [2, -7],
      [4, -3],
      [3, 1],
    ],
    colors[3]
  );
  c.restore();
}
function secretArtWood(c, x, y, w, h, light = false) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f);
  px(x, y, w, h, '#241f1b');
  for (let row = 0; row < h - 2; row += 9) {
    px(
      x + 2,
      y + row + 1,
      w - 4,
      8,
      light
        ? ['#8a6743', '#9b744a', '#81633f'][(row / 9) % 3]
        : ['#624a32', '#6c5135', '#5c4531'][(row / 9) % 3]
    );
    px(x + 4, y + row + 2, w - 8, 1, light ? '#bd9560' : '#967045');
    px(
      x + 8 + ((row * 7) % Math.max(1, w - 40)),
      y + row + 5,
      Math.min(27, w - 16),
      1,
      light ? '#725436' : '#443628'
    );
  }
  px(x, y, w, 2, '#c09a65');
  px(x, y + 2, 2, h - 2, '#8e6c44');
  px(x + w - 3, y + 3, 2, h - 3, '#352b22');
}
function secretArtRoom(c, s, material = 'stone') {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col),
    palette =
      material === 'pale'
        ? ['#3d4a4c', '#435154', '#354549', '#4d5957']
        : material === 'red'
          ? ['#493630', '#4f3b32', '#42322d', '#594135']
          : material === 'deep'
            ? ['#252b34', '#292e3a', '#222832', '#303440']
            : ['#383630', '#403c33', '#34332e', '#454034'];
  px(0, 0, 640, 420, '#141716');
  px(18, 13, 604, 227, '#252724');
  for (let row = 0; row < 13; row++) {
    const y = 14 + row * 18;
    for (let x = -29 + (row % 2) * 29; x < 640; x += 58) {
      const tone = (((Math.floor((x + 60) / 58) * 3 + row * 5) % 4) + 4) % 4;
      px(x + 1, y + 1, 55, 16, palette[tone]);
      px(
        x + 3,
        y + 2,
        49,
        1,
        material === 'pale' ? '#65716b' : material === 'deep' ? '#48515b' : '#635543'
      );
      px(x + 4, y + 15, 49, 1, '#242824');
      px(x + 54, y + 3, 1, 11, '#232825');
      if ((row * 13 + x) % 5 === 0) {
        px(x + 13, y + 8, 12, 1, palette[(tone + 2) % 4]);
        px(x + 25, y + 9, 7, 1, '#242825');
      }
    }
  }
  poly(
    [
      [0, 0],
      [27, 17],
      [27, 235],
      [0, 271],
    ],
    '#252720'
  );
  poly(
    [
      [640, 0],
      [613, 17],
      [613, 235],
      [640, 271],
    ],
    '#20231f'
  );
  px(18, 10, 604, 11, '#342c23');
  px(19, 10, 602, 2, '#9f7e4e');
  px(22, 14, 596, 3, '#5f4b32');
  px(20, 229, 600, 9, '#171d1a');
  px(21, 229, 598, 2, '#9c8057');
  px(23, 234, 594, 2, '#524634');
  for (const x of [26, 603]) {
    px(x - 3, 20, 16, 218, '#1d211d');
    px(x, 21, 9, 210, '#635136');
    px(x + 1, 22, 2, 205, '#aa8955');
    px(x - 6, 226, 23, 8, '#473f2d');
    px(x - 6, 226, 23, 2, '#bb995e');
    for (let y = 28; y < 226; y += 27) px(x + 4, y, 2, 17, '#423a2a');
  }
  px(0, 239, 640, 181, material === 'deep' ? '#222832' : '#39372c');
  let y = 240;
  for (let row = 0; row < 9; row++) {
    const h = 12 + row * 2,
      w = 58 + row * 11;
    for (let x = -w + ((row % 2) * w) / 2; x < 640; x += w) {
      const tone = (((Math.floor(x / w) + row + 32) % 4) + 4) % 4,
        colors =
          material === 'wood'
            ? ['#6b5237', '#76583a', '#604b34', '#7e6040']
            : material === 'pale'
              ? ['#56615a', '#626b60', '#4c5a55', '#697165']
              : material === 'deep'
                ? ['#303541', '#353b48', '#29313c', '#3c414d']
                : ['#565343', '#5e5947', '#4f5142', '#66604b'];
      px(x + 1, y, w - 2, h - 1, colors[tone]);
      px(x + 3, y + 1, w - 7, 1, material === 'deep' ? '#5a626b' : '#9a8a65');
      px(x + 5, y + h - 3, w - 12, 1, material === 'deep' ? '#1e2731' : '#353c32');
      if ((row + tone) % 3 === 0) {
        px(x + w * 0.42, y + 4, Math.min(22, w / 3), 1, colors[(tone + 2) % 4]);
        px(x + w - 8, y + 4, 1, 3, '#353930');
      }
    }
    y += h;
  }
  for (const x of [11, 623]) {
    px(x, 254, 6, 166, '#1d241e');
    px(x + 1, 255, 2, 160, '#62553a');
  }
  const p = SECRET_REGIONS[s.region] || SECRET_REGIONS.gate;
  px(48, 25, 24, 4, '#8e754d');
  px(53, 29, 14, 42, '#262d2b');
  px(54, 30, 12, 29, p.dark);
  px(58, 34, 4, 22, p.accent);
  poly(
    [
      [54, 59],
      [66, 59],
      [66, 71],
      [60, 66],
      [54, 71],
    ],
    p.dark
  );
  px(56, 32, 8, 1, p.hot);
}
function secretArtArch(c, x, y, w, h, stone = '#8d8063', inside = '#14242a') {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  poly(
    [
      [x, y + h],
      [x, y + 23],
      [x + 10, y + 23],
      [x + 10, y + 11],
      [x + 25, y + 11],
      [x + 25, y + 3],
      [x + 40, y + 3],
      [x + 40, y],
      [x + w - 40, y],
      [x + w - 40, y + 3],
      [x + w - 25, y + 3],
      [x + w - 25, y + 11],
      [x + w - 10, y + 11],
      [x + w - 10, y + 23],
      [x + w, y + 23],
      [x + w, y + h],
    ],
    stone
  );
  poly(
    [
      [x + 8, y + h],
      [x + 8, y + 28],
      [x + 18, y + 28],
      [x + 18, y + 17],
      [x + 31, y + 17],
      [x + 31, y + 10],
      [x + w - 31, y + 10],
      [x + w - 31, y + 17],
      [x + w - 18, y + 17],
      [x + w - 18, y + 28],
      [x + w - 8, y + 28],
      [x + w - 8, y + h],
    ],
    inside
  );
  px(x - 5, y + h - 2, w + 10, 7, '#aa9268');
  px(x - 3, y + h - 1, w + 6, 1, '#dbc18b');
  for (let yy = y + 36; yy < y + h - 4; yy += 22) {
    px(x + 1, yy, 6, 1, '#4e4d40');
    px(x + w - 7, yy, 6, 1, '#4e4d40');
    px(x + 1, yy + 1, 5, 1, '#b3a280');
    px(x + w - 6, yy + 1, 5, 1, '#a49c7b');
    if ((yy - y) % 3 === 0) {
      px(x + 3, yy + 7, 2, 3, '#5e6353');
      px(x + w - 5, yy + 12, 2, 2, '#5e6353');
    }
  }
  px(x, y + 28, 2, h - 31, '#b7a17a');
  px(x + w - 2, y + 28, 2, h - 31, '#424b42');
  px(x + 8, y + 28, 2, h - 30, '#0f1e20');
  px(x + w - 10, y + 28, 2, h - 30, '#0f1e20');
  px(x + 40, y, w - 80, 2, '#c8b48d');
  for (const xx of [x + w * 0.35, x + w * 0.65]) {
    px(xx, y + 2, 1, 7, '#51574b');
    px(xx + 1, y + 2, 1, 6, '#b9ad8a');
  }
  poly(
    [
      [x + w / 2 - 7, y],
      [x + w / 2 + 7, y],
      [x + w / 2 + 4, y + 14],
      [x + w / 2 - 4, y + 14],
    ],
    '#a99a76'
  );
  px(x + w / 2 - 5, y + 1, 10, 2, '#e0c99a');
  px(x + 25, y + 3, 15, 2, '#d0b685');
  px(x + w - 40, y + 3, 15, 2, '#b3a07a');
}
function secretArtRug(c, x, y, w, h, color = '#6b3b35', trim = '#bd9b66') {
  const poly = (p, col) => secretArtPoly(c, p, col),
    px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f);
  poly(
    [
      [x + 15, y],
      [x + w - 15, y],
      [x + w, y + h],
      [x, y + h],
    ],
    '#282b25'
  );
  poly(
    [
      [x + 18, y + 3],
      [x + w - 18, y + 3],
      [x + w - 5, y + h - 4],
      [x + 5, y + h - 4],
    ],
    trim
  );
  poly(
    [
      [x + 22, y + 6],
      [x + w - 22, y + 6],
      [x + w - 10, y + h - 8],
      [x + 10, y + h - 8],
    ],
    color
  );
  for (let i = 0; i < 7; i++) {
    const xx = x + 21 + ((w - 42) * i) / 6;
    px(xx, y + h - 3, 2, 7, i % 2 ? '#ae8d5b' : '#d2b17b');
  }
  for (const side of [-1, 1])
    for (let i = 0; i < 4; i++) {
      const xx = x + w / 2 + side * (w * 0.33 + i * 2),
        yy = y + 14 + (i * (h - 26)) / 4;
      poly(
        [
          [xx, yy - 3],
          [xx + 4, yy],
          [xx, yy + 3],
          [xx - 4, yy],
        ],
        trim
      );
    }
  for (let i = 0; i < Math.floor((w - 56) / 13); i++) {
    const xx = x + 29 + i * 13;
    px(xx, y + 9, 5, 1, trim);
    px(xx - 10, y + h - 12, 5, 1, trim);
  }
  c.save();
  c.globalAlpha = 0.12;
  for (let row = 0; row < h - 32; row += 7) {
    const inset = 27 - row * 0.11;
    px(x + inset, y + 18 + row, w - inset * 2, 1, trim);
  }
  c.restore();
}
function secretArtBooks(c, x, y, count, height = 27) {
  const colors = ['#775747', '#72847a', '#9a7c4c', '#4b6970', '#8a6c69', '#918b65'];
  let xx = x;
  for (let i = 0; i < count; i++) {
    const w = 5 + ((i * 7) % 6),
      h = height - ((i * 11) % 10);
    secretArtPixel(c, xx, y - h, w, h, '#242b26');
    secretArtPixel(c, xx + 1, y - h, w - 2, h - 1, colors[i % 6]);
    secretArtPixel(c, xx + 2, y - h + 2, 1, h - 4, '#c0aa7c');
    secretArtPixel(c, xx + 1, y - 5, w - 2, 1, '#c1a472');
    xx += w + 1;
  }
}
function secretArtShelf(c, x, y, w, h, kind = 'books') {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f);
  secretArtWood(c, x, y, w, h);
  px(x + 7, y + 9, w - 14, h - 17, '#1d2726');
  for (let row = 0; row < Math.floor((h - 18) / 41); row++) {
    const yy = y + 42 + row * 41;
    if (kind === 'books') secretArtBooks(c, x + 12, yy, Math.floor((w - 22) / 9), 28);
    else
      for (let i = 0; i < Math.floor((w - 20) / 23); i++)
        secretArtBottle(
          c,
          x + 20 + i * 23,
          yy - 1,
          ['#7fa29b', '#b1966d', '#7a858b', '#aaa478'][(i + row) % 4],
          (i + row) % 3
        );
    px(x + 5, yy, w - 10, 5, '#92734a');
    px(x + 6, yy, w - 12, 1, '#d0a875');
    px(x + 6, yy + 5, w - 12, 2, '#101d1d');
  }
  px(x - 3, y - 4, w + 6, 6, '#aa895a');
  px(x - 1, y - 4, w + 2, 1, '#ddbb81');
  px(x + 4, y + h - 4, w - 8, 3, '#bb975e');
}
function secretArtBottle(c, x, y, color = '#8faea2', kind = 0) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f);
  px(x - 3, y - 24, 6, 5, '#bda471');
  px(x - 2, y - 19, 4, 5, color);
  secretArtPoly(
    c,
    [
      [-6 + x, y - 15],
      [-8 + x, y - 10],
      [-7 + x, y - 2],
      [-4 + x, y],
      [5 + x, y],
      [8 + x, y - 3],
      [8 + x, y - 10],
      [5 + x, y - 15],
    ],
    '#263a39'
  );
  px(x - 6, y - 12, 12, 10, color);
  px(x - 5, y - 11, 2, 8, '#d7e5c8');
  px(x + 4, y - 9, 1, 7, '#42605c');
  px(x - 4, y - 3, 8, 1, '#455a4a');
  if (kind === 1) {
    px(x - 3, y - 11, 7, 7, '#b6aa7a');
    px(x - 2, y - 9, 5, 1, '#6c664e');
  }
  if (kind === 2) {
    px(x - 4, y - 7, 9, 2, '#d9d6a1');
    px(x - 1, y - 10, 2, 8, '#e6e1b4');
  }
}
function secretArtChest(c, x, y, w = 110, open = false) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtOval(c, x + w / 2, y + 49, w * 0.62, 10, '#20251f');
  secretArtWood(c, x, y + 7, w, 39);
  px(x + 3, y + 7, w - 6, 5, '#a78850');
  for (const xx of [x + 10, x + w - 20]) {
    px(xx, y + 10, 10, 34, '#b19558');
    px(xx + 1, y + 12, 2, 29, '#e3c681');
    px(xx + 7, y + 12, 2, 29, '#635439');
  }
  for (const xx of [x + 12, x + w - 18])
    for (const yy of [y + 14, y + 37]) px(xx, yy, 3, 3, '#3b3f32');
  if (open) {
    poly(
      [
        [x, y + 5],
        [x + 4, y - 28],
        [x + w - 5, y - 28],
        [x + w, y + 5],
      ],
      '#322c22'
    );
    poly(
      [
        [x + 5, y],
        [x + 8, y - 24],
        [x + w - 9, y - 24],
        [x + w - 5, y],
      ],
      '#9c7b46'
    );
    px(x + 11, y - 21, w - 23, 16, '#463d2b');
    px(x + 12, y - 21, w - 25, 2, '#c0a164');
    px(x + 4, y + 4, w - 8, 10, '#25291d');
    for (let i = 0; i < 16; i++) {
      const xx = x + 8 + ((i * 17) % (w - 20)),
        yy = y + 5 + ((i * 7) % 6);
      px(xx, yy, 7, 3, i % 3 ? '#c6a657' : '#ffe0a0');
      px(xx + 1, yy, 4, 1, '#f5d58b');
    }
  } else {
    poly(
      [
        [x, y + 9],
        [x + 1, y - 5],
        [x + 8, y - 13],
        [x + w - 8, y - 13],
        [x + w - 1, y - 5],
        [x + w, y + 9],
      ],
      '#3f3527'
    );
    px(x + 6, y - 10, w - 12, 4, '#af8950');
    px(x + 3, y - 5, w - 6, 10, '#85653d');
    px(x + 4, y - 4, w - 8, 1, '#d4b16b');
    for (const xx of [x + 10, x + w - 20]) {
      px(xx, y - 10, 10, 18, '#b99a5e');
      px(xx + 1, y - 9, 2, 16, '#e3c681');
    }
  }
  px(x + w / 2 - 7, y + 12, 14, 18, '#342f22');
  px(x + w / 2 - 5, y + 12, 10, 14, '#d5b467');
  px(x + w / 2 - 2, y + 16, 4, 5, '#474833');
  px(x + w / 2 - 1, y + 20, 2, 4, '#3a3e2d');
  px(x + 2, y + 44, w - 4, 3, '#c2a369');
  px(x + 9, y + 47, 9, 5, '#4b402a');
  px(x + w - 19, y + 47, 9, 5, '#4b402a');
}
function secretArtCrate(c, x, y, w = 59, h = 48) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f);
  secretArtWood(c, x, y, w, h);
  px(x + 4, y + 3, 5, h - 6, '#a58351');
  px(x + w - 9, y + 3, 5, h - 6, '#8a734d');
  secretArtLine(c, x + 9, y + 7, x + w - 12, y + h - 8, '#382f24', 7);
  secretArtLine(c, x + 9, y + 5, x + w - 12, y + h - 10, '#a38251', 4);
  for (const xx of [x + 5, x + w - 8])
    for (const yy of [y + 5, y + h - 7]) px(xx, yy, 2, 2, '#2b3026');
}
function secretArtPlant(c, x, y, size = 1) {
  c.save();
  c.translate(x, y);
  c.scale(size, size);
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  poly(
    [
      [-13, -2],
      [14, -2],
      [10, 16],
      [-9, 16],
    ],
    '#5f5440'
  );
  px(-14, -4, 29, 5, '#a0855c');
  px(-10, 0, 2, 11, '#c1a173');
  px(-8, 14, 17, 2, '#453e32');
  for (let i = 0; i < 7; i++) {
    const side = i % 2 ? 1 : -1,
      xx = side * (7 + ((i * 5) % 11)),
      yy = -14 - i * 5;
    secretArtLine(c, 0, -3, xx, yy, '#596948', 2);
    poly(
      [
        [xx, yy + 3],
        [xx - 8, yy],
        [xx - 10, yy - 6],
        [xx - 3, yy - 6],
        [xx + 5, yy],
      ],
      i % 2 ? '#8a9e68' : '#69855d'
    );
    px(xx - 6, yy - 3, 6, 1, '#b2b37b');
  }
  c.restore();
}
function secretArtCandle(c, x, y, t, height = 20, cold = false) {
  secretArtPixel(c, x - 6, y, 13, 3, '#b6975d');
  secretArtPixel(c, x - 3, y - height, 7, height, cold ? '#c0d4cb' : '#d7c99d');
  secretArtPixel(c, x - 2, y - height + 1, 2, height - 3, '#f8e8b7');
  secretArtPixel(c, x + 3, y - height + 5, 1, 9, '#8d8a6a');
  secretArtFlame(c, x, y - height - 1, t, 0.35, cold);
}
function secretArtPillar(c, x, y, h = 180, pale = false) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f);
  px(x - 17, y - h, 34, 10, '#3c4239');
  px(x - 19, y - h - 4, 38, 5, pale ? '#adba9e' : '#ad9365');
  px(x - 12, y - h + 10, 24, h - 14, pale ? '#6e817a' : '#68634e');
  px(x - 10, y - h + 12, 4, h - 19, pale ? '#abb4a0' : '#a49770');
  px(x + 6, y - h + 12, 4, h - 19, '#3b4841');
  px(x - 15, y - 8, 30, 8, pale ? '#94a28d' : '#9c8a61');
  px(x - 21, y - 2, 42, 7, '#343e36');
  px(x - 21, y - 2, 42, 2, pale ? '#bcc3a8' : '#baa475');
}
function secretArtCrystal(c, x, y, size = 1, color = 'gold') {
  const shades =
    color === 'blue'
      ? ['#3f697b', '#76b3c0', '#c2ebdf', '#f3f4cc']
      : color === 'green'
        ? ['#41614e', '#8ca76c', '#cadb94', '#f1ebba']
        : color === 'rose'
          ? ['#654e67', '#b3839b', '#e5b8bc', '#fff0d0']
          : ['#72522f', '#c5914e', '#f3cf7c', '#fff0bc'];
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.scale(size, size);
  secretArtPoly(
    c,
    [
      [0, -24],
      [12, -9],
      [10, 12],
      [0, 22],
      [-11, 11],
      [-12, -7],
    ],
    '#1d2a2b'
  );
  secretArtPoly(
    c,
    [
      [0, -21],
      [9, -8],
      [8, 10],
      [0, 18],
      [-8, 9],
      [-9, -7],
    ],
    shades[0]
  );
  secretArtPoly(
    c,
    [
      [0, -21],
      [1, 2],
      [-8, 9],
      [-9, -7],
    ],
    shades[1]
  );
  secretArtPoly(
    c,
    [
      [0, -21],
      [9, -8],
      [1, 2],
    ],
    shades[2]
  );
  secretArtPoly(
    c,
    [
      [1, 2],
      [8, 10],
      [0, 18],
    ],
    shades[1]
  );
  secretArtPixel(c, -1, -16, 2, 12, shades[3]);
  c.restore();
}
function secretArtBrazier(c, x, y, t, scale = 1, cold = false) {
  c.save();
  c.translate(x, y);
  c.scale(scale, scale);
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f);
  secretArtOval(c, 0, 8, 21, 5, '#20291f');
  px(-6, -3, 12, 13, '#84754c');
  px(-12, 7, 24, 4, '#a88c55');
  secretArtPoly(
    c,
    [
      [-22, -21],
      [22, -21],
      [15, -5],
      [-15, -5],
    ],
    '#4c4d39'
  );
  px(-22, -22, 44, 4, '#ba9b60');
  px(-19, -21, 38, 1, '#f3ce87');
  px(-13, -17, 3, 8, '#9c8552');
  px(10, -17, 3, 8, '#9c8552');
  secretArtFlame(c, 0, -22, t, 1, cold);
  c.restore();
}
function secretArtCoins(c, x, y, count = 20) {
  for (let i = 0; i < count; i++) {
    const xx = x + ((i * 29) % 72),
      yy = y + ((i * 13) % 24);
    secretArtPixel(c, xx, yy, 7, 3, i % 3 ? '#bd9351' : '#ebc476');
    secretArtPixel(c, xx + 1, yy, 5, 1, '#ffdfa1');
    secretArtPixel(c, xx + 2, yy + 3, 4, 1, '#6a603a');
  }
}
function secretArtCache(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f);
  secretArtRoom(c, s);
  secretArtArch(c, 192, 35, 256, 187, '#8d7b56', '#292d26');
  for (let x = 212; x < 435; x += 16) {
    px(x, 57, 4, 146, '#4c5140');
    px(x + 1, 59, 1, 143, '#9c9461');
  }
  for (let y = 72; y < 196; y += 40) px(208, y, 224, 4, '#787552');
  secretArtShelf(c, 62, 68, 101, 158, 'bottles');
  secretArtShelf(c, 480, 69, 96, 158, 'bottles');
  secretArtCrate(c, 40, 274, 73, 54);
  secretArtCrate(c, 51, 238, 57, 36);
  secretArtCrate(c, 518, 273, 77, 55);
  secretArtCrate(c, 542, 235, 46, 36);
  secretArtRug(c, 187, 283, 266, 109, '#664b31', '#b69b5f');
  for (const step of [
    [226, 269, 190, 17],
    [237, 254, 168, 17],
    [249, 240, 145, 16],
  ]) {
    px(...step, '#393f31');
    px(step[0], step[1], step[2], 2, '#c3aa72');
    px(step[0] + 4, step[1] + 4, step[2] - 8, step[3] - 6, '#757152');
  }
  secretArtChest(c, 262, 199, 116, s.claimed);
  secretArtCoins(c, 180, 307, 24);
  secretArtCoins(c, 379, 314, 21);
  secretArtBottle(c, 163, 281, '#a8af82');
  secretArtBottle(c, 467, 302, '#93b5b0', 2);
  for (let i = 0; i < 5; i++) {
    px(126 + i * 13, 333 + (i % 2) * 4, 10, 7, '#a99360');
    px(127 + i * 13, 333 + (i % 2) * 4, 8, 1, '#e9cc88');
  }
}
function secretArtWorkshop(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'red');
  px(76, 22, 110, 103, '#493c31');
  px(89, 23, 83, 100, '#74634a');
  px(91, 25, 3, 96, '#a58c5a');
  for (let y = 33; y < 116; y += 18) px(94, y, 75, 1, '#3e392f');
  poly(
    [
      [63, 237],
      [63, 150],
      [75, 150],
      [75, 131],
      [89, 131],
      [89, 116],
      [171, 116],
      [171, 130],
      [187, 130],
      [187, 148],
      [199, 148],
      [199, 237],
    ],
    '#7f7355'
  );
  secretArtArch(c, 78, 142, 106, 92, '#b4925f', '#271d18');
  px(89, 215, 84, 6, '#da8743');
  px(87, 228, 90, 9, '#4b3b29');
  secretArtWood(c, 252, 44, 263, 117);
  px(260, 52, 247, 99, '#363b32');
  for (let x = 269; x < 502; x += 10) for (let y = 59; y < 148; y += 10) px(x, y, 1, 1, '#867a52');
  for (let i = 0; i < 7; i++) {
    const x = 277 + i * 32,
      y = 77 + (i % 2) * 12;
    px(x, y, 3, 46 - (i % 3) * 7, '#c7b486');
    px(x - 4, y - 3, 11, 4, '#5b685b');
    if (i % 3 === 0) {
      px(x - 10, y + 3, 23, 8, '#89968a');
      px(x - 9, y + 3, 20, 2, '#d3c8a0');
    } else if (i % 3 === 1) {
      px(x - 6, y + 30, 15, 5, '#bac1a1');
      px(x - 5, y + 26, 4, 11, '#7c8b7b');
    } else {
      px(x - 5, y, 12, 23, '#99865a');
      px(x - 3, y + 2, 7, 17, '#293d3c');
    }
  }
  secretArtWood(c, 220, 208, 328, 29, true);
  px(232, 237, 15, 71, '#645033');
  px(521, 237, 15, 71, '#493f2a');
  px(246, 269, 274, 9, '#776447');
  px(247, 269, 270, 2, '#a58d59');
  secretArtCrate(c, 271, 247, 70, 48);
  secretArtCrate(c, 355, 250, 58, 43);
  secretArtBottle(c, 509, 207, '#7fb4bc', 2);
  px(277, 197, 83, 10, '#53615a');
  px(287, 187, 62, 11, '#9aa28b');
  px(295, 173, 48, 14, '#b9c0a0');
  px(290, 171, 58, 5, '#e1d3ab');
  secretArtCrystal(c, 316, 166, 0.72, 'gold');
  px(431, 188, 32, 16, '#827b57');
  px(434, 186, 26, 4, '#c9b47b');
  px(440, 180, 14, 7, '#3e5956');
  for (let i = 0; i < 3; i++)
    secretArtBottle(c, 235 + i * 18, 205, ['#929a6b', '#ae8c67', '#a2b9b0'][i], i);
  for (let i = 0; i < 6; i++) {
    const x = 568 + (i % 2) * 12,
      y = 72 + i * 25;
    px(x, y, 4, 17, '#746d4b');
    px(x - 5, y + 7, 14, 3, '#b29660');
  }
  secretArtOval(c, 487, 334, 39, 18, '#292f27');
  secretArtOval(c, 487, 330, 36, 16, '#94855d');
  secretArtOval(c, 487, 330, 29, 11, '#30433f');
  secretArtCrate(c, 68, 317, 73, 57);
  secretArtWood(c, 219, 343, 105, 15);
  px(228, 359, 8, 27, '#615139');
  px(306, 359, 8, 27, '#615139');
  poly(
    [
      [361, 303],
      [366, 282],
      [385, 278],
      [398, 286],
      [402, 306],
    ],
    '#8c805b'
  );
  px(367, 286, 26, 15, '#263c3c');
  px(371, 289, 4, 8, '#9eada0');
}
function secretArtQuiet(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'pale');
  secretArtArch(c, 235, 35, 197, 160, '#9ba38b', '#183c3e');
  px(252, 68, 164, 116, '#294b49');
  px(254, 69, 161, 32, '#4d6b63');
  px(254, 102, 161, 40, '#3d5e59');
  secretArtOval(c, 371, 83, 17, 17, '#c3d0b0');
  secretArtOval(c, 377, 78, 17, 17, '#4d6b63');
  for (let i = 0; i < 11; i++) {
    const x = 251 + i * 16,
      y = 130 + (i % 4) * 10;
    poly(
      [
        [x - 12, 184],
        [x, y - 23],
        [x + 13, 184],
      ],
      '#274c47'
    );
    poly(
      [
        [x - 9, 182],
        [x, y - 12],
        [x + 10, 182],
      ],
      '#365e50'
    );
  }
  px(330, 55, 4, 131, '#8a987a');
  px(246, 119, 174, 4, '#b7b58d');
  px(246, 119, 174, 1, '#e2d4a8');
  secretArtWood(c, 59, 173, 136, 27);
  px(65, 200, 123, 36, '#626f5a');
  px(62, 184, 130, 6, '#b2b490');
  px(65, 169, 125, 12, '#d0c9a2');
  px(67, 171, 120, 2, '#e8dfb5');
  px(76, 155, 40, 17, '#a1b8a7');
  px(79, 157, 35, 2, '#e5e6c3');
  poly(
    [
      [119, 175],
      [191, 175],
      [192, 219],
      [177, 226],
      [159, 220],
      [143, 225],
      [127, 216],
    ],
    '#799995'
  );
  px(122, 178, 66, 2, '#b1c5b3');
  for (let i = 0; i < 5; i++) px(134 + i * 11, 185, 2, 26, '#5c7a75');
  secretArtRug(c, 191, 265, 272, 114, '#48645b', '#a6b18a');
  secretArtPoly(
    c,
    [
      [325, 311],
      [345, 327],
      [337, 347],
      [325, 357],
      [314, 345],
      [306, 327],
    ],
    '#95aa87'
  );
  secretArtPoly(
    c,
    [
      [325, 316],
      [337, 328],
      [332, 344],
      [325, 352],
      [318, 342],
      [314, 329],
    ],
    '#567966'
  );
  secretArtLine(c, 325, 319, 325, 349, '#c5cda0');
  secretArtLine(c, 318, 328, 325, 335, '#aab88c');
  secretArtLine(c, 332, 336, 325, 342, '#aab88c');
  secretArtOval(c, 333, 274, 84, 29, '#2d3d33');
  secretArtOval(c, 333, 268, 79, 27, '#84977e');
  secretArtOval(c, 333, 266, 69, 21, '#a7b49a');
  secretArtOval(c, 333, 263, 61, 17, '#426963');
  secretArtOval(c, 333, 263, 51, 12, '#729d8c');
  for (const x of [52, 205, 470, 575]) secretArtPlant(c, x, 234, x === 470 ? 1.5 : 1);
  secretArtWood(c, 476, 143, 103, 70);
  secretArtBooks(c, 485, 177, 9, 26);
  px(480, 178, 95, 5, '#b49562');
  px(487, 216, 7, 28, '#71583e');
  px(563, 216, 7, 28, '#71583e');
  secretArtBottle(c, 505, 143, '#aec6b1', 2);
  secretArtBottle(c, 549, 143, '#c2b48d');
  for (let i = 0; i < 9; i++) {
    const x = 205 + i * 27;
    secretArtLine(c, x, 22, x + 8, 45 + (i % 3) * 7, '#456848', 2);
    poly(
      [
        [x + 5, 39],
        [x + 13, 34],
        [x + 17, 39],
        [x + 12, 44],
      ],
      '#8ba578'
    );
  }
  secretArtOval(c, 122, 303, 38, 10, '#2f3c30');
  px(97, 282, 51, 16, '#9c9b74');
  px(102, 280, 41, 3, '#ddd1a3');
  px(111, 275, 9, 7, '#bb8c68');
  poly(
    [
      [501, 291],
      [543, 291],
      [553, 320],
      [497, 320],
    ],
    '#9b9c76'
  );
  px(504, 294, 36, 2, '#d5d3a5');
}
function secretArtShrine(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'red');
  secretArtArch(c, 172, 28, 296, 208, '#a28a60', '#2a2b24');
  for (const x of [90, 550]) secretArtPillar(c, x, 256, 192);
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI + (i * Math.PI) / 6,
      x = 320 + Math.cos(a) * 99,
      y = 149 + Math.sin(a) * 88;
    secretArtLine(c, 320, 149, x, y, '#6d6644', 5);
    secretArtPoly(
      c,
      [
        [x, y - 9],
        [x + 6, y],
        [x, y + 9],
        [x - 6, y],
      ],
      '#c8aa66'
    );
    px(x - 1, y - 4, 2, 8, '#f0d89b');
  }
  secretArtOval(c, 320, 148, 48, 48, '#665b3d', 4);
  secretArtOval(c, 320, 148, 42, 42, '#c4a86c', 2);
  secretArtRug(c, 174, 270, 292, 130, '#743b32', '#c29c61');
  secretArtPoly(
    c,
    [
      [320, 305],
      [339, 330],
      [336, 350],
      [320, 367],
      [305, 354],
      [300, 339],
      [310, 325],
      [312, 339],
      [319, 330],
    ],
    '#c29c61'
  );
  secretArtPoly(
    c,
    [
      [320, 321],
      [330, 337],
      [329, 350],
      [320, 358],
      [312, 350],
      [311, 341],
      [317, 335],
    ],
    '#743b32'
  );
  for (let i = 0; i < 4; i++) {
    const x = 216 + i * 8,
      y = 271 - i * 15,
      w = 208 - i * 16;
    px(x, y, w, 15, '#766b4c');
    px(x, y, w, 2, '#d7b87d');
    px(x + 3, y + 5, w - 6, 7, '#95815a');
  }
  poly(
    [
      [268, 201],
      [372, 201],
      [365, 224],
      [277, 224],
    ],
    '#8e754b'
  );
  px(262, 197, 116, 7, '#d0ad6a');
  px(265, 198, 110, 1, '#ffe0a0');
  px(280, 224, 82, 9, '#665b3d');
  px(308, 207, 24, 15, '#b89656');
  poly(
    [
      [320, 208],
      [326, 214],
      [320, 220],
      [314, 214],
    ],
    '#f4d58e'
  );
  for (const x of [144, 185, 455, 496]) {
    const y = x === 144 || x === 496 ? 272 : 234;
    px(x - 13, y, 26, 7, '#85734d');
    px(x - 4, y - 29, 8, 29, '#9f8d5f');
    px(x - 14, y - 31, 28, 5, '#d0b37a');
  }
  secretArtPlant(c, 64, 327, 1.4);
  secretArtPlant(c, 578, 328, 1.4);
  for (let i = 0; i < 8; i++) {
    const x = 94 + i * 63,
      y = 334 + (i % 2) * 23;
    px(x - 8, y, 17, 5, '#6e5b3e');
    px(x - 6, y - 5, 13, 5, '#bfa475');
    px(x - 5, y - 7, 11, 2, '#e6c990');
  }
}
function secretArtTrial(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'red');
  secretArtArch(c, 204, 32, 232, 202, '#887958', '#1a2829');
  for (let x = 225; x < 420; x += 16) {
    px(x, 65, 7, 164, '#45534d');
    px(x + 1, 67, 2, 159, '#a09c76');
  }
  for (const y of [101, 171, 213]) {
    px(222, y, 199, 8, '#665f44');
    px(223, y, 197, 1, '#d0b47c');
  }
  px(302, 134, 36, 42, '#c0a468');
  px(307, 139, 26, 32, '#574f38');
  poly(
    [
      [320, 143],
      [331, 154],
      [320, 166],
      [309, 154],
    ],
    '#d6be83'
  );
  for (const x of [114, 526]) {
    secretArtPillar(c, x, 263, 207);
    px(x - 21, 50, 42, 8, '#5a5039');
    px(x - 18, 50, 36, 2, '#c09e62');
  }
  for (const side of [-1, 1]) {
    const x = side < 0 ? 148 : 465;
    for (let i = 0; i < 10; i++) {
      const xx = x + side * i * 2,
        yy = 30 + i * 11;
      secretArtOval(c, xx, yy, 4, 7, '#7a7b63', 2);
    }
    poly(
      [
        [x - 18, 141],
        [x + 20, 141],
        [x + 15, 210],
        [x, 202],
        [x - 15, 210],
      ],
      '#784b37'
    );
    px(x - 14, 144, 26, 2, '#c29a60');
    poly(
      [
        [x, 160],
        [x + 8, 172],
        [x, 184],
        [x - 8, 172],
      ],
      '#ceab71'
    );
  }
  secretArtOval(c, 320, 320, 167, 63, '#2d3430');
  secretArtOval(c, 320, 316, 162, 61, '#ab9563', 3);
  secretArtOval(c, 320, 316, 151, 55, '#65684e', 3);
  secretArtOval(c, 320, 316, 115, 41, '#c4b17c', 2);
  secretArtOval(c, 320, 316, 102, 36, '#494f3e');
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    secretArtLine(
      c,
      320 + Math.cos(a) * 120,
      316 + Math.sin(a) * 43,
      320 + Math.cos(a) * 146,
      316 + Math.sin(a) * 54,
      '#c6ac75',
      2
    );
  }
  poly(
    [
      [320, 281],
      [350, 316],
      [320, 351],
      [290, 316],
    ],
    '#9a8356'
  );
  poly(
    [
      [320, 290],
      [341, 316],
      [320, 342],
      [299, 316],
    ],
    '#383e31'
  );
  for (const x of [61, 579]) {
    px(x - 12, 276, 24, 58, '#66654c');
    px(x - 18, 330, 36, 7, '#aa925f');
  }
}
function secretArtWager(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'wood');
  px(90, 29, 460, 8, '#b29359');
  px(93, 29, 454, 2, '#e0c080');
  for (const side of [-1, 1]) {
    const x = side < 0 ? 92 : 468;
    poly(
      [
        [x, 38],
        [x + 78, 38],
        [x + 63, 104],
        [x + 43, 147],
        [x + 35, 233],
        [x - 2, 233],
      ],
      '#703c38'
    );
    for (let i = 0; i < 6; i++)
      px(x + 5 + i * 10, 40, 3, 73 + i * 7, i % 2 ? '#935649' : '#4c3030');
    px(x - 2, 143, 53, 7, '#b49a60');
    px(x + 2, 145, 44, 2, '#e2c483');
  }
  secretArtOval(c, 320, 123, 81, 81, '#2d2d25');
  secretArtOval(c, 320, 123, 77, 77, '#b49456');
  secretArtOval(c, 320, 123, 71, 71, '#434536');
  secretArtOval(c, 320, 123, 62, 62, '#d1b06f');
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8,
      b = ((i + 1) * Math.PI) / 8;
    poly(
      [
        [320, 123],
        [320 + Math.cos(a) * 59, 123 + Math.sin(a) * 59],
        [320 + Math.cos(b) * 59, 123 + Math.sin(b) * 59],
      ],
      i % 2 ? '#7b4940' : '#375a51'
    );
    secretArtLine(
      c,
      320 + Math.cos(a) * 21,
      123 + Math.sin(a) * 21,
      320 + Math.cos(a) * 58,
      123 + Math.sin(a) * 58,
      '#c8aa6d'
    );
    px(
      320 + Math.cos(a + Math.PI / 16) * 66 - 1,
      123 + Math.sin(a + Math.PI / 16) * 66 - 1,
      3,
      3,
      '#f3d89b'
    );
  }
  secretArtOval(c, 320, 123, 21, 21, '#b89a5c');
  secretArtOval(c, 320, 123, 13, 13, '#e1c789');
  poly(
    [
      [313, 40],
      [327, 40],
      [320, 58],
    ],
    '#f2d88b'
  );
  secretArtRug(c, 146, 290, 348, 101, '#713e36', '#c6a675');
  secretArtOval(c, 320, 276, 156, 42, '#262c25');
  secretArtOval(c, 320, 267, 154, 39, '#9f7845');
  secretArtOval(c, 320, 265, 145, 33, '#c5a46b');
  secretArtOval(c, 320, 264, 137, 28, '#3a6254');
  px(203, 293, 13, 54, '#655035');
  px(422, 293, 13, 54, '#655035');
  for (const x of [255, 320, 385]) {
    px(x - 14, 247, 29, 28, '#8f9b73');
    px(x - 13, 248, 27, 25, '#d8cb9d');
    px(x - 9, 253, 19, 14, '#7e8e66');
    poly(
      [
        [x, 254],
        [x + 5, 260],
        [x, 266],
        [x - 5, 260],
      ],
      '#e7d8ae'
    );
  }
  secretArtCoins(c, 173, 274, 18);
  secretArtCoins(c, 393, 273, 16);
  px(348, 237, 18, 16, '#e1d5aa');
  px(351, 240, 3, 3, '#735643');
  px(359, 247, 3, 3, '#735643');
  px(376, 228, 17, 17, '#baa97f');
  for (const [xx, yy] of [
    [379, 231],
    [386, 231],
    [382, 236],
    [379, 241],
    [386, 241],
  ])
    px(xx, yy, 2, 2, '#70513c');
  secretArtShelf(c, 42, 79, 98, 139, 'bottles');
  secretArtShelf(c, 500, 79, 98, 139, 'bottles');
  for (const x of [104, 538]) {
    secretArtOval(c, x, 323, 29, 11, '#242b24');
    secretArtOval(c, x, 317, 28, 11, '#866148');
    secretArtOval(c, x, 314, 24, 9, '#a97856');
    px(x - 19, 326, 6, 29, '#6d5939');
    px(x + 13, 326, 6, 29, '#6d5939');
  }
}
function secretArtEcho(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'pale');
  secretArtArch(c, 164, 24, 312, 209, '#93a599', '#192e37');
  for (let i = 0; i < 15; i++) {
    const x = 181 + i * 20;
    px(x, 57, 1, 143, '#314b51');
    px(x + 4, 78 + ((i * 23) % 91), 1, 1, '#96b9bd');
  }
  for (const x of [103, 537]) secretArtPillar(c, x, 257, 197, true);
  for (const x of [54, 480]) {
    px(x, 138, 108, 60, '#344c4d');
    px(x + 3, 141, 102, 54, '#668080');
    px(x + 7, 145, 94, 45, '#aabcb0');
    for (let i = 0; i < 6; i++)
      px(x + 13 + (i % 2) * 5, 151 + i * 6, 72 - ((i * 13) % 32), 1, '#657e7b');
    px(x + 3, 198, 103, 5, '#9caa8b');
  }
  secretArtRug(c, 179, 287, 282, 111, '#3e6268', '#a5bca7');
  secretArtOval(c, 320, 351, 39, 16, '#a5bca7', 1);
  secretArtOval(c, 320, 351, 27, 10, '#a5bca7', 1);
  secretArtPoly(
    c,
    [
      [320, 334],
      [325, 351],
      [320, 369],
      [315, 351],
    ],
    '#b9ceae'
  );
  secretArtOval(c, 320, 280, 116, 43, '#263b3c');
  secretArtOval(c, 320, 274, 112, 43, '#8b9e92');
  secretArtOval(c, 320, 271, 103, 37, '#bcc4a7');
  secretArtOval(c, 320, 268, 93, 32, '#2e5260');
  secretArtOval(c, 320, 265, 82, 27, '#457789');
  for (let i = 0; i < 7; i++) {
    const a = (i * Math.PI * 2) / 7,
      x = 320 + Math.cos(a) * 112,
      y = 274 + Math.sin(a) * 43;
    px(x - 5, y - 11, 10, 11, '#8eaaa3');
    px(x - 6, y - 12, 12, 2, '#d6dfbd');
  }
  poly(
    [
      [306, 201],
      [308, 150],
      [313, 150],
      [313, 133],
      [319, 125],
      [325, 133],
      [325, 150],
      [332, 150],
      [334, 201],
    ],
    '#688e96'
  );
  px(314, 150, 12, 43, '#adc9c7');
  px(318, 140, 4, 47, '#e8efda');
  for (const x of [69, 572]) {
    secretArtPlant(c, x, 309, 1.2);
    px(x - 16, 314, 32, 2, '#adbba0');
  }
  for (let i = 0; i < 10; i++) {
    const x = 130 + i * 42,
      y = 366 + (i % 3) * 8;
    px(x, y, 18, 6, '#9caea2');
    px(x + 1, y, 16, 1, '#d7dec0');
    px(x + 5, y - 4, 9, 4, '#789e9d');
  }
}
function secretArtMap(c, x, y, w, h) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtWood(c, x - 7, y - 7, w + 14, h + 14);
  px(x, y, w, h, '#bda77b');
  px(x + 2, y + 2, w - 4, h - 4, '#d0bc8e');
  px(x + 3, y + 3, w - 6, 1, '#eee0b4');
  for (let i = 0; i < 5; i++) {
    const xx = x + 12 + ((i * 37) % (w - 37)),
      yy = y + 12 + ((i * 23) % (h - 28));
    poly(
      [
        [xx, yy],
        [xx + 16, yy - 8],
        [xx + 32, yy + 2],
        [xx + 23, yy + 17],
        [xx + 5, yy + 14],
      ],
      '#aaa17a'
    );
    for (let j = 0; j < 3; j++)
      poly(
        [
          [xx + j * 10, yy + 6],
          [xx + 5 + j * 10, yy - 3],
          [xx + 10 + j * 10, yy + 6],
        ],
        '#7d8267'
      );
  }
  const route = [
    [0.08, 0.75],
    [0.24, 0.72],
    [0.24, 0.47],
    [0.42, 0.47],
    [0.42, 0.24],
    [0.64, 0.24],
    [0.64, 0.62],
    [0.85, 0.62],
    [0.85, 0.36],
  ];
  for (let i = 1; i < route.length; i++)
    secretArtLine(
      c,
      x + route[i - 1][0] * w,
      y + route[i - 1][1] * h,
      x + route[i][0] * w,
      y + route[i][1] * h,
      '#93684a',
      2
    );
  for (let i = 0; i < route.length; i += 2) {
    const xx = x + route[i][0] * w,
      yy = y + route[i][1] * h;
    px(xx - 4, yy - 4, 9, 9, '#6d7966');
    px(xx - 2, yy - 2, 5, 5, '#dec99c');
  }
  secretArtLine(c, x + w - 24, y + 8, x + w - 24, y + 29, '#766846');
  secretArtLine(c, x + w - 32, y + 19, x + w - 16, y + 19, '#766846');
  poly(
    [
      [x + w - 24, y + 6],
      [x + w - 20, y + 17],
      [x + w - 24, y + 14],
      [x + w - 28, y + 17],
    ],
    '#705b3e'
  );
  px(x + 6, y + 6, 3, 3, '#6c6350');
  px(x + w - 9, y + h - 9, 3, 3, '#6c6350');
}
function secretArtCartographer(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'wood');
  secretArtMap(c, 196, 44, 253, 146);
  secretArtShelf(c, 59, 74, 98, 146);
  secretArtShelf(c, 489, 72, 93, 148);
  for (let i = 0; i < 4; i++) {
    const x = 69 + i * 18;
    px(x, 229, 11, 36, '#bfb28c');
    px(x + 2, 231, 2, 31, '#e4d7aa');
    px(x, 247, 11, 3, '#927452');
  }
  secretArtRug(c, 175, 286, 306, 111, '#59654f', '#b6a06d');
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4,
      x = 326 + Math.cos(a) * (i % 2 ? 30 : 46),
      y = 348 + Math.sin(a) * (i % 2 ? 13 : 22);
    poly(
      [
        [326, 348],
        [x + Math.sin(a) * 4, y - Math.cos(a) * 2],
        [x, y],
        [x - Math.sin(a) * 4, y + Math.cos(a) * 2],
      ],
      i % 2 ? '#8f9268' : '#c8b680'
    );
  }
  secretArtOval(c, 326, 348, 15, 6, '#c8b680', 1);
  poly(
    [
      [194, 225],
      [425, 225],
      [451, 270],
      [176, 270],
    ],
    '#42392a'
  );
  poly(
    [
      [196, 221],
      [424, 221],
      [448, 263],
      [180, 263],
    ],
    '#a07b4d'
  );
  secretArtLine(c, 199, 224, 422, 224, '#d5b07b', 2);
  px(188, 268, 12, 72, '#675236');
  px(426, 268, 12, 72, '#675236');
  poly(
    [
      [225, 229],
      [367, 229],
      [380, 253],
      [217, 253],
    ],
    '#d6c59a'
  );
  poly(
    [
      [228, 231],
      [361, 231],
      [369, 248],
      [222, 248],
    ],
    '#c0b28b'
  );
  for (let i = 0; i < 6; i++) secretArtLine(c, 240 + i * 18, 234, 242 + i * 18, 245, '#8f997c');
  secretArtLine(c, 229, 244, 274, 240, '#805f43', 2);
  secretArtLine(c, 274, 240, 291, 245, '#805f43', 2);
  secretArtLine(c, 291, 245, 340, 235, '#805f43', 2);
  secretArtOval(c, 388, 242, 17, 8, '#d7b86f');
  secretArtOval(c, 388, 242, 12, 5, '#567569');
  secretArtLine(c, 388, 237, 388, 247, '#f3ddb0');
  px(398, 219, 14, 13, '#4a6360');
  px(400, 216, 10, 5, '#9fbdad');
  secretArtLine(c, 405, 220, 414, 198, '#bdc0a0', 2);
  secretArtOval(c, 533, 292, 40, 16, '#343c30');
  secretArtOval(c, 533, 280, 29, 29, '#879780');
  secretArtOval(c, 533, 280, 24, 24, '#b1c2a2');
  for (let i = -1; i <= 1; i++) secretArtOval(c, 533, 280, 7 + Math.abs(i) * 9, 23, '#6c8a7a', 1);
  secretArtOval(c, 533, 280, 24, 7, '#6c8a7a', 1);
  secretArtLine(c, 516, 251, 548, 307, '#ceb579', 2);
  px(526, 307, 14, 11, '#8f754e');
  px(513, 316, 41, 5, '#b89b63');
  secretArtCrate(c, 61, 304, 86, 61);
  secretArtMap(c, 66, 280, 71, 28);
  px(75, 267, 51, 12, '#bea77e');
  px(77, 269, 47, 2, '#ebd9ab');
  for (let i = 0; i < 3; i++) {
    const x = 474 + i * 31;
    px(x, 352, 24, 12, '#c1b18a');
    px(x + 2, 352, 20, 2, '#e4d7a9');
    px(x + 7, 353, 3, 10, '#96744d');
  }
}
function secretArtArmory(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'pale');
  secretArtArch(c, 216, 33, 208, 198, '#9b9b7b', '#1a343d');
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    secretArtLine(
      c,
      320 + Math.cos(a) * 28,
      132 + Math.sin(a) * 28,
      320 + Math.cos(a) * 76,
      132 + Math.sin(a) * 76,
      '#516e70',
      2
    );
  }
  secretArtOval(c, 320, 132, 73, 73, '#b6ad7d', 2);
  secretArtOval(c, 320, 132, 47, 47, '#6b8d8e', 2);
  secretArtOval(c, 320, 132, 34, 34, '#acc9bc', 1);
  for (const side of [-1, 1]) {
    const x = side < 0 ? 61 : 464;
    secretArtWood(c, x, 67, 114, 166);
    px(x + 8, 77, 98, 146, '#1a3037');
    for (let i = 0; i < 3; i++) {
      const y = 109 + i * 48;
      px(x + 11, y + 18, 92, 4, '#a99869');
      px(x + 12, y + 18, 90, 1, '#e1cba0');
      secretArtCrystal(c, x + 37, y, 0.48, ['blue', 'gold', 'green'][i]);
      secretArtCrystal(c, x + 78, y, 0.48, ['rose', 'blue', 'gold'][i]);
    }
    px(x + 54, 76, 4, 148, '#b6af82');
    px(x + 11, 80, 1, 136, '#93b1ac');
    px(x + 100, 82, 1, 135, '#55767a');
    for (let y = 91; y < 206; y += 32) secretArtLine(c, x + 12, y, x + 38, y - 12, '#436371');
  }
  secretArtRug(c, 189, 285, 262, 106, '#405b63', '#bcb789');
  secretArtOval(c, 320, 282, 89, 29, '#263a39');
  secretArtOval(c, 320, 277, 85, 28, '#818d76');
  secretArtOval(c, 320, 273, 76, 24, '#b5b58c');
  secretArtOval(c, 320, 270, 66, 20, '#486c70');
  px(297, 230, 46, 38, '#566e67');
  px(292, 224, 56, 8, '#c2c3a0');
  px(300, 235, 5, 29, '#9fae94');
  px(336, 235, 4, 29, '#354c49');
  secretArtCrystal(c, 320, 202, 1.4, 'blue');
  for (const x of [77, 562]) {
    px(x - 17, 315, 34, 31, '#5b6d61');
    px(x - 21, 310, 42, 6, '#acac7c');
    secretArtCrystal(c, x, 292, 0.62, x === 77 ? 'rose' : 'gold');
  }
  for (let i = 0; i < 5; i++) {
    const x = 240 + i * 40;
    poly(
      [
        [x, 352],
        [x + 12, 358],
        [x, 365],
        [x - 12, 358],
      ],
      '#adb48e'
    );
    px(x - 2, 355, 4, 6, '#46686d');
  }
}
function secretArtFalse(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s);
  secretArtWood(c, 43, 70, 179, 155);
  px(51, 79, 163, 133, '#242c28');
  secretArtBooks(c, 60, 122, 16, 31);
  px(48, 123, 169, 7, '#8c7049');
  px(49, 124, 166, 1, '#c1a272');
  secretArtBooks(c, 60, 171, 15, 31);
  px(48, 172, 169, 7, '#8c7049');
  px(49, 173, 166, 1, '#c1a272');
  secretArtArch(c, 252, 27, 293, 218, '#716d51', '#10292e');
  px(272, 63, 251, 166, '#1b3b3c');
  px(291, 82, 211, 148, '#315353');
  secretArtArch(c, 319, 88, 151, 141, '#8c9a7d', '#15343b');
  for (let i = 0; i < 4; i++) {
    const y = 203 + i * 16;
    px(283 - i * 7, y, 225 + i * 14, 16, '#6f8069');
    px(284 - i * 7, y, 223 + i * 14, 2, '#a2b48a');
    px(287 - i * 7, y + 13, 215 + i * 14, 2, '#324d42');
  }
  secretArtChest(c, 360, 174, 83, s.claimed);
  secretArtCoins(c, 358, 227, 14);
  const blocks = [
    [251, 38, 22, 30],
    [237, 72, 30, 28],
    [247, 107, 24, 31],
    [234, 144, 32, 29],
    [249, 183, 21, 43],
    [519, 47, 23, 33],
    [527, 83, 31, 31],
    [518, 120, 27, 32],
    [535, 158, 26, 35],
    [523, 199, 28, 39],
  ];
  for (const [x, y, w, h] of blocks) {
    px(x, y, w, h, '#505244');
    px(x + 1, y + 1, w - 3, 2, '#85816b');
    px(x + 3, y + h - 3, w - 6, 2, '#2b3830');
  }
  for (let i = 0; i < 16; i++) {
    const x = 238 + ((i * 71) % 324),
      y = 278 + ((i * 17) % 39),
      w = 8 + ((i * 7) % 20);
    poly(
      [
        [x, y],
        [x + w, y - 2],
        [x + w + 5, y + 7],
        [x + 3, y + 11],
      ],
      i % 2 ? '#74725a' : '#555a48'
    );
    px(x + 3, y, w - 2, 1, '#a29b75');
  }
  secretArtCrate(c, 41, 285, 77, 66);
  secretArtCrate(c, 124, 310, 57, 49);
  secretArtCrate(c, 537, 321, 66, 54);
  secretArtBottle(c, 76, 284, '#9c9f79');
  px(163, 252, 57, 7, '#b5a47c');
  px(170, 242, 42, 10, '#b4a077');
  px(168, 241, 44, 3, '#ddd0a5');
  poly(
    [
      [183, 209],
      [227, 205],
      [234, 253],
      [188, 259],
    ],
    '#55716c'
  );
  px(187, 214, 36, 1, '#98ac91');
}
function secretArtDeep(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'deep');
  secretArtArch(c, 118, 20, 404, 230, '#676f75', '#101d2c');
  px(140, 70, 360, 167, '#132837');
  px(142, 72, 356, 77, '#1a3140');
  for (let i = 0; i < 46; i++)
    px(
      151 + ((i * 73) % 338),
      50 + ((i * 41) % 153),
      1,
      i % 11 ? 1 : 2,
      i % 4 ? '#92b1ae' : '#f0dba3'
    );
  for (let i = 0; i < 10; i++) {
    const x = 146 + i * 36;
    poly(
      [
        [x - 17, 232],
        [x - 9, 147 + (i % 3) * 19],
        [x + 4, 169],
        [x + 19, 228],
      ],
      '#172c38'
    );
    px(x - 6, 166 + (i % 3) * 19, 2, 38, '#364b53');
  }
  for (let i = 0; i < 5; i++) {
    const x = i < 3 ? 107 - i * 10 : 515 + (i - 3) * 13,
      y = 43 + i * 32;
    px(x, y, 24, 33, '#505c65');
    px(x + 1, y + 1, 21, 2, '#8d9290');
  }
  poly(
    [
      [134, 229],
      [506, 229],
      [569, 420],
      [73, 420],
    ],
    '#101e2b'
  );
  for (let i = 0; i < 8; i++) {
    const y = 244 + i * 23;
    px(143 + ((i * 17) % 79), y, 42 + (i % 3) * 13, 1, '#3c626a');
    px(392 - ((i * 9) % 42), y + 6, 61, 1, '#29555f');
  }
  for (let i = 0; i < 6; i++) {
    const x = 277 - i * 11,
      y = 267 + i * 21,
      w = 86 + i * 22;
    px(x, y, w, 20, '#4c5d64');
    px(x, y, w, 2, '#a3a992');
    px(x + 4, y + 15, w - 8, 3, '#243941');
  }
  secretArtOval(c, 320, 249, 58, 17, '#7b8b80');
  secretArtOval(c, 320, 246, 49, 14, '#c0c0a0');
  secretArtOval(c, 320, 243, 40, 11, '#294b53');
  for (const side of [-1, 1]) {
    const x = side < 0 ? 84 : 555;
    secretArtPillar(c, x, 295, 160, true);
    poly(
      [
        [x - 16, 137],
        [x + 15, 137],
        [x + 15, 185],
        [x + 5, 180],
        [x - 4, 185],
        [x - 16, 176],
      ],
      '#364b5b'
    );
    px(x - 12, 141, 22, 2, '#a2b6ab');
  }
  poly(
    [
      [302, 222],
      [289, 184],
      [301, 155],
      [310, 155],
      [313, 118],
      [326, 103],
      [341, 131],
      [339, 157],
      [353, 184],
      [338, 222],
    ],
    '#2d5364'
  );
  poly(
    [
      [310, 207],
      [301, 181],
      [313, 158],
      [321, 120],
      [328, 141],
      [324, 174],
      [334, 189],
      [325, 216],
    ],
    '#89c2c4'
  );
  poly(
    [
      [315, 199],
      [315, 175],
      [321, 146],
      [325, 171],
      [322, 193],
    ],
    '#e6eed4'
  );
  secretArtCrystal(c, 191, 318, 0.65, 'blue');
  secretArtCrystal(c, 452, 324, 0.65, 'gold');
  secretArtCrystal(c, 131, 367, 0.4, 'rose');
  secretArtCrystal(c, 502, 380, 0.47, 'blue');
}
function secretArtShop(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'wood');
  secretArtArch(c, 223, 31, 194, 164, '#9b9472', '#203e42');
  px(240, 71, 160, 106, '#2f5155');
  px(241, 72, 157, 37, '#4e7270');
  for (let i = 0; i < 12; i++) {
    const x = 241 + i * 14;
    poly(
      [
        [x - 9, 176],
        [x + 3, 113 + (i % 3) * 14],
        [x + 15, 176],
      ],
      '#243f40'
    );
  }
  px(316, 53, 5, 128, '#b3a477');
  px(236, 120, 167, 4, '#b3a477');
  px(236, 120, 165, 1, '#e5cd9a');
  for (const x of [59, 466]) secretArtShelf(c, x, 67, 114, 159, 'bottles');
  secretArtBooks(c, 78, 220, 9, 25);
  secretArtBooks(c, 482, 219, 8, 24);
  for (let i = 0; i < 9; i++) {
    const x = 198 + i * 30,
      y = 24 + (i % 3) * 7;
    px(x, y, 1, 37, '#82785b');
    px(x - 4, y + 35, 9, 4, '#c8af77');
    if (i % 3 === 0) secretArtOval(c, x, y + 43, 6, 7, '#9baf99', 2);
    else if (i % 3 === 1) {
      px(x - 3, y + 40, 7, 12, '#a4bbae');
      px(x - 1, y + 42, 2, 8, '#e2e5bd');
    } else {
      poly(
        [
          [x, y + 39],
          [x + 6, y + 45],
          [x, y + 54],
          [x - 6, y + 45],
        ],
        '#8a8d6d'
      );
    }
  }
  secretArtWood(c, 182, 245, 276, 67, true);
  px(178, 237, 284, 11, '#c7a371');
  px(179, 238, 282, 2, '#f3d39a');
  for (let i = 0; i < 5; i++) {
    const x = 190 + i * 52;
    px(x, 255, 45, 44, '#705c3d');
    px(x + 3, 258, 39, 2, '#b39863');
    px(x + 10, 266, 25, 24, '#4d5b46');
    poly(
      [
        [x + 22, 269],
        [x + 30, 278],
        [x + 22, 286],
        [x + 14, 278],
      ],
      '#b8a56b'
    );
  }
  px(179, 310, 282, 8, '#363e30');
  px(189, 318, 14, 14, '#a18754');
  px(436, 318, 14, 14, '#a18754');
  secretArtCrate(c, 47, 272, 86, 53);
  secretArtChest(c, 63, 235, 73, false);
  secretArtBottle(c, 145, 268, '#b1bd92', 2);
  px(489, 265, 102, 8, '#bd9b65');
  px(495, 273, 8, 50, '#715d3b');
  px(578, 273, 8, 50, '#715d3b');
  for (let i = 0; i < 4; i++)
    secretArtBottle(c, 503 + i * 25, 264, ['#8faeaa', '#b6ad7d', '#9d899d', '#91a57f'][i], i % 3);
  secretArtRug(c, 184, 329, 272, 70, '#3e6558', '#b6ad7a');
  for (let i = 0; i < 5; i++)
    poly(
      [
        [250 + i * 35, 350],
        [257 + i * 35, 356],
        [250 + i * 35, 363],
        [243 + i * 35, 356],
      ],
      '#c4bd8b'
    );
  px(231, 226, 42, 8, '#aeb49a');
  px(235, 220, 34, 6, '#d5cf9f');
  px(239, 214, 26, 6, '#718f83');
  px(392, 223, 18, 13, '#8fa795');
  px(395, 220, 12, 4, '#d5d7ae');
  px(409, 225, 6, 2, '#aabda1');
  px(413, 227, 2, 5, '#aabda1');
  px(410, 232, 4, 2, '#aabda1');
  secretArtPlant(c, 550, 356, 1.4);
  secretArtPlant(c, 86, 360, 1.1);
}
function secretArtBuild(s) {
  const key = [s.type, s.region, !!s.claimed].join(':');
  if (secretArtRooms.has(key)) return secretArtRooms.get(key);
  const cv = document.createElement('canvas');
  cv.width = 640;
  cv.height = 420;
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = false;
  const rooms = {
    cache: secretArtCache,
    workshop: secretArtWorkshop,
    quiet: secretArtQuiet,
    shrine: secretArtShrine,
    trial: secretArtTrial,
    wager: secretArtWager,
    echo: secretArtEcho,
    cartographer: secretArtCartographer,
    armory: secretArtArmory,
    false: secretArtFalse,
    deep: secretArtDeep,
    shop: secretArtShop,
  };
  (rooms[s.type] || secretArtCache)(c, s);
  if (secretArtRooms.size >= 24) secretArtRooms.delete(secretArtRooms.keys().next().value);
  secretArtRooms.set(key, cv);
  return cv;
}
function secretArtAnimations(c, s, t) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    wave = save.motion ? 0 : Math.sin(t * 1.4),
    glint = (x, y, index, color = '#ffe2a0') => {
      if (save.motion) return;
      const phase = (t * 0.37 + index * 0.173) % 1;
      if (phase < 0.16) {
        c.save();
        c.globalAlpha = Math.sin((phase / 0.16) * Math.PI) * 0.85;
        secretArtStar(c, x, y, color, phase < 0.08 ? 2 : 3);
        c.restore();
      }
    };
  if (s.type === 'cache') {
    for (const x of [185, 454]) {
      secretArtGlow(c, x, 181, 103, '#ffd48a', 0.19);
      secretArtCandle(c, x, 199, t, 25);
    }
    secretArtGlow(c, 320, 215, 100, '#eecb74', s.claimed ? 0.2 : 0.08);
    for (let i = 0; i < 9; i++) glint(196 + ((i * 47) % 238), 310 + ((i * 17) % 35), i);
    if (s.claimed)
      for (let i = 0; i < 7; i++) {
        const x = 276 + ((i * 17) % 85),
          y = 200 - ((t * 8 + i * 17) % 59);
        px(x, y, 1, 2, i % 2 ? '#e3c083' : '#fff0bd');
      }
  } else if (s.type === 'workshop') {
    secretArtGlow(c, 131, 189, 139, '#ffad65', 0.27);
    secretArtFlame(c, 131, 216, t, 1.55);
    secretArtFlame(c, 106, 217, t + 0.4, 0.7);
    for (let i = 0; i < 7 && !save.motion; i++) {
      const age = (t * 0.32 + i * 0.17) % 1;
      px(
        113 + ((i * 13) % 38) + Math.sin(age * 5 + i) * 4,
        207 - age * 77,
        1,
        age < 0.6 ? 3 : 1,
        age < 0.6 ? '#ffdb8c' : '#a96b45'
      );
    }
    secretArtGlow(c, 316, 170, 65, '#ffd98c', 0.14);
    glint(314, 155, 1);
    glint(508, 189, 4, '#d9f0dc');
    secretArtCandle(c, 463, 206, t + 0.5, 18);
    if (!save.motion)
      for (let i = 0; i < 3; i++) {
        const age = (t * 0.18 + i / 3) % 1;
        c.save();
        c.globalAlpha = (1 - age) * 0.2;
        secretArtOval(
          c,
          487 + Math.sin(age * 6 + i) * 5,
          320 - age * 25,
          8 + age * 6,
          2,
          '#bfd5c8'
        );
        c.restore();
      }
  } else if (s.type === 'quiet') {
    secretArtGlow(c, 335, 232, 165, '#b2d5b3', 0.13);
    secretArtGlow(c, 144, 198, 88, '#f3d9a0', 0.13);
    secretArtCandle(c, 211, 202, t, 18);
    for (let i = 0; i < 4; i++) {
      const age = save.motion ? i / 4 : (t * 0.14 + i / 4) % 1;
      c.save();
      c.globalAlpha = (1 - age) * 0.35;
      secretArtOval(c, 333, 263, 12 + age * 43, 3 + age * 10, '#c9dfb3', 1);
      c.restore();
    }
    for (let i = 0; i < 10 && !save.motion; i++) {
      const x = 258 + ((i * 17) % 150),
        y = 74 + ((t * 23 + i * 31) % 101);
      px(x, y, 1, 3, '#71958a');
    }
    glint(516, 124, 3, '#e4eac5');
  } else if (s.type === 'shrine') {
    secretArtGlow(c, 320, 160, 180, '#ffc472', 0.24);
    secretArtBrazier(c, 320, 197, t, 1.25);
    for (const x of [144, 185, 455, 496])
      secretArtCandle(c, x, x === 144 || x === 496 ? 241 : 203, t + x * 0.01, 20);
    for (let i = 0; i < 7; i++) {
      const x = 130 + i * 63;
      secretArtCandle(c, x, 337 + (i % 2) * 23, t + i * 0.1, 11);
    }
    glint(223, 149, 2);
    glint(417, 149, 5);
  } else if (s.type === 'trial') {
    for (const x of [61, 579]) {
      secretArtGlow(c, x, 259, 95, '#f7b86b', 0.2);
      secretArtBrazier(c, x, 280, t + x * 0.01, 0.8);
    }
    const pulse = s.trialStarted && !s.trialComplete ? 0.45 + wave * 0.15 : 0.18;
    c.save();
    c.globalAlpha = pulse;
    secretArtOval(c, 320, 316, 114, 41, '#e2b86f', 2);
    secretArtOval(c, 320, 154, 21, 21, '#f5d38a', 2);
    c.restore();
    if (!s.claimed) glint(320, 316, 3);
  } else if (s.type === 'wager') {
    for (const x of [182, 458]) {
      secretArtGlow(c, x, 198, 99, '#ffd191', 0.18);
      secretArtCandle(c, x, 235, t + x * 0.01, 27);
    }
    for (let i = 0; i < 7; i++) glint(193 + ((i * 59) % 252), 273 + ((i * 7) % 17), i);
    c.save();
    c.globalAlpha = 0.22 + wave * 0.06;
    secretArtOval(c, 320, 123, 72, 72, '#f1d28e', 1);
    c.restore();
  } else if (s.type === 'echo') {
    secretArtGlow(c, 320, 199, 167, '#a7dfe8', 0.24);
    for (let i = 0; i < 4; i++) {
      const age = save.motion ? i / 4 : (t * 0.12 + i / 4) % 1;
      c.save();
      c.globalAlpha = (1 - age) * 0.48;
      secretArtOval(c, 320, 268, 18 + age * 64, 6 + age * 19, '#b7e4dc', 1);
      c.restore();
    }
    for (let i = 0; i < 12; i++) {
      const a = t * 0.15 + i * 2.4,
        x = 320 + Math.sin(a) * (39 + i * 5),
        y = 143 + ((((i * 31 - t * 9) % 117) + 117) % 117);
      c.save();
      c.globalAlpha = 0.25 + (Math.sin(t + i) + 1) * 0.2;
      px(x, y, 2, i % 3 ? 2 : 4, '#d6f0e7');
      c.restore();
    }
    for (const x of [178, 462]) secretArtCandle(c, x, 255, t, 30, true);
  } else if (s.type === 'cartographer') {
    secretArtGlow(c, 400, 220, 113, '#f5d29b', 0.2);
    secretArtCandle(c, 438, 224, t, 25);
    for (const x of [173, 467]) secretArtCandle(c, x, 194, t + x * 0.01, 19);
    glint(388, 240, 4);
    glint(533, 266, 2, '#d4e6c4');
    if (!save.motion) {
      const age = (t * 0.12) % 1;
      c.save();
      c.globalAlpha = (1 - age) * 0.32;
      secretArtOval(c, 410, 132, 3 + age * 10, 3 + age * 10, '#ead18b', 1);
      c.restore();
    }
  } else if (s.type === 'armory') {
    secretArtGlow(c, 320, 190, 147, '#b2e5e0', 0.21);
    for (let i = 0; i < 3; i++) {
      const a = (save.motion ? 0.5 : t * 0.35) + (i * Math.PI * 2) / 3;
      secretArtCrystal(
        c,
        320 + Math.cos(a) * 55,
        194 + Math.sin(a) * 19,
        0.28,
        ['gold', 'rose', 'green'][i]
      );
    }
    for (let i = 0; i < 8; i++)
      glint(88 + ((i * 71) % 456), 100 + ((i * 31) % 201), i, i % 2 ? '#e8f3d8' : '#b5e1e4');
    for (const x of [192, 448]) secretArtCandle(c, x, 239, t + x * 0.01, 21, true);
  } else if (s.type === 'false') {
    secretArtGlow(c, 398, 191, 135, '#b0d9aa', 0.2);
    secretArtCandle(c, 316, 181, t, 19);
    secretArtCandle(c, 480, 181, t + 0.3, 19);
    for (let i = 0; i < 7; i++) glint(373 + ((i * 13) % 59), 211 + ((i * 7) % 30), i, '#deebae');
    secretArtGlow(c, 110, 191, 80, '#edc183', 0.1);
    secretArtCandle(c, 160, 224, t + 0.5, 24);
  } else if (s.type === 'deep') {
    secretArtGlow(c, 320, 183, 182, '#98d7dc', 0.24);
    secretArtFlame(c, 320, 241, t, 0.95, true);
    for (let i = 0; i < 8; i++) {
      const a = (save.motion ? 0 : t * 0.1) + (i * Math.PI) / 4,
        x = 320 + Math.cos(a) * 67,
        y = 172 + Math.sin(a) * 47;
      secretArtCrystal(c, x, y, 0.24, i % 3 ? 'blue' : 'gold');
    }
    for (let i = 0; i < 6; i++)
      glint(159 + ((i * 67) % 319), 66 + ((i * 43) % 118), i, i % 2 ? '#c3e8dc' : '#fff0c8');
  } else if (s.type === 'shop') {
    secretArtGlow(c, 320, 196, 150, '#ecdaac', 0.13);
    drawMothMerchant(c, 321, 193, t);
    for (const x of [201, 440]) {
      secretArtGlow(c, x, 105, 88, '#f0daa1', 0.19);
      hearthLantern(c, x, 97, 'bellglass', t);
    }
    const stock = secretShopStock(s);
    for (let i = 0; i < stock.length && i < 7; i++) {
      c.save();
      c.globalAlpha = secretItemOwned(s, stock[i].id) ? 0.2 : 1;
      drawMothItem(c, 203 + i * 38, 232, stock[i].icon, 0.48);
      c.restore();
    }
    if (!save.motion)
      for (let i = 0; i < 3; i++) {
        const age = (t * 0.22 + i / 3) % 1;
        c.save();
        c.globalAlpha = (1 - age) * 0.25;
        secretArtLine(
          c,
          400 + Math.sin(age * 6 + i) * 2,
          219 - age * 21,
          401 + Math.sin(age * 6 + i) * 3,
          214 - age * 21,
          '#c6d8c0'
        );
        c.restore();
      }
    glint(251, 216, 4, '#e5e9c2');
  }
}
function drawSecretRoomArt(c, s, w, h, milliseconds) {
  c.save();
  c.imageSmoothingEnabled = false;
  c.scale(w / 640, h / 420);
  c.drawImage(secretArtBuild(s), 0, 0);
  secretArtAnimations(c, s, (save.motion ? 2400 : milliseconds) / 1000);
  c.fillStyle = '#0a101320';
  c.fillRect(0, 0, 640, 11);
  c.fillRect(0, 411, 640, 9);
  c.restore();
}
function drawSecretFrame(now) {
  if (!secretOverlay.classList.contains('open')) return;
  const s = currentSecret();
  if (!s) return;
  drawSecretRoomArt(secretCtx, s, secretCanvas.width, secretCanvas.height, now - secretOpenAt);
  secretAnim = requestAnimationFrame(drawSecretFrame);
}
