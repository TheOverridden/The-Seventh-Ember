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
  px(0, 0, 640, 360, '#131314');
  px(18, 13, 604, 230, '#282723');
  for (let row = 0; row < 13; row++) {
    const y = 19 + row * 17;
    for (let x = -22 + (row % 2) * 26; x < 642; x += 52) {
      const shade = (x * 7 + row * 19 + 200) & 7;
      px(x + 1, y, 49, 15, ['#35322c', '#3b342b', '#302e29', '#38352d'][shade % 4]);
      px(x + 3, y + 1, 43, 1, '#514639');
      px(x + 3, y + 13, 41, 1, '#292723');
      px(x + 47, y + 3, 1, 9, '#242523');
      if (shade > 4) {
        px(x + 12 + shade, y + 6, 12, 1, '#474037');
        px(x + 21 + shade, y + 7, 7, 1, '#2a2824');
      }
    }
  }
  poly(
    [
      [0, 0],
      [24, 13],
      [24, 234],
      [0, 268],
    ],
    '#292721'
  );
  poly(
    [
      [640, 0],
      [616, 13],
      [616, 234],
      [640, 268],
    ],
    '#222420'
  );
  for (let y = 23; y < 238; y += 28) {
    px(5, y, 15, 1, '#494132');
    px(620, y, 15, 1, '#34362d');
  }
  px(20, 13, 600, 10, '#161817');
  px(21, 13, 598, 3, '#9b7750');
  px(24, 17, 590, 3, '#644c32');
  for (const x of [25, 218, 430, 601]) {
    px(x - 3, 23, 18, 216, '#161a18');
    px(x, 24, 12, 208, '#594531');
    px(x, 24, 3, 204, '#8d6a41');
    px(x + 9, 25, 3, 207, '#362d23');
    for (let y = 35; y < 226; y += 25) {
      px(x + 4, y, 2, 14, '#403523');
      px(x + 6, y + 13, 2, 3, '#b18b55');
    }
    px(x - 2, 225, 16, 4, '#957246');
    px(x - 4, 231, 20, 8, '#342f24');
    px(x - 2, 232, 16, 2, '#ad8651');
  }
  px(20, 227, 597, 7, '#514436');
  px(21, 227, 595, 2, '#8c704c');
  px(20, 235, 596, 4, '#191d1a');
  poly(
    [
      [20, 239],
      [615, 239],
      [640, 360],
      [0, 360],
    ],
    '#322c25'
  );
  const flooring = h.layout.floor;
  let floorY = 240;
  for (let row = 0; row < 7; row++) {
    const height = 13 + row * 2,
      width = 71 + row * 7;
    for (let x = -width + (row % 2) * width * 0.5; x < 640; x += width) {
      const tone = (Math.round(x / width) + row + 30) % 4;
      if (flooring === 'oak') {
        px(x, floorY, width - 2, height - 1, ['#624d36', '#57432e', '#6a5137', '#584733'][tone]);
        px(x + 2, floorY + 1, width - 6, 1, '#967346');
        px(x + 11, floorY + 5, width - 24, 1, '#795a3d');
        px(x + 6, floorY + height - 4, width - 22, 1, '#3d3429');
        px(x + width - 7, floorY + 3, 1, 2, '#292b23');
        px(x + 5, floorY + height - 4, 1, 2, '#272a22');
        if ((row + tone) % 3 === 0) {
          px(x + width / 2, floorY + height / 2, 10, 1, '#3e3528');
          px(x + width / 2 + 2, floorY + height / 2 + 1, 6, 1, '#a1814b');
        }
      } else {
        const colors =
          flooring === 'slate'
            ? ['#474a44', '#505249', '#3f463f', '#535548']
            : flooring === 'dawnstone'
              ? ['#948161', '#a18d64', '#86775b', '#ad9a6c']
              : ['#5d6250', '#535a48', '#70694e', '#555c4b'];
        px(x + 1, floorY, width - 3, height - 1, colors[tone]);
        px(x + 3, floorY + 1, width - 8, 1, flooring === 'dawnstone' ? '#cfb37b' : '#8e9172');
        px(x + width - 5, floorY + 3, 1, height - 6, '#353b32');
        px(x + 6, floorY + height - 3, width - 15, 1, '#353a30');
        if (flooring === 'mosaic') {
          const center = x + width / 2,
            yy = floorY + height / 2;
          poly(
            [
              [center, yy - 4],
              [center + 8, yy],
              [center, yy + 4],
              [center - 8, yy],
            ],
            '#c4a46a'
          );
          px(center - 2, yy - 1, 4, 2, '#58694e');
          px(x + 10, yy - 1, 3, 2, '#879b78');
          px(x + width - 13, yy - 1, 3, 2, '#879b78');
        }
      }
    }
    floorY += height;
  }
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
            ? ['#465e57', '#36504d', '#283e3e']
            : ['#263344', '#25353c', '#213135'];
  px(66, 57, 97, 10, sky[0]);
  px(58, 66, 113, 28, sky[0]);
  px(58, 94, 113, 29, sky[1]);
  px(58, 123, 113, 23, sky[2]);
  if (weather === 'sunrise') {
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
  px(58, 67, 2, 76, '#c6b187');
  px(109, 55, 5, 94, '#8a6b43');
  px(109, 57, 1, 90, '#e0c291');
  px(57, 106, 115, 4, '#92734c');
  px(58, 106, 112, 1, '#d2b380');
  px(45, 150, 139, 5, '#ba9563');
  px(48, 151, 132, 1, '#e7c794');
  px(48, 156, 132, 4, '#4a4030');
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
  for (let y = 180; y < 241; y += 7) {
    px(42, y, 145, 1, '#896846');
    px(50 + ((y * 11) % 60), y + 1, 42, 1, '#624b34');
  }
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
    for (let row = 0; row < 3; row++) {
      px(x + 5, y + height - 10 + row * 3, w - 11 - (row % 2) * 6, 1, '#948466');
    }
  }
  px(71, 234, 12, 8, '#506d62');
  px(105, 239, 12, 7, '#b5844a');
  px(150, 234, 13, 9, '#a16a51');
  px(75, 235, 4, 2, '#b6c2a1');
  px(109, 240, 4, 2, '#e4bc7b');
  px(154, 235, 4, 2, '#e4ae82');
  px(252, 24, 143, 197, '#282821');
  for (let row = 0; row < 12; row++) {
    const y = 29 + row * 15;
    for (let x = 254 - (row % 2) * 23; x < 395; x += 46) {
      const left = Math.max(254, x),
        right = Math.min(394, x + 44);
      if (right <= left) continue;
      px(left, y, right - left, 13, row % 3 === 0 ? '#635a48' : '#59513f');
      px(left + 2, y + 1, Math.max(1, right - left - 5), 1, '#a18a60');
      px(left + 3, y + 11, Math.max(1, right - left - 6), 1, '#403c30');
    }
  }
  px(254, 25, 3, 95, '#a18a5e');
  px(391, 25, 3, 96, '#3c3a2e');
  px(279, 41, 89, 45, '#332f27');
  px(282, 43, 84, 40, '#816748');
  px(286, 46, 75, 34, '#473d2d');
  poly(
    [
      [324, 49],
      [330, 57],
      [329, 63],
      [335, 68],
      [332, 75],
      [317, 75],
      [313, 68],
      [319, 62],
      [319, 56],
    ],
    '#b48b53'
  );
  px(322, 58, 4, 14, '#dfbb7c');
  px(291, 52, 2, 22, '#ae8a55');
  px(354, 52, 2, 22, '#887347');
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
  px(247, 123, 154, 11, '#3e382b');
  px(238, 114, 172, 9, '#ae8c56');
  px(242, 112, 164, 3, '#d8b37a');
  px(242, 116, 164, 2, '#efd19a');
  px(242, 127, 164, 3, '#796140');
  for (const x of [251, 383]) {
    px(x, 130, 13, 13, '#8b7450');
    px(x + 3, 143, 7, 9, '#4c4532');
  }
  px(285, 96, 28, 16, '#262b25');
  px(289, 92, 20, 5, '#887451');
  px(290, 97, 15, 10, '#716548');
  px(291, 99, 3, 5, '#b8a27a');
  px(305, 99, 10, 2, '#776542');
  px(313, 98, 3, 7, '#a48a5a');
  px(337, 104, 10, 8, '#baa172');
  px(337, 105, 8, 2, '#edd4a3');
  px(347, 106, 3, 4, '#a0885b');
  px(356, 104, 17, 8, '#826b4c');
  px(358, 98, 13, 6, '#b59d70');
  px(360, 94, 9, 4, '#968360');
  poly(
    [
      [263, 225],
      [263, 160],
      [270, 160],
      [270, 147],
      [280, 147],
      [280, 137],
      [293, 137],
      [293, 132],
      [354, 132],
      [354, 137],
      [368, 137],
      [368, 147],
      [379, 147],
      [379, 160],
      [386, 160],
      [386, 225],
    ],
    '#8c7751'
  );
  poly(
    [
      [273, 220],
      [273, 161],
      [280, 161],
      [280, 149],
      [291, 149],
      [291, 143],
      [302, 143],
      [302, 139],
      [347, 139],
      [347, 143],
      [358, 143],
      [358, 151],
      [369, 151],
      [369, 164],
      [376, 164],
      [376, 220],
    ],
    '#151b1b'
  );
  poly(
    [
      [281, 219],
      [281, 163],
      [289, 163],
      [289, 155],
      [299, 155],
      [299, 149],
      [348, 149],
      [348, 155],
      [359, 155],
      [359, 164],
      [367, 164],
      [367, 219],
    ],
    '#292520'
  );
  for (let y = 160; y < 209; y += 13) {
    px(283, y, 82, 1, '#433026');
    for (let x = 289 + (Math.floor(y / 13) % 2) * 17; x < 366; x += 32) px(x, y, 1, 11, '#39261f');
  }
  for (const x of [262, 377]) {
    for (let y = 165; y < 224; y += 16) {
      px(x, y, 12, 14, '#7b6848');
      px(x + 1, y + 1, 10, 2, '#c3a16d');
      px(x + 1, y + 12, 10, 1, '#494231');
    }
  }
  for (const [x, y, w] of [
    [273, 148, 12],
    [282, 138, 13],
    [296, 132, 13],
    [311, 130, 14],
    [327, 130, 14],
    [343, 132, 13],
    [359, 139, 12],
    [371, 149, 12],
  ]) {
    px(x, y, w, 6, '#b29763');
    px(x + 1, y, w - 2, 1, '#d6b27a');
  }
  px(252, 223, 145, 8, '#51432e');
  px(247, 231, 156, 8, '#b29761');
  px(249, 231, 151, 2, '#dcb780');
  poly(
    [
      [247, 239],
      [403, 239],
      [416, 252],
      [233, 252],
    ],
    '#796340'
  );
  px(233, 253, 183, 5, '#242821');
  px(241, 245, 162, 1, '#cbaa72');
  poly(
    [
      [290, 211],
      [299, 209],
      [355, 216],
      [356, 222],
      [348, 224],
      [291, 217],
    ],
    '#432d22'
  );
  poly(
    [
      [293, 210],
      [300, 209],
      [353, 216],
      [351, 218],
    ],
    '#966138'
  );
  poly(
    [
      [300, 219],
      [348, 207],
      [354, 210],
      [352, 216],
      [306, 225],
      [300, 224],
    ],
    '#4a3023'
  );
  px(301, 219, 7, 3, '#c98745');
  px(349, 210, 4, 4, '#be7d3f');
  for (let i = 0; i < 10; i++) {
    px(286 + i * 8, 225 + (i % 2), 5, 2, i % 3 === 0 ? '#dc823b' : '#734025');
    if (i % 3 === 0) px(286 + i * 8, 224, 3, 1, '#f6b559');
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
      px(x + 2, 115 - height, 1, height - 2, '#c9b181');
      px(x + 2, 109, 5, 1, '#c9b181');
      px(x + 2, 118 - height, 5, 1, '#c9b181');
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
  for (let row = 0; row < 14; row++) {
    const y = 286 + row * 2,
      offset = row * 1.35;
    px(231 - offset, y, 179 + offset * 2, 1, rugColor);
  }
  for (let i = 0; i < 24; i++) {
    px(175 + i * 12, 333, 4, 3 + (i % 2), '#cfb48b');
    px(214 + i * 9, 272, 3, 2, '#9c8156');
  }
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
  poly(
    [
      [48, 296],
      [128, 296],
      [143, 329],
      [38, 329],
    ],
    '#272b22'
  );
  px(58, 255, 61, 49, '#322e22');
  px(61, 252, 56, 45, '#8a633f');
  px(66, 256, 45, 31, '#68714d');
  px(69, 258, 39, 26, '#7e865c');
  px(70, 258, 36, 2, '#a0a479');
  px(69, 284, 38, 2, '#4f5b3b');
  px(55, 280, 10, 34, '#a17c4d');
  px(111, 280, 10, 34, '#a17c4d');
  px(55, 280, 10, 3, '#d3ad70');
  px(111, 280, 10, 3, '#d3ad70');
  px(63, 294, 48, 15, '#677249');
  px(65, 294, 43, 2, '#aab484');
  px(64, 308, 47, 3, '#494b31');
  px(58, 312, 9, 18, '#88623d');
  px(108, 312, 9, 18, '#88623d');
  px(58, 328, 10, 2, '#bb935f');
  px(108, 328, 10, 2, '#bb935f');
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
  px(138, 269, 20, 12, '#e1cca0');
  px(140, 269, 16, 2, '#fff0c5');
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
  ctx.rect(59, 66, 112, 80);
  ctx.clip();
  if (weather === 'snow') {
    for (let i = 0; i < 26; i++) {
      const x = 60 + ((i * 31 + Math.sin(time * 0.8 + i) * 3 + 112) % 110),
        y = 66 + ((i * 23 + time * 11) % 80);
      px(x, y, i % 5 === 0 ? 2 : 1, 2, '#c9d4c5');
    }
  } else if (weather === 'rain' || weather === 'night') {
    for (let i = 0; i < 30; i++) {
      const x = 61 + ((i * 19) % 108),
        y = 66 + ((i * 29 + time * 48) % 80);
      px(x, y, 1, 4, weather === 'night' ? '#7c9395' : '#9db3a1');
      px(x - 1, y + 4, 1, 2, weather === 'night' ? '#506e70' : '#6a8d7e');
    }
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
  px(109, 66, 5, 80, '#8a6b43');
  px(109, 66, 1, 80, '#d8b885');
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
  ctx.save();
  ctx.globalAlpha = 0.34;
  hearthPoly(
    ctx,
    [
      [308, 312],
      [330, 309],
      [347, 313],
      [341, 318],
      [314, 318],
    ],
    '#242d25'
  );
  ctx.restore();
  const palette = HEARTH_PALETTES.find((p) => p.id === h.shards) || HEARTH_PALETTES[0];
  for (let i = 0; i < 3; i++) {
    const a = time * 1.4 + (i * TAU) / 3;
    if (Math.sin(a) < 0)
      drawHearthShard(ctx, 326 + Math.cos(a) * 21, 299 + Math.sin(a) * 8, palette, 0.9, i);
  }
  hearthFlame(ctx, 326, 312, time, 0.55);
  for (let i = 0; i < 3; i++) {
    const a = time * 1.4 + (i * TAU) / 3;
    if (Math.sin(a) >= 0)
      drawHearthShard(ctx, 326 + Math.cos(a) * 21, 299 + Math.sin(a) * 8, palette, 0.9, i);
  }
}
function drawHearthShard(ctx, x, y, p, scale = 1, index = 0) {
  p = p || HEARTH_PALETTES[0];
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(scale, scale);
  const px = (a, b, w, h, color) => hearthPixel(ctx, a, b, w, h, color),
    id = p.id;
  if (id === 'moon') {
    hearthPoly(
      ctx,
      [
        [-5, -6],
        [0, -6],
        [4, -3],
        [5, 2],
        [1, 6],
        [-3, 5],
        [0, 3],
        [2, 0],
        [0, -3],
      ],
      p.color
    );
    px(2, -2, 1, 5, p.light);
  } else if (id === 'copper') {
    px(-5, -4, 10, 8, p.color);
    px(-3, -6, 6, 12, p.color);
    px(-7, -2, 14, 4, p.color);
    px(-2, -2, 4, 4, '#382b24');
    px(-3, -4, 6, 1, p.light);
  } else if (id === 'moss' || id === 'rose') {
    hearthPoly(
      ctx,
      [
        [0, -7],
        [5, -2],
        [4, 3],
        [0, 6],
        [-4, 3],
        [-3, -2],
      ],
      p.color
    );
    px(0, -3, 1, 7, p.light);
  } else if (id === 'opal') {
    hearthPoly(
      ctx,
      [
        [0, -7],
        [6, 0],
        [0, 7],
        [-6, 0],
      ],
      p.color
    );
    hearthPoly(
      ctx,
      [
        [0, -4],
        [3, 0],
        [0, 4],
        [-3, 0],
      ],
      '#2e3334'
    );
    px(-3, -1, 1, 3, p.light);
  } else if (id === 'dawn') {
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      px(-1, -8, 2, 5, p.color);
    }
    px(-3, -3, 6, 6, p.light);
  } else if (id === 'pearl') {
    px(-3, -3, 6, 6, p.light);
    px(-1, -6, 2, 12, p.color);
    px(-6, -1, 12, 2, p.color);
  } else {
    hearthPoly(
      ctx,
      [
        [0, -7],
        [4, -1],
        [2, 5],
        [-1, 7],
        [-4, 0],
      ],
      p.color
    );
    px(-1, -3, 2, 7, p.light);
    if (index === 1) px(3, -5, 2, 2, p.light);
  }
  ctx.restore();
}
const hearthDrawPlayer = drawPlayer;
drawPlayer = function (ctx) {
  hearthDrawPlayer(ctx);
  if (!G.player || G.dead) return;
  const h = hearthData(),
    p = G.player,
    t = save.motion ? 0 : G.tAll,
    palette = HEARTH_PALETTES.find((p) => p.id === h.shards);
  if (h.shards !== 'ember' && !(p.hitCd > 0 && ((G.tAll * 18) | 0) % 2 === 0))
    for (let i = 0; i < 3; i++) {
      const a = t * 1.78 + (i * TAU) / 3;
      drawHearthShard(ctx, p.x + Math.cos(a) * 26, p.y - 6 + Math.sin(a) * 11, palette, 0.6, i);
    }
  if (h.trail === 'ember' || !p.moving || save.motion) return;
  const trail = HEARTH_PALETTES.find((p) => p.id === h.trail),
    a = p.dashT > 0 ? Math.atan2(p.dashDy, p.dashDx) : p.face || 0;
  ctx.save();
  for (let i = 0; i < 6; i++) {
    const u = (t * 2 + i / 6) % 1,
      x = p.x - Math.cos(a) * (8 + u * 30) + Math.sin(t * 3 + i) * 4,
      y = p.y - Math.sin(a) * (8 + u * 30) + Math.cos(t * 2 + i) * 3;
    ctx.globalAlpha = (1 - u) * 0.6;
    drawHearthShard(ctx, x, y, trail, 0.2 + u * 0.12, i);
  }
  ctx.restore();
};
