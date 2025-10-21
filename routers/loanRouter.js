const express = require("express");
const loanRouter = express.Router();
const {
  createLoan,
  getAllLoans,
  getLoan,
  updateLoan,
  deleteLoan,
  markAsApproved,
} = require("./../controllers/loanController");
loanRouter.route("/").post(createLoan).get(getAllLoans);
loanRouter.route("/:loanId").get(getLoan).patch(updateLoan).delete(deleteLoan);
loanRouter.get("/:loanId/status=approved", markAsApproved);
module.exports = loanRouter;
