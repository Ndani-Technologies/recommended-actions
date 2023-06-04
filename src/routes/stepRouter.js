/* eslint-disable import/extensions */
const express = require("express");

const StepRouter = express.Router();
const stepController = require("../controllers/steps");

StepRouter.route("/")
  .get(stepController.getSteps)
  .post(stepController.createStep);
StepRouter.route("/:id")
  .get(stepController.getStep)
  .patch(stepController.updateStep)
  .delete(stepController.deleteStep);
StepRouter.route("/delete/deleteall").delete(stepController.deleteallSteps);

module.exports = StepRouter;
