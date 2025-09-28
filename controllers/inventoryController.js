const catchAsync = require("./../utils/catchAsync");
const Inventory = require("./../models/inventoryModel");
// create inventory
exports.createInventory = catchAsync(async (req, res, next) => {
  const newInventory = await Inventory.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newInventory,
    },
  });
});
// get all inventories
exports.getAllInventories = catchAsync(async (req, res, next) => {
  const inventories = await Inventory.find();
  res.status(200).json({
    status: "success",
    result: inventories.length,
    data: {
      inventories,
    },
  });
});
