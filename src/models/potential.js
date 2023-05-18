import mongoose from "mongoose";

const PotentialSchema = new mongoose.Schema({
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

export default mongoose.model("potential", PotentialSchema);
