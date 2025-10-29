const express = require("express");
const {
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getAllPurchases,
  getpurchase,
  getAllDraft,
  markAsApproved,
  getAllApproved,
  getAllDelivered,
} = require("../controllers/purchaseOrderController");
const {
  checkDeliveredQuantity,
  stockIn,
} = require("./../controllers/stockController");
const {
  createInvoice,
} = require("../controllers/purchaseInvoiceController.js");
const router = express.Router();

router.get("/status=draft", getAllDraft);
router.get("/:purchaseOrderId/status=approved", markAsApproved);
router.get("/status=approved", getAllApproved);
router.patch(
  "/:purchaseOrderId/status=delivered",
  checkDeliveredQuantity,
  stockIn
);
router.get("/status=delivered", getAllDelivered);

router.post("/:purchaseOrder/invoice", createInvoice);

router.route("/").post(createPurchaseOrder).get(getAllPurchases);
router
  .route("/:purchaseOrderId")
  .get(getpurchase)
  .patch(updatePurchaseOrder)
  .delete(deletePurchaseOrder);

// router.get("/:purchaseOrderId/deliver", stockIn);

module.exports = router;
