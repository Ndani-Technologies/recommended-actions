/* eslint-disable import/extensions */
const express = require("express");

const StatusRouter = express.Router();
const statusController = require("../controllers/status");

StatusRouter.route("/")
  .get(statusController.getStatus)
  .post(statusController.createStatus);
StatusRouter.route("/:id")
  .get(statusController.getStatusById)
  .patch(statusController.updateStatus)
  .delete(statusController.deleteStatus);
StatusRouter.route("/delete/deleteall").delete(
  statusController.deleteallStatus
);

module.exports = StatusRouter;
