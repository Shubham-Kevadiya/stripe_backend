import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
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
    stripePriceForOneTime: [
      {
        stripePriceId: { type: String, require: true },
        interval: {
          type: String,
          enum: ["week", "month", "year"],
          require: true,
        },
        price: { type: Number, require: true },
      },
    ],
    stripePriceForRecurring: [
      {
        stripePriceId: { type: String, require: true },
        interval: {
          type: String,
          enum: ["week", "month", "year"],
          require: true,
        },
        price: { type: Number, require: true },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export const ProductModel = new mongoose.model("product", productSchema);
