/* RailDeutsch 1.1.1 – one welcome screen, home-only music */
(()=>{'use strict';if(window.__rdMusic111)return;window.__rdMusic111=true;
const root=document.getElementById('app'), audio=new Audio('./rail-music.mp3');audio.loop=true;audio.preload='auto';
let saved={};try{saved=JSON.parse(localStorage.getItem('raildeutsch-music-v06')||'{}')}catch(e){}
audio.volume=Number.isFinite(saved.volume)?Math.max(0,Math.min(1,saved.volume)):.22;audio.muted=saved.muted===true;
let optedIn=false,manualPause=false;
const panel=document.createElement('div');panel.id='rd-audio-controls';panel.setAttribute('aria-label','Háttérzene');panel.innerHTML='<span class="rd-label">🎵 Vierzig Zwanzig</span><button id="rd-play" type="button">⏸ Szünet</button><button id="rd-mute" type="button">🔊 Hang</button><label for="rd-vol">Hangerő</label><input id="rd-vol" type="range" min="0" max="100"><small id="rd-note" aria-live="polite"></small>';document.body.appendChild(panel);
const css=document.createElement('style');css.textContent='#rd-audio-controls{position:fixed;z-index:9000;bottom:12px;right:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px;border-radius:14px;background:#f4fbfb;color:#173c48;border:1px solid #b9d6db;box-shadow:0 3px 12px #0002;font:13px system-ui}#rd-audio-controls[hidden]{display:none!important}#rd-audio-controls button{background:#0e6671;border:0;border-radius:9px;color:white;padding:9px;cursor:pointer}#rd-audio-controls #rd-vol{width:80px}#rd-audio-controls #rd-note{flex-basis:100%}@media(max-width:480px){#rd-audio-controls{left:10px;right:10px;justify-content:center}}';document.head.appendChild(css);
const play=panel.querySelector('#rd-play'),mute=panel.querySelector('#rd-mute'),volume=panel.querySelector('#rd-vol'),note=panel.querySelector('#rd-note');volume.value=String(Math.round(audio.volume*100));
const onHome=()=>!!root?.querySelector('.cards .lesson')&&!root.querySelector('.question');const onTraining=()=>!!document.getElementById('rd10-panel')||!!document.getElementById('bw09-panel');
const allowed=()=>onHome()&&!onTraining();
function lang(){return localStorage.getItem('raildeutsch-interface-v11')==='de'?'de':'hu'}
function persist(){try{localStorage.setItem('raildeutsch-music-v06',JSON.stringify({volume:audio.volume,muted:audio.muted}))}catch(e){}}
function sync(){let de=lang()==='de';play.textContent=audio.paused?(de?'▶ Starten':'▶ Indítás'):(de?'⏸ Pause':'⏸ Szünet');mute.textContent=audio.muted?(de?'🔇 Stumm':'🔇 Némítva'):(de?'🔊 Ton':'🔊 Hang');panel.querySelector('label').textContent=de?'Lautstärke':'Hangerő';volume.setAttribute('aria-label',de?'Lautstärke':'Hangerő')}
function resume(){if(!optedIn||manualPause||!allowed())return;audio.play().catch(()=>{note.textContent=lang()==='de'?'Zum Abspielen auf Starten klicken.':'Az indításhoz kattints a gombra.';sync()})}
function update(){panel.hidden=!allowed();if(!allowed()){audio.pause()}else resume();sync()}
// Capture the actual welcome button click to satisfy browser autoplay policy.
document.addEventListener('click',e=>{if(e.target.closest('#startWelcome')){optedIn=true;manualPause=false;audio.play().catch(()=>{});queueMicrotask(update)}},true);
play.addEventListener('click',()=>{if(!allowed())return;if(audio.paused){manualPause=false;optedIn=true;resume()}else{manualPause=true;audio.pause()}sync()});
mute.addEventListener('click',()=>{audio.muted=!audio.muted;persist();sync()});volume.addEventListener('input',()=>{audio.volume=Number(volume.value)/100;persist();sync()});audio.addEventListener('pause',sync);audio.addEventListener('play',sync);
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;update()})}
if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:false});
// Only observe added/removed overlays; no repetitive work on audio text changes.
new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&(n.id==='rd10-panel'||n.id==='bw09-panel'))))schedule()}).observe(document.body,{childList:true});
window.addEventListener('storage',sync);window.RailDeutschMusic={pause:()=>{audio.pause();sync()},update};panel.hidden=true;sync();
})();
