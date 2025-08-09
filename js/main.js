import initThreeScene from "./three-scene.js";
import initModal from "./modal.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- Typing Effect ---
  const nameElement = document.getElementById("name-heading");
  if (nameElement) {
    const text = "Hi, I'm Syed Badrudduja";
    let i = 0;
    nameElement.innerHTML = "";
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        nameElement.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(typingInterval);
        document.querySelector(".typing-cursor")?.classList.add("typing-done");
      }
    }, 100);
  }

  // --- INITIALIZE MODULES ---
  const openModal = initModal();
  const threeSceneControls = initThreeScene(openModal);

  // --- STATE & ELEMENT SELECTORS ---
  const viewWorkButton = document.getElementById("view-work-button");
  const heroContent = document.querySelector("#home .relative.z-10");
  // --- DEVICE DETECTION ---
  const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // modal functionality
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const projectName = card.dataset.projectName;
      if (projectName) {
        openModal(projectName);
      }
    });
  });

  if (isMobile) {
    // --- MOBILE-ONLY LOGIC ---
    if (viewWorkButton) {
      viewWorkButton.addEventListener("click", (e) => {
        e.preventDefault();
        document
          .getElementById("projects")
          .scrollIntoView({ behavior: "smooth" });
      });
    }
  } else {
    // --- DESKTOP-ONLY LOGIC ---
    let isProjectViewActive = false;

    // 3d transition
    if (viewWorkButton) {
      viewWorkButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (isProjectViewActive) return;
        isProjectViewActive = true;
        gsap.to(heroContent, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => {
            heroContent.style.pointerEvents = "none";
          },
        });
        if (threeSceneControls) {
          threeSceneControls.transitionToProjects();
        }
      });
    }

    // --- RESET VIEW LOGIC ---
    const homeSection = document.getElementById("home");
    const homeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio > 0.5 &&
            isProjectViewActive
          ) {
            isProjectViewActive = false;
            if (threeSceneControls) {
              threeSceneControls.resetView();
            }
            gsap.to(heroContent, {
              opacity: 1,
              duration: 1.5,
              onStart: () => {
                heroContent.style.pointerEvents = "auto";
              },
            });
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (homeSection) {
      homeObserver.observe(homeSection);
    }
  }

  // --- MOBILE MENU LOGIC ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // --- NAV LINK SMOOTH SCROLL ---
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
        }
        const targetElement = document.querySelector(this.getAttribute("href"));
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    });
  });

  // --- CUSTOM CURSOR LOGIC ---
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");
  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
    }
    if (cursorOutline) {
      cursorOutline.animate(
        {
          left: `${posX}px`,
          top: `${posY}px`,
        },
        { duration: 500, fill: "forwards" }
      );
    }
  });

  const interactiveElements = document.querySelectorAll(
    "a, button, .project-card, .skill-badge"
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseover", () =>
      cursorOutline?.classList.add("hover")
    );
    el.addEventListener("mouseleave", () =>
      cursorOutline?.classList.remove("hover")
    );
  });

  // --- RESTORED ANIMATE ON SCROLL LOGIC ---
  const animateObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");
  elementsToAnimate.forEach((el) => animateObserver.observe(el));

  const swiper = new Swiper(".project-swiper", {
    loop: true,
    spaceBetween: 30, // Space between slides in px

    // How many slides to show at once
    slidesPerView: 1,

    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      // when window width is >= 1024px
      1024: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
    },

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});
