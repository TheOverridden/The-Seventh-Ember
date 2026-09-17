'use strict';
const VF_UI={version:3,lastRegion:'',resizeTimer:0};

function vfUiRange(id,label,detail,value){
 const row=document.createElement('label');row.className='settings-row volume-row';row.innerHTML=`<span>${label}<small>${detail}</small></span><span class="volume-control"><input id="${id}" type="range" min="0" max="100" step="1" value="${Math.round(value*100)}" aria-label="${label}"><b id="${id}Value">${Math.round(value*100)}%</b></span>`;return row;
}
function vfUiBuildAudioSettings(){
 if(T('setMusicVolume'))return;const musicRow=T('setMusic')?.closest('.settings-row'),sfxRow=T('setSfx')?.closest('.settings-row');if(!musicRow||!sfxRow)return;
 const music=vfUiRange('setMusicVolume','Music volume','Falling Light · full score mix.',save.musicVolume??.82),effects=vfUiRange('setSfxVolume','Effects volume','Combat, pickups, menus, and dialogue.',save.sfxVolume??.86);musicRow.after(music);sfxRow.after(effects);
 const card=document.createElement('div');card.id='scoreCard';card.innerHTML='<span>ORIGINAL SCORE</span><strong>FALLING LIGHT</strong><small id="scoreMovement">OVERTURE</small>';music.after(card);
 const bind=(id,key)=>{const input=T(id),value=T(id+'Value');on(input,'input',()=>{save[key]=Number(input.value)/100;value.textContent=input.value+'%';initAudio();applyAudioSettings();markSave();});on(input,'change',saveNow);};bind('setMusicVolume','musicVolume');bind('setSfxVolume','sfxVolume');
}
function vfUiSyncRanges(){for(const [id,key,fallback] of [['setMusicVolume','musicVolume',.82],['setSfxVolume','sfxVolume',.86]]){const el=T(id),value=T(id+'Value');if(!el)continue;const n=Math.round(clamp(save[key]??fallback,0,1)*100);el.value=n;if(value)value.textContent=n+'%';}}
function vfUiRegion(){return globalThis.VoidFallScore?.region?.()||(!G.run?'title':G.world?.lateKey||(G.floor<=5?'hollow':'garden'));}
function vfUiRefresh(){
 const region=vfUiRegion(),profile=globalThis.VoidFallScore?.profiles?.[region];document.body.dataset.region=region;document.body.classList.toggle('guardian-ui',!!G.bossActive);if(T('scoreMovement'))T('scoreMovement').textContent=(profile?.movement||'Overture').toUpperCase();VF_UI.lastRegion=region;
}
function vfUiViewport(){const w=innerWidth,h=innerHeight;document.documentElement.style.setProperty('--ui-vh',h+'px');document.body.dataset.viewport=w<520?'phone':w<820?'tablet':w<1180?'compact':'wide';document.body.dataset.orientation=w>h?'landscape':'portrait';if(G.skillsOpen&&typeof fitTree==='function')fitTree();}
function vfUiDecorate(){
 document.body.classList.add('ui-reborn');if(!document.querySelector('.menu-orbit')){const orbit=document.createElement('div');orbit.className='menu-orbit';orbit.setAttribute('aria-hidden','true');orbit.innerHTML='<i></i><i></i><i></i><b></b>';T('menu')?.append(orbit);}for(const overlay of document.querySelectorAll('.ov'))overlay.classList.add('vf-surface');
}

vfUiBuildAudioSettings();vfUiDecorate();vfUiViewport();vfUiRefresh();
const vfUiSyncSettingsBase=syncSettings;
syncSettings=function(){const result=vfUiSyncSettingsBase();vfUiSyncRanges();vfUiRefresh();return result;};
const vfUiUpdateHudBase=updateHUD;
updateHUD=function(dt){const result=vfUiUpdateHudBase(dt);if(vfUiRegion()!==VF_UI.lastRegion||document.body.classList.contains('guardian-ui')!==!!G.bossActive)vfUiRefresh();return result;};
on(window,'resize',()=>{clearTimeout(VF_UI.resizeTimer);VF_UI.resizeTimer=setTimeout(vfUiViewport,60);});on(window,'orientationchange',vfUiViewport);
globalThis.VoidFallUI={version:3,refresh:vfUiRefresh,viewport:vfUiViewport};
document.documentElement.dataset.interface='reborn-v3';
