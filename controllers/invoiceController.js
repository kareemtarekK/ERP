const Invoice = require("../models/invoiceModel");
const PurchaseOrder = require("./../models/purchaseOrderModel");
const Product = require("../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.createInvoice = catchAsync(async (req, res, next) => {
  const { purchaseOrderId } = req.params;
  if (!purchaseOrderId)
    return next(new AppError("provide purchase order id", 400));
  const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
  if (!purchaseOrder)
    return next(
      new AppError("No purchase order with this id found on system", 404)
    );
  if (purchaseOrder.status != "delivered")
    return next(
      new AppError("can`t generate invoice for undelivered purchase order", 400)
    );

  const products = await Promise.all(
    purchaseOrder.products.map(async (product) => {
      const { code } = await Product.findById(product.productId);
      const tax = 0.14;
      const total = product.total + product.total * tax;
      return {
        product: product.productId,
        code,
        deliveredQuantity: product.quantity,
        quantity: product.quantity,
        price: product.price,
        tax,
        total,
        inventory: product.inventoryId,
      };
    })
  );

  const totalPayment = products.reduce((acc, cur) => acc + cur.total, 0);

  const invoice = await Invoice.create({
    invoiceNumber: purchaseOrder.invoiceNumber,
    purchaseOrderId,
    supplier: purchaseOrder.supplierId,
    organization: purchaseOrder.organizationId,
    products,
    notes: req.body.notes,
    totalPayment,
  });
  res.status(201).json({
    status: "success",
    data: {
      invoice,
    },
  });
});

exports.getAllInvoices = catchAsync(async (req, res, next) => {
  const invoices = await Invoice.find().select("-__v");
  res.status(200).json({
    status: "success",
    data: {
      invoices,
    },
  });
});

exports.getInvoice = catchAsync(async (req, res, next) => {
  const { invoiceId } = req.params;
  if (!invoiceId) return next(new AppError("provide invoice id", 400));
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice)
    return next(new AppError("No invoice on system with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      invoice,
    },
  });
});

exports.updateInvoice = catchAsync(async (req, res, next) => {
  const { invoiceId } = req.params;
  if (!invoiceId) return next(new AppError("provide invoice id", 400));
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice)
    return next(new AppError("No invoice on system with that id", 404));
  const updatedInvoice = await Invoice.findByIdAndUpdate(invoiceId, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedInvoice,
    },
  });
});

exports.deleteInvoice = catchAsync(async (req, res, next) => {
  const { invoiceId } = req.params;
  if (!invoiceId) return next(new AppError("provide invoice id", 400));
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice)
    return next(new AppError("No invoice on system with that id", 404));
  await Invoice.findByIdAndDelete(invoiceId);
  res.status(204).json({
    staus: "success",
    data: null,
  });
});
