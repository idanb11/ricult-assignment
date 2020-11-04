function getElasticSearchData(client, q) {
  return client.search({
    index: "locations",
    body: {
      size: 5,
      query: {
        match: {
          name: {
            query: q,
            fuzziness: "AUTO",
          },
        },
      },
    },
  });
}

function convertToGoogleMapsFormat(data) {
  return data.map((item) => ({
    name: item._source.name,
    geometry: {
      location: {
        lat: item._source.location[0],
        lng: item._source.location[1],
      },
    },
  }));
}

module.exports = { getElasticSearchData, convertToGoogleMapsFormat };
