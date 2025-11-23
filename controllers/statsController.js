const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const JornalEntry = require("./../models/jornalEntryModel");
const Account = require("./../models/accountingModel");
const SaleInvoice = require("./../models/saleInvoiceModel");
const PurchaseInvoice = require("./../models/purchaseInvoiceModel");
const InvoicePayment = require("./../models/purchaseInvoicePaymentModel");
const Payroll = require("./../models/payrollModel");
const SaleOrder = require("./../models/saleOrderModel");
const Product = require("./../models/productModel");

exports.getAllStats = catchAsync(async (req, res, next) => {
  const jornalEntries = await JornalEntry.find();
  let totalRevenue = 0;
  let totalExpenses = 0;
  let totalProfit = 0;
  let totalBank = 0;
  let totalReceivable = 0;
  let totalPayable = 0;
  let totalGrosssProfit = 0;
  let netProfit = 0;
  for (let jornal of jornalEntries) {
    const { lines } = jornal;
    for (let account of lines) {
      // id for sales revenue
      if (account.accountId == "68f7aa37ca9c11d20f73e216") {
        totalRevenue += account.credit;
      }
      // id for purchase expenses
      if (account.accountId == "68f7c1cab88c0da2d5579bea") {
        totalExpenses += account.debit;
      }
      // id for shipping
      if (account.accountId == "6919e94083bdffcbad65cacc") {
        totalExpenses += account.debit;
      }
      // id for hr salaries
      if (account.accountId == "691dd0dad78aa8ff882ce606") {
        totalExpenses += account.debit;
      }
    }
  }
  totalProfit = totalRevenue - totalExpenses;
  const bank = await Account.findById("68efb30d10ece820d2f077dc");
  totalBank = bank.amount + totalProfit;
  const expectedReceivable = await SaleInvoice.find({
    paymentStatus: "unpaid",
  });
  totalReceivable = expectedReceivable.reduce(
    (acc, cur) => acc + cur.totalPayment,
    0
  );

  const invoices = await PurchaseInvoice.find();
  for (let invoice of invoices) {
    const payments = await InvoicePayment.find({ invoice: invoice._id });
    if (payments.length > 0) {
      const lastPayment = payments[payments.length - 1];
      totalPayable += lastPayment.remainingAmount;
    }
  }
  const payrolls = await Payroll.find({ status: "unpaid" });
  totalPayable += payrolls.reduce((acc, cur) => acc + cur.total, 0);

  let totalSaleAmount = 0;
  const salesOrders = await SaleOrder.find();
  for (let saleOrder of salesOrders) {
    const { products } = saleOrder;
    for (let product of products) {
      totalSaleAmount += product.total;
    }
  }
  //   console.log(totalSaleAmount);
  const products = await Product.find();
  let totalProductsAmount = products.reduce((acc, cur) => acc + cur.price, 0);
  totalGrosssProfit = totalSaleAmount - totalProductsAmount;
  res.status(200).json({
    status: "success",
    data: {
      totalRevenue,
      totalExpenses,
      totalProfit,
      totalBank,
      totalReceivable,
      totalPayable,
      totalGrosssProfit,
      netProfit: totalProfit,
    },
  });
});
