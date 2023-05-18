/* eslint-disable import/extensions */
import logger from "../middleware/logger.js";
import ActionStep from "../models/actionSteps.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/error-response.js";

const getactionSteps = asyncHandler(async (req, res, next) => {
  try {
    const actionsteps = await ActionStep.find({});
    res.status(200).json({ success: true, data: actionsteps });
    logger.info(`get all actionsteps`);
  } catch (error) {
    next(error);
  }
});

const createactionSteps = asyncHandler(async (req, res, next) => {
  try {
    const actionsteps = await ActionStep.create(req.body);
    if (actionsteps) {
      res.status(200).json({
        success: true,
        data: actionsteps,
        message: "actionstep created successfully",
      });
      logger.info(`actionstep created`);
    } else {
      res
        .status(404)
        .json({ success: false, message: "internal server error" });
      logger.info(`actionstep not created`);
    }
  } catch (error) {
    next(error);
  }
});

const getactionStep = asyncHandler(async (req, res, next) => {
  try {
    const { id: actionstepId } = req.params;
    const actionstep = await ActionStep.findOne({ _id: req.params.id });

    if (!actionstep) {
      logger.info(`actionstep not found with id ${actionstepId}`);
      next(new ErrorResponse(`No actionstep with id ${actionstepId}`, 404));
    } else {
      logger.info(`actionstep found with id ${actionstepId}`);
      res.status(200).json({ success: true, data: actionstep });
    }
  } catch (error) {
    next(error);
  }
});

const updateactionSteps = asyncHandler(async (req, res, next) => {
  try {
    const actionstep = await ActionStep.findOne({ _id: req.params.id });
    if (actionstep) {
      await ActionStep.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).then(async (actionsteps) => {
        if (actionsteps) {
          res.status(200).json({
            success: true,
            message: `actionstep updated with id ${req.params.id}`,
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
        message: `No actionstep found with id ${req.params.id}`,
      });
    }
  } catch (error) {
    next(error);
  }
});

const deleteactionSteps = asyncHandler(async (req, res, next) => {
  try {
    const actionstep = await ActionStep.findOne({ _id: req.params.id });
    if (actionstep) {
      await ActionStep.findByIdAndDelete(req.params.id).then(async () => {
        res.status(200).json({
          success: true,
          message: `Delete actionstep with id ${req.params.id}`,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `actionstep not found with id ${req.params.id}`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export {
  getactionSteps,
  createactionSteps,
  getactionStep,
  updateactionSteps,
  deleteactionSteps,
};
