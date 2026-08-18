/* Sfeerbeelden-slider. Native scroll-snap als basis (werkt met touch/
   toetsenbord zonder JS); dit script voegt pijlknoppen, puntjes en
   auto-play toe. Auto-play staat uit bij prefers-reduced-motion. */
(function () {
  "use strict";
  var sliders = document.querySelectorAll("[data-slider]");

  var AUTOPLAY_MS = 4500;

  sliders.forEach(function (root) {
    var track = root.querySelector("[data-slider-track]");
    var prevBtn = root.querySelector("[data-slider-prev]");
    var nextBtn = root.querySelector("[data-slider-next]");
    var dotsWrap = root.querySelector("[data-slider-dots]");
    var progressBar = root.querySelector("[data-slider-progress] .slider-progress-bar");
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) return;

    track.scrollLeft = 0;

    var dots = slides.map(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ga naar foto " + (i + 1) + " van " + slides.length);
      b.addEventListener("click", function () { scrollToSlide(i); resetProgress(!!timer); });
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

    // Voortgangsbalk (alleen aanwezig op de hoofdslider): laat zien dat
    // en wanneer de slider automatisch doorschuift, en bevriest zichtbaar
    // op pauze (hover/focus) i.p.v. gewoon te verdwijnen.
    function freezeProgress() {
      if (!progressBar) return;
      var w = getComputedStyle(progressBar).width;
      progressBar.style.transition = "none";
      progressBar.style.width = w;
    }
    function resetProgress(animate) {
      if (!progressBar) return;
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      if (!animate) return;
      void progressBar.offsetWidth; // force reflow zodat de transitie opnieuw start
      progressBar.style.transition = "width " + AUTOPLAY_MS + "ms linear";
      progressBar.style.width = "100%";
    }

    if (prevBtn) prevBtn.addEventListener("click", function () {
      scrollToSlide(Math.max(0, currentIndex() - 1));
      resetProgress(!!timer);
    });
    if (nextBtn) nextBtn.addEventListener("click", function () {
      scrollToSlide(Math.min(slides.length - 1, currentIndex() + 1));
      resetProgress(!!timer);
    });

    updateDots();

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var timer = null;
    if (!reduceMotion && slides.length > 1) {
      var paused = false;

      function stop() { if (timer) { clearInterval(timer); timer = null; freezeProgress(); } }
      function start() {
        if (timer || paused) return;
        resetProgress(true);
        timer = setInterval(function () {
          scrollToSlide((currentIndex() + 1) % slides.length);
          resetProgress(true);
        }, AUTOPLAY_MS);
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
