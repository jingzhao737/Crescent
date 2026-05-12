;// ═══════════ HOVER PREVIEW (desktop only) ═══════════
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
