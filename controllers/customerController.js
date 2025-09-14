const Customer = require("./../models/customerModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

//create customer
exports.createCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.create({
    ...req.body,
    organizationId: [req.params.organizationId],
  });
  res.status(201).json({
    status: "success",
    data: {
      customer,
    },
  });
});
//get all customers
exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const customers = await Customer.find({ isDeleted: false });

  res.status(200).json({
    status: "success",
    result: customers.length,
    data: {
      customers,
    },
  });
});
// get a customer
exports.getCustomer = catchAsync(async (req, res, next) => {
  const { customerId } = req.params;
  if (!customerId) return next(new AppError("Please provide id", 500));
  const customer = await Customer.findOne({
    _id: customerId,
    isDeleted: false,
  });
  if (!customer)
    return next(new AppError("No customer found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      customer,
    },
  });
});
// update customer
exports.updateCustomer = catchAsync(async (req, res, next) => {
  const { customerId } = req.params;
  if (!customerId) return next(new AppError("Please provide id", 500));
  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedCustomer)
    return next(new AppError("No customer found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatedCustomer,
    },
  });
});
// delete customer
exports.deleteCustomer = catchAsync(async (req, res, next) => {
  const { customerId } = req.params;
  if (!customerId) return next(new AppError("Please provide id", 500));
  await Customer.findByIdAndDelete(customerId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.softDelete = catchAsync(async (req, res, next) => {
  const { customerId } = req.params;
  if (!customerId) return next(new AppError("Please provide id", 500));
  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    {
      isDeleted: true,
    },
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      updatedCustomer,
    },
  });
});

// add another organization to customer
exports.addOrganization = catchAsync(async (req, res, next) => {
  const { customerId, organizationId } = req.params;
  if (!customerId || !organizationId)
    return next(new AppError("provide customerId and organizationId"));
  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    {
      $addToSet: { organizationId: req.params.organizationId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: {
      updatedCustomer,
    },
  });
});
