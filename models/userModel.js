const req = require("express/lib/request");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrybt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please enter full name"],
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
  changePasswordAt: Date,
  passwordResetVerified: {
    type: Boolean,
    default: false,
  },
  organizations: [
    {
      organization_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "organization",
      },
    },
  ],
  role: {
    type: String,
    required: [true, "Please specify user role"],
  },
  avatar: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
userSchema.pre("save", async function (next) {
  this.password = await bcrybt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.changePasswordAt = Date.now() - 1000;
  next();
});
// compare passwords
userSchema.methods.correctPassword = async function (
  candidatePassword,
  password
) {
  return await bcrybt.compare(candidatePassword, password);
};
// check if user changed his password after token issued
userSchema.methods.changePasswordAfter = function (issuedAt) {
  if (this.changePasswordAt) {
    const changedAt = parseInt(
      new Date(this.changePasswordAt).getTime() / 1000,
      10
    );
    return issuedAt < changedAt;
  }
  return false;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
