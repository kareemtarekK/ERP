const cron = require("node-cron");
const Employees = require("./../models/employeesModel");
const Attendance = require("./../models/attendanceModel");
const Payroll = require("./../models/payrollModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
exports.createAttendence = () => {
  cron.schedule("0 9 * * 0-4", async (req, res, next) => {
    const employees = await Employees.find();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (const employee of employees) {
      const existing = await Attendance.findOne({
        employee: employee._id,
        date: today,
      });
      if (!existing) {
        await Attendance.create({
          employee: employee._id,
          date: today,
          status: "absent",
        });
      }
    }
  });
};

exports.createMonthlyPayrolls = () => {
  cron.schedule("0 0 1 * *", async (req, res, next) => {
    const employees = await Employees.find();
    for (let employee of employees) {
      await Payroll.create({
        employee: employee._id,
        date: new Date(new Date().getFullYear(), new Date().getMonth(), 30),
        salary: employee.salary,
      });
    }
  });
};

exports.getDailyAttendence = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const attendences = await Attendance.find({
    date: today,
  }).populate("employee");
  res.status(200).json({
    status: "success",
    length: attendences.length,
    data: {
      attendences,
    },
  });
});

exports.checkIn = catchAsync(async (req, res, next) => {
  const { attendanceId } = req.params;
  if (!attendanceId) return next(new AppError("provide attendance id", 400));
  const attendance = await Attendance.findById(attendanceId);
  if (!attendance)
    return next(new AppError("No attendance found on system", 404));
  attendance.status = "present";
  attendance.checkIn = new Date();
  await attendance.save();
  res.status(200).json({
    status: "success",
    message: "employee is checked-in successfully",
  });
});

exports.checkOut = catchAsync(async (req, res, next) => {
  const { attendanceId } = req.params;
  if (!attendanceId) return next(new AppError("provide attendance id", 400));
  const attendance = await Attendance.findById(attendanceId);
  if (!attendance)
    return next(new AppError("No attendance found on system", 404));
  attendance.status = "checked-out";
  attendance.checkOut = new Date();
  await attendance.save();
  res.status(200).json({
    status: "success",
    message: "employee is checked-out successfully",
  });
});

exports.getMonthlyAttendance = catchAsync(async (req, res, next) => {
  const employees = await Employees.find();
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);
  let finalAttendances = [];
  for (let employee of employees) {
    const attendances = await Attendance.find({
      employee: employee._id,
      date: { $gte: start, $lt: end },
    }).select("data status");
    finalAttendances.push({ employee, attendances });
  }
  res.status(200).json({
    status: "success",
    results: finalAttendances.length,
    data: {
      finalAttendances,
    },
  });
});

exports.getAllAttendancesAtDay = catchAsync(async (req, res, next) => {
  const { day } = req.params;
  if (!day) return next(new AppError("provide a day", 500));
  const targetDay = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    day
  );
  const startOfDay = new Date(targetDay);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDay);
  endOfDay.setHours(23, 59, 59, 999);
  const attendances = await Attendance.find({
    date: { $gte: startOfDay, $lte: endOfDay },
  }).populate({
    path: "employee",
    select: "name",
  });
  res.status(200).json({
    status: "success",
    results: attendances.length,
    data: {
      attendances,
    },
  });
});
exports.getAllAttendances = catchAsync(async (req, res, next) => {
  const attendances = await Attendance.find().populate({
    path: "employee",
    select: "name",
  });
  res.status(200).json({
    status: "success",
    results: attendances.length,
    data: {
      attendances,
    },
  });
});
