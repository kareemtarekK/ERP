const express = require("express");
const upload = require("./../controllers/upload.js");
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
} = require("./../controllers/stockController.js");
const inventoryRouter = express.Router();

inventoryRouter
  .route("/")
  .post(upload.single("avatar"), createInventory)
  .get(getAllInventories);

inventoryRouter
  .route("/:inventoryId")
  .get(getInventory)
  .patch(updateInventory)
  .delete(deleteInventory);
inventoryRouter.get("/:inventoryId/stocks/:stockId", getStock);
inventoryRouter.post("/:inventoryId/stock/", addStockToInventory);

module.exports = inventoryRouter;
