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
