const logger = require("../../config/winston");

const getLocations = async (req, res, next) => {
  const { client } = req.app.locals;
  const { q } = req.query;
  try {
    const { body } = await client.search({
      index: "locations",
      body: {
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

    res.status(200).json(body.hits.hits);
  } catch (error) {
    logger.error("Error getting locations", {
      q,
      error,
    });
    next(error);
  }
};

module.exports = { getLocations };
