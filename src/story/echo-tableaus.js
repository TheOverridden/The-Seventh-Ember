const memoryActor=(role,x,y,pose='stand',dir=1,tone=0,scale=1)=>({role,x,y,pose,dir,tone,scale});
const memoryProp=(kind,x,y,w=0,h=0)=>({kind,x,y,w,h});
const ECHO_TABLEAUS={
 echo1:{mood:'change of watch',actors:[memoryActor('warden',.33,.66,'point',1,0,1.05),memoryActor('watcher',.61,.64,'write',-1,1)],props:[memoryProp('table',.51,.60,92),memoryProp('slate',.51,.52,42)]},
 echo2:{mood:'the east walk',actors:[memoryActor('lamplighter',.35,.65,'offer',1,1),memoryActor('watcher',.63,.66,'receive',-1,2)],props:[memoryProp('shelf',.77,.56,42,74),memoryProp('crate',.23,.69,34)]},
 echo3:{mood:'the supper bell',actors:[memoryActor('child',.45,.70,'pull',1,2),memoryActor('caretaker',.62,.66,'help',-1,0),memoryActor('child',.27,.72,'cheer',1,1,.78)],props:[memoryProp('bell',.48,.35,34),memoryProp('rope',.48,.57,0,105)]},
 echo4:{mood:'before the watch changed',actors:[memoryActor('watcher',.43,.66,'write',1,3),memoryActor('civilian',.77,.64,'leaving',1,1,.9)],props:[memoryProp('table',.42,.61,78),memoryProp('paper',.42,.53,22),memoryProp('door',.84,.56,46,82)]},
 echo5:{mood:'the recognition test',actors:[memoryActor('lamplighter',.37,.66,'knock',1,0,1.05),memoryActor('warden',.68,.64,'guard',-1,2,1.08)],props:[memoryProp('door',.51,.53,62,102),memoryProp('lamp',.22,.54,0,0)]},
 echo6:{mood:'painted leaves',actors:[memoryActor('lamplighter',.35,.71,'kneel',1,1),memoryActor('gardener',.62,.67,'laugh',-1,2),memoryActor('wick',.49,.49,'hover',1,0,.8)],props:[memoryProp('root',.49,.75,135),memoryProp('sign',.77,.54,48)]},
 echo7:{mood:'the glass broke inward',actors:[memoryActor('gardener',.24,.69,'flee',-1,1),memoryActor('caretaker',.49,.68,'carry',-1,0),memoryActor('child',.67,.72,'flee',-1,2,.76)],props:[memoryProp('glass',.52,.31,150),memoryProp('bed',.72,.63,70)]},
 echo8:{mood:'wet red paint',actors:[memoryActor('lamplighter',.41,.70,'paint',1,3),memoryActor('wick',.64,.48,'hover',-1,0,.9)],props:[memoryProp('sign',.51,.53,76),memoryProp('paint',.32,.73,18)]},
 echo9:{mood:'count the names',actors:[memoryActor('lamplighter',.48,.62,'carry',1,1),memoryActor('child',.25,.73,'reach',1,2,.73),memoryActor('child',.37,.76,'reach',1,0,.72),memoryActor('caretaker',.72,.68,'count',-1,2,.92)],props:[memoryProp('bed',.22,.57,58),memoryProp('bed',.78,.58,58),memoryProp('labels',.52,.74,70)]},
 echo10:{mood:'until morning',actors:[memoryActor('lamplighter',.32,.64,'leaving',1,0,1.08),memoryActor('gardener',.63,.68,'hold',-1,1),memoryActor('wick',.45,.46,'follow',1,0,.86)],props:[memoryProp('door',.18,.55,44,86),memoryProp('root',.68,.77,150),memoryProp('tool',.72,.64,30)]},
 trace11:{mood:'the fourth flood line',actors:[memoryActor('engineer',.38,.65,'mark',1,1),memoryActor('worker',.64,.66,'watch',-1,2)],props:[memoryProp('gauge',.32,.49,26,74),memoryProp('water',.53,.79,180)]},
 trace12:{mood:'pump three',actors:[memoryActor('worker',.34,.69,'kick',1,0),memoryActor('engineer',.61,.68,'repair',-1,2)],props:[memoryProp('machine',.51,.57,92,72),memoryProp('pipe',.52,.35,155)]},
 trace13:{mood:'dry socks',actors:[memoryActor('lamplighter',.37,.66,'offer',1,2),memoryActor('worker',.62,.68,'receive',-1,0),memoryActor('child',.76,.72,'watch',-1,1,.7)],props:[memoryProp('crate',.48,.73,42),memoryProp('water',.50,.82,190)]},
 trace14:{mood:'the valve prayer',actors:[memoryActor('engineer',.31,.68,'turn',1,1),memoryActor('worker',.52,.64,'count',1,3),memoryActor('worker',.73,.69,'listen',-1,0)],props:[memoryProp('pipe',.50,.35,190),memoryProp('valve',.27,.57,34),memoryProp('valve',.77,.56,34)]},
 trace15:{mood:'the drowned bell',actors:[memoryActor('bellkeeper',.50,.67,'pull',1,2,1.14),memoryActor('worker',.24,.71,'flee',-1,1,.87)],props:[memoryProp('bell',.51,.34,44),memoryProp('rope',.51,.58,0,112),memoryProp('water',.50,.71,220)]},
 trace16:{mood:'half an hour for lunch',actors:[memoryActor('worker',.28,.67,'sit',1,0),memoryActor('worker',.43,.68,'eat',-1,2),memoryActor('worker',.61,.67,'laugh',1,3),memoryActor('engineer',.75,.67,'sit',-1,1)],props:[memoryProp('table',.51,.62,150),memoryProp('pail',.23,.72,24)]},
 trace17:{mood:'get another hook',actors:[memoryActor('worker',.38,.69,'pull',-1,1),memoryActor('engineer',.61,.65,'warn',-1,2)],props:[memoryProp('furnace',.77,.57,72,84),memoryProp('tool',.40,.59,58)]},
 trace18:{mood:'the lying hammer',actors:[memoryActor('worker',.27,.69,'brace',1,0),memoryActor('lamplighter',.49,.67,'signal',1,2),memoryActor('worker',.72,.69,'duck',-1,3)],props:[memoryProp('machine',.50,.38,180,38),memoryProp('hammer',.64,.51,38,92),memoryProp('belt',.50,.73,205)]},
 trace19:{mood:'the smallest mold',actors:[memoryActor('engineer',.37,.68,'inspect',1,1),memoryActor('worker',.61,.68,'refuse',-1,0)],props:[memoryProp('mold',.48,.64,64),memoryProp('mold',.73,.64,48),memoryProp('furnace',.18,.57,55,74)]},
 trace20:{mood:'break the crown valve',actors:[memoryActor('lamplighter',.35,.65,'handkey',1,2),memoryActor('worker',.63,.67,'receive',-1,1),memoryActor('wick',.47,.43,'hover',1,0,.8)],props:[memoryProp('furnace',.79,.56,68,86),memoryProp('valve',.76,.50,30)]},
 trace21:{mood:'lunch under the orrery',actors:[memoryActor('astronomer',.29,.68,'eat',1,1),memoryActor('astronomer',.51,.67,'laugh',-1,2),memoryActor('worker',.71,.68,'sit',-1,0)],props:[memoryProp('table',.50,.62,145),memoryProp('orrery',.50,.36,88)]},
 trace22:{mood:'lens nine',actors:[memoryActor('astronomer',.35,.67,'write',1,2),memoryActor('lamplighter',.67,.64,'point',-1,0)],props:[memoryProp('table',.37,.62,76),memoryProp('lens',.68,.44,66),memoryProp('ledger',.37,.54,28)]},
 trace23:{mood:'the split path',actors:[memoryActor('lamplighter',.34,.66,'walk',-1,0,1,.94),memoryActor('lamplighter',.66,.66,'walk',1,3,1,.94),memoryActor('wick',.50,.47,'hover',1,0,.82)],props:[memoryProp('path',.50,.65,185),memoryProp('chalk',.50,.74,55)]},
 trace24:{mood:'a coordinate called home',actors:[memoryActor('lamplighter',.34,.68,'mark',1,1),memoryActor('astronomer',.62,.65,'hold',-1,2)],props:[memoryProp('map',.50,.57,122),memoryProp('orrery',.78,.38,55)]},
 trace25:{mood:'the star moved',actors:[memoryActor('astronomer',.47,.64,'look',1,0,1.08),memoryActor('wick',.66,.45,'startle',-1,0,.82)],props:[memoryProp('lens',.50,.40,92),memoryProp('glass',.57,.71,105)]},
 trace26:{mood:'returned tomorrow',actors:[memoryActor('scribe',.37,.66,'stamp',1,1),memoryActor('civilian',.65,.67,'wait',-1,3)],props:[memoryProp('desk',.49,.61,105),memoryProp('paper',.51,.53,34),memoryProp('shelf',.82,.55,42,80)]},
 trace27:{mood:'the restricted shelf',actors:[memoryActor('lamplighter',.38,.66,'read',1,0),memoryActor('scribe',.66,.64,'watch',-1,2)],props:[memoryProp('shelf',.76,.52,55,96),memoryProp('card',.43,.58,24),memoryProp('lamp',.24,.52)]},
 trace28:{mood:'names cut away',actors:[memoryActor('scribe',.33,.68,'redact',1,2),memoryActor('lamplighter',.60,.66,'hold',-1,0),memoryActor('wick',.74,.46,'dim',-1,0,.8)],props:[memoryProp('desk',.47,.62,128),memoryProp('paper',.40,.53,38),memoryProp('paper',.57,.55,32)]},
 trace29:{mood:'rain in aisle six',actors:[memoryActor('scribe',.31,.68,'umbrella',1,1),memoryActor('worker',.62,.70,'carry',-1,3)],props:[memoryProp('shelf',.20,.52,48,100),memoryProp('shelf',.80,.52,48,100),memoryProp('rain',.50,.31,180)]},
 trace30:{mood:'the last sheet',actors:[memoryActor('lamplighter',.42,.66,'burn',1,0),memoryActor('wick',.64,.47,'watch',-1,0,.84)],props:[memoryProp('brazier',.51,.67,38),memoryProp('paper',.42,.55,30),memoryProp('shelf',.80,.54,46,92)]},
 trace31:{mood:'the place kept for you',actors:[memoryActor('servant',.28,.68,'set',1,1),memoryActor('regent',.68,.63,'wait',-1,0,1.04)],props:[memoryProp('table',.51,.62,158),memoryProp('chair',.49,.72,30),memoryProp('banner',.82,.39,34,84)]},
 trace32:{mood:'two seals',actors:[memoryActor('regent',.31,.64,'seal',1,0,1.04),memoryActor('regent',.69,.64,'seal',-1,3,1.04),memoryActor('scribe',.50,.69,'write',1,1,.9)],props:[memoryProp('desk',.50,.61,142),memoryProp('paper',.50,.53,42)]},
 trace33:{mood:'three signatures',actors:[memoryActor('regent',.26,.65,'argue',1,0,1.05),memoryActor('lamplighter',.50,.67,'sign',1,2),memoryActor('regent',.74,.65,'accuse',-1,3,1.05)],props:[memoryProp('table',.50,.62,168),memoryProp('paper',.50,.54,36),memoryProp('banner',.13,.39,30,82),memoryProp('banner',.87,.39,30,82)]},
 trace34:{mood:'outside the vote',actors:[memoryActor('lamplighter',.28,.67,'listen',1,0),memoryActor('servant',.43,.70,'carry',-1,2,.9),memoryActor('regent',.75,.62,'argue',-1,1,1.03)],props:[memoryProp('door',.57,.50,64,104),memoryProp('tray',.43,.59,32)]},
 trace35:{mood:'ceremony by hand',actors:[memoryActor('regent',.36,.64,'ring',1,3,1.06),memoryActor('regent',.66,.64,'bow',-1,0,1.06),memoryActor('servant',.50,.71,'watch',1,1,.86)],props:[memoryProp('bell',.39,.52,34),memoryProp('throne',.76,.55,48,84)]},
 trace36:{mood:'four in, six out',actors:[memoryActor('lamplighter',.45,.68,'kneel',1,0),memoryActor('wick',.61,.48,'breathe',-1,0,.9)],props:[memoryProp('stairs',.50,.67,170),memoryProp('column',.18,.48,28,92),memoryProp('column',.82,.48,28,92)]},
 trace37:{mood:'the hymn in pieces',actors:[memoryActor('singer',.24,.66,'pass',1,1),memoryActor('singer',.43,.65,'receive',-1,2),memoryActor('singer',.62,.65,'pass',1,3),memoryActor('lamplighter',.79,.67,'hold',-1,0)],props:[memoryProp('music',.51,.54,145),memoryProp('bell',.50,.32,36)]},
 trace38:{mood:'a shaped silence',actors:[memoryActor('singer',.34,.66,'sing',1,1),memoryActor('lamplighter',.65,.67,'cut',-1,0),memoryActor('wick',.51,.44,'hush',1,0,.82)],props:[memoryProp('music',.50,.56,128),memoryProp('silence',.51,.40,62)]},
 trace39:{mood:'before the Seraph fell',actors:[memoryActor('seraph',.52,.48,'shield',1,1,1.12),memoryActor('singer',.30,.71,'hide',1,2,.86),memoryActor('singer',.70,.71,'hide',-1,3,.86)],props:[memoryProp('feathers',.50,.71,170),memoryProp('bell',.50,.28,40)]},
 trace40:{mood:'do not sing',actors:[memoryActor('cantor',.38,.65,'hidepaper',1,2),memoryActor('lamplighter',.66,.67,'catch',-1,0)],props:[memoryProp('column',.19,.49,26,94),memoryProp('notice',.39,.55,34),memoryProp('bell',.80,.36,32)]},
 trace41:{mood:'an inward volley',actors:[memoryActor('soldier',.28,.66,'aim',1,1,1.04),memoryActor('soldier',.49,.66,'aim',1,3,1.04),memoryActor('lamplighter',.74,.68,'stop',-1,0)],props:[memoryProp('rack',.16,.55,38,86),memoryProp('target',.86,.49,42)]},
 trace42:{mood:'the door held open',actors:[memoryActor('worker',.35,.69,'brace',1,2),memoryActor('soldier',.67,.65,'pull',-1,1)],props:[memoryProp('door',.51,.50,72,108),memoryProp('chain',.50,.56,105)]},
 trace43:{mood:'people become targets',actors:[memoryActor('soldier',.32,.66,'read',1,3),memoryActor('lamplighter',.65,.67,'refuse',-1,0)],props:[memoryProp('table',.45,.62,100),memoryProp('card',.44,.53,32),memoryProp('target',.83,.48,44)]},
 trace44:{mood:'quiet the king',actors:[memoryActor('engineer',.36,.68,'repair',1,2),memoryActor('worker',.65,.67,'hold',-1,1)],props:[memoryProp('gear',.50,.54,72),memoryProp('machine',.51,.67,142,45),memoryProp('cloth',.49,.49,36)]},
 trace45:{mood:'the crown steers',actors:[memoryActor('engineer',.35,.67,'turn',1,3),memoryActor('soldier',.67,.65,'kneel',-1,1,1.03)],props:[memoryProp('throne',.51,.52,72,95),memoryProp('gear',.51,.65,50),memoryProp('banner',.84,.39,28,84)]},
 trace46:{mood:'the gate taken apart',actors:[memoryActor('worker',.27,.69,'carry',1,1),memoryActor('lamplighter',.52,.66,'inspect',1,0),memoryActor('keeper',.76,.59,'watch',-1,2,1.08)],props:[memoryProp('hinge',.45,.70,48),memoryProp('door',.84,.48,50,104),memoryProp('crate',.17,.72,34)]},
 trace47:{mood:'the seventh leaves',actors:[memoryActor('gardener',.19,.66,'count',1,1),memoryActor('gardener',.78,.66,'hold',-1,3),memoryActor('wick',.52,.48,'carryflame',-1,0,1)],props:[memoryProp('pod',.20,.69,38),memoryProp('pod',.34,.71,38),memoryProp('pod',.66,.71,38),memoryProp('pod',.80,.69,38),memoryProp('root',.50,.78,215)]},
 trace48:{mood:'room for a name',actors:[memoryActor('vessel',.25,.68,'reach',1,0,.95),memoryActor('vessel',.48,.61,'stand',1,2,1.03),memoryActor('vessel',.73,.68,'turn',-1,3,.95),memoryActor('wick',.84,.39,'dim',-1,0,.82)],props:[memoryProp('labels',.50,.75,118),memoryProp('star',.46,.28,52)]},
 trace49:{mood:'two knocks',actors:[memoryActor('lamplighter',.36,.66,'knock',1,0,1.06),memoryActor('keeper',.69,.61,'listen',-1,2,1.1),memoryActor('wick',.50,.43,'hush',1,0,.82)],props:[memoryProp('door',.51,.49,68,112),memoryProp('star',.79,.31,42)]},
 trace50:{mood:'before Wick had a voice',actors:[memoryActor('lamplighter',.35,.67,'read',1,0,1.05),memoryActor('wick',.63,.51,'learn',-1,0,1)],props:[memoryProp('desk',.45,.63,100),memoryProp('book',.42,.54,38),memoryProp('star',.78,.30,48)]}
};

const MEMORY_ROLE_STYLE={
 lamplighter:{coat:'#765b54',trim:'#e1bd78',hair:'#342a2b',skin:'#c99872'},
 warden:{coat:'#596b76',trim:'#d8c58e',hair:'#242733',skin:'#b98267'},
 watcher:{coat:'#465b68',trim:'#9eb2b2',hair:'#4a302a',skin:'#d2a17c'},
 child:{coat:'#8b6571',trim:'#e1bb83',hair:'#4a3027',skin:'#d9a47d'},
 caretaker:{coat:'#6d7162',trim:'#c2b689',hair:'#6a4a38',skin:'#c89470'},
 civilian:{coat:'#6d586f',trim:'#c7a9b8',hair:'#2b2b33',skin:'#b97f64'},
 gardener:{coat:'#637456',trim:'#b9c17d',hair:'#493327',skin:'#c9946e'},
 engineer:{coat:'#665a53',trim:'#d39b5e',hair:'#302d2c',skin:'#c38d69'},
 worker:{coat:'#725048',trim:'#ba885c',hair:'#493329',skin:'#ce966f'},
 bellkeeper:{coat:'#41636e',trim:'#add2cc',hair:'#273842',skin:'#b98266'},
 astronomer:{coat:'#4c6574',trim:'#b9d5cf',hair:'#37334a',skin:'#c89173'},
 scribe:{coat:'#71685b',trim:'#d7c59b',hair:'#393139',skin:'#bd866b'},
 servant:{coat:'#66566d',trim:'#bca9c3',hair:'#332a35',skin:'#c99270'},
 regent:{coat:'#76516c',trim:'#e3be7b',hair:'#372938',skin:'#c78e6e'},
 singer:{coat:'#596681',trim:'#c6d4f3',hair:'#39334b',skin:'#c58e72'},
 cantor:{coat:'#4d5874',trim:'#d2c89f',hair:'#292b3d',skin:'#b98267'},
 soldier:{coat:'#4b4852',trim:'#b47c5e',hair:'#24252c',skin:'#bd8568'},
 keeper:{coat:'#665764',trim:'#f0ce86',hair:'#ddd0ad',skin:'#b9876d'},
 vessel:{coat:'#6d5d69',trim:'#e4bf7e',hair:'#3b3034',skin:'#c89170'}
};
function memoryStyle(a,key,index){
 const shift=(a.tone+index)%4,tones=[
  {coat:'#8fc9d9',trim:'#efffff',shade:'#416d87',ghost:'#c8f4fa',core:'#ffffff'},
  {coat:'#a6d9e3',trim:'#e1fbff',shade:'#527e96',ghost:'#d8f8fb',core:'#f7ffff'},
  {coat:'#83bccf',trim:'#f3ffff',shade:'#3b6681',ghost:'#bcecf5',core:'#ffffff'},
  {coat:'#b2e1e8',trim:'#e8fcff',shade:'#628ba0',ghost:'#d9f8fb',core:'#ffffff'}
 ],tone=tones[shift];return{...tone,hair:tone.shade,skin:tone.ghost};
}
function pixelLimb(ctx,x1,y1,x2,y2,color,width=4){ctx.strokeStyle='#171923';ctx.lineWidth=width+2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function drawMemoryActor(ctx,a,rect,key,t,index,alpha){
 const px=rect.x+rect.w*a.x,py=rect.y+rect.h*a.y,small=a.role==='child',sc=(a.scale||1)*(small?.72:1)*clamp(Math.min(rect.w/360,rect.h/260),.72,1.2),phase=t*3+index*1.71,step=save.motion?0:Math.sin(phase),style=memoryStyle(a,key,index),dir=a.dir||1;
 if(a.role==='wick'){ctx.save();ctx.translate(px,py+(save.motion?0:Math.sin(t*2+index)*4));ctx.globalAlpha=alpha*.92;glowImg('ember',0,0,42,.34);ctx.fillStyle='#fff0b5';ctx.fillRect(-4,-9,8,12);ctx.fillStyle='#e79b59';ctx.fillRect(-7,0,14,10);ctx.fillStyle='#8ec6d4';ctx.fillRect(-2,10,4,3);for(let i=0;i<3;i++){const ang=t*(i%2?-.8:.9)+i*TAU/3;ctx.fillStyle=i%2?'#ffd78a':'#9ed8e0';ctx.fillRect(Math.cos(ang)*15-2,Math.sin(ang)*9-2,4,4);}ctx.restore();return;}
 ctx.save();ctx.translate(Math.round(px),Math.round(py));ctx.scale(dir*sc,sc);ctx.globalAlpha=alpha*.56;ctx.filter='saturate(.62) brightness(1.12)';ctx.shadowColor=(MEMORY_PALETTES[key]||MEMORY_PALETTES.hollow).light;ctx.shadowBlur=7;
 ctx.fillStyle='#05081088';ctx.beginPath();ctx.ellipse(0,4,11,4,0,0,TAU);ctx.fill();ctx.shadowBlur=0;
 let bob=0,lLeg=-4,rLeg=4,lArm={x:-8,y:-9},rArm={x:8,y:-9},handL={x:-8,y:1},handR={x:8,y:1};
 if(a.pose==='walk'||a.pose==='flee'||a.pose==='leaving'){bob=Math.abs(step)*-1;lLeg=-5+step*3;rLeg=5+step*-3;handL={x:-9-step*3,y:-1};handR={x:9+step*3,y:-1};}
 if(['kneel','repair','duck','hide'].includes(a.pose)){bob=7;lLeg=-6;rLeg=7;handL={x:-8,y:3};handR={x:6,y:4};}
 if(['write','stamp','redact','sign','paint','mark','read','inspect','burn'].includes(a.pose)){bob=2;handL={x:-7,y:-1};handR={x:11,y:-3+step};}
 if(['offer','receive','handkey','hold','carry','carryflame'].includes(a.pose)){handL={x:-11,y:-4};handR={x:13,y:-4};}
 if(['point','signal','warn','stop','accuse'].includes(a.pose))handR={x:17,y:-13+step};
 if(['look','watch','listen','reach'].includes(a.pose)){handL={x:-9,y:-4};handR={x:14,y:a.pose==='listen'?-13:-6};}
 if(['pull','help'].includes(a.pose)){handL={x:-4,y:-22};handR={x:5,y:-22+step*2};}
 if(['cheer','sing','shield'].includes(a.pose)){handL={x:-15,y:-16-step};handR={x:15,y:-16+step};}
 if(['argue','refuse','laugh','count','ring','turn','cut','catch'].includes(a.pose)){handL={x:-14,y:-13+step*2};handR={x:13,y:-5-step*2};}
 if(['sit','eat','bow'].includes(a.pose)){bob=5;lLeg=-7;rLeg=7;handL={x:-8,y:-2};handR={x:8,y:-1};}
 if(a.pose==='kick'){lLeg=-5;rLeg=13+step*2;bob=2;}
 if(a.pose==='brace'){lLeg=-8;rLeg=8;handL={x:-14,y:-4};handR={x:14,y:-4};}
 const hipY=-4+bob,shoulderY=-19+bob,headY=-30+bob;
 pixelLimb(ctx,-4,hipY,lLeg,4,style.coat,5);pixelLimb(ctx,4,hipY,rLeg,4,style.coat,5);ctx.fillStyle='#282933';ctx.fillRect(lLeg-4,2,7,4);ctx.fillRect(rLeg-3,2,7,4);
 pixelLimb(ctx,-7,shoulderY,handL.x,handL.y+bob,style.coat,5);pixelLimb(ctx,7,shoulderY,handR.x,handR.y+bob,style.coat,5);
 ctx.fillStyle=style.skin;ctx.fillRect(handL.x-2,handL.y+bob-2,4,4);ctx.fillRect(handR.x-2,handR.y+bob-2,4,4);
 ctx.fillStyle='#171923';ctx.fillRect(-9,shoulderY-2,18,20);ctx.fillStyle=style.coat;ctx.fillRect(-8,shoulderY-1,16,18);ctx.fillStyle=style.trim;ctx.fillRect(-7,shoulderY,14,3);ctx.fillRect(-7,hipY-3,14,2);ctx.fillStyle='#ffffff20';ctx.fillRect(-6,shoulderY+4,2,8);
 if(['lamplighter','watcher','warden','soldier'].includes(a.role)){ctx.fillStyle=style.coat;ctx.beginPath();ctx.moveTo(-8,hipY-2);ctx.lineTo(8,hipY-2);ctx.lineTo(11,2);ctx.lineTo(-10,2);ctx.closePath();ctx.fill();ctx.fillStyle=style.trim;ctx.fillRect(-8,hipY-1,16,2);}
 if(['scribe','singer','cantor','regent','keeper'].includes(a.role)){ctx.fillStyle='#171923';ctx.beginPath();ctx.moveTo(-9,hipY-4);ctx.lineTo(9,hipY-4);ctx.lineTo(13,4);ctx.lineTo(-13,4);ctx.closePath();ctx.fill();ctx.fillStyle=style.coat;ctx.beginPath();ctx.moveTo(-7,hipY-3);ctx.lineTo(7,hipY-3);ctx.lineTo(11,2);ctx.lineTo(-11,2);ctx.closePath();ctx.fill();ctx.fillStyle=style.trim;ctx.fillRect(-10,0,20,2);}
 if(a.role==='worker'||a.role==='engineer'){ctx.fillStyle=style.trim;ctx.fillRect(-11,shoulderY,6,6);ctx.fillRect(5,shoulderY,6,6);ctx.fillRect(-7,shoulderY+5,4,13);ctx.fillRect(3,shoulderY+5,4,13);ctx.fillStyle='#292a30';ctx.fillRect(-8,hipY-2,16,4);ctx.fillStyle='#d8b476';ctx.fillRect(-6,hipY-1,3,2);ctx.fillRect(2,hipY-1,3,2);}
 if(a.role==='gardener'||a.role==='caretaker'){ctx.fillStyle='#c8b68b';ctx.beginPath();ctx.moveTo(-6,shoulderY+4);ctx.lineTo(6,shoulderY+4);ctx.lineTo(9,hipY+2);ctx.lineTo(-9,hipY+2);ctx.closePath();ctx.fill();ctx.fillStyle='#667653';ctx.fillRect(-3,shoulderY+7,6,9);ctx.fillStyle=style.trim;ctx.fillRect(-9,hipY,18,2);}
 if(a.role==='civilian'){ctx.fillStyle=style.trim;ctx.fillRect(-9,shoulderY+2,5,4);ctx.fillRect(4,shoulderY+2,5,4);ctx.fillStyle='#3a3340';ctx.fillRect(-7,hipY-2,5,6);ctx.fillRect(2,hipY-2,5,6);}
 if(a.role==='servant'){ctx.fillStyle='#d7cad2';ctx.fillRect(-8,shoulderY+1,16,4);ctx.fillStyle=style.trim;ctx.beginPath();ctx.moveTo(-5,shoulderY+5);ctx.lineTo(5,shoulderY+5);ctx.lineTo(8,hipY);ctx.lineTo(-8,hipY);ctx.closePath();ctx.fill();}
 if(a.role==='lamplighter'){ctx.fillStyle=style.trim;ctx.fillRect(-9,shoulderY+1,5,13);ctx.fillStyle='#342c32';ctx.fillRect(5,hipY-1,7,7);ctx.fillStyle='#f0cc80';ctx.fillRect(7,hipY+1,3,3);}
 if(a.role==='watcher'){ctx.fillStyle='#394b58';ctx.beginPath();ctx.moveTo(-10,shoulderY);ctx.lineTo(4,shoulderY);ctx.lineTo(-7,hipY+2);ctx.closePath();ctx.fill();ctx.fillStyle=style.trim;ctx.fillRect(-9,shoulderY+1,12,2);}
 if(a.role==='vessel'){ctx.fillStyle=style.trim;ctx.fillRect(-11,shoulderY,22,4);ctx.fillStyle='#4e4654';ctx.beginPath();ctx.moveTo(-10,shoulderY+4);ctx.lineTo(10,shoulderY+4);ctx.lineTo(5,3);ctx.lineTo(0,-1);ctx.lineTo(-5,3);ctx.closePath();ctx.fill();}
 ctx.fillStyle='#171923';ctx.fillRect(-7,headY-1,14,13);ctx.fillStyle=style.skin;ctx.fillRect(-6,headY,12,11);ctx.fillStyle=style.hair;ctx.fillRect(-7,headY-3,14,6);ctx.fillRect(dir>0?-7:4,headY+1,3,7);ctx.fillStyle='#f2d4a0';ctx.fillRect(dir>0?3:-5,headY+3,2,2);ctx.fillStyle='#2b2530';ctx.fillRect(dir>0?5:-6,headY+5,2,2);
 if(a.role==='warden'||a.role==='soldier'){ctx.fillStyle='#303945';ctx.fillRect(-8,headY-4,16,6);ctx.fillStyle=style.trim;ctx.fillRect(-6,headY-3,12,2);}
 if(a.role==='worker'||a.role==='engineer'){ctx.fillStyle='#715b43';ctx.fillRect(-8,headY-4,16,4);ctx.fillStyle=style.trim;ctx.fillRect(1,headY-3,7,2);}
 if(a.role==='lamplighter'){ctx.fillStyle='#302934';ctx.fillRect(-8,headY-5,16,5);ctx.fillRect(-5,headY-8,10,4);ctx.fillStyle=style.trim;ctx.fillRect(-4,headY-7,8,1);ctx.fillStyle='#e5c684';ctx.fillRect(dir>0?6:-8,headY+1,2,7);}
 if(a.role==='watcher'){ctx.fillStyle='#354b59';ctx.fillRect(-8,headY-4,16,4);ctx.fillStyle='#9cc3c5';ctx.fillRect(dir>0?3:-6,headY+3,3,2);}
 if(a.role==='child'){ctx.fillStyle=style.hair;ctx.fillRect(-8,headY,3,8);ctx.fillRect(5,headY,3,8);ctx.fillStyle=style.trim;ctx.fillRect(-10,headY+5,3,3);ctx.fillRect(7,headY+5,3,3);ctx.fillStyle='#f6d6aa';ctx.fillRect(-3,headY+7,2,2);ctx.fillRect(2,headY+7,2,2);}
 if(a.role==='caretaker'){ctx.fillStyle=style.hair;ctx.fillRect(-10,headY-5,7,7);ctx.fillStyle=style.trim;ctx.fillRect(-11,headY-6,5,2);}
 if(a.role==='gardener'){ctx.fillStyle='#667653';ctx.fillRect(-10,headY-5,20,4);ctx.fillRect(-5,headY-9,10,5);ctx.fillStyle='#a7bd79';ctx.fillRect(4,headY-8,5,2);}
 if(a.role==='bellkeeper'){ctx.fillStyle='#334e59';ctx.beginPath();ctx.moveTo(-10,headY+4);ctx.lineTo(-5,headY-8);ctx.lineTo(5,headY-8);ctx.lineTo(10,headY+4);ctx.closePath();ctx.fill();ctx.fillStyle='#a8d3d0';ctx.fillRect(dir>0?3:-6,headY+2,3,3);ctx.fillRect(-11,headY+3,4,7);}
 if(a.role==='astronomer'){ctx.fillStyle='#334b62';ctx.fillRect(-9,headY-5,18,5);ctx.fillStyle='#bce9e8';ctx.strokeStyle='#bce9e8';ctx.strokeRect(dir>0?1:-6,headY+2,5,5);ctx.fillRect(dir>0?6:-9,headY+4,4,1);}
 if(a.role==='scribe'){ctx.fillStyle=style.coat;ctx.beginPath();ctx.moveTo(-9,headY+2);ctx.lineTo(0,headY-7);ctx.lineTo(9,headY+2);ctx.closePath();ctx.fill();ctx.fillStyle=style.skin;ctx.fillRect(-4,headY+2,8,6);}
 if(a.role==='regent'){ctx.fillStyle=style.trim;for(let i=-1;i<=1;i++)ctx.fillRect(i*5-2,headY-8-Math.abs(i)*2,4,7);}
 if(a.role==='singer'||a.role==='cantor'){ctx.fillStyle=style.trim;ctx.fillRect(-10,shoulderY+2,20,3);ctx.fillStyle='#dce6ff';ctx.fillRect(dir>0?7:-10,shoulderY+5,3,9);}
 if(a.role==='gardener'||a.role==='caretaker'){ctx.fillStyle='#b5a77b';ctx.fillRect(-5,shoulderY+5,10,12);ctx.fillStyle='#6e805f';ctx.fillRect(-2,shoulderY+7,4,7);}
 if(a.role==='seraph'){ctx.fillStyle='#aebfe2';for(const side of [-1,1])for(let i=0;i<3;i++){ctx.save();ctx.rotate(side*(.35+i*.18+step*.03));ctx.fillRect(side*(8+i*4),shoulderY-6+i*4,5,23-i*3);ctx.restore();}ctx.strokeStyle='#eadba3';ctx.beginPath();ctx.ellipse(0,headY-9,11,4,0,0,TAU);ctx.stroke();}
 if(a.role==='keeper'){ctx.strokeStyle=style.trim;for(let i=0;i<5;i++){const ang=i*TAU/5+t*.15;ctx.beginPath();ctx.arc(Math.cos(ang)*13,headY+5+Math.sin(ang)*7,3,0,TAU);ctx.stroke();}}
 if(a.role==='vessel'){ctx.fillStyle='#d6c7b2';ctx.fillRect(dir>0?1:-6,headY+2,5,8);ctx.fillStyle=style.trim;ctx.fillRect(dir>0?5:-8,headY+3,2,4);}
 ctx.fillStyle=style.trim;
 if(a.pose==='write'||a.pose==='sign'||a.pose==='redact')ctx.fillRect(handR.x,handR.y+bob-6,2,9);
 if(a.pose==='read'||a.pose==='hidepaper'||a.pose==='mark'||a.pose==='stamp')ctx.fillRect(handR.x-5,handR.y+bob-5,10,7);
 if(a.pose==='offer'||a.pose==='receive'||a.pose==='handkey')ctx.fillRect(8,-11+bob,9,5);
 if(a.pose==='carry'){ctx.fillStyle='#c6ad91';ctx.fillRect(-9,-13+bob,18,10);ctx.fillStyle='#5d4854';ctx.fillRect(-5,-17+bob,10,5);}
 if(a.pose==='carryflame'){ctx.fillStyle='#fff0b7';ctx.fillRect(-4,-15+bob,8,8);glowImg('ember',0,-12+bob,22,.3);}
 if(a.pose==='umbrella'){ctx.fillStyle='#8ea4b2';ctx.fillRect(-1,-31+bob,3,34);ctx.beginPath();ctx.arc(0,-30+bob,16,Math.PI,TAU);ctx.fill();ctx.fillStyle='#d9eef0';ctx.fillRect(-12,-31+bob,4,2);ctx.fillRect(2,-38+bob,4,2);}
 if(a.pose==='guard'||a.pose==='aim'){ctx.fillStyle='#9b8061';ctx.save();ctx.rotate(a.pose==='aim'?-1.2:-.2);ctx.fillRect(-2,-30,4,49);ctx.fillStyle='#d3c39d';ctx.fillRect(-5,-32,10,5);ctx.restore();}
 ctx.filter='none';ctx.globalAlpha=alpha*.34;ctx.fillStyle=(MEMORY_PALETTES[key]||MEMORY_PALETTES.hollow).floor;
 for(let cut=0;cut<4;cut++){const yy=headY+2+((index*11+cut*7)%25);ctx.fillRect(-10+((index+cut)%3)*3,yy,5+(cut%2)*4,2);}
 ctx.globalCompositeOperation='lighter';ctx.fillStyle=(MEMORY_PALETTES[key]||MEMORY_PALETTES.hollow).light;ctx.globalAlpha=alpha*.26;
 for(let shard=0;shard<5;shard++){const drift=save.motion?0:Math.sin(t*1.3+index+shard)*2;ctx.fillRect((shard%2?13:-15)+drift,headY+3+shard*6,shard%3===0?3:2,1+(shard%2));}
 ctx.globalCompositeOperation='source-over';ctx.globalAlpha=alpha*.12;ctx.fillStyle='#ffffff';for(let yy=headY-4;yy<5;yy+=6)ctx.fillRect(-10,yy,20,1);ctx.restore();
}
function drawMemoryProp(ctx,o,rect,key,t,alpha,index){
 const x=rect.x+rect.w*o.x,y=rect.y+rect.h*o.y,p=MEMORY_PALETTES[key]||MEMORY_PALETTES.hollow,w=o.w||48,h=o.h||48;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.globalAlpha=alpha*.78;ctx.strokeStyle=p.trim;ctx.fillStyle=p.wall;ctx.lineWidth=2;
 if(o.kind==='table'||o.kind==='desk'){ctx.fillStyle='#6b5748';ctx.fillRect(-w/2,-8,w,16);ctx.fillStyle='#aa8963';ctx.fillRect(-w/2,-9,w,4);ctx.fillStyle='#3a3130';ctx.fillRect(-w/2+7,8,6,24);ctx.fillRect(w/2-13,8,6,24);}
 else if(o.kind==='slate'||o.kind==='paper'||o.kind==='ledger'||o.kind==='card'||o.kind==='notice'||o.kind==='book'){ctx.fillStyle=o.kind==='slate'?'#35414a':'#d6cbb0';ctx.fillRect(-w/2,-h/4,w,h/2||15);ctx.fillStyle=o.kind==='slate'?'#b7c1bd':'#5a5350';for(let i=0;i<3;i++)ctx.fillRect(-w/2+4,-h/4+4+i*4,w-11-i*4,1);}
 else if(o.kind==='shelf'){ctx.fillStyle='#665443';ctx.fillRect(-w/2,-h,w,h);ctx.fillStyle='#a18461';for(let yy=-h+8;yy<0;yy+=22){ctx.fillRect(-w/2,yy,w,3);for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#9a7a62':'#c3ac80';ctx.fillRect(-w/2+5+i*(w-8)/5,yy-15,4+(i%3),15);}}}
 else if(o.kind==='door'){ctx.fillStyle='#303943';ctx.fillRect(-w/2,-h,w,h);ctx.strokeRect(-w/2,-h,w,h);ctx.fillStyle='#647384';for(let yy=-h+12;yy<-8;yy+=18)ctx.fillRect(-w/2+7,yy,w-14,3);ctx.fillStyle=p.light;ctx.fillRect(w/2-10,-h*.46,4,4);}
 else if(o.kind==='bell'){ctx.fillStyle='#9d7f51';ctx.beginPath();ctx.moveTo(-w/2,0);ctx.lineTo(-w*.32,-w*.52);ctx.quadraticCurveTo(0,-w*.72,w*.32,-w*.52);ctx.lineTo(w/2,0);ctx.closePath();ctx.fill();ctx.fillStyle='#e0c17c';ctx.fillRect(-w/2,0,w,5);ctx.fillRect(-3,4,6,9);}
 else if(o.kind==='rope'){ctx.strokeStyle='#b69a6b';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-h);ctx.quadraticCurveTo(Math.sin(t)*5,-h/2,0,0);ctx.stroke();}
 else if(o.kind==='crate'||o.kind==='pail'||o.kind==='paint'){ctx.fillStyle=o.kind==='paint'?'#82484f':'#705b46';ctx.fillRect(-w/2,-w*.45,w,w*.45);ctx.strokeRect(-w/2,-w*.45,w,w*.45);ctx.fillStyle='#b89363';ctx.fillRect(-w/2+3,-w*.4,w-6,3);}
 else if(o.kind==='lamp'){ctx.fillStyle='#342f35';ctx.fillRect(-4,-10,8,22);ctx.fillStyle='#a07f50';ctx.fillRect(-11,9,22,5);ctx.strokeStyle='#c6aa70';ctx.beginPath();ctx.arc(0,-12,11,Math.PI,TAU);ctx.stroke();ctx.fillStyle='#efc477';ctx.fillRect(-8,-9,16,15);ctx.fillStyle='#fff1b4';ctx.fillRect(-3,-7,6,10);const pulse=.16+(save.motion?0:Math.sin(t*3)*.04);const lg=ctx.createRadialGradient(0,-3,2,0,-3,28);lg.addColorStop(0,'rgba(255,220,145,'+pulse+')');lg.addColorStop(1,'rgba(255,190,100,0)');ctx.fillStyle=lg;ctx.fillRect(-30,-32,60,60);}
 else if(o.kind==='root'){ctx.strokeStyle='#83704d';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-w/2,0);ctx.quadraticCurveTo(-w*.25,-28,0,-5);ctx.quadraticCurveTo(w*.22,18,w/2,-12);ctx.stroke();for(let i=0;i<7;i++){const xx=-w/2+i*w/6;ctx.fillStyle=i%2?'#728a59':'#91a86d';ctx.fillRect(xx,-8-(i%3)*5,11,5);}}
 else if(o.kind==='sign'){ctx.fillStyle='#765c43';ctx.fillRect(-w/2,-34,w,24);ctx.fillStyle='#d5c7a3';ctx.fillRect(-w/2+4,-30,w-8,14);ctx.fillStyle='#5d3b3e';ctx.fillRect(-w*.32,-25,w*.64,2);ctx.fillRect(-w*.25,-20,w*.5,2);ctx.fillStyle='#765c43';ctx.fillRect(-3,-10,6,32);}
 else if(o.kind==='bed'||o.kind==='pod'){ctx.fillStyle=o.kind==='pod'?'#566b61':'#79646f';ctx.fillRect(-w/2,-w*.35,w,w*.35);ctx.strokeRect(-w/2,-w*.35,w,w*.35);ctx.fillStyle=o.kind==='pod'?'#9bb095':'#c8b7a2';ctx.fillRect(-w/2+5,-w*.3,w*.28,w*.2);if(o.kind==='pod'){ctx.fillStyle='#d5c28a';ctx.fillRect(-2,-w*.33,4,w*.25);}}
 else if(o.kind==='labels'){ctx.fillStyle='#806b4c';ctx.fillRect(-w/2,-5,w,10);for(let i=0;i<7;i++){ctx.fillStyle=i===6?'#e5c67c':'#b69a64';ctx.fillRect(-w/2+4+i*(w-8)/7,-3,9,6);}}
 else if(o.kind==='glass'||o.kind==='rain'||o.kind==='feathers'){for(let i=0;i<18;i++){const xx=-w/2+(i*37)%w,yy=o.kind==='rain'?-85+(i*23)%80:-30+(i*19)%40;ctx.fillStyle=o.kind==='feathers'?'#bfcce8':'#a9d7dc';ctx.globalAlpha=alpha*(.18+(i%4)*.12);ctx.save();ctx.translate(xx,yy+(o.kind==='rain'?(t*24+i*3)%24:0));ctx.rotate((i%5-2)*.24);ctx.fillRect(-1,-5,3,o.kind==='feathers'?9:14);ctx.restore();}}
 else if(o.kind==='water'){ctx.strokeStyle='#75acb7';for(let i=0;i<4;i++){ctx.globalAlpha=alpha*(.18+i*.08);ctx.beginPath();ctx.ellipse(0,i*8,w/2-i*12,8,0,0,TAU);ctx.stroke();}}
 else if(o.kind==='pipe'){ctx.strokeStyle='#829394';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(-w/2,0);ctx.lineTo(w/2,0);ctx.stroke();ctx.fillStyle='#b5c4bd';for(let i=-2;i<=2;i++)ctx.fillRect(i*w/5-3,-7,6,14);}
 else if(o.kind==='machine'||o.kind==='belt'){ctx.fillStyle='#4b4848';ctx.fillRect(-w/2,-h,w,h);ctx.strokeRect(-w/2,-h,w,h);ctx.fillStyle='#aa8057';for(let i=0;i<Math.max(3,w/24);i++)ctx.fillRect(-w/2+8+i*22,-h+8,12,6);ctx.fillStyle=p.light;ctx.fillRect(-w/2+8,-h+20,w*.32,3);}
 else if(o.kind==='furnace'||o.kind==='brazier'){ctx.fillStyle='#4e3d38';ctx.fillRect(-w/2,-h,w,h);ctx.strokeRect(-w/2,-h,w,h);ctx.fillStyle='#ff9c55';ctx.fillRect(-w*.3,-h*.62,w*.6,h*.38);ctx.fillStyle='#ffe09a';ctx.fillRect(-w*.15,-h*.58,w*.18,h*.25);glowImg('ember',0,-h*.45,w,.25);}
 else if(o.kind==='valve'||o.kind==='gear'||o.kind==='orrery'){const rad=w/2;ctx.strokeStyle='#b99a61';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-rad*.2,rad,0,TAU);ctx.stroke();for(let i=0;i<8;i++){const a=i*TAU/8+t*(o.kind==='orrery'?.08:0);ctx.beginPath();ctx.moveTo(0,-rad*.2);ctx.lineTo(Math.cos(a)*rad,-rad*.2+Math.sin(a)*rad);ctx.stroke();}}
 else if(o.kind==='gauge'){ctx.fillStyle='#33454d';ctx.fillRect(-w/2,-h,w,h);ctx.strokeRect(-w/2,-h,w,h);ctx.fillStyle='#b9d2cf';for(let i=0;i<6;i++)ctx.fillRect(-w*.25,-h+9+i*10,w*.5,2);ctx.fillStyle='#d2896e';ctx.fillRect(-2,-h+12,4,h*.62);}
 else if(o.kind==='hammer'){ctx.fillStyle='#665045';ctx.fillRect(-5,-h,10,h);ctx.fillStyle='#aa805b';ctx.fillRect(-w/2,-h,w,20);ctx.fillStyle='#e1b777';ctx.fillRect(-w/2+4,-h+3,w*.25,4);}
 else if(o.kind==='mold'){ctx.fillStyle='#786b5f';ctx.fillRect(-w/2,-w*.32,w,w*.32);ctx.fillStyle='#302e31';ctx.beginPath();ctx.ellipse(0,-w*.16,w*.2,w*.09,0,0,TAU);ctx.fill();}
 else if(o.kind==='lens'){ctx.strokeStyle='#a7d4d8';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,-h*.25,w/2,0,TAU);ctx.stroke();ctx.fillStyle='#c8f4f31f';ctx.fill();ctx.fillStyle='#b79a60';ctx.fillRect(-4,0,8,45);}
 else if(o.kind==='path'){ctx.strokeStyle='#bd9d61';ctx.lineWidth=3;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo((i%2?1:-1)*w*.18,-22-i*5,i*w/5,-55);ctx.stroke();}}
 else if(o.kind==='stairs'){for(let i=0;i<8;i++){const sw=w*(.3+i*.075),sy=-i*8;ctx.fillStyle=i===7?'#a798c4':'#5f6577';ctx.fillRect(-sw/2,sy,sw,6);ctx.fillStyle=i===7?'#d9c9ef':'#a9acb8';ctx.fillRect(-sw/2,sy,sw,2);}ctx.globalAlpha*=.35;ctx.fillStyle='#d7c8ed';ctx.fillRect(-w*.43,-58,w*.86,3);}
 else if(o.kind==='map'||o.kind==='music'){ctx.fillStyle='#d2c7ac';ctx.fillRect(-w/2,-28,w,56);ctx.fillStyle=o.kind==='music'?'#566079':'#60584f';for(let i=0;i<5;i++){ctx.fillRect(-w/2+8,-18+i*8,w-16,1);if(o.kind==='music')ctx.fillRect(-w/3+i*w/7,-21+(i%3)*8,3,8);}ctx.fillStyle=p.light;ctx.beginPath();ctx.arc(w*.18,-4,7,0,TAU);ctx.stroke();}
 else if(o.kind==='silence'||o.kind==='star'){ctx.strokeStyle=o.kind==='star'?'#f0d394':'#b1a3ca';for(let i=0;i<5;i++){const rr=(o.w||60)*(.18+i*.1);ctx.globalAlpha=alpha*(.45-i*.06);ctx.beginPath();ctx.arc(0,0,rr,t*(i%2?.12:-.08),TAU*.76+t*(i%2?.12:-.08));ctx.stroke();}}
 else if(o.kind==='banner'){ctx.fillStyle=index%2?'#704f64':'#574d72';ctx.fillRect(-w/2,-h,w,h);ctx.fillStyle=p.trim;ctx.fillRect(-w/2,-h,w,4);ctx.beginPath();ctx.moveTo(-w/2,0);ctx.lineTo(0,-12);ctx.lineTo(w/2,0);ctx.fill();}
 else if(o.kind==='chair'||o.kind==='throne'){ctx.fillStyle=o.kind==='throne'?'#554651':'#5e514a';ctx.fillRect(-w/2,-h,w,h);ctx.fillStyle='#a47c54';ctx.fillRect(-w/2,-h,w,5);ctx.fillRect(-w/2+5,-h+8,w-10,4);}
 else if(o.kind==='column'){ctx.fillStyle='#687287';ctx.fillRect(-w/2,-h,w,h);ctx.fillStyle='#b4ad91';ctx.fillRect(-w/2-4,-h,w+8,6);ctx.fillRect(-w/2-4,-5,w+8,5);}
 else if(o.kind==='rack'){ctx.fillStyle='#5b4e49';ctx.fillRect(-w/2,-h,w,h);for(let i=0;i<5;i++){ctx.save();ctx.translate(-w*.3+i*w*.15,-h*.5);ctx.rotate(-.6);ctx.fillStyle='#b49a72';ctx.fillRect(-2,-25,4,50);ctx.fillStyle='#ddd0ae';ctx.fillRect(-5,-27,10,5);ctx.restore();}}
 else if(o.kind==='target'){ctx.fillStyle='#493f43';ctx.fillRect(-w/2,-w,w,w);for(let i=3;i>0;i--){ctx.strokeStyle=i%2?'#c18b69':'#8c6460';ctx.beginPath();ctx.arc(0,-w/2,i*w/8,0,TAU);ctx.stroke();}}
 else if(o.kind==='chain'){ctx.strokeStyle='#a49b91';for(let i=-4;i<=4;i++){ctx.beginPath();ctx.ellipse(i*11,Math.sin(i)*7,8,4,i%2?.4:-.4,0,TAU);ctx.stroke();}}
 else if(o.kind==='cloth'){ctx.fillStyle='#8c7583';ctx.fillRect(-w/2,-w*.25,w,w*.5);ctx.fillStyle='#c7b1be';for(let i=-2;i<=2;i++)ctx.fillRect(i*w/6,-w*.2,3,w*.4);}
 else if(o.kind==='hinge'||o.kind==='tool'){ctx.fillStyle='#9c8a75';ctx.save();ctx.rotate(-.55);ctx.fillRect(-4,-w/2,8,w);ctx.fillStyle='#d3c6aa';ctx.fillRect(-w*.25,-w/2,w*.5,9);ctx.restore();}
 else if(o.kind==='tray'){ctx.fillStyle='#a18a67';ctx.fillRect(-w/2,-5,w,10);ctx.fillStyle='#dec994';ctx.fillRect(-w*.25,-9,w*.18,4);ctx.fillRect(w*.1,-9,w*.18,4);}
 else if(o.kind==='chalk'){ctx.fillStyle='#35414a';ctx.fillRect(-w/2,-18,w,36);ctx.strokeRect(-w/2,-18,w,36);ctx.strokeStyle='#d8dfd7';ctx.lineWidth=3;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*w*.13+Math.sin(i)*3,10);ctx.quadraticCurveTo(i*w*.1-5,-2,i*w*.14,-12);ctx.stroke();}ctx.fillStyle='#e8e3ca';ctx.save();ctx.rotate(-.28);ctx.fillRect(-13,9,25,4);ctx.restore();}
 ctx.restore();
}
drawMemoryPeople=function(ctx,rect,key,t,alpha,floor){
 const scene=ECHO_TABLEAUS[activeMemoryEcho?.id]||ECHO_TABLEAUS.echo1;
 ctx.save();ctx.beginPath();ctx.rect(rect.x+9,rect.y+9,rect.w-18,rect.h-18);ctx.clip();
 scene.props.forEach((o,i)=>drawMemoryProp(ctx,o,rect,key,t,alpha,i));
 [...scene.actors].sort((a,b)=>a.y-b.y).forEach((a,i)=>drawMemoryActor(ctx,a,rect,key,t,i,alpha));
 const p=MEMORY_PALETTES[key]||MEMORY_PALETTES.hollow;ctx.font='9px system-ui';ctx.textAlign='left';ctx.fillStyle=p.light;ctx.globalAlpha=alpha*.52;ctx.fillText(scene.mood.toUpperCase(),rect.x+18,rect.y+rect.h-17);
 for(let i=0;i<12;i++){const seed=idHash(activeMemoryEcho?.id||'echo')+i*71,px=rect.x+18+(seed*17)%Math.max(20,rect.w-36),py=rect.y+18+(seed*29)%Math.max(20,rect.h-45);ctx.fillStyle=i%2?p.light:activeMemoryEcho?.record.color;ctx.globalAlpha=alpha*(.08+(i%4)*.045);ctx.fillRect(px,py,2,1);}
 ctx.restore();
};

const MEMORY_GHOST_SURFACE=document.createElement('canvas');MEMORY_GHOST_SURFACE.width=80;MEMORY_GHOST_SURFACE.height=92;
function memoryPixelLine(x,x1,y1,x2,y2,color,size=2){
 const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1),1);x.fillStyle=color;
 for(let i=0;i<=steps;i++){const q=i/steps;x.fillRect(Math.round(lerp(x1,x2,q)-size/2),Math.round(lerp(y1,y2,q)-size/2),size,size);}
}
function memoryJointedLimb(x,points,color,size=3){
 for(let i=1;i<points.length;i++)memoryPixelLine(x,points[i-1][0],points[i-1][1],points[i][0],points[i][1],'#416d87',size+2);
 for(let i=1;i<points.length;i++)memoryPixelLine(x,points[i-1][0],points[i-1][1],points[i][0],points[i][1],color,size);
}
function memoryPoseSpec(pose,step){
 const s=step,walk=['walk','leaving','flee','follow'].includes(pose),spec={bob:0,lean:0,lf:[-6,0],rf:[6,0],lh:[-12,-17],rh:[12,-17],le:[-11,-26],re:[11,-26]};
 if(walk){spec.bob=-Math.abs(s);spec.lean=pose==='flee'?3:0;spec.lf=[-8+s*5,0];spec.rf=[8-s*5,0];spec.lh=[-14-s*4,-18];spec.rh=[14+s*4,-18];}
 if(['kneel','repair','duck','hide','inspect','paint'].includes(pose)){spec.bob=8;spec.lf=[-10,0];spec.rf=[8,-4];spec.lh=[-12,-7];spec.rh=[10,-5];spec.le=[-14,-17];spec.re=[13,-16];}
 if(['write','stamp','redact','sign','mark','set','seal'].includes(pose)){spec.bob=2;spec.lh=[-8,-18];spec.rh=[13,-19+s];spec.le=[-9,-24];spec.re=[8,-25];}
 if(['read','hidepaper','hold','learn'].includes(pose)){spec.lh=[-8,-21];spec.rh=[8,-21];spec.le=[-12,-24];spec.re=[12,-24];}
 if(['offer','receive','handkey','pass'].includes(pose)){spec.lh=[-12,-19];spec.rh=[18,-22];spec.le=[-11,-25];spec.re=[11,-25];}
 if(['point','signal','warn','stop','accuse','reach'].includes(pose)){spec.lh=[-12,-16];spec.rh=[21,-32+s];spec.le=[-11,-25];spec.re=[10,-27];}
 if(['look','watch','listen','startle'].includes(pose)){spec.lh=[-13,-18];spec.rh=[14,pose==='listen'?-38:-25];spec.le=[-12,-25];spec.re=[10,-29];}
 if(['pull','help','ring','turn'].includes(pose)){spec.lh=[2,-40];spec.rh=[9,-36+s*2];spec.le=[-7,-28];spec.re=[11,-28];}
 if(['cheer','sing','shield'].includes(pose)){spec.lh=[-20,-36-s];spec.rh=[20,-36+s];spec.le=[-13,-29];spec.re=[13,-29];}
 if(['argue','refuse','laugh','count','cut','catch'].includes(pose)){spec.lh=[-18,-29+s*2];spec.rh=[17,-20-s*2];spec.le=[-12,-25];spec.re=[12,-26];}
 if(['sit','eat','bow'].includes(pose)){spec.bob=8;spec.lf=[-12,-1];spec.rf=[13,-1];spec.lh=[-9,-14];spec.rh=[9,pose==='eat'?-27:-15];spec.le=[-12,-21];spec.re=[12,-21];spec.lean=pose==='bow'?5:0;}
 if(pose==='kick'){spec.bob=3;spec.lf=[-7,0];spec.rf=[21+s*2,-11];}
 if(pose==='brace'){spec.lf=[-12,0];spec.rf=[12,0];spec.lh=[-20,-21];spec.rh=[20,-21];spec.le=[-13,-27];spec.re=[13,-27];}
 if(pose==='knock'){spec.rh=[20,-31+s*2];spec.re=[11,-28];}
 if(['carry','carryflame'].includes(pose)){spec.lh=[-12,-23];spec.rh=[12,-23];spec.le=[-13,-27];spec.re=[13,-27];}
 if(pose==='aim'){spec.lh=[13,-27];spec.rh=[20,-31];spec.le=[4,-27];spec.re=[12,-29];}
 if(pose==='guard'){spec.lh=[-14,-23];spec.rh=[12,-15];spec.le=[-11,-28];spec.re=[10,-24];}
 return spec;
}
function memoryGhostTorso(x,role,style,shoulder,sy,hy,seed){
 const robe=['scribe','singer','cantor','regent','keeper'].includes(role),uniform=['lamplighter','watcher','warden','soldier'].includes(role);
 x.fillStyle=style.shade;x.fillRect(-shoulder-2,sy-2,shoulder*2+4,5);x.fillRect(-shoulder-1,sy+2,shoulder*2+2,hy-sy+4);
 x.fillStyle=style.coat;x.fillRect(-shoulder,sy,shoulder*2,5);x.fillRect(-shoulder+2,sy+5,shoulder*2-4,hy-sy-3);
 if(robe){x.fillStyle=style.shade;for(let y=hy-1,w=shoulder+1;y<=1;y+=4,w++){x.fillRect(-w-1,y,w*2+2,5);}x.fillStyle=style.coat;for(let y=hy,w=shoulder;y<=0;y+=4,w++){x.fillRect(-w,y,w*2,4);}x.fillStyle=style.trim;x.fillRect(-shoulder-1,-1,(shoulder+1)*2,2);}
 if(uniform){x.fillStyle=style.coat;x.fillRect(-shoulder-2,hy-1,shoulder*2+4,4);x.fillRect(-shoulder-3,hy+3,5,8);x.fillRect(shoulder-2,hy+3,5,8);x.fillStyle=style.trim;x.fillRect(-shoulder,hy-1,shoulder*2,2);}
 x.fillStyle=style.trim;x.fillRect(-shoulder+1,sy+1,shoulder*2-2,2);x.fillRect(-shoulder+2,hy-3,shoulder*2-4,2);
 x.globalAlpha=.42;x.fillStyle=style.core;x.fillRect(-2,sy+4,4,Math.max(5,hy-sy-7));x.globalAlpha=1;
 if(seed%2){x.fillStyle='#ffffff99';x.fillRect(-shoulder+2,sy+5,2,Math.max(4,hy-sy-9));}
}
function memoryGhostFace(x,role,style,headY,seed){
 x.fillStyle=style.shade;x.fillRect(-8,headY-2,16,16);x.fillStyle=style.ghost;x.fillRect(-6,headY,12,12);x.fillRect(-7,headY+3,14,6);x.fillStyle=style.core;x.fillRect(-3,headY+1,6,8);
 x.fillStyle=style.coat;const hair=seed%5;
 if(hair===0){x.fillRect(-8,headY-4,16,5);x.fillRect(-9,headY,3,8);}
 else if(hair===1){x.fillRect(-7,headY-5,14,5);x.fillRect(5,headY-1,4,7);}
 else if(hair===2){x.fillRect(-8,headY-3,16,4);x.fillRect(-9,headY+1,3,5);x.fillRect(6,headY+1,3,5);}
 else if(hair===3){x.fillRect(-7,headY-5,14,5);x.fillRect(-10,headY-2,4,8);}
 else{x.fillRect(-8,headY-2,16,3);x.fillRect(-6,headY-6,5,5);x.fillRect(1,headY-7,6,6);}
 x.fillStyle=style.core;x.fillRect(-4,headY+5,3,2);x.fillRect(3,headY+5,3,2);x.globalAlpha=.45;x.fillRect(-2,headY+10,4,1);x.globalAlpha=1;
 if(role==='child'){x.fillStyle=style.coat;x.fillRect(-11,headY+2,4,5);x.fillRect(7,headY+2,4,5);x.fillStyle=style.trim;x.fillRect(-12,headY+1,3,2);x.fillRect(9,headY+1,3,2);}
 if(role==='caretaker'){x.fillStyle=style.coat;x.fillRect(-11,headY-6,7,7);x.fillStyle=style.trim;x.fillRect(-12,headY-6,5,2);}
 if(role==='gardener'){x.fillStyle=style.shade;x.fillRect(-11,headY-5,22,4);x.fillRect(-6,headY-9,12,5);x.fillStyle=style.trim;x.fillRect(4,headY-8,6,2);}
 if(role==='worker'||role==='engineer'){x.fillStyle=style.shade;x.fillRect(-10,headY-5,20,5);x.fillStyle=style.trim;x.fillRect(1,headY-4,8,2);}
 if(role==='warden'||role==='soldier'){x.fillStyle=style.shade;x.fillRect(-10,headY-5,20,6);x.fillStyle=style.trim;x.fillRect(-7,headY-4,14,2);}
 if(role==='lamplighter'){x.fillStyle=style.shade;x.fillRect(-9,headY-6,18,6);x.fillRect(-5,headY-10,10,5);x.fillStyle=style.trim;x.fillRect(-4,headY-9,8,1);x.fillRect(7,headY+2,2,8);}
 if(role==='watcher'){x.fillStyle=style.shade;x.fillRect(-9,headY-5,18,5);x.fillStyle=style.core;x.fillRect(2,headY+4,4,2);}
 if(role==='bellkeeper'){x.fillStyle=style.shade;x.fillRect(-10,headY-4,20,9);x.fillRect(-6,headY-10,12,7);x.fillStyle=style.core;x.fillRect(3,headY+3,3,3);x.fillRect(-12,headY+2,4,8);}
 if(role==='astronomer'){x.fillStyle=style.shade;x.fillRect(-10,headY-6,20,6);x.strokeStyle=style.core;x.strokeRect(1,headY+3,6,6);x.fillStyle=style.core;x.fillRect(7,headY+5,4,1);}
 if(role==='scribe'){x.fillStyle=style.coat;for(let y=0;y<5;y++)x.fillRect(-10+y,headY-7+y,20-y*2,2);x.fillStyle=style.ghost;x.fillRect(-4,headY+3,8,7);}
 if(role==='regent'){x.fillStyle=style.trim;for(let i=-1;i<=1;i++)x.fillRect(i*6-2,headY-11-Math.abs(i)*2,4,10);}
 if(role==='vessel'){x.fillStyle=style.core;x.fillRect(1,headY+2,6,10);x.fillStyle=style.trim;x.fillRect(6,headY+4,2,5);}
}
function memoryHeldDetail(x,a,spec,style,bob){
 const pose=a.pose;x.fillStyle=style.trim;
 if(['write','sign','redact','mark'].includes(pose)){memoryPixelLine(x,spec.rh[0],spec.rh[1]+bob,spec.rh[0]+2,spec.rh[1]-9+bob,style.core,2);}
 if(['read','hidepaper','stamp','set','seal'].includes(pose)){x.fillStyle=style.ghost;x.fillRect(-8,-27+bob,16,11);x.fillStyle=style.shade;x.fillRect(-5,-24+bob,9,1);x.fillRect(-5,-20+bob,7,1);}
 if(['offer','receive','handkey','pass'].includes(pose)){x.fillStyle=style.trim;x.fillRect(14,-25+bob,9,4);if(pose==='handkey'){x.fillRect(21,-28+bob,2,9);x.fillRect(21,-28+bob,6,2);}}
 if(pose==='carry'){x.fillStyle=style.ghost;x.fillRect(-10,-31+bob,20,11);x.fillStyle=style.shade;x.fillRect(-6,-36+bob,12,7);x.fillStyle=style.core;x.fillRect(2,-35+bob,3,3);}
 if(pose==='carryflame'){x.fillStyle='#e7a35e';x.fillRect(-8,-30+bob,16,10);x.fillStyle='#fff0b6';x.fillRect(-4,-38+bob,8,12);x.fillStyle='#ffffff';x.fillRect(-2,-36+bob,4,5);}
 if(pose==='umbrella'){x.fillStyle=style.coat;x.fillRect(0,-56+bob,3,55);for(let i=-18;i<=18;i+=4)x.fillRect(i,-57+bob+Math.abs(i)/4,5,4);x.fillStyle=style.core;x.fillRect(-13,-55+bob,5,2);x.fillRect(3,-61+bob,5,2);}
 if(pose==='aim'||pose==='guard'){x.fillStyle=style.shade;memoryPixelLine(x,-2,-4+bob,18,-48+bob,style.shade,3);x.fillStyle=style.trim;x.fillRect(15,-50+bob,8,5);}
}
drawMemoryActor=function(ctx,a,rect,key,t,index,alpha){
 const px=rect.x+rect.w*a.x,py=rect.y+rect.h*a.y,small=a.role==='child',sc=(a.scale||1)*(small?.72:1)*clamp(Math.min(rect.w/360,rect.h/260),.78,1.28),seed=idHash((activeMemoryEcho?.id||'echo')+a.role+index+a.tone),phase=t*3+index*1.71,step=save.motion?0:Math.sin(phase),style=memoryStyle(a,key,index),dir=a.dir||1,pal=MEMORY_PALETTES[key]||MEMORY_PALETTES.hollow;
 if(a.role==='wick'){const pose=a.pose,dim=pose==='dim'?.58:1,pulse=pose==='breathe'?(1+Math.sin(t*2)*.16):1,burst=pose==='startle'?1.42:pose==='hush'?.72:1,lean=['follow','carryflame'].includes(pose)?6:0,shards=pose==='learn'?8:pose==='dim'?4:6;ctx.save();ctx.translate(px+lean,py+(save.motion?0:Math.sin(t*(pose==='startle'?5:2)+index)*(pose==='hush'?1:4)));ctx.scale(pulse,pulse);ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,0,2,0,0,27*burst);g.addColorStop(0,'rgba(255,239,181,'+(alpha*.55*dim)+')');g.addColorStop(1,'rgba(122,196,216,0)');ctx.fillStyle=g;ctx.fillRect(-34,-34,68,68);ctx.globalAlpha=alpha*.78*dim;ctx.fillStyle='#e89d5b';ctx.fillRect(-7,-6,14,14);ctx.fillStyle='#fff2ba';ctx.fillRect(-4,-13,8,12);ctx.fillStyle='#ffffff';ctx.fillRect(-2,-11,4,5);for(let i=0;i<shards;i++){const ang=t*(i%2?-.7:.82)+(i*TAU/shards)+(pose==='hush'?-Math.PI/2:0),rr=(15+(i%3)*3)*burst;ctx.fillStyle=i%2?'#ffd584':'#9dd9e2';ctx.fillRect(Math.round(Math.cos(ang)*rr)-2,Math.round(Math.sin(ang)*rr*.65)-2,i%3===0?5:3,i%3===0?3:5);}if(pose==='carryflame'){ctx.fillStyle='#e58e54';ctx.fillRect(13,-5,10,10);ctx.fillStyle='#fff0b7';ctx.fillRect(15,-12,6,10);}if(pose==='learn'){ctx.strokeStyle='#a8dbe0';ctx.globalAlpha=alpha*.35;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,23+i*5,.2+i*.5,1.5+i*.5);ctx.stroke();}}if(pose==='hush'){ctx.strokeStyle='#d4c5ec';ctx.globalAlpha=alpha*.3;ctx.beginPath();ctx.arc(0,0,25,0,TAU);ctx.stroke();}ctx.restore();return;}
 const surface=MEMORY_GHOST_SURFACE,x=surface.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,surface.width,surface.height);x.imageSmoothingEnabled=false;x.save();x.translate(40,84);
 const spec=memoryPoseSpec(a.pose,step),bob=spec.bob,hy=-14+bob,sy=-36+bob,headY=-57+bob,shoulder=8+seed%3,kneeL=[-5+(spec.lf[0]+6)*.35,-7+bob],kneeR=[5+(spec.rf[0]-6)*.35,-7+bob];
 x.globalAlpha=.22;x.fillStyle=pal.light;x.fillRect(-13,1,26,2);x.fillRect(-9,4,18,1);x.globalAlpha=1;
 if(a.role==='seraph'){x.fillStyle=style.coat;for(const side of [-1,1])for(let i=0;i<5;i++){const xx=side*(11+i*4),yy=-43+i*5;x.fillRect(xx-(side<0?5:0),yy,5,25-i*3);x.fillStyle=i%2?style.core:style.coat;x.fillRect(xx-(side<0?4:0),yy+2,3,14-i);}}
 if(a.role==='watcher'||a.role==='vessel'){x.fillStyle=style.shade;for(let yy=sy+3,w=shoulder+4;yy<0;yy+=5,w=Math.max(5,w-1))x.fillRect(-w,yy,w*2,5);}
 memoryJointedLimb(x,[[-5,hy],kneeL,spec.lf],style.coat,4);memoryJointedLimb(x,[[5,hy],kneeR,spec.rf],style.coat,4);x.fillStyle=style.shade;x.fillRect(spec.lf[0]-5,spec.lf[1]-3,9,4);x.fillRect(spec.rf[0]-4,spec.rf[1]-3,9,4);
 memoryJointedLimb(x,[[-shoulder+1,sy+4],spec.le,spec.lh],style.coat,4);memoryJointedLimb(x,[[shoulder-1,sy+4],spec.re,spec.rh],style.coat,4);
 memoryGhostTorso(x,a.role,style,shoulder,sy,hy,seed);
 if(a.role==='worker'||a.role==='engineer'){x.fillStyle=style.trim;x.fillRect(-shoulder-2,sy,6,6);x.fillRect(shoulder-4,sy,6,6);x.fillRect(-6,sy+6,4,16);x.fillRect(2,sy+6,4,16);x.fillStyle=style.shade;x.fillRect(-shoulder,hy-3,shoulder*2,4);}
 if(a.role==='gardener'||a.role==='caretaker'){x.fillStyle=style.ghost;x.fillRect(-6,sy+6,12,16);x.fillRect(-8,hy-3,16,5);x.fillStyle=style.shade;x.fillRect(-3,sy+9,6,10);}
 if(a.role==='servant'){x.fillStyle=style.core;x.fillRect(-shoulder,sy+2,shoulder*2,4);x.fillStyle=style.trim;x.fillRect(-5,sy+6,10,14);}
 if(a.role==='lamplighter'){x.fillStyle=style.trim;x.fillRect(-shoulder-1,sy+2,5,16);x.fillStyle=style.shade;x.fillRect(shoulder-3,hy-1,8,8);x.fillStyle=style.core;x.fillRect(shoulder,hy+1,3,3);}
 if(a.role==='singer'||a.role==='cantor'){x.fillStyle=style.core;x.fillRect(-shoulder-2,sy+4,4,15);x.fillRect(shoulder-2,sy+4,4,15);x.fillStyle=style.trim;x.fillRect(-shoulder-1,sy+1,shoulder*2+2,3);}
 if(a.role==='seraph'){x.fillStyle=style.core;x.fillRect(-shoulder-1,sy,shoulder*2+2,4);x.strokeStyle=style.trim;x.strokeRect(-11,headY-12,22,5);}
 memoryGhostFace(x,a.role,style,headY,seed);
 x.fillStyle=style.skin;x.fillRect(spec.lh[0]-2,spec.lh[1]-2,5,5);x.fillRect(spec.rh[0]-2,spec.rh[1]-2,5,5);
 if(a.role==='keeper'){x.strokeStyle=style.trim;for(let i=0;i<6;i++){const ang=i*TAU/6+t*.18;x.strokeRect(Math.round(Math.cos(ang)*17)-2,headY+7+Math.round(Math.sin(ang)*10)-2,4,4);}}
 memoryHeldDetail(x,a,spec,style,bob);
 x.save();x.globalCompositeOperation='source-atop';const spectralWash=x.createLinearGradient(0,-72,0,4);spectralWash.addColorStop(0,'rgba(255,255,255,.86)');spectralWash.addColorStop(.45,'rgba(198,241,249,.78)');spectralWash.addColorStop(1,'rgba(105,176,207,.62)');x.fillStyle=spectralWash;x.fillRect(-34,-76,68,82);x.restore();
 x.globalCompositeOperation='destination-out';x.globalAlpha=1;for(let hole=0;hole<13;hole++){const hx=-16+(seed+hole*17)%33,hy2=-62+(seed*3+hole*13)%64,ww=hole%3===0?7:3+(hole%2)*2,hh=hole%4===0?4:2;x.fillRect(hx,hy2,ww,hh);}x.fillRect(seed%2?-12:5,-34,8,3);for(let cut=0;cut<4;cut++)x.fillRect(-12+((seed+cut*11)%25),-8+cut*4,4+cut%2*3,3);x.globalCompositeOperation='source-over';x.globalAlpha=1;
 for(let glint=0;glint<11;glint++){x.fillStyle=glint%3?style.trim:style.core;const gx=-17+(seed*5+glint*19)%35,gy=-64+(seed+glint*11)%65;x.fillRect(gx,gy,glint%3===0?4:2,1+(glint%4===0));}
 x.restore();ctx.save();const floatY=save.motion?0:Math.sin(t*1.35+seed)*1.4;ctx.translate(Math.round(px),Math.round(py+floatY));ctx.scale(dir*sc,sc);ctx.imageSmoothingEnabled=false;const aura=ctx.createRadialGradient(0,-35,3,0,-35,42);aura.addColorStop(0,'rgba(221,251,255,'+(alpha*.12)+')');aura.addColorStop(1,'rgba(110,194,221,0)');ctx.fillStyle=aura;ctx.fillRect(-45,-83,90,90);ctx.filter='brightness(1.22)';ctx.globalCompositeOperation='screen';ctx.globalAlpha=alpha*.12;ctx.drawImage(surface,-40+(save.motion?0:Math.sin(t*1.7+index)*4),-84);ctx.globalAlpha=alpha*.09;ctx.drawImage(surface,-40-(save.motion?0:Math.sin(t*1.2+index)*3),-82);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=alpha*.72;ctx.shadowColor='#bceef7';ctx.shadowBlur=12;ctx.drawImage(surface,-40,-84);ctx.shadowBlur=0;ctx.filter='none';ctx.globalCompositeOperation='lighter';const scanY=-76+((save.motion?31:t*18+seed)%68);ctx.globalAlpha=alpha*.2;ctx.fillStyle='#efffff';ctx.fillRect(-19,scanY,38,2);for(let shard=0;shard<12;shard++){const drift=save.motion?0:Math.sin(t*1.25+seed+shard)*5;ctx.fillStyle=shard%3?style.ghost:style.core;ctx.globalAlpha=alpha*(.09+(shard%3)*.04);ctx.fillRect((shard%2?18:-21)+drift,-64+shard*6,shard%3===0?4:2,1+(shard%2));}for(let wisp=0;wisp<4;wisp++){const wx=-10+wisp*7+(save.motion?0:Math.sin(t*1.1+seed+wisp)*3);ctx.globalAlpha=alpha*(.12-wisp*.015);ctx.fillStyle=wisp%2?style.coat:style.trim;ctx.fillRect(wx,2+wisp*3,3,7-wisp);}ctx.restore();
};

const ECHO_HERO_KIND={
 echo1:'watchRoster',echo2:'oilTin',echo3:'bellRope',echo4:'unsentLetter',echo5:'ironDoor',echo6:'beanStakes',echo7:'glassWedge',echo8:'warningSign',echo9:'bedLabels',echo10:'gardenSpade',
 trace11:'floodGauge',trace12:'pumpWrench',trace13:'parcel',trace14:'prayerBoard',trace15:'bellClapper',trace16:'lunchPail',trace17:'coolingHook',trace18:'hammerToken',trace19:'clayFinger',trace20:'furnaceKey',
 trace21:'brassPlanet',trace22:'lensLedger',trace23:'chalkFootprints',trace24:'starMap',trace25:'eyepiece',trace26:'returnStamp',trace27:'indexCard',trace28:'redactionKnife',trace29:'misfileSlip',trace30:'lastSheet',
 trace31:'placeCard',trace32:'coldPlate',trace33:'favorToken',trace34:'cutCarpet',trace35:'audienceBell',trace36:'breathMark',trace37:'bellowsPatch',trace38:'cantorShoe',trace39:'tuningFork',trace40:'blackFeather',
 trace41:'arrowBundle',trace42:'padlock',trace43:'freshFuse',trace44:'engineTooth',trace45:'bentCrown',trace46:'gateHinge',trace47:'dryRoot',trace48:'blankLabel',trace49:'knuckleMarks',trace50:'firstWick'
};
function memoryOpenAnchor(scene,kind){
 const id=activeMemoryEcho?.id||'echo1',seed=idHash(id),artifactCandidates=[{x:.16,y:.31},{x:.84,y:.31},{x:.17,y:.51},{x:.83,y:.51},{x:.50,y:.25}],observerCandidates=[{x:.12,y:.81},{x:.88,y:.81},{x:.10,y:.61},{x:.90,y:.61}],occupied=[...scene.actors.map(a=>({x:a.x,y:a.y,w:.13})),...scene.props.map(p=>({x:p.x,y:p.y,w:.10}))],artifact=kind==='observer'?memoryOpenAnchor(scene,'artifact'):null,candidates=kind==='observer'?observerCandidates:artifactCandidates;
 let best=candidates[seed%candidates.length],bestScore=-1;for(let i=0;i<candidates.length;i++){const c=candidates[(i+seed)%candidates.length];let score=Math.min(...occupied.map(o=>Math.hypot((c.x-o.x)*1.2,c.y-o.y)-o.w));if(artifact)score=Math.min(score,Math.hypot((c.x-artifact.x)*1.2,c.y-artifact.y)-.18);if(score>bestScore){bestScore=score;best=c;}}return best;
}
function drawArtifactPaper(ctx,w,h,color,lines=3){ctx.fillStyle='#171923';ctx.fillRect(-w/2-2,-h/2-2,w+4,h+4);ctx.fillStyle='#d9ceb3';ctx.fillRect(-w/2,-h/2,w,h);ctx.fillStyle=color;ctx.fillRect(-w/2+3,-h/2+3,w*.34,2);ctx.fillStyle='#58525a';for(let i=0;i<lines;i++)ctx.fillRect(-w/2+4,-h/2+9+i*5,w-8-(i%2)*5,1);ctx.fillStyle='#ffffff55';ctx.fillRect(-w/2+2,-h/2+2,2,h-4);}
function drawHeroArtifactGlyph(ctx,kind,color,t,seed){
 ctx.lineWidth=2;ctx.strokeStyle='#ded3b8';ctx.fillStyle='#a88455';
 if(kind==='watchRoster'){ctx.fillStyle='#34424a';ctx.fillRect(-17,-24,34,42);ctx.strokeRect(-17,-24,34,42);ctx.fillStyle='#cbd5cf';for(let i=0;i<6;i++){ctx.fillRect(-12,-18+i*6,18-(i%3)*2,2);ctx.fillRect(9,-18+i*6,3,2);}ctx.fillStyle=color;ctx.fillRect(-13,13,26,3);}
 else if(kind==='oilTin'){ctx.fillStyle='#667078';ctx.fillRect(-13,-17,26,31);ctx.fillStyle='#aeb8b4';ctx.fillRect(-10,-14,20,3);ctx.strokeStyle='#d5c49c';ctx.beginPath();ctx.arc(0,-17,9,Math.PI,TAU);ctx.stroke();ctx.fillStyle='#567ca0';ctx.fillRect(8,-4,9,4);ctx.fillRect(13,-2,3,14);}
 else if(kind==='bellRope'){ctx.strokeStyle='#b79a69';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,-27);ctx.quadraticCurveTo(5,-8,-1,9);ctx.stroke();ctx.fillStyle='#8d704e';for(let i=0;i<4;i++)ctx.fillRect(-7+i%2*2,5+i*3,13-i*2,3);ctx.fillStyle=color;ctx.fillRect(-5,15,10,3);}
 else if(kind==='unsentLetter'||kind==='misfileSlip'||kind==='lastSheet'){drawArtifactPaper(ctx,kind==='misfileSlip'?34:29,kind==='lastSheet'?38:36,color,kind==='lastSheet'?1:4);if(kind==='unsentLetter'){ctx.fillStyle='#8d6570';ctx.fillRect(-11,9,9,5);}if(kind==='misfileSlip'){ctx.fillStyle='#628ba0';ctx.fillRect(2,-15,12,5);}}
 else if(kind==='ironDoor'||kind==='knuckleMarks'){ctx.fillStyle='#39434d';ctx.fillRect(-16,-27,32,46);ctx.strokeStyle='#a29378';ctx.strokeRect(-16,-27,32,46);ctx.fillStyle='#6b7a87';for(let y=-20;y<15;y+=9)ctx.fillRect(-11,y,22,3);ctx.fillStyle='#e2c78f';ctx.fillRect(8,-5,4,4);if(kind==='knuckleMarks'){ctx.fillStyle=color;ctx.fillRect(-8,-8,5,3);ctx.fillRect(-8,1,5,3);}}
 else if(kind==='beanStakes'){ctx.fillStyle='#806446';for(let i=-1;i<=1;i++){ctx.fillRect(i*10-2,-25+(i%2)*3,4,43);ctx.fillStyle='#d6c69d';ctx.fillRect(i*10-5,-17+(i%2)*3,10,6);ctx.fillStyle='#708d59';ctx.fillRect(i*10+1,-8,9,4);ctx.fillStyle='#806446';}}
 else if(kind==='glassWedge'||kind==='eyepiece'){ctx.fillStyle='#9cdbdf66';ctx.strokeStyle='#c9f0ed';if(kind==='glassWedge'){ctx.beginPath();ctx.moveTo(-18,17);ctx.lineTo(11,-25);ctx.lineTo(18,18);ctx.closePath();ctx.fill();ctx.stroke();memoryPixelLine(ctx,-12,10,8,-17,'#ffffff',2);}else{ctx.rotate(-.18);ctx.fillStyle='#1d2b37';ctx.fillRect(-19,-8,38,16);ctx.strokeRect(-19,-8,38,16);ctx.fillStyle='#aee2e499';ctx.fillRect(-11,-6,17,12);memoryPixelLine(ctx,-7,-5,4,5,'#ffffff',2);ctx.fillStyle=color;ctx.fillRect(17,-3,8,6);}}
 else if(kind==='warningSign'){ctx.fillStyle='#765b43';ctx.fillRect(-19,-19,38,27);ctx.fillStyle='#ddd0ad';ctx.fillRect(-16,-16,32,19);ctx.fillStyle='#6d3540';ctx.fillRect(-12,-11,24,3);ctx.fillRect(-9,-4,18,3);ctx.fillStyle='#765b43';ctx.fillRect(-3,8,6,16);}
 else if(kind==='bedLabels'||kind==='blankLabel'){ctx.fillStyle='#9c814e';ctx.fillRect(-18,-8,36,16);ctx.fillStyle='#ddc987';ctx.fillRect(-15,-5,30,10);ctx.fillStyle=kind==='blankLabel'?'#8f805f':'#534742';if(kind==='bedLabels')for(let i=0;i<7;i++)ctx.fillRect(-13+i*4,-3,3,6);else{ctx.fillRect(-12,-2,2,4);ctx.fillRect(10,-2,2,4);}}
 else if(kind==='gardenSpade'){ctx.rotate(-.5);ctx.fillStyle='#85674b';ctx.fillRect(-3,-28,6,34);ctx.strokeStyle='#d1bd91';ctx.strokeRect(-8,-31,16,8);ctx.fillStyle='#9da5a0';ctx.beginPath();ctx.moveTo(-10,5);ctx.lineTo(10,5);ctx.lineTo(6,20);ctx.lineTo(-6,20);ctx.closePath();ctx.fill();ctx.fillStyle=color;ctx.fillRect(-5,8,3,9);}
 else if(kind==='floodGauge'){ctx.fillStyle='#344b53';ctx.fillRect(-13,-27,26,46);ctx.strokeRect(-13,-27,26,46);ctx.fillStyle='#c1d5cf';for(let y=-20;y<15;y+=7)ctx.fillRect(-8,y,16,2);ctx.fillStyle=color;ctx.fillRect(-3,-18,6,32);ctx.fillStyle='#f5d392';ctx.fillRect(-8,-3,16,3);}
 else if(kind==='pumpWrench'){ctx.rotate(-.55);ctx.fillStyle='#9ca39e';ctx.fillRect(-4,-22,8,41);ctx.beginPath();ctx.arc(0,-20,10,.4,TAU-.4);ctx.lineTo(0,-20);ctx.fill();ctx.fillStyle='#50433d';for(let y=-2;y<16;y+=5)ctx.fillRect(-6,y,12,3);}
 else if(kind==='parcel'){ctx.fillStyle='#75644f';ctx.fillRect(-18,-13,36,27);ctx.strokeRect(-18,-13,36,27);ctx.fillStyle='#b9a77e';ctx.fillRect(-3,-13,6,27);ctx.fillRect(-18,-2,36,5);ctx.fillStyle='#6e94aa';ctx.fillRect(7,5,8,5);}
 else if(kind==='prayerBoard'){ctx.fillStyle='#3c4748';ctx.fillRect(-18,-25,36,44);ctx.strokeStyle='#b69b6b';ctx.strokeRect(-18,-25,36,44);ctx.fillStyle='#d5d5bf';for(let i=0;i<5;i++){ctx.fillRect(-12,-18+i*7,17+i%2*5,2);ctx.fillRect(10,-18+i*7,3,3);}ctx.fillStyle=color;ctx.fillRect(-13,14,26,3);}
 else if(kind==='bellClapper'){ctx.fillStyle='#827363';ctx.fillRect(-4,-27,8,34);ctx.fillStyle='#b4a797';ctx.fillRect(-9,4,18,12);ctx.fillStyle='#e0c98c';ctx.fillRect(-4,15,8,5);ctx.fillStyle=color;ctx.fillRect(2,-21,3,24);}
 else if(kind==='lunchPail'){ctx.fillStyle='#62686b';ctx.fillRect(-16,-13,32,28);ctx.fillStyle='#aeb4ad';ctx.fillRect(-14,-16,28,6);ctx.strokeStyle='#c5b78f';ctx.beginPath();ctx.arc(0,-14,12,Math.PI,TAU);ctx.stroke();ctx.fillStyle='#c9b18a';ctx.fillRect(-7,-5,14,10);ctx.fillStyle='#42383b';ctx.fillRect(-5,-3,10,6);}
 else if(kind==='coolingHook'){ctx.strokeStyle='#95877a';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-7,20);ctx.lineTo(5,-19);ctx.quadraticCurveTo(11,-31,19,-19);ctx.stroke();ctx.fillStyle='#6b4d3e';for(let i=0;i<4;i++)ctx.fillRect(-12+i*2,8+i*3,10,3);}
 else if(kind==='hammerToken'||kind==='favorToken'){ctx.fillStyle=kind==='favorToken'?'#d6c1a2':'#ba9056';ctx.beginPath();ctx.arc(0,-3,18,0,TAU);ctx.fill();ctx.strokeStyle='#f0ddae';ctx.stroke();ctx.fillStyle='#4d4140';if(kind==='hammerToken'){ctx.font='bold 19px monospace';ctx.textAlign='center';ctx.fillText('3',0,4);}else{ctx.fillRect(-11,-8,22,3);ctx.fillRect(-9,2,18,3);ctx.fillStyle=color;ctx.fillRect(-13,-1,26,2);}}
 else if(kind==='clayFinger'){ctx.fillStyle='#9e7059';ctx.fillRect(-7,-19,14,35);ctx.fillRect(-6,-24,12,9);ctx.fillStyle='#c69672';ctx.fillRect(-3,-21,6,6);ctx.fillStyle='#604640';for(let i=0;i<4;i++)ctx.fillRect(-4,-10+i*6,8,2);ctx.fillStyle=color;ctx.fillRect(-2,-20,3,3);}
 else if(kind==='furnaceKey'){ctx.strokeStyle='#d0a968';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,-16,10,0,TAU);ctx.stroke();ctx.fillStyle='#b18757';ctx.fillRect(-3,-7,6,30);ctx.fillRect(2,15,12,5);ctx.fillRect(8,10,5,10);ctx.fillStyle='#f2c277';ctx.fillRect(-1,-3,2,18);}
 else if(kind==='brassPlanet'){ctx.fillStyle='#9d7c4d';ctx.beginPath();ctx.arc(0,-3,18,0,TAU);ctx.fill();ctx.strokeStyle='#e0c681';ctx.beginPath();ctx.ellipse(0,-3,24,8,-.25,0,TAU);ctx.stroke();ctx.fillStyle='#27313c';ctx.fillRect(-14,-4,28,3);ctx.fillStyle='#d2b18a';ctx.fillRect(-8,1,16,11);ctx.fillStyle='#5d4747';for(let i=-1;i<=1;i++)ctx.fillRect(i*6-2,4,4,5);}
 else if(kind==='lensLedger'){drawArtifactPaper(ctx,32,42,color,5);ctx.strokeStyle='#aee2df';ctx.beginPath();ctx.arc(8,4,9,0,TAU);ctx.stroke();ctx.fillStyle='#ffffff';ctx.fillRect(5,0,3,6);}
 else if(kind==='chalkFootprints'){ctx.fillStyle='#34414b';ctx.fillRect(-19,-20,38,37);ctx.strokeRect(-19,-20,38,37);ctx.fillStyle='#dfdfcf';for(const s of [-1,1]){ctx.fillRect(s*7-3,-13,6,10);ctx.fillRect(s*7-5,-17,3,3);ctx.fillRect(s*7,-18,3,3);}ctx.save();ctx.rotate(-.25);ctx.fillRect(-12,10,24,4);ctx.restore();}
 else if(kind==='starMap'){drawArtifactPaper(ctx,38,39,color,2);ctx.fillStyle='#637b8e';for(let i=0;i<9;i++)ctx.fillRect(-14+(i*13)%29,-13+(i*17)%27,2,2);ctx.strokeStyle=color;ctx.beginPath();ctx.arc(8,-3,7,0,TAU);ctx.stroke();}
 else if(kind==='returnStamp'){ctx.fillStyle='#5d443c';ctx.fillRect(-7,-24,14,24);ctx.fillRect(-13,-27,26,8);ctx.fillStyle='#a48462';ctx.fillRect(-16,-1,32,15);ctx.fillStyle='#d9c8a2';ctx.fillRect(-12,3,24,7);ctx.fillStyle='#694c56';ctx.fillRect(-9,5,18,3);}
 else if(kind==='indexCard'||kind==='placeCard'){drawArtifactPaper(ctx,kind==='placeCard'?38:36,kind==='placeCard'?24:30,color,kind==='placeCard'?1:4);if(kind==='placeCard'){ctx.fillStyle='#574956';ctx.fillRect(-12,-1,24,2);ctx.fillStyle=color;ctx.fillRect(-15,7,30,2);}}
 else if(kind==='redactionKnife'){ctx.rotate(-.65);ctx.fillStyle='#7c5c43';ctx.fillRect(-5,-5,10,28);ctx.fillStyle='#c5c4b9';ctx.beginPath();ctx.moveTo(-7,-6);ctx.lineTo(5,-26);ctx.lineTo(10,-20);ctx.lineTo(4,-3);ctx.closePath();ctx.fill();ctx.fillStyle='#3d3136';ctx.fillRect(-3,-16,9,3);}
 else if(kind==='coldPlate'){ctx.fillStyle='#d3c7af';ctx.beginPath();ctx.ellipse(0,-2,21,12,0,0,TAU);ctx.fill();ctx.strokeStyle='#8d7c68';ctx.beginPath();ctx.ellipse(0,-2,15,8,0,0,TAU);ctx.stroke();ctx.fillStyle='#97766255';for(const x of [-7,7]){ctx.fillRect(x,-7,3,8);ctx.fillRect(x+3,-5,2,5);}}
 else if(kind==='cutCarpet'){ctx.fillStyle='#775564';ctx.fillRect(-20,-22,40,39);ctx.fillStyle='#c09b72';for(let x=-16;x<17;x+=8)ctx.fillRect(x,-19,3,33);ctx.fillStyle='#edd0a0';for(let y=-17;y<14;y+=6)ctx.fillRect(-2,y,4,3);ctx.strokeStyle='#4e3e4d';ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(0,17);ctx.stroke();}
 else if(kind==='audienceBell'){ctx.fillStyle='#a38352';ctx.beginPath();ctx.moveTo(-17,10);ctx.lineTo(-10,-14);ctx.quadraticCurveTo(0,-25,10,-14);ctx.lineTo(17,10);ctx.closePath();ctx.fill();ctx.fillStyle='#e0c27e';ctx.fillRect(-15,8,30,5);ctx.strokeStyle='#f2d99b';ctx.beginPath();ctx.arc(0,-12,7,Math.PI,TAU);ctx.stroke();}
 else if(kind==='breathMark'){ctx.fillStyle='#4b4f58';ctx.fillRect(-19,-19,38,35);ctx.fillStyle='#dbd7c8';for(let i=0;i<4;i++)ctx.fillRect(-14+i*7,-9,4,9);for(let i=0;i<6;i++)ctx.fillRect(-17+i*6,5,3,6);ctx.fillStyle=color;ctx.fillRect(-16,-15,32,2);}
 else if(kind==='bellowsPatch'){ctx.fillStyle='#79594b';ctx.beginPath();ctx.moveTo(-19,-14);ctx.lineTo(13,-19);ctx.lineTo(20,11);ctx.lineTo(-14,18);ctx.closePath();ctx.fill();ctx.strokeStyle='#d0b287';ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#d7bf91';ctx.fillRect(-8,-3,4,8);ctx.fillRect(1,-4,4,8);}
 else if(kind==='cantorShoe'){ctx.fillStyle='#4a4350';ctx.fillRect(-4,-23,13,28);ctx.beginPath();ctx.moveTo(-4,2);ctx.lineTo(9,2);ctx.lineTo(20,12);ctx.lineTo(18,17);ctx.lineTo(-12,17);ctx.lineTo(-13,11);ctx.closePath();ctx.fill();ctx.fillStyle='#9c8d86';ctx.fillRect(-10,13,27,4);ctx.fillStyle=color;ctx.fillRect(10,12,7,3);}
 else if(kind==='tuningFork'){ctx.fillStyle='#aaaeb0';ctx.fillRect(-3,-7,6,29);ctx.fillRect(-14,-27,5,25);ctx.fillRect(9,-27,5,25);ctx.fillRect(-12,-4,24,5);ctx.fillStyle='#dce8df';ctx.fillRect(-12,-25,2,17);ctx.fillStyle=color;ctx.fillRect(10,-25,2,11);}
 else if(kind==='blackFeather'){ctx.rotate(.25);ctx.fillStyle='#1c1a2b';for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(0,-26+i*6);ctx.lineTo(-14+i, -18+i*5);ctx.lineTo(0,-14+i*6);ctx.lineTo(14-i,-18+i*5);ctx.closePath();ctx.fill();ctx.fillStyle=i%2?'#51496f':'#282139';}ctx.fillStyle='#9d94c5';ctx.fillRect(-1,-24,3,43);}
 else if(kind==='arrowBundle'){for(let i=-2;i<=2;i++){ctx.save();ctx.translate(i*5,0);ctx.rotate(-.5);ctx.fillStyle='#82644d';ctx.fillRect(-2,-21,4,41);ctx.fillStyle='#d7c9aa';ctx.beginPath();ctx.moveTo(-6,-20);ctx.lineTo(6,-20);ctx.lineTo(0,-28);ctx.closePath();ctx.fill();ctx.fillStyle=color;ctx.fillRect(-5,13,10,3);ctx.restore();}}
 else if(kind==='padlock'){ctx.strokeStyle='#b3aaa0';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,-12,11,Math.PI,TAU);ctx.stroke();ctx.fillStyle='#77736f';ctx.fillRect(-15,-11,30,27);ctx.fillStyle='#d2c3a0';ctx.fillRect(-3,-3,6,11);ctx.fillStyle=color;ctx.fillRect(-12,11,24,3);}
 else if(kind==='freshFuse'){ctx.strokeStyle='#8d765d';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-19,14);ctx.quadraticCurveTo(-5,-18,11,-5);ctx.quadraticCurveTo(21,2,10,-25);ctx.stroke();ctx.fillStyle='#e5af67';for(let i=0;i<5;i++){const a=t*1.5+i*TAU/5;ctx.fillRect(10+Math.cos(a)*8,-25+Math.sin(a)*8,3,3);}ctx.fillStyle='#d8874d';ctx.fillRect(-20,11,8,7);}
 else if(kind==='engineTooth'){ctx.fillStyle='#99805c';ctx.beginPath();ctx.moveTo(-14,-22);ctx.lineTo(14,-22);ctx.lineTo(10,18);ctx.lineTo(-10,18);ctx.closePath();ctx.fill();ctx.fillStyle='#846c83';for(let y=-17;y<13;y+=7)ctx.fillRect(-15,y,30,4);ctx.fillStyle='#d6c3cf';ctx.fillRect(-13,-15,3,26);}
 else if(kind==='bentCrown'){ctx.fillStyle='#a47a48';ctx.beginPath();ctx.moveTo(-19,14);ctx.lineTo(-16,-13);ctx.lineTo(-7,-3);ctx.lineTo(0,-20);ctx.lineTo(7,-4);ctx.lineTo(18,-15);ctx.lineTo(14,14);ctx.closePath();ctx.fill();ctx.fillStyle='#edce82';ctx.fillRect(-17,9,31,4);ctx.fillStyle=color;ctx.fillRect(-2,-15,5,5);ctx.rotate(-.08);}
 else if(kind==='gateHinge'){ctx.fillStyle='#8b8c87';ctx.fillRect(-6,-25,12,46);ctx.fillRect(-20,-19,40,10);ctx.fillRect(-18,7,36,10);ctx.fillStyle='#c6bc9f';for(const x of [-14,14]){ctx.fillRect(x-2,-16,4,4);ctx.fillRect(x-2,10,4,4);}ctx.fillStyle='#567ba0';ctx.fillRect(-18,-17,8,3);}
 else if(kind==='dryRoot'){ctx.strokeStyle='#8d7954';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,21);ctx.quadraticCurveTo(-11,6,-4,-25);ctx.moveTo(-3,3);ctx.quadraticCurveTo(11,-2,17,-17);ctx.moveTo(-5,-8);ctx.lineTo(-18,-17);ctx.stroke();ctx.fillStyle='#83976a';ctx.fillRect(11,-20,8,4);ctx.strokeStyle=color;ctx.beginPath();ctx.arc(1,-3,14,0,TAU);ctx.stroke();}
 else if(kind==='firstWick'){ctx.fillStyle='#93b5bb55';ctx.fillRect(-14,-16,28,32);ctx.strokeStyle='#d3e4df';ctx.strokeRect(-14,-16,28,32);ctx.fillStyle='#a98964';ctx.fillRect(-11,11,22,6);ctx.fillStyle='#d7c9b2';ctx.fillRect(-3,-10,6,22);ctx.strokeStyle='#8fc4d3';ctx.beginPath();ctx.moveTo(3,-11);ctx.quadraticCurveTo(13,-3,5,10);ctx.stroke();ctx.fillStyle=color;ctx.fillRect(-2,-12,4,5);}
}
function drawTableauArtifact(ctx,id,x,y,key,t,alpha,seen){
 const kind=ECHO_HERO_KIND[id]||'watchRoster',record=TRACE_RECORDS[id],color=record?.color||'#c4a4dd',seed=idHash(id),bob=save.motion?0:Math.sin(t*1.6+seed)*2;ctx.save();ctx.translate(Math.round(x),Math.round(y+bob));ctx.globalAlpha=alpha*(seen?.68:1);const glow=ctx.createRadialGradient(0,-5,2,0,-5,35);glow.addColorStop(0,color+'55');glow.addColorStop(1,color+'00');ctx.fillStyle=glow;ctx.fillRect(-38,-43,76,76);ctx.fillStyle='#131923';ctx.fillRect(-24,22,48,6);ctx.fillStyle='#5f6872';ctx.fillRect(-19,17,38,5);ctx.fillStyle='#c9b47d';ctx.fillRect(-14,15,28,3);ctx.save();ctx.translate(0,-2);drawHeroArtifactGlyph(ctx,kind,color,t,seed);ctx.restore();ctx.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const a=seed*.01+i*TAU/5+t*(i%2?-.5:.6),rr=27+(i%2)*4;ctx.fillStyle=i%2?color:'#f1dfb0';ctx.globalAlpha=alpha*.28;ctx.fillRect(Math.round(Math.cos(a)*rr)-1,Math.round(-4+Math.sin(a)*rr*.55)-1,3,3);}ctx.restore();
}

Object.assign(ECHO_TABLEAUS,{
 echo9:{mood:'count the names',actors:[memoryActor('lamplighter',.46,.62,'hold',1,1),memoryActor('child',.22,.72,'reach',1,2,.78),memoryActor('child',.34,.75,'reach',1,0,.76),memoryActor('caretaker',.72,.67,'count',-1,2,.95)],props:[memoryProp('bed',.20,.58,58),memoryProp('bed',.80,.58,58),memoryProp('labels',.53,.73,72)]},
 trace32:{mood:'dinner is not a meeting',actors:[memoryActor('regent',.28,.66,'sit',1,0,1.04),memoryActor('regent',.72,.66,'argue',-1,3,1.04),memoryActor('servant',.50,.69,'set',1,1,.92)],props:[memoryProp('table',.50,.62,164),memoryProp('chair',.27,.69,27),memoryProp('chair',.73,.69,27)]},
 trace34:{mood:'the seam underneath',actors:[memoryActor('lamplighter',.43,.72,'repair',1,0),memoryActor('servant',.64,.67,'hold',-1,2,.92),memoryActor('regent',.80,.61,'watch',-1,1,.98)],props:[memoryProp('cloth',.51,.74,150),memoryProp('tool',.37,.69,28),memoryProp('throne',.84,.48,40,72)]},
 trace37:{mood:'hold the bellows seam',actors:[memoryActor('worker',.36,.70,'repair',1,2),memoryActor('lamplighter',.59,.65,'signal',-1,0),memoryActor('caretaker',.78,.69,'carry',-1,1,.88)],props:[memoryProp('machine',.31,.54,78,68),memoryProp('bell',.30,.30,34),memoryProp('door',.88,.54,38,75)]},
 trace38:{mood:'seven steps and a high note',actors:[memoryActor('cantor',.48,.58,'sing',1,1,1.06),memoryActor('singer',.29,.69,'count',1,2,.92),memoryActor('lamplighter',.73,.67,'watch',-1,0)],props:[memoryProp('stairs',.50,.76,150),memoryProp('music',.67,.45,66)]},
 trace39:{mood:'file the note away',actors:[memoryActor('cantor',.38,.68,'cut',1,1),memoryActor('singer',.63,.66,'hush',-1,2),memoryActor('seraph',.78,.40,'hover',-1,3,.78)],props:[memoryProp('music',.50,.54,120),memoryProp('feathers',.77,.62,75),memoryProp('tool',.38,.59,25)]},
 trace40:{mood:'it learned the hymn',actors:[memoryActor('lamplighter',.38,.66,'inspect',1,0),memoryActor('cantor',.64,.64,'stop',-1,2),memoryActor('wick',.78,.43,'startle',-1,0,.8)],props:[memoryProp('bell',.18,.35,31),memoryProp('silence',.53,.42,60),memoryProp('feathers',.47,.70,80)]},
 trace43:{mood:'four fuses at the gate',actors:[memoryActor('engineer',.31,.68,'kneel',1,3),memoryActor('soldier',.56,.66,'carry',-1,1),memoryActor('lamplighter',.78,.65,'signal',-1,0)],props:[memoryProp('furnace',.20,.57,48,62),memoryProp('furnace',.82,.57,48,62),memoryProp('crate',.55,.72,34)]}
});

function memoryUnit(n){return ((Math.imul(n|0,1103515245)+12345)>>>0)/4294967296;}
function drawTableauStagecraft(ctx,rect,key,scene,t,alpha){
 const id=activeMemoryEcho?.id||'echo1',seed=idHash(id),pal=MEMORY_PALETTES[key]||MEMORY_PALETTES.hollow,color=activeMemoryEcho?.record.color||pal.light,focusX=rect.x+rect.w*(scene.actors.reduce((s,a)=>s+a.x,0)/Math.max(1,scene.actors.length)),focusY=rect.y+rect.h*(scene.actors.reduce((s,a)=>s+a.y,0)/Math.max(1,scene.actors.length)-.1),kinds=new Set(scene.props.map(p=>p.kind));ctx.save();ctx.globalAlpha=alpha;
 const pool=ctx.createRadialGradient(focusX,focusY,4,focusX,focusY,Math.max(80,rect.w*.34));pool.addColorStop(0,color+'28');pool.addColorStop(1,color+'00');ctx.fillStyle=pool;ctx.fillRect(rect.x+8,rect.y+8,rect.w-16,rect.h-16);
 ctx.globalAlpha=alpha*.16;ctx.fillStyle=pal.light;for(let i=0;i<10;i++){const px=rect.x+16+(seed*(i+3)*17)%Math.max(20,rect.w-32),py=rect.y+20+(seed*(i+7)*29)%Math.max(20,rect.h-42);ctx.fillRect(px,py,2+(i%3===0),1);}
 if(kinds.has('water')||kinds.has('rain')){ctx.strokeStyle='#8bd3dc';for(let i=0;i<5;i++){ctx.globalAlpha=alpha*(.08+i*.025);ctx.beginPath();ctx.ellipse(focusX,rect.y+rect.h*.78,35+i*24,6+i*2,0,0,TAU);ctx.stroke();}}
 if(kinds.has('furnace')||kinds.has('brazier')){ctx.fillStyle='#ffb467';for(let i=0;i<12;i++){const px=focusX-60+(seed+i*37)%120,py=rect.y+rect.h*.72-((t*18+i*13)%65);ctx.globalAlpha=alpha*(.12+(i%4)*.05);ctx.fillRect(px,py,i%3===0?3:2,2);}}
 if(kinds.has('root')){ctx.fillStyle='#9eb87c';for(let i=0;i<10;i++){const a=t*.18+i*2.4+seed,rr=35+(i%4)*18;ctx.globalAlpha=alpha*.18;ctx.fillRect(focusX+Math.cos(a)*rr,focusY+Math.sin(a)*rr*.45,6,3);}}
 if(kinds.has('music')||kinds.has('bell')||kinds.has('silence')){ctx.strokeStyle=color;for(let i=0;i<4;i++){ctx.globalAlpha=alpha*(.13-i*.02);ctx.beginPath();ctx.arc(focusX,focusY,28+i*18,t*.07+i*.35,Math.PI*1.35+t*.07+i*.35);ctx.stroke();}}
 if(kinds.has('lens')||kinds.has('orrery')||kinds.has('star')){ctx.fillStyle='#d8f1ef';for(let i=0;i<12;i++){const a=t*.09+i*TAU/12,rr=25+(i%5)*17;ctx.globalAlpha=alpha*(.1+(i%3)*.04);ctx.fillRect(focusX+Math.cos(a)*rr,focusY+Math.sin(a)*rr*.5,2,2);}}
 ctx.restore();
}
const MEMORY_BACK_KINDS=new Set(['shelf','door','sign','glass','pipe','gauge','rain','lens','banner','column','rack','target','star','silence','music']);
const MEMORY_FRONT_KINDS=new Set(['table','desk','bed','pod','crate','pail','paint','machine','belt','furnace','brazier','chair','throne','mold','cloth','tray']);
drawMemoryPeople=function(ctx,rect,key,t,alpha,floor){
 const id=activeMemoryEcho?.id||'echo1',scene=ECHO_TABLEAUS[id]||ECHO_TABLEAUS.echo1,pal=MEMORY_PALETTES[key]||MEMORY_PALETTES.hollow;ctx.save();ctx.beginPath();ctx.rect(rect.x+9,rect.y+9,rect.w-18,rect.h-18);ctx.clip();drawTableauStagecraft(ctx,rect,key,scene,t,alpha);
 const items=[...scene.props.map((o,i)=>({type:'prop',o,i,z:MEMORY_BACK_KINDS.has(o.kind)?-50+o.y*10:o.y*100+(MEMORY_FRONT_KINDS.has(o.kind)?18:0)})),...scene.actors.map((a,i)=>({type:'actor',a,i,z:a.y*100}))];items.sort((a,b)=>a.z-b.z);for(const item of items)item.type==='prop'?drawMemoryProp(ctx,item.o,rect,key,t,alpha,item.i):drawMemoryActor(ctx,item.a,rect,key,t,item.i,alpha);
 for(let i=0;i<16;i++){const n=memoryUnit(idHash(id)+i*83),px=rect.x+18+n*Math.max(20,rect.w-36),py=rect.y+18+memoryUnit(idHash(id)+i*131)*Math.max(20,rect.h-40);ctx.fillStyle=i%2?pal.light:activeMemoryEcho?.record.color;ctx.globalAlpha=alpha*(.07+(i%4)*.035);ctx.fillRect(px,py,2+(i%5===0),1+(i%3===0));}ctx.restore();
};
