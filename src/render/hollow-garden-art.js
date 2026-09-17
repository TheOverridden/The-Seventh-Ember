const ENV_ART_VERSION=5;
function envRng(seed){
  let s=(seed>>>0)||1;
  return()=>{s=Math.imul(s^s>>>15,1|s);s^=s+Math.imul(s^s>>>7,61|s);return((s^s>>>14)>>>0)/4294967296;};
}
function earlyEnvironmentArt(w,f){
  if(!w||w.region!=='hollow'||f<1||f>10)return[];
  if(w._environmentArt?.version===ENV_ART_VERSION&&w._environmentArt.floor===f)return w._environmentArt.items;
  const sets=[
    ['gateColumn','oilCache','wardSeal'],
    ['lampPost','oilCache','watchBench'],
    ['bellShrine','watchBench','wallRelief'],
    ['bunkStack','footlocker','watchBench'],
    ['starAltar','gateColumn','watchBanner'],
    ['rootCluster','fernPatch','gardenStone'],
    ['glassFrame','fernPatch','pottingBench'],
    ['dryFountain','gardenBench','rootCluster'],
    ['seedTable','fungalBloom','rootCluster'],
    ['flowerTotem','rootCluster','gardenStone']
  ];
  const items=[],rnd=envRng(Math.imul(f,2654435761)^(w.rooms.length*7919));
  for(let ri=0;ri<w.rooms.length;ri++){
    const r=w.rooms[ri],count=ri===0?2:2+(ri+f)%2;
    if(f<=5&&ri>0&&r!==w.exit&&(ri+f)%3===0){
      items.push({type:'wardSeal',x:(r.cx+.5)*TILE,y:(r.cy+.5)*TILE,seed:ri*17+f*101,floorPiece:true});
    }
    for(let j=0;j<count;j++){
      const side=(ri+j*3+f)%4,along=.2+rnd()*.6;
      let x,y;
      if(side===0){x=(r.x+1.4+(r.w-2.8)*along)*TILE;y=(r.y+1.12)*TILE;}
      else if(side===1){x=(r.x+1.4+(r.w-2.8)*along)*TILE;y=(r.y+r.h-1.12)*TILE;}
      else if(side===2){x=(r.x+1.12)*TILE;y=(r.y+1.4+(r.h-2.8)*along)*TILE;}
      else{x=(r.x+r.w-1.12)*TILE;y=(r.y+1.4+(r.h-2.8)*along)*TILE;}
      const type=sets[f-1][(ri+j+Math.floor(rnd()*3))%3];
      items.push({type,x:Math.round(x),y:Math.round(y),seed:ri*37+j*13+f*97,flip:rnd()<.5?-1:1});
    }
  }
  const fixtures=w.fixtures||[];
  const filtered=items.filter(o=>fixtures.every(p=>d2(o.x,o.y,p.x,p.y)>62**2));
  if(!w._environmentPropsRefined){
    const allowed=f<=5?new Set(['pr_banner','pr_chain','pr_crate','pr_rubble','pr_pot','pr_bones']):new Set(['pr_rubble','pr_pot','pr_shroom']);
    w.props=(w.props||[]).filter((o,i)=>allowed.has(o.t)&&((i+f)%3!==0||o.t==='pr_rubble'));
    w._environmentPropsRefined=true;
  }
  w._environmentArt={version:ENV_ART_VERSION,floor:f,items:filtered};return filtered;
}
function envShadow(ctx,w,h,y=5,a=.32){
  ctx.fillStyle=`rgba(2,5,8,${a})`;ctx.fillRect(-Math.round(w/2),y,Math.round(w),Math.max(3,Math.round(h)));
  ctx.fillStyle='rgba(2,5,8,.16)';ctx.fillRect(-Math.round(w*.38),y+Math.round(h),Math.round(w*.76),2);
}
function envDiamond(ctx,x,y,r,col){ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r,y);ctx.closePath();ctx.fill();}
function drawEarlyEnvironmentPiece(ctx,o,t){
  const bob=save.motion?0:Math.sin(t*1.3+o.seed)*1.2,flip=o.flip||1;ctx.save();ctx.translate(Math.round(o.x),Math.round(o.y));ctx.scale(flip,1);ctx.imageSmoothingEnabled=false;
  if(o.type==='wardSeal'){
    ctx.globalAlpha=.5;ctx.fillStyle='#07101b';ctx.fillRect(-29,-18,58,36);ctx.strokeStyle='#60758b';ctx.lineWidth=2;ctx.strokeRect(-25,-14,50,28);ctx.strokeStyle='#b49d68';ctx.strokeRect(-18,-10,36,20);envDiamond(ctx,0,0,8,'#263b52');envDiamond(ctx,0,0,4,'#d8bd79');ctx.fillStyle='#9c8a5d';for(let i=-1;i<=1;i++){ctx.fillRect(-24,i*7,5,2);ctx.fillRect(19,i*7,5,2);}ctx.globalAlpha=1;
  }else if(o.type==='gateColumn'){
    envShadow(ctx,38,7,18);ctx.fillStyle='#111924';ctx.fillRect(-17,12,34,10);ctx.fillStyle='#3d4d58';ctx.fillRect(-15,7,30,11);ctx.fillStyle='#263641';ctx.fillRect(-10,-38,20,46);ctx.fillStyle='#60717a';ctx.fillRect(-8,-36,3,41);ctx.fillStyle='#15222d';ctx.fillRect(5,-36,5,42);ctx.fillStyle='#17232d';ctx.fillRect(-13,-43,26,7);ctx.fillStyle='#53636b';ctx.fillRect(-10,-46,9,4);ctx.fillRect(3,-44,8,3);ctx.fillStyle='#8a7a52';ctx.fillRect(-8,-17,16,3);ctx.fillRect(-2,-29,4,3);ctx.fillStyle='#111c26';ctx.fillRect(-7,-5,6,2);ctx.fillRect(1,-25,7,2);ctx.fillRect(-4,-23,2,7);
  }else if(o.type==='oilCache'){
    envShadow(ctx,50,6,15);ctx.fillStyle='#15100b';ctx.fillRect(-24,-4,48,21);ctx.fillStyle='#5e482e';ctx.fillRect(-22,-7,44,21);ctx.fillStyle='#9c7a45';ctx.fillRect(-19,-4,38,3);ctx.fillRect(-2,-6,4,19);ctx.fillStyle='#271a12';ctx.fillRect(-17,2,30,2);for(let i=0;i<3;i++){const x=-14+i*13;ctx.fillStyle='#18252a';ctx.fillRect(x,-22-i%2*3,7,17+i%2*3);ctx.fillStyle='#7e8f83';ctx.fillRect(x+1,-20-i%2*3,3,11);ctx.fillStyle='#ba9a5b';ctx.fillRect(x+1,-26-i%2*3,4,5);ctx.fillStyle='#d9cb94';ctx.fillRect(x+2,-18-i%2*3,1,5);}
  }else if(o.type==='lampPost'){
    envShadow(ctx,33,5,16);ctx.fillStyle='#111823';ctx.fillRect(-5,-39,10,57);ctx.fillStyle='#586b70';ctx.fillRect(-2,-37,4,52);ctx.fillStyle='#a18c58';ctx.fillRect(-11,11,22,7);ctx.fillRect(-8,-44,16,6);ctx.strokeStyle='#667982';ctx.lineWidth=3;ctx.strokeRect(-15,-59,30,16);ctx.fillStyle='#d7b66e55';ctx.fillRect(-12,-56,24,10);ctx.fillStyle='#fff0b4';ctx.fillRect(-3,-53,6,7);ctx.fillStyle='#c7d5ca';ctx.fillRect(-10,-55,2,8);
  }else if(o.type==='watchBench'||o.type==='gardenBench'){
    envShadow(ctx,58,6,12);const garden=o.type==='gardenBench';ctx.fillStyle=garden?'#253522':'#19212a';ctx.fillRect(-28,-8,56,7);ctx.fillRect(-25,2,50,8);ctx.fillStyle=garden?'#735f3d':'#5f5747';ctx.fillRect(-25,-11,50,6);ctx.fillRect(-22,-1,44,6);ctx.fillStyle=garden?'#a18b59':'#91846a';ctx.fillRect(-22,-10,39,2);ctx.fillStyle='#1a2022';ctx.fillRect(-20,6,5,13);ctx.fillRect(15,6,5,13);if(garden){ctx.fillStyle='#63824f';ctx.fillRect(-28,-15,4,8);ctx.fillRect(23,-19,4,12);ctx.fillStyle='#9daf6f';ctx.fillRect(-31,-18,7,4);ctx.fillRect(22,-22,8,5);}
  }else if(o.type==='bellShrine'){
    envShadow(ctx,55,7,17);ctx.fillStyle='#1b2630';ctx.fillRect(-27,-43,6,61);ctx.fillRect(21,-43,6,61);ctx.fillRect(-27,-46,54,7);ctx.fillStyle='#778990';ctx.fillRect(-23,-42,3,54);ctx.fillStyle='#8c7647';ctx.fillRect(-18,-38,36,5);for(let i=-1;i<=1;i++){const x=i*13;ctx.fillStyle='#3b2d1c';ctx.fillRect(x-1,-34,3,12);ctx.fillStyle='#9e8450';ctx.fillRect(x-7,-24,14,13);ctx.fillStyle='#d1b573';ctx.fillRect(x-5,-24,5,9);ctx.fillStyle='#5d492c';ctx.fillRect(x-9,-12,18,4);ctx.fillStyle='#d9c58e';ctx.fillRect(x-1,-9,3,7);}
  }else if(o.type==='wallRelief'){
    envShadow(ctx,43,5,11);ctx.fillStyle='#15202a';ctx.fillRect(-23,-31,46,43);ctx.fillStyle='#586a72';ctx.fillRect(-20,-28,40,37);ctx.fillStyle='#293945';ctx.fillRect(-16,-24,32,29);ctx.strokeStyle='#9aa59c';ctx.lineWidth=2;ctx.strokeRect(-16,-24,32,29);envDiamond(ctx,0,-10,10,'#6f7d78');envDiamond(ctx,0,-10,5,'#222f3a');ctx.fillStyle='#b9a46e';ctx.fillRect(-13,1,26,3);ctx.fillRect(-2,-22,4,5);
  }else if(o.type==='bunkStack'){
    envShadow(ctx,48,7,16);ctx.fillStyle='#283743';ctx.fillRect(-24,-42,5,59);ctx.fillRect(19,-42,5,59);ctx.fillRect(-24,-43,48,5);ctx.fillRect(-24,-14,48,5);ctx.fillStyle='#667379';ctx.fillRect(-19,-39,38,22);ctx.fillRect(-19,-10,38,22);ctx.fillStyle='#273d54';ctx.fillRect(-15,-33,31,15);ctx.fillRect(-15,-4,31,15);ctx.fillStyle='#b8b5a4';ctx.fillRect(-17,-38,13,7);ctx.fillRect(-17,-9,13,7);ctx.fillStyle='#8c7652';ctx.fillRect(18,-43,3,60);
  }else if(o.type==='footlocker'){
    envShadow(ctx,46,6,13);ctx.fillStyle='#151b21';ctx.fillRect(-23,-10,46,24);ctx.fillStyle='#455660';ctx.fillRect(-21,-12,42,23);ctx.fillStyle='#718187';ctx.fillRect(-18,-9,36,4);ctx.fillStyle='#242f38';ctx.fillRect(-17,-3,34,12);ctx.fillStyle='#b09a63';ctx.fillRect(-3,-2,6,8);ctx.fillStyle='#182027';ctx.fillRect(-20,9,40,4);ctx.fillRect(-15,-7,3,15);ctx.fillRect(12,-7,3,15);
  }else if(o.type==='starAltar'){
    envShadow(ctx,70,8,18);ctx.fillStyle='#111924';ctx.fillRect(-34,9,68,13);ctx.fillStyle='#52616b';ctx.fillRect(-30,2,60,14);ctx.fillStyle='#89938c';ctx.fillRect(-25,-4,50,12);ctx.fillStyle='#263745';ctx.fillRect(-20,-8,40,8);ctx.strokeStyle='#b9a065';ctx.lineWidth=2;ctx.strokeRect(-18,-6,36,7);for(let i=0;i<8;i++){const a=i*TAU/8+t*.08;ctx.fillStyle=i%2?'#7c6b4c':'#d6bc76';ctx.fillRect(Math.round(Math.cos(a)*13)-1,-18+Math.round(Math.sin(a)*5),3,3);}envDiamond(ctx,0,-19+bob,6,'#fff0bd');
  }else if(o.type==='watchBanner'){
    envShadow(ctx,39,5,14);ctx.fillStyle='#1a2029';ctx.fillRect(-22,-46,44,5);ctx.fillStyle='#9a8252';ctx.fillRect(-25,-49,50,4);ctx.fillStyle='#4b2e45';ctx.fillRect(-18,-41,36,49);ctx.fillStyle='#6d3b59';ctx.fillRect(-14,-38,28,40);ctx.fillStyle='#bca366';ctx.fillRect(-2,-34,4,25);ctx.fillRect(-10,-23,20,4);envDiamond(ctx,0,-8,5,'#d7c58c');ctx.fillStyle='#171d26';ctx.fillRect(-18,8,12,5);ctx.fillRect(6,8,12,5);
  }else if(o.type==='rootCluster'){
    ctx.strokeStyle='#17281d';ctx.lineWidth=10;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-34+i*19,18);ctx.quadraticCurveTo(-20+i*13,-8-i*4,-12+i*10,-25-i*2);ctx.stroke();}ctx.strokeStyle='#6f8757';ctx.lineWidth=4;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-34+i*19,18);ctx.quadraticCurveTo(-20+i*13,-8-i*4,-12+i*10,-25-i*2);ctx.stroke();}ctx.fillStyle='#94a66c';for(let i=0;i<7;i++){const x=-29+i*10,y=7-Math.abs(i-3)*4;ctx.fillRect(x,y,7,3);ctx.fillRect(x+2,y-3,3,8);}ctx.fillStyle='#b09a7f';ctx.fillRect(-3,-26,6,8);
  }else if(o.type==='fernPatch'){
    envShadow(ctx,60,5,13,.22);for(let i=0;i<7;i++){const a=-2.7+i*.34+Math.sin(t*.6+o.seed+i)*.025,len=24+(i%3)*8;ctx.strokeStyle=i%2?'#6f955f':'#8aaa6c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,13);ctx.quadraticCurveTo(Math.cos(a)*len*.45,Math.sin(a)*len*.2,Math.cos(a)*len,Math.sin(a)*len);ctx.stroke();for(let j=1;j<4;j++){const x=Math.cos(a)*len*j/4,y=13+Math.sin(a)*len*j/4;ctx.fillStyle=j%2?'#9bb979':'#587e55';ctx.fillRect(Math.round(x)-5,Math.round(y)-2,10,4);}}
  }else if(o.type==='gardenStone'){
    envShadow(ctx,54,7,13);ctx.fillStyle='#27342d';ctx.fillRect(-27,3,54,13);ctx.fillStyle='#68766b';ctx.fillRect(-23,-14,46,21);ctx.fillStyle='#9aa294';ctx.fillRect(-18,-18,36,8);ctx.fillStyle='#3e5540';ctx.fillRect(-20,-4,11,3);ctx.fillRect(7,-11,9,3);ctx.fillStyle='#8fa66a';ctx.fillRect(-24,-21,6,9);ctx.fillRect(17,-17,7,8);ctx.fillStyle='#b5bf88';ctx.fillRect(-22,-24,4,5);
  }else if(o.type==='glassFrame'){
    envShadow(ctx,60,5,16);ctx.fillStyle='#293a38';ctx.fillRect(-29,-45,5,63);ctx.fillRect(24,-45,5,63);ctx.fillRect(-29,-48,58,6);ctx.fillStyle='#7b9d91';ctx.fillRect(-25,-43,49,3);ctx.fillRect(-2,-43,4,56);ctx.fillRect(-25,-16,49,4);ctx.fillStyle='#99d4c524';ctx.fillRect(-22,-39,18,20);ctx.fillRect(4,-39,17,20);ctx.fillStyle='#cce8dc77';ctx.beginPath();ctx.moveTo(5,-38);ctx.lineTo(19,-38);ctx.lineTo(5,-23);ctx.closePath();ctx.fill();ctx.strokeStyle='#d4eee166';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-20,-36);ctx.lineTo(-8,-19);ctx.lineTo(-18,-21);ctx.stroke();ctx.fillStyle='#567750';ctx.fillRect(-30,4,10,12);
  }else if(o.type==='pottingBench'||o.type==='seedTable'){
    envShadow(ctx,65,6,14);ctx.fillStyle='#2a2519';ctx.fillRect(-31,-10,62,9);ctx.fillStyle='#7a6640';ctx.fillRect(-29,-13,58,8);ctx.fillStyle='#a08b5a';ctx.fillRect(-25,-12,42,2);ctx.fillStyle='#4c422c';ctx.fillRect(-25,-2,6,20);ctx.fillRect(19,-2,6,20);ctx.fillRect(-25,7,50,5);for(let i=0;i<4;i++){const x=-21+i*14;ctx.fillStyle=i%2?'#6c5140':'#9a6e4d';ctx.fillRect(x,-23-i%2*3,10,11+i%2*3);ctx.fillStyle='#293b28';ctx.fillRect(x+2,-28-i%2*3,6,6);ctx.fillStyle='#8fac6d';ctx.fillRect(x,-31-i%2*3,5,4);ctx.fillRect(x+6,-32-i%2*3,5,4);}if(o.type==='seedTable'){ctx.fillStyle='#d5c98b';for(let i=0;i<5;i++)ctx.fillRect(-18+i*8,-7+(i%2),3,2);}
  }else if(o.type==='dryFountain'){
    envShadow(ctx,78,7,17,.25);ctx.fillStyle='#24322e';ctx.fillRect(-39,4,78,15);ctx.fillStyle='#65756d';ctx.fillRect(-35,-2,70,15);ctx.fillStyle='#9ba49a';ctx.fillRect(-30,-7,60,9);ctx.fillStyle='#263f38';ctx.fillRect(-25,-4,50,10);ctx.fillStyle='#6d7e72';ctx.fillRect(-7,-27,14,25);ctx.fillRect(-17,-30,34,6);ctx.fillStyle='#9cac9d';ctx.fillRect(-4,-25,5,20);ctx.fillStyle='#46634a';ctx.fillRect(-29,-8,7,9);ctx.fillRect(22,-10,8,11);ctx.fillStyle='#89a46d';ctx.fillRect(-31,-13,10,5);ctx.fillRect(21,-15,11,5);
  }else if(o.type==='fungalBloom'){
    envShadow(ctx,56,5,12,.22);for(let i=0;i<7;i++){const x=-24+i*8,h=9+(i*7%18);ctx.fillStyle='#d5cab0';ctx.fillRect(x,-h+9,4,h);ctx.fillStyle=i%3===0?'#b36f91':i%3===1?'#879f6b':'#d09c72';ctx.fillRect(x-5,-h+4,14,6);ctx.fillRect(x-3,-h+1,10,3);ctx.fillStyle='#eee1ca';ctx.fillRect(x-1,-h+2,3,2);}glowImg('violet',o.x,o.y-10,28,.12+.04*Math.sin(t*2+o.seed));
  }else if(o.type==='flowerTotem'){
    envShadow(ctx,52,6,14);ctx.fillStyle='#24382b';ctx.fillRect(-17,-1,34,18);ctx.fillStyle='#72875b';ctx.fillRect(-12,-34,24,35);ctx.fillStyle='#314b35';ctx.fillRect(5,-31,7,31);ctx.fillStyle='#a48b78';ctx.fillRect(-8,-29,10,24);for(let i=0;i<8;i++){const a=i*TAU/8+t*.04;ctx.fillStyle=i%2?'#c58da6':'#e0b4bd';ctx.fillRect(Math.round(Math.cos(a)*17)-4,-38+Math.round(Math.sin(a)*10)-3,8,6);}envDiamond(ctx,0,-38,7,'#ead6a8');envDiamond(ctx,0,-38,3,'#263329');
  }
  ctx.restore();
}
function drawEarlyEnvironmentArt(ctx){
  const w=G.world;if(!w||w.region!=='hollow'||G.floor>10)return;const t=save.motion?0:G.tAll;
  for(const o of earlyEnvironmentArt(w,G.floor)){
    if(o.x<G.cam.x-100||o.x>G.cam.x+G.w+100||o.y<G.cam.y-100||o.y>G.cam.y+G.h+100)continue;
    drawEarlyEnvironmentPiece(ctx,o,t);
  }
}

drawTorches=function(ctx){
  const w=G.world,cam=G.cam,t=save.motion?0:G.tAll,garden=w.region==='hollow'&&G.floor>=6;
  for(const o of w.torches||[]){
    if(o.x<cam.x-80||o.x>cam.x+G.w+80||o.y<cam.y-90||o.y>cam.y+G.h+90)continue;
    const flick=.92+Math.sin(t*12+o.s)*.06+Math.sin(t*21+o.s*2)*.025,x=Math.round(o.x),y=Math.round(o.y),glass=garden?'#8fc3a4':'#c2c8bd',metal=garden?'#31443a':'#394854',bright=garden?'#d8e49b':'#ffe1a0';
    glowImg(garden?'teal':'ember',x,y-10,(garden?48:45)*flick,.48);
    ctx.save();ctx.translate(x,y);ctx.imageSmoothingEnabled=false;
    ctx.fillStyle='#070b0e99';ctx.fillRect(-15,-28,32,42);ctx.fillStyle='#182129';ctx.fillRect(-4,-37,8,12);ctx.fillStyle=metal;ctx.fillRect(-2,-37,4,11);ctx.fillRect(-13,-29,26,4);ctx.fillRect(-16,-25,5,32);ctx.fillRect(11,-25,5,32);ctx.fillRect(-13,7,26,6);
    ctx.fillStyle='#8c9b91';ctx.fillRect(-10,-27,17,2);ctx.fillRect(-13,-23,3,27);ctx.fillStyle=glass+'42';ctx.fillRect(-10,-23,20,28);ctx.fillStyle=glass+'80';ctx.fillRect(-8,-21,3,22);ctx.fillStyle='#0b1114';ctx.fillRect(-2,-24,4,31);ctx.fillRect(-11,-6,22,3);
    ctx.fillStyle='#c47b36';ctx.fillRect(-6,0,12,5);ctx.fillStyle='#ff9b45';ctx.fillRect(-5,-8,10,11);ctx.fillStyle='#ffd479';ctx.fillRect(-3,-13-Math.round((flick-.9)*20),7,14);ctx.fillStyle=bright;ctx.fillRect(-1,-9,3,8);ctx.fillStyle='#fff6cd';ctx.fillRect(0,-7,2,5);
    ctx.fillStyle='#a6935f';ctx.fillRect(-17,11,34,4);ctx.fillStyle='#202b32';ctx.fillRect(-12,15,24,4);ctx.fillRect(-7,19,14,3);
    if(garden){ctx.fillStyle='#567550';ctx.fillRect(-18,-20,4,31);ctx.fillRect(14,-14,4,27);ctx.fillStyle='#91a86c';ctx.fillRect(-22,-16,9,4);ctx.fillRect(13,-5,10,4);ctx.fillRect(-19,2,8,4);}
    if(!save.motion)for(let i=0;i<2;i++){const u=(t*(.38+i*.09)+o.s+i*.47)%1,sx=(i?5:-4)+Math.sin(t*3+i+o.s)*4,sy=-18-u*25;ctx.fillStyle=i?bright:'#ff9c4f';ctx.fillRect(Math.round(sx),Math.round(sy),i?2:1,i?2:1);}
    ctx.restore();
  }
};

drawGardenDecor=function(ctx,o,t){
  ctx.imageSmoothingEnabled=false;
  if(o.type==='moss'){
    for(let i=0;i<22;i++){const x=Math.sin(i*9.2+o.seed)*o.w*.46,y=Math.cos(i*5.7+o.seed)*o.h*.45,r=4+(i%5)*2;ctx.fillStyle=i%3===0?'#91aa7030':i%2?'#315e4038':'#4b794738';ctx.fillRect(Math.round(x-r),Math.round(y-r/2),r*2,r);ctx.fillStyle='#a6bb7a33';ctx.fillRect(Math.round(x),Math.round(y-r/2-2),2,4);}
  }else if(o.type==='vine'){
    const sway=save.motion?0:Math.sin(t*.7+o.seed)*3;ctx.strokeStyle='#14251b';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(-12,0);ctx.bezierCurveTo(o.w*.3,28+sway,o.w*.64,-18+sway,o.w-25,8);ctx.stroke();ctx.strokeStyle='#58764d';ctx.lineWidth=5;ctx.stroke();ctx.strokeStyle='#98aa70';ctx.lineWidth=1;ctx.stroke();
    for(let i=0;i<11;i++){const x=i*(o.w-30)/11,y=Math.sin(i*1.8)*10+sway*i/11;ctx.fillStyle=i%2?'#6f985e':'#9caf73';ctx.fillRect(Math.round(x)-7,Math.round(y)-3,14,6);ctx.fillStyle='#304d35';ctx.fillRect(Math.round(x)-1,Math.round(y)-5,2,10);}
  }else if(o.type==='planter'){
    envShadow(ctx,56,6,15,.26);ctx.fillStyle='#16231e';ctx.fillRect(-28,-16,56,34);ctx.fillStyle='#596b64';ctx.fillRect(-26,-18,52,6);ctx.fillStyle='#8b9485';ctx.fillRect(-22,-16,40,2);ctx.fillStyle='#27392a';ctx.fillRect(-21,-10,42,24);ctx.fillStyle='#111b17';ctx.fillRect(-17,-6,34,16);ctx.fillStyle='#697b70';ctx.fillRect(-28,12,56,6);ctx.fillStyle='#9c7c61';ctx.fillRect(-19,-8,38,5);
    for(let i=0;i<7;i++){const x=-18+i*6,sway=save.motion?0:Math.sin(t*.6+i+o.seed)*2;ctx.strokeStyle=i%2?'#71915e':'#91a96f';ctx.lineWidth=2;ctx.fillStyle=i%3?'#b58ba1':'#d2b68c';ctx.fillRect(Math.round(x+sway)-3,-22-i%3*4,7,5);ctx.fillStyle='#e1cf9c';ctx.fillRect(Math.round(x+sway)-1,-21-i%3*4,3,3);ctx.fillStyle='#72915d';ctx.fillRect(x,-17-i%3*4,2,13+i%3*4);}
  }else if(o.type==='trellis'){
    ctx.fillStyle='#263a36';ctx.fillRect(-23,-48,5,68);ctx.fillRect(18,-48,5,68);ctx.fillRect(-23,-50,46,5);ctx.fillStyle='#77978c';ctx.fillRect(-19,-45,3,61);ctx.fillRect(-1,-55,4,71);ctx.fillRect(16,-45,3,61);ctx.fillRect(-19,-20,38,4);ctx.fillStyle='#9fd2c42b';ctx.fillRect(-15,-42,12,18);ctx.fillRect(4,-42,11,18);ctx.strokeStyle='#d6eee56e';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-13,-40);ctx.lineTo(-4,-25);ctx.lineTo(-12,-27);ctx.moveTo(5,-40);ctx.lineTo(14,-26);ctx.stroke();ctx.fillStyle='#66895b';ctx.fillRect(-25,0,9,5);ctx.fillRect(15,-12,10,5);ctx.fillStyle='#9eb677';ctx.fillRect(-27,-4,8,5);ctx.fillRect(19,-16,8,5);
  }
};

const beforeEnvironmentHollowFloor=drawHollowFloor;
drawHollowFloor=function(ctx){beforeEnvironmentHollowFloor(ctx);drawEarlyEnvironmentArt(ctx);};
const beforeEnvironmentPixelFloor=drawPixelFloorDetails;
drawPixelFloorDetails=function(ctx){
  beforeEnvironmentPixelFloor(ctx);const w=G.world;if(!w||w.region!=='hollow'||G.floor>10)return;
  const garden=G.floor>=6,x0=Math.max(0,Math.floor(G.cam.x/TILE)-1),x1=Math.min(w.W-1,Math.ceil((G.cam.x+G.w)/TILE)+1),y0=Math.max(0,Math.floor(G.cam.y/TILE)-1),y1=Math.min(w.H-1,Math.ceil((G.cam.y+G.h)/TILE)+1),t=save.motion?0:G.tAll;ctx.save();ctx.imageSmoothingEnabled=false;
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++){
    const i=ty*w.W+tx,h=((tx*92837111)^(ty*689287499)^(G.floor*283923481))>>>0,wx=tx*TILE,wy=ty*TILE;
    if(w.grid[i]===1){
      if(garden&&h%9===0){ctx.fillStyle='#4e7046aa';ctx.fillRect(wx+4+h%19,wy+23,3,8);ctx.fillStyle='#91aa6d';ctx.fillRect(wx+1+h%19,wy+21,8,3);if(h%27===0){ctx.fillStyle='#c894aa';ctx.fillRect(wx+7+h%15,wy+16,5,5);ctx.fillStyle='#ebd49e';ctx.fillRect(wx+9+h%15,wy+18,2,2);}}
      else if(!garden&&h%13===0){ctx.fillStyle='#9f8b5b66';ctx.fillRect(wx+6,wy+6,3,3);ctx.fillRect(wx+27,wy+27,3,3);ctx.fillStyle='#0a0e16aa';ctx.fillRect(wx+10+h%9,wy+17,12,2);ctx.fillRect(wx+13+h%7,wy+19,7,1);}
    }else{
      const touches=!isSolidTile(w,tx,ty+1)||!isSolidTile(w,tx-1,ty)||!isSolidTile(w,tx+1,ty);
      if(!touches||h%11)continue;
      if(garden){ctx.fillStyle='#29472f';ctx.fillRect(wx+5,wy+3,4,31);ctx.fillRect(wx+9,wy+9,10,3);ctx.fillStyle='#719160';ctx.fillRect(wx+6,wy+5,2,25);ctx.fillStyle='#9eb677';ctx.fillRect(wx+15,wy+6+Math.round(Math.sin(t+h)*2),9,4);}
      else{
        ctx.fillStyle='#0a0f17aa';ctx.fillRect(wx+8,wy+8,9,2);ctx.fillRect(wx+15,wy+10,2,7);ctx.fillRect(wx+17,wy+15,7,2);ctx.fillRect(wx+22,wy+17,2,5);
        ctx.fillStyle='#71808a55';ctx.fillRect(wx+9,wy+7,7,1);ctx.fillRect(wx+17,wy+14,5,1);
        if(h%33===0){ctx.fillStyle='#9b875755';ctx.fillRect(wx+27,wy+5,3,2);ctx.fillRect(wx+29,wy+7,2,4);}
      }
    }
  }
  ctx.restore();
};
