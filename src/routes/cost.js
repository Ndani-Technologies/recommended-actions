/* eslint-disable import/extensions */
const express = require("express");

const CostRouter = express.Router();
const CostController = require("../controllers/cost");

CostRouter.route("/")
  .get(CostController.getCosts)
  .post(CostController.createCost);
CostRouter.route("/:id")
  .get(CostController.getCost)
  .patch(CostController.updateCost)
  .delete(CostController.deleteCost);

module.exports = CostRouter;
