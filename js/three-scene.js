import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

// Data for our project
const projectsData = [
    { name: 'openGBW', position: new THREE.Vector3(-250, 50, 150) },
    { name: 'RasPi Adhan', position: new THREE.Vector3(250, -100, 120) },
    { name: 'AVAT', position: new THREE.Vector3(0, 150, 100) },
    { name: 'FIT', position: new THREE.Vector3(300, 50, 80) },
    { name: 'Enrollment App', position: new THREE.Vector3(-300, -50, 90) },
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
    projectsData.forEach(proj => {
        const starGeometry = new THREE.CircleGeometry(50, 3);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthTest: false });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.copy(proj.position);
        star.renderOrder = 1;
        star.name = proj.name;
        scene.add(star);
        projectObjects.push(star);
    });

    // --- Animation & Control Functions ---
    function transitionToProjects() {
        if (isZoomed) return;
        isZoomed = true;
        const aspect = window.innerWidth / window.innerHeight;
        const targetZ = aspect > 1.2 ? 700 : 900;
        gsap.to(camera.position, { z: targetZ, duration: 2.5, ease: "power3.inOut" });
        gsap.to([particles.material, lines.material], { opacity: 0.15, duration: 2, ease: "power2.out" });

        projectObjects.forEach(star => {
            gsap.to(star.material, { opacity: 0.6, duration: 2, delay: 1, ease: "power2.inOut" });
        });
    }

    // Reverses the animations to return to the home screen state.
    function resetView() {
        if (!isZoomed) return;
        isZoomed = false;
        gsap.to(camera.position, { z: 1000, duration: 2.5, ease: "power3.inOut" });
        gsap.to(particles.material, { opacity: 1.0, duration: 2, ease: "power2.out" });
        gsap.to(lines.material, { opacity: 0.05, duration: 2, ease: "power2.out" });

        projectObjects.forEach(star => {
            gsap.to(star.material, { opacity: 0, duration: 1.5, ease: "power2.inOut" });
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
        const intersects = raycaster.intersectObjects(projectObjects);
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
        projectObjects.forEach(star => {
            star.lookAt(camera.position);
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