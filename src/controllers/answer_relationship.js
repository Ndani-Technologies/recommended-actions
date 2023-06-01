const { redisClient } = require("../middleware/redisClient");
const AnswerRelationship = require("../models/answer_relationship");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/error-response");

const cacheKey = "ANSWER_RELATIONSHIP";

const getAnswerRelationships = asyncHandler(async (req, res, next) => {
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
  const answerRelationships = await AnswerRelationship.find({});
  if (answerRelationships === "") {
    res.status(404).json({
      success: false,
      message: "answerRelationships not found",
    });
    return;
  }
  if (answerRelationships.length > cacheLength) {
    redisClient.set(cacheKey, JSON.stringify(answerRelationships));
    res.status(200).json({
      success: true,
      message: "answerRelationships found",
      data: answerRelationships,
    });
  }
  if (answerRelationships.length <= cacheLength) {
    redisClient.del(cacheKey);
    redisClient.set(cacheKey, JSON.stringify(answerRelationships));
    cache = await redisClient.get(cacheKey);

    res.status(200).json({
      success: true,
      message: "answerRelationships found",
      data: JSON.parse(cache),
    });
  }
});

const createAnswerRelationship = asyncHandler(async (req, res, next) => {
  const answerRelationship = await AnswerRelationship.create(req.body);
  if (answerRelationship) {
    res.status(200).json({
      success: true,
      data: answerRelationship,
      message: "answerRelationship created successfully",
    });
  } else {
    res.status(404).json({ success: false, message: "internal server error" });
  }
});

const getAnswerRelationship = asyncHandler(async (req, res, next) => {
  const { id: answerRelationshipId } = req.params;
  const answerRelationship = await AnswerRelationship.findOne({
    _id: req.params.id,
  });

  if (!answerRelationship) {
    res
      .status(404)
      .json({ success: false, message: "answerRelationship not found" });
  } else {
    res
      .status(200)
      .json({
        success: true,
        message: "answerRelationship found",
        data: answerRelationship,
      });
  }
});

const updateAnswerRelationship = asyncHandler(async (req, res, next) => {
  const answerRelationship = await AnswerRelationship.findOne({
    _id: req.params.id,
  });
  if (answerRelationship) {
    await AnswerRelationship.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).then(async (answerRelationships) => {
      if (answerRelationships) {
        await redisClient.del(cacheKey);
        const allAnswerRelationships = await AnswerRelationship.find({});
        await redisClient.set(cacheKey, JSON.stringify(allAnswerRelationships));
        res.status(200).json({
          success: true,
          message: `answerRelationship updated `,
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
      message: `No answerRelationship found `,
    });
  }
});

const deleteAnswerRelationship = asyncHandler(async (req, res, next) => {
  const answerRelationship = await AnswerRelationship.findOne({
    _id: req.params.id,
  });
  if (answerRelationship) {
    await AnswerRelationship.findByIdAndDelete(req.params.id).then(async () => {
      await redisClient.del(cacheKey);
      const allAnswerRelationships = await AnswerRelationship.find({});
      await redisClient.set(cacheKey, JSON.stringify(allAnswerRelationships));
      res.status(200).json({
        success: true,
        message: `Delete answerRelationship `,
      });
    });
  } else {
    res.status(404).json({
      success: false,
      message: `answerRelationship not found `,
    });
  }
});
const deleteallAnswerRelationship = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const answerRelationships = await AnswerRelationship.deleteMany({
    _id: { $in: id },
  });
  if (answerRelationships) {
    res.status(200).json({
      success: true,
      message: "all answerRelationships deleted",
    });
  } else {
    res.status(200).json({
      success: false,
      message: "internal server error",
    });
  }
});
module.exports = {
  getAnswerRelationships,
  createAnswerRelationship,
  getAnswerRelationship,
  updateAnswerRelationship,
  deleteAnswerRelationship,
  deleteallAnswerRelationship,
};
