'use strict';
const DS_DEMO = window.DS_DEMO === true;
let descentPending = null,
  descentTaskReturn = 'playing',
  descentClock = 0;

const descentEndingWalk = { x: 318, y: 281 };
const descentNotice = { key: '', remaining: 0, until: 0 };
function descentRecentText(text) {
  for (const c of DESCENT_CHAPTERS) {
    if (
      text === c.objective ||
      (c.id === 'court' &&
        text === 'Put the surface observation beside the current residents’ roster.')
    )
      return c.mainSummary;
    if (text.startsWith(c.optionalTitle + ' — finished with ')) return c.helpSummary;
    if (text === 'The way through ' + c.title + ' is clear. The residents can finish the repair.')
      return 'Finished by the residents: ' + c.mainSummary;
  }
  return text;
}
function cleanDescentData(raw) {
  const out = {
    version: 1,
    chapters: {},
    residents: {},
    recent: [],
    endingSeen: false,
    legacyCredit: 0,
  };
  for (const c of DESCENT_CHAPTERS) {
    const q = raw?.chapters?.[c.id] || {};
    out.chapters[c.id] = {
      main: q.main === true,
      help: q.help === true,
      taken: q.taken === true,
      by: q.by === 'resident' ? 'resident' : 'player',
      met: q.met === true,
      mainRewarded: q.mainRewarded === true || (q.mainRewarded === undefined && q.main === true),
      helpRewarded: q.helpRewarded === true || (q.helpRewarded === undefined && q.help === true),
    };
  }
  for (const id of ['oren', 'nell', 'mara']) out.residents[id] = raw?.residents?.[id] === true;
  out.recent = Array.isArray(raw?.recent)
    ? raw.recent
        .filter((q) => typeof q === 'string')
        .map((q) => descentRecentText(q).slice(0, 160))
        .slice(-12)
    : [];
  out.endingSeen = raw?.endingSeen === true;
  out.legacyCredit = clamp(Math.floor(Number(raw?.legacyCredit) || 0), 0, 50);
  return out;
}
function descentData() {
  const s = storyData();
  if (!s.descent || s.descent.version !== 1) s.descent = cleanDescentData(s.descent);
  return s.descent;
}
function descentChapter(f = G.floor) {
  return DESCENT_CHAPTERS.find((c) => f >= c.from && f <= c.to) || null;
}

function descentEvent(id) {
  return G.world?.descentEvents?.find((e) => e.id === id) || null;
}
function descentInside(r, o, pad = 0) {
  return (
    r &&
    o.x >= (r.x - pad) * TILE &&
    o.x < (r.x + r.w + pad) * TILE &&
    o.y >= (r.y - pad) * TILE &&
    o.y < (r.y + r.h + pad) * TILE
  );
}
function descentRoomSafe(r) {
  const exit = G.world.exit;
  return (
    r &&
    r !== exit &&
    !(
      r.x < exit.x + exit.w + 2 &&
      r.x + r.w + 2 > exit.x &&
      r.y < exit.y + exit.h + 2 &&
      r.y + r.h + 2 > exit.y
    )
  );
}
function descentQuietRoom(index) {
  const w = G.world,
    r = w.rooms[index];
  if (!r) return;
  G.enemies = G.enemies.filter((e) => e.isBoss || !descentInside(r, e));
  for (const key of ['hazards', 'lateHazards', 'environmentalTraps'])
    if (Array.isArray(w[key])) w[key] = w[key].filter((e) => !descentInside(r, e));
  if (Array.isArray(w.traps)) w.traps = w.traps.filter((e) => !descentInside(r, e));
}
function descentClearWorksite(e) {
  const w = G.world;
  const overlaps = (o) => o.x > e.x - 122 && o.x < e.x + 116 && o.y > e.y - 118 && o.y < e.y + 82;
  for (const key of ['props', 'hollowDecor', 'lateDecor', 'torches'])
    if (Array.isArray(w[key])) w[key] = w[key].filter((o) => !o.descent && !overlaps(o));
  for (const key of ['fixtures', 'lateFixtures']) {
    for (const fixture of w[key] || []) {
      if (!overlaps(fixture)) continue;
      const r = w.rooms[e.roomIndex];
      const positions = [];
      for (let y = r.y; y < r.y + r.h; y++)
        for (let x = r.x; x < r.x + r.w; x++) {
          const point = { x: (x + 0.5) * TILE, y: (y + 0.5) * TILE };
          if (overlaps(point)) continue;
          const pos = safePosition(w, point.x, point.y, 18);
          if (
            pos &&
            descentInside(r, pos) &&
            !overlaps(pos) &&
            ![...(w.fixtures || []), ...(w.lateFixtures || [])].some(
              (other) => other !== fixture && d2(pos.x, pos.y, other.x, other.y) < 48 ** 2
            )
          )
            positions.push(pos);
        }
      positions.sort(
        (a, b) => d2(a.x, a.y, fixture.x, fixture.y) - d2(b.x, b.y, fixture.x, fixture.y)
      );
      if (positions[0]) {
        fixture.x = positions[0].x;
        fixture.y = positions[0].y;
      }
    }
  }
}
function descentInstallFloor() {
  const w = G.world,
    c = descentChapter();
  if (Array.isArray(w?.torches)) w.torches = w.torches.filter((torch) => !torch.descent);
  if (!w || !c || !G.run || G.run.infinite || isGuardianMode() || isHearthTrial()) return;
  prepareEchoSanctuaries();
  const old = Array.isArray(w.descentEvents) ? w.descentEvents : [];
  w.descentEvents = [];
  w.descentReserved = [];
  w.descentEventSlots = 0;
  const record = descentData().chapters[c.id],
    make = (optional, restore) => {
      let index = restore?.roomIndex;
      if (
        !Number.isInteger(index) ||
        !descentRoomSafe(w.rooms[index]) ||
        index === 0 ||
        w.descentReserved.includes(index)
      ) {
        const candidates = w.rooms
          .map((r, i) => ({ r, i }))
          .filter(
            (q) =>
              q.i !== 0 &&
              descentRoomSafe(q.r) &&
              q.i !== w.secretRoom?.roomIndex &&
              !w.descentReserved.includes(q.i)
          );
        candidates.sort(
          (a, b) =>
            Number(w.specialEncounters?.some((sc) => sc.roomIndex === b.i)) -
              Number(w.specialEncounters?.some((sc) => sc.roomIndex === a.i)) ||
            Math.min(b.r.w, b.r.h) - Math.min(a.r.w, a.r.h) ||
            a.i - b.i
        );
        const q = optional
          ? candidates[0]
          : candidates.find((q) => !w.specialEncounters?.some((sc) => sc.roomIndex === q.i));
        if (!q) return;
        index = q.i;
      }
      const r = w.rooms[index],
        pos = safePosition(w, (r.x + r.w / 2) * TILE, (r.y + r.h / 2) * TILE, 20);
      if (!pos || !descentInside(r, pos)) return;
      if (optional) {
        for (const sc of (w.specialEncounters || []).filter((sc) => sc.roomIndex === index))
          sealSpecialEncounter(sc, false);
        w.specialEncounters = (w.specialEncounters || []).filter((sc) => sc.roomIndex !== index);
        w.descentEventSlots = 1;
      }
      w.descentReserved.push(index);
      const done = G.run.residentStops?.[c.id + (optional ? '-help' : '-main')]?.claimed === true,
        known =
          (optional ? record.help : record.main) ||
          !!storyData().seen['ds-' + c.id + '-' + (optional ? 'optional' : 'intro')];
      const e = {
        id: 'descent-' + c.id + (optional ? '-help' : '-main'),
        chapterId: c.id,
        roomIndex: index,
        x: pos.x,
        y: pos.y,
        npc: optional ? c.optionalNpc : c.npc,
        prop: optional ? c.optionalProp : c.prop,
        artScale: Math.min(1, (r.w * TILE - 38) / 216, (r.h * TILE - 40) / 190),
        optional,
        repaired: optional ? record.help : record.main,
        phase: done
          ? optional
            ? 'helped'
            : 'complete'
          : restore?.phase === 'introduced' || known
            ? 'introduced'
            : optional && record.taken
              ? 'taken'
              : 'waiting',
        progress: done ? 1 : 0,
        actionT: 0,
        arrival: restore || known || save.motion ? 1 : 0,
      };
      residentStop(e);
      w.descentEvents.push(e);
      descentQuietRoom(index);
      descentClearWorksite(e);
    };
  if (
    G.floor === c.mainFloor ||
    (G.floor > c.mainFloor &&
      (!record.main || old.some((e) => !e.optional && e.chapterId === c.id)))
  )
    make(
      false,
      old.find((e) => !e.optional)
    );
  if (G.floor === c.optionalFloor)
    make(
      true,
      old.find((e) => e.optional)
    );
  installSpecialEncounters();
  for (const i of w.descentReserved) descentQuietRoom(i);
}
function nearestDescentEvent() {
  if (!G.player || !G.world || G.run?.guardianMode || isHearthTrial()) return null;
  let found = null,
    best = 115 ** 2;
  for (const e of G.world.descentEvents || []) {
    const distance = d2(G.player.x, G.player.y, e.x - 30, e.y + 18);
    if (distance < best) {
      best = distance;
      found = e;
    }
  }
  return found;
}
function descentRegisterScenes() {
  installDescentDialogueCopy();
  for (const c of DESCENT_CHAPTERS)
    for (const [suffix, lines] of [
      ['intro', c.intro],
      ['after', c.after],
      ['optional', c.optionalIntro],
      ['helped', c.optionalAfter],
    ])
      HOLLOW_SCENES['ds-' + c.id + '-' + suffix] = {
        title: suffix === 'optional' || suffix === 'helped' ? c.optionalTitle : c.title,
        where: c.title,
        lines: lines || [
          [
            c.npc === 'wick' ? 'Wick' : c.npc === 'oren' ? 'Oren' : 'Nell',
            'There. That should hold.',
          ],
        ],
      };
}
function descentSpeak(e) {
  const c = DESCENT_CHAPTERS.find((c) => c.id === e.chapterId);
  if (!c || G.bossActive || G.dead) return;
  const r = G.world.rooms[e.roomIndex];
  if (G.enemies.some((n) => !n.dead && descentInside(r, n))) return;
  descentData().chapters[c.id].met = true;
  if (e.npc !== 'wick') descentData().residents[e.npc] = true;
  if (e.phase === 'waiting') {
    e.phase = 'introduced';
    descentPending = e.id;
    beginDialogue('ds-' + c.id + '-' + (e.optional ? 'optional' : 'intro'), false, 0, 'playing');
  } else descentOpenTask(e);
}
function descentOpenTask(e) {
  const c = DESCENT_CHAPTERS.find((c) => c.id === e.chapterId);
  if (!c || !G.run) return;
  const record = residentStop(e),
    detail = descentTaskDetails(e),
    repaired = descentData().chapters[c.id][e.optional ? 'help' : 'main'],
    name = e.npc === 'wick' ? 'Wick' : e.npc === 'oren' ? 'Oren' : 'Nell';
  descentTaskReturn = G.state === 'menu' ? 'menu' : 'playing';
  descentPending = e.id;
  T('descentTaskTitle').textContent = name + (e.npc === 'oren' ? '’s workbench' : '’s supplies');
  T('descentTaskText').textContent = record.claimed
    ? 'You have taken supplies from this stop. More will be ready on your next descent.'
    : repaired
      ? 'Choose what you need for the descent.'
      : detail.request + ' Then choose what you need.';
  T('descentTaskWho').textContent = 'WITH ' + name.toUpperCase();
  T('descentTaskImpact').textContent = repaired ? '' : detail.impact;
  T('descentTaskImpact').hidden = repaired;
  T('descentTaskReward').textContent = record.claimed
    ? 'Supplies collected this descent'
    : 'Choose one · fresh supplies every descent';
  T('descentTaskPanel').dataset.chapter = c.id;
  paintDescentTask(e, descentClock);
  const actions = T('descentTaskActions');
  actions.replaceChildren();
  if (!record.claimed)
    for (const [index, offer] of record.offers.entries()) {
      const button = document.createElement('button'),
        icon = document.createElement('canvas'),
        title = document.createElement('strong'),
        description = document.createElement('span');
      button.className = 'btn resident-supply';
      icon.width = icon.height = 48;
      icon.setAttribute('aria-hidden', 'true');
      drawMothItem(icon.getContext('2d'), 24, 24, RESIDENT_SUPPLIES[offer.type].icon, 1);
      title.textContent = RESIDENT_SUPPLIES[offer.type].name;
      description.textContent = residentSupplyAvailable(offer)
        ? residentSupplyText(offer)
        : offer.type === 'rest'
          ? 'Health is already full.'
          : 'Already at maximum rank.';
      button.disabled = !residentSupplyAvailable(offer);
      button.append(icon, title, description);
      button.onclick = () => takeResidentSupply(e, index);
      actions.append(button);
    }
  T('descentTaskClose').textContent = record.claimed
    ? 'Return to the descent'
    : 'Leave the supplies';
  setState('paused');
  show('descentTaskPanel');
  clearInput();
  (actions.querySelector('button:not(:disabled)') || T('descentTaskClose')).focus({
    preventScroll: true,
  });
  saveNow('resident-stop');
}
function descentLeaveTask() {
  hide('descentTaskPanel');
  descentPending = null;
  setState(descentTaskReturn);
  clearInput();
  G.cv?.focus({ preventScroll: true });
  saveNow('story-task');
}

function descentGuardianComplete() {
  const c = descentChapter();
  if (!c) return;
  const r = descentData().chapters[c.id];
  if (!r.main) {
    r.main = true;
    r.by = 'resident';
    r.met = true;
  }
  if (c.id === 'gate') descentData().residents.mara = true;
  for (const e of G.world?.descentEvents || [])
    if (!e.optional) {
      e.repaired = true;
      e.progress = 1;
    }
}
function descentCurrentObjective() {
  const c = descentChapter();
  if (!c)
    return descentData().endingSeen
      ? 'The gate is open. Return to the Hearth or explore the remaining depths.'
      : 'Reach the Keeper and open the upper gate.';
  if (G.floor % 5 === 0 && G.portal?.active && !G.boss)
    return 'The portal is open. Continue when you’re ready.';
  if (G.floor < c.mainFloor) return 'Find the portal to reach the next floor.';
  return descentData().chapters[c.id].main
    ? 'Reach the guardian. The route to the next region is still sealed.'
    : c.objective;
}

function descentEventVisible(e) {
  return (
    e.x >= G.cam.x - 180 &&
    e.x <= G.cam.x + G.w + 180 &&
    e.y >= G.cam.y - 180 &&
    e.y <= G.cam.y + G.h + 180
  );
}
function descentDrawWorld(ctx) {
  for (const e of G.world?.descentEvents || []) {
    if (!descentEventVisible(e)) continue;
    drawDescentProp(ctx, e, descentClock);
    const arriving = e.arrival < 1;
    drawDescentResident(
      ctx,
      { ...e, x: e.x - (arriving ? (1 - e.arrival) * 34 : 0) },
      descentClock,
      arriving
        ? 'walk'
        : e.workUntil > descentClock
          ? 'work'
          : dialogue?.id.startsWith('ds-' + e.chapterId)
            ? 'talk'
            : 'idle'
    );
    if (d2(e.x - 30, e.y + 18, G.player.x, G.player.y) < 115 ** 2 && !dialogue) {
      ctx.fillStyle = '#dec792';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(
        e.phase === 'complete' || e.phase === 'helped'
          ? 'Talk'
          : e.npc === 'oren'
            ? 'Oren'
            : e.npc === 'nell'
              ? 'Nell'
              : 'Wick',
        e.x - 30,
        e.y - 75
      );
    }
  }
}
function descentTick(dt) {
  descentClock += Math.min(dt, 0.05);
  if (G.state === 'ending' && G.run?.endingStep >= 6) {
    let x =
        (keyboardActionDown('right') ? 1 : 0) -
        (keyboardActionDown('left') ? 1 : 0) +
        (controllerInput?.moveX || 0),
      y =
        (keyboardActionDown('down') ? 1 : 0) -
        (keyboardActionDown('up') ? 1 : 0) +
        (controllerInput?.moveY || 0);
    const m = Math.max(1, Math.hypot(x, y));
    descentEndingWalk.x = clamp(descentEndingWalk.x + (x / m) * 55 * dt, 255, 385);
    descentEndingWalk.y = clamp(descentEndingWalk.y + (y / m) * 55 * dt, 235, 317);
  }
  if (G.state === 'playing')
    for (const e of G.world?.descentEvents || [])
      if (e.arrival < 1 && (e.arrival > 0 || descentEventVisible(e)))
        e.arrival = save.motion ? 1 : clamp(e.arrival + dt / 1.1, 0, 1);
  if (T('descentTaskPanel')?.classList.contains('open')) {
    const event = descentEvent(descentPending);
    if (event) paintDescentTask(event, descentClock);
  }
  const panel = T('descentObjective');
  if (panel) {
    const text = descentCurrentObjective(),
      key = G.floor + ':' + text;
    if (G.run && key !== descentNotice.key) {
      descentNotice.key = key;
      descentNotice.remaining = 2.4;
      descentNotice.until = performance.now() + 2400;
      panel.textContent = text;
    }
    descentNotice.remaining = Math.max(
      0,
      Math.min(descentNotice.remaining - dt, (descentNotice.until - performance.now()) / 1000)
    );
    const fighting =
      G.bossActive ||
      G.enemies?.some(
        (e) => !e.dead && G.player && d2(e.x, e.y, G.player.x, G.player.y) < 300 ** 2
      );
    panel.hidden =
      descentNotice.remaining <= 0 ||
      G.state !== 'playing' ||
      fighting ||
      fieldNoteT > 0 ||
      G.run?.infinite ||
      isGuardianMode() ||
      isHearthTrial();
    panel.style.opacity = String(Math.min(1, descentNotice.remaining / 0.35));
  }
}

function descentUI() {
  document.body.classList.add('descent-story');
  const make = (id, cls, html) => {
    const el = document.createElement('div');
    el.id = id;
    el.className = cls;
    el.innerHTML = html;
    document.body.append(el);
    return el;
  };
  make(
    'descentTaskPanel',
    'ov descent-interaction',
    `<section class="panel"><div class="descent-task-art"><canvas id="descentTaskArt" width="256" height="176" aria-hidden="true"></canvas><span id="descentTaskWho" class="eyebrow"></span></div><div class="descent-task-copy"><h2 id="descentTaskTitle"></h2><p id="descentTaskText"></p><p id="descentTaskImpact" class="descent-task-impact"></p><div id="descentTaskReward" class="descent-task-reward"></div><div class="descent-task-actions" id="descentTaskActions"></div><button class="btn subtle" id="descentTaskClose">Leave for now</button></div></section>`
  );
  T('descentTaskPanel').setAttribute('role', 'dialog');
  T('descentTaskPanel').setAttribute('aria-modal', 'true');
  T('descentTaskPanel').setAttribute('aria-labelledby', 'descentTaskTitle');
  make('descentObjective', 'descent-objective', '').hidden = true;

  T('descentTaskClose').onclick = descentLeaveTask;
  T('endingCanvas').width = 640;
  T('endingCanvas').height = 360;

  addEventListener(
    'keydown',
    (event) => {
      if (event.code !== 'Escape') return;
      if (T('descentTaskPanel').classList.contains('open')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        descentLeaveTask();
      }
    },
    true
  );
}
descentRegisterScenes();
for (const id of Object.keys(HOLLOW_SCENES))
  if (/^(echo|trace)\d+$/.test(id)) delete HOLLOW_SCENES[id];
const descentOldValidate = validateSave;
validateSave = function (raw) {
  const clean = descentOldValidate(raw);
  clean.story = clean.story || { seen: {}, choices: {} };
  clean.story.descent = cleanDescentData(raw?.story?.descent);
  clean.story.descent.legacyCredit = Math.max(
    clean.story.descent.legacyCredit,
    Object.values(raw?.story?.archive?.echoes || {}).filter((e) => e?.completed).length
  );
  return clean;
};
const descentOldSnapshot = snapshotRun;
snapshotRun = function () {
  descentOldSnapshot();
  if (save.resume && G.world?.descentEvents && G.run && !G.dead) {
    save.resume.world.descentEvents = deepCopy(
      G.world.descentEvents.map((e) => ({
        ...e,
        active: false,
        actionT: 0,
        progress: ['complete', 'helped'].includes(e.phase) ? 1 : 0,
      }))
    );
    save.resume.world.descentReserved = [...G.world.descentReserved];
    save.resume.world.descentEventSlots = G.world.descentEventSlots;
  }
};
const descentOldSetup = setupFloor;
setupFloor = function (f) {
  descentNotice.key = '';
  descentPending = null;
  const out = descentOldSetup(f);
  descentInstallFloor();
  saveNow('story-floor');
  return out;
};
const descentOldResume = resumeRun;
resumeRun = function () {
  descentPending = null;
  const out = descentOldResume();
  if (G.run) {
    descentInstallFloor();
    if (dialogue?.id.startsWith('ds-')) {
      const c = descentChapter();
      descentPending =
        G.world.descentEvents?.find(
          (e) => e.chapterId === c?.id && e.optional === dialogue.id.endsWith('optional')
        )?.id || null;
    }
  }
  return out;
};
const descentOldFinish = finishDialogue;
finishDialogue = function () {
  const id = dialogue?.id,
    replay = dialogue?.replay,
    pending = descentPending;
  descentOldFinish();
  if (GUARDIAN_SCENES.has(id) && id?.endsWith('After') && !replay) {
    descentGuardianComplete();
    saveNow('story-guardian');
  }
  if (id?.startsWith('ds-') && pending && !replay) {
    const e = descentEvent(pending);
    descentPending = null;
    if (e && e.phase === 'introduced') descentOpenTask(e);
  }
  if (id?.startsWith('ds-') && !dialogue && G.state === 'playing' && G.pendingLevels > 0)
    triggerLevelup();
};
const descentOldBefore = hollowBeforeUpdate;
hollowBeforeUpdate = function (dt) {
  if (interactQueued && G.state === 'playing' && !anyBlockingOverlay()) {
    const e = nearestDescentEvent();
    if (e) {
      interactQueued = false;
      descentSpeak(e);
      return G.state !== 'playing';
    }
  }
  return descentOldBefore(dt);
};
const descentOldUpdate = update;
update = function (dt) {
  if (interactQueued && G.state === 'playing' && !anyBlockingOverlay()) {
    const e = nearestDescentEvent();
    if (e) {
      interactQueued = false;
      descentSpeak(e);
      if (G.state !== 'playing') return;
    }
  }
  return descentOldUpdate(dt);
};
const descentOldTick = hollowTick;
hollowTick = function (dt) {
  descentTick(dt);
  return descentOldTick(dt);
};
const descentOldDrawProps = drawProps;
drawProps = function (ctx) {
  descentOldDrawProps(ctx);
  if (G.player) descentDrawWorld(ctx);
};
const descentOldHUD = updateHUD;
updateHUD = function (dt) {
  descentOldHUD(dt);
  if (G.state === 'playing' && !G.bossActive) {
    const e = nearestDescentEvent();
    if (e) {
      T('promptTxt').textContent =
        (residentStop(e).claimed ? 'TALK TO ' : 'SUPPLIES · ') +
        (e.npc === 'wick' ? 'WICK' : e.npc.toUpperCase());
      T('prompt').classList.add('on');
    }
  }
};
const descentOldPortrait = drawPortrait;
drawPortrait = function () {
  if (!dialogue) return;
  const cv = T('speakerPortrait'),
    speaker = dialogue.lines[dialogue.index]?.speaker;
  if (
    typeof drawDescentPortrait === 'function' &&
    drawDescentPortrait(cv.getContext('2d'), speaker, portraitClock)
  )
    return;
  return descentOldPortrait();
};
const descentOldLine = renderDialogueLine;
renderDialogueLine = function () {
  descentOldLine();
  if (dialogue) {
    const speaker = dialogue.lines[dialogue.index].speaker,
      tag = {
        You: 'THE EMBER',
        Oren: 'MAINTENANCE',
        Nell: 'GARDENS',
        'The Star Warden': 'MARA',
        'The Ember Colossus': 'FOUNDRY',
        'The Glass Astronomer': 'OBSERVATORY',
        'The Pale Scribe': 'ARCHIVE',
        'The First Regent': 'FIRST REGENT',
        'The Second Regent': 'SECOND REGENT',
        'The Void Seraph': 'BELFRY',
        'The Obsidian Tyrant': 'CITADEL',
        'The First Keeper': 'CONTROL ROOM',
      }[speaker];
    if (tag) T('speakerTag').textContent = tag;
  }
};
const descentOldHearth = drawHearthRoom;
drawHearthRoom = function (ctx, t) {
  descentOldHearth(ctx, t);
  if (typeof drawHearthResidents === 'function') drawHearthResidents(ctx, t);
};
const descentOldBlocking = anyBlockingOverlay;
anyBlockingOverlay = function () {
  return T('descentTaskPanel')?.classList.contains('open') || descentOldBlocking();
};
const descentOldBack = backToMenu;
backToMenu = function () {
  descentPending = null;
  for (const id of ['descentTaskPanel']) T(id)?.classList.remove('open');
  return descentOldBack();
};
if (!DS_DEMO) {
  ENDING_SCENES.splice(0, ENDING_SCENES.length, ...DESCENT_ENDING_LINES);
  const oldBegin = beginEnding;
  beginEnding = function () {
    if (
      G.run &&
      !G.dead &&
      !G.run.infinite &&
      !isGuardianMode() &&
      !isHearthTrial() &&
      G.floor === 50 &&
      !G.run.campaignComplete &&
      !storyData().seen.keeperAfter
    ) {
      collectGuardianRewards();
      if (G.pendingLevels > 0) return oldBegin();
      if (!dialogue) beginDialogue('keeperAfter', false, 0, 'playing');
      return;
    }
    descentGuardianComplete();
    return oldBegin();
  };
  const oldEndingText = updateEndingText;
  updateEndingText = function () {
    oldEndingText();
    if (!G.run) return;
    const step = G.run.endingStep;
    T('endingNext').textContent =
      step === 0
        ? 'OPEN THE RELEASE'
        : step === ENDING_SCENES.length - 1
          ? 'FINISH THE DESCENT'
          : 'CONTINUE';

    if (step >= ENDING_SCENES.length) {
      descentData().endingSeen = true;
      saveNow('story-ending');
    }
  };
  drawEnding = function () {
    const cv = T('endingCanvas');
    if (typeof drawDescentEnding === 'function')
      drawDescentEnding(
        cv.getContext('2d'),
        G.run?.endingStep || 0,
        save.motion ? 4 : endingClock,
        descentEndingWalk
      );
  };
}
const descentOldControllerBack = controllerBack;
controllerBack = function (scope) {
  if (scope?.id === 'descentTaskPanel') {
    descentLeaveTask();
    return;
  }
  return descentOldControllerBack(scope);
};
const descentOldAchievementSync = achievementSync;
achievementSync = function () {
  descentOldAchievementSync();
  const d = descentData(),
    count = Object.values(d.chapters).reduce((n, c) => n + Number(c.main) + Number(c.help), 0);
  achievementMax('echoes', Math.max(count, d.legacyCredit));
};
const descentOldGuideAllowed = wickGuideAllowed;
wickGuideAllowed = function (target) {
  return !!target?.closest?.('#descentTaskPanel') || descentOldGuideAllowed(target);
};
const descentOldInit = init;
init = function () {
  descentUI();
  const out = descentOldInit();
  if (save.campaignMedal) descentData().endingSeen = true;
  else descentData();
  return out;
};
