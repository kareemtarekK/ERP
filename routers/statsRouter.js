const express = require("express");
const statsRouter = express.Router();
const { getAllStats } = require("./../controllers/statsController.js");

statsRouter.get("/", getAllStats);

module.exports = statsRouter;
