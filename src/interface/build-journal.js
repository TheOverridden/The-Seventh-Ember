const buildJournal={tab:'build',filter:'all',family:'all',search:'',ingredient:null,from:'pause',signature:'',noticeUntil:0,notices:[]};
function buildAnnounce(name){
 if(!buildJournal.notices.includes(name))buildJournal.notices.push(name);buildJournal.noticeUntil=G.t+5;
}
function buildOwned(){return POOL.filter(c=>blessingRank(c.id)>0);}
function buildHudRefresh(){
 const button=T('buildHud');if(!button)return;
 if(buildJournal.run!==G.run){buildJournal.run=G.run;buildJournal.signature='reset';buildJournal.notices=[];buildJournal.noticeUntil=0;}
 const cards=buildOwned(),combos=BLESSING_COMBOS.filter(c=>blessingComboActive(c.id)),evolutions=G.run?.evolutions||[],key=cards.map(c=>c.id+':'+blessingRank(c.id)).join(',')+'|'+evolutions.join(',');
 button.hidden=!G.run;
 if(key!==buildJournal.signature){
  buildJournal.signature=key;T('buildCardCount').textContent=cards.length;T('buildComboCount').textContent=combos.length;T('buildEvoCount').textContent=evolutions.length;
  const ctx=T('buildSigil').getContext('2d');ctx.clearRect(0,0,48,48);drawComboEmblem(ctx,combos.at(-1)?.family||'meteor',24,24,36);
  button.setAttribute('aria-label','View build: '+cards.length+' blessings, '+combos.length+' combinations, '+evolutions.length+' evolutions');
 }
 const notice=T('buildNotice');if(buildJournal.notices.length&&G.t<buildJournal.noticeUntil){notice.textContent=buildJournal.notices[0]+(buildJournal.notices.length>1?' + '+(buildJournal.notices.length-1)+' combinations':' activated');button.classList.add('new-combo');}
 else{buildJournal.notices=[];notice.textContent='VIEW BUILD';button.classList.remove('new-combo');}
}
addChip=function(){buildHudRefresh();};
renderEvolutionChips=function(){T('evolutionRail')?.replaceChildren();buildHudRefresh();};
pumpEvolution=function(){if(!evolutionQueue.length)return;for(const e of evolutionQueue.splice(0))buildAnnounce(e.name);sfx('formEvolution');};
function buildEmblem(family){
 const canvas=document.createElement('canvas');canvas.width=76;canvas.height=76;canvas.className='build-emblem';canvas.setAttribute('aria-hidden','true');drawComboEmblem(canvas.getContext('2d'),family,38,38,52);return canvas;
}
function buildSetTab(tab){buildJournal.tab=tab;buildJournal.ingredient=null;buildJournal.search='';T('buildSearch').value='';blessingComboRefresh();}
function blessingComboRefresh(){
 const list=T('comboList');if(!list)return;const cards=buildOwned(),active=BLESSING_COMBOS.filter(c=>blessingComboActive(c.id));
 T('buildSummary').textContent=cards.length+' blessings · '+active.length+' / '+BLESSING_COMBOS.length+' combinations · '+(G.run?.evolutions?.length||0)+' / '+EVOLUTION_RECIPES.length+' evolutions';
 for(const el of document.querySelectorAll('[data-build-tab]')){const selected=el.dataset.buildTab===buildJournal.tab;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected));}
 T('buildFilters').hidden=buildJournal.tab!=='combos';T('buildFamily').hidden=buildJournal.tab!=='combos';
 for(const el of document.querySelectorAll('[data-build-filter]')){const selected=el.dataset.buildFilter===buildJournal.filter;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected));}
 list.className='build-list '+buildJournal.tab;list.replaceChildren();
 const search=buildJournal.search.trim().toLowerCase();let count=0;
 if(buildJournal.tab==='build'){
  for(const card of [...cards].sort((a,b)=>b.r-a.r||a.name.localeCompare(b.name))){if(search&&!(card.name+' '+card.ds).toLowerCase().includes(search))continue;
   const el=document.createElement('button');el.type='button';el.className='build-blessing';el.dataset.r=card.r;
   el.innerHTML='<div class="build-card-icon"><i data-lucide="'+card.icon+'"></i></div><div><small>'+RARITY[card.r].n+' · RANK '+blessingRank(card.id)+' / '+card.max+'</small><h4>'+card.name+'</h4><p>'+card.ds+'</p></div><span class="build-pair-arrow" aria-hidden="true">›</span>';
   if(COMBO_CARD_BY_ID[card.id])el.querySelector('.build-card-icon').replaceChildren(buildEmblem(COMBO_CARD_BY_ID[card.id].family));
   const pairs=BLESSING_COMBOS.filter(c=>c.cards.includes(card.id));el.disabled=!pairs.length;el.setAttribute('aria-label',card.name+', rank '+blessingRank(card.id)+(pairs.length?'. View '+pairs.length+' combinations.':''));
   el.addEventListener('click',()=>{buildJournal.tab='combos';buildJournal.ingredient=card.id;buildJournal.filter='all';buildJournal.family='all';T('buildFamily').value='all';blessingComboRefresh();});list.appendChild(el);count++;
  }
 }else if(buildJournal.tab==='combos'){
  for(const combo of BLESSING_COMBOS){const held=combo.cards.filter(id=>blessingRank(id)>0).length,on=held===combo.cards.length;
   if(buildJournal.filter==='active'&&!on||buildJournal.filter==='near'&&held!==combo.cards.length-1||buildJournal.family!=='all'&&combo.family!==buildJournal.family||buildJournal.ingredient&&!combo.cards.includes(buildJournal.ingredient))continue;
   const names=combo.cards.map(id=>POOL.find(c=>c.id===id).name);if(search&&!(combo.name+' '+combo.ds+' '+names.join(' ')).toLowerCase().includes(search))continue;
   const el=document.createElement('article');el.className='combo-entry'+(on?' active':'');el.dataset.family=combo.family;el.tabIndex=0;el.setAttribute('role','group');el.setAttribute('aria-label',combo.name+'. '+(on?'Active. ':'')+combo.ds);el.appendChild(buildEmblem(combo.family));
   const body=document.createElement('div');body.innerHTML='<div class="combo-state">'+(on?'ACTIVE':held?'ONE BLESSING AWAY':'RECIPE')+'</div><h4>'+combo.name+'</h4><p>'+combo.ds+'</p><div class="combo-parts">'+combo.cards.map((id,i)=>'<span class="'+(blessingRank(id)?'owned':'')+'">'+(blessingRank(id)?'✓ ':'')+names[i]+(blessingRank(id)?' · '+blessingRank(id):'')+'</span>').join('')+'</div>';el.appendChild(body);list.appendChild(el);count++;
  }
 }else{
  for(const e of EVOLUTION_RECIPES){const form=FORM_BY_ID[e.form],on=hasEvolution(e.id);if(search&&!(e.name+' '+e.effect+' '+form.name+' '+recipeText(e)).toLowerCase().includes(search))continue;
   const el=document.createElement('article');el.className='combo-entry evolution-entry'+(on?' active':'');el.tabIndex=0;el.setAttribute('role','group');el.setAttribute('aria-label',e.name+'. '+e.effect);el.appendChild(buildEmblem(form.slot==='dash'?'storm':form.slot==='flare'?'blade':'prism'));
   const body=document.createElement('div');body.innerHTML='<div class="combo-state">'+(on?'EVOLVED':'FORM EVOLUTION')+'</div><h4>'+e.name+'</h4><p>'+e.effect+'</p><div class="combo-parts"><span class="'+(formForRun(e.form)?'owned':'')+'">'+form.name+'</span>'+Object.entries(e.cards).map(([id,n])=>'<span class="'+(blessingRank(id)>=n?'owned':'')+'">'+POOL.find(c=>c.id===id).name+' · '+blessingRank(id)+' / '+n+'</span>').join('')+'</div>';el.appendChild(body);list.appendChild(el);count++;
  }
 }
 T('buildResultCount').textContent=buildJournal.ingredient?'Pairings for '+POOL.find(c=>c.id===buildJournal.ingredient).name:count+' '+(buildJournal.tab==='build'?'blessings':buildJournal.tab==='combos'?'combinations':'evolutions');
 if(!count){const empty=document.createElement('p');empty.className='build-empty';empty.textContent=buildJournal.tab==='build'&&!cards.length?'Your blessings will appear here as the descent grows.':'No matches. Try another filter.';list.appendChild(empty);}
 refreshIcons();
}
function buildOpen(tab='build',from='pause'){
 if(from==='hud'){if(G.state!=='playing'||anyBlockingOverlay()||G.descending)return;pauseGame(true);hide('pause');}
 buildJournal.from=from;buildJournal.filter='all';buildJournal.family='all';T('buildFamily').value='all';clearInput();buildSetTab(tab);show('blessingCombos');T('comboClose').focus({preventScroll:true});
}
function blessingComboClose(){
 hide('blessingCombos');clearInput();if(buildJournal.from==='hud')pauseGame(false);else T('btnCombos')?.focus({preventScroll:true});
}
const buildBlockingOverlay=anyBlockingOverlay;
anyBlockingOverlay=function(){return !!T('blessingCombos')?.classList.contains('open')||buildBlockingOverlay();};
const buildEscape=onEscKey;
onEscKey=function(){if(T('blessingCombos')?.classList.contains('open'))return blessingComboClose();return buildEscape();};
const journalBuildCards=buildCards;
buildCards=function(){
 const result=journalBuildCards();for(const el of T('cards').children){const card=el._up;if(!card)continue;
  if(COMBO_CARD_BY_ID[card.id])el.querySelector('.ic').replaceChildren(buildEmblem(COMBO_CARD_BY_ID[card.id].family));
  const pairs=BLESSING_COMBOS.filter(c=>c.cards.includes(card.id)),complete=pairs.filter(c=>!blessingComboActive(c.id)&&c.cards.every(id=>id===card.id||blessingRank(id)>0));if(!pairs.length)continue;
  const hint=document.createElement('div');hint.className='combo-preview'+(complete.length?' complete':'');
  hint.textContent=complete.length?'ACTIVATES '+complete.slice(0,2).map(c=>c.name).join(' + ')+(complete.length>2?' + '+(complete.length-2)+' more':''):pairs.length+' COMBO RECIPES';
  hint.title=pairs.map(c=>c.name+': '+c.cards.filter(id=>id!==card.id).map(id=>POOL.find(o=>o.id===id).name).join(' + ')).join('\n');el.appendChild(hint);
 }return result;
};
const buildUpdateHUD=updateHUD;
let buildHudClock=0;
updateHUD=function(dt){const result=buildUpdateHUD(dt);buildHudClock-=dt;if(buildHudClock<=0||!dt){buildHudClock=.25;buildHudRefresh();}return result;};
{
 const button=document.createElement('button');button.id='btnCombos';button.className='btn';button.textContent='BUILD & COMBINATIONS';T('btnPauseMemories').after(button);
 const hud=document.createElement('button');hud.id='buildHud';hud.type='button';hud.hidden=true;hud.innerHTML='<canvas id="buildSigil" width="48" height="48" aria-hidden="true"></canvas><div class="build-hud-content"><div class="build-hud-title">BUILD <span id="buildNotice">VIEW BUILD</span></div><div class="build-hud-counts"><span><b id="buildCardCount">0</b> blessings</span><span><b id="buildComboCount">0</b> combos</span><span><b id="buildEvoCount">0</b> evolved</span></div></div><span class="build-hud-arrow" aria-hidden="true">›</span>';T('botL').appendChild(hud);
 const overlay=document.createElement('div');overlay.id='blessingCombos';overlay.className='ov';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','comboTitle');
 overlay.innerHTML='<div class="panel build-panel"><div class="build-heading"><header><span>YOUR DESCENT</span><h3 id="comboTitle">The shape of your flame</h3><p id="buildSummary"></p></header><button class="btn" id="comboClose">BACK</button></div><div class="build-tabs" aria-label="Build views"><button data-build-tab="build">MY BUILD</button><button data-build-tab="combos">COMBINATIONS</button><button data-build-tab="evolutions">EVOLUTIONS</button></div><div class="build-tools"><input id="buildSearch" type="search" maxlength="80" placeholder="Search blessings or effects…" aria-label="Search build"><select id="buildFamily" aria-label="Combination family"><option value="all">All effects</option>'+[['frost','Frost'],['storm','Lightning'],['stone','Fissures'],['tide','Waves'],['moon','Crescents'],['blade','Blades'],['meteor','Meteors'],['moth','Moths'],['prism','Prisms'],['stitch','Starstitch']].map(([id,name])=>'<option value="'+id+'">'+name+'</option>').join('')+'</select></div><div id="buildFilters" class="build-filters"><button data-build-filter="all">ALL RECIPES</button><button data-build-filter="active">ACTIVE</button><button data-build-filter="near">ONE AWAY</button></div><div class="build-result-line"><span id="buildResultCount"></span><span id="buildHelp">Recipes activate automatically. Higher blessing ranks keep their benefits.</span></div><div id="comboList" class="build-list"></div></div>';document.body.appendChild(overlay);
 button.addEventListener('click',()=>buildOpen('combos'));hud.addEventListener('click',()=>buildOpen('build','hud'));T('comboClose').addEventListener('click',blessingComboClose);
 for(const el of document.querySelectorAll('[data-build-tab]'))el.addEventListener('click',()=>buildSetTab(el.dataset.buildTab));
 for(const el of document.querySelectorAll('[data-build-filter]'))el.addEventListener('click',()=>{buildJournal.filter=el.dataset.buildFilter;blessingComboRefresh();});
 T('buildSearch').addEventListener('input',e=>{buildJournal.search=e.target.value;buildJournal.ingredient=null;blessingComboRefresh();});T('buildFamily').addEventListener('change',e=>{buildJournal.family=e.target.value;blessingComboRefresh();});
}
