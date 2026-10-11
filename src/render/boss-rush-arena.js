const BOSS_RUSH_ARENA_VERSION = 1;
let bossRushArenaCanvas = null,
  bossRushArenaWorld = null;

function prepareBossRushArena(bosses) {
  const old = G.world,
    source = old.exit,
    fromX = source.cx * TILE + TILE / 2,
    fromY = source.cy * TILE + TILE / 2,
    W = 23,
    H = 21,
    room = { x: 3, y: 3, w: 17, h: 15, cx: 11, cy: 10 },
    grid = new Uint8Array(W * H),
    shade = new Uint8Array(W * H),
    deco = new Uint8Array(W * H),
    torches = [];
  for (let y = room.y; y < room.y + room.h; y++)
    for (let x = room.x; x < room.x + room.w; x++) {
      const i = y * W + x;
      grid[i] = 1;
      shade[i] = (x * 13 + y * 7) % 4;
    }
  for (const side of [-1, 1])
    for (const offset of [-5, -1, 3, 6])
      torches.push({
        x: (room.cx + side * 9) * TILE + TILE / 2,
        y: (room.cy + offset) * TILE + TILE / 2,
        s: (offset + 5) * 0.71 + (side + 1) * 0.5,
      });
  G.world = {
    W,
    H,
    grid,
    shade,
    deco,
    rooms: [room],
    exit: room,
    region: old.region,
    lateKey: old.lateKey,
    pi: 0,
    pal: PALETTES[0],
    torches,
    props: [],
    fixtures: [],
    lateFixtures: [],
    hollowDecor: [],
    lateDecor: [],
    hazards: [],
    lateHazards: [],
    arenaDoors: [],
    lateDoors: [],
    specialEncounters: [],
    secretRoom: null,
    restingFlame: null,
    sealed: false,
    wardCleared: false,
    lateCleared: false,
    reveal: new Uint8Array(W * H),
    mmDirty: true,
    layout: 'rush-chamber',
    bossRushArena: BOSS_RUSH_ARENA_VERSION,
  };
  const toX = room.cx * TILE + TILE / 2,
    toY = room.cy * TILE + TILE / 2;
  for (const b of bosses) {
    b.x += toX - fromX;
    b.y += toY - fromY;
    if (b.bs) {
      b.bs.targetX = b.x;
      b.bs.targetY = b.y;
    }
  }
  if (G.portal) {
    G.portal.x = toX;
    G.portal.y = room.y * TILE + TILE / 2;
    G.portal.active = false;
  }
  bossRushArenaCanvas = null;
  bossRushArenaWorld = null;
}

function bossRushStone(ctx, x, y, w, h, seed, edge = false) {
  const shades = edge ? ['#24201f', '#292421', '#302924'] : ['#272625', '#2b2926', '#302c28'];
  ctx.fillStyle = shades[Math.abs(seed) % shades.length];
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = edge ? '#4a3b2d' : '#3a352e';
  ctx.fillRect(x + 2, y + 2, w - 4, 2);
  ctx.fillRect(x + 2, y + 4, 2, h - 6);
  ctx.fillStyle = '#171818';
  ctx.fillRect(x + 2, y + h - 3, w - 4, 2);
  ctx.fillRect(x + w - 3, y + 4, 2, h - 6);
  ctx.fillStyle = edge ? '#8b6b4033' : '#bd9c6420';
  const tx = 5 + (Math.abs(seed * 17) % Math.max(1, w - 12)),
    ty = 7 + (Math.abs(seed * 23) % Math.max(1, h - 14));
  ctx.fillRect(x + tx, y + ty, 5 + Math.abs(seed % 7), 1);
  ctx.fillStyle = '#171a1a55';
  ctx.fillRect(x + w - tx - 5, y + h - ty, 4, 2);
}

function bossRushOctagon(ctx, x, y, rx, ry, color, width) {
  const cutX = Math.round((rx * 0.29) / 2) * 2,
    cutY = Math.round((ry * 0.29) / 2) * 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x - rx + cutX, y - ry);
  ctx.lineTo(x + rx - cutX, y - ry);
  ctx.lineTo(x + rx, y - ry + cutY);
  ctx.lineTo(x + rx, y + ry - cutY);
  ctx.lineTo(x + rx - cutX, y + ry);
  ctx.lineTo(x - rx + cutX, y + ry);
  ctx.lineTo(x - rx, y + ry - cutY);
  ctx.lineTo(x - rx, y - ry + cutY);
  ctx.closePath();
  ctx.stroke();
}

function buildBossRushArenaCanvas(w) {
  const canvas = document.createElement('canvas');
  canvas.width = w.W * TILE;
  canvas.height = w.H * TILE;
  const ctx = canvas.getContext('2d'),
    r = w.exit,
    left = r.x * TILE,
    top = r.y * TILE,
    width = r.w * TILE,
    height = r.h * TILE,
    cx = r.cx * TILE + TILE / 2,
    cy = r.cy * TILE + TILE / 2;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#080b0e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#101315';
  ctx.fillRect(left - 42, top - 62, width + 84, height + 111);
  for (let y = top; y < top + height; y += 18)
    for (let x = left; x < left + width; x += 36) {
      const row = (y - top) / 18,
        start = x + (row % 2 ? -18 : 0),
        clipX = Math.max(left, start),
        end = Math.min(left + width, start + 36);
      if (end > clipX) bossRushStone(ctx, clipX, y, end - clipX, 18, row * 41 + (x - left));
      if (x + 36 >= left + width && row % 2)
        bossRushStone(ctx, left + width - 18, y, 18, 18, row * 13);
    }
  ctx.fillStyle = '#473a2b';
  ctx.fillRect(left + 10, top + 10, width - 20, 3);
  ctx.fillRect(left + 10, top + height - 14, width - 20, 3);
  ctx.fillRect(left + 10, top + 10, 3, height - 20);
  ctx.fillRect(left + width - 13, top + 10, 3, height - 20);
  ctx.fillStyle = '#1d201f';
  ctx.fillRect(left + 15, top + 15, width - 30, 4);
  ctx.fillRect(left + 15, top + height - 20, width - 30, 4);
  bossRushOctagon(ctx, cx, cy, 244, 206, '#63513b', 2);
  bossRushOctagon(ctx, cx, cy, 236, 198, '#151a1b', 4);
  bossRushOctagon(ctx, cx, cy, 228, 190, '#42392b', 2);
  bossRushOctagon(ctx, cx, cy, 164, 146, '#4f4431', 2);
  bossRushOctagon(ctx, cx, cy, 158, 140, '#171b1b', 2);
  bossRushOctagon(ctx, cx, cy, 102, 88, '#5b4932', 2);
  for (let i = 0; i < 16; i++) {
    const a = (i * TAU) / 16,
      x = Math.round((cx + Math.cos(a) * 196) / 2) * 2,
      y = Math.round((cy + Math.sin(a) * 168) / 2) * 2;
    ctx.fillStyle = i % 2 ? '#5e4b32' : '#806443';
    ctx.fillRect(x - 2, y - 2, 4, 4);
    ctx.fillStyle = '#171c1c';
    ctx.fillRect(x - 1, y - 1, 2, 2);
  }
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i * TAU) / 7,
      tipX = Math.round((cx + Math.cos(a) * 67) / 2) * 2,
      tipY = Math.round((cy + Math.sin(a) * 57) / 2) * 2,
      midX = Math.round((cx + Math.cos(a) * 31) / 2) * 2,
      midY = Math.round((cy + Math.sin(a) * 27) / 2) * 2;
    ctx.fillStyle = '#705838';
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(midX + Math.cos(a + Math.PI / 2) * 6, midY + Math.sin(a + Math.PI / 2) * 6);
    ctx.lineTo(cx + Math.cos(a) * 16, cy + Math.sin(a) * 14);
    ctx.lineTo(midX - Math.cos(a + Math.PI / 2) * 6, midY - Math.sin(a + Math.PI / 2) * 6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#b08a50';
  ctx.fillRect(cx - 4, cy - 4, 8, 8);
  ctx.fillStyle = '#252822';
  ctx.fillRect(cx - 2, cy - 2, 4, 4);
  for (const side of [-1, 1]) {
    const x = side < 0 ? left - 32 : left + width;
    for (let y = top - 12; y < top + height + 18; y += 24)
      bossRushStone(ctx, x, y, 32, 24, y + side, true);
    ctx.fillStyle = '#705234';
    ctx.fillRect(x + (side < 0 ? 28 : 2), top - 12, 2, height + 30);
    ctx.fillStyle = '#070b0d';
    ctx.fillRect(x + (side < 0 ? 26 : 4), top + 3, 2, height - 6);
    for (const y of [top + 2, top + height - 32]) {
      ctx.fillStyle = '#211e1b';
      ctx.fillRect(x - 9, y, 50, 30);
      ctx.fillStyle = '#4f3d2d';
      ctx.fillRect(x - 6, y + 2, 44, 5);
      ctx.fillRect(x - 6, y + 23, 44, 5);
      ctx.fillStyle = '#a78048';
      ctx.fillRect(x - 3, y + 3, 38, 2);
    }
  }
  for (let x = left - 32; x < left + width + 32; x += 36) {
    bossRushStone(ctx, x, top - 43, 36, 28, x + 71, true);
    bossRushStone(ctx, x, top - 15, 36, 15, x + 21, true);
    bossRushStone(ctx, x, top + height, 36, 24, x + 43, true);
    bossRushStone(ctx, x, top + height + 24, 36, 18, x + 97, true);
  }
  ctx.fillStyle = '#9f7945';
  ctx.fillRect(left - 32, top - 45, width + 64, 3);
  ctx.fillStyle = '#29251d';
  ctx.fillRect(left - 32, top - 48, width + 64, 2);
  ctx.fillStyle = '#0b0e10';
  ctx.fillRect(cx - 47, top + height, 94, 31);
  for (let step = 0; step < 4; step++) {
    ctx.fillStyle = step % 2 ? '#4d4030' : '#635139';
    ctx.fillRect(cx - 42 + step * 3, top + height + step * 7, 84 - step * 6, 3);
    ctx.fillStyle = '#1c1c19';
    ctx.fillRect(cx - 42 + step * 3, top + height + step * 7 + 3, 84 - step * 6, 4);
  }
  for (let i = 0; i < 10; i++) {
    const x = cx + (i - 4.5) * 54,
      y = top - 27;
    ctx.fillStyle = '#0a0d10';
    ctx.fillRect(x - 16, y - 22, 32, 40);
    ctx.fillStyle = '#665038';
    ctx.fillRect(x - 18, y - 23, 36, 3);
    ctx.fillRect(x - 18, y - 20, 3, 40);
    ctx.fillRect(x + 15, y - 20, 3, 40);
    ctx.fillRect(x - 18, y + 18, 36, 3);
    ctx.fillStyle = '#99744b';
    ctx.fillRect(x - 10, y - 13, 20, 4);
    ctx.fillRect(x - 7, y - 19, 14, 7);
    ctx.fillRect(x - 12, y - 8, 24, 10);
    ctx.fillRect(x - 16, y + 2, 32, 5);
    ctx.fillStyle = '#c29a60';
    ctx.fillRect(x - 6, y - 17, 3, 16);
    ctx.fillRect(x - 13, y + 2, 26, 2);
    ctx.fillStyle = '#3c2e21';
    ctx.fillRect(x + 5, y - 10, 5, 12);
    ctx.fillRect(x - 11, y - 7, 2, 9);
    ctx.fillStyle = '#ad8753';
    ctx.fillRect(x - 2, y + 7, 4, 5);
    ctx.fillStyle = '#27211d';
    ctx.fillRect(x - 8, y + 14, 16, 2);
  }
  for (const o of w.torches) {
    const x = o.x,
      y = o.y;
    ctx.fillStyle = '#0a0e11';
    ctx.fillRect(x - 16, y - 30, 32, 49);
    ctx.fillStyle = '#7b5934';
    ctx.fillRect(x - 18, y - 32, 36, 4);
    ctx.fillRect(x - 18, y - 28, 3, 47);
    ctx.fillRect(x + 15, y - 28, 3, 47);
    ctx.fillRect(x - 18, y + 18, 36, 4);
    ctx.fillStyle = '#ac8246';
    ctx.fillRect(x - 15, y - 31, 30, 2);
    ctx.fillRect(x - 12, y + 4, 24, 4);
    ctx.fillStyle = '#463322';
    ctx.fillRect(x - 9, y + 8, 18, 7);
    ctx.fillRect(x - 5, y + 15, 10, 4);
    ctx.fillStyle = '#c29753';
    ctx.fillRect(x - 10, y + 5, 20, 2);
  }
  return canvas;
}

function drawBossRushArena(ctx) {
  const w = G.world;
  if (bossRushArenaWorld !== w || !bossRushArenaCanvas) {
    bossRushArenaCanvas = buildBossRushArenaCanvas(w);
    bossRushArenaWorld = w;
  }
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(bossRushArenaCanvas, 0, 0);
  const r = w.exit,
    cx = r.cx * TILE + TILE / 2,
    top = r.y * TILE,
    gm = G.run.guardianMode,
    t = save.motion ? 0 : G.tAll;
  for (let i = 0; i < 10; i++) {
    const x = cx + (i - 4.5) * 54,
      done = i < gm.defeated,
      current = i === gm.index,
      color = done ? '#ffda85' : current ? '#e9a94f' : '#493b2b';
    ctx.fillStyle = color;
    ctx.globalAlpha = current && !done ? 0.6 + Math.sin(t * 2.8) * 0.18 : 1;
    ctx.fillRect(x - 7, top - 10, 14, 2);
    ctx.fillRect(x - 2, top - 14, 4, 3);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

const bossRushDrawTiles = drawTiles;
drawTiles = function (ctx) {
  if (G.run?.mode === 'rush' && G.world?.bossRushArena) drawBossRushArena(ctx);
  else bossRushDrawTiles(ctx);
};
const bossRushDrawFloorDetails = drawPixelFloorDetails;
drawPixelFloorDetails = function (ctx) {
  if (!G.world?.bossRushArena) bossRushDrawFloorDetails(ctx);
};
const bossRushDrawTorches = drawTorches;
drawTorches = function (ctx) {
  if (!G.world?.bossRushArena) return bossRushDrawTorches(ctx);
  const t = save.motion ? 0 : G.tAll;
  for (const o of G.world.torches) {
    if (
      o.x < G.cam.x - 45 ||
      o.x > G.cam.x + G.w + 45 ||
      o.y < G.cam.y - 45 ||
      o.y > G.cam.y + G.h + 45
    )
      continue;
    glowImg('ember', o.x, o.y - 8, 39, 0.38 + Math.sin(t * 3 + o.s) * 0.04);
    drawSpr('flame', o.x, o.y - 8, 0.85, 0, 0.95, o.s);
    if (!save.motion) {
      const u = (t * 0.38 + o.s + 4) % 1;
      ctx.save();
      ctx.globalAlpha = (1 - u) * 0.7;
      ctx.fillStyle = '#ffd684';
      ctx.fillRect(Math.round(o.x + Math.sin(t + o.s) * 4), Math.round(o.y - 20 - u * 17), 2, 2);
      ctx.restore();
    }
  }
};
const bossRushDrawPortalChests = drawPortalChests;
drawPortalChests = function (ctx) {
  if (!G.world?.bossRushArena) bossRushDrawPortalChests(ctx);
};
