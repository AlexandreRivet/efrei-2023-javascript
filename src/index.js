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
const frameClass = "iframe-preview";
const attributeIframeSrc = "data-iframe-src";
const attributeIframeRoot = "data-iframe-root";

function getIframeRoot(slide) {
  const potentialRoot = slide.querySelector(`[${attributeIframeRoot}]`);
  return potentialRoot !== null ? potentialRoot : slide;
}

function getIframe(slide) {
  const iframeRoot = getIframeRoot(slide);
  return iframeRoot.querySelector(`.${frameClass}`);
}

function loadIframeIntoSlide(slide) {
  const iframe = document.createElement("iframe");
  iframe.classList.add(frameClass);
  iframe.src = slide.getAttribute(attributeIframeSrc);
  iframe.allowTransparency = "true";
  iframe.onload = function () {
    let mutationObserver = new MutationObserver(function() {
      // Keep iframe at the right size
      iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight + 'px';
      Reveal.layout();
    });
    mutationObserver.observe(iframe.contentWindow.document.body, { childList: true, subtree: true });
  }
  getIframeRoot(slide).appendChild(iframe);
}

function unloadIframeFromSlide(slide) {
  const iframeRoot = getIframeRoot(slide);
  const iframe = getIframe(slide);
  iframe.src = "";
  iframeRoot.removeChild(iframe);
}

// Load potential iframe in new slide
Reveal.addEventListener('slidechanged', function (e) {
  const { currentSlide } = e;
  if (
    typeof currentSlide !== 'undefined' &&
    currentSlide.hasAttribute(attributeIframeSrc) &&
    getIframe(currentSlide) === null
  ) {
    loadIframeIntoSlide(currentSlide);
  }
});

// Remove iframe once we are on new slide
Reveal.addEventListener('slidetransitionend', function(e) {
  const { previousSlide } = e;
  // Check if we have to unload the previous slide
  if (
    typeof previousSlide !== 'undefined' &&
    previousSlide.hasAttribute(attributeIframeSrc) &&
    getIframe(previousSlide) !== null
  ) {
    unloadIframeFromSlide(previousSlide);
  }
});