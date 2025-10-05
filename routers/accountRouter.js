const express = require("express");
const accountRouter = express.Router();
const {
  getAllAccounts,
  createAccount,
  deleteAccount,
} = require("./../controllers/accountController");
accountRouter.route("/").get(getAllAccounts).post(createAccount);
accountRouter.delete("/:accountId", deleteAccount);
module.exports = accountRouter;
