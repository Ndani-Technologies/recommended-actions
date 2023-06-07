const mongoose = require("mongoose");

const ResourceLinkSchema = new mongoose.Schema({
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
const Category = mongoose.model("resource_link", ResourceLinkSchema);
module.exports = Category;
