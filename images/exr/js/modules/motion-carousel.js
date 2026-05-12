;// ═══════════ MOTION / VIDEO CAROUSEL ═══════════
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
