/* ═══════════════════════════════════════════
   PORTFOLIO — APP JS v7 · ART DIRECTION
   ═══════════════════════════════════════════ */

var workData = {
  flux: {
    name: 'Chromatic Flux', tag: 'Abstract \u00b7 Color Field',
    subtitle: 'Oil on canvas. An exploration of chromatic tension and release.',
    meta: { Medium: 'Oil on Canvas', Dimensions: '120 \u00d7 180 cm', Year: '2026' },
    content: [
      { h2: 'About This Work', p: 'Chromatic Flux is the culmination of a year-long investigation into how adjacent hues interact at their boundaries. The painting uses over forty individually mixed oil pigments, applied in thin, translucent layers that build depth through optical blending rather than physical mixing.' },
      { h2: 'Process', p: 'Each layer required three to five days of drying time. The painting evolved slowly, with earlier layers influencing\u2014but not dictating\u2014later decisions. This deliberate pace allowed the color relationships to develop organically, almost geologically.' },
      { h2: 'Context', p: 'This piece is part of the ongoing Chromatic Series, which examines color not as a property of objects but as a phenomenon in itself\u2014something to be experienced directly, without the mediation of representation.' }
    ],
    gallery: ['images/detail/g1-1.jpg', 'images/detail/g1-2.jpg']
  },
  silence: {
    name: 'The Shape of Silence', tag: 'Digital \u00b7 Minimal',
    subtitle: 'A digital meditation on negative space and quiet intensity.',
    meta: { Medium: 'Digital Painting', Dimensions: '4096 \u00d7 2160 px', Year: '2025' },
    content: [
      { h2: 'About This Work', p: 'The Shape of Silence began as an experiment in restraint. How much can you remove from an image before it loses its voice? The answer, I discovered, is almost everything\u2014as long as what remains is placed with absolute conviction.' },
      { h2: 'Process', p: 'Created entirely in a digital environment, this piece went through over sixty iterations. Each version stripped away another element until only the essential forms remained. The final composition uses just three distinct values.' },
      { h2: 'Context', p: 'This work was featured in the 2025 Digital Arts Biennale and later acquired by a private collector in Berlin. It represents a turning point in my digital practice toward greater economy of means.' }
    ],
    gallery: ['images/detail/g2-1.jpg', 'images/detail/g2-2.jpg']
  },
  neon: {
    name: 'Neon Liturgy', tag: 'Installation \u00b7 Light Art',
    subtitle: 'Acrylic, LED, and the ritual of artificial light.',
    meta: { Medium: 'Acrylic & LED Installation', Dimensions: '150 \u00d7 200 cm', Year: '2024' },
    content: [
      { h2: 'About This Work', p: 'Neon Liturgy transforms a gallery wall into a luminous altar. Seven individually programmed LED strips respond to ambient sound, creating a constantly shifting composition that never repeats.' },
      { h2: 'Process', p: 'The acrylic panels were cast by hand, each with a unique surface texture that scatters light differently. The LEDs are controlled by a custom microcontroller running a generative algorithm that samples room tone and conversation fragments.' },
      { h2: 'Context', p: 'Originally commissioned for a group show exploring the intersection of technology and ritual, Neon Liturgy has since been adapted for three different venues, each time responding to the unique acoustic profile of its new environment.' }
    ],
    gallery: ['images/detail/g3-1.png', 'images/detail/g3-2.png']
  },
  tidal: {
    name: 'Tidal Memory', tag: 'Projection \u00b7 Site-Specific',
    subtitle: 'An ephemeral intervention mapping memory onto urban surfaces.',
    meta: { Medium: 'Projection Mapping', Dimensions: 'Site-specific / Variable', Year: '2023' },
    content: [
      { h2: 'About This Work', p: 'Tidal Memory is a site-specific projection piece that maps historical imagery onto the facade of a decommissioned riverside warehouse. The projected images rise and fall in intensity, synchronized with real-time tidal data from the adjacent river.' },
      { h2: 'Process', p: 'The projection mapping was developed using lidar scans of the building surface, allowing the imagery to conform precisely to every brick and window frame. The real-time data connection to tidal sensors means no two viewings are ever identical.' },
      { h2: 'Context', p: 'Commissioned for the 2023 Riverside Art Festival, Tidal Memory ran for three nights and was experienced by over 15,000 visitors. Documentation of the piece was later exhibited as a multi-channel video installation.' }
    ],
    gallery: ['images/detail/g4-1.png', 'images/detail/g4-2.png']
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
  var el = document.getElementById('loaderCounter');
  var loaderEl = document.getElementById('loader');
  if (!el || !loaderEl) { revealCrescent(); if (loaderEl) loaderEl.style.display = 'none'; document.body.style.cursor = 'none'; return; }
  var count = 0, total = 40;
  var iv = setInterval(function() {
    count++;
    var pct = count / total, eased = 1 - Math.pow(1 - pct, 4);
    el.textContent = Math.min(Math.round(eased * 100), 100);
    if (count >= total) {
      clearInterval(iv); el.textContent = '100';
      setTimeout(function() {
        loaderEl.classList.add('hide'); revealCrescent();
        setTimeout(function() { loaderEl.style.display = 'none'; document.body.style.cursor = 'none'; }, 600);
      }, 350);
    }
  }, 28);

  function revealCrescent() {
    document.querySelectorAll('.cr-char').forEach(function(el) {
      el.classList.add('revealed');
      el.style.transitionDelay = (el.style.getPropertyValue('--cr-delay') || '0') + 's';
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

// ═══════════ HOVER PREVIEW (smaller: 300x220) ═══════════
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
  if (activeImg && window.innerWidth > 900) {
    var dx = targetX - currentX, dy = targetY - currentY;
    currentX += dx * 0.12; currentY += dy * 0.12;
    activeImg.style.left = currentX + 'px'; activeImg.style.top = currentY + 'px';
  }
  requestAnimationFrame(animateHover);
})();

// ═══════════ PARALLAX SHOWCASE — mouse-follow with lerp delay ═══════════
(function() {
  var items = document.querySelectorAll('.showcase-item[data-parallax]');
  if (items.length === 0) return;

  // Per-item lerp state
  var states = [];
  for (var i = 0; i < items.length; i++) {
    var bg = items[i].querySelector('.showcase-bg');
    if (!bg) continue;
    states.push({ el: bg, item: items[i], tx: 0, ty: 0, cx: 0, cy: 0 });
  }

  document.addEventListener('mousemove', function(e) {
    var mx = e.clientX, my = e.clientY;
    for (var i = 0; i < states.length; i++) {
      var rect = states[i].item.getBoundingClientRect();
      var vh = window.innerHeight;
      // Only track when item is in viewport
      if (rect.bottom < -100 || rect.top > vh + 100) continue;
      // Map mouse position to parallax range (-25px to +25px)
      var relX = (mx - rect.left) / rect.width - 0.5;
      var relY = (my - rect.top) / rect.height - 0.5;
      states[i].tx = relX * 30;
      states[i].ty = relY * 28;
    }
  });

  (function loop() {
    for (var i = 0; i < states.length; i++) {
      var s = states[i];
      var rect = s.item.getBoundingClientRect();
      var vh = window.innerHeight;
      if (rect.bottom < -200 || rect.top > vh + 200) continue;
      // Lerp toward target with delay factor
      s.cx += (s.tx - s.cx) * 0.06;
      s.cy += (s.ty - s.cy) * 0.06;
      var d = Math.sqrt(s.cx * s.cx + s.cy * s.cy);
      var scale = 1.08 + d * 0.001;
      s.el.style.transform = 'translate(' + s.cx + 'px,' + s.cy + 'px) scale(' + scale + ')';
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

  // Keyboard
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') next();
    if (e.key === 'ArrowRight') prev();
  });

  // Init
  applyOffsets();
  videos[current].play().catch(function(){});

  // Auto-play active when in view
  new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      videos[current].play().catch(function(){});
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
  }

  function closeMenu() {
    btn.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
    cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0';
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
  var TARGET_COUNT = 260;
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

    // Subtle vignette overlay for depth
    var vignette = ctx.createRadialGradient(w * 0.5, h * 0.4, h * 0.15, w * 0.5, h * 0.4, w * 0.75);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

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
        ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
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
    init();
  });
})();

// ═══════════ HANGING FRAMES ═══════════
(function() {
  var canvas = document.getElementById('framesCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  // Preload work images
  var frameImages = [
    'images/works/image1.jpg',
    'images/works/image2.jpg',
    'images/works/image3.jpg',
    'images/works/image4.jpg'
  ];
  var loadedImages = [null, null, null, null];
  var imgNaturalW = [0, 0, 0, 0], imgNaturalH = [0, 0, 0, 0];
  for (var fi = 0; fi < 4; fi++) {
    (function(idx) {
      var img = new Image();
      img.onload = function() {
        loadedImages[idx] = img;
        imgNaturalW[idx] = img.naturalWidth;
        imgNaturalH[idx] = img.naturalHeight;
      };
      img.src = frameImages[idx];
    })(fi);
  }

  var maxThumbW = 190;
  var springK = 0.12;
  var damping = 0.94;
  var gravity = 0.08;

  var thumbs = [];
  var draggedIdx = -1;
  var dragOffX = 0, dragOffY = 0;
  var dragStartX = 0, dragStartY = 0;
  var prevMouseX = 0, prevMouseY = 0;

  function getThumbSize(idx) {
    var nw = imgNaturalW[idx] || 300;
    var nh = imgNaturalH[idx] || 200;
    var w = maxThumbW;
    var h = w * (nh / nw);
    return { w: w, h: h };
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

    var anchorY = 0;
    var spacing = maxThumbW * 0.7;
    var baseX = w * 0.56;
    var anchors = [
      { x: baseX,           y: anchorY, restOffX: 0, stringLen: h * 0.42 },
      { x: baseX + spacing, y: anchorY, restOffX: 0, stringLen: h * 0.50 },
      { x: baseX + spacing * 2, y: anchorY, restOffX: 0, stringLen: h * 0.38 },
      { x: baseX + spacing * 3, y: anchorY, restOffX: 0, stringLen: h * 0.46 }
    ];

    if (thumbs.length === 0) {
      for (var i = 0; i < 4; i++) {
        var a = anchors[i];
        var sz = getThumbSize(i);
        var restX = a.x + a.restOffX;
        var restY = a.y + a.stringLen;
        // Start above viewport for drop-in
        var startY = -sz.h * 1.5;
        thumbs.push({
          x: restX, y: startY, vx: 0, vy: 0,
          anchorX: a.x, anchorY: a.y,
          restX: restX, restY: restY,
          dispW: sz.w, dispH: sz.h,
          entering: true,
          enterDelay: i * 0.15
        });
      }
    } else {
      for (var j = 0; j < 4; j++) {
        var b = anchors[j];
        thumbs[j].anchorX = b.x;
        thumbs[j].anchorY = b.y;
        thumbs[j].restX = b.x + b.restOffX;
        thumbs[j].restY = b.y + b.stringLen;
        var sz2 = getThumbSize(j);
        thumbs[j].dispH = sz2.h;
      }
    }
  }

  var startTime = 0;

  function update(ts) {
    if (!startTime) startTime = ts;
    var elapsed = (ts - startTime) / 1000;

    for (var i = 0; i < thumbs.length; i++) {
      var t = thumbs[i];
      if (i === draggedIdx) continue;

      // Entry drop
      if (t.entering) {
        if (elapsed < t.enterDelay) continue;
        t.vy += gravity;
        t.y += t.vy;
        // Bounce off rest position
        if (t.y >= t.restY) {
          t.y = t.restY;
          t.vy *= -0.35;
          if (Math.abs(t.vy) < 0.8) {
            t.y = t.restY;
            t.vy = 0;
            t.entering = false;
          }
        }
        continue;
      }

      // Spring toward rest
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
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Knot at anchor
    ctx.beginPath();
    ctx.arc(ax, ay, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fill();
  }

  function drawThumb(t, idx) {
    // Don't draw if still far above viewport
    if (t.y + t.dispH < -20) return;

    var hw = t.dispW / 2;
    var hh = t.dispH / 2;

    drawString(t.anchorX, t.anchorY, t.x, t.y - hh);

    ctx.save();
    ctx.translate(t.x, t.y);

    // Outer glow
    ctx.shadowColor = 'rgba(0,212,104,0.18)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    var rx = -hw, ry = -hh, rr = 10;
    ctx.beginPath();
    roundedRect(ctx, rx, ry, t.dispW, t.dispH, rr);
    ctx.save();
    ctx.clip();

    if (loadedImages[idx]) {
      ctx.drawImage(loadedImages[idx], rx, ry, t.dispW, t.dispH);
    } else {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(rx, ry, t.dispW, t.dispH);
    }

    ctx.restore();

    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }

  function roundedRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
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
      var hw = t.dispW / 2, hh = t.dispH / 2;
      if (mx > t.x - hw && mx < t.x + hw && my > t.y - hh && my < t.y + hh) {
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
    if (draggedIdx >= 0) {
      var t = thumbs[draggedIdx];
      t.x = mx + dragOffX;
      t.y = my + dragOffY;
      t.vx = (mx - prevMouseX) * 0.8;
      t.vy = (my - prevMouseY) * 0.8;
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
        // Open corresponding detail overlay
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
      canvas.style.cursor = '';
    }
  });

  canvas.addEventListener('mouseleave', function() {
    if (draggedIdx >= 0) draggedIdx = -1;
    canvas.style.cursor = '';
  });

  // Touch
  canvas.addEventListener('touchstart', function(e) {
    if (e.touches.length !== 1) return;
    var rect = canvas.getBoundingClientRect();
    var mx = e.touches[0].clientX - rect.left;
    var my = e.touches[0].clientY - rect.top;
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
      e.preventDefault();
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', function(e) {
    if (draggedIdx < 0) return;
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var mx = e.touches[0].clientX - rect.left;
    var my = e.touches[0].clientY - rect.top;
    var t = thumbs[draggedIdx];
    t.x = mx + dragOffX;
    t.y = my + dragOffY;
    t.vx = (mx - prevMouseX) * 0.8;
    t.vy = (my - prevMouseY) * 0.8;
    prevMouseX = mx;
    prevMouseY = my;
  }, { passive: false });

  canvas.addEventListener('touchend', function(e) {
    if (draggedIdx < 0) return;
    var dist = Math.sqrt(Math.pow(prevMouseX - dragStartX, 2) + Math.pow(prevMouseY - dragStartY, 2));
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
  });

  resize();
  requestAnimationFrame(render);

  window.addEventListener('resize', function() { resize(); });
})();
