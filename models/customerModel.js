const mongoose = require("mongoose");
const validator = require("validator");
const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "enter your name"],
      minlength: 2,
      maxlength: 150,
    },
    organizationId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
      },
    ],
    email: {
      type: String,
      validate: [validator.isEmail, "enter valid email 💥"],
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v, "any");
        },
        message: "enter valid phone",
      },
    },
    currency: {
      type: String,
      enum: ["EGP", "SAR", "AED", "QAR", "EUR", "USD"],
      required: [true, "select your currency"],
    },
    notes: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    taxNumber: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
