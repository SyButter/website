import initModal from "./modal.js";

document.addEventListener("DOMContentLoaded", async () => {
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

  // Elements already in the viewport (e.g. the hero) are shown immediately so
  // they never flash hidden. Only off-screen elements get hidden, to be
  // revealed on scroll by the observer below.
  // (fallback: if JS never runs, extra.css keeps everything visible by default)
  const vh = window.innerHeight || document.documentElement.clientHeight;
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      el.classList.add("is-visible");
    } else {
      el.classList.add("js-hidden");
    }
  });

  // Reveal fallback — registered immediately so a later error can't prevent it
  setTimeout(() => {
    document.querySelectorAll(".animate-on-scroll.js-hidden").forEach((el) => {
      el.classList.remove("js-hidden");
      el.classList.add("is-visible");
    });
  }, 1500);

  // init modal (no external deps — always safe)
  const openModal = initModal();

  // Load Three.js scene asynchronously — does NOT block the rest of the page
  let threeSceneControls = null;
  import("./three-scene.js").then(({ default: initThreeScene }) => {
    threeSceneControls = initThreeScene(openModal);
  }).catch((e) => console.warn("3D scene unavailable:", e));

  const viewWorkButton = document.getElementById("view-work-button");
  const heroContent = document.querySelector("#home .relative.z-10");
  // device detection
  const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // modal functionality (works on both flip card wrapper and legacy .project-card)
  const projectCards = document.querySelectorAll(".project-card-wrapper, .project-card");
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
    // Replace hover-centric hint text with tap-friendly wording
    document.querySelectorAll(".project-card-front .text-indigo-400.font-semibold").forEach(el => {
      el.innerHTML = "Tap to open &rarr;";
    });
  } else {
    // desktop logic
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

    // scroll parallax + hide orbs when hero scrolls out of view
    window.addEventListener('scroll', () => {
      if (threeSceneControls && isProjectViewActive) {
        // If the hero section has scrolled completely off the top, hide the orbs
        const heroBottom = homeSection.getBoundingClientRect().bottom;
        if (heroBottom <= 0) {
          isProjectViewActive = false;
          threeSceneControls.resetView();
          gsap.to(heroContent, {
            opacity: 1,
            duration: 0.5,
            onStart: () => { heroContent.style.pointerEvents = "auto"; },
          });
        }
      }
      if (threeSceneControls && !isProjectViewActive) {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
        threeSceneControls.updateScrollParallax(progress);
      }
    }, { passive: true });
  }

  // mobile menu
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    const expanded = !mobileMenu.classList.contains("hidden");
    mobileMenuButton.setAttribute("aria-expanded", String(expanded));
  });

  // --- Referrals Carousel ---
  const referralsData = [
    {
      quote: "Syed's strong technical abilities in Cypress automation and troubleshooting Jenkins pipelines were impressive. His proactive attitude and commitment to quality were evident in every project, making him a valuable asset to our team.",
      author: "Vernon McLaurin Jr",
      title: "Test Automation Engineer, Billtrust",
      url: "https://www.linkedin.com/in/sbadrudduja/details/recommendations/"
    },
    {
      quote: "From the very beginning, Syed impressed me with his technical skills and eagerness to learn. He consistently delivered high-quality work, often taking the initiative and approaching every task with a strong sense of responsibility. He would be a valuable addition to any team.",
      author: "Joe Dinicola",
      title: "High-Performing QA Automation Leader",
      url: "https://www.linkedin.com/in/sbadrudduja/details/recommendations/"
    },
    {
      quote: "Syed stands out as an exceptional engineering talent. He made a tremendous impact by automating our test cases with Cypress, reducing our regression cycle from 2 weeks to just 2 hours and bringing measurable cost savings to our QA operations.",
      author: "George Kuriakose",
      title: "Senior Director, Engineering @ Billtrust",
      url: "https://www.linkedin.com/in/sbadrudduja/details/recommendations/"
    },
    {
      quote: "Syed showed strong technical skills from day one, jumping into a variety of projects across different languages. He's a great team member—curious, reliable, and always thorough in his work, seeing projects through to the finish line.",
      author: "Patrick McDonough",
      title: "Software Engineer",
      url: "https://www.linkedin.com/in/sbadrudduja/details/recommendations/"
    },
    {
      quote: "Syed's ability to quickly absorb new concepts and apply them effectively stood out immediately. He's a great collaborator who approaches challenges with a positive, solutions-oriented mindset. Any team would be lucky to have someone with his drive, curiosity, and professionalism.",
      author: "Alex Erazo",
      title: "QA Test Automation Lead",
      url: "https://www.linkedin.com/in/sbadrudduja/details/recommendations/"
    },
  ];

  const carouselContainer = document.getElementById('referral-carousel');
  if (carouselContainer) {
    let currentReferralIndex = 0;
    let carouselInterval;

    // Populate the carousel with referral data
    referralsData.forEach((ref, index) => {
      const referralEl = document.createElement('div');
      referralEl.className = 'referral-item absolute inset-0 flex items-center justify-center p-4';
      if (index === 0) referralEl.classList.add('is-active');
      referralEl.innerHTML = `
        <div class="text-center">
          <blockquote class="text-xl md:text-2xl text-gray-300 italic">"${ref.quote}"</blockquote>
          <cite class="block not-italic mt-6">
            <span class="font-bold text-white text-lg">${ref.author}</span>
            <span class="block text-indigo-300 text-sm">${ref.title}</span>
          </cite>
          <div class="mt-8">
            <a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="bg-gray-700 text-white font-bold py-2 px-5 rounded-full hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 inline-block">
              View Referral
            </a>
          </div>
        </div>
      `;
      carouselContainer.appendChild(referralEl);
    });

    const referralItems = carouselContainer.querySelectorAll('.referral-item');
    let maxHeight = 0;

    if (referralItems.length > 0) {
      referralItems.forEach(item => {
        const content = item.querySelector('.text-center');
        if (content && content.scrollHeight > maxHeight) maxHeight = content.scrollHeight;
      });
      if (maxHeight > 0) carouselContainer.style.height = `${maxHeight + 40}px`;
    }

    // Navigation dots
    const dotsWrapper = document.createElement('div');
    dotsWrapper.className = 'flex justify-center gap-3 mt-8';
    dotsWrapper.setAttribute('role', 'tablist');
    dotsWrapper.setAttribute('aria-label', 'Referral navigation');
    const dots = [];
    referralsData.forEach((ref, i) => {
      const dot = document.createElement('button');
      dot.className = `referral-dot w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-indigo-400 scale-125' : 'bg-gray-600 hover:bg-gray-400'}`;
      dot.setAttribute('aria-label', `View referral from ${ref.author}`);
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goToReferral(i));
      dots.push(dot);
      dotsWrapper.appendChild(dot);
    });
    carouselContainer.parentElement.appendChild(dotsWrapper);

    function updateDots() {
      dots.forEach((dot, i) => {
        const active = i === currentReferralIndex;
        dot.className = `referral-dot w-2 h-2 rounded-full transition-all duration-300 ${active ? 'bg-indigo-400 scale-125' : 'bg-gray-600 hover:bg-gray-400'}`;
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    function goToReferral(index) {
      referralItems[currentReferralIndex].classList.remove('is-active');
      currentReferralIndex = index;
      referralItems[currentReferralIndex].classList.add('is-active');
      updateDots();
    }

    function startCarousel() {
      carouselInterval = setInterval(() => {
        goToReferral((currentReferralIndex + 1) % referralItems.length);
      }, 7000);
    }

    if (referralItems.length > 1) {
      // Pause on hover / focus so users can read at their own pace
      carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
      carouselContainer.addEventListener('mouseleave', startCarousel);
      carouselContainer.addEventListener('focusin', () => clearInterval(carouselInterval));
      carouselContainer.addEventListener('focusout', startCarousel);
      startCarousel();
    }
  }


  // smooth scroll
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

  // custom cursor
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
      cursorOutline.style.left = `${posX}px`;
      cursorOutline.style.top = `${posY}px`;
    }
  });

  const interactiveElements = document.querySelectorAll(
    "a, button, .project-card-wrapper, .project-card, .skill-tag-3d"
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseover", () =>
      cursorOutline?.classList.add("hover")
    );
    el.addEventListener("mouseleave", () =>
      cursorOutline?.classList.remove("hover")
    );
  });

  const animateObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("js-hidden");
          entry.target.classList.add("is-visible");
          animateObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");
  elementsToAnimate.forEach((el) => animateObserver.observe(el));

  // Reveal in-viewport elements immediately after layout
  function revealInViewport() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (!vh) return;
    document.querySelectorAll(".animate-on-scroll.js-hidden").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        el.classList.remove("js-hidden");
        el.classList.add("is-visible");
        animateObserver.unobserve(el);
      }
    });
  }
  requestAnimationFrame(revealInViewport);
  window.addEventListener('load', revealInViewport, { once: true });

  // Hard fallback: reveal everything still hidden after 1s (catches broken
  // IntersectionObserver environments like headless browsers)
  setTimeout(() => {
    document.querySelectorAll(".animate-on-scroll.js-hidden").forEach((el) => {
      el.classList.remove("js-hidden");
      el.classList.add("is-visible");
    });
  }, 1000);

  // swiper
  const swiper = new Swiper(".project-swiper", {
    loop: true,
    spaceBetween: 30,
    slidesPerView: 1,
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
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