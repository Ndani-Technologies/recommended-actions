/* eslint-disable import/extensions */
const logger = require("../middleware/logger");
const Weight = require("../models/weight");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/error-response");

const getWeights = asyncHandler(async (req, res, next) => {
  try {
    const weight = await Weight.find({});
    res
      .status(200)
      .json({ success: true, message: "all weights retrieved", data: weight });
  } catch (error) {
    next(error);
  }
});

const createWeight = asyncHandler(async (req, res, next) => {
  try {
    const weight = await Weight.create(req.body);
    if (weight) {
      res.status(200).json({
        success: true,
        data: weight,
        message: "weight created successfully",
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

const getWeight = asyncHandler(async (req, res, next) => {
  try {
    const { id: weightId } = req.params;
    const weight = await Weight.findOne({ _id: req.params.id });

    if (!weight) {
      res.status(404).json({ success: false, message: "weight not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "weight found", data: weight });
    }
  } catch (error) {
    next(error);
  }
});

const updateWeight = asyncHandler(async (req, res, next) => {
  try {
    const weight = await Weight.findOne({ _id: req.params.id });
    if (weight) {
      await Weight.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).then(async (weights) => {
        if (weights) {
          res.status(200).json({
            success: true,
            message: `weight updated `,
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
        message: `No weight found `,
      });
    }
  } catch (error) {
    next(error);
  }
});

const deleteWeight = asyncHandler(async (req, res, next) => {
  try {
    const weight = await Weight.findOne({ _id: req.params.id });
    if (weight) {
      await Weight.findByIdAndDelete(req.params.id).then(async () => {
        res.status(200).json({
          success: true,
          message: `Delete weight `,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `weight not found `,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getWeights,
  createWeight,
  getWeight,
  updateWeight,
  deleteWeight,
};
