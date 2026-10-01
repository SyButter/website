// Keep the original star field and camera depth throughout the portfolio.
// Respect reduced motion without making the page depend on WebGL or the CDN.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches) {
  import('./three-scene.js').then(({ default: initThreeScene }) => {
    const scene = initThreeScene(() => {}, { backgroundOnly: true });
    if (!scene) return;
    const updateDepth = () => {
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollRange > 0 ? Math.min(Math.max(window.scrollY / scrollRange, 0), 1) : 0;
      scene.updateScrollParallax(progress);
    };
    window.addEventListener('scroll', updateDepth, { passive: true });
    window.addEventListener('resize', updateDepth, { passive: true });
    new ResizeObserver(updateDepth).observe(document.querySelector('main'));
    updateDepth();
  }).catch(() => {
    // The CSS star field stays visible if WebGL or the external module is unavailable.
  });
}
