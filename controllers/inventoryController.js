const Inventory = require("../models/inventory");
const AppError = require("./../utils/appError.js");

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
