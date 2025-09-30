const express = require("express");
const {
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getAllPurchases,
  getpurchase,
} = require("../controllers/purchaseOrderController");
const { stockIn } = require("../controllers/stockController");
const router = express.Router();
router.route("/").post(createPurchaseOrder).get(getAllPurchases);
router
  .route("/:purchaseOrderId")
  .get(getpurchase)
  .patch(updatePurchaseOrder)
  .delete(deletePurchaseOrder);

// router.get("/:purchaseOrderId/deliver", stockIn);
module.exports = router;
