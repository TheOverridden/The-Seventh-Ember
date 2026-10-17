'use strict';
const WICK_GUIDE_VERSION = 2;
const WICK_GUIDE_LAST_STEP = 12;

function cleanWickGuide(raw, contextSave = {}) {
  const record = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : null;
  const begun =
    !!contextSave.resume ||
    !!contextSave.guardianSession ||
    [
      'totalRuns',
      'bestFloor',
      'totalKills',
      'totalEssence',
      'essence',
      'guardians',
      'victories',
    ].some((key) => Number.isFinite(contextSave[key]) && contextSave[key] > 0) ||
    Object.values(contextSave.nodes || {}).some((owned) => owned === true);
  const complete = record?.complete === true,
    savedStep = Number.isFinite(record?.step)
      ? Math.max(0, Math.min(WICK_GUIDE_LAST_STEP, Math.floor(record.step)))
      : 0,
    step =
      record && !(record.version >= WICK_GUIDE_VERSION)
        ? [0, 2, 3, 4, 6, 8][Math.min(5, savedStep)]
        : savedStep,
    tourStarted = record?.tourStarted === true || complete || step > 0;
  return {
    version: WICK_GUIDE_VERSION,
    descentStarted: record ? record.descentStarted === true || tourStarted : begun,
    tourStarted,
    step,
    complete,
    rushSeen: record?.rushSeen === true,
    menuLocked: complete
      ? false
      : typeof record?.menuLocked === 'boolean'
        ? record.menuLocked
        : !begun,
  };
}

const wickGuideValidateSave = validateSave;
validateSave = function (raw) {
  const clean = wickGuideValidateSave(raw);
  clean.wickGuide = cleanWickGuide(raw?.wickGuide, clean);
  return clean;
};

function wickGuideData() {
  return (save.wickGuide = cleanWickGuide(save.wickGuide, save));
}

function wickGuideUpdate(patch, reason = 'wick-guide') {
  const previous = wickGuideData(),
    next = cleanWickGuide({ ...previous, ...patch }, save);
  for (const key of ['descentStarted', 'tourStarted', 'complete', 'rushSeen'])
    next[key] = previous[key] || next[key];
  next.step = Math.max(previous.step, next.step);
  next.menuLocked = previous.menuLocked && !next.complete;
  save.wickGuide = cleanWickGuide(next, save);
  return saveNow(reason) !== false;
}
