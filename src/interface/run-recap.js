'use strict';
let recapDamageContext=null,recapReturnFocus=null;
function recapSource(sx,sy){
 const source=G.enemies.find(e=>!e.dead&&Math.hypot(e.x-sx,e.y-sy)<2);
 return source?(source.name||String(source.type||'Enemy').replace(/([a-z])([A-Z])/g,'$1 $2')):'Projectile or room hazard (source not identified)';
}
const recapHurt=hurtPlayer;
hurtPlayer=function(dmg,sx,sy){const previous=recapDamageContext;recapDamageContext={source:recapSource(sx,sy),incoming:Math.round(dmg),hpBefore:Math.ceil(G.player?.hp||0)};try{return recapHurt(dmg,sx,sy);}finally{recapDamageContext=previous;}};
function makeRunRecap(){
 const r=G.run,p=G.player;if(!r||!p)return null;
 return {version:1,build:document.querySelector('meta[name="voidfall-build"]')?.content||'unknown',mode:r.infinite?'Endless':r.mode||'campaign',floor:G.floor,level:r.level,kills:r.kills,seconds:Math.floor(r.t),essence:Math.round(r.ess||0),guardian:G.boss?.name||'No active guardian',guardians:(r.recapGuardians||[]).slice(-60),death:recapDamageContext?{...recapDamageContext}:{source:'Cause not recorded'},blessings:POOL.filter(c=>r.up[c.id]).map(c=>({id:c.id,name:c.name,rank:r.up[c.id]})),forms:Object.values(r.forms||{}).map(id=>FORM_BY_ID[id]?.name||id),sigils:TREE_NODES.filter(n=>save.nodes[n.id]).map(n=>n.id),room:specialEncounterAt()?.type||'ordinary room',health:p.maxHp,damage:Math.round(p.dmg),guardianPhase:G.boss?.bs?.phase??G.boss?.wb?.mode??null};
}
function cleanRunRecap(raw){
 if(!raw||raw.version!==1||!Number.isFinite(raw.floor))return null;
 const str=v=>typeof v==='string'?v.slice(0,180):'';
 const num=v=>Number.isFinite(v)?Math.max(0,Math.min(1e12,Math.floor(v))):0;
 if(![raw.blessings,raw.forms,raw.guardians,raw.sigils].every(Array.isArray)||!raw.death)return null;
 return {version:1,build:str(raw.build),mode:str(raw.mode),floor:num(raw.floor),level:num(raw.level),kills:num(raw.kills),seconds:num(raw.seconds),essence:num(raw.essence),guardian:str(raw.guardian),room:str(raw.room),health:num(raw.health),damage:num(raw.damage),guardianPhase:str(String(raw.guardianPhase??'')),death:{source:str(raw.death.source)||'Cause not recorded',incoming:num(raw.death.incoming),hpBefore:num(raw.death.hpBefore)},guardians:raw.guardians.slice(-60).filter(g=>g&&typeof g.name==='string').map(g=>({name:str(g.name),floor:num(g.floor)})),blessings:raw.blessings.slice(0,300).filter(c=>c&&typeof c.name==='string').map(c=>({id:str(c.id),name:str(c.name),rank:num(c.rank)})),forms:raw.forms.slice(0,8).map(str),sigils:raw.sigils.slice(0,1000).map(str)};
}
const recapValidate=validateSave;
validateSave=function(raw){const result=recapValidate(raw);result.lastRunRecap=cleanRunRecap(raw?.lastRunRecap);return result;};
const recapKillBoss=killBoss;
killBoss=function(b){if(G.run){G.run.recapGuardians=G.run.recapGuardians||[];const name=b.name||b.bossKey||'Guardian';if(!G.run.recapGuardians.some(x=>x.floor===G.floor&&x.name===name))G.run.recapGuardians.push({floor:G.floor,name});G.run.recapGuardians=G.run.recapGuardians.slice(-60);}return recapKillBoss(b);};
const recapDie=die;
die=function(){if(!G.dead&&G.run){save.lastRunRecap=cleanRunRecap(makeRunRecap());markSave();}return recapDie();};
function recapNextGoal(){
 const goal=formGoal(),path=goal?formGoalPath(goal):null;
 const options=TREE_NODES.filter(n=>!save.nodes[n.id]&&masteryParents(n).every(p=>save.nodes[p.id])&&(!path||path.has(n.id))).sort((a,b)=>a.cost-b.cost);
 const node=options.find(n=>n.cost<=save.essence)||options[0];
 if(node)return{node,text:(goal?'Toward '+goal.name+': ':'Next sigil: ')+node.name+' · '+(node.cost<=save.essence?'Ready to unlock':(node.cost-save.essence)+' more essence needed')};
 if(goal)return{form:goal,text:goal.name+' · All required sigils owned · '+(save.essence>=goal.cost?'Ready to awaken':(goal.cost-save.essence)+' more essence needed')};
 return{text:'Every sigil is yours. Try a different form next run.'};
}
function runReport(r){return 'VOIDFALL RUN RECORD\n'+JSON.stringify(r,null,2)+'\n\nNotes:\n';}
function recapLine(parent,label,value){const row=document.createElement('p'),title=document.createElement('strong');title.textContent=label+' ';row.append(title,document.createTextNode(String(value)));parent.append(row);}
function openRunRecap(){
 const r=save.lastRunRecap;if(!r)return;recapReturnFocus=document.activeElement;clearInput();const body=T('runRecapBody');body.replaceChildren();
 recapLine(body,'Last hit:',r.death.source);recapLine(body,'Run:',r.mode+' · Floor '+r.floor+' · Level '+r.level+' · '+Math.floor(r.seconds/60)+'m '+r.seconds%60+'s');
 recapLine(body,'Recovered:',r.essence+' essence · '+r.kills+' kills');recapLine(body,'Encounter:',r.guardian+' · '+r.room);
 recapLine(body,'Guardians defeated:',r.guardians.length?r.guardians.map(g=>g.name+' (floor '+g.floor+')').join(', '):'None recorded this run');
 recapLine(body,'Forms:',r.forms.join(' · ')||'Starting forms');recapLine(body,'Blessings:',r.blessings.map(c=>c.name+' ×'+c.rank).join(' · ')||'None');
 T('recapGoal').textContent=recapNextGoal().text;T('recapReport').value=runReport(r);T('recapReport').hidden=true;T('recapCopyStatus').textContent='';show('runRecap');T('recapClose').focus();
}
function closeRunRecap(){hide('runRecap');recapReturnFocus?.focus?.();}
const recapPanel=document.createElement('div');recapPanel.id='runRecap';recapPanel.className='ov';recapPanel.setAttribute('role','dialog');recapPanel.setAttribute('aria-modal','true');recapPanel.setAttribute('aria-labelledby','runRecapTitle');recapPanel.innerHTML='<section class="recap-shell"><div class="eyebrow">YOUR LAST DESCENT</div><h2 id="runRecapTitle">A little farther next time.</h2><div id="runRecapBody"></div><div class="recap-goal" id="recapGoal"></div><div class="btnrow"><button class="btn primary" id="recapTree">VIEW NEXT GOAL</button><button class="btn" id="recapCopy">COPY RUN RECORD</button><button class="btn" id="recapClose">BACK</button></div><p id="recapCopyStatus" role="status"></p><textarea id="recapReport" aria-label="Run record — select and copy" readonly hidden></textarea></section>';document.body.append(recapPanel);
on(T('recapClose'),'click',closeRunRecap);
on(T('recapTree'),'click',()=>{const goal=recapNextGoal();closeRunRecap();if(goal.node){T('skills').classList.add('recap-tree');openTree('recap');selectNode(goal.node);}else if(goal.form)openForms('runRecap');});
on(T('recapCopy'),'click',async()=>{try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(T('recapReport').value);T('recapCopyStatus').textContent='Run record copied.';}catch(_){T('recapReport').hidden=false;T('recapReport').focus();T('recapReport').select();T('recapCopyStatus').textContent='Select and copy the record below.';}});
function installRecapButtons(){for(const [id,parent] of [['btnLastRecap',T('menu').querySelector('.audiorow')],['btnDeadRecap',T('dead').querySelector('.btnrow')],['btnGuardianRecap',T('guardianModeResult')?.querySelector('.guardian-result-actions')]]){if(!parent||T(id))continue;const b=document.createElement('button');b.id=id;b.className='btn';b.textContent='RUN RECAP';on(b,'click',openRunRecap);parent.append(b);}}
installRecapButtons();
const recapInstallGuardians=installGuardianModes;
installGuardianModes=function(){recapInstallGuardians();installRecapButtons();};
const recapMenu=refreshMenuStats;
refreshMenuStats=function(){recapMenu();T('btnLastRecap').hidden=!save.lastRunRecap;};
const recapBlocking=anyBlockingOverlay;
anyBlockingOverlay=function(){return T('runRecap').classList.contains('open')||recapBlocking();};
const recapEsc=onEscKey;
onEscKey=function(){if(T('runRecap').classList.contains('open'))return closeRunRecap();return recapEsc();};
const recapCloseTree=closeTree;
closeTree=function(){const from=G.treeFrom;recapCloseTree();T('skills').classList.remove('recap-tree');if(from==='recap')openRunRecap();};

on(recapPanel,'keydown',e=>{if(e.key!=='Tab')return;const items=[...recapPanel.querySelectorAll('button,textarea')].filter(x=>!x.hidden&&!x.disabled);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
