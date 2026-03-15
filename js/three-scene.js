import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

const SHELL_MAX_OPACITY   = 0.75;
const WIRE_MAX_OPACITY    = 0.45;
const RING_MAX_OPACITY    = 0.55;
const LIGHT_MAX_INTENSITY = 1.4;

const projectsData = [
    { name: 'openGBW',        position: new THREE.Vector3( 250,      0,    150) },
    { name: 'RasPi Adhan',    position: new THREE.Vector3(  77.25, 237.75, 120) },
    { name: 'AVAT',           position: new THREE.Vector3(-202.25, 147,    100) },
    { name: 'FIT',            position: new THREE.Vector3(-202.25,-147,     80) },
    { name: 'Enrollment App', position: new THREE.Vector3(  77.25,-237.75,  90) },
];
let projectObjects = [];

export default function initThreeScene(onProjectClick) {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    let scene, camera, renderer, particles, lines;
    let mouseX = 0, mouseY = 0;
    let isZoomed = false;
    let scrollTargetZ = 1000;
    let hoveredIdx = -1;

    // ── Scene ──────────────────────────────────────────────────────────────
    scene  = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000);
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // ── Lighting ───────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 5, 1000);
    scene.add(dirLight);

    // ── Background Particles ───────────────────────────────────────────────
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) positions[i] = Math.random() * 2000 - 1000;

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x818CF8, size: 2, transparent: true, blending: THREE.AdditiveBlending,
    });
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // ── Constellation Lines ────────────────────────────────────────────────
    const linePositions = [];
    const maxDist = 150;
    for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
            const dx = positions[i*3]   - positions[j*3];
            const dy = positions[i*3+1] - positions[j*3+1];
            const dz = positions[i*3+2] - positions[j*3+2];
            if (dx*dx + dy*dy + dz*dz < maxDist*maxDist) {
                linePositions.push(
                    positions[i*3], positions[i*3+1], positions[i*3+2],
                    positions[j*3], positions[j*3+1], positions[j*3+2]
                );
            }
        }
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x818CF8, transparent: true, opacity: 0.05 });
    lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // ── Comet System ───────────────────────────────────────────────────────
    const COMET_COUNT = 6;
    const cometColor  = new THREE.Color(0xA5B4FC);
    const comets      = [];

    function spawnComet() {
        const trailLength = 22;
        const pts = [], cols = [];
        for (let i = 0; i < trailLength; i++) {
            pts.push(new THREE.Vector3(-i * 13, i * 3, 0));
            const t = 1 - i / trailLength;
            cols.push(cometColor.r * t, cometColor.g * t, cometColor.b * t);
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
        const mat = new THREE.LineBasicMaterial({
            vertexColors: true, transparent: true, opacity: 0,
            blending: THREE.AdditiveBlending,
        });
        const line = new THREE.Line(geo, mat);
        resetComet(line);
        scene.add(line);
        return line;
    }

    function resetComet(comet) {
        comet.position.set(-1400, Math.random() * 2000 - 1000, Math.random() * 600 - 300);
        comet.rotation.z = -(Math.random() * 0.25 + 0.05);
        comet.userData.vx      = 10 + Math.random() * 8;
        comet.userData.vy      = -(Math.random() * 1.5 + 0.2);
        comet.userData.life    = 0;
        comet.userData.delay   = Math.random() * 250;
        comet.userData.maxLife = 170 + Math.random() * 110;
        comet.material.opacity = 0;
    }

    for (let i = 0; i < COMET_COUNT; i++) {
        const c = spawnComet();
        c.userData.delay = i * 70 + Math.random() * 60;
        comets.push(c);
    }

    // ── Project Orbs ───────────────────────────────────────────────────────
    const labelsContainer = document.getElementById('project-labels');

    // Per-project accent colours
    const orbColors  = [0x6366f1, 0xEC4899, 0xF59E0B, 0x14B8A6, 0x10B981];
    const cssColors  = ['#6366f1','#EC4899','#F59E0B','#14B8A6','#10B981'];

    projectsData.forEach((proj, index) => {
        const col  = orbColors[index % orbColors.length];
        const css  = cssColors[index % cssColors.length];

        const projectGroup = new THREE.Group();
        projectGroup.position.copy(proj.position);
        projectGroup.name = proj.name;
        scene.add(projectGroup);

        // ── Outer glass shell ──
        const shellGeo = new THREE.IcosahedronGeometry(80, 1);
        const originalVertices = shellGeo.attributes.position.clone();
        const shellMat = new THREE.MeshPhysicalMaterial({
            color: col, metalness: 0.15, roughness: 0.15,
            transmission: 0.5, ior: 1.5, thickness: 2.0,
            transparent: true, opacity: 0, depthTest: false,
        });
        const shell = new THREE.Mesh(shellGeo, shellMat);
        shell.renderOrder = 1;
        shell.name = proj.name;
        projectGroup.add(shell);

        // ── Wireframe glow overlay ──
        const wireMat = new THREE.LineBasicMaterial({
            color: col, transparent: true, opacity: 0,
            blending: THREE.AdditiveBlending,
        });
        const wireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(84, 1)),
            wireMat
        );
        projectGroup.add(wireframe);

        // ── Inner core ──
        const coreMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0 });
        const core    = new THREE.Mesh(new THREE.IcosahedronGeometry(30, 1), coreMat);
        projectGroup.add(core);

        // ── Orbiting torus ring — unique tilt per orb ──
        const ringMat = new THREE.MeshBasicMaterial({
            color: col, transparent: true, opacity: 0,
            blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(110, 1.6, 8, 80), ringMat);
        ring.rotation.x = Math.PI / 4 + index * 0.28;   // unique tilt per orb
        ring.rotation.z = index * 0.55;
        projectGroup.add(ring);

        // ── Soft point light for glow ──
        const ptLight = new THREE.PointLight(col, 0, 380);
        projectGroup.add(ptLight);

        // ── HTML label ──
        const labelDiv = document.createElement('div');
        labelDiv.className = 'project-label';
        labelDiv.textContent = proj.name;
        labelDiv.style.setProperty('--clr', css);
        labelsContainer.appendChild(labelDiv);

        projectObjects.push({
            group: projectGroup,
            shell, wireframe, wireMat,
            core, ring, ringMat,
            ptLight, label: labelDiv,
            originalVertices,
            isBursting: false,
            burstStartTime: 0,
            // GSAP-tweened scale for intensity (0 = hidden, 1 = full)
            lightScale: 0,
        });
    });

    // ── Raycaster (shared, re-used each frame) ─────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse     = new THREE.Vector2();

    // ── Transition helpers ─────────────────────────────────────────────────
    function transitionToProjects() {
        if (isZoomed) return;
        isZoomed = true;
        const targetZ = window.innerWidth / window.innerHeight > 1.2 ? 700 : 900;
        gsap.to(camera.position, { z: targetZ, duration: 2.5, ease: 'power3.inOut' });
        gsap.to(particles.material, { opacity: 0.15, duration: 2 });
        gsap.to(lines.material,     { opacity: 0.15, duration: 2 });

        projectObjects.forEach(p => {
            gsap.to(p.shell.material, { opacity: SHELL_MAX_OPACITY, duration: 2, delay: 1 });
            gsap.to(p.wireMat,        { opacity: WIRE_MAX_OPACITY,  duration: 2, delay: 1.2 });
            gsap.to(p.core.material,  { opacity: 1,                 duration: 2, delay: 1 });
            gsap.to(p.ringMat,        { opacity: RING_MAX_OPACITY,  duration: 2, delay: 1.4 });
            gsap.to(p,                { lightScale: 1,              duration: 2, delay: 1 });
            gsap.to(p.label,          { opacity: 1,                 duration: 2, delay: 1 });
        });
    }

    function resetView() {
        if (!isZoomed) return;
        isZoomed  = false;
        hoveredIdx = -1;
        canvas.style.cursor = 'default';
        gsap.to(camera.position,    { z: 1000, duration: 2.5, ease: 'power3.inOut' });
        gsap.to(particles.material, { opacity: 1.0, duration: 2 });
        gsap.to(lines.material,     { opacity: 0.05, duration: 2 });

        projectObjects.forEach(p => {
            gsap.killTweensOf(p.group.scale);
            gsap.to(p.shell.material, { opacity: 0, duration: 1.5 });
            gsap.to(p.wireMat,        { opacity: 0, duration: 1.5 });
            gsap.to(p.core.material,  { opacity: 0, duration: 1.5 });
            gsap.to(p.ringMat,        { opacity: 0, duration: 1.5 });
            gsap.to(p,                { lightScale: 0, duration: 1.5 });
            gsap.to(p.group.scale,    { x: 1, y: 1, z: 1, duration: 0.3 });
            gsap.to(p.label,          { opacity: 0, duration: 1.5 });
        });
    }

    function updateScrollParallax(progress) {
        if (!isZoomed) scrollTargetZ = 1000 - progress * 450;
    }

    // ── Click handler ──────────────────────────────────────────────────────
    function onCanvasClick(event) {
        if (!isZoomed) return;
        mouse.x =  (event.clientX / window.innerWidth)  * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight)  * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const hits = raycaster.intersectObjects(projectObjects.map(p => p.shell));
        if (!hits.length) return;

        const projectObj = projectObjects.find(p => p.shell === hits[0].object);
        if (!projectObj || projectObj.isBursting) return;

        projectObj.isBursting = true;
        projectObj.burstStartTime = Date.now();

        setTimeout(() => { if (onProjectClick) onProjectClick(hits[0].object.name); }, 320);

        setTimeout(() => {
            const posAttr = projectObj.shell.geometry.attributes.position;
            for (let i = 0; i < posAttr.count; i++) {
                posAttr.setXYZ(i,
                    projectObj.originalVertices.getX(i),
                    projectObj.originalVertices.getY(i),
                    projectObj.originalVertices.getZ(i)
                );
            }
            posAttr.needsUpdate = true;
            projectObj.isBursting = false;
            gsap.to(projectObj.shell.material, { opacity: SHELL_MAX_OPACITY, duration: 0.6 });
            gsap.to(projectObj.wireMat,        { opacity: WIRE_MAX_OPACITY,  duration: 0.6 });
            gsap.to(projectObj.core.material,  { opacity: 1, duration: 0.6 });
        }, 700);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (isZoomed) {
            gsap.to(camera.position, { z: camera.aspect > 1.2 ? 700 : 900, duration: 1 });
        }
    }

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX - window.innerWidth  / 2;
        mouseY = e.clientY - window.innerHeight / 2;
    });
    canvas.addEventListener('click', onCanvasClick);
    window.addEventListener('resize', onWindowResize);

    // ── Render Loop ────────────────────────────────────────────────────────
    function animate() { requestAnimationFrame(animate); render(); }

    function render() {
        const time      = Date.now() * 0.0005;
        const glitchTime = Date.now() * 0.001;

        // ── Comets ──
        comets.forEach(comet => {
            comet.userData.life++;
            const localLife = comet.userData.life - comet.userData.delay;
            if (localLife < 0) return;
            if (localLife > comet.userData.maxLife) { resetComet(comet); return; }
            const prog = localLife / comet.userData.maxLife;
            comet.material.opacity =
                prog < 0.12 ? (prog / 0.12) * 0.85
              : prog > 0.78 ? ((1 - prog) / 0.22) * 0.85
              : 0.85;
            comet.position.x += comet.userData.vx;
            comet.position.y += comet.userData.vy;
        });

        // ── Hover detection ──
        if (isZoomed) {
            mouse.x =  mouseX / (window.innerWidth  / 2);
            mouse.y = -mouseY / (window.innerHeight / 2);
            raycaster.setFromCamera(mouse, camera);
            const hits       = raycaster.intersectObjects(projectObjects.map(p => p.shell));
            const newHovered = hits.length > 0
                ? projectObjects.findIndex(p => p.shell === hits[0].object)
                : -1;

            if (newHovered !== hoveredIdx) {
                // Un-hover previous
                if (hoveredIdx >= 0) {
                    const prev = projectObjects[hoveredIdx];
                    gsap.to(prev.group.scale, { x: 1, y: 1, z: 1, duration: 0.35, ease: 'power2.out' });
                    gsap.to(prev.wireMat,     { opacity: WIRE_MAX_OPACITY, duration: 0.35 });
                    gsap.to(prev,             { lightScale: 1, duration: 0.35 });
                }
                // Hover new
                if (newHovered >= 0) {
                    const curr = projectObjects[newHovered];
                    gsap.to(curr.group.scale, { x: 1.13, y: 1.13, z: 1.13, duration: 0.35, ease: 'power2.out' });
                    gsap.to(curr.wireMat,     { opacity: 0.9, duration: 0.35 });
                    gsap.to(curr,             { lightScale: 2.4, duration: 0.35 });
                }
                canvas.style.cursor = newHovered >= 0 ? 'pointer' : 'default';
                hoveredIdx = newHovered;
            }
        }

        // ── Per-orb animation ──
        projectObjects.forEach((p, index) => {
            p.group.rotation.x = time * 0.5;
            p.group.rotation.y = time * 0.3;

            // Ring spins on its own axis (each at slightly different speed)
            p.ring.rotation.y = time * (0.8 + index * 0.12);

            // Drive point light from tweened lightScale + sine pulse
            if (p.lightScale > 0) {
                const pulse = 0.7 + 0.3 * ((Math.sin(time * 5 + index) + 1) / 2);
                p.ptLight.intensity = LIGHT_MAX_INTENSITY * p.lightScale * pulse;
            } else {
                p.ptLight.intensity = 0;
            }

            const posAttr = p.shell.geometry.attributes.position;

            if (p.isBursting) {
                // Burst: vertices expand outward
                const elapsed  = Date.now() - p.burstStartTime;
                const progress = Math.min(elapsed / 520, 1);
                const eased    = 1 - Math.pow(1 - progress, 2);
                const vertex   = new THREE.Vector3();

                for (let i = 0; i < posAttr.count; i++) {
                    vertex.fromBufferAttribute(p.originalVertices, i);
                    const s = 1 + eased * 3.5;
                    posAttr.setXYZ(i, vertex.x * s, vertex.y * s, vertex.z * s);
                }
                posAttr.needsUpdate = true;
                p.shell.geometry.computeVertexNormals();
                p.shell.material.opacity = SHELL_MAX_OPACITY * (1 - eased);
                p.core.material.opacity  = 1 - eased;
                p.wireMat.opacity        = WIRE_MAX_OPACITY  * (1 - eased);
            } else {
                // Idle: pulsating core + glitchy shell surface
                const pulse = (Math.sin(time * 5 + index) + 1) / 2;
                const s     = 1 + pulse * 0.15;
                p.core.scale.set(s, s, s);

                const vertex = new THREE.Vector3();
                for (let i = 0; i < posAttr.count; i++) {
                    vertex.fromBufferAttribute(p.originalVertices, i);
                    const noise = (Math.sin(i * 1.5 + glitchTime) + Math.cos(i * 2.5 + glitchTime)) * 0.5;
                    vertex.addScalar(noise);
                    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
                }
                posAttr.needsUpdate = true;
                p.shell.geometry.computeVertexNormals();
            }

        });

        // ── Camera ── (update first so labels project with the correct matrix)
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;

        if (!isZoomed) {
            camera.position.z += (scrollTargetZ - camera.position.z) * 0.03;
            const t = Date.now() * 0.00005;
            particles.rotation.y = t * 0.4;
            lines.rotation.y     = t * 0.4;
        }

        camera.lookAt(scene.position);
        camera.updateMatrixWorld();

        // ── Label positioning (after camera is finalised) ──
        const _v = new THREE.Vector3();
        projectObjects.forEach(p => {
            p.core.getWorldPosition(_v);
            _v.project(camera);
            p.label.style.left = `${( _v.x *  0.5 + 0.5) * canvas.clientWidth}px`;
            p.label.style.top  = `${(-_v.y *  0.5 + 0.5) * canvas.clientHeight}px`;
        });

        renderer.render(scene, camera);
    }

    animate();

    return { transitionToProjects, resetView, updateScrollParallax };
}
