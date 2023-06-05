const mongoose = require("mongoose");

const RelationShips = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: true,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Object,
    },
    qid: {
      type: Object,
    },
    answerRelationshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "answer_relationship",
    },
    recomendedActionId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "actionSteps",
      },
    ],
    assignmentType: {
      type: String,
      default: "Automatic",
    },
  },
  { timestamps: true }
);

const relationship = mongoose.model("relationship", RelationShips);
module.exports = relationship;
