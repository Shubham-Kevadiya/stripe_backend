import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    price_id: {
      type: String,
      require: true,
    },
    product_id: {
      type: String,
      require: true,
    },
    currency: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const ProductModel = new mongoose.model("product", productSchema);
