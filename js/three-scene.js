import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

const SHELL_TRANSMISSION = 0.5;
const SHELL_MAX_OPACITY = 0.8;

const projectsData = [
    { name: 'openGBW', position: new THREE.Vector3(250, 0, 150), url: 'https://github.com/S-sd-s/openGBW' },
    { name: 'RasPi Adhan', position: new THREE.Vector3(77.25, 237.75, 120), url: 'https://github.com/S-sd-s/RasPi-Adhan' },
    { name: 'AVAT', position: new THREE.Vector3(-202.25, 147, 100), url: 'https://github.com/S-sd-s/AVAT' },
    { name: 'FIT', position: new THREE.Vector3(-202.25, -147, 80), url: 'https://github.com/S-sd-s/FIT' },
    { name: 'Enrollment App', position: new THREE.Vector3(77.25, -237.75, 90), url: 'https://github.com/S-sd-s/Enrollment-App' },
];
let projectObjects = [];

export default function initThreeScene(onProjectClick) {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    let scene, camera, renderer, particles, lines, mouseX = 0, mouseY = 0;
    let isZoomed = false;
    let scrollTargetZ = 1000;

    // --- Basic Scene Setup ---
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000);
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 1000);
    scene.add(directionalLight);

    // --- Background Particles & Constellations ---
    const particleCount = 5000;
    const positions = [];
    for (let i = 0; i < particleCount; i++) {
        positions.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({ color: 0x818CF8, size: 2, transparent: true, blending: THREE.AdditiveBlending });
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x818CF8, transparent: true, opacity: 0.05 });
    const linePositions = [];
    const maxDistance = 150;
    const particlePositions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
            const dx = particlePositions[i * 3] - particlePositions[j * 3];
            const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
            const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
            if (Math.sqrt(dx * dx + dy * dy + dz * dz) < maxDistance) {
                linePositions.push(
                    particlePositions[i * 3], particlePositions[i * 3 + 1], particlePositions[i * 3 + 2],
                    particlePositions[j * 3], particlePositions[j * 3 + 1], particlePositions[j * 3 + 2]
                );
            }
        }
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- Comet System ---
    const COMET_COUNT = 6;
    const cometColor = new THREE.Color(0xA5B4FC);
    const comets = [];

    function spawnComet() {
        const trailLength = 22;
        const pts = [];
        const cols = [];
        for (let i = 0; i < trailLength; i++) {
            // Head at i=0, tail extends in -x, slightly +y
            pts.push(new THREE.Vector3(-i * 13, i * 3, 0));
            const t = 1 - i / trailLength;
            cols.push(cometColor.r * t, cometColor.g * t, cometColor.b * t);
        }
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
        const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
        const line = new THREE.Line(geo, mat);
        resetComet(line);
        scene.add(line);
        return line;
    }

    function resetComet(comet) {
        // All comets travel left-to-right with slight downward angle
        comet.position.set(
            -1400,
            Math.random() * 2000 - 1000,
            Math.random() * 600 - 300
        );
        comet.rotation.z = -(Math.random() * 0.25 + 0.05);
        comet.userData.vx = 10 + Math.random() * 8;
        comet.userData.vy = -(Math.random() * 1.5 + 0.2);
        comet.userData.life = 0;
        comet.userData.delay = Math.random() * 250;
        comet.userData.maxLife = 170 + Math.random() * 110;
        comet.material.opacity = 0;
    }

    for (let i = 0; i < COMET_COUNT; i++) {
        const c = spawnComet();
        c.userData.delay = i * 70 + Math.random() * 60;
        comets.push(c);
    }

    // --- Create Project Stars ---
    const labelsContainer = document.getElementById('project-labels');
    const colors = [0x4F46E5, 0xEC4899, 0xF59E0B, 0x14B8A6, 0x10B981];

    projectsData.forEach((proj, index) => {
        const projectGroup = new THREE.Group();
        projectGroup.position.copy(proj.position);
        projectGroup.name = proj.name;
        scene.add(projectGroup);

        const shellGeometry = new THREE.IcosahedronGeometry(80, 1);
        const originalVertices = shellGeometry.attributes.position.clone();
        const shellMaterial = new THREE.MeshPhysicalMaterial({
            color: colors[index % colors.length],
            metalness: 0.1,
            roughness: 0.2,
            transmission: SHELL_TRANSMISSION,
            ior: 1.5,
            thickness: 2.0,
            transparent: true,
            opacity: 0,
            depthTest: false,
        });
        const shell = new THREE.Mesh(shellGeometry, shellMaterial);
        shell.renderOrder = 1;
        shell.name = proj.name;
        projectGroup.add(shell);

        const coreGeometry = new THREE.IcosahedronGeometry(30, 1);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: colors[index % colors.length],
            transparent: true,
            opacity: 0,
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        projectGroup.add(core);

        const labelDiv = document.createElement('div');
        labelDiv.className = 'project-label';
        labelDiv.textContent = proj.name;
        labelsContainer.appendChild(labelDiv);

        projectObjects.push({
            group: projectGroup,
            shell,
            core,
            label: labelDiv,
            originalVertices,
            isBursting: false,
            burstStartTime: 0,
        });
    });

    // --- Animation & Control Functions ---
    function transitionToProjects() {
        if (isZoomed) return;
        isZoomed = true;
        const aspect = window.innerWidth / window.innerHeight;
        const targetZ = aspect > 1.2 ? 700 : 900;
        gsap.to(camera.position, { z: targetZ, duration: 2.5, ease: "power3.inOut" });
        gsap.to(particles.material, { opacity: 0.15, duration: 2, ease: "power2.out" });
        gsap.to(lines.material, { opacity: 0.15, duration: 2, ease: "power2.out" });

        projectObjects.forEach(p => {
            gsap.to(p.shell.material, { opacity: SHELL_MAX_OPACITY, duration: 2, delay: 1, ease: "power2.inOut" });
            gsap.to(p.core.material, { opacity: 1, duration: 2, delay: 1, ease: "power2.inOut" });
            gsap.to(p.label, { opacity: 1, duration: 2, delay: 1, ease: "power2.inOut" });
        });
    }

    function resetView() {
        if (!isZoomed) return;
        isZoomed = false;
        gsap.to(camera.position, { z: 1000, duration: 2.5, ease: "power3.inOut" });
        gsap.to(particles.material, { opacity: 1.0, duration: 2, ease: "power2.out" });
        gsap.to(lines.material, { opacity: 0.05, duration: 2, ease: "power2.out" });

        projectObjects.forEach(p => {
            gsap.to(p.shell.material, { opacity: 0, duration: 1.5, ease: "power2.inOut" });
            gsap.to(p.core.material, { opacity: 0, duration: 1.5, ease: "power2.inOut" });
            gsap.to(p.label, { opacity: 0, duration: 1.5, ease: "power2.inOut" });
        });
    }

    function updateScrollParallax(progress) {
        if (!isZoomed) {
            scrollTargetZ = 1000 - progress * 220;
        }
    }

    // --- Event Listeners & Raycasting ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onCanvasClick(event) {
        if (!isZoomed) return;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const meshes = projectObjects.map(p => p.shell);
        const intersects = raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            const clickedName = clickedObject.name;
            const projectObj = projectObjects.find(p => p.shell === clickedObject);

            if (projectObj && !projectObj.isBursting) {
                projectObj.isBursting = true;
                projectObj.burstStartTime = Date.now();

                // Open modal slightly before burst finishes
                setTimeout(() => {
                    if (onProjectClick) { onProjectClick(clickedName); }
                }, 320);

                // Reset geometry and fade back in after burst + modal open
                setTimeout(() => {
                    const posAttr = projectObj.shell.geometry.attributes.position;
                    for (let i = 0; i < posAttr.count; i++) {
                        posAttr.setXYZ(
                            i,
                            projectObj.originalVertices.getX(i),
                            projectObj.originalVertices.getY(i),
                            projectObj.originalVertices.getZ(i)
                        );
                    }
                    posAttr.needsUpdate = true;
                    projectObj.isBursting = false;
                    gsap.to(projectObj.shell.material, { opacity: SHELL_MAX_OPACITY, duration: 0.6 });
                    gsap.to(projectObj.core.material, { opacity: 1, duration: 0.6 });
                }, 700);
            }
        }
    }

    function onWindowResize() {
        const aspect = window.innerWidth / window.innerHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (isZoomed) {
            const targetZ = aspect > 1.2 ? 700 : 900;
            gsap.to(camera.position, { z: targetZ, duration: 1, ease: "power2.out" });
        }
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX - window.innerWidth / 2;
        mouseY = e.clientY - window.innerHeight / 2;
    }, false);
    canvas.addEventListener('click', onCanvasClick, false);
    window.addEventListener('resize', onWindowResize, false);

    // --- Render Loop ---
    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        const time = Date.now() * 0.0005;
        const glitchTime = Date.now() * 0.001;

        // --- Comet update ---
        comets.forEach(comet => {
            comet.userData.life++;
            const localLife = comet.userData.life - comet.userData.delay;
            if (localLife < 0) return;

            if (localLife > comet.userData.maxLife) {
                resetComet(comet);
                return;
            }

            const progress = localLife / comet.userData.maxLife;
            if (progress < 0.12) {
                comet.material.opacity = (progress / 0.12) * 0.85;
            } else if (progress > 0.78) {
                comet.material.opacity = ((1 - progress) / 0.22) * 0.85;
            } else {
                comet.material.opacity = 0.85;
            }
            comet.position.x += comet.userData.vx;
            comet.position.y += comet.userData.vy;
        });

        // --- Project objects ---
        projectObjects.forEach((p, index) => {
            p.group.rotation.x = time * 0.5;
            p.group.rotation.y = time * 0.3;

            const posAttr = p.shell.geometry.attributes.position;

            if (p.isBursting) {
                const elapsed = Date.now() - p.burstStartTime;
                const progress = Math.min(elapsed / 520, 1);
                const eased = 1 - Math.pow(1 - progress, 2);
                const vertex = new THREE.Vector3();

                for (let i = 0; i < posAttr.count; i++) {
                    vertex.fromBufferAttribute(p.originalVertices, i);
                    const scale = 1 + eased * 3.5;
                    posAttr.setXYZ(i, vertex.x * scale, vertex.y * scale, vertex.z * scale);
                }
                posAttr.needsUpdate = true;
                p.shell.geometry.computeVertexNormals();
                p.shell.material.opacity = SHELL_MAX_OPACITY * (1 - eased);
                p.core.material.opacity = 1 - eased;
            } else {
                // Pulsating core
                const pulse = (Math.sin(time * 5 + index) + 1) / 2;
                const scale = 1 + pulse * 0.15;
                p.core.scale.set(scale, scale, scale);

                // Glitchy vertex animation
                const vertex = new THREE.Vector3();
                const glitchAmount = 0.5;
                for (let i = 0; i < posAttr.count; i++) {
                    vertex.fromBufferAttribute(p.originalVertices, i);
                    const noise = (Math.sin(i * 1.5 + glitchTime) + Math.cos(i * 2.5 + glitchTime)) * glitchAmount;
                    vertex.addScalar(noise);
                    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
                }
                posAttr.needsUpdate = true;
                p.shell.geometry.computeVertexNormals();
            }

            // Label screen-space positioning
            const vector = new THREE.Vector3();
            vector.setFromMatrixPosition(p.group.matrixWorld);
            vector.project(camera);
            const x = (vector.x * 0.5 + 0.5) * canvas.clientWidth;
            const y = (vector.y * -0.5 + 0.5) * canvas.clientHeight;
            p.label.style.left = `${x}px`;
            p.label.style.top = `${y}px`;
        });

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;

        if (!isZoomed) {
            // Scroll parallax: smoothly lerp camera.z toward scrollTargetZ
            camera.position.z += (scrollTargetZ - camera.position.z) * 0.03;
            const t = Date.now() * 0.00005;
            particles.rotation.y = t * 0.4;
            lines.rotation.y = t * 0.4;
        }

        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

    animate();

    return { transitionToProjects, resetView, updateScrollParallax };
}
