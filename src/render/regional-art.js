const FLOOR_CHARACTER_ART_VERSION=6;
function lateVariant(){
  const r=lateRegion(G.floor);return r?clamp(G.floor-r.from,0,4):0;
}
function lateArtPalette(key){
  return {
    reservoir:{dark:'#101f28',mid:'#294653',edge:'#557783',light:'#92d3d8',hot:'#c9f7e9'},
    foundry:{dark:'#211514',mid:'#543027',edge:'#9a5338',light:'#e29250',hot:'#ffd17b'},
    observatory:{dark:'#141d2c',mid:'#293f55',edge:'#527f98',light:'#95dce9',hot:'#e7fbff'},
    archive:{dark:'#211d19',mid:'#4d4438',edge:'#87765b',light:'#cbb88e',hot:'#f2e2b3'},
    court:{dark:'#241820',mid:'#50303e',edge:'#98586e',light:'#dc94a8',hot:'#ffe0d2'},
    choir:{dark:'#161a2d',mid:'#343d66',edge:'#6577a7',light:'#aab9e9',hot:'#eef0ff'},
    citadel:{dark:'#1d1518',mid:'#44272a',edge:'#7f4038',light:'#c16a4d',hot:'#ffc17f'},
    heart:{dark:'#211b20',mid:'#514144',edge:'#9f7b58',light:'#e1bc72',hot:'#fff0ae'}
  }[key]||{dark:'#171b22',mid:'#35404d',edge:'#718096',light:'#b8c0cc',hot:'#ffffff'};
}
function lateBox(ctx,x,y,w,h,dark,mid,edge){
  ctx.fillStyle=dark;ctx.fillRect(x-2,y-2,w+4,h+4);
  ctx.fillStyle=mid;ctx.fillRect(x,y,w,h);
  ctx.fillStyle=edge;ctx.fillRect(x+2,y+2,w-4,2);
  ctx.fillRect(x+2,y+2,2,h-4);
  ctx.fillStyle=dark;ctx.fillRect(x+w-4,y+4,2,h-6);ctx.fillRect(x+4,y+h-4,w-8,2);
}
function lateChain(ctx,x,y,len,p){
  ctx.strokeStyle=p.dark;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+len);ctx.stroke();
  ctx.strokeStyle=p.edge;ctx.lineWidth=2;
  for(let i=4;i<len;i+=8){ctx.beginPath();ctx.ellipse(x,y+i,3,5,(i/8)%2?0:Math.PI/2,0,TAU);ctx.stroke();}
}
function lateProp(ctx,key,kind,x,y,scale,seed){
  const p=lateArtPalette(key),t=save.motion?0:G.tAll,bob=save.motion?0:Math.sin(t*1.45+seed)*1.25;
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale||1,scale||1);ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='rgba(2,4,7,.35)';ctx.fillRect(-30,14,60,7);
  if(key==='reservoir'){
    if(kind===0){
      lateBox(ctx,-25,-20,50,36,p.dark,p.mid,p.edge);ctx.fillStyle=p.dark;ctx.fillRect(-17,-12,34,20);
      ctx.strokeStyle=p.light;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-2,10,0,TAU);ctx.stroke();
      for(let i=0;i<8;i++){const a=i*TAU/8;ctx.fillStyle=p.light;ctx.fillRect(Math.round(Math.cos(a)*14)-2,-4+Math.round(Math.sin(a)*14),4,4);}
      ctx.fillStyle=p.hot;ctx.fillRect(-2,-7,4,10);ctx.fillRect(-7,-4,14,4);
    }else if(kind===1){
      for(const s of [-1,1]){ctx.fillStyle=p.dark;ctx.fillRect(s*12-5,-41,10,54);ctx.fillStyle=p.edge;ctx.fillRect(s*12-2,-38,4,45);}
      lateBox(ctx,-25,5,50,13,p.dark,p.mid,p.edge);ctx.fillStyle=p.light;ctx.fillRect(-20,-34,8,5);ctx.fillRect(12,-22,8,5);
      ctx.strokeStyle=p.mid;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-12,-34);ctx.quadraticCurveTo(0,-52,12,-34);ctx.stroke();
    }else if(kind===2){
      ctx.fillStyle=p.dark;ctx.fillRect(-4,-44,8,56);ctx.fillStyle=p.edge;ctx.fillRect(-1,-42,3,49);
      ctx.fillStyle='#59482f';ctx.fillRect(-20,-12,40,6);ctx.fillStyle=p.mid;ctx.beginPath();ctx.moveTo(-17,-10);ctx.lineTo(17,-10);ctx.lineTo(11,8);ctx.lineTo(-11,8);ctx.closePath();ctx.fill();
      ctx.fillStyle=p.light;ctx.fillRect(-12,-9,24,3);ctx.fillStyle=p.hot;ctx.fillRect(-3,-31+bob,6,8);
    }else if(kind===3){
      lateBox(ctx,-28,2,56,16,p.dark,p.mid,p.edge);ctx.fillStyle=p.edge;ctx.fillRect(-21,-5,42,8);
      ctx.strokeStyle=p.light;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-13,16,0,TAU);ctx.stroke();
      ctx.fillStyle=p.dark;ctx.beginPath();ctx.arc(0,-13,7,0,TAU);ctx.fill();ctx.fillStyle=p.hot;ctx.fillRect(-2,-28,4,15);
    }else{
      ctx.fillStyle=p.dark;ctx.fillRect(-24,-45,6,61);ctx.fillRect(18,-45,6,61);ctx.fillRect(-24,-46,48,6);
      lateChain(ctx,0,-43,20,p);ctx.fillStyle=p.edge;ctx.beginPath();ctx.moveTo(-17,-20);ctx.lineTo(17,-20);ctx.lineTo(12,4);ctx.lineTo(-12,4);ctx.closePath();ctx.fill();
      ctx.fillStyle=p.light;ctx.fillRect(-11,-18,7,18);ctx.fillStyle=p.dark;ctx.fillRect(-20,4,40,5);ctx.fillStyle=p.hot;ctx.fillRect(-2,7,4,8);
    }
  }else if(key==='foundry'){
    if(kind===0){
      lateBox(ctx,-27,-2,54,18,p.dark,p.mid,p.edge);ctx.fillStyle=p.dark;ctx.fillRect(-19,-11,38,9);ctx.fillStyle=p.edge;ctx.fillRect(-13,-24,26,13);ctx.fillStyle=p.light;ctx.fillRect(-9,-23,18,3);
      ctx.fillStyle='#111217';ctx.fillRect(-5,16,10,8);ctx.fillStyle=p.hot;ctx.fillRect(-3,-20,6,3);
    }else if(kind===1){
      lateBox(ctx,-28,-14,56,29,p.dark,p.mid,p.edge);ctx.fillStyle='#151217';ctx.fillRect(-21,-8,42,17);
      ctx.fillStyle=p.edge;for(let i=0;i<4;i++)ctx.fillRect(-18+i*12,-5+(i%2)*4,8,6);
      ctx.fillStyle=p.hot;ctx.fillRect(-14,5,28,3);ctx.fillStyle='#df673b';ctx.fillRect(-10,8,20,3);
    }else if(kind===2){
      ctx.fillStyle=p.dark;ctx.fillRect(-27,-38,6,55);ctx.fillRect(21,-38,6,55);ctx.fillRect(-27,-41,54,6);
      for(let i=0;i<3;i++){const xx=-15+i*15;ctx.fillStyle=p.edge;ctx.fillRect(xx,-34,7,28);ctx.fillStyle=p.light;ctx.fillRect(xx+2,-31,3,19);ctx.fillStyle=p.dark;ctx.fillRect(xx-4,-7,15,6);}
      ctx.fillStyle=p.hot;ctx.fillRect(-23,9,46,4);
    }else if(kind===3){
      for(const s of [-1,1]){lateBox(ctx,s*15-10,-22,20,39,p.dark,p.mid,p.edge);ctx.fillStyle=p.dark;ctx.fillRect(s*15-6,-16,12,25);ctx.fillStyle='#7b3b2f';ctx.fillRect(s*15-3,-13,6,18);}
      ctx.fillStyle=p.light;ctx.fillRect(-23,-26,16,4);ctx.fillRect(7,-26,16,4);
    }else{
      lateBox(ctx,-30,-35,60,51,p.dark,p.mid,p.edge);ctx.fillStyle='#0c0c10';ctx.fillRect(-21,-27,42,35);
      ctx.fillStyle='#762e23';ctx.fillRect(-16,-18,32,24);ctx.fillStyle='#d85b2f';ctx.fillRect(-11,-12,22,17);ctx.fillStyle=p.hot;ctx.fillRect(-5,-8,10,13);
      ctx.fillStyle=p.edge;ctx.fillRect(-34,-27,6,43);ctx.fillRect(28,-27,6,43);
    }
  }else if(key==='observatory'){
    if(kind===0){
      ctx.strokeStyle=p.edge;ctx.lineWidth=4;for(let i=0;i<3;i++){ctx.save();ctx.rotate(i*.78+t*.04);ctx.beginPath();ctx.ellipse(0,-10,25-i*5,9+i*6,0,0,TAU);ctx.stroke();ctx.restore();}
      ctx.fillStyle=p.hot;ctx.beginPath();ctx.arc(0,-10+bob,5,0,TAU);ctx.fill();lateBox(ctx,-19,4,38,13,p.dark,p.mid,p.edge);
    }else if(kind===1){
      ctx.fillStyle=p.dark;ctx.fillRect(-5,-32,10,49);ctx.fillStyle=p.edge;ctx.fillRect(-2,-29,4,43);
      ctx.strokeStyle=p.light;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,-35,18,-.35,Math.PI+.35);ctx.stroke();ctx.fillStyle=p.hot;ctx.fillRect(-7,-41,14,11);ctx.fillStyle='#b9ecff';ctx.fillRect(-3,-39,6,7);
    }else if(kind===2){
      for(const s of [-1,1]){ctx.save();ctx.translate(s*15,-9+s*5);ctx.rotate(s*.28);ctx.strokeStyle=p.edge;ctx.lineWidth=4;ctx.strokeRect(-10,-18,20,36);ctx.fillStyle=p.light+'55';ctx.fillRect(-7,-15,14,30);ctx.fillStyle=p.hot;ctx.fillRect(-5,-13,4,22);ctx.restore();}
      lateBox(ctx,-26,10,52,8,p.dark,p.mid,p.edge);
    }else if(kind===3){
      lateBox(ctx,-30,-27,60,44,p.dark,p.mid,p.edge);ctx.fillStyle='#0b1020';ctx.fillRect(-24,-21,48,31);
      for(let i=0;i<13;i++){const xx=((i*17+seed*3)%43)-21,yy=((i*11+seed)%25)-18;ctx.fillStyle=i%4?p.light:p.hot;ctx.fillRect(xx,yy,i%4?2:3,i%4?2:3);}
      ctx.strokeStyle=p.edge;ctx.beginPath();ctx.moveTo(-20,5);ctx.lineTo(-2,-15);ctx.lineTo(17,-2);ctx.stroke();
    }else{
      ctx.save();ctx.rotate(-.35);lateBox(ctx,-24,-12,48,23,p.dark,p.mid,p.edge);ctx.fillStyle=p.light+'66';ctx.fillRect(-18,-8,32,15);ctx.fillStyle=p.hot;ctx.fillRect(8,-6,8,11);ctx.restore();
      ctx.fillStyle=p.dark;ctx.fillRect(-4,0,8,18);ctx.fillRect(-20,15,40,5);ctx.strokeStyle=p.edge;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,-7,31,Math.PI,TAU);ctx.stroke();
    }
  }else if(key==='archive'){
    if(kind===0){
      lateBox(ctx,-29,-18,58,35,p.dark,p.mid,p.edge);ctx.fillStyle='#171512';ctx.fillRect(-22,-11,44,21);
      for(let i=0;i<3;i++){ctx.fillStyle=p.edge;ctx.fillRect(-19+i*14,-8,10,7);ctx.fillStyle=p.light;ctx.fillRect(-16+i*14,-6,4,2);ctx.fillStyle=p.mid;ctx.fillRect(-19+i*14,2,10,6);}
    }else if(kind===1){
      lateBox(ctx,-29,-37,58,54,p.dark,p.mid,p.edge);
      for(let y=-30;y<10;y+=13){ctx.fillStyle=p.dark;ctx.fillRect(-23,y,46,4);for(let x=-20;x<20;x+=8){ctx.fillStyle=((x+y+seed)&8)?p.edge:p.light;ctx.fillRect(x,y-7,5,7);}}
    }else if(kind===2){
      lateBox(ctx,-28,-8,56,14,p.dark,p.mid,p.edge);ctx.fillStyle=p.edge;ctx.fillRect(-25,-12,50,6);ctx.fillStyle=p.light;ctx.fillRect(-19,-10,28,2);
      ctx.fillStyle='#2b2420';ctx.fillRect(-23,5,6,14);ctx.fillRect(17,5,6,14);ctx.fillStyle=p.hot;for(let i=0;i<4;i++)ctx.fillRect(-17+i*10,-19-i%2*4,7,9+i%2*4);
    }else if(kind===3){
      lateBox(ctx,-30,-34,60,52,p.dark,p.mid,p.edge);for(let i=0;i<5;i++){const x=-23+i*10;ctx.fillStyle=i%2?p.edge:p.light;ctx.fillRect(x,-27,7,35-(i%3)*7);ctx.fillStyle=p.dark;ctx.fillRect(x+1,-24,2,27);}
      ctx.fillStyle='#17140f';ctx.fillRect(-20,9,40,5);
    }else{
      ctx.fillStyle=p.dark;ctx.fillRect(-4,-42,8,55);ctx.fillStyle=p.edge;ctx.fillRect(-1,-39,3,49);lateBox(ctx,-27,5,54,13,p.dark,p.mid,p.edge);
      ctx.fillStyle='#eee0b5';ctx.fillRect(-20,-18,40,24);ctx.fillStyle='#5d5141';for(let y=-14;y<3;y+=5)ctx.fillRect(-16,y,29-(y%3),2);ctx.fillStyle='#231d19';ctx.fillRect(-2,-22,4,29);
    }
  }else if(key==='court'){
    if(kind===0){
      lateBox(ctx,-29,-8,58,18,p.dark,p.mid,p.edge);ctx.fillStyle=p.light;ctx.fillRect(-24,-14,48,6);ctx.fillStyle='#ead0bc';for(let i=0;i<4;i++)ctx.fillRect(-19+i*12,-19-i%2*3,8,5);
      ctx.fillStyle=p.dark;ctx.fillRect(-24,10,5,9);ctx.fillRect(19,10,5,9);
    }else if(kind===1){
      ctx.fillStyle=p.dark;ctx.fillRect(-31,-9,62,20);ctx.fillStyle=p.mid;ctx.fillRect(-28,-13,56,20);ctx.fillStyle=p.edge;ctx.fillRect(-24,-11,48,3);
      for(let i=0;i<5;i++){ctx.fillStyle='#d6c4ac';ctx.fillRect(-21+i*11,-17+(i%2)*3,8,5);ctx.fillStyle=p.light;ctx.fillRect(-19+i*11,-15+(i%2)*3,4,2);}
      ctx.fillStyle=p.dark;ctx.fillRect(-23,7,5,12);ctx.fillRect(18,7,5,12);
    }else if(kind===2){
      lateBox(ctx,-24,-40,48,57,p.dark,p.mid,p.edge);ctx.fillStyle='#281b25';ctx.fillRect(-18,-34,36,43);
      ctx.fillStyle=p.light;ctx.beginPath();ctx.ellipse(0,-18,9,13,0,0,TAU);ctx.fill();ctx.fillStyle=p.dark;ctx.fillRect(-4,-23,8,4);ctx.fillRect(-9,-5,18,13);
      ctx.fillStyle=p.hot;ctx.fillRect(-15,3,30,3);
    }else if(kind===3){
      for(const s of [-1,1]){lateBox(ctx,s*15-12,-27,24,43,p.dark,p.mid,p.edge);ctx.fillStyle=s<0?'#713447':'#4b375f';ctx.fillRect(s*15-7,-20,14,25);ctx.fillStyle=p.light;ctx.fillRect(s*15-3,-31,6,7);}
      ctx.fillStyle=p.hot;ctx.fillRect(-3,-35,6,46);
    }else{
      for(const s of [-1,1]){lateBox(ctx,s*17-13,-28,26,45,p.dark,p.mid,p.edge);ctx.fillStyle=p.edge;ctx.fillRect(s*17-8,-21,16,31);ctx.fillStyle=p.light;ctx.fillRect(s*17-5,-18,5,25);ctx.fillStyle=p.hot;ctx.fillRect(s*17-3,-35,6,9);}
      ctx.fillStyle=p.dark;ctx.fillRect(-5,-7,10,25);
    }
  }else if(key==='choir'){
    if(kind===0){
      for(let i=0;i<5;i++){const x=-24+i*12,h=28+(i%3)*8;ctx.fillStyle=p.dark;ctx.fillRect(x,-h,9,h+17);ctx.fillStyle=p.edge;ctx.fillRect(x+2,-h+3,4,h+8);ctx.fillStyle=p.light;ctx.fillRect(x+3,-h+5,2,7);}
      lateBox(ctx,-31,8,62,10,p.dark,p.mid,p.edge);
    }else if(kind===1){
      ctx.fillStyle=p.dark;ctx.fillRect(-24,-43,6,61);ctx.fillRect(18,-43,6,61);ctx.fillRect(-24,-45,48,6);lateChain(ctx,0,-42,16,p);
      ctx.fillStyle=p.edge;ctx.beginPath();ctx.moveTo(-18,-23);ctx.lineTo(18,-23);ctx.lineTo(12,2);ctx.lineTo(-12,2);ctx.closePath();ctx.fill();ctx.fillStyle=p.light;ctx.fillRect(-12,-20,7,18);ctx.fillStyle=p.hot;ctx.fillRect(-2,3,4,10);
    }else if(kind===2){
      for(let i=0;i<4;i++){ctx.fillStyle=p.dark;ctx.fillRect(-28+i*18,-7-i*9,16,8);ctx.fillStyle=p.edge;ctx.fillRect(-25+i*18,-10-i*9,10,5);}
      ctx.strokeStyle=p.light;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-27,4);ctx.quadraticCurveTo(0,-38,27,-8);ctx.stroke();ctx.fillStyle=p.hot;ctx.fillRect(18,-16+bob,4,4);
    }else if(kind===3){
      for(const s of [-1,1]){ctx.fillStyle=p.dark;ctx.fillRect(s*13-3,-39,6,51);ctx.fillStyle=p.edge;ctx.fillRect(s*13-1,-36,3,44);ctx.strokeStyle=p.light;ctx.lineWidth=3;ctx.beginPath();ctx.arc(s*13,-42,11,0,TAU);ctx.stroke();}
      ctx.fillStyle=p.hot;ctx.fillRect(-2,-49,4,59);lateBox(ctx,-25,8,50,10,p.dark,p.mid,p.edge);
    }else{
      ctx.fillStyle=p.dark;ctx.fillRect(-29,-36,7,53);ctx.fillRect(22,-36,7,53);ctx.fillRect(-29,-39,58,7);
      for(let i=0;i<3;i++){const x=-14+i*14;lateChain(ctx,x,-35,12+i*4,p);ctx.fillStyle=p.edge;ctx.beginPath();ctx.moveTo(x-9,-23+i*4);ctx.lineTo(x+9,-23+i*4);ctx.lineTo(x+5,-9+i*4);ctx.lineTo(x-5,-9+i*4);ctx.closePath();ctx.fill();}
      ctx.fillStyle=p.hot;ctx.fillRect(-2,-4,4,17);
    }
  }else if(key==='citadel'){
    if(kind===0){
      for(let i=0;i<4;i++){ctx.save();ctx.translate(-23+i*15,-7);ctx.rotate(i%2?.18:-.12);lateBox(ctx,-6,-27,12,42,p.dark,p.mid,p.edge);ctx.fillStyle=p.light;ctx.fillRect(-3,-24,3,31);ctx.restore();}
      ctx.fillStyle=p.dark;ctx.fillRect(-31,11,62,7);
    }else if(kind===1){
      lateBox(ctx,-26,-31,52,48,p.dark,p.mid,p.edge);ctx.fillStyle='#151114';ctx.fillRect(-18,-24,36,31);
      ctx.strokeStyle=p.light;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,-8,12,0,TAU);ctx.stroke();lateChain(ctx,-18,-23,29,p);lateChain(ctx,18,-23,29,p);
    }else if(kind===2){
      for(let i=0;i<3;i++){lateBox(ctx,-27+i*18,-10-(i%2)*10,18,27,p.dark,p.mid,p.edge);ctx.fillStyle=p.light;ctx.fillRect(-22+i*18,-6-(i%2)*10,4,4);}
      ctx.fillStyle='#b96340';for(let i=0;i<3;i++)ctx.fillRect(-21+i*18,-15-(i%2)*10,7,4);
    }else if(kind===3){
      lateBox(ctx,-30,-28,60,45,p.dark,p.mid,p.edge);ctx.fillStyle='#111014';ctx.fillRect(-22,-20,44,29);ctx.fillStyle=p.edge;for(let i=0;i<3;i++)ctx.fillRect(-17+i*16,-16,7,22);
      ctx.fillStyle=p.hot;ctx.fillRect(-3,-25,6,36);ctx.fillRect(-12,-9,24,5);
    }else{
      lateBox(ctx,-31,-30,62,47,p.dark,p.mid,p.edge);ctx.fillStyle='#151116';ctx.fillRect(-23,-23,46,31);
      ctx.fillStyle=p.edge;ctx.fillRect(-16,-14,32,23);ctx.fillStyle=p.light;ctx.fillRect(-11,-19,22,7);ctx.fillStyle=p.hot;ctx.fillRect(-3,-26,6,37);
      ctx.fillStyle=p.dark;ctx.fillRect(-34,10,68,8);
    }
  }else{
    if(kind===0){
      for(let i=0;i<5;i++){ctx.save();ctx.translate(-25+i*13,-8+(i%2)*5);ctx.rotate((i-2)*.12);ctx.fillStyle=p.mid;ctx.fillRect(-5,-27,10,39);ctx.fillStyle=p.edge;ctx.fillRect(-2,-24,4,31);ctx.fillStyle=p.hot;ctx.fillRect(-1,-22,2,8);ctx.restore();}
      ctx.fillStyle=p.dark;ctx.fillRect(-31,12,62,7);
    }else if(kind===1){
      ctx.strokeStyle='#59442e';ctx.lineWidth=9;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-24+i*12,17);ctx.quadraticCurveTo(-16+i*8,-16-i*4,-18+i*9,-39);ctx.stroke();}
      ctx.strokeStyle=p.edge;ctx.lineWidth=3;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-24+i*12,17);ctx.quadraticCurveTo(-16+i*8,-16-i*4,-18+i*9,-39);ctx.stroke();}
      ctx.fillStyle=p.hot;for(let i=0;i<4;i++)ctx.fillRect(-22+i*15,-23-i%2*7,6,3);
    }else if(kind===2){
      lateBox(ctx,-30,-35,60,52,p.dark,p.mid,p.edge);for(let i=0;i<4;i++){ctx.fillStyle=p.light;ctx.fillRect(-23,-27+i*11,34+i*4,5);ctx.fillStyle=p.hot;ctx.fillRect(15+i%2*4,-26+i*11,6,3);}
      ctx.fillStyle='#131017';ctx.fillRect(-3,-31,6,43);
    }else if(kind===3){
      ctx.fillStyle=p.dark;ctx.fillRect(-26,-42,7,60);ctx.fillRect(19,-42,7,60);ctx.fillRect(-26,-45,52,7);lateBox(ctx,-18,-33,36,48,p.dark,p.mid,p.edge);
      ctx.fillStyle='#0b0b11';ctx.fillRect(-11,-25,22,33);ctx.fillStyle=p.light;ctx.fillRect(-4,-17,8,18);ctx.fillStyle=p.hot;ctx.fillRect(-2,-14,4,4);ctx.fillRect(-2,-4,4,4);
    }else{
      ctx.strokeStyle=p.edge;ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,-6,27,Math.PI,TAU);ctx.stroke();ctx.fillStyle=p.dark;ctx.fillRect(-30,-7,60,24);ctx.fillStyle=p.mid;ctx.fillRect(-25,-10,50,21);
      for(let i=0;i<7;i++){const a=i*TAU/7+t*.05,r=17+(i%2)*6;ctx.fillStyle=i%2?p.light:p.hot;ctx.fillRect(Math.round(Math.cos(a)*r)-2,-7+Math.round(Math.sin(a)*r*.45)-2,5,5);}
      ctx.fillStyle=p.hot;ctx.beginPath();ctx.arc(0,-7+bob,7,0,TAU);ctx.fill();
    }
  }
  ctx.restore();
}
function drawLateRoomBase(ctx,o,key,v){
  const p=lateArtPalette(key),t=save.motion?0:G.tAll,W=o.w/2,H=o.h/2;
  ctx.save();ctx.translate(o.x,o.y);ctx.beginPath();ctx.rect(-W,-H,o.w,o.h);ctx.clip();ctx.imageSmoothingEnabled=false;
  ctx.fillStyle=p.dark+'18';ctx.fillRect(-W,-H,o.w,o.h);
  if(key==='reservoir'){
    ctx.fillStyle=p.mid+'28';for(let y=-H+14;y<H;y+=34)ctx.fillRect(-W,y,o.w,8);
    ctx.strokeStyle=p.light+'36';ctx.lineWidth=2;for(let y=-H+19;y<H;y+=34){ctx.beginPath();for(let x=-W;x<W;x+=16)ctx.lineTo(x,y+Math.sin(x*.045+o.seed+v)*3);ctx.stroke();}
    ctx.fillStyle=p.dark;ctx.fillRect(-W+7,-H+7,o.w-14,5);ctx.fillStyle=p.edge+'88';for(let x=-W+15;x<W-10;x+=28)ctx.fillRect(x,-H+8,9,3);
  }else if(key==='foundry'){
    ctx.fillStyle='#1b1214aa';ctx.fillRect(-W,-H,o.w,o.h);
    ctx.fillStyle=p.mid;for(let x=-W+16;x<W;x+=52){ctx.fillRect(x,-H,9,o.h);ctx.fillStyle=p.edge+'77';ctx.fillRect(x+3,-H,3,o.h);ctx.fillStyle=p.mid;}
    ctx.fillStyle='#0c0c10';for(let y=-H+22;y<H;y+=46)ctx.fillRect(-W,y,o.w,4);
    ctx.fillStyle=p.hot+'55';ctx.fillRect(-W,-H+7,o.w,3+v);
  }else if(key==='observatory'){
    ctx.strokeStyle=p.edge+'42';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(0,0,Math.min(W,H)*(.35+i*.17),Math.min(W,H)*(.16+i*.09),o.seed*.3+i*.55,0,TAU);ctx.stroke();}
    for(let i=0;i<18;i++){const x=((i*43+o.seed*17)%Math.max(1,Math.floor(o.w-24)))-W+12,y=((i*29+v*17)%Math.max(1,Math.floor(o.h-24)))-H+12;ctx.fillStyle=i%5?p.light+'55':p.hot+'99';ctx.fillRect(x,y,i%5?2:3,i%5?2:3);}
  }else if(key==='archive'){
    ctx.fillStyle='#231e19aa';ctx.fillRect(-W,-H,o.w,o.h);ctx.fillStyle=p.edge+'34';for(let y=-H+18;y<H;y+=42)ctx.fillRect(-W+10,y,o.w-20,5);
    ctx.fillStyle=p.light+'28';for(let x=-W+17;x<W;x+=37)ctx.fillRect(x,-H+7,3,o.h-14);
    ctx.fillStyle='#09080a66';for(let i=0;i<4+v;i++)ctx.fillRect(-W+18+((i*41+o.seed*13)%Math.max(20,o.w-40)),-H+17+((i*31)%Math.max(20,o.h-34)),8+i%3*3,3);
  }else if(key==='court'){
    ctx.fillStyle=p.mid+'32';ctx.fillRect(-W*.28,-H,o.w*.56,o.h);ctx.fillStyle=p.edge+'66';ctx.fillRect(-W*.28+4,-H,o.w*.56-8,3);ctx.fillRect(-W*.28+4,H-4,o.w*.56-8,3);
    ctx.fillStyle=p.light+'42';for(let y=-H+14;y<H;y+=24){ctx.fillRect(-3,y,6,13);ctx.fillRect(-W*.28+8,y+4,8,3);ctx.fillRect(W*.28-16,y+4,8,3);}
    if(v>=3){ctx.fillStyle='#130f16';ctx.fillRect(-2,-H,5,o.h);}
  }else if(key==='choir'){
    ctx.fillStyle=p.mid+'24';for(let x=-W+20;x<W;x+=48)ctx.fillRect(x,-H,12,o.h);
    ctx.strokeStyle=p.light+'36';ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(0,H*.35,30+i*28+v*3,Math.PI,TAU);ctx.stroke();}
    ctx.fillStyle=p.edge+'55';for(let x=-W+24;x<W;x+=48){ctx.fillRect(x+3,-H+7,6,10);ctx.fillRect(x+3,H-17,6,10);}
  }else if(key==='citadel'){
    ctx.fillStyle='#171216bb';ctx.fillRect(-W,-H,o.w,o.h);ctx.strokeStyle=p.edge+'35';ctx.lineWidth=2;
    for(let x=-W-20;x<W;x+=54){ctx.beginPath();ctx.moveTo(x,-H);ctx.lineTo(x+36,H);ctx.stroke();}
    ctx.fillStyle=p.mid+'55';ctx.fillRect(-W+7,-H+7,o.w-14,7);ctx.fillRect(-W+7,H-14,o.w-14,7);ctx.fillStyle=p.light+'55';for(let x=-W+12;x<W;x+=34)ctx.fillRect(x,-H+9,4,3);
  }else{
    for(let i=0;i<9;i++){ctx.save();ctx.rotate(i*TAU/9+o.seed*.1);ctx.fillStyle=(i+v)%3?p.edge+'38':p.light+'52';ctx.fillRect(20,-3,Math.min(W,H)*.72,6);ctx.restore();}
    ctx.strokeStyle=p.hot+'35';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,Math.min(W,H)*.42+Math.sin(t+o.seed)*2,0,TAU);ctx.stroke();
    if(v===1){ctx.strokeStyle='#6f80574a';for(let x=-W+19;x<W;x+=38){ctx.beginPath();ctx.moveTo(x,H);ctx.quadraticCurveTo(x+12,0,x-4,-H);ctx.stroke();}}
  }
  const spots=[
    [-W+44,-H+47,.82], [W-44,-H+47,.82],
    [-W+44,H-38,.76], [W-44,H-38,.76]
  ];
  for(let i=0;i<spots.length;i++){
    if(((i+o.seed+v)&1)===0||i===v%4)lateProp(ctx,key,(v+i+o.seed)%5,spots[i][0],spots[i][1],spots[i][2],o.seed*11+i*7);
  }
  lateProp(ctx,key,v,0,Math.min(9,H*.12),1,o.seed*19+v);
  ctx.restore();
}
drawLateDecor=function(ctx,o){
  drawLateRoomBase(ctx,o,o.type,lateVariant());
};

function drawLateTileCharacter(ctx){
  const w=G.world,key=w.lateKey,p=lateArtPalette(key),v=lateVariant(),x0=Math.max(0,Math.floor(G.cam.x/TILE)-1),x1=Math.min(w.W-1,Math.ceil((G.cam.x+G.w)/TILE)+1),y0=Math.max(0,Math.floor(G.cam.y/TILE)-1),y1=Math.min(w.H-1,Math.ceil((G.cam.y+G.h)/TILE)+1);
  ctx.save();ctx.imageSmoothingEnabled=false;
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){
    const i=ty*w.W+tx,h=((tx*1597334677)^(ty*3812015801)^(G.floor*2654435761))>>>0,x=tx*TILE,y=ty*TILE;
    if(w.grid[i]===1){
      if(h%9!==v%4)continue;
      if(key==='reservoir'){ctx.fillStyle=p.light+'3d';ctx.fillRect(x+5,y+25,18,2);ctx.fillRect(x+10,y+22,13,2);ctx.fillStyle=p.mid+'77';ctx.fillRect(x+28,y+6,3,20);}
      else if(key==='foundry'){ctx.fillStyle='#08090d99';ctx.fillRect(x+7,y+8,3,19);ctx.fillRect(x+10,y+24,13,3);ctx.fillStyle=p.light+'66';ctx.fillRect(x+9,y+10,2,12);}
      else if(key==='observatory'){ctx.fillStyle=p.light+'66';ctx.fillRect(x+7,y+9,3,3);ctx.fillRect(x+24,y+25,2,2);ctx.fillStyle=p.hot+'77';ctx.fillRect(x+15,y+16,4,2);ctx.fillRect(x+16,y+15,2,4);}
      else if(key==='archive'){ctx.fillStyle=p.light+'66';ctx.fillRect(x+5,y+8,12,8);ctx.fillStyle=p.edge+'88';ctx.fillRect(x+7,y+10,8,1);ctx.fillRect(x+7,y+13,6,1);ctx.fillStyle='#11101877';ctx.fillRect(x+25,y+24,6,4);}
      else if(key==='court'){ctx.fillStyle=p.light+'55';ctx.fillRect(x+7,y+9,7,3);ctx.fillRect(x+24,y+21,4,6);ctx.fillStyle=p.edge+'77';ctx.fillRect(x+9,y+8,3,2);}
      else if(key==='choir'){ctx.fillStyle=p.light+'55';ctx.fillRect(x+5,y+15,18,2);ctx.fillRect(x+10,y+19,15,2);ctx.fillStyle=p.hot+'77';ctx.fillRect(x+27,y+8,2,7);}
      else if(key==='citadel'){ctx.fillStyle='#08090daa';ctx.fillRect(x+7,y+7,13,3);ctx.fillRect(x+18,y+10,3,12);ctx.fillStyle=p.edge+'66';ctx.fillRect(x+8,y+6,9,1);}
      else{ctx.fillStyle=((h>>4)&1)?p.light+'66':p.edge+'66';ctx.fillRect(x+7,y+9,5,3);ctx.fillRect(x+24,y+22,3,6);ctx.fillStyle=p.hot+'55';ctx.fillRect(x+15,y+15,3,3);}
    }else{
      const edge=!isSolidTile(w,tx,ty+1)||!isSolidTile(w,tx-1,ty)||!isSolidTile(w,tx+1,ty);if(!edge||h%13!==v%5)continue;
      if(key==='reservoir'){ctx.fillStyle=p.dark;ctx.fillRect(x+4,y+7,28,6);ctx.fillStyle=p.edge;ctx.fillRect(x+6,y+9,24,2);ctx.fillStyle=p.light;ctx.fillRect(x+9,y+6,4,3);}
      else if(key==='foundry'){ctx.fillStyle=p.dark;ctx.fillRect(x+7,y+5,8,27);ctx.fillStyle=p.edge;ctx.fillRect(x+9,y+7,3,22);ctx.fillStyle=p.hot;ctx.fillRect(x+8,y+24,5,3);}
      else if(key==='observatory'){ctx.strokeStyle=p.edge+'88';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+18,y+18,10,.4,4.8);ctx.stroke();ctx.fillStyle=p.light;ctx.fillRect(x+23,y+8,3,3);}
      else if(key==='archive'){ctx.fillStyle=p.edge+'88';ctx.fillRect(x+5,y+8,26,4);ctx.fillStyle=p.light+'77';for(let k=0;k<4;k++)ctx.fillRect(x+7+k*6,y+14,4,10+k%2*3);}
      else if(key==='court'){ctx.fillStyle=p.mid;ctx.fillRect(x+8,y+4,20,28);ctx.fillStyle=p.edge;ctx.fillRect(x+11,y+6,3,23);ctx.fillStyle=p.light;ctx.fillRect(x+18,y+10,6,4);}
      else if(key==='choir'){ctx.fillStyle=p.dark;ctx.fillRect(x+8,y+5,20,27);ctx.fillStyle=p.edge;for(let k=0;k<3;k++)ctx.fillRect(x+11+k*6,y+8,3,20);ctx.fillStyle=p.light;ctx.fillRect(x+13,y+6,12,3);}
      else if(key==='citadel'){ctx.fillStyle='#090a0e';ctx.fillRect(x+5,y+11,27,12);ctx.fillStyle=p.edge;ctx.fillRect(x+9,y+14,19,5);ctx.fillStyle=p.light;ctx.fillRect(x+12,y+15,4,2);}
      else{ctx.fillStyle=p.edge+'88';ctx.fillRect(x+8,y+5,5,27);ctx.fillRect(x+22,y+9,4,21);ctx.fillStyle=p.hot;ctx.fillRect(x+10,y+7,3,7);ctx.fillRect(x+23,y+21,2,5);}
    }
  }
  ctx.restore();
}
const beforeLateTileCharacter=drawPixelFloorDetails;
drawPixelFloorDetails=function(ctx){beforeLateTileCharacter(ctx);if(G.world?.region==='late')drawLateTileCharacter(ctx);};

function drawLateTorches(ctx){
  const w=G.world,key=w.lateKey,p=lateArtPalette(key),cam=G.cam,t=save.motion?0:G.tAll,v=lateVariant();
  const glow={reservoir:'teal',foundry:'ember',observatory:'cyan',archive:'gold',court:'magenta',choir:'blue',citadel:'ember',heart:'gold'}[key]||'ember';
  for(const o of w.torches||[]){
    if(o.x<cam.x-80||o.x>cam.x+G.w+80||o.y<cam.y-90||o.y>cam.y+G.h+90)continue;
    const x=Math.round(o.x),y=Math.round(o.y),f=.94+Math.sin(t*10+o.s)*.05;glowImg(glow,x,y-11,46*f,.46);
    ctx.save();ctx.translate(x,y);ctx.imageSmoothingEnabled=false;
    if(key==='reservoir'){
      ctx.fillStyle=p.dark;ctx.fillRect(-5,-40,10,14);ctx.fillRect(-15,-29,30,5);ctx.fillRect(-16,-25,5,35);ctx.fillRect(11,-25,5,35);ctx.fillRect(-15,10,30,6);
      ctx.fillStyle=p.edge;ctx.fillRect(-12,-23,24,29);ctx.fillStyle='#6db8c26b';ctx.fillRect(-9,-21,18,24);ctx.fillStyle=p.hot;ctx.fillRect(-3,-11,6,12);ctx.fillStyle='#efffc7';ctx.fillRect(-1,-9,3,7);ctx.fillStyle=p.light;ctx.fillRect(-19,15,38,3);
      if(!save.motion){ctx.fillStyle=p.light;ctx.fillRect(-9+Math.round(Math.sin(t*3+o.s)*5),20+Math.round((t*12+o.s)%8),2,3);}
    }else if(key==='foundry'){
      ctx.fillStyle=p.dark;ctx.fillRect(-5,-39,10,13);ctx.fillRect(-17,-28,34,7);ctx.fillRect(-17,-21,6,34);ctx.fillRect(11,-21,6,34);ctx.fillRect(-17,13,34,6);
      ctx.fillStyle=p.edge;for(let k=-8;k<=8;k+=8)ctx.fillRect(k-2,-19,4,28);ctx.fillStyle='#8e3528';ctx.fillRect(-9,-15,18,23);ctx.fillStyle='#ff6b36';ctx.fillRect(-6,-9,12,16);ctx.fillStyle=p.hot;ctx.fillRect(-3,-13,6,17);ctx.fillStyle='#fff2b2';ctx.fillRect(-1,-8,2,8);
    }else if(key==='observatory'){
      ctx.fillStyle=p.dark;ctx.fillRect(-4,-42,8,17);ctx.fillStyle=p.edge;ctx.beginPath();ctx.moveTo(0,-31);ctx.lineTo(17,-13);ctx.lineTo(0,11);ctx.lineTo(-17,-13);ctx.closePath();ctx.fill();
      ctx.fillStyle='#6ecbe266';ctx.beginPath();ctx.moveTo(0,-27);ctx.lineTo(11,-13);ctx.lineTo(0,5);ctx.lineTo(-11,-13);ctx.closePath();ctx.fill();
      ctx.fillStyle=p.hot;ctx.fillRect(-3,-17,6,11);ctx.fillStyle='#ffffff';ctx.fillRect(-1,-15,2,7);ctx.strokeStyle=p.light;ctx.lineWidth=2;ctx.strokeRect(-18,12,36,4);
    }else if(key==='archive'){
      ctx.fillStyle=p.dark;ctx.fillRect(-4,-37,8,18);ctx.fillStyle=p.edge;ctx.fillRect(-17,-23,34,5);ctx.fillRect(-14,-18,28,29);ctx.fillStyle='#bca87a66';ctx.fillRect(-10,-15,20,20);
      ctx.fillStyle='#7c5430';ctx.fillRect(-5,-8,10,15);ctx.fillStyle=p.hot;ctx.fillRect(-3,-16,6,12);ctx.fillStyle='#fff3c4';ctx.fillRect(-1,-13,2,7);ctx.fillStyle=p.light;ctx.fillRect(-18,12,36,4);
      if(v>=2){ctx.fillStyle='#ddd0aa';ctx.fillRect(14,-12,9,6);ctx.fillStyle=p.mid;ctx.fillRect(16,-10,5,1);}
    }else if(key==='court'){
      ctx.fillStyle=p.dark;ctx.fillRect(-3,-40,6,43);ctx.fillRect(-18,1,36,5);ctx.fillStyle=p.edge;ctx.fillRect(-1,-37,3,38);
      for(const s of [-1,0,1]){ctx.fillStyle=p.mid;ctx.fillRect(s*12-4,-3-Math.abs(s)*5,8,12);ctx.fillStyle=p.light;ctx.fillRect(s*12-2,-13-Math.abs(s)*5,4,11);ctx.fillStyle=p.hot;ctx.fillRect(s*12-1,-15-Math.abs(s)*5,2,7);}
      ctx.fillStyle=p.light;ctx.fillRect(-21,12,42,4);
    }else if(key==='choir'){
      ctx.fillStyle=p.dark;ctx.fillRect(-4,-42,8,13);lateChain(ctx,0,-31,12,p);ctx.fillStyle=p.edge;ctx.beginPath();ctx.moveTo(-17,-19);ctx.lineTo(17,-19);ctx.lineTo(11,8);ctx.lineTo(-11,8);ctx.closePath();ctx.fill();
      ctx.fillStyle=p.light;ctx.fillRect(-10,-16,7,19);ctx.fillStyle=p.hot;ctx.fillRect(-2,-11,4,12);ctx.fillStyle='#ffffff';ctx.fillRect(-1,-8,2,6);ctx.fillStyle=p.dark;ctx.fillRect(-19,9,38,5);
    }else if(key==='citadel'){
      ctx.fillStyle=p.dark;ctx.fillRect(-6,-39,12,16);ctx.fillRect(-18,-25,36,39);ctx.fillStyle=p.mid;ctx.fillRect(-13,-20,26,28);ctx.fillStyle='#0a090c';ctx.fillRect(-10,-13,20,10);
      ctx.fillStyle='#c7472d';ctx.fillRect(-7,-11,14,6);ctx.fillStyle=p.hot;ctx.fillRect(-3,-10,6,4);ctx.fillStyle=p.edge;ctx.fillRect(-20,14,40,5);for(let k=-13;k<=13;k+=13)ctx.fillRect(k-2,-23,4,35);
    }else{
      ctx.fillStyle=p.dark;ctx.fillRect(-4,-42,8,16);ctx.fillStyle=p.edge;for(let i=0;i<5;i++){ctx.save();ctx.rotate(i*TAU/5+t*.025);ctx.fillRect(-3,-28,6,24);ctx.restore();}
      ctx.fillStyle=p.light;ctx.beginPath();ctx.arc(0,-9,12,0,TAU);ctx.fill();ctx.fillStyle=p.hot;ctx.beginPath();ctx.arc(0,-9,6,0,TAU);ctx.fill();ctx.fillStyle='#fffbd5';ctx.fillRect(-2,-13,4,8);ctx.fillStyle=p.dark;ctx.fillRect(-18,13,36,5);
    }
    ctx.restore();
  }
}
const detailedEarlyTorches=drawTorches;
drawTorches=function(ctx){if(G.world?.region==='late')drawLateTorches(ctx);else detailedEarlyTorches(ctx);};

const beforeBlessingFloorSetup=setupFloor;
setupFloor=function(f){
  beforeBlessingFloorSetup(f);initCombat();
  if(G.run?.up.reserve)G.player.ammo=G.player.magSize;
};

const beforeMasteryMenuBg=drawMenuBg;
drawMenuBg=function(){beforeMasteryMenuBg();const x=G.ctx,t=save.motion?0:G.tAll;x.save();x.setTransform(G.dpr,0,0,G.dpr,0,0);x.globalCompositeOperation='lighter';for(let i=0;i<18;i++){const px=G.w*(.49+((i*71)%47)/100),py=40+((i*137)%(Math.max(100,G.h-80))),a=.08+.08*Math.sin(t*1.3+i);x.fillStyle='rgba(240,201,121,'+Math.max(.02,a)+')';x.fillRect(Math.round(px),Math.round(py),i%5===0?3:2,i%5===0?3:2);}x.restore();};

function wireMastery(){refreshTreeEss();}
