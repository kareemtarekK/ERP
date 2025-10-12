const JornalEntry = require("./../models/jornalEntryModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
exports.createJornalEntry = catchAsync(async (req, res, next) => {
  const jornalEntry = await JornalEntry.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      jornalEntry,
    },
  });
});
exports.getAllJornalEntries = catchAsync(async (req, res, next) => {
  const jornalEntries = await JornalEntry.find();
  res.status(200).json({
    status: "success",
    result: jornalEntries.length,
    data: {
      jornalEntries,
    },
  });
});
exports.updateJornalEntry = catchAsync(async (req, res, next) => {
  const { jornalEntryId } = req.params;
  if (!jornalEntryId)
    return next(new AppError("Please provide jornal entry id", 500));
  const updatedJornalEntry = await JornalEntry.findByIdAndUpdate(
    jornalEntryId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedJornalEntry)
    return next(new AppError("No jornal entry with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatedJornalEntry,
    },
  });
});
exports.getJornalEntry = catchAsync(async (req, res, next) => {
  const { jornalEntryId } = req.params;
  if (!jornalEntryId)
    return next(new AppError("Please provide jornal entry id", 500));
  const jornalEntry = await JornalEntry.findById(jornalEntryId);
  res.status(200).json({
    status: "success",
    jornalEntry,
  });
});
exports.deleteJornalEntry = catchAsync(async (req, res, next) => {
  const { jornalEntryId } = req.params;
  if (!jornalEntryId)
    return next(new AppError("Please provide jornal entry id", 500));
  await JornalEntry.findByIdAndDelete(jornalEntryId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
