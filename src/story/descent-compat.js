let activeMemoryEcho = null;

function cleanArchiveMemory(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const out = {
    version: 2,
    echoes: {},
    skipped: {},
    guardians: {},
    guardianOrder: [],
    rooms: { cleared: 0, protected: 0, failed: 0 },
    flames: {},
    events: [],
  };
  const number = (n, max) => (Number.isFinite(Number(n)) ? clamp(Number(n), 0, max) : 0);
  for (const [id, item] of Object.entries(src.echoes || {}).slice(0, 100)) {
    if (!/^(echo|trace)([1-9]|[1-4][0-9]|50)$/.test(id) || !item || typeof item !== 'object')
      continue;
    out.echoes[id] = {
      seen: !!item.seen,
      completed: !!item.completed,
      interrupted: !!item.interrupted,
      focus: ['people', 'evidence', 'distance'].includes(item.focus) ? item.focus : 'distance',
      dwell: number(item.dwell, 120),
      visits: Math.max(1, Math.floor(number(item.visits, 99))),
      floor: Math.max(1, Math.floor(number(item.floor, 100000))),
    };
  }
  for (const [id, value] of Object.entries(src.skipped || {}).slice(0, 100))
    if (/^(echo|trace)([1-9]|[1-4][0-9]|50)$/.test(id) && value === true) out.skipped[id] = true;
  for (const [key, item] of Object.entries(src.guardians || {}).slice(0, 40)) {
    if (!item || typeof item !== 'object' || key.length > 80) continue;
    out.guardians[key] = {
      floor: Math.max(1, Math.floor(number(item.floor, 100000))),
      method: ['distance', 'close', 'flare', 'other'].includes(item.method) ? item.method : 'other',
      hits: Math.floor(number(item.hits, 9999)),
      health: number(item.health, 1),
    };
  }
  if (Array.isArray(src.guardianOrder))
    out.guardianOrder = src.guardianOrder
      .filter((key) => typeof key === 'string' && out.guardians[key])
      .slice(-30);
  for (const key of ['cleared', 'protected', 'failed'])
    out.rooms[key] = Math.floor(number(src.rooms?.[key], 99999));
  for (const [key, value] of Object.entries(src.flames || {}).slice(0, 100))
    if (/^\d{1,6}$/.test(key) && value === true) out.flames[key] = true;
  if (Array.isArray(src.events))
    out.events = src.events
      .filter((item) => item && typeof item.kind === 'string' && Number.isFinite(item.floor))
      .slice(-80)
      .map((item) => ({
        kind: item.kind.slice(0, 60),
        floor: Math.max(1, Math.floor(number(item.floor, 100000))),
        detail: String(item.detail || '').slice(0, 80),
      }));
  return out;
}

function archiveData() {
  const story = storyData();
  if (!story.archive || typeof story.archive !== 'object') story.archive = cleanArchiveMemory(null);
  return story.archive;
}

function archiveProfile() {
  const archive = archiveData();
  return {
    witness: 0,
    shelter: 0,
    defiance: 0,
    severance: 0,
    dominant: '',
    confidence: 0,
    recovered: Object.values(archive.echoes || {}).filter((item) => item.completed).length,
    interrupted: Object.values(archive.echoes || {}).filter((item) => item.interrupted).length,
    skipped: Object.keys(archive.skipped || {}).length,
    lastGuardian: archive.guardianOrder?.at(-1) || '',
  };
}

function storyChoice() {
  return -1;
}
function storyProfile() {
  return { choices: {}, mercy: 0, resolve: 0, trust: 0, count: 0, answer: '' };
}
function archiveSignal() {
  return false;
}
function archiveEvent() {
  return false;
}
function nearestTrace() {
  return null;
}
function drawEchoArtifact() {}
function advanceMemory() {}
function toggleMemoryPlayback() {}
function replayMemoryPlayback() {}
function closeRememberedTrace() {
  activeMemoryEcho = null;
  if (G.state === 'echo') setState('paused');
  document.body.classList.remove('remembering');
}
function openTrace() {
  if (typeof openDescentJournal === 'function') openDescentJournal();
  return false;
}
function prepareEchoSanctuaries() {
  const world = G.world;
  if (!world) return;
  for (const key of ['fixtures', 'lateFixtures'])
    if (Array.isArray(world[key]))
      world[key] = world[key].filter((item) => item.kind !== 'echo' && item.kind !== 'trace');
  world.echoSanctuaries = [];
}

const descentLegacyCheckpoint = validateCheckpoint;
validateCheckpoint = function (checkpoint) {
  const world = checkpoint?.world;
  if (world) {
    for (const key of ['fixtures', 'lateFixtures']) {
      if (Array.isArray(world[key]))
        world[key] = world[key].filter(
          (item) =>
            !(
              ['echo', 'trace'].includes(item?.kind) &&
              /^(echo|trace)([1-9]|[1-4][0-9]|50)$/.test(item.id)
            )
        );
    }
    if (/^(echo|trace)([1-9]|[1-4][0-9]|50)$/.test(checkpoint.dialogue?.id))
      checkpoint.dialogue = null;
  }
  return descentLegacyCheckpoint(checkpoint);
};

const descentLegacyValidateSave = validateSave;
validateSave = function (raw) {
  const clean = descentLegacyValidateSave(raw);
  clean.story = clean.story || { seen: {}, choices: {} };
  if (raw?.story?.archive) clean.story.archive = cleanArchiveMemory(raw.story.archive);
  return clean;
};
