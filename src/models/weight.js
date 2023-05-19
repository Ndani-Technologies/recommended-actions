const mongoose = require("mongoose");

const WeightSchema = new mongoose.Schema({
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

const Weight = mongoose.model("weight", WeightSchema);
module.exports = Weight;
