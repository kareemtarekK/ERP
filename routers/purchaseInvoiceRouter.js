const express = require("express");
const {
  createInvoice,
  getAllInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/purchaseInvoiceController");
const router = express();
router.post("/:purchaseOrderId", createInvoice);

router.route("/").get(getAllInvoices);

router
  .route("/:invoiceId")
  .get(getInvoice)
  .patch(updateInvoice)
  .delete(deleteInvoice);

module.exports = router;
