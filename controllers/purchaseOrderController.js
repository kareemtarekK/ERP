const PurchaseOrder = require("./../models/purchaseOrderModel");
const catchAsync = require("./../utils/catchAsync");
exports.createPurchaseOrder = catchAsync(async (req, res, next) => {
  const purchaseOrder = await PurchaseOrder.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      purchaseOrder,
    },
  });
});
