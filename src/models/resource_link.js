const mongoose = require("mongoose");

const ResourceLinkSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ["English", "Spanish", "Arabic", "French"],
    default: "English",
  },
  linkText: {
    type: String,
  },
  linkUrl: {
    type: String,
  },
  target: {
    type: String,
  },
});
const ResourceLink = mongoose.model("resource_link", ResourceLinkSchema);
module.exports = ResourceLink;
