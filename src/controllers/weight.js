const { redisClient } = require("../middleware/redisClient");
const Weight = require("../models/weight");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/error-response");

const cacheKey = "WEIGHT";

const getWeights = asyncHandler(async (req, res, next) => {
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
    const weights = await Weight.find({});
    if (weights === "") {
      res.status(404).json({
        success: false,
        message: "weights not found",
      });
      return;
    }
    if (weights.length > cacheLength) {
      redisClient.set(cacheKey, JSON.stringify(weights));
      res.status(200).json({
        success: true,
        message: "weights found",
        data: weights,
      });
    }
    if (weights.length <= cacheLength) {
      redisClient.del(cacheKey);
      redisClient.set(cacheKey, JSON.stringify(weights));
      cache = await redisClient.get(cacheKey);

      res.status(200).json({
        success: true,
        message: "weights found",
        data: JSON.parse(cache),
      });
    }
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
          await redisClient.del(cacheKey);
          const allWeights = await Weight.find({});
          await redisClient.set(cacheKey, JSON.stringify(allWeights));
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
        await redisClient.del(cacheKey);
        const allWeights = await Weight.find({});
        await redisClient.set(cacheKey, JSON.stringify(allWeights));
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
const deleteallWeight = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.body;
    const weights = await Weight.deleteMany({ _id: { $in: id } });
    if (weights) {
      res.status(200).json({
        success: true,
        message: "all weights deleted",
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
  getWeights,
  createWeight,
  getWeight,
  updateWeight,
  deleteWeight,
  deleteallWeight,
};
