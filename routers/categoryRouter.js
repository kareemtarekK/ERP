const express = require("express");
const categoryRouter = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("./../controllers/categoryController");
categoryRouter.route("/").post(createCategory).get(getAllCategories);
categoryRouter
  .route("/:categoryId")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);
module.exports = categoryRouter;
