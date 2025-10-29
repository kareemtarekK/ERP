const mongoose = require("mongoose");
const saleOrderInvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: String,
    saleOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SaleOrder",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required"],
        },
        code: Number,
        quantity: Number,
        price: {
          type: Number,
          required: [true, "Product price is required"],
        },
        total: {
          type: Number,
        },
        tax: Number,
        inventory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: {
        values: ["paid", "unpaid", "paratial"],
        message: "payment status are from (paid , unpaid and paratial)",
      },
      default: "unpaid",
    },
    notes: String,
    totalPayment: Number,
    dueDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const SaleOrderInvoice = mongoose.model(
  "SaleOrderInvoice",
  saleOrderInvoiceSchema
);
module.exports = SaleOrderInvoice;
