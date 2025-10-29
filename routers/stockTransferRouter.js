const express = require("express");
const stockTransferRouter = express.Router();
const {
  createStockTransfer,
  getAllStockTransfer,
  updateStockTransfer,
  getAllDraftTransferOrder,
  getAllShippingTransferOrder,
  getAllDeliveredTransferOrder,
  changeDraftStatusIntoShipping,
  changeShippingStatusIntoDelivered,
  getDocument,
} = require("./../controllers/stockTransferController");

stockTransferRouter.get("/status=draft", getAllDraftTransferOrder);
stockTransferRouter.patch(
  "/:transferOrderId/shipping",
  changeDraftStatusIntoShipping
);
stockTransferRouter.get("/status=shippng", getAllShippingTransferOrder);
stockTransferRouter.patch(
  "/:transferOrderId/delivered",
  changeShippingStatusIntoDelivered
);
stockTransferRouter.get("/status=delivered", getAllDeliveredTransferOrder);
stockTransferRouter.get("/status=delivered/:transferOrderId", getDocument);

stockTransferRouter
  .route("/")
  .post(createStockTransfer)
  .get(getAllStockTransfer);
stockTransferRouter.patch("/:stockTransferId", updateStockTransfer);
module.exports = stockTransferRouter;
