const express = require("express");
const saleOrderRouter = express();
const {
  createSaleOrder,
  getAllSaleOrders,
  getSaleOrder,
  updateSaleOrder,
  deleteSaleOrder,
} = require("./../controllers/saleOrderController");

const { stockOut } = require("./../controllers/stockController");

saleOrderRouter.route("/").post(createSaleOrder).get(getAllSaleOrders);
saleOrderRouter
  .route("/:saleOrderId")
  .get(getSaleOrder)
  .patch(updateSaleOrder)
  .delete(deleteSaleOrder);

saleOrderRouter.get("/:saleOrderId/status=delivered", stockOut);
module.exports = saleOrderRouter;
