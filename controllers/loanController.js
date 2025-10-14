const Loan = require("./../models/loanModel");
const LoanInstallment = require("./../models/loanInstallmentModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
// create loan
exports.createLoan = catchAsync(async (req, res, next) => {
  const loan = await Loan.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      loan,
    },
  });
});
// get all loans
exports.getAllLoans = catchAsync(async (req, res, next) => {
  const loans = await Loan.find();
  res.status(200).json({
    status: "success",
    result: loans.length,
    data: {
      loans,
    },
  });
});
// update loan
exports.updateLoan = catchAsync(async (req, res, next) => {
  const { loanId } = req.params;
  if (!loanId) return next(new AppError("provide loan id", 500));
  const updatedLoan = await Loan.findByIdAndUpdate(loanId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedLoan)
    return next(new AppError("loan not found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatedLoan,
    },
  });
});
// get a specific loan
exports.getLoan = catchAsync(async (req, res, next) => {
  const { loanId } = req.params;
  if (!loanId) return next(new AppError("provide loan id", 500));
  const loan = await Loan.findById(loanId);
  if (!loan) return next(new AppError("loan not found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      loan,
    },
  });
});
// delete loan
exports.deleteLoan = catchAsync(async (req, res, next) => {
  const { loanId } = req.params;
  if (!loanId) return next(new AppError("provide loan id", 500));
  await Loan.findByIdAndDelete(loanId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
// mark as approved
exports.markAsApproved = catchAsync(async (req, res, next) => {
  const { loanId } = req.params;
  if (!loanId) return next(new AppError("provide loan id", 500));
  const loan = await Loan.findById(loanId);
  if (!loan) return next(new AppError("no loan found with that id", 404));
  loan.status = "approved";
  await loan.save({ validateBeforeSave: false });
  const { installmentNumber } = loan;
  for (let i = 0; i < installmentNumber; i++) {
    await LoanInstallment.create({
      loanId,
      amount: loan.installmentAmount,
      dueDate: new Date(loan.startDate).setMonth(
        new Date(loan.startDate).getMonth() + i
      ),
    });
  }
  res.status(200).json({
    status: "success",
    message: "loan approved, now you can see your installments to pay them",
  });
});
