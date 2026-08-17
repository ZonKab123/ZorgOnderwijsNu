/* Knop rechtsonder om te wisselen tussen de nieuwe en de
   klassieke (op de huidige live site gebaseerde) vormgeving. */
(function () {
  "use strict";

  var KEY = "zonTheme";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;
  var label = btn.querySelector(".theme-toggle-label");

  function sync() {
    var isClassic = root.getAttribute("data-theme") === "classic";
    btn.setAttribute("aria-pressed", String(isClassic));
    if (label) label.textContent = isClassic ? "Nieuwe look" : "Klassieke look";
  }
  sync();

  btn.addEventListener("click", function () {
    var isClassic = root.getAttribute("data-theme") === "classic";
    if (isClassic) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", "classic");
    }
    try {
      localStorage.setItem(KEY, isClassic ? "modern" : "classic");
    } catch (e) {}
    sync();
  });
})();
