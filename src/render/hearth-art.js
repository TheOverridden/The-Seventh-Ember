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
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const px = (a, b, w, h, c) => hearthPixel(ctx, a, b, w, h, c),
    f = save.motion ? 0 : Math.floor(t * 7) % 4;
  px(-18, -4, 36, 5, '#49271b');
  px(-15, -18, 30, 16, '#b94522');
  px(-11, -27 - f * 2, 22, 27, '#e06a27');
  px(-7, -38 + f * 2, 14, 37, '#f7a344');
  px(-2, -48 + f * 3, 5, 27, '#ffc46a');
  px(-5, -26, 10, 25, '#ffde93');
  px(-2, -20, 5, 19, '#fff0bf');
  px(-14, -28 + f, 4, 13, '#de712b');
  px(10, -34 - f * 2, 4, 18, '#e58a35');
  px(-10, -7, 20, 3, '#fff0b0');
  ctx.restore();
}
function hearthLantern(ctx, x, y, kind, t) {
  const px = (a, b, w, h, c) => hearthPixel(ctx, x + a, y + b, w, h, c),
    color =
      kind === 'stars'
        ? '#c6d8e7'
        : kind === 'orchard'
          ? '#abc98c'
          : kind === 'bellglass'
            ? '#a2c8c7'
            : '#ffd58b';
  px(-1, -28, 2, 20, '#65533e');
  px(-8, -11, 16, 2, '#ba9460');
  px(-11, -7, 22, 20, '#342e29');
  px(-8, -6, 16, 17, '#725b3b');
  px(-6, -4, 12, 12, color);
  px(-4, -3, 3, 10, '#fff2c9');
  px(-10, 12, 20, 3, '#b18b53');
  px(-8, 16, 16, 2, '#302b24');
  px(-10, -5, 3, 16, '#4c4032');
  px(7, -5, 3, 16, '#4c4032');
  px(-1, -7, 2, 21, '#8d724a');
  if (kind === 'orchard') {
    px(-14, 0, 5, 3, '#647651');
    px(10, 7, 6, 3, '#829365');
  }
  if (kind === 'stars')
    for (let i = 0; i < 3; i++) {
      const a = t * 0.4 + (i * TAU) / 3;
      px(Math.cos(a) * 15, Math.sin(a) * 15, 2, 2, '#e4eddf');
    }
}
function hearthRelic(ctx, x, y, index, earned, t = 0) {
  ctx.save();
  ctx.translate(x, y);
  const c = BLESSING_COMBOS[index],
    p = HEARTH_PALETTES[Math.floor(index / 3) % 12];
  ctx.globalAlpha = earned ? 1 : 0.22;
  hearthPixel(ctx, -7, 8, 14, 3, '#8e7553');
  hearthPixel(ctx, -5, 5, 10, 3, '#3f3530');
  if (earned) {
    drawComboEmblem(ctx, c.family, 0, -2, 15);
    hearthPixel(ctx, -1, 10, 2, 2, p.light);
  } else {
    hearthPixel(ctx, -4, -7, 8, 12, '#4d4943');
    hearthPixel(ctx, -6, -3, 12, 4, '#4d4943');
  }
  ctx.restore();
}
function hearthBuildRoom() {
  const h = hearthData(),
    count = hearthCount(),
    guardians = achievementData().guardians,
    key = JSON.stringify([
      h.layout,
      count,
      Object.keys(h.completed),
      guardians,
      h.vowSeals,
      h.crowns,
    ]);
  if (hearthRoomCache && key === hearthRoomKey) return hearthRoomCache;
  hearthRoomKey = key;
  const cv = document.createElement('canvas');
  cv.width = 640;
  cv.height = 360;
  const ctx = cv.getContext('2d'),
    px = (x, y, w, z, c) => hearthPixel(ctx, x, y, w, z, c),
    poly = (a, c) => hearthPoly(ctx, a, c);
  ctx.imageSmoothingEnabled = false;
  px(0, 0, 640, 360, '#100f12');
  px(14, 12, 612, 238, '#282525');
  for (let y = 26; y < 240; y += 22)
    for (let x = 16 - (Math.floor(y / 22) % 2) * 25; x < 624; x += 49) {
      const n = (x * 31 + y * 17) & 15;
      px(x, y, 47, 20, ['#302d2b', '#35312d', '#292829', '#322e2c'][n % 4]);
      px(x + 2, y + 2, 43, 2, '#443d33');
      px(x + 44, y + 4, 2, 14, '#211f22');
      px(x + 4, y + 17, 32, 1, '#242326');
      if (n > 10) {
        px(x + 10, y + 8, 8, 1, '#464033');
        px(x + 16, y + 9, 1, 5, '#464033');
      }
    }
  for (const x of [16, 211, 424, 605]) {
    px(x, 20, 19, 235, '#16191a');
    px(x + 3, 20, 13, 232, '#463b2e');
    px(x + 3, 23, 3, 225, '#746044');
    for (let y = 42; y < 235; y += 26) {
      px(x + 7, y, 5, 2, '#241f1d');
      px(x + 9, y + 2, 2, 14, '#332b22');
    }
    px(x - 5, 235, 29, 9, '#5d4e38');
    px(x - 6, 246, 31, 6, '#252122');
  }
  px(12, 12, 616, 16, '#17171a');
  px(18, 12, 604, 5, '#736047');
  px(19, 23, 602, 4, '#423627');
  for (let x = 32; x < 620; x += 26) {
    px(x, 13, 1, 6, '#aa8454');
    px(x + 10, 21, 9, 1, '#241d19');
  }
  poly(
    [
      [10, 253],
      [630, 253],
      [640, 360],
      [0, 360],
    ],
    '#493b2e'
  );
  const flooring = h.layout.floor;
  for (let row = 0; row < 7; row++) {
    const y = 253 + row * 16,
      w = 80 + row * 5;
    for (let x = -w + ((row % 2) * w) / 2; x < 640; x += w) {
      const tone = (Math.floor(x / w) + row + 30) % 4;
      if (flooring === 'oak') {
        px(x, y, w - 2, 14, ['#594531', '#4d3d2e', '#654d36', '#544131'][tone]);
        px(x + 4, y + 4, w - 10, 1, '#756044');
        px(x + 12, y + 10, w - 28, 1, '#342d26');
        px(x + w - 6, y + 3, 1, 8, '#8a6943');
      } else {
        px(
          x,
          y,
          w - 2,
          14,
          (flooring === 'slate'
            ? ['#454746', '#393c3e', '#484c48', '#40423f']
            : flooring === 'dawnstone'
              ? ['#716249', '#625842', '#847452', '#706247']
              : ['#4d4c49', '#3c4242', '#594f42', '#40433f'])[tone]
        );
        px(x + 2, y + 1, w - 6, 1, '#938266');
        if (flooring === 'mosaic') {
          px(x + w / 2, y + 5, 4, 4, '#c3a975');
          px(x + w / 2 - 5, y + 7, 14, 1, '#877450');
        }
      }
    }
  }
  px(236, 51, 168, 189, '#17191b');
  px(242, 55, 156, 170, '#39332d');
  poly(
    [
      [244, 137],
      [244, 82],
      [258, 82],
      [258, 65],
      [277, 65],
      [277, 55],
      [363, 55],
      [363, 65],
      [382, 65],
      [382, 82],
      [396, 82],
      [396, 137],
    ],
    '#4f4739'
  );
  for (let i = 0; i < 7; i++) {
    px(252 + i * 20, 83, 18, 11, '#76634b');
    px(254 + i * 20, 84, 14, 2, '#a48b60');
  }
  px(254, 100, 132, 27, '#63543e');
  px(250, 124, 140, 9, '#a38758');
  px(255, 126, 130, 2, '#d0aa6d');
  for (let i = 0; i < 7; i++) {
    const x = 272 + i * 15;
    px(x, 107, 7, 7, '#433b30');
    px(x + 1, 108, 5, 2, '#b39b6c');
    px(x + 3, 114, 1, 4, '#c7ab78');
    px(x + 1, 119, 5, 1, '#332f28');
  }
  px(304, 90, 32, 2, '#d2b07b');
  px(311, 87, 18, 1, '#a08252');
  px(261, 136, 118, 80, '#0e1014');
  px(266, 140, 108, 65, '#1c181b');
  px(267, 140, 106, 4, '#2f2020');
  for (let y = 150; y < 200; y += 14)
    for (let x = 267; x < 372; x += 25) {
      px(x, y, 22, 1, '#352623');
      px(x + 22, y, 1, 10, '#281c1d');
    }
  for (const x of [246, 380]) {
    px(x, 134, 14, 94, '#554a3a');
    px(x + 2, 135, 3, 88, '#97815a');
    for (let y = 147; y < 226; y += 17) {
      px(x + 5, y, 7, 1, '#342e28');
      px(x + 4, y + 2, 8, 1, '#b19b6d');
    }
  }
  px(237, 224, 166, 9, '#39352e');
  px(232, 232, 176, 8, '#9c8154');
  px(239, 233, 160, 2, '#d0b27e');
  px(226, 243, 188, 7, '#302e2a');
  px(276, 204, 88, 7, '#473023');
  px(280, 205, 79, 2, '#9a5730');
  px(283, 210, 75, 5, '#1d1b1c');
  px(279, 214, 84, 3, '#2c2420');
  for (let i = 0; i < 5; i++) {
    px(281 + i * 16, 218, 10, 3, '#6d3921');
    px(283 + i * 16, 217, 6, 1, '#d78337');
  }
  px(286, 73, 68, 7, '#211e1b');
  px(293, 67, 54, 7, '#725944');
  px(300, 61, 40, 6, '#b79863');
  px(308, 54, 24, 7, '#3c3027');
  px(317, 57, 6, 6, '#efd39a');
  const banner = h.layout.banner,
    bcolor = { linen: '#807252', roots: '#5b714f', mooncloth: '#646c85', suncloth: '#a48040' }[
      banner
    ];
  for (const x of [223, 398]) {
    px(x, 45, 19, 84, '#15181a');
    px(x + 2, 47, 15, 70, bcolor);
    poly(
      [
        [x + 2, 115],
        [x + 17, 115],
        [x + 17, 127],
        [x + 10, 120],
        [x + 2, 127],
      ],
      bcolor
    );
    px(x + 5, 49, 2, 65, '#c3a878');
    px(x + 2, 47, 15, 2, '#efce8b');
    for (let y = 59; y < 106; y += 12) {
      px(x + 9, y, 2, 2, '#d2bd8c');
      px(x + 7, y + 2, 6, 1, '#a59475');
    }
    if (banner === 'roots') {
      for (let y = 56; y < 110; y += 10) {
        px(x + 10, y, 1, 9, '#bdc38e');
        px(x + 7, y + 1, 4, 2, '#a5b979');
        px(x + 10, y + 5, 4, 2, '#849e6a');
      }
    } else if (banner === 'mooncloth') {
      poly(
        [
          [x + 10, 66],
          [x + 14, 70],
          [x + 10, 75],
          [x + 7, 71],
        ],
        '#ece0ba'
      );
      px(x + 10, 65, 4, 5, bcolor);
      for (let y = 81; y < 105; y += 10) px(x + 11, y, 2, 2, '#ded9b4');
    } else if (banner === 'suncloth') {
      px(x + 8, 68, 5, 5, '#f4dd9a');
      px(x + 10, 64, 1, 13, '#e8c676');
      px(x + 6, 70, 9, 1, '#e8c676');
    }
  }
  for (const x of [62, 494]) {
    px(x - 7, 51, 105, 104, '#111619');
    poly(
      [
        [x - 4, 153],
        [x - 4, 66],
        [x + 8, 66],
        [x + 8, 54],
        [x + 78, 54],
        [x + 78, 66],
        [x + 91, 66],
        [x + 91, 153],
      ],
      '#6b6050'
    );
    px(x + 1, 70, 85, 77, '#111c26');
    px(x + 1, 72, 84, 24, '#1b2930');
    px(x + 1, 96, 84, 51, '#25343a');
    for (let i = 0; i < 9; i++) {
      const y = 138 - i * 4,
        xx = x + 6 + i * 9;
      poly(
        [
          [xx - 12, y + 10],
          [xx, y - 8],
          [xx + 15, y + 11],
        ],
        '#1b252c'
      );
    }
    px(x + 42, 66, 4, 83, '#877351');
    px(x + 2, 111, 85, 4, '#a0865a');
    px(x - 8, 149, 105, 6, '#ad9264');
    px(x - 10, 156, 108, 5, '#3b352c');
    px(x + 39, 74, 2, 34, '#d2b780');
    px(x + 5, 73, 2, 32, '#968c6c');
  }
  px(38, 170, 145, 78, '#16191a');
  px(43, 173, 136, 70, '#4b3f30');
  for (let y = 184; y < 235; y += 22) {
    px(46, y, 130, 17, '#191c1d');
    px(43, y + 18, 136, 4, '#957749');
    px(43, y + 21, 136, 1, '#252221');
  }
  for (let i = 0; i < 12; i++) {
    const x = 48 + i * 10,
      y = 185,
      hh = 10 + ((i * 7) % 7),
      col = ['#77754d', '#785447', '#525f67', '#9b8256'][i % 4];
    px(x, y + 14 - hh, 8, hh, col);
    px(x + 2, y + 14 - hh, 2, hh, '#b39a70');
    px(x + 1, y + 10, 6, 1, '#302925');
  }
  for (let i = 0; i < 12; i++) {
    const x = 48 + i * 10,
      y = 207,
      col =
        h.layout.shelf === 'bottles'
          ? '#83a8a6'
          : h.layout.shelf === 'gears'
            ? '#b48e53'
            : '#6e754e';
    if (h.layout.shelf === 'books') {
      px(x, y, 7, 13, ['#77594a', '#6d7856', '#8f7954'][i % 3]);
      px(x + 2, y, 1, 12, '#bda16d');
    } else if (h.layout.shelf === 'gears') {
      poly(
        [
          [x + 3, y],
          [x + 7, y + 4],
          [x + 7, y + 9],
          [x + 3, y + 13],
          [x - 1, y + 9],
          [x - 1, y + 4],
        ],
        col
      );
      px(x + 1, y + 5, 4, 4, '#24302b');
      px(x + 2, y + 2, 2, 2, '#e1bc74');
    } else if (h.layout.shelf === 'herbs') {
      px(x + 3, y, 1, 14, '#a3a579');
      for (let j = 0; j < 3; j++) {
        px(x, y + 3 + j * 3, 4, 2, j % 2 ? '#6f875d' : '#a2af78');
        px(x + 4, y + 4 + j * 3, 3, 2, '#80965e');
      }
    } else {
      px(x + 2, y, 3, 5, '#b4a077');
      px(x, y + 5, 7, 9, col);
      px(x + 1, y + 6, 2, 5, '#bcc6a0');
    }
  }
  if (h.layout.shelf === 'gears') {
    px(99, 202, 25, 19, '#b29861');
    px(103, 204, 17, 14, '#1e302f');
    px(111, 205, 1, 10, '#e8d4a1');
    px(110, 210, 7, 1, '#e8d4a1');
    px(100, 219, 23, 3, '#d3bc82');
  }
  px(31, 166, 158, 5, '#b6965d');
  px(36, 171, 148, 2, '#6a5537');
  px(37, 242, 148, 9, '#352f26');
  px(47, 251, 10, 7, '#b38e56');
  px(167, 251, 10, 7, '#b38e56');
  px(35, 43, 147, 7, '#6f593c');
  px(38, 48, 141, 7, '#b39055');
  px(42, 56, 133, 27, '#191c1c');
  for (let i = 0; i < 10; i++) {
    const g = GUARDIAN_ROSTER[i],
      x = 48 + i * 13,
      lit = guardians.includes(g.key),
      spr = SPR[g.type];
    if (lit && spr?.frames?.length) {
      ctx.drawImage(spr.frames[0], x - 2, 59, 12, 17);
    } else {
      px(x, 67, 9, 9, lit ? g.color : '#42433d');
      px(x + 2, 61, 5, 8, lit ? '#dbc291' : '#313732');
      px(x + 3, 63, 3, 2, lit ? '#fff0ba' : '#45483e');
    }
    px(x - 1, 77, 11, 3, '#967448');
  }
  px(446, 174, 143, 74, '#181a1b');
  px(450, 178, 135, 63, '#4c3e30');
  for (let row = 0; row < 3; row++) {
    px(455, 181 + row * 19, 125, 17, '#15191a');
    for (let col = 0; col < 12; col++) {
      const i = row * 12 + col,
        c = BLESSING_COMBOS[i],
        earned = HEARTH_CHALLENGES.filter((q) => q.combo === c.id).every((q) => h.completed[q.id]);
      hearthRelic(ctx, 460 + col * 10, 188 + row * 19, i, earned);
    }
    px(450, 198 + row * 19, 135, 2, '#aa8550');
  }
  px(446, 169, 143, 6, '#b08b54');
  px(453, 171, 129, 1, '#e8c07b');
  px(447, 244, 141, 8, '#2d2924');
  const rug = h.layout.rug,
    rc = { plain: '#71513a', garden: '#536347', constellation: '#4c536a', royal: '#6f4650' }[rug];
  poly(
    [
      [208, 273],
      [431, 273],
      [478, 337],
      [163, 337],
    ],
    '#292323'
  );
  poly(
    [
      [212, 277],
      [427, 277],
      [464, 331],
      [177, 331],
    ],
    rc
  );
  poly(
    [
      [220, 281],
      [419, 281],
      [451, 327],
      [190, 327],
    ],
    '#b69561'
  );
  poly(
    [
      [225, 283],
      [414, 283],
      [443, 324],
      [198, 324],
    ],
    rc
  );
  for (let i = 0; i < 17; i++) {
    px(184 + i * 16, 333, 6, 4, '#bda275');
    if (i % 2 === 0) px(224 + i * 11, 285, 3, 3, '#bfa273');
  }
  for (let i = 0; i < 7; i++) {
    const x = 248 + i * 24,
      y = 300 + (i % 2) * 9;
    if (rug === 'garden') {
      px(x, y - 7, 1, 15, '#b7c38f');
      poly(
        [
          [x, y - 2],
          [x - 8, y - 5],
          [x - 5, y + 2],
          [x, y + 3],
        ],
        '#a9bb8a'
      );
      poly(
        [
          [x + 1, y + 3],
          [x + 7, y - 1],
          [x + 6, y + 7],
          [x + 1, y + 8],
        ],
        '#849c78'
      );
    } else if (rug === 'constellation') {
      px(x - 1, y - 5, 3, 11, '#dad2b5');
      px(x - 5, y - 1, 11, 3, '#dad2b5');
      if (i < 6) px(x + 5, y + 1, 15, 1, '#929a9a');
    } else {
      poly(
        [
          [x, y - 6],
          [x + 6, y],
          [x, y + 6],
          [x - 6, y],
        ],
        '#b7a16d'
      );
      px(x - 1, y - 2, 3, 4, rc);
      if (rug === 'royal') {
        px(x - 7, y - 7, 14, 1, '#dab384');
        px(x - 7, y + 7, 14, 1, '#dab384');
      }
    }
  }
  px(24, 293, 96, 9, '#81603c');
  px(27, 303, 90, 3, '#302821');
  px(32, 308, 6, 22, '#8c6b44');
  px(104, 308, 6, 22, '#8c6b44');
  px(31, 280, 82, 12, '#5f6a50');
  px(33, 280, 78, 2, '#b9b18a');
  for (let x = 38; x < 110; x += 10) px(x, 284, 1, 7, '#444b39');
  px(512, 282, 95, 6, '#ac8552');
  px(515, 288, 90, 11, '#55432e');
  px(520, 300, 6, 30, '#8d6b3f');
  px(594, 300, 6, 30, '#8d6b3f');
  px(522, 280, 48, 2, '#ead5a4');
  px(526, 277, 41, 3, '#928168');
  px(530, 271, 30, 6, '#bc9d70');
  px(583, 273, 13, 7, '#544a39');
  px(586, 266, 7, 7, '#aaa27b');
  for (let i = 0; i < 6; i++) {
    const x = 263 + i * 21,
      seals = Object.keys(h.vowSeals[HEARTH_VOWS[i].id] || {}).length;
    px(x, 257, 13, 12, seals ? '#9f814d' : '#514536');
    px(x + 2, 259, 9, 2, seals ? '#ffe1a1' : '#8a7653');
    px(x + 5, 263, 3, 4, seals ? '#c8ad72' : '#312b26');
  }
  if (h.crowns.includes(63)) {
    px(309, 38, 23, 7, '#dbb961');
    for (let i = 0; i < 3; i++) {
      px(311 + i * 8, 31, 3, 9, '#ffde88');
      px(311 + i * 8, 29, 3, 2, '#ffefb8');
    }
  }
  hearthRoomCache = cv;
  return cv;
}
function drawHearthRoom(ctx, t) {
  const h = hearthData();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(hearthBuildRoom(), 0, 0);
  const px = (x, y, w, z, c) => hearthPixel(ctx, x, y, w, z, c),
    weather = h.layout.window;
  for (const x of [63, 495]) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, 72, 83, 76);
    ctx.clip();
    if (weather === 'sunrise') {
      px(x, 72, 83, 38, '#c79861');
      px(x, 110, 83, 38, '#936c54');
      px(x + 12, 97, 17, 15, '#ffe2a0');
    }
    if (weather === 'snow')
      for (let i = 0; i < 27; i++) {
        const xx = x + ((i * 17 + Math.sin(t + i) * 3) % 83),
          y = 74 + ((i * 29 + t * 9) % 73);
        px(xx, y, 2, 2, '#c8d4d1');
      }
    else if (weather === 'rain' || weather === 'night')
      for (let i = 0; i < 32; i++) {
        const xx = x + ((i * 17) % 81),
          y = 73 + ((i * 19 + t * 47) % 74);
        px(xx, y, 1, 4, weather === 'rain' ? '#829d90' : '#6d8390');
      }
    px(x + 40, 72, 4, 76, '#92774f');
    px(x, 111, 83, 4, '#ad8b58');
    ctx.restore();
  }
  for (let y = 135; y < 262; y += 6)
    for (let x = 220; x < 421; x += 6) {
      const d = Math.hypot((x - 320) * 0.65, y - 194),
        a = Math.max(0, 1 - d / 80) * (0.07 + (save.motion ? 0 : Math.sin(t * 4) * 0.015));
      if (a) {
        ctx.fillStyle = 'rgba(255,162,63,' + a + ')';
        ctx.fillRect(x, y, 5, 5);
      }
    }
  hearthFlame(ctx, 321, 209, t, 1.15);
  for (const x of [200, 442]) hearthLantern(ctx, x, 117, h.layout.lights, t);
  for (let i = 0; i < 8 && !save.motion; i++) {
    const u = (t * 0.16 + i * 0.131) % 1;
    px(
      304 + Math.sin(t * 0.7 + i * 2) * 15,
      197 - u * 64,
      1 + (i % 3 === 0),
      2,
      u > 0.85 ? '#6b4931' : '#d59142'
    );
  }
  const p = HEARTH_PALETTES.find((p) => p.id === h.shards),
    u = save.motion ? 0 : t;
  hearthFlame(ctx, 321, 301, u, 0.5);
  for (let i = 0; i < 3; i++) {
    const a = u * 1.4 + (i * TAU) / 3;
    drawHearthShard(ctx, 321 + Math.cos(a) * 18, 286 + Math.sin(a) * 7, p, 1, i);
  }
}
function drawHearthShard(ctx, x, y, p, scale = 1, index = 0) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(scale, scale);
  const px = (a, b, w, h, c) => hearthPixel(ctx, a, b, w, h, c),
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
  } else if (id === 'copper') {
    px(-5, -4, 10, 8, p.color);
    px(-3, -6, 6, 12, p.color);
    px(-7, -2, 14, 4, p.color);
    px(-2, -2, 4, 4, '#382b24');
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
