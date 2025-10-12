const Category = require("./../models/categoryModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
// create category
exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
});
// get all categories
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "success",
    results: categories.length,
    data: {
      categories,
    },
  });
});
// get a specific category
exports.getCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  if (!categoryId) return next(new AppError("Please provide id", 500));
  const category = await Category.findById(categoryId);
  if (!category)
    return next(new AppError("No category found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});
//update category
exports.updateCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  if (!categoryId) return next(new AppError("Please provide id", 500));
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedCategory)
    return next(new AppError("No category found with that id", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatedCategory,
    },
  });
});
//delete category
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  if (!categoryId) return next(new AppError("Please provide id", 500));
  await Category.findByIdAndDelete(categoryId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
