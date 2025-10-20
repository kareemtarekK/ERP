const mongoose = require("mongoose");
const Account = require("./accountingModel");

const jornalEntrySchema = new mongoose.Schema(
  {
    jornalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Jornal",
      required: [true, "Please provide a jornal"],
    },
    lines: [
      {
        accountId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Account",
          required: [true, "Select an account"],
        },
        description: String,
        debit: {
          type: Number,
          min: [0, "debit must not be negative"],
          default: 0,
        },
        credit: {
          type: Number,
          min: [0, "debit must not be negative"],
          default: 0,
        },
      },
    ],
  },
  { timestamps: true }
);
const JornalEntry = mongoose.model("JornalEntry", jornalEntrySchema);

module.exports = JornalEntry;
