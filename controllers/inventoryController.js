const Inventory = require("../models/inventoryModel.js");
const AppError = require("./../utils/appError.js");
const catchAsync = require("./../utils/catchAsync");
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

// update inventory
exports.updateInventory = catchAsync(async (req, res, next) => {
  const { inventoryId } = req.params;
  const inventory = await Inventory.findById(inventoryId);
  if (!inventory)
    return next(new AppError("there is no inventory found on system", 404));
  const updatedInventory = await Inventory.findByIdAndUpdate(
    inventoryId,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      updatedInventory,
    },
  });
});

// get inventory
exports.getInventory = catchAsync(async (req, res, next) => {
  const { inventoryId } = req.params;
  const inventory = await Inventory.findById(inventoryId);
  if (!inventory)
    return next(new AppError("there is no inventory found on system", 404));
  res.status(200).json({
    status: "success",
    data: {
      inventory,
    },
  });
});

// delete inventory
exports.deleteInventory = catchAsync(async (req, res, next) => {
  const { inventoryId } = req.params;
  await Inventory.findByIdAndDelete(inventoryId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
