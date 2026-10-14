function secretRoomButtons() {
  return [...secretOverlay.querySelectorAll('button')].filter(
    (button) => !button.disabled && !button.hidden && button.getClientRects().length
  );
}
const secretRenderControls = renderSecretRoom;
renderSecretRoom = function () {
  const focused = document.activeElement,
    ownedFocus = secretOverlay.contains(focused),
    name = focused?.querySelector('strong')?.textContent,
    previous = secretRoomButtons(),
    index = previous.indexOf(focused),
    out = secretRenderControls();
  if (
    ownedFocus &&
    (!focused.isConnected || focused.disabled || !focused.getClientRects().length)
  ) {
    const buttons = secretRoomButtons(),
      match =
        name && buttons.find((button) => button.querySelector('strong')?.textContent === name);
    (
      match ||
      buttons[Math.max(0, Math.min(index, buttons.length - 1))] ||
      T('secretLeave')
    ).focus();
  }
  return out;
};
document.addEventListener(
  'keydown',
  (event) => {
    if (event.key !== 'Tab' || !secretOverlay.classList.contains('open')) return;
    const buttons = secretRoomButtons();
    if (!buttons.length) return;
    event.preventDefault();
    const index = buttons.indexOf(document.activeElement),
      next = event.shiftKey
        ? index <= 0
          ? buttons.length - 1
          : index - 1
        : (index + 1) % buttons.length;
    buttons[next].focus();
  },
  true
);
