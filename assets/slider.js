/* Sfeerbeelden-slider. Native scroll-snap als basis (werkt met touch/
   toetsenbord zonder JS); dit script voegt pijlknoppen, puntjes en
   auto-play toe. Auto-play staat uit bij prefers-reduced-motion. */
(function () {
  "use strict";
  var sliders = document.querySelectorAll("[data-slider]");

  sliders.forEach(function (root) {
    var track = root.querySelector("[data-slider-track]");
    var prevBtn = root.querySelector("[data-slider-prev]");
    var nextBtn = root.querySelector("[data-slider-next]");
    var dotsWrap = root.querySelector("[data-slider-dots]");
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) return;

    track.scrollLeft = 0;

    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ga naar foto " + (i + 1) + " van " + slides.length);
      b.addEventListener("click", function () { scrollToSlide(i); });
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });

    function currentIndex() {
      // slides snap to the leading (left) edge, so the "current" slide
      // is whichever one sits closest to the track's own left edge —
      // not the center of the visible viewport.
      var edge = track.getBoundingClientRect().left;
      var closest = 0, closestDist = Infinity;
      slides.forEach(function (s, i) {
        var dist = Math.abs(s.getBoundingClientRect().left - edge);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      return closest;
    }

    function updateDots() {
      var i = currentIndex();
      dots.forEach(function (d, di) { d.setAttribute("aria-current", di === i ? "true" : "false"); });
      return i;
    }

    function scrollToSlide(i) {
      // Scroll only the track itself (never scrollIntoView on the slide —
      // that also nudges the page's vertical scroll position when the
      // slider isn't fully in view, which yanks the whole page back up).
      track.scrollTo({ left: slides[i].offsetLeft, behavior: "smooth" });
    }

    var scrollTimer;
    track.addEventListener("scroll", function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateDots, 100);
    });

    if (prevBtn) prevBtn.addEventListener("click", function () {
      scrollToSlide(Math.max(0, currentIndex() - 1));
    });
    if (nextBtn) nextBtn.addEventListener("click", function () {
      scrollToSlide(Math.min(slides.length - 1, currentIndex() + 1));
    });

    updateDots();

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && slides.length > 1) {
      var timer = null;
      var paused = false;

      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      function start() {
        if (timer || paused) return;
        timer = setInterval(function () {
          scrollToSlide((currentIndex() + 1) % slides.length);
        }, 4500);
      }

      ["mouseenter", "focusin"].forEach(function (ev) {
        root.addEventListener(ev, function () { paused = true; stop(); });
      });
      ["mouseleave", "focusout"].forEach(function (ev) {
        root.addEventListener(ev, function () { paused = false; start(); });
      });

      // Only auto-play while the slider is actually visible on screen —
      // besides being wasteful otherwise, this is what avoids fighting
      // the user's scroll position while they've scrolled past it.
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { if (!paused) start(); }
          else { stop(); }
        }, { threshold: 0.4 }).observe(root);
      } else {
        start();
      }
    }
  });
})();
