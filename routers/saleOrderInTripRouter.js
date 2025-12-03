const express = require("express");
const {
  createSaleOrderInTrip,
  getAllSaleOrderInTrip,
  getSaleOrderInTrip,
} = require("./../controllers/saleOrderInTripController");

const saleOrderInTripRouter = express.Router();

saleOrderInTripRouter.get("/", getAllSaleOrderInTrip);
saleOrderInTripRouter.post("/:tripId", createSaleOrderInTrip);

saleOrderInTripRouter.route("/:saleId").get(getSaleOrderInTrip);

module.exports = saleOrderInTripRouter;
