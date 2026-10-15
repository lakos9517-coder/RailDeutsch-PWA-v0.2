// RailDeutsch: continuous music controls, independent from #app re-renders.
(() => {
  'use strict';
  if (document.getElementById('rd-audio-controls')) return;
  const audio = new Audio('./rail-music.mp3');
  audio.loop = true;
  audio.preload = 'none';
  const storageKey = 'raildeutsch-music-v05';
  let wantsMusic = false;
  let pausedForLesson = false;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch (_) {}
  audio.volume = Number.isFinite(saved.volume) ? Math.max(0, Math.min(1, saved.volume)) : 0.22;
  audio.muted = saved.muted === true;

  const panel = document.createElement('div');
  panel.id = 'rd-audio-controls';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Háttérzene vezérlése');
  panel.innerHTML = `
    <span class="rd-label">🎵 Háttérzene</span>
    <button type="button" id="rd-play" aria-label="Zene indítása">▶ Indítás</button>
    <button type="button" id="rd-mute" aria-label="Hang némítása">🔊 Hang</button>
    <label for="rd-vol">Hangerő</label>
    <input id="rd-vol" type="range" min="0" max="100" value="22" aria-label="Háttérzene hangereje">
    <small id="rd-note" aria-live="polite">Indításhoz kattints a ▶ gombra.</small>
  `;
  const style = document.createElement('style');
  style.textContent = `
    #rd-audio-controls[hidden]{display:none!important}#rd-audio-controls{box-sizing:border-box;position:fixed;z-index:9999;bottom:max(12px,env(safe-area-inset-bottom));right:12px;left:auto;display:flex;align-items:center;flex-wrap:wrap;gap:8px;max-width:min(520px,calc(100vw - 24px));padding:10px 12px;border:1px solid #b9d6db;border-radius:15px;background:#f4fbfbee;color:#123944;box-shadow:0 4px 19px #0002;font:13px/1.3 system-ui,sans-serif;backdrop-filter:blur(10px)}
    #rd-audio-controls .rd-label{font-weight:700}#rd-audio-controls button{border:0;border-radius:9px;padding:9px 11px;background:#0e6671;color:white;cursor:pointer;font:inherit;font-weight:600}#rd-audio-controls button:focus-visible,#rd-audio-controls input:focus-visible{outline:3px solid #e6a74b;outline-offset:2px}#rd-audio-controls label{font-size:12px}#rd-vol{width:75px;accent-color:#0e6671}#rd-note{flex-basis:100%;color:#496b76}@media(max-width:460px){#rd-audio-controls{left:10px;right:10px;justify-content:center}#rd-audio-controls .rd-label{display:none}}
    body{padding-bottom:90px!important}
  `;
  document.head.appendChild(style);
  document.body.appendChild(panel);
  const play = panel.querySelector('#rd-play');
  const mute = panel.querySelector('#rd-mute');
  const volume = panel.querySelector('#rd-vol');
  const note = panel.querySelector('#rd-note');
  volume.value = String(Math.round(audio.volume * 100));
  function persist() { try { localStorage.setItem(storageKey, JSON.stringify({muted:audio.muted,volume:audio.volume})); } catch (_) {} }
  function sync() {
    play.textContent = audio.paused ? '▶ Indítás' : '⏸ Szünet';
    play.setAttribute('aria-label', audio.paused ? 'Zene indítása' : 'Zene szüneteltetése');
    mute.textContent = audio.muted || audio.volume === 0 ? '🔇 Némítva' : '🔊 Hang';
    mute.setAttribute('aria-label', audio.muted ? 'Hang visszakapcsolása' : 'Hang némítása');
  }
  function onHome() { return Boolean(document.querySelector('#app .cards')); }
  function updateVisibility() {
    const home = onHome();
    panel.hidden = !home;
    if (!home) {
      if (!audio.paused) { pausedForLesson = true; audio.pause(); }
    } else if (pausedForLesson && wantsMusic) {
      pausedForLesson = false;
      audio.play().catch(() => { note.textContent = 'Érintsd meg az Indítás gombot a zene folytatásához.'; });
    }
    sync();
  }
  new MutationObserver(updateVisibility).observe(document.getElementById('app'), {childList:true});
  play.addEventListener('click', async () => {
    if (!onHome()) return;
    pausedForLesson = false;
    if (!audio.paused) { wantsMusic = false; audio.pause(); note.textContent = 'Zene szüneteltetve.'; sync(); return; }
    wantsMusic = true;
    try { await audio.play(); note.textContent = 'A zene csak a kezdőképernyőn szól.'; }
    catch (_) { note.textContent = 'Nem sikerült betölteni a zenét. Ellenőrizd a rail-music.mp3 fájlt.'; }
    sync();
  });
  mute.addEventListener('click', () => { audio.muted = !audio.muted; persist(); sync(); });
  volume.addEventListener('input', () => { audio.volume = Number(volume.value)/100; persist(); sync(); });
  audio.addEventListener('pause', sync);
  audio.addEventListener('play', sync);
  audio.addEventListener('error', () => { note.textContent = 'A zenei fájl nem érhető el.'; });
  updateVisibility();
})();
