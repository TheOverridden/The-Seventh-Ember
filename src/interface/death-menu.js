'use strict';
function returnDefeatToMenu() {
  sfx('ui');
  if (isGuardianMode() && !isHearthTrial()) leaveGuardianModes();
  else {
    backToMenu();
    saveNow('defeat-menu');
  }
  T(save.resume ? 'btnContinue' : 'btnStart')?.focus({ preventScroll: true });
}
function installDefeatMenuButtons() {
  for (const [id, parent] of [
    ['btnDeadMainMenu', T('dead')?.querySelector('.btnrow')],
    ['trialMainMenu', T('hearthTrialResult')?.querySelector('.trial-result-actions')],
  ]) {
    if (!parent || T(id)) continue;
    const button = document.createElement('button');
    button.id = id;
    button.type = 'button';
    button.className = 'btn subtle';
    button.textContent = 'MAIN MENU';
    if (id === 'trialMainMenu') button.hidden = true;
    on(button, 'click', returnDefeatToMenu);
    parent.append(button);
  }
  if (T('guardianResultMenu')) T('guardianResultMenu').textContent = 'MAIN MENU';
}
const defeatMenuInstallGuardians = installGuardianModes;
installGuardianModes = function () {
  const out = defeatMenuInstallGuardians();
  installDefeatMenuButtons();
  return out;
};
const defeatMenuInstallTrials = installHearthTrialUI;
installHearthTrialUI = function () {
  const out = defeatMenuInstallTrials();
  installDefeatMenuButtons();
  const result = T('hearthTrialResult');
  if (result && !result.dataset.defeatMenuFocus) {
    result.dataset.defeatMenuFocus = 'true';
    result.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Tab') return;
        event.stopImmediatePropagation();
        const buttons = [...result.querySelectorAll('button')].filter(
            (button) => !button.hidden && !button.disabled
          ),
          first = buttons[0],
          last = buttons.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      },
      true
    );
  }
  return out;
};
const defeatMenuShowTrialResult = showHearthTrialResult;
showHearthTrialResult = function (paused = false) {
  installDefeatMenuButtons();
  T('trialMainMenu').hidden = paused || !hearthTrial?.result || hearthTrial.result.cleared;
  return defeatMenuShowTrialResult(paused);
};
const defeatMenuBackToMenu = backToMenu;
backToMenu = function () {
  if (isHearthTrial()) {
    leaveHearthTrial(false);
    hearthTrialBoundary = true;
    try {
      hearthClose();
    } finally {
      hearthTrialBoundary = false;
    }
  } else hearthClose();
  guardianModeToken++;
  for (const overlay of document.querySelectorAll('.ov.open')) if (overlay.id) hide(overlay.id);
  dialogue = null;
  T('conversation').hidden = true;
  document.body.classList.remove('conversing', 'guardian-mode', 'hearth-trial');
  delete document.body.dataset.hearthTrial;
  hideOnboardingCoach();
  G.dead = G.paused = G.descending = false;
  G.victoryPending = G.pendingLevels = 0;
  G.cardPool = null;
  G.boss = G.portal = null;
  G.bossActive = false;
  for (const key of ['enemies', 'bullets', 'ebul', 'picks', 'chests', 'parts', 'texts'])
    G[key] = [];
  T('fade').style.opacity = 0;
  T('vig').style.opacity = 0;
  T('bossbar').classList.remove('on');
  T('prompt').classList.remove('on');
  if (G.cam) G.cam.shake = 0;
  clearInput();
  return defeatMenuBackToMenu();
};
installDefeatMenuButtons();
