/* RailDeutsch: launcher placement + strict German speech voice */
(() => {
  'use strict';
  if (window.__rdLayoutFix) return;
  window.__rdLayoutFix = true;

  const ids = ['bw09-launch', 'rd10-launch'];
  const app = document.getElementById('app');
  function positionLaunchers() {
    if (!app) return;
    const cards = app.querySelector('.cards');
    const isHome = Boolean(cards && app.querySelector('.lesson')) && !app.querySelector('.question') && !app.querySelector('.rd-welcome');
    let slot = app.querySelector('#rd-learning-tools');
    if (isHome && !slot) {
      slot = document.createElement('section');
      slot.id = 'rd-learning-tools';
      slot.setAttribute('aria-label', 'További tanulási lehetőségek');
      slot.innerHTML = '<h2>📚 További tanulás</h2><p>Vasúti tudástár és német hallásértési gyakorlatok</p>';
      cards.parentElement.insertBefore(slot, cards);
    }
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      // The old floating positioning must not apply on the lesson list.
      el.classList.add('rd-tools-launch');
      if (isHome && slot) {
        if (el.parentNode !== slot) slot.appendChild(el);
        el.hidden = false;
        el.style.setProperty('display', 'inline-flex', 'important');
      } else {
        // Keep the original modules alive, but hide their launch buttons elsewhere.
        if (el.parentNode !== document.body) document.body.appendChild(el);
        el.hidden = true;
        el.style.setProperty('display', 'none', 'important');
      }
    }
  }
  let scheduled = false;
  function queuePlacement() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; positionLaunchers(); });
  }
  if (app) new MutationObserver(queuePlacement).observe(app, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', queuePlacement);
  window.addEventListener('load', queuePlacement);
  setTimeout(queuePlacement, 700);

  // Keep the existing quiz module, but require an actual German voice.
  if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
    const synth = window.speechSynthesis;
    const originalSpeak = synth.speak.bind(synth);
    const germanVoice = () => {
      const list = synth.getVoices();
      return list.find(v => /^de[-_]DE$/i.test(v.lang)) ||
        list.find(v => /^de([-_]|$)/i.test(v.lang)) || null;
    };
    const notice = msg => {
      const el = document.getElementById('rd10-notice');
      if (el) el.textContent = msg;
    };
    try {
      synth.speak = function (utterance) {
        if (!(utterance instanceof SpeechSynthesisUtterance) || !/^de([-_]|$)/i.test(utterance.lang || '')) {
          return originalSpeak(utterance);
        }
        let voice = germanVoice();
        if (voice) {
          utterance.lang = voice.lang;
          utterance.voice = voice;
          return originalSpeak(utterance);
        }
        // Voices on Edge/Chrome sometimes load after the user presses Play.
        notice('Német beszédhang betöltése…');
        let finished = false;
        const tryAgain = () => {
          if (finished) return;
          voice = germanVoice();
          if (voice) {
            finished = true;
            synth.removeEventListener('voiceschanged', tryAgain);
            utterance.voice = voice;
            utterance.lang = voice.lang;
            notice('Német hang készen áll. Figyelj és válaszolj!');
            originalSpeak(utterance);
          }
        };
        synth.addEventListener('voiceschanged', tryAgain);
        tryAgain();
        setTimeout(() => {
          if (!finished) {
            finished = true;
            synth.removeEventListener('voiceschanged', tryAgain);
            notice('Nincs telepített német felolvasóhang. Windows: Beállítások → Idő és nyelv → Nyelv és régió → Német → Beszéd.');
          }
        }, 2500);
      };
    } catch (_) {
      // Some browser engines do not permit replacing speechSynthesis.speak.
    }
  }
})();
