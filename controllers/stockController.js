const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Stock = require("./../models/stockModel");
// add product to inventory
exports.addStockToInventory = catchAsync(async (req, res, next) => {
  const { inventoryId } = req.params;
  if (!inventoryId)
    return next(new AppError("there is no inventoryId provided", 500));
  const stock = await Stock.create({ inventoryId, ...req.body });
  res.status(201).json({
    status: "success",
    data: {
      stock,
    },
  });
});

// get stock inventory details
exports.getStock = catchAsync(async (req, res, next) => {
  const { stockId } = req.params;
  const stockInventory = await Stock.findById(stockId);
  if (!stockInventory)
    return next(new AppError("there is no stock found on FileSystem", 404));
  res.status(200).json({
    status: "success",
    data: {
      stockInventory,
    },
  });
});

// update stock inventory details
exports.updateStock = catchAsync(async (req, res, next) => {
  const { stockId } = req.params;
  const stock = await Stock.findById(stockId);
  if (!stock)
    return next(new AppError("there is no stock found on FileSystem", 404));
  const updatedStock = await Stock.findByIdAndUpdate(stockId, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedStock,
    },
  });
});

// deletestock inventory details
exports.deleteStock = catchAsync(async (req, res, next) => {
  const { stockId } = req.params;
  const stock = await Stock.findById(stockId);
  if (!stock)
    return next(new AppError("there is no stock found on FileSystem", 404));
  await Stock.findByIdAndDelete(stockId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
