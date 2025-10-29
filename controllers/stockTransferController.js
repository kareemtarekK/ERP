const StockTransfer = require("./../models/stockTransferModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const Stock = require("./../models/stockModel");
const Inventory = require("../models/inventoryModel");
const JornalEntry = require("./../models/jornalEntryModel");
const Jornal = require("./../models/jornalModel");
const Account = require("./../models/accountingModel");

//  1- create stock transfer
exports.createStockTransfer = catchAsync(async (req, res, next) => {
  const stockTransfer = await StockTransfer.create(req.body);
  // for (let product of stockTransfer.products) {
  //   const from = await Stock.findOne({
  //     productId: product.productId,
  //     inventoryId: stockTransfer.from,
  //   });
  //   const inventoryFrom = await Inventory.findById(stockTransfer.from);

  //   from.quantity -= product.unit;
  //   inventoryFrom.capacity += product.unit;
  //   await inventoryFrom.save({ validateBeforeSave: false });
  //   await from.save();
  //   const to = await Stock.findOne({
  //     productId: product.productId,
  //     inventoryId: stockTransfer.to,
  //   });
  //   to.quantity += product.unit;
  //   const inventoryTo = await Inventory.findById(stockTransfer.to);
  //   inventoryTo.capacity -= product.unit;
  //   await inventoryTo.save({ validateBeforeSave: false });
  //   await to.save();
  // }

  // const jornal = await Jornal.findOne({ jornalType: "stock-transfer" });
  // const accountExpense = await Jornal.findOne({ name: "purachses-expenses" });
  // const accountBank = await Jornal.findOne({ name: "cash/bank" });

  // await JornalEntry.create({
  //   jornalId: jornal._id,
  //   lines: [
  //     {
  //       accountId: accountExpense._id,
  //       description: `Records shipping cost ${stockTransfer.shippingCost} for stock transfer`,
  //       debit: 0,
  //       credit: stockTransfer.shippingCost,
  //     },
  //     {
  //       accountId: accountBank._id,
  //       description: `Tracks cash paid ${stockTransfer.shippingCost} for stock transfer`,
  //       debit: stockTransfer.shippingCost,
  //       credit: 0,
  //     },
  //   ],
  // });
  // stockTransfer.status = "transfered";
  // await stockTransfer.save({ validateBeforeSave: false });
  //3- create stock transfer
  res.status(201).json({
    status: "success",
    data: {
      stockTransfer,
    },
  });
});
//get all stock transfers
exports.getAllStockTransfer = catchAsync(async (req, res, next) => {
  const stockTransfers = await StockTransfer.find().select("-__V");
  res.status(200).json({
    status: "success",
    results: stockTransfers.length,
    data: {
      stockTransfers,
    },
  });
});
// update stock transfer
exports.updateStockTransfer = catchAsync(async (req, res, next) => {
  const { stockTransferId } = req.params;
  if (!stockTransferId) return next(new AppError("Please provide id", 500));
  const updatedStockTransfer = await StockTransfer.findByIdAndUpdate(
    stockTransferId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedStockTransfer)
    return next(new AppError("No stock transfer found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatedStockTransfer,
    },
  });
});

exports.getAllDraftTransferOrder = catchAsync(async (req, res, next) => {
  const draftTransfer = await StockTransfer.find({
    status: "draft",
  }).select("-__v");
  res.status(200).json({
    status: "success",
    length: draftTransfer.length,
    data: {
      draftTransfer,
    },
  });
});

exports.getAllShippingTransferOrder = catchAsync(async (req, res, next) => {
  const shippingTransfer = await StockTransfer.find({
    status: "shipping",
  }).select("-__v");
  res.status(200).json({
    status: "success",
    length: draftTransfer.length,
    data: {
      shippingTransfer,
    },
  });
});

exports.getAllDeliveredTransferOrder = catchAsync(async (req, res, next) => {
  const DeliveredTransfer = await StockTransfer.find({
    status: "delivered",
  }).select("-__v");
  res.status(200).json({
    status: "success",
    length: draftTransfer.length,
    data: {
      DeliveredTransfer,
    },
  });
});

exports.changeDraftStatusIntoShipping = catchAsync(async (req, res, next) => {
  const { transferOrderId } = req.params;
  if (!transferOrderId)
    return next(new AppError("provide transfer order id", 400));
  const transferOrder = await StockTransfer.findById(transferOrderId);
  if (!transferOrder)
    return next(
      new AppError("No transfer order with that id found on system", 404)
    );
  transferOrder.status = "shipping";
  transferOrder.shippingCost = req.body.shippingCost;
  await transferOrder.save({ validateBeforeSave: false });
  for (let product of transferOrder.products) {
    const from = await Stock.findOne({
      productId: product.productId,
      inventoryId: transferOrder.from,
    });
    const inventoryFrom = await Inventory.findById(transferOrder.from);

    from.quantity -= product.unit;
    inventoryFrom.capacity += product.unit;
    await inventoryFrom.save({ validateBeforeSave: false });
    await from.save();
  }

  const jornal = await Jornal.findOne({ jornalType: "stock-transfer" });
  const accountExpense = await Jornal.findOne({ name: "purachses-expenses" });
  const accountBank = await Jornal.findOne({ name: "cash/bank" });

  await JornalEntry.create({
    jornalId: jornal._id,
    lines: [
      {
        accountId: accountExpense._id,
        description: `Records shipping cost ${transferOrder.shippingCost} for stock transfer`,
        debit: 0,
        credit: transferOrder.shippingCost,
      },
      {
        accountId: accountBank._id,
        description: `Tracks cash paid ${transferOrder.shippingCost} for stock transfer`,
        debit: transferOrder.shippingCost,
        credit: 0,
      },
    ],
  });
  res.status(200).json({
    status: "success",
    message:
      "transfer has been marked as “Shipping”, and the products have been deducted from the source warehouse.",
  });
});

exports.changeShippingStatusIntoDelivered = catchAsync(
  async (req, res, next) => {
    const { transferOrderId } = req.params;
    if (!transferOrderId)
      return next(new AppError("provide transfer order id", 400));
    const transferOrder = await StockTransfer.findById(transferOrderId);
    if (!transferOrder)
      return next(
        new AppError("No transfer order with that id found on system", 404)
      );
    transferOrder.status = "delivered";
    await transferOrder.save({ validateBeforeSave: false });
    for (let product of transferOrder.products) {
      const to = await Stock.findOne({
        productId: product.productId,
        inventoryId: transferOrder.to,
      });
      to.quantity += product.unit;
      const inventoryTo = await Inventory.findById(transferOrder.to);
      inventoryTo.capacity -= product.unit;
      await inventoryTo.save({ validateBeforeSave: false });
      await to.save();
    }
    res.status(200).json({
      status: "success",
      message:
        "transfer has been marked as 'delivered', and the products have been add to the destination warehouse.",
    });
  }
);

exports.getDocument = catchAsync(async (req, res, next) => {
  const { transferOrderId } = req.params;
  if (!transferOrderId)
    return next(new AppError("provide transfer order id", 400));
  const transferOrder = await StockTransfer.findById(transferOrderId);
  if (!transferOrder)
    return next(
      new AppError("No transfer order with that id found on system", 404)
    );
  if (transferOrder.status !== "delivered")
    return next(
      new AppError(
        "transfer order is not delivered, mark it as delivered first to generate document",
        500
      )
    );
  res.status(200).json({
    status: "success",
    data: {
      transferOrder,
    },
  });
});
