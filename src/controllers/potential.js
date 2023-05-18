/* eslint-disable import/extensions */
import logger from "../middleware/logger.js";
import Potential from "../models/potential.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/error-response.js";

const getPotentials = asyncHandler(async (req, res, next) => {
  try {
    const potential = await Potential.find({});
    res.status(200).json({ success: true, data: potential });
    logger.info(`get all potential`);
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
      logger.info(`potential created`);
    } else {
      res
        .status(404)
        .json({ success: false, message: "internal server error" });
      logger.info(`potential not created`);
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
      logger.info(`potential not found with id ${potentialId}`);
      next(new ErrorResponse(`No potential with id ${potentialId}`, 404));
    } else {
      logger.info(`potential found with id ${potentialId}`);
      res.status(200).json({ success: true, data: potential });
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
            message: `potential updated with id ${req.params.id}`,
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
        message: `No potential found with id ${req.params.id}`,
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
          message: `Delete potential with id ${req.params.id}`,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `potential not found with id ${req.params.id}`,
      });
    }
  } catch (error) {
    next(error);
  }
});

export {
  getPotentials,
  createPotential,
  getPotential,
  updatePotential,
  deletePotential,
};
