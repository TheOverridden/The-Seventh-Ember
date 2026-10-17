(function () {
  if (globalThis.guardianMaterialsApplied) return;
  globalThis.guardianMaterialsApplied = true;
  const touched = new WeakSet();
  const pixel = (c, x, y, w, h, color) => {
    c.fillStyle = color;
    c.fillRect(Math.round(x), Math.round(y), w, h);
  };
  function studs(c, x, y, w, h, light, shadow) {
    for (const [dx, dy] of [
      [0, 0],
      [w - 3, 0],
      [0, h - 3],
      [w - 3, h - 3],
    ]) {
      pixel(c, x + dx, y + dy, 3, 3, shadow);
      pixel(c, x + dx, y + dy, 2, 1, light);
      pixel(c, x + dx, y + dy + 1, 1, 1, light);
    }
  }
  function scratches(c, x, y, w, h, light, dark, seed = 0) {
    for (let i = 0; i < 13; i++) {
      const px = x + ((i * 13 + seed * 7) % Math.max(1, w - 4)),
        py = y + ((i * 7 + seed * 11) % Math.max(1, h - 3));
      pixel(c, px, py, 2 + (i % 3), 1, i % 3 ? dark : light);
      if (i % 4 === 0) pixel(c, px + 1, py + 1, 1, 2, dark);
    }
  }
  function atlas(sprite, kind) {
    if (!sprite) return;
    for (let frameIndex = 0; frameIndex < sprite.frames.length; frameIndex++) {
      const source = sprite.frames[frameIndex];
      if (touched.has(source)) continue;
      const frame = document.createElement('canvas');
      frame.width = source.width * 2;
      frame.height = source.height * 2;
      const draw = frame.getContext('2d');
      draw.imageSmoothingEnabled = false;
      draw.drawImage(source, 0, 0, frame.width, frame.height);
      touched.add(frame);
      sprite.frames[frameIndex] = frame;
      const c = frame.getContext('2d'),
        image = c.getImageData(0, 0, frame.width, frame.height),
        d = image.data;
      for (let y = 1; y < frame.height - 1; y++)
        for (let x = 1; x < frame.width - 1; x++) {
          const i = (y * frame.width + x) * 4;
          if (
            d[i + 3] !== 255 ||
            d[i - 1] !== 255 ||
            d[i + 7] !== 255 ||
            d[i - frame.width * 4 + 3] !== 255 ||
            d[i + frame.width * 4 + 3] !== 255
          )
            continue;
          const r = d[i],
            g = d[i + 1],
            b = d[i + 2];
          let color;
          if (kind === 'warden') {
            const steel = b >= r && g > 38 && r < 185;
            const pale = r > 100 && g > 110 && b > 110 && Math.abs(r - g) < 30;
            if ((steel || pale) && (x * 7 + y * 11) % 23 === 0)
              color = steel ? [113, 132, 137] : [207, 207, 184];
            if (steel && y % 12 === 6 && x % 9 === 4) color = [31, 48, 61];
            if (
              y > 10 &&
              y < 40 &&
              Math.abs(x - frame.width / 2) > 8 &&
              (x + y * 3) % 17 === 0 &&
              pale
            )
              color = [151, 164, 158];
            if (pale && x % 8 === 1 && y % 7 === 3) color = [227, 224, 196];
            if (steel && y > 38 && y < 68 && (x * 2 + y) % 21 === 0) color = [141, 150, 140];
          } else if (kind === 'matriarch') {
            const bark = g > r * 1.03 && g > b && g > 45;
            const rose = r > g * 1.12 && b > g && r > 125;
            if (bark && (x * 3 + y) % 17 === 0) color = [42, 66, 45];
            if (bark && (x * 7 + y * 3) % 23 === 0) color = [144, 158, 104];
            if (rose && (x * 3 + y * 5) % 17 === 0) color = [233, 187, 191];
            if (rose && (x - y + 96) % 13 === 0) color = [143, 88, 112];
          } else if (kind === 'roots' && g > 65) {
            if ((x * 3 + y) % 9 === 0) color = [159, 168, 116];
            if ((x + y * 5) % 11 === 0) color = [43, 66, 44];
          }
          if (color) {
            d[i] = color[0];
            d[i + 1] = color[1];
            d[i + 2] = color[2];
          }
        }
      c.putImageData(image, 0, 0);
    }
  }
  const oldWardenBaker = bakeWardenPoses;
  bakeWardenPoses = function () {
    oldWardenBaker();
    for (const pose of Object.keys(WARDEN_POSES)) atlas(SPR['wardenBody_' + pose], 'warden');
  };
  const oldHollowBaker = bakeHollowSprites;
  bakeHollowSprites = function () {
    oldHollowBaker();
    atlas(SPR.gateWarden, 'warden');
  };
  const oldGardenBaker = bakeGardenSprites;
  bakeGardenSprites = function () {
    oldGardenBaker();
    atlas(SPR.gardenMatriarch, 'matriarch');
    atlas(SPR.gardenMatriarchRoots, 'roots');
  };
  for (const pose of Object.keys(WARDEN_POSES)) atlas(SPR['wardenBody_' + pose], 'warden');
  atlas(SPR.gateWarden, 'warden');
  atlas(SPR.gardenMatriarch, 'matriarch');
  atlas(SPR.gardenMatriarchRoots, 'roots');

  const oldColossusPlate = colossusPlate;
  colossusPlate = function (c, x, y, w, h, color, trim) {
    oldColossusPlate(c, x, y, w, h, color, trim);
    if (w < 13 || h < 12) return;
    scratches(c, x + 4, y + 5, w - 8, h - 8, '#8f6b50', '#3b2b2a', w + h);
    studs(c, x + 2, y + 3, w - 4, h - 6, '#d6ac76', '#2d2326');
  };
  const oldColossusBody = colossusBodyParts;
  colossusBodyParts = function (c, b, p) {
    oldColossusBody(c, b, p);
    const y = -38 + p.brace;
    for (const side of [-1, 1]) {
      pixel(c, side * 24 - 2, y + 18, 4, 10, '#2b2225');
      pixel(c, side * 24 - 1, y + 19, 2, 5, '#9d724f');
      for (let j = 0; j < 3; j++) pixel(c, side * 24 - 3, y + 30 + j * 7, 6, 2, '#bb8b59');
      const x = side * 22 - 5;
      pixel(c, x + 2, y - 7, 6, 2, '#211c20');
      pixel(c, x + 3, y - 4, 2, 8, '#81654c');
    }
    pixel(c, -7, y + 17, 14, 2, '#b88b60');
    pixel(c, -4, y + 20, 8, 2, '#36272a');
    pixel(c, -1, y + 15, 2, 8, '#ddba83');
  };

  const oldBellBody = bellkeeperBodyParts;
  bellkeeperBodyParts = function (c, b, p) {
    oldBellBody(c, b, p);
    const s = b.bs || {},
      clock = save.motion ? 0 : (s.mid?.clock ?? G.tAll),
      swimming = !['windup', 'shift'].includes(s.mode),
      stroke = clock * (swimming ? 3.1 : 1.8),
      dive = p.stage === 'dive' ? p.u : p.stage === 'rise' ? 1 - p.u : 0,
      cast = ['returningToll', 'toll', 'dissonance'].includes(s.kind),
      wind = s.mode === 'windup' ? smoothBoss(1 - s.t / Math.max(0.01, s.duration)) : 0,
      strike = s.mode === 'slam' && cast ? Math.exp(-((s.mid?.age || 0) % 1.28) * 7) : 0;
    c.save();
    c.rotate(s.a || 0);
    for (let j = 0; j < 6; j++) {
      const x = -77 + j * 12,
        y = Math.round(Math.sin(stroke - j * 0.62) * (7 - j * 0.55) - dive * (6 - j) * 2.3),
        r = 6 + j * 1.4;
      for (let k = 0; k < 3; k++) {
        const sy = y - r + 5 + k * 4;
        pixel(c, x + 2 + (k % 2) * 3, sy, 4, 1, k ? '#477984' : '#91c3c7');
        pixel(c, x + 5 + (k % 2) * 3, sy + 1, 1, 2, '#1c3b46');
      }
      pixel(c, x + 1, y + r - 2, 7, 1, '#16323d');
    }
    const headY = Math.round(Math.sin(stroke - 4.2) * 1.5 + wind * 4 - strike * 3);
    c.translate(0, headY);
    c.rotate(-wind * 0.09 + strike * 0.12);
    for (let j = 0; j < 4; j++) {
      pixel(c, 7 + j * 7, -4 + (j % 2) * 3, 5, 1, '#588b95');
      pixel(c, 9 + j * 7, -3 + (j % 2) * 3, 2, 2, '#173741');
      pixel(c, 12 + j * 7, 7 + (j % 2) * 2, 3, 1, '#84aeb5');
    }
    pixel(c, 31, -20, 4, 2, '#9dbfc0');
    pixel(c, 35, -17, 5, 1, '#548a96');
    pixel(c, 24, -23, 3, 2, '#274c59');
    for (let j = 0; j < 3; j++) {
      const swing = save.motion
        ? 0
        : Math.sin(stroke - j * 0.48) * 0.11 + strike * (j - 1) * 0.44 - wind * 0.16;
      c.save();
      c.translate(-2 + j * 16, -30 + Math.abs(j - 1) * 5);
      c.rotate(swing);
      pixel(c, -5, 8, 10, 1, '#e0bd78');
      pixel(c, -5, 15, 11, 1, '#6b4a25');
      pixel(c, -3, 12, 6, 1, '#d4b06a');
      pixel(c, -1, 10, 2, 5, '#795729');
      pixel(c, -2, 12, 4, 1, '#f2d59a');
      c.restore();
    }
    c.restore();
  };

  const oldLens = astronomerLens;
  astronomerLens = function (c, b, x, y, a, size, charge, broken) {
    oldLens(c, b, x, y, a, size, charge, broken);
    c.save();
    c.translate(Math.round(x), Math.round(y));
    c.rotate(a);
    pixel(c, -size + 4, -size - 2, Math.max(2, size - 1), 1, '#adc5c8');
    pixel(c, -size + 1, size, size, 1, '#4a7185');
    for (let j = 0; j < 3; j++)
      pixel(c, size - 1, -size + j * Math.max(2, Math.floor(size / 2)), 2, 1, '#8ea8ac');
    if (!broken) {
      pixel(c, -1, -size + 2, 2, 2, '#e8faff');
      pixel(c, 2, -size + 5, 1, 3, '#739eaf');
    }
    c.restore();
  };
  const oldRing = astronomerRing;
  astronomerRing = function (c, b, p, index, front) {
    oldRing(c, b, p, index, front);
    c.save();
    c.rotate(p.ring[index]);
    for (let j = 0; j < 24; j++) {
      const a = (j * TAU) / 24,
        y = Math.sin(a) * p.tilt[index];
      if (y >= 0 !== front || j % 3 === 0) continue;
      pixel(c, Math.cos(a) * (42 + index * 13), y, 1, 2, j % 2 ? '#7fabb9' : '#3a5d71');
    }
    c.restore();
  };

  const oldScribe = scribeBodyParts;
  scribeBodyParts = function (c, b, p) {
    oldScribe(c, b, p);
    const fold = p.fold,
      left = -40 + fold * 0.48;
    for (let j = 0; j < 6; j++) {
      const x = -31 + j * 12 + (2.5 - j) * fold * 0.18,
        y = 17 + p.leaves[j];
      for (let k = 0; k < 3; k++) {
        pixel(c, x - 2, y + 18 + k * 3, 4 - (k % 2), 1, '#7a675f');
        pixel(c, x + 2, y + 18 + k * 3, 1, 1, '#b9a17d');
      }
      pixel(c, x - 4, y + 2, 1, 12, '#e8d8b1');
    }
    for (let j = 0; j < 4; j++) {
      const x = left + 13 + j * 9,
        y = -12 + j * 4 + p.shoulder;
      pixel(c, x, y, 5 + (j % 2) * 2, 1, '#725e65');
      pixel(c, x + 2, y + 3, 3, 1, '#b3a085');
      pixel(c, x + 4, y + 6, 2, 1, '#584651');
    }
    c.save();
    c.translate(24 + p.quillX, -14 + p.quillY);
    c.rotate(p.quill);
    for (let j = 0; j < 6; j++) {
      pixel(c, 2, -28 + j * 5, 3 + (j % 2), 1, '#bda98b');
      pixel(c, -3, -29 + j * 5, 2, 1, '#f2e3bc');
    }
    pixel(c, -2, 24, 5, 2, '#5e4c56');
    pixel(c, -2, 28, 5, 2, '#c9b18d');
    c.restore();
  };

  const oldRegent = drawRegentRefinedBody;
  drawRegentRefinedBody = function (c, b, frame) {
    oldRegent(c, b, frame);
    const blade = b.twinRole === 'blade',
      p = (blade ? REGENT_BLADE_FRAMES : REGENT_BELL_FRAMES)[frame],
      [hipX, hipY, headX, headY, turn, arm, , , , hemA, hemB] = p,
      duet = b.bs?.duet,
      facing =
        duet?.kind === 'handover'
          ? Math.atan2(duet.relayBy - duet.relayAy, duet.relayBx - duet.relayAx) +
            (blade ? 0 : Math.PI) +
            (duet.clock >= 2.76 ? Math.PI : 0)
          : b.bs?.duetDash?.left > 0
            ? b.bs.duetDash.a
            : b.bs?.a || 0,
      gold = blade ? '#d8b294' : '#bcaed5',
      thread = blade ? '#9c6176' : '#6e6095';
    c.save();
    if (Math.cos(facing) < 0) c.scale(-1, 1);
    c.translate(hipX, hipY);
    for (const side of [-1, 1]) {
      const hem = side < 0 ? hemA : hemB;
      for (let j = 0; j < 5; j++) {
        const x = side * 17 + hem * 0.4,
          y = 12 + j * 4;
        pixel(c, x, y, 2, 1, gold);
        pixel(c, x + side * 2, y + 1, 2, 1, thread);
        pixel(c, x, y + 2, 1, 1, gold);
      }
    }
    c.save();
    c.rotate(turn);
    for (let j = 0; j < 4; j++) {
      pixel(c, -5, -10 + j * 4, 2, 1, gold);
      pixel(c, 4, -10 + j * 4, 2, 1, gold);
    }
    pixel(c, -8, -11, 1, 12, thread);
    pixel(c, 7, -11, 1, 12, thread);
    c.translate(headX, headY);
    pixel(c, -11, -17, 4, 1, '#e2c9ab');
    pixel(c, 7, -17, 4, 1, '#b795aa');
    pixel(c, -7, -6, 2, 3, '#94777d');
    pixel(c, 6, -6, 2, 3, '#94777d');
    pixel(c, -4, -28, 8, 1, '#f1dbb0');
    pixel(c, -2, -36, 4, 3, blade ? '#d89b9c' : '#bca6d4');
    c.restore();
    c.save();
    c.translate(19, -6);
    c.rotate(arm);
    for (let j = 0; j < 3; j++) pixel(c, -3, -3 + j * 4, 6, 1, '#c3a69b');
    c.restore();
    c.restore();
  };

  const oldSeraphWing = seraphWingParts;
  seraphWingParts = function (c, b, p, side) {
    oldSeraphWing(c, b, p, side);
    c.save();
    c.scale(side, 1);
    const stroke = p.release * (p.side === side ? 1 : 0.3),
      shoulder = p.shoulder + p.fold * 1.02 - stroke * 0.24,
      elbow = p.elbow + p.fold * 0.37;
    c.translate(8, -4);
    c.rotate(shoulder);
    pixel(c, 8, -8, 2, 3, '#a8b8da');
    pixel(c, 13, -5, 2, 2, '#58688f');
    pixel(c, 17, -7, 3, 1, '#cad4eb');
    pixel(c, 20, 3, 3, 1, '#475579');
    c.translate(27, -10);
    c.rotate(elbow);
    for (let j = 0; j < 7; j++) {
      const angle = -0.24 + j * 0.085 + p.fan + stroke * 0.2,
        length = 31 - j * 1.6;
      c.save();
      c.translate(1 + j * 3, -9 + j * 3.8);
      c.rotate(angle);
      for (let k = 0; k < 3; k++) {
        pixel(c, 1, 5 + k * 6, 2, 1, '#8f9fca');
        pixel(c, 2, 8 + k * 5, 1, 2, '#515f8b');
      }
      pixel(c, 1, length - 7, 2, 1, '#d6dff6');
      c.restore();
    }
    c.restore();
  };
  const oldSeraphBody = seraphBodyParts;
  seraphBodyParts = function (c, b, p) {
    oldSeraphBody(c, b, p);
    c.save();
    c.translate(0, p.crouch);
    c.rotate(p.roll);
    for (let j = 0; j < 4; j++) {
      pixel(c, -6 + j * 3, 5 + (j % 2) * 2, 2, 1, '#7988ad');
      pixel(c, -5 + j * 3, 11 + (j % 2) * 2, 1, 2, '#c0cce5');
    }
    c.translate(0, p.head);
    for (const side of [-1, 1]) {
      pixel(c, side * 7 - 1, -19, 2, 2, '#93a5c6');
      pixel(c, side * 8 - 1, -9, 2, 3, '#425376');
      pixel(c, side * 6 - 1, -4, 2, 2, '#7c90b7');
    }
    pixel(c, -6, -23, 12, 1, '#7085ab');
    c.save();
    c.translate(0, -34);
    c.rotate(p.halo);
    for (let j = 0; j < 12; j++) {
      const a = (j * TAU) / 12;
      pixel(c, Math.cos(a) * 22, Math.sin(a) * 8, 2, 1, j % 2 ? '#9e8b65' : '#f1d9a3');
    }
    c.restore();
    c.restore();
  };

  const oldTyrant = drawTyrantArt;
  drawTyrantArt = function (c, b) {
    oldTyrant(c, b);
    const p = tyrantBodyPose(b);
    c.save();
    c.translate(0, p.brace - p.recoil);
    for (const side of [-1, 1]) {
      const x = side * 23;
      scratches(c, x - 11, -22, 18, 34, '#775447', '#35272d', side + 2);
      studs(c, x - 13, -25, 23, 49, '#a18361', '#15151e');
      pixel(c, x - 6, -11, 11, 2, '#72513e');
      pixel(c, x - 4, -8, 7, 2, '#3c2d31');
      c.save();
      c.translate(side * 43, -22);
      c.rotate(side * p.hinge);
      for (let j = 0; j < 4; j++) {
        pixel(c, 4, -2 + j * 12, 3, 1, '#d1a273');
        pixel(c, -8, 3 + j * 10, 2, 3, '#41323a');
      }
      c.restore();
    }
    pixel(c, -17, -45 - p.crown, 34, 1, '#a8835f');
    pixel(c, -13, -40 - p.crown, 26, 1, '#45313a');
    for (const side of [-1, 1]) {
      pixel(c, side * 13 - 1, -42 - p.crown, 2, 9, '#654c43');
      pixel(c, side * 12 - 1, -24 - p.crown, 2, 5, '#9a7357');
    }
    for (let j = 0; j < 7; j++) pixel(c, -23 + j * 7, 24, 3, 2, j % 2 ? '#745440' : '#ae895e');
    c.restore();
  };

  const oldKeeper = drawKeeperArt;
  drawKeeperArt = function (c, b) {
    oldKeeper(c, b);
    const p = keeperBodyPose(b),
      phase = b.bs?.phase || 0;
    for (let j = 0; j < 10; j++) {
      const a = p.ring + (j * TAU) / 10,
        parity = j % 2 ? 1 : -1,
        radius = 10 + phase * 2 + p.idle[0] - p.fold * 6;
      c.save();
      c.rotate(a);
      c.translate(radius, 0);
      c.rotate(parity * (p.idle[1] + p.fold * 0.42));
      pixel(c, 18, -5, 12 - p.fold * 3, 1, j % 2 ? '#cda66d' : '#725761');
      pixel(c, 23, -3, 2, 5, '#8f705b');
      pixel(c, 28, -2, 5, 1, '#f4d79a');
      pixel(c, 10, 1, 3, 2, '#b98f68');
      c.restore();
    }
    for (let j = 0; j < 12; j++) {
      const a = (j * TAU) / 12,
        x = Math.cos(a) * 20,
        y = Math.sin(a) * (20 - p.fold * 3);
      pixel(c, x, y, 2, 2, j % 3 ? '#6f5055' : '#d9b888');
    }
    for (const side of [-1, 1]) {
      pixel(c, side * 12 - 1, -5, 2, 6, '#9d7c64');
      pixel(c, side * 10 - 1, 3, 2, 4, '#523b43');
    }
  };

  const oldUnrecorded = drawUnrecordedBodyParts;
  drawUnrecordedBodyParts = function (c, b, frame) {
    oldUnrecorded(c, b, frame);
    const [gap, brow, leftTilt, rightTilt, jaw] = UNRECORDED_MASK_FRAMES[frame];
    pixel(c, -10, -20 + brow, 6, 1, '#58858c');
    pixel(c, 5, -20 + brow, 6, 1, '#57828c');
    pixel(c, -6, -24 + brow, 3, 1, '#b5dcd5');
    pixel(c, 4, -24 + brow, 2, 1, '#719fa1');
    for (const side of [-1, 1]) {
      c.save();
      c.translate(side * (8 + gap), 0);
      c.rotate(side < 0 ? leftTilt : rightTilt);
      pixel(c, side * 11 - 1, -14, 2, 4, '#315563');
      pixel(c, side * 9 - 1, -7, 2, 2, '#8aafbb');
      pixel(c, side * 7 - 1, 1, 2, 4, '#273f50');
      pixel(c, side * 5 - 1, 6, 2, 2, '#9bc2c3');
      c.restore();
    }
    c.save();
    c.translate(0, jaw);
    pixel(c, -13, 22, 4, 1, '#7198a3');
    pixel(c, 10, 22, 4, 1, '#86a5b1');
    pixel(c, -8, 27, 3, 1, '#365568');
    pixel(c, 6, 27, 2, 1, '#365568');
    pixel(c, -1, 34, 2, 2, '#e0d1e5');
    c.restore();
  };

  const oldHammer = hearthGuardianHammer;
  hearthGuardianHammer = function (c, x, y, a, raised, palette) {
    oldHammer(c, x, y, a, raised, palette);
    c.save();
    c.translate(Math.round(x), Math.round(y));
    c.rotate(a);
    pixel(c, -4, -1, 12, 1, palette.edge);
    pixel(c, 12, -8, 9, 1, palette.shadow);
    pixel(c, 12, 4, 9, 1, palette.shadow);
    pixel(c, 17, -12, 2, 5, palette.light);
    pixel(c, 17, 7, 2, 3, palette.edge);
    pixel(c, 24, -7, 2, 4, palette.dark);
    pixel(c, 24, 1, 2, 5, palette.dark);
    c.restore();
  };
  const oldCrucible = drawHearthTrialGuardian;
  drawHearthTrialGuardian = function (c, b) {
    oldCrucible(c, b);
    if (b.dead || !b.crucible) return;
    const s = b.crucible,
      t = save.motion ? 0 : G.tAll,
      open = s.mode === 'recover' || s.mode === 'temper',
      bob = save.motion ? 0 : Math.sin(t * 3.2) * 2,
      p = hearthGuardianPose(b, t, open, bob),
      palette = HEARTH_CRUCIBLE_PALETTE;
    c.save();
    c.translate(Math.round(b.x) + Math.round(p.bodyX), Math.round(b.y) + Math.round(bob + p.bodyY));
    for (const side of [-1, 1]) {
      scratches(c, side < 0 ? -29 : 22, -49, 7, 34, palette.bronze, palette.shadow, side + 3);
      for (let j = 0; j < 5; j++)
        pixel(c, side * 24 - 1, -44 + j * 6, 2, 2, j % 2 ? palette.shadow : palette.edge);
      pixel(c, side * 10 - 2, -61, 4, 1, palette.light);
      pixel(c, side * 7 - 1, -72, 2, 3, palette.shadow);
    }
    for (let j = 0; j < 7; j++)
      pixel(c, -19 + j * 6, -58, 3, 1, j % 2 ? palette.shadow : palette.edge);
    pixel(c, -11, -85, 23, 1, palette.shadow);
    pixel(c, -12, -70, 25, 1, palette.edge);
    pixel(c, -13, 8, 27, 1, palette.shadow);
    pixel(c, -8, 10, 17, 1, palette.light);
    c.restore();
  };
})();
