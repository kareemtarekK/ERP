const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
} = require("./../controllers/productController.js");
const productRouter = express.Router();

productRouter.route("/").get(getAllProducts).post(createProduct);
productRouter.get("/search", searchProduct);

productRouter
  .route("/:productId")
  .patch(updateProduct)
  .get(getProduct)
  .delete(deleteProduct);

module.exports = productRouter;
