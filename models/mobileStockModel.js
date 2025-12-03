const mongoose = require("mongoose");
const Stock = require("./../models/stockModel");
const Inventory = require("./../models/inventoryModel");
const mobileStockSchema = new mongoose.Schema(
  {
    representative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Representative",
      required: [true, "provide representative"],
    },
    goods: [
      {
        stock: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Stock",
        },
        quantity: Number,
      },
    ],
    capacity: Number,
    name: {
      type: String,
      required: [true, "provide name of mobile stock"],
    },
  },
  { timestamps: true }
);

mobileStockSchema.pre("save", async function (next) {
  const { goods } = this;
  await Promise.all(
    goods.map(async (product) => {
      const stock = await Stock.findById(product.stock);
      const inventory = await Inventory.findById(stock.inventoryId);
      stock.quantity -= product.quantity;
      inventory.capacity += product.quantity;
      this.capacity -= product.quantity;
      await stock.save({ validateBeforeSave: false });
      await inventory.save({ validateBeforeSave: false });
    })
  );
  next();
});

const MobileStock = mongoose.model("MobileStock", mobileStockSchema);
module.exports = MobileStock;
