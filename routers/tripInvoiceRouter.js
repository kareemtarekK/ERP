const express = require("express");
const {
  createTripInvoice,
  getAllTripInvioces,
} = require("./../controllers/tripInvoiceController");
const tripInvoiceRouter = express.Router();

tripInvoiceRouter.get("/", getAllTripInvioces);
tripInvoiceRouter.post("/:saleOrderId", getAllTripInvioces);

module.exports = tripInvoiceRouter;
