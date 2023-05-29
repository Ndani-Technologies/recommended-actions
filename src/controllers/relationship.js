/* eslint-disable import/extensions */
const logger = require("../middleware/logger");
const RelationShip = require("../models/relationship");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/error-response");

const getRelationships = asyncHandler(async (req, res, next) => {
  try {
    const relationship = await RelationShip.find({})
      .populate("recomendedActionId")
      .populate({
        path: "recomendedActionId",
        populate: [
          {
            path: "categoryId",
            model: "category",
            // select: 'language titleEng titleAr titleSp titleFr'
          },
          {
            path: "costId",
            model: "cost",
            // select: 'language includeExplanation answerAttempt'
          },
          {
            path: "potentialId",
            model: "potential",
            // select: 'language includeExplanation answerAttempt'
          },
          {
            path: "timescaleId",
            model: "timescale",
            // select: 'language includeExplanation answerAttempt'
          },
          {
            path: "weightId",
            model: "weight",
            // select: 'language includeExplanation answerAttempt'
          },
        ],
      });
    res.status(200).json({
      success: true,
      message: "RelationShip retrieved",
      data: relationship,
    });
  } catch (error) {
    next(error);
  }
});

const createRelationship = asyncHandler(async (req, res, next) => {
  try {
    const relationship = await RelationShip.create(req.body);
    if (relationship) {
      res.status(200).json({
        success: true,
        message: "relationship created successfully",
        data: relationship,
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

const getRelationship = asyncHandler(async (req, res, next) => {
  try {
    const { id: relationshipId } = req.params;
    const relationship = await RelationShip.findOne({ _id: req.params.id });

    if (!relationship) {
      res.status(200).json({ success: true, message: "categories not found " });
    } else {
      res.status(200).json({
        success: true,
        message: "categories found ",
        data: relationship,
      });
    }
  } catch (error) {
    next(error);
  }
});

const updateRelationship = asyncHandler(async (req, res, next) => {
  try {
    const relationship = await RelationShip.findOne({ _id: req.params.id });
    if (relationship) {
      await RelationShip.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).then(async (relationships) => {
        if (relationships) {
          res.status(200).json({
            success: true,
            message: `relationship updated successfully`,
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
        message: `No relationship found `,
      });
    }
  } catch (error) {
    next(error);
  }
});

const deleteRelationship = asyncHandler(async (req, res, next) => {
  try {
    const relationship = await RelationShip.findOne({ _id: req.params.id });
    if (relationship) {
      await RelationShip.findByIdAndDelete(req.params.id).then(async () => {
        res.status(200).json({
          success: true,
          message: `Delete relationship `,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `relationship not found `,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getRelationships,
  createRelationship,
  getRelationship,
  updateRelationship,
  deleteRelationship,
};
