const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  allProductsForCategory,
} = require("./../controllers/productController.js");
const productRouter = express.Router();

productRouter.route("/").get(getAllProducts).post(createProduct);
productRouter.get("/search", searchProduct);
productRouter.get("/:categoryId/products", allProductsForCategory);
productRouter
  .route("/:productId")
  .patch(updateProduct)
  .get(getProduct)
  .delete(deleteProduct);

productRouter.get("/:categoryId/products", allProductsForCategory);

module.exports = productRouter;
