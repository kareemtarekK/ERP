const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("./../controllers/productController.js");
const productRouter = express.Router();

productRouter.route("/").get(getAllProducts).post(createProduct);

productRouter
  .route("/:productId")
  .patch(updateProduct)
  .get(getProduct)
  .delete(deleteProduct);

module.exports = productRouter;
