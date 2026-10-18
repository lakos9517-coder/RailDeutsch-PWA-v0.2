/* Public RailDeutsch copyright link - independent of lesson/quiz updates */
(()=>{'use strict';if(window.__rdCopyright)return;window.__rdCopyright=true;
const app=document.getElementById('app');if(!app)return;
const css=document.createElement('style');css.textContent='.rd-copyright-link{display:inline-block;margin:10px 0 0;color:#087084;text-decoration:underline;font-size:.85rem}.rd-welcome .rd-copyright-link{color:#d4eeee}';document.head.appendChild(css);
function update(){const host=app.querySelector('.footer')||app.querySelector('.rd-welcome-inner');if(!host||host.querySelector('.rd-copyright-link'))return;const a=document.createElement('a');a.className='rd-copyright-link';a.href='./copyright.html';a.textContent='© 2026 Lakos Péter · Szerzői jog / Urheberrecht';host.appendChild(a)}
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;update()})}).observe(app,{childList:true});update();
})();