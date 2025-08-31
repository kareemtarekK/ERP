const express = require("express");
const app = express();
const userRouter = require("./routers/userRouter");
const authRouter = require("./authRouters/authRouter");
const globalErrorHandling = require("./utils/globalErrorHandling");
const AppError = require("./utils/appError");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/", (req, res, next) => {
  res.send("Welcome");
});
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandling);
module.exports = app;
