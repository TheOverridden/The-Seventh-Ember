let traceReturn='playing';
function nearestTrace(){
  const list=G.world?.region==='late'?G.world.lateFixtures:G.world?.fixtures;if(!list||!G.player)return null;
  let best=null,dist=72**2;for(const o of list){if(o.kind!=='echo'&&o.kind!=='trace')continue;const dd=d2(o.x,o.y,G.player.x,G.player.y);if(dd<dist){dist=dd;best=o;}}return best;
}

renderMemories=function(){
  const list=T('memoryList');list.replaceChildren();const seen=storyData().seen;
  const conversations=Object.keys(HOLLOW_SCENES).filter(id=>seen[id]&&!HOLLOW_SCENES[id].echo&&!TRACE_RECORDS[id]);
  const traces=Object.keys(TRACE_RECORDS).filter(id=>seen[id]);T('memoryEmpty').hidden=conversations.length+traces.length>0;
  const heading=text=>{const h=document.createElement('div');h.className='memory-section';h.textContent=text;list.appendChild(h);};
  if(conversations.length){heading('Conversations');for(const id of conversations){const s=HOLLOW_SCENES[id],b=document.createElement('button');b.className='memory-entry';b.innerHTML=`<span><strong>${s.title}</strong><small>${s.where}</small></span><span>RECALL →</span>`;on(b,'click',()=>beginDialogue(id,true,0,'paused'));list.appendChild(b);}}
  if(traces.length){heading('Recovered traces');for(const id of traces){const r=TRACE_RECORDS[id],b=document.createElement('button');b.className='memory-entry trace-entry';b.innerHTML=`<span><strong>${r.title}</strong><small>${r.place}</small></span><span class="trace-action">INSPECT →</span>`;on(b,'click',()=>{hide('memories');openTrace(id,true);});list.appendChild(b);}}
};

const LATE_BOSS_SPEAKERS=new Map([
 ['The Bellkeeper','bellkeeper'],['The Ember Colossus','colossus'],['The Glass Astronomer','astronomer'],['The Pale Scribe','scribe'],['The First Regent','regents'],['The Second Regent','regents'],['The Void Seraph','seraph'],['The Obsidian Tyrant','tyrant'],['The First Keeper','keeper']
]);
const beforeLateSpeakerKind=speakerKind;speakerKind=function(name){return LATE_BOSS_SPEAKERS.has(name)?'guardian':beforeLateSpeakerKind(name);};
const beforeLateRenderDialogueLine=renderDialogueLine;renderDialogueLine=function(){
  beforeLateRenderDialogueLine();
  if(dialogue&&speakerKind(dialogue.lines[dialogue.index].speaker)==='guardian'){
    const k=LATE_BOSS_SPEAKERS.get(dialogue.lines[dialogue.index].speaker);
    T('speakerTag').textContent=k==='bellkeeper'?'THE CISTERN':'THE DEEP';
  }
};

const LATE_AFTER=new Set(['bellkeeperAfter','colossusAfter','astronomerAfter','scribeAfter','regentsAfter','seraphAfter','tyrantAfter','keeperAfter']);
const beforeLateFinishDialogue=finishDialogue;
finishDialogue=function(){const d=dialogue?{id:dialogue.id,replay:dialogue.replay}:null;beforeLateFinishDialogue();if(d&&!d.replay&&LATE_AFTER.has(d.id)&&G.run&&!G.dead){G.run.lateClearShown=G.floor;showChapterClear();saveNow();}};
const beforeLateChapterClear=showChapterClear;
showChapterClear=function(){
  const region=lateRegion(G.floor);if(!region){beforeLateChapterClear();return;}
  setState('chapter');T('chapterSeal').textContent=roman(region.stage);T('chapterCompleteLabel').textContent='STAGE '+roman(region.stage)+' COMPLETE';T('chapterCompleteTitle').textContent=region.name;
  const lines={reservoir:'The bells stop. Water begins climbing the lower stairs.',foundry:'The crown furnace drops below red heat. The conveyor keeps moving.',observatory:'The dome goes quiet. Lens nine continues tracking the sealed door.',archive:'One unburned page remains on the Scribe’s desk.',court:'The argument stops. Both throne-room doors unlock.',choir:'The wind drops. A bell far below answers once.',citadel:'The command engine stalls three yards from the inner wall.',heart:'The star settles into its cradle. Wick stays beside you.'};
  const quotes={reservoir:'“It’s already started.”',foundry:'“With a wedge and a bad word.”',observatory:'“Nine years and four months.”',archive:'“Burn it unread.”',court:'“You wrote the order.”',choir:'“I kept a copy.”',citadel:'“It’s the command engine.”',heart:'“We’re about to find out.”'};
  T('chapterCompleteText').textContent=lines[region.key];T('chapterQuote').textContent=quotes[region.key];T('chapterContinue').textContent=G.floor===50?'FINISH DESCENT':'DESCEND';statBoxes(T('chapterStats'),G.floor,G.run.level,G.run.kills,G.run.t);show('chapterClear');sfx('victory');
};
