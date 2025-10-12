// const AppError = require("./../utils/appError");
// const catchAsync = require("./../utils/catchAsync");
// const JournalEntry = require("./../models/journalEntryModel");

// exports.createJournalEntry = catchAsync(async (req, res, next) => {
//   const jurnalEntry = await JournalEntry.create(req.body);
//   res.status(201).json({
//     status: "succes",
//     data: {
//       JournalEntry,
//     },
//   });
// });

// exports.getAllJournalEntries = catchAsync(async (req, res, next) => {
//   const journalEntries = await JournalEntry.find();
//   res.status(200).json({
//     status: "success",
//     length: journalEntries.length,
//     data: {
//       journalEntries,
//     },
//   });
// });

// exports.getJournalEntry = catchAsync(async (req, res, next) => {
//   const { journalEntryId } = req.params;
//   const journalEntry = await JournalEntry.findById(journalEntryId);
//   if (!journalEntry)
//     return next(new AppError("No journal entry found on system", 404));
//   res.status(200).json({
//     status: "success",
//     data: {
//       journalEntry,
//     },
//   });
// });

// exports.updateJournalEntry = catchAsync(async (req, res, next) => {
//   const { journalEntryId } = req.params;
//   const journalEntry = await JournalEntry.findById(journalEntryId);
//   if (!journalEntry)
//     return next(new AppError("No journal entry found on system", 404));
//   const updatedJournalEntry = await JournalEntry.findByIdAndUpdate(
//     journalEntryId,
//     req.body,
//     {
//       runValidators: true,
//       new: true,
//     }
//   );
//   res.status(200).json({
//     status: "success",
//     data: {
//       updatedJournalEntry,
//     },
//   });
// });

// exports.deleteJournalEntry = catchAsync(async (req, res, next) => {
//   const { journalEntryId } = req.params;
//   const journalEntry = await JournalEntry.findById(journalEntryId);
//   if (!journalEntry)
//     return next(new AppError("No journal entry found on system", 404));
//   await JournalEntry.findByIdAndDelete(journalEntryId);
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });
