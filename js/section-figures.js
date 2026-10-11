import { mount as query } from './vendor/hairline-figures/query.js';

// The contact figure shares the project folder and conveyor frame loop.
// It sleeps offscreen and follows the reader's reduced-motion preference.
HL.inject(document);
const figures = [];
for (const [name, mount, value] of [['query', query, 40]]) {
  const stage = document.querySelector(`[data-section-figure="${name}"]`);
  if (!stage) continue;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 400 320');
  svg.setAttribute('aria-hidden', 'true');
  stage.setAttribute('data-hairline', name);
  stage.appendChild(svg);
  const read = { textContent: '' };
  figures.push(mount({ stage, svg, read }, value));
}
window.addEventListener('pagehide', event => {
  if (!event.persisted) figures.forEach(figure => figure.destroy());
});
