const { Client } = require("@googlemaps/google-maps-services-js");
const config = require("../../config/config");

function getGoogleMapsData(q) {
  const client = new Client({});

  return client.textSearch({
    params: {
      query: q,
      key: config.googleApiKey,
      fields: "name,geometry",
    },
  });
}

module.exports = { getGoogleMapsData };
