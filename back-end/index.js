const { MongoClient } = require("mongodb");

const logger = require("./config/winston");

// config should be imported before importing any other file
const config = require("./config/config");
const app = require("./config/express");

// mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
const client = new MongoClient(mongoUri, {
  useUnifiedTopology: true,
  poolSize: 10,
});

client
  .connect()
  .then(() => {
    logger.info("Database connected.");

    const db = client.db('ricult');
    const collection = db.collection('locations');

    app.locals.collection = collection;

    if (!module.parent) {
      // listen on port config.port
      app.listen(config.port, () => {
        logger.info(`server started on port ${config.port}.`);
      });
    }
  })
  .catch((err) => {
    logger.error("Unable to connect to database", { error: err });
    process.exit(1);
  });

module.exports = { app };
