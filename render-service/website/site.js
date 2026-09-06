"use strict";
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const bar=document.querySelector('.scroll-progress');let queued=false;
function progress(){const range=document.documentElement.scrollHeight-window.innerHeight;if(bar)bar.style.transform=`scaleX(${range>0?Math.min(1,Math.max(0,window.scrollY/range)):0})`;queued=false;}
window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(progress);}},{passive:true});window.addEventListener('resize',progress);progress();
if(!reduced&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const item of entries){if(item.isIntersecting){item.target.classList.add('reveal-in');observer.unobserve(item.target);}}},{threshold:.08});document.querySelectorAll('.home-section,.feature-strip').forEach(el=>observer.observe(el));}
