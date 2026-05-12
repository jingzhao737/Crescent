;/* THEME */
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
