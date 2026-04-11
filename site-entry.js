import '@jschofield/play-ground';
import '@jschofield/code-highlight';
import '@jschofield/quick-search';
import '@jschofield/reading-list';
import '@jschofield/repl-playground';
import '@jschofield/scroll-explain';
import { initLinkPreviews } from '@jschofield/link-preview';
import 'baseline-status';
import './src/js/heading-links.js';
import './src/js/theme-toggle.js';
import MobileMenu from './src/js/mobile-menu.js';

new MobileMenu('#mobile-menu');
initLinkPreviews('article');
