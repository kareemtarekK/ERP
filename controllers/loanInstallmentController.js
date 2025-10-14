const Installment = require("./../models/loanInstallmentModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// get all installments
exports.getAllInstallments = catchAsync(async (req, res, next) => {
  const installments = await Installment.find();
  res.status(200).json({
    status: "success",
    results: installments.length,
    data: {
      installments,
    },
  });
});
// get an installment
exports.getInstallment = catchAsync(async (req, res, next) => {
  const { installmentId } = req.params;
  if (!installmentId) return next(new AppError("provide installment id", 500));
  const installment = await Installment.findById(installmentId);
  if (!installment)
    return next(new AppError("no installment found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      installment,
    },
  });
});

// delete an installment
exports.deleteInstallment = catchAsync(async (req, res, next) => {
  const { installmentId } = req.params;
  if (!installmentId) return next(new AppError("provide installment id", 500));
  await Installment.findByIdAndDelete(installmentId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
