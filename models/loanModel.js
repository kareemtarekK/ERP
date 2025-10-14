const mongoose = require("mongoose");
const loanSchema = new mongoose.Schema(
  {
    borrowerType: {
      type: String, // will be exist different users in advance
      enum: ["Organization", "User"],
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "borrowerType",
      required: [true, "select the type of borrower"],
    },
    loanAmount: {
      type: Number,
      required: ["enter loan amount you need"],
      min: [0, "load amount can`t be negative"],
    },
    installmentNumber: {
      type: Number,
      required: [true, "enter installment number for this loan"],
      min: [0, "installment number can`t be negative"],
    },
    installmentAmount: Number,
    interestRate: {
      type: Number,
      required: [true, "enter interest rate for your loan"],
      min: [0, "interest rate can`t be negative"],
    },
    totalPayable: Number,
    status: {
      type: String,
      default: "pending",
    },
    startDate: {
      type: Date,
      required: [true, "select start date to pay fro your loan"],
    },
    remaningBalance: Number,
    description: String,
  },
  { timestamps: true }
);

loanSchema.pre("save", function (next) {
  const interest = (this.interestRate / 100) * this.loanAmount;
  this.totalPayable = this.loanAmount + interest;
  this.installmentAmount = this.totalPayable / this.installmentNumber;
  next();
});

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
