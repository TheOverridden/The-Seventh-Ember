'use strict';

const ARCHIVE_BUILD_LIMIT = 12;
const ARCHIVE_CORE_CARDS = new Set([
  'dmg',
  'hp',
  'rate',
  'edge',
  'speed',
  'magazine',
  'quickload',
  'dash',
  'crit',
  'regen',
  'ironAsh',
  'bossWard',
  'guard',
]);
const ARCHIVE_UTILITY_CARDS = new Set([
  'magnet',
  'xp',
  'warmPocket',
  'essPulse',
  'hearthTax',
  'keptPromise',
  'seventhWish',
  'archiveFire',
  'wickPointer',
]);
const ARCHIVE_PRACTICE_HEALTH = {
  warden: 2600,
  matriarch: 3600,
  bellkeeper: 6500,
  colossus: 8500,
  astronomer: 11000,
  scribe: 13000,
  regents: 8500,
  seraph: 16000,
  tyrant: 19000,
  keeper: 23000,
};
const ARCHIVE_PRACTICE_DAMAGE = {
  warden: 17,
  matriarch: 20,
  bellkeeper: 23,
  colossus: 25,
  astronomer: 28,
  scribe: 30,
  regents: 31,
  seraph: 33,
  tyrant: 35,
  keeper: 38,
};
const ARCHIVE_BUILD_PRESETS = [
  {
    id: 'frostfire',
    name: 'Frostfire',
    family: 'frost',
    ds: 'Chill the guardian, keep it burning, and shatter the ice with Flare.',
    cards: {
      firstSpark: 3,
      burn: 3,
      quickdraw: 3,
      hailstone: 3,
      lastCoal: 3,
      seeking: 2,
      kindleMark: 2,
      runRevive: 1,
      flareGuard: 2,
    },
  },
  {
    id: 'stitch',
    name: 'Starstitch',
    family: 'stitch',
    ds: 'Build a web of stars with conductors, pins, and falling meteors.',
    cards: {
      brightNeedle: 3,
      longThread: 3,
      heldPattern: 3,
      hotWire: 3,
      stormCoil: 3,
      meteorCore: 2,
      counterweave: 2,
      seventhConstellation: 1,
      kindleMark: 2,
      runRevive: 1,
    },
  },
  {
    id: 'flare',
    name: 'Fault & Tide',
    family: 'stone',
    ds: 'Fight up close with fissures, freezing waves, and repeated Flares.',
    cards: {
      tidePulse: 3,
      firstSpark: 3,
      faultline: 3,
      burn: 3,
      gravityFlare: 2,
      counterstep: 3,
      flarePractice: 3,
      echoFlare: 2,
      duelistEmber: 2,
      mirrorSoul: 1,
      runRevive: 1,
    },
  },
  {
    id: 'orbit',
    name: 'Cinderwheel',
    family: 'blade',
    ds: 'Keep moving near the guardian while blades and cinders do their work.',
    cards: {
      sawHalo: 2,
      orbital: 4,
      burn: 3,
      firstSpark: 3,
      stormCoil: 3,
      orbitSpeed: 2,
      sunspot: 2,
      ashCrown: 1,
      runRevive: 1,
      flareGuard: 2,
    },
  },
  {
    id: 'meteor',
    name: 'Falling Suns',
    family: 'meteor',
    ds: 'Aim your casts to bring down meteors, gravity wells, and explosive stars.',
    cards: {
      meteorCore: 2,
      comet: 2,
      emberMine: 2,
      supernova: 1,
      blackHole: 1,
      sunspot: 2,
      seeking: 2,
      sevenfold: 1,
      runRevive: 1,
    },
  },
  {
    id: 'echo',
    name: 'Prism Echo',
    family: 'prism',
    ds: 'Repeated volleys, piercing fans, and crescents keep pressure on the target.',
    cards: {
      doubleCast: 2,
      ric: 2,
      prismBolt: 2,
      moonShard: 3,
      seeking: 2,
      sevenfold: 1,
      whiteStar: 1,
      kindleMark: 2,
      runRevive: 1,
    },
  },
];
const archiveBuildUI = {
  guardian: null,
  difficulty: 'standard',
  from: 'guardianArchive',
  tab: 'combos',
  search: '',
};

function archiveSelectableCard(card) {
  return !!card && !ARCHIVE_CORE_CARDS.has(card.id) && !ARCHIVE_UTILITY_CARDS.has(card.id);
}
function archivePresetCards(preset) {
  const out = {};
  for (const [id, rank] of Object.entries(preset?.cards || {})) {
    const card = POOL.find((o) => o.id === id);
    if (archiveSelectableCard(card) && Object.keys(out).length < ARCHIVE_BUILD_LIMIT)
      out[id] = Math.min(card.max, rank);
  }
  return out;
}
function archiveCoreBlessings(floor) {
  const tier = clamp(Math.ceil(floor / 5), 1, 10),
    wanted = {
      dmg: 2 + Math.ceil(tier * 0.6),
      hp: 2 + Math.ceil(tier * 0.4),
      rate: 2 + Math.floor(tier * 0.4),
      edge: 1 + Math.ceil(tier * 0.3),
      speed: 2,
      magazine: tier >= 5 ? 3 : 2,
      quickload: tier >= 5 ? 3 : 2,
      dash: tier >= 6 ? 3 : 2,
      crit: tier >= 5 ? 3 : 2,
      regen: 2,
      ironAsh: 2,
      bossWard: 2,
      guard: 1,
    },
    out = {};
  for (const [id, rank] of Object.entries(wanted)) {
    const c = POOL.find((o) => o.id === id);
    if (c) out[id] = Math.min(c.max, rank);
  }
  return out;
}
function cleanArchivePracticeBuild(raw) {
  const fallback = ARCHIVE_BUILD_PRESETS[0];
  if (!raw || raw.version !== 1)
    return { version: 1, preset: fallback.id, up: archivePresetCards(fallback) };
  const out = {
    version: 1,
    preset: ARCHIVE_BUILD_PRESETS.some((p) => p.id === raw.preset) ? raw.preset : 'custom',
    up: {},
  };
  for (const [id, value] of Object.entries(
    raw.up && typeof raw.up === 'object' && !Array.isArray(raw.up) ? raw.up : {}
  )) {
    const card = POOL.find((o) => o.id === id),
      rank = Number(value);
    if (
      archiveSelectableCard(card) &&
      Number.isFinite(rank) &&
      rank >= 1 &&
      Object.keys(out.up).length < ARCHIVE_BUILD_LIMIT
    )
      out.up[id] = clamp(Math.floor(rank), 1, card.max);
  }
  return out;
}
function archivePracticeBuild() {
  if (!save.guardianPracticeBuild || save.guardianPracticeBuild.version !== 1)
    save.guardianPracticeBuild = cleanArchivePracticeBuild();
  return save.guardianPracticeBuild;
}
function guardianPracticeBlessings(floor) {
  return { ...archiveCoreBlessings(floor), ...archivePracticeBuild().up };
}
function archivePracticeName(build = archivePracticeBuild()) {
  return ARCHIVE_BUILD_PRESETS.find((p) => p.id === build.preset)?.name || 'Custom build';
}
function archiveAvailableCombos() {
  return BLESSING_COMBOS.filter((c) =>
    c.cards.every((id) => {
      const card = POOL.find((o) => o.id === id);
      return card && (ARCHIVE_CORE_CARDS.has(id) || archiveSelectableCard(card));
    })
  );
}
function archiveEquippedCombos(
  up = archivePracticeBuild().up,
  floor = archiveBuildUI.guardian?.floor || 5
) {
  const all = { ...archiveCoreBlessings(floor), ...up };
  return archiveAvailableCombos().filter((c) => c.cards.every((id) => all[id] > 0));
}
function archiveBuildStatus(text) {
  T('archiveBuildStatus').textContent = text;
}
function archiveSaveBuild(focus) {
  saveNow('archive-build');
  renderArchivePracticeBuild(focus);
}
function archiveSelectPreset(id) {
  const preset = ARCHIVE_BUILD_PRESETS.find((p) => p.id === id);
  if (!preset) return;
  save.guardianPracticeBuild = { version: 1, preset: id, up: archivePresetCards(preset) };
  archiveBuildStatus(preset.name + ' equipped.');
  archiveSaveBuild('archive-preset-' + id);
}
function archiveSetRank(id, rank, context = 'catalog') {
  const card = POOL.find((o) => o.id === id),
    build = archivePracticeBuild();
  if (!archiveSelectableCard(card)) return;
  rank = clamp(Math.floor(rank), 0, card.max);
  if (rank > 0 && !build.up[id] && Object.keys(build.up).length >= ARCHIVE_BUILD_LIMIT) {
    archiveBuildStatus('Choose up to twelve blessings. Remove one before adding another.');
    return;
  }
  if (rank) build.up[id] = rank;
  else delete build.up[id];
  build.preset = 'custom';
  archiveBuildStatus(rank ? card.name + ' · rank ' + rank + '.' : card.name + ' removed.');
  archiveSaveBuild(
    rank
      ? 'archive-less-' + context + '-' + id
      : context === 'selected'
        ? 'archiveBuildStart'
        : 'archive-add-catalog-' + id
  );
}
function archiveEquipCombo(id) {
  const combo = archiveAvailableCombos().find((c) => c.id === id);
  if (!combo) return;
  const build = archivePracticeBuild(),
    next = { ...build.up };
  for (const cardId of combo.cards) {
    if (ARCHIVE_CORE_CARDS.has(cardId)) continue;
    const c = POOL.find((o) => o.id === cardId);
    next[cardId] = c.max;
  }
  if (Object.keys(next).length > ARCHIVE_BUILD_LIMIT) {
    archiveBuildStatus('This combination needs more space. Remove a blessing, then equip it.');
    return;
  }
  build.up = next;
  build.preset = 'custom';
  archiveBuildStatus(combo.name + ' equipped at full blessing ranks.');
  archiveSaveBuild('archive-combo-' + id);
}
function archiveBuildElement(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}
function archiveBuildButton(text, id, action) {
  const b = archiveBuildElement('button', 'btn', text);
  if (id) b.id = id;
  b.type = 'button';
  b.onclick = action;
  return b;
}
function archiveBuildEmblem(family) {
  const c = buildEmblem(family);
  c.className = 'archive-build-emblem';
  return c;
}
function archiveRankControls(card, rank, compact = false) {
  const context = compact ? 'selected' : 'catalog';
  const controls = archiveBuildElement('div', 'archive-ranks');
  const less = archiveBuildButton('−', 'archive-less-' + context + '-' + card.id, () =>
    archiveSetRank(card.id, rank - 1, context)
  );
  less.disabled = !rank;
  less.setAttribute('aria-label', 'Lower ' + card.name + ' rank');
  const amount = archiveBuildElement('span', '', rank + ' / ' + card.max);
  amount.setAttribute('aria-label', card.name + ' rank ' + rank + ' of ' + card.max);
  const more = archiveBuildButton(
    rank ? '＋' : 'ADD',
    rank ? 'archive-more-' + context + '-' + card.id : 'archive-add-' + context + '-' + card.id,
    () => archiveSetRank(card.id, rank ? rank + 1 : card.max, context)
  );
  more.disabled = rank >= card.max;
  more.setAttribute(
    'aria-label',
    rank ? 'Raise ' + card.name + ' rank' : 'Add ' + card.name + ' at full rank'
  );
  controls.append(less, amount, more);
  return controls;
}
function renderArchivePracticeBuild(focusId) {
  if (!archiveBuildUI.guardian) return;
  const build = archivePracticeBuild(),
    combos = archiveEquippedCombos(),
    presets = T('archiveBuildPresets');
  presets.replaceChildren();
  T('archiveBuildName').textContent = archivePracticeName(build);
  T('archiveBuildCount').textContent =
    Object.keys(build.up).length +
    ' / ' +
    ARCHIVE_BUILD_LIMIT +
    ' blessings · ' +
    combos.length +
    ' combinations active';
  T('archiveCoreList').textContent = Object.entries(
    archiveCoreBlessings(archiveBuildUI.guardian.floor)
  )
    .map(([id, rank]) => POOL.find((o) => o.id === id).name + ' ' + rank)
    .join(' · ');
  for (const p of ARCHIVE_BUILD_PRESETS) {
    const cards = archivePresetCards(p);
    if (Object.keys(cards).length < 2 || !archiveEquippedCombos(cards).length) continue;
    const b = archiveBuildButton('', 'archive-preset-' + p.id, () => archiveSelectPreset(p.id));
    b.className = 'archive-preset';
    b.dataset.family = p.family;
    b.setAttribute('aria-pressed', String(build.preset === p.id));
    const text = archiveBuildElement('div');
    text.append(archiveBuildElement('strong', '', p.name), archiveBuildElement('small', '', p.ds));
    b.append(archiveBuildEmblem(p.family), text);
    presets.append(b);
  }
  const list = T('archiveSelectedBlessings');
  list.replaceChildren();
  for (const [id, rank] of Object.entries(build.up)) {
    const card = POOL.find((o) => o.id === id);
    if (!card) continue;
    const row = archiveBuildElement('article', 'archive-selected-blessing');
    row.dataset.r = card.r;
    row.append(archiveBuildElement('span', '', card.name), archiveRankControls(card, rank, true));
    list.append(row);
  }
  if (!list.children.length)
    list.append(
      archiveBuildElement(
        'p',
        '',
        'Choose a combination or add blessings below. The core loadout remains equipped.'
      )
    );
  const active = T('archiveActiveCombos');
  active.replaceChildren();
  for (const combo of combos) {
    const item = archiveBuildElement('article', 'archive-active-combo');
    item.append(
      archiveBuildEmblem(combo.family),
      archiveBuildElement('strong', '', combo.name),
      archiveBuildElement('p', '', combo.ds)
    );
    active.append(item);
  }
  if (!combos.length)
    active.append(
      archiveBuildElement(
        'p',
        '',
        'No combinations equipped yet. Each combination activates when its blessings are present.'
      )
    );
  for (const tab of T('archiveBuildTabs').querySelectorAll('button')) {
    const on = tab.dataset.archiveTab === archiveBuildUI.tab;
    tab.classList.toggle('selected', on);
    tab.setAttribute('aria-selected', String(on));
  }
  renderArchiveBuildCatalog();
  if (focusId) T(focusId)?.focus({ preventScroll: true });
}
function renderArchiveBuildCatalog() {
  const list = T('archiveBuildCatalog'),
    build = archivePracticeBuild(),
    search = archiveBuildUI.search.trim().toLowerCase();
  list.replaceChildren();
  if (archiveBuildUI.tab === 'combos') {
    list.className = 'archive-combo-catalog';
    for (const combo of archiveAvailableCombos()) {
      const names = combo.cards.map((id) => POOL.find((o) => o.id === id).name),
        active = archiveEquippedCombos().some((c) => c.id === combo.id);
      if (
        search &&
        !(combo.name + ' ' + combo.ds + ' ' + names.join(' ')).toLowerCase().includes(search)
      )
        continue;
      const card = archiveBuildElement('article', 'archive-combo-choice');
      card.dataset.active = String(active);
      card.append(
        archiveBuildEmblem(combo.family),
        archiveBuildElement('h4', '', combo.name),
        archiveBuildElement('p', '', combo.ds),
        archiveBuildElement('small', '', names.join(' + '))
      );
      const button = archiveBuildButton(
        active ? 'EQUIPPED' : 'EQUIP COMBINATION',
        'archive-combo-' + combo.id,
        () => archiveEquipCombo(combo.id)
      );
      button.disabled = active;
      card.append(button);
      list.append(card);
    }
  } else {
    list.className = 'archive-card-catalog';
    for (const card of POOL.filter(archiveSelectableCard).sort(
      (a, b) => a.r - b.r || a.name.localeCompare(b.name)
    )) {
      if (search && !(card.name + ' ' + card.ds).toLowerCase().includes(search)) continue;
      const row = archiveBuildElement('article', 'archive-blessing-choice');
      row.dataset.r = card.r;
      row.append(
        archiveBuildElement('small', '', RARITY[card.r].n),
        archiveBuildElement('h4', '', card.name),
        archiveBuildElement('p', '', card.ds),
        archiveRankControls(card, build.up[card.id] || 0)
      );
      list.append(row);
    }
  }
  if (!list.children.length)
    list.append(
      archiveBuildElement(
        'p',
        'archive-empty',
        'No matches. Try another blessing, effect, or combination name.'
      )
    );
}
function openGuardianPracticeBuild(key, difficulty = 'standard', from = 'guardianArchive') {
  const g = GUARDIAN_ROSTER.find((o) => o.key === key);
  if (
    !g ||
    !guardianUnlocked(g) ||
    (difficulty === 'ascendant' && !archiveRecord(key, 'standard').wins)
  )
    return;
  archiveBuildUI.guardian = g;
  archiveBuildUI.difficulty = difficulty === 'ascendant' ? 'ascendant' : 'standard';
  archiveBuildUI.from = from;
  archiveBuildUI.search = '';
  archiveBuildUI.tab = 'combos';
  hide(from);
  show('guardianBuildPanel');
  T('archiveBuildGuardian').textContent = g.name;
  T('archiveBuildPlace').textContent = g.place;
  T('archiveBuildDifficulty').textContent =
    difficulty === 'ascendant' ? 'ASCENDANT · +35% HEALTH · +15% DAMAGE' : 'TRUE FORM';
  T('archiveBuildSearch').value = '';
  archiveBuildStatus('Choose a ready build or customize its blessings.');
  drawGuardianArchivePortrait(T('archiveBuildPortrait'), g);
  renderArchivePracticeBuild();
  T('archiveBuildStart').focus({ preventScroll: true });
}
function closeGuardianPracticeBuild() {
  hide('guardianBuildPanel');
  show(archiveBuildUI.from);
  T(
    archiveBuildUI.from === 'guardianModeResult' ? 'guardianChangeBuild' : 'guardianArchiveClose'
  )?.focus({ preventScroll: true });
  archiveBuildUI.guardian = null;
}
function installArchiveBuildSelector() {
  if (T('guardianBuildPanel')) return;
  const el = archiveBuildElement('div', 'ov guardian-overlay');
  el.id = 'guardianBuildPanel';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-labelledby', 'archiveBuildGuardian');
  el.innerHTML =
    '<section class="guardian-shell archive-build-shell"><header><div><span class="guardian-kicker">GUARDIAN ARCHIVE · PRACTICE BUILD</span><h2 id="archiveBuildGuardian"></h2><p id="archiveBuildPlace"></p></div><button class="guardian-x" id="archiveBuildBack" aria-label="Back to guardians">×</button></header><div class="archive-build-layout"><aside class="archive-build-sidebar"><canvas id="archiveBuildPortrait" width="280" height="160"></canvas><strong id="archiveBuildDifficulty"></strong><h3 id="archiveBuildName"></h3><p id="archiveBuildCount"></p><p class="archive-core-note">Damage, health, casting, charges, and recovery scale with this guardian. Your Skill Tree and equipped Forms also apply.</p><details><summary>Core blessings included</summary><p id="archiveCoreList"></p></details><h4>YOUR BLESSINGS</h4><div id="archiveSelectedBlessings"></div></aside><div class="archive-build-editor"><h3>Choose a build</h3><div id="archiveBuildPresets"></div><details class="archive-customize" id="archiveCustomize"><summary>Customize combinations &amp; blessings</summary><div id="archiveBuildTabs" role="tablist" aria-label="Build choices"><button role="tab" data-archive-tab="combos">COMBINATIONS</button><button role="tab" data-archive-tab="cards">BLESSINGS</button></div><label class="archive-search-label" for="archiveBuildSearch">Find a blessing or effect</label><input id="archiveBuildSearch" type="search" maxlength="80" placeholder="Search names or effects…"><div id="archiveBuildCatalog"></div></details><h3>Active combinations</h3><div id="archiveActiveCombos"></div></div></div><footer class="archive-build-footer"><p id="archiveBuildStatus" role="status" aria-live="polite"></p><div><button class="btn subtle" id="archiveBuildCancel">BACK</button><button class="btn primary" id="archiveBuildStart">BEGIN PRACTICE</button></div><small>Free practice. These blessings stay in the Archive. Your saved descent and Essence are kept.</small></footer></section>';
  document.body.append(el);
  for (const summary of el.querySelectorAll('summary')) summary.tabIndex = 0;
  T('archiveBuildBack').onclick = T('archiveBuildCancel').onclick = closeGuardianPracticeBuild;
  T('archiveBuildStart').onclick = () => {
    const g = archiveBuildUI.guardian;
    if (!g) return;
    const difficulty = archiveBuildUI.difficulty;
    hide('guardianBuildPanel');
    archiveBuildUI.guardian = null;
    startGuardianPractice(g.key, difficulty);
  };
  T('archiveBuildSearch').oninput = () => {
    archiveBuildUI.search = T('archiveBuildSearch').value;
    renderArchiveBuildCatalog();
  };
  for (const button of T('archiveBuildTabs').querySelectorAll('button'))
    button.onclick = () => {
      archiveBuildUI.tab = button.dataset.archiveTab;
      renderArchivePracticeBuild();
      button.focus({ preventScroll: true });
    };
  const change = archiveBuildButton('CHANGE BUILD', 'guardianChangeBuild', () => {
    const gm = G.run?.guardianMode,
      g = GUARDIAN_ROSTER[gm?.index];
    if (G.run?.mode === 'practice' && g)
      openGuardianPracticeBuild(g.key, gm.difficulty, 'guardianModeResult');
  });
  change.hidden = true;
  T('guardianResultPrimary').after(change);
}
const archiveBuildInstall = installGuardianModes;
installGuardianModes = function () {
  archiveBuildInstall();
  installArchiveBuildSelector();
};
const archiveBuildValidate = validateSave;
validateSave = function (raw) {
  const clean = archiveBuildValidate(raw);
  clean.guardianPracticeBuild = cleanArchivePracticeBuild(raw?.guardianPracticeBuild);
  return clean;
};
const archiveBuildCreate = createGuardianModeRun;
createGuardianModeRun = function (mode, floor, difficulty, comboId) {
  const out = archiveBuildCreate(mode, floor, difficulty, comboId);
  T('guardianChangeBuild').hidden = mode !== 'practice';
  if (mode === 'practice') G.run.guardianMode.practiceBuild = deepCopy(archivePracticeBuild());
  return out;
};
const archiveBuildResult = showGuardianPracticeResult;
showGuardianPracticeResult = function (g, won, elapsed) {
  archiveBuildResult(g, won, elapsed);
  T('guardianChangeBuild').hidden = false;
  T('guardianResultText').textContent =
    archivePracticeName(G.run.guardianMode.practiceBuild) +
    ' · ' +
    (won
      ? 'Practice clear saved. No Essence was awarded.'
      : 'Adjust your blessings or try the same build again.');
};
const archiveBuildBlocking = anyBlockingOverlay;
anyBlockingOverlay = function () {
  return T('guardianBuildPanel')?.classList.contains('open') || archiveBuildBlocking();
};
const archiveBuildEscape = onEscKey;
onEscKey = function () {
  if (T('guardianBuildPanel')?.classList.contains('open')) {
    closeGuardianPracticeBuild();
    return;
  }
  return archiveBuildEscape();
};
const archiveBuildControllerBack = controllerBack;
controllerBack = function (scope) {
  if (scope?.id === 'guardianBuildPanel') {
    closeGuardianPracticeBuild();
    return;
  }
  return archiveBuildControllerBack(scope);
};
const archiveBuildMenu = backToMenu;
backToMenu = function () {
  T('guardianBuildPanel')?.classList.remove('open');
  archiveBuildUI.guardian = null;
  return archiveBuildMenu();
};
