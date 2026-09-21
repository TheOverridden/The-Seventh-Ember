'use strict';

(()=>{
 const canvas=document.getElementById('bootArt');
 if(!canvas)return;
 const ctx=canvas.getContext('2d',{alpha:false});
 const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion:reduce)').matches;
 ctx.imageSmoothingEnabled=false;
 const fill=(x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 const line=(x0,y0,x1,y1,color,size=1)=>{x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;let err=dx+dy;for(;;){fill(x0,y0,size,size,color);if(x0===x1&&y0===y1)break;const e2=err*2;if(e2>=dy){err+=dy;x0+=sx;}if(e2<=dx){err+=dx;y0+=sy;}}};
 const diamond=(x,y,r,color,size=1)=>{line(x,y-r,x+r,y,color,size);line(x+r,y,x,y+r,color,size);line(x,y+r,x-r,y,color,size);line(x-r,y,x,y-r,color,size);};
 const block=(x,y,w,h,shade)=>{fill(x,y,w,h,shade);fill(x+2,y+2,w-4,2,'#3b4350');fill(x+w-3,y+3,2,h-5,'#10151e');fill(x+3,y+h-3,w-6,1,'#0a0e15');};
 const shard=(x,y,front,turn)=>{const light=front?'#ffe39a':'#b37536',mid=front?'#e7a64c':'#7c4b29',dark='#342018';if(turn%2){fill(x-2,y-5,4,2,light);fill(x-4,y-3,7,5,mid);fill(x-2,y+2,3,4,dark);fill(x+2,y-2,2,3,light);}else{fill(x-4,y-2,3,4,mid);fill(x-1,y-5,4,9,light);fill(x+3,y-2,3,5,dark);fill(x,y-3,2,4,'#fff2bc');}};
 const lantern=(x,y,frame)=>{fill(x-10,y-14,20,3,'#171d25');fill(x-8,y-18,16,4,'#4b5260');fill(x-7,y-15,3,23,'#303946');fill(x+4,y-15,3,23,'#303946');fill(x-8,y+8,16,3,'#171d25');fill(x-11,y+11,22,4,'#2a313b');fill(x-3,y-22,6,4,'#78613d');fill(x-4,y-11,8,15,'#351e18');const f=frame%4;fill(x-4,y-7-f%2,8,9+f%2,'#c44c27');fill(x-3,y-11+(f===2?1:0),6,10,'#f18a39');fill(x-1,y-10,3,8,'#ffe18b');fill(x,y-7,1,4,'#fff8c9');ctx.strokeStyle='#6d5737';ctx.strokeRect(x-14,y-25,28,41);ctx.strokeStyle='#382d25';ctx.strokeRect(x-16,y-27,32,45);};
 const ember=(frame)=>{const x=160,y=151,bob=frame%8<4?0:-1;fill(x-15,y+10,30,3,'#030407');fill(x-10,y+8,20,2,'#101016');const satellites=[];for(let i=0;i<3;i++){const step=(frame+i*8)%24,a=step/24*Math.PI*2;satellites.push({x:Math.round(x+Math.cos(a)*17),y:Math.round(y+bob-4+Math.sin(a)*6),front:Math.sin(a)>0,turn:(step/3|0)%2});}for(const s of satellites)if(!s.front)shard(s.x,s.y,false,s.turn);const rows=[[4,0,2],[3,1,4],[2,2,6],[1,3,8],[0,4,10],[0,5,10],[1,6,8],[1,7,8],[2,8,6],[3,9,4],[4,10,2]];for(const [rx,ry,rw]of rows)fill(x-10+rx*2,y-14+bob+ry*2,rw*2,2,'#3a2319');fill(x-6,y-10+bob,12,14,'#b74f25');fill(x-4,y-12+bob,8,13,'#f08735');fill(x-3,y-9+bob,6,10,'#ffc55d');fill(x-1,y-8+bob,3,7,'#fff2b0');fill(x-5,y+4+bob,10,3,'#6f3520');fill(x-8,y-2+bob,3,5,'#e06a2d');fill(x+5,y-5+bob,3,5,'#ffd36f');for(const s of satellites)if(s.front)shard(s.x,s.y,true,s.turn);};
 const scene=ms=>{
  const frame=reduced?0:Math.floor(ms/125);
  fill(0,0,320,180,'#04060a');
  fill(0,0,320,18,'#080b11');
  for(let y=10,row=0;y<139;y+=12,row++){const offset=row%2?12:0;for(let x=-offset;x<320;x+=24){const tone=(row+x/12)%3===0?'#111722':'#0d131d';fill(x+1,y+1,22,10,tone);fill(x+2,y+2,18,1,'#242d3c');fill(x+20,y+3,2,7,'#070b11');}}
  for(let i=0;i<18;i++){const x=(i*47+13)%320,y=(i*31+frame*(i%3===0?1:0))%132;fill(x,y,i%5===0?2:1,i%5===0?2:1,i%4===0?'#76502f':'#29303b');}
  fill(0,138,320,42,'#080b10');fill(0,139,320,3,'#303745');
  for(let y=146;y<180;y+=9){fill(0,y,320,1,'#181e28');for(let x=(y%18?8:0);x<320;x+=32)fill(x,y,1,9,'#111720');}
  line(160,140,94,180,'#1d2430');line(160,140,226,180,'#1d2430');line(160,140,42,180,'#121821');line(160,140,278,180,'#121821');
  fill(106,29,108,111,'#070a10');fill(111,34,98,106,'#111722');fill(118,40,84,96,'#080c13');
  fill(125,47,70,83,'#05070c');fill(127,49,66,79,'#0b1018');fill(159,49,2,79,'#2d2a29');
  for(let y=44;y<140;y+=15){block(84,y,23,13,y%30?'#242b36':'#202732');block(213,y,23,13,y%30?'#202732':'#242b36');}
  const crown=[[96,31],[108,20],[124,12],[144,8],[164,8],[184,12],[200,20],[212,31]];for(const [x,y]of crown)block(x,y,24,14,(x/8)%2?'#28303b':'#222a35');
  fill(92,137,136,5,'#2b323c');fill(99,133,122,4,'#171d25');
  ctx.strokeStyle='#67543b';ctx.strokeRect(122,44,76,88);ctx.strokeStyle='#2e2b29';ctx.strokeRect(126,48,68,80);
  const gateFrame=frame%32,ringPulse=gateFrame<16?0:1;
  diamond(160,83,27+ringPulse,'#6f5635',2);diamond(160,83,20,'#b68b4a',1);diamond(160,83,9,'#dfb65f',2);fill(156,79,9,9,'#f5d58a');fill(159,82,3,3,'#fff4bd');
  for(let i=0;i<7;i++){const a=(frame%56)/56*Math.PI*2+i*Math.PI*2/7,rx=36,ry=25;shard(Math.round(160+Math.cos(a)*rx),Math.round(83+Math.sin(a)*ry),Math.sin(a)>0,(frame+i)%2);}
  for(const x of [137,149,171,183]){fill(x,112,1,13,'#4f402c');fill(x,114,1,7,'#b18a4b');}
  lantern(66,92,frame);lantern(254,92,frame+2);
  for(let i=0;i<8;i++){const phase=(frame+i*7)%48,x=66+(i%2?188:0)+(i%3-1)*5,y=75-Math.floor(phase*.65);if(y>20)fill(x,y,i%3===0?2:1,i%3===0?2:1,i%2?'#f29b47':'#ffd17a');}
  ember(frame);
  fill(157,168,6,1,'#734229');fill(159,170,2,1,'#d27a38');
  ctx.strokeStyle='#111722';ctx.strokeRect(.5,.5,319,179);ctx.strokeStyle='#59452e';ctx.strokeRect(4.5,4.5,311,171);
  if(canvas.isConnected&&!reduced)requestAnimationFrame(scene);
 };
 requestAnimationFrame(scene);
})();
