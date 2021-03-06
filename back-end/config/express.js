const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const httpStatus = require("http-status");
const expressWinston = require("express-winston");
const expressValidation = require("express-validation");
const helmet = require("helmet");
const cors = require("cors");
const winstonInstance = require("./winston");
const routes = require("../index.route");
const config = require("./config");

const app = express();

if (config.env === "development") {
  app.use(logger("dev"));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compress());
app.use(methodOverride());
app.use(helmet());
app.use(cors());

// enable detailed API logging in dev env
if (config.env === "development") {
  expressWinston.requestWhitelist.push("body");
  expressWinston.responseWhitelist.push("body");
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true, // optional: log meta data about request (defaults to true)
      msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
      colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    })
  );
}

// mount all routes on /api path
app.use("/api/v1", routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors
      .map((error) => error.messages.join(". "))
      .join(" and ");
    const error = new Error(unifiedErrorMessage, err.status, true);
    return next(error);
  }

  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  if (req.originalUrl && req.originalUrl.split("/").pop() === "favicon.ico") {
    return res.sendStatus(204);
  }

  const err = new Error("API not found", httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => res.status(err.status).json({
  message: err.isPublic ? err.message : httpStatus[err.status],
  stack: config.env === "development" ? err.stack : {},
}));

module.exports = app;
