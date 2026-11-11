'use strict';

const WICK_FRAMES = new Map();

function makeWickFrame(index = 0, small = false) {
  const key = (small ? 'small-' : 'full-') + index;
  if (WICK_FRAMES.has(key)) return WICK_FRAMES.get(key);
  const cv = document.createElement('canvas');
  cv.width = cv.height = small ? 16 : 32;
  const ctx = cv.getContext('2d');
  const px = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };
  if (small) {
    const rows = [
      [8, 1],
      [8, 1],
      [7, 2],
      [7, 2],
      [6, 3],
      [6, 4],
      [5, 5],
      [5, 6],
      [4, 7],
      [4, 7],
      [4, 7],
      [5, 6],
      [5, 5],
      [6, 3],
    ];
    rows.forEach(([left, width], row) => {
      const y = row + 1;
      px(left, y, width, 1, '#d96c2b');
      if (width > 2) px(left + 1, y, width - 2, 1, '#ffc45f');
      if (y >= 8 && y <= 12) px(7, y, 2, 1, '#fff0bc');
    });
  } else {
    const flick = [0, 0, 1, 1, 0, 0, -1, -1, 0, 1, 0, 0][index % 12];
    const rows = [
      [17, 1],
      [16, 2],
      [16, 2],
      [15, 3],
      [15, 3],
      [14, 4],
      [14, 4],
      [13, 5],
      [13, 6],
      [12, 7],
      [12, 7],
      [11, 9],
      [11, 10],
      [10, 11],
      [10, 12],
      [9, 13],
      [9, 13],
      [9, 14],
      [9, 14],
      [10, 13],
      [10, 12],
      [11, 11],
      [11, 10],
      [12, 8],
      [13, 6],
      [14, 4],
    ];
    rows.forEach(([left, width], row) => {
      const y = row + 3,
        x = left + (y < 10 ? flick : 0);
      px(x, y, width, 1, '#d96c2b');
      if (width > 2) px(x + 1, y, width - 2, 1, '#f59b3d');
      if (width > 5) px(x + 2, y, width - 4, 1, '#ffd075');
      if (y >= 16 && y <= 26) {
        const hotWidth = y < 19 ? 2 : y > 24 ? 3 : 4;
        px(15, y, hotWidth, 1, '#fff0bc');
      }
    });
    const blink = index === 10;
    px(12, 21, 1, blink ? 1 : 2, '#80512d');
    px(20, 21, 1, blink ? 1 : 2, '#80512d');
    if (index >= 3 && index <= 5) px(16 + flick, 7, 1, 2, '#ffd075');
  }
  WICK_FRAMES.set(key, cv);
  return cv;
}

function drawWickCharacter(ctx, x, y, size = 32, time = 0) {
  const still = typeof save !== 'undefined' && save.motion;
  const frame = makeWickFrame(still ? 3 : Math.floor(time * 8) % 12, size <= 20);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frame, Math.round(x - size / 2), Math.round(y - size / 2), size, size);
  ctx.restore();
}

function drawWickPortrait(canvas, time = 0) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d'),
    size = Math.min(canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const span = Math.max(16, Math.floor((size - 12) / 32) * 32 || size - 8);
  drawWickCharacter(ctx, canvas.width / 2, canvas.height / 2, span, time);
}

if (typeof wickGuideDrawPortrait === 'function') wickGuideDrawPortrait = drawWickPortrait;
if (typeof drawPortrait === 'function') {
  const wickPreviousPortrait = drawPortrait;
  drawPortrait = function () {
    if (
      typeof dialogue !== 'undefined' &&
      dialogue &&
      /^wick$/i.test(dialogue.lines[dialogue.index]?.speaker)
    ) {
      drawWickPortrait(T('speakerPortrait'), typeof portraitClock === 'number' ? portraitClock : 0);
      return;
    }
    return wickPreviousPortrait();
  };
}
