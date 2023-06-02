/* eslint-disable import/extensions */
const express = require("express");

const ResourceLinkRouter = express.Router();
const resourceLinkController = require("../controllers/resource_link");

ResourceLinkRouter.route("/")
  .get(resourceLinkController.getResourceLinks)
  .post(resourceLinkController.createResourceLink);
ResourceLinkRouter.route("/:id")
  .get(resourceLinkController.getResourceLink)
  .patch(resourceLinkController.updateResourceLink)
  .delete(resourceLinkController.deleteResourceLink);
ResourceLinkRouter.route("/delete/deleteall").delete(
  resourceLinkController.deleteallResourceLinks
);

module.exports = ResourceLinkRouter;
