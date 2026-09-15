/* ======================================================================
   PLAYER CHANGELOG
   Add exactly one entry for every published update. Version numbers must
   always increase, and published entries stay unchanged so each browser
   can receive only the notes it has not seen.
   ====================================================================== */
'use strict';

const VOIDFALL_CHANGELOG=[
 {version:2026091502,date:'SEPTEMBER 15, 2026',title:'THE FIRST DESCENT',intro:'The Hollow Gate now teaches by watching what you do and what you face.',changes:['First-run guidance appears when an action becomes useful and disappears as soon as it is learned.','The first rooms introduce enemies one at a time before authored encounters and mixed groups begin.','Movement, Ember Bolt, Flare, Dash, Rekindling, Resting Flames, blessings, and the Warden each receive a focused introduction.','Early deaths now connect the Run Recap to a suggested Skill Tree upgrade.','The Warden’s opening and the passage into the Rootbound Gardens have clearer guidance and presentation.','Existing progress is preserved. Experienced players will not be shown beginner prompts.']},
 {version:2026091501,date:'SEPTEMBER 15, 2026',title:'EVERY DESCENT LEAVES A RECORD',intro:'See what happened, pick your next goal, and help shape the next update.',changes:['Run recaps show your last encounter, blessings, forms, defeated guardians, and earned essence.','View an affordable sigil or the next step toward your chosen form directly in the Skill Tree.','Copy a run report and add your feedback. Reports stay on your device until you share them.','Your last recap survives a reload. This update keeps your progress.']},
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
   'Guardians now push back when a lucky set of blessings makes the Ember too strong, and later Guardians expect real Skill Tree progress.',
   'The outdated automatic-fire instruction has been removed from How to Play.'
  ]
 }
];
const VOIDFALL_CHANGELOG_CURRENT=Math.max(...VOIDFALL_CHANGELOG.map(entry=>entry.version));

function readSeenChangelog(){
 try{const n=Number(localStorage.getItem(CHANGELOG_SEEN_KEY));return Number.isFinite(n)&&n>0?n:0;}
 catch(_){return 0;}
}
function writeSeenChangelog(version){try{localStorage.setItem(CHANGELOG_SEEN_KEY,String(version));}catch(_){ }}
function progressionResetBelongsToThisBrowser(){
 try{
   const raw=localStorage.getItem(PROGRESSION_RESET_MARKER),record=raw?JSON.parse(raw):null;
   return record?.status==='reset';
 }catch(_){return globalThis.VoidFallSaveSystem?.migration?.status==='reset';}
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
function closeVoidFallUpdates(){
 writeSeenChangelog(VOIDFALL_CHANGELOG_CURRENT);hide('changelog');
 const target=save.resume?T('btnContinue'):T('btnStart');target?.focus({preventScroll:true});
}
function showVoidFallUpdates(){
 const seen=readSeenChangelog(),returning=progressionResetBelongsToThisBrowser()||seen>0;
 // A first-time player starts on the current release and does not need patch notes.
 if(!returning){writeSeenChangelog(VOIDFALL_CHANGELOG_CURRENT);return;}
 const unread=VOIDFALL_CHANGELOG.filter(entry=>entry.version>seen).sort((a,b)=>a.version-b.version);
 if(!unread.length)return;
 const reset=progressionResetBelongsToThisBrowser()&&seen===0;
 T('resetNotice').hidden=!reset;T('changelogClose').textContent=reset?'BEGIN AGAIN':'RETURN TO VOIDFALL';
 renderChangelogEntries(unread);show('changelog');T('changelogClose').focus({preventScroll:true});
}

on(T('changelogClose'),'click',closeVoidFallUpdates);
const changelogBlocking=anyBlockingOverlay;
anyBlockingOverlay=function(){return T('changelog').classList.contains('open')||changelogBlocking();};
const changelogEscape=onEscKey;
onEscKey=function(){if(T('changelog').classList.contains('open')){closeVoidFallUpdates();return;}return changelogEscape();};

globalThis.VoidFallChangelog={current:VOIDFALL_CHANGELOG_CURRENT,entries:VOIDFALL_CHANGELOG.map(entry=>({...entry,changes:[...entry.changes]})),get seen(){return readSeenChangelog();},show:showVoidFallUpdates};
document.documentElement.dataset.release='progression-rebuild';
