const CHAPTER_EXIT_TEXT = {
  5: 'The garden stair is open.',
  10: 'The roots have pulled back from the stairs.',
  15: 'The walkway is clear. The foundry is below.',
  20: 'The furnace is cooling. You can cross the platform.',
  25: 'The stairway behind the dome is open.',
  30: 'The Scribe has unlocked the lower doors.',
  35: 'Both doors are open. The Choir is through the right one.',
  40: 'The Hearth’s bell line is disconnected. The Citadel stair is clear.',
  45: 'The throne has stopped moving. The Heart is below.',
};
const STORY_DIALOGUES = {
  wickPointer1: [
    'The portal',
    'An open gate',
    [['Wick', 'Hey. Have you tried doing that at the portal?']],
  ],
  wickPointer2: [
    'Over there',
    'An open gate',
    [['Wick', 'The round thing. The one that opens. Keep walking and we’ll find it.']],
  ],
  wickPointer3: [
    'Again',
    'An open gate',
    [['Wick', 'All right. I tried it here, too. I can confirm this is a wall.']],
  ],
  wickPointer4: [
    'Still here',
    'An open gate',
    [['Wick', 'If there’s a handle, show me. I can’t see one from down here.']],
  ],
  wickPointer5: [
    'The spare',
    'An open gate',
    [['Wick', 'I should have done this three walls ago. Hang on.']],
  ],
  wickPointer6: [
    'Take this',
    'An open gate',
    [['Wick', 'Fine. I’ll point. Just let the wall get some rest.']],
  ],
  wickPointerAfter: [
    'The pointer',
    'An open gate',
    [
      [
        'Wick',
        'If I can see something you can hit, I’ll mark it. If a lock is protecting a guardian, I’ll mark that first.',
      ],
      [
        'Wick',
        'Hit the mark for more damage. Bring it down and you get a Bolt charge back. You’re doing the aiming.',
      ],
      [
        'Wick',
        'Once it’s quiet, watch where I point. I’ll show you the way to an open portal we’ve already found.',
      ],
    ],
  ],
};
for (const [id, [title, where, lines]] of Object.entries(STORY_DIALOGUES))
  HOLLOW_SCENES[id] = { title, where, lines, hidden: id.startsWith('wickPointer') };
