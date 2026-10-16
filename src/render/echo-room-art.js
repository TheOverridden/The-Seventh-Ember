const echoRoomSurfaces = new Map();

function echoPixel(c, color, x, y, w, h) {
  c.fillStyle = color;
  c.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}

function echoTimber(c, x, y, w, h, vertical = false) {
  echoPixel(c, '#201e20', x + 3, y + 4, w, h);
  echoPixel(c, '#6b503b', x, y, w, h);
  echoPixel(c, '#ad8659', x, y, w, 2);
  echoPixel(c, '#856246', x + 2, y + 2, 2, h - 3);
  echoPixel(c, '#3e312a', x + w - 3, y + 3, 3, h - 3);
  if (vertical) {
    for (let i = 7; i < w - 4; i += 8) echoPixel(c, '#4a3b2d', x + i, y + 5, 1, h - 9);
  } else {
    for (let i = 7; i < h - 3; i += 7) {
      echoPixel(c, '#4a3b2d', x + 6, y + i, w - 15, 1);
      echoPixel(c, '#98774e', x + 12, y + i - 1, Math.max(2, w * 0.3), 1);
    }
  }
  for (const px of [x + 4, x + w - 6]) {
    echoPixel(c, '#c3ad7e', px, y + 4, 2, 2);
    echoPixel(c, '#282a2a', px + 1, y + h - 6, 2, 2);
  }
  if (w >= 40 && h >= 12) {
    const knotX = x + Math.round(w * 0.72),
      knotY = y + Math.round(h * 0.55);
    echoPixel(c, '#4f3c2b', knotX - 4, knotY - 2, 8, 1);
    echoPixel(c, '#40342a', knotX - 6, knotY - 1, 3, 2);
    echoPixel(c, '#be9561', knotX + 3, knotY - 1, 3, 2);
    echoPixel(c, '#a17a4e', knotX - 3, knotY + 2, 7, 1);
    echoPixel(c, '#332d27', x + w - 11, y + 2, 1, 4);
    echoPixel(c, '#ceab74', x + 5, y + 2, 8, 1);
  }
}

function echoMasonry(c, p, x, y, w, h, seed = 0) {
  echoPixel(c, '#151b20', x, y, w, h);
  let row = 0;
  for (let yy = y; yy < y + h; yy += 22, row++) {
    for (let xx = x - (row % 2) * 30; xx < x + w; xx += 61) {
      const left = Math.max(x, xx),
        right = Math.min(x + w, xx + 59),
        bh = Math.min(20, y + h - yy);
      if (right <= left) continue;
      echoPixel(
        c,
        (row + seed + Math.floor(xx / 61)) % 3 ? p.wall : p.floor,
        left,
        yy,
        right - left,
        bh
      );
      echoPixel(c, p.line, left + 1, yy + 1, right - left - 2, 1);
      echoPixel(c, '#10191c', left, yy + bh - 2, right - left, 2);
      if (right - left > 25) {
        echoPixel(c, '#ffffff10', left + 7, yy + 5, 13, 1);
        echoPixel(c, '#10181a55', right - 17, yy + 11, 7, 2);
        if ((row + Math.floor(xx / 61) + seed) % 5 === 0) {
          echoPixel(c, '#10181a55', left + 21, yy + 1, 1, 4);
          echoPixel(c, '#10181a55', left + 19, yy + 5, 3, 1);
          echoPixel(c, '#ffffff12', left + 22, yy + 2, 1, 3);
        }
      }
    }
  }
}

function echoWindow(c, x, y, w, h, p, night = false) {
  echoPixel(c, '#10191e', x - 6, y + 7, w + 12, h - 7);
  for (let i = 0; i < 5; i++) echoPixel(c, p.wall, x - 6 + i * 3, y + 7 - i * 3, w + 12 - i * 6, 6);
  echoPixel(c, night ? '#162b40' : '#82999a', x, y + 12, w, h - 13);
  echoPixel(c, night ? '#324b5b' : '#b7c9bc', x + 3, y + 15, w - 6, 8);
  for (let yy = y + 29; yy < y + h - 3; yy += 17)
    echoPixel(c, night ? '#223d50' : '#a2b7ac', x + 3, yy, w - 6, 3);
  echoPixel(c, '#334448', x + w / 2 - 2, y + 10, 4, h - 10);
  echoPixel(c, p.trim, x + w / 2 - 1, y + 10, 1, h - 10);
  echoPixel(c, p.trim, x - 7, y + h - 1, w + 14, 4);
  echoPixel(c, '#0d181b', x - 5, y + h + 3, w + 10, 5);
  echoPixel(c, '#d0d9c533', x + 4, y + 17, 2, h - 22);
  echoPixel(c, '#10202855', x + w / 2 + 3, y + 15, 2, h - 17);
  echoPixel(c, p.line, x - 4, y + h + 1, w + 8, 1);
  for (let yy = y + 25; yy < y + h - 8; yy += 31) {
    echoPixel(c, '#283c42', x + w / 2 - 4, yy, 8, 3);
    echoPixel(c, '#c7c6a7', x + w / 2 - 1, yy, 2, 1);
  }
  if (night)
    for (const [sx, sy] of [
      [9, 29],
      [w - 12, 46],
      [w - 17, 23],
    ])
      echoPixel(c, '#d3e7df', x + sx, y + sy, 2, 2);
}

function echoBookcase(c, x, y, w, h, seed) {
  echoTimber(c, x, y, w, h, true);
  for (let shelf = 0; shelf < Math.floor((h - 6) / 31); shelf++) {
    const by = y + 5 + shelf * 31;
    echoPixel(c, '#292b29', x + 5, by, w - 10, 25);
    for (let i = 0; i < Math.floor((w - 13) / 9); i++) {
      const bx = x + 7 + i * 9,
        bh = 15 + ((i * 3 + seed + shelf) % 8);
      echoPixel(
        c,
        ['#90785c', '#587076', '#8c655b', '#829080'][(i + seed + shelf) % 4],
        bx,
        by + 24 - bh,
        6,
        bh
      );
      echoPixel(c, '#c3b58c', bx + 1, by + 27 - bh, 4, 1);
      echoPixel(c, '#302c27', bx + 5, by + 24 - bh, 1, bh);
      echoPixel(c, '#d5c39b', bx + 1, by + 21, 4, 1);
      if (bh > 18) {
        echoPixel(c, '#d1bf94', bx + 2, by + 31 - bh, 2, 3);
        echoPixel(c, '#453b30', bx + 2, by + 32 - bh, 1, 1);
      }
    }
    echoTimber(c, x + 3, by + 26, w - 6, 4);
  }
}

function echoRoomFittings(c, key, p) {
  for (const x of [31, 596]) {
    echoPixel(c, '#10191b66', x + 3, 152, 14, 23);
    echoPixel(c, '#6c756c', x, 147, 12, 21);
    echoPixel(c, '#b6b59a', x + 1, 148, 9, 2);
    echoPixel(c, '#35474b', x + 2, 152, 8, 10);
    echoPixel(c, '#adc5ba', x + 3, 153, 2, 8);
    echoPixel(c, '#e4d6a5', x + 5, 155, 2, 4);
    echoPixel(c, '#ac9a70', x - 2, 164, 16, 3);
    echoPixel(c, '#1a2525', x + 4, 167, 4, 7);
    echoPixel(c, '#9ba78e', x + 4, 143, 4, 3);
  }
  for (const x of [35, 575]) {
    echoPixel(c, '#080f1640', x, 188, 30, 3);
    echoPixel(c, p.line + '66', x + 2, 192, 28, 1);
    for (let yy = 216; yy < 392; yy += 44) {
      echoPixel(c, '#b8b48a22', x + 7, yy, 10, 1);
      echoPixel(c, '#10171d44', x + 15, yy + 2, 9, 1);
    }
  }
  if (key === 'hollow' || key === 'court') {
    const left = key === 'court' ? 175 : 245,
      right = key === 'court' ? 465 : 395;
    for (let y = 203; y < 371; y += 17) {
      const spread = (y - 193) * 0.13;
      echoPixel(c, '#ccb17c66', left + 17 - spread, y, 2, 3);
      echoPixel(c, '#ccb17c66', right - 19 + spread, y, 2, 3);
    }
  } else if (key === 'garden') {
    for (const x of [114, 490]) {
      echoPixel(c, '#10191b55', x - 13, 203, 28, 5);
      echoPixel(c, '#77684a', x - 12, 194, 24, 10);
      echoPixel(c, '#aa9868', x - 14, 191, 28, 4);
      echoPixel(c, '#324333', x - 10, 189, 20, 3);
      echoPixel(c, '#a3b187', x - 2, 173, 2, 19);
      for (let i = 0; i < 3; i++) {
        echoPixel(c, i % 2 ? '#8ea77a' : '#6f8a64', x - 10 + (i % 2) * 11, 175 + i * 5, 9, 3);
        echoPixel(c, '#c5cfa1', x - 7 + (i % 2) * 11, 175 + i * 5, 3, 1);
      }
    }
  } else if (key === 'reservoir') {
    for (const x of [91, 509]) {
      echoPixel(c, '#17272f', x, 151, 39, 10);
      echoPixel(c, '#688488', x + 1, 150, 37, 2);
      for (let i = 0; i < 5; i++) echoPixel(c, '#91a19b', x + 5 + i * 6, 155, 3, 2);
      echoPixel(c, '#18353d55', x + 2, 188, 32, 11);
      echoPixel(c, '#9cb7b238', x + 4, 190, 26, 1);
    }
  } else if (key === 'foundry') {
    for (const x of [163, 465]) {
      echoPixel(c, '#2d2926', x, 113, 12, 52);
      echoPixel(c, '#937f61', x + 2, 115, 8, 47);
      echoPixel(c, '#d1b783', x + 3, 116, 2, 43);
      for (let i = 0; i < 6; i++) echoPixel(c, '#433c30', x + 6, 120 + i * 6, 4, 2);
      echoPixel(c, '#a66540', x + 4, 140, 3, 20);
      echoPixel(c, '#e0a265', x + 5, 140, 1, 17);
    }
  } else if (key === 'observatory') {
    for (const x of [156, 466]) {
      echoPixel(c, '#1a2630', x - 11, 132, 24, 30);
      echoPixel(c, '#a18e63', x - 9, 135, 20, 23);
      echoPixel(c, '#3e535e', x - 7, 137, 16, 18);
      echoPixel(c, '#ced4b3', x, 140, 2, 12);
      echoPixel(c, '#ced4b3', x - 4, 145, 10, 2);
      echoPixel(c, '#bdad7a', x - 12, 159, 26, 3);
    }
  } else if (key === 'archive') {
    for (const x of [35, 518]) {
      echoPixel(c, '#11191c77', x + 2, 380, 88, 4);
      for (let i = 0; i < 3; i++) {
        echoPixel(c, '#7b5f43', x + 7 + i * 24, 365, 17, 9);
        echoPixel(c, '#d8c7a0', x + 9 + i * 24, 367, 13, 5);
        echoPixel(c, '#8e7b5d', x + 11 + i * 24, 369, 7, 1);
      }
    }
  } else if (key === 'choir') {
    for (let i = 0; i < 11; i++) {
      const x = 65 + i * 47;
      echoPixel(c, '#4a5d67', x + 4, 142, 12, 9);
      echoPixel(c, '#c2c7b0', x + 5, 141, 10, 1);
      echoPixel(c, '#344350', x + 14, 142, 2, 9);
    }
  } else if (key === 'citadel') {
    for (const x of [128, 486]) {
      echoPixel(c, '#161d25', x, 108, 18, 43);
      echoPixel(c, '#8a7a65', x + 2, 110, 14, 37);
      echoPixel(c, '#b5aa8d', x + 3, 111, 12, 2);
      echoPixel(c, '#4c575b', x + 5, 117, 8, 20);
      echoPixel(c, '#d2c4a1', x + 8, 120, 2, 13);
      echoPixel(c, '#bba37a', x + 6, 141, 6, 2);
    }
  } else if (key === 'heart') {
    for (let i = 0; i < 7; i++) {
      const x = 260 + i * 19,
        y = 80 + Math.abs(i - 3) * 7;
      echoPixel(c, '#d8dec255', x - 3, y + 24, 12, 2);
      echoPixel(c, '#0b162255', x + 1, y + 29, 7, 2);
    }
  }
}

function echoRoomFloor(c, p, seed) {
  echoPixel(c, '#171d20', 12, 182, 616, 224);
  let top = 187,
    row = 0;
  while (top < 405) {
    const height = 15 + row * 2,
      bottom = Math.min(405, top + height);
    for (let col = -9; col < 9; col++) {
      const offset = (row % 2) * 0.5,
        color = (row + col + seed) % 4 ? p.floor : p.wall;
      for (let y = top; y < bottom; y++) {
        const scale = 0.7 + (y - 182) * 0.0029,
          left = Math.max(12, Math.round(320 + (col + offset) * 78 * scale)),
          right = Math.min(628, Math.round(320 + (col + offset + 1) * 78 * scale) - 2);
        if (right <= left) continue;
        echoPixel(c, color, left, y, right - left, 1);
        if (y === top) echoPixel(c, p.line + '66', left + 2, y, right - left - 2, 1);
        if (y >= bottom - 2) echoPixel(c, '#0e171b55', left, y, right - left, 1);
        if (y > top + 2 && right < 627) echoPixel(c, '#0d171b44', right - 1, y, 1, 1);
      }
      if ((row * 11 + col + seed) % 6 === 0) {
        const y = Math.round(top + height * 0.5),
          scale = 0.7 + (y - 182) * 0.0029,
          x = Math.round(320 + (col + offset + 0.35) * 78 * scale);
        if (x > 25 && x < 595) {
          echoPixel(c, '#c5c4ac18', x, y, 12 + row, 1);
          echoPixel(c, '#0d171b33', x + 7, y + 2, 10, 1);
        }
      }
    }
    top = bottom + 2;
    row++;
  }
}

function echoFloorRunner(c, left, right, top, bottom, color) {
  for (let y = top; y < bottom; y++) {
    const spread = (y - top) * 0.13,
      x = Math.round(left + 12 - spread),
      w = Math.round(right - left - 24 + spread * 2);
    echoPixel(c, '#12191a66', x + 3, y + 3, w + 1, 1);
    echoPixel(c, color, x, y, w, 1);
    echoPixel(c, '#b99b66', x + 3, y, 2, 1);
    echoPixel(c, '#b99b66', x + w - 5, y, 2, 1);
    if ((y - top) % 8 === 2) {
      echoPixel(c, '#d2b47a55', x + 7, y, 2, 1);
      echoPixel(c, '#d2b47a55', x + w - 9, y, 2, 1);
    }
  }
  const spread = (bottom - top) * 0.13;
  echoPixel(c, '#b99b6688', left + 15 - spread, bottom - 4, right - left - 30 + spread * 2, 1);
  for (let x = left + 17 - spread; x < right - 14 + spread; x += 8)
    echoPixel(c, '#c7ac7977', x, bottom, 3, 3);
}

function echoRoomSurface(key, id) {
  const cacheKey = key + ':' + id;
  const cached = echoRoomSurfaces.get(cacheKey);
  if (cached && !cached.getContext('2d')?.isContextLost?.()) return cached;
  echoRoomSurfaces.delete(cacheKey);
  const surface = document.createElement('canvas');
  surface.width = 640;
  surface.height = 420;
  if (surface.addEventListener) {
    surface.addEventListener('contextlost', () => echoRoomSurfaces.delete(cacheKey));
    surface.addEventListener('contextrestored', () => echoRoomSurfaces.delete(cacheKey));
  }
  const c = surface.getContext('2d'),
    p = MEMORY_PALETTES[key] || MEMORY_PALETTES.hollow,
    seed = idHash(id),
    scene = ECHO_TABLEAUS[id],
    kinds = new Set(scene?.props.map((o) => o.kind));
  c.imageSmoothingEnabled = false;
  echoPixel(c, '#10191c', 0, 0, 640, 420);
  echoMasonry(c, p, 12, 12, 616, 170, seed % 7);
  echoRoomFloor(c, p, seed);
  for (const x of [15, 610]) {
    echoMasonry(c, p, x, 12, 15, 175, seed);
    echoPixel(c, p.trim, x - 3, 15, 21, 5);
    echoPixel(c, p.line, x - 3, 171, 21, 7);
    echoPixel(c, '#11191a', x - 3, 178, 21, 8);
  }
  echoPixel(c, '#111b1d', 12, 174, 616, 12);
  echoPixel(c, p.trim, 12, 173, 616, 2);
  echoPixel(c, p.line, 12, 180, 616, 2);
  echoPixel(c, p.trim, 9, 405, 622, 3);
  echoPixel(c, p.wall, 4, 4, 632, 7);
  echoPixel(c, p.trim, 4, 4, 632, 2);
  echoPixel(c, p.wall, 4, 409, 632, 7);
  echoPixel(c, '#afac8b77', 4, 409, 632, 1);
  echoPixel(c, p.wall, 4, 11, 7, 398);
  echoPixel(c, p.wall, 629, 11, 7, 398);
  if (key === 'hollow') {
    for (const x of [64, 510]) echoWindow(c, x, 38, 58, 108, p);
    echoTimber(c, 142, 25, 350, 9);
    for (let i = 0; i < 9; i++) {
      const x = 161 + i * 37;
      echoPixel(c, '#192224', x, 62, 2, 58);
      echoPixel(c, '#b5a784', x - 3, 59, 8, 3);
      echoPixel(c, '#76858b', x - 5, 118, 12, 4);
    }
    echoFloorRunner(c, 241, 399, 192, 382, '#503f3b');
  } else if (key === 'garden') {
    for (const x of [59, 267, 475]) echoWindow(c, x, 33, 102, 118, p);
    for (const x of [45, 567]) {
      echoTimber(c, x, 220, 29, 113, true);
      echoPixel(c, '#8b7652', x - 9, 327, 48, 11);
      for (let i = 0; i < 8; i++) {
        const by = 225 - i * 18,
          bx = x + 13 + (i % 2 ? -6 : 4);
        echoPixel(c, '#74815a', bx, by, 3, 21);
        echoPixel(c, i % 2 ? '#a2ad77' : '#6c8a60', bx - 12, by, 14, 5);
        echoPixel(c, '#91a975', bx + 2, by + 5, 12, 4);
      }
    }
    for (let i = 0; i < 7; i++) echoPixel(c, '#b9bf8b', 33 + i * 83, 392, 6, 2);
  } else if (key === 'reservoir') {
    for (const x of [53, 536]) {
      echoPixel(c, '#1d2a32', x, 24, 23, 151);
      echoPixel(c, '#60797e', x + 2, 24, 18, 151);
      echoPixel(c, '#9eb3ae', x + 5, 24, 3, 151);
      for (let y = 42; y < 171; y += 41) {
        echoPixel(c, '#283d43', x - 4, y, 31, 9);
        echoPixel(c, '#afc0b8', x - 2, y + 1, 27, 2);
        echoPixel(c, '#c1cbbd', x - 2, y + 5, 2, 2);
      }
    }
    echoWindow(c, 235, 30, 171, 111, p, true);
    for (let y = 205; y < 381; y += 16) {
      echoPixel(c, '#274a55', 22, y, 26, 9);
      echoPixel(c, '#62878b', 25, y, 15, 1);
      echoPixel(c, '#274a55', 592, y, 26, 9);
      echoPixel(c, '#62878b', 597, y, 14, 1);
    }
  } else if (key === 'foundry') {
    for (const x of [61, 485]) {
      echoPixel(c, '#282727', x, 30, 91, 115);
      echoPixel(c, '#8a6950', x - 5, 26, 101, 6);
      echoPixel(c, '#6c4a37', x + 7, 42, 77, 82);
      echoPixel(c, '#c17b43', x + 12, 86, 67, 36);
      echoPixel(c, '#e4a75c', x + 22, 98, 44, 22);
      for (let i = 0; i < 6; i++) echoPixel(c, '#323333', x + 11 + i * 12, 39, 4, 87);
      echoPixel(c, '#a5855a', x - 7, 133, 105, 8);
    }
    echoTimber(c, 179, 29, 282, 12);
    for (let i = 0; i < 8; i++) {
      const x = 194 + i * 34;
      echoPixel(c, '#c1a57a', x, 42, 2, 45 + (i % 3) * 11);
      echoPixel(c, '#53636a', x - 6, 84 + (i % 3) * 11, 15, 8);
      echoPixel(c, '#96a29b', x - 6, 84 + (i % 3) * 11, 9, 2);
    }
    for (const y of [213, 368])
      for (let i = 0; i < 12; i++) echoPixel(c, '#9d7e57', 31 + i * 50, y, 3, 3);
  } else if (key === 'observatory') {
    echoWindow(c, 215, 23, 211, 124, p, true);
    for (const x of [48, 515]) {
      echoTimber(c, x, 44, 76, 96, true);
      echoPixel(c, '#c0ac76', x + 8, 52, 60, 80);
      echoPixel(c, '#45586b', x + 11, 56, 54, 73);
      for (let i = 0; i < 8; i++) {
        echoPixel(c, '#b5c9be', x + 18 + ((i * 17) % 38), 61 + i * 8, 2, 2);
        if (i % 2) echoPixel(c, '#7e959b', x + 21, 62 + i * 8, 25, 1);
      }
    }
    c.strokeStyle = '#b3986066';
    c.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      c.beginPath();
      c.ellipse(320, 313, 111 + i * 33, 40 + i * 12, 0, 0, TAU);
      c.stroke();
    }
    for (let i = 0; i < 12; i++)
      echoPixel(
        c,
        '#ac9b6c',
        320 + Math.cos((i * TAU) / 12) * 179,
        313 + Math.sin((i * TAU) / 12) * 65,
        2,
        2
      );
  } else if (key === 'archive') {
    echoBookcase(c, 37, 24, 144, 143, seed);
    echoBookcase(c, 459, 24, 144, 143, seed + 3);
    echoTimber(c, 209, 34, 223, 110, true);
    echoPixel(c, '#b8a785', 221, 45, 199, 86);
    for (let i = 0; i < 10; i++) echoPixel(c, '#80745d', 232, 53 + i * 7, 156 - (i % 3) * 33, 1);
    echoPixel(c, '#6c4142', 387, 111, 14, 12);
    echoTimber(c, 35, 342, 90, 38);
    echoTimber(c, 518, 342, 87, 38);
    for (let i = 0; i < 3; i++) echoPixel(c, '#b9ad8b', 44 + i * 22, 350, 17, 10);
  } else if (key === 'court') {
    for (const x of [48, 501]) {
      echoTimber(c, x - 5, 22, 101, 7);
      echoPixel(c, '#6b4c50', x, 30, 90, 135);
      for (let i = 0; i < 6; i++)
        echoPixel(c, i % 2 ? '#876363' : '#553e46', x + i * 15, 31, 6, 130 - (i % 3) * 4);
      echoPixel(c, '#c1a173', x + 5, 32, 2, 127);
      echoPixel(c, '#c1a173', x + 83, 32, 2, 127);
    }
    echoWindow(c, 267, 32, 107, 113, p, true);
    echoFloorRunner(c, 169, 471, 188, 398, '#5a414b');
  } else if (key === 'choir') {
    for (let i = 0; i < 11; i++) {
      const x = 65 + i * 47,
        top = 37 + Math.abs(5 - i) * 10;
      echoPixel(c, '#2c3946', x, top, 21, 164 - top);
      echoPixel(c, '#91a2ad', x + 2, top + 2, 14, 160 - top);
      echoPixel(c, '#c5c9b7', x + 4, top + 2, 3, 156 - top);
      echoPixel(c, '#3f5062', x + 5, top + 15, 11, 13);
      echoPixel(c, '#b5ae82', x - 3, 153, 27, 5);
    }
    echoTimber(c, 48, 163, 549, 12);
    for (const x of [41, 561]) for (let i = 0; i < 3; i++) echoTimber(c, x, 251 + i * 42, 37, 7);
  } else if (key === 'citadel') {
    for (const x of [48, 523]) {
      echoMasonry(c, p, x, 24, 70, 142, seed);
      echoPixel(c, '#927a61', x + 5, 28, 60, 4);
      for (let i = 0; i < 4; i++) echoPixel(c, '#0d171c', x + 15 + i * 10, 44, 4, 73);
      echoPixel(c, '#b6a481', x + 18, 122, 35, 2);
    }
    echoTimber(c, 180, 35, 280, 11);
    for (let i = 0; i < 7; i++) {
      const x = 202 + i * 35;
      echoPixel(c, '#4a5059', x - 7, 67, 17, 39);
      echoPixel(c, '#858d91', x - 4, 70, 4, 31);
      echoPixel(c, '#c1a576', x - 5, 68, 12, 2);
      echoPixel(c, '#282d34', x - 2, 106, 7, 8);
    }
  } else {
    for (const x of [54, 526]) echoWindow(c, x, 33, 59, 114, p, true);
    echoMasonry(c, p, 225, 30, 191, 121, seed);
    echoPixel(c, '#9b825e', 222, 33, 197, 4);
    echoPixel(c, '#0f1a23', 246, 50, 148, 85);
    for (let i = 0; i < 7; i++) {
      const x = 260 + i * 19,
        y = 80 + Math.abs(i - 3) * 7;
      echoPixel(c, i === 6 ? '#e6c78d' : '#9bb2bd', x, y, 6, 21);
      echoPixel(c, '#e2e9df', x + 2, y - 3, 2, 9);
    }
    for (const x of [163, 475]) echoPixel(c, '#b9a47755', x, 211, 2, 178);
  }
  if (kinds.has('water'))
    for (let i = 0; i < 5; i++) echoPixel(c, '#99c8cf33', 78 + i * 97, 362 + (i % 2) * 8, 42, 1);
  if (kinds.has('rain'))
    for (let i = 0; i < 6; i++) echoPixel(c, '#94b5bd44', 49 + i * 103, 389 - (i % 2) * 8, 20, 1);
  echoRoomFittings(c, key, p);
  echoRoomSurfaces.set(cacheKey, surface);
  if (echoRoomSurfaces.size > 12) echoRoomSurfaces.delete(echoRoomSurfaces.keys().next().value);
  return surface;
}

function drawEchoRoomBackground(c, key, id, alpha = 1) {
  c.save();
  c.globalAlpha *= alpha;
  c.imageSmoothingEnabled = false;
  c.drawImage(echoRoomSurface(key, id), 0, 0);
  c.restore();
}

const echoUndetailedProp = drawMemoryProp;
drawMemoryProp = function (c, o, rect, key, t, alpha, index) {
  const x = Math.round(rect.x + rect.w * o.x),
    y = Math.round(rect.y + rect.h * o.y),
    w = o.w || 48,
    h = o.h || 48,
    p = MEMORY_PALETTES[key] || MEMORY_PALETTES.hollow;
  const direct = [
    'table',
    'desk',
    'shelf',
    'crate',
    'sapling',
    'bed',
    'pod',
    'chair',
    'throne',
    'door',
    'lamp',
    'bell',
    'rope',
    'valve',
  ];
  if (!direct.includes(o.kind)) echoUndetailedProp(c, o, rect, key, t, alpha, index);
  c.save();
  c.translate(x, y);
  c.globalAlpha = alpha * (o.opacity ?? 1);
  if (['table', 'desk'].includes(o.kind)) {
    echoPixel(c, '#0d171b66', -w / 2 - 5, 26, w + 10, 6);
    for (const lx of [-w / 2 + 8, w / 2 - 14]) {
      echoTimber(c, lx, 3, 7, 28, true);
      echoPixel(c, '#b49765', lx - 1, 24, 9, 3);
    }
    echoTimber(c, -w / 2 + 9, 18, w - 18, 5);
    echoTimber(c, -w / 2, -10, w, 16);
    echoPixel(c, '#bda16e', -w / 2 + 3, -9, w - 6, 1);
    if (o.kind === 'desk') {
      echoPixel(c, '#422f28', -w / 2 + 6, 7, w / 3, 11);
      echoPixel(c, '#b8a476', -w / 2 + w / 6, 11, 5, 2);
    }
  } else if (o.kind === 'shelf') {
    echoBookcase(c, -w / 2, -h, w, h, index + idHash(activeMemoryEcho?.id || 'echo1'));
  } else if (o.kind === 'crate') {
    echoPixel(c, '#10171d66', -w / 2 - 3, 0, w + 7, 4);
    echoTimber(c, -w / 2, -w * 0.52, w, w * 0.52, true);
    echoTimber(c, -w / 2 - 2, -w * 0.52 - 2, w + 4, 5);
    echoPixel(c, '#ac9b73', -4, -w * 0.52 + 5, 12, 8);
    echoPixel(c, '#61563f', -1, -w * 0.52 + 8, 6, 1);
  } else if (o.kind === 'sapling') {
    echoPixel(c, '#17302866', -22, 1, 44, 7);
    echoPixel(c, '#876e4c', -w / 2, -3, w, 8);
    echoPixel(c, '#453d2c', -w / 2 + 3, -2, w - 6, 4);
    echoPixel(c, '#9a8b61', -2, -h, 4, h);
    for (let i = 0; i < 5; i++) {
      const yy = -h + 12 + i * 11,
        side = i % 2 ? 1 : -1;
      echoPixel(c, '#607d59', side < 0 ? -17 : 1, yy, 16, 5);
      echoPixel(c, '#9fb582', side < 0 ? -15 : 4, yy, 9, 2);
      echoPixel(c, '#c3be81', -3, yy + 5, 6, 2);
    }
  } else if (['bed', 'pod'].includes(o.kind)) {
    echoTimber(c, -w / 2 - 3, -w * 0.34 - 6, w + 6, w * 0.34 + 10, true);
    echoPixel(c, '#2b3030', -w / 2 + 2, -w * 0.3, w - 4, w * 0.3);
    echoPixel(c, o.kind === 'pod' ? '#7f9a89' : '#aaa69a', -w / 2 + 5, -w * 0.28, w - 10, w * 0.25);
    echoPixel(c, '#e2dcc0', -w / 2 + 7, -w * 0.24, w * 0.24, w * 0.17);
    echoPixel(c, '#d1d6bc', -w / 2 + 9, -w * 0.23, w * 0.18, 2);
    for (let i = 0; i < 3; i++)
      echoPixel(c, '#4f675f66', -w * 0.07 + i * w * 0.18, -w * 0.24, 2, w * 0.2);
    if (o.kind === 'pod') echoPixel(c, '#d2bd7a', -2, -w * 0.31, 4, w * 0.3);
    echoPixel(c, '#161d1c', -w / 2 + 2, 3, 5, 5);
    echoPixel(c, '#161d1c', w / 2 - 7, 3, 5, 5);
  } else if (['chair', 'throne'].includes(o.kind)) {
    const high = o.kind === 'throne' ? h : Math.min(h, 44);
    echoTimber(c, -w / 2, -high, w, high, true);
    echoPixel(
      c,
      o.kind === 'throne' ? '#765463' : '#887359',
      -w / 2 + 5,
      -high + 7,
      w - 10,
      high - 13
    );
    echoTimber(c, -w / 2 - 4, -2, w + 8, 7);
    echoPixel(c, '#c0a273', -w / 2 + 1, -high + 2, w - 2, 2);
    for (const lx of [-w / 2 + 1, w / 2 - 5]) echoTimber(c, lx, 5, 5, 15, true);
    echoPixel(c, '#10181d66', -w / 2 - 3, 20, w + 7, 3);
    for (let i = 0; i < 3; i++)
      echoPixel(
        c,
        '#c2a47a',
        -w / 2 + 8 + i * Math.max(3, (w - 18) / 3),
        -high + 12,
        1,
        Math.max(2, high - 28)
      );
  } else if (o.kind === 'door') {
    echoMasonry(c, p, -w / 2 - 8, -h - 8, w + 16, h + 10, index);
    echoPixel(c, '#0a1219', -w / 2, -h, w, h);
    const leaf = Math.max(3, w * (1 - (o.open || 0)));
    echoTimber(c, -w / 2, -h, leaf, h, true);
    for (const yy of [-h + 11, -h * 0.45, -12]) {
      echoPixel(c, '#4b5a5d', -w / 2, yy, leaf, 5);
      echoPixel(c, '#a4b3ac', -w / 2 + 2, yy + 1, leaf - 4, 1);
    }
    echoPixel(c, '#d3ba80', -w / 2 + leaf - 8, -h * 0.44, 4, 5);
    echoPixel(c, '#9c9275', -w / 2 - 5, 0, w + 10, 3);
  } else if (o.kind === 'bell') {
    echoPixel(c, '#a38b64', -2, -w * 0.85, 4, w * 0.18);
    c.translate(0, -w * 0.68);
    c.rotate(o.swing || 0);
    echoPixel(c, '#584a3c', -w * 0.22, 3, w * 0.44, w * 0.16);
    for (let row = 0; row < 5; row++) {
      const rw = w * (0.43 + row * 0.11),
        yy = w * 0.17 + row * w * 0.09;
      echoPixel(c, '#ad8b53', -rw / 2, yy, rw, w * 0.1 + 1);
      echoPixel(c, '#d2b577', -rw / 2 + 2, yy, Math.max(2, rw * 0.21), w * 0.1 + 1);
      echoPixel(c, '#755d40', rw / 2 - 4, yy, 4, w * 0.1 + 1);
    }
    echoPixel(c, '#695238', -w / 2 - 2, w * 0.61, w + 4, 5);
    echoPixel(c, '#e0c887', -w / 2 - 2, w * 0.61, w + 4, 2);
    echoPixel(c, '#c4a263', -w * 0.31, w * 0.42, w * 0.61, 2);
    c.rotate(-(o.swing || 0) * 1.65);
    echoPixel(c, '#cbb98c', -2, w * 0.59, 4, w * 0.24);
    echoPixel(c, '#a38858', -4, w * 0.8, 8, 4);
  } else if (o.kind === 'rope') {
    const sway = save.motion ? 0 : Math.sin(silentMemoryTime() * 4.6) * 2;
    for (let yy = -h; yy < 0; yy += 3) {
      const xx = Math.round(Math.sin(((yy + h) / h) * Math.PI) * sway);
      echoPixel(c, '#7a6749', xx - 2, yy, 4, 3);
      echoPixel(c, '#d3bf8b', xx - 1, yy, 1, 2);
    }
    echoPixel(c, '#bfa375', -4, -2, 8, 3);
  } else if (o.kind === 'valve') {
    echoPixel(c, '#4f6264', -4, -6, 8, 29);
    c.translate(0, -w * 0.1);
    c.rotate(o.turn || 0);
    c.strokeStyle = '#4b4d46';
    c.lineWidth = 6;
    c.beginPath();
    c.arc(0, 0, w / 2, 0, TAU);
    c.stroke();
    c.strokeStyle = '#bba06a';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(0, 0, w / 2, 0, TAU);
    c.stroke();
    for (let i = 0; i < 4; i++) {
      c.rotate(Math.PI / 2);
      echoPixel(c, '#cfb982', -1, 2, 3, w / 2 - 3);
      echoPixel(c, '#71664c', 1, 2, 1, w / 2 - 3);
    }
    echoPixel(c, '#ddd2b0', -4, -4, 8, 8);
    echoPixel(c, '#71654d', -2, -2, 4, 4);
  } else if (o.kind === 'lamp') {
    const lit = o.lit !== false;
    echoPixel(c, '#232b30', -10, -16, 20, 33);
    echoPixel(c, '#a58d61', -12, -16, 24, 4);
    echoPixel(c, '#b49c6c', -12, 13, 24, 4);
    echoPixel(c, '#475a60', -7, -10, 14, 20);
    echoPixel(c, '#9daea2', -5, -9, 2, 16);
    echoPixel(c, '#d1bd87', -10, -11, 3, 24);
    echoPixel(c, '#796e54', 7, -11, 3, 24);
    echoPixel(c, '#d1bd87', -4, -23, 8, 3);
    echoPixel(c, '#a58d61', -6, -21, 2, 5);
    echoPixel(c, '#796e54', 4, -21, 2, 5);
    if (lit) {
      const f = save.motion ? 0 : Math.floor(t * 7) % 3;
      echoPixel(c, '#edaf60', -4, -3 - f, 8, 12 + f);
      echoPixel(c, '#ffe6a1', -2, -6 + f, 4, 12 - f);
      echoPixel(c, '#fff8d1', -1, -1, 2, 6);
    }
  } else if (['machine', 'belt', 'furnace', 'brazier'].includes(o.kind)) {
    echoPixel(c, '#10181c55', -w / 2 - 4, 2, w + 9, 5);
    echoPixel(c, '#84918b', -w / 2 + 3, -h + 3, w - 6, 2);
    echoPixel(c, '#27363a', -w / 2 + 3, -h + 5, w - 6, 2);
    echoPixel(c, '#a99e7b', -w / 2 + 1, -h + 6, 2, h - 12);
    echoPixel(c, '#27363a', w / 2 - 4, -h + 6, 3, h - 9);
    for (const lx of [-w / 2 + 5, w / 2 - 13]) {
      echoPixel(c, '#364443', lx, -3, 8, 6);
      echoPixel(c, '#a4a285', lx, -2, 7, 1);
    }
    for (const lx of [-w / 2 + 3, w / 2 - 5])
      for (const ly of [-h + 4, -5]) {
        echoPixel(c, '#c1a579', lx, ly, 2, 2);
        echoPixel(c, '#252c2c', lx + 1, ly + 1, 2, 2);
      }
    echoPixel(c, '#c5ab8155', -w / 2 + 2, -h + 2, w - 4, 1);
    echoPixel(c, '#151d2255', w / 2 - 3, -h + 3, 2, h - 3);
    if (o.kind === 'machine' || o.kind === 'belt') {
      const panel = Math.max(13, Math.min(w * 0.28, 23));
      echoPixel(c, '#25383d', -w / 2 + 8, -h + 11, panel, 19);
      echoPixel(c, '#b0b69a', -w / 2 + 9, -h + 12, panel - 2, 1);
      echoPixel(c, '#8ea8a2', -w / 2 + 11, -h + 15, panel - 6, 10);
      echoPixel(c, '#c8d1b6', -w / 2 + 12, -h + 16, panel - 8, 2);
      echoPixel(c, '#4e6968', -w / 2 + 13, -h + 20, panel - 10, 1);
      echoPixel(c, '#314748', -w / 2 + 8, -15, Math.min(w - 16, 30), 8);
      for (let i = 0; i < Math.min(6, (w - 16) / 5); i++)
        echoPixel(c, '#9ba999', -w / 2 + 10 + i * 5, -14, 2, 5);
    } else {
      echoPixel(c, '#222b2d', -w * 0.33, -h * 0.66, w * 0.66, h * 0.48);
      echoPixel(c, '#b69b70', -w * 0.33, -h * 0.66, w * 0.66, 2);
      echoPixel(c, '#522f22', -w * 0.29, -h * 0.61, w * 0.58, h * 0.37);
      const base = -h * 0.24,
        beat = save.motion ? 0 : Math.floor(t * 7) % 4;
      for (let i = 0; i < 5; i++) {
        const x = -w * 0.25 + (i * w) / 9,
          height = h * (0.17 + ((i * 3 + beat) % 5) * 0.032);
        echoPixel(c, '#c47340', x - 2, base - height, w * 0.1, height);
        echoPixel(c, '#e7ab5f', x, base - height * 0.71, w * 0.07, height * 0.71);
        echoPixel(c, '#f4d692', x + 1, base - height * 0.42, Math.max(2, w * 0.035), height * 0.42);
      }
      for (let i = 0; i < 4; i++) {
        const x = -w * 0.23 + (i * w) / 6;
        echoPixel(c, '#3d3d32', x, -h * 0.62, 2, h * 0.4);
        echoPixel(c, '#a48352', x, -h * 0.61, 1, h * 0.28);
      }
      for (const side of [-1, 1]) {
        const x = side < 0 ? -w / 2 : w / 2 - 7;
        for (let y = -h + 11; y < -5; y += 11) {
          echoPixel(c, '#4d5249', x, y, 7, 9);
          echoPixel(c, '#bbb085', x + 1, y, 5, 1);
          echoPixel(c, '#303e3e', x + 1, y + 7, 6, 2);
        }
      }
      echoPixel(c, '#555143', -w / 2 + 2, -5, w - 4, 5);
      echoPixel(c, '#c3ad78', -w / 2 + 3, -5, w - 6, 1);
      for (let i = 0; i < 5; i++) echoPixel(c, '#a28a5b', -w * 0.3 + i * w * 0.14, -3, 2, 1);
    }
  } else if (o.kind === 'pipe') {
    for (let i = 0; i < 4; i++) {
      const x = -w / 2 + 8 + ((w - 16) * i) / 3;
      echoPixel(c, '#293e42', x - 3, -9, 7, 18);
      echoPixel(c, '#95ada6', x - 2, -8, 5, 2);
      echoPixel(c, '#cad2b4', x - 2, -5, 1, 12);
      echoPixel(c, '#445d5e', x + 2, -5, 2, 13);
    }
  } else if (o.kind === 'gauge') {
    echoPixel(c, '#d2d5bc', -w / 2 + 4, -h + 4, 1, h - 8);
    echoPixel(c, '#293d43', w / 2 - 4, -h + 4, 2, h - 7);
    for (let y = -h + 9; y < -4; y += 8) echoPixel(c, '#d2ccb0', 2, y, Math.max(2, w / 2 - 6), 1);
    echoPixel(c, '#ad8e68', -w / 2 - 2, 0, w + 4, 3);
  } else if (o.kind === 'paint' || o.kind === 'pail') {
    echoPixel(c, '#111c1d55', -w / 2 - 2, 4, w + 4, 3);
    echoPixel(c, '#c1b78e', -w / 2 + 1, -w * 0.65, w - 2, 2);
    echoPixel(c, '#e6d3aa', -w / 2 + 2, -w * 0.64, Math.max(2, w * 0.32), 1);
    echoPixel(c, '#d2bd90', -w / 2 + 3, -w * 0.4, 2, w * 0.32);
    echoPixel(c, '#3b453d', w / 2 - 3, -w * 0.37, 2, w * 0.33);
  } else if (['paper', 'ledger', 'card', 'notice', 'book'].includes(o.kind)) {
    echoPixel(c, '#998b7133', -w / 2 + 1, -h / 4 + 1, 1, h / 2 - 2);
    echoPixel(c, '#fff6d059', -w / 2 + 1, -h / 4, w - 2, 1);
    if (o.kind === 'book') echoPixel(c, '#8c7757', -2, -h / 4, 2, h / 2);
  }
  if (['table', 'desk'].includes(o.kind)) {
    echoPixel(c, '#372c25', -w / 2 + 4, 4, w - 8, 2);
    for (const lx of [-w / 2 + 8, w / 2 - 14]) {
      echoPixel(c, '#d2b17a', lx + 1, 7, 2, 3);
      echoPixel(c, '#3b3127', lx + 4, 10, 2, 13);
      echoPixel(c, '#a28b60', lx - 1, 27, 9, 2);
    }
  } else if (o.kind === 'bed' || o.kind === 'pod') {
    echoPixel(c, '#0d191c66', -w / 2 - 4, 8, w + 8, 4);
    echoPixel(c, '#e4ddbd88', -w / 2 + 9, -w * 0.08, w - 19, 1);
    for (let i = 0; i < 4; i++) echoPixel(c, '#5c786c66', w * 0.14 + i * 3, -w * 0.23, 1, w * 0.2);
  } else if (o.kind === 'lamp') {
    echoPixel(c, '#fff5c344', -4, -10, 1, 18);
    echoPixel(c, '#3a484b', -8, 10, 16, 2);
    echoPixel(c, '#d0bd8d', -8, 11, 5, 1);
  }
  c.restore();
};
