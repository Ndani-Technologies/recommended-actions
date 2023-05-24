const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
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
CategorySchema.index({ title: 1 }, { unique: true });
const Category = mongoose.model("category", CategorySchema);
module.exports = Category;
