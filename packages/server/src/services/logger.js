const log4js = require("log4js");

const logLevel = process.env.LOG_LEVEL || "debug";
const isProduction = process.env.NODE_ENV === "production";

const serverFileCategory = "server";

log4js.configure({
  appenders: {
    [serverFileCategory]: { type: "file", filename: `log/server.log` },
    errorFile: {
      type: "file",
      filename: `log/errors.log`,
    },
    errors: {
      type: "logLevelFilter",
      level: "ERROR",
      appender: "errorFile",
    },
    out: { type: "stdout" },
  },
  categories: {
    default: {
      appenders: [isProduction ? serverFileCategory : "out", "errors"],
      level: logLevel,
    },
    [serverFileCategory]: {
      appenders: [
        isProduction ? serverFileCategory : "out",
        isProduction ? serverFileCategory : "errors",
      ],
      level: logLevel,
    },
  },
});

const logger = log4js.getLogger(serverFileCategory);

module.exports = {
  logger,
};
