const crypto = require("crypto");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/sendEmail");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require("util");

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET_STRING, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const sendTokenViaCookie = (user, res, statusCode) => {
  const token = createToken(user);
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
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
  sendTokenViaCookie(user, res, 200);
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
  user.passwordResetCodeExpires = Date.now() + 2 * 60 * 1000;
  // save user after adding these new data
  await user.save({ validateBeforeSave: false });
  // send reset code via email
  const options = {
    email: user.email,
    subject: "Your password reset code (valid for 2 min)",
    message: `Hi ${user.tradeName}\n we received a request to reset your password on El-motakamel \n ${resetCode} \n Enter this code to compelete the reset`,
  };

  try {
    await sendEmail(options);
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetVerified = undefined;
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
    passwordResetCode: hasedResetCode,
    passwordResetCodeExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Invalid reset code or expired", 400));
  }
  user.passwordResetVerified = true;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    passwordResetVerified: true,
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1- get user based on the email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("User not found", 404));
  if (!user.passwordResetVerified)
    return next(new AppError("You are not allowed to change password", 401));
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();
  sendTokenViaCookie(user, res, 200);
});
// protect
exports.protect = catchAsync(async (req, res, next) => {
  // check if there is a token via headers
  let tokenHeader;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    tokenHeader = req.headers.authorization.split(" ")[1];
  else if (req.cookies.jwt) tokenHeader = req.cookies.jwt;
  if (!tokenHeader)
    return next(
      new AppError(
        "You are not authenticated to access this route, try login again",
        401
      )
    );

  // verify token
  const decoded = await promisify(jwt.verify)(
    tokenHeader,
    process.env.JWT_SECRET_STRING
  );
  // get user based on the decoded token
  const loggedUser = await User.findById(decoded.id);
  if (!loggedUser)
    return next(
      new AppError(
        "User belongs to this token does not exist, register again",
        401
      )
    );
  // check if user change his password after the token was issued
  if (loggedUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User changed his password after token was issued, please login again",
        401
      )
    );
  }
  req.user = loggedUser;
  next();
});
