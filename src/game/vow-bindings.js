let hearthStartingVows = null;
function hearthVowActive(id) {
  return !!(
    G.run &&
    !G.run.guardianMode &&
    (G.run.hearthTrack?.vows || hearthStartingVows || []).includes(id)
  );
}
function applyHearthBindings() {
  const p = G.player;
  if (!p || !G.run || G.run.guardianMode) return;
  if (hearthVowActive('heart')) {
    p.maxHp = Math.min(60, p.maxHp);
    p.hp = Math.min(p.hp, p.maxHp);
  }
  if (hearthVowActive('reserve')) {
    p.magSize = Math.min(3, p.magSize);
    p.ammo = Math.min(p.ammo, p.magSize);
  }
  if (hearthVowActive('step')) {
    p.dashCd = Math.max(3.2, p.dashCd);
    p.dashCdT = Math.max(p.dashCdT, (p.vowDashReadyAt || 0) - G.run.t);
  }
  if (hearthVowActive('ward')) p.cardWard = 0;
}
const vowStartRun = startRun;
startRun = function () {
  hearthStartingVows = hearthVowsUnlocked() ? [...hearthData().selectedVows] : [];
  try {
    const out = vowStartRun();
    hearthRunTrack().vows = [...hearthStartingVows];
    applyHearthBindings();
    G.player.hp = G.player.maxHp;
    saveNow('vows');
    return out;
  } finally {
    hearthStartingVows = null;
  }
};
const vowRecalc = recalc;
recalc = function () {
  const out = vowRecalc();
  applyHearthBindings();
  return out;
};
const vowEmberCapacity = emberCapacity;
emberCapacity = function () {
  const n = vowEmberCapacity();
  return hearthVowActive('reserve') ? Math.min(3, n) : n;
};
const vowInitCombat = initCombat;
initCombat = function () {
  const out = vowInitCombat();
  applyHearthBindings();
  return out;
};
const vowDamageEnemy = damageEnemy;
damageEnemy = function (e, damage, a, crit, kb, kind = 'shot') {
  return vowDamageEnemy(
    e,
    damage * (kind === 'shot' && hearthVowActive('bolt') ? 0.6 : 1),
    a,
    crit,
    kb,
    kind
  );
};
const vowHurtPlayer = hurtPlayer;
hurtPlayer = function (damage, x, y) {
  applyHearthBindings();
  const out = vowHurtPlayer(damage * (hearthVowActive('iron') ? 1.5 : 1), x, y);
  applyHearthBindings();
  return out;
};
const vowCardHeal = cardHeal;
cardHeal = function (...args) {
  const out = vowCardHeal(...args);
  applyHearthBindings();
  return out;
};
const vowTickBlessings = tickBlessings;
tickBlessings = function (dt) {
  const out = vowTickBlessings(dt);
  applyHearthBindings();
  return out;
};
const vowUpdate = update;
update = function (dt) {
  applyHearthBindings();
  const dash = G.player?.dashT || 0,
    out = vowUpdate(dt);
  if (hearthVowActive('step') && dash <= 0 && G.player.dashT > 0)
    G.player.vowDashReadyAt = G.run.t + 3.2;
  applyHearthBindings();
  return out;
};
const vowResumeRun = resumeRun;
resumeRun = function () {
  const out = vowResumeRun();
  applyHearthBindings();
  return out;
};
const vowUpdateHUD = updateHUD;
updateHUD = function (dt) {
  applyHearthBindings();
  const out = vowUpdateHUD(dt),
    el = T('vowHud');
  if (el) {
    const vows =
      G.run && !G.run.guardianMode ? G.run.hearthTrack?.vows || hearthStartingVows || [] : [];
    el.hidden = !vows.length;
    el.textContent = vows.length + ' ' + (vows.length === 1 ? 'BINDING' : 'BINDINGS');
    el.title = vows.map((id) => HEARTH_VOWS.find((v) => v.id === id)?.name).join(' · ');
  }
  return out;
};
