const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const SaleOrder = require("./../models/saleOrderModel");
const Product = require("../models/productModel");
const SaleOrderInvoice = require("./../models/saleInvoiceModel");

exports.createSaleOrderInvoice = catchAsync(async (req, res, next) => {
  const { saleOrderId } = req.params;
  if (!saleOrderId) return next(new AppError("provide sale order id", 400));
  const saleOrder = await SaleOrder.findById(saleOrderId);
  if (!saleOrder)
    return next(new AppError("No sale order found on system", 404));

  const products = await Promise.all(
    saleOrder.products.map(async (product) => {
      const { code } = await Product.findById(product.productId);
      return {
        product: product.productId,
        code,
        quantity: product.quantity,
        price: product.price,
        discount: product.discount,
        tax: product.tax,
        total: product.total,
        inventory: product.inventoryId,
      };
    })
  );

  const saleOrderInvoice = await SaleOrderInvoice.create({
    invoiceNumber: saleOrder.invoiceNumber,
    customer: saleOrder.customerId,
    organization: saleOrder.organizationId,
    saleOrderId: saleOrder._id,
    products,
    notes: req.body.notes,
    createdBy: saleOrder.createdBy,
    totalPayment: saleOrder.totalAmount,
  });

  res.status(201).json({
    status: "success",
    data: {
      saleOrderInvoice,
    },
  });
});

exports.getAllSaleOrderInvoices = catchAsync(async (req, res, next) => {
  const saleOrderInvoices = await SaleOrderInvoice.find().select("-__v");
  res.status(200).json({
    status: "success",
    data: {
      saleOrderInvoices,
    },
  });
});

exports.getSaleOrderInvoice = catchAsync(async (req, res, next) => {
  const { invoiceId } = req.params;
  if (!invoiceId) return next(new AppError("provide sale order id", 400));
  const saleOrderInvoice = await SaleOrderInvoice.findById(invoiceId).select(
    "-__v"
  );
  if (!saleOrderInvoice)
    return next(
      new AppError("No sale order with this id found on system", 404)
    );
  res.status(200).json({
    status: "success",
    data: {
      saleOrderInvoice,
    },
  });
});

exports.updateSaleOrderInvoice = catchAsync(async (req, res, next) => {
  const { invoiceId } = req.params;
  if (!invoiceId) return next(new AppError("provide sale order id", 400));
  const saleOrderInvoice = await SaleOrderInvoice.findById(invoiceId);
  if (!saleOrderInvoice)
    return next(
      new AppError("No sale order with this id found on system", 404)
    );

  const updatedSaleOrderInvoice = await SaleOrderInvoice.findByIdAndUpdate(
    invoiceId,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      updatedSaleOrderInvoice,
    },
  });
});

exports.deleteSaleOrderInvoice = catchAsync(async (req, res, next) => {
  const { invoiceId } = req.params;
  if (!invoiceId) return next(new AppError("provide sale order id", 400));
  const saleOrderInvoice = await SaleOrderInvoice.findById(invoiceId);
  if (!saleOrderInvoice)
    return next(
      new AppError("No sale order with this id found on system", 404)
    );

  await SaleOrderInvoice.findByIdAndDelete(saleOrderInvoice);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
