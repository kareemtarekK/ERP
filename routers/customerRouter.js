const express = require("express");
const customerRouter = express.Router();
const {
  getAllCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("./../controllers/customerController");
customerRouter.route("/").get(getAllCustomers).post(createCustomer);
customerRouter
  .route("/")
  .get(getCustomer)
  .patch(updateCustomer)
  .delete(deleteCustomer);
module.exports = customerRouter;
