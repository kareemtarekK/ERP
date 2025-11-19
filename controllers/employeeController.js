const catchAysnc = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Employee = require("./../models/employeesModel");
const Payroll = require("./../models/payrollModel");

exports.createEmployee = catchAysnc(async (req, res, next) => {
  req.body.avatar = req.file.path;
  const employee = await Employee.create(req.body);
  await Payroll.create({
    employee: employee._id,
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 30),
    salary: employee.salary,
  });
  res.status(201).json({
    status: "success",
    data: {
      employee,
    },
  });
});

exports.getAllEmployees = catchAysnc(async (req, res, next) => {
  const employees = await Employee.find().select("-__v");
  res.status(200).json({
    status: "success",
    length: employees.length,
    data: {
      employees,
    },
  });
});

exports.getEmployee = catchAysnc(async (req, res, next) => {
  const { employeeId } = req.params;
  if (!employeeId) return next(new AppError("provide employee id", 400));
  const employee = await Employee.findById(employeeId);
  if (!employee)
    return next(new AppError("No employee found with that id on system", 404));
  res.status(200).json({
    status: "success",
    data: {
      employee,
    },
  });
});

exports.updateEmployee = catchAysnc(async (req, res, next) => {
  const { employeeId } = req.params;
  if (!employeeId) return next(new AppError("provide employee id", 400));
  const employee = await Employee.findById(employeeId);
  if (!employee)
    return next(new AppError("No employee found with that id on system", 404));
  const updatedEmployee = await Employee.findByIdAndUpdate(
    employeeId,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      updatedEmployee,
    },
  });
});

exports.deleteEmployee = catchAysnc(async (req, res, next) => {
  const { employeeId } = req.params;
  if (!employeeId) return next(new AppError("provide employee id", 400));
  const employee = await Employee.findById(employeeId);
  if (!employee)
    return next(new AppError("No employee found with that id on system", 404));
  await Employee.findByIdAndDelete(employeeId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
