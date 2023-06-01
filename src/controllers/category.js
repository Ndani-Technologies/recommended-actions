const { redisClient } = require("../middleware/redisClient");
const Category = require("../models/category");
const asyncHandler = require("../middleware/async");

const cacheKey = "CATEGORY";

const getCategories = asyncHandler(async (req, res, next) => {
  let cache = await redisClient.get(cacheKey);
  let cacheObj = "";
  let cacheLength = 0;
  if (cache != null) {
    cacheObj = JSON.parse(cache);
    cacheLength = Object.keys(cacheObj).length;
  } else {
    cacheLength = 0;
    cacheObj = "";
  }
  const categories = await Category.find({});
  if (categories === "") {
    res.status(404).json({
      success: false,
      message: "categories not found",
    });
    return;
  }
  if (categories.length > cacheLength) {
    redisClient.set(cacheKey, JSON.stringify(categories));
    res.status(200).json({
      success: true,
      message: "categories found",
      data: categories,
    });
  }
  if (categories.length <= cacheLength) {
    redisClient.del(cacheKey);
    redisClient.set(cacheKey, JSON.stringify(categories));
    cache = await redisClient.get(cacheKey);

    res.status(200).json({
      success: true,
      message: "categories found",
      data: JSON.parse(cache),
    });
  }
});

const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);
  if (category) {
    res.status(200).json({
      success: true,
      message: "category created successfully",
      data: category,
    });
  } else {
    res.status(404).json({ success: false, message: "internal server error" });
  }
});

const getCategory = asyncHandler(async (req, res, next) => {
  const { id: categoryId } = req.params;
  const category = await Category.findOne({ _id: req.params.id });

  if (!category) {
    res.status(200).json({ success: true, message: "categories not found " });
  } else {
    res
      .status(200)
      .json({ success: true, message: "categories found ", data: category });
  }
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ _id: req.params.id });
  if (category) {
    await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).then(async (categorys) => {
      if (categorys) {
        await redisClient.del(cacheKey);
        const allCategories = await Category.find({});
        await redisClient.set(cacheKey, JSON.stringify(allCategories));
        res.status(200).json({
          success: true,
          message: `category updated successfully`,
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
      message: `No category found `,
    });
  }
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ _id: req.params.id });
  if (category) {
    await Category.findByIdAndDelete(req.params.id).then(async () => {
      await redisClient.del(cacheKey);
      const allCategories = await Category.find({});
      await redisClient.set(cacheKey, JSON.stringify(allCategories));
      res.status(200).json({
        success: true,
        message: `Delete category `,
      });
    });
  } else {
    res.status(404).json({
      success: false,
      message: `category not found `,
    });
  }
});
const deleteallCategories = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const categories = await Category.deleteMany({ _id: { $in: id } });
  if (categories) {
    res.status(200).json({
      success: true,
      message: "all categories deleted",
    });
  } else {
    res.status(200).json({
      success: false,
      message: "internal server error",
    });
  }
});
module.exports = {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  deleteallCategories,
};
