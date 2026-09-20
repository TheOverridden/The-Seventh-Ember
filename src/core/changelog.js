'use strict';

const THE_SEVENTH_EMBER_CHANGELOG=[
 {version:2026092002,date:'SEPTEMBER 20, 2026',title:'ROOMS BEHIND ROOMS',intro:'The descent has begun keeping things behind its walls.',changes:['Hidden passages can now be uncovered through regional clues, close inspection, or a well-placed Flare.','Eleven hidden chamber types offer rest, trials, wagers, maps, blessings, run improvements, rare Seventh Marks, and other discoveries.','The Back Room now appears deep in the passage network, where Moth trades a run-only currency called Marks for carefully chosen goods.','Every region has its own hidden-door construction, corridor architecture, chamber details, lighting, particles, focal objects, and sound.','Hidden rooms reserve space inside the existing encounter budget, remain optional, support keyboard and touch controls, and save every discovery, purchase, trial, and reward with the run.']},
 {version:2026092001,date:'SEPTEMBER 20, 2026',title:'ONE MEMORY, ONE FORM',intro:'Retired pieces of the old descent have been cleared from the Archive.',changes:['Echoes now open only through their restored-room sequences; the superseded dialogue versions are gone.','The Star Warden now uses only the finished Warden artwork, with the prototype boss image removed.','Existing saves keep every current conversation, recovered Echo, story choice, and progression record.']},
 {version:2026091902,date:'SEPTEMBER 19, 2026',title:'A QUIETER SPARK',intro:'The new counterattack now teaches itself without crowding the fight.',changes:['The Dash Counter appears once in the combat tips when it is first discovered.','Repeated counters now rely on the gold visual effect instead of floating labels and changing HUD text.','The opening floor objectives now describe the journey through the Hollow instead of listing controls.']},
 {version:2026091901,date:'SEPTEMBER 19, 2026',title:'THE EMBER ANSWERS',intro:'The first descent now teaches a complete fighting rhythm.',changes:['A close Dash through an attack now Kindles the next Flare, turning a precise evade into a stronger counterattack.','Flare reaches farther, starts faster, buffers near the end of its recovery, and gains a shorter recovery after a successful Kindled strike.','Dash inputs now buffer briefly, and dashing can cancel Rekindling when danger closes in.','The first floor introduces its creatures room by room without a sealed encounter, while later tutorial floors add distinct room trials.','The first treasure now offers a clear choice between power, movement, and Dash recovery.','Gate creatures now reward attacks during recovery and can be interrupted by a Kindled Flare.','The Star Warden has more health, a clearer shield-and-counter rhythm, a stronger second phase, and a final low-health pattern.','First-descent guidance and objectives now explain the combat rhythm only when each lesson becomes useful.','Echo scenes now bring the active speaker forward inside the restored room, including full-room appearances for Wick and the Ember.']},
 {version:2026091803,date:'SEPTEMBER 18, 2026',title:'WICK WAS LISTENING',intro:'The silence was a bug, not restraint.',changes:['Wick now responds to repeated empty interactions during any ordinary descent.','The hidden exchange no longer requires a discovered portal or an empty floor, and its timing is more forgiving.','Real interactions with gates, Resting Flames, memories, and traces still take priority.']},
 {version:2026091802,date:'SEPTEMBER 18, 2026',title:'A LIGHT WITH OPINIONS',intro:'Wick has begun helping in ways no one requested.',changes:['Once an open portal has been discovered, press Q or use the new on-screen control to return to it from anywhere on the floor.','Portal returns use a brief protected transition and leave the choice to descend in your hands.','Wick may notice unusual behavior around an open gate.','A new secret Epic blessing can mark the room’s greatest threat, strengthen attacks against it, and restore an Ember Bolt charge when it falls.','The secret and portal return both work with keyboard, mouse, and touchscreen controls and remain intact when a run is saved.']},
 {version:2026091801,date:'SEPTEMBER 18, 2026',title:'THE GATE OPENS',intro:'The descent now arrives as a finished scene.',changes:['Reloading now holds on a dedicated Seventh Ember opening screen while the dungeon, save, and menus are prepared.','The complete title screen fades in only after startup is ready, removing the brief half-built menu and frozen controls.','The opening automatically gives way if startup encounters a problem, so it cannot trap the player behind a loading screen.','Saves, progression, controls, and gameplay are unchanged.']},
 {version:2026091707,date:'SEPTEMBER 17, 2026',title:'THE SEVENTH EMBER',intro:'The descent has found its name.',changes:['The game is now titled The Seventh Ember across the title screen, browser, saves, exports, and project identity.','Every menu, overlay, HUD plate, blessing card, dialogue frame, Memory, Skill Tree panel, touch control, and ending screen now shares one carved-stone, ember-gold visual language.','Each region carries its own restrained accent through the interface while text, controls, and combat information remain consistent.','The new name points toward the six vessels who came before the player without giving away what waits below.','Existing progress and active runs move automatically into the renamed save system.','Gameplay, balance, controls, and progression are unchanged.']},
 {version:2026091706,date:'SEPTEMBER 17, 2026',title:'EMBERLIGHT',intro:'The threshold now burns with the same warmth as the Ember.',changes:['Cyan title-screen accents have been replaced with aged gold, bronze, warm ivory, and restrained ember-orange.','The chamber stone, gate aperture, orbiting shards, menu borders, icons, and focus states now share the warmer palette.','Violet remains reserved for Ember Forms and Essence so those systems keep their own identity.','Layout, progress, saves, controls, and gameplay are unchanged.']},
 {version:2026091704,date:'SEPTEMBER 17, 2026',title:'THE GATE IN VIEW',intro:'The descent now begins before the first step.',changes:['The title screen now opens on a full pixel-art chamber with the Ember facing an awakened gate.','Orbiting shards, a living aperture, braziers, drifting motes, and layered chamber lighting give the scene depth and motion.','Navigation now has a clear primary action, polished secondary controls, compact Guardian access, and a cleaner permanent record.','Desktop, Chromebook, tablet, phone, ultrawide, and short landscape layouts each receive a dedicated composition.','Progress, saves, controls, and gameplay are unchanged.']},
 {version:2026091703,date:'SEPTEMBER 17, 2026',title:'A QUIETER THRESHOLD',intro:'The threshold belongs to the Ember again.',changes:['The title screen now centers the original pixel-art dungeon and Ember instead of covering them with oversized decoration.','The menu has quieter framing, cleaner lettering, and simpler controls that fit the game’s established visual style.','The full title menu remains readable on desktop, Chromebook, tablet, phone, and short landscape displays.','Progress, saves, controls, and gameplay are unchanged.']},
 {version:2026091702,date:'SEPTEMBER 17, 2026',title:'AT THE THRESHOLD',intro:'The first sight of the descent has been rebuilt.',changes:['The title screen now frames the Ember in a larger animated sigil with orbiting shards and layered depth.','Menu actions, Guardian modes, and permanent records now share a clearer hierarchy and stronger focus states.','Phone, tablet, desktop, ultrawide, and short landscape layouts now fit the complete menu without clipping or overflow.','Progress, saves, controls, and gameplay are unchanged.']},
 {version:2026091701,date:'SEPTEMBER 17, 2026',title:'THE OLD WARD STIRS',intro:'The old wards speak through the arena now.',changes:['Guardian wards now answer the Ember through shifting defenses, arena pressure, and attunement.','The Skill Tree now keeps its focus on the sigils that remain between descents.','Run records, menus, and combat messages now share a consistent voice.','Combat behavior, difficulty, progression, music, and existing saves are unchanged.']},
 {version:2026091601,date:'SEPTEMBER 16, 2026',title:'FALLING LIGHT',intro:'An original score and a renewed interface now accompany the descent.',changes:['One synchronized theme now carries melody, harmony, counterline, percussion, and a deep rolling bass through the entire game.','Each region reshapes the same central theme into its own musical movement, while Guardians intensify the arrangement without abandoning the song.','Music now starts from the title screen, develops in four-part form, and reacts smoothly to exploration, crowded rooms, and boss fights.','Music and effects have separate volume controls, and existing mute controls still work.','Menus, HUD, dialogue, blessing cards, Skill Tree, settings, and run screens now share a sharper ember-and-spectral interface with clearer hierarchy and interaction states.','Touch devices, desktops, portrait orientation, landscape, and short displays reorganize around the available space.','Gameplay balance and progression are unchanged. Existing saves automatically receive sensible volume defaults.']},
 {version:2026091504,date:'SEPTEMBER 15, 2026',title:'EVERY STRIKE LANDS',intro:'Combat now carries its weight from the first creature to the final Guardian.',changes:['Enemy deaths now resolve with distinct fractures, blooms, ripples, cinders, ink, or starlight while preserving every established sprite.','Clearing an ordinary room or breaking a sealed encounter releases the room with a visual and audible finish.','Every Guardian receives a consistent phase-change moment with a title unique to the encounter.','The score now gathers pace and percussion as nearby enemies and projectiles raise the pressure.','Elemental attacks have clearer impact colors, while Flare, critical hits, dashes, near misses, damage, and Rekindling retain their existing feedback.','Combat numbers, cooldowns, enemy timing, and existing saves are unchanged.']},
 {version:2026091503,date:'SEPTEMBER 15, 2026',title:'A FALSE ALARM SILENCED',intro:'The game will no longer mistake harmless browser events for an unknown error.',changes:['Removed the persistent “Error: unknown” notice caused by message-less browser events.','Unexpected failures still produce a useful message, can be dismissed, and disappear automatically after ten seconds.','Repeated copies of the same error are suppressed so they cannot cover the game.','Existing saves and progression are preserved.']},
 {version:2026091502,date:'SEPTEMBER 15, 2026',title:'THE FIRST DESCENT',intro:'The Hollow Gate now teaches by watching what you do and what you face.',changes:['First-run guidance appears when an action becomes useful and disappears as soon as it is learned.','The first rooms introduce enemies one at a time before sealed encounters and mixed groups begin.','Movement, Ember Bolt, Flare, Dash, Rekindling, Resting Flames, blessings, and the Warden each receive a focused introduction.','Early deaths now connect the Run Recap to a suggested Skill Tree upgrade.','The Warden’s opening and the passage into the Rootbound Gardens have clearer guidance and presentation.','Existing progress is preserved. Experienced players will not see first-descent guidance.']},
 {version:2026091501,date:'SEPTEMBER 15, 2026',title:'EVERY DESCENT LEAVES A RECORD',intro:'See what happened, choose your next goal, and preserve the record.',changes:['Run recaps show your last encounter, blessings, forms, defeated guardians, and earned essence.','View an affordable sigil or the next step toward your chosen form directly in the Skill Tree.','Copy a run record for your own notes. Records remain on your device until you copy them.','Your last recap survives a reload without affecting permanent progress.']},
 {
  version:2026091401,
  date:'SEPTEMBER 14, 2026',
  title:'THE PROGRESSION REBUILD',
  intro:'Runs now grow at a deliberate pace from the Hollow Gate to the Heart of the Star.',
  changes:[
   'Blessing choices are paced across the full campaign and continue deep into Endless.',
   'Reward caches now appear in chosen rooms instead of multiplying with a lucky floor layout.',
   'The Skill Tree is once again a long-term pursuit: early sigils stay affordable, while deep branches take commitment.',
   'Enemies gain health and damage more steadily through the later regions.',
   'Later Guardians now wake with stronger wards, longer encounters, and deeper phase changes.',
   'How to Play now matches the current controls.'
  ]
 }
];
const THE_SEVENTH_EMBER_CHANGELOG_CURRENT=Math.max(...THE_SEVENTH_EMBER_CHANGELOG.map(entry=>entry.version));

function readSeenChangelog(){
 try{const n=Number(localStorage.getItem(CHANGELOG_SEEN_KEY));return Number.isFinite(n)&&n>0?n:0;}
 catch(_){return 0;}
}
function writeSeenChangelog(version){try{localStorage.setItem(CHANGELOG_SEEN_KEY,String(version));}catch(_){ }}
function progressionResetBelongsToThisBrowser(){
 try{
   const raw=localStorage.getItem(PROGRESSION_RESET_MARKER),record=raw?JSON.parse(raw):null;
   return record?.status==='reset';
 }catch(_){return globalThis.TheSeventhEmberSaveSystem?.migration?.status==='reset';}
}
function renderChangelogEntries(entries){
 const wrap=T('changelogEntries');wrap.replaceChildren();
 for(const entry of entries){
  const article=document.createElement('article'),head=document.createElement('div'),title=document.createElement('h3'),intro=document.createElement('p'),list=document.createElement('ul');
  article.className='changelog-entry';head.className='changelog-entry-head';head.textContent=entry.date;title.textContent=entry.title;intro.textContent=entry.intro;
  for(const change of entry.changes){const item=document.createElement('li');item.textContent=change;list.appendChild(item);}
  article.append(head,title,intro,list);wrap.appendChild(article);
 }
}
function closeTheSeventhEmberUpdates(){
 writeSeenChangelog(THE_SEVENTH_EMBER_CHANGELOG_CURRENT);hide('changelog');
 const target=save.resume?T('btnContinue'):T('btnStart');target?.focus({preventScroll:true});
}
function showTheSeventhEmberUpdates(){
 const seen=readSeenChangelog(),returning=progressionResetBelongsToThisBrowser()||seen>0;
 if(!returning){writeSeenChangelog(THE_SEVENTH_EMBER_CHANGELOG_CURRENT);return;}
 const unread=THE_SEVENTH_EMBER_CHANGELOG.filter(entry=>entry.version>seen).sort((a,b)=>a.version-b.version);
 if(!unread.length)return;
 const reset=progressionResetBelongsToThisBrowser()&&seen===0;
 T('resetNotice').hidden=!reset;T('changelogClose').textContent=reset?'BEGIN AGAIN':'RETURN TO THE SEVENTH EMBER';
 renderChangelogEntries(unread);show('changelog');T('changelogClose').focus({preventScroll:true});
}

on(T('changelogClose'),'click',closeTheSeventhEmberUpdates);
const changelogBlocking=anyBlockingOverlay;
anyBlockingOverlay=function(){return T('changelog').classList.contains('open')||changelogBlocking();};
const changelogEscape=onEscKey;
onEscKey=function(){if(T('changelog').classList.contains('open')){closeTheSeventhEmberUpdates();return;}return changelogEscape();};

globalThis.TheSeventhEmberChangelog={current:THE_SEVENTH_EMBER_CHANGELOG_CURRENT,entries:THE_SEVENTH_EMBER_CHANGELOG.map(entry=>({...entry,changes:[...entry.changes]})),get seen(){return readSeenChangelog();},show:showTheSeventhEmberUpdates};
document.documentElement.dataset.release='the-seventh-ember';
