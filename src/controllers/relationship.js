/* eslint-disable import/extensions */
const { default: axios } = require("axios");
const logger = require("../middleware/logger");

const { redisClient } = require("../middleware/redisClient");
const RelationShip = require("../models/relationship");
const asyncHandler = require("../middleware/async");

const cacheKey = "RELATIONSHIP";

const getRelationships = asyncHandler(async (req, res, next) => {
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
        // {
        //   path: "answerRelationshipId",
        //   model: "AnswerRelationship",
        //   // select: 'language includeExplanation answerAttempt'
        // },
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
});

// const createRelationship = asyncHandler(async (req, res, next) => {
//   const { status,
//     visibility,
//     qid,
//     aid,
//     answerRelationshipId,
//     recomendedActionId } = req.body
//     let question = await axios.get(`${process.env.QUESTION_URL}/${qid}`)
//     let answers = question.data.data.answerOptions.filter((answer)=>{
//       if(answer._id === aid) return answer;
//     })
//     question.answerOptions = answers;
//     let body = {
//       status,
//     visibility,
//     qid: question,
//     answerRelationshipId,
//     recomendedActionId
//   }
//   const relationship = await RelationShip.create(body);
//   if (relationship) {
//     res.status(200).json({
//       success: true,
//       message: "relationship created successfully",
//       data: relationship,
//     });
//   } else {
//     res.status(404).json({ success: false, message: "internal server error" });
//   }
// });

const createRelationship = asyncHandler(async (req, res, next) => {
  const {
    status,
    visibility,
    qid,
    aid,
    answerRelationshipId,
    recomendedActionId,
  } = req.body;

  try {
    const questionResponse = await axios.get(
      `${process.env.QUESTION_URL}/${qid}`
    );
    const question = questionResponse.data.data;
    const answers = [];
    aid.forEach((element) => {
      question.answerOptions.forEach((answer) => {
        if (answer._id === element) answers.push(answer);
      });
    });
    question.answerOptions = answers;
    const relationship = await RelationShip.create({
      status,
      visibility,
      qid: question,
      answerRelationshipId,
      recomendedActionId,
    });
    const relationshipPopulate = await RelationShip.findById(relationship._id)
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
            path: "answerRelationshipId",
            model: "AnswerRelationship",
            // select: 'language includeExplanation answerAttempt'
          },
        ],
      });

    if (relationship) {
      res.status(200).json({
        success: true,
        message: "Relationship created successfully",
        data: relationshipPopulate,
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Internal server error" });
    }
  } catch (error) {
    // Handle any error that occurred during the process
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const getRelationship = asyncHandler(async (req, res, next) => {
  const { id: relationshipId } = req.params;
  const relationship = await RelationShip.findOne({ _id: req.params.id });

  if (relationship && relationship.length <= 0) {
    res.status(404).json({ success: true, message: "relationship not found " });
  } else {
    res.status(200).json({
      success: true,
      message: "relationship found ",
      data: relationship,
    });
  }
});

const updateRelationship = asyncHandler(async (req, res, next) => {
  const relationship = await RelationShip.findOne({ _id: req.params.id });
  const {
    status,
    visibility,
    qid,
    aid,
    answerRelationshipId,
    recomendedActionId,
  } = req.body;
  const questionResponse = await axios.get(
    `${process.env.QUESTION_URL}/${qid}`
  );
  const question = questionResponse.data.data;
  const answers = [];
  aid.forEach((element) => {
    question.answerOptions.forEach((answer) => {
      if (answer._id === element) answers.push(answer);
    });
  });
  question.answerOptions = answers;
  const reqBody = {
    status,
    visibility,
    qid: question,
    answerRelationshipId,
    recomendedActionId,
  };
  if (relationship) {
    await RelationShip.findByIdAndUpdate(
      req.params.id,
      { $set: reqBody },
      { new: true }
    ).then(async (relationships) => {
      if (relationships) {
        await redisClient.del(cacheKey);
        const allRelationships = await RelationShip.findOne({
          _id: relationship._id,
        })
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
            ],
          });
        await redisClient.set(cacheKey, JSON.stringify(allRelationships));
        res.status(200).json({
          success: true,
          message: `relationship updated successfully`,
          data: allRelationships,
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
});

const deleteRelationship = asyncHandler(async (req, res, next) => {
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
});
const deleteallRelationShips = asyncHandler(async (req, res, next) => {
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
});
const getRelationShipByQid = asyncHandler(async (req, res, next) => {
  const { questionid } = req.params;
  const { answerid } = req.params;
  const relationship = await RelationShip.find({ "qid._id": questionid });
  const returnData = [];
  if (relationship && relationship.length <= 0) {
    res.status(404).json({
      success: true,
      message: "relationship not found ",
    });
  } else {
    relationship.forEach((element) => {
      element.qid.answerOptions.forEach((innerElement) => {
        if (innerElement._id && innerElement._id === answerid) {
          returnData.push(element);
        }
      });
    });
    res.status(200).json({
      success: true,
      message: "relationship found ",
      data: returnData,
    });
  }
});
module.exports = {
  getRelationships,
  createRelationship,
  getRelationship,
  updateRelationship,
  deleteRelationship,
  deleteallRelationShips,
  getRelationShipByQid,
};
