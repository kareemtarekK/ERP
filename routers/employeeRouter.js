const express = require("express");
const {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require("./../controllers/employeeController");

const router = express();

router.route("/").post(createEmployee).get(getAllEmployees);

router
  .route("/:employeeId")
  .patch(updateEmployee)
  .get(getEmployee)
  .delete(deleteEmployee);

module.exports = router;
