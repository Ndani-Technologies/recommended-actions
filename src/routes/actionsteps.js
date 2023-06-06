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
actionstepRouter
  .route("/delete/deleteall")
  .delete(actionstepController.deleteallactionsteps);
actionstepRouter
  .route("/filter/ByUser/:id")
  .get(actionstepController.getactionStepByUser);
actionstepRouter
  .route("/update/ByUser/:id")

  .patch(actionstepController.getactionUpdateByUser);

actionstepRouter
  .route("/filter/ByTitle/:title")
  .get(actionstepController.getactionStepByTitle);
actionstepRouter
  .route("/filter/ByCountry/:country")
  .get(actionstepController.getactionStepByCountry);
actionstepRouter
  .route("/filter/ByOrganization/:organization")
  .get(actionstepController.getactionStepByOrganization);
actionstepRouter
  .route("/filter/startdate/:startdate/enddate/:enddate")
  .get(actionstepController.getactionStepBetweenDates);
actionstepRouter
  .route("/report/actionsteps")
  .get(actionstepController.getactionStepReport);
actionstepRouter
  .route("/points/totalpoints")
  .get(actionstepController.getTotalPointsEarned);
actionstepRouter
  .route("/summery/adminSummery")
  .get(actionstepController.getactionStepAdminSummery);
actionstepRouter
  .route("/timesspend/byCategory")
  .get(actionstepController.getTimeSpendByCategory);
module.exports = actionstepRouter;
