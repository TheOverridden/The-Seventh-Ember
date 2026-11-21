'use strict';

const WICK_FRAMES = new Map();

const WICK_OUTLINE = [
  [18, 18], [17, 18], [16, 18], [16, 19], [15, 19], [14, 19],
  [14, 19], [13, 20], [12, 20], [12, 21], [11, 21], [10, 22],
  [10, 23], [9, 23], [9, 24], [8, 24], [8, 24], [8, 24],
  [9, 23], [9, 23], [10, 22], [11, 21], [12, 20], [14, 18],
];

const WICK_CORE = [
  [16, 16], [15, 16], [15, 16], [14, 17], [14, 17], [13, 18],
  [13, 18], [12, 19], [12, 20], [11, 20], [11, 21], [11, 21],
  [11, 21], [12, 20], [12, 20], [13, 19], [14, 18], [15, 17],
];

const WICK_SMALL = [
  [9, 9], [8, 9], [8, 9], [7, 9], [7, 10], [6, 10], [5, 11],
  [5, 11], [4, 12], [4, 12], [4, 12], [5, 11], [6, 10], [7, 9],
];

function makeWickFrame(index = 0, small = false, pose = {}) {
  index = ((index % 12) + 12) % 12;
  const lookX = Math.max(-1, Math.min(1, Math.round(pose.lookX || 0)));
  const lookY = Math.max(-1, Math.min(1, Math.round(pose.lookY || 0)));
  const mouth = pose.speaking ? [0, 1, 2, 1][index % 4] : pose.happy ? 3 : 0;
  const blink = !!pose.blink;
  const lean = pose.moving ? lookX : 0;
  const key = [small, index, lookX, lookY, mouth, blink, lean, !!pose.alert].join('-');
  if (WICK_FRAMES.has(key)) return WICK_FRAMES.get(key);

  const cv = document.createElement('canvas');
  cv.width = cv.height = small ? 16 : 32;
  const ctx = cv.getContext('2d');
  const px = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };
  const flicker = [0, 1, 1, 2, 1, 0, 0, -1, -2, -1, -1, 0][index] + lean * 2;
  if (small) {
    WICK_SMALL.forEach(([left, right], row) => {
      const shift = Math.round((flicker * Math.max(0, 6 - row)) / 12);
      const y = row + 1;
      const x = left + shift;
      const width = right - left + 1;
      px(x, y, width, 1, row < 6 ? '#eb8a38' : '#a5492b');
      if (width >= 2) px(x, y, width - 1, 1, '#ffa444');
      if (width >= 4) px(x + 1, y, width - 3, 1, row < 6 ? '#ffd481' : '#ffbd62');
      if (width >= 6) px(7, y, row >= 11 ? 2 : 3, 1, '#ffe7a7');
    });
    const eyeY = 9 + lookY;
    px(6 + lookX, eyeY, 1, blink ? 1 : 2, '#60331f');
    px(10 + lookX, eyeY, 1, blink ? 1 : 2, '#60331f');
    if (mouth) px(8 + lookX, eyeY + 2, 1, 1, '#8c4a25');
  } else {
    WICK_OUTLINE.forEach(([left, right], row) => {
      const shift = Math.round((flicker * Math.max(0, 14 - row)) / 14);
      const y = row + 4;
      const x = left + shift;
      const width = right - left + 1;
      const edge = row < 10 ? '#ef8737' : row < 18 ? '#c35a31' : '#9e472c';
      px(x, y, width, 1, edge);
      if (width >= 2) px(x, y, width - 1, 1, row < 16 ? '#ff9d43' : '#ee8239');
      if (width >= 5) px(x + 1, y, width - 3, 1, row < 14 ? '#ffbc5b' : '#fca448');
      if (width >= 9 && row < 22) px(x + 1, y, 1, 1, '#ffd17a');
    });
    WICK_CORE.forEach(([left, right], row) => {
      const shift = Math.round((flicker * Math.max(0, 7 - row)) / 14);
      const x = left + shift;
      const y = row + 9;
      const width = right - left + 1;
      px(x, y, width, 1, row < 12 ? '#ffda83' : '#ffcf76');
      if (width > 2) px(x + 1, y, width - 2, 1, '#ffe5a4');
      if (width > 6 && row >= 7 && row <= 14) px(x + 3, y, width - 6, 1, '#fff2c7');
    });
    const eyeY = 19 + lookY;
    const nearEye = 13 + lookX;
    const farEye = 19 + lookX;
    px(nearEye, eyeY, blink ? 2 : 1, blink ? 1 : 3, '#603420');
    px(farEye, eyeY, blink ? 2 : 1, blink ? 1 : 3, '#603420');
    if (pose.alert && !blink) {
      px(nearEye - 1, eyeY - 2, 2, 1, '#b56632');
      px(farEye, eyeY - 2, 2, 1, '#b56632');
    }
    if (mouth) {
      px(16 + lookX, eyeY + 4, mouth === 1 ? 1 : 2, mouth === 2 ? 2 : 1, '#8c4a25');
      if (mouth === 3) px(18 + lookX, eyeY + 3, 1, 1, '#8c4a25');
    }
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
    frame = makeWickFrame(still ? 0 : Math.floor(t * 9) % 12, size <= 24, {
      ...pose,
      speaking: !still && speaking,
      blink,
    }),
    bob = still ? 0 : Math.sin(t * 2.6) * Math.min(2, size / 36);
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
