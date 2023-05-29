const mongoose = require("mongoose");

const RelationShips = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: false,
    },
    assignmentType: {
      type: Boolean,
      default: false,
    },
    answerRelation: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    selectCondition: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    counter: {
      type: Number,
      default: 0,
    },
    recomendedActionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "actionSteps",
    },
    Benchmarks_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

RelationShips.index({ title: 1 }, { unique: true });
const relationship = mongoose.model("realtionship", RelationShips);
module.exports = relationship;
