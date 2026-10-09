const SILENT_ECHO_ACTIONS={};
(function(){
 const A=memoryActor,P=memoryProp;
 const scene=(id,actors,props)=>{ECHO_TABLEAUS[id]={mood:'',actors,props};};
 const track=(id,actor,keys)=>{const s=SILENT_ECHO_ACTIONS[id]||(SILENT_ECHO_ACTIONS[id]={duration:12,tracks:[]});s.tracks.push({actor,keys});};
 scene('echo1',[A('warden',.32,.67,'guard'),A('watcher',.67,.67,'walk',-1)],[P('door',.78,.47,46,84),P('table',.24,.63,66),P('slate',.24,.54,30)]);
 track('echo1',0,[[0,.32,.67,'guard'],[3,.43,.67,'offer'],[6,.43,.67,'point'],[9,.19,.67,'walk']]);track('echo1',1,[[0,.78,.67,'walk'],[3,.57,.67,'receive'],[6,.57,.67,'inspect'],[9,.45,.67,'guard']]);
 scene('echo2',[A('lamplighter',.29,.68,'offer'),A('wick',.46,.57,'follow',-1,0,.7)],[P('lamp',.32,.42),P('lamp',.55,.42),P('lamp',.78,.42),P('crate',.18,.72,30)]);
 track('echo2',0,[[0,.29,.68,'offer'],[3,.51,.68,'offer'],[6,.75,.68,'offer'],[9,.82,.68,'walk']]);track('echo2',1,[[0,.46,.57,'follow'],[3,.4,.57,'follow'],[6,.64,.57,'follow'],[9,.74,.57,'follow']]);
 track('echo3',0,[[0,.45,.7,'reach'],[3,.45,.7,'pull'],[6,.45,.7,'pull'],[9,.45,.7,'cheer']]);track('echo3',1,[[0,.62,.66,'help'],[4,.62,.66,'help'],[6,.72,.66,'watch']]);
 track('echo4',0,[[0,.43,.66,'write'],[4,.43,.66,'hold'],[6,.43,.66,'set'],[9,.77,.66,'walk']]);
 track('echo5',0,[[0,.23,.68,'carry'],[3,.36,.68,'wait'],[6,.69,.68,'walk'],[9,.88,.68,'walk']]);track('echo5',1,[[0,.68,.64,'guard'],[3,.61,.64,'pull'],[6,.61,.64,'hold'],[9,.61,.64,'guard']]);
 scene('echo6',[A('gardener',.41,.69,'kneel'),A('gardener',.62,.69,'hold',-1)],[P('sapling',.51,.62,28,68),P('root',.5,.77,120)]);
 track('echo6',0,[[0,.35,.69,'walk'],[2,.41,.69,'kneel'],[6,.41,.69,'repair'],[9,.24,.69,'walk']]);track('echo6',1,[[0,.62,.69,'hold'],[7,.62,.69,'hold'],[9,.77,.69,'walk']]);
 track('echo7',0,[[0,.24,.69,'warn'],[3,.24,.69,'flee'],[9,.08,.69,'flee']]);track('echo7',1,[[0,.49,.68,'reach'],[3,.57,.69,'hold'],[6,.34,.69,'walk'],[9,.1,.69,'walk']]);track('echo7',2,[[0,.67,.72,'watch'],[3,.63,.72,'hide'],[6,.4,.72,'walk'],[9,.15,.72,'walk']]);
 track('echo8',0,[[0,.41,.7,'paint'],[5,.41,.7,'paint'],[6,.32,.7,'inspect'],[8,.32,.7,'repair'],[10,.22,.7,'walk']]);
 scene('echo9',[A('caretaker',.32,.68,'set'),A('wick',.72,.51,'hover',-1,0,.8)],[...Array.from({length:6},(_,i)=>P('pod',.18+i*.125,.64,30)),P('labels',.5,.79,98)]);
 track('echo9',0,[[0,.23,.73,'set'],[3,.41,.73,'set'],[6,.62,.73,'set'],[9,.77,.73,'set']]);track('echo9',1,[[0,.72,.51,'hover'],[5,.72,.51,'hover'],[7,.54,.67,'carry'],[10,.86,.58,'follow']]);
 scene('echo10',[A('gardener',.36,.71,'kneel')],[P('root',.44,.76,130),P('tool',.28,.61,30),P('bed',.69,.62,66),P('door',.18,.5,46,90)]);
 track('echo10',0,[[0,.36,.71,'kneel'],[4,.36,.71,'repair'],[6,.28,.67,'set'],[9,.65,.7,'sit']]);
 track('trace11',0,[[0,.38,.65,'mark'],[5,.38,.65,'mark'],[8,.28,.65,'watch']]);track('trace11',1,[[0,.64,.74,'carry'],[5,.66,.61,'carry'],[8,.66,.61,'set']]);
 track('trace12',0,[[0,.34,.69,'watch'],[3,.4,.69,'brace'],[8,.4,.69,'stand']]);track('trace12',1,[[0,.61,.68,'turn'],[4,.61,.68,'brace'],[6,.61,.68,'turn'],[9,.61,.68,'watch']]);
 scene('trace13',[A('worker',.24,.69,'hold'),A('worker',.6,.69,'hold',-1)],[P('door',.82,.45,48,92),P('stairs',.5,.73,180),P('water',.5,.86,190)]);
 track('trace13',0,[[0,.24,.74,'hold'],[3,.3,.66,'hold'],[4,.3,.68,'duck'],[6,.3,.66,'brace'],[10,.39,.57,'hold']]);track('trace13',1,[[0,.6,.74,'hold'],[3,.66,.66,'hold'],[4,.66,.68,'brace'],[6,.66,.66,'hold'],[10,.75,.57,'hold']]);
 track('trace14',0,[[0,.31,.68,'turn'],[4,.31,.68,'signal'],[9,.31,.68,'watch']]);track('trace14',1,[[0,.52,.64,'watch'],[4,.52,.64,'signal'],[9,.52,.64,'watch']]);track('trace14',2,[[0,.73,.69,'watch'],[5,.73,.69,'turn'],[9,.73,.69,'signal']]);
 track('trace15',0,[[0,.5,.67,'pull'],[8,.5,.67,'pull'],[10,.5,.67,'watch']]);track('trace15',1,[[0,.24,.76,'walk'],[4,.46,.73,'walk'],[8,.76,.63,'walk'],[10,.86,.59,'walk']]);
 track('trace16',0,[[0,.28,.67,'sit'],[3,.28,.67,'offer'],[6,.23,.67,'sit']]);track('trace16',1,[[0,.43,.68,'eat'],[6,.43,.68,'eat']]);track('trace16',2,[[0,.61,.67,'eat'],[4,.61,.67,'receive'],[8,.61,.67,'eat']]);track('trace16',3,[[0,.87,.71,'walk'],[5,.75,.67,'sit'],[9,.75,.67,'eat']]);
 track('trace17',0,[[0,.38,.69,'pull'],[3,.38,.69,'inspect'],[5,.38,.69,'set'],[8,.48,.69,'receive']]);track('trace17',1,[[0,.61,.65,'watch'],[5,.61,.65,'offer'],[8,.61,.65,'watch']]);
 track('trace18',0,[[0,.27,.69,'signal'],[6,.27,.69,'watch'],[9,.27,.69,'signal']]);track('trace18',1,[[0,.49,.67,'watch'],[3,.49,.73,'kneel'],[6,.49,.67,'hold'],[9,.49,.67,'signal']]);
 track('trace19',0,[[0,.37,.68,'inspect'],[3,.37,.68,'hold'],[6,.42,.68,'hold'],[9,.42,.68,'repair']]);track('trace19',1,[[0,.61,.68,'kneel'],[3,.61,.68,'hold'],[6,.66,.68,'hold'],[9,.66,.68,'hold']]);
 scene('trace20',[A('worker',.35,.68,'walk'),A('worker',.58,.67,'walk',1,2),A('worker',.76,.66,'walk',1,1)],[P('rack',.55,.47,130,55),P('pail',.35,.6,24),P('door',.86,.48,50,98),P('furnace',.18,.48,46,64)]);
 track('trace20',0,[[0,.35,.68,'set'],[3,.75,.68,'walk'],[5,.49,.68,'walk'],[7,.35,.68,'carry'],[10,.87,.68,'walk']]);track('trace20',1,[[0,.58,.67,'set'],[5,.88,.67,'walk']]);track('trace20',2,[[0,.76,.66,'set'],[3,.89,.66,'walk']]);
 track('trace21',0,[[0,.29,.68,'eat'],[7,.29,.68,'watch']]);track('trace21',1,[[0,.51,.67,'eat'],[4,.51,.67,'look']]);track('trace21',2,[[0,.86,.67,'walk'],[4,.68,.67,'reach'],[7,.68,.67,'watch'],[10,.19,.67,'walk']]);
 track('trace22',0,[[0,.35,.67,'repair'],[4,.57,.67,'repair'],[6,.57,.67,'wait'],[9,.37,.67,'walk']]);track('trace22',1,[[0,.76,.64,'watch'],[6,.67,.64,'stop'],[8,.67,.64,'turn']]);
 scene('trace23',[A('astronomer',.28,.66,'mark'),A('worker',.63,.72,'carry',-1)],[P('column',.5,.45,28,100),P('chalk',.42,.76,75),P('path',.5,.65,180)]);
 track('trace23',0,[[0,.28,.66,'mark'],[3,.38,.72,'mark'],[6,.64,.72,'mark'],[9,.76,.6,'mark']]);track('trace23',1,[[0,.21,.7,'carry'],[3,.32,.76,'carry'],[6,.57,.76,'carry'],[9,.7,.65,'carry']]);
 scene('trace24',[A('astronomer',.38,.66,'turn'),A('child',.65,.7,'watch',-1,1,.8)],[P('lens',.5,.43,75),P('chair',.59,.73,28),P('map',.25,.56,70)]);
 track('trace24',0,[[0,.38,.66,'turn'],[4,.4,.66,'watch'],[8,.49,.66,'receive']]);track('trace24',1,[[0,.72,.74,'watch'],[4,.6,.65,'look'],[7,.6,.65,'reach'],[9,.6,.65,'hold']]);
 track('trace25',0,[[0,.47,.64,'look'],[5,.47,.64,'watch'],[7,.47,.64,'set'],[9,.29,.64,'walk']]);
 track('trace26',0,[[0,.37,.66,'stamp'],[4,.37,.66,'inspect'],[6,.37,.66,'turn'],[8,.37,.66,'stamp']]);
 track('trace27',0,[[0,.38,.66,'pull'],[3,.38,.66,'read'],[5,.25,.66,'kneel'],[8,.65,.66,'handkey']]);
 track('trace28',0,[[0,.33,.68,'write'],[5,.33,.68,'offer'],[8,.33,.68,'set']]);track('trace28',1,[[0,.6,.66,'read'],[5,.6,.66,'cut'],[7,.73,.66,'hold'],[10,.78,.66,'set']]);
 track('trace29',0,[[0,.31,.68,'hold'],[3,.4,.68,'carry'],[8,.82,.68,'carry']]);track('trace29',1,[[0,.62,.7,'carry'],[4,.5,.7,'set'],[7,.73,.7,'set'],[10,.82,.7,'walk']]);
 track('trace30',0,[[0,.42,.66,'read'],[4,.42,.66,'burn'],[8,.27,.66,'walk']]);track('trace30',1,[[0,.64,.47,'hover'],[3,.52,.57,'reach'],[6,.68,.54,'carry'],[10,.84,.5,'follow']]);
 scene('trace31',[A('servant',.3,.68,'set'),A('servant',.72,.67,'walk',-1,2)],[P('table',.5,.58,170),P('chair',.32,.74,28),P('chair',.6,.74,28),P('door',.85,.47,42,90)]);
 track('trace31',0,[[0,.3,.68,'set'],[4,.61,.68,'count'],[6,.8,.68,'walk'],[9,.65,.68,'carry']]);track('trace31',1,[[0,.83,.67,'walk'],[5,.73,.67,'carry'],[9,.42,.67,'set']]);
 track('trace32',0,[[0,.31,.64,'argue'],[8,.31,.64,'argue']]);track('trace32',1,[[0,.69,.64,'refuse'],[8,.69,.64,'argue']]);track('trace32',2,[[0,.5,.83,'carry'],[4,.5,.69,'set'],[8,.5,.84,'walk']]);
 track('trace33',0,[[0,.26,.65,'seal'],[4,.26,.65,'watch']]);track('trace33',1,[[0,.5,.67,'read'],[6,.5,.67,'sign'],[9,.5,.67,'hold']]);track('trace33',2,[[0,.74,.65,'watch'],[2,.74,.65,'seal'],[4,.74,.65,'watch']]);
 scene('trace34',[A('servant',.46,.71,'kneel'),A('regent',.23,.65,'walk',1,1)],[P('cloth',.51,.76,140),P('door',.8,.48,45,95)]);
 track('trace34',0,[[0,.46,.71,'repair'],[6,.46,.71,'repair'],[9,.46,.71,'watch']]);track('trace34',1,[[0,.23,.65,'walk'],[4,.49,.7,'walk'],[5,.54,.7,'duck'],[7,.62,.64,'walk'],[10,.85,.64,'walk']]);
 scene('trace35',[A('regent',.34,.66,'stand'),A('regent',.68,.66,'stand',-1,3)],[P('cloth',.5,.74,170),P('bell',.19,.42,32)]);
 track('trace35',0,[[0,.34,.66,'stand'],[2,.38,.6,'walk'],[4,.42,.64,'turn'],[5,.42,.64,'watch'],[7,.34,.66,'walk'],[9,.38,.6,'walk'],[11,.42,.64,'turn']]);track('trace35',1,[[0,.68,.66,'stand'],[2,.65,.6,'walk'],[3,.61,.64,'turn'],[5,.61,.64,'wait'],[7,.68,.66,'walk'],[9,.65,.6,'walk'],[11,.61,.64,'turn']]);
 track('trace36',0,[[0,.45,.68,'sit'],[6,.45,.68,'reach'],[9,.51,.59,'walk']]);track('trace36',1,[[0,.61,.48,'hover'],[7,.61,.48,'hover'],[10,.62,.39,'follow']]);
 scene('trace37',[A('singer',.24,.66,'pass'),A('singer',.43,.65,'receive',-1,2),A('singer',.62,.65,'receive',-1,3),A('lamplighter',.79,.67,'wait',-1)],[P('music',.51,.54,145),P('bell',.5,.32,36)]);
 track('trace37',0,[[0,.24,.66,'pass'],[4,.24,.66,'sing']]);track('trace37',1,[[0,.43,.65,'receive'],[3,.43,.65,'pass'],[7,.43,.65,'read']]);track('trace37',2,[[0,.62,.65,'receive'],[5,.62,.65,'read'],[7,.71,.65,'hold']]);track('trace37',3,[[0,.79,.67,'wait'],[8,.79,.67,'read']]);
 scene('trace38',[A('cantor',.34,.66,'ring'),A('lamplighter',.65,.67,'watch',-1)],[P('music',.5,.56,110),P('star',.7,.38,40)]);
 track('trace38',0,[[0,.34,.66,'ring'],[5,.34,.66,'watch'],[9,.34,.66,'hold']]);track('trace38',1,[[0,.65,.67,'watch'],[6,.49,.67,'catch'],[9,.49,.67,'hold']]);
 scene('trace39',[A('seraph',.52,.48,'shield',1,1,1.12),A('singer',.3,.71,'watch',1,2,.86),A('singer',.7,.71,'watch',-1,3,.86)],[P('bell',.5,.28,40),P('feathers',.5,.76,130)]);
 track('trace39',0,[[0,.52,.48,'stand'],[2,.52,.48,'shield'],[8,.52,.48,'shield'],[10,.52,.48,'stand']]);track('trace39',1,[[0,.3,.71,'watch'],[3,.3,.71,'hide'],[8,.16,.74,'duck']]);track('trace39',2,[[0,.7,.71,'watch'],[3,.7,.71,'hide'],[8,.84,.74,'duck']]);
 scene('trace40',[A('cantor',.38,.65,'read'),A('lamplighter',.66,.67,'watch',-1)],[P('notice',.39,.55,34),P('desk',.29,.61,65),P('bell',.8,.36,32)]);
 track('trace40',0,[[0,.38,.65,'read'],[4,.38,.65,'hold'],[7,.29,.65,'set'],[10,.29,.65,'handkey']]);
 track('trace41',0,[[0,.28,.66,'aim'],[3,.38,.66,'brace'],[7,.6,.66,'aim']]);track('trace41',1,[[0,.49,.66,'watch'],[3,.49,.66,'brace'],[7,.71,.66,'aim']]);track('trace41',2,[[0,.74,.68,'watch'],[3,.6,.68,'brace'],[7,.83,.68,'watch']]);
 scene('trace42',[A('worker',.35,.69,'brace'),A('soldier',.67,.65,'pull',-1,1),A('civilian',.18,.74,'wait'),A('civilian',.09,.75,'wait',1,3)],[P('door',.51,.5,72,108),P('chain',.5,.56,105)]);
 track('trace42',0,[[0,.35,.69,'brace'],[9,.35,.69,'brace'],[11,.35,.69,'stand']]);track('trace42',1,[[0,.67,.65,'pull'],[4,.67,.65,'repair'],[8,.67,.65,'stand']]);track('trace42',2,[[0,.18,.74,'wait'],[4,.18,.74,'walk'],[8,.79,.74,'walk'],[10,.88,.74,'walk']]);track('trace42',3,[[0,.09,.75,'wait'],[5,.09,.75,'walk'],[9,.73,.75,'walk'],[11,.83,.75,'walk']]);
 scene('trace43',[A('soldier',.32,.66,'read'),A('lamplighter',.65,.67,'watch',-1)],[P('table',.45,.62,100),P('card',.44,.53,32),P('target',.83,.48,44)]);
 track('trace43',0,[[0,.32,.66,'read'],[3,.7,.66,'set'],[8,.58,.66,'watch']]);track('trace43',1,[[0,.65,.67,'watch'],[5,.75,.67,'reach'],[8,.75,.67,'set']]);
 track('trace44',0,[[0,.36,.68,'repair'],[4,.36,.68,'set'],[8,.36,.68,'repair']]);track('trace44',1,[[0,.65,.67,'brace'],[9,.65,.67,'watch']]);
 track('trace45',0,[[0,.35,.67,'turn'],[5,.35,.67,'turn'],[9,.35,.67,'watch']]);track('trace45',1,[[0,.67,.65,'watch'],[6,.67,.65,'look']]);
 track('trace46',0,[[0,.18,.69,'carry'],[5,.43,.69,'carry'],[8,.43,.69,'set']]);track('trace46',1,[[0,.52,.66,'hold'],[6,.52,.66,'inspect']]);track('trace46',2,[[0,.76,.59,'watch'],[7,.65,.64,'kneel'],[10,.65,.64,'inspect']]);
 scene('trace47',[A('gardener',.23,.65,'watch'),A('wick',.66,.5,'hover',-1,0,.8)],[...Array.from({length:7},(_,i)=>P('pod',.16+i*.11,.7,30)),P('door',.85,.4,42,92)]);
 track('trace47',1,[[0,.66,.5,'hover'],[6,.66,.5,'hover'],[8,.82,.55,'carryflame'],[11,.89,.41,'carryflame']]);
 scene('trace48',[A('vessel',.47,.68,'sit'),A('wick',.69,.49,'hover',-1,0,.8)],[P('bed',.47,.69,80),P('labels',.68,.73,48)]);
 track('trace48',0,[[0,.47,.68,'sit'],[5,.47,.68,'reach'],[9,.47,.68,'stand']]);track('trace48',1,[[0,.69,.49,'hover'],[3,.53,.53,'carry'],[7,.58,.57,'receive'],[10,.72,.55,'follow']]);
 scene('trace49',[A('lamplighter',.31,.68,'walk'),A('warden',.68,.64,'guard',-1),A('lamplighter',.13,.69,'walk')],[P('door',.51,.5,64,105)]);
 ECHO_TABLEAUS.trace49.actors[0].appearance=0;ECHO_TABLEAUS.trace49.actors[2].appearance=0;
 track('trace49',0,[[0,.31,.68,'walk'],[4,.66,.68,'walk'],[7,.74,.68,'watch']]);track('trace49',1,[[0,.68,.64,'pull'],[5,.68,.64,'watch'],[8,.61,.64,'guard']]);track('trace49',2,[[0,.13,.69,'walk'],[5,.38,.69,'walk'],[8,.38,.69,'wait']]);
 track('trace50',0,[[0,.35,.67,'read'],[4,.35,.67,'watch'],[6,.35,.67,'set'],[9,.35,.67,'read']]);track('trace50',1,[[0,.63,.51,'hover'],[3,.5,.53,'reach'],[6,.58,.51,'hover'],[9,.58,.51,'learn']]);
 for(const [id,s]of Object.entries(SILENT_ECHO_ACTIONS)){s.duration=Math.max(11,...s.tracks.flatMap(t=>t.keys.map(k=>k[0]+2)));ECHO_TABLEAUS[id].mood='';}
})();

function sampleMemoryTrack(keys,t){
 let a=keys[0],b=a;for(let i=1;i<keys.length;i++){b=keys[i];if(t<=b[0])break;a=b;}
 const q=b[0]===a[0]?1:clamp((t-a[0])/(b[0]-a[0]),0,1),ease=q*q*(3-2*q);return{x:lerp(a[1],b[1],ease),y:lerp(a[2],b[2],ease),pose:q<.5?a[3]:b[3],fromPose:a[3],toPose:b[3],poseMix:ease,dir:b[1]===a[1]?0:b[1]>a[1]?1:-1};
}
function silentMemoryTime(){return Math.max(0,(activeMemoryEcho?.t||0)-1.8);}
function memoryActionProgress(t,start,end){const q=clamp((t-start)/(end-start),0,1);return q*q*(3-2*q);}
function silentMemoryProps(source,id,t){
 const props=source.props.map(o=>({...o}));for(const o of props){
  if(o.kind==='door')o.open=id==='echo5'?memoryActionProgress(t,1,3)*(1-memoryActionProgress(t,7,9)):id==='trace42'?memoryActionProgress(t,1,3):id==='trace49'?1-memoryActionProgress(t,6,8):0;
  if(o.kind==='lamp'&&id==='echo2')o.lit=t>(o.x<.4?1:o.x<.65?4:7);
  if(o.kind==='chain'&&id==='trace42')o.opacity=1-memoryActionProgress(t,3,6);
  if(o.kind==='hammer'&&id==='trace18')o.y+=t>2&&t<7?-.025:Math.sin(t*2)*.025;
  if(o.kind==='paper'&&id==='trace30')o.opacity=1-memoryActionProgress(t,3,5);
  if(o.kind==='notice'&&id==='trace40')o.opacity=1-memoryActionProgress(t,1,4);
  if(o.kind==='water'&&id==='trace15')o.y-=memoryActionProgress(t,0,10)*.12;
  if(o.kind==='lens'&&id==='trace25')o.covered=memoryActionProgress(t,5,7);
  if(o.kind==='chair'&&id==='trace31'&&o.x>.5){const q=memoryActionProgress(t,5,9);o.x=lerp(.83,.42,q);o.y=.74;}
 }
 return props;
}
const silentDrawMemoryProp=drawMemoryProp;
drawMemoryProp=function(ctx,o,rect,key,t,alpha,index){
 if(o.opacity!==undefined)alpha*=o.opacity;
 if(o.kind==='door'&&o.open){const x=rect.x+rect.w*o.x,y=rect.y+rect.h*o.y,w=o.w||48,h=o.h||48,p=MEMORY_PALETTES[key]||MEMORY_PALETTES.hollow;ctx.save();ctx.globalAlpha=alpha*.78;ctx.fillStyle='#070e15';ctx.fillRect(x-w/2,y-h,w,h);ctx.strokeStyle=p.trim;ctx.lineWidth=2;ctx.strokeRect(x-w/2,y-h,w,h);const leaf=Math.max(4,w*(1-o.open));ctx.fillStyle='#536570';ctx.fillRect(x-w/2,y-h,leaf,h);ctx.fillStyle='#bcd2d4';ctx.fillRect(x-w/2+leaf-4,y-h*.45,3,3);if(o.open<.2){ctx.fillStyle='#a5987d';ctx.fillRect(x-w/2-6,y-h*.45,w+12,4);}ctx.restore();return;}
 if(o.kind==='lamp'&&o.lit===false){const x=rect.x+rect.w*o.x,y=rect.y+rect.h*o.y;ctx.save();ctx.globalAlpha=alpha*.78;ctx.fillStyle='#6c746c';ctx.fillRect(x-9,y-12,18,25);ctx.fillStyle='#18272e';ctx.fillRect(x-6,y-9,12,19);ctx.fillStyle='#b09c77';ctx.fillRect(x-11,y+11,22,3);ctx.restore();return;}
 silentDrawMemoryProp(ctx,o,rect,key,t,alpha,index);
 if(o.covered){const x=rect.x+rect.w*o.x,y=rect.y+rect.h*o.y,w=o.w||48;ctx.save();ctx.globalAlpha=alpha*o.covered*.9;ctx.fillStyle='#566678';ctx.fillRect(x-w/2,y-w/2,w,w);ctx.fillStyle='#91acbb';ctx.fillRect(x-w/2+4,y-w/2+3,3,w-6);ctx.restore();}
};
function leaveSilentMemory(interrupted=false){
 const m=activeMemoryEcho;if(!m||m.phase==='leaving')return false;echoDisposition(m,interrupted);m.phase='leaving';m.leaveT=0;T('memoryStage').classList.add('leaving');clearInput();memorySound(9);return true;
}
advanceMemory=function(){const m=activeMemoryEcho;if(!m||m.t<1.8)return;leaveSilentMemory(silentMemoryTime()<(SILENT_ECHO_ACTIONS[m.id]?.duration||11));};
closeRememberedTrace=function(){return leaveSilentMemory(silentMemoryTime()<(SILENT_ECHO_ACTIONS[activeMemoryEcho?.id]?.duration||11));};
const silentTickRememberedRoom=tickRememberedRoom;
tickRememberedRoom=function(dt){
 silentTickRememberedRoom(dt);const m=activeMemoryEcho;if(!m||m.phase==='leaving')return;T('memoryAdvance').disabled=m.t<1.8;if(silentMemoryTime()>=(SILENT_ECHO_ACTIONS[m.id]?.duration||11))leaveSilentMemory(false);
};
const silentBeginDialogue=beginDialogue;
beginDialogue=function(id,replay=false,index=0,returnState){if(TRACE_RECORDS[id])return startRememberedTrace(id,replay);if(!HOLLOW_SCENES[id]?.lines.length)return false;return silentBeginDialogue(id,replay,index,returnState);};

function drawSilentMemoryAction(ctx,rect,id,t,alpha){
 const at=(x,y)=>({x:rect.x+rect.w*x,y:rect.y+rect.h*y}),pixel=(x,y,w,h,c)=>{const p=at(x,y);ctx.fillStyle=c;ctx.fillRect(Math.round(p.x),Math.round(p.y),w,h);};ctx.save();ctx.globalAlpha=alpha*.8;
 if(id==='echo2'&&t>3){const q=clamp((t-3)/2,0,1),p=at(.64,.71);ctx.fillStyle='#272d35';ctx.fillRect(p.x-18*q,p.y,36*q,4);ctx.fillStyle='#84a9b577';ctx.fillRect(p.x-9*q,p.y+1,18*q,1);}
 if(id==='echo6'){const p=at(.48,.7),grow=clamp(t/4,0,1);ctx.fillStyle='#c2d7d5';ctx.fillRect(p.x-1,p.y-42,3,42);ctx.fillStyle='#9abcb5';ctx.fillRect(p.x-11,p.y-25,3,27);ctx.fillRect(p.x-19,p.y-20,9,3);ctx.fillRect(p.x-8,p.y-15,9,3);if(t>3){ctx.strokeStyle='#e1ebe3';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x-9,p.y-20);ctx.lineTo(p.x+1,p.y-20);ctx.stroke();}ctx.fillStyle='#d8eae7';ctx.fillRect(p.x-1,p.y-44,3,2*grow);}
 if(id==='trace13'){const q=sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[0].keys,t),p=at(q.x+.165,q.y-.11);ctx.fillStyle='#9daead';ctx.fillRect(p.x-42,p.y,84,5);ctx.fillStyle='#d8eff0';ctx.fillRect(p.x-29,p.y-11,54,10);ctx.fillStyle='#f0ffff';ctx.fillRect(p.x+24,p.y-15,11,11);ctx.fillStyle='#60879388';ctx.fillRect(p.x-20,p.y-8,40,3);}
 if(id==='echo7'||id==='trace39'){const start=id==='echo7'?3:4,q=clamp((t-start)/2,0,1);if(t>start){for(let i=0;i<12;i++){const h=idHash(id)+i*31,x=.24+(i%6)*.1,y=.27+q*(.43+(i%3)*.04);pixel(x,y,3+(i%3),4,'#d7f0f4');}if(q===1){ctx.globalAlpha=alpha*.3;for(let i=0;i<7;i++)pixel(.28+i*.07,.76,5,2,'#b5d3de');}}}
 if(id==='trace47'){for(let i=0;i<7;i++){const alive=i===6||t<i*.65+1.5;if(alive){const p=at(.16+i*.11,.65);ctx.fillStyle=i===6?'#ffd491':'#dbfaff';ctx.globalAlpha=alpha*(i===6?.92:.55);ctx.fillRect(p.x-3,p.y-6,6,10);ctx.fillStyle='#fffbe5';ctx.fillRect(p.x-1,p.y-9,3,5);}}}
 if(id==='trace25'&&t>2&&t<8){const p=at(.5,.43);ctx.globalAlpha=alpha*Math.sin((t-2)/6*Math.PI)*.4;ctx.fillStyle='#e2faff';ctx.fillRect(p.x-6,p.y-26,12,9);ctx.fillRect(p.x-8,p.y-15,16,26);ctx.fillRect(p.x-4,p.y+11,3,13);ctx.fillRect(p.x+2,p.y+11,3,13);}
 if(id==='trace29'){for(let i=0;i<22;i++){const y=.24+((t*.21+i*.071)%1)*.48;pixel(.24+(i%9)*.059,y,1,5,'#adcfdc');}for(let i=0;i<3;i++){const p=at(.39+i*.12,.74);ctx.fillStyle='#b7d1d8';ctx.fillRect(p.x-9,p.y-10,18,12);ctx.fillStyle='#5a8495';ctx.fillRect(p.x-7,p.y-8,14,3);}}
 if(id==='trace48'){const p=at(.68,.73);ctx.fillStyle='#cad7d6';ctx.fillRect(p.x-12,p.y-5,24,10);ctx.fillStyle='#89a3af';ctx.fillRect(p.x-9,p.y-2,2,2);ctx.fillRect(p.x+7,p.y-2,2,2);}
 if(id==='trace38'&&t>3){for(let i=0;i<3;i++){const p=at(.47+i*.04,.42-Math.sin((t-3)*.5)*.045);ctx.fillStyle='#dceef0';ctx.fillRect(p.x,p.y,4,4);}ctx.strokeStyle='#b9e1e788';ctx.lineWidth=1;const p=at(.48,.51);for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(p.x,p.y,12+i*7,-.9,.9);ctx.stroke();}}
 if(id==='echo4'&&t>4){const p=at(.43,.62);ctx.fillStyle='#d3e1db';ctx.fillRect(p.x-9,p.y-8,18,5);ctx.fillStyle='#a0b8bd';ctx.fillRect(p.x-3,p.y-15,9,10);ctx.fillStyle='#314955';ctx.fillRect(p.x,p.y-14,5,3);}
 if(id==='echo1'){const a=sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[t<4?0:1].keys,t),p=at(a.x+(t<4?.045:-.045),a.y-.105);ctx.fillStyle='#a6c2cd';ctx.fillRect(p.x-4,p.y-8,8,13);ctx.fillStyle='#ffe2a1';ctx.fillRect(p.x-2,p.y-5,4,8);ctx.fillStyle='#e3f3f0';ctx.fillRect(p.x-5,p.y-9,10,2);if(t>4&&t<8){const q=sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[1].keys,t),c=at(q.x,q.y-.11);ctx.fillStyle='#dff7fb';ctx.fillRect(c.x+3,c.y-4,4,3);}}
 if(id==='trace12'){const p=at(.52,.57);ctx.strokeStyle='#c7dedf';ctx.lineWidth=3;const a=t<3?.2:t<6?.2:.2+memoryActionProgress(t,6,9)*2.3;ctx.beginPath();ctx.arc(p.x,p.y-15,21,0,TAU);ctx.moveTo(p.x-21*Math.cos(a),p.y-15-21*Math.sin(a));ctx.lineTo(p.x+21*Math.cos(a),p.y-15+21*Math.sin(a));ctx.stroke();}
 if(id==='trace14'){for(const [i,x]of [.27,.52,.77].entries()){const p=at(x,.57),q=memoryActionProgress(t,i*2,i*2+2);ctx.strokeStyle='#d5e5e1';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,13,0,TAU);ctx.moveTo(p.x-13*Math.cos(q*1.6),p.y-13*Math.sin(q*1.6));ctx.lineTo(p.x+13*Math.cos(q*1.6),p.y+13*Math.sin(q*1.6));ctx.stroke();}}
 if(id==='trace17'){const q=sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[t<6?0:1].keys,t),p=at(q.x,q.y-.09);ctx.strokeStyle='#d5e9e9';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(p.x-7,p.y+5);ctx.lineTo(p.x+8,p.y-22);ctx.lineTo(p.x+(t<5?17:8),p.y-26);ctx.stroke();}
 if(id==='trace20'){for(let i=0;i<3;i++){const p=at(.45+i*.11,.47);ctx.fillStyle='#bdd5de';ctx.fillRect(p.x-7,p.y-20,14,21);ctx.fillStyle='#e2f4ed';ctx.fillRect(p.x-4,p.y-22,8,3);}}
 if(id==='trace27'&&t>5){const q=sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[0].keys,t),p=at(q.x,q.y-.09);ctx.strokeStyle='#e5e1c8';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x+11,p.y-5,4,0,TAU);ctx.moveTo(p.x+13,p.y-2);ctx.lineTo(p.x+18,p.y+6);ctx.stroke();}
 if(id==='trace41'){const q=memoryActionProgress(t,2,7),p=at(lerp(.42,.7,q),.63),a=lerp(-.9,.65,q);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);ctx.fillStyle='#a3b8bd';ctx.fillRect(-33,-10,66,11);ctx.fillStyle='#e1eee8';ctx.fillRect(-29,-9,40,2);ctx.restore();ctx.fillStyle='#748b96';ctx.fillRect(p.x-15,p.y,30,8);}
 if(id==='trace45'){const p=at(.51,.66),a=memoryActionProgress(t,1,7)*1.2;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(a);ctx.fillStyle='#a7c3c8';ctx.fillRect(-32,-8,64,12);ctx.fillStyle='#e2f1ed';ctx.fillRect(-25,-6,35,2);ctx.restore();}
 if(id==='echo8'&&t>5){const p=at(.51,.53);ctx.fillStyle='#b77777';ctx.fillRect(p.x-21,p.y-25,42,2);ctx.fillRect(p.x-16,p.y-20,32,2);}
 if(id==='echo9'){for(let i=0;i<6;i++){if(t<i*1.15)continue;const p=at(.18+i*.125,.64);ctx.fillStyle='#cedfdc';ctx.fillRect(p.x-4,p.y+4,8,5);}if(t<7){const p=at(.52,.79);ctx.fillStyle='#edcf8c';ctx.fillRect(p.x-5,p.y-5,10,6);}}
 if(id==='trace11'&&t>3){const p=at(.38,.52);ctx.fillStyle='#dff0eb';ctx.fillRect(p.x-7,p.y,14,3);const q=sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[1].keys,t),c=at(q.x,q.y-.075);ctx.fillStyle='#80959b';ctx.fillRect(c.x-12,c.y-10,24,20);ctx.strokeStyle='#bdd5d7';ctx.strokeRect(c.x-12,c.y-10,24,20);}
 if(id==='trace16'&&t>2){const p=at(lerp(.3,.55,memoryActionProgress(t,2,5)),.61);ctx.fillStyle='#dbcdb2';ctx.fillRect(p.x-8,p.y-5,16,6);ctx.fillStyle='#c29c71';ctx.fillRect(p.x-7,p.y-5,14,2);}
 if(id==='trace18'){const q=sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[1].keys,t),p=at(t<5?.52:q.x,t<5?.73:q.y-.08);ctx.fillStyle='#dcc997';ctx.fillRect(p.x-4,p.y-4,8,8);ctx.fillStyle='#705f53';ctx.fillRect(p.x-1,p.y-2,2,4);}
 if(id==='trace19'&&t>2){const q=memoryActionProgress(t,2,6),p=at(.48,.63-.09*q);ctx.fillStyle='#c1d1d0';ctx.fillRect(p.x-15,p.y-5,30,12);ctx.fillStyle='#e5f4ee';ctx.fillRect(p.x-12,p.y-4,24,2);}
 if(id==='trace22'){const p=at(.68,.44);if(t<6){ctx.fillStyle='#c1dedb';ctx.fillRect(p.x-20+t*3,p.y-16,15,8);}else{ctx.strokeStyle='#d9edea';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+Math.cos(memoryActionProgress(t,6,9)*1.5)*29,p.y-30);ctx.stroke();}}
 if(id==='trace23'){ctx.strokeStyle='#dcebea';ctx.lineWidth=2;const q=memoryActionProgress(t,0,9);ctx.beginPath();ctx.moveTo(at(.28,.73).x,at(.28,.73).y);ctx.lineTo(at(.38,.79).x,at(.38,.79).y);if(q>.4)ctx.lineTo(at(.63,.79).x,at(.63,.79).y);if(q>.7)ctx.lineTo(at(.77,.64).x,at(.77,.64).y);ctx.stroke();}
 if(id==='trace26'){const p=at(.51,.53);ctx.fillStyle=t<6?'#ab7f88':'#7b9da2';ctx.fillRect(p.x-6,p.y-2,12,6);ctx.fillStyle='#d4e5df';ctx.fillRect(p.x-3,p.y,6,2);}
 if(id==='trace28'){const p=at(.57,.55);ctx.fillStyle='#d8e7df';ctx.fillRect(p.x-12,p.y-9,24,18);ctx.fillStyle='#6b8a95';for(let i=0;i<4;i++)ctx.fillRect(p.x-8,p.y-5+i*3,16,1);if(t>5){ctx.fillStyle='#1d2e38';for(let i=0;i<3;i++)ctx.fillRect(p.x-7,p.y-4+i*4,14,2);}}
 if(id==='trace30'&&t>3&&t<9){const q=sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[1].keys,t),p=at(q.x,q.y+.02);ctx.fillStyle='#dce8df';ctx.fillRect(p.x+7,p.y-7,15,13);ctx.fillStyle='#7193a1';ctx.fillRect(p.x+10,p.y-3,9,1);}
 if(id==='trace33'){const p=at(.5,.54);for(const [x,delay]of [[-12,1],[10,3]])if(t>delay){ctx.fillStyle='#a98183';ctx.fillRect(p.x+x,p.y-4,7,7);ctx.fillStyle='#e6d8c3';ctx.fillRect(p.x+x+2,p.y-2,3,3);}if(t>6){ctx.strokeStyle='#638897';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x-6,p.y+5);ctx.lineTo(p.x,p.y+3);ctx.lineTo(p.x+7,p.y+5);ctx.stroke();}}
 if(id==='trace34'){const p=at(.51,.76);ctx.fillStyle='#ddedeb';for(let i=0;i<Math.min(12,Math.floor(t*1.4));i++)ctx.fillRect(p.x-33+i*6,p.y-4,3,1);}
 if(id==='trace37'){const q=memoryActionProgress(t,0,7),p=at(lerp(.25,.73,q),.57);ctx.fillStyle='#dceae3';ctx.fillRect(p.x-9,p.y-9,18,13);ctx.fillStyle='#618594';ctx.fillRect(p.x-6,p.y-4,12,1);ctx.fillRect(p.x-6,p.y,9,1);}
 if(id==='trace40'&&t>3&&t<8){const q=sampleMemoryTrack(SILENT_ECHO_ACTIONS[id].tracks[0].keys,t),p=at(q.x,q.y-.09);ctx.fillStyle='#d1e5e0';ctx.fillRect(p.x+8,p.y-4,5,19);ctx.fillStyle='#8fbdc8';ctx.fillRect(p.x+8,p.y+3,5,2);}
 if(id==='trace43'){const p=at(.83,.48);ctx.fillStyle=t<5?'#cedce2':'#b3a78b';ctx.beginPath();ctx.arc(p.x,p.y-22,12,0,TAU);ctx.fill();if(t<5){ctx.fillStyle='#607b8a';ctx.fillRect(p.x-5,p.y-25,3,2);ctx.fillRect(p.x+3,p.y-25,3,2);ctx.fillRect(p.x-2,p.y-20,4,2);}}
 if(id==='trace44'&&t>3){const p=at(.5,.54);ctx.fillStyle='#c6d9d5';ctx.fillRect(p.x-6,p.y-27,17,8);ctx.fillStyle='#83aab6';ctx.fillRect(p.x-5,p.y-25,13,1);}
 if(id==='trace50'){const p=at(.42,.54),q=t>3&&t<6?memoryActionProgress(t,3,4):t>=6?1-memoryActionProgress(t,6,7):0;ctx.strokeStyle='#eef9f4';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y+9);ctx.lineTo(p.x+18*Math.cos(q*Math.PI),p.y-12*Math.sin(q*Math.PI)-5);ctx.stroke();}
 ctx.restore();
}
function drawMemoryPeople(ctx,rect,key,t,alpha){
 const id=activeMemoryEcho?.id||'echo1',source=ECHO_TABLEAUS[id]||ECHO_TABLEAUS.echo1,action=SILENT_ECHO_ACTIONS[id],clock=silentMemoryTime(),scene={...source,props:silentMemoryProps(source,id,clock),actors:source.actors.map(a=>({...a}))};
 for(const track of action?.tracks||[]){const actor=scene.actors[track.actor];if(!actor)continue;const q=sampleMemoryTrack(track.keys,save.motion?Math.floor(clock/3)*3:clock);actor.x=q.x;actor.y=q.y;actor.pose=q.pose;actor.fromPose=q.fromPose;actor.toPose=q.toPose;actor.poseMix=q.poseMix;if(q.dir)actor.dir=q.dir;}
 ctx.save();ctx.beginPath();ctx.rect(rect.x+9,rect.y+9,rect.w-18,rect.h-18);ctx.clip();drawTableauStagecraft(ctx,rect,key,scene,t,alpha);
 const items=[...scene.props.map((o,i)=>({type:'prop',o,i,z:MEMORY_BACK_KINDS.has(o.kind)?-50+o.y*10:['machine','belt','mold'].includes(o.kind)?45:o.y*100+(MEMORY_FRONT_KINDS.has(o.kind)?18:0)})),...scene.actors.map((a,i)=>({type:'actor',a,i,z:a.y*100}))];items.sort((a,b)=>a.z-b.z);
 for(const item of items){if(item.type==='prop')drawMemoryProp(ctx,item.o,rect,key,t,alpha,item.i);else drawMemoryActor(ctx,item.a,rect,key,t,item.i,alpha);}
 drawSilentMemoryAction(ctx,rect,id,clock,alpha);ctx.restore();
};
