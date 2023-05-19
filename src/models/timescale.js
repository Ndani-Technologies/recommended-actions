const mongoose = require("mongoose");

const TimescaleSchema = new mongoose.Schema({
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

const Timescale = mongoose.model("timescale", TimescaleSchema);
module.exports = Timescale;
