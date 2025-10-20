const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("./../controllers/categorycontroller");
const categoryRouter = express.Router();

categoryRouter.route("/").post(createCategory).get(getAllCategories);
categoryRouter
  .route("/:categoryId")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);
module.exports = categoryRouter;
