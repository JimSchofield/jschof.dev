import './js/menu-popover/menu-popover.js';

(function setRandomGradientAngle() {
  const [rangeBeginning, rangeEnd] = [30,144]
  const gradientAngle = Math.floor(Math.random() * (rangeEnd - rangeBeginning) + rangeBeginning);

  const root = document.documentElement;
  root.style.setProperty('--gradient-angle', gradientAngle + 'deg');

  gradientLoop(gradientAngle);
})();

// Feelin cute, might delete later
function gradientLoop(gradientAngle) {
  gradientAngle += .05;


  const root = document.documentElement;
  root.style.setProperty('--gradient-angle', gradientAngle + 'deg');

  requestAnimationFrame(() => {
    gradientLoop(gradientAngle);
  })
}
