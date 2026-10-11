import { mount } from './referral-conveyor.js?v=20261011-18';

const carousel = document.querySelector('.referrals-carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.testimonial')];
  const controls = document.querySelector('.referral-controls');
  const dotsContainer = controls.querySelector('.referral-dots');
  const pauseButton = controls.querySelector('.referral-pause');
  const status = document.getElementById('referral-status');
  const stage = document.querySelector('[data-section-figure="slow"]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = null, paused = reduced.matches, conveyor;
  const authors = slides.map(slide => slide.querySelector('figcaption strong').textContent);
  const buttons = slides.map((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Referral from ${authors[index]}`);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'conveyor-crate-target';
    button.setAttribute('aria-label', `Show referral from ${authors[index]}`);
    stage.appendChild(button);
    return button;
  });
  const dots = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'referral-dot';
    dot.setAttribute('aria-label', `View referral from ${authors[index]}`);
    dot.addEventListener('click', () => conveyor.select(index));
    dotsContainer.appendChild(dot);
    return dot;
  });
  const content = document.querySelector('.referrals-content');
  function show(index, isPaused) {
    paused = isPaused;
    pauseButton.textContent = paused ? 'Resume conveyor' : 'Pause conveyor';
    if (active === index) return;
    active = index;
    content.classList.toggle('is-hidden', index < 0);
    content.inert = index < 0;
    content.setAttribute('aria-hidden', String(index < 0));
    slides.forEach((slide, i) => { slide.hidden = i !== active; });
    [...dots, ...buttons].forEach((button, i) => button.setAttribute('aria-pressed', String(i % slides.length === active)));
    status.textContent = index >= 0 ? `Referral from ${authors[index]}` : '';
    if (index >= 0 && !reduced.matches) slides[index].animate([
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
  HL.inject(document);
  stage.removeAttribute('role');
  stage.setAttribute('role', 'group');
  stage.setAttribute('aria-label', 'Referral conveyor. Hover or select a crate to read its referral.');
  stage.setAttribute('data-hairline', 'slow');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 80 400 190');
  svg.setAttribute('aria-hidden', 'true');
  stage.prepend(svg);
  conveyor = mount({ stage, svg, read: { textContent: '' } }, 0.2, { buttons, onSelect: show });
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    conveyor.pause(paused);
    pauseButton.textContent = paused ? 'Resume conveyor' : 'Pause conveyor';
  });
  // Keep a revealed referral steady while it is being read or its link is focused.
  content.addEventListener('pointerenter', () => conveyor.hold(true));
  content.addEventListener('pointerleave', () => conveyor.hold(false));
  content.addEventListener('focusin', () => conveyor.hold(true));
  content.addEventListener('focusout', event => {
    if (!content.contains(event.relatedTarget)) conveyor.hold(false);
  });
  reduced.addEventListener('change', () => { paused = reduced.matches; conveyor.pause(paused); pauseButton.textContent = paused ? 'Resume conveyor' : 'Pause conveyor'; });
  carousel.classList.add('carousel-ready');
  controls.hidden = false;
  show(-1, paused);
  window.addEventListener('pagehide', event => { if (!event.persisted) conveyor.destroy(); });
}
