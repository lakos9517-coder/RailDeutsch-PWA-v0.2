/* RailDeutsch 1.1.1 integrated menu and full UI locale pass */
(()=>{'use strict';if(window.__rd111)return;window.__rd111=true;
const KEY='raildeutsch-interface-v11';let locale=localStorage.getItem(KEY)==='de'?'de':'hu';
const dictionary=[
['Willkommen bei RailDeutsch!','Willkommen bei RailDeutsch!'],['Tanulj németül a vasút világában!','Lerne Deutsch in der Welt der Eisenbahn!'],
['20 kérdés · 30 másodperc · vasúti szókincs','20 Fragen · 30 Sekunden · Eisenbahnwortschatz'],
['A háttérzene a kezdőlapon szólhat.','Die Hintergrundmusik läuft auf der Startseite.'],['A leckék alatt szünetel.','Während der Lektionen pausiert sie.'],
['Nyelvi beállítások','Spracheinstellungen'],['Kérdések','Fragen'],['Válaszok','Antworten'],['Magyarázatok','Erklärungen'],
['Válassz országot','Land auswählen'],['Ausztria','Österreich'],['Németország','Deutschland'],['Ingyenes leckék','Kostenlose Lektionen'],
['Tanulási mód','Lernmodus'],['Gyakorlás','Üben'],['Nincs időkorlát','Ohne Zeitlimit'],['Normál','Normal'],['Kihívás','Herausforderung'],
['Kész','Abgeschlossen'],['Vissza a leckékhez','Zurück zu den Lektionen'],['még nem teljesítetted','noch nicht abgeschlossen'],
['További tanulás','Weitere Lernangebote'],['Vasúti tudástár és német hallásértési gyakorlatok','Eisenbahnwissen und deutsches Hörtraining'],
['legjobb:','Bestwert:'],['teljesített lecke','abgeschlossene Lektionen'],['Az eredmények a készüléken tárolódnak','Ergebnisse werden auf diesem Gerät gespeichert'],
['Német vasúti szaknyelv','Eisenbahn-Fachdeutsch'],['Magyar segítség','Ungarische Unterstützung'],
['Oktatási tananyag; nem hivatalos vasúti üzemeltetési utasítás.','Lernmaterial, keine offizielle Betriebsanweisung.'],
['A fordításos feladatok válasznyelve kötött, hogy ne legyenek értelmetlen megoldások.','Die Antwortsprache bei Übersetzungsfragen ist festgelegt.'],
['Nyelv','Sprache'],['Német','Deutsch'],['Magyar','Ungarisch'],['Következő kérdés','Nächste Frage'],
['Lecke befejezése','Lektion abschließen'],['Helyes válasz!','Richtige Antwort!'],['Nem helyes.','Leider falsch.'],['Lejárt az idő.','Zeit abgelaufen.'],
['Lecke teljesítve!','Lektion abgeschlossen!'],['helyes válasz','richtige Antworten'],['Új 20 kérdés','Neue 20 Fragen'],
['Legjobb eredmény:','Bestes Ergebnis:'],['mentve ezen a készüléken.','auf diesem Gerät gespeichert.'],['Vissza a leckékhez','Zurück zu den Lektionen'],
['Hangerő','Lautstärke'],['Indítás','Starten'],['Szünet','Pause'],['Némítva','Stumm'],['Hang','Ton'],
['10 lecke','10 Lektionen'],['lecke','Lektion'],['feladat / menet: fordítás, mondatok és képek','Aufgaben pro Runde: Übersetzung, Sätze und Bilder'],
['kérdés','Fragen'],['mp / kérdés','Sek. / Frage'],['mp','Sek.'],['Helyes:','Richtig:'],
['Bezárás','Schließen'],['Meghallgatás','Anhören'],['Újra meghallgatom','Erneut anhören'],['Következő','Weiter'],
['Válassz gyakorlást!','Wähle eine Übung!'],['Hallásértés és alkalmassági gyakorlatok','Hörverstehen und Eignungsübungen'],
['Hallásértés','Hörverstehen'],['Bemondott számok','Gesprochene Zahlen'],['Fejben számolás','Kopfrechnen'],
['Vasúti kommunikáció','Bahnkommunikation'],['Állásinterjú és alkalmasság','Vorstellungsgespräch und Eignung'],
['Tudásellenőrzés','Wissenscheck'],['Magyar magyarázat','Ungarische Erklärung'],['Eredmény','Ergebnis']
];
// Sorted longest first; only interface nodes, never question/answer/explanation contents.
const pairs=dictionary.filter(([a,b])=>a!==b).sort((a,b)=>b[0].length-a[0].length);
function convert(s){if(!s||!s.trim())return s;let x=s;
for(const [hu,de] of pairs){let from=locale==='de'?hu:de,to=locale==='de'?de:hu;
// Prefer full phrases; preserve numeric prefixes and UI metadata suffixes.
if(x.includes(from))x=x.split(from).join(to);
}return x.replace(/\bv0\.8\b|\bv1\.0\b/g,'v1.1');}
function isExercise(n){return !!n.parentElement?.closest('.question,.option,[data-answer],.feedback,.rd10-options,.rd10-feedback,.bw09-article,.rd10-counter,.rd10-notice')}
function translate(root){if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const n of nodes){if(isExercise(n))continue;let x=convert(n.nodeValue);if(x!==n.nodeValue)n.nodeValue=x}}
function choice(){const welcome=document.querySelector('.rd-welcome-inner');if(!welcome)return;let container=welcome.querySelector('#rd111-choice');if(!container){container=document.createElement('div');container.id='rd111-choice';container.style.cssText='padding:12px;margin:12px auto;max-width:340px;border:1px solid #ffffff55;border-radius:12px';const b=welcome.querySelector('#startWelcome');if(b)welcome.insertBefore(container,b);else welcome.appendChild(container)}
if(container.dataset.locale===locale)return;container.dataset.locale=locale;container.innerHTML=`<p>${locale==='de'?'App-Sprache auswählen':'Az alkalmazás nyelve'}</p><button type="button" data-rd-lang="hu" aria-pressed="${locale==='hu'}">🇭🇺 Magyar</button> <button type="button" data-rd-lang="de" aria-pressed="${locale==='de'}">🇩🇪 Deutsch</button>`;container.querySelectorAll('[data-rd-lang]').forEach(b=>b.addEventListener('click',()=>{locale=b.dataset.rdLang;localStorage.setItem(KEY,locale);container.dataset.locale='';render()}))}
function position(){const app=document.querySelector('#app'),cards=app?.querySelector('.cards');const isHome=!!cards&&!!app.querySelector('.lesson')&&!app.querySelector('.question');
let slot=app?.querySelector('#rd-learning-tools');if(isHome&&!slot){slot=document.createElement('section');slot.id='rd-learning-tools';slot.innerHTML='<h2>📚 További tanulás</h2><p>Vasúti tudástár és német hallásértési gyakorlatok</p><div class="rd-tools-grid"></div>';cards.parentElement.insertBefore(slot,cards)}
for(const id of ['bw09-launch','rd10-launch']){const btn=document.getElementById(id);if(!btn)continue;btn.classList.add('rd-tools-launch');if(isHome&&slot){const grid=slot.querySelector('.rd-tools-grid');if(btn.parentNode!==grid)grid.appendChild(btn);btn.hidden=false;btn.style.setProperty('display','inline-flex','important')}else{btn.hidden=true;btn.style.setProperty('display','none','important')}}}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})}
function render(){document.title='RailDeutsch v1.1';document.documentElement.lang=locale;position();const brand=document.querySelector('#app .brand small');if(brand)brand.textContent='v1.1';choice();translate(document.querySelector('#app'));translate(document.querySelector('#rd-audio-controls'));translate(document.querySelector('#rd10-panel'));translate(document.querySelector('#rd111-choice'));const links=document.querySelector('#rd-learning-tools');if(links)translate(links);}
const app=document.querySelector('#app');if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:false});
// Observe launcher insertion/removal and training dialog at body level, not all text changes.
new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&(['bw09-launch','rd10-launch','rd10-panel'].includes(n.id)))))schedule()}).observe(document.body,{childList:true});
document.addEventListener('DOMContentLoaded',schedule);window.addEventListener('load',schedule);window.RailDeutschSetLocale=l=>{locale=l==='de'?'de':'hu';localStorage.setItem(KEY,locale);schedule()};schedule();
})();
