'use strict';
const wickGuide = {
  mode: '',
  internal: 0,
  target: null,
  locks: new Map(),
  menuLocks: new Map(),
  layout: '',
  portraitAt: 0,
  replayStep: null,
};
const wickGuidePanel = document.createElement('div');
wickGuidePanel.id = 'wickGuide';
wickGuidePanel.hidden = true;
wickGuidePanel.setAttribute('role', 'dialog');
wickGuidePanel.setAttribute('aria-modal', 'true');
wickGuidePanel.setAttribute('aria-labelledby', 'wickGuideTitle');
wickGuidePanel.setAttribute('aria-describedby', 'wickGuideText');
wickGuidePanel.innerHTML =
  '<div id="wickGuideShade" aria-hidden="true">' +
  '<div class="wick-guide-backdrop"></div>'.repeat(4) +
  '</div><div id="wickGuideSpotlight" aria-hidden="true"></div>' +
  '<section class="wick-guide-card" id="wickGuideCard">' +
  '<canvas id="wickGuidePortrait" width="96" height="96" aria-hidden="true"></canvas>' +
  '<div class="wick-guide-copy"><span class="wick-guide-name">WICK</span>' +
  '<h2 id="wickGuideTitle"></h2><p id="wickGuideText" aria-live="polite"></p></div>' +
  '<div class="wick-guide-actions"><p id="wickGuideProgress"></p>' +
  '<button id="wickGuideNext" type="button"></button></div></section>';
document.body.append(wickGuidePanel);
const wickStartHint = document.createElement('aside');
wickStartHint.id = 'wickStartHint';
wickStartHint.hidden = true;
wickStartHint.innerHTML =
  '<canvas id="wickStartPortrait" width="48" height="48" aria-hidden="true"></canvas>' +
  '<p><b>WICK</b>Come on. Let’s get you moving.</p>';
T('btnStart').after(wickStartHint);
const wickTourButton = document.createElement('button');
wickTourButton.id = 'btnWickTour';
wickTourButton.type = 'button';
wickTourButton.className = 'btn';
wickTourButton.hidden = true;
wickTourButton.textContent = 'WICK’S HOMEPAGE TOUR';
T('btnHowClose').before(wickTourButton);
on(T('btnHow'), 'click', () => {
  wickTourButton.hidden = G.state !== 'menu' || !wickGuideData().complete;
});
on(wickTourButton, 'click', () => {
  if (G.state === 'menu' && !wickGuideStartOnly()) wickGuideLaunch(true);
});

function wickGuideStartOnly() {
  if (G.state !== 'menu') return false;
  const data = wickGuideData();
  return data.menuLocked && !data.tourStarted && !data.complete;
}
function wickGuideStartAction() {
  return T(save.resume ? 'btnContinue' : 'btnStart');
}
function wickGuideRestore(records) {
  for (const [el, value] of records) if (el.isConnected) el.inert = value;
  records.clear();
}
function wickGuideRestoreMenu() {
  for (const [el, value] of wickGuide.menuLocks)
    if (el.isConnected) {
      el.hidden = value.hidden;
      el.inert = value.inert;
    }
  wickGuide.menuLocks.clear();
  document.body.classList.remove('wick-start-only');
  wickStartHint.hidden = true;
}
function wickGuideSyncMenu() {
  if (wickGuide.mode || !wickGuideStartOnly()) {
    wickGuideRestoreMenu();
    return;
  }
  document.body.classList.add('wick-start-only');
  wickStartHint.hidden = false;
  const action = wickGuideStartAction();
  for (const el of T('menu').querySelectorAll('button,a[href],input,select')) {
    if (el === action) continue;
    if (!wickGuide.menuLocks.has(el))
      wickGuide.menuLocks.set(el, { hidden: el.hidden, inert: el.inert });
    el.hidden = el.inert = true;
  }
  if (T('menu').classList.contains('open') && !T('changelog').classList.contains('open'))
    action.focus({ preventScroll: true });
}
function wickGuideNavigate(fn) {
  wickGuide.internal++;
  try {
    return fn();
  } finally {
    wickGuide.internal--;
  }
}
function wickGuideStep() {
  return wickGuide.replayStep ?? wickGuideData().step;
}
function wickGuideSetStep(step) {
  if (wickGuide.replayStep !== null) wickGuide.replayStep = step;
  else wickGuideUpdate({ step }, 'wick-tour-step');
}
function wickGuideHomepageAction() {
  if (wickGuide.mode !== 'tour') return null;
  const id = { 0: 'btnTree', 4: 'btnGuardianArchive', 6: 'btnHearth' }[wickGuideStep()];
  return id ? T(id) : null;
}
function wickGuideTargets() {
  if (!wickGuide.mode) return [];
  const next = T('wickGuideNext'),
    step = wickGuideStep(),
    entry = wickGuideHomepageAction();
  if (wickGuide.mode === 'rush') return [next, T('btnBossRush')];
  if (entry) return [entry, next];
  if (step === 2) return [...T('treeNodes').querySelectorAll('[data-node]')];
  if (step === 3) return [next, T('btnUnlock')].filter((el) => !el.disabled);
  return [next];
}
function wickGuideLock() {
  wickGuideRestore(wickGuide.locks);
  const allowed = new Set(wickGuideTargets());
  for (const el of document.querySelectorAll(
    'button,input,select,textarea,a[href],[tabindex="0"]'
  )) {
    if (allowed.has(el) || wickGuidePanel.contains(el)) continue;
    wickGuide.locks.set(el, el.inert);
    el.inert = true;
  }
  clearInput();
  controllerRelease();
}
function wickGuideDrawPortrait(canvas, time) {
  const spr = SPR.flame;
  if (!spr?.frames?.length || !canvas) return;
  const ctx = canvas.getContext('2d'),
    size = canvas.width,
    scale = Math.floor(Math.min((size - 14) / spr.W, (size - 14) / spr.H)),
    frame = spr.frames[Math.floor(time * spr.fps) % spr.frames.length];
  ctx.clearRect(0, 0, size, size);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    frame,
    (size - spr.W * scale) / 2,
    (size - spr.H * scale) / 2 + Math.round(Math.sin(time * 2) * 2),
    spr.W * scale,
    spr.H * scale
  );
}
function wickGuidePosition() {
  if (!wickGuide.mode) return;
  const raw = wickGuide.target?.isConnected ? wickGuide.target.getBoundingClientRect() : null,
    width = innerWidth,
    height = innerHeight,
    visible =
      !!raw &&
      raw.width > 0 &&
      raw.height > 0 &&
      raw.right > 0 &&
      raw.bottom > 0 &&
      raw.left < width &&
      raw.top < height,
    left = visible ? clamp(raw.left - 8, 4, width - 4) : 0,
    top = visible ? clamp(raw.top - 8, 4, height - 4) : 0,
    right = visible ? clamp(raw.right + 8, left, width - 4) : 0,
    bottom = visible ? clamp(raw.bottom + 8, top, height - 4) : 0,
    card = T('wickGuideCard'),
    cw = card.offsetWidth,
    ch = card.offsetHeight,
    signature = [left, top, right, bottom, width, height, cw, ch].join(',');
  if (signature === wickGuide.layout) return;
  wickGuide.layout = signature;
  T('wickGuideShade').classList.toggle('wick-guide-fullshade', !visible);
  T('wickGuideSpotlight').hidden = !visible;
  const rects = [
    [0, 0, width, top],
    [0, bottom, width, height - bottom],
    [0, top, left, bottom - top],
    [right, top, width - right, bottom - top],
  ];
  [...T('wickGuideShade').children].forEach((el, i) => {
    const [x, y, w, h] = rects[i];
    Object.assign(el.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
  });
  Object.assign(T('wickGuideSpotlight').style, {
    left: left + 'px',
    top: top + 'px',
    width: right - left + 'px',
    height: bottom - top + 'px',
  });
  const margin = 22,
    candidates = [
      [margin, height - ch - margin],
      [width - cw - margin, height - ch - margin],
      [margin, margin],
      [width - cw - margin, margin],
    ],
    overlap = ([x, y]) =>
      Math.max(0, Math.min(x + cw, right) - Math.max(x, left)) *
      Math.max(0, Math.min(y + ch, bottom) - Math.max(y, top));
  candidates.sort((a, b) => overlap(a) - overlap(b));
  const [x, y] = candidates[0];
  card.style.left = clamp(x, 8, Math.max(8, width - cw - 8)) + 'px';
  card.style.top = clamp(y, 8, Math.max(8, height - ch - 8)) + 'px';
}
function wickGuideDetail() {
  const node = selectedNode || NODE_BY_ID.awaken,
    state = nodeState(node);
  if (state === 2)
    return 'You already have this one. It stays with you when you die. Follow the lines to see what it opens next.';
  if (state === 0)
    return (
      'This one needs ' +
      NODE_BY_ID[node.req].name +
      ' first. Follow the line back. Anything you unlock here stays with you.'
    );
  if (state === 1)
    return 'You’re a little short for this one. That’s fine. The price is here. Come back with more Essence after the next descent.';
  return 'You can afford this one. Read what it does, then unlock it if you want it. These upgrades stay when you die.';
}
function wickGuideRender() {
  wickGuideRestore(wickGuide.locks);
  wickGuideRestoreMenu();
  const step = wickGuideStep();
  wickGuideNavigate(() => {
    hearthClose();
    closeTree();
    for (const id of ['dead', 'howto', 'guardianArchive', 'bossRushPanel', 'menu']) hide(id);
    if (wickGuide.mode === 'tour') {
      if (step >= 1 && step <= 3) openTree('menu');
      else if (step === 5) openGuardianArchive();
      else if (step === 7 || step === 8) {
        show('menu');
        hearthOpen(step === 7 ? 'room' : 'trials');
      } else show('menu');
    } else show('menu');
  });
  let title, text, button;
  if (wickGuide.mode === 'rush') {
    title = 'Boss Rush is open';
    text =
      'You’ve opened Boss Rush. Same guardians, one after another. Your skills and Forms come with you, and you get a breather between fights.';
    button = 'SHOW ME';
    wickGuide.target = T('btnBossRush');
  } else {
    const steps = [
      [
        'Start with the Skill Tree',
        'Before you go down again, let me show you around. This button opens the Skill Tree. You spend Essence there, and the upgrades stay with you when you die. Go on, open it.',
        'OPEN THE SKILL TREE',
        T('btnTree'),
      ],
      [
        'Keep your Essence',
        'Here’s how much Essence you have. The blue shards level you up during a descent. Essence is what you bring back here to spend.',
        'SHOW ME THE SIGILS',
        T('treeEss'),
      ],
      [
        'Pick a sigil',
        'Pick a sigil and have a look. Start in the middle, then follow the lines out.',
        'SELECT A SIGIL',
        document.querySelector('.tree-map'),
      ],
      [
        'Permanent upgrades',
        wickGuideDetail(),
        'BACK TO THE HOMEPAGE',
        document.querySelector('.tree-inspector'),
      ],
      [
        'Find the Archive here',
        'The Archive is here on the homepage. Once you reach a guardian, you can practice its fight here without risking your saved descent. Let’s have a look.',
        'OPEN THE ARCHIVE',
        T('btnGuardianArchive'),
      ],
      [
        'Guardian Archive',
        'Reach a guardian and their fight appears here. You can practice without losing your saved descent. If the records are empty, keep going downstairs.',
        'BACK TO THE HOMEPAGE',
        T('guardianArchiveGrid'),
      ],
      [
        'The Hearth is here',
        'This one takes you to the Hearth. It’s your room: furnishings, new looks for your Ember, and a board of separate combat trials.',
        'OPEN THE HEARTH',
        T('btnHearth'),
      ],
      [
        'Your Hearth',
        'This is your room. You can change it, and change your Ember’s shards and trail. The Trial Board is over here.',
        'SHOW ME THE TRIALS',
        T('hearthCanvas'),
      ],
      [
        'The Trial Board',
        'These are separate fights with their own rules. Clear them to earn things for your room and new looks for your Ember. Your descent stays safe.',
        'BACK TO THE HOMEPAGE',
        T('hearthTrialsPanel'),
      ],
      [
        'Memories',
        'If you want another look at a memory you found downstairs, open Memories here. You can watch it again without having to find the room.',
        'GOT IT',
        T('btnMemories'),
      ],
      [
        'Achievements',
        'Your achievements are tracked here across all your descents. Open it to see what you’ve earned and what’s left.',
        'GOT IT',
        T('btnAchievements'),
      ],
      [
        'Settings and controls',
        'Settings & Save has your sound levels, control bindings, and save backups. The Music and Sound buttons beside it are quick mutes. If you forget a control, How to Play is up above. You can ask me for this tour again there, too.',
        'ONE LAST THING',
        T('btnSettings'),
      ],
      [
        'Back downstairs',
        save.resume
          ? 'Continue Descent picks up your saved run. Begin Descent starts a fresh one. That’s the tour. I’ll leave you to it.'
          : 'Begin Descent starts your next run. The Essence upgrades you bought come with you. That’s the tour. Ready when you are.',
        'FINISH TOUR',
        wickGuideStartAction(),
      ],
    ];
    [title, text, button, wickGuide.target] = steps[step];
  }
  T('wickGuideTitle').textContent = title;
  T('wickGuideText').textContent = text;
  T('wickGuideProgress').textContent =
    wickGuide.mode === 'rush' ? 'NEWLY UNLOCKED' : step + 1 + ' / ' + (WICK_GUIDE_LAST_STEP + 1);
  T('wickGuideNext').textContent = button;
  T('wickGuideNext').disabled = wickGuide.mode === 'tour' && step === 2;
  wickGuidePanel.hidden = false;
  document.body.classList.add('wick-guiding');
  wickGuide.target?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  wickGuideLock();
  wickGuide.layout = '';
  wickGuidePosition();
  wickGuideDrawPortrait(T('wickGuidePortrait'), save.motion ? 0 : G.tAll);
  const focus =
    step === 2 && wickGuide.mode === 'tour'
      ? T('treeNodes').querySelector('[data-node="awaken"]')
      : wickGuideHomepageAction() || T('wickGuideNext');
  focus?.focus({ preventScroll: true });
}
function wickGuideStop() {
  wickGuideRestore(wickGuide.locks);
  wickGuide.mode = '';
  wickGuide.replayStep = null;
  wickGuidePanel.hidden = true;
  wickGuide.target = null;
  wickGuide.layout = '';
  document.body.classList.remove('wick-guiding');
  clearInput();
  controllerRelease();
}
function wickGuideLaunch(replay = false) {
  const data = wickGuideData();
  if (wickGuide.mode || (!replay && (!data.tourStarted || data.complete))) return;
  if (replay && (G.state !== 'menu' || !data.complete)) return;
  wickGuideRestoreMenu();
  wickGuideNavigate(() => backToMenu());
  storyQueue = storyQueue.filter((id) => !['firstDeath', 'firstSigil'].includes(id));
  storyData().seen.firstDeath = true;
  wickGuide.replayStep = replay ? 0 : null;
  wickGuide.mode = 'tour';
  wickGuideRender();
  saveNow('wick-tour-open');
}
function wickGuideAdvance() {
  if (!wickGuide.mode || T('wickGuideNext').disabled) return;
  sfx('ui');
  if (wickGuide.mode === 'rush') {
    wickGuideUpdate({ rushSeen: true }, 'wick-rush-seen');
    wickGuideStop();
    openBossRush();
    return;
  }
  const step = wickGuideStep();
  if (step < WICK_GUIDE_LAST_STEP) {
    wickGuideSetStep(step + 1);
    wickGuideRender();
  } else {
    if (wickGuide.replayStep === null) wickGuideUpdate({ complete: true }, 'wick-tour-complete');
    wickGuideStop();
    wickGuideNavigate(() => {
      hearthClose();
      backToMenu();
    });
    wickGuideSyncMenu();
    wickGuideStartAction().focus({ preventScroll: true });
  }
}
function wickGuideCheck() {
  if (
    wickGuide.mode ||
    G.state === 'boot' ||
    T('bootScreen') ||
    dialogue ||
    T('changelog').classList.contains('open')
  )
    return;
  const data = wickGuideData();
  if (data.tourStarted && !data.complete && ['dead', 'menu'].includes(G.state)) {
    wickGuideLaunch();
    return;
  }
  if (G.state !== 'menu' || !T('menu').classList.contains('open') || anyBlockingOverlay()) return;
  if (!data.rushSeen && data.descentStarted && (save.campaignMedal || save.victories > 0)) {
    wickGuide.mode = 'rush';
    wickGuideRender();
  }
}
function wickGuideAllowed(target) {
  return (
    !!target &&
    (T('wickGuideCard').contains(target) ||
      wickGuideTargets().some((el) => el === target || el.contains(target)))
  );
}
for (const type of ['pointerdown', 'click', 'dblclick'])
  addEventListener(
    type,
    (event) => {
      const entry = wickGuideHomepageAction();
      if (type === 'click' && entry && (event.target === entry || entry.contains(event.target))) {
        event.preventDefault();
        event.stopImmediatePropagation();
        wickGuideAdvance();
        return;
      }
      if (!wickGuide.mode || wickGuideAllowed(event.target)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true
  );
addEventListener(
  'keydown',
  (event) => {
    const first = wickGuideStartOnly() && !T('changelog').classList.contains('open');
    if ((!wickGuide.mode && !first) || event.ctrlKey || event.altKey || event.metaKey) return;
    clearInput();
    const targets = first
      ? [wickGuideStartAction()]
      : wickGuideTargets().filter((el) => !el.disabled && !el.inert);
    if (event.code === 'Tab') {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!targets.length) return;
      const index = targets.indexOf(document.activeElement),
        next = (index + (event.shiftKey ? -1 : 1) + targets.length) % targets.length;
      targets[next]?.focus({ preventScroll: true });
      return;
    }
    if (['Enter', 'Space'].includes(event.code) && targets.includes(document.activeElement)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!event.repeat) document.activeElement.click();
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!event.repeat && ['Enter', 'Space'].includes(event.code) && first)
      wickGuideStartAction().click();
  },
  true
);
on(T('wickGuideNext'), 'click', wickGuideAdvance);

const wickGuideInit = init;
init = function () {
  const out = wickGuideInit();
  const rush = T('btnBossRush');
  if (rush && !rush.dataset.wickGuide) {
    rush.dataset.wickGuide = 'true';
    on(rush, 'click', () => {
      if (wickGuide.mode === 'rush') wickGuideAdvance();
    });
  }
  wickGuideData();
  wickGuideSyncMenu();
  return out;
};
const wickGuideRefreshMenu = refreshMenuStats;
refreshMenuStats = function () {
  wickGuideRestoreMenu();
  const out = wickGuideRefreshMenu();
  wickGuideSyncMenu();
  return out;
};
const wickGuideStart = startRun;
startRun = function () {
  if (wickGuide.mode) return;
  if (wickGuideData().tourStarted && !wickGuideData().complete) {
    wickGuideLaunch();
    return;
  }
  wickGuideRestoreMenu();
  const out = wickGuideStart();
  wickGuideUpdate({ descentStarted: true }, 'wick-first-descent');
  return out;
};
const wickGuideDie = die;
die = function () {
  const required =
    G.run &&
    !G.dead &&
    !G.run.infinite &&
    !isGuardianMode() &&
    !isHearthTrial() &&
    !wickGuideData().complete;
  const out = wickGuideDie();
  if (required && G.dead) {
    storyQueue = storyQueue.filter((id) => id !== 'firstDeath');
    wickGuideUpdate({ descentStarted: true, tourStarted: true }, 'wick-first-fall');
  }
  return out;
};
on(T('treeNodes'), 'click', (event) => {
  const button = event.target.closest('[data-node]');
  if (button && wickGuide.mode === 'tour' && !wickGuide.internal && wickGuideStep() === 2) {
    selectNode(NODE_BY_ID[button.dataset.node]);
    wickGuideSetStep(3);
    wickGuideRender();
  }
});
const wickGuideBuyNode = tryBuyNode;
tryBuyNode = function (node) {
  const out = wickGuideBuyNode(node);
  if (wickGuide.mode === 'tour') {
    storyQueue = storyQueue.filter((id) => id !== 'firstSigil');
    if (save.nodes[node.id]) storyData().seen.firstSigil = true;
    T('wickGuideText').textContent = wickGuideDetail();
    wickGuideLock();
    wickGuide.layout = '';
    wickGuidePosition();
  }
  return out;
};
for (const name of [
  'openTree',
  'closeTree',
  'openGuardianArchive',
  'closeGuardianArchive',
  'hearthOpen',
  'hearthClose',
  'openBossRush',
  'backToMenu',
  'requestStart',
  'resumeRun',
]) {
  const previous = window[name];
  window[name] = function (...args) {
    if (
      !wickGuide.internal &&
      (wickGuide.mode ||
        (wickGuideStartOnly() && !['requestStart', 'backToMenu', 'resumeRun'].includes(name)))
    )
      return;
    return previous(...args);
  };
}
const wickGuideBlocking = anyBlockingOverlay;
anyBlockingOverlay = function () {
  return !!wickGuide.mode || wickGuideStartOnly() || wickGuideBlocking();
};
const wickGuideEscape = onEscKey;
onEscKey = function () {
  if (wickGuide.mode || (wickGuideStartOnly() && !T('changelog').classList.contains('open')))
    return;
  return wickGuideEscape();
};
const wickGuideScope = controllerScope;
controllerScope = function () {
  return wickGuide.mode ? wickGuidePanel : wickGuideScope();
};
const wickGuideControllerTargets = controllerTargets;
controllerTargets = function (scope) {
  return scope === wickGuidePanel
    ? wickGuideTargets().filter((el) => !el.disabled && controllerVisible(el))
    : wickGuideControllerTargets(scope);
};
const wickGuideControllerBack = controllerBack;
controllerBack = function (scope) {
  if (wickGuide.mode || wickGuideStartOnly()) return;
  return wickGuideControllerBack(scope);
};
const wickGuideControllerPrompts = controllerRefreshPrompts;
controllerRefreshPrompts = function () {
  const out = wickGuideControllerPrompts();
  if ((wickGuide.mode || wickGuideStartOnly()) && controllerInput.active)
    T('controllerMenuGuide').textContent = controllerButtonName(0) + ' Select · D-pad Navigate';
  return out;
};
const wickGuideTick = hollowTick;
hollowTick = function (dt) {
  wickGuideCheck();
  const out = wickGuideTick(dt);
  if (wickGuide.mode) wickGuidePosition();
  if (G.tAll - wickGuide.portraitAt > 1 / 12) {
    wickGuide.portraitAt = G.tAll;
    const time = save.motion ? 0 : G.tAll;
    if (wickGuide.mode) wickGuideDrawPortrait(T('wickGuidePortrait'), time);
    else if (!wickStartHint.hidden) wickGuideDrawPortrait(T('wickStartPortrait'), time);
  }
  return out;
};
const wickGuideReset = resetEverything;
resetEverything = function () {
  wickGuideStop();
  wickGuideRestoreMenu();
  const out = wickGuideReset();
  wickGuideData();
  wickGuideSyncMenu();
  return out;
};
