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
  arrival: [
    'Getting up',
    'The Gatehouse',
    [
      ['Wick', 'Hey. Can you hear me?'],
      ['You', 'Yes. Where are you?'],
      ['Wick', 'Beside you. The little light.'],
      ['You', 'Oh.'],
      ['Wick', 'I’m Wick. Try moving. We need to get out of this room.'],
    ],
  ],
  walks: [
    'The lanterns',
    'The Lantern Walks',
    [
      ['You', 'That lantern moved.'],
      ['Wick', 'Keep back. Some of them bite.'],
    ],
  ],
  barracks: [
    'The coat',
    'The Empty Barracks',
    [
      ['You', 'Is this mine?'],
      ['Wick', 'Yes. You left it here before the last watch.'],
      ['You', 'Do I need it?'],
      ['Wick', 'Not anymore. Check the pocket, though. You used to keep the gate key in there.'],
    ],
  ],
  firstDeath: [
    'Back at the gate',
    'The Gatehouse',
    [
      ['You', 'What happened?'],
      ['Wick', 'You went out. I brought you back here.'],
      ['You', 'You can do that?'],
      ['Wick', 'As long as there’s a bit of you left. Sit for a minute.'],
    ],
  ],
  firstSigil: [
    'A new sigil',
    'The Skill Tree',
    [
      ['You', 'Will I have to do that again if I die?'],
      ['Wick', 'No. That one stays.'],
    ],
  ],
  wardenBefore: [
    'The closed gate',
    'The Last Watch',
    [
      ['The Star Warden', 'Stay there.'],
      ['You', 'I need to get through.'],
      ['The Star Warden', 'Then you’ll have to wait.'],
      ['Wick', 'Mara. It’s us.'],
      ['The Star Warden', 'I know. I’m not opening it.'],
    ],
  ],
  wardenAfter: [
    'Past the watch',
    'The Last Watch',
    [
      ['The Star Warden', 'Wick. Help me with the bar.'],
      ['You', 'You’re letting us through?'],
      ['The Star Warden', 'You’ve broken the lock. I can’t keep you here.'],
      ['The Star Warden', 'The garden stairs are on your right.'],
    ],
  ],
  gardenArrival: [
    'The old garden',
    'The Overgrown Walk',
    [
      ['You', 'Did people live here?'],
      ['Wick', 'They worked here. Most of the food came from these beds.'],
    ],
  ],
  gardenChoice: [
    'The sign',
    'The Still Courtyard',
    [
      ['You', 'Did I paint that?'],
      ['Wick', 'Yes. People kept leaving the gate open.'],
      ['You', 'Did it help?'],
      ['Wick', 'For a while.'],
    ],
  ],
  nurseryTalk: [
    'The nursery',
    'The Nursery',
    [
      ['You', 'What are those frames for?'],
      ['Wick', 'New bodies. The garden made them from the old records.'],
      ['You', 'Like me?'],
      ['Wick', 'Yes. I carried you out of this room.'],
    ],
  ],
  matriarchBefore: [
    'The root chamber',
    'The Root Chamber',
    [
      ['The Hollow Matriarch', 'Get off the beds.'],
      ['You', 'I’m trying to get to the stairs.'],
      ['The Hollow Matriarch', 'Not through here.'],
      ['Wick', 'She’s closing the path. Move.'],
    ],
  ],
  matriarchAfter: [
    'The empty frames',
    'The Root Chamber',
    [
      ['You', 'Were there others like me?'],
      ['The Hollow Matriarch', 'Six. They all went downstairs.'],
      ['You', 'Did any come back?'],
      ['The Hollow Matriarch', 'No. Wick took you before I finished.'],
      ['Wick', 'You weren’t waking up. I wasn’t leaving you there.'],
    ],
  ],
  reservoirArrival: [
    'The spillway',
    'The Spillway',
    [
      ['Wick', 'Use the upper walk.'],
      ['You', 'Does it go all the way across?'],
      ['Wick', 'It did. We’ll check before you jump.'],
    ],
  ],
  bellkeeperBefore: [
    'The walkway',
    'The Bell Cistern',
    [
      ['The Bellkeeper', 'Clear the walkway.'],
      ['You', 'We’re crossing.'],
      ['The Bellkeeper', 'This section is closed. Use the upper stairs.'],
      ['You', 'They’re flooded.'],
      ['The Bellkeeper', 'Then stay where you are.'],
    ],
  ],
  bellkeeperAfter: [
    'The water settles',
    'The Bell Cistern',
    [
      ['The Bellkeeper', 'Is anyone still on the lower walk?'],
      ['Wick', 'No. We checked.'],
      ['The Bellkeeper', 'Good. Don’t open the sluice until you’re across.'],
    ],
  ],
  foundryArrival: [
    'The rail',
    'The Cold Forge',
    [
      ['Wick', 'Don’t touch that rail.'],
      ['You', 'It’s not glowing.'],
      ['Wick', 'It doesn’t have to be.'],
    ],
  ],
  colossusBefore: [
    'The furnace',
    'The Furnace Crown',
    [
      ['The Ember Colossus', 'Furnace access closed.'],
      ['You', 'Shut it down. We need to pass.'],
      ['The Ember Colossus', 'Shutdown requires a work token.'],
      ['You', 'We haven’t got one.'],
      ['The Ember Colossus', 'Leave the platform.'],
    ],
  ],
  colossusAfter: [
    'Shutdown',
    'The Furnace Crown',
    [
      ['The Ember Colossus', 'Pressure falling.'],
      ['Wick', 'That’s the valve. Leave it open.'],
      ['The Ember Colossus', 'Cooling cycle started.'],
    ],
  ],
  obsArrival: [
    'The telescope',
    'The Fallen Orrery',
    [
      ['You', 'What were they looking at?'],
      ['Wick', 'The star. Before they brought it underground.'],
    ],
  ],
  astronomerBefore: [
    'The brass line',
    'The Shattered Dome',
    [
      ['The Glass Astronomer', 'Stay behind the brass line.'],
      ['You', 'Is that the way down?'],
      ['The Glass Astronomer', 'It’s the measurement floor.'],
      ['Wick', 'We need the door behind you.'],
      ['The Glass Astronomer', 'You can wait until I’m finished.'],
    ],
  ],
  astronomerAfter: [
    'The broken lenses',
    'The Shattered Dome',
    [
      ['The Glass Astronomer', 'Leave the glass where it is.'],
      ['You', 'Can you still see the star?'],
      ['The Glass Astronomer', 'No. Take the stairs. I need to repair this.'],
    ],
  ],
  archiveArrival: [
    'The intake desk',
    'The Intake Desk',
    [
      ['You', 'Is there a record of me here?'],
      ['Wick', 'There should be. Check the shelves by the desk.'],
    ],
  ],
  scribeBefore: [
    'The ledger',
    'The Last Margin',
    [
      ['The Pale Scribe', 'Put that back.'],
      ['You', 'I’m looking for my record.'],
      ['The Pale Scribe', 'The public shelves are upstairs.'],
      ['You', 'They’re empty.'],
      ['The Pale Scribe', 'I know. You still can’t take this one.'],
    ],
  ],
  scribeAfter: [
    'The names',
    'The Last Margin',
    [
      ['You', 'Who cut out the names?'],
      ['The Pale Scribe', 'We did. Yours was on the order.'],
      ['You', 'Why?'],
      [
        'The Pale Scribe',
        'Something was calling people out of their rooms. It used the names in these books.',
      ],
      ['Wick', 'We kept a copy. It’s behind the weather shelf.'],
    ],
  ],
  courtArrival: [
    'The tables',
    'The Servants’ Door',
    [
      ['You', 'They’re still setting the tables.'],
      ['Wick', 'The Keeper left this room running. They don’t know how long it’s been.'],
    ],
  ],
  regentsBefore: [
    'The audience chamber',
    'The Audience Chamber',
    [
      ['The First Regent', 'Close the doors.'],
      ['The Second Regent', 'Both?'],
      ['The First Regent', 'Both.'],
      ['You', 'We only need to pass through.'],
      ['The Second Regent', 'You’ll stay until we’re done.'],
    ],
  ],
  regentsAfter: [
    'Both doors',
    'The Audience Chamber',
    [
      ['The First Regent', 'Open the left door.'],
      ['The Second Regent', 'The right one’s nearer.'],
      ['The First Regent', 'Open that one, then.'],
      ['Wick', 'We can manage it.'],
    ],
  ],
  choirArrival: [
    'The stairs',
    'The Low Refrain',
    [
      ['You', 'How much further?'],
      ['Wick', 'Two more landings. Stop here if you need to.'],
    ],
  ],
  seraphBefore: [
    'The belfry',
    'The Open Belfry',
    [
      ['The Void Seraph', 'Put out the light.'],
      ['Wick', 'No.'],
      ['The Void Seraph', 'It’s drawing them up the stairs.'],
      ['You', 'We’re going down.'],
      ['The Void Seraph', 'You’re not bringing them through here.'],
    ],
  ],
  seraphAfter: [
    'The quiet stairs',
    'The Open Belfry',
    [
      ['The Void Seraph', 'Can you hear anything below?'],
      ['Wick', 'Not now.'],
      ['The Void Seraph', 'Keep it that way. Don’t ring the bells.'],
    ],
  ],
  citadelArrival: [
    'The wall',
    'The Inward Wall',
    [
      ['You', 'Why are the weapons facing in?'],
      ['Wick', 'They were trying to stop anything coming out of the Heart.'],
    ],
  ],
  tyrantBefore: [
    'The siege hall',
    'The Siege Hall',
    [
      ['The Obsidian Tyrant', 'Return to the outer checkpoint.'],
      ['You', 'Nobody’s there.'],
      ['The Obsidian Tyrant', 'Checkpoint remains in service.'],
      ['Wick', 'It’s running on the old orders.'],
      ['The Obsidian Tyrant', 'Clear the hall.'],
    ],
  ],
  tyrantAfter: [
    'The engine stops',
    'The Siege Hall',
    [
      ['The Obsidian Tyrant', 'Drive failure.'],
      ['Wick', 'Stay clear of the wheels.'],
      ['The Obsidian Tyrant', 'Brakes engaged.'],
    ],
  ],
  heartArrival: [
    'The borrowed gate',
    'The Borrowed Gate',
    [
      ['You', 'We’ve been in this room.'],
      ['Wick', 'Upstairs. The Heart copied it.'],
      ['You', 'Why?'],
      ['Wick', 'It’s been putting the old rooms back together. That’s what those memories were.'],
    ],
  ],
  keeperBefore: [
    'The Heart',
    'The Heart of the Star',
    [
      ['The First Keeper', 'Wick. Put them back.'],
      ['Wick', 'They’re awake.'],
      ['The First Keeper', 'I can see that. They still can’t leave.'],
      ['You', 'Open the gate.'],
      ['The First Keeper', 'The star is failing. I’m not opening anything.'],
    ],
  ],
  keeperAfter: [
    'The control room',
    'The Heart of the Star',
    [
      ['The First Keeper', 'Stop. You’ll break the controls.'],
      ['You', 'Then use them. Open the gate.'],
      ['The First Keeper', 'The people won’t survive outside.'],
      ['Wick', 'You haven’t checked. You’ve kept them here for nine years.'],
      ['The First Keeper', 'Help me lift the cover.'],
    ],
  ],
  wickPointer1: [
    'The portal',
    'An open gate',
    [['Wick', 'There’s nothing here to open. Try the portal.']],
  ],
  wickPointer2: ['Over there', 'An open gate', [['Wick', 'The round thing. Over there.']]],
  wickPointer3: [
    'Again',
    'An open gate',
    [['Wick', 'Did something get stuck? You keep doing that.']],
  ],
  wickPointer4: [
    'Still here',
    'An open gate',
    [['Wick', 'I can’t open it from here. Try going a bit further.']],
  ],
  wickPointer5: [
    'The spare',
    'An open gate',
    [['Wick', 'Hang on. I’ve got something that might help.']],
  ],
  wickPointer6: [
    'Take this',
    'An open gate',
    [['Wick', 'Here. Take it. I was keeping it for later.']],
  ],
  wickPointerAfter: [
    'The pointer',
    'An open gate',
    [['Wick', 'It picks a target. Hit that one first.']],
  ],
};
for (const [id, [title, where, lines]] of Object.entries(STORY_DIALOGUES))
  HOLLOW_SCENES[id] = { title, where, lines, hidden: id.startsWith('wickPointer') };
