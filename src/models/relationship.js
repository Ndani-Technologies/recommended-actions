const mongoose = require("mongoose");

const RelationShips = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: Boolean,
      default: false,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    answerId: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    answerRelationshipId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    recomendedActionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "actionSteps",
    },
  },
  { timestamps: true }
);

const relationship = mongoose.model("relationship", RelationShips);
module.exports = relationship;
