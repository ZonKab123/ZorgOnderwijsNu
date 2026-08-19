/* Verstuurt formulieren naar Netlify Forms (AJAX, geen paginaherlaad).
   Netlify's eigen e-mailnotificatie stuurt het bericht door; een
   submission-created-functie verwijdert de inzending daarna direct
   weer uit het Netlify-dashboard (zie netlify/functions). */
(function () {
  "use strict";
  var forms = document.querySelectorAll("form[data-zon-form]");
  forms.forEach(function (form) {
    var status = form.querySelector("[data-status]");
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: bots vullen dit verborgen veld in.
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value.trim() !== "") { return; }

      // Basisvalidatie (browser doet het meeste via required/type).
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      var body = new URLSearchParams(new FormData(form)).toString();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Verzenden mislukt");
          if (status) {
            status.hidden = false;
            status.textContent = "Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.";
            status.focus();
          }
          form.reset();
        })
        .catch(function () {
          if (status) {
            status.hidden = false;
            status.textContent = "Er ging iets mis bij het verzenden. Probeer het opnieuw, of mail ons rechtstreeks via info@zorgonderwijsnu.nl.";
            status.focus();
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  });
})();
