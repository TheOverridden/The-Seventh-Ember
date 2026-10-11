const HEARTH_TRIAL_RULES = {
  crossfire: {
    region: 'heart',
    colors: ['#efc88b', '#705744', '#251f1b'],
    roster: ['starRemnant', 'pinion', 'keeperHand', 'oathbound', 'lampEel'],
    hint: 'Bolt only. The wall emitters aim before firing. Cross their lines during the warning.',
  },
  pursuit: {
    region: 'citadel',
    colors: ['#dda18b', '#725247', '#251d1c'],
    roster: ['chainHound', 'slagRunner', 'keeperHand', 'obsidianPawn', 'pinion'],
    hint: 'Dash is disabled. Break sight around the pillars; keep an escape route before using Flare.',
  },
  lastLight: {
    region: 'heart',
    colors: ['#ffe4a1', '#776441', '#24221a'],
    roster: ['memoryAsh', 'courtMask', 'keeperHand', 'oathbound', 'choirWisp'],
    hint: 'Follow the moving lantern. Its light shrinks each wave; the dark drains health.',
  },
  relay: {
    region: 'archive',
    colors: ['#d8d3ba', '#676556', '#20221d'],
    roster: ['inkMite', 'pageWraith', 'quillSentinel', 'mirrorShell', 'orbitHound'],
    hint: 'Hold inside the next marked beacon to light it. All four must be lit before the final clear.',
  },
  pressure: {
    region: 'reservoir',
    colors: ['#9fc5c6', '#506968', '#1a2426'],
    roster: ['obsidianPawn', 'pumpCrawler', 'cinderValve', 'hammerFrame', 'barrierKnight'],
    hint: 'Enemies resist distant hits. Their armor brackets turn gold when you are close enough to deal full damage.',
  },
  glasshouse: {
    region: 'observatory',
    colors: ['#c4def1', '#5e6878', '#20212d'],
    roster: ['glassShard', 'orbitHound', 'lensMote', 'mirrorShell', 'glassShard'],
    hint: 'Enemy shots bounce off walls. Your Bolt also ricochets once. Watch the return paths.',
  },
  gauntlet: {
    region: 'court',
    colors: ['#dfa7bd', '#715262', '#281d24'],
    roster: ['obsidianPawn', 'chainHound', 'keeperHand', 'oathbound', 'barrierKnight'],
    hint: 'Mixed enemy formations. Save Dash for the second attack and use Flare when they close in.',
  },
  cinderRain: {
    region: 'foundry',
    colors: ['#ffd29b', '#865a40', '#2d211b'],
    roster: ['coalMite', 'slagRunner', 'cinderValve', 'hammerFrame', 'coalMite'],
    hint: 'Falling cinders lock onto the floor before striking. Move after each mark appears.',
  },
  twinFlames: {
    region: '',
    colors: ['#f9cd83', '#7d6546', '#25231b'],
    roster: ['mossSlime', 'petalBat', 'thornSpitter', 'barkback', 'gardenMite'],
    hint: 'Protect both braziers. Enemies arrive on alternating sides; intercept their seed volleys.',
  },
  blackout: {
    region: 'citadel',
    colors: ['#c7cbe5', '#5e6078', '#1b1c28'],
    roster: ['chainHound', 'obsidianPawn', 'keeperHand', 'barrierKnight', 'hushBell'],
    hint: 'Stay inside the turning light or the center. Dark ground burns; enemy warnings remain visible.',
  },
};
function hearthTrialSettings(id, tier) {
  const index = Object.keys(HEARTH_TRIAL_RULES).indexOf(id),
    advanced = index >= 0,
    threat = advanced ? 1.12 + index * 0.035 : 1,
    health = {
      oneHeart: [30, 30, 30],
      lastLight: [90, 75, 60],
      glasshouse: [110, 95, 80],
      pursuit: [120, 105, 90],
      blackout: [110, 95, 80],
    };
  return {
    waves: id === 'guardian' ? 1 : (advanced ? 5 : 4) + tier * 2,
    cap: id === 'guardian' ? 1 : [4, 7, 10][tier] + (advanced ? (tier === 2 ? 2 : 1) : 0),
    hpMul: [1, 1.65, 2.4][tier] * threat,
    speedMul: [1.06, 1.24, 1.42][tier] * Math.sqrt(threat),
    damage: Math.round([13, 19, 25][tier] * Math.sqrt(threat)),
    playerHp: (health[id] || [140, 120, 100])[tier],
    spawnGap: [0.9, 0.68, 0.5][tier],
    telegraph: [1.05, 0.95, 0.85][tier],
  };
}
function hearthTrialProtectsFlames() {
  return ['defense', 'twinFlames'].includes(hearthTrial?.id);
}
function hearthTrialTarget(e) {
  return e.trialFlame ? hearthTrial.flames[e.flameIndex || 0] : G.player;
}
function hearthTrialObjectivesMet() {
  const q = hearthTrial;
  return q.id === 'constellation' ? q.recovered === 3 : q.id === 'relay' ? q.recovered === 4 : true;
}
function moveHearthTrialShot(b, dt) {
  const nx = b.x + b.vx * dt,
    ny = b.y + b.vy * dt;
  if (!solidPx(G.world, nx, ny)) {
    b.x = nx;
    b.y = ny;
    return;
  }
  if (!(b.trialBounces > 0)) {
    b.life = 0;
    return;
  }
  const hitX = solidPx(G.world, nx, b.y),
    hitY = solidPx(G.world, b.x, ny);
  if (hitX || !hitY) b.vx *= -1;
  if (hitY || !hitX) b.vy *= -1;
  b.trialBounces--;
  burst(b.x, b.y, 3, '#d5efff', 55, 0.2, 2, true);
}
function initHearthTrialEvents() {
  const q = hearthTrial,
    cx = TILE * 14.5,
    cy = TILE * 10.5;
  q.events = { marks: [], clock: 3.5, cycle: 0, exposure: 0, light: { x: cx, y: cy, r: 220 } };
  q.guardianHazards = [];
  q.flameSpawned = 0;
  q.flames = [q.flame];
  if (q.id === 'twinFlames') {
    const hp = [100, 90, 80][q.tier];
    q.flames = [-175, 175].map((dx) => ({ x: cx + dx, y: cy, hp, max: hp, hitT: 0 }));
    q.flame = q.flames[0];
  }
  if (q.id === 'relay')
    q.runes = [
      { x: TILE * 7.5, y: TILE * 6.5 },
      { x: TILE * 21.5, y: TILE * 7.5 },
      { x: TILE * 21.5, y: TILE * 15.5 },
      { x: TILE * 7.5, y: TILE * 15.5 },
    ].map((point) => ({ ...point, recovered: false, held: 0 }));
}
function hearthTrialMark(type, x, y, extra = {}) {
  const q = hearthTrial;
  if (q.events.marks.length >= 32) return;
  q.events.marks.push({
    type,
    x,
    y,
    age: 0,
    warning: [0.95, 0.85, 0.75][q.tier],
    life: 1.6,
    fired: false,
    ...extra,
  });
}
function tickHearthTrialEvents(dt) {
  const q = hearthTrial,
    p = G.player,
    ev = q.events;
  if (!ev || q.result) return;
  ev.clock -= dt;
  if (q.id === 'relay') {
    const beacon = q.recovered < Math.min(4, q.wave) ? q.runes[q.recovered] : null;
    if (beacon && G.enemies.some((e) => !e.dead)) {
      const near = d2(p.x, p.y, beacon.x, beacon.y) < 38 ** 2;
      beacon.held = clamp(beacon.held + dt * (near ? 1 : -0.5), 0, 1.1 + q.tier * 0.25);
      if (beacon.held >= 1.1 + q.tier * 0.25) {
        beacon.recovered = true;
        q.recovered++;
        burst(beacon.x, beacon.y, 18, '#f8e7b0', 160, 0.6, 3, true);
        sfx('stitchPin');
      }
    }
  }
  if (q.id === 'lastLight') {
    ev.light.x = TILE * 14.5 + Math.sin(q.elapsed * 0.24) * 165;
    ev.light.y = TILE * 10.5 + Math.sin(q.elapsed * 0.37) * 112;
    ev.light.r = Math.max(125, [220, 195, 175][q.tier] - Math.max(0, q.wave - 1) * 7);
  }
  if (['lastLight', 'blackout'].includes(q.id)) {
    const cx = TILE * 14.5,
      cy = TILE * 10.5,
      dx = p.x - cx,
      dy = p.y - cy,
      angle = Math.atan2(dy, dx),
      turn = q.elapsed * [0.19, 0.25, 0.31][q.tier],
      safe =
        q.id === 'lastLight'
          ? d2(p.x, p.y, ev.light.x, ev.light.y) < (ev.light.r - p.r * 0.5) ** 2
          : Math.hypot(dx, dy) < 92 ||
            Math.min(Math.abs(angleDiff(angle, turn)), Math.abs(angleDiff(angle, turn + Math.PI))) <
              [0.58, 0.5, 0.44][q.tier];
    ev.exposure = safe || q.elapsed < 5 ? Math.max(0, ev.exposure - dt * 2) : ev.exposure + dt;
    if (ev.exposure >= 0.8) {
      hurtPlayer(
        [7, 10, 13][q.tier],
        q.id === 'lastLight' ? ev.light.x : cx,
        q.id === 'lastLight' ? ev.light.y : cy
      );
      ev.exposure = 0;
    }
  }
  if (ev.clock <= 0) {
    const cycle = ev.cycle++;
    if (q.id === 'crossfire') {
      for (const side of [cycle % 4, (cycle + 2) % 4]) {
        const point = hearthTrialGate(side);
        hearthTrialMark('volley', point.x, point.y, {
          a: Math.atan2(p.y - point.y, p.x - point.x),
          side,
          life: 1.15,
        });
      }
      ev.clock = [4.4, 3.5, 2.7][q.tier];
    } else if (q.id === 'cinderRain') {
      for (let i = 0; i <= q.tier; i++) {
        const a = cycle * 1.7 + i * 2.4,
          offset = i ? 75 + q.tier * 15 : 0,
          point = safePosition(G.world, p.x + Math.cos(a) * offset, p.y + Math.sin(a) * offset, 12);
        if (point) hearthTrialMark('cinder', point.x, point.y, { radius: 40 + q.tier * 4 });
      }
      ev.clock = [3.8, 2.9, 2.2][q.tier];
    } else if (q.id === 'relay' && q.tier > 0) {
      const beacon = q.recovered < Math.min(4, q.wave) ? q.runes[q.recovered] : null;
      if (beacon)
        hearthTrialMark('cinder', beacon.x, beacon.y, { radius: 46, warning: 1.5, life: 1.95 });
      ev.clock = q.tier === 2 ? 5 : 7;
    } else ev.clock = 5;
  }
  for (const mark of ev.marks) {
    mark.age += dt;
    if (mark.age < mark.warning) continue;
    if (!mark.fired) {
      mark.fired = true;
      if (mark.type === 'volley') {
        for (let i = -q.tier - 1; i <= q.tier + 1; i++) {
          enemyShoot(mark, mark.a + i * 0.1, 230 + q.tier * 30, q.settings.damage);
          G.ebul[G.ebul.length - 1].lateColor = '#f4c57d';
        }
      } else {
        burst(mark.x, mark.y, 14, '#ffd69b', 210, 0.45, 3, true);
        sfx('nova');
      }
    }
    if (mark.type === 'cinder' && d2(p.x, p.y, mark.x, mark.y) < (mark.radius + p.r) ** 2)
      hurtPlayer(q.settings.damage, mark.x, mark.y);
  }
  ev.marks = ev.marks.filter((mark) => mark.age < mark.life);
}
function drawHearthTrialLight(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.075;
  for (let dy = -r; dy <= r; dy += 6) {
    const width = Math.floor(Math.sqrt(Math.max(0, r * r - dy * dy)) / 6) * 6;
    ctx.fillRect(Math.round(x - width), Math.round(y + dy), width * 2, 6);
  }
  ctx.globalAlpha = 0.7;
  for (let i = 0; i < 80; i++) {
    const a = (i * TAU) / 80;
    ctx.fillRect(
      Math.round((x + Math.cos(a) * r) / 3) * 3,
      Math.round((y + Math.sin(a) * r) / 3) * 3,
      3,
      3
    );
  }
  ctx.globalAlpha = 1;
}
function drawHearthTrialEvents(ctx) {
  const q = hearthTrial,
    p = G.player,
    ev = q.events;
  if (!ev) return;
  ctx.save();
  if (['lastLight', 'blackout'].includes(q.id)) {
    ctx.beginPath();
    for (let y = 0; y < G.world.H; y++)
      for (let x = 0; x < G.world.W; x++) {
        if (G.world.grid[y * G.world.W + x]) ctx.rect(x * TILE, y * TILE, TILE, TILE);
      }
    ctx.clip();
  }
  if (q.id === 'lastLight') {
    drawHearthTrialLight(ctx, ev.light.x, ev.light.y, ev.light.r, '#f6da9b');
    drawHearthTrialFlame(ctx, ev.light.x, ev.light.y, '#ffe4a1', 0.75);
  }
  if (q.id === 'blackout') {
    const cx = TILE * 14.5,
      cy = TILE * 10.5,
      turn = q.elapsed * [0.19, 0.25, 0.31][q.tier],
      half = [0.58, 0.5, 0.44][q.tier];
    ctx.fillStyle = '#bcc9e9';
    ctx.globalAlpha = 0.08;
    for (let y = TILE * 2; y < TILE * 19; y += 12)
      for (let x = TILE * 2; x < TILE * 26; x += 12) {
        const d = Math.hypot(x - cx, y - cy),
          a = Math.atan2(y - cy, x - cx);
        if (
          d < 92 ||
          Math.min(Math.abs(angleDiff(a, turn)), Math.abs(angleDiff(a, turn + Math.PI))) < half
        )
          ctx.fillRect(x, y, 12, 12);
      }
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = '#cbd5f2';
    ctx.lineWidth = 2;
    for (const a of [turn - half, turn + half, turn + Math.PI - half, turn + Math.PI + half]) {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 92, cy + Math.sin(a) * 92);
      ctx.lineTo(cx + Math.cos(a) * 700, cy + Math.sin(a) * 700);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  if (q.id === 'pressure') {
    for (const e of G.enemies)
      if (!e.dead) {
        ctx.strokeStyle = d2(e.x, e.y, p.x, p.y) > 180 ** 2 ? '#acc5c8' : '#ffc984';
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.arc(e.x, e.y, 31, a + 0.18, a + 1.15);
          ctx.stroke();
        }
      }
    ctx.globalAlpha = 1;
  }
  if (q.id === 'relay')
    for (let i = 0; i < q.runes.length; i++) {
      const r = q.runes[i],
        active = i === q.recovered && q.recovered < Math.min(4, q.wave);
      ctx.fillStyle = active ? '#f4d99d' : r.recovered ? '#8ad6a5' : '#525b62';
      ctx.fillRect(r.x - 24, r.y - 25, 48, 4);
      ctx.fillRect(r.x - 24, r.y + 21, 48, 4);
      ctx.fillRect(r.x - 24, r.y - 21, 4, 42);
      ctx.fillRect(r.x + 20, r.y - 21, 4, 42);
      if (active) {
        ctx.fillRect(r.x - 24, r.y + 29, (48 * r.held) / (1.1 + q.tier * 0.25), 4);
        glowImg('ember', r.x, r.y, 70, 0.22);
      }
    }
  if (q.id === 'twinFlames')
    for (const f of q.flames) {
      drawHearthTrialFlame(ctx, f.x, f.y, f.hitT > 0 ? '#ffffff' : '#ffce83', 1.1);
      ctx.fillStyle = '#080b11';
      ctx.fillRect(f.x - 33, f.y + 25, 66, 7);
      ctx.fillStyle = f.hp < f.max * 0.3 ? '#e98372' : '#f3cb80';
      ctx.fillRect(f.x - 31, f.y + 27, (62 * f.hp) / f.max, 3);
    }
  if (!combatClarityDeferWarnings) drawHearthTrialMarks(ctx);
  ctx.restore();
}
function drawHearthTrialMarks(ctx) {
  const ev = hearthTrial?.events;
  if (!ev) return;
  ctx.save();
  for (const mark of ev.marks) {
    const warn = mark.age < mark.warning;
    ctx.fillStyle = warn ? '#d89151' : '#ffe6ac';
    if (mark.type === 'cinder') {
      ctx.globalAlpha = warn ? 0.22 : 0.5;
      const r = mark.radius;
      for (let i = 0; i < 16; i++) {
        const a = (i * TAU) / 16;
        ctx.fillRect(
          Math.round(mark.x + Math.cos(a) * r) - 3,
          Math.round(mark.y + Math.sin(a) * r) - 3,
          6,
          6
        );
      }
      if (!warn) {
        ctx.globalAlpha = 0.85;
        for (let i = -2; i <= 2; i++)
          ctx.fillRect(mark.x + i * 8 - 3, mark.y - 55 - Math.abs(i) * 10, 6, 65);
      }
    } else {
      ctx.save();
      ctx.translate(mark.x, mark.y);
      ctx.rotate(mark.a);
      ctx.globalAlpha = warn ? 0.28 : 0.5;
      for (let x = 12; x < 700; x += 20) ctx.fillRect(x, -1, 10, 2);
      ctx.globalAlpha = 1;
      ctx.fillRect(-10, -9, 20, 18);
      ctx.fillStyle = '#ffe6ac';
      ctx.fillRect(-4, -3, 8, 6);
      ctx.restore();
    }
  }
  ctx.restore();
}
