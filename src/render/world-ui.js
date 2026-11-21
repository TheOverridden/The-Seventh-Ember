let lightCv = null,
  lctx = null,
  treeCtx = null;
function resize() {
  G.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  G.w = innerWidth;
  G.h = innerHeight;
  G.cv.width = G.w * G.dpr;
  G.cv.height = G.h * G.dpr;
  G.cv.style.width = G.w + 'px';
  G.cv.style.height = G.h + 'px';
  lightCv.width = Math.ceil(G.w / 4);
  lightCv.height = Math.ceil(G.h / 4);
}

function render() {
  const ctx = G.ctx;
  ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
  ctx.fillStyle = '#05060a';
  ctx.fillRect(0, 0, G.w, G.h);
  if (G.state === 'menu' || !G.world) {
    drawMenuBg();
    return;
  }
  const material = G.world.bossRushArena ? null : dungeonSurfaces(G.world);
  const cam = G.cam;
  const amp = save.motion ? 0 : cam.shake * cam.shake * 10;
  const sx = rand(-1, 1) * amp,
    sy = rand(-1, 1) * amp;
  COMBAT_CLARITY.offsetX = sx;
  COMBAT_CLARITY.offsetY = sy;
  if (material && save.quality !== 'light') drawCavernDepth(ctx, material.cavern);
  ctx.save();
  ctx.translate(-cam.x + sx, -cam.y + sy);
  drawTiles(ctx);
  drawPixelFloorDetails(ctx);
  drawHollowFloor(ctx);
  drawLateWorld(ctx);
  if (material && save.quality !== 'light') drawLampBounce(ctx, material.bounce);
  drawProps(ctx);
  drawTorches(ctx);
  drawPortalChests(ctx);
  drawPicks(ctx);
  drawEnemies(ctx);
  drawBullets(ctx);
  drawPlayer(ctx);
  drawCombatFX(ctx);
  drawTreasureGlints(ctx);
  drawParticles(ctx);
  drawTexts(ctx);
  ctx.restore();
  if (save.quality !== 'light') lightingPass(sx, sy);
  if (G.state === 'playing') drawCrosshair(ctx);
}

function drawCavernDepth(ctx, texture) {
  const offsetX = Math.floor(G.cam.x * 0.17);
  const offsetY = Math.floor(G.cam.y * 0.17);
  const width = texture.width * 2;
  const height = texture.height * 2;
  const x0 = -(((offsetX % width) + width) % width);
  const y0 = -(((offsetY % height) + height) % height);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  for (let y = y0; y < G.h; y += height)
    for (let x = x0; x < G.w; x += width) ctx.drawImage(texture, x, y, width, height);
  ctx.restore();
}

function drawLampBounce(ctx, tile) {
  const time = save.motion ? 0 : G.tAll;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.imageSmoothingEnabled = true;
  let count = 0;
  for (const o of G.world.torches) {
    if (!combatVisualVisible(o.x, o.y, 120)) continue;
    ctx.globalAlpha = 0.29 + Math.sin(time * 4.1 + o.s) * 0.04;
    ctx.drawImage(tile, Math.round(o.x) - 98, Math.round(o.y) - 36, 196, 146);
    if (++count === 16) break;
  }
  ctx.restore();
}
function drawTiles(ctx) {
  const w = G.world,
    ts = TILE,
    pi = w.pi;
  const fl = FLOORT[pi],
    dc = DECOT[pi],
    cap = WALLTOP[pi],
    face = WALLFACE[pi];
  const material = dungeonSurfaces(w);
  const x0 = Math.max(0, Math.floor(G.cam.x / ts) - 1),
    x1 = Math.min(w.W - 1, Math.ceil((G.cam.x + G.w) / ts) + 1);
  const y0 = Math.max(0, Math.floor(G.cam.y / ts) - 1),
    y1 = Math.min(w.H - 1, Math.ceil((G.cam.y + G.h) / ts) + 2);
  ctx.imageSmoothingEnabled = false;
  const S = (img, wx, wy) => ctx.drawImage(img, wx, wy, ts, ts);
  for (let ty = y0; ty <= y1; ty++)
    for (let tx = x0; tx <= x1; tx++) {
      const i = ty * w.W + tx;
      if (w.grid[i] !== 1) continue;
      const wx = tx * ts,
        wy = ty * ts;
      const layout = w.shade[i] & 3;
      const fleck = ((tx * 13) ^ (ty * 31) ^ (tx >> 1)) & 1;
      S(material ? material.floor[layout * 2 + fleck] : fl[layout], wx, wy);
      const d = w.deco[i];
      if (d === 1) S(dc.crack, wx, wy);
      else if (d === 2) S(dc.peb, wx, wy);
      else if (d === 3 && !((w.region === 'hollow' && G.floor <= 10) || w.region === 'late'))
        S(dc.rune, wx, wy);
      else if (d === 4 && !(w.region === 'hollow' && G.floor <= 5)) S(dc.moss, wx, wy);
      else if (d === 5) S(dc.grate, wx, wy);
      if (isSolidTile(w, tx, ty - 1)) S(AOT.N, wx, wy);
      if (isSolidTile(w, tx, ty + 1)) S(AOT.S, wx, wy);
      if (isSolidTile(w, tx - 1, ty)) S(AOT.W, wx, wy);
      if (isSolidTile(w, tx + 1, ty)) S(AOT.E, wx, wy);
    }
  for (let ty = y0; ty <= y1; ty++)
    for (let tx = x0; tx <= x1; tx++) {
      const i = ty * w.W + tx;
      if (w.grid[i] === 1) continue;
      if (
        isSolidTile(w, tx + 1, ty) &&
        isSolidTile(w, tx - 1, ty) &&
        isSolidTile(w, tx, ty + 1) &&
        isSolidTile(w, tx, ty - 1)
      )
        continue;
      const wx = tx * ts,
        wy = ty * ts;
      const tone = (tx * 13 + ty * 31) % 3;
      if (!isSolidTile(w, tx, ty + 1)) S(material ? material.face[tone] : face, wx, wy);
      else S(material ? material.cap[tone] : cap, wx, wy);
    }
  ctx.imageSmoothingEnabled = true;
}
function drawProps(ctx) {
  const w = G.world,
    cam = G.cam;
  if (!w.props) return;
  for (const o of w.props) {
    if (o.x < cam.x - 40 || o.x > cam.x + G.w + 40 || o.y < cam.y - 40 || o.y > cam.y + G.h + 40)
      continue;
    if (o.t === 'pr_shroom') glowImg('violet', o.x, o.y, 16, 0.2);
    const sprite = typeof roomPropSpriteName === 'function' ? roomPropSpriteName(o) : o.t;
    drawSpr(sprite, o.x, o.y, 1, 0, 1, o.x * 0.01);
  }
}
function drawTorches(ctx) {
  const w = G.world,
    cam = G.cam,
    t = G.tAll;
  for (const o of w.torches) {
    if (o.x < cam.x - 60 || o.x > cam.x + G.w + 60 || o.y < cam.y - 60 || o.y > cam.y + G.h + 60)
      continue;
    glowImg('ember', o.x, o.y - 6, 36 + Math.sin(t * 9 + o.s) * 4, 0.55);
    drawSpr('pr_sconce', o.x, o.y + 6);
    drawSpr('flame', o.x, o.y - 5, 1, 0, 1, o.s);
  }
}
let portalStoneBase;

function drawPortalChests(ctx) {
  const t = save.motion ? 0 : G.tAll,
    p = G.portal;
  if (p && combatVisualVisible(p.x, p.y, 90)) {
    if (!portalStoneBase || portalStoneBase.getContext('2d').isContextLost?.()) {
      portalStoneBase = document.createElement('canvas');
      portalStoneBase.width = portalStoneBase.height = 86;
      const c = portalStoneBase.getContext('2d');
      for (const [rad, color] of [
        [39, '#0b090ac7'],
        [36, '#46392c'],
        [34, '#786145'],
        [32, '#322923'],
        [29, '#504131'],
        [28, '#161213'],
      ]) {
        const bevel = Math.floor(rad * 0.58);
        c.fillStyle = color;
        c.fillRect(43 - bevel, 43 - rad, bevel * 2, rad * 2);
        for (let row = -rad; row < rad; row += 2) {
          const inset = Math.max(0, Math.abs(row) - bevel);
          c.fillRect(43 - rad + inset, 43 + row, (rad - inset) * 2, 2);
        }
      }
      c.fillStyle = '#221918';
      for (const [x, y, w, h] of [
        [41, 7, 4, 12],
        [7, 41, 12, 4],
        [67, 41, 12, 4],
        [41, 67, 4, 12],
      ])
        c.fillRect(x, y, w, h);
    }
    ctx.drawImage(portalStoneBase, Math.round(p.x) - 43, Math.round(p.y) - 43);
    const pulse = 1 + Math.sin(t * 2.4) * 0.06;
    glowImg('gold', p.x, p.y, p.active ? 80 : 40, p.active ? 0.47 : 0.1);
    drawSpr(
      'portal',
      p.x,
      p.y,
      pulse * (p.active ? 1 : 0.9),
      0,
      p.active ? 1 : 0.45,
      save.motion ? -G.tAll : 0
    );
    if (p.active) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(255,222,149,' + (0.66 + Math.sin(t * 3) * 0.14) + ')';
      const x = Math.round(p.x),
        y = Math.round(p.y);
      for (const [dx, dy, w, h] of [
        [-1, -34, 2, 5],
        [-34, -1, 5, 2],
        [29, -1, 5, 2],
        [-1, 29, 2, 5],
      ])
        ctx.fillRect(x + dx, y + dy, w, h);
      ctx.restore();
    }
  }
  for (const c of G.chests) {
    if (!combatVisualVisible(c.x, c.y, 50)) continue;
    if (!c.opened) glowImg('gold', c.x, c.y, 26, 0.25 + Math.sin(t * 3 + c.x) * 0.08);
    drawSpr(c.opened ? 'chestOpen' : 'chest', c.x, c.y, 1, 0, c.opened ? 0.55 : 1);
  }
}
function drawTreasureGlints(ctx) {
  for (const chest of G.chests) {
    if (chest.opened || !combatVisualVisible(chest.x, chest.y, 60)) continue;
    ctx.fillStyle = '#ffe0a0';
    ctx.fillRect(Math.round(chest.x) - 8, Math.round(chest.y) - 7, 3, 2);
    ctx.fillRect(Math.round(chest.x) + 5, Math.round(chest.y) - 7, 3, 2);
  }
}

function drawPicks(ctx) {
  for (const o of G.picks) {
    if (!combatVisualVisible(o.x, o.y, 30)) continue;
    const bob = Math.sin(o.t) * 2;
    if (o.kind === 'xp') glowImg('cyan', o.x, o.y, 11, 0.45);
    else if (o.kind === 'ess') glowImg('violet', o.x, o.y, 13, 0.5);
    else glowImg('pink', o.x, o.y, 13, 0.5);
    drawSpr(
      o.kind === 'xp' ? 'xp' : o.kind === 'ess' ? 'ess' : 'heart',
      o.x,
      o.y + bob,
      1,
      0,
      1,
      o.val * 0.13
    );
  }
}
const EGLOW = {
  slime: 'violet',
  mite: 'violet',
  bat: 'magenta',
  spitter: 'teal',
  brute: 'violet',
  splitter: 'orchid',
  wisp: 'blue',
  boss: 'magenta',
};
function drawEnemies(ctx) {
  const t = G.tAll;
  for (const e of G.enemies) {
    if (e.dead) continue;
    if (!combatVisualVisible(e.x, e.y, e.isBoss ? 380 : e.r * 3 + 60)) continue;
    if (e.ai === 'late' || e.ai === 'lateBoss') {
      drawLateEnemy(ctx, e);
      continue;
    }
    if (e.ai === 'garden' || e.matriarch) {
      drawGardenEnemy(ctx, e);
      continue;
    }
    if (e.ai === 'gate' || e.warden) {
      drawGateEnemy(ctx, e);
      continue;
    }
    ctx.fillStyle = 'rgba(0,0,0,.42)';
    ctx.beginPath();
    ctx.ellipse(e.x, e.y + e.r * 0.85, e.r * 0.85, e.r * 0.36, 0, 0, TAU);
    ctx.fill();
    glowImg(EGLOW[e.type] || 'violet', e.x, e.y, e.r * 2.1, e.isBoss ? 0.4 : 0.24);
    let s = 1,
      rot = 0;
    if (e.type === 'spitter') rot = Math.atan2(G.player.y - e.y, G.player.x - e.x);
    if (e.isBoss) {
      rot = t * 0.4;
      if (e.phase === 1) {
        s = 1 + Math.sin(t * 30) * 0.05;
      }
      s *= 1 + Math.sin(t * 2) * 0.03;
    }
    drawCreatureSprite(
      ctx,
      e,
      e.spr,
      e.x,
      e.y,
      s * (e.elite && !e.isBoss ? 1.18 : 1),
      rot,
      1,
      e.seed
    );
    if (e.elite && !e.isBoss) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(255,207,107,.8)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + 6, t * 2, t * 2 + 4.2);
      ctx.stroke();
      ctx.restore();
    }
    if (e.hitT > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = e.hitT * 4;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r * 0.9, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
    if (e.isBoss && e.phase === 1) {
      const p = 1 - e.teleT / BOSS_TUNING.chargeWarning;
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(Math.atan2(e.cvy, e.cvx));
      ctx.fillStyle = 'rgba(255,93,126,.13)';
      ctx.fillRect(0, -e.r, 270, e.r * 2);
      ctx.strokeStyle = '#ff7a95';
      ctx.setLineDash([9, 9]);
      ctx.lineWidth = 2;
      ctx.strokeRect(0, -e.r, 270, e.r * 2);
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(255,80,110,' + (0.4 + Math.sin(t * 30) * 0.3) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r + 10 + p * 26, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }
    if (e.type === 'spitter' && e.aggro && e.t1 < 0.35 && e.t1 > 0)
      glowImg('teal', e.x, e.y, e.r + 8, 0.5);
    if (!e.isBoss && e.hp < e.max) {
      const wpx = e.r * 2;
      ctx.fillStyle = 'rgba(0,0,0,.6)';
      ctx.fillRect(e.x - wpx / 2 - 1, e.y - e.r - 10, wpx + 2, 5);
      ctx.fillStyle = e.elite ? '#ffcf6b' : '#ff5d6d';
      ctx.fillRect(e.x - wpx / 2, e.y - e.r - 9, wpx * clamp(e.hp / e.max, 0, 1), 3);
    }
  }
}
function drawBullets(ctx) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const b of G.bullets) {
    if (!combatVisualVisible(b.x, b.y, 80 + Math.hypot(b.vx, b.vy) * 0.05)) continue;
    ctx.globalAlpha = combatVisualAlpha('trail');
    ctx.strokeStyle = 'rgba(255,180,90,.55)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(b.x - b.vx * 0.035, b.y - b.vy * 0.035);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    drawSpr('bEmber', b.x, b.y, 1, 0, 1, b.x * 0.01);
    glowImg('ember', b.x, b.y, 12, 0.4 * combatVisualAlpha('glow'));
  }
  for (const b of G.ebul) {
    if (!combatVisualVisible(b.x, b.y, 80 + Math.hypot(b.vx, b.vy) * 0.05)) continue;
    if (b.garden) {
      drawSeedShot(ctx, b);
      continue;
    }
    if (b.lateColor) {
      ctx.strokeStyle = b.lateColor + 'aa';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(b.x - b.vx * 0.04, b.y - b.vy * 0.04);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.fillStyle = b.lateColor;
      ctx.fillRect(b.x - 3, b.y - 3, 6, 6);
      continue;
    }
    ctx.strokeStyle = 'rgba(255,93,138,.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(b.x - b.vx * 0.035, b.y - b.vy * 0.035);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    drawSpr('bEnemy', b.x, b.y, 1, 0, 1, b.x * 0.01);
    glowImg('magenta', b.x, b.y, 12, 0.4);
  }
  ctx.restore();
  const p = G.player;
  if (p && p.orbN > 0) {
    for (let i = 0; i < p.orbN; i++) {
      const a = p.orbA + (i / p.orbN) * TAU;
      const ox = p.x + Math.cos(a) * 64,
        oy = p.y + Math.sin(a) * 64;
      glowImg('gold', ox, oy, 16, 0.5);
      drawSpr('pShard', ox, oy, 1, a + Math.PI / 2);
    }
  }
}
function drawPlayer(ctx) {
  const p = G.player;
  if (!p || (G.dead && G.state === 'dead')) return;
  const blink =
    p.hitCd > 0 && p.dashT <= 0 && ((G.tAll * 18) | 0) % 2 === 0 && G.state === 'playing';
  if (p.ghosts)
    for (const g of p.ghosts) {
      drawSpr('pDash', g.x, g.y, 1, g.rot, clamp(g.life, 0, 1) * 0.32);
    }
  if (!blink) {
    const time = save.motion ? 0 : G.tAll,
      hov = Math.sin(time * 2.4) * 1.8,
      finish = typeof hearthData === 'function' ? hearthData().shards : 'ember',
      palette = finish !== 'ember' ? HEARTH_PALETTES.find((item) => item.id === finish) : null;
    ctx.fillStyle = 'rgba(0,0,0,.42)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + p.r * 1.05, p.r * (0.85 - hov * 0.03), p.r * 0.34, 0, 0, TAU);
    ctx.fill();
    glowImg('ember', p.x, p.y - 4, 54, 0.62);
    glowImg('gold', p.x, p.y - 6, 26, 0.38);
    if (p.muzzle > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(255,196,107,.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 4);
      ctx.lineTo(p.x + Math.cos(p.face) * 30, p.y - 4 + Math.sin(p.face) * 30);
      ctx.stroke();
      ctx.restore();
    }
    const dashing = p.dashT > 0,
      cy = p.y + 2 - (dashing ? 0 : hov),
      oa = time * (dashing ? 4.2 : 1.78);
    const state = dashing ? 'pDash' : p.moving ? 'pMove' : 'pIdle';
    const rot = dashing ? Math.atan2(p.dashDy, p.dashDx) + Math.PI / 2 : p.lean;
    ctx.save();
    ctx.translate(p.x, cy - 4);
    ctx.rotate(-oa * 0.18);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,199,103,.22)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const a = (i * TAU) / 6 + 0.12;
      ctx.beginPath();
      ctx.arc(0, 0, 15, a, a + 0.42);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,241,184,.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 8, 0.3, 0, TAU);
    ctx.stroke();
    ctx.restore();
    const satellites = [0, TAU / 3, (TAU * 2) / 3].map((off, i) => {
      const a = oa + off,
        r = 19 + (i === 1 ? 3 : i === 2 ? -1 : 0);
      return {
        a,
        i,
        x: p.x + Math.cos(a) * r,
        y: cy - 5 + Math.sin(a) * (7 + i * 0.8),
        front: Math.sin(a) >= 0,
      };
    });
    const drawSatellite = (s) => {
      const depth = s.front ? 1 : 0.72,
        sc = (s.front ? 1.02 : 0.82) + (s.i === 1 ? 0.07 : 0);
      if (palette) {
        drawHearthShard(ctx, s.x, s.y, palette, sc, s.i, {
          time,
          rotation: s.a * 0.72 + time * 0.45,
          alpha: depth,
        });
      } else {
        glowImg('gold', s.x, s.y, 12 + (s.front ? 3 : 0), 0.3 * depth);
        drawSpr('pShard', s.x, s.y, sc, s.a * 0.72 + time * 0.45, depth, time - G.tAll);
      }
      ctx.fillStyle = palette
        ? s.front
          ? palette.light
          : palette.color
        : s.front
          ? '#fff0ae'
          : '#ba7a35';
      ctx.fillRect(
        Math.round(s.x + Math.cos(s.a) * 5) - 1,
        Math.round(s.y + Math.sin(s.a) * 3) - 1,
        2,
        2
      );
    };
    for (const s of satellites) if (!s.front) drawSatellite(s);
    drawSpr(state, p.x, cy, dashing ? 1.06 : 1, rot, 1, time - G.tAll);
    for (const s of satellites) if (s.front) drawSatellite(s);
    if (!save.motion)
      for (let i = 0; i < 4; i++) {
        const u = (G.tAll * (0.31 + i * 0.027) + i * 0.23) % 1;
        const ox = p.x - 6 + i * 4 + Math.sin(G.tAll * 2.4 + i * 1.7) * 2,
          oy = cy - 8 - u * 21;
        ctx.fillStyle = i === 2 ? '#fff3bf' : i % 2 ? '#ffbe5c' : '#f67a35';
        ctx.fillRect(Math.round(ox), Math.round(oy), i === 2 ? 2 : 1, i === 2 ? 2 : 1);
      }
  }
  if (p.hitCd > 0 && p.dashT <= 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#ffb45e';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + 5, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
}
function drawParticles(ctx) {
  ctx.save();
  for (let i = 0; i < G.parts.length; i++) {
    const o = G.parts[i];
    if (!combatVisualVisible(o.x, o.y, o.size * 2)) continue;
    if (o.col !== 'ring' && !combatVisualAllowance('debris', i, G.parts.length)) continue;
    const a = clamp(o.life / o.max, 0, 1) * combatVisualAlpha(o.glow ? 'glow' : 'debris');
    if (o.col === 'ring') {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(255,180,94,' + a * 0.7 + ')';
      ctx.lineWidth = 3 * a + 1;
      ctx.beginPath();
      ctx.arc(o.x, o.y, (1 - a) * o.size, 0, TAU);
      ctx.stroke();
    } else if (o.glow) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = a;
      ctx.fillStyle = o.col;
      ctx.fillRect(o.x - o.size / 2, o.y - o.size / 2, o.size, o.size);
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a;
      ctx.fillStyle = o.col;
      ctx.fillRect(o.x - o.size / 2, o.y - o.size / 2, o.size, o.size);
    }
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}
function drawTexts(ctx) {
  ctx.textAlign = 'center';
  for (const o of G.texts) {
    if (!combatVisualVisible(o.x, o.y, 100)) continue;
    const a = clamp(o.life / o.max, 0, 1);
    ctx.font = '800 ' + o.size + 'px system-ui, sans-serif';
    ctx.globalAlpha = a;
    ctx.strokeStyle = 'rgba(0,0,0,.8)';
    ctx.lineWidth = 3;
    ctx.strokeText(o.txt, o.x, o.y);
    ctx.fillStyle = o.col;
    ctx.fillText(o.txt, o.x, o.y);
  }
  ctx.globalAlpha = 1;
}
function lightingPass(sx, sy) {
  const lw = lightCv.width,
    lh = lightCv.height,
    cam = G.cam;
  lctx.setTransform(1, 0, 0, 1, 0, 0);
  lctx.globalCompositeOperation = 'source-over';
  lctx.fillStyle = G.world.pal.fog + '.5)';
  lctx.fillRect(0, 0, lw, lh);
  lctx.globalCompositeOperation = 'destination-out';
  const hole = (wx, wy, r, a) => {
    const x = (wx - cam.x + sx) / 4,
      y = (wy - cam.y + sy) / 4,
      rr = r / 4;
    if (x < -rr || y < -rr || x > lw + rr || y > lh + rr) return false;
    const g = lctx.createRadialGradient(x, y, rr * 0.08, x, y, rr);
    g.addColorStop(0, 'rgba(255,255,255,' + a + ')');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    lctx.fillStyle = g;
    lctx.beginPath();
    lctx.arc(x, y, rr, 0, TAU);
    lctx.fill();
    return true;
  };
  const p = G.player,
    t = G.tAll;
  if (p) {
    hole(p.x, p.y, 480, 1);
    hole(p.x, p.y, 190, 0.8);
  }
  for (const o of G.world.torches) hole(o.x, o.y, 175 + Math.sin(t * 9 + o.s) * 18, 0.9);
  if (G.portal) hole(G.portal.x, G.portal.y, G.portal.active ? 215 : 100, 0.9);
  let oc = 0;
  for (const o of G.picks) {
    if (oc >= 27) break;
    if (hole(o.x, o.y, 62, 0.6)) oc++;
  }
  let bc = 0;
  for (const b of G.bullets) {
    if (bc >= 13) break;
    if (hole(b.x, b.y, 66, 0.65)) bc++;
  }
  let ec = 0;
  for (const b of G.ebul) {
    if (ec >= 11) break;
    if (hole(b.x, b.y, 56, 0.55)) ec++;
  }
  if (G.boss && !G.boss.dead) hole(G.boss.x, G.boss.y, 260, 0.95);
  for (const c of G.chests) hole(c.x, c.y, 86, 0.55);
  for (const o of G.world.fixtures || []) hole(o.x, o.y, 120, o.kind === 'echo' ? 0.65 : 0.8);
  const ctx = G.ctx;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(lightCv, 0, 0, lw, lh, 0, 0, G.w, G.h);
  ctx.restore();
}
function drawCrosshair(ctx) {
  const p = G.player;
  const m = keyboardActionDown('bolt')
    ? aimTarget
      ? { x: aimTarget.x - G.cam.x, y: aimTarget.y - G.cam.y }
      : { x: p.x - G.cam.x + Math.cos(p.face) * 75, y: p.y - G.cam.y + Math.sin(p.face) * 75 }
    : mouse;
  const r = 9 + (p && p.muzzle > 0 ? 4 : 0);
  ctx.strokeStyle = 'rgba(255,214,140,.9)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(m.x, m.y, r, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(m.x - r - 4, m.y);
  ctx.lineTo(m.x - r + 2, m.y);
  ctx.moveTo(m.x + r + 4, m.y);
  ctx.lineTo(m.x + r - 2, m.y);
  ctx.moveTo(m.x, m.y - r - 4);
  ctx.lineTo(m.x, m.y - r + 2);
  ctx.moveTo(m.x, m.y + r + 4);
  ctx.lineTo(m.x, m.y + r - 2);
  ctx.stroke();
}
const hudCache = {};
function setTxt(id, v) {
  if (hudCache[id] !== v) {
    hudCache[id] = v;
    T(id).textContent = v;
  }
}
function updateHUD(dt) {
  const p = G.player,
    run = G.run;
  if (!p || !run || G.state === 'menu') {
    clearCombatOverlays();
    return;
  }
  T('hpfill').style.width = clamp((p.hp / p.maxHp) * 100, 0, 100) + '%';
  setTxt('hptext', Math.max(0, Math.ceil(p.hp)) + ' / ' + p.maxHp);
  const need = needXP(run.level);
  T('xpfill').style.width = clamp((run.xp / need) * 100, 0, 100) + '%';
  setTxt('lvlbadge', 'LV ' + run.level);
  setTxt('xptext', Math.floor(run.xp) + ' / ' + need + ' XP');
  setTxt('stFloor', G.floor);
  setTxt('floorBanner', String(G.floor).padStart(2, '0') + ' / ' + floorName(G.floor));
  setTxt(
    'floorObjective',
    G.boss ? 'Defeat the guardian to open the portal' : 'Find the golden portal · explore for power'
  );
  setTxt('stEss', fmt(run.ess));
  setTxt('stKills', run.kills);
  setTxt('stTime', Math.floor(run.t / 60) + ':' + String(Math.floor(run.t % 60)).padStart(2, '0'));
  const dm = T('dashmeter');
  const pc = p.dashCdT > 0 ? 1 - p.dashCdT / p.dashCd : 1;
  dm.style.setProperty('--p', clamp(pc, 0, 1).toFixed(3));
  const vig = T('vig');
  const o = parseFloat(vig.style.opacity || 0);
  if (o > 0) vig.style.opacity = Math.max(0, o - dt * 1.8).toFixed(2);
  T('lowvig').style.opacity =
    (G.state === 'playing' || G.state === 'dying') && p.hp < p.maxHp * 0.3 ? 1 : 0;
  if (G.boss && !G.boss.dead) {
    T('bossfill').style.width = clamp((G.boss.hp / G.boss.max) * 100, 0, 100) + '%';
  }
  const pr = G.portal;
  if (pr && d2(p.x, p.y, pr.x, pr.y) < 90 * 90) {
    T('promptTxt').textContent = pr.active
      ? 'DESCEND TO FLOOR ' + (G.floor + 1)
      : 'SEALED — SLAY THE GUARDIAN';
    T('prompt').classList.add('on');
  } else T('prompt').classList.remove('on');
  G.mmT = (G.mmT || 0) - dt;
  if (G.mmT <= 0) {
    G.mmT = 0.25;
    drawMinimap();
  }
}
function drawMinimap() {
  const c = T('mm'),
    x = c.getContext('2d'),
    w = G.world;
  x.fillStyle = 'rgba(7,9,15,.9)';
  x.fillRect(0, 0, c.width, c.height);
  const s = Math.min((c.width - 14) / w.W, (c.height - 14) / w.H),
    ox = (c.width - w.W * s) / 2,
    oy = (c.height - w.H * s) / 2;
  const p = G.player;
  const tx0 = Math.floor(p.x / TILE);
  x.fillStyle = '#2c3552';
  for (let ty = 0; ty < w.H; ty++)
    for (let tx = 0; tx < w.W; tx++) {
      if (!w.reveal[ty * w.W + tx] || w.grid[ty * w.W + tx] !== 1) continue;
      x.fillRect(ox + tx * s, oy + ty * s, s + 0.5, s + 0.5);
    }
  if (G.portal && w.reveal[Math.floor(G.portal.y / TILE) * w.W + Math.floor(G.portal.x / TILE)]) {
    x.fillStyle = G.portal.active ? '#ffd88a' : '#5a4a6a';
    x.beginPath();
    x.arc(ox + (G.portal.x / TILE) * s, oy + (G.portal.y / TILE) * s, 3, 0, TAU);
    x.fill();
  }
  x.fillStyle = '#ffb45e';
  x.beginPath();
  x.arc(ox + tx0 * s + (p.x / TILE - tx0) * s, oy + (p.y / TILE) * s, 2.6, 0, TAU);
  x.fill();
}

let treeHover = null;
function openTree(from) {
  G.skillsOpen = true;
  G.treeFrom = from || 'menu';
  if (from === 'menu') hide('menu');
  refreshTreeEss();
  show('skills');
  fitTree();
  selectNode(selectedNode || NODE_BY_ID.awaken);
  const wrap = T('treeWrap');
  wrap.scrollLeft = Math.max(0, (1240 - wrap.clientWidth) / 2);
  wrap.scrollTop = Math.max(0, (980 - wrap.clientHeight) / 2);
}
function closeTree() {
  G.skillsOpen = false;
  hide('skills');
  if (G.treeFrom === 'menu') show('menu');
}
function refreshTreeEss() {
  T('treeEss').querySelector('b').textContent = fmt(save.essence);
}

function tryBuyNode(n) {
  const st = nodeState(n);
  if (st === 2) {
    return;
  }
  if (st !== 3) {
    sfx('deny');
    return;
  }
  save.essence -= n.cost;
  save.nodes[n.id] = true;
  META = computeMeta();
  saveNow();
  refreshTreeEss();
  refreshMenuStats();
  sfx('buy');
  selectNode(n);
}

function wireTree() {
  const wrap = T('treeNodes');
  for (const n of TREE_NODES) {
    const el = document.createElement('button');
    el.className = 'node-hit';
    el.style.left = (n.x / 1240) * 100 + '%';
    el.style.top = (n.y / 980) * 100 + '%';
    el.dataset.node = n.id;
    el.title = n.name;
    el.setAttribute('aria-label', n.name + ' · ' + n.cost + ' essence');
    on(el, 'click', () => selectNode(n));
    on(el, 'focus', () => selectNode(n));
    wrap.appendChild(el);
  }
  on(T('btnUnlock'), 'click', () => {
    if (selectedNode) tryBuyNode(selectedNode);
  });
  addEventListener('resize', fitTree);
}

function refreshMenuStats() {
  T('menuStats').innerHTML = `<span>BEST FLOOR <b>${save.bestFloor || '—'}</b></span>
    <span>RUNS <b>${save.totalRuns}</b></span>
    <span>KILLS <b>${save.totalKills}</b></span>
    <span>GUARDIANS <b>${save.guardians}</b></span>
    <span>ESSENCE <b style="color:#d8bdff">◆ ${fmt(save.essence)}</b></span>`;
  syncContinue();
}
function toggleMusic() {
  save.music = save.music ? 0 : 1;
  saveNow();
  T('btnMusic').classList.toggle('off', !save.music);
  applyAudioSettings();
  syncSettings();
}
function toggleSfx() {
  save.sfx = save.sfx ? 0 : 1;
  saveNow();
  T('btnSfx').classList.toggle('off', !save.sfx);
  if (save.sfx) sfx('ui');
  syncSettings();
}
function wireButtons() {
  on(T('btnStart'), 'click', () => {
    initAudio();
    sfx('ui');
    requestStart();
  });
  on(T('btnTree'), 'click', () => {
    sfx('ui');
    openTree('menu');
  });
  on(T('btnHow'), 'click', () => {
    sfx('ui');
    show('howto');
  });
  on(T('btnHowClose'), 'click', () => {
    sfx('ui');
    hide('howto');
  });
  on(T('btnMusic'), 'click', () => {
    initAudio();
    toggleMusic();
  });
  on(T('btnSfx'), 'click', () => {
    initAudio();
    toggleSfx();
  });
  on(T('btnResume'), 'click', () => {
    sfx('ui');
    pauseGame(false);
  });
  on(T('btnAbandon'), 'click', () =>
    confirmAction(
      'END THIS RUN?',
      'Your essence and permanent upgrades are kept. This descent will end.',
      'END RUN',
      abandonRun
    )
  );
  on(T('btnDeadTree'), 'click', () => {
    sfx('ui');
    openTree('dead');
  });
  on(T('btnDeadMenu'), 'click', () => {
    sfx('ui');
    startRun();
  });
  on(T('btnWinGo'), 'click', () => {
    sfx('ui');
    hide('win');
    setState('playing');
  });
  on(T('btnWinEnd'), 'click', () => {
    sfx('ui');
    G.dead = true;
    save.resume = null;
    saveNow();
    backToMenu();
  });
  on(T('btnTreeBack'), 'click', () => {
    sfx('ui');
    closeTree();
  });
  T('btnMusic').classList.toggle('off', !save.music);
  T('btnSfx').classList.toggle('off', !save.sfx);
}

let lastT = 0,
  fpsE = 60,
  fpsTick = 0;
function loop(now) {
  requestAnimationFrame(loop);
  const elapsed = Math.max(0, (now - lastT) / 1000);
  const dt = clamp(elapsed, 0, 0.033);
  lastT = now;
  G.tAll = (G.tAll || 0) + dt;
  if (!document.hidden && elapsed > 0 && elapsed < 0.25) fpsE = lerp(fpsE, 1 / elapsed, 0.05);
  G.fps = fpsE;
  fpsTick -= dt;
  if (fpsTick <= 0) {
    fpsTick = 0.5;
    T('fps').textContent = Math.round(fpsE) + ' FPS';
    if (save.quality === 'light' || fpsE < 33) G.partScale = 0.4;
    else if (fpsE > 52) G.partScale = 1;
  }
  if (!saveConflicted) hollowTick(dt);
  if (G.state === 'playing' && !saveConflicted) update(dt);
  else if (G.state === 'dying') {
    updateFx(dt);
    G.cam.shake = Math.max(0, G.cam.shake - dt * 1.8);
  } else if (G.state === 'winning') {
    updateFx(dt);
  }
  render();
  if (G.skillsOpen) drawTree(G.tAll);
}
function init() {
  loadSave();
  META = computeMeta();
  G.cv = T('cv');
  G.ctx = G.cv.getContext('2d');
  lightCv = document.createElement('canvas');
  lctx = lightCv.getContext('2d');
  bakeAllGlows();
  bakeAll();
  bakePerfectEmber();
  bakeTiles();
  bakeHollowSprites();
  bakeGardenSprites();
  resize();
  addEventListener('resize', resize);
  wireButtons();
  wireTree();
  wireRefinements();
  decorateMenus();
  wireHollow();
  wireCombat();
  wireLate();
  wireMastery();
  wireDepth();
  refreshIcons();
  refreshMenuStats();
  setState('menu');
  G.tAll = 0;
  T('fade').style.opacity = 0;
  lastT = performance.now();
  requestAnimationFrame(loop);
}
