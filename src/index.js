import './js/play-ground.js';
import './js/code-highlight.js';
import MobileMenu from './js/mobile-menu.js';

new MobileMenu('#mobile-menu');

(function setRandomGradientAngle() {
  const [rangeBeginning, rangeEnd] = [30,144]
  const gradientAngle = Math.floor(Math.random() * (rangeEnd - rangeBeginning) + rangeBeginning);

  const root = document.documentElement;
  root.style.setProperty('--gradient-angle', gradientAngle + 'deg');
})();

