const TITLE_WIDTH = 192;
const TITLE_HEIGHT = 156;
const TITLE_TORCHES = [47, 145];
let titleRoomArt;

function paintTitleRoom() {
  const canvas = document.createElement('canvas');
  canvas.width = TITLE_WIDTH;
  canvas.height = TITLE_HEIGHT;
  const ctx = canvas.getContext('2d');
  const pixel = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  pixel(0, 0, TITLE_WIDTH, TITLE_HEIGHT, '#100e0f');
  const flags = ['#332c2a', '#38302c', '#3b322e', '#3e3530'];
  for (let y = 47; y < 145; y++) {
    const corner = Math.max(0, 8 - Math.min(y - 47, 144 - y));
    pixel(13 + corner, y, 166 - corner * 2, 1, '#211c1b');
  }
  for (let row = 0; row < 8; row++) {
    const y = 49 + row * 11;
    for (let column = -1; column < 10; column++) {
      const tile = 17 + column * 18 - (row % 2) * 9;
      const x = Math.max(tile, 16);
      const end = Math.min(tile + 17, 176);
      if (end <= x) continue;
      const color = flags[(row * 3 + (column + 1) * 7 + row * column + 52) % flags.length];
      pixel(x, y, end - x, 10, color);
      pixel(x, y + 9, end - x, 1, '#2e2624');
      if ((column + row * 2) % 4 === 1 && end - x > 10) {
        pixel(x + 4, y + 3, 3, 1, '#292122');
        pixel(x + 7, y + 4, 2, 1, '#292122');
      }
    }
  }
  pixel(17, 137, 158, 2, '#514035');
  pixel(21, 139, 150, 3, '#2a2423');
  for (let x = 28; x < 167; x += 17) pixel(x, 139, 1, 3, '#191717');

  pixel(15, 41, 162, 22, '#222021');
  for (let row = 0; row < 3; row++) {
    for (let x = 16 - (row % 2) * 6; x < 176; x += 13) {
      const left = Math.max(16, x);
      const width = Math.min(x + 12, 176) - left;
      pixel(left, 42 + row * 6, width, 5, (x + row) % 3 ? '#443b34' : '#4c4239');
    }
  }
  pixel(15, 41, 162, 1, '#756451');
  pixel(15, 59, 162, 2, '#54463a');
  pixel(17, 61, 158, 2, '#171516');

  const arch = (top, base, width, color) => {
    const crown = [7, 11, 14, 16, 18, 20, 21, 22, 23, 24];
    for (let offset = 0; offset < crown.length; offset++) {
      const half = Math.round((crown[offset] / 24) * width);
      pixel(96 - half, top + offset, half * 2, 1, color);
    }
    pixel(96 - width, top + crown.length, width * 2, base - top - crown.length, color);
  };
  arch(12, 67, 26, '#191718');
  arch(13, 65, 24, '#776654');
  arch(15, 65, 21, '#51453b');
  arch(17, 64, 19, '#241f20');
  arch(20, 63, 17, '#424039');

  for (const [x, y, w, h] of [
    [83, 25, 2, 37],
    [89, 22, 1, 40],
    [93, 21, 1, 41],
    [100, 22, 1, 40],
    [106, 24, 2, 38],
  ]) {
    pixel(x, y, w, h, '#33322d');
  }
  for (const y of [33, 48]) {
    pixel(79, y, 16, 2, '#6a5541');
    pixel(97, y, 16, 2, '#665541');
  }
  pixel(94, 21, 3, 42, '#1c1a1a');
  pixel(96, 39, 1, 24, '#b77a46');
  pixel(96, 49, 1, 12, '#e8a663');
  pixel(91, 45, 2, 1, '#af8d61');
  pixel(100, 45, 2, 1, '#a28055');
  pixel(77, 63, 38, 2, '#756049');
  pixel(75, 65, 42, 2, '#342922');

  const oval = (width, height, color) => {
    for (let y = -height; y <= height; y++) {
      const span = Math.floor(width * Math.sqrt(1 - (y / height) ** 2));
      pixel(96 - span, 96 + y, span * 2 + 1, 1, color);
    }
  };
  oval(29, 17, '#272221');
  oval(27, 16, '#8b704e');
  oval(25, 14, '#39302a');
  for (let y = -5; y <= 5; y++) {
    const border = (5 - Math.abs(y)) * 2;
    pixel(95 - border, 96 + y, 2, 1, '#b6905b');
    pixel(95 + border, 96 + y, 2, 1, '#b6905b');
  }

  for (const x of TITLE_TORCHES) {
    pixel(x - 8, 80, 16, 2, '#272020');
    pixel(x - 5, 75, 10, 2, '#926b45');
    pixel(x - 4, 77, 8, 2, '#604333');
    pixel(x - 2, 79, 4, 2, '#74543b');
    pixel(x - 5, 81, 10, 1, '#46332a');
  }
  return canvas;
}

function drawMenuBg() {
  const ctx = G.ctx;
  const t = save.motion ? 0 : G.tAll;
  const portrait = G.w <= 820 && G.h > 520;
  const scale = portrait
    ? Math.max(1.8, (G.w * 0.95) / TITLE_WIDTH)
    : Math.min((G.h * 0.9) / TITLE_HEIGHT, (G.w * 0.61) / TITLE_WIDTH);
  const x = (portrait ? G.w * 0.5 : G.w * 0.72) - (TITLE_WIDTH * scale) / 2;
  const y = portrait ? G.h * 0.18 - TITLE_HEIGHT * scale * 0.41 : (G.h - TITLE_HEIGHT * scale) / 2;
  const frame = save.motion ? -G.tAll : 0;
  if (!titleRoomArt || titleRoomArt.getContext('2d').isContextLost?.())
    titleRoomArt = paintTitleRoom();

  ctx.fillStyle = '#100e0f';
  ctx.fillRect(0, 0, G.w, G.h);
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(titleRoomArt, 0, 0);

  for (const torch of TITLE_TORCHES) {
    glowImg('ember', torch, 74, 18, 0.28);
    drawSpr('flame', torch, 73, 0.45, 0, 1, save.motion ? frame : torch);
  }
  glowImg('ember', 96, 121, 17, 0.18);
  ctx.fillStyle = '#211b1a';
  ctx.fillRect(90, 125, 12, 2);
  drawSpr('pIdle', 96, 120, 0.47, 0, 1, frame);
  for (let i = 0; i < 3; i++) {
    const angle = t * 1.45 + (i * TAU) / 3;
    drawSpr(
      'pShard',
      Math.round(96 + Math.cos(angle) * 11),
      Math.round(119 + Math.sin(angle) * 5),
      0.29,
      0,
      Math.sin(angle) < 0 ? 0.72 : 1,
      frame
    );
  }
  ctx.restore();
}
