const { redisClient } = require("../middleware/redisClient");
const Steps = require("../models/steps");
const asyncHandler = require("../middleware/async");

const cacheKey = "STEPS";

const getSteps = asyncHandler(async (req, res, next) => {
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
  const steps = await Steps.find({});
  if (steps === "") {
    res.status(404).json({
      success: false,
      message: "steps not found",
    });
    return;
  }
  if (steps.length > cacheLength) {
    redisClient.set(cacheKey, JSON.stringify(steps));
    res.status(200).json({
      success: true,
      message: "steps found",
      data: steps,
    });
  }
  if (steps.length <= cacheLength) {
    redisClient.del(cacheKey);
    redisClient.set(cacheKey, JSON.stringify(steps));
    cache = await redisClient.get(cacheKey);

    res.status(200).json({
      success: true,
      message: "steps found",
      data: JSON.parse(cache),
    });
  }
});

const createStep = asyncHandler(async (req, res, next) => {
  const step = await Steps.create(req.body);
  if (step) {
    res.status(200).json({
      success: true,
      message: "step created successfully",
      data: step,
    });
  } else {
    res.status(404).json({ success: false, message: "internal server error" });
  }
});

const getStep = asyncHandler(async (req, res, next) => {
  const { id: stepId } = req.params;
  const step = await Steps.findOne({ _id: req.params.id });

  if (!step) {
    res.status(200).json({ success: true, message: "steps not found " });
  } else {
    res
      .status(200)
      .json({ success: true, message: "steps found ", data: step });
  }
});

const updateStep = asyncHandler(async (req, res, next) => {
  const step = await Steps.findOne({ _id: req.params.id });
  if (step) {
    await Steps.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).then(async (steps) => {
      if (steps) {
        await redisClient.del(cacheKey);
        const allSteps = await Steps.find({});
        await redisClient.set(cacheKey, JSON.stringify(allSteps));
        res.status(200).json({
          success: true,
          message: `step updated successfully`,
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
      message: `No step found `,
    });
  }
});

const deleteStep = asyncHandler(async (req, res, next) => {
  const step = await Steps.findOne({ _id: req.params.id });
  if (step) {
    await Steps.findByIdAndDelete(req.params.id).then(async () => {
      await redisClient.del(cacheKey);
      const allSteps = await Steps.find({});
      await redisClient.set(cacheKey, JSON.stringify(allSteps));
      res.status(200).json({
        success: true,
        message: `Delete step `,
      });
    });
  } else {
    res.status(404).json({
      success: false,
      message: `step not found `,
    });
  }
});
const deleteallSteps = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const steps = await Steps.deleteMany({ _id: { $in: id } });
  if (steps) {
    res.status(200).json({
      success: true,
      message: "all steps deleted",
    });
  } else {
    res.status(200).json({
      success: false,
      message: "internal server error",
    });
  }
});
module.exports = {
  getSteps,
  createStep,
  getStep,
  updateStep,
  deleteStep,
  deleteallSteps,
};
