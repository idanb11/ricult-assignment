const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('ms-store-quiz:insert-quiz-data');
const argv = require('minimist')(process.argv.slice(2));

const logger = require('../config/winston');
const QuizDataService = require('./helpers/quiz-data.service');
const dataService = new QuizDataService(argv.data);


// config should be imported before importing any other file
const config = require('../config/config');

// connect to mongo db
const mongoUri = config.mongo.host;
const settings = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };

mongoose.connect(mongoUri, settings)
  .then(() => {
    logger.info('Connected to database', mongoUri);
    logger.info('Starting script...');

    dataService.init();

  })
  .catch((err) => {
    logger.critical(`Unable to connect to database: ${mongoUri}, Error: ${err}`);
    process.exit(1);
  });

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}
