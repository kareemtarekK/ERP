const mongoose = require("mongoose");
const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "enter inventory name"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "enter inventory location"],
      trim: true,
    },
    capacity: {
      type: Number,
      min: [0, "capacity can`t be negative"],
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
