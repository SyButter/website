import { unzoom, isZoomed, focusOnProjects } from './three-scene.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- Typing Effect ---
    const text = "Hi, I'm Syed Badrudduja";
    const headingElement = document.getElementById('typing-heading');
    if (headingElement) {
        let i = 0;
        headingElement.innerHTML = "";
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                headingElement.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                headingElement.classList.add('typing-done');
            }
        }, 100);
    }

    // --- Mobile Menu ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // --- Navigation Link Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const isProjectNavLink = link.id.includes('nav-projects');
            const isViewWorkButton = link.id.includes('view-work-button');

            const scrollToTarget = () => {
                if (targetId && targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            };

            // FIXED: Added specific logic for the "View My Work" button
            if (isViewWorkButton) {
                focusOnProjects();
            } else if (isProjectNavLink) {
                if (isZoomed()) unzoom();
            } else {
                unzoom().then(scrollToTarget);
            }

            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 500, fill: 'forwards' });
    });
    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });

    // --- Animate on Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});