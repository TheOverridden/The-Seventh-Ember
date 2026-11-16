let hearthRoomCache = null,
  hearthRoomKey = '';
function hearthPixel(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}
function hearthPoly(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fill();
}
function hearthFlame(ctx, x, y, t, scale = 1) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(scale, scale);
  const frame = save.motion ? 0 : Math.floor(t * 8) % 6,
    lean = [0, 2, 4, 1, -2, -3][frame],
    tip = [0, 3, -2, 1, -3, 2][frame],
    poly = (points, color) => hearthPoly(ctx, points, color),
    px = (a, b, w, h, color) => hearthPixel(ctx, a, b, w, h, color);
  poly(
    [
      [-22, -3],
      [-22, -11],
      [-18, -11],
      [-18, -20],
      [-15, -20],
      [-15, -32],
      [-11, -32],
      [-11, -23],
      [-8, -23],
      [-8, -32],
      [-5, -32],
      [-5, -41],
      [-2 + lean, -41],
      [-2 + lean, -51 + tip],
      [1 + lean, -51 + tip],
      [1 + lean, -41],
      [5, -41],
      [5, -30],
      [9, -30],
      [9, -22],
      [12, -22],
      [12, -31 - tip],
      [15, -31 - tip],
      [15, -19],
      [18, -19],
      [18, -12],
      [22, -12],
      [22, -4],
      [15, 1],
      [-15, 1],
    ],
    '#b54123'
  );
  poly(
    [
      [-17, -5],
      [-17, -15],
      [-13, -15],
      [-13, -23 + tip],
      [-10, -23 + tip],
      [-10, -16],
      [-6, -16],
      [-6, -29],
      [-3, -29],
      [-3, -37],
      [lean, -37],
      [lean, -45 + tip],
      [3 + lean, -45 + tip],
      [3 + lean, -32],
      [7, -32],
      [7, -19],
      [12, -19],
      [12, -25],
      [15, -25],
      [15, -13],
      [18, -13],
      [18, -5],
      [12, 0],
      [-12, 0],
    ],
    '#ee7f32'
  );
  poly(
    [
      [-12, -4],
      [-12, -13],
      [-8, -13],
      [-8, -20],
      [-4, -20],
      [-4, -29 + tip],
      [-1, -29 + tip],
      [-1, -35],
      [2, -35],
      [2, -24],
      [6, -24],
      [6, -17],
      [9, -17],
      [9, -11],
      [13, -11],
      [13, -4],
      [8, 1],
      [-8, 1],
    ],
    '#ffc35d'
  );
  poly(
    [
      [-6, -2],
      [-6, -9],
      [-3, -9],
      [-3, -17],
      [0, -17],
      [0, -22 + tip],
      [3, -22 + tip],
      [3, -12],
      [6, -12],
      [6, -6],
      [8, -6],
      [8, 0],
      [-4, 1],
    ],
    '#fff0b5'
  );
  px(-13, 1, 26, 2, '#cd6630');
  px(-6, 1, 12, 1, '#ffe5a0');
  ctx.restore();
}
function hearthLantern(ctx, x, y, kind, t) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  const px = (a, b, w, h, color) => hearthPixel(ctx, a, b, w, h, color),
    poly = (points, color) => hearthPoly(ctx, points, color);
  px(-11, -3, 22, 28, '#171918');
  if (kind === 'candle') {
    px(-10, 20, 20, 3, '#bb8c50');
    px(-7, 16, 14, 4, '#675038');
    px(-2, 6, 4, 10, '#c5a56e');
    px(-5, -5, 10, 13, '#e5d7ac');
    px(-4, -4, 3, 11, '#fff1c9');
    px(2, 0, 2, 9, '#968d69');
    px(-5, 2, 2, 5, '#f2ddb3');
    hearthFlame(ctx, 0, -6, t, 0.23);
    px(-13, 23, 26, 2, '#c3a16c');
  } else {
    const glass = kind === 'bellglass' ? '#90b8b5' : kind === 'orchard' ? '#b5c681' : '#c7d3e9';
    px(-1, -29, 2, 20, '#ab8a5b');
    px(-4, -29, 8, 2, '#514738');
    poly(
      [
        [-10, 0],
        [-7, -6],
        [-3, -6],
        [-3, -9],
        [3, -9],
        [3, -6],
        [7, -6],
        [10, 0],
        [10, 18],
        [6, 22],
        [-6, 22],
        [-10, 18],
      ],
      '#544a39'
    );
    px(-7, 0, 14, 16, '#424c42');
    px(-5, 2, 10, 12, glass);
    px(-4, 3, 2, 9, '#f4ecd3');
    px(3, 4, 1, 8, '#e2d7ac');
    px(-10, -1, 20, 2, '#b5905a');
    px(-8, 17, 16, 3, '#a78251');
    px(-10, 21, 20, 2, '#d4b781');
    if (kind === 'bellglass') {
      px(-3, 8, 7, 2, '#e5ead1');
      px(-1, 7, 3, 5, '#fbf6d8');
      px(-9, 1, 1, 16, '#d0cfad');
    } else if (kind === 'orchard') {
      for (let i = 0; i < 5; i++) {
        px(-13 + (i % 2) * 24, -4 + i * 4, 5, 2, '#617950');
        px(-11 + (i % 2) * 22, -3 + i * 4, 3, 2, '#8c9c65');
      }
    } else {
      px(-1, 4, 2, 8, '#fff4cd');
      px(-4, 7, 8, 2, '#fff4cd');
      for (let i = 0; i < 3 && !save.motion; i++) {
        const a = t * 0.4 + (i * TAU) / 3;
        px(Math.cos(a) * 15, 7 + Math.sin(a) * 13, 1, 2, '#d9d3b2');
      }
    }
  }
  ctx.restore();
}
function hearthRoomArchitecture(ctx, layout) {
  const p = (x, y, w, h, c) => hearthPixel(ctx, x, y, w, h, c),
    poly = (points, c) => hearthPoly(ctx, points, c);
  p(0, 0, 640, 360, '#111c17');
  p(18, 16, 604, 224, '#252f28');
  const stones = ['#3b4438', '#42483a', '#354033', '#454937', '#394234'];
  for (let row = 0; row < 12; row++) {
    const y = 25 + row * 18;
    for (let col = -1; col < 14; col++) {
      const x = col * 49 + (row % 2) * 24,
        shade = (col * 7 + row * 3 + 100) % stones.length;
      p(x + 1, y, 47, 16, stones[shade]);
      p(x + 3, y + 1, 42, 1, '#68715a');
      p(x + 2, y + 14, 44, 2, '#2b382c');
      p(x + 45, y + 3, 2, 11, '#27382b');
      if ((col + row) % 5 === 0) {
        p(x + 9, y + 5, 13, 1, '#4b5843');
        p(x + 28, y + 8, 8, 1, '#56604a');
      }
    }
  }
  poly(
    [
      [0, 0],
      [27, 17],
      [27, 237],
      [0, 273],
    ],
    '#26372a'
  );
  poly(
    [
      [640, 0],
      [613, 17],
      [613, 237],
      [640, 273],
    ],
    '#1d2f24'
  );
  for (let y = 31; y < 241; y += 27) {
    p(6, y, 14, 2, '#40513b');
    p(620, y, 14, 2, '#344b35');
  }
  p(24, 174, 591, 60, '#29382b');
  for (let x = 31; x < 613; x += 30) {
    p(x, 177, 27, 53, '#384832');
    p(x + 2, 180, 2, 46, '#5a6547');
    p(x + 24, 180, 2, 47, '#233a28');
  }
  p(20, 229, 600, 7, '#1a2c20');
  p(22, 229, 596, 2, '#6f7550');
  poly(
    [
      [0, 0],
      [640, 0],
      [616, 18],
      [24, 18],
    ],
    '#17271f'
  );
  p(22, 14, 596, 9, '#614d34');
  p(23, 14, 594, 2, '#b39862');
  p(26, 19, 588, 3, '#3b3828');
  for (const x of [24, 216, 427, 601]) {
    p(x - 4, 23, 19, 214, '#172a1e');
    p(x - 1, 24, 13, 209, '#625338');
    p(x, 24, 3, 208, '#aa8d57');
    p(x + 9, 25, 3, 207, '#3a3d29');
    p(x - 6, 24, 23, 7, '#a18b58');
    p(x - 4, 31, 19, 4, '#6a6341');
    p(x - 5, 224, 22, 12, '#746847');
    p(x - 7, 233, 26, 6, '#a18c5b');
    p(x - 6, 233, 24, 2, '#c1a774');
  }
  poly(
    [
      [0, 0],
      [30, 14],
      [99, 14],
      [62, 3],
    ],
    '#8c754b'
  );
  poly(
    [
      [640, 0],
      [610, 14],
      [541, 14],
      [578, 3],
    ],
    '#746345'
  );
  p(45, 1, 550, 4, '#2c3526');
  p(48, 2, 544, 1, '#7c7551');
  const recess = (x, w) => {
    poly(
      [
        [x, 167],
        [x, 60],
        [x + 9, 60],
        [x + 9, 46],
        [x + 22, 46],
        [x + 22, 38],
        [x + w - 22, 38],
        [x + w - 22, 46],
        [x + w - 9, 46],
        [x + w - 9, 60],
        [x + w, 60],
        [x + w, 167],
      ],
      '#17271f'
    );
    p(x + 4, 65, 4, 90, '#646a4e');
    p(x + w - 9, 64, 5, 92, '#263c2b');
    p(x + 15, 43, w - 30, 3, '#7b7d58');
  };
  recess(42, 144);
  recess(443, 162);
  p(0, 238, 640, 122, '#303d2c');
  const colors = {
    oak: ['#69563a', '#5e5035', '#76603e', '#675536'],
    slate: ['#586453', '#495b4b', '#62705b', '#52614e'],
    mosaic: ['#5d6a4f', '#51654a', '#697354', '#596b4c'],
    dawnstone: ['#9c9970', '#a9a177', '#8b9167', '#b5ad7c'],
  }[layout.floor] || ['#69563a', '#5e5035', '#76603e', '#675536'];
  const project = (cell, y) => 320 + (cell * 108 - 320) * ((y - 170) / 190),
    rows = [238, 247, 260, 278, 302, 333, 365];
  for (let row = 0; row < rows.length - 1; row++) {
    const top = rows[row],
      bottom = rows[row + 1],
      shift = (row % 2) * 0.5;
    for (let cell = -14; cell < 21; cell++) {
      const a = project(cell + shift, top),
        b = project(cell + 1 + shift, top),
        c = project(cell + 1 + shift, bottom),
        d = project(cell + shift, bottom);
      if (c < 0 || d > 640) continue;
      const shade = (cell * 3 + row + 200) % 4;
      poly(
        [
          [a + 1, top + 1],
          [b - 1, top + 1],
          [c - 1, bottom - 1],
          [d + 1, bottom - 1],
        ],
        colors[shade]
      );
      poly(
        [
          [a + 3, top + 1],
          [b - 3, top + 1],
          [b - 4, top + 2],
          [a + 4, top + 2],
        ],
        layout.floor === 'dawnstone' ? '#d3c28c' : layout.floor === 'oak' ? '#a68b58' : '#8b9673'
      );
      if (layout.floor === 'oak') {
        const mid = (top + bottom) / 2,
          left = project(cell + shift + 0.13, mid),
          right = project(cell + shift + 0.84, mid);
        p(left, mid, right - left, 1, '#8d7249');
        p(left + 5, mid + 3, Math.max(1, right - left - 18), 1, '#4f4930');
      } else if (layout.floor === 'mosaic') {
        const mx = (a + b + c + d) / 4,
          my = (top + bottom) / 2,
          rx = (b - a) * 0.14,
          ry = (bottom - top) * 0.28;
        poly(
          [
            [mx, my - ry],
            [mx + rx, my],
            [mx, my + ry],
            [mx - rx, my],
          ],
          '#c6b17b'
        );
        p(mx - 1, my, 2, 1, '#e1cc94');
      } else if ((cell + row) % 3 === 0)
        p(
          (a + b + c + d) / 4,
          (top + bottom) / 2,
          Math.max(2, (b - a) * 0.16),
          1,
          layout.floor === 'dawnstone' ? '#8b8e64' : '#6c785b'
        );
    }
  }
  poly(
    [
      [24, 239],
      [216, 239],
      [194, 251],
      [0, 267],
    ],
    '#172b1e33'
  );
  poly(
    [
      [428, 239],
      [614, 239],
      [640, 264],
      [450, 250],
    ],
    '#14291e55'
  );
  p(26, 238, 586, 2, '#a39b6b');
  p(28, 240, 582, 2, '#4b5338');
  if (layout.window === 'sunrise')
    poly(
      [
        [59, 149],
        [170, 149],
        [225, 334],
        [96, 355],
        [28, 281],
      ],
      '#dac48c19'
    );
  else if (layout.window === 'snow')
    poly(
      [
        [59, 149],
        [170, 149],
        [188, 280],
        [42, 290],
      ],
      '#bac9b412'
    );
}
function hearthStoneFireplace(ctx) {
  const p = (x, y, w, h, c) => hearthPixel(ctx, x, y, w, h, c),
    poly = (points, c) => hearthPoly(ctx, points, c);
  poly(
    [
      [245, 25],
      [400, 25],
      [407, 116],
      [397, 222],
      [251, 222],
      [239, 116],
    ],
    '#1c3022'
  );
  poly(
    [
      [253, 24],
      [392, 24],
      [399, 114],
      [246, 114],
    ],
    '#4e5941'
  );
  for (let row = 0; row < 6; row++) {
    const y = 27 + row * 14;
    for (let col = -1; col < 5; col++) {
      const x = 253 + col * 34 + (row % 2) * 17,
        l = Math.max(251, x),
        r = Math.min(396, x + 32);
      if (r <= l) continue;
      p(l, y, r - l, 12, (row + col + 10) % 3 ? '#676e55' : '#777a5c');
      p(l + 1, y + 1, Math.max(1, r - l - 3), 1, '#aaa27a');
      p(l + 1, y + 10, Math.max(1, r - l - 3), 2, '#424e38');
    }
  }
  poly(
    [
      [298, 42],
      [347, 42],
      [361, 55],
      [361, 80],
      [347, 92],
      [300, 92],
      [286, 80],
      [286, 55],
    ],
    '#2c412e'
  );
  poly(
    [
      [301, 45],
      [345, 45],
      [357, 57],
      [357, 78],
      [345, 88],
      [302, 88],
      [290, 78],
      [290, 57],
    ],
    '#a38d5d'
  );
  poly(
    [
      [303, 49],
      [343, 49],
      [353, 59],
      [353, 76],
      [343, 84],
      [305, 84],
      [294, 76],
      [294, 59],
    ],
    '#4c5339'
  );
  poly(
    [
      [324, 51],
      [329, 60],
      [328, 66],
      [335, 70],
      [332, 78],
      [315, 78],
      [311, 70],
      [318, 63],
      [319, 56],
    ],
    '#d1b57b'
  );
  p(322, 63, 4, 12, '#f3d89c');
  p(238, 112, 173, 12, '#263a28');
  p(236, 112, 176, 5, '#b7ab79');
  p(239, 113, 170, 2, '#e0cb94');
  p(242, 119, 163, 5, '#717a51');
  p(247, 125, 153, 5, '#3c5137');
  for (const x of [250, 384]) {
    p(x, 126, 13, 15, '#79835b');
    p(x + 2, 127, 10, 2, '#bdb686');
    p(x + 4, 140, 6, 8, '#526644');
  }
  poly(
    [
      [257, 225],
      [257, 163],
      [266, 163],
      [266, 149],
      [280, 149],
      [280, 137],
      [295, 137],
      [295, 130],
      [353, 130],
      [353, 137],
      [369, 137],
      [369, 149],
      [383, 149],
      [383, 163],
      [391, 163],
      [391, 225],
    ],
    '#939676'
  );
  poly(
    [
      [267, 224],
      [267, 164],
      [276, 164],
      [276, 153],
      [288, 153],
      [288, 144],
      [301, 144],
      [301, 138],
      [348, 138],
      [348, 144],
      [361, 144],
      [361, 153],
      [374, 153],
      [374, 164],
      [382, 164],
      [382, 224],
    ],
    '#202e20'
  );
  poly(
    [
      [277, 223],
      [277, 168],
      [285, 168],
      [285, 159],
      [296, 159],
      [296, 152],
      [352, 152],
      [352, 159],
      [364, 159],
      [364, 168],
      [372, 168],
      [372, 223],
    ],
    '#2f3020'
  );
  for (let y = 166; y < 220; y += 12) {
    p(281, y, 87, 1, '#58482c');
    for (let x = 284 + (Math.floor(y / 12) % 2) * 17; x < 368; x += 31)
      p(x, y + 2, 1, 8, '#423c25');
  }
  for (const side of [-1, 1]) {
    const x = side < 0 ? 257 : 381;
    for (let row = 0; row < 4; row++) {
      p(x, 164 + row * 15, 11, 13, row % 2 ? '#7c8c63' : '#86956c');
      p(x + 1, 165 + row * 15, 9, 2, '#c2c49a');
      p(x + 1, 175 + row * 15, 9, 2, '#526b48');
    }
  }
  for (const [x, y, w, h] of [
    [265, 151, 13, 11],
    [278, 140, 15, 11],
    [293, 133, 15, 11],
    [310, 130, 14, 11],
    [326, 130, 14, 11],
    [342, 133, 14, 11],
    [357, 141, 14, 11],
    [371, 152, 12, 11],
  ]) {
    p(x, y, w, h, '#aaa580');
    p(x + 1, y + 1, w - 2, 2, '#d6cba0');
    p(x + 1, y + h - 2, w - 2, 2, '#6c7554');
  }
  p(313, 130, 21, 15, '#c6bc8d');
  p(316, 132, 15, 2, '#eddbad');
  p(322, 137, 3, 6, '#7c8e5b');
  p(248, 224, 152, 7, '#273d27');
  p(241, 230, 167, 9, '#9aa276');
  p(242, 231, 164, 2, '#d5c899');
  poly(
    [
      [241, 239],
      [408, 239],
      [426, 254],
      [223, 254],
    ],
    '#6d8057'
  );
  p(223, 254, 203, 7, '#293f29');
  p(226, 254, 196, 2, '#a4ae7b');
  poly(
    [
      [284, 217],
      [345, 208],
      [357, 212],
      [357, 219],
      [298, 229],
      [285, 226],
    ],
    '#362b1d'
  );
  poly(
    [
      [286, 216],
      [346, 208],
      [353, 212],
      [296, 222],
    ],
    '#9b6c3c'
  );
  poly(
    [
      [294, 208],
      [357, 219],
      [357, 224],
      [350, 228],
      [290, 217],
    ],
    '#46321e'
  );
  p(292, 210, 9, 3, '#c78b46');
  p(349, 221, 6, 3, '#ac733a');
  for (const x of [282, 365]) {
    p(x, 210, 4, 17, '#19281d');
    p(x - 3, 207, 10, 4, '#526346');
    p(x, 208, 3, 2, '#b7aa76');
  }
  for (let i = 0; i < 11; i++) p(281 + i * 8, 226 + (i % 2), 5, 2, i % 3 ? '#79542c' : '#e6a052');
  p(294, 102, 18, 10, '#64724c');
  p(296, 100, 14, 3, '#aba270');
  p(296, 103, 3, 6, '#c7be8b');
  p(339, 103, 12, 9, '#9c9364');
  p(340, 103, 10, 2, '#e2c993');
  p(357, 105, 14, 7, '#6c7951');
  p(359, 102, 10, 4, '#96996d');
}
function hearthRoomChair(ctx) {
  const p = (x, y, w, h, c) => hearthPixel(ctx, x, y, w, h, c),
    poly = (points, c) => hearthPoly(ctx, points, c);
  poly(
    [
      [44, 294],
      [123, 294],
      [140, 333],
      [34, 333],
    ],
    '#1b302066'
  );
  poly(
    [
      [53, 287],
      [54, 259],
      [61, 250],
      [71, 246],
      [103, 246],
      [115, 253],
      [121, 266],
      [119, 294],
    ],
    '#2c3824'
  );
  poly(
    [
      [58, 286],
      [59, 260],
      [65, 254],
      [73, 251],
      [101, 251],
      [110, 256],
      [115, 266],
      [114, 290],
    ],
    '#a18c58'
  );
  poly(
    [
      [63, 283],
      [63, 261],
      [69, 256],
      [102, 256],
      [109, 262],
      [110, 283],
      [103, 291],
      [70, 291],
    ],
    '#6d8258'
  );
  poly(
    [
      [67, 279],
      [67, 263],
      [72, 259],
      [100, 259],
      [105, 264],
      [105, 281],
      [100, 286],
      [73, 286],
    ],
    '#899d6d'
  );
  p(72, 259, 27, 2, '#b3bd8a');
  p(72, 283, 27, 2, '#4d6b44');
  for (const x of [76, 97]) {
    p(x, 268, 2, 2, '#4c6740');
    p(x + 1, 268, 1, 1, '#bbc18e');
  }
  p(52, 281, 12, 31, '#9a8351');
  p(51, 280, 14, 5, '#c0aa72');
  p(54, 286, 3, 20, '#c7b27a');
  p(59, 287, 4, 22, '#5d6540');
  p(111, 281, 12, 31, '#786c43');
  p(110, 280, 14, 5, '#b39e65');
  p(113, 286, 3, 21, '#b2a36a');
  poly(
    [
      [65, 288],
      [108, 288],
      [113, 300],
      [62, 300],
    ],
    '#a8b980'
  );
  p(64, 290, 44, 2, '#cad29d');
  p(64, 300, 47, 9, '#617b4c');
  p(67, 302, 40, 2, '#8da366');
  p(66, 308, 42, 3, '#3c5934');
  for (const x of [58, 109]) {
    p(x, 311, 9, 18, '#917b4c');
    p(x, 311, 3, 16, '#bdab70');
    p(x - 1, 328, 12, 4, '#37472c');
  }
}

function hearthBuildRoom() {
  const h = hearthData(),
    guardians = achievementData().guardians,
    key = JSON.stringify([h.layout, guardians, h.vowSeals, h.crowns]);
  if (hearthRoomCache && key === hearthRoomKey) return hearthRoomCache;
  hearthRoomKey = key;
  const cv = document.createElement('canvas');
  cv.width = 640;
  cv.height = 360;
  const ctx = cv.getContext('2d'),
    px = (x, y, w, z, color) => hearthPixel(ctx, x, y, w, z, color),
    poly = (points, color) => hearthPoly(ctx, points, color);
  ctx.imageSmoothingEnabled = false;
  hearthRoomArchitecture(ctx, h.layout);
  px(49, 43, 130, 114, '#171b1b');
  poly(
    [
      [51, 153],
      [51, 62],
      [61, 62],
      [61, 51],
      [72, 51],
      [72, 44],
      [156, 44],
      [156, 51],
      [168, 51],
      [168, 62],
      [178, 62],
      [178, 153],
    ],
    '#867153'
  );
  px(57, 65, 115, 82, '#142027');
  px(65, 56, 99, 10, '#17272d');
  const weather = h.layout.window,
    sky =
      weather === 'sunrise'
        ? ['#cb9c6e', '#b88761', '#8e745d']
        : weather === 'snow'
          ? ['#71888b', '#667d7e', '#556c6b']
          : weather === 'rain'
            ? ['#4c625c', '#3b544e', '#2b4240']
            : ['#263344', '#25353c', '#213135'];
  px(66, 57, 97, 10, sky[0]);
  px(58, 66, 113, 28, sky[0]);
  px(58, 94, 113, 29, sky[1]);
  px(58, 123, 113, 23, sky[2]);
  if (weather === 'rain') {
    px(66, 67, 37, 2, '#596d64');
    px(60, 70, 32, 2, '#596d64');
    px(128, 76, 35, 2, '#53685f');
    px(142, 78, 27, 1, '#53685f');
    px(59, 103, 112, 6, '#435e54');
    px(59, 109, 112, 4, '#3c584e');
  } else if (weather === 'sunrise') {
    px(71, 86, 21, 12, '#e7c08a');
    px(75, 82, 13, 21, '#f8df9f');
    px(77, 81, 9, 2, '#ffe9b0');
    px(118, 70, 40, 2, '#d2b391');
    px(129, 73, 29, 1, '#d2b391');
  } else if (weather === 'night') {
    poly(
      [
        [143, 69],
        [149, 69],
        [153, 73],
        [153, 79],
        [149, 83],
        [144, 83],
        [146, 80],
        [149, 79],
        [149, 74],
        [145, 73],
      ],
      '#c5ccbe'
    );
    for (let i = 0; i < 13; i++) px(63 + ((i * 23) % 102), 62 + ((i * 17) % 41), 1, 1, '#9da9aa');
  }
  for (let i = 0; i < 10; i++) {
    const x = 60 + i * 12,
      y = 115 + (i % 3) * 4,
      col = weather === 'sunrise' ? '#6c7160' : weather === 'snow' ? '#445d58' : '#263c36';
    poly(
      [
        [x - 10, y + 12],
        [x - 5, y + 12],
        [x - 5, y + 6],
        [x - 2, y + 6],
        [x - 2, y - 7],
        [x + 2, y - 7],
        [x + 2, y + 3],
        [x + 6, y + 3],
        [x + 6, y + 9],
        [x + 11, y + 9],
        [x + 11, 147],
        [x - 10, 147],
      ],
      col
    );
    if (weather === 'snow') {
      px(x - 4, y + 6, 7, 2, '#c1c5b1');
      px(x - 8, y + 12, 15, 2, '#a4b8a7');
    }
  }
  if (weather === 'rain') {
    px(59, 141, 112, 5, '#29433d');
    px(62, 144, 19, 1, '#4b6759');
    px(91, 143, 10, 1, '#3b584c');
    px(118, 145, 24, 1, '#567261');
    px(153, 143, 14, 1, '#405e50');
  }
  px(58, 67, 2, 76, '#c6b187');
  px(109, 55, 5, 94, '#8a6b43');
  px(109, 57, 1, 90, '#e0c291');
  px(57, 106, 115, 4, '#92734c');
  px(58, 106, 112, 1, '#d2b380');
  px(45, 150, 139, 5, '#ba9563');
  px(48, 151, 132, 1, '#e7c794');
  px(48, 156, 132, 4, '#4a4030');
  for (const x of [63, 120, 164]) {
    px(x, 151, 7, 1, '#f4d6a1');
    px(x + 1, 153, 3, 1, '#8b6f4c');
  }
  for (const y of [77, 127]) {
    px(110, y, 8, 3, '#403e2e');
    px(111, y, 6, 1, '#b9a476');
    px(113, y + 1, 2, 1, '#f0d5a0');
  }
  px(105, 94, 3, 8, '#b29862');
  px(106, 95, 1, 5, '#f1d79e');
  for (const x of [48, 170]) {
    px(x, 59, 10, 90, '#6c6650');
    px(x + 2, 61, 3, 85, '#8f8360');
    px(x + 7, 62, 2, 83, '#443f31');
    px(x - 1, 96, 12, 4, '#d0a66a');
  }
  px(193, 56, 18, 41, '#171b18');
  px(190, 54, 22, 5, '#9a7543');
  px(192, 60, 18, 31, '#765938');
  px(194, 62, 14, 15, '#d0bb8b');
  px(196, 64, 10, 11, '#e4d2aa');
  px(201, 65, 1, 7, '#494534');
  px(201, 70, 5, 1, '#494534');
  px(201, 82, 1, 12, '#c19c58');
  px(198, 90, 7, 5, '#c19c58');
  px(191, 95, 21, 3, '#a67e49');
  px(31, 174, 170, 78, '#191c19');
  px(34, 170, 164, 80, '#a38350');
  px(36, 174, 159, 73, '#4b3c2c');
  px(39, 177, 153, 67, '#775d3e');
  for (const y of [193, 220]) px(42, y, 145, 2, '#624b34');
  px(35, 171, 162, 2, '#e0b77a');
  px(36, 247, 161, 3, '#cba36b');
  for (const x of [39, 190]) for (const y of [175, 242]) px(x, y, 2, 2, '#292b24');
  const notices = [
    [47, 184, 31, 43, '#d4c09a'],
    [84, 189, 41, 46, '#c3ad82'],
    [137, 180, 43, 54, '#ddca9f'],
  ];
  for (let i = 0; i < notices.length; i++) {
    const [x, y, w, height, paper] = notices[i];
    px(x + 2, y + 3, w, height, '#352d23');
    px(x, y, w, height - 2, paper);
    px(x + 1, y + 1, w - 3, 1, '#f1dfb7');
    px(x + w - 2, y + 3, 1, height - 6, '#a18d68');
    px(x + w / 2, y + 2, 3, 3, '#946543');
    if (i === 0) {
      poly(
        [
          [x + 15, y + 10],
          [x + 23, y + 19],
          [x + 15, y + 28],
          [x + 8, y + 19],
        ],
        '#667c79'
      );
      px(x + 15, y + 12, 1, 13, '#e9ddaf');
      px(x + 10, y + 18, 12, 1, '#cfb990');
    } else if (i === 1) {
      poly(
        [
          [x + 13, y + 24],
          [x + 13, y + 17],
          [x + 17, y + 17],
          [x + 17, y + 11],
          [x + 21, y + 11],
          [x + 21, y + 17],
          [x + 27, y + 17],
          [x + 27, y + 25],
        ],
        '#b47748'
      );
      px(x + 19, y + 19, 5, 9, '#ead5a4');
    } else {
      poly(
        [
          [x + 13, y + 10],
          [x + 23, y + 7],
          [x + 31, y + 12],
          [x + 31, y + 26],
          [x + 22, y + 34],
          [x + 13, y + 28],
        ],
        '#735d43'
      );
      px(x + 17, y + 12, 9, 2, '#d6c298');
      px(x + 19, y + 18, 5, 8, '#d6c298');
    }
    px(x + 5, y + height - 10, w - 11, 2, '#a08e6c');
  }
  px(71, 234, 12, 8, '#506d62');
  px(105, 239, 12, 7, '#b5844a');
  px(150, 234, 13, 9, '#a16a51');
  px(75, 235, 4, 2, '#b6c2a1');
  px(109, 240, 4, 2, '#e4bc7b');
  px(154, 235, 4, 2, '#e4ae82');
  hearthStoneFireplace(ctx);
  const banner = h.layout.banner,
    bannerColor = { linen: '#958267', roots: '#758460', mooncloth: '#707886', suncloth: '#b18e4e' }[
      banner
    ];
  for (const x of [229, 404]) {
    px(x - 2, 70, 22, 3, '#c5a169');
    px(x, 74, 18, 67, '#282b23');
    poly(
      [
        [x + 1, 74],
        [x + 17, 74],
        [x + 17, 135],
        [x + 9, 145],
        [x + 1, 136],
      ],
      bannerColor
    );
    px(x + 2, 75, 2, 58, '#d9bd89');
    px(x + 14, 75, 2, 58, '#423f2e');
    px(x + 4, 75, 10, 2, '#e0c594');
    if (banner === 'roots') {
      for (let y = 86; y < 131; y += 7) {
        px(x + 9, y, 1, 8, '#dfd6a5');
        px(x + 5, y + 1, 4, 2, '#adbd86');
        px(x + 10, y + 5, 3, 2, '#c4d096');
      }
    } else if (banner === 'mooncloth') {
      poly(
        [
          [x + 8, 87],
          [x + 12, 87],
          [x + 15, 91],
          [x + 15, 97],
          [x + 10, 100],
          [x + 6, 97],
          [x + 9, 97],
          [x + 12, 94],
          [x + 11, 90],
        ],
        '#eee2bf'
      );
      for (let y = 109; y < 131; y += 7) px(x + 8, y, 2, 2, '#d7d2b0');
    } else if (banner === 'suncloth') {
      poly(
        [
          [x + 9, 88],
          [x + 13, 92],
          [x + 13, 96],
          [x + 9, 100],
          [x + 5, 96],
          [x + 5, 92],
        ],
        '#f0d89b'
      );
      px(x + 8, 83, 2, 3, '#dbbd72');
      px(x + 8, 102, 2, 3, '#dbbd72');
      for (let y = 112; y < 133; y += 7) px(x + 5, y, 8, 1, '#d5b578');
    } else {
      for (let y = 88; y < 133; y += 8) {
        px(x + 6, y, 6, 1, '#c3b085');
        px(x + 8, y + 3, 2, 2, '#615942');
      }
    }
  }
  px(446, 63, 155, 5, '#241e1a');
  px(451, 60, 148, 6, '#9a7848');
  px(454, 61, 142, 1, '#d0aa70');
  px(460, 67, 5, 7, '#5a4830');
  px(584, 67, 5, 7, '#5a4830');
  const shelf = h.layout.shelf;
  if (shelf === 'herbs') {
    for (let i = 0; i < 5; i++) {
      const x = 467 + i * 26;
      px(x, 71, 1, 13, '#b29b68');
      for (let j = 0; j < 4; j++) {
        px(x - 7 + (j % 2) * 3, 85 + j * 4, 9, 3, j % 2 ? '#8b9863' : '#6d855e');
        px(x + 1, 87 + j * 4, 7, 3, '#a4ab72');
      }
      px(x - 2, 82, 5, 2, '#ddc08b');
    }
  } else if (shelf === 'gears') {
    px(503, 75, 36, 39, '#2c2d23');
    px(508, 71, 26, 5, '#bb9254');
    px(508, 78, 26, 31, '#7c6542');
    px(512, 82, 18, 18, '#d2bd86');
    px(514, 84, 14, 14, '#ece0b1');
    px(521, 85, 1, 10, '#504c35');
    px(521, 90, 5, 1, '#504c35');
    px(505, 113, 33, 4, '#c5a26a');
    for (const x of [466, 565]) {
      poly(
        [
          [x, 84],
          [x + 12, 84],
          [x + 12, 88],
          [x + 16, 88],
          [x + 16, 100],
          [x + 12, 100],
          [x + 12, 104],
          [x, 104],
          [x, 100],
          [x - 4, 100],
          [x - 4, 88],
          [x, 88],
        ],
        '#af8d57'
      );
      px(x + 2, 90, 8, 8, '#353c30');
      px(x + 4, 92, 4, 4, '#d7b777');
    }
  } else if (shelf === 'bottles') {
    for (let i = 0; i < 5; i++) {
      const x = 461 + i * 27,
        y = 90 + (i % 2) * 4;
      px(x + 5, y - 9, 8, 4, '#9e855b');
      px(x + 7, y - 5, 4, 6, '#91aaa1');
      poly(
        [
          [x + 4, y + 1],
          [x + 14, y + 1],
          [x + 18, y + 5],
          [x + 18, y + 19],
          [x + 1, y + 19],
          [x + 1, y + 5],
        ],
        '#628b85'
      );
      px(x + 4, y + 8, 11, 9, i % 2 ? '#84beb3' : '#a4c7b3');
      px(x + 3, y + 4, 2, 9, '#d6e1c4');
      px(x + 7, y + 11, 6, 4, '#cdc293');
    }
  } else {
    for (let i = 0; i < 11; i++) {
      const x = 459 + i * 12,
        height = 22 + ((i * 7) % 13),
        color = ['#8d684a', '#6f8059', '#687979', '#b28f55'][i % 4];
      px(x, 116 - height, 10, height, '#292d24');
      px(x, 114 - height, 9, height, color);
      px(x + 1, 118 - height, 7, 2, '#bfa77a');
    }
  }
  px(447, 116, 156, 6, '#b99862');
  px(450, 116, 149, 1, '#e1bd83');
  px(451, 123, 8, 8, '#6a5133');
  px(587, 123, 8, 8, '#6a5133');
  px(451, 143, 151, 109, '#1b201b');
  px(454, 140, 145, 107, '#7e6040');
  px(458, 145, 137, 96, '#423b2d');
  px(460, 149, 133, 88, '#292e26');
  px(453, 140, 147, 3, '#c5a06a');
  px(456, 145, 2, 98, '#a88756');
  px(596, 145, 2, 98, '#463c2b');
  for (let row = 0; row < 2; row++) {
    const yy = 152 + row * 42;
    for (let col = 0; col < 5; col++) {
      const i = row * 5 + col,
        g = GUARDIAN_ROSTER[i],
        x = 465 + col * 25,
        lit = guardians.includes(g.key),
        sprite = SPR[g.type];
      px(x - 1, yy, 23, 32, lit ? '#50472e' : '#343a2d');
      px(x + 1, yy + 1, 19, 29, lit ? '#635437' : '#2b3128');
      if (lit && sprite?.frames?.length) ctx.drawImage(sprite.frames[0], x + 1, yy + 2, 19, 26);
      else if (lit && typeof drawGuardianArchivePortrait === 'function') {
        const portrait = document.createElement('canvas');
        portrait.width = 210;
        portrait.height = 124;
        drawGuardianArchivePortrait(portrait, g);
        ctx.drawImage(portrait, 42, 10, 126, 104, x, yy + 2, 21, 26);
      } else {
        poly(
          [
            [x + 7, yy + 7],
            [x + 14, yy + 7],
            [x + 17, yy + 13],
            [x + 15, yy + 23],
            [x + 6, yy + 23],
            [x + 4, yy + 13],
          ],
          '#535a43'
        );
        px(x + 7, yy + 11, 7, 2, '#79806a');
        px(x + 9, yy + 23, 3, 3, '#434b35');
      }
      px(x, yy + 30, 22, 3, lit ? '#c5a35c' : '#6b6547');
      px(x + 4, yy + 34, 13, 3, '#a58951');
      px(x + 7, yy + 35, 7, 1, lit ? '#efd7a3' : '#5a533a');
    }
    px(458, yy + 39, 137, 3, '#b38f56');
    px(460, yy + 39, 133, 1, '#dbb77a');
  }
  px(452, 247, 150, 6, '#4b3e2b');
  px(456, 249, 141, 1, '#b1905b');
  px(460, 255, 10, 5, '#8b6d42');
  px(584, 255, 10, 5, '#8b6d42');
  const rug = h.layout.rug,
    rugColor = { plain: '#856344', garden: '#60734b', constellation: '#586570', royal: '#87544c' }[
      rug
    ],
    innerColor = {
      plain: '#71523a',
      garden: '#4e6343',
      constellation: '#424f5b',
      royal: '#6e443e',
    }[rug];
  poly(
    [
      [210, 273],
      [429, 273],
      [474, 336],
      [166, 336],
    ],
    '#2c2d24'
  );
  poly(
    [
      [210, 274],
      [428, 274],
      [467, 332],
      [174, 332],
    ],
    '#c1a170'
  );
  poly(
    [
      [217, 278],
      [422, 278],
      [456, 329],
      [184, 329],
    ],
    rugColor
  );
  poly(
    [
      [225, 282],
      [415, 282],
      [443, 324],
      [198, 324],
    ],
    '#c3aa79'
  );
  poly(
    [
      [229, 284],
      [411, 284],
      [437, 322],
      [205, 322],
    ],
    innerColor
  );
  for (let i = 0; i < 12; i++) px(175 + i * 24, 333, 4, 4, '#cfb48b');
  for (let i = 0; i < 8; i++) {
    const x = 229 + i * 26,
      y = 299 + (i % 2) * 10;
    if (rug === 'garden') {
      px(x + 4, y - 5, 1, 13, '#c8c592');
      poly(
        [
          [x + 4, y],
          [x - 2, y - 4],
          [x - 4, y - 1],
          [x + 3, y + 3],
        ],
        '#a3b786'
      );
      poly(
        [
          [x + 5, y + 4],
          [x + 11, y],
          [x + 13, y + 3],
          [x + 5, y + 7],
        ],
        '#bac897'
      );
      px(x + 3, y - 7, 3, 3, '#e1c596');
    } else if (rug === 'constellation') {
      poly(
        [
          [x + 4, y - 4],
          [x + 8, y],
          [x + 4, y + 4],
          [x, y],
        ],
        '#d6cfa9'
      );
      px(x + 3, y - 1, 2, 2, '#f2e3b8');
      if (i < 7) {
        for (let j = 0; j < 6; j++) px(x + 8 + j * 3, y + (i % 2 ? -j : j), 2, 1, '#9aab9a');
      }
    } else {
      poly(
        [
          [x + 4, y - 6],
          [x + 10, y],
          [x + 4, y + 6],
          [x - 2, y],
        ],
        '#c8ac77'
      );
      poly(
        [
          [x + 4, y - 3],
          [x + 7, y],
          [x + 4, y + 3],
          [x + 1, y],
        ],
        innerColor
      );
      if (rug === 'royal') {
        px(x - 3, y - 7, 2, 14, '#a87859');
        px(x + 11, y - 7, 2, 14, '#a87859');
      }
    }
  }
  hearthRoomChair(ctx);
  poly(
    [
      [131, 281],
      [171, 281],
      [178, 291],
      [128, 291],
    ],
    '#b38c54'
  );
  px(128, 290, 50, 4, '#554430');
  px(134, 295, 5, 27, '#8f6f46');
  px(168, 295, 5, 27, '#8f6f46');
  px(136, 296, 1, 24, '#c19b64');
  px(170, 296, 1, 24, '#ba945c');
  px(134, 322, 7, 2, '#22251d66');
  px(168, 322, 7, 2, '#22251d66');
  px(138, 269, 20, 12, '#e1cca0');
  px(140, 269, 16, 2, '#fff0c5');
  px(141, 271, 14, 2, '#715a3a');
  px(143, 272, 10, 1, '#aa8959');
  px(140, 278, 14, 2, '#c8af80');
  px(138, 281, 20, 1, '#4a3d2a88');
  px(157, 271, 5, 7, '#b4a07a');
  px(158, 273, 2, 3, '#514333');
  poly(
    [
      [506, 282],
      [595, 282],
      [612, 293],
      [495, 293],
    ],
    '#c7a168'
  );
  px(495, 292, 117, 4, '#6c5033');
  px(501, 297, 7, 36, '#937347');
  px(597, 297, 7, 36, '#937347');
  px(507, 300, 90, 16, '#55432d');
  px(514, 302, 34, 11, '#8b6c45');
  px(551, 302, 36, 11, '#8b6c45');
  px(529, 306, 5, 2, '#d5b675');
  px(566, 306, 5, 2, '#d5b675');
  px(516, 303, 29, 1, '#b18d56');
  px(554, 303, 30, 1, '#b18d56');
  px(516, 311, 29, 1, '#58452d');
  px(554, 311, 30, 1, '#58452d');
  px(530, 308, 4, 1, '#3d3827');
  px(567, 308, 4, 1, '#3d3827');
  px(502, 299, 2, 31, '#c39d64');
  px(598, 299, 2, 31, '#c39d64');
  px(501, 333, 9, 2, '#151c1555');
  px(597, 333, 9, 2, '#151c1555');
  poly(
    [
      [519, 273],
      [544, 270],
      [558, 274],
      [583, 272],
      [590, 282],
      [561, 286],
      [516, 283],
    ],
    '#806449'
  );
  poly(
    [
      [519, 272],
      [546, 270],
      [556, 274],
      [579, 271],
      [584, 280],
      [558, 283],
      [518, 280],
    ],
    '#ddcca6'
  );
  px(557, 274, 1, 8, '#9c8d6a');
  px(520, 282, 30, 1, '#eee1bd');
  px(522, 284, 27, 1, '#8c7b59');
  px(563, 283, 22, 1, '#eee1bd');
  px(562, 285, 25, 1, '#9a8560');
  px(554, 277, 2, 6, '#746448');
  px(557, 280, 2, 5, '#f4e9c8');
  for (let i = 0; i < 4; i++) {
    px(525, 273 + i * 2, 19, 1, '#ae9d7b');
    px(562, 274 + i * 2, 13, 1, '#ae9d7b');
  }
  px(591, 268, 14, 15, '#6b7650');
  px(593, 269, 10, 12, '#8d9770');
  px(593, 269, 2, 10, '#c5c396');
  for (let i = 0; i < 5; i++) {
    const x = 593 + (i % 3) * 4,
      y = 254 - (i % 2) * 5;
    px(x, y + 4, 1, 16 - (i % 2) * 3, '#758557');
    px(x - 2, y, 5, 4, i % 2 ? '#d5b99b' : '#b1c0a0');
    px(x - 1, y - 1, 3, 2, '#eee0b6');
  }
  px(426, 216, 13, 14, '#3c382a');
  px(429, 218, 8, 10, '#6f7050');
  px(428, 215, 11, 3, '#b89967');
  for (let i = 0; i < 5; i++) {
    px(430 + (i % 3) * 3, 201 + i * 2, 1, 15, '#7f8d5c');
    px(425 + (i % 3) * 5, 205 + i * 3, 6, 3, i % 2 ? '#a4af75' : '#71865d');
  }
  for (let i = 0; i < 6; i++) {
    const x = 270 + i * 20,
      seals = Object.keys(h.vowSeals[HEARTH_VOWS[i].id] || {}).length;
    px(x, 262, 13, 9, '#2d3025');
    px(x + 1, 263, 11, 5, seals ? '#aa8952' : '#60573a');
    px(x + 3, 263, 7, 1, seals ? '#f1d99d' : '#8a7a50');
    px(x + 5, 265, 3, 2, seals ? '#e0c387' : '#3f3c2b');
    px(x + 3, 269, 7, 1, '#b0945b');
  }
  if (h.crowns.includes(63)) {
    px(309, 37, 30, 3, '#ddbb73');
    for (let i = 0; i < 3; i++) {
      px(311 + i * 10, 29, 5, 8, '#bd9555');
      px(312 + i * 10, 27, 3, 6, '#f4d694');
      px(313 + i * 10, 28, 1, 2, '#fff0c9');
    }
    px(311, 37, 26, 1, '#fff0b9');
  }
  hearthRoomCache = cv;
  return cv;
}
function drawHearthRoom(ctx, t) {
  const h = hearthData(),
    time = save.motion ? 0 : t,
    px = (x, y, w, z, color) => hearthPixel(ctx, x, y, w, z, color),
    weather = h.layout.window;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(hearthBuildRoom(), 0, 0);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(66, 57);
  ctx.lineTo(163, 57);
  ctx.lineTo(163, 66);
  ctx.lineTo(171, 66);
  ctx.lineTo(171, 146);
  ctx.lineTo(59, 146);
  ctx.lineTo(59, 66);
  ctx.lineTo(66, 66);
  ctx.closePath();
  ctx.clip();
  if (weather === 'snow') {
    for (let i = 0; i < 26; i++) {
      const x = 60 + ((i * 31 + Math.sin(time * 0.8 + i) * 3 + 112) % 110),
        y = 66 + ((i * 23 + time * 11) % 80);
      px(x, y, i % 5 === 0 ? 2 : 1, 2, '#c9d4c5');
    }
  } else if (weather === 'rain' || weather === 'night') {
    const night = weather === 'night',
      wind = 0.18 + Math.sin(time * 0.31) * 0.025;
    for (let layer = 0; layer < 2; layer++) {
      const count = layer ? (night ? 7 : 14) : night ? 16 : 24;
      ctx.globalAlpha = layer ? 0.72 : 0.48;
      for (let i = 0; i < count; i++) {
        const speed = (layer ? 62 : 29) + (i % 5) * (layer ? 3.7 : 1.9),
          progress = time * speed + i * 37 + layer * 19,
          fall = progress % 108,
          cycle = Math.floor(progress / 108),
          x = 58 + ((i * 43 + layer * 29 + cycle * 53) % 136) - fall * wind,
          y = 49 + fall,
          length = layer ? 5 + (i % 3) : 2 + (i % 2);
        px(x, y, 1, length - 1, night ? '#55747c' : '#6f9383');
        px(
          x - 1,
          y + length - 1,
          1,
          layer ? 3 : 1,
          layer ? (night ? '#94aaae' : '#b5cabb') : night ? '#7e999e' : '#93ad9d'
        );
        if (layer) px(x - 2, y + length + 2, 1, 1, night ? '#6e8b92' : '#8bab97');
      }
    }
    ctx.globalAlpha = night ? 0.25 : 0.36;
    for (let i = 0; i < 7; i++) {
      const u = (time * (0.035 + (i % 3) * 0.007) + i * 0.173) % 1,
        x = 71 + ((i * 23) % 94),
        y = 64 + u * 79,
        length = 4 + ((i * 3) % 7);
      px(x, y - length, 1, length - 1, night ? '#55727b' : '#658a77');
      px(x, y - 1, 1, 2, night ? '#a0b2b5' : '#c3d1bd');
      if (i % 3 === 0) px(x + 1, y - 3, 1, 2, night ? '#6e8a90' : '#95ad95');
    }
    ctx.globalAlpha = night ? 0.3 : 0.56;
    for (let i = 0; i < 6; i++) {
      const progress = time * (0.86 + (i % 3) * 0.13) + i * 0.193,
        u = progress % 1;
      if (u >= 0.18) continue;
      const x = 64 + ((i * 23 + Math.floor(progress) * 31) % 101),
        spread = 1 + Math.floor(u * 12),
        y = 144 - (u < 0.09 ? 1 : 0),
        color = night ? '#8ca3a4' : '#b1c5ae';
      px(x - spread - 1, y, 1, 1, color);
      px(x + spread, y + 1, 1, 1, color);
    }
    ctx.globalAlpha = 1;
  } else {
    ctx.globalAlpha = 0.08;
    hearthPoly(
      ctx,
      [
        [70, 66],
        [102, 66],
        [83, 146],
        [59, 146],
      ],
      '#fff6c8'
    );
    ctx.globalAlpha = 1;
  }
  px(109, 57, 5, 89, '#8a6b43');
  px(109, 57, 1, 89, '#e0c291');
  px(59, 106, 112, 4, '#92734c');
  px(59, 106, 112, 1, '#d2b380');
  ctx.restore();
  ctx.save();
  const glow = ctx.createRadialGradient(325, 203, 9, 325, 208, 113);
  glow.addColorStop(0, 'rgba(244,146,51,0.17)');
  glow.addColorStop(0.5, 'rgba(244,146,51,0.075)');
  glow.addColorStop(1, 'rgba(244,146,51,0)');
  ctx.globalAlpha = 0.9 + Math.sin(time * 3.1) * 0.1;
  ctx.fillStyle = glow;
  ctx.fillRect(212, 111, 225, 185);
  ctx.restore();
  hearthFlame(ctx, 326, 219, time, 1.08);
  hearthFlame(ctx, 306, 221, time + 0.6, 0.42);
  hearthFlame(ctx, 348, 221, time + 1.4, 0.48);
  for (const x of [208, 442]) hearthLantern(ctx, x, 150, h.layout.lights, time);
  if (!save.motion) {
    for (let i = 0; i < 7; i++) {
      const u = (time * 0.19 + i * 0.153) % 1,
        x = 315 + Math.sin(time * 0.6 + i * 2) * 16,
        y = 205 - u * 55;
      px(x, y, 1, i % 3 ? 1 : 2, u < 0.65 ? '#e4ac60' : '#946138');
    }
    for (let i = 0; i < 10; i++) {
      const u = (time * 0.023 + i * 0.109) % 1;
      px(
        46 + ((i * 53 + Math.sin(time * 0.2 + i) * 6) % 144),
        170 - u * 103,
        1,
        1,
        i % 3 ? '#8a8565' : '#c3b087'
      );
    }
    for (let i = 0; i < 3; i++) {
      const u = (time * 0.35 + i / 3) % 1;
      ctx.globalAlpha = (1 - u) * 0.35;
      px(146 + Math.sin(time * 0.5 + i) * 2, 268 - u * 11, 1, 3, '#ddd1ac');
    }
    ctx.globalAlpha = 1;
  }
  drawHearthEmber(ctx, 326, 302, time);
}
const hearthEmberPreview = { x: 0, y: 0, moving: false, dashT: 0 };
function drawHearthEmber(ctx, x, y, t) {
  const h = hearthData(),
    hover = save.motion ? 0 : Math.sin(t * 2.4) * 1.8,
    cy = 2 - hover,
    orbit = t * 1.78,
    palette = HEARTH_PALETTES.find((item) => item.id === h.shards) || HEARTH_PALETTES[0],
    sprite = (name, sx, sy, scale = 1, angle = 0, alpha = 1) => {
      const s = SPR[name];
      if (!s) return;
      const frame = Math.floor(t * s.fps) % s.frames.length,
        width = s.W * s.sc * scale,
        height = s.H * s.sc * scale;
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.drawImage(s.frames[frame], -width / 2, -height / 2, width, height);
      ctx.restore();
    },
    glow = (name, gx, gy, radius, alpha) => {
      if (!GLOW[name]) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha;
      ctx.drawImage(GLOW[name], gx - radius, gy - radius, radius * 2, radius * 2);
      ctx.restore();
    };
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(0.8, 0.8);
  ctx.imageSmoothingEnabled = false;
  const trail = HEARTH_PALETTES.find((item) => item.id === h.trail);
  drawHearthTrail(ctx, hearthEmberPreview, trail, t, { preview: true });
  ctx.fillStyle = '#11161488';
  ctx.beginPath();
  ctx.ellipse(0, 13, 12 * (0.85 - hover * 0.03), 12 * 0.34, 0, 0, TAU);
  ctx.fill();
  glow('ember', 0, -4, 54, 0.62);
  glow('gold', 0, -6, 26, 0.38);
  ctx.save();
  ctx.translate(0, cy - 4);
  ctx.rotate(-orbit * 0.18);
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = '#ffc76738';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 6; i++) {
    const a = (i * TAU) / 6 + 0.12;
    ctx.beginPath();
    ctx.arc(0, 0, 15, a, a + 0.42);
    ctx.stroke();
  }
  ctx.strokeStyle = '#fff1b81f';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 8, 0.3, 0, TAU);
  ctx.stroke();
  ctx.restore();
  const shards = [0, TAU / 3, (TAU * 2) / 3].map((offset, i) => {
    const angle = orbit + offset,
      radius = 19 + (i === 1 ? 3 : i === 2 ? -1 : 0);
    return {
      i,
      angle,
      x: Math.cos(angle) * radius,
      y: cy - 5 + Math.sin(angle) * (7 + i * 0.8),
      front: Math.sin(angle) >= 0,
    };
  });
  const shard = (s) => {
    const depth = s.front ? 1 : 0.72,
      scale = (s.front ? 1.02 : 0.82) + (s.i === 1 ? 0.07 : 0);
    if (h.shards !== 'ember') {
      drawHearthShard(ctx, s.x, s.y, palette, scale, s.i, {
        time: t,
        rotation: s.angle * 0.72 + t * 0.45,
        alpha: depth,
      });
    } else {
      glow('gold', s.x, s.y, 12 + (s.front ? 3 : 0), 0.3 * depth);
      sprite('pShard', s.x, s.y, scale, s.angle * 0.72 + t * 0.45, depth);
    }
    hearthPixel(
      ctx,
      s.x + Math.cos(s.angle) * 5 - 1,
      s.y + Math.sin(s.angle) * 3 - 1,
      2,
      2,
      h.shards !== 'ember'
        ? s.front
          ? palette.light
          : palette.color
        : s.front
          ? '#fff0ae'
          : '#ba7a35'
    );
  };
  for (const s of shards) if (!s.front) shard(s);
  if (typeof drawHearthCore !== 'function' || !drawHearthCore(ctx, 0, cy, h.core, 'pIdle', t))
    sprite('pIdle', 0, cy);
  for (const s of shards) if (s.front) shard(s);
  if (!save.motion)
    for (let i = 0; i < 4; i++) {
      const u = (t * (0.31 + i * 0.027) + i * 0.23) % 1;
      hearthPixel(
        ctx,
        -6 + i * 4 + Math.sin(t * 2.4 + i * 1.7) * 2,
        cy - 8 - u * 21,
        i === 2 ? 2 : 1,
        i === 2 ? 2 : 1,
        i === 2 ? '#fff3bf' : i % 2 ? '#ffbe5c' : '#f67a35'
      );
    }
  for (const [i, slot] of ['primary', 'flare', 'dash'].entries()) {
    const form =
        FORM_BY_ID[save.loadout?.[slot] || FORM_DEFAULTS[slot]] || FORM_BY_ID[FORM_DEFAULTS[slot]],
      angle = t * (i === 1 ? -0.42 : 0.36) + (i * TAU) / 3,
      radius = 27 + i * 3;
    ctx.save();
    ctx.translate(0, -4);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = form.color;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, radius, angle, angle + 0.58);
    ctx.stroke();
    ctx.rotate(angle + 0.29);
    ctx.translate(radius, 0);
    ctx.rotate(Math.PI / 4 + t * 0.2);
    ctx.fillStyle = form.color;
    ctx.globalAlpha = 0.62;
    ctx.fillRect(-2, -2, 4, 4);
    ctx.restore();
  }
  ctx.restore();
}
const hearthShardCache = new Map();
function hearthShardMix(a, b, amount) {
  const aa = parseInt(a.slice(1), 16),
    bb = parseInt(b.slice(1), 16);
  return (
    '#' +
    [16, 8, 0]
      .map((shift) =>
        Math.round(((aa >> shift) & 255) * (1 - amount) + ((bb >> shift) & 255) * amount)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}
function hearthShardFrames(p) {
  const key = [p.id, p.color, p.light].join(':');
  if (hearthShardCache.has(key)) return hearthShardCache.get(key);
  const maps = {
      ember: [
        '....0....',
        '...020...',
        '..01230..',
        '.0123340.',
        '012233440',
        '012233420',
        '.0123320.',
        '..01230..',
        '..01220..',
        '...010...',
        '....0....',
      ],
      rime: [
        '.....0...',
        '....030..',
        '...0230..',
        '...02340.',
        '..002340.',
        '.0122340.',
        '.0132340.',
        '..012340.',
        '...0230..',
        '...030...',
        '....0....',
      ],
      rose: [
        '...00....',
        '..02300..',
        '.0234320.',
        '012323420',
        '012223320',
        '.0122320.',
        '..01220..',
        '..02320..',
        '...020...',
        '...010...',
        '....0....',
      ],
      moss: [
        '......0..',
        '....0030.',
        '...02340.',
        '..023340.',
        '.0232340.',
        '0122330..',
        '.01230...',
        '..020....',
        '..020....',
        '...00....',
        '...0.....',
      ],
      copper: [
        '...000...',
        '.0023200.',
        '.0233320.',
        '023000320',
        '0230.0320',
        '0230.0320',
        '023000320',
        '.0233320.',
        '.0023200.',
        '...000...',
        '.........',
      ],
      moon: [
        '....000..',
        '..002330.',
        '.023340..',
        '02340....',
        '0340.....',
        '0340.....',
        '0340.....',
        '02340....',
        '.023340..',
        '..002330.',
        '....000..',
      ],
      amethyst: [
        '....0....',
        '...030...',
        '.002340..',
        '.0233400.',
        '023134230',
        '023134340',
        '023134340',
        '012223230',
        '.0122320.',
        '..01220..',
        '...000...',
      ],
      pearl: [
        '....0....',
        '...030...',
        '...0230..',
        '..023430.',
        '.0234430.',
        '023344430',
        '023344430',
        '023334320',
        '.0122320.',
        '..01110..',
        '...000...',
      ],
      crimson: [
        '......0..',
        '.....030.',
        '....02340',
        '...023440',
        '..0123430',
        '.0122330.',
        '0122330..',
        '012230...',
        '.0120....',
        '..00.....',
        '.0.......',
      ],
      opal: [
        '....0....',
        '...030...',
        '..02340..',
        '.023.340.',
        '023...340',
        '023...340',
        '023...340',
        '.023.340.',
        '..02340..',
        '...020...',
        '....0....',
      ],
      silver: [
        '....0....',
        '...030...',
        '..02340..',
        '.0233340.',
        '012333340',
        '.0123340.',
        '..012340.',
        '...0230..',
        '...010...',
        '..00.00..',
        '.........',
      ],
      dawn: [
        '....0....',
        '...020...',
        '.0.030.0.',
        '023333320',
        '.0334330.',
        '003444300',
        '.0334330.',
        '023333320',
        '.0.030.0.',
        '...020...',
        '....0....',
      ],
    },
    shades = {
      ember: ['#3a2418', '#9a5d29', '#ffd06a', '#fff9d8'],
      rime: ['#203744', '#4c91ad', '#ceeef3', '#d3f6e0'],
      rose: ['#4a2c36', '#aa626f', '#f6bba5', '#e4cfbb'],
      moss: ['#293b29', '#6f8748', '#d6df9b', '#a0db9a'],
      copper: ['#402b25', '#925536', '#f1b97c', '#e2c190'],
      moon: ['#2d3150', '#767eb4', '#dad5fb', '#c7e8f1'],
      amethyst: ['#322843', '#755898', '#cfbaf0', '#e5cfff'],
      pearl: ['#343b3c', '#929f9a', '#e8e7da', '#efd5ce'],
      crimson: ['#4b222b', '#a53d3b', '#ffb37b', '#ffecb9'],
      opal: ['#253b3d', '#50998e', '#c4e2c2', '#dbaedb'],
      silver: ['#283744', '#6f8499', '#dee5e9', '#b3d3ec'],
      dawn: ['#5d3d1e', '#b78032', '#ffdf8c', '#fff5c9'],
    },
    id = maps[p.id] ? p.id : 'ember',
    rows = maps[id],
    [rim, shadow, facet, accent] = shades[id],
    colors = [rim, shadow, p.color, facet, p.light],
    etching = {
      ember: [
        [3, 4],
        [3, 5],
        [4, 7],
      ],
      rime: [
        [4, 4],
        [4, 5],
        [5, 7],
      ],
      rose: [
        [3, 3],
        [4, 4],
        [3, 5],
      ],
      moss: [
        [3, 4],
        [4, 3],
        [2, 5],
      ],
      copper: [
        [3, 2],
        [5, 2],
        [2, 7],
        [6, 7],
      ],
      moon: [
        [2, 3],
        [2, 7],
        [4, 9],
      ],
      amethyst: [
        [3, 5],
        [3, 6],
        [5, 8],
      ],
      pearl: [
        [3, 4],
        [3, 5],
        [5, 8],
      ],
      crimson: [
        [5, 3],
        [4, 4],
        [3, 6],
      ],
      opal: [
        [2, 4],
        [2, 6],
        [6, 4],
        [6, 6],
      ],
      silver: [
        [3, 3],
        [4, 4],
        [4, 6],
      ],
      dawn: [
        [3, 3],
        [5, 3],
        [3, 7],
        [5, 7],
      ],
    },
    frames = [];
  for (let f = 0; f < 12; f++) {
    const cv = document.createElement('canvas');
    cv.width = 15;
    cv.height = 17;
    const ink = cv.getContext('2d'),
      pulse = (1 + Math.sin((f / 12) * TAU)) / 2,
      bright = hearthShardMix(p.color, p.light, 0.55),
      glint = hearthShardMix(facet, p.light, 0.72),
      cell = (a, b, color) => {
        ink.fillStyle = color;
        ink.fillRect(3 + a, 3 + b, 1, 1);
      };
    for (let j = 0; j < rows.length; j++)
      for (let i = 0; i < rows[j].length; i++) {
        const code = rows[j][i];
        if (code === '.') continue;
        const sweep = (0.5 - Math.cos((f / 12) * TAU) * 0.5) * 10;
        let color = colors[Number(code)],
          band = Math.abs(i * 0.65 + j * 0.55 - sweep);
        if (id === 'rime' || id === 'silver') band = Math.abs(j - sweep);
        if (id === 'copper' || id === 'moon') {
          const angle = (Math.atan2(j - 5, i - 4) + TAU) % TAU,
            sweep = (f / 12) * TAU,
            gap = Math.abs(angle - sweep);
          band = Math.min(gap, TAU - gap) * 2;
        }
        if (code === '2' && band < 0.6) color = bright;
        if (code === '3' && band < 0.6) color = glint;
        if (id === 'rose' && code === '3')
          color = hearthShardMix(facet, p.light, 0.1 + pulse * 0.24);
        if (id === 'pearl' && code === '3') color = hearthShardMix(facet, accent, pulse * 0.28);
        if (id === 'opal' && code === '3')
          color = hearthShardMix(facet, f < 6 ? p.light : accent, pulse * 0.58);
        if (id === 'crimson' && j > 6 && code !== '0')
          color = hearthShardMix(shadow, p.color, 0.35 + pulse * 0.45);
        if (id === 'moss' && i + j === 7 && code === '3')
          color = hearthShardMix(facet, accent, pulse * 0.45);
        if (code !== '0' && code !== '4' && etching[id].some(([x, y]) => x === i && y === j))
          color = hearthShardMix(color, (i + j) % 2 ? shadow : p.light, 0.28);
        cell(i, j, color);
      }
    if (id === 'copper') {
      const [a, b] = [
        [3, 3],
        [5, 3],
        [5, 6],
        [3, 6],
      ][Math.floor(f / 3)];
      cell(a, b, shadow);
      cell(a, b + (b === 3 ? -1 : 1), glint);
    } else if (id === 'amethyst') {
      const [a, b] = [
        [4, 2],
        [2, 4],
        [7, 5],
      ][Math.floor(f / 4)];
      cell(a, b, f % 4 === 1 ? p.light : facet);
    } else if (id === 'pearl') {
      cell(4, 1, f < 4 || f > 8 ? facet : p.light);
      if (f >= 4 && f <= 7) cell(5, 1, shadow);
    } else if (id === 'crimson' && f >= 5 && f <= 8) {
      cell(0, 10, shadow);
      cell(1, 8, p.color);
    } else if (id === 'dawn') {
      for (const [a, b] of f < 6
        ? [
            [4, 2],
            [4, 8],
          ]
        : [
            [1, 3],
            [7, 7],
          ])
        cell(a, b, hearthShardMix(facet, p.light, 0.35 + pulse * 0.35));
    } else if (id === 'moss' && f >= 5 && f <= 7) {
      cell(5, 1, facet);
      cell(6, 1, p.light);
    }
    frames.push(cv);
  }
  hearthShardCache.set(key, frames);
  return frames;
}
function drawHearthShard(ctx, x, y, p, scale = 1, index = 0, options = {}) {
  p = p || HEARTH_PALETTES[0];
  const time = save.motion ? 0 : Number.isFinite(options.time) ? options.time : G.tAll || 0,
    frames = hearthShardFrames(p),
    frame = save.motion ? 0 : (((Math.floor(time * 6) + index * 3) % 12) + 12) % 12,
    rotation = save.motion
      ? index * 0.4
      : Number.isFinite(options.rotation)
        ? options.rotation
        : time * 0.45 + index * 0.4;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(rotation);
  ctx.scale(scale, scale);
  ctx.globalAlpha *= Number.isFinite(options.alpha) ? Math.max(0, Math.min(1, options.alpha)) : 1;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frames[frame], -15, -17, 30, 34);
  ctx.restore();
}
const hearthTrailHistory = new WeakMap();
function hearthTrailPreviewPosition(player, time) {
  return {
    x: player.x - 38 + Math.sin(time * 4.2) * 17,
    y: player.y + 7 + Math.cos(time * 4.2) * 6,
  };
}
function hearthSeedTrailPreview(history, player, clock) {
  for (let i = 10; i >= 0; i--) {
    const at = clock - i * 0.055,
      current = hearthTrailPreviewPosition(player, at),
      previous = hearthTrailPreviewPosition(player, at - 0.055),
      dx = current.x - previous.x,
      dy = current.y - previous.y,
      distance = Math.hypot(dx, dy) || 1;
    history.points.push({
      x: current.x,
      y: current.y,
      born: at,
      dx: dx / distance,
      dy: dy / distance,
      serial: history.serial++,
      dash: false,
    });
  }
}
function drawHearthTrail(ctx, player, palette, time, options = {}) {
  const preview = !!options.preview;
  if (!player || !palette || palette.id === 'ember' || (save.motion && !preview)) {
    if (player) hearthTrailHistory.delete(player);
    return;
  }
  const live = !preview && player === G.player,
    active = !live || (G.state === 'playing' && !G.paused && !G.dead),
    clock = live ? G.t : preview && save.motion ? 0 : time,
    world = live ? G.world : null,
    location = preview ? hearthTrailPreviewPosition(player, clock) : player,
    x = location.x,
    y = location.y;
  if (!Number.isFinite(clock) || !Number.isFinite(x) || !Number.isFinite(y)) {
    hearthTrailHistory.delete(player);
    return;
  }
  let history = hearthTrailHistory.get(player);
  if (
    !history ||
    history.id !== palette.id ||
    history.world !== world ||
    history.preview !== preview
  ) {
    history = { id: palette.id, world, preview, x, y, clock, carry: 0, serial: 0, points: [] };
    hearthTrailHistory.set(player, history);
  }
  const elapsed = clock - history.clock,
    dx = x - history.x,
    dy = y - history.y,
    distance = Math.hypot(dx, dy),
    dash = player.dashT > 0,
    teleport = Math.max(36, elapsed * (dash ? 1400 : 700)),
    reset =
      elapsed < 0 || elapsed > 0.18 || distance > teleport || (elapsed === 0 && distance > 0.03);
  if (reset) {
    history.points.length = 0;
    history.carry = 0;
  } else if (!preview && active && elapsed > 0) {
    if (distance > 0.025) {
      const interval = dash ? 0.043 : 0.055,
        nx = dx / distance,
        ny = dy / distance;
      for (let at = interval - Math.min(history.carry, interval); at <= elapsed; at += interval) {
        const u = at / elapsed;
        history.points.push({
          x: history.x + dx * u,
          y: history.y + dy * u,
          born: history.clock + at,
          dx: nx,
          dy: ny,
          serial: history.serial++,
          dash,
        });
      }
      history.carry = (history.carry + elapsed) % interval;
    } else history.carry = 0;
  }
  history.x = x;
  history.y = y;
  history.clock = clock;
  if (preview) {
    history.points.length = 0;
    history.serial = 0;
    history.carry = 0;
    hearthSeedTrailPreview(history, player, clock);
  }
  const lifetime = palette.id === 'rose' || palette.id === 'moss' ? 0.78 : 0.64,
    limit = save.quality === 'light' ? 18 : 28,
    points = history.points;
  while (points.length && clock - points[0].born > lifetime) points.shift();
  if (points.length > limit) points.splice(0, points.length - limit);
  let length = 0;
  for (let i = points.length - 1; i > 0; i--) {
    length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    if (length > 78) {
      points.splice(0, i);
      break;
    }
  }
  if (!points.length) return;
  const id = palette.id,
    color = palette.color,
    light = palette.light,
    px = (a, b, w, h, tint) => hearthPixel(ctx, a, b, w, h, tint),
    position = (p) => {
      const age = Math.max(0, clock - p.born),
        phase = p.serial * 2.399963,
        side = Math.sin(phase) * (preview ? 2 : 3.8),
        flutter =
          id === 'rose' || id === 'moss'
            ? Math.sin(age * 9 + phase) * age * 5
            : Math.sin(age * 6 + phase) * age * 2,
        lift = id === 'rose' || id === 'moss' ? age * 3 : id === 'rime' ? -age * 2 : -age * 7;
      return {
        x: p.x - p.dy * (side + flutter),
        y: p.y + p.dx * (side + flutter) + lift + 3,
        age,
        fade: Math.pow(Math.max(0, 1 - age / lifetime), 1.25),
        phase,
      };
    };
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.imageSmoothingEnabled = false;
  for (let i = 0; i < points.length; i++) {
    const p = points[i],
      q = position(p),
      sx = Math.round(q.x),
      sy = Math.round(q.y),
      frame = Math.floor(q.age * 9 + p.serial * 0.7) % 3,
      baseAlpha = q.fade * (preview ? 0.78 : p.dash ? 0.65 : 0.56);
    ctx.globalAlpha = baseAlpha;
    if (id === 'rime') {
      px(sx - 1, sy - 3, 1, 5, color);
      px(sx - 3, sy - 1, 5, 1, color);
      if (p.serial % 3 === 0) {
        px(sx - 3, sy - 3, 1, 1, color);
        px(sx + 1, sy + 1, 1, 1, color);
        px(sx + 1, sy - 3, 1, 1, light);
      }
      px(sx - 1, sy - 1, 1, 1, light);
      px(sx + 3, sy + 2, 1, 1, '#7baebc');
    } else if (id === 'rose') {
      const lean = frame - 1;
      px(sx - 1 + lean, sy - 2, 2, 1, light);
      px(sx - 2, sy - 1, 4, 2, color);
      px(sx - 1 - lean, sy + 1, 2, 1, '#bd6d82');
      px(sx + lean, sy - 1, 1, 1, '#ffd4cd');
    } else if (id === 'moss') {
      const lean = p.serial % 2 ? 1 : -1;
      px(sx + lean, sy - 3, 1, 1, light);
      px(sx - 1, sy - 2, 3, 3, color);
      px(sx - lean - 1, sy + 1, 2, 1, '#708653');
      px(sx, sy - 2, 1, 3, light);
      px(sx - lean, sy + 2, 1, 1, '#708653');
    } else if (id === 'copper') {
      if (p.serial % 4 === 0) {
        px(sx - 2, sy - 2, 4, 4, color);
        px(sx - 1, sy - 3, 2, 1, color);
        px(sx - 1, sy + 2, 2, 1, color);
        px(sx - 3, sy - 1, 1, 2, color);
        px(sx + 2, sy - 1, 1, 2, color);
        px(sx - 1, sy - 1, 2, 2, '#644530');
        px(sx - 2 + frame, sy - 2, 1, 1, light);
      } else {
        px(sx - 2, sy + 1, 2, 1, '#b8754d');
        px(sx, sy - 1, 1, 2, color);
        px(sx + 1, sy - 2, 1, 1, light);
      }
    } else if (id === 'moon') {
      if (p.serial % 3 === 0) {
        px(sx - 1, sy - 3, 3, 1, color);
        px(sx - 2, sy - 2, 1, 3, color);
        px(sx - 1, sy + 1, 3, 1, color);
        px(sx - 1, sy - 2, 1, 3, light);
      } else {
        px(sx - 1, sy - 1, 2, 2, color);
        px(sx, sy - 1, 1, 1, light);
        if (frame === 1) px(sx + 2, sy - 2, 1, 1, light);
      }
    } else if (id === 'amethyst') {
      px(sx, sy - 3, 1, 1, light);
      px(sx - 1, sy - 2, 3, 4, color);
      px(sx, sy + 2, 1, 1, '#7865a6');
      px(sx - 1, sy - 2, 1, 2, light);
      px(sx + 1, sy, 1, 2, '#7865a6');
      if (frame === 1) px(sx + 3, sy - 2, 1, 1, light);
    } else if (id === 'pearl') {
      ctx.globalAlpha = baseAlpha * 0.15;
      px(sx - 3, sy - 3, 6, 6, light);
      ctx.globalAlpha = baseAlpha;
      px(sx - 1, sy - 2, 2, 4, color);
      px(sx - 2, sy - 1, 4, 2, color);
      px(sx - 1, sy - 1, 1, 1, light);
      px(sx, sy + 1, 1, 1, '#a1b9b7');
    } else if (id === 'crimson') {
      for (let j = 3; j > 0; j--) {
        ctx.globalAlpha = baseAlpha * (1 - j * 0.19);
        px(sx - p.dx * j * 2, sy - p.dy * j * 2, j === 1 ? 2 : 1, 1, color);
      }
      ctx.globalAlpha = baseAlpha;
      px(sx - 1, sy - 1, 3, 2, '#ca524b');
      px(sx, sy - 1, 2, 1, light);
      if (frame === 1) px(sx - 2, sy + 2, 1, 1, color);
    } else if (id === 'opal') {
      const spectrum = ['#88c9b9', '#c5c3e9', '#e4bdcc', '#fcf0c8'],
        tint = spectrum[(p.serial + frame) % spectrum.length];
      if (i > 0) {
        const previous = position(points[i - 1]),
          span = Math.hypot(q.x - previous.x, q.y - previous.y);
        if (span < 20) {
          const steps = Math.max(1, Math.ceil(span / 2));
          ctx.globalAlpha = Math.min(q.fade, previous.fade) * 0.28;
          for (let j = 0; j < steps; j++) {
            const u = j / steps,
              tx = previous.x + (q.x - previous.x) * u,
              ty = previous.y + (q.y - previous.y) * u;
            px(tx, ty, 2, 1, tint);
            if (p.serial % 3 === 0) px(tx - p.dy * 2, ty + p.dx * 2, 1, 1, light);
          }
        }
      }
      ctx.globalAlpha = baseAlpha * 0.8;
      px(sx, sy - 1, 1, 2, tint);
      px(sx + 1, sy - 1, 1, 1, light);
    } else if (id === 'silver') {
      if (p.serial % 4 === 0) {
        px(sx, sy - 2, 1, 5, color);
        px(sx - 1, sy, 3, 1, color);
        px(sx, sy, 1, 1, light);
      } else px(sx, sy, frame === 1 ? 2 : 1, 1, light);
      ctx.globalAlpha = baseAlpha * 0.6;
      px(sx - 3, sy + 2, 1, 1, color);
      px(sx + 2, sy - 3, 1, 1, '#809ba9');
    } else if (id === 'dawn') {
      px(sx - 1, sy, 3, 2, '#db9445');
      px(sx - 1, sy - 2, 3, 3, color);
      px(sx + (frame === 0 ? 1 : 0), sy - 4, 1, 3, color);
      px(sx, sy - 1, 1, 2, light);
      if (p.serial % 5 === 0) {
        ctx.globalAlpha = baseAlpha * 0.65;
        px(sx - 3, sy - 1, 1, 1, color);
        px(sx + 3, sy - 1, 1, 1, color);
        px(sx, sy + 3, 1, 1, color);
      }
    }
  }
  ctx.restore();
}
const hearthDrawPlayer = drawPlayer;
drawPlayer = function (ctx) {
  if (G.player && !G.dead) {
    const trail = HEARTH_PALETTES.find((item) => item.id === hearthData().trail);
    drawHearthTrail(ctx, G.player, trail, G.tAll);
  }
  hearthDrawPlayer(ctx);
};
