const TERRAIN_TRAP_VERSION = 1;
const TERRAIN_TRAP_THEMES = {
  hollow: ['pressure', 'arcwire'],
  garden: ['bramble', 'spore'],
  reservoir: ['ripple', 'sluice'],
  foundry: ['vent', 'slag'],
  observatory: ['prism', 'glass'],
  archive: ['inkline', 'stamp'],
  court: ['hush', 'ribbon'],
  choir: ['gust', 'chime'],
  citadel: ['shell', 'chain'],
  heart: ['rift', 'starfall'],
};
const TERRAIN_TRAP_COLORS = {
  hollow: ['#647b86', '#b9d7dc', '#d8bd7f'],
  garden: ['#5c7450', '#a2bd75', '#d7ca8a'],
  reservoir: ['#406575', '#98d3d8', '#b5dfdc'],
  foundry: ['#85654e', '#f1a15d', '#ffe1a0'],
  observatory: ['#657b8d', '#b0dde1', '#ebf7e7'],
  archive: ['#7e705a', '#b4a58c', '#e1d3ad'],
  court: ['#795461', '#bd8a9f', '#ecd4b1'],
  choir: ['#65738e', '#b4c1dd', '#e0dbe4'],
  citadel: ['#755453', '#be7b65', '#e9b993'],
  heart: ['#8d745b', '#e0bc78', '#fff0bd'],
};
let terrainSteeringActive = false;
const terrainSegmentCache = new WeakMap();
const terrainSteerCache = new WeakMap();

function terrainCampaign(w = G.world) {
  return !!(
    w?.rooms?.length &&
    G.run &&
    !['practice', 'rush', 'trial'].includes(G.run.mode) &&
    !w.bossRushArena &&
    !w.hearthTrial
  );
}
function terrainTheme(w = G.world) {
  return w?.region === 'late' ? w.lateKey : G.floor <= 5 ? 'hollow' : 'garden';
}
function terrainHash(text) {
  let n = 2166136261;
  for (const c of String(text)) n = Math.imul(n ^ c.charCodeAt(0), 16777619);
  return n >>> 0;
}
function terrainBlockedRooms(w) {
  const exitIndex = w.rooms.findIndex(
    (r) =>
      r === w.exit ||
      (w.exit && r.x === w.exit.x && r.y === w.exit.y && r.w === w.exit.w && r.h === w.exit.h)
  );
  return new Set([
    0,
    exitIndex,
    w.storyRoom,
    w.secretRoom?.roomIndex,
    ...(w.echoSanctuaries || []),
    ...(w.specialEncounters || []).map((s) => s.roomIndex),
  ]);
}
function terrainSegments(h) {
  const cached = terrainSegmentCache.get(h);
  if (cached) return cached;
  const a = h.a || 0,
    length = h.len || 112,
    ax = Math.cos(a),
    ay = Math.sin(a),
    segment = (x1, y1, x2, y2) => ({
      x1: h.x + x1 * ax - y1 * ay,
      y1: h.y + x1 * ay + y1 * ax,
      x2: h.x + x2 * ax - y2 * ay,
      y2: h.y + x2 * ay + y2 * ax,
    });
  let segments;
  if (h.type === 'bramble')
    segments = [
      segment(-length * 0.5, 0, length * 0.5, 0),
      segment(-length * 0.16, 0, length * 0.05, -34),
      segment(length * 0.12, 0, length * 0.31, 32),
    ];
  else if (h.type === 'ribbon')
    segments = [segment(-length * 0.5, -21, length * 0.5, 21), segment(-25, 29, 25, -29)];
  else if (h.type === 'starfall')
    segments = [0, 1, 2].map((i) => {
      const b = (i * TAU) / 3;
      return segment(0, 0, Math.cos(b) * 49, Math.sin(b) * 49);
    });
  else segments = [segment(-length * 0.5, 0, length * 0.5, 0)];
  terrainSegmentCache.set(h, segments);
  return segments;
}
function terrainShape(h) {
  if (['pressure', 'glass', 'stamp'].includes(h.type)) return 'plate';
  if (['ripple', 'hush', 'chime'].includes(h.type)) return 'ring';
  if (['spore', 'slag', 'shell', 'rift'].includes(h.type)) return 'pool';
  return 'line';
}
function terrainActiveAge(h) {
  return h.phase === 'active' ? clamp(1 - h.t / h.activeT, 0, 1) : 0;
}
function terrainRingRadius(h) {
  return 12 + (h.radius - 12) * terrainActiveAge(h);
}
function terrainContact(h, actor, margin = 0, anticipate = false) {
  const r = (actor.r || 0) + margin,
    dx = actor.x - h.x,
    dy = actor.y - h.y,
    shape = terrainShape(h);
  if (shape === 'plate') {
    const ca = Math.cos(h.a || 0),
      sa = Math.sin(h.a || 0),
      x = dx * ca + dy * sa,
      y = -dx * sa + dy * ca,
      ox = Math.max(0, Math.abs(x) - h.w / 2),
      oy = Math.max(0, Math.abs(y) - h.h / 2);
    return ox * ox + oy * oy <= r * r;
  }
  if (shape === 'ring') {
    const distance = Math.hypot(dx, dy);
    return anticipate
      ? distance <= h.radius + r + 7
      : Math.abs(distance - terrainRingRadius(h)) <= r + 7;
  }
  if (shape === 'pool') return dx * dx + dy * dy <= (h.radius + r) ** 2;
  return terrainSegments(h).some(
    (s) => segmentDistance(actor.x, actor.y, s.x1, s.y1, s.x2, s.y2) <= (h.width || 8) + r
  );
}
function terrainRoomSafe(h, w, blocked = terrainBlockedRooms(w)) {
  const room = w.rooms[h.roomIndex];
  if (!room || blocked.has(h.roomIndex)) return false;
  const extent =
    terrainShape(h) === 'line'
      ? Math.max((h.len || 112) / 2 + 14, h.type === 'bramble' ? 45 : 0)
      : terrainShape(h) === 'plate'
        ? Math.hypot(h.w, h.h) / 2 + 12
        : h.radius + 15;
  if (
    h.x - extent < (room.x + 1) * TILE ||
    h.x + extent > (room.x + room.w - 1) * TILE ||
    h.y - extent < (room.y + 1) * TILE ||
    h.y + extent > (room.y + room.h - 1) * TILE
  )
    return false;
  const objects = [
    ...(w.fixtures || []),
    ...(w.lateFixtures || []),
    ...(w.secretRoom ? [w.secretRoom] : []),
    ...(G.chests || []),
    ...(G.portal ? [G.portal] : []),
  ];
  if (objects.some((o) => Math.hypot(o.x - h.x, o.y - h.y) < extent + 85)) return false;
  for (const s of terrainSegments({ ...h, len: Math.min(h.len || 80, extent * 2) }))
    for (const p of [{ x: s.x1, y: s.y1 }, { x: s.x2, y: s.y2 }, h])
      if (solidPx(w, p.x, p.y)) return false;
  return true;
}
function terrainCreateTrap(w, roomIndex, serial, theme, seed) {
  const room = w.rooms[roomIndex],
    types = TERRAIN_TRAP_THEMES[theme] || TERRAIN_TRAP_THEMES.heart,
    type = types[(serial + Math.floor(G.floor / 2)) % types.length],
    early = G.floor <= 5,
    quadrant = (seed >>> 3) % 4,
    shift = Math.min(room.w, room.h) * TILE * 0.13,
    h = {
      id: 'terrain-' + G.floor + '-' + roomIndex + '-' + serial,
      roomIndex,
      type,
      theme,
      environmental: true,
      x: (room.cx + 0.5) * TILE + (quadrant & 1 ? shift : -shift),
      y: (room.cy + 0.5) * TILE + (quadrant & 2 ? shift * 0.6 : -shift * 0.6),
      a: (seed & 2 ? Math.PI / 2 : 0) + (['ribbon', 'starfall'].includes(type) ? 0.3 : 0),
      len: early ? 82 : Math.min(136, (Math.min(room.w, room.h) - 5) * TILE),
      width: type === 'vent' || type === 'sluice' || type === 'gust' ? 12 : 7,
      radius: early ? 39 : type === 'ripple' || type === 'chime' || type === 'hush' ? 65 : 43,
      w: early ? 64 : type === 'stamp' ? 76 : 82,
      h: type === 'stamp' ? 54 : 28,
      phase: 'rest',
      t: 1.8 + (seed % 210) / 100,
      restT: (early ? 4.3 : 3.1) + (seed % 120) / 100,
      warnT: early ? 1.05 : 0.82,
      activeT: ['ripple', 'hush', 'chime'].includes(type)
        ? 1.05
        : ['pressure', 'glass', 'stamp', 'shell', 'starfall'].includes(type)
          ? 0.52
          : 0.82,
      damage: early ? 7 : G.floor <= 10 ? 9 : Math.min(150, 8 + Math.floor(G.floor / 8)),
      seed,
      playerCd: 0,
      enemyHits: {},
    };
  for (const scale of [1, 0.7, 0.35, 0]) {
    h.x = (room.cx + 0.5) * TILE + (quadrant & 1 ? shift : -shift) * scale;
    h.y = (room.cy + 0.5) * TILE + (quadrant & 2 ? shift * 0.6 : -shift * 0.6) * scale;
    if (terrainRoomSafe(h, w)) return h;
  }
  return null;
}
function refreshEnvironmentalTraps(w = G.world) {
  if (!w) return;
  if (!terrainCampaign(w)) {
    w.terrainTraps = [];
    return;
  }
  const blocked = terrainBlockedRooms(w),
    theme = terrainTheme(w);
  if (w.terrainTrapVersion === TERRAIN_TRAP_VERSION && Array.isArray(w.terrainTraps)) {
    w.terrainTraps = w.terrainTraps.filter((h) => terrainRoomSafe(h, w, blocked));
    return;
  }
  w.hazards = (w.hazards || []).filter((h) => h.boss || h.ownerUid);
  w.lateHazards = (w.lateHazards || []).filter((h) => h.boss || h.ownerUid || h.authored);
  const seed = terrainHash(
      (G.run.runner?.seed || 'descent') +
        '|' +
        G.floor +
        '|' +
        w.rooms.map((r) => r.x + ':' + r.y).join(',')
    ),
    rooms = w.rooms
      .map((r, i) => ({ i, r, roll: terrainHash(seed + ':' + i) }))
      .filter(({ i, r }) => !blocked.has(i) && r.w >= 7 && r.h >= 7)
      .sort((a, b) => a.roll - b.roll),
    target = Math.min(
      rooms.length,
      G.floor === 1
        ? 1
        : G.floor <= 3
          ? 2
          : G.floor <= 10
            ? 3
            : Math.max(3, Math.ceil(rooms.length * 0.7))
    );
  w.terrainTraps = [];
  for (const room of rooms) {
    const h = terrainCreateTrap(w, room.i, w.terrainTraps.length, theme, room.roll);
    if (h) w.terrainTraps.push(h);
    if (w.terrainTraps.length >= Math.min(7, target)) break;
  }
  w.terrainTrapVersion = TERRAIN_TRAP_VERSION;
}
function terrainHurtEnemy(e, h) {
  if (e.dead || e.isBoss || e.mechanism || e.growth || !Number.isFinite(e.hp)) return;
  const amount = Math.max(
    1,
    Math.round(
      Math.min(e.max * 0.24, Math.max(7, e.max * (e.elite ? 0.12 : 0.17) + G.floor * 0.12))
    )
  );
  e.hp -= amount;
  e.hitT = 0.13;
  if (h.type === 'gust' || h.type === 'sluice') {
    e.kbx = (e.kbx || 0) + Math.cos(h.a) * 90;
    e.kby = (e.kby || 0) + Math.sin(h.a) * 90;
  }
  if (typeof addText === 'function') addText(e.x, e.y - e.r - 5, amount, '#c4d3c6', 11);
  if (e.hp <= 0) killEnemy(e);
}
function tickEnvironmentalTraps(dt) {
  const w = G.world,
    p = G.player;
  if (
    G.state !== 'playing' ||
    G.descending ||
    !terrainCampaign(w) ||
    !p ||
    !Array.isArray(w.terrainTraps)
  )
    return;
  for (const h of w.terrainTraps) {
    h.playerCd = Math.max(0, (h.playerCd || 0) - dt);
    for (const uid of Object.keys(h.enemyHits || {})) {
      h.enemyHits[uid] -= dt;
      if (h.enemyHits[uid] <= 0) delete h.enemyHits[uid];
    }
    h.t -= dt;
    if (h.t <= 0) {
      if (h.phase === 'rest') {
        h.phase = 'warn';
        h.t = h.warnT;
      } else if (h.phase === 'warn') {
        h.phase = 'active';
        h.t = h.activeT;
        if (d2(h.x, h.y, p.x, p.y) < 420 ** 2) sfx(h.type === 'shell' ? 'roar2' : 'eshoot');
      } else {
        h.phase = 'rest';
        h.t = h.restT;
      }
    }
    if (h.phase !== 'active') continue;
    if (h.playerCd <= 0 && terrainContact(h, p)) {
      h.playerCd = 0.62;
      if (h.type === 'gust' || h.type === 'sluice') {
        p.kbx += Math.cos(h.a) * 130;
        p.kby += Math.sin(h.a) * 130;
      }
      hurtPlayer(h.damage, h.x, h.y);
      if (G.dead) return;
    }
    for (const e of G.enemies || []) {
      if (e.dead || e.isBoss || e.mechanism || e.growth || !e.uid || h.enemyHits[e.uid]) continue;
      if (!terrainContact(h, e)) continue;
      h.enemyHits[e.uid] = 0.72;
      terrainHurtEnemy(e, h);
    }
  }
}
function terrainMovementRisk(traps, e, x, y) {
  let risk = 0;
  for (const h of traps) {
    if (h.phase === 'rest' || (h.phase === 'warn' && h.t > 0.62)) continue;
    if (Math.abs(h.x - x) > 190 || Math.abs(h.y - y) > 190) continue;
    if (terrainContact(h, { x, y, r: e.r }, 11, true)) risk += h.phase === 'active' ? 1 : 0.72;
  }
  return risk;
}
function terrainSteer(w, e, dx, dy) {
  const traps = w.terrainTraps,
    step = Math.hypot(dx, dy);
  if (
    !traps?.length ||
    step < 0.1 ||
    e === G.player ||
    !e.uid ||
    e.isBoss ||
    e.mechanism ||
    e.growth ||
    !e.aggro ||
    ['leap', 'strike'].includes(e.action) ||
    ['dash', 'phase'].includes(e.specialMode) ||
    Math.hypot(e.kbx || 0, e.kby || 0) > 55
  )
    return { x: dx, y: dy };
  const now = G.t || 0,
    known = terrainSteerCache.get(e),
    remember = (angle, speed) => {
      terrainSteerCache.set(e, {
        world: w,
        traps,
        next: now + 0.12 + (e.uid % 5) * 0.013,
        ux: dx / step,
        uy: dy / step,
        ca: Math.cos(angle),
        sa: Math.sin(angle),
        speed,
      });
      return {
        x: (dx * Math.cos(angle) - dy * Math.sin(angle)) * speed,
        y: (dx * Math.sin(angle) + dy * Math.cos(angle)) * speed,
      };
    };
  if (
    known?.world === w &&
    known.traps === traps &&
    now < known.next &&
    (known.ux * dx + known.uy * dy) / step > 0.6
  )
    return {
      x: (dx * known.ca - dy * known.sa) * known.speed,
      y: (dx * known.sa + dy * known.ca) * known.speed,
    };
  const length = Math.min(60, Math.max(30, (e.spd || 80) * 0.4)),
    a = Math.atan2(dy, dx),
    score = (angle) => {
      const ux = Math.cos(angle),
        uy = Math.sin(angle),
        x = e.x + ux * length,
        y = e.y + uy * length,
        r = e.r + 3;
      if (
        solidPx(w, x - r, y) ||
        solidPx(w, x + r, y) ||
        solidPx(w, x, y - r) ||
        solidPx(w, x, y + r)
      )
        return 100;
      return (
        terrainMovementRisk(traps, e, x, y) +
        terrainMovementRisk(traps, e, e.x + ux * length * 0.45, e.y + uy * length * 0.45) * 0.7
      );
    };
  if (
    terrainMovementRisk(traps, e, e.x + Math.cos(a) * length, e.y + Math.sin(a) * length) +
      terrainMovementRisk(
        traps,
        e,
        e.x + Math.cos(a) * length * 0.45,
        e.y + Math.sin(a) * length * 0.45
      ) <=
    0
  )
    return remember(0, 1);
  const original = score(a);
  const side = e.terrainSide || (e.terrainSide = e.uid & 1 ? 1 : -1);
  let best = original,
    angle = a;
  for (const offset of [0.66, -0.66, 1.16, -1.16, 1.6, -1.6]) {
    const next = a + offset * side,
      risk = score(next) + Math.abs(offset) * 0.12;
    if (risk + 0.08 < best) {
      best = risk;
      angle = next;
    }
  }
  const speed = angle === a ? 0.72 : 0.88;
  return remember(angle - a, speed);
}

function terrainPixel(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
}
function terrainPanel(ctx, x, y, w, h, color, light) {
  terrainPixel(ctx, x - 2, y + 3, w + 4, h + 2, '#0d1115');
  terrainPixel(ctx, x, y, w, h, color);
  terrainPixel(ctx, x, y, w, 2, light);
  terrainPixel(ctx, x, y + 2, 2, h - 2, light);
  terrainPixel(ctx, x + 2, y + h - 2, w - 2, 2, '#24272a');
  for (const ax of [x + 4, x + w - 6])
    for (const ay of [y + 4, y + h - 6]) {
      terrainPixel(ctx, ax, ay, 3, 3, '#171d23');
      terrainPixel(ctx, ax, ay, 1, 1, light);
    }
}
function terrainPixelRing(ctx, radius, color, t = 0, broken = false) {
  for (let i = 0; i < 52; i++) {
    if (broken && (i + Math.floor(t * 7)) % 7 < 2) continue;
    const a = (i * TAU) / 52,
      r = radius + (broken ? Math.sin(a * 5 + t * 2) * 1.4 : 0);
    terrainPixel(ctx, Math.cos(a) * r - 1, Math.sin(a) * r - 1, 3, 2, color);
  }
}
function terrainDrawLine(ctx, h, color, width, progress = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = 'miter';
  ctx.lineCap = 'butt';
  for (const s of terrainSegments({ ...h, x: 0, y: 0, a: 0 })) {
    ctx.beginPath();
    ctx.moveTo(s.x1, s.y1);
    ctx.lineTo(lerp(s.x1, s.x2, progress), lerp(s.y1, s.y2, progress));
    ctx.stroke();
  }
}
function drawEnvironmentalTrap(ctx, h) {
  const pal = TERRAIN_TRAP_COLORS[h.theme] || TERRAIN_TRAP_COLORS.heart,
    metal = pal[0],
    light = pal[1],
    hot = pal[2],
    active = h.phase === 'active',
    warn = h.phase === 'warn',
    u = warn ? clamp(1 - h.t / h.warnT, 0, 1) : terrainActiveAge(h),
    t = save.motion ? 0 : G.tAll,
    life = active ? Math.sin(Math.PI * u) : warn ? u * 0.3 : 0;
  ctx.save();
  ctx.translate(Math.round(h.x), Math.round(h.y));
  ctx.rotate(h.a || 0);
  ctx.imageSmoothingEnabled = false;
  if (['pressure', 'glass', 'stamp'].includes(h.type)) {
    terrainPanel(ctx, -h.w / 2, -h.h / 2, h.w, h.h, '#333c40', metal);
    for (let x = -h.w / 2 + 11; x < h.w / 2 - 7; x += 12) {
      terrainPixel(ctx, x, -h.h / 2 + 7, 4, h.h - 14, '#111b20');
      const height = h.type === 'glass' ? 7 + (Math.round(x) & 7) : 12;
      if (h.type !== 'stamp' && (active || (warn && u > 0.65))) {
        const rise = active ? 1 : (u - 0.65) / 0.35;
        ctx.fillStyle = h.type === 'glass' ? '#bddbd9' : '#c0c9c3';
        ctx.beginPath();
        ctx.moveTo(x - 2, 5);
        ctx.lineTo(x + 1, 5 - height * rise);
        ctx.lineTo(x + 5, 5);
        ctx.closePath();
        ctx.fill();
        terrainPixel(ctx, x + 1, 2 - height * rise, 1, height * rise, light);
        if (h.type === 'glass')
          terrainPixel(ctx, x + 2, 5 - height * rise * 0.65, 2, height * rise * 0.55, '#79a9b6');
      }
    }
    if (h.type === 'stamp') {
      terrainPixel(ctx, -h.w / 2 - 8, -h.h / 2 - 18, 6, h.h + 27, '#394249');
      terrainPixel(ctx, h.w / 2 + 2, -h.h / 2 - 18, 6, h.h + 27, '#394249');
      const drop = active ? life * 19 : warn ? u * 4 : 0;
      terrainPanel(ctx, -h.w / 2 - 5, -h.h / 2 - 25 + drop, h.w + 10, 10, '#594b43', metal);
      terrainPixel(ctx, -17, -h.h / 2 - 22 + drop, 34, 3, '#a89973');
      terrainPixel(ctx, -13, -9, 26, 19, '#29232b');
      terrainPixel(ctx, -9, -6, 18, 3, '#9e8f78');
      terrainPixel(ctx, -3, -3, 6, 9, '#8c7a64');
      terrainPixel(ctx, -9, 5, 18, 2, '#9e8f78');
      for (const [x, y, angle] of [
        [-h.w / 2 - 12, 13, -0.2],
        [h.w / 2 + 11, 15, 0.3],
      ]) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        terrainPixel(ctx, -6, -4, 12, 9, '#8c8574');
        terrainPixel(ctx, -5, -5, 11, 2, '#b4ac95');
        terrainPixel(ctx, -3, -1, 7, 1, '#59544b');
        ctx.restore();
      }
    }
    if (warn)
      for (let x = -h.w / 2 + 5; x < h.w / 2; x += 12)
        terrainPixel(ctx, x, h.h / 2 - 4, 5, 2, u > 0.6 ? hot : light);
  } else if (h.type === 'bramble' || h.type === 'ribbon' || h.type === 'starfall') {
    terrainDrawLine(ctx, h, '#111c1b', active ? 14 : 9);
    terrainDrawLine(ctx, h, h.type === 'bramble' ? '#4a5a37' : metal, active ? 8 : 5);
    terrainDrawLine(ctx, h, active ? light : '#78866a', 2, warn ? 0.2 + u * 0.8 : 1);
    if (h.type === 'bramble') {
      for (const [x, y] of [
        [-18, 0],
        [14, 0],
        [-56, 0],
        [56, 0],
      ]) {
        terrainPixel(ctx, x - 5, y + 2, 10, 4, '#2d392b');
        terrainPixel(ctx, x - 3, y - 3, 6, 6, '#536340');
        terrainPixel(ctx, x - 2, y - 3, 4, 1, '#9eae71');
        terrainPixel(ctx, x + 6, y + 4, 3, 2, '#50503e');
      }
      for (const [x, y, side] of [
        [-32, 0, -1],
        [39, 0, 1],
        [2, -27, 1],
        [30, 26, -1],
      ]) {
        terrainPixel(ctx, x + side * 2, y - 3, 6, 3, '#667c45');
        terrainPixel(ctx, x + side * 4, y - 4, 4, 1, '#a6b77a');
      }
    }
    if (h.type === 'ribbon') {
      terrainDrawLine(ctx, h, '#895f75', 7);
      terrainDrawLine(ctx, h, active ? '#e4b6b2' : '#c0969e', 1);
      for (const [x, y] of [
        [-56, -21],
        [56, 21],
        [-25, 29],
        [25, -29],
      ]) {
        terrainPanel(ctx, x - 4, y - 4, 8, 8, '#735a4c', '#bd9e71');
        terrainPixel(ctx, x - 1, y - 1, 3, 3, '#e7cc99');
      }
    }
    for (const s of terrainSegments({ ...h, x: 0, y: 0, a: 0 })) {
      const length = Math.hypot(s.x2 - s.x1, s.y2 - s.y1),
        n = Math.floor(length / 13);
      for (let i = 1; i < n; i++) {
        const v = i / n,
          x = lerp(s.x1, s.x2, v),
          y = lerp(s.y1, s.y2, v),
          a = Math.atan2(s.y2 - s.y1, s.x2 - s.x1),
          side = i & 1 ? 1 : -1,
          rise = active ? 9 : warn ? 3 + u * 4 : 2;
        ctx.fillStyle = active ? hot : metal;
        ctx.beginPath();
        ctx.moveTo(x - 3, y);
        ctx.lineTo(x - Math.sin(a) * side * rise, y + Math.cos(a) * side * rise);
        ctx.lineTo(x + 3, y + 2);
        ctx.closePath();
        ctx.fill();
      }
    }
    if (h.type === 'starfall') {
      terrainPixelRing(ctx, 12, metal);
      terrainPixel(ctx, -4, -4, 8, 8, active ? hot : '#806b4e');
      if (active)
        for (let i = 0; i < 3; i++) {
          const a = (i * TAU) / 3,
            distance = 20 + u * 29,
            x = Math.cos(a) * distance,
            y = Math.sin(a) * distance;
          terrainPixel(ctx, x - 4, y - 2, 9, 4, hot);
          terrainPixel(ctx, x - 2, y - 5, 4, 11, light);
          terrainPixel(ctx, x - 1, y - 2, 2, 4, '#fff7d9');
        }
    }
  } else if (terrainShape(h) === 'line') {
    const length = h.len || 112;
    terrainDrawLine(ctx, h, '#0d1419', h.width * 2 + 5);
    terrainDrawLine(ctx, h, h.type === 'inkline' ? '#27202a' : '#344047', h.width * 2);
    for (let x = -length / 2 + 6; x < length / 2 - 4; x += 10) {
      terrainPixel(ctx, x, -h.width, 2, h.width * 2, metal);
      if (h.type === 'vent') terrainPixel(ctx, x + 3, -h.width + 3, 3, h.width * 2 - 6, '#171416');
    }
    for (const side of [-1, 1]) {
      const x = (side * length) / 2;
      terrainPanel(ctx, x - 8, -14, 16, 28, '#38434a', metal);
      terrainPixel(ctx, x - 3, -6, 6, 12, active ? hot : warn ? light : '#59706e');
      terrainPixel(ctx, x - 5, -12, 10, 3, light);
      if (h.type === 'arcwire') {
        for (let y = -8; y <= 7; y += 5) {
          terrainPixel(ctx, x - 6, y, 12, 2, '#ad8b62');
          terrainPixel(ctx, x - 5, y, 4, 1, '#d8ba83');
        }
      }
    }
    if (h.type === 'sluice') {
      terrainPixel(ctx, -length / 2 + 8, -h.width + 3, length - 16, h.width * 2 - 6, '#244754');
      for (let x = -length / 2 + 14; x < length / 2 - 8; x += 18) {
        terrainPixel(ctx, x, 3, 8, 2, '#668f97');
        terrainPixel(ctx, x - 4, -5, 7, 1, '#416b7a');
      }
      terrainPanel(ctx, -length / 2 - 14, -21, 10, 42, '#41535a', '#8aa3a4');
      const gate = active ? 10 : warn ? u * 7 : 0;
      for (let i = -1; i <= 1; i++)
        terrainPixel(ctx, -length / 2 + i * 5 - 2, -10 - gate, 2, 20, '#9eafad');
    }
    if (h.type === 'inkline') {
      terrainDrawLine(ctx, h, '#30242f', 17);
      for (let x = -length / 2 + 12; x < length / 2 - 8; x += 11) {
        const y = Math.sin(x * 0.7) * 9;
        terrainPixel(ctx, x, y - 1, 6, 3, '#352b3b');
        terrainPixel(ctx, x + 3, y + 3, 2, 2, '#6b5963');
      }
      terrainPixel(ctx, -length / 2 - 4, -10, 8, 17, '#1d1a26');
      terrainPixel(ctx, length / 2 - 1, -25, 3, 18, '#c2b697');
      terrainPixel(ctx, length / 2 + 1, -23, 6, 10, '#a6967e');
    }
    if (h.type === 'gust') {
      for (const side of [-1, 1]) {
        const x = (side * length) / 2;
        terrainPanel(ctx, x - 8, -25, 16, 16, '#4a4e60', '#8e9fb8');
        for (let i = 0; i < 3; i++)
          terrainPixel(ctx, x - 5 + i * 4, -30 - i * 3, 2, 10 + i * 3, '#a3b5c9');
        terrainPixel(ctx, x - 4, -20, 8, 6, '#202b39');
      }
    }
    if (h.type === 'prism') {
      for (const side of [-1, 1]) {
        const x = (side * length) / 2;
        ctx.fillStyle = active ? hot : '#abc9cb';
        ctx.beginPath();
        ctx.moveTo(x, -21);
        ctx.lineTo(x + 9, -10);
        ctx.lineTo(x, -1);
        ctx.lineTo(x - 9, -10);
        ctx.closePath();
        ctx.fill();
        terrainPixel(ctx, x - 2, -17, 2, 8, '#eff2dd');
      }
    }
    if (active) {
      if (['vent', 'gust', 'sluice'].includes(h.type)) {
        for (let x = -length / 2 + 10; x < length / 2 - 8; x += 13) {
          const flow = save.motion ? 0 : (t * 47 + x * 0.1) % 12;
          for (const side of [-1, 1]) {
            terrainPixel(ctx, x + flow, side * (3 + ((x + 200) % 7)), 7, 3, light);
            if (h.type === 'vent')
              terrainPixel(ctx, x + flow - 2, -9 - life * 14 - ((x + 200) % 8), 4, 7, hot);
          }
        }
      } else if (h.type === 'chain') {
        const slide = save.motion ? 0 : Math.sin(t * 15) * 5;
        for (let x = -length / 2 + 12; x < length / 2 - 9; x += 13) {
          terrainPanel(ctx, x + slide - 5, -6, 10, 12, '#8e8b82', light);
          terrainPixel(ctx, x + slide - 2, -4, 4, 8, '#2a262a');
        }
      } else {
        terrainDrawLine(ctx, h, light, h.type === 'inkline' ? 9 : 5);
        terrainDrawLine(ctx, h, hot, 2);
        if (h.type === 'arcwire')
          for (let x = -length / 2 + 9; x < length / 2 - 8; x += 13) {
            const y = Math.sin(x * 0.3 + t * 18) * 5;
            terrainPixel(ctx, x, y - 1, 5, 2, '#eaf3db');
          }
      }
    } else if (warn) terrainDrawLine(ctx, h, light, 2, u);
  } else if (terrainShape(h) === 'ring') {
    terrainPixelRing(ctx, 12, '#263139');
    terrainPixelRing(ctx, 9, metal);
    if (h.type === 'ripple') {
      terrainPixel(ctx, -4, -7, 8, 13, '#1c363f');
      terrainPixel(ctx, -3, -7, 2, 10, '#93b9bd');
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        terrainPixel(ctx, Math.cos(a) * 17 - 2, Math.sin(a) * 17 - 2, 5, 4, '#425660');
      }
    } else {
      terrainPanel(ctx, -12, -15, 24, 28, '#433c3d', metal);
      terrainPixel(ctx, -5, -24, 3, 13, metal);
      terrainPixel(ctx, 3, -24, 3, 13, light);
      terrainPixel(ctx, -8, -27, 16, 4, metal);
      terrainPixel(ctx, -6, -12, 12, 13, active || warn ? hot : light);
      terrainPixel(ctx, -9, 0, 18, 3, '#312e37');
    }
    if (warn) {
      const ring = 19 + u * 10;
      terrainPixelRing(ctx, ring, light, t, true);
      terrainPixel(ctx, -1, -3, 3, 4, hot);
    }
    if (active) {
      terrainPixelRing(ctx, terrainRingRadius(h), light, t, true);
      terrainPixelRing(ctx, Math.max(7, terrainRingRadius(h) - 5), hot, t + 1, true);
    }
  } else {
    const r = h.radius;
    for (let i = 0; i < 17; i++) {
      const a = i * 2.399 + h.seed,
        distance = (0.15 + (i % 6) * 0.12) * r,
        x = Math.cos(a) * distance,
        y = Math.sin(a) * distance;
      terrainPixel(
        ctx,
        x - 4,
        y - 2,
        8 + (i % 3) * 2,
        3,
        h.type === 'spore' ? '#303b2e' : '#302b2d'
      );
      if (h.type === 'slag') terrainPixel(ctx, x, y, 4, 1, '#6e4231');
    }
    terrainPixelRing(ctx, r - 5, '#263031', 0, true);
    for (let i = 0; i < 10; i++) {
      const a = (i * TAU) / 10,
        x = Math.cos(a) * (r - 9),
        y = Math.sin(a) * (r - 9);
      terrainPixel(ctx, x - 4, y - 3, 8, 6, metal);
      terrainPixel(ctx, x - 3, y - 3, 6, 1, light);
    }
    if (h.type === 'spore') {
      for (const [x, y, s] of [
        [-10, 4, 11],
        [9, -6, 8],
        [3, 12, 6],
      ]) {
        terrainPixel(ctx, x - 2, y - s, 4, s, '#778365');
        terrainPixel(ctx, x - s / 2, y - s - 4, s + 2, 5, '#929e75');
        terrainPixel(ctx, x - 2, y - s - 4, 3, 2, '#cad1a3');
      }
    } else if (h.type === 'shell') {
      terrainPanel(ctx, -14, -13, 28, 26, '#494147', metal);
      terrainPixel(ctx, -9, -8, 18, 16, '#161b22');
      for (let i = -1; i <= 1; i++) terrainPixel(ctx, i * 6 - 1, -7, 2, 14, light);
    } else if (h.type === 'slag') {
      terrainPanel(ctx, -15, -11, 30, 22, '#4c3c33', metal);
      terrainPixel(ctx, -10, -6, 20, 10, active ? '#ffcb7e' : '#b66944');
      terrainPixel(ctx, -7, -5, 5, 3, '#f2ae62');
    } else {
      for (let i = 0; i < 4; i++) {
        const a = i * 1.7;
        ctx.save();
        ctx.rotate(a);
        terrainPixel(ctx, 5, -4, 27, 7, '#171822');
        terrainPixel(ctx, 25, -4, 8, 3, '#554556');
        terrainPixel(ctx, 30, -10, 3, 9, '#3f3a45');
        ctx.restore();
      }
      for (let i = 0; i < 5; i++) {
        const a = (i * TAU) / 5;
        ctx.save();
        ctx.rotate(a);
        terrainPixel(ctx, 8, -3, 17, 6, '#6e5f54');
        terrainPixel(ctx, 10, -3, 11, 2, light);
        ctx.restore();
      }
      terrainPixelRing(ctx, 8, light);
    }
    if (warn || active) {
      const count = active ? 19 : 7;
      for (let i = 0; i < count; i++) {
        const a = i * 2.399 + h.seed,
          distance = (0.25 + (i % 5) * 0.14) * r,
          x = Math.cos(a) * distance,
          y = Math.sin(a) * distance,
          lift = active && !save.motion ? (t * 19 + i * 4) % 13 : 0;
        terrainPixel(ctx, x, y - lift, i % 4 ? 3 : 5, 2, active ? light : metal);
        if (active && i % 3 === 0) terrainPixel(ctx, x + 1, y - lift - 3, 2, 3, hot);
      }
      if (active) terrainPixelRing(ctx, r - 1, light, t, true);
    }
  }
  ctx.restore();
}
function drawEnvironmentalTraps(ctx) {
  if (!terrainCampaign() || !Array.isArray(G.world.terrainTraps)) return;
  for (const h of G.world.terrainTraps)
    if (
      h.x > G.cam.x - 150 &&
      h.y > G.cam.y - 150 &&
      h.x < G.cam.x + G.w + 150 &&
      h.y < G.cam.y + G.h + 150
    )
      drawEnvironmentalTrap(ctx, h);
}

const terrainSetupFloor = setupFloor;
setupFloor = function (floor) {
  const result = terrainSetupFloor(floor);
  refreshEnvironmentalTraps();
  return result;
};
const terrainResumeRun = resumeRun;
resumeRun = function () {
  const result = terrainResumeRun();
  refreshEnvironmentalTraps();
  return result;
};
const terrainUpdateEnemies = updateEnemies;
updateEnemies = function (dt) {
  tickEnvironmentalTraps(dt);
  if (G.dead || G.state !== 'playing') return;
  terrainSteeringActive = true;
  try {
    return terrainUpdateEnemies(dt);
  } finally {
    terrainSteeringActive = false;
  }
};
const terrainMoveEnt = moveEnt;
moveEnt = function (w, e, dx, dy) {
  if (terrainSteeringActive && w === G.world) {
    const move = terrainSteer(w, e, dx, dy);
    dx = move.x;
    dy = move.y;
  }
  return terrainMoveEnt(w, e, dx, dy);
};
const terrainDrawProps = drawProps;
drawProps = function (ctx) {
  drawEnvironmentalTraps(ctx);
  return terrainDrawProps(ctx);
};
const terrainSnapshotRun = snapshotRun;
snapshotRun = function () {
  terrainSnapshotRun();
  if (save.resume && G.world?.terrainTraps) {
    save.resume.world.terrainTraps = deepCopy(G.world.terrainTraps);
    save.resume.world.terrainTrapVersion = TERRAIN_TRAP_VERSION;
  }
};
const terrainValidateCheckpoint = validateCheckpoint;
validateCheckpoint = function (r) {
  const result = terrainValidateCheckpoint(r),
    traps = r.world?.terrainTraps;
  if (traps === undefined) return result;
  if (
    !Array.isArray(traps) ||
    traps.length > 24 ||
    r.world.terrainTrapVersion !== TERRAIN_TRAP_VERSION
  )
    throw Error('Invalid environmental traps');
  const kinds = Object.values(TERRAIN_TRAP_THEMES).flat(),
    finite = (n, min, max) => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
  for (const h of traps) {
    if (
      !h ||
      !kinds.includes(h.type) ||
      !TERRAIN_TRAP_THEMES[h.theme]?.includes(h.type) ||
      typeof h.id !== 'string' ||
      h.id.length > 80 ||
      !Number.isInteger(h.roomIndex) ||
      !r.world.rooms[h.roomIndex] ||
      !finite(h.x, 0, r.world.W * TILE) ||
      !finite(h.y, 0, r.world.H * TILE) ||
      !finite(h.a, -TAU, TAU) ||
      !finite(h.len, 20, 220) ||
      !finite(h.width, 1, 24) ||
      !finite(h.radius, 10, 90) ||
      !finite(h.w, 10, 150) ||
      !finite(h.h, 10, 100) ||
      !['rest', 'warn', 'active'].includes(h.phase) ||
      !finite(h.t, -1, 12) ||
      !finite(h.restT, 1, 10) ||
      !finite(h.warnT, 0.5, 2) ||
      !finite(h.activeT, 0.2, 2) ||
      !finite(h.damage, 1, 500) ||
      !finite(h.playerCd || 0, 0, 1) ||
      !finite(h.seed, 0, 4294967295) ||
      !h.enemyHits ||
      typeof h.enemyHits !== 'object' ||
      Array.isArray(h.enemyHits) ||
      Object.keys(h.enemyHits).length > 200 ||
      Object.entries(h.enemyHits).some(([uid, cd]) => !/^\d+$/.test(uid) || !finite(cd, 0, 1))
    )
      throw Error('Invalid environmental trap data');
  }
  return result;
};
