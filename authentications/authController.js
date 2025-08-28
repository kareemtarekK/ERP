const crypto = require("crypto");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/sendEmail");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET_STRING, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.login = catchAsync(async (req, res, next) => {
  // check if there is an email or a password
  if (!req.body.email || !req.body.password) {
    return next(new AppError("Please provide email and password", 400));
  }
  // if there is an email get user from database
  const user = await User.findOne({ email: req.body.email });
  if (
    !user ||
    !(await user.correctPassword(req.body.password, user.password))
  ) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const token = createToken(user);
  res.status(200).json({
    status: "success",
    data: {
      token,
    },
  });
});
// forgetpassword
exports.forgetPassword = catchAsync(async (req, res, next) => {
  // check if there is an email
  if (!req.body.email) {
    return next(new AppError("Please provide an email", 400));
  }
  // get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email", 404));
  }
  // create random reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  // encrypt reset code
  const hashRestCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = hashRestCode;
  user.passwordResetCodeExpires = Date.now() + 1 * 60 * 1000;
  user.passwordRestVerified = false;
  // save user after adding these new data
  await user.save({ validateBeforeSave: false });
  // send reset code via email
  const options = {
    email: user.email,
    subject: "Your password reset code (valid for 10 min)",
    message: `Hi ${user.tradeName}\n we received a request to reset your password on El-motakamel \n ${resetCode} \n Enter this code to compelete the reset`,
  };

  try {
    await sendEmail(options);
  } catch (err) {
    user.paswordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordRestVerified = undefined;
    user.save({ validateBeforeSave: false });
    console.log(err.message);
  }

  res.status(200).json({
    status: "success",
    message: "Reset code send to your email successfully",
  });
});
exports.verifiedCode = catchAsync(async (req, res, next) => {
  const hasedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    paswordResetCode: hasedResetCode,
    passwordResetCodeExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Invalid reset code or expired", 400));
  }
  user.passwordRestVerified = true;
  user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    passwordRestVerified: true,
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1- get user based on the email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("User not found", 404));
  if (!user.passwordRestVerified)
    return next(new AppError("You are not allowed to change password", 401));
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.paswordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  user.passwordRestVerified = undefined;
  await user.save();
  const token = createToken(user);
  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
    data: {
      token,
    },
  });
});
