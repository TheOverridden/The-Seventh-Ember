function floorFixtures() {
  return G.world?.region === 'late' ? G.world.lateFixtures : G.world?.fixtures;
}
function ensureRestingFlame() {
  if (!G.world || !G.player) return;
  const list = floorFixtures();
  if (!list) return;
  let b = list.find((o) => o.kind === 'brazier'),
    s = G.world.rooms[0],
    pos = safePosition(G.world, s.cx * TILE + 18 + 58, s.cy * TILE + 18, 18) || {
      x: G.player.x + 50,
      y: G.player.y,
    };
  if (!b) {
    b = { kind: 'brazier', x: pos.x, y: pos.y, lit: false, resting: true };
    list.push(b);
  } else if (!b.lit) {
    b.x = pos.x;
    b.y = pos.y;
    b.resting = true;
  }
  G.world.restingFlame = b;
}
const longSetup = setupFloor;
setupFloor = function (f) {
  longSetup(f);
  if (G.run) {
    G.run.floorAge = 0;
    ensureRestingFlame();
  }
};
const longResumeCards = resumeRun;
resumeRun = function () {
  longResumeCards();
  if (G.run) ensureRestingFlame();
};
function nearestRestingFlame() {
  const list = floorFixtures() || [];
  let best = null,
    dist = 74 ** 2;
  for (const o of list)
    if (o.kind === 'brazier') {
      const dd = d2(o.x, o.y, G.player.x, G.player.y);
      if (dd < dist) {
        dist = dd;
        best = o;
      }
    }
  return best;
}
function useRestingFlame(o) {
  if (o.lit) {
    fieldNote('The Resting Flame has gone quiet.', 2);
    return;
  }
  o.lit = true;
  const heal = Math.ceil(G.player.maxHp * (bossFloorAt(G.floor) ? 0.28 : 0.22));
  cardHeal(heal, 'RESTING FLAME · ' + heal + ' HEALTH');
  G.world.torches.push({ x: o.x, y: o.y - 15, s: 0 });
  burst(o.x, o.y, 24, '#ffd083', 145, 1, 3, true);
  sfx('brazier');
  saveNow();
}
const longBeforeUpdate = hollowBeforeUpdate;
hollowBeforeUpdate = function (dt) {
  if (G.run) G.run.floorAge = (G.run.floorAge || 0) + dt;
  if (interactQueued) {
    const b = nearestRestingFlame();
    if (b) {
      interactQueued = false;
      useRestingFlame(b);
      return true;
    }
  }
  return longBeforeUpdate(dt);
};
const longHUD = updateHUD;
updateHUD = function (dt) {
  longHUD(dt);
  if (!G.player || G.state !== 'playing') return;
  const b = nearestRestingFlame();
  if (b) {
    T('promptTxt').textContent = b.lit
      ? 'RESTING FLAME SPENT'
      : 'REST · RESTORE ' + (bossFloorAt(G.floor) ? 28 : 22) + '% HEALTH';
    T('prompt').classList.add('on');
  }
};
function drawRestingFlame(ctx, o) {
  const t = save.motion ? 0 : G.tAll,
    lit = o.lit;
  ctx.save();
  ctx.translate(Math.round(o.x), Math.round(o.y));
  ctx.fillStyle = '#16151a';
  ctx.fillRect(-17, 8, 34, 7);
  ctx.fillStyle = '#554535';
  ctx.fillRect(-13, 2, 26, 8);
  ctx.fillStyle = '#9b7b54';
  ctx.fillRect(-10, 0, 20, 3);
  ctx.fillStyle = '#100f12';
  ctx.fillRect(-20, 12, 40, 4);
  ctx.fillStyle = '#78654b';
  ctx.fillRect(-16, 9, 32, 2);
  ctx.fillStyle = '#baa57b';
  ctx.fillRect(-13, 3, 24, 1);
  ctx.fillStyle = '#352e26';
  ctx.fillRect(-9, 5, 18, 4);
  ctx.fillStyle = '#a68a60';
  for (const x of [-12, -6, 4, 10]) {
    ctx.fillRect(x, 5, 2, 3);
    ctx.fillStyle = '#d8bb80';
    ctx.fillRect(x, 5, 1, 1);
    ctx.fillStyle = '#a68a60';
  }
  ctx.fillStyle = '#39322c';
  ctx.fillRect(-12, -5, 24, 4);
  ctx.fillStyle = '#d3b57c';
  ctx.fillRect(-13, -5, 25, 1);
  ctx.fillStyle = '#100f13';
  ctx.fillRect(-9, -5, 18, 2);
  ctx.fillStyle = '#6f4735';
  for (let i = 0; i < 6; i++) ctx.fillRect(-9 + i * 3, -4 + (i % 2), 2, 2);
  ctx.strokeStyle = '#c7a36f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-13, 1);
  ctx.lineTo(-18, -10);
  ctx.moveTo(13, 1);
  ctx.lineTo(18, -10);
  ctx.stroke();
  ctx.fillStyle = '#eed097';
  ctx.fillRect(-18, -10, 2, 3);
  ctx.fillRect(16, -10, 2, 3);
  ctx.fillStyle = '#7d6349';
  ctx.fillRect(-20, -12, 4, 2);
  ctx.fillRect(16, -12, 4, 2);
  for (let i = 0; i < 5; i++) {
    const a = t * (i % 2 ? 1.1 : -0.8) + (i * TAU) / 5,
      r = lit ? 18 : 11;
    ctx.fillStyle = lit ? (i % 2 ? '#ffd98d' : '#ff8c4d') : '#51483f';
    const x = Math.round(Math.cos(a) * r),
      y = Math.round(-13 + Math.sin(a) * r * 0.45);
    ctx.fillRect(x - 1, y - 3, 2, 6);
    ctx.fillRect(x - 2, y - 1, 4, 2);
    ctx.fillStyle = lit ? '#fff0bc' : '#7f735c';
    ctx.fillRect(x - 1, y - 2, 1, 2);
  }
  if (lit) {
    glowImg('ember', 0, -12, 58, 0.42);
    const flick = Math.round(Math.sin(t * 6) * 2);
    ctx.fillStyle = '#bd5934';
    ctx.fillRect(-7, -13, 14, 8);
    ctx.fillStyle = '#ff9b4d';
    ctx.fillRect(-5, -18, 10, 12);
    ctx.fillRect(-6, -21 + flick, 3, 10 - flick);
    ctx.fillRect(4, -16 - flick, 3, 8 + flick);
    ctx.fillStyle = '#ffcf75';
    ctx.fillRect(-3, -20 + flick, 6, 13 - flick);
    ctx.fillRect(0, -24 + flick, 3, 10 - flick);
    ctx.fillStyle = '#fff0bb';
    ctx.fillRect(-1, -17 + flick, 3, 10 - flick);
    ctx.fillRect(-2, -10, 5, 4);
    ctx.fillStyle = '#f4d899';
    ctx.fillRect(-9, -3, 3, 1);
    ctx.fillRect(5, -3, 3, 1);
  }
  ctx.restore();
}
const longDrawLate = drawLateWorld;
drawLateWorld = function (ctx) {
  longDrawLate(ctx);
  if (G.world?.region === 'late')
    for (const o of G.world.lateFixtures || []) if (o.kind === 'brazier') drawRestingFlame(ctx, o);
};
const longValidateCheckpoint = validateCheckpoint;
validateCheckpoint = function (r) {
  const out = longValidateCheckpoint(r);
  const list = r.world?.region === 'late' ? r.world.lateFixtures : r.world?.fixtures || [];
  for (const o of list)
    if (o.kind === 'brazier' && typeof o.lit !== 'boolean') throw Error('Invalid Resting Flame');
  return out;
};
