import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const getLogger = (filename = "starter-service") => {
  const fileTransport = new transports.DailyRotateFile({
    filename: `logs/${filename}-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  });

  const consoleTransport = new transports.Console({
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
    handleExceptions: false,
    json: false,
    colorize: true,
    format: format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    ),
  });

  const logger = createLogger({
    level: "info",
    format: format.combine(
      format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.printf(
        ({ level, message, label = process.env.NODE_ENV, timestamp }) =>
          `${timestamp} [${label}] ${level}: ${message}`
      )
    ),
    defaultMeta: { service: "starter-service" },
    transports: [consoleTransport],
  });

  if (process.env.NODE_ENV === "development") {
    logger.add(fileTransport);
  }

  return logger;
};

export default getLogger();
