const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Representative = require("./../models/representativeModel");

exports.createRepresentative = catchAsync(async (req, res, next) => {
  const representative = await Representative.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      representative,
    },
  });
});

exports.getAllRepresentative = catchAsync(async (req, res, next) => {
  const representatives = await Representative.find();
  res.status(200).json({
    status: "success",
    length: representatives.length,
    data: {
      representatives,
    },
  });
});

exports.updateRepresentative = catchAsync(async (req, res, next) => {
  const { representativeId } = req.params;
  if (!representativeId)
    return next(new AppError("provide id for representative", 404));
  const representative = await Representative.findById(representativeId);
  if (!representative)
    return next(new AppError("No representative found on the system", 404));
  const updatedRepresentative = await Representative.findByIdAndUpdate(
    representativeId,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      updatedRepresentative,
    },
  });
});

exports.getRepresentative = catchAsync(async (req, res, next) => {
  const { representativeId } = req.params;
  if (!representativeId)
    return next(new AppError("provide id for representative", 404));
  const representative = await Representative.findById(representativeId);
  if (!representative)
    return next(new AppError("No representative found on the system", 404));
  res.status(200).json({
    status: "success",
    data: {
      representative,
    },
  });
});

exports.deleteRepresentative = catchAsync(async (req, res, next) => {
  const { representativeId } = req.params;
  if (!representativeId)
    return next(new AppError("provide id for representative", 404));
  const representative = await Representative.findById(representativeId);
  if (!representative)
    return next(new AppError("No representative found on the system", 404));
  await Representative.findByIdAndDelete(representativeId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
