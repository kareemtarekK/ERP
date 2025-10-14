const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const LoanInstallment = require("./../models/loanInstallmentModel");
exports.getAllLoanInstallment = catchAsync(async (req, res, next) => {
  const loanInstallments = await LoanInstallment.find();
  res.status(200).json({
    status: "success",
    length: loanInstallments.length,
    data: {
      loanInstallments,
    },
  });
});

exports.getLoanInstallment = catchAsync(async (req, res, next) => {
  const { loanInvestmentId } = req.params;
  const loanInstallment = await LoanInstallment.findById(loanInvestmentId);
  if (!loanInstallment)
    return next(new AppError("No loan installment found on system", 404));
  res.status(200).json({
    status: "success",
    data: {
      loanInstallment,
    },
  });
});

exports.deleteLoanInstallment = catchAsync(async (req, res, next) => {
  const { loanInvestmentId } = req.params;
  const loanInstallment = await LoanInstallment.findById(loanInvestmentId);
  if (!loanInstallment)
    return next(new AppError("No loan installment found on system", 404));
  await LoanInstallment.findByIdAndDelete(loanInvestmentId);
  res.status(200).json({
    status: "success",
    data: null,
  });
});
