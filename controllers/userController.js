const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../services/sendEmail");
const { text } = require("express");
exports.register = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_STRING, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  await sendEmail({
    email: newUser.email,
    subject: "Welcome to our ERP system",
    message: `Hello ${newUser.fullname},\n\nWelcome to our ERP system! We're excited to have you on board.\n\nBest regards,\nThe ERP Team`,
  });
  res.status(201).json({
    status: "success",
    data: {
      newUser,
      token,
    },
  });
});
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
});
