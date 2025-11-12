const mongoose = require("mongoose");
const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    overtime: {
      type: Number,
      default: 0,
    },
    deduction: {
      amount: {
        type: Number,
        default: 0,
      },
      purpose: String,
    },
    bonus: {
      amount: {
        type: Number,
        dafault: 0,
      },
      purpose: String,
    },
    salary: {
      type: Number,
      required: [true, "salary is required"],
      default: 0,
    },
    total: {
      type: Number,
      default: function () {
        return this.salary;
      },
    },
    date: Date,
    status: {
      type: String,
      enum: {
        values: ["paid", "unpaid"],
        message: "{VALUE} is not valid",
      },
      default: "unpaid",
    },
  },
  { timestamps: true }
);

const Payroll = mongoose.model("Payroll", payrollSchema);
module.exports = Payroll;
