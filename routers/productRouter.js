const express = require("express");
const { createProduct } = require("./../controllers/productController.js");
const productRouter = express.Router();

productRouter.route("/").post(createProduct).get(getAllProducts);

productRouter
  .route("/:productId")
  .patch(updateProduct)
  .get(getProduct)
  .delete(deleteProduct);

module.exports = productRouter;
