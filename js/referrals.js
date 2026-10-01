const carousel = document.querySelector('.referrals-carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.testimonial')];
  const controls = document.querySelector('.referral-controls');
  const dotsContainer = controls.querySelector('.referral-dots');
  const pauseButton = controls.querySelector('.referral-pause');
  const status = document.getElementById('referral-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let paused = reducedMotion.matches;
  let hovered = false;
  let timer;
  const section = document.getElementById('referrals');
  const dots = slides.map((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${slides.length}`);
    const author = slide.querySelector('figcaption strong').textContent;
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'referral-dot';
    dot.setAttribute('aria-label', `View referral from ${author}`);
    dot.addEventListener('click', () => {
      show(index);
      status.textContent = `Referral ${index + 1} of ${slides.length}, from ${author}`;
      schedule();
    });
    dotsContainer.appendChild(dot);
    return dot;
  });

  function show(index) {
    active = index;
    slides.forEach((slide, i) => { slide.hidden = i !== active; });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === active)));
  }
  function schedule() {
    clearInterval(timer);
    if (paused || hovered || document.hidden || section.contains(document.activeElement)) return;
    timer = setInterval(() => show((active + 1) % slides.length), 7000);
  }
  function updatePauseLabel() {
    pauseButton.textContent = paused ? 'Resume rotation' : 'Pause rotation';
  }
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    updatePauseLabel();
    schedule();
  });
  section.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  section.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  section.addEventListener('focusin', schedule);
  section.addEventListener('focusout', () => requestAnimationFrame(schedule));
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => {
    paused = reducedMotion.matches;
    updatePauseLabel();
    schedule();
  });
  carousel.classList.add('carousel-ready');
  controls.hidden = false;
  show(0);
  updatePauseLabel();
  schedule();
}
