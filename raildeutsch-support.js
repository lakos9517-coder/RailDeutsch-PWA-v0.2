/* RailDeutsch voluntary support page, HU/DE, no paywall. */
(() => {
  'use strict';
  if (window.__rdSupport) return;
  window.__rdSupport = true;
  // RailDeutsch creator's public Ko-fi support page.
  const KOFI_URL = 'https://ko-fi.com/petiraildeutsch';
  const LANG_KEY = 'raildeutsch-interface-v11';
  const locale = () => localStorage.getItem(LANG_KEY) === 'de' ? 'de' : 'hu';
  const copy = {
    de: {
      launch: '❤️ Unterstützung', headline: 'RailDeutsch unterstützen ❤️',
      slogan: 'Kostenlos lernen. Gemeinsam entwickeln.',
      intro: 'RailDeutsch ist ein kostenloses Lernprojekt für alle, die Eisenbahn-Deutsch lernen oder sich auf den Beruf als Lokführer bzw. Lokführerin vorbereiten möchten.',
      text: 'Mit deiner freiwilligen Unterstützung hilfst du, RailDeutsch weiterzuentwickeln.',
      use: 'Deine Unterstützung hilft bei:',
      items: ['📖 Neuen Übungen und Eisenbahn-Fachwortschatz', '🎧 Hörtraining und Bahnkommunikation', '🚆 Bahnwissen für Österreich und Deutschland', '📱 Pflege und Verbesserung der App'],
      minimum: 'Ab 3 € unterstützen', thanks: 'Jeder Beitrag hilft. Vielen Dank! ❤️',
      link: '☕ Über Ko-fi unterstützen', pending: 'Der Ko-fi-Link wird bald ergänzt.',
      free: 'Freiwillig – keine Zahlung erforderlich. Die kostenlosen Lerninhalte bleiben ohne Unterstützung zugänglich.',
      close: 'Schließen', after: 'Hat dir diese Lektion geholfen? Unterstütze RailDeutsch ❤️'
    },
    hu: {
      launch: '❤️ Támogatás', headline: 'Támogasd a RailDeutschot! ❤️',
      slogan: 'Tanulj ingyen. Fejlesszük együtt.',
      intro: 'A RailDeutsch ingyenes tanulási projekt mindenkinek, aki a vasúti német szaknyelvet tanulja, vagy mozdonyvezetői munkára készül.',
      text: 'Önkéntes támogatásoddal hozzájárulhatsz az alkalmazás továbbfejlesztéséhez.',
      use: 'A támogatások segítenek a következőkben:',
      items: ['📖 Új feladatok és vasúti szókincs', '🎧 Hallásértés és vasúti kommunikáció', '🚆 Osztrák és német vasúti ismeretek', '📱 Az alkalmazás karbantartása és fejlesztése'],
      minimum: 'Támogatás 3 €-tól', thanks: 'Minden támogatás számít. Köszönöm! ❤️',
      link: '☕ Támogatás Ko-fi-n', pending: 'A Ko-fi hivatkozás hamarosan elérhető.',
      free: 'Önkéntes – fizetés nem szükséges. Az ingyenes tananyag támogatás nélkül is elérhető.',
      close: 'Bezárás', after: 'Hasznos volt a lecke? Támogasd a RailDeutschot! ❤️'
    }
  };
  const css = document.createElement('style');
  css.textContent = `
    .rd-support-launch{width:100%;margin:16px 0;padding:14px 18px;border:1px solid #e3bac7;border-radius:14px;background:#fff2f5;color:#903957;font-weight:800;text-align:center;cursor:pointer;font:inherit}
    .rd-support-launch:hover{background:#ffe7ee}
    #rd-support-modal{position:fixed;inset:0;z-index:99999;background:rgba(7,24,36,.75);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}
    #rd-support-modal[hidden]{display:none}
    .rd-support-card{width:min(100%,520px);max-height:calc(100dvh - 32px);overflow-y:auto;background:white;color:#163041;border-radius:22px;padding:24px;box-shadow:0 20px 70px #0005}
    .rd-support-top{display:flex;justify-content:space-between;align-items:start;gap:12px}
    .rd-support-top h2{margin:0;font-size:23px}
    .rd-support-close{border:0;background:#f1f5f7;padding:7px 11px;border-radius:10px;cursor:pointer}
    .rd-support-card p{line-height:1.55}
    .rd-support-slogan{color:#0d6672;font-weight:700}
    .rd-support-card ul{padding-left:0;list-style:none;display:grid;gap:10px}
    .rd-support-card li{padding:10px;background:#f3f8fa;border-radius:10px}
    .rd-support-link{display:block;width:100%;background:#0d6672;color:white;text-align:center;text-decoration:none;padding:15px;border-radius:12px;font-weight:800}
    .rd-support-link:focus-visible,.rd-support-launch:focus-visible{outline:3px solid #eead4b;outline-offset:3px}
    .rd-support-pending{padding:14px;background:#f3f8fa;text-align:center;border-radius:12px}
    .rd-support-note{font-size:13px;color:#637985}
  `;
  document.head.appendChild(css);
  let previousFocus = null;
  function close() {
    document.getElementById('rd-support-modal')?.remove();
    document.body.style.overflow = document.body.dataset.rdSupportPreviousOverflow || '';
    delete document.body.dataset.rdSupportPreviousOverflow;
    previousFocus?.focus?.();
  }
  function open() {
    if (document.getElementById('rd-support-modal')) return;
    previousFocus = document.activeElement;
    const l = copy[locale()];
    const modal = document.createElement('div');
    modal.id = 'rd-support-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'rd-support-heading');
    const payment = /^https:\/\/ko-fi\.com\/[a-zA-Z0-9_-]+\/?$/.test(KOFI_URL)
      ? `<a class="rd-support-link" href="${KOFI_URL}" target="_blank" rel="noopener noreferrer">${l.link} ↗</a>`
      : `<div class="rd-support-pending">${l.pending}</div>`;
    modal.innerHTML = `<section class="rd-support-card">
      <div class="rd-support-top"><h2 id="rd-support-heading">${l.headline}</h2><button type="button" class="rd-support-close" aria-label="${l.close}">✕</button></div>
      <p class="rd-support-slogan">${l.slogan}</p>
      <p>${l.intro}</p><p>${l.text}</p>
      <strong>${l.use}</strong><ul>${l.items.map(i=>`<li>${i}</li>`).join('')}</ul>
      <h3>${l.minimum}</h3><p>${l.thanks}</p>${payment}
      <p class="rd-support-note">${l.free}</p></section>`;
    document.body.dataset.rdSupportPreviousOverflow = document.body.style.overflow;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.querySelector('.rd-support-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    modal.querySelector('.rd-support-close').focus();
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('rd-support-modal')) close(); });
  let scheduled = false;
  function update() {
    scheduled = false;
    const root = document.querySelector('#app');
    if (!root) return;
    const l = copy[locale()];
    const lessons = root.querySelector('.cards');
    const complete = root.querySelector('.complete');
    const existing = root.querySelector('.rd-support-launch');
    if (!lessons && !complete) { existing?.remove(); return; }
    let button = existing;
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'rd-support-launch';
      button.addEventListener('click', open);
      if (lessons) (root.querySelector('.install') || lessons).after(button);
      else complete.appendChild(button);
    }
    button.textContent = complete ? l.after : l.launch;
  }
  function schedule() { if (scheduled) return; scheduled = true; requestAnimationFrame(update); }
  const root = document.querySelector('#app');
  if (root) new MutationObserver(schedule).observe(root, {childList:true,subtree:false});
  document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  schedule();
})();
