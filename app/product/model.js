const mongoose = require("mongoose");

let productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Nama Game Harus Diisi"],
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
    price: {
      type: Number,
      default: 0,
    },
    thumbnial: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
