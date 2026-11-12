let traceReturn = 'playing';
function nearestTrace() {
  const list = G.world?.region === 'late' ? G.world.lateFixtures : G.world?.fixtures;
  if (!list || !G.player) return null;
  let best = null,
    dist = 72 ** 2;
  for (const o of list) {
    if (o.kind !== 'echo' && o.kind !== 'trace') continue;
    const dd = d2(o.x, o.y, G.player.x, G.player.y);
    if (dd < dist) {
      dist = dd;
      best = o;
    }
  }
  return best;
}

const LATE_BOSS_SPEAKERS = new Map([
  ['The Bellkeeper', 'bellkeeper'],
  ['The Ember Colossus', 'colossus'],
  ['The Glass Astronomer', 'astronomer'],
  ['The Pale Scribe', 'scribe'],
  ['The First Regent', 'regents'],
  ['The Second Regent', 'regents'],
  ['The Void Seraph', 'seraph'],
  ['The Obsidian Tyrant', 'tyrant'],
  ['The First Keeper', 'keeper'],
]);
const beforeLateSpeakerKind = speakerKind;
speakerKind = function (name) {
  return LATE_BOSS_SPEAKERS.has(name) ? 'guardian' : beforeLateSpeakerKind(name);
};
const beforeLateRenderDialogueLine = renderDialogueLine;
renderDialogueLine = function () {
  beforeLateRenderDialogueLine();
  if (dialogue && speakerKind(dialogue.lines[dialogue.index].speaker) === 'guardian') {
    const k = LATE_BOSS_SPEAKERS.get(dialogue.lines[dialogue.index].speaker);
    T('speakerTag').textContent = k === 'bellkeeper' ? 'THE CISTERN' : 'THE DEEP';
  }
};

const LATE_AFTER = new Set([
  'bellkeeperAfter',
  'colossusAfter',
  'astronomerAfter',
  'scribeAfter',
  'regentsAfter',
  'seraphAfter',
  'tyrantAfter',
  'keeperAfter',
]);
const beforeLateFinishDialogue = finishDialogue;
finishDialogue = function () {
  const d = dialogue ? { id: dialogue.id, replay: dialogue.replay } : null;
  beforeLateFinishDialogue();
  if (d && !d.replay && LATE_AFTER.has(d.id) && G.run && !G.dead) {
    G.run.lateClearShown = G.floor;
    showChapterClear();
    saveNow();
  }
};
const beforeLateChapterClear = showChapterClear;
showChapterClear = function () {
  const region = lateRegion(G.floor);
  if (!region) {
    beforeLateChapterClear();
    return;
  }
  setState('chapter');
  T('chapterSeal').textContent = roman(region.stage);
  T('chapterCompleteLabel').textContent = 'STAGE ' + roman(region.stage) + ' COMPLETE';
  T('chapterCompleteTitle').textContent = region.name;
  T('chapterCompleteText').textContent = CHAPTER_EXIT_TEXT[G.floor] || '';
  T('chapterQuote').textContent = '';
  T('chapterQuote').hidden = true;
  T('chapterContinue').textContent = G.floor === 50 ? 'FINISH DESCENT' : 'DESCEND';
  statBoxes(T('chapterStats'), G.floor, G.run.level, G.run.kills, G.run.t);
  show('chapterClear');
  sfx('victory');
};
