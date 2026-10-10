function comboPolygon(ctx, points, fill, stroke) {
  ctx.beginPath();
  points.forEach(([x, y], i) =>
    i ? ctx.lineTo(Math.round(x), Math.round(y)) : ctx.moveTo(Math.round(x), Math.round(y))
  );
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
function comboBlade(ctx, x, y, r, a, ice = false) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(a);
  const points = [];
  for (let i = 0; i < 24; i++) {
    const angle = (i * TAU) / 24,
      rr = ice ? (i % 2 ? r * 0.55 : r * 1.2) : i % 3 === 0 ? r : i % 3 === 1 ? r * 0.72 : r * 0.85;
    points.push([Math.cos(angle) * rr, Math.sin(angle) * rr]);
  }
  comboPolygon(ctx, points, ice ? '#648ca9' : '#9c6a3f', '#1d1723');
  ctx.strokeStyle = ice ? '#e6faff' : '#ffe1a0';
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const a = (i * TAU) / 6;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r * 0.35, Math.sin(a) * r * 0.35);
    ctx.lineTo(Math.cos(a + 0.2) * r * 0.78, Math.sin(a + 0.2) * r * 0.78);
    ctx.stroke();
  }
  comboPolygon(
    ctx,
    [
      [-5, -3],
      [0, -7],
      [5, -3],
      [5, 3],
      [0, 7],
      [-5, 3],
    ],
    '#1d1723',
    ice ? '#b3eaff' : '#efbe71'
  );
  ctx.restore();
}
function comboMoth(ctx, x, y, a, t, fire = false) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(a);
  const wing = 4 + Math.sin(t * 16) * 3;
  comboPolygon(
    ctx,
    [
      [-1, 0],
      [-wing - 5, -7],
      [-wing - 8, -3],
      [-wing - 4, 3],
      [-3, 5],
    ],
    fire ? '#ec9d54' : '#d5d3b7',
    '#645d55'
  );
  comboPolygon(
    ctx,
    [
      [1, 0],
      [wing + 5, -7],
      [wing + 8, -3],
      [wing + 4, 3],
      [3, 5],
    ],
    fire ? '#ffe0a0' : '#fbefc9',
    '#645d55'
  );
  ctx.fillStyle = '#fff8dc';
  ctx.fillRect(-2, -5, 4, 12);
  ctx.fillStyle = fire ? '#d3653b' : '#978b67';
  ctx.fillRect(-1, -3, 2, 8);
  ctx.fillRect(-4, -9, 2, 4);
  ctx.fillRect(2, -9, 2, 4);
  ctx.restore();
}
function comboCrescentArt(ctx, r, eclipsed = false, blood = false) {
  if (eclipsed) {
    ctx.fillStyle = '#14101fee';
    ctx.beginPath();
    ctx.arc(-4, 0, r * 0.85, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = '#796292';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(-4, 0, r * 1.25, r * 0.38, -0.4, 0, TAU);
    ctx.stroke();
  }
  const points = [];
  for (let i = 0; i <= 10; i++) {
    const a = -1.35 + i * 0.27;
    points.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  for (let i = 10; i >= 0; i--) {
    const a = -1.35 + i * 0.27;
    points.push([Math.cos(a) * (r - 6) - 6, Math.sin(a) * (r - 6)]);
  }
  comboPolygon(ctx, points, eclipsed ? '#afa0d4' : blood ? '#ffb3a0' : '#f9e4b3', '#272033');
  ctx.strokeStyle = eclipsed ? '#eee8ff' : blood ? '#ffdfbe' : '#fff7db';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r - 2, -1.25, 1.25);
  ctx.stroke();
}
function drawComboEmblem(ctx, family, x, y, size = 38) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 38, size / 38);
  if (family === 'frost') {
    ctx.strokeStyle = '#cff1ff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((i * TAU) / 6);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -15);
      ctx.moveTo(0, -9);
      ctx.lineTo(-5, -13);
      ctx.moveTo(0, -9);
      ctx.lineTo(5, -13);
      ctx.stroke();
      ctx.restore();
    }
  } else if (family === 'storm')
    comboPolygon(
      ctx,
      [
        [3, -17],
        [-10, 2],
        [-1, 2],
        [-5, 17],
        [11, -4],
        [2, -4],
      ],
      '#fff1c5',
      '#8c91bb'
    );
  else if (family === 'stone') {
    comboPolygon(
      ctx,
      [
        [-17, 13],
        [-10, -5],
        [-3, 3],
        [4, -16],
        [17, 13],
      ],
      '#a18663',
      '#d7be90'
    );
    ctx.strokeStyle = '#ffba58';
    ctx.beginPath();
    ctx.moveTo(4, -12);
    ctx.lineTo(0, 1);
    ctx.lineTo(5, 5);
    ctx.lineTo(2, 14);
    ctx.stroke();
  } else if (family === 'tide') {
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = i === 1 ? '#fff2c3' : '#8bd6d9';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-16, -10 + i * 10);
      ctx.bezierCurveTo(-8, -20 + i * 10, 5, i * 10, 16, -10 + i * 10);
      ctx.stroke();
    }
  } else if (family === 'moon') comboCrescentArt(ctx, 17);
  else if (family === 'blade') comboBlade(ctx, 0, 0, 16, 0);
  else if (family === 'meteor') {
    comboPolygon(
      ctx,
      [
        [-12, 14],
        [-16, 6],
        [-8, -1],
        [14, -17],
        [6, 3],
        [-4, 14],
      ],
      '#ef9e58',
      '#ffdf9b'
    );
    ctx.fillStyle = '#fff0ba';
    ctx.fillRect(-12, 4, 7, 7);
  } else if (family === 'moth') comboMoth(ctx, 0, 2, 0, 0);
  else if (family === 'stitch') {
    ctx.strokeStyle = '#b7d9ec';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(14, 12);
    ctx.lineTo(-14, 12);
    ctx.closePath();
    ctx.stroke();
    for (const [x, y] of [
      [0, -15],
      [14, 12],
      [-14, 12],
    ]) {
      ctx.fillStyle = '#fff1c4';
      ctx.fillRect(x - 3, y - 3, 6, 6);
    }
  } else {
    comboPolygon(
      ctx,
      [
        [0, -17],
        [12, 0],
        [0, 17],
        [-12, 0],
      ],
      '#ac9dc6',
      '#f7e5c5'
    );
    ctx.strokeStyle = '#fff6df';
    ctx.beginPath();
    ctx.moveTo(0, -17);
    ctx.lineTo(0, 17);
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.stroke();
  }
  ctx.restore();
}
const synergyDrawBullets = drawBullets;
drawBullets = function (ctx) {
  const bullets = G.bullets;
  G.bullets = bullets.filter((b) => !b.comboArt);
  try {
    synergyDrawBullets(ctx);
  } finally {
    G.bullets = bullets;
  }
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  for (const b of bullets)
    if (b.comboArt) {
      const a = Math.atan2(b.vy, b.vx);
      ctx.save();
      ctx.translate(Math.round(b.x), Math.round(b.y));
      ctx.rotate(a);
      if (b.comboArt === 'hailstone' || b.comboArt === 'whiteout') {
        ctx.fillStyle = '#a2d7ec44';
        ctx.fillRect(-30, -3, 25, 6);
        comboPolygon(
          ctx,
          [
            [-15, -5],
            [-4, -8],
            [15, 0],
            [-4, 8],
            [-15, 5],
          ],
          '#89b9d0',
          '#23374a'
        );
        comboPolygon(
          ctx,
          [
            [-11, -2],
            [-3, -5],
            [15, 0],
            [-4, 2],
          ],
          '#e5faff'
        );
        if (b.comboArt === 'whiteout') {
          ctx.strokeStyle = '#c1eaff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < 7; i++) {
            const x = -18 - i * 6,
              y = Math.sin(G.t * 10 + i) * 7;
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.stroke();
        }
      } else if (b.comboArt === 'moonShard' || b.comboArt === 'eclipse') {
        ctx.globalAlpha = 0.35;
        ctx.translate(-12, 0);
        comboCrescentArt(ctx, b.r + 5, b.eclipsed);
        ctx.translate(12, 0);
        ctx.globalAlpha = 1;
        comboCrescentArt(ctx, b.r + 5, b.eclipsed, blessingComboActive('bloodMoon'));
        ctx.fillStyle = b.eclipsed ? '#c9baf3' : '#ead5a3';
        ctx.fillRect(-18, -2, 6, 4);
      } else if (b.comboArt === 'gearstorm' || b.comboArt === 'sawfire') {
        ctx.rotate(-a);
        if (b.comboArt === 'sawfire') {
          ctx.fillStyle = '#d8853b88';
          ctx.fillRect(-20, -7, 28, 14);
        }
        comboBlade(ctx, 0, 0, 16, G.t * 10, false);
      } else if (b.comboArt === 'moonSplinter')
        comboPolygon(
          ctx,
          [
            [-9, -3],
            [13, 0],
            [-9, 3],
            [-5, 0],
          ],
          '#ffd1b4',
          '#ae5546'
        );
      else if (b.comboArt === 'echoChamber') {
        for (let i = 2; i >= 0; i--) {
          ctx.globalAlpha = 1 - i * 0.3;
          ctx.save();
          ctx.translate(-i * 16, (i % 2 ? 1 : -1) * i * 4);
          comboPolygon(
            ctx,
            [
              [-10, 0],
              [-2, -6],
              [13, 0],
              [-2, 6],
            ],
            '#e7d5a0',
            '#2d253c'
          );
          ctx.fillStyle = '#fff5db';
          ctx.fillRect(-1, -2, 7, 4);
          ctx.restore();
        }
      } else {
        ctx.strokeStyle = '#c3b3df';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-42, -9);
        ctx.lineTo(-9, -3);
        ctx.moveTo(-42, 9);
        ctx.lineTo(-9, 3);
        ctx.stroke();
        comboPolygon(
          ctx,
          [
            [-22, 0],
            [-7, -9],
            [28, 0],
            [-7, 9],
          ],
          '#bbacd7',
          '#2d253c'
        );
        comboPolygon(
          ctx,
          [
            [-7, -7],
            [28, 0],
            [-7, 2],
          ],
          '#fff5db'
        );
        for (const side of [-1, 1])
          comboPolygon(
            ctx,
            [
              [-22, side * 10],
              [-14, side * 16],
              [7, side * 8],
            ],
            '#aa95c6',
            '#e6d4f0'
          );
      }
      ctx.restore();
    }
  ctx.restore();
};
function comboDrawField(ctx, f) {
  const p = G.player,
    age = f.age,
    u = clamp(age / f.max, 0, 1);
  ctx.save();
  ctx.translate(Math.round(f.x), Math.round(f.y));
  if (f.type === 'conductor') {
    if (blessingComboActive('ballLightning')) {
      ctx.fillStyle = '#21172eee';
      ctx.beginPath();
      ctx.arc(0, 0, 19, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = '#dacdf5';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate(G.t * 2 + (i * TAU) / 3);
        ctx.beginPath();
        ctx.ellipse(0, 0, 20, 8, 0, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#fff2c5';
      ctx.fillRect(-4, -4, 8, 8);
    } else {
      comboPolygon(
        ctx,
        [
          [-12, 9],
          [-8, 2],
          [-6, -23],
          [0, -34],
          [6, -23],
          [8, 2],
          [12, 9],
        ],
        '#574c65',
        '#cabce3'
      );
      ctx.fillStyle = '#211b2b';
      ctx.fillRect(-4, -21, 8, 25);
      ctx.fillStyle = '#fff1c5';
      ctx.fillRect(-2, -23, 4, 22);
      for (const y of [-12, -4, 4]) {
        ctx.fillStyle = '#a28aba';
        ctx.fillRect(-10, y, 20, 3);
      }
      if (blessingComboActive('stormglass'))
        for (const side of [-1, 1])
          comboPolygon(
            ctx,
            [
              [side * 6, 5],
              [side * 20, -16],
              [side * 15, 6],
            ],
            '#9ac9df',
            '#e5faff'
          );
    }
    ctx.strokeStyle = '#e2d8f1';
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 10, 24, 8, 0, 0, TAU);
    ctx.stroke();
  } else if (f.type === 'quake') {
    ctx.rotate(f.a);
    const reach = Math.min(1, u) * f.reach;
    ctx.strokeStyle = '#161019';
    ctx.lineWidth = 15;
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 20; x <= reach; x += 20) ctx.lineTo(x, ((x / 20) % 2 ? 1 : -1) * 9);
    ctx.stroke();
    ctx.strokeStyle = blessingComboActive('magmaFault') ? '#fca857' : '#c4af8c';
    ctx.lineWidth = 4;
    ctx.stroke();
    for (let x = Math.max(20, reach - 60); x < reach; x += 16) {
      const h = 12 + Math.sin(x) * 7;
      comboPolygon(
        ctx,
        [
          [x - 6, 8],
          [x - 3, -h],
          [x + 5, -h - 5],
          [x + 10, 6],
        ],
        '#88735b',
        '#d5bb8c'
      );
    }
  } else if (f.type === 'wave') {
    const back = age > 0.85,
      r = f.radius * clamp(back ? 2 - age / 0.85 : age / 0.85, 0, 1),
      ice = blessingComboActive('permafrost');
    ctx.globalAlpha = 0.32;
    ctx.strokeStyle = ice ? '#a8ddf4' : '#559696';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.stroke();
    ctx.globalAlpha = 0.85;
    for (let i = 0; i < 24; i++) {
      const a = (i * TAU) / 24;
      ctx.save();
      ctx.rotate(a);
      ctx.translate(r, 0);
      if (ice)
        comboPolygon(
          ctx,
          [
            [-8, -5],
            [12, -2],
            [-5, 5],
          ],
          '#daf5ff',
          '#7ba4bb'
        );
      else {
        ctx.fillStyle = '#e1efcb';
        ctx.fillRect(-3, -4, 6, 8);
        ctx.fillStyle = '#83c6c4';
        ctx.fillRect(-9, -2, 4, 4);
        ctx.fillRect(5, -2, 4, 4);
      }
      ctx.restore();
    }
  } else if (f.type === 'halo') {
    for (let i = 0; i < 3; i++) {
      const a = G.t * 2.8 + (i * TAU) / 3,
        x = Math.cos(a) * 85,
        y = Math.sin(a) * 85;
      ctx.strokeStyle = blessingComboActive('iceHalo') ? '#bedfea44' : '#e0b27644';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 85, a - 0.6, a);
      ctx.stroke();
      comboBlade(ctx, x, y, 21, G.t * 9, blessingComboActive('iceHalo'));
      if (blessingComboActive('sawfire')) {
        ctx.fillStyle = '#ffbf77';
        for (let j = 0; j < 4; j++)
          ctx.fillRect(x - 6 - j * 5, y - 8 + Math.sin(j + G.t * 8) * 6, 4, 7);
      }
    }
  } else if (f.type === 'meteor') {
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#d09a55';
    ctx.beginPath();
    ctx.ellipse(0, 0, f.radius * 0.6 * (0.5 + u * 0.5), f.radius * 0.25, 0, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
    const lift = (1 - u) * 210,
      dx = (1 - u) * 75;
    ctx.translate(-dx, -lift);
    ctx.rotate(0.35);
    ctx.fillStyle = '#ca683b55';
    ctx.fillRect(-18, -80, 36, 75);
    ctx.fillStyle = '#ed985785';
    ctx.fillRect(-10, -50, 20, 42);
    const r = f.main ? 23 : 15;
    comboPolygon(
      ctx,
      [
        [-r, -7],
        [-r * 0.65, -r],
        [8, -r],
        [r, 0],
        [r * 0.55, r],
        [-10, r],
      ],
      '#875341',
      '#f5b065'
    );
    comboPolygon(
      ctx,
      [
        [-11, -8],
        [-4, -15],
        [8, -12],
        [11, 4],
        [3, 10],
        [-8, 7],
      ],
      '#ffe1a0'
    );
    ctx.fillStyle = '#fff6d3';
    ctx.fillRect(-4, -6, 8, 10);
  } else if (f.type === 'frost') {
    ctx.globalAlpha = Math.min(0.8, f.t);
    ctx.fillStyle = '#9ccddd22';
    ctx.fillRect(-f.radius * 0.6, -f.radius * 0.45, f.radius * 1.2, f.radius * 0.9);
    for (let i = 0; i < 7; i++) {
      const a = i * 2.399,
        r = f.radius * (0.25 + (i % 3) * 0.2);
      comboPolygon(
        ctx,
        [
          [Math.cos(a) * r - 6, Math.sin(a) * r + 7],
          [Math.cos(a) * r - 3, Math.sin(a) * r - 16],
          [Math.cos(a) * r + 5, Math.sin(a) * r - 8],
          [Math.cos(a) * r + 7, Math.sin(a) * r + 7],
        ],
        '#789aac',
        '#d5eff8'
      );
    }
  } else if (f.type === 'magma') {
    const r = f.radius;
    ctx.globalAlpha = Math.min(0.7, f.t);
    comboPolygon(
      ctx,
      [
        [-r, 0],
        [-r * 0.5, -r * 0.65],
        [r * 0.4, -r * 0.7],
        [r, 0],
        [r * 0.6, r * 0.5],
        [-r * 0.7, r * 0.4],
      ],
      '#23171bcc',
      '#674433'
    );
    ctx.strokeStyle = '#ee9754';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const a = (i * TAU) / 5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * r * 0.5 + 4, Math.sin(a) * r * 0.5);
      ctx.lineTo(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85);
      ctx.stroke();
    }
    ctx.fillStyle = '#ffe7a5';
    ctx.fillRect(-4, -3, 8, 6);
  } else if (f.type === 'moths') {
    for (let i = 0; i < f.n; i++) {
      const a = G.t * 2 + (i * TAU) / f.n,
        r = 32 + Math.sin(age * 3 + i) * 6;
      comboMoth(
        ctx,
        Math.cos(a) * r,
        Math.sin(a) * r * 0.65 - 18,
        a + 0.8,
        G.t,
        blessingComboActive('cinderMoths')
      );
    }
  }
  ctx.restore();
}
function comboDrawEffect(ctx, f) {
  const u = clamp(1 - f.t / f.max, 0, 1);
  ctx.save();
  ctx.globalAlpha = Math.sin(Math.PI * (0.1 + u * 0.85));
  if (f.type === 'arc' || f.type === 'strand') {
    const dx = f.x2 - f.x,
      dy = f.y2 - f.y,
      len = Math.max(1, Math.hypot(dx, dy));
    ctx.lineJoin = 'miter';
    ctx.strokeStyle = f.type === 'strand' ? '#b7d2e4' : '#8777b6';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(f.x, f.y);
    for (let i = 1; i <= 8; i++) {
      const t = i / 8,
        off = i === 8 ? 0 : (i % 2 ? 1 : -1) * (8 + Math.sin(u * 8 + i) * 3);
      ctx.lineTo(
        Math.round(f.x + dx * t - (dy / len) * off),
        Math.round(f.y + dy * t + (dx / len) * off)
      );
    }
    ctx.stroke();
    ctx.strokeStyle = '#fff5d5';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (f.type === 'mothDive') {
    const x = lerp(f.x, f.x2, u),
      y = lerp(f.y, f.y2, u);
    comboMoth(ctx, x, y, Math.atan2(f.y2 - f.y, f.x2 - f.x) + Math.PI / 2, G.t, true);
  } else {
    ctx.translate(f.x, f.y);
    const r = (f.radius || 90) * (0.2 + u * 0.8);
    if (f.type === 'shatter' || f.type === 'icebreaker' || f.type === 'thermalShock') {
      for (let i = 0; i < 12; i++) {
        ctx.save();
        ctx.rotate((i * TAU) / 12 + u * 0.3);
        ctx.translate(r, 0);
        const h = 18 * (1 - u) + 5;
        comboPolygon(
          ctx,
          [
            [-h, -4],
            [h, 0],
            [-h, 4],
            [-h / 2, 0],
          ],
          f.type === 'thermalShock' && i % 2 ? '#ffb067' : '#ddf6ff',
          '#7396ac'
        );
        ctx.restore();
      }
      if (f.type === 'thermalShock') {
        const h = r * 0.65;
        comboPolygon(
          ctx,
          [
            [-h * 0.6, h * 0.25],
            [-h * 0.8, -h * 0.2],
            [-h * 0.2, -h],
            [0, -h * 0.35],
            [h * 0.45, -h * 0.8],
            [h * 0.65, h * 0.1],
            [0, h * 0.55],
          ],
          '#ee9354',
          '#ffd794'
        );
        comboPolygon(
          ctx,
          [
            [-h * 0.2, h * 0.2],
            [0, -h * 0.45],
            [h * 0.3, h * 0.2],
          ],
          '#fff0bf'
        );
      }
    } else if (f.type === 'meteorImpact' || f.type === 'collapsedSun' || f.type === 'soulLantern') {
      for (let i = 0; i < 10; i++) {
        ctx.save();
        ctx.rotate((i * TAU) / 10);
        ctx.translate(r, 0);
        comboPolygon(
          ctx,
          [
            [-18, -7],
            [18 * (1 - u), 0],
            [-18, 7],
            [-8, 0],
          ],
          f.type === 'soulLantern' ? '#f5edbf' : '#fac382',
          '#89583d'
        );
        ctx.restore();
      }
      ctx.globalAlpha *= 0.4;
      ctx.strokeStyle = '#ffdfaa';
      ctx.lineWidth = 7 * (1 - u) + 1;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.55, 0, TAU);
      ctx.stroke();
    } else if (f.type === 'bloodMoon' || f.type === 'eclipse') {
      ctx.rotate(u * 2);
      comboCrescentArt(ctx, r, f.type === 'eclipse', f.type === 'bloodMoon');
    } else if (f.type === 'mothWard') {
      const pts = [];
      for (let i = 0; i < 6; i++)
        pts.push([Math.cos((i * TAU) / 6) * r, Math.sin((i * TAU) / 6) * r]);
      comboPolygon(ctx, pts, null, '#ffebb0');
    } else {
      ctx.strokeStyle = f.color || '#ffdaa0';
      ctx.lineWidth = 4 * (1 - u) + 1;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i * TAU) / 8;
        ctx.fillStyle = f.color || '#ffeac4';
        ctx.fillRect(Math.cos(a) * r - 3, Math.sin(a) * r - 3, 6, 6);
      }
    }
  }
  ctx.restore();
}
const synergyDrawCombatFX = drawCombatFX;
drawCombatFX = function (ctx) {
  synergyDrawCombatFX(ctx);
  if (!G.player || !G.run) return;
  const s = blessingComboState();
  ctx.save();
  for (const f of s.fields) comboDrawField(ctx, f);
  for (const e of G.enemies)
    if (!e.dead && blessingChilled(e)) {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.globalAlpha = e.isBoss ? 0.5 : 0.8;
      for (let i = 0; i < 4; i++) {
        const a = (i * TAU) / 4 + 0.4,
          r = e.r + 6,
          x = Math.cos(a) * r,
          y = Math.sin(a) * r;
        comboPolygon(
          ctx,
          [
            [x - 5, y + 6],
            [x - 2, y - 13],
            [x + 4, y - 8],
            [x + 5, y + 6],
          ],
          '#7292a8',
          '#d9f5ff'
        );
      }
      ctx.restore();
    }
  if (blessingComboActive('cinderwheel'))
    for (let i = 0; i < G.player.orbN; i++) {
      const a = G.player.orbA + (i / Math.max(1, G.player.orbN)) * TAU;
      ctx.strokeStyle = '#ec994e';
      ctx.lineWidth = 5;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(G.player.x, G.player.y, 64, a - 0.5, a);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  if (blessingComboActive('collapsedSun'))
    for (const f of G.run.cardFields || [])
      if (f.kind === 'blackHole') {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(G.t * 0.65);
        ctx.fillStyle = '#110d19';
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = '#ffc56f';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(0, 0, 55, 17, -0.35, 0, TAU);
        ctx.stroke();
        for (let i = 0; i < 12; i++) {
          const a = (i * TAU) / 12 + G.t,
            r = 65 + (i % 3) * 20;
          ctx.fillStyle = i % 2 ? '#d89654' : '#fff0bc';
          ctx.fillRect(Math.cos(a) * r - 3, Math.sin(a) * r * 0.65 - 2, 6, 4);
        }
        ctx.restore();
      }
  for (const f of s.effects) comboDrawEffect(ctx, f);
  ctx.restore();
};
