const express = require("express");
const upload = require("./../controllers/upload");
const {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require("./../controllers/employeeController");

const router = express();

router
  .route("/")
  .post(upload.single("avatar"), createEmployee)
  .get(getAllEmployees);

router
  .route("/:employeeId")
  .patch(updateEmployee)
  .get(getEmployee)
  .delete(deleteEmployee);

module.exports = router;
