const Account = require("./../models/accountingModel");
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
