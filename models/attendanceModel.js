const mongoose = require("mongoose");
const Employee = require("./../models/employeesModel");
const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employees",
    },
    date: Date,
    checkIn: Date,
    checkOut: Date,
    totalHours: Number,
    overtime: Number,
    deduction: Number,
    status: {
      type: String,
      enum: {
        values: ["absent", "present", "checked-out"],
        message: `{VALUE} should be from ["absent", "present", "late", "checked-out" , 'leave']`,
      },
    },
  },
  { timestamps: true }
);

attendanceSchema.pre("save", async (req, res, next) => {
  if (this.checkIn && this.checkOut) {
    this.totalHours = (this.checkOut - this.checkIn) / (1000 * 60 * 60);
    const employee = await Employee.findById(this.employee);
    const { start, end } = employee.shift;
    const fixedHours = (end - start) / (1000 * 60 * 60);
    if (this.totalHours - fixedHours > 0) {
      this.overtime = this.totalHours - fixedHours;
    }
    if (this.totalHours - fixedHours < 0) {
      this.deduction = this.totalHours - fixedHours;
    }
  }
  next();
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
