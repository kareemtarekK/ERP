const mongoose = require("mongoose");
const loanSchema = new mongoose.Schema(
  {
    borrowerType: {
      type: String,
      enum: ["Organization", "User"],
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "borrowerType",
      required: [true, "Select the type of borrower"],
    },
    loanAmount: {
      type: Number,
      required: [true, "Enter the loan amount"],
      min: [0, "loan amount can not be negative"],
    },
    installmentNumber: {
      type: Number,
      required: [true, "Enter the number of installment for this loan"],
      min: [0, "installment number can not be negative"],
    },
    installmentAmount: Number,
    interestRate: {
      type: Number,
      required: ["Enter the interest rate"],
      min: [0, "interest rate can not be negative"],
    },
    totalPayable: Number,
    status: {
      type: String,
      default: "pending",
    },
    startDate: {
      type: Date,
      required: [true, "select the start date for the first paying"],
    },
    remaningBalance: Number,
    description: String,
  },
  { timestamps: true }
);
loanSchema.pre("save", function (next) {
  this.totalPayable =
    this.loanAmount + (this.interestRate * this.loanAmount) / 100;
  this.installmentAmount = this.totalPayable / this.installmentNumber;
  this.remaningBalance = this.totalPayable;
  next();
});
// model
const Loan = mongoose.model("Loan", loanSchema);
module.exports = Loan;
