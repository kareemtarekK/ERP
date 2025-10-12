const express = require("express");
const stockRouter = express.Router();
const {
  updateStock,
  deleteStock,
} = require("./../controllers/stockController.js");
stockRouter.route("/:stockId").patch(updateStock).delete(deleteStock);
module.exports = stockRouter;
