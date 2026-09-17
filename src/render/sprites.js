const SPR={};
function px(maps, pal, opts){
  opts=opts||{};
  let W=0,H=0;
  for(const m of maps){ for(const r of m){ W=Math.max(W,r.length); H=Math.max(H,m.length); } }
  const frames=maps.map(m=>{
    const c=document.createElement('canvas'); c.width=W; c.height=H;
    const x=c.getContext('2d');
    for(let j=0;j<H;j++){
      const row=m[j]||'';
      for(let i=0;i<W;i++){
        const col=pal[row[i]]; if(!col) continue;
        x.fillStyle=col; x.fillRect(i,j,1,1);
      }
    }
    return c;
  });
  return {frames,W,H,fps:opts.fps||4,sc:opts.sc||2};
}
function pxGen(W,H,nf,fn,opts){
  opts=opts||{};
  const frames=[];
  for(let f=0;f<nf;f++){
    const c=document.createElement('canvas'); c.width=W; c.height=H;
    const x=c.getContext('2d');
    for(let j=0;j<H;j++) for(let i=0;i<W;i++){
      const col=fn(i,j,f); if(!col) continue;
      x.fillStyle=col; x.fillRect(i,j,1,1);
    }
    frames.push(c);
  }
  return {frames,W,H,fps:opts.fps||4,sc:opts.sc||2};
}
const GLOW={};
function bakeGlow(name,hex){
  const c=document.createElement('canvas'); c.width=64; c.height=64;
  const x=c.getContext('2d');
  const g=x.createRadialGradient(32,32,2,32,32,32);
  g.addColorStop(0,hex); g.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle=g; x.fillRect(0,0,64,64);
  GLOW[name]=c;
}
function bakeAllGlows(){
  bakeGlow('ember','rgba(255,154,77,.85)');
  bakeGlow('violet','rgba(160,108,255,.8)');
  bakeGlow('magenta','rgba(255,77,109,.8)');
  bakeGlow('teal','rgba(84,220,190,.75)');
  bakeGlow('gold','rgba(255,216,138,.85)');
  bakeGlow('cyan','rgba(143,247,255,.8)');
  bakeGlow('blue','rgba(140,180,255,.75)');
  bakeGlow('pink','rgba(255,93,118,.8)');
  bakeGlow('orchid','rgba(224,110,220,.75)');
}
function glowImg(name,x,y,r,alpha){
  const c=GLOW[name]; if(!c) return;
  const ctx=G.ctx;
  ctx.save(); ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=alpha;
  ctx.drawImage(c,x-r,y-r,r*2,r*2);
  ctx.restore();
}
function drawSpr(name,x,y,scale,rot,alpha,tOff){
  const s=SPR[name]; if(!s) return;
  scale=scale||1; alpha=(alpha===undefined)?1:alpha;
  const ctx=G.ctx;
  const fr=s.frames.length>1 ? Math.floor((G.tAll+(tOff||0))*s.fps)%s.frames.length : 0;
  const img=s.frames[fr];
  const dw=s.W*s.sc*scale, dh=s.H*s.sc*scale;
  ctx.imageSmoothingEnabled=false;
  ctx.globalAlpha=alpha;
  if(rot){ ctx.save(); ctx.translate(x,y); ctx.rotate(rot); ctx.drawImage(img,-dw/2,-dh/2,dw,dh); ctx.restore(); }
  else ctx.drawImage(img,x-dw/2,y-dh/2,dw,dh);
  ctx.globalAlpha=1; ctx.imageSmoothingEnabled=true;
}
const ICON_PX={
 sw:["......##","....####","...###..","..###...",".###....","####....",".##.....","........"],
 hp:["........",".##..##.","########","########",".######.","..####..","...##...","........"],
 fr:["...###..","..####..","..###...",".#####..","...##...","..##....",".##.....","........"],
 bt:["........",".##.....",".##.....",".##..###",".#######","..######","........","........"],
 ey:["........","..####..",".##..##.","##.##.##","##.##.##",".##..##.","..####..","........"],
 mg:["##....##","##....##","##....##","##....##","##....##",".##..##.","..####..","........"],
 ft:["....####","...#####","..##.##.",".##..##.","##...##.","#....##.",".....##.","........"],
 gm:["...##...",".######.","########",".######.","..####..","...##...","........","........"],
 st:["...##...","...##...","########",".######.","...##...","..#..#..","........","........"],
 pl:["...##...","...##...","########","########","...##...","...##...","........","........"],
 lk:["..####..",".##..##.",".##..##.","########","########","##.##.##","########","........"]
};
const ICON_CACHE={};
function iconImg(name,col){
  const k=name+'|'+col;
  if(ICON_CACHE[k]) return ICON_CACHE[k];
  const m=ICON_PX[name];
  const c=document.createElement('canvas'); c.width=8; c.height=8;
  const x=c.getContext('2d'); x.fillStyle=col;
  for(let j=0;j<8;j++){ const row=m[j]||'';
    for(let i=0;i<8;i++) if(row[i]==='#') x.fillRect(i,j,1,1); }
  ICON_CACHE[k]=c; return c;
}
const NODE_ICON={m:'sw',v:'hp',f:'fr',s:'bt',c:'ey',g:'mg',d:'ft',a:'gm'};
const TP=18;
const TILE_PAL=[
 {f:'#1b2236',fh:'#26304a',fl:'#141a2a',mo:'#0a0e18',wa:'#2b3653',wb:'#212a42',wc:'#141a2a',ka:'#323e5e',kb:'#25304a',kc:'#10151f',lip:'#43527a',ac:'#4a7fd6',mos:'#2f5c8a'},
 {f:'#1a2a21',fh:'#24382c',fl:'#122018',mo:'#0a1310',wa:'#27412f',wb:'#1e3325',wc:'#122017',ka:'#2e4b36',kb:'#233a29',kc:'#0f1a13',lip:'#3d6448',ac:'#54dcbe',mos:'#3f8f5e'},
 {f:'#2a1a19',fh:'#3a2523',fl:'#1d1110',mo:'#120a09',wa:'#472b26',wb:'#37211d',wc:'#1f1211',ka:'#513029',kb:'#3f2620',kc:'#1a0f0d',lip:'#6b4034',ac:'#ff8a4d',mos:'#8a4a2a'},
 {f:'#211a2f',fh:'#2d2440',fl:'#161027',mo:'#0c0814',wa:'#352a4e',wb:'#29213d',wc:'#181227',ka:'#3d3159',kb:'#302647',kc:'#140f22',lip:'#54447a',ac:'#a06cff',mos:'#6a4aa8'}
];
let FLOORT=[], DECOT=[], WALLTOP=[], WALLFACE=[], AOT=null;
function bakeTiles(){
  const mk=()=>{ const c=document.createElement('canvas'); c.width=TP; c.height=TP; return c; };
  const rng=sd=>()=> (sd=(sd*16807)%2147483647)/2147483647;
  const block=(x,bx,by,bw,bh,base,hi,lo)=>{
    x.fillStyle=base; x.fillRect(bx,by,bw,bh);
    x.fillStyle=hi;   x.fillRect(bx,by,bw,1); x.fillRect(bx,by,1,bh);
    x.fillStyle=lo;   x.fillRect(bx,by+bh-1,bw,1); x.fillRect(bx+bw-1,by,1,bh);
  };
  TILE_PAL.forEach((P,pi)=>{
    const layouts=[
      [[1,1,16,16]],
      [[1,1,16,7],[1,10,16,7]],
      [[1,1,7,7],[10,1,7,7],[1,10,7,7],[10,10,7,7]],
      [[1,1,11,7],[13,1,4,7],[1,10,4,7],[6,10,11,7]]
    ];
    FLOORT[pi]=layouts.map((L,v)=>{
      const c=mk(), x=c.getContext('2d');
      x.fillStyle=P.mo; x.fillRect(0,0,TP,TP);
      for(const b of L) block(x,b[0],b[1],b[2],b[3],P.f,P.fh,P.fl);
      const r=rng(pi*613+v*97+11);
      for(let n=0;n<7;n++){
        x.fillStyle= r()<.55 ? 'rgba(0,0,0,.16)' : 'rgba(255,255,255,.05)';
        x.fillRect(1+Math.floor(r()*16),1+Math.floor(r()*16),1,1);
      }
      return c;
    });
    const D={};
    let c=mk(), x=c.getContext('2d');
    x.fillStyle='rgba(0,0,0,.5)';
    [[5,3],[6,4],[6,5],[7,6],[8,7],[8,8],[9,9],[10,10],[10,11],[11,12],[9,7],[12,9],[13,10]].forEach(p=>x.fillRect(p[0],p[1],1,1));
    D.crack=c;
    c=mk(); x=c.getContext('2d');
    x.fillStyle='rgba(0,0,0,.34)'; x.fillRect(5,11,2,2); x.fillRect(12,5,2,2); x.fillRect(9,14,1,1);
    x.fillStyle='rgba(255,255,255,.07)'; x.fillRect(5,11,1,1); x.fillRect(12,5,1,1);
    D.peb=c;
    c=mk(); x=c.getContext('2d');
    x.strokeStyle=P.ac; x.globalAlpha=.5; x.lineWidth=1;
    x.beginPath(); x.arc(9,9,5.5,0,TAU); x.stroke();
    x.globalAlpha=.75;
    x.fillStyle=P.ac;
    x.fillRect(8,4,1,10); x.fillRect(4,8,10,1); x.fillRect(6,6,1,1); x.fillRect(11,11,1,1); x.fillRect(11,6,1,1); x.fillRect(6,11,1,1);
    D.rune=c;
    c=mk(); x=c.getContext('2d');
    x.fillStyle=P.mos; x.globalAlpha=.5;
    [[2,13],[3,14],[4,13],[5,15],[6,14],[12,3],[13,4],[14,3],[11,2],[15,5],[3,12],[13,2]].forEach(p=>x.fillRect(p[0],p[1],2,2));
    D.moss=c;
    c=mk(); x=c.getContext('2d');
    x.fillStyle='rgba(0,0,0,.55)'; x.fillRect(3,3,12,12);
    x.fillStyle=P.lip;
    for(let i=4;i<15;i+=3) x.fillRect(i,3,1,12);
    x.fillRect(3,3,12,1); x.fillRect(3,14,12,1);
    D.grate=c;
    DECOT[pi]=D;
    c=mk(); x=c.getContext('2d');
    x.fillStyle=P.kc; x.fillRect(0,0,TP,TP);
    block(x,0,0,TP,TP,P.kb,P.ka,P.kc);
    const rk=rng(pi*811+7);
    for(let n=0;n<9;n++){
      x.fillStyle= rk()<.5 ? 'rgba(0,0,0,.20)' : 'rgba(255,255,255,.045)';
      x.fillRect(Math.floor(rk()*17),Math.floor(rk()*17),2,1);
    }
    x.fillStyle=P.ka; x.fillRect(3,4,5,1); x.fillRect(10,11,5,1);
    WALLTOP[pi]=c;
    c=mk(); x=c.getContext('2d');
    x.fillStyle=P.mo; x.fillRect(0,0,TP,TP);
    const rf=rng(pi*307+29);
    let row=0;
    for(let by=0;by<TP;by+=6,row++){
      const off= row%2 ? -4 : 0;
      for(let bx=off;bx<TP;bx+=9){
        const w=Math.min(9,TP-bx)-1; if(w<=0) continue;
        const bxx=Math.max(0,bx);
        const ww=Math.min(w,TP-bxx);
        block(x,bxx,by,ww,5, rf()<.5?P.wa:P.wb, P.lip, P.wc);
      }
    }
    x.fillStyle=P.lip; x.globalAlpha=.85; x.fillRect(0,0,TP,1);
    x.globalAlpha=1;
    x.fillStyle='rgba(0,0,0,.42)'; x.fillRect(0,TP-2,TP,2);
    WALLFACE[pi]=c;
  });
  AOT={};
  for(const k of ['N','S','W','E']){
    const c=mk(), x=c.getContext('2d');
    let g;
    if(k==='N'){ g=x.createLinearGradient(0,0,0,7); }
    if(k==='S'){ g=x.createLinearGradient(0,TP,0,TP-6); }
    if(k==='W'){ g=x.createLinearGradient(0,0,6,0); }
    if(k==='E'){ g=x.createLinearGradient(TP,0,TP-6,0); }
    g.addColorStop(0,'rgba(0,0,0,.55)'); g.addColorStop(1,'rgba(0,0,0,0)');
    x.fillStyle=g; x.fillRect(0,0,TP,TP);
    AOT[k]=c;
  }
  bakeProps();
}
function bakeProps(){
  SPR.pr_skull=px([[".bbbb..","bwwwwb.","bwdwdwb","bwwwwwb",".bwddwb","..bwwb.","...bb.."]],
    {b:'#0a0c11',w:'#c6cbb8',d:'#171a20'},{fps:1,sc:2});
  SPR.pr_bones=px([["..b......b..",".bwb....bwb.","bwwwbbbbwwwb",".bwb....bwb.","..b......b.."]],
    {b:'#0a0c11',w:'#b9bfae'},{fps:1,sc:2});
  SPR.pr_pot=px([["..ooo..",".ocddo.","occcddo","occcddo","occcddo",".occdo.","..ooo.."]],
    {o:'#160d07',c:'#8a5230',d:'#5e3520'},{fps:1,sc:2});
  SPR.pr_crate=px([["ooooooo","owwwwwo","owdwdwo","owwwwwo","owdwdwo","owwwwwo","ooooooo"]],
    {o:'#170f06',w:'#6b4a24',d:'#4a3218'},{fps:1,sc:2});
  SPR.pr_rubble=px([["...oo....",".oogtoo..","ogttttgo.",".oooooo.."]],
    {o:'#0c0e14',g:'#4c5468',t:'#39415a'},{fps:1,sc:2});
  SPR.pr_shroom=px([
    ["..rrr..",".rrrrr.","rrmrrmr",".ooooo.","..oso..","..oso..",".ooooo."],
    ["..rrr..",".rmrrr.","rrrrmrr",".ooooo.","..oso..","..oso..",".ooooo."]
  ],{r:'#b0417a',m:'#f2d0e6',o:'#0d0a12',s:'#d8d2c4'},{fps:2,sc:2});
  SPR.pr_banner=px([["cccccccc","cvvvvvvc","cvvggvvc","cvvggvvc","cvvvvvvc","cvvvvvvc",".cvvvvc.","..cvvc..","...cc..."]],
    {c:'#1a1208',v:'#6b2740',g:'#e8c476'},{fps:1,sc:2});
  SPR.pr_chain=px([["..oo..",".o..o.","..oo..",".o..o.","..oo..",".o..o.","..oo.."]],
    {o:'#4a5265'},{fps:1,sc:2});
  SPR.pr_sconce=px([["oo...oo","oiiiiio","oiiiiio",".oiiio.","..ooo..","..o.o.."]],
    {o:'#120d06',i:'#4a3a1c'},{fps:1,sc:2});
}
function bakeAll(){
  const mkP=(nf,cfg)=>pxGen(20,30,nf,(i,j,f)=>{
    const ph=f/nf*TAU;
    const bob=cfg.bob?Math.round(Math.sin(ph)):0;
    const cx=9.5, cy=10+bob;
    const dx=i-cx, dy=j-cy;
    const ptop=cy+cfg.ry*0.70;
    if(j>ptop){
      const tt=(j-ptop)/cfg.plume;
      if(tt<=1){
        const wob=Math.sin(j*0.8+ph*2.2)*(0.55+tt*1.5)*cfg.wob;
        const wdt=cfg.pw*(1-tt*tt*0.82);
        const off=Math.abs(dx-wob);
        if(off<wdt){
          if(off>wdt-0.9) return 'rgba(214,72,26,.8)';
          if(tt<0.30) return '#fff3c8';
          if(tt<0.62) return '#ffcf6b';
          return '#ff9a4d';
        }
      }
    }
    const dd=Math.abs(dx)/cfg.rx + Math.abs(dy)/cfg.ry;
    if(dd>1.16) return null;
    if(dd>0.99) return '#080a12';
    if(dd>0.74) return dy<0 ? '#39496e' : '#1b2236';
    if(dd>0.64) return '#55689a';
    const pulse=cfg.pulse*(0.86+Math.sin(ph)*0.14);
    const cr=Math.hypot(dx*1.22,dy*0.92);
    if(cr<pulse*0.42) return '#fff8e4';
    if(cr<pulse*0.72) return '#ffdf9b';
    if(cr<pulse)      return '#ff9a4d';
    if(cr<pulse*1.3)  return 'rgba(224,104,42,.55)';
    return (Math.abs(dx)<cfg.rx*0.42 && Math.abs(dy)<cfg.ry*0.5) ? '#171f33' : '#121828';
  },{fps:cfg.fps,sc:2});
  SPR.pIdle=mkP(4,{rx:6.0,ry:8.6,plume:7.5,pw:2.9,wob:0.45,pulse:3.3,bob:true, fps:5});
  SPR.pMove=mkP(4,{rx:6.3,ry:8.2,plume:10, pw:3.4,wob:1.15,pulse:3.9,bob:true, fps:11});
  SPR.pDash=mkP(2,{rx:5.1,ry:9.6,plume:9,  pw:3.7,wob:1.5, pulse:4.7,bob:false,fps:16});
  SPR.pShard=pxGen(7,7,2,(i,j,f)=>{
    const d=Math.abs(i-3)+Math.abs(j-3);
    if(d>3) return null;
    if(d>2) return '#6a4a1a';
    if(d>1) return f?'#ffe9b8':'#ffcf6b';
    return '#fff6d8';
  },{fps:6,sc:2});
  SPR.slime=px([
   ["....oooooo......","...obbbbbbo.....","..obllllllbo....","..oblllllbbo....",".obblbbbbbbbo...",".obwwkbbbwwkbo..",".obwwkbbbwwkbo..",".obbbbbbbbbbbo..",".obbbbkbbbkbbo..",".obbbbbbbbbbbo..","..obbbbbbbbo....","...obbbbboo.....","....ooooo......."],
   ["................","................","................","...oooooooo.....","..obllllllbbo...",".obllllllllbbo..",".obwwkbbbbwwkbo.",".obwwkbbbbwwkbo.",".obbbbbbkbbbbbo.",".obbbbbbbbbbbbo.","..obbbbbbbbbbo..","..ooooooooooo...","................"]
  ],{o:'#221240',b:'#6b3fb8',l:'#b088ff',w:'#efe7ff',k:'#1c1038'},{fps:3,sc:2});
  SPR.mite=px([
   ["...oooo...","..obbbbo..",".oblllbbo.",".obwkkbbo.",".obbbkbbo.","..obbbbo..","...oooo..."],
   ["..........","..oooooo..",".obllllbbo",".obwkkwbbo",".obbbbbbbo","..oooooo.."]
  ],{o:'#221240',b:'#6b3fb8',l:'#b088ff',w:'#efe7ff',k:'#1c1038'},{fps:4,sc:2});
  SPR.bat=px([
   [".oo........oo.","odwo......owdo","owwwo....owwwo","owwwwoooowwwwo",".owwwobbbbowwwo.","..owwbbkkbbwwo..","...dwbbkkbbwd...","....obbbbbbo....",".....oo..oo....."],
   ["................","................","..oo........oo..",".owwo......owwo.",".owwwobbbbowwwo.","..dwwbbkkbbwwd..","...dwbbkkbbwd...","....obbbbbbo....",".....oo..oo....."]
  ],{o:'#2a0716',w:'#c22a55',d:'#7c1a3c',b:'#e0638a',k:'#2a0716'},{fps:9,sc:2});
  SPR.spitter=px([
   ["......oooo......","....oobbbboo....","...obllllbboo...","..obllwwlllbbo..","..obllwkllbbbo..","..obllwwllbbbo..","..obbbbbblbbbo..","..obbbbbblbbbmo.","..obbbbbbblbbmo.","..obbbbbbbbbbo...","...obbbbbbbbo...",".....ooooooo....."],
   ["......oooo......","....oobbbboo....","...obllllbboo...","..obllwwlllbbo..","..obllwkllbbbo..","..obllwwllbbbo..","..obbbbbmmmmmo..","..obbbbbmkm m o..","..obbbbbmmmmmo..","..obbbbbbbbbbo...","...obbbbbbbbo...",".....ooooooo....."]
  ],{o:'#06281f',b:'#1f8f78',l:'#37c2a4',w:'#d9fff4',k:'#07332a',m:'#ff5d8a'},{fps:3,sc:2});
  SPR.brute=px([
   ["......oooooooo......","....oobbbbbbbboo....","...obllllllllbbo....","..obllbbbbbbbbbbo...","..obbyybbbbyybbbo...","..obbyybbbbyybbbo...","..obbbbbbkbbbbbo....","..obbbbkbbbbbbbo....","..obbbkbbbbbbbbo....","..obbbbbbbbbbbo.....","...obbbbbbbbo.......","....obbbooobbbo.....","....obbo..obbo......","....ooo....ooo......"],
   ["......oooooooo......","....oobbbbbbbboo....","...obllllllllbbo....","..obllbbbbbbbbbbo...","..obbhhbbbbhhbbbo...","..obbhhbbbbhhbbbo...","..obbbbbbkbbbbbo....","..obbbbkbbbbbbbo....","..obbbkbbbbbbbbo....","..obbbbbbbbbbbo.....","...obbbbbbbbo.......","....obbbooobbbo.....",".....obbo..obbo.....",".....ooo....ooo....."]
  ],{o:'#120a26',b:'#3b2e63',l:'#5a4894',h:'#b9a4ff',y:'#ffcf6b',k:'#1a1030'},{fps:2,sc:2});
  SPR.splitter=px([
   [".....oooooooo.....","...oobbbbbbbboo...","..obllbbbbbbbbo...",".obllbwwbbbbwbbo..",".oblbbwkbbwkbbbo..",".obbbbwkwbwkwbbo..",".obbbbbbbbbbbbbo..",".obbwkbbbbbbwkbb..",".obbwkbbbbbkwbbb..",".oobbbbbbbbbbbbo..","..obbbbkkbbbbbo...","...obbbbbbbbbo....","....ooooooooo....."],
   ["................",".....oooooooo.....","...oobbbbbbbboo...","..obllbbbbbbbbo...",".obllbllbbbbllbo..",".oblbbllbbllbbbo..",".obbbbbbbbbbbbbo..",".obbllbbbbbbllbb..",".obbllbbbbbllbbb..",".oobbbbbbbbbbbbo..","..obbbbbbbbbbbo...","...obbbbbbbbbo....","....ooooooooo....."]
  ],{o:'#2a0f38',b:'#7c2f8f',l:'#b056c9',w:'#f3d8ff',k:'#3a1248'},{fps:3,sc:2});
  SPR.wisp=px([
   [".....ooooo......","...oobbbbo......","..obllllbbo.....","..oblkklbbbo....","..oblkklbbbo....","..obllllbbbo....","...obbbbbbo.....","...obbbbbbo.....","...bobbbobo.....","...bob.bobo.....","....b...b......."],
   [".....ooooo......","...oobbbbo......","..obllllbbo.....","..oblkklbbbo....","..oblkklbbbo....","..obllllbbbo....","...obbbbbbo.....","...obbbbbbo.....","...bobobbo......","....bo.bobo.....","....b...b......."]
  ],{o:'#42539a',b:'#a9c4ff',l:'#dbe8ff',k:'#0d1226'},{fps:5,sc:2});
  SPR.boss=pxGen(30,30,2,(i,j,f)=>{
    const dx=i-14.5, dy=j-14.5, d=Math.hypot(dx,dy), a=Math.atan2(dy,dx);
    if(d>15.2) return null;
    const spike=Math.abs(Math.sin(4*a))<(f?0.34:0.26);
    if(d>11.6 && d<15.2 && spike) return d>13.6?'#ff8ba0':'#ff5d7e';
    if(d>13) return null;
    if(d>12) return '#3a1040';
    if(d>10.6&&d<11.8) return '#ff5d7e';
    if(d<(f?3.2:2.5)) return '#fff3c8';
    if(d<(f?4.6:3.7)) return '#ffcf6b';
    if(d<5.3) return '#130a28';
    if((d>6.4&&d<7)||(d>8.7&&d<9.5)) return '#3a1040';
    return (Math.floor((a+Math.PI)/0.785)+Math.floor(d))%2===0? '#2a0d38':'#241031';
  },{fps:1.6,sc:2.6});
  SPR.chest=px([
   ["..oooooooooooo..",".oblllllllllbo..",".obyyyyyyyybbo..",".obbbbbbbbbbbo..",".obbbbyyyybbbo..",".obbbbykkybbbo..",".obbbbyyyybbbo..",".obbbbbbbbbbbo..","..oooooooooooo.."]
  ],{o:'#241505',b:'#5a3d1e',l:'#8a6530',y:'#ffd88a',k:'#1a0f04',w:'#fff3c8'},{fps:1,sc:2});
  SPR.chestOpen=px([
   ["................","..oooooooooooo..","..oyyyyyyyyyyo..","..oooooooooooo..",".oyyyyyyyyyyyyo.",".oywywwyywwyyo..",".obbbbbbbbbbbbo.",".obbbbbbbbbbbbo.","..oooooooooooo.."]
  ],{o:'#241505',b:'#5a3d1e',l:'#8a6530',y:'#ffd88a',k:'#1a0f04',w:'#fff3c8'},{fps:1,sc:2});
  SPR.portal=pxGen(26,26,3,(i,j,f)=>{
    const dx=i-12.5, dy=j-12.5, d=Math.hypot(dx,dy), a=Math.atan2(dy,dx);
    if(d>12.4) return null;
    if(d>10.4){
      if(d>11.2) return '#3a2a10';
      const sect=Math.floor((a+Math.PI+f*0.9)/0.785);
      return sect%2===0? '#ffd88a' : '#e8c476';
    }
    if(d>8.4){
      const sect=Math.floor((a+Math.PI-f*1.2)/0.785);
      return sect%2===0? 'rgba(255,243,200,.85)' : 'rgba(58,42,16,.7)';
    }
    if(d>2.2) return 'rgba(255,216,138,.14)';
    return '#fff3c8';
  },{fps:4,sc:2.5});
  SPR.xp=pxGen(8,8,2,(i,j,f)=>{
    const d=Math.abs(i-3.5)+Math.abs(j-3.5);
    if(d>4) return null;
    if(d>3.1) return '#134a56';
    if(d<1.6) return '#e8fdff';
    return (f===1&&d<2.7)?'#b7faff':'#8ff7ff';
  },{fps:5,sc:2});
  SPR.ess=pxGen(8,10,2,(i,j,f)=>{
    const dx=i-3.5;
    if(j<6){
      const d=Math.hypot(dx,j-3);
      if(d>3.4) return null;
      if(d>2.5) return '#3a1e5e';
      if(d<1.3) return '#f2e6ff';
      return '#c99bff';
    }
    const wdt=3-(j-5)*0.72;
    if(Math.abs(dx)>wdt) return null;
    if(Math.abs(dx)>wdt-0.9) return '#3a1e5e';
    return f===1?'#d9baff':'#c99bff';
  },{fps:5,sc:2});
  SPR.heart=pxGen(12,11,2,(i,j,f)=>{
    const xx=(i-5.5)/4.2, yy=(j-5)/4.2;
    const v=(xx*xx+yy*yy-1)*(xx*xx+yy*yy-1)*(xx*xx+yy*yy-1)-xx*xx*yy*yy*yy;
    if(v>0) return null;
    if(v>-0.35) return '#7c1630';
    if(yy<-0.35&&xx<0) return f===1?'#ffd6de':'#ff8098';
    if(yy>0.45) return '#c22a4a';
    return '#ff5d76';
  },{fps:3,sc:2});
  SPR.bEmber=pxGen(6,6,1,(i,j)=>{
    const d=Math.hypot(i-2.5,j-2.5);
    if(d>2.8) return null;
    if(d<1.1) return '#fff6da';
    if(d<2.2) return '#ffc46b';
    return 'rgba(255,154,77,.55)';
  },{fps:1,sc:1.6});
  SPR.bEnemy=pxGen(6,6,1,(i,j)=>{
    const d=Math.hypot(i-2.5,j-2.5);
    if(d>2.8) return null;
    if(d<1.1) return '#ffe4ec';
    if(d<2.2) return '#ff5d8a';
    return 'rgba(255,93,138,.55)';
  },{fps:1,sc:1.6});
  SPR.flame=pxGen(8,12,3,(i,j,f)=>{
    const wdt=0.5+(j/11)*2.5;
    const xc=3.5+Math.sin(j*1.05+f*2.1)*(1-j/13)*1.2;
    if(Math.abs(i-xc)>wdt) return null;
    if(Math.abs(i-xc)>wdt-0.9) return '#e0501e';
    if(Math.hypot(i-3.5,(j-8)*1.15)<1.9) return '#fff3c8';
    if(j<4.5) return '#ffd88a';
    return '#ff9a3d';
  },{fps:9,sc:1.8});
}
