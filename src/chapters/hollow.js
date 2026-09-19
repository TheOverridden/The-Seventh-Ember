const HOLLOW_FLOORS=[
  {name:'The Gatehouse',hint:'Follow the old lanterns.'},
  {name:'The Lantern Walks',hint:'Some of the lights are moving.'},
  {name:'The Bell Court',hint:'Watch for the pale lines in the stone.'},
  {name:'The Empty Barracks',hint:'The watch has not been relieved.'},
  {name:'The Last Watch',hint:'Someone is waiting at the door.'}
];
const HOLLOW_SCENES={
  arrival:{title:'A voice in the light',where:'The Gatehouse',lines:[['???','Easy. You’ve been lying there a while.'],['You','Who’s speaking?'],['???','The light in your hand.'],['You','Do you know me?'],['Wick','Call me Wick.'],['You','That wasn’t what I asked.'],['Wick','I know. Can you stand?']]},
  walks:{title:'The night watch',where:'The Lantern Walks',lines:[['You','There’s a lantern outside every door.'],['Wick','Someone used to come through and light them. Every night.'],['You','And now?'],['Wick','Stay back from the ones that move.']]},
  barracks:{title:'An empty bed',where:'The Empty Barracks',lines:[['You','This bed has my coat on it.'],['Wick','Leave it. The lining’s full of holes.'],{speaker:'You',choices:[{label:'How would you know?',reply:[['Wick','You complained about it.'],['You','When?'],['Wick','Before you stopped remembering me.']]},{label:'I’m taking it anyway.',reply:[['Wick','All right.'],['You','It fits.'],['Wick','Yes. It does.']]}]}]},
  wardenBefore:{title:'An old instruction',where:'The Last Watch',lines:[['The Star Warden','Stop there.'],['You','Do you know a way out?'],['The Star Warden','You asked me to stop you.'],['You','I’ve never been here.'],['The Star Warden','Wick. You let them forget.'],['Wick','Put the sword down.'],['The Star Warden','I can’t.']]},
  wardenAfter:{title:'Beyond the gate',where:'The Last Watch',lines:[['The Star Warden','You used to wait until I lowered my shield.'],['You','Why would I ask you to kill me?'],['The Star Warden','Stop you. Not kill you.'],['You','You could have said that before.'],['The Star Warden','Would you have stayed?'],['Wick','The door’s open.'],['You','We’re going to talk about this.'],['Wick','Yes.']]},
  firstDeath:{title:'Back at the gate',where:'After the first fall',lines:[['Wick','Take a moment.'],['You','I died.'],['Wick','Yes.'],['You','You don’t seem surprised.'],['Wick','I was hoping it wouldn’t happen this time.']]},
  firstSigil:{title:'A hand on the door',where:'The Skill Tree',lines:[['A memory','Your hand rests on an iron door. Someone on the other side knocks twice.'],['You','I knew what that meant. A second ago, I knew.'],['Wick','Don’t force it. Keep what you can.']]},
  echo1:{title:'The late shift',where:'The Gatehouse · recovered trace',echo:true,lines:[['A voice','You’re late.'],['Another voice','Bell hasn’t gone.'],['A voice','Bell’s broken. You know that.'],['Another voice','Then I’m early.']]},
  echo2:{title:'Oil for the lamps',where:'The Lantern Walks · recovered trace',echo:true,lines:[['A memory','A list scratched into a shelf: oil, clean cloth, bread. Underneath, in another hand: enough bread for two.'],['You','Someone lived here.'],['Wick','A lot of people did.']]},
  echo3:{title:'The bell rope',where:'The Bell Court · recovered trace',echo:true,lines:[['A child','Let me try.'],['An older voice','You’ll wake everyone.'],['A child','That’s what a bell is for.'],['A memory','The rope shifts in your hand. For a moment, the courtyard is full of people.']]},
  echo4:{title:'An unfinished letter',where:'The Empty Barracks · recovered trace',echo:true,lines:[['A memory','“I’ll be home after the watch changes. Don’t wait up.”'],['You','There’s no name.'],['Wick','They probably thought they’d get there before the letter.']]},
  echo5:{title:'Two knocks',where:'The Last Watch · recovered trace',echo:true,lines:[['A voice','If I come back and I don’t know you—'],['Another voice','You’ll know me.'],['A voice','Listen. Two knocks. Then ask me why I came.'],['A memory','The rest is gone.']]}
};
let dialogue=null,storyQueue=[],chapterBannerT=0,fieldNoteT=0,portraitClock=0;
function storyData(){if(!save.story)save.story={seen:{},choices:{}};return save.story;}
function storyLines(id){return HOLLOW_SCENES[id].lines.flatMap((line,i)=>{if(Array.isArray(line))return[{speaker:line[0],text:line[1]}];const selected=storyData().choices[id+':'+i];if(Number.isInteger(selected)&&line.choices[selected]){const c=line.choices[selected];return[{speaker:'You',text:c.label},...c.reply.map(x=>({speaker:x[0],text:x[1]}))];}return[{...line,choiceKey:id+':'+i}];});}
function queueStory(id){if(HOLLOW_SCENES[id]&&!storyData().seen[id]&&!storyQueue.includes(id)&&dialogue?.id!==id)storyQueue.push(id);}
function speakerKind(name){return name==='You'?'you':name==='Wick'||name==='???'?'wick':name==='The Star Warden'?'warden':name==='The Hollow Matriarch'?'matriarch':'echo';}
function beginDialogue(id,replay=false,index=0,returnState){
  if(dialogue||!HOLLOW_SCENES[id])return false;
  const from=returnState||G.state;
  dialogue={id,replay,from,index,chars:0,t:0,voiceT:0,lines:storyLines(id),focus:document.activeElement};
  dialogue.index=clamp(index,0,dialogue.lines.length-1);
  setState('dialogue');clearInput();document.body.classList.add('conversing');T('conversation').hidden=false;
  renderDialogueLine();T('dialogueNext').focus({preventScroll:true});
  if(AC){musDry.gain.setTargetAtTime(save.music?.055:0,AC.currentTime,.15);musSend.gain.setTargetAtTime(save.music?.1:0,AC.currentTime,.15);}
  saveNow();return true;
}
function renderDialogueLine(){
  const d=dialogue,line=d.lines[d.index];d.chars=save.textSpeed===0||save.motion?(line.text||'').length:0;d.t=0;
  T('speakerName').textContent=line.speaker.toUpperCase();T('dialogueChapter').textContent=HOLLOW_SCENES[d.id].where.toUpperCase();
  T('dialogueFrame').dataset.speaker=speakerKind(line.speaker);T('speakerTag').textContent={wick:'EMBER',you:'THE BEARER',warden:'THE WATCH',matriarch:'THE GARDENER',echo:'A TRACE'}[speakerKind(line.speaker)];
  T('dialogueText').textContent=line.text?line.text.slice(0,d.chars):' ';T('dialogueReadback').textContent=line.speaker+': '+(line.text||'Choose a response.');
  T('dialogueChoices').replaceChildren();T('dialogueNext').hidden=!!line.choices;T('dialogueKeys').hidden=!!line.choices;
  if(line.choices){line.choices.forEach((c,i)=>{const b=document.createElement('button');b.textContent=c.label;b.addEventListener('click',()=>{storyData().choices[line.choiceKey]=i;d.lines=storyLines(d.id);advanceDialogue(true);});T('dialogueChoices').appendChild(b);});T('dialogueChoices').firstChild.focus({preventScroll:true});}
  drawPortrait();
}
function advanceDialogue(choice=false){
  const d=dialogue;if(!d)return;const line=d.lines[d.index];if(line.choices&&!choice)return;
  if(!choice&&d.chars<(line.text||'').length){d.chars=line.text.length;T('dialogueText').textContent=line.text;return;}
  d.index++;if(d.index>=d.lines.length){finishDialogue();return;}renderDialogueLine();saveNow();
}
function finishDialogue(){
  if(!dialogue)return;const d=dialogue;dialogue=null;
  if(!d.replay)storyData().seen[d.id]=true;
  T('conversation').hidden=true;document.body.classList.remove('conversing');clearInput();setState(d.from);applyAudioSettings();
  if(G.player)G.player.hitCd=Math.max(G.player.hitCd,.75);
  if(['wardenAfter','matriarchAfter'].includes(d.id)&&!d.replay&&G.run&&!G.dead){G.run[d.id==='wardenAfter'?'hollowClearShown':'gardenClearShown']=true;showChapterClear();}
  else if(d.id==='arrival'&&!d.replay){announceHollowFloor();fieldNote(document.body.classList.contains('touch')?'Left stick moves · Hold the right stick to aim and fire · Ability buttons sit between them':'J for Ember Bolt · K for Flare · R to Rekindle · Space to dash',7);}
  if(d.focus?.isConnected)d.focus.focus({preventScroll:true});else if(G.state==='playing')G.cv.focus({preventScroll:true});
  saveNow();if(d.replay)renderMemories();
}
function drawPortrait(){
  if(!dialogue)return;const x=T('speakerPortrait').getContext('2d'),kind=speakerKind(dialogue.lines[dialogue.index].speaker),t=save.motion?0:portraitClock;
  x.clearRect(0,0,120,120);x.imageSmoothingEnabled=false;
  let spr=SPR[kind==='you'?'pIdle':kind==='warden'?'gateWarden':kind==='matriarch'?'gardenMatriarch':'flame'];
  if(kind==='echo'){x.strokeStyle='#b4a2cf';x.lineWidth=2;x.beginPath();x.moveTo(60,23);x.lineTo(85,60);x.lineTo(60,96);x.lineTo(35,60);x.closePath();x.stroke();x.fillStyle='#d8c5ec';x.fillRect(57,48,6,24);return;}
  if(!spr)return;const frame=spr.frames[Math.floor(t*spr.fps)%spr.frames.length],sc=kind==='warden'||kind==='matriarch'?Math.min(96/spr.W,98/spr.H):kind==='wick'?5:3.7;
  x.drawImage(frame,60-spr.W*sc/2,61-spr.H*sc/2+(kind==='wick'?Math.sin(t*2)*3:0),spr.W*sc,spr.H*sc);
}
function dialogueVoice(kind){
  if(!AC||!save.sfx||save.dialogueVoice===0)return;
  const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type='sine';o.frequency.value=(kind==='warden'?95:kind==='you'?190:kind==='echo'?270:390)+Math.random()*35;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.028,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+.055);o.connect(g);g.connect(sfxDry);o.start(t);o.stop(t+.06);o.onended=()=>{o.disconnect();g.disconnect();};
}
function hollowTick(dt){
  portraitClock+=dt;
  if(dialogue){const d=dialogue,line=d.lines[d.index];d.t+=dt;d.voiceT-=dt;if(line.text&&d.chars<line.text.length){const step=1/(save.textSpeed===2?65:36);if(d.t>=step){d.t-=step;const char=line.text[d.chars++];T('dialogueText').textContent=line.text.slice(0,d.chars);if(/[.!?]/.test(char))d.t=-.16;else if(char===',')d.t=-.07;if(d.voiceT<=0&&/\S/.test(char)){dialogueVoice(speakerKind(line.speaker));d.voiceT=.075;}}}if(Math.floor(portraitClock*12)!==Math.floor((portraitClock-dt)*12))drawPortrait();return;}
  if(chapterBannerT>0&&G.state==='playing'){chapterBannerT-=dt;T('chapterBanner').classList.toggle('visible',chapterBannerT>.65);}
  if(fieldNoteT>0&&G.state==='playing'){fieldNoteT-=dt;T('fieldNote').classList.toggle('visible',fieldNoteT>0);}
  if(storyQueue.length&&!G.descending&&!anyBlockingOverlay()&&['playing','menu','dead'].includes(G.state)){
    const id=storyQueue.shift();if(!storyData().seen[id])beginDialogue(id);
  }
}
function fieldNote(text,duration=4){T('fieldNote').textContent=text;fieldNoteT=duration;T('fieldNote').classList.add('visible');}
function announceHollowFloor(){if(G.world?.region!=='hollow')return;const f=HOLLOW_FLOORS[G.floor-1];T('chapterRegion').textContent=G.floor>=6?'CHAPTER II · THE ROOTBOUND GARDENS':'CHAPTER I · THE HOLLOW GATE';T('chapterPlace').textContent=f.name;T('chapterHint').textContent=f.hint;chapterBannerT=4;T('chapterBanner').classList.add('visible');}
function renderMemories(){
  const list=T('memoryList');list.replaceChildren();const ids=Object.keys(HOLLOW_SCENES).filter(id=>storyData().seen[id]&&!HOLLOW_SCENES[id].hidden);T('memoryEmpty').hidden=ids.length>0;
  for(const id of ids){const s=HOLLOW_SCENES[id],b=document.createElement('button');b.className='memory-entry';const left=document.createElement('span'),name=document.createElement('strong'),where=document.createElement('small'),action=document.createElement('span');name.textContent=s.title;where.textContent=s.where;action.textContent='RECALL →';left.append(name,where);b.append(left,action);b.addEventListener('click',()=>beginDialogue(id,true));list.appendChild(b);}
}
function openMemories(){if(G.state==='playing')pauseGame(true);renderMemories();show('memories');}
function showChapterClear(){const second=G.floor===10;setState('chapter');T('chapterSeal').textContent=second?'Ⅱ':'Ⅰ';T('chapterCompleteLabel').textContent=second?'CHAPTER II COMPLETE':'CHAPTER I COMPLETE';T('chapterCompleteTitle').textContent=second?'The Rootbound Gardens':'The Hollow Gate';T('chapterCompleteText').textContent=second?'The roots loosen. Something beneath the garden is still breathing.':'The Warden has lowered his weapon. Beyond him, the stairs keep going.';T('chapterQuote').textContent=second?'“You asked me to keep them warm.”':'“You asked me to stop you.”';statBoxes(T('chapterStats'),G.floor,G.run.level,G.run.kills,G.run.t);show('chapterClear');sfx('victory');}
function hollowKey(e){
  if(!dialogue){if(T('memories').classList.contains('open')&&e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();hide('memories');}return;}
  if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;
  e.stopImmediatePropagation();
  if(e.code==='Tab'){const controls=[...T('conversation').querySelectorAll('button')].filter(b=>!b.hidden&&b.offsetParent!==null),i=controls.indexOf(document.activeElement);e.preventDefault();controls[(i+(e.shiftKey?-1:1)+controls.length)%controls.length]?.focus();return;}
  if(['Space','Enter','Escape'].includes(e.code)){e.preventDefault();if(e.repeat)return;if(e.code==='Escape')finishDialogue();else if(!dialogue.lines[dialogue.index].choices)advanceDialogue();else if(e.target.closest('#dialogueChoices'))e.target.click();}
}
function wireHollow(){
  on(T('dialogueNext'),'click',()=>advanceDialogue());on(T('dialogueSkip'),'click',finishDialogue);
  on(T('memoriesClose'),'click',()=>hide('memories'));on(T('btnMemories'),'click',openMemories);on(T('btnPauseMemories'),'click',openMemories);
  on(T('chapterContinue'),'click',()=>{hide('chapterClear');setState('playing');descend();});
  on(T('chapterExplore'),'click',()=>{hide('chapterClear');setState('playing');clearInput();saveNow();});
  on(T('chapterSave'),'click',()=>{hide('chapterClear');setState('paused');saveNow();backToMenu();});
  on(T('setTextSpeed'),'change',()=>{save.textSpeed=Number(T('setTextSpeed').value);saveNow();});on(T('setDialogueVoice'),'change',()=>{save.dialogueVoice=T('setDialogueVoice').checked?1:0;saveNow();});
  addEventListener('keydown',hollowKey,true);
}

function genHollowFloor(f){
  const w=beforeHollow.genFloor(f),{rooms,exit}=w;
  if(bossFloorAt(f)){exit.cx=exit.x+(exit.w>>1);exit.cy=exit.y+(exit.h>>1);}
  Object.assign(w,{region:'hollow',layout:'procedural-v1',fixtures:[],hazards:[],hollowDecor:[],arenaDoors:[],sealed:false,wardCleared:false});
  const inArena=(x,y,pad=0)=>bossFloorAt(f)&&x>=(exit.x-pad)*TILE&&x<(exit.x+exit.w+pad)*TILE&&y>=(exit.y-pad)*TILE&&y<(exit.y+exit.h+pad)*TILE;
  const place=(r,radius=24)=>{
    for(let attempt=0;attempt<120;attempt++){
      const x=(irand(r.x+1,r.x+r.w-2)+.5)*TILE,y=(irand(r.y+1,r.y+r.h-2)+.5)*TILE;
      const p=safePosition(w,x,y,radius);
      if(p&&p.x>(r.x+1)*TILE&&p.x<(r.x+r.w-1)*TILE&&p.y>(r.y+1)*TILE&&p.y<(r.y+r.h-1)*TILE&&!inArena(p.x,p.y,1)&&w.fixtures.every(o=>d2(o.x,o.y,p.x,p.y)>100**2))return p;
    }
    return null;
  };
  const candidates=rooms.slice(1).filter(r=>r!==exit&&!inArena(r.cx*TILE,r.cy*TILE,2));
  const shuffled=[...candidates].sort(()=>Math.random()-.5);
  let memoryRoom=null;
  for(const r of shuffled){const p=place(r);if(p){w.fixtures.push({kind:'echo',id:'echo'+f,...p});memoryRoom=r;break;}}
  if(!memoryRoom){const r=rooms[0],p=place(r);if(p){w.fixtures.push({kind:'echo',id:'echo'+f,...p});memoryRoom=r;}}
  const restOrder=[rooms[0],...shuffled];
  for(const r of restOrder){const p=place(r);if(p){w.fixtures.push({kind:'brazier',...p,lit:false});break;}}
  if(f>1)for(const r of shuffled){if(r===memoryRoom)continue;const p=place(r);if(p){w.fixtures.push({kind:'echo',id:'echo'+irand(1,f-1),...p});break;}}
  const barracks=shuffled[0]||rooms[1];w.storyRoom=rooms.indexOf(barracks);
  for(let i=0;i<rooms.length;i++){
    const r=rooms[i];
    if(r===exit||chance(.4)||f===4)w.hollowDecor.push({type:'carpet',x:r.cx*TILE+18,y:r.cy*TILE+18,w:Math.min(r.w-3,r===exit?10:7)*TILE,h:Math.min(r.h-3,7)*TILE,seed:i});
    if(f===4&&i>0&&r!==exit){for(let j=0;j<Math.min(3,Math.floor((r.w-2)/3));j++)w.hollowDecor.push({type:'bed',x:(r.x+2+j*3)*TILE+18,y:(r.y+2)*TILE+18});}
    if(f===2&&i>0&&chance(.7))w.hollowDecor.push({type:'lampRack',x:(r.x+1)*TILE+18,y:(r.y+2)*TILE+18});
  }
  if(f===3&&memoryRoom){const echo=w.fixtures.find(o=>o.id==='echo3');w.hollowDecor.push({type:'bell',x:echo.x,y:(memoryRoom.y+1)*TILE+18});}
  if(f===3||f===4)for(const r of shuffled.slice(0,2)){
    const width=Math.min(5,r.w-4)*TILE;
    w.hazards.push({x:r.cx*TILE+18-width/2,y:(r.cy+1)*TILE+18,w:width,h:14,t:rand(1.8,3.6),phase:'rest'});
  }
  if(bossFloorAt(f)){
    const doorway=(x,y)=>{if(w.grid[y*w.W+x]===1)w.arenaDoors.push({x,y});};
    for(let x=exit.x;x<exit.x+exit.w;x++){doorway(x,exit.y-1);doorway(x,exit.y+exit.h);}
    for(let y=exit.y;y<exit.y+exit.h;y++){doorway(exit.x-1,y);doorway(exit.x+exit.w,y);}
    for(let y=exit.y;y<exit.y+exit.h;y++)for(let x=exit.x;x<exit.x+exit.w;x++)w.grid[y*w.W+x]=1;
    w.props=w.props.filter(o=>!inArena(o.x,o.y));
    for(const side of [-1,1])w.hollowDecor.push({type:'statue',x:(exit.cx+side*Math.floor((exit.w-5)/2))*TILE+18,y:(exit.y+2)*TILE+18});
  }
  w.props=w.props.filter(o=>w.fixtures.every(p=>d2(o.x,o.y,p.x,p.y)>48**2));
  return w;
}

Object.assign(ETYPES,{
  gateHound:{hp:40,spd:93,dmg:8,r:12,xp:5,spr:'gateHound',ai:'gate',col:'#e0638a',ess:.38,kb:1},
  gateSentry:{hp:52,spd:65,dmg:10,r:14,xp:7,spr:'gateSentry',ai:'gate',col:'#b088ff',ess:.42,kb:.55},
  gateLantern:{hp:44,spd:56,dmg:8,r:12,xp:8,spr:'gateLantern',ai:'gate',col:'#37c2a4',ess:.45,kb:.9},
  gateShield:{hp:90,spd:45,dmg:14,r:18,xp:13,spr:'gateShield',ai:'gate',col:'#8f75cf',ess:.75,kb:.2}
});
function setupHollowFloor(f){
  G.floor=f;save.bestFloor=Math.max(save.bestFloor,f);markSave();G.world=genHollowFloor(f);
  for(const k of ['enemies','bullets','ebul','picks','chests','parts','texts'])G[k]=[];
  G.boss=null;G.bossActive=false;T('bossbar').classList.remove('on');G.cardPool=null;
  const w=G.world,s=w.rooms[0],p=G.player;p.x=s.cx*TILE+18;p.y=s.cy*TILE+18;p.kbx=p.kby=0;p.hitCd=1;p.dashT=0;
  G.cam={x:p.x-G.w/2,y:p.y-G.h/2,shake:0};G.portal={x:w.exit.cx*TILE+18,y:(bossFloorAt(f)?w.exit.y+2:w.exit.cy)*TILE+18,r:26,active:!bossFloorAt(f),t:0};
  const encounterPlan=planEarlyEncounters(w,f);
  for(let ri=1;ri<w.rooms.length;ri++){
    const r=w.rooms[ri];if(bossFloorAt(f)&&r===w.exit)continue;
    const roster=f>=6?gardenRoster(f):f===1?['gateSentry','gateHound']:f===2?['gateSentry','gateHound','gateLantern']:['gateSentry','gateHound','gateLantern','gateShield'];
    const n=encounterPlan[ri].count;
    for(let i=0;i<n;i++){
      let pos;const type=chapterEnemyType(f,encounterPlan[ri],i),elite=f===4&&type==='gateShield'&&i===0;
      for(let attempt=0;attempt<25;attempt++){const x=(irand(r.x+2,r.x+r.w-3)+.5)*TILE,y=(irand(r.y+2,r.y+r.h-3)+.5)*TILE;pos=safePosition(w,x,y,ETYPES[type].r*(elite?1.3:1));if(pos&&!(bossFloorAt(f)&&pos.x>(w.exit.x-1)*TILE&&pos.x<(w.exit.x+w.exit.w+1)*TILE&&pos.y>(w.exit.y-1)*TILE&&pos.y<(w.exit.y+w.exit.h+1)*TILE)&&earlySpawnSpace(w,f,pos,r)&&w.fixtures.every(o=>d2(pos.x,pos.y,o.x,o.y)>65**2))break;pos=null;}
      if(pos&&(f>10||G.enemies.length<FLOOR_POPULATION[f-1]))spawnEnemy(type,pos.x,pos.y,elite);
    }
    const giftRoom=bossFloorAt(f)?Math.min(3,w.rooms.length-1):Math.min(2,w.rooms.length-1);
    if(ri===giftRoom){const pos=safePosition(w,(r.cx+2)*TILE+18,(r.cy+2)*TILE+18,17);if(pos)G.chests.push({...pos,opened:false,hollowGift:true});}
  }
  if(f===5){const b=spawnBossAt(w.exit.cx*TILE+18,(w.exit.cy-2)*TILE+18);b.warden=true;b.ai='warden';b.name='THE STAR WARDEN';b.hp=b.max=WARDEN_HP;b.balanceVersion=2;b.r=29;b.dmg=19;b.spd=74;b.xp=85;b.col='#d8c389';b.kb=0;b.tier=1;b.introduced=false;b.wb={mode:'wait',t:1.3,a:Math.PI/2,kind:'',step:0,marks:[],second:false,final:false};}
  if(f===10)spawnMatriarch();
  musicInt=Math.min(.7,.18+f*.06);announceHollowFloor();if(f===2)queueStory('walks');
}
function bakeHollowSprites(){
  SPR.gateHound=SPR.bat;
  SPR.gateSentry=SPR.slime;
  SPR.gateLantern=SPR.spitter;
  SPR.gateShield=SPR.brute;
  const armor={k:'#101824',s:'#344755',m:'#69808a',l:'#c6d0c5',g:'#bba06c',e:'#fae4ad',c:'#344457',b:'#252d3b'};
  const warden=['...........g...........','.......g...g...g.......','.......gg..g..gg.......','........ggggggg........','........glllllg........','........smeemss........','........ksssssk........','.......gmlllllmg.......','....ggmmslllllsmmgg....','...gmssssmmmmsssssmg...','..gmmssccgggggccssmmg..','..mssscccllllcccssssm..','..msskcccllllcccksssm..','...sskcccggggccckss....','...kkmccccccccccmkk....','.....mcccllllcccm......','.....mcggggggggcm......','.....mccccccccccm......','.....sccccccccccs......','.....scccckkccccs......','.....sccsskkssccs......','.....ssssk..kssss......','......mssk..kssm.......','......mssk..kssm.......','.....gmmmk..kmmmg......'];
  SPR.gateWarden=px([warden],armor,{fps:1,sc:3.1});
  SPR.gateWarden=pxGen(38,43,6,(i,j,f)=>{
    const beat=Math.sin(f/6*TAU),x=i-18.5-beat*(j>17?(j-17)/60:0),y=j;
    if(y<=7){const ray=(Math.abs(x)<1.5&&y<5)||(Math.abs(x-5)<1.3&&y>1)||(Math.abs(x+5)<1.3&&y>1)||(Math.abs(x)<7&&Math.abs(y-(5-Math.abs(x)*.45))<1.2);if(ray)return y<2?'#f8df9d':'#a58b59';}
    const helm=y>=5&&y<=18&&Math.abs(x)<8.5-(Math.max(0,8-y)*.35);
    if(helm){if(Math.abs(x)>6.7||y===5||y===17)return '#111824';if(y>=10&&y<=13)return Math.abs(x)>4?'#7f8f94':Math.abs(x)>1?'#f4d59b':'#0a1019';return y<9?'#c6cbbf':'#405361';}
    const shoulder=y>=14&&y<=22&&Math.abs(x)<17-(y-14)*.65;
    if(shoulder){if(Math.abs(x)>14||y===14||y===21)return '#111924';return y<17?'#d6d7c7':Math.abs(x)>10?'#7f9297':'#394c5d';}
    const torso=y>=18&&y<=34&&Math.abs(x)<11-(y-18)*.12;
    if(torso){if(Math.abs(x)>8.5||y===33)return '#14202b';if(Math.abs(x)+Math.abs(y-25)<4)return '#ffe08a';if(Math.abs(x)+Math.abs(y-25)<6)return '#a78352';return y<23?'#70858b':y%5===0?'#a8b6af':'#354959';}
    if(y>=31&&y<=41){const leg=Math.abs(x-6)<4||Math.abs(x+6)<4;if(leg){if(y>39||Math.abs(x-6)>2.8&&Math.abs(x+6)>2.8)return '#141c29';return y%4===0?'#9baaa9':'#455665';}}
    const capeW=y<17?0:10+(y-17)*.23;
    if(y>=16&&y<=40&&Math.abs(x)<capeW){if(Math.abs(x)>capeW-1.6||y>37+(Math.abs(x)%3))return '#121725';return (Math.floor(x+y+f)%7===0)?'#513c68':'#252b42';}
    return null;
  },{fps:6,sc:2.2});
  SPR.wardenShield=px([[
    '........ggg........','.....ggglllggg.....','..ggglllllllllggg..',
    '.gllllsssssssllllg.','.glssssssssssssl lg.'.replace(' ',''),
    '.glsscccccccccsslg.','.glssccceeecccsslg.','.glssccceeecccsslg.',
    '.glssccceeecccsslg.','.glsceeeeeeeeecslg.','.glsceeeeeeeeecslg.',
    '.glssccceeecccsslg.','.glssccceeecccsslg.','.glssccceeecccsslg.',
    '..glsccceeecccslg..','..glscccccccccslg..','...glscccccccslg...',
    '...glscccccccslg...','....glscccccslg....','.....glscccslg.....',
    '......glscslg......','.......glslg.......','........glg........'
  ]],armor,{fps:1,sc:2});
  SPR.fallingStar=pxGen(11,19,3,(x,y,f)=>{
    const dx=x-5,dy=y-12,d=Math.abs(dx)/3.7+Math.abs(dy)/5.5;
    if(y<8&&Math.abs(dx-Math.sin(y*.8+f)*.6)<1.3)return y<3?'#77285566':'#f47faa99';
    if(d>1.15)return null;if(d>1)return '#481b50';if(d>.7)return '#ca467e';if(d>.36)return '#ffadcd';return '#fff0dc';
  },{fps:9,sc:1.7});
  SPR.wardPlate=px([[
    '.......oo.......','.....oolloo.....','...oolllllloo...',
    '..olllwwlllllo..','.ollwwbbwwllllo.','.olwwbggbwwlllo.',
    '.olwbbggbbwlblo.','.olwbbggbbwlblo.','..olbbggbblblo..',
    '..olbbggbblblo..','...olbggblblo...','....olgglblo....',
    '.....ollblo.....','......ollo......','.......oo.......'
  ]],{o:'#211535',l:'#6e5da0',w:'#cbbaff',b:'#39234f',g:'#ffc575'},{fps:1,sc:2});
}


function gateEnemyAI(e,dt,d,dx,dy){
  const p=G.player,w=G.world;e.staggerCd=Math.max(0,(e.staggerCd||0)-dt);e.face=e.face??Math.atan2(dy,dx);e.action=e.action||'stalk';e.actionT=(e.actionT??.5)-dt;
  if(e.action==='warn'){
    if(e.actionT<=0){
      if(e.type==='gateLantern'){for(const s of [-.13,0,.13])enemyShoot(e,e.face+s,185,e.dmg);e.action='recover';e.actionT=1.25;}
      else if(e.type==='gateHound'){e.action='leap';e.actionT=.34;}
      else {e.action='recover';e.actionT=e.type==='gateShield'?1.15:.8;const a=Math.atan2(p.y-e.y,p.x-e.x);if(d<118+p.r&&Math.abs(angleDiff(a,e.face))<.42&&los(w,e.x,e.y,p.x,p.y))hurtPlayer(e.dmg,e.x,e.y);e.strikeT=.18;}
    }return;
  }
  if(e.action==='leap'){moveEnt(w,e,Math.cos(e.face)*380*dt,Math.sin(e.face)*380*dt);if(e.actionT<=0){e.action='recover';e.actionT=.85;}return;}
  if(e.action==='recover'){e.strikeT=Math.max(0,(e.strikeT||0)-dt);if(e.actionT<=0){e.action='stalk';e.actionT=.3;}return;}
  e.face=Math.atan2(dy,dx);
  if(e.type==='gateLantern'){
    const move=d>255?1:d<180?-1:0;moveEnt(w,e,dx/d*e.spd*dt*move,dy/d*e.spd*dt*move);
    if(e.actionT<=0&&d<390&&los(w,e.x,e.y,p.x,p.y)){e.action='warn';e.actionT=.8;}return;
  }
  const range=e.type==='gateHound'?190:110;
  if(d>range*.85)moveEnt(w,e,dx/d*e.spd*dt,dy/d*e.spd*dt);
  if(e.actionT<=0&&d<range&&los(w,e.x,e.y,p.x,p.y)){e.action='warn';e.actionT=e.type==='gateHound'?.65:.85;}
}
function angleDiff(a,b){return Math.atan2(Math.sin(a-b),Math.cos(a-b));}
function sealWardenArena(closed){
  const w=G.world;if(w?.region!=='hollow'||!bossFloorAt(G.floor))return;
  const doors=w.arenaDoors||[-1,0,1].map(dx=>({x:w.exit.cx+dx,y:w.exit.y+w.exit.h}));
  w.sealed=closed;for(const p of doors)w.grid[p.y*w.W+p.x]=closed?2:1;w.mmDirty=true;
}

function playerInArena(){const r=G.world.exit,p=G.player;return p.x>(r.x+1)*TILE&&p.x<(r.x+r.w-1)*TILE&&p.y>(r.y+1)*TILE&&p.y<(r.y+r.h-1)*TILE;}
function activateWarden(b){b.introduced=true;b.aggro=true;G.bossActive=true;G.ebul=[];G.bullets=[];chapterBannerT=0;T('chapterBanner').classList.remove('visible');sealWardenArena(true);G.cam.x=(G.player.x+b.x)/2-G.w/2;G.cam.y=(G.player.y+b.y)/2-G.h/2;T('bossname').textContent=b.name;T('bossbar').classList.add('on');sfx('boss');if(!storyData().seen.wardenBefore)beginDialogue('wardenBefore');saveNow();}
const WARDEN_HP=1850;
const WARDEN_REACH=134;
function wardenAI(b,dt,d,dx,dy){
  if(!b.introduced)return;musicInt=.88;const a=b.wb,p=G.player,w=G.world;a.t-=dt;
  if(!a.second&&b.hp<=b.max*.56){
    a.second=true;a.mode='break';a.t=1.05;a.marks=[];G.ebul=[];
    burst(b.x,b.y,24,'#b491dc',200,.65,3,false);sfx('roar2');return;
  }
  if(a.second&&!a.final&&b.hp<=b.max*.22){
    a.final=true;a.mode='break';a.t=.72;a.marks=[];G.ebul=[];
    burst(b.x,b.y,30,'#ffd08a',245,.72,3.4,false);sfx('roar2');return;
  }
  if(a.mode==='break'){if(a.t<=0){a.mode='recover';a.t=.6;}return;}
  if(a.mode==='lunge'){
    const hit=moveEnt(w,b,Math.cos(a.a)*(a.final?760:a.second?700:650)*dt,Math.sin(a.a)*(a.final?760:a.second?700:650)*dt);
    if(d2(p.x,p.y,b.x,b.y)<(b.r+p.r+5)**2)hurtPlayer(b.dmg+3,b.x,b.y);
    if(hit||a.t<=0){a.mode='recover';a.t=a.second?.54:1.05;burst(b.x,b.y,12,'#8973a9',130,.45,2,false);}
    return;
  }
  if(a.mode==='windup'){
    if(a.t>0)return;
    if(a.kind==='lunge'){a.mode='lunge';a.t=a.second?.5:.46;sfx('charge');return;}
    if(a.kind==='stars'){
      const offsets=a.final?[[0,0],[-92,-58],[92,58],[-72,108],[72,-108],[112,-22]]:a.second?[[0,0],[-80,-50],[85,50],[-65,100],[65,-100]]:[[0,0],[-85,40],[85,-40]];
      a.marks=[];
      for(const [ox,oy]of offsets){const pos=safePosition(w,p.x+ox,p.y+oy,14);if(pos)a.marks.push({...pos,delay:a.marks.length*.16,landed:false});}
      a.mode='rain';a.rainAge=0;a.t=.66+Math.max(0,a.marks.length-1)*.16;sfx('eshoot');return;
    }
    a.mode='swing';a.t=.28;a.swingDuration=.28;a.hit=false;sfx('dash');return;
  }
  if(a.mode==='swing'){
    const duration=a.swingDuration||.28,u=clamp(1-a.t/duration,0,1),prior=clamp(1-(a.t+dt)/duration,0,1);
    const start=-1.16+prior*2.32,end=-1.16+u*2.32,diff=angleDiff(Math.atan2(p.y-b.y,p.x-b.x),a.a);
    if(!a.hit&&d<WARDEN_REACH+p.r&&diff>=start-.13&&diff<=end+.13&&los(w,b.x,b.y,p.x,p.y)){
      hurtPlayer(b.dmg,b.x,b.y);a.hit=true;
    }
    if(a.t<=0){
      if(a.kind==='double'&&!a.followup){a.followup=true;a.mode='windup';a.t=a.second?.32:.44;a.duration=a.t;a.a=Math.atan2(p.y-b.y,p.x-b.x);}
      else{a.mode='recover';a.t=a.second?.58:1.15;}
    }return;
  }
  if(a.mode==='rain'){
    a.rainAge=(a.rainAge||0)+dt;
    for(const m of a.marks){
      if(m.landed||a.rainAge<m.delay+.62)continue;m.landed=true;
      if(d2(p.x,p.y,m.x,m.y)<(14+p.r)**2)hurtPlayer(b.dmg,m.x,m.y);
      burst(m.x,m.y,8,'#d2a1ed',95,.45,2,false);sfx('hit');
      const rotation=a.a+(a.second?Math.PI/4:0);
      const rays=a.final?6:4;for(let i=0;i<rays;i++){const angle=rotation+i*TAU/rays;enemyShoot({x:m.x,y:m.y},angle,a.final?195:a.second?175:145,a.final?14:12);}
    }
    if(a.t<=0){a.mode='recover';a.t=a.second?.34:.7;}return;
  }
  if(a.mode==='starFlash'){a.marks=[];a.mode='recover';a.t=.7;return;}
  if(a.mode==='recover'){if(a.t<=0){a.mode='wait';a.t=a.final?.08:a.second?.14:.36;a.marks=[];a.kindledOpened=false;}return;}
  a.a=Math.atan2(dy,dx);
  if(d>104)moveEnt(w,b,dx/d*(a.final?118:a.second?104:80)*dt,dy/d*(a.final?118:a.second?104:80)*dt);
  if(a.t>0)return;
  const sequence=a.final?['double','stars','lunge','double','stars','lunge']:a.second?['double','lunge','stars','double','lunge']:['sweep','lunge','sweep','stars'];
  a.kind=sequence[a.step++%sequence.length];if(d>230&&a.kind==='sweep')a.kind='lunge';
  a.followup=false;a.mode='windup';a.duration=a.kind==='stars'?(a.final?.66:a.second?.82:.95):a.kind==='lunge'?(a.final?.4:a.second?.5:.72):(a.final?.36:a.second?.46:.66);
  a.t=a.duration;a.a=Math.atan2(p.y-b.y,p.x-b.x);a.marks=[];
}

function drawWardenEnvironment(ctx){
  const b=G.boss;if(!b?.warden||!b.introduced)return;const a=b.wb;
  if(a.mode==='rain'||a.mode==='recover')for(const m of a.marks){
    if(m.landed){
      ctx.save();ctx.translate(m.x,m.y);ctx.strokeStyle='#a782c05a';ctx.lineWidth=1.5;
      for(let i=0;i<4;i++){const n=i*TAU/4;ctx.beginPath();ctx.moveTo(Math.cos(n)*4,Math.sin(n)*4);ctx.lineTo(Math.cos(n+.25)*11,Math.sin(n+.25)*11);ctx.lineTo(Math.cos(n)*18,Math.sin(n)*18);ctx.stroke();}ctx.restore();continue;
    }
    const age=(a.rainAge||0)-m.delay;if(age<0)continue;const u=clamp(age/.62,0,1),height=156*(1-u*u);
    ctx.save();ctx.fillStyle='#11091dbb';ctx.beginPath();ctx.ellipse(m.x,m.y,3+u*9,2+u*4,0,0,TAU);ctx.fill();
    ctx.strokeStyle='#ce93d977';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(m.x,m.y-height-17);ctx.lineTo(m.x,m.y-height);ctx.stroke();
    glowImg('magenta',m.x,m.y-height,17+u*6,.28);drawSpr('fallingStar',m.x,m.y-height-4,.65+u*.35,0,1);ctx.restore();
  }
}

function drawHollowFloor(ctx){
  const w=G.world;if(w.region!=='hollow')return;const time=save.motion?0:G.tAll;
  for(const o of w.hollowDecor){
    if(o.x<G.cam.x-350||o.x>G.cam.x+G.w+350||o.y<G.cam.y-350||o.y>G.cam.y+G.h+350)continue;
    ctx.save();ctx.translate(o.x,o.y);
    if(['moss','vine','planter','trellis'].includes(o.type)){drawGardenDecor(ctx,o,time);ctx.restore();continue;}
    if(o.type==='carpet'){
      ctx.fillStyle=G.floor===4?'#38455438':'#6d60451a';ctx.fillRect(-o.w/2,-o.h/2,o.w,o.h);ctx.strokeStyle='#a2905733';ctx.lineWidth=2;ctx.strokeRect(-o.w/2+7,-o.h/2+7,o.w-14,o.h-14);ctx.strokeStyle='#a2905720';ctx.strokeRect(-o.w/2+13,-o.h/2+13,o.w-26,o.h-26);
      ctx.translate(0,-o.h/2+26);ctx.rotate(Math.PI/4);ctx.strokeStyle='#c0a87135';ctx.strokeRect(-7,-7,14,14);
    }else if(o.type==='bed'){
      ctx.fillStyle='#080c1260';ctx.fillRect(-17,-28,37,59);ctx.fillStyle='#66757a';ctx.fillRect(-15,-28,30,54);ctx.fillStyle='#253c51';ctx.fillRect(-12,-15,24,37);ctx.fillStyle='#a2a79a';ctx.fillRect(-11,-24,22,9);ctx.fillStyle='#8c7754';ctx.fillRect(-17,-30,4,61);ctx.fillRect(13,-30,4,61);ctx.fillStyle='#172835';ctx.fillRect(-6,-12,13,25);
    }else if(o.type==='lampRack'){
      ctx.fillStyle='#51616a';ctx.fillRect(-5,-30,10,65);ctx.fillRect(-19,-24,38,5);ctx.fillStyle='#a19675';ctx.fillRect(-17,-18,6,14);ctx.fillRect(11,-18,6,14);ctx.fillStyle='#43505a';ctx.fillRect(-14,-29,3,12);ctx.fillRect(12,-29,3,12);
    }else if(o.type==='statue'){
      ctx.fillStyle='#080e1770';ctx.fillRect(-23,10,46,18);ctx.fillStyle='#3b4a54';ctx.fillRect(-20,5,40,13);ctx.fillStyle='#78868b';ctx.fillRect(-13,-42,26,47);ctx.fillStyle='#4d5c68';ctx.fillRect(-19,-25,38,18);ctx.fillStyle='#99a79d';ctx.fillRect(-10,-58,20,18);ctx.fillStyle='#293a46';ctx.fillRect(-8,-49,16,5);ctx.fillStyle='#a3926c';ctx.fillRect(24,-42,3,58);
    }else if(o.type==='bell'){
      ctx.fillStyle='#596573';ctx.fillRect(-27,-46,5,68);ctx.fillRect(22,-46,5,68);ctx.fillRect(-27,-47,54,7);ctx.fillStyle='#8c805f';ctx.fillRect(-12,-35,24,26);ctx.fillRect(-19,-15,38,7);ctx.fillStyle='#c5b68c';ctx.fillRect(-7,-31,4,19);ctx.fillStyle='#b1a17d';ctx.fillRect(-2,-9,4,41);
    }ctx.restore();
  }
  for(const h of w.hazards){
    if(G.floor>=6){drawGardenBramble(ctx,h);continue;}
    ctx.fillStyle='#839da82a';ctx.fillRect(h.x,h.y,h.w,h.h);ctx.fillStyle='#465c67';ctx.fillRect(h.x-9,h.y-8,11,h.h+16);ctx.fillRect(h.x+h.w-2,h.y-8,11,h.h+16);
    if(h.phase!=='rest'){ctx.fillStyle=h.phase==='active'?'#d4f4ffc0':'#e7c98135';ctx.fillRect(h.x,h.y,h.w,h.h);ctx.strokeStyle=h.phase==='active'?'#ecfcff':'#e9cc84';ctx.lineWidth=2;ctx.setLineDash(h.phase==='active'?[]:[8,5]);ctx.strokeRect(h.x,h.y,h.w,h.h);ctx.setLineDash([]);if(h.phase==='warn'){ctx.fillStyle='#efda9b';ctx.fillRect(h.x,h.y+h.h+4,h.w*clamp(1-h.t/1.15,0,1),2);}}
  }
  if(w.sealed){const doors=w.arenaDoors||[-1,0,1].map(dx=>({x:w.exit.cx+dx,y:w.exit.y+w.exit.h}));for(const p of doors){const x=p.x*TILE,y=p.y*TILE;ctx.fillStyle='#101d2e';ctx.fillRect(x,y,TILE,TILE);ctx.fillStyle='#a5d7e1';for(let i=0;i<3;i++)ctx.fillRect(x+i*12+4,y+3,3,TILE-6);}}
  drawWardenEnvironment(ctx);
  for(const o of w.fixtures){
    const near=d2(o.x,o.y,G.player.x,G.player.y)<85**2;
    if(o.kind==='echo'){
      drawEchoArtifact(ctx,o,!!storyData().seen[o.id],near,time);
    }else drawHealingLantern(ctx,o,time);
    if(near&&o.kind!=='echo'){ctx.font='10px system-ui';ctx.textAlign='center';ctx.fillStyle='#dfd6bd';ctx.fillText(o.lit?'BRAZIER LIT':'E · RESTORE HEALTH',o.x,o.y+40);}
  }
  ctx.fillStyle='#9c865145';for(const r of w.rooms){ctx.fillRect((r.cx)*TILE+15,r.y*TILE+3,6,3);}
}
function smoothBoss(u){u=clamp(u,0,1);return u*u*(3-2*u);}
function drawWardenTrail(ctx,x,y,a,u){if(u<=0||u>=1)return;ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalCompositeOperation='lighter';const end=-1.16+2.32*u;for(let i=0;i<5;i++){ctx.strokeStyle=i<2?'#fff1c0':'#bc8ee2';ctx.globalAlpha=Math.sin(Math.PI*u)*(.14+i*.11);ctx.lineWidth=2+i;ctx.beginPath();ctx.arc(0,0,WARDEN_REACH-i*3,end-.58-i*.04,end);ctx.stroke();}ctx.restore();}
function drawWardenGlaive(ctx,x,y,a,alpha=1){ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.globalAlpha=alpha;ctx.strokeStyle='#111824';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(20,0);ctx.lineTo(111,0);ctx.stroke();ctx.strokeStyle='#91a7aa';ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='#bca261';ctx.fillRect(32,-5,7,10);ctx.fillRect(88,-6,7,12);ctx.translate(111,0);ctx.fillStyle='#192337';ctx.strokeStyle='#d8c887';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(9,-17);ctx.lineTo(17,-6);ctx.lineTo(30,0);ctx.lineTo(17,6);ctx.lineTo(9,17);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#f8dfa1';ctx.beginPath();ctx.moveTo(5,0);ctx.lineTo(11,-6);ctx.lineTo(18,0);ctx.lineTo(11,6);ctx.closePath();ctx.fill();ctx.restore();}
function drawGateEnemy(ctx,e){
  const t=save.motion?0:G.tAll,phase=t*5+(e.seed||0),warn=e.action==='warn',elite=e.elite?1.18:1;
  ctx.fillStyle='rgba(0,0,0,.42)';ctx.beginPath();ctx.ellipse(e.x,e.y+e.r*.85,e.r*.85,e.r*.36,0,0,TAU);ctx.fill();
  if(e.warden){
    const a=e.wb,wind=a.mode==='windup',windU=wind?smoothBoss(1-a.t/Math.max(.01,a.duration)):0;
    const swing=a.mode==='swing',swingU=swing?clamp(1-a.t/(a.swingDuration||.28),0,1):0;
    const lunge=a.mode==='lunge',lungeU=lunge?1-a.t/(a.second?.5:.46):0,stars=wind&&a.kind==='stars';
    const pull=wind&&!stars?windU:0,flow=swing?Math.sin(Math.PI*swingU):lunge?Math.sin(Math.PI*lungeU):0;
    const bodyX=-Math.cos(a.a)*pull*7,bodyY=-8-Math.sin(a.a)*pull*7-(stars?windU*9:0);
    const bodyRot=lunge?Math.cos(a.a)*.16:swing?(-.08+.16*swingU):Math.sin(t*1.4)*.012-Math.sin(a.a)*pull*.07;
    const sx=1-(pull*.07),sy=1+pull*.08;
    glowImg(a.second?'ember':'gold',e.x,e.y-5,80,a.mode==='break'?.7:.24+flow*.15);
    if(lunge&&!save.motion)for(let i=3;i>0;i--)drawSpr('gateWarden',e.x-Math.cos(a.a)*i*14,e.y-9-Math.sin(a.a)*i*14,1,bodyRot,.08*i);
    ctx.save();ctx.translate(e.x+bodyX,e.y+bodyY);ctx.rotate(bodyRot);ctx.scale(sx,sy);drawSpr('gateWarden',0,0,1,0,1);ctx.restore();
    if(a.second){
      ctx.save();ctx.translate(e.x+bodyX,e.y+bodyY);ctx.rotate(-t*.7);ctx.strokeStyle='#f4bb79aa';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.rotate(TAU/4);ctx.beginPath();ctx.moveTo(26,0);ctx.lineTo(34,0);ctx.stroke();ctx.fillStyle='#ffd493';ctx.fillRect(36,-2,4,4);}ctx.restore();
    }
    if(stars)for(let i=0;i<(a.second?6:4);i++){const an=t*.55+i*TAU/(a.second?6:4),dist=54-windU*25;drawSpr('pShard',e.x+Math.cos(an)*dist,e.y-5+Math.sin(an)*dist*.55-windU*20,.65+windU*.24,an+Math.PI/4,.9);}
    const brace=wind&&a.kind==='lunge',swingA=a.a-1.16+2.32*swingU;
    const targetA=swing?swingA:lunge?a.a:wind&&!stars?a.a+(-.7-.46*windU):a.a-.68;
    if(!Number.isFinite(a.visualA))a.visualA=targetA;
    if(swing||lunge||save.motion)a.visualA=targetA;else a.visualA+=angleDiff(targetA,a.visualA)*.24;
    drawWardenGlaive(ctx,e.x+bodyX,e.y+bodyY+3,a.visualA,a.mode==='break'?.45:1);
    if(swing)drawWardenTrail(ctx,e.x,e.y,a.a,swingU);
    if(!a.second){const shieldA=a.a+(brace?.08:.64),shieldR=a.mode==='recover'?31:brace?43:36;ctx.save();ctx.translate(e.x+Math.cos(shieldA)*shieldR,e.y+Math.sin(shieldA)*shieldR);ctx.rotate(t*.08+windU*.15);drawSpr('wardenShield',0,0,1,0,1);ctx.restore();}
    if(a.mode==='recover'){glowImg('gold',e.x,e.y-3,27,.48);}
    if(a.mode==='break'){const u=1-a.t/1.05;for(let i=0;i<8;i++){const an=i*TAU/8+t*.2,rr=28+smoothBoss(u)*42;drawSpr('pShard',e.x+Math.cos(an)*rr,e.y-4+Math.sin(an)*rr,.55,an,.8);}}
  }else{
    const style={gateHound:'magenta',gateSentry:'violet',gateLantern:'teal',gateShield:'violet'};
    glowImg(style[e.type],e.x,e.y,e.r*2.1,warn?.4:.24);
    let sx=elite,sy=elite,rot=0,bob=0;
    if(e.type==='gateHound'){
      bob=Math.sin(phase*1.4)*3-3;rot=e.action==='leap'?Math.sin(phase)*.08:Math.sin(phase*1.6)*.15;
      if(warn){sx*=.86;sy*=1.12;bob-=3;}
      if(e.action==='leap'){sx*=1.18;sy*=.8;}
    }else if(e.type==='gateSentry'){
      const squash=warn?.16:Math.sin(phase)*.035;sx*=1+squash;sy*=1-squash;
      if(e.strikeT>0){sx*=1.15;sy*=.85;}
    }else if(e.type==='gateLantern'){
      bob=Math.sin(phase*.65)*2;rot=e.face||0;
      if(warn){sx*=1.08;sy*=1.08;glowImg('teal',e.x+Math.cos(rot)*13,e.y+Math.sin(rot)*13,18,.55);}
    }else{
      sx*=1.35;sy*=1.35;bob=e.action==='stalk'?Math.abs(Math.sin(phase*.7))*2:0;
      if(warn){sx*=1.06;sy*=.94;}
    }
    ctx.save();ctx.translate(e.x,e.y+bob);ctx.scale(sx,sy);drawSpr(e.spr,0,0,1,rot,1,e.seed);ctx.restore();
    if(e.strikeT>0){
      const u=1-e.strikeT/.18;ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.face||0);ctx.globalAlpha=1-u;
      if(e.type==='gateSentry'){
        ctx.fillStyle='#35174e';ctx.beginPath();ctx.moveTo(8,-8);ctx.lineTo(113,-3);ctx.lineTo(117,2);ctx.lineTo(22,10);ctx.closePath();ctx.fill();
        ctx.fillStyle='#cd8ffa';ctx.beginPath();ctx.moveTo(18,-3);ctx.lineTo(112,0);ctx.lineTo(33,4);ctx.closePath();ctx.fill();
      }else{ctx.strokeStyle='#c6a4ff';ctx.lineWidth=3;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(30,i*7);ctx.lineTo(64,i*15+3);ctx.lineTo(108,i*25);ctx.stroke();}}
      ctx.restore();
    }
    if(e.type==='gateShield'&&e.action!=='recover'){
      ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.face||0);
      for(let i=-1;i<=1;i++){
        const a=i*.53;ctx.save();ctx.translate(Math.cos(a)*28,Math.sin(a)*28);ctx.rotate(a+Math.PI/2);
        drawSpr('wardPlate',0,0,.4,0,.9);ctx.restore();
      }ctx.restore();
    }
    if(e.elite){ctx.save();ctx.strokeStyle='#ffcf6bcc';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(e.x,e.y,e.r+7,t*2,t*2+4.2);ctx.stroke();ctx.restore();}
    if(e.hp<e.max){const width=e.r*2;ctx.fillStyle='#090812';ctx.fillRect(e.x-width/2-1,e.y-e.r-11,width+2,5);ctx.fillStyle=e.elite?'#ffcf6b':'#ff5d6d';ctx.fillRect(e.x-width/2,e.y-e.r-10,width*clamp(e.hp/e.max,0,1),3);}
  }
  if(e.hitT>0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(.6,e.hitT*4);ctx.fillStyle='#fff5e3';ctx.beginPath();ctx.arc(e.x,e.y,e.r*.8,0,TAU);ctx.fill();ctx.restore();}
}

function nearestFixture(){if(G.world?.region!=='hollow')return null;let near=null,best=70**2;for(const o of G.world.fixtures){const dd=d2(o.x,o.y,G.player.x,G.player.y);if(dd<best){best=dd;near=o;}}return near;}
function hollowBeforeUpdate(dt){
  if(G.world?.region!=='hollow')return false;
  const p=G.player,w=G.world;
  if(w.wardCleared&&!(G.floor===10?G.run.gardenClearShown:G.run.hollowClearShown)){const scene=G.floor===10?'matriarchAfter':'wardenAfter',flag=G.floor===10?'gardenClearShown':'hollowClearShown';if(!storyData().seen[scene])beginDialogue(scene);else{G.run[flag]=true;showChapterClear();}return true;}
  if(G.floor===1&&!storyData().seen.arrival){beginDialogue('arrival');return true;}
  if(storyData().seen.firstSigil!==true&&save.nodes.awaken)queueStory('firstSigil');
  if(storyQueue.length&&!anyBlockingOverlay()){const id=storyQueue.shift();if(!storyData().seen[id]){beginDialogue(id);return true;}}
  if(G.boss?.warden&&!G.boss.introduced&&playerInArena()){activateWarden(G.boss);if(G.state!=='playing')return true;}
  if(G.floor===4&&!storyData().seen.barracks){const r=w.rooms[w.storyRoom??1];if(p.x>r.x*TILE&&p.x<(r.x+r.w)*TILE&&p.y>r.y*TILE&&p.y<(r.y+r.h)*TILE){queueStory('barracks');}}
  if(interactQueued){const o=nearestFixture();if(o){interactQueued=false;if(o.kind==='echo'){beginDialogue(o.id,!!storyData().seen[o.id]);return true;}if(!o.lit){o.lit=true;p.hp=Math.min(p.maxHp,p.hp+Math.ceil(p.maxHp*.3));w.torches.push({x:o.x,y:o.y-15,s:0});sfx('chest');burst(o.x,o.y,16,'#edca80',110,.8,2,true);fieldNote('A little warmth. Restored 30% health.',4);saveNow();}}}
  for(const h of w.hazards){h.t-=dt;if(h.t<=0){h.phase=h.phase==='rest'?'warn':h.phase==='warn'?'active':'rest';h.t=h.phase==='warn'?1.15:h.phase==='active'?.35:3.1;if(h.phase==='active'&&d2(p.x,p.y,h.x+h.w/2,h.y)<400**2)sfx('eshoot');}if(h.phase==='active'&&p.x+p.r>h.x&&p.x-p.r<h.x+h.w&&p.y+p.r>h.y&&p.y-p.r<h.y+h.h){hurtPlayer(11,h.x,h.y);if(G.dead)return true;}}
  return false;
}

const beforeHollow={genFloor,setupFloor,startRun,spawnEnemy,damageEnemy,killBoss,update,updateHUD,openChest,die,tryBuyNode,backToMenu,validateSave,validateCheckpoint,snapshotRun,resumeRun,syncSettings,onEscKey,anyBlockingOverlay};
genFloor=function(f){return f<=10?genHollowFloor(f):beforeHollow.genFloor(f);};
setupFloor=function(f){storyQueue=storyQueue.filter(id=>id==='firstDeath'||id==='firstSigil');chapterBannerT=0;T('chapterBanner').classList.remove('visible');if(f<=10)setupHollowFloor(f);else beforeHollow.setupFloor(f);};
startRun=function(){storyQueue=[];dialogue=null;T('conversation').hidden=true;document.body.classList.remove('conversing');hide('chapterClear');hide('memories');beforeHollow.startRun();if(!storyData().seen.arrival)beginDialogue('arrival');};
spawnEnemy=function(type,x,y,elite){const e=beforeHollow.spawnEnemy(type,x,y,elite);if(e.ai==='gate'){const t=ETYPES[type],depth=Math.max(0,G.floor-1);e.hp=e.max=Math.round(t.hp*(1+depth*.11)*(elite?1.55:1));e.balanceVersion=2;e.dmg=Math.round(t.dmg*(1+depth*.045));e.xp=t.xp*(elite?2:1);e.spd=t.spd;e.face=0;e.action='stalk';e.actionT=.8;e.staggerCd=0;}return e;};
damageEnemy=function(e,dmg,ang,crit,kb){
  if(e.warden){if(!e.introduced)return;const a=e.wb;if(a.mode==='break')dmg*=.5;else if(!a.second&&a.mode==='wait'&&Math.abs(angleDiff(ang+Math.PI,a.a))<1.15)dmg*=.45;else if(a.mode==='recover')dmg*=1.3;}
  if(e.type==='gateShield'&&e.action!=='recover'&&Math.abs(angleDiff(ang+Math.PI,e.face||0))<1.15)dmg*=.4;
  beforeHollow.damageEnemy(e,dmg,ang,crit,kb);
};
killBoss=function(b){beforeHollow.killBoss(b);if(b.warden){G.ebul=[];sealWardenArena(false);G.world.wardCleared=true;G.player.hitCd=2;saveNow();}};
update=function(dt){if(G.descending)return;if(hollowBeforeUpdate(dt))return;beforeHollow.update(dt);};
updateHUD=function(dt){beforeHollow.updateHUD(dt);if(G.world.region==='hollow'){
  setTxt('floorObjective',G.boss?(G.boss.introduced?'THE LAST WATCH':'THE HOLLOW GATE · find the last watch'):'THE HOLLOW GATE · explore, then find the portal');
  const o=nearestFixture();if(o){T('promptTxt').textContent=o.kind==='echo'?(storyData().seen[o.id]?'RECALL MEMORY':'LISTEN TO THE ECHO'):o.lit?'THE BRAZIER IS LIT':'LIGHT BRAZIER · RESTORE 30% HEALTH';T('prompt').classList.add('on');}
}};
openChest=function(c){if(!c.hollowGift){beforeHollow.openChest(c);return;}c.opened=true;burst(c.x,c.y,14,'#ffd88a',180,.5,2.4,true);sfx('chest');openLevelup(true);saveNow();};
die=function(){const wasDead=G.dead;beforeHollow.die();if(!wasDead)queueStory('firstDeath');};
tryBuyNode=function(n){const owned=!!save.nodes[n.id];beforeHollow.tryBuyNode(n);if(!owned&&save.nodes[n.id])queueStory('firstSigil');};
backToMenu=function(){hide('memories');hide('chapterClear');T('chapterBanner').classList.remove('visible');T('fieldNote').classList.remove('visible');chapterBannerT=fieldNoteT=0;storyQueue=storyQueue.filter(id=>id==='firstDeath'||id==='firstSigil');beforeHollow.backToMenu();};
anyBlockingOverlay=function(){return beforeHollow.anyBlockingOverlay()||T('memories').classList.contains('open')||!!dialogue;};
onEscKey=function(){if(G.state==='chapter'){hide('chapterClear');setState('playing');clearInput();return;}beforeHollow.onEscKey();};
syncSettings=function(){beforeHollow.syncSettings();T('setTextSpeed').value=String(save.textSpeed??1);T('setDialogueVoice').checked=save.dialogueVoice!==0;};
snapshotRun=function(){
  const state=G.state,from=dialogue?.from;
  if(state==='chapter'||state==='dialogue'&&['playing','paused'].includes(from))G.state='paused';
  try{beforeHollow.snapshotRun();}finally{G.state=state;}
  if(!save.resume||!G.run||!G.world||G.dead||!['playing','paused','levelup','chapter','dialogue','win','winning'].includes(state))return;
  if(state==='dialogue'&&!['playing','paused'].includes(from))return;
  const w=G.world,r=save.resume;
  if(w.region==='hollow')Object.assign(r.world,deepCopy({region:w.region,fixtures:w.fixtures,hazards:w.hazards,hollowDecor:w.hollowDecor,sealed:!!w.sealed,wardCleared:!!w.wardCleared,encounterVersion:w.encounterVersion||0,...(w.layout?{layout:w.layout,arenaDoors:w.arenaDoors,storyRoom:w.storyRoom}:{})}));
  r.dialogue=dialogue&&!dialogue.replay?{id:dialogue.id,index:dialogue.index}:null;r.chapter=state==='chapter';
};
validateSave=function(raw){const clean=beforeHollow.validateSave(raw);clean.textSpeed=[0,1,2].includes(raw.textSpeed)?raw.textSpeed:1;clean.dialogueVoice=raw.dialogueVoice===0?0:1;clean.story={seen:{},choices:{}};
  if(raw.story&&typeof raw.story==='object'){for(const id of Object.keys(HOLLOW_SCENES))if(raw.story.seen?.[id]===true)clean.story.seen[id]=true;for(const [id,s]of Object.entries(HOLLOW_SCENES))s.lines.forEach((l,i)=>{if(!l.choices)return;const n=raw.story.choices?.[id+':'+i];if(Number.isInteger(n)&&n>=0&&n<l.choices.length)clean.story.choices[id+':'+i]=n;});}return clean;};
validateCheckpoint=function(r){
  beforeHollow.validateCheckpoint(r);const fail=()=>{throw Error('Invalid chapter data');},num=(n,lo=-1e6,hi=1e9)=>typeof n==='number'&&Number.isFinite(n)&&n>=lo&&n<=hi;
  const w=r.world;
  if(w.region==='hollow'){
    if(r.floor>10)fail();if(w.layout!==undefined){if(w.layout!=='procedural-v1'||!Number.isInteger(w.storyRoom)||w.storyRoom<0||w.storyRoom>=w.rooms.length||!Array.isArray(w.arenaDoors)||w.arenaDoors.length>200)fail();for(const p of w.arenaDoors)if(!Number.isInteger(p.x)||!Number.isInteger(p.y)||!num(p.x,0,w.W-1)||!num(p.y,0,w.H-1))fail();}for(const k of ['fixtures','hazards','hollowDecor'])if(!Array.isArray(w[k])||w[k].length>100)fail();
    for(const o of [...w.fixtures,...w.hazards,...w.hollowDecor])if(!num(o.x,0,w.W*TILE)||!num(o.y,0,w.H*TILE))fail();
    for(const o of w.fixtures)if(!['echo','brazier'].includes(o.kind)||o.kind==='echo'&&!HOLLOW_SCENES[o.id])fail();
    for(const h of w.hazards)if(!num(h.w,1,1000)||!num(h.h,1,1000)||!num(h.t)||!['rest','warn','active'].includes(h.phase))fail();
    for(const o of w.hollowDecor)if(!['carpet','bed','lampRack','statue','bell','moss','vine','planter','trellis'].includes(o.type)||o.type==='carpet'&&(!num(o.w,1,1000)||!num(o.h,1,1000)))fail();
  }
  for(const e of r.enemies){if(e.ai==='warden'){const b=e.wb;if(!e.warden||!b||!['wait','break','recover','windup','swing','lunge','starFlash','rain'].includes(b.mode)||!['','sweep','double','stars','lunge'].includes(b.kind)||!num(b.t)||!num(b.a)||!num(b.step,0)||!Array.isArray(b.marks)||b.marks.length>6)fail();for(const p of b.marks)if(!num(p.x,0,w.W*TILE)||!num(p.y,0,w.H*TILE))fail();if(b.mode==='rain'&&(!num(b.rainAge,0,10)||b.marks.some(m=>!num(m.delay,0,2)||typeof m.landed!=='boolean')))fail();}
    if(e.ai==='gate'&&(!['stalk','warn','recover','leap'].includes(e.action)||!num(e.actionT)||!num(e.face)))fail();}
  if(r.dialogue&&(!HOLLOW_SCENES[r.dialogue.id]||!Number.isInteger(r.dialogue.index)||r.dialogue.index<0||r.dialogue.index>50))fail();return r;
};
resumeRun=function(){const pending=save.resume?deepCopy(save.resume):null;if(!pending)return;storyQueue=[];dialogue=null;T('conversation').hidden=true;document.body.classList.remove('conversing');beforeHollow.resumeRun();if(!G.run)return;
  if(G.floor<=10&&G.world.region!=='hollow'){
    const drops=G.picks.map(p=>({kind:p.kind,val:p.val}));setupFloor(G.floor);G.pendingLevels=pending.pendingLevels;
    for(const p of drops)spawnPick(p.kind,G.player.x+rand(-20,20),G.player.y+rand(-20,20),p.val);
    if(pending.state==='levelup'&&G.pendingLevels>0){hide('pause');G.restoreCardIds=pending.cardIds;triggerLevelup();}else{setState('playing');pauseGame(true);}
    updateHUD(0);saveNow();return;
  }
  if(pending.dialogue){hide('pause');setState('playing');beginDialogue(pending.dialogue.id,false,pending.dialogue.index);}
  else if(pending.chapter){hide('pause');showChapterClear();}
};
