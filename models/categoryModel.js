const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "category name is required"],
      trim: true,
      unique: [true, "category exists before"],
    },
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
