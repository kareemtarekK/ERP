const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Role = require("./../models/roleModel");

exports.createRole = catchAsync(async (req, res, next) => {
  const role = await Role.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      role,
    },
  });
});

exports.getAllRoles = catchAsync(async (req, res, next) => {
  const roles = await Role.find().select("-__v");
  res.status(200).json({
    status: "success",
    length: roles.length,
    data: {
      roles,
    },
  });
});

exports.getRole = catchAsync(async (req, res, next) => {
  const { roleId } = req.params;
  if (!roleId) return next(new AppError("provide role id", 400));
  const role = await Role.findById(roleId);
  if (!role)
    return next(new AppError("No role found with that id on system", 404));
  res.status(200).json({
    status: "success",
    data: {
      role,
    },
  });
});

exports.updateRole = catchAsync(async (req, res, next) => {
  const { roleId } = req.params;
  if (!roleId) return next(new AppError("provide role id", 400));
  const role = await Role.findById(roleId);
  if (!role)
    return next(new AppError("No role found with that id on system", 404));

  const updatedRole = await Role.findByIdAndUpdate(roleId, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      updatedRole,
    },
  });
});

exports.deleteRole = catchAsync(async (req, res, next) => {
  const { roleId } = req.params;
  if (!roleId) return next(new AppError("provide role id", 400));
  const role = await Role.findById(roleId);
  if (!role)
    return next(new AppError("No role found with that id on system", 404));
  await Role.findByIdAndDelete(roleId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
