const mongoose = require("mongoose");
const tripInvoiceSchema = new mongoose.Schema({
  saleOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SaleOrderInTrip",
  },
});

const TripInvoice = mongoose.model("TripInvoice", tripInvoiceSchema);

module.exports = TripInvoice;
