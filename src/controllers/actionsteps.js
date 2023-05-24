/* eslint-disable import/extensions */
const logger = require("../middleware/logger");
const ActionStep = require("../models/actionSteps");
const asyncHandler = require("../middleware/async");

const getactionSteps = asyncHandler(async (req, res, next) => {
  try {
    const actionsteps = await ActionStep.find({});
    res.status(200).json({
      success: true,
      message: "get all actionsteps",
      data: actionsteps,
    });
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
        message: "actionstep created successfully",
        data: actionsteps,
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "internal server error" });
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
      res.status(404).json({ success: false, message: "No action step Found" });
    } else {
      res.status(200).json({
        success: true,
        message: "actionstep found with given Id",
        data: actionstep,
      });
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
            message: `actionstep updated successfully`,
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
        message: `No actionstep found`,
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
          message: `Delete actionstep successfully`,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `actionstep not found `,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getactionSteps,
  createactionSteps,
  getactionStep,
  updateactionSteps,
  deleteactionSteps,
};
