const express = require("express");
const {
  createInventory,
  getAllInventory,
  getInventory,
  updateInventory,
  deleteInventory,
} = require("./../controllers/inventoryController.js");
const inventoryRouter = express.Router();

inventoryRouter.route("/").post(createInventory).get(getAllInventories);

inventoryRouter
  .route("/:inventoryId")
  .get(getInventory)
  .patch(updateInventory)
  .delete(deleteInventory);

module.exports = inventoryRouter;
