const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./../models/userModel");
const organizationSchema = new mongoose.Schema(
  {
    tradeName: {
      type: String,
      required: [true, "Enter trade name"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Enter address"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Enter organization's country"],
    },
    email: {
      type: String,
      required: [true, "Enter email"],
      validate: [validator.isEmail, "Invalid email"],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
organizationSchema.pre("save", async function (next) {
  const user = await User.findById(this.user_id);
  user.organizations.push({ organization_id: this._id });
  await user.save({ validateBeforeSave: false });
  next();
});
organizationSchema.virtual("customers", {
  ref: "Customer",
  localField: "_id",
  foreignField: "organizationId",
});
const Organization = mongoose.model("Organization", organizationSchema);
module.exports = Organization;
