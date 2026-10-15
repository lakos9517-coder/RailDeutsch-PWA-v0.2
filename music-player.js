// RailDeutsch v0.3 – home screen music; never autoplays.
(() => {
  'use strict';
  const app = document.getElementById('app');
  if (!app) return;
  const audio = new Audio('./background-music.wav');
  audio.loop = true;
  audio.preload = 'none';
  audio.volume = 0.22;

  function showPlayer() {
    const main = app.querySelector('.main');
    const countrySelector = main?.querySelector('.seg');
    if (!countrySelector) {
      if (!audio.paused) audio.pause();
      return;
    }
    if (main.querySelector('#rd-music')) return;
    const section = document.createElement('section');
    section.id = 'rd-music';
    section.className = 'rd-music';
    section.setAttribute('aria-label', 'Háttérzene');
    section.innerHTML = `
      <div class="rd-music-heading"><span aria-hidden="true">🎵</span><span><strong>Tanulási háttérzene</strong><small>Nyugodt instrumentális dallam</small></span></div>
      <div class="rd-music-controls">
        <button type="button" id="rd-music-toggle" aria-label="Zene indítása">▶ Lejátszás</button>
        <label for="rd-music-volume">🔊 <span>Hangerő</span></label>
        <input id="rd-music-volume" aria-label="Zene hangereje" type="range" min="0" max="100" value="22" />
      </div>
      <p id="rd-music-error" class="rd-music-error" role="status" hidden></p>
    `;
    countrySelector.insertAdjacentElement('afterend', section);
    const toggle = section.querySelector('#rd-music-toggle');
    const volume = section.querySelector('#rd-music-volume');
    function refresh() {
      toggle.textContent = audio.paused ? '▶ Lejátszás' : '⏸ Szünet';
      toggle.setAttribute('aria-label', audio.paused ? 'Zene indítása' : 'Zene szüneteltetése');
    }
    refresh();
    toggle.addEventListener('click', async () => {
      const error = section.querySelector('#rd-music-error');
      error.hidden = true;
      if (!audio.paused) { audio.pause(); refresh(); return; }
      try { await audio.play(); } catch (_) {
        error.textContent = 'A zene nem indult el. Ellenőrizd, hogy a background-music.wav fájl is fel van-e töltve.';
        error.hidden = false;
      }
      refresh();
    });
    volume.addEventListener('input', () => { audio.volume = Number(volume.value) / 100; });
  }
  new MutationObserver(showPlayer).observe(app, { childList: true });
  showPlayer();
})();
