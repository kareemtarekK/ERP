const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "enter product name"],
    trim: true,
  },
  code: {
    type: String,
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
    type: String,
    trim: true,
  },
  unit: String,
  img: [String],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
