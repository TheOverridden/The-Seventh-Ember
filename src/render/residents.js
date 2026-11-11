(function(root){
  'use strict';
  const palettes={
    oren:{ink:'#191d21',deep:'#28333a',coat:'#425c63',light:'#72918b',seam:'#a9b3a0',skin:'#ba805d',skinLight:'#e1ac7b',skinDark:'#845743',hair:'#73796d',hairLight:'#a9ae98',cloth:'#d3c4a0',clothDark:'#8d917c',leather:'#875637',leatherLight:'#ba8150',leatherDark:'#543d30',metal:'#c5a566',metalLight:'#f1d899',pants:'#343b3d',boot:'#4d3d33',sole:'#9a7b52'},
    nell:{ink:'#1c2020',deep:'#2e433d',coat:'#657a51',light:'#96a476',seam:'#c0c59c',skin:'#ad7756',skinLight:'#d7a37a',skinDark:'#77503d',hair:'#3e302a',hairLight:'#73513c',cloth:'#d9c7a0',clothDark:'#a18f71',leather:'#a45b40',leatherLight:'#d28b59',leatherDark:'#6e4135',metal:'#c4aa64',metalLight:'#e7d299',pants:'#505547',boot:'#67513c',sole:'#b09b6b'}
  };
  const stride=[0,1,2,1,0,-1,-2,-1];
  function paint(ctx,id,mode='idle',frame=0,facing=1){
    if(!palettes[id])throw Error('Unknown resident');
    const p=palettes[id],walking=mode==='walk',working=mode==='work',talking=mode==='talk';
    frame=((frame%16)+16)%16;
    const step=walking?stride[frame%8]:0;
    const squat=working&&id==='nell'?5:0;
    const breathe=!walking&&!working&&frame>=9&&frame<=12?1:0;
    const bodyY=squat+breathe+(walking&&[2,6].includes(frame%8)?-1:0);
    const blink=!working&&frame===15;
    ctx.save();ctx.imageSmoothingEnabled=false;
    if(facing<0){ctx.translate(48,0);ctx.scale(-1,1);}
    const box=(x,y,w,h,c)=>{ctx.fillStyle=p[c]||c;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
    const poly=(points,c)=>{
      let lo=Math.floor(Math.min(...points.map(a=>a[1]))),hi=Math.ceil(Math.max(...points.map(a=>a[1])));
      for(let y=lo;y<hi;y++){
        const xs=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y+.5&&b[1]>y+.5)||(b[1]<=y+.5&&a[1]>y+.5))xs.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
        xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)box(Math.ceil(xs[i]-.5),y,Math.ceil(xs[i+1]-.5)-Math.ceil(xs[i]-.5),1,c);
      }
    };
    const segment=(ax,ay,bx,by,width,c)=>{const steps=Math.max(Math.abs(bx-ax),Math.abs(by-ay),1);for(let i=0;i<=steps;i++)box(ax+(bx-ax)*i/steps-width/2,ay+(by-ay)*i/steps-width/2,width,width,c);};
    const limb=(a,b,c,width,color)=>{segment(...a,...b,width+2,'ink');segment(...b,...c,width,'ink');segment(...a,...b,width,color);segment(...b,...c,width-1,'skin');box(c[0]-1,c[1]-1,3,3,'skinLight');};
    function boot(x,y){box(x-3,y-3,6,4,'ink');box(x-2,y-4,4,4,'boot');box(x-2,y-1,7,3,'ink');box(x-1,y-1,6,2,'boot');box(x+2,y-1,2,1,'leatherLight');box(x-1,y+1,6,1,'sole');}
    const feet=[{hip:19,x:18+step*2,y:52-(walking&&step<0?2:0)},{hip:26,x:27-step*2,y:52-(walking&&step>0?2:0)}];
    for(const f of feet){const hipY=38+squat;segment(f.hip,hipY,f.x,47,5,'ink');segment(f.hip,hipY,f.x,47,3,'pants');segment(f.x,46,f.x,f.y-3,5,'ink');segment(f.x,46,f.x,f.y-3,3,'pants');boot(f.x,f.y);}
    ctx.save();ctx.translate(0,bodyY);
    if(id==='oren'){
      limb([16,25],[13,32],[14-step,38],4,'coat');
      poly([[17,22],[29,22],[32,27],[31,38],[28,42],[16,41],[13,36],[14,27]],'ink');
      poly([[18,23],[28,23],[30,28],[29,38],[26,40],[17,39],[15,35],[16,27]],'coat');
      box(18,25,4,12,'light');box(17,26,2,9,'coat');box(23,24,4,11,'deep');
      box(20,24,5,3,'cloth');box(21,27,3,3,'clothDark');
      box(24,29,5,6,'deep');box(24,29,5,1,'light');box(25,31,2,2,'metal');
      box(17,38,12,2,'leatherDark');box(23,38,3,2,'metal');box(24,38,1,1,'metalLight');
      box(16,35,5,2,'light');box(17,35,3,1,'seam');
      const swing=walking?Math.sign(step):0;
      poly([[12,32],[19,32],[21,35],[21+swing,45],[18+swing,47],[10+swing,45],[9,36]],'ink');
      box(11,35,8,9,'leather');box(11,35,2,7,'leatherLight');box(12,44,7,1,'leatherDark');
      box(10,34,10,3,'leatherDark');box(11,34,8,1,'leatherLight');box(15,36,2,3,'metal');box(15,36,1,1,'metalLight');
      segment(18,23,13,35,2,'leatherDark');segment(19,24,14,33,1,'leatherLight');
      const turn=working?[0,1,2,3,3,2,1,0,0,0,1,2,3,2,1,0][frame]:0;
      const hand=working?[35,29+turn]:talking?[33,31+(frame%8<4?0:2)]:[32-step,38];
      limb([29,26],working?[33,28]:[32,32],hand,4,'coat');
      box(working?33:30-step,working?27:34,3,2,'cloth');
      if(working){segment(hand[0],hand[1],39,24+turn,2,'ink');segment(hand[0],hand[1],39,24+turn,1,'metal');box(37,21+turn,5,3,'metal');box(39,20+turn,2,3,'ink');}
      else if(!talking){box(31-step,38,2,6,'metal');box(30-step,42,4,3,'metal');box(31-step,43,2,2,'ink');}
      box(21,19,6,6,'ink');box(22,20,4,5,'skinDark');
      poly([[19,9],[28,9],[31,12],[31,18],[29,22],[21,22],[18,19],[17,13]],'ink');
      poly([[20,10],[28,10],[30,13],[30,17],[28,21],[22,21],[19,18],[19,13]],'skin');
      box(23,11,5,6,'skinLight');box(20,13,2,4,'skin');box(29,15,3,3,'skin');box(30,15,2,1,'skinLight');
      box(18,14,3,4,'skinDark');box(19,14,2,2,'skinLight');
      box(21,19,7,3,'hair');box(23,20,4,1,'hairLight');box(27,18,3,2,'hair');box(27,18,2,1,'hairLight');
      box(25,13,4,1,'hair');box(26,14,2,blink?1:2,'ink');if(!blink)box(27,14,1,1,'cloth');
      if(talking&&frame%4<2)box(27,19,2,1,'ink');
      poly([[18,7],[20,5],[27,5],[30,8],[30,11],[17,11]],'ink');
      box(20,6,7,2,'coat');box(18,8,11,2,'light');box(21,7,3,1,'light');box(18,10,15,2,'deep');box(21,10,11,1,'coat');box(27,8,2,2,'metal');
    }else{
      limb([16,26],[13,32],[15,35],3,'coat');
      poly([[18,22],[28,22],[31,27],[30,34],[33,43],[29,45],[15,44],[14,39],[16,32],[15,27]],'ink');
      poly([[19,23],[27,23],[29,27],[28,33],[30,42],[28,43],[17,42],[16,39],[18,32],[17,27]],'coat');
      box(19,25,3,8,'light');box(26,26,2,9,'deep');box(20,23,6,3,'cloth');
      poly([[20,28],[25,28],[26,34],[28,42],[18,42],[19,34]],'clothDark');
      poly([[21,29],[24,29],[25,35],[26,41],[19,41],[20,34]],'cloth');
      box(19,35,6,1,'leatherDark');box(21,37,4,3,'clothDark');box(21,37,4,1,'seam');
      box(28,32,3,6,'leatherDark');box(29,33,2,4,'leatherLight');
      const reach=working?[0,1,2,3,4,4,3,2,1,0,0,0,1,2,1,0][frame]:0;
      const hand=working?[34+reach,37+Math.floor(reach/2)]:talking?[33,29+(frame%8<4?0:2)]:[30,35];
      limb([28,26],working?[32,31]:[31,30],hand,3,'coat');
      box(29,28,3,3,'cloth');box(29,28,3,1,'seam');
      box(21,18,5,7,'ink');box(22,19,3,5,'skin');
      poly([[18,8],[21,6],[27,7],[30,10],[31,16],[28,21],[21,21],[17,16],[17,11]],'ink');
      poly([[20,9],[27,9],[29,12],[29,17],[27,20],[22,20],[19,16],[19,12]],'skin');
      box(23,11,5,5,'skinLight');box(28,15,3,2,'skin');box(29,15,2,1,'skinLight');
      box(18,12,3,5,'hair');box(19,11,2,4,'hairLight');
      box(25,12,3,1,'hair');box(26,14,2,blink?1:2,'ink');if(!blink)box(27,14,1,1,'cloth');box(27,18,2,1,'skinDark');
      if(talking&&frame%4<2)box(27,18,2,2,'ink');
      poly([[17,9],[18,7],[22,5],[27,6],[30,8],[29,11],[23,10],[20,11]],'leatherDark');
      poly([[18,8],[22,6],[27,7],[29,9],[24,9],[20,10],[18,11]],'leather');
      box(22,7,4,1,'leatherLight');box(18,10,2,3,'leather');box(16,11,3,4,'leatherDark');box(17,12,2,2,'leatherLight');
      for(let k=0;k<4;k++){const bx=17+(k%2),by=16+k*3;box(bx,by,4,4,'ink');box(bx+1,by,2,3,k%2?'hair':'hairLight');}box(18,27,3,2,'metal');
      if(!working&&!talking){
        box(12,34,23,5,'ink');box(13,35,21,2,'leather');box(14,37,19,2,'leatherDark');box(13,34,21,1,'leatherLight');
        for(const x of [16,23,30]){box(x-2,29,5,5,'leatherDark');box(x-1,29,3,4,'leather');box(x-2,28,5,2,'leatherLight');box(x-1,28,3,1,'leatherDark');box(x,24,1,5,'coat');box(x-2,24,2,2,'light');box(x+1,22,2,3,'coat');box(x+1,22,1,1,'seam');}
        box(12,34,3,2,'skinLight');box(31,34,3,2,'skinLight');
      }else if(working&&reach>=3){box(hand[0],hand[1]-3,1,3,'coat');box(hand[0]-2,hand[1]-4,2,2,'light');box(hand[0]+1,hand[1]-5,2,2,'coat');}
    }
    ctx.restore();ctx.restore();
  }
  root.ResidentArt={width:48,height:64,feetY:54,palettes,modes:['idle','walk','talk','work'],frames:16,paint};
})(typeof module==='object'?module.exports:window);
