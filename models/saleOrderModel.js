const mongoose = require("mongoose");
const saleOrderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "select customer you want to sell to"],
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "select organization"],
    },
    invoiceNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "select product"],
        },
        name: {
          type: String,
          required: [true, "enter the name of product"],
          trim: true,
        },
        quantity: {
          type: Number,
          required: [true, "enter quantity"],
          min: 1,
        },
        price: {
          type: Number,
          required: [true, "enter price of the product"],
        },
        discount: Number,
        total: Number,
        inventoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inventory",
        },
      },
    ],
    expectedDeliveryDate: {
      type: Date,
      required: [true, "Expected delivery date is required"],
    },
    currency: String,
    status: {
      type: String,
      enum: ["draft", "approved", "shipped", "delivered", "canceled"],
      default: "draft",
    },
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "sale order must have a creator"],
    },
    totalAmount: Number,
  },
  { timestamps: true }
);

saleOrderSchema.pre("save", function (next) {
  this.products = this.products.map((item) => {
    item.total = item.quantity * item.price;
    item.total = item.total - (item.discount * item.total) / 100;
    return item;
  });
  this.totalAmount = this.products.reduce(
    (acc, current) => acc + current.total,
    0
  );
  const randomNum = Math.floor(Math.random() * 600000);
  this.invoiceNumber = `INV-${randomNum}-000`;
  next();
});

const SaleOrder = mongoose.model("SaleOrder", saleOrderSchema);
module.exports = SaleOrder;
