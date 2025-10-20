const express = require("express");
<<<<<<< HEAD
const loanRouter = express.Router();
=======
>>>>>>> 8399e3a94b1ba10c322566691970d34a52619f99
const {
  createLoan,
  getAllLoans,
  getLoan,
  updateLoan,
  deleteLoan,
  markAsApproved,
} = require("./../controllers/loanController");
<<<<<<< HEAD
loanRouter.route("/").post(createLoan).get(getAllLoans);
loanRouter.route("/:loanId").get(getLoan).patch(updateLoan).delete(deleteLoan);
loanRouter.get("/:loanId/status=approved", markAsApproved);
=======
const loanRouter = express();

loanRouter.route("/").post(createLoan).get(getAllLoans);
loanRouter.route("/:loanId").get(getLoan).patch(updateLoan).delete(deleteLoan);
loanRouter.get("/:loanId/status=approved", markAsApproved);

>>>>>>> 8399e3a94b1ba10c322566691970d34a52619f99
module.exports = loanRouter;
