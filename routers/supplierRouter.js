const express = require("express");
const {
  createSupplier,
  getAllSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
  softDeleteSupplier,
  getOrganizationSuppliers,
  addOrganization,
} = require("./../controllers/supplierController");
const supplierRouter = express.Router();

supplierRouter.route("/").post(createSupplier).get(getAllSuppliers);

supplierRouter
  .route("/:supplierId")
  .get(getSupplier)
  .patch(updateSupplier)
  .delete(deleteSupplier);

supplierRouter.patch("/softDelete/:supplierId", softDeleteSupplier);

supplierRouter.get("/:organizationId/allSuppliers", getOrganizationSuppliers);
supplierRouter.route("/:supplierId/:organizationId").patch(addOrganization);

module.exports = supplierRouter;
