rarityOdds=function(){
 const campaign=clamp((G.floor-1)/49,0,1),endless=clamp((G.floor-50)/80,0,1),luck=clamp(META.rarity||0,0,.13),treasure=G.opts.freeChoice?1:0,stars=G.run?.infinite?Math.max(0,oathRank('stars')):0;
 const mythic=Math.min(.045,.0025+campaign*.0125+endless*.01+luck*.06+treasure*.004+Math.min(.014,stars*.0035));
 const epic=Math.min(.32,.065+campaign*.095+endless*.055+luck*.38+treasure*.03+Math.min(.06,stars*.015));
 const uncommon=Math.min(.36,.255+campaign*.06+luck*.12+treasure*.012+Math.min(.025,stars*.006));
 return [1-uncommon-epic-mythic,uncommon,epic,mythic];
};
rollRarity=function(pool){
 const odds=rarityOdds(),available=new Set(pool.map(o=>o.r));let roll=Math.random(),target=0;
 for(let i=0;i<odds.length;i++){roll-=odds[i];if(roll<=0){target=i;break;}}
 for(let i=target;i>=0;i--)if(available.has(i))return i;
 for(let i=target+1;i<4;i++)if(available.has(i))return i;
 return 0;
};
const MYTHIC_FALLBACK={id:'emberglow',r:0,max:0,w:1,icon:'heart',name:'Emberglow',ds:'Restore 15% health',consumable:true};
buildCards=function(){
 const u=G.run.up,eligible=o=>(u[o.id]||0)<o.max&&(!o.unlock||armoryData()[o.unlock])&&G.floor>=(o.minFloor||1);
 let pool=POOL.filter(eligible),restoreIds=G.restoreCardIds||[],restoring=restoreIds.length>0,picks=restoreIds.map(id=>POOL.find(o=>o.id===id)||(id===MYTHIC_FALLBACK.id?MYTHIC_FALLBACK:null)).filter(Boolean);G.restoreCardIds=null;
 if(!pool.some(o=>o.r===0))pool.push(MYTHIC_FALLBACK);
 while(picks.length<3&&pool.length){
  const rarity=rollRarity(pool),tier=pool.filter(o=>o.r===rarity);let total=tier.reduce((n,o)=>n+o.w,0),roll=Math.random()*total,sel=tier[0];
  for(const o of tier){roll-=o.w;if(roll<=0){sel=o;break;}}
  picks.push(sel);pool=pool.filter(o=>o!==sel&&(sel.r!==3||o.r!==3));
 }
 const wrap=T('cards');wrap.replaceChildren();
 for(let i=0;i<picks.length;i++){
  const o=picks[i],rank=u[o.id]||0,el=document.createElement('button');el.className='card'+(o.r===3?' mythic-reveal':'');el.dataset.r=o.r;el.type='button';
  const pips=o.max<=8?'<div class="pips">'+Array.from({length:o.max},(_,k)=>`<em class="${k<rank?'on':''}"></em>`).join('')+'</div>':'';
  el.innerHTML=`<span class="key">${i+1}</span><div class="rar">${RARITY[o.r].n}</div><div class="ic"><i data-lucide="${o.icon}"></i></div><div class="nm cinzel">${o.name}</div><div class="ds">${o.ds}</div>${pips}<div class="card-rank">${o.consumable?'TAKE THE WARMTH':rank?'RANK '+(rank+1):'NEW BLESSING'}</div>`;el._up=o;on(el,'click',()=>chooseCard(i));wrap.appendChild(el);
 }
 G.cardPool=picks;const mythic=picks.find(o=>o.r===3),level=T('levelup'),frame=T('luWrap');level.classList.toggle('mythic-offer',!!mythic);frame.classList.toggle('mythic-draft',!!mythic);
 if(mythic)T('luSub').textContent='A MYTHIC BLESSING HAS ANSWERED';
 refreshIcons();if(mythic&&!restoring)setTimeout(()=>{if(G.state==='levelup'&&G.cardPool?.includes(mythic))sfx('mythicReveal');},140);
};
const rarityFeelChooseCard=chooseCard;
chooseCard=function(i){
 const chosen=G.state==='levelup'&&G.cardPool?.[i],mythic=chosen?.r===3?chosen:null;rarityFeelChooseCard(i);
 if(mythic){G.run.mythicsFound=(G.run.mythicsFound||0)+1;toast('MYTHIC · '+mythic.name,'the dark gave up something rare');sfx('mythicClaim');saveNow();}
};
const rarityFeelSfx=sfx;
sfx=function(name,a){
 if(name!=='mythicReveal'&&name!=='mythicClaim')return rarityFeelSfx(name,a);
 if(!AC||!save.sfx)return;
 if(name==='mythicReveal'){air(1.35,.045,360,3100,.65,0);swell([110,164.81,220,329.63,440,659.25],2.05,.036,.04);bell(1318.5,1.45,.025,.34,false);bell(1760,1.05,.015,.56,false);}
 else{thump(185,48,.42,.09);swell([220,329.63,440,659.25,880],1.35,.043,0);bell(1760,1.1,.024,.16,false);}
};
const rarityFeelStyle=document.createElement('style');rarityFeelStyle.textContent=`
#levelup.mythic-offer{background:radial-gradient(ellipse at 50% 38%,#6e431f45,#1a102a9c 42%,#03050bed 86%)}
#luWrap.mythic-draft{border-color:#ffd58bd4;box-shadow:0 24px 90px #000d,0 0 42px #ffad4b38,0 0 110px #9e5cff24,inset 0 0 45px #d8902a13;animation:mythicFrameWake 1.15s cubic-bezier(.16,.8,.2,1) both}
#luWrap.mythic-draft #luTitle{color:#fff0c1;text-shadow:0 0 12px #fff3c288,0 0 32px #ff9d4c66}#luWrap.mythic-draft #luSub{color:#f6c878;text-shadow:0 0 15px #d18243;animation:mythicLetters 2.4s ease-in-out infinite}
.card.mythic-reveal{--relic:#ffe2a0;--relic-rgb:255,185,93;border-color:#ffe4a2;box-shadow:0 0 0 1px #9c6cff66,0 18px 52px #000c,0 0 38px #ff9d4b6b,0 0 80px #9958dd2e,inset 0 0 32px #ffcb7b16;animation:mythicCardArrive 1.05s cubic-bezier(.12,.83,.19,1) backwards}
.card.mythic-reveal::before{inset:5px;border-color:#ffe3a47a;box-shadow:inset 0 0 18px #9c6cff26}.card.mythic-reveal::after{background:linear-gradient(115deg,transparent 39%,#ffffff08 44%,#ffe8ad69 48%,#ffffffbd 50%,#b67bff4a 53%,transparent 59%);animation:mythicCardSweep 2.8s .7s ease-in-out infinite}
.card.mythic-reveal .ic{background:radial-gradient(circle,#fff4c52b,#8e4ec71c 48%,#070911 72%);box-shadow:0 0 22px #ffba6170,0 0 48px #9e61df35,inset 0 0 16px #fff0b52b}.card.mythic-reveal .ic::before{border-color:#ffe0a866;animation:mythicDiamond 3.8s linear infinite}.card.mythic-reveal .ic::after{border-color:#c68bff77;box-shadow:0 0 18px #ffad5366;animation:slowRevolve 8s linear infinite}.card.mythic-reveal .ic svg{color:#fff1b9;filter:drop-shadow(0 0 6px #fff) drop-shadow(0 0 13px #ff9f4d)}
.card.mythic-reveal .rar{color:#ffe6a5!important;text-shadow:0 0 8px #fff1bd,0 0 18px #ff9e4e}.card.mythic-reveal .nm{color:#fff2d0;text-shadow:0 0 16px #e99a4a55}.card.mythic-reveal:hover,.card.mythic-reveal:focus-visible{border-color:#fff2ca;box-shadow:0 22px 58px #000d,0 0 50px #ffac526f,0 0 100px #a15de345,inset 0 0 28px #ffd8931f}
@keyframes mythicFrameWake{0%{opacity:.25;transform:scale(.94);filter:brightness(2)}35%{filter:brightness(1.35)}100%{opacity:1;transform:none;filter:none}}@keyframes mythicCardArrive{0%{opacity:0;transform:translateY(42px) rotateX(18deg) scale(.82);filter:brightness(3)}45%{opacity:1;transform:translateY(-9px) rotateX(-2deg) scale(1.045);filter:brightness(1.35)}100%{transform:none;filter:none}}@keyframes mythicCardSweep{0%,18%{transform:translateX(-70%) rotate(7deg)}52%,100%{transform:translateX(62%) rotate(7deg)}}@keyframes mythicLetters{0%,100%{opacity:.72}50%{opacity:1}}@keyframes mythicDiamond{to{transform:rotate(360deg)}}
@media(max-width:700px){.card.mythic-reveal{box-shadow:0 0 0 1px #9c6cff55,0 8px 30px #000b,0 0 28px #ff9d4b55,0 0 55px #9958dd25}}
`;if(document.head)document.head.appendChild(rarityFeelStyle);

const finalGuardianSfx=sfx;
sfx=function(name,a){
 finalGuardianSfx(name,a);if(name!=='bossLaser'||!AC||!save.sfx)return;
 thump(118,34,.48,.11);air(.75,.065,260,2600,.72,0,'bandpass');swell([82.41,123.47,164.81,246.94],1.25,.032,.04);bell(987.77,.75,.022,.28,true);
};
