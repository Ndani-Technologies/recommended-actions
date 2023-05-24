/* eslint-disable import/extensions */
const logger = require("../middleware/logger");
const Potential = require("../models/potential");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/error-response");

const getPotentials = asyncHandler(async (req, res, next) => {
  try {
    const potential = await Potential.find({});
    res
      .status(200)
      .json({
        success: true,
        message: "all potentials retrieved",
        data: potential,
      });
  } catch (error) {
    next(error);
  }
});

const createPotential = asyncHandler(async (req, res, next) => {
  try {
    const potential = await Potential.create(req.body);
    if (potential) {
      res.status(200).json({
        success: true,
        data: potential,
        message: "potential created successfully",
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

const getPotential = asyncHandler(async (req, res, next) => {
  try {
    const { id: potentialId } = req.params;
    const potential = await Potential.findOne({ _id: req.params.id });

    if (!potential) {
      res.status(404).json({ success: false, message: "No potential found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Potential found", data: potential });
    }
  } catch (error) {
    next(error);
  }
});

const updatePotential = asyncHandler(async (req, res, next) => {
  try {
    const potential = await Potential.findOne({ _id: req.params.id });
    if (potential) {
      await Potential.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).then(async (potentials) => {
        if (potentials) {
          res.status(200).json({
            success: true,
            message: `potential updated `,
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
        message: `No potential found `,
      });
    }
  } catch (error) {
    next(error);
  }
});

const deletePotential = asyncHandler(async (req, res, next) => {
  try {
    const potential = await Potential.findOne({ _id: req.params.id });
    if (potential) {
      await Potential.findByIdAndDelete(req.params.id).then(async () => {
        res.status(200).json({
          success: true,
          message: `Delete potential `,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `potential not found `,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getPotentials,
  createPotential,
  getPotential,
  updatePotential,
  deletePotential,
};
