const Jornal = require("./../models/jornalModel");
const JornalEntry = require("./../models/jornalEntryModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
//create jornal
exports.createJornal = catchAsync(async (req, res, next) => {
  const jornal = await Jornal.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      jornal,
    },
  });
});
// get all jornals
exports.getAllJornals = catchAsync(async (req, res, next) => {
  const jornals = await Jornal.find();
  res.status(200).json({
    status: "success",
    result: jornals.length,
    data: {
      jornals,
    },
  });
});
exports.deleteJornal = catchAsync(async (req, res, next) => {
  const { jornalId } = req.params;
  if (!jornalId) return next(new AppError("Please provide jornal id", 500));
  await Jornal.findByIdAndDelete(jornalId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
// get all jornal entries for jornal
exports.getAllJornalEntries = catchAsync(async (req, res, next) => {
  const { jornalId } = req.params;
  const jornalEntries = await JornalEntry.find({ jornalId });
  if (!jornalEntries) return next(new AppError("No jornal with that id", 404));
  res.status(200).json({
    status: "success",
    result: jornalEntries.length,
    data: {
      jornalEntries,
    },
  });
});
