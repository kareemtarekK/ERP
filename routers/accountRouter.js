// const express = require("express");
// const {
//   createAccount,
//   getAllAccounts,
//   deleteAccount,
// } = require("./../controllers/accountController");
// const accountRouter = express();
// accountRouter.route("/").get(getAllAccounts).post(createAccount);

// accountRouter.route("/:accountId").delete(deleteAccount);
// module.exports = accountRouter;
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
