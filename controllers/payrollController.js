const Payroll = require("./../models/payrollModel");
const Attendance = require("./../models/attendanceModel");
const Account = require("./../models/accountingModel");
const JornalEntry = require("./../models/jornalEntryModel");
const JornalPayroll = require("./../models/jornalModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Employee = require("../models/employeesModel");
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

exports.payEmployeePayroll = catchAsync(async (req, res, next) => {
  const { payrollId } = req.params;
  if (!payrollId) return next(new AppError("provide employee id", 400));
  const payroll = await Payroll.findById(payrollId).populate({
    path: "employee",
    select: "name",
  });
  if (!payroll) return next(new AppError("No employee found on system", 404));

  if (payroll.status === "paid") {
    return next(new AppError("sorry, salary is paid before", 400));
  }

  payroll.status = "paid";
  payroll.save({ validateBeforeSave: false });

  const bankAccount = await Account.findOne({ name: "cash/bank" });
  const payrollAccount = await Account.findOne({ name: "HR Salaries" });
  const jornalPayroll = await JornalPayroll.findOne({
    jornalType: "payroll/payment",
  });
  await JornalEntry.create({
    jornalId: jornalPayroll._id,
    lines: [
      {
        account: bankAccount._id,
        description: `Payroll payment for employee ${
          payroll.employee.name
        } for the period ${payroll.date.toLocaleDateString()}. 
Amount: ${payroll.total} has been paid from Cash/Bank account.`,
        debit: 0,
        credit: payroll.total,
      },
      {
        account: payrollAccount._id,
        description: `Payroll expense recorded for employee ${
          payroll.employee.name
        } for the period ${payroll.date.toLocaleDateString()}. 
Amount: ${payroll.total} has been paid from Cash/Bank account.`,
        debit: payroll.total,
        credit: 0,
      },
    ],
  });
  res.status(200).json({
    status: "success",
    message: `${payroll.employee.name}'s salary payed successfully and jornal entry created`,
  });
});
