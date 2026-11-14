// Background figure: a ruled surface drawn only with straight lines.
// Two families of strings join a lower ring to an upper ring. Twisting one ring
// against the other bends the cylinder into a hyperboloid and on toward a
// double cone. Scroll position sets the twist, proportions, tilt and placement,
// so the form is re-plotted as the page moves. Passing the pointer across a
// string plucks it, and the hero controls let a visitor change the parameters.
const canvas = document.getElementById('plot');
const context = canvas && canvas.getContext('2d');

if (context) {
  const MAX_STRINGS = 72;
  const STEPS = 10;
  const SHADES = 6;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let width = 0, height = 0, ratio = 1;
  let ink = '#a9c6e2', signal = '#ffc44d';
  let scroll = 0, scrollTarget = 0;
  let pointerX = 0, pointerY = 0, lookX = 0, lookY = 0;

  // Visitor-set parameters, added to what scroll position already dictates.
  const tune = { twist: 0, strings: 44, flare: 0 };
  const outputs = {};
  document.querySelectorAll('[data-plot-out]').forEach(output => { (outputs[output.dataset.plotOut] ||= []).push(output); });
  function show(name, text) {
    (outputs[name] || []).forEach(output => { if (output.textContent !== text) output.textContent = text; });
  }

  // One entry per string: where it was last drawn, and how it is vibrating.
  const ends = new Float32Array(MAX_STRINGS * 2 * 4);
  const pluckSize = new Float32Array(MAX_STRINGS * 2);
  const pluckTime = new Float32Array(MAX_STRINGS * 2);

  function readTheme() {
    const styles = getComputedStyle(document.documentElement);
    ink = styles.getPropertyValue('--plot-line').trim() || ink;
    signal = styles.getPropertyValue('--signal').trim() || signal;
  }
  function resize() {
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
  }
  function readScroll() { scrollTarget = window.scrollY / Math.max(window.innerHeight, 1); }

  // Segments are grouped by depth so near lines read stronger than far ones.
  const shades = Array.from({ length: SHADES }, () => []);
  const accent = [];

  function draw(time) {
    const still = reducedMotion.matches;
    const t = still ? 0 : time / 1000;
    const STRINGS = tune.strings;
    scroll += (scrollTarget - scroll) * (still ? 1 : 0.07);
    lookX += (pointerX - lookX) * 0.05;
    lookY += (pointerY - lookY) * 0.05;
    const s = scroll;

    // Everything below is a function of scroll (s) and, slowly, of time (t).
    const twist = 0.45 + 1.2 * (1 - Math.cos(s * 0.85)) + Math.sin(t * 0.21) * 0.08 + tune.twist;
    const upper = (1 + 0.34 * Math.sin(s * 0.7 + 0.4)) * (1 + tune.flare);
    const lower = (1 - 0.3 * Math.sin(s * 0.7 + 1.6)) * (1 - tune.flare * 0.6);
    show('twist', `${Math.round(twist * 180 / Math.PI)}°`);
    show('strings', String(STRINGS * 2));
    show('flare', (upper / lower).toFixed(2));
    const tall = 1.25 + 0.2 * Math.cos(s * 0.5);
    const yaw = t * 0.06 + s * 0.55 + lookX * 0.25;
    const pitch = 0.42 + 0.26 * Math.sin(s * 0.6) + lookY * 0.15;
    const roll = 0.32 * Math.sin(s * 0.45 + 0.9);

    const narrow = width < 760;
    const size = Math.min(width, height) * (narrow ? 0.27 : 0.21);
    // Starts beside the hero copy, then drifts across the sheet as you read.
    const drift = Math.cos(s * 0.8);
    const centreX = width * (narrow ? 0.5 + 0.2 * drift : 0.5 + 0.27 * drift);
    const centreY = height * (narrow ? 0.62 : 0.52) + Math.sin(s * 0.9) * height * 0.05;
    // Clear beside the hero copy, then quiet enough to sit behind body text.
    const strength = Math.max(narrow ? 0.2 : 0.24, (narrow ? 0.42 : 0.7) - s * 0.9);

    const cy = Math.cos(yaw), sy = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const cr = Math.cos(roll), sr = Math.sin(roll);
    const camera = 5.2;
    const point = [0, 0, 0];
    function project(x, y, z) {
      const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
      const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
      const x3 = x1 * cr - y2 * sr, y3 = x1 * sr + y2 * cr;
      const scale = camera / (camera - z2);
      point[0] = centreX + x3 * scale * size;
      point[1] = centreY - y3 * scale * size;
      point[2] = z2;
    }

    shades.forEach(list => { list.length = 0; });
    accent.length = 0;
    const marked = ((Math.round(s * 5) % STRINGS) + STRINGS) % STRINGS;

    function segment(ax, ay, az, bx, by, bz, list) {
      project(ax, ay, az);
      const x0 = point[0], y0 = point[1], z0 = point[2];
      project(bx, by, bz);
      const depth = Math.min(Math.max(((z0 + point[2]) / 2 + 1.6) / 3.2, 0), 0.999);
      (list || shades[Math.floor(depth * SHADES)]).push(x0, y0, point[0], point[1]);
    }

    const path = new Float32Array((STEPS + 1) * 3);
    for (let i = 0; i < STRINGS; i++) {
      const angle = (i / STRINGS) * Math.PI * 2;
      const next = ((i + 1) / STRINGS) * Math.PI * 2;
      for (let family = 0; family < 2; family++) {
        const turned = angle + (family ? -twist : twist);
        const ax = lower * Math.cos(angle), az = lower * Math.sin(angle);
        const bx = upper * Math.cos(turned), bz = upper * Math.sin(turned);
        for (let k = 0; k <= STEPS; k++) {
          const u = k / STEPS;
          project(ax + (bx - ax) * u, -tall + 2 * tall * u, az + (bz - az) * u);
          path[k * 3] = point[0]; path[k * 3 + 1] = point[1]; path[k * 3 + 2] = point[2];
        }
        const id = family * MAX_STRINGS + i;
        const x0 = path[0], y0 = path[1], x1 = path[STEPS * 3], y1 = path[STEPS * 3 + 1];
        ends[id * 4] = x0; ends[id * 4 + 1] = y0; ends[id * 4 + 2] = x1; ends[id * 4 + 3] = y1;

        // A plucked string bows sideways as a decaying standing wave.
        const age = t - pluckTime[id];
        const swing = pluckSize[id] ? pluckSize[id] * Math.exp(-age * 2.4) * Math.cos(age * 26) : 0;
        const live = pluckSize[id] !== 0 && age < 2.5;
        if (!live) pluckSize[id] = 0;
        else {
          const length = Math.hypot(x1 - x0, y1 - y0) || 1;
          const nx = -(y1 - y0) / length, ny = (x1 - x0) / length;
          for (let k = 1; k < STEPS; k++) {
            const bow = Math.sin((k / STEPS) * Math.PI) * swing;
            path[k * 3] += nx * bow; path[k * 3 + 1] += ny * bow;
          }
        }
        const list = family === 0 && i === marked ? accent : live ? shades[SHADES - 1] : null;
        for (let k = 0; k < STEPS; k++) {
          const depth = Math.min(Math.max(((path[k * 3 + 2] + path[k * 3 + 5]) / 2 + 1.6) / 3.2, 0), 0.999);
          (list || shades[Math.floor(depth * SHADES)]).push(path[k * 3], path[k * 3 + 1], path[k * 3 + 3], path[k * 3 + 4]);
        }
      }
      // The two rings the strings are tied to.
      segment(lower * Math.cos(angle), -tall, lower * Math.sin(angle), lower * Math.cos(next), -tall, lower * Math.sin(next));
      segment(upper * Math.cos(angle), tall, upper * Math.sin(angle), upper * Math.cos(next), tall, upper * Math.sin(next));
    }

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;
    context.strokeStyle = ink;
    shades.forEach((list, index) => {
      context.globalAlpha = strength * (0.14 + 0.86 * (index / (SHADES - 1)));
      context.beginPath();
      for (let i = 0; i < list.length; i += 4) { context.moveTo(list[i], list[i + 1]); context.lineTo(list[i + 2], list[i + 3]); }
      context.stroke();
    });
    context.globalAlpha = Math.min(1, strength + 0.25);
    context.strokeStyle = signal;
    context.lineWidth = 1.25;
    context.beginPath();
    for (let i = 0; i < accent.length; i += 4) { context.moveTo(accent[i], accent[i + 1]); context.lineTo(accent[i + 2], accent[i + 3]); }
    context.stroke();
  }

  let raf = 0;
  const loop = time => { raf = requestAnimationFrame(loop); draw(time); };
  function sync() {
    const run = !document.hidden && !reducedMotion.matches;
    if (run && !raf) raf = requestAnimationFrame(loop);
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
    if (!run) draw(0);
  }

  readTheme();
  resize();
  readScroll();
  scroll = scrollTarget;
  new MutationObserver(() => { readTheme(); if (!raf) draw(0); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('resize', () => { resize(); readScroll(); if (!raf) draw(0); });
  window.addEventListener('scroll', readScroll, { passive: true });
  let lastX = null, lastY = 0;
  const side = (ax, ay, bx, by, px, py) => (bx - ax) * (py - ay) - (by - ay) * (px - ax);
  window.addEventListener('pointermove', event => {
    const x = event.clientX, y = event.clientY;
    if (lastX !== null && !reducedMotion.matches) {
      // Pluck every string the pointer's path crossed since the last event.
      const speed = Math.hypot(x - lastX, y - lastY);
      if (speed > 1 && speed < 400) {
        for (let family = 0; family < 2; family++) {
          for (let i = 0; i < tune.strings; i++) {
            const id = family * MAX_STRINGS + i, o = id * 4;
            const before = side(ends[o], ends[o + 1], ends[o + 2], ends[o + 3], lastX, lastY);
            const after = side(ends[o], ends[o + 1], ends[o + 2], ends[o + 3], x, y);
            if (before * after >= 0) continue;
            if (side(lastX, lastY, x, y, ends[o], ends[o + 1]) * side(lastX, lastY, x, y, ends[o + 2], ends[o + 3]) >= 0) continue;
            pluckSize[id] = Math.min(4 + speed * 0.35, 22) * (after > 0 ? 1 : -1);
            pluckTime[id] = performance.now() / 1000;
          }
        }
      }
    }
    lastX = x; lastY = y;
    if (event.pointerType === 'touch') return;
    pointerX = x / Math.max(width, 1) - 0.5;
    pointerY = y / Math.max(height, 1) - 0.5;
  }, { passive: true });
  window.addEventListener('pointerleave', () => { lastX = null; });
  window.addEventListener('pointerup', event => { if (event.pointerType === 'touch') lastX = null; });

  const controls = [...document.querySelectorAll('[data-plot-control]')];
  controls.forEach(control => {
    control.addEventListener('input', () => {
      tune[control.dataset.plotControl] = Number(control.value);
      if (!raf) draw(0);
    });
  });
  const reset = document.querySelector('[data-plot-reset]');
  if (reset) reset.addEventListener('click', () => {
    controls.forEach(control => {
      control.value = control.defaultValue;
      tune[control.dataset.plotControl] = Number(control.defaultValue);
    });
    if (!raf) draw(0);
  });
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  sync();
}
