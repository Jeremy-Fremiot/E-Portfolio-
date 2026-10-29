/**
 * Éditorial Suisse Modernisé — Portfolio Jérémy Frémiot
 * Script: js/main.js
 * Subtle editorial interactions, accessible navigation, and scroll observation
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. Sticky Header State & Scroll Position
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.site-header');
  const handleScrollHeader = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  /* ------------------------------------------------------------------------
     2. Mobile Navigation Toggle & Accessibility
     ------------------------------------------------------------------------ */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    const toggleNav = (forceState) => {
      const isExpanded = forceState !== undefined 
        ? !forceState 
        : navToggle.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;

      navToggle.setAttribute('aria-expanded', String(newState));
      if (newState) {
        navLinks.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      } else {
        navLinks.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    };

    navToggle.addEventListener('click', () => toggleNav());

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('is-open')) {
          toggleNav(false);
        }
      });
    });

    // Close menu when pressing Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
        toggleNav(false);
        navToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Scroll Reveal Animations (IntersectionObserver)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  if (isReducedMotion || !('IntersectionObserver' in window)) {
    // Reveal everything immediately if user prefers reduced motion or no support
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------------
     4. Active Navigation Link Highlighting on Scroll
     ------------------------------------------------------------------------ */
  const navItems = document.querySelectorAll('.nav-link[href^="#"]');
  const observedSections = [];

  navItems.forEach((link) => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.length > 1) {
      const section = document.querySelector(targetId);
      if (section) {
        observedSections.push({ section, link });
      }
    }
  });

  if (observedSections.length > 0 && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = `#${entry.target.id}`;
            navItems.forEach((link) => {
              if (link.getAttribute('href') === currentId) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0,
      }
    );

    observedSections.forEach(({ section }) => navObserver.observe(section));
  }

  /* ------------------------------------------------------------------------
     5. Back to Top Smooth Scroll
     ------------------------------------------------------------------------ */
  const backToTopLinks = document.querySelectorAll('a[href="#hero"], a[href="#top"]');
  backToTopLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: isReducedMotion ? 'auto' : 'smooth',
      });
    });
  });
});
