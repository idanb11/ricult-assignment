const logger = require("../../config/winston");
const googleMapsDataService = require("../services/google-maps-data-service");
const elasticSearchDataService = require("../services/elastic-search-data-service");

const getLocations = async (req, res, next) => {
  const { client } = req.app.locals;
  const { q } = req.query;

  if (!q) return res.send([]);

  try {
    const rawData = await elasticSearchDataService.getElasticSearchData(
      client,
      q
    );

    const elasticSearchData = elasticSearchDataService.convertToGoogleMapsFormat(
      rawData.body.hits.hits
    );

    const googleMapsData = (await googleMapsDataService.getGoogleMapsData(q))
      .data.results;

    if (googleMapsData.length > 5) {
      googleMapsData.length = 5;
    }

    res.status(200).json(elasticSearchData.concat(googleMapsData));
  } catch (error) {
    logger.error("Error getting locations", { q, error });
    next(error);
  }
};

module.exports = { getLocations };
