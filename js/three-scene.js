import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

// --- Configuration ---
// Adjust these values to change the appearance of the project "comets"

// Controls the glass-like appearance of the outer shell.
// 0.0 = opaque, 1.0 = fully transparent/glass-like.
const SHELL_TRANSMISSION = 0.5;

// Controls the final opacity of the outer shell after the fade-in animation.
// 0.0 = fully transparent, 1.0 = fully opaque.
const SHELL_MAX_OPACITY = 0.8;


// Data for our project
const projectsData = [
    { name: 'openGBW', position: new THREE.Vector3(-350, 50, 150) },
    { name: 'RasPi Adhan', position: new THREE.Vector3(350, -100, 120) },
    { name: 'AVAT', position: new THREE.Vector3(0, 150, 100) },
    { name: 'FIT', position: new THREE.Vector3(450, 50, 80) },
    { name: 'Enrollment App', position: new THREE.Vector3(-450, -50, 90) },
];
let projectObjects = [];

export default function initThreeScene(onProjectClick) {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    let scene, camera, renderer, particles, lines, mouseX = 0, mouseY = 0;
    let isZoomed = false;

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
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        positions.push(x, y, z);
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
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (distance < maxDistance) {
                linePositions.push(particlePositions[i * 3], particlePositions[i * 3 + 1], particlePositions[i * 3 + 2]);
                linePositions.push(particlePositions[j * 3], particlePositions[j * 3 + 1], particlePositions[j * 3 + 2]);
            }
        }
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // --- Create Project Stars ---
    const labelsContainer = document.getElementById('project-labels');
    
    const colors = [
        0x4F46E5, 
        0xEC4899, 
        0xF59E0B, 
        0x14B8A6, 
        0x10B981 
    ];

    projectsData.forEach((proj, index) => {
        // --- Create the main group ---
        const projectGroup = new THREE.Group();
        projectGroup.position.copy(proj.position);
        projectGroup.name = proj.name;
        scene.add(projectGroup);

        // --- Create the outer shell (glitchy icosahedron) ---
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

        // --- Create the inner glowing core ---
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
            shell: shell,
            core: core,
            label: labelDiv,
            originalVertices: originalVertices, // Store for animation
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


    // --- Event Listeners & Raycasting ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    function onCanvasClick(event) {
        if (!isZoomed) return;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        
        const meshes = projectObjects.map(p => p.shell);
        const intersects = raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const clickedObjectName = intersects[0].object.name;
            if (onProjectClick) { onProjectClick(clickedObjectName); }
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

    document.addEventListener('mousemove', (e) => { mouseX = e.clientX - window.innerWidth / 2; mouseY = e.clientY - window.innerHeight / 2; }, false);
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

        projectObjects.forEach((p, index) => {
            p.group.rotation.x = time * 0.5;
            p.group.rotation.y = time * 0.3;

            // Pulsating core animation
            const pulse = (Math.sin(time * 5 + index) + 1) / 2;
            const scale = 1 + pulse * 0.15;
            p.core.scale.set(scale, scale, scale);


            // Glitchy vertex animation for the shell
            const positionAttribute = p.shell.geometry.attributes.position;
            const originalPositionAttribute = p.originalVertices;
            const vertex = new THREE.Vector3();
            const glitchAmount = 0.5; // Reduced for a more subtle effect

            for (let i = 0; i < positionAttribute.count; i++) {
                vertex.fromBufferAttribute(originalPositionAttribute, i);
                const noise = (Math.sin(i * 1.5 + glitchTime) + Math.cos(i * 2.5 + glitchTime)) * glitchAmount;
                vertex.addScalar(noise);
                positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
            }
            positionAttribute.needsUpdate = true;
            p.shell.geometry.computeVertexNormals();

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
            const time = Date.now() * 0.00005;
            particles.rotation.y = time * 0.4;
            lines.rotation.y = time * 0.4;
        }

        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    animate();

    return { transitionToProjects, resetView };
}