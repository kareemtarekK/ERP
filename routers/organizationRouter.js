const express = require("express");
const organizationRouter = express.Router();
const {
  createOrganization,
  getOrganization,
  updateOrganization,
  deleteOrganization,
} = require("../controllers/organizationController");
const customerRouter = require("./customerRouter");
organizationRouter.route("/").post(createOrganization);
organizationRouter
  .route("/:organizationId")
  .get(getOrganization)
  .patch(updateOrganization)
  .delete(deleteOrganization);
organizationRouter.use("/addCustomer/:organizationId", customerRouter);
module.exports = organizationRouter;
