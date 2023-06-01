const { redisClient } = require("../middleware/redisClient");
const Cost = require("../models/cost");
const asyncHandler = require("../middleware/async");

const cacheKey = "COST";

const getCosts = asyncHandler(async (req, res, next) => {
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
  const costs = await Cost.find({});
  if (costs === "") {
    res.status(404).json({
      success: false,
      message: "costs not found",
    });
    return;
  }
  if (costs.length > cacheLength) {
    redisClient.set(cacheKey, JSON.stringify(costs));
    res.status(200).json({
      success: true,
      message: "costs found",
      data: costs,
    });
  }
  if (costs.length <= cacheLength) {
    redisClient.del(cacheKey);
    redisClient.set(cacheKey, JSON.stringify(costs));
    cache = await redisClient.get(cacheKey);

    res.status(200).json({
      success: true,
      message: "categories found",
      data: JSON.parse(cache),
    });
  }
});

const createCost = asyncHandler(async (req, res, next) => {
  const cost = await Cost.create(req.body);
  if (cost) {
    res.status(200).json({
      success: true,
      message: "cost created successfully",
      data: cost,
    });
  } else {
    res.status(404).json({ success: false, message: "internal server error" });
  }
});

const getCost = asyncHandler(async (req, res, next) => {
  const { id: costId } = req.params;
  const cost = await Cost.findOne({ _id: req.params.id });
  if (!cost) {
    res.status(200).json({ success: false, message: "cost not found " });
  } else {
    res.status(200).json({ success: true, message: "cost found ", data: cost });
  }
});

const updateCost = asyncHandler(async (req, res, next) => {
  const cost = await Cost.findOne({ _id: req.params.id });
  if (cost) {
    await Cost.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).then(async (costs) => {
      if (costs) {
        await redisClient.del(cacheKey);
        const allCosts = await Cost.find({});
        await redisClient.set(cacheKey, JSON.stringify(allCosts));
        res.status(200).json({
          success: true,
          message: `cost updated `,
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
      message: `No cost found `,
    });
  }
});

const deleteCost = asyncHandler(async (req, res, next) => {
  const cost = await Cost.findOne({ _id: req.params.id });
  if (cost) {
    await Cost.findByIdAndDelete(req.params.id).then(async () => {
      await redisClient.del(cacheKey);
      const allCosts = await Cost.find({});
      await redisClient.set(cacheKey, JSON.stringify(allCosts));
      res.status(200).json({
        success: true,
        message: `Delete cost `,
      });
    });
  } else {
    res.status(404).json({
      success: false,
      message: `cost not found `,
    });
  }
});
const deleteallCosts = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const costs = await Cost.deleteMany({ _id: { $in: id } });
  if (costs) {
    res.status(200).json({
      success: true,
      message: "all costs deleted",
    });
  } else {
    res.status(200).json({
      success: false,
      message: "internal server error",
    });
  }
});
module.exports = {
  getCosts,
  createCost,
  getCost,
  updateCost,
  deleteCost,
  deleteallCosts,
};
