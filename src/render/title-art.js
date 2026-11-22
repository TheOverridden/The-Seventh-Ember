function drawMenuBg() {
  const ctx = G.ctx,
    t = save.motion ? 0 : G.tAll,
    portrait = G.w <= 820 && G.h > 520,
    short = G.h <= 520 && G.w > G.h;
  const cx = portrait ? G.w * 0.5 : short ? G.w * 0.78 : G.w * 0.745,
    cy = portrait ? Math.min(184, G.h * 0.22) : G.h * 0.47;
  const unit = portrait ? clamp(G.w / 11, 25, 37) : Math.min(55, G.w / 23, G.h / 13.2),
    radius = portrait ? 6 : 7;
  const sky = ctx.createLinearGradient(0, 0, 0, G.h);
  sky.addColorStop(0, '#120e0d');
  sky.addColorStop(0.54, '#0b0909');
  sky.addColorStop(1, '#050403');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, G.w, G.h);
  const spriteOffset = save.motion ? -G.tAll : 0;
  const halo = ctx.createRadialGradient(cx, cy, unit * 0.4, cx, cy, unit * 8.8);
  halo.addColorStop(0, 'rgba(222,170,92,.17)');
  halo.addColorStop(0.42, 'rgba(126,85,48,.08)');
  halo.addColorStop(1, 'rgba(5,4,3,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, G.w, G.h);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(portrait ? 0 : -0.055);
  ctx.imageSmoothingEnabled = false;
  for (let y = -radius; y <= radius; y++)
    for (let x = -radius; x <= radius; x++) {
      const ax = Math.abs(x),
        ay = Math.abs(y),
        edge = Math.max(ax, ay);
      if (edge > radius || ax + ay > radius * 1.72) continue;
      const outer = edge === radius || ax + ay > radius * 1.54,
        shade = (((x * 5 + y * 3) % 4) + 4) % 4;
      ctx.globalAlpha = outer ? 0.72 : 0.96;
      ctx.fillStyle = ['#27201e', '#201b1a', '#2d2521', '#191616'][shade];
      ctx.fillRect(x * unit, y * unit, unit - 2, unit - 2);
      ctx.fillStyle = outer ? '#594839' : '#3e342d';
      ctx.fillRect(x * unit, y * unit, unit - 2, 2);
      ctx.fillStyle = '#110e0d';
      ctx.fillRect(x * unit + unit - 3, y * unit, 2, unit - 2);
      const tx = x * unit,
        ty = y * unit;
      ctx.fillStyle = '#65503a';
      ctx.fillRect(tx + 3, ty + 3, Math.max(2, unit * 0.13), 1);
      ctx.fillStyle = '#382c24';
      ctx.fillRect(tx + unit * 0.2, ty + unit - 5, unit * 0.58, 1);
      if ((x * 3 + y * 7) % 5 === 0 && !outer) {
        ctx.fillStyle = '#110e0d';
        ctx.fillRect(tx + unit * 0.63, ty + 2, 1, unit * 0.16);
        ctx.fillRect(tx + unit * 0.63 - 3, ty + unit * 0.16 + 1, 4, 1);
        ctx.fillStyle = '#574230';
        ctx.fillRect(tx + unit * 0.63 + 1, ty + 3, 1, unit * 0.13);
      }
      if ((x * 11 + y * 7) % 9 === 0 && !outer) {
        ctx.fillStyle = '#a2785124';
        ctx.fillRect(x * unit + unit * 0.22, y * unit + unit * 0.68, unit * 0.34, 2);
      }
      if (outer) {
        ctx.fillStyle = '#3c3029';
        ctx.fillRect(x * unit, y * unit, unit - 2, Math.max(6, unit * 0.3));
        ctx.fillStyle = '#776047';
        ctx.fillRect(x * unit + 3, y * unit + 3, unit - 8, 2);
        ctx.fillStyle = '#231c19';
        ctx.fillRect(tx + unit * 0.2, ty + 7, unit * 0.6, 4);
        ctx.fillStyle = '#987444';
        ctx.fillRect(tx + unit * 0.22, ty + 7, unit * 0.56, 1);
      }
    }
  ctx.globalAlpha = 1;
  ctx.translate(unit / 2, unit / 2);
  const chamber = unit * (radius - 0.18);
  ctx.strokeStyle = '#ad875e44';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + (i * TAU) / 8,
      x = Math.cos(a) * chamber,
      y = Math.sin(a) * chamber;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  const ring = unit * 2.52;
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate(Math.PI / 8 + (i * TAU) / 8);
    ctx.fillStyle = '#8a69443a';
    ctx.fillRect(chamber - unit * 0.45, -3, unit * 0.14, 6);
    ctx.fillStyle = '#d4b06b58';
    ctx.fillRect(chamber - unit * 0.43, -2, 1, 3);
    ctx.fillStyle = '#130f0d';
    ctx.fillRect(chamber - unit * 0.26, -1, unit * 0.11, 2);
    ctx.restore();
  }
  ctx.strokeStyle = '#d5b66d5c';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, ring, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = '#c98e5738';
  ctx.beginPath();
  ctx.arc(0, 0, ring + unit * 0.38, 0, TAU);
  ctx.stroke();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU;
    ctx.save();
    ctx.rotate(a);
    ctx.fillStyle = i % 4 === 0 ? '#e1c47f99' : '#b49a765c';
    ctx.fillRect(ring + unit * 0.18, -1, i % 4 === 0 ? unit * 0.28 : unit * 0.15, 2);
    if (i % 4 === 0) {
      ctx.fillStyle = '#17110f';
      ctx.fillRect(ring + unit * 0.48, -5, unit * 0.35, 10);
      ctx.fillStyle = '#796044';
      ctx.fillRect(ring + unit * 0.48, -5, unit * 0.35, 1);
      ctx.fillStyle = '#c4a16b';
      ctx.fillRect(ring + unit * 0.56, -2, 2, 4);
      ctx.fillStyle = '#51402d';
      ctx.fillRect(ring + unit * 0.7, -2, 1, 4);
    }
    ctx.restore();
  }
  for (const [x, y] of [
    [-4.8, -4.25],
    [4.8, -4.25],
    [-4.8, 4.25],
    [4.8, 4.25],
  ]) {
    glowImg('ember', x * unit, y * unit, unit * 2.35, 0.48);
    ctx.save();
    ctx.translate(Math.round(x * unit), Math.round(y * unit));
    const scale = unit / 48;
    ctx.scale(scale, scale);
    ctx.fillStyle = '#060505a8';
    ctx.fillRect(-20, 15, 40, 7);
    ctx.fillRect(-14, 22, 28, 2);
    ctx.fillStyle = '#211a16';
    ctx.fillRect(-15, 8, 30, 12);
    ctx.fillStyle = '#65503a';
    ctx.fillRect(-13, 8, 26, 3);
    ctx.fillStyle = '#3c2d21';
    ctx.fillRect(-5, -1, 10, 11);
    ctx.fillStyle = '#a4814f';
    ctx.fillRect(-4, 0, 2, 8);
    ctx.fillStyle = '#261b14';
    ctx.fillRect(-13, -8, 26, 5);
    ctx.fillRect(-10, -3, 20, 5);
    ctx.fillStyle = '#ae8651';
    ctx.fillRect(-13, -9, 26, 2);
    drawSpr('flame', 0, -17, 1.35, 0, 0.95, spriteOffset);
    ctx.restore();
  }
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 7; i++) {
    const a = t * 0.22 + (i * TAU) / 7,
      rr = unit * (2.02 + 0.09 * Math.sin(t * 0.7 + i));
    ctx.save();
    ctx.translate(Math.cos(a) * rr, Math.sin(a) * rr * 0.72);
    ctx.rotate(a + t * 0.13 + Math.PI / 4);
    ctx.fillStyle = i % 2 ? '#e8a25c' : '#f1ca76';
    ctx.globalAlpha = 0.72;
    ctx.fillRect(-5, -5, 10, 10);
    ctx.fillStyle = '#fff0c9';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(-2, -4, 4, 5);
    ctx.fillStyle = '#75462c';
    ctx.globalAlpha = 0.9;
    ctx.fillRect(-2, 1, 4, 4);
    ctx.restore();
  }
  ctx.restore();
  glowImg('gold', 0, 0, unit * 4.4, 0.52);
  glowImg('ember', 0, 0, unit * 3.1, 0.14);
  drawSpr(
    'portal',
    0,
    0,
    (portrait ? 1.55 : 2.15) + Math.sin(t * 1.1) * 0.035,
    0,
    0.98,
    spriteOffset
  );
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.rotate(Math.PI / 4 + Math.sin(t * 0.55) * 0.025);
  ctx.strokeStyle = '#e9ca7e';
  ctx.globalAlpha = 0.58;
  ctx.lineWidth = 2;
  ctx.strokeRect(-13, -13, 26, 26);
  ctx.fillStyle = '#fff0b5';
  ctx.globalAlpha = 0.82;
  ctx.fillRect(-7, -7, 14, 14);
  ctx.fillStyle = '#ffd38a';
  ctx.globalAlpha = 0.96;
  ctx.fillRect(-3, -3, 6, 6);
  ctx.restore();
  const py = unit * (portrait ? 2.7 : 3.12);
  glowImg('ember', 0, py - 5, unit * 1.65, 0.33);
  drawSpr('pIdle', 0, py, portrait ? 1.12 : 1.55, 0, 1, spriteOffset);
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 9; i++) {
    const a = t * (i % 2 ? 0.32 : -0.26) + (i * TAU) / 9,
      rr = unit * (3.5 + (i % 3) * 0.38);
    ctx.fillStyle = i % 3 ? '#d99a5b' : '#e7c474';
    ctx.globalAlpha = 0.18 + (i % 2) * 0.12;
    ctx.fillRect(
      Math.round(Math.cos(a) * rr) - 1,
      Math.round(Math.sin(a) * rr * 0.72) - 1,
      i % 3 ? 2 : 3,
      i % 3 ? 2 : 3
    );
  }
  ctx.restore();
  const vignette = ctx.createRadialGradient(cx, cy, unit * 1.3, cx, cy, Math.max(G.w, G.h) * 0.72);
  vignette.addColorStop(0, 'rgba(5,4,3,0)');
  vignette.addColorStop(0.58, 'rgba(5,4,3,.08)');
  vignette.addColorStop(1, 'rgba(2,2,2,.88)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, G.w, G.h);
  for (let i = 0; i < 46; i++) {
    const drift = t * (7 + (i % 6)),
      x = (i * 173.7 + drift * (i % 2 ? 1 : -0.45) + G.w * 2) % G.w,
      y = G.h - ((drift + i * 67) % G.h);
    ctx.fillStyle = i % 5 ? '#ce8d52' : '#e7bd72';
    ctx.globalAlpha = 0.07 + (i % 4) * 0.035;
    ctx.fillRect(Math.round(x), Math.round(y), i % 5 ? 1 : 2, i % 5 ? 1 : 2);
  }
  ctx.globalAlpha = 1;
}
