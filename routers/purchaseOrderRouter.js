const express = require("express");
const {
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getAllPurchases,
  getpurchase,
} = require("../controllers/purchaseOrderController");
const router = express.Router();
router.route("/").post(createPurchaseOrder).get(getAllPurchases);
router
  .route("/:purchaseOrderId")
  .get(getpurchase)
  .patch(updatePurchaseOrder)
  .delete(deletePurchaseOrder);
module.exports = router;
