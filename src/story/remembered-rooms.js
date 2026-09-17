Object.assign(HOLLOW_SCENES,{
 reservoirChoice:{title:'The fourth line',where:'The Sunken Walk',lines:[
  ['You','This parcel was packed before the water rose.'],
  ['Wick','Somebody knew the flood was coming.'],
  {speaker:'You',choices:[
   {label:'Ring the evacuation bell.',reply:[['You','We warn everyone still above the lower doors.'],['Wick','Then we make enough noise to be heard.']]},
   {label:'Open the lower doors.',reply:[['You','Move the water away from the sleeping wards.'],['Wick','The lower crews will lose their way out.'],['You','I know.']]},
   {label:'Leave the system sealed.',reply:[['You','No more water moves until we know what is listening.'],['Wick','Safe for now. That used to be enough.']]}
  ]}
 ]},
 foundryChoice:{title:'Your place in line',where:'The Hammer Line',lines:[
  ['Wick','Number three. That was your station.'],
  ['You','The hammer struck early and I kept working beside it.'],
  {speaker:'You',choices:[
   {label:'Repair the line properly.',reply:[['You','No wedges. We stop it and fix the timing.'],['Wick','The old crew would like that answer.']]},
   {label:'Shut the line down.',reply:[['You','Nothing down here is worth another crushed hand.'],['Wick','You did not say that the first time.']]},
   {label:'Keep the hammer token.',reply:[['You','I want proof that this was mine.'],['Wick','Then keep it. Just don’t let it choose for you.']]}
  ]}
 ]},
 observatoryChoice:{title:'Two sets of steps',where:'The Parallax Walk',lines:[
  ['You','Both tracks are mine.'],
  ['Wick','One was made nine years ago. The other is newer.'],
  {speaker:'You',choices:[
   {label:'Follow the left footprints.',reply:[['You','The note says not to. That means I expected to read it.'],['Wick','That is exactly your kind of reasoning.']]},
   {label:'Mark them and move on.',reply:[['You','We need facts before we follow another version of me.'],['Wick','I have chalk. You made me carry chalk.']]},
   {label:'Ask Wick which trail is mine.',reply:[['You','Which one did you see me make?'],['Wick','The left. I was afraid you would ask.']]}
  ]}
 ]},
 archiveChoice:{title:'The last uncut name',where:'The Redaction Rooms',lines:[
  ['You','I ordered the names removed.'],
  ['Wick','You thought names were how it found people.'],
  {speaker:'You',choices:[
   {label:'Preserve one complete copy.',reply:[['You','Hidden, sealed, and in my handwriting. People deserve their names back.'],['Wick','Then we look for where you hid it.']]},
   {label:'Burn the remaining record.',reply:[['You','If the Listener can still read this, nobody on the page is safe.'],['Wick','I’ll remember the names I know.']]},
   {label:'Let Wick decide.',reply:[['You','You carried this longer than I did.'],['Wick','Keep the names. Burn the route to them.']]}
  ]}
 ]},
 courtChoice:{title:'Three signatures',where:'The Council Table',lines:[
  ['You','The order has my hand and both Regents’ seals.'],
  ['Wick','Everyone down here spent years deciding whose fault that made it.'],
  {speaker:'You',choices:[
   {label:'The order was mine.',reply:[['You','Authority or not, I wrote it.'],['Wick','Responsibility is not the same thing as surrender.']]},
   {label:'The Regents authorized it.',reply:[['You','They knew what the seal would do.'],['Wick','So did you. That is why they needed your hand.']]},
   {label:'We share what happened.',reply:[['You','Three signatures. Three people who chose.'],['Wick','That answer will annoy both of them.'],['You','Good.']]}
  ]}
 ]},
 choirChoice:{title:'The filed note',where:'The Cantor’s Stair',lines:[
  ['Wick','That strip is the note we cut out of the hymn.'],
  ['You','The Listener used it to find the First Star.'],
  {speaker:'You',choices:[
   {label:'Destroy the note.',reply:[['You','No one sings this again.'],['Wick','Then remember the shape of the hole it leaves.']]},
   {label:'Preserve it in silence.',reply:[['You','Seal it where nobody can sound it.'],['Wick','A dangerous thing can still be evidence.']]},
   {label:'Change the ending.',reply:[['You','Keep the first bars. Give the last one somewhere new to land.'],['Wick','You want to rewrite a lock while we are inside it.'],['You','Yes.']]}
  ]}
 ]},
 citadelChoice:{title:'Aimed inward',where:'The Muster Hall',lines:[
  ['You','The range marks all point toward the lower archive.'],
  ['Wick','They were waiting for the doors to open.'],
  {speaker:'You',choices:[
   {label:'Disable every weapon.',reply:[['You','Nobody gets to inherit this firing line.'],['Wick','Then we pull the teeth one by one.']]},
   {label:'Turn the defenses outward.',reply:[['You','The people coming out will need a wall.'],['Wick','Mara can teach them which end is forward.']]},
   {label:'Aim them at the Heart.',reply:[['You','If the door fails, we need a second way to stop it.'],['Wick','I hate that you are right.']]}
  ]}
 ]},
 heartChoice:{title:'The name on the vessel',where:'The Unwritten Room',lines:[
  ['You','This plate was left blank for me.'],
  ['Wick','For whichever version reached the Heart.'],
  {speaker:'You',choices:[
   {label:'I am the Last Lamplighter.',reply:[['You','The work is mine, even if the memories came late.'],['Wick','Then carry the name because you chose it.']]},
   {label:'I’m what came after.',reply:[['You','I can inherit the work without pretending I am the dead.'],['Wick','I was hoping you would say that.']]},
   {label:'I don’t need the name.',reply:[['You','I’m here. That is enough for the door.'],['Wick','It is enough for me.']]}
  ]}
 ]},
 listenerRecognition:{title:'A borrowed answer',where:'The Heart of the Star',lines:[
  ['The Listener','WHY DID YOU COME?'],
  ['Wick','It knows the old answer. Don’t give it anything you remember.'],
  ['You','Then I’ll give it something I decided.']
 ]}
});

const STORY_ANCHORS={
 trace13:'reservoirChoice',trace18:'foundryChoice',trace23:'observatoryChoice',
 trace28:'archiveChoice',trace33:'courtChoice',trace38:'choirChoice',
 trace43:'citadelChoice',trace48:'heartChoice'
};
function storyChoice(id){const scene=HOLLOW_SCENES[id];if(!scene)return-1;for(let i=0;i<scene.lines.length;i++)if(scene.lines[i]?.choices){const n=storyData().choices[id+':'+i];return Number.isInteger(n)?n:-1;}return-1;}
function storyProfile(){
 const choices={barracks:storyChoice('barracks'),garden:storyChoice('gardenChoice'),reservoir:storyChoice('reservoirChoice'),foundry:storyChoice('foundryChoice'),observatory:storyChoice('observatoryChoice'),archive:storyChoice('archiveChoice'),court:storyChoice('courtChoice'),choir:storyChoice('choirChoice'),citadel:storyChoice('citadelChoice'),heart:storyChoice('heartChoice')};
 let mercy=0,resolve=0,trust=0;
 for(const [id,n] of Object.entries(choices)){if(n<0)continue;if(n===0)resolve++;if(n===1)mercy++;if(n===2)trust++;if(id==='reservoir'&&n===0)mercy+=2;if(id==='court'&&n===2)mercy++;if(id==='citadel'&&n===1)mercy+=2;}
 return{choices,mercy,resolve,trust,count:Object.values(choices).filter(n=>n>=0).length,answer:storyData().finalAnswer||''};
}

const rememberedStoryLines=storyLines;
storyLines=function(id){
 const lines=rememberedStoryLines(id),p=storyProfile(),c=p.choices;
 const add=(speaker,text,at=lines.length)=>lines.splice(at,0,{speaker,text});
 if(id==='archiveArrival'&&c.barracks>=0)add('Wick',c.barracks===0?'The torn sleeve still has the blue thread I held for you. I thought you might recognize my knot.':'The photograph from the foundry is still in that coat. You took it before the last watch.',Math.max(1,lines.length-1));
 if(id==='matriarchBefore'&&c.garden>=0)add('The Hollow Matriarch',c.garden===0?'You kept the roots out until the voices began asking in your own voice.':'You wrote the joke on my warning sign. Then you opened the gate without asking.',Math.max(1,lines.length-1));
 if(id==='bellkeeperBefore'&&c.reservoir>=0)add('The Bellkeeper',[
  'The evacuation bell answered you. Forty-two people cleared the upper walk.',
  'You opened the lower doors once. I still hear that crew knocking.',
  'You sealed the water here. It found another route.'
 ][c.reservoir],Math.max(1,lines.length-1));
 if(id==='colossusBefore'&&c.foundry>=0)add('The Ember Colossus',[
  'Repair request received. Nine years overdue.',
  'Shutdown request denied by emergency order.',
  'Worker three. Present your token.'
 ][c.foundry],2);
 if(id==='astronomerAfter'&&c.observatory>=0)add('The Glass Astronomer',[
  'The left trail reaches the first failed vessel.',
  'Your chalk marks survived. The person who made them did not.',
  'Wick watched both sets form. Ask why he only remembers one.'
 ][c.observatory],Math.max(1,lines.length-1));
 if(id==='scribeAfter'&&c.archive>=0)add('The Pale Scribe',[
  'Your complete copy remains behind a wall marked WEATHER.',
  'Then finish the instruction. I will not stop you.',
  'The lamp chose names over roads. A careful edit.'
 ][c.archive],Math.max(1,lines.length-1));
 if(id==='regentsAfter'&&c.court>=0)add(c.court===1?'The First Regent':'The Second Regent',[
  'You claim your hand. We will answer for our seals.',
  'Authority is not innocence. Neither is obedience.',
  'Shared blame. An answer nobody here learned to give.'
 ][c.court],Math.max(1,lines.length-1));
 if(id==='seraphAfter'&&c.choir>=0)add('Wick',[
  'The last note is ash. The song ends cleanly now.',
  'The note is sealed. I can still feel it waiting.',
  'Your new ending held. The stairs did not grow.'
 ][c.choir],lines.length);
 if(id==='tyrantBefore'&&c.citadel>=0)add('The Obsidian Tyrant',[
  'DISARM ORDER DETECTED. DENIED.',
  'OUTWARD ALIGNMENT DETECTED. NO EXTERNAL TARGET.',
  'HEARTWARD ALIGNMENT DETECTED. TREASON CONFIRMED.'
 ][c.citadel],1);
 if(id==='keeperBefore'&&c.heart>=0)add('The First Keeper',[
  'Lamplighter recognized. Death record disputed.',
  'Successor pattern rejected. Only the original may turn the key.',
  'Unnamed vessels have no standing here.'
 ][c.heart],1);
 if(id==='keeperAfter'){
  if(c.archive===0)add('Wick','The names are in the wall behind the weather index. We can bring them out with the people.',lines.length);
  else if(c.archive===1)add('Wick','I kept the names you said out loud. It is not everyone, but it is a beginning.',lines.length);
  else if(c.archive===2)add('Wick','I saved the names and burned the path. That choice is mine too.',lines.length);
  if(p.count>=6)add('The First Keeper','Your decisions do not match the Lamplighter record.',lines.length);
 }
 return lines;
};

const ECHO_REACTIONS={
 echo1:[['You','Mara traded shifts because she was watching the lower door.'],['Wick','She never told the roster why.']],
 echo2:[['Wick','The blue cloth was mine before I had a voice.'],['You','You were already helping.']],
 echo3:[['You','Supper, warning, celebration. Same rope.'],['Wick','A bell meant whatever the people needed.']],
 echo4:[['You','They thought there would be another watch.'],['Wick','Everybody did.']],
 echo5:[['Wick','You made Mara promise to ask.'],['You','And I gave her an answer the Listener could learn.']],
 echo6:[['You','I planted weeds twice.'],['Wick','You were better with machines.']],
 echo7:[['Wick','The roots broke the glass from underneath.'],['You','Because they were making room for the vessels.']],
 echo8:[['You','I knew something could ask in a familiar voice.'],['Wick','You made jokes when you were frightened.']],
 echo9:[['You','Six beds for copies. The seventh name walked out.'],['Wick','I carried it. I thought a name might help.']],
 echo10:[['Wick','You promised morning.'],['You','You waited nine years to collect.']],
 trace11:[['You','The fourth line was an order, not a record.'],['Wick','The flood was planned.']],
 trace12:[['Wick','You kicked pump three.'],['You','Did I insult it first?'],['Wick','Thoroughly.']],
 trace13:[['You','Somebody kept giving away their dry socks.'],['Wick','You. Every shift.']],
 trace14:[['You','Procedure became prayer.'],['Wick','People trust a ritual when they stop trusting the machine.']],
 trace15:[['Wick','It kept ringing after the cistern filled.'],['You','To tell anyone left where the water was.']],
 trace16:[['You','Someone took the photograph.'],['Wick','You put it in your coat before the evacuation.']],
 trace17:[['Wick','You wrote the replacement request three times.'],['You','And used the broken hook anyway.']],
 trace18:[['You','Third hammer lies. I remember the rhythm.'],['Wick','Your hands never forgot it.']],
 trace19:[['You','The molds were sized like people.'],['Wick','The first vessels were called tools on every order sheet.']],
 trace20:[['Wick','You came down.'],['You','I didn’t come back up.']],
 trace21:[['You','They ate lunch during the end of the sky.'],['Wick','It was still lunch.']],
 trace22:[['Wick','Lens nine looked at the First Star from inside the city.'],['You','That should have been impossible.']],
 trace23:[['You','Two versions left the same mark.'],['Wick','The Archive was practicing.']],
 trace24:[['You','Home wasn’t above us. It was a coordinate.'],['Wick','A direction the Listener learned to follow.']],
 trace25:[['Wick','The Keeper moved the star to hide it.'],['You','And dragged the whole Archive around it.']],
 trace26:[['You','Tomorrow’s date. The Archive expected returns.'],['Wick','It did not understand that people could be gone.']],
 trace27:[['Wick','Revision three was your request.'],['You','I asked them to take my memory on purpose.']],
 trace28:[['You','Names out. Dates left in.'],['Wick','Enough history to rebuild a city. Not enough to summon its people.']],
 trace29:[['You','Rain in aisle six.'],['Wick','A reservoir memory filed in the wrong room.']],
 trace30:[['Wick','You burned the sheet before I could read it.'],['You','Then why do I remember the flame?']],
 trace31:[['You','They kept setting my place.'],['Wick','The Court could preserve a habit better than a person.']],
 trace32:[['Wick','One seal gave authority. The other denied responsibility.'],['You','And my hand made it happen.']],
 trace33:[['You','Three signatures on one bad answer.'],['Wick','You get to decide what that means now.']],
 trace34:[['Wick','You stood at the servants’ door during every vote.'],['You','Close enough to carry orders. Too far away to speak.']],
 trace35:[['You','The audience bell was never connected.'],['Wick','The Regents rang it themselves when they wanted ceremony.']],
 trace36:[['Wick','Four in. Six out.'],['You','You learned my breathing before you learned words.']],
 trace37:[['You','They carried the hymn in strips so nobody held the whole song.'],['Wick','You carried the missing note.']],
 trace38:[['Wick','That silence is shaped exactly like the Listener.'],['You','Then silence can be a lock.']],
 trace39:[['You','Feathers from the Seraph before the Void reached her.'],['Wick','She guarded the singers. She still thinks she is.']],
 trace40:[['Wick','The note marked DO NOT SING is in your hand.'],['You','Good handwriting. Terrible hiding place.']],
 trace41:[['You','These arrows point down the hall.'],['Wick','The Citadel was built to stop its own workers leaving.']],
 trace42:[['Wick','The chain held a door open.'],['You','A small rebellion with a doorstop.']],
 trace43:[['You','The range card calls people targets.'],['Wick','The command engine stopped seeing a difference.']],
 trace44:[['Wick','The cloth kept one tooth from striking the same place.'],['You','Somebody quieted a king with a rag.']],
 trace45:[['You','A steering wheel dressed as a crown.'],['Wick','People obeyed furniture more readily than a machine.']],
 trace46:[['Wick','The Heart is rebuilding the first gate from memory.'],['You','Badly. That hinge opens the other way.']],
 trace47:[['You','The seventh went with you.'],['Wick','You were cold. I thought the garden might keep you alive.']],
 trace48:[['Wick','Every vessel inherited the old name.'],['You','This one was left room to choose.']],
 trace49:[['You','The Listener heard the question and the answer.'],['Wick','That is why the old key cannot work.']],
 trace50:[['Wick','You read to me until I started correcting you.'],['You','That sounds like you.'],['Wick','It sounds like us.']]
};

function rememberedUI(){
 if(T('memoryStage'))return;
 const style=document.createElement('style');style.textContent=`
#memoryStage{position:fixed;inset:0;z-index:132;display:none;pointer-events:none;color:#eee7d8;overflow:hidden}
#memoryStage.open{display:block}.memory-corners{position:absolute;inset:18px;border:1px solid #d9caa522;clip-path:polygon(0 0,28% 0,28% 1px,72% 1px,72% 0,100% 0,100% 100%,72% 100%,72% calc(100% - 1px),28% calc(100% - 1px),28% 100%,0 100%);opacity:0;transition:opacity 1.2s}
#memoryStage.ready .memory-corners{opacity:1}.memory-head{position:absolute;top:max(24px,env(safe-area-inset-top));left:50%;width:min(760px,90vw);transform:translateX(-50%);text-align:center;text-shadow:0 2px 8px #000;opacity:0;transition:opacity .8s,transform .8s}
#memoryStage.ready .memory-head{opacity:1;transform:translate(-50%,4px)}.memory-head small{display:block;font:9px system-ui;letter-spacing:.38em;color:#d9c58b}.memory-head span{display:block;margin-top:8px;font:11px system-ui;letter-spacing:.14em;color:#aeb9c7}
.memory-caption{position:absolute;left:50%;bottom:max(24px,env(safe-area-inset-bottom));width:min(760px,92vw);transform:translate(-50%,20px);opacity:0;padding:22px 26px 20px;background:linear-gradient(145deg,#111827f2,#080c14f5);border:1px solid var(--memory-color,#bca0df);box-shadow:0 16px 70px #000,0 0 40px color-mix(in srgb,var(--memory-color) 18%,transparent);pointer-events:auto;transition:opacity .65s,transform .65s;clip-path:polygon(0 13px,13px 0,calc(100% - 32px) 0,calc(100% - 20px) 10px,100% 10px,100% calc(100% - 13px),calc(100% - 13px) 100%,13px 100%,0 calc(100% - 13px))}
#memoryStage.ready .memory-caption{opacity:1;transform:translate(-50%,0)}.memory-caption:before{content:'';position:absolute;inset:6px;border:1px solid #ffffff12;clip-path:inherit;pointer-events:none}.memory-object{margin:0 0 5px;font:clamp(20px,3vw,30px) Georgia;color:#f4dfae}.memory-speaker{font:9px system-ui;letter-spacing:.25em;color:var(--memory-color,#d2b7ed);text-transform:uppercase}.memory-line{min-height:48px;margin:7px 0 15px;font:clamp(14px,2vw,18px)/1.55 Georgia;color:#ece6d9}.memory-bottom{display:flex;align-items:center;gap:14px}.memory-progress{display:flex;gap:7px;flex:1}.memory-progress i{width:22px;height:2px;background:#65708055}.memory-progress i.on{background:var(--memory-color,#d2b7ed);box-shadow:0 0 9px var(--memory-color,#d2b7ed)}#memoryAdvance{min-width:150px;min-height:42px}
#memoryStage.leaving .memory-caption,#memoryStage.leaving .memory-head{opacity:0;transform:translate(-50%,16px)}#memoryStage.leaving .memory-corners{opacity:0}
body.remembering #hud,body.remembering #touchControls{opacity:0!important;pointer-events:none!important}
@media(max-width:620px){.memory-caption{padding:18px 18px 16px;bottom:max(12px,env(safe-area-inset-bottom))}.memory-head{top:max(13px,env(safe-area-inset-top))}.memory-line{font-size:14px}.memory-bottom{align-items:flex-end}#memoryAdvance{min-width:124px;padding:10px}.memory-progress i{width:13px}}
@media(max-height:560px){.memory-head span{display:none}.memory-caption{padding:13px 18px;bottom:8px}.memory-object{font-size:18px}.memory-line{min-height:32px;margin:4px 0 8px;font-size:13px}}
@media(max-height:560px) and (min-width:700px){.memory-head{left:27%;top:8px;width:50%}.memory-head span{display:block;margin-top:3px;font-size:8px}#memoryStage.ready .memory-head{transform:translate(-50%,0)}.memory-caption{left:auto;right:12px;top:50%;bottom:auto;width:min(42vw,390px);padding:16px 18px;transform:translateY(-47%)}#memoryStage.ready .memory-caption{transform:translateY(-50%)}#memoryStage.leaving .memory-caption{transform:translateY(-45%)}.memory-line{min-height:54px;max-height:102px;overflow:auto}.memory-bottom{gap:8px;flex-wrap:wrap}#memoryAdvance{margin-left:auto}}
`;if(document.head)document.head.appendChild(style);else document.body.appendChild(style);
 const el=document.createElement('div');el.id='memoryStage';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.innerHTML=`<div class="memory-corners"></div><div class="memory-head"><small>THE ARCHIVE REMEMBERS</small><span id="memoryPlace"></span></div><div class="memory-caption"><div class="memory-speaker" id="memorySpeaker"></div><h2 class="memory-object" id="memoryObject"></h2><p class="memory-line" id="memoryLine"></p><div class="memory-bottom"><div class="memory-progress" id="memoryProgress"></div><button class="primary" id="memoryAdvance">CONTINUE</button></div></div>`;document.body.appendChild(el);
}
rememberedUI();

let activeMemoryEcho=null;
function containingMemoryRoom(x,y){
 const rooms=G.world?.rooms||[];return rooms.find(r=>x>=r.x*TILE&&x<(r.x+r.w)*TILE&&y>=r.y*TILE&&y<(r.y+r.h)*TILE)||rooms.find(r=>G.player&&G.player.x>=r.x*TILE&&G.player.x<(r.x+r.w)*TILE&&G.player.y>=r.y*TILE&&G.player.y<(r.y+r.h)*TILE)||rooms[0]||null;
}
function prepareEchoSanctuaries(){
 if(!G.world||!G.player)return;const w=G.world,list=w.region==='late'?w.lateFixtures:w.fixtures;if(!Array.isArray(list))return;
 const rooms=[];for(const o of list){if(o.kind!=='echo'&&o.kind!=='trace')continue;const room=containingMemoryRoom(o.x,o.y);if(!room)continue;o.memoryRoom=w.rooms.indexOf(room);if(!rooms.includes(room))rooms.push(room);}
 w.echoSanctuaries=rooms.map(r=>w.rooms.indexOf(r));
 const inside=(o,r)=>o.x>=r.x*TILE&&o.x<(r.x+r.w)*TILE&&o.y>=r.y*TILE&&o.y<(r.y+r.h)*TILE;
 G.enemies=G.enemies.filter(e=>e.isBoss||!rooms.some(r=>inside(e,r)));
 if(w.region==='late')w.lateHazards=(w.lateHazards||[]).filter(h=>!rooms.some(r=>inside(h,r)));
 else w.hazards=(w.hazards||[]).filter(h=>!rooms.some(r=>inside(h,r)));
}

function echoFixture(id){
 const list=G.world?.region==='late'?G.world?.lateFixtures:G.world?.fixtures;
 return list?.find(o=>(o.kind==='echo'||o.kind==='trace')&&o.id===id)||null;
}
function memoryBeats(id){
 const r=TRACE_RECORDS[id],reaction=ECHO_REACTIONS[id]||[['Wick',r.note||'The Archive kept this for a reason.']];
 return[
  {speaker:'Recovered object',text:r.description},
  {speaker:'Then',text:r.fragment},
  ...reaction.map(q=>({speaker:q[0],text:q[1]}))
 ];
}
function updateMemoryCaption(){
 const m=activeMemoryEcho;if(!m)return;const beat=m.beats[m.beat]||m.beats.at(-1);
 const tableau=typeof ECHO_TABLEAUS==='object'?ECHO_TABLEAUS[m.id]:null;T('memorySpeaker').textContent=beat.speaker;T('memoryObject').textContent=m.record.title;T('memoryPlace').textContent=(m.record.place+(tableau?'  ·  '+tableau.mood:'')).toUpperCase();T('memoryLine').textContent=beat.text;
 const progress=T('memoryProgress');progress.replaceChildren();for(let i=0;i<m.beats.length;i++){const dot=document.createElement('i');if(i<=m.beat)dot.className='on';progress.appendChild(dot);}
 T('memoryAdvance').textContent=m.beat===m.beats.length-1?'LET IT RETURN':'CONTINUE';T('memoryAdvance').focus({preventScroll:true});
}
function startRememberedTrace(id,replay=false){
 const record=TRACE_RECORDS[id];if(!record||activeMemoryEcho)return false;const fixture=echoFixture(id),wasSeen=!!storyData().seen[id],world=!!G.world,room=fixture?containingMemoryRoom(fixture.x,fixture.y):world?containingMemoryRoom(G.player?.x||0,G.player?.y||0):null;
 activeTrace=id;traceReturn=G.state==='paused'||G.state==='menu'?'paused':'playing';activeMemoryEcho={id,record,fixture,room,replay,wasSeen,beat:0,beats:memoryBeats(id),phase:'forming',t:0,leaveT:0,returnState:traceReturn,startCam:G.cam?{x:G.cam.x,y:G.cam.y}:null,pending:!replay&&!wasSeen?STORY_ANCHORS[id]||null:null};
 if(fixture&&room){const maxX=Math.max(0,G.world.W*TILE-G.w),maxY=Math.max(0,G.world.H*TILE-G.h);activeMemoryEcho.targetCam={x:clamp(room.cx*TILE+18-G.w/2,0,maxX),y:clamp(room.cy*TILE+18-G.h/2,0,maxY)};}
 if(!replay){storyData().seen[id]=true;saveNow();}T('traceRecord').classList.remove('open');chapterBannerT=fieldNoteT=0;T('chapterBanner').classList.remove('visible');T('fieldNote').classList.remove('visible');setState('echo');clearInput();document.body.classList.add('remembering');const stage=T('memoryStage');stage.style.setProperty('--memory-color',record.color||'#c8a7e8');stage.classList.remove('leaving','ready');stage.classList.add('open');updateMemoryCaption();
 requestAnimationFrame(()=>stage.classList.add('ready'));memorySound(0);return true;
}
function advanceMemory(){
 const m=activeMemoryEcho;if(!m||m.phase==='leaving')return;if(m.t<.65){m.t=.65;return;}
 if(m.beat<m.beats.length-1){m.beat++;updateMemoryCaption();memorySound(m.beat);return;}m.phase='leaving';m.leaveT=0;T('memoryStage').classList.add('leaving');memorySound(9);
}
function finishRememberedTrace(){
 const m=activeMemoryEcho;if(!m)return;T('memoryStage').classList.remove('open','ready','leaving');document.body.classList.remove('remembering');activeMemoryEcho=null;activeTrace=null;
 if(m.startCam&&G.cam)Object.assign(G.cam,m.startCam);applyAudioSettings();
 if(m.pending&&!storyData().seen[m.pending]&&G.run&&!G.dead){setState('playing');beginDialogue(m.pending,false,0,'playing');}
 else{setState(m.returnState);if(m.returnState==='playing'&&G.player){G.player.hitCd=Math.max(G.player.hitCd,.75);G.cv.focus({preventScroll:true});}else if(m.returnState==='paused')show('pause');}
 saveNow();if(m.replay)renderMemories();
}
function closeRememberedTrace(){const m=activeMemoryEcho;if(!m)return false;if(m.phase!=='leaving'){m.phase='leaving';m.leaveT=0;T('memoryStage').classList.add('leaving');}return true;}
const staticOpenTrace=openTrace,staticCloseTrace=closeTrace;
openTrace=function(id,replay=false){return startRememberedTrace(id,replay);};
closeTrace=function(){if(!closeRememberedTrace())staticCloseTrace();};

function memorySound(step){
 if(!AC||!save.sfx)return;air(.5,.035,step?900:180,step?2100:750,.65);if(step<9){bell([220,261.63,329.63,392][step%4],1.1,.022,.06,true);scoreTone([110,146.83,196,220][step%4],1.8,.018,.02,'sine');}
 if(musDry)musDry.gain.setTargetAtTime(save.music?.035:0,AC.currentTime,.35);if(musSend)musSend.gain.setTargetAtTime(save.music?.08:0,AC.currentTime,.35);
}

function echoObjectKind(title=''){
 const s=title.toLowerCase();if(/wick/.test(s))return'wick';if(/chalk|footprint/.test(s))return'chalk';if(/oil tin|pail/.test(s))return'container';if(/iron door|warning sign|door wedge/.test(s))return'door';if(/hymn|note|breath mark/.test(s))return'music';if(/arrow|chain/.test(s))return'weapon';if(/root|stakes/.test(s))return'root';
 if(/letter|roster|label|card|map|ledger|sheet|slip|prayer|notice|order|parcel|drawing|stamp/.test(s))return'paper';
 if(/bell|clapper/.test(s))return'bell';if(/lens|eyepiece|planet|glass/.test(s))return'glass';if(/key|wrench|hook|spade|knife|hinge/.test(s))return'tool';
 if(/crown/.test(s))return'crown';if(/feather|ribbon|cloth|socks|blanket|mask/.test(s))return'cloth';if(/gear|engine|token|seal|gauge|tooth/.test(s))return'gear';return'relic';
}
function idHash(id=''){let h=17;for(const ch of id)h=(h*31+ch.charCodeAt(0))>>>0;return h;}
function drawEchoArtifact(ctx,o,seen=false,near=false,time=0){
 const r=TRACE_RECORDS[o.id],color=r?.color||'#bca0dd',kind=echoObjectKind(r?.title),h=idHash(o.id),bob=Math.sin(time*1.7+h%13)*2,alpha=seen?.58:1;
 ctx.save();ctx.translate(Math.round(o.x),Math.round(o.y));ctx.globalAlpha=alpha;glowImg('violet',0,-15,seen?26:48,seen?.12:.28);
 ctx.fillStyle='#171b25';ctx.fillRect(-18,7,36,7);ctx.fillStyle='#4b5360';ctx.fillRect(-14,2,28,6);ctx.fillStyle='#85919a';ctx.fillRect(-10,0,20,3);
 ctx.translate(0,-17+bob);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2;
 if(kind==='wick'){ctx.fillStyle='#9eb1b455';ctx.fillRect(-10,-12,20,23);ctx.strokeStyle='#cbd9d6';ctx.strokeRect(-10,-12,20,23);ctx.fillStyle='#a88560';ctx.fillRect(-7,7,14,5);ctx.fillStyle='#d7c9b1';ctx.fillRect(-2,-7,4,13);ctx.fillStyle='#8eb2c2';ctx.fillRect(1,-8,2,12);}
 else if(kind==='chalk'){ctx.fillStyle='#303b48';ctx.fillRect(-15,-12,30,24);ctx.strokeStyle='#778794';ctx.strokeRect(-15,-12,30,24);ctx.fillStyle='#e4e1ce';ctx.save();ctx.rotate(-.3);ctx.fillRect(-11,-1,20,4);ctx.fillStyle='#9fc6cc';ctx.fillRect(-8,6,15,3);ctx.restore();for(const side of [-1,1]){ctx.fillStyle='#d8d5bd';ctx.fillRect(side*8-2,-8,4,6);ctx.fillRect(side*8-4,-3,3,2);}}
 else if(kind==='container'){ctx.strokeStyle='#c8b58b';ctx.beginPath();ctx.arc(0,-9,9,Math.PI,TAU);ctx.stroke();ctx.fillStyle='#59646b';ctx.fillRect(-11,-8,22,19);ctx.fillStyle='#98a4a5';ctx.fillRect(-9,-10,18,4);ctx.fillStyle='#d3c6a4';ctx.fillRect(-8,-5,5,2);ctx.fillStyle=color;ctx.fillRect(-10,7,20,3);}
 else if(kind==='door'){ctx.fillStyle='#343d47';ctx.fillRect(-12,-16,24,31);ctx.strokeStyle='#9a8b72';ctx.strokeRect(-12,-16,24,31);ctx.fillStyle='#697887';for(let yy=-11;yy<12;yy+=7)ctx.fillRect(-8,yy,16,2);ctx.fillStyle='#e1c58a';ctx.fillRect(6,-1,3,3);ctx.fillRect(-7,-5,5,2);ctx.fillRect(-7,2,5,2);}
 else if(kind==='music'){ctx.fillStyle='#d9cfb9';ctx.fillRect(-15,-9,30,18);ctx.fillStyle='#504959';ctx.fillRect(-12,-4,24,1);ctx.fillRect(-12,2,24,1);for(let i=0;i<4;i++){const xx=-9+i*7,yy=i%2?-3:1;ctx.fillRect(xx,yy,2,7);ctx.fillRect(xx-2,yy+5,4,3);}ctx.fillStyle=color;ctx.fillRect(9,-7,3,3);}
 else if(kind==='weapon'){if(/chain/i.test(r?.title||'')){ctx.strokeStyle='#a9a5a0';for(let i=-2;i<=2;i++){ctx.beginPath();ctx.ellipse(i*5,i%2?2:-2,5,3,i%2?.5:-.5,0,TAU);ctx.stroke();}}else{for(let i=-1;i<=1;i++){ctx.save();ctx.translate(i*5,0);ctx.rotate(-.65);ctx.fillStyle='#8d6c4f';ctx.fillRect(-1,-15,3,27);ctx.fillStyle='#d0c4a6';ctx.beginPath();ctx.moveTo(-4,-15);ctx.lineTo(5,-15);ctx.lineTo(1,-21);ctx.closePath();ctx.fill();ctx.restore();}}}
 else if(kind==='root'){ctx.strokeStyle='#8e7953';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,14);ctx.quadraticCurveTo(-8,2,-3,-14);ctx.moveTo(-2,5);ctx.quadraticCurveTo(10,1,12,-8);ctx.moveTo(-4,-2);ctx.lineTo(-13,-8);ctx.stroke();ctx.fillStyle='#789461';ctx.fillRect(8,-11,8,4);ctx.fillRect(-16,-11,7,4);}
 else if(kind==='paper'){ctx.save();ctx.rotate((h%7-3)*.025);ctx.fillStyle=seen?'#837e75':'#dfd3b7';ctx.fillRect(-10,-13,20,26);ctx.fillStyle='#514c52';for(let i=0;i<4;i++)ctx.fillRect(-7,-8+i*5,10+(h+i)%7,1);ctx.fillStyle=color;ctx.fillRect(-8,-11,5,2);ctx.restore();}
 else if(kind==='bell'){ctx.fillStyle='#8f7045';ctx.beginPath();ctx.moveTo(-10,8);ctx.lineTo(-7,-7);ctx.quadraticCurveTo(0,-15,7,-7);ctx.lineTo(11,8);ctx.closePath();ctx.fill();ctx.fillStyle='#e1c178';ctx.fillRect(-8,5,17,3);ctx.fillRect(-2,8,4,5);ctx.strokeStyle='#f5dda2';ctx.beginPath();ctx.arc(0,-6,5,Math.PI,TAU);ctx.stroke();}
 else if(kind==='glass'){ctx.rotate(-.16);ctx.fillStyle='#162331';ctx.fillRect(-12,-6,24,12);ctx.strokeRect(-12,-6,24,12);ctx.fillStyle='#bde8ea99';ctx.fillRect(-7,-4,10,8);ctx.fillStyle='#f4ffff';ctx.fillRect(-5,-3,3,5);ctx.fillStyle=color;ctx.fillRect(11,-2,7,4);}
 else if(kind==='tool'){ctx.rotate(-.68);ctx.fillStyle='#775d43';ctx.fillRect(-3,-17,6,29);ctx.fillStyle='#b6aaa0';ctx.fillRect(-11,-15,22,6);ctx.fillStyle='#edf0e2';ctx.fillRect(-8,-14,7,2);if(/key/i.test(r?.title||'')){ctx.strokeStyle='#d8bc75';ctx.beginPath();ctx.arc(0,-13,7,0,TAU);ctx.stroke();ctx.fillStyle='#d8bc75';ctx.fillRect(-2,-7,4,22);ctx.fillRect(2,10,7,3);}}
 else if(kind==='crown'){ctx.fillStyle='#a47a48';ctx.beginPath();ctx.moveTo(-14,10);ctx.lineTo(-12,-9);ctx.lineTo(-5,-2);ctx.lineTo(0,-13);ctx.lineTo(5,-2);ctx.lineTo(13,-10);ctx.lineTo(14,10);ctx.closePath();ctx.fill();ctx.fillStyle='#edce82';ctx.fillRect(-12,6,24,3);for(const x of [-9,0,9])ctx.fillRect(x-2,x===0?-9:-5,4,4);}
 else if(kind==='cloth'){ctx.rotate(.12);ctx.fillStyle='#8c718d';ctx.beginPath();ctx.moveTo(-13,-11);ctx.lineTo(10,-13);ctx.lineTo(13,9);ctx.lineTo(4,13);ctx.lineTo(-12,8);ctx.closePath();ctx.fill();ctx.fillStyle='#cfb7c8';for(let i=-8;i<9;i+=6)ctx.fillRect(i,-8+(i+h)%5,3,15);ctx.fillStyle=color;ctx.fillRect(-9,-10,10,2);}
 else if(kind==='gear'){ctx.fillStyle='#9d7f58';for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*TAU/8);ctx.fillRect(-3,-16,6,7);ctx.restore();}ctx.beginPath();ctx.arc(0,0,11,0,TAU);ctx.fill();ctx.fillStyle='#222631';ctx.beginPath();ctx.arc(0,0,4,0,TAU);ctx.fill();ctx.fillStyle='#e0c17d';ctx.fillRect(-2,-10,4,5);}
 else{ctx.strokeStyle='#b9a681';ctx.beginPath();ctx.moveTo(-2,13);ctx.quadraticCurveTo(-14,2,-5,-13);ctx.moveTo(-1,5);ctx.lineTo(10,-5);ctx.moveTo(-5,-3);ctx.lineTo(-13,-8);ctx.stroke();ctx.fillStyle=color;ctx.fillRect(-4,-3,8,10);ctx.fillStyle='#f0e4be';ctx.fillRect(-2,-1,3,5);}
 if(!seen)for(let i=0;i<4;i++){const a=time*(i%2?-.65:.8)+i*TAU/4+h*.01,rr=22+(i%2)*4;ctx.fillStyle=i%2?'#f4e7bd':color;ctx.globalAlpha=.38;ctx.fillRect(Math.round(Math.cos(a)*rr)-1,Math.round(Math.sin(a)*rr*.55)-1,3,3);}ctx.restore();
 if(near){ctx.save();ctx.font='10px system-ui';ctx.textAlign='center';ctx.fillStyle='#e9dfca';ctx.shadowColor='#000';ctx.shadowBlur=5;ctx.fillText('E · '+(seen?'REMEMBER':'RECOVER '+(r?.title||'ECHO').toUpperCase()),o.x,o.y+41);ctx.restore();}
}

const MEMORY_PALETTES={
 hollow:{floor:'#28323b',line:'#677787',wall:'#3e4d59',trim:'#b49b6a',light:'#f0c879'},
 garden:{floor:'#2f3b32',line:'#60715c',wall:'#485344',trim:'#9aa76d',light:'#f1ca79'},
 reservoir:{floor:'#253943',line:'#577481',wall:'#344f5a',trim:'#9db6b6',light:'#8ed9dd'},
 foundry:{floor:'#392f2c',line:'#76584a',wall:'#52413a',trim:'#c08758',light:'#ffb261'},
 observatory:{floor:'#273745',line:'#5b7180',wall:'#3c5260',trim:'#ba9d62',light:'#bce6e9'},
 archive:{floor:'#38332e',line:'#71675a',wall:'#514a42',trim:'#b19b72',light:'#efd19a'},
 court:{floor:'#352f3c',line:'#695d75',wall:'#4d4554',trim:'#c39a70',light:'#e8b795'},
 choir:{floor:'#2f3545',line:'#65708d',wall:'#464e62',trim:'#b4ad80',light:'#cedcff'},
 citadel:{floor:'#292a31',line:'#53545d',wall:'#3b3a43',trim:'#9e795d',light:'#e2aa79'},
 heart:{floor:'#342e39',line:'#6f6073',wall:'#4d414d',trim:'#c0a06f',light:'#ffe0a0'}
};
function memoryRegion(){
 if(G.floor<=5)return'hollow';if(G.floor<=10)return'garden';return lateRegion(G.floor)?.key||'heart';
}
function memoryRoomRect(m){
 if(m.room&&G.world&&G.cam)return{x:m.room.x*TILE-G.cam.x,y:m.room.y*TILE-G.cam.y,w:m.room.w*TILE,h:m.room.h*TILE};
 const w=Math.min(G.w*.82,760),h=Math.min(G.h*.68,470);return{x:(G.w-w)/2,y:(G.h-h)/2-10,w,h};
}
function drawRestoredProps(ctx,rect,key,t,alpha){
 const {x,y,w,h}=rect,p=MEMORY_PALETTES[key]||MEMORY_PALETTES.hollow;ctx.save();ctx.globalAlpha=alpha;
 const post=(px,py,ww,hh,c=p.trim)=>{ctx.fillStyle='#181b22';ctx.fillRect(px+3,py+4,ww,hh);ctx.fillStyle=c;ctx.fillRect(px,py,ww,hh);ctx.fillStyle='#f6e1a055';ctx.fillRect(px+2,py+2,Math.max(2,ww-4),2);};
 if(key==='hollow'){post(x+34,y+46,12,h-82);post(x+w-46,y+46,12,h-82);ctx.fillStyle='#6d3340';ctx.fillRect(x+w*.32,y+28,w*.36,h-55);ctx.fillStyle='#bd9a6b';for(let yy=y+42;yy<y+h-35;yy+=24)ctx.fillRect(x+w*.32,yy,w*.36,2);}
 else if(key==='garden'){for(let i=0;i<3;i++){const bx=x+38+i*(w-76)/3,by=y+h-70;post(bx,by,Math.max(45,(w-100)/4),24,'#78644c');ctx.fillStyle='#58704d';for(let j=0;j<5;j++){const sway=Math.sin(t*1.3+i+j)*3;ctx.fillRect(bx+8+j*10+sway,by-22-(j%2)*8,4,24+(j%2)*8);ctx.fillStyle='#8da66e';ctx.fillRect(bx+4+j*10+sway,by-20-(j%2)*8,8,5);ctx.fillStyle='#58704d';}}}
 else if(key==='reservoir'){ctx.strokeStyle='#8ba4a7';ctx.lineWidth=8;for(const yy of [y+42,y+h-48]){ctx.beginPath();ctx.moveTo(x+22,yy);ctx.lineTo(x+w-22,yy);ctx.stroke();}ctx.fillStyle='#bfd2cc';for(let i=0;i<5;i++){ctx.fillRect(x+38+i*(w-76)/5,y+34,5,16);ctx.fillRect(x+38+i*(w-76)/5,y+h-54,5,16);}ctx.strokeStyle='#79b3bc';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w*.18,y+h*.58);ctx.lineTo(x+w*.82,y+h*.58);ctx.stroke();}
 else if(key==='foundry'){for(let i=0;i<3;i++){const bx=x+40+i*(w-80)/3;post(bx,y+h-76,46,30,'#76533c');ctx.fillStyle='#ffb35c';ctx.fillRect(bx+9,y+h-68,28,12);ctx.fillStyle='#fff0aa';ctx.fillRect(bx+14,y+h-66,6,7);}ctx.fillStyle='#7b6654';ctx.fillRect(x+30,y+52,w-60,12);for(let i=0;i<12;i++){ctx.fillStyle=i%2?'#322c2a':'#b1855b';ctx.fillRect(x+34+i*(w-68)/12,y+55,8,6);}}
 else if(key==='observatory'){const cx=x+w*.5,cy=y+h*.5;ctx.strokeStyle='#bba368';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(cx,cy,45+i*28,(45+i*28)*.42,t*.05+i*.3,0,TAU);ctx.stroke();const a=t*(.2+i*.04)+i,rr=45+i*28;ctx.fillStyle=i%2?p.light:'#8cb4c2';ctx.fillRect(cx+Math.cos(a)*rr-4,cy+Math.sin(a)*rr*.42-4,8,8);}post(cx-5,y+34,10,h-68);}
 else if(key==='archive'){for(const side of [x+24,x+w-70])for(let yy=y+34;yy<y+h-55;yy+=42){post(side,yy,46,34,'#6f5b45');ctx.fillStyle='#c8b68e';for(let i=0;i<5;i++)ctx.fillRect(side+5+i*8,yy+6,4,22-(i%2)*4);}post(x+w*.36,y+h-76,w*.28,28,'#7a6248');ctx.fillStyle='#ddcfad';ctx.fillRect(x+w*.4,y+h-82,w*.15,8);}
 else if(key==='court'){ctx.fillStyle='#6c4d4e';ctx.fillRect(x+w*.18,y+26,w*.18,h-52);ctx.fillRect(x+w*.64,y+26,w*.18,h-52);ctx.fillStyle='#c19b70';ctx.fillRect(x+w*.2,y+28,5,h-56);ctx.fillRect(x+w*.77,y+28,5,h-56);post(x+w*.25,y+h*.48,w*.5,30,'#856a56');for(let i=0;i<7;i++)post(x+w*.29+i*w*.06,y+h*.42,14,18,'#544651');}
 else if(key==='choir'){for(let i=0;i<5;i++){const bx=x+55+i*(w-110)/5,top=y+30+(i%2)*18;ctx.strokeStyle='#a59e88';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx,y+18);ctx.lineTo(bx,top);ctx.stroke();ctx.fillStyle=i%2?'#8792aa':'#b79d6e';ctx.beginPath();ctx.moveTo(bx-9,top);ctx.lineTo(bx+9,top);ctx.lineTo(bx+13,top+22);ctx.lineTo(bx-13,top+22);ctx.closePath();ctx.fill();ctx.fillStyle=p.light;ctx.fillRect(bx-2,top+20,4,6);}ctx.fillStyle='#717b91';for(let i=0;i<5;i++)ctx.fillRect(x+35+i*(w-70)/5,y+h-70,15,46);}
 else if(key==='citadel'){for(const side of [x+32,x+w-47])for(let yy=y+45;yy<y+h-38;yy+=40)post(side,yy,15,31,'#5b5050');ctx.fillStyle='#a57b59';for(let i=0;i<8;i++){const bx=x+w*.25+i*w*.06;ctx.fillRect(bx,y+35,3,42);ctx.fillRect(bx-3,y+34,9,4);}post(x+w*.38,y+h-70,w*.24,34,'#4b4347');}
 else{for(let i=0;i<8;i++){const a=i*TAU/8+t*.05,cx=x+w/2+Math.cos(a)*w*.27,cy=y+h/2+Math.sin(a)*h*.27;ctx.fillStyle=i%2?'#b29368':'#756a78';ctx.fillRect(cx-10,cy-7,20,14);ctx.fillStyle=p.light;ctx.fillRect(cx-5,cy-4,4,6);}ctx.strokeStyle=p.light;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+w/2,y+h/2,Math.min(w,h)*.18,0,TAU);ctx.stroke();}
 ctx.restore();
}
function drawMemoryPeople(ctx,rect,key,t,alpha,floor){
 const count=key==='court'?7:key==='archive'?5:key==='garden'?6:4,c='#d8d1c0';ctx.save();ctx.globalAlpha=alpha*.58;
 for(let i=0;i<count;i++){const lane=(i+1)/(count+1),walk=save.motion?0:Math.sin(t*.8+i)*10,px=rect.x+rect.w*lane+(i%2?walk:-walk),py=rect.y+rect.h*(.48+(i%3)*.1);ctx.fillStyle=i===floor%count?'#f0c98a':c;ctx.fillRect(px-4,py-16,8,13);ctx.fillRect(px-3,py-23,6,6);ctx.fillRect(px-4,py-3,3,8);ctx.fillRect(px+1,py-3,3,8);ctx.fillStyle='#ffffff44';ctx.fillRect(px-2,py-21,2,2);}
 ctx.restore();
}
function drawMemoryRestoration(ctx){
 const m=activeMemoryEcho;if(!m)return;const form=clamp(m.t/1.8,0,1),leave=m.phase==='leaving'?clamp(1-m.leaveT/1.15,0,1):1,p=form*leave,ease=p*p*(3-2*p),rect=memoryRoomRect(m),key=memoryRegion(),pal=MEMORY_PALETTES[key]||MEMORY_PALETTES.hollow,t=save.motion?2:G.tAll;
 const sideCaption=G.h<560&&G.w>=700;let captionTop=G.h*(G.h<650?.62:.72);try{const r=document.querySelector('.memory-caption')?.getBoundingClientRect?.();if(!sideCaption&&r?.top>120)captionTop=Math.min(captionTop,r.top-14);}catch(_){}
 const safeTop=sideCaption?48:G.h<650?52:76,safeBottom=sideCaption?G.h-18:Math.max(safeTop+180,captionTop-12),safeH=safeBottom-safeTop,safeW=G.w*(sideCaption?.50:.88),targetCx=G.w*(sideCaption?.265:.5),cx=rect.x+rect.w*.5,cy=rect.y+rect.h*.5,targetZoom=clamp(Math.min(safeW/Math.max(1,rect.w),safeH/Math.max(1,rect.h)),.86,2.08),zoom=lerp(1,targetZoom,ease),displayCx=lerp(cx,targetCx,ease),displayCy=lerp(cy,(safeTop+safeBottom)*.5,ease);
 ctx.save();ctx.setTransform(G.dpr,0,0,G.dpr,0,0);ctx.fillStyle='rgba(2,4,9,'+(ease*.94)+')';ctx.fillRect(0,0,G.w,G.h);
 ctx.save();ctx.translate(displayCx,displayCy);ctx.scale(zoom,zoom);ctx.translate(-cx,-cy);ctx.globalAlpha=ease;ctx.shadowColor=pal.light;ctx.shadowBlur=22;ctx.fillStyle=pal.wall;ctx.fillRect(rect.x,rect.y,rect.w,rect.h);ctx.shadowBlur=0;ctx.fillStyle=pal.floor;ctx.fillRect(rect.x+18,rect.y+22,rect.w-36,rect.h-40);
 ctx.globalAlpha=ease*.42;ctx.strokeStyle=pal.line;ctx.lineWidth=1;for(let xx=rect.x+22;xx<rect.x+rect.w-20;xx+=TILE)for(let yy=rect.y+25;yy<rect.y+rect.h-20;yy+=TILE){ctx.strokeRect(Math.round(xx),Math.round(yy),TILE-2,TILE-2);if(((xx+yy)/TILE)%3<1){ctx.fillStyle='#ffffff0b';ctx.fillRect(xx+5,yy+5,5,2);}}ctx.globalAlpha=ease;
 ctx.fillStyle=pal.trim;ctx.fillRect(rect.x,rect.y,rect.w,6);ctx.fillRect(rect.x,rect.y+rect.h-7,rect.w,7);ctx.fillRect(rect.x,rect.y,6,rect.h);ctx.fillRect(rect.x+rect.w-7,rect.y,7,rect.h);ctx.fillStyle='#fff2c055';ctx.fillRect(rect.x+7,rect.y+7,rect.w-14,2);
 ctx.beginPath();ctx.rect(rect.x+7,rect.y+7,rect.w-14,rect.h-14);ctx.clip();drawRestoredProps(ctx,rect,key,t,ease*.48);drawMemoryPeople(ctx,rect,key,t,ease,G.floor);
 const scene=ECHO_TABLEAUS[m.id]||ECHO_TABLEAUS.echo1,anchor=memoryOpenAnchor(scene,'artifact'),worldFx=m.fixture&&G.cam?m.fixture.x-G.cam.x:rect.x+rect.w*.5,worldFy=m.fixture&&G.cam?m.fixture.y-G.cam.y:rect.y+rect.h*.62,fx=lerp(worldFx,rect.x+rect.w*anchor.x,ease),fy=lerp(worldFy,rect.y+rect.h*anchor.y,ease);drawTableauArtifact(ctx,m.id,fx,fy,key,t,ease,m.wasSeen);
 ctx.restore();
 if(m.fixture&&G.player&&G.cam){const rawX=G.player.x-G.cam.x,rawY=G.player.y-G.cam.y,observer=memoryOpenAnchor(scene,'observer'),worldPx=displayCx+(rawX-cx)*zoom,worldPy=displayCy+(rawY-cy)*zoom,targetPx=displayCx+(rect.x+rect.w*observer.x-cx)*zoom,targetPy=displayCy+(rect.y+rect.h*observer.y-cy)*zoom,px=lerp(worldPx,targetPx,ease),py=lerp(worldPy,targetPy,ease);ctx.save();ctx.translate(px-G.player.x,py-G.player.y);drawPlayer(ctx);ctx.restore();glowImg('gold',px,py,44,.15*ease);}
 const view={x:displayCx+(rect.x-cx)*zoom,y:displayCy+(rect.y-cy)*zoom,w:rect.w*zoom,h:rect.h*zoom};ctx.strokeStyle=pal.light;ctx.globalAlpha=.2+.5*ease;ctx.lineWidth=2;ctx.strokeRect(view.x-1,view.y-1,view.w+2,view.h+2);
 for(let i=0;i<22;i++){const a=i*2.399+t*.08,rr=(35+(i%7)*18)*zoom,px=displayCx+Math.cos(a)*rr,py=displayCy+Math.sin(a)*rr*.55;ctx.fillStyle=i%2?pal.light:m.record.color;ctx.globalAlpha=.12+.3*ease;ctx.fillRect(px,py,i%4===0?3:2,2);}
 ctx.restore();
}
function tickRememberedRoom(dt){
 const m=activeMemoryEcho;if(!m)return;m.t+=dt;if(m.targetCam&&G.cam&&m.startCam){const q=clamp(m.t/1.35,0,1),e=q*q*(3-2*q);G.cam.x=lerp(m.startCam.x,m.targetCam.x,e);G.cam.y=lerp(m.startCam.y,m.targetCam.y,e);}
 if(m.phase==='leaving'){m.leaveT+=dt;if(m.leaveT>=1.2)finishRememberedTrace();}
}

function drawStoryConsequences(ctx){
 if(!G.world||G.state==='echo'||G.floor<36)return;const p=storyProfile(),s=G.world.rooms?.[0];if(!s)return;const x=s.cx*TILE+18,y=s.cy*TILE+18,t=save.motion?0:G.tAll;ctx.save();ctx.translate(x,y);
 if(p.choices.reservoir===0){ctx.strokeStyle='#bca470';ctx.beginPath();ctx.moveTo(-70,-54);ctx.lineTo(-70,-30);ctx.stroke();ctx.fillStyle='#bca470';ctx.fillRect(-80,-31,20,14);ctx.fillStyle='#f1dda2';ctx.fillRect(-72,-17,4,6);}
 if(p.choices.foundry===0){ctx.fillStyle='#a4714e';ctx.fillRect(48,-57,38,8);for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#f0c17a':'#5b4b43';ctx.fillRect(52+i*7,-55,4,4);}}
 if(p.choices.archive===0&&G.floor>=46){ctx.fillStyle='#d6c8a6';for(let i=0;i<4;i++){ctx.fillRect(-28+i*17,48+(i%2)*4,13,8);ctx.fillStyle='#544c4d';ctx.fillRect(-25+i*17,51+(i%2)*4,7,1);ctx.fillStyle='#d6c8a6';}}
 if(p.choices.choir===2&&G.floor>=41){ctx.strokeStyle='#bdc9ee';ctx.globalAlpha=.45+.2*Math.sin(t*2);for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(0,0,30+i*9,-.8+i*.18,.4+i*.18);ctx.stroke();}}
 if(p.choices.citadel===1&&G.floor>=46){ctx.fillStyle='#a57957';for(const side of [-1,1]){ctx.save();ctx.translate(side*92,22);ctx.rotate(side*1.4);ctx.fillRect(-2,-24,4,48);ctx.fillRect(-5,-25,10,4);ctx.restore();}}
 ctx.restore();
}

const rememberedRender=render;
render=function(){rememberedRender();if(G.world&&G.state!=='menu'&&!activeMemoryEcho){const ctx=G.ctx;ctx.save();ctx.setTransform(G.dpr,0,0,G.dpr,0,0);ctx.translate(-G.cam.x,-G.cam.y);drawStoryConsequences(ctx);ctx.restore();}if(activeMemoryEcho)drawMemoryRestoration(G.ctx);};
const rememberedTick=hollowTick;
hollowTick=function(dt){if(activeMemoryEcho)tickRememberedRoom(dt);rememberedTick(dt);};
const rememberedSetup=setupFloor;
setupFloor=function(f){rememberedSetup(f);if(G.run)prepareEchoSanctuaries();};
const rememberedResume=resumeRun;
resumeRun=function(){rememberedResume();if(G.run)prepareEchoSanctuaries();};
const rememberedBlocking=anyBlockingOverlay;
anyBlockingOverlay=function(){return !!activeMemoryEcho||rememberedBlocking();};
const rememberedReset=resetEverything;
resetEverything=function(){if(activeMemoryEcho){T('memoryStage').classList.remove('open','ready','leaving');document.body.classList.remove('remembering');activeMemoryEcho=null;}rememberedReset();};

const FINAL_ANSWERS={
 people:{label:'For the people waiting behind it.',title:'The people behind the door',text:'You say it for the people whose names were cut out, for the crews under the water, and for everyone who kept setting a place at the table. The Listener searches the Archive. It has no earlier copy.'},
 wick:{label:'Because Wick asked me to stand.',title:'A promise made now',text:'Wick’s flame steadies beside you. The Listener knows every order the Lamplighter gave him. It has never heard you choose to answer one of his.'},
 choice:{label:'Because I chose to come back.',title:'The seventh answer',text:'Six vessels followed a memory down these stairs. You came because you chose to. The answer exists nowhere in the Archive until you speak it, and the Listener cannot arrive before it.'}
};
function endingAnswer(){return FINAL_ANSWERS[storyData().finalAnswer]||null;}
function endingHistoryText(){
 const p=storyProfile(),c=p.choices,bits=[];
 bits.push(c.archive===0?'The Scribe brings the hidden ledger. Names travel through the opening before records.':c.archive===1?'Wick speaks every name he kept while the blank ledgers are carried into daylight.':'Wick’s edited ledger leaves the routes behind and carries the names forward.');
 bits.push(c.citadel===1?'Above, Mara turns the Citadel outward. For the first time, its wall guards the people inside it.':c.citadel===0?'The Citadel is quiet. Its last weapons lie in neat, harmless rows.':'The Heartward engines hold their aim until the last person crosses.');
 if(c.choir===2)bits.push('The Choir tries your changed ending. The final note lands somewhere the Listener has never been.');
 else if(c.choir===0)bits.push('The Choir leaves an honest silence where the final note used to be.');
 else if(c.choir===1)bits.push('The missing note crosses the gate inside a sealed glass case.');
 return bits.join(' ');
}
function configureEndingScenes(){
 const answer=endingAnswer(),p=storyProfile(),identity=['You take back the Lamplighter’s name without mistaking it for a command.','The Lamplighter died nine years ago. You keep the work and let the dead keep their name.','The blank plate stays blank. Wick calls you by the name you chose above the gate.'][Math.max(0,p.choices.heart)]||'The blank plate waits for the name you will choose.';
 ENDING_SCENES.splice(0,ENDING_SCENES.length,
  {title:'The lock opens',speaker:'The First Keeper',text:'There. I can hear them again. The people were never gone. The First Star held their patterns when the city failed, and I mistook keeping them for saving them.'},
  {title:'Six lights in the garden',speaker:'Wick',text:'The Archive built six vessels from the Lamplighter record. Each followed the old route. Each gave the old answer. I carried the seventh out before it could finish writing you.'},
  {title:'What Wick carried',speaker:'Wick',text:'You split the key before you died. Half went into the First Star. Half became the maintenance flame beside you. I was meant to open doors. You taught me enough words to refuse.'},
  {title:'The voice before the star',speaker:'The Listener',text:'I followed your names, your bells, your maps, and every promise you repeated. I did not break the Archive. I arrived wherever it remembered me.'},
  {title:'The old recognition',speaker:'Wick',text:'Mara’s question was the last lock: “Why did you come?” Your answer was “To put the star back.” The Listener heard it nine years ago. It has been waiting for you to say it again.'},
  {title:'An answer without a record',speaker:'You',text:'The door waits. Give it a reason that belongs to this life.',choice:true},
  {title:answer?.title||'A new answer',speaker:'You',text:answer?.text||'The old words wait in your mouth. You leave them there and answer for the person standing here.'},
  {title:'The name you keep',speaker:'Wick',text:identity},
  {title:'Instructions end',speaker:'The First Keeper',text:'The guardians lower their weapons. Mara is first through the Heart door. The Matriarch follows with six empty nameplates and no orders left to obey.'},
  {title:'What your choices carried',speaker:'',text:endingHistoryText()},
  {title:'Morning',speaker:'Wick',text:'The first person through the gate shields her eyes. Somebody behind her laughs. You and Wick cross together. This time, nobody closes the door.'}
 );
}
function rememberedEndingUI(){
 if(T('endingAnswers'))return;const wrap=document.createElement('div');wrap.id='endingAnswers';wrap.className='ending-answer-grid';wrap.hidden=true;T('endingText').after(wrap);const style=document.createElement('style');style.textContent=`.ending-answer-grid{display:grid;gap:10px;width:min(660px,94%);margin:4px auto 22px}.ending-answer-grid button{min-height:48px;padding:12px 16px;border:1px solid #b9955f;background:#151927;color:#f0e5d0;font:14px/1.35 Georgia;cursor:pointer;transition:.18s transform,.18s background,.18s border-color}.ending-answer-grid button:hover,.ending-answer-grid button:focus{transform:translateY(-2px);background:#242638;border-color:#f0d39b;outline:none}.ending-answer-grid button.chosen{border-color:#ffe0a0;box-shadow:0 0 20px #d19b512e}`;document.head.appendChild(style);}
rememberedEndingUI();
const rememberedBeginEnding=beginEnding;
beginEnding=function(){configureEndingScenes();rememberedBeginEnding();};
const rememberedUpdateEnding=updateEndingText;
updateEndingText=function(){
 configureEndingScenes();rememberedUpdateEnding();const scene=ENDING_SCENES[G.run?.endingStep],wrap=T('endingAnswers');wrap.hidden=!scene?.choice;
 if(scene?.choice){T('endingNext').hidden=true;wrap.replaceChildren();for(const [id,a] of Object.entries(FINAL_ANSWERS)){const b=document.createElement('button');b.textContent=a.label;b.className=storyData().finalAnswer===id?'chosen':'';on(b,'click',()=>chooseFinalAnswer(id));wrap.appendChild(b);}wrap.firstChild?.focus({preventScroll:true});}
};
function chooseFinalAnswer(id){if(!FINAL_ANSWERS[id]||G.state!=='ending')return;storyData().finalAnswer=id;configureEndingScenes();G.run.endingStep++;endingClock=0;sfx('mythic');endingMusic();updateEndingText();saveNow();}
const rememberedAdvanceEnding=advanceEnding;
advanceEnding=function(){if(ENDING_SCENES[G.run?.endingStep]?.choice)return;rememberedAdvanceEnding();};
const rememberedDrawEnding=drawEnding;
drawEnding=function(){if(!G.run){rememberedDrawEnding();return;}const actual=G.run.endingStep,visual=actual<=2?actual:actual<=5?2:actual===6?3:4;G.run.endingStep=visual;rememberedDrawEnding();G.run.endingStep=actual;if(actual>=3&&actual<=5){const cv=T('endingCanvas'),x=cv.getContext('2d'),t=save.motion?2:endingClock,cx=cv.width/2,cy=cv.height*.5;x.save();x.globalCompositeOperation='lighter';for(let i=0;i<48;i++){const a=i*.61+t*(i%2?-.13:.09),r=18+(i%12)*8;x.fillStyle=i%3?'#9182b8':'#f0ce91';x.globalAlpha=.08+(i%8)*.035;x.fillRect(cx+Math.cos(a)*r,cy+Math.sin(a)*r*.55,2+(i%5===0),2);}x.globalAlpha=.7;x.strokeStyle='#d6c6eb';x.beginPath();x.arc(cx,cy,30+Math.sin(t)*3,0,TAU);x.stroke();x.restore();}};
const rememberedValidate=validateSave;
validateSave=function(raw){const clean=rememberedValidate(raw);if(raw.story&&typeof raw.story.finalAnswer==='string'&&FINAL_ANSWERS[raw.story.finalAnswer])clean.story.finalAnswer=raw.story.finalAnswer;return clean;};

function wireRemembered(){
 on(T('memoryAdvance'),'click',advanceMemory);
 addEventListener('keydown',e=>{if(!activeMemoryEcho)return;if(['Escape','Enter','Space'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;e.code==='Escape'?closeRememberedTrace():advanceMemory();}},true);
}
const rememberedWireDepth=wireDepth;
wireDepth=function(){rememberedWireDepth();wireRemembered();};
