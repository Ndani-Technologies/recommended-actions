const { redisClient } = require("../middleware/redisClient");
const ResourceLink = require("../models/resource_link");
const asyncHandler = require("../middleware/async");

const cacheKey = "RESOUCELINK";

const getResourceLinks = asyncHandler(async (req, res, next) => {
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
  const resourceLinks = await ResourceLink.find({});
  if (resourceLinks === "") {
    res.status(404).json({
      success: false,
      message: "resourceLinks not found",
    });
    return;
  }
  if (resourceLinks.length > cacheLength) {
    redisClient.set(cacheKey, JSON.stringify(resourceLinks));
    res.status(200).json({
      success: true,
      message: "resourceLinks found",
      data: resourceLinks,
    });
  }
  if (resourceLinks.length <= cacheLength) {
    redisClient.del(cacheKey);
    redisClient.set(cacheKey, JSON.stringify(resourceLinks));
    cache = await redisClient.get(cacheKey);

    res.status(200).json({
      success: true,
      message: "resourceLinks found",
      data: JSON.parse(cache),
    });
  }
});

const createResourceLink = asyncHandler(async (req, res, next) => {
  const resourceLink = await ResourceLink.create(req.body);
  if (resourceLink) {
    res.status(200).json({
      success: true,
      message: "resourceLink created successfully",
      data: resourceLink,
    });
  } else {
    res.status(404).json({ success: false, message: "internal server error" });
  }
});

const getResourceLink = asyncHandler(async (req, res, next) => {
  const { id: resourceLinkId } = req.params;
  const resourceLink = await ResourceLink.findOne({ _id: req.params.id });

  if (!resourceLink) {
    res
      .status(200)
      .json({ success: true, message: "resourceLinks not found " });
  } else {
    res
      .status(200)
      .json({
        success: true,
        message: "resourceLinks found ",
        data: resourceLink,
      });
  }
});

const updateResourceLink = asyncHandler(async (req, res, next) => {
  const resourceLink = await ResourceLink.findOne({ _id: req.params.id });
  if (resourceLink) {
    await ResourceLink.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).then(async (resourceLinks) => {
      if (resourceLinks) {
        await redisClient.del(cacheKey);
        const allResourceLinks = await ResourceLink.find({});
        await redisClient.set(cacheKey, JSON.stringify(allResourceLinks));
        res.status(200).json({
          success: true,
          message: `resourceLink updated successfully`,
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
      message: `No resourceLink found `,
    });
  }
});

const deleteResourceLink = asyncHandler(async (req, res, next) => {
  const resourceLink = await ResourceLink.findOne({ _id: req.params.id });
  if (resourceLink) {
    await ResourceLink.findByIdAndDelete(req.params.id).then(async () => {
      await redisClient.del(cacheKey);
      const allResourceLinks = await ResourceLink.find({});
      await redisClient.set(cacheKey, JSON.stringify(allResourceLinks));
      res.status(200).json({
        success: true,
        message: `Delete resourceLink `,
      });
    });
  } else {
    res.status(404).json({
      success: false,
      message: `resourceLink not found `,
    });
  }
});
const deleteallResourceLinks = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const resourceLinks = await ResourceLink.deleteMany({ _id: { $in: id } });
  if (resourceLinks) {
    res.status(200).json({
      success: true,
      message: "all resourceLinks deleted",
    });
  } else {
    res.status(200).json({
      success: false,
      message: "internal server error",
    });
  }
});
module.exports = {
  getResourceLinks,
  createResourceLink,
  getResourceLink,
  updateResourceLink,
  deleteResourceLink,
  deleteallResourceLinks,
};
