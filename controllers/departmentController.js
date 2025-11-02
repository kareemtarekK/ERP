const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Department = require("./../models/departmentModel");

exports.createDepartment = catchAsync(async (req, res, next) => {
  const department = Department.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      department,
    },
  });
});

exports.getAllDepartments = catchAsync(async (req, res, next) => {
  const departments = await Department.find().select("-__v");
  res.status(201).json({
    status: "success",
    length: departments.length,
    data: {
      departments,
    },
  });
});

exports.getDepartment = catchAsync(async (req, res, next) => {
  const { departmentId } = req.params;
  if (!departmentId) return next(new AppError("provide employee id", 400));
  const department = await Department.findById(departmentId);
  if (!department)
    return next(
      new AppError("No department found with that id on system", 404)
    );
  res.status(200).json({
    status: "success",
    data: {
      department,
    },
  });
});

exports.updateDepartment = catchAsync(async (req, res, next) => {
  const { departmentId } = req.params;
  if (!departmentId) return next(new AppError("provide employee id", 400));
  const department = await Department.findById(departmentId);
  if (!department)
    return next(
      new AppError("No department found with that id on system", 404)
    );
  const updatedDepartment = await Department.findByIdAndUpdate(
    departmentId,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      updatedDepartment,
    },
  });
});

exports.deleteDepartment = catchAsync(async (req, res, next) => {
  const { departmentId } = req.params;
  if (!departmentId) return next(new AppError("provide employee id", 400));
  const department = await Department.findById(departmentId);
  if (!department)
    return next(
      new AppError("No department found with that id on system", 404)
    );
  await Department.findByIdAndDelete(departmentId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
