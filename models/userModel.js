const req = require("express/lib/request");
const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrybt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  tradeName: {
    type: String,
    require: [true, "Please enter trade name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  phone: {
    countryCode: {
      type: String,
      required: [true, "Select the country code"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Enter your phone number"],
      unique: true,
    },
  },
  website: {
    type: String,
    required: [true, "Please enter website link"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Please enter a confirm password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password are not the same try again!",
    },
  },
  passwordResetCode: String,
  passwordResetCodeExpires: Date,
  passwordResetVerified: {
    type: Boolean,
    default: false,
  },
});
userSchema.pre("save", async function (next) {
  this.password = await bcrybt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
// compare passwords
userSchema.methods.correctPassword = async function (
  candidatePassword,
  password
) {
  return await bcrybt.compare(candidatePassword, password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
