'use strict';

const DESCENT_BEFORE_OREN = {
  'ds-gate-after': {
    1: 'Good. I’ll leave the hatch open. We’ll need this cable.',
  },
  'ds-court-intro': {
    0: 'Here’s the picture from the Observatory and the list of everyone at the Hearth.',
  },
  choirArrival: {
    1: 'They carry the return signal. The Hearth cable joins them upstairs.',
  },
  seraphBefore: {
    1: 'The Hearth has its own supply cable. We can leave that connected.',
  },
  seraphAfter: {
    1: 'They’ll stay awake. We only need to cut the return cable.',
  },
  keeperBefore: {
    3: 'We can keep the Hearth running. Come up and look.',
  },
};

const descentDialogueStoryLines = storyLines;
storyLines = function (id) {
  const lines = descentDialogueStoryLines(id),
    alternatives = DESCENT_BEFORE_OREN[id];
  if (!alternatives || descentData().residents.oren) return lines;
  return lines.map((line, index) =>
    alternatives[index] ? { ...line, text: alternatives[index] } : line
  );
};

const descentDialogueRenderLine = renderDialogueLine;
renderDialogueLine = function () {
  descentDialogueRenderLine();
  if (!dialogue || dialogue.replay) return;
  const resident = {
    Oren: 'oren',
    Nell: 'nell',
    'The Star Warden': 'mara',
  }[dialogue.lines[dialogue.index]?.speaker];
  if (resident) descentData().residents[resident] = true;
};
