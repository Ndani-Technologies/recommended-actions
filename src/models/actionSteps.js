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
    status: {
      type: Boolean,
      default: true,
    },
    visibilty: {
      type: Boolean,
      default: true,
    },

    steps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Steps",
      },
    ],

    isCompleted: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
    },

    status_check: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "status",
    },
    feedback: {
      type: String,
    },
    assigned_user: [
      {
        userId: { type: String },

        attempted_steps: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Steps",
          },
        ],
      },
    ],
    organization: {
      type: String,
    },
    country: {
      type: String,
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
    resourcelinkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resource_link",
    },
  },
  { timestamps: true }
);

ActionSteps.index({ title: 1 }, { unique: true });
const actionsteps = mongoose.model("actionSteps", ActionSteps);
module.exports = actionsteps;
