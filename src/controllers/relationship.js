/* eslint-disable import/extensions */
const logger = require("../middleware/logger");

const { redisClient } = require("../middleware/redisClient");
const RelationShip = require("../models/relationship");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/error-response");

const cacheKey = "RELATIONSHIP";

const getRelationships = asyncHandler(async (req, res, next) => {
  try {
    let cache = await redisClient.get(cacheKey);
    let cacheObj = "";
    let cacheLength = 0;
    if (cache != null) {
      cacheObj = JSON.parse(cache);
      cacheLength = Object.keys(cacheObj).length;
    } else {
      cacheLength = 0;
      cacheObj = "";
    }
    const relationships = await RelationShip.find({})
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
    if (relationships === "") {
      res.status(404).json({
        success: false,
        message: "relationships not found",
      });
      return;
    }
    if (relationships.length > cacheLength) {
      redisClient.set(cacheKey, JSON.stringify(relationships));
      res.status(200).json({
        success: true,
        message: "relationships found",
        data: relationships,
      });
    }
    if (relationships.length <= cacheLength) {
      redisClient.del(cacheKey);
      redisClient.set(cacheKey, JSON.stringify(relationships));
      cache = await redisClient.get(cacheKey);

      res.status(200).json({
        success: true,
        message: "relationships found",
        data: JSON.parse(cache),
      });
    }
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
      res
        .status(200)
        .json({ success: true, message: "relationship not found " });
    } else {
      res.status(200).json({
        success: true,
        message: "relationship found ",
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
          await redisClient.del(cacheKey);
          const allRelationships = await RelationShip.find({})
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
          await redisClient.set(cacheKey, JSON.stringify(allRelationships));
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
        await redisClient.del(cacheKey);
        const allRelationships = await RelationShip.find({})
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
        await redisClient.set(cacheKey, JSON.stringify(allRelationships));
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
const deleteallRelationShips = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.body;
    const relationships = await RelationShip.deleteMany({ _id: { $in: id } });
    if (relationships) {
      res.status(200).json({
        success: true,
        message: "all relationships deleted",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "internal server error",
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
  deleteallRelationShips,
};
