// Adapted from the supplied main.ts: dot field, crosshair, text scramble.
(()=>{const $=s=>document.querySelector(s);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function dotField() {
  const canvas = $("#dots");
  const hero = $("#top");
  if (!canvas || !hero) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const GAP = 26;
  let w = 0;
  let h = 0;
  let dpr = 1;
  const pointer = { x: -9999, y: -9999, on: false };

  const size = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = hero.getBoundingClientRect();
    w = r.width;
    h = r.height;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  window.addEventListener("resize", size);

  hero.addEventListener(
    "pointermove",
    (e) => {
      const r = hero.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = true;
    },
    { passive: true },
  );
  hero.addEventListener("pointerleave", () => (pointer.on = false));

  const R = 190;
  let t = 0;
  let raf = 0;

  const frame = () => {
    t += 0.006;
    ctx.clearRect(0, 0, w, h);

    for (let x = GAP; x < w; x += GAP) {
      for (let y = GAP; y < h; y += GAP) {
        const wave = Math.sin(x * 0.012 + t) * Math.cos(y * 0.014 - t * 0.8);
        let a = 0.16 + wave * 0.05;
        let r = 0.7;

        if (pointer.on) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < R) {
            const f = 1 - d / R;
            a += f * 0.55;
            r += f * 1.5;
          }
        }

        if (a <= 0.012) continue;
        ctx.fillStyle = `rgba(250,250,250,${Math.min(a, 0.8)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    raf = requestAnimationFrame(frame);
  };

  if (reduced) {
    ctx.clearRect(0, 0, w, h);
    for (let x = GAP; x < w; x += GAP)
      for (let y = GAP; y < h; y += GAP) {
        ctx.fillStyle = "rgba(250,250,250,0.05)";
        ctx.beginPath();
        ctx.arc(x, y, 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    return;
  }

  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !raf) raf = requestAnimationFrame(frame);
    else if (!e.isIntersecting && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  io.observe(hero);
}

/* hunting-scope crosshair over the hero */
function crosshair() {
  const el = $("#crosshair");
  const hero = $("#top");
  if (!el || !hero || reduced) return;
  const x = el.querySelector(".x");
  const y = el.querySelector(".y");
  const read = el.querySelector(".read");

  hero.addEventListener(
    "pointermove",
    (e) => {
      const r = hero.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      x.style.transform = `translateY(${py}px)`;
      y.style.transform = `translateX(${px}px)`;
      read.style.transform = `translate(${px + 12}px, ${py + 10}px)`;
      read.textContent = `X ${Math.round(px).toString().padStart(4, "0")}  Y ${Math.round(py).toString().padStart(4, "0")}`;
      el.style.opacity = "1";
    },
    { passive: true },
  );
  hero.addEventListener("pointerleave", () => (el.style.opacity = "0"));
}

/* letters shuffle into place on hover */
function scramble() {
  if (reduced) return;
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*";
  document.querySelectorAll("[data-scramble]").forEach((el) => {
    const final = el.textContent ?? "";
    let timer = 0;
    el.addEventListener("mouseenter", () => {
      let step = 0;
      window.clearInterval(timer);
      timer = window.setInterval(() => {
        el.textContent = final
          .split("")
          .map((ch, i) =>
            i < step || ch === " " ? ch : CHARS[Math.floor(Math.random() * CHARS.length)],
          )
          .join("");
        step += 1 / 2;
        if (step >= final.length) {
          window.clearInterval(timer);
          el.textContent = final;
        }
      }, 28);
    });
  });
}


dotField();if(matchMedia('(pointer:fine)').matches)crosshair();scramble();
const menu=document.querySelector('.mobile-toggle'),nav=document.querySelector('#page-tabs');
if(menu&&nav){menu.hidden=false;menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('menu-open',open);});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');nav.classList.remove('menu-open');menu.focus();}});}
const video=document.querySelector('#demo-video');if(video){const control=document.querySelector('#demo-toggle');control.hidden=false;control.addEventListener('click',()=>{if(video.paused)video.play().catch(()=>{});else video.pause();});const sync=()=>{control.textContent=video.paused?'Play demo':'Pause demo';};video.addEventListener('play',sync);video.addEventListener('pause',sync);}
const top=document.querySelector('#to-top');if(top){top.hidden=false;top.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced?'auto':'smooth'}));}
const sections=document.querySelectorAll('article section[id]');if(sections.length&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting)document.querySelectorAll('.toc a').forEach(a=>a.classList.toggle('reading',a.hash==='#'+e.target.id));},{rootMargin:'-10% 0px -65% 0px'});sections.forEach(s=>observer.observe(s));}
})();
