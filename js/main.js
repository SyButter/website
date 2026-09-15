import initModal from "./modal.js";

document.addEventListener("DOMContentLoaded", async () => {
  // --- Typing Effect ---
  const nameElement = document.getElementById("name-heading");
  if (nameElement) {
    const text = "Hi, I'm Syed Badr";
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

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Lenis smooth scroll + GSAP ScrollTrigger wiring ---
  // Lenis gives the whole page buttery momentum scrolling; we drive it from
  // GSAP's ticker and forward its scroll events to ScrollTrigger so any
  // scroll-driven animation stays perfectly in sync. Disabled entirely under
  // reduced-motion so we never fight the user's accessibility preference.
  let lenis = null;
  const hasScrollTrigger = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  if (hasScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  if (!prefersReducedMotion && typeof window.Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    if (hasScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  // Smooth in-page navigation helper — routes through Lenis when available,
  // falls back to native smooth scroll otherwise.
  const smoothScrollTo = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.2 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

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

  // Projects section: cards "deal in" with a 3D rotate once the section is
  // actually scrolled to, rather than all popping in at once with the section.
  // Skipped if the section is already on-screen (nothing to reveal) or the
  // user prefers reduced motion.
  const projectsSection = document.getElementById("projects");
  if (projectsSection && !prefersReducedMotion) {
    const projectsRect = projectsSection.getBoundingClientRect();
    if (!(projectsRect.top < vh && projectsRect.bottom > 0)) {
      document.querySelectorAll("#projects .project-card-wrapper").forEach((card, i) => {
        card.style.setProperty("--delay", `${i * 0.07}s`);
        card.classList.add("card-pending");
      });
    }
  }

  function revealPendingProjectCards() {
    document.querySelectorAll(".project-card-wrapper.card-pending").forEach((card) => {
      card.classList.remove("card-pending");
      card.classList.add("card-visible");
    });
  }

  // Reveal fallback — registered immediately so a later error can't prevent it
  setTimeout(() => {
    document.querySelectorAll(".animate-on-scroll.js-hidden").forEach((el) => {
      el.classList.remove("js-hidden");
      el.classList.add("is-visible");
    });
    revealPendingProjectCards();
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
        smoothScrollTo(document.getElementById("projects"));
      });
    }
    // Replace hover-centric hint text with tap-friendly wording
    document.querySelectorAll(".project-card-front .link-accent.font-semibold").forEach(el => {
      el.innerHTML = "Tap to open &rarr;";
    });
  } else {
    // desktop logic
    let isProjectViewActive = false;

    // --- subtle cursor-tracked 3D tilt on the hero content itself ---
    if (!prefersReducedMotion && heroContent) {
      const HERO_TILT_MAX_DEG = 4;
      window.addEventListener("mousemove", (e) => {
        if (isProjectViewActive) return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        heroContent.style.setProperty("--heroTiltY", `${nx * HERO_TILT_MAX_DEG * 2}deg`);
        heroContent.style.setProperty("--heroTiltX", `${-ny * HERO_TILT_MAX_DEG * 2}deg`);
      });
    }

    // --- 3D tilt on project cards, tracks cursor position over each card ---
    if (!prefersReducedMotion) {
      const TILT_MAX_DEG = 8;
      projectCards.forEach((card) => {
        const inner = card.querySelector(".project-card-inner");
        if (!inner) return;
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          inner.style.setProperty("--tiltY", `${(x - 0.5) * TILT_MAX_DEG * 2}deg`);
          inner.style.setProperty("--tiltX", `${(0.5 - y) * TILT_MAX_DEG * 2}deg`);
        });
        card.addEventListener("mouseleave", () => {
          inner.style.setProperty("--tiltX", "0deg");
          inner.style.setProperty("--tiltY", "0deg");
        });
      });
    }

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
      quote: "Syed showed strong technical skills from day one, jumping into a variety of projects across different languages. He's a great team member: curious, reliable, and always thorough in his work, seeing projects through to the finish line.",
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
            <span class="block text-muted-warm text-sm">${ref.title}</span>
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
      dot.className = `referral-dot w-2 h-2 rounded-full transition-all duration-300 ${i === 0 ? 'bg-[var(--accent)] scale-125' : 'bg-gray-600 hover:bg-gray-400'}`;
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
        dot.className = `referral-dot w-2 h-2 rounded-full transition-all duration-300 ${active ? 'bg-[var(--accent)] scale-125' : 'bg-gray-600 hover:bg-gray-400'}`;
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
          smoothScrollTo(targetElement);
        }
      }
    });
  });

  const animateObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("js-hidden");
          entry.target.classList.add("is-visible");
          animateObserver.unobserve(entry.target);
          revealPendingProjectCards();
        }
      });
    },
    {
      // Fires once ~30% of the section is on-screen (not just a 10% sliver at
      // the bottom edge), so the depth/swivel transition actually plays out
      // where the user is looking, not off past the fold.
      threshold: 0.3,
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
        revealPendingProjectCards();
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
    revealPendingProjectCards();
  }, 1000);

  // --- ScrollTrigger depth flourishes (additive to the reveal system) ---
  // Section titles drift slightly slower than the page and the hero content
  // sinks away as you scroll past it, giving a parallax sense of depth without
  // touching the existing animate-on-scroll reveals.
  if (hasScrollTrigger && !prefersReducedMotion) {
    document.querySelectorAll(".section-title").forEach((title) => {
      gsap.fromTo(
        title,
        { y: 40 },
        {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: title,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    // Skill badges cascade in as the About section arrives
    gsap.from("#about .skill-badge", {
      opacity: 0,
      y: 18,
      duration: 0.5,
      stagger: 0.03,
      ease: "power2.out",
      scrollTrigger: { trigger: "#about .skill-group", start: "top 75%" },
    });

    // Keep ScrollTrigger measurements correct once everything has loaded
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

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