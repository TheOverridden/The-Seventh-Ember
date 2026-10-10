const BLESSING_COMBOS = [
  {
    id: 'thermalShock',
    name: 'Thermal Shock',
    family: 'frost',
    cards: ['firstSpark', 'burn'],
    ds: 'Freezing a burning enemy releases a 120% damage blast. The fire keeps burning.',
  },
  {
    id: 'shatter',
    name: 'Shatter',
    family: 'frost',
    cards: ['firstSpark', 'quickdraw'],
    ds: 'Flare shatters frozen enemies, releasing a 160% damage blast. Chilled Guardians also trigger it.',
  },
  {
    id: 'stormfront',
    name: 'Stormfront',
    family: 'storm',
    cards: ['firstSpark', 'shockChain'],
    ds: 'Critical Bolts against frozen or chilled enemies spread frost and lightning to two nearby targets. Once per second per target.',
  },
  {
    id: 'cinderwheel',
    name: 'Cinderwheel',
    family: 'blade',
    cards: ['orbital', 'burn'],
    ds: 'Orbiting cinders ignite every enemy they touch.',
  },
  {
    id: 'collapsedSun',
    name: 'Collapsed Sun',
    family: 'meteor',
    cards: ['blackHole', 'sunspot'],
    ds: 'Black Stars erupt with an extra 100% damage fire pulse every 0.8 seconds.',
  },
  {
    id: 'echoChamber',
    name: 'Echo Chamber',
    family: 'prism',
    cards: ['doubleCast', 'ric'],
    ds: 'Echo Cast’s repeated Bolts gain an extra ricochet and 35% damage.',
  },
  ...COMBO_RECIPES,
];
const COMBO_BY_ID = Object.fromEntries(BLESSING_COMBOS.map((c) => [c.id, c]));
function blessingComboActive(id) {
  const combo = COMBO_BY_ID[id];
  return !!combo && combo.cards.every((card) => blessingRank(card) > 0);
}
function blessingComboState() {
  if (!G.run) return null;
  const s = G.run.blessingCombos || (G.run.blessingCombos = { counts: {}, seen: [], effects: [] });
  if (!s.counts || typeof s.counts !== 'object') s.counts = {};
  if (!Array.isArray(s.seen)) s.seen = [];
  if (!Array.isArray(s.effects)) s.effects = [];
  return s;
}
function blessingCount(id, every) {
  const s = blessingComboState();
  if (!s || !blessingRank(id)) return false;
  const count = (Number.isInteger(s.counts[id]) ? s.counts[id] : 0) + 1;
  s.counts[id] = count % every;
  return count % every === 0;
}
function blessingIgnite(e, rank = 1, duration = 3) {
  if (!e || e.dead) return;
  e.burnT = Math.max(e.burnT || 0, duration);
  e.burnRank = Math.max(e.burnRank || 0, rank);
  e.burnTick = Math.min(e.burnTick || 0.4, 0.4);
}
function blessingChilled(e) {
  return e.frozenUntil > G.t || e.chilledUntil > G.t || G.run?.blessingExpansion?.freezeT > 0;
}
function blessingFreeze(e, duration = 1.1) {
  if (!e || e.dead || e.mechanism || e.growth) return false;
  if (e.isBoss) {
    if (e.frostResistUntil > G.t) return false;
    e.chilledUntil = G.t + Math.min(0.65, duration);
    e.frostResistUntil = G.t + 3;
  } else {
    e.frozenUntil = Math.max(e.frozenUntil || 0, G.t + duration);
    e.kbx = e.kby = 0;
  }
  burst(e.x, e.y, 8, '#d4f3ff', 100, 0.35, 2, true);
  if (e.burnT > 0 && blessingComboActive('thermalShock') && !(e.thermalShockUntil > G.t)) {
    e.thermalShockUntil = G.t + 0.75;
    blessingBurst(e.x, e.y, 95, G.player.dmg * 1.2, 'thermalShock', '#eff9ff');
  }
  return true;
}
function blessingEffect(effect) {
  const s = blessingComboState();
  if (!s) return;
  const life = effect.max || 0.55;
  s.effects.push({ ...effect, t: life, max: life });
  if (s.effects.length > 64) s.effects.shift();
}
function blessingBurst(x, y, radius, damage, kind, color = '#ffc780') {
  blessingEffect({ type: kind, x, y, radius, color });
  burst(x, y, 12, color, 160, 0.4, 2.5, true);
  for (const enemy of [...G.enemies])
    if (
      !enemy.dead &&
      d2(enemy.x, enemy.y, x, y) < (radius + enemy.r) ** 2 &&
      los(G.world, x, y, enemy.x, enemy.y)
    )
      damageEnemy(enemy, damage, Math.atan2(enemy.y - y, enemy.x - x), false, 0.3, kind);
}
function blessingLightning(source, rank = 1, freeze = false) {
  const targets = expansionLiving()
    .filter(
      (e) =>
        e !== source &&
        d2(e.x, e.y, source.x, source.y) < 240 ** 2 &&
        los(G.world, source.x, source.y, e.x, e.y)
    )
    .sort((a, b) => d2(a.x, a.y, source.x, source.y) - d2(b.x, b.y, source.x, source.y))
    .slice(0, 2);
  for (const target of targets) {
    damageEnemy(target, G.player.dmg * (0.45 + 0.2 * rank), 0, false, 0.1, 'thunderhead');
    blessingEffect({
      type: 'arc',
      x: source.x,
      y: source.y,
      x2: target.x,
      y2: target.y,
      color: '#d6f0ff',
    });
    if (freeze) blessingFreeze(target, 0.8);
  }
  if (targets.length) sfx('stitchPin');
}
const comboDamageEnemy = damageEnemy;
damageEnemy = function (e, damage, angle, crit, kb, kind = 'shot') {
  if (!e || e.dead || !G.run || !G.player)
    return comboDamageEnemy(e, damage, angle, crit, kb, kind);
  const chilled = blessingChilled(e),
    hp = e.hp;
  if (chilled && blessingRank('quickdraw')) damage *= 1 + 0.2 * blessingRank('quickdraw');
  const result = comboDamageEnemy(e, damage, angle, crit, kb, kind);
  if (e.hp >= hp) return result;
  if (kind === 'orbital' && blessingComboActive('cinderwheel'))
    blessingIgnite(e, blessingRank('burn'), 3);
  if ((kind === 'melee' || kind === 'meleeWave') && blessingRank('followThrough'))
    blessingIgnite(e, blessingRank('followThrough'), 2 + blessingRank('followThrough'));
  if (kind === 'melee' && chilled && blessingComboActive('shatter') && !(e.shatterUntil > G.t)) {
    e.shatterUntil = G.t + 0.8;
    e.frozenUntil = 0;
    e.chilledUntil = 0;
    blessingBurst(e.x, e.y, 105, G.player.dmg * 1.6, 'shatter', '#d6f4ff');
    sfx('comet');
  }
  if (kind !== 'shot') return result;
  const s = blessingComboState();
  if (blessingRank('firstSpark') && !e.dead) {
    e.rimeHits = ((e.rimeHits || 0) + 1) % 4;
    if (e.rimeHits === 0) blessingFreeze(e, 1.1 + 0.3 * (blessingRank('firstSpark') - 1));
  }
  if (blessingCount('lastCoal', 5))
    blessingBurst(
      e.x,
      e.y,
      65 + 15 * blessingRank('lastCoal'),
      G.player.dmg * 0.8 * blessingRank('lastCoal'),
      'heavyEmber'
    );
  if (blessingCount('patientAim', 6)) blessingLightning(e, blessingRank('patientAim'));
  if (blessingCount('emptyChamber', 6) && !(s.stillCooldown > G.t)) {
    s.stillCooldown = G.t + 3;
    expansionState().emptyChamberT = 0.6 + 0.15 * (blessingRank('emptyChamber') - 1);
    blessingEffect({ type: 'ring', x: G.player.x, y: G.player.y, radius: 130, color: '#d7e8ff' });
    sfx('shield');
  }
  if (blessingCount('bankedConstellation', 12)) {
    const rank = blessingRank('bankedConstellation'),
      stars = expansionState().bankStars;
    for (let i = 0; i < 3 + rank; i++)
      stars.push({
        a: (i * TAU) / (3 + rank),
        t: 2,
        shot: 0.2 + i * 0.15,
        power: 0.9 + 0.3 * rank,
      });
    while (stars.length > 7) stars.shift();
    sfx('stitchPin');
  }
  if (blessingCount('furnaceEnd', 20) && !(s.furnaceCooldown > G.t)) {
    s.furnaceCooldown = G.t + 18;
    expansionState().furnaceT = 7;
    G.player.ammo = G.player.magSize;
    G.player.reloadT = 0;
    burst(G.player.x, G.player.y, 24, '#ffb75c', 180, 0.6, 3, true);
    sfx('mythic');
  }
  if (
    crit &&
    !e.dead &&
    blessingChilled(e) &&
    blessingComboActive('stormfront') &&
    !(e.stormfrontUntil > G.t)
  ) {
    e.stormfrontUntil = G.t + 1;
    blessingLightning(e, blessingRank('shockChain'), true);
  }
  return result;
};
const comboKillEnemy = killEnemy;
killEnemy = function (e) {
  const frozen = e && !e.dead && blessingChilled(e),
    x = e?.x,
    y = e?.y;
  const result = comboKillEnemy(e);
  if (frozen && e.dead && blessingRank('roomTone'))
    for (const target of expansionLiving())
      if (
        target !== e &&
        d2(target.x, target.y, x, y) < 120 ** 2 &&
        los(G.world, x, y, target.x, target.y)
      )
        blessingFreeze(target, blessingRank('roomTone'));
  return result;
};
const comboFireVolley = fireVolley;
fireVolley = function () {
  const p = G.player;
  if (!p || !G.run) return comboFireVolley();
  const start = G.bullets.length;
  const result = comboFireVolley(),
    created = G.bullets.slice(start);
  if (!created.length) return result;
  if (blessingComboActive('echoChamber'))
    for (const bullet of created)
      if (bullet.echoCast) {
        bullet.ric = (bullet.ric || 0) + 1;
        bullet.dmg *= 1.35;
      }
  if (blessingCount('firstSparkReturned', 8)) {
    for (const b of created) {
      b.r += 7;
      b.pierce = (b.pierce || 0) + 6;
      b.dmg *= 5;
      b.firstReturned = true;
    }
    sfx('mythic');
  }
  if (blessingCount('solarRequiem', 8)) {
    for (let i = 0; i < 7; i++) {
      const a = (i * TAU) / 7,
        x = p.x + Math.cos(a) * 42,
        y = p.y + Math.sin(a) * 42,
        target = expansionNearest(x, y),
        aim = target ? Math.atan2(target.y - y, target.x - x) : a;
      expansionFriendlyShot(x, y, aim, p.dmg * 2.35, {
        r: 10,
        pierce: 4,
        seeking: 0.16,
        life: 1.8,
        solarRequiem: true,
      });
    }
    sfx('mythic');
  }
  return result;
};
const comboStrikeMelee = strikeMelee;
strikeMelee = function () {
  const result = comboStrikeMelee();
  if (!G.player || !blessingCount('furnaceMouth', 3)) return result;
  const p = G.player,
    rank = blessingRank('furnaceMouth'),
    reach = 175 + 25 * rank,
    a = p.meleeAngle;
  for (const e of expansionLiving())
    if (
      d2(e.x, e.y, p.x, p.y) < (reach + e.r) ** 2 &&
      Math.abs(angleDiff(Math.atan2(e.y - p.y, e.x - p.x), a)) < 0.85 &&
      los(G.world, p.x, p.y, e.x, e.y)
    ) {
      damageEnemy(e, p.dmg * 1.5 * rank, a, false, 0.4, 'furnaceMouth');
      blessingIgnite(e, rank, 3 + rank);
    }
  for (let i = -3; i <= 3; i++)
    burst(
      p.x + Math.cos(a + i * 0.2) * 80,
      p.y + Math.sin(a + i * 0.2) * 80,
      6,
      '#ffbc70',
      110,
      0.4,
      2.5,
      true
    );
  sfx('flare');
  return result;
};
const comboRecalc = recalc;
recalc = function () {
  const result = comboRecalc();
  if (!G.player || !G.run) return result;
  G.player.shotInt /= 1 + 0.08 * blessingRank('warmStart');
  MELEE.damage *= 1 + 0.12 * blessingRank('counterstep');
  MELEE.reach += 12 * blessingRank('counterstep');
  return result;
};
const comboUpdateEnemies = updateEnemies;
updateEnemies = function (dt) {
  const slowed = [];
  for (const e of G.enemies)
    if (!e.dead && e.isBoss && e.chilledUntil > G.t) {
      slowed.push([e, e.spd]);
      e.spd *= 0.65;
    }
  try {
    return comboUpdateEnemies(dt);
  } finally {
    for (const [e, speed] of slowed) e.spd = speed;
  }
};
const comboTickBlessings = tickBlessings;
tickBlessings = function (dt) {
  const result = comboTickBlessings(dt),
    s = blessingComboState();
  if (!s || !G.player) return result;
  for (const combo of BLESSING_COMBOS)
    if (blessingComboActive(combo.id) && !s.seen.includes(combo.id)) {
      s.seen.push(combo.id);
      buildAnnounce(combo.name);
    }
  for (const f of G.run.cardFields || [])
    if (f.kind === 'blackHole' && blessingComboActive('collapsedSun')) {
      f.comboPulse = (f.comboPulse || 0) - dt;
      if (f.comboPulse <= 0) {
        f.comboPulse = 0.8;
        blessingBurst(f.x, f.y, 175, G.player.dmg, 'collapsedSun', '#ffdc91');
        for (const e of expansionLiving())
          if (d2(e.x, e.y, f.x, f.y) < 175 ** 2) blessingIgnite(e, 1, 2);
      }
    }
  s.effects = s.effects.filter((effect) => {
    effect.t -= dt;
    return effect.t > 0;
  });
  return result;
};
