/* eslint-disable import/extensions */
const express = require("express");

const TimescaleRouter = express.Router();
const TimescaleController = require("../controllers/timescale");

TimescaleRouter.route("/")
  .get(TimescaleController.getTimescales)
  .post(TimescaleController.createTimescale);
TimescaleRouter.route("/:id")
  .get(TimescaleController.getTimescale)
  .patch(TimescaleController.updateTimescale)
  .delete(TimescaleController.deleteTimescale);

module.exports = TimescaleRouter;
