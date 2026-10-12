function keyboardUpdateSettings() {
  const status = T('keyboardStatus');
  if (!status) return;
  save.keyboard = keyboardPreferences();
  status.textContent = keyboard.binding
    ? 'Press a key for ' + KEYBOARD_ACTIONS[keyboard.binding.action] + '. Esc cancels.'
    : keyboard.status || 'Choose a key to change it. Your bindings save with your progress.';
  for (const action of Object.keys(KEYBOARD_ACTIONS))
    for (let slot = 0; slot < 2; slot++) {
      const button = T('keyboard-' + action + '-' + slot),
        listening = keyboard.binding?.action === action && keyboard.binding?.slot === slot;
      button.textContent = listening ? 'PRESS A KEY' : keyLabel(action, slot);
      button.classList.toggle('listening', listening);
      button.setAttribute('aria-pressed', String(listening));
      button.setAttribute(
        'aria-label',
        KEYBOARD_ACTIONS[action] +
          ', ' +
          (slot ? 'alternate' : 'primary') +
          ': ' +
          button.textContent
      );
      if (slot) T('keyboard-clear-' + action).disabled = !save.keyboard.bindings[action][1];
    }
  T('keyboardCancel').hidden = !keyboard.binding;
  document.body.classList.toggle('keyboard-binding', !!keyboard.binding);
}
function keyboardCancelBinding(refocus = true) {
  const binding = keyboard.binding;
  if (!binding) return;
  keyboard.binding = null;
  keyboard.status = 'Binding cancelled.';
  clearInput();
  keyboardUpdateSettings();
  if (refocus && T('settings').classList.contains('open'))
    T('keyboard-' + binding.action + '-' + binding.slot)?.focus({ preventScroll: true });
}
function keyboardBeginBinding(action, slot) {
  if (!KEYBOARD_ACTIONS[action] || ![0, 1].includes(slot)) return;
  if (G.state === 'playing') pauseGame(true);
  if (typeof controller !== 'undefined') {
    controller.binding = null;
    controllerUpdateSettings();
  }
  clearInput();
  keyboard.binding = { action, slot };
  keyboard.status = '';
  keyboardUpdateSettings();
}
function keyboardSavePreferences(prefs) {
  save.keyboard = keyboardPreferences(prefs);
  const saved = gameInputReady() && saveNow('keyboard');
  if (!saved)
    keyboard.status += ' Automatic saving is unavailable; export a backup to keep this change.';
  keyboardUpdateSettings();
  keyboardRefreshHelp(true);
  keyboardRefreshPrompts();
}
function keyboardAssignBinding(action, slot, code) {
  if (!KEYBOARD_ACTIONS[action] || ![0, 1].includes(slot) || !keyboardCodeAllowed(code, action))
    return false;
  const prefs = keyboardPreferences(),
    old = prefs.bindings[action][slot];
  let duplicate = null;
  for (const id of Object.keys(KEYBOARD_ACTIONS))
    for (let index = 0; index < 2; index++)
      if ((id !== action || index !== slot) && prefs.bindings[id][index] === code)
        duplicate = { action: id, slot: index };
  if (duplicate && duplicate.slot === 0 && (!old || !keyboardCodeAllowed(old, duplicate.action))) {
    keyboard.status =
      keyboardCodeLabel(code) +
      ' is the primary key for ' +
      KEYBOARD_ACTIONS[duplicate.action] +
      '. Choose an unused key, or change that primary key first.';
    T('keyboardStatus').textContent = keyboard.status;
    return false;
  }
  if (duplicate)
    prefs.bindings[duplicate.action][duplicate.slot] =
      old && keyboardCodeAllowed(old, duplicate.action) ? old : null;
  prefs.bindings[action][slot] = code;
  keyboard.binding = null;
  keyboard.status = KEYBOARD_ACTIONS[action] + ' set to ' + keyboardCodeLabel(code) + '.';
  if (duplicate)
    keyboard.status +=
      old && keyboardCodeAllowed(old, duplicate.action)
        ? ' Swapped with ' + KEYBOARD_ACTIONS[duplicate.action] + '.'
        : ' Moved from ' + KEYBOARD_ACTIONS[duplicate.action] + ' alternate.';
  clearInput();
  keyboardSavePreferences(prefs);
  T('keyboard-' + action + '-' + slot)?.focus({ preventScroll: true });
  return true;
}
function keyboardCaptureBinding(event) {
  const binding = keyboard.binding;
  if (!binding) return;
  if (
    event.ctrlKey ||
    event.altKey ||
    event.metaKey ||
    !keyboardCodeAllowed(event.code, binding.action)
  ) {
    keyboard.status =
      'Choose a single letter, number, arrow, punctuation, Shift, or Space key. Browser shortcuts and menu keys are reserved. Esc cancels.';
    T('keyboardStatus').textContent = keyboard.status;
    return;
  }
  keyboardAssignBinding(binding.action, binding.slot, event.code);
}
let keyboardHelpSignature = '';
function keyboardRefreshHelp(force = false) {
  const prefs = keyboardPreferences(),
    signature = JSON.stringify(prefs);
  if (!force && signature === keyboardHelpSignature) return;
  keyboardHelpSignature = signature;
  const labels = Object.fromEntries(Object.keys(KEYBOARD_ACTIONS).map((id) => [id, keyLabel(id)])),
    movement = ['up', 'left', 'down', 'right'].map((id) => keyLabel(id, 0)).join(' / '),
    quick = T('quickControls');
  if (quick)
    quick.textContent =
      movement +
      ' move · ' +
      labels.bolt +
      ' / click Bolt · ' +
      labels.flare +
      ' / right-click Flare · ' +
      labels.reload +
      ' Rekindle · ' +
      labels.dash +
      ' dash · ' +
      labels.interact +
      ' interact · ' +
      labels.portal +
      ' return · ' +
      labels.pause +
      ' pause · ' +
      labels.mute +
      ' music';
  const guide = document.querySelector('#howto .how-grid'),
    groups = guide ? [...guide.querySelectorAll('.k')] : [];
  if (groups.length >= 10) {
    groups[0].replaceChildren();
    for (const action of ['up', 'left', 'down', 'right']) {
      const key = document.createElement('kbd');
      key.textContent = keyLabel(action, 0);
      groups[0].appendChild(key);
    }
    groups[0].nextElementSibling.textContent =
      'Move · Up ' +
      labels.up +
      ' · Left ' +
      labels.left +
      ' · Down ' +
      labels.down +
      ' · Right ' +
      labels.right;
    for (const [index, action, mouse] of [
      [2, 'dash'],
      [3, 'interact'],
      [4, 'portal'],
      [5, 'pause'],
      [6, 'bolt'],
      [7, 'flare', ' / right click'],
      [8, 'reload'],
      [9, 'mute'],
    ]) {
      const key = document.createElement('kbd');
      key.textContent = labels[action];
      groups[index].replaceChildren(key);
      if (mouse) groups[index].appendChild(document.createTextNode(mouse));
    }
  }
  if (T('cv'))
    T('cv').setAttribute(
      'aria-label',
      'The Seventh Ember dungeon. Keyboard controls: Up ' +
        labels.up +
        ', down ' +
        labels.down +
        ', left ' +
        labels.left +
        ', right ' +
        labels.right +
        ', Ember Bolt ' +
        labels.bolt +
        ', Flare ' +
        labels.flare +
        ', Rekindle ' +
        labels.reload +
        ', dash ' +
        labels.dash +
        ', interact ' +
        labels.interact +
        ', return to a discovered portal ' +
        labels.portal +
        ', pause or resume ' +
        labels.pause +
        ', toggle music ' +
        labels.mute +
        '. Aim with the mouse; hold left click to fire and right click for Flare. On touchscreens, use the left stick to move, hold the right stick to aim and fire, and use the ability buttons.' +
        (typeof controller !== 'undefined' && controllerInput.active
          ? ' Controller: move with the left stick, aim with the right stick. ' +
            T('controllerHint').textContent +
            '.'
          : '')
    );
}
function keyboardRefreshPrompts() {
  if (controllerInput.active) return;
  for (const [selector, action] of [
    ['#btnReload kbd', 'reload'],
    ['#btnMelee kbd', 'flare'],
    ['#portalRecall .portal-key', 'portal'],
    ['#btnPause kbd', 'pause'],
  ]) {
    const el = document.querySelector(selector),
      label = keyLabel(action);
    if (el && el.textContent !== label) el.textContent = label;
  }
  const prompt = T('prompt')?.querySelector('kbd');
  if (prompt && prompt.style.display !== 'none' && !document.body.classList.contains('touch')) {
    const action = prompt.dataset.keyboardAction === 'flare' ? 'flare' : 'interact',
      label = keyLabel(action);
    if (prompt.textContent !== label) prompt.textContent = label;
  }
}
const keyboardValidateSave = validateSave;
validateSave = function (raw) {
  const clean = keyboardValidateSave(raw);
  clean.keyboard = keyboardPreferences(raw?.keyboard);
  return clean;
};
const keyboardSyncSettings = syncSettings;
syncSettings = function () {
  const result = keyboardSyncSettings();
  keyboardUpdateSettings();
  keyboardRefreshHelp();
  keyboardRefreshPrompts();
  return result;
};
const keyboardUpdateHUD = updateHUD;
updateHUD = function (dt) {
  const result = keyboardUpdateHUD(dt);
  keyboardRefreshPrompts();
  return result;
};
const keyboardLoop = loop;
loop = function (now) {
  const result = keyboardLoop(now);
  if (keyboard.binding && !T('settings').classList.contains('open')) keyboardCancelBinding(false);
  keyboardRefreshHelp();
  keyboardRefreshPrompts();
  return result;
};
{
  const section = document.createElement('section');
  section.className = 'keyboard-settings';
  section.setAttribute('aria-labelledby', 'keyboardSettingsTitle');
  section.innerHTML =
    '<header><span>CONTROLS</span><h3 id="keyboardSettingsTitle">Keyboard &amp; mouse</h3></header>' +
    '<p class="keyboard-guide">Choose a primary or alternate key. Keys already in use swap when possible. Mouse aim, left-click Bolt, and right-click Flare stay available.</p>' +
    '<p class="keyboard-guide">Enter, Space, Tab, and Esc navigate menus and dialogue. Esc cancels a key change. Browser shortcuts are reserved.</p>' +
    '<p id="keyboardStatus" role="status" aria-live="polite"></p>' +
    '<div class="keyboard-bindings"><div class="keyboard-columns"><span>Action</span><span>Primary</span><span>Alternate</span></div>' +
    Object.entries(KEYBOARD_ACTIONS)
      .map(
        ([action, label]) =>
          '<div class="keyboard-binding-row"><span>' +
          label +
          '</span>' +
          '<button type="button" id="keyboard-' +
          action +
          '-0"></button>' +
          '<div class="keyboard-alternate"><button type="button" id="keyboard-' +
          action +
          '-1"></button>' +
          '<button type="button" class="keyboard-clear" id="keyboard-clear-' +
          action +
          '" aria-label="Clear alternate key for ' +
          label +
          '">×</button></div></div>'
      )
      .join('') +
    '</div><div class="keyboard-settings-actions"><button type="button" class="btn" id="keyboardDefaults">RESET KEYBOARD KEYS</button>' +
    '<button type="button" class="btn" id="keyboardCancel" hidden>CANCEL KEY CHANGE</button></div>';
  const controllerSection = document.querySelector('.controller-settings');
  if (controllerSection) controllerSection.before(section);
  else T('settingsSave').before(section);
  for (const action of Object.keys(KEYBOARD_ACTIONS)) {
    for (let slot = 0; slot < 2; slot++)
      T('keyboard-' + action + '-' + slot).addEventListener('click', () =>
        keyboardBeginBinding(action, slot)
      );
    T('keyboard-clear-' + action).addEventListener('click', () => {
      keyboardCancelBinding(false);
      const prefs = keyboardPreferences();
      prefs.bindings[action][1] = null;
      keyboard.status = KEYBOARD_ACTIONS[action] + ' alternate key cleared.';
      clearInput();
      keyboardSavePreferences(prefs);
    });
  }
  T('keyboardDefaults').addEventListener('click', () => {
    keyboardCancelBinding(false);
    keyboard.status = 'Default keyboard controls restored.';
    clearInput();
    keyboardSavePreferences({ bindings: KEYBOARD_DEFAULTS });
  });
  T('keyboardCancel').addEventListener('click', () => keyboardCancelBinding());
  T('btnSettingsClose').addEventListener('click', () => keyboardCancelBinding(false));
  document.addEventListener('focusin', (event) => {
    if (keyboardTextEntry(event.target)) clearInput();
  });
  new MutationObserver(() => {
    if (!T('settings').classList.contains('open')) keyboardCancelBinding(false);
  }).observe(T('settings'), { attributes: true, attributeFilter: ['class'] });
  keyboardUpdateSettings();
  keyboardRefreshHelp(true);
  keyboardRefreshPrompts();
}
