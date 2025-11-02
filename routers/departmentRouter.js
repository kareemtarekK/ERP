const express = require("express");
const {
  createDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} = require("./../controllers/departmentController");

const router = express();

router.route("/").post(createDepartment).get(getAllDepartments);

router
  .route("/:departmentId")
  .patch(updateDepartment)
  .get(getDepartment)
  .delete(deleteDepartment);

module.exports = router;
