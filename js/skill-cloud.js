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

    function tick() {
        // Gently drift back toward default rotation speed
        velX *= 0.94;
        velY += (0.004 - velY) * 0.015;

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
