const express = require("express");
const saleOrderRouter = express();
const {
  createSaleOrder,
  getAllSaleOrders,
  getSaleOrder,
  updateSaleOrder,
  deleteSaleOrder,
  getAllDraftedSaleOrders,
  updatedSaleOrderIntoApproved,
  getAllApprovedSaleOrders,
  getAllDelivered,
} = require("./../controllers/saleOrderController");

const { stockOut } = require("./../controllers/stockController");

saleOrderRouter.get("/status=draft", getAllDraftedSaleOrders);
saleOrderRouter.get(
  "/:saleOrderId/status=approved",
  updatedSaleOrderIntoApproved
);
saleOrderRouter.get("/status=approved", getAllApprovedSaleOrders);
saleOrderRouter.get("/:saleOrderId/status=delivered", stockOut);
// router.patch("/:saleOrderId/status=delivered", checkDeliveredQuantity, stockIn);

saleOrderRouter.get("/status=delivered", getAllDelivered);

saleOrderRouter.route("/").post(createSaleOrder).get(getAllSaleOrders);
saleOrderRouter
  .route("/:saleOrderId")
  .get(getSaleOrder)
  .patch(updateSaleOrder)
  .delete(deleteSaleOrder);

module.exports = saleOrderRouter;
