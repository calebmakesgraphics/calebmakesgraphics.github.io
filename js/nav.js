/* ================================================================
   js/nav.js — Shared navigation behaviour
   Loaded by every page. Handles:
     • Active link highlighting based on current filename
     • Hamburger toggle for the mobile menu
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     1. ACTIVE LINK HIGHLIGHTING
     Reads the current page's filename from window.location.pathname
     and adds the .active class to the matching <a> in the nav.
  ------------------------------------------------------------------ */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile) {
      link.classList.add('active');
    }
  });

  /* ------------------------------------------------------------------
     2. HAMBURGER MENU TOGGLE
     Toggles .open on both the button and the mobile-menu panel.
     Closes automatically when a nav link is tapped.
  ------------------------------------------------------------------ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
    });

    // Close the menu when any link inside it is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

});
