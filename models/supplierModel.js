const mongoose = require("mongoose");
const validator = require("validator");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      trim: true,
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    address: {
      type: String,
      required: [true, "Please provide address"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide phone number"],
      validate: [
        validator.isMobilePhone,
        "Please provide a valid phone number  ",
      ],
    },
    organizationId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: [true, "Supplier must belong to an organization"],
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Supplier must have a creator"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
