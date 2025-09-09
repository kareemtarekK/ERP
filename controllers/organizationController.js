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
