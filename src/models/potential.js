const mongoose = require("mongoose");

const PotentialSchema = new mongoose.Schema({
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
PotentialSchema.index({ title: 1 }, { unique: true });
const Potential = mongoose.model("potential", PotentialSchema);
module.exports = Potential;
