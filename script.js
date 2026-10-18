// Page behaviour for the portfolio site (plain JavaScript, no libraries needed).

const navbar = document.querySelector('.navbar');
const scrollUpBtn = document.querySelector('.scroll-up-btn');
const menu = document.querySelector('.navbar .menu');
const menuBtn = document.querySelector('.menu-btn');
const menuIcon = document.querySelector('.menu-btn i');

// Slightly smaller navbar and a back-to-top button once the page is scrolled
window.addEventListener('scroll', function () {
  if (navbar) navbar.classList.toggle('sticky', window.scrollY > 20);
  if (scrollUpBtn) scrollUpBtn.classList.toggle('show', window.scrollY > 500);
});

if (scrollUpBtn) {
  scrollUpBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Mobile menu
function setMenu(open) {
  if (menu) menu.classList.toggle('active', open);
  if (menuIcon) menuIcon.classList.toggle('active', open);
}

if (menuBtn) {
  menuBtn.addEventListener('click', function () {
    setMenu(!menu.classList.contains('active'));
  });
}

// Close the mobile menu after choosing a section
document.querySelectorAll('.menu-link').forEach(function (link) {
  link.addEventListener('click', function () {
    setMenu(false);
  });
});
