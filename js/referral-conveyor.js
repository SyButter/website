// Referral conveyor adapted from lucasmarkes/hairline Slow (MIT).
// TypeScript types stripped; core imports use the shared, unmodified HL kernel.
const { Cam, fit, proj, unproj, facing, rings, prism, clamp, r2, seg, spring, stepS, reducedMotion, tween, tset, tval, tdone, mk, solid, put, flatDot, place, register, pointer, disposer } = HL;
// Original belt, gate, crate geometry and depth sorting are preserved.
// Five stable crates map to the five referrals, with one shared animation clock.
const L = 210, BW = 26, BT = 5, CUBE = 24, NC = 5, SPEED = 1 / 30, GATE = L * 0.62, GH = 48;

                                                   
                                                                

/** How big a crate is at belt position u (0..1): smoothstep in over the first 8%, out over the last. */
const size = (u        ) => { const a = clamp(Math.min(u, 1 - u) / 0.08, 0, 1); return a * a * (3 - 2 * a); };

/**
 * How lit the gate is by a crate at x: a cos² swell, full under the lintel. It
 * rises over half the gap between crates (about .75s at full speed) and falls
 * over half that once the crate is through (about .37s), so the gate breathes
 * in and lets go. Read off the belt, not a timer, so it slows with the clock.
 */
const RISE = L / NC / 2, FALL = RISE / 2;
const glow = (x        ) => {
  const d = x - GATE, w = d < 0 ? RISE : FALL;
  return Math.abs(d) >= w ? 0 : Math.cos((Math.PI / 2) * (Math.abs(d) / w)) ** 2;
};

export const mount = ({ stage, svg, read }, value, { buttons, onSelect }) => {
  const bag = disposer();
  let clock = 0.12 / SPEED, selected = -1, hovered = -1, paused = reducedMotion(), reading = false, seeking = false;
  const travel = tween(clock, 700);
  const reveal = index => {
    if (selected !== index) { selected = index; onSelect(index, paused); }
  };
  const bringToGate = index => {
    const u = (index / NC + clock * SPEED) % 1;
    const distance = ((GATE / L - u) % 1 + 1) % 1;
    travel.from = travel.to = clock;
    travel.t0 = -1e9;
    tset(travel, clock + distance / SPEED, performance.now(), 0);
    seeking = true;
    paused = false;
    reading = false;
    reveal(-1);
    onSelect(-1, false);
    B.wake();
  };
  const rate = spring(1, { eps: 0.002 });
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[0, 0, 0], [L, BW, 0], [L, 0, 0], [0, BW, 0], [0, 0, GH], [GATE, -8, GH]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [bR, bI] = rings(0, 0, L, BW, 5, 1.3);
  put(solid(g), prism(P, front, bR, bI, 0, BT));
  const slats = mk("path", { class: "nf lo" }, g);
  // crates and the gate share one layer, re-sorted by depth (x + y at 45°) every frame
  const layer = mk("g", {}, g);
  const pool          = [];
  for (let j = 0; j < NC; j++) {
    const el        = { ...solid(layer), dots: [] };
    for (let k = 0; k < 9; k++) el.dots.push(flatDot(el.g, C, 1, "dot off"));
    pool.push(el);
  }
  // the lintel's key is past both posts and every crate under it, so it paints last among its neighbours
  const gate = ([[-8, -3, 0, GH - 4, GATE - 5.5], [BW + 3, BW + 8, 0, GH - 4, GATE + BW + 5.5], [-8, BW + 8, GH - 4, GH, GATE + BW + 8.5]]         )
    .map(([y0, y1, z0, z1, key]) => {
      const el = solid(layer), [rg, ig] = rings(GATE - 1.6, y0, GATE + 1.6, y1, 1.4, 0.6);
      put(el, prism(P, front, rg, ig, z0, z1));
      // the glow is driven every frame from the belt; the stroke's CSS transition would only lag it
      el.sil.style.transition = "none";
      return { el, key };
    });
  const lifts = Array.from({ length: NC }, () => spring(0, { eps: 0.03 }));
  let hot = -1, order = "", gatePct = 0;

  const B = register(stage, (dt, now) => {
    const stopped = paused || reading || (hovered === selected && selected >= 0) || reducedMotion();
    rate.t = stopped ? 0 : 1;
    let m = stepS(rate, dt);
    if (seeking) {
      clock = tval(travel, now);
      if (tdone(travel, now)) { seeking = false; paused = true; }
    } else if (!stopped) clock += dt * rate.x;
    const items         = [];
    for (let j = 0; j < NC; j++) {
      const q = j / NC + clock * SPEED, u = q - Math.floor(q), lap = Math.floor(q);
      items.push({ j, x: u * L, s: size(u), serial: 141 + lap * NC + j });
    }
    // Only the crate physically crossing the gate may reveal a referral.
    const atGate = seeking ? null : items.find(item => Math.abs(item.x - GATE) <= CUBE / 2 + 2);
    reveal(atGate ? atGate.j : -1);
    hot = selected;
    lifts.forEach((sp, j) => { sp.t = j === hovered ? 11 : j === selected ? 5 : 0; if (stepS(sp, dt)) m = true; });
    items.sort((a, b) => a.x - b.x);
    let gateGlow = 0, hotSerial = 0;
    // stable ids, so the layer is only re-appended when the order actually changes
    const draw                                                         = gate.map((p, i) => ({ id: "g" + i, key: p.key, g: p.el.g }));
    items.forEach((it, k) => {
      const el = pool[it.j], sz = CUBE * it.s, x0 = it.x - sz / 2, x1 = it.x + sz / 2, y0 = BW / 2 - sz / 2, y1 = BW / 2 + sz / 2;
      const z0 = BT + lifts[it.j].x, z1 = z0 + sz;
      draw.push({ id: it.j, key: it.x + BW / 2, g: el.g });
      const target = buttons[it.j];
      const center = P(it.x, BW / 2, BT + CUBE / 2);
      target.style.left = `${center[0] / 4}%`;
      target.style.top = `${(center[1] - 80) / 1.9}%`;
      target.style.width = `${Math.max(24, sz * C.S * 1.05) / 4}%`;
      target.style.height = `${Math.max(24, sz * C.S * 1.1) / 1.9}%`;
      target.style.zIndex = String(10 + k);
      target.classList.toggle('is-active', it.j === selected);
      // Tiny crates retain a keyboard target but do not intercept the pointer.
      target.style.pointerEvents = it.s > 0.6 ? 'auto' : 'none';
      if (sz < 0.3) { el.g.setAttribute("visibility", "hidden"); return; }
      el.g.removeAttribute("visibility");
      const [rg, ig] = rings(x0, y0, x1, y1, 2.6 * it.s, 0.9 * it.s);
      put(el, prism(P, front, rg, ig, z0, z1));
      const isHot = it.j === hot;
      el.sil.classList.toggle("hi", isHot);
      // the serial, as a 3 × 3 code on the lid (bit 0 top-left)
      const pitch = sz * 0.2, rr = r2(0.55 * it.s * C.S);
      el.dots.forEach((d, b) => {
        place(d, P(it.x + ((b % 3) - 1) * pitch, BW / 2 + (Math.floor(b / 3) - 1) * pitch, z1));
        d.setAttribute("rx", String(rr)); d.setAttribute("ry", String(r2(rr * C.k)));
        d.setAttribute("class", (it.serial >> b) & 1 ? (isHot ? "dot" : "dot m") : "dot off");
      });
      if (isHot) hotSerial = it.serial;
      gateGlow = Math.max(gateGlow, glow(it.x) * it.s);
    });
    draw.sort((a, b) => a.key - b.key);
    const sig = draw.map((d) => d.id).join();
    if (sig !== order) { order = sig; draw.forEach((d) => layer.appendChild(d.g)); }
    // the edge colour mixed toward the lit one; written only when the percent changes
    const pct = Math.round(gateGlow * 100);
    if (pct !== gatePct) {
      gatePct = pct;
      const stroke = pct ? `color-mix(in srgb, var(--hl-hi) ${pct}%, var(--hl-edge))` : "";
      gate.forEach((p) => { p.el.sil.style.stroke = stroke; });
    }
    const off = (((clock * SPEED * L) % 21) + 21) % 21, sl           = [];
    for (let x = off; x < L; x += 21) if (x > 5 && x < L - 5) sl.push(seg(P(x, 4, BT), P(x, BW - 4, BT)));
    slats.setAttribute("d", sl.join(""));
    read.textContent = `rate ${rate.x.toFixed(2)}×` + (hot >= 0 ? ` · #${String(hotSerial).padStart(4, "0")}` : "");
    // The study asks for every frame. Under reduced motion at rest the belt is
    // stopped, so the frame would repeat itself: sleep until input or a change
    // of preference wakes it (both do). Visually the same.
    return seeking || !stopped || m;
  });
  bag.add(B.unregister);
  buttons.forEach((button, index) => {
    bag.on(button, 'pointerenter', () => { hovered = index; B.wake(); });
    bag.on(button, 'pointerleave', () => { hovered = -1; B.wake(); });
    bag.on(button, 'pointercancel', () => { hovered = -1; B.wake(); });
    bag.on(button, 'focus', () => { hovered = index; B.wake(); });
    bag.on(button, 'blur', () => { hovered = -1; B.wake(); });
    bag.on(button, 'click', () => bringToGate(index));
  });
  bag.add(() => svg.replaceChildren());
  return {
    select: index => bringToGate(index),
    pause: value => { paused = value; if (value) seeking = false; B.wake(); },
    hold: value => { reading = value; B.wake(); },
    destroy: bag.dispose,
  };
};
