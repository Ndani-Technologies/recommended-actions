const { redisClient } = require("../middleware/redisClient");
const Potential = require("../models/potential");
const asyncHandler = require("../middleware/async");

const cacheKey = "POTENTIAL";

const getPotentials = asyncHandler(async (req, res, next) => {
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
  const potentials = await Potential.find({});
  if (potentials === "") {
    res.status(404).json({
      success: false,
      message: "potentials not found",
    });
    return;
  }
  if (potentials.length > cacheLength) {
    redisClient.set(cacheKey, JSON.stringify(potentials));
    res.status(200).json({
      success: true,
      message: "potentials found",
      data: potentials,
    });
  }
  if (potentials.length <= cacheLength) {
    redisClient.del(cacheKey);
    redisClient.set(cacheKey, JSON.stringify(potentials));
    cache = await redisClient.get(cacheKey);

    res.status(200).json({
      success: true,
      message: "potentials found",
      data: JSON.parse(cache),
    });
  }
});

const createPotential = asyncHandler(async (req, res, next) => {
  const potential = await Potential.create(req.body);
  if (potential) {
    res.status(200).json({
      success: true,
      data: potential,
      message: "potential created successfully",
    });
  } else {
    res.status(404).json({ success: false, message: "internal server error" });
  }
});

const getPotential = asyncHandler(async (req, res, next) => {
  const { id: potentialId } = req.params;
  const potential = await Potential.findOne({ _id: req.params.id });

  if (!potential) {
    res.status(404).json({ success: false, message: "No potential found" });
  } else {
    res
      .status(200)
      .json({ success: true, message: "Potential found", data: potential });
  }
});

const updatePotential = asyncHandler(async (req, res, next) => {
  const potential = await Potential.findOne({ _id: req.params.id });
  if (potential) {
    await Potential.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).then(async (potentials) => {
      if (potentials) {
        await redisClient.del(cacheKey);
        const allPotentials = await Potential.find({});
        await redisClient.set(cacheKey, JSON.stringify(allPotentials));
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
});

const deletePotential = asyncHandler(async (req, res, next) => {
  const potential = await Potential.findOne({ _id: req.params.id });
  if (potential) {
    await Potential.findByIdAndDelete(req.params.id).then(async () => {
      await redisClient.del(cacheKey);
      const allPotentials = await Potential.find({});
      await redisClient.set(cacheKey, JSON.stringify(allPotentials));
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
});
const deleteallPotential = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const potentials = await Potential.deleteMany({ _id: { $in: id } });
  if (potentials) {
    res.status(200).json({
      success: true,
      message: "all potentials deleted",
    });
  } else {
    res.status(200).json({
      success: false,
      message: "internal server error",
    });
  }
});
module.exports = {
  getPotentials,
  createPotential,
  getPotential,
  updatePotential,
  deletePotential,
  deleteallPotential,
};
