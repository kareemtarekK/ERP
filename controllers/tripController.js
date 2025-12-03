const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Trip = require("./../models/tripModel");

exports.createTrip = catchAsync(async (req, res, next) => {
  const trip = Trip.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      trip,
    },
  });
});

exports.getAlltrips = catchAsync(async (req, res, next) => {
  const trips = await Trip.find().populate({
    path: "representative",
    select: "region",
  });
  res.status(200).json({
    status: "success",
    length: trips.length,
    data: {
      trips,
    },
  });
});

exports.getTrip = catchAsync(async (req, res, next) => {
  const { tripId } = req.params;
  if (!tripId) return next(new AppError("provide trip id", 400));
  const trip = await Trip.findById(tripId);
  if (!trip) return next(new AppError("No trip found on system", 404));
  res.status(200).json({
    status: "success",
    data: {
      trip,
    },
  });
});

exports.updateTrip = catchAsync(async (req, res, next) => {
  const { tripId } = req.params;
  if (!tripId) return next(new AppError("provide trip id", 400));
  const trip = await Trip.findById(tripId);
  if (!trip) return next(new AppError("No trip found on system", 404));
  const updatedTrip = await Trip.findByIdAndUpdate(tripId, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedTrip,
    },
  });
});

exports.deleteTrip = catchAsync(async (req, res, next) => {
  const { tripId } = req.params;
  if (!tripId) return next(new AppError("provide trip id", 400));
  const trip = await Trip.findById(tripId);
  if (!trip) return next(new AppError("No trip found on system", 404));
  await Trip.findByIdAndDelete(tripId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.completeTrip = catchAsync(async (req, res, next) => {
  const { tripId } = req.params;
  if (!tripId) return next(new AppError("provide trip id", 400));
  const trip = await Trip.findById(tripId);
  if (!trip) return next(new AppError("No trip found on system", 404));
  trip.status = "completed";
  trip.expenseses = req.body.expenseses;
  await trip.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "trip completed successfully",
  });
});
