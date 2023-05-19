const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minlength: [3, "Name cannot be less than 3 characters"],
    max_length: [50, "Name cannot be more than 50 characters"],
    trim: true,
  },
  email: {
    type: String,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please provide a valid email",
    ],
    required: [true, "Please provide an email"],
    unique: true,
    trim: true,
  },
});

const User = mongoose.model("users", UserSchema);

module.exports = User;
