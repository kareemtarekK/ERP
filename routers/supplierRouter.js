const express = require("express");
const {
  createSupplier,
  getAllSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
  softDeleteSupplier,
  getOrganizationSuppliers,
} = require("./../controllers/supplierController");
const supplierRouter = express.Router();

supplierRouter.route("/").post(createSupplier).get(getAllSuppliers);

supplierRouter
  .route("/:supplierId")
  .get(getSupplier)
  .patch(updateSupplier)
  .delete(deleteSupplier);

supplierRouter.patch("/softDelete/:supplierId", softDeleteSupplier);

supplierRouter.get("/:organizationId/suppliers", getOrganizationSuppliers);

module.exports = supplierRouter;
