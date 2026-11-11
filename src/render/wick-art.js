'use strict';

const WICK_FRAMES = new Map();

function makeWickFrame(index = 0, small = false, pose = {}) {
  index = ((index % 12) + 12) % 12;
  const lookX = Math.max(-1, Math.min(1, Math.round(pose.lookX || 0))),
    lookY = Math.max(-1, Math.min(1, Math.round(pose.lookY || 0))),
    mouth = pose.speaking ? (index % 3) + 1 : pose.happy ? 4 : 0,
    blink = !!pose.blink,
    lean = pose.moving ? lookX : 0,
    key = [small ? 'small' : 'full', index, lookX, lookY, mouth, blink, lean, !!pose.alert].join(
      '-'
    );
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
    const flick = [0, 0, 1, 0, 0, -1, 0, 0, 1, 0, -1, 0][index];
    rows.forEach(([left, width], row) => {
      const y = row + 1,
        x = left + (y < 6 ? flick + lean : 0);
      px(x, y, width, 1, '#d96c2b');
      if (width > 2) px(x + 1, y, width - 2, 1, '#ffc45f');
      if (y >= 8 && y <= 12) px(7, y, 2, 1, '#fff0bc');
    });
    const ey = 10 + lookY;
    px(5 + lookX, ey, 1, blink ? 1 : 2, '#70482b');
    px(9 + lookX, ey, 1, blink ? 1 : 2, '#70482b');
    if (mouth) px(7 + lookX, ey + 2, mouth === 4 ? 2 : 1, 1, '#956039');
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
        x = left + (y < 10 ? flick + lean : y < 15 ? lean : 0);
      px(x, y, width, 1, '#d96c2b');
      if (width > 2) px(x + 1, y, width - 2, 1, '#f59b3d');
      if (width > 5) px(x + 2, y, width - 4, 1, '#ffd075');
      if (y >= 16 && y <= 26) {
        const hotWidth = y < 19 ? 2 : y > 24 ? 3 : 4;
        px(15, y, hotWidth, 1, '#fff0bc');
      }
    });
    const ey = 21 + lookY,
      eyesClosed = blink || (mouth === 4 && index % 4 === 0);
    px(12 + lookX, ey, eyesClosed ? 2 : 1, eyesClosed ? 1 : 2, '#80512d');
    px(20 + lookX, ey, eyesClosed ? 2 : 1, eyesClosed ? 1 : 2, '#80512d');
    if (pose.alert && !eyesClosed) {
      px(12 + lookX, ey - 2, 2, 1, '#b77a36');
      px(19 + lookX, ey - 2, 2, 1, '#b77a36');
    }
    if (mouth && mouth !== 4) {
      px(16 + lookX, ey + 3, mouth === 2 ? 2 : 1, mouth === 3 ? 2 : 1, '#956039');
    } else {
      px(16 + lookX, ey + 3, 2, 1, '#b77a46');
      if (mouth === 4) {
        px(15 + lookX, ey + 2, 1, 1, '#b77a46');
        px(18 + lookX, ey + 2, 1, 1, '#b77a46');
      }
    }
    if (index >= 3 && index <= 5) px(16 + flick, 7, 1, 2, '#ffd075');
  }
  if (WICK_FRAMES.size >= 192) WICK_FRAMES.delete(WICK_FRAMES.keys().next().value);
  WICK_FRAMES.set(key, cv);
  return cv;
}

function drawWickCharacter(ctx, x, y, size = 32, time = 0, pose = {}) {
  const still = typeof save !== 'undefined' && save.motion,
    t = still ? 0 : Math.max(0, time),
    line = typeof dialogue !== 'undefined' && dialogue?.lines[dialogue.index],
    speaking =
      pose.speaking ??
      !!(line && /^wick$/i.test(line.speaker) && dialogue.chars < (line.text || '').length),
    blinkClock = t % 4.7,
    blink =
      !still &&
      (blinkClock > 4.48 ||
        (Math.floor(t / 4.7) % 3 === 2 && blinkClock > 0.16 && blinkClock < 0.26)),
    frame = makeWickFrame(still ? 3 : Math.floor(t * (speaking ? 11 : 8)) % 12, size <= 20, {
      ...pose,
      speaking: !still && speaking,
      blink,
    }),
    bob = still ? 0 : Math.sin(t * (speaking ? 5 : 2.6)) * Math.min(1.5, size / 48);
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(frame, Math.round(x - size / 2), Math.round(y - size / 2 + bob), size, size);
  ctx.restore();
}

function drawWickPortrait(canvas, time = 0, pose = null) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d'),
    size = Math.min(canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const span = Math.max(16, Math.floor((size - 12) / 32) * 32 || size - 8);
  const line = typeof dialogue !== 'undefined' && dialogue?.lines[dialogue.index],
    speaking = line && /^wick$/i.test(line.speaker) && dialogue.chars < (line.text || '').length,
    guideSpeaking = typeof wickGuide !== 'undefined' && !!wickGuide.mode;
  drawWickCharacter(
    ctx,
    canvas.width / 2,
    canvas.height / 2,
    span,
    time,
    pose || { speaking: !!speaking || guideSpeaking, lookX: 0, lookY: 0 }
  );
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
