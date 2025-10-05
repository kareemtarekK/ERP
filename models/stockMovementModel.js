const mongoose = require("mongoose");
const stockMovementSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "producr id required"],
    },
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: [true, "inventory id required"],
    },
    orderType: {
      type: String,
      enum: ["PurchaseOrder", "SalesOrder"],
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "orderType",
    },
    type: {
      type: String,
      enum: {
        values: ["IN", "OUT", "TRANSFER", "ADJUSTMENT"],
        message: "{VALUE} is not supported",
      },
      required: [true, "Please provide type of stock movement"],
    },
    oldQuantity: {
      type: Number,
      min: [0, "Quantity can not be negative"],
      default: 0,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    newQuantity: {
      type: Number,
      min: [0, "Quantity can not be negative"],
      default: 0,
    },
  },
  { timestamps: true }
);
const StockMovement = mongoose.model("StockMovement", stockMovementSchema);
module.exports = StockMovement;
