const mongoose = require("mongoose");
const representativeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "provide name of representative"],
      trim: true,
    },
    region: {
      type: String,
      required: [true, "provide region for representative"],
    },
    phone: {
      type: String,
      required: [true, "provide phone of representative"],
    },
  },
  { timestamps: true }
);

const Representative = mongoose.model("Representative", representativeSchema);
module.exports = Representative;
