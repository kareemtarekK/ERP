const express = require("express");
const installmentRouter = express.Router();
const {
  getAllInstallments,
  getInstallment,
  deleteInstallment,
} = require("./../controllers/loanInstallmentController");
installmentRouter.get("/", getAllInstallments);
installmentRouter
  .route("/:installmentId")
  .get(getInstallment)
  .delete(deleteInstallment);
module.exports = installmentRouter;
