"use strict";
const entries = [...document.querySelectorAll('.entry')];
const search = document.getElementById('find');
function filterEntries(){const query = search.value.trim().toLowerCase();let count=0;for(const entry of entries){entry.hidden=!entry.textContent.toLowerCase().includes(query);if(!entry.hidden)count++;}document.getElementById('result-count').textContent=`${count} of ${entries.length} entries`;document.getElementById('empty').hidden=count!==0;}
if(search){search.addEventListener('input',filterEntries);filterEntries();}
for(const slot of document.querySelectorAll('.picture-slot')){const path=window.IDLE_HUNTER_IMAGES?.[slot.dataset.kind]?.[slot.dataset.name];if(!path)continue;const img=document.createElement('img');img.alt=slot.dataset.name;img.loading='lazy';img.width=320;img.height=180;img.addEventListener('load',()=>slot.removeAttribute('aria-hidden'));img.addEventListener('error',()=>img.remove());img.src=path;slot.append(img);}
