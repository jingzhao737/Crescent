/* ═══════════════════════════════════════════
   PORTFOLIO — APP JS v7 · ART DIRECTION
   ═══════════════════════════════════════════ */


// ═══════════ THEME (global) ═══════════
var isLight = false;
(function initTheme() {
  if (localStorage.getItem('theme') === 'light') {
    document.documentElement.classList.add('light');
    isLight = true;
  }
  var btn = document.getElementById('themeToggle');
  var wrapper = document.getElementById('themePullWrapper');
  var stringEl = document.getElementById('themePullString');
  if (!btn) return;

  // ── Web Audio API sound synth ──
  var audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }
  function playTick(rate, vol) {
    if (!audioCtx) return;
    var t = audioCtx.currentTime;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
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

  var dragEnd = 40;
  var threshold = 60;
  var maxPull = 100;
  var resistance = 0.2;
  var dragging = false, startY = 0, pullY = 0, toggled = false;
  var inMotion = false;

  function setPull(v) {
    var raw = Math.max(0, v);
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
    var bounceY = pullY;
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
    var y = e.touches ? e.touches[0].clientY : e.clientY;
    var dy = y - startY;
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


var workData = {
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

// ═══════════ CURSOR ═══════════
var cursorDot = document.getElementById('cursorDot');
var cursorRing = document.getElementById('cursorRing');
var mouseX = 0, mouseY = 0, cX = 0, cY = 0, rX = 0, rY = 0;

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
  var numEl = document.getElementById('loaderNumber');
  var bar = document.getElementById('loaderBar');
  var loaderEl = document.getElementById('loader');
  if (!numEl || !loaderEl) { revealCrescent(); if (loaderEl) loaderEl.style.display = 'none'; document.body.style.cursor = 'none'; return; }

  var total = 50, count = 0;
  var iv = setInterval(function() {
    count++;
    var raw = count / total;
    var eased = 1 - Math.pow(1 - raw, 3);
    var num = Math.floor(eased * 100);
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
var nav = document.getElementById('nav'), navLinks = document.querySelectorAll('.nav-links a');
var pageTransition = document.getElementById('pageTransition'), workDetail = document.getElementById('workDetail');

new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) nav.classList.remove('scrolled'); else nav.classList.add('scrolled'); });
}, { threshold: [0, 0.1] }).observe(document.getElementById('home'));

['home', 'work', 'showcase', 'motion', 'about'].forEach(function(id) {
  var el = document.getElementById(id); if (!el) return;
  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      navLinks.forEach(function(a) { a.classList.remove('active'); });
      var link = document.querySelector('.nav-links a[data-link="' + id + '"]');
      if (link) link.classList.add('active');
    }
  }, { threshold: 0.3, rootMargin: '-20% 0px -60% 0px' }).observe(el);
});

document.querySelectorAll('a[data-link]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    var target = document.getElementById(a.dataset.link); if (!target) return;
    pageTransition.classList.add('active'); setTimeout(function() { pageTransition.classList.remove('active'); }, 1000);
    var top = a.dataset.link === 'home' ? 0 : target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: top, behavior: 'smooth' });
    if (workDetail.classList.contains('open')) closeDetail();
  });
});

// ═══════════ HOVER PREVIEW (desktop only) ═══════════
(function() {
  if ('ontouchstart' in window) return;
  var imgs = [], activeImg = null, targetX = 0, targetY = 0, currentX = 0, currentY = 0;

  document.querySelectorAll('.work-card').forEach(function(card) {
    var img = document.createElement('img');
    img.className = 'work-preview'; img.src = card.dataset.image; img.alt = ''; img.draggable = false;
    document.body.appendChild(img);
    imgs.push({ card: card, img: img });

    card.addEventListener('mouseenter', function() {
      activeImg = img;
      for (var j = 0; j < imgs.length; j++) imgs[j].img.classList.remove('visible');
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
      var dx = targetX - currentX, dy = targetY - currentY;
      currentX += dx * 0.12; currentY += dy * 0.12;
      activeImg.style.left = currentX + 'px'; activeImg.style.top = currentY + 'px';
    }
    requestAnimationFrame(animateHover);
  })();
})();

// ═══════════ PARALLAX SHOWCASE — hover tilt + drag + spring return ═══════════
(function() {
  var items = document.querySelectorAll('.showcase-item[data-parallax]');
  if (items.length === 0) return;

  var states = [];
  var activeDrag = null; // which state is being dragged
  for (var i = 0; i < items.length; i++) {
    var bg = items[i].querySelector('.showcase-bg');
    if (!bg) continue;
    states.push({ el: bg, item: items[i], tx: 0, ty: 0, stx: 0, sty: 0, cx: 0, cy: 0, vx: 0, vy: 0, hover: false, dx: 0, dy: 0 });
  }

  function isInside(rect, mx, my) {
    return mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom;
  }

  document.addEventListener('mousemove', function(e) {
    var mx = e.clientX, my = e.clientY;
    for (var i = 0; i < states.length; i++) {
      var s = states[i];
      var rect = s.item.getBoundingClientRect();
      var inside = isInside(rect, mx, my);
      s.hover = inside;
      if (inside) {
        var relX = (mx - rect.left) / rect.width - 0.5;
        var relY = (my - rect.top) / rect.height - 0.5;
        s.stx = relX * 30;
        s.sty = relY * 28;
      } else {
        s.stx = 0;
        s.sty = 0;
      }
    }
    // Drag
    if (activeDrag) {
      var s = activeDrag;
      var rawX = mx - s.startX, rawY = my - s.startY;
      // Progressive resistance — harder to drag the farther you go
      var mag = Math.sqrt(rawX * rawX + rawY * rawY);
      var factor = mag > 50 ? 1 / (1 + (mag - 50) * 0.015) : 1;
      s.dx = rawX * factor;
      s.dy = rawY * factor;
    }
  });

  document.addEventListener('mousedown', function(e) {
    for (var i = 0; i < states.length; i++) {
      var rect = states[i].item.getBoundingClientRect();
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
    for (var i = 0; i < states.length; i++) {
      var s = states[i];
      var rect = s.item.getBoundingClientRect();
      var vh = window.innerHeight;
      if (rect.bottom < -200 || rect.top > vh + 200) continue;
      // Drag spring return to 0 when not actively dragging
      if (s !== activeDrag) {
        var dk = 0.1, ddamp = 0.74;
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
      var k = 0.06, damp = 0.88;
      s.cx += (s.tx - s.cx) * k;
      s.cy += (s.ty - s.cy) * k;
      s.cx *= damp;
      s.cy *= damp;
      var totalX = s.cx + s.dx;
      var totalY = s.cy + s.dy;
      // Snap when settled near 0
      if (s.stx === 0 && s.sty === 0 && s.dx === 0 && s.dy === 0 && Math.abs(s.cx) < 0.08 && Math.abs(s.cy) < 0.08) {
        s.cx = 0; s.cy = 0;
        s.item.style.transform = 'perspective(1000px) rotateX(0)';
      }
      var d = Math.sqrt(totalX * totalX + totalY * totalY);
      var scale = 1 + d * 0.004;
      s.el.style.transform = 'translate(' + totalX + 'px,' + totalY + 'px) scale(' + scale + ')';
      // Tilt from hover only, not from drag (only vertical tilt, large angle)
      var rx = s.cy * 2.2;
      s.item.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg)';
    }
    requestAnimationFrame(loop);
  })();
})();

// ═══════════ SCROLL REVEAL ═══════════
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('anim-done'); });
}, { threshold: 0.04, rootMargin: '0px 0px -16px 0px' });
document.querySelectorAll('.anim-up').forEach(function(el) { revealObserver.observe(el); });

// ═══════════ FOOTER CTA REVEAL ═══════════
var footerCta = document.getElementById('footerCta');
if (footerCta) {
  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) footerCta.classList.add('revealed');
  }, { threshold: 0.3 }).observe(footerCta);
}

// ═══════════ COUNTER ANIMATION ═══════════
var counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var el = entry.target; if (el._counted) return; el._counted = true;
      var target = parseInt(el.dataset.count, 10);
      var suffixEl = el.querySelector('span'), suffix = suffixEl ? suffixEl.textContent : '';
      var duration = 1600, start = null;
      (function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1), eased = 1 - Math.pow(1 - progress, 4);
        el.innerHTML = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      })(0);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-num[data-count]').forEach(function(el) { counterObserver.observe(el); });

// ═══════════ WORK DETAIL ═══════════
document.querySelectorAll('.work-card').forEach(function(card) {
  card.addEventListener('click', function() {
    var key = this.dataset.work; if (!workData[key]) return;
    openDetail(workData[key], this.dataset.hero);
  });
});

function openDetail(data, heroImg) {
  pageTransition.classList.add('active'); setTimeout(function() { pageTransition.classList.remove('active'); }, 1000);
  document.getElementById('detailTag').textContent = data.tag;
  document.getElementById('detailTitle').textContent = data.name;
  document.getElementById('detailSubtitle').textContent = data.subtitle;
  document.getElementById('detailHeroImg').src = heroImg;
  document.getElementById('detailMeta').innerHTML = Object.keys(data.meta).map(function(k) {
    return '<div class="detail-meta-item"><span class="detail-meta-label">' + k + '</span><span class="detail-meta-value">' + data.meta[k] + '</span></div>';
  }).join('');
  document.getElementById('detailContent').innerHTML = data.content.map(function(s) {
    return '<h2>' + s.h2 + '</h2><p>' + s.p + '</p>';
  }).join('');
  document.getElementById('detailGallery').innerHTML = data.gallery.map(function(src) {
    return '<img src="' + src + '" alt="" loading="lazy">';
  }).join('');
  document.body.style.overflow = 'hidden'; workDetail.style.display = 'block'; workDetail.scrollTop = 0;
  requestAnimationFrame(function() { workDetail.classList.add('open'); });
}

function closeDetail() {
  workDetail.classList.remove('open');
  setTimeout(function() { workDetail.style.display = 'none'; document.body.style.overflow = ''; }, 700);
}

document.getElementById('detailClose').addEventListener('click', closeDetail);
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && workDetail.classList.contains('open')) closeDetail();
  if (workDetail.classList.contains('open')) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' }); }
  if (e.key === 'ArrowUp') { e.preventDefault(); window.scrollBy({ top: -window.innerHeight * 0.7, behavior: 'smooth' }); }
});
workDetail.addEventListener('wheel', function(e) {
  e.stopPropagation();
  var atTop = workDetail.scrollTop <= 0, atBottom = workDetail.scrollTop + workDetail.clientHeight >= workDetail.scrollHeight - 2;
  if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) e.preventDefault();
}, { passive: false });

// ═══════════ MOTION / VIDEO CAROUSEL ═══════════
(function() {
  var hero = document.getElementById('motionHero');
  var track = document.getElementById('motionTrack');
  if (!track || !hero) return;
  var slides = track.querySelectorAll('.motion-slide');
  var videos = track.querySelectorAll('video');
  var current = 0, total = slides.length;
  var isDragging = false, startX = 0, dragged = false;

  // offset = (i - current + total) % total, then wrap to [-floor(total/2), floor(total/2)]
  function applyOffsets() {
    for (var i = 0; i < total; i++) {
      var raw = (i - current + total) % total;
      // Map to nearest: if raw > total/2 then raw - total for negative side
      var offset = raw > total / 2 ? raw - total : raw;
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
    for (var j = 0; j < videos.length; j++) {
      if (j === current) { videos[j].currentTime = 0; videos[j].play().catch(function(){}); }
      else { videos[j].pause(); videos[j].currentTime = 0; }
    }
  }

  // Video ended -> auto next
  for (var v = 0; v < videos.length; v++) {
    videos[v].addEventListener('ended', function() {
      next();
    });
  }

  // Drag / swipe — right-to-left drag = next(), left-to-right = prev()
  var onDown = function(e) {
    isDragging = true; startX = e.clientX || (e.touches && e.touches[0].clientX); dragged = false;
    hero.classList.add('dragging');
  };
  var onMove = function(e) {
    if (!isDragging) return;
    var mx = e.clientX || (e.touches && e.touches[0].clientX);
    if (Math.abs(mx - startX) > 8) dragged = true;
  };
  var onUp = function(e) {
    if (!isDragging) return;
    isDragging = false;
    hero.classList.remove('dragging');
    if (!dragged) return;
    var mx = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
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
    var p = videos[idx].play();
    if (p && p.then) {
      p.then(function() {
        // Success: hide any fallback button
        var btn = slides[idx].querySelector('.motion-play-btn');
        if (btn) btn.classList.remove('show');
      }).catch(function() {
        // Autoplay blocked: show fallback play button
        var existing = slides[idx].querySelector('.motion-play-btn');
        var btn;
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
    var btn = e.target.closest('.motion-play-btn');
    if (!btn) return;
    btn.classList.remove('show');
    videos[current].play().catch(function(){});
    e.stopPropagation();
  });

  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      tryPlay(current);
    } else {
      for (var v2 = 0; v2 < videos.length; v2++) videos[v2].pause();
    }
  }, { threshold: 0.3 }).observe(track);
})();

// MENU PANEL
(function() {
  var btn = document.getElementById('navMenuBtn');
  var panel = document.getElementById('menuPanel');
  var closeBtn = document.getElementById('menuPanelClose');
  if (!btn || !panel) return;

  function openMenu() {
    btn.classList.add('open');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0';
    var sb = document.getElementById('scrollBar');
    if (sb) sb.style.display = 'none';
  }

  function closeMenu() {
    btn.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
    cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0';
    var sb = document.getElementById('scrollBar');
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
      var target = document.getElementById(link.dataset.link);
      if (!target) return;
      closeMenu();
      pageTransition.classList.add('active');
      setTimeout(function() { pageTransition.classList.remove('active'); }, 1000);
      var top = link.dataset.link === 'home' ? 0 : target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
      if (workDetail && workDetail.classList.contains('open')) closeDetail();
    });
  });
})();

// ═══════════ STARS BACKGROUND ═══════════
(function() {
  var canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var stars = [];
  var TARGET_COUNT = window.innerWidth <= 768 ? 100 : 260;
  var frameCount = 0;
  var w, h, dpr;

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
    var depth = Math.pow(Math.random(), 3);
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
    for (var i = 0; i < TARGET_COUNT; i++) {
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
    var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
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
      var vignette = ctx.createRadialGradient(w * 0.5, h * 0.4, h * 0.15, w * 0.5, h * 0.4, w * 0.75);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    }

    var t = ts * 0.001;

    for (var i = stars.length - 1; i >= 0; i--) {
      var s = stars[i];
      s.life++;

      var lifeRatio = s.maxLife > 0 ? s.life / s.maxLife : 1;
      var fadeAlpha = 1;
      if (lifeRatio > 0.85) {
        fadeAlpha = 1 - (lifeRatio - 0.85) / 0.15;
      } else if (lifeRatio < 0.1) {
        fadeAlpha = lifeRatio / 0.1;
      }

      var twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
      var alpha = s.peakOpacity * twinkle * fadeAlpha;

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
          var cross = s.r * 3.5;
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
        var replacement = spawnStar();
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
  var canvas = document.getElementById('framesCanvas');
  if (!canvas) return;
  if (getComputedStyle(canvas).display === 'none') return;
  if ('ontouchstart' in window) { canvas.style.display = 'none'; return; }
  var ctx = canvas.getContext('2d');

  var knobColors = ['#e85570', '#444444', '#bbbbbb', '#3ccda0'];
  var ringImages = [null, null, null, null];
  var ringLoaded = [false, false, false, false];

  (function preloadImages() {
    var cards = document.querySelectorAll('.work-card');
    cards.forEach(function(card, i) {
      if (i >= 4) return;
      (function(idx) {
        var img = new Image();
        img.src = card.dataset.image;
        img.onload = function() {
          ringImages[idx] = img;
          ringLoaded[idx] = true;
        };
        img.onerror = function() { ringLoaded[idx] = true; };
      })(i);
    });
  })();

  var springK = 0.05;
  var damping = 0.84;
  var gravity = 0.06;

  var thumbs = [];
  var draggedIdx = -1;
  var hoveredIdx = -1;
  var dragOffX = 0, dragOffY = 0;
  var dragStartX = 0, dragStartY = 0;
  var prevMouseX = 0, prevMouseY = 0;
  var mouseCanvasX = 0, mouseCanvasY = 0;

  function getCircleSz(screenW) {
    if (screenW >= 1800) return 156;
    if (screenW >= 1400) return 140;
    if (screenW >= 1024) return 120;
    if (screenW >= 768) return 104;
    return 88;
  }

  function resize() {
    var hero = document.getElementById('home');
    if (!hero) return;
    var rect = hero.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var w = rect.width, h = rect.height;

    var sz = getCircleSz(w);
    var gap = sz * 1.1;
    var xOff = w < 1200 ? w * 0.52 : w * 0.58;
    var yOffsets = [0, sz * 0.12, sz * 0.24, sz * 0.36];
    var anchorY = 0;
    var anchorXs = [xOff, xOff + gap, xOff + gap * 2, xOff + gap * 3];
    var bottomY = h * 0.33;
    var anchors = [];
    for (var ai = 0; ai < 4; ai++) {
      anchors.push({
        x: anchorXs[ai],
        y: anchorY,
        restOffX: 0,
        stringLen: (bottomY + yOffsets[ai]) - anchorY
      });
    }

    if (thumbs.length === 0) {
      var loadDelay = 0.45;
      for (var i = 0; i < 4; i++) {
        var a = anchors[i];
        var cs = getCircleSz(w);
        var restX = a.x + a.restOffX;
        var restY = a.y + a.stringLen + (yOffsets[i] || 0);
        var startY = -cs * 3;
        var startX = restX + (Math.random() - 0.5) * 60;
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
      var cs2 = getCircleSz(w);
      for (var j = 0; j < 4; j++) {
        var b = anchors[j];
        thumbs[j].anchorX = b.x;
        thumbs[j].anchorY = b.y;
        thumbs[j].restX = b.x + b.restOffX;
        thumbs[j].restY = b.y + b.stringLen;
        thumbs[j].dispW = cs2;
        thumbs[j].dispH = cs2;
      }
    }
  }

  var startTime = 0;

  function update(ts) {
    if (!startTime) startTime = ts;
    var elapsed = (ts - startTime) / 1000;

    if (draggedIdx < 0) {
      hoveredIdx = getThumbAt(mouseCanvasX, mouseCanvasY);
    }

    for (var i = 0; i < thumbs.length; i++) {
      var t = thumbs[i];
      var targetHA = (i === hoveredIdx && draggedIdx < 0) ? 1 : 0;
      var speed = targetHA > t.hoverAlpha ? 0.04 : 0.05;
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

      var dx = t.restX - t.x;
      var dy2 = t.restY - t.y;
      t.vx += dx * springK;
      t.vy += dy2 * springK;
      t.vx *= damping;
      t.vy *= damping;
      t.x += t.vx;
      t.y += t.vy;
    }
  }

  function drawString(ax, ay, bx, by) {
    var dx = bx - ax, dy = by - ay;
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return;
    var segments = Math.floor(len * 2);
    if (segments < 40) segments = 40;
    var coils = Math.floor(len / 24);
    if (coils < 2) coils = 2;
    var amp = 12;

    ctx.beginPath();
    ctx.moveTo(ax, ay);
    var perpX = -dy / len;
    var perpY = dx / len;
    var subSegs = Math.floor(segments / 6);
    if (subSegs < 8) subSegs = 8;
    for (var g = 0; g < subSegs; g++) {
      var t0 = g / subSegs;
      var t1 = (g + 1) / subSegs;
      var alpha = 0.28 * (t0 + t1) / 2;
      ctx.beginPath();
      var x0 = ax + dx * t0 + perpX * Math.sin(t0 * coils * Math.PI * 2) * amp;
      var y0 = ay + dy * t0 + perpY * Math.sin(t0 * coils * Math.PI * 2) * amp;
      ctx.moveTo(x0, y0);
      var steps = Math.floor((t1 - t0) * segments);
      if (steps < 4) steps = 4;
      for (var s = 1; s <= steps; s++) {
        var tt = t0 + (s / steps) * (t1 - t0);
        var x = ax + dx * tt + perpX * Math.sin(tt * coils * Math.PI * 2) * amp;
        var y = ay + dy * tt + perpY * Math.sin(tt * coils * Math.PI * 2) * amp;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(' + (isLight ? '0,0,0' : '255,255,255') + ',' + alpha + ')';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function drawThumb(t, idx) {
    if (t.y + t.dispH < -20) return;

    var r = t.dispW / 2;
    var ha = t.hoverAlpha || 0;

    var spinning = (idx === hoveredIdx || idx === draggedIdx) ? 1 : 0;
    if (t._spin === undefined) t._spin = Math.random() * Math.PI * 2;
    if (t._spinSpeed === undefined) t._spinSpeed = 0;
    if (t._spinTimer === undefined) t._spinTimer = 0;
    if (spinning) {
      t._spinTimer += 1 / 60;
    } else {
      t._spinTimer = 0;
    }
    var active = t._spinTimer > 0.2 ? 1 : 0;
    t._spinSpeed += (active * 0.015 - t._spinSpeed) * 0.04;
    t._spin += t._spinSpeed;

    var eased = ha < 0.01 ? 0 : 1 - Math.pow(1 - ha, 3);
    var scale = 1 + eased * 0.09;

    // 常亮白色雾状外发光
    var softGlow = ctx.createRadialGradient(t.x, t.y, r * 0.8, t.x, t.y, r * 1.8);
    softGlow.addColorStop(0, 'rgba(255,255,255,0.10)');
    softGlow.addColorStop(0.5, 'rgba(255,255,255,0.03)');
    softGlow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = softGlow;
    ctx.fillRect(t.x - r * 3, t.y - r * 3, r * 6, r * 6);

    // hover 增强发光 — 统一白色
    if (ha > 0.01) {
      var glowR = r * 3;
      var grad = ctx.createRadialGradient(t.x, t.y, r * 0.3, t.x, t.y, glowR);
      grad.addColorStop(0, 'rgba(255,255,255,' + (eased * 0.25) + ')');
      grad.addColorStop(0.5, 'rgba(255,255,255,' + (eased * 0.08) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(t.x - glowR, t.y - glowR, glowR * 2, glowR * 2);
    }

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
      var img = ringImages[idx];
      var iw = img.width, ih = img.height;
      // 按内径填满环形外圈，确保圆环完全被图片覆盖
      var scaleImg = Math.max(r * 2 / iw, r * 2 / ih) * 1.3;
      var dw = iw * scaleImg, dh = ih * scaleImg;
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
    var cw = canvas.width / (window.devicePixelRatio || 1);
    var ch = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, cw, ch);
    for (var i = 0; i < thumbs.length; i++) {
      drawThumb(thumbs[i], i);
    }
    requestAnimationFrame(render);
  }

  function getThumbAt(mx, my) {
    for (var i = 0; i < thumbs.length; i++) {
      var t = thumbs[i];
      if (t.entering && t.y < t.restY) continue;
      var r = t.dispW / 2;
      var dx = mx - t.x, dy = my - t.y;
      if (dx * dx + dy * dy <= r * r * 1.44) {
        return i;
      }
    }
    return -1;
  }

  canvas.addEventListener('mousedown', function(e) {
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var idx = getThumbAt(mx, my);
    if (idx !== -1) {
      draggedIdx = idx;
      var t = thumbs[idx];
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
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    mouseCanvasX = mx;
    mouseCanvasY = my;
    if (draggedIdx >= 0) {
      var t = thumbs[draggedIdx];
      t.x = mx + dragOffX;
      t.y = my + dragOffY;
      t.vx = (mx - prevMouseX) * 0.4;
      t.vy = (my - prevMouseY) * 0.4;
      prevMouseX = mx;
      prevMouseY = my;
    } else {
      canvas.style.cursor = getThumbAt(mx, my) >= 0 ? 'grab' : '';
    }
  });

  canvas.addEventListener('mouseup', function(e) {
    if (draggedIdx >= 0) {
      var rect = canvas.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;
      var dist = Math.sqrt(Math.pow(mx - dragStartX, 2) + Math.pow(my - dragStartY, 2));
      if (dist < 3) {
        var works = document.querySelectorAll('.work-card');
        if (works[draggedIdx]) {
          var card = works[draggedIdx];
          var key = card.dataset.work;
          var hero = card.dataset.hero;
          if (key && workData && workData[key]) {
            openDetail(workData[key], hero);
          }
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
  var btn = document.getElementById('backToTop');
  if (!btn) return;

  // Show after scrolling past hero
  var hero = document.getElementById('home');
  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      btn.classList.remove('visible');
    } else {
      btn.classList.add('visible');
    }
  }, { threshold: 0 }).observe(hero);

  btn.addEventListener('click', function() {
    // Smooth scroll with custom easing via requestAnimationFrame
    var start = window.scrollY;
    var startTime = null;
    var duration = 1000;

    function step(ts) {
      if (!startTime) startTime = ts;
      var elapsed = ts - startTime;
      var progress = Math.min(elapsed / duration, 1);
      // Ease out quint — fast start, gentle landing
      var eased = 1 - Math.pow(1 - progress, 5);
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
  var ticksContainer = document.getElementById('scrollTicks');
  function generateTicks() {
    if (!ticksContainer) return;
    ticksContainer.innerHTML = '';
    var h = document.documentElement;
    var totalH = h.scrollHeight - h.clientHeight;
    if (totalH <= 0) return;
    var dots = bar.querySelectorAll('.scroll-dot-marker');
    for (var d = 0; d < dots.length - 1; d++) {
      var elA = document.querySelector(dots[d].getAttribute('data-target'));
      var elB = document.querySelector(dots[d + 1].getAttribute('data-target'));
      if (!elA || !elB) continue;
      var topA = (elA.getBoundingClientRect().top + h.scrollTop) / totalH * 100;
      var topB = (elB.getBoundingClientRect().top + h.scrollTop) / totalH * 100;
      if (topA >= topB) continue;
      var step = (topB - topA) / 4;
      for (var t = 1; t <= 3; t++) {
        var pct = topA + step * t;
        var tick = document.createElement('div');
        tick.className = 'scroll-tick';
        tick.style.top = pct + '%';
        ticksContainer.appendChild(tick);
      }
    }
  }

  // --- Show/hide based on scroll position (hide on hero, show after) ---
  function updateVisibility() {
    var heroH = window.innerHeight;
    var scrolled = window.scrollY;
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
  var dotLabels = { '#home': '00', '#work': '01', '#ice': '02', '#showcase': '03', '#motion': '04', '#about': '05' };
  var dots = bar.querySelectorAll('.scroll-dot-marker');

  // --- smooth wheel scroll (declared early for bubble click) ---
  var wheelTarget = document.documentElement.scrollTop;
  var wheelCurrent = wheelTarget;
  var wheelRaf = null;

  function startWheelLerp() {
    // Don't interfere with bubble-click lerpScroll
    if (lerpActive && bubbleLerpStartTime > 0) return;
    if (wheelRaf) return;
    wheelRaf = requestAnimationFrame(function tick() {
      // Yield to lerpScroll if it's handling a bubble click
      if (lerpActive && bubbleLerpStartTime > 0) { wheelRaf = null; return; }
      var diff = wheelTarget - wheelCurrent;
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
    var targetId = dot.getAttribute('data-target');
    var label = dotLabels[targetId] || '';
    if (!label) return;
    var bubble = document.createElement('span');
    bubble.className = 'scroll-bubble';
    bubble.textContent = 'P' + label;
    dot.appendChild(bubble);
    // click bubble → smooth scroll with custom easing
    bubble.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      var el = document.querySelector(targetId);
      if (!el) return;
      var totalH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var targetTop = el.getBoundingClientRect().top + document.documentElement.scrollTop - document.documentElement.clientHeight * 0.1;
      targetScroll = Math.max(0, Math.min(totalH, targetTop));
      bubbleLerpStartScroll = document.documentElement.scrollTop;
      // Duration based on distance: min 600ms, max 1800ms
      var scrollDist = Math.abs(targetScroll - bubbleLerpStartScroll);
      var viewH = document.documentElement.clientHeight;
      var screens = scrollDist / viewH;
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
    var positions = [];
    dots.forEach(function(dot) {
      var targetId = dot.getAttribute('data-target');
      var el = document.querySelector(targetId);
      if (!el) return;
      var elTop = el.getBoundingClientRect().top + h.scrollTop + h.clientHeight * 0.05;
      positions.push(elTop);
    });
    return positions;
  }

  var bubbleLerpStartTime = 0;
  var bubbleLerpDuration = 0;
  var bubbleLerpStartScroll = 0;

  function lerpScroll() {
    if (!lerpActive) return;
    var diff = targetScroll - currentScroll;
    var speed = 0.2;
    // snap damping: magnetic pull near dot anchors (drag only)
    if (dragging) {
      var dots = getDotScrollPositions();
      var totalH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var snapZone = totalH * 0.06;
      for (var i = 0; i < dots.length; i++) {
        var dist = Math.abs(currentScroll - dots[i]);
        if (dist < snapZone) {
          speed = 0.03 + (dist / snapZone) * 0.17;
          break;
        }
      }
    } else if (bubbleLerpStartTime > 0) {
      // Use custom easeInOutCubic for smooth acceleration + deceleration
      var elapsed = performance.now() - bubbleLerpStartTime;
      var progress = Math.min(elapsed / bubbleLerpDuration, 1);
      // easeInOutCubic: smooth start, smooth end
      var eased = progress < 0.5
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
    var el = document.querySelector(targetId);
    if (!el) return;
    var totalH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var targetTop = el.getBoundingClientRect().top + document.documentElement.scrollTop - document.documentElement.clientHeight * 0.1;
    targetScroll = Math.max(0, Math.min(totalH, targetTop));
    bubbleLerpStartScroll = document.documentElement.scrollTop;
    var scrollDist = Math.abs(targetScroll - bubbleLerpStartScroll);
    var viewH = document.documentElement.clientHeight;
    var screens = scrollDist / viewH;
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
    var totalH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (!wheelRaf) {
      wheelCurrent = document.documentElement.scrollTop;
      wheelTarget = wheelCurrent;
    }
    wheelTarget += e.deltaY * 1.2;
    wheelTarget = Math.max(0, Math.min(totalH, wheelTarget));
    startWheelLerp();
  }, {passive: false});
})();
