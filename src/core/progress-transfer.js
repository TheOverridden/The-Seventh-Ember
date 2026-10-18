'use strict';
const DEMO_TRANSFER_FORMAT = 'the-seventh-ember-demo-transfer';
let pendingDemoTransfer = null;
function validDemoProfileId(id) {
  return (
    typeof id === 'string' &&
    /^[a-zA-Z0-9][a-zA-Z0-9_-]{7,99}$/.test(id) &&
    !['constructor', 'prototype'].includes(id)
  );
}
function cleanDemoTransfers(raw) {
  const clean = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return clean;
  for (const [id, record] of Object.entries(raw)) {
    if (!validDemoProfileId(id) || !record || typeof record !== 'object') continue;
    clean[id] = {
      essence: Math.max(0, Math.min(1e9, Math.floor(Number(record.essence) || 0))),
      at: Math.max(0, Math.min(Date.now(), Math.floor(Number(record.at) || 0))),
    };
  }
  return clean;
}
const transferValidateSave = validateSave;
validateSave = function (raw) {
  const clean = transferValidateSave(raw);
  clean.demoTransfers = cleanDemoTransfers(raw?.demoTransfers);
  return clean;
};
function mergeDemoRecord(current, incoming) {
  if (incoming === true) return true;
  if (typeof incoming === 'number') return Math.max(Number(current) || 0, incoming);
  if (typeof incoming === 'string') return current || incoming;
  if (Array.isArray(incoming)) {
    const values = [...(Array.isArray(current) ? current : []), ...incoming];
    return [...new Map(values.map((value) => [JSON.stringify(value), value])).values()];
  }
  if (incoming && typeof incoming === 'object') {
    const out = { ...(current || {}) };
    for (const [key, value] of Object.entries(incoming))
      out[key] = mergeDemoRecord(out[key], value);
    return out;
  }
  return current ?? incoming;
}
function previewDemoTransfer(record, current = save) {
  if (
    record?.format !== DEMO_TRANSFER_FORMAT ||
    record.version !== 1 ||
    record.progressionEpoch !== SAVE_PROGRESSION_EPOCH ||
    !validDemoProfileId(record.profileId) ||
    !record.profile ||
    record.checksum !== saveHash(JSON.stringify(record.profile))
  )
    throw Error('This demo progress file could not be verified.');
  const incoming = validateSave({ ...record.profile, resume: null, guardianSession: null });
  const merged = JSON.parse(JSON.stringify(current));
  const ledger = cleanDemoTransfers(current.demoTransfers);
  const alreadyImported = Object.hasOwn(ledger, record.profileId);
  const essence = alreadyImported ? 0 : Math.min(1e9, incoming.essence);
  merged.essence = Math.min(1e12, merged.essence + essence);
  for (const key of ['nodes', 'forms', 'armory', 'story', 'achievements', 'onboarding'])
    merged[key] = mergeDemoRecord(merged[key], incoming[key]);
  for (const key of [
    'bestFloor',
    'bestLevel',
    'totalRuns',
    'totalKills',
    'totalEssence',
    'guardians',
  ])
    merged[key] = Math.max(merged[key] || 0, incoming[key] || 0);
  if (incoming.hearth) {
    merged.hearth ||= {};
    merged.hearth.keptCosmetics = mergeDemoRecord(
      merged.hearth.keptCosmetics,
      incoming.hearth.keptCosmetics
    );
    merged.hearth.trials ||= {};
    for (const [id, record] of Object.entries(incoming.hearth.trials || {})) {
      const old = merged.hearth.trials[id];
      const next = mergeDemoRecord(old, record);
      if (old?.bestTime > 0 && record.bestTime > 0)
        next.bestTime = Math.min(old.bestTime, record.bestTime);
      if (Number.isFinite(old?.bestHits) && Number.isFinite(record.bestHits))
        next.bestHits = Math.min(old.bestHits, record.bestHits);
      merged.hearth.trials[id] = next;
    }
  }
  for (const [key, records] of Object.entries(incoming.guardianRecords || {})) {
    merged.guardianRecords ||= {};
    merged.guardianRecords[key] ||= {};
    for (const [difficulty, record] of Object.entries(records)) {
      const old = merged.guardianRecords[key][difficulty];
      const next = mergeDemoRecord(old, record);
      if (old?.bestTime > 0 && record.bestTime > 0)
        next.bestTime = Math.min(old.bestTime, record.bestTime);
      if (Number.isFinite(old?.bestHits) && Number.isFinite(record.bestHits))
        next.bestHits = Math.min(old.bestHits, record.bestHits);
      merged.guardianRecords[key][difficulty] = next;
    }
  }
  ledger[record.profileId] = {
    essence: ledger[record.profileId]?.essence ?? essence,
    at: Date.now(),
  };
  merged.demoTransfers = ledger;
  const result = validateSave(merged);
  result.resume = current.resume;
  result.guardianSession = current.guardianSession;
  const newNodes = Object.keys(result.nodes).filter((id) => !current.nodes[id]).length;
  const newForms = Object.keys(result.forms || {}).filter((id) => !current.forms?.[id]).length;
  return {
    profileId: record.profileId,
    save: result,
    essence,
    newNodes,
    newForms,
    alreadyImported,
  };
}
function downloadProgressFile(value, name) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function demoExportTransfer() {
  if (!window.EMBER_DEMO || !save.demo?.profileId || saveNow('demo-transfer-export') === false)
    return false;
  const profile = validateSave(permanentSaveCopy(save));
  profile.resume = null;
  profile.guardianSession = null;
  delete profile.demo;
  delete profile.demoTransfers;
  const record = {
    format: DEMO_TRANSFER_FORMAT,
    version: 1,
    progressionEpoch: SAVE_PROGRESSION_EPOCH,
    profileId: save.demo.profileId,
    exportedAt: Date.now(),
    profile,
    checksum: saveHash(JSON.stringify(profile)),
  };
  downloadProgressFile(
    record,
    'the-seventh-ember-demo-progress-' + new Date().toISOString().slice(0, 10) + '.json'
  );
  return true;
}
const transferPreviewImport = previewSaveImport;
previewSaveImport = async function (file) {
  pendingDemoTransfer = null;
  if (!file) return;
  const request = ++saveImportRequest;
  pendingImport = null;
  T('importReview').hidden = true;
  try {
    if (file.size > 1500000) throw Error('This progress file is too large.');
    const raw = JSON.parse(await file.text());
    if (request !== saveImportRequest) return;
    if (raw?.format === DEMO_TRANSFER_FORMAT) {
      if (window.EMBER_DEMO)
        throw Error(
          'Import this progress file in the full game. To restore the demo, use its save backup.'
        );
      pendingDemoTransfer = { record: raw, preview: previewDemoTransfer(raw) };
      const summary = pendingDemoTransfer.preview;
      T('importSummary').textContent =
        'Merge demo progress: ' +
        summary.newNodes +
        ' new sigils, ' +
        summary.newForms +
        ' new Forms, earned cosmetics and discoveries, and ' +
        summary.essence +
        ' Essence. Your current descent and Boss Rush checkpoints stay in place.' +
        (summary.alreadyImported
          ? ' This profile’s Essence was already transferred; unlocks can still merge.'
          : ' Essence transfers once per demo profile.');
      T('btnImportApply').textContent = 'MERGE DEMO PROGRESS';
      T('importReview').hidden = false;
      T('saveFile').value = '';
      return;
    }
    if (!window.EMBER_DEMO && raw?.edition === 'demo')
      throw Error(
        'Use Export Demo Progress in the demo to merge progress safely. This file is a demo backup.'
      );
    if (window.EMBER_DEMO && raw?.edition !== 'demo')
      throw Error('This is a full-game save. It has not been imported into the demo.');
    T('btnImportApply').textContent = 'RESTORE SAVE';
    return transferPreviewImport(file);
  } catch (error) {
    if (request !== saveImportRequest) return;
    T('settingsSave').textContent = error.message || 'That progress file could not be read.';
    T('settingsSave').classList.add('warning');
    T('saveFile').value = '';
  }
};
function installDemoTransfer() {
  if (T('btnImportApply').dataset.demoTransfer) return;
  T('btnImportApply').dataset.demoTransfer = 'true';
  T('btnImportApply').addEventListener(
    'click',
    (event) => {
      if (!pendingDemoTransfer || G.state !== 'menu') return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const previous = save;
      try {
        const merged = previewDemoTransfer(pendingDemoTransfer.record);
        save = merged.save;
        if (saveNow('demo-progress-import') === false) {
          save = previous;
          throw Error('Progress could not be saved. Your current profile is unchanged.');
        }
        pendingDemoTransfer = null;
        pendingImport = null;
        saveImportRequest++;
        META = computeMeta();
        refreshMenuStats();
        syncSettings();
        T('importReview').hidden = true;
      } catch (error) {
        save = previous;
        T('settingsSave').textContent = error.message;
        T('settingsSave').classList.add('warning');
      }
    },
    true
  );
  on(T('btnImportCancel'), 'click', () => {
    pendingDemoTransfer = null;
  });
  if (window.EMBER_DEMO) {
    const exportButton = document.createElement('button');
    exportButton.type = 'button';
    exportButton.id = 'btnDemoTransfer';
    exportButton.className = 'btn';
    exportButton.textContent = 'EXPORT DEMO PROGRESS';
    T('btnExport').after(exportButton);
    on(exportButton, 'click', demoExportTransfer);
    T('btnExport').textContent = 'EXPORT DEMO BACKUP';
  }
}
const transferInit = init;
init = function () {
  const result = transferInit();
  installDemoTransfer();
  return result;
};
