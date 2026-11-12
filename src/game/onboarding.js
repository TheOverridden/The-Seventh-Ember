'use strict';
const ONBOARDING_VERSION = 2;
const ONBOARDING_STEPS = [
  'move',
  'bolt',
  'flare',
  'dash',
  'kindled',
  'rekindle',
  'interact',
  'blessing',
  'warden',
];
let onboardingMoveT = 0,
  onboardingDashT = 0,
  onboardingDeadShown = false,
  onboardingCoachT = 0,
  onboardingCoachGapT = 0;
const onboardingShown = new Set();
function cleanOnboarding(raw, totalRuns = 0) {
  const out = { version: ONBOARDING_VERSION };
  if (!raw && totalRuns >= 3) {
    for (const id of ONBOARDING_STEPS) out[id] = true;
    return out;
  }
  for (const id of ONBOARDING_STEPS) out[id] = raw?.[id] === true;
  return out;
}
const onboardingValidate = validateSave;
validateSave = function (raw) {
  const out = onboardingValidate(raw);
  out.onboarding = cleanOnboarding(raw?.onboarding, out.totalRuns);
  return out;
};
function onboardingData() {
  return save.onboarding || (save.onboarding = cleanOnboarding(null, save.totalRuns));
}
function learnOnboarding(id) {
  const data = onboardingData();
  if (data[id]) return;
  data[id] = true;
  saveNow();
}
function onboardingTouch() {
  return document.body.classList.contains('touch');
}
function onboardingInputMode() {
  return controllerInput.active ? 'controller' : onboardingTouch() ? 'touch' : 'keyboard';
}
function onboardingBinding(action, touchLabel) {
  const controllerAction = action === 'reload' ? 'rekindle' : action === 'interact' ? 'use' : action;
  return onboardingInputMode() === 'controller'
    ? controllerButtonName(controllerPreferences().bindings[controllerAction])
    : onboardingTouch()
      ? touchLabel
      : keyLabel(action);
}
const ONBOARDING_COPY = {
  move: [
    'MOVE FIRST',
    () =>
      onboardingInputMode() === 'controller'
        ? 'Left stick moves. Right stick aims. ' + controllerButtonName(9) + ' pauses.'
        : onboardingTouch()
          ? 'Left ember-ring moves. Right ember-ring aims and fires. Tap PAUSE for a break.'
          : 'Move with ' +
            ['up', 'left', 'down', 'right'].map((action) => keyLabel(action, 0)).join(' / ') +
            '. Mouse aims. ' + keyLabel('pause') + ' pauses.',
  ],
  bolt: [
    'EMBER BOLT',
    () =>
      onboardingInputMode() === 'controller'
        ? 'Aim with the right stick. Hold ' + onboardingBinding('bolt') + ' to fire.'
        : onboardingTouch()
          ? 'Hold the right ember-ring toward the creature.'
          : 'Aim with the mouse and hold click, or hold ' + keyLabel('bolt') + '.',
  ],
  flare: [
    'FLARE',
    () =>
      'Flare hits harder up close. ' +
      (onboardingInputMode() === 'keyboard'
        ? 'Press ' + onboardingBinding('flare') + ' or right-click.'
        : 'Press ' + onboardingBinding('flare', 'FLARE') + '.'),
  ],
  dash: [
    'DASH THROUGH DANGER',
    () =>
      'Press ' + onboardingBinding('dash', 'DASH') + ' to dash safely through an attack.',
  ],
  kindled: [
    'DASH COUNTER',
    () =>
      'A close dash through danger empowers your next Flare. Strike before the gold light fades.',
  ],
  rekindle: [
    'REKINDLE',
    () =>
      'Low on Bolts? Press ' + onboardingBinding('reload', 'REKINDLE') + '. Rekindle is automatic at empty.',
  ],
  interact: [
    'THE RESTING FLAME',
    () =>
      'Near the resting flame, press ' + onboardingBinding('interact', 'USE') + ' to recover health.',
  ],
  blessing: [
    'CHOOSE WHAT CHANGES',
    () => 'Blessings last for this descent. Pick one that works with the way you are fighting.',
  ],
  warden: [
    'THE LAST WATCH',
    () =>
      'Mara follows careless Bolts. Dash close to the glaive, then answer with Flare while her guard is open.',
  ],
};
const coach = document.createElement('aside');
coach.id = 'onboardingCoach';
coach.setAttribute('role', 'status');
coach.setAttribute('aria-live', 'polite');
coach.innerHTML =
  '<span>FIRST DESCENT</span><strong id="onboardingTitle"></strong><p id="onboardingText"></p><i aria-hidden="true"></i>';
document.body.append(coach);
function hideOnboardingCoach() {
  coach.classList.remove('visible');
  coach.dataset.step = '';
  onboardingCoachT = 0;
}
function showOnboardingCoach(id) {
  if (onboardingData()[id] || onboardingShown.has(id)) return;
  const copy = ONBOARDING_COPY[id];
  onboardingShown.add(id);
  coach.dataset.step = id;
  onboardingCoachT = 2;
  T('onboardingTitle').textContent = copy[0];
  T('onboardingText').textContent = copy[1]();
  coach.classList.add('visible');
  positionOnboardingCoach();
}
function positionOnboardingCoach() {
  coach.style.visibility = '';
  const map = T('mm')?.getBoundingClientRect(),
    box = coach.getBoundingClientRect();
  if (
    map &&
    box.left < map.right &&
    box.right > map.left &&
    box.top < map.bottom &&
    box.bottom > map.top
  )
    coach.style.visibility = 'hidden';
}
function nearEnemy(range) {
  const p = G.player;
  return (
    p &&
    G.enemies.find(
      (e) =>
        !e.dead &&
        !e.isBoss &&
        !e.growth &&
        !e.mechanism &&
        d2(p.x, p.y, e.x, e.y) < range * range &&
        los(G.world, p.x, p.y, e.x, e.y)
    )
  );
}
function onboardingWanted() {
  const learned = onboardingData(),
    d = Object.fromEntries(ONBOARDING_STEPS.map((id) => [id, learned[id] || onboardingShown.has(id)])),
    p = G.player;
  if (!p || G.floor > 5) return '';
  if (!d.move) return 'move';
  if (!d.bolt && nearEnemy(390)) return 'bolt';
  if (!d.flare && nearEnemy(145)) return 'flare';
  const danger =
    G.ebul.some((b) => d2(p.x, p.y, b.x, b.y) < 155 ** 2) ||
    G.enemies.some(
      (e) => !e.dead && (e.action === 'warn' || (e.ai === 'warden' && e.wb?.mode === 'windup'))
    );
  if (!d.dash && danger) return 'dash';
  if (!d.kindled && p.kindledT > 0) return 'kindled';
  if (!d.rekindle && (p.ammo ?? p.magSize) > 0 && (p.ammo ?? 99) <= 2) return 'rekindle';
  const resting = typeof nearestRestingFlame === 'function' && nearestRestingFlame();
  if (!d.interact && resting && !resting.lit) return 'interact';
  if (!d.warden && G.boss?.warden && G.boss.introduced) return 'warden';
  return '';
}
function tickOnboarding(dt) {
  if (!G.run || G.state !== 'playing' || dialogue || anyBlockingOverlay()) {
    hideOnboardingCoach();
    return;
  }
  const p = G.player;
  if (p?.moving) {
    onboardingMoveT += dt;
    if (onboardingMoveT > 0.22) learnOnboarding('move');
  }
  if (p?.dashT > 0) {
    onboardingDashT += dt;
    if (onboardingDashT > 0.025) learnOnboarding('dash');
  } else onboardingDashT = 0;
  if (coach.dataset.step) {
    onboardingCoachT -= dt;
    if (onboardingCoachT > 0) {
      const copy = ONBOARDING_COPY[coach.dataset.step][1]();
      if (T('onboardingText').textContent !== copy) T('onboardingText').textContent = copy;
      positionOnboardingCoach();
      return;
    }
    hideOnboardingCoach();
    onboardingCoachGapT = 0.8;
    return;
  }
  onboardingCoachGapT = Math.max(0, onboardingCoachGapT - dt);
  if (onboardingCoachGapT > 0) return;
  const wanted = onboardingWanted();
  if (wanted) showOnboardingCoach(wanted);
  else hideOnboardingCoach();
  if (T('dead').classList.contains('open') && !onboardingDeadShown) {
    onboardingDeadShown = true;
    refreshFirstDeathGuide();
  }
}
const onboardingStart = startRun;
startRun = function () {
  onboardingMoveT = onboardingDashT = 0;
  onboardingDeadShown = false;
  onboardingShown.clear();
  onboardingCoachGapT = 0;
  hideOnboardingCoach();
  return onboardingStart();
};
const onboardingFire = fireVolley;
fireVolley = function () {
  const before = G.player?.ammo ?? 0,
    out = onboardingFire();
  if ((G.player?.ammo ?? before) < before) learnOnboarding('bolt');
  return out;
};
const onboardingMelee = beginMelee;
beginMelee = function () {
  const out = onboardingMelee();
  if (out !== false) learnOnboarding('flare');
  return out;
};
const onboardingReload = beginReload;
beginReload = function () {
  const manual = (G.player?.ammo ?? 0) > 0,
    out = onboardingReload();
  if (manual && out === true) learnOnboarding('rekindle');
  return out;
};
const onboardingFlame = useRestingFlame;
useRestingFlame = function (o) {
  const fresh = !o.lit,
    out = onboardingFlame(o);
  if (fresh) learnOnboarding('interact');
  return out;
};
const onboardingCard = chooseCard;
chooseCard = function (i) {
  const valid = G.state === 'levelup' && G.cardPool?.[i],
    out = onboardingCard(i);
  if (valid) learnOnboarding('blessing');
  return out;
};
function firstBlessingPrompt() {
  if (!onboardingData().blessing && !T('luWrap').classList.contains('seventh-wish-draft'))
    T('luSub').textContent = 'BLESSINGS LAST FOR THIS DESCENT · CHOOSE HOW YOUR EMBER CHANGES';
}
const onboardingTriggerLevel = triggerLevelup;
triggerLevelup = function () {
  const out = onboardingTriggerLevel();
  firstBlessingPrompt();
  return out;
};
const onboardingOpenLevel = openLevelup;
openLevelup = function (free) {
  const out = onboardingOpenLevel(free);
  firstBlessingPrompt();
  return out;
};
const onboardingDamage = damageEnemy;
damageEnemy = function (e, dmg, ang, crit, kb, kind) {
  const lesson = e?.warden && e.introduced && e.wb?.mode === 'recover',
    out = onboardingDamage(e, dmg, ang, crit, kb, kind);
  if (lesson) learnOnboarding('warden');
  return out;
};
const onboardingUpdate = update;
update = function (dt) {
  const out = onboardingUpdate(dt);
  tickOnboarding(dt);
  return out;
};
const deathGuide = document.createElement('div');
deathGuide.id = 'firstDeathGuide';
deathGuide.innerHTML = '<strong>LEARN FROM THE FALL</strong><p id="firstDeathGuideText"></p>';
T('dead').querySelector('.btnrow').before(deathGuide);
function refreshFirstDeathGuide() {
  T('firstDeathGuideText').textContent =
    'Your gathered essence is kept. Spend it on permanent sigils before rising again, or return to the Main Menu.';
  deathGuide.hidden = G.floor > 5;
}
const onboardingDie = die;
die = function () {
  const out = onboardingDie();
  setTimeout(() => {
    if (G.dead) refreshFirstDeathGuide();
  }, 1350);
  return out;
};
const onboardingChapter = showChapterClear;
showChapterClear = function () {
  onboardingChapter();
  if (G.floor === 5) {
    T('chapterCompleteLabel').textContent = 'THE FIRST GATE OPENS';
    T('chapterCompleteText').textContent = CHAPTER_EXIT_TEXT[5];
    T('chapterContinue').textContent = 'ENTER THE ROOTBOUND GARDENS';
  }
};
