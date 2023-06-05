/* eslint-disable import/extensions */
const express = require("express");

const relationshipRouter = express.Router();
const relationshipController = require("../controllers/relationship");

relationshipRouter
  .route("/")
  .get(relationshipController.getRelationships)
  .post(relationshipController.createRelationship);
relationshipRouter
  .route("/:id")
  .get(relationshipController.getRelationship)
  .patch(relationshipController.updateRelationship)
  .delete(relationshipController.deleteRelationship);
relationshipRouter
  .route("/delete/deleteall")
  .delete(relationshipController.deleteallRelationShips);
relationshipRouter
  .route("/getRelationships/ByQuestionId/:questionid/:answerid")
  .get(relationshipController.getRelationShipByQid);

module.exports = relationshipRouter;
