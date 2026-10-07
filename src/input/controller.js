const CONTROLLER_DEFAULTS={bolt:7,flare:6,dash:5,rekindle:4,use:0,portal:2};
const CONTROLLER_ACTIONS={bolt:'Ember Bolt',flare:'Flare',dash:'Dash',rekindle:'Rekindle',use:'Interact',portal:'Return to portal'};
const controller={index:null,pad:null,previous:[],blocked:new Set(),binding:null,scope:null,direction:'',repeatAt:0,status:'',uiDirty:true};
function controllerPreferences(raw=save.controller){
 const bindings={...CONTROLLER_DEFAULTS},used=new Set();
 for(const action of Object.keys(bindings)){const value=raw?.bindings?.[action];if(Number.isInteger(value)&&value>=0&&value<=16&&![8,9,10,11,12,13,14,15,16].includes(value)&&!used.has(value)){bindings[action]=value;used.add(value);}else bindings[action]=null;}
 for(const action of Object.keys(bindings))if(bindings[action]===null){const value=[CONTROLLER_DEFAULTS[action],0,1,2,3,4,5,6,7].find(n=>!used.has(n));bindings[action]=value;used.add(value);}
 return{bindings,deadzone:Number.isFinite(raw?.deadzone)?clamp(raw.deadzone,.08,.35):.18,rumble:raw?.rumble!==false};
}
function controllerButtonName(index){
 const ps=/playstation|dualshock|dualsense|054c/i.test(controller.pad?.id||'');
 const nintendo=/nintendo|switch|057e/i.test(controller.pad?.id||'');
 return(ps?['Cross','Circle','Square','Triangle','L1','R1','L2','R2','Share','Options','L3','R3']:nintendo?['B','A','Y','X','L','R','ZL','ZR','Minus','Plus','LS','RS']:['A','B','X','Y','LB','RB','LT','RT','View','Menu','LS','RS'])[index]||['Up','Down','Left','Right','Home'][index-12]||'Button '+(index+1);
}
function controllerHeld(button){return !!button&&(button.pressed||button.value>.55);}
function controllerStick(x,y,deadzone){
 const length=Math.hypot(x||0,y||0);if(length<=deadzone)return{x:0,y:0};const strength=Math.min(1,(length-deadzone)/(1-deadzone));return{x:x/length*strength,y:y/length*strength};
}
function controllerRelease(){
 controllerInput.moveX=controllerInput.moveY=0;controllerInput.fire=false;
 const pad=controller.pad;if(pad)pad.buttons.forEach((b,i)=>{if(controllerHeld(b))controller.blocked.add(i);});
}
function controllerSetActive(active){controllerInput.active=active;document.body.classList.toggle('controller-active',active);if(!active){controllerRelease();if(T('controllerAudio'))T('controllerAudio').hidden=true;}}
function controllerVisible(el){return !el.hidden&&!el.closest('[hidden],[inert]')&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';}
function controllerScope(){
 if(G.state==='dialogue'&&controllerVisible(T('conversation')))return T('conversation');
 const overlays=[...document.querySelectorAll('.ov.open')].filter(controllerVisible);
 overlays.sort((a,b)=>(Number(getComputedStyle(a).zIndex)||0)-(Number(getComputedStyle(b).zIndex)||0));
 if(overlays.length)return overlays[overlays.length-1];
 return null;
}
function controllerTargets(scope){return [...scope.querySelectorAll('button,input:not([type=file]),select,a[href],[role=button][tabindex]')].filter(el=>!el.disabled&&el.tabIndex>=0&&controllerVisible(el));}
function controllerFocus(scope){
 const targets=controllerTargets(scope);let focus=document.activeElement;
 if(!targets.includes(focus)){focus=targets.find(el=>el.id==='dialogueNext')||targets.find(el=>el.classList.contains('primary'))||targets[0];focus?.focus({preventScroll:true});}
 return{targets,focus};
}
function controllerNavigate(scope,direction){
 const {targets,focus}=controllerFocus(scope);if(!focus)return;
 if((direction==='left'||direction==='right')&&(focus.matches('input[type=range],select'))){
  const step=direction==='right'?1:-1;
  if(focus.tagName==='SELECT')focus.selectedIndex=clamp(focus.selectedIndex+step,0,focus.options.length-1);
  else focus.value=clamp(Number(focus.value)+step*Number(focus.step||1),Number(focus.min||0),Number(focus.max||100));
  focus.dispatchEvent(new Event('input',{bubbles:true}));focus.dispatchEvent(new Event('change',{bubbles:true}));return;
 }
 const box=focus.getBoundingClientRect(),x=box.x+box.width/2,y=box.y+box.height/2,horizontal=direction==='left'||direction==='right',sign=direction==='left'||direction==='up'?-1:1;
 let best=null,score=Infinity;
 for(const el of targets){if(el===focus)continue;const r=el.getBoundingClientRect(),dx=r.x+r.width/2-x,dy=r.y+r.height/2-y,along=(horizontal?dx:dy)*sign,across=Math.abs(horizontal?dy:dx);if(along<3)continue;const value=along+across*2.5+across*across/Math.max(20,along);if(value<score){score=value;best=el;}}
 if(best){best.focus({preventScroll:true});best.scrollIntoView({block:'nearest',inline:'nearest'});sfx('ui');}
 else if(scope.scrollHeight>scope.clientHeight)scope.scrollBy({top:direction==='down'?120:direction==='up'?-120:0,behavior:'auto'});
}
function controllerBack(scope){
 if(G.state==='dialogue'){finishDialogue();return;}
 const back=[...scope.querySelectorAll('button')].filter(controllerVisible).find(el=>/^(BACK|CLOSE|DONE|CANCEL|RETURN)$/i.test(el.textContent.trim()));
 if(back){back.click();return;}
 onEscKey();
}
function controllerUpdateSettings(){
 save.controller=controllerPreferences();
 const status=T('controllerStatus');if(!status)return;
 status.textContent=controller.binding?'Press a button for '+CONTROLLER_ACTIONS[controller.binding]+'. '+controllerButtonName(9)+' cancels.':controller.pad?controller.pad.id.replace(/\s*\(.*$/,''):'Connect a controller, then press a button.';
 for(const action of Object.keys(CONTROLLER_ACTIONS)){const button=T('bind-'+action);button.textContent=controller.binding===action?'PRESS A BUTTON':controllerButtonName(save.controller.bindings[action]);button.setAttribute('aria-label',CONTROLLER_ACTIONS[action]+': '+button.textContent);button.classList.toggle('listening',controller.binding===action);}
 T('controllerDeadzone').value=save.controller.deadzone;T('controllerDeadzoneValue').textContent=Math.round(save.controller.deadzone*100)+'%';T('controllerRumble').checked=save.controller.rumble;
 T('controllerGuide').textContent='Left stick moves. Right stick aims. Hold the Bolt trigger to fire. D-pad navigates menus; '+controllerButtonName(0)+' confirms and '+controllerButtonName(1)+' goes back. '+controllerButtonName(9)+' pauses.';
 T('controllerHint').textContent=controllerButtonName(save.controller.bindings.bolt)+' Bolt · '+controllerButtonName(save.controller.bindings.flare)+' Flare · '+controllerButtonName(save.controller.bindings.dash)+' Dash · '+controllerButtonName(save.controller.bindings.use)+' Use · '+controllerButtonName(9)+' Pause';
}
function controllerPoll(now){
 let pads=[];try{pads=Array.from(navigator.getGamepads?.()||[]).filter(p=>p?.connected&&p.mapping==='standard');}catch(_){ }
 let pad=pads.find(p=>p.index===controller.index);
 if(!pad&&controller.pad){const wasActive=controllerInput.active;controller.pad=null;controller.index=null;controller.previous=[];controller.blocked.clear();controllerSetActive(false);controllerUpdateSettings();if(wasActive&&G.state==='playing'){pauseGame(true);toast('CONTROLLER DISCONNECTED','Reconnect, or use the keyboard and mouse.');}return;}
 if(!pad)pad=pads.find(p=>p.buttons.some(controllerHeld)||p.axes.some(a=>Math.abs(a)>.4))||pads[0];
 if(!pad)return;
 if(controller.index!==pad.index){controller.index=pad.index;controller.previous=[];controller.uiDirty=true;}
 controller.pad=pad;const held=pad.buttons.map(controllerHeld),pressed=held.map((v,i)=>v&&!controller.previous[i]&&!controller.blocked.has(i));
 controller.previous=held;held.forEach((v,i)=>{if(!v)controller.blocked.delete(i);});
 const prefs=controllerPreferences(),move=controllerStick(pad.axes[0],pad.axes[1],prefs.deadzone),aim=controllerStick(pad.axes[2],pad.axes[3],prefs.deadzone);
 if(document.hidden||!document.hasFocus()){controllerRelease();return;}
 if(pressed.some(Boolean)||move.x||move.y||aim.x||aim.y){const waking=!controllerInput.active;if(waking){clearInput();controllerSetActive(true);const angle=G.player?.face||0;controllerInput.aimX=Math.cos(angle);controllerInput.aimY=Math.sin(angle);}if(waking||pressed.some(Boolean))initAudio();}
 T('controllerAudio').hidden=!(controllerInput.active&&AC?.state==='suspended'&&(save.music||save.sfx)&&['menu','paused'].includes(G.state));
 if(G.state==='dialogue')T('dialogueKeys').textContent=controllerInput.active?controllerButtonName(0)+' CONTINUE · '+controllerButtonName(1)+' SKIP':'ENTER / SPACE';
 if(controller.uiDirty){controller.uiDirty=false;controllerUpdateSettings();}
 if(controller.binding&&!T('settings').classList.contains('open'))controller.binding=null;
 if(controller.binding){
  controllerRelease();const index=pressed.findIndex(Boolean);
  if(index===9){controller.binding=null;controllerUpdateSettings();return;}
  if(index>=0&&index<=7){const action=controller.binding,old=prefs.bindings[action],duplicate=Object.keys(prefs.bindings).find(id=>id!==action&&prefs.bindings[id]===index);if(duplicate)prefs.bindings[duplicate]=old;prefs.bindings[action]=index;save.controller=prefs;controller.binding=null;saveNow();controllerUpdateSettings();sfx('buy');}return;
 }
 const scope=controllerScope();
 if(scope!==controller.scope){controller.scope=scope;controller.direction='';controller.repeatAt=0;controllerRelease();if(scope&&controllerInput.active)controllerFocus(scope);return;}
 if(scope){
  controllerInput.moveX=controllerInput.moveY=0;controllerInput.fire=false;if(!controllerInput.active)return;
  let direction=held[12]?'up':held[13]?'down':held[14]?'left':held[15]?'right':Math.abs(move.x)>.5||Math.abs(move.y)>.5?(Math.abs(move.x)>Math.abs(move.y)?move.x>0?'right':'left':move.y>0?'down':'up'):'';
  if(direction&&(direction!==controller.direction||now>=controller.repeatAt)){controllerNavigate(scope,direction);controller.repeatAt=now+(direction!==controller.direction?340:135);}controller.direction=direction;
  if(pressed[0]){const {focus}=controllerFocus(scope);if(focus?.matches('input[type=checkbox]'))focus.click();else if(focus?.tagName==='SELECT')controllerNavigate(scope,'right');else focus?.click();controllerRelease();}
  else if(pressed[1]){controllerBack(scope);controllerRelease();}
  else if(pressed[9]&&G.state==='paused'&&scope.id==='pause'){pauseGame(false);controllerRelease();}
  else if(G.skillsOpen&&(pressed[4]||pressed[5])){const target=pressed[5]?(!T('btnUnlock').disabled?T('btnUnlock'):T('btnTreeBack')):document.querySelector('[data-node].selected')||document.querySelector('[data-node]');target?.focus({preventScroll:true});}
  return;
 }
 if(G.state!=='playing'||G.descending||anyBlockingOverlay()){controllerRelease();return;}
 if(!controllerInput.active)return;
 controllerInput.moveX=move.x;controllerInput.moveY=move.y;
 if(aim.x||aim.y){controllerInput.aimX=aim.x;controllerInput.aimY=aim.y;}
 const action=id=>pressed[prefs.bindings[id]],down=id=>held[prefs.bindings[id]]&&!controller.blocked.has(prefs.bindings[id]);
 controllerInput.fire=down('bolt');
 if(action('flare'))queueMelee();if(action('dash'))queueDash();if(action('rekindle'))reloadQueued=true;if(action('use'))interactQueued=true;if(action('portal')&&!T('portalRecall').hidden)T('portalRecall').click();
 if(pressed[9]){pauseGame(true);controllerRelease();}
}
const controllerClearInput=clearInput;
clearInput=function(){controllerClearInput();controllerRelease();};
const controllerValidateSave=validateSave;
validateSave=function(raw){const clean=controllerValidateSave(raw);clean.controller=controllerPreferences(raw?.controller);return clean;};
const controllerSyncSettings=syncSettings;
syncSettings=function(){const out=controllerSyncSettings();controllerUpdateSettings();return out;};
const controllerLoop=loop;
loop=function(now){controllerPoll(now);return controllerLoop(now);};
const controllerSetState=setState;
setState=function(state){const result=controllerSetState(state);document.body.classList.toggle('controller-playing',state==='playing');return result;};
const controllerUpdateHUD=updateHUD;
updateHUD=function(dt){
 const result=controllerUpdateHUD(dt),active=controllerInput.active,bindings=controllerPreferences().bindings,key=T('prompt').querySelector('kbd');
 if(active&&key.style.display!=='none')key.textContent=controllerButtonName(bindings[key.textContent==='K'||key.textContent==='FLARE'?'flare':'use']);
 for(const [selector,action,fallback]of [['#btnReload kbd','rekindle','R'],['#btnMelee kbd','flare','K'],['#portalRecall .portal-key','portal','Q'],['#btnPause kbd',null,'Esc']]){const el=document.querySelector(selector),label=active?controllerButtonName(action?bindings[action]:9):fallback;if(el&&el.textContent!==label)el.textContent=label;}
 return result;
};
document.addEventListener('keydown',()=>{if(!controller.binding)controllerSetActive(false);},true);
document.addEventListener('pointerdown',()=>controllerSetActive(false),true);
document.addEventListener('pointermove',e=>{if(Math.abs(e.movementX)+Math.abs(e.movementY)>3)controllerSetActive(false);},true);
addEventListener('gamepadconnected',()=>{controller.uiDirty=true;});
addEventListener('gamepaddisconnected',()=>{controller.uiDirty=true;});
addEventListener('blur',()=>controllerRelease());
{
 const section=document.createElement('section');section.className='controller-settings';section.innerHTML='<header><span>CONTROLS</span><h3>Controller</h3></header><p id="controllerStatus" role="status">Connect a controller, then press a button.</p><p id="controllerGuide" class="controller-guide">Left stick moves. Right stick aims. Hold the Bolt trigger to fire. D-pad navigates menus; A confirms and B goes back. Menu pauses.</p><div class="controller-bindings">'+Object.entries(CONTROLLER_ACTIONS).map(([id,label])=>'<div><span>'+label+'</span><button type="button" id="bind-'+id+'"></button></div>').join('')+'</div><label class="settings-row"><span>Stick dead zone<small>Increase this if your Ember moves while the stick is at rest.</small></span><input id="controllerDeadzone" type="range" min="0.08" max="0.35" step="0.01"><output id="controllerDeadzoneValue"></output></label><label class="settings-row"><span>Controller vibration</span><input id="controllerRumble" type="checkbox"></label><button class="btn" id="controllerDefaults" type="button">RESET CONTROLLER BUTTONS</button>';
 T('settingsSave').before(section);
 for(const action of Object.keys(CONTROLLER_ACTIONS))T('bind-'+action).addEventListener('click',()=>{if(!controller.pad){toast('CONNECT A CONTROLLER','Press a button on your controller first.');return;}controller.binding=action;controllerRelease();controllerUpdateSettings();});
 T('controllerDeadzone').addEventListener('input',e=>{save.controller=controllerPreferences();save.controller.deadzone=Number(e.target.value);T('controllerDeadzoneValue').textContent=Math.round(save.controller.deadzone*100)+'%';saveNow();});
 T('controllerRumble').addEventListener('change',e=>{save.controller=controllerPreferences();save.controller.rumble=e.target.checked;saveNow();});
 T('controllerDefaults').addEventListener('click',()=>{save.controller=controllerPreferences({bindings:CONTROLLER_DEFAULTS});controller.binding=null;saveNow();controllerUpdateSettings();});
 T('btnSettingsClose').addEventListener('click',()=>{controller.binding=null;controllerRelease();});
 const hint=document.createElement('div');hint.id='controllerHint';hint.setAttribute('aria-hidden','true');document.body.appendChild(hint);
 const audio=document.createElement('button');audio.id='controllerAudio';audio.className='btn';audio.hidden=true;audio.textContent='CLICK OR TAP ONCE TO ENABLE SOUND';audio.addEventListener('click',()=>{initAudio();audio.hidden=true;});document.body.appendChild(audio);
 T('cv').setAttribute('aria-label',T('cv').getAttribute('aria-label')+' With a controller, move with the left stick, aim with the right stick, RT for Bolt, LT for Flare, RB to Dash, LB to Rekindle, A to interact, X to return to a portal, and Menu to pause.');
}
