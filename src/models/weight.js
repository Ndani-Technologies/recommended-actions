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
    unique: true,
  },
});
WeightSchema.index({ title: 1 }, { unique: true });
const Weight = mongoose.model("weight", WeightSchema);
module.exports = Weight;
