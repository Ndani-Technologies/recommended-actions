/* eslint-disable import/extensions */
import logger from "../middleware/logger.js";
import Timescale from "../models/timescale.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/error-response.js";

const getTimescales = asyncHandler(async (req, res, next) => {
  try {
    const timescale = await Timescale.find({});
    res.status(200).json({ success: true, data: timescale });
    logger.info(`get all timescale`);
  } catch (error) {
    next(error);
  }
});

const createTimescale = asyncHandler(async (req, res, next) => {
  try {
    const timescale = await Timescale.create(req.body);
    if (timescale) {
      res.status(200).json({
        success: true,
        data: timescale,
        message: "timescale created successfully",
      });
      logger.info(`timescale created`);
    } else {
      res
        .status(404)
        .json({ success: false, message: "internal server error" });
      logger.info(`timescale not created`);
    }
  } catch (error) {
    next(error);
  }
});

const getTimescale = asyncHandler(async (req, res, next) => {
  try {
    const { id: timescaleId } = req.params;
    const timescale = await Timescale.findOne({ _id: req.params.id });

    if (!timescale) {
      logger.info(`timescale not found with id ${timescaleId}`);
      next(new ErrorResponse(`No timescale with id ${timescaleId}`, 404));
    } else {
      logger.info(`timescale found with id ${timescaleId}`);
      res.status(200).json({ success: true, data: timescale });
    }
  } catch (error) {
    next(error);
  }
});

const updateTimescale = asyncHandler(async (req, res, next) => {
  try {
    const timescale = await Timescale.findOne({ _id: req.params.id });
    if (timescale) {
      await Timescale.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).then(async (timescales) => {
        if (timescales) {
          res.status(200).json({
            success: true,
            message: `timescale updated with id ${req.params.id}`,
          });
        } else {
          res
            .status(404)
            .json({ success: false, message: `internal server error` });
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No timescale found with id ${req.params.id}`,
      });
    }
  } catch (error) {
    next(error);
  }
});

const deleteTimescale = asyncHandler(async (req, res, next) => {
  try {
    const timescale = await Timescale.findOne({ _id: req.params.id });
    if (timescale) {
      await Timescale.findByIdAndDelete(req.params.id).then(async () => {
        res.status(200).json({
          success: true,
          message: `Delete timescale with id ${req.params.id}`,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `timescale not found with id ${req.params.id}`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export {
  getTimescales,
  createTimescale,
  getTimescale,
  updateTimescale,
  deleteTimescale,
};
