import { projectDetails } from './modal.js?v=20261011-9';
import { renderProjectStory } from './project-stories.js?v=20261011-9';

// One shared folder. Each HTML sheet is projected onto the same isometric
// camera as the folder outline, so its title and blurb live on the file.
export default function initProjectArchive() {
  const stage = document.getElementById('archive-stage');
  const files = document.getElementById('archive-files');
  const resize = new ResizeObserver(() => { files.style.scale = String(stage.clientWidth / 1000); });
  resize.observe(stage);
  files.style.scale = String(stage.clientWidth / 1000);
  const status = document.getElementById('archive-status');
  const detailPanel = document.getElementById('archive-details');
  const { Cam, fit, proj, poly, fillet, mk, register, tween, tset, tval, tdone, spring, stepS } = HL;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [160, 105, 0], [0, 0, 170], [210, 105, 170]], 500, 300);
  const P = proj(C);
  const outline = (points, radii) => poly(fillet(points, radii).map(([x, z]) => P(x, 0, z)));
  const back = stage.querySelector('.archive-back');
  const front = stage.querySelector('.archive-front');
  mk('path', { d: outline([[0, 0], [164, 0], [164, 103], [66, 103], [60, 114], [10, 114], [4, 103], [0, 103]], [3, 3, 4, 2, 3, 3, 2, 4]), class: 'archive-outline' }, back);
  mk('path', { d: poly([P(0, 0, 0), P(164, 0, 0), P(164, 104, 0), P(0, 104, 0)]), class: 'archive-fold' }, back);
  const cover = fillet([[0, 0], [164, 0], [164, 77], [0, 77]], [3, 3, 4, 4]);
  const coverPoint = (x, z) => P(x, 104 + z * 0.72, z * 0.68);
  mk('path', { d: poly(cover.map(([x, z]) => coverPoint(x, z))), class: 'archive-cover' }, front);
  mk('path', { d: poly(fillet([[5, 4], [159, 4], [159, 73], [5, 73]], [2, 2, 3, 3]).map(([x, z]) => coverPoint(x, z))), class: 'archive-crease' }, front);

  const projects = Array.from(document.querySelectorAll('#project-library .project-card')).map((card, index) => {
    const button = document.createElement('button');
    const title = card.querySelector('.folder-title').textContent;
    const blurb = card.querySelector('.project-copy > p:not(.project-status)').textContent;
    const name = card.querySelector('[data-project-name]').dataset.projectName;
    button.type = 'button';
    button.className = 'archive-sheet';
    button.setAttribute('aria-label', title);
    button.setAttribute('aria-pressed', 'false');
    const tab = document.createElement('span');
    tab.className = 'archive-sheet-tab';
    tab.textContent = `${String(index + 1).padStart(2, '0')}  ${title}`;
    const body = document.createElement('span');
    body.className = 'archive-sheet-body';
    const category = document.createElement('span');
    category.className = 'archive-sheet-category';
    category.textContent = card.dataset.category.replaceAll(' ', ' / ').toUpperCase() + (index >= 8 ? ' · PLANNED' : '');
    const heading = document.createElement('span');
    heading.className = 'archive-sheet-title';
    heading.textContent = title;
    const description = document.createElement('span');
    description.className = 'archive-sheet-description';
    description.textContent = blurb;
    const hint = document.createElement('span');
    hint.className = 'archive-sheet-hint';
    hint.textContent = 'PROJECT NOTES ↗';
    const tech = document.createElement('span');
    tech.className = 'archive-sheet-tech';
    tech.textContent = Array.from(card.querySelectorAll('.project-tech > span')).map(item => item.textContent).join(' / ');
    body.append(category, heading, description, tech, hint);
    button.append(tab, body);
    button.tabIndex = -1;
    button.setAttribute('aria-hidden', 'true');
    files.appendChild(button);
    const target = document.createElement('button');
    target.type = 'button';
    target.className = 'archive-file-target';
    target.setAttribute('aria-label', title);
    target.setAttribute('aria-pressed', 'false');
    target.style.zIndex = String(50 + index);
    files.appendChild(target);
    const project = { button, target, title, name, blurb, category: card.dataset.category, index, rowY: 9 + index * 10, y: tween(9 + index * 10, 500), lift: tween(0, 560), slide: tween(0, 560), hover: spring(0), last: '', lastTarget: '' };
    button.addEventListener('click', () => {
      if (selected === project) detailPanel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      else select(project);
    });
    target.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch' && matchMedia('(hover: hover)').matches) peek(project);
    });
    target.addEventListener('pointerleave', () => peek(null));
    target.addEventListener('pointercancel', () => peek(null));
    target.addEventListener('focus', () => peek(project));
    target.addEventListener('blur', () => peek(null));
    target.addEventListener('click', () => select(project));
    target.addEventListener('keydown', event => {
      const visible = projects.filter(item => !item.button.hidden);
      const current = visible.indexOf(project);
      const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      const next = visible[(current + direction + visible.length) % visible.length];
      select(next);
      next.target.focus();
    });
    return project;
  });
  let selected, hovered;
  const draw = now => {
    for (const project of projects) {
      if (project.button.hidden) continue;
      const y = tval(project.y, now);
      const rest = P(6, y, 100), rx = P(7, y, 100), rz = P(6, y, 99);
      const targetTransform = `matrix(${rx[0]-rest[0]},${rx[1]-rest[1]},${rz[0]-rest[0]},${rz[1]-rest[1]},${rest[0]},${rest[1]})`;
      if (targetTransform !== project.lastTarget) {
        project.target.style.transform = targetTransform;
        project.lastTarget = targetTransform;
      }
      const lift = tval(project.lift, now) + project.hover.x, slide = tval(project.slide, now);
      // x follows the page's width; the second axis points down its upright face.
      const origin = P(6 + slide, y, 100 + lift);
      const x = P(7 + slide, y, 100 + lift), z = P(6 + slide, y, 99 + lift);
      const transform = `matrix(${x[0]-origin[0]},${x[1]-origin[1]},${z[0]-origin[0]},${z[1]-origin[1]},${origin[0]},${origin[1]})`;
      if (transform !== project.last) {
        project.button.style.transform = transform;
        project.last = transform;
      }
    }
  };
  const loop = register(stage, (_dt, now) => {
    let hovering = false;
    projects.forEach(project => { if (stepS(project.hover, _dt)) hovering = true; });
    draw(now);
    projects.forEach(project => {
      // Rejoin the stack as soon as the sheet reaches it; the long ease-out
      // tail should settle behind the other files, rather than hovering above them.
      if (project !== selected && Math.abs(tval(project.lift, now)) < 3 && Math.abs(tval(project.slide, now)) < 3) {
        project.button.style.zIndex = String(project.index + 1);
      }
    });
    return hovering || projects.some(project => !tdone(project.y, now) || !tdone(project.lift, now) || !tdone(project.slide, now));
  });
  function peek(project) {
    if (hovered === project) return;
    hovered = project;
    projects.forEach(item => {
      const active = item === project && item !== selected;
      item.button.classList.toggle('is-hovered', active);
      item.hover.t = active ? 5 : 0;
    });
    loop.wake();
  }
  function select(project) {
    if (!project || selected === project) return;
    selected = project;
    const now = performance.now();
    projects.forEach(item => {
      const active = item === project;
      item.hover.t = 0;
      item.button.classList.remove('is-hovered');
      item.button.classList.toggle('is-selected', active);
      item.button.setAttribute('aria-pressed', String(active));
      item.target.setAttribute('aria-pressed', String(active));

      if (active) item.button.style.zIndex = '30';
      else if (item.button.style.zIndex === '30') item.button.style.zIndex = '29';
      // Pull the selected page into a clear space on the right of every resting tab.
      const rest = P(6, item.rowY, 100), right = P(7, item.rowY, 100), down = P(6, item.rowY, 99);
      const slide = (700 - rest[0]) / (right[0] - rest[0]);
      const lift = (rest[1] + slide * (right[1] - rest[1]) - 70) / (down[1] - rest[1]);
      tset(item.lift, active ? lift : 0, now, 0);
      tset(item.slide, active ? slide : 0, now, 0);
      item.lift.dur = item.slide.dur = active ? 560 : 380;
    });
    status.textContent = `${String(project.index + 1).padStart(2, '0')} / ${project.title}`;
    renderDetails(project);
    loop.wake();

  }
  function renderDetails(project) {
    const details = projectDetails[project.name];
    document.getElementById('archive-detail-title').textContent = project.title;
    document.getElementById('archive-detail-kind').textContent = details.concept ? 'PROJECT CONCEPT / PLANNED' : 'PROJECT DETAILS';
    document.getElementById('archive-description').textContent = details.description;
    const source = document.getElementById('archive-source');
    source.hidden = !details.link || details.link === '#';
    if (!source.hidden) source.href = details.link;
    document.getElementById('archive-tech-heading').textContent = details.concept ? 'Proposed stack' : 'Technology stack';
    document.getElementById('archive-features-heading').textContent = details.concept ? 'Planned capabilities' : 'Key features';
    document.getElementById('archive-challenges-heading').textContent = details.concept ? 'Design considerations' : 'Project challenges';
    const tech = document.getElementById('archive-tech');
    tech.replaceChildren(...details.techStack.map(text => {
      const tag = document.createElement('span'); tag.textContent = text; return tag;
    }));
    const features = document.getElementById('archive-features');
    features.replaceChildren(...details.features.map(text => {
      const item = document.createElement('li'); item.textContent = text; return item;
    }));
    document.getElementById('archive-challenges').textContent = details.challenges || '';
    renderProjectStory(project.name, {
      container: document.getElementById('archive-case-study'),
      architecture: document.getElementById('archive-architecture'),
      detailId: 'archive-architecture-detail',
    });
  }
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(filter => {
        const active = button === filter;
        filter.classList.toggle('active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      const visible = projects.filter(project => button.dataset.filter === 'all' || project.category.split(' ').includes(button.dataset.filter));
      const now = performance.now();
      projects.forEach(project => {
        project.button.hidden = !visible.includes(project);
        project.target.hidden = project.button.hidden;
        const index = visible.indexOf(project);
        if (index >= 0) {
          project.rowY = 9 + index * 10;
          tset(project.y, project.rowY, now, 0);
        }
      });
      document.getElementById('archive-count').textContent = `${visible.length} FILES`;
      document.getElementById('project-count').textContent = `Showing ${visible.length} projects`;
      const next = visible.includes(selected) ? selected : visible[0];
      selected = null;
      select(next);
    });
  });
  draw(0);
  select(projects[0]);
  if (window.innerWidth <= 600) stage.parentElement.scrollLeft = stage.clientWidth - stage.parentElement.clientWidth;
  window.addEventListener('pagehide', event => { if (!event.persisted) { loop.unregister(); resize.disconnect(); } });
}
