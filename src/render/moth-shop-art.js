function drawMothItem(ctx,x,y,icon,scale=1){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale,scale);const px=(a,b,w,h,c)=>hearthPixel(ctx,a,b,w,h,c),poly=(a,c)=>hearthPoly(ctx,a,c);
 if(icon==='heart'){poly([[-12,-7],[-8,-12],[-3,-12],[0,-7],[3,-12],[8,-12],[12,-7],[11,0],[0,12],[-11,0]],'#c3876b');px(-7,-8,4,4,'#f4c49a');for(let i=0;i<4;i++){px(-1+i%2,-6+i*4,2,3,'#5c4032');px(-4,-5+i*4,7,1,'#edd3a0');}}
 else if(icon==='map'){poly([[-13,-11],[-5,-8],[3,-12],[13,-9],[13,11],[4,8],[-5,12],[-13,8]],'#c9b78a');px(-5,-8,1,19,'#7a765d');px(4,-10,1,18,'#7a765d');px(-10,-3,19,1,'#95764c');px(-8,3,13,1,'#95764c');px(6,-3,4,4,'#ac6141');}
 else if(icon==='vessel'||icon==='omen'||icon==='cup'){px(-5,-14,10,5,'#c7ac73');px(-3,-9,6,5,'#879e9e');poly([[-4,-6],[-10,0],[-10,9],[-5,13],[6,13],[10,9],[10,0],[4,-6]],icon==='omen'?'#776f92':icon==='cup'?'#829570':'#80afb6');px(-7,1,3,8,'#dce3ba');px(-7,10,14,1,'#415853');if(icon==='omen'){px(-3,0,6,7,'#d5d0a2');px(-1,-2,2,11,'#f3e8b4');}if(icon==='cup'){px(10,-1,5,2,'#c1b784');px(14,0,2,7,'#c1b784');px(10,7,5,2,'#c1b784');}}
 else if(icon==='bell'){poly([[-2,-14],[3,-14],[3,-8],[8,-5],[9,5],[13,8],[13,10],[-13,10],[-13,8],[-9,5],[-8,-5],[-2,-8]],'#c2a365');px(-6,-5,3,11,'#ffe0a0');px(-9,7,18,2,'#e7c286');px(-2,11,4,3,'#e9ca91');}
 else if(icon==='cloak'){poly([[-5,-13],[4,-13],[9,-6],[7,-1],[13,12],[3,10],[0,13],[-5,10],[-13,12],[-7,-1],[-9,-6]],'#759494');px(-4,-6,8,5,'#1e282f');px(-2,-3,2,2,'#e9d7a0');px(2,-3,2,2,'#e9d7a0');px(-2,2,2,8,'#b2c7b4');px(3,4,2,6,'#425e64');}
 else if(icon==='glass'||icon==='thread'){px(-9,-9,18,3,'#b5a57d');px(-9,9,18,3,'#b5a57d');px(-6,-6,12,14,icon==='glass'?'#75adb2':'#acb8b3');for(let i=0;i<4;i++)px(-6,-5+i*3,12,1,'#e8e5bc');px(-2,-11,4,24,'#695f48');px(9,-8,2,19,'#dce7cb');}
 else if(icon==='ashes'){px(-10,-9,20,21,'#86724d');px(-7,-14,14,6,'#b7a276');px(-10,-1,20,3,'#d6bd83');px(-2,-6,4,13,'#ead9a3');px(-4,-2,8,4,'#ead9a3');px(6,5,3,5,'#514433');}
 else if(icon==='temper'){px(-13,2,26,7,'#918f81');px(-9,9,18,4,'#565b56');px(-5,-6,10,8,'#cec093');px(-3,-12,6,5,'#f0dcb0');px(-1,-15,2,3,'#fff1c8');px(8,-9,3,7,'#b3c7c2');px(7,-9,6,2,'#e6dbb3');}
 else if(icon==='cabinet'){px(-12,-13,24,26,'#705d41');px(-10,-11,20,21,'#243338');for(let i=0;i<3;i++){px(-7+i*6,-8,4,15,['#d3ac61','#b4ccbb','#bbaccb'][i]);px(-6+i*6,-7,2,3,'#fff0bd');}px(-12,10,24,3,'#b59760');}
 else if(icon==='kit'){poly([[-13,-1],[-8,-11],[-3,-4],[-4,8],[-10,12]],'#91c5c9');poly([[13,1],[8,-11],[3,-4],[4,8],[10,12]],'#e6b16b');px(-1,-4,2,8,'#fff0b5');px(-4,-1,8,2,'#fff0b5');}
 else if(icon==='pearl'){poly([[0,-13],[9,-6],[12,3],[6,11],[-6,11],[-12,3],[-9,-6]],'#c58b47');px(-5,-6,9,10,'#f5ce83');px(-2,-5,4,7,'#fff3b3');px(-5,6,10,2,'#9c693a');}
 else{for(let i=0;i<4;i++){ctx.rotate(Math.PI/2);px(-1,-15,2,5,'#d9b66b');}poly([[0,-10],[8,-5],[10,3],[4,10],[-4,10],[-10,3],[-8,-5]],'#e1bb67');px(-3,-5,7,10,'#ffe9ab');px(-1,-9,3,4,'#fff9d6');}
 ctx.restore();
}
function drawMothMerchant(ctx,x,y,t){
 ctx.save();ctx.translate(x,y);const px=(a,b,w,h,c)=>hearthPixel(ctx,a,b,w,h,c),poly=(a,c)=>hearthPoly(ctx,a,c),u=save.motion?0:Math.sin(t*.7)*.035;
 for(const side of [-1,1]){ctx.save();ctx.scale(side,1);ctx.rotate(u);poly([[10,-27],[19,-48],[38,-67],[59,-77],[75,-72],[82,-57],[82,-42],[72,-33],[82,-18],[89,5],[80,21],[68,29],[55,16],[40,21],[23,6]],'#56666a');poly([[18,-27],[34,-50],[59,-65],[72,-64],[70,-48],[56,-32],[68,-12],[73,7],[61,17],[47,3],[32,7]],'#819092');
  poly([[32,-33],[44,-46],[58,-52],[61,-44],[53,-30],[43,-23]],'#c6bf9b');poly([[42,-36],[48,-42],[55,-44],[55,-37],[49,-32]],'#343a40');for(let i=0;i<5;i++){px(23+i*9,-24+i*4,2,11,'#3d5057');px(29+i*8,-19+i*4,6,1,'#b4b8a0');}px(68,-60,3,8,'#c5c2a1');px(74,-47,3,7,'#46565c');px(62,11,3,6,'#c5c2a1');ctx.restore();}
 poly([[-23,-40],[-11,-56],[12,-56],[25,-39],[21,-19],[29,16],[21,40],[4,42],[-2,45],[-24,38],[-30,15],[-20,-18]],'#1e2b30');poly([[-14,-42],[-8,-49],[8,-49],[16,-39],[11,-25],[-13,-25]],'#596f73');poly([[-11,-37],[10,-37],[12,-27],[7,-17],[-7,-17],[-13,-27]],'#0c1820');px(-8,-30,5,3,'#eadba0');px(4,-30,5,3,'#eadba0');px(-7,-29,2,1,'#fff8d5');px(5,-29,2,1,'#fff8d5');px(-1,-21,2,3,'#8d9d94');
 poly([[-21,-17],[-5,-12],[17,-19],[23,-9],[0,-1],[-25,-7]],'#a7976f');px(-16,-12,20,2,'#e0c99b');px(1,-6,4,10,'#c5b582');px(6,-5,3,19,'#6d725c');
 for(let i=0;i<5;i++){px(-19+i*8,3+i%2*4,3,28-i%2*7,i%2?'#688384':'#3f5c62');px(-18+i*8,31-i%2*3,2,5,'#9da99a');}px(-22,33,46,5,'#99a49a');px(-16,37,33,3,'#3b555b');
 for(const side of [-1,1]){px(side*9-1,-59,2,11,'#c4be98');px(side*13-1,-67,2,9,'#889c96');px(side*17-1,-69,5,2,'#ded0a5');poly([[side*18,-12],[side*37,3],[side*34,12],[side*18,3]],'#697e7f');px(side*34-3,9,9,4,'#b6bfaa');}
 px(20,27,13,12,'#86734d');px(22,29,9,2,'#d5b97f');ctx.restore();
}
let mothRoomArt=null;
function mothRoomBackdrop(){
 if(mothRoomArt)return mothRoomArt;const cv=document.createElement('canvas');cv.width=640;cv.height=360;const ctx=cv.getContext('2d'),px=(x,y,w,h,c)=>hearthPixel(ctx,x,y,w,h,c),poly=(a,c)=>hearthPoly(ctx,a,c);
 px(0,0,640,360,'#12191c');for(let y=15;y<265;y+=21)for(let x=-((y/21|0)%2)*25;x<640;x+=52){px(x,y,50,19,['#303c3b','#2a3637','#34403d'][((x+y+60)%3+3)%3]);px(x+2,y+1,47,2,'#535a4a');px(x+47,y+3,2,14,'#18282d');if((x*y)%7===0)px(x+10,y+11,12,1,'#5c614f');}
 for(const x of [13,190,442,610]){px(x,10,19,249,'#253132');px(x+2,10,12,249,'#6c6047');px(x+3,13,2,236,'#a88b5a');px(x-5,254,28,7,'#99805b');}
 px(7,6,626,15,'#665438');px(13,8,614,2,'#aa8858');for(let x=25;x<625;x+=32){px(x,12,2,4,'#1c292b');px(x+8,14,12,1,'#9c7c4a');}
 poly([[0,261],[640,261],[640,360],[0,360]],'#4b4b3f');for(let y=263;y<360;y+=17)for(let x=-((y/17|0)%2)*35;x<640;x+=73){px(x,y,70,15,['#5c5b49','#505747','#4d5145'][((x+y+90)%3+3)%3]);px(x+2,y+1,66,1,'#8e8461');px(x+3,y+13,60,1,'#333e38');}
 px(215,41,213,159,'#17262b');poly([[225,189],[225,73],[242,73],[242,52],[263,52],[263,41],[378,41],[378,52],[400,52],[400,73],[415,73],[415,189]],'#778069');px(238,76,165,110,'#17242c');px(244,82,153,104,'#253744');for(let i=0;i<7;i++){px(249+i*20,90+(i*31)%63,1,1,'#c4bf99');poly([[241+i*23,187],[256+i*23,119+(i%3)*15],[271+i*23,187]],'#142b31');}
 px(319,65,4,124,'#b5a879');px(239,125,165,4,'#a2966d');px(211,192,220,8,'#a09570');px(218,201,207,4,'#465849');
 for(const x of [45,476]){px(x,50,119,164,'#18292c');px(x-4,45,128,7,'#ae915e');px(x+4,58,111,147,'#475246');for(let row=0;row<4;row++){const y=63+row*36;px(x+9,y,100,28,'#14262c');for(let col=0;col<8;col++){const xx=x+13+col*12;px(xx,y+8-(col%2)*3,8,18+(col%2)*3,['#5c9290','#a18459','#798b69','#b99f68'][col%4]);px(xx+1,y+10,2,10,'#c5ceb2');px(xx+2,y+4,4,5,'#8b8262');}px(x+3,y+30,112,5,'#b39766');px(x+8,y+31,101,1,'#e1c082');}px(x-3,211,126,5,'#917c55');}
 for(const x of [171,457]){px(x,41,2,39,'#748276');px(x-5,38,12,5,'#c6ad79');}
 px(177,229,285,11,'#d6b57e');px(185,240,269,65,'#725a3b');px(191,247,257,50,'#a48a5c');for(let i=0;i<5;i++){px(198+i*49,252,40,38,'#75684a');px(201+i*49,254,34,2,'#c8b17a');px(214+i*49,263,10,2,'#3b4336');px(217+i*49,268,4,14,'#576148');}px(178,302,283,9,'#3a4338');px(185,310,17,12,'#ac8c58');px(433,310,17,12,'#ac8c58');
 px(234,216,64,6,'#bca17a');px(238,213,54,3,'#e4d0a4');px(243,207,43,6,'#8b8c70');px(360,216,15,10,'#7f9690');px(363,211,9,5,'#bcc5a6');px(384,215,18,11,'#82694c');px(387,216,10,2,'#cbae73');
 px(64,239,103,39,'#283b3a');px(68,243,95,31,'#637c6a');px(78,243,3,30,'#a19c6a');px(150,243,3,30,'#a19c6a');px(113,249,8,12,'#d0b16b');px(115,251,4,5,'#494d3c');px(67,277,98,5,'#192a2d');
 for(let i=0;i<4;i++){const x=485+i*27;px(x,238+(i%2)*8,24,26,'#817658');px(x+2,240+(i%2)*8,20,2,'#b7a774');px(x+6,245+(i%2)*8,11,9,'#485c50');}px(485,275,101,6,'#ac8e61');px(493,281,5,25,'#6e6146');px(574,281,5,25,'#6e6146');
 for(let i=0;i<9;i++){const x=243+i*18;px(x,33,2,16+(i%3)*4,'#a19972');px(x-3,49+(i%3)*4,8,3,'#86a399');}mothRoomArt=cv;return cv;
}
function drawMothShopScene(c,w,h,t){
 c.save();c.imageSmoothingEnabled=false;c.scale(w/640,h/560);c.fillStyle='#1b2a2b';c.fillRect(0,0,640,560);for(let y=0;y<76;y+=16)for(let x=0;x<640;x+=44)hearthPixel(c,x,y,42,14,(x+y)%3?'#303d39':'#3a433b');hearthPixel(c,16,12,608,10,'#7c6844');hearthPixel(c,24,14,592,2,'#b89960');for(let i=0;i<7;i++){hearthPixel(c,24+i*94,22,13,60,'#4c4736');hearthPixel(c,26+i*94,24,2,56,'#9b8253');}hearthPixel(c,225,24,191,31,'#192b2c');hearthPixel(c,232,27,177,25,'#5d644b');c.fillStyle='#efdaa4';c.font='10px monospace';c.textAlign='center';c.fillText('M O T H ’ S   B A C K   R O O M',320,44);c.translate(0,70);c.drawImage(mothRoomBackdrop(),0,0);const seconds=t/1000,s=currentSecret();
 drawMothMerchant(c,321,187,seconds);for(const x of [172,459])hearthLantern(c,x,104,'bellglass',seconds);
 const stock=secretShopStock(s);for(let i=0;i<stock.length&&i<7;i++){const x=190+i*40,owned=secretItemOwned(s,stock[i].id);c.globalAlpha=owned?.23:1;drawMothItem(c,x,231,stock[i].icon,.55);c.globalAlpha=1;}
 for(let i=0;i<12&&!save.motion;i++){const x=242+(i*29)%154,y=83+(i*17+seconds*4)%81;hearthPixel(c,x,y,1,1,'#d5d2aa');}
 for(const x of [315,383]){hearthPixel(c,x,218,2,7,'#e5cf91');hearthPixel(c,x-1,211+Math.sin(seconds*4+x)*1,4,7,'#88bcc0');hearthPixel(c,x,213,2,4,'#e6f3d7');}
 for(let row=0;row<7;row++){const y=329+row*20;for(let x=0;x<640;x+=83){hearthPixel(c,x,y,81,18,['#51594a','#465447','#5b604b'][row%3]);hearthPixel(c,x+3,y+1,76,1,'#8f8860');}}hearthPoly(c,[[223,341],[417,341],[457,447],[183,447]],'#334d48');hearthPoly(c,[[230,345],[410,345],[443,441],[197,441]],'#849171');hearthPoly(c,[[234,347],[406,347],[435,437],[205,437]],'#354d49');for(let i=0;i<5;i++)hearthPoly(c,[[274+i*24,364],[279+i*24,370],[274+i*24,377],[269+i*24,370]],'#b3b38a');hearthPixel(c,42,345,107,62,'#293e39');hearthPixel(c,48,349,94,53,'#7d7c56');hearthPixel(c,50,353,89,2,'#b7a477');hearthPixel(c,62,350,4,51,'#bea77a');hearthPixel(c,126,350,4,51,'#bea77a');hearthPixel(c,94,363,9,14,'#dab67b');for(let i=0;i<3;i++){const x=493+i*27;hearthPixel(c,x,358+i*8,23,38,'#60755c');hearthPixel(c,x+2,360+i*8,18,2,'#adb38a');hearthPixel(c,x+7,348+i*8,8,12,'#c4b78b');}for(const x of [52,541])hearthLantern(c,x,434,'bellglass',seconds);c.restore();
}
const mothSecretFrame=drawSecretFrame;
drawSecretFrame=function(now){if(currentSecret()?.type!=='shop')return mothSecretFrame(now);if(!secretOverlay.classList.contains('open'))return;drawMothShopScene(secretCtx,secretCanvas.width,secretCanvas.height,save.motion?2400:now-secretOpenAt);secretAnim=requestAnimationFrame(drawSecretFrame);};
const mothDrawCombatFX=drawCombatFX;
drawCombatFX=function(ctx){mothDrawCombatFX(ctx);if(!G.run||!G.player)return;for(const f of mothGoods().fields){ctx.save();ctx.translate(f.x,f.y);ctx.scale(.32,.32);ctx.globalAlpha=.5*f.t;drawMothMerchant(ctx,0,0,save.motion?0:G.tAll);ctx.restore();}};
