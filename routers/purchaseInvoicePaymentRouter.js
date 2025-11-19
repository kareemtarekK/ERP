const express = require("express");
const {
  createInvoicePayment,
  getAllPayedInstallments,
} = require("./../controllers/purchaseInvoicePaymentController");
const purchaseInvoicePaymentRouter = express.Router();

purchaseInvoicePaymentRouter.post("/:invoiceId/pay", createInvoicePayment);

purchaseInvoicePaymentRouter.route("/:invoiceId", getAllPayedInstallments);

module.exports = purchaseInvoicePaymentRouter;
