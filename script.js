/* ============================================================
   DOGUE COMMUNITY HUB — Main Script
   Navbar scroll behavior, mobile menu, smooth interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Elements ---
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');
  const heroVideo = document.getElementById('hero-video');

  // --- Navbar Scroll Effect ---
  let lastScroll = 0;
  let ticking = false;

  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // --- Mobile Menu Toggle ---
  function toggleMobileMenu() {
    const isActive = hamburger.classList.contains('active');

    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');

    hamburger.setAttribute('aria-expanded', !isActive);
    mobileNav.setAttribute('aria-hidden', isActive);

    // Prevent body scroll when menu is open
    document.body.style.overflow = !isActive ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      toggleMobileMenu();
    }
  });

  // --- Video Poster Fallback ---
  // If no video source, show poster image as background
  if (heroVideo && heroVideo.querySelectorAll('source').length === 0) {
    const poster = heroVideo.getAttribute('poster');
    if (poster) {
      heroVideo.style.display = 'none';
      const wrapper = heroVideo.parentElement;

      const img = document.createElement('img');
      img.src = poster;
      img.alt = 'DOGUE Community Hub — Elegancia canina';
      img.className = 'hero__poster';
      img.loading = 'eager';
      wrapper.appendChild(img);
    }
  }

  // --- Parallax subtle effect on hero content ---
  const heroContent = document.querySelector('.hero__content');

  if (heroContent && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;

      if (scrollY < heroHeight) {
        const progress = scrollY / heroHeight;
        heroContent.style.transform = `translateY(${progress * 40}px)`;
        heroContent.style.opacity = 1 - progress * 0.6;
      }
    }, { passive: true });
  }

  // --- Subtle mouse-move parallax on poster/video ---
  const heroSection = document.querySelector('.hero');
  const videoWrapper = document.querySelector('.hero__video-wrapper');

  if (heroSection && videoWrapper && window.matchMedia('(min-width: 1024px)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      requestAnimationFrame(() => {
        videoWrapper.style.transform = `scale(1.03) translate(${x * -8}px, ${y * -8}px)`;
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      videoWrapper.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      videoWrapper.style.transform = 'scale(1.03) translate(0, 0)';
      setTimeout(() => {
        videoWrapper.style.transition = '';
      }, 800);
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Intersection Observer for Scroll Animations ---
  const fadeElements = document.querySelectorAll('.fade-in-element');
  
  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Optional: stop observing once animated
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    });

    fadeElements.forEach(el => {
      fadeObserver.observe(el);
    });
  }

  // --- Initial state ---
  handleScroll();
});
