/* eslint-disable import/extensions */
const express = require("express");

const PotentialRouter = express.Router();
const PotentialController = require("../controllers/potential");

PotentialRouter.route("/")
  .get(PotentialController.getPotentials)
  .post(PotentialController.createPotential);
PotentialRouter.route("/:id")
  .get(PotentialController.getPotential)
  .patch(PotentialController.updatePotential)
  .delete(PotentialController.deletePotential);
PotentialRouter.route("/delete/deleteall").delete(
  PotentialController.deleteallPotential
);

module.exports = PotentialRouter;
