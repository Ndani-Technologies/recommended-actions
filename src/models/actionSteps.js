const mongoose = require("mongoose");

const ActionSteps = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      minlength: [3, "Title cannot be less than 3 characters"],
      max_length: [50, "Title cannot be more than 50 characters"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
    },
    score: {
      type: Number,
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "status",
      default: "Not Started",
    },
    feedback: {
      type: String,
    },
    assignedTo: [
      {
        type: Object,
      },
    ],
    organization: {
      type: String,
    },
    country: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    startdate: {
      type: Date,
      default: Date.now,
    },
    enddate: {
      type: Date,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    costId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cost",
    },
    potentialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "potential",
    },
    timescaleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "timescale",
    },
    answerRelationshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "answer_relationship",
    },
  },
  { timestamps: true }
);

ActionSteps.index({ title: 1 }, { unique: true });
const actionsteps = mongoose.model("actionSteps", ActionSteps);
module.exports = actionsteps;
