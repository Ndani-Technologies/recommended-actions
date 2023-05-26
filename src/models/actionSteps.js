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
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Completed",
        "Assigned",
        "Un Assigned",
        "Attempt",
      ],
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
  },
  { timestamps: true }
);

ActionSteps.index({ title: 1 }, { unique: true });
const actionsteps = mongoose.model("actionSteps", ActionSteps);
module.exports = actionsteps;
