const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Representative = require("./../models/representativeModel");
const Account = require("./../models/accountingModel");
const MobileStock = require("./../models/mobileStockModel");
const Stock = require("./../models/stockModel");
const Jornal = require("../models/jornalModel");
const JornalEntry = require("../models/jornalEntryModel");

exports.createMobileStock = catchAsync(async (req, res, next) => {
  const { representative, goods, capacity, name } = req.body;
  let stock;
  let totalCapacity = 0;
  for (let product of goods) {
    stock = await Stock.findById(product.stock).populate("inventoryId");
    if (product.quantity > stock.quantity)
      return next(
        new AppError(
          `inventory stock (${stock.inventoryId.name}) is not enough for your mobile stock`,
          400
        )
      );
    totalCapacity += product.quantity;
  }

  if (totalCapacity > capacity) {
    return next(
      new AppError("mobile stock capacity is not enough for your transfer", 400)
    );
  }
  const mobileStock = await MobileStock.create({
    representative,
    goods,
    capacity,
    name,
  });

  const accountMobile = await Account.findOne({ name: "mobile-stock" });
  const accountInventory = await Account.findOne({ name: "inventory-stock" });
  const jornalMobileStock = await Jornal.findOne({
    jornalType: "mobile-stock-transfer",
  });

  await JornalEntry.create({
    jornalId: jornalMobileStock._id,
    lines: [
      {
        accountId: accountMobile._id,
        description: `Inventory transferred from the ${stock.inventoryId.name} to the mobile stock (${mobileStock.name}) for distribution, with no financial impact.`,
        debit: 0,
        credit: 0,
      },
      {
        accountId: accountInventory._id,
        description: `Inventory transferred from the ${stock.inventoryId.name} to the mobile stock (${mobileStock.name}) for distribution, with no financial impact.`,
        debit: 0,
        credit: 0,
      },
    ],
  });
  res.status(201).json({
    status: "success",
    data: {
      mobileStock,
    },
  });
});

exports.getAllMobileStocks = catchAsync(async (req, res, next) => {
  const mobileStocks = await MobileStock.find();
  res.status(200).json({
    status: "success",
    length: mobileStocks.length,
    data: {
      mobileStocks,
    },
  });
});

exports.getMobileStock = catchAsync(async (req, res, next) => {
  const { mobileStockId } = req.params;
  if (!mobileStockId) return next(new AppError("provide loan id", 500));
  const mobileStock = await MobileStock.findById(mobileStockId);
  if (!mobileStock)
    return next(new AppError("mobile stock not found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      mobileStock,
    },
  });
});

exports.updateMobileStock = catchAsync(async (req, res, next) => {
  const { mobileStockId } = req.params;
  if (!mobileStockId) return next(new AppError("provide loan id", 500));
  const mobileStock = await MobileStock.findById(mobileStockId);
  if (!mobileStock)
    return next(new AppError("mobile stock not found with that id", 404));

  const updatedMobileStock = await Loan.findByIdAndUpdate(
    mobileStockId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedMobileStock,
    },
  });
});

// delete loan
exports.deleteMobileStock = catchAsync(async (req, res, next) => {
  const { loanId } = req.params;
  if (!loanId) return next(new AppError("provide loan id", 500));
  await Loan.findByIdAndDelete(loanId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
