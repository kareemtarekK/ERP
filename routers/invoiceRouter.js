const express = require("express");
const {
  createInvoice,
  getAllInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
} = require("./../controllers/invoiceController");
const router = express();
router.post("/:purchaseOrderId", createInvoice);

router.route("/:purchaseOrderId").get(getAllInvoices);

router
  .route("/:invoiceId")
  .get(getInvoice)
  .patch(updateInvoice)
  .delete(deleteInvoice);

module.exports = router;
