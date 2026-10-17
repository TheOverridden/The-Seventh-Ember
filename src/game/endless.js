const ENDLESS_MUTATIONS = [
  { key: 'relentless', name: 'RELENTLESS', desc: 'Enemies move and use their abilities faster.' },
  { key: 'iron', name: 'IRON PROCESSION', desc: 'Enemies carry heavier bodies and more health.' },
  {
    key: 'volatile',
    name: 'VOLATILE DEAD',
    desc: 'Defeated elites burst into a final projectile ring.',
  },
  { key: 'famine', name: 'THE FAMINE', desc: 'Resting Flames heal less, but essence is richer.' },
  { key: 'storm', name: 'STAR STORM', desc: 'Hostile projectiles travel faster.' },
  { key: 'exposed', name: 'OPEN WOUND', desc: 'You and the dungeon both deal more damage.' },
];

const endlessMutation = (f) =>
  ENDLESS_MUTATIONS[Math.floor(Math.max(0, f - 51) / 5) % ENDLESS_MUTATIONS.length];
const oathRank = (id) => Math.min(16, G.run?.endlessOaths?.[id] || 0);

const LEGACY_ENDLESS_OATH_IDS = new Set(['teeth', 'ash', 'motion', 'glassOath', 'crowns', 'stars']);

function remixEndlessFloor() {
  if (!G.run?.infinite || G.floor <= 50 || !G.world) return;
  const f = G.floor,
    depth = f - 50,
    mutation = endlessMutation(f),
    region = lateRegion(f),
    ri = LATE_REGIONS.indexOf(region),
    next = LATE_REGIONS[(ri + 1) % LATE_REGIONS.length],
    mix = LATE_ROSTERS[next.key],
    candidates = G.enemies.filter((e) => !e.isBoss && !e.mechanism);
  for (let i = 0; i < candidates.length; i++)
    if (i % 3 === 1) {
      const old = candidates[i],
        type = mix[(i + depth) % mix.length],
        replacement = spawnEnemy(type, old.x, old.y, old.elite);
      old.dead = true;
      replacement.aggro = old.aggro;
    }
  const gradualHp = Math.pow(1.012, depth - 1),
    gradualDmg = Math.pow(1.006, depth - 1);
  for (const e of G.enemies) {
    if (e.dead || e.endlessScaled) continue;
    e.endlessScaled = true;
    e.max = Math.round(e.max * gradualHp);
    e.hp = e.max;
    e.dmg = Math.max(1, Math.round(e.dmg * gradualDmg));
    if (mutation.key === 'relentless') {
      e.spd *= 1.08;
      e.specialCd = (e.specialCd || 2) * 0.82;
    }
    if (mutation.key === 'iron') {
      e.max = Math.round(e.max * 1.18);
      e.hp = e.max;
    }
    if (oathRank('motion')) {
      e.spd *= 1 + 0.1 * oathRank('motion');
      e.specialCd = (e.specialCd || 2) * Math.pow(0.9, oathRank('motion'));
    }
    if (e.isBoss && oathRank('crowns')) {
      e.max = Math.round(e.max * (1 + 0.25 * oathRank('crowns')));
      e.hp = e.max;
    }
  }
  G.world.endlessMutation = mutation.key;
  G.world.endlessDepth = depth;
  save.bestEndless = Math.max(save.bestEndless || 0, depth);
}
const endlessSetup = setupFloor;
setupFloor = function (f) {
  endlessSetup(f);
  if (G.run?.infinite && f > 50) {
    remixEndlessFloor();
    if ((f - 51) % 10 === 0 && !G.run.endlessOathChosen?.includes(f)) offerEndlessOath(f);
    updateHUD(0);
    saveNow();
  }
};
const endlessEnter = enterInfinite;
enterInfinite = function () {
  endlessEnter();
  if (G.run?.infinite) {
    G.run.endlessOaths = G.run.endlessOaths || {};
    G.run.endlessOathChosen = G.run.endlessOathChosen || [];
    if (!G.run.endlessOathChosen.includes(51)) offerEndlessOath(51);
  }
};
const endlessResume = resumeRun;
resumeRun = function () {
  endlessResume();
  if (G.run?.infinite) {
    G.world.endlessMutation = endlessMutation(G.floor).key;
    G.world.endlessDepth = G.floor - 50;
    if (G.run.endlessOathPending) offerEndlessOath(G.run.endlessOathPending);
  }
};
const endlessRecalc = recalc;
recalc = function () {
  endlessRecalc();
  if (!G.player || !G.run?.infinite) return;
  const p = G.player;
  p.dmg *= Math.pow(1.2, oathRank('teeth'));
  p.speed *= Math.pow(1.12, oathRank('motion'));
  p.dashCd *= Math.pow(0.9, oathRank('motion'));
  p.maxHp = Math.max(20, Math.round(p.maxHp * Math.pow(0.82, oathRank('glassOath'))));
  p.hp = Math.min(p.hp, p.maxHp);
  p.critC += 0.14 * oathRank('glassOath');
};
const endlessDamage = damageEnemy;
damageEnemy = function (e, dmg, ang, crit, kb, kind = 'shot') {
  if (G.run?.infinite) {
    if (e.isBoss) dmg *= Math.pow(1.25, oathRank('crowns'));
    if (endlessMutation(G.floor).key === 'exposed') dmg *= 1.15;
  }
  endlessDamage(e, dmg, ang, crit, kb, kind);
};
const endlessHurt = hurtPlayer;
hurtPlayer = function (dmg, sx, sy) {
  if (G.run?.infinite) {
    dmg *= Math.pow(1.18, oathRank('teeth'));
    if (endlessMutation(G.floor).key === 'exposed') dmg *= 1.2;
  }
  endlessHurt(dmg, sx, sy);
};
const endlessShoot = enemyShoot;
enemyShoot = function (e, ang, spd, dmg) {
  if (G.run?.infinite) {
    if (endlessMutation(G.floor).key === 'storm') spd *= 1.18;
    spd *= Math.pow(1.2, oathRank('stars'));
  }
  return endlessShoot(e, ang, spd, dmg);
};
const endlessAuthoredBoss = authoredBossAI;
authoredBossAI = function (b, dt, d, dx, dy) {
  const haste = G.run?.infinite
    ? (endlessMutation(G.floor).key === 'relentless' ? 1.12 : 1) * Math.pow(1.1, oathRank('motion'))
    : 1;
  return endlessAuthoredBoss(b, dt * haste, d, dx, dy);
};
colossusAI = astronomerAI = scribeAI = regentAI = seraphAI = tyrantAI = keeperAI = authoredBossAI;
const endlessBellkeeper = bellkeeperAI;
bellkeeperAI = function (b, dt, d, dx, dy) {
  const haste = G.run?.infinite
    ? (endlessMutation(G.floor).key === 'relentless' ? 1.12 : 1) * Math.pow(1.1, oathRank('motion'))
    : 1;
  return endlessBellkeeper(b, dt * haste, d, dx, dy);
};
const endlessEss = addEss;
addEss = function (v) {
  if (G.run?.infinite) {
    v *= Math.pow(1.3, oathRank('ash'));
    if (endlessMutation(G.floor).key === 'famine') v *= 1.25;
    v = Math.max(1, Math.round(v));
  }
  return endlessEss(v);
};
const endlessUseFlame = useRestingFlame;
useRestingFlame = function (o) {
  if (!G.run?.infinite || o.lit) {
    endlessUseFlame(o);
    return;
  }
  o.lit = true;
  const base = bossFloorAt(G.floor) ? 0.28 : 0.22,
    penalty =
      Math.pow(0.65, oathRank('ash')) * (endlessMutation(G.floor).key === 'famine' ? 0.55 : 1),
    heal = Math.max(1, Math.ceil(G.player.maxHp * base * penalty));
  cardHeal(heal, 'RESTING FLAME · ' + heal + ' HEALTH');
  G.world.torches.push({ x: o.x, y: o.y - 15, s: 0 });
  burst(o.x, o.y, 24, '#ffd083', 145, 1, 3, true);
  sfx('brazier');
  saveNow();
};
const endlessKill = killEnemy;
killEnemy = function (e) {
  const burstElite =
      G.run?.infinite && endlessMutation(G.floor).key === 'volatile' && e.elite && !e.dead,
    x = e.x,
    y = e.y,
    dmg = e.dmg;
  endlessKill(e);
  if (burstElite && e.dead && G.state === 'playing') {
    for (let i = 0; i < 8; i++) {
      const a = (i * TAU) / 8;
      G.ebul.push({
        x,
        y,
        vx: Math.cos(a) * 175,
        vy: Math.sin(a) * 175,
        r: 5,
        dmg: Math.max(1, Math.round(dmg * 0.28)),
        life: 2.4,
        lateColor: '#d18aff',
      });
    }
    sfx('eshoot');
  }
};
const endlessHUD = updateHUD;
updateHUD = function (dt) {
  endlessHUD(dt);
  if (!G.run?.infinite || G.floor <= 50) return;
  const m = endlessMutation(G.floor),
    depth = G.floor - 50,
    oaths = Object.values(G.run.endlessOaths || {}).reduce((a, b) => a + b, 0);
  setTxt(
    'floorObjective',
    'ENDLESS ' +
      depth +
      ' · ' +
      m.name +
      (oaths ? ' · ' + oaths + ' OATH' + (oaths === 1 ? '' : 'S') : '')
  );
};
const endlessFloorName = floorName;
floorName = function (f) {
  return f > 50
    ? 'Endless ' + (f - 50) + ' · ' + depthFloorName(11 + ((f - 51) % 40))
    : endlessFloorName(f);
};
const endlessSave = validateSave;
validateSave = function (raw) {
  const clean = endlessSave(raw);
  clean.bestEndless =
    Number.isInteger(raw.bestEndless) && raw.bestEndless >= 0
      ? Math.min(raw.bestEndless, 999999)
      : 0;
  return clean;
};
const endlessMenu = refreshMenuStats;
refreshMenuStats = function () {
  endlessMenu();
  let badge = T('endlessRecord');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'endlessRecord';
    badge.className = 'menu-record';
    T('campaignMedal')?.after(badge);
  }
  if (badge) {
    badge.hidden = !(save.bestEndless > 0);
    badge.textContent = 'ENDLESS RECORD · DEPTH ' + (save.bestEndless || 0);
  }
};
