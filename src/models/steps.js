const mongoose = require("mongoose");

const steps = new mongoose.Schema(
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
    score: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Steps = mongoose.model("Steps", steps);
module.exports = Steps;
