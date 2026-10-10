let hearthTrialSession = null,
  hearthTrial = null,
  hearthTrialBoundary = false;
const HEARTH_TRIAL_COLORS = {
  stitch: ['#92d8df', '#41646b', '#17232a'],
  flare: ['#ffbd72', '#86513a', '#2a1d18'],
  oneHeart: ['#f0a5a6', '#6e414b', '#271b25'],
  defense: ['#f8d38b', '#7c6241', '#262319'],
  constellation: ['#c4bcf1', '#605575', '#242030'],
  guardian: ['#e9d598', '#726647', '#27251e'],
};
function isHearthTrial() {
  return !!(hearthTrial && G.run?.mode === 'trial');
}
function installHearthTrialUI() {
  if (T('hearthTrialHud')) return;
  const hud = document.createElement('div');
  hud.id = 'hearthTrialHud';
  hud.className = 'trial-hud';
  hud.hidden = true;
  hud.innerHTML =
    '<header><span id="trialTier"></span><b id="trialTitle"></b><output id="trialTime"></output></header><p id="trialRule"></p><div class="trial-progress"><i id="trialProgress"></i><b id="trialObjective"></b></div><small id="trialHint"></small>';
  T('hud').appendChild(hud);
  const result = document.createElement('div');
  result.id = 'hearthTrialResult';
  result.className = 'ov';
  result.setAttribute('role', 'dialog');
  result.setAttribute('aria-modal', 'true');
  result.setAttribute('aria-labelledby', 'trialResultTitle');
  result.innerHTML =
    '<section class="trial-result-shell"><span id="trialResultKicker"></span><h2 id="trialResultTitle"></h2><p id="trialResultText"></p><div class="trial-result-stats"><span><b id="trialResultTime"></b>TIME</span><span><b id="trialResultHits"></b>HITS TAKEN</span></div><div class="trial-result-rewards" id="trialResultRewards"></div><div class="trial-result-actions"><button class="btn primary" id="trialRetry">RETRY TRIAL</button><button class="btn" id="trialBoard">TRIAL BOARD</button><button class="btn" id="trialReturn">RETURN TO HEARTH</button></div></section>';
  document.body.appendChild(result);
  on(T('trialRetry'), 'click', () => {
    if (hearthTrial?.paused) pauseGame(false);
    else retryHearthTrial();
  });
  on(T('trialBoard'), 'click', () => leaveHearthTrial(true));
  on(T('trialReturn'), 'click', () => leaveHearthTrial(false));
  result.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const buttons = [...result.querySelectorAll('button:not(:disabled)')],
      first = buttons[0],
      last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
function createHearthTrialRoom(id) {
  const W = 28,
    H = 21,
    grid = new Uint8Array(W * H),
    room = { x: 2, y: 2, w: 24, h: 17, cx: 14, cy: 10 };
  for (let y = 2; y < 19; y++)
    for (let x = 2; x < 26; x++) {
      if ((x < 4 || x > 23) && (y < 4 || y > 16)) continue;
      grid[y * W + x] = 1;
    }
  if (id === 'flare' || id === 'oneHeart')
    for (const [x, y] of [
      [8, 8],
      [19, 12],
    ]) {
      grid[y * W + x] = 0;
      grid[(y + 1) * W + x] = 0;
    }
  return {
    W,
    H,
    grid,
    shade: new Uint8Array(W * H),
    deco: new Uint8Array(W * H),
    reveal: new Uint8Array(W * H).fill(1),
    rooms: [room],
    exit: room,
    pi: 0,
    region: 'hearthTrial',
    props: [],
    torches: [],
    fixtures: [],
    echoes: [],
    hazards: [],
    lateHazards: [],
    mmDirty: true,
  };
}
function hearthTrialPlayer(id) {
  return {
    x: TILE * 14.5,
    y: TILE * 14.5,
    r: 12,
    hp: id === 'oneHeart' ? 30 : 140,
    maxHp: id === 'oneHeart' ? 30 : 140,
    shotT: 0,
    hitCd: 1.5,
    dashT: 0,
    dashCdT: 0,
    kbx: 0,
    kby: 0,
    orbA: 0,
    muzzle: 0,
    face: -Math.PI / 2,
    moving: false,
    lean: 0,
    ghosts: [],
    ghostT: 0,
    dashDx: 1,
    dashDy: 0,
    dmg: id === 'stitch' || id === 'constellation' ? 44 : 23,
    shotInt: 0.3,
    proj: 1,
    pierce: 0,
    ric: 0,
    regen: 0,
    orbN: 0,
    dashCd: 1.5,
    xpMul: 0,
    execB: 0,
    speed: 224,
    magnet: 0,
    critC: 0,
    magSize: 8,
    ammo: 8,
    reloadDuration: 1.2,
    reloadT: 0,
    meleeCdT: 0,
    meleeWindT: 0,
    meleeHitT: 0,
    meleeAngle: 0,
    pathSpeed: 1,
    dashDistance: 1,
    cardWard: 0,
  };
}
function startHearthTrial(id, tier = 0) {
  if (!isHearthTrial() && (G.descending || !['menu', 'paused', 'playing'].includes(G.state)))
    return false;
  const spec = HEARTH_TRIALS.find((trial) => trial.id === id);
  tier = clamp(Math.floor(tier), 0, 2);
  if (!spec || !hearthTrialUnlocked(id, tier)) return false;
  installHearthTrialUI();
  if (!isHearthTrial()) {
    if (G.state === 'playing') pauseGame(true);
    hearthTrialBoundary = true;
    try {
      hearthClose();
      saveNow('trial-entry');
    } finally {
      hearthTrialBoundary = false;
    }
    hearthTrialSession = {
      game: { ...G },
      meta: META,
      melee: { ...MELEE, cleave: MELEE.cleave.slice() },
      dialogue,
      storyQueue,
      notices: armoryNotices,
      chapterBannerT,
      fieldNoteT,
      resume: save.resume,
      guardianSession: save.guardianSession,
      feel: { ...COMBAT_FEEL },
      polish: { ...COMBAT_POLISH },
      overlays: [...document.querySelectorAll('.ov.open')].map((el) => el.id),
      labels: {
        saveExit: T('btnSaveExit').textContent,
        abandon: T('btnAbandon').textContent,
        bossName: T('bossname').textContent,
        bossOn: T('bossbar').classList.contains('on'),
        chapterOn: T('chapterBanner').classList.contains('visible'),
        fieldOn: T('fieldNote').classList.contains('visible'),
        meleeText: [...T('btnMelee').childNodes]
          .filter((node) => node.nodeType === 3)
          .map((node) => [node, node.textContent]),
        meleeAria: T('btnMelee').getAttribute('aria-label'),
      },
    };
  }
  clearInput();
  T('toasts').replaceChildren();
  for (const el of document.querySelectorAll('.ov.open')) if (el.id) hide(el.id);
  hearthTrial = {
    id,
    tier,
    spec,
    elapsed: 0,
    hits: 0,
    wave: 0,
    waves: id === 'guardian' ? 1 : 3 + tier,
    kills: 0,
    spawned: 0,
    clock: 2.5,
    queue: [],
    gates: [],
    recovered: 0,
    runes: [],
    flame: { x: TILE * 14.5, y: TILE * 10.5, hp: 100, max: 100, hitT: 0 },
    result: null,
    paused: false,
    sealT: 0,
    sweeps: [],
    sweepClock: 12,
    sweepSerial: 0,
  };
  const up =
    id === 'stitch' || id === 'constellation'
      ? { brightNeedle: 1, longThread: 2, heldPattern: 2, hotWire: 3, unfinishedPattern: 1 }
      : {};
  G.run = {
    mode: 'trial',
    level: 1,
    xp: 0,
    up,
    ess: 0,
    kills: 0,
    t: 0,
    revUsed: true,
    runRevUsed: true,
    won: false,
    forms: { primary: 'emberBolt', flare: 'crownFlare', dash: 'cinderstep' },
    evolutions: [],
    guardianMode: { trial: true, boons: {}, hits: 0 },
    floorAge: 0,
    trial: { id, tier },
  };
  G.world = createHearthTrialRoom(id);
  G.player = hearthTrialPlayer(id);
  G.floor = 1;
  G.t = 0;
  G.dead = false;
  G.paused = false;
  G.descending = false;
  G.victoryPending = 0;
  G.pendingLevels = 0;
  G.boss = null;
  G.bossActive = false;
  for (const key of ['enemies', 'bullets', 'ebul', 'picks', 'chests', 'parts', 'texts'])
    G[key] = [];
  G.portal = null;
  G.cam = { x: G.player.x - G.w / 2, y: G.player.y - G.h * 0.46, shake: 0 };
  META = {
    hp: 0,
    dmg: 1,
    rate: 1,
    speed: 1,
    mag: 1,
    crit: 0,
    dash: 1,
    xp: 1,
    ess: 1,
    charges: 0,
    revive: false,
    reload: 1,
    armor: 0,
    floorHeal: 0,
    regen: 0,
    boss: 1,
    flare: 1,
    flareReach: 0,
    flareCd: 1,
    pierce: 0,
    orbit: 0,
    rarity: 0,
    critPower: 0,
    dashSpeed: 1,
    dashIFrame: 0,
    dashTrail: 0,
    rekindleWard: 0,
    overcharge: 0,
    brand: 0,
    boltNovaEvery: 0,
    flareWave: false,
    critNova: false,
    steady: false,
  };
  Object.assign(COMBAT_FEEL, { casts: [], impacts: [], deaths: [], hurtT: 0, hurtA: 0, serial: 0 });
  Object.assign(COMBAT_POLISH, {
    freeze: 0,
    spawns: [],
    debris: [],
    dashes: [],
    near: [],
    flash: 0,
    lookX: 0,
    lookY: 0,
    appliedX: 0,
    appliedY: 0,
    serial: 0,
  });
  Object.assign(MELEE, {
    damage: 2.6,
    reach: 105,
    halfArc: Math.PI,
    windup: 0.1,
    swing: 0.23,
    cooldown: id === 'flare' ? 0.68 : 0.8,
    cleave: [1, 1, 1, 1, 1, 1, 1],
  });
  dialogue = null;
  storyQueue = [];
  armoryNotices = [];
  chapterBannerT = fieldNoteT = 0;
  T('conversation').hidden = true;
  T('chapterBanner').classList.remove('visible');
  T('fieldNote').classList.remove('visible');
  T('bossbar').classList.remove('on');
  T('prompt').classList.remove('on');
  T('fade').style.opacity = 0;
  document.body.classList.remove('conversing', 'guardian-mode');
  document.body.classList.add('hearth-trial');
  document.body.dataset.hearthTrial = id;
  for (const key of Object.keys(hudCache)) delete hudCache[key];
  T('hearthTrialHud').hidden = false;
  setState('playing');
  initAudio();
  mouse.x = G.w / 2;
  mouse.y = G.h / 2 - 120;
  if (up.brightNeedle) {
    starstitchPin(hearthTrial.flame.x - 115, hearthTrial.flame.y + 50);
    starstitchPin(hearthTrial.flame.x + 115, hearthTrial.flame.y + 50);
    starstitchPin(hearthTrial.flame.x, hearthTrial.flame.y - 125);
  }
  if (id === 'constellation')
    hearthTrial.runes = [
      { x: TILE * 7.5, y: TILE * 6.5, recovered: false },
      { x: TILE * 21.5, y: TILE * 7.5, recovered: false },
      { x: TILE * 14.5, y: TILE * 16.5, recovered: false },
    ];
  syncHearthTrialHUD();
  return true;
}
function leaveHearthTrial(openBoard = false) {
  if (!isHearthTrial()) return;
  const old = hearthTrialSession;
  const display = { w: G.w, h: G.h, dpr: G.dpr, cv: G.cv, ctx: G.ctx, tAll: G.tAll };
  clearInput();
  hide('hearthTrialResult');
  T('hearthTrialHud').hidden = true;
  document.body.classList.remove('hearth-trial');
  delete document.body.dataset.hearthTrial;
  for (const key of Object.keys(hudCache)) delete hudCache[key];
  hearthTrial = hearthTrialSession = null;
  for (const key of Object.keys(G)) if (!(key in old.game)) delete G[key];
  Object.assign(G, old.game, display);
  META = old.meta;
  Object.assign(MELEE, old.melee);
  Object.assign(COMBAT_FEEL, old.feel);
  Object.assign(COMBAT_POLISH, old.polish);
  dialogue = old.dialogue;
  storyQueue = old.storyQueue;
  armoryNotices = old.notices;
  chapterBannerT = old.chapterBannerT;
  fieldNoteT = old.fieldNoteT;
  save.resume = old.resume;
  save.guardianSession = old.guardianSession;
  T('btnSaveExit').textContent = old.labels.saveExit;
  T('btnAbandon').textContent = old.labels.abandon;
  T('bossname').textContent = old.labels.bossName;
  T('bossbar').classList.toggle('on', old.labels.bossOn && !!G.boss && !G.boss.dead);
  T('chapterBanner').classList.toggle('visible', old.labels.chapterOn);
  T('fieldNote').classList.toggle('visible', old.labels.fieldOn);
  for (const [node, text] of old.labels.meleeText) node.textContent = text;
  if (old.labels.meleeAria) T('btnMelee').setAttribute('aria-label', old.labels.meleeAria);
  document.body.classList.toggle('guardian-mode', !!isGuardianMode());
  document.body.classList.toggle('conversing', !!dialogue);
  T('aimStick').classList.remove('trial-bolt-disabled');
  T('conversation').hidden = !dialogue;
  for (const id of old.overlays) if (T(id)) show(id);
  setState(G.state);
  if (G.run && G.player && G.world) updateHUD(0);
  hearthTrialBoundary = true;
  try {
    saveNow('trial-return');
    if (openBoard) hearthTrialOpenBoard();
    else hearthOpen('room');
  } finally {
    hearthTrialBoundary = false;
  }
}
function retryHearthTrial() {
  if (!isHearthTrial()) return;
  startHearthTrial(hearthTrial.id, hearthTrial.tier);
}
function hearthTrialRoster(wave) {
  const tier = hearthTrial.tier,
    all = [
      ['slime', 'bat', 'slime', 'spitter'],
      ['bat', 'slime', 'brute', 'bat', 'spitter'],
      ['brute', 'spitter', 'bat', 'slime', 'brute', 'bat'],
      ['bat', 'spitter', 'brute', 'wisp', 'slime', 'bat', 'spitter'],
      ['brute', 'spitter', 'wisp', 'bat', 'brute', 'slime', 'spitter', 'bat'],
    ];
  const roster = all[Math.min(wave, all.length - 1)].slice();
  if (tier === 0) return roster.slice(0, 4 + Math.min(2, wave));
  if (tier === 2) roster.push(wave % 2 ? 'brute' : 'spitter');
  return roster;
}
function hearthTrialGate(index) {
  const points = [
    { x: TILE * 14.5, y: TILE * 3.5 },
    { x: TILE * 24.5, y: TILE * 10.5 },
    { x: TILE * 14.5, y: TILE * 17.5 },
    { x: TILE * 3.5, y: TILE * 10.5 },
  ];
  return points[index % points.length];
}
function spawnHearthTrialEnemy(type, point, serial) {
  const t = ETYPES[type],
    tier = hearthTrial.tier,
    wave = hearthTrial.wave,
    hp = Math.round(
      (type === 'brute' ? 90 : type === 'wisp' ? 48 : type === 'spitter' ? 40 : 36) *
        (1 + tier * 0.26 + Math.max(0, wave - 1) * 0.1)
    ),
    pos = safePosition(G.world, point.x, point.y, t.r) || point,
    e = {
      type,
      ai: t.ai,
      x: pos.x,
      y: pos.y,
      r: t.r,
      hp,
      max: hp,
      spd: Math.max(65, Math.min(130, t.spd)) * (1 + tier * 0.07),
      dmg: 8 + tier * 3,
      xp: 0,
      col: t.col,
      spr: t.spr,
      elite: false,
      kb: t.kb,
      kbx: 0,
      kby: 0,
      hitT: 0,
      atkT: 0.7,
      seed: serial * 1.618,
      t1: 1.5 + (serial % 4) * 0.2,
      t2: 0,
      orbT: 0,
      aggro: true,
      isBoss: false,
      dead: false,
      uid: ++entitySerial,
      trialEnemy: true,
      trialFlame:
        hearthTrial.id === 'defense' &&
        (['brute', 'slime'].includes(type) || (type === 'spitter' && serial % 2 === 0)),
    };
  G.enemies.push(e);
  return e;
}
function spawnHearthTrialGuardian() {
  const tier = hearthTrial.tier,
    e = spawnHearthTrialEnemy('brute', hearthTrialGate(0), 1);
  Object.assign(e, {
    type: 'trialGuardian',
    spr: 'gateWarden',
    ai: 'trialGuardian',
    r: 31,
    hp: 2100 + tier * 800,
    max: 2100 + tier * 800,
    spd: 74,
    dmg: 11 + tier * 4,
    kb: 0.08,
    col: '#e7cb8c',
    isBoss: true,
    name: 'WARDEN’S REFLECTION',
    trialMode: 'walk',
    trialClock: 2,
    trialCycle: 0,
    phase: 0,
    tier: 1,
  });
  G.boss = e;
  G.bossActive = true;
  T('bossname').textContent = e.name;
  T('bossbar').classList.add('on');
}
function tickHearthTrialWaves(dt) {
  const q = hearthTrial,
    cap = [3, 5, 7][q.tier];
  q.clock -= dt;
  for (let i = q.gates.length - 1; i >= 0; i--) {
    const gate = q.gates[i];
    gate.t -= dt;
    if (gate.t <= 0) {
      if (gate.type === 'guardian') spawnHearthTrialGuardian();
      else spawnHearthTrialEnemy(gate.type, gate, q.spawned++);
      burst(gate.x, gate.y, 10, HEARTH_TRIAL_COLORS[q.id][0], 100, 0.4, 2, true);
      q.gates.splice(i, 1);
    }
  }
  const alive = G.enemies.filter((e) => !e.dead).length;
  if (!q.queue.length && !alive && !q.gates.length) {
    if (q.wave >= q.waves) {
      if (q.id === 'constellation' && q.recovered < 3) return;
      q.sealT += dt;
      if (q.sealT > 0.75) finishHearthTrial(true);
      return;
    }
    if (q.clock > 0) return;
    q.queue = q.id === 'guardian' ? ['guardian'] : hearthTrialRoster(q.wave);
    q.wave++;
    q.clock = 0.2;
  }
  if (q.queue.length && alive + q.gates.length < cap && q.clock <= 0) {
    let gateIndex = (q.spawned + q.gates.length + q.wave) % 4,
      point = hearthTrialGate(gateIndex);
    if (d2(point.x, point.y, G.player.x, G.player.y) < 125 ** 2)
      point = hearthTrialGate(gateIndex + 2);
    q.gates.push({ ...point, type: q.queue.shift(), t: 1.1, max: 1.1 });
    q.clock = q.tier === 2 ? 0.75 : 1.05;
  }
}
function tickHearthTrialGuardian(e, dt) {
  const p = G.player,
    q = hearthTrial,
    enraged = e.hp < e.max * 0.5,
    speed = enraged ? 1.2 : 1;
  e.trialClock -= dt * speed;
  if (e.trialMode === 'wind') {
    if (e.trialClock <= 0) {
      e.trialMode = 'dash';
      e.trialClock = 0.5;
      sfx('dash');
    }
  } else if (e.trialMode === 'dash') {
    moveEnt(G.world, e, Math.cos(e.trialAngle) * 510 * dt, Math.sin(e.trialAngle) * 510 * dt);
    if (e.trialClock <= 0) {
      e.trialMode = 'rest';
      e.trialClock = 0.95;
    }
  } else if (e.trialMode === 'beam') {
    const old = e.trialAngle;
    e.trialAngle += dt * (enraged ? 1.3 : 1) * (q.tier === 2 ? 1.25 : 0.8);
    const a = Math.atan2(p.y - e.y, p.x - e.x),
      d = Math.hypot(p.x - e.x, p.y - e.y);
    if (d > 38 && Math.abs(angleDiff(a, (old + e.trialAngle) / 2)) * d < p.r + 8)
      hurtPlayer(e.dmg, e.x, e.y);
    if (e.trialClock <= 0) {
      e.trialMode = 'rest';
      e.trialClock = 1.1;
    }
  } else if (e.trialMode === 'beamWind') {
    if (e.trialClock <= 0) {
      e.trialMode = 'beam';
      e.trialClock = 4.1;
      sfx('charge');
    }
  } else {
    if (e.trialMode === 'walk') {
      const a = Math.atan2(p.y - e.y, p.x - e.x);
      moveEnt(G.world, e, Math.cos(a) * e.spd * dt, Math.sin(a) * e.spd * dt);
    }
    if (e.trialClock <= 0) {
      const cycle = e.trialCycle++ % (q.tier ? 4 : 3);
      if (cycle === 0) {
        e.trialMode = 'wind';
        e.trialClock = 0.65;
        e.trialAngle = Math.atan2(p.y - e.y, p.x - e.x);
      } else if (cycle === 3) {
        e.trialMode = 'beamWind';
        e.trialAngle = Math.atan2(p.y - e.y, p.x - e.x) - 0.7;
        e.trialClock = 0.9;
      } else {
        const count = cycle === 1 ? 8 + q.tier * 2 : 3 + q.tier * 2,
          a = Math.atan2(p.y - e.y, p.x - e.x);
        for (let i = 0; i < count; i++) {
          const angle =
            cycle === 1
              ? (i / count) * TAU + e.trialCycle * 0.25
              : a + (i - (count - 1) / 2) * 0.16;
          enemyShoot(e, angle, 155 + q.tier * 22, e.dmg * 0.7);
        }
        e.trialMode = 'walk';
        e.trialClock = enraged ? 1.3 : 1.8;
      }
    }
  }
}
function tickHearthTrialEnemies(dt) {
  const q = hearthTrial,
    p = G.player;
  for (const e of G.enemies) {
    if (e.dead) continue;
    e.hitT = Math.max(0, e.hitT - dt);
    e.atkT -= dt;
    e.t1 -= dt;
    const target = e.trialFlame ? q.flame : p,
      dx = target.x - e.x,
      dy = target.y - e.y,
      distance = Math.hypot(dx, dy) || 1,
      angle = Math.atan2(dy, dx);
    if (e.isBoss) tickHearthTrialGuardian(e, dt);
    else {
      let speed = e.spd,
        a = angle;
      if (e.type === 'spitter') {
        speed = distance > 215 ? speed : distance < 165 ? -speed * 0.65 : 0;
        if (e.t1 <= 0 && distance < 520 && los(G.world, e.x, e.y, target.x, target.y)) {
          enemyShoot(e, angle, 175 + q.tier * 16, e.dmg);
          e.t1 = 2.25 - q.tier * 0.16;
        }
      } else if (e.type === 'bat' || e.type === 'wisp') a += Math.sin(G.t * 3 + e.seed) * 0.42;
      if (e.frozenUntil > G.t) speed = 0;
      moveEnt(
        G.world,
        e,
        Math.cos(a) * speed * dt + e.kbx * dt,
        Math.sin(a) * speed * dt + e.kby * dt
      );
    }
    e.kbx *= Math.pow(0.001, dt);
    e.kby *= Math.pow(0.001, dt);
    if (e.atkT <= 0 && d2(p.x, p.y, e.x, e.y) < (e.r + p.r + 2) ** 2) {
      e.atkT = 0.8;
      hurtPlayer(e.dmg, e.x, e.y);
    }
    if (
      q.id === 'defense' &&
      e.trialFlame &&
      e.atkT <= 0 &&
      d2(e.x, e.y, q.flame.x, q.flame.y) < (e.r + 28) ** 2
    ) {
      e.atkT = 1;
      hurtHearthTrialFlame(4 + q.tier * 2);
    }
    const motion = CREATURE_MOTION.get(e) || { x: e.x, y: e.y, travel: 0, phase: 0, moving: false },
      distanceMoved = Math.hypot(e.x - motion.x, e.y - motion.y);
    motion.moving = distanceMoved > 0.03;
    motion.phase = save.motion ? 0 : (motion.phase + distanceMoved / 58) % 1;
    motion.travel += distanceMoved;
    motion.x = e.x;
    motion.y = e.y;
    CREATURE_MOTION.set(e, motion);
  }
  G.enemies = G.enemies.filter((e) => !e.dead);
}
function hurtHearthTrialFlame(amount) {
  if (!isHearthTrial() || hearthTrial.result) return;
  const f = hearthTrial.flame;
  f.hp = Math.max(0, f.hp - amount);
  f.hitT = 0.2;
  burst(f.x, f.y, 6, '#ff9e76', 85, 0.3, 2, true);
  if (f.hp <= 0) finishHearthTrial(false, 'The Hearth flame went out.');
}
function updateHearthTrial(dt) {
  const p = G.player,
    q = hearthTrial;
  if (q.result || q.paused) return;
  q.elapsed += dt;
  G.run.t += dt;
  G.t += dt;
  p.hitCd = Math.max(0, p.hitCd - dt);
  p.dashCdT = Math.max(0, p.dashCdT - dt);
  p.shotT = Math.max(0, p.shotT - dt);
  p.muzzle = Math.max(0, p.muzzle - dt);
  p.meleeCdT = Math.max(0, p.meleeCdT - dt);
  p.meleeHitT = Math.max(0, p.meleeHitT - dt);
  if (p.reloadT > 0) {
    p.reloadT = Math.max(0, p.reloadT - dt);
    if (!p.reloadT) p.ammo = p.magSize;
  }
  if (reloadQueued) {
    reloadQueued = false;
    beginReload();
  }
  let mx =
      (keys.KeyD || keys.ArrowRight ? 1 : 0) -
      (keys.KeyA || keys.ArrowLeft ? 1 : 0) +
      touchInput.moveX +
      controllerInput.moveX,
    my =
      (keys.KeyS || keys.ArrowDown ? 1 : 0) -
      (keys.KeyW || keys.ArrowUp ? 1 : 0) +
      touchInput.moveY +
      controllerInput.moveY,
    magnitude = Math.hypot(mx, my);
  if (magnitude > 1) {
    mx /= magnitude;
    my /= magnitude;
  }
  p.moving = magnitude > 0.01;
  if (dashQueued && p.dashCdT <= 0 && p.dashT <= 0) {
    const a = magnitude ? Math.atan2(my, mx) : aimAngle();
    p.dashT = 0.18;
    p.dashDx = Math.cos(a);
    p.dashDy = Math.sin(a);
    p.dashCdT = p.dashCd;
    sfx('dash');
  }
  dashQueued = false;
  if (p.dashT > 0) {
    p.dashT = Math.max(0, p.dashT - dt);
    moveEnt(G.world, p, p.dashDx * 540 * dt, p.dashDy * 540 * dt);
    p.ghostT -= dt;
    if (p.ghostT <= 0) {
      p.ghostT = 0.024;
      p.ghosts.push({
        x: p.x,
        y: p.y + 2,
        rot: Math.atan2(p.dashDy, p.dashDx) + Math.PI / 2,
        life: 1,
      });
    }
  } else moveEnt(G.world, p, mx * p.speed * dt + p.kbx * dt, my * p.speed * dt + p.kby * dt);
  p.kbx *= Math.pow(0.0005, dt);
  p.kby *= Math.pow(0.0005, dt);
  p.lean = lerp(p.lean, mx * 0.23, 1 - Math.exp(-dt * 9));
  p.ghosts = p.ghosts.filter((ghost) => (ghost.life -= dt * 3.4) > 0);
  aimTarget = keys.KeyJ || touchInput.fire ? nearestTarget() : null;
  p.face = aimAngle();
  if ((mouse.down || keys.KeyJ || touchInput.fire || controllerInput.fire) && p.shotT <= 0)
    fireVolley();
  if (meleeQueued) {
    meleeQueued = false;
    beginMelee();
  }
  if (p.meleeWindT > 0) {
    p.meleeWindT = Math.max(0, p.meleeWindT - dt);
    if (!p.meleeWindT) strikeMelee();
  }
  interactQueued = false;
  for (const rune of q.runes)
    if (!rune.recovered && d2(p.x, p.y, rune.x, rune.y) < 34 ** 2) {
      rune.recovered = true;
      q.recovered++;
      starstitchPin(rune.x, rune.y);
      burst(rune.x, rune.y, 18, '#d7d0ff', 125, 0.5, 3, true);
      sfx('stitchPin');
    }
  if (q.id === 'stitch' || q.id === 'constellation') tickHearthTrialStitch(dt);
  tickHearthTrialWaves(dt);
  if (q.result) return;
  tickHearthTrialEnemies(dt);
  if (q.result) return;
  updateHearthTrialShots(dt);
  if (q.result) return;
  tickHearthTrialSweeps(dt);
  if (q.result) return;
  updateFx(dt);
  q.flame.hitT = Math.max(0, q.flame.hitT - dt);
  const targetX = p.x - G.w / 2,
    targetY = p.y - G.h * 0.46;
  G.cam.x = lerp(G.cam.x, targetX, 1 - Math.exp(-dt * 7));
  G.cam.y = lerp(G.cam.y, targetY, 1 - Math.exp(-dt * 7));
  G.cam.shake = Math.max(0, G.cam.shake - dt * 2.4);
  syncHearthTrialHUD();
}
function tickHearthTrialSweeps(dt) {
  const q = hearthTrial;
  if (!q.tier || !['oneHeart', 'constellation'].includes(q.id)) return;
  q.sweepClock -= dt;
  if (q.sweepClock <= 0) {
    q.sweepClock = q.tier === 2 ? 7.5 : 11;
    q.sweeps.push({ vertical: q.sweepSerial++ % 2 === 0, t: 0, life: 6.2, warning: 1.2 });
  }
  for (const sweep of q.sweeps) {
    sweep.t += dt;
    sweep.life -= dt;
    if (sweep.t <= sweep.warning) continue;
    const progress = clamp((sweep.t - sweep.warning) / 5, 0, 1),
      coordinate = sweep.vertical ? TILE * (3 + 22 * progress) : TILE * (3 + 15 * progress),
      distance = Math.abs((sweep.vertical ? G.player.x : G.player.y) - coordinate);
    if (distance < G.player.r + 6)
      hurtPlayer(
        8 + q.tier * 2,
        sweep.vertical ? coordinate : G.player.x - 20,
        sweep.vertical ? G.player.y - 20 : coordinate
      );
  }
  q.sweeps = q.sweeps.filter((sweep) => sweep.life > 0);
}
function tickHearthTrialStitch(dt) {
  const s = expansionState(),
    lines = starstitchLines();
  s.pins = s.pins.filter((pin) => (pin.life -= dt) > 0);
  for (const e of G.enemies)
    if (
      !e.dead &&
      (e.trialThreadT || 0) <= G.t &&
      lines.some(([a, b]) => expansionSegmentDistance(e.x, e.y, a.x, a.y, b.x, b.y) < e.r + 13)
    ) {
      e.trialThreadT = G.t + 0.28;
      damageEnemy(e, 19, 0, false, 0, 'starstitch');
    }
}
function updateHearthTrialShots(dt) {
  for (let i = G.bullets.length - 1; i >= 0; i--) {
    const b = G.bullets[i];
    b.life -= dt;
    const steps = Math.max(1, Math.ceil((Math.hypot(b.vx, b.vy) * dt) / 14));
    for (let step = 0; step < steps && b.life > 0; step++) {
      b.x += (b.vx * dt) / steps;
      b.y += (b.vy * dt) / steps;
      if (solidPx(G.world, b.x, b.y)) b.life = 0;
      for (const e of G.enemies) {
        if (e.dead || b.life <= 0) continue;
        if (d2(e.x, e.y, b.x, b.y) < (e.r + b.r) ** 2) {
          damageEnemy(e, b.dmg, Math.atan2(b.vy, b.vx), false, 0.35, 'shot');
          b.life = 0;
        }
      }
    }
    if (b.life <= 0) G.bullets.splice(i, 1);
  }
  for (let i = G.ebul.length - 1; i >= 0; i--) {
    const b = G.ebul[i];
    b.life -= dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (solidPx(G.world, b.x, b.y)) b.life = 0;
    if (b.life > 0 && d2(b.x, b.y, G.player.x, G.player.y) < (b.r + G.player.r) ** 2) {
      if (G.player.dashT <= 0) {
        hurtPlayer(b.dmg, b.x, b.y);
        b.life = 0;
      }
    }
    if (
      b.life > 0 &&
      hearthTrial.id === 'defense' &&
      d2(b.x, b.y, hearthTrial.flame.x, hearthTrial.flame.y) < 28 ** 2
    ) {
      hurtHearthTrialFlame(4 + hearthTrial.tier * 2);
      b.life = 0;
    }
    if (b.life <= 0) G.ebul.splice(i, 1);
  }
}
function syncHearthTrialHUD() {
  const q = hearthTrial,
    p = G.player;
  if (!q || !p) return;
  setTxt('trialTier', q.spec.tiers[q.tier].name);
  setTxt('trialTitle', q.spec.name);
  setTxt('trialTime', modeTime(q.elapsed));
  setTxt('trialRule', q.spec.rule);
  const alive = G.enemies.filter((e) => !e.dead).length,
    objective =
      q.id === 'defense'
        ? 'HEARTH ' + Math.ceil(q.flame.hp) + '% · WAVE ' + Math.max(1, q.wave) + ' / ' + q.waves
        : q.id === 'constellation'
          ? 'STARS ' + q.recovered + ' / 3 · WAVE ' + Math.max(1, q.wave) + ' / ' + q.waves
          : q.id === 'guardian'
            ? G.boss
              ? 'REFLECTION ' + Math.ceil(100 * Math.max(0, G.boss.hp / G.boss.max)) + '%'
              : 'THE REFLECTION APPROACHES'
            : 'WAVE ' + Math.max(1, q.wave) + ' / ' + q.waves + ' · ' + alive + ' REMAINING';
  setTxt('trialObjective', objective);
  T('trialProgress').style.width =
    (q.id === 'defense'
      ? q.flame.hp
      : q.id === 'guardian'
        ? G.boss
          ? 100 * (1 - G.boss.hp / G.boss.max)
          : 0
        : 100 * (Math.max(0, q.wave - 1) / q.waves)) + '%';
  const hints = {
    stitch: 'Bolt places pins at your aim. Spread three pins apart. Flare collapses the threads.',
    flare: 'Flare strikes all around you. Group enemies, then sweep through. Bolt is disabled.',
    oneHeart: 'Thirty health. No healing. Dash passes safely through shots and moving light.',
    defense: 'Intercept enemies and shots before they reach the central flame.',
    constellation:
      'Touch the three broken stars, then finish every wave. Bolt places pins; Flare collapses them.',
    guardian: 'Watch the reflection’s stance. Dash through the turning light.',
  };
  setTxt('trialHint', hints[q.id]);
  T('hpfill').style.width = Math.max(0, (100 * p.hp) / p.maxHp) + '%';
  setTxt('hptext', Math.max(0, Math.ceil(p.hp)) + ' / ' + p.maxHp);
  T('dashmeter').style.setProperty('--p', clamp(1 - p.dashCdT / p.dashCd, 0, 1).toFixed(3));
  T('lowvig').style.opacity = p.hp < p.maxHp * 0.3 ? 1 : 0;
  const v = Number(T('vig').style.opacity || 0);
  T('vig').style.opacity = Math.max(0, v - 0.04);
  if (G.boss) T('bossfill').style.width = 100 * Math.max(0, G.boss.hp / G.boss.max) + '%';
  setTxt(
    'ammoCount',
    q.id === 'stitch' || q.id === 'constellation'
      ? expansionState().pins.length + ' / 3 PINS'
      : p.ammo + ' / ' + p.magSize
  );
  setTxt(
    'weaponStatus',
    q.id === 'flare'
      ? 'BOLT DISABLED'
      : q.id === 'stitch' || q.id === 'constellation'
        ? 'STARSTITCH'
        : p.reloadT > 0
          ? 'REKINDLING'
          : 'EMBER BOLT'
  );
  setTxt(
    'bladeReady',
    p.meleeCdT > 0
      ? 'FLARE RECOVERING'
      : q.id === 'stitch' || q.id === 'constellation'
        ? 'COLLAPSE THREADS'
        : 'FLARE READY'
  );
  T('bladeProgress').style.width = 100 * (1 - clamp(p.meleeCdT / MELEE.cooldown, 0, 1)) + '%';
  T('reloadProgress').style.width =
    (p.reloadT > 0 ? 100 * (1 - p.reloadT / p.reloadDuration) : 0) + '%';
  const stitch = q.id === 'stitch' || q.id === 'constellation';
  setTxt('bladePower', stitch ? 'THREADS' : MELEE.damage.toFixed(2) + '×');
  for (const node of T('btnMelee').childNodes)
    if (node.nodeType === 3 && node.textContent.trim())
      node.textContent = stitch ? ' COLLAPSE · ' : ' FLARE · ';
  T('btnMelee').setAttribute(
    'aria-label',
    stitch ? 'Collapse Starstitch threads' : 'Release Flare'
  );
  for (const id of ['btnReload', 'touchReload']) {
    const el = T(id),
      disabled = stitch || q.id === 'flare' || p.reloadT > 0 || p.ammo >= p.magSize;
    el.disabled = disabled;
    el.setAttribute('aria-disabled', String(disabled));
  }
  for (const [id, disabled] of [
    ['touchMelee', p.meleeCdT > 0],
    ['touchDash', p.dashCdT > 0],
    ['btnMelee', p.meleeCdT > 0],
  ]) {
    T(id).classList.toggle('cooling', disabled);
    T(id).setAttribute('aria-disabled', String(disabled));
  }
  T('aimStick').classList.toggle('trial-bolt-disabled', q.id === 'flare');
  setPrecisionTouchButton(
    'touchMelee',
    1 - clamp(p.meleeCdT / MELEE.cooldown, 0, 1),
    stitch ? 'COLLAPSE' : 'FLARE',
    p.meleeCdT > 0 ? p.meleeCdT.toFixed(1) + 's' : 'READY'
  );
  setPrecisionTouchButton(
    'touchDash',
    1 - clamp(p.dashCdT / p.dashCd, 0, 1),
    'DASH',
    p.dashCdT > 0 ? p.dashCdT.toFixed(1) + 's' : 'READY'
  );
  setPrecisionTouchButton(
    'touchReload',
    p.reloadT > 0 ? 1 - p.reloadT / p.reloadDuration : p.ammo < p.magSize ? 1 : 0,
    'REKINDLE',
    stitch || q.id === 'flare'
      ? 'DISABLED'
      : p.reloadT > 0
        ? 'CHARGING'
        : p.ammo < p.magSize
          ? 'READY'
          : 'FULL'
  );
  const cap = T('aimStickWrap')?.querySelector('.touch-caption b');
  if (cap) cap.textContent = stitch ? 'PLACE PIN' : q.id === 'flare' ? 'AIM' : 'BOLT';
  const controllerBindings = controllerPreferences().bindings;
  for (const [selector, action, fallback] of [
    ['#btnReload kbd', 'rekindle', 'R'],
    ['#btnMelee kbd', 'flare', 'K'],
    ['#btnPause kbd', null, 'Esc'],
  ]) {
    const el = document.querySelector(selector);
    if (el)
      el.textContent = controllerInput.active
        ? controllerButtonName(action ? controllerBindings[action] : 9)
        : fallback;
  }
}
function showHearthTrialResult(paused = false) {
  const q = hearthTrial,
    cleared = q.result?.cleared;
  setTxt('trialResultKicker', q.spec.tiers[q.tier].name + ' · ' + q.spec.name);
  setTxt('trialResultTitle', paused ? 'TRIAL PAUSED' : cleared ? 'TRIAL COMPLETE' : 'TRY AGAIN');
  setTxt(
    'trialResultText',
    paused
      ? 'Your descent is safe. Resume this room or return to the Hearth.'
      : cleared
        ? 'The room is clear. Your reward is waiting in the Hearth.'
        : q.result?.reason || 'The Ember went out. The next attempt starts fresh.'
  );
  setTxt('trialResultTime', modeTime(q.elapsed));
  setTxt('trialResultHits', q.hits);
  T('trialResultRewards').textContent = cleared
    ? hearthTrialRewardText(q.id, q.tier)
    : 'Fixed loadout · no lost Essence';
  T('trialRetry').textContent = paused ? 'RESUME TRIAL' : 'RETRY TRIAL';
  show('hearthTrialResult');
  T('trialRetry').focus({ preventScroll: true });
}
function finishHearthTrial(cleared, reason = '') {
  if (!isHearthTrial() || hearthTrial.result) return;
  const q = hearthTrial;
  q.result = { cleared, reason };
  G.dead = !cleared;
  G.paused = false;
  clearInput();
  setState('trialResult');
  if (cleared) {
    hearthAwardTrial(q.id, q.tier, q.elapsed, q.hits);
    sfx('victory');
  } else sfx('death');
  saveNow('trial-result');
  showHearthTrialResult(false);
}
function drawHearthTrialFlame(ctx, x, y, color, scale = 1) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(scale, scale);
  ctx.fillStyle = '#0b1119';
  ctx.fillRect(-20, 11, 40, 7);
  ctx.fillStyle = '#51483a';
  ctx.fillRect(-16, 7, 32, 7);
  ctx.fillStyle = '#ad9260';
  ctx.fillRect(-19, 2, 38, 5);
  ctx.fillRect(-12, -2, 24, 5);
  ctx.fillStyle = '#312b27';
  ctx.fillRect(-16, -6, 32, 6);
  const phase = save.motion ? 0 : Math.floor(G.tAll * 5) % 3;
  ctx.fillStyle = color;
  ctx.fillRect(-9, -19, 18, 16);
  ctx.fillRect(-6, -27 - phase, 12, 12);
  ctx.fillRect(-3, -36 + phase, 6, 11);
  ctx.fillRect(6, -26 + phase * 2, 6, 11);
  ctx.fillStyle = '#ffe8b3';
  ctx.fillRect(-4, -18, 8, 14);
  ctx.fillRect(-2, -26, 4, 13);
  ctx.fillStyle = '#fff8df';
  ctx.fillRect(-2, -14, 4, 8);
  ctx.restore();
}
function drawHearthTrialArena(ctx) {
  if (!isHearthTrial()) return;
  const q = hearthTrial,
    world = G.world,
    [light, stone, shade] = HEARTH_TRIAL_COLORS[q.id],
    t = save.motion ? 0 : G.tAll;
  ctx.imageSmoothingEnabled = false;
  for (let y = 1; y < world.H - 1; y++)
    for (let x = 1; x < world.W - 1; x++) {
      const wx = x * TILE,
        wy = y * TILE,
        floor = world.grid[y * world.W + x];
      if (floor) {
        ctx.fillStyle = (x * 7 + y * 11) % 5 ? shade : '#1b1c21';
        ctx.fillRect(wx, wy, TILE, TILE);
        ctx.fillStyle = '#0d1017';
        ctx.fillRect(wx, wy, TILE, 2);
        ctx.fillRect(wx + TILE - 2, wy, 2, TILE);
        ctx.fillStyle = stone;
        ctx.globalAlpha = 0.18;
        ctx.fillRect(wx + 4, wy + 3, TILE - 10, 1);
        if ((x + y * 3) % 7 === 0) {
          ctx.fillRect(wx + 9, wy + 18, 10, 2);
          ctx.fillRect(wx + 18, wy + 20, 2, 4);
        }
        ctx.globalAlpha = 1;
      } else {
        if (
          ![
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
          ].some(([dx, dy]) => world.grid[(y + dy) * world.W + x + dx])
        )
          continue;
        ctx.fillStyle = '#0a0d13';
        ctx.fillRect(wx, wy - 24, TILE, TILE + 26);
        ctx.fillStyle = stone;
        ctx.fillRect(wx + 2, wy - 24, TILE - 4, 7);
        ctx.fillStyle = '#394049';
        ctx.fillRect(wx + 4, wy - 23, TILE - 9, 2);
        ctx.fillStyle = '#20242b';
        ctx.fillRect(wx + 3, wy - 15, TILE - 6, 24);
        ctx.fillStyle = '#10141c';
        ctx.fillRect(wx + 3, wy - 3, TILE - 6, 2);
        ctx.fillRect(wx + 17, wy - 14, 2, 11);
        ctx.fillRect(wx + 8, wy - 1, 2, 10);
        ctx.fillStyle = '#0c1016';
        ctx.fillRect(wx, wy + 11, TILE, 9);
      }
    }
  const cx = TILE * 14.5,
    cy = TILE * 10.5;
  ctx.globalAlpha = 0.32;
  ctx.fillStyle = stone;
  for (let dx = -156; dx <= 156; dx += 6)
    for (let dy = -156; dy <= 156; dy += 6) {
      const radius = Math.abs(dx) + Math.abs(dy);
      if ((radius >= 150 && radius <= 156) || (radius >= 108 && radius <= 114))
        ctx.fillRect(cx + dx - 3, cy + dy - 3, 6, 6);
    }
  ctx.globalAlpha = 1;
  ctx.fillStyle = light;
  ctx.globalAlpha = 0.16 + Math.sin(t * 1.6) * 0.035;
  ctx.fillRect(cx - 190, cy - 1, 380, 2);
  ctx.fillRect(cx - 1, cy - 190, 2, 380);
  for (let i = -2; i <= 2; i++) {
    ctx.fillRect(cx + i * 62 - 3, cy - 3, 6, 6);
    ctx.fillRect(cx - 3, cy + i * 62 - 3, 6, 6);
  }
  ctx.globalAlpha = 1;
  for (const [x, y] of [
    [5, 4],
    [22, 4],
    [5, 17],
    [22, 17],
  ]) {
    const px = x * TILE + 18,
      py = y * TILE;
    ctx.fillStyle = '#070b12';
    ctx.fillRect(px - 17, py - 57, 34, 74);
    ctx.fillStyle = stone;
    ctx.fillRect(px - 13, py - 54, 26, 10);
    ctx.fillRect(px - 9, py - 44, 18, 54);
    ctx.fillRect(px - 16, py + 8, 32, 7);
    ctx.fillStyle = '#a89572';
    ctx.globalAlpha = 0.45;
    ctx.fillRect(px - 6, py - 38, 3, 43);
    ctx.fillRect(px - 12, py - 52, 19, 2);
    ctx.globalAlpha = 1;
    drawHearthTrialFlame(ctx, px, py - 44, light, 0.62);
    glowImg(q.id === 'flare' ? 'ember' : 'teal', px, py - 60, 70, 0.15);
  }
  for (let i = 0; i < 4; i++) {
    const gate = hearthTrialGate(i),
      active = q.gates.find((p) => d2(p.x, p.y, gate.x, gate.y) < 80 ** 2);
    ctx.fillStyle = '#0b1018';
    ctx.fillRect(gate.x - 27, gate.y - 23, 54, 46);
    ctx.fillStyle = stone;
    ctx.fillRect(gate.x - 26, gate.y - 22, 5, 44);
    ctx.fillRect(gate.x + 21, gate.y - 22, 5, 44);
    ctx.fillRect(gate.x - 21, gate.y - 22, 42, 5);
    ctx.fillRect(gate.x - 21, gate.y + 17, 42, 5);
    ctx.fillStyle = active ? light : '#3b4048';
    const pulse = active ? 1 - active.t / active.max : 0.08;
    ctx.globalAlpha = 0.25 + pulse * 0.6;
    for (let p = -1; p <= 1; p++) ctx.fillRect(gate.x - 2, gate.y - 12 + p * 10, 4, 4);
    if (active) {
      const size = 8 + pulse * 16;
      ctx.fillRect(gate.x - size, gate.y - size, size * 2, 2);
      ctx.fillRect(gate.x - size, gate.y + size - 2, size * 2, 2);
      glowImg('teal', gate.x, gate.y, 70 * pulse, 0.45);
    }
    ctx.globalAlpha = 1;
  }
  if (q.id === 'defense') {
    glowImg('ember', q.flame.x, q.flame.y - 16, 125, 0.4);
    drawHearthTrialFlame(ctx, q.flame.x, q.flame.y, q.flame.hitT > 0 ? '#ffffff' : '#ffba67', 1.4);
    ctx.fillStyle = '#090d14';
    ctx.fillRect(q.flame.x - 38, q.flame.y + 32, 76, 6);
    ctx.fillStyle = q.flame.hp < 30 ? '#ef8775' : '#f1c881';
    ctx.fillRect(q.flame.x - 36, q.flame.y + 34, (72 * q.flame.hp) / 100, 2);
  }
  for (const rune of q.runes) {
    ctx.fillStyle = rune.recovered ? '#39324d' : '#ac9dd4';
    ctx.fillRect(rune.x - 14, rune.y - 2, 28, 4);
    ctx.fillRect(rune.x - 2, rune.y - 14, 4, 28);
    ctx.fillRect(rune.x - 8, rune.y - 8, 16, 16);
    ctx.fillStyle = rune.recovered ? '#22202b' : '#f0e9ff';
    ctx.fillRect(rune.x - 3, rune.y - 3, 6, 6);
    if (!rune.recovered) glowImg('violet', rune.x, rune.y, 64, 0.3 + Math.sin(t * 3) * 0.1);
  }
  for (const sweep of q.sweeps) {
    const progress = clamp((sweep.t - sweep.warning) / 5, 0, 1),
      coordinate = sweep.vertical ? TILE * (3 + 22 * progress) : TILE * (3 + 15 * progress),
      warning = sweep.t < sweep.warning;
    ctx.fillStyle = warning ? '#b098d6' : '#e5d2ff';
    ctx.globalAlpha = warning ? 0.2 + Math.sin(t * 14) * 0.1 : 0.65;
    if (sweep.vertical)
      ctx.fillRect(coordinate - (warning ? 2 : 6), TILE * 3, warning ? 4 : 12, TILE * 15);
    else ctx.fillRect(TILE * 3, coordinate - (warning ? 2 : 6), TILE * 22, warning ? 4 : 12);
    ctx.globalAlpha = 1;
  }
  const boss = G.boss;
  if (boss && ['wind', 'beamWind', 'beam'].includes(boss.trialMode)) {
    ctx.save();
    ctx.translate(boss.x, boss.y);
    ctx.rotate(boss.trialAngle);
    const beam = boss.trialMode === 'beam';
    ctx.fillStyle = beam ? '#fff2b7' : '#cc9f6e';
    ctx.globalAlpha = beam ? 0.85 : 0.3 + Math.sin(t * 18) * 0.1;
    ctx.fillRect(24, beam ? -5 : -2, 1100, beam ? 10 : 4);
    if (beam) {
      ctx.globalAlpha = 0.2;
      ctx.fillRect(24, -13, 1100, 26);
    }
    ctx.restore();
  }
}
const hearthTrialSnapshot = snapshotRun;
snapshotRun = function () {
  if (isHearthTrial() || hearthTrialBoundary) return;
  return hearthTrialSnapshot();
};
const hearthTrialUpdate = update;
update = function (dt) {
  if (isHearthTrial()) return updateHearthTrial(dt);
  return hearthTrialUpdate(dt);
};
const hearthTrialHollowTick = hollowTick;
hollowTick = function (dt) {
  if (isHearthTrial()) return;
  return hearthTrialHollowTick(dt);
};
const hearthTrialRender = render;
render = function () {
  if (!isHearthTrial()) return hearthTrialRender();
  const ctx = G.ctx;
  ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
  ctx.fillStyle = '#05080f';
  ctx.fillRect(0, 0, G.w, G.h);
  ctx.save();
  ctx.translate(-Math.round(G.cam.x), -Math.round(G.cam.y));
  drawHearthTrialArena(ctx);
  for (const e of G.enemies) {
    if (e.dead) continue;
    if (e.isBoss) {
      ctx.fillStyle = '#03060c88';
      ctx.fillRect(e.x - 31, e.y + 22, 62, 9);
      drawCreatureSprite(ctx, e, e.spr, e.x, e.y, 1.35, 0, 0.92, e.seed);
      if (e.trialMode === 'rest') glowImg('ember', e.x, e.y - 5, 42, 0.18);
    }
  }
  const boss = G.boss;
  if (boss) boss.dead = true;
  drawEnemies(ctx);
  if (boss) boss.dead = false;
  drawBullets(ctx);
  drawPlayer(ctx);
  drawCombatFX(ctx);
  drawParticles(ctx);
  drawTexts(ctx);
  ctx.restore();
  if (G.state === 'playing') drawCrosshair(ctx);
};
const hearthTrialFireVolley = fireVolley;
fireVolley = function () {
  if (!isHearthTrial()) return hearthTrialFireVolley();
  const p = G.player,
    q = hearthTrial;
  if (G.state !== 'playing' || q.id === 'flare' || p.dashT > 0 || p.reloadT > 0 || p.meleeWindT > 0)
    return;
  if (q.id === 'stitch' || q.id === 'constellation') {
    let x = p.x + Math.cos(aimAngle()) * 190,
      y = p.y + Math.sin(aimAngle()) * 190;
    if (!touchInput.aimActive && !controllerInput.active && !keys.KeyJ) {
      const dx = mouse.x + G.cam.x - p.x,
        dy = mouse.y + G.cam.y - p.y,
        distance = Math.hypot(dx, dy) || 1,
        reach = Math.min(320, distance);
      x = p.x + (dx / distance) * reach;
      y = p.y + (dy / distance) * reach;
    }
    const point = safePosition(G.world, x, y, 8);
    if (point) starstitchPin(point.x, point.y);
    p.shotT = 0.45;
    p.muzzle = 0.06;
    return;
  }
  if (p.ammo <= 0) {
    beginReload();
    return;
  }
  const a = aimAngle();
  p.ammo--;
  G.bullets.push({
    x: p.x + Math.cos(a) * 14,
    y: p.y + Math.sin(a) * 14,
    vx: Math.cos(a) * 550,
    vy: Math.sin(a) * 550,
    r: 5,
    dmg: p.dmg,
    life: 1.4,
    pierce: 0,
    ric: 0,
    hits: null,
  });
  p.shotT = p.shotInt;
  p.muzzle = 0.06;
  sfx('shoot');
  if (!p.ammo) beginReload();
};
const hearthTrialStrike = strikeMelee;
const hearthTrialBeginMelee = beginMelee;
beginMelee = function () {
  if (!isHearthTrial()) return hearthTrialBeginMelee();
  const p = G.player;
  if (G.state !== 'playing' || p.meleeCdT > 0 || p.dashT > 0) return false;
  p.meleeAngle = aimAngle();
  p.meleeWindT = MELEE.windup;
  p.meleeCdT = MELEE.cooldown;
  p.shotT = Math.max(p.shotT, 0.25);
  return true;
};
const hearthTrialBeginReload = beginReload;
beginReload = function () {
  if (!isHearthTrial()) return hearthTrialBeginReload();
  const p = G.player;
  if (
    G.state !== 'playing' ||
    ['stitch', 'constellation', 'flare'].includes(hearthTrial.id) ||
    p.reloadT > 0 ||
    p.ammo >= p.magSize
  )
    return false;
  p.reloadT = p.reloadDuration;
  sfx('ui');
  return true;
};
strikeMelee = function () {
  if (!isHearthTrial()) return hearthTrialStrike();
  const p = G.player;
  p.meleeHitT = MELEE.swing;
  if (hearthTrial.id === 'stitch' || hearthTrial.id === 'constellation') {
    starstitchCollapse();
    return;
  }
  for (const e of G.enemies)
    if (
      !e.dead &&
      d2(p.x, p.y, e.x, e.y) < (MELEE.reach + e.r) ** 2 &&
      los(G.world, p.x, p.y, e.x, e.y)
    )
      damageEnemy(e, p.dmg * MELEE.damage, Math.atan2(e.y - p.y, e.x - p.x), false, 0.7, 'melee');
  sfx('dash');
  burst(p.x, p.y, 14, '#ffd297', 220, 0.3, 2, true);
};
const hearthTrialPin = starstitchPin;
starstitchPin = function (x, y, target = null) {
  if (!isHearthTrial()) return hearthTrialPin(x, y, target);
  const s = expansionState(),
    near = s.pins.find((pin) => d2(pin.x, pin.y, x, y) < 22 ** 2);
  if (near) near.life = 22;
  else {
    s.pins.push({ x, y, uid: 0, life: 22, wall: true });
    while (s.pins.length > 3) s.pins.shift();
  }
  sfx('stitchPin');
  burst(x, y, 8, '#bde8f3', 80, 0.3, 2, true);
};
const hearthTrialCollapse = starstitchCollapse;
starstitchCollapse = function () {
  if (!isHearthTrial()) return hearthTrialCollapse();
  const s = expansionState(),
    lines = starstitchLines();
  if (!lines.length) return false;
  for (const e of G.enemies)
    if (
      !e.dead &&
      lines.some(([a, b]) => expansionSegmentDistance(e.x, e.y, a.x, a.y, b.x, b.y) < e.r + 38)
    )
      damageEnemy(e, 110, 0, false, 0.5, 'starstitchCollapse');
  for (const pin of s.pins) burst(pin.x, pin.y, 10, '#d6ffff', 155, 0.4, 3, true);
  s.pins = [];
  sfx('nova');
  return true;
};
const hearthTrialDamage = damageEnemy;
damageEnemy = function (e, amount, angle = 0, crit = false, kb = 1, kind = 'shot') {
  if (!isHearthTrial()) return hearthTrialDamage(e, amount, angle, crit, kb, kind);
  if (e.dead || !e.trialEnemy || hearthTrial.result) return;
  if (
    (hearthTrial.id === 'stitch' || hearthTrial.id === 'constellation') &&
    !['starstitch', 'starstitchCollapse'].includes(kind)
  )
    return;
  if (hearthTrial.id === 'flare' && kind !== 'melee') return;
  amount = Math.max(0, Math.round(amount));
  if (!amount) return;
  e.hp -= amount;
  e.hitT = 0.12;
  e.kbx += Math.cos(angle) * 100 * (e.kb || 0) * kb;
  e.kby += Math.sin(angle) * 100 * (e.kb || 0) * kb;
  addText(e.x, e.y - e.r - 6, amount, '#f4e9cb', 12);
  sfx('hit');
  if (e.hp <= 0) killEnemy(e);
};
const hearthTrialKill = killEnemy;
killEnemy = function (e) {
  if (!isHearthTrial()) return hearthTrialKill(e);
  if (e.dead) return;
  e.dead = true;
  hearthTrial.kills++;
  G.run.kills++;
  burst(e.x, e.y, 15, e.col, 180, 0.5, 3, true);
  sfx('die');
  if (e === G.boss) {
    G.boss = null;
    G.bossActive = false;
    T('bossbar').classList.remove('on');
  }
};
const hearthTrialKillBoss = killBoss;
killBoss = function (e) {
  if (isHearthTrial()) return killEnemy(e);
  return hearthTrialKillBoss(e);
};
const hearthTrialHurt = hurtPlayer;
hurtPlayer = function (amount, x, y) {
  if (!isHearthTrial()) return hearthTrialHurt(amount, x, y);
  const p = G.player;
  if (G.state !== 'playing' || p.hitCd > 0 || p.dashT > 0 || hearthTrial.result) return;
  p.hp -= Math.max(1, Math.round(amount));
  p.hitCd = 0.72;
  hearthTrial.hits++;
  const a = Math.atan2(p.y - y, p.x - x);
  p.kbx = Math.cos(a) * 170;
  p.kby = Math.sin(a) * 170;
  burst(p.x, p.y, 8, '#ff9a80', 140, 0.3, 2, true);
  T('vig').style.opacity = 0.65;
  sfx('hurt');
  if (p.hp <= 0) finishHearthTrial(false);
};
const hearthTrialDie = die;
die = function () {
  if (isHearthTrial()) return finishHearthTrial(false);
  return hearthTrialDie();
};
const hearthTrialPause = pauseGame;
pauseGame = function (pause) {
  if (!isHearthTrial()) return hearthTrialPause(pause);
  if (hearthTrial.result) return;
  hearthTrial.paused = !!pause;
  G.paused = !!pause;
  setState(pause ? 'paused' : 'playing');
  if (pause) showHearthTrialResult(true);
  else hide('hearthTrialResult');
};
const hearthTrialEsc = onEscKey;
onEscKey = function () {
  if (!isHearthTrial()) return hearthTrialEsc();
  if (T('settings')?.classList.contains('open')) {
    hide('settings');
    return;
  }
  if (hearthTrial.result) leaveHearthTrial(true);
  else pauseGame(!hearthTrial.paused);
};
const hearthTrialAbandon = abandonRun;
abandonRun = function () {
  if (isHearthTrial()) return leaveHearthTrial(true);
  return hearthTrialAbandon();
};
const hearthTrialMenu = backToMenu;
backToMenu = function () {
  if (isHearthTrial()) return leaveHearthTrial(false);
  return hearthTrialMenu();
};
const hearthTrialHud = updateHUD;
updateHUD = function (dt) {
  if (isHearthTrial()) return syncHearthTrialHUD();
  return hearthTrialHud(dt);
};
const hearthTrialTrack = tseRecordedTrack;
tseRecordedTrack = function () {
  if (isHearthTrial())
    return hearthTrial.paused || hearthTrial.result
      ? '26_Dust_in_the_Sunlight'
      : hearthTrial.id === 'guardian'
        ? '28_Keep_the_Flame'
        : '16_Copper_Teeth';
  return hearthTrialTrack();
};
const hearthTrialInit = init;
const hearthTrialResize = resize;
resize = function () {
  const result = hearthTrialResize();
  if (isHearthTrial()) {
    G.cam.x = G.player.x - G.w / 2;
    G.cam.y = G.player.y - G.h * 0.46;
  }
  return result;
};
const hearthTrialControllerPoll = controllerPoll;
controllerPoll = function (now) {
  const paused = isHearthTrial() && hearthTrial.paused,
    heldMenu = !!controller.previous[9],
    blockedMenu = controller.blocked.has(9);
  const result = hearthTrialControllerPoll(now);
  if (
    paused &&
    isHearthTrial() &&
    hearthTrial.paused &&
    controllerInput.active &&
    controller.previous[9] &&
    !heldMenu &&
    !blockedMenu &&
    !document.hidden &&
    document.hasFocus()
  ) {
    pauseGame(false);
    controllerRelease();
  }
  return result;
};
const hearthTrialReset = resetEverything;
resetEverything = function () {
  if (isHearthTrial()) {
    leaveHearthTrial(false);
    hearthClose();
  }
  return hearthTrialReset();
};
init = function () {
  const result = hearthTrialInit();
  installHearthTrialUI();
  document.addEventListener(
    'click',
    (event) => {
      if (!isHearthTrial()) return;
      if (event.target.closest('#btnImportApply, #btnImport')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        toast('RETURN TO THE HEARTH', 'Leave the trial before importing a save.');
        return;
      }
      const button = event.target.closest('#btnSaveExit, #btnAbandon, #btnPauseHearth, #btnHearth');
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      leaveHearthTrial(true);
    },
    true
  );
  return result;
};
