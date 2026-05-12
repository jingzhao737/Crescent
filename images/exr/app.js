/* ═══════════════════════════════════════════
   PORTFOLIO — APP JS v8 · LATCH SYSTEM
   ═══════════════════════════════════════════ */

// ═══════════ THEME (global) ═══════════
let isLight = false;
(function initTheme() {
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.add('light');
    isLight = true;
  }
  let btn = document.getElementById('themeToggle');
  let wrapper = document.getElementById('themePullWrapper');
  let stringEl = document.getElementById('themePullString');
  if (!btn) return;

  // ── Web Audio API sound synth ──
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }
  function playTick(rate, vol) {
    if (!audioCtx) return;
    let t = audioCtx.currentTime;
    let osc = audioCtx.createOscillator();
    let gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2800 * rate, t);
    osc.frequency.exponentialRampToValueAtTime(400 * rate, t + 0.06);
    gain.gain.setValueAtTime(vol || 0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t); osc.stop(t + 0.08);
  }
  function playClick() { playTick(1, 0.15); }
  function playBounce() { playTick(0.65, 0.08); }

  let dragEnd = 40;
  let threshold = 60;
  let maxPull = 100;
  let resistance = 0.2;
  let dragging = false, startY = 0, pullY = 0, toggled = false;
  let inMotion = false;

  function setPull(v) {
    let raw = Math.max(0, v);
    if (raw <= dragEnd) {
      pullY = raw;
    } else {
      pullY = dragEnd + (raw - dragEnd) * resistance;
    }
    pullY = Math.min(pullY, maxPull);

    wrapper.style.transform = 'translateX(-50%) translateY(' + pullY + 'px)';
    stringEl.style.height = (pullY + 14) + 'px';
    if (pullY >= dragEnd && !toggled) {
      btn.style.borderColor = 'var(--accent)';
      btn.style.boxShadow = '0 0 16px var(--accent-glow)';
    } else if (pullY < dragEnd) {
      btn.style.borderColor = '';
      btn.style.boxShadow = '';
    }
    if (pullY >= threshold && !toggled) {
      toggled = true;
      doToggle();
      playClick();
      dragging = false;
      springBack();
    }
  }

  function springBack() {
    inMotion = true;
    wrapper.style.transition = 'transform .7s cubic-bezier(.34,1.56,.64,1)';
    stringEl.style.transition = 'height .7s cubic-bezier(.34,1.56,.64,1)';
    btn.style.transition = 'border-color .3s, box-shadow .3s';
    setPull(0);
    btn.style.borderColor = '';
    btn.style.boxShadow = '';
    setTimeout(function() {
      wrapper.style.transition = '';
      stringEl.style.transition = '';
      btn.style.transition = '';
      inMotion = false;
    }, 750);
  }

  function bounceBack() {
    let bounceY = pullY;
    inMotion = true;
    // Animate back with a nice spring — overshoot then settle
    wrapper.style.transition = 'transform .65s cubic-bezier(.34,1.56,.64,1)';
    stringEl.style.transition = 'height .65s cubic-bezier(.34,1.56,.64,1)';
    btn.style.transition = 'border-color .3s, box-shadow .3s';
    setPull(0);
    btn.style.borderColor = '';
    btn.style.boxShadow = '';
    playBounce();
    setTimeout(function() {
      wrapper.style.transition = '';
      stringEl.style.transition = '';
      btn.style.transition = '';
      inMotion = false;
    }, 700);
  }

  function doToggle() {
    document.documentElement.classList.toggle('light');
    isLight = !isLight;
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }

  function onStart(e) {
    if (dragging || inMotion) return;
    initAudio();
    dragging = true; toggled = false;
    e.preventDefault();
    wrapper.style.transition = 'none';
    stringEl.style.transition = 'none';
    btn.style.transition = 'none';
    btn.style.borderColor = '';
    btn.style.boxShadow = '';
    startY = e.touches ? e.touches[0].clientY : e.clientY;
  }

  function onMove(e) {
    if (!dragging) return;
    e.preventDefault();
    let y = e.touches ? e.touches[0].clientY : e.clientY;
    let dy = y - startY;
    setPull(dy);
  }

  function onEnd(e) {
    if (!dragging) return;
    dragging = false;
    if (pullY > 0 && !toggled) {
      bounceBack();
    } else if (!inMotion) {
      springBack();
    }
  }

  setPull(0);
  stringEl.style.height = '14px';

  [wrapper, btn].forEach(function(el) {
    el.addEventListener('mousedown', onStart);
    el.addEventListener('touchstart', onStart, { passive: false });
  });
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchend', onEnd);
})();


let workData = {
  flux: {
    name: 'JingZhao737', tag: 'Abstract \u00b7 Color Field',
    subtitle: 'Oil on canvas. An exploration of chromatic tension and release.',
    meta: { Medium: 'Oil on Canvas', Dimensions: '1280 \u00d7 720 px', Year: '2026' },
    content: [
      { h2: 'About This Work', p: 'Chromatic Flux is the culmination of a year-long investigation into how adjacent hues interact at their boundaries. The painting uses over forty individually mixed oil pigments, applied in thin, translucent layers that build depth through optical blending rather than physical mixing.' },
      { h2: 'Process', p: 'Each layer required three to five days of drying time. The painting evolved slowly, with earlier layers influencing\u2014but not dictating\u2014later decisions. This deliberate pace allowed the color relationships to develop organically, almost geologically.' },
      { h2: 'Context', p: 'This piece is part of the ongoing Chromatic Series, which examines color not as a property of objects but as a phenomenon in itself\u2014something to be experienced directly, without the mediation of representation.' }
    ],
    gallery: ['images/detail/g1-1.jpg', 'images/detail/g1-2.jpg']
  },
  silence: {
    name: 'Star', tag: 'Digital \u00b7 Minimal',
    subtitle: 'A digital meditation on negative space and quiet intensity.',
    meta: { Medium: 'Digital Painting', Dimensions: '3440 \u00d7 2880 px', Year: '2025' },
    content: [
      { h2: 'About This Work', p: 'The Shape of Silence began as an experiment in restraint. How much can you remove from an image before it loses its voice? The answer, I discovered, is almost everything\u2014as long as what remains is placed with absolute conviction.' },
      { h2: 'Process', p: 'Created entirely in a digital environment, this piece went through over sixty iterations. Each version stripped away another element until only the essential forms remained. The final composition uses just three distinct values.' },
      { h2: 'Context', p: 'This work was featured in the 2025 Digital Arts Biennale and later acquired by a private collector in Berlin. It represents a turning point in my digital practice toward greater economy of means.' }
    ],
    gallery: ['images/detail/g1-1.jpg', 'images/detail/g1-2.jpg']
  },
  neon: {
    name: 'Blade Runner', tag: 'Installation \u00b7 Light Art',
    subtitle: 'Acrylic, LED, and the ritual of artificial light.',
    meta: { Medium: 'Acrylic & LED Installation', Dimensions: '2580 \u00d7 1080 px', Year: '2024' },
    content: [
      { h2: 'About This Work', p: 'Neon Liturgy transforms a gallery wall into a luminous altar. Seven individually programmed LED strips respond to ambient sound, creating a constantly shifting composition that never repeats.' },
      { h2: 'Process', p: 'The acrylic panels were cast by hand, each with a unique surface texture that scatters light differently. The LEDs are controlled by a custom microcontroller running a generative algorithm that samples room tone and conversation fragments.' },
      { h2: 'Context', p: 'Originally commissioned for a group show exploring the intersection of technology and ritual, Neon Liturgy has since been adapted for three different venues, each time responding to the unique acoustic profile of its new environment.' }
    ],
    gallery: ['images/detail/g1-1.jpg', 'images/detail/g1-2.jpg']
  },
  tidal: {
    name: 'Breath', tag: 'Projection \u00b7 Site-Specific',
    subtitle: 'An ephemeral intervention mapping memory onto urban surfaces.',
    meta: { Medium: 'Projection Mapping', Dimensions: '2580 \u00d7 1080 px', Year: '2023' },
    content: [
      { h2: 'About This Work', p: 'Tidal Memory is a site-specific projection piece that maps historical imagery onto the facade of a decommissioned riverside warehouse. The projected images rise and fall in intensity, synchronized with real-time tidal data from the adjacent river.' },
      { h2: 'Process', p: 'The projection mapping was developed using lidar scans of the building surface, allowing the imagery to conform precisely to every brick and window frame. The real-time data connection to tidal sensors means no two viewings are ever identical.' },
      { h2: 'Context', p: 'Commissioned for the 2023 Riverside Art Festival, Tidal Memory ran for three nights and was experienced by over 15,000 visitors. Documentation of the piece was later exhibited as a multi-channel video installation.' }
    ],
    gallery: ['images/detail/g1-1.jpg', 'images/detail/g1-2.jpg']
  }
};

// ═══════════ WORK HERO MAP (slug → hero image) ═══════════
let workHeroMap = {
  flux: 'images/works/hero1.jpg',
  silence: 'images/works/hero2.jpg',
  neon: 'images/works/hero3.jpg',
  tidal: 'images/works/hero4.jpg'
};

// ═══════════ CURSOR ═══════════
let cursorDot = document.getElementById('cursorDot');
let cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, cX = 0, cY = 0, rX = 0, rY = 0;

document.addEventListener('mousemove', function(e) { mouseX = e.clientX; mouseY = e.clientY; });
document.addEventListener('mouseleave', function() { cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0'; });
document.addEventListener('mouseenter', function() { cursorDot.style.opacity = ''; cursorRing.style.opacity = ''; });

(function loop() {
  cX += (mouseX - cX) * 0.2; cY += (mouseY - cY) * 0.2;
  rX += (mouseX - rX) * 0.06; rY += (mouseY - rY) * 0.06;
  cursorDot.style.left = (cX - 3.5) + 'px'; cursorDot.style.top = (cY - 3.5) + 'px';
  cursorRing.style.left = (rX - 16) + 'px'; cursorRing.style.top = (rY - 16) + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a, .work-card, .footer-cta, .detail-close, button').forEach(function(el) {
  el.addEventListener('mouseenter', function() { cursorDot.classList.add('expanded'); });
  el.addEventListener('mouseleave', function() { cursorDot.classList.remove('expanded'); });
});

// ═══════════ LOADING ═══════════
(function() {
  let numEl = document.getElementById('loaderNumber');
  let bar = document.getElementById('loaderBar');
  let loaderEl = document.getElementById('loader');
  if (!numEl || !loaderEl) { revealCrescent(); if (loaderEl) loaderEl.style.display = 'none'; document.body.style.cursor = 'none'; return; }

  let total = 50, count = 0;
  let iv = setInterval(function() {
    count++;
    let raw = count / total;
    let eased = 1 - Math.pow(1 - raw, 3);
    let num = Math.floor(eased * 100);
    numEl.innerHTML = num + '<span class="pct">%</span>';
    if (bar) bar.style.width = (eased * 100) + '%';

    if (count >= total) {
      clearInterval(iv);
      numEl.innerHTML = '100<span class="pct">%</span>';
      if (bar) bar.style.width = '100%';
      setTimeout(function() {
        loaderEl.classList.add('hide');
        revealCrescent();
        setTimeout(function() { loaderEl.style.display = 'none'; document.body.style.cursor = 'none'; }, 800);
      }, 300);
    }
  }, 32);

  function revealCrescent() {
    document.querySelectorAll('.cr-char').forEach(function(el) {
      el.classList.add('revealed');
    });
  }
})();

// ═══════════ NAVIGATION ═══════════
let nav = document.getElementById('nav'), navLinks = document.querySelectorAll('.nav-links a');
let pageTransition = document.getElementById('pageTransition'), workDetail = document.getElementById('workDetail');

new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) nav.classList.remove('scrolled'); else nav.classList.add('scrolled'); });
}, { threshold: [0, 0.1] }).observe(document.getElementById('home'));

['home', 'work', 'showcase', 'motion', 'poetry', 'about'].forEach(function(id) {
  let el = document.getElementById(id); if (!el) return;
  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      navLinks.forEach(function(a) { a.classList.remove('active'); });
      let link = document.querySelector('.nav-links a[data-link="' + id + '"]');
      if (link) link.classList.add('active');
    }
  }, { threshold: 0.3, rootMargin: '-20% 0px -60% 0px' }).observe(el);
});

document.querySelectorAll('a[data-link]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    let target = document.getElementById(a.dataset.link); if (!target) return;
    pageTransition.classList.add('active'); setTimeout(function() { pageTransition.classList.remove('active'); }, 1000);
    let top = a.dataset.link === 'home' ? 0 : target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: top, behavior: 'smooth' });
    if (workDetail.classList.contains('open')) closeDetail();
  });
});

// ═══════════ HOVER PREVIEW (desktop only) ═══════════
(function() {
  if ('ontouchstart' in window) return;
  let imgs = [], activeImg = null, targetX = 0, targetY = 0, currentX = 0, currentY = 0;

  document.querySelectorAll('.work-card').forEach(function(card) {
    let img = document.createElement('img');
    img.className = 'work-preview'; img.src = card.dataset.image; img.alt = ''; img.draggable = false; img.loading = 'lazy'; img.decoding = 'async';
    document.body.appendChild(img);
    imgs.push({ card: card, img: img });

    card.addEventListener('mouseenter', function() {
      activeImg = img;
      for (let j = 0; j < imgs.length; j++) imgs[j].img.classList.remove('visible');
      img.classList.add('visible');
      currentX = targetX; currentY = targetY;
    });
    card.addEventListener('mousemove', function(e) {
      if (activeImg === img) { targetX = e.clientX + 28; targetY = e.clientY - 120; }
    });
    card.addEventListener('mouseleave', function() {
      if (activeImg === img) activeImg = null;
      img.classList.remove('visible');
    });
  });

  (function animateHover() {
    if (activeImg) {
      let dx = targetX - currentX, dy = targetY - currentY;
      currentX += dx * 0.12; currentY += dy * 0.12;
      activeImg.style.left = currentX + 'px'; activeImg.style.top = currentY + 'px';
    }
    requestAnimationFrame(animateHover);
  })();
})();

// ═══════════ PARALLAX SHOWCASE — hover tilt + drag + spring return ═══════════
(function() {
  let items = document.querySelectorAll('.showcase-item[data-parallax]');
  if (items.length === 0) return;

  let states = [];
  let activeDrag = null; // which state is being dragged
  for (let i = 0; i < items.length; i++) {
    let bg = items[i].querySelector('.showcase-bg');
    if (!bg) continue;
    states.push({ el: bg, item: items[i], tx: 0, ty: 0, stx: 0, sty: 0, cx: 0, cy: 0, vx: 0, vy: 0, hover: false, dx: 0, dy: 0 });
  }

  function isInside(rect, mx, my) {
    return mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom;
  }

  let lastMouseX = 0, lastMouseY = 0;
  document.addEventListener('mousemove', function(e) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    let mx = e.clientX, my = e.clientY;
    for (let i = 0; i < states.length; i++) {
      let s = states[i];
      let rect = s.item.getBoundingClientRect();
      let inside = isInside(rect, mx, my);
      s.hover = inside;
      if (inside) {
        let relX = (mx - rect.left) / rect.width - 0.5;
        let relY = (my - rect.top) / rect.height - 0.5;
        s.stx = relX * 30;
        s.sty = relY * 28;
      } else {
        s.stx = 0;
        s.sty = 0;
      }
    }
    // Drag
    if (activeDrag) {
      let s = activeDrag;
      let rawX = mx - s.startX, rawY = my - s.startY;
      // Progressive resistance — harder to drag the farther you go
      let mag = Math.sqrt(rawX * rawX + rawY * rawY);
      let factor = mag > 50 ? 1 / (1 + (mag - 50) * 0.015) : 1;
      s.dx = rawX * factor;
      s.dy = rawY * factor;
    }
  });

  document.addEventListener('mousedown', function(e) {
    for (let i = 0; i < states.length; i++) {
      let rect = states[i].item.getBoundingClientRect();
      if (isInside(rect, e.clientX, e.clientY)) {
        activeDrag = states[i];
        activeDrag.startX = e.clientX - activeDrag.dx;
        activeDrag.startY = e.clientY - activeDrag.dy;
        e.preventDefault();
        break;
      }
    }
  });

  document.addEventListener('mouseup', function() {
    activeDrag = null;
  });

  (function loop() {
    for (let i = 0; i < states.length; i++) {
      let s = states[i];
      let rect = s.item.getBoundingClientRect();
      let vh = window.innerHeight;
      if (rect.bottom < -200 || rect.top > vh + 200) continue;
      // Recalculate stx/sty every frame (fixes tilt lost on scroll)
      let inside = isInside(rect, lastMouseX, lastMouseY);
      s.hover = inside;
      if (inside) {
        let relX = (lastMouseX - rect.left) / rect.width - 0.5;
        let relY = (lastMouseY - rect.top) / rect.height - 0.5;
        s.stx = relX * 30;
        s.sty = relY * 28;
      } else {
        s.stx = 0;
        s.sty = 0;
      }
      // Drag spring return to 0 when not actively dragging
      if (s !== activeDrag) {
        let dk = 0.1, ddamp = 0.74;
        s.vx += (0 - s.dx) * dk;
        s.vy += (0 - s.dy) * dk;
        s.vx *= ddamp;
        s.vy *= ddamp;
        s.dx += s.vx;
        s.dy += s.vy;
        if (Math.abs(s.dx) < 0.05 && Math.abs(s.dy) < 0.05 && Math.abs(s.vx) < 0.03 && Math.abs(s.vy) < 0.03) {
          s.dx = 0; s.dy = 0; s.vx = 0; s.vy = 0;
        }
      }
      // Smooth target tracking — lerp tx/ty toward stx/sty (fast response)
      s.tx += (s.stx - s.tx) * 0.22;
      s.ty += (s.sty - s.ty) * 0.22;
      // Hover spring — smooth, no bounce
      let k = 0.06, damp = 0.88;
      s.cx += (s.tx - s.cx) * k;
      s.cy += (s.ty - s.cy) * k;
      s.cx *= damp;
      s.cy *= damp;
      let totalX = s.cx + s.dx;
      let totalY = s.cy + s.dy;
      // Snap when settled near 0
      if (s.stx === 0 && s.sty === 0 && s.dx === 0 && s.dy === 0 && Math.abs(s.cx) < 0.08 && Math.abs(s.cy) < 0.08) {
        s.cx = 0; s.cy = 0;
        s.item.style.transform = 'perspective(1000px) rotateX(0)';
      }
      let d = Math.sqrt(totalX * totalX + totalY * totalY);
      let scale = 1 + d * 0.004;
      s.el.style.transform = 'translate(' + totalX + 'px,' + totalY + 'px) scale(' + scale + ')';
      // Tilt from hover — mouse side sinks in (depressed)
      let rx = -(s.cy * 4.5);
      s.item.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg)';
    }
    requestAnimationFrame(loop);
  })();
})();

// ═══════════ SCROLL REVEAL ═══════════
let revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('anim-done'); });
}, { threshold: 0.04, rootMargin: '0px 0px -16px 0px' });
document.querySelectorAll('.anim-up').forEach(function(el) { revealObserver.observe(el); });

// ═══════════ FOOTER CTA REVEAL ═══════════
let footerCta = document.getElementById('footerCta');
if (footerCta) {
  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) footerCta.classList.add('revealed');
  }, { threshold: 0.3 }).observe(footerCta);
}

// ═══════════ COUNTER ANIMATION ═══════════
let counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      let el = entry.target; if (el._counted) return; el._counted = true;
      let target = parseInt(el.dataset.count, 10);
      let suffixEl = el.querySelector('span'), suffix = suffixEl ? suffixEl.textContent : '';
      let duration = 1600, start = null;
      (function step(ts) {
        if (!start) start = ts;
        let progress = Math.min((ts - start) / duration, 1), eased = 1 - Math.pow(1 - progress, 4);
        el.innerHTML = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      })(0);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-num[data-count]').forEach(function(el) { counterObserver.observe(el); });

// ═══════════ POETRY MOSAIC ═══════════
(function() {
  const grid = document.getElementById('poetryGrid');
  if (!grid) return;
  const text = "Do not go gentle into that good night. Rage, rage against the dying of the light.";
  const chars = text.split('');
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === ' ') {
      // Render space as a subtle empty card
      const card = document.createElement('div');
      card.className = 'poetry-card poetry-space anim-up';
      card.innerHTML = '<span class="poetry-char">&nbsp;</span>';
      card.style.setProperty('--stagger-delay', (i * 0.015) + 's');
      grid.appendChild(card);
    } else {
      const card = document.createElement('div');
      card.className = 'poetry-card anim-up';
      card.innerHTML = '<span class="poetry-char">' + ch + '</span>';
      card.style.setProperty('--stagger-delay', (i * 0.015) + 's');
      grid.appendChild(card);
    }
  }
  // Trigger stagger animation via IntersectionObserver
  const obs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      const cards = grid.querySelectorAll('.poetry-card');
      cards.forEach(function(c, i) {
        setTimeout(function() { c.classList.add('anim-done'); }, i * 15);
      });
      obs.disconnect();
    }
  }, { threshold: 0.2 });
  obs.observe(grid);

  // ── Proximity-based 3D tilt + color (exponential smooth, no jitter) ──
  const cards = Array.from(grid.querySelectorAll('.poetry-card'));
  if (!cards.length) return;

  const CARD_SIZE = 64;
  const THRESHOLD = CARD_SIZE * 1.8;

  // Per-card current rendered state (exponential moving average toward target)
  const state = cards.map(() => ({ e: 0, rx: 0, ry: 0 }));
  let targetE = cards.map(() => 0);
  let targetRX = cards.map(() => 0);
  let targetRY = cards.map(() => 0);

  const SPEED_COLOR = 0.06;   // color/shadow follow speed (slower → more delay)
  const SPEED_TILT = 0.12;    // tilt follow speed (slower → more delay)
  const SPEED_RESET = 0.04;   // reset speed when mouse leaves (slower → longer fade out)

  let running = false;

  grid.addEventListener('mousemove', function(e) {
    cards.forEach(function(card, i) {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const t = Math.max(0, 1 - dist / THRESHOLD);
      targetE[i] = t * t;
      targetRX[i] = -(dy / (rect.height / 2)) * targetE[i] * 28;
      targetRY[i] = (dx / (rect.width / 2)) * targetE[i] * 22;
    });
    if (!running) { running = true; smoothLoop(); }
  });

  grid.addEventListener('mouseleave', function() {
    for (let i = 0; i < cards.length; i++) {
      targetE[i] = 0;
      targetRX[i] = 0;
      targetRY[i] = 0;
    }
    if (!running) { running = true; smoothLoop(); }
  });

  function smoothLoop() {
    let anyActive = false;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const s = state[i];

      // Exponential moving average toward target
      const spd = targetE[i] > 0.01 ? SPEED_COLOR : SPEED_RESET;
      s.e += (targetE[i] - s.e) * spd;
      s.rx += (targetRX[i] - s.rx) * SPEED_TILT;
      s.ry += (targetRY[i] - s.ry) * SPEED_TILT;

      const e = s.e;
      if (e < 0.0005 && targetE[i] === 0) { s.e = 0; s.rx = 0; s.ry = 0; }

      if (s.e < 0.0005) {
        card.style.background = '';
        card.style.borderColor = '';
        card.style.boxShadow = '';
        card.style.transform = '';
        card.classList.remove('active');
        const ch = card.querySelector('.poetry-char');
        if (ch) { ch.style.color = ''; ch.style.transform = ''; ch.style.filter = ''; }
        continue;
      }

      anyActive = true;
      const re = s.e;

      // Color blend
      card.style.background = 'rgb(' + Math.round(16 + re * 239) + ',' + Math.round(20 + re * 121) + ',' + Math.round(25 + re * 65) + ')';
      card.style.borderColor = 'rgb(' + Math.round(38 + re * 217) + ',' + Math.round(38 + re * 134) + ',' + Math.round(42 + re * 78) + ')';
      card.style.boxShadow = '0 ' + (4 + re * 16).toFixed(1) + 'px ' + (10 + re * 30).toFixed(1) + 'px rgba(212,108,60,' + (re * 0.35).toFixed(2) + ')';
      card.style.transform = 'perspective(300px) rotateX(' + s.rx.toFixed(2) + 'deg) rotateY(' + s.ry.toFixed(2) + 'deg) translateZ(' + (re * 6).toFixed(1) + 'px) scale(' + (1 + re * 0.2).toFixed(2) + ')';
      card.classList.add('active');

      const ch = card.querySelector('.poetry-char');
      if (ch) {
        ch.style.color = re > 0.5 ? '#fff' : '';
        ch.style.transform = 'scale(' + (1 + re * 0.3).toFixed(2) + ')';
        ch.style.filter = re > 0.3 ? 'drop-shadow(0 0 ' + (re * 12).toFixed(0) + 'px rgba(255,255,255,' + (re * 0.5).toFixed(2) + '))' : 'none';
      }
    }
    // Only keep looping while cards are active (energy saving when idle)
    if (anyActive) requestAnimationFrame(smoothLoop);
    else running = false;
  }
})();

// ═══════════ WORK DETAIL ═══════════
document.querySelectorAll('.work-card').forEach(function(card) {
  // Keyboard accessibility
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');

  function openCard() {
    let key = card.dataset.work; if (!workData[key]) return;
    let data = Object.assign({ slug: key }, workData[key]);
    openDetail(data, card.dataset.hero);
  }

  card.addEventListener('click', openCard);
  card.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCard();
    }
  });
});

// ═══════════ HASH ROUTER ═══════════
const ROUTE_PREFIX = '#/work/';
let detailOpenedFromHash = false;
let savedScrollY = 0;

function buildGalleryHTML(gallery) {
  if (!gallery || !gallery.length) return '';
  // Determine layout class based on count
  let layoutClass = '';
  if (gallery.length === 1) layoutClass = 'layout-1';
  else if (gallery.length === 2) layoutClass = 'layout-2';
  else if (gallery.length === 3) layoutClass = 'layout-3';
  else if (gallery.length === 4) layoutClass = 'layout-4';
  else if (gallery.length === 5) layoutClass = 'layout-5';
  else layoutClass = 'layout-masonry';

  let html = '<div class="detail-gallery ' + layoutClass + '">';
  for (let i = 0; i < gallery.length; i++) {
    const item = gallery[i];
    const src = typeof item === 'string' ? item : item.src;
    const caption = typeof item === 'string' ? '' : (item.caption || '');
    const desc = typeof item === 'string' ? '' : (item.desc || '');
    html += '<div class="gal-item" data-index="' + i + '">';
    html += '<div class="skeleton"></div>';
    html += '<img src="' + src + '" alt="' + (caption || 'gallery image') + '" loading="lazy" onload="this.classList.add(\'loaded\');this.previousElementSibling.style.display=\'none\'">';
    if (caption) html += '<div class="gal-caption"><div class="gal-caption-title">' + caption + '</div>' + (desc ? '<div class="gal-caption-desc">' + desc + '</div>' : '') + '</div>';
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function renderDetailContent(data, heroImg) {
  document.getElementById('detailTag').textContent = data.tag;
  document.getElementById('detailTitle').textContent = data.name;
  document.getElementById('detailSubtitle').textContent = data.subtitle;
  // Hero with skeleton
  const heroEl = document.getElementById('detailHeroImg');
  const heroSkeleton = document.getElementById('detailHeroSkeleton');
  if (heroSkeleton) { heroSkeleton.classList.remove('hidden'); }
  heroEl.onload = function() {
    if (heroSkeleton) { heroSkeleton.classList.add('hidden'); }
  };
  heroEl.src = heroImg;
  document.getElementById('detailMeta').innerHTML = Object.keys(data.meta).map(function(k) {
    return '<div class="detail-meta-item"><span class="detail-meta-label">' + k + '</span><span class="detail-meta-value">' + data.meta[k] + '</span></div>';
  }).join('');
  document.getElementById('detailContent').innerHTML = data.content.map(function(s) {
    return '<h2>' + s.h2 + '</h2><p>' + s.p + '</p>';
  }).join('');
  document.getElementById('detailGallery').innerHTML = buildGalleryHTML(data.gallery);
}

function openDetail(data, heroImg, pushState) {
  if (pushState === undefined) pushState = true;
  savedScrollY = window.scrollY;
  if (pushState && data.slug) {
    history.pushState({ work: data.slug }, '', ROUTE_PREFIX + data.slug);
  }
  renderDetailContent(data, heroImg);
  pageTransition.classList.add('active'); setTimeout(function() { pageTransition.classList.remove('active'); }, 1000);
  document.body.style.overflow = 'hidden'; workDetail.style.display = 'block'; workDetail.scrollTop = 0;
  requestAnimationFrame(function() {
    workDetail.classList.add('open');
    // Init lightbox click handlers
    initGalleryLightbox();
  });
}

function closeDetail(popState) {
  workDetail.classList.remove('open');
  if (popState) {
    history.replaceState(null, '', ' ' + window.location.pathname + location.hash.replace(ROUTE_PREFIX, '#work'));
  }
  setTimeout(function() {
    workDetail.style.display = 'none'; document.body.style.overflow = '';
    window.scrollTo({ top: savedScrollY, behavior: 'instant' });
  }, 700);
}

// Lightbox
let lightboxIndex = 0, lightboxItems = [];

function initGalleryLightbox() {
  const items = workDetail.querySelectorAll('.gal-item');
  items.forEach(function(item, idx) {
    item.onclick = function() { openLightbox(idx); };
  });
}

function openLightbox(index) {
  const items = workDetail.querySelectorAll('.gal-item img');
  lightboxItems = Array.from(items).map(img => img.src);
  lightboxIndex = index;
  const lb = document.getElementById('galleryLightbox');
  if (!lb) return;
  lb.querySelector('.lightbox-img').src = lightboxItems[index];
  lb.querySelector('.lightbox-counter').textContent = (index + 1) + ' / ' + lightboxItems.length;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('galleryLightbox');
  if (!lb) return;
  lb.classList.remove('open');
  if (!workDetail.classList.contains('open')) document.body.style.overflow = '';
}

function lightboxPrev() {
  if (lightboxItems.length === 0) return;
  lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
  const lb = document.getElementById('galleryLightbox');
  lb.querySelector('.lightbox-img').src = lightboxItems[lightboxIndex];
  lb.querySelector('.lightbox-counter').textContent = (lightboxIndex + 1) + ' / ' + lightboxItems.length;
}

function lightboxNext() {
  if (lightboxItems.length === 0) return;
  lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
  const lb = document.getElementById('galleryLightbox');
  lb.querySelector('.lightbox-img').src = lightboxItems[lightboxIndex];
  lb.querySelector('.lightbox-counter').textContent = (lightboxIndex + 1) + ' / ' + lightboxItems.length;
}

// Hash router event listeners
window.addEventListener('popstate', function(e) {
  const hash = window.location.hash;
  if (hash.startsWith(ROUTE_PREFIX) && e.state && e.state.work) {
    const slug = e.state.work;
    const data = workData[slug];
    if (data) {
      const dataWithSlug = Object.assign({ slug: slug }, data);
      const heroImg = workHeroMap[slug] || (data.gallery && data.gallery.length ? (typeof data.gallery[0] === 'string' ? data.gallery[0] : data.gallery[0].src) : '');
      openDetail(dataWithSlug, heroImg, false);
    }
  } else if (workDetail.classList.contains('open')) {
    closeDetail(false);
  }
});

// Check URL on page load
window.addEventListener('load', function() {
  const hash = window.location.hash;
  if (hash.startsWith(ROUTE_PREFIX)) {
    const slug = hash.slice(ROUTE_PREFIX.length);
    const data = workData[slug];
    if (data) {
      const dataWithSlug = Object.assign({ slug: slug }, data);
      const heroImg = workHeroMap[slug] || (data.gallery && data.gallery.length ? (typeof data.gallery[0] === 'string' ? data.gallery[0] : data.gallery[0].src) : '');
      setTimeout(function() { openDetail(dataWithSlug, heroImg, false); }, 500);
    }
  }
});

document.getElementById('detailClose').addEventListener('click', function() { closeDetail(true); });

// Lightbox bindings — run after DOM ready
document.addEventListener('DOMContentLoaded', function() {
  const lbClose = document.querySelector('.lightbox-close');
  const lbPrev = document.querySelector('.lightbox-nav-prev');
  const lbNext = document.querySelector('.lightbox-nav-next');
  const lb = document.querySelector('.gallery-lightbox');
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', lightboxPrev);
  if (lbNext) lbNext.addEventListener('click', lightboxNext);
  if (lb) lb.addEventListener('click', function(e) { if (e.target === e.currentTarget) closeLightbox(); });
});

document.addEventListener('keydown', function(e) {
  const lb = document.getElementById('galleryLightbox');
  if (lb && lb.classList.contains('open')) {
    if (e.key === 'Escape') { closeLightbox(); return; }
    if (e.key === 'ArrowLeft') { lightboxPrev(); return; }
    if (e.key === 'ArrowRight') { lightboxNext(); return; }
    return;
  }
  if (e.key === 'Escape' && workDetail.classList.contains('open')) { closeDetail(true); return; }
  if (workDetail.classList.contains('open')) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' }); }
  if (e.key === 'ArrowUp') { e.preventDefault(); window.scrollBy({ top: -window.innerHeight * 0.7, behavior: 'smooth' }); }
});

// Pinch zoom for lightbox (mobile)
(function() {
  const lb = document.getElementById('galleryLightbox');
  if (!lb) return;
  const img = lb.querySelector('.lightbox-img');
  if (!img) return;
  let startDist = 0, startScale = 1, currentScale = 1;
  let offsetX = 0, offsetY = 0, startOffsetX = 0, startOffsetY = 0;
  let isPinching = false;
  const MIN_SCALE = 1, MAX_SCALE = 4;

  function getDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  function applyTransform() {
    img.style.transform = 'translate(' + offsetX + 'px,' + offsetY + 'px) scale(' + currentScale + ')';
    img.style.transition = isPinching ? 'none' : 'transform .35s var(--ease-out-expo)';
  }

  function resetZoom() {
    currentScale = 1; offsetX = 0; offsetY = 0;
    img.style.transition = 'transform .35s var(--ease-out-expo)';
    applyTransform();
  }

  // Reset on close
  lb.addEventListener('click', function(e) {
    if (e.target === e.currentTarget || e.target.classList.contains('lightbox-close')) {
      resetZoom();
    }
  });
  document.querySelector('.lightbox-close').addEventListener('click', resetZoom);

  img.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      isPinching = true;
      startDist = getDist(e.touches);
      startScale = currentScale;
      startOffsetX = offsetX;
      startOffsetY = offsetY;
    }
  }, { passive: false });

  img.addEventListener('touchmove', function(e) {
    if (e.touches.length !== 2 || !isPinching) return;
    e.preventDefault();
    const dist = getDist(e.touches);
    currentScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, startScale * (dist / startDist)));
    // Keep offset proportional
    offsetX = startOffsetX * (currentScale / startScale);
    offsetY = startOffsetY * (currentScale / startScale);
    applyTransform();
  }, { passive: false });

  img.addEventListener('touchend', function(e) {
    if (!isPinching) return;
    isPinching = false;
    if (e.touches.length < 2) {
      if (currentScale < 1.05) resetZoom();
    }
  });

  // Double-tap to toggle zoom
  let lastTap = 0;
  img.addEventListener('click', function(e) {
    const now = Date.now();
    if (now - lastTap < 300) {
      e.preventDefault();
      if (currentScale > 1.5) resetZoom();
      else { currentScale = 2.5; offsetX = 0; offsetY = 0; applyTransform(); }
    }
    lastTap = now;
  });

  // Close/reset on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && currentScale > 1) { resetZoom(); }
  });
})();
workDetail.addEventListener('wheel', function(e) {
  e.stopPropagation();
  let atTop = workDetail.scrollTop <= 0, atBottom = workDetail.scrollTop + workDetail.clientHeight >= workDetail.scrollHeight - 2;
  if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) e.preventDefault();
}, { passive: false });

// ═══════════ MOTION / VIDEO CAROUSEL ═══════════
(function() {
  let hero = document.getElementById('motionHero');
  let track = document.getElementById('motionTrack');
  if (!track || !hero) return;
  let slides = track.querySelectorAll('.motion-slide');
  let videos = track.querySelectorAll('video');
  let current = 0, total = slides.length;
  let isDragging = false, startX = 0, dragged = false;

  // offset = (i - current + total) % total, then wrap to [-floor(total/2), floor(total/2)]
  function applyOffsets() {
    for (let i = 0; i < total; i++) {
      let raw = (i - current + total) % total;
      // Map to nearest: if raw > total/2 then raw - total for negative side
      let offset = raw > total / 2 ? raw - total : raw;
      slides[i].setAttribute('data-offset', offset);
    }
  }

  // Always shift right (new slide enters from right)
  function next() {
    if (total < 2) return;
    current = (current + 1) % total;
    applyOffsets();
    playCurrent();
  }

  function prev() {
    if (total < 2) return;
    current = (current - 1 + total) % total;
    applyOffsets();
    playCurrent();
  }

  function playCurrent() {
    for (let j = 0; j < videos.length; j++) {
      if (j === current) { videos[j].currentTime = 0; videos[j].play().catch(function(){}); }
      else { videos[j].pause(); videos[j].currentTime = 0; }
    }
  }

  // Video ended -> auto next
  for (let v = 0; v < videos.length; v++) {
    videos[v].addEventListener('ended', function() {
      next();
    });
  }

  // Drag / swipe — right-to-left drag = next(), left-to-right = prev()
  let onDown = function(e) {
    isDragging = true; startX = e.clientX || (e.touches && e.touches[0].clientX); dragged = false;
    hero.classList.add('dragging');
  };
  let onMove = function(e) {
    if (!isDragging) return;
    let mx = e.clientX || (e.touches && e.touches[0].clientX);
    if (Math.abs(mx - startX) > 8) dragged = true;
  };
  let onUp = function(e) {
    if (!isDragging) return;
    isDragging = false;
    hero.classList.remove('dragging');
    if (!dragged) return;
    let mx = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    if (startX - mx > 50) next();       // dragged left = next
    else if (mx - startX > 50) prev();  // dragged right = prev
  };
  hero.addEventListener('mousedown', onDown);
  hero.addEventListener('mousemove', onMove);
  hero.addEventListener('mouseup', onUp);
  hero.addEventListener('mouseleave', function() {
    if (isDragging) { isDragging = false; hero.classList.remove('dragging'); }
  });
  hero.addEventListener('touchstart', onDown, { passive: true });
  hero.addEventListener('touchmove', onMove, { passive: true });
  hero.addEventListener('touchend', onUp);

  // Keyboard — ArrowLeft=prev, ArrowRight=next (natural direction)
  document.addEventListener('keydown', function(e) {
    if (workDetail && workDetail.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Init
  applyOffsets();
  tryPlay(current);

  // Auto-play active when in view, with fallback play button for mobile
  function tryPlay(idx) {
    let p = videos[idx].play();
    if (p && p.then) {
      p.then(function() {
        // Success: hide any fallback button
        let btn = slides[idx].querySelector('.motion-play-btn');
        if (btn) btn.classList.remove('show');
      }).catch(function() {
        // Autoplay blocked: show fallback play button
        let existing = slides[idx].querySelector('.motion-play-btn');
        let btn;
        if (existing) {
          btn = existing;
        } else {
          btn = document.createElement('button');
          btn.className = 'motion-play-btn';
          btn.setAttribute('aria-label', 'Play video');
          slides[idx].appendChild(btn);
        }
        btn.classList.add('show');
      });
    }
  }

  // Delegate clicks on play buttons
  track.addEventListener('click', function(e) {
    let btn = e.target.closest('.motion-play-btn');
    if (!btn) return;
    btn.classList.remove('show');
    videos[current].play().catch(function(){});
    e.stopPropagation();
  });

  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      tryPlay(current);
    } else {
      for (let v2 = 0; v2 < videos.length; v2++) videos[v2].pause();
    }
  }, { threshold: 0.3 }).observe(track);
})();

// MENU PANEL
(function() {
  let btn = document.getElementById('navMenuBtn');
  let panel = document.getElementById('menuPanel');
  let closeBtn = document.getElementById('menuPanelClose');
  if (!btn || !panel) return;

  function openMenu() {
    btn.classList.add('open');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0';
    let sb = document.getElementById('scrollBar');
    if (sb) sb.style.display = 'none';
  }

  function closeMenu() {
    btn.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
    cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0';
    let sb = document.getElementById('scrollBar');
    if (sb) sb.style.display = '';
  }

  btn.addEventListener('click', function() {
    if (panel.classList.contains('open')) closeMenu(); else openMenu();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closeMenu();
  });

  // Restore cursor when mouse moves again after menu close
  document.addEventListener('mousemove', function() {
    if (!panel.classList.contains('open') && (cursorDot.style.opacity === '0' || cursorRing.style.opacity === '0')) {
      cursorDot.style.opacity = ''; cursorRing.style.opacity = '';
    }
  }, { once: false });

  panel.querySelectorAll('.menu-nav-link[data-link]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      let target = document.getElementById(link.dataset.link);
      if (!target) return;
      closeMenu();
      pageTransition.classList.add('active');
      setTimeout(function() { pageTransition.classList.remove('active'); }, 1000);
      let top = link.dataset.link === 'home' ? 0 : target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
      if (workDetail && workDetail.classList.contains('open')) closeDetail();
    });
  });
})();

// ═══════════ STARS BACKGROUND ═══════════
(function() {
  let canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  let ctx = canvas.getContext('2d');
  let stars = [];
  let TARGET_COUNT = window.innerWidth <= 768 ? 100 : 260;
  let frameCount = 0;
  let w, h, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnStar() {
    let depth = Math.pow(Math.random(), 3);
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.25 + depth * 1.6,
      peakOpacity: 0.08 + depth * 0.65,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 1.2,
      life: 0,
      maxLife: 800 + Math.random() * 1200,
      fadeOut: false
    };
  }

  function init() {
    stars.length = 0;
    for (let i = 0; i < TARGET_COUNT; i++) {
      stars.push(spawnStar());
    }
  }

  // Draw a diamond shape at (x, y)
  function drawDiamond(cx, cy, size) {
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx + size * 0.55, cy);
    ctx.lineTo(cx, cy + size);
    ctx.lineTo(cx - size * 0.55, cy);
    ctx.closePath();
  }

  function drawGlow(cx, cy, r, alpha) {
    let grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, 'rgba(255,255,255,' + alpha + ')');
    grad.addColorStop(0.3, 'rgba(255,255,255,' + (alpha * 0.5) + ')');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }

  function draw(ts) {
    frameCount++;
    ctx.clearRect(0, 0, w, h);

    // Subtle vignette overlay for depth (skip in light mode)
    if (!isLight) {
      let vignette = ctx.createRadialGradient(w * 0.5, h * 0.4, h * 0.15, w * 0.5, h * 0.4, w * 0.75);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    }

    let t = ts * 0.001;

    for (let i = stars.length - 1; i >= 0; i--) {
      let s = stars[i];
      s.life++;

      let lifeRatio = s.maxLife > 0 ? s.life / s.maxLife : 1;
      let fadeAlpha = 1;
      if (lifeRatio > 0.85) {
        fadeAlpha = 1 - (lifeRatio - 0.85) / 0.15;
      } else if (lifeRatio < 0.1) {
        fadeAlpha = lifeRatio / 0.1;
      }

      let twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
      let alpha = s.peakOpacity * twinkle * fadeAlpha;

      if (alpha > 0.003) {
        // Draw glow first (behind diamond)
        if (s.r > 0.6) {
          drawGlow(s.x, s.y, s.r * 5, alpha * 0.15);
        }
        if (s.r > 1.0 && alpha > 0.2) {
          drawGlow(s.x, s.y, s.r * 10, alpha * 0.04);
        }

        // Draw diamond star
        ctx.beginPath();
        drawDiamond(s.x, s.y, s.r * 2.0);
        ctx.fillStyle = 'rgba(' + (isLight ? '0,0,0' : '255,255,255') + ',' + alpha + ')';
        ctx.fill();

        // Starburst cross on brighter stars
        if (s.r > 0.8 && alpha > 0.25) {
          ctx.save();
          ctx.globalAlpha = alpha * 0.35;
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 0.3;
          let cross = s.r * 3.5;
          ctx.beginPath();
          ctx.moveTo(s.x - cross, s.y); ctx.lineTo(s.x + cross, s.y);
          ctx.moveTo(s.x, s.y - cross); ctx.lineTo(s.x, s.y + cross);
          ctx.moveTo(s.x - cross * 0.7, s.y - cross * 0.7); ctx.lineTo(s.x + cross * 0.7, s.y + cross * 0.7);
          ctx.moveTo(s.x + cross * 0.7, s.y - cross * 0.7); ctx.lineTo(s.x - cross * 0.7, s.y + cross * 0.7);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Respawn at end of life
      if (s.life >= s.maxLife) {
        let replacement = spawnStar();
        replacement.x = s.x;
        replacement.y = s.y;
        replacement.life = 0;
        stars[i] = replacement;
      }
    }

    while (stars.length < TARGET_COUNT) {
      stars.push(spawnStar());
    }

    requestAnimationFrame(draw);
  }

  resize();
  init();
  requestAnimationFrame(draw);

  window.addEventListener('resize', function() {
    resize();
    TARGET_COUNT = window.innerWidth <= 768 ? 100 : 260;
    init();
  });
})();

// ═══════════ HANGING CIRCLES ═══════════
(function() {
  let canvas = document.getElementById('framesCanvas');
  if (!canvas) return;
  if (getComputedStyle(canvas).display === 'none') return;
  if ('ontouchstart' in window) { canvas.style.display = 'none'; return; }
  let ctx = canvas.getContext('2d');

  let knobColors = ['#e85570', '#444444', '#bbbbbb', '#3ccda0'];
  let ringImages = [null, null, null, null];
  let ringLoaded = [false, false, false, false];

  (function preloadImages() {
    let cards = document.querySelectorAll('.work-card');
    cards.forEach(function(card, i) {
      if (i >= 4) return;
      (function(idx) {
        let img = new Image();
        img.src = card.dataset.image;
        img.onload = function() {
          ringImages[idx] = img;
          ringLoaded[idx] = true;
        };
        img.onerror = function() { ringLoaded[idx] = true; };
      })(i);
    });
  })();

  let springK = 0.05;
  let damping = 0.84;
  let gravity = 0.06;

  let thumbs = [];
  let draggedIdx = -1;
  let hoveredIdx = -1;
  let latchedIdx = -1; // index of the disc locked to its anchor
  let dragOffX = 0, dragOffY = 0;
  let dragStartX = 0, dragStartY = 0;
  let prevMouseX = 0, prevMouseY = 0;
  let mouseCanvasX = 0, mouseCanvasY = 0;

  // --- audio players for each disc ---
  let audios = [
    new Audio('sound/01.mp3'),
    new Audio('sound/02.mp3'),
    new Audio('sound/03.mp3'),
    new Audio('sound/04.mp3')
  ];
  let prevHoveredIdx = -1;
  audios.forEach(function(a) { a.loop = true; a.volume = 0.6; });

  function handleAudioHover(newIdx) {
    // If a disc is latched, don't override with hover
    if (latchedIdx >= 0) {
      window.__audioPlaying = true;
      return;
    }
    if (newIdx === prevHoveredIdx) return;
    // Stop previous
    if (prevHoveredIdx >= 0 && prevHoveredIdx < 4) {
      audios[prevHoveredIdx].pause();
      audios[prevHoveredIdx].currentTime = 0;
    }
    // Play new
    if (newIdx >= 0 && newIdx < 4) {
      audios[newIdx].currentTime = 0;
      audios[newIdx].play().catch(function(){});
      window.__audioPlaying = true;
    } else {
      window.__audioPlaying = false;
    }
    prevHoveredIdx = newIdx;
  }

  // Force play for latched disc (called from mouseup)
  window.__navWaveForcePlay = function(idx) {
    for (let i = 0; i < audios.length; i++) {
      if (i !== idx) { audios[i].pause(); audios[i].currentTime = 0; }
    }
    audios[idx].currentTime = 0;
    audios[idx].play().catch(function(){});
    window.__audioPlaying = true;
    prevHoveredIdx = idx;
  };

  function getCircleSz(screenW) {
    if (screenW >= 1800) return 156;
    if (screenW >= 1400) return 140;
    if (screenW >= 1024) return 120;
    if (screenW >= 768) return 104;
    return 88;
  }

  function resize() {
    let hero = document.getElementById('home');
    if (!hero) return;
    let rect = hero.getBoundingClientRect();
    let dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let w = rect.width, h = rect.height;

    let sz = getCircleSz(w);
    let gap = sz * 1.1;
    let xOff = w < 1200 ? w * 0.52 : w * 0.58;
    let yOffsets = [0, sz * 0.12, sz * 0.24, sz * 0.36];
    let anchorY = 0;
    let anchorXs = [xOff, xOff + gap, xOff + gap * 2, xOff + gap * 3];
    let bottomY = h * 0.33;
    let anchors = [];
    for (let ai = 0; ai < 4; ai++) {
      anchors.push({
        x: anchorXs[ai],
        y: anchorY,
        restOffX: 0,
        stringLen: (bottomY + yOffsets[ai]) - anchorY
      });
    }

    if (thumbs.length === 0) {
      let loadDelay = 0.45;
      for (let i = 0; i < 4; i++) {
        let a = anchors[i];
        let cs = getCircleSz(w);
        let restX = a.x + a.restOffX;
        let restY = a.y + a.stringLen + (yOffsets[i] || 0);
        let startY = -cs * 3;
        let startX = restX + (Math.random() - 0.5) * 60;
        thumbs.push({
          x: startX, y: startY, vx: 0, vy: 0,
          anchorX: a.x, anchorY: a.y,
          restX: restX, restY: restY,
          dispW: cs, dispH: cs,
          color: knobColors[i],
          entering: true,
          enterDelay: loadDelay + i * 0.12,
          restOffX: 0,
          hoverAlpha: 0
        });
      }
    } else {
      let cs2 = getCircleSz(w);
      for (let j = 0; j < 4; j++) {
        let b = anchors[j];
        thumbs[j].anchorX = b.x;
        thumbs[j].anchorY = b.y;
        thumbs[j].restX = b.x + b.restOffX;
        thumbs[j].restY = b.y + b.stringLen;
        thumbs[j].dispW = cs2;
        thumbs[j].dispH = cs2;
      }
    }

    // Position latch clips to match anchorX (same as canvas coords, no offset needed)
    let clips = document.querySelectorAll('.latch-clip');
    for (let k = 0; k < clips.length && k < thumbs.length; k++) {
      clips[k].style.left = thumbs[k].anchorX + 'px';
    }
    // Click on HTML clip to unlatch
    clips.forEach(function(clip, ci) {
      clip.onclick = function() {
        if (latchedIdx === ci) {
          let tl = thumbs[latchedIdx];
          tl.vy = -8;
          tl.vx = (Math.random() - 0.5) * 3;
          tl.entering = false;
          latchedIdx = -1;
          document.querySelectorAll('.latch-clip').forEach(function(c){ c.classList.remove('latched'); });
          if (window.__navWaveStop) window.__navWaveStop(ci);
        }
      };
    });
  }

  let startTime = 0;

  function update(ts) {
    if (!startTime) startTime = ts;
    let elapsed = (ts - startTime) / 1000;

    if (draggedIdx < 0) {
      hoveredIdx = getThumbAt(mouseCanvasX, mouseCanvasY);
    }

    for (let i = 0; i < thumbs.length; i++) {
      let t = thumbs[i];
      // Latched disc: smooth lock to HTML latch clip position
      if (i === latchedIdx) {
        if (i !== draggedIdx) {
          let heroRect2 = document.getElementById('home').getBoundingClientRect();
          let cRect2 = canvas.getBoundingClientRect();
          let targetX = t.anchorX;
          let targetY = (heroRect2.top + 60) - cRect2.top + 14; // center of half-circle
          // Smooth lerp toward latch position
          t.x += (targetX - t.x) * 0.3;
          t.y += (targetY - t.y) * 0.3;
          t.vx = 0; t.vy = 0;
          t.entering = false;
          t.hoverAlpha += (1 - t.hoverAlpha) * 0.05;
          continue;
        }
      }
      let targetHA = (i === hoveredIdx && draggedIdx < 0) ? 1 : 0;
      let speed = targetHA > t.hoverAlpha ? 0.04 : 0.05;
      t.hoverAlpha += (targetHA - t.hoverAlpha) * speed;

      if (i === draggedIdx) continue;

      if (t.entering) {
        if (elapsed < t.enterDelay) continue;
        t.vy += gravity;
        t.y += t.vy;
        t.vx += (t.restX - t.x) * 0.03;
        t.x += t.vx;
        t.vx *= 0.9;
        if (t.y >= t.restY) {
          t.y = t.restY;
          t.vy *= -0.12;
          if (Math.abs(t.vy) < 0.3 && Math.abs(t.x - t.restX) < 1) {
            t.y = t.restY;
            t.x = t.restX;
            t.vx = 0; t.vy = 0;
            t.entering = false;
          }
        }
        continue;
      }

      let dx = t.restX - t.x;
      let dy2 = t.restY - t.y;
      t.vx += dx * springK;
      t.vy += dy2 * springK;
      t.vx *= damping;
      t.vy *= damping;
      t.x += t.vx;
      t.y += t.vy;
    }
  }

  function drawString(ax, ay, bx, by) {
    let dx = bx - ax, dy = by - ay;
    let len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return;
    let segments = Math.floor(len * 2);
    if (segments < 40) segments = 40;
    let coils = Math.floor(len / 24);
    if (coils < 2) coils = 2;
    let amp = 12;

    ctx.beginPath();
    ctx.moveTo(ax, ay);
    let perpX = -dy / len;
    let perpY = dx / len;
    let subSegs = Math.floor(segments / 6);
    if (subSegs < 8) subSegs = 8;
    for (let g = 0; g < subSegs; g++) {
      let t0 = g / subSegs;
      let t1 = (g + 1) / subSegs;
      let alpha = 0.28 * (t0 + t1) / 2;
      ctx.beginPath();
      let x0 = ax + dx * t0 + perpX * Math.sin(t0 * coils * Math.PI * 2) * amp;
      let y0 = ay + dy * t0 + perpY * Math.sin(t0 * coils * Math.PI * 2) * amp;
      ctx.moveTo(x0, y0);
      let steps = Math.floor((t1 - t0) * segments);
      if (steps < 4) steps = 4;
      for (let s = 1; s <= steps; s++) {
        let tt = t0 + (s / steps) * (t1 - t0);
        let x = ax + dx * tt + perpX * Math.sin(tt * coils * Math.PI * 2) * amp;
        let y = ay + dy * tt + perpY * Math.sin(tt * coils * Math.PI * 2) * amp;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(' + (isLight ? '0,0,0' : '255,255,255') + ',' + alpha + ')';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function drawThumb(t, idx) {
    if (t.y + t.dispH < -20) return;

    let r = t.dispW / 2;
    let ha = t.hoverAlpha || 0;

    let spinning = (idx === hoveredIdx || idx === draggedIdx || idx === latchedIdx) ? 1 : 0;
    if (t._spin === undefined) t._spin = 0;
    if (t._spinSpeed === undefined) t._spinSpeed = 0;
    if (t._spinTimer === undefined) t._spinTimer = 0;
    if (spinning) {
      t._spinTimer += 1 / 60;
    } else {
      t._spinTimer = 0;
    }
    let active = t._spinTimer > 0.2 ? 1 : 0;
    t._spinSpeed += (active * 0.015 - t._spinSpeed) * 0.04;
    // When not active, slowly return spin to nearest multiple of 2π (reset position)
    if (!active) {
      let mod = t._spin % (Math.PI * 2);
      if (mod < 0) mod += Math.PI * 2;
      // snap to nearest 0 or π (pick the closer one)
      let target = mod < Math.PI ? 0 : Math.PI * 2;
      t._spin += (target - mod) * 0.03;
    }
    t._spin += t._spinSpeed;

    let eased = ha < 0.01 ? 0 : 1 - Math.pow(1 - ha, 3);
    let scale = 1 + eased * 0.09;

    // 常亮白色雾状外发光
    let softGlow = ctx.createRadialGradient(t.x, t.y, r * 0.8, t.x, t.y, r * 1.8);
    softGlow.addColorStop(0, 'rgba(255,255,255,0.10)');
    softGlow.addColorStop(0.5, 'rgba(255,255,255,0.03)');
    softGlow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = softGlow;
    ctx.fillRect(t.x - r * 3, t.y - r * 3, r * 6, r * 6);

    // hover 增强发光 — 统一白色
    if (ha > 0.01) {
      let glowR = r * 3;
      let grad = ctx.createRadialGradient(t.x, t.y, r * 0.3, t.x, t.y, glowR);
      grad.addColorStop(0, 'rgba(255,255,255,' + (eased * 0.25) + ')');
      grad.addColorStop(0.5, 'rgba(255,255,255,' + (eased * 0.08) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(t.x - glowR, t.y - glowR, glowR * 2, glowR * 2);
    }

    // Latch clips handled via HTML overlay, not canvas

    drawString(t.anchorX, t.anchorY, t.x, t.y - r);

    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.rotate(t._spin || 0);
    ctx.scale(scale, scale);

    // 图片贴到圆环区域（环形 clip，填满裁切，像唱片）
    if (ringLoaded[idx] && ringImages[idx]) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2, true);
      ctx.save();
      ctx.clip('evenodd');
      let img = ringImages[idx];
      let iw = img.width, ih = img.height;
      // 按内径填满环形外圈，确保圆环完全被图片覆盖
      let scaleImg = Math.max(r * 2 / iw, r * 2 / ih) * 1.3;
      let dw = iw * scaleImg, dh = ih * scaleImg;
      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();
    }

    // 纯色圆环（图片未加载时用）
    if (!ringLoaded[idx] || !ringImages[idx]) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2, true);
      ctx.fillStyle = t.color;
      ctx.fill('evenodd');
    }

    // 圆环外圈深灰描边
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(20,20,20,0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 唱片内圈深灰描边
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(20,20,20,0.8)';
    ctx.lineWidth = 12;
    ctx.stroke();

    // 外发光 - 统一黑白
    ctx.shadowColor = 'rgba(255,255,255,0.6)';
    ctx.shadowBlur = 6 + eased * 8;

    ctx.restore();
  }

  function render(ts) {
    update(ts);
    let cw = canvas.width / (window.devicePixelRatio || 1);
    let ch = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, cw, ch);
    for (let i = 0; i < thumbs.length; i++) {
      drawThumb(thumbs[i], i);
    }
    requestAnimationFrame(render);
  }

  function getThumbAt(mx, my) {
    for (let i = 0; i < thumbs.length; i++) {
      let t = thumbs[i];
      let r = t.dispW / 2;
      let dx = mx - t.x, dy = my - t.y;
      if (dx * dx + dy * dy <= r * r * 1.44) {
        return i;
      }
    }
    return -1;
  }

  canvas.addEventListener('mousedown', function(e) {
    let rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;
    let idx = getThumbAt(mx, my);
    if (idx !== -1) {
      draggedIdx = idx;
      let t = thumbs[idx];
      dragOffX = t.x - mx;
      dragOffY = t.y - my;
      dragStartX = mx;
      dragStartY = my;
      prevMouseX = mx;
      prevMouseY = my;
      t.vx = 0; t.vy = 0;
      canvas.style.cursor = 'grabbing';
      e.preventDefault();
    }
  });

  canvas.addEventListener('mousemove', function(e) {
    let rect = canvas.getBoundingClientRect();
    let mx = e.clientX - rect.left;
    let my = e.clientY - rect.top;
    mouseCanvasX = mx;
    mouseCanvasY = my;
    if (draggedIdx >= 0) {
      let t = thumbs[draggedIdx];
      t.x = mx + dragOffX;
      t.y = my + dragOffY;
      // If dragging a latched disc far enough, unlatch it
      if (latchedIdx === draggedIdx) {
        let heroRect3 = document.getElementById('home').getBoundingClientRect();
        let cRect3 = canvas.getBoundingClientRect();
        let latchCY = (heroRect3.top + 70) - cRect3.top;
        let pullDist = Math.sqrt(Math.pow(t.x - t.anchorX, 2) + Math.pow(t.y - latchCY, 2));
        if (pullDist > t.dispW * 0.6) {
          latchedIdx = -1;
          document.querySelectorAll('.latch-clip').forEach(function(c){ c.classList.remove('latched'); });
          if (window.__navWaveStop) window.__navWaveStop(draggedIdx);
        } else {
          // Still close, snap back
          t.x = t.anchorX; t.y = latchCY;
        }
      } else {
        // Snap magnetism: if near latch clip, pull toward it
        let heroRect3 = document.getElementById('home').getBoundingClientRect();
        let latchScreenY2 = heroRect3.top + 70;
        let canvasRect3 = canvas.getBoundingClientRect();
        let discSX = canvasRect3.left + t.x;
        let discSY = canvasRect3.top + t.y;
        let latchSX = canvasRect3.left + t.anchorX;
        let snapDx = discSX - latchSX;
        let snapDy = discSY - latchScreenY2;
        let snapDist = Math.sqrt(snapDx * snapDx + snapDy * snapDy);
        let snapZone = t.dispW * 1.4;
        if (snapDist < snapZone && snapDist > 5) {
          let pull = (snapZone - snapDist) / snapZone;
          pull = pull * pull * 0.12;
          t.x -= (snapDx / snapDist) * snapDist * pull;
          t.y -= (snapDy / snapDist) * snapDist * pull;
        }
      }
      t.vx = (mx - prevMouseX) * 0.4;
      t.vy = (my - prevMouseY) * 0.4;
      prevMouseX = mx;
      prevMouseY = my;
    } else {
      canvas.style.cursor = getThumbAt(mx, my) >= 0 ? 'grab' : '';
      handleAudioHover(getThumbAt(mx, my));
    }
  });

  canvas.addEventListener('mouseup', function(e) {
    if (draggedIdx >= 0) {
      let rect = canvas.getBoundingClientRect();
      let mx = e.clientX - rect.left;
      let my = e.clientY - rect.top;
      let dist = Math.sqrt(Math.pow(mx - dragStartX, 2) + Math.pow(my - dragStartY, 2));
      if (dist < 3) {
        // Short click: if this disc is latched, unlatch it with a bounce

        if (latchedIdx === draggedIdx) {
          let tl = thumbs[latchedIdx];
          tl.vy = -8;
          tl.vx = (Math.random() - 0.5) * 3;
          tl.entering = false;
          latchedIdx = -1;
          document.querySelectorAll('.latch-clip').forEach(function(c){ c.classList.remove('latched'); });
          // Stop audio playback
          if (window.__navWaveStop) window.__navWaveStop(draggedIdx);
          draggedIdx = -1;
          hoveredIdx = -1;
          canvas.style.cursor = '';
          return;
        }
        let works = document.querySelectorAll('.work-card');
        if (works[draggedIdx]) {
          let card = works[draggedIdx];
          let key = card.dataset.work;
          let hero = card.dataset.hero;
          if (key && workData && workData[key]) {
            let data = Object.assign({ slug: key }, workData[key]);
            openDetail(data, hero);
          }
        }
      } else {
        // Drag release: check if near HTML latch clip
        let t = thumbs[draggedIdx];
        let heroRect = document.getElementById('home').getBoundingClientRect();
        let latchScreenY = heroRect.top + 70;
        // Disc screen position (canvas uses transform, so screen = canvas pos + canvas offset)
        let canvasRect = canvas.getBoundingClientRect();
        let discScreenX = canvasRect.left + t.x;
        let discScreenY = canvasRect.top + t.y;
        // Latch X on screen = canvas left + anchorX
        let latchScreenX = canvasRect.left + t.anchorX;
        let dx2 = discScreenX - latchScreenX;
        let dy2 = discScreenY - latchScreenY;
        let latchDist = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        let latchThreshold = t.dispW * 1.2;
        if (latchDist < latchThreshold) {
          // Latch this disc, eject previous
          if (latchedIdx >= 0 && latchedIdx !== draggedIdx) {
            let ejected = thumbs[latchedIdx];
            ejected.vy = -6;
            ejected.vx = (Math.random() - 0.5) * 2;
            ejected.entering = false;
          }
          latchedIdx = draggedIdx;
          // Snap disc to latch position
          let heroRect = document.getElementById('home').getBoundingClientRect();
          let cRect = canvas.getBoundingClientRect();
          t.x = t.anchorX;
          t.y = (heroRect.top + 60) - cRect.top + 14;
          t.vx = 0; t.vy = 0;
          t.vx = 0; t.vy = 0;
          // Update CSS class
          document.querySelectorAll('.latch-clip').forEach(function(c, ci){
            c.classList.toggle('latched', ci === latchedIdx);
          });
          // Start constant playback
          if (window.__navWaveForcePlay) window.__navWaveForcePlay(draggedIdx);
        }
      }
      draggedIdx = -1;
      hoveredIdx = -1;
      canvas.style.cursor = '';
    }
  });

  canvas.addEventListener('mouseleave', function() {
    if (draggedIdx >= 0) draggedIdx = -1;
    hoveredIdx = -1;
    handleAudioHover(-1);
    canvas.style.cursor = '';
  });

  canvas.addEventListener('touchstart', function(e) {}, { passive: true });
  canvas.addEventListener('touchmove', function(e) {}, { passive: true });
  canvas.addEventListener('touchend', function(e) {}, { passive: true });

  resize();
  requestAnimationFrame(render);
  window.addEventListener('resize', function() { resize(); });

})();

// ═══════════ BACK TO TOP ═══════════
(function() {
  let btn = document.getElementById('backToTop');
  if (!btn) return;

  // Show after scrolling past hero
  let hero = document.getElementById('home');
  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      btn.classList.remove('visible');
    } else {
      btn.classList.add('visible');
    }
  }, { threshold: 0 }).observe(hero);

  btn.addEventListener('click', function() {
    // Smooth scroll with custom easing via requestAnimationFrame
    let start = window.scrollY;
    let startTime = null;
    let duration = 1000;

    function step(ts) {
      if (!startTime) startTime = ts;
      let elapsed = ts - startTime;
      let progress = Math.min(elapsed / duration, 1);
      // Ease out quint — fast start, gentle landing
      let eased = 1 - Math.pow(1 - progress, 5);
      window.scrollTo(0, start * (1 - eased));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  });
})();


// --- custom scroll bar ---
(function(){
  const bar = document.getElementById('scrollBar');
  const thumb = document.getElementById('scrollThumb');
  if (!bar || !thumb) return;

  // --- Generate tick marks between dot markers (based on section positions) ---
  let ticksContainer = document.getElementById('scrollTicks');
  function generateTicks() {
    if (!ticksContainer) return;
    ticksContainer.innerHTML = '';
    let h = document.documentElement;
    let totalH = h.scrollHeight - h.clientHeight;
    if (totalH <= 0) return;
    let dots = bar.querySelectorAll('.scroll-dot-marker');
    for (let d = 0; d < dots.length - 1; d++) {
      let elA = document.querySelector(dots[d].getAttribute('data-target'));
      let elB = document.querySelector(dots[d + 1].getAttribute('data-target'));
      if (!elA || !elB) continue;
      let topA = (elA.getBoundingClientRect().top + h.scrollTop) / totalH * 100;
      let topB = (elB.getBoundingClientRect().top + h.scrollTop) / totalH * 100;
      if (topA >= topB) continue;
      let step = (topB - topA) / 4;
      for (let t = 1; t <= 3; t++) {
        let pct = topA + step * t;
        let tick = document.createElement('div');
        tick.className = 'scroll-tick';
        tick.style.top = pct + '%';
        ticksContainer.appendChild(tick);
      }
    }
  }

  // --- Show/hide based on scroll position (hide on hero, show after) ---
  function updateVisibility() {
    let heroH = window.innerHeight;
    let scrolled = window.scrollY;
    if (scrolled < heroH * 0.5) {
      bar.style.opacity = '0';
      bar.style.pointerEvents = 'none';
    } else {
      bar.style.opacity = '1';
      bar.style.pointerEvents = 'auto';
    }
  }
  bar.style.transition = 'opacity .4s var(--ease-out-expo)';
  updateVisibility();

  // --- Add page bubbles to dot markers ---
  let dotLabels = { '#home': '00', '#work': '01', '#ice': '02', '#showcase': '03', '#motion': '04', '#about': '05' };
  let dots = bar.querySelectorAll('.scroll-dot-marker');

  // --- smooth wheel scroll (declared early for bubble click) ---
  let wheelTarget = document.documentElement.scrollTop;
  let wheelCurrent = wheelTarget;
  let wheelRaf = null;

  function startWheelLerp() {
    // Don't interfere with bubble-click lerpScroll
    if (lerpActive && bubbleLerpStartTime > 0) return;
    if (wheelRaf) return;
    wheelRaf = requestAnimationFrame(function tick() {
      // Yield to lerpScroll if it's handling a bubble click
      if (lerpActive && bubbleLerpStartTime > 0) { wheelRaf = null; return; }
      let diff = wheelTarget - wheelCurrent;
      if (Math.abs(diff) < 0.3) {
        wheelCurrent = wheelTarget;
        document.documentElement.scrollTop = wheelCurrent;
        updatePosition();
        positionDots();
        updateVisibility();
        wheelRaf = null;
        return;
      }
      wheelCurrent += diff * 0.04;
      document.documentElement.scrollTop = wheelCurrent;
      updatePosition();
      positionDots();
      updateVisibility();
      wheelRaf = requestAnimationFrame(tick);
    });
  }

  dots.forEach(function(dot){
    let targetId = dot.getAttribute('data-target');
    let label = dotLabels[targetId] || '';
    if (!label) return;
    let bubble = document.createElement('span');
    bubble.className = 'scroll-bubble';
    bubble.textContent = 'P' + label;
    dot.appendChild(bubble);
    // click bubble → smooth scroll with custom easing
    bubble.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      let el = document.querySelector(targetId);
      if (!el) return;
      let totalH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      let targetTop = el.getBoundingClientRect().top + document.documentElement.scrollTop - document.documentElement.clientHeight * 0.1;
      targetScroll = Math.max(0, Math.min(totalH, targetTop));
      bubbleLerpStartScroll = document.documentElement.scrollTop;
      // Duration based on distance: min 600ms, max 1800ms
      let scrollDist = Math.abs(targetScroll - bubbleLerpStartScroll);
      let viewH = document.documentElement.clientHeight;
      let screens = scrollDist / viewH;
      bubbleLerpDuration = Math.max(600, Math.min(1800, 400 + screens * 320));
      bubbleLerpStartTime = performance.now();
      currentScroll = bubbleLerpStartScroll;
      lerpActive = true;
      lerpScroll();
    });
  });

  let dragging = false, startY = 0, startPageY = 0;
  let trackH = 0;

  function getMetrics(){
    trackH = bar.getBoundingClientRect().height;
  }

  function updatePosition(){
    if (trackH <= 0) getMetrics();
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (max <= 0) return;
    const pct = h.scrollTop / max;
    const shiftPx = (pct * 100 - 50) / 100 * trackH;
    thumb.style.transform = 'translate(-50%,-50%) translateY(' + shiftPx + 'px)';
  }

  function positionDots(){
    const h = document.documentElement;
    const totalH = h.scrollHeight - h.clientHeight;
    if (totalH <= 0) return;
    const dots = bar.querySelectorAll('.scroll-dot-marker');
    dots.forEach(function(dot){
      const targetId = dot.getAttribute('data-target');
      const el = document.querySelector(targetId);
      if (!el) return;
      const elTop = el.getBoundingClientRect().top + h.scrollTop + h.clientHeight * 0.05;
      const pct = elTop / totalH;
      dot.style.top = (pct * 100) + '%';
    });
  }

  getMetrics();
  updatePosition();
  positionDots();
  generateTicks();

  window.addEventListener('scroll', function(){ updatePosition(); positionDots(); generateTicks(); updateVisibility(); }, {passive: true});
  window.addEventListener('resize', function(){ getMetrics(); updatePosition(); positionDots(); generateTicks(); updateVisibility(); }, {passive: true});

  let activeTimer = null;

  thumb.addEventListener('mousedown', function(e){
    dragging = true;
    startY = e.clientY;
    startPageY = window.scrollY;
    getMetrics();
    clearTimeout(activeTimer);
    activeTimer = setTimeout(function() { thumb.classList.add('active'); }, 150);
    e.preventDefault();
  });
  thumb.addEventListener('touchstart', function(e){
    dragging = true;
    startY = e.touches[0].clientY;
    startPageY = window.scrollY;
    getMetrics();
    clearTimeout(activeTimer);
    activeTimer = setTimeout(function() { thumb.classList.add('active'); }, 150);
    e.preventDefault();
  }, {passive: false});

  let targetScroll = 0;
  let currentScroll = 0;
  let lerpActive = false;

  function getDotScrollPositions() {
    const h = document.documentElement;
    const totalH = h.scrollHeight - h.clientHeight;
    if (totalH <= 0) return [];
    const dots = bar.querySelectorAll('.scroll-dot-marker');
    let positions = [];
    dots.forEach(function(dot) {
      let targetId = dot.getAttribute('data-target');
      let el = document.querySelector(targetId);
      if (!el) return;
      let elTop = el.getBoundingClientRect().top + h.scrollTop + h.clientHeight * 0.05;
      positions.push(elTop);
    });
    return positions;
  }

  let bubbleLerpStartTime = 0;
  let bubbleLerpDuration = 0;
  let bubbleLerpStartScroll = 0;

  function lerpScroll() {
    if (!lerpActive) return;
    let diff = targetScroll - currentScroll;
    let speed = 0.2;
    // snap damping: magnetic pull near dot anchors (drag only)
    if (dragging) {
      let dots = getDotScrollPositions();
      let totalH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      let snapZone = totalH * 0.06;
      for (let i = 0; i < dots.length; i++) {
        let dist = Math.abs(currentScroll - dots[i]);
        if (dist < snapZone) {
          speed = 0.03 + (dist / snapZone) * 0.17;
          break;
        }
      }
    } else if (bubbleLerpStartTime > 0) {
      // Use custom easeInOutCubic for smooth acceleration + deceleration
      let elapsed = performance.now() - bubbleLerpStartTime;
      let progress = Math.min(elapsed / bubbleLerpDuration, 1);
      // easeInOutCubic: smooth start, smooth end
      let eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      currentScroll = bubbleLerpStartScroll + (targetScroll - bubbleLerpStartScroll) * eased;
      if (progress >= 1) {
        currentScroll = targetScroll;
        lerpActive = false;
        bubbleLerpStartTime = 0;
      }
      document.documentElement.scrollTop = currentScroll;
      updatePosition();
      positionDots();
      updateVisibility();
      if (lerpActive) requestAnimationFrame(lerpScroll);
      return;
    }
    currentScroll += diff * speed;
    if (Math.abs(diff) < 0.5) {
      currentScroll = targetScroll;
      lerpActive = false;
    }
    document.documentElement.scrollTop = currentScroll;
    updatePosition();
    positionDots();
    updateVisibility();
    if (lerpActive) requestAnimationFrame(lerpScroll);
  }

  document.addEventListener('mousemove', function(e){
    if (!dragging) return;
    getMetrics();
    const dy = e.clientY - startY;
    const totalH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (totalH <= 0) return;
    targetScroll = startPageY + dy / trackH * totalH;
    targetScroll = Math.max(0, Math.min(totalH, targetScroll));
    if (!lerpActive) {
      currentScroll = document.documentElement.scrollTop;
      lerpActive = true;
      requestAnimationFrame(lerpScroll);
    }
  });
  document.addEventListener('touchmove', function(e){
    if (!dragging) return;
    getMetrics();
    const dy = e.touches[0].clientY - startY;
    const totalH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (totalH <= 0) return;
    targetScroll = startPageY + dy / trackH * totalH;
    targetScroll = Math.max(0, Math.min(totalH, targetScroll));
    if (!lerpActive) {
      currentScroll = document.documentElement.scrollTop;
      lerpActive = true;
      requestAnimationFrame(lerpScroll);
    }
  }, {passive: false});

  document.addEventListener('mouseup', function(){
    if (!dragging) return;
    dragging = false;
    clearTimeout(activeTimer);
    thumb.classList.remove('active');
  });
  document.addEventListener('touchend', function(){
    if (!dragging) return;
    dragging = false;
    clearTimeout(activeTimer);
    thumb.classList.remove('active');
  });

  bar.addEventListener('mousedown', function(e){
    // Skip if clicking thumb or bubble
    if (e.target === thumb || e.target.closest('.scroll-bubble') || e.target.closest('.scroll-dot-marker')) return;
    getMetrics();
    const rect = bar.getBoundingClientRect();
    const totalH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = (e.clientY - rect.top) / rect.height;
    document.documentElement.scrollTop = pct * totalH;
  });

  bar.addEventListener('click', function(e){
    // If bubble was clicked, the bubble handler already took care of it
    if (e.target.closest('.scroll-bubble')) return;
    const dot = e.target.closest('.scroll-dot-marker');
    if (!dot) return;
    const targetId = dot.getAttribute('data-target');
    let el = document.querySelector(targetId);
    if (!el) return;
    let totalH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let targetTop = el.getBoundingClientRect().top + document.documentElement.scrollTop - document.documentElement.clientHeight * 0.1;
    targetScroll = Math.max(0, Math.min(totalH, targetTop));
    bubbleLerpStartScroll = document.documentElement.scrollTop;
    let scrollDist = Math.abs(targetScroll - bubbleLerpStartScroll);
    let viewH = document.documentElement.clientHeight;
    let screens = scrollDist / viewH;
    bubbleLerpDuration = Math.max(600, Math.min(1800, 400 + screens * 320));
    bubbleLerpStartTime = performance.now();
    currentScroll = bubbleLerpStartScroll;
    lerpActive = true;
    lerpScroll();
  });

  // --- smooth wheel scroll ---

  document.addEventListener('wheel', function(e) {
    if (dragging) return;
    // Don't interfere with bubble-click lerp animation
    if (lerpActive && bubbleLerpStartTime > 0) return;
    e.preventDefault();
    let totalH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (!wheelRaf) {
      wheelCurrent = document.documentElement.scrollTop;
      wheelTarget = wheelCurrent;
    }
    wheelTarget += e.deltaY * 1.2;
    wheelTarget = Math.max(0, Math.min(totalH, wheelTarget));
    startWheelLerp();
  }, {passive: false});
})();

// ═══════════ NAV WAVEFORM ═══════════
(function(){
  let waveCanvas = document.getElementById('navWaveform');
  if (!waveCanvas) return;
  let ctx = waveCanvas.getContext('2d');
  let dpr = window.devicePixelRatio || 1;
  let waveW = 0, waveH = 0;
  let history = new Array(64).fill(0);

  function initSize() {
    waveW = waveCanvas.offsetWidth || waveCanvas.width || 140;
    waveH = waveCanvas.offsetHeight || waveCanvas.height || 32;
    waveCanvas.width = waveW * dpr;
    waveCanvas.height = waveH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  initSize();

  let noisePhase = 0;
  function draw() {
    initSize();
    if (waveW < 2 || waveH < 2) { requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, waveW, waveH);

    let playing = window.__audioPlaying === true;
    let mid = waveH / 2;

    // Build smooth bar-style waveform
    let segs = history.length - 1;
    let segW = waveW / segs;

    // Push new random bar height (or zero if not playing)
    noisePhase += 0.08;
    let active = playing;
    // When not playing, fade to flat
    let nextVal = active ? (Math.sin(noisePhase * 1.7) * 0.4 + Math.sin(noisePhase * 3.1) * 0.3 + Math.sin(noisePhase * 5.3) * 0.2) : 0;
    history.push(nextVal);
    if (history.length > segs + 1) history.shift();

    // Fade to flat when not playing
    let smooth = active ? 0.6 : 0.92;
    for (let i = 0; i < history.length; i++) {
      let target = active ? history[i] : 0;
      history[i] = history[i] * smooth + target * (1 - smooth);
    }

    // Use accent warm orange in both modes
    ctx.strokeStyle = '#E87C50';
    ctx.lineWidth = 2.2;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < history.length; i++) {
      let val = Math.max(-1, Math.min(1, history[i]));
      let y = mid + val * (waveH * 0.32);
      if (i === 0) ctx.moveTo(0, y);
      else ctx.lineTo(i * segW, y);
    }
    ctx.stroke();

    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', initSize);
})();
