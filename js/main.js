import initModal from './modal.js?v=20261011-9';
import initProjectArchive from './project-folders.js?v=20261011-10';

const openModal = initModal();
initProjectArchive();
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
import './space-background.js?v=20261010-4';

import './referrals.js?v=20261011-18';
import './motion.js?v=20261010-4';

import './section-figures.js?v=20261011-12';

import './experience-terminal.js?v=20261011-18';
