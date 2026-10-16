function bakePerfectEmber() {
  SPR.pShard = pxGen(
    9,
    11,
    4,
    (i, j, f) => {
      const cx = 4,
        cy = 5,
        dx = i - cx,
        dy = j - cy,
        diamond = Math.abs(dx) + Math.abs(dy * 0.78);
      const chipped = (f === 1 && i === 1 && j === 5) || (f === 3 && i === 7 && j === 6);
      if (diamond > 4.7 || chipped) return null;
      if (diamond > 3.55) return '#3a2418';
      if (i === 3 && j === 2) return '#ffebb0';
      if (i === 2 && j === 4) return '#ffd484';
      if (i === 5 && j === 7) return '#ad652a';
      if (i === 4 && j === 8) return '#e6a347';
      if (i === 5 && j === 4) return f === 2 ? '#fffef0' : '#fff7cf';
      if (i === 3 && j === 6) return '#ffda7a';
      if (dx < -1.6 || dy > 2.8) return '#9a5d29';
      if (diamond > 2.4) return f % 2 ? '#e7a344' : '#c98032';
      if (dx > 0 && dy < 1) return '#fff1b1';
      if (Math.abs(dx) <= 1 && Math.abs(dy) <= 2) return '#fff9d8';
      return '#ffd06a';
    },
    { fps: 7, sc: 2 }
  );
}

function drawHealingLantern(ctx, o, t) {
  const garden = G.floor >= 6,
    lit = !!o.lit,
    flick = save.motion
      ? 1
      : 0.94 + Math.sin(t * 8.7 + o.x * 0.01) * 0.05 + Math.sin(t * 15.3 + o.y * 0.01) * 0.025;
  const metal = garden ? '#354d40' : '#405361',
    edge = garden ? '#86a06d' : '#91a1a5',
    gold = garden ? '#b5a366' : '#c4a566',
    glass = garden ? '#8fc3a4' : '#b9d1cf';
  glowImg(
    lit ? (garden ? 'teal' : 'ember') : 'gold',
    o.x,
    o.y - 23,
    lit ? 92 : 42,
    lit ? 0.62 : 0.2
  );
  ctx.save();
  ctx.translate(Math.round(o.x), Math.round(o.y));
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#05080baa';
  ctx.fillRect(-28, 22, 56, 8);
  ctx.fillStyle = '#172129';
  ctx.fillRect(-24, 16, 48, 10);
  ctx.fillStyle = metal;
  ctx.fillRect(-20, 10, 40, 11);
  ctx.fillStyle = edge;
  ctx.fillRect(-17, 10, 29, 3);
  ctx.fillStyle = '#111a20';
  ctx.fillRect(-14, -2, 28, 14);
  ctx.fillStyle = '#62777a';
  ctx.fillRect(-18, 12, 7, 1);
  ctx.fillRect(-19, 16, 34, 1);
  ctx.fillStyle = '#23353e';
  ctx.fillRect(-16, 18, 31, 2);
  ctx.fillRect(-21, 22, 42, 2);
  ctx.fillStyle = gold;
  ctx.fillRect(-10, 2, 20, 3);
  ctx.fillRect(-2, 6, 4, 4);
  ctx.fillStyle = '#11181d';
  ctx.fillRect(-23, -45, 6, 57);
  ctx.fillRect(17, -45, 6, 57);
  ctx.fillRect(-20, -51, 40, 6);
  ctx.fillRect(-14, -57, 28, 6);
  ctx.fillStyle = '#263940';
  for (const x of [-9, -3, 3, 9]) ctx.fillRect(x, -55, 2, 3);
  ctx.fillStyle = metal;
  ctx.fillRect(-20, -43, 3, 52);
  ctx.fillRect(17, -43, 3, 52);
  ctx.fillRect(-17, -48, 34, 3);
  ctx.fillStyle = edge;
  ctx.fillRect(-17, -52, 34, 2);
  ctx.fillRect(-11, -58, 22, 2);
  ctx.fillStyle = gold;
  ctx.fillRect(-3, -63, 6, 7);
  ctx.fillRect(-7, -65, 14, 3);
  ctx.fillStyle = '#e6c789';
  ctx.fillRect(-5, -65, 7, 1);
  ctx.fillStyle = '#66523b';
  ctx.fillRect(4, -64, 2, 2);
  ctx.fillStyle = '#0a1014';
  ctx.fillRect(-14, -43, 28, 35);
  ctx.fillStyle = glass + (lit ? '82' : '3d');
  ctx.fillRect(-11, -40, 22, 29);
  ctx.fillStyle = glass + (lit ? 'b0' : '62');
  ctx.fillRect(-9, -38, 4, 23);
  ctx.fillStyle = '#e8f2de55';
  ctx.fillRect(6, -37, 2, 14);
  ctx.fillStyle = metal;
  ctx.fillRect(-15, -44, 30, 4);
  ctx.fillRect(-15, -10, 30, 5);
  ctx.fillRect(-15, -42, 4, 33);
  ctx.fillRect(11, -42, 4, 33);
  ctx.fillRect(-2, -43, 4, 34);
  ctx.fillStyle = '#d9c38c';
  for (const x of [-14, 12]) {
    ctx.fillRect(x, -42, 2, 2);
    ctx.fillRect(x, -11, 2, 2);
  }
  ctx.fillStyle = '#1b2a2f';
  ctx.fillRect(-11, -39, 21, 2);
  ctx.fillStyle = '#edf3d066';
  ctx.fillRect(-8, -34, 1, 8);
  ctx.fillRect(7, -25, 1, 4);
  ctx.fillStyle = '#6c8c8666';
  ctx.fillRect(-8, -17, 4, 1);
  const flameH = Math.round((lit ? 22 : 13) * flick),
    fy = -12 - flameH,
    tip = save.motion ? 0 : Math.round(Math.sin(t * 4.3 + o.x * 0.01) * 1.3);
  ctx.fillStyle = lit ? '#d94e27' : '#70432d';
  ctx.fillRect(-7, fy + 8, 14, flameH - 5);
  ctx.fillStyle = lit ? '#ff913f' : '#a2764f';
  ctx.fillRect(-5, fy + 4, 10, flameH - 6);
  ctx.fillStyle = lit ? '#ffd477' : '#c2a66e';
  ctx.fillRect(-3 + tip, fy, 6, Math.max(3, flameH - 5));
  ctx.fillStyle = lit ? '#fff5c7' : '#dbc991';
  ctx.fillRect(-1 + tip, fy + 5, 3, Math.max(2, flameH - 10));
  ctx.fillStyle = '#321c18';
  ctx.fillRect(-8, -14, 16, 4);
  ctx.fillStyle = '#b7864d';
  ctx.fillRect(-7, -14, 14, 1);
  ctx.fillStyle = '#f1c679';
  ctx.fillRect(-3, -15, 5, 1);
  ctx.fillStyle = '#22292b';
  ctx.fillRect(-1, -16, 2, 3);
  ctx.fillStyle = lit ? '#e9d88e' : '#88794f';
  ctx.fillRect(-2, 13, 4, 8);
  ctx.fillRect(-5, 15, 10, 4);
  ctx.fillStyle = '#fff0b0';
  if (lit) ctx.fillRect(-1, 14, 2, 5);
  if (garden) {
    ctx.fillStyle = '#547550';
    ctx.fillRect(-25, -35, 4, 47);
    ctx.fillRect(21, -24, 4, 36);
    ctx.fillStyle = '#95ac70';
    ctx.fillRect(-28, -29, 10, 4);
    ctx.fillRect(18, -19, 11, 4);
    ctx.fillRect(-26, -3, 9, 4);
  }
  if (lit && !save.motion)
    for (let i = 0; i < 3; i++) {
      const u = (t * (0.32 + i * 0.03) + i * 0.29 + o.x * 0.001) % 1,
        sx = -6 + i * 6 + Math.sin(t * 2 + i) * 2,
        sy = -37 - u * 24;
      ctx.fillStyle = i === 1 ? '#fff2ad' : '#ff9a49';
      ctx.fillRect(Math.round(sx), Math.round(sy), i === 1 ? 2 : 1, i === 1 ? 2 : 1);
    }
  ctx.restore();
}
