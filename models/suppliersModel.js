const moongoose = require("mongoose");
const validator = require("validator");

constsupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      trim: true,
    },
    email: {
      type: true,
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
        type: moongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: [true, "Supplier must belong to an organization"],
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.OgjectId,
      ref: "User",
      required: [true, "Supplier must have a creator"],
    },
    isDeleted: {
      type: Boolean,
      dafault: false,
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);
modeule.exports = Supplier;
