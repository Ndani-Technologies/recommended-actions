const { redisClient } = require("../middleware/redisClient");
const Timescale = require("../models/timescale");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/error-response");

const cacheKey = "TIMESCALE";

const getTimescales = asyncHandler(async (req, res, next) => {
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
  const timescales = await Timescale.find({});
  if (timescales === "") {
    res.status(404).json({
      success: false,
      message: "timescales not found",
    });
    return;
  }
  if (timescales.length > cacheLength) {
    redisClient.set(cacheKey, JSON.stringify(timescales));
    res.status(200).json({
      success: true,
      message: "timescales found",
      data: timescales,
    });
  }
  if (timescales.length <= cacheLength) {
    redisClient.del(cacheKey);
    redisClient.set(cacheKey, JSON.stringify(timescales));
    cache = await redisClient.get(cacheKey);

    res.status(200).json({
      success: true,
      message: "timescales found",
      data: JSON.parse(cache),
    });
  }
});

const createTimescale = asyncHandler(async (req, res, next) => {
  const timescale = await Timescale.create(req.body);
  if (timescale) {
    res.status(200).json({
      success: true,
      data: timescale,
      message: "timescale created successfully",
    });
  } else {
    res.status(404).json({ success: false, message: "internal server error" });
  }
});

const getTimescale = asyncHandler(async (req, res, next) => {
  const { id: timescaleId } = req.params;
  const timescale = await Timescale.findOne({ _id: req.params.id });

  if (!timescale) {
    res.status(404).json({ success: false, message: "no timescale found" });
  } else {
    res
      .status(200)
      .json({ success: true, message: "timescales found", data: timescale });
  }
});

const updateTimescale = asyncHandler(async (req, res, next) => {
  const timescale = await Timescale.findOne({ _id: req.params.id });
  if (timescale) {
    await Timescale.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).then(async (timescales) => {
      if (timescales) {
        await redisClient.del(cacheKey);
        const allTimescales = await Timescale.find({});
        await redisClient.set(cacheKey, JSON.stringify(allTimescales));
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
});

const deleteTimescale = asyncHandler(async (req, res, next) => {
  const timescale = await Timescale.findOne({ _id: req.params.id });
  if (timescale) {
    await Timescale.findByIdAndDelete(req.params.id).then(async () => {
      await redisClient.del(cacheKey);
      const allTimescales = await Timescale.find({});
      await redisClient.set(cacheKey, JSON.stringify(allTimescales));
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
});
const deleteallTimescales = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const timescales = await Timescale.deleteMany({ _id: { $in: id } });
  if (timescales) {
    res.status(200).json({
      success: true,
      message: "all timescales deleted",
    });
  } else {
    res.status(200).json({
      success: false,
      message: "internal server error",
    });
  }
});
module.exports = {
  getTimescales,
  createTimescale,
  getTimescale,
  updateTimescale,
  deleteTimescale,
  deleteallTimescales,
};
