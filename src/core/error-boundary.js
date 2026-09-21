(()=>{
  let lastFingerprint='';
  let lastNoticeAt=0;
  let dismissTimer=0;

  function dismissNotice(){
    document.getElementById('errbox')?.remove();
    clearTimeout(dismissTimer);
    dismissTimer=0;
  }

  function reloadGame(){
    try{
      if(typeof saveNow==='function')saveNow();
    }catch(_){ }
    location.reload();
  }

  function createNotice(){
    const box=document.createElement('div');
    box.id='errbox';
    box.setAttribute('role','alert');
    box.innerHTML='<span class="error-sigil" aria-hidden="true">◆</span><div class="error-copy"><strong>THE FLAME FALTERED</strong><p>Please reload to continue. Your latest save is safe.</p></div><div class="error-actions"><button type="button" data-action="reload">RELOAD</button><button type="button" data-action="dismiss">DISMISS</button></div>';
    box.querySelector('[data-action="reload"]').addEventListener('click',reloadGame);
    box.querySelector('[data-action="dismiss"]').addEventListener('click',dismissNotice);
    (document.body||document.documentElement).appendChild(box);
    return box;
  }

  function showNotice(message,source){
    const detail=String(message||'').trim();
    if(!detail)return;
    const now=Date.now();
    const fingerprint=detail+'@'+String(source||'');
    if(fingerprint===lastFingerprint&&now-lastNoticeAt<30000)return;
    lastFingerprint=fingerprint;
    lastNoticeAt=now;
    if(!document.getElementById('errbox'))createNotice();
    clearTimeout(dismissTimer);
    dismissTimer=setTimeout(dismissNotice,12000);
  }

  addEventListener('error',event=>{
    const message=event.message||event.error?.message;
    if(message)showNotice(message,event.filename);
  },true);

  addEventListener('unhandledrejection',event=>{
    const reason=event.reason;
    const message=reason?.message||(typeof reason==='string'?reason:'');
    if(message)showNotice(message,'promise');
  });
})();
