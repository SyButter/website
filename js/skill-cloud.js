const SKILLS = [
    'JavaScript', 'Python', 'C#', 'Java', 'SQL',
    'Cypress', 'Selenium', 'Playwright', 'Jenkins', 'Docker', 'Git', 'AWS',
    'Prophet', 'OpenAI', 'Pandas', 'NumPy', 'scikit-learn', 'PyTorch', 'n8n'
];

export default function initSkillCloud(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const RADIUS = 130;
    const tags = [];
    const n = SKILLS.length;

    // Distribute tags evenly on a sphere using Fibonacci spiral
    SKILLS.forEach((skill, i) => {
        const phi = Math.acos(1 - 2 * (i + 0.5) / n);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        const ox = Math.cos(theta) * Math.sin(phi) * RADIUS;
        const oy = Math.sin(theta) * Math.sin(phi) * RADIUS;
        const oz = Math.cos(phi) * RADIUS;

        const tag = document.createElement('span');
        tag.className = 'skill-tag-3d';
        tag.textContent = skill;
        container.appendChild(tag);

        tags.push({ el: tag, ox, oy, oz });
    });

    let rotX = 0;
    let rotY = 0;
    let velX = 0;
    let velY = 0.004;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    // Mouse drag
    container.addEventListener('mousedown', e => {
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        velX = 0;
        velY = 0;
        container.style.cursor = 'grabbing';
        e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        velY = (e.clientX - lastX) * 0.007;
        velX = (e.clientY - lastY) * 0.007;
        lastX = e.clientX;
        lastY = e.clientY;
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    // Touch drag
    container.addEventListener('touchstart', e => {
        isDragging = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        velX = 0;
        velY = 0;
    }, { passive: true });
    container.addEventListener('touchmove', e => {
        if (!isDragging) return;
        velY = (e.touches[0].clientX - lastX) * 0.007;
        velX = (e.touches[0].clientY - lastY) * 0.007;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    }, { passive: true });
    container.addEventListener('touchend', () => { isDragging = false; });

    function tick() {
        if (!isDragging) {
            // Decay drag velocity, gently nudge back toward auto-rotation
            velX *= 0.92;
            velY += (0.004 - velY) * 0.015;
        }

        rotX += velX;
        rotY += velY;

        const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
        const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

        tags.forEach(tag => {
            // Rotate around Y axis
            const x1 = tag.ox * cosY - tag.oz * sinY;
            const z1 = tag.ox * sinY + tag.oz * cosY;
            // Rotate around X axis
            const y2 = tag.oy * cosX - z1 * sinX;
            const z2 = tag.oy * sinX + z1 * cosX;

            // Map z depth to scale and opacity for 3D illusion
            const depth = (z2 + RADIUS) / (2 * RADIUS); // 0 (back) to 1 (front)
            const scale = 0.55 + depth * 0.9;
            const opacity = 0.2 + depth * 0.8;

            tag.el.style.transform = `translate(calc(-50% + ${x1}px), calc(-50% + ${y2}px)) scale(${scale.toFixed(3)})`;
            tag.el.style.opacity = opacity.toFixed(3);
            tag.el.style.zIndex = Math.round(depth * 20);
            // Deeper tags get muted color, front tags get indigo
            tag.el.style.color = depth > 0.55 ? '#A5B4FC' : '#4B5563';
        });

        requestAnimationFrame(tick);
    }

    tick();
}
