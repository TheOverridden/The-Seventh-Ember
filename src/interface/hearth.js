const hearthView = {
  tab: 'room',
  slot: 'floor',
  from: null,
  inert: [],
  rendered: -1,
  clock: 0,
  trial: '',
  tier: 0,
  reward: null,
};
function hearthOpen(tab = 'room') {
  if (typeof isHearthTrial === 'function' && isHearthTrial()) return leaveHearthTrial(true);
  if (!T('hearth') || T('hearth').classList.contains('open')) return;
  hearthView.from = document.activeElement;
  if (G.state === 'playing') pauseGame(true);
  clearInput();
  hearthView.tab = ['room', 'trials', 'vows'].includes(tab) ? tab : 'room';
  hearthRefresh();
  T('hearth').querySelector('.hearth-content').scrollTop = 0;
  for (const el of [...document.querySelectorAll('.ov.open'), T('cv'), T('hud')]) {
    if (el?.id !== 'hearth') {
      hearthView.inert.push([el, el.inert]);
      el.inert = true;
    }
  }
  show('hearth');
  initAudio();
  T('hearthClose').focus({ preventScroll: true });
  saveNow('hearth');
}
function hearthClose() {
  if (!T('hearth')?.classList.contains('open')) return;
  hide('hearth');
  for (const [el, inert] of hearthView.inert.splice(0)) el.inert = inert;
  clearInput();
  saveNow('hearth');
  (hearthView.from?.isConnected
    ? hearthView.from
    : T(G.state === 'menu' ? 'btnHearth' : 'btnResume')
  )?.focus({ preventScroll: true });
}
function hearthItemButton(name, selected, disabled, fn, detail = '') {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'hearth-choice' + (selected ? ' selected' : '');
  b.disabled = disabled;
  b.setAttribute('aria-pressed', String(selected));
  const title = document.createElement('strong'),
    sub = document.createElement('small');
  title.textContent = name;
  sub.textContent = detail;
  b.append(title, sub);
  b.addEventListener('click', fn);
  return b;
}
function hearthTrialOpenBoard() {
  if (T('hearth')?.classList.contains('open')) hearthClose();
  hearthOpen('trials');
}
function hearthRewardTrial(kind, id) {
  for (const trial of HEARTH_TRIALS)
    for (let tier = 0; tier < trial.tiers.length; tier++)
      if (trial.tiers[tier].rewards.some((r) => r.kind === kind && r.id === id))
        return { id: trial.id, tier };
  return null;
}
function hearthInspectReward(kind, id) {
  hearthView.reward = { kind, id };
  const item =
    kind === 'decor'
      ? HEARTH_DECOR.find((d) => d.id === id)
      : HEARTH_PALETTES.find((p) => p.id === id);
  T('hearthRewardInfo').textContent = item.name + ' · ' + hearthCosmeticSource(kind, id);
  T('hearthRewardInspect').hidden = false;
  T('hearthRewardView').hidden = !hearthRewardTrial(kind, id);
}
function hearthCustomize() {
  const h = hearthData(),
    list = T('hearthChoices');
  list.replaceChildren();
  for (const b of T('hearthSlots').children)
    b.setAttribute('aria-pressed', String(b.dataset.slot === hearthView.slot));
  for (const d of HEARTH_DECOR.filter((d) => d.slot === hearthView.slot)) {
    const unlocked = hearthCosmeticUnlocked('decor', d.id),
      selected = h.layout[d.slot] === d.id,
      button = hearthItemButton(
        d.name,
        selected,
        false,
        () => {
          if (!hearthCosmeticUnlocked('decor', d.id)) return hearthInspectReward('decor', d.id);
          hearthData().layout[d.slot] = d.id;
          hearthView.reward = null;
          hearthRevision++;
          hearthRefresh();
          T('hearthChoices').querySelector('.selected')?.focus({ preventScroll: true });
          saveNow('decor');
        },
        selected ? 'PLACED' : unlocked ? 'PLACE' : 'LOCKED'
      );
    button.classList.toggle('locked', !unlocked);
    button.title = unlocked ? d.name : hearthCosmeticSource('decor', d.id);
    button.prepend(hearthRewardIcon({ kind: 'decor', id: d.id, label: d.name }, true));
    list.appendChild(button);
  }
  for (const key of ['trail', 'shards']) {
    const select = T('hearth' + (key === 'trail' ? 'Trail' : 'Shards'));
    select.replaceChildren();
    for (const p of HEARTH_PALETTES) {
      const opt = document.createElement('option');
      opt.value = p.id;
      const unlocked = hearthCosmeticUnlocked(key, p.id);
      opt.disabled = !unlocked;
      opt.textContent = unlocked ? p.name : p.name + ' · ' + hearthCosmeticSource(key, p.id);
      select.appendChild(opt);
    }
    select.value = h[key];
  }
  T('hearthMusic').value = h.music;
  T('hearthRewardInspect').hidden = !hearthView.reward;
  const equipped = HEARTH_PALETTES.find((p) => p.id === h.shards);
  T('hearthEmberName').textContent = equipped.name;
  T('hearthRoomStatus').textContent =
    HEARTH_DECOR.filter((d) => hearthCosmeticUnlocked('decor', d.id)).length +
    ' / ' +
    HEARTH_DECOR.length +
    ' FURNISHINGS';
}
function hearthTrialIcon(trial, size = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  canvas.className = 'hearth-trial-icon';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  if (trial.id === 'guardian' && SPR.gateWarden?.frames[0]) {
    const scale = Math.max(1, Math.floor(size / 27)),
      width = 23 * scale,
      height = 21 * scale;
    ctx.drawImage(
      SPR.gateWarden.frames[0],
      8,
      0,
      23,
      21,
      Math.floor((size - width) / 2),
      Math.floor((size - height) / 2),
      width,
      height
    );
  } else if (trial.family === 'flare' || trial.family === 'flame' || trial.family === 'fire') {
    ctx.save();
    ctx.translate(size / 2, size * 0.8);
    ctx.scale(size / 68, size / 68);
    hearthFlame(ctx, 0, 0, 0, 0.85);
    ctx.restore();
    if (trial.id === 'defense') {
      ctx.strokeStyle = '#d8bd88';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(size * 0.22, size * 0.2);
      ctx.lineTo(size * 0.78, size * 0.2);
      ctx.lineTo(size * 0.78, size * 0.61);
      ctx.lineTo(size * 0.5, size * 0.88);
      ctx.lineTo(size * 0.22, size * 0.61);
      ctx.closePath();
      ctx.stroke();
    }
  } else if (trial.family === 'heart' || trial.family === 'soul') {
    const dots = ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'];
    const px = Math.floor(size / 10);
    ctx.fillStyle = '#eda685';
    dots.forEach((row, y) =>
      [...row].forEach((bit, x) => {
        if (bit === '1')
          ctx.fillRect(size / 2 - 3.5 * px + x * px, size / 2 - 3 * px + y * px, px, px);
      })
    );
    ctx.fillStyle = '#ffdfbc';
    ctx.fillRect(size / 2 - 2.5 * px, size / 2 - 2 * px, px, px);
  } else
    drawComboEmblem(
      ctx,
      trial.family === 'prism' ? 'stitch' : trial.family,
      size / 2,
      size / 2,
      size * 0.67
    );
  if (trial.id === 'constellation') {
    ctx.clearRect(size * 0.22, size * 0.39, size * 0.2, size * 0.12);
    ctx.fillStyle = '#ffdf9b';
    ctx.fillRect(size * 0.23, size * 0.45, 4, 4);
  }
  return canvas;
}
function hearthRewardIcon(reward, compact = false) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 40;
  canvas.className = 'hearth-reward-icon' + (compact ? ' compact' : '');
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d'),
    palette = HEARTH_PALETTES.find((p) => p.id === reward.id),
    decor = HEARTH_DECOR.find((d) => d.id === reward.id),
    px = (x, y, w, h, c) => {
      ctx.fillStyle = c;
      ctx.fillRect(x, y, w, h);
    };
  if (palette) {
    if (reward.kind === 'trail') {
      for (let i = 0; i < 4; i++)
        px(5 + i * 7, 24 - i * 4, 4 + i, 4 + i, i === 3 ? palette.light : palette.color);
    } else {
      for (const [x, y] of [
        [18, 3],
        [4, 15],
        [30, 15],
        [18, 28],
      ]) {
        px(x, y, 4, 10, palette.color);
        px(x + 1, y, 2, 6, palette.light);
      }
      px(17, 16, 6, 7, palette.light);
    }
  } else {
    const i =
        Math.max(
          0,
          HEARTH_DECOR.findIndex((d) => d.id === reward.id)
        ) % 4,
      colors = ['#b09b77', '#a5b78c', '#becbe0', '#edc77b'],
      c = colors[i];
    switch (decor?.slot) {
      case 'floor':
        px(4, 9, 32, 24, '#4d4032');
        for (let y = 10; y < 32; y += 7) for (let x = 5; x < 35; x += 10) px(x, y, 8, 5, c);
        break;
      case 'banner':
        px(5, 6, 30, 3, '#d0b783');
        px(10, 9, 20, 21, c);
        px(10, 30, 8, 5, c);
        px(22, 30, 8, 5, c);
        px(18, 15, 4, 10, '#f5e1b5');
        break;
      case 'lights':
        px(18, 3, 4, 8, '#8c7753');
        px(11, 11, 18, 21, '#817051');
        px(14, 14, 12, 15, c);
        px(18, 18, 4, 7, '#fff1c2');
        px(10, 32, 20, 3, '#d5b87b');
        break;
      case 'shelf':
        px(4, 29, 32, 5, '#937345');
        px(7, 12, 7, 17, c);
        px(16, 9, 7, 20, '#ded0a5');
        px(25, 14, 7, 15, c);
        px(8, 16, 5, 2, '#f9e8bb');
        break;
      case 'rug':
        px(3, 10, 34, 20, c);
        px(6, 13, 28, 14, '#554844');
        px(16, 16, 8, 8, c);
        for (let x = 4; x < 36; x += 5) {
          px(x, 7, 2, 3, c);
          px(x, 30, 2, 3, c);
        }
        break;
      default:
        px(7, 5, 26, 30, '#887659');
        px(10, 8, 20, 24, '#2b3740');
        px(18, 8, 4, 24, '#ab9570');
        px(10, 20, 20, 3, '#ab9570');
        px(13, 12, 3, 3, c);
        px(25, 27, 3, 3, c);
    }
  }
  return canvas;
}
function hearthTrialTime(seconds) {
  if (!Number.isFinite(seconds)) return '—';
  const n = Math.max(0, Math.floor(seconds));
  return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');
}
function hearthSelectTrial(id, tier = 0) {
  hearthView.trial = id;
  hearthView.tier = tier;
  hearthRenderTrials();
  T('hearthTrialList')
    .querySelector('[data-trial="' + id + '"]')
    ?.focus({ preventScroll: true });
}
function hearthRenderTrials() {
  const list = T('hearthTrialList');
  if (!HEARTH_TRIALS.some((t) => t.id === hearthView.trial)) hearthView.trial = HEARTH_TRIALS[0].id;
  list.replaceChildren();
  let cleared = 0;
  for (const trial of HEARTH_TRIALS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'hearth-trial-card' + (trial.id === hearthView.trial ? ' selected' : '');
    button.dataset.trial = trial.id;
    button.setAttribute('aria-pressed', String(trial.id === hearthView.trial));
    const body = document.createElement('span'),
      name = document.createElement('strong'),
      rule = document.createElement('span'),
      marks = document.createElement('span');
    body.className = 'hearth-trial-card-copy';
    name.textContent = trial.name;
    rule.className = 'hearth-trial-rule';
    rule.textContent = trial.rule;
    marks.className = 'hearth-trial-marks';
    for (let tier = 0; tier < trial.tiers.length; tier++) {
      const record = hearthTrialRecord(trial.id, tier),
        mark = document.createElement('span');
      mark.className = record?.clears ? 'earned' : '';
      mark.textContent = '◆';
      mark.title = trial.tiers[tier].name + (record?.clears ? ' · cleared' : '');
      if (record?.clears) cleared++;
      marks.appendChild(mark);
    }
    body.append(name, rule, marks);
    button.append(hearthTrialIcon(trial), body);
    on(button, 'click', (event) => {
      hearthSelectTrial(trial.id, 0);
      if (innerWidth <= 800 && event.detail > 0)
        T('hearthTrialDetail').scrollIntoView({
          block: 'start',
          behavior: save.motion ? 'auto' : 'smooth',
        });
    });
    list.appendChild(button);
  }
  T('hearthTrialCount').textContent =
    cleared + ' / ' + HEARTH_TRIALS.reduce((n, t) => n + t.tiers.length, 0) + ' CLEARED';
  hearthRenderTrialDetail();
}
function hearthRenderTrialDetail() {
  const trial = HEARTH_TRIALS.find((t) => t.id === hearthView.trial),
    tier = Math.min(trial.tiers.length - 1, Math.max(0, hearthView.tier)),
    level = trial.tiers[tier],
    record = hearthTrialRecord(trial.id, tier),
    unlocked = hearthTrialUnlocked(trial.id, tier),
    panel = T('hearthTrialDetail');
  hearthView.tier = tier;
  panel.replaceChildren();
  panel.dataset.tier = tier;
  const heading = document.createElement('div');
  heading.className = 'hearth-trial-detail-heading';
  const title = document.createElement('div'),
    eyebrow = document.createElement('small'),
    name = document.createElement('h3');
  eyebrow.textContent = 'HEARTH TRIAL';
  name.textContent = trial.name;
  title.append(eyebrow, name);
  heading.append(hearthTrialIcon(trial, 88), title);
  const tiers = document.createElement('div');
  tiers.className = 'hearth-tier-options';
  tiers.setAttribute('aria-label', 'Trial difficulty');
  for (let i = 0; i < trial.tiers.length; i++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = trial.tiers[i].name;
    button.dataset.tier = i;
    button.setAttribute('aria-pressed', String(i === tier));
    button.classList.toggle('locked', !hearthTrialUnlocked(trial.id, i));
    button.title = hearthTrialUnlocked(trial.id, i)
      ? trial.tiers[i].name
      : 'Clear ' + trial.tiers[i - 1].name + ' first';
    on(button, 'click', () => {
      hearthView.tier = i;
      hearthRenderTrialDetail();
      T('hearthTrialDetail')
        .querySelector('[data-tier="' + i + '"]')
        ?.focus({ preventScroll: true });
    });
    tiers.appendChild(button);
  }
  const rule = document.createElement('p');
  rule.className = 'hearth-trial-main-rule';
  rule.textContent = trial.rule;
  const detail = document.createElement('p');
  detail.className = 'hearth-trial-description';
  detail.textContent = level.detail || trial.description || '';
  detail.hidden = !detail.textContent;
  const loadout = document.createElement('div');
  loadout.className = 'hearth-trial-loadout';
  const loadoutName = document.createElement('strong'),
    loadoutDetail = document.createElement('p');
  loadoutName.textContent = 'FIXED LOADOUT';
  loadoutDetail.textContent =
    level.loadout ||
    trial.loadout ||
    trial.detail ||
    'Your abilities and stats are set for this trial. Skill Tree upgrades and descent blessings stay with your saved run.';
  loadout.append(loadoutName, loadoutDetail);
  const reward = document.createElement('section');
  reward.className = 'hearth-trial-rewards';
  const rewardTitle = document.createElement('h4');
  rewardTitle.textContent = record?.clears ? 'REWARDS EARNED' : 'FIRST CLEAR REWARDS';
  reward.appendChild(rewardTitle);
  for (const r of level.rewards) {
    const item = document.createElement('div'),
      copy = document.createElement('span'),
      label = document.createElement('strong'),
      kind = document.createElement('small');
    item.className =
      'hearth-trial-reward' + (hearthCosmeticUnlocked(r.kind, r.id) ? ' earned' : '');
    label.textContent = r.label;
    kind.textContent =
      r.kind === 'decor'
        ? 'HEARTH FURNISHING'
        : r.kind === 'shards'
          ? 'REVOLVING SHARDS'
          : 'EMBER TRAIL';
    copy.append(label, kind);
    item.append(hearthRewardIcon(r), copy);
    reward.appendChild(item);
  }
  const records = document.createElement('div');
  records.className = 'hearth-trial-records';
  records.setAttribute('aria-label', 'Trial records');
  for (const [label, value] of [
    ['CLEARS', record?.clears || 0],
    ['BEST TIME', hearthTrialTime(record?.bestTime)],
    ['FEWEST HITS', Number.isFinite(record?.bestHits) ? record.bestHits : '—'],
  ]) {
    const item = document.createElement('span'),
      name = document.createElement('small'),
      val = document.createElement('strong');
    name.textContent = label;
    val.textContent = value;
    item.append(name, val);
    records.appendChild(item);
  }
  const note = document.createElement('p');
  note.className = 'hearth-trial-safety';
  note.textContent = unlocked
    ? 'Separate arena · No Essence cost · Your descent stays saved'
    : 'Clear ' + trial.tiers[tier - 1].name + ' to unlock this difficulty.';
  const start = document.createElement('button');
  start.type = 'button';
  start.id = 'hearthTrialStart';
  start.className = 'hearth-trial-start';
  start.disabled = !unlocked;
  start.textContent = unlocked
    ? (record?.clears ? 'PLAY AGAIN' : 'ENTER TRIAL') + ' ›'
    : 'DIFFICULTY LOCKED';
  on(start, 'click', () => startHearthTrial(trial.id, tier));
  const body = document.createElement('div');
  body.className = 'hearth-trial-detail-body';
  body.append(rule, detail, loadout, reward, records, note);
  panel.append(heading, tiers, body, start);
}
function hearthRenderVows() {
  const h = hearthData(),
    unlocked = hearthVowsUnlocked(),
    list = T('hearthVowList');
  list.replaceChildren();
  T('hearthVowIntro').textContent = unlocked
    ? 'Choose bindings for your next new descent. Every Guardian victory earns a seal for each active binding. Complete the campaign with a set to earn its crown. Your saved run keeps its original bindings.'
    : 'Defeat your first Guardian to unlock bindings. They restrict your abilities without changing the dungeon or removing your blessings.';
  for (const v of HEARTH_VOWS) {
    const card = document.createElement('article');
    card.className = 'hearth-vow' + (h.selectedVows.includes(v.id) ? ' selected' : '');
    card.dataset.vow = v.id;
    const mark = document.createElement('span');
    mark.className = 'hearth-vow-mark';
    mark.textContent = v.mark;
    const name = document.createElement('h3');
    name.textContent = v.name;
    const ds = document.createElement('p');
    ds.textContent = v.ds;
    const seals = document.createElement('div');
    seals.className = 'hearth-seals';
    for (const g of GUARDIAN_ROSTER) {
      const s = document.createElement('span'),
        earned = h.vowSeals[v.id]?.[g.key];
      s.textContent = '◆';
      s.className = earned ? 'earned' : '';
      s.title = g.name + (earned ? ' · sealed' : '');
      s.setAttribute('aria-label', s.title);
      seals.appendChild(s);
    }
    const button = hearthItemButton(
      h.selectedVows.includes(v.id) ? 'BOUND' : 'BIND',
      h.selectedVows.includes(v.id),
      !unlocked,
      () => {
        const chosen = hearthData().selectedVows;
        hearthData().selectedVows = chosen.includes(v.id)
          ? chosen.filter((id) => id !== v.id)
          : [...chosen, v.id];
        hearthRevision++;
        hearthRenderVows();
        T('hearthVowList')
          .querySelector('[data-vow="' + v.id + '"] button')
          ?.focus({ preventScroll: true });
        saveNow('bindings');
      },
      Object.keys(h.vowSeals[v.id] || {}).length + ' / 10 seals'
    );
    card.append(mark, name, ds, seals, button);
    list.appendChild(card);
  }
  const selected = h.selectedVows.length;
  T('hearthVowSummary').textContent = selected
    ? selected + ' / 6 BOUND · NEXT NEW DESCENT'
    : 'NO BINDINGS · ORDINARY DESCENT';
  T('hearthAllVows').disabled = T('hearthClearVows').disabled = !unlocked;
  const crowns = T('hearthCrowns');
  crowns.textContent = h.crowns.length
    ? 'Campaign crowns: ' +
      h.crowns
        .map((mask) =>
          HEARTH_VOWS.filter((v, i) => mask & (1 << i))
            .map((v) => v.mark)
            .join(' + ')
        )
        .join(' · ')
    : 'Six-binding campaign crown: the gold crest above your fireplace.';
}
function hearthRefresh() {
  hearthView.rendered = hearthRevision;
  for (const b of T('hearthTabs').children)
    b.setAttribute('aria-pressed', String(b.dataset.tab === hearthView.tab));
  T('hearthRoomPanel').hidden = hearthView.tab !== 'room';
  T('hearthTrialsPanel').hidden = hearthView.tab !== 'trials';
  T('hearthVowsPanel').hidden = hearthView.tab !== 'vows';
  T('hearthBegin').textContent =
    typeof isHearthTrial === 'function' && isHearthTrial()
      ? 'RETURN FROM TRIAL ›'
      : G.state === 'paused'
        ? 'RESUME DESCENT ›'
        : 'BEGIN DESCENT ›';
  if (hearthView.tab === 'room') {
    hearthCustomize();
    drawHearthRoom(T('hearthCanvas').getContext('2d'), save.motion ? 0 : G.tAll);
  } else if (hearthView.tab === 'trials') hearthRenderTrials();
  else hearthRenderVows();
}
function installHearth() {
  const button = document.createElement('button');
  button.id = 'btnHearth';
  button.type = 'button';
  button.className = 'btn hearth-menu';
  button.innerHTML =
    '<span aria-hidden="true">♨</span> THE HEARTH <small>TRIALS · REWARDS · YOUR ROOM</small>';
  T('menuStats').before(button);
  on(button, 'click', () => hearthOpen());
  const pause = document.createElement('button');
  pause.id = 'btnPauseHearth';
  pause.type = 'button';
  pause.className = 'btn';
  pause.textContent = 'THE HEARTH';
  T('btnPauseAchievements').after(pause);
  on(pause, 'click', () => hearthOpen());
  const overlay = document.createElement('div');
  overlay.id = 'hearth';
  overlay.className = 'ov';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'hearthTitle');
  overlay.innerHTML = `<section class="hearth-shell">
    <header class="hearth-heading"><div class="hearth-heading-crest" aria-hidden="true"><span></span></div><div><small>THE SEVENTH EMBER</small><h2 id="hearthTitle">The Hearth</h2></div><button class="btn" id="hearthClose" type="button">BACK</button></header>
    <nav id="hearthTabs"><button data-tab="room" type="button">YOUR HEARTH</button><button data-tab="trials" type="button">TRIAL BOARD</button><button data-tab="vows" type="button">VOW BINDINGS</button></nav>
    <div class="hearth-content">
      <section id="hearthRoomPanel"><div class="hearth-room-grid">
        <div class="hearth-scene"><div class="hearth-scene-heading"><span>YOUR ROOM</span><small id="hearthRoomStatus"></small></div><div class="hearth-scene-frame"><canvas id="hearthCanvas" width="640" height="360" role="img" aria-label="Your Hearth: a stone fireplace, timber beams, windows, Guardian trophies, and your revolving Ember."></canvas></div><div class="hearth-scene-caption"><div><small>YOUR EMBER</small><strong id="hearthEmberName"></strong></div><button id="hearthBegin" type="button">BEGIN DESCENT ›</button></div><button id="hearthVisitTrials" class="hearth-room-trial-link" type="button"><span class="hearth-link-mark" aria-hidden="true">◆</span><span><strong>Visit the Trial Board</strong><small>Clear special arenas to earn furnishings and Ember finishes.</small></span><span aria-hidden="true">›</span></button></div>
        <aside class="hearth-workbench"><div class="hearth-workbench-heading"><small>FURNISHINGS & FINISHES</small><h3>Make it yours</h3></div><div id="hearthSlots"><button data-slot="floor" type="button">FLOOR</button><button data-slot="banner" type="button">BANNERS</button><button data-slot="lights" type="button">LIGHTS</button><button data-slot="shelf" type="button">SHELVES</button><button data-slot="rug" type="button">RUG</button><button data-slot="window" type="button">WINDOW</button></div><div id="hearthChoices"></div><div id="hearthRewardInspect" hidden><p id="hearthRewardInfo" aria-live="polite"></p><button id="hearthRewardView" type="button">VIEW TRIAL ›</button></div><div class="hearth-finishes"><label>Ember trail<select id="hearthTrail"></select></label><label>Revolving shards<select id="hearthShards"></select></label><label>Hearth music<select id="hearthMusic"></select></label></div></aside>
      </div></section>
      <section id="hearthTrialsPanel" hidden><div class="hearth-trials-heading"><div><small>SIX ARENAS · THREE DIFFICULTIES</small><h3>The Trial Board</h3><p>Choose a restriction. Clear the room. Bring something home.</p></div><strong id="hearthTrialCount"></strong></div><div class="hearth-trials-grid"><div id="hearthTrialList"></div><article id="hearthTrialDetail"></article></div></section>
      <section id="hearthVowsPanel" hidden><p id="hearthVowIntro"></p><div class="hearth-vow-actions"><strong id="hearthVowSummary"></strong><button class="btn" id="hearthAllVows" type="button">BIND ALL SIX</button><button class="btn" id="hearthClearVows" type="button">CLEAR</button></div><div id="hearthVowList"></div><p id="hearthCrowns"></p><p class="hearth-vow-note">Seals and crowns are permanent trophies. Bindings do not increase Essence rewards or apply to Archive practice and Boss Rush.</p></section>
    </div>
  </section>`;
  document.body.appendChild(overlay);
  for (const [id, name] of HEARTH_MUSIC) {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = name;
    T('hearthMusic').appendChild(o);
  }
  on(T('hearthClose'), 'click', hearthClose);
  on(T('hearthVisitTrials'), 'click', () => {
    hearthView.tab = 'trials';
    hearthRefresh();
    T('hearth').querySelector('.hearth-content').scrollTop = 0;
  });
  on(T('hearthRewardView'), 'click', () => {
    const target =
      hearthView.reward && hearthRewardTrial(hearthView.reward.kind, hearthView.reward.id);
    if (!target) return;
    hearthView.tab = 'trials';
    hearthView.trial = target.id;
    hearthView.tier = target.tier;
    hearthRefresh();
    T('hearth').querySelector('.hearth-content').scrollTop = 0;
  });
  on(T('hearthBegin'), 'click', () => {
    if (typeof isHearthTrial === 'function' && isHearthTrial()) return leaveHearthTrial();
    hearthClose();
    if (G.state === 'paused' && G.run && !G.dead) pauseGame(false);
    else requestStart();
  });
  for (const b of T('hearthTabs').children)
    on(b, 'click', () => {
      hearthView.tab = b.dataset.tab;
      hearthRefresh();
      T('hearth').querySelector('.hearth-content').scrollTop = 0;
    });
  for (const b of T('hearthSlots').children)
    on(b, 'click', () => {
      hearthView.slot = b.dataset.slot;
      hearthCustomize();
    });
  for (const [id, key] of [
    ['hearthTrail', 'trail'],
    ['hearthShards', 'shards'],
    ['hearthMusic', 'music'],
  ])
    on(T(id), 'change', () => {
      if (key !== 'music' && !hearthCosmeticUnlocked(key, T(id).value)) return hearthCustomize();
      hearthData()[key] = T(id).value;
      hearthRevision++;
      saveNow('hearth-style');
    });
  on(T('hearthAllVows'), 'click', () => {
    if (hearthVowsUnlocked()) {
      hearthData().selectedVows = HEARTH_VOWS.map((v) => v.id);
      hearthRevision++;
      hearthRenderVows();
      saveNow('bindings');
    }
  });
  on(T('hearthClearVows'), 'click', () => {
    hearthData().selectedVows = [];
    hearthRevision++;
    hearthRenderVows();
    saveNow('bindings');
  });
  overlay.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        hearthClose();
      }
      if (e.key === 'Tab') {
        const items = controllerTargets(overlay),
          first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    true
  );
  const vow = document.createElement('small');
  vow.id = 'vowHud';
  vow.hidden = true;
  T('weaponHUD').appendChild(vow);
}
const hearthInit = init;
init = function () {
  hearthInit();
  installHearth();
};
const hearthBlocking = anyBlockingOverlay;
anyBlockingOverlay = function () {
  return hearthBlocking() || T('hearth')?.classList.contains('open');
};
const hearthEsc = onEscKey;
onEscKey = function () {
  if (T('hearth')?.classList.contains('open')) return hearthClose();
  return hearthEsc();
};
const hearthInterfaceTick = hollowTick;
hollowTick = function (dt) {
  hearthInterfaceTick(dt);
  hearthView.clock += dt;
  if (T('hearth')?.classList.contains('open')) {
    if (hearthView.rendered !== hearthRevision) hearthRefresh();
    if (hearthView.tab === 'room' && hearthView.clock >= 1 / 24) {
      drawHearthRoom(T('hearthCanvas').getContext('2d'), save.motion ? 0 : G.tAll);
      hearthView.clock = 0;
    }
  }
};
const hearthRecordedTrack = tseRecordedTrack;
tseRecordedTrack = function () {
  return T('hearth')?.classList.contains('open') ? hearthData().music : hearthRecordedTrack();
};
const hearthReset = resetEverything;
resetEverything = function () {
  hearthClose();
  hearthDirty = false;
  hearthRoomKey = '';
  const out = hearthReset();
  hearthRevision++;
  return out;
};
