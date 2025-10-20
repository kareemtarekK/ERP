const express = require("express");
const {
  getAllLoanInstallment,
  getLoanInstallment,
  deleteLoanInstallment,
} = require("./../controllers/loanInvestmentController");
const loanInvestmentRouter = express();

loanInvestmentRouter.route("/").get(getAllLoanInstallment);

loanInvestmentRouter
  .route("/:loanInvestmentId")
  .get(getLoanInstallment)
  .delete(deleteLoanInstallment);

module.exports = loanInvestmentRouter;
