const PurchaseOrder = require("./../models/purchaseOrderModel");
const catchAsync = require("./../utils/catchAsync");

// create purchase
exports.createPurchaseOrder = catchAsync(async (req, res, next) => {
  const purchase = await PurchaseOrder.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      purchase,
    },
  });
});

// get all purchases
exports.getAllPurchases = catchAsync(async (req, res, next) => {
  const purchases = await PurchaseOrder.find({});
  res.status(200).json({
    status: "success",
    length: purchases.length,
    data: {
      purchases,
    },
  });
});

// get purchase
exports.getpurchase = catchAsync(async (req, res, next) => {
  const purchase = await PurchaseOrder.findById(req.params.purchaseId);
  res.status(200).json({
    status: "success",
    data: {
      purchase,
    },
  });
});
