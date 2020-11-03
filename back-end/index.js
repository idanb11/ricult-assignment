const { Client } = require("@elastic/elasticsearch");
const config = require("./config/config");

const client = new Client({ node: config.elasticServerUrl });
const logger = require("./config/winston");
const app = require("./config/express");

app.locals.client = client;

if (!module.parent) {
  app.listen(config.apiPort, () => {
    logger.info(`server started on port ${config.apiPort}.`);
  });
}

module.exports = { app };
