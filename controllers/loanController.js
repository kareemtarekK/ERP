const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Loan = require("./../models/loanModel");
const Account = require("./../models/accountingModel");
const Jornal = require("./../models/jornalModel");
const JornalEntry = require("./../models/jornalEntryModel");

const LoanInstallment = require("./../models/loanInstallmentModel");

exports.createLoan = catchAsync(async (req, res, next) => {
  const loan = await Loan.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      loan,
    },
  });
});

exports.getAllLoans = catchAsync(async (req, res, next) => {
  const loans = await Loan.find();
  res.status(200).json({
    status: "success",
    length: loans.length,
    data: {
      loans,
    },
  });
});

exports.getLoan = catchAsync(async (req, res, next) => {
  const { loanId } = req.params;
  if (!loanId) return next(new AppError("not found loanId", 404));
  const loan = await Loan.findById(loanId);
  if (!loan) return next(new AppError("No loan found on system", 404));
  res.status(200).json({
    status: "success",
    data: {
      loan,
    },
  });
});

exports.updateLoan = catchAsync(async (req, res, next) => {
  const { loanId } = req.params;
  if (!loanId) return next(new AppError("not found loanId", 404));
  const loan = await Loan.findById(loanId);
  if (!loan) return next(new AppError("No loan found on system", 404));
  const updatedLoan = await Loan.findByIdAndUpdate(loadId, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedLoan,
    },
  });
});

exports.deleteLoan = catchAsync(async (rqe, res, next) => {
  const { loanId } = req.params;
  if (!loanId) return next(new AppError("not found loanId", 404));
  const loan = await Loan.findById(loanId);
  if (!loan) return next(new AppError("No loan found on system", 404));
  await Loan.findByIdAndDelete(loanId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.markAsApproved = catchAsync(async (req, res, next) => {
  const { loanId } = req.params;
  const loan = await Loan.findById(loanId);
  if (!loan) return next(new AppError("No loan found on system", 404));
  loan.status = "approved";
  await loan.save({ validateBeforeSave: false });
  const installmentNum = loan.installmentNumber;
  for (let i = 0; i < installmentNum; i++) {
    await LoanInstallment.create({
      loanId,
      installmentAmount: loan.installmentAmount,
      dueDate: new Date(loan.startDate).setMonth(
        new Date(loan.startDate).getMonth() + i
      ),
    });
  }
  const debitAccount = await Account.findOne({ name: "loan payable" });
  const creditAccount = await Account.findOne({ name: "cash/bank" });
  const jornal = await Account.findOne({ jornalType: "loan" });
  await JornalEntry.create({
    jornalId: jornal._id,
    lines: [
      {
        accountId: debitAccount._id,
        description: `To record cash received from the bank as loan proceeds: ${loan.totalPayable}`,
        debit: loan.totalPayable,
      },
      {
        accountId: creditAccount._id,
        description: `To recognize the loan liability owed to the bank: ${loan.totalPayable}`,
        credit: loan.totalPayable,
      },
    ],
  });
  loan.status = "active";
  await loan.save({ validateBeforeSave: false });
  await res.status(200).json({
    status: "success",
    message:
      "loan approved and be active now, you should be ready to pay each of installments",
  });
});
