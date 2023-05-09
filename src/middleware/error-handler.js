/* eslint-disable import/extensions */
import ErrorResponse from "../utils/error-response.js";
import logger from "./logger.js";

function errorHandler(err, req, res, next) {
  logger.error(`🔥 ${err.stack}`);

  let error = { ...err };
  error.message = err.message;

  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(messages, 400);
  }

  if (err.code === 11000) {
    const messages = Object.values(err.keyValue).map((val) => val);

    error = new ErrorResponse(
      `Duplicate field value entered for ${Object.keys(
        err.keyValue
      )}: ${messages}`,
      400
    );
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal Server Error",
  });
}

export default errorHandler;
