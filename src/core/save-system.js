document.documentElement.dataset.saveSystem='loading';
const SAVE_SCHEMA=3;
const PROGRESSION_RESET_MARKER='the_seventh_ember_progression_reset_20260914';
const CHANGELOG_SEEN_KEY='the_seventh_ember_changelog_seen';
const LEGACY_SAVE_KEY=['void','fall_save_v1'].join('');
const LEGACY_RESET_MARKER=['void','fall_progression_reset_20260914'].join('');
const LEGACY_CHANGELOG_KEY=['void','fall_changelog_seen'].join('');
const SAVE_SLOT_KEYS=[SAVE_KEY+'_slot_a',SAVE_KEY+'_slot_b'];
const SAVE_EMERGENCY_KEY=SAVE_KEY+'_emergency';
const SAVE_MANIFEST_KEY=SAVE_KEY+'_manifest';
const SAVE_PRIMARY_META_KEY=SAVE_KEY+'_primary_meta';
const SAVE_WRITER=(globalThis.crypto?.randomUUID?.()||Math.random().toString(36).slice(2))+':'+Date.now();
let saveRevision=0,saveLastHash='',saveLastTime=0,saveRemoteRevision=0,saveRecovered=false;
let progressionMigration={status:'unknown',applied:false,removed:0};

function migrateLegacyStorage(){
 const pairs=[[LEGACY_SAVE_KEY,SAVE_KEY],[LEGACY_SAVE_KEY+'_slot_a',SAVE_SLOT_KEYS[0]],[LEGACY_SAVE_KEY+'_slot_b',SAVE_SLOT_KEYS[1]],[LEGACY_SAVE_KEY+'_emergency',SAVE_EMERGENCY_KEY],[LEGACY_SAVE_KEY+'_manifest',SAVE_MANIFEST_KEY],[LEGACY_SAVE_KEY+'_primary_meta',SAVE_PRIMARY_META_KEY],[LEGACY_RESET_MARKER,PROGRESSION_RESET_MARKER],[LEGACY_CHANGELOG_KEY,CHANGELOG_SEEN_KEY]];
 let moved=0;
 for(const [oldKey,newKey] of pairs){
  try{
   const oldValue=localStorage.getItem(oldKey);if(oldValue===null)continue;
   if(localStorage.getItem(newKey)===null)localStorage.setItem(newKey,oldValue);
   if(localStorage.getItem(newKey)!==null){localStorage.removeItem(oldKey);moved++;}
  }catch(_){ }
 }
 return moved;
}

function applyProgressionMigration(){
 try{
   const moved=migrateLegacyStorage();
   const recorded=localStorage.getItem(PROGRESSION_RESET_MARKER);
   if(recorded){
     try{progressionMigration={...progressionMigration,...JSON.parse(recorded),applied:moved>0,renamed:moved};}
     catch(_){progressionMigration={status:recorded==='reset'?'reset':'fresh',applied:false,removed:0};}
     return progressionMigration;
   }
   const saveKeys=[SAVE_KEY,SAVE_PRIMARY_META_KEY,SAVE_MANIFEST_KEY,SAVE_EMERGENCY_KEY,...SAVE_SLOT_KEYS],present=saveKeys.filter(key=>localStorage.getItem(key)!==null),valid=readSaveCandidates(),doomed=present.length&&!valid.length?present:[];
   for(const key of doomed)localStorage.removeItem(key);
   progressionMigration={status:doomed.length?'reset':moved?'renamed':present.length?'preserved':'fresh',applied:moved>0||doomed.length>0,removed:doomed.length,renamed:moved,at:Date.now(),epoch:SAVE_PROGRESSION_EPOCH};
   localStorage.setItem(PROGRESSION_RESET_MARKER,JSON.stringify(progressionMigration));
 }catch(_){progressionMigration={status:'unavailable',applied:false,removed:0};}
 return progressionMigration;
}

function saveHash(text){
 let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return('00000000'+(h>>>0).toString(16)).slice(-8);
}
function saveEnvelope(payload,seq,reason='auto'){
 const savedAt=Date.now(),body=JSON.stringify(payload);return{schema:SAVE_SCHEMA,seq,savedAt,reason:String(reason).slice(0,32),checksum:saveHash(body),payload};
}
function parseSaveEnvelope(text,source,priority=0){
 if(!text)return null;let raw;try{raw=JSON.parse(text);}catch(_){return null;}
 let seq=0,savedAt=0,payload=raw,verified=false;
 if(raw?.schema===SAVE_SCHEMA&&raw.payload&&Number.isFinite(raw.seq)){
   const body=JSON.stringify(raw.payload);if(raw.checksum!==saveHash(body))return null;
   payload=raw.payload;seq=Math.max(0,Math.floor(raw.seq));savedAt=Math.max(0,Number(raw.savedAt)||0);verified=true;
 }else if(source==='primary'){
   try{const meta=JSON.parse(localStorage.getItem(SAVE_PRIMARY_META_KEY)||'null');if(meta&&meta.checksum===saveHash(JSON.stringify(payload))){seq=Math.max(0,Math.floor(meta.seq)||0);savedAt=Math.max(0,Number(meta.savedAt)||0);verified=true;}}catch(_){ }
 }
 if(payload?.progressionEpoch!==SAVE_PROGRESSION_EPOCH)return null;
 let clean,stripped=false;
 try{clean=validateSave(payload);}
 catch(_){
   try{clean=validateSave({...payload,resume:null,guardianSession:null});stripped=true;}
   catch(__){return null;}
 }
 return{source,priority,seq,savedAt,payload:clean,verified,stripped,hasRun:!!clean.resume,hasGuardian:!!clean.guardianSession};
}
function readSaveCandidates(){
 const out=[];for(let i=0;i<SAVE_SLOT_KEYS.length;i++){const c=parseSaveEnvelope(localStorage.getItem(SAVE_SLOT_KEYS[i]),'slot-'+i,40-i);if(c)out.push(c);}
 const primary=parseSaveEnvelope(localStorage.getItem(SAVE_KEY),'primary',60);if(primary)out.push(primary);
 const emergency=parseSaveEnvelope(localStorage.getItem(SAVE_EMERGENCY_KEY),'emergency',10);if(emergency)out.push(emergency);
 return out.sort((a,b)=>b.seq-a.seq||(b.hasRun+b.hasGuardian)-(a.hasRun+a.hasGuardian)||b.savedAt-a.savedAt||b.priority-a.priority);
}
function currentManifest(){try{const m=JSON.parse(localStorage.getItem(SAVE_MANIFEST_KEY)||'null');return m&&m.schema===SAVE_SCHEMA?m:null;}catch(_){return null;}}
function verifiedSet(key,value){localStorage.setItem(key,value);return localStorage.getItem(key)===value;}
function permanentSaveCopy(payload){return{...payload,resume:null,guardianSession:null};}

loadSave=function(){
 applyProgressionMigration();
 let candidates=[];try{candidates=readSaveCandidates();}catch(_){ }
 if(!candidates.length){let hadSave=false;try{hadSave=!!localStorage.getItem(SAVE_KEY);}catch(_){ }save=DEF_SAVE();storageMessage=hadSave?'The main save was damaged and no recovery copy was available. Import a backup in Settings.':'';return;}
 const chosen=candidates[0];save=chosen.payload;saveRevision=chosen.seq;saveLastTime=chosen.savedAt;saveLastHash=saveHash(JSON.stringify(save));
 saveRecovered=chosen.source!=='primary'||chosen.stripped;
 if(chosen.stripped)storageMessage='Recovered all permanent progress. A damaged run checkpoint was removed.';
 else if(chosen.source!=='primary'&&localStorage.getItem(SAVE_KEY))storageMessage='Recovered your latest verified save automatically.';
 else storageMessage='';
 try{const m=currentManifest();saveRemoteRevision=Math.max(saveRevision,Number(m?.seq)||0);}catch(_){saveRemoteRevision=saveRevision;}
 if(saveRevision===0||saveRecovered)setTimeout(()=>saveNow('recovery'),0);
 try{navigator.storage?.persist?.().catch(()=>{});}catch(_){ }
};

saveNow=function(reason='auto'){
 const previousResume=save.resume,previousGuardian=save.guardianSession;
 try{snapshotRun();}catch(_){save.resume=previousResume;save.guardianSession=previousGuardian;}
 let payload;try{payload=validateSave(JSON.parse(JSON.stringify(save)));}
 catch(_){
   try{payload=validateSave({...JSON.parse(JSON.stringify(save)),resume:null,guardianSession:null});}
   catch(__){storageMessage='This save could not be verified. Your last good copy is still safe.';syncSaveStatus();return false;}
 }
 const body=JSON.stringify(payload),hash=saveHash(body),manifest=currentManifest();
 const newest=Math.max(saveRevision,saveRemoteRevision,Number(manifest?.seq)||0);
 if(manifest&&manifest.writer!==SAVE_WRITER&&Number(manifest.seq)>saveRevision){
   saveRemoteRevision=Number(manifest.seq);storageMessage='A newer save is open in another tab. This tab was blocked from overwriting it.';if(G.state==='playing')pauseGame(true);syncSaveStatus();return false;
 }
 if(hash===saveLastHash&&saveRevision>0){saveDirty=false;syncSaveStatus();return true;}
 const seq=newest+1,envelope=saveEnvelope(payload,seq,reason),packed=JSON.stringify(envelope),emergency=saveEnvelope(permanentSaveCopy(payload),seq,'emergency'),emergencyPacked=JSON.stringify(emergency);
 let fullGood=false,primaryGood=false,emergencyGood=false,active=manifest?.active===0?0:1,next=active===0?1:0;
 try{emergencyGood=verifiedSet(SAVE_EMERGENCY_KEY,emergencyPacked)&&!!parseSaveEnvelope(localStorage.getItem(SAVE_EMERGENCY_KEY),'emergency',10);}catch(_){ }
 try{fullGood=verifiedSet(SAVE_SLOT_KEYS[next],packed)&&!!parseSaveEnvelope(localStorage.getItem(SAVE_SLOT_KEYS[next]),'slot-'+next,40-next);}catch(_){ }
 try{
   const primaryText=JSON.stringify(payload);primaryGood=verifiedSet(SAVE_KEY,primaryText);
   if(primaryGood)verifiedSet(SAVE_PRIMARY_META_KEY,JSON.stringify({schema:SAVE_SCHEMA,seq,savedAt:envelope.savedAt,checksum:saveHash(primaryText)}));
 }catch(_){ }
 if(fullGood||primaryGood){
   try{verifiedSet(SAVE_MANIFEST_KEY,JSON.stringify({schema:SAVE_SCHEMA,active:fullGood?next:active,seq,savedAt:envelope.savedAt,writer:SAVE_WRITER}));}catch(_){ }
   save=payload;saveRevision=seq;saveRemoteRevision=seq;saveLastHash=hash;saveLastTime=envelope.savedAt;saveDirty=false;storageMessage='';saveRecovered=false;syncSaveStatus();return true;
 }
 storageMessage=emergencyGood?'The full run checkpoint could not be saved, but permanent progress is protected.':'Automatic saving is unavailable. Export a save to keep your progress.';syncSaveStatus();return false;
};

const verifiedSyncSaveStatus=syncSaveStatus;
syncSaveStatus=function(){
 verifiedSyncSaveStatus();if(storageMessage)return;
 const time=saveLastTime?new Date(saveLastTime).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}):'';
 if(T('saveStatus'))T('saveStatus').textContent='PROGRESS VERIFIED'+(time?' · '+time:'');
 if(T('settingsSave')){T('settingsSave').textContent='Automatic saving uses two rotating checkpoints plus a compact emergency copy. Boss Rush saves at every bell and your campaign run is kept separately.';T('settingsSave').classList.remove('warning');}
};

const verifiedResetEverything=resetEverything;
resetEverything=function(){
 for(const key of [SAVE_KEY,SAVE_PRIMARY_META_KEY,SAVE_MANIFEST_KEY,SAVE_EMERGENCY_KEY,...SAVE_SLOT_KEYS])try{localStorage.removeItem(key);}catch(_){ }
 saveRevision=saveRemoteRevision=0;saveLastHash='';verifiedResetEverything();
};

addEventListener('storage',event=>{
 if(event.key!==SAVE_MANIFEST_KEY||!event.newValue)return;try{const m=JSON.parse(event.newValue);if(m?.schema===SAVE_SCHEMA&&m.writer!==SAVE_WRITER&&Number(m.seq)>saveRevision){saveRemoteRevision=Number(m.seq);if(G.state==='playing')pauseGame(true);storageMessage='A newer save was written in another tab. This tab is paused and cannot overwrite it.';syncSaveStatus();}}catch(_){ }
});

document.documentElement.dataset.saveSystem='ready-v3';
