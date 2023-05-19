const express = require("express");

const actionstepRouter = express.Router();
const actionstepController = require("../controllers/actionsteps");

actionstepRouter
  .route("/")
  .get(actionstepController.getactionSteps)
  .post(actionstepController.createactionSteps);
actionstepRouter
  .route("/:id")
  .get(actionstepController.getactionStep)
  .patch(actionstepController.updateactionSteps)
  .delete(actionstepController.deleteactionSteps);

module.exports = actionstepRouter;
