/* Klik-om-te-laden kaarten. Er gaat geen data naar Google totdat
   iemand hier zelf op klikt (zie security review — bewuste keuze i.v.m. AVG). */
(function () {
  "use strict";
  var buttons = document.querySelectorAll("[data-map-toggle]");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wrap = btn.closest(".map-embed");
      if (!wrap) return;
      var iframe = document.createElement("iframe");
      iframe.src = wrap.getAttribute("data-map-src");
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.title = wrap.getAttribute("data-map-title") || "Kaart";
      wrap.replaceChildren(iframe);
    });
  });
})();
