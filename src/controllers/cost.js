/* eslint-disable import/extensions */
import logger from "../middleware/logger.js";
import Cost from "../models/cost.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/error-response.js";

const getCosts = asyncHandler(async (req, res, next) => {
  try {
    const cost = await Cost.find({});
    res.status(200).json({ success: true, data: cost });
    logger.info(`get all cost`);
  } catch (error) {
    next(error);
  }
});

const createCost = asyncHandler(async (req, res, next) => {
  try {
    const cost = await Cost.create(req.body);
    if (cost) {
      res.status(200).json({
        success: true,
        data: cost,
        message: "cost created successfully",
      });
      logger.info(`cost created`);
    } else {
      res
        .status(404)
        .json({ success: false, message: "internal server error" });
      logger.info(`cost not created`);
    }
  } catch (error) {
    next(error);
  }
});

const getCost = asyncHandler(async (req, res, next) => {
  try {
    const { id: costId } = req.params;
    const cost = await Cost.findOne({ _id: req.params.id });

    if (!cost) {
      logger.info(`cost not found with id ${costId}`);
      next(new ErrorResponse(`No cost with id ${costId}`, 404));
    } else {
      logger.info(`cost found with id ${costId}`);
      res.status(200).json({ success: true, data: cost });
    }
  } catch (error) {
    next(error);
  }
});

const updateCost = asyncHandler(async (req, res, next) => {
  try {
    const cost = await Cost.findOne({ _id: req.params.id });
    if (cost) {
      await Cost.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).then(async (costs) => {
        if (costs) {
          res.status(200).json({
            success: true,
            message: `cost updated with id ${req.params.id}`,
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
        message: `No cost found with id ${req.params.id}`,
      });
    }
  } catch (error) {
    next(error);
  }
});

const deleteCost = asyncHandler(async (req, res, next) => {
  try {
    const cost = await Cost.findOne({ _id: req.params.id });
    if (cost) {
      await Cost.findByIdAndDelete(req.params.id).then(async () => {
        res.status(200).json({
          success: true,
          message: `Delete cost with id ${req.params.id}`,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `cost not found with id ${req.params.id}`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export { getCosts, createCost, getCost, updateCost, deleteCost };
