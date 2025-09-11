const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./routers/userRouter");
const organizationRouter = require("./routers/organizationRouter");
const productRouter = require("./routers/productRouter.js");
const customerRouter = require("./routers/customerRouter.js");
const authRouter = require("./authRouters/authRouter");
const globalErrorHandling = require("./utils/globalErrorHandling");
const AppError = require("./utils/appError");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/organizations", organizationRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/", (req, res, next) => {
  res.send("Welcome");
});
app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandling);
module.exports = app;
