// A tabbed project folder: its front opens while three sheets lift in turn.
const {
  Cam, clamp, fillet, fit, open, poly, proj, rad, seg,
  tdone, tset, tval, tween, disposer, mk, pointer, register,
} = HL;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, -16, 0], [100, 38, 0], [0, -16, 88], [100, 38, 88]], 200, 166);
  const P = proj(C);
  const cover = fillet([[0, 0], [100, 0], [100, 58], [39, 58], [35, 67], [7, 67], [3, 58], [0, 58]], [3, 3, 3, 2, 2, 3, 2, 3]);
  const page = fillet([[6, 0], [94, 0], [94, 56], [6, 56]], [2, 2, 2, 2]);
  const front = fillet([[0, 0], [100, 0], [100, 52], [0, 52]], [3, 3, 4, 4]);
  const g = mk('g', {}, svg);
  const back = mk('path', { class: 'sil' }, g);
  back.setAttribute('d', poly(cover.map(([x, z]) => P(x, 0, z))));
  const fold = mk('path', { class: 'lo' }, g);
  fold.setAttribute('d', poly([P(0, 0, 0), P(100, 0, 0), P(100, 18, 0), P(0, 18, 0)]));
  const sheets = Array.from({ length: 3 }, (_, i) => ({
    face: mk('path', { class: 'sil' }, g),
    crease: mk('path', { class: 'nf lo' }, g),
    lift: tween([7, 4, 1][i]),
    drawn: NaN,
  }));
  const face = mk('path', { class: 'sil hi' }, g);
  const crease = mk('path', { class: 'nf lo' }, g);
  const angle = tween(15);
  let reach = value, active = -1, drawnAngle = NaN;
  function draw(now) {
    sheets.forEach((sheet, i) => {
      const lift = tval(sheet.lift, now);
      if (lift === sheet.drawn) return;
      sheet.drawn = lift;
      const project = (x, z) => P(x, 5 + i * 4 + z * 0.04, z + lift);
      sheet.face.setAttribute('d', poly(page.map(([x, z]) => project(x, z))));
      sheet.crease.setAttribute('d', seg(project(12, 49), project(88, 49)));
    });
    const a = tval(angle, now);
    if (a !== drawnAngle) {
      drawnAngle = a;
      const project = (x, z) => P(x, 18 + z * Math.sin(rad(a)), z * Math.cos(rad(a)));
      face.setAttribute('d', poly(front.map(([x, z]) => project(x, z))));
      crease.setAttribute('d', open([project(5, 48), project(95, 48)]));
    }
  }
  const B = register(stage, (_dt, now) => {
    draw(now);
    return !tdone(angle, now) || sheets.some(sheet => !tdone(sheet.lift, now));
  });
  bag.add(B.unregister);
  function choose(index) {
    if (index === active) return;
    active = index;
    const now = performance.now();
    tset(angle, index < 0 ? 15 : reach, now, 0);
    sheets.forEach((sheet, i) => {
      const lift = index < 0 ? [7, 4, 1][i] : 9 + (i === index ? 17 : 8 / (1 + Math.abs(i - index)));
      tset(sheet.lift, lift, now, Math.abs(i - Math.max(0, index)) * 40);
      sheet.face.classList.toggle('hi', i === index);
    });
    face.classList.toggle('hi', index < 0);
    read.textContent = index < 0 ? 'rest' : `sheet ${index + 1}`;
    B.wake();
  }
  // Fixed bands, independent of the cover and sheets' current poses.
  bag.add(pointer(stage, { move: ([x]) => choose(clamp(Math.floor((x - 90) / 74), 0, 2)), leave: () => choose(-1) }));
  read.textContent = 'rest';
  draw(0);
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { reach = v; const index = active; active = -2; choose(index); },
    destroy: bag.dispose,
  };
}

hairline({
  name: 'folder',
  means: 'A tabbed folder opens toward the pointer, lifting its three sheets in turn.',
  rules: [1, 2, 4, 5, 7, 8, 9, 10],
  range: [30, 43, 56],
  tour: [[135, 145], [210, 130], [280, 160], null],
  mount,
});
