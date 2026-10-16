function lateVariant() {
  const r = lateRegion(G.floor);
  return r ? clamp(G.floor - r.from, 0, 4) : 0;
}
function lateArtPalette(key) {
  return (
    {
      reservoir: {
        dark: '#101f28',
        mid: '#294653',
        edge: '#557783',
        light: '#92d3d8',
        hot: '#c9f7e9',
      },
      foundry: {
        dark: '#211514',
        mid: '#543027',
        edge: '#9a5338',
        light: '#e29250',
        hot: '#ffd17b',
      },
      observatory: {
        dark: '#141d2c',
        mid: '#293f55',
        edge: '#527f98',
        light: '#95dce9',
        hot: '#e7fbff',
      },
      archive: {
        dark: '#211d19',
        mid: '#4d4438',
        edge: '#87765b',
        light: '#cbb88e',
        hot: '#f2e2b3',
      },
      court: {
        dark: '#241820',
        mid: '#50303e',
        edge: '#98586e',
        light: '#dc94a8',
        hot: '#ffe0d2',
      },
      choir: {
        dark: '#161a2d',
        mid: '#343d66',
        edge: '#6577a7',
        light: '#aab9e9',
        hot: '#eef0ff',
      },
      citadel: {
        dark: '#1d1518',
        mid: '#44272a',
        edge: '#7f4038',
        light: '#c16a4d',
        hot: '#ffc17f',
      },
      heart: {
        dark: '#211b20',
        mid: '#514144',
        edge: '#9f7b58',
        light: '#e1bc72',
        hot: '#fff0ae',
      },
    }[key] || {
      dark: '#171b22',
      mid: '#35404d',
      edge: '#718096',
      light: '#b8c0cc',
      hot: '#ffffff',
    }
  );
}
function lateBox(ctx, x, y, w, h, dark, mid, edge) {
  ctx.fillStyle = dark;
  ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
  ctx.fillStyle = mid;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = edge;
  ctx.fillRect(x + 2, y + 2, w - 4, 2);
  ctx.fillRect(x + 2, y + 2, 2, h - 4);
  ctx.fillStyle = dark;
  ctx.fillRect(x + w - 4, y + 4, 2, h - 6);
  ctx.fillRect(x + 4, y + h - 4, w - 8, 2);
  if (w >= 26 && h >= 12) {
    ctx.fillStyle = edge;
    ctx.fillRect(x + 4, y + 4, 1, Math.max(2, h - 10));
    ctx.fillStyle = dark;
    for (const bx of [x + 6, x + w - 8]) {
      ctx.fillRect(bx, y + 5, 3, 3);
      if (h > 25) ctx.fillRect(bx, y + h - 9, 3, 3);
    }
    ctx.fillStyle = edge;
    for (const bx of [x + 6, x + w - 8]) {
      ctx.fillRect(bx, y + 5, 2, 1);
      if (h > 25) ctx.fillRect(bx, y + h - 9, 2, 1);
    }
  }
}
function lateBaseSurfaceDetail(ctx, key, kind, seed) {
  const p = lateArtPalette(key);
  const line = (x, y, w, color = p.edge) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, 1);
  };
  const rivet = (x, y) => {
    ctx.fillStyle = p.dark;
    ctx.fillRect(x - 1, y - 1, 4, 4);
    ctx.fillStyle = p.light;
    ctx.fillRect(x, y, 2, 1);
    ctx.fillStyle = p.edge;
    ctx.fillRect(x, y + 1, 2, 1);
  };
  const plate = (x, y, w, h) => {
    ctx.fillStyle = p.dark;
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
    ctx.fillStyle = p.edge;
    ctx.fillRect(x, y, w, h);
    line(x + 1, y, w - 2, p.light);
    line(x + 2, y + h - 2, w - 4, p.mid);
  };
  if (key === 'reservoir') {
    if (kind === 0 || kind === 3) {
      const cy = kind === 0 ? -2 : -13,
        radius = kind === 0 ? 18 : 20;
      for (let i = 0; i < 12; i++) {
        const a = (i * TAU) / 12;
        ctx.fillStyle = i % 3 ? p.edge : p.hot;
        ctx.fillRect(Math.round(Math.cos(a) * radius), cy + Math.round(Math.sin(a) * radius), 2, 2);
      }
      rivet(-20, 11);
      rivet(19, 11);
      plate(10, 5, 7, 5);
    } else if (kind === 1) {
      for (const x of [-12, 12]) {
        for (const y of [-28, -8, 4]) {
          line(x - 4, y, 9, p.dark);
          line(x - 3, y + 1, 7, p.light);
        }
        ctx.fillStyle = '#91b8aa';
        ctx.fillRect(x - 2, -20, 2, 9);
      }
    } else if (kind === 2) {
      line(-16, -8, 30, p.hot);
      for (let i = 0; i < 4; i++) line(-11 + i * 6, -3 + (i & 1) * 3, 4, p.edge);
      plate(-9, 7, 18, 4);
    } else {
      for (const x of [-22, 20]) for (const y of [-39, -14, 10]) rivet(x, y);
      line(-12, -3, 24, p.light);
      line(-8, 1, 16, p.mid);
    }
    ctx.fillStyle = '#6f978340';
    ctx.fillRect(-22, 12, 11, 2);
    ctx.fillRect(10, 9, 6, 2);
  } else if (key === 'foundry') {
    if (kind === 0) {
      for (let i = 0; i < 5; i++) line(-17 + i * 7, 3, 4, p.dark);
      plate(-10, -17, 20, 4);
      rivet(-20, 8);
      rivet(19, 8);
      line(-9, -21, 6, p.hot);
    } else if (kind === 1 || kind === 4) {
      const roof = kind === 4 ? -31 : -11;
      for (let x = -18; x <= 18; x += 9) {
        line(x, roof, 5, p.light);
        ctx.fillStyle = '#130e11';
        ctx.fillRect(x, roof + 2, 2, 4);
      }
      for (const x of [-24, 22]) {
        for (let y = roof + 8; y < 13; y += 12) rivet(x, y);
      }
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i % 2 ? '#ffbd69' : '#c95c34';
        ctx.fillRect(-15 + i * 9, 4 - (i % 2) * 2, 5, 2);
      }
      plate(-11, 12, 22, 4);
    } else if (kind === 2) {
      for (let i = 0; i < 3; i++) {
        const x = -15 + i * 15;
        line(x, -25, 7, p.dark);
        line(x + 1, -24, 5, p.hot);
        line(x - 3, -5, 13, p.edge);
      }
      rivet(-25, -38);
      rivet(22, -38);
    } else {
      for (const x of [-15, 15]) {
        for (const y of [-19, -5, 11]) line(x - 7, y, 14, p.edge);
        plate(x - 3, -10, 6, 9);
        ctx.fillStyle = p.hot;
        ctx.fillRect(x - 1, -6, 2, 4);
      }
    }
  } else if (key === 'observatory') {
    if (kind === 0 || kind === 4) {
      for (let i = 0; i < 12; i++) {
        const a = (i * TAU) / 12,
          x = Math.round(Math.cos(a) * 28),
          y = -8 + Math.round(Math.sin(a) * 17);
        ctx.fillStyle = i % 3 ? p.mid : p.light;
        ctx.fillRect(x, y, i % 3 ? 1 : 2, 2);
      }
      line(-16, 10, 32, p.light);
      plate(-7, 11, 14, 3);
    } else if (kind === 1) {
      for (let i = 0; i < 7; i++) {
        const a = Math.PI + (i * Math.PI) / 6;
        ctx.fillStyle = p.light;
        ctx.fillRect(Math.round(Math.cos(a) * 20), -35 + Math.round(Math.sin(a) * 20), 2, 2);
      }
      line(-5, -17, 10, p.light);
      line(-5, 2, 10, p.light);
      plate(-13, 12, 26, 4);
    } else if (kind === 2) {
      for (const s of [-1, 1]) {
        ctx.save();
        ctx.translate(s * 15, -9 + s * 5);
        ctx.rotate(s * 0.28);
        ctx.fillStyle = '#e7fbff80';
        ctx.beginPath();
        ctx.moveTo(-6, -14);
        ctx.lineTo(6, -14);
        ctx.lineTo(-6, 6);
        ctx.closePath();
        ctx.fill();
        line(-6, 9, 12, p.edge);
        rivet(-7, -16);
        rivet(6, 14);
        ctx.restore();
      }
    } else {
      for (let i = 0; i < 5; i++) {
        line(-20 + i * 9, -25, 4, p.light);
        line(-20 + i * 9, 13, 4, p.light);
      }
      ctx.fillStyle = p.mid;
      ctx.fillRect(-29, -9, 3, 12);
      ctx.fillRect(26, -9, 3, 12);
    }
  } else if (key === 'archive') {
    if (kind === 1 || kind === 3) {
      const rows = kind === 1 ? [-30, -17, -4] : [-27];
      for (const y of rows) {
        const step = kind === 1 ? 8 : 10,
          start = kind === 1 ? -20 : -23;
        for (let i = 0; i < 5; i++) {
          const x = start + i * step;
          line(x + 1, y + (kind === 1 ? -5 : 4), 3, p.hot);
          line(x + 1, y + (kind === 1 ? -2 : 21 - (i % 3) * 7), 3, p.dark);
          ctx.fillStyle = p.dark;
          ctx.fillRect(x + 4, y + (kind === 1 ? -6 : 2), 1, kind === 1 ? 5 : 24 - (i % 3) * 7);
        }
      }
    } else if (kind === 0) {
      for (let i = 0; i < 3; i++) {
        const x = -19 + i * 14;
        plate(x + 2, -6, 6, 3);
        line(x + 2, 4, 6, p.light);
        ctx.fillStyle = p.dark;
        ctx.fillRect(x + 4, -4, 2, 2);
      }
    } else if (kind === 2) {
      for (let i = 0; i < 4; i++) {
        const x = -17 + i * 10,
          y = -19 - (i % 2) * 4;
        line(x + 1, y + 2, 5, p.edge);
        line(x + 1, y + 4, 4, p.mid);
        line(x + 1, y + 6, 5, p.edge);
      }
      line(-17, -5, 32, p.dark);
      plate(11, -8, 10, 3);
    } else {
      line(-18, -16, 14, p.hot);
      line(4, -16, 12, p.hot);
      ctx.fillStyle = '#9e5545';
      ctx.fillRect(10, -1, 5, 4);
      ctx.fillStyle = '#d4af6f';
      ctx.fillRect(11, -1, 2, 1);
    }
    line(-20, 14, 39, p.edge);
  } else if (key === 'court') {
    if (kind < 2) {
      for (let i = 0; i < 4; i++) {
        const x = -19 + i * 12,
          y = -19 - (i % 2) * 3;
        line(x + 1, y + 1, 5, '#fff0d9');
        line(x + 2, y + 3, 3, '#927c70');
        ctx.fillStyle = '#b8a282';
        ctx.fillRect(x + 8, y - 2, 2, 6);
      }
      for (let x = -19; x < 22; x += 7) {
        line(x, -3, 3, p.edge);
        ctx.fillStyle = p.dark;
        ctx.fillRect(x + 2, -2, 1, 8);
      }
      line(-21, 5, 41, p.light);
    } else if (kind === 2) {
      for (const s of [-1, 1]) {
        line(s < 0 ? -22 : 17, -31, 5, p.light);
        ctx.fillStyle = p.dark;
        ctx.fillRect(s < 0 ? -22 : 20, -23, 2, 24);
      }
      plate(-11, 10, 22, 4);
    } else {
      for (const x of [-15, 15]) {
        line(x - 6, -22, 12, p.hot);
        line(x - 5, 4, 10, p.light);
        for (let y = -17; y < 4; y += 6) {
          ctx.fillStyle = p.dark;
          ctx.fillRect(x + 3, y, 2, 4);
        }
        rivet(x - 8, 11);
      }
    }
  } else if (key === 'choir') {
    if (kind === 0) {
      for (let i = 0; i < 5; i++) {
        const x = -24 + i * 12,
          h = 28 + (i % 3) * 8;
        line(x + 1, -h + 1, 7, p.light);
        ctx.fillStyle = p.dark;
        ctx.fillRect(x + 3, -h + 9, 3, 5);
        line(x + 1, -1, 7, p.light);
        line(x + 1, 2, 7, p.mid);
      }
    } else if (kind === 1 || kind === 4) {
      const bells =
        kind === 1
          ? [[0, -23, 18]]
          : [
              [-14, -23, 9],
              [0, -19, 9],
              [14, -15, 9],
            ];
      for (const [x, y, w] of bells) {
        line(x - w + 3, y + 3, w * 2 - 6, p.hot);
        line(x - w + 4, y + 5, w * 2 - 8, p.mid);
        line(x - w + 5, y + 11, w * 2 - 10, p.light);
        line(x - w + 5, y + 13, w * 2 - 10, p.dark);
      }
    } else if (kind === 2) {
      for (let i = 0; i < 4; i++) {
        line(-25 + i * 18, -9 - i * 9, 9, p.hot);
        rivet(-23 + i * 18, -6 - i * 9);
      }
    } else {
      for (const x of [-13, 13]) {
        for (const y of [-25, -7, 7]) line(x - 2, y, 6, p.light);
        ctx.fillStyle = p.dark;
        ctx.fillRect(x - 3, -45, 6, 5);
      }
    }
    line(-19, 13, 38, p.light);
  } else if (key === 'citadel') {
    if (kind === 0) {
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(-23 + i * 15, -7);
        ctx.rotate(i % 2 ? 0.18 : -0.12);
        for (const y of [-18, -4, 8]) line(-4, y, 8, p.edge);
        rivet(-2, -20);
        rivet(1, 4);
        ctx.restore();
      }
    } else if (kind === 1) {
      for (let i = 0; i < 8; i++) {
        const a = (i * TAU) / 8;
        ctx.fillStyle = p.edge;
        ctx.fillRect(Math.round(Math.cos(a) * 8), -8 + Math.round(Math.sin(a) * 8), 2, 2);
      }
      plate(-6, -12, 12, 5);
    } else if (kind === 2) {
      for (let i = 0; i < 3; i++) {
        const x = -27 + i * 18,
          y = -10 - (i % 2) * 10;
        for (let k = 0; k < 3; k++) line(x + 3, y + 11 + k * 4, 12, p.dark);
        rivet(x + 3, y + 5);
        rivet(x + 12, y + 21);
      }
    } else {
      for (const x of [-26, 24]) for (const y of [-22, -6, 10]) rivet(x, y);
      plate(-18, 10, 36, 4);
      for (let x = -16; x < 19; x += 8) line(x, -17, 4, p.light);
    }
  } else {
    if (kind === 0) {
      for (let i = 0; i < 5; i++) {
        const x = -25 + i * 13,
          y = -8 + (i % 2) * 5;
        ctx.fillStyle = '#f3d99b';
        ctx.fillRect(x - 1, y - 16, 1, 16);
        line(x - 3, y + 4, 6, p.dark);
        line(x, y - 19, 3, p.light);
      }
    } else if (kind === 1) {
      for (let i = 0; i < 5; i++) {
        const x = -18 + i * 9;
        line(x - 2, -36, 5, p.light);
        ctx.fillStyle = p.dark;
        ctx.fillRect(x, -33, 1, 9);
      }
    } else if (kind === 2 || kind === 3) {
      for (const x of [-15, 13]) for (const y of [-28, -12, 7]) rivet(x, y);
      line(-10, -21, 20, p.light);
      line(-10, -19, 20, p.dark);
    } else {
      for (let i = 0; i < 9; i++) {
        line(-20 + i * 5, 5, 3, p.edge);
        ctx.fillStyle = p.dark;
        ctx.fillRect(-20 + i * 5, 7, 2, 2);
      }
    }
  }
}
const lateFurnishingDetails = new Map();
function lateSurfaceDetail(ctx, key, kind, seed) {
  const cacheKey = key + ':' + kind + ':' + (((seed || 0) >>> 0) % 3);
  let layer = lateFurnishingDetails.get(cacheKey);
  if (!layer || layer.getContext('2d').isContextLost?.()) {
    layer = document.createElement('canvas');
    layer.width = 128;
    layer.height = 112;
    const c = layer.getContext('2d');
    c.translate(64, 76);
    if (!(key === 'reservoir' && kind === 4) && !(key === 'choir' && (kind === 1 || kind === 4)))
      lateBaseSurfaceDetail(c, key, kind, seed);
    paintLateFurnishingDetails(c, key, kind);
    if (lateFurnishingDetails.size >= 120) lateFurnishingDetails.clear();
    lateFurnishingDetails.set(cacheKey, layer);
  }
  ctx.drawImage(layer, -64, -76);
}
function paintLateFurnishingDetails(c, key, kind) {
  const p = lateArtPalette(key),
    px = (x, y, w, h, colour) => {
      c.fillStyle = colour;
      c.fillRect(x, y, w, h);
    },
    pin = (x, y) => {
      px(x - 1, y - 1, 3, 3, p.dark);
      px(x, y - 1, 1, 1, p.light);
      px(x, y, 1, 1, p.edge);
    },
    seam = (x, y, w) => {
      px(x, y, w, 1, p.dark);
      px(x + 1, y + 1, Math.max(1, w - 3), 1, p.edge);
    },
    plinth = (w = 43) => {
      px(-Math.floor(w / 2), 15, w, 3, p.dark);
      px(-Math.floor(w / 2) + 2, 14, w - 4, 1, p.edge);
      for (const x of [-Math.floor(w / 2) + 4, Math.floor(w / 2) - 7]) {
        px(x, 17, 4, 3, p.dark);
        px(x, 17, 2, 1, p.mid);
      }
    },
    wood = (x, y, w, h) => {
      for (let row = 3; row < h; row += 6) {
        px(x + 2, y + row, Math.max(2, w - 6), 1, p.dark);
        px(x + 4, y + row + 1, Math.max(2, w - 11), 1, p.edge);
      }
      px(x + Math.floor(w * 0.61), y + Math.floor(h * 0.4), 3, 1, p.mid);
    },
    pipe = (x, y, h) => {
      px(x - 4, y, 8, h, p.dark);
      px(x - 3, y, 5, h, p.mid);
      px(x - 2, y + 1, 1, h - 2, p.light);
      for (const yy of [y + 3, y + h - 6]) {
        px(x - 5, yy, 10, 3, p.dark);
        px(x - 4, yy, 8, 1, p.edge);
        px(x - 3, yy + 1, 2, 1, p.light);
      }
    },
    bowl = (x, y, w, h) => {
      px(x - 1, y, w + 2, 2, p.dark);
      px(x, y + 1, w, 2, p.hot);
      px(x + 2, y + 3, w - 4, h - 3, p.edge);
      px(x + 3, y + 3, 2, Math.max(1, h - 5), p.light);
      px(x + w - 5, y + 3, 2, Math.max(1, h - 5), p.mid);
      px(x + 3, y + h - 1, w - 6, 2, p.dark);
      px(x + 4, y + h - 1, w - 8, 1, p.light);
    },
    book = (x, y, w, h, colour) => {
      px(x - 1, y - 1, w + 2, h + 2, p.dark);
      px(x, y, w, h, colour || p.edge);
      px(x + 1, y, 1, h, p.light);
      px(x + 2, y + 2, Math.max(1, w - 3), 1, p.hot);
      px(x + 2, y + h - 3, Math.max(1, w - 3), 1, p.mid);
      if (h > 11) px(x + 2, y + 5, Math.max(1, w - 4), 2, p.dark);
    },
    bell = (x, y, w, h) => {
      px(x - 2, y - 3, 4, 3, p.dark);
      px(x - 3, y, 6, 2, p.light);
      for (let row = 2; row < h; row++) {
        const waist = Math.max(3, Math.round(w * 0.23)),
          half =
            row < 4
              ? Math.min(waist, 2 + row)
              : Math.round(waist + (w / 2 - waist) * Math.pow((row - 4) / (h - 5), 2.2));
        px(x - half, y + row, half * 2, 1, p.edge);
        px(x - half + 1, y + row, Math.max(1, Math.floor(half * 0.42)), 1, p.light);
        px(x + half - 2, y + row, 2, 1, p.mid);
      }
      px(x - w / 2 - 1, y + h - 1, w + 2, 3, p.dark);
      px(x - w / 2, y + h - 1, w, 1, p.hot);
      px(x - w / 2 + 3, y + h, w - 6, 1, p.mid);
      px(x - 1, y + h + 2, 2, 3, p.light);
    },
    leaf = (x, y, side, colour = '#80936a') => {
      px(x, y, 2, 2, '#3b4c37');
      px(x + side, y - 1, 3, 2, colour);
      px(x + side * 2, y - 2, 3, 2, colour);
      px(x + side * 3, y - 3, 2, 1, '#a2b181');
    };
  if (key === 'reservoir') {
    if (kind === 0) {
      for (const x of [-23, 19]) for (const y of [-17, 9]) pin(x, y);
      px(-12, -4, 24, 4, p.dark);
      px(-2, -14, 4, 25, p.dark);
      c.strokeStyle = p.mid;
      c.lineWidth = 5;
      c.beginPath();
      c.arc(0, -2, 12, 0, TAU);
      c.stroke();
      c.strokeStyle = p.light;
      c.lineWidth = 2;
      c.beginPath();
      c.arc(-1, -3, 12, Math.PI, TAU);
      c.stroke();
      px(-2, -4, 5, 5, p.edge);
      px(-1, -4, 2, 2, p.hot);
      for (const [x, y] of [
        [-12, -2],
        [0, -14],
        [11, -2],
        [0, 9],
      ])
        pin(x, y);
      seam(-18, 12, 17);
    } else if (kind === 1) {
      pipe(-12, -39, 51);
      pipe(12, -34, 46);
      px(-17, -24, 11, 8, '#466f68');
      px(-15, -24, 2, 5, '#9bb09a');
      px(8, -12, 9, 7, '#3e645c');
      px(9, -11, 2, 4, '#84a392');
      px(-7, -43, 3, 2, p.light);
      px(1, -44, 4, 2, p.edge);
      plinth(45);
    } else if (kind === 2) {
      bowl(-17, -12, 34, 20);
      px(-12, -9, 24, 2, '#233f47');
      px(-8, -8, 13, 1, '#6a9a9e');
      seam(-8, 3, 16);
      for (const x of [-6, 4]) px(x, 9, 2, 2, p.mid);
      px(-2, -25, 1, 8, '#7eaaaf');
      px(-2, -16, 1, 2, '#b9dcd3');
    } else if (kind === 3) {
      for (let i = 0; i < 16; i++) {
        const a = (i * TAU) / 16,
          x = Math.round(Math.cos(a) * 16),
          y = Math.round(-13 + Math.sin(a) * 16);
        px(x - 1, y - 1, 2, 2, i % 4 ? p.edge : p.hot);
      }
      px(-9, -10, 18, 1, p.mid);
      px(-2, -27, 4, 11, p.dark);
      px(-1, -27, 1, 10, p.light);
      px(-2, -15, 4, 4, p.hot);
      px(-23, 6, 7, 6, p.mid);
      for (let i = 0; i < 3; i++) px(-22 + i * 2, 7, 1, 4, p.dark);
      plinth(51);
    } else {
      bell(0, -22, 31, 22);
      for (const x of [-22, 20]) {
        px(x, -38, 1, 40, p.light);
        seam(x - 1, -27, 4);
        seam(x - 1, -3, 4);
      }
      px(-11, -7, 21, 1, p.hot);
      px(-6, -5, 12, 1, p.mid);
      leaf(-19, 12, -1, '#6e9879');
    }
    px(-23, 16, 13, 1, '#41645d');
    px(10, 18, 11, 1, '#37554e');
  } else if (key === 'foundry') {
    if (kind === 0) {
      px(-16, -17, 32, 5, p.dark);
      px(-20, -23, 40, 6, p.edge);
      px(-17, -24, 34, 2, p.light);
      px(10, -22, 8, 2, '#e3a86d');
      px(-13, -16, 25, 4, p.mid);
      for (const x of [-17, 13]) pin(x, -21);
      px(-22, 4, 12, 1, '#372327');
      px(9, 9, 11, 1, '#372327');
      px(-4, 16, 8, 5, '#1f171a');
      px(-2, 16, 2, 4, p.edge);
    } else if (kind === 1 || kind === 4) {
      const top = kind === 4 ? -31 : -11,
        height = kind === 4 ? 39 : 20;
      for (const x of [-23, 19]) {
        for (let y = top; y < top + height; y += 10) {
          px(x, y, 4, 8, p.mid);
          px(x, y, 3, 1, p.light);
          pin(x + 1, y + 5);
        }
      }
      for (let x = -17; x <= 16; x += 6) {
        px(x, top + 2, 2, height - 3, '#201618');
        px(x, top + 2, 1, height - 6, '#9b5c43');
        px(x, 2, 2, 4, '#e8a966');
      }
      px(-14, 10, 28, 3, p.dark);
      for (let x = -10; x < 13; x += 7) px(x, 10, 4, 1, '#ad704b');
      px(-24, 15, 48, 3, '#342022');
      plinth(55);
    } else if (kind === 2) {
      for (let i = 0; i < 3; i++) {
        const x = -15 + i * 15;
        pipe(x + 3, -32, 28);
        px(x - 3, -12, 13, 5, '#1c171c');
        px(x - 2, -12, 11, 1, p.light);
        pin(x, -10);
        pin(x + 7, -10);
      }
      for (const x of [-25, 22]) pin(x, -38);
      px(-21, 11, 9, 1, '#e7aa64');
      px(10, 12, 8, 1, '#c27241');
    } else {
      for (const x of [-15, 15]) {
        pipe(x, -25, 40);
        px(x - 7, -10, 14, 12, p.dark);
        px(x - 5, -8, 10, 8, p.edge);
        px(x - 2, -6, 4, 4, '#382b28');
        px(x - 1, -6, 2, 1, p.hot);
        for (const d of [-7, 6]) pin(x + d, -5);
      }
    }
  } else if (key === 'observatory') {
    if (kind === 0) {
      plinth(34);
      px(-12, 6, 24, 2, p.dark);
      for (let i = 0; i < 7; i++) px(-9 + i * 3, 7, 1, 3, p.light);
      px(-6, 12, 12, 2, p.mid);
      pin(-13, 9);
      pin(12, 9);
    } else if (kind === 1) {
      px(-8, -43, 16, 14, p.dark);
      px(-6, -41, 12, 10, p.edge);
      px(-4, -40, 9, 8, '#9bc6d1');
      px(-3, -39, 4, 5, '#e7fbff');
      px(3, -39, 1, 6, '#7096b2');
      px(-3, -34, 5, 1, '#638ca6');
      for (const y of [-21, -2]) {
        px(-5, y, 10, 3, p.dark);
        px(-4, y, 8, 1, p.light);
      }
      plinth(28);
    } else if (kind === 2) {
      for (const side of [-1, 1]) {
        c.save();
        c.translate(side * 15, -9 + side * 5);
        c.rotate(side * 0.28);
        px(-6, -14, 12, 2, '#b9dbe3');
        px(-6, -11, 2, 21, '#a6cedb');
        px(4, -11, 2, 21, '#4f7c94');
        px(-5, 11, 10, 1, p.hot);
        px(-4, 12, 8, 1, p.dark);
        for (const y of [-12, 10]) pin(7, y);
        c.restore();
      }
      plinth(46);
    } else if (kind === 3) {
      for (const x of [-27, 25]) for (const y of [-23, 11]) pin(x, y);
      for (let x = -18; x < 23; x += 4) {
        px(x, -18, 1, x % 8 ? 2 : 3, p.mid);
        px(x, 7, 1, 2, p.mid);
      }
      px(-18, -13, 5, 1, p.edge);
      px(10, 3, 7, 1, p.edge);
      plinth(49);
    } else {
      c.save();
      c.rotate(-0.35);
      for (const x of [-15, -5, 8]) {
        px(x, -11, 3, 21, p.dark);
        px(x, -10, 1, 18, p.light);
      }
      px(11, -9, 8, 17, p.edge);
      px(13, -6, 5, 11, '#c8e5e5');
      px(15, -5, 2, 8, '#f3ffff');
      px(-22, -8, 4, 13, p.mid);
      c.restore();
      px(-7, 3, 14, 4, p.mid);
      pin(0, 5);
      plinth(36);
    }
  } else if (key === 'archive') {
    if (kind === 0) {
      for (let i = 0; i < 3; i++) {
        const x = -19 + i * 14;
        px(x, -9, 10, 17, '#352c26');
        px(x + 1, -9, 8, 1, p.light);
        px(x + 2, -6, 6, 4, p.dark);
        px(x + 3, -5, 4, 2, p.hot);
        px(x + 4, -1, 3, 2, p.mid);
        px(x + 1, 3, 8, 1, p.edge);
        px(x + 1, 6, 8, 1, p.edge);
      }
      wood(-25, -15, 50, 30);
    } else if (kind === 1) {
      const tones = ['#a78a5b', '#82775b', '#a09070', '#6a6452', '#b8a080'];
      for (let row = 0; row < 3; row++) {
        const y = -34 + row * 13;
        for (let i = 0; i < 6; i++)
          book(-22 + i * 7, y + (i % 3), 5, 9 - (i % 3), tones[(row + i) % tones.length]);
        px(-24, y + 10, 48, 2, p.dark);
        px(-23, y + 10, 45, 1, p.edge);
      }
      wood(-25, 6, 50, 9);
      for (const x of [-26, 25]) for (const y of [-34, 11]) pin(x, y);
    } else if (kind === 2) {
      px(-21, -17, 11, 5, '#806348');
      px(-20, -16, 9, 2, '#d8c6a0');
      px(-21, -18, 12, 1, p.dark);
      px(-7, -20, 13, 7, '#d9ccaa');
      px(-6, -18, 10, 1, '#847256');
      px(-5, -16, 8, 1, '#a38c68');
      px(10, -19, 6, 6, '#2f2a24');
      px(11, -20, 4, 2, p.edge);
      px(16, -24, 1, 10, p.hot);
      px(15, -25, 3, 5, '#c0ba95');
      wood(-21, -5, 42, 10);
      for (const x of [-22, 20]) {
        px(x, 7, 2, 10, p.edge);
        pin(x, 9);
      }
    } else if (kind === 3) {
      for (let i = 0; i < 5; i++) {
        const x = -23 + i * 10,
          h = 31 - (i % 3) * 7;
        px(x, -28, 7, 3, p.dark);
        px(x + 1, -28, 5, 1, p.hot);
        px(x + 1, -24, 5, h - 4, '#b6a17b');
        px(x + 2, -23, 2, Math.max(1, h - 6), '#e1d1a9');
        for (let row = 0; row < 3; row++) px(x + 3, -20 + row * 4, 2, 1, '#75664f');
        px(x, -27 + h, 7, 2, p.mid);
      }
      wood(-24, 6, 48, 8);
    } else {
      px(-19, -17, 17, 22, '#dacda6');
      px(2, -17, 17, 22, '#c4b48c');
      px(-18, -16, 2, 19, '#f1e3bb');
      px(1, -17, 1, 22, '#7d6e52');
      for (let row = 0; row < 4; row++) {
        px(-14, -13 + row * 4, 9 + (row % 2) * 3, 1, '#7d6b4e');
        px(5, -13 + row * 4, 10 - (row % 3), 1, '#7d6b4e');
      }
      px(11, 0, 3, 6, '#9d4f43');
      plinth(47);
    }
  } else if (key === 'court') {
    if (kind < 2) {
      px(-24, -11, 48, 4, '#5e3745');
      px(-22, -10, 44, 1, '#ad7b89');
      for (let i = 0; i < 4; i++) {
        const x = -18 + i * 12;
        px(x - 1, -14, 9, 4, '#7f655d');
        px(x, -15, 7, 3, '#e2c6b0');
        px(x + 1, -14, 5, 1, '#a88479');
        px(x + 1, -13, 5, 1, '#f6ddc7');
        px(x + 9, -17, 1, 6, '#c4a47d');
        if (i % 2 === 0) {
          px(x + 1, -21, 4, 4, '#92705b');
          px(x + 1, -22, 4, 1, '#e3caa4');
          px(x + 2, -18, 2, 3, '#bca17a');
          px(x + 1, -16, 4, 1, '#e3caa4');
        }
      }
      for (const x of [-22, 20]) {
        px(x, 8, 3, 10, p.dark);
        px(x, 8, 1, 7, p.edge);
      }
      px(-12, -4, 22, 8, p.mid);
      px(-9, -4, 2, 6, p.edge);
      px(7, -3, 1, 5, p.dark);
      px(-8, 4, 17, 1, p.edge);
    } else if (kind === 2) {
      px(-15, -32, 30, 38, '#311e2a');
      px(-5, -30, 9, 2, '#6e4959');
      px(-8, -28, 14, 3, '#8b6370');
      px(-9, -25, 16, 9, '#a67c86');
      px(-6, -16, 12, 3, '#956c79');
      px(-8, -26, 3, 6, '#c1989f');
      px(5, -24, 3, 7, '#75525f');
      px(-6, -25, 3, 1, '#593a4e');
      px(2, -25, 3, 1, '#593a4e');
      px(-1, -23, 2, 4, '#bd9499');
      px(-4, -17, 6, 1, '#664453');
      px(-3, -14, 6, 5, '#b28a8b');
      px(-11, -9, 23, 12, '#704853');
      px(-8, -9, 3, 9, '#a77982');
      px(8, -7, 3, 10, '#4b2c40');
      for (const x of [-20, 19]) for (const y of [-36, 12]) pin(x, y);
      seam(-10, 11, 19);
    } else {
      for (const x of [-15, 15]) {
        px(x - 7, -18, 14, 25, kind === 3 && x > 0 ? '#4c3658' : '#623549');
        px(x - 6, -17, 2, 22, '#a1697b');
        px(x + 3, -17, 2, 23, '#3d263a');
        for (let y = -14; y < 5; y += 5) px(x - 3, y, 4, 1, '#805368');
        px(x - 2, -10, 5, 3, '#bc8b9c');
        px(x, -10, 1, 3, '#ead0be');
        pin(x - 8, 11);
        pin(x + 7, 11);
      }
      px(-1, -29, 2, 25, '#b58c87');
    }
  } else if (key === 'choir') {
    if (kind === 0) {
      for (let i = 0; i < 5; i++) {
        const x = -24 + i * 12,
          h = 28 + (i % 3) * 8;
        pipe(x + 4, -h, h + 14);
        px(x + 1, -h + 6, 6, 5, p.dark);
        px(x + 2, -h + 6, 4, 1, p.hot);
        px(x + 2, -h + 9, 4, 1, p.edge);
      }
      px(-23, 12, 46, 2, p.mid);
      for (let i = 0; i < 9; i++) px(-20 + i * 5, 12, 2, 2, p.light);
    } else if (kind === 1 || kind === 4) {
      if (kind === 1) bell(0, -24, 34, 24);
      else for (let i = 0; i < 3; i++) bell(-14 + i * 14, -24 + i * 4, 16, 13);
      for (const x of [-22, 21]) for (const y of [-35, -8, 12]) pin(x, y);
      px(-18, -41, 36, 1, p.light);
    } else if (kind === 2) {
      for (let i = 0; i < 4; i++) {
        const x = -28 + i * 18,
          y = -10 - i * 9;
        px(x + 1, y, 13, 4, p.dark);
        px(x + 2, y, 10, 1, p.hot);
        px(x + 3, y + 1, 8, 2, p.edge);
        px(x + 3, y + 2, 7, 1, p.mid);
        pin(x + 4, y + 4);
      }
    } else {
      for (const x of [-13, 13]) {
        px(x - 2, -36, 4, 46, p.mid);
        px(x - 1, -35, 1, 44, p.light);
        for (const y of [-24, -8, 7]) px(x - 4, y, 8, 2, p.edge);
        px(x - 3, -43, 6, 2, p.mid);
        pin(x, -43);
      }
      plinth(43);
    }
  } else if (key === 'citadel') {
    if (kind === 0) {
      for (let i = 0; i < 4; i++) {
        c.save();
        c.translate(-23 + i * 15, -7);
        c.rotate(i % 2 ? 0.18 : -0.12);
        px(-3, -23, 5, 31, '#623b35');
        px(-2, -22, 1, 28, '#b07050');
        px(-4, -17, 8, 3, p.dark);
        px(-4, -17, 7, 1, p.edge);
        px(-4, 1, 8, 3, p.dark);
        pin(-1, -16);
        pin(1, 2);
        c.restore();
      }
    } else if (kind === 1) {
      for (const x of [-23, 21]) for (const y of [-25, -6, 11]) pin(x, y);
      for (let i = 0; i < 12; i++) {
        const a = (i * TAU) / 12,
          x = Math.round(Math.cos(a) * 12),
          y = Math.round(-8 + Math.sin(a) * 12);
        px(x - 1, y - 1, 3, 3, p.mid);
        px(x, y - 1, 1, 1, p.light);
      }
      px(-3, -11, 7, 7, p.dark);
      px(-1, -10, 3, 4, p.edge);
      px(-1, -10, 2, 1, p.hot);
      px(-18, 9, 36, 2, p.dark);
      px(-16, 9, 8, 1, p.edge);
    } else if (kind === 2) {
      for (let i = 0; i < 3; i++) {
        const x = -27 + i * 18,
          y = -10 - (i % 2) * 10;
        px(x + 3, y + 2, 11, 21, '#432829');
        px(x + 3, y + 3, 2, 17, '#a75e47');
        px(x + 5, y + 6, 7, 1, '#7b4738');
        px(x + 5, y + 13, 7, 1, '#7b4738');
        px(x + 7, y + 4, 3, 2, '#e4ad75');
        pin(x + 13, y + 20);
      }
    } else {
      for (const x of [-25, 23]) for (const y of [-22, -7, 10]) pin(x, y);
      for (let i = 0; i < 3; i++) {
        const x = -17 + i * 16;
        px(x, -14, 7, 18, '#53302e');
        px(x, -14, 2, 15, '#a66048');
        px(x, -7, 7, 1, p.dark);
        pin(x + 2, -11);
        pin(x + 4, 2);
      }
      px(-6, -24, 12, 9, p.dark);
      px(-5, -24, 10, 1, p.light);
      px(-3, -22, 6, 5, p.edge);
      px(-1, -21, 2, 3, p.hot);
      seam(-17, 11, 34);
    }
  } else {
    if (kind === 0) {
      for (let i = 0; i < 5; i++) {
        c.save();
        c.translate(-25 + i * 13, -8 + (i % 2) * 5);
        c.rotate((i - 2) * 0.12);
        px(-4, -25, 8, 36, p.dark);
        px(-3, -24, 6, 33, p.mid);
        px(-2, -23, 2, 29, p.edge);
        px(-1, -21, 2, 11, p.hot);
        px(1, -18, 1, 23, '#8a6749');
        px(-3, 6, 6, 2, p.light);
        c.restore();
      }
    } else if (kind === 1) {
      for (let i = 0; i < 5; i++) {
        const x = -18 + i * 9;
        for (let y = -31; y < 14; y += 9) {
          px(x - 2, y, 5, 2, '#3e342b');
          px(x - 2, y + 2, 2, 1, '#b18b58');
        }
      }
      px(-7, -7, 4, 3, '#cda768');
      px(7, 3, 5, 2, '#b38c58');
    } else if (kind === 2) {
      for (let i = 0; i < 4; i++) {
        const y = -27 + i * 11;
        px(-22, y + 1, 32 + i * 4, 2, '#cba769');
        px(-20, y + 4, 28 + i * 4, 1, '#604a39');
        for (let j = 0; j < 3; j++) px(-18 + j * 10, y + 1, 1, 2, '#fff0ae');
      }
      for (const x of [-27, 25]) for (const y of [-31, 11]) pin(x, y);
    } else if (kind === 3) {
      px(-9, -24, 18, 31, '#211e21');
      px(-6, -20, 12, 24, '#6f5c41');
      px(-4, -18, 8, 19, '#b7935e');
      px(-2, -16, 3, 13, '#ffedb5');
      px(2, -15, 1, 12, '#dcb674');
      for (const x of [-22, 20]) for (const y of [-37, -9, 13]) pin(x, y);
      seam(-13, 11, 25);
    } else {
      bowl(-23, -2, 46, 17);
      px(-18, 0, 36, 3, '#655041');
      for (let i = 0; i < 8; i++) px(-18 + i * 5, 7, 2, 4, '#7e644a');
      pin(-26, -4);
      pin(24, -4);
      px(-20, -16, 2, 5, p.light);
      px(17, -17, 2, 4, p.edge);
    }
  }
}
function lateChain(ctx, x, y, len, p) {
  ctx.strokeStyle = p.dark;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + len);
  ctx.stroke();
  ctx.strokeStyle = p.edge;
  ctx.lineWidth = 2;
  for (let i = 4; i < len; i += 8) {
    ctx.beginPath();
    ctx.ellipse(x, y + i, 3, 5, (i / 8) % 2 ? 0 : Math.PI / 2, 0, TAU);
    ctx.stroke();
  }
}
const lateFurnishingSprites = new Map();
function lateProp(ctx, key, kind, x, y, scale, seed) {
  if (
    (key === 'reservoir' && kind === 2) ||
    (key === 'observatory' && kind === 0) ||
    (key === 'choir' && kind === 2) ||
    (key === 'heart' && kind === 4)
  ) {
    paintLateProp(ctx, key, kind, x, y, scale, seed);
    return;
  }
  const variant = key === 'observatory' && kind === 3 ? seed : ((seed || 0) >>> 0) % 3,
    cacheKey = key + ':' + kind + ':' + variant;
  let sprite = lateFurnishingSprites.get(cacheKey);
  if (!sprite || sprite.getContext('2d').isContextLost?.()) {
    sprite = document.createElement('canvas');
    sprite.width = 128;
    sprite.height = 112;
    const c = sprite.getContext('2d');
    c.translate(64, 76);
    paintLateProp(c, key, kind, 0, 0, 1, seed);
    if (lateFurnishingSprites.size >= 120) lateFurnishingSprites.clear();
    lateFurnishingSprites.set(cacheKey, sprite);
  }
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(scale || 1, scale || 1);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sprite, -64, -76);
  ctx.restore();
}
function paintLateProp(ctx, key, kind, x, y, scale, seed) {
  const p = lateArtPalette(key),
    t = save.motion ? 0 : G.tAll,
    bob = save.motion ? 0 : Math.sin(t * 1.45 + seed) * 1.25;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(scale || 1, scale || 1);
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = 'rgba(2,4,7,.35)';
  ctx.fillRect(-30, 14, 60, 7);
  if (key === 'reservoir') {
    if (kind === 0) {
      lateBox(ctx, -25, -20, 50, 36, p.dark, p.mid, p.edge);
      ctx.fillStyle = p.dark;
      ctx.fillRect(-17, -12, 34, 20);
      ctx.strokeStyle = p.light;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -2, 10, 0, TAU);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i * TAU) / 8;
        ctx.fillStyle = p.light;
        ctx.fillRect(Math.round(Math.cos(a) * 14) - 2, -4 + Math.round(Math.sin(a) * 14), 4, 4);
      }
      ctx.fillStyle = p.hot;
      ctx.fillRect(-2, -7, 4, 10);
      ctx.fillRect(-7, -4, 14, 4);
    } else if (kind === 1) {
      for (const s of [-1, 1]) {
        ctx.fillStyle = p.dark;
        ctx.fillRect(s * 12 - 5, -41, 10, 54);
        ctx.fillStyle = p.edge;
        ctx.fillRect(s * 12 - 2, -38, 4, 45);
      }
      lateBox(ctx, -25, 5, 50, 13, p.dark, p.mid, p.edge);
      ctx.fillStyle = p.light;
      ctx.fillRect(-20, -34, 8, 5);
      ctx.fillRect(12, -22, 8, 5);
      ctx.strokeStyle = p.mid;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(-12, -34);
      ctx.quadraticCurveTo(0, -52, 12, -34);
      ctx.stroke();
    } else if (kind === 2) {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-4, -44, 8, 56);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-1, -42, 3, 49);
      ctx.fillStyle = '#59482f';
      ctx.fillRect(-20, -12, 40, 6);
      ctx.fillStyle = p.mid;
      ctx.beginPath();
      ctx.moveTo(-17, -10);
      ctx.lineTo(17, -10);
      ctx.lineTo(11, 8);
      ctx.lineTo(-11, 8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = p.light;
      ctx.fillRect(-12, -9, 24, 3);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-3, -31 + bob, 6, 8);
    } else if (kind === 3) {
      lateBox(ctx, -28, 2, 56, 16, p.dark, p.mid, p.edge);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-21, -5, 42, 8);
      ctx.strokeStyle = p.light;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -13, 16, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = p.dark;
      ctx.beginPath();
      ctx.arc(0, -13, 7, 0, TAU);
      ctx.fill();
      ctx.fillStyle = p.hot;
      ctx.fillRect(-2, -28, 4, 15);
    } else {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-24, -45, 6, 61);
      ctx.fillRect(18, -45, 6, 61);
      ctx.fillRect(-24, -46, 48, 6);
      lateChain(ctx, 0, -43, 20, p);
      ctx.fillStyle = p.dark;
      ctx.fillRect(-20, 4, 40, 5);
    }
  } else if (key === 'foundry') {
    if (kind === 0) {
      lateBox(ctx, -27, -2, 54, 18, p.dark, p.mid, p.edge);
      ctx.fillStyle = p.dark;
      ctx.fillRect(-19, -11, 38, 9);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-13, -24, 26, 13);
      ctx.fillStyle = p.light;
      ctx.fillRect(-9, -23, 18, 3);
      ctx.fillStyle = '#111217';
      ctx.fillRect(-5, 16, 10, 8);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-3, -20, 6, 3);
    } else if (kind === 1) {
      lateBox(ctx, -28, -14, 56, 29, p.dark, p.mid, p.edge);
      ctx.fillStyle = '#151217';
      ctx.fillRect(-21, -8, 42, 17);
      ctx.fillStyle = p.edge;
      for (let i = 0; i < 4; i++) ctx.fillRect(-18 + i * 12, -5 + (i % 2) * 4, 8, 6);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-14, 5, 28, 3);
      ctx.fillStyle = '#df673b';
      ctx.fillRect(-10, 8, 20, 3);
    } else if (kind === 2) {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-27, -38, 6, 55);
      ctx.fillRect(21, -38, 6, 55);
      ctx.fillRect(-27, -41, 54, 6);
      for (let i = 0; i < 3; i++) {
        const xx = -15 + i * 15;
        ctx.fillStyle = p.edge;
        ctx.fillRect(xx, -34, 7, 28);
        ctx.fillStyle = p.light;
        ctx.fillRect(xx + 2, -31, 3, 19);
        ctx.fillStyle = p.dark;
        ctx.fillRect(xx - 4, -7, 15, 6);
      }
      ctx.fillStyle = p.hot;
      ctx.fillRect(-23, 9, 46, 4);
    } else if (kind === 3) {
      for (const s of [-1, 1]) {
        lateBox(ctx, s * 15 - 10, -22, 20, 39, p.dark, p.mid, p.edge);
        ctx.fillStyle = p.dark;
        ctx.fillRect(s * 15 - 6, -16, 12, 25);
        ctx.fillStyle = '#7b3b2f';
        ctx.fillRect(s * 15 - 3, -13, 6, 18);
      }
      ctx.fillStyle = p.light;
      ctx.fillRect(-23, -26, 16, 4);
      ctx.fillRect(7, -26, 16, 4);
    } else {
      lateBox(ctx, -30, -35, 60, 51, p.dark, p.mid, p.edge);
      ctx.fillStyle = '#0c0c10';
      ctx.fillRect(-21, -27, 42, 35);
      ctx.fillStyle = '#762e23';
      ctx.fillRect(-16, -18, 32, 24);
      ctx.fillStyle = '#d85b2f';
      ctx.fillRect(-11, -12, 22, 17);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-5, -8, 10, 13);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-34, -27, 6, 43);
      ctx.fillRect(28, -27, 6, 43);
    }
  } else if (key === 'observatory') {
    if (kind === 0) {
      ctx.strokeStyle = p.edge;
      ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate(i * 0.78 + t * 0.04);
        ctx.beginPath();
        ctx.ellipse(0, -10, 25 - i * 5, 9 + i * 6, 0, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = p.hot;
      ctx.beginPath();
      ctx.arc(0, -10 + bob, 5, 0, TAU);
      ctx.fill();
      lateBox(ctx, -19, 4, 38, 13, p.dark, p.mid, p.edge);
    } else if (kind === 1) {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-5, -32, 10, 49);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-2, -29, 4, 43);
      ctx.strokeStyle = p.light;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, -35, 18, -0.35, Math.PI + 0.35);
      ctx.stroke();
      ctx.fillStyle = p.hot;
      ctx.fillRect(-7, -41, 14, 11);
      ctx.fillStyle = '#b9ecff';
      ctx.fillRect(-3, -39, 6, 7);
    } else if (kind === 2) {
      for (const s of [-1, 1]) {
        ctx.save();
        ctx.translate(s * 15, -9 + s * 5);
        ctx.rotate(s * 0.28);
        ctx.strokeStyle = p.edge;
        ctx.lineWidth = 4;
        ctx.strokeRect(-10, -18, 20, 36);
        ctx.fillStyle = p.light + '55';
        ctx.fillRect(-7, -15, 14, 30);
        ctx.fillStyle = p.hot;
        ctx.fillRect(-5, -13, 4, 22);
        ctx.restore();
      }
      lateBox(ctx, -26, 10, 52, 8, p.dark, p.mid, p.edge);
    } else if (kind === 3) {
      lateBox(ctx, -30, -27, 60, 44, p.dark, p.mid, p.edge);
      ctx.fillStyle = '#0b1020';
      ctx.fillRect(-24, -21, 48, 31);
      for (let i = 0; i < 13; i++) {
        const xx = ((i * 17 + seed * 3) % 43) - 21,
          yy = ((i * 11 + seed) % 25) - 18;
        ctx.fillStyle = i % 4 ? p.light : p.hot;
        ctx.fillRect(xx, yy, i % 4 ? 2 : 3, i % 4 ? 2 : 3);
      }
      ctx.strokeStyle = p.edge;
      ctx.beginPath();
      ctx.moveTo(-20, 5);
      ctx.lineTo(-2, -15);
      ctx.lineTo(17, -2);
      ctx.stroke();
    } else {
      ctx.save();
      ctx.rotate(-0.35);
      lateBox(ctx, -24, -12, 48, 23, p.dark, p.mid, p.edge);
      ctx.fillStyle = p.light + '66';
      ctx.fillRect(-18, -8, 32, 15);
      ctx.fillStyle = p.hot;
      ctx.fillRect(8, -6, 8, 11);
      ctx.restore();
      ctx.fillStyle = p.dark;
      ctx.fillRect(-4, 0, 8, 18);
      ctx.fillRect(-20, 15, 40, 5);
      ctx.strokeStyle = p.edge;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -7, 31, Math.PI, TAU);
      ctx.stroke();
    }
  } else if (key === 'archive') {
    if (kind === 0) {
      lateBox(ctx, -29, -18, 58, 35, p.dark, p.mid, p.edge);
      ctx.fillStyle = '#171512';
      ctx.fillRect(-22, -11, 44, 21);
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = p.edge;
        ctx.fillRect(-19 + i * 14, -8, 10, 7);
        ctx.fillStyle = p.light;
        ctx.fillRect(-16 + i * 14, -6, 4, 2);
        ctx.fillStyle = p.mid;
        ctx.fillRect(-19 + i * 14, 2, 10, 6);
      }
    } else if (kind === 1) {
      lateBox(ctx, -29, -37, 58, 54, p.dark, p.mid, p.edge);
      for (let y = -30; y < 10; y += 13) {
        ctx.fillStyle = p.dark;
        ctx.fillRect(-23, y, 46, 4);
        for (let x = -20; x < 20; x += 8) {
          ctx.fillStyle = (x + y + seed) & 8 ? p.edge : p.light;
          ctx.fillRect(x, y - 7, 5, 7);
        }
      }
    } else if (kind === 2) {
      lateBox(ctx, -28, -8, 56, 14, p.dark, p.mid, p.edge);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-25, -12, 50, 6);
      ctx.fillStyle = p.light;
      ctx.fillRect(-19, -10, 28, 2);
      ctx.fillStyle = '#2b2420';
      ctx.fillRect(-23, 5, 6, 14);
      ctx.fillRect(17, 5, 6, 14);
      ctx.fillStyle = p.hot;
      for (let i = 0; i < 4; i++) ctx.fillRect(-17 + i * 10, -19 - (i % 2) * 4, 7, 9 + (i % 2) * 4);
    } else if (kind === 3) {
      lateBox(ctx, -30, -34, 60, 52, p.dark, p.mid, p.edge);
      for (let i = 0; i < 5; i++) {
        const x = -23 + i * 10;
        ctx.fillStyle = i % 2 ? p.edge : p.light;
        ctx.fillRect(x, -27, 7, 35 - (i % 3) * 7);
        ctx.fillStyle = p.dark;
        ctx.fillRect(x + 1, -24, 2, 27);
      }
      ctx.fillStyle = '#17140f';
      ctx.fillRect(-20, 9, 40, 5);
    } else {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-4, -42, 8, 55);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-1, -39, 3, 49);
      lateBox(ctx, -27, 5, 54, 13, p.dark, p.mid, p.edge);
      ctx.fillStyle = '#eee0b5';
      ctx.fillRect(-20, -18, 40, 24);
      ctx.fillStyle = '#5d5141';
      for (let y = -14; y < 3; y += 5) ctx.fillRect(-16, y, 29 - (y % 3), 2);
      ctx.fillStyle = '#231d19';
      ctx.fillRect(-2, -22, 4, 29);
    }
  } else if (key === 'court') {
    if (kind === 0) {
      lateBox(ctx, -29, -8, 58, 18, p.dark, p.mid, p.edge);
      ctx.fillStyle = p.light;
      ctx.fillRect(-24, -14, 48, 6);
      ctx.fillStyle = '#ead0bc';
      for (let i = 0; i < 4; i++) ctx.fillRect(-19 + i * 12, -19 - (i % 2) * 3, 8, 5);
      ctx.fillStyle = p.dark;
      ctx.fillRect(-24, 10, 5, 9);
      ctx.fillRect(19, 10, 5, 9);
    } else if (kind === 1) {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-31, -9, 62, 20);
      ctx.fillStyle = p.mid;
      ctx.fillRect(-28, -13, 56, 20);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-24, -11, 48, 3);
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = '#d6c4ac';
        ctx.fillRect(-21 + i * 11, -17 + (i % 2) * 3, 8, 5);
        ctx.fillStyle = p.light;
        ctx.fillRect(-19 + i * 11, -15 + (i % 2) * 3, 4, 2);
      }
      ctx.fillStyle = p.dark;
      ctx.fillRect(-23, 7, 5, 12);
      ctx.fillRect(18, 7, 5, 12);
    } else if (kind === 2) {
      lateBox(ctx, -24, -40, 48, 57, p.dark, p.mid, p.edge);
      ctx.fillStyle = '#281b25';
      ctx.fillRect(-18, -34, 36, 43);
      ctx.fillStyle = p.light;
      ctx.beginPath();
      ctx.ellipse(0, -18, 9, 13, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = p.dark;
      ctx.fillRect(-4, -23, 8, 4);
      ctx.fillRect(-9, -5, 18, 13);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-15, 3, 30, 3);
    } else if (kind === 3) {
      for (const s of [-1, 1]) {
        lateBox(ctx, s * 15 - 12, -27, 24, 43, p.dark, p.mid, p.edge);
        ctx.fillStyle = s < 0 ? '#713447' : '#4b375f';
        ctx.fillRect(s * 15 - 7, -20, 14, 25);
        ctx.fillStyle = p.light;
        ctx.fillRect(s * 15 - 3, -31, 6, 7);
      }
      ctx.fillStyle = p.hot;
      ctx.fillRect(-3, -35, 6, 46);
    } else {
      for (const s of [-1, 1]) {
        lateBox(ctx, s * 17 - 13, -28, 26, 45, p.dark, p.mid, p.edge);
        ctx.fillStyle = p.edge;
        ctx.fillRect(s * 17 - 8, -21, 16, 31);
        ctx.fillStyle = p.light;
        ctx.fillRect(s * 17 - 5, -18, 5, 25);
        ctx.fillStyle = p.hot;
        ctx.fillRect(s * 17 - 3, -35, 6, 9);
      }
      ctx.fillStyle = p.dark;
      ctx.fillRect(-5, -7, 10, 25);
    }
  } else if (key === 'choir') {
    if (kind === 0) {
      for (let i = 0; i < 5; i++) {
        const x = -24 + i * 12,
          h = 28 + (i % 3) * 8;
        ctx.fillStyle = p.dark;
        ctx.fillRect(x, -h, 9, h + 17);
        ctx.fillStyle = p.edge;
        ctx.fillRect(x + 2, -h + 3, 4, h + 8);
        ctx.fillStyle = p.light;
        ctx.fillRect(x + 3, -h + 5, 2, 7);
      }
      lateBox(ctx, -31, 8, 62, 10, p.dark, p.mid, p.edge);
    } else if (kind === 1) {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-24, -43, 6, 61);
      ctx.fillRect(18, -43, 6, 61);
      ctx.fillRect(-24, -45, 48, 6);
      lateChain(ctx, 0, -42, 16, p);
    } else if (kind === 2) {
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = p.dark;
        ctx.fillRect(-28 + i * 18, -7 - i * 9, 16, 8);
        ctx.fillStyle = p.edge;
        ctx.fillRect(-25 + i * 18, -10 - i * 9, 10, 5);
      }
      ctx.strokeStyle = p.light;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-27, 4);
      ctx.quadraticCurveTo(0, -38, 27, -8);
      ctx.stroke();
      ctx.fillStyle = p.hot;
      ctx.fillRect(18, -16 + bob, 4, 4);
    } else if (kind === 3) {
      for (const s of [-1, 1]) {
        ctx.fillStyle = p.dark;
        ctx.fillRect(s * 13 - 3, -39, 6, 51);
        ctx.fillStyle = p.edge;
        ctx.fillRect(s * 13 - 1, -36, 3, 44);
        ctx.strokeStyle = p.light;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(s * 13, -42, 11, 0, TAU);
        ctx.stroke();
      }
      ctx.fillStyle = p.hot;
      ctx.fillRect(-2, -49, 4, 59);
      lateBox(ctx, -25, 8, 50, 10, p.dark, p.mid, p.edge);
    } else {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-29, -36, 7, 53);
      ctx.fillRect(22, -36, 7, 53);
      ctx.fillRect(-29, -39, 58, 7);
      for (let i = 0; i < 3; i++) {
        const x = -14 + i * 14;
        lateChain(ctx, x, -35, 12 + i * 4, p);
      }
    }
  } else if (key === 'citadel') {
    if (kind === 0) {
      for (let i = 0; i < 4; i++) {
        ctx.save();
        ctx.translate(-23 + i * 15, -7);
        ctx.rotate(i % 2 ? 0.18 : -0.12);
        lateBox(ctx, -6, -27, 12, 42, p.dark, p.mid, p.edge);
        ctx.fillStyle = p.light;
        ctx.fillRect(-3, -24, 3, 31);
        ctx.restore();
      }
      ctx.fillStyle = p.dark;
      ctx.fillRect(-31, 11, 62, 7);
    } else if (kind === 1) {
      lateBox(ctx, -26, -31, 52, 48, p.dark, p.mid, p.edge);
      ctx.fillStyle = '#151114';
      ctx.fillRect(-18, -24, 36, 31);
      ctx.strokeStyle = p.light;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, -8, 12, 0, TAU);
      ctx.stroke();
      lateChain(ctx, -18, -23, 29, p);
      lateChain(ctx, 18, -23, 29, p);
    } else if (kind === 2) {
      for (let i = 0; i < 3; i++) {
        lateBox(ctx, -27 + i * 18, -10 - (i % 2) * 10, 18, 27, p.dark, p.mid, p.edge);
        ctx.fillStyle = p.light;
        ctx.fillRect(-22 + i * 18, -6 - (i % 2) * 10, 4, 4);
      }
      ctx.fillStyle = '#b96340';
      for (let i = 0; i < 3; i++) ctx.fillRect(-21 + i * 18, -15 - (i % 2) * 10, 7, 4);
    } else if (kind === 3) {
      lateBox(ctx, -30, -28, 60, 45, p.dark, p.mid, p.edge);
      ctx.fillStyle = '#111014';
      ctx.fillRect(-22, -20, 44, 29);
      ctx.fillStyle = p.edge;
      for (let i = 0; i < 3; i++) ctx.fillRect(-17 + i * 16, -16, 7, 22);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-3, -25, 6, 36);
      ctx.fillRect(-12, -9, 24, 5);
    } else {
      lateBox(ctx, -31, -30, 62, 47, p.dark, p.mid, p.edge);
      ctx.fillStyle = '#151116';
      ctx.fillRect(-23, -23, 46, 31);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-16, -14, 32, 23);
      ctx.fillStyle = p.light;
      ctx.fillRect(-11, -19, 22, 7);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-3, -26, 6, 37);
      ctx.fillStyle = p.dark;
      ctx.fillRect(-34, 10, 68, 8);
    }
  } else {
    if (kind === 0) {
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.translate(-25 + i * 13, -8 + (i % 2) * 5);
        ctx.rotate((i - 2) * 0.12);
        ctx.fillStyle = p.mid;
        ctx.fillRect(-5, -27, 10, 39);
        ctx.fillStyle = p.edge;
        ctx.fillRect(-2, -24, 4, 31);
        ctx.fillStyle = p.hot;
        ctx.fillRect(-1, -22, 2, 8);
        ctx.restore();
      }
      ctx.fillStyle = p.dark;
      ctx.fillRect(-31, 12, 62, 7);
    } else if (kind === 1) {
      ctx.strokeStyle = '#59442e';
      ctx.lineWidth = 9;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(-24 + i * 12, 17);
        ctx.quadraticCurveTo(-16 + i * 8, -16 - i * 4, -18 + i * 9, -39);
        ctx.stroke();
      }
      ctx.strokeStyle = p.edge;
      ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(-24 + i * 12, 17);
        ctx.quadraticCurveTo(-16 + i * 8, -16 - i * 4, -18 + i * 9, -39);
        ctx.stroke();
      }
      ctx.fillStyle = p.hot;
      for (let i = 0; i < 4; i++) ctx.fillRect(-22 + i * 15, -23 - (i % 2) * 7, 6, 3);
    } else if (kind === 2) {
      lateBox(ctx, -30, -35, 60, 52, p.dark, p.mid, p.edge);
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = p.light;
        ctx.fillRect(-23, -27 + i * 11, 34 + i * 4, 5);
        ctx.fillStyle = p.hot;
        ctx.fillRect(15 + (i % 2) * 4, -26 + i * 11, 6, 3);
      }
      ctx.fillStyle = '#131017';
      ctx.fillRect(-3, -31, 6, 43);
    } else if (kind === 3) {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-26, -42, 7, 60);
      ctx.fillRect(19, -42, 7, 60);
      ctx.fillRect(-26, -45, 52, 7);
      lateBox(ctx, -18, -33, 36, 48, p.dark, p.mid, p.edge);
      ctx.fillStyle = '#0b0b11';
      ctx.fillRect(-11, -25, 22, 33);
      ctx.fillStyle = p.light;
      ctx.fillRect(-4, -17, 8, 18);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-2, -14, 4, 4);
      ctx.fillRect(-2, -4, 4, 4);
    } else {
      ctx.strokeStyle = p.edge;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, -6, 27, Math.PI, TAU);
      ctx.stroke();
      ctx.fillStyle = p.dark;
      ctx.fillRect(-30, -7, 60, 24);
      ctx.fillStyle = p.mid;
      ctx.fillRect(-25, -10, 50, 21);
      for (let i = 0; i < 7; i++) {
        const a = (i * TAU) / 7 + t * 0.05,
          r = 17 + (i % 2) * 6;
        ctx.fillStyle = i % 2 ? p.light : p.hot;
        ctx.fillRect(
          Math.round(Math.cos(a) * r) - 2,
          -7 + Math.round(Math.sin(a) * r * 0.45) - 2,
          5,
          5
        );
      }
      ctx.fillStyle = p.hot;
      ctx.beginPath();
      ctx.arc(0, -7 + bob, 7, 0, TAU);
      ctx.fill();
    }
  }
  lateSurfaceDetail(ctx, key, kind, seed);
  ctx.restore();
}
function lateRoomInlay(ctx, o, key, v) {
  const p = lateArtPalette(key),
    W = o.w / 2,
    H = o.h / 2;
  const rect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };
  const left = -W + 7,
    right = W - 7,
    top = -H + 7,
    bottom = H - 7;
  rect(left, top, o.w - 14, 2, p.edge + '72');
  rect(left, top + 2, o.w - 14, 3, '#06090b55');
  rect(left, bottom - 2, o.w - 14, 2, p.edge + '50');
  for (const x of [left, right - 2]) rect(x, top, 2, o.h - 14, p.edge + '40');
  if (key === 'reservoir') {
    for (const y of [top + 7, bottom - 9]) {
      rect(left + 4, y, o.w - 22, 7, '#07161d');
      rect(left + 5, y + 5, o.w - 24, 1, p.light + '80');
      for (let x = left + 8; x < right - 8; x += 10) rect(x, y + 1, 2, 4, p.edge + '85');
    }
    for (const x of [left + 4, right - 11]) {
      for (let y = top + 27; y < bottom - 22; y += 32) {
        rect(x, y, 7, 10, '#33534b55');
        rect(x + 2, y + 2, 3, 2, '#7eb7a064');
        rect(x + 3, y + 5, 3, 4, '#1c34345c');
      }
    }
    for (let i = 0; i < 5; i++) {
      const x = -W + 23 + ((i * 71 + o.seed * 17) % Math.max(1, o.w - 46));
      const y = -H + 30 + ((i * 43 + o.seed * 11) % Math.max(1, o.h - 60));
      rect(x, y, 17, 1, p.light + '32');
      rect(x + 5, y + 3, 19, 1, p.light + '27');
    }
  } else if (key === 'foundry') {
    for (let x = left + 13; x < right - 10; x += 52) {
      for (const y of [top + 8, bottom - 14]) {
        rect(x, y, 12, 6, '#101014');
        rect(x + 1, y, 10, 1, '#b773444c');
        for (let k = 0; k < 3; k++) rect(x + 2 + k * 3, y + 2, 1, 3, '#814b3466');
      }
      for (const y of [top + 21, bottom - 26]) {
        rect(x + 2, y, 3, 3, '#0d0c10');
        rect(x + 2, y, 2, 1, '#c1935766');
      }
    }
    for (const x of [left + 5, right - 15]) {
      for (let y = top + 34; y < bottom - 18; y += 31) {
        rect(x, y, 10, 2, '#65473577');
        rect(x + 4, y + 3, 5, 2, '#a35c3448');
      }
    }
  } else if (key === 'observatory') {
    for (let i = 0; i < 32; i++) {
      const a = (i * TAU) / 32,
        r = Math.min(W, H) * 0.78;
      const x = Math.round(Math.cos(a) * r),
        y = Math.round(Math.sin(a) * r * 0.72);
      rect(x, y, i % 4 ? 2 : 4, i % 4 ? 2 : 3, p.edge + (i % 4 ? '58' : '96'));
    }
    for (const s of [-1, 1]) {
      for (let i = 0; i < 5; i++) {
        const x = s * (W - 23 - i * 8),
          y = top + 19 + i * 4;
        rect(x, y, 5, 2, p.light + '48');
        rect(x + 1, y + 2, 2, 3, p.edge + '50');
      }
    }
    for (let x = left + 18; x < right - 10; x += 30) {
      rect(x, bottom - 8, 7, 3, p.mid + 'a0');
      rect(x + 1, bottom - 8, 3, 1, p.hot + '70');
    }
  } else if (key === 'archive') {
    for (const y of [top + 7, bottom - 15]) {
      rect(left + 6, y, o.w - 26, 7, '#15130f70');
      rect(left + 6, y, o.w - 26, 1, '#bba67855');
      for (let x = left + 10; x < right - 13; x += 18) {
        rect(x, y + 3, 11, 2, '#78644b66');
        rect(x + 2, y + 2, 6, 1, '#c6b48655');
      }
    }
    for (let i = 0; i < 6; i++) {
      const x = left + 18 + ((i * 67 + o.seed * 7) % Math.max(1, o.w - 50));
      const y = i & 1 ? bottom - 30 - i * 3 : top + 24 + i * 3;
      rect(x, y + 2, 12, 7, '#09090965');
      rect(x - 1, y, 11, 7, '#b9aa7b80');
      rect(x + 1, y + 2, 6, 1, '#584e3b99');
      rect(x + 1, y + 4, 5, 1, '#584e3b99');
    }
  } else if (key === 'court') {
    const rx = Math.round(W * 0.28);
    for (const x of [-rx + 2, rx - 3]) {
      rect(x, top + 2, 1, o.h - 18, '#d3ac7c77');
      rect(x + (x < 0 ? 2 : -2), top + 2, 1, o.h - 18, '#281925aa');
      for (let y = top + 14; y < bottom - 9; y += 18) {
        rect(x + (x < 0 ? 4 : -6), y, 3, 3, '#bc8a7468');
        rect(x + (x < 0 ? 5 : -5), y + 4, 1, 3, '#83546677');
      }
    }
    for (const y of [top + 12, bottom - 14]) {
      for (let x = left + 20; x < right - 15; x += 28) {
        rect(x, y, 10, 2, p.edge + '52');
        rect(x + 2, y + 2, 6, 1, p.light + '38');
      }
    }
  } else if (key === 'choir') {
    for (let x = left + 17; x < right - 10; x += 48) {
      for (const y of [top + 11, bottom - 15]) {
        rect(x, y, 12, 4, '#3e466c88');
        rect(x + 2, y, 8, 1, '#afbadc60');
        for (let k = 0; k < 3; k++) rect(x + 2 + k * 3, y + 2, 1, 3, '#101626a0');
      }
    }
    for (const x of [left + 8, right - 14]) {
      for (let y = top + 26; y < bottom - 20; y += 34) {
        rect(x, y, 6, 12, '#14172b90');
        rect(x, y, 6, 1, p.light + '65');
        rect(x + 2, y + 3, 2, 5, p.edge + '68');
      }
    }
  } else if (key === 'citadel') {
    for (let x = left + 15; x < right - 9; x += 34) {
      for (const y of [top + 9, bottom - 16]) {
        rect(x, y, 10, 7, '#0b0b0f');
        rect(x + 1, y, 8, 1, '#91634b88');
        rect(x + 3, y + 2, 4, 2, '#60403a');
        rect(x + 3, y + 4, 3, 1, '#c7925965');
      }
    }
    for (const x of [left + 8, right - 12]) {
      rect(x, top + 20, 5, o.h - 56, '#0d0d1290');
      for (let y = top + 25; y < bottom - 24; y += 14) {
        rect(x + 1, y, 3, 3, '#93634c77');
        rect(x + 1, y + 1, 1, 1, '#e0b17977');
      }
    }
  } else {
    for (let i = 0; i < 14; i++) {
      const a = (i * TAU) / 14,
        r = Math.min(W, H) * 0.77;
      ctx.save();
      ctx.translate(Math.cos(a) * r, Math.sin(a) * r * 0.8);
      ctx.rotate(a);
      rect(-6, -2, 12, 4, '#735d484d');
      rect(-5, -2, 9, 1, '#e5c68c70');
      rect(0, -1, 1, 3, '#18151c');
      ctx.restore();
    }
    for (const s of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const x = s * (W - 24 - i * 12),
          y = top + 20 + (i % 2) * 8;
        rect(x, y, 7, 4, '#68554e77');
        rect(x + 1, y, 4, 1, '#d6bb8655');
      }
    }
  }
}
function drawLateRoomBase(ctx, o, key, v) {
  const p = lateArtPalette(key),
    t = save.motion ? 0 : G.tAll,
    W = o.w / 2,
    H = o.h / 2;
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.beginPath();
  ctx.rect(-W, -H, o.w, o.h);
  ctx.clip();
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = p.dark + '18';
  ctx.fillRect(-W, -H, o.w, o.h);
  if (key === 'reservoir') {
    ctx.fillStyle = p.mid + '28';
    for (let y = -H + 14; y < H; y += 34) ctx.fillRect(-W, y, o.w, 8);
    ctx.strokeStyle = p.light + '36';
    ctx.lineWidth = 2;
    for (let y = -H + 19; y < H; y += 34) {
      ctx.beginPath();
      for (let x = -W; x < W; x += 16) ctx.lineTo(x, y + Math.sin(x * 0.045 + o.seed + v) * 3);
      ctx.stroke();
    }
    ctx.fillStyle = p.dark;
    ctx.fillRect(-W + 7, -H + 7, o.w - 14, 5);
    ctx.fillStyle = p.edge + '88';
    for (let x = -W + 15; x < W - 10; x += 28) ctx.fillRect(x, -H + 8, 9, 3);
  } else if (key === 'foundry') {
    ctx.fillStyle = '#1b1214aa';
    ctx.fillRect(-W, -H, o.w, o.h);
    ctx.fillStyle = p.mid;
    for (let x = -W + 16; x < W; x += 52) {
      ctx.fillRect(x, -H, 9, o.h);
      ctx.fillStyle = p.edge + '77';
      ctx.fillRect(x + 3, -H, 3, o.h);
      ctx.fillStyle = p.mid;
    }
    ctx.fillStyle = '#0c0c10';
    for (let y = -H + 22; y < H; y += 46) ctx.fillRect(-W, y, o.w, 4);
    ctx.fillStyle = p.hot + '55';
    ctx.fillRect(-W, -H + 7, o.w, 3 + v);
  } else if (key === 'observatory') {
    ctx.strokeStyle = p.edge + '42';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        Math.min(W, H) * (0.35 + i * 0.17),
        Math.min(W, H) * (0.16 + i * 0.09),
        o.seed * 0.3 + i * 0.55,
        0,
        TAU
      );
      ctx.stroke();
    }
    for (let i = 0; i < 18; i++) {
      const x = ((i * 43 + o.seed * 17) % Math.max(1, Math.floor(o.w - 24))) - W + 12,
        y = ((i * 29 + v * 17) % Math.max(1, Math.floor(o.h - 24))) - H + 12;
      ctx.fillStyle = i % 5 ? p.light + '55' : p.hot + '99';
      ctx.fillRect(x, y, i % 5 ? 2 : 3, i % 5 ? 2 : 3);
    }
  } else if (key === 'archive') {
    ctx.fillStyle = '#231e19aa';
    ctx.fillRect(-W, -H, o.w, o.h);
    ctx.fillStyle = p.edge + '34';
    for (let y = -H + 18; y < H; y += 42) ctx.fillRect(-W + 10, y, o.w - 20, 5);
    ctx.fillStyle = p.light + '28';
    for (let x = -W + 17; x < W; x += 37) ctx.fillRect(x, -H + 7, 3, o.h - 14);
    ctx.fillStyle = '#09080a66';
    for (let i = 0; i < 4 + v; i++)
      ctx.fillRect(
        -W + 18 + ((i * 41 + o.seed * 13) % Math.max(20, o.w - 40)),
        -H + 17 + ((i * 31) % Math.max(20, o.h - 34)),
        8 + (i % 3) * 3,
        3
      );
  } else if (key === 'court') {
    ctx.fillStyle = p.mid + '32';
    ctx.fillRect(-W * 0.28, -H, o.w * 0.56, o.h);
    ctx.fillStyle = p.edge + '66';
    ctx.fillRect(-W * 0.28 + 4, -H, o.w * 0.56 - 8, 3);
    ctx.fillRect(-W * 0.28 + 4, H - 4, o.w * 0.56 - 8, 3);
    ctx.fillStyle = p.light + '42';
    for (let y = -H + 14; y < H; y += 24) {
      ctx.fillRect(-3, y, 6, 13);
      ctx.fillRect(-W * 0.28 + 8, y + 4, 8, 3);
      ctx.fillRect(W * 0.28 - 16, y + 4, 8, 3);
    }
    if (v >= 3) {
      ctx.fillStyle = '#130f16';
      ctx.fillRect(-2, -H, 5, o.h);
    }
  } else if (key === 'choir') {
    ctx.fillStyle = p.mid + '24';
    for (let x = -W + 20; x < W; x += 48) ctx.fillRect(x, -H, 12, o.h);
    ctx.strokeStyle = p.light + '36';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(0, H * 0.35, 30 + i * 28 + v * 3, Math.PI, TAU);
      ctx.stroke();
    }
    ctx.fillStyle = p.edge + '55';
    for (let x = -W + 24; x < W; x += 48) {
      ctx.fillRect(x + 3, -H + 7, 6, 10);
      ctx.fillRect(x + 3, H - 17, 6, 10);
    }
  } else if (key === 'citadel') {
    ctx.fillStyle = '#171216bb';
    ctx.fillRect(-W, -H, o.w, o.h);
    ctx.strokeStyle = p.edge + '35';
    ctx.lineWidth = 2;
    for (let x = -W - 20; x < W; x += 54) {
      ctx.beginPath();
      ctx.moveTo(x, -H);
      ctx.lineTo(x + 36, H);
      ctx.stroke();
    }
    ctx.fillStyle = p.mid + '55';
    ctx.fillRect(-W + 7, -H + 7, o.w - 14, 7);
    ctx.fillRect(-W + 7, H - 14, o.w - 14, 7);
    ctx.fillStyle = p.light + '55';
    for (let x = -W + 12; x < W; x += 34) ctx.fillRect(x, -H + 9, 4, 3);
  } else {
    for (let i = 0; i < 9; i++) {
      ctx.save();
      ctx.rotate((i * TAU) / 9 + o.seed * 0.1);
      ctx.fillStyle = (i + v) % 3 ? p.edge + '38' : p.light + '52';
      ctx.fillRect(20, -3, Math.min(W, H) * 0.72, 6);
      ctx.restore();
    }
    ctx.strokeStyle = p.hot + '35';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(W, H) * 0.42 + Math.sin(t + o.seed) * 2, 0, TAU);
    ctx.stroke();
    if (v === 1) {
      ctx.strokeStyle = '#6f80574a';
      for (let x = -W + 19; x < W; x += 38) {
        ctx.beginPath();
        ctx.moveTo(x, H);
        ctx.quadraticCurveTo(x + 12, 0, x - 4, -H);
        ctx.stroke();
      }
    }
  }
  lateRoomInlay(ctx, o, key, v);
  const spots = [
    [-W + 44, -H + 47, 0.82],
    [W - 44, -H + 47, 0.82],
    [-W + 44, H - 38, 0.76],
    [W - 44, H - 38, 0.76],
  ];
  for (let i = 0; i < spots.length; i++) {
    if (((i + o.seed + v) & 1) === 0 || i === v % 4)
      lateProp(
        ctx,
        key,
        (v + i + o.seed) % 5,
        spots[i][0],
        spots[i][1],
        spots[i][2],
        o.seed * 11 + i * 7
      );
  }
  lateProp(ctx, key, v, 0, Math.min(9, H * 0.12), 1, o.seed * 19 + v);
  ctx.restore();
}
drawLateDecor = function (ctx, o) {
  drawLateRoomBase(ctx, o, o.type, lateVariant());
};

function drawLateTileCharacter(ctx) {
  const w = G.world,
    key = w.lateKey,
    p = lateArtPalette(key),
    v = lateVariant(),
    x0 = Math.max(0, Math.floor(G.cam.x / TILE) - 1),
    x1 = Math.min(w.W - 1, Math.ceil((G.cam.x + G.w) / TILE) + 1),
    y0 = Math.max(0, Math.floor(G.cam.y / TILE) - 1),
    y1 = Math.min(w.H - 1, Math.ceil((G.cam.y + G.h) / TILE) + 1);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  for (let ty = y0; ty <= y1; ty++)
    for (let tx = x0; tx <= x1; tx++) {
      const i = ty * w.W + tx,
        h = ((tx * 1597334677) ^ (ty * 3812015801) ^ (G.floor * 2654435761)) >>> 0,
        x = tx * TILE,
        y = ty * TILE;
      if (w.grid[i] === 1) {
        if (h % 9 !== v % 4) continue;
        if (key === 'reservoir') {
          ctx.fillStyle = p.light + '3d';
          ctx.fillRect(x + 5, y + 25, 18, 2);
          ctx.fillRect(x + 10, y + 22, 13, 2);
          ctx.fillStyle = p.mid + '77';
          ctx.fillRect(x + 28, y + 6, 3, 20);
        } else if (key === 'foundry') {
          ctx.fillStyle = '#08090d99';
          ctx.fillRect(x + 7, y + 8, 3, 19);
          ctx.fillRect(x + 10, y + 24, 13, 3);
          ctx.fillStyle = p.light + '66';
          ctx.fillRect(x + 9, y + 10, 2, 12);
        } else if (key === 'observatory') {
          ctx.fillStyle = p.light + '66';
          ctx.fillRect(x + 7, y + 9, 3, 3);
          ctx.fillRect(x + 24, y + 25, 2, 2);
          ctx.fillStyle = p.hot + '77';
          ctx.fillRect(x + 15, y + 16, 4, 2);
          ctx.fillRect(x + 16, y + 15, 2, 4);
        } else if (key === 'archive') {
          ctx.fillStyle = p.light + '66';
          ctx.fillRect(x + 5, y + 8, 12, 8);
          ctx.fillStyle = p.edge + '88';
          ctx.fillRect(x + 7, y + 10, 8, 1);
          ctx.fillRect(x + 7, y + 13, 6, 1);
          ctx.fillStyle = '#11101877';
          ctx.fillRect(x + 25, y + 24, 6, 4);
        } else if (key === 'court') {
          ctx.fillStyle = p.light + '55';
          ctx.fillRect(x + 7, y + 9, 7, 3);
          ctx.fillRect(x + 24, y + 21, 4, 6);
          ctx.fillStyle = p.edge + '77';
          ctx.fillRect(x + 9, y + 8, 3, 2);
        } else if (key === 'choir') {
          ctx.fillStyle = p.light + '55';
          ctx.fillRect(x + 5, y + 15, 18, 2);
          ctx.fillRect(x + 10, y + 19, 15, 2);
          ctx.fillStyle = p.hot + '77';
          ctx.fillRect(x + 27, y + 8, 2, 7);
        } else if (key === 'citadel') {
          ctx.fillStyle = '#08090daa';
          ctx.fillRect(x + 7, y + 7, 13, 3);
          ctx.fillRect(x + 18, y + 10, 3, 12);
          ctx.fillStyle = p.edge + '66';
          ctx.fillRect(x + 8, y + 6, 9, 1);
        } else {
          ctx.fillStyle = (h >> 4) & 1 ? p.light + '66' : p.edge + '66';
          ctx.fillRect(x + 7, y + 9, 5, 3);
          ctx.fillRect(x + 24, y + 22, 3, 6);
          ctx.fillStyle = p.hot + '55';
          ctx.fillRect(x + 15, y + 15, 3, 3);
        }
      } else {
        const edge =
          !isSolidTile(w, tx, ty + 1) || !isSolidTile(w, tx - 1, ty) || !isSolidTile(w, tx + 1, ty);
        if (!edge || h % 13 !== v % 5) continue;
        if (key === 'reservoir') {
          ctx.fillStyle = p.dark;
          ctx.fillRect(x + 4, y + 7, 28, 6);
          ctx.fillStyle = p.edge;
          ctx.fillRect(x + 6, y + 9, 24, 2);
          ctx.fillStyle = p.light;
          ctx.fillRect(x + 9, y + 6, 4, 3);
        } else if (key === 'foundry') {
          ctx.fillStyle = p.dark;
          ctx.fillRect(x + 7, y + 5, 8, 27);
          ctx.fillStyle = p.edge;
          ctx.fillRect(x + 9, y + 7, 3, 22);
          ctx.fillStyle = p.hot;
          ctx.fillRect(x + 8, y + 24, 5, 3);
        } else if (key === 'observatory') {
          ctx.strokeStyle = p.edge + '88';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x + 18, y + 18, 10, 0.4, 4.8);
          ctx.stroke();
          ctx.fillStyle = p.light;
          ctx.fillRect(x + 23, y + 8, 3, 3);
        } else if (key === 'archive') {
          ctx.fillStyle = p.edge + '88';
          ctx.fillRect(x + 5, y + 8, 26, 4);
          ctx.fillStyle = p.light + '77';
          for (let k = 0; k < 4; k++) ctx.fillRect(x + 7 + k * 6, y + 14, 4, 10 + (k % 2) * 3);
        } else if (key === 'court') {
          ctx.fillStyle = p.mid;
          ctx.fillRect(x + 8, y + 4, 20, 28);
          ctx.fillStyle = p.edge;
          ctx.fillRect(x + 11, y + 6, 3, 23);
          ctx.fillStyle = p.light;
          ctx.fillRect(x + 18, y + 10, 6, 4);
        } else if (key === 'choir') {
          ctx.fillStyle = p.dark;
          ctx.fillRect(x + 8, y + 5, 20, 27);
          ctx.fillStyle = p.edge;
          for (let k = 0; k < 3; k++) ctx.fillRect(x + 11 + k * 6, y + 8, 3, 20);
          ctx.fillStyle = p.light;
          ctx.fillRect(x + 13, y + 6, 12, 3);
        } else if (key === 'citadel') {
          ctx.fillStyle = '#090a0e';
          ctx.fillRect(x + 5, y + 11, 27, 12);
          ctx.fillStyle = p.edge;
          ctx.fillRect(x + 9, y + 14, 19, 5);
          ctx.fillStyle = p.light;
          ctx.fillRect(x + 12, y + 15, 4, 2);
        } else {
          ctx.fillStyle = p.edge + '88';
          ctx.fillRect(x + 8, y + 5, 5, 27);
          ctx.fillRect(x + 22, y + 9, 4, 21);
          ctx.fillStyle = p.hot;
          ctx.fillRect(x + 10, y + 7, 3, 7);
          ctx.fillRect(x + 23, y + 21, 2, 5);
        }
      }
    }
  ctx.restore();
}
const beforeLateTileCharacter = drawPixelFloorDetails;
drawPixelFloorDetails = function (ctx) {
  beforeLateTileCharacter(ctx);
  if (G.world?.region === 'late') drawLateTileCharacter(ctx);
};

function drawLateTorches(ctx) {
  const w = G.world,
    key = w.lateKey,
    p = lateArtPalette(key),
    cam = G.cam,
    t = save.motion ? 0 : G.tAll,
    v = lateVariant();
  const glow =
    {
      reservoir: 'teal',
      foundry: 'ember',
      observatory: 'cyan',
      archive: 'gold',
      court: 'magenta',
      choir: 'blue',
      citadel: 'ember',
      heart: 'gold',
    }[key] || 'ember';
  for (const o of w.torches || []) {
    if (o.x < cam.x - 80 || o.x > cam.x + G.w + 80 || o.y < cam.y - 90 || o.y > cam.y + G.h + 90)
      continue;
    const x = Math.round(o.x),
      y = Math.round(o.y),
      f = 0.94 + Math.sin(t * 10 + o.s) * 0.05;
    glowImg(glow, x, y - 11, 46 * f, 0.46);
    ctx.save();
    ctx.translate(x, y);
    ctx.imageSmoothingEnabled = false;
    if (key === 'reservoir') {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-5, -40, 10, 14);
      ctx.fillRect(-15, -29, 30, 5);
      ctx.fillRect(-16, -25, 5, 35);
      ctx.fillRect(11, -25, 5, 35);
      ctx.fillRect(-15, 10, 30, 6);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-12, -23, 24, 29);
      ctx.fillStyle = '#6db8c26b';
      ctx.fillRect(-9, -21, 18, 24);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-3, -11, 6, 12);
      ctx.fillStyle = '#efffc7';
      ctx.fillRect(-1, -9, 3, 7);
      ctx.fillStyle = p.light;
      ctx.fillRect(-19, 15, 38, 3);
      if (!save.motion) {
        ctx.fillStyle = p.light;
        ctx.fillRect(
          -9 + Math.round(Math.sin(t * 3 + o.s) * 5),
          20 + Math.round((t * 12 + o.s) % 8),
          2,
          3
        );
      }
    } else if (key === 'foundry') {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-5, -39, 10, 13);
      ctx.fillRect(-17, -28, 34, 7);
      ctx.fillRect(-17, -21, 6, 34);
      ctx.fillRect(11, -21, 6, 34);
      ctx.fillRect(-17, 13, 34, 6);
      ctx.fillStyle = p.edge;
      for (let k = -8; k <= 8; k += 8) ctx.fillRect(k - 2, -19, 4, 28);
      ctx.fillStyle = '#8e3528';
      ctx.fillRect(-9, -15, 18, 23);
      ctx.fillStyle = '#ff6b36';
      ctx.fillRect(-6, -9, 12, 16);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-3, -13, 6, 17);
      ctx.fillStyle = '#fff2b2';
      ctx.fillRect(-1, -8, 2, 8);
    } else if (key === 'observatory') {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-4, -42, 8, 17);
      ctx.fillStyle = p.edge;
      ctx.beginPath();
      ctx.moveTo(0, -31);
      ctx.lineTo(17, -13);
      ctx.lineTo(0, 11);
      ctx.lineTo(-17, -13);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#6ecbe266';
      ctx.beginPath();
      ctx.moveTo(0, -27);
      ctx.lineTo(11, -13);
      ctx.lineTo(0, 5);
      ctx.lineTo(-11, -13);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = p.hot;
      ctx.fillRect(-3, -17, 6, 11);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, -15, 2, 7);
      ctx.strokeStyle = p.light;
      ctx.lineWidth = 2;
      ctx.strokeRect(-18, 12, 36, 4);
    } else if (key === 'archive') {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-4, -37, 8, 18);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-17, -23, 34, 5);
      ctx.fillRect(-14, -18, 28, 29);
      ctx.fillStyle = '#bca87a66';
      ctx.fillRect(-10, -15, 20, 20);
      ctx.fillStyle = '#7c5430';
      ctx.fillRect(-5, -8, 10, 15);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-3, -16, 6, 12);
      ctx.fillStyle = '#fff3c4';
      ctx.fillRect(-1, -13, 2, 7);
      ctx.fillStyle = p.light;
      ctx.fillRect(-18, 12, 36, 4);
      if (v >= 2) {
        ctx.fillStyle = '#ddd0aa';
        ctx.fillRect(14, -12, 9, 6);
        ctx.fillStyle = p.mid;
        ctx.fillRect(16, -10, 5, 1);
      }
    } else if (key === 'court') {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-3, -40, 6, 43);
      ctx.fillRect(-18, 1, 36, 5);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-1, -37, 3, 38);
      for (const s of [-1, 0, 1]) {
        ctx.fillStyle = p.mid;
        ctx.fillRect(s * 12 - 4, -3 - Math.abs(s) * 5, 8, 12);
        ctx.fillStyle = p.light;
        ctx.fillRect(s * 12 - 2, -13 - Math.abs(s) * 5, 4, 11);
        ctx.fillStyle = p.hot;
        ctx.fillRect(s * 12 - 1, -15 - Math.abs(s) * 5, 2, 7);
      }
      ctx.fillStyle = p.light;
      ctx.fillRect(-21, 12, 42, 4);
    } else if (key === 'choir') {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-4, -42, 8, 13);
      lateChain(ctx, 0, -31, 12, p);
      ctx.fillStyle = p.edge;
      ctx.beginPath();
      ctx.moveTo(-17, -19);
      ctx.lineTo(17, -19);
      ctx.lineTo(11, 8);
      ctx.lineTo(-11, 8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = p.light;
      ctx.fillRect(-10, -16, 7, 19);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-2, -11, 4, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, -8, 2, 6);
      ctx.fillStyle = p.dark;
      ctx.fillRect(-19, 9, 38, 5);
    } else if (key === 'citadel') {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-6, -39, 12, 16);
      ctx.fillRect(-18, -25, 36, 39);
      ctx.fillStyle = p.mid;
      ctx.fillRect(-13, -20, 26, 28);
      ctx.fillStyle = '#0a090c';
      ctx.fillRect(-10, -13, 20, 10);
      ctx.fillStyle = '#c7472d';
      ctx.fillRect(-7, -11, 14, 6);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-3, -10, 6, 4);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-20, 14, 40, 5);
      for (let k = -13; k <= 13; k += 13) ctx.fillRect(k - 2, -23, 4, 35);
    } else {
      ctx.fillStyle = p.dark;
      ctx.fillRect(-4, -42, 8, 16);
      ctx.fillStyle = p.edge;
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((i * TAU) / 5 + t * 0.025);
        ctx.fillRect(-3, -28, 6, 24);
        ctx.restore();
      }
      ctx.fillStyle = p.light;
      ctx.beginPath();
      ctx.arc(0, -9, 12, 0, TAU);
      ctx.fill();
      ctx.fillStyle = p.hot;
      ctx.beginPath();
      ctx.arc(0, -9, 6, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#fffbd5';
      ctx.fillRect(-2, -13, 4, 8);
      ctx.fillStyle = p.dark;
      ctx.fillRect(-18, 13, 36, 5);
    }
    if (key === 'reservoir' || key === 'foundry' || key === 'archive' || key === 'citadel') {
      ctx.fillStyle = p.light;
      for (const x of [-13, 12]) for (const y of [-21, 11]) ctx.fillRect(x, y, 2, 1);
      ctx.fillStyle = p.dark;
      for (let i = 0; i < 4; i++) ctx.fillRect(-9 + i * 5, -26, 2, 2);
      ctx.fillStyle = p.light + 'b0';
      ctx.fillRect(-8, -17, 1, 7);
      ctx.fillStyle = p.edge;
      ctx.fillRect(-11, 15, 22, 1);
    } else if (key === 'observatory') {
      ctx.fillStyle = '#f1ffffaa';
      ctx.fillRect(-6, -19, 1, 5);
      ctx.fillRect(-5, -21, 1, 2);
      ctx.fillStyle = p.dark;
      ctx.fillRect(5, -9, 1, 5);
      ctx.fillStyle = p.hot;
      ctx.fillRect(-14, 13, 2, 1);
      ctx.fillRect(12, 13, 2, 1);
    } else if (key === 'court') {
      ctx.fillStyle = p.hot;
      ctx.fillRect(-16, 3, 32, 1);
      for (const x of [-12, 0, 12]) {
        ctx.fillStyle = '#eee0c7';
        ctx.fillRect(x - 3, -4 - (Math.abs(x) * 5) / 12, 2, 2);
        ctx.fillStyle = p.dark;
        ctx.fillRect(x + 1, 5, 2, 3);
      }
    } else if (key === 'choir') {
      ctx.fillStyle = p.hot;
      ctx.fillRect(-11, -18, 22, 1);
      ctx.fillStyle = p.mid;
      ctx.fillRect(-10, -15, 20, 1);
      ctx.fillStyle = p.light;
      ctx.fillRect(-8, 5, 16, 1);
      ctx.fillStyle = p.dark;
      ctx.fillRect(6, -14, 2, 17);
    } else {
      ctx.fillStyle = p.hot;
      for (let i = 0; i < 5; i++) {
        const a = (i * TAU) / 5;
        ctx.fillRect(Math.round(Math.cos(a) * 14), -9 + Math.round(Math.sin(a) * 14), 2, 2);
      }
      ctx.fillStyle = p.edge;
      ctx.fillRect(-14, 14, 28, 1);
    }
    ctx.restore();
  }
}
const detailedEarlyTorches = drawTorches;
drawTorches = function (ctx) {
  if (G.world?.region === 'late') drawLateTorches(ctx);
  else detailedEarlyTorches(ctx);
};

const beforeBlessingFloorSetup = setupFloor;
setupFloor = function (f) {
  beforeBlessingFloorSetup(f);
  initCombat();
  if (G.run?.up.reserve) G.player.ammo = G.player.magSize;
};

const beforeMasteryMenuBg = drawMenuBg;
drawMenuBg = function () {
  beforeMasteryMenuBg();
  const x = G.ctx,
    t = save.motion ? 0 : G.tAll;
  x.save();
  x.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
  x.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 18; i++) {
    const px = G.w * (0.49 + ((i * 71) % 47) / 100),
      py = 40 + ((i * 137) % Math.max(100, G.h - 80)),
      a = 0.08 + 0.08 * Math.sin(t * 1.3 + i);
    x.fillStyle = 'rgba(240,201,121,' + Math.max(0.02, a) + ')';
    x.fillRect(Math.round(px), Math.round(py), i % 5 === 0 ? 3 : 2, i % 5 === 0 ? 3 : 2);
  }
  x.restore();
};

function wireMastery() {
  refreshTreeEss();
}
