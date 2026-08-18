/* Laadt de Facebook Page Plugin pas na een klik van de bezoeker,
   zodat Facebook's cookies/trackers niet ongevraagd meelopen bij
   elk bezoek aan de Nieuws-pagina. */
(function () {
  "use strict";

  var placeholder = document.querySelector("[data-fb-placeholder]");
  var btn = document.querySelector("[data-fb-load]");
  if (!placeholder || !btn) return;

  btn.addEventListener("click", function () {
    var pageUrl = "https://www.facebook.com/zorgenonderwijsnu";
    var src = "https://www.facebook.com/plugins/page.php?href=" +
      encodeURIComponent(pageUrl) +
      "&tabs=timeline&width=500&height=700&small_header=false" +
      "&adapt_container_width=true&hide_cover=false&show_facepile=false&locale=nl_NL";

    var iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.width = "500";
    iframe.height = "700";
    iframe.style.border = "none";
    iframe.style.overflow = "hidden";
    iframe.style.maxWidth = "100%";
    iframe.scrolling = "no";
    iframe.frameBorder = "0";
    iframe.setAttribute("allow", "encrypted-media; picture-in-picture; web-share");
    iframe.title = "Facebook-berichten van Zorg en Onderwijs Nu";

    placeholder.replaceWith(iframe);
  });
})();
