const express = require("express");
const {
  createPurchaseOrder,
  getAllPurchases,
  getpurchase,
} = require("./../controllers/purchaseOrderController");
const purchaseRouter = express.Router();
purchaseRouter.route("/").post(createPurchaseOrder).get(getAllPurchases);
purchaseRouter.route("/:purchaseId").get(getpurchase);

module.exports = purchaseRouter;
