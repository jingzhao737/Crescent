;// ═══════════ PARALLAX SHOWCASE — hover tilt + drag + spring return ═══════════
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
