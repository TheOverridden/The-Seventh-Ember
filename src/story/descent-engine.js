'use strict';
const DS_DEMO = window.DS_DEMO === true;
let descentPending = null,
  descentAction = null,
  descentTaskReturn = 'playing',
  descentClock = 0;
const descentEndingState = { endingReplay: false };
const descentEndingWalk = { x: 318, y: 281 };
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
function descentNote(text) {
  const d = descentData();
  if (d.recent.at(-1) !== text) d.recent.push(text);
  d.recent = d.recent.slice(-12);
}
function descentActionText(e) {
  const c = DESCENT_CHAPTERS.find((c) => c.id === e.chapterId);
  return e.optional ? c.optionalAction : c.action;
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
function descentInstallFloor() {
  const w = G.world,
    c = descentChapter();
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
              Number(w.specialEncounters?.some((sc) => sc.roomIndex === a.i)) || a.i - b.i
        );
        const q = optional
          ? candidates[0]
          : candidates.find((q) => !w.specialEncounters?.some((sc) => sc.roomIndex === q.i));
        if (!q) return;
        index = q.i;
      }
      const r = w.rooms[index],
        pos = safePosition(w, r.cx * TILE + 18, r.cy * TILE + 18, 20);
      if (!pos || !descentInside(r, pos)) return;
      if (optional) {
        for (const sc of (w.specialEncounters || []).filter((sc) => sc.roomIndex === index))
          sealSpecialEncounter(sc, false);
        w.specialEncounters = (w.specialEncounters || []).filter((sc) => sc.roomIndex !== index);
        w.descentEventSlots = 1;
      }
      w.descentReserved.push(index);
      const done = optional ? record.help : record.main,
        known = !!storyData().seen['ds-' + c.id + '-' + (optional ? 'optional' : 'intro')];
      const e = {
        id: 'descent-' + c.id + (optional ? '-help' : '-main'),
        chapterId: c.id,
        roomIndex: index,
        x: pos.x,
        y: pos.y,
        npc: optional ? c.optionalNpc : c.npc,
        prop: optional ? c.optionalProp : c.prop,
        optional,
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
        arrival: restore ? 1 : 0,
      };
      w.descentEvents.push(e);
      descentQuietRoom(index);
      w.props = (w.props || []).filter((p) => d2(p.x, p.y, e.x, e.y) > 115 ** 2);
      if (!w.torches.some((t) => t.descent === e.id))
        w.torches.push({ x: e.x - 20, y: e.y - 35, s: 0, descent: e.id });
    };
  if (G.floor === c.mainFloor || (G.floor > c.mainFloor && !record.main))
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
  if (!c) return;
  descentTaskReturn = G.state === 'menu' ? 'menu' : 'playing';
  descentPending = e.id;
  T('descentTaskTitle').textContent = e.optional ? c.optionalTitle : c.title;
  T('descentTaskText').textContent = e.optional
    ? e.phase === 'helped'
      ? c.helpSummary
      : c.optionalAction
    : e.phase === 'complete'
      ? c.mainSummary
      : c.objective;
  const actions = T('descentTaskActions');
  actions.replaceChildren();
  if (!['helped', 'complete'].includes(e.phase)) {
    const b = document.createElement('button');
    b.className = 'btn primary';
    b.textContent = e.optional ? c.optionalAction : c.action;
    b.onclick = () => descentBeginAction(e);
    actions.append(b);
    if (e.optional && !descentData().chapters[c.id].taken) {
      const supply = document.createElement('button');
      supply.className = 'btn';
      supply.textContent = 'Take the supplies · +' + (c.immediateReward || 12) + ' Essence';
      supply.onclick = () => descentTakeSupplies(e);
      actions.append(supply);
    }
  }
  setState('paused');
  show('descentTaskPanel');
  clearInput();
  actions.querySelector('button')?.focus({ preventScroll: true });
  if (!actions.children.length) T('descentTaskClose').focus({ preventScroll: true });
}
function descentLeaveTask() {
  hide('descentTaskPanel');
  descentPending = null;
  setState(descentTaskReturn);
  clearInput();
  G.cv?.focus({ preventScroll: true });
  saveNow('story-task');
}
function descentBeginAction(e) {
  hide('descentTaskPanel');
  descentPending = null;
  descentAction = { id: e.id, time: 0, duration: 2.5, from: 'playing' };
  e.progress = 0;
  e.active = true;
  G.bullets = [];
  G.ebul = [];
  clearInput();
  setState('storyAction');
  T('descentActionLabel').textContent = descentActionText(e);
  T('descentActionLabel').hidden = false;
}
function descentCancelAction() {
  const e = descentEvent(descentAction?.id);
  if (e) {
    e.active = false;
    e.progress = 0;
  }
  descentAction = null;
  T('descentActionLabel').hidden = true;
  setState('playing');
  clearInput();
  saveNow('story-interrupted');
}
function descentFinishAction(e) {
  const c = DESCENT_CHAPTERS.find((c) => c.id === e.chapterId),
    record = descentData().chapters[c.id];
  e.active = false;
  e.progress = 1;
  if (e.optional) {
    record.help = true;
    e.phase = 'helped';
    if (e.npc !== 'wick') descentData().residents[e.npc] = true;
    descentNote(c.helpSummary);
  } else {
    record.main = true;
    record.by = 'player';
    record.met = true;
    e.phase = 'complete';
    descentNote(c.mainSummary);
  }
  descentAction = null;
  T('descentActionLabel').hidden = true;
  setState('playing');
  saveNow('story-complete');
  beginDialogue('ds-' + c.id + '-' + (e.optional ? 'helped' : 'after'), false, 0, 'playing');
}
function descentTakeSupplies(e) {
  const c = DESCENT_CHAPTERS.find((c) => c.id === e.chapterId),
    r = descentData().chapters[c.id];
  if (r.taken || r.help) return;
  r.taken = true;
  e.phase = 'taken';
  addEss(c.immediateReward || 12);
  descentNote('You took the spare supplies in ' + c.title + '. The request remains available.');
  hide('descentTaskPanel');
  descentPending = null;
  setState('playing');
  clearInput();
  saveNow('story-supplies');
}
function descentGuardianComplete() {
  const c = descentChapter();
  if (!c) return;
  const r = descentData().chapters[c.id];
  if (!r.main) {
    r.main = true;
    r.by = 'resident';
    r.met = true;
    descentNote('Finished by the residents: ' + c.mainSummary);
  }
  if (c.id === 'gate') descentData().residents.mara = true;
  for (const e of G.world?.descentEvents || [])
    if (!e.optional) {
      e.phase = 'complete';
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
function descentRenderJournal() {
  T('memoryList').replaceChildren();
  T('memoryEmpty').hidden = true;
  const list = T('memoryList'),
    d = descentData();
  const objective = document.createElement('article');
  objective.className = 'descent-objective';
  const title = document.createElement('h3');
  title.textContent = 'What we are doing';
  const body = document.createElement('p');
  body.textContent = descentCurrentObjective();
  objective.append(title, body);
  list.append(objective);
  for (const [id, name, job] of [
    ['wick', 'Wick', 'Travelling with you.'],
    ['oren', 'Oren', 'Working on the water and power supply.'],
    ['nell', 'Nell', 'Keeping the growing beds and residents supplied.'],
    ['mara', 'Mara', 'The Star Warden.'],
  ]) {
    if (id !== 'wick' && !d.residents[id]) continue;
    const card = document.createElement('article');
    card.className = 'descent-resident-card';
    const cv = document.createElement('canvas');
    cv.width = cv.height = 120;
    if (typeof drawDescentPortrait === 'function')
      drawDescentPortrait(cv.getContext('2d'), name, 0);
    const text = document.createElement('div'),
      h = document.createElement('h3'),
      p = document.createElement('p');
    h.textContent = name;
    p.textContent = job;
    text.append(h, p);
    card.append(cv, text);
    list.append(card);
  }
  const h = document.createElement('h3');
  h.textContent = 'Recently';
  list.append(h);
  const recent = d.recent.slice(-3);
  for (const text of recent.length
    ? recent
    : ['The Hearth is losing heat. Wick is looking for a way to open the upper gate.']) {
    const p = document.createElement('p');
    p.textContent = text;
    list.append(p);
  }
  if (d.endingSeen) {
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = 'Revisit the open gate';
    b.onclick = () => {
      hide('memories');
      replayDescentEnding();
    };
    list.append(b);
  }
}
function openDescentJournal() {
  if (dialogue || descentAction) return;
  if (G.state === 'playing') pauseGame(true);
  descentRenderJournal();
  show('memories');
  T('memoriesClose').focus({ preventScroll: true });
}
function descentDrawWorld(ctx) {
  for (const e of G.world?.descentEvents || []) {
    if (
      e.x < G.cam.x - 180 ||
      e.x > G.cam.x + G.w + 180 ||
      e.y < G.cam.y - 180 ||
      e.y > G.cam.y + G.h + 180
    )
      continue;
    drawDescentProp(ctx, e, descentClock);
    const arriving = e.arrival > 0 && e.arrival < 1;
    drawDescentResident(
      ctx,
      { ...e, x: e.x - (arriving ? (1 - e.arrival) * 34 : 0) },
      descentClock,
      arriving
        ? 'walk'
        : e.active
          ? 'work'
          : dialogue?.id.startsWith('ds-' + e.chapterId)
            ? 'talk'
            : 'idle'
    );
    if (d2(e.x - 30, e.y + 18, G.player.x, G.player.y) < 115 ** 2 && !dialogue && !descentAction) {
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
      if (e.arrival < 1 && d2(e.x, e.y, G.player.x, G.player.y) < 300 ** 2)
        e.arrival = clamp(e.arrival + dt / 1.1, 0, 1);
  if (descentAction) {
    const e = descentEvent(descentAction.id);
    if (!e || G.dead) {
      descentCancelAction();
      return;
    }
    descentAction.time += dt;
    e.progress = clamp(descentAction.time / descentAction.duration, 0, 1);
    e.actionT = descentAction.time;
    T('descentActionLabel').textContent =
      descentActionText(e) + ' · ' + Math.round(e.progress * 100) + '%';
    if (e.progress >= 1) descentFinishAction(e);
  }
  const panel = T('descentObjective');
  if (panel) {
    panel.hidden = G.state !== 'playing' || G.run?.infinite || isGuardianMode() || isHearthTrial();
    if (!panel.hidden) panel.textContent = descentCurrentObjective();
  }
}

function replayDescentEnding() {
  if (DS_DEMO) return;
  if (dialogue) finishDialogue();
  descentEndingState.previewBackup = { run: G.run, dead: G.dead, state: G.state };
  descentEndingState.endingReplay = true;
  G.run = deepCopy(G.run || save.resume?.run || { up: {}, kills: 0, ess: 0, t: 0, level: 1 });
  for (const id of ['menu', 'pause', 'chapterClear', 'memories', 'dead', 'levelup'])
    T(id)?.classList.remove('open');
  descentAction = null;
  G.dead = false;
  G.run.endingStep = 0;
  G.run.campaignComplete = true;
  G.run.campaignStats = {
    kills: G.run.kills || 0,
    ess: G.run.ess || 0,
    time: G.run.t || 0,
    level: G.run.level || 1,
    guardians: 10,
  };
  setState('ending');
  show('finale');
  endingClock = 0;
  updateEndingText();
  clearInput();
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
    `<section class="panel"><span class="eyebrow">THE DESCENT</span><h2 id="descentTaskTitle"></h2><p id="descentTaskText"></p><div class="descent-task-actions" id="descentTaskActions"></div><button class="btn subtle" id="descentTaskClose">Leave for now</button></section>`
  );
  T('descentTaskPanel').setAttribute('role', 'dialog');
  T('descentTaskPanel').setAttribute('aria-modal', 'true');
  T('descentTaskPanel').setAttribute('aria-labelledby', 'descentTaskTitle');
  make('descentObjective', 'descent-objective', '').hidden = true;
  make('descentActionLabel', 'descent-action', '').hidden = true;

  T('descentTaskClose').onclick = descentLeaveTask;
  for (const id of ['btnMemories', 'btnPauseMemories']) {
    const el = T(id);
    if (el) {
      el.textContent = 'Journal';
      el.onclick = (e) => {
        e.stopImmediatePropagation();
        openDescentJournal();
      };
    }
  }
  const memoryTitle = T('memories')?.querySelector('h2');
  if (memoryTitle) memoryTitle.textContent = 'Journal';
  T('memoryCount') && (T('memoryCount').textContent = '');
  T('memories').querySelector('.panel')?.classList.add('descent-journal');
  const journalIntro = T('memories').querySelector('.memories-intro');
  if (journalIntro)
    journalIntro.textContent = 'The current job, the people you have met, and what has changed.';
  T('endingCanvas').width = 640;
  T('endingCanvas').height = 360;

  addEventListener(
    'keydown',
    (event) => {
      if (event.code !== 'Escape') return;
      if (descentAction) {
        event.preventDefault();
        event.stopImmediatePropagation();
        descentCancelAction();
      } else if (T('descentTaskPanel').classList.contains('open')) {
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
  if (descentEndingState.endingReplay) return;
  const state = G.state;
  if (state === 'storyAction') G.state = 'paused';
  try {
    descentOldSnapshot();
  } finally {
    G.state = state;
  }
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
  descentAction = null;
  descentPending = null;
  T('descentActionLabel') && (T('descentActionLabel').hidden = true);
  const out = descentOldSetup(f);
  descentInstallFloor();
  saveNow('story-floor');
  return out;
};
const descentOldResume = resumeRun;
resumeRun = function () {
  descentAction = null;
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
  if (G.state === 'storyAction') return;
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
      T('promptTxt').textContent = 'TALK TO ' + (e.npc === 'wick' ? 'WICK' : e.npc.toUpperCase());
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
renderMemories = descentRenderJournal;
openMemories = openDescentJournal;
const descentOldHearth = drawHearthRoom;
drawHearthRoom = function (ctx, t) {
  descentOldHearth(ctx, t);
  if (typeof drawHearthResidents === 'function') drawHearthResidents(ctx, t);
};
const descentOldBlocking = anyBlockingOverlay;
anyBlockingOverlay = function () {
  return (
    !!descentAction || T('descentTaskPanel')?.classList.contains('open') || descentOldBlocking()
  );
};
const descentOldBack = backToMenu;
backToMenu = function () {
  descentAction = null;
  descentPending = null;
  for (const id of ['descentTaskPanel']) T(id)?.classList.remove('open');
  T('descentActionLabel') && (T('descentActionLabel').hidden = true);
  return descentOldBack();
};
if (!DS_DEMO) {
  ENDING_SCENES.splice(0, ENDING_SCENES.length, ...DESCENT_ENDING_LINES);
  const oldBegin = beginEnding;
  beginEnding = function () {
    if (
      !descentEndingState.endingReplay &&
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
    if (!descentEndingState.endingReplay) descentGuardianComplete();
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
    T('endingInfinite').hidden = descentEndingState.endingReplay;
    if (step >= ENDING_SCENES.length) {
      if (!descentEndingState.endingReplay) {
        descentData().endingSeen = true;
        saveNow('story-ending');
      } else T('endingNumbers').textContent = 'The open gate · replay';
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
  const oldFinish = finishCampaign;
  finishCampaign = function () {
    if (descentEndingState.endingReplay) {
      const prior = descentEndingState.previewBackup;
      descentEndingState.endingReplay = false;
      descentEndingState.previewBackup = null;
      G.run = prior.run;
      G.dead = prior.dead;
      hide('finale');
      if (G.run && !G.dead) {
        setState('paused');
        show('pause');
      } else {
        setState('menu');
        show('menu');
      }
      clearInput();
      return;
    }
    return oldFinish();
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
