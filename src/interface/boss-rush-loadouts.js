'use strict';

const rushComboUI = { selected: null, search: '' };

function bossRushCombos() {
  return BLESSING_COMBOS.filter((combo) =>
    !['mothlight', 'cinderMoths', 'soulLantern'].includes(combo.id) &&
    combo.cards.every((id) => POOL.some((c) => c.id === id))
  );
}
function cleanBossRushComboId(id) {
  const combos = bossRushCombos();
  return (
    combos.find((c) => c.id === id)?.id ||
    combos.find((c) => c.id === 'thermalShock')?.id ||
    combos[0]?.id ||
    null
  );
}
function bossRushSelectedCombo() {
  return cleanBossRushComboId(save.bossRushCombo);
}
function bossRushComboBlessings(id) {
  const combo = bossRushCombos().find((c) => c.id === cleanBossRushComboId(id));
  return Object.fromEntries(
    (combo?.cards || []).map((id) => [id, POOL.find((c) => c.id === id).max])
  );
}
function bossRushComboLabel(id) {
  return bossRushCombos().find((c) => c.id === cleanBossRushComboId(id))?.name || '';
}
function bossRushComboCardNames(combo) {
  return combo.cards
    .map((id) => {
      const card = POOL.find((c) => c.id === id);
      return card.name + ' · rank ' + card.max;
    })
    .join(' + ');
}
function renderBossRushComboSummary() {
  const summary = T('rushComboSummary');
  if (!summary) return;
  const combo = bossRushCombos().find((c) => c.id === bossRushSelectedCombo());
  summary.replaceChildren();
  if (!combo) return;
  const text = archiveBuildElement('div');
  text.append(
    archiveBuildElement('small', '', 'RUN COMBINATION'),
    archiveBuildElement('h3', '', combo.name),
    archiveBuildElement('p', '', combo.ds),
    archiveBuildElement('small', '', bossRushComboCardNames(combo))
  );
  const button = archiveBuildButton(
    'CHOOSE COMBINATION',
    'rushComboChoose',
    openBossRushComboPicker
  );
  button.disabled = !(save.campaignMedal || save.victories > 0);
  summary.append(archiveBuildEmblem(combo.family), text, button);
  const session = save.guardianSession;
  T('rushSavedCombo').textContent =
    session?.mode === 'rush'
      ? 'Saved run: ' + bossRushComboLabel(session.comboId) + '. Continuing keeps that combination.'
      : '';
  T('rushSavedCombo').hidden = session?.mode !== 'rush';
}
function renderBossRushComboPicker(focusId) {
  const grid = T('rushComboGrid'),
    search = rushComboUI.search.trim().toLowerCase();
  grid.replaceChildren();
  for (const combo of bossRushCombos()) {
    const names = bossRushComboCardNames(combo);
    if (search && !(combo.name + ' ' + combo.ds + ' ' + names).toLowerCase().includes(search))
      continue;
    const button = archiveBuildButton('', 'rush-combo-' + combo.id, () => {
      rushComboUI.selected = combo.id;
      renderBossRushComboPicker('rush-combo-' + combo.id);
    });
    button.className = 'rush-combo-choice';
    button.setAttribute('aria-pressed', String(rushComboUI.selected === combo.id));
    const text = archiveBuildElement('div');
    text.append(
      archiveBuildElement('strong', '', combo.name),
      archiveBuildElement('p', '', combo.ds),
      archiveBuildElement('small', '', names)
    );
    button.append(archiveBuildEmblem(combo.family), text);
    grid.append(button);
  }
  if (!grid.children.length)
    grid.append(
      archiveBuildElement(
        'p',
        'archive-empty',
        'No matching combinations. Try a blessing name or effect.'
      )
    );
  const combo = bossRushCombos().find((c) => c.id === rushComboUI.selected);
  T('rushComboStatus').textContent = combo
    ? combo.name + ' · both blessings at full rank for the whole Rush.'
    : 'Choose one combination.';
  T('rushComboConfirm').disabled = !combo;
  if (focusId) T(focusId)?.focus({ preventScroll: true });
}
function openBossRushComboPicker() {
  if (!(save.campaignMedal || save.victories > 0) || G.run?.mode === 'rush') return;
  rushComboUI.selected = bossRushSelectedCombo();
  rushComboUI.search = '';
  T('rushComboSearch').value = '';
  hide('bossRushPanel');
  show('rushComboPanel');
  renderBossRushComboPicker();
  T('rushComboSearch').focus({ preventScroll: true });
}
function closeBossRushComboPicker() {
  hide('rushComboPanel');
  show('bossRushPanel');
  renderBossRushPanel();
  T('rushComboChoose')?.focus({ preventScroll: true });
}
function confirmBossRushCombo() {
  if (!T('rushComboPanel')?.classList.contains('open') || G.run?.mode === 'rush') return;
  save.bossRushCombo = cleanBossRushComboId(rushComboUI.selected);
  saveNow('boss-rush-combination');
  closeBossRushComboPicker();
}
function installBossRushComboPicker() {
  if (!T('bossRushPanel') || T('rushComboPanel')) return;
  const summary = archiveBuildElement('section', 'rush-combo-summary');
  summary.id = 'rushComboSummary';
  T('bossRushPanel').querySelector('.rush-choices').before(summary);
  const saved = archiveBuildElement('p', 'rush-saved-combo');
  saved.id = 'rushSavedCombo';
  T('continueBossRush').after(saved);
  T('bossRushPanel').querySelector('header p').textContent =
    'Face every guardian in one run. Choose one blessing combination to add to the Rush loadout. Your Skill Tree and equipped Forms also apply.';
  const panel = archiveBuildElement('div', 'ov guardian-overlay');
  panel.id = 'rushComboPanel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'rushComboTitle');
  panel.innerHTML =
    '<section class="guardian-shell rush-combo-shell"><header><div><span class="guardian-kicker">BOSS RUSH · ONE CHOICE FOR THE RUN</span><h2 id="rushComboTitle">Choose your combination</h2><p>Both blessings start at full rank. Keep them through every guardian, rest, and saved checkpoint, alongside the standard Rush loadout and boons.</p></div><button class="guardian-x" id="rushComboBack" aria-label="Back to Boss Rush">×</button></header><label for="rushComboSearch">Find a combination, blessing, or effect</label><input type="search" id="rushComboSearch" maxlength="80" placeholder="Search combinations…"><div id="rushComboGrid"></div><footer><p id="rushComboStatus" role="status" aria-live="polite"></p><div><button class="btn subtle" id="rushComboCancel">BACK</button><button class="btn primary" id="rushComboConfirm">USE COMBINATION</button></div></footer></section>';
  document.body.append(panel);
  T('rushComboBack').onclick = T('rushComboCancel').onclick = closeBossRushComboPicker;
  T('rushComboConfirm').onclick = confirmBossRushCombo;
  T('rushComboSearch').oninput = () => {
    rushComboUI.search = T('rushComboSearch').value;
    renderBossRushComboPicker();
  };
}
const rushComboInstall = installGuardianModes;
installGuardianModes = function () {
  rushComboInstall();
  installBossRushComboPicker();
};
const rushComboRenderPanel = renderBossRushPanel;
renderBossRushPanel = function () {
  rushComboRenderPanel();
  renderBossRushComboSummary();
};
const rushComboValidate = validateSave;
validateSave = function (raw) {
  const clean = rushComboValidate(raw);
  clean.bossRushCombo = cleanBossRushComboId(raw?.bossRushCombo);
  return clean;
};
const rushComboBlocking = anyBlockingOverlay;
anyBlockingOverlay = function () {
  return T('rushComboPanel')?.classList.contains('open') || rushComboBlocking();
};
const rushComboEscape = onEscKey;
onEscKey = function () {
  if (T('rushComboPanel')?.classList.contains('open')) return closeBossRushComboPicker();
  return rushComboEscape();
};
const rushComboControllerBack = controllerBack;
controllerBack = function (scope) {
  if (scope?.id === 'rushComboPanel') return closeBossRushComboPicker();
  return rushComboControllerBack(scope);
};
const rushComboMenu = backToMenu;
backToMenu = function () {
  T('rushComboPanel')?.classList.remove('open');
  return rushComboMenu();
};
