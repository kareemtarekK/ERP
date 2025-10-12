const express = require("express");
const router = express.Router();
const {
  login,
  forgetPassword,
  verifiedCode,
  resetPassword,
} = require("../authentications/authController");

router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifiedPassword", verifiedCode);
router.patch("/resetPassword", resetPassword);

module.exports = router;
