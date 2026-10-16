const ENV_ART_VERSION = 5;
function envRng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = Math.imul(s ^ (s >>> 15), 1 | s);
    s ^= s + Math.imul(s ^ (s >>> 7), 61 | s);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}
function earlyEnvironmentArt(w, f) {
  if (!w || w.region !== 'hollow' || f < 1 || f > 10) return [];
  if (w._environmentArt?.version === ENV_ART_VERSION && w._environmentArt.floor === f)
    return w._environmentArt.items;
  const sets = [
    ['gateColumn', 'oilCache', 'wardSeal'],
    ['lampPost', 'oilCache', 'watchBench'],
    ['bellShrine', 'watchBench', 'wallRelief'],
    ['bunkStack', 'footlocker', 'watchBench'],
    ['starAltar', 'gateColumn', 'watchBanner'],
    ['rootCluster', 'fernPatch', 'gardenStone'],
    ['glassFrame', 'fernPatch', 'pottingBench'],
    ['dryFountain', 'gardenBench', 'rootCluster'],
    ['seedTable', 'fungalBloom', 'rootCluster'],
    ['flowerTotem', 'rootCluster', 'gardenStone'],
  ];
  const items = [],
    rnd = envRng(Math.imul(f, 2654435761) ^ (w.rooms.length * 7919));
  for (let ri = 0; ri < w.rooms.length; ri++) {
    const r = w.rooms[ri],
      count = ri === 0 ? 2 : 2 + ((ri + f) % 2);
    if (f <= 5 && ri > 0 && r !== w.exit && (ri + f) % 3 === 0) {
      items.push({
        type: 'wardSeal',
        x: (r.cx + 0.5) * TILE,
        y: (r.cy + 0.5) * TILE,
        seed: ri * 17 + f * 101,
        floorPiece: true,
      });
    }
    for (let j = 0; j < count; j++) {
      const side = (ri + j * 3 + f) % 4,
        along = 0.2 + rnd() * 0.6;
      let x, y;
      if (side === 0) {
        x = (r.x + 1.4 + (r.w - 2.8) * along) * TILE;
        y = (r.y + 1.12) * TILE;
      } else if (side === 1) {
        x = (r.x + 1.4 + (r.w - 2.8) * along) * TILE;
        y = (r.y + r.h - 1.12) * TILE;
      } else if (side === 2) {
        x = (r.x + 1.12) * TILE;
        y = (r.y + 1.4 + (r.h - 2.8) * along) * TILE;
      } else {
        x = (r.x + r.w - 1.12) * TILE;
        y = (r.y + 1.4 + (r.h - 2.8) * along) * TILE;
      }
      const type = sets[f - 1][(ri + j + Math.floor(rnd() * 3)) % 3];
      items.push({
        type,
        x: Math.round(x),
        y: Math.round(y),
        seed: ri * 37 + j * 13 + f * 97,
        flip: rnd() < 0.5 ? -1 : 1,
      });
    }
  }
  const fixtures = w.fixtures || [];
  const filtered = items.filter((o) => fixtures.every((p) => d2(o.x, o.y, p.x, p.y) > 62 ** 2));
  if (!w._environmentPropsRefined) {
    const allowed =
      f <= 5
        ? new Set(['pr_banner', 'pr_chain', 'pr_crate', 'pr_rubble', 'pr_pot', 'pr_bones'])
        : new Set(['pr_rubble', 'pr_pot', 'pr_shroom']);
    w.props = (w.props || []).filter(
      (o, i) => allowed.has(o.t) && ((i + f) % 3 !== 0 || o.t === 'pr_rubble')
    );
    w._environmentPropsRefined = true;
  }
  w._environmentArt = { version: ENV_ART_VERSION, floor: f, items: filtered };
  return filtered;
}
function envShadow(ctx, w, h, y = 5, a = 0.32) {
  ctx.fillStyle = `rgba(2,5,8,${a})`;
  ctx.fillRect(-Math.round(w / 2), y, Math.round(w), Math.max(3, Math.round(h)));
  ctx.fillStyle = 'rgba(2,5,8,.16)';
  ctx.fillRect(-Math.round(w * 0.38), y + Math.round(h), Math.round(w * 0.76), 2);
}
function envDiamond(ctx, x, y, r, col) {
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r, y);
  ctx.closePath();
  ctx.fill();
}
function envFurnishingDetail(ctx, o) {
  const px = (x, y, w, h, c) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  };
  const nail = (x, y) => {
    px(x - 1, y - 1, 3, 3, '#101a20');
    px(x, y - 1, 1, 1, '#b9ae87');
    px(x, y, 1, 1, '#69736c');
  };
  const stone = (x, y, w, h) => {
    px(x, y, w, h, '#344741');
    px(x + 1, y, w - 2, 1, '#a4ad93');
    px(x + 2, y + 2, Math.max(2, w - 5), 1, '#647668');
  };
  const leaf = (x, y, direction = 1) => {
    px(x, y, 5, 3, '#3d623f');
    px(x + direction, y - 2, 4, 3, '#8ba666');
    px(x + 2, y - 2, 1, 4, '#b7c18a');
  };
  if (o.type === 'gateColumn') {
    for (const y of [-31, -20, -8, 4]) {
      px(-6, y, 12, 1, '#17232c');
      px(-6, y + 1, 8, 1, '#6e7d7d');
    }
    px(-13, 13, 25, 1, '#84918a');
    px(-11, 17, 7, 1, '#2b373e');
    px(3, -40, 5, 1, '#a4a992');
    px(-9, -15, 3, 7, '#1b2932');
    px(-8, -15, 2, 1, '#8a977f');
  } else if (o.type === 'oilCache' || o.type === 'footlocker') {
    for (const x of [-16, 15]) for (const y of [-6, 8]) nail(x, y);
    px(-9, 2, 5, 1, '#64716a');
    px(6, 6, 7, 1, '#64716a');
    if (o.type === 'oilCache') {
      for (let i = 0; i < 3; i++) {
        const x = -14 + i * 13,
          y = -22 - (i % 2) * 3;
        px(x + 1, y, 5, 2, '#a69971');
        px(x + 1, y + 4, 1, 8, '#a1b5a2');
        px(x + 2, y + 10, 3, 3, '#49534b');
        px(x + 2, y - 2, 3, 2, '#2a322c');
      }
    } else {
      px(-2, 0, 4, 3, '#d5bf83');
      px(-1, 2, 2, 3, '#2b2a26');
      px(-10, -7, 10, 1, '#b0ada0');
    }
  } else if (o.type === 'lampPost') {
    for (const y of [-40, -15, 8]) {
      px(-4, y, 8, 2, '#33464c');
      px(-3, y, 5, 1, '#b6ac82');
    }
    nail(-8, -23);
    nail(8, -23);
    px(-7, -5, 13, 1, '#eddd9f');
    px(-5, -19, 1, 8, '#edf0cc');
    px(6, -17, 1, 6, '#e4ca86');
  } else if (o.type === 'watchBench' || o.type === 'gardenBench') {
    for (const y of [-8, 1]) {
      px(-18, y, 32, 1, '#423c2c');
      px(-16, y + 1, 11, 1, '#af9a66');
      px(2, y + 1, 10, 1, '#af9a66');
    }
    for (const x of [-20, 19]) {
      nail(x, -8);
      nail(x, 2);
    }
    px(-16, -4, 4, 1, '#34392c');
    px(7, -8, 6, 1, '#3a3d2c');
    if (o.type === 'gardenBench') {
      leaf(-27, 4);
      leaf(22, -12, -1);
    }
  } else if (o.type === 'bellShrine') {
    for (const x of [-13, 0, 13]) {
      px(x - 6, -22, 11, 1, '#efce8b');
      px(x - 4, -17, 8, 1, '#806438');
      px(x - 4, -15, 7, 1, '#dfbd75');
      px(x + 2, -21, 2, 7, '#796033');
      px(x - 7, -10, 13, 1, '#e6c588');
    }
    nail(-23, -40);
    nail(23, -40);
    px(-19, -43, 37, 1, '#c2b894');
  } else if (o.type === 'wallRelief' || o.type === 'starAltar') {
    if (o.type === 'wallRelief') {
      for (const x of [-18, 18]) for (const y of [-26, 7]) nail(x, y);
      px(-12, -19, 5, 1, '#506260');
      px(7, -3, 5, 1, '#506260');
      px(-3, -12, 2, 2, '#b4b99a');
      px(3, -8, 2, 2, '#b4b99a');
    } else {
      for (const x of [-25, -12, 12, 25]) {
        px(x, 7, 1, 7, '#293b45');
        px(x - 1, 7, 1, 5, '#a5b1a1');
      }
      px(-29, 15, 57, 1, '#708078');
      px(-14, 4, 27, 1, '#c7ba88');
    }
  } else if (o.type === 'bunkStack') {
    for (const y of [-32, -3]) {
      for (const x of [-11, -3, 5, 13]) {
        px(x, y, 1, 12, '#182c3d');
        px(x + 1, y + 2, 1, 8, '#506b75');
      }
      px(-15, y - 5, 9, 1, '#e4debd');
      px(-14, y - 2, 5, 1, '#8a927e');
    }
    for (const x of [-22, 21]) for (const y of [-40, -11, 13]) nail(x, y);
  } else if (o.type === 'watchBanner') {
    for (const x of [-12, -7, 7, 12]) {
      px(x, -36, 1, 35, x < 0 ? '#965774' : '#402d43');
    }
    for (let y = -36; y < 0; y += 6) {
      px(-15, y, 2, 2, '#c1a172');
      px(13, y + 2, 2, 2, '#9c7b62');
    }
    px(-21, -47, 41, 1, '#d0b986');
    px(-13, 2, 4, 3, '#302636');
    px(8, -1, 3, 5, '#302636');
  } else if (o.type === 'rootCluster' || o.type === 'fernPatch') {
    for (let i = 0; i < 6; i++) {
      const x = -25 + i * 10,
        y = 11 - Math.abs(i - 2) * 5;
      leaf(x, y, i % 2 ? -1 : 1);
      if (o.type === 'rootCluster') px(x + 2, y + 5, 3, 1, '#a7ad7a');
    }
    px(-8, 14, 8, 2, '#1c3021');
    px(4, 15, 11, 1, '#4d633c');
  } else if (o.type === 'gardenStone' || o.type === 'dryFountain') {
    const w = o.type === 'dryFountain' ? 30 : 20;
    for (let i = 0; i < 4; i++) {
      const x = -w + i * w * 0.5;
      px(Math.round(x), 5, 1, 7, '#33493e');
      px(Math.round(x + 2), 5, 6, 1, '#b8bf9f');
    }
    px(-12, -11, 8, 1, '#bec5aa');
    px(7, -8, 7, 1, '#33493e');
    if (o.type === 'dryFountain') {
      for (let i = 0; i < 5; i++) px(-19 + i * 9, i % 2 ? 2 : 0, 5, 1, '#8ead9380');
      px(-14, -28, 27, 1, '#bcc6a9');
      px(3, -22, 1, 15, '#354b3f');
      leaf(-28, -9);
      leaf(24, -12, -1);
    } else {
      leaf(-22, -17);
      leaf(17, -9);
    }
  } else if (o.type === 'glassFrame') {
    for (const x of [-25, 24]) for (const y of [-43, -15, 14]) nail(x, y);
    px(-19, -33, 1, 7, '#d5eadb80');
    px(8, -34, 1, 5, '#e7eee180');
    px(-22, 9, 15, 2, '#577362');
    px(3, 9, 18, 1, '#657c67');
    leaf(-29, 9);
    leaf(-23, 3);
    leaf(23, 13, -1);
  } else if (o.type === 'pottingBench' || o.type === 'seedTable') {
    for (let i = 0; i < 4; i++) {
      const x = -21 + i * 14,
        y = -23 - (i % 2) * 3;
      px(x - 1, y + 2, 12, 2, '#bb9267');
      px(x + 2, y + 5, 1, 5, '#ac7f56');
      px(x + 6, y + 5, 3, 5, '#513d2a');
      px(x + 2, y - 3, 3, 1, '#cad391');
    }
    px(-22, 9, 43, 1, '#9b8556');
    for (const x of [-21, 21]) nail(x, 2);
    px(-18, -8, 13, 1, '#51442c');
    px(6, -8, 12, 1, '#51442c');
  } else if (o.type === 'fungalBloom') {
    for (let i = 0; i < 7; i++) {
      const x = -24 + i * 8,
        h = 9 + ((i * 7) % 18);
      px(x - 3, -h + 8, 9, 1, '#66513f');
      px(x, -h + 10, 1, h - 4, '#9b9d7b');
      px(x - 3, -h + 4, 2, 1, '#fff1c3');
      px(x + 4, -h + 5, 1, 1, '#eadbb2');
    }
  } else if (o.type === 'flowerTotem') {
    for (const y of [-27, -17, -6]) stone(-7, y, 11, 4);
    for (const x of [-12, 10]) px(x, 1, 2, 11, '#60754c');
    px(-15, 13, 29, 1, '#9fac7d');
    leaf(-17, 3);
    leaf(13, 5, -1);
  }
}
const earlyFurnishingSprites = new Map();
function drawEarlyEnvironmentPiece(ctx, o, t) {
  const living = ['rootCluster', 'fernPatch', 'fungalBloom', 'flowerTotem'].includes(o.type);
  if (o.type === 'starAltar' || o.type === 'wardSeal') {
    paintEarlyEnvironmentPiece(ctx, o, t);
    return;
  }
  const phase =
      (o.type === 'fernPatch' || o.type === 'flowerTotem') && !save.motion
        ? Math.floor(t * 1.7 + ((o.seed || 0) % 7)) % 4
        : 0,
    key = o.type + ':' + phase;
  let sprite = earlyFurnishingSprites.get(key);
  if (!sprite || sprite.getContext('2d').isContextLost?.()) {
    sprite = document.createElement('canvas');
    sprite.width = 144;
    sprite.height = 128;
    const c = sprite.getContext('2d');
    c.translate(72, 86);
    if (living) paintGardenBotanical(c, o.type, phase);
    else paintEarlyEnvironmentPiece(c, { ...o, x: 0, y: 0, flip: 1 }, 0);
    earlyFurnishingSprites.set(key, sprite);
  }
  ctx.save();
  ctx.translate(Math.round(o.x), Math.round(o.y));
  ctx.scale(o.flip || 1, 1);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sprite, -72, -86);
  ctx.restore();
  if (o.type === 'fungalBloom')
    glowImg(
      'violet',
      o.x,
      o.y - 10,
      28,
      0.12 + (save.motion ? 0 : 0.04 * Math.sin(t * 2 + o.seed))
    );
}
function paintGardenBotanical(c, type, phase) {
  const sway = [0, 1, 0, -1][phase],
    px = (x, y, w, h, colour) => {
      c.fillStyle = colour;
      c.fillRect(Math.round(x), Math.round(y), w, h);
    },
    shoot = (points, width, shadow, colour, highlight) => {
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1],
          b = points[i],
          length = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]));
        for (let j = 0; j <= length; j++) {
          const x = Math.round(a[0] + ((b[0] - a[0]) * j) / Math.max(1, length)),
            y = Math.round(a[1] + ((b[1] - a[1]) * j) / Math.max(1, length));
          px(x - width / 2, y - width / 2, width, width, shadow);
          px(
            x - width / 2 + 1,
            y - width / 2,
            Math.max(1, width - 2),
            Math.max(1, width - 1),
            colour
          );
          if (highlight) px(x - width / 2 + 1, y - width / 2, 1, Math.max(1, width - 2), highlight);
        }
      }
    },
    leaf = (x, y, dx, dy, size, tone = '#6c8f57') => {
      for (let i = 0; i < size; i++) {
        const xx = x + Math.round(dx * i),
          yy = y + Math.round(dy * i),
          width = i < size * 0.45 ? 3 : i < size - 1 ? 2 : 1;
        px(xx, yy, width, 2, '#314c33');
        px(xx, yy, Math.max(1, width - 1), 1, tone);
      }
    };
  envShadow(c, type === 'rootCluster' ? 70 : 57, 4, 16, 0.25);
  if (type === 'rootCluster') {
    const roots = [
      [
        [-34, 16],
        [-25, 12],
        [-18, 1],
        [-14, -12],
        [-8, -28],
      ],
      [
        [-16, 17],
        [-7, 12],
        [-5, 2],
        [1, -9],
        [3, -29],
      ],
      [
        [10, 18],
        [8, 10],
        [16, 2],
        [18, -14],
        [22, -31],
      ],
      [
        [33, 16],
        [25, 10],
        [28, 0],
        [27, -9],
        [31, -19],
      ],
    ];
    for (let i = 0; i < roots.length; i++) {
      shoot(roots[i], i % 2 ? 6 : 8, '#1f2c21', i % 2 ? '#6c7250' : '#7d8057', '#9a9b70');
      for (let k = 1; k < roots[i].length - 1; k++) {
        const [x, y] = roots[i][k];
        px(x - 2, y + 2, 4, 1, '#3c4930');
        px(x - 2, y + 1, 2, 1, '#a09e72');
      }
      const tip = roots[i][4];
      leaf(tip[0] - 1, tip[1] + 5, -1, -0.5, 7, '#91a36d');
      leaf(tip[0] + 1, tip[1] + 8, 1, -0.65, 8, '#78935b');
      leaf(tip[0], tip[1] + 1, 0.2, -1, 5, '#b0bb82');
    }
    shoot(
      [
        [-10, 14],
        [-18, 7],
        [-26, 5],
      ],
      3,
      '#263b27',
      '#6e8652'
    );
    shoot(
      [
        [22, 12],
        [30, 8],
        [37, 7],
      ],
      3,
      '#263b27',
      '#6e8652'
    );
    leaf(-24, 9, -1, -0.3, 8);
    leaf(25, 7, 1, -0.3, 8, '#8ca569');
    px(-5, -25, 3, 5, '#c7b38b');
    px(-6, -25, 5, 1, '#9c8566');
    px(-6, -20, 5, 1, '#4c4732');
  } else if (type === 'fernPatch') {
    const fronds = [
      [-31, -8],
      [-26, -23],
      [-13, -32],
      [2, -36],
      [17, -29],
      [30, -17],
      [34, -1],
    ];
    for (let i = 0; i < fronds.length; i++) {
      const tx = fronds[i][0] + (i % 2 ? sway : 0),
        ty = fronds[i][1],
        bx = (i - 3) * 2;
      const stem = [];
      for (let k = 0; k <= 8; k++) {
        const u = k / 8;
        stem.push([bx + tx * u * 0.82, 16 + (ty - 16) * u + 5 * Math.sin(u * Math.PI)]);
      }
      shoot(stem, 2, '#304f35', i % 2 ? '#8aa764' : '#73945b');
      for (let k = 2; k < 8; k++) {
        const [x, y] = stem[k],
          size = Math.max(2, 8 - Math.abs(k - 4));
        leaf(x, y, -1, -0.45, size, i % 2 ? '#a0b97b' : '#6e945b');
        leaf(x + 1, y + 2, 1, -0.35, size - 1, '#678d55');
      }
    }
    for (const [x, y] of [
      [-14, 14],
      [3, 15],
      [15, 14],
    ]) {
      px(x, y, 5, 2, '#34452e');
      px(x, y, 3, 1, '#87915f');
    }
  } else if (type === 'fungalBloom') {
    const mushrooms = [
        [-23, 7, 13, 10],
        [-9, 9, 20, 14],
        [9, 8, 16, 12],
        [23, 10, 25, 15],
        [0, 15, 10, 10],
        [-19, 16, 7, 8],
        [22, 17, 8, 9],
      ],
      tones = [
        ['#b37b93', '#d3a8b6', '#714b63'],
        ['#7c956c', '#afba8b', '#485b45'],
        ['#b89472', '#ddbd95', '#765c48'],
      ];
    for (let i = 0; i < mushrooms.length; i++) {
      const [x, base, height, width] = mushrooms[i],
        top = base - height,
        tone = tones[i % 3];
      px(x - 1, top + 5, 4, height - 4, '#858b70');
      px(x - 1, top + 5, 2, height - 5, '#d0cbb0');
      px(x, top + 7, 1, Math.max(1, height - 9), '#e6ddc0');
      for (let row = 0; row < 5; row++) {
        const half = Math.round(width / 2 - Math.max(0, 3 - row) * 1.3);
        px(x - half, top + row, half * 2 + 1, 1, row < 2 ? tone[1] : tone[0]);
      }
      px(x - Math.floor(width / 2), top + 5, width + 1, 2, tone[2]);
      px(x - Math.floor(width / 2) + 2, top + 5, Math.max(2, width - 4), 1, '#c0ab87');
      px(x - 2, top + 1, 2, 1, '#ede2c6');
      px(x + 3, top + 3, 1, 1, '#eadbc1');
    }
  } else {
    px(-17, 0, 34, 18, '#24352a');
    px(-15, 1, 29, 13, '#4e6647');
    px(-13, 1, 4, 11, '#8c9b6a');
    px(-14, 13, 28, 2, '#9ca77c');
    px(-11, -31, 21, 33, '#657b52');
    px(-9, -30, 4, 29, '#a3ae77');
    px(5, -29, 5, 29, '#3a533a');
    for (let y = -26; y < -1; y += 8) {
      px(-7, y, 12, 2, '#3a5438');
      px(-6, y, 9, 1, '#bbc18b');
    }
    const cx = sway,
      cy = -38;
    for (let i = 0; i < 8; i++) {
      const a = (i * TAU) / 8,
        tone = i % 2 ? '#bd879e' : '#d5a5b3';
      for (let d = 5; d < 18; d++) {
        const w = d < 8 ? 3 : d < 14 ? 5 : d < 17 ? 4 : 2,
          x = cx + Math.round(Math.cos(a) * d),
          y = cy + Math.round(Math.sin(a) * d * 0.66);
        px(x - w / 2, y - 2, w, 4, '#744e64');
        px(x - w / 2, y - 2, Math.max(1, w - 1), 2, tone);
      }
    }
    envDiamond(c, cx, cy, 7, '#ead6a8');
    envDiamond(c, cx + 1, cy + 1, 4, '#8a7350');
    px(cx - 2, cy - 3, 3, 2, '#fff0c2');
    leaf(-14, 1, -1, -0.4, 9, '#839b62');
    leaf(11, 5, 1, -0.5, 9, '#9cb477');
  }
}
function envCraftFinish(c, type) {
  const px = (x, y, w, h, colour) => {
      c.fillStyle = colour;
      c.fillRect(x, y, w, h);
    },
    pin = (x, y) => {
      px(x - 1, y - 1, 3, 3, '#1d282a');
      px(x, y - 1, 1, 1, '#c2b78f');
      px(x, y, 1, 1, '#6e756b');
    },
    grain = (x, y, w) => {
      px(x, y, w, 1, '#493d2d');
      px(x + 2, y + 1, Math.max(2, w - 6), 1, '#9a8559');
    },
    leaf = (x, y, dx, dy, colour = '#86a568') => {
      for (let i = 0; i < 5; i++) {
        px(x + dx * i, y + dy * i, i < 3 ? 3 : 2, 2, '#314c35');
        px(x + dx * i, y + dy * i, i < 3 ? 2 : 1, 1, colour);
      }
    };
  if (type === 'gateColumn') {
    px(-4, -34, 8, 33, '#1d2d38');
    px(-4, -34, 1, 32, '#7b8987');
    px(2, -32, 2, 29, '#344752');
    for (const y of [-29, -17, -5]) {
      px(-3, y, 6, 2, '#526662');
      px(-3, y, 5, 1, '#8d988a');
    }
    px(-12, 7, 24, 2, '#7a8982');
    px(-13, 10, 26, 1, '#263a42');
    px(-9, 16, 8, 1, '#8d998b');
    px(7, 12, 6, 3, '#24353c');
    px(5, -41, 5, 2, '#94a18f');
    px(-11, -43, 7, 2, '#71857c');
  } else if (type === 'oilCache') {
    for (const y of [-2, 5, 11]) grain(-19, y, 36);
    for (const x of [-20, 17]) {
      px(x, -5, 3, 17, '#34291e');
      px(x, -5, 1, 15, '#b49561');
      pin(x + 1, -3);
      pin(x + 1, 9);
    }
    for (let i = 0; i < 3; i++) {
      const x = -14 + i * 13,
        top = -23 - (i % 2) * 3;
      px(x, top + 4, 7, 12, '#293b36');
      px(x + 1, top + 5, 5, 8, '#5e7162');
      px(x + 1, top + 9, 5, 5, '#8a8759');
      px(x + 2, top + 5, 1, 9, '#b9c7a7');
      px(x + 1, top - 2, 5, 3, '#b39b66');
      px(x + 2, top - 2, 2, 1, '#dfca91');
      px(x + 2, top + 8, 3, 3, '#d0bd8c');
      px(x + 3, top + 9, 1, 1, '#6e674b');
    }
  } else if (type === 'lampPost') {
    px(-16, -60, 32, 3, '#1b252b');
    px(-12, -63, 24, 3, '#5c706d');
    px(-8, -65, 16, 2, '#8c997f');
    px(-3, -67, 6, 2, '#b6ab7a');
    px(-15, -47, 30, 3, '#8e825c');
    px(-12, -46, 24, 1, '#d4bc80');
    for (const x of [-9, 8]) {
      px(x, -56, 1, 11, '#667768');
      px(x + 1, -56, 1, 10, '#b4bc94');
    }
    px(-2, -55, 3, 9, '#ffc16a');
    px(-1, -53, 2, 6, '#fff0bd');
    px(-1, -48, 3, 2, '#a37c45');
    for (const y of [-31, -14, 8]) {
      px(-5, y, 10, 3, '#293b40');
      px(-4, y, 8, 1, '#ac9b6d');
    }
    px(-10, 13, 20, 2, '#c7ac75');
    pin(-7, 15);
    pin(6, 15);
  } else if (type === 'watchBench' || type === 'gardenBench') {
    for (const y of [-9, 0]) {
      grain(-21, y, 41);
      px(-7, y, 1, 3, '#3e382d');
      px(12, y + 1, 1, 2, '#473c2d');
    }
    for (const x of [-25, 22]) {
      px(x, -9, 3, 12, '#283333');
      px(x, -12, 6, 3, '#80714d');
      px(x, -12, 5, 1, '#b7a073');
      pin(x + 1, -8);
    }
    px(-20, 8, 39, 2, '#303a30');
    px(-18, 8, 2, 9, '#77806a');
    px(16, 8, 2, 9, '#77806a');
    if (type === 'gardenBench') {
      leaf(-25, -7, -1, -1);
      leaf(-27, 1, 1, -1, '#a3b97b');
      leaf(24, -11, 1, -1);
      leaf(25, -4, -1, -1);
    }
  } else if (type === 'bellShrine') {
    for (const x of [-13, 0, 13]) {
      c.clearRect(x - 9, -24, 18, 16);
      px(x - 2, -26, 4, 3, '#5b4a2e');
      for (let row = 0; row < 14; row++) {
        const half = row < 4 ? 3 : row < 10 ? 4 : row < 12 ? 6 : 8;
        px(x - half, -23 + row, half * 2, 1, '#90713f');
        px(x - half + 1, -23 + row, 2, 1, '#dbc185');
        px(x + half - 2, -23 + row, 2, 1, '#54472d');
      }
      px(x - 9, -10, 18, 2, '#443a29');
      px(x - 8, -10, 16, 1, '#ead297');
      px(x - 5, -8, 10, 1, '#8b7244');
      px(x - 1, -7, 2, 4, '#b99c61');
      px(x - 2, -4, 4, 2, '#dcc58b');
    }
    for (const x of [-24, 22]) for (const y of [-38, -14, 12]) pin(x, y);
    px(-19, -35, 37, 1, '#9e8858');
    px(-21, 14, 42, 2, '#26383e');
  } else if (type === 'wallRelief') {
    px(-18, -26, 36, 1, '#a7b2a0');
    px(-19, -25, 1, 31, '#71847b');
    px(18, -25, 1, 31, '#1c3039');
    px(-17, 6, 34, 1, '#192e39');
    for (const [x, y] of [
      [-13, -21],
      [11, -21],
      [-13, -1],
      [11, -1],
    ]) {
      px(x, y, 2, 2, '#809086');
      px(x, y, 1, 1, '#c2c8ad');
    }
    for (let i = 0; i < 8; i++) {
      const a = (i * TAU) / 8;
      px(Math.round(Math.cos(a) * 12), -10 + Math.round(Math.sin(a) * 10), 2, 2, '#7e8f7c');
    }
    px(-4, -20, 2, 3, '#b1b38d');
    px(3, -4, 2, 3, '#475b55');
  } else if (type === 'bunkStack') {
    for (const y of [-38, -9]) {
      px(-16, y, 11, 5, '#dedbc0');
      px(-15, y + 1, 8, 1, '#f2e9c9');
      px(-15, y + 4, 9, 1, '#9da18a');
      px(-3, y + 5, 17, 14, '#2c455a');
      px(-2, y + 6, 2, 11, '#68848b');
      px(4, y + 7, 1, 10, '#1b3247');
      px(9, y + 8, 2, 10, '#506d78');
      px(0, y + 17, 14, 1, '#7a8b89');
      for (let x = -1; x < 14; x += 3) px(x, y + 17, 1, 1, '#b4bda3');
    }
    px(18, -38, 3, 52, '#9a8258');
    px(26, -33, 3, 48, '#6c6147');
    for (let y = -29; y < 14; y += 11) {
      px(20, y, 8, 2, '#bda773');
      px(21, y + 2, 6, 1, '#3e443a');
    }
    pin(20, -37);
    pin(27, 13);
  } else if (type === 'footlocker') {
    px(-18, -11, 35, 2, '#8d9b96');
    px(-17, -9, 33, 1, '#334951');
    for (const x of [-16, 13]) {
      px(x, -10, 3, 20, '#839085');
      px(x + 1, -9, 1, 18, '#b9b99b');
      pin(x + 1, -7);
      pin(x + 1, 7);
    }
    px(-10, 0, 6, 1, '#89998b');
    px(7, 4, 6, 1, '#71857b');
    px(-3, -1, 6, 5, '#d2b57b');
    px(-1, 0, 2, 3, '#3a3d33');
    px(-17, 11, 5, 3, '#15252b');
    px(12, 11, 5, 3, '#15252b');
  } else if (type === 'starAltar') {
    px(-29, 3, 57, 2, '#718580');
    px(-27, 5, 53, 1, '#303f49');
    for (const x of [-21, -8, 8, 21]) {
      px(x, 8, 1, 6, '#233541');
      px(x + 1, 8, 1, 5, '#82988d');
    }
    for (let x = -14; x < 15; x += 7) {
      px(x, 6, 3, 1, '#b4a57a');
      px(x + 1, 7, 1, 2, '#687f76');
    }
    px(-21, -3, 42, 1, '#d1c08e');
    px(-30, 16, 60, 2, '#293b43');
  } else if (type === 'watchBanner') {
    for (const x of [-15, 13]) {
      px(x, -37, 2, 36, '#9b765e');
      for (let y = -36; y < -1; y += 4) px(x, y, 1, 1, '#e5c48d');
    }
    px(-10, -35, 1, 28, '#946178');
    px(7, -34, 2, 30, '#42283c');
    px(-8, -2, 15, 2, '#ae8968');
    for (const [x, y, h] of [
      [-12, 3, 5],
      [-5, 4, 3],
      [5, 1, 5],
      [12, -1, 6],
    ]) {
      px(x, y, 1, h, '#c39979');
    }
    pin(-21, -47);
    pin(20, -47);
  } else if (type === 'gardenStone') {
    c.clearRect(-23, -14, 4, 3);
    c.clearRect(20, -14, 3, 5);
    px(-20, -12, 3, 1, '#b5bca0');
    px(17, -9, 4, 2, '#a3b29a');
    px(-19, -5, 36, 1, '#7f9381');
    px(-16, 1, 28, 1, '#9da78f');
    px(-7, -16, 1, 6, '#4c6351');
    px(-6, -11, 3, 1, '#4c6351');
    px(-3, -10, 1, 5, '#4c6351');
    px(10, -13, 5, 2, '#c0c7ad');
    for (const [x, y] of [
      [-23, -11],
      [18, -4],
      [15, -12],
    ]) {
      leaf(x, y, x < 0 ? -1 : 1, -1);
      leaf(x + 1, y + 3, x < 0 ? 1 : -1, -1, '#a9b97e');
    }
    px(-17, 9, 12, 1, '#243b2d');
    px(8, 11, 10, 1, '#2e4634');
  } else if (type === 'glassFrame') {
    for (const x of [-26, 25])
      for (const y of [-39, -18, 10]) {
        px(x, y, 3, 5, '#6b7256');
        pin(x + 1, y + 1);
      }
    px(-20, -39, 1, 17, '#c8e2cf');
    px(-19, -39, 2, 1, '#f1f0d7');
    px(19, -36, 1, 12, '#a1bfb0');
    px(-2, -11, 4, 14, '#415d53');
    px(-1, -8, 5, 7, '#b0a67a');
    px(1, -6, 1, 3, '#4d5e4b');
    px(-28, 8, 9, 4, '#445d3f');
    leaf(-25, 6, -1, -1);
    leaf(-24, -1, 1, -1, '#9bb576');
    leaf(23, 12, 1, -1);
    leaf(25, 5, -1, -1, '#a4b878');
    px(-21, 13, 16, 2, '#a5bba0');
    px(8, 15, 12, 1, '#7c9480');
  } else if (type === 'pottingBench' || type === 'seedTable') {
    grain(-25, -9, 49);
    grain(-20, 8, 40);
    px(-24, -1, 3, 17, '#967f51');
    px(21, -1, 2, 17, '#b09b64');
    for (const x of [-21, 20]) {
      pin(x, 0);
      pin(x, 12);
    }
    for (let i = 0; i < 4; i++) {
      const x = -21 + i * 14,
        top = -24 - (i % 2) * 3;
      c.clearRect(x - 1, top - 11, 13, 13);
      px(x, top, 11, 2, '#453528');
      px(x + 1, top, 9, 1, '#cfab7d');
      px(x + 1, top + 2, 9, 8 + (i % 2) * 2, '#9b7150');
      px(x + 2, top + 3, 2, 6 + (i % 2) * 2, '#bf9163');
      px(x + 8, top + 2, 2, 7 + (i % 2) * 2, '#594332');
      px(x + 2, top + 9 + (i % 2) * 2, 7, 1, '#584432');
      px(x + 4, top - 8, 2, 8, '#54734b');
      leaf(x + 4, top - 5, -1, -1, '#99b77b');
      leaf(x + 5, top - 7, 1, -1, '#75985e');
      if (i === 1 || type === 'seedTable') leaf(x + 3, top - 1, -1, -1, '#b0bd80');
    }
    if (type === 'pottingBench') {
      px(-11, 4, 19, 4, '#3b3526');
      px(-10, 4, 17, 1, '#b3a275');
      px(9, -12, 10, 1, '#353a29');
      px(17, -14, 4, 4, '#a1aaa0');
    } else {
      px(-15, 3, 12, 4, '#b7a370');
      px(-14, 4, 9, 2, '#dbca8e');
      px(2, 2, 14, 5, '#988357');
      px(3, 2, 11, 1, '#d4bf87');
    }
  } else if (type === 'dryFountain') {
    c.clearRect(-40, -33, 80, 52);
    px(-35, 8, 70, 11, '#2b3d36');
    px(-31, 15, 62, 4, '#526e5c');
    px(-38, 1, 76, 10, '#526b5b');
    px(-35, -3, 70, 8, '#879783');
    px(-28, -6, 56, 3, '#b2bca3');
    px(-32, -3, 64, 2, '#a1b095');
    px(-29, -1, 58, 8, '#233e36');
    px(-24, 1, 48, 4, '#354f42');
    px(-28, 5, 56, 3, '#83967e');
    px(-32, 4, 4, 3, '#a4b395');
    px(28, 2, 5, 5, '#526e57');
    px(-28, 8, 56, 1, '#bec3a4');
    for (const x of [-25, -11, 6, 23]) {
      px(x, 9, 1, 8, '#334d3d');
      px(x + 1, 10, 1, 6, '#92a185');
    }
    px(-8, -24, 16, 27, '#526c59');
    px(-6, -23, 4, 24, '#98a58b');
    px(4, -21, 3, 22, '#304c3b');
    px(-4, -15, 8, 1, '#3a5642');
    px(-19, -28, 38, 4, '#526957');
    px(-16, -31, 32, 3, '#9da991');
    px(-12, -29, 24, 2, '#324c3e');
    px(-17, -25, 34, 1, '#bdc4a6');
    px(-14, -24, 28, 2, '#738d74');
    px(-22, 2, 1, 7, '#344b3a');
    px(-21, 7, 4, 1, '#344b3a');
    px(-18, 8, 1, 5, '#344b3a');
    for (const [x, y, side] of [
      [-31, 1, -1],
      [29, -1, 1],
      [-26, -6, -1],
    ]) {
      leaf(x, y, side, -1);
      leaf(x + side * 3, y + 4, -side, -1, '#a2b17a');
    }
  }
}
function paintEarlyEnvironmentPiece(ctx, o, t) {
  const bob = save.motion ? 0 : Math.sin(t * 1.3 + o.seed) * 1.2,
    flip = o.flip || 1;
  ctx.save();
  ctx.translate(Math.round(o.x), Math.round(o.y));
  ctx.scale(flip, 1);
  ctx.imageSmoothingEnabled = false;
  if (o.type === 'wardSeal') {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#07101b';
    ctx.fillRect(-29, -18, 58, 36);
    ctx.strokeStyle = '#60758b';
    ctx.lineWidth = 2;
    ctx.strokeRect(-25, -14, 50, 28);
    ctx.strokeStyle = '#b49d68';
    ctx.strokeRect(-18, -10, 36, 20);
    envDiamond(ctx, 0, 0, 8, '#263b52');
    envDiamond(ctx, 0, 0, 4, '#d8bd79');
    ctx.fillStyle = '#9c8a5d';
    for (let i = -1; i <= 1; i++) {
      ctx.fillRect(-24, i * 7, 5, 2);
      ctx.fillRect(19, i * 7, 5, 2);
    }
    ctx.globalAlpha = 1;
  } else if (o.type === 'gateColumn') {
    envShadow(ctx, 38, 7, 18);
    ctx.fillStyle = '#111924';
    ctx.fillRect(-17, 12, 34, 10);
    ctx.fillStyle = '#3d4d58';
    ctx.fillRect(-15, 7, 30, 11);
    ctx.fillStyle = '#263641';
    ctx.fillRect(-10, -38, 20, 46);
    ctx.fillStyle = '#60717a';
    ctx.fillRect(-8, -36, 3, 41);
    ctx.fillStyle = '#15222d';
    ctx.fillRect(5, -36, 5, 42);
    ctx.fillStyle = '#17232d';
    ctx.fillRect(-13, -43, 26, 7);
    ctx.fillStyle = '#53636b';
    ctx.fillRect(-10, -46, 9, 4);
    ctx.fillRect(3, -44, 8, 3);
    ctx.fillStyle = '#8a7a52';
    ctx.fillRect(-8, -17, 16, 3);
    ctx.fillRect(-2, -29, 4, 3);
    ctx.fillStyle = '#111c26';
    ctx.fillRect(-7, -5, 6, 2);
    ctx.fillRect(1, -25, 7, 2);
    ctx.fillRect(-4, -23, 2, 7);
  } else if (o.type === 'oilCache') {
    envShadow(ctx, 50, 6, 15);
    ctx.fillStyle = '#15100b';
    ctx.fillRect(-24, -4, 48, 21);
    ctx.fillStyle = '#5e482e';
    ctx.fillRect(-22, -7, 44, 21);
    ctx.fillStyle = '#9c7a45';
    ctx.fillRect(-19, -4, 38, 3);
    ctx.fillRect(-2, -6, 4, 19);
    ctx.fillStyle = '#271a12';
    ctx.fillRect(-17, 2, 30, 2);
    for (let i = 0; i < 3; i++) {
      const x = -14 + i * 13;
      ctx.fillStyle = '#18252a';
      ctx.fillRect(x, -22 - (i % 2) * 3, 7, 17 + (i % 2) * 3);
      ctx.fillStyle = '#7e8f83';
      ctx.fillRect(x + 1, -20 - (i % 2) * 3, 3, 11);
      ctx.fillStyle = '#ba9a5b';
      ctx.fillRect(x + 1, -26 - (i % 2) * 3, 4, 5);
      ctx.fillStyle = '#d9cb94';
      ctx.fillRect(x + 2, -18 - (i % 2) * 3, 1, 5);
    }
  } else if (o.type === 'lampPost') {
    envShadow(ctx, 33, 5, 16);
    ctx.fillStyle = '#111823';
    ctx.fillRect(-5, -39, 10, 57);
    ctx.fillStyle = '#586b70';
    ctx.fillRect(-2, -37, 4, 52);
    ctx.fillStyle = '#a18c58';
    ctx.fillRect(-11, 11, 22, 7);
    ctx.fillRect(-8, -44, 16, 6);
    ctx.strokeStyle = '#667982';
    ctx.lineWidth = 3;
    ctx.strokeRect(-15, -59, 30, 16);
    ctx.fillStyle = '#d7b66e55';
    ctx.fillRect(-12, -56, 24, 10);
    ctx.fillStyle = '#fff0b4';
    ctx.fillRect(-3, -53, 6, 7);
    ctx.fillStyle = '#c7d5ca';
    ctx.fillRect(-10, -55, 2, 8);
  } else if (o.type === 'watchBench' || o.type === 'gardenBench') {
    envShadow(ctx, 58, 6, 12);
    const garden = o.type === 'gardenBench';
    ctx.fillStyle = garden ? '#253522' : '#19212a';
    ctx.fillRect(-28, -8, 56, 7);
    ctx.fillRect(-25, 2, 50, 8);
    ctx.fillStyle = garden ? '#735f3d' : '#5f5747';
    ctx.fillRect(-25, -11, 50, 6);
    ctx.fillRect(-22, -1, 44, 6);
    ctx.fillStyle = garden ? '#a18b59' : '#91846a';
    ctx.fillRect(-22, -10, 39, 2);
    ctx.fillStyle = '#1a2022';
    ctx.fillRect(-20, 6, 5, 13);
    ctx.fillRect(15, 6, 5, 13);
    if (garden) {
      ctx.fillStyle = '#63824f';
      ctx.fillRect(-28, -15, 4, 8);
      ctx.fillRect(23, -19, 4, 12);
      ctx.fillStyle = '#9daf6f';
      ctx.fillRect(-31, -18, 7, 4);
      ctx.fillRect(22, -22, 8, 5);
    }
  } else if (o.type === 'bellShrine') {
    envShadow(ctx, 55, 7, 17);
    ctx.fillStyle = '#1b2630';
    ctx.fillRect(-27, -43, 6, 61);
    ctx.fillRect(21, -43, 6, 61);
    ctx.fillRect(-27, -46, 54, 7);
    ctx.fillStyle = '#778990';
    ctx.fillRect(-23, -42, 3, 54);
    ctx.fillStyle = '#8c7647';
    ctx.fillRect(-18, -38, 36, 5);
    for (let i = -1; i <= 1; i++) {
      const x = i * 13;
      ctx.fillStyle = '#3b2d1c';
      ctx.fillRect(x - 1, -34, 3, 12);
      ctx.fillStyle = '#9e8450';
      ctx.fillRect(x - 7, -24, 14, 13);
      ctx.fillStyle = '#d1b573';
      ctx.fillRect(x - 5, -24, 5, 9);
      ctx.fillStyle = '#5d492c';
      ctx.fillRect(x - 9, -12, 18, 4);
      ctx.fillStyle = '#d9c58e';
      ctx.fillRect(x - 1, -9, 3, 7);
    }
  } else if (o.type === 'wallRelief') {
    envShadow(ctx, 43, 5, 11);
    ctx.fillStyle = '#15202a';
    ctx.fillRect(-23, -31, 46, 43);
    ctx.fillStyle = '#586a72';
    ctx.fillRect(-20, -28, 40, 37);
    ctx.fillStyle = '#293945';
    ctx.fillRect(-16, -24, 32, 29);
    ctx.strokeStyle = '#9aa59c';
    ctx.lineWidth = 2;
    ctx.strokeRect(-16, -24, 32, 29);
    envDiamond(ctx, 0, -10, 10, '#6f7d78');
    envDiamond(ctx, 0, -10, 5, '#222f3a');
    ctx.fillStyle = '#b9a46e';
    ctx.fillRect(-13, 1, 26, 3);
    ctx.fillRect(-2, -22, 4, 5);
  } else if (o.type === 'bunkStack') {
    envShadow(ctx, 48, 7, 16);
    ctx.fillStyle = '#283743';
    ctx.fillRect(-24, -42, 5, 59);
    ctx.fillRect(19, -42, 5, 59);
    ctx.fillRect(-24, -43, 48, 5);
    ctx.fillRect(-24, -14, 48, 5);
    ctx.fillStyle = '#667379';
    ctx.fillRect(-19, -39, 38, 22);
    ctx.fillRect(-19, -10, 38, 22);
    ctx.fillStyle = '#273d54';
    ctx.fillRect(-15, -33, 31, 15);
    ctx.fillRect(-15, -4, 31, 15);
    ctx.fillStyle = '#b8b5a4';
    ctx.fillRect(-17, -38, 13, 7);
    ctx.fillRect(-17, -9, 13, 7);
    ctx.fillStyle = '#8c7652';
    ctx.fillRect(18, -43, 3, 60);
  } else if (o.type === 'footlocker') {
    envShadow(ctx, 46, 6, 13);
    ctx.fillStyle = '#151b21';
    ctx.fillRect(-23, -10, 46, 24);
    ctx.fillStyle = '#455660';
    ctx.fillRect(-21, -12, 42, 23);
    ctx.fillStyle = '#718187';
    ctx.fillRect(-18, -9, 36, 4);
    ctx.fillStyle = '#242f38';
    ctx.fillRect(-17, -3, 34, 12);
    ctx.fillStyle = '#b09a63';
    ctx.fillRect(-3, -2, 6, 8);
    ctx.fillStyle = '#182027';
    ctx.fillRect(-20, 9, 40, 4);
    ctx.fillRect(-15, -7, 3, 15);
    ctx.fillRect(12, -7, 3, 15);
  } else if (o.type === 'starAltar') {
    envShadow(ctx, 70, 8, 18);
    ctx.fillStyle = '#111924';
    ctx.fillRect(-34, 9, 68, 13);
    ctx.fillStyle = '#52616b';
    ctx.fillRect(-30, 2, 60, 14);
    ctx.fillStyle = '#89938c';
    ctx.fillRect(-25, -4, 50, 12);
    ctx.fillStyle = '#263745';
    ctx.fillRect(-20, -8, 40, 8);
    ctx.strokeStyle = '#b9a065';
    ctx.lineWidth = 2;
    ctx.strokeRect(-18, -6, 36, 7);
    for (let i = 0; i < 8; i++) {
      const a = (i * TAU) / 8 + t * 0.08;
      ctx.fillStyle = i % 2 ? '#7c6b4c' : '#d6bc76';
      ctx.fillRect(Math.round(Math.cos(a) * 13) - 1, -18 + Math.round(Math.sin(a) * 5), 3, 3);
    }
    envDiamond(ctx, 0, -19 + bob, 6, '#fff0bd');
  } else if (o.type === 'watchBanner') {
    envShadow(ctx, 39, 5, 14);
    ctx.fillStyle = '#1a2029';
    ctx.fillRect(-22, -46, 44, 5);
    ctx.fillStyle = '#9a8252';
    ctx.fillRect(-25, -49, 50, 4);
    ctx.fillStyle = '#4b2e45';
    ctx.fillRect(-18, -41, 36, 49);
    ctx.fillStyle = '#6d3b59';
    ctx.fillRect(-14, -38, 28, 40);
    ctx.fillStyle = '#bca366';
    ctx.fillRect(-2, -34, 4, 25);
    ctx.fillRect(-10, -23, 20, 4);
    envDiamond(ctx, 0, -8, 5, '#d7c58c');
    ctx.fillStyle = '#171d26';
    ctx.fillRect(-18, 8, 12, 5);
    ctx.fillRect(6, 8, 12, 5);
  } else if (o.type === 'gardenStone') {
    envShadow(ctx, 54, 7, 13);
    ctx.fillStyle = '#27342d';
    ctx.fillRect(-27, 3, 54, 13);
    ctx.fillStyle = '#68766b';
    ctx.fillRect(-23, -14, 46, 21);
    ctx.fillStyle = '#9aa294';
    ctx.fillRect(-18, -18, 36, 8);
    ctx.fillStyle = '#3e5540';
    ctx.fillRect(-20, -4, 11, 3);
    ctx.fillRect(7, -11, 9, 3);
    ctx.fillStyle = '#8fa66a';
    ctx.fillRect(-24, -21, 6, 9);
    ctx.fillRect(17, -17, 7, 8);
    ctx.fillStyle = '#b5bf88';
    ctx.fillRect(-22, -24, 4, 5);
  } else if (o.type === 'glassFrame') {
    envShadow(ctx, 60, 5, 16);
    ctx.fillStyle = '#293a38';
    ctx.fillRect(-29, -45, 5, 63);
    ctx.fillRect(24, -45, 5, 63);
    ctx.fillRect(-29, -48, 58, 6);
    ctx.fillStyle = '#7b9d91';
    ctx.fillRect(-25, -43, 49, 3);
    ctx.fillRect(-2, -43, 4, 56);
    ctx.fillRect(-25, -16, 49, 4);
    ctx.fillStyle = '#99d4c524';
    ctx.fillRect(-22, -39, 18, 20);
    ctx.fillRect(4, -39, 17, 20);
    ctx.fillStyle = '#cce8dc77';
    ctx.beginPath();
    ctx.moveTo(5, -38);
    ctx.lineTo(19, -38);
    ctx.lineTo(5, -23);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#d4eee166';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-20, -36);
    ctx.lineTo(-8, -19);
    ctx.lineTo(-18, -21);
    ctx.stroke();
    ctx.fillStyle = '#567750';
    ctx.fillRect(-30, 4, 10, 12);
  } else if (o.type === 'pottingBench' || o.type === 'seedTable') {
    envShadow(ctx, 65, 6, 14);
    ctx.fillStyle = '#2a2519';
    ctx.fillRect(-31, -10, 62, 9);
    ctx.fillStyle = '#7a6640';
    ctx.fillRect(-29, -13, 58, 8);
    ctx.fillStyle = '#a08b5a';
    ctx.fillRect(-25, -12, 42, 2);
    ctx.fillStyle = '#4c422c';
    ctx.fillRect(-25, -2, 6, 20);
    ctx.fillRect(19, -2, 6, 20);
    ctx.fillRect(-25, 7, 50, 5);
    for (let i = 0; i < 4; i++) {
      const x = -21 + i * 14;
      ctx.fillStyle = i % 2 ? '#6c5140' : '#9a6e4d';
      ctx.fillRect(x, -23 - (i % 2) * 3, 10, 11 + (i % 2) * 3);
      ctx.fillStyle = '#293b28';
      ctx.fillRect(x + 2, -28 - (i % 2) * 3, 6, 6);
      ctx.fillStyle = '#8fac6d';
      ctx.fillRect(x, -31 - (i % 2) * 3, 5, 4);
      ctx.fillRect(x + 6, -32 - (i % 2) * 3, 5, 4);
    }
    if (o.type === 'seedTable') {
      ctx.fillStyle = '#d5c98b';
      for (let i = 0; i < 5; i++) ctx.fillRect(-18 + i * 8, -7 + (i % 2), 3, 2);
    }
  } else if (o.type === 'dryFountain') {
    envShadow(ctx, 78, 7, 17, 0.25);
    ctx.fillStyle = '#24322e';
    ctx.fillRect(-39, 4, 78, 15);
    ctx.fillStyle = '#65756d';
    ctx.fillRect(-35, -2, 70, 15);
    ctx.fillStyle = '#9ba49a';
    ctx.fillRect(-30, -7, 60, 9);
    ctx.fillStyle = '#263f38';
    ctx.fillRect(-25, -4, 50, 10);
    ctx.fillStyle = '#6d7e72';
    ctx.fillRect(-7, -27, 14, 25);
    ctx.fillRect(-17, -30, 34, 6);
    ctx.fillStyle = '#9cac9d';
    ctx.fillRect(-4, -25, 5, 20);
    ctx.fillStyle = '#46634a';
    ctx.fillRect(-29, -8, 7, 9);
    ctx.fillRect(22, -10, 8, 11);
    ctx.fillStyle = '#89a46d';
    ctx.fillRect(-31, -13, 10, 5);
    ctx.fillRect(21, -15, 11, 5);
  }
  envFurnishingDetail(ctx, o);
  envCraftFinish(ctx, o.type);
  ctx.restore();
}
function drawEarlyEnvironmentArt(ctx) {
  const w = G.world;
  if (!w || w.region !== 'hollow' || G.floor > 10) return;
  const t = save.motion ? 0 : G.tAll;
  for (const o of earlyEnvironmentArt(w, G.floor)) {
    if (
      o.x < G.cam.x - 100 ||
      o.x > G.cam.x + G.w + 100 ||
      o.y < G.cam.y - 100 ||
      o.y > G.cam.y + G.h + 100
    )
      continue;
    drawEarlyEnvironmentPiece(ctx, o, t);
  }
}

drawTorches = function (ctx) {
  const w = G.world,
    cam = G.cam,
    t = save.motion ? 0 : G.tAll,
    garden = w.region === 'hollow' && G.floor >= 6;
  for (const o of w.torches || []) {
    if (o.x < cam.x - 80 || o.x > cam.x + G.w + 80 || o.y < cam.y - 90 || o.y > cam.y + G.h + 90)
      continue;
    const flick = 0.92 + Math.sin(t * 12 + o.s) * 0.06 + Math.sin(t * 21 + o.s * 2) * 0.025,
      x = Math.round(o.x),
      y = Math.round(o.y),
      glass = garden ? '#8fc3a4' : '#c2c8bd',
      metal = garden ? '#31443a' : '#394854',
      bright = garden ? '#d8e49b' : '#ffe1a0';
    glowImg(garden ? 'teal' : 'ember', x, y - 10, (garden ? 48 : 45) * flick, 0.48);
    ctx.save();
    ctx.translate(x, y);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#070b0e99';
    ctx.fillRect(-15, -28, 32, 42);
    ctx.fillStyle = '#182129';
    ctx.fillRect(-4, -37, 8, 12);
    ctx.fillStyle = metal;
    ctx.fillRect(-2, -37, 4, 11);
    ctx.fillRect(-13, -29, 26, 4);
    ctx.fillRect(-16, -25, 5, 32);
    ctx.fillRect(11, -25, 5, 32);
    ctx.fillRect(-13, 7, 26, 6);
    ctx.fillStyle = '#8c9b91';
    ctx.fillRect(-10, -27, 17, 2);
    ctx.fillRect(-13, -23, 3, 27);
    ctx.fillStyle = glass + '42';
    ctx.fillRect(-10, -23, 20, 28);
    ctx.fillStyle = glass + '80';
    ctx.fillRect(-8, -21, 3, 22);
    ctx.fillStyle = '#0b1114';
    ctx.fillRect(-2, -24, 4, 31);
    ctx.fillRect(-11, -6, 22, 3);
    ctx.fillStyle = '#c47b36';
    ctx.fillRect(-6, 0, 12, 5);
    ctx.fillStyle = '#ff9b45';
    ctx.fillRect(-5, -8, 10, 11);
    ctx.fillStyle = '#ffd479';
    ctx.fillRect(-3, -13 - Math.round((flick - 0.9) * 20), 7, 14);
    ctx.fillStyle = bright;
    ctx.fillRect(-1, -9, 3, 8);
    ctx.fillStyle = '#fff6cd';
    ctx.fillRect(0, -7, 2, 5);
    ctx.fillStyle = '#a6935f';
    ctx.fillRect(-17, 11, 34, 4);
    ctx.fillStyle = '#202b32';
    ctx.fillRect(-12, 15, 24, 4);
    ctx.fillRect(-7, 19, 14, 3);
    if (garden) {
      ctx.fillStyle = '#567550';
      ctx.fillRect(-18, -20, 4, 31);
      ctx.fillRect(14, -14, 4, 27);
      ctx.fillStyle = '#91a86c';
      ctx.fillRect(-22, -16, 9, 4);
      ctx.fillRect(13, -5, 10, 4);
      ctx.fillRect(-19, 2, 8, 4);
    }
    ctx.fillStyle = '#17232a';
    for (let i = 0; i < 5; i++) ctx.fillRect(-9 + i * 4, -29, 2, 2);
    ctx.fillStyle = '#d0c8a5';
    for (const x of [-13, 12]) for (const y of [-22, 5]) ctx.fillRect(x, y, 1, 1);
    ctx.fillStyle = '#eef0d48c';
    ctx.fillRect(-7, -18, 1, 7);
    ctx.fillRect(6, -16, 1, 4);
    ctx.fillStyle = '#7c694b';
    ctx.fillRect(-10, 9, 20, 1);
    ctx.fillStyle = '#c9b77c';
    ctx.fillRect(-9, 12, 5, 1);
    ctx.fillRect(4, 12, 5, 1);
    if (!save.motion)
      for (let i = 0; i < 2; i++) {
        const u = (t * (0.38 + i * 0.09) + o.s + i * 0.47) % 1,
          sx = (i ? 5 : -4) + Math.sin(t * 3 + i + o.s) * 4,
          sy = -18 - u * 25;
        ctx.fillStyle = i ? bright : '#ff9c4f';
        ctx.fillRect(Math.round(sx), Math.round(sy), i ? 2 : 1, i ? 2 : 1);
      }
    ctx.restore();
  }
};

drawGardenDecor = function (ctx, o, t) {
  ctx.imageSmoothingEnabled = false;
  if (o.type === 'moss') {
    for (let i = 0; i < 22; i++) {
      const x = Math.sin(i * 9.2 + o.seed) * o.w * 0.46,
        y = Math.cos(i * 5.7 + o.seed) * o.h * 0.45,
        r = 4 + (i % 5) * 2;
      ctx.fillStyle = i % 3 === 0 ? '#91aa7030' : i % 2 ? '#315e4038' : '#4b794738';
      ctx.fillRect(Math.round(x - r), Math.round(y - r / 2), r * 2, r);
      ctx.fillStyle = '#a6bb7a33';
      ctx.fillRect(Math.round(x), Math.round(y - r / 2 - 2), 2, 4);
    }
  } else if (o.type === 'vine') {
    const sway = save.motion ? 0 : Math.sin(t * 0.7 + o.seed) * 3;
    ctx.strokeStyle = '#14251b';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.bezierCurveTo(o.w * 0.3, 28 + sway, o.w * 0.64, -18 + sway, o.w - 25, 8);
    ctx.stroke();
    ctx.strokeStyle = '#58764d';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.strokeStyle = '#98aa70';
    ctx.lineWidth = 1;
    ctx.stroke();
    for (let i = 0; i < 11; i++) {
      const x = (i * (o.w - 30)) / 11,
        y = Math.sin(i * 1.8) * 10 + (sway * i) / 11;
      ctx.fillStyle = i % 2 ? '#6f985e' : '#9caf73';
      ctx.fillRect(Math.round(x) - 7, Math.round(y) - 3, 14, 6);
      ctx.fillStyle = '#304d35';
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 5, 2, 10);
    }
  } else if (o.type === 'planter') {
    envShadow(ctx, 56, 6, 15, 0.26);
    ctx.fillStyle = '#16231e';
    ctx.fillRect(-28, -16, 56, 34);
    ctx.fillStyle = '#596b64';
    ctx.fillRect(-26, -18, 52, 6);
    ctx.fillStyle = '#8b9485';
    ctx.fillRect(-22, -16, 40, 2);
    ctx.fillStyle = '#27392a';
    ctx.fillRect(-21, -10, 42, 24);
    ctx.fillStyle = '#111b17';
    ctx.fillRect(-17, -6, 34, 16);
    ctx.fillStyle = '#697b70';
    ctx.fillRect(-28, 12, 56, 6);
    ctx.fillStyle = '#9c7c61';
    ctx.fillRect(-19, -8, 38, 5);
    for (let i = 0; i < 7; i++) {
      const x = -18 + i * 6,
        sway = save.motion ? 0 : Math.sin(t * 0.6 + i + o.seed) * 2;
      ctx.strokeStyle = i % 2 ? '#71915e' : '#91a96f';
      ctx.lineWidth = 2;
      ctx.fillStyle = i % 3 ? '#b58ba1' : '#d2b68c';
      ctx.fillRect(Math.round(x + sway) - 3, -22 - (i % 3) * 4, 7, 5);
      ctx.fillStyle = '#e1cf9c';
      ctx.fillRect(Math.round(x + sway) - 1, -21 - (i % 3) * 4, 3, 3);
      ctx.fillStyle = '#72915d';
      ctx.fillRect(x, -17 - (i % 3) * 4, 2, 13 + (i % 3) * 4);
    }
  } else if (o.type === 'trellis') {
    ctx.fillStyle = '#263a36';
    ctx.fillRect(-23, -48, 5, 68);
    ctx.fillRect(18, -48, 5, 68);
    ctx.fillRect(-23, -50, 46, 5);
    ctx.fillStyle = '#77978c';
    ctx.fillRect(-19, -45, 3, 61);
    ctx.fillRect(-1, -55, 4, 71);
    ctx.fillRect(16, -45, 3, 61);
    ctx.fillRect(-19, -20, 38, 4);
    ctx.fillStyle = '#9fd2c42b';
    ctx.fillRect(-15, -42, 12, 18);
    ctx.fillRect(4, -42, 11, 18);
    ctx.strokeStyle = '#d6eee56e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-13, -40);
    ctx.lineTo(-4, -25);
    ctx.lineTo(-12, -27);
    ctx.moveTo(5, -40);
    ctx.lineTo(14, -26);
    ctx.stroke();
    ctx.fillStyle = '#66895b';
    ctx.fillRect(-25, 0, 9, 5);
    ctx.fillRect(15, -12, 10, 5);
    ctx.fillStyle = '#9eb677';
    ctx.fillRect(-27, -4, 8, 5);
    ctx.fillRect(19, -16, 8, 5);
  }
  if (o.type === 'planter') {
    ctx.fillStyle = '#7b8871';
    for (let x = -22; x < 23; x += 10) {
      ctx.fillRect(x, 14, 6, 1);
      ctx.fillStyle = '#2d4030';
      ctx.fillRect(x + 3, 5, 1, 8);
      ctx.fillStyle = '#7b8871';
    }
    ctx.fillStyle = '#a9b59b';
    ctx.fillRect(-22, -16, 8, 1);
    ctx.fillRect(6, -16, 12, 1);
  } else if (o.type === 'trellis') {
    ctx.fillStyle = '#b9c3a3';
    for (const x of [-19, 17]) for (const y of [-44, -18, 13]) ctx.fillRect(x, y, 1, 1);
    ctx.fillStyle = '#334c3a';
    ctx.fillRect(-23, 15, 46, 3);
    ctx.fillStyle = '#8aa782';
    ctx.fillRect(-20, 15, 13, 1);
    ctx.fillRect(5, 15, 14, 1);
  }
};

const beforeEnvironmentHollowFloor = drawHollowFloor;
drawHollowFloor = function (ctx) {
  beforeEnvironmentHollowFloor(ctx);
  drawEarlyEnvironmentArt(ctx);
};
const beforeEnvironmentPixelFloor = drawPixelFloorDetails;
drawPixelFloorDetails = function (ctx) {
  beforeEnvironmentPixelFloor(ctx);
  const w = G.world;
  if (!w || w.region !== 'hollow' || G.floor > 10) return;
  const garden = G.floor >= 6,
    x0 = Math.max(0, Math.floor(G.cam.x / TILE) - 1),
    x1 = Math.min(w.W - 1, Math.ceil((G.cam.x + G.w) / TILE) + 1),
    y0 = Math.max(0, Math.floor(G.cam.y / TILE) - 1),
    y1 = Math.min(w.H - 1, Math.ceil((G.cam.y + G.h) / TILE) + 1),
    t = save.motion ? 0 : G.tAll;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  for (let ty = y0; ty <= y1; ty++)
    for (let tx = x0; tx <= x1; tx++) {
      const i = ty * w.W + tx,
        h = ((tx * 92837111) ^ (ty * 689287499) ^ (G.floor * 283923481)) >>> 0,
        wx = tx * TILE,
        wy = ty * TILE;
      if (w.grid[i] === 1) {
        if (garden && h % 9 === 0) {
          ctx.fillStyle = '#4e7046aa';
          ctx.fillRect(wx + 4 + (h % 19), wy + 23, 3, 8);
          ctx.fillStyle = '#91aa6d';
          ctx.fillRect(wx + 1 + (h % 19), wy + 21, 8, 3);
          if (h % 27 === 0) {
            ctx.fillStyle = '#c894aa';
            ctx.fillRect(wx + 7 + (h % 15), wy + 16, 5, 5);
            ctx.fillStyle = '#ebd49e';
            ctx.fillRect(wx + 9 + (h % 15), wy + 18, 2, 2);
          }
        } else if (!garden && h % 13 === 0) {
          ctx.fillStyle = '#9f8b5b66';
          ctx.fillRect(wx + 6, wy + 6, 3, 3);
          ctx.fillRect(wx + 27, wy + 27, 3, 3);
          ctx.fillStyle = '#0a0e16aa';
          ctx.fillRect(wx + 10 + (h % 9), wy + 17, 12, 2);
          ctx.fillRect(wx + 13 + (h % 7), wy + 19, 7, 1);
        }
      } else {
        const touches =
          !isSolidTile(w, tx, ty + 1) || !isSolidTile(w, tx - 1, ty) || !isSolidTile(w, tx + 1, ty);
        if (!touches || h % 11) continue;
        if (garden) {
          ctx.fillStyle = '#29472f';
          ctx.fillRect(wx + 5, wy + 3, 4, 31);
          ctx.fillRect(wx + 9, wy + 9, 10, 3);
          ctx.fillStyle = '#719160';
          ctx.fillRect(wx + 6, wy + 5, 2, 25);
          ctx.fillStyle = '#9eb677';
          ctx.fillRect(wx + 15, wy + 6 + Math.round(Math.sin(t + h) * 2), 9, 4);
        } else {
          ctx.fillStyle = '#0a0f17aa';
          ctx.fillRect(wx + 8, wy + 8, 9, 2);
          ctx.fillRect(wx + 15, wy + 10, 2, 7);
          ctx.fillRect(wx + 17, wy + 15, 7, 2);
          ctx.fillRect(wx + 22, wy + 17, 2, 5);
          ctx.fillStyle = '#71808a55';
          ctx.fillRect(wx + 9, wy + 7, 7, 1);
          ctx.fillRect(wx + 17, wy + 14, 5, 1);
          if (h % 33 === 0) {
            ctx.fillStyle = '#9b875755';
            ctx.fillRect(wx + 27, wy + 5, 3, 2);
            ctx.fillRect(wx + 29, wy + 7, 2, 4);
          }
        }
      }
    }
  ctx.restore();
};
