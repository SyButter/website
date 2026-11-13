// The hero figure: a low-poly, hidden-line model of the openGBW build.
// A grinder doses into a cup on a scale; the controller cuts the motor at the
// target weight. Drag turns it, scrolling pulls it apart into an exploded view.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js';

const TARGET = 18;
const GRIND_SECONDS = 3.6;
const BEANS = 44;

export default function initBench(root) {
  const canvas = root.querySelector('canvas');
  const readout = root.querySelector('[data-bench-readout]');
  const state = root.querySelector('[data-bench-state]');
  const button = root.querySelector('[data-bench-grind]');
  const leaders = root.querySelector('.bench-leaders');
  const labels = [...root.querySelectorAll('[data-bench-label]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(8, 6.2, 8);
  camera.lookAt(0, 2.05, 0);

  // Faces are painted in the page colour so they hide the lines behind them.
  const face = new THREE.MeshBasicMaterial({ polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1, side: THREE.DoubleSide });
  const line = new THREE.LineBasicMaterial();
  const faint = new THREE.LineBasicMaterial();
  const signal = new THREE.MeshBasicMaterial();
  const signalLine = new THREE.LineBasicMaterial();

  function part(geometry, lineMaterial = line) {
    const group = new THREE.Group();
    group.add(new THREE.Mesh(geometry, face));
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 1), lineMaterial));
    return group;
  }
  function at(object, x, y, z) { object.position.set(x, y, z); return object; }

  const rig = new THREE.Group();
  rig.position.z = 0.35;
  scene.add(rig);

  // Each layer lifts by a different amount in the exploded view.
  const layers = [];
  function layer(lift, ...children) {
    const group = new THREE.Group();
    children.forEach(child => group.add(child));
    rig.add(group);
    layers.push({ group, lift });
    return group;
  }

  const GX = 0, GZ = -1.15, CZ = 0.55;
  layer(-0.9, at(part(new THREE.BoxGeometry(2, 0.26, 2)), GX, 0.13, CZ));
  layer(-0.45, at(part(new THREE.BoxGeometry(1.8, 0.06, 1.8)), GX, 0.31, CZ));

  const cupWall = new THREE.CylinderGeometry(0.5, 0.4, 0.85, 10, 1, true);
  const grounds = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.385, 1, 10), signal);
  grounds.position.set(GX, 0.36, CZ);
  grounds.scale.y = 0.001;
  layer(0,
    at(part(cupWall), GX, 0.765, CZ),
    at(part(new THREE.CircleGeometry(0.4, 10).rotateX(-Math.PI / 2)), GX, 0.345, CZ),
    grounds);

  const body = part(new THREE.CylinderGeometry(0.62, 0.78, 2.5, 8).rotateY(Math.PI / 8));
  const chute = part(new THREE.BoxGeometry(0.34, 0.3, 0.95));
  chute.rotation.x = 0.5;
  const controller = part(new THREE.BoxGeometry(0.34, 0.74, 0.98));
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.36).rotateY(Math.PI / 2), signal);
  const wire = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(1.02, 1.2, -0.85), new THREE.Vector3(1.02, 0.03, -0.85),
    new THREE.Vector3(1.2, 0.03, 0.2), new THREE.Vector3(1, 0.1, 0.2),
  ]), faint);
  const bodyLayer = layer(0.55,
    at(body, GX, 1.25, GZ), at(chute, GX, 1.98, GZ + 0.88),
    at(controller, 0.98, 1.62, GZ), at(screen, 1.156, 1.7, GZ), wire);

  layer(1.15, at(part(new THREE.CylinderGeometry(0.82, 0.66, 0.5, 8).rotateY(Math.PI / 8)), GX, 2.75, GZ));
  layer(1.9, at(part(new THREE.CylinderGeometry(0.95, 0.42, 1.2, 10, 1, true)), GX, 3.6, GZ));
  layer(2.6, at(part(new THREE.CylinderGeometry(0.98, 0.98, 0.07, 10)), GX, 4.24, GZ));

  // Falling coffee.
  const beans = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.05), signal, BEANS);
  beans.frustumCulled = false;
  rig.add(beans);
  const beanSeeds = Array.from({ length: BEANS }, (_, i) => ({
    phase: i / BEANS, x: Math.sin(i * 12.9898) * 0.11, z: Math.cos(i * 78.233) * 0.11, spin: i * 2.4,
  }));
  const matrix = new THREE.Matrix4();
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const position = new THREE.Vector3();
  const unit = new THREE.Vector3(1, 1, 1);

  // Callouts are pinned to points on the model.
  const anchors = {
    controller: { layer: bodyLayer, point: new THREE.Vector3(1.156, 1.9, GZ) },
    scale: { layer: layers[0].group, point: new THREE.Vector3(1, 0.13, CZ + 0.6) },
    hopper: { layer: layers[5].group, point: new THREE.Vector3(-0.7, 3.9, GZ + 0.5) },
  };

  function readTheme() {
    const styles = getComputedStyle(root);
    const color = name => new THREE.Color(styles.getPropertyValue(name).trim() || '#888');
    face.color.copy(color('--paper'));
    line.color.copy(color('--bench-line'));
    faint.color.copy(color('--bench-faint'));
    signal.color.copy(color('--signal'));
    signalLine.color.copy(signal.color);
  }
  readTheme();
  new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  let width = 0, height = 0;
  function resize() {
    width = root.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const half = 2.95;
    const aspect = width / height;
    // Keep the whole model in frame when the stage is narrower than it is tall.
    const fit = Math.max(1, 0.86 / aspect);
    camera.top = half * fit; camera.bottom = -half * fit;
    // The model sits left of centre so the right-hand callouts stay inside the stage.
    const shift = half * fit * aspect * 0.2;
    camera.left = -half * fit * aspect + shift; camera.right = half * fit * aspect + shift;
    camera.updateProjectionMatrix();
    leaders.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }
  new ResizeObserver(resize).observe(root);
  resize();

  // Interaction: drag to turn, with a little coast after release.
  let turn = 0, velocity = 0, dragging = false, lastX = 0;
  canvas.addEventListener('pointerdown', event => {
    dragging = true; lastX = event.clientX; velocity = 0;
    canvas.setPointerCapture(event.pointerId);
    root.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove', event => {
    if (!dragging) return;
    const delta = (event.clientX - lastX) * 0.01;
    lastX = event.clientX; turn += delta; velocity = delta;
  });
  const release = () => { dragging = false; root.classList.remove('is-dragging'); };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  let explode = 0, explodeTarget = 0;
  function readScroll() {
    const range = Math.max(root.offsetHeight * 0.9, 1);
    explodeTarget = Math.min(Math.max(window.scrollY / range, 0), 1);
  }
  window.addEventListener('scroll', readScroll, { passive: true });
  readScroll();

  // Grinding.
  let grindStart = -1, weight = 0, hasRun = false;
  function setWeight(value) {
    weight = value;
    readout.textContent = `${value.toFixed(1)} g`;
    grounds.scale.y = Math.max(0.001, (value / TARGET) * 0.42);
    grounds.position.y = 0.345 + grounds.scale.y / 2;
  }
  function finish() {
    grindStart = -1;
    setWeight(TARGET);
    state.textContent = 'Motor off at target';
    button.disabled = false;
    button.firstChild.textContent = 'Grind again ';
    root.classList.remove('is-grinding');
  }
  function grind() {
    if (grindStart >= 0) return;
    hasRun = true;
    setWeight(0);
    state.textContent = 'Grinding';
    button.disabled = true;
    root.classList.add('is-grinding');
    if (reducedMotion.matches) { finish(); return; }
    grindStart = performance.now();
  }
  button.addEventListener('click', grind);
  setWeight(0);

  const projected = new THREE.Vector3();
  function placeLabels(fade) {
    labels.forEach((label, index) => {
      const anchor = anchors[label.dataset.benchLabel];
      projected.copy(anchor.point);
      anchor.layer.localToWorld(projected).project(camera);
      const x = (projected.x * 0.5 + 0.5) * width;
      const y = (-projected.y * 0.5 + 0.5) * height;
      const dx = Number(label.dataset.dx), dy = Number(label.dataset.dy);
      // Keep each callout inside the stage, however narrow it gets.
      const labelWidth = label.offsetWidth;
      const left = Math.min(Math.max(dx < 0 ? x + dx - labelWidth : x + dx, 0), Math.max(width - labelWidth, 0));
      label.style.transform = `translate(${left}px, ${y + dy}px) translateY(-50%)`;
      label.style.opacity = fade;
      const leader = leaders.children[index];
      leader.setAttribute('x1', x); leader.setAttribute('y1', y);
      leader.setAttribute('x2', dx < 0 ? left + labelWidth + 6 : left - 6); leader.setAttribute('y2', y + dy);
      leader.style.opacity = fade;
    });
  }

  function frame(now) {
    const still = reducedMotion.matches;
    const t = now / 1000;
    if (!dragging) { turn += velocity; velocity *= 0.93; }
    explode += (explodeTarget - explode) * (still ? 1 : 0.09);
    const eased = explode * explode * (3 - 2 * explode);

    rig.rotation.y = -0.38 + turn + (still ? 0 : Math.sin(t * 0.32) * 0.34) + eased * 0.9;
    rig.scale.setScalar(1 - eased * 0.3);
    rig.position.y = eased * 0.75;
    layers.forEach(({ group, lift }) => { group.position.y = lift * eased; });
    wire.visible = eased < 0.03;

    let grinding = false;
    if (grindStart >= 0) {
      const progress = (now - grindStart) / (GRIND_SECONDS * 1000);
      if (progress >= 1) finish();
      else {
        grinding = true;
        // The scale reading wobbles with motor vibration until it settles.
        setWeight(Math.max(0, Math.min(TARGET, TARGET * progress + Math.sin(now * 0.05) * 0.12 * (1 - progress))));
        bodyLayer.position.x = Math.sin(now * 0.09) * 0.008;
      }
    }
    if (!grinding) bodyLayer.position.x = 0;

    const lift = bodyLayer.position.y;
    const floor = grounds.position.y + grounds.scale.y / 2;
    beanSeeds.forEach((seed, i) => {
      if (!grinding) { beans.setMatrixAt(i, hidden); return; }
      const fall = (t * 1.5 + seed.phase) % 1;
      const y = 1.72 + lift - fall * fall * (1.72 + lift - floor);
      position.set(GX + seed.x * (0.4 + fall), y, GZ + 1.36 + seed.z + fall * 0.3);
      euler.set(seed.spin + t * 6, seed.spin, t * 4);
      matrix.compose(position, quaternion.setFromEuler(euler), unit);
      beans.setMatrixAt(i, matrix);
    });
    beans.instanceMatrix.needsUpdate = true;

    scene.updateMatrixWorld();
    placeLabels(Math.max(0, 1 - eased * 3.5));
    renderer.render(scene, camera);
  }

  // Only draw while the figure is on screen and the tab is visible.
  let raf = 0, onScreen = false;
  const loop = now => { raf = requestAnimationFrame(loop); frame(now); };
  function sync() {
    const run = onScreen && !document.hidden;
    if (run && !raf) raf = requestAnimationFrame(loop);
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
  }
  new IntersectionObserver(entries => {
    onScreen = entries[entries.length - 1].isIntersecting;
    sync();
    // The first dose runs by itself, once, shortly after the figure appears.
    if (onScreen && !hasRun && !reducedMotion.matches) setTimeout(() => { if (!hasRun) grind(); }, 1500);
  }).observe(root);
  document.addEventListener('visibilitychange', sync);

  root.classList.add('is-ready');
  frame(performance.now());
}
