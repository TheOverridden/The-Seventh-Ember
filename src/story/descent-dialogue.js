'use strict';

const DESCENT_BEFORE_OREN = {
  'ds-gate-after': {
    1: 'Good. Leave the hatch open. We’ll need to see where that cable goes.',
  },
  'ds-court-intro': {
    0: 'Here’s the road picture and the list of everyone at the Hearth.',
  },
  choirArrival: {
    1: 'It’s the return signal. The cable splits up there. One branch goes back to the Hearth.',
  },
  seraphBefore: {
    1: 'The Hearth has another power cable. We can leave that one on.',
  },
  seraphAfter: {
    1: 'They’re all right. We only broke the line to this bell.',
  },
  keeperBefore: {
    3: 'The Hearth has its own supply. Come up and look. We can open the gate without putting out a lamp.',
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
