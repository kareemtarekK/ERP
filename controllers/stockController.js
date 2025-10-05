const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Stock = require("./../models/stockModel");
const PurchaseOrder = require("./../models/purchaseOrderModel");
const StockMovement = require("./../models/stockMovementModel");
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

// alternative middleware to stock in

// exports.stockIn = catchAsync(async (req, res, next) => {
//   const { purchaseOrderId } = req.params;
//   const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
//   if (!purchaseOrder)
//     return next(new AppError("purchaseOrder not found on the system", 404));
//   const { products } = purchaseOrder;
//   if (purchaseOrder.status === "delivered")
//     return next(new AppError("purchaseOrder is already delivered", 400));
//   for (let product of products) {
//     const { inventoryId, productId, quantity } = product;
//     const stock = await Stock.findOne({
//       productId,
//       inventoryId,
//     });
//     if (stock) {
//       stock.quantity += quantity;
//       await stock.save({ validateBeforeSave: false });
//     } else {
//       await Stock.create({ inventoryId, productId, quantity });
//     }
//   }
//   purchaseOrder.status = "delivered";
//   await PurchaseOrder.save({ validateBeforeSave: false });
//   res.status(200).json({
//     status: "stock in is done successfully ✅",
//     data: {
//       purchaseOrder,
//       stock,
//     },
//   });
// });
exports.stockIn = catchAsync(async (req, res, next) => {
  const { purchaseOrderId } = req.params;
  if (!purchaseOrderId)
    return next(new AppError("Order id is not provided", 500));
  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
  if (!purchaseOrder || purchaseOrder.status === "delivered")
    return next(
      new AppError(
        "No purchase order found with that ID or order delivered",
        500
      )
    );
  let stock, stockMovement;
  const { products } = purchaseOrder;
  for (let product of products) {
    const { inventoryId, productId, quantity } = product;
    stock = await Stock.findOne({ productId, inventoryId });
    if (stock) {
      stock.quantity += quantity;
      await stock.save({ validateBeforeSave: false });
    } else {
      await Stock.create({ productId, inventoryId, quantity });
    }
    const movement = await StockMovement.findOne({
      inventoryId,
      productId,
    });
    if (movement) {
      stockMovement = await StockMovement.create({
        productId,
        inventoryId,
        orderType: "PurchaseOrder",
        referenceId: purchaseOrderId,
        type: "IN",
        oldQuantity: movement.newQuantity,
        quantity,
        newQuantity: movement.newQuantity + quantity,
      });
    } else {
      stockMovement = await StockMovement.create({
        productId,
        inventoryId,
        orderType: "PurchaseOrder",
        referenceId: purchaseOrderId,
        type: "IN",
        quantity,
        newQuantity: quantity,
      });
    }
  }
  // update purchase order status to delivered
  const updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
    purchaseOrderId,
    { status: "delivered" },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "stock charged successfully",
    data: {
      updatedPurchaseOrder,
    },
  });
});
