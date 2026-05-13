const COLORS = ['#ff3d7a', '#d6ff3a', '#3affd3', '#ffffff', '#ff8c00'];

export function burstConfetti(x, y, count = 25) {
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    piece.style.left = x + 'px';
    piece.style.top = y + 'px';
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 200;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance + 200;
    const rotation = Math.random() * 720;
    piece.style.transition = 'transform 1.2s ease-out, opacity 1.2s';
    document.body.appendChild(piece);
    requestAnimationFrame(() => {
      piece.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotation}deg)`;
      piece.style.opacity = '0';
    });
    setTimeout(() => piece.remove(), 1300);
  }
}

export function burstFromElement(el, count = 25) {
  const rect = el.getBoundingClientRect();
  burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, count);
}

export function burstFromCenter(count = 50) {
  burstConfetti(window.innerWidth / 2, window.innerHeight / 2, count);
}
