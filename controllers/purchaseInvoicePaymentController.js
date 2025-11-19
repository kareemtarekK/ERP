const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const PurchaseInvoicePayment = require("./../models/purchaseInvoicePaymentModel");
const PurchaseInvoice = require("./../models/purchaseInvoiceModel");
const Account = require("./../models/accountingModel");
const JornalEntry = require("./../models/jornalEntryModel");
const Jornal = require("./../models/jornalModel");

// create invoice payment
exports.createInvoicePayment = catchAsync(async (req, res, next) => {
  const { invoiceId } = req.params;
  if (!invoiceId) return next(new AppError("provide invoice id", 500));
  const invoice = await PurchaseInvoice.findById(invoiceId);
  if (!invoice) return next(new AppError("No invoice found with that id", 404));
  let payedInvoice;
  const allInvoicePayment = await InvoicePayment.find({
    supplier: invoice.supplier,
    invoice: invoice._id,
  });
  const invoicePayment = allInvoicePayment[allInvoicePayment.length - 1];
  if (invoicePayment) {
    const remaining = invoicePayment.remainingAmount;
    payedInvoice = await InvoicePayment.create({
      supplier: invoice.supplier,
      invoice: invoice._id,
      amount: req.body.amount,
      remainingAmount: remaining - req.body.amount,
    });
  } else {
    payedInvoice = await InvoicePayment.create({
      supplier: invoice.supplier,
      invoice: invoice._id,
      amount: req.body.amount,
      remainingAmount: invoice.totalPayment - req.body.amount,
    });
  }
  const debitAccount = await Account.findOne({ name: "supplier (AP)" });
  const creditAccount = await Account.findOne({ name: "cash/bank" });
  const jornal = await Jornal.findOne({ jornalType: "invoice/payment" });
  await JornalEntry.create({
    jornalId: jornal._id,
    lines: [
      {
        accountId: debitAccount._id,
        description: `Paying ${req.body.amount} of purchase invoice to supplier`,
        debit: req.body.amount,
        credit: 0,
      },
      {
        accountId: creditAccount._id,
        description: `Cash/Bank payed ${req.body.amount} for purchase invoice`,
        debit: 0,
        credit: req.body.amount,
      },
    ],
  });
  if (Math.floor(payedInvoice.remainingAmount) === 0) {
    invoice.paymentStatus = "paid";
    await invoice.save({ validateBeforeSave: false });
  } else {
    invoice.paymentStatus = "partial";
    await invoice.save({ validateBeforeSave: false });
  }

  res.status(201).json({
    status: "success",
    data: {
      payedInvoice,
    },
  });
});
// get all payed installments for a specific invoice
exports.getAllPayedInstallments = catchAsync(async (req, res, next) => {
  const { invoiceId } = req.params;
  if (!invoiceId) return next(new AppError("provide invoice id", 500));
  const AllPayedInstallments = await InvoicePayment.find({
    invoice: invoiceId,
  })
    .populate({
      path: "supplier",
      select: "name",
    })
    .populate({
      path: "invoice",
      select: "products totalPayment paymentStatus",
    });
  res.status(200).json({
    status: "success",
    results: AllPayedInstallments.length,
    data: {
      AllPayedInstallments,
    },
  });
});
