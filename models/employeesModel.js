const mongoose = require("mongoose");
const employeesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "enter your name"],
      trim: true,
    },
    avatar: String,
    jobTitle: {
      type: String,
      required: [true, "enter your job title"],
    },
    nationalId: {
      type: String,
      required: [true, "enter national id"],
    },
    address: String,
    email: {
      type: String,
      required: [true, "enter your email"],
    },
    phone: {
      type: String,
      required: [true, "enter your phone number"],
    },
    birthDate: Date,
    alternativePhone: String,
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "select your department"],
    },
    workLocation: {
      type: String,
      required: [true, "select your work location"],
    },
    shift: {
      start: Date,
      end: Date,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "select your role"],
    },
    levelOfExperience: {
      type: String,
      required: [true, "select your level of experience"],
    },
    employmentType: {
      type: String,
      required: [true, "select your employment type"],
      enum: {
        values: [
          "full_time",
          "part_time",
          "contractor",
          "intern",
          "temporary",
          "casual",
          "freelancer",
          "probation",
        ],
        message:
          "your {VALUE} should be from  'full_time' 'part_time' 'contractor' 'intern' 'temporary' 'casual' 'freelancer' 'probation'",
      },
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager",
      required: [true, "determine your manager"],
    },
    salary: {
      type: Number,
      required: [true, "enter employee salary"],
    },
    employmentDate: {
      type: Date,
      required: [true, "enter employment date"],
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeesSchema);

module.exports = Employee;
