const keys = {};
const mouse = { x: 0, y: 0, down: false };
const touchInput = {
  moveX: 0,
  moveY: 0,
  aimX: 0,
  aimY: 0,
  aimActive: false,
  fire: false,
  movePointer: null,
  aimPointer: null,
};
const controllerInput = { moveX: 0, moveY: 0, aimX: 1, aimY: 0, active: false, fire: false };
let interactQueued = false,
  dashQueued = false,
  dashBufferT = 0;
function queueDash() {
  dashQueued = true;
  dashBufferT = 0.16;
}
function gameInputReady() {
  return typeof G !== 'undefined' && G.state !== 'boot';
}
function saveOnExit() {
  if (gameInputReady()) saveNow();
}
addEventListener('keydown', (e) => {
  if (!gameInputReady()) return;
  if (keyboardInputBlocked(e)) return;
  if (
    G.state === 'playing' &&
    !anyBlockingOverlay() &&
    Object.values(keyboardPreferences().bindings).some((pair) => pair.includes(e.code))
  )
    e.preventDefault();
  if (e.repeat || keys[e.code]) return;
  keys[e.code] = true;
  initAudio();
  const blocking = anyBlockingOverlay();
  if (e.code === 'Escape' && (G.state !== 'playing' || blocking)) {
    onEscKey();
    return;
  }
  if (blocking) return;
  if (keyboardActionPressed(e, 'mute')) toggleMusic();
  if (keyboardActionPressed(e, 'pause') && ['playing', 'paused'].includes(G.state)) {
    onEscKey();
    return;
  }
  if (G.state === 'playing') {
    if (keyboardActionPressed(e, 'dash')) queueDash();
    if (keyboardActionPressed(e, 'interact')) interactQueued = true;
  }
  if (G.state === 'levelup') {
    if (e.code === 'Digit1' || e.code === 'Numpad1') chooseCard(0);
    if (e.code === 'Digit2' || e.code === 'Numpad2') chooseCard(1);
    if (e.code === 'Digit3' || e.code === 'Numpad3') chooseCard(2);
  }
  if (G.state === 'menu' && e.code === 'Enter' && e.target === document.body) requestStart();
});
addEventListener('keyup', (e) => {
  keys[e.code] = false;
});
addEventListener('blur', () => {
  if (!gameInputReady()) return;
  clearInput();
  if (G.state === 'playing') pauseGame(true);
  saveNow();
});
addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
addEventListener('mousedown', (e) => {
  if (!gameInputReady()) return;
  if (
    e.button === 0 &&
    e.target.id === 'cv' &&
    G.state === 'playing' &&
    !keyboardInputBlocked(e) &&
    !anyBlockingOverlay()
  ) {
    mouse.down = true;
    initAudio();
  }
});
addEventListener('mouseup', (e) => {
  if (e.button === 0) mouse.down = false;
});
addEventListener('contextmenu', (e) => {
  if (e.target.id === 'cv') e.preventDefault();
});
document.addEventListener('visibilitychange', () => {
  if (!gameInputReady()) return;
  if (document.hidden) {
    clearInput();
    if (G.state === 'playing') pauseGame(true);
    saveNow();
    if (AC) AC.suspend().catch(() => {});
  } else if (AC) AC.resume().catch(() => {});
});
addEventListener('pagehide', saveOnExit);
addEventListener('beforeunload', saveOnExit);
