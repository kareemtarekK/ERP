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

const InvoicePayment = mongoose.model(
  "InvoicePayment",
  purchaseInvoicePaymentSchema
);

module.exports = InvoicePayment;
