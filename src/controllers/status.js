const { redisClient } = require("../middleware/redisClient");
const Status = require("../models/status");
const asyncHandler = require("../middleware/async");

const cacheKey = "STATUS";

const getStatus = asyncHandler(async (req, res, next) => {
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
  const status = await Status.find({});
  if (status === "") {
    res.status(404).json({
      success: false,
      message: "status not found",
    });
    return;
  }
  if (status.length > cacheLength) {
    redisClient.set(cacheKey, JSON.stringify(status));
    res.status(200).json({
      success: true,
      message: "status found",
      data: status,
    });
  }
  if (status.length <= cacheLength) {
    redisClient.del(cacheKey);
    redisClient.set(cacheKey, JSON.stringify(status));
    cache = await redisClient.get(cacheKey);

    res.status(200).json({
      success: true,
      message: "status found",
      data: JSON.parse(cache),
    });
  }
});

const createStatus = asyncHandler(async (req, res, next) => {
  const status = await Status.create(req.body);
  if (status) {
    res.status(200).json({
      success: true,
      message: "status created successfully",
      data: status,
    });
  } else {
    res.status(404).json({ success: false, message: "internal server error" });
  }
});

const getStatusById = asyncHandler(async (req, res, next) => {
  const { id: statusId } = req.params;
  const status = await Status.findOne({ _id: statusId });

  if (!status) {
    res.status(200).json({ success: true, message: "status not found " });
  } else {
    res
      .status(200)
      .json({ success: true, message: "status found ", data: status });
  }
});

const updateStatus = asyncHandler(async (req, res, next) => {
  const status = await Status.findOne({ _id: req.params.id });
  if (status) {
    await Status.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).then(async (statuses) => {
      if (statuses) {
        await redisClient.del(cacheKey);
        const allStatus = await Status.find({});
        await redisClient.set(cacheKey, JSON.stringify(allStatus));
        res.status(200).json({
          success: true,
          message: `status updated successfully`,
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
      message: `No status found `,
    });
  }
});

const deleteStatus = asyncHandler(async (req, res, next) => {
  const status = await Status.findOne({ _id: req.params.id });
  if (status) {
    await Status.findByIdAndDelete(req.params.id).then(async () => {
      await redisClient.del(cacheKey);
      const allStatus = await Status.find({});
      await redisClient.set(cacheKey, JSON.stringify(allStatus));
      res.status(200).json({
        success: true,
        message: `Delete status `,
      });
    });
  } else {
    res.status(404).json({
      success: false,
      message: `status not found `,
    });
  }
});
const deleteallStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const status = await Status.deleteMany({ _id: { $in: id } });
  if (status) {
    res.status(200).json({
      success: true,
      message: "all status deleted",
    });
  } else {
    res.status(200).json({
      success: false,
      message: "internal server error",
    });
  }
});
module.exports = {
  getStatus,
  createStatus,
  getStatusById,
  updateStatus,
  deleteStatus,
  deleteallStatus,
};
