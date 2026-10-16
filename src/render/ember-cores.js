const hearthCoreSprites = new Map();
function hearthCorePixel(i, j, frame, frames, id, state) {
  const phase = (frame / frames) * TAU,
    dash = state === 'pDash',
    move = state === 'pMove',
    cx = 9.5,
    cy = 10 + (dash ? 0 : Math.round(Math.sin(phase))),
    dx = i - cx,
    dy = j - cy,
    ax = Math.abs(dx),
    ay = Math.abs(dy),
    pulse = Math.cos(phase),
    spectrum = ['#8ededa', '#d8abf1', '#f1c48c', '#a5bdff'];
  if (dy > 6.6) {
    const length = move ? 11 : dash ? 10 : 8,
      tail = (dy - 6.6) / length,
      sway = Math.sin(j * 0.8 + phase) * (move ? 1.4 : 0.6),
      width = (dash ? 3.1 : move ? 2.8 : 2.2) * (1 - tail * tail * 0.9);
    if (tail > 1 || Math.abs(dx - sway) > width) return null;
    if (id === 'molten') return tail < 0.3 ? '#fff3b3' : tail < 0.65 ? '#ffac4c' : '#c95436';
    if (id === 'starlit') return Math.abs(dx - sway) < 0.65 ? '#dbe8ff' : '#7386c4';
    if (id === 'ghost') return tail < 0.5 ? '#c3f2e3' : 'rgba(139,214,203,.65)';
    if (id === 'prism') return spectrum[Math.min(3, Math.floor(tail * 4))];
    return tail < 0.4 ? '#ffeab0' : tail < 0.75 ? '#e2a651' : '#926244';
  }
  if (id === 'molten') {
    const shell = ax / (dash ? 5.4 : 6.8) + ay / (dash ? 9.2 : 8.4);
    if (shell > 1.12) return null;
    if (shell > 0.97) return '#251b20';
    if (i === 6 && dy > -3 && dy < 0) return '#d4a277';
    if (i === 12 && dy > 2 && dy < 5) return '#4d3030';
    if (dy === -4 && dx > -2 && dx < 2) return '#db8751';
    if (shell > 0.79) return dx < 0 && dy < 1 ? '#c29163' : '#6f463a';
    const seam = ax < 0.85 + pulse * 0.2 || Math.abs(dy + dx * 0.65 - pulse) < 0.8;
    if (seam) return ax < 1 && ay < 3 ? '#fff5cf' : '#ffc367';
    const heart = Math.hypot(dx, dy * 0.8);
    if (heart < 2.4 + pulse * 0.4) return heart < 1.2 ? '#fff0b0' : '#f98b43';
    return dy > 0 ? '#7d382e' : '#ab5838';
  }
  if (id === 'starlit') {
    const shell = ax / 6.2 + ay / (dash ? 9 : 8.6);
    if (shell > 1.12) return null;
    if (shell > 0.98) return '#111429';
    if (i === 6 && dy > -3 && dy < 0) return '#a9b9dc';
    if (i === 12 && dy > 3 && dy < 5) return '#333e66';
    if (i === 8 && dy === -4) return '#c9d4ee';
    if (shell > 0.8) return dx < 0 ? '#7182b4' : '#3b466d';
    if ((ax < 0.65 && ay < 3.5) || (ay < 0.7 && ax < 3)) return '#f2f1de';
    if ((i === 7 && j === 7 + (frame % 2)) || (i === 12 && j === 13 - (frame % 2)))
      return '#adc9ff';
    if ((i === 6 && j === 12) || (i === 13 && j === 6)) return frame % 2 ? '#d1d7fb' : '#7b8ac0';
    if (Math.abs(dy - dx) < 0.8 && ax < 3) return '#647398';
    return '#20243c';
  }
  if (id === 'ghost') {
    const radius = 5.6 + Math.min(1.4, dy * 0.15),
      shell = Math.hypot(dx / radius, dy / (dash ? 9.1 : 8.1));
    if (shell > 1.04) return null;
    if (shell > 0.85) return dx < 0 ? '#d8f4e4' : '#76aaa4';
    if (i === 7 && dy > -4 && dy < -1) return '#e4fff1';
    if (i === 13 && dy > 1 && dy < 4) return '#52948f';
    const hollow = Math.hypot(dx * 1.1, (dy + 0.5) * 0.75);
    if (hollow < 2.2) return '#264c54';
    if (hollow < 3) return '#f0ffdf';
    if (dy > 3 && Math.floor(i + frame) % 4 === 0) return '#83b9ad';
    return dx < 0 ? '#b3e6d5' : '#7fc8bd';
  }
  if (id === 'prism') {
    const shell = ax / (dash ? 5.1 : 6.2) + ay / (dash ? 9.7 : 9);
    if (shell > 1.08) return null;
    if (shell > 0.94) return '#2a2845';
    if (dx < -1 && dy === -3) return '#ddf1e4';
    if (dx > 1 && dy === 4) return '#9c7978';
    if (dx === -2.5 && dy === 1) return '#efe8f6';
    if (ax < 0.65 && ay < 7) return '#f4f1dd';
    const facet = dx < 0 ? (dy < 0 ? 0 : 1) : dy < 0 ? 3 : 2;
    if (shell > 0.76) return ['#88bfbf', '#876cba', '#bc8869', '#717ba8'][facet];
    if (Math.abs(dy + dx) < 0.8 || Math.abs(dy - dx) < 0.8) return '#dce7dd';
    if (Math.abs(dy + dx * 0.6 - pulse * 2) < 0.5 && shell < 0.72) return '#f4f1dd';
    return spectrum[facet];
  }
  const ring = Math.hypot(dx / 6.2, dy / (dash ? 8.8 : 7.8)),
    angle = Math.atan2(dy, dx),
    sector = Math.floor((angle + Math.PI) / (TAU / 8));
  if (ring > 1.22) return null;
  if (ring > 1.03) {
    if (sector % 2 || Math.abs(Math.sin(angle * 4)) > 0.25) return null;
    return '#d5a763';
  }
  if (ring > 0.86) return '#574030';
  if (i === 6 && dy > -4 && dy < -1) return '#f9d99b';
  if (i === 13 && dy > 1 && dy < 4) return '#8c623e';
  if (ring < 0.44) return '#151823';
  if (ring < 0.57) return '#715341';
  if ((sector + frame) % 4 === 0 && ring > 0.7) return '#8b6042';
  return ring < 0.73 ? '#fff0b0' : dx < 0 ? '#f1cc79' : '#be8c47';
}
function hearthCoreSpriteName(id, state) {
  if (id === 'ember' || !hearthCoreUnlocked(id) || !['pIdle', 'pMove', 'pDash'].includes(state))
    return state;
  const source = SPR[state];
  if (!source) return state;
  const name = 'hearthCore_' + id + '_' + state,
    signature =
      source.W + ':' + source.H + ':' + source.frames.length + ':' + source.fps + ':' + source.sc;
  if (hearthCoreSprites.get(name) !== signature) {
    SPR[name] = pxGen(
      source.W,
      source.H,
      source.frames.length,
      (i, j, frame) => hearthCorePixel(i, j, frame, source.frames.length, id, state),
      { fps: source.fps, sc: source.sc }
    );
    hearthCoreSprites.set(name, signature);
  }
  return name;
}
function drawHearthCore(
  ctx,
  x,
  y,
  id,
  state = 'pIdle',
  time = 0,
  scale = 1,
  rotation = 0,
  alpha = 1
) {
  const name = hearthCoreSpriteName(id, state);
  if (name === state) return false;
  const sprite = SPR[name],
    clock = save.motion ? 0 : time,
    frame =
      ((Math.floor(clock * sprite.fps) % sprite.frames.length) + sprite.frames.length) %
      sprite.frames.length,
    width = sprite.W * sprite.sc * scale,
    height = sprite.H * sprite.sc * scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha *= alpha;
  ctx.drawImage(sprite.frames[frame], -width / 2, -height / 2, width, height);
  ctx.restore();
  return true;
}
let hearthCoreDrawingPlayer = 0;
const hearthCoreDrawPlayer = drawPlayer;
drawPlayer = function (ctx) {
  if (!G.player) return hearthCoreDrawPlayer(ctx);
  hearthCoreDrawingPlayer++;
  try {
    return hearthCoreDrawPlayer(ctx);
  } finally {
    hearthCoreDrawingPlayer--;
  }
};
const hearthCoreDrawSprite = drawSpr;
drawSpr = function (name, ...args) {
  if (hearthCoreDrawingPlayer && G.player && ['pIdle', 'pMove', 'pDash'].includes(name))
    name = hearthCoreSpriteName(hearthData().core, name);
  return hearthCoreDrawSprite(name, ...args);
};
