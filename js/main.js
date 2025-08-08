import initThreeScene from './three-scene.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- Typing Effect ---
    const nameElement = document.getElementById('name-heading');
    if (nameElement) {
        const text = "Hi, I'm Syed Badrudduja";
        let i = 0;
        nameElement.innerHTML = ""; // Clear existing text
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                nameElement.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                // Optionally add a class when done to remove the cursor
                document.querySelector('.typing-cursor')?.classList.add('typing-done');
            }
        }, 100); // Adjust typing speed (milliseconds)
    }

    // --- Handle Project Selection from 3D Scene ---
    function onProjectSelect(projectName) {
        console.log(`Project selected: ${projectName}`);
        const projectCard = document.querySelector(`.project-card[data-project-name="${projectName}"]`);
        if (projectCard) {
            projectCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a temporary highlight effect
            projectCard.style.transition = 'box-shadow 0.5s ease-in-out';
            projectCard.style.boxShadow = '0 0 35px rgba(165, 180, 252, 0.7)';
            setTimeout(() => {
                projectCard.style.boxShadow = '';
            }, 2000);
        }
    }

    // Initialize the 3D hero scene
    const threeSceneControls = initThreeScene(onProjectSelect);

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Smooth scroll for all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // --- "View My Work" Button Logic ---
    const viewWorkButton = document.getElementById('view-work-button');
    const heroContent = document.querySelector('#home .relative.z-10');
    const projectsSection = document.getElementById('projects');

    if (viewWorkButton) {
        viewWorkButton.addEventListener('click', (e) => {
            e.preventDefault();

            // 1. Fade out the hero text and button
            gsap.to(heroContent, { 
                opacity: 0, 
                duration: 1, 
                ease: "power2.inOut",
                onComplete: () => {
                    heroContent.style.pointerEvents = 'none';
                }
            });

            // 2. Trigger the 3D zoom animation
            if (threeSceneControls) {
                threeSceneControls.transitionToProjects();
            }
            
            // 3. Fade in the projects section after the zoom starts
            gsap.to(projectsSection, {
                opacity: 1,
                duration: 1.5,
                delay: 2, // Delay to sync with the end of the camera zoom
                ease: "power2.inOut"
            });
        });
    }

    // Custom cursor logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        if (cursorDot) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
        }
        if (cursorOutline) {
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: 'forwards' });
        }
    });

    // Add hover effect to cursor for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-badge');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => cursorOutline?.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline?.classList.remove('hover'));
    });

    // Animate on scroll logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));
});
