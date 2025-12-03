const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const SaleOrderInTrip = require("./../models/saleOrderInTripModel");
const Trip = require("./../models/tripModel");

exports.createSaleOrderInTrip = catchAsync(async (req, res, next) => {
  const { customer, orderDate, goods } = req.body;
  const { tripId } = req.params;
  if (!tripId) return next(new AppError("provide trip id", 400));
  const trip = await Trip.findOne({
    _id: tripId,
    status: "completed",
  });
  if (!trip) return next(new AppError("No trip found on system", 404));
  const products = goods.map((product) => {
    return {
      product: product.product,
      code: product.code,
      unit: product.unit,
      price: product.price,
      discount: product.discount,
      total:
        product.price * product.unit -
        (product.discount / 100) * (product.price * product.unit),
    };
  });

  const totalSales = goods.reduce((acc, cur) => acc + cur.total, 0);
  trip.sales = totalSales;
  await trip.save({ validateBeforeSave: false });
  const saleOrderInTrip = SaleOrderInTrip.create({
    customer,
    orderDate,
    goods: products,
    total: totalSales,
  });
  res.status(201).json({
    status: "success",
    message: "add sales to trip successfully",
    data: {
      saleOrderInTrip,
    },
  });
});

exports.getAllSaleOrderInTrip = catchAsync(async (req, res, next) => {
  const salesOrderIntrip = await SaleOrderInTrip.find();
  res.status(200).json({
    status: "success",
    data: {
      salesOrderIntrip,
    },
  });
});

exports.getSaleOrderInTrip = catchAsync(async (req, res, next) => {
  const { saleId } = req.params;
  if (!saleId) return next(new AppError("provide trip id", 400));
  const saleOrderInTrip = await SaleOrderInTrip.findOne(saleId);
  if (!saleOrderInTrip)
    return next(new AppError("No trip found on system", 404));
  res.status(200).json({
    status: "success",
    data: {
      saleOrderInTrip,
    },
  });
});
