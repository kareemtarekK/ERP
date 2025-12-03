const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const TripInvoice = require("./../models/tripInvoiceModel");
const Jornal = require("./../models/jornalModel");
const JornalEntry = require("./../models/jornalEntryModel");
const Account = require("./../models/accountingModel");

exports.createTripInvoice = catchAsync(async (req, res, next) => {
  const { saleOrderId } = req.params;
  const tripInvoice = await TripInvoice.create(saleOrderId);

  const tripinvoice = await TripInvoice.findById(tripInvoice._id).populate(
    "saleOrderId"
  );

  const total = tripinvoice.saleOrderId.total;
  const jornal = await Jornal.findOne({ jornalType: "sales" });
  const accountRevenue = await Jornal.findOne({ name: "sales-revenue" });
  const accountCustomerReceivable = await Jornal.findOne({
    name: "cash/bank",
  });
  await JornalEntry.create({
    jornalId: jornal._id,
    lines: [
      {
        accountId: accountRevenue._id,
        description: `Records income earned ${total} from selling goods`,
        debit: 0,
        credit: total,
      },
      {
        accountId: accountCustomerReceivable._id,
        description: `Tracks money ${total} owed by customers for credit sales`,
        debit: total,
        credit: 0,
      },
    ],
  });

  res.status(201).json({
    status: "success",
    data: {
      tripInvoice,
    },
  });
});

exports.getAllTripInvioces = catchAsync(async (req, res, next) => {
  const tripInvoices = await TripInvoice.find().populate("saleOrderId");
  res.status(200).json({
    status: "success",
    length: tripInvoices.length,
    data: {
      tripInvoices,
    },
  });
});
