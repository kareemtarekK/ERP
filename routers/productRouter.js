const express = require("express");
const upload = require("./../controllers/upload.js");
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

productRouter
  .route("/")
  .get(getAllProducts)
  .post(upload.array("img"), createProduct);
productRouter.get("/search", searchProduct);
productRouter.get("/:categoryId/products", allProductsForCategory);
productRouter
  .route("/:productId")
  .patch(updateProduct)
  .get(getProduct)
  .delete(deleteProduct);

productRouter.get("/:categoryId/products", allProductsForCategory);

module.exports = productRouter;
