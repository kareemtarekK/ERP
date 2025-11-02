const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Stock = require("./../models/stockModel");
const PurchaseOrder = require("./../models/purchaseOrderModel");
const SaleOrder = require("./../models/saleOrderModel");
const StockMovement = require("./../models/stockMovementModel");
const Inventory = require("../models/inventoryModel");
const Jornal = require("../models/jornalModel");
const Account = require("../models/accountingModel");
const JornalEntry = require("../models/jornalEntryModel");
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

exports.checkDeliveredQuantity = catchAsync(async (req, res, next) => {
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
  const { products } = req.body;
  for (let product of products) {
    const { products } = purchaseOrder;
    const pro = products.find((p) => p.productId == product.productId);
    pro.deliveredQuantity = product.deliveredQuantity;
    await purchaseOrder.save({ validateBeforeSave: false });
  }
  purchaseOrder.products = await Promise.all(
    purchaseOrder.products.map(async (item) => {
      if (
        item.deliveredQuantity > item.remainingQuantity &&
        item.remainingQuantity != 0
      ) {
        throw new Error(
          `Delivered quantity (${
            item.deliveredQuantity
          }) cannot exceed remaining quantity (${
            item.remainingQuantity
          }) for product ${item.name || item._id}`
        );
      }
      
      item.total = item.deliveredQuantity * item.price;
      item.total = item.total - (item.discount * item.total) / 100;
      item.remainingQuantity = item.remainingQuantity - item.deliveredQuantity;
      return item;
    })
  );
  purchaseOrder.totalAmount = purchaseOrder.products.reduce(
    (acc, current) => acc + current.total,
    0
  );
  await PurchaseOrder.findByIdAndUpdate(purchaseOrderId, {
    products: purchaseOrder.products,
    totalAmount: purchaseOrder.totalAmount,
  });

  req.order = purchaseOrder;
  req.products = req.body;
  next();
});

exports.stockIn = catchAsync(async (req, res, next) => {
  let stock;
  const { products } = req;
  for (let product of products) {
    const { inventoryId, productId, deliveredQuantity } = product;
    stock = await Stock.findOne({ productId, inventoryId });
    if (stock) {
      const inventory = await Inventory.findById(inventoryId);
      stock.quantity += deliveredQuantity;
      await stock.save({ validateBeforeSave: false });
      inventory.capacity -= deliveredQuantity;
      await inventory.save({ validateBeforeSave: false });
    } else {
      stock = await Stock.create({
        productId,
        inventoryId,
        quantity: deliveredQuantity,
      });
      const inventory = await Inventory.findById(inventoryId);
      inventory.capacity -= deliveredQuantity;
      await inventory.save({ validateBeforeSave: false });
    }
  }
  // update purchase order status to delivered
  const totalRemaining = req.order.products.reduce(
    (acc, cur) => acc + cur.remainingQuantity,
    0
  );
  let updatedPurchaseOrder = await PurchaseOrder.findById(req.order._id);
  if (totalRemaining === 0) {
    const { products } = req.order;
    products.map((product) => {
      product.deliveredQuantity = product.quantity;
      product.total = product.quantity * product.price;
    });
    const totalAmount = products.reduce(
      (acc, current) => acc + current.total,
      0
    );
    updatedPurchaseOrder = await PurchaseOrder.findByIdAndUpdate(
      req.order._id,
      {
        status: "delivered",
        products,
        totalAmount,
      },
      {
        new: true,
      }
    );
  }

  const jornal = await Jornal.findOne({ jornalType: "purchases" });
  const accountPurchase = await Account.findOne({ name: "purchases-expense" });
  const accountBank = await Account.findOne({ name: "cash/bank" });

  await JornalEntry.create({
    jornalId: jornal._id,
    lines: [
      {
        accountId: accountPurchase._id,
        description: `Records purchases made ${req.order.totalAmount} for stocking inventory`,
        debit: 0,
        credit: req.order.totalAmount,
      },
      {
        accountId: accountBank._id,
        description: `Tracks cash paid ${req.order.totalAmount} for purchasing inventory stock`,
        debit: req.order.totalAmount,
        credit: 0,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    message: "stock charged successfully",
    data: {
      updatedPurchaseOrder,
    },
  });
});

exports.stockOut = catchAsync(async (req, res, next) => {
  const { saleOrderId } = req.params;
  if (!saleOrderId) return next(new AppError("enter the sale order id", 400));
  const saleOrder = await SaleOrder.findById(saleOrderId);
  if (!saleOrder)
    return next(new AppError("sale order not found on system", 404));
  if (saleOrder.status === "delivered")
    return next("sale order has already delivered", 400);
  saleOrder.status = "delivered";
  await saleOrder.save({ validateBeforeSave: false });
  const { products } = saleOrder;
  for (let product of products) {
    const stock = await Stock.findOne({
      productId: product.productId,
      inventoryId: product.inventoryId,
    });
    stock.quantity -= product.quantity;
    await stock.save({ validateBeforeSave: false });
    const inventory = await Inventory.findById(product.inventoryId);
    inventory.capacity += quantity;
    await inventory.save({ validateBeforeSave: false });
  }
  const jornal = await Jornal.findOne({ jornalType: "sales" });
  const accountRevenue = await Jornal.findOne({ name: "sales-revenue" });
  const accountCustomerReceivable = await Jornal.findOne({
    name: "customer-receivable",
  });
  await JornalEntry.create({
    jornalId: jornal._id,
    lines: [
      {
        accountId: accountRevenue._id,
        description: `Records income earned ${saleOrder.totalAmount} from selling goods`,
        debit: 0,
        credit: saleOrder.totalAmount,
      },
      {
        accountId: accountCustomerReceivable._id,
        description: `Tracks money ${saleOrder.totalAmount} owed by customers for credit sales`,
        debit: saleOrder.totalAmount,
        credit: 0,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    message: "Sale order delivered and stock updated",
  });
});
