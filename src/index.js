import Reveal from 'reveal.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Math from 'reveal.js/plugin/math/math.esm.js';
import Notes from 'reveal.js/plugin/notes/notes.esm.js';
import Search from 'reveal.js/plugin/search/search.esm.js';
import Zoom from 'reveal.js/plugin/zoom/zoom.esm.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/moon.css';
import 'reveal.js/plugin/highlight/zenburn.css';
import 'reveal.js/css/print/pdf.scss';
import './css/regular.css';

Reveal.initialize({
  plugins: [Highlight, Markdown, Math, Notes, Search, Zoom],
  slideNumber: true,
  hashOneBasedIndex: true,
  hash: true,
  history: true,
  mouseWheel: true,
});

// Expose Reveal to window to be able to generate PDF through decktape
window.Reveal = Reveal;