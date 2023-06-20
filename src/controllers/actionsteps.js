/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */

const { default: axios } = require("axios");
const mongoose = require("mongoose");

const { redisClient } = require("../middleware/redisClient");
const ActionStep = require("../models/actionSteps");
const Step = require("../models/steps");
const asyncHandler = require("../middleware/async");

const devenv = require("../configs/index");

const cacheKey = "ACTIONSTEP";

const getactionSteps = asyncHandler(async (req, res) => {
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
  const actionsteps = await ActionStep.find({}).populate([
    "categoryId",
    "costId",
    "potentialId",
    "timescaleId",
    "answerRelationshipId",
    "status",
    "steps",
    "resourcelinkId",
    {
      path: "assigned_user.attempted_steps",
      model: "Steps",
    },
  ]);
  if (actionsteps === "") {
    res.status(404).json({
      success: false,
      message: "actionsteps not found",
    });
    return;
  }
  if (actionsteps.length > cacheLength) {
    redisClient.set(cacheKey, JSON.stringify(actionsteps));
    res.status(200).json({
      success: true,
      message: "actionsteps found",
      data: actionsteps,
    });
  }
  if (actionsteps.length <= cacheLength) {
    redisClient.del(cacheKey);
    redisClient.set(cacheKey, JSON.stringify(actionsteps));
    cache = await redisClient.get(cacheKey);

    res.status(200).json({
      success: true,
      message: "actionsteps found",
      data: JSON.parse(cache),
    });
  }
});
const updateStepsByUser = asyncHandler(async (req, res) => {
  const actionsteps = await ActionStep.findById(req.params.raId);
  const { userId, steps } = req.body;
  let users = actionsteps.assigned_user;
  // eslint-disable-next-line prefer-const
  let userIndex = users.findIndex((user) => user.userId === userId);
  actionsteps.assigned_user[userIndex].attempted_steps = steps._id;
  steps.forEach(async (stepUpdate) => {
    const stepBody = {
      _id: stepUpdate._id,
      score: stepUpdate.score,
      status: stepUpdate.status,
      isCompleted: stepUpdate.isCompleted,
    };
    if (stepUpdate.isCompleted === true) {
      actionsteps.assigned_user[userIndex].step_score += stepUpdate.score;
    }
    if (Array.isArray(actionsteps.assigned_user[userIndex].attempted_steps)) {
      actionsteps.assigned_user[userIndex].attempted_steps.push(stepUpdate._id);
    } else {
      actionsteps.assigned_user[userIndex].attempted_steps = [stepUpdate._id];
    }
    await Step.findByIdAndUpdate(stepUpdate._id, { $set: stepBody });
  });
  const query = `${devenv.usermoduleUrl}${userId}`;
  const response = await axios.patch(query, {
    actionPoints: actionsteps.assigned_user[userIndex].step_score,
  });

  // eslint-disable-next-line camelcase
  const user = await axios.get(`${devenv.usermoduleUrl}${userId}`);
  const userBody = user.data.data;
  let recomendedActionCompleted = userBody.recomendedActionComplete;

  // eslint-disable-next-line no-plusplus
  recomendedActionCompleted++;
  // eslint-disable-next-line camelcase
  await axios.patch(`${devenv.usermoduleUrl}${userId}`, {
    recomendedActionComplete: recomendedActionCompleted,
  });
  await actionsteps.save();

  const actionStepsUpdate = await ActionStep.findOne({
    _id: actionsteps._id,
  }).populate([
    "categoryId",
    "costId",
    "potentialId",
    "timescaleId",
    "answerRelationshipId",
    "status",
    "steps",
    "resourcelinkId",
    {
      path: "assigned_user.attempted_steps",
      model: "Steps",
    },
  ]);
  res.status(200).json({
    success: true,
    message: "actionsteps updated",
    data: actionStepsUpdate,
  });
});
const createactionSteps = asyncHandler(async (req, res) => {
  const actionsteps = await ActionStep.create(req.body);
  if (actionsteps) {
    const actions = await ActionStep.findById(actionsteps._id).populate([
      "categoryId",
      "costId",
      "potentialId",
      "timescaleId",
      "answerRelationshipId",
      "status",
      "steps",
      "resourcelinkId",
      {
        path: "assigned_user.attempted_steps",
        model: "Steps",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "actionstep created successfully",
      data: actions,
    });
  } else {
    res.status(404).json({ success: false, message: "internal server error" });
  }
});

const getactionStep = asyncHandler(async (req, res) => {
  const { id: actionstepId } = req.params;
  const actionstep = await ActionStep.findOne({
    _id: actionstepId,
  }).populate([
    "categoryId",
    "costId",
    "potentialId",
    "timescaleId",
    "answerRelationshipId",
    "status",
    "steps",
    "resourcelinkId",
    {
      path: "assigned_user.attempted_steps",
      model: "Steps",
    },
  ]);

  if (!actionstep) {
    res.status(404).json({ success: false, message: "No action step Found" });
  } else {
    res.status(200).json({
      success: true,
      message: "actionstep found with given Id",
      data: actionstep,
    });
  }
});

const updateactionSteps = asyncHandler(async (req, res) => {
  const actionstep = await ActionStep.findOne({ _id: req.params.id });
  if (actionstep) {
    await ActionStep.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).then(async (actionsteps) => {
      if (actionsteps) {
        await redisClient.del(cacheKey);
        const allActionSteps = await ActionStep.find({}).populate([
          "categoryId",
          "costId",
          "potentialId",
          "timescaleId",
          "answerRelationshipId",
          "status",
          "steps",
          "resourcelinkId",
          {
            path: "assigned_user.attempted_steps",
            model: "Steps",
          },
        ]);
        await redisClient.set(cacheKey, JSON.stringify(allActionSteps));
        res.status(200).json({
          success: true,
          message: `actionstep updated successfully`,
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
      message: `No actionstep found`,
    });
  }
});

const deleteactionSteps = asyncHandler(async (req, res) => {
  const actionstep = await ActionStep.findOne({ _id: req.params.id });
  if (actionstep) {
    await ActionStep.findByIdAndDelete(req.params.id).then(async () => {
      await redisClient.del(cacheKey);
      const allActionSteps = await ActionStep.find({}).populate([
        "categoryId",
        "costId",
        "potentialId",
        "timescaleId",
        "answerRelationshipId",
        "status",
        "steps",
        "resourcelinkId",
        {
          path: "assigned_user.attempted_steps",
          model: "Steps",
        },
      ]);
      await redisClient.set(cacheKey, JSON.stringify(allActionSteps));
      res.status(200).json({
        success: true,
        message: `Delete actionstep successfully`,
      });
    });
  } else {
    res.status(404).json({
      success: false,
      message: `actionstep not found `,
    });
  }
});

const getactionUpdateByUser = asyncHandler(async (req, res) => {
  // eslint-disable-next-line camelcase
  const ra_id = req.params.id;
  const actionstep = await ActionStep.findById(ra_id);

  // eslint-disable-next-line camelcase
  const user_id = req.body.userId;
  // eslint-disable-next-line camelcase
  const user = await axios.get(`${devenv.usermoduleUrl}${user_id}`);
  const userBody = user.data.data;
  let recomendedActionAssign = userBody.recomendedActionAssigned;

  if (actionstep) {
    // eslint-disable-next-line camelcase
    const isUserExist = actionstep.assigned_user.some(
      // eslint-disable-next-line camelcase
      (e) => e.userId === user_id
    );
    if (isUserExist) {
      // eslint-disable-next-line camelcase
      await axios.patch(`${devenv.usermoduleUrl}${user_id}`, {
        recomendedActionAssigned: recomendedActionAssign,
      });

      res.status(200).json({
        success: true,
        message: "actionsteps updated by user",
        data: actionstep,
      });
    } else {
      // eslint-disable-next-line no-plusplus
      recomendedActionAssign++;
      // eslint-disable-next-line camelcase
      await axios.patch(`${devenv.usermoduleUrl}${user_id}`, {
        recomendedActionAssigned: recomendedActionAssign,
      });
      // eslint-disable-next-line camelcase
      actionstep.assigned_user.push({ userId: user_id, attempted_steps: [] });
      await actionstep.save();
      res.status(200).json({
        success: true,
        message: "actionsteps updated by user",
        data: actionstep,
      });
    }
  } else {
    res.status(200).json({
      success: true,
      message: "actionsteps not found",
      data: [],
    });
  }
});
const removeUserFromActionsteps = asyncHandler(async (req, res) => {
  const actionstep = await ActionStep.findById(req.params.id).populate([
    "categoryId",
    "costId",
    "potentialId",
    "timescaleId",
    "answerRelationshipId",
    "status",
    "steps",
    "resourcelinkId",
    {
      path: "assigned_user.attempted_steps",
      model: "Steps",
    },
  ]);

  if (!actionstep) {
    // Handle the case where the ActionStep is not found
    return res.status(404).json({ message: "ActionStep not found" });
  }

  const userIdToDelete = req.body.userId;

  // Find the index of the entry with the specified userId
  const indexToDelete = actionstep.assigned_user.findIndex(
    (user) => user.userId === userIdToDelete
  );

  // Remove the entry from the assigned_user array
  if (indexToDelete !== -1) {
    actionstep.assigned_user.splice(indexToDelete, 1);
  }

  // Save the updated ActionStep
  const updatedActionStep = await actionstep.save();
  res.status(200).json({
    success: true,
    message: "remove user from action steps",
    data: updatedActionStep,
  });
});

const getactionStepByUser = asyncHandler(async (req, res) => {
  const actionsteps = await ActionStep.find({
    "assigned_user.userId": req.params.id,
  }).populate([
    "categoryId",
    "costId",
    "potentialId",
    "timescaleId",
    "answerRelationshipId",
    "status",
    "steps",
    "resourcelinkId",
    {
      path: "assigned_user.attempted_steps",
      model: "Steps",
    },
  ]);
  if (actionsteps) {
    res.status(200).json({
      success: true,
      message: "actionsteps retrieved by user",
      data: actionsteps,
    });
  } else {
    res.status(404).json({
      success: true,
      data: [],
      message: "zero actions found",
    });
  }
});

const getactionStepByCountry = asyncHandler(async (req, res) => {
  const query = new RegExp(req.params.country, "i");
  const actionsteps = await ActionStep.findOne({
    country: { $regex: query },
  }).populate([
    "categoryId",
    "costId",
    "potentialId",
    "timescaleId",
    "answerRelationshipId",
    "status",
    "steps",
    "resourcelinkId",
    {
      path: "assigned_user.attempted_steps",
      model: "Steps",
    },
  ]);
  if (actionsteps) {
    res.status(200).json({
      success: true,
      message: "actionsteps retrieved by country",
      data: actionsteps,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "actionsteps not found by country",
    });
  }
});

const getactionStepByOrganization = asyncHandler(async (req, res) => {
  const query = new RegExp(req.params.organization, "i");
  const actionsteps = await ActionStep.findOne({
    organization: { $regex: query },
  }).populate([
    "categoryId",
    "costId",
    "potentialId",
    "timescaleId",
    "answerRelationshipId",
    "status",
    "steps",
    "resourcelinkId",
    {
      path: "assigned_user.attempted_steps",
      model: "Steps",
    },
  ]);
  if (actionsteps) {
    res.status(200).json({
      success: true,
      message: "actionsteps retrieved by organization",
      data: actionsteps,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "actionsteps not found by organization",
    });
  }
});

const getactionStepBetweenDates = asyncHandler(async (req, res) => {
  const startDate = new Date(req.params.startdate);
  const endDate = new Date(req.params.enddate);
  if (Number.isNaN(startDate) || Number.isNaN(endDate)) {
    res.status(500).json({
      success: true,
      message: "start date or end date must be filled",
    });
  } else {
    const actionsteps = await ActionStep.find({
      startdate: {
        $gte: startDate,
        $lte: endDate,
      },
      updatedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate([
      "categoryId",
      "costId",
      "potentialId",
      "timescaleId",
      "answerRelationshipId",
      "status",
      "steps",
      "resourcelinkId",
      {
        path: "assigned_user.attempted_steps",
        model: "Steps",
      },
    ]);
    if (actionsteps.length > 0) {
      res.status(500).json({
        message: "actionsteps retrieved",
        success: true,
        data: actionsteps,
      });
    } else {
      res.status(200).json({
        message: "actionsteps not retrieved",
        success: false,
      });
    }
  }
});

const getactionStepByTitle = asyncHandler(async (req, res) => {
  const query = new RegExp(req.params.title, "i");
  const actionsteps = await ActionStep.find({
    title: { $regex: query },
  }).populate([
    "categoryId",
    "costId",
    "potentialId",
    "timescaleId",
    "answerRelationshipId",
    "status",
    "steps",
    "resourcelinkId",
    {
      path: "assigned_user.attempted_steps",
      model: "Steps",
    },
  ]);
  if (actionsteps) {
    res.status(200).json({
      message: "actionsteps retrieved with Title",
      success: true,
      data: actionsteps,
    });
  } else {
    res.status(404).json({
      message: "actionsteps not found with title",
      success: false,
    });
  }
});

const getactionStepReport = asyncHandler(async (req, res) => {
  const actionsteps = await ActionStep.find({}).populate("status");
  const totalactionstep = actionsteps.length;
  let assignedCount = 0;
  let notStartCount = 0;
  let inProgressCount = 0;
  let completedCount = 0;
  let unAssignedCount = 0;
  let attemptCount = 0;
  actionsteps.forEach((element) => {
    if (element.status.title === "Not Started") {
      // eslint-disable-next-line no-plusplus
      notStartCount++;
    }
    if (element.status.title === "In Progress") {
      // eslint-disable-next-line no-plusplus
      inProgressCount++;
    }
    if (element.status.title === "Completed") {
      // eslint-disable-next-line no-plusplus
      completedCount++;
    }
    if (element.status.title === "Assigned") {
      // eslint-disable-next-line no-plusplus
      assignedCount++;
    }
    if (element.status.title === "Un Assigned") {
      // eslint-disable-next-line no-plusplus
      unAssignedCount++;
    }
    if (element.status.title === "Attempt") {
      // eslint-disable-next-line no-plusplus
      attemptCount++;
    }
  });
  const assignedPercentage = (assignedCount / totalactionstep) * 100;
  const notStartPercentage = (notStartCount / totalactionstep) * 100;
  const inProgressPercentage = (inProgressCount / totalactionstep) * 100;
  const completedPercentage = (completedCount / totalactionstep) * 100;
  const unAssignedPercentage = (unAssignedCount / totalactionstep) * 100;
  const attemptPercentage = (attemptCount / totalactionstep) * 100;

  const returnData = {
    totalactionstep,
    assignedCount,
    assignedPercentage,
    notStartCount,
    notStartPercentage,
    inProgressCount,
    inProgressPercentage,
    completedCount,
    completedPercentage,
    unAssignedCount,
    unAssignedPercentage,
    attemptCount,
    attemptPercentage,
  };
  res.status(200).json({
    success: true,
    message: "get all actionsteps with count",
    data: returnData,
  });
});

const getTotalPointsEarned = asyncHandler(async (req, res) => {
  const actionsteps = await ActionStep.find({}).populate("categoryId");
  if (actionsteps && actionsteps.length > 0) {
    let avoidCount = 0;
    let shiftCount = 0;
    let improveCount = 0;
    actionsteps.forEach((element) => {
      if (element.categoryId) {
        if (element.categoryId.title === "Avoid") {
          avoidCount += element.points;
        }
        if (element.categoryId.title === "Shift") {
          shiftCount += element.points;
        }
        if (element.categoryId.title === "Improve") {
          improveCount += element.points;
        }
      }
    });
    const totalPoints = avoidCount + improveCount + shiftCount;
    res.status(200).json({
      success: true,
      message: "total points of actionsteps found",
      data: [{ avoidCount, shiftCount, improveCount, totalPoints }],
    });
  } else {
    res.status(404).json({
      success: false,
      message: "total points of actionsteps not found",
    });
  }
});
const getactionStepAdminSummery = asyncHandler(async (req, res) => {
  const actionsteps = await ActionStep.find({}).populate("status");
  const totalactionstep = actionsteps.length;
  let assignedCount = 0;
  let notStartCount = 0;
  let inProgressCount = 0;
  let completedCount = 0;
  let unAssignedCount = 0;
  let attemptCount = 0;
  actionsteps.forEach((element) => {
    if (element.status.title === "Not Started") {
      // eslint-disable-next-line no-plusplus
      notStartCount++;
    }
    if (element.status.title === "In Progress") {
      // eslint-disable-next-line no-plusplus
      inProgressCount++;
    }
    if (element.status.title === "Completed") {
      // eslint-disable-next-line no-plusplus
      completedCount++;
    }
    if (element.status.title === "Assigned") {
      // eslint-disable-next-line no-plusplus
      assignedCount++;
    }
    if (element.status.title === "Un Assigned") {
      // eslint-disable-next-line no-plusplus
      unAssignedCount++;
    }
    if (element.status.title === "Attempt") {
      // eslint-disable-next-line no-plusplus
      attemptCount++;
    }
  });
  const assignedPercentage = (assignedCount / totalactionstep) * 100;
  const notStartPercentage = (notStartCount / totalactionstep) * 100;
  const inProgressPercentage = (inProgressCount / totalactionstep) * 100;
  const completedPercentage = (completedCount / totalactionstep) * 100;
  const unAssignedPercentage = (unAssignedCount / totalactionstep) * 100;
  const attemptPercentage = (attemptCount / totalactionstep) * 100;

  const returnData = {
    totalactionstep,
    assignedCount,
    assignedPercentage,
    notStartCount,
    notStartPercentage,
    inProgressCount,
    inProgressPercentage,
    completedCount,
    completedPercentage,
    unAssignedCount,
    unAssignedPercentage,
    attemptCount,
    attemptPercentage,
  };
  res.status(200).json({
    success: true,
    message: "get all actionsteps with count",
    data: returnData,
  });
});
const deleteallactionsteps = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const actionsteps = await ActionStep.deleteMany({ _id: { $in: id } });
  if (actionsteps) {
    res.status(200).json({
      success: true,
      message: "all actionsteps deleted",
    });
  } else {
    res.status(200).json({
      success: false,
      message: "internal server error",
    });
  }
});
const getTimeSpendByCategory = asyncHandler(async (req, res, next) => {
  const actionsteps = await ActionStep.find({}).populate("categoryId");
  let avoidTime = 0;
  let shiftTime = 0;
  let improveTime = 0;
  actionsteps.forEach((element) => {
    const { title } = element.categoryId;
    const startTime = element.startdate.getTime();
    const endTime = element.enddate ? element.enddate.getTime() : Date.now();
    const duration = endTime - startTime;
    if (title === "Avoid") {
      avoidTime += duration;
    } else if (title === "Shift") {
      shiftTime += duration;
    } else if (title === "Improve") {
      improveTime += duration;
    }
  });
  const avoidTimeHours = Math.floor(avoidTime / (1000 * 60 * 60));
  const avoidTimeMinutes = Math.floor(
    (avoidTime % (1000 * 60 * 60)) / (1000 * 60)
  );
  const shiftTimeHours = Math.floor(shiftTime / (1000 * 60 * 60));
  const shiftTimeMinutes = Math.floor(
    (shiftTime % (1000 * 60 * 60)) / (1000 * 60)
  );
  const improveTimeHours = Math.floor(improveTime / (1000 * 60 * 60));
  const improveTimeMinutes = Math.floor(
    (improveTime % (1000 * 60 * 60)) / (1000 * 60)
  );

  const totalHours = avoidTimeHours + shiftTimeHours + improveTimeHours;

  const totalDays = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;
  const avgHours = totalHours / actionsteps.length;

  const returnData = {
    avoidTime: {
      hours: avoidTimeHours,
      minutes: avoidTimeMinutes,
    },
    shiftTime: {
      hours: shiftTimeHours,
      minutes: shiftTimeMinutes,
    },
    improveTime: {
      hours: improveTimeHours,
      minutes: improveTimeMinutes,
    },
    totalDays,
    remainingHours,
    avgHours,
  };
  res.status(200).json({
    success: true,
    message: "Time spend by Category wise",
    data: returnData,
  });
});
module.exports = {
  getactionSteps,
  createactionSteps,
  getactionStep,
  updateactionSteps,
  deleteactionSteps,
  getactionStepByUser,
  getactionStepByCountry,
  getactionStepByOrganization,
  getactionStepBetweenDates,
  getactionStepByTitle,
  getactionStepReport,
  getTotalPointsEarned,
  getactionStepAdminSummery,
  deleteallactionsteps,
  getTimeSpendByCategory,
  getactionUpdateByUser,
  updateStepsByUser,
  removeUserFromActionsteps,
};
