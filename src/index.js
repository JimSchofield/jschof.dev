import './js/menu-popover/menu-popover.js';

(function setRandomGradientAngle() {
  const [rangeBeginning, rangeEnd] = [30,144]
  const grandientAngle = Math.floor(Math.random() * (rangeEnd - rangeBeginning) + rangeBeginning);

  const root = document.documentElement;
  root.style.setProperty('--gradient-angle', grandientAngle + 'deg');
})();
