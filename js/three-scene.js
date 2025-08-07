import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';

// --- State Variables ---
let _isZoomed = false; // Is the camera zoomed into a specific project?
let _isFocused = false; // Is the camera in the project-browsing view?

// --- Exportable Functions ---
export function isZoomed() {
    return _isZoomed;
}

// FIXED: New function to move camera closer to projects
export function focusOnProjects() {
    if (_isFocused) return;
    _isFocused = true;
    document.body.classList.add('zoomed-in'); // This class hides the hero text

    return gsap.to(camera.position, {
        duration: 1.5,
        z: 750, // Move camera closer
        ease: 'power3.inOut',
    });
}

export function unzoom() {
    return new Promise((resolve) => {
        if (!_isZoomed && !_isFocused) {
            resolve();
            return;
        }
        overlay.classList.remove('visible');
        gsap.to(camera.position, {
            duration: 1.5,
            x: 0,
            y: 0,
            z: 1000,
            ease: 'power3.inOut',
            onComplete: () => {
                _isZoomed = false;
                _isFocused = false;
                document.body.classList.remove('zoomed-in');
                resolve();
            }
        });
    });
}

// --- Project Data ---
const projects = [
    {
        title: 'openGBW - Open-Source Game Boy',
        description: 'An open-source, modernized take on Nintendo\'s classic Game Boy, built with a custom PCB powered by the Raspberry Pi Compute Module 4.',
        image: 'https://images.unsplash.com/photo-1593181423363-aa2d9359e27c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        link: 'https://github.com/SyButter/openGBW',
        position: new THREE.Vector3(-200, 50, 700)
    },
    {
        title: 'Raspberry Pi Adhan Player',
        description: 'A Raspberry Pi-powered system that automatically plays the Adhan by fetching daily prayer times from an API using a Python script.',
        image: 'https://images.unsplash.com/photo-1617855322567-1f274a58b877?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        link: 'https://github.com/SyButter/rasppi-adhan',
        position: new THREE.Vector3(250, -100, 600)
    },
    {
        title: 'Enrollment Forecasting App',
        description: 'A full-stack web app to forecast student enrollment data for public schools using Python (Flask, Prophet) and Chart.js for dynamic, interactive visualizations.',
        image: 'https://storage.googleapis.com/astromoflow-public-images/enrollment-forecast-demo.gif',
        link: null,
        position: new THREE.Vector3(0, 150, 500)
    },
     {
        title: 'Automated Vulnerability Assessment Tool',
        description: 'A Python-driven security scanner that orchestrates Nmap and OpenVAS to perform nightly vulnerability checks and send real-time Slack alerts.',
        image: 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        link: 'https://github.com/SyButter',
        position: new THREE.Vector3(300, 100, 300)
    },
];

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000);
camera.position.z = 1000;
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

// --- Stars and Project Objects ---
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 5000;
const posArray = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 2000;
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(posArray, 3));
const starsMaterial = new THREE.PointsMaterial({ size: 1, color: 0x818CF8 });
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

const projectObjects = [];
const projectTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png');
projects.forEach(project => {
    const projectMaterial = new THREE.PointsMaterial({
        size: 30,
        map: projectTexture,
        color: 0xFFD700,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });
    const projectGeometry = new THREE.BufferGeometry();
    projectGeometry.setAttribute('position', new THREE.Float32BufferAttribute(project.position.toArray(), 3));
    const projectPoint = new THREE.Points(projectGeometry, projectMaterial);
    projectPoint.userData = project;
    projectObjects.push(projectPoint);
    scene.add(projectPoint);
});

// --- Interactivity & Overlay ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentIntersect = null;
const overlay = document.getElementById('project-overlay');
const titleEl = document.getElementById('project-title');
const descEl = document.getElementById('project-description');
const imageEl = document.getElementById('project-image');
const linkContainerEl = document.getElementById('project-link-container');

function zoomToProject(project) {
    if (_isZoomed) return;
    _isZoomed = true;
    _isFocused = true; // Zooming also implies focusing
    document.body.classList.add('zoomed-in');
    gsap.to(camera.position, {
        duration: 1.5,
        x: project.position.x,
        y: project.position.y,
        z: project.position.z - 150,
        ease: 'power3.inOut',
        onComplete: () => {
            titleEl.textContent = project.title;
            descEl.textContent = project.description;
            imageEl.src = project.image;
            linkContainerEl.innerHTML = '';
            if (project.link) {
                const linkEl = document.createElement('a');
                linkEl.href = project.link;
                linkEl.target = '_blank';
                linkEl.className = 'nav-link text-indigo-400 hover:text-indigo-300 font-semibold';
                linkEl.innerHTML = 'View on GitHub &rarr;';
                linkContainerEl.appendChild(linkEl);
            } else {
                const privateEl = document.createElement('span');
                privateEl.className = 'text-gray-500 font-semibold';
                privateEl.textContent = 'Private Repository';
                linkContainerEl.appendChild(privateEl);
            }
            overlay.classList.add('visible');
        }
    });
}

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
    if (currentIntersect && !_isZoomed) {
        zoomToProject(currentIntersect.userData);
    } else if (_isZoomed) {
        unzoom();
    }
});

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(projectObjects);
    if (intersects.length > 0 && !_isZoomed) {
        currentIntersect = intersects[0].object;
        gsap.to(currentIntersect.material, { size: 45, duration: 0.3 });
        document.body.style.cursor = 'pointer';
    } else {
        if (currentIntersect) {
            gsap.to(currentIntersect.material, { size: 30, duration: 0.3 });
        }
        currentIntersect = null;
        document.body.style.cursor = 'default';
    }
    stars.rotation.y += 0.0001;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});