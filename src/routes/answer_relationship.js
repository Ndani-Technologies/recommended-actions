/* eslint-disable import/extensions */
const express = require("express");

const answerRelationshipRouter = express.Router();
const answerRelationshipController = require("../controllers/answer_relationship");

answerRelationshipRouter
  .route("/")
  .get(answerRelationshipController.getAnswerRelationships)
  .post(answerRelationshipController.createAnswerRelationship);
answerRelationshipRouter
  .route("/:id")
  .get(answerRelationshipController.getAnswerRelationship)
  .patch(answerRelationshipController.updateAnswerRelationship)
  .delete(answerRelationshipController.deleteAnswerRelationship);
answerRelationshipRouter
  .route("/delete/deleteall")
  .delete(answerRelationshipController.deleteallAnswerRelationship);

module.exports = answerRelationshipRouter;
