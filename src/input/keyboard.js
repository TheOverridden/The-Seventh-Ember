const KEYBOARD_DEFAULTS = {
  up: ['KeyW', 'ArrowUp'],
  down: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  bolt: ['KeyJ', null],
  flare: ['KeyK', null],
  reload: ['KeyR', null],
  dash: ['Space', null],
  interact: ['KeyE', null],
  portal: ['KeyQ', null],
  pause: ['Escape', 'KeyP'],
  mute: ['KeyM', null],
};
const KEYBOARD_ACTIONS = {
  up: 'Move up',
  down: 'Move down',
  left: 'Move left',
  right: 'Move right',
  bolt: 'Ember Bolt',
  flare: 'Flare',
  reload: 'Rekindle',
  dash: 'Dash',
  interact: 'Interact',
  portal: 'Return to portal',
  pause: 'Pause / resume',
  mute: 'Toggle music',
};
const keyboard = {
  binding: null,
  held: new Set(),
  blocked: new Set(),
  pressed: new WeakSet(),
  rejected: new WeakSet(),
  status: '',
};
function keyboardSavedPreferences() {
  try {
    return typeof save === 'undefined' ? null : save.keyboard;
  } catch (_) {
    return null;
  }
}
function keyboardCodeAllowed(code, action) {
  return (
    typeof code === 'string' &&
    (code === 'Escape'
      ? action === 'pause'
      : /^(Key[A-Z]|Digit[0-9]|Numpad[0-9]|Numpad(?:Add|Subtract|Multiply|Divide|Decimal)|Arrow(?:Up|Down|Left|Right)|Space|Shift(?:Left|Right)|Bracket(?:Left|Right)|Backslash|Semicolon|Quote|Comma|Period|Slash|Minus|Equal|Backquote|Home|End|PageUp|PageDown)$/.test(
          code
        ))
  );
}
function keyboardPreferences(raw = keyboardSavedPreferences()) {
  const bindings = {},
    used = new Set(),
    missing = new Set();
  for (const action of Object.keys(KEYBOARD_DEFAULTS)) {
    const candidate = raw?.bindings?.[action],
      pair = Array.isArray(candidate) ? candidate.slice(0, 2) : [];
    bindings[action] = [null, null];
    for (let slot = 0; slot < 2; slot++) {
      const code = pair[slot];
      if (keyboardCodeAllowed(code, action) && !used.has(code)) {
        bindings[action][slot] = code;
        used.add(code);
      }
    }
    if (!bindings[action][0]) {
      if (bindings[action][1]) {
        bindings[action][0] = bindings[action][1];
        bindings[action][1] = null;
      } else missing.add(action);
    }
  }
  const spare = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ', (letter) => 'Key' + letter).concat(
    Array.from('0123456789', (digit) => 'Digit' + digit)
  );
  for (const action of missing) {
    const primary =
      KEYBOARD_DEFAULTS[action].find((code) => code && !used.has(code)) ||
      spare.find((code) => !used.has(code));
    bindings[action][0] = primary;
    used.add(primary);
    const alternate = KEYBOARD_DEFAULTS[action][1];
    if (alternate && alternate !== primary && !used.has(alternate)) {
      bindings[action][1] = alternate;
      used.add(alternate);
    }
  }
  return { bindings };
}
function keyboardCodeLabel(code) {
  if (!code) return 'Unassigned';
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit[0-9]$/.test(code)) return code.slice(5);
  if (/^Numpad/.test(code)) return 'Num ' + code.slice(6);
  return (
    {
      ArrowUp: '↑',
      ArrowDown: '↓',
      ArrowLeft: '←',
      ArrowRight: '→',
      Escape: 'Esc',
      Space: 'Space',
      ShiftLeft: 'Left Shift',
      ShiftRight: 'Right Shift',
      BracketLeft: '[',
      BracketRight: ']',
      Backslash: '\\',
      Semicolon: ';',
      Quote: "'",
      Comma: ',',
      Period: '.',
      Slash: '/',
      Minus: '-',
      Equal: '=',
      Backquote: '`',
      PageUp: 'Page Up',
      PageDown: 'Page Down',
    }[code] || code
  );
}
function keyLabel(action, slot) {
  const pair = keyboardPreferences().bindings[action] || [];
  return Number.isInteger(slot)
    ? keyboardCodeLabel(pair[slot])
    : pair.filter(Boolean).map(keyboardCodeLabel).join(' / ');
}
function keyboardTextEntry(target) {
  return !!(
    target &&
    (['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName) ||
      target.isContentEditable ||
      target.closest?.('[contenteditable]:not([contenteditable="false"]),[role="textbox"]'))
  );
}
function keyboardInputBlocked(event) {
  return !!(
    keyboard.binding ||
    keyboardTextEntry(event?.target || document.activeElement) ||
    (event && (event.ctrlKey || event.altKey || event.metaKey || keyboard.rejected.has(event))) ||
    [...keyboard.held].some((code) => /^(Control|Alt|Meta)(Left|Right)$/.test(code))
  );
}
function keyboardActionDown(action) {
  if (keyboardInputBlocked() || typeof keys === 'undefined') return false;
  return (keyboardPreferences().bindings[action] || []).some(
    (code) => code && keys[code] && !keyboard.blocked.has(code)
  );
}
function keyboardActionPressed(event, action) {
  return !!(
    event &&
    !event.repeat &&
    keyboard.pressed.has(event) &&
    !keyboardInputBlocked(event) &&
    !keyboard.blocked.has(event.code) &&
    keyboardPreferences().bindings[action]?.includes(event.code)
  );
}
function keyboardRelease() {
  for (const code of keyboard.held) keyboard.blocked.add(code);
}
addEventListener(
  'keydown',
  (event) => {
    const wasHeld = keyboard.held.has(event.code);
    keyboard.held.add(event.code);
    if (keyboard.binding) {
      event.preventDefault();
      event.stopImmediatePropagation();
      keyboard.blocked.add(event.code);
      if (event.code === 'Escape') {
        if (typeof keyboardCancelBinding === 'function') keyboardCancelBinding();
      } else if (!event.repeat && !wasHeld && typeof keyboardCaptureBinding === 'function')
        keyboardCaptureBinding(event);
      return;
    }
    if (keyboardInputBlocked(event)) {
      keyboard.rejected.add(event);
      keyboard.blocked.add(event.code);
      if (typeof clearInput === 'function') clearInput();
      return;
    }
    if (!event.repeat && !wasHeld && !keyboard.blocked.has(event.code)) keyboard.pressed.add(event);
    else {
      keyboard.rejected.add(event);
      if (
        typeof G !== 'undefined' &&
        G.state === 'playing' &&
        !anyBlockingOverlay() &&
        Object.values(keyboardPreferences().bindings).some((pair) => pair.includes(event.code))
      )
        event.preventDefault();
    }
  },
  true
);
addEventListener(
  'keyup',
  (event) => {
    keyboard.held.delete(event.code);
    keyboard.blocked.delete(event.code);
    if (typeof keys !== 'undefined') keys[event.code] = false;
  },
  true
);
addEventListener('blur', () => {
  keyboardRelease();
  keyboard.held.clear();
  if (typeof keyboardCancelBinding === 'function') keyboardCancelBinding(false);
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;
  keyboardRelease();
  keyboard.held.clear();
  if (typeof keyboardCancelBinding === 'function') keyboardCancelBinding(false);
});
