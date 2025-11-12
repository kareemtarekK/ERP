const Payroll = require("./../models/payrollModel");
const Attendance = require("./../models/attendanceModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// get all payrolls
exports.getAllPayrolls = catchAsync(async (req, res, next) => {
  const payrolls = await Payroll.find().populate({
    path: "employee",
    select: "name ",
  });
  res.status(200).json({
    status: "success",
    results: payrolls.length,
    data: {
      payrolls,
    },
  });
});
// update payroll
exports.updatePayroll = catchAsync(async (req, res, next) => {
  const { payrollId } = req.params;
  if (!payrollId) return next(new AppError("provide payroll id", 500));
  const updatedPayroll = await Payroll.findByIdAndUpdate(payrollId, req.body, {
    runValidators: true,
    new: true,
  });
  const payroll = await Payroll.findById(payrollId);
  if (req.body.bonus) {
    payroll.bonus = req.body.bonus;
    payroll.total += req.body.bonus.amount;
    await payroll.save({ validateBeforeSave: false });
  }
  if (req.body.deduction) {
    payroll.deduction = req.body.deduction;
    payroll.total += req.body.deduction.amount;
    await payroll.save({ validateBeforeSave: false });
  }
  if (req.body.overtime) {
    payroll.overtime = req.body.overtime;
    payroll.total += req.body.overtime;
    await payroll.save({ validateBeforeSave: false });
  }
  if (!updatedPayroll)
    return next(new AppError("no payroll found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatedPayroll,
    },
  });
});
