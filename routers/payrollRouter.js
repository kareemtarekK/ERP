const express = require("express");
const {
  getAllPayrolls,
  updatePayroll,
  payEmployeePayroll,
} = require("./../controllers/payrollController");
const router = express();

router.route("/").get(getAllPayrolls);
router.route("/:payrollId").patch(updatePayroll);

router.patch("/:payrollId/pay", payEmployeePayroll);

module.exports = router;
