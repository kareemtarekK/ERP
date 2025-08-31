const express = require("express");
const { register, getAllUsers } = require("../controllers/userController");
const { protect } = require("../authentications/authController");
const router = express.Router();
router.post("/register", register);
router.get("/", protect, getAllUsers);

module.exports = router;
