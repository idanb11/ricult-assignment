const logger = require("../../config/winston");

const getLocations = async (req, res, next) => {
  const { collection } = req.app.locals;
  const { q } = req.query;
  try {
    const data = await collection.find({}).limit(10).toArray();
    res.json(data);
  } catch (error) {
    logger.error("Error getting locations", {
      q,
      error,
    });
    next(error);
  }
};

module.exports = { getLocations };
