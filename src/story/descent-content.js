const DESCENT_CHAPTERS = [
  {
    id: 'gate',
    from: 1,
    to: 5,
    title: 'The Hollow Gate',
    mainFloor: 2,
    npc: 'wick',
    objective: 'Lift the bar to open the hatch and check the Hearth’s power cable.',
    mainSummary: 'The hatch is open. The Hearth cable inside still has power.',
    helpSummary: 'Wick is taking the kitchen lamp upstairs.',
    action: 'LIFT THE BAR',
    prop: 'gate',
    intro: [
      [
        'Wick',
        'The Hearth cable’s under this hatch. If it’s dead, the kitchen’s borrowing power from somewhere else.',
      ],
      ['You', 'Can you get the bar off?'],
      [
        'Wick',
        'I can hold this end. You take the end that’s on the floor. I don’t have quite enough Wick for that one.',
      ],
    ],
    after: [
      ['You', 'I can feel it humming through the cover.'],
      ['Wick', 'Good. Leave it open for Oren. He’ll want to see which way the cable runs.'],
    ],
    optionalFloor: 3,
    optionalNpc: 'wick',
    optionalTitle: 'A lamp for upstairs',
    optionalAction: 'CARRY THE LAMP',
    optionalProp: 'lamp',
    optionalIntro: [
      [
        'Wick',
        'That’s the old kitchen lamp. Can you help me get it down? The stove lights about half a spoon.',
      ],
      ['You', 'Should I take the handle?'],
      ['Wick', 'Please. I tried the handle and went up with it.'],
    ],
    optionalAfter: [
      ['Wick', 'I can take it from here, if you tip it toward me.'],
      ['You', 'The handle’s getting hot.'],
      ['Wick', 'I’ll go slow. Nell’s usually the only one up at this hour anyway.'],
    ],
    keepsake: 'kitchenLamp',
    immediateReward: 12,
  },
  {
    id: 'garden',
    from: 6,
    to: 10,
    title: 'The Rootbound Gardens',
    mainFloor: 7,
    npc: 'nell',
    objective: 'Turn the wheel to stop the water flooding the nursery platform.',
    mainSummary: 'The water gate is shut. The nursery platform is draining.',
    helpSummary: 'Nell’s seed tray is safe on the dry shelf.',
    action: 'CLOSE THE WATER GATE',
    prop: 'irrigation',
    intro: [
      ['Nell', 'The water’s at the bottom of the seed tray. Another inch and I lose the beans.'],
      ['You', 'Where do I shut it off?'],
      ['Nell', 'That wheel. Turn it till it stops. All the way, even when it gets stiff.'],
    ],
    after: [
      ['Nell', 'Listen. That’s the drain catching.'],
      ['You', 'Can I get across?'],
      ['Nell', 'Wait till you see the stepping stones. They’re slimy.'],
      ['You', 'Are the beans all right?'],
      ['Nell', 'I can save the ones with leaves. The kitchen’s had enough onions this year.'],
    ],
    optionalFloor: 8,
    optionalNpc: 'nell',
    optionalTitle: 'Nell’s seedlings',
    optionalAction: 'MOVE THE SEED TRAY',
    optionalProp: 'tray',
    optionalIntro: [
      [
        'Nell',
        'Can you set the tray on the high shelf? I’m trying to keep the cracked corner together.',
      ],
      ['You', 'I’ve got both handles. This way up?'],
      ['Nell', 'That’s it. Slow down near the shelf. I’ve got the corner.'],
    ],
    optionalAfter: [
      ['Nell', 'Good. Now they can sulk somewhere dry.'],
      ['You', 'What kind of beans are they?'],
      [
        'Nell',
        'The climbing sort. I’ve got string over my bed upstairs. I’m running out of places they can climb.',
      ],
    ],
    keepsake: 'nellSeedlings',
    immediateReward: 12,
  },
  {
    id: 'reservoir',
    from: 11,
    to: 15,
    title: 'The Drowned Reservoir',
    mainFloor: 12,
    npc: 'oren',
    objective: 'Power the pump so it can send cooling water down to the Foundry.',
    mainSummary: 'The pump is sending cooling water to the Foundry.',
    helpSummary: 'Oren has his spare tool case back.',
    action: 'POWER THE STARTER',
    prop: 'pump',
    intro: [
      ['Oren', 'Off the casing, please. Two bolts in, two bolts in my pocket.'],
      ['You', 'Will it start with two?'],
      ['Oren', 'The cover will stay on with two. Touch the brass contact. I’ll turn the crank.'],
    ],
    after: [
      ['Oren', 'That’s it. Hands off the belt until it’s finished jumping.'],
      ['Wick', 'Does that pipe go to the Foundry?'],
      [
        'Oren',
        'Straight there. They can have as much water as they like. I’ve got plenty down both boots.',
      ],
    ],
    optionalFloor: 13,
    optionalNpc: 'oren',
    optionalTitle: 'The spare tool case',
    optionalAction: 'FREE THE TOOL CASE',
    optionalProp: 'toolbox',
    optionalIntro: [
      ['Oren', 'My spare case is wedged under that shelf. Lift the near leg and I’ll pull.'],
      ['You', 'What’s in the bag on your shoulder?'],
      ['Oren', 'A big hammer and a little hammer. Neither one will turn a nut.'],
    ],
    optionalAfter: [
      ['Oren', 'Pass me the cloth from the bottom, would you?'],
      ['You', 'For the tools?'],
      ['Oren', 'For my knees. The tools can rust a little. I have to get up.'],
    ],
    keepsake: 'orenToolCase',
    immediateReward: 12,
  },
  {
    id: 'foundry',
    from: 16,
    to: 20,
    title: 'The Ember Foundry',
    mainFloor: 17,
    npc: 'oren',
    objective: 'Pull out the small wire, then fit the repaired cooling pipe.',
    mainSummary: 'The cooling pipe is fixed. The Heart can no longer put the broken one back.',
    helpSummary: 'Oren’s work light has a proper bracket.',
    action: 'FIT THE REPAIRED PIPE',
    prop: 'pipe',
    intro: [
      [
        'Oren',
        'See the crack? I marked it with white paint yesterday. Then I changed the entire pipe.',
      ],
      ['You', 'It’s got the mark on it again.'],
      [
        'Oren',
        'Heart put the old one back. Pull the little wire before we fit this one, or we’ll be here tomorrow.',
      ],
    ],
    after: [
      ['You', 'Think it’ll stay now?'],
      ['Oren', 'Give it a minute. I’ve had enough of this particular pipe.'],
      ['Wick', 'The paper under the joint is still dry.'],
      ['Oren', 'Leave it there. I want to be able to check on my way back.'],
    ],
    optionalFloor: 18,
    optionalNpc: 'oren',
    optionalTitle: 'Oren’s work light',
    optionalAction: 'FIT THE LAMP BRACKET',
    optionalProp: 'lamp',
    optionalIntro: [
      ['Oren', 'Would you pull that bracket off the wall? It’s the right size for my lamp.'],
      ['You', 'What’s it hanging from now?'],
      ['Oren', 'A spoon. It’s bent far enough now that the lamp points at the floor.'],
    ],
    optionalAfter: [
      ['Oren', 'That’ll go over the bench. I might be able to read my own handwriting there now.'],
      ['You', 'Do you want the spoon back?'],
      ['Oren', 'Yes. Nobody said I had to eat soup with it.'],
    ],
    keepsake: 'orenWorkLight',
    immediateReward: 12,
  },
  {
    id: 'observatory',
    from: 21,
    to: 25,
    title: 'The Shattered Observatory',
    mainFloor: 22,
    npc: 'wick',
    objective: 'Turn the lens toward the shaft to see the road outside.',
    mainSummary: 'The viewing plate shows grass beside the road outside.',
    helpSummary: 'Nell has a small cutting to plant upstairs.',
    action: 'ALIGN THE LENS',
    prop: 'lens',
    intro: [
      [
        'Wick',
        'The small lens goes up the shaft. See where the shutter’s stuck? About half a thumb from open.',
      ],
      ['You', 'Can I reach it from here?'],
      ['Wick', 'Use that handle. Don’t put all your weight on it till you feel it catch.'],
    ],
    after: [
      ['You', 'Move it back a little. That green by the wall. Is that grass?'],
      ['Wick', 'It’s even coming up between the stones.'],
      ['You', 'We need to take this upstairs.'],
      ['Wick', 'Wrap the plate in something. The Keeper ought to see it for himself.'],
    ],
    optionalFloor: 23,
    optionalNpc: 'nell',
    optionalTitle: 'The shaft planter',
    optionalAction: 'TAKE A SMALL CUTTING',
    optionalProp: 'sample',
    optionalIntro: [
      ['Nell', 'Snip me one stem from that planter. The short one with the pale leaf.'],
      ['You', 'Roots and all?'],
      ['Nell', 'Just the stem. Leave enough for the next person who comes looking.'],
    ],
    optionalAfter: [
      ['Nell', 'I’ll put this in water as soon as we’re up.'],
      ['You', 'In the pot with the hole?'],
      ['Nell', 'That’s for planting once it has roots. I still need a jar.'],
    ],
    keepsake: 'surfaceCutting',
    immediateReward: 12,
  },
  {
    id: 'archive',
    from: 26,
    to: 30,
    title: 'The Buried Archive',
    mainFloor: 27,
    npc: 'oren',
    objective: 'Release the cable diagram so Oren can find the Hearth’s power supply.',
    mainSummary:
      'The diagram shows two cables: one powers the Hearth; the other carries the return bell.',
    helpSummary: 'Nell’s seed tin is out of the locked desk.',
    action: 'RELEASE THE CIRCUIT RECORD',
    prop: 'ledger',
    intro: [
      [
        'Oren',
        'Here’s the Hearth feed. Same thick line for the stove, the lamps, and Nell’s nursery.',
      ],
      ['You', 'So what goes dark if we cut the bell?'],
      ['Oren', 'Nothing up there. Lift that catch. I need to trace both lines on the actual plan.'],
    ],
    after: [
      ['Oren', 'Thick cable stays. Thin one rings the return bell. That’s the one we cut.'],
      ['You', 'Nine years. Is that how long we’ve been down here?'],
      [
        'Wick',
        'Since the road fell in. The Keeper made new bodies for the people we lost. Then he kept everybody inside.',
      ],
      [
        'Oren',
        'His repair crew are still on the books. Six names, all shut down at the Heart. No entries after that.',
      ],
      ['Wick', 'Take the page. Fold it on the blank edge.'],
    ],
    optionalFloor: 28,
    optionalNpc: 'nell',
    optionalTitle: 'The seed tin',
    optionalAction: 'RECOVER THE SEED TIN',
    optionalProp: 'tin',
    optionalIntro: [
      [
        'Nell',
        'My seed tin is in the desk, under the ledger. Listen when you pull the drawer. You can hear it rattle.',
      ],
      ['You', 'Why’d you put it in there?'],
      [
        'Nell',
        'It was the only dry place. Of course that’s when someone found the key and locked it.',
      ],
    ],
    optionalAfter: [
      ['Nell', 'Still sealed. Nothing got in round the lid.'],
      ['You', 'Do old seeds still grow?'],
      ['Nell', 'Some. I’ll plant four. If even one comes up, I can start over.'],
    ],
    keepsake: 'nellSeedTin',
    immediateReward: 12,
  },
  {
    id: 'court',
    from: 31,
    to: 35,
    title: 'The Silent Court',
    mainFloor: 32,
    npc: 'wick',
    objective: 'Put the road picture and the list of Hearth residents on the Regents’ desk.',
    mainSummary: 'Both Regents can see the road picture and the list of Hearth residents.',
    helpSummary: 'Wick has sent Mara word that the shorter service passage is open.',
    action: 'SET OUT THE RECORDS',
    prop: 'locks',
    intro: [
      ['Wick', 'Here’s the road picture and Oren’s list of everyone at the Hearth.'],
      ['You', 'Whose desk?'],
      [
        'Wick',
        'Put them between the desks. I brought two copies last time and they argued over which one was the original.',
      ],
    ],
    after: [
      ['The First Regent', 'Is there a date on this plate?'],
      ['You', 'We took it today. You can see the grass where the road bends.'],
      ['The Second Regent', 'Then I’d like the locks open while there’s still daylight.'],
      ['The First Regent', 'The plate will stay here until we can both agree what it shows.'],
    ],
    optionalFloor: 33,
    optionalNpc: 'wick',
    optionalTitle: 'Mara’s service passage',
    optionalAction: 'RELEASE THE SIDE LOCK',
    optionalProp: 'latch',
    optionalIntro: [
      [
        'Wick',
        'If we open this catch, Mara can get back to the gate without taking the lift around the long way.',
      ],
      ['You', 'Did she ask you to open it?'],
      [
        'Wick',
        'She drew me a map on the back of her glove. Hold the lever. It’s under spring tension.',
      ],
    ],
    optionalAfter: [
      ['Wick', 'It’s open. I’ll tell Mara she can use the short way.'],
      ['You', 'Will she be there when we open the gate?'],
      ['Wick', 'Lift’s already parked for her. I think she’s been ready longer than we have.'],
    ],
    keepsake: 'maraPassage',
    immediateReward: 12,
  },
  {
    id: 'choir',
    from: 36,
    to: 40,
    title: 'The Choir Spire',
    mainFloor: 37,
    npc: 'oren',
    objective: 'Hold the power contact while Oren disconnects the return bell cable.',
    mainSummary: 'The return bell is disconnected. The Hearth and its residents still have power.',
    helpSummary: 'Nell can use the lamp to signal the people upstairs.',
    action: 'HOLD THE POWERED CONTACT',
    prop: 'bell',
    intro: [
      [
        'Oren',
        'Keep your flame on that contact. I’ll take the thin cable off while the supply’s steady.',
      ],
      ['You', 'What if the kitchen goes dark?'],
      ['Oren', 'Take your hand off and say so. I can put it back faster than I took it off.'],
    ],
    after: [
      ['Wick', 'The lamp upstairs didn’t even blink.'],
      ['Oren', 'Bell’s quiet. I can hear water in the pipe again.'],
      ['You', 'They’ll stay awake up there?'],
      ['Oren', 'They’re on the same supply as the lamp you just saw. Yes.'],
    ],
    optionalFloor: 38,
    optionalNpc: 'nell',
    optionalTitle: 'A signal for the stairs',
    optionalAction: 'CONNECT THE SIGNAL LAMP',
    optionalProp: 'lamp',
    optionalIntro: [
      ['Nell', 'I can see people at the upper rail. I’ve waved till my arm hurts.'],
      ['You', 'What about this lamp?'],
      ['Nell', 'Good. Plug it in. I’ll give them two flashes when the stair’s clear.'],
    ],
    optionalAfter: [
      ['Nell', 'Two back. Look! They saw it.'],
      ['You', 'How many are up there?'],
      ['Nell', 'I can make out three lamps. There’ll be more people than lamps.'],
    ],
    keepsake: 'stairSignal',
    immediateReward: 12,
  },
  {
    id: 'citadel',
    from: 41,
    to: 45,
    title: 'The Black Citadel',
    mainFloor: 42,
    npc: 'oren',
    objective: 'Release the service shutter so people can reach the upper stairs.',
    mainSummary: 'The service shutter is held open so people can reach the upper stairs.',
    helpSummary: 'Nell’s cups and blankets have reached the upper landing.',
    action: 'RAISE THE SERVICE SHUTTER',
    prop: 'shutter',
    intro: [
      [
        'Oren',
        'The Regents’ doors are open. We still need that shutter high enough for Mara to get through in her helmet.',
      ],
      ['You', 'Can the old motor still lift it?'],
      ['Oren', 'Keep the contact lit. I’ll release the brake and we can find out.'],
    ],
    after: [
      [
        'Oren',
        'Leave the brake pin on the floor. I’d rather trip over it than have this come down again.',
      ],
      ['Wick', 'I’ll tell Mara she can start bringing people through.'],
      ['You', 'We still have to get past the carriage in the siege hall.'],
    ],
    optionalFloor: 43,
    optionalNpc: 'nell',
    optionalTitle: 'Supplies for the first group',
    optionalAction: 'SEND THE SUPPLY BOX UP',
    optionalProp: 'supplies',
    optionalIntro: [
      ['Nell', 'Would you put this box on the lift? Cups, blankets. Heavier than it looks.'],
      ['You', 'Do they have food up there?'],
      [
        'Nell',
        'Bread’s already sent up. It’s cold on the landing, and people keep giving their blankets to the next person along.',
      ],
    ],
    optionalAfter: [
      ['Nell', 'There. Someone’s taken the box off at the top.'],
      ['You', 'Do you need me to bring anything else?'],
      ['Nell', 'Open the stairs when you can. I’ll wait here with the last group.'],
    ],
    keepsake: 'evacuationSupplies',
    immediateReward: 12,
  },
  {
    id: 'heart',
    from: 46,
    to: 50,
    title: 'The Heart of the Star',
    mainFloor: 47,
    npc: 'wick',
    objective: 'Open the cover on the six Ember frames to find their release.',
    mainSummary:
      'The six Embers are still inside. Their release can only be opened from the control room.',
    helpSummary: 'Wick left the inspection lamp by the door for the people using the stairs.',
    action: 'OPEN THE INSPECTION COVER',
    prop: 'frames',
    intro: [
      [
        'Wick',
        'Six lights. One on each frame. I checked these every day till they moved them down here.',
      ],
      ['You', 'Are they still in there?'],
      ['Wick', 'That’s what I want to know. Help me lift the inspection cover.'],
    ],
    after: [
      ['You', 'There’s a plug for a seventh frame.'],
      ['Wick', 'It fits the plate I took off you. We’re leaving it empty.'],
      ['You', 'The first six are wired to a lock in the control room.'],
      ['Wick', 'All right. We’ve done enough walking around it. Let’s go talk to him.'],
    ],
    optionalFloor: 48,
    optionalNpc: 'wick',
    optionalTitle: 'The inspection lamp',
    optionalAction: 'RECOVER THE INSPECTION LAMP',
    optionalProp: 'lamp',
    optionalIntro: [
      [
        'Wick',
        'That’s my inspection lamp. I bent the hook myself so it wouldn’t fall off the rail.',
      ],
      ['You', 'Does it still work?'],
      ['Wick', 'Wipe the glass with your sleeve. You should see it glow.'],
    ],
    optionalAfter: [
      [
        'Wick',
        'I’ll leave it on the stair post. Someone’s going to come down after us and they’ll need both hands.',
      ],
      ['You', 'You’re not headed up with it?'],
      ['Wick', 'I’m staying. I won’t be much use to you up there.'],
    ],
    keepsake: 'inspectionLamp',
    immediateReward: 12,
  },
];

const DESCENT_ENDING_LINES = [
  {
    title: 'The release',
    speaker: 'The First Keeper',
    text: 'Hold that contact down. My hand shakes at this part. Wait for the lamps upstairs.',
  },
  {
    title: 'The supply',
    speaker: 'Oren',
    text: 'Two lamps steady. Good. Thin cable now. Leave the thick one where it is.',
  },
  {
    title: 'The maintenance frames',
    speaker: 'Wick',
    text: 'I heard the first catch. Wait. There’s another. Can you hear them getting up?',
  },
  {
    title: 'The way upstairs',
    speaker: 'Oren',
    text: 'Pumps are running. Pipe’s dry at the joint. Mara, I’m sending the lift down for the last group.',
  },
  {
    title: 'The Hearth',
    speaker: 'Nell',
    text: 'Come all the way onto the landing. Pass a blanket back if you’ve got two. We can hear you coming.',
  },
  {
    title: 'The doorway',
    speaker: 'The Star Warden',
    text: 'I walked as far as the bend. The road’s there. Mind that step, Wick. The middle’s worn away.',
  },
  {
    title: 'Outside',
    speaker: 'Wick',
    text: 'Somebody should tell Nell there’s room out here to plant those beans.',
  },
  {
    title: 'The first morning',
    speaker: 'You',
    text: 'In a minute. I want to feel the sun a little longer.',
  },
];

const DESCENT_DIALOGUE_COPY = {
  arrival: [
    'The Hearth',
    'The Gatehouse',
    [
      ['Wick', 'Give me a little wiggle. I had to carry you sideways up the nursery steps.'],
      ['You', 'I can move. Where is everybody?'],
      [
        'Wick',
        'Nell got everybody round the kitchen stove. It’s the only room with the lamps still on.',
      ],
      ['You', 'Can we get them outside?'],
      [
        'Wick',
        'The gate’s shut. The Keeper has the release downstairs. Come on. I know the first few rooms.',
      ],
    ],
  ],
  walks: [
    'The maintenance hatch',
    'The Lantern Walks',
    [
      [
        'Wick',
        'See the lamp with no bracket? Give that one room. The ones on the walls are usually fine.',
      ],
    ],
  ],
  barracks: [
    'The old coat',
    'The Empty Barracks',
    [
      ['You', 'Someone sewed a pocket inside the sleeve.'],
      ['Wick', 'The lamplighter kept the gate key there. You were made from their record.'],
      ['You', 'I wouldn’t have thought to look there.'],
      ['Wick', 'I was about to ask you to fetch it. Sorry. I used to ask them.'],
    ],
  ],
  firstDeath: [
    'Back at the Hearth',
    'The Gatehouse',
    [
      ['Wick', 'Easy. Give your edges a second to catch up.'],
      ['You', 'Did you drag me all the way back here?'],
      ['Wick', 'Just your core. I left the scorch mark where it was.'],
    ],
  ],
  firstSigil: [
    'A permanent sigil',
    'The Skill Tree',
    [
      ['You', 'Do I have to buy this again when I go out?'],
      ['Wick', 'Once is enough. Take it down with you.'],
    ],
  ],
  wardenBefore: [
    'The barred stair',
    'The Last Watch',
    [
      ['The Star Warden', 'Halt. One step back from the bar. Yes, there.'],
      ['Wick', 'Mara. It’s Wick. We need the garden stair.'],
      [
        'The Star Warden',
        'I recognized you. Last time you came through, there were two on watch up here.',
      ],
      ['You', 'Then you know how long we’ve waited. Let me talk to the Keeper.'],
    ],
  ],
  wardenAfter: [
    'The garden stair',
    'The Last Watch',
    [
      ['The Star Warden', 'Wick. Get under that end. The heavy end is mine.'],
      ['You', 'What are you going to tell them?'],
      [
        'The Star Warden',
        'That I opened it. Keep right on the garden stairs. The left rail won’t hold you.',
      ],
    ],
  ],
  gardenArrival: [
    'The wet beds',
    'The Overgrown Walk',
    [
      ['You', 'The water’s up to the second step. Look at the dirt line.'],
      ['Wick', 'That’s the nursery landing down there. Let’s see how deep it is before you go in.'],
    ],
  ],
  gardenChoice: [
    'The dry shelf',
    'The Still Courtyard',
    [
      ['You', 'Someone cleared a little square for every pot.'],
      ['Wick', 'Nell. I tried moving one to help. She came back with a ruler.'],
    ],
  ],
  nurseryTalk: [
    'The nursery frames',
    'The Nursery',
    [
      ['You', 'Six beds. All those marks in the wood are worn smooth.'],
      [
        'Wick',
        'Six Embers went down to fix the Heart. Every time they got too far, the bell hauled them back here.',
      ],
      ['You', 'Is that what happens when I hear it?'],
      [
        'Wick',
        'You can hear it all you like. I took your return plate off before I lifted you out.',
      ],
    ],
  ],
  matriarchBefore: [
    'The nursery supply',
    'The Root Chamber',
    [
      ['The Hollow Matriarch', 'I left you in the seventh bed. Who took you out?'],
      ['You', 'I got up. I can stand on my own.'],
      ['The Hollow Matriarch', 'I hadn’t tested that frame. Back into the bed, please.'],
      ['Wick', 'She’s got roots in the stair. Get clear before they close.'],
    ],
  ],
  matriarchAfter: [
    'The nursery drains',
    'The Root Chamber',
    [
      ['The Hollow Matriarch', 'The nursery pipe. Did you cut it?'],
      ['You', 'No. We’re here to get the outside gate open.'],
      ['Wick', 'Nell still needs that water. We’re leaving it on for her.'],
      [
        'The Hollow Matriarch',
        'Very well. Take the dry stair to the pumps. The lower steps are loose.',
      ],
    ],
  ],
  reservoirArrival: [
    'The flooded walkway',
    'The Spillway',
    [
      [
        'Wick',
        'Upper walk. Look down before you put a foot on the grating. There’s a pump with the lid off.',
      ],
      ['You', 'Somebody’s hung a coat over the casing to keep the spray out.'],
    ],
  ],
  bellkeeperBefore: [
    'The closed sluice',
    'The Bell Cistern',
    [
      ['The Bellkeeper', 'Hand off that sluice. I’ve got a hundred feet of water behind it.'],
      ['You', 'The Foundry needs a cooling line. We have to get water down there.'],
      [
        'The Bellkeeper',
        'I opened it a finger’s width last time. The whole lower walk went with it. Back behind the bell.',
      ],
    ],
  ],
  bellkeeperAfter: [
    'The bypass',
    'The Bell Cistern',
    [
      ['The Bellkeeper', 'Use the upper channel. The little gate beside the bell.'],
      ['Wick', 'That goes around the lower walk?'],
      ['The Bellkeeper', 'All the way round. Open it slow enough to hear the water change.'],
    ],
  ],
  foundryArrival: [
    'The cooling line',
    'The Cold Forge',
    [
      ['Wick', 'Off the handrail. Even the paint’s blistered.'],
      ['You', 'How long has the furnace been off?'],
      ['Wick', 'Long enough for the paint to blister. That’s about it.'],
    ],
  ],
  colossusBefore: [
    'The furnace platform',
    'The Furnace Crown',
    [
      [
        'The Ember Colossus',
        'Coolant pressure zero. Hot platform. Evacuation order applies to all personnel.',
      ],
      ['You', 'Hold the furnace off. We’re hooking the cooling line back up.'],
      [
        'The Ember Colossus',
        'Manual shutdown refused. Evacuation order applies to the operator as well.',
      ],
    ],
  ],
  colossusAfter: [
    'The cooling cycle',
    'The Furnace Crown',
    [
      ['The Ember Colossus', 'Pressure returning. Coolant detected at the far joint.'],
      ['Wick', 'Leave the valve wide open. I want water coming out cold at the other end.'],
      ['The Ember Colossus', 'Cooling cycle started. Maintenance may reenter in six hours.'],
    ],
  ],
  obsArrival: [
    'The observation shaft',
    'The Fallen Orrery',
    [
      ['You', 'That slit up there. Is that where they used to look out?'],
      [
        'Wick',
        'Look where the small lens is pointing. That’s the shaft that comes out beside the road.',
      ],
    ],
  ],
  astronomerBefore: [
    'The secondary shutter',
    'The Shattered Dome',
    [
      ['The Glass Astronomer', 'Please move your feet. You’re standing on the fine adjustment.'],
      ['You', 'Can we turn the small lens toward the road?'],
      [
        'The Glass Astronomer',
        'I borrowed that lens when the main one cracked. If you need a window, find one upstairs.',
      ],
    ],
  ],
  astronomerAfter: [
    'The observation plate',
    'The Shattered Dome',
    [
      [
        'The Glass Astronomer',
        'There. I’ve freed your shutter. If the road is still there, it’ll be in the lower left.',
      ],
      ['You', 'Do you have a spare plate? I need to take the picture with me.'],
      [
        'The Glass Astronomer',
        'Under the desk. The top one has a thumbprint. Leave that one for me.',
      ],
    ],
  ],
  archiveArrival: [
    'The current roster',
    'The Intake Desk',
    [
      ['Wick', 'Look for the Hearth supply record. Check the trays by the intake desk.'],
      ['You', 'These all have the same date. Even the breakfast roster.'],
      ['Wick', 'Read the names. If Nell’s still on kitchen duty, that’s an old one.'],
    ],
  ],
  scribeBefore: [
    'The locked records',
    'The Last Margin',
    [
      ['The Pale Scribe', 'That drawer stays locked. Would you mind taking your hand off it first?'],
      ['You', 'I need to see which cable feeds the Hearth.'],
      [
        'The Pale Scribe',
        'Last time a record left this room, two people woke up with the same house key. Tell me the number. I’ll look.',
      ],
    ],
  ],
  scribeAfter: [
    'The independent line',
    'The Last Margin',
    [
      [
        'The Pale Scribe',
        'Nine years’ worth of his corrections, all in the margin. If that page goes missing, I can’t tell which version he used.',
      ],
      ['You', 'Then make me a copy. The Hearth supply and the list from the repair crew.'],
      [
        'The Pale Scribe',
        'Here’s the diagram. And here are their names. All six are still at the Heart. He signed each shutdown himself.',
      ],
    ],
  ],
  courtArrival: [
    'The paired controls',
    'The Servants’ Door',
    [
      ['You', 'Two sets of handles. Are these for the same door?'],
      ['Wick', 'Yes. They once made me wait while they settled who got to open the teapot.'],
    ],
  ],
  regentsBefore: [
    'The evacuation locks',
    'The Audience Chamber',
    [
      ['The First Regent', 'I’ll retain the picture for the record.'],
      ['You', 'You can keep it. We need the stair open.'],
      ['The Second Regent', 'The record would be improved by letting someone go up and look.'],
      ['The First Regent', 'Close both doors. We will take this in order.'],
    ],
  ],
  regentsAfter: [
    'Both controls',
    'The Audience Chamber',
    [
      ['The Second Regent', 'I have the left handle. On three?'],
      ['The First Regent', 'On two. The right one sticks.'],
      ['The Second Regent', 'One. Two.'],
    ],
  ],
  choirArrival: [
    'The return bells',
    'The Low Refrain',
    [
      ['You', 'There’s nobody up there, but all the bells are moving.'],
      ['Wick', 'It’s the return signal. Oren’s tracing the branch that goes up to the Hearth.'],
    ],
  ],
  seraphBefore: [
    'The bell junction',
    'The Open Belfry',
    [
      ['The Void Seraph', 'I can hear the Hearth on that line. Leave it where it is.'],
      ['You', 'Oren found a separate power cable. The lamps can stay on.'],
      [
        'The Void Seraph',
        'I could hear all six Embers on these bells. Then one day I could hear none of them. Step away.',
      ],
    ],
  ],
  seraphAfter: [
    'The supply stays on',
    'The Open Belfry',
    [
      ['The Void Seraph', 'The top lamp’s still lit. And the bell’s gone quiet.'],
      ['Wick', 'The people are all right. Oren left their supply on.'],
      [
        'The Void Seraph',
        'Go while I’ve got this bell by the rim. I can feel the crack coming apart.',
      ],
    ],
  ],
  citadelArrival: [
    'The inward defenses',
    'The Inward Wall',
    [
      ['You', 'The weapons are facing in. Somebody drilled new holes for the mounts.'],
      [
        'Wick',
        'After the Keeper ordered everybody back. You couldn’t leave without a return plate.',
      ],
    ],
  ],
  tyrantBefore: [
    'The containment order',
    'The Siege Hall',
    [
      ['The Obsidian Tyrant', 'Present return plate. Hold it flat against the reader.'],
      ['You', 'I don’t have one.'],
      [
        'The Obsidian Tyrant',
        'Reader checked. No fault. The bearer will return to the upper checkpoint.',
      ],
      ['Wick', 'Back away from the wheels. It’s already moving.'],
    ],
  ],
  tyrantAfter: [
    'The carriage stops',
    'The Siege Hall',
    [
      ['The Obsidian Tyrant', 'Motor stopped. Brakes engaged. Stand by for an officer.'],
      ['You', 'There’s a gap by the back wheel. I can fit.'],
      ['Wick', 'Through it, then take the service stair. The officer’s had long enough.'],
    ],
  ],
  heartArrival: [
    'The copied rooms',
    'The Borrowed Gate',
    [
      ['You', 'That’s our gate. The same chip out of the corner.'],
      ['Wick', 'Look lower. Our steps have worn hollow. This copy still thinks they’re new.'],
    ],
  ],
  keeperBefore: [
    'The final control',
    'The Heart of the Star',
    [
      ['The First Keeper', 'Wick. Their return contact is open. Give me the plate.'],
      ['Wick', 'I took it off at the nursery. I still have it.'],
      ['You', 'We got a look at the road. There’s grass coming up along the wall.'],
      ['Wick', 'Oren has the Hearth on its own supply. You can come up and check the lamps.'],
      [
        'The First Keeper',
        'I watched that wall go down with people on it. I’m going to need more than grass. Get away from the release.',
      ],
    ],
  ],
  keeperAfter: [
    'The release cover',
    'The Heart of the Star',
    [
      ['The First Keeper', 'Easy with that lever. The Hearth’s on the contact underneath.'],
      ['You', 'Then show me which one opens the gate.'],
      [
        'The First Keeper',
        'What are you going to tell them if we get up there and the road’s gone?',
      ],
      ['Wick', 'We’ll tell them the road’s gone. Let them look over the wall with us.'],
      [
        'The First Keeper',
        'Mara first. Everybody else waits on this side until she’s walked to the bend.',
      ],
      ['You', 'Will you come as far as the landing?'],
      ['The First Keeper', 'Yes. Get your fingers under the cover. I’ll show you the release.'],
    ],
  ],
};

function installDescentDialogueCopy() {
  for (const [id, [title, where, lines]] of Object.entries(DESCENT_DIALOGUE_COPY))
    HOLLOW_SCENES[id] = { title, where, lines };
}
