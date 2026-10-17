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
  const red = parseInt(color.slice(1, 3), 16),
    green = parseInt(color.slice(3, 5), 16),
    blue = parseInt(color.slice(5, 7), 16),
    glow = c.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, `rgba(${red},${green},${blue},${alpha})`);
  glow.addColorStop(0.42, `rgba(${red},${green},${blue},${alpha * 0.3})`);
  glow.addColorStop(1, `rgba(${red},${green},${blue},0)`);
  c.save();
  c.globalAlpha = 1;
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
  c.save();
  c.beginPath();
  c.rect(x, y, w, h);
  c.clip();
  px(x, y, w, h, '#30271f');
  for (let row = 0; row < h - 2; row += 12) {
    px(x + 2, y + row + 1, w - 4, 11, light ? '#947048' : '#674e35');
    if ((row / 12) % 2 === 0 && w > 40)
      px(x + 7, y + row + 3, Math.min(27, w - 15), 2, light ? '#a78153' : '#795b3c');
  }
  px(x, y, w, 2, light ? '#c09a65' : '#a17c4e');
  px(x + w - 3, y + 3, 2, h - 3, '#352b22');
  c.restore();
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
      const mark = (((row * 19 + Math.floor((x + 60) / 58) * 7) % 11) + 11) % 11;
      if (mark === 0) {
        const chip = x + 12 + mark * 7;
        px(
          chip,
          y + 3,
          7,
          1,
          material === 'pale' ? '#7a8980' : material === 'deep' ? '#697480' : '#897357'
        );
        px(chip + 1, y + 4, 5, 1, palette[(tone + 1) % 4]);
        px(chip + 4, y + 8, 6, 1, material === 'deep' ? '#3f4c5b' : '#645e4c');
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
      if (material === 'wood' && row % 2 === 0)
        px(x + 9, y + 4, Math.min(27, w - 18), 2, '#80603e');
    }
    y += h;
  }
  for (const x of [11, 623]) {
    px(x, 254, 6, 166, '#1d241e');
    px(x + 1, 255, 2, 160, '#62553a');
  }
  secretArtRegionBadge(c, s);
}
function secretArtRegionBadge(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (points, color) => secretArtPoly(c, points, color),
    p = SECRET_REGIONS[s.region] || SECRET_REGIONS.gate;
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
  for (let yy = y + 36; yy < y + h - 4; yy += 32) {
    px(x + 1, yy, 6, 1, '#4e4d40');
    px(x + w - 7, yy, 6, 1, '#4e4d40');
    px(x + 1, yy + 1, 5, 1, '#b3a280');
    px(x + w - 6, yy + 1, 5, 1, '#a49c7b');
  }
  px(x, y + 28, 2, h - 31, '#b7a17a');
  px(x + w - 2, y + 28, 2, h - 31, '#424b42');
  px(x + 8, y + 28, 2, h - 30, '#0f1e20');
  px(x + w - 10, y + 28, 2, h - 30, '#0f1e20');
  px(x + 40, y, w - 80, 2, '#c8b48d');

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
    for (let i = 0; i < 2; i++) {
      const xx = x + w / 2 + side * w * 0.32,
        yy = y + 17 + (i * (h - 30)) / 2;
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
}
function secretArtBooks(c, x, y, count, height = 27) {
  const colors = ['#775747', '#72847a', '#9a7c4c', '#4b6970'];
  let xx = x;
  for (let i = 0; i < count; i++) {
    const w = 5 + ((i * 7) % 6),
      h = height - ((i * 11) % 10);
    secretArtPixel(c, xx, y - h, w, h, '#242b26');
    secretArtPixel(c, xx + 1, y - h, w - 2, h - 1, colors[i % 4]);
    secretArtPixel(c, xx + 1, y - h + 5, w - 2, 2, '#bba47a');
    xx += w + 1;
  }
}
function secretArtShelf(c, x, y, w, h, kind = 'books') {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f);
  px(x + 3, y + 4, w + 3, h + 1, '#0b151750');
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
  for (const xx of [x + 2, x + w - 6]) {
    px(xx, y + 8, 3, h - 15, '#af8954');
    px(xx + 1, y + 11, 1, h - 22, '#d3b17b');
    px(xx, y + h - 8, 4, 2, '#4b3c2a');
  }
}
function secretArtBottle(c, x, y, color = '#8faea2', kind = 0) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f);
  px(x - 6, y + 1, 14, 2, '#13272666');
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
  px(x + 3, y + h, w - 3, 3, '#0d19194d');
  secretArtWood(c, x, y, w, h);
  px(x + 4, y + 3, 5, h - 6, '#a58351');
  px(x + w - 9, y + 3, 5, h - 6, '#8a734d');
  secretArtLine(c, x + 9, y + 7, x + w - 12, y + h - 8, '#382f24', 7);
  secretArtLine(c, x + 9, y + 5, x + w - 12, y + h - 10, '#a38251', 4);
  for (const xx of [x + 5, x + w - 8])
    for (const yy of [y + 5, y + h - 7]) {
      px(xx, yy, 2, 2, '#2b3026');
      px(xx, yy, 1, 1, '#d0b082');
    }
  px(x + 8, y + h - 4, w - 16, 1, '#ba9460');
  px(x + w - 4, y + 8, 1, h - 14, '#282b23');
}
function secretArtPlant(c, x, y, size = 1) {
  c.save();
  c.translate(x, y);
  c.scale(size, size);
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtOval(c, 1, 17, 16, 4, '#10201c55');
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
  px(7, 1, 2, 10, '#403f30');
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
    if (i % 3 === 0) px(xx - 6, yy - 3, 6, 2, '#a0ac75');
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
function secretArtCoinStack(c, x, y, count = 3) {
  secretArtOval(c, x + 1, y + 1, 6, 2, '#263d30');
  for (let i = 0; i < count; i++) {
    const yy = y - i * 2;
    secretArtPixel(c, x - 4, yy - 1, 9, 3, '#9a703c');
    secretArtPixel(c, x - 3, yy + 1, 7, 1, '#6d512e');
    secretArtOval(c, x, yy - 1, 4, 2, '#d7ad60');
    secretArtPixel(c, x - 2, yy - 2, 4, 1, '#f5d58f');
    secretArtPixel(c, x - 3, yy, 1, 1, '#f1cd7e');
    secretArtPixel(c, x + 1, yy - 1, 2, 1, '#af8145');
  }
}
function secretArtPlayingCard(c, x, y, tilt, rank = 'A', red = true, back = false) {
  const point = (u, v) => [Math.round(x + u + v * -0.13), Math.round(y + v * 0.55 + u * tilt)],
    face = (points, color, dx = 0, dy = 0) =>
      secretArtPoly(
        c,
        points.map(([u, v]) => {
          const p = point(u, v);
          return [p[0] + dx, p[1] + dy];
        }),
        color
      ),
    box = (u, v, w, h, color) =>
      face(
        [
          [u, v],
          [u + w, v],
          [u + w, v + h],
          [u, v + h],
        ],
        color
      ),
    outline = [
      [-13, -18],
      [12, -18],
      [13, 17],
      [-12, 18],
    ];
  face(outline, '#253c30', 1, 2);
  face(outline, '#82714f');
  face(
    [
      [-12, -17],
      [11, -17],
      [12, 16],
      [-11, 17],
    ],
    '#d7c99d'
  );
  face(
    [
      [-11, -16],
      [10, -16],
      [11, 15],
      [-10, 16],
    ],
    back ? '#824c42' : '#eee0b7'
  );
  if (back) {
    face(
      [
        [-8, -11],
        [7, -11],
        [8, 10],
        [-7, 11],
      ],
      '#b49462'
    );
    face(
      [
        [-6, -8],
        [5, -8],
        [6, 7],
        [-5, 8],
      ],
      '#684237'
    );
    face(
      [
        [0, -7],
        [5, 0],
        [0, 7],
        [-5, 0],
      ],
      '#d5b57c'
    );
    box(-1, -3, 2, 6, '#85563f');
    return;
  }
  const ink = red ? '#934b3c' : '#355149',
    glyphs = {
      A: ['010', '101', '111', '101', '101'],
      7: ['111', '001', '010', '010', '010'],
      3: ['111', '001', '111', '001', '111'],
    },
    glyph = glyphs[rank] || glyphs.A;
  for (let row = 0; row < glyph.length; row++)
    for (let col = 0; col < 3; col++)
      if (glyph[row][col] === '1') {
        box(-9 + col, -13 + row, 1, 1, ink);
        box(6 - col, 9 - row, 1, 1, ink);
      }
  if (red) {
    face(
      [
        [0, -7],
        [5, 0],
        [0, 7],
        [-5, 0],
      ],
      ink
    );
    box(-1, -3, 1, 4, '#b6694c');
  } else {
    face(
      [
        [0, -8],
        [6, 0],
        [4, 4],
        [0, 2],
        [-4, 4],
        [-6, 0],
      ],
      ink
    );
    face(
      [
        [0, 1],
        [3, 8],
        [-3, 8],
      ],
      ink
    );
  }
  box(-9, -5, 2, 3, ink);
  box(6, 3, 2, 3, ink);
}
function secretArtDie(c, x, y, turn = 0) {
  const poly = (points, color) => secretArtPoly(c, points, color),
    px = (a, b, w, h, color) => secretArtPixel(c, a, b, w, h, color);
  secretArtOval(c, x + 7, y + 1, 9, 3, '#294235');
  poly(
    [
      [x, y - 9],
      [x + 7, y - 13],
      [x + 14, y - 9],
      [x + 7, y - 5],
    ],
    '#f0e1b8'
  );
  poly(
    [
      [x, y - 9],
      [x + 7, y - 5],
      [x + 7, y + 2],
      [x, y - 2],
    ],
    '#cbb98e'
  );
  poly(
    [
      [x + 7, y - 5],
      [x + 14, y - 9],
      [x + 14, y - 2],
      [x + 7, y + 2],
    ],
    '#9d8d67'
  );
  px(x + 6, y - 10, 2, 1, '#705441');
  px(x + 2, y - 6, 2, 2, '#745340');
  px(x + 4, y - 3, 2, 2, '#745340');
  px(x + 10, y - 5, 2, 2, '#5a4c36');
  if (turn) {
    px(x + 2, y - 8, 2, 1, '#745340');
    px(x + 10, y - 9, 2, 1, '#8f7153');
    px(x + 12, y - 3, 1, 1, '#e4d2a5');
  }
}
function detailInteriorPanel(c, x, y, w, h, color = '#695035', motif = 'diamond') {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f);
  px(x + 3, y + 3, w, h, '#22251e');
  px(x, y, w, h, '#322c23');
  px(x + 1, y + 1, w - 2, h - 3, '#aa8555');
  px(x + 3, y + 3, w - 6, h - 6, color);
  px(x + 5, y + 5, w - 10, 1, '#c09b64');
  px(x + 5, y + 6, 1, h - 12, '#a27a48');
  px(x + w - 6, y + 6, 1, h - 11, '#352f25');
  px(x + 6, y + h - 6, w - 12, 1, '#352f25');
  if (motif === 'diamond') {
    const mx = x + w / 2,
      my = y + h / 2;
    secretArtPoly(
      c,
      [
        [mx, my - 11],
        [mx + 9, my],
        [mx, my + 11],
        [mx - 9, my],
      ],
      '#392f24'
    );
    secretArtPoly(
      c,
      [
        [mx, my - 9],
        [mx + 6, my],
        [mx, my + 8],
        [mx - 6, my],
      ],
      '#b18e56'
    );
    secretArtPixel(c, mx - 1, my - 5, 2, 10, '#e2c28a');
  } else {
    const mx = x + w / 2,
      my = y + h / 2;
    secretArtOval(c, mx, my, 7, 3, '#302e24');
    secretArtOval(c, mx, my - 1, 5, 2, '#bd9c66', 1);
    px(mx - 7, my - 3, 3, 3, '#d0b17b');
    px(mx + 5, my - 3, 3, 3, '#7e6442');
  }
}
function detailInteriorUrn(c, x, y, size = 1, blue = false) {
  c.save();
  c.translate(x, y);
  c.scale(size, size);
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    colors = blue
      ? ['#344d50', '#668b86', '#a9c1a4', '#d7dec0']
      : ['#584833', '#92754c', '#c9a86d', '#edcf92'];
  secretArtOval(c, 2, 2, 21, 5, '#262a23');
  secretArtPoly(
    c,
    [
      [-9, -40],
      [9, -40],
      [9, -31],
      [17, -23],
      [18, -10],
      [12, -2],
      [-12, -2],
      [-18, -10],
      [-17, -23],
      [-9, -31],
    ],
    colors[0]
  );
  secretArtPoly(
    c,
    [
      [-7, -38],
      [6, -38],
      [6, -30],
      [13, -22],
      [13, -10],
      [8, -5],
      [-10, -5],
      [-15, -12],
      [-14, -22],
      [-7, -30],
    ],
    colors[1]
  );
  px(-11, -24, 3, 15, colors[2]);
  px(10, -19, 2, 10, colors[0]);
  px(-11, -14, 23, 2, colors[2]);
  px(-11, -40, 22, 3, colors[2]);
  px(-9, -40, 18, 1, colors[3]);
  px(-10, -4, 21, 3, colors[2]);
  c.restore();
}
function detailInteriorScroll(c, x, y, w, h, sealed = false) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f);
  px(x + 1, y + 3, w, h, '#493f2d');
  px(x, y, w, h, '#bcaa7e');
  px(x + 2, y + 1, w - 4, h - 3, '#e0cca0');
  px(x + 3, y + 2, w - 6, 1, '#f4e2b7');
  for (const xx of [x - 2, x + w - 3]) {
    px(xx, y - 1, 6, h + 1, '#ac9265');
    px(xx + 1, y, 2, h - 1, '#eddbaf');
    px(xx + 3, y + 1, 1, h - 2, '#786244');
  }
  if (sealed) {
    px(x + w / 2 - 3, y, 6, h - 1, '#865044');
    secretArtOval(c, x + w / 2, y + h / 2, 5, 4, '#b67552');
    px(x + w / 2 - 2, y + h / 2 - 2, 3, 1, '#e5b074');
  } else
    for (let line = 0; line < Math.min(3, Math.floor((h - 6) / 7)); line++)
      px(x + 8, y + 5 + line * 7, w - 18 - (line % 2) * 5, 2, '#ad966a');
}
function detailInteriorCushion(c, x, y, w, h, green = false) {
  const pale = green ? '#a2b495' : '#c89976',
    mid = green ? '#678473' : '#996a58',
    low = green ? '#425e53' : '#654736';
  secretArtOval(c, x + w / 2 + 2, y + h, w / 2 + 3, 5, '#283027');
  secretArtPoly(
    c,
    [
      [x + 4, y + 2],
      [x + w - 4, y],
      [x + w, y + h - 5],
      [x + w - 6, y + h],
      [x + 3, y + h - 1],
      [x, y + 6],
    ],
    low
  );
  secretArtPoly(
    c,
    [
      [x + 5, y + 3],
      [x + w - 5, y + 2],
      [x + w - 3, y + h - 7],
      [x + w - 7, y + h - 4],
      [x + 5, y + h - 5],
      [x + 3, y + 7],
    ],
    mid
  );
  secretArtLine(c, x + 6, y + 4, x + w - 7, y + 3, pale);
  secretArtLine(c, x + 3, y + 7, x + 6, y + h - 6, pale);
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
  for (let i = 0; i < 5; i++) {
    const x = 223 + i * 45;
    px(x, 52, 26, 7, '#d0b375');
    px(x + 2, 54, 22, 3, '#725e3c');
    secretArtPoly(
      c,
      [
        [x + 1, 60],
        [x + 25, 60],
        [x + 19, 70],
        [x + 7, 70],
      ],
      '#8a794e'
    );
    px(x + 10, 62, 5, 4, '#e2ca8e');
  }
  for (const x of [218, 418]) {
    px(x, 77, 8, 118, '#30382c');
    px(x + 1, 78, 2, 112, '#a2a077');
    for (let y = 82; y < 193; y += 20) {
      px(x, y, 8, 5, '#9c9364');
      px(x + 2, y, 3, 2, '#e4ce90');
      px(x + 3, y + 3, 3, 2, '#454b35');
    }
  }
  secretArtOval(c, 320, 127, 36, 36, '#252e27');
  secretArtOval(c, 320, 126, 33, 33, '#a08b58');
  secretArtOval(c, 320, 126, 28, 28, '#544f37');
  secretArtOval(c, 320, 125, 24, 24, '#77805b');
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    secretArtLine(
      c,
      320 + Math.cos(a) * 8,
      125 + Math.sin(a) * 8,
      320 + Math.cos(a) * 27,
      125 + Math.sin(a) * 27,
      '#cfb576',
      3
    );
    px(319 + Math.cos(a) * 29, 124 + Math.sin(a) * 29, 3, 3, '#f0d89a');
  }
  secretArtOval(c, 320, 125, 10, 10, '#c7ac71');
  px(318, 121, 5, 8, '#424a35');
  px(319, 126, 3, 6, '#343e30');
  px(316, 117, 6, 2, '#f1d99c');
  secretArtShelf(c, 62, 68, 101, 158, 'bottles');
  secretArtShelf(c, 480, 69, 96, 158, 'bottles');
  for (const x of [60, 477]) {
    detailInteriorPanel(c, x + 6, 199, 41, 24, '#6c5135', 'pull');
    detailInteriorPanel(c, x + 51, 199, 41, 24, '#695036', 'pull');
    for (let i = 0; i < 3; i++) {
      const yy = 106 + i * 41;
      px(x + 11, yy + 2, 79, 1, '#d7b276');
      px(x + 14, yy + 3, 4, 3, '#5c4630');
      px(x + 81, yy + 3, 4, 3, '#5c4630');
    }
  }
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
  for (let i = 0; i < 4; i++) {
    const x = 288 + i * 17;
    px(x, 228, 11, 1, '#bd9254');
    px(x + 2, 230, 7, 1, '#3c3528');
    px(x + 3, 232, 5, 1, '#b19358');
  }
  for (const x of [270, 366]) {
    px(x, 236, 4, 4, '#272e25');
    px(x, 236, 3, 1, '#efd193');
  }
  detailInteriorUrn(c, 129, 260, 0.85);
  detailInteriorUrn(c, 507, 256, 0.72, true);
  detailInteriorScroll(c, 414, 288, 36, 15, true);
  detailInteriorCushion(c, 434, 326, 54, 27);
  secretArtCoins(c, 180, 307, 24);
  secretArtCoins(c, 379, 314, 21);
  secretArtBottle(c, 163, 281, '#a8af82');
  secretArtBottle(c, 467, 302, '#93b5b0', 2);
  for (let i = 0; i < 5; i++) {
    px(126 + i * 13, 333 + (i % 2) * 4, 10, 7, '#a99360');
    px(127 + i * 13, 333 + (i % 2) * 4, 8, 1, '#e9cc88');
  }
  for (const [x, y, count] of [
    [173, 291, 5],
    [457, 310, 6],
    [155, 350, 4],
    [393, 332, 4],
  ]) {
    for (let i = 0; i < count; i++) {
      const xx = x + (i % 3) * 11,
        yy = y - Math.floor(i / 3) * 5;
      px(xx, yy, 14, 5, '#927346');
      px(xx, yy, 13, 2, '#e5c476');
      px(xx + 2, yy, 8, 1, '#fff0b3');
      px(xx + 11, yy + 2, 2, 2, '#b48b49');
    }
  }
  secretArtPoly(
    c,
    [
      [112, 321],
      [125, 311],
      [141, 314],
      [149, 331],
      [145, 347],
      [116, 349],
      [108, 338],
    ],
    '#695540'
  );
  secretArtPoly(
    c,
    [
      [115, 323],
      [126, 316],
      [139, 319],
      [145, 333],
      [141, 343],
      [118, 345],
      [113, 336],
    ],
    '#a18759'
  );
  px(124, 314, 13, 5, '#3b3727');
  px(121, 319, 20, 2, '#d1b27a');
  secretArtLine(c, 116, 328, 120, 339, '#ccb081');
  for (let i = 0; i < 6; i++) px(207 + i * 35, 374, 3, 2, '#dfc58c');
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
  for (let row = 0; row < 5; row++) {
    const y = 128 + row * 20;
    for (const x of [69 + (row % 2) * 4, 179 - (row % 2) * 4]) {
      px(x, y, 16, 15, '#807255');
      px(x + 1, y, 14, 2, '#c4a577');
      px(x + 2, y + 13, 12, 2, '#4a4735');
      px(x + 13, y + 3, 2, 9, '#65533d');
    }
  }
  for (let row = 0; row < 4; row++) {
    const y = 34 + row * 19;
    px(97, y, 67, 13, '#7d6447');
    px(98, y, 65, 1, '#c49b66');
    px(100 + (row % 2) * 26, y + 2, 1, 10, '#463e2e');
    px(155 - (row % 3) * 15, y + 5, 2, 2, '#443a2c');
  }
  px(63, 234, 138, 6, '#ccac77');
  px(64, 235, 135, 1, '#f1d29a');
  px(70, 242, 124, 5, '#6f5740');
  secretArtLine(c, 88, 227, 174, 227, '#55422c', 3);
  for (let i = 0; i < 5; i++) {
    px(91 + i * 17, 218, 3, 13, '#372e22');
    px(92 + i * 17, 218, 1, 8, '#c99150');
  }
  px(89, 215, 84, 6, '#da8743');
  px(87, 228, 90, 9, '#4b3b29');
  secretArtWood(c, 252, 44, 263, 117);
  px(260, 52, 247, 99, '#363b32');
  for (const y of [67, 101, 135]) px(276, y, 218, 2, '#73694b');
  for (let i = 0; i < 7; i++) {
    const x = 277 + i * 32,
      y = 77 + (i % 2) * 12;
    px(x - 2, y - 6, 5, 4, '#141f20');
    px(x - 1, y - 6, 2, 1, '#d6b57d');
    if (i === 0 || i === 5) {
      px(x - 1, y + 4, 4, 37, '#846744');
      px(x, y + 6, 1, 32, '#d5ad73');
      px(x - 11, y, 26, 12, i === 5 ? '#a88450' : '#687b76');
      px(x - 10, y + 1, 24, 2, '#d9cf9f');
      px(x + 10, y + 3, 3, 7, '#3e514e');
      px(x - 12, y + 2, 3, 9, '#9eac94');
    } else if (i === 1 || i === 6) {
      secretArtLine(c, x - 6, y + 5, x + 6, y + 39, '#384b49', 4);
      secretArtLine(c, x + 7, y + 5, x - 5, y + 39, '#a6bba9', 3);
      secretArtLine(c, x - 7, y + 5, x - 3, y - 1, '#d6d6ae', 2);
      secretArtLine(c, x + 8, y + 5, x + 3, y - 1, '#9ba998', 2);
      px(x - 2, y + 17, 5, 4, '#c0a475');
      px(x, y + 18, 2, 1, '#f0d09b');
    } else if (i === 2) {
      poly(
        [
          [x - 8, y],
          [x + 9, y],
          [x + 5, y + 37],
          [x - 7, y + 37],
        ],
        '#8f9d8e'
      );
      px(x - 6, y + 2, 13, 2, '#e3d7ac');
      for (let yy = 10; yy < 37; yy += 5) px(x + 5, y + yy, 4, 2, '#c8c9a7');
      px(x - 7, y - 5, 17, 8, '#9a754a');
      px(x - 4, y - 3, 10, 3, '#314340');
    } else if (i === 3) {
      px(x, y + 10, 4, 31, '#9da995');
      px(x, y + 12, 1, 27, '#e2d6ab');
      secretArtOval(c, x + 2, y + 7, 9, 9, '#778a80');
      px(x - 2, y - 2, 8, 10, '#343d33');
      px(x - 5, y + 3, 2, 7, '#ccd3ad');
    } else {
      px(x - 3, y + 2, 8, 16, '#ac8b54');
      px(x - 2, y + 3, 2, 14, '#e2bd79');
      px(x - 1, y + 18, 4, 26, '#829489');
      px(x, y + 19, 1, 21, '#cfd8bb');
      poly(
        [
          [x - 1, y + 42],
          [x + 3, y + 42],
          [x + 1, y + 47],
        ],
        '#d0d4b6'
      );
    }
  }
  secretArtWood(c, 220, 208, 328, 29, true);
  px(218, 208, 332, 3, '#e3bb80');
  px(220, 211, 328, 2, '#533d2b');
  for (const x of [227, 323, 419]) {
    detailInteriorPanel(c, x, 217, 91, 17, '#8b6843', 'pull');
    px(x + 9, 214, 1, 3, '#d2a96e');
  }
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
  poly(
    [
      [278, 180],
      [291, 175],
      [309, 175],
      [307, 188],
      [286, 188],
    ],
    '#7d8d82'
  );
  px(281, 180, 22, 2, '#d5d1ad');
  px(295, 187, 8, 9, '#566c65');
  px(333, 178, 12, 3, '#f2e2b5');
  px(337, 184, 5, 11, '#5d7269');
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
  secretArtWood(c, 55, 279, 67, 14);
  px(61, 291, 55, 11, '#654833');
  for (let i = 0; i < 6; i++) px(60 + i * 9, 280, 4, 10, '#c18a52');
  poly(
    [
      [60, 295],
      [116, 295],
      [128, 306],
      [55, 306],
    ],
    '#937046'
  );
  px(59, 296, 56, 2, '#dbaf6c');
  for (let i = 0; i < 5; i++) secretArtLine(c, 65 + i * 9, 296, 62 + i * 12, 305, '#3e3828');
  px(111, 291, 31, 5, '#b69665');
  px(116, 292, 24, 1, '#e8c58b');
  secretArtLine(c, 62, 278, 101, 265, '#b08e5f', 3);
  px(60, 274, 6, 10, '#5f654b');
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
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    secretArtLine(
      c,
      487 + Math.cos(a) * 30,
      330 + Math.sin(a) * 10,
      487 + Math.cos(a) * 25,
      350 + Math.sin(a) * 7,
      '#a68c60',
      2
    );
  }
  secretArtOval(c, 487, 348, 26, 7, '#6d6147', 2);
  secretArtOval(c, 487, 337, 32, 11, '#b29a69', 1);
  px(464, 329, 2, 14, '#d6b982');
  detailInteriorScroll(c, 426, 359, 42, 19);
  secretArtLine(c, 350, 343, 375, 354, '#b29d73', 3);
  px(371, 351, 15, 6, '#8d9d8d');
  px(372, 351, 13, 2, '#e0d4aa');
  secretArtBottle(c, 573, 328, '#b29a69', 1);
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
  for (const x of [238, 418]) {
    poly(
      [
        [x, 48],
        [x + 14, 44],
        [x + 11, 148],
        [x + 17, 180],
        [x - 4, 188],
        [x + 1, 112],
      ],
      '#77928a'
    );
    secretArtLine(c, x + 5, 52, x + 5, 161, '#b7c5a8', 2);
    secretArtLine(c, x + 9, 55, x + 8, 155, '#4b6b64', 2);
    px(x - 1, 158, 17, 3, '#c5b889');
    for (let y = 70; y < 149; y += 17) px(x + 6, y, 2, 2, '#d3d6b2');
  }
  px(246, 188, 179, 5, '#586e5e');
  px(247, 188, 177, 2, '#d1c9a0');
  px(252, 194, 169, 3, '#364f44');
  for (const x of [274, 291, 308, 356, 373, 390]) {
    px(x, 72, 1, 109, '#7e9c88');
    px(x + 1, 74, 1, 105, '#31574e');
  }
  c.save();
  c.globalAlpha = 0.1;
  poly(
    [
      [254, 194],
      [331, 194],
      [254, 371],
      [95, 371],
    ],
    '#d9e2b6'
  );
  poly(
    [
      [338, 194],
      [416, 194],
      [469, 362],
      [321, 362],
    ],
    '#d9e2b6'
  );
  c.restore();
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
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 6; col++) {
      const x = 126 + col * 10,
        y = 181 + row * 11;
      px(x + 1, y, 8, 10, (row + col) % 2 ? '#72968c' : '#8ba79a');
      px(x + 2, y + 1, 6, 1, '#b8c9af');
      px(x + 3, y + 4, 2, 3, '#587f74');
    }
  for (let x = 128; x < 188; x += 4) px(x, 215 + (x % 3), 1, 3, '#c6d3b5');
  px(69, 176, 48, 2, '#ffedc2');
  px(76, 170, 36, 1, '#e1e3c1');
  px(81, 163, 28, 1, '#ccdbb9');
  px(118, 183, 4, 29, '#465e51');
  px(67, 219, 122, 3, '#414e3c');
  for (const x of [65, 181]) {
    px(x, 189, 7, 50, '#927a52');
    px(x + 1, 190, 2, 46, '#d4ba82');
    secretArtOval(c, x + 3, 187, 6, 5, '#b99d6a');
    px(x + 1, 184, 3, 2, '#e5cca0');
  }
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
  for (let i = 0; i < 18; i++) {
    const a = (i * Math.PI) / 9,
      x = 333 + Math.cos(a) * 74,
      y = 266 + Math.sin(a) * 24;
    px(x - 2, y - 1, 4, 3, i % 3 === 0 ? '#d4d2a8' : '#8aa68d');
    px(x - 1, y - 1, 2, 1, '#e7e0b7');
  }
  secretArtOval(c, 333, 267, 66, 20, '#c1c5a0', 1);
  secretArtOval(c, 333, 271, 75, 24, '#4b6a55', 1);
  px(299, 257, 17, 1, '#b5cdb0');
  px(346, 267, 21, 1, '#bdd9bc');
  for (const x of [52, 205, 470, 575]) secretArtPlant(c, x, 234, x === 470 ? 1.5 : 1);
  secretArtWood(c, 476, 143, 103, 70);
  secretArtBooks(c, 485, 177, 9, 26);
  px(480, 178, 95, 5, '#b49562');
  px(487, 216, 7, 28, '#71583e');
  px(563, 216, 7, 28, '#71583e');
  detailInteriorPanel(c, 482, 188, 44, 21, '#6d6848', 'pull');
  detailInteriorPanel(c, 528, 188, 44, 21, '#756c4a', 'pull');
  secretArtPlant(c, 575, 140, 0.52);
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
  secretArtOval(c, 121, 282, 20, 5, '#6d7256');
  secretArtOval(c, 121, 280, 19, 4, '#d4c89b');
  px(117, 266, 9, 10, '#c5cdb1');
  px(118, 267, 2, 7, '#eff0cc');
  secretArtOval(c, 127, 271, 5, 4, '#bfc2a3', 1);
  px(139, 277, 10, 7, '#b7b397');
  px(140, 277, 8, 2, '#f5e5b9');
  px(140, 279, 7, 1, '#56796a');
  detailInteriorCushion(c, 81, 343, 64, 28, true);
  detailInteriorCushion(c, 483, 355, 69, 29, true);
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
  for (let y = 299; y < 319; y += 5) {
    px(501 - (y - 299) * 0.1, y, 46 + (y - 299) * 0.2, 2, '#6b785a');
    for (let x = 506; x < 542; x += 7) px(x, y - 2, 2, 4, '#c5bb8c');
  }
  px(511, 282, 28, 12, '#b4c6b2');
  px(513, 283, 24, 2, '#e9e6c5');
  px(512, 288, 25, 2, '#75978b');
  px(515, 293, 22, 2, '#e1ddba');
  detailInteriorUrn(c, 583, 319, 0.68, true);
  secretArtPlant(c, 46, 312, 0.83);
  detailInteriorScroll(c, 524, 239, 37, 13, true);
}
function detailSanctumCarving(c, x, y, w, h, kind = 'sun', pale = false) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    line = (a, b, d, e, f, g = 1) => secretArtLine(c, a, b, d, e, f, g),
    stone = pale ? '#798f87' : '#8d7350',
    face = pale ? '#a4b6a2' : '#bd9d6b',
    shadow = pale ? '#415f61' : '#574a35',
    light = pale ? '#d3dec0' : '#ead09a',
    cx = x + w / 2,
    cy = y + h / 2;
  px(x - 2, y + 2, w + 4, h + 2, '#243533');
  px(x, y, w, h, stone);
  px(x + 2, y + 2, w - 4, 2, light);
  px(x + 3, y + 4, 2, h - 8, face);
  px(x + w - 4, y + 4, 2, h - 7, shadow);
  px(x + 6, y + 7, w - 12, h - 14, shadow);
  px(x + 8, y + 9, w - 16, h - 18, stone);
  for (let i = 0; i < 4; i++) {
    const xx = x + 12 + (i * (w - 24)) / 3;
    px(xx, y + 4, 2, 2, shadow);
    px(xx, y + h - 6, 2, 2, shadow);
  }
  if (kind === 'sun') {
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      line(
        cx + Math.cos(a) * 9,
        cy + Math.sin(a) * 9,
        cx + Math.cos(a) * Math.min(w * 0.3, 20),
        cy + Math.sin(a) * Math.min(h * 0.28, 22),
        light,
        2
      );
    }
    secretArtOval(c, cx, cy, 9, 10, shadow);
    secretArtOval(c, cx - 1, cy - 1, 6, 7, face);
    px(cx - 3, cy - 4, 2, 5, light);
  } else if (kind === 'leaves') {
    line(cx, y + 15, cx, y + h - 13, shadow, 3);
    for (let i = 0; i < 4; i++) {
      const yy = y + 16 + (i * (h - 33)) / 4,
        side = i % 2 ? 1 : -1;
      secretArtPoly(
        c,
        [
          [cx, yy + 7],
          [cx + side * 13, yy - 2],
          [cx + side * 17, yy + 2],
          [cx + side * 13, yy + 10],
        ],
        face
      );
      line(cx, yy + 7, cx + side * 13, yy + 2, light);
    }
  } else {
    secretArtPoly(
      c,
      [
        [cx, y + 12],
        [cx + 13, cy],
        [cx, y + h - 11],
        [cx - 13, cy],
      ],
      shadow
    );
    secretArtPoly(
      c,
      [
        [cx, y + 14],
        [cx + 9, cy],
        [cx, y + h - 14],
        [cx - 9, cy],
      ],
      face
    );
    line(cx, y + 15, cx, y + h - 16, light);
    line(cx - 9, cy, cx + 7, cy, shadow);
  }
  for (let i = 0; i < Math.floor((w * h) / 320); i++) {
    const xx = x + 7 + ((i * 17) % Math.max(1, w - 15)),
      yy = y + 8 + ((i * 23) % Math.max(1, h - 16));
    px(xx, yy, 2, 1, i % 2 ? face : shadow);
  }
}
function detailSanctumUrn(c, x, y, scale = 1, pale = false) {
  c.save();
  c.translate(Math.round(x), Math.round(y));
  c.scale(scale, scale);
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    body = pale ? '#9bada1' : '#a67c4d',
    shade = pale ? '#526f70' : '#654d37',
    lit = pale ? '#dae3c2' : '#e2be7d';
  secretArtOval(c, 0, 2, 21, 5, '#263c37');
  secretArtPoly(
    c,
    [
      [-8, -43],
      [8, -43],
      [8, -36],
      [15, -31],
      [18, -19],
      [13, -6],
      [6, -1],
      [-6, -1],
      [-13, -6],
      [-18, -19],
      [-15, -31],
      [-8, -36],
    ],
    shade
  );
  secretArtPoly(
    c,
    [
      [-7, -39],
      [5, -39],
      [5, -33],
      [12, -28],
      [12, -16],
      [7, -5],
      [-6, -5],
      [-12, -16],
      [-12, -28],
      [-7, -33],
    ],
    body
  );
  px(-10, -45, 20, 4, lit);
  px(-8, -41, 16, 2, '#3e5147');
  px(-12, -29, 3, 14, lit);
  px(-13, -14, 26, 2, lit);
  px(-11, -10, 22, 2, shade);
  px(-9, -4, 18, 3, lit);
  for (let i = -1; i <= 1; i++) {
    secretArtPoly(
      c,
      [
        [i * 8, -29],
        [i * 8 + 3, -23],
        [i * 8, -17],
        [i * 8 - 3, -23],
      ],
      shade
    );
    px(i * 8, -26, 1, 5, lit);
  }
  for (const side of [-1, 1]) {
    secretArtOval(c, side * 15, -29, 5, 8, lit, 2);
    px(side < 0 ? -20 : 18, -31, 2, 7, shade);
  }
  c.restore();
}
function detailSanctumGlass(c, x, y, w, h, cool = false) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (points, color) => secretArtPoly(c, points, color),
    line = (a, b, d, e, f, g = 1) => secretArtLine(c, a, b, d, e, f, g),
    colors = cool
      ? ['#41737c', '#72a3a5', '#a6c9bc', '#7d9f9d', '#586e8c']
      : ['#8f4e38', '#c08148', '#ddac62', '#8a9360', '#5e7163'],
    cx = x + w / 2,
    cy = y + h * 0.47;
  px(x, y, w, h, '#313e39');
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6,
      b = ((i + 1) * Math.PI) / 6,
      rx = w * 0.49,
      ry = h * 0.49;
    poly(
      [
        [cx, cy],
        [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry],
        [cx + Math.cos(b) * rx, cy + Math.sin(b) * ry],
      ],
      colors[(i * 3) % colors.length]
    );
    const mid = (a + b) / 2,
      points = [
        [cx + Math.cos(a) * rx * 0.62, cy + Math.sin(a) * ry * 0.62],
        [cx + Math.cos(mid) * rx * 0.9, cy + Math.sin(mid) * ry * 0.9],
        [cx + Math.cos(b) * rx * 0.62, cy + Math.sin(b) * ry * 0.62],
        [cx + Math.cos(mid) * rx * 0.43, cy + Math.sin(mid) * ry * 0.43],
      ];
    poly(points, colors[(i * 3 + 2) % colors.length]);
    for (let j = 0; j < 4; j++)
      line(
        points[j][0],
        points[j][1],
        points[(j + 1) % 4][0],
        points[(j + 1) % 4][1],
        '#435040',
        2
      );
    line(points[0][0] + 1, points[0][1], points[1][0], points[1][1] - 1, '#e8d398');
    line(cx, cy, cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, '#3a493c', 3);
    line(
      cx + Math.cos(a) * 21,
      cy + Math.sin(a) * 21,
      cx + Math.cos(a) * (rx - 12),
      cy + Math.sin(a) * (ry - 12),
      '#e4c58c'
    );
  }
  secretArtOval(c, cx, cy, w * 0.35, h * 0.35, cool ? '#d1dcc1' : '#e6c47e', 3);
  secretArtOval(c, cx, cy, w * 0.35 - 5, h * 0.35 - 5, '#374a41', 2);
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 6; col++) {
      const xx = x + 12 + (col * (w - 24)) / 5,
        yy = y + 11 + (row * (h - 22)) / 4;
      px(xx, yy, 1, 4, row % 2 ? '#d1c198' : '#95a78d');
      px(xx + 2, yy + 2, 4, 1, row % 2 ? '#6c8d81' : '#e7cc8e');
    }
  for (const yy of [y + 6, y + h - 9]) {
    px(x + 4, yy, w - 8, 3, cool ? '#a7bca8' : '#caa26a');
    px(x + 7, yy, w - 14, 1, '#ebd5a1');
  }
}
function secretArtShrine(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'red');
  secretArtArch(c, 172, 28, 296, 208, '#a28a60', '#2a2b24');
  detailSanctumGlass(c, 190, 53, 260, 176);
  for (const side of [-1, 1]) {
    const x = side < 0 ? 40 : 514;
    secretArtWood(c, x, 78, 84, 150);
    px(x + 6, 86, 72, 133, '#73523c');
    for (let i = 0; i < 2; i++) {
      const yy = 90 + i * 65;
      detailSanctumCarving(c, x + 11, yy, 61, 56, i ? 'leaves' : 'sun');
      px(x + 9, yy + 56, 65, 3, '#c5a46b');
    }
    px(x - 3, 75, 90, 6, '#b69762');
    px(x - 2, 75, 88, 1, '#f2ce8e');
    const xx = side < 0 ? 142 : 483;
    secretArtPoly(
      c,
      [
        [xx - 18, 49],
        [xx + 17, 49],
        [xx + 17, 137],
        [xx + 7, 132],
        [xx, 145],
        [xx - 17, 136],
      ],
      '#8c4c3c'
    );
    for (let j = 0; j < 6; j++)
      px(xx - 13 + j * 5, 53, 2, 74 - (j % 3) * 7, j % 2 ? '#a56c4a' : '#623c34');
    px(xx - 19, 46, 38, 4, '#d2ad6c');
    px(xx - 3, 69, 6, 39, '#c9a563');
    secretArtOval(c, xx, 88, 10, 11, '#d6b577', 2);
    for (let j = 0; j < 7; j++) px(xx - 14 + j * 4, 137 + (j % 2) * 4, 1, 6, '#d3b379');
  }
  for (const x of [90, 550]) secretArtPillar(c, x, 256, 192);
  for (const x of [90, 550]) {
    for (let i = 0; i < 6; i++) {
      const y = 79 + i * 26;
      secretArtOval(c, x, y, 6, 9, '#b6a16c', 1);
      px(x - 1, y - 5, 2, 10, '#d9c28b');
      px(x + 3, y + 2, 2, 4, '#444e3f');
    }
    px(x - 11, 70, 2, 169, '#d4b77c');
    px(x + 9, 70, 2, 169, '#384737');
  }
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
    for (let j = 0; j < 12 - i; j++) {
      const xx = x + 8 + (j * (w - 22)) / (11 - i);
      px(xx, y + 5, 3, 5, '#c3a16d');
      px(xx + 1, y + 7, 1, 2, '#66533a');
    }
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
  for (const side of [-1, 1]) {
    const x = 320 + side * 31;
    secretArtLine(c, x - 9, 205, x + 8, 218, '#d2b77d', 2);
    secretArtLine(c, x - 9, 218, x + 8, 205, '#d2b77d', 2);
    px(x - 5, 211, 9, 2, '#594a34');
  }
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
  detailSanctumUrn(c, 120, 303, 1.05);
  detailSanctumUrn(c, 517, 308, 1.16);
  detailSanctumUrn(c, 554, 386, 0.8);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const x = 320 + side * (135 + i * 16),
        y = 293 + i * 26;
      secretArtPoly(
        c,
        [
          [x, y],
          [x + 7, y + 3],
          [x + 4, y + 9],
          [x - 5, y + 6],
        ],
        '#c0ae7a'
      );
      px(x - 1, y + 3, 3, 2, '#776b4c');
    }
  }
  for (let i = 0; i < 12; i++) {
    const x = 208 + i * 20;
    px(x, 385, 6, 2, '#ddbd80');
    px(x + 2, 381, 2, 9, '#bf9c63');
  }
  secretArtBooks(c, 52, 365, 5, 18);
  px(45, 365, 62, 5, '#b99b68');
  px(47, 367, 59, 2, '#765d40');
}
function secretArtTrial(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'red');
  secretArtArch(c, 204, 32, 232, 202, '#887958', '#1a2829');
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 6; col++) {
      const x = 221 + col * 33,
        y = 63 + row * 18;
      px(x, y, 31, 16, (row + col) % 2 ? '#3d504b' : '#48574e');
      px(x + 2, y + 1, 27, 1, '#647566');
      secretArtLine(c, x + 3, y + 3, x + 27, y + 13, '#293f3c');
      secretArtLine(c, x + 3, y + 13, x + 27, y + 3, '#597160');
    }
  }
  for (let x = 225; x < 420; x += 16) {
    px(x, 65, 7, 164, '#45534d');
    px(x + 1, 67, 2, 159, '#a09c76');
    px(x + 5, 68, 1, 157, '#253b37');
    for (const y of [90, 157, 200]) {
      px(x, y, 7, 5, '#b1a06d');
      px(x + 2, y + 1, 2, 2, '#f0cf8b');
      px(x + 4, y + 2, 2, 2, '#4b5442');
    }
  }
  for (const y of [101, 171, 213]) {
    px(222, y, 199, 8, '#665f44');
    px(223, y, 197, 1, '#d0b47c');
    px(224, y + 6, 194, 2, '#263a34');
    for (let x = 230; x < 418; x += 23) px(x, y + 3, 3, 2, '#cbb586');
  }
  px(315, 64, 10, 163, '#6a7057');
  px(316, 65, 2, 161, '#c3b380');
  for (const x of [221, 411]) {
    for (const y of [78, 182]) {
      px(x - 5, y, 17, 18, '#827a57');
      px(x - 4, y + 1, 15, 2, '#d8bb80');
      px(x - 3, y + 3, 3, 12, '#b5a274');
      px(x + 6, y + 4, 3, 12, '#394d42');
      for (const yy of [y + 4, y + 12]) px(x + 2, yy, 2, 2, '#ded09b');
    }
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
    for (const dx of [-7, 0, 7]) {
      px(x + dx, 71, 2, 174, '#a5986b');
      px(x + dx + 2, 73, 1, 171, '#405040');
    }
    for (const yy of [72, 228]) {
      px(x - 15, yy, 30, 8, '#807957');
      px(x - 14, yy, 28, 1, '#d6be83');
      for (let i = 0; i < 4; i++) px(x - 10 + i * 6, yy + 2, 3, 3, '#3d4d3b');
    }
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
    for (let j = 0; j < 5; j++) px(x - 12 + j * 5, 148, 2, 49 - (j % 2) * 10, '#a56c46');
    secretArtLine(c, x - 12, 202, x + 11, 205, '#c49862');
    poly(
      [
        [x, 160],
        [x + 8, 172],
        [x, 184],
        [x - 8, 172],
      ],
      '#ceab71'
    );
    const reliefX = side < 0 ? 38 : 548;
    detailSanctumCarving(c, reliefX, 83, 52, 125, 'crystal');
    px(reliefX - 4, 78, 60, 7, '#d0ac70');
    px(reliefX - 3, 78, 58, 1, '#f1d49a');
    px(reliefX + 4, 207, 44, 9, '#5d674a');
    px(reliefX, 214, 52, 5, '#b6a26c');
  }
  secretArtOval(c, 320, 320, 167, 63, '#2d3430');
  secretArtOval(c, 320, 316, 162, 61, '#ab9563', 3);
  secretArtOval(c, 320, 316, 151, 55, '#65684e', 3);
  secretArtOval(c, 320, 316, 115, 41, '#c4b17c', 2);
  secretArtOval(c, 320, 316, 102, 36, '#494f3e');
  for (let i = 0; i < 36; i++) {
    const a = (i * Math.PI) / 18,
      x = 320 + Math.cos(a) * 139,
      y = 316 + Math.sin(a) * 50;
    secretArtPoly(
      c,
      [
        [x - 2, y - 2],
        [x + 3, y - 1],
        [x + 2, y + 3],
        [x - 3, y + 1],
      ],
      i % 3 ? '#ded2a1' : '#5e7d6b'
    );
    if (i % 3 === 0) {
      secretArtLine(
        c,
        320 + Math.cos(a) * 107,
        316 + Math.sin(a) * 38,
        320 + Math.cos(a) * 151,
        316 + Math.sin(a) * 54,
        '#3c4936'
      );
    }
  }
  for (let i = 0; i < 20; i++) {
    const a = (i * Math.PI) / 10,
      x = 320 + Math.cos(a) * 90,
      y = 316 + Math.sin(a) * 30;
    px(x - 2, y, 5, 2, '#a0a57d');
    px(x, y - 3, 1, 7, '#839970');
  }
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
    detailSanctumCarving(c, x - 10, 294, 20, 31, 'crystal');
  }
  for (const side of [-1, 1]) {
    const x = side < 0 ? 105 : 493;
    secretArtWood(c, x, 361, 47, 22);
    px(x - 3, 356, 53, 7, '#b59c6b');
    px(x - 1, 356, 49, 1, '#e0c58d');
    px(x + 3, 381, 7, 11, '#655842');
    px(x + 36, 381, 7, 11, '#655842');
    for (let j = 0; j < 4; j++) px(x + 4 + j * 11, 366, 4, 10, '#3c4b3a');
    secretArtLine(c, x + 5, 354, x + 37, 351, '#c8c3a2', 3);
    px(x + 31, 347, 9, 5, '#a5b09b');
  }
  secretArtLine(c, 194, 263, 213, 275, '#252f2c', 2);
  secretArtLine(c, 213, 275, 208, 287, '#252f2c', 2);
  secretArtLine(c, 447, 368, 463, 381, '#252f2c', 2);
  secretArtLine(c, 463, 381, 461, 391, '#252f2c');
}
function secretArtWager(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'wood');
  for (const x of [174, 390]) {
    detailInteriorPanel(c, x, 47, 77, 165, '#60472f');
    px(x + 11, 61, 55, 2, '#947044');
    px(x + 11, 194, 55, 2, '#a3814d');
    for (const y of [74, 177])
      secretArtPoly(
        c,
        [
          [x + 38, y - 5],
          [x + 44, y],
          [x + 38, y + 5],
          [x + 32, y],
        ],
        '#ba9b60'
      );
  }
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
    for (let i = 0; i < 6; i++) {
      const xx = x + 9 + i * 10;
      px(xx, 46, 2, 5, '#d9b57e');
      px(xx - 2, 51, 6, 1, '#a77c58');
      px(xx, 52, 2, 6, '#af825c');
      if (i < 3) secretArtLine(c, x + 5 + i * 8, 158, x + 2 + i * 8, 224, '#b47f5c');
    }
    secretArtLine(c, x + 9, 150, x + 20, 166, '#8b5d42', 2);
    secretArtLine(c, x + 40, 150, x + 20, 166, '#f0c38b', 2);
    px(x + 19, 165, 3, 17, '#bd9b62');
    px(x + 16, 181, 9, 5, '#deb374');
    for (let xx = x + 2; xx < x + 28; xx += 5) px(xx, 231, 2, 5, '#c7a26b');
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
  secretArtOval(c, 320, 123, 75, 75, '#e5c58a', 1);
  secretArtOval(c, 320, 123, 69, 69, '#564431', 1);
  for (let i = 0; i < 16; i++) {
    const a = ((i + 0.5) * Math.PI) / 8,
      x = 320 + Math.cos(a) * 46,
      y = 123 + Math.sin(a) * 46;
    px(x - 2, y - 2, 4, 4, '#c4ad78');
    px(x - 1, y - 2, 2, 1, '#f0d89a');
    secretArtLine(
      c,
      320 + Math.cos(a) * 25,
      123 + Math.sin(a) * 25,
      320 + Math.cos(a) * 34,
      123 + Math.sin(a) * 34,
      i % 2 ? '#ae6c4e' : '#678d70',
      2
    );
  }
  secretArtOval(c, 320, 123, 17, 17, '#edcf8a', 1);
  secretArtOval(c, 320, 124, 7, 7, '#a2824c');
  px(317, 118, 5, 3, '#ffebb2');
  poly(
    [
      [313, 40],
      [327, 40],
      [320, 58],
    ],
    '#f2d88b'
  );
  secretArtRug(c, 146, 290, 348, 101, '#713e36', '#c6a675');
  secretArtOval(c, 320, 343, 146, 17, '#382d26');
  for (const x of [203, 422]) {
    secretArtOval(c, x + 6, 347, 14, 4, '#382b23');
    px(x, 286, 13, 61, '#655035');
    px(x + 1, 295, 3, 42, '#b3955d');
    px(x - 3, 307, 19, 4, '#9a7849');
    px(x - 1, 311, 15, 1, '#d9b57a');
    px(x - 4, 340, 21, 6, '#3d3529');
    px(x - 3, 340, 18, 2, '#b48f56');
  }
  secretArtLine(c, 217, 328, 420, 328, '#6f5336', 5);
  secretArtLine(c, 218, 327, 420, 327, '#b48c53');
  secretArtOval(c, 320, 276, 156, 42, '#262c25');
  secretArtOval(c, 320, 273, 154, 39, '#684b2f');
  secretArtOval(c, 320, 267, 154, 39, '#9f7845');
  secretArtOval(c, 320, 265, 145, 33, '#c5a46b');
  secretArtOval(c, 320, 264, 137, 28, '#3a6254');
  secretArtOval(c, 320, 264, 130, 24, '#779575', 1);
  secretArtOval(c, 320, 266, 149, 34, '#f0cf8f', 1);
  for (let i = 0; i < 15; i++) {
    const a = (Math.PI * i) / 14;
    px(319 + Math.cos(a) * 147, 278 + Math.sin(a) * 31, 3, 2, '#c19b60');
  }
  for (let i = 0; i < 14; i++) {
    const x = 203 + i * 17,
      y = 263 + ((i * 7) % 18);
    if (x < 264 || x > 370) px(x, y, 3, 1, '#52725b');
  }
  for (let i = 2; i >= 0; i--) secretArtPlayingCard(c, 269 + i, 251 + i, -0.04, 'A', false, true);
  secretArtPlayingCard(c, 294, 271, -0.09, '7', true);
  secretArtPlayingCard(c, 325, 272, 0.03, 'A', false);
  secretArtPlayingCard(c, 355, 268, 0.12, '3', true);
  secretArtDie(c, 367, 251);
  secretArtDie(c, 386, 262, 1);
  for (const [x, y, count] of [
    [215, 265, 4],
    [227, 269, 2],
    [237, 258, 3],
    [407, 262, 3],
    [418, 270, 2],
    [398, 278, 4],
  ])
    secretArtCoinStack(c, x, y, count);
  for (const [x, y] of [
    [248, 355],
    [394, 367],
  ]) {
    secretArtOval(c, x + 1, y + 1, 5, 2, '#432e25');
    secretArtPixel(c, x - 3, y - 1, 7, 3, '#b28a4e');
    secretArtPixel(c, x - 2, y - 1, 5, 1, '#e4c47e');
  }
  secretArtShelf(c, 42, 79, 98, 139, 'bottles');
  secretArtShelf(c, 500, 79, 98, 139, 'bottles');
  for (const x of [46, 504]) {
    detailInteriorPanel(c, x, 176, 43, 35, '#68482f', 'pull');
    detailInteriorPanel(c, x + 45, 176, 43, 35, '#68482f', 'pull');
  }
  for (const x of [104, 538]) {
    secretArtOval(c, x, 323, 29, 11, '#242b24');
    secretArtOval(c, x, 317, 28, 11, '#866148');
    secretArtOval(c, x, 314, 24, 9, '#a97856');
    px(x - 19, 326, 6, 29, '#6d5939');
    px(x + 13, 326, 6, 29, '#6d5939');
    px(x - 19, 282, 6, 39, '#7a583b');
    px(x + 13, 282, 6, 39, '#7a583b');
    px(x - 19, 280, 38, 6, '#b19059');
    px(x - 16, 286, 32, 21, '#6d4240');
    px(x - 14, 287, 28, 2, '#c89978');
    for (const xx of [x - 8, x + 6]) {
      px(xx, 294, 2, 2, '#d3af7b');
      px(xx, 296, 1, 2, '#402e28');
    }
    secretArtOval(c, x, 314, 21, 7, '#ae7c62');
    secretArtOval(c, x, 313, 20, 5, '#c99a78', 1);
    px(x - 18, 325, 2, 23, '#c0a06c');
    px(x + 13, 325, 2, 23, '#a38557');
  }
  detailInteriorUrn(c, 557, 253, 0.72);
  detailInteriorScroll(c, 67, 248, 43, 16, true);
  px(481, 367, 47, 9, '#624832');
  px(480, 364, 48, 8, '#8e5142');
  px(482, 365, 42, 1, '#e4b17c');
  px(482, 373, 39, 2, '#d4bf92');
  px(517, 365, 3, 9, '#cfac6c');
  secretArtOval(c, 179, 255, 9, 3, '#cdb686');
  px(175, 245, 9, 9, '#adb18e');
  px(176, 245, 7, 2, '#efe0b7');
  secretArtOval(c, 185, 248, 4, 3, '#c9c29b', 1);
}
function secretArtEcho(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'pale');
  secretArtArch(c, 164, 24, 312, 209, '#93a599', '#192e37');
  px(182, 59, 276, 147, '#3a626b');
  px(183, 61, 274, 51, '#547d82');
  px(183, 63, 274, 1, '#799f97');
  secretArtOval(c, 365, 90, 22, 24, '#d9e2c0');
  secretArtOval(c, 373, 83, 20, 22, '#547d82');
  for (let i = 0; i < 8; i++) {
    const x = 190 + i * 38,
      y = 159 + (i % 3) * 13;
    poly(
      [
        [x - 22, 206],
        [x - 6, y - 12],
        [x + 4, y - 28],
        [x + 22, 199],
        [x + 32, 206],
      ],
      i % 2 ? '#345c65' : '#476d6e'
    );
    secretArtLine(c, x + 4, y - 28, x + 8, y - 9, '#96b3a4', 2);
  }
  for (let i = 0; i < 37; i++) {
    const x = 188 + ((i * 47) % 260),
      y = 67 + ((i * 17) % 85);
    if (x < 337 || x > 387 || y > 117) px(x, y, 1, i % 7 ? 1 : 3, i % 4 ? '#9cbbac' : '#f0edd1');
  }
  px(191, 180, 259, 26, '#284c5b');
  for (let i = 0; i < 15; i++) {
    const x = 192 + i * 18;
    px(x, 187 + (i % 3) * 5, 13, 1, '#6d9d9f');
    px(x + 3, 197 + (i % 2) * 4, 7, 1, '#b6cdb6');
  }
  for (let i = 0; i < 15; i++) {
    const x = 181 + i * 20;
    px(x, 57, 1, 143, '#314b51');
    px(x + 4, 78 + ((i * 23) % 91), 1, 1, '#96b9bd');
    if (i % 3 === 0) {
      px(x - 1, 58, 3, 147, '#6e968e');
      px(x, 59, 1, 145, '#bdcbb0');
      for (let j = 0; j < 5; j++) {
        const yy = 79 + j * 25;
        poly(
          [
            [x, yy - 5],
            [x + 5, yy],
            [x, yy + 5],
            [x - 5, yy],
          ],
          '#a7bda6'
        );
        px(x, yy - 2, 1, 4, '#e0e7c9');
      }
    }
  }
  px(181, 150, 277, 3, '#adc2aa');
  px(182, 150, 274, 1, '#e6eacb');
  for (let i = 0; i < 12; i++) {
    const x = 193 + i * 22;
    px(x, 39 + (i % 3) * 4, 1, 23 + (i % 2) * 13, '#6c8d80');
    for (let j = 0; j < 3; j++) {
      const y = 47 + (i % 3) * 4 + j * 8;
      poly(
        [
          [x, y + 2],
          [x - 6, y - 1],
          [x - 5, y - 5],
          [x + 1, y - 2],
        ],
        '#b1c2aa'
      );
      if ((i + j) % 3 === 0) {
        px(x - 5, y - 2, 3, 3, '#edf1d3');
        px(x - 4, y - 1, 1, 1, '#8ab1ac');
      }
    }
  }
  for (const x of [103, 537]) secretArtPillar(c, x, 257, 197, true);
  for (const x of [103, 537]) {
    for (let j = 0; j < 5; j++) {
      const yy = 83 + j * 28;
      secretArtLine(c, x - 5, yy, x + 5, yy + 13, '#b9c7ad', 2);
      secretArtLine(c, x + 5, yy, x - 5, yy + 13, '#c5d3b5');
      px(x - 2, yy + 5, 4, 3, '#516e64');
    }
  }
  for (const x of [54, 480]) {
    px(x, 138, 108, 60, '#344c4d');
    px(x + 3, 141, 102, 54, '#668080');
    px(x + 7, 145, 94, 45, '#aabcb0');
    px(x + 11, 148, 86, 38, '#789991');
    px(x + 12, 149, 84, 14, '#91afa0');
    secretArtOval(c, x + 73, 157, 6, 6, '#dce3c2');
    for (let i = 0; i < 4; i++) {
      const xx = x + 18 + i * 22,
        yy = 166 + (i % 2) * 7;
      poly(
        [
          [xx - 8, 184],
          [xx + 2, yy - 7],
          [xx + 17, 184],
        ],
        '#4f7778'
      );
      secretArtLine(c, xx + 2, yy - 7, xx + 4, yy - 1, '#c0cdb1');
    }
    if (x < 100) {
      px(x + 20, 168, 12, 13, '#bbc8aa');
      poly(
        [
          [x + 17, 169],
          [x + 26, 161],
          [x + 35, 169],
        ],
        '#547371'
      );
      px(x + 25, 173, 4, 7, '#547371');
      px(x + 40, 175, 8, 7, '#bbc8aa');
      poly(
        [
          [x + 37, 175],
          [x + 44, 168],
          [x + 51, 175],
        ],
        '#547371'
      );
    } else {
      px(x + 31, 158, 8, 23, '#b8c9ac');
      px(x + 52, 161, 7, 20, '#b8c9ac');
      px(x + 28, 157, 14, 3, '#e0e3be');
      px(x + 49, 160, 13, 3, '#e0e3be');
      px(x + 36, 166, 19, 4, '#b8c9ac');
      px(x + 40, 170, 10, 10, '#4e7272');
      px(x + 42, 169, 6, 2, '#70958b');
    }
    px(x + 12, 182, 83, 2, '#b8cab2');
    for (let i = 0; i < 8; i++) px(x + 14 + i * 11, 184, 5, 1, '#d5ddbd');
    px(x + 3, 198, 103, 5, '#9caa8b');
    for (let i = 0; i < 5; i++) {
      const xx = x + 9 + i * 20;
      px(xx, 142, 5, 3, '#dce1c3');
      px(xx + 1, 192, 5, 3, '#dce1c3');
    }
    px(x + 8, 146, 1, 42, '#dce1c3');
    px(x + 100, 147, 1, 41, '#51716c');
  }
  for (const x of [48, 491]) {
    secretArtWood(c, x, 228, 100, 12);
    px(x + 5, 241, 7, 34, '#7f8d73');
    px(x + 87, 241, 7, 34, '#687d68');
    for (let j = 0; j < 4; j++) {
      const xx = x + 17 + j * 22;
      detailSanctumUrn(c, xx, 228, 0.37, true);
      px(xx - 1, 209, 2, 4, '#dce8cb');
    }
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
  for (let i = 0; i < 37; i++) {
    const a = (i * Math.PI * 2) / 37,
      x = 320 + Math.cos(a) * 106,
      y = 271 + Math.sin(a) * 38;
    secretArtPoly(
      c,
      [
        [x, y - 3],
        [x + 3, y],
        [x, y + 4],
        [x - 3, y],
      ],
      i % 3 ? '#d4d9b7' : '#789d91'
    );
  }
  for (let i = 0; i < 25; i++) {
    const x = 252 + ((i * 23) % 137),
      y = 249 + ((i * 7) % 30);
    px(x, y, 4 + (i % 3) * 4, 1, i % 2 ? '#78a4ae' : '#a7c7c0');
  }
  for (let i = 0; i < 7; i++) {
    const a = (i * Math.PI * 2) / 7,
      x = 320 + Math.cos(a) * 112,
      y = 274 + Math.sin(a) * 43;
    px(x - 5, y - 11, 10, 11, '#8eaaa3');
    px(x - 6, y - 12, 12, 2, '#d6dfbd');
  }
  secretArtOval(c, 320, 212, 31, 7, '#4e8792', 1);
  secretArtCrystal(c, 320, 169, 1.02, 'blue');
  secretArtCrystal(c, 291, 187, 0.3, 'blue');
  secretArtCrystal(c, 347, 155, 0.3, 'blue');
  for (const side of [-1, 1]) {
    const x = 320 + side * 63;
    secretArtLine(c, x, 34, x, 110, '#abc1ad');
    secretArtOval(c, x, 111, 7, 9, '#d3dfbd', 2);
    px(x - 2, 121, 4, 16, '#81b2b1');
    px(x - 1, 123, 1, 12, '#e2ebcf');
  }
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
  detailSanctumUrn(c, 113, 351, 0.92, true);
  detailSanctumUrn(c, 521, 347, 0.84, true);
  for (let i = 0; i < 6; i++) {
    const x = 237 + i * 31;
    secretArtLine(c, x, 311, x + 10, 323, '#c0d0ad');
    secretArtLine(c, x + 10, 323, x + 21, 311, '#c0d0ad');
    px(x + 9, 319, 3, 7, '#e0e6c1');
    px(x + 9, 378, 3, 7, '#e0e6c1');
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
  for (const x of [256, 318, 382]) {
    px(x, 50, 1, 132, '#bba777');
    px(x + 1, 51, 1, 130, '#e7d2a5');
  }
  px(202, 117, 238, 1, '#bca779');
  px(202, 118, 238, 1, '#e1cfa2');
  for (const [x, y, w] of [
    [217, 78, 26],
    [261, 147, 36],
    [350, 88, 33],
    [390, 166, 31],
  ]) {
    for (let i = 0; i < 3; i++) px(x + (i % 2) * 3, y + i * 3, w - i * 5, 1, '#9f906a');
  }
  for (const [x, y] of [
    [228, 145],
    [352, 110],
    [405, 136],
  ]) {
    px(x - 6, y - 3, 5, 6, '#8e8360');
    px(x + 1, y - 1, 5, 5, '#8e8360');
    poly(
      [
        [x - 8, y - 3],
        [x - 4, y - 7],
        [x, y - 3],
      ],
      '#765f43'
    );
    poly(
      [
        [x, y - 1],
        [x + 3, y - 5],
        [x + 7, y - 1],
      ],
      '#765f43'
    );
    px(x - 4, y, 1, 3, '#d5bf91');
  }
  for (const [x, y] of [
    [211, 96],
    [286, 166],
    [371, 62],
  ]) {
    secretArtLine(c, x, y, x + 9, y + 6, '#b19e73');
    secretArtLine(c, x + 9, y + 6, x + 17, y + 1, '#b19e73');
    secretArtLine(c, x + 2, y + 4, x + 11, y + 10, '#b19e73');
    secretArtLine(c, x + 11, y + 10, x + 19, y + 5, '#b19e73');
  }
  for (const x of [201, 436]) {
    px(x, 48, 5, 5, '#6a5b40');
    px(x + 1, 48, 2, 2, '#efdeb0');
    px(x, 177, 5, 5, '#6a5b40');
    px(x + 1, 177, 2, 2, '#efdeb0');
  }
  detailInteriorScroll(c, 160, 80, 24, 37);
  detailInteriorScroll(c, 455, 130, 27, 29);
  secretArtShelf(c, 59, 74, 98, 146);
  secretArtShelf(c, 489, 72, 93, 148);
  for (const x of [59, 489]) {
    px(x - 5, 62, 103, 9, '#a08457');
    px(x - 3, 62, 99, 2, '#ddbc80');
    px(x - 6, 68, 105, 3, '#5d472f');
    for (const xx of [x + 4, x + 82]) {
      px(xx, 77, 4, 132, '#b69764');
      px(xx + 1, 79, 1, 128, '#dfc18c');
      px(xx - 2, 207, 9, 5, '#c7a777');
    }
  }
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
      [180, 263],
      [448, 263],
      [451, 269],
      [176, 269],
    ],
    '#624b32'
  );
  secretArtLine(c, 183, 264, 445, 264, '#e2bc80');
  for (const x of [188, 426]) {
    px(x + 1, 272, 3, 59, '#bc9c67');
    px(x - 3, 282, 17, 5, '#97784e');
    px(x - 3, 329, 18, 9, '#806541');
    px(x - 5, 338, 22, 3, '#b59660');
  }
  secretArtLine(c, 203, 314, 422, 314, '#6e5535', 7);
  secretArtLine(c, 204, 314, 420, 314, '#ba955b');
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
  poly(
    [
      [410, 205],
      [418, 192],
      [422, 197],
      [414, 210],
    ],
    '#c9d4b3'
  );
  secretArtLine(c, 408, 211, 419, 196, '#f4e9c3');
  px(400, 219, 3, 9, '#e0d6ab');
  px(400, 227, 11, 2, '#233d3c');
  secretArtOval(c, 387, 242, 15, 6, '#e8c784', 1);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    px(387 + Math.cos(a) * 12, 241 + Math.sin(a) * 4, 2, 1, '#f6e4b4');
  }
  secretArtLine(c, 385, 241, 393, 239, '#a44f3d', 2);
  secretArtLine(c, 385, 241, 380, 243, '#e1dac3', 2);
  secretArtOval(c, 211, 236, 12, 6, '#b99a60', 1);
  secretArtLine(c, 218, 241, 224, 247, '#9b7445', 4);
  px(208, 232, 5, 1, '#d5e1c7');
  detailInteriorScroll(c, 291, 214, 46, 10, true);
  px(257, 255, 56, 4, '#775d3e');
  for (let x = 261; x < 309; x += 5) px(x, 255, 1, 2, '#e0c080');
  secretArtOval(c, 533, 292, 40, 16, '#343c30');
  secretArtOval(c, 533, 280, 29, 29, '#879780');
  secretArtOval(c, 533, 280, 24, 24, '#b1c2a2');
  for (let i = -1; i <= 1; i++) secretArtOval(c, 533, 280, 7 + Math.abs(i) * 9, 23, '#6c8a7a', 1);
  secretArtOval(c, 533, 280, 24, 7, '#6c8a7a', 1);
  poly(
    [
      [520, 265],
      [529, 260],
      [537, 265],
      [535, 273],
      [541, 279],
      [535, 283],
      [527, 277],
      [521, 278],
    ],
    '#78977c'
  );
  poly(
    [
      [539, 286],
      [547, 282],
      [552, 286],
      [548, 294],
      [540, 298],
      [536, 291],
    ],
    '#829974'
  );
  secretArtLine(c, 522, 267, 530, 264, '#d1cf9d');
  secretArtLine(c, 540, 288, 546, 286, '#cccea0');
  px(516, 274, 2, 10, '#dce4bd');
  secretArtOval(c, 533, 280, 34, 31, '#c8a96e', 1);
  secretArtLine(c, 516, 251, 548, 307, '#ceb579', 2);
  px(526, 307, 14, 11, '#8f754e');
  px(513, 316, 41, 5, '#b89b63');
  px(514, 317, 39, 1, '#e3c38a');
  px(518, 322, 32, 3, '#5a5137');
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
  detailInteriorPanel(c, 60, 333, 83, 25, '#85653f', 'pull');
  detailInteriorScroll(c, 72, 371, 48, 15, true);
  detailInteriorScroll(c, 125, 377, 41, 13);
  detailInteriorUrn(c, 578, 306, 0.74, true);
  poly(
    [
      [461, 295],
      [475, 285],
      [494, 287],
      [503, 299],
      [497, 320],
      [464, 320],
      [458, 308],
    ],
    '#776242'
  );
  px(464, 296, 32, 18, '#9d8054');
  px(466, 297, 28, 2, '#d2b37a');
  px(477, 295, 7, 19, '#594e34');
  px(478, 301, 5, 5, '#d0b175');
  secretArtLine(c, 462, 292, 475, 279, '#c2a575', 2);
  secretArtLine(c, 475, 279, 495, 291, '#c2a575', 2);
}
function secretArtArmory(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'pale');
  secretArtArch(c, 216, 33, 208, 198, '#9b9b7b', '#1a343d');
  for (let row = 0; row < 8; row++) {
    const y = 66 + row * 20;
    px(233, y, 174, 17, row % 2 ? '#365660' : '#3f6167');
    px(235, y, 170, 1, '#668b88');
    for (let col = 0; col < 7; col++) {
      const x = 241 + col * 23;
      px(x, y + 5, 1, 6, '#759b8f');
      px(x - 3, y + 8, 7, 1, '#759b8f');
      px(x - 1, y + 11, 3, 2, '#253e48');
    }
  }
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
  secretArtOval(c, 320, 132, 80, 80, '#384e4f', 3);
  secretArtOval(c, 320, 132, 77, 77, '#c9c391', 1);
  for (let i = 0; i < 24; i++) {
    const a = (i * Math.PI) / 12,
      x = 320 + Math.cos(a) * 67,
      y = 132 + Math.sin(a) * 67;
    secretArtLine(
      c,
      x - Math.sin(a) * 3,
      y + Math.cos(a) * 3,
      x + Math.sin(a) * 3,
      y - Math.cos(a) * 3,
      '#e1d4a1',
      2
    );
    px(x - 1, y - 1, 2, 2, i % 3 ? '#d2cf9b' : '#edf0cb');
  }
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 7,
      x = 320 + Math.cos(a) * 48,
      y = 132 + Math.sin(a) * 48;
    secretArtOval(c, x, y, 5, 5, '#c3c8a2');
    secretArtOval(c, x, y, 3, 3, '#537b7b');
    px(x - 1, y - 2, 2, 2, '#dbe8c8');
  }
  for (const side of [-1, 1]) {
    const x = side < 0 ? 61 : 464;
    secretArtWood(c, x, 67, 114, 166);
    px(x + 8, 77, 98, 146, '#1a3037');
    for (let i = 0; i < 3; i++) {
      const y = 109 + i * 48;
      px(x + 11, y + 18, 92, 4, '#a99869');
      px(x + 12, y + 18, 90, 1, '#e1cba0');
      for (let j = 0; j < 2; j++) {
        const xx = x + 31 + j * 45,
          kind = i * 2 + j,
          tint = ['#acd8cd', '#e7c68a', '#aad299', '#daafc0', '#a9c9dc', '#ebd9a0'][kind];
        px(xx - 17, y - 25, 34, 42, '#203d47');
        px(xx - 15, y - 23, 30, 2, '#76968b');
        px(xx - 15, y - 21, 1, 34, '#c4d7ba');
        px(xx + 14, y - 20, 1, 33, '#577f80');
        px(xx - 12, y + 10, 25, 4, '#879c80');
        px(xx - 10, y + 10, 21, 1, '#d4d7aa');
        if (kind === 0) {
          secretArtCrystal(c, xx, y - 7, 0.36, 'blue');
          secretArtOval(c, xx, y - 6, 11, 3, tint, 1);
        } else if (kind === 1) {
          for (let k = 0; k < 3; k++) {
            const a = (k * Math.PI * 2) / 3;
            secretArtPoly(
              c,
              [
                [xx + Math.cos(a) * 4, y - 7 + Math.sin(a) * 4],
                [xx + Math.cos(a + 0.5) * 14, y - 7 + Math.sin(a + 0.5) * 14],
                [xx + Math.cos(a + 0.8) * 10, y - 7 + Math.sin(a + 0.8) * 10],
              ],
              tint
            );
          }
          secretArtOval(c, xx, y - 7, 4, 4, '#fcf0bc');
        } else if (kind === 2) {
          for (let k = 0; k < 4; k++)
            secretArtOval(c, xx + (k % 2 ? 4 : -4), y - 14 + k * 4, 6, 4, tint, 1);
          px(xx - 1, y - 20, 2, 23, '#e1edbd');
        } else if (kind === 3) {
          secretArtOval(c, xx, y - 7, 11, 11, tint, 2);
          secretArtOval(c, xx, y - 7, 6, 6, '#8ba3bc', 1);
          secretArtStar(c, xx, y - 7, '#f3ecd1', 4);
        } else if (kind === 4) {
          secretArtLine(c, xx - 10, y - 17, xx + 9, y + 2, tint, 2);
          secretArtLine(c, xx - 10, y + 2, xx + 9, y - 17, tint, 2);
          for (const dx of [-10, 9])
            for (const yy of [y - 17, y + 2]) secretArtStar(c, xx + dx, yy, '#e8efcb', 2);
        } else {
          secretArtOval(c, xx, y - 7, 12, 9, tint, 2);
          secretArtPoly(
            c,
            [
              [xx, y - 21],
              [xx + 6, y - 6],
              [xx, y + 4],
              [xx - 6, y - 6],
            ],
            '#e4f0c8'
          );
          px(xx, y - 16, 1, 14, '#8dab98');
        }
        px(xx - 5, y + 22, 10, 3, '#d1c293');
        px(xx - 3, y + 23, 6, 1, '#697c66');
      }
    }
    px(x + 54, 76, 4, 148, '#b6af82');
    px(x + 11, 80, 1, 136, '#93b1ac');
    px(x + 100, 82, 1, 135, '#55767a');
    for (let y = 91; y < 206; y += 32) secretArtLine(c, x + 12, y, x + 38, y - 12, '#436371');
    px(x - 4, 61, 122, 8, '#b7b285');
    px(x - 3, 61, 120, 1, '#f0ddb0');
    for (const yy of [71, 218])
      for (let j = 0; j < 6; j++) {
        px(x + 9 + j * 18, yy, 7, 3, '#c3c49b');
        px(x + 11 + j * 18, yy + 1, 2, 1, '#526f68');
      }
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
  detailSanctumCarving(c, 308, 234, 24, 31, 'crystal', true);
  secretArtOval(c, 320, 269, 64, 19, '#d1d3a8', 1);
  for (let i = 0; i < 20; i++) {
    const a = (i * Math.PI) / 10,
      x = 320 + Math.cos(a) * 71,
      y = 274 + Math.sin(a) * 22;
    px(x - 1, y - 1, 3, 2, '#e4d6a0');
    px(x, y + 1, 1, 2, '#4b6c66');
  }
  secretArtCrystal(c, 320, 202, 1.4, 'blue');
  for (const x of [77, 562]) {
    px(x - 17, 315, 34, 31, '#5b6d61');
    px(x - 21, 310, 42, 6, '#acac7c');
    secretArtCrystal(c, x, 292, 0.62, x === 77 ? 'rose' : 'gold');
    for (const dx of [-11, -4, 4, 11]) px(x + dx, 322, 2, 19, '#97ac8b');
    px(x - 17, 346, 34, 4, '#b4b18a');
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
  for (const side of [-1, 1]) {
    const x = side < 0 ? 134 : 483;
    secretArtWood(c, x, 331, 27, 56);
    px(x - 5, 325, 37, 8, '#aaa87b');
    px(x - 4, 325, 35, 2, '#e9d9a3');
    detailSanctumCarving(c, x + 2, 338, 23, 37, 'crystal', true);
    secretArtOval(c, x + 13, 316, 10, 9, '#849e91');
    px(x + 8, 312, 8, 7, '#d0dcb6');
    px(x + 10, 313, 4, 5, '#627e78');
  }
  for (let i = 0; i < 9; i++) {
    const x = 234 + i * 21;
    px(x, 374, 4, 2, '#d6d6a3');
    px(x + 1, 371, 2, 8, '#9ab49b');
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
  for (const x of [46, 206]) {
    px(x, 75, 7, 136, '#a48355');
    px(x + 1, 77, 2, 131, '#d4b27a');
    for (const y of [94, 147, 195]) {
      px(x - 2, y, 11, 4, '#5e5238');
      px(x - 1, y, 8, 1, '#d3b278');
      px(x + 2, y + 2, 3, 2, '#d8b77e');
    }
  }
  detailInteriorPanel(c, 52, 184, 76, 28, '#705438', 'pull');
  detailInteriorPanel(c, 130, 184, 76, 28, '#775a3b', 'pull');
  px(38, 62, 189, 8, '#7c6242');
  px(39, 62, 187, 2, '#c5a472');
  for (const x of [211, 220]) {
    px(x, 84, 8, 30, '#242d26');
    px(x + 1, 86, 5, 25, '#aa9260');
    px(x + 2, 90, 3, 3, '#e7cf94');
    px(x + 2, 104, 3, 3, '#3e4731');
  }
  secretArtArch(c, 252, 27, 293, 218, '#716d51', '#10292e');
  px(272, 63, 251, 166, '#1b3b3c');
  px(291, 82, 211, 148, '#315353');
  secretArtArch(c, 319, 88, 151, 141, '#8c9a7d', '#15343b');
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 4; col++) {
      const x = 332 + col * 31,
        y = 117 + row * 23;
      px(x + 1, y, 29, 21, (row + col) % 2 ? '#375650' : '#314e49');
      px(x + 3, y + 1, 24, 1, '#729079');
      px(x + 3, y + 19, 23, 1, '#213e39');
      px(x + 26, y + 3, 1, 12, '#25433f');
    }
  secretArtOval(c, 397, 138, 28, 28, '#9caa86');
  secretArtOval(c, 397, 138, 24, 24, '#183b3c');
  secretArtOval(c, 397, 138, 21, 21, '#567e72');
  secretArtOval(c, 397, 138, 17, 17, '#89a38a');
  secretArtLine(c, 397, 117, 397, 159, '#c9c59b', 2);
  secretArtLine(c, 376, 138, 418, 138, '#c9c59b', 2);
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2;
    px(396 + Math.cos(a) * 14, 137 + Math.sin(a) * 14, 3, 3, '#e5d8a7');
  }
  px(335, 173, 121, 4, '#72866c');
  px(336, 173, 119, 1, '#b0be91');
  for (let i = 0; i < 4; i++) {
    const y = 203 + i * 16;
    px(283 - i * 7, y, 225 + i * 14, 16, '#6f8069');
    px(284 - i * 7, y, 223 + i * 14, 2, '#a2b48a');
    px(287 - i * 7, y + 13, 215 + i * 14, 2, '#324d42');
  }
  secretArtChest(c, 360, 174, 83, s.claimed);
  px(367, 216, 69, 1, '#d2b976');
  for (const x of [370, 424]) {
    px(x, 201, 3, 3, '#e5c98b');
    px(x + 1, 202, 1, 1, '#37432c');
  }
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
    secretArtLine(c, x + 5, y + 5, x + 8, y + h - 10, '#6a7259');
    px(x + w - 5, y + 5, 2, h - 10, '#393f33');
    px(x + 7, y + 6, 3, 2, '#a0a580');
    if (y % 2) {
      secretArtLine(c, x + w - 9, y + 7, x + w - 12, y + 13, '#303d31');
      secretArtLine(c, x + w - 12, y + 13, x + w - 6, y + 20, '#303d31');
    }
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
    secretArtLine(c, x + 4, y + 2, x + 8, y + 8, '#7f8368');
    secretArtLine(c, x + w + 1, y + 2, x + w + 3, y + 6, '#393e30');
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
  px(185, 208, 44, 3, '#b99862');
  secretArtLine(c, 187, 211, 191, 255, '#c7ad7a', 2);
  secretArtLine(c, 225, 210, 231, 250, '#584b31', 2);
  poly(
    [
      [192, 220],
      [220, 217],
      [223, 239],
      [196, 242],
    ],
    '#284843'
  );
  poly(
    [
      [195, 236],
      [206, 221],
      [220, 236],
    ],
    '#8a9a78'
  );
  px(208, 223, 2, 5, '#d3cda2');
  secretArtOval(c, 214, 222, 3, 3, '#d8cc9a');
  detailInteriorUrn(c, 126, 278, 0.8, true);
  px(112, 258, 19, 4, '#34544d');
  poly(
    [
      [121, 247],
      [127, 248],
      [126, 264],
      [121, 261],
    ],
    '#233c38'
  );
  secretArtLine(c, 124, 247, 124, 258, '#abc1a2');
  poly(
    [
      [150, 282],
      [162, 282],
      [165, 289],
      [156, 295],
      [150, 291],
    ],
    '#668a78'
  );
  secretArtLine(c, 151, 282, 160, 283, '#c0ceb0');
  poly(
    [
      [134, 295],
      [143, 292],
      [150, 298],
      [140, 301],
    ],
    '#7c9a81'
  );
  secretArtLine(c, 135, 295, 142, 293, '#ccd6b2');
  for (const [x, y] of [
    [290, 342],
    [318, 325],
    [346, 310],
    [369, 294],
  ]) {
    secretArtOval(c, x, y, 6, 3, '#363f30');
    secretArtOval(c, x + 8, y + 7, 5, 3, '#3c4434');
    px(x - 3, y - 2, 4, 1, '#90977a');
  }
  secretArtLine(c, 489, 281, 505, 338, '#5d6250', 4);
  secretArtLine(c, 490, 282, 504, 335, '#a9b491');
  secretArtLine(c, 489, 281, 498, 274, '#bec6a3', 3);
  secretArtLine(c, 504, 338, 515, 337, '#bec6a3', 3);
  detailInteriorScroll(c, 548, 311, 31, 12, true);
  for (let i = 0; i < 7; i++) {
    const y = 79 + i * 17,
      x = 550 + (i % 3) * 3;
    secretArtLine(c, x, y, x - 3, y + 18, '#5e7752', 2);
    poly(
      [
        [x, y + 3],
        [x + 9, y - 2],
        [x + 12, y + 3],
        [x + 5, y + 8],
      ],
      '#80976a'
    );
    px(x + 3, y + 3, 5, 1, '#bec597');
  }
}
function secretArtDeep(c, s) {
  const px = (a, b, d, e, f) => secretArtPixel(c, a, b, d, e, f),
    poly = (p, col) => secretArtPoly(c, p, col);
  secretArtRoom(c, s, 'deep');
  secretArtArch(c, 118, 20, 404, 230, '#676f75', '#101d2c');
  px(140, 70, 360, 167, '#263f51');
  px(142, 72, 356, 77, '#365565');
  px(142, 73, 356, 31, '#456775');
  secretArtOval(c, 321, 89, 31, 30, '#869f9f');
  secretArtOval(c, 321, 89, 24, 24, '#b7c4ad');
  secretArtOval(c, 321, 89, 20, 20, '#60818a');
  secretArtLine(c, 316, 66, 323, 82, '#e5dfba', 2);
  secretArtLine(c, 323, 82, 315, 97, '#e5dfba', 2);
  secretArtLine(c, 315, 97, 323, 111, '#e5dfba', 2);
  for (let i = 0; i < 8; i++) {
    const x = 146 + i * 44;
    px(x, 121 + (i % 2) * 6, 31, 2, '#648590');
    px(x + 9, 117 + (i % 2) * 6, 17, 1, '#8caaa8');
  }
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
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const x = side < 0 ? 149 + i * 38 : 460 - i * 38,
        y = 156 + (i % 2) * 11,
        h = 73 - (i % 2) * 8;
      px(x - 8, y, 18, h, '#3e5b68');
      px(x - 9, y - 4, 20, 6, '#718993');
      px(x - 8, y - 4, 18, 1, '#aec0b5');
      px(x - 5, y + 4, 3, h - 5, '#739196');
      px(x + 6, y + 4, 2, h - 6, '#273f50');
      for (let j = 0; j < 4; j++) {
        const yy = y + 10 + j * 13;
        px(x - 1, yy, 4, 6, '#d3d0a6');
        px(x, yy + 1, 1, 4, '#eae0b0');
      }
      px(x - 13, 223, 27, 8, '#506975');
      px(x - 12, 223, 25, 2, '#91a5a2');
    }
  }
  px(143, 190, 354, 7, '#6e8990');
  px(143, 190, 354, 1, '#a3b9af');
  px(143, 197, 354, 4, '#243d4c');
  for (let i = 0; i < 10; i++) {
    const x = 151 + i * 35;
    px(x, 183, 5, 8, '#7d9698');
    px(x - 2, 182, 9, 2, '#a7b5a6');
    secretArtPoly(
      c,
      [
        [x + 7, 202],
        [x + 11, 207],
        [x + 11, 226],
        [x + 26, 226],
        [x + 26, 207],
        [x + 30, 202],
      ],
      '#476572'
    );
    px(x + 13, 205, 11, 2, '#6b8890');
  }
  for (const x of [150, 468]) {
    secretArtPoly(
      c,
      [
        [x - 5, 138],
        [x, 129],
        [x + 9, 129],
        [x + 14, 138],
        [x + 12, 146],
        [x - 3, 146],
      ],
      '#9fb2a6'
    );
    px(x - 3, 138, 15, 3, '#d6d6b6');
    px(x + 1, 133, 3, 5, '#ecdfb1');
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
    '#29444f'
  );
  for (let i = 0; i < 53; i++) {
    const y = 246 + ((i * 17) % 167),
      spread = 165 + (y - 240) * 0.45,
      x = 320 - spread + ((i * 43) % (spread * 2));
    px(x, y, 7 + (i % 4) * 6, 1, i % 3 ? '#517982' : '#8ca4a3');
    if (i % 5 === 0) px(x + 4, y + 2, 8, 1, '#b5bfa7');
  }
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
    px(x + 3, y + 3, w - 6, 2, '#7f9595');
    for (let j = 0; j < 7 + i * 2; j++) {
      const xx = x + 6 + (j * (w - 14)) / (6 + i * 2);
      px(xx, y + 4, 1, 10, '#364c55');
      px(xx + 1, y + 4, 1, 9, '#7d9592');
    }
    for (const side of [-1, 1]) {
      const xx = side < 0 ? x - 14 : x + w + 6;
      px(xx, y - 12, 8, 31, '#607b80');
      px(xx + 1, y - 11, 2, 29, '#b6c3b1');
      px(xx - 4, y - 15, 16, 5, '#a7b7a4');
      px(xx - 3, y - 15, 14, 1, '#e5dfb9');
      px(xx - 3, y + 18, 14, 4, '#829b94');
    }
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
    for (let i = 0; i < 4; i++) {
      const yy = 149 + i * 8;
      secretArtPoly(
        c,
        [
          [x, yy - 3],
          [x + 5, yy + 2],
          [x, yy + 7],
          [x - 5, yy + 2],
        ],
        '#91aaa5'
      );
      px(x, yy, 1, 4, '#cfdbc0');
    }
    for (const dx of [-7, 0, 7]) {
      px(x + dx, 190, 2, 86, '#b1bdac');
      px(x + dx + 2, 191, 1, 85, '#405d62');
    }
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
  for (const side of [-1, 1]) {
    const x = side < 0 ? 40 : 522;
    secretArtPoly(
      c,
      [
        [x, 323],
        [x + 51, 316],
        [x + 78, 420],
        [x - 10, 420],
      ],
      '#677d7d'
    );
    secretArtLine(c, x + 3, 324, x + 48, 319, '#c5ccb1', 2);
    for (let i = 0; i < 5; i++) {
      const y = 338 + i * 17;
      px(x - 2, y, 60 + i * 3, 2, '#93a49a');
      px(x, y + 2, 57 + i * 3, 1, '#354e57');
    }
    detailSanctumCarving(c, x + 9, 350, 41, 61, 'leaves', true);
    detailSanctumUrn(c, x + 24, 332, 0.75, true);
    secretArtCrystal(c, x + 26, 291, 0.35, 'blue');
  }
  for (const side of [-1, 1]) {
    const x = side < 0 ? 61 : 563;
    secretArtLine(c, x, 20, x, 95, '#95a9a1');
    secretArtOval(c, x, 101, 9, 12, '#c6cdb3', 2);
    px(x - 4, 97, 8, 12, '#7babb1');
    px(x - 2, 99, 2, 8, '#e8ebc7');
    px(x - 12, 113, 24, 3, '#b7bba0');
  }
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
  for (const x of [59, 466]) {
    secretArtShelf(c, x, 67, 114, 159, 'bottles');
    px(x - 3, 55, 120, 12, '#8f704a');
    px(x - 2, 55, 118, 2, '#e0bd82');
    px(x + 5, 59, 104, 4, '#b29362');
    for (let i = 0; i < 7; i++) {
      const xx = x + 9 + i * 15;
      px(xx, 58, 4, 4, '#68593f');
      px(xx + 1, 59, 2, 1, '#d8c089');
    }
    for (let row = 0; row < 3; row++) {
      const yy = 99 + row * 41;
      px(x + 9, yy - 25, 95, 1, '#466655');
      for (let col = 0; col < 4; col++) {
        const xx = x + 21 + col * 23;
        px(xx - 6, yy - 9, 12, 6, '#d4c391');
        px(xx - 4, yy - 8, 8, 1, '#736b4b');
        px(xx - 3, yy - 5, 6, 1, '#9e8d63');
        if ((row + col) % 3 === 0) {
          px(xx - 8, yy - 25, 17, 5, '#ae9767');
          px(xx - 6, yy - 19, 13, 8, '#99b39a');
          px(xx - 5, yy - 18, 2, 6, '#e5e5b5');
          secretArtPoly(
            c,
            [
              [xx - 2, yy - 16],
              [xx + 3, yy - 17],
              [xx + 5, yy - 12],
              [xx, yy - 10],
            ],
            '#71825c'
          );
        }
      }
    }
    for (const dx of [5, 106]) {
      px(x + dx, 79, 2, 138, '#c2a36e');
      for (const y of [81, 159, 206]) {
        px(x + dx - 1, y, 4, 8, '#b29c65');
        px(x + dx, y + 2, 1, 3, '#eee0a0');
      }
    }
  }
  for (const x of [213, 425]) {
    const side = x < 320 ? 1 : -1;
    poly(
      [
        [x - 11, 52],
        [x + 12, 52],
        [x + side * 10, 104],
        [x - side * 2, 132],
        [x - side * 13, 160],
        [x - 12, 112],
      ],
      '#697f60'
    );
    for (let i = 0; i < 5; i++) {
      px(x - 8 + i * 4, 56, 1, 47 + (i % 2) * 16, '#9baa79');
      px(x - 8 + i * 4, 58, 1, 11, '#c6c68b');
    }
    secretArtLine(c, x - side * 9, 109, x + side * 5, 115, '#d4b77e', 2);
  }
  for (let i = 0; i < 4; i++) {
    const x = 238 + i * 51;
    secretArtLine(c, x, 32, x + 29, 48, '#b0bd94');
    secretArtLine(c, x + 29, 48, x + 49, 33, '#a0ac83');
    px(x + 27, 45, 4, 7, '#e5c58a');
  }
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
    px(x + 5, 295, 36, 2, '#b49a68');
    px(x + 4, 258, 2, 36, '#d0b27a');
    px(x + 39, 260, 2, 35, '#443d2c');
    for (const xx of [x + 7, x + 36]) for (const yy of [262, 292]) px(xx, yy, 2, 2, '#e1c68b');
    px(x + 17, 265, 11, 2, '#ddd0a0');
    px(x + 16, 285, 13, 2, '#ddd0a0');
  }
  px(179, 310, 282, 8, '#363e30');
  for (let i = 0; i < 4; i++) {
    const x = 193 + i * 64;
    px(x, 302, 55, 8, '#a98b59');
    px(x + 2, 303, 51, 1, '#e2c088');
    px(x + 21, 304, 12, 3, '#3c4631');
    px(x + 23, 304, 8, 1, '#ddbb78');
  }
  px(189, 318, 14, 14, '#a18754');
  px(436, 318, 14, 14, '#a18754');
  secretArtCrate(c, 47, 272, 86, 53);
  secretArtChest(c, 63, 235, 73, false);
  secretArtBottle(c, 145, 268, '#b1bd92', 2);
  secretArtWood(c, 42, 330, 103, 43);
  for (let i = 0; i < 3; i++) {
    const x = 47 + i * 32;
    px(x, 335, 28, 29, '#89744e');
    px(x + 2, 337, 24, 1, '#c9ac71');
    px(x + 10, 341, 8, 6, '#d7c391');
    px(x + 11, 342, 6, 1, '#7a7554');
    secretArtOval(c, x + 14, 355, 5, 3, '#4b5138', 1);
    px(x + 12, 354, 5, 1, '#e0c086');
  }
  px(489, 265, 102, 8, '#bd9b65');
  px(495, 273, 8, 50, '#715d3b');
  px(578, 273, 8, 50, '#715d3b');
  for (let i = 0; i < 4; i++)
    secretArtBottle(c, 503 + i * 25, 264, ['#8faeaa', '#b6ad7d', '#9d899d', '#91a57f'][i], i % 3);
  px(494, 275, 87, 29, '#715f42');
  for (let i = 0; i < 3; i++) {
    const x = 498 + i * 28;
    px(x, 279, 24, 21, '#a28b5d');
    px(x + 1, 279, 22, 1, '#d3ba7c');
    px(x + 8, 285, 8, 3, '#ede1b0');
    px(x + 10, 292, 4, 2, '#3c4a35');
  }
  secretArtOval(c, 538, 239, 15, 5, '#344f40');
  px(535, 213, 5, 25, '#b0ac7a');
  secretArtLine(c, 515, 216, 561, 213, '#e0c58c', 2);
  for (const xx of [518, 558]) {
    secretArtLine(c, xx, 216, xx - 7, 229, '#b8b58b');
    secretArtLine(c, xx, 216, xx + 7, 229, '#b8b58b');
    secretArtOval(c, xx, 230, 11, 3, '#ae9b65');
    secretArtOval(c, xx, 229, 8, 2, '#d9c88b');
  }
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
  secretArtOval(c, 397, 237, 18, 3, '#d2c294');
  secretArtOval(c, 397, 237, 14, 1, '#8b9c7d');
  px(364, 229, 14, 6, '#8d7c50');
  px(365, 228, 12, 2, '#e4cf99');
  px(368, 225, 8, 3, '#bbb890');
  secretArtOval(c, 367, 224, 4, 1, '#f4d595');
  secretArtBooks(c, 204, 235, 3, 16);
  px(274, 225, 17, 11, '#bcb08b');
  px(276, 225, 13, 1, '#f2ddb1');
  px(277, 229, 9, 1, '#767557');
  px(278, 232, 7, 1, '#767557');
  for (let i = 0; i < 4; i++) {
    const x = 337 + i * 7;
    px(x, 233 - (i % 2) * 3, 7, 3, '#b99858');
    px(x + 1, 233 - (i % 2) * 3, 5, 1, '#f0cf89');
  }
  for (const x of [44, 588]) {
    secretArtLine(c, x, 23, x, 108, '#9c9670');
    secretArtOval(c, x, 113, 11, 15, '#a0aa81', 2);
    px(x - 5, 106, 10, 16, '#717f5f');
    px(x - 3, 108, 3, 11, '#e8dba6');
    px(x + 2, 111, 2, 8, '#b8c599');
    px(x - 10, 127, 20, 3, '#c6b47c');
  }
  for (let i = 0; i < 7; i++) {
    const x = 195 + i * 41;
    px(x, 372, 5, 1, '#d3c58c');
    px(x + 1, 368, 2, 9, '#a8b58b');
    secretArtLine(c, x - 3, 385, x + 5, 381, '#b7bd91');
  }
  secretArtPlant(c, 550, 356, 1.4);
  secretArtPlant(c, 86, 360, 1.1);
}
function secretArtRoomLighting(c, s) {
  const lights = {
    cache: [
      [185, 181, 103, '#ffd48a', 0.15],
      [454, 181, 103, '#ffd48a', 0.15],
      [320, 215, 100, '#eecb74', s.claimed ? 0.14 : 0.06],
    ],
    workshop: [
      [131, 189, 139, '#ffad65', 0.2],
      [316, 170, 65, '#ffd98c', 0.1],
    ],
    quiet: [
      [335, 232, 165, '#b2d5b3', 0.1],
      [144, 198, 88, '#f3d9a0', 0.1],
    ],
    shrine: [[320, 160, 180, '#ffc472', 0.18]],
    trial: [
      [61, 259, 95, '#f7b86b', 0.15],
      [579, 259, 95, '#f7b86b', 0.15],
    ],
    wager: [
      [182, 198, 99, '#ffd191', 0.14],
      [458, 198, 99, '#ffd191', 0.14],
    ],
    echo: [[320, 199, 167, '#a7dfe8', 0.18]],
    cartographer: [[400, 220, 113, '#f5d29b', 0.15]],
    armory: [[320, 190, 147, '#b2e5e0', 0.16]],
    false: [
      [398, 191, 135, '#b0d9aa', 0.15],
      [110, 191, 80, '#edc183', 0.08],
    ],
    deep: [[320, 183, 182, '#98d7dc', 0.18]],
    shop: [
      [320, 196, 150, '#ecdaac', 0.1],
      [201, 105, 88, '#f0daa1', 0.14],
      [440, 105, 88, '#f0daa1', 0.14],
    ],
  };
  for (const light of lights[s.type] || []) secretArtGlow(c, ...light);
}
function secretArtBuild(s) {
  const key = [s.type, s.region, !!s.claimed].join(':');
  const cached = secretArtRooms.get(key);
  if (cached && !cached.getContext('2d').isContextLost?.()) return cached;
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
  secretArtRoomLighting(c, s);
  const invalidate = () => {
    if (secretArtRooms.get(key) === cv) secretArtRooms.delete(key);
  };
  cv.addEventListener?.('contextlost', invalidate);
  cv.addEventListener?.('contextrestored', invalidate);
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
      secretArtCandle(c, x, 199, t, 25);
    }
    for (let i = 0; i < 9; i++) glint(196 + ((i * 47) % 238), 310 + ((i * 17) % 35), i);
    if (s.claimed)
      for (let i = 0; i < 7; i++) {
        const x = 276 + ((i * 17) % 85),
          y = 200 - ((t * 8 + i * 17) % 59);
        px(x, y, 1, 2, i % 2 ? '#e3c083' : '#fff0bd');
      }
  } else if (s.type === 'workshop') {
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
      secretArtCandle(c, x, 235, t + x * 0.01, 27);
    }
    for (const [i, coin] of [
      [215, 258],
      [237, 253],
      [407, 257],
      [418, 267],
      [398, 271],
    ].entries())
      glint(coin[0], coin[1], i);
    c.save();
    c.globalAlpha = 0.22 + wave * 0.06;
    secretArtOval(c, 320, 123, 72, 72, '#f1d28e', 1);
    c.restore();
  } else if (s.type === 'echo') {
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
    secretArtCandle(c, 316, 181, t, 19);
    secretArtCandle(c, 480, 181, t + 0.3, 19);
    for (let i = 0; i < 7; i++) glint(373 + ((i * 13) % 59), 211 + ((i * 7) % 30), i, '#deebae');
    secretArtCandle(c, 160, 224, t + 0.5, 24);
  } else if (s.type === 'deep') {
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
    drawMothMerchant(c, 321, 193, t);
    for (const x of [201, 440]) {
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
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.globalCompositeOperation = 'source-over';
  c.filter = 'none';
  c.clearRect(0, 0, w, h);
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
  const backdrop = T('secretRoomBackdrop') || T('testerSecretBackdrop');
  if (backdrop?.complete && backdrop.naturalWidth === 640) {
    secretCtx.save();
    secretCtx.setTransform(1, 0, 0, 1, 0, 0);
    secretCtx.globalAlpha = 1;
    secretCtx.globalCompositeOperation = 'source-over';
    secretCtx.filter = 'none';
    secretCtx.clearRect(0, 0, secretCanvas.width, secretCanvas.height);
    secretCtx.scale(secretCanvas.width / 640, secretCanvas.height / 420);
    secretArtAnimations(secretCtx, s, (save.motion ? 2400 : now - secretOpenAt) / 1000);
    secretArtRegionBadge(secretCtx, s);
    secretCtx.restore();
  } else
    drawSecretRoomArt(secretCtx, s, secretCanvas.width, secretCanvas.height, now - secretOpenAt);
  secretAnim = requestAnimationFrame(drawSecretFrame);
}
