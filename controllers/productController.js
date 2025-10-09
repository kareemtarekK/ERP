const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Product = require("../models/productModel.js");
exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});
exports.getProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) return next(new AppError("Please provide product id", 500));
  const product = await Product.findById(productId);
  if (!product) return next(new AppError("Np product found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});
exports.updateProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) return next(new AppError("Please provide product id", 500));
  const product = await Product.findByIdAndUpdate(productId, req.body, {
    runValidators: true,
    new: true,
  });
  if (!product) return next(new AppError("No product found with that ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      updatedProduct: product,
    },
  });
});
exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) return next(new AppError("Please provide product id", 500));
  await Product.findByIdAndDelete(productId);
  res.status(204).json({
    status: "success",
    content: null,
  });
});
// search for product
exports.searchProduct = catchAsync(async (req, res, next) => {
  const { name } = req.query;
  const products = await Product.find({
    name: { $regex: name, $options: "i" },
  });
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

// all products for category
exports.allProductsForCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  if (!categoryId) return next(new AppError("Please provide category id", 500));
  const products = await Product.find({ category: categoryId }).select("-__v");
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});
