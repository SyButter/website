// Motion is progressive enhancement: content remains visible if it is unavailable.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const animations = new Set();

const timeline = document.querySelector('.experience-list');
if (timeline && 'IntersectionObserver' in window && !reducedMotion.matches) {
  timeline.classList.add('timeline-enabled');
  const timelineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('timeline-arrived');
      timelineObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  timeline.querySelectorAll('article').forEach(row => timelineObserver.observe(row));
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      timeline.classList.remove('timeline-enabled');
      timelineObserver.disconnect();
    }
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const arriving = entries.filter(entry => entry.isIntersecting);
    arriving.forEach((entry, index) => {
      observer.unobserve(entry.target);
      if (reducedMotion.matches || !entry.target.animate) return;
      const animation = entry.target.animate([
        { opacity: 0, translate: '0 24px' },
        { opacity: 1, translate: '0 0' }
      ], { duration: 650, delay: Math.min(index, 3) * 85, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
      animations.add(animation);
      animation.onfinish = animation.oncancel = () => animations.delete(animation);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .about-grid > div, .experience-list, .project-card, .contact-inner').forEach(element => observer.observe(element));
}

const resetCards = [];
document.querySelectorAll('.button').forEach(button => {
  let frame = 0;
  let pointer;
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    ['--metal-x', '--metal-y', '--metal-hue'].forEach(property => button.style.removeProperty(property));
  };
  button.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
    pointer = { x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const bounds = button.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (pointer.x - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (pointer.y - bounds.top) / bounds.height));
      button.style.setProperty('--metal-x', `${x * 100}%`);
      button.style.setProperty('--metal-y', `${y * 100}%`);
      button.style.setProperty('--metal-hue', String(205 + x * 25 + y * 8));
    });
  }, { passive: true });
  button.addEventListener('pointerleave', reset);
  button.addEventListener('pointercancel', reset);
  window.addEventListener('blur', reset);
  finePointer.addEventListener('change', reset);
  reducedMotion.addEventListener('change', reset);
});

document.querySelectorAll('.project-card').forEach(card => {
  let frame = 0;
  let pointer;
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    card.classList.remove('is-tilting');
    ['--tilt-x', '--tilt-y'].forEach(property => card.style.removeProperty(property));
  };
  resetCards.push(reset);
  card.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
    pointer = { x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const bounds = card.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (pointer.x - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (pointer.y - bounds.top) / bounds.height));
      card.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`);
      card.style.setProperty('--tilt-y', `${(x - 0.5) * 5}deg`);
      card.classList.add('is-tilting');
    });
  }, { passive: true });
  card.addEventListener('pointerleave', reset);
  card.addEventListener('pointercancel', reset);
  // Reset depth while scrolling so a stationary cursor cannot leave cards tilted.
});
const resetDepth = () => resetCards.forEach(reset => reset());
window.addEventListener('scroll', resetDepth, { passive: true });
window.addEventListener('blur', resetDepth);
finePointer.addEventListener('change', resetDepth);
reducedMotion.addEventListener('change', () => {
  resetDepth();
  if (reducedMotion.matches) animations.forEach(animation => animation.cancel());
});
