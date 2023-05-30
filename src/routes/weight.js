/* eslint-disable import/extensions */
const express = require("express");

const weightRouter = express.Router();
const weightController = require("../controllers/weight");

weightRouter
  .route("/")
  .get(weightController.getWeights)
  .post(weightController.createWeight);
weightRouter
  .route("/:id")
  .get(weightController.getWeight)
  .patch(weightController.updateWeight)
  .delete(weightController.deleteWeight);
weightRouter
  .route("/delete/deleteall")
  .delete(weightController.deleteallWeight);

module.exports = weightRouter;
