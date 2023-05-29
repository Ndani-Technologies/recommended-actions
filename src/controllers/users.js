/* eslint-disable import/extensions */
const logger = require("../middleware/logger");
const User = require("../models/users");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/error-response");

const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find({});
    res
      .status(200)
      .json({ success: true, message: "all users retrieved", data: users });
  } catch (error) {
    next(error);
  }
});

const createUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    if (user) {
      res.status(200).json({
        success: true,
        data: user,
        message: "user created successfully",
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "internal server error" });
    }
  } catch (error) {
    next(error);
  }
});

const getUser = asyncHandler(async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      res.status(404).json({ success: false, message: "no user found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "user found", data: user });
    }
  } catch (error) {
    next(error);
  }
});

const updateUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
      await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).then(async (users) => {
        if (users) {
          res.status(200).json({
            success: true,
            message: `user updated`,
          });
        } else {
          res
            .status(404)
            .json({ success: false, message: `internal server error` });
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No user found `,
      });
    }
  } catch (error) {
    next(error);
  }
});

const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (user) {
      await User.findByIdAndDelete(req.params.id).then(async () => {
        res.status(200).json({
          success: true,
          message: `Delete user `,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `User not found `,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { getUsers, createUser, getUser, updateUser, deleteUser };
