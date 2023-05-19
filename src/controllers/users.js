/* eslint-disable import/extensions */
const logger = require("../middleware/logger");
const User = require("../models/users");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/error-response");

const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
    logger.info(`get all users`);
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
      logger.info(`User created`);
    } else {
      res
        .status(404)
        .json({ success: false, message: "internal server error" });
      logger.info(`User not created`);
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
      logger.info(`User not found with id ${userId}`);
      next(new ErrorResponse(`No user with id ${userId}`, 404));
    } else {
      logger.info(`User found with id ${userId}`);
      res.status(200).json({ success: true, data: user });
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
            message: `user updated with id ${req.params.id}`,
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
        message: `No user found with id ${req.params.id}`,
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
          message: `Delete user with id ${req.params.id}`,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `User not found with id ${req.params.id}`,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = { getUsers, createUser, getUser, updateUser, deleteUser };
