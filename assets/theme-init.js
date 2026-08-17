/* Zet het gekozen thema (modern/klassiek) vóór de eerste render,
   zodat er geen flits van het verkeerde thema zichtbaar is. */
(function () {
  "use strict";
  try {
    if (localStorage.getItem("zonTheme") === "classic") {
      document.documentElement.setAttribute("data-theme", "classic");
    }
  } catch (e) {}
})();
