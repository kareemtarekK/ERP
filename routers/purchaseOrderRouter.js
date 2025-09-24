const express = require("express");
const {
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
} = require("../controllers/purchaseOrderController");
const router = express.Router();
router.post("/", createPurchaseOrder);
router
  .route("/:purchaseOrderId")
  .patch(updatePurchaseOrder)
  .delete(deletePurchaseOrder);
module.exports = router;
