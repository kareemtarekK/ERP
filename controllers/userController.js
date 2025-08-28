const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { status } = require("express/lib/response");
exports.register = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_STRING, {
    expiresIn: process.env.JWT_EXPIRES_IN,
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
