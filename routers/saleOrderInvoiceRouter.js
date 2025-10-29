const express = require("express");
const {
  createSaleOrderInvoice,
  getAllSaleOrderInvoices,
  getSaleOrderInvoice,
  updateSaleOrderInvoice,
  deleteSaleOrderInvoice,
} = require("../controllers/saleOrderInvoiceController");
const router = express();

router.post("/:saleOrderId", createSaleOrderInvoice);

router.route("/").get(getAllSaleOrderInvoices);

router
  .route("/:invoiceId")
  .get(getSaleOrderInvoice)
  .patch(updateSaleOrderInvoice)
  .delete(deleteSaleOrderInvoice);

module.exports = router;
