'use strict';

const DESCENT_WORK = {
  gate: {
    main: [
      'Open the hatch so the Hearth’s power cable can be reached.',
      'The exposed cable stays accessible for the later repairs.',
    ],
    help: [
      'Help Wick lift the kitchen lamp out of its broken bracket.',
      'The rescued lamp lights the kitchen at the Hearth.',
    ],
  },
  garden: {
    main: [
      'Turn off the incoming water. Nell needs a dry place to work.',
      'The flooded bed drains and the seedlings can be moved safely.',
    ],
    help: [
      'Move Nell’s tray onto the shelf above the water.',
      'The surviving seedlings grow beside Nell at the Hearth.',
    ],
  },
  reservoir: {
    main: [
      'Keep the starter powered while Oren gets the pump turning.',
      'Water runs into the Foundry cooling line instead of pooling here.',
    ],
    help: [
      'Lift the fallen shelf just far enough to pull the case out.',
      'Oren gets his tools back. The case joins his Hearth workbench.',
    ],
  },
  foundry: {
    main: [
      'Disconnect the old control wire and fit the sound section of pipe.',
      'The joint stays repaired instead of being rebuilt with the old crack.',
    ],
    help: [
      'Fix a proper bracket under Oren’s work lamp.',
      'The repaired lamp stays over his workbench at the Hearth.',
    ],
  },
  observatory: {
    main: [
      'Open the viewing shutter and check the surface road.',
      'The picture of the road gives the people upstairs something they can check.',
    ],
    help: [
      'Cut one healthy stem and put it in Nell’s water jar.',
      'The cutting takes root beside her seedlings at the Hearth.',
    ],
  },
  archive: {
    main: [
      'Open the circuit record while Oren traces the two cables.',
      'The supply cable and return cable can be told apart before either is moved.',
    ],
    help: [
      'Free the desk drawer and recover the dry seed tin.',
      'Nell keeps the saved seeds beside the growing trays at the Hearth.',
    ],
  },
  court: {
    main: [
      'Lay the surface picture and Hearth roster where both Regents can see them.',
      'Both desks hold the same evidence. Neither Regent can keep it from the other.',
    ],
    help: [
      'Hold the catch while Wick releases the service gate.',
      'The shorter passage is open for Mara. Its route is pinned up at the Hearth.',
    ],
  },
  choir: {
    main: [
      'Keep the supply contact lit while Oren lifts the return cable.',
      'The Hearth lamps stay on while the return bell is disconnected.',
    ],
    help: [
      'Connect Nell’s signal lamp to the working socket.',
      'The two landings can signal each other. A matching lamp lights the Hearth stairs.',
    ],
  },
  citadel: {
    main: [
      'Power the shutter motor while Oren releases its brake.',
      'The raised shutter is pinned open for the people coming up the stairs.',
    ],
    help: [
      'Load the cups and blankets onto the small supply lift.',
      'The packed box reaches the Hearth, ready for the first group leaving.',
    ],
  },
  heart: {
    main: [
      'Check the frame contacts before trying the release.',
      'The six frames are ready. The empty seventh contact stays disconnected.',
    ],
    help: [
      'Clean the inspection lamp and lift it out of its holder.',
      'Wick leaves the working lamp beside the Hearth door for the stairs.',
    ],
  },
};

function descentTaskDetails(event) {
  const chapter = DESCENT_CHAPTERS.find((c) => c.id === event.chapterId);
  const copy = DESCENT_WORK[event.chapterId]?.[event.optional ? 'help' : 'main'];
  const index = Math.max(0, DESCENT_CHAPTERS.indexOf(chapter));
  return {
    request: copy?.[0] || chapter?.objective || '',
    impact: copy?.[1] || '',
    reward: event.optional ? 60 + index * 14 : 40 + index * 10,
  };
}

function paintDescentTask(event, time = 0) {
  const canvas = T('descentTaskArt');
  if (!canvas || !event) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const p = (x, y, w, h, c) => descentPixel(ctx, x, y, w, h, c);
  p(0, 0, 256, 176, '#121c17');
  for (let row = 0; row < 5; row++)
    for (let column = -1; column < 8; column++) {
      const x = column * 40 + (row % 2) * 20,
        y = 18 + row * 17;
      p(x + 1, y, 38, 15, (row + column + 12) % 3 ? '#303d30' : '#354234');
      p(x + 2, y, 35, 1, '#4a5541');
    }
  p(0, 101, 256, 75, '#29372b');
  p(0, 101, 256, 3, '#18241c');
  for (let row = 0; row < 4; row++) {
    p(0, 106 + row * 20, 256, 1, '#1e2c22');
    for (let column = 0; column < 8; column++)
      p(column * 38 + (row % 2) * 19, 106 + row * 20, 1, 18, '#202e23');
  }
  const illustration = { ...event, x: 139, y: 115, arrival: 1, artScale: 1 };
  drawDescentProp(ctx, illustration, time);
  drawDescentResident(ctx, illustration, time, event.active ? 'work' : 'talk');
  p(0, 0, 256, 3, '#8e7b4e');
  p(0, 173, 256, 3, '#514d33');
  p(0, 3, 3, 170, '#514d33');
  p(253, 3, 3, 170, '#514d33');
}
