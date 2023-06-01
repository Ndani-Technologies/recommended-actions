const mongoose = require("mongoose");

const AnswerRelationshipSchema = new mongoose.Schema({
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
AnswerRelationshipSchema.index({ title: 1 }, { unique: true });
const AnswerRelationship = mongoose.model(
  "answer_relationship",
  AnswerRelationshipSchema
);
module.exports = AnswerRelationship;
