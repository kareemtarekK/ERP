const express = require("express");
const {
  createTrip,
  getAlltrips,
  getTrip,
  updateTrip,
  deleteTrip,
  completeTrip,
} = require("./../controllers/tripController");
const tripRouter = express.Router();

tripRouter.route("/").post(createTrip).get(getAlltrips);
tripRouter.route("/:tripId").get(getTrip).patch(updateTrip).delete(deleteTrip);

tripRouter.patch("/:tripId/trip/complete", completeTrip);

module.exports = tripRouter;
