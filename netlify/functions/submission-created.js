/* Verwijdert elke formulierinzending direct nadat Netlify 'm heeft
   ontvangen en de e-mailnotificatie heeft verstuurd (zie Site settings
   > Forms > Form notifications). Er blijft dus geen kopie van
   aanmeld-/contactgegevens achter in het Netlify-dashboard. */
exports.handler = async function (event) {
  try {
    const { payload } = JSON.parse(event.body);
    const token = process.env.NETLIFY_API_TOKEN;

    if (!payload || !payload.id) {
      console.error("submission-created: geen submission id in payload");
      return { statusCode: 200, body: "" };
    }
    if (!token) {
      console.error("submission-created: NETLIFY_API_TOKEN ontbreekt, inzending niet verwijderd");
      return { statusCode: 200, body: "" };
    }

    const res = await fetch(`https://api.netlify.com/api/v1/submissions/${payload.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      console.error(`submission-created: verwijderen mislukt (${res.status})`);
    }
  } catch (err) {
    console.error("submission-created: onverwachte fout", err);
  }

  return { statusCode: 200, body: "" };
};
