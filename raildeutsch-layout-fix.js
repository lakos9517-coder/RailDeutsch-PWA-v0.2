/* RailDeutsch stable lesson tools v1.1.2 */
(() => {
  'use strict';
  if (window.__rdStableLessonTools) return;
  window.__rdStableLessonTools = true;

  const app = document.getElementById('app');
  if (!app) return;
  const tools = [
    { id: 'bw09-launch', label: '📘 Bahnwissen' },
    { id: 'rd10-launch', label: '🎧 Hörtraining' }
  ];
  const stable = new Map();
  let pending = false;

  function isLessonsPage() {
    return Boolean(app.querySelector('.cards') && app.querySelector('.lesson')) &&
      !app.querySelector('.question') && !app.querySelector('.rd-welcome');
  }

  function update() {
    pending = false;
    const active = isLessonsPage();
    // Original launcher buttons must NEVER live inside #app: home() replaces its HTML.
    for (const item of tools) {
      const original = stable.get(item.id) || document.getElementById(item.id);
      if (!original) continue;
      stable.set(item.id, original);
      if (original.parentNode !== document.body) document.body.appendChild(original);
      original.hidden = true;
      original.setAttribute('aria-hidden', 'true');
      original.style.setProperty('display', 'none', 'important');
    }

    if (!active) return;
    const cards = app.querySelector('.cards');
    let slot = app.querySelector('#rd-learning-tools');
    if (!slot) {
      slot = document.createElement('section');
      slot.id = 'rd-learning-tools';
      slot.setAttribute('aria-label', 'További tanulás');
      slot.innerHTML = '<h2>📚 További tanulás</h2><p>Vasúti tudástár és német hallásértési gyakorlatok</p><div class="rd-stable-buttons"></div>';
      cards.parentNode.insertBefore(slot, cards);
    }
    const holder = slot.querySelector('.rd-stable-buttons') || slot;
    for (const item of tools) {
      if (!stable.get(item.id)) continue;
      const proxyId = 'rd-stable-' + item.id;
      if (document.getElementById(proxyId)) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.id = proxyId;
      button.className = 'rd-tools-launch rd-stable-button';
      button.textContent = item.label;
      button.addEventListener('click', () => {
        const original = stable.get(item.id);
        if (original) original.click();
      });
      holder.appendChild(button);
    }
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }
  new MutationObserver(schedule).observe(app, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  schedule();
})();
