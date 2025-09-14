// const mongoose = require("mongoose");
// const purchaseOrderSchema = new mongoose.Schema({
//   supplierId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Supplier",
//     required: [true, "Purchase order must be associated with a supplier"],
//   },
//   organizationId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: [true, "Purchase order must belong to an organization"],
//     ref: "Organization",
//   },
//   products: [
//     {
//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: [true, "Product ID is required"],
//       },
//     },
//   ],
// });
