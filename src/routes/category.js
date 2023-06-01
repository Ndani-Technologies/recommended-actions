/* eslint-disable import/extensions */
const express = require("express");

const CategoryRouter = express.Router();
const categoryController = require("../controllers/category");

CategoryRouter.route("/")
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);
CategoryRouter.route("/:id")
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);
CategoryRouter.route("/delete/deleteall").delete(
  categoryController.deleteallCategories
);

module.exports = CategoryRouter;
