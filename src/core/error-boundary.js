(function(){
  var lastProblem='',lastProblemAt=0,hideTimer=0;
  function clearProblem(){
    var box=document.getElementById('errbox');
    if(box)box.remove();
    if(hideTimer){clearTimeout(hideTimer);hideTimer=0;}
  }
  function showProblem(message,line){
    message=String(message||'').trim();
    if(!message)return;
    var now=Date.now(),fingerprint=message+'@'+(line||0);
    if(fingerprint===lastProblem&&now-lastProblemAt<30000)return;
    lastProblem=fingerprint;lastProblemAt=now;
    var box=document.getElementById('errbox');
    if(!box){
      box=document.createElement('div');box.id='errbox';box.setAttribute('role','alert');
      box.style.cssText='position:fixed;left:12px;bottom:12px;z-index:999;max-width:76vw;background:rgba(40,4,8,.96);border:1px solid #ff5d6d;color:#ffd6da;font:12px/1.5 monospace;padding:10px 42px 10px 14px;border-radius:6px;white-space:pre-wrap;box-shadow:0 10px 34px #000a';
      var close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Dismiss error');close.style.cssText='position:absolute;right:8px;top:5px;border:0;background:transparent;color:#ffd6da;font:20px/1 sans-serif;cursor:pointer';close.addEventListener('click',clearProblem);box.appendChild(close);
      (document.body||document.documentElement).appendChild(box);
    }
    var text=document.createElement('span');text.textContent='Error: '+message+(line?' @ line '+line:'');
    var old=box.querySelector('span');if(old)old.replaceWith(text);else box.prepend(text);
    if(hideTimer)clearTimeout(hideTimer);hideTimer=setTimeout(clearProblem,10000);
  }
  window.addEventListener('error',function(event){
    var message=event.message||(event.error&&event.error.message);
    if(message)showProblem(message,event.lineno);
  },true);
  window.addEventListener('unhandledrejection',function(event){
    var reason=event.reason,message=reason&&reason.message||typeof reason==='string'&&reason;
    if(message)showProblem(message,0);
  });
  window.TheSeventhEmberErrorNotice={show:showProblem,clear:clearProblem};
})();
