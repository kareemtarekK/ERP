const mongoose = require("mongoose");
const installmentSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: [true, "select a loan"],
    },
    amount: Number,
    dueDate: Date,
    status: {
      type: String,
      default: "not paid",
    },
  },
  {
    timestamps: true,
  }
);
const Installment = mongoose.model("Installment", installmentSchema);
module.exports = Installment;
