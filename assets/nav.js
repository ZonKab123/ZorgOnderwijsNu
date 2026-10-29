/* Toegankelijke navigatie voor ZON — mobiel menu + dropdown.
   Bewust klein, zonder afhankelijkheden, extern geladen i.v.m. CSP. */
(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("hoofdmenu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
  }

  // Dropdown ("Wie zijn wij?")
  var subs = document.querySelectorAll(".has-sub");
  subs.forEach(function (sub) {
    var btn = sub.querySelector("button");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = sub.getAttribute("data-open") === "true";
      subs.forEach(function (s) { s.setAttribute("data-open", "false"); s.querySelector("button").setAttribute("aria-expanded", "false"); });
      sub.setAttribute("data-open", String(!open));
      btn.setAttribute("aria-expanded", String(!open));
    });
  });

  // Springt een link naar een dichtgeklapt paneel (<details>), klap het dan open.
  function openTargetPanel() {
    var id = decodeURIComponent(location.hash.slice(1));
    var el = id && document.getElementById(id);
    if (el && el.tagName === "DETAILS") el.open = true;
  }
  openTargetPanel();
  window.addEventListener("hashchange", openTargetPanel);

  // Pagina geopend met een #anker (link vanaf een andere pagina): spring direct
  // naar het doel. De vloeiende sprong van de browser (scroll-behavior: smooth)
  // wordt anders afgebroken zodra foto's en lettertypes nog binnenkomen, en dan
  // blijft de bezoeker bovenaan staan. Na het laden van alles nog één keer,
  // tenzij de bezoeker intussen zelf is gaan scrollen.
  if (location.hash) {
    var jumpToTarget = function () {
      var id = decodeURIComponent(location.hash.slice(1));
      var el = id && document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    };
    var userScrolled = false;
    ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (ev) {
      window.addEventListener(ev, function () { userScrolled = true; }, { once: true, passive: true });
    });
    jumpToTarget();
    window.addEventListener("load", function () { if (!userScrolled) jumpToTarget(); });
  }

  // Sluit dropdowns bij klik buiten of Escape
  document.addEventListener("click", function () {
    subs.forEach(function (s) { s.setAttribute("data-open", "false"); s.querySelector("button").setAttribute("aria-expanded", "false"); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      subs.forEach(function (s) { s.setAttribute("data-open", "false"); s.querySelector("button").setAttribute("aria-expanded", "false"); });
      if (menu && menu.getAttribute("data-open") === "true" && toggle) {
        menu.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    }
  });
})();
