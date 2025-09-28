const express = require("express");
const {
  createInventory,
  getAllInventories,
  getInventory,
  updateInventory,
  deleteInventory,
} = require("./../controllers/inventoryController.js");
const {
  addStockToInventory,
  getStock,
} = require("./../controllers/stockControlller.js");
const inventoryRouter = express.Router();

inventoryRouter.route("/").post(createInventory).get(getAllInventories);

inventoryRouter
  .route("/:inventoryId")
  .get(getInventory)
  .patch(updateInventory)
  .delete(deleteInventory);
inventoryRouter
  .route("/:inventoryId/stock")
  .post(addStockToInventory)
  .get(getStock);

module.exports = inventoryRouter;
