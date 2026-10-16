/* RailDeutsch v1.1 compatibility update: UI locale, menus and version. */
(()=>{'use strict';if(window.__rd11)return;window.__rd11=true;
const KEY='raildeutsch-interface-v11';let locale=localStorage.getItem(KEY)==='de'?'de':'hu';
const pairs=[
['Tanulj németül a vasút világában!','Lerne Deutsch in der Welt der Eisenbahn!'],
['20 kérdés · 30 másodperc · vasúti szókincs','20 Fragen · 30 Sekunden · Eisenbahnwortschatz'],
['A háttérzene a kezdőlapon szólhat. A leckék alatt szünetel.','Hintergrundmusik läuft nur auf der Startseite, nicht während der Lektionen.'],
['Nyelvi beállítások','Spracheinstellungen'],['Kérdések','Fragen'],['Válaszok','Antworten'],['Magyarázatok','Erklärungen'],
['Válassz országot','Land auswählen'],['Ingyenes leckék','Kostenlose Lektionen'],['Tanulási mód','Lernmodus'],
['Gyakorlás','Üben'],['Nincs időkorlát','Ohne Zeitlimit'],['Normál','Normal'],['Kihívás','Herausforderung'],
['Kész','Fertig'],['Vissza a leckékhez','Zurück zu den Lektionen'],['még nem teljesítetted','noch nicht abgeschlossen'],
['Nyelvtanulás','Sprachenlernen'],['További tanulás','Weitere Lernangebote'],
['Vasúti tudástár és német hallásértési gyakorlatok','Eisenbahnwissen und deutsches Hörtraining'],
['Bahnwissen – vasúti tudástár','Bahnwissen – Eisenbahnwissen'],
['legjobb:','Bestwert:'],['teljesített lecke','abgeschlossene Lektionen'],
['Az eredmények a készüléken tárolódnak','Die Ergebnisse werden auf deinem Gerät gespeichert'],
['Német vasúti szaknyelv','Eisenbahn-Fachdeutsch'],['Magyar segítség','Ungarische Hilfe'],
['Oktatási tananyag; nem hivatalos vasúti üzemeltetési utasítás.','Lernmaterial, keine amtliche Eisenbahnbetriebsanweisung.'],
['A fordításos feladatok válasznyelve kötött, hogy ne legyenek értelmetlen megoldások.','Bei Übersetzungsaufgaben ist die Antwortsprache festgelegt, um falsche Zuordnungen zu vermeiden.'],
['Hallásértés és számolás gyakorlása','Hörverstehen und Kopfrechnen üben'],
['Bezárás','Schließen'],['Másik témakör','Nächstes Thema'],['Magyar magyarázat','Ungarische Erklärung'],
['Tudásellenőrzés','Wissenscheck'],['Helyes!','Richtig!'],['Nem jó.','Leider falsch.'],
['Következő','Weiter'],['Eredmény','Ergebnis'],['Elhangzott:','Gehört:'],
['Bemondott számok','Gesprochene Zahlen'],['Fejben számolás','Kopfrechnen'],['Hallásértés','Hörverstehen'],
['Vasúti kommunikáció','Bahnbetriebliche Kommunikation'],['Állásinterjú és alkalmasság','Vorstellungsgespräch und Eignung']
];
const labels=new Map(pairs),reverse=new Map(pairs.map(([hu,de])=>[de,hu]));
function replaceWords(value){let s=value;for(const [hu,de] of pairs){const src=locale==='de'?hu:de,target=locale==='de'?de:hu;if(s===src)s=target;else if(s.startsWith(src+' '))s=target+s.slice(src.length);else if(s.startsWith(src+' ·'))s=target+s.slice(src.length)}return s.replace(/v0\.[789]|v1\.0/g,'v1.1')}
function welcomeSwitch(){const welcome=document.querySelector('.rd-welcome-inner');if(!welcome)return;let panel=welcome.querySelector('#rd11-choice');if(!panel){panel=document.createElement('div');panel.id='rd11-choice';panel.className='rd11-choice';const btn=welcome.querySelector('#startWelcome');if(btn)welcome.insertBefore(panel,btn);else welcome.appendChild(panel)}if(panel.dataset.locale===locale)return;panel.dataset.locale=locale;panel.innerHTML=`<span>${locale==='de'?'App-Sprache wählen':'Válaszd ki az alkalmazás nyelvét'}</span><div><button data-rd11-lang="hu" ${locale==='hu'?'aria-pressed="true"':''}>🇭🇺 Magyar</button><button data-rd11-lang="de" ${locale==='de'?'aria-pressed="true"':''}>🇩🇪 Deutsch</button></div>`;panel.querySelectorAll('button').forEach(b=>b.onclick=()=>setLocale(b.dataset.rd11Lang));}
function setLocale(lang){locale=lang;localStorage.setItem(KEY,lang);document.documentElement.lang=lang;update()}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;update()})}
function update(){document.title='RailDeutsch v1.1';document.documentElement.lang=locale;
 const app=document.querySelector('#app');if(app){const walk=document.createTreeWalker(app,NodeFilter.SHOW_TEXT);const nodes=[];while(walk.nextNode())nodes.push(walk.currentNode);for(const n of nodes){if(n.parentElement?.closest('.question,.option,[data-answer],.bw09-article,.rd10-feedback'))continue;const newText=replaceWords(n.nodeValue);if(newText!==n.nodeValue)n.nodeValue=newText}}
 const brand=document.querySelector('.brand small');if(brand)brand.textContent='v1.1';
 for(const node of document.querySelectorAll('#bw09-launch,#rd10-launch')){if(node.id==='rd10-launch'){node.textContent='🎧 Hörtraining'}else node.textContent='📘 Bahnwissen'}
 welcomeSwitch();}
const target=document.querySelector('#app')||document.body;new MutationObserver(schedule).observe(target,{subtree:true,childList:true,characterData:true});document.addEventListener('DOMContentLoaded',schedule);window.addEventListener('load',schedule);setTimeout(schedule,100);window.RailDeutschSetLocale=setLocale;
})();
