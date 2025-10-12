const mongoose = require("mongoose");
const jornalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "jornal name id required"],
      trim: true,
    },
    jornalType: {
      type: String,
      required: [true, "jornal type is required"],
    },
    code: {
      type: String,
      require: [true, "jornal code is required"],
    },
  },
  { timestamps: true }
);
const Jornal = mongoose.model("Jornal", jornalSchema);
module.exports = Jornal;
