const mongoose = require("mongoose");
const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: String,
    purchaseOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseOrder",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
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
        code: String,
        deliveredQuantity: Number,
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
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
