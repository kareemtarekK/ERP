const express = require("express");
const customerRouter = express.Router({
  mergeParams: true,
});
const {
  getAllCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  softDelete,
  createCustomer,
  addOrganization,
} = require("./../controllers/customerController");
customerRouter.route("/").get(getAllCustomers).post(createCustomer);
customerRouter
  .route("/:customerId")
  .get(getCustomer)
  .patch(updateCustomer)
  .delete(deleteCustomer);

customerRouter.route("/softDelete/:customerId").patch(softDelete);

customerRouter.route("/:customerId/:organizationId").patch(addOrganization);

module.exports = customerRouter;
