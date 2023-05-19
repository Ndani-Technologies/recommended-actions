/* eslint-disable import/extensions */
const logger = require("../middleware/logger");
const Category = require("../models/category");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/error-response");

const getCategories = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.find({});
    res
      .status(200)
      .json({ success: true, message: "categories retrieved", data: category });
    logger.info(`get all category`);
  } catch (error) {
    next(error);
  }
});

const createCategory = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    if (category) {
      res.status(200).json({
        success: true,
        message: "category created successfully",
        data: category,
      });
      logger.info(`category created`);
    } else {
      res
        .status(404)
        .json({ success: false, message: "internal server error" });
      logger.info(`category not created`);
    }
  } catch (error) {
    next(error);
  }
});

const getCategory = asyncHandler(async (req, res, next) => {
  try {
    const { id: categoryId } = req.params;
    const category = await Category.findOne({ _id: req.params.id });

    if (!category) {
      logger.info(`category not found with id ${categoryId}`);
      res.status(200).json({ success: true, message: "categories not found " });
    } else {
      logger.info(`category found with id ${categoryId}`);
      res
        .status(200)
        .json({ success: true, message: "categories found ", data: category });
    }
  } catch (error) {
    next(error);
  }
});

const updateCategory = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    if (category) {
      await Category.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).then(async (categorys) => {
        if (categorys) {
          res.status(200).json({
            success: true,
            message: `category updated with id ${req.params.id}`,
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
        message: `No category found with id ${req.params.id}`,
      });
    }
  } catch (error) {
    next(error);
  }
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    if (category) {
      await Category.findByIdAndDelete(req.params.id).then(async () => {
        res.status(200).json({
          success: true,
          message: `Delete category with id ${req.params.id}`,
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: `category not found with id ${req.params.id}`,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
