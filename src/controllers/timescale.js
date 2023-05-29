/* eslint-disable import/extensions */
const logger = require("../middleware/logger");
const Timescale = require("../models/timescale");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/error-response");

const getTimescales = asyncHandler(async (req, res, next) => {
  try {
    const timescale = await Timescale.find({});
    res
      .status(200)
      .json({
        success: true,
        message: "all timescales retrieved",
        data: timescale,
      });
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
    } else {
      res
        .status(404)
        .json({ success: false, message: "internal server error" });
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
      res.status(404).json({ success: false, message: "no timescale found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "timescales found", data: timescale });
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
            message: `timescale updated `,
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
        message: `No timescale found`,
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
          message: `Delete timescale `,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `timescale not found `,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getTimescales,
  createTimescale,
  getTimescale,
  updateTimescale,
  deleteTimescale,
};
