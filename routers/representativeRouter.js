const express = require("express");
const {
  createRepresentative,
  getAllRepresentative,
  getRepresentative,
  updateRepresentative,
  deleteRepresentative,
} = require("./../controllers/representativeController");
const representativeRouter = express.Router();

representativeRouter
  .route("/")
  .post(createRepresentative)
  .get(getAllRepresentative);

representativeRouter
  .route("/:representativeId")
  .get(getRepresentative)
  .patch(updateRepresentative)
  .delete(deleteRepresentative);

module.exports = representativeRouter;
