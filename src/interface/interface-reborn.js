'use strict';
const TSE_UI={version:3,lastRegion:'',resizeTimer:0};

function tseUiRange(id,label,detail,value){
 const row=document.createElement('label');row.className='settings-row volume-row';row.innerHTML=`<span>${label}<small>${detail}</small></span><span class="volume-control"><input id="${id}" type="range" min="0" max="100" step="1" value="${Math.round(value*100)}" aria-label="${label}"><b id="${id}Value">${Math.round(value*100)}%</b></span>`;return row;
}
function tseUiBuildAudioSettings(){
 if(T('setMusicVolume'))return;const musicRow=T('setMusic')?.closest('.settings-row'),sfxRow=T('setSfx')?.closest('.settings-row');if(!musicRow||!sfxRow)return;
 const music=tseUiRange('setMusicVolume','Music volume','Exploration and combat music.',save.musicVolume??.82),effects=tseUiRange('setSfxVolume','Effects volume','Combat, pickups, menus, and dialogue.',save.sfxVolume??.86);musicRow.after(music);sfxRow.after(effects);
 const bind=(id,key)=>{const input=T(id),value=T(id+'Value');on(input,'input',()=>{save[key]=Number(input.value)/100;value.textContent=input.value+'%';initAudio();applyAudioSettings();markSave();});on(input,'change',saveNow);};bind('setMusicVolume','musicVolume');bind('setSfxVolume','sfxVolume');
}
function tseUiSyncRanges(){for(const [id,key,fallback] of [['setMusicVolume','musicVolume',.82],['setSfxVolume','sfxVolume',.86]]){const el=T(id),value=T(id+'Value');if(!el)continue;const n=Math.round(clamp(save[key]??fallback,0,1)*100);el.value=n;if(value)value.textContent=n+'%';}}
function tseUiRegion(){return !G.run?'title':G.world?.lateKey||(G.floor<=5?'hollow':'garden');}
function tseUiRefresh(){
 const region=tseUiRegion();document.body.dataset.region=region;document.body.classList.toggle('guardian-ui',!!G.bossActive);TSE_UI.lastRegion=region;
}
function tseUiViewport(){const w=innerWidth,h=innerHeight;document.documentElement.style.setProperty('--ui-vh',h+'px');document.body.dataset.viewport=w<520?'phone':w<820?'tablet':w<1180?'compact':'wide';document.body.dataset.orientation=w>h?'landscape':'portrait';if(G.skillsOpen&&typeof fitTree==='function')fitTree();}
function tseUiDecorate(){
 document.body.classList.add('ui-reborn');if(!document.querySelector('.menu-orbit')){const orbit=document.createElement('div');orbit.className='menu-orbit';orbit.setAttribute('aria-hidden','true');orbit.innerHTML='<i></i><i></i><i></i><b></b>';T('menu')?.append(orbit);}for(const overlay of document.querySelectorAll('.ov'))overlay.classList.add('tse-surface');
}

tseUiBuildAudioSettings();tseUiDecorate();tseUiViewport();tseUiRefresh();
const tseUiSyncSettingsBase=syncSettings;
syncSettings=function(){const result=tseUiSyncSettingsBase();tseUiSyncRanges();tseUiRefresh();return result;};
const tseUiUpdateHudBase=updateHUD;
updateHUD=function(dt){const result=tseUiUpdateHudBase(dt);if(tseUiRegion()!==TSE_UI.lastRegion||document.body.classList.contains('guardian-ui')!==!!G.bossActive)tseUiRefresh();return result;};
on(window,'resize',()=>{clearTimeout(TSE_UI.resizeTimer);TSE_UI.resizeTimer=setTimeout(tseUiViewport,60);});on(window,'orientationchange',tseUiViewport);
