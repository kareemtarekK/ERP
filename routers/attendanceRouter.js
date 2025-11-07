const express = require("express");

const {
  getDailyAttendence,
  getMonthlyAttendance,
  getAllAttendances,
  getAllAttendancesAtDay,
  checkIn,
  checkOut,
} = require("./../controllers/attendanceController");
const router = express.Router();
router.get("/", getAllAttendances);
router.get("/day/:day", getAllAttendancesAtDay);
router.route("/today").get(getDailyAttendence);
router.route("/month").get(getMonthlyAttendance);
router.route("/:attendanceId/check-in").patch(checkIn);
router.route("/:attendanceId/check-out").patch(checkOut);
module.exports = router;
