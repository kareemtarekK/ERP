// const catchAsync = require("./../utils/catchAsync");
// const Journal = require("./../models/journalModel");
// const AppError = require("./../utils/appError");

// exports.createJournal = catchAsync(async (req, res, next) => {
//   const journal = await Journal.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: {
//       journal,
//     },
//   });
// });

// exports.getAllJournals = catchAsync(async (req, res, next) => {
//   const journals = await Journal.find();
//   res.status(200).json({
//     status: "success",
//     length: journals.length,
//     data: {
//       journals,
//     },
//   });
// });

// exports.deleteJournal = catchAsync(async (req, res, next) => {
//   const { journalId } = req.params;
//   const journal = await Journal.findById(journalId);
//   if (!journal) return next(new Error("No account found on system", 404));
//   await Journal.findByIdAndDelete(journalId);
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });
