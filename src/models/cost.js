const mongoose = require("mongoose");

const CostSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ["English", "Spanish", "Arabic", "French"],
    default: "English",
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
});

const Cost = mongoose.model("cost", CostSchema);
module.exports = Cost;
