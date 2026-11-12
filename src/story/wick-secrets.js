'use strict';

(() => {
  const scenes = [
    'wickPointer1',
    'wickPointer2',
    'wickPointer3',
    'wickPointer4',
    'wickPointer5',
    'wickPointer6',
  ];

  Object.assign(ARMORY, {
    wickPointer: {
      name: 'Wick’s Pointer',
      requirement: 'Try Wick’s patience near an open portal',
      detail:
        'Wick marks a nearby threat you can hit: +18% damage, and its defeat restores one Ember Bolt charge. He points toward a discovered open gate when the room is clear.',
    },
  });
  const card = {
    id: 'wickPointer',
    r: 2,
    max: 1,
    w: 2,
    minFloor: 1,
    icon: 'target',
    name: 'Wick’s Pointer',
    ds: 'Wick marks a nearby, visible threat · +18% damage · marked defeats restore one charge',
    unlock: 'wickPointer',
  };
  POOL.push(card);
  const gift = T('wickGift'),
    recall = T('portalRecall');
  let presses = 0,
    pressWindow = 0,
    returnQueued = false,
    returning = false,
    targetClock = 0;
  const companion = {
    x: NaN,
    y: NaN,
    px: NaN,
    py: NaN,
    vx: 0,
    vy: 0,
    side: -1,
    sideT: 0,
    acquired: 0,
    happy: 0,
    hit: 0,
  };

  function portalTileSeen() {
    const p = G.portal,
      w = G.world;
    if (!p || !w || !G.player) return false;
    const x = Math.floor(p.x / TILE),
      y = Math.floor(p.y / TILE),
      seen =
        !!w.reveal?.[y * w.W + x] &&
        d2(G.player.x, G.player.y, p.x, p.y) <= 480 ** 2 &&
        los(w, G.player.x, G.player.y, p.x, p.y);
    if (seen && !p.discovered) {
      p.discovered = true;
      saveNow('portal-found');
    }
    return !!p.discovered || seen;
  }
  function realInteractionNear() {
    if (!G.player) return false;
    if (typeof secretNear === 'function' && secretNear()) return true;
    if (typeof nearestDescentEvent === 'function' && nearestDescentEvent()) return true;
    const p = G.player;
    if (G.portal && d2(p.x, p.y, G.portal.x, G.portal.y) < 90 ** 2) return true;
    const fixtures = G.world?.region === 'late' ? G.world?.lateFixtures : G.world?.fixtures;
    if (fixtures?.some((o) => d2(p.x, p.y, o.x, o.y) < 78 ** 2)) return true;
    return false;
  }
  function nextScene() {
    return scenes.find((id) => !storyData().seen[id]);
  }
  function canPesterWick() {
    return (
      G.state === 'playing' &&
      G.run &&
      !G.run.mode &&
      !G.descending &&
      !realInteractionNear() &&
      !armoryData().wickPointer &&
      !dialogue
    );
  }
  function canRecall() {
    return (
      G.state === 'playing' &&
      G.run &&
      !G.run.mode &&
      G.portal?.active &&
      portalTileSeen() &&
      !G.descending &&
      !returning &&
      d2(G.player.x, G.player.y, G.portal.x, G.portal.y) > 105 ** 2
    );
  }
  function landingPosition() {
    const portal = G.portal,
      p = G.player;
    for (let i = 0; i < 12; i++) {
      const a = Math.PI / 2 + (i * TAU) / 12,
        pos = safePosition(G.world, portal.x + Math.cos(a) * 54, portal.y + Math.sin(a) * 54, p.r);
      if (pos && !G.enemies.some((e) => !e.dead && d2(pos.x, pos.y, e.x, e.y) < 70 ** 2))
        return pos;
    }
    return safePosition(G.world, portal.x, portal.y + 54, p.r) || { x: portal.x, y: portal.y + 54 };
  }
  function returnToPortal() {
    if (!canRecall()) return;
    const run = G.run,
      portal = G.portal,
      p = G.player,
      pos = landingPosition();
    returning = true;
    returnQueued = false;
    clearInput();
    setState('returning');
    T('fade').style.opacity = 0.78;
    sfx('portal');
    burst(p.x, p.y, 15, '#efb96f', 150, 0.45, 2, true);
    setTimeout(() => {
      if (G.run !== run || G.player !== p || G.portal !== portal || G.state !== 'returning') return;
      p.x = pos.x;
      p.y = pos.y;
      p.kbx = p.kby = 0;
      resetCompanion();
      updateCompanion(0);
      p.hitCd = Math.max(p.hitCd, 1.1);
      G.cam.x = p.x - G.w / 2;
      G.cam.y = p.y - G.h / 2;
      burst(p.x, p.y, 20, '#ffd88a', 180, 0.55, 2.5, true);
      T('fade').style.opacity = 0;
      returning = false;
      setState('playing');
      updateHUD(0);
      fieldNote('The open gate draws you back.', 2);
      saveNow('portal-return');
      G.cv.focus({ preventScroll: true });
      if (document.hidden) pauseGame(true);
    }, 260);
  }
  function openGift() {
    if (armoryData().wickPointer || gift.classList.contains('open')) return;
    clearInput();
    setState('wick-gift');
    show('wickGift');
    drawWickPortrait(T('wickGiftPortrait'), G.tAll, { happy: true });
    sfx('mythicReveal');
    T('wickGiftTake').focus({ preventScroll: true });
  }
  function takeGift() {
    if (armoryData().wickPointer) return;
    unlockArmory('wickPointer');
    if (G.run && G.player) {
      G.run.up.wickPointer = 1;
      addChip(card);
      recalc();
    }
    hide('wickGift');
    setState('playing');
    G.player.hitCd = Math.max(G.player.hitCd, 1);
    saveNow('wick-pointer');
    beginDialogue('wickPointerAfter', false, 0, 'playing');
  }
  function pointerActive() {
    return !!(G.run?.up?.wickPointer && G.player && G.world);
  }
  function pointerRoom(x, y) {
    return (
      G.world.rooms?.findIndex(
        (r) =>
          x >= r.x * TILE && x < (r.x + r.w) * TILE && y >= r.y * TILE && y < (r.y + r.h) * TILE
      ) ?? -1
    );
  }
  function pointerRange() {
    return Math.min(480, BASE.bulletSpd * 1.15 + 14);
  }
  function localThreat(e) {
    if (!e || e.dead || !Number.isFinite(e.x) || !Number.isFinite(e.y)) return false;
    if ((e.lateBoss || e.warden || e.matriarch) && !e.introduced) return false;
    if (solidPx(G.world, e.x, e.y)) return false;
    const p = G.player,
      distance = d2(p.x, p.y, e.x, e.y),
      room = pointerRoom(p.x, p.y),
      enemyRoom = pointerRoom(e.x, e.y);
    if (distance > (pointerRange() + Math.min(40, e.r || 0)) ** 2) return false;
    if (G.world.rooms?.length && (room !== enemyRoom || (room < 0 && distance > 180 ** 2)))
      return false;
    return los(G.world, p.x, p.y, e.x, e.y);
  }
  function attackable(e) {
    if (!localThreat(e)) return false;
    const s = e.bs;
    return !(
      e.invulnerable ||
      s?.invulnerable ||
      s?.mid?.invulnerable ||
      s?.mid?.bellWater?.submerged ||
      s?.mode === 'submerge' ||
      s?.mode === 'shift' ||
      s?.duet?.mode === 'shift'
    );
  }
  function targetScore(e) {
    let score = 0;
    if (e.mechanism || e.midPiece) score += 2600;
    if (e.type === 'gardenNest') score += 1350;
    if (e.isBoss) score += 1000;
    if (e.elite) score += 420;
    if (e.action === 'windup' || e.bs?.mode === 'windup' || e.phase === 2) score += 180;
    score += Math.min(100, e.dmg || 0) * 6 + Math.min(200, (e.max || e.maxHp || 0) * 0.025);
    score -= Math.sqrt(d2(G.player.x, G.player.y, e.x, e.y)) * 0.18;
    return score;
  }
  function markedTarget() {
    const target = G.enemies.find((e) => e.uid && e.uid === G.run?.wickPointerUid);
    return target && attackable(target) ? target : null;
  }
  function chooseTarget() {
    if (!pointerActive()) return null;
    const current = markedTarget();
    let best = current,
      score = current ? targetScore(current) : -Infinity;
    for (const e of G.enemies) {
      if (!e.uid || !attackable(e)) continue;
      const value = targetScore(e);
      if (value > score) {
        score = value;
        best = e;
      }
    }
    if (current && best !== current && score < targetScore(current) + 160) best = current;
    if (G.run.wickPointerUid !== (best?.uid || 0)) companion.acquired = 0.24;
    G.run.wickPointerUid = best?.uid || 0;
    return best;
  }
  function portalDirection() {
    if (!G.portal?.active || !G.portal.discovered) return null;
    const room = pointerRoom(G.player.x, G.player.y),
      occupied = G.enemies.some(
        (e) => !e.dead && (room >= 0 ? pointerRoom(e.x, e.y) === room : localThreat(e))
      );
    return occupied ? null : G.portal;
  }
  function resetCompanion() {
    companion.x = companion.y = NaN;
    companion.px = companion.py = NaN;
    companion.vx = companion.vy = companion.sideT = 0;
    companion.acquired = companion.happy = companion.hit = 0;
    companion.side = -1;
  }
  function updateCompanion(dt) {
    if (!pointerActive()) {
      resetCompanion();
      return;
    }
    const p = G.player,
      t = save.motion ? 0 : G.tAll,
      target = markedTarget(),
      look = target || portalDirection(),
      moveX = Number.isFinite(companion.px) ? (p.x - companion.px) / Math.max(dt, 0.001) : 0,
      moveY = Number.isFinite(companion.py) ? (p.y - companion.py) / Math.max(dt, 0.001) : 0,
      walking = Math.hypot(moveX, moveY) > 20;
    companion.px = p.x;
    companion.py = p.y;
    companion.sideT = Math.max(0, companion.sideT - dt);
    companion.acquired = Math.max(0, companion.acquired - dt);
    companion.happy = Math.max(0, companion.happy - dt);
    companion.hit = Math.max(0, companion.hit - dt);
    if (!companion.sideT) {
      const side =
        walking && Math.abs(moveX) > 20
          ? moveX > 0
            ? -1
            : 1
          : look && Math.abs(look.x - p.x) > 40
            ? look.x > p.x
              ? -1
              : 1
            : companion.side;
      if (side !== companion.side) {
        companion.side = side;
        companion.sideT = 0.8;
      }
    }
    let gx = p.x + companion.side * 27,
      gy = p.y - 29 + Math.sin(t * 2.7) * 2;
    if (solidPx(G.world, gx, gy) || !los(G.world, p.x, p.y, gx, gy)) {
      gx = p.x;
      gy = solidPx(G.world, p.x, p.y - 24) ? p.y : p.y - 24;
    }
    if (!Number.isFinite(companion.x)) {
      companion.x = gx;
      companion.y = gy;
      companion.vx = companion.vy = 0;
      return;
    }
    const step = Math.min(dt, 0.1),
      decay = Math.exp(-11 * step);
    for (const [axis, velocity, goal] of [
      ['x', 'vx', gx],
      ['y', 'vy', gy],
    ]) {
      const offset = companion[axis] - goal,
        c = companion[velocity] + 11 * offset;
      companion[axis] = goal + (offset + c * step) * decay;
      companion[velocity] = (companion[velocity] - 11 * c * step) * decay;
    }
  }
  function drawPointer(ctx) {
    if (!pointerActive() || G.dead || !Number.isFinite(companion.x)) return;
    const p = G.player,
      t = save.motion ? 0 : G.tAll,
      target = markedTarget(),
      guide = target ? null : portalDirection(),
      look = target || guide || p,
      fx = companion.x,
      fy = companion.y - (save.motion ? 0 : Math.sin(companion.happy * 7) * companion.happy * 3);
    ctx.save();
    drawWickCharacter(ctx, fx, fy, 30, t, {
      lookX: (look.x - fx) / 100,
      lookY: (look.y - fy) / 100,
      moving: Math.hypot(companion.vx, companion.vy) > 35,
      alert: !!target,
      happy: companion.happy > 0,
    });
    if (target) {
      const r = Math.round((target.r || 12) + 9 + (save.motion ? 0 : companion.acquired * 25)),
        corner = Math.max(5, Math.min(10, r * 0.32));
      ctx.translate(Math.round(target.x), Math.round(target.y));
      ctx.beginPath();
      for (const sx of [-1, 1])
        for (const sy of [-1, 1]) {
          ctx.moveTo(sx * (r - corner), sy * r);
          ctx.lineTo(sx * r, sy * r);
          ctx.lineTo(sx * r, sy * (r - corner));
        }
      ctx.strokeStyle = '#322016';
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.85;
      ctx.stroke();
      ctx.strokeStyle = companion.hit > 0 ? '#fff3c7' : '#ffd887';
      ctx.lineWidth = 2;
      ctx.globalAlpha = save.motion ? 0.95 : 0.86 + Math.sin(t * 3) * 0.08;
      ctx.stroke();
    } else if (guide && d2(p.x, p.y, guide.x, guide.y) > 90 ** 2) {
      const a = Math.atan2(guide.y - fy, guide.x - fx);
      ctx.translate(Math.round(fx + Math.cos(a) * 23), Math.round(fy + Math.sin(a) * 23));
      ctx.rotate(a + Math.PI / 2);
      ctx.fillStyle = '#ffd887';
      ctx.globalAlpha = 0.82;
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.lineTo(4, 3);
      ctx.lineTo(0, 1);
      ctx.lineTo(-4, 3);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  const baseHollowTick = hollowTick;
  hollowTick = function (dt) {
    const out = baseHollowTick(dt);
    if (gift.classList.contains('open'))
      drawWickPortrait(T('wickGiftPortrait'), G.tAll, { happy: true });
    return out;
  };
  const baseUpdate = update;
  update = function (dt) {
    pressWindow = Math.max(0, pressWindow - dt);
    if (!pressWindow) presses = 0;
    portalTileSeen();
    if (returnQueued) {
      returnQueued = false;
      if (canRecall()) {
        returnToPortal();
        return;
      }
    }
    if (interactQueued && canPesterWick()) {
      interactQueued = false;
      presses++;
      pressWindow = 5.5;
      const id = nextScene(),
        needed = id === 'wickPointer1' ? 7 : 5;
      if (id && presses >= needed) {
        presses = 0;
        pressWindow = 0;
        beginDialogue(id, false, 0, 'playing');
        return;
      }
    }
    if (storyData().seen.wickPointer6 && !armoryData().wickPointer && G.state === 'playing') {
      openGift();
      return;
    }
    const out = baseUpdate(dt);
    if (G.state === 'playing') {
      portalTileSeen();
      targetClock -= dt;
      if (pointerActive() && (targetClock <= 0 || !markedTarget())) {
        targetClock = 0.18;
        chooseTarget();
      }
      updateCompanion(dt);
    }
    return out;
  };
  const baseFinishDialogue = finishDialogue;
  finishDialogue = function () {
    const id = dialogue?.id,
      replay = dialogue?.replay;
    baseFinishDialogue();
    if (id === 'wickPointer6' && !replay && !armoryData().wickPointer) openGift();
  };
  const baseDamageEnemy = damageEnemy;
  damageEnemy = function (e, dmg, ang, crit, kb, kind = 'shot') {
    if (pointerActive() && e && e.uid === G.run.wickPointerUid && attackable(e)) {
      dmg *= 1.18;
      companion.hit = 0.14;
    }
    return baseDamageEnemy(e, dmg, ang, crit, kb, kind);
  };
  const baseKillEnemy = killEnemy;
  killEnemy = function (e) {
    const marked = pointerActive() && e && e.uid === G.run.wickPointerUid && attackable(e),
      ammo = G.player?.ammo || 0;
    baseKillEnemy(e);
    if (marked && e.dead && G.player) {
      G.player.ammo = Math.min(G.player.magSize, G.player.ammo + 1);
      G.run.wickPointerUid = 0;
      targetClock = 0;
      companion.happy = 0.7;
      if (G.player.ammo > ammo)
        addText(G.player.x, G.player.y - 25, '+1 EMBER CHARGE', '#ffd98b', 11);
    }
  };
  const baseDrawCombatFX = drawCombatFX;
  drawCombatFX = function (ctx) {
    baseDrawCombatFX(ctx);
    drawPointer(ctx);
  };
  const baseUpdateHUD = updateHUD;
  updateHUD = function (dt) {
    const out = baseUpdateHUD(dt),
      visible = canRecall();
    recall.hidden = !visible;
    recall.setAttribute('aria-hidden', String(!visible));
    recall.classList.toggle('prompt-clear', T('prompt').classList.contains('on'));
    return out;
  };
  const baseSetupFloor = setupFloor;
  setupFloor = function (f) {
    presses = 0;
    pressWindow = 0;
    returnQueued = false;
    returning = false;
    targetClock = 0;
    resetCompanion();
    if (G.run) G.run.wickPointerUid = 0;
    recall.hidden = true;
    return baseSetupFloor(f);
  };
  const baseBackToMenu = backToMenu;
  backToMenu = function () {
    presses = 0;
    pressWindow = 0;
    returnQueued = false;
    returning = false;
    resetCompanion();
    recall.hidden = true;
    hide('wickGift');
    return baseBackToMenu();
  };
  const baseBlocking = anyBlockingOverlay;
  anyBlockingOverlay = function () {
    return gift.classList.contains('open') || returning || baseBlocking();
  };

  on(recall, 'click', () => {
    if (canRecall()) {
      returnQueued = true;
      initAudio();
    }
  });
  on(T('wickGiftTake'), 'click', takeGift);
  addEventListener(
    'keydown',
    (e) => {
      if (gift.classList.contains('open')) {
        if (e.code === 'Tab') {
          e.preventDefault();
          T('wickGiftTake').focus({ preventScroll: true });
        } else if (['Enter', 'Space'].includes(e.code)) {
          e.preventDefault();
          if (!e.repeat) takeGift();
        }
        return;
      }
      if (
        e.repeat ||
        !keyboardActionPressed(e, 'portal') ||
        G.state !== 'playing' ||
        anyBlockingOverlay()
      )
        return;
      e.preventDefault();
      returnQueued = true;
      initAudio();
    },
    true
  );
})();
