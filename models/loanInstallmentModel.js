const mongoose = require("mongoose");
const loanInstallmentSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: [true, "select loan from list"],
    },
    dueDate: Date,
    installmentAmount: Number,
    status: {
      type: String,
      default: "not paid",
    },
  },
  { timestamps: true }
);

const LoanInstallment = mongoose.model(
  "LoanInstallment",
  loanInstallmentSchema
);

module.exports = LoanInstallment;
