const Organization = require("../models/organizationModel");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
exports.createOrganization = catchAsync(async (req, res, next) => {
  const newOrganization = await Organization.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newOrganization,
    },
  });
});
exports.getOrganization = catchAsync(async (req, res, next) => {
  const { organizationId } = req.params;
  if (!organizationId) return next(new AppError("Please provide id", 500));
  const organization = await Organization.findById(organizationId).populate(
    "customers"
  );
  if (!organization)
    return next(new AppError("No organization found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      organization,
    },
  });
});
