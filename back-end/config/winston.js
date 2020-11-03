const { createLogger, transports, format } = require('winston');

const consoleTransport = new (transports.Console)({
  json: true,
  stringify: (obj) => JSON.stringify(obj)
});

const logger = createLogger({
  level: 'info',
  format: format.json(),
  defaultMeta: { service: process.env.SERVICE_NAME },
  transports: [consoleTransport]
});

module.exports = logger;
