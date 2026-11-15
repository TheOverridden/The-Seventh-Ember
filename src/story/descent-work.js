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
  return {
    request: copy?.[0] || chapter?.objective || '',
    impact: copy?.[1] || '',
  };
}

const RESIDENT_SUPPLIES = {
  rest: { name: 'Rest by the lamp', icon: 'heart' },
  marks: { name: 'A few spare Marks', icon: 'ashes' },
  essence: { name: 'Saved Essence', icon: 'sun' },
  xp: { name: 'Kindling', icon: 'pearl' },
  vessel: { name: 'Emberglass lining', icon: 'vessel' },
  power: { name: 'Core tuning', icon: 'temper' },
  haste: { name: 'Lighten the load', icon: 'cloak' },
  temper: { name: 'Strengthen a blessing', icon: 'thread' },
};
function residentStopKey(event) {
  return event.chapterId + (event.optional ? '-help' : '-main');
}
function cleanResidentStops(raw) {
  const stops = {};
  for (const chapter of DESCENT_CHAPTERS)
    for (const suffix of ['main', 'help']) {
      const key = chapter.id + '-' + suffix,
        record = raw?.[key];
      if (!record || typeof record !== 'object' || Array.isArray(record)) continue;
      const offers = [];
      for (const offer of Array.isArray(record.offers) ? record.offers.slice(0, 2) : []) {
        if (
          !Object.hasOwn(RESIDENT_SUPPLIES, offer?.type) ||
          offers.some((o) => o.type === offer.type)
        )
          continue;
        if (offer.type === 'temper' && !POOL.some((card) => card.id === offer.card && card.r < 3))
          continue;
        offers.push({
          type: offer.type,
          amount: clamp(Math.floor(Number(offer.amount) || 0), 0, 10000),
          ...(offer.type === 'temper' ? { card: offer.card } : {}),
        });
      }
      stops[key] = { offers, claimed: record.claimed === true };
    }
  return stops;
}
function residentStop(event) {
  const stops = (G.run.residentStops ||= {}),
    key = residentStopKey(event);
  if (!stops[key]) stops[key] = { offers: [], claimed: false };
  const record = stops[key];
  if (!record.offers.length && !record.claimed) {
    const seed = runnerData()?.seed || String(G.run.startedAt || save.totalRuns),
      hash = (type) => runnerHash(seed + '|resident|' + key + '|' + type),
      chapter = DESCENT_CHAPTERS.findIndex((c) => c.id === event.chapterId),
      cards = POOL.filter(
        (card) => card.r < 3 && (G.run.up[card.id] || 0) > 0 && G.run.up[card.id] < card.max
      ).sort((a, b) => hash(a.id) - hash(b.id)),
      pool = (
        {
          wick: ['marks', 'xp', 'essence', 'haste'],
          oren: ['temper', 'power', 'vessel', 'essence'],
          nell: ['rest', 'vessel', 'marks', 'xp'],
        }[event.npc] || ['rest', 'marks', 'essence', 'power']
      )
        .filter((type) => type !== 'temper' || cards.length)
        .filter((type) => type !== 'rest' || G.player.hp < G.player.maxHp)
        .sort((a, b) => hash(a) - hash(b));
    record.offers = pool.slice(0, 2).map((type) => ({
      type,
      amount: {
        marks: 2,
        essence: 25 + Math.max(0, chapter) * 6,
        xp: Math.max(10, Math.round(needXP(G.run.level) * 0.4)),
        vessel: 10,
        power: 0,
        haste: 0,
        rest: 45,
        temper: 1,
      }[type],
      ...(type === 'temper' ? { card: cards[0].id } : {}),
    }));
  }
  return record;
}
function residentSupplyText(offer) {
  if (offer.type === 'rest') return 'Recover 45% of your maximum health.';
  if (offer.type === 'marks') return '+2 Marks to spend in secret rooms.';
  if (offer.type === 'essence')
    return '+' + Math.round(offer.amount * META.ess) + ' permanent Essence.';
  if (offer.type === 'xp')
    return '+' + Math.round(offer.amount * G.player.xpMul) + ' XP for this descent.';
  if (offer.type === 'vessel') return '+10 maximum health for this descent. Recover 10 health.';
  if (offer.type === 'power') return '+4% ability damage for this descent.';
  if (offer.type === 'haste') return '+4% movement speed for this descent.';
  const card = POOL.find((card) => card.id === offer.card);
  return (card?.name || 'Blessing') + ' gains one rank.';
}
function residentSupplyAvailable(offer) {
  if (offer.type === 'temper') {
    const card = POOL.find((card) => card.id === offer.card);
    return !!card && (G.run.up[card.id] || 0) > 0 && G.run.up[card.id] < card.max;
  }
  return offer.type !== 'rest' || G.player.hp < G.player.maxHp;
}
function takeResidentSupply(event, index) {
  if (
    !event ||
    descentEvent(event.id) !== event ||
    saveConflicted ||
    G.dead ||
    G.bossActive ||
    G.state !== 'paused' ||
    !T('descentTaskPanel').classList.contains('open')
  )
    return;
  const record = residentStop(event),
    offer = record.offers[index];
  if (record.claimed || !offer || !residentSupplyAvailable(offer)) return;
  record.claimed = true;
  hide('descentTaskPanel');
  descentPending = null;
  event.phase = event.optional ? 'helped' : 'complete';
  event.progress = 1;
  event.workUntil = descentClock + 1.2;
  const chapter = descentData().chapters[event.chapterId],
    field = event.optional ? 'help' : 'main',
    first = !chapter[field];
  chapter[field] = true;
  chapter[event.optional ? 'helpRewarded' : 'mainRewarded'] = true;
  chapter.met = true;
  if (!event.optional) chapter.by = 'player';
  if (event.npc !== 'wick') descentData().residents[event.npc] = true;
  event.repaired = true;
  const forge = secretRun().secretForge;
  if (offer.type === 'marks') secretMarks(offer.amount);
  else if (offer.type === 'essence') addEss(offer.amount);
  else if (offer.type === 'rest')
    G.player.hp = Math.min(
      G.player.maxHp,
      G.player.hp + Math.round((G.player.maxHp * offer.amount) / 100)
    );
  else if (offer.type === 'vessel') {
    forge.health = (forge.health || 0) + offer.amount;
    recalc();
    G.player.hp = Math.min(G.player.maxHp, G.player.hp + offer.amount);
  } else if (offer.type === 'power' || offer.type === 'haste') {
    const stat = offer.type === 'power' ? 'damage' : 'speed';
    forge[stat] = (forge[stat] || 0) + 0.04;
    recalc();
  } else if (offer.type === 'temper') {
    mothGrantCard(offer.card);
    recalc();
  }
  if (offer.type === 'xp') gainXP(offer.amount);
  fieldNote(RESIDENT_SUPPLIES[offer.type].name + ' · ' + residentSupplyText(offer), 2.4);
  sfx('buy');
  setState('playing');
  updateHUD(0);
  const scene = 'ds-' + event.chapterId + '-' + (event.optional ? 'helped' : 'after');
  if (first && !storyData().seen[scene]) beginDialogue(scene, false, 0, 'playing');
  else if (G.pendingLevels > 0) triggerLevelup();
  saveNow('resident-supplies');
}

const residentValidateCheckpoint = validateCheckpoint;
validateCheckpoint = function (raw) {
  const result = residentValidateCheckpoint(raw);
  if (result.run.residentStops !== undefined)
    result.run.residentStops = cleanResidentStops(result.run.residentStops);
  return result;
};

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
