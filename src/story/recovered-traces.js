let traceReturn='playing',activeTrace=null;
function nearestTrace(){
  const list=G.world?.region==='late'?G.world.lateFixtures:G.world?.fixtures;if(!list||!G.player)return null;
  let best=null,dist=72**2;for(const o of list){if(o.kind!=='echo'&&o.kind!=='trace')continue;const dd=d2(o.x,o.y,G.player.x,G.player.y);if(dd<dist){dist=dd;best=o;}}return best;
}
function openTrace(id,replay=false){
  const record=TRACE_RECORDS[id];if(!record||T('traceRecord').classList.contains('open'))return false;
  activeTrace=id;traceReturn=G.state==='paused'?'paused':'playing';if(traceReturn==='playing')setState('trace');clearInput();
  T('traceObject').textContent=record.title;T('tracePlace').textContent=record.place;T('traceDescription').textContent=record.description;T('traceFragment').textContent=record.fragment;T('traceNote').textContent=replay?'Recovered record':'Added to memories';
  T('traceRecord').style.setProperty('--trace-glow',record.color);T('traceRecord').classList.add('open');
  if(!replay){storyData().seen[id]=true;saveNow();}T('traceClose').focus({preventScroll:true});return true;
}
function closeTrace(){
  if(!T('traceRecord').classList.contains('open'))return;T('traceRecord').classList.remove('open');activeTrace=null;
  if(traceReturn==='playing'){setState('playing');G.player.hitCd=Math.max(G.player.hitCd,.55);G.cv.focus({preventScroll:true});}
  else setState('paused');
}
const beforeLateMemories=renderMemories;
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
const beforeLatePortrait=drawPortrait;
drawPortrait=function(){
  if(!dialogue||!LATE_BOSS_SPEAKERS.has(dialogue.lines[dialogue.index].speaker)){beforeLatePortrait();return;}
  const kind=LATE_BOSS_SPEAKERS.get(dialogue.lines[dialogue.index].speaker),x=T('speakerPortrait').getContext('2d'),t=save.motion?0:portraitClock;x.clearRect(0,0,120,120);x.save();x.translate(60,61);x.scale(1.2,1.2);
  const col={bellkeeper:'#72ccda',colossus:'#f29558',astronomer:'#8fe7f2',scribe:'#dfcfad',regents:'#e9a0b1',seraph:'#b5c4ff',tyrant:'#ff9a72',keeper:'#ffd47c'}[kind];x.strokeStyle=col;x.fillStyle='#151525';x.lineWidth=2;
  if(kind==='bellkeeper'){
    const sway=save.motion?0:Math.sin(t*2.2)*3;
    x.strokeStyle='#315969';x.lineWidth=2;
    for(let i=0;i<3;i++){x.beginPath();x.ellipse(-5,29+i*5,34-i*5,5+i,0,Math.PI*.12,Math.PI*.88);x.stroke();}
    x.strokeStyle='#0a1720';x.lineWidth=18;x.beginPath();x.moveTo(-39,13+sway);x.bezierCurveTo(-25,-13-sway,-4,20+sway,17,-5);x.stroke();
    x.strokeStyle='#315d6b';x.lineWidth=13;x.stroke();x.strokeStyle=col;x.lineWidth=5;x.stroke();
    x.fillStyle='#315d6b';x.beginPath();x.moveTo(-35,8+sway);x.lineTo(-46,-3+sway);x.lineTo(-41,18+sway);x.closePath();x.fill();x.strokeStyle=col;x.lineWidth=2;x.stroke();
    x.fillStyle='#142b35';x.beginPath();x.moveTo(7,-18);x.quadraticCurveTo(27,-26,39,-10);x.lineTo(44,3);x.lineTo(32,13);x.lineTo(9,8);x.lineTo(1,-4);x.closePath();x.fill();x.strokeStyle=col;x.lineWidth=3;x.stroke();
    x.fillStyle='#3f7480';x.beginPath();x.moveTo(13,-17);x.lineTo(4,-31);x.lineTo(25,-20);x.closePath();x.fill();x.stroke();
    x.fillStyle='#f5df9a';x.beginPath();x.arc(29,-8,4,0,TAU);x.fill();x.fillStyle='#111820';x.beginPath();x.arc(30,-8,1.8,0,TAU);x.fill();
    x.strokeStyle='#83dce1';x.lineWidth=2;for(let i=0;i<3;i++){x.beginPath();x.moveTo(15+i*5,1+i);x.lineTo(20+i*5,5+i);x.stroke();}
    x.strokeStyle='#c9aa69';x.lineWidth=3;x.beginPath();x.arc(17,-17,18,Math.PI,TAU);x.stroke();
    for(const bx of [7,22]){x.strokeStyle='#8b6b38';x.lineWidth=2;x.beginPath();x.moveTo(bx,-19);x.lineTo(bx,-8);x.stroke();x.fillStyle='#bc9451';x.beginPath();x.moveTo(bx-5,-8);x.lineTo(bx+5,-8);x.lineTo(bx+7,1);x.lineTo(bx-7,1);x.closePath();x.fill();x.fillStyle='#f0ce78';x.fillRect(bx-3,-6,3,5);x.fillStyle='#684820';x.fillRect(bx-1,1,3,4);}
  }
  else if(kind==='colossus'){x.fillRect(-27,-23,54,51);x.strokeRect(-27,-23,54,51);x.fillStyle=col;x.fillRect(-18,-14,9,22);x.fillRect(9,-14,9,22);x.beginPath();x.arc(0,-29,10,0,TAU);x.fill();}
  else if(kind==='astronomer'){for(let i=0;i<3;i++){x.rotate(t*.15+i*2.1);x.beginPath();x.ellipse(0,0,35,10,0,0,TAU);x.stroke();}x.fillStyle=col;x.beginPath();x.arc(0,0,8,0,TAU);x.fill();}
  else if(kind==='scribe'){x.rotate(Math.sin(t)*.08);x.beginPath();x.moveTo(-30,-30);x.quadraticCurveTo(35,-16,20,32);x.quadraticCurveTo(-15,18,-30,-30);x.fill();x.strokeStyle=col;x.beginPath();x.moveTo(-22,-20);x.lineTo(17,24);x.stroke();}
  else if(kind==='regents'){for(const side of [-1,1]){x.save();x.translate(side*18,0);x.fillStyle='#151525';x.beginPath();x.moveTo(-12,28);x.lineTo(-15,-12);x.lineTo(0,-28);x.lineTo(15,-12);x.lineTo(12,28);x.closePath();x.fill();x.stroke();x.restore();}}
  else if(kind==='seraph'){x.fillStyle='#151525';for(const side of [-1,1]){x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(side*42,-26,side*36,24);x.quadraticCurveTo(side*17,12,0,0);x.fill();x.stroke();}x.fillStyle=col;x.beginPath();x.arc(0,-4,7,0,TAU);x.fill();}
  else if(kind==='tyrant'){x.fillRect(-25,-12,50,38);x.strokeRect(-25,-12,50,38);x.fillStyle=col;x.fillRect(-19,-22,6,12);x.fillRect(-3,-29,6,19);x.fillRect(13,-22,6,12);}
  else {for(let i=0;i<8;i++){x.rotate(TAU/8);x.fillStyle=i%2?col:'#242031';x.beginPath();x.moveTo(7,0);x.lineTo(36,-5);x.lineTo(29,6);x.closePath();x.fill();}x.fillStyle='#fff2bd';x.beginPath();x.arc(0,0,9+Math.sin(t*2)*2,0,TAU);x.fill();}
  x.restore();
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
