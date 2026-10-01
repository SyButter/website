import initModal from './modal.js';

const openModal = initModal();
const menuButton = document.getElementById('mobile-menu-button');
const navigation = document.getElementById('main-nav');
const closeMenu = () => {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
};
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('is-open', expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
document.querySelectorAll('[data-project-name]').forEach(button => {
  button.addEventListener('click', () => openModal(button.dataset.projectName));
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-category]').forEach(project => {
      project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
    });
    const count = document.querySelectorAll('[data-category]:not([hidden])').length;
    document.getElementById('project-count').textContent = button.dataset.filter === 'all'
      ? `Showing all ${count} projects`
      : `Showing ${count} projects`;
  });
});

import './space-background.js';

import './referrals.js';
