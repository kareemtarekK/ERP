const PurchaseOrder = require("./../models/purchaseOrderModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// create purchase order
exports.createPurchaseOrder = catchAsync(async (req, res, next) => {
  const purchaseOrder = await PurchaseOrder.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      purchaseOrder,
    },
  });
});
// update pruchase order
exports.updatePurchaseOrder = catchAsync(async (req, res, next) => {
  const { purchaseOrderId } = req.params;
  if (!purchaseOrderId)
    return next(new AppError("Purchase order id required", 500));
  const updatePurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
    purchaseOrderId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatePurchaseOrder)
    return next(new AppError("No purchase order found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatePurchaseOrder,
    },
  });
});
// delete a purchase order
exports.deletePurchaseOrder = catchAsync(async (req, res, next) => {
  const { purchaseOrderId } = req.params;
  if (!purchaseOrderId)
    return next(new AppError("Purchase order id required", 500));
  await PurchaseOrder.findByIdAndDelete(purchaseOrderId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
