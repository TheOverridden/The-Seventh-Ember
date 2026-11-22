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
  ctx.fillRect(x + 2, y, w - 4, 2);
  ctx.fillRect(x, y + 2, 2, h - 4);
  ctx.fillStyle = dark;
  ctx.fillRect(x + w - 3, y + 3, 3, h - 3);
  ctx.fillRect(x + 3, y + h - 3, w - 3, 3);
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
    paintLateFurnishingDetails(c, key, kind);
    if (lateFurnishingDetails.size >= 120) lateFurnishingDetails.clear();
    lateFurnishingDetails.set(cacheKey, layer);
  }
  ctx.drawImage(layer, -64, -76);
}
function paintLateFurnishingDetails(c, key, kind) {
  const p = lateArtPalette(key),
    px = (x, y, w, h, color) => {
      c.fillStyle = color;
      c.fillRect(x, y, w, h);
    },
    foot = (w) => {
      px(-Math.floor(w / 2), 15, w, 4, p.dark);
      px(-Math.floor(w / 2) + 3, 14, w - 6, 2, p.mid);
    },
    pipe = (x, y, h) => {
      px(x - 4, y, 8, h, p.dark);
      px(x - 3, y, 5, h, p.mid);
      px(x - 3, y + 2, 2, h - 4, p.edge);
      for (const yy of [y + 4, y + h - 7]) {
        px(x - 5, yy, 10, 4, p.dark);
        px(x - 4, yy, 8, 2, p.edge);
      }
    },
    bell = (x, y, w, h) => {
      px(x - 2, y - 3, 4, 4, p.dark);
      for (let row = 0; row < h; row += 2) {
        const waist = Math.max(3, Math.round(w * 0.23)),
          half = Math.round(waist + (w / 2 - waist) * Math.pow(row / h, 2));
        px(x - half, y + row, half * 2, 2, p.edge);
        px(x - half, y + row, Math.max(2, Math.floor(half * 0.45)), 2, p.light);
        px(x + half - 3, y + row, 3, 2, p.mid);
      }
      px(x - w / 2 - 1, y + h - 1, w + 2, 4, p.dark);
      px(x - w / 2 + 1, y + h - 1, w - 2, 2, p.edge);
      px(x - 1, y + h + 2, 3, 3, p.light);
    };
  if (key === 'reservoir') {
    if (kind === 0) {
      px(-22, -17, 5, 6, p.edge);
      px(17, -17, 5, 6, p.mid);
      foot(49);
    } else if (kind === 1) {
      pipe(-12, -39, 51);
      pipe(12, -34, 46);
      px(-16, -23, 9, 7, '#466f68');
      px(9, -12, 7, 6, '#3e645c');
      foot(45);
    } else if (kind === 2) {
      px(-17, -12, 34, 4, p.dark);
      px(-15, -11, 30, 3, p.edge);
      px(-13, -8, 26, 2, '#294653');
      px(-12, -5, 4, 10, p.edge);
      px(9, -5, 3, 9, p.dark);
    } else if (kind === 3) {
      px(-21, 6, 9, 6, p.mid);
      px(-20, 6, 7, 2, p.edge);
      foot(51);
    } else {
      bell(0, -22, 31, 22);
    }
  } else if (key === 'foundry') {
    if (kind === 0) {
      px(-20, -23, 40, 6, p.edge);
      px(-17, -24, 34, 2, p.light);
      px(-13, -17, 26, 5, p.mid);
      px(-4, 16, 8, 5, p.dark);
    } else if (kind === 1 || kind === 4) {
      const top = kind === 4 ? -26 : -8,
        height = kind === 4 ? 32 : 16;
      for (const x of [-16, -2, 12]) {
        px(x, top, 4, height, '#201618');
        px(x, top, 2, height - 3, '#9b5c43');
      }
      foot(55);
    } else if (kind === 2) {
      for (let i = 0; i < 3; i++) {
        const x = -12 + i * 15;
        pipe(x, -32, 28);
        px(x - 6, -12, 12, 5, p.dark);
        px(x - 5, -12, 10, 2, p.edge);
      }
    } else {
      for (const x of [-15, 15]) {
        pipe(x, -25, 40);
        px(x - 7, -10, 14, 12, p.dark);
        px(x - 5, -8, 10, 8, p.edge);
        px(x - 2, -6, 4, 4, '#382b28');
      }
    }
  } else if (key === 'observatory') {
    if (kind === 0) foot(34);
    else if (kind === 1) {
      px(-7, -42, 14, 12, p.edge);
      px(-4, -40, 9, 8, '#9bc6d1');
      px(-3, -39, 3, 5, '#e7fbff');
      foot(28);
    } else if (kind === 2) {
      for (const side of [-1, 1]) {
        c.save();
        c.translate(side * 15, -9 + side * 5);
        c.rotate(side * 0.28);
        px(-6, -13, 3, 22, '#b9dbe3');
        px(4, -12, 2, 22, '#4f7c94');
        c.restore();
      }
      foot(46);
    } else if (kind === 3) foot(49);
    else {
      c.save();
      c.rotate(-0.35);
      px(-14, -11, 4, 21, p.mid);
      px(5, -11, 4, 21, p.mid);
      px(11, -8, 7, 15, p.edge);
      c.restore();
      foot(36);
    }
  } else if (key === 'archive') {
    if (kind === 0) {
      for (let i = 0; i < 3; i++) {
        const x = -19 + i * 14;
        px(x, -9, 10, 17, '#352c26');
        px(x + 2, -6, 6, 3, p.light);
        px(x + 1, 3, 8, 2, p.mid);
      }
    } else if (kind === 1) {
      const tones = ['#a78a5b', '#82775b', '#a09070'];
      for (let row = 0; row < 3; row++) {
        const y = -34 + row * 13;
        for (let i = 0; i < 6; i++) {
          const x = -22 + i * 7,
            h = 9 - (i % 3);
          px(x, y + (i % 3), 5, h, tones[(row + i) % 3]);
          if (i % 3 === 0) px(x, y + (i % 3), 2, h, p.edge);
        }
        px(-24, y + 10, 48, 2, p.dark);
      }
    } else if (kind === 2) {
      px(-20, -17, 11, 5, '#806348');
      px(-19, -16, 9, 2, '#d8c6a0');
      px(-7, -20, 13, 7, '#d9ccaa');
      px(-5, -18, 8, 2, '#847256');
      px(10, -19, 6, 6, '#2f2a24');
    } else if (kind === 3) {
      for (let i = 0; i < 5; i++) {
        const x = -23 + i * 10,
          h = 31 - (i % 3) * 7;
        px(x, -28, 7, 3, p.dark);
        px(x + 1, -24, 5, h - 4, '#b6a17b');
        px(x + 1, -24, 2, h - 4, '#d6c59e');
        px(x, -27 + h, 7, 2, p.mid);
      }
    } else {
      px(-19, -17, 17, 22, '#dacda6');
      px(2, -17, 17, 22, '#c4b48c');
      px(-1, -17, 3, 22, '#7d6e52');
      for (const y of [-12, -5]) {
        px(-14, y, 9, 2, '#8b795a');
        px(5, y, 10, 2, '#8b795a');
      }
      foot(47);
    }
  } else if (key === 'court') {
    if (kind < 2) {
      px(-24, -11, 48, 4, '#5e3745');
      for (let i = 0; i < 4; i++) {
        const x = -18 + i * 12;
        px(x - 1, -14, 9, 4, '#7f655d');
        px(x, -15, 7, 3, '#e2c6b0');
        if (i % 2 === 0) {
          px(x + 2, -21, 4, 4, '#bca17a');
          px(x + 3, -17, 2, 3, '#92705b');
        }
      }
    } else if (kind === 2) {
      px(-15, -32, 30, 38, '#311e2a');
      px(-8, -28, 16, 12, '#a67c86');
      px(4, -27, 4, 11, '#75525f');
      px(-5, -24, 3, 2, '#593a4e');
      px(2, -24, 3, 2, '#593a4e');
      px(-3, -16, 6, 5, '#b28a8b');
      px(-11, -11, 23, 14, '#704853');
      px(-9, -10, 4, 12, '#956674');
    } else {
      for (const x of [-15, 15]) {
        px(x - 7, -18, 14, 25, kind === 3 && x > 0 ? '#4c3658' : '#623549');
        px(x - 6, -17, 3, 22, '#a1697b');
        px(x + 3, -17, 3, 23, '#3d263a');
        px(x - 2, -10, 5, 4, '#bc8b9c');
      }
    }
  } else if (key === 'choir') {
    if (kind === 0) {
      for (let i = 0; i < 5; i++) {
        const x = -20 + i * 12,
          h = 28 + (i % 3) * 8;
        pipe(x, -h, h + 14);
        px(x - 2, -h + 6, 4, 4, p.dark);
      }
    } else if (kind === 1) bell(0, -24, 34, 24);
    else if (kind === 4) {
      for (let i = 0; i < 3; i++) bell(-14 + i * 14, -24 + i * 4, 16, 13);
    } else if (kind === 2) {
      for (let i = 0; i < 4; i++) {
        const x = -28 + i * 18,
          y = -10 - i * 9;
        px(x + 1, y, 13, 4, p.dark);
        px(x + 2, y, 10, 2, p.edge);
      }
    } else foot(43);
  } else if (key === 'citadel') {
    if (kind === 0) {
      for (let i = 0; i < 4; i++) {
        c.save();
        c.translate(-23 + i * 15, -7);
        c.rotate(i % 2 ? 0.18 : -0.12);
        px(-3, -23, 5, 31, '#623b35');
        px(-3, -21, 2, 27, '#996347');
        px(-4, -17, 8, 4, p.dark);
        c.restore();
      }
    } else if (kind === 1) {
      px(-3, -11, 7, 7, p.dark);
      px(-1, -10, 3, 4, p.edge);
    } else if (kind === 2) {
      for (let i = 0; i < 3; i++) {
        const x = -24 + i * 18,
          y = -8 - (i % 2) * 10;
        px(x, y, 11, 21, '#432829');
        px(x, y + 1, 3, 17, '#a75e47');
        px(x + 4, y + 7, 6, 3, '#251a1e');
      }
    } else {
      for (let i = 0; i < 3; i++) {
        const x = -17 + i * 16;
        px(x, -14, 7, 18, '#53302e');
        px(x, -14, 3, 15, '#a66048');
      }
    }
  } else {
    if (kind === 0) {
      for (let i = 0; i < 5; i++) {
        c.save();
        c.translate(-25 + i * 13, -8 + (i % 2) * 5);
        c.rotate((i - 2) * 0.12);
        px(-3, -24, 6, 33, p.mid);
        px(-3, -22, 3, 28, p.edge);
        px(-1, -21, 2, 11, p.light);
        c.restore();
      }
    } else if (kind === 2) {
      for (let i = 0; i < 4; i++) px(-22, -26 + i * 11, 32 + i * 4, 2, '#b8955d');
    } else if (kind === 3) {
      px(-8, -23, 16, 30, '#211e21');
      px(-5, -19, 10, 23, '#6f5c41');
      px(-3, -17, 6, 17, '#b7935e');
      px(-1, -15, 2, 11, '#ffedb5');
    } else if (kind === 4) {
      px(-23, -2, 46, 4, p.dark);
      px(-21, -2, 42, 2, p.edge);
      px(-19, 2, 38, 10, p.mid);
      px(-17, 3, 4, 7, p.edge);
      px(14, 3, 3, 7, p.dark);
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
      for (let x = left + 8; x < right - 8; x += 20) rect(x, y + 1, 4, 4, p.edge + '70');
    }
    for (const x of [left + 4, right - 11]) {
      for (let y = top + 27; y < bottom - 22; y += 32) {
        rect(x, y, 7, 10, '#33534b55');
        rect(x + 2, y + 2, 3, 2, '#7eb7a064');
        rect(x + 3, y + 5, 3, 4, '#1c34345c');
      }
    }
    for (let i = 0; i < 3; i++) {
      const x = -W + 23 + ((i * 71 + o.seed * 17) % Math.max(1, o.w - 46));
      const y = -H + 30 + ((i * 43 + o.seed * 11) % Math.max(1, o.h - 60));
      rect(x, y, 17, 2, p.light + '28');
    }
  } else if (key === 'foundry') {
    for (let x = left + 13; x < right - 10; x += 52) {
      for (const y of [top + 8, bottom - 14]) {
        rect(x, y, 12, 6, '#101014');
        rect(x + 1, y, 10, 2, '#b7734438');
        for (let k = 0; k < 2; k++) rect(x + 2 + k * 5, y + 2, 2, 3, '#814b344c');
      }
      for (const y of [top + 21, bottom - 26]) {
        rect(x + 2, y, 3, 3, '#0d0c10');
      }
    }
    for (const x of [left + 5, right - 15]) {
      for (let y = top + 34; y < bottom - 18; y += 31) {
        rect(x, y, 10, 2, '#65473577');
        rect(x + 4, y + 3, 5, 2, '#a35c3448');
      }
    }
  } else if (key === 'observatory') {
    for (let i = 0; i < 12; i++) {
      const a = (i * TAU) / 12,
        r = Math.min(W, H) * 0.78;
      const x = Math.round(Math.cos(a) * r),
        y = Math.round(Math.sin(a) * r * 0.72);
      rect(x, y, 3, 3, p.edge + (i % 3 ? '48' : '70'));
    }
    for (const s of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const x = s * (W - 23 - i * 12),
          y = top + 19 + i * 6;
        rect(x, y, 6, 2, p.light + '38');
      }
    }
    for (let x = left + 18; x < right - 10; x += 30) {
      rect(x, bottom - 8, 7, 3, p.mid + 'a0');
    }
  } else if (key === 'archive') {
    for (const y of [top + 7, bottom - 15]) {
      rect(left + 6, y, o.w - 26, 7, '#15130f70');
      rect(left + 6, y, o.w - 26, 2, '#bba67838');
      for (let x = left + 10; x < right - 13; x += 36) {
        rect(x, y + 3, 11, 2, '#78644b55');
      }
    }
    for (let i = 0; i < 3; i++) {
      const x = left + 18 + ((i * 67 + o.seed * 7) % Math.max(1, o.w - 50));
      const y = i & 1 ? bottom - 30 - i * 3 : top + 24 + i * 3;
      rect(x, y + 2, 12, 7, '#09090965');
      rect(x - 1, y, 11, 7, '#b9aa7b80');
      rect(x + 1, y + 2, 6, 2, '#584e3b88');
    }
  } else if (key === 'court') {
    const rx = Math.round(W * 0.28);
    for (const x of [-rx + 2, rx - 3]) {
      rect(x, top + 2, 2, o.h - 18, '#d3ac7c48');
      for (let y = top + 14; y < bottom - 9; y += 36) {
        rect(x + (x < 0 ? 4 : -6), y, 3, 3, '#bc8a7468');
      }
    }
    for (const y of [top + 12, bottom - 14]) {
      for (let x = left + 20; x < right - 15; x += 28) {
        rect(x, y, 10, 2, p.edge + '52');
      }
    }
  } else if (key === 'choir') {
    for (let x = left + 17; x < right - 10; x += 48) {
      for (const y of [top + 11, bottom - 15]) {
        rect(x, y, 12, 4, '#3e466c88');
        rect(x + 2, y, 8, 2, '#afbadc38');
        for (let k = 0; k < 2; k++) rect(x + 2 + k * 5, y + 2, 2, 3, '#10162688');
      }
    }
    for (const x of [left + 8, right - 14]) {
      for (let y = top + 26; y < bottom - 20; y += 34) {
        rect(x, y, 6, 12, '#14172b90');
        rect(x, y, 6, 2, p.edge + '58');
      }
    }
  } else if (key === 'citadel') {
    for (let x = left + 15; x < right - 9; x += 34) {
      for (const y of [top + 9, bottom - 16]) {
        rect(x, y, 10, 7, '#0b0b0f');
        rect(x + 1, y, 8, 2, '#91634b60');
        rect(x + 3, y + 3, 4, 2, '#60403a');
      }
    }
    for (const x of [left + 8, right - 12]) {
      rect(x, top + 20, 5, o.h - 56, '#0d0d1290');
      for (let y = top + 25; y < bottom - 24; y += 28) {
        rect(x + 1, y, 3, 3, '#93634c77');
      }
    }
  } else {
    for (let i = 0; i < 8; i++) {
      const a = (i * TAU) / 8,
        r = Math.min(W, H) * 0.77;
      ctx.save();
      ctx.translate(Math.cos(a) * r, Math.sin(a) * r * 0.8);
      ctx.rotate(a);
      rect(-6, -2, 12, 4, '#735d484d');
      rect(-5, -2, 9, 2, '#e5c68c48');
      ctx.restore();
    }
    for (const s of [-1, 1]) {
      for (let i = 0; i < 2; i++) {
        const x = s * (W - 24 - i * 12),
          y = top + 20 + (i % 2) * 8;
        rect(x, y, 7, 4, '#68554e77');
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
function drawLateDecor(ctx, o) {
  drawLateRoomBase(ctx, o, o.type, lateVariant());
}

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
    if (key === 'reservoir' || key === 'archive') {
      ctx.fillStyle = p.light + '80';
      ctx.fillRect(-8, -18, 2, 8);
    } else if (key === 'observatory') {
      ctx.fillStyle = '#cde8ed88';
      ctx.fillRect(-7, -19, 2, 6);
    } else if (key === 'court' || key === 'choir') {
      ctx.fillStyle = p.edge;
      ctx.fillRect(-10, 4, 20, 2);
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
