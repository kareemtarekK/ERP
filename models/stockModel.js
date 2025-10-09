const mongoose = require("mongoose");
const stockSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product id is requires"],
    },
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: [true, "inventory id id required"],
    },
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
      min: [0, "quantity can not be negative"],
    },
  },
  { timestamps: true }
);
stockSchema.index({ productId: 1, inventoryId: 1 }, { unique: true });
const Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;
