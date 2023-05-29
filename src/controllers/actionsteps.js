/* eslint-disable import/extensions */
const logger = require("../middleware/logger");
const ActionStep = require("../models/actionSteps");
const asyncHandler = require("../middleware/async");

const getactionSteps = asyncHandler(async (req, res, next) => {
  try {
    const actionsteps = await ActionStep.find({}).populate([
      "categoryId",
      "costId",
      "potentialId",
      "timescaleId",
      "weightId",
    ]);
    if (actionsteps && actionsteps.length > 0) {
      res.status(200).json({
        success: true,
        message: "get all actionsteps",
        data: actionsteps,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "no actionsteps found",
      });
    }
  } catch (error) {
    next(error);
  }
});

const createactionSteps = asyncHandler(async (req, res, next) => {
  try {
    const actionsteps = await ActionStep.create(req.body);
    if (actionsteps) {
      res.status(200).json({
        success: true,
        message: "actionstep created successfully",
        data: actionsteps,
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

const getactionStep = asyncHandler(async (req, res, next) => {
  try {
    const { id: actionstepId } = req.params;
    const actionstep = await ActionStep.findOne({
      _id: req.params.id,
    }).populate([
      "categoryId",
      "costId",
      "potentialId",
      "timescaleId",
      "weightId",
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
  } catch (error) {
    next(error);
  }
});

const updateactionSteps = asyncHandler(async (req, res, next) => {
  try {
    const actionstep = await ActionStep.findOne({ _id: req.params.id });
    if (actionstep) {
      await ActionStep.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).then(async (actionsteps) => {
        if (actionsteps) {
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
  } catch (error) {
    next(error);
  }
});

const deleteactionSteps = asyncHandler(async (req, res, next) => {
  try {
    const actionstep = await ActionStep.findOne({ _id: req.params.id });
    if (actionstep) {
      await ActionStep.findByIdAndDelete(req.params.id).then(async () => {
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
  } catch (error) {
    next(error);
  }
});

const getactionStepByUser = asyncHandler(async (req, res, next) => {
  try {
    const actionsteps = await ActionStep.findOne({
      userId: req.params.id,
    });
    if (actionsteps) {
      res.status(200).json({
        success: true,
        message: "actionsteps retrieved by user",
        data: actionsteps,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "actionsteps not found by user",
      });
    }
  } catch (error) {
    next(error);
  }
});

const getactionStepByCountry = asyncHandler(async (req, res, next) => {
  try {
    const query = new RegExp(req.params.country, "i");
    const actionsteps = await ActionStep.findOne({
      country: { $regex: query },
    });
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
  } catch (error) {
    next(error);
  }
});

const getactionStepByOrganization = asyncHandler(async (req, res, next) => {
  try {
    const query = new RegExp(req.params.organization, "i");
    const actionsteps = await ActionStep.findOne({
      organization: { $regex: query },
    });
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
  } catch (error) {
    next(error);
  }
});

const getactionStepBetweenDates = asyncHandler(async (req, res, next) => {
  try {
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
      });
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
  } catch (error) {
    next(error);
  }
});

const getactionStepByTitle = asyncHandler(async (req, res, next) => {
  try {
    const query = new RegExp(req.params.title, "i");
    const actionsteps = await ActionStep.find({
      title: { $regex: query },
    });
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
  } catch (error) {
    next(error);
  }
});

const getactionStepReport = asyncHandler(async (req, res, next) => {
  try {
    const actionsteps = await ActionStep.find({});
    const totalactionstep = actionsteps.length;
    let assignedCount = 0;
    let notStartCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let unAssignedCount = 0;
    let attemptCount = 0;
    actionsteps.forEach((element) => {
      if (element.status === "Not Started") {
        // eslint-disable-next-line no-plusplus
        notStartCount++;
      }
      if (element.status === "In Progress") {
        // eslint-disable-next-line no-plusplus
        inProgressCount++;
      }
      if (element.status === "Completed") {
        // eslint-disable-next-line no-plusplus
        completedCount++;
      }
      if (element.status === "Assigned") {
        // eslint-disable-next-line no-plusplus
        assignedCount++;
      }
      if (element.status === "Un Assigned") {
        // eslint-disable-next-line no-plusplus
        unAssignedCount++;
      }
      if (element.status === "Attempt") {
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
  } catch (error) {
    next(error);
  }
});

const getTotalPointsEarned = asyncHandler(async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});
const getactionStepAdminSummery = asyncHandler(async (req, res, next) => {
  try {
    const actionsteps = await ActionStep.find({});
    const totalactionstep = actionsteps.length;
    let assignedCount = 0;
    let notStartCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let unAssignedCount = 0;
    let attemptCount = 0;
    actionsteps.forEach((element) => {
      if (element.status === "Not Started") {
        // eslint-disable-next-line no-plusplus
        notStartCount++;
      }
      if (element.status === "In Progress") {
        // eslint-disable-next-line no-plusplus
        inProgressCount++;
      }
      if (element.status === "Completed") {
        // eslint-disable-next-line no-plusplus
        completedCount++;
      }
      if (element.status === "Assigned") {
        // eslint-disable-next-line no-plusplus
        assignedCount++;
      }
      if (element.status === "Un Assigned") {
        // eslint-disable-next-line no-plusplus
        unAssignedCount++;
      }
      if (element.status === "Attempt") {
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
  } catch (error) {
    next(error);
  }
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
};
