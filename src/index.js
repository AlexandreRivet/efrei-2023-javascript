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

// Manage to load iframes inside a slide
const iFrameID = "iframe-preview";
const iAttributeIframeSrc = "data-iframe-src";

function loadIframe(iSrc, iDestination) {
  let iframe = document.createElement("iframe");
  iframe.id = iFrameID;
  iframe.src = iSrc;
  iframe.style.backgroundColor = "transparent";
  iframe.frameBorder = "0";
  iframe.allowTransparency = "true";
  iframe.style.display = "none";
  iframe.onload = function () {
    iframe.style.display = "block";
    window.dispatchEvent(new Event('resize'));
  }
  iDestination.appendChild(iframe);
}

function unloadIframe(iSrc) {
  let iframe = document.getElementById(iFrameID);
  iframe.src = "";
  iSrc.removeChild(iframe);
  iframe = null;
}

Reveal.addEventListener('slidechanged', function (e) {
  var oldSlide = e.previousSlide;
  var currentSlide = e.currentSlide;

  // Check if we have to unload the previous slide
  if (typeof oldSlide !== 'undefined' && oldSlide.hasAttribute(iAttributeIframeSrc)) {
    unloadIframe(oldSlide);
  }

  // Check if we have to load the current slide
  if (typeof currentSlide !== 'undefined' && currentSlide.hasAttribute(iAttributeIframeSrc)) {
    loadIframe(currentSlide.getAttribute(iAttributeIframeSrc), currentSlide);
  }
});