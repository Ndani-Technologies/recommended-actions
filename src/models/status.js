const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ["English", "Spanish", "Arabic", "French"],
    default: "English",
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
    unique: true,
  },
});
StatusSchema.index({ title: 1 }, { unique: true });
const Status = mongoose.model("status", StatusSchema);
module.exports = Status;
