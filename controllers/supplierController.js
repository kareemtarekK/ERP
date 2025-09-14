const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Supplier = require("./../models/supplierModel");

// create new supplier
exports.createSupplier = catchAsync(async (req, res, next) => {
  const newSupplier = await Supplier.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      newSupplier,
    },
  });
});

// all suppliers
exports.getAllSuppliers = catchAsync(async (req, res, next) => {
  const suppliers = await Supplier.find({ isDeleted: false });
  if (!suppliers) return next(new AppError("No suppliers found", 404));
  res.status(200).json({
    status: "success",
    result: suppliers.length,
    data: {
      suppliers,
    },
  });
});

// get supplier
exports.getSupplier = catchAsync(async (req, res, next) => {
  const supplier = await Supplier.findOne({
    _id: req.params.supplierId,
    isDeleted: false,
  }).populate("organizationId");
  if (!supplier)
    return next(new AppError("No supplier found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      supplier,
    },
  });
});

// update supplier
exports.updateSupplier = catchAsync(async (req, res, next) => {
  const updatedSupplier = await Supplier.findByIdAndUpdate(
    req.params.supplierId,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  if (!updatedSupplier)
    return next(new AppError("No supplier found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatedSupplier,
    },
  });
});

// hard delete supplier
exports.deleteSupplier = catchAsync(async (req, res, next) => {
  await Supplier.findByIdAndDelete(req.params.supplierId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// soft delete supplier
exports.softDeleteSupplier = catchAsync(async (req, res, next) => {
  const deletedSupplier = await Supplier.findByIdAndUpdate(
    req.params.supplierId,
    {
      isDeleted: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success deleted ✅",
    data: deletedSupplier,
  });
});

// get all suppliers for specific organization
exports.getOrganizationSuppliers = catchAsync(async (req, res, next) => {
  const { organizationId } = req.params;
  const suppliers = await Supplier.find({
    organizationId: { $in: [organizationId] },
  });
  if (!suppliers)
    return next(new AppError("No suppliers found for this organization", 404));
  res.status(200).json({
    status: "success",
    data: {
      suppliers,
    },
  });
});
// add another organization to supplier
exports.addOrganization = catchAsync(async (req, res, next) => {
  const { supplierId, organizationId } = req.params;
  if (!supplierId || !organizationId)
    return next(new AppError("provide supplierId and organizationId"));
  const updatedSupplier = await Supplier.findByIdAndUpdate(
    supplierId,
    {
      $addToSet: { organizationId: req.params.organizationId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: {
      updatedSupplier,
    },
  });
});
