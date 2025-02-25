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
    priceId: {
      type: String,
      require: true,
    },
    stripeProductId: {
      type: String,
      require: true,
    },
    currency: {
      type: String,
      require: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const ProductModel = new mongoose.model("product", productSchema);
