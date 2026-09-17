const ARCHIVE_MEMORY_VERSION=2;
const ARCHIVE_SIGNAL_KEYS=['witness','shelter','defiance','severance'];
const ARCHIVE_ECHO_IDS=[...Object.keys(TRACE_RECORDS)];

function emptyArchiveMemory(){return{version:ARCHIVE_MEMORY_VERSION,signals:{witness:0,shelter:0,defiance:0,severance:0},echoes:{},skipped:{},guardians:{},guardianOrder:[],rooms:{cleared:0,protected:0,failed:0},flames:{},events:[]};}
function cleanArchiveMemory(raw){
 const out=emptyArchiveMemory(),src=raw&&typeof raw==='object'?raw:{};
 for(const k of ARCHIVE_SIGNAL_KEYS){const n=Number(src.signals?.[k]);out.signals[k]=Number.isFinite(n)?clamp(n,0,999):0;}
 if(src.echoes&&typeof src.echoes==='object')for(const id of ARCHIVE_ECHO_IDS){const q=src.echoes[id];if(!q||typeof q!=='object')continue;out.echoes[id]={seen:!!q.seen,completed:!!q.completed,interrupted:!!q.interrupted,focus:['people','evidence','distance'].includes(q.focus)?q.focus:'distance',dwell:clamp(Number(q.dwell)||0,0,120),visits:clamp(Math.floor(Number(q.visits)||1),1,99),floor:clamp(Math.floor(Number(q.floor)||1),1,100000)};}
 if(src.skipped&&typeof src.skipped==='object')for(const id of ARCHIVE_ECHO_IDS)if(src.skipped[id]===true)out.skipped[id]=true;
 if(src.guardians&&typeof src.guardians==='object')for(const [key,q] of Object.entries(src.guardians)){if(!q||typeof q!=='object')continue;out.guardians[key]={floor:clamp(Math.floor(Number(q.floor)||5),1,100000),method:['distance','close','flare','other'].includes(q.method)?q.method:'other',hits:clamp(Math.floor(Number(q.hits)||0),0,9999),health:clamp(Number(q.health)||0,0,1)};}
 if(Array.isArray(src.guardianOrder))out.guardianOrder=src.guardianOrder.filter(k=>typeof k==='string'&&out.guardians[k]).slice(-30);
 out.rooms={cleared:clamp(Math.floor(Number(src.rooms?.cleared)||0),0,9999),protected:clamp(Math.floor(Number(src.rooms?.protected)||0),0,9999),failed:clamp(Math.floor(Number(src.rooms?.failed)||0),0,9999)};
 if(src.flames&&typeof src.flames==='object')for(const [k,v] of Object.entries(src.flames))if(v===true&&/^\d{1,6}$/.test(k))out.flames[k]=true;
 if(Array.isArray(src.events))out.events=src.events.filter(e=>e&&typeof e.kind==='string'&&Number.isFinite(e.floor)).slice(-80).map(e=>({kind:e.kind,floor:clamp(Math.floor(e.floor),1,100000),detail:typeof e.detail==='string'?e.detail.slice(0,40):''}));
 return out;
}
function archiveData(){const s=storyData();if(!s.archive||s.archive.version!==ARCHIVE_MEMORY_VERSION)s.archive=cleanArchiveMemory(s.archive);return s.archive;}
function archiveEvent(kind,detail='',once=''){
 const a=archiveData();if(once&&a.events.some(e=>e.detail===once))return false;a.events.push({kind,floor:Math.max(1,G.floor||1),detail:once||String(detail).slice(0,40)});if(a.events.length>80)a.events.splice(0,a.events.length-80);return true;
}
function archiveSignal(kind,amount=1,detail='',once=''){
 const a=archiveData();if(!ARCHIVE_SIGNAL_KEYS.includes(kind)||!archiveEvent(kind,detail,once))return false;a.signals[kind]=clamp((a.signals[kind]||0)+amount,0,999);return true;
}
function archiveProfile(){
 const a=archiveData(),rank=[...ARCHIVE_SIGNAL_KEYS].sort((x,y)=>(a.signals[y]||0)-(a.signals[x]||0)),top=rank[0],next=rank[1],recovered=Object.values(a.echoes).filter(e=>e.completed).length,interrupted=Object.values(a.echoes).filter(e=>e.interrupted).length;
 return{...a.signals,dominant:(a.signals[top]||0)>0?top:'witness',confidence:Math.max(0,(a.signals[top]||0)-(a.signals[next]||0)),recovered,interrupted,skipped:Object.keys(a.skipped).length,lastGuardian:a.guardianOrder.at(-1)||''};
}

if(HOLLOW_SCENES.barracks)HOLLOW_SCENES.barracks.lines=[['You','That coat is mine.'],['Wick','It was. Check the left sleeve.'],['You','Why?'],['Wick','You always hid things where the lining tore.']];
if(HOLLOW_SCENES.gardenChoice)HOLLOW_SCENES.gardenChoice.lines=[['You','That is my handwriting.'],['Wick','You ran out of red paint halfway through.'],['You','The back says “even if they ask nicely.”'],['Wick','You added that after somebody asked.']];

const ARCHIVE_LEGACY_KEYS={
 trace13:'reservoirChoice:2',trace18:'foundryChoice:2',trace23:'observatoryChoice:2',trace28:'archiveChoice:2',
 trace33:'courtChoice:2',trace38:'choirChoice:2',trace43:'citadelChoice:2',trace48:'heartChoice:2'
};
const ARCHIVE_LEGACY_MAP={
 trace13:{people:0,evidence:2,distance:1},trace18:{people:1,evidence:0,distance:2},trace23:{people:2,evidence:1,distance:0},trace28:{people:0,evidence:2,distance:1},
 trace33:{people:2,evidence:0,distance:1},trace38:{people:2,evidence:1,distance:0},trace43:{people:1,evidence:0,distance:2},trace48:{people:1,evidence:2,distance:0}
};
for(const sceneId of Object.values(STORY_ANCHORS)){const scene=HOLLOW_SCENES[sceneId];if(scene)scene.lines=scene.lines.filter(line=>!line?.choices);}
const livingStoryChoice=storyChoice;
storyChoice=function(id){const old=livingStoryChoice(id);if(old>=0)return old;const entry=Object.entries(ARCHIVE_LEGACY_KEYS).find(([,key])=>key.startsWith(id+':'));const n=entry?storyData().choices[entry[1]]:undefined;return Number.isInteger(n)?n:-1;};
function rememberLegacyMeaning(id,focus,interrupted=false){const key=ARCHIVE_LEGACY_KEYS[id];if(!key)return;storyData().choices[key]=ARCHIVE_LEGACY_MAP[id]?.[interrupted?'distance':focus]??1;}

const livingValidateSave=validateSave;
validateSave=function(raw){const clean=livingValidateSave(raw);clean.story=clean.story||{seen:{},choices:{}};clean.story.archive=cleanArchiveMemory(raw?.story?.archive);return clean;};

const livingPrepareEchoSanctuaries=prepareEchoSanctuaries;
prepareEchoSanctuaries=function(){
 livingPrepareEchoSanctuaries();const w=G.world;if(!w?.echoSanctuaries?.length)return;const rooms=w.echoSanctuaries.map(i=>w.rooms[i]).filter(Boolean),inside=(o,r)=>o.x>=r.x*TILE&&o.x<(r.x+r.w)*TILE&&o.y>=r.y*TILE&&o.y<(r.y+r.h)*TILE;
 G.enemies=G.enemies.filter(e=>e.isBoss||!rooms.some(r=>inside(e,r)));if(Array.isArray(w.specialEncounters))w.specialEncounters=w.specialEncounters.filter(sc=>!w.echoSanctuaries.includes(sc.roomIndex));
 for(const key of ['hazards','lateHazards'])if(Array.isArray(w[key]))w[key]=w[key].filter(h=>!rooms.some(r=>inside(h,r)));
};

function archiveEchoTargets(id){
 const scene=ECHO_TABLEAUS[id]||ECHO_TABLEAUS.echo1,actors=scene.actors||[],people=actors.length?{x:actors.reduce((n,a)=>n+a.x,0)/actors.length,y:actors.reduce((n,a)=>n+a.y,0)/actors.length-.05}:{x:.42,y:.58},evidence=livingMemoryOpenAnchor(scene,'artifact');
 if(Math.hypot(people.x-evidence.x,people.y-evidence.y)<.19)evidence.x=people.x<.5?.82:.18;return{people:{x:clamp(people.x,.12,.88),y:clamp(people.y,.28,.76)},evidence:{x:clamp(evidence.x,.1,.9),y:clamp(evidence.y,.2,.72)}};
}
function echoFocusLine(id,kind){
 const r=ECHO_REACTIONS[id]||[],fallback=TRACE_RECORDS[id]?.note||TRACE_RECORDS[id]?.description||'';if(!r.length)return{speaker:'The room',text:fallback};
 const q=kind==='people'?r[0]:r[Math.min(1,r.length-1)];return{speaker:q[0],text:q[1]};
}
function echoDisposition(m,interrupted=false){
 if(!m||m.replay||m.wasSeen||m.archiveCommitted)return;m.archiveCommitted=true;const a=archiveData(),dwell=clamp(m.t||0,0,120),focus=m.focus||'distance';a.echoes[m.id]={seen:true,completed:!interrupted,interrupted,focus,dwell,visits:1,floor:G.floor};delete a.skipped[m.id];
 if(interrupted){archiveSignal('severance',2,'memory interrupted','echo:'+m.id+':interrupt');rememberLegacyMeaning(m.id,focus,true);}
 else{archiveSignal('witness',dwell>=7?2:1,'memory witnessed','echo:'+m.id+':witness');if(focus==='people')archiveSignal('shelter',2,'stood with the figures','echo:'+m.id+':people');else if(focus==='evidence')archiveSignal('defiance',1,'studied the evidence','echo:'+m.id+':evidence');else archiveSignal(dwell<3?'severance':'witness',1,'kept distance','echo:'+m.id+':distance');rememberLegacyMeaning(m.id,focus,false);}
 saveNow();
}

const livingMemoryBeats=memoryBeats;
memoryBeats=function(id){const r=TRACE_RECORDS[id];if(!r)return livingMemoryBeats(id);return[{speaker:'Recovered voice',text:r.fragment},{speaker:'What remained',text:r.description}];};
const livingMemoryOpenAnchor=memoryOpenAnchor;
memoryOpenAnchor=function(scene,kind){if(kind==='observer'&&activeMemoryEcho?.observer)return activeMemoryEcho.observer;return livingMemoryOpenAnchor(scene,kind);};

function ensureLivingEchoUI(){
 const stage=T('memoryStage');if(!stage||T('memoryGuidance'))return;const guide=document.createElement('div');guide.id='memoryGuidance';guide.className='memory-guidance';guide.textContent='MOVE OR TAP TO LOOK CLOSER';const found=document.createElement('div');found.id='memoryDiscovery';found.className='memory-discovery';stage.append(guide,found);
}
ensureLivingEchoUI();
const livingUpdateMemoryCaption=updateMemoryCaption;
updateMemoryCaption=function(){livingUpdateMemoryCaption();const m=activeMemoryEcho;if(!m)return;T('memoryAdvance').textContent=m.beat===m.beats.length-1?'RELEASE MEMORY':'WITNESS';};
const livingStartRememberedTrace=startRememberedTrace;
startRememberedTrace=function(id,replay=false){
 const ok=livingStartRememberedTrace(id,replay);if(!ok||!activeMemoryEcho)return ok;const scene=ECHO_TABLEAUS[id]||ECHO_TABLEAUS.echo1,base=livingMemoryOpenAnchor(scene,'observer');Object.assign(activeMemoryEcho,{pending:null,observer:{x:base.x,y:base.y},observerTarget:{x:base.x,y:base.y},focus:null,focusShown:false,disturbed:false,archiveCommitted:false,targets:archiveEchoTargets(id)});const a=archiveData(),old=a.echoes[id];if(old)old.visits=clamp((old.visits||1)+1,1,99);else if(!replay)a.echoes[id]={seen:true,completed:false,interrupted:false,focus:'distance',dwell:0,visits:1,floor:G.floor};
 const stage=T('memoryStage');stage.classList.remove('resonating','echo-ruptured');T('memoryDiscovery').classList.remove('on');T('memoryDiscovery').textContent='';if(!replay)archiveEvent('echo-enter',id,'enter:'+id);return ok;
};

function livingMemoryView(m){
 const rect=memoryRoomRect(m),form=clamp(m.t/1.8,0,1),leave=m.phase==='leaving'?clamp(1-m.leaveT/1.15,0,1):1,p=form*leave,ease=p*p*(3-2*p),side=G.h<560&&G.w>=700;let captionTop=G.h*(G.h<650?.62:.72);try{const r=document.querySelector('.memory-caption')?.getBoundingClientRect?.();if(!side&&r?.top>120)captionTop=Math.min(captionTop,r.top-14);}catch(_){}
 const safeTop=side?48:G.h<650?52:76,safeBottom=side?G.h-18:Math.max(safeTop+180,captionTop-12),safeH=safeBottom-safeTop,safeW=G.w*(side?.50:.88),targetCx=G.w*(side?.265:.5),cx=rect.x+rect.w*.5,cy=rect.y+rect.h*.5,zoom=lerp(1,clamp(Math.min(safeW/Math.max(1,rect.w),safeH/Math.max(1,rect.h)),.86,2.08),ease),displayCx=lerp(cx,targetCx,ease),displayCy=lerp(cy,(safeTop+safeBottom)*.5,ease);return{rect,cx,cy,zoom,displayCx,displayCy,ease};
}
function echoScreenPoint(m,p){const v=livingMemoryView(m),wx=v.rect.x+v.rect.w*p.x,wy=v.rect.y+v.rect.h*p.y;return{x:v.displayCx+(wx-v.cx)*v.zoom,y:v.displayCy+(wy-v.cy)*v.zoom};}
function echoPointFromScreen(m,x,y){const v=livingMemoryView(m),wx=v.cx+(x-v.displayCx)/v.zoom,wy=v.cy+(y-v.displayCy)/v.zoom;return{x:clamp((wx-v.rect.x)/v.rect.w,.08,.92),y:clamp((wy-v.rect.y)/v.rect.h,.3,.86)};}
function revealEchoFocus(m,kind){
 if(m.focus)return;m.focus=kind;m.focusShown=true;const line=echoFocusLine(m.id,kind),box=T('memoryDiscovery');box.textContent=(line.speaker?line.speaker.toUpperCase()+' · ':'')+line.text;box.classList.add('on');T('memoryStage').classList.add('resonating');memorySound(kind==='people'?2:3);setTimeout(()=>{if(activeMemoryEcho===m)box.classList.remove('on');},3100);
}
function disturbEcho(){const m=activeMemoryEcho;if(!m||m.replay||m.disturbed)return;m.disturbed=true;T('memoryStage').classList.add('echo-ruptured');archiveSignal('severance',1,'struck inside a memory','echo:'+m.id+':disturb');sfx('break');}

const livingTickRememberedRoom=tickRememberedRoom;
tickRememberedRoom=function(dt){
 livingTickRememberedRoom(dt);const m=activeMemoryEcho;if(!m||m.phase==='leaving'||!m.observer)return;let mx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),my=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0);mx+=touchInput.moveX||0;my+=touchInput.moveY||0;const len=Math.hypot(mx,my);if(len){mx/=len;my/=len;m.observerTarget.x=clamp(m.observerTarget.x+mx*dt*.34,.08,.92);m.observerTarget.y=clamp(m.observerTarget.y+my*dt*.34,.3,.86);}
 m.observer.x=lerp(m.observer.x,m.observerTarget.x,1-Math.exp(-dt*8));m.observer.y=lerp(m.observer.y,m.observerTarget.y,1-Math.exp(-dt*8));if(m.t>1.15&&!m.focus){for(const kind of ['people','evidence']){const q=m.targets[kind];if(Math.hypot(m.observer.x-q.x,m.observer.y-q.y)<.115){revealEchoFocus(m,kind);break;}}}
};

const livingAdvanceMemory=advanceMemory;
advanceMemory=function(){const m=activeMemoryEcho;if(!m)return;if(m.t<1.05&&!m.replay)archiveSignal('severance',.25,'hurried a memory','echo:'+m.id+':hurry');const leaving=m.beat>=m.beats.length-1&&m.t>=.65;if(leaving)echoDisposition(m,false);livingAdvanceMemory();};
const livingCloseRememberedTrace=closeRememberedTrace;
closeRememberedTrace=function(){if(activeMemoryEcho)echoDisposition(activeMemoryEcho,true);return livingCloseRememberedTrace();};

const livingDrawMemoryRestoration=drawMemoryRestoration;
drawMemoryRestoration=function(ctx){
 livingDrawMemoryRestoration(ctx);const m=activeMemoryEcho;if(!m||m.phase==='leaving'||m.t<.5)return;const t=save.motion?1:G.tAll,h=idHash(m.id),targets=m.targets;ctx.save();ctx.setTransform(G.dpr,0,0,G.dpr,0,0);ctx.globalCompositeOperation='lighter';
 for(const [i,kind] of ['people','evidence'].entries()){if(m.focus&&m.focus!==kind)continue;const p=echoScreenPoint(m,targets[kind]),rr=11+(h+i*7)%8;ctx.strokeStyle=kind==='people'?'#d9f2f2':'#b9d9e8';ctx.globalAlpha=(m.focus===kind?.36:.10)+Math.sin(t*1.7+h+i)*.025;ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,rr+Math.sin(t*1.2+i)*2,(h%9)*.3+t*.08,(h%9)*.3+t*.08+4.7);ctx.stroke();for(let j=0;j<3;j++){const a=t*(j%2?-.25:.19)+j*TAU/3+h*.01,r=rr+7+j*3;ctx.fillStyle=kind==='people'?'#efffff':'#cbe8ef';ctx.globalAlpha=.12+j*.04;ctx.fillRect(p.x+Math.cos(a)*r-1,p.y+Math.sin(a)*r*.55-1,2,2);}}
 if(m.disturbed){ctx.strokeStyle='#d89bbd';for(let i=0;i<7;i++){const a=h*.01+i*TAU/7+t*.08,r=55+i*13;ctx.globalAlpha=.08+i*.018;ctx.beginPath();ctx.moveTo(G.w/2+Math.cos(a)*r,G.h/2+Math.sin(a)*r*.45);ctx.lineTo(G.w/2+Math.cos(a+.2)*(r+30),G.h/2+Math.sin(a+.2)*(r+30)*.45);ctx.stroke();}}
 ctx.restore();
};

T('cv').addEventListener('pointerdown',e=>{if(!activeMemoryEcho||activeMemoryEcho.phase==='leaving')return;const r=G.cv.getBoundingClientRect(),p=echoPointFromScreen(activeMemoryEcho,e.clientX-r.left,e.clientY-r.top);activeMemoryEcho.observerTarget=p;e.preventDefault();},{passive:false});
addEventListener('keydown',e=>{if(!activeMemoryEcho||e.repeat)return;if(['KeyJ','KeyK','KeyR'].includes(e.code)){e.preventDefault();disturbEcho();}},true);

const livingUseRestingFlame=useRestingFlame;
useRestingFlame=function(o){const fresh=!!o&&!o.lit,floor=String(G.floor);livingUseRestingFlame(o);if(fresh&&o.lit&&!archiveData().flames[floor]){archiveData().flames[floor]=true;archiveSignal('shelter',.7,'resting flame tended','flame:'+floor);saveNow();}};
const livingCompleteSpecialEncounter=completeSpecialEncounter;
completeSpecialEncounter=function(sc,success=true){const fresh=sc&&!sc.complete;livingCompleteSpecialEncounter(sc,success);if(!fresh)return;const a=archiveData();a.rooms.cleared++;if(sc.type==='flameguard'){success?a.rooms.protected++:a.rooms.failed++;archiveSignal(success?'shelter':'severance',success?1.5:.75,success?'protected room flame':'lost room flame','room:'+sc.id);}else archiveSignal(sc.type==='hunt'||sc.type==='ambush'?'defiance':'witness',.25,'room cleared','room:'+sc.id);saveNow();};

function archiveAttackMethod(kind=''){if(/melee|flare/.test(kind))return /flare/.test(kind)?'flare':'close';if(/shot|bolt|orbital|star|ricochet/.test(kind))return'distance';return'other';}
const livingDamageEnemy=damageEnemy;
damageEnemy=function(e,dmg,ang,crit,kb,kind='shot'){
 if(e?.isBoss&&e.archiveAdaptation){const method=archiveAttackMethod(kind);if(e.archiveAdaptation===method)dmg*=.86;else if(e.archiveAdaptation==='distance'&&method==='close'||e.archiveAdaptation==='close'&&method==='distance')dmg*=1.06;}
 const before=e?.hp;const out=livingDamageEnemy(e,dmg,ang,crit,kb,kind);if(e&&Number.isFinite(before)&&e.hp<before)e.archiveLastHit={kind:archiveAttackMethod(kind),distance:G.player?Math.hypot(e.x-G.player.x,e.y-G.player.y):0};return out;
};
const livingHurtPlayer=hurtPlayer;
hurtPlayer=function(dmg,sx,sy){const before=G.player?.hp,out=livingHurtPlayer(dmg,sx,sy);if(G.run&&G.boss?.introduced&&G.player&&G.player.hp<before)G.run.archiveGuardianHits=(G.run.archiveGuardianHits||0)+1;return out;};
function guardianArchiveKey(e){return e?.bossKey||e?.name||('floor-'+G.floor);}
const livingKillEnemy=killEnemy;
killEnemy=function(e){
 const eligible=!!(e?.isBoss&&!e.dead&&!G.run?.mode&&!G.run?.infinite),key=guardianArchiveKey(e),method=e?.archiveLastHit?.kind||'other';livingKillEnemy(e);if(!eligible||!e.dead||G.enemies.some(q=>q!==e&&q.isBoss&&!q.dead))return;const a=archiveData(),health=G.player?.maxHp?clamp(G.player.hp/G.player.maxHp,0,1):0,hits=G.run?.archiveGuardianHits||0;a.guardians[key]={floor:G.floor,method,hits,health};a.guardianOrder=a.guardianOrder.filter(k=>k!==key);a.guardianOrder.push(key);if(method==='close'||method==='flare')archiveSignal('defiance',1,'guardian met up close','guardian:'+key);else if(hits<=2)archiveSignal('witness',.75,'guardian read cleanly','guardian:'+key);else if(health<.25)archiveSignal('shelter',.5,'survived guardian','guardian:'+key);G.run.archiveGuardianHits=0;saveNow();
};

function fixtureEchoId(){const list=G.world?.region==='late'?G.world?.lateFixtures:G.world?.fixtures;return list?.find(o=>o.kind==='echo'||o.kind==='trace')?.id||'';}
const livingDescend=descend;
descend=function(){const id=fixtureEchoId();if(id&&G.run&&!G.run.archiveEchoes?.[id]&&!archiveData().echoes[id]&&!archiveData().skipped[id]){archiveData().skipped[id]=true;archiveSignal('severance',.5,'left a memory behind','skip:'+id);}return livingDescend();};
const livingSetupFloor=setupFloor;
setupFloor=function(f){const out=livingSetupFloor(f);if(!G.run||!G.world)return out;G.run.archiveEchoes=G.run.archiveEchoes||{};G.run.archiveGuardianHits=0;prepareEchoSanctuaries();const last=archiveProfile().lastGuardian;for(const b of G.enemies.filter(e=>e.isBoss))b.archiveAdaptation=archiveData().guardians[last]?.method||'';G.world.archiveTemper=archiveProfile().dominant;return out;};
const livingStartTraceAgain=startRememberedTrace;
startRememberedTrace=function(id,replay=false){const ok=livingStartTraceAgain(id,replay);if(ok&&G.run)G.run.archiveEchoes[id]=true;return ok;};

const ARCHIVE_BOSS_LINE={
 witness:'You stop for every room. The Archive has started leaving them open.',
 shelter:'The small flames keep appearing behind you. Someone is following their light.',
 defiance:'Every guardian you strike teaches the next one where you stand.',
 severance:'The rooms go quiet before you enter them now.'
};
const ARCHIVE_BOSS_SPEAKER={wardenBefore:'The Star Warden',matriarchBefore:'The Hollow Matriarch',bellkeeperBefore:'The Bellkeeper',colossusBefore:'The Ember Colossus',astronomerBefore:'The Glass Astronomer',scribeBefore:'The Pale Scribe',regentsBefore:'The First Regent',seraphBefore:'The Void Seraph',tyrantBefore:'The Obsidian Tyrant',keeperBefore:'The First Keeper'};
const livingStoryLines=storyLines;
storyLines=function(id){const lines=livingStoryLines(id),speaker=ARCHIVE_BOSS_SPEAKER[id],p=archiveProfile();if(speaker&&p.recovered+p.skipped>=3)lines.splice(Math.min(2,lines.length),0,{speaker,text:ARCHIVE_BOSS_LINE[p.dominant]});return lines;};

function archiveEndingScene(){const p=archiveProfile(),count=p.recovered,miss=p.skipped,scenes={
 witness:{title:'The rooms you entered',speaker:'Wick',text:`You carried ${count} rooms far enough for them to become memories instead of orders. When the Archive calls for the old Lamplighter, those rooms do not answer.`},
 shelter:{title:'A line of little fires',speaker:'Mara',text:'Resting Flames wake along the route behind you. People cross the dark from one small light to the next. None of them needs to know who lit the first.'},
 defiance:{title:'What the guardians learned',speaker:'The First Keeper',text:'Every guardian changed its stance after watching you. In the end, the lesson they kept was simple: a remembered command can still be refused.'},
 severance:{title:'The rooms left quiet',speaker:'Wick',text:`Some memories stayed below. ${miss||'A few'} doors remain closed when the Archive opens. Wick does not call that failure. He only marks where they are.`}
 };return scenes[p.dominant];}
const livingConfigureEndingScenes=configureEndingScenes;
configureEndingScenes=function(){livingConfigureEndingScenes();const scene=archiveEndingScene();ENDING_SCENES.splice(Math.max(ENDING_SCENES.length-1,0),0,scene);};

const livingDrawStoryConsequences=drawStoryConsequences;
drawStoryConsequences=function(ctx){livingDrawStoryConsequences(ctx);if(!G.world||G.floor<11)return;const p=archiveProfile(),room=G.world.rooms?.[0];if(!room)return;const x=room.cx*TILE+18,y=room.cy*TILE+18,t=save.motion?1:G.tAll;ctx.save();ctx.translate(x,y);ctx.globalAlpha=.28;
 if(p.dominant==='witness'){ctx.strokeStyle='#b9e2e5';for(let i=0;i<Math.min(5,p.recovered);i++){ctx.strokeRect(-58+i*23,-61-(i%2)*5,15,9);ctx.fillStyle='#e8f5ec';ctx.fillRect(-54+i*23,-58-(i%2)*5,7,1);}}
 else if(p.dominant==='shelter'){for(let i=0;i<3;i++){const a=t*.18+i*TAU/3;ctx.fillStyle=i?'#e4c386':'#fff0b0';ctx.fillRect(Math.cos(a)*34-2,-48+Math.sin(a)*8,4,8);}}
 else if(p.dominant==='defiance'){ctx.strokeStyle='#c2abc9';ctx.beginPath();ctx.moveTo(-49,-55);ctx.lineTo(-13,-42);ctx.lineTo(17,-57);ctx.lineTo(51,-44);ctx.stroke();}
 else{ctx.fillStyle='#a7b8c0';for(let i=0;i<4;i++)ctx.fillRect(-43+i*27,-53+(i%2)*7,8,2);}
 ctx.restore();};
