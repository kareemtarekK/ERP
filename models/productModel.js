const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "enter product name"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "enter product code"],
      unique: true,
    },
    price: {
      type: String,
      required: [true, "enter product price"],
    },
    tax: {
      type: String,
      required: [true, "enter tax for product"],
    },
    description: {
      type: String,
      maxlength: 500,
      minlength: 5,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: "select category for your product",
    },
    unit: Number,
    img: [String],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
