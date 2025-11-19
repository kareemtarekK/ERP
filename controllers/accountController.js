// const catchAsync = require("./../utils/catchAsync");
// const Account = require("./../models/accountingModel");
// const AppError = require("./../utils/appError");
// exports.createAccount = catchAsync(async (req, res, next) => {
//   const account = await Account.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: {
//       account,
//     },
//   });
// });

// exports.getAllAccounts = catchAsync(async (req, res, next) => {
//   const accounts = await Account.find();
//   res.status(200).json({
//     status: "success",
//     length: accounts.length,
//     data: {
//       accounts,
//     },
//   });
// });

// exports.deleteAccount = catchAsync(async (req, res, next) => {
//   const { accountId } = req.params;
//   const account = await Account.findById(accountId);
//   if (!account) return next(new Error("No account found on system", 404));
//   await Account.findByIdAndDelete(accountId);
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// });
const Account = require("./../models/accountingModel");
const JornalEntry = require("./../models/jornalEntryModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
exports.createAccount = catchAsync(async (req, res, next) => {
  const account = await Account.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      account,
    },
  });
});
exports.getAllAccounts = catchAsync(async (req, res, next) => {
  const accounts = await Account.find();
  res.status(200).json({
    status: "success",
    results: accounts.length,
    data: {
      accounts,
    },
  });
});
exports.deleteAccount = catchAsync(async (req, res, next) => {
  const { accountId } = req.params;
  if (!accountId) return next(new AppError("Please provide account id", 500));
  await Account.findByIdAndDelete(accountId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllJornalEntries = catchAsync(async (req, res, next) => {
  const { accountId } = req.params;
  if (!accountId) return next(new AppError("provide account id", 400));
  const account = await Account.findById(accountId);
  if (!account) return next(new AppError("No account found on system", 404));
  let totalDebit = 0,
    totalCredit = 0;

  const jornalEntries = await JornalEntry.find();
  let allJornals = [];
  for (let jornal of jornalEntries) {
    const { lines } = jornal;
    for (let line of lines) {
      if (line.accountId == accountId) {
        totalDebit += line.debit;
        totalCredit += line.credit;
        allJornals.push(jornal);
      }
    }
  }
  res.status(200).json({
    status: "success",
    result: allJornals.length,
    data: {
      allJornals,
      totalDebit,
      totalCredit,
    },
  });
});
