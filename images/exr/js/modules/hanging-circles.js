;// ═══════════ HANGING CIRCLES ═══════════
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
