const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("./../controllers/categoryController");
const categoryRouter = express();

categoryRouter.route("/").post(createCategory).get(getAllCategories);

categoryRouter
  .route("/:categoryId")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = categoryRouter;
