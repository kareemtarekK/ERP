const express = require("express");
const stockTransferRouter = express.Router();
const {
  createStockTransfer,
  getAllStockTransfer,
  updateStockTransfer,
} = require("./../controllers/stockTransferController");
stockTransferRouter
  .route("/")
  .post(createStockTransfer)
  .get(getAllStockTransfer);
stockTransferRouter.patch("/:stockTransferId", updateStockTransfer);
module.exports = stockTransferRouter;
