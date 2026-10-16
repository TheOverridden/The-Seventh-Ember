function secretRoomBackdropUrl(key) {
  return 'assets/secret-rooms/' + key + '.png?v=2026101601';
}
function refreshSecretRoomBackdrop() {
  const room = currentSecret(),
    image = T('secretRoomBackdrop');
  if (!room || !image) return;
  const key = room.type + (room.claimed ? '-claimed' : '');
  if (image.dataset.room === key) return;
  image.dataset.room = key;
  image.src = secretRoomBackdropUrl(key);
}
const roomBackdrop = document.createElement('img');
roomBackdrop.id = 'secretRoomBackdrop';
roomBackdrop.alt = '';
roomBackdrop.setAttribute('aria-hidden', 'true');
T('secretRoom').querySelector('.secret-view').prepend(roomBackdrop);
const backdropRenderSecretRoom = renderSecretRoom;
renderSecretRoom = function (...args) {
  refreshSecretRoomBackdrop();
  return backdropRenderSecretRoom.apply(this, args);
};
