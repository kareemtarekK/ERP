const express = require("express");
const {
  getAllPayrolls,
  updatePayroll,
} = require("./../controllers/payrollController");
const router = express();

router.route("/").get(getAllPayrolls);
router.route("/:payrollId").patch(updatePayroll);

module.exports = router;
