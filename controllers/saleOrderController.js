const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const SaleOrder = require("./../models/saleOrderModel");
const Stock = require("./../models/stockModel");
const Inventory = require("./../models/inventoryModel");
const JornalEntry = require("./../models/jornalEntryModel");
const Jornal = require("./../models/jornalModel");
const Account = require("./../models/accountingModel");

exports.createSaleOrder = catchAsync(async (req, res, next) => {
  const saleOrder = await SaleOrder.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      saleOrder,
    },
  });
});

exports.getAllSaleOrders = catchAsync(async (req, res, next) => {
  const saleOrders = await SaleOrder.find().select("-__v");
  res.status(200).json({
    status: "success",
    length: saleOrders.length,
    data: {
      saleOrders,
    },
  });
});

exports.getSaleOrder = catchAsync(async (req, res, next) => {
  const { saleOrderId } = req.params;
  if (!saleOrderId) return next(new AppError("400", "enter sale order id"));
  const saleOrder = await SaleOrder.findById(saleOrderId);
  if (!saleOrder)
    return next(new AppError("sale Order not found on the system", 404));
  res.status(200).json({
    status: "success",
    data: {
      saleOrder,
    },
  });
});

exports.updateSaleOrder = catchAsync(async (req, res, next) => {
  const { saleOrderId } = req.params;
  if (!saleOrderId) return next(new AppError("400", "enter sale order id"));
  const saleOrder = await SaleOrder.findById(saleOrderId);
  if (!saleOrder)
    return next(new AppError("sale Order not found on the system", 404));
  const updatedSaleOrder = await SaleOrder.findByIdAndUpdate(
    saleOrderId,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      updatedSaleOrder,
    },
  });
});

exports.deleteSaleOrder = catchAsync(async (req, res, next) => {
  const { saleOrderId } = req.params;
  if (!saleOrderId) return next(new AppError("400", "enter sale order id"));
  const saleOrder = await SaleOrder.findById(saleOrderId);
  if (!saleOrder)
    return next(new AppError("sale Order not found on the system", 404));
  await SaleOrder.findByIdAndDelete(saleOrderId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
