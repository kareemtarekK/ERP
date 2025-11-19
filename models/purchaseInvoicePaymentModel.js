const mongoose = require("mongoose");
const purchaseInvoicePaymentSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseInvoice",
    },
    amount: Number,
    remainingAmount: Number,
  },
  { timestamps: true }
);

const PurchaseInvoicePayment = mongoose.model(
  "PurchaseInvoicePayment",
  purchaseInvoicePaymentSchema
);

module.exports = PurchaseInvoicePayment;
