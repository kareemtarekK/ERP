const mongoose = require("mongoose");
const accountingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Account name is required"],
      trim: true,
    },
    code: {
      type: String,
      require: [true, "code is required"],
      unique: true,
    },
  },
  { timestamps: true }
);
const Account = mongoose.model("Account", accountingSchema);
module.exports = Account;
