const express = require("express");
const { createMobileStock } = require("./../controllers/mobileStockController");
const router = express.Router();

router.route("/").post(createMobileStock);

module.exports = router;
