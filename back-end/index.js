const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('ms-store-quiz:index');
const logger = require('./config/winston');

// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
const redis = require('./cache/redis');

// make bluebird default Promise
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
const settings = { useNewUrlParser: true };


mongoose.connect(mongoUri, settings)
  .then(() => redis.connect())
  .then(() => {
    logger.info('Database connected.');

    if (!module.parent) {
      // listen on port config.port
      app.listen(config.port, () => {
        logger.info(`server started on port ${config.port}.`);
      });
    }
  })
  .catch((err) => {
    logger.error('Unable to connect to database', { error: err });
    process.exit(1);
  });

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

module.exports = { app, redis };
