/* Progressieve verbetering voor formulieren op ZON.
   Server-side validatie + CSRF-token blijft altijd nodig (zie proposal). */
(function () {
  "use strict";
  var forms = document.querySelectorAll("form[data-zon-form]");
  forms.forEach(function (form) {
    var status = form.querySelector("[data-status]");
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // demo: geen backend gekoppeld

      // Honeypot: bots vullen dit verborgen veld in.
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value.trim() !== "") { return; }

      // Basisvalidatie (browser doet het meeste via required/type).
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (status) {
        status.hidden = false;
        status.textContent =
          "Bedankt! Dit is een ontwerpvoorbeeld — koppel dit formulier aan een beveiligd endpoint om berichten te ontvangen.";
        status.focus();
      }
      form.reset();
    });
  });
})();
