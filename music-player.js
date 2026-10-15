/* RailDeutsch v0.6 — üdvözlőképernyő és csak a kezdőlapon működő zene */
(() => {
  'use strict';
  const root = document.getElementById('app');
  if (!root || document.getElementById('rd-welcome')) return;
  const audio = new Audio('./rail-music.mp3');
  audio.loop = true;
  audio.preload = 'auto';
  const key = 'raildeutsch-music-v06';
  let settings = {};
  try { settings = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (_) {}
  audio.volume = Number.isFinite(settings.volume) ? Math.min(1, Math.max(0, settings.volume)) : 0.22;
  audio.muted = settings.muted === true;
  let enabled = false;
  let pausedForLesson = false;
  let started = false;
  const persist = () => { try { localStorage.setItem(key, JSON.stringify({volume:audio.volume,muted:audio.muted})); } catch (_) {} };
  const home = () => !!root.querySelector('.cards');
  const css = document.createElement('style');
  css.textContent = `
    #rd-welcome {position:fixed;inset:0;z-index:20000;display:grid;place-items:center;background:linear-gradient(145deg,#092531,#0e5262 65%,#102f4a);color:#fff;font-family:system-ui,sans-serif;padding:26px;box-sizing:border-box;text-align:center}
    #rd-welcome[hidden],#rd-audio-controls[hidden]{display:none!important}
    #rd-welcome .rd-welcome-card{max-width:450px;width:100%;padding:36px 23px;border:1px solid #ffffff38;border-radius:23px;background:#ffffff12;box-shadow:0 16px 40px #0004}
    #rd-welcome .rd-train{font-size:60px}#rd-welcome h1{font-size:clamp(30px,8vw,44px);margin:16px 0 10px}#rd-welcome p{line-height:1.6;color:#d9edef}
    #rd-enter{margin-top:22px;border:0;border-radius:13px;padding:17px 27px;background:#c8f4e7;color:#103b48;font-size:18px;font-weight:800;cursor:pointer;width:100%}
    #rd-welcome small{display:block;margin-top:17px;color:#c7dce0}
    #rd-audio-controls{box-sizing:border-box;position:fixed;z-index:9999;bottom:max(12px,env(safe-area-inset-bottom));right:12px;display:flex;align-items:center;flex-wrap:wrap;gap:8px;max-width:min(520px,calc(100vw - 24px));padding:10px 12px;border:1px solid #b9d6db;border-radius:15px;background:#f4fbfbee;color:#123944;box-shadow:0 4px 19px #0002;font:13px/1.3 system-ui,sans-serif;backdrop-filter:blur(10px)}
    #rd-audio-controls button{border:0;border-radius:9px;padding:9px 11px;background:#0e6671;color:white;cursor:pointer;font:inherit;font-weight:600}
    #rd-audio-controls button:focus-visible,#rd-enter:focus-visible{outline:3px solid #e6a74b;outline-offset:3px}
    #rd-audio-controls .rd-label{font-weight:700}#rd-vol{width:72px;accent-color:#0e6671}#rd-note{flex-basis:100%;color:#496b76}
    body{padding-bottom:92px!important}@media(max-width:460px){#rd-audio-controls{left:10px;right:10px;justify-content:center}#rd-audio-controls .rd-label{display:none}}
  `;
  document.head.appendChild(css);
  const splash = document.createElement('section');
  splash.id = 'rd-welcome';
  splash.setAttribute('role','dialog');
  splash.setAttribute('aria-modal','true');
  splash.setAttribute('aria-labelledby','rd-welcome-title');
  splash.innerHTML = '<div class="rd-welcome-card"><div class="rd-train" aria-hidden="true">🚆</div><h1 id="rd-welcome-title">Willkommen bei RailDeutsch!</h1><p>Tanulj németül a vasút világában!<br>Üdvözlünk a fedélzeten.</p><button id="rd-enter" type="button">▶ Lernen starten</button><small>A gombbal a kezdőképernyő és a háttérzene is elindul.<br>A zenét később bármikor kikapcsolhatod.</small></div>';
  document.body.appendChild(splash);
  const panel = document.createElement('section');
  panel.id = 'rd-audio-controls';
  panel.hidden = true;
  panel.setAttribute('aria-label','Háttérzene vezérlése');
  panel.innerHTML = '<span class="rd-label">🎵 Vierzig Zwanzig</span><button id="rd-play" type="button">⏸ Szünet</button><button id="rd-mute" type="button">🔊 Hang</button><label for="rd-vol">Hangerő</label><input id="rd-vol" type="range" min="0" max="100" aria-label="Hangerő"><small id="rd-note" aria-live="polite"></small>';
  document.body.appendChild(panel);
  const play = panel.querySelector('#rd-play');
  const mute = panel.querySelector('#rd-mute');
  const volume = panel.querySelector('#rd-vol');
  const note = panel.querySelector('#rd-note');
  volume.value = String(Math.round(audio.volume * 100));
  function sync(){play.textContent=audio.paused?'▶ Indítás':'⏸ Szünet'; mute.textContent=(audio.muted||audio.volume===0)?'🔇 Némítva':'🔊 Hang';}
  function update(){
    if (!started) return;
    const onHome=home();
    panel.hidden=!onHome;
    if (!onHome && !audio.paused) {pausedForLesson=true;audio.pause();}
    else if(onHome && pausedForLesson && enabled){
      pausedForLesson=false;
      audio.play().catch(()=>{note.textContent='A zene folytatásához nyomd meg az Indítás gombot.';sync();});
    }
    sync();
  }
  const observer = new MutationObserver(update);
  observer.observe(root,{childList:true,subtree:false});
  splash.querySelector('#rd-enter').addEventListener('click',()=>{
    started=true;
    enabled=true;
    splash.hidden=true;
    if(home()) {
      // A közvetlen gombnyomás engedélyezi a böngészőben a hangindítást.
      audio.play().then(()=>{note.textContent='A zene csak a kezdőképernyőn szól.';sync();}).catch(()=>{note.textContent='A zenét nem sikerült elindítani. Ellenőrizd a rail-music.mp3 fájlt.';sync();});
    } else {enabled=false;note.textContent='A zene csak a kezdőlapon hallható.';}
    update();
  });
  play.addEventListener('click',()=>{
    if(!home())return;
    if(!audio.paused){enabled=false;pausedForLesson=false;audio.pause();note.textContent='Zene szüneteltetve.';}
    else{enabled=true;pausedForLesson=false;audio.play().then(()=>{note.textContent='Zene lejátszása.';sync();}).catch(()=>{note.textContent='Nem sikerült betölteni a rail-music.mp3 fájlt.';sync();});}
    sync();
  });
  mute.addEventListener('click',()=>{audio.muted=!audio.muted;persist();sync();});
  volume.addEventListener('input',()=>{audio.volume=Number(volume.value)/100;persist();sync();});
  audio.addEventListener('pause',sync);
  audio.addEventListener('play',sync);
  audio.addEventListener('error',()=>{note.textContent='A zenei fájl nem érhető el vagy nem játszható le.';});
  sync();
})();
