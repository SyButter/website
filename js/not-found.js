(() => {
  const face = document.getElementById('confused-face');
  const page = document.querySelector('.error-page');
  const home = document.getElementById('home-btn');
  const resetButton = document.getElementById('reset-mischief');
  const status = document.getElementById('mischief-status');
  const flash = document.getElementById('boom-flash');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const layer = document.createElement('div');
  layer.className = 'debris-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);
  const chars = [];

  // Keep words together and keep accessible, unmodified text in each label.
  document.querySelectorAll('.tumble-text').forEach(element => {
    const text = element.textContent.trim().replace(/\s+/g, ' ');
    element.setAttribute('aria-label', text);
    element.textContent = '';
    text.split(' ').forEach((word, index) => {
      if (index) element.appendChild(document.createTextNode(' '));
      const group = document.createElement('span');
      group.style.whiteSpace = 'nowrap';
      group.setAttribute('aria-hidden', 'true');
      for (const letter of word) {
        const span = document.createElement('span');
        span.className = 'tumble-char';
        span.textContent = letter;
        group.appendChild(span);
        chars.push(span);
      }
      element.appendChild(group);
    });
  });

  let bodies = [];
  let running = false;
  let frame = null;
  let spellTimer;
  let flashTimer;
  let previousTime = 0;
  let angle = 0;
  let angularVelocity = 0;
  let pointer = { x: -1000, y: -1000, time: 0 };
  const restAngle = 0.3;

  function start() {
    if (!running || reduced.matches || document.hidden || frame !== null) return;
    previousTime = performance.now();
    frame = requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = null;
    const dt = Math.min((now - previousTime) / 1000, .032);
    previousTime = now;
    let moving = false;
    for (const body of bodies) {
      const dx = body.x + body.w / 2 - pointer.x;
      const dy = body.y + body.h / 2 - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (now - pointer.time < 120 && distance < 110 && distance > 1) {
        const force = (1 - distance / 110) * 4000 * dt;
        body.vx += dx / distance * force;
        body.vy -= Math.abs(dy / distance * force) + force * .3;
        body.spin += dx * dt * 5;
      }
      body.vy += 1400 * dt;
      body.x += body.vx * dt;
      body.y += body.vy * dt;
      body.rotation += body.spin * dt;
      body.spin *= Math.exp(-2.5 * dt);
      // Reserve enough room for the rotated glyph so it cannot disappear off-screen.
      const floor = Math.max(0, innerHeight - body.h - 18);
      if (body.y >= floor) {
        body.y = floor;
        body.vy = body.vy > 65 ? -body.vy * .35 : 0;
        body.vx *= Math.exp(-8 * dt);
        if (Math.abs(body.vx) < 2) body.vx = 0;
      }
      const edge = Math.max(8, innerWidth - body.w - 8);
      if (body.x < 8) { body.x = 8; body.vx = Math.abs(body.vx) * .5; }
      if (body.x > edge) { body.x = edge; body.vx = -Math.abs(body.vx) * .5; }
      if (body.y < 0) { body.y = 0; body.vy = Math.abs(body.vy) * .5; }
      body.element.style.transform = `translate(${body.x}px, ${body.y}px) rotate(${body.rotation}deg)`;
      moving ||= Math.abs(body.vx) > 1 || Math.abs(body.vy) > 1 || body.y < floor - 1;
    }
    angularVelocity += (-16 * (angle - restAngle) - 2.5 * angularVelocity) * dt;
    angle += angularVelocity * dt;
    angle = Math.max(-.85, Math.min(1.25, angle));
    home.style.transform = `rotate(${angle}rad)`;
    moving ||= Math.abs(angularVelocity) > .002 || Math.abs(angle - restAngle) > .002;
    if (moving) frame = requestAnimationFrame(tick);
  }

  function explode() {
    running = true;
    resetButton.hidden = false;
    home.classList.add('is-hanging');
    status.textContent = 'Well. That made it worse.';
    if (reduced.matches) {
      home.style.transform = `rotate(${restAngle}rad)`;
      return;
    }
    // Snapshot every letter before altering layout. Animate clones so the sign
    // stays anchored and repeated clicks cannot measure already-fallen letters.
    const snapshots = chars.map(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return { source: element, text: element.textContent, rect, font: style.font, color: style.color };
    });
    bodies = snapshots.map(({ source, text, rect, font, color }) => {
      const element = document.createElement('span');
      element.className = 'tumble-char is-loose';
      element.textContent = text;
      element.style.font = font;
      element.style.color = color;
      layer.appendChild(element);
      return { element, source, x: rect.left, y: rect.top, w: rect.width, h: rect.height,
        vx: (Math.random() - .5) * 500, vy: -180 - Math.random() * 300,
        rotation: 0, spin: (Math.random() - .5) * 300 };
    });
    page.classList.add('has-mischief');
    flash.classList.add('active');
    flashTimer = setTimeout(() => flash.classList.remove('active'), 720);
    angularVelocity = 1.8;
    start();
  }

  function reset() {
    clearTimeout(spellTimer);
    clearTimeout(flashTimer);
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    running = false;
    bodies = [];
    layer.replaceChildren();
    page.classList.remove('has-mischief');
    face.classList.remove('is-wizard');
    home.classList.remove('is-hanging');
    home.style.transform = '';
    flash.classList.remove('active');
    angle = angularVelocity = 0;
    resetButton.hidden = true;
    status.textContent = '';
  }
  function cast() {
    if (running || face.classList.contains('is-wizard')) return;
    face.classList.add('is-wizard');
    spellTimer = setTimeout(explode, reduced.matches ? 0 : 550);
  }
  face.addEventListener('click', cast);
  face.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); cast(); }
  });
  resetButton.addEventListener('click', () => { reset(); face.focus(); });
  window.addEventListener('pointermove', event => {
    const now = performance.now();
    if (running && !reduced.matches) {
      // Derive the pin from the untransformed wrapper, including after scrolling.
      const wrapper = home.parentElement.getBoundingClientRect();
      const x = event.clientX - wrapper.left - 14;
      const y = event.clientY - wrapper.top - 14;
      const distance = Math.hypot(x, y);
      if (distance < 130 && now - pointer.time < 150 && distance > 8) {
        const dt = Math.max((now - pointer.time) / 1000, .016);
        const vx = (event.clientX - pointer.x) / dt;
        const vy = (event.clientY - pointer.y) / dt;
        angularVelocity += ((x * vy - y * vx) / (distance * distance)) * (1 - distance / 130) * .12;
        angularVelocity = Math.max(-4, Math.min(4, angularVelocity));
      }
    }
    pointer = { x: event.clientX, y: event.clientY, time: now };
    start();
  }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer.time = 0; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame !== null) { cancelAnimationFrame(frame); frame = null; }
    else start();
  });
  window.addEventListener('resize', start, { passive: true });
  reduced.addEventListener('change', reset);
  new MutationObserver(() => {
    bodies.forEach(body => { body.element.style.color = getComputedStyle(body.source).color; });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
