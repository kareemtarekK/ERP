// const mongoose = require("mongoose");
// const journalEntrySchema = new mongoose.Schema(
//   {
//     journalId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Journal",
//       required: [true, "select journal type"],
//     },
//     lines: [
//       {
//         accountId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Account",
//           required: [true, "enter an account"],
//         },
//         description: String,
//         debit: {
//           type: Number,
//           min: [0, "debit can`t be negative"],
//           default: 0,
//         },
//         credit: {
//           type: Number,
//           min: [0, "debit can`t be negative"],
//           default: 0,
//         },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);
// module.exports = JournalEntry;
